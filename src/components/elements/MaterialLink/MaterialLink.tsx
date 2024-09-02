'use client'
import * as React from 'react'
import Link from '@mui/material/Link'

export default function MaterialLink({
  children,
  onClick,
  href,
}: {
  children: React.ReactNode
  onClick?: () => void
  href?: string
}) {
  return (
    <Link onClick={onClick} href={href} className={'material-link-container'}>
      {children}
    </Link>
  )
}
