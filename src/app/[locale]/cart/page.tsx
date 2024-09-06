'use client'
import { Box } from '@mui/system'
import { Button, Container, Skeleton } from '@mui/material'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'
import NavBreadcrumbs from '@/components/elements/NavBreadcrumbs/NavBreadcrumbs'
import Grid from '@mui/material/Unstable_Grid2'
import { getComics } from '@/actions/server'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { useAuth } from '@/context/auth'
import { useCart } from '@/context/cart'
import IconButton from '@mui/material/IconButton'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import RemoveIcon from '@mui/icons-material/Remove'
import { IProduct } from '@/types/common'
import Link from 'next/link'
import animationData from 'public/img/lottie6.json'
import useMediaQuery from '@mui/material/useMediaQuery'
import MaterialLink from '@/components/elements/MaterialLink/MaterialLink'
import { useSnackbar } from '@/context/snackbar'
import { usePathname, useRouter } from 'next/navigation'
import LottieContainer from '@/components/elements/LottieContainer'
import { useTranslations } from 'use-intl'
import { Tilt } from 'react-tilt'

const tiltOptions = {
  reverse:        false,  // reverse the tilt direction
  max:            20,     // max tilt rotation (degrees)
  perspective:    2000,   // Transform perspective, the lower the more extreme the tilt gets.
  scale:          1.03,    // 2 = 200%, 1.5 = 150%, etc..
  speed:          1000,   // Speed of the enter/exit transition
  transition:     true,   // Set a transition on enter/exit.
  axis:           null,   // What axis should be disabled. Can be X or Y.
  reset:          true,    // If the tilt effect has to be reset on exit.
  easing:         'cubic-bezier(.03,.98,.52,.99)',    // Easing on enter/exit.
}

export default function Cart({
  searchParams,
}: {
  searchParams: {
    status?: string
  }
}) {
  const { user, isAuth, setLoginPopup } = useAuth()
  const { cart, addProduct, removeProduct, deleteProduct } = useCart()
  const [products, setProducts] = useState<IProduct[]>([])
  const [spinner, setSpinner] = useState(true)
  const [total, setTotal] = useState(0)
  const isMobile = useMediaQuery('(max-width:768px)')
  const { handleSnackbarOpen } = useSnackbar()
  const pathname = usePathname()
  const { replace } = useRouter()
  const t = useTranslations()

  const fetchProducts = async (cart: {
    [key: string]: number
  }) => {
    try {
      const cartIds = Object.keys(cart)

      const request = await getComics({
        include: cartIds,
      })

      const productsData = JSON.parse(request).data
      setProducts(productsData)

      // Рассчитываем общую стоимость
      const price = productsData.reduce((acc: number, product: IProduct) => {
        const productAmount = cart[product._id] || 0
        return acc + product.price * productAmount
      }, 0)

      setTotal(price)

      if (price > 0) {
        setSpinner(false)
      }
    } catch (error) {
      console.error('Failed to fetch', error)
    }
  }

  const isEmpty = (obj: {
    [key: string]: number
  }) => Object.keys(obj).length === 0

  useEffect(() => {
    if (!isEmpty(cart)) {
      fetchProducts(cart)
    }
  }, [cart])

  useEffect(() => {
    if (searchParams?.status == 'canceled') {
      handleSnackbarOpen(t('something_went_wrong'), 'error')

      const params = new URLSearchParams(searchParams)
      params.delete('status')
      replace(`${pathname}?${params.toString()}`)
    }
  }, [searchParams])

  return (
    <main>
      <Box sx={{ paddingBottom: '60px' }}>
        <Container
          sx={{
            marginTop: '30px',
          }}
        >
          <NavBreadcrumbs />

          <Typography variant="h3" component="h1" sx={{ marginTop: '30px' }}>
            {t('cart')}
          </Typography>

          {(!isEmpty(cart) || spinner) && (
            <Grid
              container
              spacing={4}
              sx={{ marginTop: '20px', marginBottom: '10px' }}
            >
              <Grid
                xs={12}
                md={8}
                sx={{
                  display: 'flex',
                  gap: '20px',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                }}
              >
                {spinner && (
                  <>
                    {Object.keys(cart && !isEmpty(cart) ? cart : [1]).map((key) => (
                      <Skeleton key={key} height={100} variant="rounded" />
                    ))}
                  </>
                )}

                {!spinner && (
                  <>
                    {products
                      .filter((product) => cart.hasOwnProperty(product._id))
                      .map((product) => (
                        <Card sx={{
                          padding: '15px',
                        }}
                        key={product._id}>
                          <Grid
                            container
                            spacing={2}
                            alignItems={'stretch'}
                          >
                            <Grid xs={3} sm={2} md={2}>
                              <Box
                                className={'image-container'}
                                sx={{
                                  position: 'relative',
                                  height: '100px',
                                  borderRadius: '4px',
                                  overflow: 'hidden',
                                }}
                              >
                                <img
                                  src={product?.images ? product.images[0] : ''}
                                  alt={product?.name ? product.name : 'Product'}
                                  className={'global-object-fit'}
                                />
                              </Box>
                            </Grid>

                            <Grid
                              xs={9}
                              sm={10}
                              md={10}
                              sx={{
                                minHeight: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                gap: '5px',
                              }}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <Typography variant={'h5'}>
                                  {product.name}
                                </Typography>

                                <IconButton
                                  size="large"
                                  aria-label="decrease"
                                  aria-haspopup="true"
                                  color="inherit"
                                  onClick={() => deleteProduct(product._id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>

                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  gap: '20px',
                                }}
                              >
                                <Typography variant="h6" component="div">
                                  {product.price * cart[product._id]}$
                                </Typography>

                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                  }}
                                >
                                  <IconButton
                                    size="large"
                                    aria-label="decrease"
                                    aria-haspopup="true"
                                    color="inherit"
                                    onClick={() => removeProduct(product._id)}
                                  >
                                    <RemoveIcon />
                                  </IconButton>

                                  <Box>{cart[product._id]}</Box>

                                  <IconButton
                                    size="large"
                                    aria-label="increase"
                                    aria-haspopup="true"
                                    color="inherit"
                                    onClick={() => addProduct(product._id)}
                                  >
                                    <AddIcon />
                                  </IconButton>
                                </Box>
                              </Box>
                            </Grid>
                          </Grid>
                        </Card>
                      ))}
                  </>
                )}
              </Grid>
              <Grid xs={12} md={4}>
                {spinner && <Skeleton variant={'rounded'} height={220} />}

                {!spinner && (
                  <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {t('total_price')}:
                      </Typography>

                      <Typography
                        variant="h4"
                        component="div"
                        gutterBottom
                        sx={{ marginBottom: '10px' }}
                      >
                        {total}$
                      </Typography>

                      {!isAuth && (
                        <Typography variant="subtitle1" gutterBottom>
                          {t('before_checkout_you_need_to')}{' '}
                          <MaterialLink
                            onClick={() => {
                              setLoginPopup(true)
                            }}
                          >
                            {t('log_in')}
                          </MaterialLink>
                        </Typography>
                      )}

                      <form action="/api/checkout_sessions" method="POST">
                        <input
                          type="text"
                          hidden
                          name="cart"
                          value={JSON.stringify(cart)}
                        />
                        <input
                          type="text"
                          hidden
                          name="user"
                          value={user.email}
                        />
                        <Tilt options={tiltOptions} className={'tilt-container'}>
                          <Button
                            variant="contained"
                            type="submit"
                            disabled={!isAuth}
                            size={'large'}
                            sx={{ width: '100%' }}
                          >
                            {t('checkout')}
                          </Button>
                        </Tilt>
                      </form>
                    </CardContent>
                  </Card>
                )}
              </Grid>
            </Grid>
          )}

          {(isEmpty(cart) && !spinner) && (
            <Box>
              <LottieContainer
                height={isMobile ? '175px' : '255px'}
                width={isMobile ? '180px' : '270px'}
                data={animationData} />

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginTop: '10px',
                  marginBottom: '20px',
                }}
              >
                <Typography
                  variant={'h4'}
                  sx={{ marginBottom: '20px', textAlign: 'center' }}
                >
                  {t('your_cart_is_empty')}
                </Typography>

                <Tilt options={tiltOptions} className={'tilt-container'}>
                  <Link href={'/shop'}>
                    <Button size={'large'} variant={'contained'}>
                      {t('go_to_shop')}
                    </Button>
                  </Link>
                </Tilt>
              </Box>
            </Box>
          )}
        </Container>
      </Box>
    </main>
  )
}
