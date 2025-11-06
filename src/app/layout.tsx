import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Neds - Next to go",
  description: "Real-time to the next races to go.",
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
