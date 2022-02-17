import { Component, h } from 'vue'
import { RouterLink } from 'vue-router'
import { NIcon } from 'naive-ui'

function createMenuOptions(
  data: Array<{ path: string; name: string; icon: Component }>
) {
  return data.map((item) => {
    return {
      label: () =>
        h(
          RouterLink,
          { to: { path: item.path } },
          { default: () => item.name }
        ),
      key: item.path,
      icon: () => h(NIcon, null, { default: () => h(item.icon) }),
    }
  })
}

export { createMenuOptions }
