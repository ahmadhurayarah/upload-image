import Link from "next/link";

export default function Navbar() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-[10rem] flex justify-between ">
        <Link href="/" className="text-black border-black-[1px] rounded">
          Upload
        </Link>
        <Link href="/images" className="text-black ">
          Show Images
        </Link>
      </div>
    </div>
  );
}
