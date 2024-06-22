import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { extname } from "path";
import { Buffer } from "buffer"; // Ensure Buffer is imported for compatibility

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: process.env.AWS_REGION!,
});

export async function uploadImage(file: File): Promise<string> {
  const extension = extname(file.name);
  const key = `${uuidv4()}${extension}`;

  const bucketName = process.env.AWS_BUCKET_NAME!;
  if (!bucketName) {
    throw new Error("Bucket name is not defined in the environment variables");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadParams = {
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: file.type,
  };

  try {
    await s3.send(new PutObjectCommand(uploadParams));
    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error("Error uploading file: ", error);
    throw new Error("Error uploading file");
  }
}
