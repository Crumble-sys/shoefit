# ShoeFit - E-Commerce Sepatu

Sebuah aplikasi e-commerce modern untuk toko online penjualan sepatu dengan fitur lengkap menggunakan Next.js 16, Neon PostgreSQL, Better Auth, dan Drizzle ORM.

## Fitur Utama

### 1. **Autentikasi & Manajemen Pengguna**
- Registrasi dan login dengan email/password menggunakan Better Auth
- Session management yang aman
- Proteksi halaman yang memerlukan autentikasi

### 2. **Katalog Produk**
- Daftar produk dengan gambar, harga, dan deskripsi
- Sistem kategori produk
- Tracking stok produk real-time
- Halaman detail produk dengan informasi lengkap

### 3. **Keranjang Belanja**
- Tambah/hapus produk dari keranjang
- Ubah jumlah item
- Kalkulasi otomatis subtotal, pajak, dan total
- Tampilan keranjang yang responsif

### 4. **Checkout & Pemesanan**
- Form pengiriman yang lengkap
- Kalkulasi harga otomatis (subtotal + pajak 10%)
- Pembuatan pesanan dengan tracking item
- Konfirmasi pesanan

### 5. **Riwayat Pesanan**
- Lihat semua pesanan yang pernah dibuat
- Status pesanan (Menunggu, Dikirim, Selesai)
- Status pembayaran (Pending, Dibayar)
- Detail lengkap setiap pesanan

### 6. **Desain Responsif**
- Mobile-first design
- Optimized untuk semua ukuran layar
- Navigation bar yang responsif
- Card-based product layout

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Neon PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: Better Auth
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Package Manager**: pnpm

## Struktur Project

```
├── app/
│   ├── api/
│   │   └── auth/[...all]/route.ts       # Better Auth API routes
│   ├── actions/
│   │   ├── products.ts                  # Product server actions
│   │   ├── cart.ts                      # Cart server actions
│   │   └── orders.ts                    # Order server actions
│   ├── products/
│   │   ├── page.tsx                     # Product catalog
│   │   └── [id]/page.tsx                # Product detail
│   ├── cart/
│   │   └── page.tsx                     # Shopping cart
│   ├── orders/
│   │   ├── page.tsx                     # Orders list
│   │   └── [id]/page.tsx                # Order detail
│   ├── sign-in/page.tsx                 # Sign in page
│   ├── sign-up/page.tsx                 # Sign up page
│   ├── page.tsx                         # Home page
│   ├── layout.tsx                       # Root layout
│   └── globals.css                      # Global styles
├── lib/
│   ├── auth.ts                          # Better Auth config
│   ├── auth-client.ts                   # Auth client
│   └── db/
│       ├── index.ts                     # Drizzle client
│       └── schema.ts                    # Database schema
├── components/
│   ├── navbar.tsx                       # Navigation bar
│   ├── auth-form.tsx                    # Auth form
│   ├── product-card.tsx                 # Product card
│   └── ui/                              # shadcn UI components
└── public/
    └── product-*.jpg                    # Product images
```

## Database Schema

### Tables

#### `user` (Better Auth)
- `id`: Primary key
- `name`: User name
- `email`: User email (unique)
- `emailVerified`: Email verification status
- `image`: User avatar
- `createdAt`, `updatedAt`: Timestamps

#### `session` (Better Auth)
- Session management dengan expiration

#### `account` (Better Auth)
- Account credentials dan provider info

#### `verification` (Better Auth)
- Email verification tokens

#### `products`
- `id`: Product ID
- `name`: Product name
- `description`: Product description
- `price`: Product price (numeric)
- `image`: Product image URL
- `category`: Product category
- `stock`: Available stock

#### `cart_items`
- `id`: Cart item ID
- `userId`: Reference ke user
- `productId`: Reference ke product
- `quantity`: Item quantity
- `createdAt`, `updatedAt`: Timestamps

#### `orders`
- `id`: Order ID
- `userId`: Reference ke user
- `totalPrice`: Total order price
- `status`: Order status (pending, shipped, completed)
- `paymentStatus`: Payment status (pending, paid, failed)
- `shippingAddress`: Alamat pengiriman
- `createdAt`, `updatedAt`: Timestamps

#### `order_items`
- `id`: Order item ID
- `orderId`: Reference ke order
- `productId`: Reference ke product
- `quantity`: Item quantity in order
- `price`: Price at time of order

## Instalasi & Setup

### Prerequisite
- Node.js 18+ 
- pnpm (recommended)
- Neon PostgreSQL account

### Step-by-Step

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd shoebox-ecommerce
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Setup environment variables**
   Buat file `.env.local`:
   ```env
   DATABASE_URL=postgresql://...
   BETTER_AUTH_SECRET=your-secret-key
   ```
   
   Generate secret dengan:
   ```bash
   openssl rand -base64 32
   ```

4. **Setup database**
   Database tables sudah dibuat otomatis melalui Neon MCP

5. **Run development server**
   ```bash
   pnpm dev
   ```

6. **Akses aplikasi**
   Buka http://localhost:3000

## Penggunaan

### Sign Up
1. Klik "Daftar" di navbar
2. Masukkan nama, email, dan password
3. Klik "Buat Akun"
4. Otomatis login setelah sign up

### Browsing Produk
1. Klik "Produk" di navbar atau "Belanja Sekarang" di home
2. Lihat semua produk dengan harga dan gambar
3. Klik produk untuk melihat detail lengkap

### Menambah ke Keranjang
1. Di halaman produk, pilih jumlah
2. Klik "Tambah ke Keranjang"
3. Notification akan muncul konfirmasi

### Checkout
1. Klik "Keranjang" di navbar
2. Review items dan quantity
3. Masukkan alamat pengiriman
4. Klik "Lanjut ke Pembayaran"
5. Lihat halaman konfirmasi pesanan

### Lihat Pesanan
1. Klik "Pesanan" di navbar (setelah login)
2. Lihat semua pesanan dengan status
3. Klik pesanan untuk lihat detail

## Server Actions

Semua operasi data menggunakan Server Actions untuk keamanan:

### Products Actions
- `getProducts()`: Ambil semua produk
- `getProductById(id)`: Ambil detail produk
- `getProductsByCategory(category)`: Ambil produk by kategori

### Cart Actions
- `addToCart(productId, quantity)`: Tambah ke keranjang
- `getCart()`: Ambil isi keranjang
- `updateCartItem(cartItemId, quantity)`: Update jumlah item
- `removeFromCart(cartItemId)`: Hapus dari keranjang
- `clearCart()`: Kosongkan keranjang

### Orders Actions
- `createOrder(shippingAddress)`: Buat pesanan
- `getOrders()`: Ambil semua pesanan user
- `getOrderById(orderId)`: Ambil detail pesanan
- `updateOrderPaymentStatus(orderId, status)`: Update status pembayaran

## Keamanan

### Authentication
- Better Auth dengan email + password encryption
- Session-based authentication dengan expiration
- CSRF protection built-in

### Data Protection
- userId scoping pada semua query user-specific
- Server-side validation untuk semua operations
- Environment variables untuk credentials sensitif

### Best Practices
- Parameterized queries (Drizzle ORM)
- No sensitive data di client
- Secure session cookies (development: sameSite=none, secure=true)

## Integrasi Pembayaran (Future)

Aplikasi ini siap untuk integrasi Midtrans:
- Payment status tracking di database
- Webhook handling untuk payment confirmation
- Order status updates setelah pembayaran

## Sampel Data

Database sudah dilengkapi dengan 8 sampel produk:
1. Sepatu Lari Profesional - Rp 1.500.000
2. Sepatu Kasual Pria - Rp 850.000
3. Sepatu Olahraga Wanita - Rp 1.200.000
4. Sepatu Basket - Rp 1.800.000
5. Sepatu Formal Kulit - Rp 2.200.000
6. Sandal Pantai - Rp 350.000
7. Sepatu Hiking - Rp 1.600.000
8. Sepatu Kets Putih - Rp 750.000

## Deployment

Untuk deploy ke production:

1. **Siapkan environment variables di Vercel**
2. **Connect GitHub repository**
3. **Deploy dengan Vercel**

Semua file akan tersimpan secara otomatis.

## Troubleshooting

### Build Error: Module not found
Pastikan install semua dependencies:
```bash
pnpm install
```

### Database Connection Error
Check DATABASE_URL di `.env.local`

### Authentication Issues
- Pastikan BETTER_AUTH_SECRET sudah di-set
- Clear browser cookies jika ada issue

## Fitur yang Dapat Ditambahkan

1. **Admin Dashboard**
   - Manage produk (create, update, delete)
   - Lihat semua pesanan
   - Tracking revenue

2. **Pembayaran Midtrans**
   - Integrasi payment gateway
   - Webhook handling
   - Payment confirmation

3. **Review & Rating**
   - User reviews untuk produk
   - Star rating system
   - Review management

4. **Search & Filter**
   - Search produk by nama
   - Filter by kategori, harga
   - Sorting options

5. **Wishlist**
   - Save produk favorit
   - Share wishlist
   - Price notifications

6. **Analytics**
   - Sales tracking
   - Popular products
   - User analytics

## Development

### Menjalankan Dev Server
```bash
pnpm dev
```

### Build untuk Production
```bash
pnpm build
pnpm start
```

### Lint & Format
```bash
pnpm lint
```

## License

MIT License - feel free to use for personal atau commercial projects

## Support

Untuk pertanyaan atau issues, silakan buat GitHub issue atau hubungi tim development.

---

**Status**: ✅ Feature Complete - Ready for Midtrans Payment Integration

**Last Updated**: June 20, 2026
