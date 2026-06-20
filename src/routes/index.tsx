import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring, animate, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { submitEnquiry } from "../lib/leads";
import { toast } from "sonner";
import {
  ArrowUpRight, ArrowRight, Cog, ShieldCheck, Truck, Globe2, Wrench, Factory,
  Phone, Mail, MapPin, MessageCircle, Plus, Minus, Download,
  Boxes, Package, Sparkles, CheckCircle2, Menu, X,
} from "lucide-react";

import heroFactory from "@/assets/hero-factory.png";
import logoVJ from "@/assets/vj-logo.png";
import pSemi from "@/assets/product-semi.jpg";
import pAuto from "@/assets/product-auto.jpg";
import pCarton from "@/assets/product-carton.jpg";
import pPP from "@/assets/product-pp.jpg";
import pTape from "@/assets/product-tape.jpg";
import fac1 from "@/assets/factory-1.jpg";
import fac2 from "@/assets/factory-2.jpg";
import fac3 from "@/assets/factory-3.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VJ Strapping Systems — Engineering Packaging Excellence" },
      { name: "description", content: "Manufacturer & exporter of high-performance strapping machines, polypropylene straps and industrial packaging solutions since 2004." },
      { property: "og:title", content: "VJ Strapping Systems" },
      { property: "og:description", content: "Engineering packaging excellence for modern industries." },
      { property: "og:image", content: heroFactory },
    ],
  }),
  component: Home,
});

/* ------------------------------- LOADER ------------------------------- */
function Loader({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center overflow-hidden"
    >
      <motion.img
        src={logoVJ}
        alt="VJ"
        initial={{ scale: 0.85, opacity: 0, filter: "blur(20px)" }}
        animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-72 md:w-96 h-28 object-contain"
      />
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: [0.65, 0, 0.35, 1] }}
        className="mt-8 h-px w-[60vw] origin-left bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent"
      />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="mt-6 text-center"
      >
        <p className="font-section text-xs tracking-[0.5em] text-white/70 uppercase">Engineering Packaging Excellence</p>
        <p className="mt-2 font-num text-[10px] tracking-[0.4em] text-[var(--gold)]">SINCE 2004</p>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------- CURSOR GLOW ------------------------------- */
function CursorGlow() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 250, damping: 30 });
  const sy = useSpring(y, { stiffness: 250, damping: 30 });
  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);
  return (
    <motion.div
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed top-0 left-0 z-50 hidden md:block"
    >
      <div className="-translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(245,158,11,0.10) 0%, rgba(245,158,11,0) 60%)" }} />
    </motion.div>
  );
}

/* ------------------------------- NAV ------------------------------- */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [
    { href: "#about", label: "About" },
    { href: "#products", label: "Products" },
    { href: "#industries", label: "Industries" },
    { href: "#quality", label: "Quality" },
    { href: "#contact", label: "Contact" },
  ];
  return (
    <header className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}>
      <div className={`mx-auto max-w-7xl px-5 transition-all duration-500 ${scrolled ? "" : ""}`}>
        <div className={`flex items-center justify-between rounded-full px-5 py-3 transition-all duration-500 ${scrolled ? "glass-strong" : ""}`}>
          <a href="#top" className="flex items-center">
            <img src={logoVJ} alt="VJ Strapping Systems" className="h-9 w-auto object-contain" />
          </a>
          <nav className="hidden lg:flex items-center gap-9">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-white/70 hover:text-white transition-colors relative group">
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[var(--gold)] group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a href="#contact" className="hidden sm:inline-flex items-center gap-2 text-sm bg-white text-[var(--ink)] font-medium px-5 py-2.5 rounded-full hover:bg-[var(--gold)] transition-colors">
              Get Quote <ArrowUpRight className="w-4 h-4" />
            </a>
            <button onClick={() => setOpen(true)} className="lg:hidden p-2 text-white"><Menu className="w-6 h-6" /></button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-[var(--ink)] z-50 p-6"
          >
            <div className="flex justify-between items-center">
              <img src={logoVJ} alt="VJ" className="h-8 w-8" />
              <button onClick={() => setOpen(false)}><X className="w-6 h-6" /></button>
            </div>
            <div className="mt-16 flex flex-col gap-6">
              {links.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="font-section text-4xl text-white">{l.label}</a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ------------------------------- HERO ------------------------------- */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const headline = ["Engineering", "Packaging", "Excellence"];

  return (
    <section ref={ref} id="top" className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <img src={heroFactory} alt="Industrial factory" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--ink)]/70 via-[var(--ink)]/50 to-[var(--ink)]" />
        <div className="absolute inset-0 grid-industrial opacity-40" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 20%, rgba(245,158,11,0.18), transparent 60%)" }} />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 mx-auto max-w-5xl px-5 py-24 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--gold)] opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--gold)]" />
          </span>
          <span className="font-num text-[10px] tracking-[0.4em] text-white/70 uppercase">Manufacturer · Exporter · Since 2004</span>
        </motion.div>

        <h1 className="font-display font-bold leading-[0.92] text-[clamp(3.5rem,9vw,9rem)]">
          {headline.map((w, i) => (
            <span key={w} className="block overflow-hidden">
              <motion.span
                initial={{ y: "110%", rotate: 4 }}
                animate={{ y: 0, rotate: 0 }}
                transition={{ duration: 1, delay: 0.3 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className={`block ${i === 2 ? "text-gradient-gold italic" : "text-white"}`}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-8 text-lg text-white/65 max-w-2xl leading-relaxed text-center"
        >
          Manufacturer & exporter of high-performance strapping machines, polypropylene straps and industrial packaging solutions for modern industries.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <MagneticButton href="#contact" primary>Get Instant Quote</MagneticButton>
          <MagneticButton href="#products">Explore Products</MagneticButton>
        </motion.div>
      </motion.div>

      {/* scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="font-num text-[9px] tracking-[0.4em] text-white/50">SCROLL</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
      </motion.div>
    </section>
  );
}

/* ------------------------------- MAGNETIC BUTTON ------------------------------- */
function MagneticButton({ href, children, primary = false }: { href: string; children: React.ReactNode; primary?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect(); if (!r) return;
    x.set((e.clientX - r.left - r.width / 2) * 0.35);
    y.set((e.clientY - r.top - r.height / 2) * 0.35);
  };
  const reset = () => { x.set(0); y.set(0); };
  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={`group inline-flex items-center gap-3 px-7 py-4 rounded-full text-sm font-medium transition-colors ${
        primary
          ? "bg-[var(--gold)] text-[var(--ink)] hover:bg-amber-400"
          : "border border-white/20 text-white hover:bg-white/5"
      }`}
    >
      {children}
      <motion.span className="inline-block" whileHover={{ x: 4 }}>
        <ArrowUpRight className="w-4 h-4" />
      </motion.span>
    </motion.a>
  );
}

/* ------------------------------- TRUST MARQUEE ------------------------------- */
function TrustBar() {
  const items = [
    "Manufacturing Excellence", "20+ Years Experience", "Export Quality",
    "5000+ Clients", "Premium Packaging Solutions", "ISO Certified",
    "Global Dispatch", "Engineering Precision",
  ];
  const doubled = [...items, ...items];
  return (
    <section className="border-y border-white/10 bg-[var(--ink-2)] py-8 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((s, i) => (
          <div key={i} className="flex items-center gap-12 px-12">
            <span className="font-section text-2xl md:text-3xl text-white/40 hover:text-[var(--gold)] transition-colors">{s}</span>
            <span className="text-[var(--gold)]">◆</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------- ABOUT ------------------------------- */
function About() {
  const [activeTab, setActiveTab] = useState<"profile" | "infrastructure" | "milestones">("profile");

  return (
    <section id="about" className="relative py-32 px-5">
      <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 items-start">
        <div className="grid grid-cols-2 gap-4 relative lg:sticky lg:top-24">
          <RevealImage src={fac1} className="col-span-2 aspect-[16/10]" />
          <RevealImage src={fac2} className="aspect-[4/5] translate-y-6" />
          <RevealImage src={fac3} className="aspect-[4/5]" />
        </div>
        <div>
          <SectionLabel>About V. J. Strapping Systems</SectionLabel>
          <SectionHeading>
            Built on <span className="text-gradient-gold italic">precision.</span><br />
            Trusted by industries.
          </SectionHeading>

          {/* Elegant tab selectors */}
          <div className="mt-8 flex border-b border-white/10 gap-6">
            {(["profile", "infrastructure", "milestones"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-medium tracking-wider uppercase relative transition-colors ${
                  activeTab === tab ? "text-[var(--gold)]" : "text-white/55 hover:text-white"
                }`}
              >
                {tab === "profile" ? "Our Profile" : tab === "infrastructure" ? "Infrastructure" : "Milestones"}
                {activeTab === tab && (
                  <motion.span
                    layoutId="activeAboutTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--gold)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="mt-8 min-h-[350px]">
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6 text-white/65 leading-relaxed text-base"
              >
                <p>
                  Established in 2004, V. J. Strapping Systems is a trusted manufacturer and exporter of high-quality packaging solutions, serving diverse industries across India and international markets. With over two decades of expertise, we specialize in Polypropylene Strapping Rolls, Semi-Automatic and Fully Automatic Box Strapping Machines, Self-Adhesive Tapes, Packaging Machinery, and a wide range of packaging materials.
                </p>
                <p>
                  Our products are designed to deliver efficiency, durability, and reliability for bundling, carton sealing, and industrial packaging applications. Backed by advanced manufacturing facilities, modern technology, and a skilled workforce, we consistently provide solutions that meet the evolving needs of our customers.
                </p>
                <p>
                  At V. J. Strapping Systems, customer satisfaction remains at the core of everything we do. Through stringent quality control processes, ethical business practices, and a commitment to innovation, we have built long-term relationships with clients across various industries. Our dedication to excellence has earned us a strong reputation as a dependable packaging solutions partner.
                </p>
              </motion.div>
            )}

            {activeTab === "infrastructure" && (
              <motion.div
                key="infrastructure"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6 text-white/65 leading-relaxed text-base"
              >
                <p>
                  Our modern manufacturing facility is equipped with advanced machinery and streamlined production systems that enable us to maintain superior quality standards while fulfilling bulk orders efficiently. This strong infrastructural foundation allows us to deliver reliable products within committed timelines.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/5">
                  <div className="glass rounded-xl p-4">
                    <h4 className="text-[var(--gold)] font-section font-semibold">Advanced CNC</h4>
                    <p className="text-xs text-white/50 mt-1">High-precision component manufacturing.</p>
                  </div>
                  <div className="glass rounded-xl p-4">
                    <h4 className="text-[var(--gold)] font-section font-semibold">Streamlined Lines</h4>
                    <p className="text-xs text-white/50 mt-1">Optimized setup for high productivity.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "milestones" && (
              <motion.div
                key="milestones"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-6 space-y-0"
              >
                {[
                  { y: "2004", t: "Founded", d: "Started as a precision packaging workshop in India." },
                  { y: "2010", t: "Expansion", d: "Scaled operations across pan-India distribution." },
                  { y: "2016", t: "Manufacturing Upgrade", d: "Adopted advanced CNC manufacturing lines." },
                  { y: "2020", t: "Export Growth", d: "Expanded to 25+ international markets." },
                  { y: "2026", t: "Industry Leader", d: "Trusted by 5000+ businesses globally." },
                ].map((it, i) => (
                  <TimelineRow key={it.y} {...it} last={i === 4} />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function RevealImage({ src, className = "" }: { src: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div ref={ref} className={`relative overflow-hidden rounded-2xl bg-[var(--ink-2)] ${className}`}>
      <motion.div
        initial={{ scaleY: 1 }}
        animate={inView ? { scaleY: 0 } : {}}
        transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
        className="absolute inset-0 bg-[var(--ink)] origin-top z-10"
      />
      <motion.img
        src={src}
        alt=""
        loading="lazy"
        initial={{ scale: 1.3 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

function TimelineRow({ y, t, d, last }: { y: string; t: string; d: string; last?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div ref={ref} className="flex gap-6 group">
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.4 }}
          className="w-3 h-3 rounded-full bg-[var(--gold)] ring-4 ring-[var(--gold)]/20"
        />
        {!last && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-px flex-1 bg-gradient-to-b from-[var(--gold)]/50 to-white/5 origin-top min-h-[60px]"
          />
        )}
      </div>
      <div className="pb-10 flex-1">
        <div className="font-num text-[var(--gold)] text-sm tracking-widest">{y}</div>
        <div className="font-section text-xl text-white mt-1">{t}</div>
        <div className="text-white/55 text-sm mt-1">{d}</div>
      </div>
    </div>
  );
}

/* ------------------------------- WHY US BENTO ------------------------------- */
function WhyUs() {
  const cards = [
    { icon: Cog, t: "20+ Years Experience", d: "Two decades engineering industrial packaging.", span: "md:col-span-2 md:row-span-2" },
    { icon: Factory, t: "Advanced Manufacturing", d: "CNC precision lines.", span: "" },
    { icon: ShieldCheck, t: "Quality Assurance", d: "ISO-grade inspection at every stage.", span: "" },
    { icon: Truck, t: "Fast Dispatch", d: "Pan-India & global logistics.", span: "" },
    { icon: Globe2, t: "Export Ready", d: "Trusted across 25+ countries.", span: "" },
    { icon: Wrench, t: "Technical Support", d: "24/7 service engineering.", span: "md:col-span-2" },
  ];
  return (
    <section className="py-32 px-5">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <SectionLabel>Why Choose VJ</SectionLabel>
            <SectionHeading>The standard for<br /><span className="text-gradient-gold italic">industrial packaging.</span></SectionHeading>
          </div>
          <p className="text-white/55 max-w-md">Six reasons global manufacturers choose us as their packaging partner.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-4 auto-rows-[200px]">
          {cards.map((c, i) => <BentoCard key={i} {...c} index={i} />)}
        </div>
      </div>
    </section>
  );
}

function BentoCard({ icon: Icon, t, d, span, index }: any) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const onMove = (e: React.MouseEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={onMove}
      whileHover={{ y: -6 }}
      className={`relative glass rounded-2xl p-7 overflow-hidden group ${span}`}
      style={{ background: `radial-gradient(400px circle at ${pos.x}% ${pos.y}%, rgba(245,158,11,0.12), rgba(255,255,255,0.03) 50%)` }}
    >
      <div className="relative z-10 h-full flex flex-col justify-between">
        <Icon className="w-7 h-7 text-[var(--gold)]" strokeWidth={1.4} />
        <div>
          <div className="font-section text-xl md:text-2xl text-white">{t}</div>
          <div className="text-sm text-white/55 mt-2 max-w-xs">{d}</div>
        </div>
      </div>
      <div className="absolute -bottom-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-[var(--gold)]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}

/* ------------------------------- PRODUCTS ------------------------------- */
const PRODUCTS = [
  { id: 1, name: "Semi Automatic Strapping Machine", tag: "Strapping · Manual feed", img: pSemi,
    specs: ["Strap width 9–15mm", "Tension up to 70kg", "Power 220V / 50Hz", "Cycle 2.6 sec"],
    apps: ["Logistics", "Carton sealing", "E-commerce"] },
  { id: 2, name: "Fully Automatic Strapping Machine", tag: "High-throughput", img: pAuto,
    specs: ["Speed 45 straps/min", "PLC controlled", "Arch sizes customizable", "Power 1.5kW"],
    apps: ["Warehousing", "Manufacturing", "Exports"] },
  { id: 3, name: "Automatic Strapping Machine", tag: "Inline integration", img: pCarton,
    specs: ["Conveyor integration", "Sensor activated", "Tension 5–60kg", "Power 0.7kW"],
    apps: ["Production lines", "FMCG", "Pharma"] },
  { id: 4, name: "Carton Sealing Machine", tag: "Top & bottom sealing", img: pCarton,
    specs: ["Tape width 48–75mm", "Speed 20 m/min", "Adjustable height", "Stainless build"],
    apps: ["E-commerce", "Food", "Logistics"] },
  { id: 5, name: "Polypropylene Strapping Rolls", tag: "Consumable", img: pPP,
    specs: ["Width 9–19mm", "Custom colors", "High tensile strength", "Recyclable"],
    apps: ["All strapping machines", "Manual strapping"] },
  { id: 6, name: "BOPP Packing Tapes", tag: "Consumable", img: pTape,
    specs: ["Width 12–144mm", "Thickness 38–65 micron", "Acrylic adhesive", "Crystal clear"],
    apps: ["Carton sealing", "General packaging"] },
];

function Products() {
  const [active, setActive] = useState<typeof PRODUCTS[0] | null>(null);
  return (
    <section id="products" className="relative py-32 px-5 bg-[var(--ink-2)]">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20">
          <div>
            <SectionLabel>Our Products</SectionLabel>
            <SectionHeading>Engineered to <span className="text-gradient-gold italic">perform.</span></SectionHeading>
          </div>
          <p className="text-white/55 max-w-md">A complete range of strapping machinery and packaging consumables for modern industrial workflows.</p>
        </div>
        <div className="space-y-6">
          {PRODUCTS.map((p, i) => <ProductRow key={p.id} p={p} i={i} onOpen={() => setActive(p)} />)}
        </div>
      </div>
      <AnimatePresence>
        {active && <ProductModal p={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  );
}

function ProductRow({ p, i, onOpen }: any) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const reverse = i % 2 === 1;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={`grid md:grid-cols-12 gap-6 items-stretch glass rounded-3xl p-6 md:p-8 group hover:bg-white/[0.04] transition-colors`}
    >
      <div className={`md:col-span-7 ${reverse ? "md:order-2" : ""}`}>
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-gradient-to-br from-black to-[var(--ink-2)]">
          <motion.img
            src={p.img} alt={p.name} loading="lazy"
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full glass-strong text-[10px] font-num tracking-widest uppercase">{p.tag}</div>
        </div>
      </div>
      <div className={`md:col-span-5 flex flex-col justify-between min-w-0 ${reverse ? "md:order-1" : ""}`}>
        <div>
          <div className="font-num text-[var(--gold)] text-xs tracking-widest">PRODUCT · 0{p.id}</div>
          <h3 className="font-section text-3xl md:text-4xl text-white mt-3 leading-tight">{p.name}</h3>
          <ul className="mt-6 space-y-2">
            {p.specs.slice(0, 3).map((s: string) => (
              <li key={s} className="flex items-center gap-3 text-sm text-white/65">
                <CheckCircle2 className="w-4 h-4 text-[var(--gold)]" /> {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={onOpen} className="inline-flex items-center gap-2 bg-[var(--gold)] text-[var(--ink)] px-5 py-3 rounded-full text-sm font-medium hover:bg-amber-400 transition-colors">
            View Details <ArrowRight className="w-4 h-4" />
          </button>
          <a href="#contact" className="inline-flex items-center gap-2 border border-white/15 px-5 py-3 rounded-full text-sm hover:bg-white/5 transition-colors">
            Request Quote
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function ProductModal({ p, onClose }: { p: typeof PRODUCTS[0]; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl p-4 md:p-10 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-6xl glass-strong rounded-3xl overflow-hidden grid md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-square md:aspect-auto bg-gradient-to-br from-black to-[var(--ink-2)]">
          <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
          <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-8 md:p-10">
          <div className="font-num text-[var(--gold)] text-xs tracking-widest">PRODUCT · 0{p.id}</div>
          <h3 className="font-section text-3xl md:text-4xl mt-3">{p.name}</h3>
          <p className="text-white/55 mt-3">{p.tag}</p>
          <div className="mt-8">
            <div className="font-num text-xs tracking-widest text-white/40 mb-3">SPECIFICATIONS</div>
            <ul className="grid grid-cols-1 gap-2">
              {p.specs.map((s) => (
                <li key={s} className="flex items-center gap-3 text-sm text-white/75 border-b border-white/5 py-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--gold)]" /> {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8">
            <div className="font-num text-xs tracking-widest text-white/40 mb-3">APPLICATIONS</div>
            <div className="flex flex-wrap gap-2">
              {p.apps.map((a) => <span key={a} className="px-3 py-1.5 rounded-full glass text-xs">{a}</span>)}
            </div>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#contact" className="inline-flex items-center gap-2 bg-[var(--gold)] text-[var(--ink)] px-5 py-3 rounded-full text-sm font-medium">Request Quote <ArrowRight className="w-4 h-4" /></a>
            <button className="inline-flex items-center gap-2 border border-white/15 px-5 py-3 rounded-full text-sm hover:bg-white/5"><Download className="w-4 h-4" /> Download Brochure</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------- INDUSTRIES ------------------------------- */
function Industries() {
  const industries = [
    { name: "Warehousing", icon: Boxes },
    { name: "Logistics", icon: Truck },
    { name: "Food Packaging", icon: Package },
    { name: "FMCG", icon: Sparkles },
    { name: "Pharmaceutical", icon: ShieldCheck },
    { name: "Manufacturing", icon: Factory },
    { name: "Exports", icon: Globe2 },
    { name: "Automobile", icon: Cog },
    { name: "E-Commerce", icon: Package },
  ];
  return (
    <section id="industries" className="py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 mb-16">
        <SectionLabel>Industries Served</SectionLabel>
        <SectionHeading>Powering <span className="text-gradient-gold italic">every</span> sector.</SectionHeading>
      </div>
      <div className="px-5">
        <div className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-none -mx-1 px-1">
          {industries.map((it, i) => (
            <motion.div
              key={it.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="snap-start shrink-0 w-[280px] md:w-[340px] aspect-[3/4] rounded-3xl glass p-7 flex flex-col justify-between hover:bg-white/[0.05] transition-colors group cursor-pointer"
            >
              <div className="font-num text-xs text-white/30 tracking-widest">0{i + 1}</div>
              <div>
                <it.icon className="w-10 h-10 text-[var(--gold)] mb-6" strokeWidth={1.2} />
                <h3 className="font-section text-2xl md:text-3xl">{it.name}</h3>
                <div className="flex items-center gap-2 mt-6 text-sm text-white/40 group-hover:text-[var(--gold)] transition-colors">
                  Explore <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- QUALITY ASSURANCE ------------------------------- */
function Quality() {
  const stages = ["Raw Material", "Manufacturing", "Quality Testing", "Inspection", "Packaging", "Dispatch"];
  return (
    <section id="quality" className="relative py-32 px-5 bg-[var(--ink-2)] overflow-hidden">
      <div className="absolute inset-0 grid-industrial opacity-30" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(37,99,235,0.18), transparent 50%)" }} />
      <div className="relative mx-auto max-w-7xl">
        <div className="text-center max-w-3xl mx-auto">
          <SectionLabel>Quality Assurance</SectionLabel>
          <SectionHeading>A six-stage process<br /><span className="text-gradient-gold italic">obsessed with precision.</span></SectionHeading>
          <p className="mt-6 text-white/65 leading-relaxed max-w-2xl mx-auto text-base">
            Quality is the cornerstone of our success. Every product undergoes rigorous testing and inspection throughout the manufacturing process to ensure exceptional strength, performance, and consistency. By adhering to strict quality standards, we deliver packaging solutions that exceed customer expectations and industry benchmarks.
          </p>
        </div>
        <div className="mt-24 relative">
          <div className="absolute top-6 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)]/40 to-transparent" />
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
            {stages.map((s, i) => (
              <motion.div
                key={s}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="text-center"
              >
                <div className="relative mx-auto w-12 h-12 rounded-full bg-[var(--ink)] border border-[var(--gold)]/40 flex items-center justify-center font-num text-[var(--gold)]">
                  {i + 1}
                  <div className="absolute inset-0 rounded-full animate-pulse-ring" />
                </div>
                <div className="font-section text-base mt-5">{s}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- STATS ------------------------------- */
function Counter({ to, suffix, start }: { to: number; suffix?: string; start: boolean }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!start) return;
    const c = animate(0, to, { duration: 2.2, ease: [0.16, 1, 0.3, 1], onUpdate: (val) => setV(Math.floor(val)) });
    return () => c.stop();
  }, [start, to]);
  return <span>{v.toLocaleString()}{suffix}</span>;
}

function Stats() {
  const items = [
    { n: 20, s: "+", l: "Years Experience" },
    { n: 5000, s: "+", l: "Happy Customers" },
    { n: 10000, s: "+", l: "Deliveries" },
    { n: 99, s: "%", l: "Client Satisfaction" },
  ];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-32 px-5 relative overflow-hidden bg-gradient-to-b from-transparent to-[var(--ink-2)]/30">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 md:gap-x-12">
          {items.map((it, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex flex-col justify-start items-start"
            >
              <div className="font-num font-extrabold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-none text-gradient-steel whitespace-nowrap tracking-tight">
                <Counter to={it.n} suffix={it.s} start={inView} />
              </div>
              <div className="mt-4 w-full text-xs md:text-sm font-medium text-white/60 tracking-wider uppercase border-t border-white/10 pt-4 max-w-[160px]">
                {it.l}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- TESTIMONIALS ------------------------------- */
function Testimonials() {
  const reviews = [
    { q: "Their fully automatic line transformed our dispatch throughput. ROI within months.", a: "Operations Head", c: "Global Logistics Co." },
    { q: "Engineering quality on par with European brands at a fraction of the cost.", a: "Plant Manager", c: "FMCG Manufacturer" },
    { q: "After-sales support is exceptional. They genuinely partner with you.", a: "Supply Chain Director", c: "Pharma Group" },
    { q: "We've procured strapping machines from VJ for 8 years. Zero downtime.", a: "Warehouse Lead", c: "E-Commerce Fulfillment" },
    { q: "Consistent quality across every export shipment. Reliable partners.", a: "Procurement", c: "Automotive Tier-1" },
  ];
  const doubled = [...reviews, ...reviews];
  return (
    <section className="py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 mb-16">
        <SectionLabel>Client Voices</SectionLabel>
        <SectionHeading>Trusted by <span className="text-gradient-gold italic">industry leaders.</span></SectionHeading>
      </div>
      <div className="relative overflow-hidden">
        <div className="flex gap-5 animate-marquee w-max hover:[animation-play-state:paused]">
          {doubled.map((r, i) => (
            <div key={i} className="w-[420px] glass rounded-2xl p-7">
              <div className="text-[var(--gold)] text-3xl leading-none">“</div>
              <p className="mt-3 text-white/80 text-base leading-relaxed">{r.q}</p>
              <div className="mt-6 pt-5 border-t border-white/10">
                <div className="font-section text-sm">{r.a}</div>
                <div className="text-xs text-white/50 mt-1">{r.c}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- FAQ ------------------------------- */
function FAQ() {
  const items = [
    { q: "Do you ship internationally?", a: "Yes — we export to 25+ countries with complete documentation and on-site commissioning support." },
    { q: "What is the warranty on your machines?", a: "All strapping machines carry a 12-month warranty with extendable AMC contracts." },
    { q: "Can machines be customized for our line?", a: "Absolutely. Our engineering team offers custom arch sizes, conveyors, and PLC integrations." },
    { q: "What is the typical lead time?", a: "Standard products dispatch within 7–10 days. Custom builds typically 4–6 weeks." },
    { q: "Do you provide on-site training?", a: "Yes, our service engineers provide installation, operator training, and maintenance schedules." },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-32 px-5">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <SectionLabel>FAQ</SectionLabel>
          <SectionHeading>Frequently asked.</SectionHeading>
        </div>
        <div className="mt-16 divide-y divide-white/10 border-y border-white/10">
          {items.map((it, i) => (
            <div key={i} className="py-6">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between gap-4 text-left">
                <span className="font-section text-lg md:text-xl">{it.q}</span>
                <span className="shrink-0 w-9 h-9 rounded-full border border-white/15 flex items-center justify-center">
                  {open === i ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </span>
              </button>
              <motion.div
                initial={false}
                animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }}
                className="overflow-hidden"
              >
                <p className="pt-4 text-white/60 max-w-2xl">{it.a}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- CONTACT ------------------------------- */
function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [requirement, setRequirement] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name is required");
    if (!email.trim()) return toast.error("Email is required");
    if (!phone.trim()) return toast.error("Phone number is required");
    if (!requirement.trim() || requirement.trim().length < 10) {
      return toast.error("Requirement must be at least 10 characters long");
    }

    setIsSubmitting(true);
    try {
      // Gather source tracking parameters
      let source = {
        utm_source: "",
        utm_medium: "",
        utm_campaign: "",
        utm_content: "",
        utm_term: "",
        referrer: "Direct",
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "Unknown",
      };

      const savedSource = localStorage.getItem("vj_traffic_source");
      if (savedSource) {
        source = JSON.parse(savedSource);
      }

      const res = await submitEnquiry({
        data: {
          name,
          email,
          company,
          phone,
          requirement,
          source,
        },
      });

      if (res.success) {
        toast.success("Enquiry sent successfully! Our team will contact you soon.");
        setName("");
        setEmail("");
        setCompany("");
        setPhone("");
        setRequirement("");
      } else {
        toast.error("Failed to submit enquiry. Please try again.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-32 px-5 bg-[var(--ink-2)]">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <SectionLabel>Get in touch</SectionLabel>
            <SectionHeading>Let's engineer<br /><span className="text-gradient-gold italic">your packaging line.</span></SectionHeading>
            <p className="mt-6 text-white/60 max-w-md">Speak to our application engineers. We'll respond within one business day with a tailored proposal.</p>
            <div className="mt-12 space-y-5">
              {[
                { Icon: Phone, l: "+91 91212 92306", h: "Sales & Support", href: "tel:+919121292306" },
                { Icon: Mail, l: "sales@vjstrapping.com", h: "Email", href: "mailto:sales@vjstrapping.com" },
                { Icon: MapPin, l: "Industrial Estate, Mumbai, India", h: "Headquarters" },
                { Icon: MessageCircle, l: "Chat on WhatsApp", h: "Instant Reply", href: "https://wa.me/919121292306" },
              ].map(({ Icon, l, h, href }) => {
                const content = (
                  <>
                    <div className="w-12 h-12 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/30 flex items-center justify-center group-hover:bg-[var(--gold)] transition-colors">
                      <Icon className="w-5 h-5 text-[var(--gold)] group-hover:text-[var(--ink)]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-white/40 font-num tracking-widest">{h.toUpperCase()}</div>
                      <div className="font-section truncate">{l}</div>
                    </div>
                  </>
                );
                return href ? (
                  <a
                    key={l}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-4 glass rounded-2xl p-5 hover:bg-white/5 transition-colors group cursor-pointer"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={l} className="flex items-center gap-4 glass rounded-2xl p-5 hover:bg-white/5 transition-colors group">
                    {content}
                  </div>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="glass-strong rounded-3xl p-8 md:p-10 space-y-5">
            <Field
              label="Full Name"
              placeholder="DINESH"
              value={name}
              onChange={(e: any) => setName(e.target.value)}
              disabled={isSubmitting}
            />
            <Field
              label="Email"
              placeholder="you@company.com"
              type="email"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
            <Field
              label="Company"
              placeholder="Company name"
              value={company}
              onChange={(e: any) => setCompany(e.target.value)}
              disabled={isSubmitting}
            />
            <Field
              label="Phone"
              placeholder="+91 ..."
              value={phone}
              onChange={(e: any) => setPhone(e.target.value)}
              disabled={isSubmitting}
            />
            <div>
              <label className="text-xs font-num tracking-widest text-white/50">REQUIREMENT</label>
              <textarea
                rows={4}
                placeholder="Tell us about your application..."
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                disabled={isSubmitting}
                className="mt-2 w-full bg-transparent border-b border-white/10 focus:border-[var(--gold)] outline-none py-3 text-white placeholder:text-white/30 transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 bg-[var(--gold)] text-[var(--ink)] py-4 rounded-full font-medium inline-flex items-center justify-center gap-2 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Sending..." : "Send Enquiry"} <ArrowUpRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, ...p }: any) {
  return (
    <div>
      <label className="text-xs font-num tracking-widest text-white/50">{label.toUpperCase()}</label>
      <input {...p} className="mt-2 w-full bg-transparent border-b border-white/10 focus:border-[var(--gold)] outline-none py-3 text-white placeholder:text-white/30 transition-colors" />
    </div>
  );
}

/* ------------------------------- FINAL CTA ------------------------------- */
function FinalCTA() {
  return (
    <section className="relative py-40 px-5 overflow-hidden">
      <div className="absolute inset-0">
        <img src={fac1} alt="" className="w-full h-full object-cover opacity-30" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--ink)] via-[var(--ink)]/80 to-[var(--ink)]" />
      </div>
      <div className="relative mx-auto max-w-5xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="font-display font-bold text-[clamp(2.5rem,7vw,6rem)] leading-[0.95]"
        >
          Ready to upgrade your<br /><span className="text-gradient-gold italic">packaging process?</span>
        </motion.h2>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <MagneticButton href="#contact" primary>Request Quote</MagneticButton>
          <MagneticButton href="tel:+919121292306">Call Expert</MagneticButton>
          <MagneticButton href="#products">Get Brochure</MagneticButton>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- FOOTER ------------------------------- */
function Footer() {
  return (
    <footer className="relative border-t border-white/10 px-5 pt-20 pb-10 bg-[var(--ink)]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />
      <div className="mx-auto max-w-7xl">
        <div className="grid md:grid-cols-12 gap-10 pb-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <img src={logoVJ} alt="VJ" className="h-10 w-10" />
              <div>
                <div className="font-section text-xl tracking-[0.18em]">VJ STRAPPING</div>
                <div className="font-num text-[10px] tracking-[0.3em] text-[var(--gold)] mt-1">SYSTEMS · EST 2004</div>
              </div>
            </div>
            <p className="mt-6 text-white/55 max-w-sm text-sm leading-relaxed">
              Engineering high-performance strapping machines and industrial packaging solutions for modern industries since 2004.
            </p>
            <form className="mt-8 flex glass rounded-full p-1.5 max-w-sm">
              <input placeholder="Enter your email" className="bg-transparent flex-1 px-4 outline-none text-sm placeholder:text-white/30" />
              <button type="button" className="bg-[var(--gold)] text-[var(--ink)] px-5 py-2.5 rounded-full text-sm font-medium">Subscribe</button>
            </form>
          </div>
          <FooterCol
            title="Products"
            links={[
              { label: "Strapping Machines", href: "#products" },
              { label: "Carton Sealers", href: "#products" },
              { label: "PP Strapping Rolls", href: "#products" },
              { label: "BOPP Tapes", href: "#products" },
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              { label: "About", href: "#about" },
              { label: "Quality", href: "#quality" },
              { label: "Industries", href: "#industries" },
              { label: "Careers", href: "#contact" },
            ]}
          />
          <FooterCol
            title="Contact"
            links={[
              { label: "Sales", href: "#contact" },
              { label: "Support", href: "#contact" },
              { label: "WhatsApp", href: "https://wa.me/919121292306", external: true },
              { label: "Brochure", href: "#contact" },
            ]}
          />
        </div>
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-4 text-xs text-white/40">
          <div>© {new Date().getFullYear()} VJ Strapping Systems. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
function FooterCol({ title, links }: { title: string; links: { label: string; href: string; external?: boolean }[] }) {
  return (
    <div className="md:col-span-2">
      <div className="font-num text-xs tracking-widest text-white/40 mb-4">{title.toUpperCase()}</div>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noopener noreferrer" : undefined}
              className="text-sm text-white/70 hover:text-[var(--gold)] transition-colors"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------- SHARED ------------------------------- */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-3 mb-6">
      <span className="w-8 h-px bg-[var(--gold)]" />
      <span className="font-num text-[10px] tracking-[0.4em] text-[var(--gold)] uppercase">{children}</span>
    </div>
  );
}
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display font-bold leading-[0.95] text-[clamp(2.25rem,5.5vw,5rem)] text-white">{children}</h2>
  );
}

/* ------------------------------- STICKY MOBILE ACTIONS ------------------------------- */
function StickyMobile() {
  return (
    <div className="fixed bottom-4 inset-x-4 z-30 md:hidden flex gap-3">
      <a href="#contact" className="flex-1 bg-[var(--gold)] text-[var(--ink)] py-3 rounded-full text-center font-medium text-sm">Get Quote</a>
      <a href="https://wa.me/919121292306" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center"><MessageCircle className="w-5 h-5 text-white" /></a>
    </div>
  );
}

/* ------------------------------- PAGE ------------------------------- */
function Home() {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="bg-[var(--ink)] text-white min-h-screen">
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      <CursorGlow />
      <Nav />
      <main>
        <Hero />
        <TrustBar />
        <About />
        <WhyUs />
        <Products />
        <Industries />
        <Quality />
        <Stats />
        <Testimonials />
        <FAQ />
        <Contact />
        <FinalCTA />
      </main>
      <Footer />
      <StickyMobile />
    </div>
  );
}
