'use client'
import * as React from 'react'
import { Box } from '@mui/system'
import { CircularProgress } from '@mui/material'

export default function Loader() {
  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          top: '0',
          left: '0',
          height: '100%',
          width: '100%',
          zIndex: '10',
          background: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        className={'form-spinner'}
      >
        <CircularProgress />
      </Box>
    </>
  )
}
