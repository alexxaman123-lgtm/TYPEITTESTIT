import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { fetchAccountStats, fetchTypingHistory, type AccountStats, type AccountStatsBucket, type TypingHistoryEntry } from "../lib/typingHistory";
import { getSpeedTier } from "../lib/stats";
import AuthModal from "./AuthModal";
import { LOCALE_META, tr, type Locale } from "../lib/i18n";
import { setCachedAvatarUrl, setCachedUsername } from "../lib/accountCache";

interface AccountPageProps { locale?: Locale; }

// Same tier-name/message translation keys ResultPanel.tsx uses after a test,
// kept in sync here so the badge on the account page always matches the
// wording a user just saw on their most recent result.
const speedTierNameKey: Record<string, string> = {
  "SLOW GOAT": "speedTierSlowName",
  "AVERAGE GOAT": "speedTierAverageName",
  "THE GOAT EVERYBODY TALKS ABOUT": "speedTierTalksName",
  "ACE GOAT": "speedTierAceName",
  "HONORABLE GOAT": "speedTierHonorableName",
  "MYTHICAL GOAT": "speedTierMythicalName",
};
const TIER_BADGE_STYLES: Record<string, string> = {
  "MYTHICAL GOAT": "border-accent/50 bg-gradient-to-r from-accent/20 to-accent/5 text-accent",
  "HONORABLE GOAT": "border-accent/50 bg-gradient-to-r from-accent/20 to-accent/5 text-accent",
  "ACE GOAT": "border-accent/50 bg-gradient-to-r from-accent/20 to-accent/5 text-accent",
  "THE GOAT EVERYBODY TALKS ABOUT": "border-accent/40 bg-accent/10 text-ink",
  "AVERAGE GOAT": "border-hairline bg-canvas text-text-muted",
  "SLOW GOAT": "border-hairline bg-canvas text-text-muted",
};

const STAT_DURATIONS = [15, 30, 60, 120];
const STAT_DIFFICULTIES: Array<"easy" | "medium" | "hard"> = ["easy", "medium", "hard"];

type AccountText = {
  yourAccount: string; keepProgress: string; signInPrompt: string; signIn: string; account: string; typingHistory: string; yourPersonalProgress: string; refresh: string; errorLoad: string; tryAgain: string; bestWpmLabel: string; bestAccuracyLabel: string; dateLabel: string; accuracyLabel: string; errorsLabel: string; testLabel: string; loadingDots: string; emptyHistory: string; customLabel: string; progressLabel: string; speedAccuracyLabel: string; trackChanges: string; currentResultDesc: string; testWord: string; testsWord: string; latestTestLabel: string; currentResultLabel: string; latestResultLabel: string; changeFromPreviousLabel: string; trendLabel: string; completeAnotherTest: string; progressGraphAria: string; accountInfoHeading: string; emailLabel: string; usernameLabel: string; memberSinceLabel: string; notProvided: string; testsCompletedLabel: string; timeTypingLabel: string; statsByTestHeading: string; byDifficultyHeading: string; bestLabel: string; avgLabel: string;
};

const TEXT: Record<Locale, AccountText> = {
  en: { yourAccount: "Your account", keepProgress: "Keep your typing progress", signInPrompt: "Sign in to view your test history, personal bests, and typing progress.", signIn: "Sign in", account: "Account", typingHistory: "Typing History", yourPersonalProgress: "Your personal progress", refresh: "Refresh", errorLoad: "We couldn't load your typing history. Check your account setup and try again.", tryAgain: "Try again", bestWpmLabel: "Best WPM", bestAccuracyLabel: "Best accuracy", dateLabel: "Date", accuracyLabel: "Accuracy", errorsLabel: "Errors", testLabel: "Test", loadingDots: "Loading\u2026", emptyHistory: "Complete a test of at least one minute to start your history.", customLabel: "Custom", progressLabel: "Progress", speedAccuracyLabel: "Speed & accuracy", trackChanges: "Track how your performance changes over time", currentResultDesc: "Your current result", testWord: "test", testsWord: "tests", latestTestLabel: "Latest test", currentResultLabel: "Current result", latestResultLabel: "Latest result", changeFromPreviousLabel: "Change from previous test", trendLabel: "Trend", completeAnotherTest: "Complete another test to see the trend.", progressGraphAria: "Typing progress graph showing WPM and accuracy", accountInfoHeading: "Account information", emailLabel: "Email", usernameLabel: "Username", memberSinceLabel: "Member since", notProvided: "Not provided", testsCompletedLabel: "Tests completed", timeTypingLabel: "Time typing", statsByTestHeading: "Stats by test length", byDifficultyHeading: "Best WPM by difficulty", bestLabel: "Best", avgLabel: "Avg" },
  es: { yourAccount: "Tu cuenta", keepProgress: "Guarda tu progreso de escritura", signInPrompt: "Inicia sesi\u00f3n para ver tu historial de pruebas, tus mejores resultados y tu progreso personal.", signIn: "Iniciar sesi\u00f3n", account: "Cuenta", typingHistory: "Historial de escritura", yourPersonalProgress: "Tu progreso personal", refresh: "Actualizar", errorLoad: "No se pudo cargar tu historial. Comprueba la configuraci\u00f3n de tu cuenta y vuelve a intentarlo.", tryAgain: "Volver a intentar", bestWpmLabel: "Mejor WPM", bestAccuracyLabel: "Mejor precisi\u00f3n", dateLabel: "Fecha", accuracyLabel: "Precisi\u00f3n", errorsLabel: "Errores", testLabel: "Prueba", loadingDots: "Cargando\u2026", emptyHistory: "Completa una prueba de al menos un minuto para empezar tu historial.", customLabel: "Personalizada", progressLabel: "Progreso", speedAccuracyLabel: "Velocidad y precisi\u00f3n", trackChanges: "Evoluci\u00f3n de tus \u00faltimas pruebas", currentResultDesc: "Tu resultado actual", testWord: "prueba", testsWord: "pruebas", latestTestLabel: "\u00daltima prueba", currentResultLabel: "Resultado actual", latestResultLabel: "\u00daltimo resultado", changeFromPreviousLabel: "Cambio desde la prueba anterior", trendLabel: "Tendencia", completeAnotherTest: "Completa otra prueba para ver la tendencia.", progressGraphAria: "Gr\u00e1fico de progreso de WPM y precisi\u00f3n", accountInfoHeading: "Información de la cuenta", emailLabel: "Correo electrónico", usernameLabel: "Nombre de usuario", memberSinceLabel: "Miembro desde", notProvided: "No proporcionado", testsCompletedLabel: "Pruebas completadas", timeTypingLabel: "Tiempo escribiendo", statsByTestHeading: "Estadísticas por duración de prueba", byDifficultyHeading: "Mejor WPM por dificultad", bestLabel: "Mejor", avgLabel: "Media" },
  de: { yourAccount: "Dein Konto", keepProgress: "Behalte deinen Tippfortschritt im Blick", signInPrompt: "Melde dich an, um deinen Testverlauf, pers\u00f6nliche Bestleistungen und deinen Tippfortschritt zu sehen.", signIn: "Anmelden", account: "Konto", typingHistory: "Tippverlauf", yourPersonalProgress: "Dein pers\u00f6nlicher Fortschritt", refresh: "Aktualisieren", errorLoad: "Dein Tippverlauf konnte nicht geladen werden. \u00dcberpr\u00fcfe deine Kontoeinstellungen und versuche es erneut.", tryAgain: "Erneut versuchen", bestWpmLabel: "Beste WPM", bestAccuracyLabel: "Beste Genauigkeit", dateLabel: "Datum", accuracyLabel: "Genauigkeit", errorsLabel: "Fehler", testLabel: "Test", loadingDots: "Wird geladen\u2026", emptyHistory: "Absolviere einen mindestens einmin\u00fctigen Test, um deinen Verlauf zu starten.", customLabel: "Benutzerdefiniert", progressLabel: "Fortschritt", speedAccuracyLabel: "Geschwindigkeit & Genauigkeit", trackChanges: "Verfolge, wie sich deine Leistung im Laufe der Zeit ver\u00e4ndert", currentResultDesc: "Dein aktuelles Ergebnis", testWord: "Test", testsWord: "Tests", latestTestLabel: "Letzter Test", currentResultLabel: "Aktuelles Ergebnis", latestResultLabel: "Letztes Ergebnis", changeFromPreviousLabel: "\u00c4nderung seit dem letzten Test", trendLabel: "Trend", completeAnotherTest: "Absolviere einen weiteren Test, um den Trend zu sehen.", progressGraphAria: "Tippfortschrittsdiagramm mit WPM und Genauigkeit", accountInfoHeading: "Kontoinformationen", emailLabel: "E-Mail", usernameLabel: "Benutzername", memberSinceLabel: "Mitglied seit", notProvided: "Nicht angegeben", testsCompletedLabel: "Abgeschlossene Tests", timeTypingLabel: "Tippzeit", statsByTestHeading: "Statistiken nach Testdauer", byDifficultyHeading: "Bestes WPM nach Schwierigkeit", bestLabel: "Beste", avgLabel: "Durchschnitt" },
  fr: { yourAccount: "Votre compte", keepProgress: "Suivez votre progression en frappe", signInPrompt: "Connectez-vous pour voir votre historique de tests, vos meilleurs r\u00e9sultats et votre progression.", signIn: "Se connecter", account: "Compte", typingHistory: "Historique de frappe", yourPersonalProgress: "Votre progression personnelle", refresh: "Actualiser", errorLoad: "Nous n'avons pas pu charger votre historique. V\u00e9rifiez la configuration de votre compte et r\u00e9essayez.", tryAgain: "R\u00e9essayer", bestWpmLabel: "Meilleur WPM", bestAccuracyLabel: "Meilleure pr\u00e9cision", dateLabel: "Date", accuracyLabel: "Pr\u00e9cision", errorsLabel: "Erreurs", testLabel: "Test", loadingDots: "Chargement\u2026", emptyHistory: "Terminez un test d'au moins une minute pour d\u00e9marrer votre historique.", customLabel: "Personnalis\u00e9", progressLabel: "Progression", speedAccuracyLabel: "Vitesse et pr\u00e9cision", trackChanges: "Suivez l'\u00e9volution de vos performances dans le temps", currentResultDesc: "Votre r\u00e9sultat actuel", testWord: "test", testsWord: "tests", latestTestLabel: "Dernier test", currentResultLabel: "R\u00e9sultat actuel", latestResultLabel: "Dernier r\u00e9sultat", changeFromPreviousLabel: "Changement par rapport au test pr\u00e9c\u00e9dent", trendLabel: "Tendance", completeAnotherTest: "Terminez un autre test pour voir la tendance.", progressGraphAria: "Graphique de progression montrant le WPM et la pr\u00e9cision", accountInfoHeading: "Informations du compte", emailLabel: "E-mail", usernameLabel: "Nom d'utilisateur", memberSinceLabel: "Membre depuis", notProvided: "Non renseigné", testsCompletedLabel: "Tests termin\u00e9s", timeTypingLabel: "Temps de frappe", statsByTestHeading: "Statistiques par dur\u00e9e de test", byDifficultyHeading: "Meilleur WPM par difficult\u00e9", bestLabel: "Meilleur", avgLabel: "Moyenne" },
  it: { yourAccount: "Il tuo account", keepProgress: "Tieni traccia dei tuoi progressi di digitazione", signInPrompt: "Accedi per vedere la cronologia dei test, i tuoi migliori risultati e i tuoi progressi.", signIn: "Accedi", account: "Account", typingHistory: "Cronologia di digitazione", yourPersonalProgress: "I tuoi progressi personali", refresh: "Aggiorna", errorLoad: "Non \u00e8 stato possibile caricare la tua cronologia. Controlla le impostazioni del tuo account e riprova.", tryAgain: "Riprova", bestWpmLabel: "Miglior WPM", bestAccuracyLabel: "Miglior precisione", dateLabel: "Data", accuracyLabel: "Precisione", errorsLabel: "Errori", testLabel: "Test", loadingDots: "Caricamento\u2026", emptyHistory: "Completa un test di almeno un minuto per iniziare la tua cronologia.", customLabel: "Personalizzato", progressLabel: "Progressi", speedAccuracyLabel: "Velocit\u00e0 e precisione", trackChanges: "Monitora come cambiano le tue prestazioni nel tempo", currentResultDesc: "Il tuo risultato attuale", testWord: "test", testsWord: "test", latestTestLabel: "Ultimo test", currentResultLabel: "Risultato attuale", latestResultLabel: "Ultimo risultato", changeFromPreviousLabel: "Variazione rispetto al test precedente", trendLabel: "Tendenza", completeAnotherTest: "Completa un altro test per vedere la tendenza.", progressGraphAria: "Grafico dei progressi di digitazione con WPM e precisione", accountInfoHeading: "Informazioni sull'account", emailLabel: "Email", usernameLabel: "Nome utente", memberSinceLabel: "Membro da", notProvided: "Non fornito", testsCompletedLabel: "Test completati", timeTypingLabel: "Tempo di digitazione", statsByTestHeading: "Statistiche per durata del test", byDifficultyHeading: "Miglior WPM per difficolt\u00e0", bestLabel: "Migliore", avgLabel: "Media" },
  pt: { yourAccount: "Sua conta", keepProgress: "Acompanhe seu progresso de digita\u00e7\u00e3o", signInPrompt: "Entre para ver seu hist\u00f3rico de testes, melhores resultados e progresso de digita\u00e7\u00e3o.", signIn: "Entrar", account: "Conta", typingHistory: "Hist\u00f3rico de digita\u00e7\u00e3o", yourPersonalProgress: "Seu progresso pessoal", refresh: "Atualizar", errorLoad: "N\u00e3o foi poss\u00edvel carregar seu hist\u00f3rico. Verifique a configura\u00e7\u00e3o da sua conta e tente novamente.", tryAgain: "Tentar novamente", bestWpmLabel: "Melhor WPM", bestAccuracyLabel: "Melhor precis\u00e3o", dateLabel: "Data", accuracyLabel: "Precis\u00e3o", errorsLabel: "Erros", testLabel: "Teste", loadingDots: "Carregando\u2026", emptyHistory: "Complete um teste de pelo menos um minuto para iniciar seu hist\u00f3rico.", customLabel: "Personalizado", progressLabel: "Progresso", speedAccuracyLabel: "Velocidade e precis\u00e3o", trackChanges: "Acompanhe como seu desempenho muda ao longo do tempo", currentResultDesc: "Seu resultado atual", testWord: "teste", testsWord: "testes", latestTestLabel: "\u00daltimo teste", currentResultLabel: "Resultado atual", latestResultLabel: "\u00daltimo resultado", changeFromPreviousLabel: "Mudan\u00e7a em rela\u00e7\u00e3o ao teste anterior", trendLabel: "Tend\u00eancia", completeAnotherTest: "Complete outro teste para ver a tend\u00eancia.", progressGraphAria: "Gr\u00e1fico de progresso de digita\u00e7\u00e3o mostrando WPM e precis\u00e3o", accountInfoHeading: "Informações da conta", emailLabel: "E-mail", usernameLabel: "Nome de usuário", memberSinceLabel: "Membro desde", notProvided: "Não fornecido", testsCompletedLabel: "Testes conclu\u00eddos", timeTypingLabel: "Tempo digitando", statsByTestHeading: "Estat\u00edsticas por dura\u00e7\u00e3o do teste", byDifficultyHeading: "Melhor WPM por dificuldade", bestLabel: "Melhor", avgLabel: "M\u00e9dia" },
  pl: { yourAccount: "Twoje konto", keepProgress: "\u015aled\u017a swoje post\u0119py w pisaniu", signInPrompt: "Zaloguj si\u0119, aby zobaczy\u0107 histori\u0119 test\u00f3w, najlepsze wyniki i post\u0119py w pisaniu.", signIn: "Zaloguj si\u0119", account: "Konto", typingHistory: "Historia pisania", yourPersonalProgress: "Twoje osobiste post\u0119py", refresh: "Od\u015bwie\u017c", errorLoad: "Nie uda\u0142o si\u0119 wczyta\u0107 Twojej historii. Sprawd\u017a ustawienia konta i spr\u00f3buj ponownie.", tryAgain: "Spr\u00f3buj ponownie", bestWpmLabel: "Najlepszy WPM", bestAccuracyLabel: "Najlepsza dok\u0142adno\u015b\u0107", dateLabel: "Data", accuracyLabel: "Dok\u0142adno\u015b\u0107", errorsLabel: "B\u0142\u0119dy", testLabel: "Test", loadingDots: "Wczytywanie\u2026", emptyHistory: "Uko\u0144cz test trwaj\u0105cy co najmniej minut\u0119, aby rozpocz\u0105\u0107 histori\u0119.", customLabel: "Niestandardowy", progressLabel: "Post\u0119py", speedAccuracyLabel: "Szybko\u015b\u0107 i dok\u0142adno\u015b\u0107", trackChanges: "\u015aled\u017a, jak zmieniaj\u0105 si\u0119 Twoje wyniki w czasie", currentResultDesc: "Tw\u00f3j aktualny wynik", testWord: "test", testsWord: "test\u00f3w", latestTestLabel: "Ostatni test", currentResultLabel: "Aktualny wynik", latestResultLabel: "Ostatni wynik", changeFromPreviousLabel: "Zmiana wzgl\u0119dem poprzedniego testu", trendLabel: "Trend", completeAnotherTest: "Uko\u0144cz kolejny test, aby zobaczy\u0107 trend.", progressGraphAria: "Wykres post\u0119p\u00f3w pisania pokazuj\u0105cy WPM i dok\u0142adno\u015b\u0107", accountInfoHeading: "Informacje o koncie", emailLabel: "E-mail", usernameLabel: "Nazwa użytkownika", memberSinceLabel: "Członek od", notProvided: "Nie podano", testsCompletedLabel: "Zako\u0144czone testy", timeTypingLabel: "Czas pisania", statsByTestHeading: "Statystyki wed\u0142ug czasu testu", byDifficultyHeading: "Najlepsze WPM wed\u0142ug trudno\u015bci", bestLabel: "Najlepszy", avgLabel: "\u015arednia" },
  tr: { yourAccount: "Hesab\u0131n", keepProgress: "Yazma ilerlemeni takip et", signInPrompt: "Test ge\u00e7mi\u015fini, ki\u015fisel en iyilerini ve yazma ilerlemeni g\u00f6rmek i\u00e7in oturum a\u00e7.", signIn: "Oturum a\u00e7", account: "Hesap", typingHistory: "Yazma Ge\u00e7mi\u015fi", yourPersonalProgress: "Ki\u015fisel ilerlemen", refresh: "Yenile", errorLoad: "Ge\u00e7mi\u015fin y\u00fcklenemedi. Hesap ayarlar\u0131n\u0131 kontrol edip tekrar dene.", tryAgain: "Tekrar dene", bestWpmLabel: "En \u0130yi WPM", bestAccuracyLabel: "En \u0130yi Do\u011fruluk", dateLabel: "Tarih", accuracyLabel: "Do\u011fruluk", errorsLabel: "Hatalar", testLabel: "Test", loadingDots: "Y\u00fckleniyor\u2026", emptyHistory: "Ge\u00e7mi\u015fini ba\u015flatmak i\u00e7in en az bir dakikal\u0131k bir test tamamla.", customLabel: "\u00d6zel", progressLabel: "\u0130lerleme", speedAccuracyLabel: "H\u0131z ve do\u011fruluk", trackChanges: "Performans\u0131n\u0131n zaman i\u00e7inde nas\u0131l de\u011fi\u015fti\u011fini takip et", currentResultDesc: "Mevcut sonucun", testWord: "test", testsWord: "test", latestTestLabel: "Son test", currentResultLabel: "Mevcut sonu\u00e7", latestResultLabel: "Son sonu\u00e7", changeFromPreviousLabel: "\u00d6nceki testten de\u011fi\u015fim", trendLabel: "E\u011filim", completeAnotherTest: "E\u011filimi g\u00f6rmek i\u00e7in ba\u015fka bir test tamamla.", progressGraphAria: "WPM ve do\u011fruluu g\u00f6steren yazma ilerleme grafi\u011fi", accountInfoHeading: "Hesap bilgileri", emailLabel: "E-posta", usernameLabel: "Kullanıcı adı", memberSinceLabel: "Üyelik başlangıcı", notProvided: "Belirtilmedi", testsCompletedLabel: "Tamamlanan testler", timeTypingLabel: "Yazma s\u00fcresi", statsByTestHeading: "Test s\u00fcresine g\u00f6re istatistikler", byDifficultyHeading: "Zorlu\u011fa g\u00f6re en iyi WPM", bestLabel: "En iyi", avgLabel: "Ortalama" },
  uk: { yourAccount: "\u0412\u0430\u0448 \u0430\u043a\u0430\u0443\u043d\u0442", keepProgress: "\u0412\u0456\u0434\u0441\u0442\u0435\u0436\u0443\u0439\u0442\u0435 \u0441\u0432\u0456\u0439 \u043f\u0440\u043e\u0433\u0440\u0435\u0441 \u043d\u0430\u0431\u043e\u0440\u0443 \u0442\u0435\u043a\u0441\u0442\u0443", signInPrompt: "\u0423\u0432\u0456\u0439\u0434\u0456\u0442\u044c, \u0449\u043e\u0431 \u043f\u0435\u0440\u0435\u0433\u043b\u044f\u043d\u0443\u0442\u0438 \u0456\u0441\u0442\u043e\u0440\u0456\u044e \u0442\u0435\u0441\u0442\u0456\u0432, \u043e\u0441\u043e\u0431\u0438\u0441\u0442\u0456 \u0440\u0435\u043a\u043e\u0440\u0434\u0438 \u0442\u0430 \u043f\u0440\u043e\u0433\u0440\u0435\u0441 \u043d\u0430\u0431\u043e\u0440\u0443 \u0442\u0435\u043a\u0441\u0442\u0443.", signIn: "\u0423\u0432\u0456\u0439\u0442\u0438", account: "\u0410\u043a\u0430\u0443\u043d\u0442", typingHistory: "\u0406\u0441\u0442\u043e\u0440\u0456\u044f \u043d\u0430\u0431\u043e\u0440\u0443 \u0442\u0435\u043a\u0441\u0442\u0443", yourPersonalProgress: "\u0412\u0430\u0448 \u043e\u0441\u043e\u0431\u0438\u0441\u0442\u0438\u0439 \u043f\u0440\u043e\u0433\u0440\u0435\u0441", refresh: "\u041e\u043d\u043e\u0432\u0438\u0442\u0438", errorLoad: "\u041d\u0435 \u0432\u0434\u0430\u043b\u043e\u0441\u044f \u0437\u0430\u0432\u0430\u043d\u0442\u0430\u0436\u0438\u0442\u0438 \u0432\u0430\u0448\u0443 \u0456\u0441\u0442\u043e\u0440\u0456\u044e. \u041f\u0435\u0440\u0435\u0432\u0456\u0440\u0442\u0435 \u043d\u0430\u043b\u0430\u0448\u0442\u0443\u0432\u0430\u043d\u043d\u044f \u0430\u043a\u0430\u0443\u043d\u0442\u0430 \u0442\u0430 \u0441\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0449\u0435 \u0440\u0430\u0437.", tryAgain: "\u0421\u043f\u0440\u043e\u0431\u0443\u0432\u0430\u0442\u0438 \u0449\u0435 \u0440\u0430\u0437", bestWpmLabel: "\u041d\u0430\u0439\u043a\u0440\u0430\u0449\u0438\u0439 WPM", bestAccuracyLabel: "\u041d\u0430\u0439\u043a\u0440\u0430\u0449\u0430 \u0442\u043e\u0447\u043d\u0456\u0441\u0442\u044c", dateLabel: "\u0414\u0430\u0442\u0430", accuracyLabel: "\u0422\u043e\u0447\u043d\u0456\u0441\u0442\u044c", errorsLabel: "\u041f\u043e\u043c\u0438\u043b\u043a\u0438", testLabel: "\u0422\u0435\u0441\u0442", loadingDots: "\u0417\u0430\u0432\u0430\u043d\u0442\u0430\u0436\u0435\u043d\u043d\u044f\u2026", emptyHistory: "\u0417\u0430\u0432\u0435\u0440\u0448\u0456\u0442\u044c \u0442\u0435\u0441\u0442 \u0442\u0440\u0438\u0432\u0430\u043b\u0456\u0441\u0442\u044e \u0449\u043e\u043d\u0430\u0439\u043c\u0435\u043d\u0448\u0435 \u043e\u0434\u043d\u0430 \u0445\u0432\u0438\u043b\u0438\u043d\u0430, \u0449\u043e\u0431 \u0440\u043e\u0437\u043f\u043e\u0447\u0430\u0442\u0438 \u0456\u0441\u0442\u043e\u0440\u0456\u044e.", customLabel: "\u0412\u043b\u0430\u0441\u043d\u0438\u0439", progressLabel: "\u041f\u0440\u043e\u0433\u0440\u0435\u0441", speedAccuracyLabel: "\u0428\u0432\u0438\u0434\u043a\u0456\u0441\u0442\u044c \u0456 \u0442\u043e\u0447\u043d\u0456\u0441\u0442\u044c", trackChanges: "\u0421\u0442\u0435\u0436\u0442\u0435 \u0437\u0430 \u0442\u0438\u043c, \u044f\u043a \u0437\u043c\u0456\u043d\u044e\u044e\u0442\u044c\u0441\u044f \u0432\u0430\u0448\u0456 \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u0438 \u0437 \u0447\u0430\u0441\u043e\u043c", currentResultDesc: "\u0412\u0430\u0448 \u043f\u043e\u0442\u043e\u0447\u043d\u0438\u0439 \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442", testWord: "\u0442\u0435\u0441\u0442", testsWord: "\u0442\u0435\u0441\u0442\u0456\u0432", latestTestLabel: "\u041e\u0441\u0442\u0430\u043d\u043d\u0456\u0439 \u0442\u0435\u0441\u0442", currentResultLabel: "\u041f\u043e\u0442\u043e\u0447\u043d\u0438\u0439 \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442", latestResultLabel: "\u041e\u0441\u0442\u0430\u043d\u043d\u0456\u0439 \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442", changeFromPreviousLabel: "\u0417\u043c\u0456\u043d\u0430 \u043f\u043e\u0440\u0456\u0432\u043d\u044f\u043d\u043e \u0437 \u043f\u043e\u043f\u0435\u0440\u0435\u0434\u043d\u0456\u043c \u0442\u0435\u0441\u0442\u043e\u043c", trendLabel: "\u0422\u0435\u043d\u0434\u0435\u043d\u0446\u0456\u044f", completeAnotherTest: "\u0417\u0430\u0432\u0435\u0440\u0448\u0456\u0442\u044c \u0449\u0435 \u043e\u0434\u0438\u043d \u0442\u0435\u0441\u0442, \u0449\u043e\u0431 \u043f\u043e\u0431\u0430\u0447\u0438\u0442\u0438 \u0442\u0435\u043d\u0434\u0435\u043d\u0446\u0456\u044e.", progressGraphAria: "\u0413\u0440\u0430\u0444\u0456\u043a \u043f\u0440\u043e\u0433\u0440\u0435\u0441\u0443 \u043d\u0430\u0431\u043e\u0440\u0443 \u0442\u0435\u043a\u0441\u0442\u0443 \u0437 WPM \u0456 \u0442\u043e\u0447\u043d\u0456\u0441\u0442\u044e", accountInfoHeading: "Інформація про акаунт", emailLabel: "Електронна пошта", usernameLabel: "Ім'я користувача", memberSinceLabel: "Учасник з", notProvided: "Не вказано", testsCompletedLabel: "Завершені тести", timeTypingLabel: "Час набору", statsByTestHeading: "Статистика за тривалістю тесту", byDifficultyHeading: "Найкращий WPM за складністю", bestLabel: "Найкращий", avgLabel: "Середнє" },
  id: { yourAccount: "Akunmu", keepProgress: "Pantau progres mengetikmu", signInPrompt: "Masuk untuk melihat riwayat tes, rekor pribadi, dan progres mengetikmu.", signIn: "Masuk", account: "Akun", typingHistory: "Riwayat Mengetik", yourPersonalProgress: "Progres pribadimu", refresh: "Segarkan", errorLoad: "Riwayatmu tidak dapat dimuat. Periksa pengaturan akunmu dan coba lagi.", tryAgain: "Coba lagi", bestWpmLabel: "WPM Terbaik", bestAccuracyLabel: "Akurasi Terbaik", dateLabel: "Tanggal", accuracyLabel: "Akurasi", errorsLabel: "Kesalahan", testLabel: "Tes", loadingDots: "Memuat\u2026", emptyHistory: "Selesaikan tes minimal satu menit untuk memulai riwayatmu.", customLabel: "Kustom", progressLabel: "Progres", speedAccuracyLabel: "Kecepatan & akurasi", trackChanges: "Pantau perubahan performamu dari waktu ke waktu", currentResultDesc: "Hasil terkinimu", testWord: "tes", testsWord: "tes", latestTestLabel: "Tes terbaru", currentResultLabel: "Hasil saat ini", latestResultLabel: "Hasil terbaru", changeFromPreviousLabel: "Perubahan dari tes sebelumnya", trendLabel: "Tren", completeAnotherTest: "Selesaikan tes lain untuk melihat tren.", progressGraphAria: "Grafik progres mengetik yang menunjukkan WPM dan akurasi", accountInfoHeading: "Informasi akun", emailLabel: "Email", usernameLabel: "Nama pengguna", memberSinceLabel: "Anggota sejak", notProvided: "Tidak disediakan", testsCompletedLabel: "Tes selesai", timeTypingLabel: "Waktu mengetik", statsByTestHeading: "Statistik berdasarkan durasi tes", byDifficultyHeading: "WPM terbaik berdasarkan kesulitan", bestLabel: "Terbaik", avgLabel: "Rata-rata" },
  zh: { yourAccount: "\u4f60\u7684\u8d26\u6237", keepProgress: "\u8bb0\u5f55\u4f60\u7684\u6253\u5b57\u8fdb\u5ea6", signInPrompt: "\u767b\u5f55\u4ee5\u67e5\u770b\u6d4b\u8bd5\u5386\u53f2\u3001\u4e2a\u4eba\u6700\u4f73\u6210\u7ee9\u548c\u6253\u5b57\u8fdb\u5ea6\u3002", signIn: "\u767b\u5f55", account: "\u8d26\u6237", typingHistory: "\u6253\u5b57\u5386\u53f2", yourPersonalProgress: "\u4f60\u7684\u4e2a\u4eba\u8fdb\u5ea6", refresh: "\u5237\u65b0", errorLoad: "\u65e0\u6cd5\u52a0\u8f7d\u4f60\u7684\u5386\u53f2\u8bb0\u5f55\u3002\u8bf7\u68c0\u67e5\u8d26\u6237\u8bbe\u7f6e\u5e76\u91cd\u8bd5\u3002", tryAgain: "\u91cd\u8bd5", bestWpmLabel: "\u6700\u9ad8WPM", bestAccuracyLabel: "\u6700\u9ad8\u51c6\u786e\u7387", dateLabel: "\u65e5\u671f", accuracyLabel: "\u51c6\u786e\u7387", errorsLabel: "\u9519\u8bef\u6570", testLabel: "\u6d4b\u8bd5", loadingDots: "\u52a0\u8f7d\u4e2d\u2026", emptyHistory: "\u5b8c\u6210\u81f3\u5c11\u4e00\u5206\u949f\u7684\u6d4b\u8bd5\u5373\u53ef\u5f00\u59cb\u8bb0\u5f55\u4f60\u7684\u5386\u53f2\u3002", customLabel: "\u81ea\u5b9a\u4e49", progressLabel: "\u8fdb\u5ea6", speedAccuracyLabel: "\u901f\u5ea6\u4e0e\u51c6\u786e\u7387", trackChanges: "\u8ffd\u8e2a\u4f60\u7684\u8868\u73b0\u968f\u65f6\u95f4\u7684\u53d8\u5316", currentResultDesc: "\u4f60\u7684\u5f53\u524d\u6210\u7ee9", testWord: "\u6b21\u6d4b\u8bd5", testsWord: "\u6b21\u6d4b\u8bd5", latestTestLabel: "\u6700\u8fd1\u4e00\u6b21\u6d4b\u8bd5", currentResultLabel: "\u5f53\u524d\u6210\u7ee9", latestResultLabel: "\u6700\u8fd1\u6210\u7ee9", changeFromPreviousLabel: "\u4e0e\u4e0a\u6b21\u6d4b\u8bd5\u76f8\u6bd4\u7684\u53d8\u5316", trendLabel: "\u8d8b\u52bf", completeAnotherTest: "\u5b8c\u6210\u53e6\u4e00\u6b21\u6d4b\u8bd5\u4ee5\u67e5\u770b\u8d8b\u52bf\u3002", progressGraphAria: "\u663e\u793aWPM\u548c\u51c6\u786e\u7387\u7684\u6253\u5b57\u8fdb\u5ea6\u56fe\u8868", accountInfoHeading: "账户信息", emailLabel: "电子邮箱", usernameLabel: "用户名", memberSinceLabel: "加入时间", notProvided: "未提供", testsCompletedLabel: "已完成测试", timeTypingLabel: "打字时间", statsByTestHeading: "按测试时长的统计", byDifficultyHeading: "按难度划分的最佳WPM", bestLabel: "最佳", avgLabel: "平均" },
  ja: { yourAccount: "\u3042\u306a\u305f\u306e\u30a2\u30ab\u30a6\u30f3\u30c8", keepProgress: "\u30bf\u30a4\u30d4\u30f3\u30b0\u306e\u9032\u6357\u3092\u8a18\u9332\u3057\u3088\u3046", signInPrompt: "\u30b5\u30a4\u30f3\u30a4\u30f3\u3059\u308b\u3068\u3001\u30c6\u30b9\u30c8\u5c65\u6b74\u3001\u81ea\u5df1\u30d9\u30b9\u30c8\u3001\u30bf\u30a4\u30d4\u30f3\u30b0\u306e\u9032\u6357\u3092\u78ba\u8a8d\u3067\u304d\u307e\u3059\u3002", signIn: "\u30b5\u30a4\u30f3\u30a4\u30f3", account: "\u30a2\u30ab\u30a6\u30f3\u30c8", typingHistory: "\u30bf\u30a4\u30d4\u30f3\u30b0\u5c65\u6b74", yourPersonalProgress: "\u3042\u306a\u305f\u306e\u500b\u4eba\u7684\u306a\u9032\u6357", refresh: "\u66f4\u65b0", errorLoad: "\u5c65\u6b74\u3092\u8aad\u307f\u8fbc\u3081\u307e\u305b\u3093\u3067\u3057\u305f\u3002\u30a2\u30ab\u30a6\u30f3\u30c8\u8a2d\u5b9a\u3092\u78ba\u8a8d\u3057\u3066\u518d\u8a66\u884c\u3057\u3066\u304f\u3060\u3055\u3044\u3002", tryAgain: "\u518d\u8a66\u884c", bestWpmLabel: "\u6700\u9ad8WPM", bestAccuracyLabel: "\u6700\u9ad8\u6b63\u78ba\u7387", dateLabel: "\u65e5\u4ed8", accuracyLabel: "\u6b63\u78ba\u7387", errorsLabel: "\u30a8\u30e9\u30fc\u6570", testLabel: "\u30c6\u30b9\u30c8", loadingDots: "\u8aad\u307f\u8fbc\u307f\u4e2d\u2026", emptyHistory: "1\u5206\u4ee5\u4e0a\u306e\u30c6\u30b9\u30c8\u3092\u5b8c\u4e86\u3059\u308b\u3068\u5c65\u6b74\u304c\u59cb\u307e\u308a\u307e\u3059\u3002", customLabel: "\u30ab\u30b9\u30bf\u30e0", progressLabel: "\u9032\u6357", speedAccuracyLabel: "\u901f\u5ea6\u3068\u6b63\u78ba\u7387", trackChanges: "\u6642\u9593\u306e\u7d4c\u904e\u306b\u4f34\u3046\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306e\u5909\u5316\u3092\u78ba\u8a8d\u3067\u304d\u307e\u3059", currentResultDesc: "\u73fe\u5728\u306e\u7d50\u679c", testWord: "\u30c6\u30b9\u30c8", testsWord: "\u30c6\u30b9\u30c8", latestTestLabel: "\u6700\u65b0\u306e\u30c6\u30b9\u30c8", currentResultLabel: "\u73fe\u5728\u306e\u7d50\u679c", latestResultLabel: "\u6700\u65b0\u306e\u7d50\u679c", changeFromPreviousLabel: "\u524d\u56de\u306e\u30c6\u30b9\u30c8\u304b\u3089\u306e\u5909\u5316", trendLabel: "\u50be\u5411", completeAnotherTest: "\u50be\u5411\u3092\u898b\u308b\u306b\u306f\u3082\u3046\u4e00\u5ea6\u30c6\u30b9\u30c8\u3092\u5b8c\u4e86\u3057\u3066\u304f\u3060\u3055\u3044\u3002", progressGraphAria: "WPM\u3068\u6b63\u78ba\u7387\u3092\u793a\u3059\u30bf\u30a4\u30d4\u30f3\u30b0\u9032\u6357\u30b0\u30e9\u30d5", accountInfoHeading: "アカウント情報", emailLabel: "メール", usernameLabel: "ユーザー名", memberSinceLabel: "登録日", notProvided: "未設定", testsCompletedLabel: "完了したテスト", timeTypingLabel: "タイピング時間", statsByTestHeading: "テスト時間ごとの統計", byDifficultyHeading: "難易度別の最高WPM", bestLabel: "最高", avgLabel: "平均" },
  ko: { yourAccount: "\ub0b4 \uacc4\uc815", keepProgress: "\ud0c0\uc774\ud551 \uc9c4\ud589 \uc0c1\ud669\uc744 \uae30\ub85d\ud558\uc138\uc694", signInPrompt: "\ub85c\uadf8\uc778\ud558\uba74 \ud14c\uc2a4\ud2b8 \uae30\ub85d, \uac1c\uc778 \ucd5c\uace0 \uae30\ub85d, \ud0c0\uc774\ud551 \uc9c4\ud589 \uc0c1\ud669\uc744 \ubcfc \uc218 \uc788\uc2b5\ub2c8\ub2e4.", signIn: "\ub85c\uadf8\uc778", account: "\uacc4\uc815", typingHistory: "\ud0c0\uc774\ud551 \uae30\ub85d", yourPersonalProgress: "\ub098\uc758 \uac1c\uc778 \uc9c4\ud589 \uc0c1\ud669", refresh: "\uc0c8\ub85c\uace0\uce68", errorLoad: "\uae30\ub85d\uc744 \ubd88\ub7ec\uc62c \uc218 \uc5c6\uc2b5\ub2c8\ub2e4. \uacc4\uc815 \uc124\uc815\uc744 \ud655\uc778\ud55c \ud6c4 \ub2e4\uc2dc \uc2dc\ub3c4\ud558\uc138\uc694.", tryAgain: "\ub2e4\uc2dc \uc2dc\ub3c4", bestWpmLabel: "\ucd5c\uace0 WPM", bestAccuracyLabel: "\ucd5c\uace0 \uc815\ud655\ub3c4", dateLabel: "\ub0a0\uc9dc", accuracyLabel: "\uc815\ud655\ub3c4", errorsLabel: "\uc624\ub958", testLabel: "\ud14c\uc2a4\ud2b8", loadingDots: "\ubd88\ub7ec\uc624\ub294 \uc911\u2026", emptyHistory: "1\ubd84 \uc774\uc0c1\uc758 \ud14c\uc2a4\ud2b8\ub97c \uc644\ub8cc\ud558\uba74 \uae30\ub85d\uc774 \uc2dc\uc791\ub429\ub2c8\ub2e4.", customLabel: "\uc0ac\uc6a9\uc790 \uc9c0\uc815", progressLabel: "\uc9c4\ud589 \uc0c1\ud669", speedAccuracyLabel: "\uc18d\ub3c4 \ubc0f \uc815\ud655\ub3c4", trackChanges: "\uc2dc\uac04\uc5d0 \ub530\ub978 \uc131\uacfc \ubcc0\ud654\ub97c \ud655\uc778\ud558\uc138\uc694", currentResultDesc: "\ud604\uc7ac \uacb0\uacfc", testWord: "\ud14c\uc2a4\ud2b8", testsWord: "\ud14c\uc2a4\ud2b8", latestTestLabel: "\ucd5c\uadfc \ud14c\uc2a4\ud2b8", currentResultLabel: "\ud604\uc7ac \uacb0\uacfc", latestResultLabel: "\ucd5c\uadfc \uacb0\uacfc", changeFromPreviousLabel: "\uc774\uc804 \ud14c\uc2a4\ud2b8 \ub300\ube44 \ubcc0\ud654", trendLabel: "\ucd94\uc138", completeAnotherTest: "\ucd94\uc138\ub97c \ubcf4\ub824\uba74 \ub2e4\ub978 \ud14c\uc2a4\ud2b8\ub97c \uc644\ub8cc\ud558\uc138\uc694.", progressGraphAria: "WPM\uacfc \uc815\ud655\ub3c4\ub97c \ubcf4\uc5ec\uc8fc\ub294 \ud0c0\uc774\ud551 \uc9c4\ud589 \uadf8\ub798\ud504", accountInfoHeading: "계정 정보", emailLabel: "이메일", usernameLabel: "사용자 이름", memberSinceLabel: "가입일", notProvided: "제공되지 않음", testsCompletedLabel: "완료한 테스트", timeTypingLabel: "타이핑 시간", statsByTestHeading: "테스트 시간별 통계", byDifficultyHeading: "난이도별 최고 WPM", bestLabel: "최고", avgLabel: "평균" },
};

// hh:mm:ss total-time formatter for the "time typing" tile. lib/stats.ts's
// formatTime() is m:ss for a single result, not a lifetime total, so this
// stays local to the account dashboard.
function formatDurationHms(totalSeconds: number): string {
  const safeSeconds = Number.isFinite(totalSeconds) ? Math.max(0, Math.round(totalSeconds)) : 0;
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function findBucket(byBucket: AccountStatsBucket[], durationSec: number, difficulty: "easy" | "medium" | "hard"): AccountStatsBucket | null {
  return byBucket.find((b) => b.durationSec === durationSec && b.difficulty === difficulty) ?? null;
}

function aggregateByDuration(byBucket: AccountStatsBucket[], durationSec: number): { tests: number; bestWpm: number; avgWpm: number } | null {
  const rows = byBucket.filter((b) => b.durationSec === durationSec);
  if (!rows.length) return null;
  const tests = rows.reduce((sum, r) => sum + r.tests, 0);
  if (!tests) return null;
  const bestWpm = Math.max(...rows.map((r) => r.bestWpm));
  const avgWpm = rows.reduce((sum, r) => sum + r.avgWpm * r.tests, 0) / tests;
  return { tests, bestWpm, avgWpm };
}

export default function AccountPage({ locale = "en" }: AccountPageProps) {
  const t = TEXT[locale] ?? TEXT.en;
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<TypingHistoryEntry[]>([]);
  const [accountStats, setAccountStats] = useState<AccountStats | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [memberSince, setMemberSince] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [signedIn, setSignedIn] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true); setError(null);
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (!mounted) return;
        if (authError || !user) { setSignedIn(false); setUsername(null); setEmail(null); setMemberSince(null); setAvatarUrl(null); setEntries([]); setAccountStats(null); setLoading(false); return; }
        setSignedIn(true);
        const metadataAvatar = typeof user.user_metadata?.avatar_url === "string" ? user.user_metadata.avatar_url : typeof user.user_metadata?.picture === "string" ? user.user_metadata.picture : null;
        setAvatarUrl(metadataAvatar);
        setCachedAvatarUrl(metadataAvatar);
        const [{ data: profile }, historyResult, statsResult] = await Promise.all([
          supabase.from("profiles").select("username").eq("user_id", user.id).maybeSingle(),
          fetchTypingHistory(50),
          fetchAccountStats().catch((statsError) => { console.error("Could not load account stats:", statsError); return null; }),
        ]);
        if (!mounted) return;
        const resolvedUsername = profile?.username?.trim() || user.user_metadata?.username?.trim() || null;
        setUsername(resolvedUsername);
        setCachedUsername(resolvedUsername);
        setEmail(user.email ?? null);
        setMemberSince(user.created_at ?? null);
        setEntries(historyResult);
        setAccountStats(statsResult);
      } catch (loadError) {
        if (!mounted) return;
        console.error("Could not load typing history:", loadError);
        setEntries([]);
        setAccountStats(null);
        setError(t.errorLoad);
      } finally { if (mounted) setLoading(false); }
    };
    void load();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (!mounted) return;
      if (event === "SIGNED_OUT") { setSignedIn(false); setUsername(null); setEmail(null); setMemberSince(null); setAvatarUrl(null); setEntries([]); setAccountStats(null); setError(null); setLoading(false); return; }
      if (event === "SIGNED_IN" || event === "INITIAL_SESSION" || event === "USER_UPDATED") { void load(); if (event === "SIGNED_IN") setAuthOpen(false); }
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, [locale]);

  const fallbackBestWpm = entries.reduce<TypingHistoryEntry | null>((best, entry) => (!best || entry.wpm > best.wpm ? entry : best), null);
  const fallbackBestAccuracy = entries.reduce<TypingHistoryEntry | null>((best, entry) => (!best || entry.accuracy > best.accuracy ? entry : best), null);
  const bestWpmValue = accountStats ? accountStats.bestWpm : fallbackBestWpm?.wpm ?? 0;
  const bestAccuracyValue = accountStats ? accountStats.bestAccuracy : fallbackBestAccuracy?.accuracy ?? 0;
  const testsCompletedValue = accountStats ? accountStats.testsCompleted : entries.length;
  const hasAnyStats = testsCompletedValue > 0;

  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-hairline bg-canvas p-5 shadow-sm sm:p-8">
        {!loading && !signedIn ? (
          <div className="mx-auto max-w-xl py-16 text-center">
            <p className="font-label uppercase tracking-[0.2em] text-text-muted">{t.yourAccount}</p>
            <h1 className="mt-3 font-heading-2 text-ink">{t.keepProgress}</h1>
            <p className="mx-auto mt-4 max-w-lg font-body text-text-muted">{t.signInPrompt}</p>
            <button type="button" onClick={() => setAuthOpen(true)} className="mt-8 rounded-full bg-primary px-6 py-3 font-link text-on-primary">{t.signIn}</button>
          </div>
        ) : (
          <>
            <ProfileHero username={username} email={email} memberSince={memberSince} avatarUrl={avatarUrl} bestWpm={hasAnyStats ? bestWpmValue : null} locale={locale} t={t} onRefresh={() => window.location.reload()} />
            {error ? (
              <div className="mt-7 rounded-2xl border border-hairline bg-canvas-soft px-5 py-10 text-center"><p className="font-body text-text-muted">{error}</p><button type="button" onClick={() => window.location.reload()} className="mt-5 rounded-full border border-hairline px-4 py-2 font-link text-ink hover:bg-canvas">{t.tryAgain}</button></div>
            ) : (
              <>
                <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <MetricCard label={t.testsCompletedLabel} value={String(testsCompletedValue)} suffix="" />
                  <MetricCard label={t.bestWpmLabel} value={hasAnyStats ? bestWpmValue.toFixed(1) : "\u2014"} suffix=" WPM" />
                  <MetricCard label={t.bestAccuracyLabel} value={hasAnyStats ? bestAccuracyValue.toFixed(2) : "\u2014"} suffix="%" />
                  <MetricCard label={t.timeTypingLabel} value={accountStats ? formatDurationHms(accountStats.totalDurationSec) : "\u2014"} suffix="" />
                </div>
                {accountStats && <StatsByTestSection accountStats={accountStats} locale={locale} t={t} />}
                <ProgressGraph entries={entries} locale={locale} />
                <div className="mt-8 overflow-hidden rounded-2xl border border-hairline">
                  <div className="grid grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr_1fr] gap-2 border-b border-hairline bg-canvas-soft px-4 py-3 font-label uppercase tracking-[0.12em] text-text-muted sm:px-5"><span>{t.dateLabel}</span><span className="text-right">WPM</span><span className="text-right">{t.accuracyLabel}</span><span className="text-right">{t.errorsLabel}</span><span className="text-right">{t.testLabel}</span></div>
                  {loading ? <div className="px-5 py-12 text-center font-body text-text-muted">{t.loadingDots}</div> : entries.length === 0 ? <div className="px-5 py-12 text-center font-body text-text-muted">{t.emptyHistory}</div> : entries.map((entry) => <HistoryRow key={entry.id} entry={entry} locale={locale} />)}
                </div>
              </>
            )}
          </>
        )}
      </section>
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} locale={locale} />
    </main>
  );
}

// Avatar shown at the top of the account page: the user's real Google
// profile photo (from Supabase auth user_metadata.avatar_url / .picture)
// when signed in with Google, else an initial-letter placeholder. Falls
// back to the initial if the image URL fails to load (blocked, expired,
// or otherwise broken) so the circle is never left blank.
function ProfileAvatar({ avatarUrl, username, email }: { avatarUrl: string | null; username: string | null; email: string | null }) {
  const [imgFailed, setImgFailed] = useState(false);
  if (avatarUrl && !imgFailed) {
    return <img src={avatarUrl} alt="" referrerPolicy="no-referrer" onError={() => setImgFailed(true)} className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-accent/40 sm:h-20 sm:w-20" />;
  }
  const initial = (username || email || "?").trim().charAt(0).toUpperCase() || "?";
  return <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent/15 font-heading-3 text-accent ring-2 ring-accent/30 sm:h-20 sm:w-20" aria-hidden="true">{initial}</span>;
}

// Premium-styled tier pill, reusing the same tier computed from lifetime
// best WPM via lib/stats.ts's getSpeedTier (the same function ResultPanel.tsx
// uses right after a test) so the label a user sees here always matches
// what they saw on their most recent result screen.
function TierBadge({ wpm, locale }: { wpm: number; locale: Locale }) {
  const tier = getSpeedTier(wpm);
  const displayLabel = tr(locale, "tester", speedTierNameKey[tier.name] ?? tier.name);
  const style = TIER_BADGE_STYLES[tier.name] ?? "border-hairline bg-canvas text-text-muted";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-label uppercase tracking-[0.08em] ${style}`}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2.5 6.9L21 9.3l-5.4 4.6L17.4 21 12 17.3 6.6 21l1.8-7.1L3 9.3l6.5-.4z" /></svg>
      {displayLabel}
    </span>
  );
}

function ProfileHero({ username, email, memberSince, avatarUrl, bestWpm, locale, t, onRefresh }: { username: string | null; email: string | null; memberSince: string | null; avatarUrl: string | null; bestWpm: number | null; locale: Locale; t: AccountText; onRefresh: () => void }) {
  const bcp47 = LOCALE_META[locale]?.bcp47 ?? "en-US";
  const memberSinceLabel = memberSince ? new Intl.DateTimeFormat(bcp47, { month: "short", day: "numeric", year: "numeric" }).format(new Date(memberSince)) : t.notProvided;
  return (
    <div className="flex flex-col gap-5 border-b border-hairline pb-7 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <ProfileAvatar avatarUrl={avatarUrl} username={username} email={email} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate font-heading-2 font-bold text-ink">{username || t.yourPersonalProgress}</h1>
            {bestWpm !== null && <TierBadge wpm={bestWpm} locale={locale} />}
          </div>
          <p className="mt-1 truncate font-body-sm text-text-muted">{t.memberSinceLabel}: {memberSinceLabel}{email ? ` \u00b7 ${email}` : ""}</p>
        </div>
      </div>
      <button type="button" onClick={onRefresh} className="shrink-0 rounded-full border border-hairline px-4 py-2 font-link text-ink hover:bg-canvas-soft">{t.refresh}</button>
    </div>
  );
}

function MetricCard({ label, value, suffix }: { label: string; value: string; suffix: string }) { return <div className="rounded-2xl border border-hairline bg-canvas-soft p-5"><p className="font-label uppercase tracking-[0.14em] text-text-muted">{label}</p><p className="mt-2 font-heading-3 text-ink">{value}<span className="text-base font-semibold text-text-muted">{suffix}</span></p></div>; }

// Monkeytype-style tile grid, adapted to this site's duration-based tests
// (15/30/60/120s x easy/medium/hard) instead of Monkeytype's word-count
// tests. Top row aggregates every difficulty per duration (closest analogue
// to Monkeytype's per-duration tiles); the table below breaks the same data
// down by difficulty for users who want more detail.
function StatsByTestSection({ accountStats, locale, t }: { accountStats: AccountStats; locale: Locale; t: AccountText }) {
  return (
    <section className="mt-8 rounded-2xl border border-hairline bg-canvas-soft p-4 sm:p-6">
      <p className="font-label uppercase tracking-[0.16em] text-text-muted">{t.statsByTestHeading}</p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STAT_DURATIONS.map((duration) => {
          const agg = aggregateByDuration(accountStats.byBucket, duration);
          return (
            <div key={duration} className="rounded-2xl border border-hairline bg-canvas px-3 py-4 text-center shadow-sm">
              <p className="font-label uppercase tracking-[0.12em] text-text-muted">{duration}s</p>
              <p className="mt-2 font-heading-3 text-ink">{agg ? agg.bestWpm.toFixed(1) : "\u2014"}</p>
              <p className="font-caption text-text-faint">{t.bestLabel}</p>
              <p className="mt-2 font-body-sm text-text-muted">{agg ? agg.avgWpm.toFixed(1) : "\u2014"}</p>
              <p className="font-caption text-text-faint">{t.avgLabel}</p>
            </div>
          );
        })}
      </div>
      <p className="mt-6 font-label uppercase tracking-[0.16em] text-text-muted">{t.byDifficultyHeading}</p>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse text-center">
          <thead>
            <tr>
              <th className="px-2 py-2 text-left font-label uppercase tracking-[0.1em] text-text-muted"> </th>
              {STAT_DURATIONS.map((duration) => <th key={duration} className="px-2 py-2 font-label uppercase tracking-[0.1em] text-text-muted">{duration}s</th>)}
            </tr>
          </thead>
          <tbody>
            {STAT_DIFFICULTIES.map((difficulty) => (
              <tr key={difficulty} className="border-t border-hairline">
                <td className="px-2 py-2 text-left font-body-sm capitalize text-ink">{tr(locale, "tester", difficulty)}</td>
                {STAT_DURATIONS.map((duration) => {
                  const cell = findBucket(accountStats.byBucket, duration, difficulty);
                  return <td key={duration} className="px-2 py-2 font-mono text-sm text-ink-soft">{cell ? cell.bestWpm.toFixed(1) : "\u2014"}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ProgressGraph({ entries, locale }: { entries: TypingHistoryEntry[]; locale: Locale }) {
  const t = TEXT[locale] ?? TEXT.en;
  if (!entries.length) return null;
  const points = entries.slice(0, 30).reverse();
  const width = 1000, height = 430;
  const pad = { top: 40, right: 88, bottom: 76, left: 66 };
  const chartWidth = width - pad.left - pad.right;
  const chartHeight = height - pad.top - pad.bottom;
  const latest = points[points.length - 1];
  const previous = points.length > 1 ? points[points.length - 2] : null;
  const maxWpm = Math.max(40, Math.ceil(Math.max(...points.map((p) => p.wpm), 0) / 20) * 20 + 20);
  const wpmTicks = [0, 0.25, 0.5, 0.75, 1].map((r) => maxWpm * r);
  const accuracyTicks = [0, 25, 50, 75, 100];
  const WPM_COLOR = "#2563eb";
  const ACCURACY_COLOR = "#f97316";
  const xFor = (i: number) => points.length === 1 ? pad.left + chartWidth / 2 : pad.left + (i / (points.length - 1)) * chartWidth;
  const yWpm = (v: number) => pad.top + chartHeight - (v / maxWpm) * chartHeight;
  const yAcc = (v: number) => pad.top + chartHeight - (v / 100) * chartHeight;
  const smoothPath = (values: number[], yFor: (v: number) => number) => {
    if (values.length === 1) return `M ${xFor(0)} ${yFor(values[0])}`;
    return values.map((v, i) => {
      const x = xFor(i), y = yFor(v);
      if (i === 0) return `M ${x} ${y}`;
      const px = xFor(i - 1), py = yFor(values[i - 1]), c = (x - px) / 2;
      return `C ${px + c} ${py}, ${x - c} ${y}, ${x} ${y}`;
    }).join(" ");
  };
  const wpmPath = smoothPath(points.map((p) => p.wpm), yWpm);
  const accuracyPath = smoothPath(points.map((p) => p.accuracy), yAcc);
  const bcp47 = LOCALE_META[locale]?.bcp47 ?? "en-US";
  const fmt = (d: string) => new Intl.DateTimeFormat(bcp47, { month: "short", day: "numeric" }).format(new Date(d));
  const labelIndexes = points.length <= 6 ? points.map((_, i) => i) : [0, Math.floor((points.length - 1) / 2), points.length - 1];
  const wpmDelta = previous ? latest.wpm - previous.wpm : 0;
  const accDelta = previous ? latest.accuracy - previous.accuracy : 0;
  const signed = (v: number, suffix: string) => `${v >= 0 ? "+" : ""}${v.toFixed(1)}${suffix}`;
  const latestX = xFor(points.length - 1);
  const latestWpmY = yWpm(latest.wpm);
  const latestAccY = yAcc(latest.accuracy);
  const showTrend = points.length > 1;

  return <section className="mt-8 rounded-2xl border border-hairline bg-canvas-soft p-4 sm:p-6" aria-labelledby="typing-progress-heading">
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div><p className="font-label uppercase tracking-[0.16em] text-text-muted">{t.progressLabel}</p><h2 id="typing-progress-heading" className="mt-1 font-heading-3 text-ink">{t.speedAccuracyLabel}</h2><p className="mt-1 font-body-sm text-text-muted">{showTrend ? t.trackChanges : t.currentResultDesc}</p></div>
        <div className="grid grid-cols-2 gap-2 sm:flex"><MetricMini label="WPM" value={latest.wpm.toFixed(1)} delta={previous ? signed(wpmDelta, "") : "\u2014"} /><MetricMini label={t.accuracyLabel} value={`${latest.accuracy.toFixed(1)}%`} delta={previous ? signed(accDelta, " pp") : "\u2014"} /></div>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-hairline py-3 font-label text-text-muted">
        <span className="inline-flex items-center gap-2"><span className="h-0.5 w-8 rounded-full" style={{ backgroundColor: WPM_COLOR }} />WPM</span>
        <span className="inline-flex items-center gap-2"><span className="h-0.5 w-8 rounded-full" style={{ backgroundColor: ACCURACY_COLOR }} />{t.accuracyLabel}</span>
        <span className="text-text-faint">{`${points.length} ${points.length === 1 ? t.testWord : t.testsWord}`}</span>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={t.progressGraphAria} className="min-w-[760px] w-full">
          {wpmTicks.map((tick, i) => { const y=yWpm(tick); return <g key={`grid-${i}`}><line x1={pad.left} x2={width-pad.right} y1={y} y2={y} stroke="currentColor" className="text-hairline" strokeWidth="1" /><text x={pad.left-12} y={y+4} textAnchor="end" fontSize="11" className="fill-text-muted">{Math.round(tick)}</text><text x={width-pad.right+12} y={y+4} fontSize="11" className="fill-text-muted">{accuracyTicks[i]}%</text></g>; })}
          <line x1={pad.left} x2={pad.left} y1={pad.top} y2={pad.top+chartHeight} stroke="currentColor" className="text-hairline" /><line x1={width-pad.right} x2={width-pad.right} y1={pad.top} y2={pad.top+chartHeight} stroke="currentColor" className="text-hairline" /><line x1={pad.left} x2={width-pad.right} y1={pad.top+chartHeight} y2={pad.top+chartHeight} stroke="currentColor" className="text-hairline" />
          <text x={pad.left} y={pad.top-16} fontSize="11" className="fill-text-faint">WPM</text><text x={width-pad.right} y={pad.top-16} textAnchor="end" fontSize="11" className="fill-text-faint">% {t.accuracyLabel}</text>

          {showTrend ? <>
            <path d={wpmPath} fill="none" stroke={WPM_COLOR} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            <path d={accuracyPath} fill="none" stroke={ACCURACY_COLOR} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          </> : <>
            <line x1={pad.left} x2={latestX} y1={latestWpmY} y2={latestWpmY} stroke={WPM_COLOR} strokeWidth="4" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            <line x1={pad.left} x2={latestX} y1={latestAccY} y2={latestAccY} stroke={ACCURACY_COLOR} strokeWidth="3.5" strokeLinecap="round" strokeDasharray="8 8" vectorEffect="non-scaling-stroke" />
          </>}

          {points.map((entry,i)=>{const x=xFor(i),yw=yWpm(entry.wpm),ya=yAcc(entry.accuracy),latestPoint=i===points.length-1;return <g key={entry.id}><circle cx={x} cy={yw} r={latestPoint?7:4} fill={WPM_COLOR} stroke="white" strokeWidth={latestPoint?2:0}><title>{`${entry.wpm.toFixed(1)} WPM \u00b7 ${fmt(entry.completedAt)}`}</title></circle><circle cx={x} cy={ya} r={latestPoint?6:3.5} fill={ACCURACY_COLOR} stroke="white" strokeWidth={latestPoint?2:0}><title>{`${entry.accuracy.toFixed(1)}% \u00b7 ${fmt(entry.completedAt)}`}</title></circle>{labelIndexes.includes(i)&&<text x={x} y={height-28} textAnchor="middle" fontSize="11" className="fill-text-muted">{fmt(entry.completedAt)}</text>}</g>;})}
          <g><rect x={Math.min(width-pad.right-136, Math.max(pad.left, latestX-68))} y={Math.max(pad.top+5, Math.min(pad.top+chartHeight-40, Math.min(latestWpmY,latestAccY)-48))} width="136" height="34" rx="10" fill="white" fillOpacity="0.9" stroke="currentColor" className="text-hairline"/><text x={Math.min(width-pad.right-68, Math.max(pad.left+68, latestX))} y={Math.max(pad.top+27, Math.min(pad.top+chartHeight-18, Math.min(latestWpmY,latestAccY)-25))} textAnchor="middle" fontSize="11" fontWeight="600" className="fill-text-muted">{showTrend ? t.latestTestLabel : t.currentResultLabel}</text></g>
        </svg>
      </div>

      <div className="grid gap-3 border-t border-hairline pt-4 text-text-muted sm:grid-cols-2">
        <div><p className="font-label uppercase tracking-[0.12em]">{t.latestResultLabel}</p><p className="mt-1 font-body-sm">{latest.wpm.toFixed(1)} WPM \u00b7 {latest.accuracy.toFixed(1)}% {t.accuracyLabel}</p></div>
        <div className="sm:text-right"><p className="font-label uppercase tracking-[0.12em]">{showTrend ? t.changeFromPreviousLabel : t.trendLabel}</p><p className="mt-1 font-body-sm">{showTrend ? `${signed(wpmDelta," WPM")} \u00b7 ${signed(accDelta," pp")}` : t.completeAnotherTest}</p></div>
      </div>
    </div>
  </section>;
}

function MetricMini({label,value,delta}:{label:string;value:string;delta:string}){return <div className="min-w-[140px] rounded-xl border border-hairline bg-canvas px-3 py-2.5"><p className="font-label uppercase tracking-[0.12em] text-text-muted">{label}</p><div className="mt-1 flex items-baseline justify-between gap-3"><span className="font-heading-3 text-ink">{value}</span><span className="font-mono text-xs text-text-muted">{delta}</span></div></div>}

function HistoryRow({ entry, locale }: { entry: TypingHistoryEntry; locale: Locale }) {
  const t = TEXT[locale] ?? TEXT.en;
  const bcp47 = LOCALE_META[locale]?.bcp47 ?? "en-US";
  const date = new Intl.DateTimeFormat(bcp47, { month: "short", day: "numeric", year: "numeric" }).format(new Date(entry.completedAt));
  const errors = Math.max(0, entry.incorrectChars);
  const testLabel = entry.isCustom ? t.customLabel : `${entry.durationSec / 60} min \u00b7 ${entry.difficulty}`;
  return <div className="grid grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr_1fr] gap-2 border-b border-hairline px-4 py-4 last:border-b-0 sm:px-5"><span className="truncate font-body-sm text-text-muted">{date}</span><span className="text-right font-mono text-sm font-semibold text-accent">{entry.wpm.toFixed(1)}</span><span className="text-right font-mono text-sm text-ink-soft">{entry.accuracy.toFixed(2)}%</span><span className="text-right font-mono text-sm text-text-muted">{errors}</span><span className="truncate text-right font-body-sm capitalize text-text-muted">{testLabel}</span></div>;
}
