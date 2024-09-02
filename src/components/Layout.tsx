import React from 'react'
import AppBar from '@/components/modules/AppBar/AppBar'
import Footer from '@/components/modules/Footer/Footer'
import { SnackbarProvider } from '@/context/snackbar'
import { AuthProvider } from '@/context/auth'
import { CartProvider } from '@/context/cart'
import VantaBackground from '@/components/modules/VantaBackground'

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true
    sm: true
    md: true
    lg: true
    xl: true
    mobile: true // добавляем кастомный брейкпоинт
  }
}

const Layout = ({ children }:{
  children: React.ReactNode
}) => (
  <SnackbarProvider>
    <AuthProvider>
      <CartProvider>
        <VantaBackground />
        <AppBar />
        {children}
        <Footer />
      </CartProvider>
    </AuthProvider>
  </SnackbarProvider>
)

export default Layout