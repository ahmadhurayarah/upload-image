import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, image, tags } = body;

    if (!title || !description || !image || !tags) {
      return new NextResponse(
        "Title, description, image, and tags are required",
        {
          status: 400,
        }
      );
    }

    const blog = await prismadb.blog.create({
      data: {
        title,
        description,
        image,
        tags,
      },
    });

    return NextResponse.json(blog);
  } catch (error) {
    console.error("[BLOG_POST]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const blogs = await prismadb.blog.findMany();
    return NextResponse.json(blogs);
  } catch (error) {
    console.error("[BLOG_GET]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
