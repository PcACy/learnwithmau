#!/usr/bin/env python3
import asyncio
import json
from pathlib import Path
import edge_tts

REPO_ROOT = Path(__file__).resolve().parents[1]
SENTENCES_FILE = REPO_ROOT / "src" / "data" / "sentences.json"
AUDIO_DIR = REPO_ROOT / "public" / "audio" / "sentences"

VOICE = "zh-CN-XiaoxiaoNeural"
RATE = "-10%"

async def generate():
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    with open(SENTENCES_FILE, "r", encoding="utf-8") as f:
        sentences = json.load(f)

    for sent in sentences:
        audio_url = sent.get("audioUrl")
        if not audio_url:
            continue
        filename = Path(audio_url).name
        out_file = AUDIO_DIR / filename
        if not out_file.exists():
            text = "".join(sent["tokens"])
            print(f"Generating {filename}: {text}")
            comm = edge_tts.Communicate(text, VOICE, rate=RATE)
            await comm.save(str(out_file))

    print("All 20 sentence audio files generated successfully!")

if __name__ == "__main__":
    asyncio.run(generate())
