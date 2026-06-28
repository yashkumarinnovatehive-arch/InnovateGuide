import * as React from 'react'
import { cn } from '@utils/index'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, id, ...props }, ref) => {
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-heading"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <span className="absolute left-4 flex items-center justify-center text-subtle pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full h-12 rounded-xl border border-[var(--color-input-border)] bg-[var(--color-input-bg)] px-4 text-sm text-[var(--color-text-heading)] placeholder:text-[var(--color-muted)]',
              'transition-all duration-200',
              'focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--color-bg1)]',
              error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20',
              icon && 'pl-11',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-[#EF4444] mt-0.5">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
