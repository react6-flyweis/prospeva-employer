import ConnectionGate from "./connection-gate";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prospeva Employer Portal",
  description: "Dual-currency payroll, workforce, funding and compliance operations for Liberian employers.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased"><ConnectionGate />{children}</body>
    </html>
  );
}
