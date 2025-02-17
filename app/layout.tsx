import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prompt generator",
  description: "Welcome to prompt generator app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
