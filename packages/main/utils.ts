import { join, basename } from 'path'
import { open, close, readFile, ensureDir, outputFile } from 'fs-extra'
import { ipcMain, app } from 'electron'
import MarkdownIt from 'markdown-it'
import latex from 'markdown-it-texmath'
import { diffWords } from 'diff'
import spawn from '@npmcli/promise-spawn' // 源码位于https://github.com/npm/promise-spawn/blob/main/index.js
import { DownloaderHelper } from 'node-downloader-helper'

const markdown = new MarkdownIt().use(latex)
const configPath = app.getPath('userData')
const tmpPath = app.getPath('temp')
const dataPath = join(configPath, 'data')
const remote = 'https://phoenix.matrix53.top/api/v1/'

// 获取题面、输入、输出的本地存储位置，以及临时程序、临时输出文件的本地存储位置
function getProblemPath(problemID: string) {
  return {
    description: join(dataPath, 'des_' + problemID),
    answer: join(dataPath, 'ans_' + problemID),
    exec: join(tmpPath, 'exec_' + problemID),
    input: join(dataPath, 'in_' + problemID),
    output: join(tmpPath, 'out_' + problemID),
    temp: join(tmpPath, 'temp_' + problemID)
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

  ipcMain.handle(
    'judgeProblem',
    async (event, srcFilePath, problemID, language) => {
      const problem = getProblemPath(problemID)
      // 设置程序的输入文件和输出文件
      const output = await open(problem.output, 'w')
      const input = await open(problem.input, 'r')
      // 编译源文件，并运行程序
      let compiler,
        runner,
        stdio = [input, output, 'ignore']
      switch (language) {
        case 'c':
          compiler = await spawn('gcc', [srcFilePath, '-o', problem.exec], {})
          if (compiler.code != 0) return 'CE'
          runner = await spawn(problem.exec, [], { stdio })
          break
        case 'cpp':
          compiler = await spawn('g++', [srcFilePath, '-o', problem.exec], {})
          if (compiler.code != 0) return 'CE'
          runner = await spawn(problem.exec, [], { stdio })
          break
        case 'java':
          compiler = await spawn('javac', [srcFilePath, '-d', tmpPath], {})
          if (compiler.code != 0) return 'CE'
          runner = await spawn(
            'java',
            ['-classpath', tmpPath, basename(srcFilePath, '.java')],
            { stdio }
          )
          break
        case 'go':
          runner = await spawn('go', ['run', srcFilePath], { stdio })
          break
        case 'javascript':
          runner = await spawn('node', [srcFilePath], { stdio })
          break
        case 'python':
          runner = await spawn('python', [srcFilePath], { stdio })
          break
      }
      if (runner.code !== 0) return 'REG'
      // 比较正确答案和实际输出的答案
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

  ipcMain.handle('runCode', async (event, code: string, language: string) => {
    const problem = getProblemPath('pseudo')
    // 将源代码输出到临时文件，并添加文件后缀
    switch (language) {
      case 'c':
        problem.temp += '.c'
        break
      case 'cpp':
        problem.temp += '.cpp'
        break
      case 'java':
        problem.temp += '.java'
        break
      case 'go':
        problem.temp += '.go'
        break
      case 'javascript':
        problem.temp += '.js'
        break
      case 'python':
        problem.temp += '.py'
        break
    }
    await outputFile(problem.temp, code)
    // 程序运行的输出文件，目前没有实现输入功能
    const output = await open(problem.output, 'w')
    // 编译临时文件，并运行程序
    let compiler,
      runner,
      stdio = ['pipe', output, 'pipe']
    switch (language) {
      case 'c':
        compiler = await spawn('gcc', [problem.temp, '-o', problem.exec])
        runner = await spawn(problem.exec, [], { stdio })
        break
      case 'cpp':
        compiler = await spawn('g++', [problem.temp, '-o', problem.exec])
        runner = await spawn(problem.exec, [], { stdio })
        break
      case 'java':
        compiler = await spawn('javac', [problem.temp, '-d', tmpPath])
        runner = await spawn(
          'java',
          ['-classpath', tmpPath, basename(problem.temp, '.java')],
          { stdio }
        )
        break
      case 'go':
        runner = await spawn('go', ['run', problem.temp], { stdio })
        break
      case 'javascript':
        runner = await spawn('node', [problem.temp], { stdio })
        break
      case 'python':
        runner = await spawn('python', [problem.temp], { stdio })
        break
    }
    // 返回标准输出的结果
    close(output)
    const outStr = await readFile(problem.output, 'utf8')
    return outStr
  })
}
