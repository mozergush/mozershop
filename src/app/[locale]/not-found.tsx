'use client'
import { Box } from '@mui/system'
import React from 'react'
import { Button, Container } from '@mui/material'
import animationData from 'public/img/lottie3.json'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import useMediaQuery from '@mui/material/useMediaQuery'
import LottieContainer from '@/components/elements/LottieContainer'
import { useTranslations } from 'use-intl'

export default function NotFound() {
  const isMobile = useMediaQuery('(max-width:768px)')
  const t = useTranslations()

  return (
    <main>
      <Box sx={{ paddingTop: '50px', paddingBottom: '50px' }}>
        <Container>
          <LottieContainer
            height={isMobile ? '135px' : '240px'}
            width={isMobile ? '285px' : '530px'}
            data={animationData} />

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: '30px',
            }}
          >
            <Typography
              variant={'h4'}
              sx={{ marginBottom: '20px', textAlign: 'center' }}
            >
              {t('page_not_found')}
            </Typography>

            <Link href={'/'}>
              <Button size={'large'} variant={'contained'}>
                {t('return_home')}
              </Button>
            </Link>
          </Box>
        </Container>
      </Box>
    </main>
  )
}
