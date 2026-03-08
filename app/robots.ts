import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://master3d.net"

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/invoice", "/order-success", "/my-orders"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
