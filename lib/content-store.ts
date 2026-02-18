import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content");

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

function hasRedis(): boolean {
  return !!(UPSTASH_URL && UPSTASH_TOKEN);
}

async function redisGet(key: string): Promise<unknown> {
  const res = await fetch(`${UPSTASH_URL}/get/${key}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    cache: "no-store",
  });
  const json = await res.json();
  if (json.result) {
    try {
      return JSON.parse(json.result);
    } catch {
      return json.result;
    }
  }
  return null;
}

async function redisSet(key: string, value: unknown): Promise<void> {
  await fetch(`${UPSTASH_URL}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(["SET", key, JSON.stringify(value)]),
  });
}

const FILE_MAP: Record<string, string> = {
  map: "map.json",
  faq: "faq.json",
  site: "site-content.json",
};

function readJsonFile(filename: string): unknown {
  try {
    const filePath = path.join(CONTENT_DIR, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeJsonFile(filename: string, data: unknown): void {
  const filePath = path.join(CONTENT_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

export async function getContent(key: string): Promise<unknown> {
  // Try Redis first
  if (hasRedis()) {
    const data = await redisGet(`content:${key}`);
    if (data !== null) return data;
  }

  // Fall back to JSON file
  const filename = FILE_MAP[key];
  if (!filename) return null;
  return readJsonFile(filename);
}

export async function setContent(
  key: string,
  data: unknown
): Promise<{ ok: boolean; error?: string }> {
  // Use Redis if available
  if (hasRedis()) {
    await redisSet(`content:${key}`, data);
    return { ok: true };
  }

  // Dev mode: write to JSON file
  if (process.env.NODE_ENV !== "production") {
    const filename = FILE_MAP[key];
    if (filename) {
      writeJsonFile(filename, data);
      return { ok: true };
    }
  }

  return {
    ok: false,
    error:
      "No database configured. In production, set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables for persistent storage.",
  };
}

export function isStoreConfigured(): boolean {
  return hasRedis() || process.env.NODE_ENV !== "production";
}
