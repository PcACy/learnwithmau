export interface LessonMeta {
  id: string;
  title: string;
  subtitle: string;
}

export interface StoryMeta {
  id: string;
  title: string;
  pinyinTitle: string;
  germanTitle: string;
  summary: string;
}

export const LESSONS_META: readonly LessonMeta[] = [
  {
    "id": "svo-basics",
    "title": "Grundsatz des Satzbaus (SVO)",
    "subtitle": "Subjekt + Prädikat + Objekt — Die goldene Basisregel"
  },
  {
    "id": "verb-shi-and-bu",
    "title": "Das Verb „是“ (sein) & Verneinung mit „不“",
    "subtitle": "Gleichsetzungen formulieren und Aussagen verneinen"
  },
  {
    "id": "you-and-meiyou",
    "title": "Besitz & Existenz („有“ & „没有“)",
    "subtitle": "Etwas besitzen und die Existenz von Dingen beschreiben"
  },
  {
    "id": "zai-locations",
    "title": "Ortsangaben & die Handlungsregel („在“ zài)",
    "subtitle": "Aufenthaltsorte und Handlungen an bestimmten Orten"
  },
  {
    "id": "question-particles",
    "title": "Fragen bilden („吗“, „呢“, „怎么样“ & Fragewörter)",
    "subtitle": "Entscheidungsfragen, Rückfragen und W-Fragen"
  },
  {
    "id": "particle-de",
    "title": "Besitz & Beschreibung mit „的“ (de)",
    "subtitle": "Zugehörigkeit und Attribute präzise verknüpfen"
  },
  {
    "id": "measure-words",
    "title": "Das Zählwörter-System (Klassifikatoren)",
    "subtitle": "Warum man im Chinesischen nicht einfach 'zwei Bücher' sagen kann"
  },
  {
    "id": "time-and-dates",
    "title": "Zeit- & Datumsangaben (Groß → Klein)",
    "subtitle": "Jahr, Monat, Tag und Uhrzeit logisch anordnen"
  },
  {
    "id": "modal-verbs",
    "title": "Modalverben & Wünsche („会“, „想“, „能“)",
    "subtitle": "Fähigkeiten, Wünsche und Möglichkeiten ausdrücken"
  },
  {
    "id": "particles-le-and-qing",
    "title": "Aspektpartikel „了“ & Höflichkeitsformel „请“",
    "subtitle": "Zustandsänderungen, vollendete Handlungen und Bitten"
  },
  {
    "id": "conjunctions-dou-and-ba",
    "title": "Verbindungswörter, Allquantor & Vorschläge („和“, „都“, „吧“)",
    "subtitle": "Nomen verknüpfen, 'alle/beide' ausdrücken und Vorschläge machen"
  },
  {
    "id": "serial-verbs-and-adjectives",
    "title": "Serieller Satzbau (连动句) & Adjektivprädikate mit „很“",
    "subtitle": "Mehrere Handlungen nacheinander & Eigenschaften beschreiben"
  }
] as const;

export const STORIES_META: readonly StoryMeta[] = [
  {
    "id": "story-01",
    "title": "自我介绍",
    "pinyinTitle": "Zìwǒ jièshào",
    "germanTitle": "Sich vorstellen",
    "summary": "Li Yue stellt sich vor: Sie ist 20 Jahre alt, kommt aus China und studiert an der Universität."
  },
  {
    "id": "story-02",
    "title": "在饭馆",
    "pinyinTitle": "Zài fànguǎn",
    "germanTitle": "Im Restaurant",
    "summary": "Wang Peng und Li Yue gehen mittags ins Restaurant, trinken chinesischen Tee und essen Reis mit Gemüse."
  },
  {
    "id": "story-03",
    "title": "我的家和宠物",
    "pinyinTitle": "Wǒ de jiā hé chǒngwù",
    "germanTitle": "Meine Familie und Haustiere",
    "summary": "Ein Einblick in die Familie: Vater, Mutter, ein kleiner Hund und eine Katze, die gerne auf dem Stuhl schläft."
  },
  {
    "id": "story-04",
    "title": "学校生活",
    "pinyinTitle": "Xuéxiào shēnghuó",
    "germanTitle": "Schulleben",
    "summary": "Ein Schultag: Wang Peng geht morgens in die Schule, lernt Chinesisch mit Lehrer Wang und liest Bücher."
  },
  {
    "id": "story-05",
    "title": "今天天气怎么样？",
    "pinyinTitle": "Jīntiān tiānqì zěnmeyàng?",
    "germanTitle": "Das Wetter heute",
    "summary": "Über das Wetter sprechen: Gestern war es heiß, heute regnet es und ist kühl."
  },
  {
    "id": "story-06",
    "title": "在商店买水果",
    "pinyinTitle": "Zài shāngdiàn mǎi shuǐguǒ",
    "germanTitle": "Im Geschäft einkaufen",
    "summary": "Im Obstladen: Äpfel kaufen, nach dem Preis fragen und Bücher für den Chinesischkurs besorgen."
  },
  {
    "id": "story-07",
    "title": "打电话看电影",
    "pinyinTitle": "Dǎ diànhuà kàn diànyǐng",
    "germanTitle": "Telefonieren & Kino",
    "summary": "Ein Telefongespräch zwischen Freunden: Treffpunkt morgen Nachmittag vor dem Kino."
  },
  {
    "id": "story-08",
    "title": "他在哪儿工作？",
    "pinyinTitle": "Tā zài nǎr gōngzuò?",
    "germanTitle": "Wo arbeitet er?",
    "summary": "Über den Vater sprechen: Er ist Arzt in einem großen Krankenhaus und fährt jeden Morgen mit dem Taxi zur Arbeit."
  },
  {
    "id": "story-09",
    "title": "在火车站 (Am Bahnhof)",
    "pinyinTitle": "Zài Huǒchēzhàn",
    "germanTitle": "Am Bahnhof — Ankunft & Freunde abholen",
    "summary": "Heute Nachmittag um vier Uhr fahren wir zum Bahnhof, um Freunde abzuholen, die mit dem Flugzeug nach Peking gekommen sind."
  },
  {
    "id": "story-10",
    "title": "朋友聚会与礼貌 (Treffen & Höflichkeit)",
    "pinyinTitle": "Péngyou Jùhuì yǔ Lǐmào",
    "germanTitle": "Treffen mit Freunden — Begrüßung, Dank & Entschuldigung",
    "summary": "Herr Wang und Fräulein Li treffen sich in einem Teehaus. Ein Gespräch über Höflichkeit, Pünktlichkeit und Teegenuss."
  },
  {
    "id": "story-11",
    "title": "在家里的日常生活 (Alltag zu Hause)",
    "pinyinTitle": "Zài Jiā Lǐ de Rìcháng Shēnghuó",
    "germanTitle": "Familienalltag — Kinder, Haushaltsdinge & Hobbys",
    "summary": "Frau Zhang verbringt den Nachmittag mit ihrem Sohn und ihrer Tochter zu Hause. Zusammen lernen sie, kochen und kaufen ein."
  },
  {
    "id": "story-12",
    "title": "打电话问候 (Ein Telefonanruf)",
    "pinyinTitle": "Dǎ Diànhuà Wènhòu",
    "germanTitle": "Ein Telefonat — Verabredung & Wochentage",
    "summary": "Ein Telefonat zwischen David und Lehrer Wang zur Terminabsprache für das kommende Wochenende."
  }
] as const;

export const TOTAL_GRAMMAR_LESSONS = LESSONS_META.length;
export const TOTAL_STORIES = STORIES_META.length;
