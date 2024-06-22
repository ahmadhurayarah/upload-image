import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BlogProvider } from "@/app/contexts/BlogContext"; // Adjusted import path

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Upload Image",
  description: "Upload Image by server component using Next js 14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BlogProvider>{children}</BlogProvider>
      </body>
    </html>
  );
}
