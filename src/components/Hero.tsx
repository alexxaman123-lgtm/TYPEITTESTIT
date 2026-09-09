import BlurTypeReveal from "./BlurTypeReveal";
import type { Locale } from "../lib/i18n";
import { withLocalePrefix } from "../lib/i18n";

type HeroContent = {
  kicker: string;
  kickerSub: string;
  title: string;
  titleFontSize?: string;
  titleStagger?: number;
  lede: string;
  ctaPrimary: string;
  ctaSecondary: string;
  features: [string, string, string, string];
  featuresAria: string;
  highlightsAria: string;
  statWpmLabel: string;
  statAccuracyValue: string;
  statAccuracyLabel: string;
  statDurationLabel: string;
  videoAria: string;
  caption: string;
};

const HERO: Record<Locale, HeroContent> = {
  en: {
    kicker: "FREE TYPING TEST",
    kickerSub: "WPM \u00b7 ACCURACY \u00b7 SPEED",
    title: "Free Typing Test Online.\nMeasure Your WPM.",
    titleStagger: 22,
    lede: "Take a free typing test online to measure your typing speed, words per minute, accuracy, and errors. Practice with 1, 2, 3, or 5 minute tests and build faster, more confident keyboard skills.",
    ctaPrimary: "Start Free Typing Test \u2192",
    ctaSecondary: "View Leaderboard",
    features: ["Free typing test WPM", "Typing test practice", "1 / 2 / 3 / 5 minute tests", "Accuracy tracking"],
    featuresAria: "Typing test features",
    highlightsAria: "Typing test highlights",
    statWpmLabel: "Measure your typing speed",
    statAccuracyValue: "Accuracy",
    statAccuracyLabel: "See speed and accuracy together",
    statDurationLabel: "Quick or sustained practice",
    videoAria: "Goat typing video",
    caption: "The GOAT is typing.",
  },
  es: {
    kicker: "TEST DE MECANOGRAF\u00cdA",
    kickerSub: "WPM \u00b7 PRECISI\u00d3N \u00b7 VELOCIDAD",
    title: "Test de mecanograf\u00eda gratis.\nMide tu velocidad de escritura.",
    titleFontSize: "clamp(2.55rem, 12vw, 5.2rem)",
    titleStagger: 20,
    lede: "Haz un test de mecanograf\u00eda online para medir tu velocidad de escritura, palabras por minuto (WPM), precisi\u00f3n y errores. Practica con pruebas de 1, 2, 3 o 5 minutos y mejora tus habilidades de teclado con sesiones claras y repetibles.",
    ctaPrimary: "Empezar test de mecanograf\u00eda \u2192",
    ctaSecondary: "Ver clasificaci\u00f3n",
    features: ["Test de mecanograf\u00eda gratis", "Pr\u00e1ctica de mecanograf\u00eda", "1 / 2 / 3 / 5 minutos", "Seguimiento de precisi\u00f3n"],
    featuresAria: "Funciones del test de mecanograf\u00eda",
    highlightsAria: "Destacados del test",
    statWpmLabel: "Mide tu velocidad de escritura",
    statAccuracyValue: "95%+",
    statAccuracyLabel: "La precisi\u00f3n tambi\u00e9n importa",
    statDurationLabel: "Pr\u00e1ctica r\u00e1pida o sostenida",
    videoAria: "V\u00eddeo de una cabra escribiendo",
    caption: "La cabra est\u00e1 escribiendo.",
  },
  de: {
    kicker: "KOSTENLOSER SCHREIBTEST",
    kickerSub: "WPM \u00b7 GENAUIGKEIT \u00b7 GESCHWINDIGKEIT",
    title: "Kostenloser Schreibtest online.\nMiss deine Tippgeschwindigkeit.",
    lede: "Mach einen kostenlosen Online-Schreibtest, um deine Tippgeschwindigkeit, W\u00f6rter pro Minute (WPM), Genauigkeit und Fehler zu messen. \u00dcbe mit 1-, 2-, 3- oder 5-Minuten-Tests und werde schneller und sicherer auf der Tastatur.",
    ctaPrimary: "Schreibtest starten \u2192",
    ctaSecondary: "Bestenliste ansehen",
    features: ["Kostenloser Schreibtest", "Tipp-\u00dcbung", "1 / 2 / 3 / 5 Minuten Tests", "Genauigkeit im Blick"],
    featuresAria: "Schreibtest-Funktionen",
    highlightsAria: "Schreibtest-Highlights",
    statWpmLabel: "Miss deine Tippgeschwindigkeit",
    statAccuracyValue: "Genauigkeit",
    statAccuracyLabel: "Geschwindigkeit und Genauigkeit zusammen sehen",
    statDurationLabel: "Kurze oder ausdauernde \u00dcbung",
    videoAria: "Video einer tippenden Ziege",
    caption: "Die Ziege tippt.",
  },
  fr: {
    kicker: "TEST DE FRAPPE GRATUIT",
    kickerSub: "WPM \u00b7 PR\u00c9CISION \u00b7 VITESSE",
    title: "Test de frappe gratuit en ligne.\nMesurez votre vitesse de frappe.",
    lede: "Passez un test de frappe gratuit en ligne pour mesurer votre vitesse de frappe, vos mots par minute (WPM), votre pr\u00e9cision et vos erreurs. Entra\u00eenez-vous avec des tests de 1, 2, 3 ou 5 minutes pour taper plus vite et avec plus de confiance.",
    ctaPrimary: "Commencer le test de frappe \u2192",
    ctaSecondary: "Voir le classement",
    features: ["Test de frappe gratuit", "Entra\u00eenement \u00e0 la frappe", "Tests de 1 / 2 / 3 / 5 minutes", "Suivi de la pr\u00e9cision"],
    featuresAria: "Fonctionnalit\u00e9s du test de frappe",
    highlightsAria: "Points forts du test",
    statWpmLabel: "Mesurez votre vitesse de frappe",
    statAccuracyValue: "Pr\u00e9cision",
    statAccuracyLabel: "Visualisez vitesse et pr\u00e9cision ensemble",
    statDurationLabel: "Entra\u00eenement rapide ou prolong\u00e9",
    videoAria: "Vid\u00e9o d'une ch\u00e8vre qui tape",
    caption: "La ch\u00e8vre tape au clavier.",
  },
  it: {
    kicker: "TEST DI DIGITAZIONE GRATUITO",
    kickerSub: "WPM \u00b7 PRECISIONE \u00b7 VELOCIT\u00c0",
    title: "Test di digitazione gratuito online.\nMisura la tua velocit\u00e0 di digitazione.",
    lede: "Fai un test di digitazione online gratuito per misurare la tua velocit\u00e0, le parole al minuto (WPM), la precisione e gli errori. Allenati con test da 1, 2, 3 o 5 minuti e migliora le tue abilit\u00e0 di digitazione.",
    ctaPrimary: "Inizia il test di digitazione \u2192",
    ctaSecondary: "Vedi la classifica",
    features: ["Test di digitazione gratuito", "Esercizi di digitazione", "Test da 1 / 2 / 3 / 5 minuti", "Monitoraggio della precisione"],
    featuresAria: "Funzionalit\u00e0 del test di digitazione",
    highlightsAria: "Punti salienti del test",
    statWpmLabel: "Misura la tua velocit\u00e0 di digitazione",
    statAccuracyValue: "Precisione",
    statAccuracyLabel: "Vedi velocit\u00e0 e precisione insieme",
    statDurationLabel: "Allenamento breve o prolungato",
    videoAria: "Video di una capra che digita",
    caption: "La capra sta digitando.",
  },
  pt: {
    kicker: "TESTE DE DIGITA\u00c7\u00c3O GRATUITO",
    kickerSub: "WPM \u00b7 PRECIS\u00c3O \u00b7 VELOCIDADE",
    title: "Teste de digita\u00e7\u00e3o gratuito online.\nMe\u00e7a sua velocidade de digita\u00e7\u00e3o.",
    lede: "Fa\u00e7a um teste de digita\u00e7\u00e3o online gratuito para medir sua velocidade, palavras por minuto (WPM), precis\u00e3o e erros. Pratique com testes de 1, 2, 3 ou 5 minutos e digite com mais rapidez e confian\u00e7a.",
    ctaPrimary: "Come\u00e7ar teste de digita\u00e7\u00e3o \u2192",
    ctaSecondary: "Ver classifica\u00e7\u00e3o",
    features: ["Teste de digita\u00e7\u00e3o gratuito", "Pr\u00e1tica de digita\u00e7\u00e3o", "Testes de 1 / 2 / 3 / 5 minutos", "Acompanhamento de precis\u00e3o"],
    featuresAria: "Recursos do teste de digita\u00e7\u00e3o",
    highlightsAria: "Destaques do teste",
    statWpmLabel: "Me\u00e7a sua velocidade de digita\u00e7\u00e3o",
    statAccuracyValue: "Precis\u00e3o",
    statAccuracyLabel: "Veja velocidade e precis\u00e3o juntas",
    statDurationLabel: "Pr\u00e1tica r\u00e1pida ou cont\u00ednua",
    videoAria: "V\u00eddeo de uma cabra digitando",
    caption: "A cabra est\u00e1 digitando.",
  },
  pl: {
    kicker: "DARMOWY TEST PISANIA",
    kickerSub: "WPM \u00b7 DOK\u0142ADNO\u015a\u0106 \u00b7 SZYBKO\u015a\u0106",
    title: "Darmowy test pisania online.\nZmierz swoj\u0105 szybko\u015b\u0107 pisania.",
    lede: "Wykonaj darmowy test pisania online, aby zmierzy\u0107 swoj\u0105 szybko\u015b\u0107, liczb\u0119 s\u0142\u00f3w na minut\u0119 (WPM), dok\u0142adno\u015b\u0107 i b\u0142\u0119dy. Trenuj z testami 1, 2, 3 lub 5 minutowymi i pisz szybciej i pewniej.",
    ctaPrimary: "Zacznij test pisania \u2192",
    ctaSecondary: "Zobacz ranking",
    features: ["Darmowy test pisania", "\u0106wiczenie pisania", "Testy 1 / 2 / 3 / 5 minut", "\u015aledzenie dok\u0142adno\u015bci"],
    featuresAria: "Funkcje testu pisania",
    highlightsAria: "Najwa\u017cniejsze informacje o te\u015bcie",
    statWpmLabel: "Zmierz swoj\u0105 szybko\u015b\u0107 pisania",
    statAccuracyValue: "Dok\u0142adno\u015b\u0107",
    statAccuracyLabel: "Zobacz szybko\u015b\u0107 i dok\u0142adno\u015b\u0107 razem",
    statDurationLabel: "Szybki lub d\u0142ugi trening",
    videoAria: "Wideo kozy pisz\u0105cej na klawiaturze",
    caption: "Koza pisze na klawiaturze.",
  },
  tr: {
    kicker: "\u00dcCRETS\u0130Z YAZMA TEST\u0130",
    kickerSub: "WPM \u00b7 DO\u011eRULUK \u00b7 H\u0130Z",
    title: "\u00dccretsiz \u00e7evrimi\u00e7i yazma testi.\nYazma h\u0131z\u0131n\u0131 \u00f6l\u00e7.",
    lede: "Yazma h\u0131z\u0131n\u0131, dakikadaki kelime say\u0131n\u0131 (WPM), do\u011frulu\u011funu ve hatalar\u0131n\u0131 \u00f6l\u00e7mek i\u00e7in \u00fccretsiz bir \u00e7evrimi\u00e7i yazma testi yap. 1, 2, 3 veya 5 dakikal\u0131k testlerle pratik yap ve klavyede daha h\u0131zl\u0131, daha kendinden emin ol.",
    ctaPrimary: "Yazma testine ba\u015fla \u2192",
    ctaSecondary: "Lider tablosunu g\u00f6r",
    features: ["\u00dccretsiz yazma testi", "Yazma pratik\u0131", "1 / 2 / 3 / 5 dakikal\u0131k testler", "Do\u011fruluk takibi"],
    featuresAria: "Yazma testi \u00f6zellikleri",
    highlightsAria: "Test \u00f6ne \u00e7\u0131kanlar\u0131",
    statWpmLabel: "Yazma h\u0131z\u0131n\u0131 \u00f6l\u00e7",
    statAccuracyValue: "Do\u011fruluk",
    statAccuracyLabel: "H\u0131z ve do\u011fruluğu birlikte g\u00f6r",
    statDurationLabel: "H\u0131zl\u0131 veya uzun pratik",
    videoAria: "Klavyede yazan bir ke\u00e7i videosu",
    caption: "Ke\u00e7i yaz\u0131yor.",
  },
  uk: {
    kicker: "\u0411\u0435\u0437\u043a\u043e\u0448\u0442\u043e\u0432\u043d\u0438\u0439 \u0442\u0435\u0441\u0442 \u043d\u0430\u0431\u043e\u0440\u0443 \u0442\u0435\u043a\u0441\u0442\u0443",
    kickerSub: "WPM \u00b7 \u0442\u043e\u0447\u043d\u0456\u0441\u0442\u044c \u00b7 \u0448\u0432\u0438\u0434\u043a\u0456\u0441\u0442\u044c",
    title: "\u0411\u0435\u0437\u043a\u043e\u0448\u0442\u043e\u0432\u043d\u0438\u0439 \u043e\u043d\u043b\u0430\u0439\u043d-\u0442\u0435\u0441\u0442 \u043d\u0430\u0431\u043e\u0440\u0443 \u0442\u0435\u043a\u0441\u0442\u0443.\n\u0412\u0438\u043c\u0456\u0440\u044f\u0439\u0442\u0435 \u0441\u0432\u043e\u0454 \u0448\u0432\u0438\u0434\u043a\u0456\u0441\u0442\u044c \u043d\u0430\u0431\u043e\u0440\u0443.",
    lede: "\u041f\u0440\u043e\u0439\u0434\u0456\u0442\u044c \u0431\u0435\u0437\u043a\u043e\u0448\u0442\u043e\u0432\u043d\u0438\u0439 \u043e\u043d\u043b\u0430\u0439\u043d-\u0442\u0435\u0441\u0442 \u043d\u0430\u0431\u043e\u0440\u0443 \u0442\u0435\u043a\u0441\u0442\u0443, \u0449\u043e\u0431 \u0432\u0438\u043c\u0456\u0440\u044f\u0442\u0438 \u0448\u0432\u0438\u0434\u043a\u0456\u0441\u0442\u044c \u043d\u0430\u0431\u043e\u0440\u0443, \u043a\u0456\u043b\u044c\u043a\u0456\u0441\u0442\u044c \u0441\u043b\u0456\u0432 \u0437\u0430 \u0445\u0432\u0438\u043b\u0438\u043d\u0443 (WPM), \u0442\u043e\u0447\u043d\u0456\u0441\u0442\u044c \u0456 \u043f\u043e\u043c\u0438\u043b\u043a\u0438. \u0422\u0440\u0435\u043d\u0443\u0439\u0442\u0435\u0441\u044f \u0437 \u0442\u0435\u0441\u0442\u0430\u043c\u0438 \u043d\u0430 1, 2, 3 \u0430\u0431\u043e 5 \u0445\u0432\u0438\u043b\u0438\u043d \u0456 \u043d\u0430\u0431\u0438\u0440\u0430\u0439\u0442\u0435 \u0442\u0435\u043a\u0441\u0442 \u0448\u0432\u0438\u0434\u0448\u0435 \u0442\u0430 \u0432\u043f\u0435\u0432\u043d\u0435\u043d\u0435\u0448\u0435.",
    ctaPrimary: "\u041f\u043e\u0447\u0430\u0442\u0438 \u0442\u0435\u0441\u0442 \u043d\u0430\u0431\u043e\u0440\u0443 \u0442\u0435\u043a\u0441\u0442\u0443 \u2192",
    ctaSecondary: "\u041f\u0435\u0440\u0435\u0433\u043b\u044f\u043d\u0443\u0442\u0438 \u0442\u0430\u0431\u043b\u0438\u0446\u044e \u043b\u0456\u0434\u0435\u0440\u0456\u0432",
    features: ["\u0411\u0435\u0437\u043a\u043e\u0448\u0442\u043e\u0432\u043d\u0438\u0439 \u0442\u0435\u0441\u0442 \u043d\u0430\u0431\u043e\u0440\u0443 \u0442\u0435\u043a\u0441\u0442\u0443", "\u041f\u0440\u0430\u043a\u0442\u0438\u043a\u0430 \u043d\u0430\u0431\u043e\u0440\u0443 \u0442\u0435\u043a\u0441\u0442\u0443", "\u0442\u0435\u0441\u0442\u0438 \u043d\u0430 1 / 2 / 3 / 5 \u0445\u0432\u0438\u043b\u0438\u043d", "\u0412\u0456\u0434\u0441\u0442\u0435\u0436\u0435\u043d\u043d\u044f \u0442\u043e\u0447\u043d\u043e\u0441\u0442\u0456"],
    featuresAria: "\u0424\u0443\u043d\u043a\u0446\u0456\u0457 \u0442\u0435\u0441\u0442\u0443 \u043d\u0430\u0431\u043e\u0440\u0443 \u0442\u0435\u043a\u0441\u0442\u0443",
    highlightsAria: "\u041e\u0441\u043d\u043e\u0432\u043d\u0456 \u043c\u043e\u043c\u0435\u043d\u0442\u0438 \u0442\u0435\u0441\u0442\u0443",
    statWpmLabel: "\u0412\u0438\u043c\u0456\u0440\u044f\u0439\u0442\u0435 \u0441\u0432\u043e\u0454 \u0448\u0432\u0438\u0434\u043a\u0456\u0441\u0442\u044c \u043d\u0430\u0431\u043e\u0440\u0443",
    statAccuracyValue: "\u0442\u043e\u0447\u043d\u0456\u0441\u0442\u044c",
    statAccuracyLabel: "\u0414\u0438\u0432\u0456\u0442\u044c\u0441\u044f \u0448\u0432\u0438\u0434\u043a\u0456\u0441\u0442\u044c \u0456 \u0442\u043e\u0447\u043d\u0456\u0441\u0442\u044c \u0440\u0430\u0437\u043e\u043c",
    statDurationLabel: "\u0421\u0432\u0438\u0434\u043a\u0430 \u0430\u0431\u043e \u0442\u0440\u0438\u0432\u0430\u043b\u0430 \u043f\u0440\u0430\u043a\u0442\u0438\u043a\u0430",
    videoAria: "\u0412\u0456\u0434\u0435\u043e \u043a\u043e\u0437\u0438, \u044f\u043a\u0430 \u0434\u0440\u0443\u043a\u0443\u0454",
    caption: "\u041a\u043e\u0437\u0430 \u0434\u0440\u0443\u043a\u0443\u0454.",
  },
  id: {
    kicker: "TES MENGETIK GRATIS",
    kickerSub: "WPM \u00b7 AKURASI \u00b7 KECEPATAN",
    title: "Tes mengetik online gratis.\nUkur kecepatan mengetikmu.",
    lede: "Ikuti tes mengetik online gratis untuk mengukur kecepatan mengetik, jumlah kata per menit (WPM), akurasi, dan kesalahan. Latihan dengan tes 1, 2, 3, atau 5 menit dan tingkatkan kemampuan mengetikmu.",
    ctaPrimary: "Mulai tes mengetik \u2192",
    ctaSecondary: "Lihat papan peringkat",
    features: ["Tes mengetik gratis", "Latihan mengetik", "Tes 1 / 2 / 3 / 5 menit", "Pelacakan akurasi"],
    featuresAria: "Fitur tes mengetik",
    highlightsAria: "Sorotan tes",
    statWpmLabel: "Ukur kecepatan mengetikmu",
    statAccuracyValue: "Akurasi",
    statAccuracyLabel: "Lihat kecepatan dan akurasi bersamaan",
    statDurationLabel: "Latihan singkat atau berkelanjutan",
    videoAria: "Video kambing sedang mengetik",
    caption: "Si kambing sedang mengetik.",
  },
  zh: {
    kicker: "\u514d\u8d39\u6253\u5b57\u6d4b\u8bd5",
    kickerSub: "WPM \u00b7 \u51c6\u786e\u7387 \u00b7 \u901f\u5ea6",
    title: "\u514d\u8d39\u5728\u7ebf\u6253\u5b57\u6d4b\u8bd5\u3002\n\u6d4b\u91cf\u4f60\u7684\u6253\u5b57\u901f\u5ea6\u3002",
    titleStagger: 30,
    lede: "\u53c2\u52a0\u514d\u8d39\u7684\u5728\u7ebf\u6253\u5b57\u6d4b\u8bd5\uff0c\u6d4b\u91cf\u4f60\u7684\u6253\u5b57\u901f\u5ea6\u3001\u6bcf\u5206\u949f\u5b57\u6570\uff08WPM\uff09\u3001\u51c6\u786e\u7387\u548c\u9519\u8bef\u6570\u3002\u901a\u8fc71\u30012\u30013\u62165\u5206\u949f\u7684\u6d4b\u8bd5\u8fdb\u884c\u7ec3\u4e60\uff0c\u63d0\u5347\u6253\u5b57\u901f\u5ea6\u548c\u81ea\u4fe1\u3002",
    ctaPrimary: "\u5f00\u59cb\u6253\u5b57\u6d4b\u8bd5 \u2192",
    ctaSecondary: "\u67e5\u770b\u6392\u884c\u699c",
    features: ["\u514d\u8d39\u6253\u5b57\u6d4b\u8bd5", "\u6253\u5b57\u7ec3\u4e60", "1 / 2 / 3 / 5 \u5206\u949f\u6d4b\u8bd5", "\u51c6\u786e\u7387\u8ffd\u8e2a"],
    featuresAria: "\u6253\u5b57\u6d4b\u8bd5\u529f\u80fd",
    highlightsAria: "\u6d4b\u8bd5\u4eae\u70b9",
    statWpmLabel: "\u6d4b\u91cf\u4f60\u7684\u6253\u5b57\u901f\u5ea6",
    statAccuracyValue: "\u51c6\u786e\u7387",
    statAccuracyLabel: "\u540c\u65f6\u67e5\u770b\u901f\u5ea6\u548c\u51c6\u786e\u7387",
    statDurationLabel: "\u5feb\u901f\u6216\u6301\u4e45\u7ec3\u4e60",
    videoAria: "\u5c71\u7f8a\u6253\u5b57\u89c6\u9891",
    caption: "\u5c71\u7f8a\u6b63\u5728\u6253\u5b57\u3002",
  },
  ja: {
    kicker: "\u7121\u6599\u30bf\u30a4\u30d4\u30f3\u30b0\u30c6\u30b9\u30c8",
    kickerSub: "WPM\u30fb\u6b63\u78ba\u7387\u30fb\u901f\u5ea6",
    title: "\u7121\u6599\u306e\u30aa\u30f3\u30e9\u30a4\u30f3\u30bf\u30a4\u30d4\u30f3\u30b0\u30c6\u30b9\u30c8\u3002\n\u3042\u306a\u305f\u306e\u30bf\u30a4\u30d4\u30f3\u30b0\u901f\u5ea6\u3092\u6e2c\u5b9a\u3002",
    titleStagger: 30,
    lede: "\u7121\u6599\u306e\u30aa\u30f3\u30e9\u30a4\u30f3\u30bf\u30a4\u30d4\u30f3\u30b0\u30c6\u30b9\u30c8\u3067\u3001\u30bf\u30a4\u30d4\u30f3\u30b0\u901f\u5ea6\u30011\u5206\u3042\u305f\u308a\u306e\u5358\u8a9e\u6570\uff08WPM\uff09\u3001\u6b63\u78ba\u7387\u3001\u30a8\u30e9\u30fc\u3092\u6e2c\u5b9a\u3057\u307e\u3057\u3087\u3046\u3002\uff11\u5206\u3001\uff12\u5206\u3001\uff13\u5206\u3001\uff15\u5206\u306e\u30c6\u30b9\u30c8\u3067\u7df4\u7fd2\u3057\u3001\u3088\u308a\u901f\u304f\u81ea\u4fe1\u3092\u6301\u3063\u3066\u30bf\u30a4\u30d4\u30f3\u30b0\u3067\u304d\u308b\u3088\u3046\u306b\u306a\u308a\u307e\u3057\u3087\u3046\u3002",
    ctaPrimary: "\u30bf\u30a4\u30d4\u30f3\u30b0\u30c6\u30b9\u30c8\u3092\u59cb\u3081\u308b \u2192",
    ctaSecondary: "\u30e9\u30f3\u30ad\u30f3\u30b0\u3092\u898b\u308b",
    features: ["\u7121\u6599\u30bf\u30a4\u30d4\u30f3\u30b0\u30c6\u30b9\u30c8", "\u30bf\u30a4\u30d4\u30f3\u30b0\u7df4\u7fd2", "1 / 2 / 3 / 5\u5206\u30c6\u30b9\u30c8", "\u6b63\u78ba\u7387\u30c8\u30ea\u30bd\u30fc\u30ad\u30d3\u30d3\u30cd\u30b0"],
    featuresAria: "\u30bf\u30a4\u30d4\u30f3\u30b0\u30c6\u30b9\u30c8\u306e\u6a5f\u80fd",
    highlightsAria: "\u30c6\u30b9\u30c8\u306e\u30cf\u30a4\u30e9\u30a4\u30c8",
    statWpmLabel: "\u30bf\u30a4\u30d4\u30f3\u30b0\u901f\u5ea6\u3092\u6e2c\u5b9a",
    statAccuracyValue: "\u6b63\u78ba\u7387",
    statAccuracyLabel: "\u901f\u5ea6\u3068\u6b63\u78ba\u7387\u3092\u540c\u6642\u306b\u78ba\u8a8d",
    statDurationLabel: "\u77ed\u6642\u9593\u307e\u305f\u306f\u9577\u6642\u9593\u306e\u7df4\u7fd2",
    videoAria: "\u30bf\u30a4\u30d4\u30f3\u30b0\u3059\u308b\u30e4\u30ae\u306e\u52d5\u753b",
    caption: "\u30e4\u30ae\u304c\u30bf\u30a4\u30d4\u30f3\u30b0\u4e2d\u3002",
  },
  ko: {
    kicker: "\ubb34\ub8cc \ud0c0\uc774\ud551 \ud14c\uc2a4\ud2b8",
    kickerSub: "WPM \u00b7 \uc815\ud655\ub3c4 \u00b7 \uc18d\ub3c4",
    title: "\ubb34\ub8cc \uc628\ub77c\uc778 \ud0c0\uc774\ud551 \ud14c\uc2a4\ud2b8.\n\ud0c0\uc774\ud551 \uc18d\ub3c4\ub97c \uce21\uc815\ud558\uc138\uc694.",
    titleStagger: 26,
    lede: "\ubb34\ub8cc \uc628\ub77c\uc778 \ud0c0\uc774\ud551 \ud14c\uc2a4\ud2b8\ub85c \ud0c0\uc774\ud551 \uc18d\ub3c4, \ubd84\ub2f9 \ub2e8\uc5b4 \uc218(WPM), \uc815\ud655\ub3c4, \uc624\ub958\ub97c \uce21\uc815\ud558\uc138\uc694. 1\ubd84, 2\ubd84, 3\ubd84, 5\ubd84 \ud14c\uc2a4\ud2b8\ub85c \uc5f0\uc2b5\ud558\uc5ec \ub354 \ubc60\ub824\uace0 \uc790\uc2e0\uac10 \uc788\ub294 \ud0c0\uc774\ud550 \uc2e4\ub9c9\uc744 \uae30\uc6ec\ubcf4\uc138\uc694.",
    ctaPrimary: "\ud0c0\uc774\ud551 \ud14c\uc2a4\ud2b8 \uc2dc\uc791\ud558\uae30 \u2192",
    ctaSecondary: "\ub9ac\ub354\ubcf4\ub4dc \ubc71\uae30",
    features: ["\ubb34\ub8cc \ud0c0\uc774\ud551 \ud14c\uc2a4\ud2b8", "\ud0c0\uc774\ud551 \uc5f0\uc2b5", "1 / 2 / 3 / 5\ubd84 \ud14c\uc2a4\ud2b8", "\uc815\ud655\ub3c4 \ucd94\uc801"],
    featuresAria: "\ud0c0\uc774\ud551 \ud14c\uc2a4\ud2b8 \uae30\ub2a5",
    highlightsAria: "\ud14c\uc2a4\ud2b8 \ud558\uc774\ub78c\uc774\ud2b8",
    statWpmLabel: "\ud0c0\uc774\ud551 \uc18d\ub3c4\ub97c \uce21\uc815\ud558\uc138\uc694",
    statAccuracyValue: "\uc815\ud655\ub3c4",
    statAccuracyLabel: "\uc18d\ub3c4\uc640 \uc815\ud655\ub3c4\ub97c \ud568\uaa8c \ud655\uc778\ud558\uc138\uc694",
    statDurationLabel: "\uc9e7\uac70\ub09a \uae34 \uc5f0\uc2b5",
    videoAria: "\ud0c0\uc774\ud551\ud558\ub294 \uc5fc\uc18c \uc601\uc0c1",
    caption: "\uc5fc\uc18c\uac00 \ud0c0\uc774\ud551 \uc911\uc785\ub2c8\ub2e4.",
  },
};

export default function Hero({ locale = "en" as Locale }: { locale?: Locale }) {
  const c = HERO[locale] ?? HERO.en;
  const titleId = locale === "en" ? "hero-title" : `hero-title-${locale}`;
  const leaderboardHref = withLocalePrefix(locale, "/leaderboard/");

  return (
    <section
      className="hero-banner relative w-full overflow-hidden px-4 pb-16 pt-8 sm:px-6 sm:pb-24 sm:pt-10 lg:px-8 lg:pb-28"
      aria-labelledby={titleId}
    >
      <div className="hero-banner-grid" aria-hidden="true" />

      <div className="relative mx-auto grid min-h-0 w-full max-w-7xl items-center gap-8 py-10 sm:min-h-[720px] sm:gap-10 sm:py-20 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:gap-14">
        <div className="min-w-0 w-full max-w-4xl">
          <div className="animate-fade-up flex min-w-0 flex-wrap items-center gap-2 sm:gap-3" style={{ animationDelay: "40ms" }}>
            <span className="hero-kicker min-w-0 max-w-full truncate font-label">{c.kicker}</span>
            <span className="hero-kicker-muted min-w-0 max-w-full truncate font-caption">{c.kickerSub}</span>
          </div>

          {/* Letter-by-letter blur-to-focus reveal: the headline types itself in. */}
          <BlurTypeReveal
            as="h1"
            id={titleId}
            className="hero-title mt-6 max-w-full break-words font-display sm:mt-7"
            style={c.titleFontSize ? { fontSize: c.titleFontSize } : undefined}
            text={c.title}
            by="char"
            stagger={c.titleStagger ?? 22}
            delay={120}
          />

          {/* Word-by-word so a long paragraph resolves quickly but still softly. */}
          <BlurTypeReveal
            as="p"
            className="hero-lede mt-6 max-w-3xl break-words font-body-lg sm:mt-7"
            text={c.lede}
            by="word"
            stagger={26}
            delay={420}
            caret={false}
          />

          <div className="mt-8 flex min-w-0 flex-col items-start gap-3 animate-fade-up sm:mt-9 sm:flex-row" style={{ animationDelay: "190ms" }}>
            <a
              href="#tester"
              className="hero-primary-cta inline-flex min-h-14 max-w-full items-center justify-center rounded-full px-6 font-link transition-transform duration-200 hover:-translate-y-0.5 sm:px-7"
            >
              {c.ctaPrimary}
            </a>
            <a
              href={leaderboardHref}
              className="hero-secondary-cta inline-flex min-h-14 max-w-full items-center justify-center rounded-full border px-6 font-link transition-colors duration-200 sm:px-7"
            >
              {c.ctaSecondary}
            </a>
          </div>

          <div
            className="mt-8 flex min-w-0 max-w-full flex-wrap gap-2 sm:mt-10"
            data-reveal-group="left"
            aria-label={c.featuresAria}
          >
            {c.features.map((feature) => (
              <span key={feature} className="hero-feature font-caption">{feature}</span>
            ))}
          </div>

          <div
            className="mt-8 grid max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-[24px] border border-current/10 sm:mt-12 sm:grid-cols-3 sm:rounded-[28px]"
            data-reveal-group="up"
            aria-label={c.highlightsAria}
          >
            <div className="hero-stat premium-card">
              <span className="hero-stat-value font-heading-3">WPM</span>
              <span className="hero-stat-label font-caption">{c.statWpmLabel}</span>
            </div>
            <div className="hero-stat premium-card">
              <span className="hero-stat-value font-heading-3">{c.statAccuracyValue}</span>
              <span className="hero-stat-label font-caption">{c.statAccuracyLabel}</span>
            </div>
            <div className="hero-stat premium-card">
              <span className="hero-stat-value font-heading-3">1\u20135 min</span>
              <span className="hero-stat-label font-caption">{c.statDurationLabel}</span>
            </div>
          </div>
        </div>

        <div
          className="relative mx-auto w-full min-w-0 max-w-[560px] lg:max-w-none"
          data-reveal="right"
          aria-label={c.videoAria}
        >
          <div className="hero-video-shell relative w-full max-w-full overflow-hidden rounded-[28px] border border-current/10 bg-canvas-soft shadow-2xl sm:rounded-[32px]">
            <video
              className="block aspect-[4/5] h-auto w-full max-w-full object-cover lg:aspect-[5/6]"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              style={{ backgroundColor: "var(--color-canvas-soft)" }}
            >
              <source src="/goat-typing-on-laptop-1080p-202609030103-1_QfYbMZo0.mp4" type="video/mp4" />
              <source src="/Goat_typing_on_laptop_1080p_202609030103.mp4" type="video/mp4" />
            </video>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent px-4 pb-4 pt-16 sm:px-5 sm:pb-5 sm:pt-20">
              <p className="font-caption font-semibold text-white">{c.caption}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
