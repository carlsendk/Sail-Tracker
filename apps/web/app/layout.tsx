/** @file Root layout component that wraps all Next.js pages with the HTML shell. */
/* eslint-disable react-refresh/only-export-components -- Next.js layout.tsx must export both the component and metadata */

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
 * Root layout wrapping every page with an HTML/body shell.
 * @param props - Component props.
 * @param props.children - The active page content to render inside the body.
 * @returns The HTML document shell.
 */
const RootLayout = ({ children }: Readonly<RootLayoutProperties>) => {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
};

export default RootLayout;
