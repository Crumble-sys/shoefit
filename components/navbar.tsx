'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from '@/lib/auth-client'
import { ShoppingCart, LogOut, User, Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-blue-600">
            <ShoppingCart size={28} />
            <span>ShoeFit</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-slate-600 hover:text-blue-600 transition">
              Home
            </Link>
            <Link href="/products" className="text-slate-600 hover:text-blue-600 transition">
              Produk
            </Link>
            <Link href="/cart" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition">
              <ShoppingCart size={20} />
              Keranjang
            </Link>

            {session?.user ? (
              <div className="flex items-center gap-4 pl-8 border-l border-slate-200">
                <span className="text-slate-600 text-sm">{session.user.email}</span>
                <Link href="/orders" className="text-slate-600 hover:text-blue-600 transition">
                  Pesanan
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                >
                  <LogOut size={18} />
                  Keluar
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 pl-8 border-l border-slate-200">
                <Link href="/sign-in" className="text-blue-600 hover:text-blue-700 font-medium">
                  Masuk
                </Link>
                <Link href="/sign-up" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-slate-600"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-slate-200">
            <div className="flex flex-col gap-4 mt-4">
              <Link href="/" className="text-slate-600 hover:text-blue-600 transition">
                Home
              </Link>
              <Link href="/products" className="text-slate-600 hover:text-blue-600 transition">
                Produk
              </Link>
              <Link href="/cart" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition">
                <ShoppingCart size={20} />
                Keranjang
              </Link>

              {session?.user ? (
                <>
                  <span className="text-slate-600 text-sm">{session.user.email}</span>
                  <Link href="/orders" className="text-slate-600 hover:text-blue-600 transition">
                    Pesanan
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition w-full justify-center"
                  >
                    <LogOut size={18} />
                    Keluar
                  </button>
                </>
              ) : (
                <>
                  <Link href="/sign-in" className="text-blue-600 hover:text-blue-700 font-medium">
                    Masuk
                  </Link>
                  <Link href="/sign-up" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-center">
                    Daftar
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
