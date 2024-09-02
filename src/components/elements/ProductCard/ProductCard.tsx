import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { Button, CardActions } from '@mui/material'
import { Box } from '@mui/system'
import Link from 'next/link'
import { IProduct } from '@/types/common'
import { Tilt } from 'react-tilt'
import Image from 'next/image'
import { useTranslations } from 'use-intl'

const defaultOptions = {
  reverse:        false,  // reverse the tilt direction
  max:            20,     // max tilt rotation (degrees)
  perspective:    2500,   // Transform perspective, the lower the more extreme the tilt gets.
  scale:          1.01,    // 2 = 200%, 1.5 = 150%, etc..
  speed:          1000,   // Speed of the enter/exit transition
  transition:     true,   // Set a transition on enter/exit.
  axis:           null,   // What axis should be disabled. Can be X or Y.
  reset:          true,    // If the tilt effect has to be reset on exit.
  easing:         'cubic-bezier(.03,.98,.52,.99)',    // Easing on enter/exit.
}
// Функция для обрезки строки
function truncateDescription(
  description: string | undefined,
  maxLength: number
) {
  if (!description || description.length <= maxLength) {
    return description
  }

  // Обрезаем строку до максимальной длины
  let truncated = description.slice(0, maxLength)

  // Проверяем, не заканчивается ли обрезанная строка на середине слова
  if (description[maxLength] !== ' ') {
    const lastSpaceIndex = truncated.lastIndexOf(' ')
    if (lastSpaceIndex > 0) {
      truncated = truncated.slice(0, lastSpaceIndex)
    }
  }

  return truncated + '...'
}

export default function ProductCard({
  item,
  hideLabels,
}: {
  item: IProduct
  hideLabels?: boolean
}) {
  const imgLink = item.images ? item.images[0] : ''
  const t = useTranslations()

  return (
    <Tilt options={defaultOptions} className={'tilt-container'}>
      <Card
        className={'card-product'}
        sx={{ dosplay: 'flex', flexDirection: 'column', height: '100%' }}
      >
        <Box sx={{ flex: '1 0 auto' }}>
          <Box sx={{ width: '100%', position: 'relative' }}>
            {!hideLabels && item.isBestseller && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  gap: '6px',
                  alignItems: 'flex-start',
                  maxWidth: '50%',
                  display: 'flex',
                  flexDirection: 'column',
                  zIndex: '10',
                }}
              >
                <Typography
                  variant={'caption'}
                  sx={{
                    background: '#ffa733',
                    borderRadius: '2px',
                    color: '#fff',
                    padding: '2px 8px',
                  }}
                >
                  {t('bestseller')}
                </Typography>
              </Box>
            )}

            <Link href={'/shop/' + item._id}>
              <Box
                className={'image-container'}
                sx={{
                  position: 'relative',
                  height: '345px',
                  borderRadius: '0 !important',
                  overflow: 'hidden',
                }}
              >
                <Image
                  fill
                  src={imgLink}
                  alt={'Comix Title'}
                  objectFit={'cover'}
                />
              </Box>
            </Link>
          </Box>
          <CardContent sx={{ paddingBottom: '10px !important' }}>
            <Typography gutterBottom variant="h5" component="div">
              {item.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {truncateDescription(item.description, 80)}
            </Typography>
          </CardContent>
        </Box>
        <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            sx={{ margin: '0 8px' }}
            gutterBottom
            variant="h6"
            component="div"
          >
            {item.price}$
          </Typography>

          <Box>
            <Link href={'/shop/' + item._id}>
              <Button size="small" color="primary">
                {t('view')}
              </Button>
            </Link>
          </Box>
        </CardActions>
      </Card>
    </Tilt>
  )
}
