import { ipcMain, app } from 'electron'
import MarkdownIt from 'markdown-it'
import latex from 'markdown-it-texmath'
import prism from 'markdown-it-prism'
import path from 'path'
import fs from 'fs-extra'
import { spawn } from 'child_process'

const markdown = new MarkdownIt().use(latex).use(prism)
const configPath = app.getPath('userData')
const tmpPath = app.getPath('temp')
const dataPath = path.join(configPath, 'data')

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
    async (event, srcFilePath, problemID, language) => {
      const execPath = path.join(tmpPath, 'exec_' + problemID)
      const outputPath = path.join(tmpPath, 'out_' + problemID)
      const inputPath = path.join(dataPath, 'in_' + problemID)
      const answerPath = path.join(dataPath, 'ans_' + problemID)
      // compile and run
      switch (language) {
        case 'C':
          const gcc = spawn('gcc', [srcFilePath, '-o', execPath])
          gcc.on('close', (code) => {
            console.log(code)
          })
          const output = await fs.open(outputPath, 'w')
          const input = await fs.open(inputPath, 'r')

          const run = spawn(execPath, [], { stdio: [input, output, 'pipe'] })
          run.on('close', (code) => {
            console.log(code)
          })
          break
        case 'C++':
          break
        case 'Golang':
          break
        case 'JavaScript':
          break
        case 'Python':
          break
        case 'Java':
          break
      }
      // compare output and ans
      const compare = spawn('fc', ['/W', outputPath, answerPath], {
        shell: true,
      })
      compare.on('close', (code) => {
        console.log(code, 'haha')
        // TODO: accept or wrong answer
      })
      // return result
      return 'pseudo judge result'
    }
  )
}
