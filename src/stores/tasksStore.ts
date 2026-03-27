import { defineStore } from 'pinia'

import { computed, ref, watch } from 'vue'

import { Priority } from '@/constants/taskPriority'
import { State } from '@/constants/taskState'
import { useSettingsStore } from '@/stores/settingsStore'
import { Task } from '@/types/Task'
import { loadTasks, saveTasks } from '@/utils/taskStorage'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const originalTasks = ref<Task[]>([])
  const isLoading = ref(false)
  const settingsStore = useSettingsStore()

  // App view state - null means no filtering by project
  const projectView = ref<string | null>(null)

  const setProjectViewSettings = (project: string | null): void => {
    const newSettings = { ...settingsStore.settings, defaultProjectView: project }
    settingsStore.save(newSettings)
  }

  // Initialize the default project view from settings, when settings are loaded
  watch(
    () => settingsStore.isLoading,
    () => {
      // Default project does not exist anymore
      if (
        settingsStore.settings.defaultProjectView !== null &&
        !projects.value.includes(settingsStore.settings.defaultProjectView)
      ) {
        projectView.value = null
        setProjectViewSettings(null)
        return
      }

      projectView.value = settingsStore.settings.defaultProjectView
    },
  )

  // Track changes
  const newTaskIds = ref<Set<string>>(new Set())
  const editedTaskIds = ref<Set<string>>(new Set())
  const deletedTasks = ref<Task[]>([])

  const pendingChanges = computed(() => {
    const current = JSON.stringify(
      tasks.value.map((s) => ({ ...s })).sort((a, b) => a.id.localeCompare(b.id)),
    )
    const original = JSON.stringify(
      originalTasks.value.map((s) => ({ ...s })).sort((a, b) => a.id.localeCompare(b.id)),
    )
    return current !== original
  })

  const tasksInProjectView = computed(() => {
    if (projectView.value) return tasks.value.filter((s) => s.project === projectView.value)

    return tasks.value
  })

  async function load(): Promise<boolean> {
    isLoading.value = true
    try {
      const loadedData = await loadTasks()
      tasks.value = loadedData
      originalTasks.value = [...loadedData]
      // Clear tracking on fresh load
      newTaskIds.value.clear()
      editedTaskIds.value.clear()
      deletedTasks.value = []
      return true
    } catch (error) {
      console.error('Failed to load tasks:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function save(): Promise<void> {
    isLoading.value = true
    try {
      await saveTasks(tasks.value)
      originalTasks.value = [...tasks.value]
    } catch (error) {
      console.error('Failed to save tasks:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  function addTask(task: Task): void {
    tasks.value.push(task)
    newTaskIds.value.add(task.id)
    void save()
  }

  function removeTask(id: string): void {
    const index = tasks.value.findIndex((s) => s.id === id)
    if (index !== -1) {
      const task = tasks.value[index]
      deletedTasks.value.push(task)
      tasks.value.splice(index, 1)
      // Remove from new/edited tracking if present
      newTaskIds.value.delete(id)
      editedTaskIds.value.delete(id)
      void save()
    }
  }

  function removeTaskProject(project: string): void {
    const toDelete = tasks.value.filter((s) => s.project === project)
    for (const task of toDelete) removeTask(task.id)

    // Switch the view if currently viewing the deleted project
    if (projectView.value === project) projectView.value = null

    // Update settings if default project view was the deleted project
    if (settingsStore.settings.defaultProjectView === project) setProjectViewSettings(null)
  }

  function renameTaskProject(oldProject: string, newProject: string): void {
    for (const task of tasks.value)
      if (task.project === oldProject) {
        const updatedTask = { ...task, project: newProject }
        updateTask(task.id, updatedTask)
      }

    // Switch the view if currently viewing the renamed project
    if (projectView.value === oldProject) projectView.value = newProject

    // Update settings if default project view was the renamed project
    if (settingsStore.settings.defaultProjectView === oldProject) setProjectViewSettings(newProject)
  }

  function removeTaskTag(tag: string, acrossAllProjects: boolean): void {
    for (const task of tasks.value)
      if (
        task.tags &&
        task.tags.includes(tag) &&
        (acrossAllProjects || projectView.value === null || task.project === projectView.value)
      ) {
        const updatedTags = task.tags.filter((t) => t !== tag)
        const updatedTask = { ...task, tags: updatedTags }
        updateTask(task.id, updatedTask)
      }
  }

  function renameTaskTag(oldTag: string, newTag: string, acrossAllProjects: boolean): void {
    for (const task of tasks.value)
      if (
        task.tags &&
        task.tags.includes(oldTag) &&
        (acrossAllProjects || projectView.value === null || task.project === projectView.value)
      ) {
        const updatedTags = task.tags.map((t) => (t === oldTag ? newTag : t))
        const updatedTask = { ...task, tags: updatedTags }
        updateTask(task.id, updatedTask)
      }
  }

  function restoreTask(id: string): void {
    const index = deletedTasks.value.findIndex((s) => s.id === id)
    if (index !== -1) {
      const task = deletedTasks.value[index]
      tasks.value.push(task)
      deletedTasks.value.splice(index, 1)
      void save()
    }
  }

  function restoreAllDeletedTasks(): void {
    tasks.value.push(...deletedTasks.value)
    console.log('Restoring all deleted tasks:', deletedTasks.value)
    deletedTasks.value = []
    void save()
  }

  function updateTask(id: string, updatedTask: Task): void {
    const index = tasks.value.findIndex((s) => s.id === id)
    if (index < 0) return

    tasks.value[index] = updatedTask
    // Track as edited only if not already new
    if (!newTaskIds.value.has(id)) editedTaskIds.value.add(id)
    void save()
  }

  function discardChanges(): void {
    tasks.value = [...originalTasks.value]
    deletedTasks.value = []
    newTaskIds.value.clear()
    editedTaskIds.value.clear()
  }

  // Computed: distinct projects
  const projects = computed(() => {
    if (tasks.value.length === 0) return []

    const countMap = new Map<string, number>()
    for (const s of tasks.value)
      if (s.project) countMap.set(s.project, (countMap.get(s.project) || 0) + 1)

    return Array.from(countMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([project]) => project)
  })

  const priorities = computed(() => Object.values(Priority) as number[])
  const states = computed(() => Object.values(State) as string[])

  const tableGroups = computed(() => {
    if (tasksInProjectView.value.length === 0) return []

    const countMap = new Map<string, number>()
    for (const s of tasksInProjectView.value)
      if (s.tableGroup) countMap.set(s.tableGroup, (countMap.get(s.tableGroup) || 0) + 1)

    return Array.from(countMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([tableGroup]) => tableGroup)
  })

  // Computed: distinct tags
  const tags = computed(() => {
    if (tasksInProjectView.value.length === 0) return []

    const countMap = new Map<string, number>()
    for (const s of tasksInProjectView.value)
      if (s.tags && s.tags.length > 0)
        for (const tag of s.tags) countMap.set(tag, (countMap.get(tag) || 0) + 1)

    return Array.from(countMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag)
  })

  // Unfiltered tasks for global statistics
  const allTasks = computed(() => tasks.value)

  return {
    projectView,
    tasks: tasksInProjectView,
    allTasks,
    pendingChanges,
    isLoading,
    load,
    save,
    addTask,
    removeTask,
    updateTask,
    restoreTask,
    restoreAllDeletedTasks,
    removeTaskProject,
    renameTaskProject,
    removeTaskTag,
    renameTaskTag,
    discardChanges,
    projects,
    priorities,
    states,
    tableGroups,
    tags,
    newTaskIds,
    editedTaskIds,
    deletedTasks,
  }
})
