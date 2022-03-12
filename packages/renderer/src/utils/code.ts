export function createEditor(container: HTMLElement, language: string) {
  const div = document.createElement('div')
  div.style.height = Math.max(container.offsetHeight, 110) + 'px'
  container.parentNode?.replaceChild(div, container)
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
    label: 'Run code in editor',
    id: 'Run code in editor',
    run: (instance) => {
      window.utilsBridge
        .runCode(
          instance.getValue(),
          instance.getModel()?.getLanguageId() || ''
        )
        .then((res) => {
          console.log(res)
        })
      console.log(instance.getDomNode())
    }
  })
}
