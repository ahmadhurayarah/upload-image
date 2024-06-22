import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between">
        <Link href="/" className="text-white ">
          Home
        </Link>
        <Link href="/upload" className="text-white ">
          Upload
        </Link>
        <Link href="/images" className="text-white ">
          Show Images
        </Link>
      </div>
    </nav>
  );
}
