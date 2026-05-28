import { access, mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import type { StorageProvider } from "@/lib/storage";
import { normalizeAssessmentResult } from "@/lib/result-normalizer";
import { AssessmentResult } from "@/lib/types";

export class LocalFileStorageProvider implements StorageProvider {
  private readonly resultsDir = path.join(process.cwd(), "data", "results");

  private async ensureResultsDir() {
    await mkdir(this.resultsDir, { recursive: true });
  }

  private resolveResultPath(fileName: string) {
    const root = path.resolve(this.resultsDir);
    const fullPath = path.resolve(root, fileName);
    const relative = path.relative(root, fullPath);

    if (relative.startsWith("..") || path.isAbsolute(relative)) {
      throw new Error("Invalid result path.");
    }

    return fullPath;
  }

  private async findResultPath(id: string) {
    await this.ensureResultsDir();

    let directPath: string;
    try {
      directPath = this.resolveResultPath(`${id}.json`);
    } catch {
      return null;
    }

    try {
      await access(directPath);
      return directPath;
    } catch {
      const files = await readdir(this.resultsDir);
      for (const fileName of files.filter((file) => file.endsWith(".json"))) {
        const fullPath = this.resolveResultPath(fileName);
        const content = await readFile(fullPath, "utf8");
        const result = normalizeAssessmentResult(JSON.parse(content) as AssessmentResult);

        if (result.id === id) {
          return fullPath;
        }
      }
    }

    return null;
  }

  async saveResult(fileName: string, data: AssessmentResult): Promise<void> {
    await this.ensureResultsDir();
    const fullPath = this.resolveResultPath(fileName);
    await writeFile(fullPath, JSON.stringify(data, null, 2), "utf8");
  }

  async listResults(): Promise<AssessmentResult[]> {
    await this.ensureResultsDir();
    const files = await readdir(this.resultsDir);
    const results = await Promise.all(
      files
        .filter((fileName) => fileName.endsWith(".json"))
        .map(async (fileName) => {
          const content = await readFile(this.resolveResultPath(fileName), "utf8");
          return normalizeAssessmentResult(JSON.parse(content) as AssessmentResult);
        })
    );

    return results.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getResult(id: string): Promise<AssessmentResult | null> {
    const resultPath = await this.findResultPath(id);

    if (!resultPath) {
      return null;
    }

    const content = await readFile(resultPath, "utf8");
    return normalizeAssessmentResult(JSON.parse(content) as AssessmentResult);
  }

  async archiveResult(id: string, archived: boolean): Promise<AssessmentResult | null> {
    const resultPath = await this.findResultPath(id);

    if (!resultPath) {
      return null;
    }

    const content = await readFile(resultPath, "utf8");
    const current = normalizeAssessmentResult(JSON.parse(content) as AssessmentResult);
    const updated: AssessmentResult = {
      ...current,
      status: archived ? "archived" : "active",
      archivedAt: archived ? new Date().toISOString() : undefined,
      archivedBy: archived ? "admin" : undefined
    };

    await writeFile(resultPath, JSON.stringify(updated, null, 2), "utf8");
    return updated;
  }

  async deleteResult(id: string): Promise<boolean> {
    const resultPath = await this.findResultPath(id);

    if (!resultPath) {
      return false;
    }

    await unlink(resultPath);
    return true;
  }
}
