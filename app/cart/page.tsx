'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { getCart, removeFromCart, updateCartItem, clearCart } from '@/app/actions/cart'
import { createOrder } from '@/app/actions/orders'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { useSession } from '@/lib/auth-client'

interface CartItem {
  id: string
  productId: string
  quantity: number
  product: {
    id: string
    name: string
    price: string
    image: string | null
  }
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [shippingAddress, setShippingAddress] = useState('')
  const [processingOrder, setProcessingOrder] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!session?.user) {
      router.push('/sign-in')
      return
    }

    fetchCart()
  }, [session, router])

  const fetchCart = async () => {
    try {
      const items = await getCart()
      setCartItems(items as CartItem[])
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (cartItemId: string) => {
    try {
      await removeFromCart(cartItemId)
      await fetchCart()
    } catch (error) {
      alert('Gagal menghapus item')
    }
  }

  const handleUpdateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    try {
      await updateCartItem(cartItemId, newQuantity)
      await fetchCart()
    } catch (error) {
      alert('Gagal memperbarui jumlah')
    }
  }

  const handleCheckout = async () => {
    if (!shippingAddress.trim()) {
      alert('Silakan masukkan alamat pengiriman')
      return
    }

    setProcessingOrder(true)
    try {
      const orderId = await createOrder(shippingAddress)
      alert('Pesanan berhasil dibuat!')
      router.push(`/orders/${orderId}`)
    } catch (error) {
      alert('Gagal membuat pesanan: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setProcessingOrder(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">Memuat keranjang...</p>
      </div>
    )
  }

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (parseFloat(item.product.price) * item.quantity)
  }, 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <Link href="/products" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft size={20} />
          Kembali ke Produk
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 mb-8">Keranjang Belanja</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-slate-600 mb-4">Keranjang Anda kosong</p>
            <Link href="/products">
              <Button>Lanjut Berbelanja</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-6 border-b border-slate-200 hover:bg-slate-50 transition">
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-24 h-24 bg-slate-100 rounded-lg overflow-hidden">
                      {item.product.image ? (
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          width={96}
                          height={96}
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-grow">
                      <h3 className="font-semibold text-slate-900 mb-1">{item.product.name}</h3>
                      <p className="text-blue-600 font-semibold mb-3">
                        Rp {parseFloat(item.product.price).toLocaleString('id-ID')}
                      </p>

                      {/* Quantity Control */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-100 transition"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-100 transition"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Subtotal & Delete */}
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-red-600 hover:text-red-700 transition"
                      >
                        <Trash2 size={20} />
                      </button>
                      <p className="font-semibold text-slate-900">
                        Rp {(parseFloat(item.product.price) * item.quantity).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary & Checkout */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Ringkasan Pesanan</h2>

                {/* Summary */}
                <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Pajak (10%)</span>
                    <span>Rp {tax.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-slate-900">
                    <span>Total</span>
                    <span>Rp {total.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Alamat Pengiriman
                  </label>
                  <textarea
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Masukkan alamat lengkap pengiriman Anda"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={4}
                  />
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  disabled={processingOrder || !shippingAddress.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold py-3 rounded-lg transition"
                >
                  {processingOrder ? 'Memproses...' : 'Lanjut ke Pembayaran'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
