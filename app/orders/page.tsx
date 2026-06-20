'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getOrders } from '@/app/actions/orders'
import { useSession } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Package } from 'lucide-react'

interface Order {
  id: string
  totalPrice: string
  status: string
  paymentStatus: string
  createdAt: Date
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!session?.user) {
      router.push('/sign-in')
      return
    }

    fetchOrders()
  }, [session, router])

  const fetchOrders = async () => {
    try {
      const ordersList = await getOrders()
      setOrders(ordersList as Order[])
    } catch (error) {
      console.error('Error fetching orders:', error)
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

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft size={20} />
          Kembali ke Home
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 mb-8">Pesanan Saya</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <Package size={48} className="mx-auto text-slate-400 mb-4" />
            <p className="text-slate-600 mb-4">Anda belum memiliki pesanan</p>
            <Link href="/products">
              <Button>Mulai Berbelanja</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link key={order.id} href={`/orders/${order.id}`}>
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-900">Pesanan #{order.id.slice(0, 8)}</h3>
                      <p className="text-sm text-slate-600">
                        {new Date(order.createdAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900">
                        Rp {parseFloat(order.totalPrice).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <span className={`px-3 py-1 rounded-full font-medium ${
                      order.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status === 'completed' ? 'Selesai' : order.status === 'shipped' ? 'Dikirim' : 'Menunggu'}
                    </span>
                    <span className={`px-3 py-1 rounded-full font-medium ${
                      order.paymentStatus === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {order.paymentStatus === 'paid' ? 'Dibayar' : 'Belum Dibayar'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
