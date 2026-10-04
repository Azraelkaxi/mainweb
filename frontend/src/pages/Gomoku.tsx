import { useEffect, useState } from 'react'
import { Hero, Page } from '../components'
import { bestMove, emptyBoard, hasEmpty, place, winner, type Board, type Cell } from '../games/gomoku'

type Result = 'play' | 'ink' | 'amber' | 'draw'

function statusText(result: Result, thinking: boolean) {
  if (result === 'ink') return '墨胜'
  if (result === 'amber') return '琥珀胜'
  if (result === 'draw') return '满盘'
  if (thinking) return '琥珀在想'
  return '轮到墨'
}

export function Gomoku() {
  const [board, setBoard] = useState<Board>(emptyBoard)
  const [result, setResult] = useState<Result>('play')
  const [thinking, setThinking] = useState(false)
  const [last, setLast] = useState<[number, number] | null>(null)
  const [hover, setHover] = useState<[number, number] | null>(null)

  useEffect(() => {
    if (!thinking) return
    const timer = window.setTimeout(() => {
      const move = bestMove(board, 2)
      if (!move) {
        setResult(hasEmpty(board) ? 'play' : 'draw')
        setThinking(false)
        return
      }
      const next = place(board, move[0], move[1], 2)
      const win = winner(next)
      setBoard(next)
      setLast(move)
      setThinking(false)
      if (win === 2) setResult('amber')
      else if (!hasEmpty(next)) setResult('draw')
    }, 420)
    return () => window.clearTimeout(timer)
  }, [thinking, board])

  function play(x: number, y: number) {
    if (result !== 'play' || thinking || board[y][x]) return
    const next = place(board, x, y, 1)
    const win = winner(next)
    setBoard(next)
    setLast([x, y])
    setHover(null)
    if (win === 1) {
      setResult('ink')
      return
    }
    if (!hasEmpty(next)) {
      setResult('draw')
      return
    }
    setThinking(true)
  }

  function reset() {
    setBoard(emptyBoard())
    setResult('play')
    setThinking(false)
    setLast(null)
    setHover(null)
  }

  return (
    <Page>
      <Hero eyebrow="对弈" title="五子棋" tagline="你执墨，先手。城里应琥珀。" />
      <div className="play">
        <p className="play-status" aria-live="polite">
          {statusText(result, thinking)}
        </p>
        <div className="goboard" role="grid" aria-label="五子棋棋盘">
          {board.map((row, y) =>
            row.map((cell, x) => {
              const key = `${x}-${y}`
              const ghost = hover?.[0] === x && hover?.[1] === y && !cell && result === 'play' && !thinking
              return (
                <button
                  key={key}
                  type="button"
                  className="gocell"
                  role="gridcell"
                  aria-label={labelFor(cell, x, y)}
                  disabled={result !== 'play' || thinking || cell !== 0}
                  onClick={() => play(x, y)}
                  onPointerEnter={() => setHover([x, y])}
                  onPointerLeave={() => setHover(null)}
                >
                  {cell || ghost ? (
                    <span
                      className={stoneClass(cell, ghost, last, x, y)}
                      aria-hidden="true"
                    />
                  ) : null}
                </button>
              )
            }),
          )}
        </div>
        <button className="quiet" type="button" onClick={reset}>
          重来
        </button>
      </div>
    </Page>
  )
}

function labelFor(cell: Cell, x: number, y: number) {
  const where = `${y + 1} 行 ${x + 1} 列`
  if (cell === 1) return `${where}，墨`
  if (cell === 2) return `${where}，琥珀`
  return where
}

function stoneClass(
  cell: Cell,
  ghost: boolean,
  last: [number, number] | null,
  x: number,
  y: number,
) {
  const tone = cell === 2 ? 'amber' : 'ink'
  const marks = ['stone', tone]
  if (ghost) marks.push('is-ghost')
  if (last && last[0] === x && last[1] === y) marks.push('is-last')
  return marks.join(' ')
}
