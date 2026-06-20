'use server'

import { db } from '@/lib/db'
import { products } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'

export async function getProducts() {
  return await db
    .select()
    .from(products)
    .orderBy(desc(products.createdAt))
}

export async function getProductById(id: number) {
  const result = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1)
  
  return result[0] || null
}

export async function getProductsByCategory(category: string) {
  return await db
    .select()
    .from(products)
    .where(eq(products.category, category))
}
