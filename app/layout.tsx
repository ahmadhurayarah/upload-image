import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BlogProvider } from "@/app/contexts/BlogContext"; // Adjusted import path
import Navbar from "./components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Upload Image",
  description: "Upload Image by server component using Next.js 14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <BlogProvider>
          <Navbar />
          {children}
        </BlogProvider>
      </body>
    </html>
  );
}
