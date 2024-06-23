"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className="mt-4 flex items-center justify-center">
      <div className="w-[20rem] flex justify-center items-center gap-x-6 border border-black rounded-sm">
        <Link
          href="/"
          className={`${
            pathname === "/"
              ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-500  to-blue-500"
              : "text-gray-600"
          }`}
        >
          Upload
        </Link>
        <Link
          href="/images"
          className={`${
            pathname === "/images"
              ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-500  to-blue-500"
              : "text-gray-600"
          }`}
        >
          Show All Images
        </Link>
        <Link
          href="/blog"
          className={`${
            pathname === "/blog"
              ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500"
              : "text-gray-600"
          }`}
        >
          Blog Crud
        </Link>
      </div>
    </div>
  );
}
