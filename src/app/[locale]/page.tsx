import { getComics } from '@/actions/server'
import LottieContainer from '@/components/elements/LottieContainer'
import animationData from 'public/img/lottie2.json'
import { ProductsSlider } from '@/components/elements/ProductsSlider/ProductsSlider'
import React from 'react'
import { Box } from '@mui/system'
import Typography from '@mui/material/Typography'
import { Container } from '@mui/material'
import { getTranslations } from 'next-intl/server'
import type { Locale } from 'public/locales/locales'

export default async function Home({ params:{ locale } } : {
    params:{
        locale: Locale
    }
}) {
  let products = []
  const t = await getTranslations({ locale })

  try {
    const comics = await getComics({
      collection: 'all',
      isBestseller: true,
    })
    products = JSON.parse(comics).data
  } catch (error) {
    console.error('Failed to fetch comics', error)
  }

  return (
    <main>
      <LottieContainer width={'300px'} height={'260px'} data={animationData} />

      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '0',
        }}
      >
        <Typography
          className="custom_h3"
          variant="h3"
          component="h1"
          sx={{ textAlign: 'center', fontSize: '100px', fontWeight: '500', mixBlendMode: 'difference', color: '#fff' }}
        >
          {t('welcome')}
        </Typography>
      </Container>

      <Box sx={{ margin: '20px 0 30px' }}>
        <ProductsSlider
          products={products}
          title={'bestsellers'}
          link={'/shop'}
          hideLabels={true}
        />
      </Box>
    </main>
  )
}
