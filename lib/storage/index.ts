import "server-only";
import { mkdirSync, writeFileSync, readFileSync, existsSync, unlinkSync, rmSync } from "fs";
import { join, dirname } from "path";
import { env } from "../config/env";

// StorageService: local filesystem for MVP; swap in an S3-compatible driver
// (env STORAGE_DRIVER=s3 + STORAGE_* vars) without touching callers.
export interface StorageService {
  put(key: string, data: Buffer, contentType: string): Promise<void>;
  get(key: string): Promise<Buffer | null>;
  delete(key: string): Promise<void>;
  deleteDir(prefix: string): Promise<void>;
}

const ROOT = join(process.cwd(), "storage");

class LocalStorage implements StorageService {
  private path(key: string) {
    // Prevent path traversal from keys.
    const safe = key.replace(/[^a-zA-Z0-9._/-]/g, "_");
    return join(ROOT, safe);
  }
  async put(key: string, data: Buffer) {
    const p = this.path(key);
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, data);
  }
  async get(key: string) {
    const p = this.path(key);
    return existsSync(p) ? readFileSync(p) : null;
  }
  async delete(key: string) {
    const p = this.path(key);
    if (existsSync(p)) unlinkSync(p);
  }
  // Recursively remove a prefix folder (used by project cascade delete).
  async deleteDir(prefix: string) {
    const p = this.path(prefix);
    if (existsSync(p)) rmSync(p, { recursive: true, force: true });
  }
}

export const storage: StorageService = new LocalStorage();
export const storageConfigured = env.storage.driver === "local" || Boolean(process.env.STORAGE_ENDPOINT);
