import * as React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, Download, ArrowUpRight, Star, ShoppingBag } from 'lucide-react'
import { cn } from '@utils/index'
import type { Project } from '@ig-types/index'
import { useTheme } from '@shared/contexts/ThemeContext'

// Google Form URL for buying
const GOOGLE_FORM_URL = 'https://forms.google.com/your-form-id'

// ── Buy button palette ──────────────────────────────────────────────────────
const BUY_BTN = 'linear-gradient(135deg,#7214ff 0%,#a365ff 100%)'
const BUY_SHADOW = '0 4px 14px rgba(114,20,255,0.28)'

const DIFFICULTY_PILL: Record<string, { label: string; bg: string; bgLight: string; color: string; colorLight: string }> = {
  beginner:     { label: 'Beginner',     bg: 'rgba(16,185,129,0.12)',  bgLight: 'rgba(16,185,129,0.10)',  color: '#34d399', colorLight: '#059669' },
  intermediate: { label: 'Intermediate', bg: 'rgba(245,158,11,0.12)',  bgLight: 'rgba(245,158,11,0.10)',  color: '#fbbf24', colorLight: '#d97706' },
  advanced:     { label: 'Advanced',     bg: 'rgba(239,68,68,0.12)',   bgLight: 'rgba(239,68,68,0.10)',   color: '#f87171', colorLight: '#dc2626' },
}

// ── Domain-based accent colour ───────────────────────────────────────────────
function getDomainAccent(domain?: string) {
  const map: Record<string, { from: string; to: string; glow: string }> = {
    'AI & ML':         { from: '#6366f1', to: '#8b5cf6', glow: 'rgba(99,102,241,0.20)' },
    'Web Development': { from: '#06b6d4', to: '#3b82f6', glow: 'rgba(6,182,212,0.20)' },
    'Cybersecurity':   { from: '#ef4444', to: '#f97316', glow: 'rgba(239,68,68,0.20)' },
    'IoT':             { from: '#10b981', to: '#06b6d4', glow: 'rgba(16,185,129,0.20)' },
    'Blockchain':      { from: '#f59e0b', to: '#f97316', glow: 'rgba(245,158,11,0.20)' },
    'Mobile Apps':     { from: '#8b5cf6', to: '#a78bfa', glow: 'rgba(139,92,246,0.20)' },
    'Data Science':    { from: '#06b6d4', to: '#0ea5e9', glow: 'rgba(6,182,212,0.20)' },
    'Cloud Computing': { from: '#64748b', to: '#475569', glow: 'rgba(100,116,139,0.20)' },
    'Research Tools':  { from: '#ec4899', to: '#f43f5e', glow: 'rgba(236,72,153,0.20)' },
    'Game Development':{ from: '#f97316', to: '#ef4444', glow: 'rgba(249,115,22,0.20)' },
  }
  return map[domain ?? ''] ?? { from: '#7214ff', to: '#a365ff', glow: 'rgba(114,20,255,0.20)' }
}

export interface ProjectCardProps {
  project: Project
  variant?: 'default' | 'compact'
  index?: number
  className?: string
}

// ── Compact card ─────────────────────────────────────────────────────────────
const CompactProjectCard = React.memo(function CompactProjectCard({
  project,
  index = 0,
  className,
}: Omit<ProjectCardProps, 'variant'>) {
  const { isDark } = useTheme()
  const accent = getDomainAccent(project.domain)
  const [hov, setHov] = React.useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: 'easeOut' }}
      className={cn('group flex items-center gap-3 rounded-2xl p-3 transition-all duration-300', className)}
      style={{
        background: 'var(--color-card)',
        border: `1px solid ${hov ? 'var(--color-border-hover)' : 'var(--color-border)'}`,
        boxShadow: hov ? 'var(--color-card-shadow-hover)' : 'var(--color-card-shadow)',
        transform: hov ? 'translateY(-2px)' : 'none',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Thumbnail / accent swatch */}
      <div
        className="relative w-16 h-12 rounded-xl overflow-hidden flex-shrink-0"
        style={{ background: `linear-gradient(135deg,${accent.from}22,${accent.to}44)` }}
      >
        {project.screenshots?.[0] ? (
          <img src={project.screenshots[0]} alt={project.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-5 h-5 rounded-full" style={{ background: `linear-gradient(135deg,${accent.from},${accent.to})` }} />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-sora font-semibold text-sm line-clamp-1 leading-snug" style={{ color: 'var(--color-text-heading)' }}>{project.title}</p>
        <p className="text-xs font-inter mt-0.5" style={{ color: 'var(--color-muted)' }}>{project.domain}</p>
      </div>

      <button
        className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg font-semibold text-white flex items-center gap-1.5 transition-all duration-200"
        style={{ background: BUY_BTN, boxShadow: BUY_SHADOW }}
        onClick={(e) => { e.preventDefault(); window.open(GOOGLE_FORM_URL, '_blank', 'noopener,noreferrer') }}
      >
        <ShoppingBag size={12} /> Buy
      </button>
    </motion.div>
  )
})

// ── Default (slide) card ─────────────────────────────────────────────────────
const DefaultProjectCard = React.memo(function DefaultProjectCard({
  project,
  index = 0,
  className,
}: Omit<ProjectCardProps, 'variant'>) {
  const { isDark } = useTheme()
  const accent = getDomainAccent(project.domain)
  const diffConf = DIFFICULTY_PILL[project.difficulty?.toLowerCase() ?? ''] ?? DIFFICULTY_PILL['beginner']
  const techs: string[] = project.technologies ?? []
  const visibleTechs = techs.slice(0, 3)
  const extraCount = techs.length - 3
  const [hov, setHov] = React.useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: 'easeOut' }}
      className={cn('group relative flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-300', className)}
      style={{
        background: 'var(--color-card)',
        border: `1px solid ${hov ? 'var(--color-border-hover)' : 'var(--color-border)'}`,
        boxShadow: hov ? 'var(--color-card-shadow-hover)' : 'var(--color-card-shadow)',
        transform: hov ? 'translateY(-6px)' : 'none',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Top shimmer bar */}
      <div
        className="absolute top-0 left-0 right-0 h-px z-10"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${accent.from}88 40%, ${accent.to}88 60%, transparent 100%)`,
          opacity: hov ? 1 : 0.3,
          transition: 'opacity 0.3s',
        }}
      />

      {/* Thumbnail */}
      <div
        className="relative overflow-hidden flex-shrink-0"
        style={{ aspectRatio: '16/9', background: `linear-gradient(135deg,${accent.from}18,${accent.to}30)` }}
      >
        {project.screenshots?.[0] ? (
          <img
            src={project.screenshots[0]}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: hov ? 'scale(1.05)' : 'scale(1)' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
            <div className="absolute w-32 h-32 rounded-full blur-2xl opacity-40" style={{ background: `radial-gradient(circle,${accent.from},transparent)`, top: '-10%', left: '10%' }} />
            <div className="absolute w-24 h-24 rounded-full blur-xl opacity-30" style={{ background: `radial-gradient(circle,${accent.to},transparent)`, bottom: '0%', right: '15%' }} />
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: `linear-gradient(135deg,${accent.from},${accent.to})`, boxShadow: `0 8px 24px ${accent.glow}` }}
            >
              <span className="text-white text-xl font-bold font-sora">{project.title.charAt(0)}</span>
            </div>
          </div>
        )}

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isDark
              ? 'linear-gradient(to top, rgba(14,19,48,0.80), transparent, transparent)'
              : 'linear-gradient(to top, rgba(255,255,255,0.60), transparent, transparent)',
          }}
        />

        {/* Status badges */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 pointer-events-none z-10">
          {project.isNew && (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider text-white" style={{ background: 'rgba(99,102,241,0.90)' }}>NEW</span>
          )}
          {project.isTrending && (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider" style={{ background: 'rgba(6,182,212,0.90)', color: '#0f172a' }}>TRENDING</span>
          )}
          {project.isTopSelling && (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider text-white" style={{ background: 'rgba(16,185,129,0.90)' }}>TOP SELLER</span>
          )}
        </div>

        {/* Domain badge bottom-left */}
        <div className="absolute bottom-3 left-3 z-10">
          <span
            className="text-[11px] font-semibold font-inter px-2.5 py-1 rounded-lg"
            style={{
              background: isDark ? 'rgba(14,19,48,0.85)' : 'rgba(255,255,255,0.90)',
              backdropFilter: 'blur(6px)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
              color: accent.from,
            }}
          >
            {project.domain}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 gap-3 p-5">
        {/* Title */}
        <h3 className="font-sora font-semibold text-sm leading-snug transition-colors line-clamp-2" style={{ color: 'var(--color-text-heading)' }}>
          {project.title}
        </h3>

        {/* Tech pills */}
        {techs.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {visibleTechs.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center rounded-lg px-2 py-0.5 text-[11px] font-medium font-inter"
                style={{
                  background: 'var(--color-pill-bg)',
                  color: 'var(--color-pill-text)',
                  border: `1px solid var(--color-pill-border)`,
                }}
              >
                {tech}
              </span>
            ))}
            {extraCount > 0 && (
              <span
                className="inline-flex items-center rounded-lg px-2 py-0.5 text-[11px] font-medium font-inter"
                style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', color: 'var(--color-subtle)', border: `1px solid var(--color-border)` }}
              >
                +{extraCount} more
              </span>
            )}
          </div>
        )}

        {/* Difficulty + rating + views row */}
        <div className="flex items-center justify-between mt-auto">
          <span
            className="inline-flex items-center rounded-lg px-2.5 py-1 text-[11px] font-semibold font-inter"
            style={{
              background: isDark ? diffConf.bg : diffConf.bgLight,
              color: isDark ? diffConf.color : diffConf.colorLight,
            }}
          >
            {diffConf.label}
          </span>
          <div className="flex items-center gap-3 text-xs font-inter" style={{ color: 'var(--color-subtle)' }}>
            {typeof project.rating === 'number' && (
              <span className="flex items-center gap-1">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                {project.rating}
              </span>
            )}
            {typeof project.views === 'number' && (
              <span className="flex items-center gap-1"><Eye size={12} />{project.views.toLocaleString()}</span>
            )}
            {typeof project.downloads === 'number' && (
              <span className="flex items-center gap-1"><Download size={12} />{project.downloads.toLocaleString()}</span>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full" style={{ background: 'var(--color-border)' }} />

        {/* Action buttons */}
        <div className="flex flex-col gap-2">
          <Link
            to={`/projects/${project.id}`}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold font-inter transition-all duration-200"
            style={{
              background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
              border: `1px solid var(--color-border)`,
              color: 'var(--color-muted)',
            }}
          >
            <ArrowUpRight size={13} /> View Details
          </Link>
          <Link
            to={`/buy/${project.id}`}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold font-inter text-white transition-all duration-200"
            style={{ background: BUY_BTN, boxShadow: BUY_SHADOW }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(114,20,255,0.40)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = BUY_SHADOW }}
          >
            <ShoppingBag size={13} /> Buy
          </Link>
        </div>
      </div>
    </motion.div>
  )
})

export function ProjectCard({ project, variant = 'default', index = 0, className }: ProjectCardProps) {
  if (variant === 'compact') return <CompactProjectCard project={project} index={index} className={className} />
  return <DefaultProjectCard project={project} index={index} className={className} />
}

export default ProjectCard
