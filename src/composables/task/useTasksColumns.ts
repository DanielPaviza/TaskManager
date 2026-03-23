import { Ref, ref } from 'vue'
import { h, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { formatDateLocalized } from '@/composables/useDateFormat'
import { useTasksStore } from '@/stores/tasksStore'
import { TaskColumn } from '@/types/TaskColumn'
import { truncateText } from '@/utils/formatUtils'

export function useTasksColumns(): { columns: Ref<TaskColumn[]> } {
  const { t, locale } = useI18n()
  const tasksStore = useTasksStore()
  const columns = ref<TaskColumn[]>(getColumns())

  // Trigger re-computation of columns when locale changes
  watch(
    () => locale.value,
    () => {
      columns.value = getColumns()
    },
  )
  // Trigger re-computation of columns when project view changes
  watch(
    () => tasksStore.projectView,
    () => {
      columns.value = getColumns()
    },
  )

  function getColumns(): TaskColumn[] {
    const cols: TaskColumn[] = [
      {
        title: t('columns.project'),
        key: 'project',
        isHidden: false,
        filterEnabled: true,
        selectFilterEnabled: true,
        tooltip: null,
        sortFn: (a, b) => a.project.localeCompare(b.project),
        filterVal: (row) => row.project,
        render: (row) => row.project,
      },
      {
        title: t('columns.name'),
        key: 'name',
        isHidden: false,
        filterEnabled: true,
        selectFilterEnabled: false,
        tooltip: null,
        sortFn: (a, b) => a.name.localeCompare(b.name),
        filterVal: (row) => row.name,
        render: (row) => truncateText(row.name, 40),
      },
      {
        title: t('columns.createdAt'),
        key: 'createdAt',
        isHidden: false,
        filterEnabled: true,
        selectFilterEnabled: false,
        tooltip: null,
        sortFn: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        filterVal: (row) => formatDateLocalized(new Date(row.createdAt)),
        render: (row) =>
          h(
            'div',
            { style: { 'font-size': '14px', color: '#666' } },
            formatDateLocalized(new Date(row.createdAt)),
          ),
      },
      {
        title: t('columns.tags'),
        key: 'tags',
        isHidden: false,
        filterEnabled: true,
        selectFilterEnabled: false,
        tooltip: null,
        sortFn: (a, b) => (a.tags?.join(',') || '').localeCompare(b.tags?.join(',') || ''),
        filterVal: (row) => row.tags?.join(', ') || '',
        render: (row) =>
          row.tags && row.tags.length > 0
            ? h(
                'div',
                { style: { display: 'flex', gap: '4px', 'flex-wrap': 'wrap' } },
                row.tags.map((tag: string) =>
                  h(
                    'span',
                    {
                      style: {
                        padding: '2px 8px',
                        'border-radius': '12px',
                        'background-color': '#e0f2fe',
                        color: '#0369a1',
                        'font-size': '12px',
                        'font-weight': '500',
                      },
                    },
                    tag,
                  ),
                ),
              )
            : '-',
      },
    ]

    // Dont hide project column when in all-projects view
    if (tasksStore.projectView === null) return cols

    return cols.filter((col) => col.key !== 'project')
  }

  return {
    columns,
  }
}
