import { join } from 'path'
import { open, close, readFile } from 'fs-extra'
import { ipcMain, app } from 'electron'
import MarkdownIt from 'markdown-it'
import latex from 'markdown-it-texmath'
import prism from 'markdown-it-prism'
import { diffWords } from 'diff'
import spawn from '@npmcli/promise-spawn'

const markdown = new MarkdownIt().use(latex).use(prism)
const configPath = app.getPath('userData')
const tmpPath = app.getPath('temp')
const dataPath = join(configPath, 'data')

export function handleUtils() {
  ipcMain.handle('markdownToHTML', (event, text) => {
    return markdown.render(text)
  })

  ipcMain.handle('isProblemUpToDate', (event, problemID) => {
    return true
  })

  ipcMain.handle('cacheProblem', (event, problem) => {
    return 'success'
  })

  ipcMain.handle(
    'judgeProblem',
    async (
      event,
      srcFilePath: string,
      problemID: string,
      language: string
    ): Promise<'CE' | 'WA' | 'AC' | 'REG' | 'SystemError'> => {
      const execPath = join(tmpPath, 'exec_' + problemID)
      const outputPath = join(tmpPath, 'out_' + problemID)
      const inputPath = join(dataPath, 'in_' + problemID)
      const answerPath = join(dataPath, 'ans_' + problemID)
      // compile and run
      switch (language) {
        case 'C': {
          // compile
          const gcc = await spawn('gcc', [srcFilePath, '-o', execPath], {})
          if (gcc.code != 0) return 'CE'
          // run
          const input = await open(inputPath, 'r')
          const output = await open(outputPath, 'w')
          const run = await spawn(execPath, [], {
            stdio: [input, output, 'pipe'],
          })
          if (run.code != 0) return 'REG'
          close(input)
          close(output)
          break
        }
        case 'C++': {
          // compile
          const gcc = await spawn('g++', [srcFilePath, '-o', execPath], {})
          if (gcc.code != 0) return 'CE'
          // run
          const input = await open(inputPath, 'r')
          const output = await open(outputPath, 'w')
          const run = await spawn(execPath, [], {
            stdio: [input, output, 'pipe'],
          })
          if (run.code != 0) return 'REG'
          close(input)
          close(output)
          break
        }
        case 'Golang':
          break
        case 'JavaScript':
          break
        case 'Python':
          break
        case 'Java':
          break
      }
      // compare output and answer
      const ansStr = await readFile(answerPath, 'utf8')
      const outStr = await readFile(outputPath, 'utf8')
      const change = diffWords(ansStr, outStr)
      // if (
      //   !change ||
      //   change.length !== 1 ||
      //   change[0].added ||
      //   change[0].removed
      // ) {
      //   console.log('diff\n')
      // } else {
      //   console.log('same\n')
      // }
      return !change ||
        change.length !== 1 ||
        change[0].added ||
        change[0].removed
        ? 'WA'
        : 'AC'
    }
  )
}
