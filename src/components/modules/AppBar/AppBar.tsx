'use client'
import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircle from '@mui/icons-material/AccountCircle'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import { usePathname } from 'next/navigation'
import DrawedList from './DrawedList'
import useMediaQuery from '@mui/material/useMediaQuery'
import SearchModal from '@/components/elements/SearchModal/SearchModal'
import LoginPopup from '@/components/modules/AuthPopups/LoginPopup'
import RegisterPopup from '@/components/modules/AuthPopups/RegisterPopup'
import { Badge, CircularProgress } from '@mui/material'
import { useAuth } from '@/context/auth'
import { useEffect } from 'react'
import { logincheck } from '@/actions/server'
import Link from 'next/link'
import { useCart } from '@/context/cart'
import { Box } from '@mui/material'
import { useTranslations } from 'use-intl'

export default function MenuAppBar() {
  const [drawerOpen, setDrawer] = React.useState(false)
  const [userMenuEl, setUserMenuEl] = React.useState<null | HTMLElement>(null)
  const t = useTranslations()

  const pathname = usePathname()
  const matches = useMediaQuery('(max-width: 768px)')
  const { cart } = useCart()

  const totalItems = Object.values(cart).reduce(
    (acc, quantity) => acc + quantity,
    0
  )

  const {
    isAuth,
    handleIsAuth,
    handleLogout,
    updateUser,
    loginCheckSpinner,
    handleLoginCheckSpinner,
    loginPopupOpen,
    setLoginPopup,
    registerPopupOpen,
    setRegisterPopup,
  } = useAuth()

  // state for search popup
  const [searchOpen, setSearchOpen] = React.useState(false)

  const handleSearch = (val: boolean) => {
    setSearchOpen(val)
    if (val) {
      setDrawer(false)
    }
  }

  const handleLoginPopupOpen = () => {
    setLoginPopup(true)
    handleUserMenuClose()
    handleRegisterPopupClose()
  }

  const handleLoginPopupClose = () => {
    setLoginPopup(false)
    handleUserMenuClose()
  }

  const handleRegisterPopupOpen = () => {
    setRegisterPopup(true)
    handleUserMenuClose()
    handleLoginPopupClose()
  }

  const handleRegisterPopupClose = () => {
    setRegisterPopup(false)
    handleUserMenuClose()
  }

  const toggleDrawer = (newOpen: boolean) => () => {
    setDrawer(newOpen)
  }

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuEl(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setUserMenuEl(null)
  }

  async function loginCheck() {
    if (localStorage.hasOwnProperty('auth')) {
      const check = await logincheck(localStorage.getItem('auth') as string)

      if (check.user) {
        updateUser(check.user)
        handleIsAuth(true)
      }

      if (check.error) {
        console.log(check.error)
        handleIsAuth(false)
      }

      handleLoginCheckSpinner(false)
    } else {
      handleIsAuth(false)
      handleLoginCheckSpinner(false)
    }
  }

  useEffect(() => {
    loginCheck()
  }, [isAuth])

  const handleLogoutClick = () => {
    handleLogout()
    handleUserMenuClose()
  }

  return (
    <header>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {pathname == '/' ? (
              'Mozershop'
            ) : (
              <Box sx={{ display: 'inline-block' }}>
                <Link href="/" >
                  <Box>Mozershop</Box>
                </Link>
              </Box>
            )}
          </Typography>

          <div hidden={matches}>
            <IconButton
              size="large"
              aria-label="search"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
              onClick={() => {
                handleSearch(true)
              }}
            >
              <SearchIcon />
            </IconButton>
          </div>

          <div>
            <Link href="/cart">
              <IconButton
                size="large"
                aria-label="cart"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
              >
                <Badge badgeContent={totalItems} color="secondary">
                  <ShoppingBagIcon />
                </Badge>
              </IconButton>
            </Link>
          </div>

          <div>
            {isAuth ? (
              <>
                <IconButton
                  size="large"
                  aria-label="account"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleUserMenuOpen}
                  color="inherit"
                  sx={{
                    width: '48px',
                    height: '48px',
                  }}
                >
                  🤠
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={userMenuEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(userMenuEl)}
                  onClose={handleUserMenuClose}
                >
                  <Link href={'/dashboard'} onClick={handleUserMenuClose}>
                    <MenuItem>{t('dashboard')}</MenuItem>
                  </Link>
                  <MenuItem onClick={handleLogoutClick}>
                    {t('logout')}
                  </MenuItem>
                </Menu>
              </>
            ) : loginCheckSpinner ? (
              <>
                <IconButton
                  size="large"
                  aria-label="account"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleUserMenuOpen}
                  color="inherit"
                >
                  <CircularProgress color="inherit" size={24} />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton
                  size="large"
                  aria-label="account"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleUserMenuOpen}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={userMenuEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(userMenuEl)}
                  onClose={handleUserMenuClose}
                >
                  <MenuItem onClick={handleLoginPopupOpen}>
                    {t('login')}
                  </MenuItem>
                  <MenuItem onClick={handleRegisterPopupOpen}>
                    {t('registration')}
                  </MenuItem>
                </Menu>
              </>
            )}
          </div>
        </Toolbar>
      </AppBar>

      <DrawedList
        toggleDrawer={toggleDrawer}
        open={drawerOpen}
        handleSearchOpen={() => {
          handleSearch(true)
        }}
      />

      <SearchModal
        open={searchOpen}
        handleClose={() => {
          handleSearch(false)
        }}
      />

      <LoginPopup
        open={loginPopupOpen}
        handleClose={handleLoginPopupClose}
        handleRegisterPopupOpen={handleRegisterPopupOpen}
      />

      <RegisterPopup
        open={registerPopupOpen}
        handleClose={handleRegisterPopupClose}
        handleLoginPopupOpen={handleLoginPopupOpen}
      />
    </header>
  )
}
