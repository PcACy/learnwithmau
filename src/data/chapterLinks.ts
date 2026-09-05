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
  'verb-shi-and-bu': {
    grammarLessonId: 'verb-shi-and-bu',
    recommendedStoryId: 'story-02',
    storyTitle: '在饭馆 (Zài fànguǎn)',
    storyGerman: 'Im Restaurant — Bestellen, Wünsche & Vorlieben',
    keyVocab: [
      { hanzi: '是', pinyin: 'shì', meaning: 'sein' },
      { hanzi: '不', pinyin: 'bù', meaning: 'nicht' },
      { hanzi: '老师', pinyin: 'lǎoshī', meaning: 'Lehrer' },
      { hanzi: '学生', pinyin: 'xuésheng', meaning: 'Schüler' },
      { hanzi: '菜', pinyin: 'cài', meaning: 'Gericht / Speise' },
    ],
    practiceHint: 'Erlebe die Kopula 是 und die Verneinung mit 不 in einem Restaurant-Gespräch.',
  },
  'you-and-meiyou': {
    grammarLessonId: 'you-and-meiyou',
    recommendedStoryId: 'story-03',
    storyTitle: '我的家和宠物 (Wǒ de jiā hé chǒngwù)',
    storyGerman: 'Familie & Haustiere — Katzen, Hunde & Zimmer',
    keyVocab: [
      { hanzi: '有', pinyin: 'yǒu', meaning: 'haben / existieren' },
      { hanzi: '没有', pinyin: 'méiyǒu', meaning: 'nicht haben' },
      { hanzi: '猫', pinyin: 'māo', meaning: 'Katze' },
      { hanzi: '狗', pinyin: 'gǒu', meaning: 'Hund' },
      { hanzi: '家', pinyin: 'jiā', meaning: 'Familie / Zuhause' },
    ],
    practiceHint: 'Beobachte, wie Besitz und Haustiere mit 有 und 没有 beschrieben werden.',
  },
  'zai-locations': {
    grammarLessonId: 'zai-locations',
    recommendedStoryId: 'story-08',
    storyTitle: '他在哪儿工作？ (Tā zài nǎr gōngzuò?)',
    storyGerman: 'Berufe & Arbeitsorte — Wo arbeitest du?',
    keyVocab: [
      { hanzi: '在', pinyin: 'zài', meaning: 'in / an / bei' },
      { hanzi: '医院', pinyin: 'yīyuàn', meaning: 'Krankenhaus' },
      { hanzi: '学校', pinyin: 'xuéxiào', meaning: 'Schule' },
      { hanzi: '哪儿', pinyin: 'nǎr', meaning: 'wo' },
      { hanzi: '工作', pinyin: 'gōngzuò', meaning: 'arbeiten' },
    ],
    practiceHint: 'Übe Ortsangaben mit 在 und deren feste Platzierung vor dem Handlungsverb.',
  },
  'question-particles': {
    grammarLessonId: 'question-particles',
    recommendedStoryId: 'story-05',
    storyTitle: '今天天气怎么样？ (Jīntiān tiānqì zěnmeyàng?)',
    storyGerman: 'Wetter & Befinden — Wie ist das Wetter heute?',
    keyVocab: [
      { hanzi: '吗', pinyin: 'ma', meaning: 'Fragepartikel' },
      { hanzi: '怎么样', pinyin: 'zěnmeyàng', meaning: 'wie ist' },
      { hanzi: '什么', pinyin: 'shénme', meaning: 'was' },
      { hanzi: '谁', pinyin: 'shéi', meaning: 'wer' },
      { hanzi: '天气', pinyin: 'tiānqì', meaning: 'Wetter' },
    ],
    practiceHint: 'Lerne Fragen nach Befinden und Wetter natürlich im Alltag anzuwenden.',
  },
  'particle-de': {
    grammarLessonId: 'particle-de',
    recommendedStoryId: 'story-11',
    storyTitle: '在家里的日常生活 (Zài jiā lǐ de rìcháng shēnghuó)',
    storyGerman: 'Familienalltag — Kinder, Haushaltsdinge & Hobbys',
    keyVocab: [
      { hanzi: '的', pinyin: 'de', meaning: 'Attribut- & Besitzpartikel' },
      { hanzi: '儿子', pinyin: 'érzi', meaning: 'Sohn' },
      { hanzi: '女儿', pinyin: 'nǚ\'ér', meaning: 'Tochter' },
      { hanzi: '电脑', pinyin: 'diànnǎo', meaning: 'Computer' },
      { hanzi: '东西', pinyin: 'dōngxi', meaning: 'Dinge / Sachen' },
    ],
    practiceHint: 'Entdecke die verbindende Funktion von 的 bei Beziehungen und Eigenschaften.',
  },
  'measure-words': {
    grammarLessonId: 'measure-words',
    recommendedStoryId: 'story-06',
    storyTitle: '在商店买水果 (Zài shāngdiàn mǎi shuǐguǒ)',
    storyGerman: 'Einkaufen auf dem Markt — Mengenangaben & Zählwörter',
    keyVocab: [
      { hanzi: '个', pinyin: 'ge', meaning: 'allg. Zählwort' },
      { hanzi: '块', pinyin: 'kuài', meaning: 'Geldeinheit Yuan' },
      { hanzi: '本', pinyin: 'běn', meaning: 'Zählwort f. Bücher' },
      { hanzi: '多少', pinyin: 'duōshao', meaning: 'wie viel' },
      { hanzi: '钱', pinyin: 'qián', meaning: 'Geld' },
    ],
    practiceHint: 'Achte beim Einkauf auf das Muster [Zahl] + [Zählwort] + [Substantiv].',
  },
  'time-and-dates': {
    grammarLessonId: 'time-and-dates',
    recommendedStoryId: 'story-09',
    storyTitle: '在火车站 (Zài huǒchēzhàn)',
    storyGerman: 'Am Bahnhof — Ankunft & Freunde abholen',
    keyVocab: [
      { hanzi: '今天', pinyin: 'jīntiān', meaning: 'heute' },
      { hanzi: '下午', pinyin: 'xiàwǔ', meaning: 'Nachmittag' },
      { hanzi: '点', pinyin: 'diǎn', meaning: 'Uhrzeit' },
      { hanzi: '分钟', pinyin: 'fēnzhōng', meaning: 'Minute' },
      { hanzi: '现在', pinyin: 'xiànzài', meaning: 'jetzt' },
    ],
    practiceHint: 'Erlebe Uhrzeiten und Zeitangaben vor dem Verb bei einer Reiseankunft.',
  },
  'modal-verbs': {
    grammarLessonId: 'modal-verbs',
    recommendedStoryId: 'story-04',
    storyTitle: '学校生活 (Xuéxiào shēnghuó)',
    storyGerman: 'Im Klassenzimmer — Chinesisch lernen & sprechen',
    keyVocab: [
      { hanzi: '会', pinyin: 'huì', meaning: 'können (erlernt)' },
      { hanzi: '想', pinyin: 'xiǎng', meaning: 'möchten / wollen' },
      { hanzi: '能', pinyin: 'néng', meaning: 'können (Fähigkeit)' },
      { hanzi: '写', pinyin: 'xiě', meaning: 'schreiben' },
      { hanzi: '说', pinyin: 'shuō', meaning: 'sprechen' },
    ],
    practiceHint: 'Beobachte, wie Wünsche und Fähigkeiten im Unterricht geäußert werden.',
  },
  'particles-le-and-qing': {
    grammarLessonId: 'particles-le-and-qing',
    recommendedStoryId: 'story-10',
    storyTitle: '朋友聚会与礼貌 (Péngyou jùhuì yǔ lǐmào)',
    storyGerman: 'Treffen mit Freunden — Begrüßung, Dank & Entschuldigung',
    keyVocab: [
      { hanzi: '了', pinyin: 'le', meaning: 'Aspektpartikel' },
      { hanzi: '请', pinyin: 'qǐng', meaning: 'bitte' },
      { hanzi: '对不起', pinyin: 'duìbuqǐ', meaning: 'Entschuldigung' },
      { hanzi: '没关系', pinyin: 'méi guānxi', meaning: 'kein Problem' },
      { hanzi: '谢谢', pinyin: 'xièxie', meaning: 'danken' },
    ],
    practiceHint: 'Verinnerliche die Höflichkeitsregeln und die Vollendungspartikel 了 im Teelokal.',
  },
  'conjunctions-dou-and-ba': {
    grammarLessonId: 'conjunctions-dou-and-ba',
    recommendedStoryId: 'story-07',
    storyTitle: '打电话看电影 (Dǎ diànhuà kàn diànyǐng)',
    storyGerman: 'Kinobesuch — Verabredungen & Vorschläge am Telefon',
    keyVocab: [
      { hanzi: '和', pinyin: 'hé', meaning: 'und' },
      { hanzi: '都', pinyin: 'dōu', meaning: 'alle / beide' },
      { hanzi: '吧', pinyin: 'ba', meaning: 'Vorschlagspartikel' },
      { hanzi: '看', pinyin: 'kàn', meaning: 'schauen' },
      { hanzi: '电影', pinyin: 'diànyǐng', meaning: 'Film' },
    ],
    practiceHint: 'Achte auf Vorschläge mit 吧 und die Zusammenfassung von Personen mit 都.',
  },
  'serial-verbs-and-adjectives': {
    grammarLessonId: 'serial-verbs-and-adjectives',
    recommendedStoryId: 'story-12',
    storyTitle: '打电话问候 (Dǎ diànhuà wènhòu)',
    storyGerman: 'Ein Telefonat — Verabredung & Wochentage',
    keyVocab: [
      { hanzi: '去', pinyin: 'qù', meaning: 'gehen nach' },
      { hanzi: '来', pinyin: 'lái', meaning: 'kommen' },
      { hanzi: '很', pinyin: 'hěn', meaning: 'sehr / Prädikatsverbinder' },
      { hanzi: '高兴', pinyin: 'gāoxìng', meaning: 'erfreut' },
      { hanzi: '好', pinyin: 'hǎo', meaning: 'gut' },
    ],
    practiceHint: 'Beobachte zwei aufeinanderfolgende Verben (serieller Satzbau) und Adjektivprädikate.',
  },
};

export const STORY_TO_GRAMMAR_MAP: Record<string, { lessonId: string; lessonTitle: string }[]> = {
  'story-01': [{ lessonId: 'svo-basics', lessonTitle: 'SVO-Satzbau' }],
  'story-02': [
    { lessonId: 'verb-shi-and-bu', lessonTitle: 'Verb 是 & Verneinung 不' },
    { lessonId: 'particle-de', lessonTitle: 'Attributpartikel 的' },
  ],
  'story-03': [
    { lessonId: 'you-and-meiyou', lessonTitle: 'Besitz & Existenz 有 / 没有' },
    { lessonId: 'zai-locations', lessonTitle: 'Ortsangaben mit 在' },
  ],
  'story-04': [
    { lessonId: 'modal-verbs', lessonTitle: 'Modalverben 会 / 想 / 能' },
    { lessonId: 'question-particles', lessonTitle: 'Fragen mit 吗' },
  ],
  'story-05': [
    { lessonId: 'question-particles', lessonTitle: 'Fragen mit 怎么样' },
    { lessonId: 'time-and-dates', lessonTitle: 'Zeitangaben vor dem Verb' },
  ],
  'story-06': [
    { lessonId: 'measure-words', lessonTitle: 'Zählwörter 个 / 块' },
    { lessonId: 'serial-verbs-and-adjectives', lessonTitle: 'Adjektive mit 很' },
  ],
  'story-07': [
    { lessonId: 'conjunctions-dou-and-ba', lessonTitle: 'Verbindung mit 和 / 都 / 吧' },
    { lessonId: 'particles-le-and-qing', lessonTitle: 'Aspektpartikel 了' },
  ],
  'story-08': [
    { lessonId: 'zai-locations', lessonTitle: 'Ortsangaben mit 在' },
    { lessonId: 'modal-verbs', lessonTitle: 'Modalverben 会 / 能' },
  ],
  'story-09': [
    { lessonId: 'time-and-dates', lessonTitle: 'Zeit- & Datumsangaben' },
    { lessonId: 'conjunctions-dou-and-ba', lessonTitle: 'Allquantor 都' },
  ],
  'story-10': [
    { lessonId: 'particles-le-and-qing', lessonTitle: 'Höflichkeit 请 & Partikel 了' },
    { lessonId: 'verb-shi-and-bu', lessonTitle: 'Verneinung 不' },
  ],
  'story-11': [
    { lessonId: 'particle-de', lessonTitle: 'Besitz & Beschreibung mit 的' },
    { lessonId: 'measure-words', lessonTitle: 'Zählwörter 个 / 本 / 块' },
  ],
  'story-12': [
    { lessonId: 'serial-verbs-and-adjectives', lessonTitle: 'Serieller Satzbau' },
    { lessonId: 'question-particles', lessonTitle: 'Fragewörter 几 / 谁' },
  ],
};
