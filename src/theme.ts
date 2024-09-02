'use client'
import { Rubik } from 'next/font/google'
import { createTheme } from '@mui/material/styles'

const rubik = Rubik({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1A1014', // Основной цвет - черный
    },
    secondary: {
      main: '#EC4FB8', // Вторичный цвет - белый
    },
    error: {
      main: '#DC422E', // Цвет ошибки - красный
    },
    warning: {
      main: '#F2AF29', // Цвет предупреждения - оранжевый
    },
    info: {
      main: '#39A2AE', // Информационный цвет - голубой
    },
    success: {
      // main: '#058C42', // Цвет успеха - зеленый
      main: '#23CE6B', // Цвет успеха - зеленый
    },
    background: {
      default: '#f5f5f5', // Цвет фона по умолчанию - светло-серый
      // default: '#FFFFF0', // Цвет фона по умолчанию - светло-серый
    },
    text: {
      primary: '#101419', // Основной цвет текста - черный
    },
  },
  typography: {
    fontFamily: rubik.style.fontFamily,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
      mobile: 768,
    },
  },
})

export default theme
