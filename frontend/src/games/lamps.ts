export const LAMP_N = 5

const NEIGHBORS: Array<[number, number]> = [
  [0, 0],
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
]

export function emptyLamps() {
  return Array.from({ length: LAMP_N }, () => Array<boolean>(LAMP_N).fill(false))
}

export function lit(grid: boolean[][]) {
  return grid.some((row) => row.some(Boolean))
}

export function toggle(grid: boolean[][], x: number, y: number) {
  const next = grid.map((row) => row.slice())
  for (const [dx, dy] of NEIGHBORS) {
    const nx = x + dx
    const ny = y + dy
    if (nx < 0 || ny < 0 || nx >= LAMP_N || ny >= LAMP_N) continue
    next[ny][nx] = !next[ny][nx]
  }
  return next
}

export function deal() {
  let grid = emptyLamps()
  const presses: Array<[number, number]> = []
  for (let y = 0; y < LAMP_N; y += 1) {
    for (let x = 0; x < LAMP_N; x += 1) {
      if (Math.random() < 0.45) presses.push([x, y])
    }
  }
  if (!presses.length) presses.push([2, 2])
  for (const [x, y] of presses) grid = toggle(grid, x, y)
  if (!lit(grid)) grid = toggle(grid, 2, 2)
  return grid
}
