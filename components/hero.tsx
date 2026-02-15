import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-foreground">
      <div className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-8 px-4 py-16 lg:flex-row lg:gap-12 lg:px-8 lg:py-24">
        {/* Text */}
        <div className="flex flex-1 flex-col items-center gap-6 text-center lg:items-start lg:text-left">
          <span className="rounded-full bg-primary/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            Made in Switzerland
          </span>
          <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-card md:text-5xl lg:text-6xl">
            <span className="text-balance">Precision 3D Printing for Every Idea</span>
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-card/70">
            From custom prototypes to unique designs, Master 3D brings your concepts to life with Swiss-quality 3D printing. Fast delivery across Switzerland.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Browse Catalog
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://track.master3d.net"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-card/20 px-6 py-3 text-sm font-semibold text-card transition-colors hover:bg-card/10"
            >
              Track Your Order
            </a>
          </div>
        </div>

        {/* Image */}
        <div className="relative flex-1">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
            <Image
              src="/images/hero-3d-print.jpg"
              alt="3D printer creating a detailed object"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="absolute -bottom-4 -left-4 hidden rounded-xl bg-primary p-4 shadow-lg lg:block">
            <p className="text-2xl font-bold text-primary-foreground">100+</p>
            <p className="text-xs font-medium text-primary-foreground/80">Products Printed</p>
          </div>
        </div>
      </div>
    </section>
  )
}
