/** 暂存登记主表库房多选 ↔ Mock 字段 storeroomName（顿号拼接） */

export function formatStoreroomLabels(names: string[]): string | undefined {
  const clean = names.map((n) => n.trim()).filter(Boolean)
  return clean.length > 0 ? clean.join("、") : undefined
}

export function parseStoreroomLabels(
  storeroomName: string | undefined,
  resolveNameToId: (name: string) => string | undefined,
): string[] {
  if (!storeroomName?.trim()) return []
  return storeroomName
    .split(/[、,]/)
    .map((part) => part.trim())
    .map((name) => resolveNameToId(name))
    .filter((id): id is string => Boolean(id))
}
