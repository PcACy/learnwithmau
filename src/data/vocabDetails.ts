import type { PartOfSpeech, Collocation, ExampleSentence, VocabItem } from '../types/vocab';
import { RADICALS_BY_ID } from './index';

export interface ChaoPitchInfo {
  toneName: string;
  contourCode: string;
  label: string;
  description: string;
  levels: number[];
}

export const CHAO_PITCH_DESCRIPTIONS: Record<number, ChaoPitchInfo> = {
  1: {
    toneName: '1. Ton',
    contourCode: '55',
    label: 'Hoch-Eben (High Flat)',
    description: 'Beginnt auf höchster Tonlage (5) und bleibt stabil und gleichmäßig hoch.',
    levels: [5, 5, 5],
  },
  2: {
    toneName: '2. Ton',
    contourCode: '35',
    label: 'Steigend (Rising)',
    description: 'Startet in mittlerer Stimmlage (3) und steigt fragend zur Höchstlage (5) auf.',
    levels: [3, 4, 5],
  },
  3: {
    toneName: '3. Ton',
    contourCode: '214',
    label: 'Fallend-Steigend (Dipping)',
    description: 'Beginnt halbtief (2), fällt auf Tiefstlage (1) und schwingt auf hoch (4) empor.',
    levels: [2, 1, 4],
  },
  4: {
    toneName: '4. Ton',
    contourCode: '51',
    label: 'Fallend (Falling)',
    description: 'Setzt energisch auf Höchstlage (5) an und fällt bestimmt auf Tiefstlage (1) ab.',
    levels: [5, 3, 1],
  },
  5: {
    toneName: 'Neutraler Ton',
    contourCode: '3',
    label: 'Leicht & Kurz (Neutral)',
    description: 'Kurz, leicht und unbetont in der mittleren Stimmlage (3) gesprochen.',
    levels: [3, 3, 3],
  },
};

export function getChaoPitchInfo(item: VocabItem): ChaoPitchInfo {
  const primaryTone = item.syllables[0]?.tone ?? 1;
  const base = CHAO_PITCH_DESCRIPTIONS[primaryTone] || CHAO_PITCH_DESCRIPTIONS[1];

  if (item.syllables.length > 1) {
    const tones = item.syllables.map((s) => `T${s.tone}`);
    const codes = item.syllables.map((s) => CHAO_PITCH_DESCRIPTIONS[s.tone]?.contourCode ?? '').join(' + ');
    return {
      toneName: `${tones.join(' + ')}`,
      contourCode: codes,
      label: `${item.syllables.map((s) => s.marked).join(' ')}`,
      description: `Erste Silbe (${CHAO_PITCH_DESCRIPTIONS[item.syllables[0].tone]?.label}), gefolgt von Silbe 2 (${CHAO_PITCH_DESCRIPTIONS[item.syllables[1].tone]?.label}).`,
      levels: [
        ...(CHAO_PITCH_DESCRIPTIONS[item.syllables[0].tone]?.levels ?? [3, 3, 3]),
        ...(CHAO_PITCH_DESCRIPTIONS[item.syllables[1].tone]?.levels ?? [3, 3, 3]),
      ],
    };
  }

  return base;
}

export const PART_OF_SPEECH_MAP: Record<string, PartOfSpeech> = {
  // Verben
  'hsk1-ai': 'verb',
  'hsk1-chi': 'verb',
  'hsk1-dadianhua': 'verb',
  'hsk1-du': 'verb',
  'hsk1-gongzuo': 'verb',
  'hsk1-he': 'verb',
  'hsk1-hui': 'verb',
  'hsk1-jia': 'verb',
  'hsk1-jiao': 'verb',
  'hsk1-kai': 'verb',
  'hsk1-kan': 'verb',
  'hsk1-kanjian': 'verb',
  'hsk1-lai': 'verb',
  'hsk1-mai': 'verb',
  'hsk1-neng': 'verb',
  'hsk1-qing': 'verb',
  'hsk1-qu': 'verb',
  'hsk1-renshi': 'verb',
  'hsk1-shi': 'verb',
  'hsk1-shuijiao': 'verb',
  'hsk1-shuo': 'verb',
  'hsk1-shuohua': 'verb',
  'hsk1-ting': 'verb',
  'hsk1-xihuan': 'verb',
  'hsk1-xiayu': 'verb',
  'hsk1-xiang': 'verb',
  'hsk1-xie': 'verb',
  'hsk1-xiexie': 'verb',
  'hsk1-xuexi': 'verb',
  'hsk1-you': 'verb',
  'hsk1-zai': 'verb',
  'hsk1-zhu': 'verb',
  'hsk1-zuo-sit': 'verb',
  'hsk1-zuo-do': 'verb',
  'hsk1-hui-return': 'verb',

  // Nomen
  'hsk1-baba': 'nomen',
  'hsk1-beizi': 'nomen',
  'hsk1-beijing': 'eigenname',
  'hsk1-cai': 'nomen',
  'hsk1-cha': 'nomen',
  'hsk1-chuzuche': 'nomen',
  'hsk1-diannao': 'nomen',
  'hsk1-dianshi': 'nomen',
  'hsk1-dianying': 'nomen',
  'hsk1-dongxi': 'nomen',
  'hsk1-erzi': 'nomen',
  'hsk1-fanguan': 'nomen',
  'hsk1-fandian': 'nomen',
  'hsk1-feiji': 'nomen',
  'hsk1-fenzhong': 'nomen',
  'hsk1-gou': 'nomen',
  'hsk1-hanyu': 'nomen',
  'hsk1-jia-home': 'nomen',
  'hsk1-jintian': 'nomen',
  'hsk1-laoshi': 'nomen',
  'hsk1-mama': 'nomen',
  'hsk1-mao': 'nomen',
  'hsk1-mifan': 'nomen',
  'hsk1-mingtian': 'nomen',
  'hsk1-mingzi': 'nomen',
  'hsk1-nian': 'nomen',
  'hsk1-nver': 'nomen',
  'hsk1-pengyou': 'nomen',
  'hsk1-pingguo': 'nomen',
  'hsk1-qian': 'nomen',
  'hsk1-ren': 'nomen',
  'hsk1-shangdian': 'nomen',
  'hsk1-shangwu': 'nomen',
  'hsk1-shihou': 'nomen',
  'hsk1-shijian': 'nomen',
  'hsk1-shu': 'nomen',
  'hsk1-shui': 'nomen',
  'hsk1-shuiguo': 'nomen',
  'hsk1-tianqi': 'nomen',
  'hsk1-tongxue': 'nomen',
  'hsk1-xiansheng': 'nomen',
  'hsk1-xianzai': 'nomen',
  'hsk1-xiaojie': 'nomen',
  'hsk1-xingqi': 'nomen',
  'hsk1-xuesheng': 'nomen',
  'hsk1-xuexiao': 'nomen',
  'hsk1-yifu': 'nomen',
  'hsk1-yisheng': 'nomen',
  'hsk1-yiyuan': 'nomen',
  'hsk1-yizi': 'nomen',
  'hsk1-yue': 'nomen',
  'hsk1-zhongguo': 'eigenname',
  'hsk1-zhongwu': 'nomen',
  'hsk1-zhuozi': 'nomen',
  'hsk1-zi': 'nomen',
  'hsk1-zuotian': 'nomen',
  'hsk1-huochezhan': 'nomen',

  // Adjektive
  'hsk1-da': 'adjektiv',
  'hsk1-duo': 'adjektiv',
  'hsk1-gaoxing': 'adjektiv',
  'hsk1-hao': 'adjektiv',
  'hsk1-leng': 'adjektiv',
  'hsk1-liang': 'adjektiv',
  'hsk1-piaoliang': 'adjektiv',
  'hsk1-re': 'adjektiv',
  'hsk1-shao': 'adjektiv',
  'hsk1-xiao': 'adjektiv',

  // Pronomen
  'hsk1-wo': 'pronomen',
  'hsk1-ni': 'pronomen',
  'hsk1-ta-he': 'pronomen',
  'hsk1-ta-she': 'pronomen',
  'hsk1-women': 'pronomen',
  'hsk1-shei': 'pronomen',
  'hsk1-shenme': 'pronomen',
  'hsk1-na': 'pronomen',
  'hsk1-nar': 'pronomen',
  'hsk1-zhe': 'pronomen',
  'hsk1-zher': 'pronomen',
  'hsk1-duoshao': 'pronomen',
  'hsk1-ji': 'pronomen',
  'hsk1-zenme': 'pronomen',
  'hsk1-zenmeyang': 'pronomen',
  'hsk1-nin': 'pronomen',

  // Zahlen
  'hsk1-yi': 'zahl',
  'hsk1-er': 'zahl',
  'hsk1-san': 'zahl',
  'hsk1-si': 'zahl',
  'hsk1-wu': 'zahl',
  'hsk1-liu': 'zahl',
  'hsk1-qi': 'zahl',
  'hsk1-ba': 'zahl',
  'hsk1-jiu': 'zahl',
  'hsk1-shi-ten': 'zahl',
  'hsk1-ling': 'zahl',
  'hsk1-bai': 'zahl',

  // Adverbien
  'hsk1-bu': 'adverb',
  'hsk1-dou': 'adverb',
  'hsk1-hen': 'adverb',
  'hsk1-meiyou': 'adverb',
  'hsk1-tai': 'adverb',

  // Partikeln
  'hsk1-ba-particle': 'partikel',
  'hsk1-de': 'partikel',
  'hsk1-le': 'partikel',
  'hsk1-ma': 'partikel',
  'hsk1-ne': 'partikel',

  // Interjektion
  'hsk1-wei': 'interjektion',
};

export const PART_OF_SPEECH_INFO: Record<PartOfSpeech, { label: string; short: string; cn: string }> = {
  nomen: { label: 'Nomen', short: 'Nom.', cn: '名' },
  verb: { label: 'Verb', short: 'Verb', cn: '动' },
  adjektiv: { label: 'Adjektiv', short: 'Adj.', cn: '形' },
  pronomen: { label: 'Pronomen', short: 'Pron.', cn: '代' },
  adverb: { label: 'Adverb', short: 'Adv.', cn: '副' },
  partikel: { label: 'Partikel', short: 'Part.', cn: '助' },
  zahl: { label: 'Zahl', short: 'Zahl', cn: '数' },
  eigenname: { label: 'Eigenname', short: 'Name', cn: '专' },
  interjektion: { label: 'Interjektion', short: 'Interj.', cn: '叹' },
};

export const PART_OF_SPEECH_LABELS = PART_OF_SPEECH_INFO;

// Kulturelle Gedächtnisstützen & Mnemonic Hooks für alle HSK-1-Vokabeln
export const MNEMONIC_MAP: Record<string, string> = {
  "hsk1-nihao": "Besteht aus 你 (Mensch 亻 und du 尔) und 好 (Mutter 女 und Kind 子): Der respektvolle Gruß wünscht dem Gegenüber vollkommenes Wohlergehen und Schutz.",
  "hsk1-xiexie": "Zweimal 讠 (Worte) und 身/寸 (Körper/Dankbarkeit): Wiederholte aufrichtige Worte des Dankes aus tiefstem Herzen.",
  "hsk1-mingtian": "Sonne (日) und Mond (月) strahlen zusammen hell (明); dazu der Himmel (天): Das Licht des kommenden neuen Tages.",
  "hsk1-xingqi": "Sterne (日+生 = 星) im kosmischen Zeitzyklus (其+月 = 期): Der siebentägige Rhythmus der Himmelskörper.",
  "hsk1-xuesheng": "Ein lernendes Kind (子) unter dem Schuldach (学), das neues Wissen ins Leben (生) bringt: Der Schüler.",
  "hsk1-tongxue": "Gemeinsam unter einem Dach vereint (同), um Wissen und Weisheit zu lernen (学): Mitschüler und Kommilitonen.",
  "hsk1-pengyou": "Zwei Monde (月+月 = 朋) und zwei verbundene Hände (又+又 = 友): Freunde, die wie Gestirne Seite an Seite durchs Leben gehen.",
  "hsk1-zhongguo": "Ein Pfeil trifft genau die Mitte einer Zielscheibe (中) — das Reich der Mitte innerhalb seiner Grenzen (国).",
  "hsk1-hanyu": "Das Wasser (氵) des Han-Flusses (汉) vereint mit wohlklingenden Worten (讠+吾 = 语): Die Sprache des chinesischen Volkes.",
  "hsk1-diannao": "Elektrische Blitze am Himmel (电) verbunden mit der Rechenkraft eines Gehirns (脑): Der Computer.",
  "hsk1-zhuozi": "Aus wertvollem Holz (木) kunstvoll gefertigt (卓): Der Tisch, an dem man sich versammelt.",
  "hsk1-pingguo": "Früchte von Bäumen (果) mit süßem Duft (艹+平): Der Apfel als Symbol für Frieden und Wohlgeschmack.",
  "hsk1-ren": "Zwei aufrecht schreitende Beine: Der Mensch als aufrechtes, handelndes Wesen.",
  "hsk1-da": "Ein Mensch (人) mit weit ausgebreiteten Armen: So riesig und groß ist etwas!",
  "hsk1-xiao": "Drei kleine Tropfen oder Sandkörner, die voneinander getrennt werden: Das Zeichen für winzig klein.",
  "hsk1-shui": "Fließende Wasserströme im Flussbett mit aufspritzenden Tropfen an den Ufern: Die Urkraft des Wassers.",
  "hsk1-yue": "Die feine Sichel des Mondes am nächtlichen Himmel: Der Mond und der monatliche Mondzyklus.",
  "hsk1-ri": "Die strahlende Sonnenscheibe mit einem Sonnenfleck in der Mitte: Die Sonne und der Tag.",
  "hsk1-shi": "Zwei sich kreuzende Linien (horizontal und vertikal): Vollendung der Grundzahlen bis zehn.",
  "hsk1-yi": "Ein einzelner horizontaler Strich: Die absolute Einheit, der Anfang von allem.",
  "hsk1-er": "Zwei parallele Striche: Die Verdopplung, Himmel und Erde.",
  "hsk1-san": "Drei parallele Striche: Himmel, Mensch und Erde im kosmischen Einklang.",
  "hsk1-si": "Ein umschlossener Raum (囗) mit zwei Vorhängen darin: Die Zahl vier.",
  "hsk1-wu": "Zwei Balken, verbunden durch kreuzende Linien: Die fünf Elemente im Gleichgewicht.",
  "hsk1-liu": "Ein Punkt über einem Dach und zwei Beinen: Die glücksbringende Zahl sechs.",
  "hsk1-qi": "Ein Strich, der nach unten schneidet und aufsteigt: Die Zahl sieben.",
  "hsk1-ba": "Zwei auseinandergehende Linien, die Öffnung und Wohlstand symbolisieren: Die Glückszahl acht.",
  "hsk1-jiu": "Ein kraftvoller Haken wie ein geschwungener Drachenschwanz: Die Zahl neun als Symbol des Kaisers.",
  "hsk1-bai": "Ein Strich (一) über dem weißen Zeichen (白): Einhundert als runde, reine Zahl.",
  "hsk1-wo": "Eine Hand (手), die eine Hellebarde (戈) zum Schutz der eigenen Identität hält: Ich und Selbst.",
  "hsk1-ni": "Ein Mensch (亻) blickt sein Gegenüber (尔) an: Das persönliche Du.",
  "hsk1-ta": "Ein Mensch (亻) an einem anderen Ort (也): Die dritte Person männlich (Er).",
  "hsk1-ta-nv": "Eine Frau (女) an einem anderen Ort (也): Die dritte Person weiblich (Sie).",
  "hsk1-women": "Das Ich (我) mit dem Plural-Tor (们): Wir alle zusammen.",
  "hsk1-tamen": "Er (他) mit dem Plural-Tor (们): Sie alle zusammen.",
  "hsk1-ma": "Ein offener Mund (口), der mit der Klangsilbe Pferd (马) eine Frage in den Raum stellt.",
  "hsk1-ne": "Ein fragender Mund (口) mit der weichen Endung 尼: Die sanfte Rückfrage „und du?“.",
  "hsk1-bu": "Ein Vogel, der in den Himmel aufsteigt und nicht mehr herabkommt: Die universelle Verneinung (Nicht).",
  "hsk1-mei": "Wasserströme (氵), die im Nichts versickern (殳): Etwas ist nicht da oder noch nicht geschehen.",
  "hsk1-de": "Ein weißer Pfeil (白), der ins Ziel (勺) trifft: Kennzeichnung von Besitz und Zuordnung.",
  "hsk1-shi-be": "Die Sonne (日) steht exakt senkrecht am Himmel (正): Es ist so, wahr und wahrhaftig sein.",
  "hsk1-you": "Eine Hand (又), die ein Stück Fleisch (月) festhält: Haben und Besitzen.",
  "hsk1-shei": "Worte (讠), die das unverständliche Wesen eines Menschen (隹) erfragen: Wer ist das?",
  "hsk1-shenme": "Zwei einfache Fragelaute für Dinge und Sachverhalte: Was?",
  "hsk1-duoshao": "Zwei Monde aufeinander (多 = viel) neben wenigen Körnern (少 = wenig): Die Frage nach der Menge.",
  "hsk1-ji": "Ein kleiner Hocker mit wenigen Kanten: Frage nach einer überschaubaren Zahl (Wie viele?).",
  "hsk1-zheer": "Ein Zielort mit Schritten dorthin: Genau hier an dieser Stelle.",
  "hsk1-zaijian": "Wieder (再) sehen und erblicken (见): Auf ein baldiges Wiedersehen!",
  "hsk1-mingzi": "Am Abend (夕) den Mund (口) rufen, dazu das Kind unter dem Dach (字): Der persönliche Name.",
  "hsk1-baba": "Die schützenden Axtschwingen des Patriarchen (父) wachen über die Familie: Vater.",
  "hsk1-mama": "Die Frau (女), die für ihr Kind stark wie ein Pferd (马) arbeitet und sorgt: Mutter.",
  "hsk1-xuexiao": "Das Haus des Lernens (学) am Holzpfahl der Weisheit (校): Die Schule.",
  "hsk1-mao": "Ein kleines Raubtier (犭) schleicht durch das Getreidefeld (苗): Das anmutige Bild einer Katze.",
  "hsk1-ai": "Eine Hand, die ein Herz (心) sanft schützt und hält: Das tiefste Zeichen für bedingungslose Liebe.",
  "hsk1-xihuan": "Freude (喜) und Wohlgefühl (欢) vereint: Etwas von Herzen mögen.",
  "hsk1-hui": "Ein Dach über einem gemeinsamen Treffen (会): Eine Fähigkeit, die man erlernt und beherrscht.",
  "hsk1-kan": "Eine Hand (手) über die Augen (目) gelegt, um in die weite Ferne zu blicken: Schauen.",
  "hsk1-chi": "Ein offener Mund (口) führt Nahrung zum Schlucken ein: Essen.",
  "hsk1-he": "Ein Mund (口) genießt das duftende Getreide der Sonne (曷): Trinken.",
  "hsk1-nin": "Das Du (你) mit dem Herzen (心) darunter: Die tief empfundene, respektvolle Anrede „Sie“.",
  "hsk1-zhe": "Schritte, die zu diesem nahen Ort führen: Dies, dieses hier.",
  "hsk1-na": "Ein Ort in der Ferne mit einem Tor: Jenes dort drüben.",
  "hsk1-naer": "Die Ferne (那) mit der Endsilbe (儿): Dort.",
  "hsk1-na-which": "Ein Mund (口) fragt nach dem fernen Ort (那): Welcher?",
  "hsk1-naer-which": "Die Frage (哪) nach dem Ort (儿): Wo? Wohin?",
  "hsk1-zenme": "Das Herz (心) grübelt über die Art und Weise (怎): Wie? Warum?",
  "hsk1-zenmeyang": "Frage (怎么) nach dem äußeren Zustand und Bild (样): Wie steht es darum?",
  "hsk1-ling": "Regentropfen (雨) über dem Befehl (令): Der leere Raum, die Null.",
  "hsk1-ge": "Bambussprossen (竹) einzeln gezählt: Das universelle Zähleinheitswort.",
  "hsk1-sui": "Berge (山) im Fluss der Jahreszeiten (夕): Ein vollendetes Lebensjahr.",
  "hsk1-ben": "Ein Baum (木) mit einem markierten Wurzelstrich unten: Die Wurzel, das Buch.",
  "hsk1-xie": "Mehrere Teile (此+二) nebeneinander: Einige, ein paar.",
  "hsk1-kuai": "Ein Erdklumpen (土) oder eine Silbermünze (块): Ein handfestes Stück Geld.",
  "hsk1-hen": "Schritte (彳) mit entschlossenem Blick (艮): Sehr, in hohem Maße.",
  "hsk1-tai": "Groß (大) mit einem zusätzlichen Tropfen darunter: Zu groß, übermäßig, allzu.",
  "hsk1-dou": "Eine Stadt (者+阝) voller Menschen: Alle zusammen, ausnahmslos.",
  "hsk1-he-and": "Getreidehalme (禾) teilen mit dem Mund (口): Friedliches Miteinander und Harmonie.",
  "hsk1-zai": "Boden (土) mit einem Pfeiler: Sich an einem festen Ort befinden.",
  "hsk1-le": "Ein eingewickeltes Neugeborenes mit Armen: Vollendung eines neuen Zustands.",
  "hsk1-wei": "Ein Mund (口) ruft laut durch die Leitung: Hallo am Telefon.",
  "hsk1-jia": "Ein schützendes Dach (宀), unter dem ein wertvolles Schwein (豕) lebt: Das gemütliche Zuhause.",
  "hsk1-erzi": "Ein kleines Kind mit Fontanelle (儿): Der geliebte Sohn.",
  "hsk1-nver": "Eine anmutig kniende Frau (女): Die geliebte Tochter.",
  "hsk1-laoshi": "Ein erfahrener Ältester (老) mit dem Meisterheer (师): Der Lehrer.",
  "hsk1-yisheng": "Pfeile im Kasten (医) und der Lebensretter (生): Der Arzt.",
  "hsk1-xiansheng": "Der früher Geborene (先+生): Der respektierte Herr oder Ehemann.",
  "hsk1-xiaojie": "Die zarte (小) Schwester (姐): Fräulein, junge Dame.",
  "hsk1-yifu": "Der schützende Kragen (衣) und die Kleidung am Körper (服): Anzug und Gewand.",
  "hsk1-cai": "Kräuter und Gemüse (艹) mit fleißiger Hand (采) geerntet: Die Speise.",
  "hsk1-mifan": "Getreidekörner (米) gekocht zur nahrhaften Speise (饭): Reis.",
  "hsk1-shuiguo": "Saftiges Wasser (水) in der reifen Frucht (果): Frisches Obst.",
  "hsk1-cha": "Pflanzen (艹) auf einem Bergdach (人), von Händen aus Holz (木) gepflückt: Die Teekultur.",
  "hsk1-beizi": "Holz (木) oder Glas, das Wasser sicher fasst (杯): Der Becher.",
  "hsk1-qian": "Edles Metall (钅) und geschmiedete Münzen: Das Geld.",
  "hsk1-feiji": "Fliegende Schwingen (飞) einer modernen Maschine (机): Das Flugzeug.",
  "hsk1-chuzuche": "Hinausfahren (出) gegen Miete (租) im Wagen (车): Das Taxi.",
  "hsk1-dianshi": "Elektrischer Strom (电) und schauende Augen (视): Das Fernsehen.",
  "hsk1-dianying": "Elektrischer Strom (电) wirft bewegte Schatten (影): Der Film im Kino.",
  "hsk1-tianqi": "Der weite Himmel (天) und der Hauch der Wolken (气): Das Wetter.",
  "hsk1-gou": "Ein treues Raubtier (犭) mit kläffendem Laut (句): Der Hund.",
  "hsk1-dongxi": "Von Osten (东) nach Westen (西) reisen und Waren kaufen: Die Dinge und Sachen.",
  "hsk1-shu": "Eine Schreibfeder in der Hand zeichnet Wissen auf: Das Buch.",
  "hsk1-zi": "Ein Kind (子) unter dem Dach (宀) lernt schreiben: Das Schriftzeichen.",
  "hsk1-yizi": "Holz (木) kunstvoll gezimmert (奇) mit Rückenlehne: Der Stuhl.",
  "hsk1-bukeqi": "Keine (不) Fremdheit (客) empfinden: Keine Umstände, sehr gern geschehen!",
  "hsk1-qing": "Worte (讠) mit reinem, blaugrünem Herzen (青): Eine höfliche Bitte.",
  "hsk1-duibuqi": "Dem Gegenüber (对) nicht standhalten können (不起): Aufrichtige Entschuldigung.",
  "hsk1-meiguanxi": "Keine (没) verknüpfte Schlinge (关系): Es hat keine bösen Folgen, macht nichts!",
  "hsk1-jintian": "Gegenwärtig (今) unter dem Himmel (天): Der heutige Tag.",
  "hsk1-zuotian": "Die Sonne (日), die gestern schon vorüberzog (乍): Der gestrige Tag.",
  "hsk1-shangwu": "Die Zeit vor (上) dem Zenit der Sonne (午): Der Vormittag.",
  "hsk1-zhongwu": "Exakt die Mitte (中) des Sonnenlaufs (午): Der Mittag.",
  "hsk1-xiawu": "Die Zeit nach (下) dem Sonnenhöchststand (午): Der Nachmittag.",
  "hsk1-nian": "Getreidegarben, die nach einer vollen Ernte gebündelt werden: Ein ganzes Jahr.",
  "hsk1-hao-number": "Ein Mund (口), der eine Kennzeichnung ausruft: Die Hausnummer oder das Datum.",
  "hsk1-dian": "Feuerpunkte (灬) unter der Flamme (占): Ein präziser Punkt, die Uhrzeit.",
  "hsk1-fenzhong": "Ein Messer schneidet (分) die Glockenzeit (钟): Die Minute.",
  "hsk1-xianzai": "Vor den Augen erscheinen (现) und existieren (在): Die Gegenwart, jetzt.",
  "hsk1-shihou": "Sonnenzeit (时) und das Warten auf den Moment (候): Der Zeitpunkt.",
  "hsk1-beijing": "Die nördliche (北) Hauptstadt (京): Peking.",
  "hsk1-shang": "Ein Zeichen über der Grundlinie: Oben, hinaufsteigen.",
  "hsk1-xia": "Ein Zeichen unter der Grundlinie: Unten, herabsteigen.",
  "hsk1-qianmian": "Vorne vor den Augen (前) im Gesichtsfeld (面): Die Vorderseite.",
  "hsk1-houmian": "Schritte hinterher (后) im Rücken (面): Die Rückseite.",
  "hsk1-li": "Felder und Dörfer innerhalb der Landesgrenzen: Drinnen, im Inneren.",
  "hsk1-fanguan": "Reis und Speisen (饭) in einem stattlichen Gebäude (馆): Das Restaurant.",
  "hsk1-shangdian": "Handel treiben (商) unter dem Dach eines Ladens (店): Das Geschäft.",
  "hsk1-yiyuan": "Heilkunde (医) in einem geschützten Hof (院): Das Krankenhaus.",
  "hsk1-huochezhan": "Feuer-Wagen (火车) halten an der Haltestelle (站): Der Bahnhof.",
  "hsk1-ting": "Ein offener Mund (口) an der Wand lauscht (斤): Hören und lauschen.",
  "hsk1-shuohua": "Worte (讠) strömen aus dem Mund wie Wasser (说) mit Zunge (舌): Reden und sprechen.",
  "hsk1-du": "Worte (讠) laut und deutlich verkaufen/vortragen (卖): Laut vorlesen.",
  "hsk1-xie-write": "Ein Dach (冖) über der Schriftfeder: Das Niederschreiben von Gedanken.",
  "hsk1-kanjian": "Hand über den Augen (看) und tatsächlich erblicken (见): Wahrnehmen.",
  "hsk1-jiao": "Ein Mund (口), der aus der Ferne gerufen wird: Heißen oder rufen.",
  "hsk1-mai": "Waren erwerben mit Geldmuscheln im Laden: Kaufen.",
  "hsk1-kai": "Zwei Hände schieben den Riegel eines Tores auf: Öffnen oder Fahren.",
  "hsk1-zuo": "Zwei Menschen (从) sitzen auf dem Erdboden (土): Sitzen oder Platz nehmen.",
  "hsk1-zhu": "Ein Mensch (亻) an der festen Kerzenflamme (主): Sesshaft wohnen.",
  "hsk1-xuexi": "Ein Kind unter dem Dach (学) übt mit jungen Vogelflügeln (习): Lernen.",
  "hsk1-gongzuo": "Das Handwerkerlineal (工) in den Händen der Menschen (亻+乍): Arbeiten.",
  "hsk1-xiayu": "Wolken am Himmel lassen Tropfen herabfallen (雨): Regen.",
  "hsk1-xiang": "Das Auge (目) am Baum (木) mit dem Herzen (心) verbunden: Nachdenken und sich sehnen.",
  "hsk1-renshi": "Worte (讠) erkennen (认) und mit Wissen (识) verbinden: Jemanden kennen.",
  "hsk1-neng": "Ein starker Bär mit Tatzen: Körperliche Kraft und Fähigkeit haben.",
  "hsk1-lai": "Ein Weizenhalm, der von fernen Ländern herbeigebracht wurde: Kommen.",
  "hsk1-qu": "Ein Mensch verlässt eine Höhle: Fortgehen, sich entfernen.",
  "hsk1-hui-return": "Ein Wirbel kreist in sich selbst zurück (回): Zurückkehren.",
  "hsk1-zuo-do": "Ein Mensch (亻) fertigt mit Werkzeugen etwas an (故): Machen und tun.",
  "hsk1-hao": "Mutter (女) und Kind (子) vereint in Zuneigung: Gut, schön und heilvoll.",
  "hsk1-duo": "Zwei übereinanderliegende Fleischstücke oder Monde: Viele.",
  "hsk1-shao": "Kleine Sandkörner (小) schrumpfen mit einem Strich: Wenig.",
  "hsk1-leng": "Eisige Tropfen (冫) lassen den Menschen erzittern (令): Kalt.",
  "hsk1-re": "Pflanzen auf dem Boden über vier heißen Flammenpunkten (灬): Heiß.",
  "hsk1-gaoxing": "Ein hoher Turm (高) erstrahlt in frohem Aufschwung (兴): Hocherfreut.",
  "hsk1-piaoliang": "Fließendes Wasser (氵) und klares Licht (亮): Bildschön.",
  "hsk1-shuo": "Worte (讠) mit Freude (兑) austauschen: Sprechen.",
  "hsk1-meiyou": "Wasser versickert (没) und die Hand lässt los (有): Nicht vorhanden sein.",
  "hsk1-fandian": "Reisspeisen (饭) in einem geschützten Gasthaus (店): Hotel und Restaurant.",
  "hsk1-shuijiao": "Die Augen (目) fallen müde zu (垂), der Geist ruht (觉): Schlafen.",
  "hsk1-dadianhua": "Mit der Hand (扌) die Fern-Sprechanlage (电话) bedienen: Telefonieren.",
  "hsk1-ba-particle": "Ein Mund (口) schlägt sanft vor (巴): Der versöhnliche Vorschlagspartikel.",
  "hsk1-shijian": "Sonnenlauf (日) zwischen den Toren des Lebens (门): Die Zeit."
};

// Authentische Kollokationen (nur reale chinesische Wortverbindungen)
export const COLLOCATIONS_MAP: Record<string, Collocation[]> = {
  "hsk1-hao": [
    {
      "hanzi": "好看",
      "pinyin": "hǎokàn",
      "german": "schön / hübsch anzusehen"
    },
    {
      "hanzi": "好吃",
      "pinyin": "hǎochī",
      "german": "lecker / schmackhaft"
    },
    {
      "hanzi": "好听",
      "pinyin": "hǎotīng",
      "german": "schön klingend"
    },
    {
      "hanzi": "好玩",
      "pinyin": "hǎowán",
      "german": "unterhaltsam / lustig"
    }
  ],
  "hsk1-shui": [
    {
      "hanzi": "喝水",
      "pinyin": "hē shuǐ",
      "german": "Wasser trinken"
    },
    {
      "hanzi": "水果",
      "pinyin": "shuǐguǒ",
      "german": "Früchte / Obst"
    },
    {
      "hanzi": "开水",
      "pinyin": "kāishuǐ",
      "german": "abgekochtes Wasser"
    }
  ],
  "hsk1-da": [
    {
      "hanzi": "大人",
      "pinyin": "dàrén",
      "german": "Erwachsener"
    },
    {
      "hanzi": "大学",
      "pinyin": "dàxué",
      "german": "Universität"
    },
    {
      "hanzi": "大家",
      "pinyin": "dàjiā",
      "german": "alle zusammen"
    }
  ],
  "hsk1-xiao": [
    {
      "hanzi": "小孩",
      "pinyin": "xiǎohái",
      "german": "Kind / Kleinkind"
    },
    {
      "hanzi": "小学",
      "pinyin": "xiǎoxué",
      "german": "Grundschule"
    },
    {
      "hanzi": "小时",
      "pinyin": "xiǎoshí",
      "german": "Stunde (Zeitdauer)"
    }
  ],
  "hsk1-kan": [
    {
      "hanzi": "看书",
      "pinyin": "kàn shū",
      "german": "ein Buch lesen"
    },
    {
      "hanzi": "看电影",
      "pinyin": "kàn diànyǐng",
      "german": "einen Film schauen"
    },
    {
      "hanzi": "看见",
      "pinyin": "kànjiàn",
      "german": "sehen / erblicken"
    }
  ],
  "hsk1-chi": [
    {
      "hanzi": "吃饭",
      "pinyin": "chī fàn",
      "german": "eine Mahlzeit essen"
    },
    {
      "hanzi": "好吃",
      "pinyin": "hǎochī",
      "german": "lecker"
    },
    {
      "hanzi": "吃苹果",
      "pinyin": "chī píngguǒ",
      "german": "Äpfel essen"
    }
  ],
  "hsk1-xuexi": [
    {
      "hanzi": "学生",
      "pinyin": "xuésheng",
      "german": "Schüler / Student"
    },
    {
      "hanzi": "学校",
      "pinyin": "xuéxiào",
      "german": "Schule"
    },
    {
      "hanzi": "大学",
      "pinyin": "dàxué",
      "german": "Universität"
    },
    {
      "hanzi": "同学",
      "pinyin": "tóngxué",
      "german": "Mitschüler"
    }
  ],
  "hsk1-diannao": [
    {
      "hanzi": "电脑",
      "pinyin": "diànnǎo",
      "german": "Computer (elektrisches Gehirn)"
    },
    {
      "hanzi": "电视",
      "pinyin": "diànshì",
      "german": "Fernsehen (elektrischer Blick)"
    },
    {
      "hanzi": "电影",
      "pinyin": "diànyǐng",
      "german": "Film (elektrischer Schatten)"
    },
    {
      "hanzi": "打电话",
      "pinyin": "dǎ diànhuà",
      "german": "telefonieren"
    }
  ],
  "hsk1-tianqi": [
    {
      "hanzi": "今天",
      "pinyin": "jīntiān",
      "german": "heute"
    },
    {
      "hanzi": "明天",
      "pinyin": "míngtiān",
      "german": "morgen"
    },
    {
      "hanzi": "昨天",
      "pinyin": "zuótiān",
      "german": "gestern"
    },
    {
      "hanzi": "星期天",
      "pinyin": "xīngqītiān",
      "german": "Sonntag"
    }
  ],
  "hsk1-ren": [
    {
      "hanzi": "中国人",
      "pinyin": "Zhōngguó rén",
      "german": "Chinese / Chinesin"
    },
    {
      "hanzi": "大家",
      "pinyin": "dàjiā",
      "german": "alle zusammen"
    },
    {
      "hanzi": "大人",
      "pinyin": "dàrén",
      "german": "Erwachsener"
    }
  ],
  "hsk1-zhongguo": [
    {
      "hanzi": "中国菜",
      "pinyin": "Zhōngguó cài",
      "german": "chinesisches Essen"
    },
    {
      "hanzi": "中国人",
      "pinyin": "Zhōngguó rén",
      "german": "chinesische Person"
    },
    {
      "hanzi": "汉语",
      "pinyin": "Hànyǔ",
      "german": "chinesische Sprache"
    }
  ],
  "hsk1-nihao": [
    {
      "hanzi": "您好",
      "pinyin": "nín hǎo",
      "german": "Guten Tag (höflich)"
    },
    {
      "hanzi": "你们好",
      "pinyin": "nǐmen hǎo",
      "german": "Hallo zusammen"
    },
    {
      "hanzi": "你好吗",
      "pinyin": "nǐ hǎo ma",
      "german": "Wie geht es dir?"
    }
  ],
  "hsk1-xiexie": [
    {
      "hanzi": "多谢",
      "pinyin": "duō xiè",
      "german": "Vielen Dank"
    },
    {
      "hanzi": "谢谢你",
      "pinyin": "xièxie nǐ",
      "german": "Danke dir"
    },
    {
      "hanzi": "不客气",
      "pinyin": "bú kèqi",
      "german": "Gern geschehen (Antwort)"
    }
  ],
  "hsk1-fanguan": [
    {
      "hanzi": "饭店",
      "pinyin": "fàndiàn",
      "german": "Hotel / Restaurant"
    },
    {
      "hanzi": "吃饭",
      "pinyin": "chī fàn",
      "german": "essen"
    },
    {
      "hanzi": "米饭",
      "pinyin": "mǐfàn",
      "german": "gekochter Reis"
    }
  ],
  "hsk1-shangdian": [
    {
      "hanzi": "买东西",
      "pinyin": "mǎi dōngxi",
      "german": "einkaufen gehen"
    },
    {
      "hanzi": "饭店",
      "pinyin": "fàndiàn",
      "german": "Restaurant / Gaststätte"
    }
  ],
  "hsk1-yiyuan": [
    {
      "hanzi": "医生",
      "pinyin": "yīshēng",
      "german": "Arzt / Ärztin"
    },
    {
      "hanzi": "看医生",
      "pinyin": "kàn yīshēng",
      "german": "zum Arzt gehen"
    }
  ],
  "hsk1-huochezhan": [
    {
      "hanzi": "火车站",
      "pinyin": "huǒchēzhàn",
      "german": "Bahnhof"
    },
    {
      "hanzi": "火车",
      "pinyin": "huǒchē",
      "german": "Zug (Feuer-Wagen)"
    },
    {
      "hanzi": "坐车",
      "pinyin": "zuò chē",
      "german": "mit dem Fahrzeug fahren"
    }
  ],
  "hsk1-dianying": [
    {
      "hanzi": "看电影",
      "pinyin": "kàn diànyǐng",
      "german": "einen Film schauen"
    },
    {
      "hanzi": "电影院",
      "pinyin": "diànyǐngyuàn",
      "german": "Kino"
    }
  ],
  "hsk1-cha": [
    {
      "hanzi": "喝茶",
      "pinyin": "hē chá",
      "german": "Tee trinken"
    },
    {
      "hanzi": "绿茶",
      "pinyin": "lǜchá",
      "german": "grüner Tee"
    },
    {
      "hanzi": "红茶",
      "pinyin": "hóngchá",
      "german": "schwarzer Tee"
    },
    {
      "hanzi": "茶杯",
      "pinyin": "chábēi",
      "german": "Teetasse"
    }
  ]
};

// 100 % authentische HSK-1 Beispielsätze für ausnahmslos alle 163 Wörter
export const EXAMPLE_SENTENCES_MAP: Record<string, ExampleSentence[]> = {
  "hsk1-nihao": [
    {
      "hanzi": "你好！很高兴认识你。",
      "pinyin": "Nǐ hǎo! Hěn gāoxìng rènshi nǐ.",
      "german": "Hallo! Sehr erfreut, dich kennenzulernen.",
      "audioPath": "/audio/stories/s01-01.mp3"
    },
    {
      "hanzi": "你好吗？我很好。",
      "pinyin": "Nǐ hǎo ma? Wǒ hěn hǎo.",
      "german": "Wie geht es dir? Mir geht es gut."
    }
  ],
  "hsk1-xiexie": [
    {
      "hanzi": "谢谢你的帮助！",
      "pinyin": "Xièxie nǐ de bāngzhù!",
      "german": "Danke für deine Hilfe!"
    },
    {
      "hanzi": "“谢谢！”——“不客气。”",
      "pinyin": "“Xièxie!” —— “Bú kèqi.”",
      "german": "„Danke!“ — „Keine Ursache.“"
    }
  ],
  "hsk1-mingtian": [
    {
      "hanzi": "明天是星期日。",
      "pinyin": "Míngtiān shì xīngqīrì.",
      "german": "Morgen ist Sonntag."
    },
    {
      "hanzi": "明天我们去看电影。",
      "pinyin": "Míngtiān wǒmen qù kàn diànyǐng.",
      "german": "Morgen schauen wir einen Film.",
      "audioPath": "/audio/stories/s07-03.mp3"
    }
  ],
  "hsk1-xingqi": [
    {
      "hanzi": "今天星期几？",
      "pinyin": "Jīntiān xīngqī jǐ?",
      "german": "Welcher Wochentag ist heute?"
    },
    {
      "hanzi": "一个星期有七天。",
      "pinyin": "Yí ge xīngqī yǒu qī tiān.",
      "german": "Eine Woche hat sieben Tage."
    }
  ],
  "hsk1-xuesheng": [
    {
      "hanzi": "他是我们学校的学生。",
      "pinyin": "Tā shì wǒmen xuéxiào de xuésheng.",
      "german": "Er ist Schüler an unserer Schule."
    },
    {
      "hanzi": "大学生在图书馆看书。",
      "pinyin": "Dàxuéshēng zài túshūguǎn kàn shū.",
      "german": "Die Universitätsstudenten lesen in der Bibliothek."
    }
  ],
  "hsk1-tongxue": [
    {
      "hanzi": "我和同学一起学习汉语。",
      "pinyin": "Wǒ hé tóngxué yìqǐ xuéxí Hànyǔ.",
      "german": "Ich lerne zusammen mit meinem Mitschüler Chinesisch."
    },
    {
      "hanzi": "这些都是我的同学。",
      "pinyin": "Zhèxiē dōu shì wǒ de tóngxué.",
      "german": "Das hier sind alle meine Mitschüler."
    }
  ],
  "hsk1-pengyou": [
    {
      "hanzi": "他是我的好朋友。",
      "pinyin": "Tā shì wǒ de hǎo péngyou.",
      "german": "Er ist mein guter Freund."
    },
    {
      "hanzi": "我有三个中国朋友。",
      "pinyin": "Wǒ yǒu sān ge Zhōngguó péngyou.",
      "german": "Ich habe drei chinesische Freunde."
    }
  ],
  "hsk1-zhongguo": [
    {
      "hanzi": "中国菜很好吃。",
      "pinyin": "Zhōngguó cài hěn hǎochī.",
      "german": "Chinesisches Essen ist sehr lecker.",
      "audioPath": "/audio/stories/s02-03.mp3"
    },
    {
      "hanzi": "我想去中国北京。",
      "pinyin": "Wǒ xiǎng qù Zhōngguó Běijīng.",
      "german": "Ich möchte nach Peking in China reisen."
    }
  ],
  "hsk1-hanyu": [
    {
      "hanzi": "你会说汉语吗？",
      "pinyin": "Nǐ huì shuō Hànyǔ ma?",
      "german": "Kannst du Chinesisch sprechen?"
    },
    {
      "hanzi": "我喜欢学习汉语。",
      "pinyin": "Wǒ xǐhuan xuéxí Hànyǔ.",
      "german": "Ich lerne gerne Chinesisch."
    }
  ],
  "hsk1-diannao": [
    {
      "hanzi": "桌子上有一台新电脑。",
      "pinyin": "Zhuōzi shang yǒu yì tái xīn diànnǎo.",
      "german": "Auf dem Tisch steht ein neuer Computer."
    },
    {
      "hanzi": "他在用电脑工作。",
      "pinyin": "Tā zài yòng diànnǎo gōngzuò.",
      "german": "Er arbeitet mit dem Computer."
    }
  ],
  "hsk1-zhuozi": [
    {
      "hanzi": "桌子上有水和苹果。",
      "pinyin": "Zhuōzi shang yǒu shuǐ hé píngguǒ.",
      "german": "Auf dem Tisch stehen Wasser und Äpfel."
    },
    {
      "hanzi": "猫在桌子下面睡觉。",
      "pinyin": "Māo zài zhuōzi xiàmian shuìjiào.",
      "german": "Die Katze schläft unter dem Tisch."
    }
  ],
  "hsk1-pingguo": [
    {
      "hanzi": "我想买五个红苹果。",
      "pinyin": "Wǒ xiǎng mǎi wǔ ge hóng píngguǒ.",
      "german": "Ich möchte fünf rote Äpfel kaufen."
    },
    {
      "hanzi": "苹果很好吃，我很喜欢。",
      "pinyin": "Píngguǒ hěn hǎochī, wǒ hěn xǐhuan.",
      "german": "Äpfel sind sehr lecker, ich mag sie sehr."
    }
  ],
  "hsk1-ren": [
    {
      "hanzi": "中国人很友好。",
      "pinyin": "Zhōngguó rén hěn yǒuhǎo.",
      "german": "Chinesen sind sehr freundlich."
    },
    {
      "hanzi": "商店里有很多买东西的人。",
      "pinyin": "Shāngdiàn li yǒu hěn duō mǎi dōngxi de rén.",
      "german": "Im Laden sind viele einkaufende Menschen."
    }
  ],
  "hsk1-da": [
    {
      "hanzi": "这个医院非常大。",
      "pinyin": "Zhè ge yīyuàn fēicháng dà.",
      "german": "Dieses Krankenhaus ist sehr groß."
    },
    {
      "hanzi": "大苹果很甜。",
      "pinyin": "Dà píngguǒ hěn tián.",
      "german": "Große Äpfel sind sehr süß."
    }
  ],
  "hsk1-xiao": [
    {
      "hanzi": "那只小猫在跑。",
      "pinyin": "Nà zhī xiǎomāo zài pǎo.",
      "german": "Jene kleine Katze rennt."
    },
    {
      "hanzi": "小杯子里有茶。",
      "pinyin": "Xiǎo bēizi li yǒu chá.",
      "german": "In der kleinen Tasse ist Tee."
    }
  ],
  "hsk1-shui": [
    {
      "hanzi": "你想喝水吗？",
      "pinyin": "Nǐ xiǎng hē shuǐ ma?",
      "german": "Möchtest du Wasser trinken?"
    },
    {
      "hanzi": "桌子上有杯温水。",
      "pinyin": "Zhuōzi shang yǒu bēi wēnshuǐ.",
      "german": "Auf dem Tisch steht ein Glas lauwarmes Wasser."
    }
  ],
  "hsk1-yue": [
    {
      "hanzi": "今天是九月三日。",
      "pinyin": "Jīntiān shì jiǔyuè sān rì.",
      "german": "Heute ist der 3. September."
    },
    {
      "hanzi": "一个月有三十天。",
      "pinyin": "Yí ge yuè yǒu sānshí tiān.",
      "german": "Ein Monat hat dreißig Tage."
    }
  ],
  "hsk1-ri": [
    {
      "hanzi": "今天是十月一日。",
      "pinyin": "Jīntiān shì shíyuè yī rì.",
      "german": "Heute ist der erste Oktober."
    },
    {
      "hanzi": "星期日我们去看电影。",
      "pinyin": "Xīngqīrì wǒmen qù kàn diànyǐng.",
      "german": "Am Sonntag gehen wir ins Kino."
    }
  ],
  "hsk1-shi": [
    {
      "hanzi": "学校里有十个老师。",
      "pinyin": "Xuéxiào li yǒu shí ge lǎoshī.",
      "german": "In der Schule gibt es zehn Lehrer."
    },
    {
      "hanzi": "现在是十点十分。",
      "pinyin": "Xiànzài shì shí diǎn shí fēn.",
      "german": "Jetzt ist es zehn Uhr zehn."
    }
  ],
  "hsk1-yi": [
    {
      "hanzi": "我想买一本书。",
      "pinyin": "Wǒ xiǎng mǎi yì běn shū.",
      "german": "Ich möchte ein Buch kaufen."
    },
    {
      "hanzi": "桌子上有一个杯子。",
      "pinyin": "Zhuōzi shang yǒu yí ge bēizi.",
      "german": "Auf dem Tisch steht eine Tasse."
    }
  ],
  "hsk1-er": [
    {
      "hanzi": "他有两个女儿。",
      "pinyin": "Tā yǒu liǎng ge nǚ'ér.",
      "german": "Er hat zwei Töchter."
    },
    {
      "hanzi": "二月的天气比较冷。",
      "pinyin": "Èryuè de tiānqì bǐjiào lěng.",
      "german": "Das Wetter im Februar ist vergleichsweise kalt."
    }
  ],
  "hsk1-san": [
    {
      "hanzi": "我家有三口人。",
      "pinyin": "Wǒ jiā yǒu sān kǒu rén.",
      "german": "Meine Familie besteht aus drei Personen."
    },
    {
      "hanzi": "他在北京住了三年。",
      "pinyin": "Tā zài Běijīng zhù le sān nián.",
      "german": "Er hat drei Jahre in Peking gewohnt."
    }
  ],
  "hsk1-si": [
    {
      "hanzi": "我有四个中国同学。",
      "pinyin": "Wǒ yǒu sì ge Zhōngguó tóngxué.",
      "german": "Ich habe vier chinesische Mitschüler."
    },
    {
      "hanzi": "现在下午四点整。",
      "pinyin": "Xiànzài xiàwǔ sì diǎn zhěng.",
      "german": "Jetzt ist es genau vier Uhr nachmittags."
    }
  ],
  "hsk1-wu": [
    {
      "hanzi": "这件衣服五十块。",
      "pinyin": "Zhè jiàn yīfu wǔshí kuài.",
      "german": "Dieses Kleidungsstück kostet fünfzig Yuan."
    },
    {
      "hanzi": "五点我们在饭馆见面。",
      "pinyin": "Wǔ diǎn wǒmen zài fànguǎn jiànmiàn.",
      "german": "Um fünf Uhr treffen wir uns im Restaurant."
    }
  ],
  "hsk1-liu": [
    {
      "hanzi": "他六点起床做早饭。",
      "pinyin": "Tā liù diǎn qǐchuáng zuò zǎofàn.",
      "german": "Er steht um sechs Uhr auf, um Frühstück zu machen."
    },
    {
      "hanzi": "星期六我和朋友去看电影。",
      "pinyin": "Xīngqīliù wǒ hé péngyou qù kàn diànyǐng.",
      "german": "Am Samstag gehe ich mit Freunden ins Kino."
    }
  ],
  "hsk1-qi": [
    {
      "hanzi": "一个星期有七天。",
      "pinyin": "Yí ge xīngqī yǒu qī tiān.",
      "german": "Eine Woche hat sieben Tage."
    },
    {
      "hanzi": "今天七月七号。",
      "pinyin": "Jīntiān qīyuè qī hào.",
      "german": "Heute ist der 7. Juli."
    }
  ],
  "hsk1-ba": [
    {
      "hanzi": "八点我们在学校见。",
      "pinyin": "Bā diǎn wǒmen zài xuéxiào jiàn.",
      "german": "Um acht Uhr sehen wir uns in der Schule."
    },
    {
      "hanzi": "他买了八个大苹果。",
      "pinyin": "Tā mǎi le bā ge dà píngguǒ.",
      "german": "Er hat acht große Äpfel gekauft."
    }
  ],
  "hsk1-jiu": [
    {
      "hanzi": "现在上午九点半。",
      "pinyin": "Xiànzài shàngwǔ jiǔ diǎn bàn.",
      "german": "Jetzt ist es halb zehn Uhr vormittags."
    },
    {
      "hanzi": "九月开学了。",
      "pinyin": "Jiǔyuè kāixué le.",
      "german": "Im September hat die Schule begonnen."
    }
  ],
  "hsk1-bai": [
    {
      "hanzi": "这本书一百块钱。",
      "pinyin": "Zhè běn shū yìbǎi kuài qián.",
      "german": "Dieses Buch kostet einhundert Yuan."
    },
    {
      "hanzi": "学校里有一百多个学生。",
      "pinyin": "Xuéxiào li yǒu yìbǎi duō ge xuésheng.",
      "german": "In der Schule gibt es über hundert Schüler."
    }
  ],
  "hsk1-wo": [
    {
      "hanzi": "我是德国人，我在学汉语。",
      "pinyin": "Wǒ shì Déguó rén, wǒ zài xué Hànyǔ.",
      "german": "Ich bin Deutscher, ich lerne Chinesisch."
    },
    {
      "hanzi": "我喜欢喝中国茶。",
      "pinyin": "Wǒ xǐhuan hē Zhōngguó chá.",
      "german": "Ich trinke gerne chinesischen Tee."
    }
  ],
  "hsk1-ni": [
    {
      "hanzi": "你是学生还是老师？",
      "pinyin": "Nǐ shì xuésheng háishi lǎoshī?",
      "german": "Bist du Schüler oder Lehrer?"
    },
    {
      "hanzi": "你想吃点儿什么？",
      "pinyin": "Nǐ xiǎng chī diǎnr shénme?",
      "german": "Was möchtest du gerne essen?"
    }
  ],
  "hsk1-ta": [
    {
      "hanzi": "他是我的汉语老师。",
      "pinyin": "Tā shì wǒ de Hànyǔ lǎoshī.",
      "german": "Er ist mein Chinesischlehrer."
    },
    {
      "hanzi": "他在北京大学学习。",
      "pinyin": "Tā zài Běijīng Dàxué xuéxí.",
      "german": "Er studiert an der Peking-Universität."
    }
  ],
  "hsk1-ta-nv": [
    {
      "hanzi": "她是一位很温柔的医生。",
      "pinyin": "Tā shì yí wèi hěn wēnróu de yīshēng.",
      "german": "Sie ist eine sehr einfühlsame Ärztin."
    },
    {
      "hanzi": "她的衣服真漂亮。",
      "pinyin": "Tā de yīfu zhēn piàoliang.",
      "german": "Ihre Kleidung ist wirklich hübsch."
    }
  ],
  "hsk1-women": [
    {
      "hanzi": "我们去中国饭馆吃饭吧。",
      "pinyin": "Wǒmen qù Zhōngguó fànguǎn chī fàn ba.",
      "german": "Lass uns ins chinesische Restaurant essen gehen.",
      "audioPath": "/audio/stories/s02-01.mp3"
    },
    {
      "hanzi": "我们都是好朋友。",
      "pinyin": "Wǒmen dōu shì hǎo péngyou.",
      "german": "Wir sind alle gute Freunde."
    }
  ],
  "hsk1-tamen": [
    {
      "hanzi": "他们都在医院工作。",
      "pinyin": "Tāmen dōu zài yīyuàn gōngzuò.",
      "german": "Sie arbeiten alle im Krankenhaus."
    },
    {
      "hanzi": "他们是我的同班同学。",
      "pinyin": "Tāmen shì wǒ de tóngbān tóngxué.",
      "german": "Sie sind meine Klassenkameraden."
    }
  ],
  "hsk1-ma": [
    {
      "hanzi": "你想喝杯热茶吗？",
      "pinyin": "Nǐ xiǎng hē bēi rèchá ma?",
      "german": "Möchtest du eine Tasse heißen Tee trinken?"
    },
    {
      "hanzi": "他是你的老师吗？",
      "pinyin": "Tā shì nǐ de lǎoshī ma?",
      "german": "Ist er dein Lehrer?"
    }
  ],
  "hsk1-ne": [
    {
      "hanzi": "我是学生，你呢？",
      "pinyin": "Wǒ shì xuésheng, nǐ ne?",
      "german": "Ich bin Schüler, und du?"
    },
    {
      "hanzi": "我的书呢？在桌子上。",
      "pinyin": "Wǒ de shū ne? Zài zhuōzi shang.",
      "german": "Wo ist mein Buch? Auf dem Tisch."
    }
  ],
  "hsk1-bu": [
    {
      "hanzi": "我不是中国人，我是德国人。",
      "pinyin": "Wǒ bú shì Zhōngguó rén, wǒ shì Déguó rén.",
      "german": "Ich bin kein Chinese, ich bin Deutscher."
    },
    {
      "hanzi": "今天天气不冷也不热。",
      "pinyin": "Jīntiān tiānqì bù lěng yě bú rè.",
      "german": "Heute ist das Wetter weder kalt noch heiß."
    }
  ],
  "hsk1-mei": [
    {
      "hanzi": "我没有电脑。",
      "pinyin": "Wǒ méiyǒu diànnǎo.",
      "german": "Ich habe keinen Computer."
    },
    {
      "hanzi": "他今天没来学校。",
      "pinyin": "Tā jīntiān méi lái xuéxiào.",
      "german": "Er ist heute nicht zur Schule gekommen."
    }
  ],
  "hsk1-de": [
    {
      "hanzi": "这是王老师的书。",
      "pinyin": "Zhè shì Wáng lǎoshī de shū.",
      "german": "Das ist das Buch von Lehrer Wang."
    },
    {
      "hanzi": "我买了一件漂亮的衣服。",
      "pinyin": "Wǒ mǎi le yí jiàn piàoliang de yīfu.",
      "german": "Ich habe ein hübsches Kleidungsstück gekauft."
    }
  ],
  "hsk1-shi-be": [
    {
      "hanzi": "我是学生。",
      "pinyin": "Wǒ shì xuésheng.",
      "german": "Ich bin Schüler."
    },
    {
      "hanzi": "明天是星期一。",
      "pinyin": "Míngtiān shì xīngqīyī.",
      "german": "Morgen ist Montag."
    }
  ],
  "hsk1-you": [
    {
      "hanzi": "桌子上有一本书。",
      "pinyin": "Zhuōzi shang yǒu yì běn shū.",
      "german": "Auf dem Tisch liegt ein Buch."
    },
    {
      "hanzi": "你家有几口人？",
      "pinyin": "Nǐ jiā yǒu jǐ kǒu rén.",
      "german": "Wie viele Personen hat deine Familie?"
    }
  ],
  "hsk1-shei": [
    {
      "hanzi": "那个人是谁？",
      "pinyin": "Nà ge rén shì shéi?",
      "german": "Wer ist diese Person dort?"
    },
    {
      "hanzi": "谁想喝水？",
      "pinyin": "Shéi xiǎng hē shuǐ?",
      "german": "Wer möchte Wasser trinken?"
    }
  ],
  "hsk1-shenme": [
    {
      "hanzi": "你叫什么名字？",
      "pinyin": "Nǐ jiào shénme míngzi?",
      "german": "Wie heißt du mit Namen?"
    },
    {
      "hanzi": "你想吃什么？",
      "pinyin": "Nǐ xiǎng chī shénme?",
      "german": "Was möchtest du essen?"
    }
  ],
  "hsk1-duoshao": [
    {
      "hanzi": "这个电脑多少钱？",
      "pinyin": "Zhè ge diànnǎo duōshao qián?",
      "german": "Wie viel kostet dieser Computer?"
    },
    {
      "hanzi": "学校有多少个学生？",
      "pinyin": "Xuéxiào yǒu duōshao ge xuésheng?",
      "german": "Wie viele Schüler hat die Schule?"
    }
  ],
  "hsk1-ji": [
    {
      "hanzi": "现在几点了？",
      "pinyin": "Xiànzài jǐ diǎn le?",
      "german": "Wie viel Uhr ist es jetzt?"
    },
    {
      "hanzi": "你想买几本书？",
      "pinyin": "Nǐ xiǎng mǎi jǐ běn shū?",
      "german": "Wie viele Bücher möchtest du kaufen?"
    }
  ],
  "hsk1-zheer": [
    {
      "hanzi": "请坐在这儿喝茶。",
      "pinyin": "Qǐng zuò zài zhèr hē chá.",
      "german": "Bitte setz dich hierher und trink Tee."
    },
    {
      "hanzi": "这儿的米饭很好吃。",
      "pinyin": "Zhèr de mǐfàn hěn hǎochī.",
      "german": "Der gekochte Reis hier ist sehr lecker."
    }
  ],
  "hsk1-zaijian": [
    {
      "hanzi": "老师，再见！",
      "pinyin": "Lǎoshī, zàijiàn!",
      "german": "Auf Wiedersehen, Lehrer!"
    },
    {
      "hanzi": "明天见，再见！",
      "pinyin": "Míngtiān jiàn, zàijiàn!",
      "german": "Bis morgen, auf Wiedersehen!"
    }
  ],
  "hsk1-mingzi": [
    {
      "hanzi": "你的名字怎么写？",
      "pinyin": "Nǐ de míngzi zěnme xiě?",
      "german": "Wie schreibt man deinen Namen?"
    },
    {
      "hanzi": "他的名字叫大卫。",
      "pinyin": "Tā de míngzi jiào Dàwèi.",
      "german": "Sein Name lautet David."
    }
  ],
  "hsk1-baba": [
    {
      "hanzi": "我爸爸在医院工作。",
      "pinyin": "Wǒ bàba zài yīyuàn gōngzuò.",
      "german": "Mein Vater arbeitet im Krankenhaus."
    },
    {
      "hanzi": "爸爸喜欢喝热茶。",
      "pinyin": "Bàba xǐhuan hē rèchá.",
      "german": "Papa trinkt gerne heißen Tee."
    }
  ],
  "hsk1-mama": [
    {
      "hanzi": "我妈妈做的菜非常好吃。",
      "pinyin": "Wǒ māma zuò de cài fēicháng hǎochī.",
      "german": "Das von meiner Mutter gekochte Essen ist überaus lecker."
    },
    {
      "hanzi": "妈妈在看书。",
      "pinyin": "Māma zài kàn shū.",
      "german": "Mama liest ein Buch."
    }
  ],
  "hsk1-xuexiao": [
    {
      "hanzi": "我在学校学习汉语。",
      "pinyin": "Wǒ zài xuéxiào xuéxí Hànyǔ.",
      "german": "Ich lerne in der Schule Chinesisch.",
      "audioPath": "/audio/stories/s04-04.mp3"
    },
    {
      "hanzi": "我们学校很大。",
      "pinyin": "Wǒmen xuéxiào hěn dà.",
      "german": "Unsere Schule ist sehr groß."
    }
  ],
  "hsk1-mao": [
    {
      "hanzi": "这只小猫非常可爱。",
      "pinyin": "Zhè zhī xiǎomāo fēicháng kě'ài.",
      "german": "Diese kleine Katze ist ausgesprochen süß."
    },
    {
      "hanzi": "小猫在椅子下睡觉。",
      "pinyin": "Xiǎomāo zài yǐzi xià shuìjiào.",
      "german": "Die kleine Katze schläft unter dem Stuhl."
    }
  ],
  "hsk1-ai": [
    {
      "hanzi": "我爱爸爸和妈妈。",
      "pinyin": "Wǒ ài bàba hé māma.",
      "german": "Ich liebe Papa und Mama."
    },
    {
      "hanzi": "她很爱看中国电影。",
      "pinyin": "Tā hěn ài kàn Zhōngguó diànyǐng.",
      "german": "Sie schaut leidenschaftlich gerne chinesische Filme."
    }
  ],
  "hsk1-xihuan": [
    {
      "hanzi": "我喜欢吃中国菜。",
      "pinyin": "Wǒ xǐhuan chī Zhōngguó cài.",
      "german": "Ich esse gerne chinesisches Essen."
    },
    {
      "hanzi": "你喜欢喝茶还是水？",
      "pinyin": "Nǐ xǐhuan hē chá háishi shuǐ?",
      "german": "Trinkst du lieber Tee oder Wasser?"
    }
  ],
  "hsk1-hui": [
    {
      "hanzi": "我会说一点儿汉语。",
      "pinyin": "Wǒ huì shuō yìdiǎnr Hànyǔ.",
      "german": "Ich kann ein bisschen Chinesisch sprechen."
    },
    {
      "hanzi": "他会开出租车。",
      "pinyin": "Tā huì kāi chūzūchē.",
      "german": "Er kann Taxi fahren."
    }
  ],
  "hsk1-kan": [
    {
      "hanzi": "他在看一本汉语书。",
      "pinyin": "Tā zài kàn yì běn Hànyǔ shū.",
      "german": "Er liest ein Chinesischbuch."
    },
    {
      "hanzi": "我们一起去看电影吧。",
      "pinyin": "Wǒmen yìqǐ qù kàn diànyǐng ba.",
      "german": "Lass uns zusammen ins Kino gehen."
    }
  ],
  "hsk1-chi": [
    {
      "hanzi": "你想吃米饭还是菜？",
      "pinyin": "Nǐ xiǎng chī mǐfàn háishi cài?",
      "german": "Möchtest du Reis oder Speisen essen?"
    },
    {
      "hanzi": "中国菜真好吃！",
      "pinyin": "Zhōngguó cài zhēn hǎochī!",
      "german": "Chinesisches Essen ist wirklich lecker!"
    }
  ],
  "hsk1-he": [
    {
      "hanzi": "请喝杯热茶。",
      "pinyin": "Qǐng hē bēi rèchá.",
      "german": "Bitte trink eine Tasse heißen Tee."
    },
    {
      "hanzi": "天气很热，多喝水。",
      "pinyin": "Tiānqì hěn rè, duō hē shuǐ.",
      "german": "Das Wetter ist heiß, trink mehr Wasser."
    }
  ],
  "hsk1-nin": [
    {
      "hanzi": "您好，王老师！",
      "pinyin": "Nín hǎo, Wáng lǎoshī!",
      "german": "Guten Tag, Herr Lehrer Wang!"
    },
    {
      "hanzi": "请问您想喝点儿什么？",
      "pinyin": "Qǐngwèn nín xiǎng hē diǎnr shénme?",
      "german": "Darf ich fragen, was Sie gerne trinken möchten?"
    }
  ],
  "hsk1-zhe": [
    {
      "hanzi": "这是我的电脑。",
      "pinyin": "Zhè shì wǒ de diànnǎo.",
      "german": "Das hier ist mein Computer."
    },
    {
      "hanzi": "这个人是我的同学。",
      "pinyin": "Zhè ge rén shì wǒ de tóngxué.",
      "german": "Diese Person ist mein Mitschüler."
    }
  ],
  "hsk1-na": [
    {
      "hanzi": "那是李医生的衣服。",
      "pinyin": "Nà shì Lǐ yīshēng de yīfu.",
      "german": "Das dort ist die Kleidung von Arzt Li."
    },
    {
      "hanzi": "那家商店很大。",
      "pinyin": "Nà jiā shāngdiàn hěn dà.",
      "german": "Jener Laden dort ist sehr groß."
    }
  ],
  "hsk1-naer": [
    {
      "hanzi": "我的书在那儿。",
      "pinyin": "Wǒ de shū zài nàr.",
      "german": "Mein Buch liegt dort drüben."
    },
    {
      "hanzi": "火车站在那儿前面。",
      "pinyin": "Huǒchēzhàn zài nàr qiánmian.",
      "german": "Der Bahnhof ist dort vorne."
    }
  ],
  "hsk1-na-which": [
    {
      "hanzi": "你想买哪件衣服？",
      "pinyin": "Nǐ xiǎng mǎi nǎ jiàn yīfu?",
      "german": "Welches Kleidungsstück möchtest du kaufen?"
    },
    {
      "hanzi": "你是哪国人？",
      "pinyin": "Nǐ shì nǎ guó rén?",
      "german": "Aus welchem Land kommst du?"
    }
  ],
  "hsk1-naer-which": [
    {
      "hanzi": "请问，洗手间在哪儿？",
      "pinyin": "Qǐngwèn, xǐshǒujiān zài nǎr?",
      "german": "Darf ich fragen, wo die Toilette ist?"
    },
    {
      "hanzi": "你明天想去哪儿？",
      "pinyin": "Nǐ míngtiān xiǎng qù nǎr?",
      "german": "Wohin möchtest du morgen gehen?"
    }
  ],
  "hsk1-zenme": [
    {
      "hanzi": "这个字怎么读？",
      "pinyin": "Zhè ge zì zěnme dú?",
      "german": "Wie wird dieses Schriftzeichen ausgesprochen?"
    },
    {
      "hanzi": "你怎么没去上课？",
      "pinyin": "Nǐ zěnme méi qù shàng kè?",
      "german": "Warum bist du nicht zum Unterricht gegangen?"
    }
  ],
  "hsk1-zenmeyang": [
    {
      "hanzi": "今天北京天气怎么样？",
      "pinyin": "Jīntiān Běijīng tiānqì zěnmeyàng?",
      "german": "Wie ist das Wetter heute in Peking?"
    },
    {
      "hanzi": "这件衣服怎么样？",
      "pinyin": "Zhè jiàn yīfu zěnmeyàng?",
      "german": "Wie gefällt dir dieses Kleidungsstück?"
    }
  ],
  "hsk1-ling": [
    {
      "hanzi": "今天是二零二六年。",
      "pinyin": "Jīntiān shì èr líng èr liù nián.",
      "german": "Heute ist das Jahr 2026."
    },
    {
      "hanzi": "房间号是三零一。",
      "pinyin": "Fángjiān hào shì sān líng yī.",
      "german": "Die Zimmernummer lautet 301."
    }
  ],
  "hsk1-ge": [
    {
      "hanzi": "我想买一个大苹果。",
      "pinyin": "Wǒ xiǎng mǎi yí ge dà píngguǒ.",
      "german": "Ich möchte einen großen Apfel kaufen."
    },
    {
      "hanzi": "他是一个好学生。",
      "pinyin": "Tā shì yí ge hǎo xuésheng.",
      "german": "Er ist ein guter Schüler."
    }
  ],
  "hsk1-sui": [
    {
      "hanzi": "他今年十八岁。",
      "pinyin": "Tā jīnnián shíbā suì.",
      "german": "Er ist dieses Jahr 18 Jahre alt."
    },
    {
      "hanzi": "你的女儿几岁了？",
      "pinyin": "Nǐ de nǚ'ér jǐ suì le?",
      "german": "Wie alt ist deine Tochter?"
    }
  ],
  "hsk1-ben": [
    {
      "hanzi": "桌子上有一本汉语书。",
      "pinyin": "Zhuōzi shang yǒu yì běn Hànyǔ shū.",
      "german": "Auf dem Tisch liegt ein Chinesischbuch."
    },
    {
      "hanzi": "我买了两本书。",
      "pinyin": "Wǒ mǎi le liǎng běn shū.",
      "german": "Ich habe zwei Bücher gekauft."
    }
  ],
  "hsk1-xie": [
    {
      "hanzi": "我想买些水果。",
      "pinyin": "Wǒ xiǎng mǎi xiē shuǐguǒ.",
      "german": "Ich möchte etwas Obst kaufen."
    },
    {
      "hanzi": "这些菜非常好吃。",
      "pinyin": "Zhèxiē cài fēicháng hǎochī.",
      "german": "Diese Gerichte schmecken ganz hervorragend."
    }
  ],
  "hsk1-kuai": [
    {
      "hanzi": "这块手表多少钱？",
      "pinyin": "Zhè kuài shǒubiǎo duōshao qián?",
      "german": "Wie viel kostet diese Armbanduhr?"
    },
    {
      "hanzi": "这个杯子十块钱。",
      "pinyin": "Zhè ge bēizi shí kuài qián.",
      "german": "Dieser Becher kostet zehn Yuan."
    }
  ],
  "hsk1-hen": [
    {
      "hanzi": "中国菜很好吃。",
      "pinyin": "Zhōngguó cài hěn hǎochī.",
      "german": "Chinesisches Essen ist sehr lecker."
    },
    {
      "hanzi": "今天天气很好。",
      "pinyin": "Jīntiān tiānqì hěn hǎo.",
      "german": "Heute ist das Wetter sehr gut."
    }
  ],
  "hsk1-tai": [
    {
      "hanzi": "太好了，明天不用上课！",
      "pinyin": "Tài hǎo le, míngtiān bú yòng shàng kè!",
      "german": "Großartig, morgen haben wir schulfrei!"
    },
    {
      "hanzi": "今天太热了，想吃西瓜。",
      "pinyin": "Jīntiān tài rè le, xiǎng chī xīguā.",
      "german": "Heute ist es zu heiß, ich möchte Wassermelone essen."
    }
  ],
  "hsk1-dou": [
    {
      "hanzi": "我们都是北京大学的学生。",
      "pinyin": "Wǒmen dōu shì Běijīng Dàxué de xuésheng.",
      "german": "Wir sind alle Studenten der Peking-Universität."
    },
    {
      "hanzi": "这些书我都喜欢。",
      "pinyin": "Zhèxiē shū wǒ dōu xǐhuan.",
      "german": "Diese Bücher mag ich alle."
    }
  ],
  "hsk1-he-and": [
    {
      "hanzi": "爸爸和妈妈都很健康。",
      "pinyin": "Bàba hé māma dōu hěn jiànkāng.",
      "german": "Papa und Mama sind beide sehr gesund."
    },
    {
      "hanzi": "我和朋友一起去饭馆。",
      "pinyin": "Wǒ hé péngyou yìqǐ qù fànguǎn.",
      "german": "Ich gehe zusammen mit meinem Freund ins Restaurant."
    }
  ],
  "hsk1-zai": [
    {
      "hanzi": "他在医院工作。",
      "pinyin": "Tā zài yīyuàn gōngzuò.",
      "german": "Er arbeitet im Krankenhaus."
    },
    {
      "hanzi": "你在做什么呢？",
      "pinyin": "Nǐ zài zuò shénme ne?",
      "german": "Was machst du gerade?"
    }
  ],
  "hsk1-le": [
    {
      "hanzi": "他回北京了。",
      "pinyin": "Tā huí Běijīng le.",
      "german": "Er ist nach Peking zurückgekehrt."
    },
    {
      "hanzi": "太晚了，该睡觉了。",
      "pinyin": "Tài wǎn le, gāi shuìjiào le.",
      "german": "Es ist zu spät geworden, Zeit zum Schlafen."
    }
  ],
  "hsk1-wei": [
    {
      "hanzi": "喂，请问王老师在吗？",
      "pinyin": "Wèi, qǐngwèn Wáng lǎoshī zài ma?",
      "german": "Hallo, ist Herr Lehrer Wang bitte da?"
    },
    {
      "hanzi": "喂，你好！我是大卫。",
      "pinyin": "Wèi, nǐ hǎo! Wǒ shì Dàwèi.",
      "german": "Hallo, guten Tag! Hier spricht David."
    }
  ],
  "hsk1-jia": [
    {
      "hanzi": "我家在北京。",
      "pinyin": "Wǒ jiā zài Běijīng.",
      "german": "Mein Zuhause ist in Peking."
    },
    {
      "hanzi": "我们下午五点回家。",
      "pinyin": "Wǒmen xiàwǔ wǔ diǎn huí jiā.",
      "german": "Wir kehren nachmittags um fünf Uhr nach Hause zurück."
    }
  ],
  "hsk1-erzi": [
    {
      "hanzi": "他的儿子今年八岁了。",
      "pinyin": "Tā de érzi jīnnián bā suì le.",
      "german": "Sein Sohn ist dieses Jahr acht Jahre alt geworden."
    },
    {
      "hanzi": "我的儿子喜欢看书。",
      "pinyin": "Wǒ de érzi xǐhuan kàn shū.",
      "german": "Mein Sohn liest gerne Bücher."
    }
  ],
  "hsk1-nver": [
    {
      "hanzi": "李医生的女儿很漂亮。",
      "pinyin": "Lǐ yīshēng de nǚ'ér hěn piàoliang.",
      "german": "Die Tochter von Arzt Li ist sehr hübsch."
    },
    {
      "hanzi": "她的女儿会说汉语。",
      "pinyin": "Tā de nǚ'ér huì shuō Hànyǔ.",
      "german": "Ihre Tochter kann Chinesisch sprechen."
    }
  ],
  "hsk1-laoshi": [
    {
      "hanzi": "王老师教我们汉语。",
      "pinyin": "Wáng lǎoshī jiāo wǒmen Hànyǔ.",
      "german": "Lehrer Wang unterrichtet uns in Chinesisch."
    },
    {
      "hanzi": "老师好！",
      "pinyin": "Lǎoshī hǎo!",
      "german": "Guten Tag, Herr Lehrer!"
    }
  ],
  "hsk1-yisheng": [
    {
      "hanzi": "他是大医院的医生。",
      "pinyin": "Tā shì dà yīyuàn de yīshēng.",
      "german": "Er ist Arzt in einem großen Krankenhaus."
    },
    {
      "hanzi": "去看医生吧。",
      "pinyin": "Qù kàn yīshēng ba.",
      "german": "Geh bitte zum Arzt."
    }
  ],
  "hsk1-xiansheng": [
    {
      "hanzi": "张先生在北京开公司。",
      "pinyin": "Zhāng xiānsheng zài Běijīng kāi gōngsī.",
      "german": "Herr Zhang leitet eine Firma in Peking."
    },
    {
      "hanzi": "这位先生想买电脑。",
      "pinyin": "Zhè wèi xiānsheng xiǎng mǎi diànnǎo.",
      "german": "Dieser Herr möchte einen Computer kaufen."
    }
  ],
  "hsk1-xiaojie": [
    {
      "hanzi": "李小姐在商店买衣服。",
      "pinyin": "Lǐ xiǎojie zài shāngdiàn mǎi yīfu.",
      "german": "Fräulein Li kauft im Geschäft Kleidung."
    },
    {
      "hanzi": "王小姐非常客气。",
      "pinyin": "Wáng xiǎojie fēicháng kèqi.",
      "german": "Fräulein Wang ist überaus höflich."
    }
  ],
  "hsk1-yifu": [
    {
      "hanzi": "这件新衣服真好看。",
      "pinyin": "Zhè jiàn xīn yīfu zhēn hǎokàn.",
      "german": "Dieses neue Kleidungsstück sieht wirklich gut aus."
    },
    {
      "hanzi": "天气冷了，多穿衣服。",
      "pinyin": "Tiānqì lěng le, duō chuān yīfu.",
      "german": "Das Wetter ist kalt geworden, zieh mehr Kleidung an."
    }
  ],
  "hsk1-cai": [
    {
      "hanzi": "今天妈妈做了很多好吃的菜。",
      "pinyin": "Jīntiān māma zuò le hěn duō hǎochī de cài.",
      "german": "Heute hat Mama viele leckere Gerichte gekocht."
    },
    {
      "hanzi": "中国菜很有特色。",
      "pinyin": "Zhōngguó cài hěn yǒu tèsè.",
      "german": "Chinesische Gerichte haben ihren ganz eigenen Charakter."
    }
  ],
  "hsk1-mifan": [
    {
      "hanzi": "请给我一碗热米饭。",
      "pinyin": "Qǐng gěi wǒ yì wǎn rè mǐfàn.",
      "german": "Bitte gib mir eine Schale warmen gekochten Reis."
    },
    {
      "hanzi": "我喜欢吃菜配米饭。",
      "pinyin": "Wǒ xǐhuan chī cài pèi mǐfàn.",
      "german": "Ich esse gerne Gerichte mit Reis."
    }
  ],
  "hsk1-shuiguo": [
    {
      "hanzi": "桌子上有新鲜的水果。",
      "pinyin": "Zhuōzi shang yǒu xīnxiān de shuǐguǒ.",
      "german": "Auf dem Tisch steht frisches Obst."
    },
    {
      "hanzi": "多吃水果对身体好。",
      "pinyin": "Duō chī shuǐguǒ duì shēntǐ hǎo.",
      "german": "Mehr Früchte zu essen tut dem Körper gut."
    }
  ],
  "hsk1-cha": [
    {
      "hanzi": "中国人很喜欢喝绿茶。",
      "pinyin": "Zhōngguó rén hěn xǐhuan hē lǜchá.",
      "german": "Chinesen trinken sehr gerne grünen Tee."
    },
    {
      "hanzi": "请喝杯热茶。",
      "pinyin": "Qǐng hē bēi rèchá.",
      "german": "Bitte trinken Sie eine Tasse heißen Tee."
    }
  ],
  "hsk1-beizi": [
    {
      "hanzi": "这个水杯很漂亮。",
      "pinyin": "Zhè ge shuǐbēi hěn piàoliang.",
      "german": "Dieser Wasserbecher ist sehr hübsch."
    },
    {
      "hanzi": "杯子里有热茶。",
      "pinyin": "Bēizi li yǒu rèchá.",
      "german": "In der Tasse ist heißer Tee."
    }
  ],
  "hsk1-qian": [
    {
      "hanzi": "这个苹果多少钱？",
      "pinyin": "Zhè ge píngguǒ duōshao qián?",
      "german": "Wie viel Geld kostet dieser Apfel?"
    },
    {
      "hanzi": "我钱包里没有钱了。",
      "pinyin": "Wǒ qiánbāo li méiyǒu qián le.",
      "german": "In meiner Geldbörse ist kein Geld mehr."
    }
  ],
  "hsk1-feiji": [
    {
      "hanzi": "我们明天坐飞机去北京。",
      "pinyin": "Wǒmen míngtiān zuò fēijī qù Běijīng.",
      "german": "Wir fliegen morgen mit dem Flugzeug nach Peking."
    },
    {
      "hanzi": "天上有架大飞机。",
      "pinyin": "Tiān shang yǒu jià dà fēijī.",
      "german": "Am Himmel fliegt ein großes Flugzeug."
    }
  ],
  "hsk1-chuzuche": [
    {
      "hanzi": "我们坐出租车去饭馆吧。",
      "pinyin": "Wǒmen zuò chūzūchē qù fànguǎn ba.",
      "german": "Lass uns mit dem Taxi zum Restaurant fahren."
    },
    {
      "hanzi": "校门前有很多出租车。",
      "pinyin": "Xiàomén qián yǒu hěn duō chūzūchē.",
      "german": "Vor dem Schultor stehen viele Taxis."
    }
  ],
  "hsk1-dianshi": [
    {
      "hanzi": "晚上他在看电视。",
      "pinyin": "Wǎnshang tā zài kàn diànshì.",
      "german": "Abends schaut er fern."
    },
    {
      "hanzi": "客厅里有一台大电视。",
      "pinyin": "Kètīng li yǒu yì tái dà diànshì.",
      "german": "Im Wohnzimmer steht ein großer Fernseher."
    }
  ],
  "hsk1-dianying": [
    {
      "hanzi": "明天我们去看电影吧。",
      "pinyin": "Míngtiān wǒmen qù kàn diànyǐng ba.",
      "german": "Lass uns morgen ins Kino gehen.",
      "audioPath": "/audio/stories/s07-03.mp3"
    },
    {
      "hanzi": "这部中国电影很有名。",
      "pinyin": "Zhè bù Zhōngguó diànyǐng hěn yǒumíng.",
      "german": "Dieser chinesische Film ist sehr berühmt."
    }
  ],
  "hsk1-tianqi": [
    {
      "hanzi": "今天天气真好，很晴朗。",
      "pinyin": "Jīntiān tiānqì zhēn hǎo, hěn qínglǎng.",
      "german": "Heute ist das Wetter wirklich schön und heiter.",
      "audioPath": "/audio/stories/s05-03.mp3"
    },
    {
      "hanzi": "北京冬天的天气很冷。",
      "pinyin": "Běijīng dōngtiān de tiānqì hěn lěng.",
      "german": "Das Wetter im Pekinger Winter ist sehr kalt."
    }
  ],
  "hsk1-gou": [
    {
      "hanzi": "那只小狗在草地上玩。",
      "pinyin": "Nà zhī xiǎogǒu zài cǎodì shang wán.",
      "german": "Jener kleine Hund spielt auf der Wiese."
    },
    {
      "hanzi": "我家有一只大狗。",
      "pinyin": "Wǒ jiā yǒu yì zhī dà gǒu.",
      "german": "Meine Familie hat einen großen Hund."
    }
  ],
  "hsk1-dongxi": [
    {
      "hanzi": "他在商店买了很多好吃的买东西。",
      "pinyin": "Tā zài shāngdiàn mǎi le hěn duō dōngxi.",
      "german": "Er hat im Laden viele Sachen gekauft."
    },
    {
      "hanzi": "这是什么东西？",
      "pinyin": "Zhè shì shénme dōngxi?",
      "german": "Was für ein Ding ist das?"
    }
  ],
  "hsk1-shu": [
    {
      "hanzi": "我在看一本很有趣的书。",
      "pinyin": "Wǒ zài kàn yì běn hěn yǒuqù de shū.",
      "german": "Ich lese ein sehr interessantes Buch."
    },
    {
      "hanzi": "桌子上放着汉语书。",
      "pinyin": "Zhuōzi shang fàng zhe Hànyǔ shū.",
      "german": "Auf dem Tisch liegt ein Chinesischbuch."
    }
  ],
  "hsk1-zi": [
    {
      "hanzi": "这个汉字怎么写？",
      "pinyin": "Zhè ge hànzì zěnme xiě?",
      "german": "Wie schreibt man dieses Schriftzeichen?"
    },
    {
      "hanzi": "王老师写的字很漂亮。",
      "pinyin": "Wáng lǎoshī xiě de zì hěn piàoliang.",
      "german": "Die von Lehrer Wang geschriebenen Zeichen sind sehr schön."
    }
  ],
  "hsk1-yizi": [
    {
      "hanzi": "请坐在椅子上休息。",
      "pinyin": "Qǐng zuò zài yǐzi shang xiūxi.",
      "german": "Bitte setz dich auf den Stuhl und ruh dich aus."
    },
    {
      "hanzi": "房间里有四把椅子。",
      "pinyin": "Fángjiān li yǒu sì bǎ yǐzi.",
      "german": "Im Zimmer stehen vier Stühle."
    }
  ],
  "hsk1-bukeqi": [
    {
      "hanzi": "“谢谢你的茶！”——“不客气！”",
      "pinyin": "“Xièxie nǐ de chá!” —— “Bú kèqi!”",
      "german": "„Danke für deinen Tee!“ — „Keine Ursache!“"
    },
    {
      "hanzi": "大家都是朋友，不用客气。",
      "pinyin": "Dàjiā dōu shì péngyou, bú yòng kèqi.",
      "german": "Wir sind alle Freunde, du brauchst keine Umstände zu machen."
    }
  ],
  "hsk1-qing": [
    {
      "hanzi": "请进，请坐，请喝茶！",
      "pinyin": "Qǐng jìn, qǐng zuò, qǐng hē chá!",
      "german": "Bitte herein, bitte nimm Platz, bitte trink Tee!"
    },
    {
      "hanzi": "我想请你去看电影。",
      "pinyin": "Wǒ xiǎng qǐng nǐ qù kàn diànyǐng.",
      "german": "Ich möchte dich ins Kino einladen."
    }
  ],
  "hsk1-duibuqi": [
    {
      "hanzi": "对不起，我今天来晚了。",
      "pinyin": "Duìbuqǐ, wǒ jīntiān lái wǎn le.",
      "german": "Entschuldigung, ich bin heute zu spät gekommen."
    },
    {
      "hanzi": "“对不起！”——“没关系。”",
      "pinyin": "“Duìbuqǐ!” —— “Méi guānxi.”",
      "german": "„Entschuldigung!“ — „Macht nichts.“"
    }
  ],
  "hsk1-meiguanxi": [
    {
      "hanzi": "没关系，这不算什么。",
      "pinyin": "Méi guānxi, zhè bú suàn shénme.",
      "german": "Macht nichts, das ist nicht der Rede wert."
    },
    {
      "hanzi": "别担心，真的没关系。",
      "pinyin": "Bié dānxīn, zhēnde méi guānxi.",
      "german": "Keine Sorge, das macht wirklich überhaupt nichts."
    }
  ],
  "hsk1-jintian": [
    {
      "hanzi": "今天天气非常好。",
      "pinyin": "Jīntiān tiānqì fēicháng hǎo.",
      "german": "Heute ist das Wetter ganz ausgezeichnet.",
      "audioPath": "/audio/stories/s05-03.mp3"
    },
    {
      "hanzi": "今天星期五，明天休息。",
      "pinyin": "Jīntiān xīngqīwǔ, míngtiān xiūxi.",
      "german": "Heute ist Freitag, morgen haben wir frei."
    }
  ],
  "hsk1-zuotian": [
    {
      "hanzi": "昨天下午我去商店买了水果。",
      "pinyin": "Zuótiān xiàwǔ wǒ qù shāngdiàn mǎi le shuǐguǒ.",
      "german": "Gestern Nachmittag bin ich in den Laden gegangen und habe Obst gekauft."
    },
    {
      "hanzi": "昨天北京下大雨了。",
      "pinyin": "Zuótiān Běijīng xià dàyǔ le.",
      "german": "Gestern hat es in Peking heftig geregnet."
    }
  ],
  "hsk1-shangwu": [
    {
      "hanzi": "上午八点我们开始上课。",
      "pinyin": "Shàngwǔ bā diǎn wǒmen kāishǐ shàng kè.",
      "german": "Vormittags um acht Uhr beginnen wir mit dem Unterricht."
    },
    {
      "hanzi": "今天上午我看了两小时书。",
      "pinyin": "Jīntiān shàngwǔ wǒ kàn le liǎng xiǎoshí shū.",
      "german": "Heute Vormittag habe ich zwei Stunden lang gelesen."
    }
  ],
  "hsk1-zhongwu": [
    {
      "hanzi": "中午我们一起去饭馆吃米饭。",
      "pinyin": "Zhōngwǔ wǒmen yìqǐ qù fànguǎn chī mǐfàn.",
      "german": "Mittags gehen wir zusammen ins Restaurant Reis essen."
    },
    {
      "hanzi": "中午十二点吃午饭。",
      "pinyin": "Zhōngwǔ shí'èr diǎn chī wǔfàn.",
      "german": "Um zwölf Uhr mittags essen wir zu Mittag."
    }
  ],
  "hsk1-xiawu": [
    {
      "hanzi": "下午三点我去火车站接朋友。",
      "pinyin": "Xiàwǔ sān diǎn wǒ qù huǒchēzhàn jiē péngyou.",
      "german": "Nachmittags um drei Uhr fahre ich zum Bahnhof, um einen Freund abzuholen."
    },
    {
      "hanzi": "今天下午没有汉语课。",
      "pinyin": "Jīntiān xiàwǔ méiyǒu Hànyǔ kè.",
      "german": "Heute Nachmittag gibt es keinen Chinesischunterricht."
    }
  ],
  "hsk1-nian": [
    {
      "hanzi": "他今年二十五岁。",
      "pinyin": "Tā jīnnián èrshíwǔ suì.",
      "german": "Er ist dieses Jahr 25 Jahre alt."
    },
    {
      "hanzi": "他在中国学了一年汉语。",
      "pinyin": "Tā zài Zhōngguó xué le yì nián Hànyǔ.",
      "german": "Er hat ein Jahr lang in China Chinesisch gelernt."
    }
  ],
  "hsk1-hao-number": [
    {
      "hanzi": "今天是八月十五号。",
      "pinyin": "Jīntiān shì bāyuè shíwǔ hào.",
      "german": "Heute ist der 15. August."
    },
    {
      "hanzi": "你的手机号是多少？",
      "pinyin": "Nǐ de shǒujī hào shì duōshao?",
      "german": "Wie lautet deine Handynummer?"
    }
  ],
  "hsk1-dian": [
    {
      "hanzi": "现在上午十点整。",
      "pinyin": "Xiànzài shàngwǔ shí diǎn zhěng.",
      "german": "Jetzt ist es genau zehn Uhr vormittags."
    },
    {
      "hanzi": "请给我来一点儿茶。",
      "pinyin": "Qǐng gěi wǒ lái yìdiǎnr chá.",
      "german": "Bitte gib mir ein wenig Tee."
    }
  ],
  "hsk1-fenzhong": [
    {
      "hanzi": "再等我五分钟，马上来！",
      "pinyin": "Zài děng wǒ wǔ fēnzhōng, mǎshàng lái!",
      "german": "Warte noch fünf Minuten auf mich, ich komme sofort!"
    },
    {
      "hanzi": "一小时有六十分钟。",
      "pinyin": "Yì xiǎoshí yǒu liùshí fēnzhōng.",
      "german": "Eine Stunde hat sechzig Minuten."
    }
  ],
  "hsk1-xianzai": [
    {
      "hanzi": "现在几点钟了？",
      "pinyin": "Xiànzài jǐ diǎn zhōng le?",
      "german": "Wie viel Uhr ist es jetzt?"
    },
    {
      "hanzi": "我现在在学校图书馆。",
      "pinyin": "Wǒ xiànzài zài xuéxiào túshūguǎn.",
      "german": "Ich befinde mich jetzt in der Schulbibliothek."
    }
  ],
  "hsk1-shihou": [
    {
      "hanzi": "你什么时候来北京？",
      "pinyin": "Nǐ shénme shíhou lái Běijīng?",
      "german": "Wann kommst du nach Peking?"
    },
    {
      "hanzi": "吃饭的时候不要看手机。",
      "pinyin": "Chī fàn de shíhou bú yào kàn shǒujī.",
      "german": "Beim Essen soll man nicht aufs Smartphone schauen."
    }
  ],
  "hsk1-beijing": [
    {
      "hanzi": "北京是中国的首都。",
      "pinyin": "Běijīng shì Zhōngguó de shǒudū.",
      "german": "Peking ist die Hauptstadt Chinas."
    },
    {
      "hanzi": "他住在北京朝阳区。",
      "pinyin": "Tā zhù zài Běijīng Cháoyáng qū.",
      "german": "Er wohnt im Chaoyang-Bezirk in Peking."
    }
  ],
  "hsk1-shang": [
    {
      "hanzi": "书在桌子上面。",
      "pinyin": "Shū zài zhuōzi shàngmian.",
      "german": "Das Buch liegt oben auf dem Tisch."
    },
    {
      "hanzi": "我们上车吧。",
      "pinyin": "Wǒmen shàng chē ba.",
      "german": "Lass uns einsteigen."
    }
  ],
  "hsk1-xia": [
    {
      "hanzi": "小猫在桌子下面睡觉。",
      "pinyin": "Xiǎomāo zài zhuōzi xiàmian shuìjiào.",
      "german": "Die kleine Katze schläft unter dem Tisch."
    },
    {
      "hanzi": "外面正在下雨。",
      "pinyin": "Wàimiàn zhèngzài xià yǔ.",
      "german": "Draußen regnet es gerade."
    }
  ],
  "hsk1-qianmian": [
    {
      "hanzi": "学校前面有一家大超市。",
      "pinyin": "Xuéxiào qiánmian yǒu yì jiā dà chāoshì.",
      "german": "Vor der Schule befindet sich ein großer Supermarkt."
    },
    {
      "hanzi": "王先生坐在我前面。",
      "pinyin": "Wáng xiānsheng zuò zài wǒ qiánmian.",
      "german": "Herr Wang sitzt vor mir."
    }
  ],
  "hsk1-houmian": [
    {
      "hanzi": "饭馆后面是火车站。",
      "pinyin": "Fànguǎn hòumian shì huǒchēzhàn.",
      "german": "Hinter dem Restaurant liegt der Bahnhof."
    },
    {
      "hanzi": "小狗跟在后面跑。",
      "pinyin": "Xiǎogǒu gēn zài hòumian pǎo.",
      "german": "Das Hündchen rennt hinterher."
    }
  ],
  "hsk1-li": [
    {
      "hanzi": "书包里有两本书和一个水杯。",
      "pinyin": "Shūbāo li yǒu liǎng běn shū hé yí ge shuǐbēi.",
      "german": "In der Schultasche sind zwei Bücher und ein Wasserbecher."
    },
    {
      "hanzi": "我们在学校里散步。",
      "pinyin": "Wǒmen zài xuéxiào li sànbù.",
      "german": "Wir spazieren auf dem Schulgelände."
    }
  ],
  "hsk1-fanguan": [
    {
      "hanzi": "这家中国饭馆的菜很好吃。",
      "pinyin": "Zhè jiā Zhōngguó fànguǎn de cài hěn hǎochī.",
      "german": "Das Essen in dieser chinesischen Gaststätte schmeckt vorzüglich.",
      "audioPath": "/audio/stories/s02-01.mp3"
    },
    {
      "hanzi": "今天晚上我们去饭馆吃饭吧。",
      "pinyin": "Jīntiān wǎnshang wǒmen qù fànguǎn chī fàn ba.",
      "german": "Lass uns heute Abend ins Restaurant essen gehen."
    }
  ],
  "hsk1-shangdian": [
    {
      "hanzi": "这家商店卖新鲜的水果。",
      "pinyin": "Zhè jiā shāngdiàn mài xīnxiān de shuǐguǒ.",
      "german": "Dieses Geschäft verkauft frisches Obst."
    },
    {
      "hanzi": "我去商店买一件衣服。",
      "pinyin": "Wǒ qù shāngdiàn mǎi yí jiàn yīfu.",
      "german": "Ich gehe in den Laden, um ein Kleidungsstück zu kaufen."
    }
  ],
  "hsk1-yiyuan": [
    {
      "hanzi": "他生病了，要去医院看医生。",
      "pinyin": "Tā shēngbìng le, yào qù yīyuàn kàn yīshēng.",
      "german": "Er ist krank geworden und muss ins Krankenhaus zum Arzt."
    },
    {
      "hanzi": "医院就在火车站前面。",
      "pinyin": "Yīyuàn jiù zài huǒchēzhàn qiánmian.",
      "german": "Das Krankenhaus liegt direkt vor dem Bahnhof."
    }
  ],
  "hsk1-huochezhan": [
    {
      "hanzi": "我坐出租车去火车站。",
      "pinyin": "Wǒ zuò chūzūchē qù huǒchēzhàn.",
      "german": "Ich fahre mit dem Taxi zum Bahnhof."
    },
    {
      "hanzi": "北京火车站非常大。",
      "pinyin": "Běijīng huǒchēzhàn fēicháng dà.",
      "german": "Der Pekinger Bahnhof ist enorm groß."
    }
  ],
  "hsk1-ting": [
    {
      "hanzi": "我喜欢听中国音乐。",
      "pinyin": "Wǒ xǐhuan tīng Zhōngguó yīnyuè.",
      "german": "Ich höre gerne chinesische Musik."
    },
    {
      "hanzi": "请大家认真听老师说。",
      "pinyin": "Qǐng dàjiā rènzhēn tīng lǎoshī shuō.",
      "german": "Bitte hört alle aufmerksam dem Lehrer zu."
    }
  ],
  "hsk1-shuohua": [
    {
      "hanzi": "他在跟朋友打电话说话。",
      "pinyin": "Tā zài gēn péngyou dǎ diànhuà shuōhuà.",
      "german": "Er telefoniert und unterhält sich mit einem Freund."
    },
    {
      "hanzi": "看电影时请不要说话。",
      "pinyin": "Kàn diànyǐng shí qǐng bú yào shuōhuà.",
      "german": "Beim Filmeschauen bitte nicht sprechen."
    }
  ],
  "hsk1-du": [
    {
      "hanzi": "请大声读这个句子。",
      "pinyin": "Qǐng dà shēng dú zhè ge jùzi.",
      "german": "Bitte lies diesen Satz mit lauter Stimme vor."
    },
    {
      "hanzi": "他在认真读汉语课文。",
      "pinyin": "Tā zài rènzhēn dú Hànyǔ kèwén.",
      "german": "Er liest gewissenhaft den chinesischen Lektionstext."
    }
  ],
  "hsk1-xie-write": [
    {
      "hanzi": "你会写汉字吗？",
      "pinyin": "Nǐ huì xiě hànzì ma?",
      "german": "Kannst du chinesische Schriftzeichen schreiben?"
    },
    {
      "hanzi": "他在桌子上写名字。",
      "pinyin": "Tā zài zhuōzi shang xiě míngzi.",
      "german": "Er schreibt seinen Namen auf dem Tisch."
    }
  ],
  "hsk1-kanjian": [
    {
      "hanzi": "我看见前面的大商店了。",
      "pinyin": "Wǒ kànjiàn qiánmian de dà shāngdiàn le.",
      "german": "Ich habe das große Geschäft da vorne erblickt."
    },
    {
      "hanzi": "你看见我的水杯了吗？",
      "pinyin": "Nǐ kànjiàn wǒ de shuǐbēi le ma?",
      "german": "Hast du meinen Wasserbecher gesehen?"
    }
  ],
  "hsk1-jiao": [
    {
      "hanzi": "我叫李明，你叫什么名字？",
      "pinyin": "Wǒ jiào Lǐ Míng, nǐ jiào shénme míngzi?",
      "german": "Ich heiße Li Ming, wie heißt du?"
    },
    {
      "hanzi": "妈妈在叫儿子回家吃饭。",
      "pinyin": "Māma zài jiào érzi huí jiā chī fàn.",
      "german": "Mama ruft ihren Sohn nach Hause zum Essen."
    }
  ],
  "hsk1-mai": [
    {
      "hanzi": "我想买几个新鲜的苹果。",
      "pinyin": "Wǒ xiǎng mǎi jǐ ge xīnxiān de píngguǒ.",
      "german": "Ich möchte ein paar frische Äpfel kaufen."
    },
    {
      "hanzi": "这件衣服在哪里买的？",
      "pinyin": "Zhè jiàn yīfu zài nǎlǐ mǎi de?",
      "german": "Wo hast du dieses Kleidungsstück gekauft?"
    }
  ],
  "hsk1-kai": [
    {
      "hanzi": "他会开汽车和出租车。",
      "pinyin": "Tā huì kāi qìchē hé chūzūchē.",
      "german": "Er kann Pkw und Taxi fahren."
    },
    {
      "hanzi": "请开门，我回来了。",
      "pinyin": "Qǐng kāi mén, wǒ huí lai le.",
      "german": "Bitte öffne die Tür, ich bin zurückgekehrt."
    }
  ],
  "hsk1-zuo": [
    {
      "hanzi": "请坐在椅子上喝杯茶。",
      "pinyin": "Qǐng zuò zài yǐzi shang hē bēi chá.",
      "german": "Bitte nimm auf dem Stuhl Platz und trink eine Tasse Tee."
    },
    {
      "hanzi": "我们坐飞机去中国。",
      "pinyin": "Wǒmen zuò fēijī qù Zhōngguó.",
      "german": "Wir fliegen mit dem Flugzeug nach China."
    }
  ],
  "hsk1-zhu": [
    {
      "hanzi": "我在北京住了五年。",
      "pinyin": "Wǒ zài Běijīng zhù le wǔ nián.",
      "german": "Ich habe fünf Jahre in Peking gewohnt."
    },
    {
      "hanzi": "你住在哪个房间？",
      "pinyin": "Nǐ zhù zài nǎ ge fángjiān?",
      "german": "In welchem Zimmer wohnst du?"
    }
  ],
  "hsk1-xuexi": [
    {
      "hanzi": "我每天在学校认真学习汉语。",
      "pinyin": "Wǒ měitiān zài xuéxiào rènzhēn xuéxí Hànyǔ.",
      "german": "Ich lerne jeden Tag gewissenhaft Chinesisch in der Schule."
    },
    {
      "hanzi": "学习汉语很有意思。",
      "pinyin": "Xuéxí Hànyǔ hěn yǒu yìsi.",
      "german": "Chinesisch zu lernen ist sehr interessant."
    }
  ],
  "hsk1-gongzuo": [
    {
      "hanzi": "我爸爸在医院工作。",
      "pinyin": "Wǒ bàba zài yīyuàn gōngzuò.",
      "german": "Mein Vater arbeitet im Krankenhaus."
    },
    {
      "hanzi": "他的工作很忙。",
      "pinyin": "Tā de gōngzuò hěn máng.",
      "german": "Seine Arbeit ist sehr geschäftig."
    }
  ],
  "hsk1-xiayu": [
    {
      "hanzi": "外面下雨了，带上雨伞吧。",
      "pinyin": "Wàimiàn xià yǔ le, dài shang yǔsǎn ba.",
      "german": "Draußen regnet es, nimm einen Regenschirm mit."
    },
    {
      "hanzi": "明天可能不会下雨。",
      "pinyin": "Míngtiān kěnéng bú huì xià yǔ.",
      "german": "Morgen wird es vermutlich nicht regnen."
    }
  ],
  "hsk1-xiang": [
    {
      "hanzi": "我想喝一杯热茶。",
      "pinyin": "Wǒ xiǎng hē yì bēi rèchá.",
      "german": "Ich möchte eine Tasse heißen Tee trinken."
    },
    {
      "hanzi": "你在想什么呢？",
      "pinyin": "Nǐ zài xiǎng shénme ne?",
      "german": "Woran denkst du gerade?"
    }
  ],
  "hsk1-renshi": [
    {
      "hanzi": "很高兴认识你！",
      "pinyin": "Hěn gāoxìng rènshi nǐ!",
      "german": "Sehr erfreut, dich kennenzulernen!"
    },
    {
      "hanzi": "你认识那位医生吗？",
      "pinyin": "Nǐ rènshi nà wèi yīshēng ma?",
      "german": "Kennst du jenen Arzt dort?"
    }
  ],
  "hsk1-neng": [
    {
      "hanzi": "明天你能来我家吃饭吗？",
      "pinyin": "Míngtiān nǐ néng lái wǒ jiā chī fàn ma?",
      "german": "Kannst du morgen zu mir nach Hause zum Essen kommen?"
    },
    {
      "hanzi": "这里不能大声说话。",
      "pinyin": "Zhèlǐ bù néng dà shēng shuōhuà.",
      "german": "Hier darf man nicht laut sprechen."
    }
  ],
  "hsk1-lai": [
    {
      "hanzi": "欢迎你来中国北京！",
      "pinyin": "Huānyíng nǐ lái Zhōngguó Běijīng!",
      "german": "Willkommen in Peking, China!"
    },
    {
      "hanzi": "老师来了，大家请坐。",
      "pinyin": "Lǎoshī lái le, dàjiā qǐng zuò.",
      "german": "Der Lehrer ist gekommen, bitte setzt euch alle."
    }
  ],
  "hsk1-qu": [
    {
      "hanzi": "我们明天去北京看电影。",
      "pinyin": "Wǒmen míngtiān qù Běijīng kàn diànyǐng.",
      "german": "Wir fahren morgen nach Peking ins Kino."
    },
    {
      "hanzi": "你想去哪儿吃饭？",
      "pinyin": "Nǐ xiǎng qù nǎr chī fàn?",
      "german": "Wohin möchtest du essen gehen?"
    }
  ],
  "hsk1-hui-return": [
    {
      "hanzi": "我下午五点回家做晚饭。",
      "pinyin": "Wǒ xiàwǔ wǔ diǎn huí jiā zuò wǎnfàn.",
      "german": "Ich kehre um fünf Uhr nachmittags nach Hause zurück, um Abendessen zu kochen."
    },
    {
      "hanzi": "你什么时候回学校？",
      "pinyin": "Nǐ shénme shíhou huí xuéxiào?",
      "german": "Wann kehrst du zur Schule zurück?"
    }
  ],
  "hsk1-zuo-do": [
    {
      "hanzi": "你在做什么中国菜？",
      "pinyin": "Nǐ zài zuò shénme Zhōngguó cài?",
      "german": "Was für ein chinesisches Gericht kochst du da?"
    },
    {
      "hanzi": "做朋友比做敌人好。",
      "pinyin": "Zuò péngyou bǐ zuò dírén hǎo.",
      "german": "Freunde zu sein ist besser als Feinde zu sein."
    }
  ],
  "hsk1-hao": [
    {
      "hanzi": "今天天气很好，阳光灿烂。",
      "pinyin": "Jīntiān tiānqì hěn hǎo, yángguāng cànlàn.",
      "german": "Heute ist das Wetter sehr gut, der Sonnenschein ist herrlich."
    },
    {
      "hanzi": "好茶需要慢慢喝。",
      "pinyin": "Hǎo chá xūyào mànmàn hē.",
      "german": "Guten Tee muss man langsam trinken."
    }
  ],
  "hsk1-duo": [
    {
      "hanzi": "今天商店里有很多人。",
      "pinyin": "Jīntiān shāngdiàn li yǒu hěn duō rén.",
      "german": "Heute sind sehr viele Menschen im Geschäft."
    },
    {
      "hanzi": "多听多说对学汉语好。",
      "pinyin": "Duō tīng duō shuō duì xué Hànyǔ hǎo.",
      "german": "Viel zu hören und viel zu sprechen ist gut beim Chinesischlernen."
    }
  ],
  "hsk1-shao": [
    {
      "hanzi": "他的汉语词汇还很少。",
      "pinyin": "Tā de Hànyǔ cíhuì hái hěn shǎo.",
      "german": "Sein chinesischer Wortschatz ist noch recht klein."
    },
    {
      "hanzi": "少吃多餐对身体好。",
      "pinyin": "Shǎo chī duō cān duì shēntǐ hǎo.",
      "german": "Wenig, aber dafür häufiger zu essen, tut dem Körper gut."
    }
  ],
  "hsk1-leng": [
    {
      "hanzi": "今天北京天气非常冷。",
      "pinyin": "Jīntiān Běijīng tiānqì fēicháng lěng.",
      "german": "Heute ist das Wetter in Peking ausgesprochen kalt."
    },
    {
      "hanzi": "我不喜欢喝冷水。",
      "pinyin": "Wǒ bù xǐhuan hē lěngshuǐ.",
      "german": "Ich trinke nicht gerne kaltes Wasser."
    }
  ],
  "hsk1-re": [
    {
      "hanzi": "夏天天气很热，请喝冷水。",
      "pinyin": "Xiàtiān tiānqì hěn rè, qǐng hē lěngshuǐ.",
      "german": "Im Sommer ist das Wetter sehr heiß, bitte trink kaltes Wasser."
    },
    {
      "hanzi": "这杯热茶很香。",
      "pinyin": "Zhè bēi rèchá hěn xiāng.",
      "german": "Diese Tasse heißer Tee duftet herrlich."
    }
  ],
  "hsk1-gaoxing": [
    {
      "hanzi": "认识你，我真的很高兴！",
      "pinyin": "Rènshi nǐ, wǒ zhēnde hěn gāoxìng!",
      "german": "Dich kennenzulernen freut mich wirklich sehr!"
    },
    {
      "hanzi": "看到好朋友，他非常高兴。",
      "pinyin": "Kàndào hǎo péngyou, tā fēicháng gāoxìng.",
      "german": "Als er seinen guten Freund sah, freute er sich riesig."
    }
  ],
  "hsk1-piaoliang": [
    {
      "hanzi": "这件衣服真漂亮！",
      "pinyin": "Zhè jiàn yīfu zhēn piàoliang!",
      "german": "Dieses Kleidungsstück ist wirklich bildschön!"
    },
    {
      "hanzi": "北京的秋天很漂亮。",
      "pinyin": "Běijīng de qiūtiān hěn piàoliang.",
      "german": "Der Herbst in Peking ist wunderschön."
    }
  ],
  "hsk1-shuo": [
    {
      "hanzi": "请您慢一点儿说。",
      "pinyin": "Qǐng nín màn yìdiǎnr shuō.",
      "german": "Bitte sprechen Sie ein wenig langsamer."
    },
    {
      "hanzi": "你会说汉语吗？",
      "pinyin": "Nǐ huì shuō Hànyǔ ma?",
      "german": "Kannst du Chinesisch sprechen?"
    }
  ],
  "hsk1-meiyou": [
    {
      "hanzi": "我没有去过中国北京。",
      "pinyin": "Wǒ méiyǒu qù guo Zhōngguó Běijīng.",
      "german": "Ich bin noch nicht in Peking in China gewesen."
    },
    {
      "hanzi": "桌子上没有水杯。",
      "pinyin": "Zhuōzi shang méiyǒu shuǐbēi.",
      "german": "Auf dem Tisch steht kein Wasserbecher."
    }
  ],
  "hsk1-fandian": [
    {
      "hanzi": "我们去那家大饭店吃北京烤鸭。",
      "pinyin": "Wǒmen qù nà jiā dà fàndiàn chī Běijīng kǎoyā.",
      "german": "Wir gehen in jenes große Hotel/Restaurant, um Peking-Ente zu essen."
    },
    {
      "hanzi": "饭店前面停着出租车。",
      "pinyin": "Fàndiàn qiánmian tíng zhe chūzūchē.",
      "german": "Vor dem Hotel halten Taxis."
    }
  ],
  "hsk1-shuijiao": [
    {
      "hanzi": "现在很晚了，快去睡觉吧。",
      "pinyin": "Xiànzài hěn wǎn le, kuài qù shuìjiào ba.",
      "german": "Jetzt ist es sehr spät, geh rasch schlafen."
    },
    {
      "hanzi": "小猫在阳光下睡觉。",
      "pinyin": "Xiǎomāo zài yángguāng xià shuìjiào.",
      "german": "Die kleine Katze schläft im Sonnenschein."
    }
  ],
  "hsk1-dadianhua": [
    {
      "hanzi": "他在给生病的妈妈打电话。",
      "pinyin": "Tā zài gěi shēngbìng de māma dǎ diànhuà.",
      "german": "Er ruft gerade seine kranke Mutter an."
    },
    {
      "hanzi": "请不要在电影院打电话。",
      "pinyin": "Qǐng bú yào zài diànyǐngyuàn dǎ diànhuà.",
      "german": "Bitte telefoniere nicht im Kinosaal."
    }
  ],
  "hsk1-ba-particle": [
    {
      "hanzi": "我们一起去吃中国菜吧！",
      "pinyin": "Wǒmen yìqǐ qù chī Zhōngguó cài ba!",
      "german": "Lass uns zusammen chinesisch essen gehen!",
      "audioPath": "/audio/stories/s02-01.mp3"
    },
    {
      "hanzi": "快走吧，时间不早了。",
      "pinyin": "Kuài zǒu ba, shíjiān bù zǎo le.",
      "german": "Lass uns zügig gehen, es ist nicht mehr früh."
    }
  ],
  "hsk1-shijian": [
    {
      "hanzi": "你今天下午有时间吗？",
      "pinyin": "Nǐ jīntiān xiàwǔ yǒu shíjiān ma?",
      "german": "Hast du heute Nachmittag Zeit?"
    },
    {
      "hanzi": "学习汉语需要时间。",
      "pinyin": "Xuéxí Hànyǔ xūyào shíjiān.",
      "german": "Chinesisch lernen braucht Zeit."
    }
  ]
};

// Gesamt-Strichanzahl berechnen
export function getEstimatedStrokes(item: VocabItem): number {
  if (item.strokes) return item.strokes;
  let total = 0;
  for (const charDec of item.characters) {
    for (const part of charDec.parts) {
      const rad = RADICALS_BY_ID.get(part.id);
      total += rad ? rad.strokes : 3;
    }
  }
  return Math.max(1, total);
}

// Mnemonic mit vollständiger Abdeckung aller Zeichen
export function getMnemonic(item: VocabItem): string {
  if (MNEMONIC_MAP[item.id]) return MNEMONIC_MAP[item.id];
  if (item.characters.length === 1) {
    const parts = item.characters[0].parts.map((p) => {
      const rad = RADICALS_BY_ID.get(p.id);
      return `${p.hanzi} (${rad?.meaning || p.id})`;
    });
    return `Das Zeichen „${item.hanzi}“ setzt sich aus den Radikalen ${parts.join(' und ')} zusammen.`;
  }
  const charDescriptions = item.characters.map((c) => {
    const parts = c.parts.map((p) => {
      const rad = RADICALS_BY_ID.get(p.id);
      return `${p.hanzi} (${rad?.meaning || p.id})`;
    });
    return `„${c.char}“ [${parts.join(' + ')}]`;
  });
  return `Zusammengesetztes Wort aus: ${charDescriptions.join(' und ')}.`;
}

// Holen der angereicherten Daten
export function getEnrichedVocab(item: VocabItem) {
  const partOfSpeech = PART_OF_SPEECH_MAP[item.id] || (item.meaning.includes('sein') || item.meaning.includes('haben') ? 'verb' : 'nomen');
  const mnemonic = getMnemonic(item);
  const collocations = COLLOCATIONS_MAP[item.id] || [];
  const exampleSentences = EXAMPLE_SENTENCES_MAP[item.id] || [];
  const strokes = getEstimatedStrokes(item);
  const chaoPitch = getChaoPitchInfo(item);

  return {
    partOfSpeech,
    mnemonic,
    collocations,
    exampleSentences,
    strokes,
    chaoPitch,
  };
}
