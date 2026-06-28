import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ShoppingBag, ChevronLeft, CheckCircle2, Shield, Info, CreditCard } from 'lucide-react'
import { toast } from 'sonner'

import { useProject } from '@shared/hooks/useProjects'
import { Button } from '@ui/button'
import { cn } from '@utils/index'

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const formSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().regex(/^\+?[\d\s-]{10,}$/, 'Invalid mobile number'),
  college: z.string().min(2, 'College name is required'),
  course: z.string().min(2, 'Course name is required'),
  year: z.string().min(1, 'Please select your year'),
  deliveryNotes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

// ─── Animations ───────────────────────────────────────────────────────────────

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

// ─── Reusable Form Components ─────────────────────────────────────────────────

const FieldLabel: React.FC<{ children: React.ReactNode; required?: boolean }> = ({ children, required }) => (
  <label className="block text-sm font-semibold text-[var(--color-text-heading)] mb-2 text-left">
    {children}
    {required && <span className="text-rose-500 ml-1">*</span>}
  </label>
)

const StyledInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { error?: string }>(
  ({ error, className, ...props }, ref) => (
    <div className="text-left w-full relative">
      <input
        ref={ref}
        className={cn(
          'w-full px-4 py-3 rounded-xl bg-[var(--color-bg0)] text-[var(--color-text)] placeholder:text-[var(--color-muted)]',
          'border outline-none transition-all duration-300',
          'focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500',
          error ? 'border-rose-500/50' : 'border-[var(--color-border)] hover:border-[var(--color-text-heading)]/20',
          className
        )}
        {...props}
      />
    </div>
  )
)
StyledInput.displayName = 'StyledInput'

const StyledSelect = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & { error?: string }>(
  ({ error, children, className, ...props }, ref) => (
    <div className="relative text-left w-full">
      <select
        ref={ref}
        className={cn(
          'w-full px-4 py-3 rounded-xl bg-[var(--color-bg0)] text-[var(--color-text)] appearance-none',
          'border outline-none transition-all duration-300',
          'focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500',
          error ? 'border-rose-500/50' : 'border-[var(--color-border)] hover:border-[var(--color-text-heading)]/20',
          className
        )}
        {...props}
      >
        {children}
      </select>
      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[var(--color-subtle)]">
        <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
)
StyledSelect.displayName = 'StyledSelect'

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BuyProjectPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  // Fetch project details
  const { data: proj, isLoading, error: projError } = useProject(id)

  const [isSubmittingForm, setIsSubmittingForm] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  // Format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const onSubmit = async (data: FormValues) => {
    if (!proj) return
    setIsSubmittingForm(true)

    try {
      // 1. SILENT GOOGLE FORM SUBMISSION
      // Replace this URL with your actual Google Form 'formResponse' URL
      const GOOGLE_FORM_ACTION_URL = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID_HERE/formResponse'
      
      const formData = new FormData()
      // Replace these 'entry.123456' with your actual Google Form entry IDs
      formData.append('entry.1111111', data.fullName)
      formData.append('entry.2222222', data.email)
      formData.append('entry.3333333', data.mobile)
      formData.append('entry.4444444', data.college)
      formData.append('entry.5555555', data.course)
      formData.append('entry.6666666', data.year)
      formData.append('entry.7777777', proj.title) // Project they are buying
      formData.append('entry.8888888', data.deliveryNotes || '')

      // Send via no-cors so we don't get blocked by browser policies
      await fetch(GOOGLE_FORM_ACTION_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
      })

      // 2. WHATSAPP REDIRECTION
      const whatsappNumber = '919876543210' // Admin WhatsApp number
      
      const text = `*New Order Request*%0A%0A` +
        `*Project:* ${proj.title}%0A` +
        `*Price:* ${formatPrice(proj.price)}%0A%0A` +
        `*Student Details:*%0A` +
        `- Name: ${data.fullName}%0A` +
        `- Email: ${data.email}%0A` +
        `- Mobile: ${data.mobile}%0A` +
        `- College: ${data.college}%0A` +
        `- Course: ${data.course} (Year ${data.year})%0A%0A` +
        (data.deliveryNotes ? `*Notes:* ${data.deliveryNotes}%0A` : '') +
        `Please guide me with the next steps for payment and delivery.`

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${text}`
      
      toast.success('Order processed! Redirecting to WhatsApp...')
      
      // Give a tiny delay for toast to show, then redirect
      setTimeout(() => {
        window.open(whatsappUrl, '_blank')
        navigate('/projects/' + proj.id) // Return back to project page
      }, 1500)

    } catch (err) {
      console.error(err)
      toast.error('Failed to process order. Please try again.')
      setIsSubmittingForm(false)
    }
  }

  if (isLoading) {
    return <div className="min-h-screen bg-[var(--color-bg0)] flex items-center justify-center pt-24"><div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" /></div>
  }

  if (projError || !proj) {
    return <div className="min-h-screen bg-[var(--color-bg0)] flex flex-col items-center justify-center pt-24 text-[var(--color-text)]">Project not found.<Link to="/browse" className="text-purple-500 mt-4 underline">Go Back</Link></div>
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg0)] text-[var(--color-text-heading)] relative overflow-hidden font-inter pt-24 pb-20">
      
      {/* Glow Backgrounds */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Back Link */}
        <Link
          to={`/projects/${proj.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-subtle)] hover:text-purple-500 transition-colors mb-6"
        >
          <ChevronLeft size={16} />
          Back to Project
        </Link>

        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="font-sora font-bold text-3xl sm:text-4xl text-[var(--color-text-heading)] mb-3">
            Complete Your Purchase
          </h1>
          <p className="text-[var(--color-subtle)] text-base">
            Fill in your details below to purchase <strong>{proj.title}</strong>. Our team will verify and deliver the source code shortly.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <AnimatePresence>
            <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">
              
              {/* SECTION 1: Order Summary */}
              <motion.div variants={fadeUp} className="bg-[var(--color-bg1)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 shadow-sm backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-purple-400" />
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 font-bold font-sora shrink-0">
                    1
                  </div>
                  <h2 className="font-sora font-bold text-xl text-[var(--color-text-heading)]">Order Summary</h2>
                </div>
                
                <div className="bg-[var(--color-bg0)] border border-[var(--color-border)] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-lg text-[var(--color-text-heading)]">{proj.title}</h3>
                    <p className="text-sm text-[var(--color-muted)] mt-1 flex items-center gap-2">
                      <Shield size={14} className="text-emerald-500" /> by Verified Creator
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-sm text-[var(--color-subtle)] mb-1">Total Amount</p>
                    <p className="font-sora font-bold text-2xl text-purple-500">{formatPrice(proj.price)}</p>
                  </div>
                </div>
              </motion.div>

              {/* SECTION 2: Student Details */}
              <motion.div variants={fadeUp} className="bg-[var(--color-bg1)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 font-bold font-sora shrink-0">
                    2
                  </div>
                  <h2 className="font-sora font-bold text-xl text-[var(--color-text-heading)]">Student Details</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <FieldLabel required>Full Name</FieldLabel>
                    <StyledInput {...register('fullName')} placeholder="Your full name" error={errors.fullName?.message} />
                    {errors.fullName && <p className="text-rose-500 text-xs mt-1">{errors.fullName.message}</p>}
                  </div>

                  <div>
                    <FieldLabel required>Email Address</FieldLabel>
                    <StyledInput {...register('email')} type="email" placeholder="you@example.com" error={errors.email?.message} />
                    {errors.email && <p className="text-rose-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>

                  <div>
                    <FieldLabel required>Mobile Number (WhatsApp)</FieldLabel>
                    <StyledInput {...register('mobile')} placeholder="+91 9876543210" error={errors.mobile?.message} />
                    {errors.mobile && <p className="text-rose-500 text-xs mt-1">{errors.mobile.message}</p>}
                  </div>

                  <div>
                    <FieldLabel required>College / University</FieldLabel>
                    <StyledInput {...register('college')} placeholder="Your institution name" error={errors.college?.message} />
                    {errors.college && <p className="text-rose-500 text-xs mt-1">{errors.college.message}</p>}
                  </div>

                  <div>
                    <FieldLabel required>Course</FieldLabel>
                    <StyledInput {...register('course')} placeholder="e.g. B.Tech CSE, BCA" error={errors.course?.message} />
                    {errors.course && <p className="text-rose-500 text-xs mt-1">{errors.course.message}</p>}
                  </div>

                  <div>
                    <FieldLabel required>Year of Study</FieldLabel>
                    <StyledSelect {...register('year')} error={errors.year?.message} defaultValue="">
                      <option value="" disabled>Select year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Graduated">Graduated / Other</option>
                    </StyledSelect>
                    {errors.year && <p className="text-rose-500 text-xs mt-1">{errors.year.message}</p>}
                  </div>
                </div>
              </motion.div>

              {/* SECTION 3: Additional Notes */}
              <motion.div variants={fadeUp} className="bg-[var(--color-bg1)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold font-sora shrink-0">
                    3
                  </div>
                  <h2 className="font-sora font-bold text-xl text-[var(--color-text-heading)]">Delivery Notes <span className="text-sm font-normal text-[var(--color-subtle)]">(Optional)</span></h2>
                </div>

                <div>
                  <textarea
                    {...register('deliveryNotes')}
                    placeholder="Any specific delivery instructions or questions before payment..."
                    className={cn(
                      'w-full px-4 py-3 rounded-xl bg-[var(--color-bg0)] text-[var(--color-text)] placeholder:text-[var(--color-muted)] resize-none min-h-[100px]',
                      'border outline-none transition-all duration-300',
                      'focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500',
                      'border-[var(--color-border)] hover:border-[var(--color-text-heading)]/20'
                    )}
                  />
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={fadeUp} className="pt-4 flex flex-col sm:flex-row items-center gap-4 justify-between">
                <p className="text-sm text-[var(--color-subtle)] flex items-center gap-2">
                  <Info size={16} />
                  You'll be redirected to WhatsApp to complete your payment securely.
                </p>
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={isSubmittingForm}
                  className="w-full sm:w-auto px-8 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-bold shadow-lg shadow-purple-500/25"
                >
                  {isSubmittingForm ? (
                    <span className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border-2 border-white/80 border-t-transparent animate-spin" /> Processing...</span>
                  ) : (
                    <span className="flex items-center gap-2"><CreditCard size={18} /> Submit Order Request</span>
                  )}
                </Button>
              </motion.div>

            </motion.div>
          </AnimatePresence>
        </form>
      </div>
    </div>
  )
}
