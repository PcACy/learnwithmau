#!/usr/bin/env python3
import asyncio
import json
import re
from pathlib import Path
import edge_tts

REPO_ROOT = Path(__file__).resolve().parents[1]
VOCAB_DETAILS_FILE = REPO_ROOT / "src" / "data" / "vocabDetails.ts"
GRAMMAR_PITFALLS_FILE = REPO_ROOT / "src" / "data" / "grammarPitfalls.ts"
EXAMPLES_AUDIO_DIR = REPO_ROOT / "public" / "audio" / "examples"
GRAMMAR_AUDIO_DIR = REPO_ROOT / "public" / "audio" / "grammar"

VOICE = "zh-CN-XiaoxiaoNeural"
RATE = "-5%"

async def generate_file(sem: asyncio.Semaphore, text: str, out_path: Path):
    if out_path.exists() and out_path.stat().st_size > 1000:
        return
    # Clean up quotes and long dashes for speech synthesis
    tts_text = re.sub(r'[“”"„‟——…]+', ' ', text).replace('/', '，').strip()
    async with sem:
        comm = edge_tts.Communicate(tts_text, VOICE, rate=RATE)
        await comm.save(str(out_path))

async def main():
    EXAMPLES_AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    GRAMMAR_AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    sem = asyncio.Semaphore(10)

    # 1. Process EXAMPLE_SENTENCES_MAP in vocabDetails.ts
    print("Reading vocabDetails.ts...")
    with open(VOCAB_DETAILS_FILE, "r", encoding="utf-8") as f:
        vocab_content = f.read()

    m = re.search(r'(const EXAMPLE_SENTENCES_MAP: Record<string, ExampleSentence\[\]> = )(\{[\s\S]*?\n\};)', vocab_content)
    if not m:
        raise RuntimeError("Could not find EXAMPLE_SENTENCES_MAP in vocabDetails.ts")

    prefix = m.group(1)
    raw_json = m.group(2).rstrip(';').strip()
    sentences_map = json.loads(raw_json)

    tasks = []
    total_examples = 0
    for word_id, sents in sentences_map.items():
        for idx, sent in enumerate(sents):
            total_examples += 1
            audio_path = f"/audio/examples/ex-{word_id}-{idx + 1}.mp3"
            sent["audioPath"] = audio_path
            out_file = REPO_ROOT / f"public{audio_path}"
            tasks.append(generate_file(sem, sent["hanzi"], out_file))

    print(f"Generating audio for {total_examples} example sentences...")
    await asyncio.gather(*tasks)
    print("Example sentences audio generated successfully!")

    # Write back updated vocabDetails.ts with audioPath
    new_json_str = json.dumps(sentences_map, ensure_ascii=False, indent=2)
    new_block = prefix + new_json_str + ";"
    updated_vocab_content = vocab_content[:m.start()] + new_block + vocab_content[m.end():]

    with open(VOCAB_DETAILS_FILE, "w", encoding="utf-8") as f:
        f.write(updated_vocab_content)
    print("Updated vocabDetails.ts with audioPath fields.")

    # 2. Process GRAMMAR_PITFALLS
    print("Reading grammarPitfalls.ts...")
    with open(GRAMMAR_PITFALLS_FILE, "r", encoding="utf-8") as f:
        pitfalls_content = f.read()

    # Update interface to include audioUrl
    if "audioUrl?: string;" not in pitfalls_content:
        pitfalls_content = pitfalls_content.replace(
            "    german: string;\n  }[];",
            "    german: string;\n    audioUrl?: string;\n  }[];"
        )

    # Find and update each comparisonPoint
    pitfall_tasks = []
    counter = 0

    def replace_point(match):
        nonlocal counter
        counter += 1
        block = match.group(0)
        ex_m = re.search(r"example:\s*'([^']+)'", block)
        if not ex_m:
            return block
        ex_text = ex_m.group(1)
        audio_url = f"/audio/grammar/pitfall-{counter:02d}.mp3"
        out_file = REPO_ROOT / f"public{audio_url}"
        pitfall_tasks.append(generate_file(sem, ex_text, out_file))

        if "audioUrl:" not in block:
            # Insert audioUrl right after german: '...'
            block = re.sub(
                r"(german:\s*'[^']+',?)",
                r"\1\n        audioUrl: '" + audio_url + "',",
                block
            )
        return block

    point_pattern = re.compile(r"\{\s*situation:[^}]+?german:\s*'[^']+',?\s*\}", re.DOTALL)
    updated_pitfalls = point_pattern.sub(replace_point, pitfalls_content)

    print(f"Generating audio for {len(pitfall_tasks)} pitfall examples...")
    await asyncio.gather(*pitfall_tasks)
    print("Pitfall examples audio generated successfully!")

    with open(GRAMMAR_PITFALLS_FILE, "w", encoding="utf-8") as f:
        f.write(updated_pitfalls)
    print("Updated grammarPitfalls.ts with audioUrl fields.")

if __name__ == "__main__":
    asyncio.run(main())
