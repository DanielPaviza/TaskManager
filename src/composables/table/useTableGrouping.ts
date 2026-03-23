import { computed } from 'vue'

import type { Spending } from '@/types/Task'

export interface GroupedData {
  type: 'group' | 'item'
  tableGroup?: string
  items?: Spending[]
  item?: Spending
}

export function useTableGrouping(sortedData: () => Spending[]) {
  const groupedData = computed<GroupedData[]>(() => {
    const result: GroupedData[] = []
    const tableGroupMap = new Map<string, Spending[]>()
    const itemsWithoutTableGroup: Spending[] = []

    // Group items by tableGroup
    for (const item of sortedData())
      if (item.tableGroup && item.tableGroup.trim() !== '') {
        const subCat = item.tableGroup
        if (!tableGroupMap.has(subCat)) tableGroupMap.set(subCat, [])

        tableGroupMap.get(subCat)!.push(item)
      } else itemsWithoutTableGroup.push(item)

    // Add items without tableGroup first
    for (const item of itemsWithoutTableGroup) result.push({ type: 'item', item })

    // Add grouped items (only group if more than 1 item)
    for (const [tableGroup, items] of tableGroupMap.entries())
      if (items.length === 1)
        // Single item - render as regular row
        result.push({ type: 'item', item: items[0] })
      else
        // Multiple items - render as collapsible group
        result.push({ type: 'group', tableGroup, items })

    return result
  })

  return {
    groupedData,
  }
}
