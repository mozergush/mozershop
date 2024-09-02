'use client'
import * as React from 'react'
import Typography from '@mui/material/Typography'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Skeleton } from '@mui/material'

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1) // Исправление здесь

export default function NavBreadcrumbs({ lastName = 'none', spinner = false }) {
  const [pathnames, setPathnames] = useState<string[]>([])

  useEffect(() => {
    const handlePathnameChange = () => {
      const newPathnames = window.location.pathname
        ? window.location.pathname.split('/').filter((x) => x)
        : []

      if (lastName && lastName != 'none') {
        newPathnames[newPathnames.length - 1] = lastName
      }

      setPathnames(newPathnames)
    }

    handlePathnameChange() // Initial call to set pathnames on first render

    window.addEventListener('popstate', handlePathnameChange)
    window.addEventListener('pushstate', handlePathnameChange)
    window.addEventListener('replacestate', handlePathnameChange)

    return () => {
      window.removeEventListener('popstate', handlePathnameChange)
      window.removeEventListener('pushstate', handlePathnameChange)
      window.removeEventListener('replacestate', handlePathnameChange)
    }
  }, [lastName, spinner])

  return (
    <div role="presentation">
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/">
          Home
        </Link>
        {spinner && (
          <Skeleton variant="rounded" width="120px" height={'20px'} />
        )}

        {!spinner &&
          pathnames.map((value, index) => {
            const last = index === pathnames.length - 1
            const to = `/${pathnames.slice(0, index + 1).join('/')}`

            return last ? (
              <Typography color="text.primary" key={to}>
                {capitalize(value)}
              </Typography>
            ) : (
              <Link color="inherit" href={to} key={to}>
                {capitalize(value)}
              </Link>
            )
          })}
      </Breadcrumbs>
    </div>
  )
}
