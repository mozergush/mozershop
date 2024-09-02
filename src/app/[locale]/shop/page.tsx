import React from 'react'
import ShopClient from '@/components/ShopClient'
import { getComics } from '@/actions/server'

const defaultFilterParams = {
  search: '',
  sort: 'year-max',
  collection: 'all',
  price: [0, 1000]
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: {
    search?: string;
    sort?: string;
    collection?: string;
    price?: string;
    page?: string;
    c_collection?: string;
    c_search?: string;
  };
}) {
  // Get search params
  const { search, sort, collection, price, page, c_collection, c_search } = searchParams

  const initialData = await getComics({
    search: search ?? defaultFilterParams.search,
    sort: sort ?? defaultFilterParams.sort,
    collection: collection ?? defaultFilterParams.collection,
    price: price ? JSON.stringify(price) : JSON.stringify(defaultFilterParams.price),
    page: page ? Number(page) : 1,
  })

  return (
    <ShopClient
      initialProducts={JSON.parse(initialData).data}
      initialTotalPages={JSON.parse(initialData).totalPages}
      initialSearch={search || defaultFilterParams.search}
      initialSort={sort || defaultFilterParams.sort}
      initialCollection={collection || defaultFilterParams.collection}
      initialPrice={price ? JSON.parse(price) : defaultFilterParams.price}
      initialPage={page ? Number(page) : 1}
      initialSpinner={
        !!(
          search ||
            sort ||
            collection ||
            price ||
            (c_collection && c_collection != defaultFilterParams.collection) ||
            (c_search && c_search != defaultFilterParams.search)
        )
      }
      defaultFilterParams = {defaultFilterParams}
    />
  )
}
