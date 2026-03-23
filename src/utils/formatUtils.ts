/**
 * Formats a number with spaces as thousand separators.
 * @param num - The number to format.
 * @returns The formatted number as a string.
 */
export function formatNumberToCurrency(num: number, symbol: string): string {
  return `${Math.round(num)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${symbol}`
}

/**
 * Generate a color palette of hex colors.
 * The returned array starts with `preselected` colors (kept in order),
 * then is filled with randomly generated vibrant colors (bright, saturated) until
 * the array length equals `colorsCount`.
 *
 * @param preselected - array of hex color strings (e.g. ['#ff0000'])
 * @param colorsCount - desired total number of colors in returned array
 */
export function generateColorPalette(colorsCount: number, preselected: string[] = []): string[] {
  const result: string[] = []
  const defaultPreselectedColors = ['#06402b', '#3b82f6']

  // Push preselected valid hex colors first (up to colorsCount)
  for (let i = 0; i < preselected.length && result.length < colorsCount; i++) {
    const c = preselected[i]
    if (typeof c === 'string' && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(c)) {
      // Normalize short hex (#fff) to full (#ffffff)
      const normalized =
        c.length === 4 ? '#' + c[1] + c[1] + c[2] + c[2] + c[3] + c[3] : c.toLowerCase()

      if (!result.includes(normalized)) result.push(normalized)
    }
  }

  // Add default preselected colors after user preselected colors
  for (const color of defaultPreselectedColors)
    if (result.length < colorsCount && !result.includes(color)) result.push(color)

  // Helper: convert h,s,l to hex
  function hslToHex(h: number, s: number, l: number): string {
    s /= 100
    l /= 100
    const k = (n: number): number => (n + h / 30) % 12
    const a = s * Math.min(l, 1 - l)
    const f = (n: number): number => {
      const color = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
      return Math.round(255 * color)
    }
    const toHex = (v: number): string => v.toString(16).padStart(2, '0')
    return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`
  }

  // Generate remaining colors using evenly distributed hues with some randomness
  while (result.length < colorsCount) {
    // pick a hue distributed across 0-360, but add small random offset to avoid exact repeating
    const hue = Math.floor(Math.random() * 360)
    const saturation = 70 + Math.floor(Math.random() * 20) // 70-90%
    const lightness = 45 + Math.floor(Math.random() * 15) // 45-60%
    const hex = hslToHex(hue, saturation, lightness)
    // avoid duplicates
    if (!result.includes(hex)) result.push(hex)
  }

  return result.slice(0, colorsCount)
}

// Truncates text to a maximum length, adding "..." if truncated.
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text

  return text.slice(0, maxLength - 3) + '...'
}
