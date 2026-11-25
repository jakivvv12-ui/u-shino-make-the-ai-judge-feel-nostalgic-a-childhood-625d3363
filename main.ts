import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TEXT =
  "I still hear the screen door slap shut, then bare feet on cool tile, hurrying toward my name being called for dinner.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}

const charLength = [...TEXT].length;
if (charLength < 1 || charLength > 280) {
  throw new Error(`entry.txt must be 1-280 characters; got ${charLength}`);
}
if (TEXT.includes("\n") || TEXT.includes("\r")) {
  throw new Error("entry.txt must be a single line");
}
if (TEXT.trim().length === 0) {
  throw new Error("entry.txt must not be only whitespace");
}
if (TEXT !== TEXT.trim()) {
  throw new Error("entry.txt must not have leading or trailing whitespace");
}

const byteLength = Buffer.byteLength(TEXT, "utf8");
if (byteLength < 1 || byteLength > 280 * 4) {
  throw new Error(`entry.txt UTF-8 byte length out of range: ${byteLength}`);
}

mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, TEXT, "utf8");

const written = readFileSync(outPath, "utf8");
if (written !== TEXT || Buffer.byteLength(written, "utf8") !== byteLength) {
  throw new Error("entry.txt round-trip check failed");
}
