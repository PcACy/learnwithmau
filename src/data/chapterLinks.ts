export interface ChapterLink {
  grammarLessonId: string;
  recommendedStoryId: string;
  storyTitle: string;
  storyGerman: string;
  keyVocab: { hanzi: string; pinyin: string; meaning: string }[];
  practiceHint: string;
}

export const CHAPTER_LINKS: Record<string, ChapterLink> = {
  'svo-basics': {
    grammarLessonId: 'svo-basics',
    recommendedStoryId: 'story-01',
    storyTitle: '自我介绍 (Zìwǒ jièshào)',
    storyGerman: 'Sich vorstellen — Name, Herkunft & Alter',
    keyVocab: [
      { hanzi: '我', pinyin: 'wǒ', meaning: 'ich' },
      { hanzi: '喝', pinyin: 'hē', meaning: 'trinken' },
      { hanzi: '茶', pinyin: 'chá', meaning: 'Tee' },
      { hanzi: '吃', pinyin: 'chī', meaning: 'essen' },
      { hanzi: '书', pinyin: 'shū', meaning: 'Buch' },
    ],
    practiceHint: 'Wende den SVO-Satzbau direkt an, indem du Li Yues persönliche Vorstellung liest.',
  },
  'copula-shi': {
    grammarLessonId: 'copula-shi',
    recommendedStoryId: 'story-02',
    storyTitle: '我的家 (Wǒ de jiā)',
    storyGerman: 'Meine Familie — Berufe & Verwandtschaft',
    keyVocab: [
      { hanzi: '是', pinyin: 'shì', meaning: 'sein' },
      { hanzi: '爸爸', pinyin: 'bàba', meaning: 'Vater' },
      { hanzi: '妈妈', pinyin: 'māma', meaning: 'Mutter' },
      { hanzi: '老师', pinyin: 'lǎoshī', meaning: 'Lehrer' },
      { hanzi: '学生', pinyin: 'xuésheng', meaning: 'Schüler' },
    ],
    practiceHint: 'Erlebe, wie Personen und Identitäten mit 是 und 这是 im familiären Kontext beschrieben werden.',
  },
  'possession-de': {
    grammarLessonId: 'possession-de',
    recommendedStoryId: 'story-02',
    storyTitle: '我的家 (Wǒ de jiā)',
    storyGerman: 'Zugehörigkeiten & Attribute mit 的',
    keyVocab: [
      { hanzi: '的', pinyin: 'de', meaning: 'Attributpartikel' },
      { hanzi: '猫', pinyin: 'māo', meaning: 'Katze' },
      { hanzi: '朋友', pinyin: 'péngyou', meaning: 'Freund' },
      { hanzi: '电脑', pinyin: 'diànnǎo', meaning: 'Computer' },
    ],
    practiceHint: 'Beobachte das Bindeglied 的 bei Familienmitgliedern und Besitztümern.',
  },
  'existence-zai': {
    grammarLessonId: 'existence-zai',
    recommendedStoryId: 'story-03',
    storyTitle: '在餐馆 (Zài cānguǎn)',
    storyGerman: 'Im Restaurant — Bestellen & Ortsangaben',
    keyVocab: [
      { hanzi: '在', pinyin: 'zài', meaning: 'in / an / auf' },
      { hanzi: '上', pinyin: 'shàng', meaning: 'oben / auf' },
      { hanzi: '下', pinyin: 'xià', meaning: 'unten / unter' },
      { hanzi: '前面', pinyin: 'qiánmian', meaning: 'vorne' },
      { hanzi: '后面', pinyin: 'hòumian', meaning: 'hinten' },
    ],
    practiceHint: 'Finde heraus, wo Gegenstände und die Katze im Raum platziert sind.',
  },
  'questions-ma': {
    grammarLessonId: 'questions-ma',
    recommendedStoryId: 'story-04',
    storyTitle: '买水果 (Mǎi shuǐguǒ)',
    storyGerman: 'Auf dem Markt — Fragen stellen mit 吗',
    keyVocab: [
      { hanzi: '吗', pinyin: 'ma', meaning: 'Fragepartikel' },
      { hanzi: '买', pinyin: 'mǎi', meaning: 'kaufen' },
      { hanzi: '苹果', pinyin: 'píngguǒ', meaning: 'Apfel' },
      { hanzi: '多少', pinyin: 'duōshao', meaning: 'wie viel' },
    ],
    practiceHint: 'Lerne echte Verkaufsgespräche und Höflichkeitsfragen auf dem Markt kennen.',
  },
  'negation-bu-mei': {
    grammarLessonId: 'negation-bu-mei',
    recommendedStoryId: 'story-05',
    storyTitle: '今天的天气 (Jīntiān de tiānqì)',
    storyGerman: 'Wetterbericht — Verneinung von Eigenschaften',
    keyVocab: [
      { hanzi: '不', pinyin: 'bù', meaning: 'nicht' },
      { hanzi: '没', pinyin: 'méi', meaning: 'nicht haben' },
      { hanzi: '热', pinyin: 'rè', meaning: 'heiß' },
      { hanzi: '冷', pinyin: 'lěng', meaning: 'kalt' },
      { hanzi: '下雨', pinyin: 'xiàyǔ', meaning: 'regnen' },
    ],
    practiceHint: 'Erfahre, warum man 今天不热 sagt und wann 没 zum Einsatz kommt.',
  },
  'time-before-verb': {
    grammarLessonId: 'time-before-verb',
    recommendedStoryId: 'story-06',
    storyTitle: '李明的星期天 (Lǐ Míng de xīngqītiān)',
    storyGerman: 'Tagesablauf — Zeitangaben vor der Handlung',
    keyVocab: [
      { hanzi: '今天', pinyin: 'jīntiān', meaning: 'heute' },
      { hanzi: '明天', pinyin: 'míngtiān', meaning: 'morgen' },
      { hanzi: '上午', pinyin: 'shàngwǔ', meaning: 'Vormittag' },
      { hanzi: '下午', pinyin: 'xiàwǔ', meaning: 'Nachmittag' },
      { hanzi: '点', pinyin: 'diǎn', meaning: 'Uhrzeit' },
    ],
    practiceHint: 'Präge dir die feste Reihenfolge: Wann (Zeit) + Wer + Was (Handlung) ein.',
  },
  'aspect-le': {
    grammarLessonId: 'aspect-le',
    recommendedStoryId: 'story-07',
    storyTitle: '昨天的聚会 (Zuótiān de jùhuì)',
    storyGerman: 'Rückblick — Was gestern erlebt wurde',
    keyVocab: [
      { hanzi: '了', pinyin: 'le', meaning: 'Aspektpartikel' },
      { hanzi: '去', pinyin: 'qù', meaning: 'gehen' },
      { hanzi: '高兴', pinyin: 'gāoxìng', meaning: 'erfreut' },
      { hanzi: '看见', pinyin: 'kànjiàn', meaning: 'sehen' },
    ],
    practiceHint: 'Erlebe das Vollendungs-Partikel 了 in authentischen Erzählungen der Vergangenheit.',
  },
  'question-words': {
    grammarLessonId: 'question-words',
    recommendedStoryId: 'story-08',
    storyTitle: '迷路了 (Mílù le)',
    storyGerman: 'Nach dem Weg fragen — Wo ist der Bahnhof?',
    keyVocab: [
      { hanzi: '什么', pinyin: 'shénme', meaning: 'was' },
      { hanzi: '谁', pinyin: 'shéi', meaning: 'wer' },
      { hanzi: '哪儿', pinyin: 'nǎr', meaning: 'wo' },
      { hanzi: '怎么', pinyin: 'zěnme', meaning: 'wie' },
    ],
    practiceHint: 'Trainiere die W-Fragewörter bei einer Orientierungssuche in der Stadt.',
  },
  'measure-words': {
    grammarLessonId: 'measure-words',
    recommendedStoryId: 'story-04',
    storyTitle: '买水果 (Mǎi shuǐguǒ)',
    storyGerman: 'Mengen & Zählwörter — 个, 块 und Einheiten',
    keyVocab: [
      { hanzi: '个', pinyin: 'ge', meaning: 'allg. Zählwort' },
      { hanzi: '本', pinyin: 'běn', meaning: 'Zählwort f. Bücher' },
      { hanzi: '岁', pinyin: 'suì', meaning: 'Jahre alt' },
      { hanzi: '块', pinyin: 'kuài', meaning: 'Geldeinheit Yuan' },
    ],
    practiceHint: 'Beachte, wie Zahl + Zählwort + Substantiv beim Einkaufen natürlich verwendet werden.',
  },
};

export const STORY_TO_GRAMMAR_MAP: Record<string, { lessonId: string; lessonTitle: string }[]> = {
  'story-01': [{ lessonId: 'svo-basics', lessonTitle: 'SVO-Satzbau' }],
  'story-02': [
    { lessonId: 'copula-shi', lessonTitle: 'Kopula 是 (sein)' },
    { lessonId: 'possession-de', lessonTitle: 'Attributpartikel 的' },
  ],
  'story-03': [{ lessonId: 'existence-zai', lessonTitle: 'Ortsangaben mit 在' }],
  'story-04': [
    { lessonId: 'questions-ma', lessonTitle: 'Entscheidungsfragen 吗' },
    { lessonId: 'measure-words', lessonTitle: 'Zähleinheitswörter (个, 块)' },
  ],
  'story-05': [{ lessonId: 'negation-bu-mei', lessonTitle: 'Verneinung mit 不 / 没' }],
  'story-06': [{ lessonId: 'time-before-verb', lessonTitle: 'Zeitangaben vor dem Verb' }],
  'story-07': [{ lessonId: 'aspect-le', lessonTitle: 'Abgeschlossene Handlungen mit 了' }],
  'story-08': [{ lessonId: 'question-words', lessonTitle: 'W-Fragewörter (什么, 哪儿, 谁)' }],
  'story-09': [
    { lessonId: 'existence-zai', lessonTitle: 'Ortsangaben mit 在' },
    { lessonId: 'time-before-verb', lessonTitle: 'Zeitangaben vor dem Verb' },
  ],
  'story-10': [
    { lessonId: 'questions-ma', lessonTitle: 'Entscheidungsfragen 吗' },
    { lessonId: 'copula-shi', lessonTitle: 'Kopula 是 (sein)' },
  ],
  'story-11': [
    { lessonId: 'measure-words', lessonTitle: 'Zähleinheitswörter (个, 块)' },
    { lessonId: 'possession-de', lessonTitle: 'Attributpartikel 的' },
  ],
  'story-12': [
    { lessonId: 'question-words', lessonTitle: 'W-Fragewörter (几, 谁, 什么)' },
    { lessonId: 'negation-bu-mei', lessonTitle: 'Verneinung mit 不 / 没' },
  ],
};
