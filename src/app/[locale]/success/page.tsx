'use client'
import { Box } from '@mui/system'
import React, { useEffect } from 'react'
import { Button, Container } from '@mui/material'
import animationData from 'public/img/lottie4.json'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import useMediaQuery from '@mui/material/useMediaQuery'
import LottieContainer from '@/components/elements/LottieContainer'
import { useTranslations } from 'use-intl'

export default function Success() {
  const isMobile = useMediaQuery('(max-width:768px)')
  const t = useTranslations()

  useEffect(() => {
    localStorage.removeItem('cart')
  }, [])

  return (
    <main>
      <Box sx={{ paddingTop: '20px', paddingBottom: '50px' }}>
        <Container>
          <LottieContainer
            height={isMobile ? '200px' : '300px'}
            width={isMobile ? '200px' : '300px'}
            data={animationData} />

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: '20px',
            }}
          >
            <Typography
              variant={'h4'}
              sx={{ marginBottom: '20px', textAlign: 'center' }}
            >
              {t('your_order_successfully_placed')}
            </Typography>

            <Link href={'/dashboard'}>
              <Button size={'large'} variant={'contained'}>
                {t('go_to_dashboard')}
              </Button>
            </Link>
          </Box>
        </Container>
      </Box>
    </main>
  )
}
