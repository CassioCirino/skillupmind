import { AssessmentResult } from "@/lib/types";
import { LocalFileStorageProvider } from "@/lib/storage-local";
import { VercelBlobStorageProvider } from "@/lib/storage-vercel-blob";

export interface StorageProvider {
  saveResult(fileName: string, data: AssessmentResult): Promise<void>;
  listResults(): Promise<AssessmentResult[]>;
  getResult(id: string): Promise<AssessmentResult | null>;
  archiveResult(id: string, archived: boolean): Promise<AssessmentResult | null>;
  deleteResult(id: string): Promise<boolean>;
}

export function getStorageProvider(): StorageProvider {
  if (process.env.NODE_ENV === "production" && process.env.BLOB_READ_WRITE_TOKEN) {
    return new VercelBlobStorageProvider();
  }

  return new LocalFileStorageProvider();
}
