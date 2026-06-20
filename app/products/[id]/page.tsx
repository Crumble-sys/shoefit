'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'
import { getProductById, getProducts } from '@/app/actions/products'
import { addToCart } from '@/app/actions/cart'
import { useSession } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import { ProductCard } from '@/components/product-card'

interface Product {
  id: string
  name: string
  description: string | null
  price: string
  image: string | null
  category: string
  stock: number
}

export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      const prod = await getProductById(productId)
      setProduct(prod)

      if (prod) {
        const allProducts = await getProducts()
        const related = allProducts
          .filter((p: any) => p.category === prod.category && p.id !== prod.id)
          .slice(0, 4)
        setRelatedProducts(related)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!session?.user) {
      router.push('/sign-in')
      return
    }

    setAdding(true)
    try {
      await addToCart(productId, quantity)
      alert('Produk berhasil ditambahkan ke keranjang!')
      setQuantity(1)
    } catch (error) {
      alert('Gagal menambahkan ke keranjang')
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">Memuat produk...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Produk tidak ditemukan</p>
          <Link href="/products">
            <Button>Kembali ke Produk</Button>
          </Link>
        </div>
      </div>
    )
  }

  const isOutOfStock = product.stock <= 0

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/products" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <ArrowLeft size={20} />
            Kembali ke Produk
          </Link>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg shadow-md p-8 mb-8">
          {/* Product Image */}
          <div className="flex items-center justify-center bg-slate-100 rounded-lg h-96">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={400}
                className="object-contain"
              />
            ) : (
              <div className="text-slate-400 text-center">
                <p className="text-xl">Tidak ada gambar</p>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-2 uppercase tracking-wide">{product.category}</p>
              <h1 className="text-4xl font-bold text-slate-900 mb-4">{product.name}</h1>
              <p className="text-3xl font-bold text-blue-600 mb-6">
                Rp {parseFloat(product.price).toLocaleString('id-ID')}
              </p>

              <div className="mb-6">
                <p className="text-slate-600 leading-relaxed">
                  {product.description || 'Tidak ada deskripsi tersedia'}
                </p>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                <p className={`text-sm font-semibold ${
                  isOutOfStock ? 'text-red-600' : 'text-green-600'
                }`}>
                  {isOutOfStock ? 'Stok Habis' : `Stok Tersedia: ${product.stock}`}
                </p>
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className="flex flex-col gap-4">
              {!isOutOfStock && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 border border-slate-300 rounded-lg p-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 hover:bg-slate-100 transition"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1 hover:bg-slate-100 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock || adding}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold py-3 flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                {isOutOfStock ? 'Stok Habis' : adding ? 'Menambahkan...' : 'Tambah ke Keranjang'}
              </Button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Produk Sejenis</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  id={prod.id}
                  name={prod.name}
                  price={prod.price}
                  image={prod.image}
                  category={prod.category}
                  stock={prod.stock}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
