'use client'
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import * as React from 'react'

interface CartContextType {
  cart: { [key: string]: number }
  addProduct: (id: string) => void
  removeProduct: (id: string) => void
  deleteProduct: (id: string) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('cart')) {
      const storedCart = JSON.parse(localStorage.getItem('cart') || '{}')
      setCart(storedCart)
    }
  }, [])

  const addProduct = (id: string) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart }
      if (newCart[id]) {
        newCart[id]++
      } else {
        newCart[id] = 1
      }

      localStorage.setItem('cart', JSON.stringify(newCart))

      return newCart
    })
  }

  const removeProduct = (id: string) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart }
      if (newCart[id] && newCart[id] > 1) {
        newCart[id]--
      } else {
        delete newCart[id]
      }

      localStorage.setItem('cart', JSON.stringify(newCart))

      return newCart
    })
  }

  const deleteProduct = (id: string) => {
    setCart((prevCart) => {
      // Create a new object without the id key
      const newCart = { ...prevCart }
      delete newCart[id]

      localStorage.setItem('cart', JSON.stringify(newCart))

      return newCart
    })
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addProduct,
        removeProduct,
        deleteProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within an CartProvider')
  }
  return context
}
