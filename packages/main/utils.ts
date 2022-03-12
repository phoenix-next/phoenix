import { join, basename } from 'path'
import { open, close, readFile, ensureDir } from 'fs-extra'
import { ipcMain, app } from 'electron'
import MarkdownIt from 'markdown-it'
import latex from 'markdown-it-texmath'
import { diffWords } from 'diff'
import spawn from '@npmcli/promise-spawn'
import { DownloaderHelper } from 'node-downloader-helper'

const markdown = new MarkdownIt().use(latex)
const configPath = app.getPath('userData')
const tmpPath = app.getPath('temp')
const dataPath = join(configPath, 'data')
const remote = 'https://phoenix.matrix53.top/api/v1/'

// 获取题面、输入、输出的本地存储位置，以及临时程序、临时输出文件的本地存储位置
function getProblemPath(problemID: string) {
  return {
    input: join(dataPath, 'in_' + problemID),
    answer: join(dataPath, 'ans_' + problemID),
    description: join(dataPath, 'des_' + problemID),
    exec: join(tmpPath, 'exec_' + problemID),
    output: join(tmpPath, 'out_' + problemID)
  }
}

// 获取教程的本地存储位置
function getTutorialPath(tutorialID: string) {
  return {
    detail: join(dataPath, 'tutorial_' + tutorialID)
  }
}

// 下载一个文件，参数见https://www.npmjs.com/package/node-downloader-helper
function download(url: string, savePath: string, option: any) {
  const download = new DownloaderHelper(url, savePath, {
    override: true,
    ...option
  })
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

// 将在主进程中执行的函数，基本用于注册回调
export function handleUtils() {
  // 初始化保存数据的文件夹
  ensureDir(dataPath).catch((res) => {
    console.log('未知错误')
  })

  // 各个处理函数
  ipcMain.handle('markdownToHTML', (event, text) => {
    return markdown.render(text)
  })

  ipcMain.handle('download', (event, url, savePath, option) => {
    return download(url, savePath, option)
  })

  ipcMain.handle('isProblemUpToDate', (event, problemID) => {
    return true
  })

  ipcMain.handle(
    'downloadProblem',
    (event, problemID, input, output, description, token) => {
      const problem = getProblemPath(problemID)
      return Promise.all([
        download(remote + input, dataPath, {
          fileName: basename(problem.input),
          headers: { 'x-token': token }
        }),
        download(remote + output, dataPath, {
          fileName: basename(problem.answer),
          headers: { 'x-token': token }
        }),
        download(remote + description, dataPath, {
          fileName: basename(problem.description),
          headers: { 'x-token': token }
        })
      ])
        .then((res) => {
          return readFile(problem.description, 'utf-8')
        })
        .then((res) => {
          return markdown.render(res)
        })
    }
  )

  ipcMain.handle(
    'judgeProblem',
    async (event, srcFilePath, problemID, language) => {
      // set some paths
      const problem = getProblemPath(problemID)
      const output = await open(problem.output, 'w')
      const input = await open(problem.input, 'r')
      // compile and run
      let compiler,
        runner,
        stdio = [input, output, 'pipe']
      switch (language) {
        case 'C':
          compiler = await spawn('gcc', [srcFilePath, '-o', problem.exec], {})
          if (compiler.code != 0) return 'CE'
          runner = await spawn(problem.exec, [], { stdio })
          break
        case 'C++':
          compiler = await spawn('g++', [srcFilePath, '-o', problem.exec], {})
          if (compiler.code != 0) return 'CE'
          runner = await spawn(problem.exec, [], { stdio })
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
      const ansStr = await readFile(problem.answer, 'utf8')
      const outStr = await readFile(problem.output, 'utf8')
      const change = diffWords(ansStr, outStr)
      return !change ||
        change.length !== 1 ||
        change[0].added ||
        change[0].removed
        ? 'WA'
        : 'AC'
    }
  )

  ipcMain.handle('downloadTutorial', (event, tutorialID, detail, token) => {
    const tutorial = getTutorialPath(tutorialID)
    return download(remote + detail, dataPath, {
      fileName: basename(tutorial.detail),
      headers: { 'x-token': token }
    })
      .then((res) => {
        return readFile(tutorial.detail, 'utf-8')
      })
      .then((res) => {
        return markdown.render(res)
      })
  })
}
