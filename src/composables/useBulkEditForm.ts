import { useI18n } from 'vue-i18n'

import { BulkEdit } from '@/constants/bulkEdit'
import { useTasksStore } from '@/stores/tasksStore'
import { BulkEditProps } from '@/types/BulkEditProps'

export function useBulkEditForm() {
  const { t } = useI18n()
  const { projectView, removeTaskProject, renameTaskProject, removeTaskTag, renameTaskTag } =
    useTasksStore()

  const getBulkEditFormProps = (type: BulkEdit, name: string): BulkEditProps => {
    switch (type) {
      case BulkEdit.project:
        return getProjectFormProps(name)
      case BulkEdit.tag:
        return getTagFormProps(name)
      default:
        throw new Error(`Unsupported bulk edit type: ${type}`)
    }
  }

  const getProjectFormProps = (name: string): BulkEditProps => {
    return {
      name: name,
      canSelectScope: false,
      title: t('spendingBulkEditForm.projectTitle'),
      nameLabel: t('spendingBulkEditForm.projectName'),
      deleteDialogTitle: t('dialogs.deleteProjectTitle'),
      deleteDialogContentText: t('dialogs.deleteProjectContent', { name }),
      deleteDialogSuccessMessage: t('dialogs.deleteProjectSuccess', { name }),
      renameSuccessText: t('spendingBulkEditForm.projectNameChangeSuccess', {
        oldName: name,
      }),
      renameErrorText: t('spendingBulkEditForm.projectNameChangeError', {
        name,
      }),
      nameInputTooltip: t('spendingBulkEditForm.projectNameEditTooltip'),
      removeTaskBulk: (_acrossAllProjects: boolean) => removeTaskProject(name),
      renameTaskProperty: (newName: string, _acrossAllProjects: boolean) =>
        renameTaskProject(name, newName),
    }
  }

  const getTagFormProps = (name: string): BulkEditProps => {
    return {
      name: name,
      canSelectScope: !!projectView,
      title: t('spendingBulkEditForm.tagTitle'),
      nameLabel: t('spendingBulkEditForm.tagName'),
      deleteDialogTitle: t('dialogs.deleteTagTitle'),
      deleteDialogContentText: t('dialogs.deleteTagContent', { name }),
      deleteDialogSuccessMessage: t('dialogs.deleteTagSuccess', { name }),
      renameSuccessText: t('spendingBulkEditForm.tagNameChangeSuccess', { oldName: name }),
      renameErrorText: t('spendingBulkEditForm.tagNameChangeError', { name }),
      nameInputTooltip: t('spendingBulkEditForm.tagNameEditTooltip'),
      removeTaskBulk: (acrossAllProjects: boolean) => removeTaskTag(name, acrossAllProjects),
      renameTaskProperty: (newName: string, acrossAllProjects: boolean) =>
        renameTaskTag(name, newName, acrossAllProjects),
    }
  }

  return {
    getBulkEditFormProps,
  }
}
