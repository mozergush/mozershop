'use client'
import { Box } from '@mui/system'
import { Button, Container, Skeleton } from '@mui/material'
import Typography from '@mui/material/Typography'
import React, { useEffect, useRef, useState } from 'react'
import NavBreadcrumbs from '@/components/elements/NavBreadcrumbs/NavBreadcrumbs'
import { useAuth } from '@/context/auth'
import { useSnackbar } from '@/context/snackbar'
import { useRouter } from 'next/navigation'
import Grid from '@mui/material/Unstable_Grid2'
import Loader from '@/components/elements/Loader/Loader'
import TextField from '@mui/material/TextField'
import { changePassword, getOrders } from '@/actions/server'
import Card from '@mui/material/Card'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Order } from '@/types/common'
import { useTranslations } from 'use-intl'

interface FormState {
  errors?: {
    [key: string]: string | undefined
  }
  message?: string
  success?: string
}

export default function Dashboard() {
  const t = useTranslations()
  const { user, isAuth, loginCheckSpinner } = useAuth()
  const { handleSnackbarOpen } = useSnackbar()
  const router = useRouter()
  const [formPending, formPendingUpdate] = useState(false)
  const [formState, formStateUpdate] = useState<FormState>({})
  const oldPasswordRef = useRef<HTMLInputElement>(null)
  const newPasswordRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!loginCheckSpinner) {
      if (!isAuth) {
        router.replace('/') // перенаправление на страницу 404, если пользователь не аутентифицирован
      }
    }
  }, [isAuth, loginCheckSpinner])

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    formPendingUpdate(true)

    const formData = new FormData(e.target as HTMLFormElement)

    try {
      const result = await changePassword(formData)

      if (!result) {
        throw new Error('result is null')
      }

      formStateUpdate(result as FormState)

      if (result?.success) {
        handleSnackbarOpen(t('password_changed'))
        oldPasswordRef.current!.value = ''
        newPasswordRef.current!.value = ''
      }
    } catch (error) {
      console.error('Ошибка при отправке формы', error)
    } finally {
      formPendingUpdate(false)
    }
  }

  const [spinner, setSpinner] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const isMobile = useMediaQuery('(max-width:768px)')

  const TimestampToDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    const formattedDate = date.toLocaleString()

    return <>{formattedDate}</>
  }

  async function getAccountOrders(email: string) {
    try {
      const data = await getOrders(email)

      setOrders(data)

      setSpinner(false)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (user.email) {
      getAccountOrders(user.email)
    }
  }, [user])

  useEffect(() => {
    if (!loginCheckSpinner) {
      if (!isAuth) {
        router.replace('/') // перенаправление на страницу входа, если пользователь не аутентифицирован
      }
    }
  }, [isAuth, loginCheckSpinner])

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
            {t('user_dashboard')}
          </Typography>

          {loginCheckSpinner && (
            <Grid container spacing={4} sx={{ marginTop: '30px' }}>
              <Grid xs={12} mobile={8}>
                <Skeleton variant={'rounded'} height={200} />
              </Grid>
              <Grid xs={12} mobile={4}>
                <Skeleton variant={'rounded'} height={200} />
              </Grid>
            </Grid>
          )}

          {!loginCheckSpinner && user && (
            <Card sx={{ marginTop: '30px', padding: '20px' }}>
              <Grid container spacing={4}>
                <Grid xs={12} mobile={8}>
                  <Typography
                    variant={'h5'}
                    component={'div'}
                    sx={{ marginBottom: '20px' }}
                  >
                    {t('user_info')}
                  </Typography>
                  <Typography variant={'subtitle1'} component={'div'}>
                    {t('user_email')}
                  </Typography>
                  <Typography
                    variant={'h6'}
                    component={'div'}
                    sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {user.email}
                  </Typography>
                  <Typography
                    variant={'subtitle1'}
                    component={'div'}
                    sx={{ marginTop: '10px' }}
                  >
                    {t('user_name')}
                  </Typography>
                  <Typography
                    variant={'h6'}
                    component={'div'}
                    sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {user.name}
                  </Typography>
                </Grid>

                <Grid xs={12} mobile={4}>
                  <Typography variant={'h5'} component={'div'}>
                    {t('change_password')}
                  </Typography>

                  <Box
                    sx={{
                      position: 'relative',
                      overflow: formPending ? 'hidden' : 'visible',
                    }}
                  >
                    <form onSubmit={handleFormSubmit} className={formPending ? 'form-pending' : ''}>
                      <Loader />

                      <Box className={'form-inner'}>
                        <input
                          type="text"
                          hidden
                          name="user"
                          defaultValue={user.email}
                        />

                        <TextField
                          required
                          margin="dense"
                          id="oldpassword"
                          name="oldpassword"
                          label={t('old_password')}
                          type="password"
                          fullWidth
                          variant="standard"
                          inputRef={oldPasswordRef}
                        />

                        <TextField
                          required
                          margin="dense"
                          id="newpassword"
                          name="newpassword"
                          label={t('new_password')}
                          type="password"
                          fullWidth
                          variant="standard"
                          inputRef={newPasswordRef}
                        />
                        {formState?.errors?.newpassword && (
                          <Typography variant={'body2'} sx={{ color: 'red' }}>
                            {formState.errors.newpassword}
                          </Typography>
                        )}

                        <Button
                          type="submit"
                          sx={{ width: '100%', marginTop: '20px' }}
                          variant={'contained'}
                        >
                          {t('submit_change')}
                        </Button>

                        {formState?.message && (
                          <Box sx={{ padding: '10px 0 0', color: 'red' }}>
                            <Typography>{formState.message}</Typography>
                          </Box>
                        )}
                      </Box>
                    </form>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          )}

          {spinner && (
            <Skeleton
              variant={'rounded'}
              height={isMobile ? 415 : 240}
              width={'100%'}
              sx={{ marginTop: '40px' }}
            />
          )}

          {!spinner && orders.length > 0 && (
            <Box
              display={'flex'}
              flexDirection={'column'}
              gap={'20px'}
              width={'100%'}
              maxWidth={'100%'}
              sx={{ marginTop: '40px' }}
            >
              <Typography variant={'h4'}>
                {t('user_orders')}
              </Typography>

              <Card>
                {orders.map((order, index) => (
                  <Box key={index} sx={{ padding: '20px',
                    borderTop: index > 0 ? '1px solid rgba(0,0,0,0.16)' : 'unset' }}>
                    <Grid container spacing={2}>
                      <Grid xs={12} mobile={6}>
                        <Typography variant={'h6'} component={'div'}>
                          Order ID
                        </Typography>
                        <Typography
                          variant={'h5'}
                          component={'div'}
                          sx={{
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            background: '#ffa733',
                            borderRadius: '2px',
                            color: '#fff',
                            padding: '2px 8px',
                            display: 'inline-block',
                            maxWidth: 'calc(100% - 20px)',
                          }}
                        >
                          {order.id}
                        </Typography>

                        <Typography
                          variant={'h6'}
                          component={'div'}
                          sx={{ marginTop: '10px' }}
                        >
                          {t('date')}
                        </Typography>
                        <Typography variant={'body1'} component={'div'}>
                          {TimestampToDate(order.created)}
                        </Typography>

                        <Typography
                          variant={'h6'}
                          component={'div'}
                          sx={{ marginTop: '10px' }}
                        >
                          {t('shipping_address')}
                        </Typography>
                        <Typography variant={'body1'} component={'div'}>
                          {order.shipping.address.country},{' '}
                          {order.shipping.address.city},{' '}
                          {order.shipping.address.line1}
                        </Typography>
                      </Grid>
                      <Grid
                        xs={12}
                        mobile={6}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '20px',
                        }}
                      >
                        {order.items && (
                          <Box sx={{ flex: '1 0 auto' }}>
                            <Typography variant={'h6'} component={'div'}>
                              {t('products')}
                            </Typography>
                            <Box
                              sx={{ paddingLeft: '20px', marginTop: '10px' }}
                            >
                              {order.items.map(function (product, index) {
                                return (
                                  <Box
                                    key={index}
                                    sx={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      gap: '20px',
                                    }}
                                  >
                                    <Typography
                                      variant={'body1'}
                                      component={'div'}
                                    >
                                      {product.description}{' '}
                                      <b>x {product.quantity}</b>
                                    </Typography>
                                    <Typography
                                      variant={'h6'}
                                      component={'div'}
                                    >
                                      {product.amount_total / 100}$
                                    </Typography>
                                  </Box>
                                )
                              })}
                            </Box>
                          </Box>
                        )}

                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: '20px',
                          }}
                        >
                          <Typography variant={'h6'} component={'div'}>
                            {t('total_price')}:
                          </Typography>
                          <Typography variant={'h5'} component={'div'}>
                            {order.amount / 100}$
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </Card>
            </Box>
          )}
        </Container>
      </Box>
    </main>
  )
}
