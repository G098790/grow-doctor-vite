import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { Target, Eye, Heart } from "lucide-react";
import { useDocumentTitle } from "@/lib/use-document-title";

export default function AboutPage() {
  useDocumentTitle("About — GrowDoctor");
  return (
    <SiteLayout>
      <PageHero
        eyebrow="About"
        title="A digital growth ecosystem built for the people who care for the world."
        subtitle="GrowDoctor is a Defenceminia Technologies initiative — combining branding, marketing, recruitment, technology and AI into one workspace for healthcare professionals."
      />
      <section className="bg-background">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8">
          {[
            { icon: Target, title: "Mission", body: "Empower every healthcare professional with the digital tools and growth systems to thrive." },
            { icon: Eye, title: "Vision", body: "Become the world's leading digital growth ecosystem for healthcare professionals." },
            { icon: Heart, title: "Core Values", body: "Trust, craftsmanship, healthcare-first thinking and measurable outcomes." },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border border-border bg-card p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-secondary">
                <c.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-primary">{c.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-secondary">Founder Story</p>
            <h2 className="mt-3 text-3xl font-bold text-primary sm:text-4xl">Why we started GrowDoctor.</h2>
            <p className="mt-5 text-muted-foreground">
              We saw brilliant clinicians struggle to translate clinical excellence into digital presence — losing patients, careers and influence to peers with better marketing. GrowDoctor exists to bridge that gap with healthcare-specific expertise, not generic agency work.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-secondary">Our Process</p>
            <ol className="mt-5 space-y-4 text-sm text-foreground">
              <li><span className="font-semibold text-primary">1. Discovery</span> — Free consultation to understand your goals.</li>
              <li><span className="font-semibold text-primary">2. Plan</span> — A tailored roadmap with timelines and pricing.</li>
              <li><span className="font-semibold text-primary">3. Build</span> — Specialists deliver inside your client workspace.</li>
              <li><span className="font-semibold text-primary">4. Grow</span> — Ongoing retainers, analytics and optimization.</li>
            </ol>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}