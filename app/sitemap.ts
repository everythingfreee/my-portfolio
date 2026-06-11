import { getPublishedBlogs, getPublishedProjects } from "../lib/db-queries";

const SITE_URL = "https://sanaullahshaheer.vercel.app";

function urlEntry(loc: string, lastmod?: string) {
  return `<url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`;
}

export async function GET() {
  try {
    const blogs = await getPublishedBlogs();
    const projects = await getPublishedProjects();

    const staticPaths = ["", "about", "blog", "projects", "contact"];

    const urls: string[] = [];

    for (const p of staticPaths) {
      urls.push(`${SITE_URL}/${p}`.replace(/([^:]\/)\/+/g, "$1"));
    }

    for (const b of blogs) {
      const loc = `${SITE_URL}/blog/${b.slug}`;
      urls.push(loc);
    }

    for (const p of projects) {
      const loc = `${SITE_URL}/projects/${p.id}`;
      urls.push(loc);
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map((u) => urlEntry(u)).join("\n  ")}
</urlset>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=0, s-maxage=3600",
      },
    });
  } catch (err) {
    console.error("Error building sitemap:", err);
    return new Response("", { status: 500 });
  }
}
