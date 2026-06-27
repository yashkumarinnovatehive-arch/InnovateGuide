import { Link } from "react-router-dom";
import { Layers, Twitter, Linkedin, Instagram, Github, Mail } from "lucide-react";

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
      <h4 className="text-xs font-semibold uppercase tracking-[0.15em] font-sora" style={{ color: "rgba(255,255,255,0.5)" }}>
        {title}
      </h4>
      <ul className="flex flex-col gap-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              to={l.href}
              className="text-sm font-inter transition-colors duration-150"
              style={{ color: "rgba(255,255,255,0.5)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#fff")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)")}
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
  return (
    <footer
      className="relative overflow-hidden border-t border-white/5"
      style={{ background: "#080B16" }}
    >
      {/* Evolvion-style: large centered purple radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(114,20,255,0.18) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        {/* Top newsletter / CTA card + nav columns */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Left — brand + CTA card */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-2.5 w-fit select-none">
              <span
                className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
                style={{ background: "linear-gradient(135deg,#7214ff,#a365ff)" }}
              >
                <Layers size={17} className="text-white" />
              </span>
              <span className="text-lg font-bold tracking-tight text-white font-sora">
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

            <p className="text-sm font-inter leading-relaxed max-w-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
              The premium marketplace for student-built software. Buy, sell, and build faster.
            </p>

            {/* Newsletter card — Evolvion style */}
            <div
              className="rounded-2xl p-5 border flex flex-col gap-4"
              style={{ background: "#0e1330", borderColor: "#282d45" }}
            >
              <div className="flex items-center gap-2.5">
                <Mail size={16} style={{ color: "#a365ff" }} />
                <span className="text-sm font-semibold text-white font-sora">Stay updated</span>
              </div>
              <p className="text-xs font-inter" style={{ color: "rgba(255,255,255,0.5)" }}>
                Get the latest projects and deals delivered to your inbox.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-white/5 border border-white/8 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-violet-500/50 transition-colors font-inter"
                />
                <button
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white shrink-0 transition-all duration-200"
                  style={{ background: "#a365ff" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#7214ff")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#a365ff")}
                >
                  Subscribe
                </button>
              </div>
            </div>

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
                  style={{ borderColor: "#282d45", background: "transparent", color: "rgba(255,255,255,0.5)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "#7214ff";
                    (e.currentTarget as HTMLElement).style.color = "#a365ff";
                    (e.currentTarget as HTMLElement).style.background = "rgba(114,20,255,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "#282d45";
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)";
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
        <div className="mt-14 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <p className="text-xs font-inter" style={{ color: "rgba(255,255,255,0.3)" }}>
            © 2025 InnovateGuide. All rights reserved.
          </p>
          <p className="text-xs font-inter" style={{ color: "rgba(255,255,255,0.25)" }}>
            Powered by{" "}
            <span style={{ color: "rgba(255,255,255,0.4)" }}>InnovateHive</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
