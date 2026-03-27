export const Priority = {
  p1: 1,
  p2: 2,
  p3: 3,
} as const

export type Priority = (typeof Priority)[keyof typeof Priority]
