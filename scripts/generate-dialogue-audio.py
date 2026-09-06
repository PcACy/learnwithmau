#!/usr/bin/env python3
"""
Generiert Edge-TTS Audio-Dateien für alle 6 HSK-1-Alltagsdialoge.
Weibliche NPCs nutzen 'zh-CN-XiaoxiaoNeural', männliche 'zh-CN-YunxiNeural'.
"""

import asyncio
import json
from pathlib import Path
import edge_tts

REPO_ROOT = Path(__file__).resolve().parents[1]
DIALOGUES_FILE = REPO_ROOT / "src" / "data" / "dialogues.json"
AUDIO_DIR = REPO_ROOT / "public" / "audio" / "dialogues"

VOICE_FEMALE = "zh-CN-XiaoxiaoNeural"
VOICE_MALE = "zh-CN-YunxiNeural"
RATE = "-10%"


async def generate():
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    with open(DIALOGUES_FILE, "r", encoding="utf-8") as f:
        scenarios = json.load(f)

    tasks = []
    seen_files = set()

    for sc in scenarios:
        nodes = sc.get("nodes", {})
        for node_id, node in nodes.items():
            gender = node.get("gender", "female")
            npc_voice = VOICE_FEMALE if gender == "female" else VOICE_MALE

            # 1. NPC Audio
            npc_url = node.get("audioUrl")
            if npc_url:
                filename = Path(npc_url).name
                out_file = AUDIO_DIR / filename
                if filename not in seen_files and not out_file.exists():
                    text = node["hanzi"]
                    tasks.append((filename, text, npc_voice, out_file))
                    seen_files.add(filename)

            # 2. Choice Audios
            choices = node.get("choices", [])
            for ch in choices:
                ch_url = ch.get("audioUrl")
                if ch_url:
                    ch_filename = Path(ch_url).name
                    ch_out_file = AUDIO_DIR / ch_filename
                    if ch_filename not in seen_files and not ch_out_file.exists():
                        ch_text = ch["hanzi"]
                        # Lerner-Antworten mit Xiaoxiao (klar und sanft)
                        tasks.append((ch_filename, ch_text, VOICE_FEMALE, ch_out_file))
                        seen_files.add(ch_filename)

    print(f"To generate: {len(tasks)} audio files...")
    for idx, (filename, text, voice, out_file) in enumerate(tasks, 1):
        print(f"[{idx}/{len(tasks)}] Generating {filename} ({voice}): {text}")
        comm = edge_tts.Communicate(text, voice, rate=RATE)
        await comm.save(str(out_file))

    print("All dialogue audio files generated or already up-to-date!")


if __name__ == "__main__":
    asyncio.run(generate())
