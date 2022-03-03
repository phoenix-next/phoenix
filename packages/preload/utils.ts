import { ipcRenderer } from 'electron'

export default {
  markdownToHTML(markdown: string) {
    return ipcRenderer.invoke('markdownToHTML', markdown)
  },
  isProblemUpToDate(problemID: number) {
    return ipcRenderer.invoke('isProblemUpToDate', problemID)
  },
  downloadProblem(
    problemID: string,
    input: string,
    output: string,
    description: string
  ) {
    return ipcRenderer.invoke('downloadProblem', ...arguments)
  },
  judgeProblem(srcFilePath: string, problemID: string, language: string) {
    return ipcRenderer.invoke('judgeProblem', srcFilePath, problemID, language)
  },
  download(url: string, savePath: string, isBackend: boolean = true) {
    return ipcRenderer.invoke('download', url, savePath, isBackend)
  }
}
