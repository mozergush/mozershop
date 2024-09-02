/* eslint-disable */
import { Box } from '@mui/system'
import { Container } from '@mui/material'
import Typography from '@mui/material/Typography'
import * as React from 'react'
import Image from 'next/image'
import MaterialLink from '@/components/elements/MaterialLink/MaterialLink'
import MySnackbar from "@/components/elements/MySnackbar/MySnackbar";
import { getTranslations } from "next-intl/server";

const Footer = async ({locale}:{locale?: string}) => {
    const t = await getTranslations({ locale });

  return (
    <>
      <footer className="footer">
        <Box
          component="section"
          sx={{
            background: '#D8A4D9',
            padding: '15px 0 10px',
          }}
        >
          <Container
            maxWidth="lg"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <Box
              className={'left-side'}
              sx={{
                flex: '1 0 0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                flexDirection: 'column',
              }}>
              <Typography
                variant="caption"
                display="block"
                gutterBottom
                sx={{ textAlign: 'left' }}
              >
                © 2024 {t('all_right_reserved')}. Created by <MaterialLink href={'https://t.me/mozergush'}>Mozergush</MaterialLink> <br />{' '}
                  {t('cookies')}
              </Typography>

              <Image
                src={'/img/footerdecor.svg'}
                alt={'footer decor'}
                width="200"
                height="40"
              />
            </Box>

            <Image
              src={'/img/mozerlogo.svg'}
              alt={'footer decor'}
              width="175"
              height="70"
            />
          </Container>
        </Box>
      </footer>

        <MySnackbar/>
    </>
  )
}

export default Footer
