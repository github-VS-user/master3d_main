"use client"

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
    >
      Print / Save as PDF
    </button>
  )
}
