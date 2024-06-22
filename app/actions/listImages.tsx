"use server";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: process.env.AWS_REGION!,
});

export async function listImages() {
  const bucketName = process.env.AWS_BUCKET_NAME;
  if (!bucketName) {
    throw new Error("Bucket name is not defined in the environment variables");
  }

  const params = {
    Bucket: bucketName,
  };

  try {
    const command = new ListObjectsV2Command(params);
    const data = await s3.send(command);
    return data.Contents?.map((item) => item.Key) || [];
  } catch (e) {
    console.error(e);
    throw new Error("Failed to list images");
  }
}
