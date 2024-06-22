import { NextResponse } from "next/server";
import { readdir } from "fs/promises";
import { join } from "path";

export async function GET(req: Request) {
  const uploadDir = join(process.cwd(), "public/uploads");
  try {
    const files = await readdir(uploadDir);
    return NextResponse.json(files);
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 });
  }
}
