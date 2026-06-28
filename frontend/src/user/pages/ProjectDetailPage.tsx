import React, { useState } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Star,
  Download,
  Eye,
  MessageCircle,
  Share2,
  ChevronLeft,
  ShoppingBag,
  Play,
  ExternalLink,
  Check,
  Shield,
  FileText,
  Video,
  Code2,
  Bookmark,
  Copy,
  Tag,
  BarChart2,
  Calendar,
} from 'lucide-react'
import { Button } from '@ui/button'
import { Badge } from '@ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@ui/tabs'
import { ProjectSlider } from '@components/ProjectSlider'
import { useProject } from '@hooks/useProjects'
import { MOCK_PROJECTS } from '@shared/constants/mockData'
import {
  formatPrice,
  formatDate,
  getWhatsAppLink,
  generateCreatorId,
} from '@utils/index'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={
            i <= Math.round(rating)
              ? 'fill-amber-400 text-amber-400'
              : 'fill-slate-200 text-[var(--color-text-heading)]'
          }
        />
      ))}
    </span>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'overview'

  const handleTabChange = (value: string) => {
    setSearchParams((prev) => {
      prev.set('tab', value)
      return prev
    }, { replace: true })
  }
  const { data: project, isLoading, isError } = useProject(id)

  const proj = project ?? MOCK_PROJECTS.find((p) => p.id === id) ?? MOCK_PROJECTS[0]

  const [mainImage, setMainImage] = useState<number>(0)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-accent border-t-transparent animate-spin" />
      </div>
    )
  }

  if (isError && !proj) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-lg text-[var(--color-muted)]">Project not found.</p>
        <Button asChild variant="outline">
          <Link to="/browse">Back to Browse</Link>
        </Button>
      </div>
    )
  }

  const images: string[] = proj.screenshots.length > 0 ? proj.screenshots : []
  const hasImages = images.length > 0

  const creatorLabel = generateCreatorId(proj.id)
  const whatsappHref = getWhatsAppLink(proj.title, proj.price)

  const diffVariantMap: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
    beginner: 'success',
    intermediate: 'warning',
    advanced: 'danger',
  }
  const diffVariant = diffVariantMap[proj.difficulty] ?? 'default'

  const highlights = [
    `Domain: ${proj.domain}`,
    `Difficulty: ${proj.difficulty.charAt(0).toUpperCase() + proj.difficulty.slice(1)}`,
    `Technologies: ${proj.technologies.join(', ')}`,
    'Complete source code included',
    'Detailed documentation provided',
    ...(proj.videoUrl ? ['Step-by-step video tutorial included'] : []),
    '7-day WhatsApp support after purchase',
  ]

  const mockReviews = [
    { id: 'r1', name: 'Anonymous Buyer', rating: 5, comment: 'Excellent project, well documented and easy to run. Highly recommended!', date: '2026-05-10' },
    { id: 'r2', name: 'Anonymous Buyer', rating: 4, comment: 'Good quality code, support team was responsive on WhatsApp.', date: '2026-04-28' },
  ]

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const related = MOCK_PROJECTS.filter((p) => p.id !== proj.id).slice(0, 5)

  return (
    <div className="min-h-screen bg-[var(--color-bg0)] text-[var(--color-text-heading)] relative overflow-hidden font-inter pt-24">
      {/* Background glow blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* ── Breadcrumb ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2 relative z-10">
        <nav className="flex items-center gap-2 text-sm text-[var(--color-subtle)]">
          <Link to="/" className="hover:text-orange-400 transition-colors">Home</Link>
          <span className="text-slate-600">/</span>
          <Link to="/browse" className="hover:text-orange-400 transition-colors">Browse</Link>
          <span className="text-slate-600">/</span>
          <span className="text-[var(--color-text-heading)] font-medium truncate max-w-xs">{proj.title}</span>
        </nav>
      </div>

      {/* ── Back link ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 relative z-10">
        <Link
          to="/browse"
          className="inline-flex items-center gap-1 text-sm text-[var(--color-subtle)] hover:text-orange-400 transition-colors"
        >
          <ChevronLeft size={15} />
          Back to Browse
        </Link>
      </div>

      {/* ── Two-column layout ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* ══ LEFT CONTENT (2/3) ══════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex-1 min-w-0 w-full"
          >
            {/* ── Image Gallery ── */}
            <div className="mb-6">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-[var(--color-input-bg)] border border-[var(--color-border)] shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md">
                {hasImages ? (
                  <img
                    src={images[mainImage]}
                    alt={proj.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-orange-500/10 via-[var(--color-bg2)] to-rose-500/10">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] flex items-center justify-center shadow-lg">
                      <Code2 size={32} className="text-orange-400" />
                    </div>
                    <span className="font-sora font-bold text-[var(--color-text-heading)] text-xl text-center px-4">
                      {proj.title}
                    </span>
                    <span className="text-orange-300 text-sm bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">{proj.domain}</span>
                  </div>
                )}

                <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap">
                  {proj.isTrending && <Badge variant="trending" className="bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md">Trending</Badge>}
                  {proj.isNew && <Badge variant="new" className="bg-orange-500/20 text-orange-300 border border-orange-500/30 backdrop-blur-md">New</Badge>}
                  {proj.isTopSelling && <Badge variant="top-seller" className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">Top Seller</Badge>}
                  {proj.isFeatured && <Badge variant="purple" className="bg-purple-500/20 text-purple-300 border border-purple-500/30 backdrop-blur-md">Featured</Badge>}
                </div>
              </div>

              {(hasImages || proj.videoUrl) && (
                <div className="flex gap-3 mt-3 overflow-x-auto pb-1 scrollbar-hide">
                  {images.map((src, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMainImage(idx)}
                      className={`relative flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                        mainImage === idx
                          ? 'border-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.5)] scale-95'
                          : 'border-[var(--color-border)] opacity-60 hover:opacity-100 hover:border-white/20'
                      }`}
                    >
                      <img src={src} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}

                  {proj.videoUrl && (
                    <a
                      href={proj.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 border-transparent bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center hover:scale-95 transition-all duration-300 shadow-[0_0_12px_rgba(244,63,94,0.3)] hover:shadow-[0_0_16px_rgba(244,63,94,0.5)]"
                      title="Watch Video Tutorial"
                    >
                      <Play size={18} className="text-white fill-white animate-pulse" />
                      <span className="sr-only">Play tutorial video</span>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* ── Tabs Section ── */}
            <div className="bg-[var(--color-bg1)]/40 border border-[var(--color-border)] rounded-2xl p-6 backdrop-blur-md shadow-2xl relative overflow-hidden mb-8 lg:mb-0">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[80px] pointer-events-none" />

              <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="flex overflow-x-auto md:flex-wrap whitespace-nowrap scrollbar-hide max-w-full h-auto gap-1 mb-6 bg-[var(--color-input-bg)] p-1 rounded-xl border border-[var(--color-border)]">
                  <TabsTrigger value="overview" className="px-4 py-2 text-sm text-[var(--color-subtle)] data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all rounded-lg">Overview</TabsTrigger>
                  <TabsTrigger value="features" className="px-4 py-2 text-sm text-[var(--color-subtle)] data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all rounded-lg">Features</TabsTrigger>
                  <TabsTrigger value="technologies" className="px-4 py-2 text-sm text-[var(--color-subtle)] data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all rounded-lg">Technologies</TabsTrigger>
                  <TabsTrigger value="documentation" className="px-4 py-2 text-sm text-[var(--color-subtle)] data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all rounded-lg">Documentation</TabsTrigger>
                  <TabsTrigger value="reviews" className="px-4 py-2 text-sm text-[var(--color-subtle)] data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all rounded-lg">
                    Reviews ({proj.reviewCount})
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-sora font-semibold text-[var(--color-text-heading)] text-lg mb-3">
                        About this Project
                      </h3>
                      <p className="text-[var(--color-text)] leading-relaxed text-sm whitespace-pre-line font-inter">
                        {proj.description}
                      </p>
                    </div>

                    <hr className="border-[var(--color-border)] my-4" />

                    <div>
                      <h3 className="font-sora font-semibold text-[var(--color-text-heading)] text-base mb-3">
                        Key Highlights
                      </h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--color-text)] bg-[var(--color-bg0)]/20 p-2.5 rounded-xl border border-[var(--color-border)]">
                            <Check
                              size={16}
                              className="text-emerald-400 mt-0.5 shrink-0 bg-emerald-500/10 p-0.5 rounded"
                            />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {proj.tags.length > 0 && (
                      <div>
                        <h3 className="font-sora font-semibold text-[var(--color-text-heading)] text-base mb-3">
                          Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {proj.tags.map((tag) => (
                            <Badge key={tag} className="text-xs bg-[var(--color-input-bg)] text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-bg1)]">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Features Tab */}
                <TabsContent value="features">
                  <div className="space-y-4">
                    <h3 className="font-sora font-semibold text-[var(--color-text-heading)] text-lg mb-2">
                      Project Features
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        'Complete, production-ready source code',
                        'Modular and well-commented codebase',
                        'Detailed README with setup and installation guide',
                        'Database schema and sample data included',
                        'Responsive UI compatible with all screen sizes',
                        'Admin panel with role-based access control',
                        'Secure authentication and authorization flow',
                        'RESTful API with proper error handling',
                        'Unit and integration test suite',
                        'Deployment-ready configuration files',
                        ...(proj.videoUrl ? ['Full video walkthrough of all features'] : []),
                        'WhatsApp support for 7 days post-purchase',
                      ].map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 bg-[var(--color-bg0)]/20 p-3 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-border)] transition-colors">
                          <span className="w-5 h-5 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0 mt-0.5 border border-orange-500/20">
                            <Check size={12} className="text-orange-400" />
                          </span>
                          <span className="text-sm text-[var(--color-text)]">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                {/* Technologies Tab */}
                <TabsContent value="technologies">
                  <div className="space-y-5">
                    <h3 className="font-sora font-semibold text-[var(--color-text-heading)] text-lg">
                      Technologies Used
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {proj.technologies.map((tech) => (
                        <div
                          key={tech}
                          className="flex items-center gap-3 p-3 bg-[var(--color-input-bg)] rounded-xl border border-[var(--color-border)] hover:border-[var(--color-border)] transition-colors"
                        >
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500/20 to-rose-500/20 border border-orange-500/30 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(249,115,22,0.15)]">
                            <Code2 size={16} className="text-orange-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-[var(--color-text-heading)] text-sm">{tech}</p>
                            <p className="text-xs text-[var(--color-muted)]">Core technology</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Documentation Tab */}
                <TabsContent value="documentation">
                  <div className="space-y-5">
                    <h3 className="font-sora font-semibold text-[var(--color-text-heading)] text-lg">
                      Documentation
                    </h3>
                    <div className="p-5 bg-emerald-950/20 border border-emerald-500/20 rounded-xl flex items-start gap-4 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                        <FileText size={20} className="text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-emerald-300 text-sm mb-1">
                          Comprehensive Documentation Included
                        </p>
                        <p className="text-[var(--color-text)] text-sm leading-relaxed">
                          This project comes with detailed documentation covering system architecture,
                          database design, API endpoints, installation steps, and usage instructions.
                          Perfect for academic submission and personal learning.
                        </p>
                      </div>
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        'System Design and Architecture Document',
                        'Database Schema (ER Diagram + SQL/NoSQL scripts)',
                        'API Reference with request/response examples',
                        'Step-by-step Installation & Setup Guide',
                        'User Manual with screenshots',
                        'Project Report Template (IEEE format)',
                        'Environment configuration instructions',
                      ].map((doc, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-[var(--color-text)] bg-[var(--color-bg0)]/10 p-2.5 rounded-lg border border-[var(--color-border)]">
                          <Check size={14} className="text-emerald-400 shrink-0" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                {/* Reviews Tab */}
                <TabsContent value="reviews">
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row items-center gap-6 p-5 bg-amber-950/10 border border-amber-500/10 rounded-xl">
                      <div className="text-center md:border-r md:border-[var(--color-border)] md:pr-8 shrink-0">
                        <p className="font-sora font-bold text-4xl text-[var(--color-text-heading)]">
                          {proj.rating.toFixed(1)}
                        </p>
                        <div className="my-1.5">
                          <StarRating rating={proj.rating} size={14} />
                        </div>
                        <p className="text-xs text-[var(--color-subtle)] mt-1">
                          {proj.reviewCount} reviews
                        </p>
                      </div>
                      <div className="flex-1 w-full">
                        {[5, 4, 3, 2, 1].map((star) => {
                          const pct = star === 5 ? 65 : star === 4 ? 22 : star === 3 ? 8 : star === 2 ? 3 : 2
                          return (
                            <div key={star} className="flex items-center gap-2 mb-1.5">
                              <span className="text-xs text-[var(--color-subtle)] w-3">{star}</span>
                              <Star size={10} className="fill-amber-400 text-amber-400" />
                              <div className="flex-1 h-2 bg-[var(--color-bg2)] rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="text-xs text-[var(--color-subtle)] w-8 text-right">{pct}%</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {mockReviews.length > 0 ? (
                      <div className="space-y-4">
                        {mockReviews.map((review) => (
                          <div
                            key={review.id}
                            className="p-4 bg-[var(--color-bg0)]/30 border border-[var(--color-border)] rounded-xl hover:border-[var(--color-border)] transition-colors"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center text-white text-xs font-bold shadow-[0_0_8px_rgba(249,115,22,0.3)]">
                                  AB
                                </div>
                                <span className="text-sm font-medium text-[var(--color-text-heading)]">
                                  {review.name}
                                </span>
                              </div>
                              <span className="text-xs text-[var(--color-muted)]">
                                {formatDate(review.date)}
                              </span>
                            </div>
                            <div className="mb-2">
                              <StarRating rating={review.rating} size={13} />
                            </div>
                            <p className="text-sm text-[var(--color-text)] leading-relaxed">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 text-[var(--color-muted)] bg-[var(--color-bg0)]/20 rounded-xl border border-[var(--color-border)]">
                        <Star size={32} className="mx-auto mb-2 opacity-20" />
                        <p className="text-sm">No reviews yet. Be the first to review!</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>

          {/* ══ RIGHT SIDEBAR (1/3) ══════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="w-full lg:w-[340px] xl:w-[360px] flex-shrink-0 relative z-10"
          >
            <div className="sticky top-24 space-y-4">
              {/* ── Purchase Card ── */}
              <div className="bg-[var(--color-bg1)]/40 border border-[var(--color-border)] rounded-2xl p-5 backdrop-blur-md shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[80px] pointer-events-none" />

                <h1 className="font-sora font-bold text-2xl text-[var(--color-text-heading)] leading-snug mb-1">
                  {proj.title}
                </h1>

                <p className="text-sm text-[var(--color-subtle)] mb-3">
                  by{' '}
                  <span className="font-semibold text-orange-400">
                    {creatorLabel}
                  </span>
                </p>

                <div className="flex items-center gap-2 mb-4">
                  <StarRating rating={proj.rating} />
                  <span className="text-sm font-semibold text-[var(--color-text-heading)]">
                    {proj.rating.toFixed(1)}
                  </span>
                  <span className="text-sm text-slate-555">
                    ({proj.reviewCount} reviews)
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-5">
                  <span className="font-sora font-bold text-3xl text-orange-400">
                    {formatPrice(proj.price)}
                  </span>
                  <span className="text-sm text-[var(--color-muted)]">one-time</span>
                </div>

                <Link
                  to={`/buy/${proj.id}`}
                  className="w-full flex items-center justify-center gap-2 mb-3 py-3 rounded-xl text-sm font-bold font-inter text-white transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg,#7214ff 0%,#a365ff 100%)', boxShadow: '0 4px 14px rgba(114,20,255,0.28)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(114,20,255,0.40)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 14px rgba(114,20,255,0.28)' }}
                >
                  <ShoppingBag size={18} />
                  Buy
                </Link>

                <Link to="/custom-project" className="block w-full mb-4">
                  <Button variant="outline" size="lg" className="w-full border-[var(--color-border)] text-[var(--color-text-heading)] hover:bg-[var(--color-card)] hover:text-white transition-all duration-300 hover:-translate-y-0.5">
                    <ExternalLink size={16} />
                    Request Similar Project
                  </Button>
                </Link>

                <button
                  onClick={() => setSaved((s) => !s)}
                  className={`flex items-center gap-2 text-sm transition-all duration-200 ${
                    saved ? 'text-orange-400 font-semibold' : 'text-[var(--color-subtle)] hover:text-orange-400'
                  }`}
                >
                  <Bookmark
                    size={16}
                    className={saved ? 'fill-orange-400 text-orange-400' : ''}
                  />
                  {saved ? 'Saved to Wishlist' : 'Save to Wishlist'}
                </button>

                <hr className="my-5 border-[var(--color-border)]" />

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="flex items-center gap-2.5 p-2.5 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-xl">
                    <Eye size={15} className="text-[var(--color-subtle)] shrink-0" />
                    <div>
                      <p className="text-[10px] text-[var(--color-muted)] uppercase font-semibold">Views</p>
                      <p className="text-sm font-semibold text-[var(--color-text-heading)]">
                        {proj.views.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 p-2.5 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-xl">
                    <Download size={15} className="text-[var(--color-subtle)] shrink-0" />
                    <div>
                      <p className="text-[10px] text-[var(--color-muted)] uppercase font-semibold">Downloads</p>
                      <p className="text-sm font-semibold text-[var(--color-text-heading)]">
                        {proj.downloads.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 p-2.5 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-xl">
                    <BarChart2 size={15} className="text-[var(--color-subtle)] shrink-0" />
                    <div>
                      <p className="text-[10px] text-[var(--color-muted)] uppercase font-semibold">Difficulty</p>
                      <Badge className={`text-[10px] capitalize mt-0.5 border px-1.5 py-0.5 rounded-md ${
                        proj.difficulty === 'beginner'
                          ? 'bg-green-500/10 text-green-300 border-green-500/20'
                          : proj.difficulty === 'intermediate'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                      }`}>
                        {proj.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 p-2.5 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-xl">
                    <Tag size={15} className="text-[var(--color-subtle)] shrink-0" />
                    <div>
                      <p className="text-[10px] text-[var(--color-muted)] uppercase font-semibold">Category</p>
                      <p className="text-sm font-semibold text-[var(--color-text-heading)] truncate">
                        {proj.domain}
                      </p>
                    </div>
                  </div>
                </div>

                {proj.updatedAt && (
                  <div className="flex items-center gap-2 text-xs text-[var(--color-muted)] mb-4 bg-[var(--color-bg0)]/20 p-2 rounded-lg border border-[var(--color-border)]">
                    <Calendar size={13} className="text-orange-400" />
                    <span>Last updated {formatDate(proj.updatedAt)}</span>
                  </div>
                )}

                <div className="mb-5">
                  <p className="text-[10px] font-semibold text-[var(--color-subtle)] uppercase tracking-wider mb-2">
                    Tech Stack
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {proj.technologies.map((t) => (
                      <Badge key={t} className="text-xs bg-orange-500/10 text-orange-300 border border-orange-500/20">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>

                <hr className="my-5 border-[var(--color-border)]" />

                <div className="space-y-2.5 mb-5">
                  <p className="text-[10px] font-semibold text-[var(--color-subtle)] uppercase tracking-wider mb-2.5">
                    What's Included
                  </p>
                  {[
                    { icon: Shield, label: 'Admin Approved' },
                    { icon: Code2, label: 'Source Code Included' },
                    ...(proj.videoUrl ? [{ icon: Video, label: 'Video Tutorial Included' }] : []),
                    { icon: FileText, label: 'Documentation Included' },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2.5 text-sm text-[var(--color-text)]">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                        <Check size={11} className="text-emerald-400" />
                      </span>
                      <Icon size={14} className="text-[var(--color-subtle)] shrink-0" />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>

                <hr className="my-5 border-[var(--color-border)]" />

                <div>
                  <p className="text-[10px] font-semibold text-[var(--color-subtle)] uppercase tracking-wider mb-2.5">
                    Share
                  </p>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        `Check out "${proj.title}" on InnovateGuide — ${window.location.href}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-text)] hover:bg-[var(--color-card)] hover:text-[#1DA1F2] transition-colors"
                    >
                      <Share2 size={14} />
                      <span>Share</span>
                    </a>
                    <button
                      onClick={handleCopyLink}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-text)] hover:bg-[var(--color-card)] transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check size={14} className="text-emerald-400 animate-bounce" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Related / Similar Projects ── */}
        <div className="mt-16 relative z-10">
          <ProjectSlider
            title="Similar Projects"
            subtitle="You might also like these projects"
            projects={related}
            viewAllLink="/browse"
          />
        </div>
      </div>
    </div>
  )
}



