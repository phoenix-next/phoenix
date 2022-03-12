export function createEditor(container: HTMLElement, language: string) {
  const div = document.createElement('div')
  div.style.height = container.offsetHeight + 'px'
  container.parentNode?.replaceChild(div, container)
  return monaco.editor.create(div, {
    value: container.textContent as string,
    language,
    scrollBeyondLastLine: false,
    automaticLayout: true
  })
}

export function addEditorAction(editor: monaco.editor.IStandaloneCodeEditor) {
  // editor.addCommand()
}
