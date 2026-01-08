import {
  S3Client,
  ListObjectsV2Command,
  CopyObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import env from "@/env";

const s3Client = new S3Client({
  region: env.S3_REGION,
  endpoint: env.S3_ENDPOINT,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

const BUCKET_NAME = env.S3_BUCKET;
const CACHE_CONTROL = "public, max-age=31536000, immutable";

export async function addCacheToAllObjects() {
  let continuationToken: string | undefined;
  let totalProcessed = 0;
  let totalUpdated = 0;

  console.log(`Starting to add cache headers to bucket: ${BUCKET_NAME}`);
  console.log(`Cache-Control: ${CACHE_CONTROL}\n`);

  do {
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      ContinuationToken: continuationToken,
    });

    const response = await s3Client.send(listCommand);
    const objects = response.Contents ?? [];

    for (const obj of objects) {
      if (!obj.Key) continue;

      totalProcessed++;

      try {
        const headCommand = new HeadObjectCommand({
          Bucket: BUCKET_NAME,
          Key: obj.Key,
        });
        const metadata = await s3Client.send(headCommand);

        const copyCommand = new CopyObjectCommand({
          Bucket: BUCKET_NAME,
          Key: obj.Key,
          CopySource: `${BUCKET_NAME}/${obj.Key}`,
          ContentType: metadata.ContentType,
          CacheControl: CACHE_CONTROL,
          MetadataDirective: "REPLACE",
        });

        await s3Client.send(copyCommand);
        totalUpdated++;
        console.log(`Updated: ${obj.Key}`);
      } catch (error) {
        console.error(`Failed to update ${obj.Key}:`, error);
      }
    }

    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  console.log(`\nComplete!`);
  console.log(`Total objects processed: ${totalProcessed}`);
  console.log(`Successfully updated: ${totalUpdated}`);
}

addCacheToAllObjects().catch(console.error);
