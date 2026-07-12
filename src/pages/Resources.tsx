import { Link } from "react-router-dom";
import { useDocumentTitle } from "@/lib/use-document-title";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { BookOpen, FileDown, Video, Lightbulb } from "lucide-react";

const posts = [
  { tag: "Career", title: "How to write a medical CV recruiters actually read", read: "6 min read" },
  { tag: "Marketing", title: "Local SEO playbook for clinics in 2026", read: "9 min read" },
  { tag: "AI", title: "Where AI chatbots fit in patient communication", read: "7 min read" },
  { tag: "Branding", title: "Personal branding for doctors: a starter guide", read: "5 min read" },
  { tag: "Case Study", title: "How NovaCare doubled bookings in 90 days", read: "4 min read" },
  { tag: "Recruitment", title: "Hiring nurses in a competitive market", read: "8 min read" },
];

export default function ResourcesPage() {
  useDocumentTitle("Resources — GrowDoctor");
  return (
    <SiteLayout>
      <PageHero eyebrow="Resources" title="Knowledge to grow your career and your practice." subtitle="Blogs, guides, case studies, downloads and webinars — all free." />
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: BookOpen, label: "Blog" },
              { icon: Lightbulb, label: "Career Tips" },
              { icon: FileDown, label: "Downloads" },
              { icon: Video, label: "Webinars" },
            ].map((c) => (
              <div key={c.label} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-secondary">
                  <c.icon className="h-5 w-5" />
                </div>
                <span className="font-semibold text-primary">{c.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <article key={p.title} className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:border-secondary hover:shadow-md">
                <span className="inline-flex w-fit rounded-full bg-accent px-3 py-1 text-xs font-semibold text-secondary">{p.tag}</span>
                <h3 className="mt-4 flex-1 text-lg font-semibold text-primary group-hover:text-secondary">{p.title}</h3>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{p.read}</span>
                  <Link to="/resources" className="font-semibold text-secondary hover:underline">Read →</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}