/**
 * 原型用确定性二维码占位图案：由业务编号哈希生成 21×21 模块，
 * 仅用于页面观感与标注演示，不承载真实扫码跳转。
 */
export function buildReceiptQrCells(value: string): boolean[][] {
  const size = 21
  const grid: boolean[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => false),
  )

  let seed = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    seed ^= value.charCodeAt(i)
    seed = Math.imul(seed, 16777619)
  }
  const random = () => {
    seed ^= seed << 13
    seed ^= seed >>> 17
    seed ^= seed << 5
    return ((seed >>> 0) % 1000) / 1000
  }

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      grid[y][x] = random() > 0.52
    }
  }

  const drawFinder = (ox: number, oy: number) => {
    for (let y = 0; y < 7; y += 1) {
      for (let x = 0; x < 7; x += 1) {
        const edge = x === 0 || y === 0 || x === 6 || y === 6
        const core = x >= 2 && x <= 4 && y >= 2 && y <= 4
        grid[oy + y][ox + x] = edge || core
      }
    }
  }

  drawFinder(0, 0)
  drawFinder(size - 7, 0)
  drawFinder(0, size - 7)

  return grid
}
