import {
  iterationRecords,
  type IterationRecordEntry,
} from "../data/menu-iteration-records"
import type { PermissionRecord } from "../data/permission-records"

function entryMatchesPlatform(entry: IterationRecordEntry, record: PermissionRecord) {
  if (entry.platform === "双端") return true
  if (entry.platform === "PC") return record.platform === "PC"
  if (entry.platform === "移动") return record.platform === "移动"
  return false
}

function entryMatchesRecord(entry: IterationRecordEntry, record: PermissionRecord): boolean {
  if (!entryMatchesPlatform(entry, record)) return false

  const title = record.pagePathSegments[record.pagePathSegments.length - 1] ?? ""
  const tokens = record.pagePathSegments.filter((seg) => seg.length >= 2)
  const corpus = `${entry.title} ${entry.before} ${entry.after} ${entry.note}`
  const pathJoined = record.pagePathSegments.join("/")
  const pathSpaced = record.pagePath

  if (title && (entry.title === title || entry.title.includes(title) || title.includes(entry.title))) {
    return true
  }
  if (pathJoined && (corpus.includes(pathJoined) || corpus.includes(pathSpaced))) {
    return true
  }

  const hitCount = tokens.filter((seg) => corpus.includes(seg)).length
  if (tokens.length <= 1) return hitCount >= 1
  return hitCount >= 2
}

export function getIterationChangesForPermission(record: PermissionRecord): IterationRecordEntry[] {
  return iterationRecords.filter((entry) => entryMatchesRecord(entry, record))
}

export function formatIterationSummary(entries: IterationRecordEntry[]): string {
  if (entries.length === 0) return ""
  return entries
    .map((e) => `[${e.version}] ${e.type} · ${e.title}${e.note ? `：${e.note}` : ""}`)
    .join("\n")
}
