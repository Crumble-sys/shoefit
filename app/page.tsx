import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getProducts } from '@/app/actions/products'
import { ProductCard } from '@/components/product-card'

export default async function Home() {
  const products = await getProducts()

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Selamat Datang di ShoeFit
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8">
            Temukan sepatu berkualitas tinggi untuk setiap momen kehidupan Anda
          </p>
          <Link href="/products">
            <Button size="lg" variant="secondary" className="font-semibold px-8">
              Belanja Sekarang
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">
            Mengapa Memilih ShoeFit?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✓</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Kualitas Terjamin</h3>
              <p className="text-slate-600">
                Semua produk kami dipilih dengan cermat untuk memastikan kualitas terbaik
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Pengiriman Cepat</h3>
              <p className="text-slate-600">
                Kami menjamin pengiriman cepat dan aman ke seluruh Indonesia
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💳</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Pembayaran Mudah</h3>
              <p className="text-slate-600">
                Berbagai metode pembayaran tersedia untuk kemudahan Anda
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 md:py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Produk Terbaru</h2>
            <Link href="/products">
              <Button variant="outline">Lihat Semua</Button>
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map((product: any) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  category={product.category}
                  stock={product.stock}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg">Belum ada produk tersedia</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Siap Menemukan Sepatu Impian Anda?</h2>
          <p className="text-blue-100 mb-8">
            Jelajahi koleksi lengkap kami dan temukan gaya yang sempurna untuk Anda
          </p>
          <Link href="/products">
            <Button size="lg" variant="secondary" className="font-semibold px-8">
              Mulai Berbelanja
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
