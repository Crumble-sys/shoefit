'use client'

import Image from 'next/image'
import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { addToCart } from '@/app/actions/cart'
import { useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

interface ProductCardProps {
  id: string
  name: string
  price: string
  image: string | null
  category: string
  stock: number
}

export function ProductCard({ id, name, price, image, category, stock }: ProductCardProps) {
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()

    if (!session?.user) {
      router.push('/sign-in')
      return
    }

    setLoading(true)
    try {
      await addToCart(id)
      // Show success feedback
      alert('Produk ditambahkan ke keranjang!')
    } catch (error) {
      alert('Gagal menambahkan ke keranjang')
    } finally {
      setLoading(false)
    }
  }

  const isOutOfStock = stock <= 0

  return (
    <Link href={`/products/${id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden h-full">
        {/* Product Image */}
        <div className="relative w-full h-48 bg-slate-100">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              No image
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Stok Habis</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <p className="text-xs text-slate-500 mb-1">{category}</p>
          <h3 className="font-semibold text-slate-900 line-clamp-2 mb-2">{name}</h3>
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-blue-600">
              Rp {parseFloat(price).toLocaleString('id-ID')}
            </span>
            <button
              onClick={handleAddToCart}
              disabled={loading || isOutOfStock}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white p-2 rounded-lg transition flex items-center justify-center"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
