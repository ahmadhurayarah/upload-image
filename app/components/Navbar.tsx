import Link from "next/link";

export default function Navbar() {
  return (
    <div className="p-4 flex items-center justify-center ">
      <div className="w-[14rem] flex justify-center items-center gap-x-6 border border-black">
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
