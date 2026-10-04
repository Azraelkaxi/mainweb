export const STAR_FIELD = [
  { x: 20, y: 30 },
  { x: 40, y: 16 },
  { x: 64, y: 24 },
  { x: 82, y: 44 },
  { x: 70, y: 68 },
  { x: 46, y: 82 },
  { x: 22, y: 68 },
  { x: 30, y: 48 },
  { x: 52, y: 48 },
]

export function extendSequence(sequence: number[]) {
  const last = sequence[sequence.length - 1]
  let next = Math.floor(Math.random() * STAR_FIELD.length)
  if (sequence.length && next === last) next = (next + 3) % STAR_FIELD.length
  return [...sequence, next]
}
