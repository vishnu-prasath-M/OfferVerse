import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FloatingContactButton } from "@/components/floating-contact-button";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "OfferVerse – Loot Deals, Every Minute",
  description: "Discover the best loot deals from Amazon & Flipkart, curated and auto-updated by OfferVerse.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable}`}>
        <ThemeProvider>
          <div className="min-h-screen">
            <Navbar />
            {children}
            <FloatingContactButton />
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
