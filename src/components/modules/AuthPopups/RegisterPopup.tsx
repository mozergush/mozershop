import * as React from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import { Box } from '@mui/system'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import { register } from '@/actions/server'
import { DialogContent, DialogTitle, FormHelperText } from '@mui/material'
import { useState } from 'react'
import { useSnackbar } from '@/context/snackbar'
import OAuthModule from '@/components/modules/AuthPopups/OAuthModule'
import { useAuth } from '@/context/auth'
import Loader from '@/components/elements/Loader/Loader'
import { useTranslations } from 'use-intl'

export default function RegisterPopup({
  open,
  handleClose,
  handleLoginPopupOpen,
}: {
  open: boolean
  handleClose: () => void
  handleLoginPopupOpen: () => void
}) {
  const [formPending, formPendingUpdate] = useState(false)
  const t = useTranslations()

  interface FormState {
    errors?: {
      [key: string]: string | undefined
    }
    message?: string
    tokens?: string
  }

  const [formState, formStateUpdate] = useState<FormState>({})
  const { handleSnackbarOpen } = useSnackbar()
  const { handleIsAuth } = useAuth()

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    formPendingUpdate(true)

    const formData = new FormData(e.target as HTMLFormElement)

    try {
      const result = await register(formData)

      if (!result) {
        throw new Error('result is null')
      }

      formStateUpdate(result as FormState)

      if (result?.tokens) {
        localStorage.setItem('auth', result.tokens)
        handleSnackbarOpen(t('successful_registration'))
        handleClose()
        handleIsAuth(true)
      }

      formPendingUpdate(false)
    } catch (error) {
      console.error('Ошибка при отправке формы', error)
    }
  }

  return (
    <Dialog
      className={'popup-auth'}
      open={open}
      onClose={handleClose}
      fullWidth={true}
      maxWidth={'xs'}
    >
      <Box sx={{ position: 'relative' }}>
        <form onSubmit={handleFormSubmit} className={formPending ? 'form-pending' : ''}>
          <Loader />
          <Box className={'form-inner'}>
            <DialogTitle>Registration</DialogTitle>
            <DialogContent>
              <DialogContentText sx={{ marginBottom: '10px' }}>
                {t('registration_text')}
              </DialogContentText>

              <Box sx={{ padding: '0 0 0px' }}>
                <OAuthModule handleClose={handleClose} />
              </Box>

              <TextField
                required
                margin="dense"
                id="name"
                name="name"
                label={t('name')}
                type="text"
                fullWidth
                variant="standard"
              />
              {formState?.errors?.name && <p>{formState.errors.name}</p>}

              <TextField
                required
                margin="dense"
                id="email"
                name="email"
                label="Email"
                type="email"
                fullWidth
                variant="standard"
              />
              {formState?.errors?.email && (
                <Typography variant={'body2'} sx={{ color: 'red' }}>
                  {formState.errors.email}
                </Typography>
              )}

              <TextField
                required
                margin="dense"
                id="password"
                name="password"
                label={t('password')}
                type="password"
                fullWidth
                variant="standard"
              />
              {formState?.errors?.password && (
                <Typography variant={'body2'} sx={{ color: 'red' }}>
                  {formState.errors.password}
                </Typography>
              )}

              <FormHelperText sx={{ marginTop: '25px', marginBottom: '10px' }}>
                {t('already_have_account')}{' '}
                <Link onClick={handleLoginPopupOpen} className={'material-link-container'}>
                  {t('login')}
                </Link>
              </FormHelperText>
            </DialogContent>

            <DialogActions>
              <Button onClick={handleClose}>{t('cancel')}</Button>
              <Button type="submit">{t('register')}</Button>
            </DialogActions>

            {formState?.message && (
              <Box sx={{ padding: '0 24px 20px', color: 'red' }}>
                <Typography>{formState.message}</Typography>
              </Box>
            )}
          </Box>
        </form>
      </Box>
    </Dialog>
  )
}
