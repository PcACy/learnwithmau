#!/usr/bin/env python3
import asyncio
from pathlib import Path
import edge_tts

REPO_ROOT = Path(__file__).resolve().parents[1]
AUDIO_DIR = REPO_ROOT / "public" / "audio" / "hsk1"

VOICE = "zh-CN-XiaoxiaoNeural"
RATE = "-10%"

EXAM_AUDIO_SAMPLES = [
    ("hsk1-31.mp3", "猫"),
    ("hsk1-32.mp3", "米饭"),
    ("hsk1-33.mp3", "看书"),
    ("hsk1-34.mp3", "喝水"),
    ("hsk1-35.mp3", "火车站"),
    ("hsk1-36.mp3", "电脑"),
    ("hsk1-37.mp3", "漂亮"),
    ("hsk1-38.mp3", "医生"),
    ("hsk1-39.mp3", "三点十分"),
    ("hsk1-40.mp3", "商店"),
    ("hsk1-41.mp3", "你叫什么名字？"),
    ("hsk1-42.mp3", "你好吗？"),
    ("hsk1-43.mp3", "这个多少钱？"),
    ("hsk1-44.mp3", "他在学校。"),
    ("hsk1-45.mp3", "今天天气怎么样？"),
]

async def generate():
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    total = 0
    for filename, text in EXAM_AUDIO_SAMPLES:
        out_file = AUDIO_DIR / filename
        if not out_file.exists():
            print(f"Generating {filename}: {text}")
            comm = edge_tts.Communicate(text, VOICE, rate=RATE)
            await comm.save(str(out_file))
        total += 1

    print(f"All {total} exam audio files generated successfully!")

if __name__ == "__main__":
    asyncio.run(generate())
