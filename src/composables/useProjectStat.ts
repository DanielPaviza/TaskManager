import { storeToRefs } from 'pinia'

import { type Ref, computed } from 'vue'

import { useTasksStore } from '@/stores/tasksStore'
import type { Task } from '@/types/Task'

export interface ProjectStat {
  name: string
  count: number
  color: string
}

const PROJECT_COLORS: Record<string, string> = {
  Byt: '#3b82f6',
  Jídlo: '#22c55e',
  Auto: '#f59e0b',
  Oblečení: '#ec4899',
  Zábava: '#8b5cf6',
  Zdraví: '#ef4444',
  Vzdělání: '#06b6d4',
  Ostatní: '#6b7280',
}

function getProjectColor(project: string, index: number): string {
  if (PROJECT_COLORS[project]) return PROJECT_COLORS[project]

  // Generate a color based on index if not predefined
  const hue = (index * 137.5) % 360 // Golden angle for good distribution
  return `hsl(${hue}, 70%, 50%)`
}

export function useProjectStats(selectedProject: Ref<string | null>) {
  const store = useTasksStore()
  const { allTasks, projects } = storeToRefs(store)

  const projectStats = computed<ProjectStat[]>(() => {
    return projects.value.map((project, index) => {
      const projectItems = allTasks.value.filter((s: Task) => s.project === project)
      const count = projectItems.length

      return {
        name: project,
        count,
        color: getProjectColor(project, index),
      }
    })
  })

  // Stats for "All" project
  const allProjectsStat = computed<ProjectStat>(() => {
    const allItems = allTasks.value
    const count = allItems.length

    return {
      name: 'all',
      count,
      color: '#3b82f6',
    }
  })

  const isSelected = (projectName: string | null) => {
    return selectedProject.value === projectName
  }

  return {
    projectStats,
    allProjectsStat,
    isSelected,
  }
}
