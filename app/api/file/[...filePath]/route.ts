import { Storage } from "@google-cloud/storage";

const storage = new Storage();

type Props = {
  params: Promise<{
    filePath: string[];
  }>;
};

export async function GET(_request: Request, { params }: Props) {
  const { filePath } = await params;
  const path = filePath.join("/");

  try {
    const data = await storage
      .bucket(process.env.GCS_BUCKET_NAME)
      .file(path)
      .download();
    return new Response(
      data[0] /*, {
      headers: {
        "content-type": response.ContentType,
        "content-length": response.ContentLength.toString(),
      },
    }*/,
    );
  } catch (err) {
    console.error(err);
    return new Response(null, { status: 404 });
  }
}
