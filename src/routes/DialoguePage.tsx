import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  Eye,
  EyeOff,
  Gauge,
  Languages,
  Play,
  RotateCcw,
  Sparkles,
  Star,
  Volume2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import dialoguesData from '../data/dialogues.json';
import type {
  DialogueChoice,
  DialogueNode,
  DialogueScenario,
  DialogueWordToken,
} from '../types/dialogue';
import { playAsset, stopCurrentAudio } from '../lib/audio';
import { db, getCompletedDialogues, putCompletedDialogues } from '../lib/db';
import { useKeyDown } from '../hooks/useKeyDown';
import { DialogueBriefingModal } from '../components/dialogue/DialogueBriefingModal';
import { DialogueMessageBubble } from '../components/dialogue/DialogueMessageBubble';
import { DialogueChoicePanel } from '../components/dialogue/DialogueChoicePanel';
import { DialogueDebriefModal } from '../components/dialogue/DialogueDebriefModal';
import { DialogueTokenPopover } from '../components/dialogue/DialogueTokenPopover';
import { SealBadge } from '../components/ui/SealBadge';
import { useSettingsStore } from '../store/settingsStore';

const SCENARIOS = dialoguesData as unknown as DialogueScenario[];

interface HistoryEntry {
  id: string;
  speaker: 'npc' | 'user';
  speakerName: string;
  speakerAvatar: string;
  hanzi: string;
  pinyin: string;
  german: string;
  tokens: DialogueWordToken[];
  cultureTip?: string;
  audioUrl?: string;
  pointsAwarded?: number;
  feedbackGerman?: string;
}

export function DialoguePage() {
  const navigate = useNavigate();
  const globalAudioSpeed = useSettingsStore((s) => s.audioSpeed);

  // Dialog-Auswahl & Laufzeitstatus
  const [activeScenario, setActiveScenario] = useState<DialogueScenario | null>(null);
  const [currentNode, setCurrentNode] = useState<DialogueNode | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [score, setScore] = useState(0);

  // Modals
  const [briefingScenario, setBriefingScenario] = useState<DialogueScenario | null>(null);
  const [showDebrief, setShowDebrief] = useState(false);

  // Lernhilfen Toggles
  const [showPinyin, setShowPinyin] = useState(true);
  const [showGerman, setShowGerman] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(() => globalAudioSpeed);

  // Glossar Popover & Audio State
  const [activeToken, setActiveToken] = useState<DialogueWordToken | null>(null);
  const [playingAudioUrl, setPlayingAudioUrl] = useState<string | null>(null);

  // Persistenz (Sterne & Highscores)
  const [completedDialogues, setCompletedDialogues] = useState<
    Record<string, { stars: number; bestScore: number; completedAt: string }>
  >({});

  const sessionStartTimeRef = useRef<number>(0);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const debriefTimeoutRef = useRef<number | undefined>(undefined);

  // Lade gespeicherte Dialog-Fortschritte aus IndexedDB
  useEffect(() => {
    let cancelled = false;
    void getCompletedDialogues().then((data) => {
      if (!cancelled && data) {
        setCompletedDialogues(data);
      }
    });
    return () => {
      cancelled = true;
      if (debriefTimeoutRef.current !== undefined) {
        window.clearTimeout(debriefTimeoutRef.current);
      }
      stopCurrentAudio();
    };
  }, []);

  // Automatisches Scrollen zum neuesten Eintrag
  useEffect(() => {
    if (activeScenario && scrollAnchorRef.current) {
      scrollAnchorRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [history, currentNode, activeScenario]);

  // Audio-Wiedergabe-Helfer
  const playAudio = useCallback(
    (url?: string) => {
      if (!url) return;
      stopCurrentAudio();
      setPlayingAudioUrl(url);
      void playAsset(
        url,
        () => {
          setPlayingAudioUrl(null);
        },
        playbackSpeed,
      );
    },
    [playbackSpeed],
  );

  // Szenario starten
  const startScenario = useCallback(
    (sc: DialogueScenario) => {
      setBriefingScenario(null);
      setShowDebrief(false);
      setActiveScenario(sc);
      setScore(0);
      sessionStartTimeRef.current = Date.now();

      const initialNode = sc.nodes[sc.initialNodeId];
      setCurrentNode(initialNode);

      const firstHistoryItem: HistoryEntry = {
        id: `${initialNode.id}-${Date.now()}`,
        speaker: initialNode.speaker,
        speakerName: initialNode.speakerName,
        speakerAvatar: initialNode.speakerAvatar,
        hanzi: initialNode.hanzi,
        pinyin: initialNode.pinyin,
        german: initialNode.german,
        tokens: initialNode.tokens,
        cultureTip: initialNode.cultureTip,
        audioUrl: initialNode.audioUrl,
      };

      setHistory([firstHistoryItem]);

      // Starte NPC-Audio automatisch
      if (initialNode.audioUrl) {
        playAudio(initialNode.audioUrl);
      }
    },
    [playAudio],
  );

  // Antwort auswählen
  const handleSelectChoice = useCallback(
    (choice: DialogueChoice) => {
      if (!activeScenario || !currentNode) return;

      const newScore = score + choice.points;
      setScore(newScore);

      // 1. User-Antwort in Verlauf
      const userItem: HistoryEntry = {
        id: `user-${choice.id}-${Date.now()}`,
        speaker: 'user',
        speakerName: 'Ich',
        speakerAvatar: '我',
        hanzi: choice.hanzi,
        pinyin: choice.pinyin,
        german: choice.german,
        tokens: [],
        audioUrl: choice.audioUrl,
        pointsAwarded: choice.points,
        feedbackGerman: choice.feedbackGerman,
      };

      // 2. Nächster Knoten
      const nextNode = activeScenario.nodes[choice.nextNodeId];
      if (!nextNode) return;

      const npcItem: HistoryEntry = {
        id: `${nextNode.id}-${Date.now()}`,
        speaker: nextNode.speaker,
        speakerName: nextNode.speakerName,
        speakerAvatar: nextNode.speakerAvatar,
        hanzi: nextNode.hanzi,
        pinyin: nextNode.pinyin,
        german: nextNode.german,
        tokens: nextNode.tokens,
        cultureTip: nextNode.cultureTip,
        audioUrl: nextNode.audioUrl,
      };

      setHistory((prev) => [...prev, userItem, npcItem]);
      setCurrentNode(nextNode);

      // Spiele Audio der Benutzer-Antwort und anschließend des NPCs
      if (choice.audioUrl) {
        stopCurrentAudio();
        setPlayingAudioUrl(choice.audioUrl);
        void playAsset(
          choice.audioUrl,
          () => {
            if (nextNode.audioUrl) {
              setPlayingAudioUrl(nextNode.audioUrl);
              void playAsset(
                nextNode.audioUrl,
                () => setPlayingAudioUrl(null),
                playbackSpeed,
              );
            } else {
              setPlayingAudioUrl(null);
            }
          },
          playbackSpeed,
        );
      } else if (nextNode.audioUrl) {
        playAudio(nextNode.audioUrl);
      }

      // Dialog-Abschluss prüfen
      if (nextNode.isEnding) {
        const percentage = Math.round((newScore / Math.max(1, activeScenario.maxScore)) * 100);
        const stars = percentage >= 90 ? 3 : percentage >= 65 ? 2 : 1;
        const durationMs = Date.now() - sessionStartTimeRef.current;

        const updatedProgress = {
          ...completedDialogues,
          [activeScenario.id]: {
            stars: Math.max(stars, completedDialogues[activeScenario.id]?.stars ?? 0),
            bestScore: Math.max(newScore, completedDialogues[activeScenario.id]?.bestScore ?? 0),
            completedAt: new Date().toISOString(),
          },
        };

        setCompletedDialogues(updatedProgress);
        void putCompletedDialogues(updatedProgress);

        // SessionStat loggen
        void db.stats.add({
          mode: 'dialogue',
          finishedAt: new Date().toISOString(),
          answered: 1,
          correct: stars >= 2 ? 1 : 0,
          durationMs,
        });

        // Debrief-Modal nach kurzer Verzögerung einblenden
        if (debriefTimeoutRef.current !== undefined) {
          window.clearTimeout(debriefTimeoutRef.current);
        }
        debriefTimeoutRef.current = window.setTimeout(() => {
          setShowDebrief(true);
        }, 1200);
      }
    },
    [activeScenario, currentNode, score, playbackSpeed, playAudio, completedDialogues],
  );

  // Global Keydown Handler
  useKeyDown((event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;

    // Popover / Briefing / Debrief mit Escape schließen
    if (event.key === 'Escape') {
      if (activeToken) {
        event.preventDefault();
        setActiveToken(null);
        return;
      }
      if (briefingScenario) {
        event.preventDefault();
        setBriefingScenario(null);
        return;
      }
      if (showDebrief) {
        event.preventDefault();
        stopCurrentAudio();
        setShowDebrief(false);
        setActiveScenario(null);
        return;
      }
      if (activeScenario) {
        event.preventDefault();
        if (debriefTimeoutRef.current !== undefined) {
          window.clearTimeout(debriefTimeoutRef.current);
        }
        stopCurrentAudio();
        setActiveScenario(null);
        return;
      }
      navigate('/');
      return;
    }

    // Wenn kein aktiver Dialog oder modales Fenster geöffnet ist, keine Hotkeys abfangen
    if (!activeScenario || briefingScenario || showDebrief) return;

    // 'p': Pinyin umschalten
    if (event.key === 'p' || event.key === 'P') {
      event.preventDefault();
      setShowPinyin((prev) => !prev);
      return;
    }

    // 't': Übersetzung umschalten
    if (event.key === 't' || event.key === 'T') {
      event.preventDefault();
      setShowGerman((prev) => !prev);
      return;
    }

    // 's': Geschwindigkeit umschalten (1.0x -> 0.75x -> 1.25x)
    if (event.key === 's' || event.key === 'S') {
      event.preventDefault();
      setPlaybackSpeed((prev) => (prev === 1.0 ? 0.75 : prev === 0.75 ? 1.25 : 1.0));
      return;
    }

    // Space oder 'r': Letzte NPC-Audio wiederholen
    if (event.key === ' ' || event.key === 'r' || event.key === 'R') {
      event.preventDefault();
      if (currentNode?.audioUrl) {
        playAudio(currentNode.audioUrl);
      }
      return;
    }

    // 1, 2, 3: Antwortoption wählen
    if (currentNode?.choices && currentNode.choices.length > 0) {
      const idx = parseInt(event.key, 10) - 1;
      if (idx >= 0 && idx < currentNode.choices.length) {
        event.preventDefault();
        handleSelectChoice(currentNode.choices[idx]);
      }
    }
  });

  const totalCompletedCount = Object.keys(completedDialogues).length;
  const totalStarsCount = Object.values(completedDialogues).reduce(
    (acc, cur) => acc + (cur.stars || 0),
    0,
  );

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-16">
      {/* 1. Modus-Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <SealBadge sealChar="话" label="HSK 1" variant="cinnabar" size="sm" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Interaktiver Simulator
            </span>
          </div>
          <h1 className="mt-1 text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            HSK-1 Alltagsdialoge
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Führe authentische Rollenspiele im chinesischen Alltag mit nativer Sprachausgabe,
            Entscheidungen und Live-Feedback.
          </p>
        </div>

        {/* Global Controls & Status Pill */}
        <div className="flex flex-wrap items-center gap-2">
          {activeScenario ? (
            <button
              type="button"
              onClick={() => {
                if (debriefTimeoutRef.current !== undefined) {
                  window.clearTimeout(debriefTimeoutRef.current);
                }
                stopCurrentAudio();
                setActiveScenario(null);
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-bold text-zinc-700 shadow-whisper hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200 cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Szenarien-Übersicht (Esc)</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-600/20 bg-emerald-600/10 px-4 py-1.5 font-mono text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
              <span>
                {totalStarsCount} / 18 Sterne ({totalCompletedCount} von {SCENARIOS.length} gelöst)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Aktiver Dialog-Modus (Messenger Stream) */}
      {activeScenario && currentNode ? (
        <div className="space-y-6">
          {/* Active Scenario Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200/80 bg-white px-5 py-3.5 shadow-whisper dark:border-white/[0.08] dark:bg-zinc-900">
            <div className="flex items-center gap-3">
              <SealBadge sealChar={activeScenario.hanziTag} variant="cinnabar" size="sm" />
              <div>
                <h3 className="font-cjk font-bold text-zinc-900 dark:text-zinc-100 leading-none">
                  {activeScenario.title} · {activeScenario.germanTitle}
                </h3>
                <span className="font-mono text-[11px] text-zinc-400">
                  {activeScenario.role} vs. {activeScenario.partner}
                </span>
              </div>
            </div>

            {/* In-Session Toggles & Hotkeys */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setShowPinyin(!showPinyin)}
                className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                  showPinyin
                    ? 'border border-emerald-600/30 bg-emerald-600/10 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300'
                    : 'text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
                title="Pinyin ein/aus (Taste: P)"
              >
                {showPinyin ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                <span className="hidden sm:inline">Pinyin</span>
                <kbd className="hidden sm:inline font-mono text-[9px] opacity-60">P</kbd>
              </button>

              <button
                type="button"
                onClick={() => setShowGerman(!showGerman)}
                className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                  showGerman
                    ? 'border border-emerald-600/30 bg-emerald-600/10 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300'
                    : 'text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
                title="Übersetzung ein/aus (Taste: T)"
              >
                <Languages className="h-3 w-3" />
                <span className="hidden sm:inline">Deutsch</span>
                <kbd className="hidden sm:inline font-mono text-[9px] opacity-60">T</kbd>
              </button>

              <button
                type="button"
                onClick={() => setPlaybackSpeed((prev) => (prev === 1.0 ? 0.75 : prev === 0.75 ? 1.25 : 1.0))}
                className="inline-flex items-center gap-1 rounded-xl border border-zinc-200/80 bg-zinc-50 px-2.5 py-1 text-xs font-bold text-zinc-700 hover:bg-zinc-100 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300 cursor-pointer"
                title="Tempo umschalten (Taste: S)"
              >
                <Gauge className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                <span>{playbackSpeed}x</span>
              </button>

              {currentNode.audioUrl && (
                <button
                  type="button"
                  onClick={() => playAudio(currentNode.audioUrl)}
                  className="inline-flex items-center gap-1 rounded-xl bg-zinc-100 px-2.5 py-1 text-xs font-bold text-zinc-700 hover:bg-emerald-500/15 hover:text-emerald-700 dark:bg-zinc-800 dark:text-zinc-300 transition-colors cursor-pointer"
                  title="Audio wiederholen (Leertaste oder R)"
                >
                  <Volume2 className="h-3 w-3" />
                  <span className="hidden sm:inline">Wiederholen</span>
                  <kbd className="hidden sm:inline font-mono text-[9px] opacity-60">Space</kbd>
                </button>
              )}
            </div>
          </div>

          {/* Chat Messenger Container */}
          <div className="space-y-4 rounded-[2.5rem] border border-zinc-200/80 bg-[#f4f4f1] p-4 sm:p-6 shadow-whisper dark:border-white/[0.08] dark:bg-zinc-950/60 min-h-[380px]">
            {history.map((item) => (
              <DialogueMessageBubble
                key={item.id}
                id={item.id}
                speaker={item.speaker}
                speakerName={item.speakerName}
                speakerAvatar={item.speakerAvatar}
                hanzi={item.hanzi}
                pinyin={item.pinyin}
                german={item.german}
                tokens={item.tokens}
                cultureTip={item.cultureTip}
                audioUrl={item.audioUrl}
                showPinyin={showPinyin}
                showGerman={showGerman}
                isPlaying={playingAudioUrl === item.audioUrl}
                pointsAwarded={item.pointsAwarded}
                feedbackGerman={item.feedbackGerman}
                onPlayAudio={item.audioUrl ? () => playAudio(item.audioUrl) : undefined}
                onTokenClick={(token) => setActiveToken(token)}
              />
            ))}

            <div ref={scrollAnchorRef} className="h-2" />
          </div>

          {/* Choice Selection Panel (wenn der aktuelle Knoten Entscheidungen hat) */}
          {currentNode.choices && currentNode.choices.length > 0 && !currentNode.isEnding && (
            <DialogueChoicePanel
              choices={currentNode.choices}
              onSelectChoice={handleSelectChoice}
              onPreviewAudio={(url) => playAudio(url)}
              showPinyin={showPinyin}
              showGerman={showGerman}
            />
          )}

          {/* Dialog-Ende Banner (falls kein Modal) */}
          {currentNode.isEnding && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-5 dark:border-emerald-500/20 dark:bg-emerald-500/15">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    Szenario erfolgreich abgeschlossen!
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300">
                    Punkte: {score} / {activeScenario.maxScore}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => startScenario(activeScenario)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-bold text-zinc-800 shadow-xs hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Noch einmal</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowDebrief(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-whisper hover:bg-emerald-500 cursor-pointer"
                >
                  <span>Auswertung ansehen</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* 3. Szenarien-Übersicht & Kachel-Auswahl */
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {SCENARIOS.map((sc) => {
              const progress = completedDialogues[sc.id];
              const stars = progress?.stars ?? 0;

              return (
                <div
                  key={sc.id}
                  className="group relative flex flex-col justify-between rounded-[2rem] border border-zinc-200/80 bg-white p-6 shadow-whisper transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-hover dark:border-white/[0.08] dark:bg-zinc-900 dark:hover:border-emerald-500/30 cursor-pointer"
                  onClick={() => setBriefingScenario(sc)}
                >
                  <div>
                    {/* Header: Tag & Sterne */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <SealBadge sealChar={sc.hanziTag} label={sc.category} variant="cinnabar" size="sm" />
                      <div className="flex items-center gap-1">
                        {[1, 2, 3].map((starI) => (
                          <Star
                            key={starI}
                            className={`h-4 w-4 ${
                              starI <= stars
                                ? 'fill-amber-400 text-amber-500'
                                : 'fill-zinc-200 text-zinc-300 dark:fill-zinc-800 dark:text-zinc-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Titel */}
                    <div className="space-y-0.5">
                      <span className="font-mono text-[10px] font-bold tracking-widest text-emerald-700 dark:text-emerald-400 uppercase">
                        Szenario {sc.order} · {sc.pinyinTitle}
                      </span>
                      <h3 className="font-cjk text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                        {sc.title}
                      </h3>
                      <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
                        {sc.germanTitle}
                      </p>
                    </div>

                    <p className="mt-3 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
                      {sc.summary}
                    </p>
                  </div>

                  {/* Footer Meta */}
                  <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-3.5 dark:border-white/[0.05]">
                    <span className="font-mono text-[11px] text-zinc-400">
                      {sc.role}
                    </span>

                    <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                      <Play className="h-3 w-3 fill-current" />
                      <span>Starten</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Briefing Modal */}
      {briefingScenario && (
        <DialogueBriefingModal
          scenario={briefingScenario}
          previousStars={completedDialogues[briefingScenario.id]?.stars}
          onStart={() => startScenario(briefingScenario)}
          onClose={() => setBriefingScenario(null)}
        />
      )}

      {/* 5. Debriefing Modal (bei Dialog-Abschluss) */}
      {showDebrief && activeScenario && (
        <DialogueDebriefModal
          scenario={activeScenario}
          score={score}
          maxScore={activeScenario.maxScore}
          onRetry={() => {
            stopCurrentAudio();
            setShowDebrief(false);
            startScenario(activeScenario);
          }}
          onNext={() => {
            stopCurrentAudio();
            const nextIdx = SCENARIOS.findIndex((s) => s.id === activeScenario.id) + 1;
            if (nextIdx < SCENARIOS.length) {
              startScenario(SCENARIOS[nextIdx]);
            } else {
              setShowDebrief(false);
              setActiveScenario(null);
            }
          }}
          onBackToOverview={() => {
            stopCurrentAudio();
            setShowDebrief(false);
            setActiveScenario(null);
          }}
        />
      )}

      {/* 6. Wort-Lookup Popover */}
      {activeToken && (
        <DialogueTokenPopover
          token={activeToken}
          onClose={() => setActiveToken(null)}
        />
      )}
    </div>
  );
}
