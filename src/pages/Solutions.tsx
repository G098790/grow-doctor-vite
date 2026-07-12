import { Link } from "react-router-dom";
import { useDocumentTitle } from "@/lib/use-document-title";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { GraduationCap, Stethoscope, Building2, Hospital, Briefcase, Rocket } from "lucide-react";

const personas = [
  { icon: GraduationCap, name: "For Students", bundles: ["Career roadmap", "Resume basics", "Internship pipeline"] },
  { icon: Briefcase, name: "For Fresh Graduates", bundles: ["CV + LinkedIn", "Interview prep", "Job placement"] },
  { icon: Stethoscope, name: "For Practicing Doctors", bundles: ["Personal branding", "Portfolio website", "Reputation system"] },
  { icon: Hospital, name: "For Hospitals", bundles: ["Recruitment ops", "Brand identity", "Patient acquisition"] },
  { icon: Building2, name: "For Clinics", bundles: ["Clinic website", "Google Business", "Local SEO & ads"] },
  { icon: Rocket, name: "For Healthcare Startups", bundles: ["Product website", "CRM & automation", "AI integrations"] },
];

export default function SolutionsPage() {
  useDocumentTitle("Solutions — GrowDoctor");
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Solutions"
        title="Tailored bundles for every stage of your healthcare journey."
        subtitle="Pick the archetype that fits you best — we'll recommend the right combination of services."
      />
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {personas.map((p) => (
              <div key={p.name} className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:border-secondary hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-secondary">
                  <p.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-primary">{p.name}</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {p.bundles.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-secondary" /> {b}
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className="mt-6 inline-flex text-sm font-semibold text-secondary hover:underline">
                  Get this bundle →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}