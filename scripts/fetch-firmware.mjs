import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const repo = "crossxtch/yomu-se";
const names = {
  x3: ["yomu-x3.bin", "crossxtch-x3.bin"],
  x4: ["yomu-x4.bin", "crossxtch-x4.bin"],
};

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "lazahata",
};

const releaseRes = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, { headers });
if (!releaseRes.ok) {
  throw new Error(`GitHub releases: ${releaseRes.status}`);
}
const release = await releaseRes.json();
const outDir = path.join("public", "firmware");
await mkdir(outDir, { recursive: true });

const devices = {};
for (const [id, wanted] of Object.entries(names)) {
  const asset = release.assets?.find((item) => wanted.includes(item.name));
  if (!asset?.browser_download_url) {
    throw new Error(`${release.tag_name} has no ${wanted[0]}`);
  }
  const name = asset.name;
  const binRes = await fetch(asset.browser_download_url, { headers, redirect: "follow" });
  if (!binRes.ok) throw new Error(`${name}: ${binRes.status}`);
  const bytes = Buffer.from(await binRes.arrayBuffer());
  if (bytes[0] !== 0xe9) throw new Error(`${name} is not an ESP32 image`);
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  await writeFile(path.join(outDir, name), bytes);
  devices[id] = { file: name, size: bytes.length, sha256 };
  console.log(`${name} ${release.tag_name} ${bytes.length} ${sha256}`);
}

await writeFile(
  path.join(outDir, "manifest.json"),
  JSON.stringify(
    {
      version: release.tag_name,
      repo: `https://github.com/${repo}`,
      devices,
    },
    null,
    2,
  ) + "\n",
);
