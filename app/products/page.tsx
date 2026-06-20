import { getProducts } from '@/app/actions/products'
import { ProductCard } from '@/components/product-card'

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Katalog Produk</h1>
          <p className="text-slate-600">
            {products.length} produk tersedia
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: any) => (
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
    </main>
  )
}
