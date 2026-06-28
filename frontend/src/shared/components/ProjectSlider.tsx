import * as React from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react'
import { cn } from '@utils/index'
import { ProjectCard } from './ProjectCard'
import type { Project } from '@ig-types/index'
import { useTheme } from '@shared/contexts/ThemeContext'

const PURPLE_BTN = 'linear-gradient(135deg,#7214ff 0%,#a365ff 100%)'

export interface ProjectSliderProps {
  title: string
  subtitle?: string
  projects: Project[]
  viewAllLink?: string
  isLoading?: boolean
  className?: string
}

export function ProjectSlider({
  title,
  subtitle,
  projects,
  viewAllLink,
  isLoading = false,
  className,
}: ProjectSliderProps) {
  const { isDark } = useTheme()
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const isDown = React.useRef(false)
  const startX = React.useRef(0)
  const scrollLeft = React.useRef(0)

  const [canScrollLeft,  setCanScrollLeft]  = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(true)
  const [progress,       setProgress]       = React.useState(0)
  const [totalDots,      setTotalDots]      = React.useState(1)

  const updateState = React.useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < maxScroll - 4)
    const dots = Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth))
    setTotalDots(dots)
    setProgress(maxScroll > 0 ? Math.round((el.scrollLeft / maxScroll) * (dots - 1)) : 0)
  }, [])

  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateState()
    el.addEventListener('scroll', updateState, { passive: true })
    window.addEventListener('resize', updateState)

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
      e.preventDefault()
      el.scrollBy({ left: e.deltaY * 2, behavior: 'auto' })
    }

    el.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      el.removeEventListener('scroll', updateState)
      window.removeEventListener('resize', updateState)
      el.removeEventListener('wheel', handleWheel)
    }
  }, [updateState, projects, isLoading])

  const scrollBy = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: direction === 'left' ? -(el.clientWidth * 0.75) : el.clientWidth * 0.75, behavior: 'smooth' })
  }

  const scrollToDot = (index: number) => {
    const el = scrollRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    el.scrollTo({ left: (index / (totalDots - 1)) * maxScroll, behavior: 'smooth' })
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDown.current = true
    startX.current = e.pageX - (scrollRef.current?.offsetLeft ?? 0)
    scrollLeft.current = scrollRef.current?.scrollLeft ?? 0
    if (scrollRef.current) scrollRef.current.style.cursor = 'grabbing'
  }

  const handleMouseLeave = () => { isDown.current = false; if (scrollRef.current) scrollRef.current.style.cursor = 'grab' }
  const handleMouseUp    = () => { isDown.current = false; if (scrollRef.current) scrollRef.current.style.cursor = 'grab' }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDown.current || !scrollRef.current) return
    e.preventDefault()
    const x    = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX.current) * 1.2
    scrollRef.current.scrollLeft = scrollLeft.current - walk
  }

  return (
    <section className={cn('relative', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center text-center gap-4 mb-10">
          <div>
            <h2
              className="font-sora font-extrabold text-2xl sm:text-3xl leading-tight"
              style={{ color: 'var(--color-text-heading)' }}
            >
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-sm font-inter" style={{ color: 'var(--color-muted)' }}>
                {subtitle}
              </p>
            )}
          </div>
          {viewAllLink && (
            <Link
              to={viewAllLink}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold font-inter transition-all duration-200"
              style={{
                background: isDark ? 'rgba(114,20,255,0.14)' : 'rgba(114,20,255,0.08)',
                border: `1px solid ${isDark ? 'rgba(114,20,255,0.28)' : 'rgba(114,20,255,0.20)'}`,
                color: isDark ? '#c4b5fd' : '#7214ff',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = isDark ? 'rgba(114,20,255,0.26)' : 'rgba(114,20,255,0.15)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = isDark ? 'rgba(114,20,255,0.14)' : 'rgba(114,20,255,0.08)' }}
            >
              <LayoutGrid size={13} />
              View All
              <ChevronRight size={13} />
            </Link>
          )}
        </div>

        {/* ── Slider ──────────────────────────────────────────────────── */}
        <div className="relative group">
          {/* Left arrow */}
          <NavArrow
            direction="left"
            onClick={() => scrollBy('left')}
            disabled={!canScrollLeft}
            isDark={isDark}
          />

          {/* Right arrow */}
          <NavArrow
            direction="right"
            onClick={() => scrollBy('right')}
            disabled={!canScrollRight}
            isDark={isDark}
          />

          {isLoading ? (
            <div className="flex justify-center">
              <div className="inline-flex gap-4 overflow-hidden">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-[300px] md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-11px)] flex-shrink-0">
                    <SkeletonCard isDark={isDark} />
                  </div>
                ))}
              </div>
            </div>
          ) : projects.length === 0 ? (
            <EmptyState isDark={isDark} />
          ) : (
            <div className="flex justify-center">
              <div
                ref={scrollRef}
                role="list"
                className="flex w-full gap-4 overflow-x-auto pb-4 pt-2 px-1 cursor-grab select-none"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
              >
                {projects.map((project, i) => (
                  <div key={project.id} role="listitem" className="w-[300px] md:w-[calc(50%_-_8px)] lg:w-[calc(33.333%_-_11px)] flex-shrink-0 h-full">
                    <ProjectCard project={project} variant="default" index={i} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Pagination dots ─────────────────────────────────────────── */}
        {!isLoading && projects.length > 0 && totalDots > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            {Array.from({ length: totalDots }).map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToDot(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="rounded-full transition-all duration-300"
                style={
                  i === progress
                    ? { width: 24, height: 6, background: PURPLE_BTN, boxShadow: '0 0 8px rgba(114,20,255,0.5)' }
                    : { width: 6, height: 6, background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)' }
                }
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// ── Nav Arrow button ─────────────────────────────────────────────────────────
function NavArrow({ direction, onClick, disabled, isDark }: { direction: 'left' | 'right'; onClick: () => void; disabled: boolean; isDark: boolean }) {
  const [hov, setHov] = React.useState(false)
  return (
    <button
      onClick={onClick}
      aria-label={`Scroll ${direction}`}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className={`absolute top-1/2 z-10 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full transition-all duration-200 ${direction === 'left' ? '-left-2 md:-left-6' : '-right-2 md:-right-6'}`}
      style={{
        transform: `translateY(-50%)`,
        background: disabled
          ? (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)')
          : hov
          ? 'linear-gradient(135deg,#7214ff,#a365ff)'
          : 'var(--color-card)',
        border: `1px solid ${disabled
          ? 'var(--color-border)'
          : hov
          ? 'rgba(114,20,255,0.40)'
          : 'var(--color-border)'}`,
        boxShadow: hov && !disabled ? '0 4px 16px rgba(114,20,255,0.35)' : 'var(--color-card-shadow)',
        opacity: disabled ? 0 : (hov ? 1 : 0.8),
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: disabled ? 'var(--color-subtle)' : hov ? '#fff' : 'var(--color-text)',
      }}
    >
      {direction === 'left' ? <ChevronLeft size={18} className="md:w-5 md:h-5" /> : <ChevronRight size={18} className="md:w-5 md:h-5" />}
    </button>
  )
}

// ── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard({ isDark }: { isDark: boolean }) {
  return (
    <div className="rounded-2xl overflow-hidden animate-pulse" style={{ background: 'var(--color-card)', border: `1px solid var(--color-border)` }}>
      <div className="aspect-video" style={{ background: 'var(--color-skeleton)' }} />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-3.5 rounded-full w-3/4" style={{ background: 'var(--color-skeleton)' }} />
        <div className="h-3 rounded-full w-1/2" style={{ background: 'var(--color-skeleton)' }} />
        <div className="flex gap-2 mt-1">
          <div className="h-5 rounded-lg w-12" style={{ background: 'var(--color-skeleton)' }} />
          <div className="h-5 rounded-lg w-14" style={{ background: 'var(--color-skeleton)' }} />
        </div>
        <div className="h-8 rounded-xl mt-2" style={{ background: 'var(--color-skeleton)' }} />
        <div className="h-8 rounded-xl" style={{ background: 'var(--color-skeleton-accent)' }} />
      </div>
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ isDark }: { isDark: boolean }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-4 rounded-2xl text-center"
      style={{ background: 'var(--color-card)', border: `1px dashed var(--color-border)` }}
    >
      <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ background: 'var(--color-skeleton)', border: `1px solid var(--color-border)` }}>
        <LayoutGrid size={24} style={{ color: 'var(--color-subtle)' }} />
      </div>
      <p className="font-sora font-semibold text-base" style={{ color: 'var(--color-text-heading)' }}>No projects yet</p>
      <p className="mt-1 text-sm font-inter max-w-xs" style={{ color: 'var(--color-muted)' }}>
        Check back soon — new projects are added regularly.
      </p>
    </div>
  )
}

export default ProjectSlider
