import { del, get, list, put } from "@vercel/blob";
import { normalizeAssessmentResult } from "@/lib/result-normalizer";
import type { StorageProvider } from "@/lib/storage";
import { AssessmentResult } from "@/lib/types";

const prefix = "results/";

async function readPrivateJson(pathname: string) {
  const response = await get(pathname, { access: "private", useCache: false });

  if (!response || response.statusCode !== 200) {
    return null;
  }

  const content = await new Response(response.stream).text();
  return normalizeAssessmentResult(JSON.parse(content) as AssessmentResult);
}

export class VercelBlobStorageProvider implements StorageProvider {
  async saveResult(fileName: string, data: AssessmentResult): Promise<void> {
    await put(`${prefix}${fileName}`, JSON.stringify(data, null, 2), {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false
    });
  }

  async listResults(): Promise<AssessmentResult[]> {
    const response = await list({ prefix });
    const jsonBlobs = response.blobs.filter((blob) => blob.pathname.endsWith(".json"));
    const results = await Promise.all(
      jsonBlobs.map((blob) => readPrivateJson(blob.pathname))
    );

    return results.filter((result): result is AssessmentResult => Boolean(result)).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getResult(id: string): Promise<AssessmentResult | null> {
    const direct = await readPrivateJson(`${prefix}${id}.json`);

    if (direct) {
      return direct;
    }

    const results = await this.listResults();
    return results.find((result) => result.id === id) ?? null;
  }

  async archiveResult(id: string, archived: boolean): Promise<AssessmentResult | null> {
    const result = await this.getResult(id);

    if (!result) {
      return null;
    }

    const updated: AssessmentResult = {
      ...result,
      status: archived ? "archived" : "active",
      archivedAt: archived ? new Date().toISOString() : undefined,
      archivedBy: archived ? "admin" : undefined
    };

    await this.saveResult(result.fileName, updated);
    return updated;
  }

  async deleteResult(id: string): Promise<boolean> {
    const result = await this.getResult(id);

    if (!result) {
      return false;
    }

    await del(`${prefix}${result.fileName}`);
    return true;
  }
}
