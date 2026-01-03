import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import env from "@/env";

const internalS3 = new S3Client({
  region: env.S3_REGION,
  endpoint: env.S3_ENDPOINT, 
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

const signerS3 = new S3Client({
  region: env.S3_REGION,
  endpoint: env.S3_PUBLIC_ENDPOINT,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});
 
const BUCKET_NAME = env.S3_BUCKET;

export async function uploadToS3(
  key: string,
  body: Buffer | Uint8Array | Blob,
  contentType: string
) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
  });
  return internalS3.send(command);
}

export async function deleteFromS3(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });
  return internalS3.send(command);
}

export async function getPresignedUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });
  return getSignedUrl(signerS3, command, { expiresIn: 3600 });
}
