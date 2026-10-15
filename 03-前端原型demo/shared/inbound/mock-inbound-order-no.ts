/** 演示用 19 位入库单号：YYYYMMDDHHmmss + 5 位随机尾号（与 PRD / 台账样例一致） */
export function generateMockInboundOrderNo(now: Date = new Date()): string {
  const pad = (n: number, len = 2) => String(n).padStart(len, "0")
  const stamp =
    `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}` +
    `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
  const suffix = String(Math.floor(Math.random() * 100000)).padStart(5, "0")
  return `${stamp}${suffix}`.slice(0, 19)
}
