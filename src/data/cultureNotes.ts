export interface CultureTopic {
  id: string;
  category: 'names' | 'etiquette' | 'numbers' | 'dining' | 'lifestyle';
  categoryLabel: string;
  titleChinese: string;
  titlePinyin: string;
  titleGerman: string;
  badge: string;
  summary: string;
  keyTakeaways: string[];
  etiquetteTip: string;
  vocabulary: { hanzi: string; pinyin: string; meaning: string }[];
}

export const CULTURE_TOPICS: readonly CultureTopic[] = [
  {
    id: 'chinese-names',
    category: 'names',
    categoryLabel: 'Namen & Anrede',
    titleChinese: '中国人的姓名与称呼',
    titlePinyin: 'Zhōngguórén de xìngmíng yǔ chēnghu',
    titleGerman: 'Chinesische Namen & Höfliche Anrede',
    badge: 'Nachname zuerst',
    summary:
      'In China steht der Familienname (姓 xìng) IMMER vor dem Vornamen (名 míng). Aus "Li Yue" wird also nicht Herr Yue, sondern Herr/Frau Li! Im Berufsleben spricht man Personen fast nie mit dem Vornamen an, sondern verbindet den Nachnamen mit dem Berufstitel.',
    keyTakeaways: [
      'Familienname zuerst: Bei "王小明" (Wáng Xiǎomíng) ist 王 (Wáng) die Familie und 小明 (Xiǎomíng) der Vorname.',
      'Die meisten Nachnamen sind einsilbig (z. B. 王 Wáng, 李 Lǐ, 张 Zhāng, 刘 Liú, 陈 Chén). Die Vornamen sind meist ein- oder zweisilbig.',
      'Höfliche Berufs-Anrede: Nachname + Titel (z. B. 王老师 Wáng lǎoshī = Lehrer Wang, 李医生 Lǐ yīshēng = Arzt Li).',
      'Herr & Frau: 张先生 (Zhāng xiānsheng = Herr Zhang), 王小姐 (Wáng xiǎojiě = Fräulein/Frau Wang).',
    ],
    etiquetteTip:
      'Nenne Arbeitskollegen oder Höhergestellte niemals beim bloßen Vornamen, es sei denn, man bietet dir ausdrücklich eine informelle Freundschafts-Anrede an.',
    vocabulary: [
      { hanzi: '老师', pinyin: 'lǎoshī', meaning: 'Lehrer / Dozent' },
      { hanzi: '医生', pinyin: 'yīshēng', meaning: 'Arzt' },
      { hanzi: '先生', pinyin: 'xiānsheng', meaning: 'Herr / Ehemann' },
      { hanzi: '名字', pinyin: 'míngzi', meaning: 'Name' },
    ],
  },
  {
    id: 'number-gestures',
    category: 'numbers',
    categoryLabel: 'Zahlensystem & Gesten',
    titleChinese: '中国手势数字',
    titlePinyin: 'Zhōngguó shǒushì shùzì',
    titleGerman: 'Chinesische Zahlengesten (1–10 mit einer Hand)',
    badge: '1 Hand für 1–10',
    summary:
      'Auf chinesischen Märkten und im Alltag zählt man von 1 bis 10 mit nur EINER einzigen Hand. Während 1 bis 5 den europäischen Gesten ähneln, sind 6 bis 10 einzigartige Symbole.',
    keyTakeaways: [
      '6 (六 liù): Daumen und kleiner Finger ausgestreckt (ähnlich wie das Surfer- "Hang Loose"-Zeichen).',
      '7 (七 qī): Daumen, Zeigefinger und Mittelfinger berühren sich mit den Spitzen (wie eine Prise Salz).',
      '8 (八 bā): Daumen und Zeigefinger bilden ein L / eine Pistole (symbolisiert die Strichform von 八).',
      '9 (九 jiǔ): Zeigefinger zu einem Haken gekrümmt (symbolisiert den Hakenstrich von 九).',
      '10 (十 shí): Entweder eine geschlossene Faust oder zwei gekreuzte Zeigefinger wie ein Pluszeichen (十).',
    ],
    etiquetteTip:
      'Diese Gesten sind extrem nützlich auf lauten Nachtmärkten oder beim Feilschen, um Missverständnisse bei Preisen sofort visuell aufzulösen.',
    vocabulary: [
      { hanzi: '六', pinyin: 'liù', meaning: 'sechs' },
      { hanzi: '七', pinyin: 'qī', meaning: 'sieben' },
      { hanzi: '八', pinyin: 'bā', meaning: 'acht' },
      { hanzi: '九', pinyin: 'jiǔ', meaning: 'neun' },
      { hanzi: '十', pinyin: 'shí', meaning: 'zehn' },
    ],
  },
  {
    id: 'number-symbolism',
    category: 'numbers',
    categoryLabel: 'Zahlensymbolik',
    titleChinese: '数字的吉凶寓意',
    titlePinyin: 'Shùzì de jíxiōng yùyì',
    titleGerman: 'Glücks- & Unglückszahlen im Chinesischen',
    badge: '8 = Glück / 4 = Tabu',
    summary:
      'Chinesen lieben Wortspiele durch Homophonie (Klangähnlichkeit). Bestimmte Zahlen klingen ähnlich wie Glückswörter und sind heiß begehrt (Telefonnummern, Autokennzeichen, Hochzeitstermine), während andere strikt gemieden werden.',
    keyTakeaways: [
      'Die Glückszahl 8 (八 bā): Klingt ähnlich wie 发 (fā - reich werden / Wohlstand erlangen). Die Olympischen Spiele in Peking begannen am 08.08.2008 um 08:08 Uhr!',
      'Die Glückszahl 6 (六 liù): Klingt wie 流 / 溜 (liú - reibungslos / fließend). Beliebter Spruch: 六六大顺 (Alles möge glattlaufen).',
      'Die Glückszahl 9 (九 jiǔ): Klingt exakt wie 久 (jiǔ - ewig / langlebig). Symbol für dauerhafte Freundschaft und Treue.',
      'Die Unglückszahl 4 (四 sì): Klingt fast identisch wie 死 (sǐ - sterben, 3. Ton). In vielen chinesischen Hochhäusern und Krankenhäusern gibt es kein 4., 14. oder 24. Stockwerk.',
    ],
    etiquetteTip:
      'Vermeide es, Geldgeschenke (im roten Umschlag 红包 hóngbāo) mit einer 4 im Betrag zu verschenken. Wähle stattdessen Beträge mit einer 8 oder 6 (z. B. 88 oder 666 Yuan).',
    vocabulary: [
      { hanzi: '四', pinyin: 'sì', meaning: 'vier (Unglückszahl)' },
      { hanzi: '八', pinyin: 'bā', meaning: 'acht (Wohlstand)' },
      { hanzi: '钱', pinyin: 'qián', meaning: 'Geld' },
      { hanzi: '大', pinyin: 'dà', meaning: 'groß' },
    ],
  },
  {
    id: 'tea-and-dining',
    category: 'dining',
    categoryLabel: 'Tisch- & Teekultur',
    titleChinese: '茶文化与餐桌礼仪',
    titlePinyin: 'Chá wénhuà yǔ cānzhuō lǐyí',
    titleGerman: 'Tischsitten & die chinesische Teekultur',
    badge: 'Erst für andere einschenken',
    summary:
      'Gemeinsames Essen und Teetrinken ist der Dreh- und Angelpunkt gesellschaftlicher Beziehungen (Guanxi) in China. Bestimmte Rituale zeigen Respekt und Gastfreundschaft.',
    keyTakeaways: [
      'Tee einschenken: Schenke IMMER zuerst den Gläsern der Tischnachbarn nach, bevor du dein eigenes Glas füllst. Fülle eine Teetasse nur zu 70% (die restlichen 30% symbolisieren Freundschaft).',
      'Fingerklopfen als Dank: Wenn dir jemand Tee nachschenkt während du sprichst, klopfe mit gekrümmtem Zeige- und Mittelfinger zweimal leise auf den Tisch — das bedeutet stummes "Danke".',
      'Stäbchen-Tabu: Stecke niemals deine Essstäbchen senkrecht in die Reisschüssel! Das erinnert an Weihrauchstäbchen bei Beerdigungen und bringt Unglück.',
      'Reisschüssel anheben: Es ist in China vollkommen üblich und erwünscht, die Reisschüssel mit einer Hand nahe an den Mund zu führen.',
    ],
    etiquetteTip:
      'Lasse am Ende eines festlichen Essens als Gast gerne einen kleinen Bissen auf dem Teller übrig. Ein blank geputzter Teller könnte dem Gastgeber signalisieren, dass er zu wenig bestellt hat.',
    vocabulary: [
      { hanzi: '茶', pinyin: 'chá', meaning: 'Tee' },
      { hanzi: '喝', pinyin: 'hē', meaning: 'trinken' },
      { hanzi: '吃', pinyin: 'chī', meaning: 'essen' },
      { hanzi: '米饭', pinyin: 'mǐfàn', meaning: 'Reis' },
    ],
  },
  {
    id: 'modesty-and-politeness',
    category: 'etiquette',
    categoryLabel: 'Höflichkeit & Bescheidenheit',
    titleChinese: '客气与谦虚',
    titlePinyin: 'Kèqi yǔ qiānxū',
    titleGerman: 'Höflichkeit (Kèqi) & Bescheidenheit',
    badge: '哪里哪里 (Nǎli nǎli)',
    summary:
      'In der traditionellen chinesischen Kultur gilt Bescheidenheit als höchste Tugend. Wenn jemand deine Chinesischkenntnisse lobt ("Dein Chinesisch ist so gut!"), antwortet man selten mit "Danke", sondern wiegelt bescheiden ab.',
    keyTakeaways: [
      'Komplimente abwehren: Typische Redewendung: 哪里哪里！ (Nǎli nǎli! = "Wo denn / Gar nicht der Rede wert!"). Alternativ: 还差得远呢 (Da fehlt noch viel).',
      'Siezen mit 您 (nín): Älteren Personen, Professoren und Kunden gegenüber nutzt man stets 您 statt 你.',
      'Nicht umständehalber ablehnen: Oft bieten Gastgeber mehrfach Essen oder Tee an. Erst nach zweimaligem höflichen Ablehnen greift man zu.',
      '不客气 (Bú kèqi): Wörtlich "Sei nicht so förmlich / Keine Umstände!" — die Standardantwort auf 谢谢 (Danke).',
    ],
    etiquetteTip:
      'Ein strahlendes "Danke!" auf ein Lob wirkt im traditionellen China leicht selbstgefällig. Ein bescheidenes Lächeln mit "哪里哪里" zaubert jedem Muttersprachler ein Lächeln ins Gesicht.',
    vocabulary: [
      { hanzi: '客气', pinyin: 'kèqi', meaning: 'höflich / förmlich' },
      { hanzi: '谢谢', pinyin: 'xièxie', meaning: 'danke' },
      { hanzi: '不', pinyin: 'bù', meaning: 'nicht' },
      { hanzi: '好', pinyin: 'hǎo', meaning: 'gut' },
    ],
  },
];
