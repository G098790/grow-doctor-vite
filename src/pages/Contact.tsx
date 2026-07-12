import { useDocumentTitle } from "@/lib/use-document-title";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";
import { useState } from "react";

const API_URL = `${import.meta.env.VITE_API_URL}/contact`;

export default function ContactPage() {
  useDocumentTitle("Contact — GrowDoctor");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    profession: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setSent(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        profession: "",
        message: "",
      });
      setTimeout(() => setSent(false), 3000);
    } catch (error: any) {
      console.error("Contact Error:", error);
      alert(error.message || "Failed to send message.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Contact"
        title="Let's plan your next move."
        subtitle="Send us a message, book a free strategy session, or reach us on WhatsApp."
      />

      <section className="bg-background">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="space-y-4">
            {[
              { icon: Mail, label: "Email", value: "hello@growdoctor.io" },
              { icon: Phone, label: "Phone", value: "+91 90000 00000" },
              {
                icon: MessageCircle,
                label: "WhatsApp",
                value: "Chat with our team",
              },
              {
                icon: MapPin,
                label: "Office",
                value: "Defenceminia Technologies Pvt Ltd",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-4 rounded-xl border p-5"
              >
                <item.icon />
                <div>
                  <p className="font-semibold">{item.label}</p>
                  <p>{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-xl border p-8 lg:col-span-2"
          >
            <h2 className="text-2xl font-bold">Send us a message</h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
              />

              <Field
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
              />

              <Field
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />

              <Field
                label="Profession"
                name="profession"
                value={form.profession}
                onChange={handleChange}
              />
            </div>

            <div className="mt-4">
              <label className="block font-medium">How can we help?</label>

              <textarea
                name="message"
                rows={5}
                required
                value={form.message}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border p-3"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 rounded-lg bg-green-600 px-6 py-3 text-white disabled:opacity-60"
            >
              {submitting ? "Sending..." : sent ? "Message Sent ✓" : "Send Message"}
            </button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <div>
      <label className="block mb-2">{label}</label>

      <input
        type={type}
        name={name}
        value={value}
        required
        onChange={onChange}
        className="w-full rounded-lg border p-3"
      />
    </div>
  );
}
