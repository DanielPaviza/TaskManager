export const BulkEdit = {
  project: 'project',
  tag: 'tag',
} as const

export type BulkEdit = (typeof BulkEdit)[keyof typeof BulkEdit]
