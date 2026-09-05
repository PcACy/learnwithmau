#!/usr/bin/env python3
import asyncio
import json
from pathlib import Path
import edge_tts

REPO_ROOT = Path(__file__).resolve().parents[1]
GRAMMAR_FILE = REPO_ROOT / "src" / "data" / "grammar.json"
AUDIO_DIR = REPO_ROOT / "public" / "audio" / "grammar"

VOICE = "zh-CN-XiaoxiaoNeural"
RATE = "-10%"

async def generate():
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    with open(GRAMMAR_FILE, "r", encoding="utf-8") as f:
        lessons = json.load(f)

    total = 0
    for lesson in lessons:
        for ex in lesson.get("examples", []):
            audio_url = ex.get("audioUrl")
            if not audio_url:
                continue
            filename = Path(audio_url).name
            out_file = AUDIO_DIR / filename
            if not out_file.exists():
                text = ex["hanzi"]
                print(f"Generating {filename}: {text}")
                comm = edge_tts.Communicate(text, VOICE, rate=RATE)
                await comm.save(str(out_file))
            total += 1

    print(f"All {total} grammar audio files generated successfully!")

if __name__ == "__main__":
    asyncio.run(generate())
