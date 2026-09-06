#!/usr/bin/env python3
import asyncio
import json
import re
from pathlib import Path
import edge_tts

REPO_ROOT = Path(__file__).resolve().parents[1]
VOCAB_DETAILS_FILE = REPO_ROOT / "src" / "data" / "vocabDetails.ts"
COLLOCATIONS_AUDIO_DIR = REPO_ROOT / "public" / "audio" / "collocations"

VOICE = "zh-CN-XiaoxiaoNeural"
RATE = "-5%"

async def generate_file(sem: asyncio.Semaphore, text: str, out_path: Path):
    if out_path.exists() and out_path.stat().st_size > 1000:
        return
    async with sem:
        comm = edge_tts.Communicate(text, VOICE, rate=RATE)
        await comm.save(str(out_path))

async def main():
    COLLOCATIONS_AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    sem = asyncio.Semaphore(12)

    print("Reading vocabDetails.ts for COLLOCATIONS_MAP...")
    with open(VOCAB_DETAILS_FILE, "r", encoding="utf-8") as f:
        vocab_content = f.read()

    m = re.search(r'(export const COLLOCATIONS_MAP: Record<string, Collocation\[\]> = )(\{[\s\S]*?\n\};)', vocab_content)
    if not m:
        raise RuntimeError("Could not find COLLOCATIONS_MAP in vocabDetails.ts")

    prefix = m.group(1)
    raw_json = m.group(2).rstrip(';').strip()
    collocations_map = json.loads(raw_json)

    tasks = []
    total = 0
    for word_id, cols in collocations_map.items():
        for idx, col in enumerate(cols):
            total += 1
            audio_path = f"/audio/collocations/col-{word_id}-{idx + 1}.mp3"
            col["audioPath"] = audio_path
            out_file = REPO_ROOT / f"public{audio_path}"
            tasks.append(generate_file(sem, col["hanzi"], out_file))

    print(f"Generating audio for {total} collocations...")
    await asyncio.gather(*tasks)
    print("Collocations audio generated successfully!")

    # Write back updated vocabDetails.ts
    new_json_str = json.dumps(collocations_map, ensure_ascii=False, indent=2)
    new_block = prefix + new_json_str + ";"
    updated_vocab_content = vocab_content[:m.start()] + new_block + vocab_content[m.end():]

    with open(VOCAB_DETAILS_FILE, "w", encoding="utf-8") as f:
        f.write(updated_vocab_content)
    print("Updated vocabDetails.ts with collocation audioPath fields.")

if __name__ == "__main__":
    asyncio.run(main())
