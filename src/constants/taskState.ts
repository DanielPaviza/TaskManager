export const State = {
  todo: 'todo',
  doing: 'doing',
  done: 'done',
} as const

export type State = (typeof State)[keyof typeof State]
