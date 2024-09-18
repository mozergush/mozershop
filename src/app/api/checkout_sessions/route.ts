import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getCartProducts } from '@/actions/server'
type Product = {
  [key: string]: number
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function POST(request: Request) {
  try {
    // Парсим данные из формы
    const formData = await request.formData()
    const cartEntry = formData.get('cart')
    if (!cartEntry) {
      throw new Error('Cart data is required')
    }
    const cart = JSON.parse(cartEntry as string)
    const emailEntry = formData.get('user')
    const email = typeof emailEntry === 'string' ? emailEntry : undefined

    if (!email) {
      throw new Error('Email is required and must be a string')
    }

    const productIdsString = await getCartProducts({ cart })
    const productIds = JSON.parse(productIdsString)

    // Найти клиента по email или создать нового
    let customer = (await stripe.customers.list({ email })).data[0]

    if (!customer) {
      customer = await stripe.customers.create({
        email: email,
      })
    }

    // Формируем line_items из productIds
    const line_items = productIds.map((product: Product) => ({
      price: Object.keys(product)[0],
      quantity: Object.values(product)[0],
    }))

    // Create Checkout Sessions
    const session = await stripe.checkout.sessions.create({
      line_items,
      customer: customer.id,
      mode: 'payment',
      success_url: `https://mozershop.vercel.app/success`,
      cancel_url: `https://mozershop.vercel.app/cart?status=canceled`,
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
    })

    // console.log(session)

    if (session.url) {
      return NextResponse.redirect(session.url, 303)
    } else {
      throw new Error('Session URL is null')
    }
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : 'An unknown error occurred'

    // Type guard to check if err has a statusCode property
    const statusCode =
      err instanceof Error && (err as { statusCode?: number }).statusCode
        ? (err as { statusCode?: number }).statusCode
        : 500

    return new NextResponse(JSON.stringify({ error: errorMessage }), {
      status: statusCode,
    })
  }
}
