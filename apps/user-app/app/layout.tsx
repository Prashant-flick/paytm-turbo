import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { AppbarClient } from "../components/AppbarClient";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wallet",
  description: "Crazy wallet app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <body className={inter.className}>
          <AppbarClient />
          {children}
        </body>
      </Providers>
    </html>
  );
}
