import { Link } from "react-router-dom";
import { Layers, Twitter, Linkedin, Instagram, Github } from "lucide-react";
import { useTheme } from "@shared/contexts/ThemeContext";

const exploreLinks = [
  { label: "Trending Projects", href: "/#trending" },
  { label: "Newly Added", href: "/#newly-added" },
  { label: "Top Selling", href: "/#top-selling" },
  { label: "Browse All", href: "/browse" },
  { label: "Categories", href: "/#categories" },
];

const resourceLinks = [
  { label: "Custom Project", href: "/custom-project" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "FAQ", href: "/#faq" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
];

const socialLinks = [
  { label: "Twitter / X", href: "https://twitter.com", icon: <Twitter size={16} strokeWidth={1.8} /> },
  { label: "LinkedIn", href: "https://linkedin.com", icon: <Linkedin size={16} strokeWidth={1.8} /> },
  { label: "Instagram", href: "https://instagram.com", icon: <Instagram size={16} strokeWidth={1.8} /> },
  { label: "GitHub", href: "https://github.com", icon: <Github size={16} strokeWidth={1.8} /> },
];

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-xs font-semibold uppercase tracking-[0.15em] font-sora" style={{ color: 'var(--color-muted)' }}>
        {title}
      </h4>
      <ul className="flex flex-col gap-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              to={l.href}
              className="text-sm font-inter transition-colors duration-150"
              style={{ color: 'var(--color-muted)' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--color-text-heading)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--color-muted)')}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const { isDark } = useTheme();

  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background: 'var(--color-bg0)',
        borderTop: '1px solid var(--color-border)',
      }}
    >
      {/* Purple glow */}
      {isDark && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(114,20,255,0.18) 0%, transparent 70%)",
          }}
        />
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Left — brand + social */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-2.5 w-fit select-none">
              <span
                className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
                style={{ background: "linear-gradient(135deg,#7214ff,#a365ff)" }}
              >
                <Layers size={17} className="text-white" />
              </span>
              <span className="text-lg font-bold tracking-tight font-sora" style={{ color: 'var(--color-text-heading)' }}>
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

            <p className="text-sm font-inter leading-relaxed max-w-xs" style={{ color: 'var(--color-muted)' }}>
              The premium marketplace for student-built software. Buy, sell, and build faster.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex items-center justify-center w-9 h-9 rounded-xl border transition-all duration-200"
                  style={{
                    borderColor: 'var(--color-border)',
                    background: "transparent",
                    color: 'var(--color-muted)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "#7214ff";
                    (e.currentTarget as HTMLElement).style.color = "#a365ff";
                    (e.currentTarget as HTMLElement).style.background = "rgba(114,20,255,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--color-muted)';
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Right — link columns */}
          <FooterCol title="Explore" links={exploreLinks} />
          <FooterCol title="Resources" links={resourceLinks} />
          <FooterCol title="Company" links={companyLinks} />
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: 'var(--color-border)' }}>
          <p className="text-xs font-inter" style={{ color: 'var(--color-subtle)' }}>
            © 2025 InnovateGuide. All rights reserved.
          </p>
          <p className="text-xs font-inter" style={{ color: 'var(--color-subtle)' }}>
            Powered by{" "}
            <span style={{ color: 'var(--color-muted)' }}>InnovateHive</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
