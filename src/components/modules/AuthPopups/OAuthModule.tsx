'use client'
import * as React from 'react'
import { oauth } from '@/actions/server'
import { useSnackbar } from '@/context/snackbar'
import { useAuth } from '@/context/auth'
import { Button } from '@mui/material'
import { useTranslations } from 'use-intl'
import GoogleIcon from '@mui/icons-material/Google'
import Typography from '@mui/material/Typography'

export default function OAuthModule({
  handleClose,
}: {
  handleClose: () => void
}) {
  const { handleSnackbarOpen } = useSnackbar()
  const { handleIsAuth } = useAuth()
  const t = useTranslations()

  const openCenteredPopup = (url:string, title:string, width:number, height:number) => {
    // Определяем размеры окна браузера
    const screenWidth = window.screen.width
    const screenHeight = window.screen.height

    // Вычисляем позицию попапа по центру экрана
    const left = (screenWidth - width) / 2
    const top = (screenHeight - height) / 2

    // Параметры окна попапа
    const features = `
    width=${width},
    height=${height},
    top=${top},
    left=${left},
    resizable=yes,
    scrollbars=yes,
    status=yes
  `

    // Открываем попап
    const popup = window.open(url, title, features)

    if (!popup) {
      alert('Попап заблокирован вашим браузером. Разрешите всплывающие окна для этого сайта.')
    }

    return popup
  }

  const handleGoogleLogin = () => {
    const popup = openCenteredPopup('/api/auth/google', 'googleLogin', 500, 600)

    const handleMessage = async (event: MessageEvent) => {
      // Убедитесь, что сообщение исходит от вашего попапа
      if (event.origin !== window.location.origin) return

      // Проверка структуры данных, чтобы убедиться, что это не от react-devtools
      if (event.data && event.data.email) {
        // Обработка данных пользователя
        console.log('User Data:', event.data)

        const result = await oauth({
          email: event.data.email,
          name: event.data.name,
          id: event.data.id,
          image: event.data.picture
        })

        if (result?.tokens) {
          localStorage.setItem('auth', result.tokens)
          handleSnackbarOpen(t('successful_login'))
          handleClose()
          handleIsAuth(true)
        }
      }
    }

    window.addEventListener('message', handleMessage)

    // Проверка, если попап был закрыт пользователем
    const checkPopupClosed = setInterval(() => {
      if (popup && popup.closed) {
        clearInterval(checkPopupClosed)
        window.removeEventListener('message', handleMessage)
      }
    }, 1000)
  }

  return (
    <>
      <Button
        variant="outlined"
        sx={{ width: '100%', marginTop: '10px', fontSize: '12px', borderRadius: '10px' }}
        onClick={handleGoogleLogin}
        size="large"
      >
        <GoogleIcon sx={{ marginRight: '8px' }} />{t('connect_with_oauth')}
      </Button>

      <Typography className={'login-or'}>{t('or')}</Typography>
    </>
  )
}
