'use client'
import { useCart } from '@/context/cart'
import { useSnackbar } from '@/context/snackbar'
import { useTranslations } from 'use-intl'
import { Tilt } from 'react-tilt'
import { Button } from '@mui/material'

const tiltOptions = {
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

export default function AddToCartButton({ productId } : {
  productId: string,
}) {
  const { addProduct } = useCart()
  const { handleSnackbarOpen } = useSnackbar()
  const t = useTranslations()

  function handleAddToCart() {
    console.log(productId)
    addProduct(productId)

    handleSnackbarOpen(t('product_successfully_added'))
  }

  return (
    <Tilt options={tiltOptions} className={'tilt-container'}>
      <Button
        variant="contained"
        size={'large'}
        onClick={handleAddToCart}
      >
        {t('add_to_cart')}
      </Button>
    </Tilt>
  )
}
