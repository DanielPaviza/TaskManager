import { invoke } from '@tauri-apps/api/core'

import { Task } from '@/types/Task'
import { createTask } from '@/utils/taskFactory'

// Read only path for development fallback when invoke fails (testing in browser)
const DEV_DB_PATH = './../src-tauri/expenseTrackerDb.json'

/**
 * Fetches task data from a local JSON file.
 * This is used as a fallback when the invoke command fails.
 * @returns Array of Task objects, or empty array if parsing fails
 */
async function fetchTasksFromFile(): Promise<Task[]> {
  try {
    const response = await fetch(DEV_DB_PATH)
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

    const jsonData = await response.text()
    return parseTasks(jsonData)
  } catch (error) {
    console.error('Failed to load tasks via fetch:', error)
    return []
  }
}

/**
 * Loads task data from the backend or falls back to a local JSON file.
 * @returns Array of Task objects, or empty array if parsing fails
 */
export async function loadTasks(): Promise<Task[]> {
  try {
    const jsonData = await invoke<string>('load_data')
    return parseTasks(jsonData)
  } catch (error) {
    // Fallback to fetching from local file in development mode
    if (import.meta.env.DEV) {
      console.error('Failed to load tasks via invoke, falling back to fetch:', error)
      return fetchTasksFromFile()
    }
    throw error
  }
}

/**
 * Parses JSON string into an array of Task objects
 * @param jsonData - JSON string containing task data
 * @returns Array of Task objects, or empty array if parsing fails
 */
export function parseTasks(jsonData: string): Task[] {
  try {
    const parsed = JSON.parse(jsonData)

    if (!Array.isArray(parsed)) {
      console.error('Parsed data is not an array')
      return []
    }

    const parsedTasks = parsed.map((item: Task) => createTask(item))
    return parsedTasks
  } catch (error) {
    console.error('Failed to parse tasks:', error)
    return []
  }
}

/**
 * Saves task data to the backend
 * @param tasks - Array of Task objects to save
 * @returns Promise that resolves when save is complete
 */
export async function saveTasks(tasks: Task[]): Promise<void> {
  try {
    const jsonData = JSON.stringify(tasks)
    await invoke('save_data', { jsonData })
  } catch (error) {
    console.error('Failed to save tasks:', error)
    throw error
  }
}
