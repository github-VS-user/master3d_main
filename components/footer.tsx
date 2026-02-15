import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-foreground text-card">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-10 md:flex-row md:justify-between lg:px-8">
        <div className="flex flex-col items-center gap-1 md:items-start">
          <span className="font-heading text-lg font-bold tracking-tight">Master 3D</span>
          <span className="text-sm text-card/60">Swiss 3D Printing</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-card/60">
          <Link href="/" className="transition-colors hover:text-card">Home</Link>
          <Link href="/catalog" className="transition-colors hover:text-card">Catalog</Link>
          <a href="https://track.master3d.net" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-card">Track Order</a>
        </div>
        <p className="text-xs text-card/40">
          {"Master 3D. All rights reserved."}
        </p>
      </div>
    </footer>
  )
}
