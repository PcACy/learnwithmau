export interface InitialData {
  pinyin: string;
  ipa: string;
  category: 'labial' | 'alveolar' | 'velar' | 'alveolopalatal' | 'retroflex' | 'dental_sibilant' | 'semi_vowel';
  categoryLabel: string;
  germanAnalogy: string;
  articulationTip: string;
  sampleWords: { hanzi: string; pinyin: string; meaning: string; tone: number }[];
}

export interface FinalData {
  pinyin: string;
  ipa: string;
  category: 'simple' | 'compound' | 'nasal_front' | 'nasal_back' | 'special';
  categoryLabel: string;
  germanAnalogy: string;
  sampleWords: { hanzi: string; pinyin: string; meaning: string; tone: number }[];
}

export interface ToneSandhiRule {
  id: string;
  title: string;
  chinese: string;
  ruleExplanation: string;
  exampleOriginal: string;
  exampleSpoken: string;
  exampleHanzi: string;
  exampleMeaning: string;
  badge: string;
  moreExamples: { original: string; spoken: string; hanzi: string; meaning: string }[];
}

export interface OrthographyRule {
  id: string;
  title: string;
  summary: string;
  detail: string;
  ruleFormula: string;
  examples: { wrong?: string; correct: string; note: string }[];
}

export const INITIALS: readonly InitialData[] = [
  // Labiale
  {
    pinyin: 'b',
    ipa: 'p',
    category: 'labial',
    categoryLabel: 'Lippenlaute (Labiale)',
    germanAnalogy: 'Wie deutsches stimmloses "b" (z. B. in "Bett"), völlig unbehaucht.',
    articulationTip: 'Beide Lippen schließen sich fest und öffnen sich ohne Luftstoß.',
    sampleWords: [
      { hanzi: '八', pinyin: 'bā', meaning: 'acht', tone: 1 },
      { hanzi: '不', pinyin: 'bù', meaning: 'nicht', tone: 4 },
      { hanzi: '爸爸', pinyin: 'bàba', meaning: 'Vater', tone: 4 },
    ],
  },
  {
    pinyin: 'p',
    ipa: 'pʰ',
    category: 'labial',
    categoryLabel: 'Lippenlaute (Labiale)',
    germanAnalogy: 'Wie stark behauchtes deutsches "p" (z. B. in "Post").',
    articulationTip: 'Lippen öffnen sich mit einem spürbaren Luftstoß (Blatt Papier vor Mund bewegt sich).',
    sampleWords: [
      { hanzi: '朋友', pinyin: 'péngyou', meaning: 'Freund', tone: 2 },
      { hanzi: '漂亮', pinyin: 'piàoliang', meaning: 'schön / hübsch', tone: 4 },
      { hanzi: '苹果', pinyin: 'píngguǒ', meaning: 'Apfel', tone: 2 },
    ],
  },
  {
    pinyin: 'm',
    ipa: 'm',
    category: 'labial',
    categoryLabel: 'Lippenlaute (Labiale)',
    germanAnalogy: 'Wie deutsches "m" (z. B. in "Mutter").',
    articulationTip: 'Lippen geschlossen, Klang strömt durch die Nase.',
    sampleWords: [
      { hanzi: '妈妈', pinyin: 'māma', meaning: 'Mutter', tone: 1 },
      { hanzi: '猫', pinyin: 'māo', meaning: 'Katze', tone: 1 },
      { hanzi: '买', pinyin: 'mǎi', meaning: 'kaufen', tone: 3 },
    ],
  },
  {
    pinyin: 'f',
    ipa: 'f',
    category: 'labial',
    categoryLabel: 'Lippenlaute (Labiale)',
    germanAnalogy: 'Wie deutsches "f" (z. B. in "Fisch").',
    articulationTip: 'Oberzähne berühren leicht die Unterlippe.',
    sampleWords: [
      { hanzi: '饭馆', pinyin: 'fànguǎn', meaning: 'Restaurant', tone: 4 },
      { hanzi: '飞机', pinyin: 'fēijī', meaning: 'Flugzeug', tone: 1 },
      { hanzi: '分钟', pinyin: 'fēnzhōng', meaning: 'Minute', tone: 1 },
    ],
  },

  // Alveolare
  {
    pinyin: 'd',
    ipa: 't',
    category: 'alveolar',
    categoryLabel: 'Zungenspitzenlaute (Alveolare)',
    germanAnalogy: 'Wie deutsches stimmloses "d" (z. B. in "Dach"), völlig unbehaucht.',
    articulationTip: 'Zungenspitze tippt an den oberen Zahndamm ohne Luftstoß.',
    sampleWords: [
      { hanzi: '大', pinyin: 'dà', meaning: 'groß', tone: 4 },
      { hanzi: '点', pinyin: 'diǎn', meaning: 'Uhrzeit / Punkt', tone: 3 },
      { hanzi: '的', pinyin: 'de', meaning: 'Attributpartikel', tone: 5 },
    ],
  },
  {
    pinyin: 't',
    ipa: 'tʰ',
    category: 'alveolar',
    categoryLabel: 'Zungenspitzenlaute (Alveolare)',
    germanAnalogy: 'Wie stark behauchtes deutsches "t" (z. B. in "Tee").',
    articulationTip: 'Zungenspitze löst sich mit kräftigem Luftstoß vom Zahndamm.',
    sampleWords: [
      { hanzi: '他', pinyin: 'tā', meaning: 'er', tone: 1 },
      { hanzi: '太', pinyin: 'tài', meaning: 'zu / übermäßig', tone: 4 },
      { hanzi: '天气', pinyin: 'tiānqì', meaning: 'Wetter', tone: 1 },
    ],
  },
  {
    pinyin: 'n',
    ipa: 'n',
    category: 'alveolar',
    categoryLabel: 'Zungenspitzenlaute (Alveolare)',
    germanAnalogy: 'Wie deutsches "n" (z. B. in "Nase").',
    articulationTip: 'Zungenspitze liegt am oberen Zahndamm, Luft fließt nasal.',
    sampleWords: [
      { hanzi: '你', pinyin: 'nǐ', meaning: 'du', tone: 3 },
      { hanzi: '那', pinyin: 'nà', meaning: 'jener / das', tone: 4 },
      { hanzi: '年', pinyin: 'nián', meaning: 'Jahr', tone: 2 },
    ],
  },
  {
    pinyin: 'l',
    ipa: 'l',
    category: 'alveolar',
    categoryLabel: 'Zungenspitzenlaute (Alveolare)',
    germanAnalogy: 'Wie deutsches "l" (z. B. in "Licht").',
    articulationTip: 'Zungenspitze am Zahndamm, Luft strömt an den Seiten vorbei.',
    sampleWords: [
      { hanzi: '老师', pinyin: 'lǎoshī', meaning: 'Lehrer', tone: 3 },
      { hanzi: '冷', pinyin: 'lěng', meaning: 'kalt', tone: 3 },
      { hanzi: '来', pinyin: 'lái', meaning: 'kommen', tone: 2 },
    ],
  },

  // Velare
  {
    pinyin: 'g',
    ipa: 'k',
    category: 'velar',
    categoryLabel: 'Zungenwurzel-Laute (Velare)',
    germanAnalogy: 'Wie deutsches stimmloses "g" (z. B. in "Gut"), völlig unbehaucht.',
    articulationTip: 'Hinterer Zungenrücken berührt das Gaumensegel ohne Hauch.',
    sampleWords: [
      { hanzi: '个', pinyin: 'gè', meaning: 'Zählwort (Stück)', tone: 4 },
      { hanzi: '高兴', pinyin: 'gāoxìng', meaning: 'glücklich / erfreut', tone: 1 },
      { hanzi: '狗', pinyin: 'gǒu', meaning: 'Hund', tone: 3 },
    ],
  },
  {
    pinyin: 'k',
    ipa: 'kʰ',
    category: 'velar',
    categoryLabel: 'Zungenwurzel-Laute (Velare)',
    germanAnalogy: 'Wie stark behauchtes deutsches "k" (z. B. in "Kaffee").',
    articulationTip: 'Explosiver Luftstoß von der hinteren Zungenwurzel.',
    sampleWords: [
      { hanzi: '看', pinyin: 'kàn', meaning: 'sehen / lesen / schauen', tone: 4 },
      { hanzi: '开', pinyin: 'kāi', meaning: 'öffnen / fahren', tone: 1 },
      { hanzi: '客气', pinyin: 'kèqi', meaning: 'höflich', tone: 4 },
    ],
  },
  {
    pinyin: 'h',
    ipa: 'x',
    category: 'velar',
    categoryLabel: 'Zungenwurzel-Laute (Velare)',
    germanAnalogy: 'Wie das "ch" in "Bach" oder "Loch" (Ach-Laut), etwas weicher.',
    articulationTip: 'Engpass am Gaumensegel erzeugt ein leichtes Reibegeräusch.',
    sampleWords: [
      { hanzi: '好', pinyin: 'hǎo', meaning: 'gut', tone: 3 },
      { hanzi: '喝', pinyin: 'hē', meaning: 'trinken', tone: 1 },
      { hanzi: '和', pinyin: 'hé', meaning: 'und / mit', tone: 2 },
    ],
  },

  // Alveolopalatale (j, q, x)
  {
    pinyin: 'j',
    ipa: 'tɕ',
    category: 'alveolopalatal',
    categoryLabel: 'Zungenblattlaute (Alveolopalatale)',
    germanAnalogy: 'Ähnlich wie "dsch" in "Dschungel", aber Zungenspitze MUSS UNTEN an den unteren Schneidezähnen bleiben!',
    articulationTip: 'Flacher Zungenrücken drückt an den harten Gaumen. Kein Hauch!',
    sampleWords: [
      { hanzi: '叫', pinyin: 'jiào', meaning: 'heißen / rufen', tone: 4 },
      { hanzi: '几', pinyin: 'jǐ', meaning: 'wie viele (unter 10)', tone: 3 },
      { hanzi: '家', pinyin: 'jiā', meaning: 'Familie / Zuhause', tone: 1 },
    ],
  },
  {
    pinyin: 'q',
    ipa: 'tɕʰ',
    category: 'alveolopalatal',
    categoryLabel: 'Zungenblattlaute (Alveolopalatale)',
    germanAnalogy: 'Ähnlich wie "tsch", aber Zungenspitze liegt UNTEN an den unteren Zähnen + stark behaucht!',
    articulationTip: 'Gleiche Zungenstellung wie "j", aber mit kräftigem Luftstrom.',
    sampleWords: [
      { hanzi: '去', pinyin: 'qù', meaning: 'gehen', tone: 4 },
      { hanzi: '钱', pinyin: 'qián', meaning: 'Geld', tone: 2 },
      { hanzi: '请', pinyin: 'qǐng', meaning: 'bitte / einladen', tone: 3 },
    ],
  },
  {
    pinyin: 'x',
    ipa: 'ɕ',
    category: 'alveolopalatal',
    categoryLabel: 'Zungenblattlaute (Alveolopalatale)',
    germanAnalogy: 'Wie ein scharfes deutsches "ch" in "ich" oder "Chemie".',
    articulationTip: 'Zungenspitze unten, Luft zischt flach über den vorderen Zungenrücken.',
    sampleWords: [
      { hanzi: '小', pinyin: 'xiǎo', meaning: 'klein', tone: 3 },
      { hanzi: '写', pinyin: 'xiě', meaning: 'schreiben', tone: 3 },
      { hanzi: '谢谢', pinyin: 'xièxie', meaning: 'Danke', tone: 4 },
    ],
  },

  // Retroflexe (zh, ch, sh, r)
  {
    pinyin: 'zh',
    ipa: 'ʈʂ',
    category: 'retroflex',
    categoryLabel: 'Retroflexe (Zurückgebogene Zunge)',
    germanAnalogy: 'Ähnlich wie "dsch", aber Zungenspitze ist NACH OBEN/HINTEN zum Gaumendach gerollt. Völlig unbehaucht!',
    articulationTip: 'Lippen entspannt, Zungenspitze berührt Gaumendach hinter dem Zahndamm.',
    sampleWords: [
      { hanzi: '中国', pinyin: 'Zhōngguó', meaning: 'China', tone: 1 },
      { hanzi: '中午', pinyin: 'zhōngwǔ', meaning: 'Mittag', tone: 1 },
      { hanzi: '住', pinyin: 'zhù', meaning: 'wohnen', tone: 4 },
    ],
  },
  {
    pinyin: 'ch',
    ipa: 'ʈʂʰ',
    category: 'retroflex',
    categoryLabel: 'Retroflexe (Zurückgebogene Zunge)',
    germanAnalogy: 'Ähnlich wie "tsch", Zungenspitze nach oben gerollt + STARK BEHAUCHT.',
    articulationTip: 'Gleiche Zungenhaltung wie "zh", aber mit explosivem Luftausstoß.',
    sampleWords: [
      { hanzi: '吃', pinyin: 'chī', meaning: 'essen', tone: 1 },
      { hanzi: '茶', pinyin: 'chá', meaning: 'Tee', tone: 2 },
      { hanzi: '出租车', pinyin: 'chūzūchē', meaning: 'Taxi', tone: 1 },
    ],
  },
  {
    pinyin: 'sh',
    ipa: 'ʂ',
    category: 'retroflex',
    categoryLabel: 'Retroflexe (Zurückgebogene Zunge)',
    germanAnalogy: 'Wie ein tiefes "sch", Zungenspitze zum Gaumendach zurückgebogen.',
    articulationTip: 'Reibelaut mit hohlem, dumpfem Klang (im Unterschied zu flachem s oder x).',
    sampleWords: [
      { hanzi: '是', pinyin: 'shì', meaning: 'sein', tone: 4 },
      { hanzi: '书', pinyin: 'shū', meaning: 'Buch', tone: 1 },
      { hanzi: '水', pinyin: 'shuǐ', meaning: 'Wasser', tone: 3 },
    ],
  },
  {
    pinyin: 'r',
    ipa: 'ʐ / ɻ',
    category: 'retroflex',
    categoryLabel: 'Retroflexe (Zurückgebogene Zunge)',
    germanAnalogy: 'Ähnlich wie ein stimmhaftes "sch" (wie das "j" in "Journalist"), aber die Zungenspitze wird weit nach oben/hinten an den Gaumen gerollt.',
    articulationTip: 'Stimmbänder schwingen mit, Zungenspitze vibriert nicht.',
    sampleWords: [
      { hanzi: '人', pinyin: 'rén', meaning: 'Mensch / Person', tone: 2 },
      { hanzi: '热', pinyin: 'rè', meaning: 'heiß', tone: 4 },
      { hanzi: '日', pinyin: 'rì', meaning: 'Tag / Sonne', tone: 4 },
    ],
  },

  // Dentale Sibilanten (z, c, s)
  {
    pinyin: 'z',
    ipa: 'ts',
    category: 'dental_sibilant',
    categoryLabel: 'Dentale Zischlaute (Sibilanten)',
    germanAnalogy: 'Wie deutsches stimmloses "z" oder "ts" (z. B. in "Zug"), völlig unbehaucht.',
    articulationTip: 'Zungenspitze liegt an der Rückseite der oberen Schneidezähne.',
    sampleWords: [
      { hanzi: '字', pinyin: 'zì', meaning: 'Schriftzeichen', tone: 4 },
      { hanzi: '再见', pinyin: 'zàijiàn', meaning: 'Auf Wiedersehen', tone: 4 },
      { hanzi: '在', pinyin: 'zài', meaning: 'in / an / bei', tone: 4 },
    ],
  },
  {
    pinyin: 'c',
    ipa: 'tsʰ',
    category: 'dental_sibilant',
    categoryLabel: 'Dentale Zischlaute (Sibilanten)',
    germanAnalogy: 'Wie stark behauchtes "ts-h" (z. B. wie in "Blitz-Hitze").',
    articulationTip: 'Gleiche Zahnstellung wie "z", aber mit kräftigem Luftausstoß.',
    sampleWords: [
      { hanzi: '菜', pinyin: 'cài', meaning: 'Gericht / Speise', tone: 4 },
      { hanzi: '从', pinyin: 'cóng', meaning: 'von / aus', tone: 2 },
      { hanzi: '错', pinyin: 'cuò', meaning: 'falsch / Fehler', tone: 4 },
    ],
  },
  {
    pinyin: 's',
    ipa: 's',
    category: 'dental_sibilant',
    categoryLabel: 'Dentale Zischlaute (Sibilanten)',
    germanAnalogy: 'Wie scharfes deutsches "s" oder "ß" (z. B. in "Wasser" oder "Straße").',
    articulationTip: 'Zungenspitze flach an den unteren Vorderzähnen.',
    sampleWords: [
      { hanzi: '四', pinyin: 'sì', meaning: 'vier', tone: 4 },
      { hanzi: '岁', pinyin: 'suì', meaning: 'Jahre alt', tone: 4 },
      { hanzi: '三', pinyin: 'sān', meaning: 'drei', tone: 1 },
    ],
  },

  // Halbvokale
  {
    pinyin: 'y',
    ipa: 'j',
    category: 'semi_vowel',
    categoryLabel: 'Halbvokale / Null-Anlaute',
    germanAnalogy: 'Wie deutsches "j" in "Jahr". Steht vor Silben, die mit "i" oder "ü" beginnen.',
    articulationTip: 'Orthographischer Anlaut für vokalisch anlautende Silben.',
    sampleWords: [
      { hanzi: '月', pinyin: 'yuè', meaning: 'Monat / Mond', tone: 4 },
      { hanzi: '医生', pinyin: 'yīshēng', meaning: 'Arzt', tone: 1 },
      { hanzi: '有', pinyin: 'yǒu', meaning: 'haben', tone: 3 },
    ],
  },
  {
    pinyin: 'w',
    ipa: 'w',
    category: 'semi_vowel',
    categoryLabel: 'Halbvokale / Null-Anlaute',
    germanAnalogy: 'Wie ein weicher Gleitlaut "u" (wie engl. "water"), Lippen spitz runden ohne Zahnkontakt. Steht vor Silben, die mit "u" beginnen.',
    articulationTip: 'Lippen rund geformt ohne Zahnkontakt.',
    sampleWords: [
      { hanzi: '我', pinyin: 'wǒ', meaning: 'ich', tone: 3 },
      { hanzi: '五', pinyin: 'wǔ', meaning: 'fünf', tone: 3 },
      { hanzi: '喂', pinyin: 'wèi', meaning: 'Hallo (am Telefon)', tone: 4 },
    ],
  },
];

export const FINALS: readonly FinalData[] = [
  // Einfache Vokale
  {
    pinyin: 'a',
    ipa: 'a',
    category: 'simple',
    categoryLabel: 'Einfache Vokale (Monophthonge)',
    germanAnalogy: 'Wie offenes deutsches "a" in "Vater".',
    sampleWords: [{ hanzi: '八', pinyin: 'bā', meaning: 'acht', tone: 1 }],
  },
  {
    pinyin: 'o',
    ipa: 'o',
    category: 'simple',
    categoryLabel: 'Einfache Vokale (Monophthonge)',
    germanAnalogy: 'Wie deutsches "o" in "Sonne" mit leichter Lippenrundung.',
    sampleWords: [{ hanzi: '波', pinyin: 'bō', meaning: 'Welle', tone: 1 }],
  },
  {
    pinyin: 'e',
    ipa: 'ɤ',
    category: 'simple',
    categoryLabel: 'Einfache Vokale (Monophthonge)',
    germanAnalogy: 'Wie ein tief im Rachen gebildetes "e/ö" (Mundform wie bei "o", aber Lippen flach und ungerundet lassen — wie der Laut beim Zögern "ähm").',
    sampleWords: [{ hanzi: '喝', pinyin: 'hē', meaning: 'trinken', tone: 1 }],
  },
  {
    pinyin: 'i',
    ipa: 'i',
    category: 'simple',
    categoryLabel: 'Einfache Vokale (Monophthonge)',
    germanAnalogy: 'Wie langes deutsches "i" in "Biber". (Achtung: Nach zh/ch/sh/r und z/c/s als summendes Sonder-i gesprochen!)',
    sampleWords: [{ hanzi: '七', pinyin: 'qī', meaning: 'sieben', tone: 1 }],
  },
  {
    pinyin: 'u',
    ipa: 'u',
    category: 'simple',
    categoryLabel: 'Einfache Vokale (Monophthonge)',
    germanAnalogy: 'Wie deutsches "u" in "Mutter".',
    sampleWords: [{ hanzi: '不', pinyin: 'bù', meaning: 'nicht', tone: 4 }],
  },
  {
    pinyin: 'ü',
    ipa: 'y',
    category: 'simple',
    categoryLabel: 'Einfache Vokale (Monophthonge)',
    germanAnalogy: 'Wie deutsches "ü" in "Tür" (Lippen spitz gerundet wie bei "u", Zunge vorn wie bei "i").',
    sampleWords: [{ hanzi: '绿', pinyin: 'lǜ', meaning: 'grün', tone: 4 }],
  },

  // Zusammengesetzte Diphthonge
  {
    pinyin: 'ai',
    ipa: 'aɪ',
    category: 'compound',
    categoryLabel: 'Zusammengesetzte Vokale (Diphthonge)',
    germanAnalogy: 'Wie "ei" in "Mai" oder "Eis".',
    sampleWords: [{ hanzi: '买', pinyin: 'mǎi', meaning: 'kaufen', tone: 3 }],
  },
  {
    pinyin: 'ei',
    ipa: 'eɪ',
    category: 'compound',
    categoryLabel: 'Zusammengesetzte Vokale (Diphthonge)',
    germanAnalogy: 'Wie das deutsche "ey" (z. B. in "Hey!"), offenes "e" gleitet weich in ein kurzes "i".',
    sampleWords: [{ hanzi: '杯子', pinyin: 'bēizi', meaning: 'Becher', tone: 1 }],
  },
  {
    pinyin: 'ao',
    ipa: 'aʊ',
    category: 'compound',
    categoryLabel: 'Zusammengesetzte Vokale (Diphthonge)',
    germanAnalogy: 'Wie deutsches "au" in "Haus".',
    sampleWords: [{ hanzi: '猫', pinyin: 'māo', meaning: 'Katze', tone: 1 }],
  },
  {
    pinyin: 'ou',
    ipa: 'oʊ',
    category: 'compound',
    categoryLabel: 'Zusammengesetzte Vokale (Diphthonge)',
    germanAnalogy: 'Ein volles deutsches "o", das fließend in ein kurzes "u" gleitet (wie wenn man staunend "Oh!" ruft und die Lippen zu "u" schließt: "O-u").',
    sampleWords: [{ hanzi: '狗', pinyin: 'gǒu', meaning: 'Hund', tone: 3 }],
  },
  {
    pinyin: 'ia',
    ipa: 'ja',
    category: 'compound',
    categoryLabel: 'Zusammengesetzte Vokale (Diphthonge)',
    germanAnalogy: 'Wie "ja" in "Jacke".',
    sampleWords: [{ hanzi: '家', pinyin: 'jiā', meaning: 'Familie / Zuhause', tone: 1 }],
  },
  {
    pinyin: 'ie',
    ipa: 'jɛ',
    category: 'compound',
    categoryLabel: 'Zusammengesetzte Vokale (Diphthonge)',
    germanAnalogy: 'Wie "je" in "jetzt".',
    sampleWords: [{ hanzi: '谢谢', pinyin: 'xièxie', meaning: 'Danke', tone: 4 }],
  },
  {
    pinyin: 'ua',
    ipa: 'wa',
    category: 'compound',
    categoryLabel: 'Zusammengesetzte Vokale (Diphthonge)',
    germanAnalogy: 'Wie "wa" in "Wasser" (mit gerundeten Lippen).',
    sampleWords: [{ hanzi: '花', pinyin: 'huā', meaning: 'Blume', tone: 1 }],
  },
  {
    pinyin: 'uo',
    ipa: 'wɔ',
    category: 'compound',
    categoryLabel: 'Zusammengesetzte Vokale (Diphthonge)',
    germanAnalogy: 'Wie ein schnelles, fließendes "u-o" (wie das "uo" in "Status quo" oder wenn man "du oft" flüssig verbindet: kurzes "u" gleitet in ein offenes "o").',
    sampleWords: [{ hanzi: '桌子', pinyin: 'zhuōzi', meaning: 'Tisch', tone: 1 }],
  },
  {
    pinyin: 'üe / ue',
    ipa: 'yɛ',
    category: 'compound',
    categoryLabel: 'Zusammengesetzte Vokale (Diphthonge)',
    germanAnalogy: 'Wie "ü" gefolgt von einem offenen "e" (Lippen spitz, gleitend in kurzes "e").',
    sampleWords: [{ hanzi: '月', pinyin: 'yuè', meaning: 'Monat / Mond', tone: 4 }],
  },
  {
    pinyin: 'iao',
    ipa: 'jaʊ',
    category: 'compound',
    categoryLabel: 'Zusammengesetzte Vokale (Diphthonge)',
    germanAnalogy: 'Wie "i-a-u" schnell aneinandergereiht (fließender Übergang von "i" über "a" zu "u", wie "Miau").',
    sampleWords: [{ hanzi: '小', pinyin: 'xiǎo', meaning: 'klein', tone: 3 }],
  },
  {
    pinyin: 'iu',
    ipa: 'joʊ',
    category: 'compound',
    categoryLabel: 'Zusammengesetzte Vokale (Diphthonge)',
    germanAnalogy: 'Wie "i-o-u" (Abkürzung von iou: beginnt mit kurzem "i" und gleitet weich in "ou").',
    sampleWords: [
      { hanzi: '九', pinyin: 'jiǔ', meaning: 'neun', tone: 3 },
      { hanzi: '六', pinyin: 'liù', meaning: 'sechs', tone: 4 },
    ],
  },
  {
    pinyin: 'uai',
    ipa: 'waɪ',
    category: 'compound',
    categoryLabel: 'Zusammengesetzte Vokale (Diphthonge)',
    germanAnalogy: 'Wie ein schnelles "u-ai" (weiches "u" gleitet in helles deutsches "ei").',
    sampleWords: [{ hanzi: '快', pinyin: 'kuài', meaning: 'schnell', tone: 4 }],
  },
  {
    pinyin: 'ui',
    ipa: 'weɪ',
    category: 'compound',
    categoryLabel: 'Zusammengesetzte Vokale (Diphthonge)',
    germanAnalogy: 'Wie "u-e-i" (Abkürzung von uei: kurzes "u" gleitet in weiches "ei").',
    sampleWords: [
      { hanzi: '水', pinyin: 'shuǐ', meaning: 'Wasser', tone: 3 },
      { hanzi: '对', pinyin: 'duì', meaning: 'richtig / korrekt', tone: 4 },
    ],
  },

  // Nasale Auslaute (-n)
  {
    pinyin: 'an',
    ipa: 'an',
    category: 'nasal_front',
    categoryLabel: 'Vordere Nasalauslaute (-n)',
    germanAnalogy: 'Wie "an" in "Mann" (Zungenspitze tippt vorn an die oberen Schneidezähne).',
    sampleWords: [{ hanzi: '三', pinyin: 'sān', meaning: 'drei', tone: 1 }],
  },
  {
    pinyin: 'en',
    ipa: 'ən',
    category: 'nasal_front',
    categoryLabel: 'Vordere Nasalauslaute (-n)',
    germanAnalogy: 'Wie deutsches "-en" in "laufen" (dumpfer Vokal, Zungenspitze am Zahndamm).',
    sampleWords: [{ hanzi: '人', pinyin: 'rén', meaning: 'Mensch', tone: 2 }],
  },
  {
    pinyin: 'in',
    ipa: 'in',
    category: 'nasal_front',
    categoryLabel: 'Vordere Nasalauslaute (-n)',
    germanAnalogy: 'Wie deutsches "in" in "Kinn" (helles "i" mit sauberem Zungenschluss am Zahndamm).',
    sampleWords: [
      { hanzi: '您', pinyin: 'nín', meaning: 'Sie (höfliche Anrede)', tone: 2 },
      { hanzi: '今天', pinyin: 'jīntiān', meaning: 'heute', tone: 1 },
    ],
  },
  {
    pinyin: 'ian',
    ipa: 'jɛn',
    category: 'nasal_front',
    categoryLabel: 'Vordere Nasalauslaute (-n)',
    germanAnalogy: 'Wichtige Aussprachefalle: Klingt nicht wie "-ian", sondern wie "i-än" (helles "i" gleitet in offenes deutsches "än" wie in "Hände", Zungenspitze schließt vorn am Zahndamm).',
    sampleWords: [
      { hanzi: '天', pinyin: 'tiān', meaning: 'Himmel / Tag', tone: 1 },
      { hanzi: '见', pinyin: 'jiàn', meaning: 'sehen / treffen', tone: 4 },
    ],
  },
  {
    pinyin: 'uan',
    ipa: 'wan',
    category: 'nasal_front',
    categoryLabel: 'Vordere Nasalauslaute (-n)',
    germanAnalogy: 'Wie fließendes "u-an" (Lippen rund bei "u", Zungenspitze schließt bei "-n").',
    sampleWords: [{ hanzi: '关', pinyin: 'guān', meaning: 'schließen', tone: 1 }],
  },
  {
    pinyin: 'un',
    ipa: 'wən',
    category: 'nasal_front',
    categoryLabel: 'Vordere Nasalauslaute (-n)',
    germanAnalogy: 'Wie "u-e-n" (Abkürzung von uen: kurzes "u" gleitet über ein dumpfes "e" in "-n").',
    sampleWords: [{ hanzi: '春', pinyin: 'chūn', meaning: 'Frühling', tone: 1 }],
  },
  {
    pinyin: 'ün',
    ipa: 'yn',
    category: 'nasal_front',
    categoryLabel: 'Vordere Nasalauslaute (-n)',
    germanAnalogy: 'Wie deutsches "ün" in "dünn" oder "kühn" (spitze Lippen, Zungenspitze tippt vorn an).',
    sampleWords: [{ hanzi: '裙子', pinyin: 'qúnzi', meaning: 'Rock / Kleid', tone: 2 }],
  },
  {
    pinyin: 'üan',
    ipa: 'yɛn',
    category: 'nasal_front',
    categoryLabel: 'Vordere Nasalauslaute (-n)',
    germanAnalogy: 'Wichtige Aussprachefalle: Klingt wie "ü-än" (spitze Lippen wie bei "ü", die in ein helles deutsches "än" gleiten; Zungenspitze schließt vorn).',
    sampleWords: [{ hanzi: '远', pinyin: 'yuǎn', meaning: 'weit / fern', tone: 3 }],
  },

  // Nasale Auslaute (-ng)
  {
    pinyin: 'ang',
    ipa: 'ɑŋ',
    category: 'nasal_back',
    categoryLabel: 'Hintere Nasalauslaute (-ng)',
    germanAnalogy: 'Wie "ang" in "Gesang" (Zungenwurzel schließt Gaumen, kein deutsches "g" aussprechen!).',
    sampleWords: [{ hanzi: '上', pinyin: 'shàng', meaning: 'oben / aufsteigen', tone: 4 }],
  },
  {
    pinyin: 'eng',
    ipa: 'əŋ',
    category: 'nasal_back',
    categoryLabel: 'Hintere Nasalauslaute (-ng)',
    germanAnalogy: 'Wie "eng" in "enger" (Gaumenschluss im Rachen, tiefer Resonanzraum).',
    sampleWords: [{ hanzi: '朋', pinyin: 'péng', meaning: 'Freund', tone: 2 }],
  },
  {
    pinyin: 'ing',
    ipa: 'iŋ',
    category: 'nasal_back',
    categoryLabel: 'Hintere Nasalauslaute (-ng)',
    germanAnalogy: 'Wie deutsches "ing" in "Ring" (Zungenwurzel blockiert Gaumensegel).',
    sampleWords: [{ hanzi: '听', pinyin: 'tīng', meaning: 'hören', tone: 1 }],
  },
  {
    pinyin: 'ong',
    ipa: 'ʊŋ',
    category: 'nasal_back',
    categoryLabel: 'Hintere Nasalauslaute (-ng)',
    germanAnalogy: 'Wie deutsches "ung" in "Sprung" oder "ong" in "Gong".',
    sampleWords: [{ hanzi: '中', pinyin: 'zhōng', meaning: 'Mitte / China', tone: 1 }],
  },
  {
    pinyin: 'iang',
    ipa: 'jɑŋ',
    category: 'nasal_back',
    categoryLabel: 'Hintere Nasalauslaute (-ng)',
    germanAnalogy: 'Wie "i" + hinteres "ang" (wie "i" + "Gesang", weicher Gaumenschluss).',
    sampleWords: [{ hanzi: '想', pinyin: 'xiǎng', meaning: 'denken / möchten', tone: 3 }],
  },
  {
    pinyin: 'uang',
    ipa: 'wɑŋ',
    category: 'nasal_back',
    categoryLabel: 'Hintere Nasalauslaute (-ng)',
    germanAnalogy: 'Wie "u" + hinteres "ang" (weiches "u" gleitet in tiefes "ang").',
    sampleWords: [{ hanzi: '黄', pinyin: 'huáng', meaning: 'gelb', tone: 2 }],
  },
  {
    pinyin: 'iong',
    ipa: 'jʊŋ',
    category: 'nasal_back',
    categoryLabel: 'Hintere Nasalauslaute (-ng)',
    germanAnalogy: 'Wie "i" + dumpfes "ung/ong" mit Gaumenschluss im Rachen.',
    sampleWords: [{ hanzi: '穷', pinyin: 'qióng', meaning: 'arm', tone: 2 }],
  },

  // Sonderauslaute (Retroflex)
  {
    pinyin: 'er',
    ipa: 'aɚ',
    category: 'special',
    categoryLabel: 'Sonderauslaute (Retroflexes R)',
    germanAnalogy: 'Ein kehliger Laut, bei dem sich die Zungenspitze während des Sprechens nach oben und hinten zum harten Gaumen rollt, ohne ihn zu berühren (Erhua-Laut).',
    sampleWords: [
      { hanzi: '儿子', pinyin: 'érzi', meaning: 'Sohn', tone: 2 },
      { hanzi: '二', pinyin: 'èr', meaning: 'zwei', tone: 4 },
    ],
  },
];

export const TONE_SANDHI_RULES: readonly ToneSandhiRule[] = [
  {
    id: 'third-third-sandhi',
    title: 'Zwei 3. Töne hintereinander',
    chinese: '三声变调 (Sān shēng biàntiào)',
    badge: '3 + 3 → 2 + 3',
    ruleExplanation:
      'Treffen zwei Silben im 3. Ton direkt aufeinander, wird die ERSTE Silbe zur besseren Sprechbarkeit als 2. Ton (steigend) ausgesprochen. Im Schriftbild (Pinyin) bleibt der 3. Ton meist unverändert notiert, aber die Aussprache MUSS zwingend wechseln.',
    exampleOriginal: 'nǐ (3) + hǎo (3)',
    exampleSpoken: 'ní hǎo (2 + 3)',
    exampleHanzi: '你好',
    exampleMeaning: 'Hallo / Guten Tag',
    moreExamples: [
      { original: 'kě (3) + yǐ (3)', spoken: 'kéyǐ (2+3)', hanzi: '可以', meaning: 'können / dürfen' },
      { original: 'shuǐ (3) + guǒ (3)', spoken: 'shuíguǒ (2+3)', hanzi: '水果', meaning: 'Obst / Früchte' },
      { original: 'shǒu (3) + biǎo (3)', spoken: 'shóubiǎo (2+3)', hanzi: '手表', meaning: 'Armbanduhr' },
      { original: 'hěn (3) + hǎo (3)', spoken: 'hénhǎo (2+3)', hanzi: '很好', meaning: 'sehr gut' },
    ],
  },
  {
    id: 'yi-sandhi',
    title: 'Tonveränderung bei "一" (yī)',
    chinese: '“一”的变调 (Yī de biàntiào)',
    badge: 'yī / yí / yì',
    ruleExplanation:
      'Das Wort für "eins" (一) hat im Wörterbuch den 1. Ton (yī). Im Satzkontext ändert es sich jedoch nach festen Regeln: Vor einem 4. Ton wird es zum 2. Ton (yí); vor dem 1., 2. oder 3. Ton wird es zum 4. Ton (yì). Nur beim reinen Zählen oder in Zahlenreihen bleibt es 1. Ton.',
    exampleOriginal: 'yī (1) + gè (4)',
    exampleSpoken: 'yí gè (2 + 4)',
    exampleHanzi: '一个',
    exampleMeaning: 'ein / ein Stück',
    moreExamples: [
      { original: 'yī (1) + tiān (1)', spoken: 'yì tiān (4+1)', hanzi: '一天', meaning: 'ein Tag (vor 1. Ton)' },
      { original: 'yī (1) + nián (2)', spoken: 'yì nián (4+2)', hanzi: '一年', meaning: 'ein Jahr (vor 2. Ton)' },
      { original: 'yī (1) + qǐ (3)', spoken: 'yì qǐ (4+3)', hanzi: '一起', meaning: 'zusammen (vor 3. Ton)' },
      { original: 'yī, èr, sān', spoken: 'yī, èr, sān (1)', hanzi: '一，二，三', meaning: 'Eins, zwei, drei (Zählen)' },
    ],
  },
  {
    id: 'bu-sandhi',
    title: 'Tonveränderung bei "不" (bù)',
    chinese: '“不”的变调 (Bù de biàntiào)',
    badge: 'bù / bú',
    ruleExplanation:
      'Die Verneinungspartikel "不" steht standardmäßig im 4. Ton (bù). Folgt direkt danach jedoch ein weiteres Wort im 4. Ton, wechselt "不" in den 2. Ton (bú), um das Aufeinanderprallen zweier scharfer Falltöne zu vermeiden.',
    exampleOriginal: 'bù (4) + shì (4)',
    exampleSpoken: 'bú shì (2 + 4)',
    exampleHanzi: '不是',
    exampleMeaning: 'ist nicht / nicht sein',
    moreExamples: [
      { original: 'bù (4) + duì (4)', spoken: 'bú duì (2+4)', hanzi: '不对', meaning: 'nicht richtig / falsch' },
      { original: 'bù (4) + qù (4)', spoken: 'bú qù (2+4)', hanzi: '不去', meaning: 'nicht gehen' },
      { original: 'bù (4) + hē (1)', spoken: 'bù hē (4+1)', hanzi: '不喝', meaning: 'nicht trinken (bleibt 4. Ton)' },
      { original: 'bù (4) + hǎo (3)', spoken: 'bù hǎo (4+3)', hanzi: '不好', meaning: 'nicht gut (bleibt 4. Ton)' },
    ],
  },
  {
    id: 'neutral-tone',
    title: 'Der neutrale Ton (轻声 Qīngshēng)',
    chinese: '轻声 (Qīngshēng)',
    badge: 'Ton 5 (Tonlos)',
    ruleExplanation:
      'Manche Silben tragen im gesprochenen Chinesisch keinen Ton. Sie werden extrem kurz, leise und unbetont artikuliert. Ihre Tonhöhe richtet sich nach dem vorangehenden Ton (nach 1./2. Ton etwas tiefer, nach 3. Ton leicht erhöht).',
    exampleOriginal: 'ma, de, ba',
    exampleSpoken: 'kurz & unbetont',
    exampleHanzi: '吗，的，吧',
    exampleMeaning: 'Grammatikalische Partikeln',
    moreExamples: [
      { original: 'mā (1) + ma (5)', spoken: 'māma', hanzi: '妈妈', meaning: 'Mama / Mutter' },
      { original: 'péng (2) + you (5)', spoken: 'péngyou', hanzi: '朋友', meaning: 'Freund' },
      { original: 'wǒ (3) + men (5)', spoken: 'wǒmen', hanzi: '我们', meaning: 'wir' },
      { original: 'tā (1) + de (5)', spoken: 'tā de', hanzi: '他的', meaning: 'sein / seine' },
    ],
  },
];

export const ORTHOGRAPHY_RULES: readonly OrthographyRule[] = [
  {
    id: 'u-umlaut-rule',
    title: 'Die ü-Pünktchen-Regel (j, q, x vs. n, l)',
    summary: 'Warum verliert ü seine Pünktchen nach j, q, x, behält sie aber nach n und l?',
    ruleFormula: 'j / q / x / y + ü → ju / qu / xu / yu',
    detail:
      'Im modernen Standardchinesisch gibt es hinter den Alveolopalatalen j, q, x und dem Null-Anlaut y niemals den Laut "u" (wie in "Mutter"), sondern AUSSCHLIESSLICH den Laut "ü" (wie in "Tür"). Um Schriftzeichen im lateinischen Alphabet zu vereinfachen, lässt man die beiden Pünktchen über dem u einfach weg! Bei n und l existieren hingegen beide Laute (nu vs. nü, lu vs. lü), weshalb dort die Pünktchen zwingend stehen bleiben müssen.',
    examples: [
      { correct: 'qù (gesprochen [tɕʰy])', wrong: 'qǜ', note: 'Pünktchen fallen weg' },
      { correct: 'yuè (gesprochen [yɛ])', wrong: 'yüè', note: 'Pünktchen fallen weg' },
      { correct: 'lǚxíng', note: 'Pünktchen MÜSSEN bleiben, da es auch lù gibt' },
      { correct: 'nǚ’ér', note: 'Pünktchen MÜSSEN bleiben, da es auch nǔ gibt' },
    ],
  },
  {
    id: 'apostrophe-rule',
    title: 'Das Silbentrennungs-Apostroph (隔音符号)',
    summary: 'Verhindert Fehlinterpretationen von Silbengrenzen bei Vokalbeginn (a, o, e).',
    ruleFormula: 'Silbe + \' + a/o/e',
    detail:
      'Beginnt eine Silbe mit den Vokalen a, o oder e und folgt unmittelbar auf eine andere Silbe, wird ein Apostroph gesetzt, wenn sonst Unklarheiten über die Silbentrennung entstünden. Ohne Apostroph könnte "xī’ān" (Stadt Xi\'an) als "xian" (eine einzige Silbe) gelesen werden.',
    examples: [
      { correct: 'Xī\'ān (西安)', wrong: 'Xian (先/线)', note: 'Zwei Silben (xī + ān)' },
      { correct: 'Tiān\'ānmén (天安门)', wrong: 'Tiananmen', note: 'Verhindert Verschleifung' },
      { correct: 'pí\'ǎo (皮袄)', note: 'Pelzjacke (pí + ǎo)' },
    ],
  },
  {
    id: 'abbreviated-vowels',
    title: 'Zusammengezogene Schreibweisen (iu, ui, un)',
    summary: 'Historische Vereinfachung: iou → iu, uei → ui, uen → un.',
    ruleFormula: 'i + ou → iu | u + ei → ui | u + en → un',
    detail:
      'Wenn iou, uei oder uen mit einem Konsonanten kombiniert werden, wird der mittlere Buchstabe im Pinyin weggelassen. Gesprochen bleibt der Mittelvokal jedoch leicht hörbar!',
    examples: [
      { correct: 'jiǔ (neun)', wrong: 'jiǒu', note: 'Geschrieben iu, gesprochen i-o-u' },
      { correct: 'shuǐ (Wasser)', wrong: 'shuěi', note: 'Geschrieben ui, gesprochen u-e-i' },
      { correct: 'chūn (Frühling)', wrong: 'chuēn', note: 'Geschrieben un, gesprochen u-e-n' },
    ],
  },
];
