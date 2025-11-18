/**
 * Форматирует секунды в формат MM:SS
 * @param seconds - количество секунд
 * @returns строка в формате MM:SS
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

