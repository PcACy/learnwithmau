#!/usr/bin/env python3
"""
Hanzi Arcade – lokale Audio-Pipeline via edge-tts.

Generiert für alle Einträge in src/data/hsk1.json:
  1. Wort-Audio:        public/audio/hsk1/<id>.mp3        (Text = Hanzi)
  2. Silben-Audio:      public/audio/syllables/<plain><tone>.mp3
     (isolierte Pinyin-Silben mit Ton für den Ear-Trainer)

Aufruf (venv empfohlen):
  python3 -m venv /tmp/tts-venv && /tmp/tts-venv/bin/pip install edge-tts
  /tmp/tts-venv/bin/python scripts/generate-audio.py [--force] [--dry-run] [--no-update-json]
                                                     [--voice zh-CN-XiaoxiaoNeural]

Vorhandene Dateien werden übersprungen (--force erzwingt Neu-Generierung).
Mit JSON-Update werden die audioPath-Felder in hsk1.json auf die generierten
Wortdateien gesetzt (nur wenn die Datei tatsächlich existiert).
"""

from __future__ import annotations

import argparse
import asyncio
import json
import sys
from pathlib import Path

import edge_tts

REPO_ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = REPO_ROOT / "src" / "data" / "hsk1.json"
AUDIO_DIR = REPO_ROOT / "public" / "audio"
WORD_DIR = AUDIO_DIR / "hsk1"
SYLL_DIR = AUDIO_DIR / "syllables"

DEFAULT_VOICE = "zh-CN-XiaoxiaoNeural"
LEARNER_RATE = "-10%"  # etwas langsamer für Lernende
CONCURRENCY = 4
MAX_RETRIES = 3


def collect_jobs(items: list[dict]) -> list[dict]:
    """Baut die Liste aller Synthese-Jobs (Wörter + eindeutige Silben)."""
    jobs: list[dict] = []
    seen_syllables: set[tuple[str, int]] = set()

    for item in items:
        jobs.append(
            {
                "text": item["hanzi"],
                "out": WORD_DIR / f"{item['id']}.mp3",
                "kind": "word",
                "item_id": item["id"],
            }
        )
        for syllable in item["syllables"]:
            key = (syllable["plain"], syllable["tone"])
            if key in seen_syllables:
                continue
            seen_syllables.add(key)
            jobs.append(
                {
                    "text": syllable["marked"],
                    "out": SYLL_DIR / f"{syllable['plain']}{syllable['tone']}.mp3",
                    "kind": "syllable",
                    "item_id": item["id"],
                }
            )
    return jobs


async def synthesize(
    job: dict,
    voice: str,
    force: bool,
    semaphore: asyncio.Semaphore,
) -> tuple[dict, str | None]:
    """Führt einen Synthese-Job aus. Rückgabe: (job, Fehlermeldung|None)."""
    out: Path = job["out"]
    if out.exists() and not force:
        return job, None

    async with semaphore:
        for attempt in range(1, MAX_RETRIES + 1):
            try:
                out.parent.mkdir(parents=True, exist_ok=True)
                communicate = edge_tts.Communicate(job["text"], voice, rate=LEARNER_RATE)
                await communicate.save(str(out))
                return job, None
            except Exception as exc:  # noqa: BLE001 – Netzwerk-/Bing-Fehler breit fangen
                if attempt == MAX_RETRIES:
                    return job, f"{type(exc).__name__}: {exc}"
                await asyncio.sleep(2 * attempt)
    return job, "unerreichbar"


async def run(force: bool, dry_run: bool, voice: str) -> int:
    items = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    jobs = collect_jobs(items)

    pending = [job for job in jobs if force or not job["out"].exists()]
    print(f"{len(items)} Vokabeln · {len(jobs)} Dateien gesamt · {len(pending)} zu generieren")

    if dry_run:
        for job in pending[:20]:
            print(f"  [{job['kind']}] {job['text']!r} -> {job['out'].relative_to(REPO_ROOT)}")
        if len(pending) > 20:
            print(f"  … und {len(pending) - 20} weitere")
        return 0

    semaphore = asyncio.Semaphore(CONCURRENCY)
    results = await asyncio.gather(*(synthesize(job, voice, force, semaphore) for job in pending))

    failures = [(job, error) for job, error in results if error is not None]
    generated = len(results) - len(failures)
    skipped = len(jobs) - len(pending)

    print(f"Fertig: {generated} neu · {skipped} bereits vorhanden · {len(failures)} fehlgeschlagen")
    for job, error in failures:
        rel = job["out"].relative_to(REPO_ROOT)
        print(f"  FEHLER {rel}: {error}")

    return 1 if failures else 0


def update_json() -> int:
    """Setzt audioPath für Einträge, deren Wort-MP3 existiert."""
    items = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    updated = 0
    for item in items:
        target = WORD_DIR / f"{item['id']}.mp3"
        if target.exists():
            item["audioPath"] = f"/audio/hsk1/{item['id']}.mp3"
            updated += 1
        else:
            item["audioPath"] = None

    DATA_FILE.write_text(
        json.dumps(items, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"hsk1.json aktualisiert: {updated}/{len(items)} audioPath-Einträge gesetzt")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Generiert HSK-1-Audio via edge-tts.")
    parser.add_argument("--force", action="store_true", help="vorhandene Dateien neu generieren")
    parser.add_argument("--dry-run", action="store_true", help="nur anzeigen, was passieren würde")
    parser.add_argument("--no-update-json", action="store_true", help="hsk1.json nicht anfassen")
    parser.add_argument("--voice", default=DEFAULT_VOICE, help=f"Stimme (Standard: {DEFAULT_VOICE})")
    args = parser.parse_args()

    exit_code = asyncio.run(run(args.force, args.dry_run, args.voice))
    if not args.no_update_json:
        update_json()
    return exit_code


if __name__ == "__main__":
    sys.exit(main())
