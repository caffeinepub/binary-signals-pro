import {
  Award,
  BarChart2,
  BookOpen,
  CheckCircle,
  Clock,
  Globe,
  GraduationCap,
  Lightbulb,
  type LucideIcon,
  Menu,
  Send,
  Shield,
  Star,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ─── Telegram URL ────────────────────────────────────────────────────────────
const TG_URL = "https://t.me/+ZrjV0qW-bKg0NjM1";

// ─── Scroll reveal hook ──────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          obs.unobserve(el);
        }
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ─── Countdown Timer ─────────────────────────────────────────────────────────
const TIMER_KEY = "fpc_offer_deadline";
const SEATS_KEY = "fpc_seats_remaining";
const SEATS_TS_KEY = "fpc_seats_last_tick";

function getDeadline(): number {
  const stored = localStorage.getItem(TIMER_KEY);
  if (stored) {
    const parsed = Number(stored);
    if (!Number.isNaN(parsed) && parsed > Date.now()) return parsed;
  }
  const deadline = Date.now() + 7 * 24 * 60 * 60 * 1000;
  localStorage.setItem(TIMER_KEY, String(deadline));
  return deadline;
}

function getSeats(): number {
  const stored = localStorage.getItem(SEATS_KEY);
  const lastTick = Number(localStorage.getItem(SEATS_TS_KEY) || "0");
  let seats = stored ? Number(stored) : 47;
  if (Number.isNaN(seats) || seats < 11) seats = 47;

  // Tick down based on elapsed time since last tick (1 per 30s)
  const now = Date.now();
  const elapsed = now - lastTick;
  if (elapsed > 0) {
    const ticks = Math.floor(elapsed / 30_000);
    if (ticks > 0) {
      seats = Math.max(11, seats - ticks);
      localStorage.setItem(SEATS_KEY, String(seats));
      localStorage.setItem(SEATS_TS_KEY, String(lastTick + ticks * 30_000));
    }
  } else {
    localStorage.setItem(SEATS_TS_KEY, String(now));
  }

  return seats;
}

function useCountdown() {
  const [deadline] = useState<number>(getDeadline);
  const [remaining, setRemaining] = useState<number>(
    Math.max(0, deadline - Date.now()),
  );

  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, deadline - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds, expired: remaining === 0 };
}

function useSeats() {
  const [seats, setSeats] = useState<number>(getSeats);

  useEffect(() => {
    const id = setInterval(() => {
      const updated = getSeats();
      setSeats(updated);
    }, 5_000);
    return () => clearInterval(id);
  }, []);

  return seats;
}

const JOIN_NOTIFICATIONS = [
  "👤 Ahmed from Dubai just joined",
  "👤 Priya from London just joined",
  "👤 Carlos from New York just joined",
  "👤 Yuki from Tokyo just joined",
  "👤 Fatima from Lagos just joined",
  "👤 Daniel from Toronto just joined",
  "👤 Sofia from Berlin just joined",
  "👤 Ravi from Mumbai just joined",
];

function useJoinTicker() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % JOIN_NOTIFICATIONS.length);
        setVisible(true);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return { message: JOIN_NOTIFICATIONS[index], visible };
}

function TimerBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-bold text-2xl sm:text-3xl tabular-nums"
        style={{
          background: "oklch(0.16 0.035 248)",
          border: "1px solid oklch(0.32 0.08 255 / 0.6)",
          boxShadow:
            "0 0 18px oklch(0.62 0.22 255 / 0.15), inset 0 1px 0 oklch(0.4 0.1 255 / 0.1)",
          color: "oklch(0.95 0.015 240)",
        }}
      >
        {String(value).padStart(2, "0")}
      </div>
      <span
        className="mt-2 text-xs font-semibold uppercase tracking-widest"
        style={{ color: "oklch(0.52 0.06 250)" }}
      >
        {label}
      </span>
    </div>
  );
}

function CountdownTimer() {
  const { days, hours, minutes, seconds, expired } = useCountdown();
  const seats = useSeats();
  const { message, visible } = useJoinTicker();

  return (
    <div
      className="mb-8 rounded-2xl p-6 sm:p-8"
      style={{
        background: "oklch(0.11 0.022 248)",
        border: "1px solid oklch(0.28 0.06 255 / 0.4)",
        boxShadow: "0 0 40px oklch(0.62 0.22 255 / 0.08)",
      }}
      data-ocid="cta.timer"
    >
      {/* Headline */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <Clock size={15} style={{ color: "oklch(0.72 0.2 155)" }} />
        <p
          className="text-sm font-bold uppercase tracking-widest"
          style={{ color: "oklch(0.72 0.2 155)" }}
        >
          ⚡ This Week's Free Access Closes In...
        </p>
      </div>

      {expired ? (
        <p
          className="text-center font-semibold"
          style={{ color: "oklch(0.65 0.04 240)" }}
        >
          This offer has ended.
        </p>
      ) : (
        <>
          <div className="flex items-start justify-center gap-3 sm:gap-5 mb-5">
            <TimerBox value={days} label="Days" />
            <span
              className="text-2xl sm:text-3xl font-bold mt-4 sm:mt-5"
              style={{ color: "oklch(0.42 0.08 255)" }}
            >
              :
            </span>
            <TimerBox value={hours} label="Hours" />
            <span
              className="text-2xl sm:text-3xl font-bold mt-4 sm:mt-5"
              style={{ color: "oklch(0.42 0.08 255)" }}
            >
              :
            </span>
            <TimerBox value={minutes} label="Min" />
            <span
              className="text-2xl sm:text-3xl font-bold mt-4 sm:mt-5"
              style={{ color: "oklch(0.42 0.08 255)" }}
            >
              :
            </span>
            <TimerBox value={seconds} label="Sec" />
          </div>

          {/* Sub-line below timer */}
          <p
            className="text-center text-sm leading-relaxed mb-5 px-2"
            style={{ color: "oklch(0.62 0.04 240)" }}
          >
            After this window closes, new members must wait for the next
            opening.{" "}
            <span style={{ color: "oklch(0.78 0.06 240)" }}>
              Don't miss what insiders already know.
            </span>
          </p>

          {/* Divider */}
          <div
            className="mb-5"
            style={{ borderTop: "1px solid oklch(0.22 0.04 250)" }}
          />

          {/* Seats left badge */}
          <div className="flex justify-center mb-4">
            <div
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-sm font-bold"
              style={{
                background: "oklch(0.62 0.22 30 / 0.14)",
                border: "1px solid oklch(0.62 0.22 30 / 0.4)",
                color: "oklch(0.78 0.18 35)",
              }}
              data-ocid="cta.panel"
            >
              {/* Pulsing dot */}
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ background: "oklch(0.72 0.22 30)" }}
                />
                <span
                  className="relative inline-flex rounded-full h-2.5 w-2.5"
                  style={{ background: "oklch(0.72 0.22 30)" }}
                />
              </span>
              🔥 Only {seats} seats left
            </div>
          </div>

          {/* Join ticker */}
          <div
            className="rounded-xl px-4 py-3 flex items-center justify-center gap-2"
            style={{
              background: "oklch(0.14 0.028 248)",
              border: "1px solid oklch(0.24 0.045 250)",
              minHeight: "44px",
            }}
          >
            <span
              className="text-sm transition-all duration-500"
              style={{
                color: "oklch(0.75 0.1 255)",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(6px)",
              }}
            >
              {message}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Subscribe Bar ────────────────────────────────────────────────────────────
function SubscribeBar() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(t);
  }, []);

  if (dismissed) return null;

  return (
    <div
      className="fixed left-0 right-0 z-40 transition-all duration-700"
      style={{
        top: "64px",
        background: "oklch(0.1 0.022 250 / 0.88)",
        backdropFilter: "blur(18px)",
        borderBottom: "1px solid oklch(0.62 0.22 255 / 0.25)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-12px)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-center gap-4 relative">
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center">
          <p
            className="text-sm font-medium leading-snug"
            style={{ color: "oklch(0.82 0.06 240)" }}
          >
            📊 Join{" "}
            <span
              className="font-bold"
              style={{ color: "oklch(0.9 0.015 240)" }}
            >
              10,000+ members
            </span>{" "}
            getting free daily financial insights
          </p>
          <a
            href={TG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-telegram !text-sm !px-5 !py-2.5 whitespace-nowrap flex-shrink-0"
            data-ocid="subscribe_bar.primary_button"
          >
            <Send size={14} /> Subscribe Free
          </a>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
          style={{
            color: "oklch(0.55 0.04 240)",
            background: "oklch(0.18 0.03 250)",
          }}
          aria-label="Dismiss subscribe bar"
          data-ocid="subscribe_bar.close_button"
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "oklch(0.82 0.04 240)";
            e.currentTarget.style.background = "oklch(0.22 0.04 250)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "oklch(0.55 0.04 240)";
            e.currentTarget.style.background = "oklch(0.18 0.03 250)";
          }}
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}

// ─── Community Dashboard Graphic ─────────────────────────────────────────────
function CommunityDashboard() {
  const stats = [
    { icon: Users, label: "Members", value: "10,241", color: "text-blue-glow" },
    {
      icon: BookOpen,
      label: "Lessons Shared",
      value: "1,450+",
      color: "text-green-glow",
    },
    {
      icon: Lightbulb,
      label: "Daily Tips",
      value: "5–8 / day",
      color: "text-blue-glow",
    },
  ];
  const topics = [
    "Market Analysis",
    "Investment Basics",
    "Wealth Tips",
    "Economic News",
    "Portfolio Strategy",
  ];
  return (
    <div
      className="floating w-full max-w-sm mx-auto rounded-2xl p-5 select-none"
      style={{
        background: "oklch(0.13 0.025 245)",
        border: "1px solid oklch(0.28 0.06 255)",
        boxShadow:
          "0 0 48px oklch(0.62 0.22 255 / 0.18), 0 8px 32px rgba(0,0,0,0.5)",
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "oklch(0.55 0.22 255 / 0.2)" }}
        >
          <GraduationCap size={16} className="text-blue-glow" />
        </div>
        <span
          className="text-sm font-semibold"
          style={{ color: "oklch(0.85 0.08 240)" }}
        >
          Finance Pro Community
        </span>
        <span
          className="ml-auto text-xs px-2 py-0.5 rounded-full"
          style={{
            background: "oklch(0.72 0.2 155 / 0.15)",
            color: "oklch(0.78 0.18 155)",
            border: "1px solid oklch(0.72 0.2 155 / 0.3)",
          }}
        >
          🟢 Active
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl p-2 text-center"
            style={{
              background: "oklch(0.16 0.03 245)",
              border: "1px solid oklch(0.24 0.045 250)",
            }}
          >
            <s.icon size={14} className={`${s.color} mx-auto mb-1`} />
            <div
              className="text-xs font-bold"
              style={{ color: "oklch(0.9 0.015 240)" }}
            >
              {s.value}
            </div>
            <div
              className="text-[10px]"
              style={{ color: "oklch(0.55 0.04 240)" }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div className="mb-3">
        <p className="text-xs mb-2" style={{ color: "oklch(0.55 0.04 240)" }}>
          Topics Covered
        </p>
        <div className="flex flex-wrap gap-1.5">
          {topics.map((t) => (
            <span
              key={t}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: "oklch(0.62 0.22 255 / 0.12)",
                color: "oklch(0.78 0.15 255)",
                border: "1px solid oklch(0.62 0.22 255 / 0.25)",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div
        className="rounded-xl p-3"
        style={{
          background: "oklch(0.16 0.03 245)",
          border: "1px solid oklch(0.24 0.045 250)",
        }}
      >
        <div className="flex items-center gap-1.5 mb-1">
          <BookOpen size={12} className="text-green-glow" />
          <span
            className="text-xs font-semibold"
            style={{ color: "oklch(0.78 0.18 155)" }}
          >
            Today's Insight
          </span>
          <span
            className="ml-auto text-[10px]"
            style={{ color: "oklch(0.5 0.04 240)" }}
          >
            2 min ago
          </span>
        </div>
        <p className="text-xs" style={{ color: "oklch(0.72 0.04 240)" }}>
          Understanding diversification: why spreading investments across asset
          classes reduces risk over the long term.
        </p>
      </div>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);
  const links = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Insights", href: "#insights" },
    { label: "Community", href: "#community" },
    { label: "Testimonials", href: "#testimonials" },
  ];
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "oklch(0.09 0.018 250 / 0.95)"
          : "oklch(0.09 0.018 250 / 0.6)",
        backdropFilter: "blur(16px)",
        borderBottom: scrolled
          ? "1px solid oklch(0.22 0.04 250)"
          : "1px solid transparent",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a
          href="#hero"
          className="flex items-center gap-2.5 font-bold text-lg"
          data-ocid="nav.link"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.55 0.24 255), oklch(0.68 0.22 165))",
            }}
          >
            <GraduationCap size={16} className="text-white" />
          </div>
          <span className="gradient-text">Finance Pro Community</span>
        </a>

        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm transition-colors duration-200"
              style={{ color: "oklch(0.7 0.04 240)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "oklch(0.9 0.015 240)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "oklch(0.7 0.04 240)";
              }}
              data-ocid="nav.link"
            >
              {l.label}
            </a>
          ))}
          <a
            href={TG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-telegram text-sm !px-5 !py-2"
            data-ocid="nav.primary_button"
          >
            <Send size={14} /> Join Free
          </a>
        </div>

        <button
          type="button"
          className="md:hidden p-2 rounded-lg"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          style={{ color: "oklch(0.8 0.04 240)" }}
          data-ocid="nav.toggle"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div
          className="md:hidden px-4 pb-4 flex flex-col gap-3"
          style={{ background: "oklch(0.09 0.018 250 / 0.98)" }}
        >
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm py-2"
              style={{ color: "oklch(0.75 0.04 240)" }}
              onClick={() => setOpen(false)}
              data-ocid="nav.link"
            >
              {l.label}
            </a>
          ))}
          <a
            href={TG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-telegram text-sm justify-center"
            onClick={() => setOpen(false)}
            data-ocid="nav.primary_button"
          >
            <Send size={14} /> Join Free
          </a>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center pt-16 overflow-hidden"
      id="hero"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "oklch(0.62 0.22 255)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15"
          style={{ background: "oklch(0.72 0.2 155)" }}
        />
      </div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-20 flex flex-col items-center text-center">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
          style={{
            background: "oklch(0.62 0.22 255 / 0.12)",
            border: "1px solid oklch(0.62 0.22 255 / 0.3)",
            color: "oklch(0.78 0.15 255)",
          }}
        >
          <GraduationCap size={15} />🎓 Free Financial Education
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
          Learn Finance, Grow Your Knowledge &amp; Join Our{" "}
          <span className="gradient-text">Expert Community</span>
        </h1>

        {/* Subtext */}
        <p
          className="text-lg leading-relaxed mb-8 max-w-xl"
          style={{ color: "oklch(0.68 0.04 240)" }}
        >
          Join our free Telegram community where thousands of people learn
          financial markets, investment strategies, and wealth-building
          principles together.
        </p>

        {/* CTA */}
        <a
          href={TG_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-telegram pulse-glow text-base mb-10 inline-flex"
          data-ocid="hero.primary_button"
        >
          <Send size={18} /> Join Our Free Community
        </a>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mt-2 mb-14">
          {[
            { value: "10K+", label: "Members" },
            { value: "Daily", label: "Insights" },
            { value: "Free", label: "To Join" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold text-blue-glow">{s.value}</div>
              <div
                className="text-sm"
                style={{ color: "oklch(0.58 0.04 240)" }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Dashboard graphic centered below */}
        <div className="w-full max-w-sm">
          <CommunityDashboard />
        </div>
      </div>
    </section>
  );
}

// ─── Feature card (needs its own hook) ───────────────────────────────────────
interface FeatureItem {
  icon: LucideIcon;
  title: string;
  desc: string;
  color: string;
  delay: number;
}
function FeatureCard({ item }: { item: FeatureItem }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className="card-feature reveal"
      style={{ transitionDelay: `${item.delay}ms` }}
      data-ocid="features.card"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{
          background: item.color.replace(")", " / 0.15)"),
          border: `1px solid ${item.color.replace(")", " / 0.3)")}`,
        }}
      >
        <item.icon size={22} style={{ color: item.color }} />
      </div>
      <h3
        className="font-semibold text-lg mb-2"
        style={{ color: "oklch(0.9 0.015 240)" }}
      >
        {item.title}
      </h3>
      <p
        className="text-sm leading-relaxed"
        style={{ color: "oklch(0.62 0.04 240)" }}
      >
        {item.desc}
      </p>
    </div>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────
function Features() {
  const titleRef = useReveal();
  const items: FeatureItem[] = [
    {
      icon: TrendingUp,
      title: "Daily Market Insights",
      desc: "Get fresh market analysis and financial news every day, explained in plain language anyone can understand.",
      color: "oklch(0.62 0.22 255)",
      delay: 0,
    },
    {
      icon: BarChart2,
      title: "Expert Analysis",
      desc: "Our experienced team breaks down complex financial concepts into actionable, easy-to-follow educational content.",
      color: "oklch(0.72 0.2 155)",
      delay: 100,
    },
    {
      icon: BookOpen,
      title: "Financial Literacy",
      desc: "Learn essential money management, budgeting, and investment fundamentals to build long-term wealth.",
      color: "oklch(0.72 0.18 220)",
      delay: 200,
    },
    {
      icon: Users,
      title: "Beginner Friendly",
      desc: "Whether you're brand new to finance or looking to deepen your knowledge, our community welcomes everyone.",
      color: "oklch(0.75 0.18 100)",
      delay: 300,
    },
  ];
  return (
    <section id="features" className="py-20 section-bg-alt">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div ref={titleRef} className="reveal text-center mb-14">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: "oklch(0.62 0.22 255)" }}
          >
            What You'll Learn
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">
            Everything You Need to{" "}
            <span className="gradient-text">Master Finance</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item) => (
            <FeatureCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Step card ────────────────────────────────────────────────────────────────
interface StepItem {
  step: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  delay: number;
}
function StepCard({ item }: { item: StepItem }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className="reveal text-center"
      style={{ transitionDelay: `${item.delay}ms` }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
        style={{
          background: "oklch(0.62 0.22 255 / 0.1)",
          border: "1px solid oklch(0.62 0.22 255 / 0.3)",
        }}
      >
        <item.icon size={26} className="text-blue-glow" />
      </div>
      <div
        className="text-4xl font-bold mb-2"
        style={{ color: "oklch(0.28 0.06 255)" }}
      >
        {item.step}
      </div>
      <h3
        className="text-xl font-semibold mb-3"
        style={{ color: "oklch(0.9 0.015 240)" }}
      >
        {item.title}
      </h3>
      <p
        className="text-sm leading-relaxed"
        style={{ color: "oklch(0.62 0.04 240)" }}
      >
        {item.desc}
      </p>
    </div>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const titleRef = useReveal();
  const steps: StepItem[] = [
    {
      step: "01",
      icon: Send,
      title: "Join Telegram",
      desc: "Click the join button and instantly access our free financial education Telegram community.",
      delay: 0,
    },
    {
      step: "02",
      icon: Lightbulb,
      title: "Get Daily Insights",
      desc: "Receive daily market insights, educational content, and financial tips sent directly to your phone.",
      delay: 130,
    },
    {
      step: "03",
      icon: TrendingUp,
      title: "Apply & Grow",
      desc: "Use what you learn to make more informed financial decisions and build your financial knowledge over time.",
      delay: 260,
    },
  ];
  return (
    <section id="how-it-works" className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div ref={titleRef} className="reveal text-center mb-14">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: "oklch(0.72 0.2 155)" }}
          >
            Simple Steps
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">
            How to Get Started in{" "}
            <span className="gradient-text">3 Easy Steps</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s) => (
            <StepCard key={s.step} item={s} />
          ))}
        </div>
        <div className="text-center mt-12">
          <a
            href={TG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-telegram"
            data-ocid="how_it_works.primary_button"
          >
            <Send size={18} /> Start Learning for Free
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
interface StatItem {
  icon: LucideIcon;
  value: string;
  label: string;
  delay: number;
}
function StatCard({ item }: { item: StatItem }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className="stat-card reveal"
      style={{ transitionDelay: `${item.delay}ms` }}
    >
      <item.icon size={24} className="text-blue-glow mx-auto mb-2" />
      <div className="text-3xl font-bold gradient-text mb-1">{item.value}</div>
      <div className="text-sm" style={{ color: "oklch(0.58 0.04 240)" }}>
        {item.label}
      </div>
    </div>
  );
}

// ─── Topic card ───────────────────────────────────────────────────────────────
interface TopicItem {
  icon: LucideIcon;
  title: string;
  desc: string;
  color: string;
  delay: number;
}
function TopicCard({ item }: { item: TopicItem }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className="card-feature reveal p-7"
      style={{ transitionDelay: `${item.delay}ms` }}
      data-ocid="insights.card"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{
          background: item.color.replace(")", " / 0.15)"),
          border: `1px solid ${item.color.replace(")", " / 0.3)")}`,
        }}
      >
        <item.icon size={22} style={{ color: item.color }} />
      </div>
      <h3
        className="font-semibold text-lg mb-2"
        style={{ color: "oklch(0.9 0.015 240)" }}
      >
        {item.title}
      </h3>
      <p
        className="text-sm leading-relaxed"
        style={{ color: "oklch(0.62 0.04 240)" }}
      >
        {item.desc}
      </p>
    </div>
  );
}

// ─── Insights / Stats ─────────────────────────────────────────────────────────
function Insights() {
  const titleRef = useReveal();
  const stats: StatItem[] = [
    { icon: Users, value: "10,000+", label: "Community Members", delay: 0 },
    { icon: Lightbulb, value: "Daily", label: "Insights Posted", delay: 80 },
    { icon: Shield, value: "Free", label: "Forever", delay: 160 },
    { icon: Clock, value: "2+ Years", label: "Active Community", delay: 240 },
  ];
  const topics: TopicItem[] = [
    {
      icon: BarChart2,
      title: "Market Analysis",
      desc: "Understanding how markets move and what drives price action in a clear, jargon-free way.",
      color: "oklch(0.62 0.22 255)",
      delay: 0,
    },
    {
      icon: BookOpen,
      title: "Investment Basics",
      desc: "Core principles of smart investing and portfolio building for every stage of your financial journey.",
      color: "oklch(0.72 0.2 155)",
      delay: 100,
    },
    {
      icon: Award,
      title: "Wealth Management",
      desc: "Strategies for managing and growing your personal finances with confidence and clarity.",
      color: "oklch(0.75 0.18 220)",
      delay: 200,
    },
  ];
  return (
    <section id="insights" className="py-20 section-bg-alt">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div ref={titleRef} className="reveal text-center mb-14">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: "oklch(0.62 0.22 255)" }}
          >
            Community by the Numbers
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">
            A Thriving <span className="gradient-text">Learning Community</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {stats.map((s) => (
            <StatCard key={s.label} item={s} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topics.map((t) => (
            <TopicCard key={t.title} item={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Community / About ────────────────────────────────────────────────────────
function Community() {
  const ref = useReveal();
  return (
    <section id="community" className="py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center gap-12">
        {/* Card panel — centered */}
        <div ref={ref} className="reveal w-full max-w-xl">
          <div
            className="rounded-2xl p-8"
            style={{
              background: "oklch(0.13 0.025 245)",
              border: "1px solid oklch(0.22 0.04 250)",
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.55 0.24 255), oklch(0.68 0.22 165))",
                }}
              >
                <GraduationCap size={22} className="text-white" />
              </div>
              <div>
                <div
                  className="font-semibold"
                  style={{ color: "oklch(0.9 0.015 240)" }}
                >
                  Finance Pro Community
                </div>
                <div
                  className="text-sm"
                  style={{ color: "oklch(0.58 0.04 240)" }}
                >
                  10,241 members
                </div>
              </div>
            </div>
            {[
              { icon: Globe, text: "Daily financial news & market updates" },
              { icon: BookOpen, text: "Educational content for all levels" },
              { icon: Users, text: "Active, supportive learning community" },
              { icon: Lightbulb, text: "Practical wealth-building tips" },
              { icon: Shield, text: "100% free — no fees, no upsells" },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-3 py-2.5"
                style={{ borderBottom: "1px solid oklch(0.18 0.03 245)" }}
              >
                <item.icon
                  size={16}
                  className="text-green-glow flex-shrink-0"
                />
                <span
                  className="text-sm"
                  style={{ color: "oklch(0.75 0.04 240)" }}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Text content — centered */}
        <div className="text-center max-w-2xl">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: "oklch(0.72 0.2 155)" }}
          >
            About Us
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            We Make Finance{" "}
            <span className="gradient-text">Accessible to Everyone</span>
          </h2>
          <p
            className="leading-relaxed mb-4"
            style={{ color: "oklch(0.68 0.04 240)" }}
          >
            Finance Pro Community is a free Telegram group dedicated to
            financial education and market literacy. We share daily insights,
            analysis, and educational content to help you understand financial
            markets and make more informed decisions.
          </p>
          <p
            className="leading-relaxed mb-8"
            style={{ color: "oklch(0.68 0.04 240)" }}
          >
            Our experienced team monitors financial markets daily and translates
            complex market movements into clear, educational content — so you
            always know what's happening and why.
          </p>
          <a
            href={TG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-telegram"
            data-ocid="community.primary_button"
          >
            <Send size={18} /> Join the Community
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonial card ─────────────────────────────────────────────────────────
interface TestimonialItem {
  name: string;
  role: string;
  text: string;
  stars: number;
  delay: number;
  index: number;
}
function TestimonialCard({ item }: { item: TestimonialItem }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className="card-feature reveal p-7"
      style={{ transitionDelay: `${item.delay}ms` }}
      data-ocid={`testimonials.item.${item.index}`}
    >
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].slice(0, item.stars).map((n) => (
          <Star
            key={n}
            size={15}
            fill="oklch(0.82 0.18 85)"
            style={{ color: "oklch(0.82 0.18 85)" }}
          />
        ))}
      </div>
      <p
        className="text-sm leading-relaxed mb-5 italic"
        style={{ color: "oklch(0.72 0.04 240)" }}
      >
        &ldquo;{item.text}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.55 0.24 255), oklch(0.68 0.22 165))",
            color: "white",
          }}
        >
          {item.name[0]}
        </div>
        <div>
          <div
            className="font-semibold text-sm"
            style={{ color: "oklch(0.9 0.015 240)" }}
          >
            {item.name}
          </div>
          <div className="text-xs" style={{ color: "oklch(0.55 0.04 240)" }}>
            {item.role}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  const titleRef = useReveal();
  const items: TestimonialItem[] = [
    {
      name: "Marcus K.",
      role: "Finance Student",
      text: "I've been a member for 6 months and my understanding of financial markets has completely transformed. The daily content is clear, educational, and genuinely useful.",
      stars: 5,
      delay: 0,
      index: 1,
    },
    {
      name: "Sarah P.",
      role: "Community Member",
      text: "As a complete beginner, I was intimidated by finance. This community made it approachable and fun. I've learned more here than in any course I've paid for!",
      stars: 5,
      delay: 110,
      index: 2,
    },
    {
      name: "James R.",
      role: "Investor",
      text: "The quality of educational content is outstanding. The market analysis explanations helped me understand what's actually happening in global markets.",
      stars: 5,
      delay: 220,
      index: 3,
    },
  ];
  return (
    <section id="testimonials" className="py-20 section-bg-alt">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div ref={titleRef} className="reveal text-center mb-14">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: "oklch(0.62 0.22 255)" }}
          >
            What Members Say
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">
            Loved by{" "}
            <span className="gradient-text">Thousands of Learners</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((t) => (
            <TestimonialCard key={t.name} item={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
function CTA() {
  const ref = useReveal();
  return (
    <section className="py-24" id="cta">
      <div
        className="max-w-3xl mx-auto px-4 sm:px-6 text-center reveal"
        ref={ref}
      >
        <div
          className="rounded-3xl p-8 sm:p-12"
          style={{
            background: "oklch(0.13 0.025 245)",
            border: "1px solid oklch(0.28 0.06 255 / 0.5)",
            boxShadow: "0 0 60px oklch(0.62 0.22 255 / 0.1)",
          }}
        >
          <GraduationCap
            size={48}
            className="mx-auto mb-6"
            style={{ color: "oklch(0.72 0.2 255)" }}
          />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Our <span className="gradient-text">Free Community</span> Today
          </h2>
          <p className="text-lg mb-8" style={{ color: "oklch(0.65 0.04 240)" }}>
            10,000+ members are already learning and growing together. Join free
            and start your financial education journey.
          </p>

          {/* Countdown Timer */}
          <CountdownTimer />

          <a
            href={TG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-telegram text-lg"
            data-ocid="cta.primary_button"
          >
            <Send size={20} /> Join Telegram Community
          </a>
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {[
              { icon: CheckCircle, text: "100% Free" },
              { icon: CheckCircle, text: "No Spam" },
              { icon: CheckCircle, text: "Daily Content" },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-1.5 text-sm"
                style={{ color: "oklch(0.62 0.04 240)" }}
              >
                <item.icon size={14} className="text-green-glow" />
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  return (
    <footer
      className="py-12"
      style={{
        background: "oklch(0.07 0.016 250)",
        borderTop: "1px solid oklch(0.18 0.03 250)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.55 0.24 255), oklch(0.68 0.22 165))",
              }}
            >
              <GraduationCap size={16} className="text-white" />
            </div>
            <span className="font-bold gradient-text">
              Finance Pro Community
            </span>
          </div>
          <a
            href={TG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-telegram !px-6 !py-2.5 text-sm"
            data-ocid="footer.primary_button"
          >
            <Send size={14} /> Join on Telegram
          </a>
        </div>
        <div
          className="rounded-2xl p-5 mb-8 text-xs leading-relaxed"
          style={{
            background: "oklch(0.11 0.02 250)",
            border: "1px solid oklch(0.2 0.035 250)",
            color: "oklch(0.5 0.04 240)",
          }}
        >
          <strong style={{ color: "oklch(0.65 0.06 50)" }}>
            ⚠ Educational Disclaimer:
          </strong>{" "}
          Finance Pro Community is for educational and informational purposes
          only. Content shared in our community does not constitute financial
          advice. We do not guarantee any financial outcomes. Always consult a
          qualified financial advisor before making investment decisions. Past
          market performance is not indicative of future results.
        </div>
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs"
          style={{ color: "oklch(0.42 0.03 240)" }}
        >
          <span>© {year} Finance Pro Community. All rights reserved.</span>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "oklch(0.48 0.04 240)" }}
            className="hover:underline"
          >
            Built with ❤ using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}

// ─── Floating Telegram Button ─────────────────────────────────────────────────
function FloatingButton() {
  return (
    <a
      href={TG_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center pulse-glow transition-transform hover:scale-110"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.55 0.24 255), oklch(0.68 0.22 165))",
        boxShadow: "0 4px 20px oklch(0.62 0.22 255 / 0.5)",
      }}
      aria-label="Join Telegram"
      data-ocid="floating.primary_button"
    >
      <Send
        size={22}
        className="text-white"
        style={{ transform: "translateX(2px)" }}
      />
    </a>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <Navbar />
      <SubscribeBar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Insights />
        <Community />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
      <FloatingButton />
    </>
  );
}
