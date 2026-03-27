export const Priority = {
  1: 1,
  2: 2,
  3: 3,
} as const

export type Priority = (typeof Priority)[keyof typeof Priority]
