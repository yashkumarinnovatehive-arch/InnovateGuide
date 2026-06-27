import * as React from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react'
import { cn } from '@utils/index'
import { CardSkeleton } from '@ui/skeleton'
import { ProjectCard } from './ProjectCard'
import type { Project } from '@ig-types/index'

const PURPLE_BTN = 'linear-gradient(135deg,#7214ff 0%,#a365ff 100%)'
const CARD_BG    = '#0E1330'
const BORDER     = 'rgba(255,255,255,0.06)'

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
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h2
              className="font-sora font-extrabold text-2xl sm:text-3xl text-white leading-tight"
            >
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-sm font-inter" style={{ color: 'rgba(255,255,255,0.50)' }}>
                {subtitle}
              </p>
            )}
          </div>
          {viewAllLink && (
            <Link
              to={viewAllLink}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold font-inter text-white transition-all duration-200 shrink-0 self-start sm:self-auto"
              style={{ background: 'rgba(114,20,255,0.14)', border: '1px solid rgba(114,20,255,0.28)', color: '#c4b5fd' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(114,20,255,0.26)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(114,20,255,0.14)' }}
            >
              <LayoutGrid size={13} />
              View All
              <ChevronRight size={13} />
            </Link>
          )}
        </div>

        {/* ── Slider ──────────────────────────────────────────────────── */}
        <div className="relative">
          {/* Left arrow */}
          <NavArrow
            direction="left"
            onClick={() => scrollBy('left')}
            disabled={!canScrollLeft}
          />

          {/* Right arrow */}
          <NavArrow
            direction="right"
            onClick={() => scrollBy('right')}
            disabled={!canScrollRight}
          />

          {isLoading ? (
            <div className="flex justify-center">
              <div className="inline-flex gap-4 overflow-hidden">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="min-w-[300px] md:min-w-[320px] flex-shrink-0">
                    <SkeletonCard />
                  </div>
                ))}
              </div>
            </div>
          ) : projects.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex justify-center">
              <div
                ref={scrollRef}
                role="list"
                className="inline-flex gap-4 overflow-x-auto pb-2 cursor-grab select-none max-w-full"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
              >
                {projects.map((project, i) => (
                  <div key={project.id} role="listitem" className="min-w-[300px] md:min-w-[320px] flex-shrink-0">
                    <ProjectCard project={project} variant="default" index={i} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Pagination dots ─────────────────────────────────────────── */}
        {!isLoading && projects.length > 0 && totalDots > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {Array.from({ length: totalDots }).map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToDot(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="rounded-full transition-all duration-300"
                style={
                  i === progress
                    ? { width: 24, height: 6, background: PURPLE_BTN, boxShadow: '0 0 8px rgba(114,20,255,0.5)' }
                    : { width: 6, height: 6, background: 'rgba(255,255,255,0.15)' }
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
function NavArrow({ direction, onClick, disabled }: { direction: 'left' | 'right'; onClick: () => void; disabled: boolean }) {
  const [hov, setHov] = React.useState(false)
  return (
    <button
      onClick={onClick}
      aria-label={`Scroll ${direction}`}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="absolute top-1/2 z-10 hidden sm:flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200"
      style={{
        [direction === 'left' ? 'left' : 'right']: 0,
        transform: `translateY(-50%) ${direction === 'left' ? 'translateX(-50%)' : 'translateX(50%)'}`,
        background: disabled ? 'rgba(255,255,255,0.04)' : hov ? 'linear-gradient(135deg,#7214ff,#a365ff)' : '#0E1330',
        border: `1px solid ${disabled ? 'rgba(255,255,255,0.06)' : hov ? 'rgba(114,20,255,0.40)' : 'rgba(255,255,255,0.10)'}`,
        boxShadow: hov && !disabled ? '0 0 16px rgba(114,20,255,0.35)' : 'none',
        opacity: disabled ? 0.25 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: disabled ? 'rgba(255,255,255,0.30)' : hov ? '#fff' : 'rgba(255,255,255,0.70)',
      }}
    >
      {direction === 'left' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
    </button>
  )
}

// ── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden animate-pulse" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
      <div className="aspect-video" style={{ background: 'rgba(255,255,255,0.04)' }} />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-3.5 rounded-full w-3/4" style={{ background: 'rgba(255,255,255,0.06)' }} />
        <div className="h-3 rounded-full w-1/2" style={{ background: 'rgba(255,255,255,0.04)' }} />
        <div className="flex gap-2 mt-1">
          <div className="h-5 rounded-lg w-12" style={{ background: 'rgba(255,255,255,0.04)' }} />
          <div className="h-5 rounded-lg w-14" style={{ background: 'rgba(255,255,255,0.04)' }} />
        </div>
        <div className="h-8 rounded-xl mt-2" style={{ background: 'rgba(255,255,255,0.04)' }} />
        <div className="h-8 rounded-xl" style={{ background: 'rgba(114,20,255,0.12)' }} />
      </div>
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-4 rounded-2xl text-center"
      style={{ background: CARD_BG, border: `1px dashed ${BORDER}` }}
    >
      <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}` }}>
        <LayoutGrid size={24} style={{ color: 'rgba(255,255,255,0.30)' }} />
      </div>
      <p className="font-sora font-semibold text-base text-white">No projects yet</p>
      <p className="mt-1 text-sm font-inter max-w-xs" style={{ color: 'rgba(255,255,255,0.40)' }}>
        Check back soon — new projects are added regularly.
      </p>
    </div>
  )
}

export default ProjectSlider
