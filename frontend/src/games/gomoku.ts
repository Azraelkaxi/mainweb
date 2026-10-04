export const SIZE = 15

export type Cell = 0 | 1 | 2
export type Board = Cell[][]
export type Point = [number, number]

const DIRS: Point[] = [
  [1, 0],
  [0, 1],
  [1, 1],
  [1, -1],
]

export function emptyBoard(): Board {
  return Array.from({ length: SIZE }, () => Array<Cell>(SIZE).fill(0))
}

function inside(x: number, y: number) {
  return x >= 0 && y >= 0 && x < SIZE && y < SIZE
}

export function winner(board: Board): Cell {
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      const player = board[y][x]
      if (!player) continue
      for (const [dx, dy] of DIRS) {
        const prevX = x - dx
        const prevY = y - dy
        if (inside(prevX, prevY) && board[prevY][prevX] === player) continue
        let count = 0
        let cx = x
        let cy = y
        while (inside(cx, cy) && board[cy][cx] === player) {
          count += 1
          cx += dx
          cy += dy
        }
        if (count >= 5) return player
      }
    }
  }
  return 0
}

export function hasEmpty(board: Board) {
  return board.some((row) => row.includes(0))
}

function ray(board: Board, x: number, y: number, dx: number, dy: number, player: Cell) {
  let count = 0
  let cx = x + dx
  let cy = y + dy
  while (inside(cx, cy) && board[cy][cx] === player) {
    count += 1
    cx += dx
    cy += dy
  }
  return { count, open: inside(cx, cy) && board[cy][cx] === 0 }
}

function shape(count: number, openA: boolean, openB: boolean) {
  const ends = Number(openA) + Number(openB)
  if (count >= 5) return 100000
  if (count === 4 && ends === 2) return 12000
  if (count === 4 && ends === 1) return 2800
  if (count === 3 && ends === 2) return 1400
  if (count === 3 && ends === 1) return 220
  if (count === 2 && ends === 2) return 140
  if (count === 2 && ends === 1) return 24
  if (count === 1 && ends === 2) return 8
  return 0
}

function scoreAt(board: Board, x: number, y: number, player: Exclude<Cell, 0>) {
  let total = 0
  for (const [dx, dy] of DIRS) {
    const forward = ray(board, x, y, dx, dy, player)
    const back = ray(board, x, y, -dx, -dy, player)
    total += shape(forward.count + back.count + 1, forward.open, back.open)
  }
  return total
}

function candidates(board: Board): Point[] {
  const found = new Set<string>()
  let any = false
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      if (!board[y][x]) continue
      any = true
      for (let dy = -2; dy <= 2; dy += 1) {
        for (let dx = -2; dx <= 2; dx += 1) {
          const nx = x + dx
          const ny = y + dy
          if (!inside(nx, ny) || board[ny][nx]) continue
          found.add(`${nx},${ny}`)
        }
      }
    }
  }
  if (!any) return [[7, 7]]
  return [...found].map((key) => key.split(',').map(Number) as Point)
}

export function bestMove(source: Board, player: Exclude<Cell, 0>): Point | null {
  const board = source.map((row) => row.slice())
  const foe: Exclude<Cell, 0> = player === 1 ? 2 : 1
  const cells = candidates(board)
  for (const [x, y] of cells) {
    board[y][x] = player
    const win = winner(board) === player
    board[y][x] = 0
    if (win) return [x, y]
  }

  let best = -Infinity
  const picks: Point[] = []
  for (const [x, y] of cells) {
    const attack = scoreAt(board, x, y, player)
    const defend = scoreAt(board, x, y, foe)
    const score = attack + defend * 1.12 - (Math.abs(x - 7) + Math.abs(y - 7)) * 0.4
    if (score > best + 0.01) {
      best = score
      picks.length = 0
      picks.push([x, y])
    } else if (Math.abs(score - best) <= 0.01) {
      picks.push([x, y])
    }
  }
  if (!picks.length) return null
  return picks[Math.floor(Math.random() * picks.length)]
}

export function place(board: Board, x: number, y: number, player: Exclude<Cell, 0>): Board {
  const next = board.map((row) => row.slice())
  next[y][x] = player
  return next
}
