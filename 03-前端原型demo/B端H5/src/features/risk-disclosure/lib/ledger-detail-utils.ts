const RECORD_SOURCE_WARNING: Record<string, string> = {
  "pub-h5-cw004": "cw-004",
  "pub-seed-001": "cw-003",
  "pub-seed-006": "cw-002",
}

export function resolveSourceWarningId(recordId: string): string | null {
  return RECORD_SOURCE_WARNING[recordId] ?? null
}
