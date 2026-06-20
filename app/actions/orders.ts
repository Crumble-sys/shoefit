'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { orders, orderItems, cartItems, products } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { v4 as uuid } from 'uuid'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function createOrder(shippingAddress: string) {
  const userId = await getUserId()
  
  // Get cart items
  const cartItemsList = await db
    .select({
      id: cartItems.id,
      productId: cartItems.productId,
      quantity: cartItems.quantity,
      product: {
        price: products.price,
      },
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.userId, userId))
  
  if (cartItemsList.length === 0) {
    throw new Error('Cart is empty')
  }
  
  // Calculate total
  const totalPrice = cartItemsList.reduce((sum: any, item: any) => {
    return sum + (parseFloat(item.product.price) * item.quantity)
  }, 0)
  
  // Create order
  const orderId = uuid()
  await db.insert(orders).values({
    id: orderId,
    userId,
    totalPrice: totalPrice.toString(),
    shippingAddress,
    status: 'pending',
    paymentStatus: 'pending',
  })
  
  // Create order items
  for (const item of cartItemsList) {
    await db.insert(orderItems).values({
      id: uuid(),
      orderId,
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
    })
  }
  
  // Clear cart
  await db.delete(cartItems).where(eq(cartItems.userId, userId))
  
  revalidatePath('/orders')
  revalidatePath('/cart')
  
  return orderId
}

export async function getOrders() {
  const userId = await getUserId()
  
  return await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
}

export async function getOrderById(orderId: string) {
  const userId = await getUserId()
  
  const order = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.userId, userId)))
    .limit(1)
  
  if (!order.length) throw new Error('Order not found')
  
  const items = await db
    .select({
      id: orderItems.id,
      quantity: orderItems.quantity,
      price: orderItems.price,
      product: {
        id: products.id,
        name: products.name,
        image: products.image,
      },
    })
    .from(orderItems)
    .innerJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orderItems.orderId, orderId))
  
  return { ...order[0], items }
}

export async function updateOrderPaymentStatus(orderId: string, status: 'paid' | 'failed') {
  const userId = await getUserId()
  
  await db
    .update(orders)
    .set({ paymentStatus: status })
    .where(and(eq(orders.id, orderId), eq(orders.userId, userId)))
  
  revalidatePath('/orders')
}
