import "@/styles/globals.css";
import { Metadata, Viewport } from "next";

import { Providers } from "@/app/providers";

import { siteConfig } from "@/config/site";
import ThemeSwitcher from "@/components/themeSwitcher";
import { NextIntlClientProvider } from "next-intl";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body className="min-h-screen text-foreground bg-background font-sans antialiased">
        <NextIntlClientProvider>
          <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
            {children}
            <span className="fixed bottom-4 right-4 z-50">
              <ThemeSwitcher />
            </span>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
