import type { PartOfSpeech, Collocation, ExampleSentence, VocabItem } from '../types/vocab';
import { RADICALS_BY_ID } from './index';

export const PART_OF_SPEECH_MAP: Record<string, PartOfSpeech> = {
  // Verben
  'hsk1-ai': 'verb',
  'hsk1-chi': 'verb',
  'hsk1-dadianhua': 'verb',
  'hsk1-du': 'verb',
  'hsk1-gongzuo': 'verb',
  'hsk1-he': 'verb',
  'hsk1-hui': 'verb',
  'hsk1-hui-return': 'verb',
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
  'hsk1-shi-be': 'verb',
  'hsk1-shuijiao': 'verb',
  'hsk1-shuo': 'verb',
  'hsk1-shuohua': 'verb',
  'hsk1-ting': 'verb',
  'hsk1-xiang': 'verb',
  'hsk1-xiayu': 'verb',
  'hsk1-xie-write': 'verb',
  'hsk1-xiexie': 'verb',
  'hsk1-xihuan': 'verb',
  'hsk1-xuexi': 'verb',
  'hsk1-you': 'verb',
  'hsk1-zai': 'verb',
  'hsk1-zhu': 'verb',
  'hsk1-zuo': 'verb',
  'hsk1-zuo-do': 'verb',
  // Nomen
  'hsk1-baba': 'nomen',
  'hsk1-beizi': 'nomen',
  'hsk1-cai': 'nomen',
  'hsk1-cha': 'nomen',
  'hsk1-chuzuche': 'nomen',
  'hsk1-dian': 'nomen',
  'hsk1-diannao': 'nomen',
  'hsk1-dianshi': 'nomen',
  'hsk1-dianying': 'nomen',
  'hsk1-dongxi': 'nomen',
  'hsk1-erzi': 'nomen',
  'hsk1-fandian': 'nomen',
  'hsk1-fanguan': 'nomen',
  'hsk1-feiji': 'nomen',
  'hsk1-fenzhong': 'nomen',
  'hsk1-gou': 'nomen',
  'hsk1-hanyu': 'nomen',
  'hsk1-hao-number': 'nomen',
  'hsk1-houmian': 'nomen',
  'hsk1-huochezhan': 'nomen',
  'hsk1-jia': 'nomen',
  'hsk1-jintian': 'nomen',
  'hsk1-laoshi': 'nomen',
  'hsk1-li': 'nomen',
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
  'hsk1-qianmian': 'nomen',
  'hsk1-ren': 'nomen',
  'hsk1-ri': 'nomen',
  'hsk1-shang': 'nomen',
  'hsk1-shangdian': 'nomen',
  'hsk1-shangwu': 'nomen',
  'hsk1-shihou': 'nomen',
  'hsk1-shijian': 'nomen',
  'hsk1-shu': 'nomen',
  'hsk1-shui': 'nomen',
  'hsk1-shuiguo': 'nomen',
  'hsk1-sui': 'nomen',
  'hsk1-tianqi': 'nomen',
  'hsk1-tongxue': 'nomen',
  'hsk1-xia': 'nomen',
  'hsk1-xiansheng': 'nomen',
  'hsk1-xianzai': 'nomen',
  'hsk1-xiaojie': 'nomen',
  'hsk1-xiawu': 'nomen',
  'hsk1-xingqi': 'nomen',
  'hsk1-xuesheng': 'nomen',
  'hsk1-xuexiao': 'nomen',
  'hsk1-yifu': 'nomen',
  'hsk1-yisheng': 'nomen',
  'hsk1-yiyuan': 'nomen',
  'hsk1-yizi': 'nomen',
  'hsk1-yue': 'nomen',
  'hsk1-zhongwu': 'nomen',
  'hsk1-zhuozi': 'nomen',
  'hsk1-zi': 'nomen',
  'hsk1-zuotian': 'nomen',
  // Adjektive
  'hsk1-da': 'adjektiv',
  'hsk1-duo': 'adjektiv',
  'hsk1-gaoxing': 'adjektiv',
  'hsk1-hao': 'adjektiv',
  'hsk1-leng': 'adjektiv',
  'hsk1-piaoliang': 'adjektiv',
  'hsk1-re': 'adjektiv',
  'hsk1-shao': 'adjektiv',
  'hsk1-xiao': 'adjektiv',
  // Pronomen
  'hsk1-duoshao': 'pronomen',
  'hsk1-ji': 'pronomen',
  'hsk1-na': 'pronomen',
  'hsk1-na-which': 'pronomen',
  'hsk1-naer': 'pronomen',
  'hsk1-naer-which': 'pronomen',
  'hsk1-ni': 'pronomen',
  'hsk1-nin': 'pronomen',
  'hsk1-shei': 'pronomen',
  'hsk1-shenme': 'pronomen',
  'hsk1-ta': 'pronomen',
  'hsk1-ta-nv': 'pronomen',
  'hsk1-tamen': 'pronomen',
  'hsk1-wo': 'pronomen',
  'hsk1-women': 'pronomen',
  'hsk1-xie': 'pronomen',
  'hsk1-zenme': 'pronomen',
  'hsk1-zenmeyang': 'pronomen',
  'hsk1-zhe': 'pronomen',
  'hsk1-zheer': 'pronomen',
  // Zahlen
  'hsk1-ba': 'zahl',
  'hsk1-bai': 'zahl',
  'hsk1-er': 'zahl',
  'hsk1-jiu': 'zahl',
  'hsk1-ling': 'zahl',
  'hsk1-liu': 'zahl',
  'hsk1-qi': 'zahl',
  'hsk1-san': 'zahl',
  'hsk1-shi': 'zahl',
  'hsk1-si': 'zahl',
  'hsk1-wu': 'zahl',
  'hsk1-yi': 'zahl',
  // Adverbien
  'hsk1-bu': 'adverb',
  'hsk1-dou': 'adverb',
  'hsk1-hen': 'adverb',
  'hsk1-mei': 'adverb',
  'hsk1-meiyou': 'adverb',
  'hsk1-tai': 'adverb',
  // Partikeln
  'hsk1-ba-particle': 'partikel',
  'hsk1-ben': 'partikel',
  'hsk1-de': 'partikel',
  'hsk1-ge': 'partikel',
  'hsk1-he-and': 'partikel',
  'hsk1-kuai': 'partikel',
  'hsk1-le': 'partikel',
  'hsk1-ma': 'partikel',
  'hsk1-ne': 'partikel',
  // Eigennamen
  'hsk1-beijing': 'eigenname',
  'hsk1-zhongguo': 'eigenname',
  // Interjektionen
  'hsk1-bukeqi': 'interjektion',
  'hsk1-duibuqi': 'interjektion',
  'hsk1-meiguanxi': 'interjektion',
  'hsk1-nihao': 'interjektion',
  'hsk1-wei': 'interjektion',
  'hsk1-zaijian': 'interjektion',
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

// Kulturelle Gedächtnisstützen & Mnemonic Hooks für alle HSK-1-Vokabeln
const MNEMONIC_MAP: Record<string, string> = {
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
  "hsk1-ai": [
    {
      "hanzi": "我爱你",
      "pinyin": "wǒ ài nǐ",
      "german": "ich liebe dich",
      "audioPath": "/audio/collocations/col-hsk1-ai-1.mp3"
    },
    {
      "hanzi": "爱吃",
      "pinyin": "ài chī",
      "german": "sehr gerne essen",
      "audioPath": "/audio/collocations/col-hsk1-ai-2.mp3"
    },
    {
      "hanzi": "爱学习",
      "pinyin": "ài xuéxí",
      "german": "gerne lernen",
      "audioPath": "/audio/collocations/col-hsk1-ai-3.mp3"
    }
  ],
  "hsk1-ba": [
    {
      "hanzi": "八个",
      "pinyin": "bā ge",
      "german": "acht Stück",
      "audioPath": "/audio/collocations/col-hsk1-ba-1.mp3"
    },
    {
      "hanzi": "八月",
      "pinyin": "bāyuè",
      "german": "August",
      "audioPath": "/audio/collocations/col-hsk1-ba-2.mp3"
    },
    {
      "hanzi": "八点",
      "pinyin": "bā diǎn",
      "german": "acht Uhr",
      "audioPath": "/audio/collocations/col-hsk1-ba-3.mp3"
    }
  ],
  "hsk1-ba-particle": [
    {
      "hanzi": "走吧",
      "pinyin": "zǒu ba",
      "german": "lass uns gehen!",
      "audioPath": "/audio/collocations/col-hsk1-ba-particle-1.mp3"
    },
    {
      "hanzi": "吃吧",
      "pinyin": "chī ba",
      "german": "lass uns essen! / iss ruhig!",
      "audioPath": "/audio/collocations/col-hsk1-ba-particle-2.mp3"
    },
    {
      "hanzi": "好吧",
      "pinyin": "hǎo ba",
      "german": "na gut / in Ordnung",
      "audioPath": "/audio/collocations/col-hsk1-ba-particle-3.mp3"
    }
  ],
  "hsk1-baba": [
    {
      "hanzi": "我爸爸",
      "pinyin": "wǒ bàba",
      "german": "mein Vater",
      "audioPath": "/audio/collocations/col-hsk1-baba-1.mp3"
    },
    {
      "hanzi": "爸爸妈妈",
      "pinyin": "bàba māma",
      "german": "Eltern (Vater und Mutter)",
      "audioPath": "/audio/collocations/col-hsk1-baba-2.mp3"
    },
    {
      "hanzi": "好爸爸",
      "pinyin": "hǎo bàba",
      "german": "guter Vater",
      "audioPath": "/audio/collocations/col-hsk1-baba-3.mp3"
    }
  ],
  "hsk1-bai": [
    {
      "hanzi": "一百",
      "pinyin": "yī bǎi",
      "german": "einhundert",
      "audioPath": "/audio/collocations/col-hsk1-bai-1.mp3"
    },
    {
      "hanzi": "几百",
      "pinyin": "jǐ bǎi",
      "german": "einige Hundert",
      "audioPath": "/audio/collocations/col-hsk1-bai-2.mp3"
    },
    {
      "hanzi": "五百",
      "pinyin": "wǔ bǎi",
      "german": "fünfhundert",
      "audioPath": "/audio/collocations/col-hsk1-bai-3.mp3"
    }
  ],
  "hsk1-baitian": [
    {
      "hanzi": "白天上课",
      "pinyin": "báitiān shàngkè",
      "german": "tagsüber Unterricht haben",
      "audioPath": "/audio/collocations/col-hsk1-baitian-1.mp3"
    },
    {
      "hanzi": "一整天",
      "pinyin": "yì zhěng tiān",
      "german": "den ganzen Tag",
      "audioPath": "/audio/collocations/col-hsk1-baitian-2.mp3"
    }
  ],
  "hsk1-ban": [
    {
      "hanzi": "一半",
      "pinyin": "yíbàn",
      "german": "die Hälfte",
      "audioPath": "/audio/collocations/col-hsk1-ban-1.mp3"
    },
    {
      "hanzi": "半天",
      "pinyin": "bàntiān",
      "german": "ein halber Tag; eine Weile",
      "audioPath": "/audio/collocations/col-hsk1-ban-2.mp3"
    }
  ],
  "hsk1-baozi": [
    {
      "hanzi": "肉包子",
      "pinyin": "ròu bāozi",
      "german": "Dampfbrötchen mit Fleischfüllung",
      "audioPath": "/audio/collocations/col-hsk1-baozi-1.mp3"
    },
    {
      "hanzi": "吃包子",
      "pinyin": "chī bāozi",
      "german": "Brötchen essen",
      "audioPath": "/audio/collocations/col-hsk1-baozi-2.mp3"
    }
  ],
  "hsk1-beijing": [
    {
      "hanzi": "去北京",
      "pinyin": "qù Běijīng",
      "german": "nach Peking reisen",
      "audioPath": "/audio/collocations/col-hsk1-beijing-1.mp3"
    },
    {
      "hanzi": "北京人",
      "pinyin": "Běijīng rén",
      "german": "Pekinger / Bewohner Pekings",
      "audioPath": "/audio/collocations/col-hsk1-beijing-2.mp3"
    },
    {
      "hanzi": "在北京",
      "pinyin": "zài Běijīng",
      "german": "in Peking sein",
      "audioPath": "/audio/collocations/col-hsk1-beijing-3.mp3"
    }
  ],
  "hsk1-beizi": [
    {
      "hanzi": "茶杯",
      "pinyin": "chábēi",
      "german": "Teetasse",
      "audioPath": "/audio/collocations/col-hsk1-beizi-1.mp3"
    },
    {
      "hanzi": "一个杯子",
      "pinyin": "yí ge bēizi",
      "german": "ein Becher / eine Tasse",
      "audioPath": "/audio/collocations/col-hsk1-beizi-2.mp3"
    },
    {
      "hanzi": "水杯",
      "pinyin": "shuǐbēi",
      "german": "Wasserglas",
      "audioPath": "/audio/collocations/col-hsk1-beizi-3.mp3"
    }
  ],
  "hsk1-ben": [
    {
      "hanzi": "一本书",
      "pinyin": "yì běn shū",
      "german": "ein Buch",
      "audioPath": "/audio/collocations/col-hsk1-ben-1.mp3"
    },
    {
      "hanzi": "这本书",
      "pinyin": "zhè běn shū",
      "german": "dieses Buch",
      "audioPath": "/audio/collocations/col-hsk1-ben-2.mp3"
    },
    {
      "hanzi": "几本书",
      "pinyin": "jǐ běn shū",
      "german": "einige Bücher",
      "audioPath": "/audio/collocations/col-hsk1-ben-3.mp3"
    }
  ],
  "hsk1-bian": [
    {
      "hanzi": "旁边",
      "pinyin": "pángbiān",
      "german": "nebenan",
      "audioPath": "/audio/collocations/col-hsk1-bian-1.mp3"
    },
    {
      "hanzi": "左边",
      "pinyin": "zuǒbiān",
      "german": "linke Seite",
      "audioPath": "/audio/collocations/col-hsk1-bian-2.mp3"
    },
    {
      "hanzi": "右边",
      "pinyin": "yòubiān",
      "german": "rechte Seite",
      "audioPath": "/audio/collocations/col-hsk1-bian-3.mp3"
    }
  ],
  "hsk1-bing": [
    {
      "hanzi": "生病",
      "pinyin": "shēngbìng",
      "german": "krank werden",
      "audioPath": "/audio/collocations/col-hsk1-bing-1.mp3"
    },
    {
      "hanzi": "看病",
      "pinyin": "kànbìng",
      "german": "zum Arzt gehen",
      "audioPath": "/audio/collocations/col-hsk1-bing-2.mp3"
    }
  ],
  "hsk1-bu": [
    {
      "hanzi": "不是",
      "pinyin": "bú shì",
      "german": "ist nicht / nein",
      "audioPath": "/audio/collocations/col-hsk1-bu-1.mp3"
    },
    {
      "hanzi": "不去",
      "pinyin": "bú qù",
      "german": "nicht gehen",
      "audioPath": "/audio/collocations/col-hsk1-bu-2.mp3"
    },
    {
      "hanzi": "不能",
      "pinyin": "bù néng",
      "german": "nicht können / darf nicht",
      "audioPath": "/audio/collocations/col-hsk1-bu-3.mp3"
    }
  ],
  "hsk1-bukeqi": [
    {
      "hanzi": "太不客气了",
      "pinyin": "tài bú kèqi le",
      "german": "zu unhöflich sein",
      "audioPath": "/audio/collocations/col-hsk1-bukeqi-1.mp3"
    },
    {
      "hanzi": "不用客气",
      "pinyin": "bú yòng kèqi",
      "german": "keine Umstände machen",
      "audioPath": "/audio/collocations/col-hsk1-bukeqi-2.mp3"
    },
    {
      "hanzi": "别客气",
      "pinyin": "bié kèqi",
      "german": "sei nicht so förmlich",
      "audioPath": "/audio/collocations/col-hsk1-bukeqi-3.mp3"
    }
  ],
  "hsk1-buyao": [
    {
      "hanzi": "不要紧",
      "pinyin": "bú yào jǐn",
      "german": "kein Problem, macht nichts",
      "audioPath": "/audio/collocations/col-hsk1-buyao-1.mp3"
    },
    {
      "hanzi": "请不要",
      "pinyin": "qǐng bú yào",
      "german": "bitte nicht",
      "audioPath": "/audio/collocations/col-hsk1-buyao-2.mp3"
    }
  ],
  "hsk1-cai": [
    {
      "hanzi": "中国菜",
      "pinyin": "Zhōngguó cài",
      "german": "chinesisches Essen",
      "audioPath": "/audio/collocations/col-hsk1-cai-1.mp3"
    },
    {
      "hanzi": "做菜",
      "pinyin": "zuò cài",
      "german": "Gerichte kochen",
      "audioPath": "/audio/collocations/col-hsk1-cai-2.mp3"
    },
    {
      "hanzi": "点菜",
      "pinyin": "diǎn cài",
      "german": "Speisen bestellen",
      "audioPath": "/audio/collocations/col-hsk1-cai-3.mp3"
    }
  ],
  "hsk1-cha": [
    {
      "hanzi": "喝茶",
      "pinyin": "hē chá",
      "german": "Tee trinken",
      "audioPath": "/audio/collocations/col-hsk1-cha-1.mp3"
    },
    {
      "hanzi": "绿茶",
      "pinyin": "lǜchá",
      "german": "grüner Tee",
      "audioPath": "/audio/collocations/col-hsk1-cha-2.mp3"
    },
    {
      "hanzi": "红茶",
      "pinyin": "hóngchá",
      "german": "schwarzer Tee",
      "audioPath": "/audio/collocations/col-hsk1-cha-3.mp3"
    },
    {
      "hanzi": "茶杯",
      "pinyin": "chábēi",
      "german": "Teetasse",
      "audioPath": "/audio/collocations/col-hsk1-cha-4.mp3"
    }
  ],
  "hsk1-chang": [
    {
      "hanzi": "唱歌",
      "pinyin": "chàng gē",
      "german": "ein Lied singen",
      "audioPath": "/audio/collocations/col-hsk1-chang-1.mp3"
    },
    {
      "hanzi": "唱中国歌",
      "pinyin": "chàng Zhōngguó gē",
      "german": "ein chinesisches Lied singen",
      "audioPath": "/audio/collocations/col-hsk1-chang-2.mp3"
    }
  ],
  "hsk1-chaoshi": [
    {
      "hanzi": "去超市",
      "pinyin": "qù chāoshì",
      "german": "in den Supermarkt gehen",
      "audioPath": "/audio/collocations/col-hsk1-chaoshi-1.mp3"
    },
    {
      "hanzi": "超市的鸡蛋",
      "pinyin": "chāoshì de jīdàn",
      "german": "die Eier im Supermarkt",
      "audioPath": "/audio/collocations/col-hsk1-chaoshi-2.mp3"
    }
  ],
  "hsk1-che": [
    {
      "hanzi": "汽车",
      "pinyin": "qìchē",
      "german": "Auto",
      "audioPath": "/audio/collocations/col-hsk1-che-1.mp3"
    },
    {
      "hanzi": "坐出租车",
      "pinyin": "zuò chūzūchē",
      "german": "mit dem Taxi fahren",
      "audioPath": "/audio/collocations/col-hsk1-che-2.mp3"
    },
    {
      "hanzi": "开车",
      "pinyin": "kāi chē",
      "german": "Auto fahren",
      "audioPath": "/audio/collocations/col-hsk1-che-3.mp3"
    }
  ],
  "hsk1-chi": [
    {
      "hanzi": "吃饭",
      "pinyin": "chī fàn",
      "german": "eine Mahlzeit essen",
      "audioPath": "/audio/collocations/col-hsk1-chi-1.mp3"
    },
    {
      "hanzi": "好吃",
      "pinyin": "hǎochī",
      "german": "lecker",
      "audioPath": "/audio/collocations/col-hsk1-chi-2.mp3"
    },
    {
      "hanzi": "吃苹果",
      "pinyin": "chī píngguǒ",
      "german": "Äpfel essen",
      "audioPath": "/audio/collocations/col-hsk1-chi-3.mp3"
    }
  ],
  "hsk1-chuan": [
    {
      "hanzi": "穿衣服",
      "pinyin": "chuān yīfu",
      "german": "Kleidung anziehen",
      "audioPath": "/audio/collocations/col-hsk1-chuan-1.mp3"
    },
    {
      "hanzi": "穿鞋",
      "pinyin": "chuān xié",
      "german": "Schuhe anziehen",
      "audioPath": "/audio/collocations/col-hsk1-chuan-2.mp3"
    }
  ],
  "hsk1-chuzuche": [
    {
      "hanzi": "坐出租车",
      "pinyin": "zuò chūzūchē",
      "german": "Taxi fahren",
      "audioPath": "/audio/collocations/col-hsk1-chuzuche-1.mp3"
    },
    {
      "hanzi": "叫出租车",
      "pinyin": "jiào chūzūchē",
      "german": "ein Taxi rufen",
      "audioPath": "/audio/collocations/col-hsk1-chuzuche-2.mp3"
    },
    {
      "hanzi": "开出租车",
      "pinyin": "kāi chūzūchē",
      "german": "Taxi fahren (als Fahrer)",
      "audioPath": "/audio/collocations/col-hsk1-chuzuche-3.mp3"
    }
  ],
  "hsk1-da": [
    {
      "hanzi": "大人",
      "pinyin": "dàrén",
      "german": "Erwachsener",
      "audioPath": "/audio/collocations/col-hsk1-da-1.mp3"
    },
    {
      "hanzi": "大学",
      "pinyin": "dàxué",
      "german": "Universität",
      "audioPath": "/audio/collocations/col-hsk1-da-2.mp3"
    },
    {
      "hanzi": "大家",
      "pinyin": "dàjiā",
      "german": "alle zusammen",
      "audioPath": "/audio/collocations/col-hsk1-da-3.mp3"
    }
  ],
  "hsk1-dadianhua": [
    {
      "hanzi": "打电话给",
      "pinyin": "dǎ diànhuà gěi",
      "german": "anrufen bei",
      "audioPath": "/audio/collocations/col-hsk1-dadianhua-1.mp3"
    },
    {
      "hanzi": "接电话",
      "pinyin": "jiē diànhuà",
      "german": "den Anruf annehmen",
      "audioPath": "/audio/collocations/col-hsk1-dadianhua-2.mp3"
    },
    {
      "hanzi": "常打电话",
      "pinyin": "cháng dǎ diànhuà",
      "german": "oft telefonieren",
      "audioPath": "/audio/collocations/col-hsk1-dadianhua-3.mp3"
    }
  ],
  "hsk1-dajia": [
    {
      "hanzi": "大家好",
      "pinyin": "dàjiā hǎo",
      "german": "Guten Tag (an eine Gruppe)",
      "audioPath": "/audio/collocations/col-hsk1-dajia-1.mp3"
    },
    {
      "hanzi": "大家都在",
      "pinyin": "dàjiā dōu zài",
      "german": "alle sind da",
      "audioPath": "/audio/collocations/col-hsk1-dajia-2.mp3"
    }
  ],
  "hsk1-dao-arrive": [
    {
      "hanzi": "到了",
      "pinyin": "dàole",
      "german": "angekommen (wörtlich)",
      "audioPath": "/audio/collocations/col-hsk1-dao-arrive-1.mp3"
    },
    {
      "hanzi": "到家",
      "pinyin": "dào jiā",
      "german": "zu Hause ankommen",
      "audioPath": "/audio/collocations/col-hsk1-dao-arrive-2.mp3"
    }
  ],
  "hsk1-daxue": [
    {
      "hanzi": "上大学",
      "pinyin": "shàng dàxué",
      "german": "die Universität besuchen",
      "audioPath": "/audio/collocations/col-hsk1-daxue-1.mp3"
    },
    {
      "hanzi": "大学老师",
      "pinyin": "dàxué lǎoshī",
      "german": "Universitätsdozent",
      "audioPath": "/audio/collocations/col-hsk1-daxue-2.mp3"
    }
  ],
  "hsk1-daxuesheng": [
    {
      "hanzi": "当大学生",
      "pinyin": "dāng dàxuéshēng",
      "german": "Student sein",
      "audioPath": "/audio/collocations/col-hsk1-daxuesheng-1.mp3"
    },
    {
      "hanzi": "大学生朋友",
      "pinyin": "dàxuéshēng péngyou",
      "german": "Studentenfreund",
      "audioPath": "/audio/collocations/col-hsk1-daxuesheng-2.mp3"
    }
  ],
  "hsk1-de": [
    {
      "hanzi": "我的",
      "pinyin": "wǒ de",
      "german": "mein / meine",
      "audioPath": "/audio/collocations/col-hsk1-de-1.mp3"
    },
    {
      "hanzi": "你的",
      "pinyin": "nǐ de",
      "german": "dein / deine",
      "audioPath": "/audio/collocations/col-hsk1-de-2.mp3"
    },
    {
      "hanzi": "好的",
      "pinyin": "hǎo de",
      "german": "in Ordnung / einverstanden",
      "audioPath": "/audio/collocations/col-hsk1-de-3.mp3"
    }
  ],
  "hsk1-di-ordinal": [
    {
      "hanzi": "第一",
      "pinyin": "dì yī",
      "german": "der Erste",
      "audioPath": "/audio/collocations/col-hsk1-di-ordinal-1.mp3"
    },
    {
      "hanzi": "第三",
      "pinyin": "dì sān",
      "german": "der Dritte",
      "audioPath": "/audio/collocations/col-hsk1-di-ordinal-2.mp3"
    },
    {
      "hanzi": "最后一次",
      "pinyin": "zuì hòu yí cì",
      "german": "das letzte Mal",
      "audioPath": "/audio/collocations/col-hsk1-di-ordinal-3.mp3"
    }
  ],
  "hsk1-dian": [
    {
      "hanzi": "八点",
      "pinyin": "bā diǎn",
      "german": "acht Uhr",
      "audioPath": "/audio/collocations/col-hsk1-dian-1.mp3"
    },
    {
      "hanzi": "几点",
      "pinyin": "jǐ diǎn",
      "german": "wie viel Uhr?",
      "audioPath": "/audio/collocations/col-hsk1-dian-2.mp3"
    },
    {
      "hanzi": "一点点",
      "pinyin": "yì diǎndiǎn",
      "german": "ein kleines bisschen",
      "audioPath": "/audio/collocations/col-hsk1-dian-3.mp3"
    }
  ],
  "hsk1-dian-store": [
    {
      "hanzi": "书店",
      "pinyin": "shūdiàn",
      "german": "Buchhandlung",
      "audioPath": "/audio/collocations/col-hsk1-dian-store-1.mp3"
    },
    {
      "hanzi": "商店",
      "pinyin": "shāngdiàn",
      "german": "Laden, Geschäft",
      "audioPath": "/audio/collocations/col-hsk1-dian-store-2.mp3"
    },
    {
      "hanzi": "饭店",
      "pinyin": "fàndiàn",
      "german": "Restaurant, Hotel",
      "audioPath": "/audio/collocations/col-hsk1-dian-store-3.mp3"
    }
  ],
  "hsk1-dianhua": [
    {
      "hanzi": "打电话",
      "pinyin": "dǎ diànhuà",
      "german": "telefonieren",
      "audioPath": "/audio/collocations/col-hsk1-dianhua-1.mp3"
    },
    {
      "hanzi": "电话号码",
      "pinyin": "diànhuà hàomǎ",
      "german": "Telefonnummer",
      "audioPath": "/audio/collocations/col-hsk1-dianhua-2.mp3"
    }
  ],
  "hsk1-diannao": [
    {
      "hanzi": "电脑",
      "pinyin": "diànnǎo",
      "german": "Computer (elektrisches Gehirn)",
      "audioPath": "/audio/collocations/col-hsk1-diannao-1.mp3"
    },
    {
      "hanzi": "电视",
      "pinyin": "diànshì",
      "german": "Fernsehen (elektrischer Blick)",
      "audioPath": "/audio/collocations/col-hsk1-diannao-2.mp3"
    },
    {
      "hanzi": "电影",
      "pinyin": "diànyǐng",
      "german": "Film (elektrischer Schatten)",
      "audioPath": "/audio/collocations/col-hsk1-diannao-3.mp3"
    },
    {
      "hanzi": "打电话",
      "pinyin": "dǎ diànhuà",
      "german": "telefonieren",
      "audioPath": "/audio/collocations/col-hsk1-diannao-4.mp3"
    }
  ],
  "hsk1-dianshi": [
    {
      "hanzi": "看电视",
      "pinyin": "kàn diànshì",
      "german": "fernsehen",
      "audioPath": "/audio/collocations/col-hsk1-dianshi-1.mp3"
    },
    {
      "hanzi": "买电视",
      "pinyin": "mǎi diànshì",
      "german": "einen Fernseher kaufen",
      "audioPath": "/audio/collocations/col-hsk1-dianshi-2.mp3"
    },
    {
      "hanzi": "开电视",
      "pinyin": "kāi diànshì",
      "german": "den Fernseher einschalten",
      "audioPath": "/audio/collocations/col-hsk1-dianshi-3.mp3"
    }
  ],
  "hsk1-dianying": [
    {
      "hanzi": "看电影",
      "pinyin": "kàn diànyǐng",
      "german": "einen Film schauen",
      "audioPath": "/audio/collocations/col-hsk1-dianying-1.mp3"
    },
    {
      "hanzi": "电影院",
      "pinyin": "diànyǐngyuàn",
      "german": "Kino",
      "audioPath": "/audio/collocations/col-hsk1-dianying-2.mp3"
    }
  ],
  "hsk1-dianyingyuan": [
    {
      "hanzi": "去电影院",
      "pinyin": "qù diànyǐngyuàn",
      "german": "ins Kino gehen",
      "audioPath": "/audio/collocations/col-hsk1-dianyingyuan-1.mp3"
    },
    {
      "hanzi": "电影院旁边",
      "pinyin": "diànyǐngyuàn pángbiān",
      "german": "neben dem Kino",
      "audioPath": "/audio/collocations/col-hsk1-dianyingyuan-2.mp3"
    }
  ],
  "hsk1-didi": [
    {
      "hanzi": "弟弟今年十岁",
      "pinyin": "dìdi jīnnián shí suì",
      "german": "mein kleiner Bruder ist zehn Jahre alt",
      "audioPath": "/audio/collocations/col-hsk1-didi-1.mp3"
    },
    {
      "hanzi": "弟弟和妹妹",
      "pinyin": "dìdi hé mèimei",
      "german": "Bruder und Schwester",
      "audioPath": "/audio/collocations/col-hsk1-didi-2.mp3"
    }
  ],
  "hsk1-dongxi": [
    {
      "hanzi": "买东西",
      "pinyin": "mǎi dōngxi",
      "german": "einkaufen / Sachen kaufen",
      "audioPath": "/audio/collocations/col-hsk1-dongxi-1.mp3"
    },
    {
      "hanzi": "吃东西",
      "pinyin": "chī dōngxi",
      "german": "etwas essen",
      "audioPath": "/audio/collocations/col-hsk1-dongxi-2.mp3"
    },
    {
      "hanzi": "好东西",
      "pinyin": "hǎo dōngxi",
      "german": "gute Sache / feine Ware",
      "audioPath": "/audio/collocations/col-hsk1-dongxi-3.mp3"
    }
  ],
  "hsk1-dou": [
    {
      "hanzi": "我们都",
      "pinyin": "wǒmen dōu",
      "german": "wir alle",
      "audioPath": "/audio/collocations/col-hsk1-dou-1.mp3"
    },
    {
      "hanzi": "都是",
      "pinyin": "dōu shì",
      "german": "sind alle...",
      "audioPath": "/audio/collocations/col-hsk1-dou-2.mp3"
    },
    {
      "hanzi": "都会",
      "pinyin": "dōu huì",
      "german": "können alle...",
      "audioPath": "/audio/collocations/col-hsk1-dou-3.mp3"
    }
  ],
  "hsk1-du": [
    {
      "hanzi": "读书",
      "pinyin": "dú shū",
      "german": "Bücher lesen / studieren",
      "audioPath": "/audio/collocations/col-hsk1-du-1.mp3"
    },
    {
      "hanzi": "大声读",
      "pinyin": "dà shēng dú",
      "german": "laut vorlesen",
      "audioPath": "/audio/collocations/col-hsk1-du-2.mp3"
    },
    {
      "hanzi": "读汉字",
      "pinyin": "dú Hànzì",
      "german": "Schriftzeichen lesen",
      "audioPath": "/audio/collocations/col-hsk1-du-3.mp3"
    }
  ],
  "hsk1-dui": [
    {
      "hanzi": "对了",
      "pinyin": "duì le",
      "german": "stimmt, genau (das stimmt)",
      "audioPath": "/audio/collocations/col-hsk1-dui-1.mp3"
    },
    {
      "hanzi": "对不起",
      "pinyin": "duìbuqǐ",
      "german": "Entschuldigung, es tut mir leid",
      "audioPath": "/audio/collocations/col-hsk1-dui-2.mp3"
    },
    {
      "hanzi": "对不对",
      "pinyin": "duì bu duì",
      "german": "stimmt das oder nicht",
      "audioPath": "/audio/collocations/col-hsk1-dui-3.mp3"
    }
  ],
  "hsk1-duibuqi": [
    {
      "hanzi": "对不起大家",
      "pinyin": "duìbuqǐ dàjiā",
      "german": "Entschuldigung an alle",
      "audioPath": "/audio/collocations/col-hsk1-duibuqi-1.mp3"
    },
    {
      "hanzi": "真对不起",
      "pinyin": "zhēn duìbuqǐ",
      "german": "es tut mir wirklich leid",
      "audioPath": "/audio/collocations/col-hsk1-duibuqi-2.mp3"
    },
    {
      "hanzi": "说对不起",
      "pinyin": "shuō duìbuqǐ",
      "german": "sich entschuldigen",
      "audioPath": "/audio/collocations/col-hsk1-duibuqi-3.mp3"
    }
  ],
  "hsk1-duo": [
    {
      "hanzi": "很多",
      "pinyin": "hěn duō",
      "german": "sehr viel / sehr viele",
      "audioPath": "/audio/collocations/col-hsk1-duo-1.mp3"
    },
    {
      "hanzi": "多少",
      "pinyin": "duōshao",
      "german": "wie viel?",
      "audioPath": "/audio/collocations/col-hsk1-duo-2.mp3"
    },
    {
      "hanzi": "多大",
      "pinyin": "duō dà",
      "german": "wie alt / wie groß?",
      "audioPath": "/audio/collocations/col-hsk1-duo-3.mp3"
    }
  ],
  "hsk1-duoshao": [
    {
      "hanzi": "多少钱",
      "pinyin": "duōshao qián",
      "german": "wie viel kostet das?",
      "audioPath": "/audio/collocations/col-hsk1-duoshao-1.mp3"
    },
    {
      "hanzi": "多少人",
      "pinyin": "duōshao rén",
      "german": "wie viele Personen?",
      "audioPath": "/audio/collocations/col-hsk1-duoshao-2.mp3"
    },
    {
      "hanzi": "多少个",
      "pinyin": "duōshao ge",
      "german": "wie viele Stück?",
      "audioPath": "/audio/collocations/col-hsk1-duoshao-3.mp3"
    }
  ],
  "hsk1-dushu": [
    {
      "hanzi": "读书的时候",
      "pinyin": "dúshū de shíhou",
      "german": "während des Studiums",
      "audioPath": "/audio/collocations/col-hsk1-dushu-1.mp3"
    },
    {
      "hanzi": "喜欢读书",
      "pinyin": "xǐhuan dúshū",
      "german": "gern lesen",
      "audioPath": "/audio/collocations/col-hsk1-dushu-2.mp3"
    }
  ],
  "hsk1-er": [
    {
      "hanzi": "二十",
      "pinyin": "èrshí",
      "german": "zwanzig",
      "audioPath": "/audio/collocations/col-hsk1-er-1.mp3"
    },
    {
      "hanzi": "二月",
      "pinyin": "èryuè",
      "german": "Februar",
      "audioPath": "/audio/collocations/col-hsk1-er-2.mp3"
    },
    {
      "hanzi": "第二",
      "pinyin": "dì-èr",
      "german": "zweiter / zweitens",
      "audioPath": "/audio/collocations/col-hsk1-er-3.mp3"
    }
  ],
  "hsk1-erzi": [
    {
      "hanzi": "他儿子",
      "pinyin": "tā érzi",
      "german": "sein Sohn",
      "audioPath": "/audio/collocations/col-hsk1-erzi-1.mp3"
    },
    {
      "hanzi": "大儿子",
      "pinyin": "dà érzi",
      "german": "der älteste Sohn",
      "audioPath": "/audio/collocations/col-hsk1-erzi-2.mp3"
    },
    {
      "hanzi": "小儿子",
      "pinyin": "xiǎo érzi",
      "german": "der jüngste Sohn",
      "audioPath": "/audio/collocations/col-hsk1-erzi-3.mp3"
    }
  ],
  "hsk1-fan": [
    {
      "hanzi": "米饭",
      "pinyin": "mǐfàn",
      "german": "gekochter Reis",
      "audioPath": "/audio/collocations/col-hsk1-fan-1.mp3"
    },
    {
      "hanzi": "吃饭",
      "pinyin": "chī fàn",
      "german": "essen",
      "audioPath": "/audio/collocations/col-hsk1-fan-2.mp3"
    },
    {
      "hanzi": "晚饭",
      "pinyin": "wǎnfàn",
      "german": "Abendessen",
      "audioPath": "/audio/collocations/col-hsk1-fan-3.mp3"
    }
  ],
  "hsk1-fandian": [
    {
      "hanzi": "去饭店",
      "pinyin": "qù fàndiàn",
      "german": "ins Restaurant / Hotel gehen",
      "audioPath": "/audio/collocations/col-hsk1-fandian-1.mp3"
    },
    {
      "hanzi": "大饭店",
      "pinyin": "dà fàndiàn",
      "german": "großes Hotel / Restaurant",
      "audioPath": "/audio/collocations/col-hsk1-fandian-2.mp3"
    },
    {
      "hanzi": "在饭店吃",
      "pinyin": "zài fàndiàn chī",
      "german": "im Restaurant essen",
      "audioPath": "/audio/collocations/col-hsk1-fandian-3.mp3"
    }
  ],
  "hsk1-fangjian": [
    {
      "hanzi": "我的房间",
      "pinyin": "wǒ de fángjiān",
      "german": "mein Zimmer",
      "audioPath": "/audio/collocations/col-hsk1-fangjian-1.mp3"
    },
    {
      "hanzi": "干净的房间",
      "pinyin": "gānjìng de fángjiān",
      "german": "ein sauberes Zimmer",
      "audioPath": "/audio/collocations/col-hsk1-fangjian-2.mp3"
    }
  ],
  "hsk1-fanguan": [
    {
      "hanzi": "饭店",
      "pinyin": "fàndiàn",
      "german": "Hotel / Restaurant",
      "audioPath": "/audio/collocations/col-hsk1-fanguan-1.mp3"
    },
    {
      "hanzi": "吃饭",
      "pinyin": "chī fàn",
      "german": "essen",
      "audioPath": "/audio/collocations/col-hsk1-fanguan-2.mp3"
    },
    {
      "hanzi": "米饭",
      "pinyin": "mǐfàn",
      "german": "gekochter Reis",
      "audioPath": "/audio/collocations/col-hsk1-fanguan-3.mp3"
    }
  ],
  "hsk1-feichang": [
    {
      "hanzi": "非常好",
      "pinyin": "fēicháng hǎo",
      "german": "sehr gut",
      "audioPath": "/audio/collocations/col-hsk1-feichang-1.mp3"
    },
    {
      "hanzi": "非常重要",
      "pinyin": "fēicháng zhòngyào",
      "german": "sehr wichtig",
      "audioPath": "/audio/collocations/col-hsk1-feichang-2.mp3"
    }
  ],
  "hsk1-feiji": [
    {
      "hanzi": "坐飞机",
      "pinyin": "zuò fēijī",
      "german": "mit dem Flugzeug fliegen",
      "audioPath": "/audio/collocations/col-hsk1-feiji-1.mp3"
    },
    {
      "hanzi": "开飞机",
      "pinyin": "kāi fēijī",
      "german": "ein Flugzeug fliegen",
      "audioPath": "/audio/collocations/col-hsk1-feiji-2.mp3"
    },
    {
      "hanzi": "飞机票",
      "pinyin": "fēijī piào",
      "german": "Flugticket",
      "audioPath": "/audio/collocations/col-hsk1-feiji-3.mp3"
    }
  ],
  "hsk1-fen": [
    {
      "hanzi": "十分钟",
      "pinyin": "shí fēnzhōng",
      "german": "zehn Minuten",
      "audioPath": "/audio/collocations/col-hsk1-fen-1.mp3"
    },
    {
      "hanzi": "三分",
      "pinyin": "sān fēn",
      "german": "drei Minuten",
      "audioPath": "/audio/collocations/col-hsk1-fen-2.mp3"
    }
  ],
  "hsk1-fenzhong": [
    {
      "hanzi": "十分钟",
      "pinyin": "shí fēnzhōng",
      "german": "zehn Minuten",
      "audioPath": "/audio/collocations/col-hsk1-fenzhong-1.mp3"
    },
    {
      "hanzi": "五分钟",
      "pinyin": "wǔ fēnzhōng",
      "german": "fünf Minuten",
      "audioPath": "/audio/collocations/col-hsk1-fenzhong-2.mp3"
    },
    {
      "hanzi": "几分钟",
      "pinyin": "jǐ fēnzhōng",
      "german": "ein paar Minuten",
      "audioPath": "/audio/collocations/col-hsk1-fenzhong-3.mp3"
    }
  ],
  "hsk1-gaoxing": [
    {
      "hanzi": "很高兴",
      "pinyin": "hěn gāoxìng",
      "german": "sehr erfreut / sehr glücklich",
      "audioPath": "/audio/collocations/col-hsk1-gaoxing-1.mp3"
    },
    {
      "hanzi": "高兴地笑",
      "pinyin": "gāoxìng de xiào",
      "german": "fröhlich lachen",
      "audioPath": "/audio/collocations/col-hsk1-gaoxing-2.mp3"
    },
    {
      "hanzi": "不高兴",
      "pinyin": "bù gāoxìng",
      "german": "unglücklich / verstimmt",
      "audioPath": "/audio/collocations/col-hsk1-gaoxing-3.mp3"
    }
  ],
  "hsk1-ge": [
    {
      "hanzi": "一个人",
      "pinyin": "yí ge rén",
      "german": "eine Person",
      "audioPath": "/audio/collocations/col-hsk1-ge-1.mp3"
    },
    {
      "hanzi": "这个",
      "pinyin": "zhè ge",
      "german": "dieses hier",
      "audioPath": "/audio/collocations/col-hsk1-ge-2.mp3"
    },
    {
      "hanzi": "那个",
      "pinyin": "nà ge",
      "german": "jenes dort",
      "audioPath": "/audio/collocations/col-hsk1-ge-3.mp3"
    }
  ],
  "hsk1-ge-song": [
    {
      "hanzi": "唱歌",
      "pinyin": "chàng gē",
      "german": "ein Lied singen",
      "audioPath": "/audio/collocations/col-hsk1-ge-song-1.mp3"
    },
    {
      "hanzi": "中国歌",
      "pinyin": "Zhōngguó gē",
      "german": "chinesisches Lied",
      "audioPath": "/audio/collocations/col-hsk1-ge-song-2.mp3"
    },
    {
      "hanzi": "好听的歌",
      "pinyin": "hǎotīng de gē",
      "german": "schönes Lied",
      "audioPath": "/audio/collocations/col-hsk1-ge-song-3.mp3"
    }
  ],
  "hsk1-gege": [
    {
      "hanzi": "我哥哥",
      "pinyin": "wǒ gēge",
      "german": "mein älterer Bruder",
      "audioPath": "/audio/collocations/col-hsk1-gege-1.mp3"
    },
    {
      "hanzi": "哥哥和弟弟",
      "pinyin": "gēge hé dìdi",
      "german": "Brüder",
      "audioPath": "/audio/collocations/col-hsk1-gege-2.mp3"
    }
  ],
  "hsk1-gei-give": [
    {
      "hanzi": "给我",
      "pinyin": "gěi wǒ",
      "german": "gib mir",
      "audioPath": "/audio/collocations/col-hsk1-gei-give-1.mp3"
    },
    {
      "hanzi": "给妈妈打电话",
      "pinyin": "gěi māma dǎ diànhuà",
      "german": "Mama anrufen",
      "audioPath": "/audio/collocations/col-hsk1-gei-give-2.mp3"
    }
  ],
  "hsk1-gongsi": [
    {
      "hanzi": "在公司",
      "pinyin": "zài gōngsī",
      "german": "in der Firma",
      "audioPath": "/audio/collocations/col-hsk1-gongsi-1.mp3"
    },
    {
      "hanzi": "大公司",
      "pinyin": "dà gōngsī",
      "german": "große Firma",
      "audioPath": "/audio/collocations/col-hsk1-gongsi-2.mp3"
    }
  ],
  "hsk1-gongzuo": [
    {
      "hanzi": "找工作",
      "pinyin": "zhǎo gōngzuò",
      "german": "Arbeit suchen",
      "audioPath": "/audio/collocations/col-hsk1-gongzuo-1.mp3"
    },
    {
      "hanzi": "努力工作",
      "pinyin": "nǔlì gōngzuò",
      "german": "fleißig arbeiten",
      "audioPath": "/audio/collocations/col-hsk1-gongzuo-2.mp3"
    },
    {
      "hanzi": "在医院工作",
      "pinyin": "zài yīyuàn gōngzuò",
      "german": "im Krankenhaus arbeiten",
      "audioPath": "/audio/collocations/col-hsk1-gongzuo-3.mp3"
    }
  ],
  "hsk1-gou": [
    {
      "hanzi": "大狗",
      "pinyin": "dà gǒu",
      "german": "großer Hund",
      "audioPath": "/audio/collocations/col-hsk1-gou-1.mp3"
    },
    {
      "hanzi": "小狗",
      "pinyin": "xiǎo gǒu",
      "german": "Welpe / kleiner Hund",
      "audioPath": "/audio/collocations/col-hsk1-gou-2.mp3"
    },
    {
      "hanzi": "喂狗",
      "pinyin": "wèi gǒu",
      "german": "den Hund füttern",
      "audioPath": "/audio/collocations/col-hsk1-gou-3.mp3"
    }
  ],
  "hsk1-gui": [
    {
      "hanzi": "太贵了",
      "pinyin": "tài guì le",
      "german": "das ist zu teuer",
      "audioPath": "/audio/collocations/col-hsk1-gui-1.mp3"
    },
    {
      "hanzi": "贵不贵",
      "pinyin": "guì bu guì",
      "german": "ist es teuer?",
      "audioPath": "/audio/collocations/col-hsk1-gui-2.mp3"
    }
  ],
  "hsk1-guo": [
    {
      "hanzi": "中国",
      "pinyin": "Zhōngguó",
      "german": "China",
      "audioPath": "/audio/collocations/col-hsk1-guo-1.mp3"
    },
    {
      "hanzi": "哪个国家",
      "pinyin": "nǎ ge guójiā",
      "german": "welches Land",
      "audioPath": "/audio/collocations/col-hsk1-guo-2.mp3"
    },
    {
      "hanzi": "我的国家",
      "pinyin": "wǒ de guójiā",
      "german": "mein Land",
      "audioPath": "/audio/collocations/col-hsk1-guo-3.mp3"
    }
  ],
  "hsk1-hai-still": [
    {
      "hanzi": "还有",
      "pinyin": "hái yǒu",
      "german": "es gibt noch, außerdem",
      "audioPath": "/audio/collocations/col-hsk1-hai-still-1.mp3"
    },
    {
      "hanzi": "还没",
      "pinyin": "hái méi",
      "german": "noch nicht",
      "audioPath": "/audio/collocations/col-hsk1-hai-still-2.mp3"
    }
  ],
  "hsk1-haizi": [
    {
      "hanzi": "小孩子",
      "pinyin": "xiǎo háizi",
      "german": "kleines Kind",
      "audioPath": "/audio/collocations/col-hsk1-haizi-1.mp3"
    },
    {
      "hanzi": "孩子们",
      "pinyin": "háizi men",
      "german": "die Kinder",
      "audioPath": "/audio/collocations/col-hsk1-haizi-2.mp3"
    }
  ],
  "hsk1-hanyu": [
    {
      "hanzi": "学汉语",
      "pinyin": "xué Hànyǔ",
      "german": "Chinesisch lernen",
      "audioPath": "/audio/collocations/col-hsk1-hanyu-1.mp3"
    },
    {
      "hanzi": "说汉语",
      "pinyin": "shuō Hànyǔ",
      "german": "Chinesisch sprechen",
      "audioPath": "/audio/collocations/col-hsk1-hanyu-2.mp3"
    },
    {
      "hanzi": "汉语书",
      "pinyin": "Hànyǔ shū",
      "german": "Chinesischbuch",
      "audioPath": "/audio/collocations/col-hsk1-hanyu-3.mp3"
    }
  ],
  "hsk1-hanzi": [
    {
      "hanzi": "学汉字",
      "pinyin": "xué hànzì",
      "german": "Schriftzeichen lernen",
      "audioPath": "/audio/collocations/col-hsk1-hanzi-1.mp3"
    },
    {
      "hanzi": "认识汉字",
      "pinyin": "rènshi hànzì",
      "german": "Schriftzeichen kennen",
      "audioPath": "/audio/collocations/col-hsk1-hanzi-2.mp3"
    }
  ],
  "hsk1-hao": [
    {
      "hanzi": "好看",
      "pinyin": "hǎokàn",
      "german": "schön / hübsch anzusehen",
      "audioPath": "/audio/collocations/col-hsk1-hao-1.mp3"
    },
    {
      "hanzi": "好吃",
      "pinyin": "hǎochī",
      "german": "lecker / schmackhaft",
      "audioPath": "/audio/collocations/col-hsk1-hao-2.mp3"
    },
    {
      "hanzi": "好听",
      "pinyin": "hǎotīng",
      "german": "schön klingend",
      "audioPath": "/audio/collocations/col-hsk1-hao-3.mp3"
    },
    {
      "hanzi": "好玩",
      "pinyin": "hǎowán",
      "german": "unterhaltsam / lustig",
      "audioPath": "/audio/collocations/col-hsk1-hao-4.mp3"
    }
  ],
  "hsk1-hao-number": [
    {
      "hanzi": "五号",
      "pinyin": "wǔ hào",
      "german": "der 5. (Tag) / Nummer 5",
      "audioPath": "/audio/collocations/col-hsk1-hao-number-1.mp3"
    },
    {
      "hanzi": "今天几号",
      "pinyin": "jīntiān jǐ hào",
      "german": "der wievielte Tag ist heute?",
      "audioPath": "/audio/collocations/col-hsk1-hao-number-2.mp3"
    },
    {
      "hanzi": "房间号",
      "pinyin": "fángjiānhào",
      "german": "Zimmernummer",
      "audioPath": "/audio/collocations/col-hsk1-hao-number-3.mp3"
    }
  ],
  "hsk1-haochi": [
    {
      "hanzi": "很好吃",
      "pinyin": "hěn hǎochī",
      "german": "sehr lecker",
      "audioPath": "/audio/collocations/col-hsk1-haochi-1.mp3"
    },
    {
      "hanzi": "这个菜好吃",
      "pinyin": "zhège cài hǎochī",
      "german": "dieses Gericht schmeckt gut",
      "audioPath": "/audio/collocations/col-hsk1-haochi-2.mp3"
    }
  ],
  "hsk1-haokan": [
    {
      "hanzi": "很好看",
      "pinyin": "hěn hǎokàn",
      "german": "sehr schön",
      "audioPath": "/audio/collocations/col-hsk1-haokan-1.mp3"
    },
    {
      "hanzi": "衣服好看",
      "pinyin": "yīfu hǎokàn",
      "german": "die Kleidung sieht gut aus",
      "audioPath": "/audio/collocations/col-hsk1-haokan-2.mp3"
    }
  ],
  "hsk1-haoting": [
    {
      "hanzi": "很好听",
      "pinyin": "hěn hǎotīng",
      "german": "klingt sehr schön",
      "audioPath": "/audio/collocations/col-hsk1-haoting-1.mp3"
    },
    {
      "hanzi": "好听的声音",
      "pinyin": "hǎotīng de shēngyīn",
      "german": "schöne Stimme",
      "audioPath": "/audio/collocations/col-hsk1-haoting-2.mp3"
    }
  ],
  "hsk1-haowaner": [
    {
      "hanzi": "真好玩儿",
      "pinyin": "zhēn hǎowánr",
      "german": "sehr lustig",
      "audioPath": "/audio/collocations/col-hsk1-haowaner-1.mp3"
    },
    {
      "hanzi": "好玩儿的地方",
      "pinyin": "hǎowánr de dìfang",
      "german": "s cooler Ort",
      "audioPath": "/audio/collocations/col-hsk1-haowaner-2.mp3"
    }
  ],
  "hsk1-he": [
    {
      "hanzi": "喝水",
      "pinyin": "hē shuǐ",
      "german": "Wasser trinken",
      "audioPath": "/audio/collocations/col-hsk1-he-1.mp3"
    },
    {
      "hanzi": "喝茶",
      "pinyin": "hē chá",
      "german": "Tee trinken",
      "audioPath": "/audio/collocations/col-hsk1-he-2.mp3"
    },
    {
      "hanzi": "想喝",
      "pinyin": "xiǎng hē",
      "german": "trinken möchten",
      "audioPath": "/audio/collocations/col-hsk1-he-3.mp3"
    }
  ],
  "hsk1-he-and": [
    {
      "hanzi": "我和你",
      "pinyin": "wǒ hé nǐ",
      "german": "ich und du",
      "audioPath": "/audio/collocations/col-hsk1-he-and-1.mp3"
    },
    {
      "hanzi": "爸爸和妈妈",
      "pinyin": "bàba hé māma",
      "german": "Papa und Mama",
      "audioPath": "/audio/collocations/col-hsk1-he-and-2.mp3"
    },
    {
      "hanzi": "猫和狗",
      "pinyin": "māo hé gǒu",
      "german": "Katze und Hund",
      "audioPath": "/audio/collocations/col-hsk1-he-and-3.mp3"
    }
  ],
  "hsk1-hen": [
    {
      "hanzi": "很好",
      "pinyin": "hěn hǎo",
      "german": "sehr gut",
      "audioPath": "/audio/collocations/col-hsk1-hen-1.mp3"
    },
    {
      "hanzi": "很大",
      "pinyin": "hěn dà",
      "german": "sehr groß",
      "audioPath": "/audio/collocations/col-hsk1-hen-2.mp3"
    },
    {
      "hanzi": "很高兴",
      "pinyin": "hěn gāoxìng",
      "german": "sehr erfreut",
      "audioPath": "/audio/collocations/col-hsk1-hen-3.mp3"
    }
  ],
  "hsk1-hou-behind": [
    {
      "hanzi": "后面",
      "pinyin": "hòumiàn",
      "german": "hinten",
      "audioPath": "/audio/collocations/col-hsk1-hou-behind-1.mp3"
    },
    {
      "hanzi": "以后",
      "pinyin": "yǐhòu",
      "german": "später, in Zukunft",
      "audioPath": "/audio/collocations/col-hsk1-hou-behind-2.mp3"
    },
    {
      "hanzi": "然后",
      "pinyin": "ránhòu",
      "german": "danach",
      "audioPath": "/audio/collocations/col-hsk1-hou-behind-3.mp3"
    }
  ],
  "hsk1-houmian": [
    {
      "hanzi": "在后面",
      "pinyin": "zài hòumian",
      "german": "hinten sein",
      "audioPath": "/audio/collocations/col-hsk1-houmian-1.mp3"
    },
    {
      "hanzi": "商店后面",
      "pinyin": "shāngdiàn hòumian",
      "german": "hinter dem Geschäft",
      "audioPath": "/audio/collocations/col-hsk1-houmian-2.mp3"
    },
    {
      "hanzi": "往后看",
      "pinyin": "wàng hòu kàn",
      "german": "nach hinten blicken",
      "audioPath": "/audio/collocations/col-hsk1-houmian-3.mp3"
    }
  ],
  "hsk1-hui": [
    {
      "hanzi": "会说汉语",
      "pinyin": "huì shuō Hànyǔ",
      "german": "Chinesisch sprechen können",
      "audioPath": "/audio/collocations/col-hsk1-hui-1.mp3"
    },
    {
      "hanzi": "会做饭",
      "pinyin": "huì zuò fàn",
      "german": "kochen können",
      "audioPath": "/audio/collocations/col-hsk1-hui-2.mp3"
    },
    {
      "hanzi": "不会",
      "pinyin": "bú huì",
      "german": "nicht können",
      "audioPath": "/audio/collocations/col-hsk1-hui-3.mp3"
    }
  ],
  "hsk1-hui-return": [
    {
      "hanzi": "回家",
      "pinyin": "huí jiā",
      "german": "nach Hause gehen",
      "audioPath": "/audio/collocations/col-hsk1-hui-return-1.mp3"
    },
    {
      "hanzi": "回国",
      "pinyin": "huí guó",
      "german": "ins Heimatland zurückkehren",
      "audioPath": "/audio/collocations/col-hsk1-hui-return-2.mp3"
    },
    {
      "hanzi": "回来",
      "pinyin": "huí lái",
      "german": "zurückkommen",
      "audioPath": "/audio/collocations/col-hsk1-hui-return-3.mp3"
    }
  ],
  "hsk1-huoche": [
    {
      "hanzi": "坐火车",
      "pinyin": "zuò huǒchē",
      "german": "mit dem Zug fahren",
      "audioPath": "/audio/collocations/col-hsk1-huoche-1.mp3"
    },
    {
      "hanzi": "火车站",
      "pinyin": "huǒchēzhàn",
      "german": "Bahnhof",
      "audioPath": "/audio/collocations/col-hsk1-huoche-2.mp3"
    }
  ],
  "hsk1-huochezhan": [
    {
      "hanzi": "火车站",
      "pinyin": "huǒchēzhàn",
      "german": "Bahnhof",
      "audioPath": "/audio/collocations/col-hsk1-huochezhan-1.mp3"
    },
    {
      "hanzi": "火车",
      "pinyin": "huǒchē",
      "german": "Zug (Feuer-Wagen)",
      "audioPath": "/audio/collocations/col-hsk1-huochezhan-2.mp3"
    },
    {
      "hanzi": "坐车",
      "pinyin": "zuò chē",
      "german": "mit dem Fahrzeug fahren",
      "audioPath": "/audio/collocations/col-hsk1-huochezhan-3.mp3"
    }
  ],
  "hsk1-ji": [
    {
      "hanzi": "几天",
      "pinyin": "jǐ tiān",
      "german": "ein paar Tage / wie viele Tage?",
      "audioPath": "/audio/collocations/col-hsk1-ji-1.mp3"
    },
    {
      "hanzi": "几点",
      "pinyin": "jǐ diǎn",
      "german": "wie viel Uhr?",
      "audioPath": "/audio/collocations/col-hsk1-ji-2.mp3"
    },
    {
      "hanzi": "几个",
      "pinyin": "jǐ ge",
      "german": "wie viele? / einige Stück",
      "audioPath": "/audio/collocations/col-hsk1-ji-3.mp3"
    }
  ],
  "hsk1-jia": [
    {
      "hanzi": "回家里",
      "pinyin": "huí jiā lǐ",
      "german": "nach Hause zurückkehren",
      "audioPath": "/audio/collocations/col-hsk1-jia-1.mp3"
    },
    {
      "hanzi": "我们家",
      "pinyin": "wǒmen jiā",
      "german": "unsere Familie / unser Haushalt",
      "audioPath": "/audio/collocations/col-hsk1-jia-2.mp3"
    },
    {
      "hanzi": "家里人",
      "pinyin": "jiā lǐ rén",
      "german": "Familienangehörige",
      "audioPath": "/audio/collocations/col-hsk1-jia-3.mp3"
    }
  ],
  "hsk1-jian": [
    {
      "hanzi": "看见",
      "pinyin": "kànjiàn",
      "german": "sehen",
      "audioPath": "/audio/collocations/col-hsk1-jian-1.mp3"
    },
    {
      "hanzi": "再见",
      "pinyin": "zàijiàn",
      "german": "auf Wiedersehen",
      "audioPath": "/audio/collocations/col-hsk1-jian-2.mp3"
    },
    {
      "hanzi": "常见",
      "pinyin": "chángjiàn",
      "german": "häufig vorkommen",
      "audioPath": "/audio/collocations/col-hsk1-jian-3.mp3"
    }
  ],
  "hsk1-jian-measure": [
    {
      "hanzi": "一件衣服",
      "pinyin": "yí jiàn yīfu",
      "german": "ein Kleidungsstück",
      "audioPath": "/audio/collocations/col-hsk1-jian-measure-1.mp3"
    },
    {
      "hanzi": "一件小事",
      "pinyin": "yí jiàn xiǎoshì",
      "german": "eine Kleinigkeit",
      "audioPath": "/audio/collocations/col-hsk1-jian-measure-2.mp3"
    }
  ],
  "hsk1-jiao": [
    {
      "hanzi": "叫什么",
      "pinyin": "jiào shénme",
      "german": "wie heißen?",
      "audioPath": "/audio/collocations/col-hsk1-jiao-1.mp3"
    },
    {
      "hanzi": "大声叫",
      "pinyin": "dà shēng jiào",
      "german": "laut rufen",
      "audioPath": "/audio/collocations/col-hsk1-jiao-2.mp3"
    },
    {
      "hanzi": "叫他来",
      "pinyin": "jiào tā lái",
      "german": "ihn herrufen",
      "audioPath": "/audio/collocations/col-hsk1-jiao-3.mp3"
    }
  ],
  "hsk1-jiaozi": [
    {
      "hanzi": "吃饺子",
      "pinyin": "chī jiǎozi",
      "german": "Dumplings essen",
      "audioPath": "/audio/collocations/col-hsk1-jiaozi-1.mp3"
    },
    {
      "hanzi": "包饺子",
      "pinyin": "bāo jiǎozi",
      "german": "Dumplings füllen und zubereiten",
      "audioPath": "/audio/collocations/col-hsk1-jiaozi-2.mp3"
    }
  ],
  "hsk1-jiaren": [
    {
      "hanzi": "我的家人",
      "pinyin": "wǒ de jiārén",
      "german": "meine Familie",
      "audioPath": "/audio/collocations/col-hsk1-jiaren-1.mp3"
    },
    {
      "hanzi": "家人都在",
      "pinyin": "jiārén dōu zài",
      "german": "die ganze Familie ist da",
      "audioPath": "/audio/collocations/col-hsk1-jiaren-2.mp3"
    }
  ],
  "hsk1-jidan": [
    {
      "hanzi": "一个鸡蛋",
      "pinyin": "yí gè jīdàn",
      "german": "ein Ei",
      "audioPath": "/audio/collocations/col-hsk1-jidan-1.mp3"
    },
    {
      "hanzi": "煮鸡蛋",
      "pinyin": "zhǔ jīdàn",
      "german": "Eier kochen",
      "audioPath": "/audio/collocations/col-hsk1-jidan-2.mp3"
    }
  ],
  "hsk1-jiejie": [
    {
      "hanzi": "我姐姐",
      "pinyin": "wǒ jiějie",
      "german": "meine ältere Schwester",
      "audioPath": "/audio/collocations/col-hsk1-jiejie-1.mp3"
    },
    {
      "hanzi": "姐姐比我大三岁",
      "pinyin": "jiějie bǐ wǒ dà sān suì",
      "german": "meine Schwester ist drei Jahre älter",
      "audioPath": "/audio/collocations/col-hsk1-jiejie-2.mp3"
    }
  ],
  "hsk1-jinnian": [
    {
      "hanzi": "今年",
      "pinyin": "jīnnián",
      "german": "dieses Jahr",
      "audioPath": "/audio/collocations/col-hsk1-jinnian-1.mp3"
    },
    {
      "hanzi": "今年年底",
      "pinyin": "jīnnián niándǐ",
      "german": "Ende dieses Jahres",
      "audioPath": "/audio/collocations/col-hsk1-jinnian-2.mp3"
    }
  ],
  "hsk1-jintian": [
    {
      "hanzi": "今天天气",
      "pinyin": "jīntiān tiānqì",
      "german": "das heutige Wetter",
      "audioPath": "/audio/collocations/col-hsk1-jintian-1.mp3"
    },
    {
      "hanzi": "今天星期几",
      "pinyin": "jīntiān xīngqī jǐ",
      "german": "welcher Wochentag ist heute?",
      "audioPath": "/audio/collocations/col-hsk1-jintian-2.mp3"
    },
    {
      "hanzi": "今天上午",
      "pinyin": "jīntiān shàngwǔ",
      "german": "heute Vormittag",
      "audioPath": "/audio/collocations/col-hsk1-jintian-3.mp3"
    }
  ],
  "hsk1-jiu": [
    {
      "hanzi": "九个",
      "pinyin": "jiǔ ge",
      "german": "neun Stück",
      "audioPath": "/audio/collocations/col-hsk1-jiu-1.mp3"
    },
    {
      "hanzi": "九月",
      "pinyin": "jiǔyuè",
      "german": "September",
      "audioPath": "/audio/collocations/col-hsk1-jiu-2.mp3"
    },
    {
      "hanzi": "九点",
      "pinyin": "jiǔ diǎn",
      "german": "neun Uhr",
      "audioPath": "/audio/collocations/col-hsk1-jiu-3.mp3"
    }
  ],
  "hsk1-juede": [
    {
      "hanzi": "我觉得",
      "pinyin": "wǒ juéde",
      "german": "ich finde",
      "audioPath": "/audio/collocations/col-hsk1-juede-1.mp3"
    },
    {
      "hanzi": "觉得怎么样",
      "pinyin": "juéde zěnmeyàng",
      "german": "wie findest du es?",
      "audioPath": "/audio/collocations/col-hsk1-juede-2.mp3"
    }
  ],
  "hsk1-kai": [
    {
      "hanzi": "开车",
      "pinyin": "kāi chē",
      "german": "Auto fahren",
      "audioPath": "/audio/collocations/col-hsk1-kai-1.mp3"
    },
    {
      "hanzi": "开会",
      "pinyin": "kāi huì",
      "german": "eine Besprechung abhalten",
      "audioPath": "/audio/collocations/col-hsk1-kai-2.mp3"
    },
    {
      "hanzi": "开门",
      "pinyin": "kāi mén",
      "german": "die Tür öffnen",
      "audioPath": "/audio/collocations/col-hsk1-kai-3.mp3"
    }
  ],
  "hsk1-kaiche": [
    {
      "hanzi": "开车上班",
      "pinyin": "kāichē shàngbān",
      "german": "mit dem Auto zur Arbeit fahren",
      "audioPath": "/audio/collocations/col-hsk1-kaiche-1.mp3"
    },
    {
      "hanzi": "他开车送我",
      "pinyin": "tā kāichē sòng wǒ",
      "german": "er fährt mich mit dem Auto",
      "audioPath": "/audio/collocations/col-hsk1-kaiche-2.mp3"
    }
  ],
  "hsk1-kan": [
    {
      "hanzi": "看书",
      "pinyin": "kàn shū",
      "german": "ein Buch lesen",
      "audioPath": "/audio/collocations/col-hsk1-kan-1.mp3"
    },
    {
      "hanzi": "看电影",
      "pinyin": "kàn diànyǐng",
      "german": "einen Film schauen",
      "audioPath": "/audio/collocations/col-hsk1-kan-2.mp3"
    },
    {
      "hanzi": "看见",
      "pinyin": "kànjiàn",
      "german": "sehen / erblicken",
      "audioPath": "/audio/collocations/col-hsk1-kan-3.mp3"
    }
  ],
  "hsk1-kanbing": [
    {
      "hanzi": "去医院看病",
      "pinyin": "qù yīyuàn kànbìng",
      "german": "ins Krankenhaus zum Arzt gehen",
      "audioPath": "/audio/collocations/col-hsk1-kanbing-1.mp3"
    },
    {
      "hanzi": "给他看病",
      "pinyin": "gěi tā kànbìng",
      "german": "ihn behandeln",
      "audioPath": "/audio/collocations/col-hsk1-kanbing-2.mp3"
    }
  ],
  "hsk1-kanjian": [
    {
      "hanzi": "看见了",
      "pinyin": "kànjiàn le",
      "german": "erblickt / gesehen haben",
      "audioPath": "/audio/collocations/col-hsk1-kanjian-1.mp3"
    },
    {
      "hanzi": "没看见",
      "pinyin": "méi kànjiàn",
      "german": "nicht gesehen haben",
      "audioPath": "/audio/collocations/col-hsk1-kanjian-2.mp3"
    },
    {
      "hanzi": "能看见",
      "pinyin": "néng kànjiàn",
      "german": "sehen können",
      "audioPath": "/audio/collocations/col-hsk1-kanjian-3.mp3"
    }
  ],
  "hsk1-ke": [
    {
      "hanzi": "上课",
      "pinyin": "shàngkè",
      "german": "Unterricht haben",
      "audioPath": "/audio/collocations/col-hsk1-ke-1.mp3"
    },
    {
      "hanzi": "下课",
      "pinyin": "xiàkè",
      "german": "Unterricht beenden",
      "audioPath": "/audio/collocations/col-hsk1-ke-2.mp3"
    },
    {
      "hanzi": "三节课",
      "pinyin": "sān jié kè",
      "german": "drei Stunden",
      "audioPath": "/audio/collocations/col-hsk1-ke-3.mp3"
    }
  ],
  "hsk1-keyi": [
    {
      "hanzi": "可以坐这儿吗",
      "pinyin": "kěyǐ zuò zhèr ma",
      "german": "darf ich mich hier hinsetzen?",
      "audioPath": "/audio/collocations/col-hsk1-keyi-1.mp3"
    },
    {
      "hanzi": "不可以",
      "pinyin": "bù kěyǐ",
      "german": "nicht erlaubt",
      "audioPath": "/audio/collocations/col-hsk1-keyi-2.mp3"
    }
  ],
  "hsk1-kou-mouth": [
    {
      "hanzi": "开口",
      "pinyin": "kāikǒu",
      "german": "den Mund aufmachen",
      "audioPath": "/audio/collocations/col-hsk1-kou-mouth-1.mp3"
    },
    {
      "hanzi": "三口人",
      "pinyin": "sān kǒu rén",
      "german": "drei Personen",
      "audioPath": "/audio/collocations/col-hsk1-kou-mouth-2.mp3"
    }
  ],
  "hsk1-kuai": [
    {
      "hanzi": "一块钱",
      "pinyin": "yí kuài qián",
      "german": "ein Yuan (Geld)",
      "audioPath": "/audio/collocations/col-hsk1-kuai-1.mp3"
    },
    {
      "hanzi": "几块钱",
      "pinyin": "jǐ kuài qián",
      "german": "ein paar Yuan",
      "audioPath": "/audio/collocations/col-hsk1-kuai-2.mp3"
    },
    {
      "hanzi": "十块",
      "pinyin": "shí kuài",
      "german": "zehn Yuan",
      "audioPath": "/audio/collocations/col-hsk1-kuai-3.mp3"
    }
  ],
  "hsk1-lai": [
    {
      "hanzi": "来到",
      "pinyin": "láidào",
      "german": "ankommen bei",
      "audioPath": "/audio/collocations/col-hsk1-lai-1.mp3"
    },
    {
      "hanzi": "来我家",
      "pinyin": "lái wǒ jiā",
      "german": "zu mir nach Hause kommen",
      "audioPath": "/audio/collocations/col-hsk1-lai-2.mp3"
    },
    {
      "hanzi": "快来",
      "pinyin": "kuài lái",
      "german": "komm schnell!",
      "audioPath": "/audio/collocations/col-hsk1-lai-3.mp3"
    }
  ],
  "hsk1-laoshi": [
    {
      "hanzi": "汉语老师",
      "pinyin": "Hànyǔ lǎoshī",
      "german": "Chinesischlehrer",
      "audioPath": "/audio/collocations/col-hsk1-laoshi-1.mp3"
    },
    {
      "hanzi": "王老师",
      "pinyin": "Wáng lǎoshī",
      "german": "Lehrer Wang",
      "audioPath": "/audio/collocations/col-hsk1-laoshi-2.mp3"
    },
    {
      "hanzi": "老老师",
      "pinyin": "lǎo lǎoshī",
      "german": "erfahrener Lehrer",
      "audioPath": "/audio/collocations/col-hsk1-laoshi-3.mp3"
    }
  ],
  "hsk1-le": [
    {
      "hanzi": "太好了",
      "pinyin": "tài hǎo le",
      "german": "super! / großartig!",
      "audioPath": "/audio/collocations/col-hsk1-le-1.mp3"
    },
    {
      "hanzi": "下雨了",
      "pinyin": "xiàyǔ le",
      "german": "es hat angefangen zu regnen",
      "audioPath": "/audio/collocations/col-hsk1-le-2.mp3"
    },
    {
      "hanzi": "走了",
      "pinyin": "zǒu le",
      "german": "ist gegangen / ist fertig",
      "audioPath": "/audio/collocations/col-hsk1-le-3.mp3"
    }
  ],
  "hsk1-leng": [
    {
      "hanzi": "很冷",
      "pinyin": "hěn lěng",
      "german": "sehr kalt",
      "audioPath": "/audio/collocations/col-hsk1-leng-1.mp3"
    },
    {
      "hanzi": "太冷了",
      "pinyin": "tài lěng le",
      "german": "viel zu kalt",
      "audioPath": "/audio/collocations/col-hsk1-leng-2.mp3"
    },
    {
      "hanzi": "不冷",
      "pinyin": "bù lěng",
      "german": "nicht kalt",
      "audioPath": "/audio/collocations/col-hsk1-leng-3.mp3"
    }
  ],
  "hsk1-li": [
    {
      "hanzi": "家里",
      "pinyin": "jiā lǐ",
      "german": "zu Hause / daheim",
      "audioPath": "/audio/collocations/col-hsk1-li-1.mp3"
    },
    {
      "hanzi": "学校里",
      "pinyin": "xuéxiào lǐ",
      "german": "in der Schule",
      "audioPath": "/audio/collocations/col-hsk1-li-2.mp3"
    },
    {
      "hanzi": "心里",
      "pinyin": "xīn lǐ",
      "german": "im Herzen / innerlich",
      "audioPath": "/audio/collocations/col-hsk1-li-3.mp3"
    }
  ],
  "hsk1-liang": [
    {
      "hanzi": "两个",
      "pinyin": "liǎng ge",
      "german": "zwei (Stück)",
      "audioPath": "/audio/collocations/col-hsk1-liang-1.mp3"
    },
    {
      "hanzi": "两千",
      "pinyin": "liǎng qiān",
      "german": "zweitausend",
      "audioPath": "/audio/collocations/col-hsk1-liang-2.mp3"
    }
  ],
  "hsk1-ling": [
    {
      "hanzi": "零点",
      "pinyin": "líng diǎn",
      "german": "null Uhr / Mitternacht",
      "audioPath": "/audio/collocations/col-hsk1-ling-1.mp3"
    },
    {
      "hanzi": "二零二四年",
      "pinyin": "èr líng èr sì nián",
      "german": "das Jahr 2024",
      "audioPath": "/audio/collocations/col-hsk1-ling-2.mp3"
    },
    {
      "hanzi": "一百零一",
      "pinyin": "yì bǎi líng yī",
      "german": "einhundertundeins",
      "audioPath": "/audio/collocations/col-hsk1-ling-3.mp3"
    }
  ],
  "hsk1-liu": [
    {
      "hanzi": "六个",
      "pinyin": "liù ge",
      "german": "sechs Stück",
      "audioPath": "/audio/collocations/col-hsk1-liu-1.mp3"
    },
    {
      "hanzi": "六月",
      "pinyin": "liùyuè",
      "german": "Juni",
      "audioPath": "/audio/collocations/col-hsk1-liu-2.mp3"
    },
    {
      "hanzi": "星期六",
      "pinyin": "xīngqīliù",
      "german": "Samstag",
      "audioPath": "/audio/collocations/col-hsk1-liu-3.mp3"
    }
  ],
  "hsk1-ma": [
    {
      "hanzi": "好吗",
      "pinyin": "hǎo ma",
      "german": "in Ordnung? / gut?",
      "audioPath": "/audio/collocations/col-hsk1-ma-1.mp3"
    },
    {
      "hanzi": "对吗",
      "pinyin": "duì ma",
      "german": "stimmt das?",
      "audioPath": "/audio/collocations/col-hsk1-ma-2.mp3"
    },
    {
      "hanzi": "是他吗",
      "pinyin": "shì tā ma",
      "german": "ist er das?",
      "audioPath": "/audio/collocations/col-hsk1-ma-3.mp3"
    }
  ],
  "hsk1-mai": [
    {
      "hanzi": "买苹果",
      "pinyin": "mǎi píngguǒ",
      "german": "Äpfel kaufen",
      "audioPath": "/audio/collocations/col-hsk1-mai-1.mp3"
    },
    {
      "hanzi": "买东西",
      "pinyin": "mǎi dōngxi",
      "german": "Sachen einkaufen",
      "audioPath": "/audio/collocations/col-hsk1-mai-2.mp3"
    },
    {
      "hanzi": "去买菜",
      "pinyin": "qù mǎi cài",
      "german": "Lebensmittel einkaufen gehen",
      "audioPath": "/audio/collocations/col-hsk1-mai-3.mp3"
    }
  ],
  "hsk1-mai-sell": [
    {
      "hanzi": "卖东西",
      "pinyin": "mài dōngxi",
      "german": "Sachen verkaufen",
      "audioPath": "/audio/collocations/col-hsk1-mai-sell-1.mp3"
    },
    {
      "hanzi": "卖出",
      "pinyin": "mài chū",
      "german": "verkaufen (Ergebnis)",
      "audioPath": "/audio/collocations/col-hsk1-mai-sell-2.mp3"
    }
  ],
  "hsk1-mama": [
    {
      "hanzi": "我妈妈",
      "pinyin": "wǒ māma",
      "german": "meine Mutter",
      "audioPath": "/audio/collocations/col-hsk1-mama-1.mp3"
    },
    {
      "hanzi": "妈妈做的菜",
      "pinyin": "māma zuò de cài",
      "german": "das von Mama gekochte Essen",
      "audioPath": "/audio/collocations/col-hsk1-mama-2.mp3"
    },
    {
      "hanzi": "爱妈妈",
      "pinyin": "ài māma",
      "german": "Mama lieb haben",
      "audioPath": "/audio/collocations/col-hsk1-mama-3.mp3"
    }
  ],
  "hsk1-mang": [
    {
      "hanzi": "很忙",
      "pinyin": "hěn máng",
      "german": "sehr beschäftigt",
      "audioPath": "/audio/collocations/col-hsk1-mang-1.mp3"
    },
    {
      "hanzi": "忙什么",
      "pinyin": "máng shénme",
      "german": "womit beschäftigt?",
      "audioPath": "/audio/collocations/col-hsk1-mang-2.mp3"
    }
  ],
  "hsk1-mao": [
    {
      "hanzi": "大猫",
      "pinyin": "dà māo",
      "german": "große Katze",
      "audioPath": "/audio/collocations/col-hsk1-mao-1.mp3"
    },
    {
      "hanzi": "小猫",
      "pinyin": "xiǎo māo",
      "german": "Kätzchen / kleine Katze",
      "audioPath": "/audio/collocations/col-hsk1-mao-2.mp3"
    },
    {
      "hanzi": "两只猫",
      "pinyin": "liǎng zhī māo",
      "german": "zwei Katzen",
      "audioPath": "/audio/collocations/col-hsk1-mao-3.mp3"
    }
  ],
  "hsk1-mei": [
    {
      "hanzi": "没有",
      "pinyin": "méiyǒu",
      "german": "nicht haben / es gibt nicht",
      "audioPath": "/audio/collocations/col-hsk1-mei-1.mp3"
    },
    {
      "hanzi": "没去",
      "pinyin": "méi qù",
      "german": "nicht gegangen sein",
      "audioPath": "/audio/collocations/col-hsk1-mei-2.mp3"
    },
    {
      "hanzi": "没看",
      "pinyin": "méi kàn",
      "german": "nicht gesehen / nicht gelesen",
      "audioPath": "/audio/collocations/col-hsk1-mei-3.mp3"
    }
  ],
  "hsk1-meiguanxi": [
    {
      "hanzi": "真的没关系",
      "pinyin": "zhēn de méi guānxi",
      "german": "wirklich kein Problem",
      "audioPath": "/audio/collocations/col-hsk1-meiguanxi-1.mp3"
    },
    {
      "hanzi": "没关系不用谢",
      "pinyin": "méi guānxi bú yòng xiè",
      "german": "kein Problem, keine Ursache",
      "audioPath": "/audio/collocations/col-hsk1-meiguanxi-2.mp3"
    },
    {
      "hanzi": "一切没关系",
      "pinyin": "yíqiè méi guānxi",
      "german": "alles in bester Ordnung",
      "audioPath": "/audio/collocations/col-hsk1-meiguanxi-3.mp3"
    }
  ],
  "hsk1-meimei": [
    {
      "hanzi": "我妹妹",
      "pinyin": "wǒ mèimei",
      "german": "meine jüngere Schwester",
      "audioPath": "/audio/collocations/col-hsk1-meimei-1.mp3"
    },
    {
      "hanzi": "弟弟和妹妹",
      "pinyin": "dìdi hé mèimei",
      "german": "Geschwister",
      "audioPath": "/audio/collocations/col-hsk1-meimei-2.mp3"
    }
  ],
  "hsk1-meishi": [
    {
      "hanzi": "你没事吧",
      "pinyin": "nǐ méishi ba",
      "german": "ist alles in Ordnung?",
      "audioPath": "/audio/collocations/col-hsk1-meishi-1.mp3"
    },
    {
      "hanzi": "没事儿",
      "pinyin": "méishìr",
      "german": "kein Problem (lockerer)",
      "audioPath": "/audio/collocations/col-hsk1-meishi-2.mp3"
    }
  ],
  "hsk1-meiyou": [
    {
      "hanzi": "没有钱",
      "pinyin": "méiyǒu qián",
      "german": "kein Geld haben",
      "audioPath": "/audio/collocations/col-hsk1-meiyou-1.mp3"
    },
    {
      "hanzi": "没有人",
      "pinyin": "méiyǒu rén",
      "german": "niemand da",
      "audioPath": "/audio/collocations/col-hsk1-meiyou-2.mp3"
    },
    {
      "hanzi": "没有时间",
      "pinyin": "méiyǒu shíjiān",
      "german": "keine Zeit haben",
      "audioPath": "/audio/collocations/col-hsk1-meiyou-3.mp3"
    }
  ],
  "hsk1-men": [
    {
      "hanzi": "我们",
      "pinyin": "wǒmen",
      "german": "wir",
      "audioPath": "/audio/collocations/col-hsk1-men-1.mp3"
    },
    {
      "hanzi": "他们",
      "pinyin": "tāmen",
      "german": "sie",
      "audioPath": "/audio/collocations/col-hsk1-men-2.mp3"
    },
    {
      "hanzi": "孩子们",
      "pinyin": "háizi men",
      "german": "die Kinder",
      "audioPath": "/audio/collocations/col-hsk1-men-3.mp3"
    }
  ],
  "hsk1-mianbao": [
    {
      "hanzi": "吃面包",
      "pinyin": "chī miànbāo",
      "german": "Brot essen",
      "audioPath": "/audio/collocations/col-hsk1-mianbao-1.mp3"
    },
    {
      "hanzi": "一块面包",
      "pinyin": "yí kuài miànbāo",
      "german": "ein Stück Brot",
      "audioPath": "/audio/collocations/col-hsk1-mianbao-2.mp3"
    }
  ],
  "hsk1-miantiaoer": [
    {
      "hanzi": "吃面条儿",
      "pinyin": "chī miàntiáor",
      "german": "Nudeln essen",
      "audioPath": "/audio/collocations/col-hsk1-miantiaoer-1.mp3"
    },
    {
      "hanzi": "一碗面条儿",
      "pinyin": "yì wǎn miàntiáor",
      "german": "eine Schale Nudeln",
      "audioPath": "/audio/collocations/col-hsk1-miantiaoer-2.mp3"
    }
  ],
  "hsk1-mifan": [
    {
      "hanzi": "吃米饭",
      "pinyin": "chī mǐfàn",
      "german": "Reis essen",
      "audioPath": "/audio/collocations/col-hsk1-mifan-1.mp3"
    },
    {
      "hanzi": "一碗米饭",
      "pinyin": "yì wǎn mǐfàn",
      "german": "eine Schüssel Reis",
      "audioPath": "/audio/collocations/col-hsk1-mifan-2.mp3"
    },
    {
      "hanzi": "做米饭",
      "pinyin": "zuò mǐfàn",
      "german": "Reis kochen",
      "audioPath": "/audio/collocations/col-hsk1-mifan-3.mp3"
    }
  ],
  "hsk1-mingnian": [
    {
      "hanzi": "明年",
      "pinyin": "míngnián",
      "german": "nächstes Jahr",
      "audioPath": "/audio/collocations/col-hsk1-mingnian-1.mp3"
    },
    {
      "hanzi": "明年春天",
      "pinyin": "míngnián chūntiān",
      "german": "Frühling nächsten Jahres",
      "audioPath": "/audio/collocations/col-hsk1-mingnian-2.mp3"
    }
  ],
  "hsk1-mingtian": [
    {
      "hanzi": "明天见",
      "pinyin": "míngtiān jiàn",
      "german": "bis morgen",
      "audioPath": "/audio/collocations/col-hsk1-mingtian-1.mp3"
    },
    {
      "hanzi": "明天上午",
      "pinyin": "míngtiān shàngwǔ",
      "german": "morgen Vormittag",
      "audioPath": "/audio/collocations/col-hsk1-mingtian-2.mp3"
    },
    {
      "hanzi": "明天下午",
      "pinyin": "míngtiān xiàwǔ",
      "german": "morgen Nachmittag",
      "audioPath": "/audio/collocations/col-hsk1-mingtian-3.mp3"
    }
  ],
  "hsk1-mingzi": [
    {
      "hanzi": "叫什么名字",
      "pinyin": "jiào shénme míngzi",
      "german": "wie heißt du mit Namen?",
      "audioPath": "/audio/collocations/col-hsk1-mingzi-1.mp3"
    },
    {
      "hanzi": "中国名字",
      "pinyin": "Zhōngguó míngzi",
      "german": "chinesischer Name",
      "audioPath": "/audio/collocations/col-hsk1-mingzi-2.mp3"
    },
    {
      "hanzi": "写名字",
      "pinyin": "xiě míngzi",
      "german": "den Namen schreiben",
      "audioPath": "/audio/collocations/col-hsk1-mingzi-3.mp3"
    }
  ],
  "hsk1-na": [
    {
      "hanzi": "那个人",
      "pinyin": "nà ge rén",
      "german": "jener Mensch",
      "audioPath": "/audio/collocations/col-hsk1-na-1.mp3"
    },
    {
      "hanzi": "那些",
      "pinyin": "nàxiē",
      "german": "jene dort (Plural)",
      "audioPath": "/audio/collocations/col-hsk1-na-2.mp3"
    },
    {
      "hanzi": "那是",
      "pinyin": "nà shì",
      "german": "das dort ist",
      "audioPath": "/audio/collocations/col-hsk1-na-3.mp3"
    }
  ],
  "hsk1-na-which": [
    {
      "hanzi": "哪个人",
      "pinyin": "nǎ ge rén",
      "german": "welcher Mensch?",
      "audioPath": "/audio/collocations/col-hsk1-na-which-1.mp3"
    },
    {
      "hanzi": "哪个学校",
      "pinyin": "nǎ ge xuéxiào",
      "german": "welche Schule?",
      "audioPath": "/audio/collocations/col-hsk1-na-which-2.mp3"
    },
    {
      "hanzi": "哪年",
      "pinyin": "nǎ nián",
      "german": "welches Jahr?",
      "audioPath": "/audio/collocations/col-hsk1-na-which-3.mp3"
    }
  ],
  "hsk1-nabian": [
    {
      "hanzi": "在那边",
      "pinyin": "zài nàbiān",
      "german": "dort drüben",
      "audioPath": "/audio/collocations/col-hsk1-nabian-1.mp3"
    },
    {
      "hanzi": "那边有人",
      "pinyin": "nàbiān yǒu rén",
      "german": "dort drüben ist jemand",
      "audioPath": "/audio/collocations/col-hsk1-nabian-2.mp3"
    }
  ],
  "hsk1-naer": [
    {
      "hanzi": "在那儿",
      "pinyin": "zài nàr",
      "german": "dort sein",
      "audioPath": "/audio/collocations/col-hsk1-naer-1.mp3"
    },
    {
      "hanzi": "去那儿",
      "pinyin": "qù nàr",
      "german": "dorthin gehen",
      "audioPath": "/audio/collocations/col-hsk1-naer-2.mp3"
    },
    {
      "hanzi": "看那儿",
      "pinyin": "kàn nàr",
      "german": "schau dorthin",
      "audioPath": "/audio/collocations/col-hsk1-naer-3.mp3"
    }
  ],
  "hsk1-naer-which": [
    {
      "hanzi": "在哪儿",
      "pinyin": "zài nǎr",
      "german": "wo befindet sich...?",
      "audioPath": "/audio/collocations/col-hsk1-naer-which-1.mp3"
    },
    {
      "hanzi": "去哪儿",
      "pinyin": "qù nǎr",
      "german": "wohin gehst du?",
      "audioPath": "/audio/collocations/col-hsk1-naer-which-2.mp3"
    },
    {
      "hanzi": "从哪儿来",
      "pinyin": "cóng nǎr lái",
      "german": "woher kommst du?",
      "audioPath": "/audio/collocations/col-hsk1-naer-which-3.mp3"
    }
  ],
  "hsk1-nage": [
    {
      "hanzi": "哪个好",
      "pinyin": "nǎge hǎo",
      "german": "welches ist besser?",
      "audioPath": "/audio/collocations/col-hsk1-nage-1.mp3"
    },
    {
      "hanzi": "哪个是你的",
      "pinyin": "nǎge shì nǐ de",
      "german": "welches ist deins?",
      "audioPath": "/audio/collocations/col-hsk1-nage-2.mp3"
    }
  ],
  "hsk1-nage-that": [
    {
      "hanzi": "那个人",
      "pinyin": "nà ge rén",
      "german": "jene Person",
      "audioPath": "/audio/collocations/col-hsk1-nage-that-1.mp3"
    },
    {
      "hanzi": "那个问题",
      "pinyin": "nà ge wèntí",
      "german": "jene Frage",
      "audioPath": "/audio/collocations/col-hsk1-nage-that-2.mp3"
    }
  ],
  "hsk1-nali": [
    {
      "hanzi": "在哪里",
      "pinyin": "zài nǎlǐ",
      "german": "wo ist",
      "audioPath": "/audio/collocations/col-hsk1-nali-1.mp3"
    },
    {
      "hanzi": "你从哪里来",
      "pinyin": "nǐ cóng nǎlǐ lái",
      "german": "woher kommst du?",
      "audioPath": "/audio/collocations/col-hsk1-nali-2.mp3"
    }
  ],
  "hsk1-nali-there": [
    {
      "hanzi": "在那里",
      "pinyin": "zài nàlǐ",
      "german": "dort",
      "audioPath": "/audio/collocations/col-hsk1-nali-there-1.mp3"
    },
    {
      "hanzi": "从那里来",
      "pinyin": "cóng nàlǐ lái",
      "german": "von dort kommen",
      "audioPath": "/audio/collocations/col-hsk1-nali-there-2.mp3"
    }
  ],
  "hsk1-nan": [
    {
      "hanzi": "男生",
      "pinyin": "nánshēng",
      "german": "Junge, Schüler",
      "audioPath": "/audio/collocations/col-hsk1-nan-1.mp3"
    },
    {
      "hanzi": "男同学",
      "pinyin": "nán tóngxué",
      "german": "männlicher Mitschüler",
      "audioPath": "/audio/collocations/col-hsk1-nan-2.mp3"
    }
  ],
  "hsk1-nanpengyou": [
    {
      "hanzi": "我男朋友",
      "pinyin": "wǒ nánpéngyou",
      "german": "mein Freund",
      "audioPath": "/audio/collocations/col-hsk1-nanpengyou-1.mp3"
    },
    {
      "hanzi": "她有男朋友",
      "pinyin": "tā yǒu nánpéngyou",
      "german": "sie hat einen Freund",
      "audioPath": "/audio/collocations/col-hsk1-nanpengyou-2.mp3"
    }
  ],
  "hsk1-naxie": [
    {
      "hanzi": "哪些水果",
      "pinyin": "nǎxiē shuǐguǒ",
      "german": "welche Früchte",
      "audioPath": "/audio/collocations/col-hsk1-naxie-1.mp3"
    },
    {
      "hanzi": "你有哪些书",
      "pinyin": "nǐ yǒu nǎxiē shū",
      "german": "welche Bücher hast du?",
      "audioPath": "/audio/collocations/col-hsk1-naxie-2.mp3"
    }
  ],
  "hsk1-naxie-those": [
    {
      "hanzi": "那些书",
      "pinyin": "nàxiē shū",
      "german": "jene Bücher",
      "audioPath": "/audio/collocations/col-hsk1-naxie-those-1.mp3"
    },
    {
      "hanzi": "那些人的",
      "pinyin": "nàxiē rén de",
      "german": "von jenen Leuten",
      "audioPath": "/audio/collocations/col-hsk1-naxie-those-2.mp3"
    }
  ],
  "hsk1-ne": [
    {
      "hanzi": "你呢",
      "pinyin": "nǐ ne",
      "german": "und du?",
      "audioPath": "/audio/collocations/col-hsk1-ne-1.mp3"
    },
    {
      "hanzi": "书呢",
      "pinyin": "shū ne",
      "german": "wo ist das Buch?",
      "audioPath": "/audio/collocations/col-hsk1-ne-2.mp3"
    },
    {
      "hanzi": "妈妈呢",
      "pinyin": "māma ne",
      "german": "und wo ist Mama?",
      "audioPath": "/audio/collocations/col-hsk1-ne-3.mp3"
    }
  ],
  "hsk1-neng": [
    {
      "hanzi": "能不能",
      "pinyin": "néng bu néng",
      "german": "können oder nicht?",
      "audioPath": "/audio/collocations/col-hsk1-neng-1.mp3"
    },
    {
      "hanzi": "能去",
      "pinyin": "néng qù",
      "german": "hingehen können",
      "audioPath": "/audio/collocations/col-hsk1-neng-2.mp3"
    },
    {
      "hanzi": "能来吗",
      "pinyin": "néng lái ma",
      "german": "kannst du kommen?",
      "audioPath": "/audio/collocations/col-hsk1-neng-3.mp3"
    }
  ],
  "hsk1-ni": [
    {
      "hanzi": "你们",
      "pinyin": "nǐmen",
      "german": "ihr",
      "audioPath": "/audio/collocations/col-hsk1-ni-1.mp3"
    },
    {
      "hanzi": "你的",
      "pinyin": "nǐ de",
      "german": "dein / deine",
      "audioPath": "/audio/collocations/col-hsk1-ni-2.mp3"
    },
    {
      "hanzi": "你家",
      "pinyin": "nǐ jiā",
      "german": "deine Familie / dein Zuhause",
      "audioPath": "/audio/collocations/col-hsk1-ni-3.mp3"
    }
  ],
  "hsk1-nian": [
    {
      "hanzi": "今年",
      "pinyin": "jīnnián",
      "german": "dieses Jahr",
      "audioPath": "/audio/collocations/col-hsk1-nian-1.mp3"
    },
    {
      "hanzi": "去年",
      "pinyin": "qùnián",
      "german": "letztes Jahr",
      "audioPath": "/audio/collocations/col-hsk1-nian-2.mp3"
    },
    {
      "hanzi": "明年",
      "pinyin": "míngnián",
      "german": "nächstes Jahr",
      "audioPath": "/audio/collocations/col-hsk1-nian-3.mp3"
    }
  ],
  "hsk1-nihao": [
    {
      "hanzi": "您好",
      "pinyin": "nín hǎo",
      "german": "Guten Tag (höflich)",
      "audioPath": "/audio/collocations/col-hsk1-nihao-1.mp3"
    },
    {
      "hanzi": "你们好",
      "pinyin": "nǐmen hǎo",
      "german": "Hallo zusammen",
      "audioPath": "/audio/collocations/col-hsk1-nihao-2.mp3"
    },
    {
      "hanzi": "你好吗",
      "pinyin": "nǐ hǎo ma",
      "german": "Wie geht es dir?",
      "audioPath": "/audio/collocations/col-hsk1-nihao-3.mp3"
    }
  ],
  "hsk1-nimen": [
    {
      "hanzi": "你们好",
      "pinyin": "nǐmen hǎo",
      "german": "hallo (zu mehreren)",
      "audioPath": "/audio/collocations/col-hsk1-nimen-1.mp3"
    },
    {
      "hanzi": "你们想吃什么",
      "pinyin": "nǐmen xiǎng chī shénme",
      "german": "was möchtet ihr essen?",
      "audioPath": "/audio/collocations/col-hsk1-nimen-2.mp3"
    }
  ],
  "hsk1-nin": [
    {
      "hanzi": "您好",
      "pinyin": "nín hǎo",
      "german": "Guten Tag (höflich)",
      "audioPath": "/audio/collocations/col-hsk1-nin-1.mp3"
    },
    {
      "hanzi": "请问您",
      "pinyin": "qǐngwèn nín",
      "german": "darf ich Sie fragen",
      "audioPath": "/audio/collocations/col-hsk1-nin-2.mp3"
    },
    {
      "hanzi": "您的",
      "pinyin": "nín de",
      "german": "Ihr / Ihre (höflich)",
      "audioPath": "/audio/collocations/col-hsk1-nin-3.mp3"
    }
  ],
  "hsk1-niunai": [
    {
      "hanzi": "喝牛奶",
      "pinyin": "hē niúnǎi",
      "german": "Milch trinken",
      "audioPath": "/audio/collocations/col-hsk1-niunai-1.mp3"
    },
    {
      "hanzi": "一杯牛奶",
      "pinyin": "yì bēi niúnǎi",
      "german": "ein Glas Milch",
      "audioPath": "/audio/collocations/col-hsk1-niunai-2.mp3"
    }
  ],
  "hsk1-nv": [
    {
      "hanzi": "女生",
      "pinyin": "nǚshēng",
      "german": "Schülerin",
      "audioPath": "/audio/collocations/col-hsk1-nv-1.mp3"
    },
    {
      "hanzi": "女同学",
      "pinyin": "nǚ tóngxué",
      "german": "männliche Mitschülerin",
      "audioPath": "/audio/collocations/col-hsk1-nv-2.mp3"
    }
  ],
  "hsk1-nver": [
    {
      "hanzi": "我女儿",
      "pinyin": "wǒ nǚ'ér",
      "german": "meine Tochter",
      "audioPath": "/audio/collocations/col-hsk1-nver-1.mp3"
    },
    {
      "hanzi": "小女儿",
      "pinyin": "xiǎo nǚ'ér",
      "german": "jüngste Tochter",
      "audioPath": "/audio/collocations/col-hsk1-nver-2.mp3"
    },
    {
      "hanzi": "漂亮女儿",
      "pinyin": "piàoliang nǚ'ér",
      "german": "hübsche Tochter",
      "audioPath": "/audio/collocations/col-hsk1-nver-3.mp3"
    }
  ],
  "hsk1-nvpengyou": [
    {
      "hanzi": "我女朋友",
      "pinyin": "wǒ nǚpéngyou",
      "german": "meine Freundin",
      "audioPath": "/audio/collocations/col-hsk1-nvpengyou-1.mp3"
    },
    {
      "hanzi": "他找女朋友",
      "pinyin": "tā zhǎo nǚpéngyou",
      "german": "er sucht eine Freundin",
      "audioPath": "/audio/collocations/col-hsk1-nvpengyou-2.mp3"
    }
  ],
  "hsk1-nvshi": [
    {
      "hanzi": "女士优先",
      "pinyin": "nǚshì yōuxiān",
      "german": "Damen zuerst",
      "audioPath": "/audio/collocations/col-hsk1-nvshi-1.mp3"
    },
    {
      "hanzi": "一位女士",
      "pinyin": "yí wèi nǚshì",
      "german": "eine Dame",
      "audioPath": "/audio/collocations/col-hsk1-nvshi-2.mp3"
    }
  ],
  "hsk1-pengyou": [
    {
      "hanzi": "好朋友",
      "pinyin": "hǎo péngyou",
      "german": "guter Freund",
      "audioPath": "/audio/collocations/col-hsk1-pengyou-1.mp3"
    },
    {
      "hanzi": "老朋友",
      "pinyin": "lǎo péngyou",
      "german": "alter Freund",
      "audioPath": "/audio/collocations/col-hsk1-pengyou-2.mp3"
    },
    {
      "hanzi": "新朋友",
      "pinyin": "xīn péngyou",
      "german": "neuer Freund",
      "audioPath": "/audio/collocations/col-hsk1-pengyou-3.mp3"
    }
  ],
  "hsk1-pianyi": [
    {
      "hanzi": "很便宜",
      "pinyin": "hěn piányi",
      "german": "sehr billig",
      "audioPath": "/audio/collocations/col-hsk1-pianyi-1.mp3"
    },
    {
      "hanzi": "便宜一点",
      "pinyin": "piányi yìdiǎn",
      "german": "etwas billiger",
      "audioPath": "/audio/collocations/col-hsk1-pianyi-2.mp3"
    }
  ],
  "hsk1-piaoliang": [
    {
      "hanzi": "很漂亮",
      "pinyin": "hěn piàoliang",
      "german": "sehr schön / sehr hübsch",
      "audioPath": "/audio/collocations/col-hsk1-piaoliang-1.mp3"
    },
    {
      "hanzi": "漂亮衣服",
      "pinyin": "piàoliang yīfu",
      "german": "hübsche Kleidung",
      "audioPath": "/audio/collocations/col-hsk1-piaoliang-2.mp3"
    },
    {
      "hanzi": "真漂亮",
      "pinyin": "zhēn piàoliang",
      "german": "wirklich wunderschön",
      "audioPath": "/audio/collocations/col-hsk1-piaoliang-3.mp3"
    }
  ],
  "hsk1-pingguo": [
    {
      "hanzi": "吃苹果",
      "pinyin": "chī píngguǒ",
      "german": "Apfel essen",
      "audioPath": "/audio/collocations/col-hsk1-pingguo-1.mp3"
    },
    {
      "hanzi": "买苹果",
      "pinyin": "mǎi píngguǒ",
      "german": "Äpfel kaufen",
      "audioPath": "/audio/collocations/col-hsk1-pingguo-2.mp3"
    },
    {
      "hanzi": "大苹果",
      "pinyin": "dà píngguǒ",
      "german": "großer Apfel",
      "audioPath": "/audio/collocations/col-hsk1-pingguo-3.mp3"
    }
  ],
  "hsk1-qi": [
    {
      "hanzi": "七个",
      "pinyin": "qī ge",
      "german": "sieben Stück",
      "audioPath": "/audio/collocations/col-hsk1-qi-1.mp3"
    },
    {
      "hanzi": "七月",
      "pinyin": "qīyuè",
      "german": "Juli",
      "audioPath": "/audio/collocations/col-hsk1-qi-2.mp3"
    },
    {
      "hanzi": "七点",
      "pinyin": "qī diǎn",
      "german": "sieben Uhr",
      "audioPath": "/audio/collocations/col-hsk1-qi-3.mp3"
    }
  ],
  "hsk1-qian": [
    {
      "hanzi": "多少钱",
      "pinyin": "duōshao qián",
      "german": "wie viel kostet das?",
      "audioPath": "/audio/collocations/col-hsk1-qian-1.mp3"
    },
    {
      "hanzi": "付钱",
      "pinyin": "fù qián",
      "german": "Geld bezahlen",
      "audioPath": "/audio/collocations/col-hsk1-qian-2.mp3"
    },
    {
      "hanzi": "很有钱",
      "pinyin": "hěn yǒu qián",
      "german": "sehr reich sein",
      "audioPath": "/audio/collocations/col-hsk1-qian-3.mp3"
    }
  ],
  "hsk1-qian-front": [
    {
      "hanzi": "前面",
      "pinyin": "qiánmiàn",
      "german": "vorne",
      "audioPath": "/audio/collocations/col-hsk1-qian-front-1.mp3"
    },
    {
      "hanzi": "以前",
      "pinyin": "yǐqián",
      "german": "früher, previously",
      "audioPath": "/audio/collocations/col-hsk1-qian-front-2.mp3"
    }
  ],
  "hsk1-qian-thousand": [
    {
      "hanzi": "一千",
      "pinyin": "yì qiān",
      "german": "eintausend",
      "audioPath": "/audio/collocations/col-hsk1-qian-thousand-1.mp3"
    },
    {
      "hanzi": "几千",
      "pinyin": "jǐ qiān",
      "german": "ein paar Tausend",
      "audioPath": "/audio/collocations/col-hsk1-qian-thousand-2.mp3"
    }
  ],
  "hsk1-qianmian": [
    {
      "hanzi": "在前面",
      "pinyin": "zài qiánmian",
      "german": "vorne sein",
      "audioPath": "/audio/collocations/col-hsk1-qianmian-1.mp3"
    },
    {
      "hanzi": "学校前面",
      "pinyin": "xuéxiào qiánmian",
      "german": "vor der Schule",
      "audioPath": "/audio/collocations/col-hsk1-qianmian-2.mp3"
    },
    {
      "hanzi": "向前走",
      "pinyin": "xiàng qián zǒu",
      "german": "nach vorne gehen",
      "audioPath": "/audio/collocations/col-hsk1-qianmian-3.mp3"
    }
  ],
  "hsk1-qichuang": [
    {
      "hanzi": "早上起床",
      "pinyin": "zǎoshang qǐchuáng",
      "german": "morgens aufstehen",
      "audioPath": "/audio/collocations/col-hsk1-qichuang-1.mp3"
    },
    {
      "hanzi": "起床时间",
      "pinyin": "qǐchuáng shíjiān",
      "german": "Aufstehzeit",
      "audioPath": "/audio/collocations/col-hsk1-qichuang-2.mp3"
    }
  ],
  "hsk1-qing": [
    {
      "hanzi": "请坐",
      "pinyin": "qǐng zuò",
      "german": "bitte setzen Sie sich",
      "audioPath": "/audio/collocations/col-hsk1-qing-1.mp3"
    },
    {
      "hanzi": "请喝茶",
      "pinyin": "qǐng hē chá",
      "german": "bitte trinken Sie Tee",
      "audioPath": "/audio/collocations/col-hsk1-qing-2.mp3"
    },
    {
      "hanzi": "请进",
      "pinyin": "qǐng jìn",
      "german": "bitte herein",
      "audioPath": "/audio/collocations/col-hsk1-qing-3.mp3"
    }
  ],
  "hsk1-qingwen": [
    {
      "hanzi": "请问老师",
      "pinyin": "qǐngwèn lǎoshī",
      "german": "Fragen Sie bitte den Lehrer",
      "audioPath": "/audio/collocations/col-hsk1-qingwen-1.mp3"
    },
    {
      "hanzi": "请问路",
      "pinyin": "qǐngwèn lù",
      "german": "nach dem Weg fragen",
      "audioPath": "/audio/collocations/col-hsk1-qingwen-2.mp3"
    }
  ],
  "hsk1-qu": [
    {
      "hanzi": "去学校",
      "pinyin": "qù xuéxiào",
      "german": "zur Schule gehen",
      "audioPath": "/audio/collocations/col-hsk1-qu-1.mp3"
    },
    {
      "hanzi": "去中国",
      "pinyin": "qù Zhōngguó",
      "german": "nach China reisen",
      "audioPath": "/audio/collocations/col-hsk1-qu-2.mp3"
    },
    {
      "hanzi": "去商店",
      "pinyin": "qù shāngdiàn",
      "german": "ins Geschäft gehen",
      "audioPath": "/audio/collocations/col-hsk1-qu-3.mp3"
    }
  ],
  "hsk1-qunian": [
    {
      "hanzi": "去年",
      "pinyin": "qùnián",
      "german": "letztes Jahr",
      "audioPath": "/audio/collocations/col-hsk1-qunian-1.mp3"
    },
    {
      "hanzi": "去年年底",
      "pinyin": "qùnián niándǐ",
      "german": "Ende letzten Jahres",
      "audioPath": "/audio/collocations/col-hsk1-qunian-2.mp3"
    }
  ],
  "hsk1-re": [
    {
      "hanzi": "很热",
      "pinyin": "hěn rè",
      "german": "sehr heiß",
      "audioPath": "/audio/collocations/col-hsk1-re-1.mp3"
    },
    {
      "hanzi": "热水",
      "pinyin": "rè shuǐ",
      "german": "heißes Wasser",
      "audioPath": "/audio/collocations/col-hsk1-re-2.mp3"
    },
    {
      "hanzi": "太热了",
      "pinyin": "tài rè le",
      "german": "viel zu heiß",
      "audioPath": "/audio/collocations/col-hsk1-re-3.mp3"
    }
  ],
  "hsk1-ren": [
    {
      "hanzi": "中国人",
      "pinyin": "Zhōngguó rén",
      "german": "Chinese / Chinesin",
      "audioPath": "/audio/collocations/col-hsk1-ren-1.mp3"
    },
    {
      "hanzi": "大家",
      "pinyin": "dàjiā",
      "german": "alle zusammen",
      "audioPath": "/audio/collocations/col-hsk1-ren-2.mp3"
    },
    {
      "hanzi": "大人",
      "pinyin": "dàrén",
      "german": "Erwachsener",
      "audioPath": "/audio/collocations/col-hsk1-ren-3.mp3"
    }
  ],
  "hsk1-renshi": [
    {
      "hanzi": "认识你很高兴",
      "pinyin": "rènshi nǐ hěn gāoxìng",
      "german": "sehr erfreut, dich kennenzulernen",
      "audioPath": "/audio/collocations/col-hsk1-renshi-1.mp3"
    },
    {
      "hanzi": "互相认识",
      "pinyin": "hùxiāng rènshi",
      "german": "sich gegenseitig kennen",
      "audioPath": "/audio/collocations/col-hsk1-renshi-2.mp3"
    },
    {
      "hanzi": "不认识",
      "pinyin": "bú rènshi",
      "german": "nicht kennen",
      "audioPath": "/audio/collocations/col-hsk1-renshi-3.mp3"
    }
  ],
  "hsk1-ri": [
    {
      "hanzi": "生日",
      "pinyin": "shēngrì",
      "german": "Geburtstag",
      "audioPath": "/audio/collocations/col-hsk1-ri-1.mp3"
    },
    {
      "hanzi": "今天几日",
      "pinyin": "jīntiān jǐ rì",
      "german": "der wievielte Tag ist heute",
      "audioPath": "/audio/collocations/col-hsk1-ri-2.mp3"
    },
    {
      "hanzi": "日月",
      "pinyin": "rì yuè",
      "german": "Sonne und Mond",
      "audioPath": "/audio/collocations/col-hsk1-ri-3.mp3"
    }
  ],
  "hsk1-san": [
    {
      "hanzi": "三个",
      "pinyin": "sān ge",
      "german": "drei Stück",
      "audioPath": "/audio/collocations/col-hsk1-san-1.mp3"
    },
    {
      "hanzi": "三月",
      "pinyin": "sānyuè",
      "german": "März",
      "audioPath": "/audio/collocations/col-hsk1-san-2.mp3"
    },
    {
      "hanzi": "三点",
      "pinyin": "sān diǎn",
      "german": "drei Uhr",
      "audioPath": "/audio/collocations/col-hsk1-san-3.mp3"
    }
  ],
  "hsk1-shang": [
    {
      "hanzi": "上班",
      "pinyin": "shàng bān",
      "german": "zur Arbeit gehen",
      "audioPath": "/audio/collocations/col-hsk1-shang-1.mp3"
    },
    {
      "hanzi": "上车",
      "pinyin": "shàng chē",
      "german": "einsteigen (ins Auto/den Bus)",
      "audioPath": "/audio/collocations/col-hsk1-shang-2.mp3"
    },
    {
      "hanzi": "上课",
      "pinyin": "shàng kè",
      "german": "Unterricht haben",
      "audioPath": "/audio/collocations/col-hsk1-shang-3.mp3"
    }
  ],
  "hsk1-shangban": [
    {
      "hanzi": "去上班",
      "pinyin": "qù shàngbān",
      "german": "zur Arbeit gehen",
      "audioPath": "/audio/collocations/col-hsk1-shangban-1.mp3"
    },
    {
      "hanzi": "上班时间",
      "pinyin": "shàngbān shíjiān",
      "german": "Arbeitszeit",
      "audioPath": "/audio/collocations/col-hsk1-shangban-2.mp3"
    }
  ],
  "hsk1-shangdian": [
    {
      "hanzi": "买东西",
      "pinyin": "mǎi dōngxi",
      "german": "einkaufen gehen",
      "audioPath": "/audio/collocations/col-hsk1-shangdian-1.mp3"
    },
    {
      "hanzi": "饭店",
      "pinyin": "fàndiàn",
      "german": "Restaurant / Gaststätte",
      "audioPath": "/audio/collocations/col-hsk1-shangdian-2.mp3"
    }
  ],
  "hsk1-shangke": [
    {
      "hanzi": "去上课",
      "pinyin": "qù shàngkè",
      "german": "zum Unterricht gehen",
      "audioPath": "/audio/collocations/col-hsk1-shangke-1.mp3"
    },
    {
      "hanzi": "上课的时候",
      "pinyin": "shàngkè de shíhou",
      "german": "während des Unterrichts",
      "audioPath": "/audio/collocations/col-hsk1-shangke-2.mp3"
    }
  ],
  "hsk1-shangwu": [
    {
      "hanzi": "今天上午",
      "pinyin": "jīntiān shàngwǔ",
      "german": "heute Vormittag",
      "audioPath": "/audio/collocations/col-hsk1-shangwu-1.mp3"
    },
    {
      "hanzi": "上午八点",
      "pinyin": "shàngwǔ bā diǎn",
      "german": "acht Uhr morgens",
      "audioPath": "/audio/collocations/col-hsk1-shangwu-2.mp3"
    },
    {
      "hanzi": "星期一上午",
      "pinyin": "xīngqīyī shàngwǔ",
      "german": "Montagvormittag",
      "audioPath": "/audio/collocations/col-hsk1-shangwu-3.mp3"
    }
  ],
  "hsk1-shangxue": [
    {
      "hanzi": "去上学",
      "pinyin": "qù shàngxué",
      "german": "zur Schule gehen",
      "audioPath": "/audio/collocations/col-hsk1-shangxue-1.mp3"
    },
    {
      "hanzi": "上学路上",
      "pinyin": "shàngxué lùshang",
      "german": "auf dem Weg zur Schule",
      "audioPath": "/audio/collocations/col-hsk1-shangxue-2.mp3"
    }
  ],
  "hsk1-shao": [
    {
      "hanzi": "很少",
      "pinyin": "hěn shǎo",
      "german": "sehr wenig / selten",
      "audioPath": "/audio/collocations/col-hsk1-shao-1.mp3"
    },
    {
      "hanzi": "不少",
      "pinyin": "bù shǎo",
      "german": "nicht wenige / ziemlich viele",
      "audioPath": "/audio/collocations/col-hsk1-shao-2.mp3"
    },
    {
      "hanzi": "少吃一点",
      "pinyin": "shǎo chī yìdiǎn",
      "german": "etwas weniger essen",
      "audioPath": "/audio/collocations/col-hsk1-shao-3.mp3"
    }
  ],
  "hsk1-shei": [
    {
      "hanzi": "谁的",
      "pinyin": "shéi de",
      "german": "wessen?",
      "audioPath": "/audio/collocations/col-hsk1-shei-1.mp3"
    },
    {
      "hanzi": "是谁",
      "pinyin": "shì shéi",
      "german": "wer ist das?",
      "audioPath": "/audio/collocations/col-hsk1-shei-2.mp3"
    },
    {
      "hanzi": "他是谁",
      "pinyin": "tā shì shéi",
      "german": "wer ist er?",
      "audioPath": "/audio/collocations/col-hsk1-shei-3.mp3"
    }
  ],
  "hsk1-shengbing": [
    {
      "hanzi": "生病了",
      "pinyin": "shēngbìng le",
      "german": "krank geworden",
      "audioPath": "/audio/collocations/col-hsk1-shengbing-1.mp3"
    },
    {
      "hanzi": "生病在家",
      "pinyin": "shēngbìng zài jiā",
      "german": "krank zu Hause",
      "audioPath": "/audio/collocations/col-hsk1-shengbing-2.mp3"
    }
  ],
  "hsk1-shenme": [
    {
      "hanzi": "什么人",
      "pinyin": "shénme rén",
      "german": "welche Art von Person / wer?",
      "audioPath": "/audio/collocations/col-hsk1-shenme-1.mp3"
    },
    {
      "hanzi": "看什么",
      "pinyin": "kàn shénme",
      "german": "was schaust du an?",
      "audioPath": "/audio/collocations/col-hsk1-shenme-2.mp3"
    },
    {
      "hanzi": "做什么",
      "pinyin": "zuò shénme",
      "german": "was tust du?",
      "audioPath": "/audio/collocations/col-hsk1-shenme-3.mp3"
    }
  ],
  "hsk1-shi": [
    {
      "hanzi": "十个",
      "pinyin": "shí ge",
      "german": "zehn Stück",
      "audioPath": "/audio/collocations/col-hsk1-shi-1.mp3"
    },
    {
      "hanzi": "十点",
      "pinyin": "shí diǎn",
      "german": "zehn Uhr",
      "audioPath": "/audio/collocations/col-hsk1-shi-2.mp3"
    },
    {
      "hanzi": "十五",
      "pinyin": "shíwǔ",
      "german": "fünfzehn",
      "audioPath": "/audio/collocations/col-hsk1-shi-3.mp3"
    }
  ],
  "hsk1-shi-be": [
    {
      "hanzi": "是的",
      "pinyin": "shì de",
      "german": "ja / genau so ist es",
      "audioPath": "/audio/collocations/col-hsk1-shi-be-1.mp3"
    },
    {
      "hanzi": "不是",
      "pinyin": "bú shì",
      "german": "ist nicht",
      "audioPath": "/audio/collocations/col-hsk1-shi-be-2.mp3"
    },
    {
      "hanzi": "是谁",
      "pinyin": "shì shéi",
      "german": "wer ist das?",
      "audioPath": "/audio/collocations/col-hsk1-shi-be-3.mp3"
    }
  ],
  "hsk1-shi-thing": [
    {
      "hanzi": "什么事",
      "pinyin": "shénme shì",
      "german": "was ist los?",
      "audioPath": "/audio/collocations/col-hsk1-shi-thing-1.mp3"
    },
    {
      "hanzi": "事情",
      "pinyin": "shìqing",
      "german": "Sache, Angelegenheit",
      "audioPath": "/audio/collocations/col-hsk1-shi-thing-2.mp3"
    }
  ],
  "hsk1-shihou": [
    {
      "hanzi": "什么时候",
      "pinyin": "shénme shíhou",
      "german": "wann? / zu welcher Zeit?",
      "audioPath": "/audio/collocations/col-hsk1-shihou-1.mp3"
    },
    {
      "hanzi": "这个时候",
      "pinyin": "zhè ge shíhou",
      "german": "in diesem Moment",
      "audioPath": "/audio/collocations/col-hsk1-shihou-2.mp3"
    },
    {
      "hanzi": "学习的时候",
      "pinyin": "xuéxí de shíhou",
      "german": "während des Lernens",
      "audioPath": "/audio/collocations/col-hsk1-shihou-3.mp3"
    }
  ],
  "hsk1-shijian": [
    {
      "hanzi": "有时间",
      "pinyin": "yǒu shíjiān",
      "german": "Zeit haben",
      "audioPath": "/audio/collocations/col-hsk1-shijian-1.mp3"
    },
    {
      "hanzi": "没时间",
      "pinyin": "méi shíjiān",
      "german": "keine Zeit haben",
      "audioPath": "/audio/collocations/col-hsk1-shijian-2.mp3"
    },
    {
      "hanzi": "什么时间",
      "pinyin": "shénme shíjiān",
      "german": "zu welcher Zeit?",
      "audioPath": "/audio/collocations/col-hsk1-shijian-3.mp3"
    }
  ],
  "hsk1-shouji": [
    {
      "hanzi": "我的手机",
      "pinyin": "wǒ de shǒujī",
      "german": "mein Handy",
      "audioPath": "/audio/collocations/col-hsk1-shouji-1.mp3"
    },
    {
      "hanzi": "手机号码",
      "pinyin": "shǒujī hàomǎ",
      "german": "Handynummer",
      "audioPath": "/audio/collocations/col-hsk1-shouji-2.mp3"
    }
  ],
  "hsk1-shu": [
    {
      "hanzi": "看书",
      "pinyin": "kàn shū",
      "german": "ein Buch lesen",
      "audioPath": "/audio/collocations/col-hsk1-shu-1.mp3"
    },
    {
      "hanzi": "买书",
      "pinyin": "mǎi shū",
      "german": "Bücher kaufen",
      "audioPath": "/audio/collocations/col-hsk1-shu-2.mp3"
    },
    {
      "hanzi": "汉语书",
      "pinyin": "Hànyǔ shū",
      "german": "Chinesischbuch",
      "audioPath": "/audio/collocations/col-hsk1-shu-3.mp3"
    }
  ],
  "hsk1-shudian": [
    {
      "hanzi": "去书店",
      "pinyin": "qù shūdiàn",
      "german": "in die Buchhandlung gehen",
      "audioPath": "/audio/collocations/col-hsk1-shudian-1.mp3"
    },
    {
      "hanzi": "新书店",
      "pinyin": "xīn shūdiàn",
      "german": "neue Buchhandlung",
      "audioPath": "/audio/collocations/col-hsk1-shudian-2.mp3"
    }
  ],
  "hsk1-shui": [
    {
      "hanzi": "喝水",
      "pinyin": "hē shuǐ",
      "german": "Wasser trinken",
      "audioPath": "/audio/collocations/col-hsk1-shui-1.mp3"
    },
    {
      "hanzi": "水果",
      "pinyin": "shuǐguǒ",
      "german": "Früchte / Obst",
      "audioPath": "/audio/collocations/col-hsk1-shui-2.mp3"
    },
    {
      "hanzi": "开水",
      "pinyin": "kāishuǐ",
      "german": "abgekochtes Wasser",
      "audioPath": "/audio/collocations/col-hsk1-shui-3.mp3"
    }
  ],
  "hsk1-shui-sleep": [
    {
      "hanzi": "睡觉",
      "pinyin": "shuìjiào",
      "german": "schlafen",
      "audioPath": "/audio/collocations/col-hsk1-shui-sleep-1.mp3"
    },
    {
      "hanzi": "睡得很香",
      "pinyin": "shuì de hěn xiāng",
      "german": "sehr fest schlafen",
      "audioPath": "/audio/collocations/col-hsk1-shui-sleep-2.mp3"
    }
  ],
  "hsk1-shuiguo": [
    {
      "hanzi": "买水果",
      "pinyin": "mǎi shuǐguǒ",
      "german": "Obst kaufen",
      "audioPath": "/audio/collocations/col-hsk1-shuiguo-1.mp3"
    },
    {
      "hanzi": "吃水果",
      "pinyin": "chī shuǐguǒ",
      "german": "Obst essen",
      "audioPath": "/audio/collocations/col-hsk1-shuiguo-2.mp3"
    },
    {
      "hanzi": "新鲜水果",
      "pinyin": "xīnxiān shuǐguǒ",
      "german": "frische Früchte",
      "audioPath": "/audio/collocations/col-hsk1-shuiguo-3.mp3"
    }
  ],
  "hsk1-shuijiao": [
    {
      "hanzi": "去睡觉",
      "pinyin": "qù shuìjiào",
      "german": "schlafen gehen",
      "audioPath": "/audio/collocations/col-hsk1-shuijiao-1.mp3"
    },
    {
      "hanzi": "想睡觉",
      "pinyin": "xiǎng shuìjiào",
      "german": "müde sein / schlafen wollen",
      "audioPath": "/audio/collocations/col-hsk1-shuijiao-2.mp3"
    },
    {
      "hanzi": "好好睡觉",
      "pinyin": "hǎohǎo shuìjiào",
      "german": "gut und tief schlafen",
      "audioPath": "/audio/collocations/col-hsk1-shuijiao-3.mp3"
    }
  ],
  "hsk1-shuo": [
    {
      "hanzi": "说话",
      "pinyin": "shuō huà",
      "german": "sprechen / sich unterhalten",
      "audioPath": "/audio/collocations/col-hsk1-shuo-1.mp3"
    },
    {
      "hanzi": "说汉语",
      "pinyin": "shuō Hànyǔ",
      "german": "Chinesisch sprechen",
      "audioPath": "/audio/collocations/col-hsk1-shuo-2.mp3"
    },
    {
      "hanzi": "说好",
      "pinyin": "shuō hǎo",
      "german": "vereinbaren / zusagen",
      "audioPath": "/audio/collocations/col-hsk1-shuo-3.mp3"
    }
  ],
  "hsk1-shuohua": [
    {
      "hanzi": "别说话",
      "pinyin": "bié shuōhuà",
      "german": "nicht sprechen / still sein",
      "audioPath": "/audio/collocations/col-hsk1-shuohua-1.mp3"
    },
    {
      "hanzi": "大声说话",
      "pinyin": "dà shēng shuōhuà",
      "german": "laut sprechen",
      "audioPath": "/audio/collocations/col-hsk1-shuohua-2.mp3"
    },
    {
      "hanzi": "跟我说话",
      "pinyin": "gēn wǒ shuōhuà",
      "german": "mit mir sprechen",
      "audioPath": "/audio/collocations/col-hsk1-shuohua-3.mp3"
    }
  ],
  "hsk1-si": [
    {
      "hanzi": "四个",
      "pinyin": "sì ge",
      "german": "vier Stück",
      "audioPath": "/audio/collocations/col-hsk1-si-1.mp3"
    },
    {
      "hanzi": "四月",
      "pinyin": "sìyuè",
      "german": "April",
      "audioPath": "/audio/collocations/col-hsk1-si-2.mp3"
    },
    {
      "hanzi": "四点",
      "pinyin": "sì diǎn",
      "german": "vier Uhr",
      "audioPath": "/audio/collocations/col-hsk1-si-3.mp3"
    }
  ],
  "hsk1-sui": [
    {
      "hanzi": "几岁",
      "pinyin": "jǐ suì",
      "german": "wie alt? (für Kinder)",
      "audioPath": "/audio/collocations/col-hsk1-sui-1.mp3"
    },
    {
      "hanzi": "十八岁",
      "pinyin": "shíbā suì",
      "german": "achtzehn Jahre alt",
      "audioPath": "/audio/collocations/col-hsk1-sui-2.mp3"
    },
    {
      "hanzi": "岁数",
      "pinyin": "suìshu",
      "german": "Lebensalter",
      "audioPath": "/audio/collocations/col-hsk1-sui-3.mp3"
    }
  ],
  "hsk1-ta": [
    {
      "hanzi": "他们",
      "pinyin": "tāmen",
      "german": "sie (Plural)",
      "audioPath": "/audio/collocations/col-hsk1-ta-1.mp3"
    },
    {
      "hanzi": "他的",
      "pinyin": "tā de",
      "german": "sein / seine",
      "audioPath": "/audio/collocations/col-hsk1-ta-2.mp3"
    },
    {
      "hanzi": "他好吗",
      "pinyin": "tā hǎo ma",
      "german": "geht es ihm gut?",
      "audioPath": "/audio/collocations/col-hsk1-ta-3.mp3"
    }
  ],
  "hsk1-ta-it": [
    {
      "hanzi": "它们",
      "pinyin": "tāmen",
      "german": "sie (Dinge)",
      "audioPath": "/audio/collocations/col-hsk1-ta-it-1.mp3"
    },
    {
      "hanzi": "它很可爱",
      "pinyin": "tā hěn kě’ài",
      "german": "es ist süß",
      "audioPath": "/audio/collocations/col-hsk1-ta-it-2.mp3"
    }
  ],
  "hsk1-ta-nv": [
    {
      "hanzi": "她们",
      "pinyin": "tāmen",
      "german": "sie (Frauen, Plural)",
      "audioPath": "/audio/collocations/col-hsk1-ta-nv-1.mp3"
    },
    {
      "hanzi": "她的",
      "pinyin": "tā de",
      "german": "ihr / ihre",
      "audioPath": "/audio/collocations/col-hsk1-ta-nv-2.mp3"
    },
    {
      "hanzi": "她是谁",
      "pinyin": "tā shì shéi",
      "german": "wer ist sie?",
      "audioPath": "/audio/collocations/col-hsk1-ta-nv-3.mp3"
    }
  ],
  "hsk1-tai": [
    {
      "hanzi": "太好了",
      "pinyin": "tài hǎo le",
      "german": "ausgezeichnet! / super!",
      "audioPath": "/audio/collocations/col-hsk1-tai-1.mp3"
    },
    {
      "hanzi": "太大了",
      "pinyin": "tài dà le",
      "german": "viel zu groß",
      "audioPath": "/audio/collocations/col-hsk1-tai-2.mp3"
    },
    {
      "hanzi": "不太热",
      "pinyin": "bú tài rè",
      "german": "nicht allzu heiß",
      "audioPath": "/audio/collocations/col-hsk1-tai-3.mp3"
    }
  ],
  "hsk1-tamen": [
    {
      "hanzi": "他们家",
      "pinyin": "tāmen jiā",
      "german": "ihre Familie",
      "audioPath": "/audio/collocations/col-hsk1-tamen-1.mp3"
    },
    {
      "hanzi": "他们的",
      "pinyin": "tāmen de",
      "german": "ihr / ihre (Plural)",
      "audioPath": "/audio/collocations/col-hsk1-tamen-2.mp3"
    },
    {
      "hanzi": "他们都",
      "pinyin": "tāmen dōu",
      "german": "sie alle",
      "audioPath": "/audio/collocations/col-hsk1-tamen-3.mp3"
    }
  ],
  "hsk1-tamen-they-female": [
    {
      "hanzi": "她们是学生",
      "pinyin": "tāmen shì xuésheng",
      "german": "sie sind Schülerinnen",
      "audioPath": "/audio/collocations/col-hsk1-tamen-they-female-1.mp3"
    },
    {
      "hanzi": "她们都在",
      "pinyin": "tāmen dōu zài",
      "german": "sie sind alle da",
      "audioPath": "/audio/collocations/col-hsk1-tamen-they-female-2.mp3"
    }
  ],
  "hsk1-tamen-they-things": [
    {
      "hanzi": "它们都在",
      "pinyin": "tāmen dōu zài",
      "german": "sie sind alle da",
      "audioPath": "/audio/collocations/col-hsk1-tamen-they-things-1.mp3"
    },
    {
      "hanzi": "它们很小",
      "pinyin": "tāmen hěn xiǎo",
      "german": "sie sind klein",
      "audioPath": "/audio/collocations/col-hsk1-tamen-they-things-2.mp3"
    }
  ],
  "hsk1-tian-day": [
    {
      "hanzi": "今天",
      "pinyin": "jīntiān",
      "german": "heute",
      "audioPath": "/audio/collocations/col-hsk1-tian-day-1.mp3"
    },
    {
      "hanzi": "天气",
      "pinyin": "tiānqì",
      "german": "Wetter",
      "audioPath": "/audio/collocations/col-hsk1-tian-day-2.mp3"
    },
    {
      "hanzi": "一天",
      "pinyin": "yì tiān",
      "german": "ein Tag",
      "audioPath": "/audio/collocations/col-hsk1-tian-day-3.mp3"
    }
  ],
  "hsk1-tianqi": [
    {
      "hanzi": "今天",
      "pinyin": "jīntiān",
      "german": "heute",
      "audioPath": "/audio/collocations/col-hsk1-tianqi-1.mp3"
    },
    {
      "hanzi": "明天",
      "pinyin": "míngtiān",
      "german": "morgen",
      "audioPath": "/audio/collocations/col-hsk1-tianqi-2.mp3"
    },
    {
      "hanzi": "昨天",
      "pinyin": "zuótiān",
      "german": "gestern",
      "audioPath": "/audio/collocations/col-hsk1-tianqi-3.mp3"
    },
    {
      "hanzi": "星期天",
      "pinyin": "xīngqītiān",
      "german": "Sonntag",
      "audioPath": "/audio/collocations/col-hsk1-tianqi-4.mp3"
    }
  ],
  "hsk1-ting": [
    {
      "hanzi": "听音乐",
      "pinyin": "tīng yīnyuè",
      "german": "Musik hören",
      "audioPath": "/audio/collocations/col-hsk1-ting-1.mp3"
    },
    {
      "hanzi": "听我说",
      "pinyin": "tīng wǒ shuō",
      "german": "hör mir zu",
      "audioPath": "/audio/collocations/col-hsk1-ting-2.mp3"
    },
    {
      "hanzi": "听懂",
      "pinyin": "tīng dǒng",
      "german": "beim Hören verstehen",
      "audioPath": "/audio/collocations/col-hsk1-ting-3.mp3"
    }
  ],
  "hsk1-tingjian": [
    {
      "hanzi": "听见声音",
      "pinyin": "tīngjiàn shēngyīn",
      "german": "einen hören",
      "audioPath": "/audio/collocations/col-hsk1-tingjian-1.mp3"
    },
    {
      "hanzi": "你听见了吗",
      "pinyin": "nǐ tīngjiàn le ma",
      "german": "hast du gehört?",
      "audioPath": "/audio/collocations/col-hsk1-tingjian-2.mp3"
    }
  ],
  "hsk1-tongxue": [
    {
      "hanzi": "老同学",
      "pinyin": "lǎo tóngxué",
      "german": "alter Mitschüler / alter Freund",
      "audioPath": "/audio/collocations/col-hsk1-tongxue-1.mp3"
    },
    {
      "hanzi": "男同学",
      "pinyin": "nán tóngxué",
      "german": "Mitschüler",
      "audioPath": "/audio/collocations/col-hsk1-tongxue-2.mp3"
    },
    {
      "hanzi": "女同学",
      "pinyin": "nǚ tóngxué",
      "german": "Mitschülerin",
      "audioPath": "/audio/collocations/col-hsk1-tongxue-3.mp3"
    }
  ],
  "hsk1-wai-outside": [
    {
      "hanzi": "外面",
      "pinyin": "wàimiàn",
      "german": "draußen",
      "audioPath": "/audio/collocations/col-hsk1-wai-outside-1.mp3"
    },
    {
      "hanzi": "外边",
      "pinyin": "wàibian",
      "german": "draußen",
      "audioPath": "/audio/collocations/col-hsk1-wai-outside-2.mp3"
    },
    {
      "hanzi": "外国",
      "pinyin": "wàiguó",
      "german": "Ausland",
      "audioPath": "/audio/collocations/col-hsk1-wai-outside-3.mp3"
    }
  ],
  "hsk1-waibian": [
    {
      "hanzi": "在外边",
      "pinyin": "zài wàibian",
      "german": "draußen",
      "audioPath": "/audio/collocations/col-hsk1-waibian-1.mp3"
    },
    {
      "hanzi": "外边很冷",
      "pinyin": "wàibian hěn lěng",
      "german": "draußen ist es kalt",
      "audioPath": "/audio/collocations/col-hsk1-waibian-2.mp3"
    }
  ],
  "hsk1-wan-evening": [
    {
      "hanzi": "晚上",
      "pinyin": "wǎnshang",
      "german": "abends",
      "audioPath": "/audio/collocations/col-hsk1-wan-evening-1.mp3"
    },
    {
      "hanzi": "很晚",
      "pinyin": "hěn wǎn",
      "german": "sehr spät",
      "audioPath": "/audio/collocations/col-hsk1-wan-evening-2.mp3"
    }
  ],
  "hsk1-wan-play": [
    {
      "hanzi": "玩耍",
      "pinyin": "wánshuǎ",
      "german": "spielen",
      "audioPath": "/audio/collocations/col-hsk1-wan-play-1.mp3"
    },
    {
      "hanzi": "出去玩",
      "pinyin": "chūqù wán",
      "german": "ausgehen und spielen",
      "audioPath": "/audio/collocations/col-hsk1-wan-play-2.mp3"
    },
    {
      "hanzi": "好玩",
      "pinyin": "hǎowán",
      "german": "lustig",
      "audioPath": "/audio/collocations/col-hsk1-wan-play-3.mp3"
    }
  ],
  "hsk1-wanfan": [
    {
      "hanzi": "吃晚饭",
      "pinyin": "chī wǎnfàn",
      "german": "Abendessen essen",
      "audioPath": "/audio/collocations/col-hsk1-wanfan-1.mp3"
    },
    {
      "hanzi": "晚饭吃什么",
      "pinyin": "wǎnfàn chī shénme",
      "german": "was gibt es zum Abendessen?",
      "audioPath": "/audio/collocations/col-hsk1-wanfan-2.mp3"
    }
  ],
  "hsk1-wanshang": [
    {
      "hanzi": "晚上七点",
      "pinyin": "wǎnshang qī diǎn",
      "german": "abends um sieben",
      "audioPath": "/audio/collocations/col-hsk1-wanshang-1.mp3"
    },
    {
      "hanzi": "晚上好",
      "pinyin": "wǎnshang hǎo",
      "german": "Guten Abend",
      "audioPath": "/audio/collocations/col-hsk1-wanshang-2.mp3"
    }
  ],
  "hsk1-wei": [
    {
      "hanzi": "喂，你好",
      "pinyin": "wèi, nǐ hǎo",
      "german": "Hallo! (am Telefon)",
      "audioPath": "/audio/collocations/col-hsk1-wei-1.mp3"
    },
    {
      "hanzi": "喂，请问",
      "pinyin": "wèi, qǐngwèn",
      "german": "Hallo, darf ich fragen...",
      "audioPath": "/audio/collocations/col-hsk1-wei-2.mp3"
    },
    {
      "hanzi": "喂，是谁",
      "pinyin": "wèi, shì shéi",
      "german": "Hallo, wer ist am Apparat?",
      "audioPath": "/audio/collocations/col-hsk1-wei-3.mp3"
    }
  ],
  "hsk1-wen-ask": [
    {
      "hanzi": "问问题",
      "pinyin": "wèn wèntí",
      "german": "eine Frage stellen",
      "audioPath": "/audio/collocations/col-hsk1-wen-ask-1.mp3"
    },
    {
      "hanzi": "问路",
      "pinyin": "wèn lù",
      "german": "nach dem Weg fragen",
      "audioPath": "/audio/collocations/col-hsk1-wen-ask-2.mp3"
    }
  ],
  "hsk1-wenti": [
    {
      "hanzi": "没有问题",
      "pinyin": "méiyǒu wèntí",
      "german": "kein Problem",
      "audioPath": "/audio/collocations/col-hsk1-wenti-1.mp3"
    },
    {
      "hanzi": "回答问题",
      "pinyin": "huídá wèntí",
      "german": "eine Frage beantworten",
      "audioPath": "/audio/collocations/col-hsk1-wenti-2.mp3"
    }
  ],
  "hsk1-wo": [
    {
      "hanzi": "我们",
      "pinyin": "wǒmen",
      "german": "wir",
      "audioPath": "/audio/collocations/col-hsk1-wo-1.mp3"
    },
    {
      "hanzi": "我的",
      "pinyin": "wǒ de",
      "german": "mein / meine",
      "audioPath": "/audio/collocations/col-hsk1-wo-2.mp3"
    },
    {
      "hanzi": "我家",
      "pinyin": "wǒ jiā",
      "german": "meine Familie / mein Zuhause",
      "audioPath": "/audio/collocations/col-hsk1-wo-3.mp3"
    }
  ],
  "hsk1-women": [
    {
      "hanzi": "我们家",
      "pinyin": "wǒmen jiā",
      "german": "unsere Familie",
      "audioPath": "/audio/collocations/col-hsk1-women-1.mp3"
    },
    {
      "hanzi": "我们的",
      "pinyin": "wǒmen de",
      "german": "unser / unsere",
      "audioPath": "/audio/collocations/col-hsk1-women-2.mp3"
    },
    {
      "hanzi": "我们走",
      "pinyin": "wǒmen zǒu",
      "german": "lass uns gehen",
      "audioPath": "/audio/collocations/col-hsk1-women-3.mp3"
    }
  ],
  "hsk1-wu": [
    {
      "hanzi": "五个",
      "pinyin": "wǔ ge",
      "german": "fünf Stück",
      "audioPath": "/audio/collocations/col-hsk1-wu-1.mp3"
    },
    {
      "hanzi": "五月",
      "pinyin": "wǔyuè",
      "german": "Mai",
      "audioPath": "/audio/collocations/col-hsk1-wu-2.mp3"
    },
    {
      "hanzi": "五十",
      "pinyin": "wǔshí",
      "german": "fünfzig",
      "audioPath": "/audio/collocations/col-hsk1-wu-3.mp3"
    }
  ],
  "hsk1-wufan": [
    {
      "hanzi": "吃午饭",
      "pinyin": "chī wǔfàn",
      "german": "Mittagessen essen",
      "audioPath": "/audio/collocations/col-hsk1-wufan-1.mp3"
    },
    {
      "hanzi": "午饭时间",
      "pinyin": "wǔfàn shíjiān",
      "german": "Mittagszeit",
      "audioPath": "/audio/collocations/col-hsk1-wufan-2.mp3"
    }
  ],
  "hsk1-xia": [
    {
      "hanzi": "下班",
      "pinyin": "xià bān",
      "german": "Feierabend machen",
      "audioPath": "/audio/collocations/col-hsk1-xia-1.mp3"
    },
    {
      "hanzi": "下车",
      "pinyin": "xià chē",
      "german": "aussteigen (aus dem Fahrzeug)",
      "audioPath": "/audio/collocations/col-hsk1-xia-2.mp3"
    },
    {
      "hanzi": "下课",
      "pinyin": "xià kè",
      "german": "Unterrichtsende",
      "audioPath": "/audio/collocations/col-hsk1-xia-3.mp3"
    }
  ],
  "hsk1-xiaban": [
    {
      "hanzi": "下班回家",
      "pinyin": "xiàbān huí jiā",
      "german": "nach der Arbeit nach Hause gehen",
      "audioPath": "/audio/collocations/col-hsk1-xiaban-1.mp3"
    },
    {
      "hanzi": "几点下班",
      "pinyin": "jǐ diǎn xiàbān",
      "german": "wann ist Feierabend?",
      "audioPath": "/audio/collocations/col-hsk1-xiaban-2.mp3"
    }
  ],
  "hsk1-xiake": [
    {
      "hanzi": "下课了",
      "pinyin": "xiàkè le",
      "german": "die Stunde ist vorbei",
      "audioPath": "/audio/collocations/col-hsk1-xiake-1.mp3"
    },
    {
      "hanzi": "下课以后",
      "pinyin": "xiàkè yǐhòu",
      "german": "nach dem Unterricht",
      "audioPath": "/audio/collocations/col-hsk1-xiake-2.mp3"
    }
  ],
  "hsk1-xiang": [
    {
      "hanzi": "想吃",
      "pinyin": "xiǎng chī",
      "german": "essen möchten",
      "audioPath": "/audio/collocations/col-hsk1-xiang-1.mp3"
    },
    {
      "hanzi": "想家",
      "pinyin": "xiǎng jiā",
      "german": "Heimweh haben",
      "audioPath": "/audio/collocations/col-hsk1-xiang-2.mp3"
    },
    {
      "hanzi": "很想你",
      "pinyin": "hěn xiǎng nǐ",
      "german": "dich sehr vermissen",
      "audioPath": "/audio/collocations/col-hsk1-xiang-3.mp3"
    }
  ],
  "hsk1-xiansheng": [
    {
      "hanzi": "李先生",
      "pinyin": "Lǐ xiānsheng",
      "german": "Herr Li",
      "audioPath": "/audio/collocations/col-hsk1-xiansheng-1.mp3"
    },
    {
      "hanzi": "先生你好",
      "pinyin": "xiānsheng nǐ hǎo",
      "german": "Guten Tag, der Herr",
      "audioPath": "/audio/collocations/col-hsk1-xiansheng-2.mp3"
    },
    {
      "hanzi": "我先生",
      "pinyin": "wǒ xiānsheng",
      "german": "mein Ehemann",
      "audioPath": "/audio/collocations/col-hsk1-xiansheng-3.mp3"
    }
  ],
  "hsk1-xianzai": [
    {
      "hanzi": "现在几点",
      "pinyin": "xiànzài jǐ diǎn",
      "german": "wie spät ist es jetzt?",
      "audioPath": "/audio/collocations/col-hsk1-xianzai-1.mp3"
    },
    {
      "hanzi": "现在去",
      "pinyin": "xiànzài qù",
      "german": "jetzt gehen",
      "audioPath": "/audio/collocations/col-hsk1-xianzai-2.mp3"
    },
    {
      "hanzi": "现在开始",
      "pinyin": "xiànzài kāishǐ",
      "german": "jetzt beginnen",
      "audioPath": "/audio/collocations/col-hsk1-xianzai-3.mp3"
    }
  ],
  "hsk1-xiao": [
    {
      "hanzi": "小孩",
      "pinyin": "xiǎohái",
      "german": "Kind / Kleinkind",
      "audioPath": "/audio/collocations/col-hsk1-xiao-1.mp3"
    },
    {
      "hanzi": "小学",
      "pinyin": "xiǎoxué",
      "german": "Grundschule",
      "audioPath": "/audio/collocations/col-hsk1-xiao-2.mp3"
    },
    {
      "hanzi": "小时",
      "pinyin": "xiǎoshí",
      "german": "Stunde (Zeitdauer)",
      "audioPath": "/audio/collocations/col-hsk1-xiao-3.mp3"
    }
  ],
  "hsk1-xiaojie": [
    {
      "hanzi": "王小姐",
      "pinyin": "Wáng xiǎojie",
      "german": "Fräulein Wang",
      "audioPath": "/audio/collocations/col-hsk1-xiaojie-1.mp3"
    },
    {
      "hanzi": "张小姐",
      "pinyin": "Zhāng xiǎojie",
      "german": "Frau Zhang",
      "audioPath": "/audio/collocations/col-hsk1-xiaojie-2.mp3"
    },
    {
      "hanzi": "漂亮小姐",
      "pinyin": "piàoliang xiǎojie",
      "german": "hübsche junge Dame",
      "audioPath": "/audio/collocations/col-hsk1-xiaojie-3.mp3"
    }
  ],
  "hsk1-xiaopengyou": [
    {
      "hanzi": "小朋友，早上好",
      "pinyin": "xiǎopéngyǒu, zǎoshang hǎo",
      "german": "Kind, guten Morgen",
      "audioPath": "/audio/collocations/col-hsk1-xiaopengyou-1.mp3"
    },
    {
      "hanzi": "小朋友们",
      "pinyin": "xiǎopéngyǒu men",
      "german": "die Kinder",
      "audioPath": "/audio/collocations/col-hsk1-xiaopengyou-2.mp3"
    }
  ],
  "hsk1-xiaoshi": [
    {
      "hanzi": "一小时",
      "pinyin": "yí xiǎoshí",
      "german": "eine Stunde",
      "audioPath": "/audio/collocations/col-hsk1-xiaoshi-1.mp3"
    },
    {
      "hanzi": "二十四小时",
      "pinyin": "èrshísì xiǎoshí",
      "german": "24 Stunden",
      "audioPath": "/audio/collocations/col-hsk1-xiaoshi-2.mp3"
    }
  ],
  "hsk1-xiaoxue": [
    {
      "hanzi": "上小学",
      "pinyin": "shàng xiǎoxué",
      "german": "die Grundschule besuchen",
      "audioPath": "/audio/collocations/col-hsk1-xiaoxue-1.mp3"
    },
    {
      "hanzi": "小学老师",
      "pinyin": "xiǎoxué lǎoshī",
      "german": "Grundschullehrer",
      "audioPath": "/audio/collocations/col-hsk1-xiaoxue-2.mp3"
    }
  ],
  "hsk1-xiaoxuesheng": [
    {
      "hanzi": "一个小学生",
      "pinyin": "yí ge xiǎoxuéshēng",
      "german": "ein Grundschüler",
      "audioPath": "/audio/collocations/col-hsk1-xiaoxuesheng-1.mp3"
    },
    {
      "hanzi": "小学生的书包",
      "pinyin": "xiǎoxuéshēng de shūbāo",
      "german": "die Schultasche",
      "audioPath": "/audio/collocations/col-hsk1-xiaoxuesheng-2.mp3"
    }
  ],
  "hsk1-xiawu": [
    {
      "hanzi": "下午三点",
      "pinyin": "xiàwǔ sān diǎn",
      "german": "drei Uhr nachmittags",
      "audioPath": "/audio/collocations/col-hsk1-xiawu-1.mp3"
    },
    {
      "hanzi": "明天下午",
      "pinyin": "míngtiān xiàwǔ",
      "german": "morgen Nachmittag",
      "audioPath": "/audio/collocations/col-hsk1-xiawu-2.mp3"
    },
    {
      "hanzi": "下午好",
      "pinyin": "xiàwǔ hǎo",
      "german": "Guten Nachmittag",
      "audioPath": "/audio/collocations/col-hsk1-xiawu-3.mp3"
    }
  ],
  "hsk1-xiayu": [
    {
      "hanzi": "下大雨",
      "pinyin": "xià dà yǔ",
      "german": "stark regnen",
      "audioPath": "/audio/collocations/col-hsk1-xiayu-1.mp3"
    },
    {
      "hanzi": "下雨天",
      "pinyin": "xiàyǔ tiān",
      "german": "Regentag",
      "audioPath": "/audio/collocations/col-hsk1-xiayu-2.mp3"
    },
    {
      "hanzi": "开始下雨",
      "pinyin": "kāishǐ xiàyǔ",
      "german": "es fängt an zu regnen",
      "audioPath": "/audio/collocations/col-hsk1-xiayu-3.mp3"
    }
  ],
  "hsk1-xie": [
    {
      "hanzi": "这些",
      "pinyin": "zhèxiē",
      "german": "diese hier",
      "audioPath": "/audio/collocations/col-hsk1-xie-1.mp3"
    },
    {
      "hanzi": "那些",
      "pinyin": "nàxiē",
      "german": "jene dort",
      "audioPath": "/audio/collocations/col-hsk1-xie-2.mp3"
    },
    {
      "hanzi": "一些人",
      "pinyin": "yìxiē rén",
      "german": "einige Leute",
      "audioPath": "/audio/collocations/col-hsk1-xie-3.mp3"
    }
  ],
  "hsk1-xie-write": [
    {
      "hanzi": "写字",
      "pinyin": "xiě zì",
      "german": "Schriftzeichen schreiben",
      "audioPath": "/audio/collocations/col-hsk1-xie-write-1.mp3"
    },
    {
      "hanzi": "写汉字",
      "pinyin": "xiě Hànzì",
      "german": "Hanzi schreiben",
      "audioPath": "/audio/collocations/col-hsk1-xie-write-2.mp3"
    },
    {
      "hanzi": "写名字",
      "pinyin": "xiě míngzi",
      "german": "den Namen aufschreiben",
      "audioPath": "/audio/collocations/col-hsk1-xie-write-3.mp3"
    }
  ],
  "hsk1-xiexie": [
    {
      "hanzi": "多谢",
      "pinyin": "duō xiè",
      "german": "Vielen Dank",
      "audioPath": "/audio/collocations/col-hsk1-xiexie-1.mp3"
    },
    {
      "hanzi": "谢谢你",
      "pinyin": "xièxie nǐ",
      "german": "Danke dir",
      "audioPath": "/audio/collocations/col-hsk1-xiexie-2.mp3"
    },
    {
      "hanzi": "不客气",
      "pinyin": "bú kèqi",
      "german": "Gern geschehen (Antwort)",
      "audioPath": "/audio/collocations/col-hsk1-xiexie-3.mp3"
    }
  ],
  "hsk1-xihuan": [
    {
      "hanzi": "喜欢吃",
      "pinyin": "xǐhuan chī",
      "german": "gerne essen",
      "audioPath": "/audio/collocations/col-hsk1-xihuan-1.mp3"
    },
    {
      "hanzi": "喜欢喝茶",
      "pinyin": "xǐhuan hē chá",
      "german": "gerne Tee trinken",
      "audioPath": "/audio/collocations/col-hsk1-xihuan-2.mp3"
    },
    {
      "hanzi": "很喜欢",
      "pinyin": "hěn xǐhuan",
      "german": "sehr mögen",
      "audioPath": "/audio/collocations/col-hsk1-xihuan-3.mp3"
    }
  ],
  "hsk1-xin": [
    {
      "hanzi": "新的",
      "pinyin": "xīn de",
      "german": "neu",
      "audioPath": "/audio/collocations/col-hsk1-xin-1.mp3"
    },
    {
      "hanzi": "新年",
      "pinyin": "xīnnián",
      "german": "Neujahr",
      "audioPath": "/audio/collocations/col-hsk1-xin-2.mp3"
    },
    {
      "hanzi": "新朋友",
      "pinyin": "xīn péngyou",
      "german": "neuer Freund",
      "audioPath": "/audio/collocations/col-hsk1-xin-3.mp3"
    }
  ],
  "hsk1-xingqi": [
    {
      "hanzi": "星期一",
      "pinyin": "xīngqīyī",
      "german": "Montag",
      "audioPath": "/audio/collocations/col-hsk1-xingqi-1.mp3"
    },
    {
      "hanzi": "这个星期",
      "pinyin": "zhè ge xīngqī",
      "german": "diese Woche",
      "audioPath": "/audio/collocations/col-hsk1-xingqi-2.mp3"
    },
    {
      "hanzi": "下个星期",
      "pinyin": "xià ge xīngqī",
      "german": "nächste Woche",
      "audioPath": "/audio/collocations/col-hsk1-xingqi-3.mp3"
    }
  ],
  "hsk1-xingqiri": [
    {
      "hanzi": "星期日休息",
      "pinyin": "xīngqīrì xiūxi",
      "german": "Sonntag ist Ruhetag",
      "audioPath": "/audio/collocations/col-hsk1-xingqiri-1.mp3"
    },
    {
      "hanzi": "下个星期日",
      "pinyin": "xià ge xīngqīrì",
      "german": "nächsten Sonntag",
      "audioPath": "/audio/collocations/col-hsk1-xingqiri-2.mp3"
    }
  ],
  "hsk1-xingqitian": [
    {
      "hanzi": "星期天早上",
      "pinyin": "xīngqītiān zǎoshang",
      "german": "Sonntagmorgen",
      "audioPath": "/audio/collocations/col-hsk1-xingqitian-1.mp3"
    },
    {
      "hanzi": "过星期天",
      "pinyin": "guò xīngqītiān",
      "german": "den Sonntag verbringen",
      "audioPath": "/audio/collocations/col-hsk1-xingqitian-2.mp3"
    }
  ],
  "hsk1-xiuxi": [
    {
      "hanzi": "休息一下",
      "pinyin": "xiūxi yíxià",
      "german": "sich kurz ausruhen",
      "audioPath": "/audio/collocations/col-hsk1-xiuxi-1.mp3"
    },
    {
      "hanzi": "好好休息",
      "pinyin": "hǎohāor xiūxi",
      "german": "sich gut ausruhen",
      "audioPath": "/audio/collocations/col-hsk1-xiuxi-2.mp3"
    }
  ],
  "hsk1-xue-learn": [
    {
      "hanzi": "学习",
      "pinyin": "xuéxí",
      "german": "lernen",
      "audioPath": "/audio/collocations/col-hsk1-xue-learn-1.mp3"
    },
    {
      "hanzi": "学生",
      "pinyin": "xuésheng",
      "german": "Schüler",
      "audioPath": "/audio/collocations/col-hsk1-xue-learn-2.mp3"
    },
    {
      "hanzi": "学校",
      "pinyin": "xuéxiào",
      "german": "Schule",
      "audioPath": "/audio/collocations/col-hsk1-xue-learn-3.mp3"
    }
  ],
  "hsk1-xue-snow": [
    {
      "hanzi": "下雪",
      "pinyin": "xià xuě",
      "german": "Schnee fallen",
      "audioPath": "/audio/collocations/col-hsk1-xue-snow-1.mp3"
    },
    {
      "hanzi": "雪天",
      "pinyin": "xuětiān",
      "german": "Schneetag",
      "audioPath": "/audio/collocations/col-hsk1-xue-snow-2.mp3"
    }
  ],
  "hsk1-xuesheng": [
    {
      "hanzi": "好学生",
      "pinyin": "hǎo xuésheng",
      "german": "guter Schüler",
      "audioPath": "/audio/collocations/col-hsk1-xuesheng-1.mp3"
    },
    {
      "hanzi": "大学生",
      "pinyin": "dàxuéshēng",
      "german": "Student (an einer Hochschule)",
      "audioPath": "/audio/collocations/col-hsk1-xuesheng-2.mp3"
    },
    {
      "hanzi": "小学生",
      "pinyin": "xiǎoxuéshēng",
      "german": "Grundschüler",
      "audioPath": "/audio/collocations/col-hsk1-xuesheng-3.mp3"
    }
  ],
  "hsk1-xuexi": [
    {
      "hanzi": "学生",
      "pinyin": "xuésheng",
      "german": "Schüler / Student",
      "audioPath": "/audio/collocations/col-hsk1-xuexi-1.mp3"
    },
    {
      "hanzi": "学校",
      "pinyin": "xuéxiào",
      "german": "Schule",
      "audioPath": "/audio/collocations/col-hsk1-xuexi-2.mp3"
    },
    {
      "hanzi": "大学",
      "pinyin": "dàxué",
      "german": "Universität",
      "audioPath": "/audio/collocations/col-hsk1-xuexi-3.mp3"
    },
    {
      "hanzi": "同学",
      "pinyin": "tóngxué",
      "german": "Mitschüler",
      "audioPath": "/audio/collocations/col-hsk1-xuexi-4.mp3"
    }
  ],
  "hsk1-xuexiao": [
    {
      "hanzi": "去学校",
      "pinyin": "qù xuéxiào",
      "german": "zur Schule gehen",
      "audioPath": "/audio/collocations/col-hsk1-xuexiao-1.mp3"
    },
    {
      "hanzi": "在学校",
      "pinyin": "zài xuéxiào",
      "german": "in der Schule sein",
      "audioPath": "/audio/collocations/col-hsk1-xuexiao-2.mp3"
    },
    {
      "hanzi": "我们学校",
      "pinyin": "wǒmen xuéxiào",
      "german": "unsere Schule",
      "audioPath": "/audio/collocations/col-hsk1-xuexiao-3.mp3"
    }
  ],
  "hsk1-yao-want": [
    {
      "hanzi": "想要",
      "pinyin": "xiǎng yào",
      "german": "wollen",
      "audioPath": "/audio/collocations/col-hsk1-yao-want-1.mp3"
    },
    {
      "hanzi": "要喝水",
      "pinyin": "yào hē shuǐ",
      "german": "Durst haben",
      "audioPath": "/audio/collocations/col-hsk1-yao-want-2.mp3"
    },
    {
      "hanzi": "要是",
      "pinyin": "yàoshi",
      "german": "wenn",
      "audioPath": "/audio/collocations/col-hsk1-yao-want-3.mp3"
    }
  ],
  "hsk1-ye-also": [
    {
      "hanzi": "也是",
      "pinyin": "yě shì",
      "german": "auch sein / ebenfalls",
      "audioPath": "/audio/collocations/col-hsk1-ye-also-1.mp3"
    },
    {
      "hanzi": "我也去",
      "pinyin": "wǒ yě qù",
      "german": "ich gehe auch",
      "audioPath": "/audio/collocations/col-hsk1-ye-also-2.mp3"
    }
  ],
  "hsk1-yi": [
    {
      "hanzi": "一个人",
      "pinyin": "yí ge rén",
      "german": "eine Person / alleine",
      "audioPath": "/audio/collocations/col-hsk1-yi-1.mp3"
    },
    {
      "hanzi": "一起",
      "pinyin": "yìqǐ",
      "german": "zusammen / gemeinsam",
      "audioPath": "/audio/collocations/col-hsk1-yi-2.mp3"
    },
    {
      "hanzi": "一点儿",
      "pinyin": "yìdiǎnr",
      "german": "ein wenig / ein bisschen",
      "audioPath": "/audio/collocations/col-hsk1-yi-3.mp3"
    }
  ],
  "hsk1-yiban": [
    {
      "hanzi": "一半时间",
      "pinyin": "yíbàn shíjiān",
      "german": "die Hälfte der Zeit",
      "audioPath": "/audio/collocations/col-hsk1-yiban-1.mp3"
    },
    {
      "hanzi": "吃了一半",
      "pinyin": "chī le yíbàn",
      "german": "die Hälfte gegessen",
      "audioPath": "/audio/collocations/col-hsk1-yiban-2.mp3"
    }
  ],
  "hsk1-yidianer": [
    {
      "hanzi": "一点儿水",
      "pinyin": "yìdiǎnr shuǐ",
      "german": "ein wenig Wasser",
      "audioPath": "/audio/collocations/col-hsk1-yidianer-1.mp3"
    },
    {
      "hanzi": "一点儿时间",
      "pinyin": "yìdiǎnr shíjiān",
      "german": "ein wenig Zeit",
      "audioPath": "/audio/collocations/col-hsk1-yidianer-2.mp3"
    }
  ],
  "hsk1-yifu": [
    {
      "hanzi": "买衣服",
      "pinyin": "mǎi yīfu",
      "german": "Kleidung kaufen",
      "audioPath": "/audio/collocations/col-hsk1-yifu-1.mp3"
    },
    {
      "hanzi": "穿衣服",
      "pinyin": "chuān yīfu",
      "german": "Kleidung anziehen",
      "audioPath": "/audio/collocations/col-hsk1-yifu-2.mp3"
    },
    {
      "hanzi": "新衣服",
      "pinyin": "xīn yīfu",
      "german": "neue Kleidung",
      "audioPath": "/audio/collocations/col-hsk1-yifu-3.mp3"
    }
  ],
  "hsk1-yisheng": [
    {
      "hanzi": "看医生",
      "pinyin": "kàn yīshēng",
      "german": "zum Arzt gehen",
      "audioPath": "/audio/collocations/col-hsk1-yisheng-1.mp3"
    },
    {
      "hanzi": "好医生",
      "pinyin": "hǎo yīshēng",
      "german": "guter Arzt",
      "audioPath": "/audio/collocations/col-hsk1-yisheng-2.mp3"
    },
    {
      "hanzi": "大医院的医生",
      "pinyin": "dà yīyuàn de yīshēng",
      "german": "Arzt des großen Krankenhauses",
      "audioPath": "/audio/collocations/col-hsk1-yisheng-3.mp3"
    }
  ],
  "hsk1-yixia": [
    {
      "hanzi": "等一下",
      "pinyin": "děng yíxià",
      "german": "warte einen Moment",
      "audioPath": "/audio/collocations/col-hsk1-yixia-1.mp3"
    },
    {
      "hanzi": "说一下",
      "pinyin": "shuō yíxià",
      "german": "sagen Sie mal",
      "audioPath": "/audio/collocations/col-hsk1-yixia-2.mp3"
    }
  ],
  "hsk1-yixie": [
    {
      "hanzi": "一些书",
      "pinyin": "yìxiē shū",
      "german": "ein paar Bücher",
      "audioPath": "/audio/collocations/col-hsk1-yixie-1.mp3"
    },
    {
      "hanzi": "买一些",
      "pinyin": "mǎi yìxiē",
      "german": "ein paar kaufen",
      "audioPath": "/audio/collocations/col-hsk1-yixie-2.mp3"
    }
  ],
  "hsk1-yiyuan": [
    {
      "hanzi": "医生",
      "pinyin": "yīshēng",
      "german": "Arzt / Ärztin",
      "audioPath": "/audio/collocations/col-hsk1-yiyuan-1.mp3"
    },
    {
      "hanzi": "看医生",
      "pinyin": "kàn yīshēng",
      "german": "zum Arzt gehen",
      "audioPath": "/audio/collocations/col-hsk1-yiyuan-2.mp3"
    }
  ],
  "hsk1-yizi": [
    {
      "hanzi": "一把椅子",
      "pinyin": "yì bǎ yǐzi",
      "german": "ein Stuhl",
      "audioPath": "/audio/collocations/col-hsk1-yizi-1.mp3"
    },
    {
      "hanzi": "坐椅子",
      "pinyin": "zuò yǐzi",
      "german": "auf dem Stuhl sitzen",
      "audioPath": "/audio/collocations/col-hsk1-yizi-2.mp3"
    },
    {
      "hanzi": "大椅子",
      "pinyin": "dà yǐzi",
      "german": "großer Stuhl",
      "audioPath": "/audio/collocations/col-hsk1-yizi-3.mp3"
    }
  ],
  "hsk1-you": [
    {
      "hanzi": "有人",
      "pinyin": "yǒu rén",
      "german": "jemand ist da",
      "audioPath": "/audio/collocations/col-hsk1-you-1.mp3"
    },
    {
      "hanzi": "有钱",
      "pinyin": "yǒu qián",
      "german": "Geld haben / wohlhabend sein",
      "audioPath": "/audio/collocations/col-hsk1-you-2.mp3"
    },
    {
      "hanzi": "有时间",
      "pinyin": "yǒu shíjiān",
      "german": "Zeit haben",
      "audioPath": "/audio/collocations/col-hsk1-you-3.mp3"
    }
  ],
  "hsk1-youde": [
    {
      "hanzi": "有的人",
      "pinyin": "yǒu de rén",
      "german": "manche Leute",
      "audioPath": "/audio/collocations/col-hsk1-youde-1.mp3"
    },
    {
      "hanzi": "有的地方",
      "pinyin": "yǒu de dìfang",
      "german": "manche Orte",
      "audioPath": "/audio/collocations/col-hsk1-youde-2.mp3"
    }
  ],
  "hsk1-youdianer": [
    {
      "hanzi": "有点儿冷",
      "pinyin": "yǒudiǎnr lěng",
      "german": "es ist ein wenig kalt",
      "audioPath": "/audio/collocations/col-hsk1-youdianer-1.mp3"
    },
    {
      "hanzi": "有点儿累",
      "pinyin": "yǒudiǎnr lèi",
      "german": "ein wenig müde",
      "audioPath": "/audio/collocations/col-hsk1-youdianer-2.mp3"
    }
  ],
  "hsk1-youxie": [
    {
      "hanzi": "有些天",
      "pinyin": "yǒuxiē tiān",
      "german": "manche Tage",
      "audioPath": "/audio/collocations/col-hsk1-youxie-1.mp3"
    },
    {
      "hanzi": "有些同学",
      "pinyin": "yǒuxiē tóngxué",
      "german": "manche Schüler",
      "audioPath": "/audio/collocations/col-hsk1-youxie-2.mp3"
    }
  ],
  "hsk1-yu": [
    {
      "hanzi": "下雨",
      "pinyin": "xià yǔ",
      "german": "regnen",
      "audioPath": "/audio/collocations/col-hsk1-yu-1.mp3"
    },
    {
      "hanzi": "雨伞",
      "pinyin": "yǔsǎn",
      "german": "Regenschirm",
      "audioPath": "/audio/collocations/col-hsk1-yu-2.mp3"
    },
    {
      "hanzi": "大雨",
      "pinyin": "dàyǔ",
      "german": "starker Regen",
      "audioPath": "/audio/collocations/col-hsk1-yu-3.mp3"
    }
  ],
  "hsk1-yuan": [
    {
      "hanzi": "一百元",
      "pinyin": "yì bǎi yuán",
      "german": "hundert Yuan",
      "audioPath": "/audio/collocations/col-hsk1-yuan-1.mp3"
    },
    {
      "hanzi": "多少钱",
      "pinyin": "duōshao qián",
      "german": "was kostet das?",
      "audioPath": "/audio/collocations/col-hsk1-yuan-2.mp3"
    }
  ],
  "hsk1-yue": [
    {
      "hanzi": "一月",
      "pinyin": "yīyuè",
      "german": "Januar",
      "audioPath": "/audio/collocations/col-hsk1-yue-1.mp3"
    },
    {
      "hanzi": "上个月",
      "pinyin": "shàng ge yuè",
      "german": "letzter Monat",
      "audioPath": "/audio/collocations/col-hsk1-yue-2.mp3"
    },
    {
      "hanzi": "下个月",
      "pinyin": "xià ge yuè",
      "german": "nächster Monat",
      "audioPath": "/audio/collocations/col-hsk1-yue-3.mp3"
    }
  ],
  "hsk1-zai": [
    {
      "hanzi": "在家",
      "pinyin": "zài jiā",
      "german": "zu Hause sein",
      "audioPath": "/audio/collocations/col-hsk1-zai-1.mp3"
    },
    {
      "hanzi": "在北京",
      "pinyin": "zài Běijīng",
      "german": "in Peking sein",
      "audioPath": "/audio/collocations/col-hsk1-zai-2.mp3"
    },
    {
      "hanzi": "在看书",
      "pinyin": "zài kàn shū",
      "german": "gerade ein Buch lesen",
      "audioPath": "/audio/collocations/col-hsk1-zai-3.mp3"
    }
  ],
  "hsk1-zai-again": [
    {
      "hanzi": "再见",
      "pinyin": "zàijiàn",
      "german": "auf Wiedersehen",
      "audioPath": "/audio/collocations/col-hsk1-zai-again-1.mp3"
    },
    {
      "hanzi": "再一次",
      "pinyin": "zài yí cì",
      "german": "noch einmal",
      "audioPath": "/audio/collocations/col-hsk1-zai-again-2.mp3"
    },
    {
      "hanzi": "不再",
      "pinyin": "bú zài",
      "german": "nicht mehr",
      "audioPath": "/audio/collocations/col-hsk1-zai-again-3.mp3"
    }
  ],
  "hsk1-zaijian": [
    {
      "hanzi": "明天再见",
      "pinyin": "míngtiān zàijiàn",
      "german": "bis morgen!",
      "audioPath": "/audio/collocations/col-hsk1-zaijian-1.mp3"
    },
    {
      "hanzi": "老师再见",
      "pinyin": "lǎoshī zàijiàn",
      "german": "auf Wiedersehen, Lehrer!",
      "audioPath": "/audio/collocations/col-hsk1-zaijian-2.mp3"
    },
    {
      "hanzi": "说再见",
      "pinyin": "shuō zàijiàn",
      "german": "Auf Wiedersehen sagen",
      "audioPath": "/audio/collocations/col-hsk1-zaijian-3.mp3"
    }
  ],
  "hsk1-zao-early": [
    {
      "hanzi": "早上",
      "pinyin": "zǎoshang",
      "german": "früh am Morgen",
      "audioPath": "/audio/collocations/col-hsk1-zao-early-1.mp3"
    },
    {
      "hanzi": "很早",
      "pinyin": "hěn zǎo",
      "german": "sehr früh",
      "audioPath": "/audio/collocations/col-hsk1-zao-early-2.mp3"
    },
    {
      "hanzi": "早安",
      "pinyin": "zǎo’ān",
      "german": "guten Morgen (Anrede)",
      "audioPath": "/audio/collocations/col-hsk1-zao-early-3.mp3"
    }
  ],
  "hsk1-zaofan": [
    {
      "hanzi": "吃早饭",
      "pinyin": "chī zǎofàn",
      "german": "Frühstück essen",
      "audioPath": "/audio/collocations/col-hsk1-zaofan-1.mp3"
    },
    {
      "hanzi": "早饭吃什么",
      "pinyin": "zǎofàn chī shénme",
      "german": "was gibt es zum Frühstück?",
      "audioPath": "/audio/collocations/col-hsk1-zaofan-2.mp3"
    }
  ],
  "hsk1-zaoshang": [
    {
      "hanzi": "早上好",
      "pinyin": "zǎoshang hǎo",
      "german": "Guten Morgen",
      "audioPath": "/audio/collocations/col-hsk1-zaoshang-1.mp3"
    },
    {
      "hanzi": "早上八点",
      "pinyin": "zǎoshang bā diǎn",
      "german": "morgens um acht",
      "audioPath": "/audio/collocations/col-hsk1-zaoshang-2.mp3"
    }
  ],
  "hsk1-zenme": [
    {
      "hanzi": "怎么去",
      "pinyin": "zěnme qù",
      "german": "wie gelangt man dorthin?",
      "audioPath": "/audio/collocations/col-hsk1-zenme-1.mp3"
    },
    {
      "hanzi": "怎么说",
      "pinyin": "zěnme shuō",
      "german": "wie sagt man das?",
      "audioPath": "/audio/collocations/col-hsk1-zenme-2.mp3"
    },
    {
      "hanzi": "怎么写",
      "pinyin": "zěnme xiě",
      "german": "wie schreibt man das?",
      "audioPath": "/audio/collocations/col-hsk1-zenme-3.mp3"
    }
  ],
  "hsk1-zenmeyang": [
    {
      "hanzi": "怎么样",
      "pinyin": "zěnmeyàng",
      "german": "wie steht es darum?",
      "audioPath": "/audio/collocations/col-hsk1-zenmeyang-1.mp3"
    },
    {
      "hanzi": "天气怎么样",
      "pinyin": "tiānqì zěnmeyàng",
      "german": "wie ist das Wetter?",
      "audioPath": "/audio/collocations/col-hsk1-zenmeyang-2.mp3"
    },
    {
      "hanzi": "今天怎么样",
      "pinyin": "jīntiān zěnmeyàng",
      "german": "wie läuft es heute?",
      "audioPath": "/audio/collocations/col-hsk1-zenmeyang-3.mp3"
    }
  ],
  "hsk1-zhao-look-for": [
    {
      "hanzi": "找到",
      "pinyin": "zhǎodào",
      "german": "etwas finden",
      "audioPath": "/audio/collocations/col-hsk1-zhao-look-for-1.mp3"
    },
    {
      "hanzi": "找人",
      "pinyin": "zhǎo rén",
      "german": "jemanden suchen",
      "audioPath": "/audio/collocations/col-hsk1-zhao-look-for-2.mp3"
    },
    {
      "hanzi": "找钱",
      "pinyin": "zhǎo qián",
      "german": "Wechselgeld geben",
      "audioPath": "/audio/collocations/col-hsk1-zhao-look-for-3.mp3"
    }
  ],
  "hsk1-zhe": [
    {
      "hanzi": "这个人",
      "pinyin": "zhè ge rén",
      "german": "dieser Mensch",
      "audioPath": "/audio/collocations/col-hsk1-zhe-1.mp3"
    },
    {
      "hanzi": "这些",
      "pinyin": "zhèxiē",
      "german": "diese hier (Plural)",
      "audioPath": "/audio/collocations/col-hsk1-zhe-2.mp3"
    },
    {
      "hanzi": "这是",
      "pinyin": "zhè shì",
      "german": "das ist / dies ist",
      "audioPath": "/audio/collocations/col-hsk1-zhe-3.mp3"
    }
  ],
  "hsk1-zhebian": [
    {
      "hanzi": "在这边",
      "pinyin": "zài zhèbiān",
      "german": "hier drüben",
      "audioPath": "/audio/collocations/col-hsk1-zhebian-1.mp3"
    },
    {
      "hanzi": "这边有人",
      "pinyin": "zhèbiān yǒu rén",
      "german": "hier ist jemand",
      "audioPath": "/audio/collocations/col-hsk1-zhebian-2.mp3"
    }
  ],
  "hsk1-zheer": [
    {
      "hanzi": "在这儿",
      "pinyin": "zài zhèr",
      "german": "hier sein / sich hier befinden",
      "audioPath": "/audio/collocations/col-hsk1-zheer-1.mp3"
    },
    {
      "hanzi": "来这儿",
      "pinyin": "lái zhèr",
      "german": "hierher kommen",
      "audioPath": "/audio/collocations/col-hsk1-zheer-2.mp3"
    },
    {
      "hanzi": "这儿的人",
      "pinyin": "zhèr de rén",
      "german": "die Leute hier",
      "audioPath": "/audio/collocations/col-hsk1-zheer-3.mp3"
    }
  ],
  "hsk1-zhege": [
    {
      "hanzi": "这个多少钱",
      "pinyin": "zhège duōshao qián",
      "german": "was kostet das?",
      "audioPath": "/audio/collocations/col-hsk1-zhege-1.mp3"
    },
    {
      "hanzi": "这个好",
      "pinyin": "zhège hǎo",
      "german": "das ist gut",
      "audioPath": "/audio/collocations/col-hsk1-zhege-2.mp3"
    }
  ],
  "hsk1-zheli": [
    {
      "hanzi": "在这里",
      "pinyin": "zài zhèlǐ",
      "german": "hier",
      "audioPath": "/audio/collocations/col-hsk1-zheli-1.mp3"
    },
    {
      "hanzi": "这里有",
      "pinyin": "zhèlǐ yǒu",
      "german": "hier gibt es",
      "audioPath": "/audio/collocations/col-hsk1-zheli-2.mp3"
    }
  ],
  "hsk1-zhen-really": [
    {
      "hanzi": "真好",
      "pinyin": "zhēn hǎo",
      "german": "wirklich gut",
      "audioPath": "/audio/collocations/col-hsk1-zhen-really-1.mp3"
    },
    {
      "hanzi": "真的",
      "pinyin": "zhēn de",
      "german": "wirklich, wirklich?",
      "audioPath": "/audio/collocations/col-hsk1-zhen-really-2.mp3"
    }
  ],
  "hsk1-zhengzai": [
    {
      "hanzi": "正在工作",
      "pinyin": "zhèngzài gōngzuò",
      "german": "arbeitet gerade",
      "audioPath": "/audio/collocations/col-hsk1-zhengzai-1.mp3"
    },
    {
      "hanzi": "正在吃",
      "pinyin": "zhèngzài chī",
      "german": "isst gerade",
      "audioPath": "/audio/collocations/col-hsk1-zhengzai-2.mp3"
    }
  ],
  "hsk1-zhexie": [
    {
      "hanzi": "这些书",
      "pinyin": "zhèxiē shū",
      "german": "diese Bücher",
      "audioPath": "/audio/collocations/col-hsk1-zhexie-1.mp3"
    },
    {
      "hanzi": "这些钱",
      "pinyin": "zhèxiē qián",
      "german": "dieses Geld",
      "audioPath": "/audio/collocations/col-hsk1-zhexie-2.mp3"
    }
  ],
  "hsk1-zhi-only": [
    {
      "hanzi": "一只猫",
      "pinyin": "yì zhī māo",
      "german": "eine Katze",
      "audioPath": "/audio/collocations/col-hsk1-zhi-only-1.mp3"
    },
    {
      "hanzi": "两只鸟",
      "pinyin": "liǎng zhī niǎo",
      "german": "zwei Vögel",
      "audioPath": "/audio/collocations/col-hsk1-zhi-only-2.mp3"
    },
    {
      "hanzi": "只有",
      "pinyin": "zhǐyǒu",
      "german": "nur",
      "audioPath": "/audio/collocations/col-hsk1-zhi-only-3.mp3"
    }
  ],
  "hsk1-zhidao": [
    {
      "hanzi": "我知道",
      "pinyin": "wǒ zhīdào",
      "german": "ich weiß",
      "audioPath": "/audio/collocations/col-hsk1-zhidao-1.mp3"
    },
    {
      "hanzi": "不知道",
      "pinyin": "bù zhīdào",
      "german": "ich weiß nicht",
      "audioPath": "/audio/collocations/col-hsk1-zhidao-2.mp3"
    }
  ],
  "hsk1-zhongguo": [
    {
      "hanzi": "中国菜",
      "pinyin": "Zhōngguó cài",
      "german": "chinesisches Essen",
      "audioPath": "/audio/collocations/col-hsk1-zhongguo-1.mp3"
    },
    {
      "hanzi": "中国人",
      "pinyin": "Zhōngguó rén",
      "german": "chinesische Person",
      "audioPath": "/audio/collocations/col-hsk1-zhongguo-2.mp3"
    },
    {
      "hanzi": "汉语",
      "pinyin": "Hànyǔ",
      "german": "chinesische Sprache",
      "audioPath": "/audio/collocations/col-hsk1-zhongguo-3.mp3"
    }
  ],
  "hsk1-zhongwen": [
    {
      "hanzi": "学中文",
      "pinyin": "xué Zhōngwén",
      "german": "Chinesisch lernen",
      "audioPath": "/audio/collocations/col-hsk1-zhongwen-1.mp3"
    },
    {
      "hanzi": "中文老师",
      "pinyin": "Zhōngwén lǎoshī",
      "german": "Chinesischlehrer",
      "audioPath": "/audio/collocations/col-hsk1-zhongwen-2.mp3"
    }
  ],
  "hsk1-zhongwu": [
    {
      "hanzi": "中午十二点",
      "pinyin": "zhōngwǔ shí'èr diǎn",
      "german": "zwölf Uhr mittags",
      "audioPath": "/audio/collocations/col-hsk1-zhongwu-1.mp3"
    },
    {
      "hanzi": "今天中午",
      "pinyin": "jīntiān zhōngwǔ",
      "german": "heute Mittag",
      "audioPath": "/audio/collocations/col-hsk1-zhongwu-2.mp3"
    },
    {
      "hanzi": "吃中午饭",
      "pinyin": "chī zhōngwǔfàn",
      "german": "Mittagessen einnehmen",
      "audioPath": "/audio/collocations/col-hsk1-zhongwu-3.mp3"
    }
  ],
  "hsk1-zhongxue": [
    {
      "hanzi": "上中学",
      "pinyin": "shàng zhōngxué",
      "german": "die Mittelschule besuchen",
      "audioPath": "/audio/collocations/col-hsk1-zhongxue-1.mp3"
    },
    {
      "hanzi": "中学老师",
      "pinyin": "zhōngxué lǎoshī",
      "german": "Mittelschullehrer",
      "audioPath": "/audio/collocations/col-hsk1-zhongxue-2.mp3"
    }
  ],
  "hsk1-zhongxuesheng": [
    {
      "hanzi": "一个中学生",
      "pinyin": "yí ge zhōngxuéshēng",
      "german": "ein Mittelschüler",
      "audioPath": "/audio/collocations/col-hsk1-zhongxuesheng-1.mp3"
    },
    {
      "hanzi": "中学生的校服",
      "pinyin": "zhōngxuéshēng de xiàofú",
      "german": "die Schulkleidung",
      "audioPath": "/audio/collocations/col-hsk1-zhongxuesheng-2.mp3"
    }
  ],
  "hsk1-zhu": [
    {
      "hanzi": "住在北京",
      "pinyin": "zhù zài Běijīng",
      "german": "in Peking wohnen",
      "audioPath": "/audio/collocations/col-hsk1-zhu-1.mp3"
    },
    {
      "hanzi": "住在哪儿",
      "pinyin": "zhù zài nǎr",
      "german": "wo wohnst du?",
      "audioPath": "/audio/collocations/col-hsk1-zhu-2.mp3"
    },
    {
      "hanzi": "住家里",
      "pinyin": "zhù jiā lǐ",
      "german": "zu Hause wohnen",
      "audioPath": "/audio/collocations/col-hsk1-zhu-3.mp3"
    }
  ],
  "hsk1-zhuozi": [
    {
      "hanzi": "一张桌子",
      "pinyin": "yì zhāng zhuōzi",
      "german": "ein Tisch",
      "audioPath": "/audio/collocations/col-hsk1-zhuozi-1.mp3"
    },
    {
      "hanzi": "桌子上",
      "pinyin": "zhuōzi shang",
      "german": "auf dem Tisch",
      "audioPath": "/audio/collocations/col-hsk1-zhuozi-2.mp3"
    },
    {
      "hanzi": "大桌子",
      "pinyin": "dà zhuōzi",
      "german": "großer Tisch",
      "audioPath": "/audio/collocations/col-hsk1-zhuozi-3.mp3"
    }
  ],
  "hsk1-zi": [
    {
      "hanzi": "写字",
      "pinyin": "xiě zì",
      "german": "Schriftzeichen schreiben",
      "audioPath": "/audio/collocations/col-hsk1-zi-1.mp3"
    },
    {
      "hanzi": "汉字",
      "pinyin": "Hànzì",
      "german": "chinesisches Schriftzeichen",
      "audioPath": "/audio/collocations/col-hsk1-zi-2.mp3"
    },
    {
      "hanzi": "认字",
      "pinyin": "rèn zì",
      "german": "Schriftzeichen erkennen",
      "audioPath": "/audio/collocations/col-hsk1-zi-3.mp3"
    }
  ],
  "hsk1-zuo": [
    {
      "hanzi": "请坐",
      "pinyin": "qǐng zuò",
      "german": "bitte nehmen Sie Platz",
      "audioPath": "/audio/collocations/col-hsk1-zuo-1.mp3"
    },
    {
      "hanzi": "坐车",
      "pinyin": "zuò chē",
      "german": "mit dem Fahrzeug fahren",
      "audioPath": "/audio/collocations/col-hsk1-zuo-2.mp3"
    },
    {
      "hanzi": "坐下",
      "pinyin": "zuò xià",
      "german": "sich hinsetzen",
      "audioPath": "/audio/collocations/col-hsk1-zuo-3.mp3"
    }
  ],
  "hsk1-zuo-do": [
    {
      "hanzi": "做饭",
      "pinyin": "zuò fàn",
      "german": "kochen / Essen zubereiten",
      "audioPath": "/audio/collocations/col-hsk1-zuo-do-1.mp3"
    },
    {
      "hanzi": "做菜",
      "pinyin": "zuò cài",
      "german": "Gerichte zubereiten",
      "audioPath": "/audio/collocations/col-hsk1-zuo-do-2.mp3"
    },
    {
      "hanzi": "做工作",
      "pinyin": "zuò gōngzuò",
      "german": "Arbeit verrichten",
      "audioPath": "/audio/collocations/col-hsk1-zuo-do-3.mp3"
    }
  ],
  "hsk1-zuofan": [
    {
      "hanzi": "在家做饭",
      "pinyin": "zài jiā zuòfàn",
      "german": "zu Hause kochen",
      "audioPath": "/audio/collocations/col-hsk1-zuofan-1.mp3"
    },
    {
      "hanzi": "做饭很快",
      "pinyin": "zuòfàn hěn kuài",
      "german": "kocht schnell",
      "audioPath": "/audio/collocations/col-hsk1-zuofan-2.mp3"
    }
  ],
  "hsk1-zuotian": [
    {
      "hanzi": "昨天下午",
      "pinyin": "zuótiān xiàwǔ",
      "german": "gestern Nachmittag",
      "audioPath": "/audio/collocations/col-hsk1-zuotian-1.mp3"
    },
    {
      "hanzi": "昨天晚上",
      "pinyin": "zuótiān wǎnshang",
      "german": "gestern Abend",
      "audioPath": "/audio/collocations/col-hsk1-zuotian-2.mp3"
    },
    {
      "hanzi": "昨天上午",
      "pinyin": "zuótiān shàngwǔ",
      "german": "gestern Vormittag",
      "audioPath": "/audio/collocations/col-hsk1-zuotian-3.mp3"
    }
  ]
};

// 100 % authentische HSK-1 Beispielsätze für ausnahmslos alle 163 Wörter
const EXAMPLE_SENTENCES_MAP: Record<string, ExampleSentence[]> = {
  "hsk1-ai": [
    {
      "hanzi": "我爱爸爸和妈妈。",
      "pinyin": "Wǒ ài bàba hé māma.",
      "german": "Ich liebe Papa und Mama.",
      "audioPath": "/audio/examples/ex-hsk1-ai-1.mp3"
    },
    {
      "hanzi": "她很爱看中国电影。",
      "pinyin": "Tā hěn ài kàn Zhōngguó diànyǐng.",
      "german": "Sie schaut leidenschaftlich gerne chinesische Filme.",
      "audioPath": "/audio/examples/ex-hsk1-ai-2.mp3"
    }
  ],
  "hsk1-ba": [
    {
      "hanzi": "八点我们在学校见。",
      "pinyin": "Bā diǎn wǒmen zài xuéxiào jiàn.",
      "german": "Um acht Uhr sehen wir uns in der Schule.",
      "audioPath": "/audio/examples/ex-hsk1-ba-1.mp3"
    },
    {
      "hanzi": "他买了八个大苹果。",
      "pinyin": "Tā mǎi le bā ge dà píngguǒ.",
      "german": "Er hat acht große Äpfel gekauft.",
      "audioPath": "/audio/examples/ex-hsk1-ba-2.mp3"
    }
  ],
  "hsk1-ba-particle": [
    {
      "hanzi": "我们一起去吃中国菜吧！",
      "pinyin": "Wǒmen yìqǐ qù chī Zhōngguó cài ba!",
      "german": "Lass uns zusammen chinesisch essen gehen!",
      "audioPath": "/audio/examples/ex-hsk1-ba-particle-1.mp3"
    },
    {
      "hanzi": "快走吧，时间不早了。",
      "pinyin": "Kuài zǒu ba, shíjiān bù zǎo le.",
      "german": "Lass uns zügig gehen, es ist nicht mehr früh.",
      "audioPath": "/audio/examples/ex-hsk1-ba-particle-2.mp3"
    }
  ],
  "hsk1-baba": [
    {
      "hanzi": "我爸爸在医院工作。",
      "pinyin": "Wǒ bàba zài yīyuàn gōngzuò.",
      "german": "Mein Vater arbeitet im Krankenhaus.",
      "audioPath": "/audio/examples/ex-hsk1-baba-1.mp3"
    },
    {
      "hanzi": "爸爸喜欢喝热茶。",
      "pinyin": "Bàba xǐhuan hē rèchá.",
      "german": "Papa trinkt gerne heißen Tee.",
      "audioPath": "/audio/examples/ex-hsk1-baba-2.mp3"
    }
  ],
  "hsk1-bai": [
    {
      "hanzi": "这本书一百块钱。",
      "pinyin": "Zhè běn shū yìbǎi kuài qián.",
      "german": "Dieses Buch kostet einhundert Yuan.",
      "audioPath": "/audio/examples/ex-hsk1-bai-1.mp3"
    },
    {
      "hanzi": "学校里有一百多个学生。",
      "pinyin": "Xuéxiào li yǒu yìbǎi duō ge xuésheng.",
      "german": "In der Schule gibt es über hundert Schüler.",
      "audioPath": "/audio/examples/ex-hsk1-bai-2.mp3"
    }
  ],
  "hsk1-baitian": [
    {
      "hanzi": "我白天在学校，晚上学习汉语。",
      "pinyin": "Wǒ báitiān zài xuéxiào, wǎnshang xuéxí Hànyǔ.",
      "german": "Ich bin tagsüber in der Schule und lerne abends Chinesisch.",
      "audioPath": "/audio/examples/ex-hsk1-baitian-1.mp3"
    }
  ],
  "hsk1-ban": [
    {
      "hanzi": "现在是下午三点半。",
      "pinyin": "Xiànzài shì xiàwǔ sān diǎn bàn.",
      "german": "Es ist jetzt halb vier.",
      "audioPath": "/audio/examples/ex-hsk1-ban-1.mp3"
    }
  ],
  "hsk1-baozi": [
    {
      "hanzi": "早饭我吃了两个包子。",
      "pinyin": "Zǎofàn wǒ chī le liǎng ge bāozi.",
      "german": "Zum Frühstück habe ich zwei Brötchen gegessen.",
      "audioPath": "/audio/examples/ex-hsk1-baozi-1.mp3"
    }
  ],
  "hsk1-beijing": [
    {
      "hanzi": "北京是中国的首都。",
      "pinyin": "Běijīng shì Zhōngguó de shǒudū.",
      "german": "Peking ist die Hauptstadt Chinas.",
      "audioPath": "/audio/examples/ex-hsk1-beijing-1.mp3"
    },
    {
      "hanzi": "他住在北京朝阳区。",
      "pinyin": "Tā zhù zài Běijīng Cháoyáng qū.",
      "german": "Er wohnt im Chaoyang-Bezirk in Peking.",
      "audioPath": "/audio/examples/ex-hsk1-beijing-2.mp3"
    }
  ],
  "hsk1-beizi": [
    {
      "hanzi": "这个水杯很漂亮。",
      "pinyin": "Zhè ge shuǐbēi hěn piàoliang.",
      "german": "Dieser Wasserbecher ist sehr hübsch.",
      "audioPath": "/audio/examples/ex-hsk1-beizi-1.mp3"
    },
    {
      "hanzi": "杯子里有热茶。",
      "pinyin": "Bēizi li yǒu rèchá.",
      "german": "In der Tasse ist heißer Tee.",
      "audioPath": "/audio/examples/ex-hsk1-beizi-2.mp3"
    }
  ],
  "hsk1-ben": [
    {
      "hanzi": "桌子上有一本汉语书。",
      "pinyin": "Zhuōzi shang yǒu yì běn Hànyǔ shū.",
      "german": "Auf dem Tisch liegt ein Chinesischbuch.",
      "audioPath": "/audio/examples/ex-hsk1-ben-1.mp3"
    },
    {
      "hanzi": "我买了两本书。",
      "pinyin": "Wǒ mǎi le liǎng běn shū.",
      "german": "Ich habe zwei Bücher gekauft.",
      "audioPath": "/audio/examples/ex-hsk1-ben-2.mp3"
    }
  ],
  "hsk1-bian": [
    {
      "hanzi": "学校在商店的旁边。",
      "pinyin": "Xuéxiào zài shāngdiàn de pángbiān.",
      "german": "Die Schule ist neben dem Laden.",
      "audioPath": "/audio/examples/ex-hsk1-bian-1.mp3"
    }
  ],
  "hsk1-bing": [
    {
      "hanzi": "他昨天生病了，今天在家休息。",
      "pinyin": "Tā zuótiān shēngbìng le, jīntiān zài jiā xiūxi.",
      "german": "Er war gestern krank und ruht heute zu Hause.",
      "audioPath": "/audio/examples/ex-hsk1-bing-1.mp3"
    }
  ],
  "hsk1-bu": [
    {
      "hanzi": "我不是中国人，我是德国人。",
      "pinyin": "Wǒ bú shì Zhōngguó rén, wǒ shì Déguó rén.",
      "german": "Ich bin kein Chinese, ich bin Deutscher.",
      "audioPath": "/audio/examples/ex-hsk1-bu-1.mp3"
    },
    {
      "hanzi": "今天天气不冷也不热。",
      "pinyin": "Jīntiān tiānqì bù lěng yě bú rè.",
      "german": "Heute ist das Wetter weder kalt noch heiß.",
      "audioPath": "/audio/examples/ex-hsk1-bu-2.mp3"
    }
  ],
  "hsk1-bukeqi": [
    {
      "hanzi": "“谢谢你的茶！”——“不客气！”",
      "pinyin": "“Xièxie nǐ de chá!” —— “Bú kèqi!”",
      "german": "„Danke für deinen Tee!“ — „Keine Ursache!“",
      "audioPath": "/audio/examples/ex-hsk1-bukeqi-1.mp3"
    },
    {
      "hanzi": "大家都是朋友，不用客气。",
      "pinyin": "Dàjiā dōu shì péngyou, bú yòng kèqi.",
      "german": "Wir sind alle Freunde, du brauchst keine Umstände zu machen.",
      "audioPath": "/audio/examples/ex-hsk1-bukeqi-2.mp3"
    }
  ],
  "hsk1-buyao": [
    {
      "hanzi": "请不要在这里抽烟。",
      "pinyin": "Qǐng bú yào zài zhèlǐ chōu yān.",
      "german": "Bitte rauchen Sie hier nicht.",
      "audioPath": "/audio/examples/ex-hsk1-buyao-1.mp3"
    }
  ],
  "hsk1-cai": [
    {
      "hanzi": "今天妈妈做了很多好吃的菜。",
      "pinyin": "Jīntiān māma zuò le hěn duō hǎochī de cài.",
      "german": "Heute hat Mama viele leckere Gerichte gekocht.",
      "audioPath": "/audio/examples/ex-hsk1-cai-1.mp3"
    },
    {
      "hanzi": "中国菜很有特色。",
      "pinyin": "Zhōngguó cài hěn yǒu tèsè.",
      "german": "Chinesische Gerichte haben ihren ganz eigenen Charakter.",
      "audioPath": "/audio/examples/ex-hsk1-cai-2.mp3"
    }
  ],
  "hsk1-cha": [
    {
      "hanzi": "中国人很喜欢喝绿茶。",
      "pinyin": "Zhōngguó rén hěn xǐhuan hē lǜchá.",
      "german": "Chinesen trinken sehr gerne grünen Tee.",
      "audioPath": "/audio/examples/ex-hsk1-cha-1.mp3"
    },
    {
      "hanzi": "请喝杯热茶。",
      "pinyin": "Qǐng hē bēi rèchá.",
      "german": "Bitte trinken Sie eine Tasse heißen Tee.",
      "audioPath": "/audio/examples/ex-hsk1-cha-2.mp3"
    }
  ],
  "hsk1-chang": [
    {
      "hanzi": "他很喜欢唱歌。",
      "pinyin": "Tā hěn xǐhuan chàng gē.",
      "german": "Er singt sehr gerne.",
      "audioPath": "/audio/examples/ex-hsk1-chang-1.mp3"
    }
  ],
  "hsk1-chaoshi": [
    {
      "hanzi": "妈妈去超市买水果和菜。",
      "pinyin": "Māma qù chāoshì mǎi shuǐguǒ hé cài.",
      "german": "Mama geht in den Supermarkt, um Obst und Gemüse zu kaufen.",
      "audioPath": "/audio/examples/ex-hsk1-chaoshi-1.mp3"
    }
  ],
  "hsk1-che": [
    {
      "hanzi": "他没有车，每天坐出租车上班。",
      "pinyin": "Tā méiyǒu chē, měitiān zuò chūzūchē shàngbān.",
      "german": "Er hat kein Auto und fährt jeden Tag mit dem Taxi zur Arbeit.",
      "audioPath": "/audio/examples/ex-hsk1-che-1.mp3"
    }
  ],
  "hsk1-chi": [
    {
      "hanzi": "你想吃米饭还是菜？",
      "pinyin": "Nǐ xiǎng chī mǐfàn háishi cài?",
      "german": "Möchtest du Reis oder Speisen essen?",
      "audioPath": "/audio/examples/ex-hsk1-chi-1.mp3"
    },
    {
      "hanzi": "中国菜真好吃！",
      "pinyin": "Zhōngguó cài zhēn hǎochī!",
      "german": "Chinesisches Essen ist wirklich lecker!",
      "audioPath": "/audio/examples/ex-hsk1-chi-2.mp3"
    }
  ],
  "hsk1-chuan": [
    {
      "hanzi": "今天很冷，多穿一点衣服。",
      "pinyin": "Jīntiān hěn lěng, duō chuān yìdiǎnr yīfu.",
      "german": "Heute ist es kalt, zieh etwas mehr an.",
      "audioPath": "/audio/examples/ex-hsk1-chuan-1.mp3"
    }
  ],
  "hsk1-chuzuche": [
    {
      "hanzi": "我们坐出租车去饭馆吧。",
      "pinyin": "Wǒmen zuò chūzūchē qù fànguǎn ba.",
      "german": "Lass uns mit dem Taxi zum Restaurant fahren.",
      "audioPath": "/audio/examples/ex-hsk1-chuzuche-1.mp3"
    },
    {
      "hanzi": "校门前有很多出租车。",
      "pinyin": "Xiàomén qián yǒu hěn duō chūzūchē.",
      "german": "Vor dem Schultor stehen viele Taxis.",
      "audioPath": "/audio/examples/ex-hsk1-chuzuche-2.mp3"
    }
  ],
  "hsk1-da": [
    {
      "hanzi": "这个医院非常大。",
      "pinyin": "Zhè ge yīyuàn fēicháng dà.",
      "german": "Dieses Krankenhaus ist sehr groß.",
      "audioPath": "/audio/examples/ex-hsk1-da-1.mp3"
    },
    {
      "hanzi": "大苹果很甜。",
      "pinyin": "Dà píngguǒ hěn tián.",
      "german": "Große Äpfel sind sehr süß.",
      "audioPath": "/audio/examples/ex-hsk1-da-2.mp3"
    }
  ],
  "hsk1-dadianhua": [
    {
      "hanzi": "他在给生病的妈妈打电话。",
      "pinyin": "Tā zài gěi shēngbìng de māma dǎ diànhuà.",
      "german": "Er ruft gerade seine kranke Mutter an.",
      "audioPath": "/audio/examples/ex-hsk1-dadianhua-1.mp3"
    },
    {
      "hanzi": "请不要在电影院打电话。",
      "pinyin": "Qǐng bú yào zài diànyǐngyuàn dǎ diànhuà.",
      "german": "Bitte telefoniere nicht im Kinosaal.",
      "audioPath": "/audio/examples/ex-hsk1-dadianhua-2.mp3"
    }
  ],
  "hsk1-dajia": [
    {
      "hanzi": "大家好，我是新同学。",
      "pinyin": "Dàjiā hǎo, wǒ shì xīn tóngxué.",
      "german": "Hallo zusammen, ich bin ein neuer Schüler.",
      "audioPath": "/audio/examples/ex-hsk1-dajia-1.mp3"
    }
  ],
  "hsk1-dao-arrive": [
    {
      "hanzi": "我到学校了。",
      "pinyin": "Wǒ dào xuéxiào le.",
      "german": "Ich bin in der Schule angekommen.",
      "audioPath": "/audio/examples/ex-hsk1-dao-arrive-1.mp3"
    }
  ],
  "hsk1-daxue": [
    {
      "hanzi": "她在大学学中文。",
      "pinyin": "Tā zài dàxué xué Zhōngwén.",
      "german": "Sie studiert an der Universität Chinesisch.",
      "audioPath": "/audio/examples/ex-hsk1-daxue-1.mp3"
    }
  ],
  "hsk1-daxuesheng": [
    {
      "hanzi": "他是一个大学生，住在学校宿舍。",
      "pinyin": "Tā shì yí gè dàxuéshēng, zhù zài xuéxiào sùshè.",
      "german": "Er ist Student und wohnt im Studentenwohnheim.",
      "audioPath": "/audio/examples/ex-hsk1-daxuesheng-1.mp3"
    }
  ],
  "hsk1-de": [
    {
      "hanzi": "这是王老师的书。",
      "pinyin": "Zhè shì Wáng lǎoshī de shū.",
      "german": "Das ist das Buch von Lehrer Wang.",
      "audioPath": "/audio/examples/ex-hsk1-de-1.mp3"
    },
    {
      "hanzi": "我买了一件漂亮的衣服。",
      "pinyin": "Wǒ mǎi le yí jiàn piàoliang de yīfu.",
      "german": "Ich habe ein hübsches Kleidungsstück gekauft.",
      "audioPath": "/audio/examples/ex-hsk1-de-2.mp3"
    }
  ],
  "hsk1-di-ordinal": [
    {
      "hanzi": "他是我的第一个中国朋友。",
      "pinyin": "Tā shì wǒ de dì yī ge Zhōngguó péngyou.",
      "german": "Er ist mein erster chinesischer Freund.",
      "audioPath": "/audio/examples/ex-hsk1-di-ordinal-1.mp3"
    }
  ],
  "hsk1-dian": [
    {
      "hanzi": "现在上午十点整。",
      "pinyin": "Xiànzài shàngwǔ shí diǎn zhěng.",
      "german": "Jetzt ist es genau zehn Uhr vormittags.",
      "audioPath": "/audio/examples/ex-hsk1-dian-1.mp3"
    },
    {
      "hanzi": "请给我来一点儿茶。",
      "pinyin": "Qǐng gěi wǒ lái yìdiǎnr chá.",
      "german": "Bitte gib mir ein wenig Tee.",
      "audioPath": "/audio/examples/ex-hsk1-dian-2.mp3"
    }
  ],
  "hsk1-dian-store": [
    {
      "hanzi": "这条街上有很多小店。",
      "pinyin": "Zhè tiáo jiē shang yǒu hěn duō xiǎo diàn.",
      "german": "Diese Straße hat viele kleine Läden.",
      "audioPath": "/audio/examples/ex-hsk1-dian-store-1.mp3"
    }
  ],
  "hsk1-dianhua": [
    {
      "hanzi": "我的电话号码是六六八二零零。",
      "pinyin": "Wǒ de diànhuà hàomǎ shì liùliù bā èrlíng líng.",
      "german": "Meine Telefonnummer ist 668200.",
      "audioPath": "/audio/examples/ex-hsk1-dianhua-1.mp3"
    }
  ],
  "hsk1-diannao": [
    {
      "hanzi": "桌子上有一台新电脑。",
      "pinyin": "Zhuōzi shang yǒu yì tái xīn diànnǎo.",
      "german": "Auf dem Tisch steht ein neuer Computer.",
      "audioPath": "/audio/examples/ex-hsk1-diannao-1.mp3"
    },
    {
      "hanzi": "他在用电脑工作。",
      "pinyin": "Tā zài yòng diànnǎo gōngzuò.",
      "german": "Er arbeitet mit dem Computer.",
      "audioPath": "/audio/examples/ex-hsk1-diannao-2.mp3"
    }
  ],
  "hsk1-dianshi": [
    {
      "hanzi": "晚上他在看电视。",
      "pinyin": "Wǎnshang tā zài kàn diànshì.",
      "german": "Abends schaut er fern.",
      "audioPath": "/audio/examples/ex-hsk1-dianshi-1.mp3"
    },
    {
      "hanzi": "客厅里有一台大电视。",
      "pinyin": "Kètīng li yǒu yì tái dà diànshì.",
      "german": "Im Wohnzimmer steht ein großer Fernseher.",
      "audioPath": "/audio/examples/ex-hsk1-dianshi-2.mp3"
    }
  ],
  "hsk1-dianying": [
    {
      "hanzi": "明天我们去看电影吧。",
      "pinyin": "Míngtiān wǒmen qù kàn diànyǐng ba.",
      "german": "Lass uns morgen ins Kino gehen.",
      "audioPath": "/audio/examples/ex-hsk1-dianying-1.mp3"
    },
    {
      "hanzi": "这部中国电影很有名。",
      "pinyin": "Zhè bù Zhōngguó diànyǐng hěn yǒumíng.",
      "german": "Dieser chinesische Film ist sehr berühmt.",
      "audioPath": "/audio/examples/ex-hsk1-dianying-2.mp3"
    }
  ],
  "hsk1-dianyingyuan": [
    {
      "hanzi": "电影院在超市的旁边。",
      "pinyin": "Diànyǐngyuàn zài chāoshì de pángbiān.",
      "german": "Das Kino ist neben dem Supermarkt.",
      "audioPath": "/audio/examples/ex-hsk1-dianyingyuan-1.mp3"
    }
  ],
  "hsk1-didi": [
    {
      "hanzi": "我弟弟在小学读书。",
      "pinyin": "Wǒ dìdi zài xiǎoxué dúshū.",
      "german": "Mein kleiner Bruder geht in die Grundschule.",
      "audioPath": "/audio/examples/ex-hsk1-didi-1.mp3"
    }
  ],
  "hsk1-dongxi": [
    {
      "hanzi": "他在商店买了很多好吃的买东西。",
      "pinyin": "Tā zài shāngdiàn mǎi le hěn duō dōngxi.",
      "german": "Er hat im Laden viele Sachen gekauft.",
      "audioPath": "/audio/examples/ex-hsk1-dongxi-1.mp3"
    },
    {
      "hanzi": "这是什么东西？",
      "pinyin": "Zhè shì shénme dōngxi?",
      "german": "Was für ein Ding ist das?",
      "audioPath": "/audio/examples/ex-hsk1-dongxi-2.mp3"
    }
  ],
  "hsk1-dou": [
    {
      "hanzi": "我们都是北京大学的学生。",
      "pinyin": "Wǒmen dōu shì Běijīng Dàxué de xuésheng.",
      "german": "Wir sind alle Studenten der Peking-Universität.",
      "audioPath": "/audio/examples/ex-hsk1-dou-1.mp3"
    },
    {
      "hanzi": "这些书我都喜欢。",
      "pinyin": "Zhèxiē shū wǒ dōu xǐhuan.",
      "german": "Diese Bücher mag ich alle.",
      "audioPath": "/audio/examples/ex-hsk1-dou-2.mp3"
    }
  ],
  "hsk1-du": [
    {
      "hanzi": "请大声读这个句子。",
      "pinyin": "Qǐng dà shēng dú zhè ge jùzi.",
      "german": "Bitte lies diesen Satz mit lauter Stimme vor.",
      "audioPath": "/audio/examples/ex-hsk1-du-1.mp3"
    },
    {
      "hanzi": "他在认真读汉语课文。",
      "pinyin": "Tā zài rènzhēn dú Hànyǔ kèwén.",
      "german": "Er liest gewissenhaft den chinesischen Lektionstext.",
      "audioPath": "/audio/examples/ex-hsk1-du-2.mp3"
    }
  ],
  "hsk1-dui": [
    {
      "hanzi": "你说得对。",
      "pinyin": "Nǐ shuō de duì.",
      "german": "Du hast recht.",
      "audioPath": "/audio/examples/ex-hsk1-dui-1.mp3"
    }
  ],
  "hsk1-duibuqi": [
    {
      "hanzi": "对不起，我今天来晚了。",
      "pinyin": "Duìbuqǐ, wǒ jīntiān lái wǎn le.",
      "german": "Entschuldigung, ich bin heute zu spät gekommen.",
      "audioPath": "/audio/examples/ex-hsk1-duibuqi-1.mp3"
    },
    {
      "hanzi": "“对不起！”——“没关系。”",
      "pinyin": "“Duìbuqǐ!” —— “Méi guānxi.”",
      "german": "„Entschuldigung!“ — „Macht nichts.“",
      "audioPath": "/audio/examples/ex-hsk1-duibuqi-2.mp3"
    }
  ],
  "hsk1-duo": [
    {
      "hanzi": "今天商店里有很多人。",
      "pinyin": "Jīntiān shāngdiàn li yǒu hěn duō rén.",
      "german": "Heute sind sehr viele Menschen im Geschäft.",
      "audioPath": "/audio/examples/ex-hsk1-duo-1.mp3"
    },
    {
      "hanzi": "多听多说对学汉语好。",
      "pinyin": "Duō tīng duō shuō duì xué Hànyǔ hǎo.",
      "german": "Viel zu hören und viel zu sprechen ist gut beim Chinesischlernen.",
      "audioPath": "/audio/examples/ex-hsk1-duo-2.mp3"
    }
  ],
  "hsk1-duoshao": [
    {
      "hanzi": "这个电脑多少钱？",
      "pinyin": "Zhè ge diànnǎo duōshao qián?",
      "german": "Wie viel kostet dieser Computer?",
      "audioPath": "/audio/examples/ex-hsk1-duoshao-1.mp3"
    },
    {
      "hanzi": "学校有多少个学生？",
      "pinyin": "Xuéxiào yǒu duōshao ge xuésheng?",
      "german": "Wie viele Schüler hat die Schule?",
      "audioPath": "/audio/examples/ex-hsk1-duoshao-2.mp3"
    }
  ],
  "hsk1-dushu": [
    {
      "hanzi": "他每天晚上读书。",
      "pinyin": "Tā měitiān wǎnshang dúshū.",
      "german": "Er liest jeden Abend.",
      "audioPath": "/audio/examples/ex-hsk1-dushu-1.mp3"
    }
  ],
  "hsk1-er": [
    {
      "hanzi": "他有两个女儿。",
      "pinyin": "Tā yǒu liǎng ge nǚ'ér.",
      "german": "Er hat zwei Töchter.",
      "audioPath": "/audio/examples/ex-hsk1-er-1.mp3"
    },
    {
      "hanzi": "二月的天气比较冷。",
      "pinyin": "Èryuè de tiānqì bǐjiào lěng.",
      "german": "Das Wetter im Februar ist vergleichsweise kalt.",
      "audioPath": "/audio/examples/ex-hsk1-er-2.mp3"
    }
  ],
  "hsk1-erzi": [
    {
      "hanzi": "他的儿子今年八岁了。",
      "pinyin": "Tā de érzi jīnnián bā suì le.",
      "german": "Sein Sohn ist dieses Jahr acht Jahre alt geworden.",
      "audioPath": "/audio/examples/ex-hsk1-erzi-1.mp3"
    },
    {
      "hanzi": "我的儿子喜欢看书。",
      "pinyin": "Wǒ de érzi xǐhuan kàn shū.",
      "german": "Mein Sohn liest gerne Bücher.",
      "audioPath": "/audio/examples/ex-hsk1-erzi-2.mp3"
    }
  ],
  "hsk1-fan": [
    {
      "hanzi": "该吃晚饭了。",
      "pinyin": "Gāi chī wǎnfàn le.",
      "german": "Es ist Zeit für das Abendessen.",
      "audioPath": "/audio/examples/ex-hsk1-fan-1.mp3"
    }
  ],
  "hsk1-fandian": [
    {
      "hanzi": "我们去那家大饭店吃北京烤鸭。",
      "pinyin": "Wǒmen qù nà jiā dà fàndiàn chī Běijīng kǎoyā.",
      "german": "Wir gehen in jenes große Hotel/Restaurant, um Peking-Ente zu essen.",
      "audioPath": "/audio/examples/ex-hsk1-fandian-1.mp3"
    },
    {
      "hanzi": "饭店前面停着出租车。",
      "pinyin": "Fàndiàn qiánmian tíng zhe chūzūchē.",
      "german": "Vor dem Hotel halten Taxis.",
      "audioPath": "/audio/examples/ex-hsk1-fandian-2.mp3"
    }
  ],
  "hsk1-fangjian": [
    {
      "hanzi": "我的房间不大，但是很干净。",
      "pinyin": "Wǒ de fángjiān bú dà, dànshì hěn gānjìng.",
      "german": "Mein Zimmer ist klein, aber sauber.",
      "audioPath": "/audio/examples/ex-hsk1-fangjian-1.mp3"
    }
  ],
  "hsk1-fanguan": [
    {
      "hanzi": "这家中国饭馆的菜很好吃。",
      "pinyin": "Zhè jiā Zhōngguó fànguǎn de cài hěn hǎochī.",
      "german": "Das Essen in dieser chinesischen Gaststätte schmeckt vorzüglich.",
      "audioPath": "/audio/examples/ex-hsk1-fanguan-1.mp3"
    },
    {
      "hanzi": "今天晚上我们去饭馆吃饭吧。",
      "pinyin": "Jīntiān wǎnshang wǒmen qù fànguǎn chī fàn ba.",
      "german": "Lass uns heute Abend ins Restaurant essen gehen.",
      "audioPath": "/audio/examples/ex-hsk1-fanguan-2.mp3"
    }
  ],
  "hsk1-feichang": [
    {
      "hanzi": "今天天气非常好。",
      "pinyin": "Jīntiān tiānqì fēicháng hǎo.",
      "german": "Das Wetter ist heute sehr schön.",
      "audioPath": "/audio/examples/ex-hsk1-feichang-1.mp3"
    }
  ],
  "hsk1-feiji": [
    {
      "hanzi": "我们明天坐飞机去北京。",
      "pinyin": "Wǒmen míngtiān zuò fēijī qù Běijīng.",
      "german": "Wir fliegen morgen mit dem Flugzeug nach Peking.",
      "audioPath": "/audio/examples/ex-hsk1-feiji-1.mp3"
    },
    {
      "hanzi": "天上有架大飞机。",
      "pinyin": "Tiān shang yǒu jià dà fēijī.",
      "german": "Am Himmel fliegt ein großes Flugzeug.",
      "audioPath": "/audio/examples/ex-hsk1-feiji-2.mp3"
    }
  ],
  "hsk1-fen": [
    {
      "hanzi": "现在七点四十五分。",
      "pinyin": "Xiànzài qī diǎn sìshíwǔ fēn.",
      "german": "Es ist jetzt 7:45.",
      "audioPath": "/audio/examples/ex-hsk1-fen-1.mp3"
    }
  ],
  "hsk1-fenzhong": [
    {
      "hanzi": "再等我五分钟，马上来！",
      "pinyin": "Zài děng wǒ wǔ fēnzhōng, mǎshàng lái!",
      "german": "Warte noch fünf Minuten auf mich, ich komme sofort!",
      "audioPath": "/audio/examples/ex-hsk1-fenzhong-1.mp3"
    },
    {
      "hanzi": "一小时有六十分钟。",
      "pinyin": "Yì xiǎoshí yǒu liùshí fēnzhōng.",
      "german": "Eine Stunde hat sechzig Minuten.",
      "audioPath": "/audio/examples/ex-hsk1-fenzhong-2.mp3"
    }
  ],
  "hsk1-gaoxing": [
    {
      "hanzi": "认识你，我真的很高兴！",
      "pinyin": "Rènshi nǐ, wǒ zhēnde hěn gāoxìng!",
      "german": "Dich kennenzulernen freut mich wirklich sehr!",
      "audioPath": "/audio/examples/ex-hsk1-gaoxing-1.mp3"
    },
    {
      "hanzi": "看到好朋友，他非常高兴。",
      "pinyin": "Kàndào hǎo péngyou, tā fēicháng gāoxìng.",
      "german": "Als er seinen guten Freund sah, freute er sich riesig.",
      "audioPath": "/audio/examples/ex-hsk1-gaoxing-2.mp3"
    }
  ],
  "hsk1-ge": [
    {
      "hanzi": "我想买一个大苹果。",
      "pinyin": "Wǒ xiǎng mǎi yí ge dà píngguǒ.",
      "german": "Ich möchte einen großen Apfel kaufen.",
      "audioPath": "/audio/examples/ex-hsk1-ge-1.mp3"
    },
    {
      "hanzi": "他是一个好学生。",
      "pinyin": "Tā shì yí ge hǎo xuésheng.",
      "german": "Er ist ein guter Schüler.",
      "audioPath": "/audio/examples/ex-hsk1-ge-2.mp3"
    }
  ],
  "hsk1-ge-song": [
    {
      "hanzi": "这首歌很好听。",
      "pinyin": "Zhè shǒu gē hěn hǎotīng.",
      "german": "Dieses Lied klingt sehr schön.",
      "audioPath": "/audio/examples/ex-hsk1-ge-song-1.mp3"
    }
  ],
  "hsk1-gege": [
    {
      "hanzi": "我哥哥在北京工作。",
      "pinyin": "Wǒ gēge zài Běijīng gōngzuò.",
      "german": "Mein älterer Bruder arbeitet in Peking.",
      "audioPath": "/audio/examples/ex-hsk1-gege-1.mp3"
    }
  ],
  "hsk1-gei-give": [
    {
      "hanzi": "妈妈给我买了一本书。",
      "pinyin": "Māma gěi wǒ mǎi le yì běn shū.",
      "german": "Mama hat mir ein Buch gekauft.",
      "audioPath": "/audio/examples/ex-hsk1-gei-give-1.mp3"
    }
  ],
  "hsk1-gongsi": [
    {
      "hanzi": "他在一家大公司工作。",
      "pinyin": "Tā zài yì jiā dà gōngsī gōngzuò.",
      "german": "Er arbeitet in einer großen Firma.",
      "audioPath": "/audio/examples/ex-hsk1-gongsi-1.mp3"
    }
  ],
  "hsk1-gongzuo": [
    {
      "hanzi": "我爸爸在医院工作。",
      "pinyin": "Wǒ bàba zài yīyuàn gōngzuò.",
      "german": "Mein Vater arbeitet im Krankenhaus.",
      "audioPath": "/audio/examples/ex-hsk1-gongzuo-1.mp3"
    },
    {
      "hanzi": "他的工作很忙。",
      "pinyin": "Tā de gōngzuò hěn máng.",
      "german": "Seine Arbeit ist sehr geschäftig.",
      "audioPath": "/audio/examples/ex-hsk1-gongzuo-2.mp3"
    }
  ],
  "hsk1-gou": [
    {
      "hanzi": "那只小狗在草地上玩。",
      "pinyin": "Nà zhī xiǎogǒu zài cǎodì shang wán.",
      "german": "Jener kleine Hund spielt auf der Wiese.",
      "audioPath": "/audio/examples/ex-hsk1-gou-1.mp3"
    },
    {
      "hanzi": "我家有一只大狗。",
      "pinyin": "Wǒ jiā yǒu yì zhī dà gǒu.",
      "german": "Meine Familie hat einen großen Hund.",
      "audioPath": "/audio/examples/ex-hsk1-gou-2.mp3"
    }
  ],
  "hsk1-gui": [
    {
      "hanzi": "这件衣服太贵了，我不要。",
      "pinyin": "Zhè jiàn yīfu tài guì le, wǒ bú yào.",
      "german": "Diese Kleidung ist zu teuer, ich will sie nicht.",
      "audioPath": "/audio/examples/ex-hsk1-gui-1.mp3"
    }
  ],
  "hsk1-guo": [
    {
      "hanzi": "中国是一个很大的国家。",
      "pinyin": "Zhōngguó shì yí gè hěn dà de guójiā.",
      "german": "China ist ein sehr großes Land.",
      "audioPath": "/audio/examples/ex-hsk1-guo-1.mp3"
    }
  ],
  "hsk1-hai-still": [
    {
      "hanzi": "我还没有吃饭。",
      "pinyin": "Wǒ hái méiyǒu chī fàn.",
      "german": "Ich habe noch nichts gegessen.",
      "audioPath": "/audio/examples/ex-hsk1-hai-still-1.mp3"
    }
  ],
  "hsk1-haizi": [
    {
      "hanzi": "孩子们在外面玩。",
      "pinyin": "Háizi men zài wàimiàn wán.",
      "german": "Die Kinder spielen draußen.",
      "audioPath": "/audio/examples/ex-hsk1-haizi-1.mp3"
    }
  ],
  "hsk1-hanyu": [
    {
      "hanzi": "你会说汉语吗？",
      "pinyin": "Nǐ huì shuō Hànyǔ ma?",
      "german": "Kannst du Chinesisch sprechen?",
      "audioPath": "/audio/examples/ex-hsk1-hanyu-1.mp3"
    },
    {
      "hanzi": "我喜欢学习汉语。",
      "pinyin": "Wǒ xǐhuan xuéxí Hànyǔ.",
      "german": "Ich lerne gerne Chinesisch.",
      "audioPath": "/audio/examples/ex-hsk1-hanyu-2.mp3"
    }
  ],
  "hsk1-hanzi": [
    {
      "hanzi": "汉字很有意思。",
      "pinyin": "Hànzì hěn yǒu yìsi.",
      "german": "Chinesische Schriftzeichen sind interessant.",
      "audioPath": "/audio/examples/ex-hsk1-hanzi-1.mp3"
    }
  ],
  "hsk1-hao": [
    {
      "hanzi": "今天天气很好，阳光灿烂。",
      "pinyin": "Jīntiān tiānqì hěn hǎo, yángguāng cànlàn.",
      "german": "Heute ist das Wetter sehr gut, der Sonnenschein ist herrlich.",
      "audioPath": "/audio/examples/ex-hsk1-hao-1.mp3"
    },
    {
      "hanzi": "好茶需要慢慢喝。",
      "pinyin": "Hǎo chá xūyào mànmàn hē.",
      "german": "Guten Tee muss man langsam trinken.",
      "audioPath": "/audio/examples/ex-hsk1-hao-2.mp3"
    }
  ],
  "hsk1-hao-number": [
    {
      "hanzi": "今天是八月十五号。",
      "pinyin": "Jīntiān shì bāyuè shíwǔ hào.",
      "german": "Heute ist der 15. August.",
      "audioPath": "/audio/examples/ex-hsk1-hao-number-1.mp3"
    },
    {
      "hanzi": "你的手机号是多少？",
      "pinyin": "Nǐ de shǒujī hào shì duōshao?",
      "german": "Wie lautet deine Handynummer?",
      "audioPath": "/audio/examples/ex-hsk1-hao-number-2.mp3"
    }
  ],
  "hsk1-haochi": [
    {
      "hanzi": "中国菜很好吃。",
      "pinyin": "Zhōngguó cài hěn hǎochī.",
      "german": "Chinesisches Essen schmeckt sehr gut.",
      "audioPath": "/audio/examples/ex-hsk1-haochi-1.mp3"
    }
  ],
  "hsk1-haokan": [
    {
      "hanzi": "她今天穿的衣服真好看。",
      "pinyin": "Tā jīntiān chuān de yīfu zhēn hǎokàn.",
      "german": "Ihre Kleidung heute sieht wirklich schön aus.",
      "audioPath": "/audio/examples/ex-hsk1-haokan-1.mp3"
    }
  ],
  "hsk1-haoting": [
    {
      "hanzi": "她的声音很好听。",
      "pinyin": "Tā de shēngyīn hěn hǎotīng.",
      "german": "Ihre Stimme klingt sehr schön.",
      "audioPath": "/audio/examples/ex-hsk1-haoting-1.mp3"
    }
  ],
  "hsk1-haowaner": [
    {
      "hanzi": "这个地方很好玩儿。",
      "pinyin": "Zhège dìfang hěn hǎowánr.",
      "german": "Dieser Ort ist richtig Spaß.",
      "audioPath": "/audio/examples/ex-hsk1-haowaner-1.mp3"
    }
  ],
  "hsk1-he": [
    {
      "hanzi": "请喝杯热茶。",
      "pinyin": "Qǐng hē bēi rèchá.",
      "german": "Bitte trink eine Tasse heißen Tee.",
      "audioPath": "/audio/examples/ex-hsk1-he-1.mp3"
    },
    {
      "hanzi": "天气很热，多喝水。",
      "pinyin": "Tiānqì hěn rè, duō hē shuǐ.",
      "german": "Das Wetter ist heiß, trink mehr Wasser.",
      "audioPath": "/audio/examples/ex-hsk1-he-2.mp3"
    }
  ],
  "hsk1-he-and": [
    {
      "hanzi": "爸爸和妈妈都很健康。",
      "pinyin": "Bàba hé māma dōu hěn jiànkāng.",
      "german": "Papa und Mama sind beide sehr gesund.",
      "audioPath": "/audio/examples/ex-hsk1-he-and-1.mp3"
    },
    {
      "hanzi": "我和朋友一起去饭馆。",
      "pinyin": "Wǒ hé péngyou yìqǐ qù fànguǎn.",
      "german": "Ich gehe zusammen mit meinem Freund ins Restaurant.",
      "audioPath": "/audio/examples/ex-hsk1-he-and-2.mp3"
    }
  ],
  "hsk1-hen": [
    {
      "hanzi": "中国菜很好吃。",
      "pinyin": "Zhōngguó cài hěn hǎochī.",
      "german": "Chinesisches Essen ist sehr lecker.",
      "audioPath": "/audio/examples/ex-hsk1-hen-1.mp3"
    },
    {
      "hanzi": "今天天气很好。",
      "pinyin": "Jīntiān tiānqì hěn hǎo.",
      "german": "Heute ist das Wetter sehr gut.",
      "audioPath": "/audio/examples/ex-hsk1-hen-2.mp3"
    }
  ],
  "hsk1-hou-behind": [
    {
      "hanzi": "学校在我的家后面。",
      "pinyin": "Xuéxiào zài wǒ de jiā hòumiàn.",
      "german": "Die Schule liegt hinter meinem Haus.",
      "audioPath": "/audio/examples/ex-hsk1-hou-behind-1.mp3"
    }
  ],
  "hsk1-houmian": [
    {
      "hanzi": "饭馆后面是火车站。",
      "pinyin": "Fànguǎn hòumian shì huǒchēzhàn.",
      "german": "Hinter dem Restaurant liegt der Bahnhof.",
      "audioPath": "/audio/examples/ex-hsk1-houmian-1.mp3"
    },
    {
      "hanzi": "小狗跟在后面跑。",
      "pinyin": "Xiǎogǒu gēn zài hòumian pǎo.",
      "german": "Das Hündchen rennt hinterher.",
      "audioPath": "/audio/examples/ex-hsk1-houmian-2.mp3"
    }
  ],
  "hsk1-hui": [
    {
      "hanzi": "我会说一点儿汉语。",
      "pinyin": "Wǒ huì shuō yìdiǎnr Hànyǔ.",
      "german": "Ich kann ein bisschen Chinesisch sprechen.",
      "audioPath": "/audio/examples/ex-hsk1-hui-1.mp3"
    },
    {
      "hanzi": "他会开出租车。",
      "pinyin": "Tā huì kāi chūzūchē.",
      "german": "Er kann Taxi fahren.",
      "audioPath": "/audio/examples/ex-hsk1-hui-2.mp3"
    }
  ],
  "hsk1-hui-return": [
    {
      "hanzi": "我下午五点回家做晚饭。",
      "pinyin": "Wǒ xiàwǔ wǔ diǎn huí jiā zuò wǎnfàn.",
      "german": "Ich kehre um fünf Uhr nachmittags nach Hause zurück, um Abendessen zu kochen.",
      "audioPath": "/audio/examples/ex-hsk1-hui-return-1.mp3"
    },
    {
      "hanzi": "你什么时候回学校？",
      "pinyin": "Nǐ shénme shíhou huí xuéxiào?",
      "german": "Wann kehrst du zur Schule zurück?",
      "audioPath": "/audio/examples/ex-hsk1-hui-return-2.mp3"
    }
  ],
  "hsk1-huoche": [
    {
      "hanzi": "我坐火车去上海。",
      "pinyin": "Wǒ zuò huǒchē qù Shànghǎi.",
      "german": "Ich fahre mit dem Zug nach Shanghai.",
      "audioPath": "/audio/examples/ex-hsk1-huoche-1.mp3"
    }
  ],
  "hsk1-huochezhan": [
    {
      "hanzi": "我坐出租车去火车站。",
      "pinyin": "Wǒ zuò chūzūchē qù huǒchēzhàn.",
      "german": "Ich fahre mit dem Taxi zum Bahnhof.",
      "audioPath": "/audio/examples/ex-hsk1-huochezhan-1.mp3"
    },
    {
      "hanzi": "北京火车站非常大。",
      "pinyin": "Běijīng huǒchēzhàn fēicháng dà.",
      "german": "Der Pekinger Bahnhof ist enorm groß.",
      "audioPath": "/audio/examples/ex-hsk1-huochezhan-2.mp3"
    }
  ],
  "hsk1-ji": [
    {
      "hanzi": "现在几点了？",
      "pinyin": "Xiànzài jǐ diǎn le?",
      "german": "Wie viel Uhr ist es jetzt?",
      "audioPath": "/audio/examples/ex-hsk1-ji-1.mp3"
    },
    {
      "hanzi": "你想买几本书？",
      "pinyin": "Nǐ xiǎng mǎi jǐ běn shū?",
      "german": "Wie viele Bücher möchtest du kaufen?",
      "audioPath": "/audio/examples/ex-hsk1-ji-2.mp3"
    }
  ],
  "hsk1-jia": [
    {
      "hanzi": "我家在北京。",
      "pinyin": "Wǒ jiā zài Běijīng.",
      "german": "Mein Zuhause ist in Peking.",
      "audioPath": "/audio/examples/ex-hsk1-jia-1.mp3"
    },
    {
      "hanzi": "我们下午五点回家。",
      "pinyin": "Wǒmen xiàwǔ wǔ diǎn huí jiā.",
      "german": "Wir kehren nachmittags um fünf Uhr nach Hause zurück.",
      "audioPath": "/audio/examples/ex-hsk1-jia-2.mp3"
    }
  ],
  "hsk1-jian": [
    {
      "hanzi": "我看见他了。",
      "pinyin": "Wǒ kànjiàn tā le.",
      "german": "Ich habe ihn gesehen.",
      "audioPath": "/audio/examples/ex-hsk1-jian-1.mp3"
    }
  ],
  "hsk1-jian-measure": [
    {
      "hanzi": "我买了一件新衣服。",
      "pinyin": "Wǒ mǎi le yí jiàn xīn yīfu.",
      "german": "Ich habe ein neues Kleidungsstück gekauft.",
      "audioPath": "/audio/examples/ex-hsk1-jian-measure-1.mp3"
    }
  ],
  "hsk1-jiao": [
    {
      "hanzi": "我叫李明，你叫什么名字？",
      "pinyin": "Wǒ jiào Lǐ Míng, nǐ jiào shénme míngzi?",
      "german": "Ich heiße Li Ming, wie heißt du?",
      "audioPath": "/audio/examples/ex-hsk1-jiao-1.mp3"
    },
    {
      "hanzi": "妈妈在叫儿子回家吃饭。",
      "pinyin": "Māma zài jiào érzi huí jiā chī fàn.",
      "german": "Mama ruft ihren Sohn nach Hause zum Essen.",
      "audioPath": "/audio/examples/ex-hsk1-jiao-2.mp3"
    }
  ],
  "hsk1-jiaozi": [
    {
      "hanzi": "过年的时候我们吃饺子。",
      "pinyin": "Guònián de shíhou wǒmen chī jiǎozi.",
      "german": "Zu Neujahr essen wir Dumplings.",
      "audioPath": "/audio/examples/ex-hsk1-jiaozi-1.mp3"
    }
  ],
  "hsk1-jiaren": [
    {
      "hanzi": "我想我的家人。",
      "pinyin": "Wǒ xiǎng wǒ de jiārén.",
      "german": "Ich denke an meine Familie.",
      "audioPath": "/audio/examples/ex-hsk1-jiaren-1.mp3"
    }
  ],
  "hsk1-jidan": [
    {
      "hanzi": "早饭我吃了一个鸡蛋。",
      "pinyin": "Zǎofàn wǒ chī le yí gè jīdàn.",
      "german": "Zum Frühstück habe ich ein Ei gegessen.",
      "audioPath": "/audio/examples/ex-hsk1-jidan-1.mp3"
    }
  ],
  "hsk1-jiejie": [
    {
      "hanzi": "我姐姐是医生。",
      "pinyin": "Wǒ jiějie shì yīshēng.",
      "german": "Meine ältere Schwester ist Ärztin.",
      "audioPath": "/audio/examples/ex-hsk1-jiejie-1.mp3"
    }
  ],
  "hsk1-jinnian": [
    {
      "hanzi": "他今年二十岁。",
      "pinyin": "Tā jīnnián èrshí suì.",
      "german": "Er ist dieses Jahr zwanzig Jahre alt.",
      "audioPath": "/audio/examples/ex-hsk1-jinnian-1.mp3"
    }
  ],
  "hsk1-jintian": [
    {
      "hanzi": "今天天气非常好。",
      "pinyin": "Jīntiān tiānqì fēicháng hǎo.",
      "german": "Heute ist das Wetter ganz ausgezeichnet.",
      "audioPath": "/audio/examples/ex-hsk1-jintian-1.mp3"
    },
    {
      "hanzi": "今天星期五，明天休息。",
      "pinyin": "Jīntiān xīngqīwǔ, míngtiān xiūxi.",
      "german": "Heute ist Freitag, morgen haben wir frei.",
      "audioPath": "/audio/examples/ex-hsk1-jintian-2.mp3"
    }
  ],
  "hsk1-jiu": [
    {
      "hanzi": "现在上午九点半。",
      "pinyin": "Xiànzài shàngwǔ jiǔ diǎn bàn.",
      "german": "Jetzt ist es halb zehn Uhr vormittags.",
      "audioPath": "/audio/examples/ex-hsk1-jiu-1.mp3"
    },
    {
      "hanzi": "九月开学了。",
      "pinyin": "Jiǔyuè kāixué le.",
      "german": "Im September hat die Schule begonnen.",
      "audioPath": "/audio/examples/ex-hsk1-jiu-2.mp3"
    }
  ],
  "hsk1-juede": [
    {
      "hanzi": "我觉得这个老师很好。",
      "pinyin": "Wǒ juéde zhège lǎoshī hěn hǎo.",
      "german": "Ich finde, dieser Lehrer ist sehr gut.",
      "audioPath": "/audio/examples/ex-hsk1-juede-1.mp3"
    }
  ],
  "hsk1-kai": [
    {
      "hanzi": "他会开汽车和出租车。",
      "pinyin": "Tā huì kāi qìchē hé chūzūchē.",
      "german": "Er kann Pkw und Taxi fahren.",
      "audioPath": "/audio/examples/ex-hsk1-kai-1.mp3"
    },
    {
      "hanzi": "请开门，我回来了。",
      "pinyin": "Qǐng kāi mén, wǒ huí lai le.",
      "german": "Bitte öffne die Tür, ich bin zurückgekehrt.",
      "audioPath": "/audio/examples/ex-hsk1-kai-2.mp3"
    }
  ],
  "hsk1-kaiche": [
    {
      "hanzi": "我不会开车。",
      "pinyin": "Wǒ bú huì kāichē.",
      "german": "Ich kann nicht Auto fahren.",
      "audioPath": "/audio/examples/ex-hsk1-kaiche-1.mp3"
    }
  ],
  "hsk1-kan": [
    {
      "hanzi": "他在看一本汉语书。",
      "pinyin": "Tā zài kàn yì běn Hànyǔ shū.",
      "german": "Er liest ein Chinesischbuch.",
      "audioPath": "/audio/examples/ex-hsk1-kan-1.mp3"
    },
    {
      "hanzi": "我们一起去看电影吧。",
      "pinyin": "Wǒmen yìqǐ qù kàn diànyǐng ba.",
      "german": "Lass uns zusammen ins Kino gehen.",
      "audioPath": "/audio/examples/ex-hsk1-kan-2.mp3"
    }
  ],
  "hsk1-kanbing": [
    {
      "hanzi": "他生病了，去医院看病。",
      "pinyin": "Tā shēngbìng le, qù yīyuàn kànbìng.",
      "german": "Er ist krank und geht ins Krankenhaus zum Arzt.",
      "audioPath": "/audio/examples/ex-hsk1-kanbing-1.mp3"
    }
  ],
  "hsk1-kanjian": [
    {
      "hanzi": "我看见前面的大商店了。",
      "pinyin": "Wǒ kànjiàn qiánmian de dà shāngdiàn le.",
      "german": "Ich habe das große Geschäft da vorne erblickt.",
      "audioPath": "/audio/examples/ex-hsk1-kanjian-1.mp3"
    },
    {
      "hanzi": "你看见我的水杯了吗？",
      "pinyin": "Nǐ kànjiàn wǒ de shuǐbēi le ma?",
      "german": "Hast du meinen Wasserbecher gesehen?",
      "audioPath": "/audio/examples/ex-hsk1-kanjian-2.mp3"
    }
  ],
  "hsk1-ke": [
    {
      "hanzi": "今天我有四节课。",
      "pinyin": "Jīntiān wǒ yǒu sì jié kè.",
      "german": "Heute habe ich vier Stunden.",
      "audioPath": "/audio/examples/ex-hsk1-ke-1.mp3"
    }
  ],
  "hsk1-keyi": [
    {
      "hanzi": "我可以坐这儿吗？",
      "pinyin": "Wǒ kěyǐ zuò zhèr ma?",
      "german": "Darf ich mich hier hinsetzen?",
      "audioPath": "/audio/examples/ex-hsk1-keyi-1.mp3"
    }
  ],
  "hsk1-kou-mouth": [
    {
      "hanzi": "我家有三口人。",
      "pinyin": "Wǒ jiā yǒu sān kǒu rén.",
      "german": "Zu Hause leben wir zu dritt.",
      "audioPath": "/audio/examples/ex-hsk1-kou-mouth-1.mp3"
    }
  ],
  "hsk1-kuai": [
    {
      "hanzi": "这块手表多少钱？",
      "pinyin": "Zhè kuài shǒubiǎo duōshao qián?",
      "german": "Wie viel kostet diese Armbanduhr?",
      "audioPath": "/audio/examples/ex-hsk1-kuai-1.mp3"
    },
    {
      "hanzi": "这个杯子十块钱。",
      "pinyin": "Zhè ge bēizi shí kuài qián.",
      "german": "Dieser Becher kostet zehn Yuan.",
      "audioPath": "/audio/examples/ex-hsk1-kuai-2.mp3"
    }
  ],
  "hsk1-lai": [
    {
      "hanzi": "欢迎你来中国北京！",
      "pinyin": "Huānyíng nǐ lái Zhōngguó Běijīng!",
      "german": "Willkommen in Peking, China!",
      "audioPath": "/audio/examples/ex-hsk1-lai-1.mp3"
    },
    {
      "hanzi": "老师来了，大家请坐。",
      "pinyin": "Lǎoshī lái le, dàjiā qǐng zuò.",
      "german": "Der Lehrer ist gekommen, bitte setzt euch alle.",
      "audioPath": "/audio/examples/ex-hsk1-lai-2.mp3"
    }
  ],
  "hsk1-laoshi": [
    {
      "hanzi": "王老师教我们汉语。",
      "pinyin": "Wáng lǎoshī jiāo wǒmen Hànyǔ.",
      "german": "Lehrer Wang unterrichtet uns in Chinesisch.",
      "audioPath": "/audio/examples/ex-hsk1-laoshi-1.mp3"
    },
    {
      "hanzi": "老师好！",
      "pinyin": "Lǎoshī hǎo!",
      "german": "Guten Tag, Herr Lehrer!",
      "audioPath": "/audio/examples/ex-hsk1-laoshi-2.mp3"
    }
  ],
  "hsk1-le": [
    {
      "hanzi": "他回北京了。",
      "pinyin": "Tā huí Běijīng le.",
      "german": "Er ist nach Peking zurückgekehrt.",
      "audioPath": "/audio/examples/ex-hsk1-le-1.mp3"
    },
    {
      "hanzi": "太晚了，该睡觉了。",
      "pinyin": "Tài wǎn le, gāi shuìjiào le.",
      "german": "Es ist zu spät geworden, Zeit zum Schlafen.",
      "audioPath": "/audio/examples/ex-hsk1-le-2.mp3"
    }
  ],
  "hsk1-leng": [
    {
      "hanzi": "今天北京天气非常冷。",
      "pinyin": "Jīntiān Běijīng tiānqì fēicháng lěng.",
      "german": "Heute ist das Wetter in Peking ausgesprochen kalt.",
      "audioPath": "/audio/examples/ex-hsk1-leng-1.mp3"
    },
    {
      "hanzi": "我不喜欢喝冷水。",
      "pinyin": "Wǒ bù xǐhuan hē lěngshuǐ.",
      "german": "Ich trinke nicht gerne kaltes Wasser.",
      "audioPath": "/audio/examples/ex-hsk1-leng-2.mp3"
    }
  ],
  "hsk1-li": [
    {
      "hanzi": "书包里有两本书和一个水杯。",
      "pinyin": "Shūbāo li yǒu liǎng běn shū hé yí ge shuǐbēi.",
      "german": "In der Schultasche sind zwei Bücher und ein Wasserbecher.",
      "audioPath": "/audio/examples/ex-hsk1-li-1.mp3"
    },
    {
      "hanzi": "我们在学校里散步。",
      "pinyin": "Wǒmen zài xuéxiào li sànbù.",
      "german": "Wir spazieren auf dem Schulgelände.",
      "audioPath": "/audio/examples/ex-hsk1-li-2.mp3"
    }
  ],
  "hsk1-liang": [
    {
      "hanzi": "我买了两斤苹果。",
      "pinyin": "Wǒ mǎi le liǎng jīn píngguǒ.",
      "german": "Ich habe zwei Pfund Äpfel gekauft.",
      "audioPath": "/audio/examples/ex-hsk1-liang-1.mp3"
    }
  ],
  "hsk1-ling": [
    {
      "hanzi": "今天是二零二六年。",
      "pinyin": "Jīntiān shì èr líng èr liù nián.",
      "german": "Heute ist das Jahr 2026.",
      "audioPath": "/audio/examples/ex-hsk1-ling-1.mp3"
    },
    {
      "hanzi": "房间号是三零一。",
      "pinyin": "Fángjiān hào shì sān líng yī.",
      "german": "Die Zimmernummer lautet 301.",
      "audioPath": "/audio/examples/ex-hsk1-ling-2.mp3"
    }
  ],
  "hsk1-liu": [
    {
      "hanzi": "他六点起床做早饭。",
      "pinyin": "Tā liù diǎn qǐchuáng zuò zǎofàn.",
      "german": "Er steht um sechs Uhr auf, um Frühstück zu machen.",
      "audioPath": "/audio/examples/ex-hsk1-liu-1.mp3"
    },
    {
      "hanzi": "星期六我和朋友去看电影。",
      "pinyin": "Xīngqīliù wǒ hé péngyou qù kàn diànyǐng.",
      "german": "Am Samstag gehe ich mit Freunden ins Kino.",
      "audioPath": "/audio/examples/ex-hsk1-liu-2.mp3"
    }
  ],
  "hsk1-ma": [
    {
      "hanzi": "你想喝杯热茶吗？",
      "pinyin": "Nǐ xiǎng hē bēi rèchá ma?",
      "german": "Möchtest du eine Tasse heißen Tee trinken?",
      "audioPath": "/audio/examples/ex-hsk1-ma-1.mp3"
    },
    {
      "hanzi": "他是你的老师吗？",
      "pinyin": "Tā shì nǐ de lǎoshī ma?",
      "german": "Ist er dein Lehrer?",
      "audioPath": "/audio/examples/ex-hsk1-ma-2.mp3"
    }
  ],
  "hsk1-mai": [
    {
      "hanzi": "我想买几个新鲜的苹果。",
      "pinyin": "Wǒ xiǎng mǎi jǐ ge xīnxiān de píngguǒ.",
      "german": "Ich möchte ein paar frische Äpfel kaufen.",
      "audioPath": "/audio/examples/ex-hsk1-mai-1.mp3"
    },
    {
      "hanzi": "这件衣服在哪里买的？",
      "pinyin": "Zhè jiàn yīfu zài nǎlǐ mǎi de?",
      "german": "Wo hast du dieses Kleidungsstück gekauft?",
      "audioPath": "/audio/examples/ex-hsk1-mai-2.mp3"
    }
  ],
  "hsk1-mai-sell": [
    {
      "hanzi": "他在市场上卖水果。",
      "pinyin": "Tā zài shìchǎng shang mài shuǐguǒ.",
      "german": "Er verkauft Obst auf dem Markt.",
      "audioPath": "/audio/examples/ex-hsk1-mai-sell-1.mp3"
    }
  ],
  "hsk1-mama": [
    {
      "hanzi": "我妈妈做的菜非常好吃。",
      "pinyin": "Wǒ māma zuò de cài fēicháng hǎochī.",
      "german": "Das von meiner Mutter gekochte Essen ist überaus lecker.",
      "audioPath": "/audio/examples/ex-hsk1-mama-1.mp3"
    },
    {
      "hanzi": "妈妈在看书。",
      "pinyin": "Māma zài kàn shū.",
      "german": "Mama liest ein Buch.",
      "audioPath": "/audio/examples/ex-hsk1-mama-2.mp3"
    }
  ],
  "hsk1-mang": [
    {
      "hanzi": "最近工作很忙。",
      "pinyin": "Zuìjìn gōngzuò hěn máng.",
      "german": "Die Arbeit ist gerade sehr anstrengend.",
      "audioPath": "/audio/examples/ex-hsk1-mang-1.mp3"
    }
  ],
  "hsk1-mao": [
    {
      "hanzi": "这只小猫非常可爱。",
      "pinyin": "Zhè zhī xiǎomāo fēicháng kě'ài.",
      "german": "Diese kleine Katze ist ausgesprochen süß.",
      "audioPath": "/audio/examples/ex-hsk1-mao-1.mp3"
    },
    {
      "hanzi": "小猫在椅子下睡觉。",
      "pinyin": "Xiǎomāo zài yǐzi xià shuìjiào.",
      "german": "Die kleine Katze schläft unter dem Stuhl.",
      "audioPath": "/audio/examples/ex-hsk1-mao-2.mp3"
    }
  ],
  "hsk1-mei": [
    {
      "hanzi": "我没有电脑。",
      "pinyin": "Wǒ méiyǒu diànnǎo.",
      "german": "Ich habe keinen Computer.",
      "audioPath": "/audio/examples/ex-hsk1-mei-1.mp3"
    },
    {
      "hanzi": "他今天没来学校。",
      "pinyin": "Tā jīntiān méi lái xuéxiào.",
      "german": "Er ist heute nicht zur Schule gekommen.",
      "audioPath": "/audio/examples/ex-hsk1-mei-2.mp3"
    }
  ],
  "hsk1-meiguanxi": [
    {
      "hanzi": "没关系，这不算什么。",
      "pinyin": "Méi guānxi, zhè bú suàn shénme.",
      "german": "Macht nichts, das ist nicht der Rede wert.",
      "audioPath": "/audio/examples/ex-hsk1-meiguanxi-1.mp3"
    },
    {
      "hanzi": "别担心，真的没关系。",
      "pinyin": "Bié dānxīn, zhēnde méi guānxi.",
      "german": "Keine Sorge, das macht wirklich überhaupt nichts.",
      "audioPath": "/audio/examples/ex-hsk1-meiguanxi-2.mp3"
    }
  ],
  "hsk1-meimei": [
    {
      "hanzi": "我妹妹在上小学。",
      "pinyin": "Wǒ mèimei zài shàng xiǎoxué.",
      "german": "Meine jüngere Schwester besucht die Grundschule.",
      "audioPath": "/audio/examples/ex-hsk1-meimei-1.mp3"
    }
  ],
  "hsk1-meishi": [
    {
      "hanzi": "你没事吧？我来帮你。",
      "pinyin": "Nǐ méishi ba? Wǒ lái bāng nǐ.",
      "german": "Ist alles in Ordnung? Ich helfe dir.",
      "audioPath": "/audio/examples/ex-hsk1-meishi-1.mp3"
    }
  ],
  "hsk1-meiyou": [
    {
      "hanzi": "我没有去过中国北京。",
      "pinyin": "Wǒ méiyǒu qù guo Zhōngguó Běijīng.",
      "german": "Ich bin noch nicht in Peking in China gewesen.",
      "audioPath": "/audio/examples/ex-hsk1-meiyou-1.mp3"
    },
    {
      "hanzi": "桌子上没有水杯。",
      "pinyin": "Zhuōzi shang méiyǒu shuǐbēi.",
      "german": "Auf dem Tisch steht kein Wasserbecher.",
      "audioPath": "/audio/examples/ex-hsk1-meiyou-2.mp3"
    }
  ],
  "hsk1-men": [
    {
      "hanzi": "我们都是学生。",
      "pinyin": "Wǒmen dōu shì xuésheng.",
      "german": "Wir sind alle Schüler.",
      "audioPath": "/audio/examples/ex-hsk1-men-1.mp3"
    }
  ],
  "hsk1-mianbao": [
    {
      "hanzi": "早上我吃了两块面包。",
      "pinyin": "Zǎoshang wǒ chī le liǎng kuài miànbāo.",
      "german": "Morgens habe ich zwei Scheiben Brot gegessen.",
      "audioPath": "/audio/examples/ex-hsk1-mianbao-1.mp3"
    }
  ],
  "hsk1-miantiaoer": [
    {
      "hanzi": "我中午吃面条儿。",
      "pinyin": "Wǒ zhōngwǔ chī miàntiáor.",
      "german": "Mittags esse ich Nudeln.",
      "audioPath": "/audio/examples/ex-hsk1-miantiaoer-1.mp3"
    }
  ],
  "hsk1-mifan": [
    {
      "hanzi": "请给我一碗热米饭。",
      "pinyin": "Qǐng gěi wǒ yì wǎn rè mǐfàn.",
      "german": "Bitte gib mir eine Schale warmen gekochten Reis.",
      "audioPath": "/audio/examples/ex-hsk1-mifan-1.mp3"
    },
    {
      "hanzi": "我喜欢吃菜配米饭。",
      "pinyin": "Wǒ xǐhuan chī cài pèi mǐfàn.",
      "german": "Ich esse gerne Gerichte mit Reis.",
      "audioPath": "/audio/examples/ex-hsk1-mifan-2.mp3"
    }
  ],
  "hsk1-mingnian": [
    {
      "hanzi": "明年我想去中国学习。",
      "pinyin": "Míngnián wǒ xiǎng qù Zhōngguó xuéxí.",
      "german": "Nächstes Jahr möchte ich in China studieren.",
      "audioPath": "/audio/examples/ex-hsk1-mingnian-1.mp3"
    }
  ],
  "hsk1-mingtian": [
    {
      "hanzi": "明天是星期日。",
      "pinyin": "Míngtiān shì xīngqīrì.",
      "german": "Morgen ist Sonntag.",
      "audioPath": "/audio/examples/ex-hsk1-mingtian-1.mp3"
    },
    {
      "hanzi": "明天我们去看电影。",
      "pinyin": "Míngtiān wǒmen qù kàn diànyǐng.",
      "german": "Morgen schauen wir einen Film.",
      "audioPath": "/audio/examples/ex-hsk1-mingtian-2.mp3"
    }
  ],
  "hsk1-mingzi": [
    {
      "hanzi": "你的名字怎么写？",
      "pinyin": "Nǐ de míngzi zěnme xiě?",
      "german": "Wie schreibt man deinen Namen?",
      "audioPath": "/audio/examples/ex-hsk1-mingzi-1.mp3"
    },
    {
      "hanzi": "他的名字叫大卫。",
      "pinyin": "Tā de míngzi jiào Dàwèi.",
      "german": "Sein Name lautet David.",
      "audioPath": "/audio/examples/ex-hsk1-mingzi-2.mp3"
    }
  ],
  "hsk1-na": [
    {
      "hanzi": "那是李医生的衣服。",
      "pinyin": "Nà shì Lǐ yīshēng de yīfu.",
      "german": "Das dort ist die Kleidung von Arzt Li.",
      "audioPath": "/audio/examples/ex-hsk1-na-1.mp3"
    },
    {
      "hanzi": "那家商店很大。",
      "pinyin": "Nà jiā shāngdiàn hěn dà.",
      "german": "Jener Laden dort ist sehr groß.",
      "audioPath": "/audio/examples/ex-hsk1-na-2.mp3"
    }
  ],
  "hsk1-na-which": [
    {
      "hanzi": "你想买哪件衣服？",
      "pinyin": "Nǐ xiǎng mǎi nǎ jiàn yīfu?",
      "german": "Welches Kleidungsstück möchtest du kaufen?",
      "audioPath": "/audio/examples/ex-hsk1-na-which-1.mp3"
    },
    {
      "hanzi": "你是哪国人？",
      "pinyin": "Nǐ shì nǎ guó rén?",
      "german": "Aus welchem Land kommst du?",
      "audioPath": "/audio/examples/ex-hsk1-na-which-2.mp3"
    }
  ],
  "hsk1-nabian": [
    {
      "hanzi": "我的朋友在那边。",
      "pinyin": "Wǒ de péngyou zài nàbiān.",
      "german": "Mein Freund ist dort drüben.",
      "audioPath": "/audio/examples/ex-hsk1-nabian-1.mp3"
    }
  ],
  "hsk1-naer": [
    {
      "hanzi": "我的书在那儿。",
      "pinyin": "Wǒ de shū zài nàr.",
      "german": "Mein Buch liegt dort drüben.",
      "audioPath": "/audio/examples/ex-hsk1-naer-1.mp3"
    },
    {
      "hanzi": "火车站在那儿前面。",
      "pinyin": "Huǒchēzhàn zài nàr qiánmian.",
      "german": "Der Bahnhof ist dort vorne.",
      "audioPath": "/audio/examples/ex-hsk1-naer-2.mp3"
    }
  ],
  "hsk1-naer-which": [
    {
      "hanzi": "请问，洗手间在哪儿？",
      "pinyin": "Qǐngwèn, xǐshǒujiān zài nǎr?",
      "german": "Darf ich fragen, wo die Toilette ist?",
      "audioPath": "/audio/examples/ex-hsk1-naer-which-1.mp3"
    },
    {
      "hanzi": "你明天想去哪儿？",
      "pinyin": "Nǐ míngtiān xiǎng qù nǎr?",
      "german": "Wohin möchtest du morgen gehen?",
      "audioPath": "/audio/examples/ex-hsk1-naer-which-2.mp3"
    }
  ],
  "hsk1-nage": [
    {
      "hanzi": "你最喜欢哪个？",
      "pinyin": "Nǐ zuì xǐhuan nǎge?",
      "german": "Welches magst du am liebsten?",
      "audioPath": "/audio/examples/ex-hsk1-nage-1.mp3"
    }
  ],
  "hsk1-nage-that": [
    {
      "hanzi": "那个书包是你的吗？",
      "pinyin": "Nà ge shūbāo shì nǐ de ma?",
      "german": "Ist die Tasche dort deine?",
      "audioPath": "/audio/examples/ex-hsk1-nage-that-1.mp3"
    }
  ],
  "hsk1-nali": [
    {
      "hanzi": "你的家在哪里？",
      "pinyin": "Nǐ de jiā zài nǎlǐ?",
      "german": "Wo wohnst du?",
      "audioPath": "/audio/examples/ex-hsk1-nali-1.mp3"
    }
  ],
  "hsk1-nali-there": [
    {
      "hanzi": "那里有一个商店。",
      "pinyin": "Nàlǐ yǒu yí gè shāngdiàn.",
      "german": "Dort ist ein Laden.",
      "audioPath": "/audio/examples/ex-hsk1-nali-there-1.mp3"
    }
  ],
  "hsk1-nan": [
    {
      "hanzi": "班里有很多男同学。",
      "pinyin": "Bān lǐ yǒu hěn duō nán tóngxué.",
      "german": "In der Klasse sind viele Jungen.",
      "audioPath": "/audio/examples/ex-hsk1-nan-1.mp3"
    }
  ],
  "hsk1-nanpengyou": [
    {
      "hanzi": "她男朋友是老师。",
      "pinyin": "Tā nánpéngyou shì lǎoshī.",
      "german": "Ihr Freund ist Lehrer.",
      "audioPath": "/audio/examples/ex-hsk1-nanpengyou-1.mp3"
    }
  ],
  "hsk1-naxie": [
    {
      "hanzi": "你喜欢哪些水果？",
      "pinyin": "Nǐ xǐhuan nǎxiē shuǐguǒ?",
      "german": "Welche Früchte magst du?",
      "audioPath": "/audio/examples/ex-hsk1-naxie-1.mp3"
    }
  ],
  "hsk1-naxie-those": [
    {
      "hanzi": "那些书是谁的？",
      "pinyin": "Nàxiē shū shì shéi de?",
      "german": "Wessen Bücher sind das?",
      "audioPath": "/audio/examples/ex-hsk1-naxie-those-1.mp3"
    }
  ],
  "hsk1-ne": [
    {
      "hanzi": "我是学生，你呢？",
      "pinyin": "Wǒ shì xuésheng, nǐ ne?",
      "german": "Ich bin Schüler, und du?",
      "audioPath": "/audio/examples/ex-hsk1-ne-1.mp3"
    },
    {
      "hanzi": "我的书呢？在桌子上。",
      "pinyin": "Wǒ de shū ne? Zài zhuōzi shang.",
      "german": "Wo ist mein Buch? Auf dem Tisch.",
      "audioPath": "/audio/examples/ex-hsk1-ne-2.mp3"
    }
  ],
  "hsk1-neng": [
    {
      "hanzi": "明天你能来我家吃饭吗？",
      "pinyin": "Míngtiān nǐ néng lái wǒ jiā chī fàn ma?",
      "german": "Kannst du morgen zu mir nach Hause zum Essen kommen?",
      "audioPath": "/audio/examples/ex-hsk1-neng-1.mp3"
    },
    {
      "hanzi": "这里不能大声说话。",
      "pinyin": "Zhèlǐ bù néng dà shēng shuōhuà.",
      "german": "Hier darf man nicht laut sprechen.",
      "audioPath": "/audio/examples/ex-hsk1-neng-2.mp3"
    }
  ],
  "hsk1-ni": [
    {
      "hanzi": "你是学生还是老师？",
      "pinyin": "Nǐ shì xuésheng háishi lǎoshī?",
      "german": "Bist du Schüler oder Lehrer?",
      "audioPath": "/audio/examples/ex-hsk1-ni-1.mp3"
    },
    {
      "hanzi": "你想吃点儿什么？",
      "pinyin": "Nǐ xiǎng chī diǎnr shénme?",
      "german": "Was möchtest du gerne essen?",
      "audioPath": "/audio/examples/ex-hsk1-ni-2.mp3"
    }
  ],
  "hsk1-nian": [
    {
      "hanzi": "他今年二十五岁。",
      "pinyin": "Tā jīnnián èrshíwǔ suì.",
      "german": "Er ist dieses Jahr 25 Jahre alt.",
      "audioPath": "/audio/examples/ex-hsk1-nian-1.mp3"
    },
    {
      "hanzi": "他在中国学了一年汉语。",
      "pinyin": "Tā zài Zhōngguó xué le yì nián Hànyǔ.",
      "german": "Er hat ein Jahr lang in China Chinesisch gelernt.",
      "audioPath": "/audio/examples/ex-hsk1-nian-2.mp3"
    }
  ],
  "hsk1-nihao": [
    {
      "hanzi": "你好！很高兴认识你。",
      "pinyin": "Nǐ hǎo! Hěn gāoxìng rènshi nǐ.",
      "german": "Hallo! Sehr erfreut, dich kennenzulernen.",
      "audioPath": "/audio/examples/ex-hsk1-nihao-1.mp3"
    },
    {
      "hanzi": "你好吗？我很好。",
      "pinyin": "Nǐ hǎo ma? Wǒ hěn hǎo.",
      "german": "Wie geht es dir? Mir geht es gut.",
      "audioPath": "/audio/examples/ex-hsk1-nihao-2.mp3"
    }
  ],
  "hsk1-nimen": [
    {
      "hanzi": "你们想喝什么？",
      "pinyin": "Nǐmen xiǎng hē shénme?",
      "german": "Was möchtet ihr trinken?",
      "audioPath": "/audio/examples/ex-hsk1-nimen-1.mp3"
    }
  ],
  "hsk1-nin": [
    {
      "hanzi": "您好，王老师！",
      "pinyin": "Nín hǎo, Wáng lǎoshī!",
      "german": "Guten Tag, Herr Lehrer Wang!",
      "audioPath": "/audio/examples/ex-hsk1-nin-1.mp3"
    },
    {
      "hanzi": "请问您想喝点儿什么？",
      "pinyin": "Qǐngwèn nín xiǎng hē diǎnr shénme?",
      "german": "Darf ich fragen, was Sie gerne trinken möchten?",
      "audioPath": "/audio/examples/ex-hsk1-nin-2.mp3"
    }
  ],
  "hsk1-niunai": [
    {
      "hanzi": "我每天早上喝牛奶。",
      "pinyin": "Wǒ měitiān zǎoshang hē niúnǎi.",
      "german": "Ich trinke jeden Morgen Milch.",
      "audioPath": "/audio/examples/ex-hsk1-niunai-1.mp3"
    }
  ],
  "hsk1-nv": [
    {
      "hanzi": "她是我们班的女生。",
      "pinyin": "Tā shì wǒmen bān de nǚshēng.",
      "german": "Sie ist die Schülerin in unserer Klasse.",
      "audioPath": "/audio/examples/ex-hsk1-nv-1.mp3"
    }
  ],
  "hsk1-nver": [
    {
      "hanzi": "李医生的女儿很漂亮。",
      "pinyin": "Lǐ yīshēng de nǚ'ér hěn piàoliang.",
      "german": "Die Tochter von Arzt Li ist sehr hübsch.",
      "audioPath": "/audio/examples/ex-hsk1-nver-1.mp3"
    },
    {
      "hanzi": "她的女儿会说汉语。",
      "pinyin": "Tā de nǚ'ér huì shuō Hànyǔ.",
      "german": "Ihre Tochter kann Chinesisch sprechen.",
      "audioPath": "/audio/examples/ex-hsk1-nver-2.mp3"
    }
  ],
  "hsk1-nvpengyou": [
    {
      "hanzi": "我女朋友在德国。",
      "pinyin": "Wǒ nǚpéngyou zài Déguó.",
      "german": "Meine Freundin ist in Deutschland.",
      "audioPath": "/audio/examples/ex-hsk1-nvpengyou-1.mp3"
    }
  ],
  "hsk1-nvshi": [
    {
      "hanzi": "这位女士是我的老师。",
      "pinyin": "Zhè wèi nǚshì shì wǒ de lǎoshī.",
      "german": "Diese Dame ist meine Lehrerin.",
      "audioPath": "/audio/examples/ex-hsk1-nvshi-1.mp3"
    }
  ],
  "hsk1-pengyou": [
    {
      "hanzi": "他是我的好朋友。",
      "pinyin": "Tā shì wǒ de hǎo péngyou.",
      "german": "Er ist mein guter Freund.",
      "audioPath": "/audio/examples/ex-hsk1-pengyou-1.mp3"
    },
    {
      "hanzi": "我有三个中国朋友。",
      "pinyin": "Wǒ yǒu sān ge Zhōngguó péngyou.",
      "german": "Ich habe drei chinesische Freunde.",
      "audioPath": "/audio/examples/ex-hsk1-pengyou-2.mp3"
    }
  ],
  "hsk1-pianyi": [
    {
      "hanzi": "这个苹果很便宜。",
      "pinyin": "Zhège píngguǒ hěn piányi.",
      "german": "Dieser Apfel ist sehr billig.",
      "audioPath": "/audio/examples/ex-hsk1-pianyi-1.mp3"
    }
  ],
  "hsk1-piaoliang": [
    {
      "hanzi": "这件衣服真漂亮！",
      "pinyin": "Zhè jiàn yīfu zhēn piàoliang!",
      "german": "Dieses Kleidungsstück ist wirklich bildschön!",
      "audioPath": "/audio/examples/ex-hsk1-piaoliang-1.mp3"
    },
    {
      "hanzi": "北京的秋天很漂亮。",
      "pinyin": "Běijīng de qiūtiān hěn piàoliang.",
      "german": "Der Herbst in Peking ist wunderschön.",
      "audioPath": "/audio/examples/ex-hsk1-piaoliang-2.mp3"
    }
  ],
  "hsk1-pingguo": [
    {
      "hanzi": "我想买五个红苹果。",
      "pinyin": "Wǒ xiǎng mǎi wǔ ge hóng píngguǒ.",
      "german": "Ich möchte fünf rote Äpfel kaufen.",
      "audioPath": "/audio/examples/ex-hsk1-pingguo-1.mp3"
    },
    {
      "hanzi": "苹果很好吃，我很喜欢。",
      "pinyin": "Píngguǒ hěn hǎochī, wǒ hěn xǐhuan.",
      "german": "Äpfel sind sehr lecker, ich mag sie sehr.",
      "audioPath": "/audio/examples/ex-hsk1-pingguo-2.mp3"
    }
  ],
  "hsk1-qi": [
    {
      "hanzi": "一个星期有七天。",
      "pinyin": "Yí ge xīngqī yǒu qī tiān.",
      "german": "Eine Woche hat sieben Tage.",
      "audioPath": "/audio/examples/ex-hsk1-qi-1.mp3"
    },
    {
      "hanzi": "今天七月七号。",
      "pinyin": "Jīntiān qīyuè qī hào.",
      "german": "Heute ist der 7. Juli.",
      "audioPath": "/audio/examples/ex-hsk1-qi-2.mp3"
    }
  ],
  "hsk1-qian": [
    {
      "hanzi": "这个苹果多少钱？",
      "pinyin": "Zhè ge píngguǒ duōshao qián?",
      "german": "Wie viel Geld kostet dieser Apfel?",
      "audioPath": "/audio/examples/ex-hsk1-qian-1.mp3"
    },
    {
      "hanzi": "我钱包里没有钱了。",
      "pinyin": "Wǒ qiánbāo li méiyǒu qián le.",
      "german": "In meiner Geldbörse ist kein Geld mehr.",
      "audioPath": "/audio/examples/ex-hsk1-qian-2.mp3"
    }
  ],
  "hsk1-qian-front": [
    {
      "hanzi": "学校前面有一个公园。",
      "pinyin": "Xuéxiào qiánmiàn yǒu yí gè gōngyuán.",
      "german": "Vor der Schule ist ein Park.",
      "audioPath": "/audio/examples/ex-hsk1-qian-front-1.mp3"
    }
  ],
  "hsk1-qian-thousand": [
    {
      "hanzi": "这个手机三千块钱。",
      "pinyin": "Zhège shǒujī sān qiān kuài qián.",
      "german": "Dieses Handy kostet dreitausend Yuan.",
      "audioPath": "/audio/examples/ex-hsk1-qian-thousand-1.mp3"
    }
  ],
  "hsk1-qianmian": [
    {
      "hanzi": "学校前面有一家大超市。",
      "pinyin": "Xuéxiào qiánmian yǒu yì jiā dà chāoshì.",
      "german": "Vor der Schule befindet sich ein großer Supermarkt.",
      "audioPath": "/audio/examples/ex-hsk1-qianmian-1.mp3"
    },
    {
      "hanzi": "王先生坐在我前面。",
      "pinyin": "Wáng xiānsheng zuò zài wǒ qiánmian.",
      "german": "Herr Wang sitzt vor mir.",
      "audioPath": "/audio/examples/ex-hsk1-qianmian-2.mp3"
    }
  ],
  "hsk1-qichuang": [
    {
      "hanzi": "我每天七点起床。",
      "pinyin": "Wǒ měitiān qī diǎn qǐchuáng.",
      "german": "Ich stehe jeden Tag um sieben auf.",
      "audioPath": "/audio/examples/ex-hsk1-qichuang-1.mp3"
    }
  ],
  "hsk1-qing": [
    {
      "hanzi": "请进，请坐，请喝茶！",
      "pinyin": "Qǐng jìn, qǐng zuò, qǐng hē chá!",
      "german": "Bitte herein, bitte nimm Platz, bitte trink Tee!",
      "audioPath": "/audio/examples/ex-hsk1-qing-1.mp3"
    },
    {
      "hanzi": "我想请你去看电影。",
      "pinyin": "Wǒ xiǎng qǐng nǐ qù kàn diànyǐng.",
      "german": "Ich möchte dich ins Kino einladen.",
      "audioPath": "/audio/examples/ex-hsk1-qing-2.mp3"
    }
  ],
  "hsk1-qingwen": [
    {
      "hanzi": "请问，去火车站怎么走？",
      "pinyin": "Qǐngwèn, qù huǒchēzhàn zěnme zǒu?",
      "german": "Entschuldigen Sie, wie komme ich zum Bahnhof?",
      "audioPath": "/audio/examples/ex-hsk1-qingwen-1.mp3"
    }
  ],
  "hsk1-qu": [
    {
      "hanzi": "我们明天去北京看电影。",
      "pinyin": "Wǒmen míngtiān qù Běijīng kàn diànyǐng.",
      "german": "Wir fahren morgen nach Peking ins Kino.",
      "audioPath": "/audio/examples/ex-hsk1-qu-1.mp3"
    },
    {
      "hanzi": "你想去哪儿吃饭？",
      "pinyin": "Nǐ xiǎng qù nǎr chī fàn?",
      "german": "Wohin möchtest du essen gehen?",
      "audioPath": "/audio/examples/ex-hsk1-qu-2.mp3"
    }
  ],
  "hsk1-qunian": [
    {
      "hanzi": "去年我去过中国。",
      "pinyin": "Qùnián wǒ qùguo Zhōngguó.",
      "german": "Letztes Jahr war ich in China.",
      "audioPath": "/audio/examples/ex-hsk1-qunian-1.mp3"
    }
  ],
  "hsk1-re": [
    {
      "hanzi": "夏天天气很热，请喝冷水。",
      "pinyin": "Xiàtiān tiānqì hěn rè, qǐng hē lěngshuǐ.",
      "german": "Im Sommer ist das Wetter sehr heiß, bitte trink kaltes Wasser.",
      "audioPath": "/audio/examples/ex-hsk1-re-1.mp3"
    },
    {
      "hanzi": "这杯热茶很香。",
      "pinyin": "Zhè bēi rèchá hěn xiāng.",
      "german": "Diese Tasse heißer Tee duftet herrlich.",
      "audioPath": "/audio/examples/ex-hsk1-re-2.mp3"
    }
  ],
  "hsk1-ren": [
    {
      "hanzi": "中国人很友好。",
      "pinyin": "Zhōngguó rén hěn yǒuhǎo.",
      "german": "Chinesen sind sehr freundlich.",
      "audioPath": "/audio/examples/ex-hsk1-ren-1.mp3"
    },
    {
      "hanzi": "商店里有很多买东西的人。",
      "pinyin": "Shāngdiàn li yǒu hěn duō mǎi dōngxi de rén.",
      "german": "Im Laden sind viele einkaufende Menschen.",
      "audioPath": "/audio/examples/ex-hsk1-ren-2.mp3"
    }
  ],
  "hsk1-renshi": [
    {
      "hanzi": "很高兴认识你！",
      "pinyin": "Hěn gāoxìng rènshi nǐ!",
      "german": "Sehr erfreut, dich kennenzulernen!",
      "audioPath": "/audio/examples/ex-hsk1-renshi-1.mp3"
    },
    {
      "hanzi": "你认识那位医生吗？",
      "pinyin": "Nǐ rènshi nà wèi yīshēng ma?",
      "german": "Kennst du jenen Arzt dort?",
      "audioPath": "/audio/examples/ex-hsk1-renshi-2.mp3"
    }
  ],
  "hsk1-ri": [
    {
      "hanzi": "今天是十月一日。",
      "pinyin": "Jīntiān shì shíyuè yī rì.",
      "german": "Heute ist der erste Oktober.",
      "audioPath": "/audio/examples/ex-hsk1-ri-1.mp3"
    },
    {
      "hanzi": "星期日我们去看电影。",
      "pinyin": "Xīngqīrì wǒmen qù kàn diànyǐng.",
      "german": "Am Sonntag gehen wir ins Kino.",
      "audioPath": "/audio/examples/ex-hsk1-ri-2.mp3"
    }
  ],
  "hsk1-san": [
    {
      "hanzi": "我家有三口人。",
      "pinyin": "Wǒ jiā yǒu sān kǒu rén.",
      "german": "Meine Familie besteht aus drei Personen.",
      "audioPath": "/audio/examples/ex-hsk1-san-1.mp3"
    },
    {
      "hanzi": "他在北京住了三年。",
      "pinyin": "Tā zài Běijīng zhù le sān nián.",
      "german": "Er hat drei Jahre in Peking gewohnt.",
      "audioPath": "/audio/examples/ex-hsk1-san-2.mp3"
    }
  ],
  "hsk1-shang": [
    {
      "hanzi": "书在桌子上面。",
      "pinyin": "Shū zài zhuōzi shàngmian.",
      "german": "Das Buch liegt oben auf dem Tisch.",
      "audioPath": "/audio/examples/ex-hsk1-shang-1.mp3"
    },
    {
      "hanzi": "我们上车吧。",
      "pinyin": "Wǒmen shàng chē ba.",
      "german": "Lass uns einsteigen.",
      "audioPath": "/audio/examples/ex-hsk1-shang-2.mp3"
    }
  ],
  "hsk1-shangban": [
    {
      "hanzi": "我八点去上班。",
      "pinyin": "Wǒ bā diǎn qù shàngbān.",
      "german": "Ich gehe um acht zur Arbeit.",
      "audioPath": "/audio/examples/ex-hsk1-shangban-1.mp3"
    }
  ],
  "hsk1-shangdian": [
    {
      "hanzi": "这家商店卖新鲜的水果。",
      "pinyin": "Zhè jiā shāngdiàn mài xīnxiān de shuǐguǒ.",
      "german": "Dieses Geschäft verkauft frisches Obst.",
      "audioPath": "/audio/examples/ex-hsk1-shangdian-1.mp3"
    },
    {
      "hanzi": "我去商店买一件衣服。",
      "pinyin": "Wǒ qù shāngdiàn mǎi yí jiàn yīfu.",
      "german": "Ich gehe in den Laden, um ein Kleidungsstück zu kaufen.",
      "audioPath": "/audio/examples/ex-hsk1-shangdian-2.mp3"
    }
  ],
  "hsk1-shangke": [
    {
      "hanzi": "上课的时候请不要说话。",
      "pinyin": "Shàngkè de shíhou qǐng bú yào shuōhuà.",
      "german": "Bitte rede während des Unterrichts nicht.",
      "audioPath": "/audio/examples/ex-hsk1-shangke-1.mp3"
    }
  ],
  "hsk1-shangwu": [
    {
      "hanzi": "上午八点我们开始上课。",
      "pinyin": "Shàngwǔ bā diǎn wǒmen kāishǐ shàng kè.",
      "german": "Vormittags um acht Uhr beginnen wir mit dem Unterricht.",
      "audioPath": "/audio/examples/ex-hsk1-shangwu-1.mp3"
    },
    {
      "hanzi": "今天上午我看了两小时书。",
      "pinyin": "Jīntiān shàngwǔ wǒ kàn le liǎng xiǎoshí shū.",
      "german": "Heute Vormittag habe ich zwei Stunden lang gelesen.",
      "audioPath": "/audio/examples/ex-hsk1-shangwu-2.mp3"
    }
  ],
  "hsk1-shangxue": [
    {
      "hanzi": "孩子们每天走路上学。",
      "pinyin": "Háizi men měitiān zǒulù shàngxué.",
      "german": "Die Kinder gehen jeden Tag zu Fuß zur Schule.",
      "audioPath": "/audio/examples/ex-hsk1-shangxue-1.mp3"
    }
  ],
  "hsk1-shao": [
    {
      "hanzi": "他的汉语词汇还很少。",
      "pinyin": "Tā de Hànyǔ cíhuì hái hěn shǎo.",
      "german": "Sein chinesischer Wortschatz ist noch recht klein.",
      "audioPath": "/audio/examples/ex-hsk1-shao-1.mp3"
    },
    {
      "hanzi": "少吃多餐对身体好。",
      "pinyin": "Shǎo chī duō cān duì shēntǐ hǎo.",
      "german": "Wenig, aber dafür häufiger zu essen, tut dem Körper gut.",
      "audioPath": "/audio/examples/ex-hsk1-shao-2.mp3"
    }
  ],
  "hsk1-shei": [
    {
      "hanzi": "那个人是谁？",
      "pinyin": "Nà ge rén shì shéi?",
      "german": "Wer ist diese Person dort?",
      "audioPath": "/audio/examples/ex-hsk1-shei-1.mp3"
    },
    {
      "hanzi": "谁想喝水？",
      "pinyin": "Shéi xiǎng hē shuǐ?",
      "german": "Wer möchte Wasser trinken?",
      "audioPath": "/audio/examples/ex-hsk1-shei-2.mp3"
    }
  ],
  "hsk1-shengbing": [
    {
      "hanzi": "他生病了，没来上课。",
      "pinyin": "Tā shēngbìng le, méi lái shàngkè.",
      "german": "Er ist krank und hat den Unterricht versäumt.",
      "audioPath": "/audio/examples/ex-hsk1-shengbing-1.mp3"
    }
  ],
  "hsk1-shenme": [
    {
      "hanzi": "你叫什么名字？",
      "pinyin": "Nǐ jiào shénme míngzi?",
      "german": "Wie heißt du mit Namen?",
      "audioPath": "/audio/examples/ex-hsk1-shenme-1.mp3"
    },
    {
      "hanzi": "你想吃什么？",
      "pinyin": "Nǐ xiǎng chī shénme?",
      "german": "Was möchtest du essen?",
      "audioPath": "/audio/examples/ex-hsk1-shenme-2.mp3"
    }
  ],
  "hsk1-shi": [
    {
      "hanzi": "学校里有十个老师。",
      "pinyin": "Xuéxiào li yǒu shí ge lǎoshī.",
      "german": "In der Schule gibt es zehn Lehrer.",
      "audioPath": "/audio/examples/ex-hsk1-shi-1.mp3"
    },
    {
      "hanzi": "现在是十点十分。",
      "pinyin": "Xiànzài shì shí diǎn shí fēn.",
      "german": "Jetzt ist es zehn Uhr zehn.",
      "audioPath": "/audio/examples/ex-hsk1-shi-2.mp3"
    }
  ],
  "hsk1-shi-be": [
    {
      "hanzi": "我是学生。",
      "pinyin": "Wǒ shì xuésheng.",
      "german": "Ich bin Schüler.",
      "audioPath": "/audio/examples/ex-hsk1-shi-be-1.mp3"
    },
    {
      "hanzi": "明天是星期一。",
      "pinyin": "Míngtiān shì xīngqīyī.",
      "german": "Morgen ist Montag.",
      "audioPath": "/audio/examples/ex-hsk1-shi-be-2.mp3"
    }
  ],
  "hsk1-shi-thing": [
    {
      "hanzi": "你有什么事吗？",
      "pinyin": "Nǐ yǒu shénme shì ma?",
      "german": "Hast du etwas?",
      "audioPath": "/audio/examples/ex-hsk1-shi-thing-1.mp3"
    }
  ],
  "hsk1-shihou": [
    {
      "hanzi": "你什么时候来北京？",
      "pinyin": "Nǐ shénme shíhou lái Běijīng?",
      "german": "Wann kommst du nach Peking?",
      "audioPath": "/audio/examples/ex-hsk1-shihou-1.mp3"
    },
    {
      "hanzi": "吃饭的时候不要看手机。",
      "pinyin": "Chī fàn de shíhou bú yào kàn shǒujī.",
      "german": "Beim Essen soll man nicht aufs Smartphone schauen.",
      "audioPath": "/audio/examples/ex-hsk1-shihou-2.mp3"
    }
  ],
  "hsk1-shijian": [
    {
      "hanzi": "你今天下午有时间吗？",
      "pinyin": "Nǐ jīntiān xiàwǔ yǒu shíjiān ma?",
      "german": "Hast du heute Nachmittag Zeit?",
      "audioPath": "/audio/examples/ex-hsk1-shijian-1.mp3"
    },
    {
      "hanzi": "学习汉语需要时间。",
      "pinyin": "Xuéxí Hànyǔ xūyào shíjiān.",
      "german": "Chinesisch lernen braucht Zeit.",
      "audioPath": "/audio/examples/ex-hsk1-shijian-2.mp3"
    }
  ],
  "hsk1-shouji": [
    {
      "hanzi": "我没有手机。",
      "pinyin": "Wǒ méiyǒu shǒujī.",
      "german": "Ich habe kein Handy.",
      "audioPath": "/audio/examples/ex-hsk1-shouji-1.mp3"
    }
  ],
  "hsk1-shu": [
    {
      "hanzi": "我在看一本很有趣的书。",
      "pinyin": "Wǒ zài kàn yì běn hěn yǒuqù de shū.",
      "german": "Ich lese ein sehr interessantes Buch.",
      "audioPath": "/audio/examples/ex-hsk1-shu-1.mp3"
    },
    {
      "hanzi": "桌子上放着汉语书。",
      "pinyin": "Zhuōzi shang fàng zhe Hànyǔ shū.",
      "german": "Auf dem Tisch liegt ein Chinesischbuch.",
      "audioPath": "/audio/examples/ex-hsk1-shu-2.mp3"
    }
  ],
  "hsk1-shudian": [
    {
      "hanzi": "我在书店买了一本词典。",
      "pinyin": "Wǒ zài shūdiàn mǎi le yì běn cídiǎn.",
      "german": "Ich habe im Buchladen ein Wörterbuch gekauft.",
      "audioPath": "/audio/examples/ex-hsk1-shudian-1.mp3"
    }
  ],
  "hsk1-shui": [
    {
      "hanzi": "你想喝水吗？",
      "pinyin": "Nǐ xiǎng hē shuǐ ma?",
      "german": "Möchtest du Wasser trinken?",
      "audioPath": "/audio/examples/ex-hsk1-shui-1.mp3"
    },
    {
      "hanzi": "桌子上有杯温水。",
      "pinyin": "Zhuōzi shang yǒu bēi wēnshuǐ.",
      "german": "Auf dem Tisch steht ein Glas lauwarmes Wasser.",
      "audioPath": "/audio/examples/ex-hsk1-shui-2.mp3"
    }
  ],
  "hsk1-shui-sleep": [
    {
      "hanzi": "孩子已经睡了。",
      "pinyin": "Háizi yǐjīng shuì le.",
      "german": "Das Kind schläft schon.",
      "audioPath": "/audio/examples/ex-hsk1-shui-sleep-1.mp3"
    }
  ],
  "hsk1-shuiguo": [
    {
      "hanzi": "桌子上有新鲜的水果。",
      "pinyin": "Zhuōzi shang yǒu xīnxiān de shuǐguǒ.",
      "german": "Auf dem Tisch steht frisches Obst.",
      "audioPath": "/audio/examples/ex-hsk1-shuiguo-1.mp3"
    },
    {
      "hanzi": "多吃水果对身体好。",
      "pinyin": "Duō chī shuǐguǒ duì shēntǐ hǎo.",
      "german": "Mehr Früchte zu essen tut dem Körper gut.",
      "audioPath": "/audio/examples/ex-hsk1-shuiguo-2.mp3"
    }
  ],
  "hsk1-shuijiao": [
    {
      "hanzi": "现在很晚了，快去睡觉吧。",
      "pinyin": "Xiànzài hěn wǎn le, kuài qù shuìjiào ba.",
      "german": "Jetzt ist es sehr spät, geh rasch schlafen.",
      "audioPath": "/audio/examples/ex-hsk1-shuijiao-1.mp3"
    },
    {
      "hanzi": "小猫在阳光下睡觉。",
      "pinyin": "Xiǎomāo zài yángguāng xià shuìjiào.",
      "german": "Die kleine Katze schläft im Sonnenschein.",
      "audioPath": "/audio/examples/ex-hsk1-shuijiao-2.mp3"
    }
  ],
  "hsk1-shuo": [
    {
      "hanzi": "请您慢一点儿说。",
      "pinyin": "Qǐng nín màn yìdiǎnr shuō.",
      "german": "Bitte sprechen Sie ein wenig langsamer.",
      "audioPath": "/audio/examples/ex-hsk1-shuo-1.mp3"
    },
    {
      "hanzi": "你会说汉语吗？",
      "pinyin": "Nǐ huì shuō Hànyǔ ma?",
      "german": "Kannst du Chinesisch sprechen?",
      "audioPath": "/audio/examples/ex-hsk1-shuo-2.mp3"
    }
  ],
  "hsk1-shuohua": [
    {
      "hanzi": "他在跟朋友打电话说话。",
      "pinyin": "Tā zài gēn péngyou dǎ diànhuà shuōhuà.",
      "german": "Er telefoniert und unterhält sich mit einem Freund.",
      "audioPath": "/audio/examples/ex-hsk1-shuohua-1.mp3"
    },
    {
      "hanzi": "看电影时请不要说话。",
      "pinyin": "Kàn diànyǐng shí qǐng bú yào shuōhuà.",
      "german": "Beim Filmeschauen bitte nicht sprechen.",
      "audioPath": "/audio/examples/ex-hsk1-shuohua-2.mp3"
    }
  ],
  "hsk1-si": [
    {
      "hanzi": "我有四个中国同学。",
      "pinyin": "Wǒ yǒu sì ge Zhōngguó tóngxué.",
      "german": "Ich habe vier chinesische Mitschüler.",
      "audioPath": "/audio/examples/ex-hsk1-si-1.mp3"
    },
    {
      "hanzi": "现在下午四点整。",
      "pinyin": "Xiànzài xiàwǔ sì diǎn zhěng.",
      "german": "Jetzt ist es genau vier Uhr nachmittags.",
      "audioPath": "/audio/examples/ex-hsk1-si-2.mp3"
    }
  ],
  "hsk1-sui": [
    {
      "hanzi": "他今年十八岁。",
      "pinyin": "Tā jīnnián shíbā suì.",
      "german": "Er ist dieses Jahr 18 Jahre alt.",
      "audioPath": "/audio/examples/ex-hsk1-sui-1.mp3"
    },
    {
      "hanzi": "你的女儿几岁了？",
      "pinyin": "Nǐ de nǚ'ér jǐ suì le?",
      "german": "Wie alt ist deine Tochter?",
      "audioPath": "/audio/examples/ex-hsk1-sui-2.mp3"
    }
  ],
  "hsk1-ta": [
    {
      "hanzi": "他是我的汉语老师。",
      "pinyin": "Tā shì wǒ de Hànyǔ lǎoshī.",
      "german": "Er ist mein Chinesischlehrer.",
      "audioPath": "/audio/examples/ex-hsk1-ta-1.mp3"
    },
    {
      "hanzi": "他在北京大学学习。",
      "pinyin": "Tā zài Běijīng Dàxué xuéxí.",
      "german": "Er studiert an der Peking-Universität.",
      "audioPath": "/audio/examples/ex-hsk1-ta-2.mp3"
    }
  ],
  "hsk1-ta-it": [
    {
      "hanzi": "这只猫很可爱，它是我的。",
      "pinyin": "Zhè zhī māo hěn kě’ài, tā shì wǒ de.",
      "german": "Diese Katze ist süß, sie gehört mir.",
      "audioPath": "/audio/examples/ex-hsk1-ta-it-1.mp3"
    }
  ],
  "hsk1-ta-nv": [
    {
      "hanzi": "她是一位很温柔的医生。",
      "pinyin": "Tā shì yí wèi hěn wēnróu de yīshēng.",
      "german": "Sie ist eine sehr einfühlsame Ärztin.",
      "audioPath": "/audio/examples/ex-hsk1-ta-nv-1.mp3"
    },
    {
      "hanzi": "她的衣服真漂亮。",
      "pinyin": "Tā de yīfu zhēn piàoliang.",
      "german": "Ihre Kleidung ist wirklich hübsch.",
      "audioPath": "/audio/examples/ex-hsk1-ta-nv-2.mp3"
    }
  ],
  "hsk1-tai": [
    {
      "hanzi": "太好了，明天不用上课！",
      "pinyin": "Tài hǎo le, míngtiān bú yòng shàng kè!",
      "german": "Großartig, morgen haben wir schulfrei!",
      "audioPath": "/audio/examples/ex-hsk1-tai-1.mp3"
    },
    {
      "hanzi": "今天太热了，想吃西瓜。",
      "pinyin": "Jīntiān tài rè le, xiǎng chī xīguā.",
      "german": "Heute ist es zu heiß, ich möchte Wassermelone essen.",
      "audioPath": "/audio/examples/ex-hsk1-tai-2.mp3"
    }
  ],
  "hsk1-tamen": [
    {
      "hanzi": "他们都在医院工作。",
      "pinyin": "Tāmen dōu zài yīyuàn gōngzuò.",
      "german": "Sie arbeiten alle im Krankenhaus.",
      "audioPath": "/audio/examples/ex-hsk1-tamen-1.mp3"
    },
    {
      "hanzi": "他们是我的同班同学。",
      "pinyin": "Tāmen shì wǒ de tóngbān tóngxué.",
      "german": "Sie sind meine Klassenkameraden.",
      "audioPath": "/audio/examples/ex-hsk1-tamen-2.mp3"
    }
  ],
  "hsk1-tamen-they-female": [
    {
      "hanzi": "她们是我的同学。",
      "pinyin": "Tāmen shì wǒ de tóngxué.",
      "german": "Sie sind meine Mitschülerinnen.",
      "audioPath": "/audio/examples/ex-hsk1-tamen-they-female-1.mp3"
    }
  ],
  "hsk1-tamen-they-things": [
    {
      "hanzi": "这些书是新的，它们很有意思。",
      "pinyin": "Zhèxiē shū shì xīn de, tāmen hěn yǒu yìsi.",
      "german": "Diese Bücher sind neu, sie sind interessant.",
      "audioPath": "/audio/examples/ex-hsk1-tamen-they-things-1.mp3"
    }
  ],
  "hsk1-tian-day": [
    {
      "hanzi": "今天很热。",
      "pinyin": "Jīntiān hěn rè.",
      "german": "Heute ist es heiß.",
      "audioPath": "/audio/examples/ex-hsk1-tian-day-1.mp3"
    }
  ],
  "hsk1-tianqi": [
    {
      "hanzi": "今天天气真好，很晴朗。",
      "pinyin": "Jīntiān tiānqì zhēn hǎo, hěn qínglǎng.",
      "german": "Heute ist das Wetter wirklich schön und heiter.",
      "audioPath": "/audio/examples/ex-hsk1-tianqi-1.mp3"
    },
    {
      "hanzi": "北京冬天的天气很冷。",
      "pinyin": "Běijīng dōngtiān de tiānqì hěn lěng.",
      "german": "Das Wetter im Pekinger Winter ist sehr kalt.",
      "audioPath": "/audio/examples/ex-hsk1-tianqi-2.mp3"
    }
  ],
  "hsk1-ting": [
    {
      "hanzi": "我喜欢听中国音乐。",
      "pinyin": "Wǒ xǐhuan tīng Zhōngguó yīnyuè.",
      "german": "Ich höre gerne chinesische Musik.",
      "audioPath": "/audio/examples/ex-hsk1-ting-1.mp3"
    },
    {
      "hanzi": "请大家认真听老师说。",
      "pinyin": "Qǐng dàjiā rènzhēn tīng lǎoshī shuō.",
      "german": "Bitte hört alle aufmerksam dem Lehrer zu.",
      "audioPath": "/audio/examples/ex-hsk1-ting-2.mp3"
    }
  ],
  "hsk1-tingjian": [
    {
      "hanzi": "你听见音乐了吗？",
      "pinyin": "Nǐ tīngjiàn yīnyuè le ma?",
      "german": "Hast du die Musik gehört?",
      "audioPath": "/audio/examples/ex-hsk1-tingjian-1.mp3"
    }
  ],
  "hsk1-tongxue": [
    {
      "hanzi": "我和同学一起学习汉语。",
      "pinyin": "Wǒ hé tóngxué yìqǐ xuéxí Hànyǔ.",
      "german": "Ich lerne zusammen mit meinem Mitschüler Chinesisch.",
      "audioPath": "/audio/examples/ex-hsk1-tongxue-1.mp3"
    },
    {
      "hanzi": "这些都是我的同学。",
      "pinyin": "Zhèxiē dōu shì wǒ de tóngxué.",
      "german": "Das hier sind alle meine Mitschüler.",
      "audioPath": "/audio/examples/ex-hsk1-tongxue-2.mp3"
    }
  ],
  "hsk1-wai-outside": [
    {
      "hanzi": "外面在下雨。",
      "pinyin": "Wàimiàn zài xià yǔ.",
      "german": "Draußen regnet es.",
      "audioPath": "/audio/examples/ex-hsk1-wai-outside-1.mp3"
    }
  ],
  "hsk1-waibian": [
    {
      "hanzi": "孩子们在外边玩。",
      "pinyin": "Háizi men zài wàibian wán.",
      "german": "Die Kinder spielen draußen.",
      "audioPath": "/audio/examples/ex-hsk1-waibian-1.mp3"
    }
  ],
  "hsk1-wan-evening": [
    {
      "hanzi": "现在很晚了，我要睡觉了。",
      "pinyin": "Xiànzài hěn wǎn le, wǒ yào shuìjiào le.",
      "german": "Es ist schon spät, ich gehe schlafen.",
      "audioPath": "/audio/examples/ex-hsk1-wan-evening-1.mp3"
    }
  ],
  "hsk1-wan-play": [
    {
      "hanzi": "周末我和朋友出去玩。",
      "pinyin": "Zhōumò wǒ hé péngyou chūqù wán.",
      "german": "Am Wochenende gehe ich mit Freunden spielen.",
      "audioPath": "/audio/examples/ex-hsk1-wan-play-1.mp3"
    }
  ],
  "hsk1-wanfan": [
    {
      "hanzi": "晚饭我们吃饺子。",
      "pinyin": "Wǎnfàn wǒmen chī jiǎozi.",
      "german": "Zum Abendessen essen wir Dumplings.",
      "audioPath": "/audio/examples/ex-hsk1-wanfan-1.mp3"
    }
  ],
  "hsk1-wanshang": [
    {
      "hanzi": "晚上我在家学习。",
      "pinyin": "Wǎnshang wǒ zài jiā xuéxí.",
      "german": "Abends lerne ich zu Hause.",
      "audioPath": "/audio/examples/ex-hsk1-wanshang-1.mp3"
    }
  ],
  "hsk1-wei": [
    {
      "hanzi": "喂，请问王老师在吗？",
      "pinyin": "Wèi, qǐngwèn Wáng lǎoshī zài ma?",
      "german": "Hallo, ist Herr Lehrer Wang bitte da?",
      "audioPath": "/audio/examples/ex-hsk1-wei-1.mp3"
    },
    {
      "hanzi": "喂，你好！我是大卫。",
      "pinyin": "Wèi, nǐ hǎo! Wǒ shì Dàwèi.",
      "german": "Hallo, guten Tag! Hier spricht David.",
      "audioPath": "/audio/examples/ex-hsk1-wei-2.mp3"
    }
  ],
  "hsk1-wen-ask": [
    {
      "hanzi": "我问你一个问题。",
      "pinyin": "Wǒ wèn nǐ yí ge wèntí.",
      "german": "Ich habe eine Frage an dich.",
      "audioPath": "/audio/examples/ex-hsk1-wen-ask-1.mp3"
    }
  ],
  "hsk1-wenti": [
    {
      "hanzi": "这个问题很简单。",
      "pinyin": "Zhège wèntí hěn jiǎndān.",
      "german": "Diese Frage ist ganz einfach.",
      "audioPath": "/audio/examples/ex-hsk1-wenti-1.mp3"
    }
  ],
  "hsk1-wo": [
    {
      "hanzi": "我是德国人，我在学汉语。",
      "pinyin": "Wǒ shì Déguó rén, wǒ zài xué Hànyǔ.",
      "german": "Ich bin Deutscher, ich lerne Chinesisch.",
      "audioPath": "/audio/examples/ex-hsk1-wo-1.mp3"
    },
    {
      "hanzi": "我喜欢喝中国茶。",
      "pinyin": "Wǒ xǐhuan hē Zhōngguó chá.",
      "german": "Ich trinke gerne chinesischen Tee.",
      "audioPath": "/audio/examples/ex-hsk1-wo-2.mp3"
    }
  ],
  "hsk1-women": [
    {
      "hanzi": "我们去中国饭馆吃饭吧。",
      "pinyin": "Wǒmen qù Zhōngguó fànguǎn chī fàn ba.",
      "german": "Lass uns ins chinesische Restaurant essen gehen.",
      "audioPath": "/audio/examples/ex-hsk1-women-1.mp3"
    },
    {
      "hanzi": "我们都是好朋友。",
      "pinyin": "Wǒmen dōu shì hǎo péngyou.",
      "german": "Wir sind alle gute Freunde.",
      "audioPath": "/audio/examples/ex-hsk1-women-2.mp3"
    }
  ],
  "hsk1-wu": [
    {
      "hanzi": "这件衣服五十块。",
      "pinyin": "Zhè jiàn yīfu wǔshí kuài.",
      "german": "Dieses Kleidungsstück kostet fünfzig Yuan.",
      "audioPath": "/audio/examples/ex-hsk1-wu-1.mp3"
    },
    {
      "hanzi": "五点我们在饭馆见面。",
      "pinyin": "Wǔ diǎn wǒmen zài fànguǎn jiànmiàn.",
      "german": "Um fünf Uhr treffen wir uns im Restaurant.",
      "audioPath": "/audio/examples/ex-hsk1-wu-2.mp3"
    }
  ],
  "hsk1-wufan": [
    {
      "hanzi": "午饭我吃米饭和菜。",
      "pinyin": "Wǔfàn wǒ chī mǐfàn hé cài.",
      "german": "Mittags esse ich Reis und Gemüse.",
      "audioPath": "/audio/examples/ex-hsk1-wufan-1.mp3"
    }
  ],
  "hsk1-xia": [
    {
      "hanzi": "小猫在桌子下面睡觉。",
      "pinyin": "Xiǎomāo zài zhuōzi xiàmian shuìjiào.",
      "german": "Die kleine Katze schläft unter dem Tisch.",
      "audioPath": "/audio/examples/ex-hsk1-xia-1.mp3"
    },
    {
      "hanzi": "外面正在下雨。",
      "pinyin": "Wàimiàn zhèngzài xià yǔ.",
      "german": "Draußen regnet es gerade.",
      "audioPath": "/audio/examples/ex-hsk1-xia-2.mp3"
    }
  ],
  "hsk1-xiaban": [
    {
      "hanzi": "爸爸六点下班。",
      "pinyin": "Bàba liù diǎn xiàbān.",
      "german": "Papa hat um sechs Feierabend.",
      "audioPath": "/audio/examples/ex-hsk1-xiaban-1.mp3"
    }
  ],
  "hsk1-xiake": [
    {
      "hanzi": "下课了，我们去食堂吧。",
      "pinyin": "Xiàkè le, wǒmen qù shítáng ba.",
      "german": "Die Stunde ist vorbei, lass uns zur Mensa gehen.",
      "audioPath": "/audio/examples/ex-hsk1-xiake-1.mp3"
    }
  ],
  "hsk1-xiang": [
    {
      "hanzi": "我想喝一杯热茶。",
      "pinyin": "Wǒ xiǎng hē yì bēi rèchá.",
      "german": "Ich möchte eine Tasse heißen Tee trinken.",
      "audioPath": "/audio/examples/ex-hsk1-xiang-1.mp3"
    },
    {
      "hanzi": "你在想什么呢？",
      "pinyin": "Nǐ zài xiǎng shénme ne?",
      "german": "Woran denkst du gerade?",
      "audioPath": "/audio/examples/ex-hsk1-xiang-2.mp3"
    }
  ],
  "hsk1-xiansheng": [
    {
      "hanzi": "张先生在北京开公司。",
      "pinyin": "Zhāng xiānsheng zài Běijīng kāi gōngsī.",
      "german": "Herr Zhang leitet eine Firma in Peking.",
      "audioPath": "/audio/examples/ex-hsk1-xiansheng-1.mp3"
    },
    {
      "hanzi": "这位先生想买电脑。",
      "pinyin": "Zhè wèi xiānsheng xiǎng mǎi diànnǎo.",
      "german": "Dieser Herr möchte einen Computer kaufen.",
      "audioPath": "/audio/examples/ex-hsk1-xiansheng-2.mp3"
    }
  ],
  "hsk1-xianzai": [
    {
      "hanzi": "现在几点钟了？",
      "pinyin": "Xiànzài jǐ diǎn zhōng le?",
      "german": "Wie viel Uhr ist es jetzt?",
      "audioPath": "/audio/examples/ex-hsk1-xianzai-1.mp3"
    },
    {
      "hanzi": "我现在在学校图书馆。",
      "pinyin": "Wǒ xiànzài zài xuéxiào túshūguǎn.",
      "german": "Ich befinde mich jetzt in der Schulbibliothek.",
      "audioPath": "/audio/examples/ex-hsk1-xianzai-2.mp3"
    }
  ],
  "hsk1-xiao": [
    {
      "hanzi": "那只小猫在跑。",
      "pinyin": "Nà zhī xiǎomāo zài pǎo.",
      "german": "Jene kleine Katze rennt.",
      "audioPath": "/audio/examples/ex-hsk1-xiao-1.mp3"
    },
    {
      "hanzi": "小杯子里有茶。",
      "pinyin": "Xiǎo bēizi li yǒu chá.",
      "german": "In der kleinen Tasse ist Tee.",
      "audioPath": "/audio/examples/ex-hsk1-xiao-2.mp3"
    }
  ],
  "hsk1-xiaojie": [
    {
      "hanzi": "李小姐在商店买衣服。",
      "pinyin": "Lǐ xiǎojie zài shāngdiàn mǎi yīfu.",
      "german": "Fräulein Li kauft im Geschäft Kleidung.",
      "audioPath": "/audio/examples/ex-hsk1-xiaojie-1.mp3"
    },
    {
      "hanzi": "王小姐非常客气。",
      "pinyin": "Wáng xiǎojie fēicháng kèqi.",
      "german": "Fräulein Wang ist überaus höflich.",
      "audioPath": "/audio/examples/ex-hsk1-xiaojie-2.mp3"
    }
  ],
  "hsk1-xiaopengyou": [
    {
      "hanzi": "小朋友们，你们好！",
      "pinyin": "Xiǎopéngyǒu men, nǐmen hǎo!",
      "german": "Hallo Kinder!",
      "audioPath": "/audio/examples/ex-hsk1-xiaopengyou-1.mp3"
    }
  ],
  "hsk1-xiaoshi": [
    {
      "hanzi": "我每天工作八小时。",
      "pinyin": "Wǒ měitiān gōngzuò bā xiǎoshí.",
      "german": "Ich arbeite jeden Tag acht Stunden.",
      "audioPath": "/audio/examples/ex-hsk1-xiaoshi-1.mp3"
    }
  ],
  "hsk1-xiaoxue": [
    {
      "hanzi": "我妹妹在上小学。",
      "pinyin": "Wǒ mèimei zài shàng xiǎoxué.",
      "german": "Meine jüngere Schwester geht in die Grundschule.",
      "audioPath": "/audio/examples/ex-hsk1-xiaoxue-1.mp3"
    }
  ],
  "hsk1-xiaoxuesheng": [
    {
      "hanzi": "小朋友们都很认真。",
      "pinyin": "Xiǎopéngyǒu men dōu hěn rènzhēn.",
      "german": "Die Kinder sind alle sehr fleißig.",
      "audioPath": "/audio/examples/ex-hsk1-xiaoxuesheng-1.mp3"
    }
  ],
  "hsk1-xiawu": [
    {
      "hanzi": "下午三点我去火车站接朋友。",
      "pinyin": "Xiàwǔ sān diǎn wǒ qù huǒchēzhàn jiē péngyou.",
      "german": "Nachmittags um drei Uhr fahre ich zum Bahnhof, um einen Freund abzuholen.",
      "audioPath": "/audio/examples/ex-hsk1-xiawu-1.mp3"
    },
    {
      "hanzi": "今天下午没有汉语课。",
      "pinyin": "Jīntiān xiàwǔ méiyǒu Hànyǔ kè.",
      "german": "Heute Nachmittag gibt es keinen Chinesischunterricht.",
      "audioPath": "/audio/examples/ex-hsk1-xiawu-2.mp3"
    }
  ],
  "hsk1-xiayu": [
    {
      "hanzi": "外面下雨了，带上雨伞吧。",
      "pinyin": "Wàimiàn xià yǔ le, dài shang yǔsǎn ba.",
      "german": "Draußen regnet es, nimm einen Regenschirm mit.",
      "audioPath": "/audio/examples/ex-hsk1-xiayu-1.mp3"
    },
    {
      "hanzi": "明天可能不会下雨。",
      "pinyin": "Míngtiān kěnéng bú huì xià yǔ.",
      "german": "Morgen wird es vermutlich nicht regnen.",
      "audioPath": "/audio/examples/ex-hsk1-xiayu-2.mp3"
    }
  ],
  "hsk1-xie": [
    {
      "hanzi": "我想买些水果。",
      "pinyin": "Wǒ xiǎng mǎi xiē shuǐguǒ.",
      "german": "Ich möchte etwas Obst kaufen.",
      "audioPath": "/audio/examples/ex-hsk1-xie-1.mp3"
    },
    {
      "hanzi": "这些菜非常好吃。",
      "pinyin": "Zhèxiē cài fēicháng hǎochī.",
      "german": "Diese Gerichte schmecken ganz hervorragend.",
      "audioPath": "/audio/examples/ex-hsk1-xie-2.mp3"
    }
  ],
  "hsk1-xie-write": [
    {
      "hanzi": "你会写汉字吗？",
      "pinyin": "Nǐ huì xiě hànzì ma?",
      "german": "Kannst du chinesische Schriftzeichen schreiben?",
      "audioPath": "/audio/examples/ex-hsk1-xie-write-1.mp3"
    },
    {
      "hanzi": "他在桌子上写名字。",
      "pinyin": "Tā zài zhuōzi shang xiě míngzi.",
      "german": "Er schreibt seinen Namen auf dem Tisch.",
      "audioPath": "/audio/examples/ex-hsk1-xie-write-2.mp3"
    }
  ],
  "hsk1-xiexie": [
    {
      "hanzi": "谢谢你的帮助！",
      "pinyin": "Xièxie nǐ de bāngzhù!",
      "german": "Danke für deine Hilfe!",
      "audioPath": "/audio/examples/ex-hsk1-xiexie-1.mp3"
    },
    {
      "hanzi": "“谢谢！”——“不客气。”",
      "pinyin": "“Xièxie!” —— “Bú kèqi.”",
      "german": "„Danke!“ — „Keine Ursache.“",
      "audioPath": "/audio/examples/ex-hsk1-xiexie-2.mp3"
    }
  ],
  "hsk1-xihuan": [
    {
      "hanzi": "我喜欢吃中国菜。",
      "pinyin": "Wǒ xǐhuan chī Zhōngguó cài.",
      "german": "Ich esse gerne chinesisches Essen.",
      "audioPath": "/audio/examples/ex-hsk1-xihuan-1.mp3"
    },
    {
      "hanzi": "你喜欢喝茶还是水？",
      "pinyin": "Nǐ xǐhuan hē chá háishi shuǐ?",
      "german": "Trinkst du lieber Tee oder Wasser?",
      "audioPath": "/audio/examples/ex-hsk1-xihuan-2.mp3"
    }
  ],
  "hsk1-xin": [
    {
      "hanzi": "这是我的新书包。",
      "pinyin": "Zhè shì wǒ de xīn shūbāo.",
      "german": "Das ist meine neue Schultasche.",
      "audioPath": "/audio/examples/ex-hsk1-xin-1.mp3"
    }
  ],
  "hsk1-xingqi": [
    {
      "hanzi": "今天星期几？",
      "pinyin": "Jīntiān xīngqī jǐ?",
      "german": "Welcher Wochentag ist heute?",
      "audioPath": "/audio/examples/ex-hsk1-xingqi-1.mp3"
    },
    {
      "hanzi": "一个星期有七天。",
      "pinyin": "Yí ge xīngqī yǒu qī tiān.",
      "german": "Eine Woche hat sieben Tage.",
      "audioPath": "/audio/examples/ex-hsk1-xingqi-2.mp3"
    }
  ],
  "hsk1-xingqiri": [
    {
      "hanzi": "星期日我们不上班。",
      "pinyin": "Xīngqīrì wǒmen bù shàngbān.",
      "german": "Sonntags arbeiten wir nicht.",
      "audioPath": "/audio/examples/ex-hsk1-xingqiri-1.mp3"
    }
  ],
  "hsk1-xingqitian": [
    {
      "hanzi": "明天是星期天。",
      "pinyin": "Míngtiān shì xīngqītiān.",
      "german": "Morgen ist Sonntag.",
      "audioPath": "/audio/examples/ex-hsk1-xingqitian-1.mp3"
    }
  ],
  "hsk1-xiuxi": [
    {
      "hanzi": "累了，休息一会儿吧。",
      "pinyin": "Lèi le, xiūxi yíhuìr ba.",
      "german": "Du bist müde, ruh dich mal aus.",
      "audioPath": "/audio/examples/ex-hsk1-xiuxi-1.mp3"
    }
  ],
  "hsk1-xue-learn": [
    {
      "hanzi": "我学中文很久了。",
      "pinyin": "Wǒ xué Zhōngwén hěn jiǔ le.",
      "german": "Ich lerne seit Langem Chinesisch.",
      "audioPath": "/audio/examples/ex-hsk1-xue-learn-1.mp3"
    }
  ],
  "hsk1-xue-snow": [
    {
      "hanzi": "昨天下了雪。",
      "pinyin": "Zuótiān xià le xuě.",
      "german": "Gestern hat es geschneit.",
      "audioPath": "/audio/examples/ex-hsk1-xue-snow-1.mp3"
    }
  ],
  "hsk1-xuesheng": [
    {
      "hanzi": "他是我们学校的学生。",
      "pinyin": "Tā shì wǒmen xuéxiào de xuésheng.",
      "german": "Er ist Schüler an unserer Schule.",
      "audioPath": "/audio/examples/ex-hsk1-xuesheng-1.mp3"
    },
    {
      "hanzi": "大学生在图书馆看书。",
      "pinyin": "Dàxuéshēng zài túshūguǎn kàn shū.",
      "german": "Die Universitätsstudenten lesen in der Bibliothek.",
      "audioPath": "/audio/examples/ex-hsk1-xuesheng-2.mp3"
    }
  ],
  "hsk1-xuexi": [
    {
      "hanzi": "我每天在学校认真学习汉语。",
      "pinyin": "Wǒ měitiān zài xuéxiào rènzhēn xuéxí Hànyǔ.",
      "german": "Ich lerne jeden Tag gewissenhaft Chinesisch in der Schule.",
      "audioPath": "/audio/examples/ex-hsk1-xuexi-1.mp3"
    },
    {
      "hanzi": "学习汉语很有意思。",
      "pinyin": "Xuéxí Hànyǔ hěn yǒu yìsi.",
      "german": "Chinesisch zu lernen ist sehr interessant.",
      "audioPath": "/audio/examples/ex-hsk1-xuexi-2.mp3"
    }
  ],
  "hsk1-xuexiao": [
    {
      "hanzi": "我在学校学习汉语。",
      "pinyin": "Wǒ zài xuéxiào xuéxí Hànyǔ.",
      "german": "Ich lerne in der Schule Chinesisch.",
      "audioPath": "/audio/examples/ex-hsk1-xuexiao-1.mp3"
    },
    {
      "hanzi": "我们学校很大。",
      "pinyin": "Wǒmen xuéxiào hěn dà.",
      "german": "Unsere Schule ist sehr groß.",
      "audioPath": "/audio/examples/ex-hsk1-xuexiao-2.mp3"
    }
  ],
  "hsk1-yao-want": [
    {
      "hanzi": "我要一杯水。",
      "pinyin": "Wǒ yào yì bēi shuǐ.",
      "german": "Ich möchte ein Glas Wasser.",
      "audioPath": "/audio/examples/ex-hsk1-yao-want-1.mp3"
    }
  ],
  "hsk1-ye-also": [
    {
      "hanzi": "他学汉语，我也学汉语。",
      "pinyin": "Tā xué Hànyǔ, wǒ yě xué Hànyǔ.",
      "german": "Er lernt Chinesisch, ich auch.",
      "audioPath": "/audio/examples/ex-hsk1-ye-also-1.mp3"
    }
  ],
  "hsk1-yi": [
    {
      "hanzi": "我想买一本书。",
      "pinyin": "Wǒ xiǎng mǎi yì běn shū.",
      "german": "Ich möchte ein Buch kaufen.",
      "audioPath": "/audio/examples/ex-hsk1-yi-1.mp3"
    },
    {
      "hanzi": "桌子上有一个杯子。",
      "pinyin": "Zhuōzi shang yǒu yí ge bēizi.",
      "german": "Auf dem Tisch steht eine Tasse.",
      "audioPath": "/audio/examples/ex-hsk1-yi-2.mp3"
    }
  ],
  "hsk1-yiban": [
    {
      "hanzi": "一半苹果在工作包里。",
      "pinyin": "Yíbàn píngguǒ zài gōngzuò bāo lǐ.",
      "german": "Der halbe Apfel ist in der Tasche.",
      "audioPath": "/audio/examples/ex-hsk1-yiban-1.mp3"
    }
  ],
  "hsk1-yidianer": [
    {
      "hanzi": "我会说一点儿汉语。",
      "pinyin": "Wǒ huì shuō yìdiǎnr Hànyǔ.",
      "german": "Ich kann ein wenig Chinesisch sprechen.",
      "audioPath": "/audio/examples/ex-hsk1-yidianer-1.mp3"
    }
  ],
  "hsk1-yifu": [
    {
      "hanzi": "这件新衣服真好看。",
      "pinyin": "Zhè jiàn xīn yīfu zhēn hǎokàn.",
      "german": "Dieses neue Kleidungsstück sieht wirklich gut aus.",
      "audioPath": "/audio/examples/ex-hsk1-yifu-1.mp3"
    },
    {
      "hanzi": "天气冷了，多穿衣服。",
      "pinyin": "Tiānqì lěng le, duō chuān yīfu.",
      "german": "Das Wetter ist kalt geworden, zieh mehr Kleidung an.",
      "audioPath": "/audio/examples/ex-hsk1-yifu-2.mp3"
    }
  ],
  "hsk1-yisheng": [
    {
      "hanzi": "他是大医院的医生。",
      "pinyin": "Tā shì dà yīyuàn de yīshēng.",
      "german": "Er ist Arzt in einem großen Krankenhaus.",
      "audioPath": "/audio/examples/ex-hsk1-yisheng-1.mp3"
    },
    {
      "hanzi": "去看医生吧。",
      "pinyin": "Qù kàn yīshēng ba.",
      "german": "Geh bitte zum Arzt.",
      "audioPath": "/audio/examples/ex-hsk1-yisheng-2.mp3"
    }
  ],
  "hsk1-yixia": [
    {
      "hanzi": "请等一下，我马上来。",
      "pinyin": "Qǐng děng yíxià, wǒ mǎshang lái.",
      "german": "Warte bitte einen Moment, ich komme gleich.",
      "audioPath": "/audio/examples/ex-hsk1-yixia-1.mp3"
    }
  ],
  "hsk1-yixie": [
    {
      "hanzi": "我想买一些水果。",
      "pinyin": "Wǒ xiǎng mǎi yìxiē shuǐguǒ.",
      "german": "Ich möchte etwas Obst kaufen.",
      "audioPath": "/audio/examples/ex-hsk1-yixie-1.mp3"
    }
  ],
  "hsk1-yiyuan": [
    {
      "hanzi": "他生病了，要去医院看医生。",
      "pinyin": "Tā shēngbìng le, yào qù yīyuàn kàn yīshēng.",
      "german": "Er ist krank geworden und muss ins Krankenhaus zum Arzt.",
      "audioPath": "/audio/examples/ex-hsk1-yiyuan-1.mp3"
    },
    {
      "hanzi": "医院就在火车站前面。",
      "pinyin": "Yīyuàn jiù zài huǒchēzhàn qiánmian.",
      "german": "Das Krankenhaus liegt direkt vor dem Bahnhof.",
      "audioPath": "/audio/examples/ex-hsk1-yiyuan-2.mp3"
    }
  ],
  "hsk1-yizi": [
    {
      "hanzi": "请坐在椅子上休息。",
      "pinyin": "Qǐng zuò zài yǐzi shang xiūxi.",
      "german": "Bitte setz dich auf den Stuhl und ruh dich aus.",
      "audioPath": "/audio/examples/ex-hsk1-yizi-1.mp3"
    },
    {
      "hanzi": "房间里有四把椅子。",
      "pinyin": "Fángjiān li yǒu sì bǎ yǐzi.",
      "german": "Im Zimmer stehen vier Stühle.",
      "audioPath": "/audio/examples/ex-hsk1-yizi-2.mp3"
    }
  ],
  "hsk1-you": [
    {
      "hanzi": "桌子上有一本书。",
      "pinyin": "Zhuōzi shang yǒu yì běn shū.",
      "german": "Auf dem Tisch liegt ein Buch.",
      "audioPath": "/audio/examples/ex-hsk1-you-1.mp3"
    },
    {
      "hanzi": "你家有几口人？",
      "pinyin": "Nǐ jiā yǒu jǐ kǒu rén.",
      "german": "Wie viele Personen hat deine Familie?",
      "audioPath": "/audio/examples/ex-hsk1-you-2.mp3"
    }
  ],
  "hsk1-youde": [
    {
      "hanzi": "有的人喜欢吃辣。",
      "pinyin": "Yǒu de rén xǐhuan chī là.",
      "german": "Manche Menschen mögen Scharfes.",
      "audioPath": "/audio/examples/ex-hsk1-youde-1.mp3"
    }
  ],
  "hsk1-youdianer": [
    {
      "hanzi": "今天有点儿冷。",
      "pinyin": "Jīntiān yǒudiǎnr lěng.",
      "german": "Heute ist es etwas kalt.",
      "audioPath": "/audio/examples/ex-hsk1-youdianer-1.mp3"
    }
  ],
  "hsk1-youxie": [
    {
      "hanzi": "有些同学已经会写汉字了。",
      "pinyin": "Yǒuxiē tóngxué yǐjīng huì xiě hànzì le.",
      "german": "Manche Schüler können schon Schriftzeichen schreiben.",
      "audioPath": "/audio/examples/ex-hsk1-youxie-1.mp3"
    }
  ],
  "hsk1-yu": [
    {
      "hanzi": "外面雨很大。",
      "pinyin": "Wàimiàn yǔ hěn dà.",
      "german": "Draußen regnet es stark.",
      "audioPath": "/audio/examples/ex-hsk1-yu-1.mp3"
    }
  ],
  "hsk1-yuan": [
    {
      "hanzi": "这个书包八十元。",
      "pinyin": "Zhège shūbāo bāshí yuán.",
      "german": "Diese Tasche kostet achtzig Yuan.",
      "audioPath": "/audio/examples/ex-hsk1-yuan-1.mp3"
    }
  ],
  "hsk1-yue": [
    {
      "hanzi": "今天是九月三日。",
      "pinyin": "Jīntiān shì jiǔyuè sān rì.",
      "german": "Heute ist der 3. September.",
      "audioPath": "/audio/examples/ex-hsk1-yue-1.mp3"
    },
    {
      "hanzi": "一个月有三十天。",
      "pinyin": "Yí ge yuè yǒu sānshí tiān.",
      "german": "Ein Monat hat dreißig Tage.",
      "audioPath": "/audio/examples/ex-hsk1-yue-2.mp3"
    }
  ],
  "hsk1-zai": [
    {
      "hanzi": "他在医院工作。",
      "pinyin": "Tā zài yīyuàn gōngzuò.",
      "german": "Er arbeitet im Krankenhaus.",
      "audioPath": "/audio/examples/ex-hsk1-zai-1.mp3"
    },
    {
      "hanzi": "你在做什么呢？",
      "pinyin": "Nǐ zài zuò shénme ne?",
      "german": "Was machst du gerade?",
      "audioPath": "/audio/examples/ex-hsk1-zai-2.mp3"
    }
  ],
  "hsk1-zai-again": [
    {
      "hanzi": "请再说一次。",
      "pinyin": "Qǐng zài shuō yí cì.",
      "german": "Bitte sagen Sie das noch einmal.",
      "audioPath": "/audio/examples/ex-hsk1-zai-again-1.mp3"
    }
  ],
  "hsk1-zaijian": [
    {
      "hanzi": "老师，再见！",
      "pinyin": "Lǎoshī, zàijiàn!",
      "german": "Auf Wiedersehen, Lehrer!",
      "audioPath": "/audio/examples/ex-hsk1-zaijian-1.mp3"
    },
    {
      "hanzi": "明天见，再见！",
      "pinyin": "Míngtiān jiàn, zàijiàn!",
      "german": "Bis morgen, auf Wiedersehen!",
      "audioPath": "/audio/examples/ex-hsk1-zaijian-2.mp3"
    }
  ],
  "hsk1-zao-early": [
    {
      "hanzi": "早上好！",
      "pinyin": "Zǎoshang hǎo!",
      "german": "Guten Morgen!",
      "audioPath": "/audio/examples/ex-hsk1-zao-early-1.mp3"
    }
  ],
  "hsk1-zaofan": [
    {
      "hanzi": "我七点吃早饭。",
      "pinyin": "Wǒ qī diǎn chī zǎofàn.",
      "german": "Ich frühstücke um sieben.",
      "audioPath": "/audio/examples/ex-hsk1-zaofan-1.mp3"
    }
  ],
  "hsk1-zaoshang": [
    {
      "hanzi": "早上我七点起床。",
      "pinyin": "Zǎoshang wǒ qī diǎn qǐchuáng.",
      "german": "Morgens stehe ich um sieben auf.",
      "audioPath": "/audio/examples/ex-hsk1-zaoshang-1.mp3"
    }
  ],
  "hsk1-zenme": [
    {
      "hanzi": "这个字怎么读？",
      "pinyin": "Zhè ge zì zěnme dú?",
      "german": "Wie wird dieses Schriftzeichen ausgesprochen?",
      "audioPath": "/audio/examples/ex-hsk1-zenme-1.mp3"
    },
    {
      "hanzi": "你怎么没去上课？",
      "pinyin": "Nǐ zěnme méi qù shàng kè?",
      "german": "Warum bist du nicht zum Unterricht gegangen?",
      "audioPath": "/audio/examples/ex-hsk1-zenme-2.mp3"
    }
  ],
  "hsk1-zenmeyang": [
    {
      "hanzi": "今天北京天气怎么样？",
      "pinyin": "Jīntiān Běijīng tiānqì zěnmeyàng?",
      "german": "Wie ist das Wetter heute in Peking?",
      "audioPath": "/audio/examples/ex-hsk1-zenmeyang-1.mp3"
    },
    {
      "hanzi": "这件衣服怎么样？",
      "pinyin": "Zhè jiàn yīfu zěnmeyàng?",
      "german": "Wie gefällt dir dieses Kleidungsstück?",
      "audioPath": "/audio/examples/ex-hsk1-zenmeyang-2.mp3"
    }
  ],
  "hsk1-zhao-look-for": [
    {
      "hanzi": "我在找我的钥匙。",
      "pinyin": "Wǒ zài zhǎo wǒ de yàoshi.",
      "german": "Ich suche meinen Schlüssel.",
      "audioPath": "/audio/examples/ex-hsk1-zhao-look-for-1.mp3"
    }
  ],
  "hsk1-zhe": [
    {
      "hanzi": "这是我的电脑。",
      "pinyin": "Zhè shì wǒ de diànnǎo.",
      "german": "Das hier ist mein Computer.",
      "audioPath": "/audio/examples/ex-hsk1-zhe-1.mp3"
    },
    {
      "hanzi": "这个人是我的同学。",
      "pinyin": "Zhè ge rén shì wǒ de tóngxué.",
      "german": "Diese Person ist mein Mitschüler.",
      "audioPath": "/audio/examples/ex-hsk1-zhe-2.mp3"
    }
  ],
  "hsk1-zhebian": [
    {
      "hanzi": "超市在这边。",
      "pinyin": "Chāoshì zài zhèbiān.",
      "german": "Der Supermarkt ist hier drüben.",
      "audioPath": "/audio/examples/ex-hsk1-zhebian-1.mp3"
    }
  ],
  "hsk1-zheer": [
    {
      "hanzi": "请坐在这儿喝茶。",
      "pinyin": "Qǐng zuò zài zhèr hē chá.",
      "german": "Bitte setz dich hierher und trink Tee.",
      "audioPath": "/audio/examples/ex-hsk1-zheer-1.mp3"
    },
    {
      "hanzi": "这儿的米饭很好吃。",
      "pinyin": "Zhèr de mǐfàn hěn hǎochī.",
      "german": "Der gekochte Reis hier ist sehr lecker.",
      "audioPath": "/audio/examples/ex-hsk1-zheer-2.mp3"
    }
  ],
  "hsk1-zhege": [
    {
      "hanzi": "这个多少钱？",
      "pinyin": "Zhège duōshao qián?",
      "german": "Was kostet das?",
      "audioPath": "/audio/examples/ex-hsk1-zhege-1.mp3"
    }
  ],
  "hsk1-zheli": [
    {
      "hanzi": "这里有洗手间吗？",
      "pinyin": "Zhèlǐ yǒu xǐshǒujiān ma?",
      "german": "Gibt es hier eine Toilette?",
      "audioPath": "/audio/examples/ex-hsk1-zheli-1.mp3"
    }
  ],
  "hsk1-zhen-really": [
    {
      "hanzi": "你汉语说得真好！",
      "pinyin": "Nǐ Hànyǔ shuō de zhēn hǎo!",
      "german": "Du sprichst wirklich gut Chinesisch!",
      "audioPath": "/audio/examples/ex-hsk1-zhen-really-1.mp3"
    }
  ],
  "hsk1-zhengzai": [
    {
      "hanzi": "他正在看电视。",
      "pinyin": "Tā zhèngzài kàn diànshì.",
      "german": "Er schaut gerade Fernsehen.",
      "audioPath": "/audio/examples/ex-hsk1-zhengzai-1.mp3"
    }
  ],
  "hsk1-zhexie": [
    {
      "hanzi": "这些水果很新鲜。",
      "pinyin": "Zhèxiē shuǐguǒ hěn xīnxiān.",
      "german": "Dieses Obst ist frisch.",
      "audioPath": "/audio/examples/ex-hsk1-zhexie-1.mp3"
    }
  ],
  "hsk1-zhi-only": [
    {
      "hanzi": "桌子上有一只小猫。",
      "pinyin": "Zhuōzi shang yǒu yì zhī xiǎomāo.",
      "german": "Auf dem Tisch sitzt eine kleine Katze.",
      "audioPath": "/audio/examples/ex-hsk1-zhi-only-1.mp3"
    }
  ],
  "hsk1-zhidao": [
    {
      "hanzi": "我知道他在家。",
      "pinyin": "Wǒ zhīdào tā zài jiā.",
      "german": "Ich weiß, dass er zu Hause ist.",
      "audioPath": "/audio/examples/ex-hsk1-zhidao-1.mp3"
    }
  ],
  "hsk1-zhongguo": [
    {
      "hanzi": "中国菜很好吃。",
      "pinyin": "Zhōngguó cài hěn hǎochī.",
      "german": "Chinesisches Essen ist sehr lecker.",
      "audioPath": "/audio/examples/ex-hsk1-zhongguo-1.mp3"
    },
    {
      "hanzi": "我想去中国北京。",
      "pinyin": "Wǒ xiǎng qù Zhōngguó Běijīng.",
      "german": "Ich möchte nach Peking in China reisen.",
      "audioPath": "/audio/examples/ex-hsk1-zhongguo-2.mp3"
    }
  ],
  "hsk1-zhongwen": [
    {
      "hanzi": "我在大学学中文。",
      "pinyin": "Wǒ zài dàxué xué Zhōngwén.",
      "german": "Ich studiere an der Universität Chinesisch.",
      "audioPath": "/audio/examples/ex-hsk1-zhongwen-1.mp3"
    }
  ],
  "hsk1-zhongwu": [
    {
      "hanzi": "中午我们一起去饭馆吃米饭。",
      "pinyin": "Zhōngwǔ wǒmen yìqǐ qù fànguǎn chī mǐfàn.",
      "german": "Mittags gehen wir zusammen ins Restaurant Reis essen.",
      "audioPath": "/audio/examples/ex-hsk1-zhongwu-1.mp3"
    },
    {
      "hanzi": "中午十二点吃午饭。",
      "pinyin": "Zhōngwǔ shí'èr diǎn chī wǔfàn.",
      "german": "Um zwölf Uhr mittags essen wir zu Mittag.",
      "audioPath": "/audio/examples/ex-hsk1-zhongwu-2.mp3"
    }
  ],
  "hsk1-zhongxue": [
    {
      "hanzi": "我妹妹今年上中学。",
      "pinyin": "Wǒ mèimei jīnnián shàng zhōngxué.",
      "german": "Meine Schwester kommt dieses Jahr auf die Mittelschule.",
      "audioPath": "/audio/examples/ex-hsk1-zhongxue-1.mp3"
    }
  ],
  "hsk1-zhongxuesheng": [
    {
      "hanzi": "我以前是中学生。",
      "pinyin": "Wǒ yǐqián shì zhōngxuéshēng.",
      "german": "Ich war früher Mittelschüler.",
      "audioPath": "/audio/examples/ex-hsk1-zhongxuesheng-1.mp3"
    }
  ],
  "hsk1-zhu": [
    {
      "hanzi": "我在北京住了五年。",
      "pinyin": "Wǒ zài Běijīng zhù le wǔ nián.",
      "german": "Ich habe fünf Jahre in Peking gewohnt.",
      "audioPath": "/audio/examples/ex-hsk1-zhu-1.mp3"
    },
    {
      "hanzi": "你住在哪个房间？",
      "pinyin": "Nǐ zhù zài nǎ ge fángjiān?",
      "german": "In welchem Zimmer wohnst du?",
      "audioPath": "/audio/examples/ex-hsk1-zhu-2.mp3"
    }
  ],
  "hsk1-zhuozi": [
    {
      "hanzi": "桌子上有水和苹果。",
      "pinyin": "Zhuōzi shang yǒu shuǐ hé píngguǒ.",
      "german": "Auf dem Tisch stehen Wasser und Äpfel.",
      "audioPath": "/audio/examples/ex-hsk1-zhuozi-1.mp3"
    },
    {
      "hanzi": "猫在桌子下面睡觉。",
      "pinyin": "Māo zài zhuōzi xiàmian shuìjiào.",
      "german": "Die Katze schläft unter dem Tisch.",
      "audioPath": "/audio/examples/ex-hsk1-zhuozi-2.mp3"
    }
  ],
  "hsk1-zi": [
    {
      "hanzi": "这个汉字怎么写？",
      "pinyin": "Zhè ge hànzì zěnme xiě?",
      "german": "Wie schreibt man dieses Schriftzeichen?",
      "audioPath": "/audio/examples/ex-hsk1-zi-1.mp3"
    },
    {
      "hanzi": "王老师写的字很漂亮。",
      "pinyin": "Wáng lǎoshī xiě de zì hěn piàoliang.",
      "german": "Die von Lehrer Wang geschriebenen Zeichen sind sehr schön.",
      "audioPath": "/audio/examples/ex-hsk1-zi-2.mp3"
    }
  ],
  "hsk1-zuo": [
    {
      "hanzi": "请坐在椅子上喝杯茶。",
      "pinyin": "Qǐng zuò zài yǐzi shang hē bēi chá.",
      "german": "Bitte nimm auf dem Stuhl Platz und trink eine Tasse Tee.",
      "audioPath": "/audio/examples/ex-hsk1-zuo-1.mp3"
    },
    {
      "hanzi": "我们坐飞机去中国。",
      "pinyin": "Wǒmen zuò fēijī qù Zhōngguó.",
      "german": "Wir fliegen mit dem Flugzeug nach China.",
      "audioPath": "/audio/examples/ex-hsk1-zuo-2.mp3"
    }
  ],
  "hsk1-zuo-do": [
    {
      "hanzi": "你在做什么中国菜？",
      "pinyin": "Nǐ zài zuò shénme Zhōngguó cài?",
      "german": "Was für ein chinesisches Gericht kochst du da?",
      "audioPath": "/audio/examples/ex-hsk1-zuo-do-1.mp3"
    },
    {
      "hanzi": "做朋友比做敌人好。",
      "pinyin": "Zuò péngyou bǐ zuò dírén hǎo.",
      "german": "Freunde zu sein ist besser als Feinde zu sein.",
      "audioPath": "/audio/examples/ex-hsk1-zuo-do-2.mp3"
    }
  ],
  "hsk1-zuofan": [
    {
      "hanzi": "晚上我妈妈在家做饭。",
      "pinyin": "Wǎnshang wǒ māma zài jiā zuòfàn.",
      "german": "Abends kocht meine Mama zu Hause.",
      "audioPath": "/audio/examples/ex-hsk1-zuofan-1.mp3"
    }
  ],
  "hsk1-zuotian": [
    {
      "hanzi": "昨天下午我去商店买了水果。",
      "pinyin": "Zuótiān xiàwǔ wǒ qù shāngdiàn mǎi le shuǐguǒ.",
      "german": "Gestern Nachmittag bin ich in den Laden gegangen und habe Obst gekauft.",
      "audioPath": "/audio/examples/ex-hsk1-zuotian-1.mp3"
    },
    {
      "hanzi": "昨天北京下大雨了。",
      "pinyin": "Zuótiān Běijīng xià dàyǔ le.",
      "german": "Gestern hat es in Peking heftig geregnet.",
      "audioPath": "/audio/examples/ex-hsk1-zuotian-2.mp3"
    }
  ]
};

// Gesamt-Strichanzahl berechnen
function getEstimatedStrokes(item: VocabItem): number {
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
function getMnemonic(item: VocabItem): string {
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

  return {
    partOfSpeech,
    mnemonic,
    collocations,
    exampleSentences,
    strokes,
  };
}
