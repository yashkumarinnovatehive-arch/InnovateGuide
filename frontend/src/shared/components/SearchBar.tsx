import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { cn } from '@utils/index'

const PLACEHOLDER_CYCLE = [
  'Search AI projects...',
  'Find React projects...',
  'Explore ML systems...',
  'Browse final year projects...',
]

export interface SearchBarProps {
  onSearch?: (query: string) => void
  placeholder?: string
  className?: string
  autoFocus?: boolean
}

export function SearchBar({ onSearch, placeholder, className, autoFocus = false }: SearchBarProps) {
  const navigate = useNavigate()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [value, setValue] = React.useState('')
  const [pIdx, setPIdx] = React.useState(0)
  const [pVisible, setPVisible] = React.useState(true)
  const [focused, setFocused] = React.useState(false)

  React.useEffect(() => {
    if (placeholder) return
    const t = setInterval(() => {
      setPVisible(false)
      setTimeout(() => { setPIdx((p) => (p + 1) % PLACEHOLDER_CYCLE.length); setPVisible(true) }, 350)
    }, 2800)
    return () => clearInterval(t)
  }, [placeholder])

  const activePlaceholder = placeholder ?? PLACEHOLDER_CYCLE[pIdx]

  const handleSubmit = React.useCallback(() => {
    const trimmed = value.trim()
    if (onSearch) { onSearch(trimmed) } else { navigate(`/browse${trimmed ? `?search=${encodeURIComponent(trimmed)}` : ''}`) }
  }, [value, onSearch, navigate])

  const handleClear = () => { setValue(''); inputRef.current?.focus() }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); handleSubmit() }
    if (e.key === 'Escape') handleClear()
  }

  return (
    <div className={cn('relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full', className)}>
      {/* Input wrapper */}
      <div
        className="relative flex items-center flex-1 rounded-2xl transition-all duration-300"
        style={{
          background: 'rgba(14,19,48,0.70)',
          border: `1px solid ${focused ? 'rgba(114,20,255,0.50)' : 'rgba(255,255,255,0.08)'}`,
          boxShadow: focused ? '0 0 24px rgba(114,20,255,0.18)' : '0 2px 12px rgba(0,0,0,0.20)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <Search size={18} className="absolute left-4 pointer-events-none shrink-0" style={{ color: focused ? '#a365ff' : 'rgba(255,255,255,0.30)' }} aria-hidden />

        {value === '' && (
          <span
            aria-hidden
            className="absolute left-11 right-14 top-1/2 -translate-y-1/2 text-sm pointer-events-none truncate transition-opacity duration-300 font-inter"
            style={{ color: 'rgba(255,255,255,0.30)', opacity: pVisible ? 1 : 0 }}
          >
            {activePlaceholder}
          </span>
        )}

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder=""
          autoFocus={autoFocus}
          autoComplete="off"
          spellCheck={false}
          aria-label="Search projects"
          className="w-full h-14 pl-11 pr-10 bg-transparent rounded-2xl text-sm text-white font-inter focus:outline-none"
        />

        <AnimatePresence>
          {value.length > 0 && (
            <motion.button
              key="clear"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full transition-colors duration-150"
              style={{ color: 'rgba(255,255,255,0.40)' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#fff')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.40)')}
            >
              <X size={14} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Purple Search button — navigates to /browse */}
      <button
        onClick={handleSubmit}
        aria-label="Search projects"
        className="w-full sm:w-auto shrink-0 h-14 px-7 rounded-2xl text-sm font-bold text-white font-inter transition-all duration-200"
        style={{ background: 'linear-gradient(135deg,#7214ff,#a365ff)', boxShadow: '0 6px 20px rgba(114,20,255,0.30)' }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(114,20,255,0.45)')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(114,20,255,0.30)')}
      >
        Search
      </button>
    </div>
  )
}

export default SearchBar
