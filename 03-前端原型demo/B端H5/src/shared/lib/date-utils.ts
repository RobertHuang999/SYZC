export function formatDateTime(value: string | null): string {
  if (!value) {
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

export function daysBetween(start: string, end: string): number {
  const startDate = new Date(`${start}T00:00:00`)
  const endDate = new Date(`${end}T00:00:00`)
  const diff = endDate.getTime() - startDate.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1
}
