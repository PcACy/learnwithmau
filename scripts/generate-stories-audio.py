#!/usr/bin/env python3
import asyncio
import json
from pathlib import Path
import edge_tts

REPO_ROOT = Path(__file__).resolve().parents[1]
STORIES_FILE = REPO_ROOT / "src" / "data" / "stories.json"
AUDIO_DIR = REPO_ROOT / "public" / "audio" / "stories"

VOICE = "zh-CN-XiaoxiaoNeural"
RATE = "-10%"

async def generate():
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    with open(STORIES_FILE, "r", encoding="utf-8") as f:
        stories = json.load(f)

    for story in stories:
        print(f"Generating audio for story: {story['id']} - {story['title']}")
        
        # 1. Sentences
        full_text_parts = []
        for sentence in story["sentences"]:
            text = sentence["hanzi"]
            full_text_parts.append(text)
            sentence_out = AUDIO_DIR / f"{sentence['id']}.mp3"
            if not sentence_out.exists():
                print(f"  Sentence {sentence['id']}: {text}")
                comm = edge_tts.Communicate(text, VOICE, rate=RATE)
                await comm.save(str(sentence_out))
        
        # 2. Full story
        full_out = AUDIO_DIR / f"{story['id']}-full.mp3"
        if not full_out.exists():
            full_text = " ".join(full_text_parts)
            print(f"  Full story {story['id']}: {full_text}")
            comm = edge_tts.Communicate(full_text, VOICE, rate=RATE)
            await comm.save(str(full_out))

    print("All story audio files generated successfully!")

if __name__ == "__main__":
    asyncio.run(generate())
