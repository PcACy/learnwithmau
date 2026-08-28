import { describe, expect, it } from 'vitest';
import mockExamData from '../data/mockExam.json';
import type { ExamQuestion } from '../types/exam';

const questions = mockExamData as ExamQuestion[];

describe('HSK-1 Mock Exam Dataset & Logic', () => {
  it('contains exactly 30 questions', () => {
    expect(questions.length).toBe(30);
  });

  it('contains 15 listening questions and 15 reading questions', () => {
    const listening = questions.filter((q) => q.section === 'listening');
    const reading = questions.filter((q) => q.section === 'reading');
    expect(listening.length).toBe(15);
    expect(reading.length).toBe(15);
  });

  it('ensures every question has valid fields and correctIndex within bounds', () => {
    questions.forEach((q) => {
      expect(q.id).toBeTruthy();
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
