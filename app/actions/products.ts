'use server'

import { db } from '@/lib/db'
import { products } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'

export async function getProducts() {
  return await db
    .select()
    .from(products)
    .orderBy(desc(products.createdAt))
}

export async function getProductById(id: string) {
  const result = await db
    .select()
    .from(products)
    .where((p: any) => p.id === id)
    .limit(1)
  
  return result[0] || null
}

export async function getProductsByCategory(category: string) {
  return await db
    .select()
    .from(products)
    .where((p: any) => p.category === category)
}
