export function formatDateTime(value: string | null | undefined): string {
  if (!value || value === "—") {
    return "—"
  }

  const trimmed = value.trim()
  const [datePart, timePart] = trimmed.split(/\s+/, 2)
  if (!datePart) {
    return trimmed
  }

  const normalizedDate = /^\d{2}-\d{2}$/.test(datePart)
    ? `2026-${datePart}`
    : datePart
  const normalizedTime = timePart
    ? /^\d{2}:\d{2}$/.test(timePart)
      ? `${timePart}:00`
      : timePart
    : "00:00:00"

  if (/^\d{4}-\d{2}-\d{2}$/.test(normalizedDate) && /^\d{2}:\d{2}:\d{2}$/.test(normalizedTime)) {
    return `${normalizedDate} ${normalizedTime}`
  }

  return trimmed
}

/** 仅在极度紧凑的微型标签场景下可选使用的短日期时间格式 (MM-DD HH:mm) */
export function formatShortDateTime(value: string | null | undefined): string {
  if (!value || value === "—") {
    return "—"
  }
  const [date, time] = value.split(" ")
  if (!date || !time) {
    return value
  }
  const [, month, day] = date.split("-")
  return `${month}-${day} ${time.slice(0, 5)}`
}

export function getDefaultDateRange(days: number, endDate = "2026-08-21") {
  const end = new Date(`${endDate}T00:00:00`)
  const start = new Date(end)
  start.setDate(start.getDate() - days + 1)

  const format = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`

  return {
    start: format(start),
    end: endDate,
  }
}
