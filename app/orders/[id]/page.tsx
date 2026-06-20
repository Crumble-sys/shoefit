'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'
import { getOrderById } from '@/app/actions/orders'
import { useSession } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Package } from 'lucide-react'

interface OrderItem {
  id: string
  quantity: number
  price: string
  product: {
    id: string
    name: string
    image: string | null
  }
}

interface Order {
  id: string
  totalPrice: string
  status: string
  paymentStatus: string
  shippingAddress: string
  createdAt: Date
  items: OrderItem[]
}

export default function OrderDetailPage() {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string

  useEffect(() => {
    if (!session?.user) {
      router.push('/sign-in')
      return
    }

    fetchOrder()
  }, [session, router, orderId])

  const fetchOrder = async () => {
    try {
      const orderData = await getOrderById(orderId)
      setOrder(orderData)
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">Memuat pesanan...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Pesanan tidak ditemukan</p>
          <Link href="/orders">
            <Button>Kembali ke Pesanan</Button>
          </Link>
        </div>
      </div>
    )
  }

  const subtotal = order.items.reduce((sum, item) => {
    return sum + (parseFloat(item.price) * item.quantity)
  }, 0)
  const tax = subtotal * 0.1
  const total = parseFloat(order.totalPrice)

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <Link href="/orders" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft size={20} />
          Kembali ke Pesanan
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Pesanan #{order.id.slice(0, 8)}</h1>
              <p className="text-slate-600">
                {new Date(order.createdAt).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className="text-right">
              <div className="flex gap-2 mb-4">
                <span className={`px-4 py-2 rounded-full font-medium ${
                  order.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : order.status === 'shipped'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status === 'completed' ? 'Selesai' : order.status === 'shipped' ? 'Dikirim' : 'Menunggu'}
                </span>
                <span className={`px-4 py-2 rounded-full font-medium ${
                  order.paymentStatus === 'paid'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {order.paymentStatus === 'paid' ? 'Dibayar' : 'Belum Dibayar'}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-slate-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-slate-900 mb-2">Alamat Pengiriman</h3>
            <p className="text-slate-600 whitespace-pre-wrap">{order.shippingAddress}</p>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="font-semibold text-slate-900 mb-4">Item Pesanan</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-slate-200">
                  {/* Product Image */}
                  <div className="flex-shrink-0 w-20 h-20 bg-slate-100 rounded-lg overflow-hidden">
                    {item.product.image ? (
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-grow">
                    <h4 className="font-semibold text-slate-900">{item.product.name}</h4>
                    <p className="text-sm text-slate-600">Jumlah: {item.quantity}</p>
                    <p className="font-semibold text-blue-600 mt-1">
                      Rp {(parseFloat(item.price) * item.quantity).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <h3 className="font-semibold text-slate-900 mb-4">Ringkasan Pesanan</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Pajak (10%)</span>
                <span>Rp {tax.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-slate-900 pt-3 border-t border-slate-200">
                <span>Total</span>
                <span>Rp {total.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        {order.paymentStatus === 'pending' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-semibold text-yellow-900 mb-2">Menunggu Pembayaran</h3>
            <p className="text-yellow-800 mb-4">
              Silakan lakukan pembayaran sebesar Rp {total.toLocaleString('id-ID')} untuk melanjutkan
            </p>
            <p className="text-sm text-yellow-700 mb-4">
              Integrasi pembayaran Midtrans akan ditambahkan untuk proses pembayaran
            </p>
            <Button className="bg-yellow-600 hover:bg-yellow-700">
              Lanjut ke Pembayaran (Midtrans)
            </Button>
          </div>
        )}

        {order.paymentStatus === 'paid' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold text-green-900 mb-2">Pembayaran Berhasil</h3>
            <p className="text-green-800">
              Terima kasih atas pembayaran Anda. Pesanan kami akan diproses segera.
            </p>
          </div>
        )}

        <div className="mt-6">
          <Link href="/products">
            <Button variant="outline" className="w-full">
              Lanjut Berbelanja
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
