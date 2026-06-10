import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Sanaullah Shaheer",
    default: "Sanaullah Shaheer | Full-Stack Portfolio",
  },
  description: "Personal portfolio and blog of Sanaullah Shaheer, showcasing full-stack projects, articles, and skillset.",
  metadataBase: new URL("https://sanaullahshaheer.work.gd"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Sanaullah Shaheer | Full-Stack Portfolio",
    description: "Personal portfolio and blog of Sanaullah Shaheer, showcasing full-stack projects, articles, and skillset.",
    url: "/",
    siteName: "Sanaullah Shaheer Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sanaullah Shaheer Portfolio Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sanaullah Shaheer | Full-Stack Portfolio",
    description: "Personal portfolio and blog of Sanaullah Shaheer, showcasing full-stack projects, articles, and skillset.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[color:var(--background)] text-[color:var(--foreground)] transition-colors duration-300">
        <AuthProvider>
          <div className="w-full bg-gradient-to-br from-[color:var(--color-primary)]/8 to-[color:var(--color-primary-2)]/6 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <Navbar />
            </div>
          </div>

          <main className="flex-1 flex flex-col pt-20 sm:pt-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="py-8">
                {children}
              </div>
            </div>
          </main>

          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

