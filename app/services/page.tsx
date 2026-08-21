"use client"

import { SiteShell } from "@/components/voice-room/site-shell"
import { HeroLine, Reveal, Stagger, easeLuxury } from "@/components/voice-room/motion"
import { useInquiry } from "@/contexts/inquiry-context"
import { motion } from "framer-motion"

const processSteps = [
  {
    number: "01",
    title: "Casting",
    description:
      "We shortlist and match voices based on your script, tone, and audience.",
  },
  {
    number: "02",
    title: "Direction",
    description:
      "We guide performance to ensure the right tone, pacing, and delivery for your project.",
  },
  {
    number: "03",
    title: "Recording",
    description:
      "Sessions take place at AMP Studios or remotely, fully directed and engineered.",
  },
  {
    number: "04",
    title: "Editing & Delivery",
    description:
      "We compile, clean, and mix recordings, delivering ready-to-use audio.",
  },
]

const services = [
  {
    title: "Voiceover Recording",
    subtitle: "Professional in-studio recording at AMP Studios.",
    description:
      "High-quality recording sessions with experienced engineers, built for speed, clarity, and performance.",
  },
  {
    title: "Voice Casting",
    subtitle: "Curated voice casting tailored to your project.",
    description:
      "Access a curated roster of African voice talent across languages, tones, and styles.",
  },
  {
    title: "Voice Direction",
    subtitle: "Get the performance right.",
    description:
      "We guide talent to deliver the right tone, pacing, and emotion for your brand or story.",
  },
  {
    title: "ADR Recording",
    subtitle: "Dialogue recording for film and post-production.",
    description:
      "Precision dialogue replacement for film, television, and digital content.",
  },
  {
    title: "IVR Production",
    subtitle: "Voice and production for phone systems and automated experiences.",
    description:
      "Professional voice systems for brands, banks, and telecoms — clear, consistent, on-brand.",
  },
  {
    title: "Editing & Mixing",
    subtitle: "Polished, production-ready audio.",
    description:
      "We compile the best takes, clean, edit, and mix your recordings to final delivery standards.",
  },
  {
    title: "Remote Sessions",
    subtitle: "Record from anywhere, with full control.",
    description: "Join live sessions remotely and direct talent in real time.",
  },
  {
    title: "Dubbing & Localisation",
    subtitle: "Voiceover adaptation for different languages and markets.",
    description: "Reach new audiences with professionally adapted voice content.",
  },
  {
    title: "AI Voice Licensing",
    subtitle: "Secure, brand-safe voice solutions for scalable content.",
    description:
      "We license and manage voice talent for AI-generated and synthetic voice use, giving brands access to consistent, high-quality voice at scale — with full rights and approvals in place.",
  },
]

const whyUs = [
  "Curated roster of professional voice talent",
  "In-studio and remote recording capabilities",
  "Fast turnaround for production timelines",
  "End-to-end delivery, handled in one place",
]

export default function ServicesPage() {
  return (
    <SiteShell>
      <ServicesContent />
    </SiteShell>
  )
}

function ServicesContent() {
  const { openInquiry } = useInquiry()

  return (
    <main>
      <section className="border-b-2 border-[var(--c4-black)] px-5 py-14 md:px-10 md:py-20">
        <div className="mx-auto max-w-[1440px]">
          <motion.p
            className="c4-label text-[var(--c4-muted)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeLuxury }}
          >
            Services
          </motion.p>
          <h1 className="display mt-3 max-w-3xl min-w-0 text-[clamp(1.65rem,7.6vw,3rem)] font-extrabold uppercase leading-[1.05] md:text-6xl">
            <HeroLine delay={0.1}>End-to-end</HeroLine>
            <HeroLine delay={0.16}>voice</HeroLine>
            <HeroLine delay={0.22}>production</HeroLine>
          </h1>
          <motion.p
            className="mt-5 max-w-xl text-lg text-[var(--c4-muted)]"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.2, ease: easeLuxury }}
          >
            Built for production teams who need reliable, high-quality voice work —
            from casting through delivery.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-col gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: easeLuxury }}
          >
            <button
              type="button"
              onClick={openInquiry}
              className="c4-block-black px-8 py-4 text-[11px] tracking-[0.2em] uppercase transition-transform hover:-translate-y-0.5"
            >
              Request Talent
            </button>
            <a
              href="https://www.ampafrica.com/book"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-[var(--c4-black)] bg-transparent px-8 py-4 text-center text-[11px] tracking-[0.2em] uppercase transition-colors hover:bg-[var(--c4-black)] hover:text-[var(--c4-yellow)]"
            >
              Book a Session
            </a>
          </motion.div>
        </div>
      </section>

      <section className="border-b-2 border-[var(--c4-black)] bg-[var(--c4-yellow)] px-5 py-16 md:px-10">
        <div className="mx-auto max-w-[1440px]">
          <Reveal>
            <p className="c4-label">Our Process</p>
            <h2 className="display mt-3 text-[clamp(1.65rem,6.5vw,1.875rem)] font-extrabold uppercase leading-[1.05] md:text-4xl">
              From brief to delivery
            </h2>
          </Reveal>
          <Stagger className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
            {processSteps.map((step) => (
              <div key={step.number} className="border-t-2 border-[var(--c4-black)] pt-5">
                <span className="display text-4xl font-extrabold text-[var(--c4-black)]/25">
                  {step.number}
                </span>
                <h3 className="display mt-2 text-xl font-bold uppercase">{step.title}</h3>
                <p className="mt-3 text-sm text-[var(--c4-black)]/70">{step.description}</p>
              </div>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="border-b-2 border-[var(--c4-black)] px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 gap-[2px] border-2 border-[var(--c4-black)] bg-[var(--c4-black)] md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <Reveal
                key={service.title}
                delay={i * 0.04}
                variant="fade"
                as="article"
                className="flex h-full flex-col bg-[var(--c4-white)] p-6 md:p-8"
              >
                <h2 className="display text-[clamp(1.15rem,4.5vw,1.25rem)] font-bold uppercase leading-[1.05] md:text-2xl">
                  {service.title}
                </h2>
                <p className="mt-2 text-sm font-medium">{service.subtitle}</p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--c4-muted)]">
                  {service.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-10">
        <div className="mx-auto max-w-[1440px]">
          <Reveal>
            <p className="c4-label text-[var(--c4-muted)]">Why Us</p>
            <h2 className="display mt-3 text-[clamp(1.65rem,6.5vw,1.875rem)] font-extrabold uppercase leading-[1.05]">
              Why The Voice Room
            </h2>
          </Reveal>
          <Stagger className="mt-10 space-y-0" stagger={0.08}>
            {whyUs.map((reason, index) => (
              <div
                key={reason}
                className="flex items-start gap-6 border-b-2 border-[var(--c4-black)] py-5 last:border-0"
              >
                <span className="c4-label text-[var(--c4-muted)]">0{index + 1}</span>
                <p className="text-lg">{reason}</p>
              </div>
            ))}
          </Stagger>
        </div>
      </section>

      <Reveal as="section" className="c4-block-black px-5 py-16 md:px-10 md:py-20">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="display text-[clamp(1.65rem,6.5vw,1.875rem)] font-extrabold uppercase leading-[1.05] md:text-4xl">
              Need a voice for your next project?
            </h2>
            <p className="mt-3 text-white/60">
              Tell us what you&apos;re looking for — we&apos;ll handle the rest.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={openInquiry}
              className="border-2 border-white px-8 py-4 text-[11px] tracking-[0.2em] uppercase hover:bg-white hover:text-[var(--c4-black)]"
            >
              Request Talent
            </button>
            <a
              href="https://www.ampafrica.com/book"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[var(--c4-yellow)] px-8 py-4 text-center text-[11px] tracking-[0.2em] uppercase text-[var(--c4-black)]"
            >
              Book a Session
            </a>
          </div>
        </div>
      </Reveal>
    </main>
  )
}
