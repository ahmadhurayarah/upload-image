import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { Upload } from "@/app/actions/Upload";

export async function DELETE(
  req: Request,
  { params }: { params: { blogId: string } }
) {
  try {
    const { blogId } = params;
    if (!blogId) {
      return new NextResponse("Blog ID is required", { status: 400 });
    }

    const blog = await prismadb.blog.findUnique({
      where: {
        id: blogId,
      },
    });

    if (!blog) {
      return new NextResponse("Blog not found", { status: 404 });
    }

    const deletedBlog = await prismadb.blog.delete({
      where: {
        id: blogId,
      },
    });

    return NextResponse.json(deletedBlog);
  } catch (error) {
    console.log("[BLOG_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { blogId: string } }
) {
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

    if (!params.blogId) {
      return new NextResponse("Blog ID is required", { status: 400 });
    }

    const imageUrl = await Upload(image);

    const updatedBlog = await prismadb.blog.update({
      where: {
        id: params.blogId,
      },
      data: {
        title,
        description,
        image: imageUrl,
        tags,
      },
    });

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.log("[BLOG_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { blogId: string } }
) {
  try {
    if (!params.blogId) {
      return new NextResponse("Blog ID is required", { status: 400 });
    }

    const blog = await prismadb.blog.findUnique({
      where: {
        id: params.blogId,
      },
    });

    if (!blog) {
      return new NextResponse("Blog not found", { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.log("[BLOG_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
