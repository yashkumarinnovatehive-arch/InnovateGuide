import * as React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, Download, MessageCircle, ArrowUpRight } from 'lucide-react'
import { cn } from '@utils/index'
import { formatPrice, getWhatsAppLink, generateCreatorId } from '@utils/index'
import type { Project } from '@ig-types/index'

// WhatsApp green — used everywhere
const WA_GREEN = '#25D366'
const WA_GREEN_HOVER = '#1ebe57'
const WA_SHADOW = '0 4px 14px rgba(37,211,102,0.28)'

// ── Evolvion palette ────────────────────────────────────────────────────────
const PURPLE_BTN = 'linear-gradient(135deg,#7214ff 0%,#a365ff 100%)'
const CARD_BG = '#0E1330'
const CARD_BORDER = 'rgba(255,255,255,0.06)'
const CARD_BORDER_HOVER = 'rgba(114,20,255,0.38)'
const CARD_GLOW = '0 0 0 1px rgba(114,20,255,0.30), 0 8px 32px rgba(114,20,255,0.18)'

const DIFFICULTY_PILL: Record<string, { label: string; bg: string; color: string }> = {
  beginner:     { label: 'Beginner',     bg: 'rgba(16,185,129,0.12)',  color: '#34d399' },
  intermediate: { label: 'Intermediate', bg: 'rgba(245,158,11,0.12)',  color: '#fbbf24' },
  advanced:     { label: 'Advanced',     bg: 'rgba(239,68,68,0.12)',   color: '#f87171' },
}

// ── Domain-based crystallic card accent colour ───────────────────────────────
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
  const whatsAppLink = getWhatsAppLink(project.title, project.price)
  const accent = getDomainAccent(project.domain)
  const [hov, setHov] = React.useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: 'easeOut' }}
      className={cn('group flex items-center gap-3 rounded-2xl p-3 transition-all duration-300', className)}
      style={{
        background: CARD_BG,
        border: `1px solid ${hov ? CARD_BORDER_HOVER : CARD_BORDER}`,
        boxShadow: hov ? CARD_GLOW : 'none',
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
        <p className="font-sora font-semibold text-sm text-white line-clamp-1 leading-snug">{project.title}</p>
        <p className="text-xs font-inter mt-0.5 font-bold" style={{ color: '#a365ff' }}>{formatPrice(project.price)}</p>
      </div>

      <button
        className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg font-semibold text-white flex items-center gap-1.5 transition-all duration-200"
        style={{ background: WA_GREEN, boxShadow: WA_SHADOW }}
        onClick={(e) => { e.preventDefault(); window.open(whatsAppLink, '_blank', 'noopener,noreferrer') }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = WA_GREEN_HOVER)}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = WA_GREEN)}
      >
        <MessageCircle size={12} /> Buy
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
  const whatsAppLink = getWhatsAppLink(project.title, project.price)
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
      className={cn('group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300', className)}
      style={{
        background: CARD_BG,
        border: `1px solid ${hov ? CARD_BORDER_HOVER : CARD_BORDER}`,
        boxShadow: hov ? CARD_GLOW : '0 2px 8px rgba(0,0,0,0.24)',
        transform: hov ? 'translateY(-6px)' : 'none',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Crystallic top shimmer bar */}
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
          /* Crystallic placeholder */
          <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
            {/* Refraction blobs */}
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E1330]/80 via-transparent to-transparent pointer-events-none" />

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

        {/* Price overlay bottom-left */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="text-sm font-extrabold font-sora text-white px-2.5 py-1 rounded-lg" style={{ background: 'rgba(14,19,48,0.85)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {formatPrice(project.price)}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 gap-3 p-5">
        {/* Title */}
        <h3 className="font-sora font-semibold text-sm leading-snug text-slate-100 group-hover:text-white transition-colors line-clamp-2">
          {project.title}
        </h3>

        {/* Tech pills */}
        {techs.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {visibleTechs.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center rounded-lg px-2 py-0.5 text-[11px] font-medium font-inter"
                style={{ background: 'rgba(114,20,255,0.12)', color: '#c4b5fd', border: '1px solid rgba(114,20,255,0.20)' }}
              >
                {tech}
              </span>
            ))}
            {extraCount > 0 && (
              <span className="inline-flex items-center rounded-lg px-2 py-0.5 text-[11px] font-medium font-inter" style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>
                +{extraCount} more
              </span>
            )}
          </div>
        )}

        {/* Difficulty + views row */}
        <div className="flex items-center justify-between mt-auto">
          <span className="inline-flex items-center rounded-lg px-2.5 py-1 text-[11px] font-semibold font-inter" style={{ background: diffConf.bg, color: diffConf.color }}>
            {diffConf.label}
          </span>
          <div className="flex items-center gap-3 text-xs font-inter" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {typeof project.views === 'number' && (
              <span className="flex items-center gap-1"><Eye size={12} />{project.views.toLocaleString()}</span>
            )}
            {typeof project.downloads === 'number' && (
              <span className="flex items-center gap-1"><Download size={12} />{project.downloads.toLocaleString()}</span>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full" style={{ background: 'rgba(255,255,255,0.05)' }} />

        {/* Action buttons */}
        <div className="flex flex-col gap-2">
          <Link
            to={`/projects/${project.id}`}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold font-inter text-slate-300 transition-all duration-200 hover:text-white"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)' }}
          >
            <ArrowUpRight size={13} /> View Details
          </Link>
          <button
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold font-inter text-white transition-all duration-200"
            style={{ background: WA_GREEN, boxShadow: WA_SHADOW }}
            onClick={() => window.open(whatsAppLink, '_blank', 'noopener,noreferrer')}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = WA_GREEN_HOVER; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(37,211,102,0.40)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = WA_GREEN; (e.currentTarget as HTMLElement).style.boxShadow = WA_SHADOW }}
          >
            <MessageCircle size={13} /> Buy via WhatsApp
          </button>
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
