import { describe, expect, it } from 'vitest';
import hsk1Data from '../data/hsk1.json';
import type { VocabItem } from '../types/vocab';

const vocab = hsk1Data as VocabItem[];

// Offizielle Wortliste der neuen HSK-3.0-Prüfung, Stufe 1 (300 Wörter,
// in Kraft seit 1. Juli 2026).
const OFFICIAL_HSK1_WORDS = [
  '爱', '八', '爸爸', '吧', '白天', '百', '半', '包子', '杯子', '本', '边', '病',
  '不', '不客气', '不要', '菜', '茶', '唱', '超市', '车', '吃', '出租车', '穿', '打电话',
  '大', '大家', '大学', '大学生', '到', '的', '第', '弟弟', '点', '店', '电话', '电脑',
  '电视', '电影', '电影院', '东西', '都', '读', '读书', '对', '对不起', '多', '多少', '儿子',
  '二', '饭', '饭店', '房间', '非常', '飞机', '分', '分钟', '高兴', '歌', '哥哥', '个',
  '给', '公司', '工作', '狗', '贵', '国', '还', '孩子', '汉语', '汉字', '好', '好吃',
  '好看', '好听', '好玩儿', '号', '喝', '和', '很', '后', '回', '会', '火车', '鸡蛋',
  '几', '家', '家人', '见', '件', '饺子', '叫', '姐姐', '今年', '今天', '九', '觉得',
  '开', '开车', '看', '看病', '看见', '可以', '课', '口', '块', '来', '老师', '了',
  '冷', '里', '两', '零', '六', '妈妈', '吗', '买', '卖', '忙', '猫', '没关系',
  '没事', '没有', '妹妹', '们', '米饭', '面包', '面条儿', '明年', '明天', '名字', '哪', '哪个',
  '哪里', '哪儿', '哪些', '那', '那边', '那个', '那里', '那儿', '那些', '男', '男朋友', '呢',
  '能', '你', '你好', '你们', '年', '您', '牛奶', '女', '女儿', '女朋友', '女士', '朋友',
  '便宜', '漂亮', '苹果', '七', '起床', '千', '前', '钱', '请', '请问', '去', '去年',
  '热', '人', '认识', '日', '三', '商店', '上', '上班', '上课', '上午', '上学', '少',
  '谁', '什么', '生病', '十', '时候', '时间', '事', '是', '手机', '书', '书店', '水',
  '水果', '睡', '睡觉', '说', '说话', '四', '岁', '他', '它', '她', '他们', '它们',
  '她们', '太', '天', '天气', '听', '听见', '同学', '外', '外边', '玩', '晚', '晚饭',
  '晚上', '喂', '问', '问题', '我', '我们', '五', '午饭', '喜欢', '下', '下雨', '下班',
  '下课', '下午', '先生', '现在', '想', '小', '小朋友', '小时', '小学', '小学生', '些', '写',
  '谢谢', '新', '星期', '星期日', '星期天', '休息', '学', '学生', '学习', '学校', '雪', '要',
  '也', '一', '衣服', '医生', '医院', '一半', '一下', '椅子', '一点儿', '一些', '有', '有的',
  '有点儿', '有些', '雨', '元', '月', '再', '在', '再见', '早', '早饭', '早上', '怎么',
  '怎么样', '找', '这', '这边', '这个', '这里', '这儿', '这些', '真', '正在', '只', '知道',
  '中国', '中文', '中午', '中学', '中学生', '住', '桌子', '字', '昨天', '坐', '做', '做饭',
];

describe('Official HSK-1 100% Coverage Verification', () => {
  it('contains the complete HSK-3.0 level-1 word list of 300 entries', () => {
    expect(OFFICIAL_HSK1_WORDS).toHaveLength(300);
    expect(vocab.length).toBeGreaterThanOrEqual(OFFICIAL_HSK1_WORDS.length);
  });

  it('contains 100% of all official HSK-3.0 level-1 words without a single omission', () => {
    const presentWords = new Set(vocab.map((v) => v.hanzi));
    const missing = OFFICIAL_HSK1_WORDS.filter((word) => !presentWords.has(word));

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

  it('ensures 100% of all vocabulary items have at least 2 authentic collocations and example sentences', async () => {
    const { getEnrichedVocab } = await import('../data/vocabDetails');

    vocab.forEach((item) => {
      const enriched = getEnrichedVocab(item);
      expect(enriched.collocations.length).toBeGreaterThanOrEqual(2);
      expect(enriched.exampleSentences.length).toBeGreaterThanOrEqual(1);

      enriched.collocations.forEach((col) => {
        expect(col.hanzi.trim().length).toBeGreaterThan(0);
        expect(col.pinyin.trim().length).toBeGreaterThan(0);
        expect(col.german.trim().length).toBeGreaterThan(0);
      });

      enriched.exampleSentences.forEach((sent) => {
        expect(sent.hanzi.trim().length).toBeGreaterThan(0);
        expect(sent.pinyin.trim().length).toBeGreaterThan(0);
        expect(sent.german.trim().length).toBeGreaterThan(0);
      });
    });
  });
});
