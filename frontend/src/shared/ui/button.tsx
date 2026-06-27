import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot, Slottable } from '@radix-ui/react-slot'
import { Loader2 } from 'lucide-react'
import { cn } from '@utils/index'

// ── Evolvion purple design system ──────────────────────────────────────────
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold font-inter transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 select-none',
  {
    variants: {
      variant: {
        // Purple gradient — primary CTA (Evolvion style)
        primary:
          'text-white shadow-lg focus-visible:ring-violet-500',
        // Transparent glass with purple border
        secondary:
          'border text-white backdrop-blur-sm focus-visible:ring-violet-500',
        // White pill CTA (Evolvion "Get a quote" / "Book a Call")
        outline:
          'bg-white text-slate-900 hover:bg-slate-100 shadow-md focus-visible:ring-white',
        ghost:
          'bg-transparent text-slate-300 hover:bg-white/5 hover:text-white focus-visible:ring-slate-400',
        'accent-gradient':
          'text-white shadow-lg focus-visible:ring-violet-500',
        destructive:
          'bg-red-500/90 text-white hover:bg-red-500 focus-visible:ring-red-500',
        success:
          'text-white shadow-md focus-visible:ring-violet-500',
      },
      size: {
        sm: 'h-8 px-4 text-xs rounded-lg',
        md: 'h-10 px-5 text-sm',
        lg: 'h-11 px-7 text-sm',
        xl: 'h-13 px-10 text-base',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

// Purple gradient style applied inline so it works without extending Tailwind
const PURPLE_BTN_STYLE: React.CSSProperties = {
  background: 'linear-gradient(135deg,#7214ff 0%,#a365ff 100%)',
  boxShadow: '0 8px 24px rgba(114,20,255,0.30)',
}
const PURPLE_BTN_HOVER: React.CSSProperties = {
  background: 'linear-gradient(135deg,#6010e0 0%,#8f55f0 100%)',
  boxShadow: '0 10px 28px rgba(114,20,255,0.40)',
}
const GLASS_BTN_STYLE: React.CSSProperties = {
  background: 'rgba(114,20,255,0.12)',
  borderColor: 'rgba(114,20,255,0.30)',
}
const GLASS_BTN_HOVER: React.CSSProperties = {
  background: 'rgba(114,20,255,0.22)',
  borderColor: 'rgba(114,20,255,0.50)',
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      disabled,
      children,
      style,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'

    const isPurple = variant === 'primary' || variant === 'accent-gradient'
    const isGlass = variant === 'secondary' || variant === 'success'

    const baseStyle: React.CSSProperties = isPurple
      ? PURPLE_BTN_STYLE
      : isGlass
      ? GLASS_BTN_STYLE
      : {}

    const [hovered, setHovered] = React.useState(false)
    const hoverStyle: React.CSSProperties = isPurple
      ? PURPLE_BTN_HOVER
      : isGlass
      ? GLASS_BTN_HOVER
      : {}

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        style={{ ...baseStyle, ...(hovered ? hoverStyle : {}), ...style }}
        onMouseEnter={(e) => { setHovered(true); onMouseEnter?.(e as any) }}
        onMouseLeave={(e) => { setHovered(false); onMouseLeave?.(e as any) }}
        {...props}
      >
        {loading && (
          <Loader2 className="animate-spin shrink-0" size={size === 'sm' ? 13 : 15} />
        )}
        {asChild ? <Slottable>{children}</Slottable> : children}
      </Comp>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
