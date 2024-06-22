import Link from "next/link";

export default function Navbar() {
  return (
    <div className="mt-4 flex items-center justify-center ">
      <div className="w-[20rem] flex justify-center items-center gap-x-6 border border-black">
        <Link href="/" className="text-black border-black-[1px] rounded">
          Upload
        </Link>
        <Link href="/images" className="text-black ">
          Show Images
        </Link>
        <Link href="/blog" className="text-black ">
          Blog
        </Link>
      </div>
    </div>
  );
}
