'use client'
import { createContext, ReactElement, useContext } from 'react'
import * as React from 'react'
import { Alert, AlertColor } from '@mui/material'

interface SnackbarContextType {
  snackbarOpen: boolean
  handleSnackbarOpen: (content: string, variant?: string) => void
  snackbarContent: ReactElement
  handleSnackbarClose: () => void
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
)

export const SnackbarProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [snackbarOpen, setSnackbarOpen] = React.useState(false)
  const [snackbarContent, setSnackbarContent] = React.useState<ReactElement>(
    <Alert variant="filled" sx={{ width: '100%' }}>
      empty
    </Alert>
  )

  const handleSnackbarOpen = (content = '', variant = 'success') => {
    setSnackbarOpen(true)

    const newcontent = () => (
      <Alert
        onClose={handleSnackbarClose}
        severity={variant as AlertColor}
        // severity="error"
        // severity="info"
        variant="filled"
        sx={{ width: '100%' }}
      >
        {content}
      </Alert>
    )

    setSnackbarContent(newcontent)
  }

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbarOpen(false)
  }

  return (
    <SnackbarContext.Provider
      value={{
        snackbarOpen,
        handleSnackbarOpen,
        snackbarContent,
        handleSnackbarClose,
      }}
    >
      {children}
    </SnackbarContext.Provider>
  )
}

export const useSnackbar = () => {
  const context = useContext(SnackbarContext)
  if (!context) {
    throw new Error('useSnackbar must be used within an SnackbarProvider')
  }
  return context
}
