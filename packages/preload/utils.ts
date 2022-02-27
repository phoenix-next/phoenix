import { ipcRenderer } from 'electron'

export default {
  markdownToHTML(markdown: string) {
    return ipcRenderer.invoke('markdownToHTML', markdown)
  },
  isProblemUpToDate(problemID: number) {
    return ipcRenderer.invoke('isProblemUpToDate', problemID)
  },
  cacheProblem(problem: any) {
    return ipcRenderer.invoke('cacheProblem', problem)
  },
  judgeProblem(srcFilePath: string, problemID: string, language: string) {
    return ipcRenderer.invoke('judgeProblem', srcFilePath, problemID, language)
  },
}
