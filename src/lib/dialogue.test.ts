import { describe, expect, it } from 'vitest';
import dialoguesData from '../data/dialogues.json';
import type { DialogueScenario } from '../types/dialogue';

const SCENARIOS = dialoguesData as unknown as DialogueScenario[];

describe('Dialogue Scenarios Data Integrity', () => {
  it('contains exactly 6 curated survival scenarios', () => {
    expect(SCENARIOS.length).toBe(6);
  });

  it('has unique scenario IDs and strictly increasing order', () => {
    const ids = new Set<string>();
    SCENARIOS.forEach((sc, idx) => {
      expect(ids.has(sc.id)).toBe(false);
      ids.add(sc.id);
      expect(sc.order).toBe(idx + 1);
      expect(sc.title).toBeTruthy();
      expect(sc.pinyinTitle).toBeTruthy();
      expect(sc.germanTitle).toBeTruthy();
      expect(sc.hanziTag).toBeTruthy();
      expect(sc.role).toBeTruthy();
      expect(sc.partner).toBeTruthy();
      expect(sc.location).toBeTruthy();
      expect(sc.maxScore).toBeGreaterThan(0);
      expect(sc.objectives.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('every scenario starts with a valid initial node', () => {
    for (const sc of SCENARIOS) {
      expect(sc.nodes[sc.initialNodeId]).toBeDefined();
      const initialNode = sc.nodes[sc.initialNodeId];
      expect(initialNode.speaker).toBe('npc');
      expect(initialNode.hanzi).toBeTruthy();
      expect(initialNode.pinyin).toBeTruthy();
      expect(initialNode.german).toBeTruthy();
      expect(initialNode.audioUrl).toMatch(/^\/audio\/dialogues\/.+\.mp3$/);
    }
  });

  it('every scenario graph is fully traversable to an ending node without broken links', () => {
    for (const sc of SCENARIOS) {
      const visited = new Set<string>();
      let foundEnding = false;

      function traverse(nodeId: string) {
        if (visited.has(nodeId)) return;
        visited.add(nodeId);

        const node = sc.nodes[nodeId];
        expect(node).toBeDefined();

        if (node.isEnding) {
          foundEnding = true;
          return;
        }

        if (node.choices && node.choices.length > 0) {
          for (const choice of node.choices) {
            expect(choice.hanzi).toBeTruthy();
            expect(choice.pinyin).toBeTruthy();
            expect(choice.german).toBeTruthy();
            expect(choice.feedbackGerman).toBeTruthy();
            expect(choice.points).toBeGreaterThan(0);
            expect(choice.nextNodeId).toBeTruthy();
            expect(sc.nodes[choice.nextNodeId]).toBeDefined();
            traverse(choice.nextNodeId);
          }
        }
      }

      traverse(sc.initialNodeId);
      expect(foundEnding).toBe(true);
    }
  });

  it('verifies that all referenced dialogue MP3 files exist in public/audio/dialogues', () => {
    const audioFiles = import.meta.glob('/public/audio/dialogues/*.mp3');
    const existingKeys = new Set(Object.keys(audioFiles));
    const missingFiles: string[] = [];

    for (const sc of SCENARIOS) {
      for (const node of Object.values(sc.nodes)) {
        if (node.audioUrl) {
          const expectedKey = `/public${node.audioUrl}`;
          if (!existingKeys.has(expectedKey)) {
            missingFiles.push(node.audioUrl);
          }
        }

        if (node.choices) {
          for (const choice of node.choices) {
            if (choice.audioUrl) {
              const expectedKey = `/public${choice.audioUrl}`;
              if (!existingKeys.has(expectedKey)) {
                missingFiles.push(choice.audioUrl);
              }
            }
          }
        }
      }
    }

    expect(missingFiles).toEqual([]);
    expect(Object.keys(audioFiles).length).toBeGreaterThanOrEqual(70);
  });

  it('calculates star ratings correctly according to didactical thresholds', () => {
    function calculateStars(score: number, maxScore: number): number {
      const percentage = Math.round((score / Math.max(1, maxScore)) * 100);
      return percentage >= 90 ? 3 : percentage >= 65 ? 2 : 1;
    }

    // 200 maxScore scenario:
    expect(calculateStars(200, 200)).toBe(3);
    expect(calculateStars(180, 200)).toBe(3); // 90%
    expect(calculateStars(170, 200)).toBe(2); // 85%
    expect(calculateStars(130, 200)).toBe(2); // 65%
    expect(calculateStars(120, 200)).toBe(1); // 60%
    expect(calculateStars(40, 200)).toBe(1);  // 20%
  });
});
