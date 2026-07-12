import { Link, useNavigate } from "react-router-dom";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { ArrowRight, Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { toast } from "sonner";
import { useDocumentTitle } from "@/lib/use-document-title";

const categories = [
  {
    name: "Career Development",
    items: [
      { id: "resume-cv", title: "Resume & CV", price: "₹2,999", numericPrice: 2999, desc: "ATS-friendly medical CV crafted by recruiters." },
      { id: "linkedin-optimization", title: "LinkedIn Optimization", price: "₹3,499", numericPrice: 3499, desc: "Headline, banner, About and content strategy." },
      { id: "interview-preparation", title: "Interview Preparation", price: "₹4,999", numericPrice: 4999, desc: "Mock interviews with hospital HR leaders." },
    ],
  },
  {
    name: "Personal Branding",
    items: [
      { id: "portfolio-website", title: "Portfolio Website", price: "₹14,999", numericPrice: 14999, desc: "5-page personal site with bookings." },
      { id: "professional-photos", title: "Professional Photos", price: "₹6,999", numericPrice: 6999, desc: "Studio-quality headshots in your city." },
      { id: "reputation-management", title: "Reputation Management", price: "₹9,999/mo", numericPrice: 9999, desc: "Reviews, mentions and SERP cleanup." },
    ],
  },
  {
    name: "Practice Growth",
    items: [
      { id: "clinic-branding", title: "Clinic Branding", price: "₹19,999", numericPrice: 19999, desc: "Logo, identity and print collateral." },
      { id: "google-business-profile", title: "Google Business Profile", price: "₹4,999", numericPrice: 4999, desc: "Setup + first-month optimization." },
      { id: "seo-patient-acquisition", title: "SEO & Patient Acquisition", price: "₹24,999/mo", numericPrice: 24999, desc: "Local SEO and paid ads that fill your calendar." },
    ],
  },
  {
    name: "Technology",
    items: [
      { id: "website-development", title: "Website Development", price: "₹29,999", numericPrice: 29999, desc: "Conversion-tuned clinic websites." },
      { id: "appointment-system", title: "Appointment System", price: "₹14,999", numericPrice: 14999, desc: "Online booking with reminders." },
      { id: "healthcare-crm", title: "Healthcare CRM", price: "₹19,999", numericPrice: 19999, desc: "Leads, follow-ups and retention." },
      { id: "ai-chatbot", title: "AI Chatbot", price: "₹24,999", numericPrice: 24999, desc: "Patient triage and FAQ chatbot." },
      { id: "practice-management", title: "Practice Management", price: "Custom", numericPrice: null, desc: "End-to-end EMR-friendly stack." },
    ],
  },
  {
    name: "Recruitment",
    items: [
      { id: "job-placement", title: "Job Placement", price: "Custom", numericPrice: null, desc: "Curated roles in trusted hospitals." },
      { id: "hiring-solutions", title: "Hiring Solutions", price: "Custom", numericPrice: null, desc: "Vetted clinicians and allied staff." },
      { id: "internship-opportunities", title: "Internship Opportunities", price: "Free", numericPrice: null, desc: "Pipeline programs for students." },
    ],
  },
];

export default function ServicesPage() {
  useDocumentTitle("Services — GrowDoctor");
  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = async (item: { id: string; title: string; numericPrice: number | null }) => {
    if (item.numericPrice === null) {
      navigate("/contact");
      return;
    }
    await addItem({ productId: item.id, name: item.title, price: item.numericPrice });
    toast.success(`${item.title} added to cart`);
  };

  const handleBuyNow = async (item: { id: string; title: string; numericPrice: number | null }) => {
    if (item.numericPrice === null) {
      navigate("/contact");
      return;
    }
    await addItem({ productId: item.id, name: item.title, price: item.numericPrice });
    navigate("/cart");
  };

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Services"
        title="Every service a modern healthcare professional needs."
        subtitle="Browse by category. Each service includes features, timeline, pricing and FAQs — buy individually or subscribe to a monthly retainer."
      />
      <section className="bg-background">
        <div className="mx-auto max-w-7xl space-y-16 px-4 py-16 sm:px-6 lg:px-8">
          {categories.map((cat) => (
            <div key={cat.name}>
              <div className="flex items-center gap-3">
                <span className="h-8 w-1.5 rounded-full bg-secondary" />
                <h2 className="text-2xl font-bold text-primary sm:text-3xl">{cat.name}</h2>
              </div>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {cat.items.map((s) => (
                  <article key={s.title} className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:border-secondary hover:shadow-md">
                    <h3 className="text-lg font-semibold text-primary">{s.title}</h3>
                    <p className="mt-2 flex-1 text-sm text-muted-foreground">{s.desc}</p>
                    <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                      <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-secondary" /> Dedicated specialist</li>
                      <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-secondary" /> Healthcare-specific approach</li>
                      <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-secondary" /> Trackable deliverables</li>
                    </ul>
                    <div className="mt-5 text-sm text-muted-foreground">Starting at <span className="font-bold text-primary">{s.price}</span></div>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleAddToCart(s)}
                        className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-center text-xs font-semibold text-primary hover:bg-muted"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleBuyNow(s)}
                        className="flex-1 rounded-lg bg-secondary px-4 py-2 text-center text-xs font-semibold text-secondary-foreground hover:opacity-90"
                      >
                        Buy Now
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}

          <div className="rounded-3xl bg-gradient-to-r from-primary to-primary/80 p-10 text-primary-foreground sm:p-14">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold sm:text-3xl">Not sure which service fits?</h3>
                <p className="mt-2 text-primary-foreground/80">Get a personalized recommendation in 20 minutes.</p>
              </div>
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground hover:opacity-90">
                Talk to an Expert <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}