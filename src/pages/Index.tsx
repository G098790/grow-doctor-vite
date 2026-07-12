import { Link } from "react-router-dom";
import {
  ArrowRight,
  Briefcase,
  Sparkles,
  Building2,
  Cpu,
  Bot,
  Users,
  Star,
  CheckCircle2,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import logo from "@/assets/grow.jpeg";
import heroImg from "@/assets/hero-doctor.jpg";
import { useDocumentTitle } from "@/lib/use-document-title";

const whyCards = [
  { icon: Briefcase, title: "Career Development", desc: "Resume, LinkedIn, interview prep and placements built for clinicians." },
  { icon: Sparkles, title: "Professional Branding", desc: "Portfolio sites, photos and reputation management that elevate your name." },
  { icon: Building2, title: "Clinic Growth", desc: "Marketing, SEO and patient acquisition systems that fill your calendar." },
  { icon: Cpu, title: "Digital Transformation", desc: "Websites, appointment systems and CRM tailored for healthcare." },
  { icon: Bot, title: "Healthcare AI", desc: "AI chatbots, automation and practice intelligence built for medicine." },
  { icon: Users, title: "Recruitment", desc: "Hire clinicians faster or find your next role in trusted hospitals." },
];

const stats = [
  { v: "10,000+", l: "Healthcare Professionals" },
  { v: "1,200+", l: "Successful Placements" },
  { v: "500+", l: "Clinics Digitized" },
  { v: "25+", l: "Countries Served" },
  { v: "4.9/5", l: "Customer Satisfaction" },
];

const featured = [
  { title: "Career Accelerator", price: "₹4,999", desc: "Resume, LinkedIn and interview coaching by medical career experts." },
  { title: "Personal Branding", price: "₹14,999", desc: "Portfolio website, professional photos and reputation system." },
  { title: "Medical Website", price: "₹24,999", desc: "Conversion-optimized clinic website with appointments built in." },
  { title: "Clinic Marketing", price: "₹19,999/mo", desc: "SEO, Google Business and paid ads for steady patient flow." },
  { title: "Recruitment", price: "Custom", desc: "Hire vetted doctors, nurses and allied healthcare staff." },
  { title: "Healthcare AI", price: "₹29,999", desc: "AI chatbots, automation and analytics for modern practices." },
];

export default function Index() {
  useDocumentTitle("GrowDoctor — Digital Growth Platform for Healthcare Professionals");
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-accent/40 via-background to-background">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-secondary">
              <CheckCircle2 className="h-3.5 w-3.5" /> Trusted by clinicians in 25+ countries
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight text-primary sm:text-5xl lg:text-6xl">
              Empowering Healthcare Professionals to Build Credibility, Grow Careers & Scale Practices.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              GrowDoctor is the one-stop digital growth platform for doctors, clinics and healthcare organizations — branding, marketing, recruitment and AI in a single workspace.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/services" className="inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground transition hover:opacity-90">
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/services" className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-primary transition hover:bg-muted">
                Explore Services
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground">
                Book Free Consultation
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-tr from-secondary/30 to-primary/20 blur-2xl" />
            <img
              src={heroImg}
              alt="Healthcare professional using digital tools"
              width={1536}
              height={1024}
              className="aspect-[4/3] w-full rounded-2xl object-cover shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="border-y border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-secondary">Why GrowDoctor</p>
            <h2 className="mt-3 text-3xl font-bold text-primary sm:text-4xl">A complete growth stack, made for medicine.</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyCards.map((c) => (
              <div key={c.title} className="group rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-secondary hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-secondary">
                  <c.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-primary">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-5">
            {stats.map((s) => (
              <div key={s.l}>
                <div className="text-3xl font-bold text-secondary sm:text-4xl">{s.v}</div>
                <div className="mt-2 text-xs uppercase tracking-wider text-primary-foreground/70">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured services */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-secondary">Featured Services</p>
              <h2 className="mt-3 text-3xl font-bold text-primary sm:text-4xl">Buy a one-off or subscribe to a retainer.</h2>
            </div>
            <Link to="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:underline">
              See all services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((s) => (
              <div key={s.title} className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:border-secondary hover:shadow-md">
                <h3 className="text-lg font-semibold text-primary">{s.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{s.desc}</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Starting at <span className="font-bold text-primary">{s.price}</span></span>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link to="/services" className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-center text-xs font-semibold text-primary hover:bg-muted">Learn More</Link>
                  <Link to="/contact" className="flex-1 rounded-lg bg-secondary px-4 py-2 text-center text-xs font-semibold text-secondary-foreground hover:opacity-90">Buy Now</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-secondary">Testimonials</p>
          <h2 className="mt-3 text-3xl font-bold text-primary sm:text-4xl">What doctors say about GrowDoctor.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { q: "My clinic appointments doubled in 90 days. The team understands healthcare marketing deeply.", n: "Dr. Anika Rao", r: "Dentist, Bengaluru" },
              { q: "From CV to interviews, GrowDoctor placed me in a leading hospital within 6 weeks.", n: "Dr. Mehul Shah", r: "MBBS, Mumbai" },
              { q: "Our website, branding and AI chatbot — everything ships in one workspace. Game changer.", n: "Dr. Sara Khan", r: "Founder, NovaCare Clinic" },
            ].map((t) => (
              <figure key={t.n} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex gap-1 text-secondary">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <blockquote className="mt-4 text-sm text-foreground">"{t.q}"</blockquote>
                <figcaption className="mt-5 text-sm">
                  <div className="font-semibold text-primary">{t.n}</div>
                  <div className="text-muted-foreground">{t.r}</div>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-14 overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-primary/80 p-10 text-primary-foreground sm:p-14">
            <div className="grid items-center gap-6 lg:grid-cols-3">
              <h3 className="text-2xl font-bold sm:text-3xl lg:col-span-2">Ready to grow? Book a free strategy session with our healthcare experts.</h3>
              <div className="lg:text-right">
                <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground hover:opacity-90">
                  Book Free Consultation <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
