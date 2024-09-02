'use client'
import { createContext, useCallback, useContext } from 'react'
import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useSnackbar } from '@/context/snackbar'
import { useTranslations } from 'use-intl'
/* eslint-disable */

interface AuthContextType {
  isAuth: boolean
  handleIsAuth: (val: boolean) => void
  handleLogout: () => Promise<void>
  user: any // Replace 'any' with a more specific type if possible
  updateUser: (user: any) => void // Replace 'any' with a more specific type if possible
  loginCheckSpinner: boolean
  handleLoginCheckSpinner: (val: boolean) => void
  setLoginPopup: (val: boolean) => void
  setRegisterPopup: (val: boolean) => void
  loginPopupOpen: boolean
  registerPopupOpen: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuth, setIsAuth] = React.useState(false)
  const router = useRouter()
  const [user, setUser] = React.useState({})
  const [loginCheckSpinner, updateLoginCheckSpinner] = React.useState(true)
  const { handleSnackbarOpen } = useSnackbar()
  const t = useTranslations()

  // state for login popup
  const [loginPopupOpen, setLoginPopup] = React.useState(false)

  // state for register popup
  const [registerPopupOpen, setRegisterPopup] = React.useState(false)

  const handleIsAuth = (val: boolean) => {
    setIsAuth(val)
  }

  const handleLoginCheckSpinner = (val: boolean) => {
    updateLoginCheckSpinner(val)
  }

  const updateUser = (user: object) => {
    setUser(user)
  }

  const handleLogout = useCallback(async () => {
    localStorage.removeItem('auth')
    setIsAuth(false)
    router.push('/')
    handleSnackbarOpen(t('logout_success'))
  }, [router])

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        handleIsAuth,
        handleLogout,
        user,
        updateUser,
        loginCheckSpinner,
        handleLoginCheckSpinner,
        loginPopupOpen,
        setLoginPopup,
        registerPopupOpen,
        setRegisterPopup,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
