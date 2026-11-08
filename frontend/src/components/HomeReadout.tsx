import { forwardRef, useImperativeHandle } from 'react'
import { useCityClock, useStageCoord } from '../cityTime'

export type HomeReadoutHandle = {
  onPointerMove: ReturnType<typeof useStageCoord>['onPointerMove']
  onPointerLeave: ReturnType<typeof useStageCoord>['onPointerLeave']
}

export const HomeReadout = forwardRef<HomeReadoutHandle>(function HomeReadout(_, ref) {
  const clock = useCityClock()
  const { coord, onPointerMove, onPointerLeave } = useStageCoord()

  useImperativeHandle(ref, () => ({ onPointerMove, onPointerLeave }), [onPointerMove, onPointerLeave])

  return (
    <p className="home-readout">
      <span>{clock} · 理想国时间</span>
      <span>坐标 {coord}</span>
    </p>
  )
})
