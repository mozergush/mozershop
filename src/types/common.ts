export interface IProduct {
  _id: string
  category?: string
  collection?: string
  price: number
  pages?: number
  year?: number
  name?: string
  description?: string
  characteristics?: { [index: string]: string }
  images?: string[]
  isBestseller?: boolean
  errorMessage?: string
}

export interface IProductCardProps {
  item: IProduct
}

export interface LineItem {
  id: string
  object: string
  amount_discount: number
  amount_subtotal: number
  amount_tax: number
  amount_total: number
  currency: string
  description: string
  price: {
    id: string
    object: string
    active: boolean
    billing_scheme: string
    created: number
    currency: string
    unit_amount: number
    unit_amount_decimal: string
  }
  quantity: number
}

export interface Order {
  id: string
  object: string
  amount: number
  created: number
  currency: string
  customer: string
  status: string
  shipping: {
    address: {
      city: string
      country: string
      line1: string
      line2: string | null
      postal_code: string
      state: string
    }
    name: string
  }
  items: LineItem[]
}
