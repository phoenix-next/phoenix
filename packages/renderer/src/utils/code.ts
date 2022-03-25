import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

self.MonacoEnvironment = {
  getWorker(_: any, label: any) {
    if (label === 'json') {
      return new jsonWorker()
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker()
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker()
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker()
    }
    return new editorWorker()
  }
}

export function createEditor(container: HTMLElement, language: string) {
  const div = document.createElement('div')
  div.style.height = Math.max(container.offsetHeight, 110) + 'px'
  const pre = container.parentElement as HTMLElement
  pre.removeAttribute('class')
  pre.style.borderLeft = 'solid 3px #f0f0f0'
  pre.replaceChild(div, container)
  return monaco.editor.create(div, {
    value: container.textContent as string,
    language,
    scrollBeyondLastLine: false,
    automaticLayout: true
  })
}

export function addEditorAction(editor: monaco.editor.IStandaloneCodeEditor) {
  editor.addAction({
    contextMenuGroupId: 'switch',
    label: 'Switch to C mode',
    id: 'Switch to C mode',
    run: (instance) => {
      monaco.editor.setModelLanguage(instance.getModel() as any, 'c')
    }
  })
  editor.addAction({
    contextMenuGroupId: 'switch',
    label: 'Switch to C++ mode',
    id: 'Switch to C++ mode',
    run: (instance) => {
      monaco.editor.setModelLanguage(instance.getModel() as any, 'cpp')
    }
  })
  editor.addAction({
    contextMenuGroupId: 'switch',
    label: 'Switch to Java mode',
    id: 'Switch to Java mode',
    run: (instance) => {
      monaco.editor.setModelLanguage(instance.getModel() as any, 'java')
    }
  })
  editor.addAction({
    contextMenuGroupId: 'switch',
    label: 'Switch to JavaScript mode',
    id: 'Switch to JavaScript mode',
    run: (instance) => {
      monaco.editor.setModelLanguage(instance.getModel() as any, 'javascript')
    }
  })
  editor.addAction({
    contextMenuGroupId: 'switch',
    label: 'Switch to Python mode',
    id: 'Switch to Python mode',
    run: (instance) => {
      monaco.editor.setModelLanguage(instance.getModel() as any, 'python')
    }
  })
  editor.addAction({
    contextMenuGroupId: 'code',
    label: 'Clear program output',
    id: 'Clear program output',
    run: (instance) => {
      // 获取编辑器节点的父节点
      const pre = instance.getDomNode()?.parentElement?.parentElement
      // 删除已经挂载的xterm
      if (pre?.children.length !== 1) {
        pre?.removeChild(pre.lastChild as ChildNode)
      }
    }
  })
  editor.addAction({
    contextMenuGroupId: 'code',
    label: 'Run code in editor',
    id: 'Run code in editor',
    run: (instance) => {
      window.utilsBridge
        .runCode(
          instance.getValue(),
          instance.getModel()?.getLanguageId() || ''
        )
        .then((res) => {
          // 获取编辑器节点的父节点
          const pre = instance.getDomNode()?.parentElement?.parentElement
          // 将xterm挂载父节点下，无需重复挂载
          if (pre?.children.length === 1) {
            // 创建xterm的容器
            const div = document.createElement('div')
            div.style.height = '90px'
            div.style.marginTop = '6px'
            pre?.appendChild(div)
            // 创建xterm的实例，并挂载
            const terminal = new Terminal({
              theme: {
                background: '#f0f0f0',
                foreground: '#000000',
                cursor: '#cccccc'
              }
            })
            const fitAddon = new FitAddon()
            terminal.loadAddon(fitAddon)
            ;(div as any).terminal = terminal
            // 写入最新的程序输出内容
            terminal.open(div)
            terminal.write('output:\r\n' + res)
            fitAddon.fit()
          } else {
            // 若已有xterm实例则直接写入
            const terminal = (pre?.lastChild as any).terminal as Terminal
            terminal.clear()
            terminal.write('output:\r\n' + res)
          }
        })
    }
  })
}
