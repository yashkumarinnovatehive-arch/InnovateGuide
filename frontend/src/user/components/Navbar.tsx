import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Layers, Sun, Moon } from "lucide-react";
import { useTheme } from "@shared/contexts/ThemeContext";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Browse", href: "/browse" },
  { label: "Categories", href: "/#categories" },
  { label: "FAQ", href: "/#faq" },
  { label: "Custom Project", href: "/custom-project" },
];

function useScrolled(threshold = 20): boolean {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > threshold);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, [threshold]);
  return scrolled;
}

export default function Navbar() {
  const scrolled = useScrolled(20);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    if (href.includes("#")) return false;
    return location.pathname.startsWith(href.split("?")[0]);
  };

  const close = () => setMobileOpen(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex justify-center"
      style={{ paddingTop: 12 }}
    >
      {/* ── Floating pill nav ── */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-5xl mx-4"
      >
        <div
          className="flex items-center justify-between h-14 px-5 rounded-2xl transition-all duration-300"
          style={{
            background: scrolled
              ? 'var(--color-navbar-bg-scrolled)'
              : 'var(--color-navbar-bg)',
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
            boxShadow: scrolled
              ? isDark
                ? "0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)"
                : "0 4px 20px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)"
              : isDark
                ? "0 4px 20px rgba(0,0,0,0.3)"
                : "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            onClick={close}
            className="flex items-center gap-2.5 select-none group shrink-0"
          >
            <span
              className="flex items-center justify-center w-8 h-8 rounded-xl shrink-0"
              style={{ background: "linear-gradient(135deg,#7214ff,#a365ff)" }}
            >
              <Layers size={16} className="text-white" />
            </span>
            <span className="text-base font-bold tracking-tight font-sora" style={{ color: 'var(--color-navbar-text)' }}>
              Innovate
              <span
                style={{
                  background: "linear-gradient(90deg,#a78bfa,#818cf8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Guide
              </span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="relative px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 font-inter"
                    style={{
                      color: active ? 'var(--color-navbar-text)' : 'var(--color-navbar-text-muted)',
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.color = 'var(--color-navbar-text)')
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.color = active
                        ? 'var(--color-navbar-text)'
                        : 'var(--color-navbar-text-muted)')
                    }
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="nav-pip"
                        className="absolute bottom-0 left-3 right-3 h-px rounded-full"
                        style={{
                          background:
                            "linear-gradient(90deg,#7214ff,#a365ff)",
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Theme toggle + CTA */}
          <div className="hidden md:flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200"
              style={{
                background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)'}`,
                color: isDark ? '#fbbf24' : '#6366f1',
              }}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Sell Project CTA */}
            <button
              onClick={() => navigate("/upload")}
              className="text-sm font-semibold px-5 py-2 rounded-xl transition-all duration-200 shrink-0"
              style={{
                background: isDark ? '#ffffff' : 'linear-gradient(135deg,#7214ff,#a365ff)',
                color: isDark ? '#0a0d1a' : '#ffffff',
                boxShadow: isDark
                  ? 'inset 0 -4px 8px rgba(0,0,0,0.20)'
                  : '0 4px 14px rgba(114,20,255,0.25)',
              }}
            >
              Sell Project
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200"
              style={{
                background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)'}`,
                color: isDark ? '#fbbf24' : '#6366f1',
              }}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              className="flex items-center justify-center w-9 h-9 rounded-xl transition-colors"
              style={{
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)'}`,
                color: 'var(--color-navbar-text-muted)',
              }}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="absolute top-full left-0 right-0 mx-4 mt-2 rounded-2xl overflow-hidden z-40"
            style={{
              background: isDark ? 'rgba(10,13,26,0.97)' : 'rgba(255,255,255,0.97)',
              backdropFilter: 'blur(24px)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
              boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.08)',
            }}
          >
            <div className="flex flex-col gap-1 p-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={close}
                  className="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all"
                  style={{
                    color: 'var(--color-muted)',
                  }}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 mt-1" style={{ borderTop: `1px solid var(--color-border)` }}>
                <button
                  onClick={() => { close(); navigate("/upload"); }}
                  className="w-full flex items-center justify-center px-5 py-3 rounded-xl text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg,#7214ff,#a365ff)' }}
                >
                  Sell Project
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
