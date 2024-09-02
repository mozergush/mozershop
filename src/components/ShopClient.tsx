'use client'

import React, { useState, useEffect } from 'react'
import { IProduct } from '@/types/common'
import {
  Container,
  Box,
  Card,
  Pagination,
  Slider,
  Select,
  MenuItem,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel
} from '@mui/material'
import ProductsGrid from '@/components/modules/ProductsGrid/ProductsGrid'
import { useDebouncedCallback } from 'use-debounce'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTranslations } from 'use-intl'
import NavBreadcrumbs from '@/components/elements/NavBreadcrumbs/NavBreadcrumbs'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import { Tilt } from 'react-tilt'
import { getComics } from '@/actions/server'

const defaultOptions = {
  reverse:        false,  // reverse the tilt direction
  max:            30,     // max tilt rotation (degrees)
  perspective:    2000,   // Transform perspective, the lower the more extreme the tilt gets.
  scale:          1.05,    // 2 = 200%, 1.5 = 150%, etc..
  speed:          1000,   // Speed of the enter/exit transition
  transition:     true,   // Set a transition on enter/exit.
  axis:           null,   // What axis should be disabled. Can be X or Y.
  reset:          true,    // If the tilt effect has to be reset on exit.
  easing:         'cubic-bezier(.03,.98,.52,.99)',    // Easing on enter/exit.
}

const priceMarks = [
  {
    value: 0,
    label: '0$',
  },
  {
    value: 1000,
    label: '1000$',
  },
]

export default function ShopClient({
  initialProducts,
  initialTotalPages,
  initialSearch,
  initialSort,
  initialCollection,
  initialPrice,
  initialPage,
  initialSpinner,
  defaultFilterParams
}: {
    initialProducts: IProduct[];
    initialTotalPages: number;
    initialSearch: string;
    initialSort: string;
    initialCollection: string;
    initialPrice: number[];
    defaultFilterParams: {
      search : string,
      sort : string,
      collection: string,
      price:number[]
    };
    initialPage: number;
    initialSpinner: boolean;
}) {
  const isMobile = useMediaQuery('(max-width:899px)')
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParamsInstance = useSearchParams()
  const t = useTranslations()
  const [products, setProducts] = useState<IProduct[]>(initialProducts)
  const [spinner, setSpinner] = useState(initialSpinner)
  const [totalPages, setTotalPages] = useState(initialTotalPages)
  const [mobileFilterPopup, setMobileFilterPopup] = React.useState(false)
  const [isFirstRender, setIsFirstRender] = useState(true)

  const handleMobileFilterPopupOpen = () => {
    setMobileFilterPopup(true)
  }

  const handleMobileFilterPopupClose = () => {
    setMobileFilterPopup(false)
  }

  const [search, setSearch] = useState(initialSearch)
  const [sort, setSort] = useState(initialSort)
  const [price, setPrice] = useState(initialPrice)
  const [collection, setCollection] = useState(initialCollection)
  const page = initialPage

  const handleSearch = (val:string) => {
    setSearch(val)
    const params = new URLSearchParams(window.location.search)
    if (val) {
      params.set('search', val)
    } else {
      params.delete('search')
    }

    params.delete('page')
    params.delete('c_search')
    replace(`${pathname}?${params.toString()}`)
  }

  const handleSort = (val:string) => {
    setSort(val)
    const params = new URLSearchParams(window.location.search)

    if (val && val != 'year-max') {
      params.set('sort', val)
    } else {
      params.delete('sort')
    }

    params.delete('page')
    replace(`${pathname}?${params.toString()}`)
  }

  const handleCollection = (val:string) => {
    const params = new URLSearchParams(window.location.search)

    setCollection(val)

    if (val && val != 'all') {
      params.set('collection', val)
    } else {
      params.delete('collection')
    }

    params.delete('page')
    params.delete('c_collection')
    replace(`${pathname}?${params.toString()}`)
  }

  const handlePrice = (val:string) => {
    setPrice(JSON.parse(val))
    const params = new URLSearchParams(window.location.search)

    if (val && val.toString() != [0, 1000].toString()) {
      params.set('price', JSON.stringify(val))
    } else {
      params.delete('price')
    }

    params.delete('page')
    replace(`${pathname}?${params.toString()}`)
  }

  const handlePage = (event: React.ChangeEvent<unknown>, val: number) => {
    const params = new URLSearchParams(window.location.search)

    if (val && val != 1) {
      params.set('page', JSON.stringify(val))
    } else {
      params.delete('page')
    }
    replace(`${pathname}?${params.toString()}`)

    debouncedFetchComics()
  }

  // Debounced fetchComics to prevent multiple calls
  const debouncedFetchComics = useDebouncedCallback(async () => {
    if (isFirstRender){
      setIsFirstRender(false)
      if (collection == defaultFilterParams.collection
          && search == defaultFilterParams.search
          && sort == defaultFilterParams.sort
          && price[0] == defaultFilterParams.price[0]
          && price[1] == defaultFilterParams.price[1]){
        return
      }
    }

    setSpinner(true)

    try {
      const comics = await getComics({
        search: search ?? undefined,
        page,
        sort: sort ?? undefined,
        collection: collection ?? undefined,
        price: JSON.stringify(price),
      })
      setProducts(JSON.parse(comics).data)
      setTotalPages(JSON.parse(comics).totalPages)
    } catch (error) {
      console.error('Failed to fetch comics', error)
    } finally {
      setSpinner(false)
    }
  }, 500)

  const saveMobileFilterPopup = async () => {
    debouncedFetchComics()
    handleMobileFilterPopupClose()
  }

  useEffect(() => {
    if (!isMobile) {
      debouncedFetchComics()
    }
  }, [collection, price, sort, search])

  const checkUrlParams = () => {
    const urlParams = new URLSearchParams(window.location.search)

    if (urlParams.has('c_collection') || urlParams.has('c_search')){
      if (urlParams.has('c_collection')) {
        handleCollection(urlParams.get('c_collection') || '')
        setPrice(defaultFilterParams.price)
        setSearch(defaultFilterParams.search)
        setSort(defaultFilterParams.sort)
      }

      if (urlParams.has('c_search')){
        handleSearch(urlParams.get('c_search') || '')
        setPrice(defaultFilterParams.price)
        setCollection(defaultFilterParams.collection)
        setSort(defaultFilterParams.sort)
      }

      if (isMobile){
        debouncedFetchComics()
      }
    }
  }

  useEffect(() => {
    checkUrlParams()
  }, [searchParamsInstance])

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
            {t('shop')}
          </Typography>

          <Grid container spacing={3} sx={{ marginTop: '20px' }}>
            <Grid xs={12} md={3}>
              <Card sx={{
                padding: '25px 15px 15px',
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column', gap: '25px'
              }}>
                <TextField
                  sx={{ width: '100%' }}
                  id="search"
                  label={t('search')}
                  placeholder={t('type_here')}
                  variant="outlined"
                  size="small"
                  onChange={(e) => {
                    handleSearch(e.target.value)
                  }}
                  value={search?.toString()}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <FormControl sx={{ width: '100%' }}>
                  <InputLabel id="demo-simple-select-label">
                    {t('sorting')}
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={sort}
                    size="small"
                    label={t('sorting')}
                    onChange={(e) => {
                      handleSort(e.target.value)
                    }}
                  >
                    <MenuItem value={'year-max'}>
                      {t('by_date_new_to_old')}
                    </MenuItem>
                    <MenuItem value={'year-min'}>
                      {t('by_date_old_to_new')}
                    </MenuItem>
                    <MenuItem value={'price-min'}>
                      {t('by_price_min_to_max')}
                    </MenuItem>
                    <MenuItem value={'price-max'}>
                      {t('by_price_max_to_min')}
                    </MenuItem>
                  </Select>
                </FormControl>

                <Box sx={{ width: 'auto' }}>
                  <FormControl>
                    <FormLabel id="filter-collection-label">Collection</FormLabel>
                    <RadioGroup
                      aria-labelledby="filter-collection-label"
                      name="collection"
                      onChange={(e) => {
                        handleCollection(e.target.value)
                      }}
                      value={collection}
                    >
                      <FormControlLabel
                        value="all"
                        control={<Radio />}
                        label={t('all')}
                      />
                      <FormControlLabel
                        value="spidermops"
                        control={<Radio />}
                        label="Spider Mops"
                      />
                      <FormControlLabel
                        value="punjrafee"
                        control={<Radio />}
                        label="Punjrafee"
                      />
                      <FormControlLabel
                        value="murmurjoke"
                        control={<Radio />}
                        label="Murmur JOKE"
                      />
                      <FormControlLabel
                        value="superpony"
                        control={<Radio />}
                        label="Superpony"
                      />
                    </RadioGroup>
                  </FormControl>
                </Box>

                <Box sx={{ width: 'auto' }}>
                  <InputLabel
                    variant="standard"
                    htmlFor="filter-price"
                    sx={{ marginBottom: '10px' }}
                  >
                    {t('price')}
                  </InputLabel>
                  <Box sx={{ padding: '0 10px' }}>
                    <Slider
                      name={'filter-price'}
                      getAriaLabel={() => 'Price range'}
                      value={price}
                      onChange={(e: Event) => {
                        const target = e.target as HTMLInputElement
                        if (target) {
                          handlePrice(target.value)
                        }
                      }}
                      valueLabelDisplay="auto"
                      min={0}
                      max={1000}
                      marks={priceMarks}
                    />
                  </Box>
                </Box>
              </Card>

              {isMobile && (
                <>
                  <Button
                    variant="contained"
                    onClick={handleMobileFilterPopupOpen}
                    sx={{
                      display: { xs: 'block', md: 'none' },
                      width: '100%'
                    }}
                  >
                    {t('open_filter_params')}
                  </Button>

                  <Dialog
                    open={mobileFilterPopup}
                    onClose={handleMobileFilterPopupClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <Box sx={{ width: '100%', maxWidth: '100%' }}>
                      <DialogTitle id="alert-dialog-title">
                        {t('set_filter_params')}
                      </DialogTitle>
                      <DialogContent sx={{ padding: '10px 24px 0 !important' }}>
                        <TextField
                          sx={{ width: '100%' }}
                          id="search"
                          label={t('search')}
                          placeholder={t('type_here')}
                          variant="outlined"
                          size="small"
                          onChange={(e) => {
                            handleSearch(e.target.value)
                          }}
                          value={search?.toString()}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />

                        <FormControl sx={{ width: '100%', marginTop: '20px' }}>
                          <InputLabel id="demo-simple-select-label">
                            {t('sorting')}
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={sort}
                            size="small"
                            label={t('sorting')}
                            onChange={(e) => {
                              handleSort(e.target.value)
                            }}
                          >
                            <MenuItem value={'year-max'}>
                              {t('by_date_new_to_old')}
                            </MenuItem>
                            <MenuItem value={'year-min'}>
                              {t('by_date_old_to_new')}
                            </MenuItem>
                            <MenuItem value={'price-min'}>
                              {t('by_price_min_to_max')}
                            </MenuItem>
                            <MenuItem value={'price-max'}>
                              {t('by_price_max_to_min')}
                            </MenuItem>
                          </Select>
                        </FormControl>

                        <Box sx={{ width: 'auto', marginTop: '20px' }}>
                          <FormControl>
                            <FormLabel id="filter-collection-label">
                              {t('collection')}
                            </FormLabel>
                            <RadioGroup
                              aria-labelledby="filter-collection-label"
                              name="collection"
                              onChange={(e) => {
                                handleCollection(e.target.value)
                              }}
                              value={collection}
                            >
                              <FormControlLabel
                                value="all"
                                control={<Radio />}
                                label={t('all')}
                              />
                              <FormControlLabel
                                value="spidermops"
                                control={<Radio />}
                                label="Spider Mops"
                              />
                              <FormControlLabel
                                value="punjrafee"
                                control={<Radio />}
                                label="Punjrafee"
                              />
                              <FormControlLabel
                                value="murmurjoke"
                                control={<Radio />}
                                label="Murmur JOKE"
                              />
                              <FormControlLabel
                                value="superpony"
                                control={<Radio />}
                                label="Superpony"
                              />
                            </RadioGroup>
                          </FormControl>
                        </Box>

                        <Box sx={{ width: 'auto', marginTop: '15px' }}>
                          <InputLabel
                            variant="standard"
                            htmlFor="filter-price"
                            sx={{ marginBottom: '10px' }}
                          >
                            {t('price')}
                          </InputLabel>
                          <Box sx={{ padding: '0 10px' }}>
                            <Slider
                              name={'filter-price'}
                              getAriaLabel={() => 'Price range'}
                              value={price}
                              onChange={(e: Event) => {
                                const target = e.target as HTMLInputElement
                                if (target) {
                                  handlePrice(target.value)
                                }
                              }}
                              valueLabelDisplay="auto"
                              min={0}
                              max={1000}
                              marks={priceMarks}
                            />
                          </Box>
                        </Box>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleMobileFilterPopupClose}>
                          {t('cancel')}
                        </Button>
                        <Button onClick={saveMobileFilterPopup}>
                          {t('update')}
                        </Button>
                      </DialogActions>
                    </Box>
                  </Dialog>
                </>
              )}
            </Grid>

            <Grid xs={12} md={9}>
              <ProductsGrid products={products} spinner={spinner} />

              {totalPages > 1 && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '20px',
                  }}
                >
                  <Tilt options={defaultOptions} className={`tilt-container`}>
                    <Card sx={{ padding: '10px' }}>
                      <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePage}
                      />
                    </Card>
                  </Tilt>
                </Box>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </main>
  )
}
