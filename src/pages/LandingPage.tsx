// pages/LandingPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import {
  BoltIcon,
  CubeTransparentIcon,
  ServerStackIcon,
  ArrowRightIcon,
  CodeBracketIcon,
  CommandLineIcon,
  WrenchScrewdriverIcon,
  ArrowTopRightOnSquareIcon,
  SignalIcon,
  Square3Stack3DIcon,
  CircleStackIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { BellIcon } from "@heroicons/react/24/solid";

// ─── Data ────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: BoltIcon,
    title: "WebSocket real-time",
    description:
      "Persistent WebSocket connections with heartbeat monitoring ensure notifications arrive the instant they're emitted — no polling, no delays.",
    accent: "emerald",
  },
  {
    icon: CubeTransparentIcon,
    title: "Easy integration",
    description:
      "Drop-in React provider, framework-agnostic core client, and a clean REST API. From zero to real-time in minutes.",
    accent: "violet",
  },
  {
    icon: Square3Stack3DIcon,
    title: "Multi-app & group support",
    description:
      "Organize notifications hierarchically — App → Group → Item. Route events from multiple services into one unified stream.",
    accent: "blue",
  },
  {
    icon: ServerStackIcon,
    title: "Lightweight & self-hosted",
    description:
      "A single Go binary with Redis for connection tracking. Deploy it anywhere — no vendor lock-in, no managed service fees.",
    accent: "amber",
  },
];

const accentMap: Record<string, { pill: string; icon: string; border: string }> = {
  emerald: {
    pill: "bg-emerald-50 text-emerald-600 ring-emerald-200",
    icon: "text-emerald-500",
    border: "group-hover:border-emerald-200",
  },
  violet: {
    pill: "bg-violet-50 text-violet-600 ring-violet-200",
    icon: "text-violet-500",
    border: "group-hover:border-violet-200",
  },
  blue: {
    pill: "bg-blue-50 text-blue-600 ring-blue-200",
    icon: "text-blue-500",
    border: "group-hover:border-blue-200",
  },
  amber: {
    pill: "bg-amber-50 text-amber-600 ring-amber-200",
    icon: "text-amber-500",
    border: "group-hover:border-amber-200",
  },
};

const layers = [
  {
    tag: "Go · Backend",
    name: "r2-notify-server",
    desc: "WebSocket hub with REST + event-driven inputs. Handles connection management, message routing, and persistence.",
    icon: ServerStackIcon,
    npm: null,
    color: "emerald",
  },
  {
    tag: "TypeScript · Core",
    name: "r2-notify-client",
    desc: "Framework-agnostic client library. Implements the WebSocket protocol, connection lifecycle, and event emitters.",
    icon: CodeBracketIcon,
    npm: "r2-notify-client",
    color: "violet",
  },
  {
    tag: "React · Wrapper",
    name: "r2-notify-react",
    desc: "React Context + Hooks wrapper. Owns the client instance, manages lifecycle, and exposes clean hooks.",
    icon: WrenchScrewdriverIcon,
    npm: "r2-notify-react",
    color: "blue",
  },
];

const serverSnippet = `curl --location '<base_url>/notification' \\
  --header 'X-App-ID: <app_id>' \\
  --header 'Authorization: <api_key>' \\
  --header 'Content-Type: application/json' \\
  --data '{
    "groupKey": "orders",
    "message": "Your order has shipped",
    "status": "success"
  }'`;

const clientSnippet = `import { R2NotifyClient } from "r2-notify-client";

const client = new R2NotifyClient({
  url: "wss://<base_url>/ws",
  apiKey: "<api_key>",
  reconnect: true,
  debug: true,
});

client.connect();
client.on("newNotification", (n) => {
  console.log("Received:", n.message);
});`;

const reactSnippet = `<R2NotifyProvider
  url="wss://<base_url>/ws"
  apiKey="<api_key>"
  autoConnect={true}
  debug={true}
>
  <App />
</R2NotifyProvider>

// Inside any component:
const { isConnected, newNotification } = useNotifications();`;

// ─── Sub-components ───────────────────────────────────────────────────────────

const CodeBlock: React.FC<{ code: string }> = ({ code }) => (
  <div className="rounded-lg bg-gray-950 border border-gray-800 overflow-hidden">
    <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-gray-800">
      <span className="w-2.5 h-2.5 rounded-full bg-gray-700" />
      <span className="w-2.5 h-2.5 rounded-full bg-gray-700" />
      <span className="w-2.5 h-2.5 rounded-full bg-gray-700" />
    </div>
    <pre className="px-4 py-4 text-xs text-gray-300 font-mono leading-relaxed overflow-x-auto whitespace-pre">
      {code}
    </pre>
  </div>
);

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
    {children}
  </span>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <section className="relative bg-[#0a1a0b] overflow-hidden">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#4ade80 1px, transparent 1px), linear-gradient(to right, #4ade80 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(74,222,128,0.12),transparent)]" />

        <div className="relative container mx-auto px-6 pt-24 pb-28 max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20 text-xs font-medium text-emerald-400 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Open source · Self-hosted · TypeScript + Go
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
            Real-time notifications,{" "}
            <span className="text-emerald-400">done right</span>
          </h1>

          <p className="text-base sm:text-lg text-white/50 max-w-2xl mx-auto leading-relaxed mb-10">
            R2-Notify is a modular, three-layer notification platform built on
            WebSockets. One server, one client library, one React wrapper —
            deployable anywhere, integrable with anything.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/playground"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              Try the Playground
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <a
              href="https://github.com/sheranthaperera93/r2-notify-demo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/6 text-white/70 text-sm font-medium ring-1 ring-white/10 hover:bg-white/10 hover:text-white transition-colors focus:outline-none"
            >
              <CommandLineIcon className="w-4 h-4" />
              View on GitHub
              <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
            </a>
            <Link
              to="/get-api-key"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/6 text-white/70 text-sm font-medium ring-1 ring-white/10 hover:bg-white/10 hover:text-white transition-colors focus:outline-none"
            >
              <KeyIcon className="w-4 h-4" />
              Get Started
            </Link>
          </div>

          {/* Inspired-by note */}
          <p className="mt-10 text-xs text-white/20 tracking-wide">
            Inspired by R2-D2 — a quiet, dependable messenger that just does its job.
          </p>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-white border-b border-gray-100 py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12 space-y-3">
            <SectionLabel>
              <BoltIcon className="w-3 h-3" /> Features
            </SectionLabel>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Built for modern applications
            </h2>
            <p className="text-sm text-gray-400 max-w-xl mx-auto">
              Every design decision in R2-Notify was made with production systems in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map(({ icon: Icon, title, description, accent }) => {
              const a = accentMap[accent];
              return (
                <div
                  key={title}
                  className={`group rounded-xl border border-gray-100 bg-white p-5 transition-all duration-200 hover:shadow-sm ${a.border}`}
                >
                  <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ring-1 mb-4 ${a.pill}`}>
                    <Icon className={`w-4 h-4 ${a.icon}`} />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-1.5">{title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Architecture ── */}
      <section className="bg-gray-50 border-b border-gray-100 py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12 space-y-3">
            <SectionLabel>
              <CubeTransparentIcon className="w-3 h-3" /> Architecture
            </SectionLabel>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Three layers, intentionally decoupled
            </h2>
            <p className="text-sm text-gray-400 max-w-xl mx-auto">
              Use all three together, or just the parts you need. Each layer has a single responsibility.
            </p>
          </div>

          <div className="space-y-3">
            {layers.map(({ tag, name, desc, icon: Icon, npm, color }) => {
              const a = accentMap[color];
              return (
                <div
                  key={name}
                  className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white px-5 py-4 hover:shadow-sm transition-shadow"
                >
                  <div className={`flex items-center justify-center w-9 h-9 rounded-lg ring-1 shrink-0 mt-0.5 ${a.pill}`}>
                    <Icon className={`w-4 h-4 ${a.icon}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-800 font-mono">{name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ring-1 ${a.pill}`}>
                        {tag}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
                  </div>
                  {npm && (
                    <a
                      href={`https://www.npmjs.com/package/${npm}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-400 ring-1 ring-gray-200 hover:text-gray-600 hover:ring-gray-300 transition-colors"
                    >
                      npm
                      <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                    </a>
                  )}
                </div>
              );
            })}
          </div>

          {/* Layering note */}
          <div className="mt-6 rounded-xl bg-white border border-gray-200 px-5 py-4">
            <div className="flex items-start gap-3">
              <CircleStackIcon className="w-4 h-4 text-gray-300 shrink-0 mt-px" />
              <p className="text-xs text-gray-400 leading-relaxed">
                Future framework wrappers (Angular, Vue, etc.) can be added on top of{" "}
                <code className="text-emerald-600 text-[11px]">r2-notify-client</code>{" "}
                without any changes to the core client or server — the protocol stays stable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Code examples ── */}
      <section className="bg-white border-b border-gray-100 py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12 space-y-3">
            <SectionLabel>
              <CodeBracketIcon className="w-3 h-3" /> Integration
            </SectionLabel>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              From zero to real-time in minutes
            </h2>
          </div>

          <div className="space-y-6">
            {/* REST */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <SignalIcon className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  1 · Send a notification via REST
                </span>
              </div>
              <CodeBlock code={serverSnippet} />
            </div>

            {/* Client */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CodeBracketIcon className="w-4 h-4 text-violet-500" />
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  2 · Connect with the core client
                </span>
              </div>
              <CodeBlock code={clientSnippet} />
            </div>

            {/* React */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <WrenchScrewdriverIcon className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  3 · Or use the React wrapper
                </span>
              </div>
              <CodeBlock code={reactSnippet} />
            </div>
          </div>
        </div>
      </section>

      {/* ── When to use ── */}
      <section className="bg-gray-50 border-b border-gray-100 py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12 space-y-3">
            <SectionLabel>
              <WrenchScrewdriverIcon className="w-3 h-3" /> Fit
            </SectionLabel>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Is R2-Notify right for you?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Good fit */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 px-5 py-5">
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-4">
                Good fit ✓
              </p>
              <ul className="space-y-2.5">
                {[
                  "Need real-time, push-based notifications",
                  "Supporting multiple frontend frameworks",
                  "Want clean separation between backend and UI",
                  "Prefer event-driven over polling architectures",
                  "Self-hosting is a priority",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="mt-px text-emerald-500 shrink-0">→</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Not ideal */}
            <div className="rounded-xl border border-gray-200 bg-white px-5 py-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Not ideal ✗
              </p>
              <ul className="space-y-2.5">
                {[
                  "Only need occasional polling — HTTP is enough",
                  "Want a fully managed SaaS notification service",
                  "Tightly coupled to a single UI framework is acceptable",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2 text-xs text-gray-400">
                    <span className="mt-px shrink-0">–</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#0a1a0b] py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_100%,rgba(74,222,128,0.07),transparent)]" />
        <div className="relative container mx-auto px-6 max-w-2xl text-center space-y-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/15 ring-1 ring-emerald-500/25 mx-auto">
            <BellIcon className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Ready to add real-time notifications?
          </h2>
          <p className="text-sm text-white/40 leading-relaxed">
            Try the live playground, grab an API key, or clone the demo repo and
            run it locally. Feedback and contributions are always welcome.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/playground"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-400 transition-colors"
            >
              Open Playground
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <a
              href="https://r2-notify-demo.onrender.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/6 text-white/70 text-sm font-medium ring-1 ring-white/10 hover:bg-white/10 hover:text-white transition-colors"
            >
              Live Demo
              <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Packages */}
          <div className="pt-6 border-t border-white/8 flex flex-wrap justify-center gap-4">
            {[
              { label: "r2-notify-server", href: "https://github.com/sheranthaperera93/r2-notify-demo" },
              { label: "r2-notify-client", href: "https://www.npmjs.com/package/r2-notify-client" },
              { label: "r2-notify-react", href: "https://www.npmjs.com/package/r2-notify-react" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-white/30 hover:text-emerald-400 transition-colors"
              >
                {label} ↗
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
