export interface BasicStroke {
  id: string;
  name: string;
  pinyin: string;
  glyph: string;
  direction: string;
  description: string;
  sampleCharacters: { char: string; pinyin: string; meaning: string }[];
}

export interface StrokeOrderRule {
  id: string;
  ruleChinese: string;
  rulePinyin: string;
  ruleGerman: string;
  explanation: string;
  exampleChar: string;
  examplePinyin: string;
  exampleMeaning: string;
  mnemonic: string;
  stepBreakdown: string[];
}

export const BASIC_STROKES: readonly BasicStroke[] = [
  {
    id: 'dian',
    name: '点',
    pinyin: 'diǎn',
    glyph: '丶',
    direction: 'Von oben-links nach unten-rechts',
    description: 'Ein kleiner Tropfen oder Punkt. Beginnt spitz und endet mit sanftem Druck.',
    sampleCharacters: [
      { char: '六', pinyin: 'liù', meaning: 'sechs (oberster Strich)' },
      { char: '下', pinyin: 'xià', meaning: 'unten (Punkt rechts)' },
      { char: '字', pinyin: 'zì', meaning: 'Schriftzeichen (Dachpunkt)' },
    ],
  },
  {
    id: 'heng',
    name: '横',
    pinyin: 'héng',
    glyph: '一',
    direction: 'Von links nach rechts',
    description: 'Eine horizontale Linie. Beginnt links und steigt minimal (ca. 5°) nach rechts an.',
    sampleCharacters: [
      { char: '一', pinyin: 'yī', meaning: 'eins' },
      { char: '二', pinyin: 'èr', meaning: 'zwei' },
      { char: '十', pinyin: 'shí', meaning: 'zehn' },
    ],
  },
  {
    id: 'shu',
    name: '竖',
    pinyin: 'shù',
    glyph: '丨',
    direction: 'Von oben nach unten',
    description: 'Eine exakt senkrechte Linie. Endet entweder spitz (Nadel) oder rund (Tautropfen).',
    sampleCharacters: [
      { char: '十', pinyin: 'shí', meaning: 'zehn' },
      { char: '中', pinyin: 'zhōng', meaning: 'Mitte' },
      { char: '工', pinyin: 'gōng', meaning: 'Arbeit' },
    ],
  },
  {
    id: 'pie',
    name: '撇',
    pinyin: 'piě',
    glyph: '丿',
    direction: 'Von oben-rechts nach unten-links',
    description: 'Ein geschwungener Strich nach links unten, der zum Ende hin dünn ausläuft.',
    sampleCharacters: [
      { char: '八', pinyin: 'bā', meaning: 'acht (linker Strich)' },
      { char: '人', pinyin: 'rén', meaning: 'Mensch (linker Strich)' },
      { char: '月', pinyin: 'yuè', meaning: 'Mond (linker Bogen)' },
    ],
  },
  {
    id: 'na',
    name: '捺',
    pinyin: 'nà',
    glyph: '乀',
    direction: 'Von oben-links nach unten-rechts',
    description: 'Ein kraftvoller Strich nach rechts unten, der an der Sohle breiter wird und flach ausläuft.',
    sampleCharacters: [
      { char: '人', pinyin: 'rén', meaning: 'Mensch (rechter Strich)' },
      { char: '大', pinyin: 'dà', meaning: 'groß (rechter Fuß)' },
      { char: '天', pinyin: 'tiān', meaning: 'Himmel (rechter Strich)' },
    ],
  },
  {
    id: 'ti',
    name: '提',
    pinyin: 'tí',
    glyph: '冫',
    direction: 'Von links-unten nach rechts-oben',
    description: 'Ein dynamischer Aufstrich. Beginnt fest und schnellt nach rechts oben spitz weg.',
    sampleCharacters: [
      { char: '我', pinyin: 'wǒ', meaning: 'ich (Strich links unten)' },
      { char: '地', pinyin: 'dì', meaning: 'Erde (im linken Radikal)' },
      { char: '冷', pinyin: 'lěng', meaning: 'kalt (im Eis-Radikal)' },
    ],
  },
  {
    id: 'zhe',
    name: '折',
    pinyin: 'zhé',
    glyph: '𠃍',
    direction: 'Abknickender Richtungswechsel',
    description: 'Ein Strich mit scharfem Winkel ohne Absetzen des Pinsels (z. B. 横折 héng-zhé).',
    sampleCharacters: [
      { char: '口', pinyin: 'kǒu', meaning: 'Mund (oberer und rechter Rand)' },
      { char: '日', pinyin: 'rì', meaning: 'Sonne' },
      { char: '四', pinyin: 'sì', meaning: 'vier' },
    ],
  },
  {
    id: 'gou',
    name: '钩',
    pinyin: 'gōu',
    glyph: '亅',
    direction: 'Haken am Ende eines Strichs',
    description: 'Ein abrupter, spitzer Haken am Strichende (z. B. 竖钩 shù-gōu oder 横钩 héng-gōu).',
    sampleCharacters: [
      { char: '小', pinyin: 'xiǎo', meaning: 'klein (Mittelstrich)' },
      { char: '你', pinyin: 'nǐ', meaning: 'du (rechter Bogenhaken)' },
      { char: '买', pinyin: 'mǎi', meaning: 'kaufen' },
    ],
  },
];

export const STROKE_ORDER_RULES: readonly StrokeOrderRule[] = [
  {
    id: 'heng-then-shu',
    ruleChinese: '先横后竖',
    rulePinyin: 'Xiān héng hòu shù',
    ruleGerman: 'Erst waagerecht, dann senkrecht',
    explanation:
      'Kreuzen sich eine Horizontale und eine Vertikale, wird IMMER zuerst der Querstrich (横) und danach der Längsstrich (竖) gezogen.',
    exampleChar: '十',
    examplePinyin: 'shí',
    exampleMeaning: 'zehn',
    mnemonic: 'Zuerst das Fundament legen (横), dann die Säule aufrichten (竖).',
    stepBreakdown: ['1. 横 (héng) waagerecht von links nach rechts', '2. 竖 (shù) senkrecht von oben nach unten durchschneiden'],
  },
  {
    id: 'pie-then-na',
    ruleChinese: '先撇后捺',
    rulePinyin: 'Xiān piě hòu nà',
    ruleGerman: 'Erst nach links abfallen, dann nach rechts',
    explanation:
      'Bei sich kreuzenden oder berührenden Schrägstrichen wird immer der linke Abstrich (撇) vor dem rechten Abstrich (捺) ausgeführt.',
    exampleChar: '人',
    examplePinyin: 'rén',
    exampleMeaning: 'Mensch / Person',
    mnemonic: 'Wie beim Schreiben im Westen: Von links nach rechts.',
    stepBreakdown: ['1. 撇 (piě) von oben nach links unten schwingen', '2. 捺 (nà) von oben nach rechts unten abstützen'],
  },
  {
    id: 'top-to-bottom',
    ruleChinese: '从上到下',
    rulePinyin: 'Cóng shàng dào xià',
    ruleGerman: 'Von oben nach unten',
    explanation:
      'Besteht ein Zeichen aus mehreren übereinanderliegenden Komponenten oder Strichen, arbeitet man sich strikt von oben nach unten vor.',
    exampleChar: '三',
    examplePinyin: 'sān',
    exampleMeaning: 'drei',
    mnemonic: 'Ein Haus wird vom Dach zum Erdgeschoss gebaut.',
    stepBreakdown: ['1. Oberer horizontaler Strich', '2. Mittlerer kürzerer Strich', '3. Unterer breiter Basisstrich'],
  },
  {
    id: 'left-to-right',
    ruleChinese: '从左到右',
    rulePinyin: 'Cóng zuǒ dào yòu',
    ruleGerman: 'Von links nach rechts',
    explanation:
      'Bei links-rechts aufgebauten Zeichen (wie ca. 70% aller Hanzi) wird die linke Komponente (meist das Radikal) vollständig fertiggestellt, bevor die rechte Seite beginnt.',
    exampleChar: '你',
    examplePinyin: 'nǐ',
    exampleMeaning: 'du',
    mnemonic: 'Radikal links zuerst (亻 Mensch), danach die rechte Seite (尔).',
    stepBreakdown: ['1. Linke Komponente (亻: 撇 piě + 竖 shù)', '2. Rechte Komponente (尔) von oben nach unten'],
  },
  {
    id: 'outside-then-inside',
    ruleChinese: '先外后内',
    rulePinyin: 'Xiān wài hòu nèi',
    ruleGerman: 'Erst außen, dann innen',
    explanation:
      'Besitzt ein Zeichen eine umschließende Haube oder einen Rahmen, wird zuerst der äußere Rahmen gezeichnet, bevor das Innere ausgefüllt wird.',
    exampleChar: '月',
    examplePinyin: 'yuè',
    exampleMeaning: 'Monat / Mond',
    mnemonic: 'Erst die Mauern des Zimmers errichten, dann die Möbel hineinstellen.',
    stepBreakdown: ['1. Äußerer Rahmen (links 撇 piě, oben/rechts 横折钩 héngzhégōu)', '2. Innere Striche von oben nach unten'],
  },
  {
    id: 'inside-then-close',
    ruleChinese: '先外后内再封口',
    rulePinyin: 'Xiān wài hòu nèi zài fēng kǒu',
    ruleGerman: 'Erst Rahmen, dann Inhalt, zuletzt schließen',
    explanation:
      'Bei voll umschlossenen Zeichen (wie 国, 日, 回, 四) wird der Rahmen oben und an den Seiten gebaut, die inneren Elemente gezeichnet und ZULETZT die Bodenleiste geschlossen.',
    exampleChar: '国',
    examplePinyin: 'guó',
    exampleMeaning: 'Land / Staat',
    mnemonic: 'Gäste treten erst ins Zimmer ein, bevor die Haustür abgeschlossen wird.',
    stepBreakdown: [
      '1. Linke Rahmenwand (竖 shù)',
      '2. Obere & rechte Rahmenwand (横折 héngzhé)',
      '3. Das Innere (玉 Jade) vollständig fertigstellen',
      '4. Untere Rahmenwand schließen (横 héng)',
    ],
  },
  {
    id: 'middle-then-sides',
    ruleChinese: '先中间后两边',
    rulePinyin: 'Xiān zhōngjiān hòu liǎngbiān',
    ruleGerman: 'Erst die Mitte, dann die Seiten',
    explanation:
      'Bei symmetrischen Zeichen mit einer dominierenden Mittelachse wird die Mitte zuerst gezeichnet und danach die Flügel links und rechts.',
    exampleChar: '小',
    examplePinyin: 'xiǎo',
    exampleMeaning: 'klein',
    mnemonic: 'Der Stamm des Baumes steht, bevor die Äste links und rechts wachsen.',
    stepBreakdown: ['1. Zentraler Hakenstrich in der Mitte (竖钩 shùgōu)', '2. Linker Punkt (点 diǎn)', '3. Rechter Punkt (点 diǎn)'],
  },
];
