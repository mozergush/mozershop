'use client'
import React from 'react'
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  SwipeableDrawer,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'
import { Box } from '@mui/system'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import LocalMallIcon from '@mui/icons-material/LocalMall'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import Divider from '@mui/material/Divider'
import SearchIcon from '@mui/icons-material/Search'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { type Locale } from 'public/locales/locales'
import { useTranslations } from 'use-intl'
import { useRouter } from 'next/navigation'

export default function DrawedList({
  toggleDrawer,
  open,
  handleSearchOpen,
}: {
  toggleDrawer: (newOpen: boolean) => () => void
  open: boolean
  handleSearchOpen: () => void
}) {
  const t = useTranslations()

  const [submenuOpen1, setSubmenuOpen1] = React.useState(false)

  const handleClick1 = () => {
    setSubmenuOpen1(!submenuOpen1)
  }

  const locale = useLocale() as Locale
  const router = useRouter()

  function handleLocaleChange(event: React.MouseEvent<HTMLElement>, newLanguage: string): void {
    document.cookie = `NEXT_LOCALE=${newLanguage}; path=/; max-age=31536000; SameSite=Lax`
    router.refresh()
  }

  const DrawerList = (
    <Box
      sx={{
        width: 300,
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
      role="presentation"
    >
      <List
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            {t('navigation')}
          </ListSubheader>
        }
      >
        <ListItemButton onClick={handleClick1}>
          <ListItemIcon>
            <LocalMallIcon />
          </ListItemIcon>
          <ListItemText primary={t('shop')} />
          {submenuOpen1 ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={submenuOpen1} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Link href={'/shop?c_collection=all'} onClick={toggleDrawer(false)}>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemText primary={t('all_comics')} />
              </ListItemButton>
            </Link>

            <Link
              href={'/shop?c_collection=spidermops'}
              onClick={toggleDrawer(false)}
            >
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemText primary={'Spider Mops'} />
              </ListItemButton>
            </Link>

            <Link
              href={'/shop?c_collection=punjrafee'}
              onClick={toggleDrawer(false)}
            >
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemText primary={'Punjrafee'} />
              </ListItemButton>
            </Link>

            <Link
              href={'/shop?c_collection=murmurjoke'}
              onClick={toggleDrawer(false)}
            >
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemText primary={'Murmur JOKE'} />
              </ListItemButton>
            </Link>

            <Link
              href={'/shop?c_collection=superpony'}
              onClick={toggleDrawer(false)}
            >
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemText primary={'Superpony'} />
              </ListItemButton>
            </Link>
          </List>
        </Collapse>

        <Link
          href={'/contacts'}
          onClick={toggleDrawer(false)}
        >
          <ListItemButton>
            <ListItemIcon>
              <AlternateEmailIcon />
            </ListItemIcon>
            <ListItemText primary={t('contacts')} />
          </ListItemButton>
        </Link>

        <Divider
          className={'hidden-sm'}
          variant="middle"
          component="li"
          sx={{ marginTop: '16px', marginBottom: '16px' }}
        />

        <ListItemButton className={'hidden-sm'} onClick={handleSearchOpen}>
          <ListItemIcon>
            <SearchIcon />
          </ListItemIcon>
          <ListItemText primary={t('search')} />
        </ListItemButton>
      </List>

      <Box sx={{ p: '16px 16px' }}>
        <ListSubheader
          component="div"
          id="nested-list-subheader"
          sx={{ p: '0' }}
        >
          {t('language')}
        </ListSubheader>

        <ToggleButtonGroup
          color="primary"
          value={locale}
          exclusive
          onChange={handleLocaleChange}
          aria-label="Language"
        >
          <ToggleButton value="en">EN</ToggleButton>
          <ToggleButton value="ru">RU</ToggleButton>
          <ToggleButton value="es">ES</ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  )

  return (
    <SwipeableDrawer
      open={open}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
    >
      {DrawerList}
    </SwipeableDrawer>
  )
}
