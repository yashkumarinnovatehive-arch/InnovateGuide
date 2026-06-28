import React, { useRef, useState, useEffect } from 'react'
import { motion, useInView, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { ArrowRight, Download, Zap, Shield, Code2, Brain, MessageCircle, CheckCircle, Users, Award, ChevronRight, Star } from 'lucide-react'
import { ProjectSlider } from '@components/ProjectSlider'
import { CategoryCard } from '@user/components/CategoryCard'
import { SearchBar } from '@components/SearchBar'
import { useTrendingProjects } from '@hooks/useProjects'
import { useFeaturedProjects } from '@hooks/useProjects'
import { useNewProjects } from '@hooks/useProjects'
import { useCategories } from '@hooks/useCategories'
import { MOCK_PROJECTS, MOCK_CATEGORIES, FAQ_ITEMS } from '@shared/constants/mockData'
import { useTheme } from '@shared/contexts/ThemeContext'

const purpleGrad = 'linear-gradient(135deg,#a78bfa 0%,#818cf8 60%,#c084fc 100%)'
const purpleBtn = 'linear-gradient(135deg,#7214ff 0%,#a365ff 100%)'

// ── AnimateCounter ───────────────────────────────────────────────────────────
function AnimateCounter({ value, suffix = '', duration = 2 }: { value: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const mv = useMotionValue(0)
  const spring = useSpring(mv, { duration: duration * 1000, bounce: 0 })
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const [display, setDisplay] = useState(0)
  useEffect(() => { if (inView) mv.set(value) }, [inView, mv, value])
  useEffect(() => { const u = spring.on('change', (v) => setDisplay(Math.floor(v))); return u }, [spring])
  return <span ref={ref}>{display.toLocaleString()}{suffix}</span>
}

// ── Pill badge ───────────────────────────────────────────────────────────────
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase font-inter"
      style={{ background: 'var(--color-pill-bg)', border: '1px solid var(--color-pill-border)', color: 'var(--color-pill-text)' }}
    >
      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#a365ff' }} />
      {children}
    </span>
  )
}

// ── FAQ item ─────────────────────────────────────────────────────────────────
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{ background: 'var(--color-card)', border: `1px solid ${open ? 'rgba(114,20,255,0.35)' : 'var(--color-border)'}` }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left group"
      >
        <span className="font-semibold text-sm pr-4 leading-snug font-sora transition-colors" style={{ color: open ? 'var(--color-text-heading)' : 'var(--color-text)' }}>
          {question}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
          style={{ background: open ? 'rgba(114,20,255,0.2)' : 'var(--color-input-bg)', border: open ? '1px solid rgba(114,20,255,0.3)' : '1px solid var(--color-border)', color: open ? '#a365ff' : 'var(--color-subtle)' }}
        >
          <span className="text-lg leading-none font-light">+</span>
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="px-5 pb-5 pt-1 text-sm font-inter leading-relaxed" style={{ color: 'var(--color-muted)', borderTop: `1px solid var(--color-border)` }}>
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isDark } = useTheme()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '')
      setTimeout(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }, [location.hash])

  const { data: trendingProjects, isLoading: isTrendingLoading } = useTrendingProjects()
  const { data: featuredProjects, isLoading: isFeaturedLoading } = useFeaturedProjects()
  const { data: newProjects, isLoading: isNewLoading } = useNewProjects()
  const { data: categories } = useCategories()

  const statsRef = useRef<HTMLDivElement>(null)
  const statsInView = useInView(statsRef, { once: true, margin: '-80px' })

  const STATS = [
    { value: 1500, label: 'Projects Listed', suffix: '+' },
    { value: 500, label: 'Student Creators', suffix: '+' },
    { value: 3000, label: 'Happy Buyers', suffix: '+' },
    { value: 95, label: 'Satisfaction Rate', suffix: '%' },
  ]

  const SERVICES = [
    { icon: <Code2 size={22} />, title: 'Full-Stack Projects', desc: 'End-to-end source code with modern stacks — React, Node.js, Django, and more.' },
    { icon: <Brain size={22} />, title: 'AI & ML Projects', desc: 'Machine learning, NLP, and computer vision projects ready for submission.' },
    { icon: <Shield size={22} />, title: 'Cybersecurity Tools', desc: 'Ethical hacking toolkits and network security scanners built by experts.' },
    { icon: <Zap size={22} />, title: 'Fast Delivery', desc: 'Instant download after payment. Get running in minutes with our setup guides.' },
    { icon: <Users size={22} />, title: 'Expert Support', desc: 'WhatsApp support from the creator for 7 days post-purchase.' },
    { icon: <Download size={22} />, title: 'Source Code Included', desc: 'Every project ships with complete, commented source code and documentation.' },
  ]

  // Floating background tiles (portfolio preview tiles like Evolvion)
  const PREVIEW_TILES = [
    { title: 'AI Attendance System', tag: 'AI & ML', color: '#6366f1' },
    { title: 'E-Commerce Platform', tag: 'Web Dev', color: '#7214ff' },
    { title: 'Cybersecurity Toolkit', tag: 'Security', color: '#ef4444' },
    { title: 'ML Price Predictor', tag: 'Data Science', color: '#06b6d4' },
    { title: 'Blockchain Voting', tag: 'Web3', color: '#f59e0b' },
  ]

  return (
    <>
      <style>{`
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .marquee-track { animation: marquee 28s linear infinite; }
        .category-slider::-webkit-scrollbar { display:none; }
        .category-slider { scrollbar-width: none; }
      `}</style>

      {/* ═══════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className={`relative min-h-screen flex items-center overflow-hidden ${isDark ? 'hero-grid-dark' : ''}`}
        style={{ background: 'var(--color-bg0)' }}
      >
        {/* Ambient glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-120px] left-[-60px] w-[600px] h-[600px] rounded-full blur-[140px]" style={{ background: 'var(--color-glow-purple)' }} />
          <div className="absolute bottom-[-80px] right-[5%] w-[500px] h-[500px] rounded-full blur-[130px]" style={{ background: isDark ? 'rgba(99,102,241,0.10)' : 'rgba(99,102,241,0.05)' }} />
        </div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center pt-16 lg:pt-20 pb-16 lg:pb-0 min-h-[90vh]"
        >
          {/* Left — copy */}
          <div className="flex flex-col gap-7">
            {/* Announcement pill — Browse now is a real link to /browse */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <Link
                to="/browse"
                className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full text-xs font-semibold font-inter cursor-pointer transition-all duration-200"
                style={{ background: 'var(--color-input-bg)', border: `1px solid var(--color-border)` }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(163,101,255,0.35)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)')}
              >
                <span className="px-2 py-0.5 rounded-full text-white text-[10px] font-bold" style={{ background: purpleBtn }}>
                  NEW
                </span>
                <span style={{ color: 'var(--color-muted)' }}>500+ Projects Now Live</span>
                <span style={{ color: '#a365ff' }} className="flex items-center gap-0.5 font-semibold">
                  Browse now <ChevronRight size={12} />
                </span>
              </Link>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.06] tracking-tight font-sora"
            >
              <span style={{ color: 'var(--color-text-heading)' }}>We Deliver</span>
              <br />
              <span style={{ background: purpleGrad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Student-Built
              </span>
              <br />
              <span style={{ color: 'var(--color-text-heading)' }}>Software</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16 }}
              className="text-base sm:text-lg leading-relaxed max-w-md font-inter"
              style={{ color: 'var(--color-muted)' }}
            >
              InnovateGuide is the #1 marketplace where students sell real-world projects.
              Buy source code, get full documentation, and build faster.
            </motion.p>

            {/* Search */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.22 }}>
              <SearchBar />
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 w-full sm:w-fit"
            >
              <button
                onClick={() => navigate('/browse')}
                className="flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 font-inter"
                style={{ background: purpleBtn, boxShadow: `0 8px 24px var(--color-glow-purple)` }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(114,20,255,0.40)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px var(--color-glow-purple)`)}
              >
                Explore Projects <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate('/upload')}
                className="flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold transition-all duration-200 font-inter"
                style={{ background: 'var(--color-input-bg)', border: `1px solid var(--color-border)`, color: 'var(--color-text)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.06)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--color-input-bg)' }}
              >
                Sell Project
              </button>
            </motion.div>

            {/* Trusted row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.42 }}
              className="flex items-center gap-3"
            >
              <div className="flex -space-x-2">
                {['RS','PM','AK','SJ','DM'].map((init) => (
                  <div
                    key={init}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2"
                    style={{ background: 'linear-gradient(135deg,#7214ff,#a365ff)', borderColor: 'var(--color-bg0)' }}
                  >
                    {init}
                  </div>
                ))}
              </div>
              <p className="text-xs font-inter" style={{ color: 'var(--color-subtle)' }}>
                Trusted by <span className="font-semibold" style={{ color: 'var(--color-text-heading)' }}>3,000+</span> students & buyers
              </p>
            </motion.div>
          </div>

          {/* Right — Preview tiles (Evolvion portfolio scroll preview) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Outer glow */}
            <div className="absolute inset-0 rounded-3xl blur-3xl" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(114,20,255,0.15) 0%, transparent 70%)' }} />
            <div
              className="relative rounded-3xl overflow-hidden border"
              style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)', padding: '1.25rem' }}
            >
              {/* Fake browser chrome */}
              <div className="flex items-center gap-2 mb-4 pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                <div className="ml-2 flex-1 h-5 rounded-md flex items-center px-2" style={{ background: 'var(--color-input-bg)' }}>
                  <span className="text-[10px] font-inter" style={{ color: 'var(--color-subtle)' }}>innovateguide.com/browse</span>
                </div>
              </div>
              {/* Project tiles */}
              <div className="grid grid-cols-2 gap-3">
                {PREVIEW_TILES.map((t, i) => (
                  <motion.div
                    key={t.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
                    className={`rounded-xl p-4 border transition-all duration-200 hover:-translate-y-0.5 cursor-pointer ${i === 2 ? 'col-span-2' : ''}`}
                    style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderColor: 'var(--color-border)' }}
                  >
                    <div className="w-8 h-8 rounded-lg mb-3 flex items-center justify-center" style={{ background: `${t.color}22` }}>
                      <span className="w-3 h-3 rounded-full" style={{ background: t.color }} />
                    </div>
                    <p className="text-xs font-semibold font-sora leading-snug mb-1" style={{ color: 'var(--color-text-heading)' }}>{t.title}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: `${t.color}22`, color: t.color }}>
                        {t.tag}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
              {/* Stars row */}
              <div className="mt-4 pt-3 border-t flex items-center gap-2" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-amber-400 text-amber-400" />)}
                </div>
                <span className="text-xs font-inter" style={{ color: 'var(--color-subtle)' }}>4.9 average rating · 200+ reviews</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          MARQUEE BAR
      ═══════════════════════════════════════════════════════ */}
      <div className="py-4 overflow-hidden" style={{ background: 'var(--color-bg1)', borderTop: `1px solid var(--color-border)`, borderBottom: `1px solid var(--color-border)` }}>
        <div className="flex">
          <div className="marquee-track flex whitespace-nowrap">
            {[...Array(2)].flatMap(() => [
              'AI Assistant', 'Smart Attendance', 'Cybersecurity Toolkit', 'ML Price Predictor',
              'E-Commerce Platform', 'Blockchain Voting', 'IoT Dashboard', 'Chat Application',
              'Inventory Manager', 'Data Visualizer',
            ]).map((item, i) => (
              <span key={i} className="inline-flex items-center gap-3 text-sm font-medium px-6 font-inter" style={{ color: 'var(--color-subtle)' }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#a365ff' }} />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          STATS BAND
      ═══════════════════════════════════════════════════════ */}
      <section className="py-16" style={{ background: 'var(--color-bg0)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={statsRef}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className="rounded-2xl p-6 text-center border"
                style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}
              >
                <p className="text-3xl lg:text-4xl font-extrabold font-sora" style={{ background: purpleGrad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {statsInView ? <AnimateCounter value={s.value} suffix={s.suffix} /> : `0${s.suffix}`}
                </p>
                <p className="mt-2 text-xs font-inter font-medium" style={{ color: 'var(--color-subtle)' }}>{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FEATURED PROJECTS
      ═══════════════════════════════════════════════════════ */}
      <section id="featured" className="py-20 border-b scroll-mt-24" style={{ background: 'var(--color-bg1)', borderColor: 'var(--color-border)' }}>
        <ProjectSlider
          title="Featured Projects"
          subtitle="Handpicked by our team for exceptional quality and impact"
          projects={featuredProjects || MOCK_PROJECTS.filter((p: any) => p.isFeatured)}
          viewAllLink="/browse?filter=featured"
          isLoading={isFeaturedLoading}
        />
      </section>

      {/* ═══════════════════════════════════════════════════════
          TRENDING
      ═══════════════════════════════════════════════════════ */}
      <section id="trending" className="py-20 border-b scroll-mt-24" style={{ background: 'var(--color-bg2)', borderColor: 'var(--color-border)' }}>
        <ProjectSlider
          title="Trending This Week"
          subtitle="Most viewed and downloaded projects right now"
          projects={trendingProjects || MOCK_PROJECTS.filter((p: any) => p.isTrending)}
          viewAllLink="/browse?filter=trending"
          isLoading={isTrendingLoading}
        />
      </section>

      {/* ═══════════════════════════════════════════════════════
          SERVICES — "Experienced Full-Stack Developers" section
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'var(--color-bg0)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-80px] right-[-80px] w-[500px] h-[500px] rounded-full blur-[150px]" style={{ background: 'rgba(114,20,255,0.12)' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left col */}
            <div>
              <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-5">
                <Pill>Why InnovateGuide</Pill>
              </motion.div>
              <motion.h2 initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.07 }} className="text-4xl sm:text-5xl font-extrabold tracking-tight font-sora mb-5">
                <span style={{ color: 'var(--color-text-heading)' }}>Experienced </span>
                <span style={{ background: purpleGrad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Student Builders</span>
              </motion.h2>
              <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.14 }} className="text-base font-inter max-w-sm mb-10" style={{ color: 'var(--color-muted)' }}>
                With 1,500+ projects delivered, we offer fast, reliable source code solutions with full documentation and unlimited support.
              </motion.p>

              {/* Big feature card — Evolvion left panel */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="rounded-3xl p-8 border relative overflow-hidden"
                style={{ background: isDark ? 'linear-gradient(145deg,#0f1535,#0a0d1e)' : 'linear-gradient(145deg,#ffffff,#f1f3f8)', borderColor: 'var(--color-border)' }}
              >
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full blur-[100px]" style={{ background: 'rgba(114,20,255,0.22)' }} />
                <div className="relative">
                  <p className="text-2xl font-extrabold font-sora mb-3" style={{ color: 'var(--color-text-heading)' }}>1,500+ Projects Launched</p>
                  <p className="text-sm font-inter mb-6 max-w-xs" style={{ color: 'var(--color-muted)' }}>
                    We build fast, reliable web and mobile apps with complete source code and unlimited revisions on custom orders.
                  </p>
                  <button
                    onClick={() => navigate('/browse')}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 font-inter"
                    style={{ background: 'rgba(114,20,255,0.08)', borderColor: 'rgba(114,20,255,0.30)', color: '#7214ff' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(114,20,255,0.15)')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(114,20,255,0.08)')}
                  >
                    View our portfolio
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Right col — service feature list */}
            <div className="flex flex-col gap-4">
              {SERVICES.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                  className="group flex items-start gap-4 rounded-2xl p-5 border cursor-pointer transition-all duration-200"
                  style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(114,20,255,0.35)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)')}
                >
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
                    style={{ background: 'rgba(114,20,255,0.12)', color: '#7214ff' }}
                  >
                    {s.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold font-sora mb-1" style={{ color: 'var(--color-text-heading)' }}>{s.title}</p>
                    <p className="text-xs font-inter leading-relaxed" style={{ color: 'var(--color-muted)' }}>{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CATEGORIES — screenshot-exact grid
      ═══════════════════════════════════════════════════════ */}
      <section id="categories" className="py-24 relative overflow-hidden border-b scroll-mt-24" style={{ background: 'var(--color-bg1)', borderColor: 'var(--color-border)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-60px] left-[20%] w-[420px] h-[420px] rounded-full blur-[130px]" style={{ background: 'rgba(114,20,255,0.10)' }} />
          <div className="absolute bottom-[-80px] right-[15%] w-[360px] h-[360px] rounded-full blur-[120px]" style={{ background: 'rgba(99,102,241,0.08)' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 flex flex-col items-center">
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-5">
              <Pill>10 Technical Domains</Pill>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.07 }} className="text-4xl sm:text-5xl font-extrabold tracking-tight font-sora">
              <span style={{ color: 'var(--color-text-heading)' }}>Explore by </span>
              <span style={{ background: purpleGrad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Category</span>
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.14 }} className="mt-4 text-base max-w-lg mx-auto font-inter" style={{ color: 'var(--color-muted)' }}>
              Browse 500+ student-built projects across every technical domain
            </motion.p>
          </div>

          {/* ── Responsive category grid ────────────────────────────────
              Desktop (lg): 3 columns, equal height
              Tablet (sm): 2 columns
              Mobile: 1 column
          ─────────────────────────────────────────────────────────── */}

          {/* Desktop 3-col grid */}
          <div
            className="hidden lg:grid gap-4"
            style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}
          >
            {(categories || MOCK_CATEGORIES).slice(0, 9).map((cat: any, i: number) => (
              <motion.div
                key={cat.id || cat.slug}
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-24px' }}
                transition={{ duration: 0.42, delay: i * 0.04, ease: 'easeOut' }}
              >
                <CategoryCard category={cat} index={i} className="h-full" />
              </motion.div>
            ))}
          </div>

          {/* Tablet / Mobile grid — 2 cols on sm, 1 col on mobile */}
          <div className="grid lg:hidden grid-cols-1 sm:grid-cols-2 gap-4">
            {(categories || MOCK_CATEGORIES).slice(0, 9).map((cat: any, i: number) => (
              <motion.div
                key={`mob-${cat.id || cat.slug}`}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
              >
                <CategoryCard category={cat} index={i} className="h-full" />
              </motion.div>
            ))}
          </div>

          {/* Browse all link */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-10 flex justify-center"
          >
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold font-inter transition-all duration-200"
              style={{ background: 'rgba(114,20,255,0.08)', border: '1px solid rgba(114,20,255,0.20)', color: '#7214ff' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(114,20,255,0.15)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(114,20,255,0.08)')}
            >
              Browse All Categories <ChevronRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          NEWLY ADDED
      ═══════════════════════════════════════════════════════ */}
      <section id="newly-added" className="py-20 border-b scroll-mt-24" style={{ background: 'var(--color-bg2)', borderColor: 'var(--color-border)' }}>
        <ProjectSlider
          title="Newly Added"
          subtitle="Fresh projects just published by creators"
          projects={newProjects || MOCK_PROJECTS.filter((p: any) => p.isNew)}
          viewAllLink="/browse?filter=new"
          isLoading={isNewLoading}
        />
      </section>

      {/* ═══════════════════════════════════════════════════════
          TOP SELLING
      ═══════════════════════════════════════════════════════ */}
      <section id="top-selling" className="py-20 border-b scroll-mt-24" style={{ background: 'var(--color-bg0)', borderColor: 'var(--color-border)' }}>
        <ProjectSlider
          title="Top Selling"
          subtitle="Best-performing projects loved by thousands of buyers"
          projects={MOCK_PROJECTS.filter((p: any) => p.isTopSelling)}
          viewAllLink="/browse?filter=top-selling"
        />
      </section>

      {/* ═══════════════════════════════════════════════════════
          CUSTOM PROJECT CTA - Redesigned, centered
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden border-b" style={{ background: 'var(--color-bg1)', borderColor: 'var(--color-border)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[180px]" style={{ background: 'rgba(114,20,255,0.12)' }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }} className="flex flex-col items-center gap-6">
            <Pill>Custom Projects</Pill>
            <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight font-sora">
              <span style={{ color: 'var(--color-text-heading)' }}>Need a Custom </span>
              <span style={{ background: purpleGrad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Solution?</span>
            </h2>
            <p className="text-base font-inter max-w-xl mx-auto" style={{ color: 'var(--color-muted)' }}>
              Can't find exactly what you need? Our expert student creators can build a custom project tailored to your specific requirements, budget, and deadline.
            </p>
            <ul className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 font-inter mt-2 mb-4">
              {['Full Source & Documentation', 'Built by Experts', 'Guided Setup'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--color-subtle)' }}>
                  <CheckCircle size={16} style={{ color: '#7214ff', flexShrink: 0 }} />
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate('/custom-project')}
              className="flex items-center gap-2 w-fit px-8 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 font-inter"
              style={{ background: purpleBtn, boxShadow: `0 8px 28px var(--color-glow-purple)` }}
            >
              Request Custom Project <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FAQ — Evolvion "What Some of Our Clients Say" style
      ═══════════════════════════════════════════════════════ */}
      <section id="faq" className="py-20 border-b" style={{ background: 'var(--color-bg0)', borderColor: 'var(--color-border)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 flex flex-col items-center">
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-4">
              <Pill>Got Questions?</Pill>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.07 }} className="text-4xl font-extrabold font-sora">
              <span style={{ color: 'var(--color-text-heading)' }}>Frequently </span>
              <span style={{ background: purpleGrad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Asked Questions</span>
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.14 }} className="mt-4 text-sm font-inter" style={{ color: 'var(--color-muted)' }}>
              Everything you need to know about InnovateGuide
            </motion.p>
          </div>
          <div className="flex flex-col gap-3">
            {(FAQ_ITEMS || []).slice(0, 6).map((item: any, idx: number) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.45, delay: idx * 0.06 }}>
                <FAQItem question={item.question} answer={item.answer} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FINAL CTA — Evolvion "Book a Call" style
      ═══════════════════════════════════════════════════════ */}
      <section className="py-28 relative overflow-hidden" style={{ background: 'var(--color-bg0)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-100px] left-[-60px] w-[600px] h-[600px] rounded-full blur-[160px]" style={{ background: 'var(--color-glow-purple)' }} />
          <div className="absolute bottom-[-80px] right-[-60px] w-[500px] h-[500px] rounded-full blur-[140px]" style={{ background: isDark ? 'rgba(99,102,241,0.10)' : 'rgba(99,102,241,0.05)' }} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-8">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }}>
            <Pill>Ready to Build?</Pill>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.05 }} className="text-5xl lg:text-6xl font-extrabold leading-tight font-sora">
            <span style={{ color: 'var(--color-text-heading)' }}>Find Your Perfect</span><br />
            <span style={{ background: purpleGrad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Project Today</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.14 }} className="text-lg font-inter max-w-xl" style={{ color: 'var(--color-muted)' }}>
            Browse 1,500+ student-built projects. Source code included. Start building today.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="w-full max-w-xl">
            <SearchBar />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.28 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/browse')}
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 font-inter"
              style={{ background: purpleBtn, boxShadow: `0 8px 28px var(--color-glow-purple)` }}
            >
              Browse Projects <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/custom-project')}
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 font-inter"
              style={{ background: 'var(--color-input-bg)', border: `1px solid var(--color-border)`, color: 'var(--color-text)' }}
            >
              Book a Call
            </button>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.36 }} className="flex flex-wrap items-center justify-center gap-6 pt-6 border-t w-full" style={{ borderColor: 'var(--color-border)' }}>
            {[
              { icon: <Shield size={14} />, text: 'Secure Payments' },
              { icon: <CheckCircle size={14} />, text: 'Verified Projects' },
              { icon: <Download size={14} />, text: 'Instant Download' },
              { icon: <Award size={14} />, text: '95% Satisfaction' },
            ].map((b) => (
              <div key={b.text} className="flex items-center gap-2 text-sm font-medium font-inter" style={{ color: 'var(--color-subtle)' }}>
                <span style={{ color: '#7214ff' }}>{b.icon}</span>
                {b.text}
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  )
}
