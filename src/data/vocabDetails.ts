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
    description: 'Beginnt auf höchster Tonlage (5) und bleibt absolut stabil und gleichmäßig hoch.',
    levels: [5, 5, 5],
  },
  2: {
    toneName: '2. Ton',
    contourCode: '35',
    label: 'Steigend (Rising)',
    description: 'Startet in mittlerer Stimmlage (3) und steigt dynamisch und fragend zur Höchstlage (5) auf.',
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
    description: 'Setzt energisch auf höchster Tonlage (5) an und fällt steil und bestimmt auf Tiefstlage (1) ab.',
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
      label: `Kombination: ${item.syllables.map((s) => s.marked).join(' ')}`,
      description: `Erste Silbe (${CHAO_PITCH_DESCRIPTIONS[item.syllables[0].tone]?.label}), gefolgt von Silbe 2 (${CHAO_PITCH_DESCRIPTIONS[item.syllables[1].tone]?.label}).`,
      levels: [
        ...(CHAO_PITCH_DESCRIPTIONS[item.syllables[0].tone]?.levels ?? [3]),
        ...(CHAO_PITCH_DESCRIPTIONS[item.syllables[1].tone]?.levels ?? [3]),
      ],
    };
  }

  return base;
}

// Wortart-Zuordnung für alle 163 HSK-1 Vokabeln
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

export const PART_OF_SPEECH_LABELS: Record<PartOfSpeech, { label: string; short: string; cn: string }> = {
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

// Kulturelle Gedächtnisstützen & Mnemonic Hooks
export const MNEMONIC_MAP: Record<string, string> = {
  'hsk1-hao': 'Eine Mutter (女) mit ihrem neugeborenen Kind (子) symbolisiert vollkommenes Glück, Wohlstand und Güte (好).',
  'hsk1-shui': 'Fließende Wasserströme im Flussbett mit aufspritzenden Tropfen an den Ufern symbolisieren die Urkraft des Wassers (水).',
  'hsk1-mao': 'Ein kleines Raubtier (犭) schleicht durch das Getreidefeld (苗) — das anmutige Bild einer Katze (猫).',
  'hsk1-xuexi': 'Ein Kind (子) unter einem Dach mit zwei Wissenshänden darüber symbolisiert das eifrige Lernen (学).',
  'hsk1-zhongguo': 'Ein Pfeil trifft genau die Mitte einer Zielscheibe (中) — das Reich der Mitte innerhalb seiner Grenzen (国).',
  'hsk1-ai': 'Eine Hand, die ein Herz (心) sanft schützt und hält — das tiefste Zeichen für bedingungslose Liebe (爱).',
  'hsk1-chi': 'Ein offener Mund (口) führt Nahrung zum Schlucken ein — das universelle Zeichen für Essen (吃).',
  'hsk1-cha': 'Pflanzen (艹) auf einem Bergdach (人), gepflückt von Händen aus Holz (木) — die uralte Teekultur Chinas (茶).',
  'hsk1-baba': 'Die schützenden Axtschwingen des Patriarchen (父) wachen über die Familie — Vater (爸).',
  'hsk1-mama': 'Die Frau (女), die für ihr Kind stark wie ein Pferd (马) arbeitet und sorgt — Mutter (妈).',
  'hsk1-jia-home': 'Ein schützendes Dach (宀), unter dem ein wertvolles Haustier bzw. Schwein (豕) lebt — das gemütliche Zuhause (家).',
  'hsk1-kan': 'Eine Hand (手) über die Augen gehalten, um in die weite Ferne zu blicken (看).',
  'hsk1-da': 'Ein Mensch (人) mit weit ausgestreckten Armen zeigt an: „So riesig groß ist das!“ (大).',
  'hsk1-xiao': 'Drei kleine Tropfen oder Sandkörner, die voneinander getrennt werden — das Zeichen für winzig klein (小).',
  'hsk1-shijian': 'Der Stand der Sonne (日) an den Toren (门) des Tages misst den Lauf der Zeit (时间).',
};

// Kollokationen (Häufige Wortverbindungen)
export const COLLOCATIONS_MAP: Record<string, Collocation[]> = {
  'hsk1-hao': [
    { hanzi: '好看', pinyin: 'hǎokàn', german: 'schön / hübsch anzusehen' },
    { hanzi: '好吃', pinyin: 'hǎochī', german: 'lecker / schmackhaft' },
    { hanzi: '好听', pinyin: 'hǎotīng', german: 'schön klingend' },
    { hanzi: '好玩', pinyin: 'hǎowán', german: 'unterhaltsam / lustig' },
  ],
  'hsk1-shui': [
    { hanzi: '喝水', pinyin: 'hē shuǐ', german: 'Wasser trinken' },
    { hanzi: '水果', pinyin: 'shuǐguǒ', german: 'Früchte / Obst' },
    { hanzi: '开水', pinyin: 'kāishuǐ', german: 'abgekochtes Wasser' },
  ],
  'hsk1-da': [
    { hanzi: '大人', pinyin: 'dàrén', german: 'Erwachsener' },
    { hanzi: '大学', pinyin: 'dàxué', german: 'Universität' },
    { hanzi: '大家', pinyin: 'dàjiā', german: 'alle zusammen' },
  ],
  'hsk1-xiao': [
    { hanzi: '小孩', pinyin: 'xiǎohái', german: 'Kind / Kleinkind' },
    { hanzi: '小学', pinyin: 'xiǎoxué', german: 'Grundschule' },
    { hanzi: '小时', pinyin: 'xiǎoshí', german: 'Stunde' },
  ],
  'hsk1-kan': [
    { hanzi: '看书', pinyin: 'kàn shū', german: 'ein Buch lesen' },
    { hanzi: '看电影', pinyin: 'kàn diànyǐng', german: 'einen Film schauen' },
    { hanzi: '看见', pinyin: 'kànjiàn', german: 'sehen / erblicken' },
  ],
  'hsk1-chi': [
    { hanzi: '吃饭', pinyin: 'chī fàn', german: 'eine Mahlzeit essen' },
    { hanzi: '吃药', pinyin: 'chī yào', german: 'Medizin einnehmen' },
    { hanzi: '吃苹果', pinyin: 'chī píngguǒ', german: 'Äpfel essen' },
  ],
};

// Standard Beispielsätze
export const EXAMPLE_SENTENCES_MAP: Record<string, ExampleSentence[]> = {
  'hsk1-hao': [
    { hanzi: '你好！', pinyin: 'Nǐ hǎo!', german: 'Hallo! / Guten Tag!', audioPath: '/audio/stories/s01-01.mp3' },
    { hanzi: '今天天气很好。', pinyin: 'Jīntiān tiānqì hěn hǎo.', german: 'Heute ist das Wetter sehr gut.', audioPath: '/audio/stories/s05-03.mp3' },
    { hanzi: '中国菜很好吃。', pinyin: 'Zhōngguó cài hěn hǎochī.', german: 'Chinesisches Essen ist sehr lecker.', audioPath: '/audio/stories/s02-03.mp3' },
  ],
  'hsk1-shui': [
    { hanzi: '你想喝水吗？', pinyin: 'Nǐ xiǎng hē shuǐ ma?', german: 'Möchtest du Wasser trinken?' },
    { hanzi: '桌子上有水。', pinyin: 'Zhuōzi shang yǒu shuǐ.', german: 'Auf dem Tisch steht Wasser.' },
  ],
  'hsk1-chi': [
    { hanzi: '我们去吃饭吧。', pinyin: 'Wǒmen qù chī fàn ba.', german: 'Lass uns essen gehen.', audioPath: '/audio/stories/s02-01.mp3' },
    { hanzi: '你想吃什么？', pinyin: 'Nǐ xiǎng chī shénme?', german: 'Was möchtest du essen?' },
  ],
  'hsk1-kan': [
    { hanzi: '我在学校看书。', pinyin: 'Wǒ zài xuéxiào kàn shū.', german: 'Ich lese in der Schule ein Buch.', audioPath: '/audio/stories/s04-04.mp3' },
    { hanzi: '明天我们去看电影。', pinyin: 'Míngtiān wǒmen qù kàn diànyǐng.', german: 'Morgen schauen wir einen Film.', audioPath: '/audio/stories/s07-03.mp3' },
  ],
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

// Holen der angereicherten Daten mit intelligenten Fallbacks
export function getEnrichedVocab(item: VocabItem) {
  const partOfSpeech = PART_OF_SPEECH_MAP[item.id] || (item.meaning.includes('sein') || item.meaning.includes('haben') ? 'verb' : 'nomen');
  const mnemonic = MNEMONIC_MAP[item.id] || `Dieses Zeichen setzt sich harmonisch aus seinen Grundradikalen zusammen: ${item.characters[0]?.parts.map((p) => `${p.hanzi} (${RADICALS_BY_ID.get(p.id)?.meaning ?? ''})`).join(' + ')}.`;
  const collocations = COLLOCATIONS_MAP[item.id] || [
    { hanzi: `${item.hanzi}好`, pinyin: `${item.pinyin} hǎo`, german: `gut / schön mit ${item.meaning.split('/')[0].trim()}` },
  ];
  const exampleSentences = EXAMPLE_SENTENCES_MAP[item.id] || [
    { hanzi: `这是${item.hanzi}。`, pinyin: `Zhè shì ${item.pinyin}.`, german: `Das ist ${item.meaning.split('/')[0].trim()}.` },
  ];
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
