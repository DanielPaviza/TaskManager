import { NIcon } from 'naive-ui'

import { type Component, type VNode, h } from 'vue'

export function renderIcon(icon: Component, color: string) {
  return (): VNode => {
    return h(
      NIcon,
      { color },
      {
        default: () => h(icon),
      },
    )
  }
}
