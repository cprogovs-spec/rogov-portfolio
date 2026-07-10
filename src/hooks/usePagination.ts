import { useMemo, useState, useEffect } from 'react'

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
