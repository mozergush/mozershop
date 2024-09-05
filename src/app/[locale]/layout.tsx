/* eslint-disable */
import type { Metadata } from 'next'
import 'public/styles/globalsStyle.scss'
import Layout from '@/components/Layout'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/theme'
import { CssBaseline } from '@mui/material'
import React from 'react'
import { SpeedInsights } from "@vercel/speed-insights/next"

import { type Locale } from "public/locales/locales";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

export const metadata: Metadata = {
  title: 'Mozershop',
  description: 'My NextJS shop project',
}

export default async function RootLayout({
                                             children,
                                             params: { locale },
                                         }: {
    children: React.ReactNode;
    params: { locale: Locale };
}) {
    const messages = await getMessages();

  return (
    <html lang={locale}>
    <head>
        <link rel="icon" href="/favicon.ico" sizes="any"/>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"/>
    </head>
    <body>
        <AppRouterCacheProvider options={{enableCssLayer: true}}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <SpeedInsights/>

                <NextIntlClientProvider messages={messages}>
                    <Layout>
                        {children}
                    </Layout>
                </NextIntlClientProvider>
            </ThemeProvider>
        </AppRouterCacheProvider>
    </body>
    </html>
  )
}