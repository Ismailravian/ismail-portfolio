import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Navbar } from "@/components/ui/Navbar";

export const metadata: Metadata = {
  title: "Ismail — Portfolio",
  description: "Software engineer building immersive 3D web experiences.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Drop-in Google Fonts. Remove these two lines if you want pure system fonts. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
        />
      </head>
      <body className="min-h-screen relative">
        <ThemeProvider>
          <Navbar />
          <main className="relative">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
