'use client'
import { Box } from '@mui/system'
import { Button, Container, Skeleton } from '@mui/material'
import ProductCard from '@/components/elements/ProductCard/ProductCard'
import Typography from '@mui/material/Typography'
import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Link from 'next/link'
import { IProduct } from '@/types/common'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import IconButton from '@mui/material/IconButton'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { Tilt } from 'react-tilt'
import { useEffect, useState } from 'react'
import { useTranslations } from 'use-intl'

const defaultOptions = {
  reverse:        false,  // reverse the tilt direction
  max:            25,     // max tilt rotation (degrees)
  perspective:    2000,   // Transform perspective, the lower the more extreme the tilt gets.
  scale:          1.05,    // 2 = 200%, 1.5 = 150%, etc..
  speed:          1000,   // Speed of the enter/exit transition
  transition:     true,   // Set a transition on enter/exit.
  axis:           null,   // What axis should be disabled. Can be X or Y.
  reset:          true,    // If the tilt effect has to be reset on exit.
  easing:         'cubic-bezier(.03,.98,.52,.99)',    // Easing on enter/exit.
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicElements {
            'swiper-container': React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement>,
                HTMLElement
            >

            'swiper-slide': React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement>,
                HTMLElement
            >
        }
    }
}

export const ProductsSlider = ({
  title,
  products,
  link,
  spinner,
  hideLabels,
}: {
  title: string
  link?: string
  products: IProduct[]
  spinner?: boolean
  hideLabels?: boolean
}) => {
  const [isNavigation, setIsNavigation] = useState(false)
  const t = useTranslations()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 960){
        if (products.length > 3){
          setIsNavigation(true)
        } else {
          setIsNavigation(false)
        }
        return
      }

      if (window.innerWidth > 620){
        if (products.length > 2){
          setIsNavigation(true)
        } else {
          setIsNavigation(false)
        }
        return
      }

      if (products.length > 1){
        setIsNavigation(true)
      } else {
        setIsNavigation(false)
      }
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    // Очистка при размонтировании
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <Box
      component="section"
      className={'slider-products'}
      sx={{
        padding: '10px 0 30px',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            margin: '10px 0 20px',
          }}
        >
          <Typography className="custom_h4" variant="h4">
            {t(title)}
          </Typography>

          {link && link != '' && (
            <Tilt options={defaultOptions} className={'tilt-container'}>
              <Link href={link}>
                <Button variant="contained">{t('shop_all')}</Button>
              </Link>
            </Tilt>
          )}
        </Box>

        <div className={'swiper-container'}>
          <Swiper
            modules={[Navigation, Pagination]} // Используем массив модулей
            slidesPerView={1}
            spaceBetween={20}
            slidesPerGroup={1}
            breakpoints={{
              620: {
                slidesPerView: 2,
              },
              960: {
                slidesPerView: 3,
              },
            }}
            pagination={{
              el: '.swiper-pagination',
              clickable: true,
            }}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
          >
            {spinner &&
                Array.from({ length: 3 }).map((_, i) => (
                  <SwiperSlide key={i}>
                    <Card sx={{ minWidth: '100%' }}>
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height="345px"
                      />

                      <CardContent>
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                        <Skeleton sx={{ width: '60%' }} />
                      </CardContent>
                    </Card>
                  </SwiperSlide>
                ))}

            {!spinner &&
                products.map((item) => (
                  <SwiperSlide key={item._id}>
                    <ProductCard item={item} hideLabels={hideLabels} />
                  </SwiperSlide>
                ))}
          </Swiper>

          <Tilt options={defaultOptions} className={`tilt-container`} style={{
            display: isNavigation ? 'block' : 'none'
          }}>
            <Card className={'swiper-container__navigation'} sx={{ color: '#fff' }}>
              <IconButton
                size="large"
                aria-label="Slider prev"
                aria-haspopup="true"
                color="inherit"
                className="swiper-button-prev"
              >
                <ArrowBackIosNewIcon />
              </IconButton>

              <div className="swiper-pagination" />
              <IconButton
                size="large"
                aria-label="Slider next"
                aria-haspopup="true"
                color="inherit"
                className="swiper-button-next"
              >
                <ArrowBackIosNewIcon />
              </IconButton>
            </Card>
          </Tilt>
        </div>
      </Container>
    </Box>
  )
}
