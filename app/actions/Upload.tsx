"use server";

import { writeFile, mkdir } from "fs/promises";
import { join, extname } from "path";

export async function Upload(image: FormData) {
  try {
    const file: File | null = image.get("file") as unknown as File;
    if (!file) {
      throw new Error("No file uploaded");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const extension = extname(file.name);
    const uploadDir = join(process.cwd(), "public/uploads");
    const filePath = join(uploadDir, `${Date.now()}${extension}`);

    await mkdir(uploadDir, { recursive: true });
    await writeFile(filePath, buffer);

    return { success: true };
  } catch (e) {
    throw new Error("File upload failed");
  }
}
