import { useMemo, useState, useEffect, useRef, useCallback } from 'react'

export function usePagination<T>(items: T[], itemsPerPage: number) {
  const [page, setPage] = useState(0)
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage))

  useEffect(() => {
    if (page >= totalPages) setPage(0)
  }, [totalPages, page])

  const pageItems = useMemo(
    () => items.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage),
    [items, page, itemsPerPage]
  )

  return { page, setPage, pageItems, totalPages }
}

/**
 * Wheel handler that pages through a paginated grid instead of letting the
 * scroll bubble up to flip the full-screen desktop panel. At the first/last
 * page it lets the event propagate so panel navigation still works.
 */
export function usePaginationWheel(page: number, totalPages: number, setPage: (p: number) => void) {
  const lockedRef = useRef(false)

  const onWheel = useCallback((e: React.WheelEvent) => {
    if (totalPages <= 1) return
    // Trackpad horizontal swipes (deltaX-dominant) are panel-navigation gestures —
    // never intercept those, only a vertical wheel/scroll should page through the grid.
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
    const delta = e.deltaY
    if (Math.abs(delta) < 10) return

    const goingNext = delta > 0
    const goingPrev = delta < 0
    const canGoNext = goingNext && page < totalPages - 1
    const canGoPrev = goingPrev && page > 0
    if (!canGoNext && !canGoPrev) return // at boundary — let it bubble to flip panels

    e.stopPropagation()
    if (lockedRef.current) return
    lockedRef.current = true
    setPage(page + (goingNext ? 1 : -1))
    setTimeout(() => { lockedRef.current = false }, 550)
  }, [page, totalPages, setPage])

  return onWheel
}
