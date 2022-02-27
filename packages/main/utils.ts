import { ipcMain, app } from 'electron'
import MarkdownIt from 'markdown-it'
import latex from 'markdown-it-texmath'
import prism from 'markdown-it-prism'
import path from 'path'
import { spawn } from 'child_process'

const markdown = new MarkdownIt().use(latex).use(prism)
const configPath = app.getPath('userData')
const tmpPath = app.getPath('temp')
const dataPath = path.join(app.getAppPath(), 'data')

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

  ipcMain.handle('judgeProblem', (event, srcFilePath, problemID, language) => {
    const inputPath = path.join(dataPath, 'in_' + problemID)
    const answerPath = path.join(dataPath, 'ans_' + problemID)
    // compile and run
    switch (language) {
      case 'C':
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
    console.log('compare output and ans')
    // return result
    return 'pseudo judge result'
  })
}
