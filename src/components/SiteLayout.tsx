import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { Whatsapp } from "./whatsapp";
export function SiteLayout({ children }: { children: ReactNode }) {
  return (
  <div className="flex min-h-screen flex-col bg-background">
    <SiteHeader />
    <main className="flex-1">
      {children}
      </main>
      <SiteFooter />
      <Whatsapp />
</div>
  );
}

export function PageHero({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <section className="border-b border-border bg-gradient-to-br from-accent/40 via-background to-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-widest text-secondary">{eyebrow}</p>
        )}
        <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight text-primary sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </section>
  );
}