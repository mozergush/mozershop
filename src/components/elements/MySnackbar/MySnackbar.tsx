'use client'
import * as React from 'react'
import { useSnackbar } from '@/context/snackbar'
import { Snackbar } from '@mui/material'

export default function MySnackbar() {
  const { snackbarOpen, snackbarContent, handleSnackbarClose } = useSnackbar()
  return (
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={3500}
      onClose={handleSnackbarClose}
    >
      {snackbarContent}
    </Snackbar>
  )
}
