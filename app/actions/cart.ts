'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { cartItems, products } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { v4 as uuid } from 'uuid'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function addToCart(productId: string, quantity: number = 1) {
  const userId = await getUserId()
  
  // Check if item already in cart
  const existing = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.userId, userId), eq(cartItems.productId, productId)))
    .limit(1)
  
  if (existing.length > 0) {
    // Update quantity
    await db
      .update(cartItems)
      .set({ quantity: existing[0].quantity + quantity })
      .where(eq(cartItems.id, existing[0].id))
  } else {
    // Create new cart item
    await db.insert(cartItems).values({
      id: uuid(),
      userId,
      productId,
      quantity,
    })
  }
  
  revalidatePath('/cart')
  revalidatePath('/')
}

export async function getCart() {
  const userId = await getUserId()
  
  const items = await db
    .select({
      id: cartItems.id,
      productId: cartItems.productId,
      quantity: cartItems.quantity,
      product: {
        id: products.id,
        name: products.name,
        price: products.price,
        image: products.image,
      },
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.userId, userId))
  
  return items
}

export async function updateCartItem(cartItemId: string, quantity: number) {
  const userId = await getUserId()
  
  await db
    .update(cartItems)
    .set({ quantity })
    .where(and(eq(cartItems.id, cartItemId), eq(cartItems.userId, userId)))
  
  revalidatePath('/cart')
}

export async function removeFromCart(cartItemId: string) {
  const userId = await getUserId()
  
  await db
    .delete(cartItems)
    .where(and(eq(cartItems.id, cartItemId), eq(cartItems.userId, userId)))
  
  revalidatePath('/cart')
}

export async function clearCart() {
  const userId = await getUserId()
  
  await db.delete(cartItems).where(eq(cartItems.userId, userId))
  
  revalidatePath('/cart')
}
