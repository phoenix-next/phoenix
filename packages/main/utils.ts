import { ipcMain } from 'electron'
import MarkdownIt from 'markdown-it'
import latex from 'markdown-it-katex'

const markdown = new MarkdownIt().use(latex)

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

  ipcMain.handle('judgeProblem', (event, srcFilePath, problemID) => {
    return 'pseudo judge result'
  })
}
