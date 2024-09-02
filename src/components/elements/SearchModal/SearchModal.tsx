'use client'
import * as React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'use-intl'

const SearchModal = ({
  open,
  handleClose,
}: {
  open: boolean
  handleClose: () => void
}) => {
  const router = useRouter()
  const t = useTranslations()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const searchQuery = formData.get('search') as string

    router.push(`/shop?c_search=${encodeURIComponent(searchQuery)}`)
    handleClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit,
      }}
    >
      <DialogTitle>{t('search')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {
            t('using_search_you_can_find_any_products_on_the_site')
          }
        </DialogContentText>
        <TextField
          required
          margin="dense"
          id="search"
          name="search"
          label={t('what_are_you_looking_for')}
          type="text"
          fullWidth
          variant="standard"
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>{t('cancel')}</Button>
        <Button type="submit">{t('find')}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default SearchModal
