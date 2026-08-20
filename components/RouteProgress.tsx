'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

/**
 * A slim bar that runs across the top of the page while the next route loads.
 *
 * Next.js gives no navigation-start event for <Link>, so we listen for the click that
 * starts a same-origin navigation and finish when the pathname actually changes.
 */
export default function RouteProgress() {
  const pathname = usePathname()
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(true)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  function clearTimers() {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return
      }
      const link = (e.target as HTMLElement | null)?.closest('a')
      if (!link) return

      const href = link.getAttribute('href')
      if (!href || link.target === '_blank' || link.hasAttribute('download')) return

      // only in-app navigations to a different path
      let url: URL
      try {
        url = new URL(href, window.location.href)
      } catch {
        return
      }
      if (url.origin !== window.location.origin) return
      if (url.pathname === window.location.pathname) return

      clearTimers()
      setDone(false)
      setProgress(12)
      // creep forward so the bar always feels alive, never reaching 100 on its own
      timers.current.push(setTimeout(() => setProgress(45), 120))
      timers.current.push(setTimeout(() => setProgress(70), 380))
      timers.current.push(setTimeout(() => setProgress(88), 900))
    }

    document.addEventListener('click', onClick, { capture: true })
    return () => {
      document.removeEventListener('click', onClick, { capture: true })
      clearTimers()
    }
  }, [])

  // the new route rendered — snap to full, then fade out
  useEffect(() => {
    clearTimers()
    setProgress(100)
    const t = setTimeout(() => {
      setDone(true)
      setProgress(0)
    }, 320)
    return () => clearTimeout(t)
  }, [pathname])

  if (done && progress === 0) return null

  return (
    <div className={`route-progress${done ? ' done' : ''}`} aria-hidden="true">
      <span style={{ ['--p' as string]: `${progress}%` }} />
    </div>
  )
}
