import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-foreground">
      <div className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-6 px-4 py-12 sm:gap-8 sm:py-16 lg:flex-row lg:gap-12 lg:px-8 lg:py-24">
        {/* Text */}
        <div className="flex flex-1 flex-col items-center gap-4 text-center sm:gap-6 lg:items-start lg:text-left">
          <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary sm:px-4 sm:py-1.5">
            Made in Switzerland
          </span>
          <h1 className="font-heading text-3xl font-bold leading-tight tracking-tight text-card sm:text-4xl md:text-5xl lg:text-6xl">
            <span className="text-balance">Precision 3D Printing for Every Idea</span>
          </h1>
          <p className="max-w-lg text-base leading-relaxed text-card/70 sm:text-lg">
            From custom prototypes to unique designs, Master 3D brings your concepts to life with Swiss-quality 3D printing. Fast delivery across Switzerland.
          </p>
          <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Browse Catalog
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://track.master3d.net"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-card/20 px-6 py-3 text-sm font-semibold text-card transition-colors hover:bg-card/10"
            >
              Track Your Order
            </a>
          </div>
        </div>

        {/* Image */}
        <div className="relative w-full flex-1">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl sm:rounded-2xl">
            <Image
              src="/images/hero-3d-print.jpg"
              alt="3D printer creating a detailed object"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="absolute -bottom-3 -left-3 rounded-lg bg-primary p-3 shadow-lg sm:-bottom-4 sm:-left-4 sm:rounded-xl sm:p-4 lg:block">
            <p className="text-xl font-bold text-primary-foreground sm:text-2xl">100+</p>
            <p className="text-xs font-medium text-primary-foreground/80">Products Printed</p>
          </div>
        </div>
      </div>
    </section>
  )
}
