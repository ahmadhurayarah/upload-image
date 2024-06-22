// actions/deleteImage.js
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: process.env.AWS_REGION!,
});

export async function deleteImage(key: string) {
  try {
    const bucketName = process.env.AWS_BUCKET_NAME;
    if (!bucketName) {
      throw new Error(
        "Bucket name is not defined in the environment variables"
      );
    }

    const params = {
      Bucket: bucketName,
      Key: key,
    };

    const command = new DeleteObjectCommand(params);
    await s3.send(command);

    console.log(`File deleted from S3: ${key}`);
  } catch (e) {
    console.error(e);
    throw new Error("File deletion failed");
  }
}
