import { pgTable, text, timestamp, boolean, integer, numeric, uuid } from 'drizzle-orm/pg-core'

// --- Better Auth required tables (neon_auth schema) ---

export const user = pgTable('user', {
  id: uuid('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified'),
  image: text('image'),
  role: text('role'),
  banned: boolean('banned'),
  banReason: text('banReason'),
  banExpires: timestamp('banExpires', { withTimezone: true }),
  createdAt: timestamp('createdAt', { withTimezone: true }),
  updatedAt: timestamp('updatedAt', { withTimezone: true }),
})

export const session = pgTable('session', {
  id: uuid('id').primaryKey(),
  expiresAt: timestamp('expiresAt', { withTimezone: true }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt', { withTimezone: true }),
  updatedAt: timestamp('updatedAt', { withTimezone: true }),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: uuid('userId').notNull(),
  activeOrganizationId: text('activeOrganizationId'),
  impersonatedBy: text('impersonatedBy'),
})

export const account = pgTable('account', {
  id: uuid('id').primaryKey(),
  userId: uuid('userId').notNull(),
  providerId: text('providerId').notNull(),
  accountId: text('accountId').notNull(),
  password: text('password'),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt', { withTimezone: true }),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt', { withTimezone: true }),
  scope: text('scope'),
  createdAt: timestamp('createdAt', { withTimezone: true }),
  updatedAt: timestamp('updatedAt', { withTimezone: true }),
})

export const verification = pgTable('verification', {
  id: uuid('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt', { withTimezone: true }).notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true }),
  updatedAt: timestamp('updatedAt', { withTimezone: true }),
})

// --- App tables: E-commerce ---

export const products = pgTable('products', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  image: text('image'),
  category: text('category'),
  stock: integer('stock').notNull().default(0),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const cartItems = pgTable('cart_items', {
  id: uuid('id').primaryKey(),
  userId: uuid('userId').notNull(),
  productId: integer('productId').notNull().references(() => products.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull().default(1),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey(),
  userId: uuid('userId').notNull(),
  totalPrice: numeric('totalPrice', { precision: 10, scale: 2 }).notNull(),
  status: text('status').notNull().default('pending'),
  paymentStatus: text('paymentStatus').notNull().default('pending'),
  shippingAddress: text('shippingAddress'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey(),
  orderId: uuid('orderId').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: integer('productId').notNull().references(() => products.id),
  quantity: integer('quantity').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})
