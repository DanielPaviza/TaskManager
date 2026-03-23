import { invoke } from '@tauri-apps/api/core'

import { Settings } from '@/types/Settings'
import { createSettings } from '@/utils/settingsFactory'

export async function loadSettings(): Promise<Settings> {
  const jsonData = await invoke<string>('load_settings')
  return parseSettings(jsonData)
}

export function parseSettings(jsonData: string): Settings {
  try {
    const parsedSettings: Settings = JSON.parse(jsonData)
    return createSettings(parsedSettings)
  } catch (error) {
    console.error('Failed to parse settings:', error)
    throw error
  }
}

/**
 * Saves settings data to the backend
 * @param settings - Settings object to save
 * @returns Promise that resolves when save is complete
 */
export async function saveSettings(settings: Settings): Promise<void> {
  try {
    const jsonData = JSON.stringify(settings)
    await invoke('save_settings', { jsonData })
  } catch (error) {
    console.error('Failed to save settings:', error)
    throw error
  }
}
