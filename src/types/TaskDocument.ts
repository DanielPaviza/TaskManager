export interface TaskDocument {
  name: string
  extension: string
  path: string
  file?: File // For new uploads that haven't been saved yet
}
