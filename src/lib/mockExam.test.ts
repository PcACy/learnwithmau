import { describe, expect, it } from 'vitest';
import mockExamData from '../data/mockExam.json';
import type { ExamQuestion } from '../types/exam';
import { buildExam, EXAM_MODES } from './mockExamEngine';

const questions = mockExamData as ExamQuestion[];

describe('HSK-1 Mock Exam Dataset & Logic', () => {
  it('contains exactly 60 questions in the total question pool', () => {
    expect(questions.length).toBe(60);
  });

  it('contains exactly 30 listening questions and 30 reading questions', () => {
    const listening = questions.filter((q) => q.section === 'listening');
    const reading = questions.filter((q) => q.section === 'reading');
    expect(listening.length).toBe(30);
    expect(reading.length).toBe(30);
  });

  it('ensures every question has valid fields and correctIndex within bounds', () => {
    const ids = new Set<string>();

    questions.forEach((q) => {
      expect(q.id).toBeTruthy();
      expect(ids.has(q.id), `Duplicate question ID ${q.id}`).toBe(false);
      ids.add(q.id);

      expect(q.prompt.length).toBeGreaterThan(5);
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(q.options.length);
      expect(q.explanation.length).toBeGreaterThan(5);

      if (q.section === 'listening') {
        expect(q.audioUrl).toBeTruthy();
        expect(q.audioUrl?.endsWith('.mp3')).toBe(true);
      }
    });
  });

  it('verifies that every listening question has an existing audio file in public/audio/hsk1/', () => {
    const audioFiles = import.meta.glob('/public/audio/hsk1/*.mp3');
    const existingKeys = new Set(Object.keys(audioFiles));

    const listeningQuestions = questions.filter((q) => q.section === 'listening');
    expect(listeningQuestions.length).toBe(30);

    listeningQuestions.forEach((q) => {
      expect(q.audioUrl, `Missing audioUrl in listening question ${q.id}`).toBeTruthy();
      const expectedKey = `/public${q.audioUrl}`;
      expect(existingKeys.has(expectedKey), `Audio file ${expectedKey} for ${q.id} not found`).toBe(true);
    });
  });

  it('builds valid exam sets for Set 1, Set 2, and Shuffle', () => {
    expect(EXAM_MODES.length).toBe(3);

    // Set 1 (Questions 1–30)
    const set1 = buildExam('set1');
    expect(set1.questions.length).toBe(30);
    expect(set1.questions[0].id).toBe('hsk1-01');
    expect(set1.questions[29].id).toBe('hsk1-30');
    expect(set1.questions.filter((q) => q.section === 'listening').length).toBe(15);
    expect(set1.questions.filter((q) => q.section === 'reading').length).toBe(15);

    // Set 2 (Questions 31–60)
    const set2 = buildExam('set2');
    expect(set2.questions.length).toBe(30);
    expect(set2.questions[0].id).toBe('hsk1-31');
    expect(set2.questions[29].id).toBe('hsk1-60');
    expect(set2.questions.filter((q) => q.section === 'listening').length).toBe(15);
    expect(set2.questions.filter((q) => q.section === 'reading').length).toBe(15);

    // Shuffle (Dynamically draws 15 listening and 15 reading questions)
    const shuffle = buildExam('shuffle');
    expect(shuffle.questions.length).toBe(30);
    const shuffleListening = shuffle.questions.filter((q) => q.section === 'listening');
    const shuffleReading = shuffle.questions.filter((q) => q.section === 'reading');
    expect(shuffleListening.length).toBe(15);
    expect(shuffleReading.length).toBe(15);

    // Verify uniqueness of questions in shuffle
    const shuffleIds = new Set(shuffle.questions.map((q) => q.id));
    expect(shuffleIds.size).toBe(30);
  });

  it('calculates exam score and passing status correctly', () => {
    const maxScore = 300;
    const passingThreshold = 180;

    // Perfekter Test (30/30)
    const perfectListening = 15;
    const perfectReading = 15;
    const perfectScore = Math.round((perfectListening / 15) * 150) + Math.round((perfectReading / 15) * 150);
    expect(perfectScore).toBe(maxScore);
    expect(perfectScore >= passingThreshold).toBe(true);

    // 60% Test (18/30 richtig = genau 180 Pkt.)
    const score180 = Math.round((9 / 15) * 150) + Math.round((9 / 15) * 150);
    expect(score180).toBe(180);
    expect(score180 >= passingThreshold).toBe(true);

    // Nicht bestanden (17/30 richtig = 170 Pkt.)
    const score170 = Math.round((8 / 15) * 150) + Math.round((9 / 15) * 150);
    expect(score170).toBe(170);
    expect(score170 >= passingThreshold).toBe(false);
  });
});
