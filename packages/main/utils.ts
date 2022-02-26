import { ipcMain } from 'electron'

export function handleUtils() {
  ipcMain.handle('isProblemUpToDate', () => {
    return true
  })

  ipcMain.handle('cacheProblem', () => {
    return 'success'
  })

  ipcMain.handle('judgeProblem', () => {
    return 'pseudo judge result'
  })
}
