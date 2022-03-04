import { join, basename } from 'path'
import { open, close, readFile } from 'fs-extra'
import { ipcMain, app } from 'electron'
import MarkdownIt from 'markdown-it'
import latex from 'markdown-it-texmath'
import prism from 'markdown-it-prism'
import { diffWords } from 'diff'
import spawn from '@npmcli/promise-spawn'
import { DownloaderHelper } from 'node-downloader-helper'

const markdown = new MarkdownIt().use(latex).use(prism)
const configPath = app.getPath('userData')
const tmpPath = app.getPath('temp')
const dataPath = join(configPath, 'data')
const remote = 'https://phoenix.matrix53.top/api/v1/'

function download(url: string, savePath: string, saveName: string) {
  const download = new DownloaderHelper(url, savePath, { fileName: saveName })
  return new Promise((resolve, reject) => {
    download.on('end', () => {
      resolve('Download Completed')
    })
    download.on('error', () => {
      reject('Download Error')
    })
    download.start()
  })
}

export function handleUtils() {
  ipcMain.handle('markdownToHTML', (event, text) => {
    return markdown.render(text)
  })
  ipcMain.handle('download', (event, url, savePath, saveName) => {
    return download(url, savePath, saveName)
  })
  ipcMain.handle('isProblemUpToDate', (event, problemID) => {
    return true
  })
  ipcMain.handle(
    'downloadProblem',
    (event, problemID, input, output, description) => {
      return Promise.all([
        download(remote + input, dataPath, 'in_' + problemID),
        download(remote + output, dataPath, 'ans_' + problemID),
        download(remote + description, dataPath, 'des_' + problemID)
      ])
        .then((res) => {
          return readFile(join(dataPath, 'des_' + problemID), 'utf-8')
        })
        .then((res) => {
          return markdown.render(res)
        })
    }
  )
  ipcMain.handle(
    'judgeProblem',
    async (
      event,
      srcFilePath: string,
      problemID: string,
      language: string
    ): Promise<'CE' | 'WA' | 'AC' | 'REG' | 'SystemError'> => {
      // set some paths
      const execPath = join(tmpPath, 'exec_' + problemID)
      const outputPath = join(tmpPath, 'out_' + problemID)
      const answerPath = join(dataPath, 'ans_' + problemID)
      const output = await open(outputPath, 'w')
      const input = await open(join(dataPath, 'in_' + problemID), 'r')
      // compile and run
      let compiler,
        runner,
        stdio = [input, output, 'pipe']
      switch (language) {
        case 'C':
          compiler = await spawn('gcc', [srcFilePath, '-o', execPath], {})
          if (compiler.code != 0) return 'CE'
          runner = await spawn(execPath, [], { stdio })
          break
        case 'C++':
          compiler = await spawn('g++', [srcFilePath, '-o', execPath], {})
          if (compiler.code != 0) return 'CE'
          runner = await spawn(execPath, [], { stdio })
          break
        case 'Java':
          compiler = await spawn('javac', [srcFilePath, '-d', tmpPath], {})
          if (compiler.code != 0) return 'CE'
          runner = await spawn(
            'java',
            ['-classpath', tmpPath, basename(srcFilePath, '.java')],
            { stdio }
          )
          break
        case 'Golang':
          runner = await spawn('go', ['run', srcFilePath], { stdio })
          break
        case 'JavaScript':
          runner = await spawn('node', [srcFilePath], { stdio })
          break
        case 'Python':
          runner = await spawn('python', [srcFilePath], { stdio })
          break
      }
      if (runner.code != 0) return 'REG'
      // compare output and answer
      close(input)
      close(output)
      const ansStr = await readFile(answerPath, 'utf8')
      const outStr = await readFile(outputPath, 'utf8')
      const change = diffWords(ansStr, outStr)
      return !change ||
        change.length !== 1 ||
        change[0].added ||
        change[0].removed
        ? 'WA'
        : 'AC'
    }
  )
}
