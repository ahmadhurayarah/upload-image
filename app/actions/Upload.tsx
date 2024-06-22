"use server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { extname } from "path";
import sharp from "sharp";

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: process.env.AWS_REGION!,
});

export async function Upload(image: FormData) {
  try {
    const file: File | null = image.get("file") as unknown as File;
    if (!file) {
      throw new Error("No file uploaded");
    }

    const extension = extname(file.name);
    const key = `${Date.now()}${extension}`;

    const bucketName = process.env.AWS_BUCKET_NAME;
    if (!bucketName) {
      throw new Error(
        "Bucket name is not defined in the environment variables"
      );
    }

    // Preprocess image with sharp
    const processedImageBuffer = await sharp(
      Buffer.from(await file.arrayBuffer())
    )
      .resize({ width: 800 }) // Resize the image to 800px width
      .jpeg({ quality: 100 }) // Adjust image quality to 80%
      .toBuffer();

    const params = {
      Bucket: bucketName,
      Key: key,
      Body: processedImageBuffer,
      ContentType: "image/jpeg",
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    console.log(`File uploaded to S3: ${key}`);
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  } catch (e) {
    console.error(e);
    throw new Error("File upload failed");
  }
}
