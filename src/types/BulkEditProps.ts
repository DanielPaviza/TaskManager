export interface BulkEditProps {
  name: string
  canSelectScope: boolean
  title: string
  nameLabel: string
  deleteDialogTitle: string
  deleteDialogContentText: string
  deleteDialogSuccessMessage: string
  renameSuccessText: string
  renameErrorText: string
  nameInputTooltip: string
  removeTaskBulk: (isAllProjects: boolean) => void
  renameTaskProperty: (newName: string, isAllProjects: boolean) => void
}
