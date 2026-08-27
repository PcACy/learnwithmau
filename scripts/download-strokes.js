import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const vocabFile = path.join(repoRoot, 'src', 'data', 'hsk1.json');
const outDir = path.join(repoRoot, 'public', 'data', 'strokes');

const vocab = JSON.parse(fs.readFileSync(vocabFile, 'utf8'));
const chars = new Set();
for (const item of vocab) {
  for (const c of Array.from(item.hanzi)) {
    chars.add(c);
  }
}

fs.mkdirSync(outDir, { recursive: true });

async function main() {
  console.log(`Checking stroke data for ${chars.size} unique characters...`);
  let downloaded = 0;
  let cached = 0;
  let failed = 0;

  for (const char of chars) {
    const targetFile = path.join(outDir, `${char}.json`);
    if (fs.existsSync(targetFile)) {
      cached++;
      continue;
    }

    const encoded = encodeURIComponent(char);
    const url = `https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/${encoded}.json`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      fs.writeFileSync(targetFile, JSON.stringify(json));
      downloaded++;
    } catch (err) {
      console.error(`Failed for character ${char}:`, err.message);
      failed++;
    }
  }

  console.log(`Fertig: ${cached} bereits vorhanden · ${downloaded} neu heruntergeladen · ${failed} fehlgeschlagen`);
}

main();
