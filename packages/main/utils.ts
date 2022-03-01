import { join, basename } from 'path'
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
      const answerPath = join(dataPath, 'ans_' + problemID)
      const output = await open(outputPath, 'w')
      const input = await open(join(dataPath, 'in_' + problemID), 'r')
      // compile and run
      switch (language) {
        case 'C': {
          const gcc = await spawn('gcc', [srcFilePath, '-o', execPath], {})
          if (gcc.code != 0) return 'CE'
          const run = await spawn(execPath, [], {
            stdio: [input, output, 'pipe'],
          })
          if (run.code != 0) return 'REG'
          break
        }
        case 'C++': {
          const gcc = await spawn('g++', [srcFilePath, '-o', execPath], {})
          if (gcc.code != 0) return 'CE'
          const run = await spawn(execPath, [], {
            stdio: [input, output, 'pipe'],
          })
          if (run.code != 0) return 'REG'
          break
        }
        case 'Golang': {
          const go = await spawn('go', ['run', srcFilePath], {
            stdio: [input, output, 'pipe'],
          })
          if (go.code != 0) return 'REG'
          break
        }
        case 'JavaScript': {
          const node = await spawn('node', [srcFilePath], {
            stdio: [input, output, 'pipe'],
          })
          if (node.code != 0) return 'REG'
          break
        }
        case 'Python': {
          const python = await spawn('python', [srcFilePath], {
            stdio: [input, output, 'pipe'],
          })
          if (python.code != 0) return 'REG'
          break
        }
        case 'Java': {
          const javac = await spawn('javac', [srcFilePath, '-d', tmpPath], {})
          if (javac.code != 0) return 'CE'
          const run = await spawn(
            'java',
            ['-classpath', tmpPath, basename(srcFilePath, '.java')],
            { stdio: [input, output, 'pipe'] }
          )
          if (run.code != 0) return 'REG'
          break
        }
      }
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
