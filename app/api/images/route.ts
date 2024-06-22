import { NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: process.env.AWS_REGION!,
});

export async function GET(req: Request) {
  const bucketName = process.env.AWS_BUCKET_NAME;
  if (!bucketName) {
    return new NextResponse(
      "Bucket name is not defined in the environment variables",
      { status: 500 }
    );
  }

  try {
    const command = new ListObjectsV2Command({ Bucket: bucketName });
    const { Contents } = await s3.send(command);
    const files = Contents?.map((item) => item.Key) || [];

    return NextResponse.json(files);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
