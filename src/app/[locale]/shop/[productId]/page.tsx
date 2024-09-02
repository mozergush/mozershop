import { Box } from '@mui/system'
import { Container } from '@mui/material'
import Typography from '@mui/material/Typography'
import { IProduct } from '@/types/common'
import NavBreadcrumbs from '@/components/elements/NavBreadcrumbs/NavBreadcrumbs'
import { getComics, getOneComics } from '@/actions/server'
import Grid from '@mui/material/Unstable_Grid2'
import Image from 'next/image'
import { ProductsSlider } from '@/components/elements/ProductsSlider/ProductsSlider'
import Card from '@mui/material/Card'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import AddToCartButton from '@/components/elements/AddToCartButton/AddToCartButton'
import type { Locale } from 'public/locales/locales'

export default async function Product({ params : { productId, locale } }:
{ params: { productId: string, locale: Locale } }) {
  const t = await getTranslations({ locale })

  const productData = JSON.parse(await getOneComics({
    id: productId,
  }))

  // Если getOneComics возвращает строку, выполняем редирект на страницу 404
  if (productData.error){
    return redirect('/404')
  }

  const product: IProduct = productData

  const crossalesData = JSON.parse(await getComics({
    collection: product.collection,
    exclude: product._id,
  }))

  const crossales: IProduct[] | false = crossalesData.error ? false : crossalesData.data

  return (
    <main>
      <Box sx={{ paddingBottom: '40px' }}>
        <Container
          sx={{
            marginTop: '30px',
            marginBottom: '40px',
          }}
        >
          <NavBreadcrumbs
            lastName={product.name}
          />

          <Grid container spacing={4} sx={{ marginTop: '20px', alignItems: 'stretch' }}>
            <Grid xs={12} mobile={5}>
              <Box className={'product-slider-container'}
              >
                <Box
                  sx={{
                    width: '100%',
                    position: 'relative',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    isolation: 'isolate',
                  }}
                >
                  {product.images?.[0] && product.name && (
                    <Image
                      className={'image-container'}
                      src={product.images[0]}
                      alt={product.name}
                      fill={true}
                      style={{ objectFit: 'cover' }}
                    />
                  )}
                </Box>
              </Box>
            </Grid>

            <Grid xs={12} mobile={7}>
              <Card sx={{ padding: '20px', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h3" component="h1">
                  {product.name}
                </Typography>

                <Typography sx={{ marginTop: '40px', minHeight: '40px' }} variant="h5">
                  {t('description')}
                </Typography>
                <Typography sx={{ marginTop: '5px' }} variant="body2">
                  {product.description}
                </Typography>
                <Typography sx={{ marginTop: '20px' }} variant="h5">
                  {t('params')}
                </Typography>
                <Typography variant="body2" sx={{ marginTop: '5px', flex: '1 0 auto' }}>
                  {t('pages')}:{' '}
                  <Typography
                    sx={{ display: 'inline-block' }}
                    variant={'h6'}
                    component="span"
                  >
                    {product.pages}
                  </Typography>
                  <br />
                  {t('year_of_publishing')}:{' '}
                  <Typography
                    sx={{ display: 'inline-block' }}
                    variant={'h6'}
                    component="span"
                  >
                    {product.year}
                  </Typography>
                  <br />
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '30px',
                  }}
                >
                  <Typography variant="h4">
                    <Typography>{t('price')}:</Typography>

                    {<>{product.price}$</>}
                  </Typography>

                  <AddToCartButton productId={product._id} />
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>

        {crossales && crossales.length > 0 && (
          <ProductsSlider
            products={crossales}
            title={'more_from_this_line'}
          />
        )}
      </Box>
    </main>
  )
}
