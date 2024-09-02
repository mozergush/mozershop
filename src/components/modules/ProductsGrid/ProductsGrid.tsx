'use client'
import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import ProductCard from '@/components/elements/ProductCard/ProductCard'
import { Button, Skeleton } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { IProduct } from '@/types/common'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import { Box } from '@mui/system'
import animationData from 'public/img/lottie5.json'
import LottieContainer from '@/components/elements/LottieContainer'
import { useTranslations } from 'use-intl'

export default function ProductsGrid({
  products,
  spinner,
}: {
  products: IProduct[]
  spinner: boolean
}) {
  const t = useTranslations()
  return (
    <Grid container spacing={2}>
      {spinner &&
        Array.from(new Array(3)).map((_, i) => (
          <Grid xs={12} sm={6} md={6} lg={4} key={i}>
            <Card>
              <Skeleton variant="rectangular" width="100%" height="345px" />
              <CardContent>
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton sx={{ width: '60%' }} />
              </CardContent>
            </Card>
          </Grid>
        ))}

      {!spinner && (
        <>
          {products.length > 0 &&
            products.map((item, index) => (
              <Grid xs={12} sm={6} md={6} lg={4} key={index}>
                <ProductCard item={item} />
              </Grid>
            ))}

          {products.length == 0 && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                marginBottom: '20px',
              }}
            >
              <LottieContainer height={'140px'} width={'200px'} data={animationData} />

              <Typography
                variant={'h4'}
                sx={{
                  marginBottom: '20px',
                  marginTop: '20px',
                  textAlign: 'center',
                }}
              >
                {t('products_not_found')}
              </Typography>

              <Link href={'/shop?c_collection=all'}>
                <Button size={'large'} variant={'contained'}>
                  {t('reset_filters')}
                </Button>
              </Link>
            </Box>
          )}
        </>
      )}
    </Grid>
  )
}
