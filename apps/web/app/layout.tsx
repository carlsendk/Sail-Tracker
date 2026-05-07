import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  description: "Foundation app for a multi-tenant sailing trip platform.",
  icons: {
    icon: "/favicon.svg",
  },
  title: "Sail Tracker",
};

interface RootLayoutProperties {
  children: ReactNode;
}

/**
 *
 */
export default function RootLayout({ children }: RootLayoutProperties) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
