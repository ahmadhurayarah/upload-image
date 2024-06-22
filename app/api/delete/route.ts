// pages/api/delete.js
import { NextResponse } from "next/server";
import { deleteImage } from "../../actions/deleteImage";

export async function DELETE(req: Request) {
  try {
    const { key } = await req.json();
    if (!key) {
      return new NextResponse("Missing key in request body", { status: 400 });
    }

    await deleteImage(key);
    return new NextResponse("Image deleted successfully", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
