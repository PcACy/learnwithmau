import { describe, expect, it } from 'vitest';
import hsk1Data from '../data/hsk1.json';
import type { VocabItem } from '../types/vocab';

const vocab = hsk1Data as VocabItem[];

const OFFICIAL_HSK1_WORDS = [
  '爱', '八', '爸爸', '杯子', '北京', '本', '不客气', '不', '菜', '茶',
  '吃', '出租车', '打电话', '大', '的', '点', '电脑', '电视', '电影', '东西',
  '都', '读', '对不起', '多', '多少', '儿子', '二', '饭馆', '飞机', '分钟',
  '高兴', '个', '工作', '狗', '汉语', '好', '号', '喝', '和', '很',
  '后面', '回', '会', '几', '家', '叫', '今天', '九', '开', '看',
  '看见', '块', '来', '老师', '了', '冷', '里', '六', '妈妈', '吗',
  '买', '猫', '没关系', '没有', '米饭', '明天', '名字', '哪', '哪儿', '那',
  '那儿', '呢', '能', '你', '年', '女儿', '朋友', '漂亮', '苹果', '七',
  '前面', '钱', '请', '去', '热', '人', '认识', '三', '商店', '上',
  '上午', '少', '谁', '什么', '十', '时候', '时间', '是', '书', '水',
  '水果', '睡觉', '说', '说话', '四', '岁', '他', '她', '太', '天气',
  '听', '同学', '喂', '我', '我们', '五', '喜欢', '下', '下午', '下雨',
  '先生', '现在', '想', '小', '小姐', '些', '写', '谢谢', '星期', '学生',
  '学习', '学校', '一', '衣服', '医生', '医院', '椅子', '有', '月', '再见',
  '在', '怎么', '怎么样', '这', '这儿', '中国', '中午', '住', '桌子', '字',
  '昨天', '坐', '做'
];

describe('Official HSK-1 100% Coverage Verification', () => {
  it('contains at least 160 vocabulary items (covering all 150 standard + key variants)', () => {
    expect(vocab.length).toBeGreaterThanOrEqual(160);
  });

  it('contains 100% of all official Hanban HSK-1 words without a single omission', () => {
    const presentWords = new Set(vocab.map((v) => v.hanzi));
    const missing: string[] = [];

    OFFICIAL_HSK1_WORDS.forEach((word) => {
      if (!presentWords.has(word)) {
        missing.push(word);
      }
    });

    expect(missing).toEqual([]);
  });

  it('ensures every single vocabulary item has syllables, tones, meaning, and radical decomposition', () => {
    vocab.forEach((item) => {
      expect(item.id).toBeTruthy();
      expect(item.hanzi).toBeTruthy();
      expect(item.pinyin).toBeTruthy();
      expect(item.meaning).toBeTruthy();
      expect(item.syllables.length).toBeGreaterThanOrEqual(1);
      expect(item.characters.length).toBeGreaterThanOrEqual(1);

      item.syllables.forEach((s) => {
        expect(s.plain).toBeTruthy();
        expect(s.marked).toBeTruthy();
        expect(s.tone).toBeGreaterThanOrEqual(1);
        expect(s.tone).toBeLessThanOrEqual(5);
      });
    });
  });
});
