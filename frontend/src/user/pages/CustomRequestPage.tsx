import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import {
  CheckCircle,
  MessageCircle,
  Clock,
  Shield,
  Users,
  Send,
} from 'lucide-react'
import { Button } from '@ui/button'
import { Input } from '@ui/input'
import { Textarea } from '@ui/textarea'
import requestService from '@services/requestService'

// ─── Validation Schema ────────────────────────────────────────────────────────

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  projectType: z.string().min(1, 'Please select a project type'),
  budget: z.string().min(1, 'Please select a budget range'),
  timeline: z.string().min(1, 'Please select a timeline'),
  technologies: z.string().optional(),
  requirements: z.string().min(30, 'Please describe your project in at least 30 characters'),
  additionalInfo: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

// ─── Constants ────────────────────────────────────────────────────────────────

const PROJECT_TYPES = [
  'Web Development',
  'Mobile Application',
  'AI / Machine Learning',
  'IoT / Embedded Systems',
  'Data Science / Analytics',
  'Blockchain / Web3',
  'Cybersecurity',
  'Cloud / DevOps',
  'Desktop Application',
  'Other',
]

const BUDGET_RANGES = [
  '₹1,000 – ₹5,000',
  '₹5,000 – ₹15,000',
  '₹15,000 – ₹30,000',
  '₹30,000 – ₹50,000',
  '₹50,000+',
  'To be discussed',
]

const TIMELINES = [
  '1 week',
  '2 weeks',
  '1 month',
  '2 months',
  '3 months',
  'Flexible',
]

const BENEFITS = [
  'Free Project Consultation',
  'Student & Industry Experts',
  'Delivery & Industry Guidance',
  'Multiple Revision Support',
]

const HOW_IT_WORKS = [
  {
    step: 1,
    title: 'Submit Your Request',
    desc: 'Fill out the form with your project idea, budget, and timeline requirements.',
  },
  {
    step: 2,
    title: 'Expert Review',
    desc: 'Our team reviews your request and contacts you within 24 hours to discuss details.',
  },
  {
    step: 3,
    title: 'Get Your Project',
    desc: 'We build, test, and deliver your custom project with full documentation.',
  },
]

// ─── Animation variants ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

// ─── Field label helper ───────────────────────────────────────────────────────

const FieldLabel: React.FC<{ children: React.ReactNode; required?: boolean }> = ({
  children,
  required,
}) => (
  <label className="block text-sm font-semibold text-slate-300 mb-1.5 font-inter">
    {children}
    {required && <span className="text-rose-500 ml-0.5">*</span>}
  </label>
)

// ─── Native select wrapper ────────────────────────────────────────────────────

const NativeSelect = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { error?: string }
>(({ className = '', error, children, ...props }, ref) => (
  <div className="w-full relative">
    <select
      ref={ref}
      className={[
        'w-full h-12 rounded-xl border bg-slate-950/60 px-4 text-sm text-slate-200 appearance-none cursor-pointer',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        error
          ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20'
          : 'border-white/10 hover:border-white/20',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </select>
    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
      <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
    {error && <p className="mt-1.5 text-xs text-rose-400">{error}</p>}
  </div>
))
NativeSelect.displayName = 'NativeSelect'

// ─── Main Component ───────────────────────────────────────────────────────────

const CustomRequestPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormValues) => {
    try {
      await requestService.createCustomRequest({
        title: data.projectType,
        description: data.requirements,
        budget: undefined,
        deadline: data.timeline,
        category: data.projectType,
        ...(data as Record<string, unknown>),
      })
      setSubmitted(true)
      reset()
      toast.success('Request submitted successfully!')
    } catch {
      toast.error('Something went wrong. Please try again.')
    }
  }

  const whatsappNumber = '919876543210'
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hi! I would like to discuss a custom project requirement.'
  )}`

  return (
    <div className="min-h-screen text-slate-100 relative overflow-hidden font-inter pt-24 pb-16" style={{ background: '#080B16' }}>
      {/* Background glow blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none" style={{ background: 'rgba(114,20,255,0.08)' }} />
      <div className="absolute top-1/2 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none" style={{ background: 'rgba(99,102,241,0.06)' }} />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:52px_52px] pointer-events-none" />

      {/* ── Hero banner ── */}
      <div className="relative z-10 max-w-5xl mx-auto text-center px-6 pt-10 pb-12">
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-4 font-inter"
          style={{ background: 'rgba(114,20,255,0.12)', color: '#c4b5fd', border: '1px solid rgba(114,20,255,0.28)' }}
        >
          Premium Custom Projects
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="font-sora font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4 text-slate-100"
        >
          Get Your{' '}
          <span
            style={{ background: 'linear-gradient(135deg,#a78bfa 0%,#818cf8 60%,#c084fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
          >
            Dream Project
          </span>{' '}
          Built
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto"
        >
          Describe your idea and our expert team will craft a fully functional project
          tailored to your exact requirements — on time and within budget.
        </motion.p>
      </div>

      {/* ── Two-column content ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* ══ LEFT — Form ══ */}
          <motion.div
            className="lg:col-span-3 border border-white/8 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
            style={{ background: '#0E1330', backdropFilter: 'blur(16px)' }}
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] pointer-events-none" style={{ background: 'rgba(114,20,255,0.10)' }} />

            <motion.div variants={fadeUp} className="mb-6">
              <h2 className="font-sora font-bold text-2xl text-slate-100">
                Request Custom Project
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Fields marked with <span className="text-rose-500">*</span> are required.
              </p>
            </motion.div>

            {/* Success state */}
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center gap-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center">
                  <CheckCircle className="text-emerald-400" size={32} />
                </div>
                <h3 className="font-sora font-bold text-xl text-slate-100">
                  Request Submitted!
                </h3>
                <p className="text-slate-400 max-w-xs text-sm leading-relaxed">
                  We'll contact you within 24 hours to discuss your project requirements.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSubmitted(false)}
                  className="mt-2 border-white/10 hover:bg-white/5 text-slate-200"
                >
                  Submit Another Request
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

                {/* Row 1: Name + Email */}
                <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel required>Your Name</FieldLabel>
                    <Input
                      {...register('name')}
                      placeholder="e.g. Rahul Sharma"
                      error={errors.name?.message}
                      className="bg-slate-950/60 border-white/10 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div>
                    <FieldLabel required>Email Address</FieldLabel>
                    <Input
                      {...register('email')}
                      type="email"
                      placeholder="you@example.com"
                      error={errors.email?.message}
                      className="bg-slate-950/60 border-white/10 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20"
                    />
                  </div>
                </motion.div>

                {/* Row 2: Phone + Project Type */}
                <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel>Phone Number</FieldLabel>
                    <Input
                      {...register('phone')}
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="bg-slate-950/60 border-white/10 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div>
                    <FieldLabel required>Project Type</FieldLabel>
                    <NativeSelect
                      {...register('projectType')}
                      error={errors.projectType?.message}
                    >
                      <option value="" className="bg-[#111625]">Select project type</option>
                      {PROJECT_TYPES.map((t) => (
                        <option key={t} value={t} className="bg-[#111625]">{t}</option>
                      ))}
                    </NativeSelect>
                  </div>
                </motion.div>

                {/* Row 3: Budget + Timeline */}
                <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel required>Budget Range</FieldLabel>
                    <NativeSelect
                      {...register('budget')}
                      error={errors.budget?.message}
                    >
                      <option value="" className="bg-[#111625]">Select budget range</option>
                      {BUDGET_RANGES.map((b) => (
                        <option key={b} value={b} className="bg-[#111625]">{b}</option>
                      ))}
                    </NativeSelect>
                  </div>
                  <div>
                    <FieldLabel required>Timeline</FieldLabel>
                    <NativeSelect
                      {...register('timeline')}
                      error={errors.timeline?.message}
                    >
                      <option value="" className="bg-[#111625]">Select timeline</option>
                      {TIMELINES.map((t) => (
                        <option key={t} value={t} className="bg-[#111625]">{t}</option>
                      ))}
                    </NativeSelect>
                  </div>
                </motion.div>

                {/* Technologies */}
                <motion.div variants={fadeUp}>
                  <FieldLabel>Preferred Technologies</FieldLabel>
                  <Input
                    {...register('technologies')}
                    placeholder="e.g. React, Node.js, Python, MongoDB (comma-separated)"
                    className="bg-slate-950/60 border-white/10 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20"
                  />
                  <p className="mt-1.5 text-xs text-slate-500">
                    Enter technologies separated by commas. Leave blank if unsure.
                  </p>
                </motion.div>

                {/* Requirements */}
                <motion.div variants={fadeUp}>
                  <FieldLabel required>Project Requirements</FieldLabel>
                  <Textarea
                    {...register('requirements')}
                    placeholder="Describe your project in detail — features, functionality, goals, target users, and any specific technical requirements..."
                    className="min-h-[130px] bg-slate-950/60 border-white/10 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20"
                    error={errors.requirements?.message}
                  />
                </motion.div>

                {/* Additional Info */}
                <motion.div variants={fadeUp}>
                  <FieldLabel>Additional Information</FieldLabel>
                  <Textarea
                    {...register('additionalInfo')}
                    placeholder="Any other details — deadline constraints, reference links, design preferences, etc."
                    className="min-h-[90px] bg-slate-950/60 border-white/10 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20"
                  />
                </motion.div>

                {/* Submit */}
                <motion.div variants={fadeUp}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-semibold text-white transition-all duration-200 font-inter disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg,#7214ff,#a365ff)', boxShadow: '0 6px 20px rgba(114,20,255,0.30)' }}
                    onMouseEnter={(e) => { if (!isSubmitting) (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(114,20,255,0.45)' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(114,20,255,0.30)' }}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</span>
                    ) : (
                      <span className="flex items-center gap-2"><Send size={16} /> Request Custom Project</span>
                    )}
                  </button>
                </motion.div>
              </form>
            )}
          </motion.div>

          {/* ══ RIGHT — Trust Panel ══ */}
          <motion.div
            className="lg:col-span-2 space-y-5"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {/* Custom Project Support card */}
            <div className="rounded-3xl border border-white/8 p-6 shadow-2xl relative overflow-hidden" style={{ background: '#0E1330', backdropFilter: 'blur(16px)' }}>
              <div className="absolute top-0 left-0 w-64 h-64 rounded-full blur-[80px] pointer-events-none" style={{ background: 'rgba(114,20,255,0.10)' }} />

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(114,20,255,0.15)', border: '1px solid rgba(114,20,255,0.25)' }}>
                  <Shield size={20} style={{ color: '#a365ff' }} />
                </div>
                <h3 className="font-sora font-bold text-lg text-white">Custom Project Support</h3>
              </div>

              <ul className="space-y-3 mb-6">
                {BENEFITS.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle size={13} className="text-emerald-400" />
                    </div>
                    <span className="text-sm text-slate-350">{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="grid grid-cols-3 gap-3 mb-6 pt-5 border-t border-white/10">
                <div className="text-center">
                  <p className="font-sora font-bold text-xl text-slate-100">500+</p>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold mt-0.5">Projects Done</p>
                </div>
                <div className="text-center border-x border-white/10">
                  <p className="font-sora font-bold text-xl text-slate-100">24h</p>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold mt-0.5">Response Time</p>
                </div>
                <div className="text-center">
                  <p className="font-sora font-bold text-xl text-slate-100">4.9</p>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold mt-0.5">Avg Rating</p>
                </div>
              </div>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-300"
                style={{ background: '#25D366', boxShadow: '0 4px 16px rgba(37,211,102,0.28)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#1ebe57'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 24px rgba(37,211,102,0.42)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#25D366'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(37,211,102,0.28)'; (e.currentTarget as HTMLElement).style.transform = 'none' }}
              >
                <MessageCircle size={18} />
                Contact via WhatsApp
              </a>
            </div>

            {/* How It Works card */}
            <div className="rounded-3xl border border-white/8 p-6 shadow-2xl relative overflow-hidden" style={{ background: '#0E1330', backdropFilter: 'blur(16px)' }}>
              <div className="absolute top-0 left-0 w-64 h-64 rounded-full blur-[80px] pointer-events-none" style={{ background: 'rgba(114,20,255,0.08)' }} />

              <div className="flex items-center gap-2 mb-5">
                <Clock size={18} style={{ color: '#a365ff' }} />
                <h3 className="font-sora font-bold text-base text-white">How It Works</h3>
              </div>

              <ol className="space-y-5">
                {HOW_IT_WORKS.map(({ step, title, desc }) => (
                  <li key={step} className="flex gap-4">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                      style={{ background: 'rgba(114,20,255,0.15)', border: '1px solid rgba(114,20,255,0.30)', color: '#c4b5fd' }}
                    >
                      {step}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-200">{title}</p>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Expert team badge */}
            <div className="rounded-3xl border p-5 flex items-start gap-4 relative overflow-hidden" style={{ background: 'rgba(114,20,255,0.06)', borderColor: 'rgba(114,20,255,0.20)', backdropFilter: 'blur(16px)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(114,20,255,0.15)', border: '1px solid rgba(114,20,255,0.25)' }}>
                <Users size={20} style={{ color: '#a365ff' }} />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: '#c4b5fd' }}>Expert Team</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Every custom project is handled by verified developers with industry experience
                  in your chosen technology stack.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CustomRequestPage



