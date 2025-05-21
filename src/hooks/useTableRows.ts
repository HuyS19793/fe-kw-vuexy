// hooks/useTableRows.ts
import { useState, useEffect } from 'react'

export function useTableRows<T>(initialData: T[]) {
  // *** STATE ***
  const [rows, setRows] = useState<T[]>(initialData)
  const [rowSelected, setRowSelected] = useState<T | null>(null)

  // *** EFFECT ***
  useEffect(() => {
    // Deep copy to avoid reference issues
    setRows(JSON.parse(JSON.stringify(initialData)))
  }, [initialData])

  const resetRows = () => {
    setRows(JSON.parse(JSON.stringify(initialData)))
  }

  const isDataChanged = JSON.stringify(initialData) !== JSON.stringify(rows)

  return {
    rows,
    setRows,
    rowSelected,
    setRowSelected,
    resetRows,
    isDataChanged
  }
}
