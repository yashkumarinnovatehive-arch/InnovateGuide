import * as React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Brain, Globe, Shield, Cpu, Link as LinkIcon, Smartphone, BarChart2, Cloud, BookOpen, Gamepad2 } from 'lucide-react'
import { cn } from '@utils/index'
import type { Category } from '@ig-types/index'

// ── Map icon string → Lucide component (like the screenshot uses icon images) ──
const ICON_MAP: Record<string, React.ReactNode> = {
  Brain:     <Brain size={20} />,
  Globe:     <Globe size={20} />,
  Shield:    <Shield size={20} />,
  Cpu:       <Cpu size={20} />,
  Link:      <LinkIcon size={20} />,
  Smartphone:<Smartphone size={20} />,
  BarChart2: <BarChart2 size={20} />,
  Cloud:     <Cloud size={20} />,
  BookOpen:  <BookOpen size={20} />,
  Gamepad2:  <Gamepad2 size={20} />,
}

// ── Per-category icon gradient (iOS-style app icon look from screenshot) ──────
const ICON_GRADIENT: Record<string, { from: string; to: string; pill: string; pillText: string; glow: string }> = {
  Brain:      { from: '#6366f1', to: '#8b5cf6', pill: 'rgba(99,102,241,0.18)',  pillText: '#a5b4fc', glow: 'rgba(99,102,241,0.30)' },
  Globe:      { from: '#2563eb', to: '#06b6d4', pill: 'rgba(6,182,212,0.15)',   pillText: '#67e8f9', glow: 'rgba(6,182,212,0.28)' },
  Shield:     { from: '#dc2626', to: '#f97316', pill: 'rgba(239,68,68,0.15)',   pillText: '#fca5a5', glow: 'rgba(239,68,68,0.28)' },
  Cpu:        { from: '#059669', to: '#10b981', pill: 'rgba(16,185,129,0.15)',  pillText: '#6ee7b7', glow: 'rgba(16,185,129,0.28)' },
  Link:       { from: '#d97706', to: '#f59e0b', pill: 'rgba(245,158,11,0.15)',  pillText: '#fcd34d', glow: 'rgba(245,158,11,0.30)' },
  Smartphone: { from: '#7c3aed', to: '#a78bfa', pill: 'rgba(139,92,246,0.15)',  pillText: '#c4b5fd', glow: 'rgba(139,92,246,0.28)' },
  BarChart2:  { from: '#0284c7', to: '#06b6d4', pill: 'rgba(6,182,212,0.15)',   pillText: '#67e8f9', glow: 'rgba(6,182,212,0.28)' },
  Cloud:      { from: '#334155', to: '#64748b', pill: 'rgba(100,116,139,0.15)', pillText: '#94a3b8', glow: 'rgba(100,116,139,0.25)' },
  BookOpen:   { from: '#be185d', to: '#ec4899', pill: 'rgba(236,72,153,0.15)',  pillText: '#f9a8d4', glow: 'rgba(236,72,153,0.28)' },
  Gamepad2:   { from: '#c2410c', to: '#f97316', pill: 'rgba(249,115,22,0.15)',  pillText: '#fdba74', glow: 'rgba(249,115,22,0.28)' },
}

const FALLBACK = { from: '#7214ff', to: '#a365ff', pill: 'rgba(114,20,255,0.15)', pillText: '#c4b5fd', glow: 'rgba(114,20,255,0.28)' }

export interface CategoryCardProps {
  category: Category
  index?: number
  className?: string
}

export function CategoryCard({ category, index = 0, className }: CategoryCardProps) {
  const iconKey = (category.icon as string) ?? 'Brain'
  const iconEl = ICON_MAP[iconKey] ?? <Brain size={20} />
  const accent = ICON_GRADIENT[iconKey] ?? FALLBACK

  const [hov, setHov] = React.useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
      className={cn('h-full', className)}
    >
      <Link
        to={`/browse?domain=${encodeURIComponent(
          category.slug ?? category.name?.toLowerCase().replace(/\s+/g, '-') ?? ''
        )}`}
        className="group relative flex flex-col h-full rounded-2xl p-5 overflow-hidden transition-all duration-300"
        style={{
          background: '#0E1330',
          border: `1px solid ${hov ? accent.glow.replace('0.30', '0.50').replace('0.28', '0.45').replace('0.25', '0.40') : 'rgba(255,255,255,0.06)'}`,
          boxShadow: hov ? `0 0 0 1px ${accent.glow}, 0 8px 32px ${accent.glow}` : '0 2px 8px rgba(0,0,0,0.20)',
          transform: hov ? 'translateY(-4px)' : 'none',
        }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
      >
        {/* Crystallic top highlight stripe */}
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${accent.from}99 40%, ${accent.to}99 60%, transparent 100%)`,
            opacity: hov ? 1 : 0.35,
            transition: 'opacity 0.3s',
          }}
        />

        {/* Top row: icon box + arrow — always at the top */}
        <div className="flex items-start justify-between">
          {/* iOS-style square gradient icon */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg shrink-0"
            style={{
              background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
              boxShadow: hov ? `0 6px 20px ${accent.glow}` : `0 4px 12px ${accent.glow}`,
              transition: 'box-shadow 0.3s',
            }}
          >
            {iconEl}
          </div>

          <ArrowUpRight
            size={16}
            className="transition-all duration-300 shrink-0"
            style={{
              color: hov ? accent.pillText : 'rgba(255,255,255,0.25)',
              transform: hov ? 'translate(2px,-2px)' : 'none',
            }}
          />
        </div>

        {/* Name + pill — directly below the icon with consistent spacing */}
        <div className="pt-5">
          <h3 className="font-sora font-semibold text-sm text-slate-200 group-hover:text-white transition-colors leading-snug mb-2">
            {category.name}
          </h3>
          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold font-inter"
            style={{ background: accent.pill, color: accent.pillText }}
          >
            {category.count ?? 0} projects
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

export default CategoryCard
