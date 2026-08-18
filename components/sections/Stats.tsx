'use client'

import { useEffect, useRef, useState } from 'react'
import type { Stat } from '@/lib/types'

export default function Stats({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [run, setRun] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      setRun(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRun(true)
          io.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  if (!stats.length) return null

  return (
    <section className="stats">
      <div className="container reveal-stagger" ref={ref}>
        {stats.map((s) => (
          <div className="stat-item" key={s.id}>
            <span className="num">
              <Counter target={s.value} run={run} />
              {s.suffix}
            </span>
            <span className="label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function Counter({ target, run }: { target: number; run: boolean }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!run) return
    if (target === 0) {
      setValue(0)
      return
    }
    let frame = 0
    const duration = 1400
    let start: number | null = null

    const step = (ts: number) => {
      if (start === null) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [run, target])

  return <>{value.toLocaleString('en-IN')}</>
}
