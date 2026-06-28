import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ChevronLeft, Zap } from 'lucide-react'
import { Button } from '@ui/button'
import { useAuth } from '@hooks/useAuth'

export default function LoginPage() {
  const navigate = useNavigate()
  const { loginAsync, isLoggingIn, loginError } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLocalError(null)

    if (!email.trim()) {
      setLocalError('Email address is required.')
      return
    }
    if (!password) {
      setLocalError('Password is required.')
      return
    }

    try {
      await loginAsync({ email: email.trim(), password })
      navigate('/admin/dashboard', { replace: true })
    } catch {
      // loginError from hook will surface below
    }
  }

  const errorMessage =
    localError ??
    (loginError
      ? (loginError as { message?: string })?.message ?? 'Invalid email or password. Please try again.'
      : null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg0)] text-[var(--color-text-heading)] relative overflow-hidden font-inter px-4">
      {/* Background glow blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* ── Card ── */}
        <div className="bg-[var(--color-bg1)]/40 border border-[var(--color-border)] rounded-3xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[80px] pointer-events-none" />

          {/* Logo + Title */}
          <div className="flex flex-col items-center mb-8 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)] mb-4">
              <Zap size={28} className="text-white fill-white" />
            </div>
            <h1 className="font-sora font-bold text-2xl text-[var(--color-text-heading)] tracking-tight">
              InnovateGuide
            </h1>
            <h2 className="font-sora font-semibold text-lg text-[var(--color-text-heading)] mt-1">
              Admin Login
            </h2>
            <p className="text-sm text-[var(--color-subtle)] mt-1 text-center">
              Sign in to manage projects and review submissions
            </p>
          </div>

          {/* Error banner */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-350 text-sm rounded-xl px-4 py-3 mb-5 relative z-10"
              role="alert"
            >
              <span className="font-semibold">Error:</span>
              {errorMessage}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5 relative z-10">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-350 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-slate-555" />
                </span>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setLocalError(null)
                  }}
                  placeholder="admin@innovateguide.in"
                  className="w-full pl-9 pr-4 h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-input-bg)] text-sm text-[var(--color-text-heading)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                  disabled={isLoggingIn}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-350 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Lock size={16} className="text-slate-555" />
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setLocalError(null)
                  }}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-11 h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-input-bg)] text-sm text-[var(--color-text-heading)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                  disabled={isLoggingIn}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-400 hover:to-rose-400 text-white font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(249,115,22,0.25)] hover:shadow-[0_0_25px_rgba(249,115,22,0.45)] hover:-translate-y-0.5"
              loading={isLoggingIn}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? 'Signing in...' : 'Login'}
            </Button>
          </form>
        </div>

        {/* Back to Home */}
        <div className="mt-5 text-center relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--color-subtle)] hover:text-orange-400 transition-colors"
          >
            <ChevronLeft size={14} />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}


