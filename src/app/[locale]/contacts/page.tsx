import { Box } from '@mui/system'
import { Container } from '@mui/material'
import Typography from '@mui/material/Typography'
import React from 'react'
import NavBreadcrumbs from '@/components/elements/NavBreadcrumbs/NavBreadcrumbs'
import MaterialLink from '@/components/elements/MaterialLink/MaterialLink'
import { getTranslations } from 'next-intl/server'
import { type Locale } from 'public/locales/locales'

export default async function Contacts({ params:{ locale } } : {
    params:{
        locale: Locale
    }
}) {
  const t = await getTranslations({ locale })

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
            {t('contacts')}
          </Typography>

          <Box
            sx={{
              marginTop: '30px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '15px',
            }}
          >
            <Typography variant={'h5'} sx={{ textAlign: 'left' }}>
              {t('contacts_subtext')}{' '}
              <MaterialLink href="https://t.me/mozergush">
                Telegram
              </MaterialLink>
            </Typography>
          </Box>
        </Container>
      </Box>
    </main>
  )
}
