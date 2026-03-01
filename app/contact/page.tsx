import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Mail, Phone, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact | Master 3D",
  description: "Get in touch with Master 3D — email, phone, and opening hours.",
}

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-muted">
        {/* Hero */}
        <div className="bg-card border-b border-border">
          <div className="mx-auto max-w-4xl px-4 py-14 text-center lg:px-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Get in touch</p>
            <h1 className="font-heading text-4xl font-bold text-balance text-foreground sm:text-5xl">
              We are here to help
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              Questions about an order, a product, or a custom print? Reach out and we will get back to you as soon as possible within our available hours.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {/* Email */}
            <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Email</p>
                <a
                  href="mailto:contact.master3d@gmail.com"
                  className="mt-1.5 block text-base font-semibold text-foreground hover:text-primary transition-colors break-all"
                >
                  contact.master3d@gmail.com
                </a>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Send us a message any time. We reply during our available hours.
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Phone</p>
                <a
                  href="tel:+41782514768"
                  className="mt-1.5 block text-base font-semibold text-foreground hover:text-primary transition-colors"
                >
                  +41 78 251 47 68
                </a>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Call us directly. We answer during our opening hours below.
                </p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm sm:col-span-2 lg:col-span-1">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Opening Hours</p>
                <div className="mt-3 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground">Weekdays</p>
                      <p className="text-xs text-muted-foreground">Monday – Friday</p>
                    </div>
                    <span className="shrink-0 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      15:00 – 20:00 CET
                    </span>
                  </div>
                  <div className="border-t border-border" />
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground">Weekend</p>
                      <p className="text-xs text-muted-foreground">Friday – Sunday</p>
                    </div>
                    <span className="shrink-0 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      10:00 – 21:00 CET
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom note */}
          <div className="mt-8 rounded-xl border border-border bg-card px-6 py-5">
            <p className="text-sm leading-relaxed text-muted-foreground text-center">
              Outside of opening hours? Send us an{" "}
              <a href="mailto:contact.master3d@gmail.com" className="font-medium text-primary hover:underline">
                email
              </a>{" "}
              and we will reply as soon as we are back. We typically respond within a few hours.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
