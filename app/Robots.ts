const SITE_URL = "https://sanaullahshaheer.vercel.app";

export async function GET() {
  const txt = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin",
    `Sitemap: ${SITE_URL.replace(/\/$/, "")}/sitemap.xml`,
  ].join("\n") + "\n";

  return new Response(txt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
