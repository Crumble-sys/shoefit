'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isSignUp = mode === 'sign-up'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const result = isSignUp
        ? await authClient.signUp.email({ email, password, name })
        : await authClient.signIn.email({ email, password })

      setLoading(false)

      if (result.error) {
        setError(result.error.message ?? 'Something went wrong')
        return
      }

      router.push('/')
      router.refresh()
    } catch (err) {
      setLoading(false)
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              {isSignUp ? 'Buat Akun' : 'Selamat Datang'}
            </h1>
            <p className="text-sm text-slate-600 mt-2">
              {isSignUp
                ? 'Daftar untuk memulai berbelanja sepatu favorit Anda'
                : 'Masuk ke akun Anda untuk melanjutkan'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {isSignUp && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="name" className="text-slate-700 font-medium">
                  Nama Lengkap
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  placeholder="Masukkan nama Anda"
                  className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="masukkan@email.com"
                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-slate-700 font-medium">
                Kata Sandi
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                placeholder="Minimal 8 karakter"
                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md" role="alert">
                {error}
              </p>
            )}

            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              {loading
                ? 'Mohon tunggu...'
                : isSignUp
                  ? 'Buat Akun'
                  : 'Masuk'}
            </Button>
          </form>

          <p className="text-sm text-slate-600 text-center mt-6">
            {isSignUp ? 'Sudah punya akun? ' : 'Belum punya akun? '}
            <Link
              href={isSignUp ? '/sign-in' : '/sign-up'}
              className="text-blue-600 font-semibold hover:text-blue-700 underline-offset-2 hover:underline"
            >
              {isSignUp ? 'Masuk' : 'Daftar'}
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
