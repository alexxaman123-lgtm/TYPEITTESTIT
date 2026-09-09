import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchLeaderboardScores, type LeaderboardScore } from "../lib/leaderboard";
import { cn } from "../utils/cn";
import type { Locale } from "../lib/i18n";

type SortMode = "wpm" | "accuracy";
type DifficultyFilter = "all" | "easy" | "medium" | "hard";
type DurationFilter = "all" | "60" | "120" | "180" | "300";

const MIN_LEADERBOARD_ACCURACY = 95;

type LeaderboardText = {
  brand: string;
  title: string;
  subtitle: string;
  refresh: string;
  refreshing: string;
  sortWpm: string;
  sortAccuracy: string;
  difficultyLabel: string;
  durationLabel: string;
  allDifficulties: string;
  easy: string;
  medium: string;
  hard: string;
  allDurations: string;
  minuteAbbrev: string;
  columnRank: string;
  columnUsername: string;
  columnWpm: string;
  columnAccuracy: string;
  columnWords: string;
  columnTest: string;
  loading: string;
  errorTitle: string;
  errorHint: string;
  noResults: string;
};

const TEXT: Record<Locale, LeaderboardText> = {
  en: {
    brand: "FreeTypingTestGoat",
    title: "Typing Test Leaderboard",
    subtitle: "See the fastest and most accurate FreeTypingTestGoat typists. One account earns one leaderboard position, with difficulty and test-duration filters.",
    refresh: "Refresh",
    refreshing: "Refreshing\u2026",
    sortWpm: "Top WPM",
    sortAccuracy: "Top Accuracy",
    difficultyLabel: "Difficulty",
    durationLabel: "Duration",
    allDifficulties: "All difficulties",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    allDurations: "All durations",
    minuteAbbrev: "min",
    columnRank: "#",
    columnUsername: "Username",
    columnWpm: "WPM",
    columnAccuracy: "Accuracy",
    columnWords: "Words",
    columnTest: "Test",
    loading: "Loading leaderboard\u2026",
    errorTitle: "Could not load leaderboard data.",
    errorHint: "Run the Supabase leaderboard SQL setup first, then refresh.",
    noResults: "No leaderboard scores match these filters yet.",
  },
  es: {
    brand: "Test de mecanograf\u00eda Cabra",
    title: "Clasificaci\u00f3n del test de mecanograf\u00eda",
    subtitle: "Consulta a los usuarios m\u00e1s r\u00e1pidos y precisos. Cada cuenta ocupa una sola posici\u00f3n, con filtros por dificultad y duraci\u00f3n.",
    refresh: "Actualizar",
    refreshing: "Actualizando\u2026",
    sortWpm: "Mejor WPM",
    sortAccuracy: "Mejor precisi\u00f3n",
    difficultyLabel: "Dificultad",
    durationLabel: "Duraci\u00f3n",
    allDifficulties: "Todas las dificultades",
    easy: "F\u00e1cil",
    medium: "Medio",
    hard: "Dif\u00edcil",
    allDurations: "Todas las duraciones",
    minuteAbbrev: "min",
    columnRank: "#",
    columnUsername: "Usuario",
    columnWpm: "WPM",
    columnAccuracy: "Precisi\u00f3n",
    columnWords: "Palabras",
    columnTest: "Prueba",
    loading: "Cargando clasificaci\u00f3n\u2026",
    errorTitle: "No se pudieron cargar los datos.",
    errorHint: "Comprueba la configuraci\u00f3n de la clasificaci\u00f3n en Supabase y vuelve a actualizar.",
    noResults: "Todav\u00eda no hay resultados que coincidan con estos filtros.",
  },
  de: {
    brand: "Schreibtest Ziege",
    title: "Bestenliste des Schreibtests",
    subtitle: "Sieh die schnellsten und genauesten Schreibtest-Ziege-Tipper. Ein Konto belegt einen Platz auf der Bestenliste, mit Filtern nach Schwierigkeit und Testdauer.",
    refresh: "Aktualisieren",
    refreshing: "Wird aktualisiert\u2026",
    sortWpm: "Beste WPM",
    sortAccuracy: "Beste Genauigkeit",
    difficultyLabel: "Schwierigkeit",
    durationLabel: "Dauer",
    allDifficulties: "Alle Schwierigkeiten",
    easy: "Leicht",
    medium: "Mittel",
    hard: "Schwer",
    allDurations: "Alle Dauern",
    minuteAbbrev: "Min.",
    columnRank: "#",
    columnUsername: "Benutzername",
    columnWpm: "WPM",
    columnAccuracy: "Genauigkeit",
    columnWords: "W\u00f6rter",
    columnTest: "Test",
    loading: "Bestenliste wird geladen\u2026",
    errorTitle: "Bestenlistendaten konnten nicht geladen werden.",
    errorHint: "F\u00fchre zuerst das Supabase-Setup f\u00fcr die Bestenliste aus und aktualisiere dann.",
    noResults: "Noch keine Bestenlisten-Ergebnisse passen zu diesen Filtern.",
  },
  fr: {
    brand: "Test de frappe Ch\u00e8vre",
    title: "Classement du test de frappe",
    subtitle: "D\u00e9couvrez les typistes Test de frappe Ch\u00e8vre les plus rapides et les plus pr\u00e9cis. Un compte occupe une seule position, avec des filtres de difficult\u00e9 et de dur\u00e9e.",
    refresh: "Actualiser",
    refreshing: "Actualisation\u2026",
    sortWpm: "Meilleur WPM",
    sortAccuracy: "Meilleure pr\u00e9cision",
    difficultyLabel: "Difficult\u00e9",
    durationLabel: "Dur\u00e9e",
    allDifficulties: "Toutes les difficult\u00e9s",
    easy: "Facile",
    medium: "Moyen",
    hard: "Difficile",
    allDurations: "Toutes les dur\u00e9es",
    minuteAbbrev: "min",
    columnRank: "#",
    columnUsername: "Nom d'utilisateur",
    columnWpm: "WPM",
    columnAccuracy: "Pr\u00e9cision",
    columnWords: "Mots",
    columnTest: "Test",
    loading: "Chargement du classement\u2026",
    errorTitle: "Impossible de charger les donn\u00e9es du classement.",
    errorHint: "Ex\u00e9cutez d'abord la configuration Supabase du classement, puis actualisez.",
    noResults: "Aucun r\u00e9sultat ne correspond encore \u00e0 ces filtres.",
  },
  it: {
    brand: "Test di Digitazione Capra",
    title: "Classifica del test di digitazione",
    subtitle: "Scopri i typist Test di Digitazione Capra pi\u00f9 rapidi e precisi. Un account occupa una sola posizione, con filtri per difficolt\u00e0 e durata.",
    refresh: "Aggiorna",
    refreshing: "Aggiornamento\u2026",
    sortWpm: "Miglior WPM",
    sortAccuracy: "Miglior precisione",
    difficultyLabel: "Difficolt\u00e0",
    durationLabel: "Durata",
    allDifficulties: "Tutte le difficolt\u00e0",
    easy: "Facile",
    medium: "Medio",
    hard: "Difficile",
    allDurations: "Tutte le durate",
    minuteAbbrev: "min",
    columnRank: "#",
    columnUsername: "Nome utente",
    columnWpm: "WPM",
    columnAccuracy: "Precisione",
    columnWords: "Parole",
    columnTest: "Test",
    loading: "Caricamento della classifica\u2026",
    errorTitle: "Non \u00e8 stato possibile caricare i dati della classifica.",
    errorHint: "Esegui prima la configurazione Supabase della classifica, poi aggiorna.",
    noResults: "Nessun risultato corrisponde ancora a questi filtri.",
  },
  pt: {
    brand: "Teste de Digita\u00e7\u00e3o Cabra",
    title: "Classifica\u00e7\u00e3o do teste de digita\u00e7\u00e3o",
    subtitle: "Veja os digitadores mais r\u00e1pidos e precisos do Teste de Digita\u00e7\u00e3o Cabra. Cada conta ocupa uma posi\u00e7\u00e3o, com filtros de dificuldade e dura\u00e7\u00e3o.",
    refresh: "Atualizar",
    refreshing: "Atualizando\u2026",
    sortWpm: "Melhor WPM",
    sortAccuracy: "Melhor precis\u00e3o",
    difficultyLabel: "Dificuldade",
    durationLabel: "Dura\u00e7\u00e3o",
    allDifficulties: "Todas as dificuldades",
    easy: "F\u00e1cil",
    medium: "M\u00e9dio",
    hard: "Dif\u00edcil",
    allDurations: "Todas as dura\u00e7\u00f5es",
    minuteAbbrev: "min",
    columnRank: "#",
    columnUsername: "Usu\u00e1rio",
    columnWpm: "WPM",
    columnAccuracy: "Precis\u00e3o",
    columnWords: "Palavras",
    columnTest: "Teste",
    loading: "Carregando classifica\u00e7\u00e3o\u2026",
    errorTitle: "N\u00e3o foi poss\u00edvel carregar os dados da classifica\u00e7\u00e3o.",
    errorHint: "Execute primeiro a configura\u00e7\u00e3o do Supabase para a classifica\u00e7\u00e3o e atualize novamente.",
    noResults: "Ainda n\u00e3o h\u00e1 resultados que correspondam a esses filtros.",
  },
  pl: {
    brand: "Test Pisania Koza",
    title: "Ranking testu pisania",
    subtitle: "Zobacz najszybszych i najdok\u0142adniejszych u\u017cytkownik\u00f3w Test Pisania Koza. Jedno konto zajmuje jedn\u0105 pozycj\u0119 w rankingu, z filtrami trudno\u015bci i czasu trwania.",
    refresh: "Od\u015bwie\u017c",
    refreshing: "Od\u015bwie\u017canie\u2026",
    sortWpm: "Najlepszy WPM",
    sortAccuracy: "Najlepsza dok\u0142adno\u015b\u0107",
    difficultyLabel: "Trudno\u015b\u0107",
    durationLabel: "Czas trwania",
    allDifficulties: "Wszystkie poziomy trudno\u015bci",
    easy: "\u0141atwy",
    medium: "\u015aredni",
    hard: "Trudny",
    allDurations: "Wszystkie czasy trwania",
    minuteAbbrev: "min",
    columnRank: "#",
    columnUsername: "Nazwa u\u017cytkownika",
    columnWpm: "WPM",
    columnAccuracy: "Dok\u0142adno\u015b\u0107",
    columnWords: "S\u0142owa",
    columnTest: "Test",
    loading: "Wczytywanie rankingu\u2026",
    errorTitle: "Nie uda\u0142o si\u0119 wczyta\u0107 danych rankingu.",
    errorHint: "Najpierw uruchom konfiguracj\u0119 Supabase dla rankingu, a nast\u0119pnie od\u015bwie\u017c.",
    noResults: "\u017badne wyniki nie pasuj\u0105 jeszcze do tych filtr\u00f3w.",
  },
  tr: {
    brand: "Yazma Testi Ke\u00e7i",
    title: "Yazma Testi Lider Tablosu",
    subtitle: "En h\u0131zl\u0131 ve en do\u011fru Yazma Testi Ke\u00e7i kullan\u0131c\u0131lar\u0131n\u0131 g\u00f6r\u00fcn. Bir hesap bir lider tablosu konumu kazan\u0131r; zorluk ve s\u00fcre filtreleri mevcuttur.",
    refresh: "Yenile",
    refreshing: "Yenileniyor\u2026",
    sortWpm: "En \u0130yi WPM",
    sortAccuracy: "En \u0130yi Do\u011fruluk",
    difficultyLabel: "Zorluk",
    durationLabel: "S\u00fcre",
    allDifficulties: "T\u00fcm zorluklar",
    easy: "Kolay",
    medium: "Orta",
    hard: "Zor",
    allDurations: "T\u00fcm s\u00fcreler",
    minuteAbbrev: "dk",
    columnRank: "#",
    columnUsername: "Kullan\u0131c\u0131 ad\u0131",
    columnWpm: "WPM",
    columnAccuracy: "Do\u011fruluk",
    columnWords: "Kelime",
    columnTest: "Test",
    loading: "Lider tablosu y\u00fckleniyor\u2026",
    errorTitle: "Lider tablosu verileri y\u00fcklenemedi.",
    errorHint: "\u00d6nce Supabase lider tablosu kurulumunu \u00e7al\u0131\u015ft\u0131r\u0131n, sonra yenileyin.",
    noResults: "Bu filtrelere uyan lider tablosu sonucu hen\u00fcz yok.",
  },
  uk: {
    brand: "\u0422\u0435\u0441\u0442 \u0434\u0440\u0443\u043a\u0443 \u041a\u043e\u0437\u0430",
    title: "\u0422\u0430\u0431\u043b\u0438\u0446\u044f \u043b\u0456\u0434\u0435\u0440\u0456\u0432 \u0442\u0435\u0441\u0442\u0443 \u043d\u0430\u0431\u043e\u0440\u0443 \u0442\u0435\u043a\u0441\u0442\u0443",
    subtitle: "\u041f\u0435\u0440\u0435\u0433\u043b\u044f\u043d\u044c\u0442\u0435 \u043d\u0430\u0439\u0448\u0432\u0438\u0434\u0448\u0438\u0445 \u0456 \u043d\u0430\u0439\u0442\u043e\u0447\u043d\u0456\u0448\u0438\u0445 \u043a\u043e\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0456\u0432 \u0442\u0435\u0441\u0442\u0443. \u041e\u0434\u0438\u043d \u0430\u043a\u0430\u0443\u043d\u0442 \u0437\u0430\u0439\u043c\u0430\u0454 \u043e\u0434\u043d\u0443 \u043f\u043e\u0437\u0438\u0446\u0456\u044e, \u0437 \u0444\u0456\u043b\u044c\u0442\u0440\u0430\u043c\u0438 \u0441\u043a\u043b\u0430\u0434\u043d\u043e\u0441\u0442\u0456 \u0442\u0430 \u0442\u0440\u0438\u0432\u0430\u043b\u043e\u0441\u0442\u0456.",
    refresh: "\u041e\u043d\u043e\u0432\u0438\u0442\u0438",
    refreshing: "\u041e\u043d\u043e\u0432\u043b\u0435\u043d\u043d\u044f\u2026",
    sortWpm: "\u041d\u0430\u0439\u043a\u0440\u0430\u0449\u0438\u0439 WPM",
    sortAccuracy: "\u041d\u0430\u0439\u043a\u0440\u0430\u0449\u0430 \u0442\u043e\u0447\u043d\u0456\u0441\u0442\u044c",
    difficultyLabel: "\u0421\u043a\u043b\u0430\u0434\u043d\u0456\u0441\u0442\u044c",
    durationLabel: "\u0442\u0440\u0438\u0432\u0430\u043b\u0456\u0441\u0442\u044c",
    allDifficulties: "\u0412\u0441\u0456 \u0440\u0456\u0432\u043d\u0456 \u0441\u043a\u043b\u0430\u0434\u043d\u043e\u0441\u0442\u0456",
    easy: "\u041b\u0435\u0433\u043a\u0438\u0439",
    medium: "\u0421\u0435\u0440\u0435\u0434\u043d\u0456\u0439",
    hard: "\u0421\u043a\u043b\u0430\u0434\u043d\u0438\u0439",
    allDurations: "\u0412\u0441\u0456 \u0442\u0440\u0438\u0432\u0430\u043b\u043e\u0441\u0442\u0456",
    minuteAbbrev: "\u0445\u0432",
    columnRank: "#",
    columnUsername: "\u0406\u043c'\u044f \u043a\u043e\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0430",
    columnWpm: "WPM",
    columnAccuracy: "\u0442\u043e\u0447\u043d\u0456\u0441\u0442\u044c",
    columnWords: "\u0421\u043b\u043e\u0432\u0430",
    columnTest: "\u0442\u0435\u0441\u0442",
    loading: "\u0417\u0430\u0432\u0430\u043d\u0442\u0430\u0436\u0435\u043d\u043d\u044f \u0442\u0430\u0431\u043b\u0438\u0446\u0456 \u043b\u0456\u0434\u0435\u0440\u0456\u0432\u2026",
    errorTitle: "\u041d\u0435 \u0432\u0434\u0430\u043b\u043e\u0441\u044f \u0437\u0430\u0432\u0430\u043d\u0442\u0430\u0436\u0438\u0442\u0438 \u0434\u0430\u043d\u0456 \u0442\u0430\u0431\u043b\u0438\u0446\u0456 \u043b\u0456\u0434\u0435\u0440\u0456\u0432.",
    errorHint: "\u0421\u043f\u043e\u0447\u0430\u0442\u043a\u0443 \u0432\u0438\u043a\u043e\u043d\u0430\u0439\u0442\u0435 \u043d\u0430\u043b\u0430\u0448\u0442\u0443\u0432\u0430\u043d\u043d\u044f Supabase \u0434\u043b\u044f \u0442\u0430\u0431\u043b\u0438\u0446\u0456 \u043b\u0456\u0434\u0435\u0440\u0456\u0432, \u043f\u043e\u0442\u0456\u043c \u043e\u043d\u043e\u0432\u0456\u0442\u044c.",
    noResults: "\u041f\u043e\u043a\u0438 \u0449\u043e \u043d\u0435\u043c\u0430\u0454 \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u0456\u0432, \u0449\u043e \u0432\u0456\u0434\u043f\u043e\u0432\u0456\u0434\u0430\u044e\u0442\u044c \u0446\u0438\u043c \u0444\u0456\u043b\u044c\u0442\u0440\u0430\u043c.",
  },
  id: {
    brand: "Tes Mengetik Kambing",
    title: "Papan Peringkat Tes Mengetik",
    subtitle: "Lihat pengetik Tes Mengetik Kambing tercepat dan paling akurat. Satu akun mendapat satu posisi peringkat, dengan filter kesulitan dan durasi.",
    refresh: "Segarkan",
    refreshing: "Menyegarkan\u2026",
    sortWpm: "WPM Terbaik",
    sortAccuracy: "Akurasi Terbaik",
    difficultyLabel: "Kesulitan",
    durationLabel: "Durasi",
    allDifficulties: "Semua tingkat kesulitan",
    easy: "Mudah",
    medium: "Sedang",
    hard: "Sulit",
    allDurations: "Semua durasi",
    minuteAbbrev: "mnt",
    columnRank: "#",
    columnUsername: "Nama pengguna",
    columnWpm: "WPM",
    columnAccuracy: "Akurasi",
    columnWords: "Kata",
    columnTest: "Tes",
    loading: "Memuat papan peringkat\u2026",
    errorTitle: "Data papan peringkat tidak dapat dimuat.",
    errorHint: "Jalankan dulu pengaturan Supabase untuk papan peringkat, lalu segarkan.",
    noResults: "Belum ada hasil papan peringkat yang cocok dengan filter ini.",
  },
  zh: {
    brand: "\u6253\u5b57\u6d4b\u8bd5\u5c71\u7f8a",
    title: "\u6253\u5b57\u6d4b\u8bd5\u6392\u884c\u699c",
    subtitle: "\u67e5\u770b\u6253\u5b57\u6d4b\u8bd5\u5c71\u7f8a\u4e2d\u901f\u5ea6\u6700\u5feb\u3001\u51c6\u786e\u7387\u6700\u9ad8\u7684\u6253\u5b57\u8005\u3002\u6bcf\u4e2a\u8d26\u6237\u5728\u6392\u884c\u699c\u4e0a\u5360\u636e\u4e00\u4e2a\u4f4d\u7f6e\uff0c\u53ef\u6309\u96be\u5ea6\u548c\u6d4b\u8bd5\u65f6\u957f\u7b5b\u9009\u3002",
    refresh: "\u5237\u65b0",
    refreshing: "\u6b63\u5728\u5237\u65b0\u2026",
    sortWpm: "\u6700\u9ad8WPM",
    sortAccuracy: "\u6700\u9ad8\u51c6\u786e\u7387",
    difficultyLabel: "\u96be\u5ea6",
    durationLabel: "\u65f6\u957f",
    allDifficulties: "\u6240\u6709\u96be\u5ea6",
    easy: "\u7b80\u5355",
    medium: "\u4e2d\u7b49",
    hard: "\u56f0\u96be",
    allDurations: "\u6240\u6709\u65f6\u957f",
    minuteAbbrev: "\u5206\u949f",
    columnRank: "#",
    columnUsername: "\u7528\u6237\u540d",
    columnWpm: "WPM",
    columnAccuracy: "\u51c6\u786e\u7387",
    columnWords: "\u5b57\u6570",
    columnTest: "\u6d4b\u8bd5",
    loading: "\u6b63\u5728\u52a0\u8f7d\u6392\u884c\u699c\u2026",
    errorTitle: "\u65e0\u6cd5\u52a0\u8f7d\u6392\u884c\u699c\u6570\u636e\u3002",
    errorHint: "\u8bf7\u5148\u5b8c\u6210Supabase\u6392\u884c\u699c\u8bbe\u7f6e\uff0c\u7136\u540e\u5237\u65b0\u3002",
    noResults: "\u76ee\u524d\u6ca1\u6709\u7b26\u5408\u8fd9\u4e9b\u7b5b\u9009\u6761\u4ef6\u7684\u6392\u884c\u699c\u6210\u7ee9\u3002",
  },
  ja: {
    brand: "\u30bf\u30a4\u30d4\u30f3\u30b0\u30c6\u30b9\u30c8 \u30e4\u30ae",
    title: "\u30bf\u30a4\u30d4\u30f3\u30b0\u30c6\u30b9\u30c8 \u30e9\u30f3\u30ad\u30f3\u30b0",
    subtitle: "\u30bf\u30a4\u30d4\u30f3\u30b0\u30c6\u30b9\u30c8 \u30e4\u30ae\u306e\u6700\u3082\u901f\u304f\u6b63\u78ba\u306a\u30bf\u30a4\u30d4\u30b9\u30c8\u3092\u898b\u3066\u307f\u307e\u3057\u3087\u3046\u3002\u30051\u3064\u306e\u30a2\u30ab\u30a6\u30f3\u30c8\u306b\u30051\u3064\u306e\u30e9\u30f3\u30ad\u30f3\u30b0\u9806\u4f4d\u3067\u3001\u96e3\u6613\u5ea6\u3068\u30c6\u30b9\u30c8\u6642\u9593\u3067\u30d5\u30a3\u30eb\u30bf\u30fc\u3067\u304d\u307e\u3059\u3002",
    refresh: "\u66f4\u65b0",
    refreshing: "\u66f4\u65b0\u4e2d\u2026",
    sortWpm: "\u6700\u9ad8WPM",
    sortAccuracy: "\u6700\u9ad8\u6b63\u78ba\u7387",
    difficultyLabel: "\u96e3\u6613\u5ea6",
    durationLabel: "\u6642\u9593",
    allDifficulties: "\u3059\u3079\u3066\u306e\u96e3\u6613\u5ea6",
    easy: "\u7c21\u5358",
    medium: "\u666e\u901a",
    hard: "\u96e3\u3057\u3044",
    allDurations: "\u3059\u3079\u3066\u306e\u6642\u9593",
    minuteAbbrev: "\u5206",
    columnRank: "#",
    columnUsername: "\u30e6\u30fc\u30b6\u30fc\u540d",
    columnWpm: "WPM",
    columnAccuracy: "\u6b63\u78ba\u7387",
    columnWords: "\u5358\u8a9e\u6570",
    columnTest: "\u30c6\u30b9\u30c8",
    loading: "\u30e9\u30f3\u30ad\u30f3\u30b0\u3092\u8aad\u307f\u8fbc\u307f\u4e2d\u2026",
    errorTitle: "\u30e9\u30f3\u30ad\u30f3\u30b0\u30c7\u30fc\u30bf\u3092\u8aad\u307f\u8fbc\u3081\u307e\u305b\u3093\u3067\u3057\u305f\u3002",
    errorHint: "\u307e\u305aSupabase\u306e\u30e9\u30f3\u30ad\u30f3\u30b0\u8a2d\u5b9a\u3092\u5b9f\u884c\u3057\u3001\u305d\u306e\u5f8c\u66f4\u65b0\u3057\u3066\u304f\u3060\u3055\u3044\u3002",
    noResults: "\u3053\u308c\u3089\u306e\u30d5\u30a3\u30eb\u30bf\u30fc\u306b\u4e00\u81f4\u3059\u308b\u30e9\u30f3\u30ad\u30f3\u30b0\u7d50\u679c\u306f\u307e\u3060\u3042\u308a\u307e\u305b\u3093\u3002",
  },
  ko: {
    brand: "\ud0c0\uc774\ud53c\ud551 \ud14c\uc2a4\ud2b8 \uc5fc\uc18c",
    title: "\ud0c0\uc774\ud53c\ud551 \ud14c\uc2a4\ud2b8 \ub9ac\ub354\ubcf4\ub4dc",
    subtitle: "\ud0c0\uc774\ud53c\ud551 \ud14c\uc2a4\ud2b8 \uc5fc\uc18c\uc5d0\uc11c \uac00\uc7a5 \ubc60\ub974\uace0 \uc815\ud655\ud55c \uc0ac\uc6a9\uc790\ub97c \ud655\uc778\ud558\uc138\uc694. \uacc4\uc815 \ud558\ub098\ub2f9 \ud558\ub098\uc758 \ub9ac\ub354\ubcf4\ub4dc \uc21c\uc704\ub97c \uac00\uc9c0\uc73c\uc5b0\uc82f\ub2c8\ub2e4.",
    refresh: "\uc0c8\ub85c\uace0\uce68",
    refreshing: "\uc0c8\ub85c\uace0\uce58\ub294 \uc911\u2026",
    sortWpm: "\ucd5c\uace0 WPM",
    sortAccuracy: "\ucd5c\uace0 \uc815\ud655\ub3c4",
    difficultyLabel: "\ub09c\uc774\ub3c4",
    durationLabel: "\uc2dc\uac04",
    allDifficulties: "\ubaa8\ub2e0 \ub09c\uc774\ub3c4",
    easy: "\uc26c\uc6c0",
    medium: "\ubcf4\ud1b5",
    hard: "\uc5b4\ub824\uc6c0",
    allDurations: "\ubaa8\ub2e0 \uc2dc\uac04",
    minuteAbbrev: "\ubd84",
    columnRank: "#",
    columnUsername: "\uc0ac\uc6a9\uc790 \uc774\ub9c4",
    columnWpm: "WPM",
    columnAccuracy: "\uc815\ud655\ub3c4",
    columnWords: "\ub2e8\uc5b4 \uc218",
    columnTest: "\ud14c\uc2a4\ud2b8",
    loading: "\ub9ac\ub354\ubcf4\ub4dc \ubd88\ub9ac\ub294 \uc911\u2026",
    errorTitle: "\ub9ac\ub354\ubcf4\ub4dc \ub370\uc774\ud0c0\ub97c \ubc88\ub9ac\uc6b4 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4.",
    errorHint: "\ubbfc\uc800 Supabase \ub9ac\ub354\ubcf4\ub4dc \uc124\uc815\uc744 \uc2e4\ud589\ud55c \ud6c4 \uc0c8\ub85c\uace0\uc744 \ub290\ub860 \uac70\uc744\uc74c\ub9e4\ub2c8\ub2e4.",
    noResults: "\uc774 \ud544\ud1a0\uc640 \uc77c\ucc98\ud558\ub294 \ub9ac\ub354\ubcf4\ub4dc \uacb0\uacfc\uac00 \uc5c6\uc2b5\ub2c8\ub2e4.",
  },
};

export default function LeaderboardPage({ locale = "en" as Locale }: { locale?: Locale }) {
  const t = TEXT[locale] ?? TEXT.en;
  const [scores, setScores] = useState<LeaderboardScore[]>([]);
  const [sortMode, setSortMode] = useState<SortMode>("wpm");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");
  const [duration, setDuration] = useState<DurationFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setScores(await fetchLeaderboardScores());
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errorTitle);
    } finally {
      setLoading(false);
    }
  }, [t.errorTitle]);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredScores = useMemo(() => {
    const filtered = scores.filter((score) => {
      if (score.accuracy < MIN_LEADERBOARD_ACCURACY) return false;

      const difficultyMatch = difficulty === "all" || score.difficulty === difficulty;
      const durationMatch = duration === "all" || score.duration_sec === Number(duration);
      return difficultyMatch && durationMatch;
    });

    const bestByUser = new Map<string, LeaderboardScore>();

    for (const score of filtered) {
      const existing = bestByUser.get(score.user_id);
      if (!existing) {
        bestByUser.set(score.user_id, score);
        continue;
      }

      const isBetter =
        sortMode === "accuracy"
          ? score.accuracy > existing.accuracy ||
            (score.accuracy === existing.accuracy && score.wpm > existing.wpm)
          : score.wpm > existing.wpm ||
            (score.wpm === existing.wpm && score.accuracy > existing.accuracy);

      if (isBetter) bestByUser.set(score.user_id, score);
    }

    return [...bestByUser.values()].sort((a, b) => {
      if (sortMode === "accuracy") {
        return b.accuracy - a.accuracy || b.wpm - a.wpm || a.username.localeCompare(b.username);
      }
      return b.wpm - a.wpm || b.accuracy - a.accuracy || a.username.localeCompare(b.username);
    });
  }, [scores, sortMode, difficulty, duration]);

  const difficultyLabel = (value: LeaderboardScore["difficulty"]) =>
    value === "easy" ? t.easy : value === "medium" ? t.medium : t.hard;

  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-white/10 bg-surface1/75 p-5 shadow-[0_0_70px_-24px_rgba(0,0,0,0.7)] backdrop-blur-sm sm:p-8">
        <div className="flex flex-col gap-5 border-b border-white/8 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-faint">{t.brand}</span>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{t.title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{t.subtitle}</p>
          </div>

          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="rounded-lg border border-white/12 bg-surface2 px-4 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:border-accent/40 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? t.refreshing : t.refresh}
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2">
            {(["wpm", "accuracy"] as SortMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setSortMode(mode)}
                className={cn(
                  "rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] transition-colors",
                  sortMode === mode
                    ? "border-accent/50 bg-accent/10 text-accent"
                    : "border-white/10 bg-surface2 text-muted hover:border-accent/30 hover:text-ink"
                )}
              >
                {mode === "wpm" ? t.sortWpm : t.sortAccuracy}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <FilterSelect
              label={t.difficultyLabel}
              value={difficulty}
              onChange={(value) => setDifficulty(value as DifficultyFilter)}
              options={[
                ["all", t.allDifficulties],
                ["easy", t.easy],
                ["medium", t.medium],
                ["hard", t.hard],
              ]}
            />
            <FilterSelect
              label={t.durationLabel}
              value={duration}
              onChange={(value) => setDuration(value as DurationFilter)}
              options={[
                ["all", t.allDurations],
                ["60", `1 ${t.minuteAbbrev}`],
                ["120", `2 ${t.minuteAbbrev}`],
                ["180", `3 ${t.minuteAbbrev}`],
                ["300", `5 ${t.minuteAbbrev}`],
              ]}
            />
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-surface2/50">
          <div className="grid grid-cols-[32px_minmax(100px,1fr)_65px_80px_80px_75px] gap-2 border-b border-white/8 px-3 py-3 text-[9px] font-bold uppercase tracking-[0.12em] text-faint sm:grid-cols-[48px_minmax(150px,1fr)_100px_105px_110px_95px] sm:gap-3 sm:px-5 sm:text-[10px] sm:tracking-[0.16em]">
            <span>{t.columnRank}</span>
            <span>{t.columnUsername}</span>
            <span className="text-right">{t.columnWpm}</span>
            <span className="text-right">{t.columnAccuracy}</span>
            <span className="text-right">{t.columnWords}</span>
            <span className="text-right">{t.columnTest}</span>
          </div>

          {loading ? (
            <div className="px-5 py-12 text-center text-sm text-muted">{t.loading}</div>
          ) : error ? (
            <div className="px-5 py-12 text-center text-sm text-muted">
              <p>{t.errorTitle}</p>
              <p className="mt-2 text-xs text-faint">{t.errorHint}</p>
            </div>
          ) : filteredScores.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-muted">{t.noResults}</div>
          ) : (
            filteredScores.map((score, index) => (
              <LeaderboardRow key={score.user_id} rank={index + 1} score={score} difficultyLabel={difficultyLabel(score.difficulty)} minuteAbbrev={t.minuteAbbrev} />
            ))
          )}
        </div>
      </section>
    </main>
  );
}

function LeaderboardRow({ rank, score, difficultyLabel, minuteAbbrev }: { rank: number; score: LeaderboardScore; difficultyLabel: string; minuteAbbrev: string }) {
  return (
    <div className="grid grid-cols-[32px_minmax(100px,1fr)_65px_80px_80px_75px] gap-2 border-b border-white/6 px-3 py-4 last:border-b-0 sm:grid-cols-[48px_minmax(150px,1fr)_100px_105px_110px_95px] sm:gap-3 sm:px-5">
      <div className="font-mono text-xs font-bold text-faint sm:text-sm">{rank}</div>
      <div className="min-w-0">
        <div className="truncate text-xs font-bold text-ink sm:text-sm">{score.username}</div>
        <div className="mt-1 text-[9px] uppercase tracking-[0.1em] text-faint sm:text-[10px] sm:tracking-[0.12em]">{difficultyLabel}</div>
      </div>
      <div className="text-right font-mono text-xs font-bold text-accent sm:text-sm">{score.wpm.toFixed(1)}</div>
      <div className="text-right font-mono text-xs font-bold text-ink-soft sm:text-sm">{score.accuracy.toFixed(2)}%</div>
      <div className="text-right font-mono text-xs text-muted sm:text-sm">{score.words_written.toFixed(1)}</div>
      <div className="text-right text-xs text-muted sm:text-sm">{score.duration_sec / 60} {minuteAbbrev}</div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<[string, string]>;
}) {
  return (
    <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-surface2 px-3 py-2 text-xs text-muted">
      <span className="uppercase tracking-[0.12em] text-faint">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="bg-transparent font-semibold text-ink outline-none"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option
            key={optionValue}
            value={optionValue}
            style={{ backgroundColor: "var(--color-surface3)", color: "var(--color-ink)" }}
          >
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}
