'use client'

import { NewAccountSheet } from '@/features/accounts/components/new-accounts-sheet'
import { useEffect, useState } from 'react'

export const SheetProvider = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <>
      <NewAccountSheet />
    </>
  )
}
