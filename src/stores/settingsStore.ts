import { loadSettings, saveSettings } from '@utils/settingsStorage'
import { defineStore } from 'pinia'

import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { DEFAULT_SETTINGS } from '@/constants/defaultSettings'
import { Settings } from '@/types/Settings'

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<Settings>(DEFAULT_SETTINGS)
  const isLoading = ref(true)
  const { locale } = useI18n()

  async function load(): Promise<void> {
    isLoading.value = true

    try {
      const loadedSettings = await loadSettings()
      settings.value = loadedSettings
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      isLoading.value = false
    }
  }

  async function save(newSettings: Settings): Promise<boolean> {
    try {
      await saveSettings(newSettings)
      settings.value = newSettings
      return true
    } catch (error) {
      console.error('Failed to save settings:', error)
      return false
    }
  }

  watch(
    () => settings.value.languageCode,
    (newLanguage) => {
      locale.value = newLanguage
    },
    { immediate: true },
  )

  return {
    settings,
    isLoading,
    load,
    save,
  }
})
