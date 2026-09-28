import { describe, expect, it } from 'vitest';
import mockExamData from '../data/mockExam.json';
import type { ExamQuestion } from '../types/exam';
import { buildExam, EXAM_FORMAT, EXAM_MODES, PASS_MARK, scoreExam } from './mockExamEngine';

const questions = mockExamData as ExamQuestion[];

const SECTIONS = ['listening', 'reading'] as const;
const TYPES = ['trueFalse', 'multipleChoice', 'matching'];

describe('HSK-1 Mock Exam Dataset & Logic', () => {
  it('holds two complete exam sets of 40 questions each', () => {
    expect(questions.length).toBe(80);
    expect(questions.length).toBe(EXAM_FORMAT.questionsPerSet * 2);
  });

  it('matches the official format: 20 listening and 20 reading questions per set', () => {
    for (const offset of [0, 40]) {
      const set = questions.slice(offset, offset + 40);
      const listening = set.filter((q) => q.section === 'listening');
      const reading = set.filter((q) => q.section === 'reading');
      expect(listening).toHaveLength(EXAM_FORMAT.listeningQuestions);
      expect(reading).toHaveLength(EXAM_FORMAT.readingQuestions);
    }
  });

  it('splits every set into four parts of five questions per section', () => {
    for (const offset of [0, 40]) {
      const set = questions.slice(offset, offset + 40);
      for (const section of SECTIONS) {
        for (let part = 1; part <= EXAM_FORMAT.partsPerSection; part += 1) {
          const inPart = set.filter((q) => q.section === section && q.part === part);
          expect(inPart, `${section} Teil ${part}`).toHaveLength(EXAM_FORMAT.questionsPerPart);
        }
      }
    }
  });

  it('uses only known question types and well-formed answer keys', () => {
    const ids = new Set<string>();

    for (const q of questions) {
      expect(q.id).toBeTruthy();
      expect(ids.has(q.id), `Duplicate question ID ${q.id}`).toBe(false);
      ids.add(q.id);

      expect(TYPES).toContain(q.type);
      expect(SECTIONS).toContain(q.section);
      expect([1, 2, 3, 4]).toContain(q.part);
      expect(q.prompt.length).toBeGreaterThan(5);
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(q.options.length);
      expect(q.explanation.length).toBeGreaterThan(10);

      if (q.type === 'trueFalse') {
        expect(q.options).toEqual(['Richtig', 'Falsch']);
      } else {
        expect(new Set(q.options).size).toBe(q.options.length);
      }
    }
  });

  it('verifies that every listening question has an existing audio file', () => {
    const audioFiles = import.meta.glob('/public/audio/**/*.mp3');
    const existingKeys = new Set(Object.keys(audioFiles));

    const listeningQuestions = questions.filter((q) => q.section === 'listening');
    expect(listeningQuestions).toHaveLength(40);

    for (const q of listeningQuestions) {
      expect(q.audioUrl, `Missing audioUrl in listening question ${q.id}`).toBeTruthy();
      expect(q.audioUrl?.endsWith('.mp3')).toBe(true);
      const expectedKey = `/public${q.audioUrl}`;
      expect(existingKeys.has(expectedKey), `Audio file ${expectedKey} for ${q.id} not found`).toBe(true);
    }
  });

  it('hält den gemeinsamen Kontext (Lesetext bzw. Auditiv) für genau fünf Fragen bereit', () => {
    for (const offset of [0, 40]) {
      const set = questions.slice(offset, offset + 40);
      for (const section of SECTIONS) {
        const inSection = set.filter((q) => q.section === section && q.context);
        expect(inSection, `${section}: kein Kontext`).toHaveLength(EXAM_FORMAT.questionsPerPart);
        for (const q of inSection) {
          expect(q.part).toBe(3);
        }
        expect(new Set(inSection.map((q) => q.context)).size).toBe(1);
      }
    }
  });

  it('teilt das Hörverständnis-Formular (Teil 3) auf fünf Fragen mit identischem Audio auf', () => {
    for (const offset of [0, 40]) {
      const set = questions.slice(offset, offset + 40);
      const forms = set.filter((q) => q.section === 'listening' && q.part === 3);
      expect(forms).toHaveLength(5);
      expect(new Set(forms.map((q) => q.audioUrl)).size).toBe(1);
    }
  });

  it('baut gültige Prüfungssätze für Set 1, Set 2 und Shuffle', () => {
    expect(EXAM_MODES).toHaveLength(3);

    for (const [index, mode] of (['set1', 'set2'] as const).entries()) {
      const built = buildExam(mode);
      expect(built.questions).toHaveLength(40);
      expect(built.questions[0].id).toBe(`hsk3-${String(index * 40 + 1).padStart(2, '0')}`);
      expect(built.questions[39].id).toBe(`hsk3-${String(index * 40 + 40).padStart(2, '0')}`);
      expect(built.questions.filter((q) => q.section === 'listening')).toHaveLength(20);
      expect(built.questions.filter((q) => q.section === 'reading')).toHaveLength(20);

      // Parts müssen in aufsteigender Reihenfolge und voll besetzt sein.
      for (const section of SECTIONS) {
        const parts = built.questions
          .filter((q) => q.section === section)
          .map((q) => q.part)
          .sort((a, b) => a - b);
        expect(parts).toEqual([1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4]);
      }
    }

    const shuffle = buildExam('shuffle');
    expect(shuffle.questions).toHaveLength(40);
    expect(shuffle.questions.filter((q) => q.section === 'listening')).toHaveLength(20);
    expect(shuffle.questions.filter((q) => q.section === 'reading')).toHaveLength(20);
    expect(new Set(shuffle.questions.map((q) => q.id)).size).toBe(40);

    for (const section of SECTIONS) {
      for (let part = 1; part <= EXAM_FORMAT.partsPerSection; part += 1) {
        const inPart = shuffle.questions.filter((q) => q.section === section && q.part === part);
        expect(inPart).toHaveLength(EXAM_FORMAT.questionsPerPart);
        expect(new Set(inPart.map((q) => q.id)).size).toBe(EXAM_FORMAT.questionsPerPart);
      }
    }
  });

  it('bewertet im offiziellen Punktesystem: 5 Punkte je Frage, bestanden ab 120', () => {
    const set = buildExam('set1').questions;
    const correct = (q: ExamQuestion) => q.correctIndex;

    const perfect = scoreExam(set, Object.fromEntries(set.map((q) => [q.id, correct(q)])));
    expect(perfect.score).toBe(EXAM_FORMAT.maxScore);
    expect(perfect.listeningScore).toBe(EXAM_FORMAT.listeningMaxScore);
    expect(perfect.readingScore).toBe(EXAM_FORMAT.readingMaxScore);
    expect(perfect.totalCorrect).toBe(40);
    expect(perfect.passed).toBe(true);

    // 24 richtige Antworten = 120 Punkte = genau die Bestehensgrenze.
    const first24 = set.slice(0, 24);
    const passing = scoreExam(set, Object.fromEntries(first24.map((q) => [q.id, correct(q)])));
    expect(passing.score).toBe(120);
    expect(passing.score).toBe(PASS_MARK);
    expect(passing.passed).toBe(true);

    // 23 richtige Antworten = 115 Punkte = nicht bestanden.
    const first23 = set.slice(0, 23);
    const failing = scoreExam(set, Object.fromEntries(first23.map((q) => [q.id, correct(q)])));
    expect(failing.score).toBe(115);
    expect(failing.passed).toBe(false);

    // Falsch beantwortete Fragen zählen nicht.
    const wrong = scoreExam(set, Object.fromEntries(set.map((q) => [q.id, (q.correctIndex + 1) % q.options.length])));
    expect(wrong.score).toBe(0);
    expect(wrong.passed).toBe(false);

    // Unbeantwortet bleibt unbeantwortet.
    const none = scoreExam(set, {});
    expect(none.score).toBe(0);
    expect(none.totalCorrect).toBe(0);
  });
});
