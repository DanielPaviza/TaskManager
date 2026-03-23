import {
  DocumentOutline,
  DocumentTextOutline,
  ImageOutline,
  VideocamOutline,
} from '@vicons/ionicons5'

import { exists } from '@tauri-apps/plugin-fs'

import { Component } from 'vue'

import { DOCUMENT_EXTENSIONS, IMAGE_EXTENSIONS, VIDEO_EXTENSIONS } from '@/constants/fileExtensions'

// Generate a Blob URL from a File object
export async function getFileBlobUrl(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const blob = new Blob([buffer], { type: file.type })
  return URL.createObjectURL(blob)
}

// Get file extension from a file path
export function getFileExtension(path: string): string {
  const parts = path.split('.')
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : ''
}

// Get file name without extension from a full file name
export function getFileName(nameWithExtension: string): string {
  const parts = nameWithExtension.split('.')
  return parts.length > 1 ? parts.slice(0, -1).join('.') : nameWithExtension
}

// Check if a file is an image based on its extension
export function isImageFile(extension: string): boolean {
  return IMAGE_EXTENSIONS.includes(extension)
}

// Check if a file is a document based on its extension
export function isDocumentFile(extension: string): boolean {
  return DOCUMENT_EXTENSIONS.includes(extension)
}

// Check if a file is a video based on its extension
export function isVideoFile(extension: string): boolean {
  return VIDEO_EXTENSIONS.includes(extension)
}

// Get the appropriate icon component for a file based on its type
export function getFileIcon(extension: string): Component {
  if (isImageFile(extension)) return ImageOutline
  if (isDocumentFile(extension)) return DocumentTextOutline
  if (isVideoFile(extension)) return VideocamOutline
  return DocumentOutline
}

export function isBlobDocumentPath(path: string): boolean {
  return path.startsWith('blob:')
}

export function resolveFsPath(path: string): string | null {
  if (isBlobDocumentPath(path)) return null
  try {
    const url = new URL(path)
    const decodedPath = decodeURIComponent(url.pathname)
    if (decodedPath.startsWith('/') && decodedPath[2] === ':') return decodedPath.slice(1)

    return decodedPath
  } catch (error) {
    // If it is not a URL, assume it is already a valid path
    console.error('Failed to parse document path', error)
    return path
  }
}

export async function checkDocumentAvailability(path: string | null): Promise<boolean> {
  if (!path) return false

  if (isBlobDocumentPath(path)) return true

  const fsPath = resolveFsPath(path)
  if (!fsPath) return false

  try {
    return await exists(fsPath)
  } catch (error) {
    console.error('Failed to verify document existence', error)
    return false
  }
}

export function triggerBlobDownload(blob: Blob, fileName: string): void {
  try {
    const url = URL.createObjectURL(blob)
    const anchor = window.document.createElement('a')
    anchor.href = url
    anchor.download = fileName
    anchor.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Failed to trigger blob download', error)
    throw error
  }
}
