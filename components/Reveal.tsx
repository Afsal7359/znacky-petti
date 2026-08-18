'use client'

import { useEffect } from 'react'

const SELECTOR = '.reveal, .reveal-left, .reveal-right, .reveal-zoom, .reveal-stagger'

/**
 * Adds the `in` class to every .reveal* element as it scrolls into view.
 *
 * A MutationObserver picks up elements that mount after hydration (the cart
 * drawer, the checkout form once localStorage has been read) — without it they
 * would never be observed and would stay stuck at opacity:0.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const show = (el: HTMLElement) => el.classList.add('in')

    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll<HTMLElement>(SELECTOR).forEach(show)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    )

    const observe = (el: HTMLElement) => {
      if (el.classList.contains('in') || el.dataset.revealBound) return
      el.dataset.revealBound = '1'
      // already on screen → show immediately, no flash of invisible content
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) show(el)
      else io.observe(el)
    }

    const scan = (root: ParentNode) => {
      if (root instanceof HTMLElement && root.matches(SELECTOR)) observe(root)
      root.querySelectorAll<HTMLElement>(SELECTOR).forEach(observe)
    }

    scan(document)

    const mo = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) scan(node)
        })
      }
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])

  return null
}
