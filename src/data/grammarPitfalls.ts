export interface PitfallPair {
  id: string;
  itemA: { word: string; pinyin: string; translation: string; coreUsage: string };
  itemB: { word: string; pinyin: string; translation: string; coreUsage: string };
  title: string;
  summary: string;
  comparisonPoints: {
    situation: string;
    itemACorrect: boolean;
    itemBCorrect: boolean;
    explanation: string;
    example: string;
    pinyin: string;
    german: string;
    audioUrl?: string;
  }[];
  quickRule: string;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export const GRAMMAR_PITFALLS: readonly PitfallPair[] = [
  {
    id: 'er-vs-liang',
    itemA: {
      word: '二',
      pinyin: 'èr',
      translation: 'zwei (mathematisch)',
      coreUsage: 'Zählen, Ziffern, Datumsangaben, Telefonnummern, Ordnungszahlen.',
    },
    itemB: {
      word: '两',
      pinyin: 'liǎng',
      translation: 'zwei / ein Paar (Menge)',
      coreUsage: 'Mengenangaben mit Zählwörtern (个, 本, 岁, 点) und vor 百/千/万.',
    },
    title: '二 (èr) vs. 两 (liǎng) — Wie sagt man "zwei"?',
    summary:
      'Im Deutschen gibt es nur "zwei". Im Chinesischen trennt man strikt zwischen der mathematischen Ziffer (二) und der Menge vor einem Zählwort (两).',
    quickRule:
      'Steht direkt danach ein Zählwort (wie 个, 本, 点)? → Nimm 两 (liǎng). Zählst du 1, 2, 3 oder nennst du ein Datum/Telefonnummer? → Nimm 二 (èr).',
    comparisonPoints: [
      {
        situation: 'Vor einem Zählwort (z. B. 个 gè)',
        itemACorrect: false,
        itemBCorrect: true,
        explanation: 'Falsch: 二个人. Richtig: 两个人 (zwei Personen).',
        example: '我有两个朋友。',
        pinyin: 'Wǒ yǒu liǎng gè péngyou.',
        german: 'Ich habe zwei Freunde.',
        audioUrl: '/audio/grammar/pitfall-01.mp3',
      },
      {
        situation: 'Uhrzeit: "2 Uhr"',
        itemACorrect: false,
        itemBCorrect: true,
        explanation: 'Bei Uhrzeiten fungiert 点 (diǎn) als Zähleinheit: 两点 (2 Uhr). (Ausnahme: 2 Minuten = 两分钟 oder 二分钟).',
        example: '现在两点。',
        pinyin: 'Xiànzài liǎng diǎn.',
        german: 'Jetzt ist es zwei Uhr.',
        audioUrl: '/audio/grammar/pitfall-02.mp3',
      },
      {
        situation: 'Ordnungszahlen ("der Zweite")',
        itemACorrect: true,
        itemBCorrect: false,
        explanation: 'Nach 第 (dì) steht IMMER 二: 第二 (der Zweite / zweitens).',
        example: '第二课',
        pinyin: 'dì-èr kè',
        german: 'die zweite Lektion',
        audioUrl: '/audio/grammar/pitfall-03.mp3',
      },
      {
        situation: 'Monatsname ("Februar")',
        itemACorrect: true,
        itemBCorrect: false,
        explanation: 'Monate sind nummeriert: 二月 (Februar = Monat 2). Nie 两月!',
        example: '二月十二号',
        pinyin: 'èryuè shí’èr hào',
        german: '12. Februar',
        audioUrl: '/audio/grammar/pitfall-04.mp3',
      },
    ],
    quiz: [
      {
        question: 'Ich möchte ___ Becher Tee kaufen. (我要买 ___ 杯茶。)',
        options: ['二 (èr)', '两 (liǎng)'],
        correctIndex: 1,
        explanation: 'Weil 杯 (bēi - Becher/Tasse) ein Zählwort für Mengenangaben ist, muss 两 (liǎng) gewählt werden.',
      },
      {
        question: 'Heute ist der 2. Tag des Monats. (今天 ___ 号。)',
        options: ['二 (èr)', '两 (liǎng)'],
        correctIndex: 0,
        explanation: 'Kalendertage sind nummerierte Daten (Ziffern), daher steht hier 二号 (èr hào).',
      },
    ],
  },
  {
    id: 'bu-vs-mei',
    itemA: {
      word: '不',
      pinyin: 'bù',
      translation: 'nicht (subjektiv / Gewohnheit)',
      coreUsage: 'Gegenwart, Gewohnheiten, Wollen, Adjektive, und zwingend bei 是 (不是).',
    },
    itemB: {
      word: '没(有)',
      pinyin: 'méi(yǒu)',
      translation: 'nicht (objektive Tatsache / Vergangenheit)',
      coreUsage: 'Verneinung von 有 (immer 没有!), vollendete Handlungen der Vergangenheit.',
    },
    title: '不 (bù) vs. 没(有) (méiyǒu) — Die zwei Arten zu verneinen',
    summary:
      '"不" verneint den Willen, die Natur oder eine generelle Gewohnheit ("Ich trinke keinen Tee"). "没" verneint das Stattfinden eines Ereignisses oder Besitz ("Ich habe keinen Tee getrunken / habe keinen Tee").',
    quickRule:
      'Geht es um das Verb 有? → IMMER 没有 (nie 不有!). Geht es um 是 oder Adjektive? → IMMER 不. Geht es um vergangene Handlungen? → 没.',
    comparisonPoints: [
      {
        situation: 'Besitz verneinen ("nicht haben")',
        itemACorrect: false,
        itemBCorrect: true,
        explanation: '"不有" existiert in der chinesischen Sprache nicht. Es heißt ausnahmslos "没有".',
        example: '我没有猫。',
        pinyin: 'Wǒ méiyǒu māo.',
        german: 'Ich habe keine Katze.',
        audioUrl: '/audio/grammar/pitfall-05.mp3',
      },
      {
        situation: 'Eigenschaften & Adjektive ("nicht groß / nicht gut")',
        itemACorrect: true,
        itemBCorrect: false,
        explanation: 'Zustände und Adjektive werden stets mit 不 verneint: 不好, 不大, 不热.',
        example: '今天天气不冷。',
        pinyin: 'Jīntiān tiānqì bù lěng.',
        german: 'Das Wetter heute ist nicht kalt.',
        audioUrl: '/audio/grammar/pitfall-06.mp3',
      },
      {
        situation: 'Gewohnheit vs. Vergangenheit',
        itemACorrect: true,
        itemBCorrect: true,
        explanation: '我不喝咖啡 = Ich trinke (grundsätzlich) keinen Kaffee. 我没喝咖啡 = Ich habe (heute) keinen Kaffee getrunken.',
        example: '我不吃苹果 / 我没吃苹果',
        pinyin: 'Wǒ bù chī píngguǒ / Wǒ méi chī píngguǒ',
        german: 'Ich esse keine Äpfel (Gewohnheit) / Ich habe den Apfel nicht gegessen (Vergangenheit)',
        audioUrl: '/audio/grammar/pitfall-07.mp3',
      },
    ],
    quiz: [
      {
        question: 'Er ist ___ Arzt. (他 ___ 是医生。)',
        options: ['不 (bù)', '没 (méi)'],
        correctIndex: 0,
        explanation: 'Die Kopula 是 wird ausnahmslos mit 不 verneint: 不是 (bú shì).',
      },
      {
        question: 'Ich habe gestern ___ Buch gelesen. (我昨天 ___ 看书。)',
        options: ['不 (bù)', '没 (méi)'],
        correctIndex: 1,
        explanation: 'Da die Handlung in der Vergangenheit (gestern 昨天) nicht stattfand, verwendet man 没(有).',
      },
    ],
  },
  {
    id: 'xiang-vs-yao',
    itemA: {
      word: '想',
      pinyin: 'xiǎng',
      translation: 'möchten / vermissen / denken',
      coreUsage: 'Sanfter Wunsch, Sehnsucht ("ich hätte Lust", "ich vermisse dich").',
    },
    itemB: {
      word: '要',
      pinyin: 'yào',
      translation: 'wollen / müssen / werden',
      coreUsage: 'Fester Entschluss, dringender Bedarf, Bestellung im Restaurant, nahe Zukunft.',
    },
    title: '想 (xiǎng) vs. 要 (yào) — "Möchten" oder "Wollen"?',
    summary:
      '想 drückt einen inneren Wunsch oder Gedanken aus ("Ich möchte gerne"). 要 ist deutlich resoluter und drückt Willen, Notwendigkeit oder ein festes Vorhaben aus ("Ich will / werde").',
    quickRule:
      'Höflich & unverbindlich? → 想 (xiǎng). Feste Absicht oder Bestellung? → 要 (yào).',
    comparisonPoints: [
      {
        situation: 'Höfliche Wünsche äußern',
        itemACorrect: true,
        itemBCorrect: false,
        explanation: '想 klingt höflich und sanft: 我想去中国 (Ich möchte gerne nach China reisen).',
        example: '我想喝茶。',
        pinyin: 'Wǒ xiǎng hē chá.',
        german: 'Ich möchte gerne Tee trinken.',
        audioUrl: '/audio/grammar/pitfall-08.mp3',
      },
      {
        situation: 'Im Restaurant bestellen',
        itemACorrect: false,
        itemBCorrect: true,
        explanation: 'Bei Bestellungen ist 要 Standard: 我要一杯水 (Ich nehme / will ein Glas Wasser).',
        example: '我要米饭。',
        pinyin: 'Wǒ yào mǐfàn.',
        german: 'Ich nehme Reis.',
        audioUrl: '/audio/grammar/pitfall-09.mp3',
      },
      {
        situation: 'Jemanden vermissen',
        itemACorrect: true,
        itemBCorrect: false,
        explanation: 'Mit Person als direktes Objekt bedeutet 想 "vermissen": 我想你 (Ich vermisse dich).',
        example: '我想我妈妈。',
        pinyin: 'Wǒ xiǎng wǒ māma.',
        german: 'Ich vermisse meine Mutter.',
        audioUrl: '/audio/grammar/pitfall-10.mp3',
      },
    ],
    quiz: [
      {
        question: 'Oberkellner, ich ___ zahlen! (服务员，我 ___ 买单！)',
        options: ['想 (xiǎng)', '要 (yào)'],
        correctIndex: 1,
        explanation: 'Bei einer konkreten Zahlungsabsicht oder Bestellung verwendet man 要 (yào).',
      },
    ],
  },
  {
    id: 'zenme-vs-zenmeyang',
    itemA: {
      word: '怎么',
      pinyin: 'zěnme',
      translation: 'wie? / auf welche Weise?',
      coreUsage: 'Steht vor einem VERB: 怎么去 (wie dorthin gelangen?), 怎么读 (wie lesen?).',
    },
    itemB: {
      word: '怎么样',
      pinyin: 'zěnmeyàng',
      translation: 'wie ist...? / wie gefällt dir...?',
      coreUsage: 'Steht als Prädikat am SATZENDE nach dem Subjekt: 天气怎么样? (Wie ist das Wetter?).',
    },
    title: '怎么 (zěnme) vs. 怎么样 (zěnmeyàng)',
    summary:
      'Beide bedeuten auf Deutsch "wie", haben im Satz aber völlig verschiedene Positionen und Bedeutungen.',
    quickRule:
      'Steht direkt danach ein Verb? → 怎么 (zěnme). Steht es am Satzende zur Meinungsfrage? → 怎么样 (zěnmeyàng).',
    comparisonPoints: [
      {
        situation: 'Nach der Art & Weise einer Handlung fragen',
        itemACorrect: true,
        itemBCorrect: false,
        explanation: '怎么 + Verb = Wie macht man das? (z. B. 这个字怎么写? Wie schreibt man dieses Zeichen?).',
        example: '你怎么去学校？',
        pinyin: 'Nǐ zěnme qù xuéxiào?',
        german: 'Wie kommst du zur Schule?',
        audioUrl: '/audio/grammar/pitfall-11.mp3',
      },
      {
        situation: 'Nach dem Zustand oder der Meinung fragen',
        itemACorrect: false,
        itemBCorrect: true,
        explanation: 'Subjekt + 怎么样? = Wie ist das Subjekt / Wie findest du es?',
        example: '这本中国书怎么样？',
        pinyin: 'Zhè běn Zhōngguó shū zěnmeyàng?',
        german: 'Wie ist dieses chinesische Buch?',
        audioUrl: '/audio/grammar/pitfall-12.mp3',
      },
    ],
    quiz: [
      {
        question: 'Wie ist das Wetter heute? (今天天气 ___？)',
        options: ['怎么 (zěnme)', '怎么样 (zěnmeyàng)'],
        correctIndex: 1,
        explanation: 'Weil am Satzende nach dem Zustand des Wetters gefragt wird, gehört hier 怎么样 (zěnmeyàng) hin.',
      },
      {
        question: 'Wie spricht man dieses Wort aus? (这个词 ___ 读？)',
        options: ['怎么 (zěnme)', '怎么样 (zěnmeyàng)'],
        correctIndex: 0,
        explanation: 'Weil unmittelbar das Verb 读 (dú - lesen/aussprechen) folgt, erfragt 怎么 die Art und Weise.',
      },
    ],
  },
  {
    id: 'na-question-vs-demonstrative',
    itemA: {
      word: '哪',
      pinyin: 'nǎ',
      translation: 'welche(r/s)? (Frage, 3. Ton)',
      coreUsage: 'Hat das Mund-Radikal (口) links. Leitet eine Frage ein.',
    },
    itemB: {
      word: '那',
      pinyin: 'nà',
      translation: 'jene(r/s) / das dort (Demonstrativ, 4. Ton)',
      coreUsage: 'Ohne Mund-Radikal. Zeigt auf ein entferntes Objekt ("jenes dort").',
    },
    title: '哪 (nǎ) vs. 那 (nà) — Frage oder Hinweis?',
    summary:
      'Gleiche Grundgestalt, aber fundamentale Unterschiede: 哪 hat das Mund-Radikal 口 (für Fragen) und den 3. Ton. 那 hat kein 口 und den 4. Ton.',
    quickRule:
      'Mund-Radikal 口 links = Frage (nǎ - welche?). Kein Mund = Hinweis (nà - jene/das dort).',
    comparisonPoints: [
      {
        situation: 'Frage nach Nationalität / Land',
        itemACorrect: true,
        itemBCorrect: false,
        explanation: '你是哪国人? = Welcher Landsmann bist du? (Aus welchem Land stammst du?).',
        example: '你在哪儿？',
        pinyin: 'Nǐ zài nǎr?',
        german: 'Wo bist du?',
        audioUrl: '/audio/grammar/pitfall-13.mp3',
      },
      {
        situation: 'Zeigen auf einen Gegenstand in der Ferne',
        itemACorrect: false,
        itemBCorrect: true,
        explanation: '那个人 = jene Person dort. 那是一只猫 = Das dort ist eine Katze.',
        example: '那是我的书。',
        pinyin: 'Nà shì wǒ de shū.',
        german: 'Das dort ist mein Buch.',
        audioUrl: '/audio/grammar/pitfall-14.mp3',
      },
    ],
    quiz: [
      {
        question: 'Welches Buch möchtest du lesen? (你想看 ___ 本书？)',
        options: ['哪 (nǎ)', '那 (nà)'],
        correctIndex: 0,
        explanation: 'Es handelt sich um eine Frage ("welches Buch?"), daher ist 哪 (nǎ) mit dem Mund-Radikal korrekt.',
      },
    ],
  },
];
