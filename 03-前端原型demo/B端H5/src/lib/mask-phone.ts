/** 手机号脱敏：保留前 3 位与后 4 位 */
export function maskPhone(phone: string) {
  const normalized = phone.replace(/\s/g, "")
  if (normalized.length < 8) return normalized
  return `${normalized.slice(0, 3)}****${normalized.slice(-4)}`
}
