'use server'
/* eslint-disable */
import bcrypt from 'bcryptjs'
import clientPromise from '@/lib/mongodb'
import { z } from 'zod'
import { Db, ObjectId } from 'mongodb'
import {
  getDb,
  generateTokens,
  isValidAccessToken,
  parseJwt,
} from '@/actions/functions'
import { sendMail } from '@/actions/services/mailService'
import Stripe from 'stripe'
import { Order } from '@/types/common'

const POSTS_PER_PAGE = 6

const RegisterFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .trim(),
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long.' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
})

const ChangePasswordFormSchema = z.object({
  newpassword: z
    .string()
    .min(8, { message: 'Be at least 8 characters long.' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
})

export async function login(formData: FormData) {
  const email = formData.get('email')
  const password = formData.get('password')

  try {
    const { db } = await getDb(clientPromise)
    const user = await findUserByEmail(db, email)

    if (!user) {
      return {
        message: 'User not exist',
      }
    }

    if (!bcrypt.compareSync(password as string, user.password)) {
      return {
        message: 'Wrong login or password',
      }
    }

    const tokens = generateTokens(user.name, email as string)

    return {
      tokens: JSON.stringify(tokens),
    }
  } catch (err) {
    return {
      message: 'Something went wrong',
    }
  }
}

export async function register(formData: FormData) {
  const validationResult = RegisterFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
      message:
        'One or more fields contain an error. Please check and send again',
    }
  }

  const { name, email, password } = validationResult.data

  try {
    const { db } = await getDb(clientPromise)
    const user = await findUserByEmail(db, email)

    if (user) {
      return {
        message: 'User already exist',
      }
    }

    const tokens = await createUserAndGenerateTokens(db, {
      name,
      password,
      email,
    })

    return {
      tokens: JSON.stringify(tokens),
    }
  } catch (err) {
    return {
      message: 'Something went wrong',
    }
  }
}

export const createUserAndGenerateTokens = async (
  db: Db,
  reqBody: {
    name: string
    password: string
    email: string
    image?: string
  }
) => {
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(reqBody.password, salt)

  const result = await db.collection('users').insertOne({
    name: reqBody.name,
    password: hash,
    email: reqBody.email,
    image: reqBody.image ? reqBody.image : '',
    role: 'user',
  })

  if (result) {
    return generateTokens(reqBody.name, reqBody.email)
  } else {
    return false
  }
}

export const findUserByEmail = async (
  db: Db,
  email: FormDataEntryValue | null
) => db.collection('users').findOne({ email })

export async function oauth(reqBody: any) {
  const { db } = await getDb(clientPromise)
  const user = await findUserByEmail(db, reqBody.email)

  if (!user) {
    const tokens = await createUserAndGenerateTokens(db, {
      name: reqBody.displayName,
      email: reqBody.email,
      password: reqBody.uid,
      image: reqBody.photoURL,
    })

    await sendMail(
      'Mozerstore',
      'themozergush@gmail.com',
      `Welcome to my store! Here are your login details - login: ${reqBody.email}, password: ${reqBody.uid}`
    )

    return {
      tokens: JSON.stringify(tokens),
    }
  }

  const tokens = generateTokens(user.name, reqBody.email)

  return {
    tokens: JSON.stringify(tokens),
  }
}

export const logincheck = async (data: string) => {
  try {
    const { db } = await getDb(clientPromise)
    const validatedTokenResult = await isValidAccessToken(data)

    if (validatedTokenResult.status === 200) {
      return {
        error: validatedTokenResult,
      }
    }

    const user = await findUserByEmail(db, parseJwt(data as string).email)

    if (user) {
      return {
        user: {
          name: user.name,
          image: user.image ? user.image : '',
          role: user.role,
          email: user.email,
        },
      }
    } else {
      return {
        error: 'User not exist',
      }
    }
  } catch {
    return {
      error: 'Login check failed',
    }
  }
}

export const getComics = async ({
  search,
  page,
  collection,
  sort,
  price,
  isBestseller,
  exclude,
  include,
}: {
  search?: string
  page?: number
  collection?: string
  sort?: string
  price?: string
  isBestseller?: boolean
  exclude?: string[] | string
  include?: string[] | string
}) => {
  const { db } = await getDb(clientPromise)

  type Query = {
    name?: RegExp
    collection?: string
    price?: {
      $gte?: number
      $lte?: number
    }
    isBestseller?: boolean
    _id?: { $nin?: any[]; $in?: any[] }
  }

  const query: Query = {}

  if (search) {
    query.name = new RegExp(search, 'i')
  }

  if (collection && collection != 'all') {
    query.collection = collection
  }

  if (price) {
    const [priceMin, priceMax] = JSON.parse(price)
    if (priceMin !== undefined || priceMax !== undefined) {
      query.price = {}
      if (priceMin !== undefined) {
        query.price.$gte = parseFloat(priceMin)
      }
      if (priceMax !== undefined) {
        query.price.$lte = parseFloat(priceMax)
      }
    }
  }

  if (isBestseller !== undefined) {
    query.isBestseller = isBestseller
  }

  // Обработка параметра exclude
  if (exclude) {
    let excludeArray: ObjectId[]
    if (typeof exclude === 'string') {
      excludeArray = [new ObjectId(exclude)]
    } else {
      excludeArray = exclude.map((id) => new ObjectId(id))
    }

    query._id = { $nin: excludeArray }
  }

  // Обработка параметра include
  if (include) {
    let includeArray: ObjectId[]
    if (typeof include === 'string') {
      includeArray = [new ObjectId(include)]
    } else {
      includeArray = include.map((id) => new ObjectId(id))
    }

    // Если query._id уже содержит $nin
    if (query._id && query._id.$nin) {
      query._id = { ...query._id, $in: includeArray }
    } else {
      query._id = { $in: includeArray }
    }
  }

  type sortQuery = {
    [key: string]: 1 | -1
  }
  const sortQuery: sortQuery = {}
  if (sort) {
    const [key, order] = sort.split('-')
    sortQuery[key] = order === 'min' ? 1 : -1
  }

  type options = {
    sort?: sortQuery
  }

  const options: options = {}
  if (Object.keys(sortQuery).length > 0) {
    options.sort = sortQuery
  }

  const skip = page ? (page - 1) * POSTS_PER_PAGE : 0
  const limit = page ? POSTS_PER_PAGE : 0

  const data = await db
    .collection('comics')
    .find(query)
    .sort(sortQuery)
    .skip(skip)
    .limit(limit)
    .toArray()

  const totalDocuments = await db.collection('comics').countDocuments(query)

  // Расчет общего количества страниц
  const totalPages = Math.ceil(totalDocuments / POSTS_PER_PAGE)

  return JSON.stringify({ data, totalPages })
}

export const getOneComics = async ({ id }: { id: string }) => {
  const { db } = await getDb(clientPromise)

  try {
    const comix = await db
      .collection('comics')
      .findOne({ _id: new ObjectId(id) })

    if (!comix) {
      throw new Error('Comic not found')
    }

    return JSON.stringify(comix)
  } catch (error) {
    if (error instanceof Error) {
      return JSON.stringify({ error: error.message })
    } else {
      return JSON.stringify({ error: 'An unknown error occurred' })
    }
  }
}

export const getCartProducts = async ({
  cart,
}: {
  cart: { [key: string]: number }
}) => {
  const { db } = await getDb(clientPromise)

  try {
    const productIds = Object.keys(cart).map((id) => new ObjectId(id))
    const products = await db
      .collection('comics')
      .find({ _id: { $in: productIds } })
      .toArray()

    if (!products || products.length === 0) {
      throw new Error('Products not found')
    }

    const result = products.map((product) => ({
      [product.productId.toString()]: cart[product._id.toString()],
    }))

    return JSON.stringify(result)
  } catch (error) {
    if (error instanceof Error) {
      return JSON.stringify({ error: error.message })
    } else {
      return JSON.stringify({ error: 'An unknown error occurred' })
    }
  }
}

export const getOrders = async function (email: string): Promise<Order[]> {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY

  if (!stripeSecretKey) {
    throw new Error('Stripe secret key is not defined')
  }

  const stripe = new Stripe(stripeSecretKey)

  try {
    const customers = await stripe.customers.list({ email })

    if (customers.data.length === 0) {
      console.log('No customers found for this email')
      return []
    }

    const customerId = customers.data[0].id
    const paymentIntents = await stripe.paymentIntents.list({
      customer: customerId,
    })
    const checkoutSessions = await stripe.checkout.sessions.list({
      customer: customerId,
    })

    const sessionMap = new Map()
    checkoutSessions.data.forEach((session) => {
      sessionMap.set(session.payment_intent, session)
    })

    const orders = await Promise.all(
      paymentIntents.data.map(async (payment) => {
        const session = sessionMap.get(payment.id)
        if (session) {
          const lineItems = await stripe.checkout.sessions.listLineItems(
            session.id
          )
          const items = lineItems.data.map((item) => ({
            id: item.id,
            object: item.object,
            amount_discount: item.amount_discount,
            amount_subtotal: item.amount_subtotal,
            amount_tax: item.amount_tax,
            amount_total: item.amount_total,
            currency: item.currency,
            description: item.description,
            price: item.price
              ? {
                id: item.price.id,
                object: item.price.object,
                active: item.price.active,
                billing_scheme: item.price.billing_scheme,
                created: item.price.created,
                currency: item.price.currency,
                unit_amount: item.price.unit_amount,
                unit_amount_decimal: item.price.unit_amount_decimal,
              }
              : null,
            quantity: item.quantity,
          }))

          return {
            id: payment.id,
            object: payment.object,
            amount: payment.amount,
            created: payment.created,
            currency: payment.currency,
            customer: payment.customer as string,
            status: payment.status,
            shipping: payment.shipping
              ? {
                address: payment.shipping.address
                  ? {
                    city: payment.shipping.address.city,
                    country: payment.shipping.address.country,
                    line1: payment.shipping.address.line1,
                    line2: payment.shipping.address.line2,
                    postal_code: payment.shipping.address.postal_code,
                    state: payment.shipping.address.state,
                  }
                  : null,
                name: payment.shipping.name,
              }
              : null,
            items,
          } as Order
        } else {
          return null
        }
      })
    )

    return orders.filter((order): order is Order => order !== null)
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
    } else {
      console.log(String(error))
    }
    return []
  }
}

async function verifyPassword(
  storedPassword: string,
  inputPassword: string
): Promise<boolean> {
  return bcrypt.compare(inputPassword, storedPassword)
}

export async function changePassword(formData: FormData) {
  const email = formData.get('user')
  const oldpassword = formData.get('oldpassword')

  if (typeof oldpassword !== 'string') {
    return {
      message: 'Old Password must be provided',
    }
  }

  if (typeof email !== 'string') {
    return {
      message: 'Email must be provided',
    }
  }

  const validationResult = ChangePasswordFormSchema.safeParse({
    newpassword: formData.get('newpassword'),
  })

  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
      message: 'Validation problems',
    }
  }

  const { newpassword } = validationResult.data

  try {
    const { db } = await getDb(clientPromise)
    const user = await findUserByEmail(db, email)

    if (!user) {
      return {
        message: 'User does not exist',
      }
    }

    // Verify the old password
    const isPasswordValid = await verifyPassword(user.password, oldpassword)
    if (!isPasswordValid) {
      return {
        message: 'Old password is incorrect',
      }
    }

    // Hash the new password
    const salt = bcrypt.genSaltSync(10)
    const hashedNewPassword = bcrypt.hashSync(newpassword, salt)

    // Update the user's password
    await updateUserPassword(db, email, hashedNewPassword)

    return {
      success: true,
    }
  } catch (err) {
    return {
      message: 'Something went wrong',
    }
  }
}

async function updateUserPassword(
  db: any,
  email: string,
  newPassword: string
): Promise<void> {
  await db
    .collection('users')
    .updateOne({ email: email }, { $set: { password: newPassword } })
}
