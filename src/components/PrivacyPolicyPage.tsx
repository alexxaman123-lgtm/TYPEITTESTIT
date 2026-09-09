import type { Locale } from "../lib/i18n";

type Section = { h: string; body: string };
type PrivacyText = { eyebrow: string; heading: string; lastUpdated: string; sections: Section[] };

const MAIL = '<a href="mailto:typeittestit@gmail.com" class="text-accent hover:underline">typeittestit@gmail.com</a>';
const ADS = '<a href="https://adssettings.google.com/" target="_blank" rel="noreferrer" class="text-accent hover:underline">Google Ads Settings</a>';
const ADS_INFO = '<a href="https://www.aboutads.info/choices/" target="_blank" rel="noreferrer" class="text-accent hover:underline">aboutads.info</a>';

const TEXT: Record<Locale, PrivacyText> = {
  en: { eyebrow: "Legal", heading: "PRIVACY POLICY", lastUpdated: "Last updated: September 4, 2026", sections: [
    { h: "Typing Tests Without an Account", body: "You can take a typing test on FreeTypingTestGoat without signing in. Anonymous test results are shown to you during and after the test, but are not saved to an account history, associated with an account, or included on the leaderboard." },
    { h: "Google Sign-In and Account Information", body: "Google Sign-In is optional. If you choose to sign in, Google and our authentication provider, Supabase, process the information needed to authenticate your account, including your email address, profile information, and authentication identifiers." },
    { h: "Progress and Leaderboard Information", body: "A signed-in account is required for account-based progress tracking and leaderboard participation. Leaderboard results may publicly display your chosen username, WPM, accuracy, difficulty, and the date of the result." },
    { h: "Cookies, Local Storage, Analytics, and Advertising", body: `We may use cookies, local storage, and similar technologies to operate the site, maintain sign-in sessions, understand usage, and support advertising. We use Google Analytics and may use Google AdSense. You can manage many cookies through your browser settings and Google's personalized advertising choices through ${ADS}. Learn about third-party choices at ${ADS_INFO}.` },
    { h: "Local Browser Data and Typing Content", body: "Your preferences and personal-best scores may be stored locally in your browser. Custom text pasted into custom typing mode is processed in your browser and is not transmitted to our servers." },
    { h: "How We Use and Share Information", body: "We use account and typing information for authentication, saved progress, leaderboard, analytics, and site operation. We do not sell your personal information or use your Google account for unrelated advertising." },
    { h: "Data Deletion and Your Choices", body: "You may request deletion of your account, username, and progress data by contacting us below. We may need to verify the request comes from the account holder." },
    { h: "Changes to This Policy", body: "We may update this Privacy Policy as FreeTypingTestGoat evolves. Any updated version will be published on this page." },
    { h: "Questions", body: `If you have questions about this Privacy Policy or want to request deletion, contact us at ${MAIL}.` },
  ] },
  es: { eyebrow: "Legal", heading: "POL\u00cdTICA DE PRIVACIDAD", lastUpdated: "\u00daltima actualizaci\u00f3n: 4 de septiembre de 2026", sections: [
    { h: "Pruebas sin cuenta", body: "Puedes hacer un test en Test de mecanograf\u00eda Cabra sin iniciar sesi\u00f3n. Los resultados an\u00f3nimos se muestran, pero no se guardan en un historial ni se incluyen en la clasificaci\u00f3n." },
    { h: "Inicio de sesi\u00f3n con Google", body: "Iniciar sesi\u00f3n con Google es opcional. Google y Supabase procesan la informaci\u00f3n necesaria para autenticarte, incluyendo tu correo, perfil e identificadores." },
    { h: "Progreso y clasificaci\u00f3n", body: "Se requiere una cuenta con sesi\u00f3n iniciada para el progreso guardado y la clasificaci\u00f3n. Esta puede mostrar tu nombre de usuario, WPM, precisi\u00f3n, dificultad y fecha." },
    { h: "Cookies, almacenamiento, anal\u00edtica y publicidad", body: `Usamos cookies, almacenamiento local, Google Analytics y quiz\u00e1s Google AdSense. Puedes gestionar cookies en tu navegador y la publicidad personalizada en ${ADS}. Ver opciones de terceros en ${ADS_INFO}.` },
    { h: "Datos locales y contenido personalizado", body: "Tus preferencias y mejores puntuaciones pueden guardarse localmente. El texto personalizado se procesa en tu navegador y no se env\u00eda a nuestros servidores." },
    { h: "C\u00f3mo usamos la informaci\u00f3n", body: "Usamos tus datos para autenticaci\u00f3n, progreso, clasificaci\u00f3n y analítica. No vendemos tu informaci\u00f3n ni usamos tu cuenta de Google para publicidad no relacionada." },
    { h: "Eliminaci\u00f3n de datos", body: "Puedes solicitar la eliminaci\u00f3n de tu cuenta y progreso contact\u00e1ndonos abajo; podemos verificar que la solicitud viene del titular." },
    { h: "Cambios en esta pol\u00edtica", body: "Podemos actualizar esta pol\u00edtica; la versi\u00f3n vigente se publica en esta p\u00e1gina." },
    { h: "Preguntas", body: `Si tienes preguntas o deseas solicitar la eliminaci\u00f3n, cont\u00e1ctanos en ${MAIL}.` },
  ] },
  de: { eyebrow: "Rechtliches", heading: "DATENSCHUTZERKL\u00c4RUNG", lastUpdated: "Zuletzt aktualisiert: 4. September 2026", sections: [
    { h: "Ohne Konto testen", body: "Du kannst auf Schreibtest Ziege ohne Anmeldung tippen; anonyme Ergebnisse werden angezeigt, aber nicht gespeichert oder in die Bestenliste aufgenommen." },
    { h: "Google-Anmeldung, Fortschritt & Bestenliste", body: "Die Google-Anmeldung ist optional und \u00fcber Supabase abgesichert; ein angemeldetes Konto ist f\u00fcr gespeicherten Fortschritt und die \u00f6ffentliche Bestenliste (Benutzername, WPM, Genauigkeit, Schwierigkeit, Datum) erforderlich." },
    { h: "Cookies, Speicher & Werbung", body: `Wir nutzen Cookies, lokalen Speicher, Google Analytics und ggf. Google AdSense; du kannst Einstellungen im Browser und unter ${ADS} verwalten.` },
    { h: "Nutzung, Weitergabe & L\u00f6schung", body: "Wir verkaufen deine Daten nicht und teilen nur \u00f6ffentliche Bestenlisteninformationen; du kannst die L\u00f6schung deines Kontos jederzeit beantragen." },
    { h: "\u00c4nderungen & Kontakt", body: `Diese Richtlinie kann sich mit der Weiterentwicklung von Schreibtest Ziege \u00e4ndern; bei Fragen erreichst du uns unter ${MAIL}.` },
  ] },
  fr: { eyebrow: "Mentions l\u00e9gales", heading: "POLITIQUE DE CONFIDENTIALIT\u00c9", lastUpdated: "Derni\u00e8re mise \u00e0 jour : 4 septembre 2026", sections: [
    { h: "Tester sans compte", body: "Vous pouvez utiliser Test de frappe Ch\u00e8vre sans vous connecter ; les r\u00e9sultats anonymes sont affich\u00e9s mais jamais enregistr\u00e9s ni ajout\u00e9s au classement." },
    { h: "Connexion Google, progression et classement", body: "La connexion Google est facultative et s\u00e9curis\u00e9e via Supabase ; un compte connect\u00e9 est requis pour la progression enregistr\u00e9e et le classement public (nom d'utilisateur, WPM, pr\u00e9cision, difficult\u00e9, date)." },
    { h: "Cookies, stockage et publicit\u00e9", body: `Nous utilisons des cookies, le stockage local, Google Analytics et \u00e9ventuellement Google AdSense ; g\u00e9rez vos choix via votre navigateur ou les ${ADS}.` },
    { h: "Utilisation, partage et suppression", body: "Nous ne vendons pas vos donn\u00e9es et ne partageons publiquement que les informations du classement ; vous pouvez demander la suppression \u00e0 tout moment." },
    { h: "Modifications et contact", body: `Cette politique peut \u00e9voluer avec Test de frappe Ch\u00e8vre ; pour toute question, contactez ${MAIL}.` },
  ] },
  it: { eyebrow: "Legale", heading: "INFORMATIVA SULLA PRIVACY", lastUpdated: "Ultimo aggiornamento: 4 settembre 2026", sections: [
    { h: "Test senza account", body: "Puoi usare Test di Digitazione Capra senza accedere; i risultati anonimi vengono mostrati ma non salvati n\u00e9 inclusi in classifica." },
    { h: "Accesso Google, progressi e classifica", body: "L'accesso con Google \u00e8 facoltativo e gestito tramite Supabase; un account collegato \u00e8 necessario per i progressi salvati e la classifica pubblica (nome utente, WPM, precisione, difficolt\u00e0, data)." },
    { h: "Cookie, archiviazione e pubblicit\u00e0", body: `Utilizziamo cookie, archiviazione locale, Google Analytics ed eventualmente Google AdSense; gestisci le preferenze dal browser o dalle ${ADS}.` },
    { h: "Utilizzo, condivisione e cancellazione", body: "Non vendiamo i tuoi dati e condividiamo pubblicamente solo le informazioni di classifica; puoi richiedere la cancellazione in qualsiasi momento." },
    { h: "Modifiche e contatti", body: `Questa informativa pu\u00f2 cambiare con l'evoluzione di Test di Digitazione Capra; per domande scrivi a ${MAIL}.` },
  ] },
  pt: { eyebrow: "Legal", heading: "POL\u00cdTICA DE PRIVACIDADE", lastUpdated: "\u00daltima atualiza\u00e7\u00e3o: 4 de setembro de 2026", sections: [
    { h: "Testar sem conta", body: "Voc\u00ea pode usar o Teste de Digita\u00e7\u00e3o Cabra sem entrar; os resultados an\u00f4nimos s\u00e3o exibidos, mas nunca salvos ou inclu\u00eddos na classifica\u00e7\u00e3o." },
    { h: "Login Google, progresso e classifica\u00e7\u00e3o", body: "O login com Google \u00e9 opcional e processado via Supabase; uma conta conectada \u00e9 necess\u00e1ria para o progresso salvo e a classifica\u00e7\u00e3o p\u00fablica (nome de usu\u00e1rio, WPM, precis\u00e3o, dificuldade, data)." },
    { h: "Cookies, armazenamento e publicidade", body: `Usamos cookies, armazenamento local, Google Analytics e possivelmente Google AdSense; gerencie suas prefer\u00eancias no navegador ou nas ${ADS}.` },
    { h: "Uso, compartilhamento e exclus\u00e3o", body: "N\u00e3o vendemos seus dados e compartilhamos publicamente apenas as informa\u00e7\u00f5es da classifica\u00e7\u00e3o; voc\u00ea pode solicitar a exclus\u00e3o a qualquer momento." },
    { h: "Altera\u00e7\u00f5es e contato", body: `Esta pol\u00edtica pode mudar conforme o Teste de Digita\u00e7\u00e3o Cabra evolui; em caso de d\u00favidas, contate ${MAIL}.` },
  ] },
  pl: { eyebrow: "Informacje prawne", heading: "POLITYKA PRYWATNO\u015aCI", lastUpdated: "Ostatnia aktualizacja: 4 wrze\u015bnia 2026", sections: [
    { h: "Testowanie bez konta", body: "Mo\u017cesz korzysta\u0107 z Test Pisania Koza bez logowania; anonimowe wyniki s\u0105 wy\u015bwietlane, ale nigdy nie s\u0105 zapisywane ani ujmowane w rankingu." },
    { h: "Logowanie Google, post\u0119py i ranking", body: "Logowanie Google jest opcjonalne i obs\u0142ugiwane przez Supabase; zalogowane konto jest potrzebne do zapisanych post\u0119p\u00f3w i publicznego rankingu (nazwa u\u017cytkownika, WPM, dok\u0142adno\u015b\u0107, poziom trudno\u015bci, data)." },
    { h: "Pliki cookie, pami\u0119\u0107 i reklamy", body: `U\u017cywamy plik\u00f3w cookie, pami\u0119ci lokalnej, Google Analytics i ewentualnie Google AdSense; zarz\u0105dzaj ustawieniami w przegl\u0105darce lub w ${ADS}.` },
    { h: "Wykorzystanie, udost\u0119pnianie i usuwanie", body: "Nie sprzedajemy Twoich danych i publicznie udost\u0119pniamy tylko informacje rankingowe; mo\u017cesz w ka\u017cdej chwili poprosi\u0107 o usuni\u0119cie konta." },
    { h: "Zmiany i kontakt", body: `Ta polityka mo\u017ce si\u0119 zmienia\u0107 wraz z rozwojem Test Pisania Koza; w razie pyta\u0144 napisz na ${MAIL}.` },
  ] },
  tr: { eyebrow: "Yasal", heading: "G\u0130ZL\u0130L\u0130K POL\u0130T\u0130KASI", lastUpdated: "Son g\u00fcncelleme: 4 Eyl\u00fcl 2026", sections: [
    { h: "Hesaps\u0131z test etme", body: "Yazma Testi Ke\u00e7i'yi oturum a\u00e7madan kullanabilirsin; anonim sonu\u00e7lar g\u00f6sterilir ama asla kaydedilmez veya lider tablosuna eklenmez." },
    { h: "Google giri\u015fi, ilerleme ve lider tablosu", body: "Google ile giri\u015f iste\u011fe ba\u011fl\u0131d\u0131r ve Supabase \u00fczerinden i\u015flenir; kaydedilmi\u015f ilerleme ve lider tablosu (kullan\u0131c\u0131 ad\u0131, WPM, do\u011fruluk, zorluk, tarih) i\u00e7in oturum a\u00e7\u0131lm\u0131\u015f hesap gerekir." },
    { h: "\u00c7erezler, depolama ve reklamc\u0131l\u0131k", body: `Siteyi \u00e7al\u0131\u015ft\u0131rmak i\u00e7in \u00e7erezler, yerel depolama, Google Analytics ve gerekirse Google AdSense kullan\u0131r\u0131z; tercihlerini taray\u0131c\u0131ndan veya ${ADS}'ndan y\u00f6netebilirsin.` },
    { h: "Kullan\u0131m, payla\u015f\u0131m ve silme", body: "Verilerini satmay\u0131z ve herkese a\u00e7\u0131k olarak yaln\u0131zca lider tablosu bilgilerini payla\u015f\u0131r\u0131z; hesab\u0131n\u0131n silinmesini istedi\u011fin zaman talep edebilirsin." },
    { h: "De\u011fi\u015fiklikler ve ileti\u015fim", body: `Bu politika Yazma Testi Ke\u00e7i geli\u015ftik\u00e7e de\u011fi\u015febilir; sorular\u0131n\u0131z i\u00e7in ${MAIL} adresine yaz\u0131n.` },
  ] },
  uk: { eyebrow: "\u041f\u0440\u0430\u0432\u043e\u0432\u0430 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044f", heading: "\u041f\u041e\u041b\u0406\u0422\u0418\u041a\u0410 \u041a\u041e\u041d\u0424\u0406\u0414\u0415\u041d\u0426\u0406\u0419\u041d\u041e\u0421\u0422\u0406", lastUpdated: "\u041e\u0441\u0442\u0430\u043d\u043d\u0454 \u043e\u043d\u043e\u0432\u043b\u0435\u043d\u043d\u044f: 4 \u0432\u0435\u0440\u0435\u0441\u043d\u044f 2026 \u0440.", sections: [
    { h: "\u0422\u0435\u0441\u0442\u0443\u0432\u0430\u043d\u043d\u044f \u0431\u0435\u0437 \u0430\u043a\u0430\u0443\u043d\u0442\u0430", body: "\u0412\u0438 \u043c\u043e\u0436\u0435\u0442\u0435 \u043a\u043e\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0442\u0438\u0441\u044f \u0422\u0435\u0441\u0442 \u0434\u0440\u0443\u043a\u0443 \u041a\u043e\u0437\u0430 \u0431\u0435\u0437 \u0432\u0445\u043e\u0434\u0443; \u0430\u043d\u043e\u043d\u0456\u043c\u043d\u0456 \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u0438 \u043d\u0456\u043a\u043e\u043b\u0438 \u043d\u0435 \u0437\u0431\u0435\u0440\u0456\u0433\u0430\u044e\u0442\u044c\u0441\u044f \u0442\u0430 \u043d\u0435 \u043f\u043e\u0442\u0440\u0430\u043f\u043b\u044f\u044e\u0442\u044c \u0434\u043e \u0442\u0430\u0431\u043b\u0438\u0446\u0456 \u043b\u0456\u0434\u0435\u0440\u0456\u0432." },
    { h: "\u0412\u0445\u0456\u0434 Google, \u043f\u0440\u043e\u0433\u0440\u0435\u0441 \u0456 \u0442\u0430\u0431\u043b\u0438\u0446\u044f \u043b\u0456\u0434\u0435\u0440\u0456\u0432", body: "\u0412\u0445\u0456\u0434 \u0447\u0435\u0440\u0435\u0437 Google \u043d\u0435\u043e\u0431\u043e\u0432'\u044f\u0437\u043a\u043e\u0432\u0438\u0439 \u0456 \u043e\u0431\u0440\u043e\u0431\u043b\u044f\u0454\u0442\u044c\u0441\u044f \u0447\u0435\u0440\u0435\u0437 Supabase; \u0430\u043a\u0430\u0443\u043d\u0442 \u0456\u0437 \u0432\u0445\u043e\u0434\u043e\u043c \u043f\u043e\u0442\u0440\u0456\u0431\u0435\u043d \u0434\u043b\u044f \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043d\u043e\u0433\u043e \u043f\u0440\u043e\u0433\u0440\u0435\u0441\u0443 \u0442\u0430 \u0442\u0430\u0431\u043b\u0438\u0446\u0456 \u043b\u0456\u0434\u0435\u0440\u0456\u0432." },
    { h: "\u0424\u0430\u0439\u043b\u0438 cookie, \u0441\u0445\u043e\u0432\u0438\u0449\u0435 \u0442\u0430 \u0440\u0435\u043a\u043b\u0430\u043c\u0430", body: `\u041c\u0438 \u0432\u0438\u043a\u043e\u0440\u0438\u0441\u0442\u043e\u0432\u0443\u0454\u043c\u043e cookie, \u043b\u043e\u043a\u0430\u043b\u044c\u043d\u0435 \u0441\u0445\u043e\u0432\u0438\u0449\u0435, Google Analytics \u0456 \u0437\u0430 \u043f\u043e\u0442\u0440\u0435\u0431\u0438 Google AdSense; \u043a\u0435\u0440\u0443\u0439\u0442\u0435 \u043d\u0430\u043b\u0430\u0448\u0442\u0443\u0432\u0430\u043d\u043d\u044f\u043c\u0438 \u0432 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0456 \u0430\u0431\u043e \u0432 ${ADS}.` },
    { h: "\u0412\u0438\u043a\u043e\u0440\u0438\u0441\u0442\u0430\u043d\u043d\u044f \u0456 \u0432\u0438\u0434\u0430\u043b\u0435\u043d\u043d\u044f", body: "\u041c\u0438 \u043d\u0435 \u043f\u0440\u043e\u0434\u0430\u0454\u043c\u043e \u0432\u0430\u0448\u0456 \u0434\u0430\u043d\u0456 \u0456 \u043f\u0443\u0431\u043b\u0456\u0447\u043d\u043e \u043f\u0435\u0440\u0435\u0434\u0430\u0454\u043c\u043e \u043b\u0438\u0448\u0435 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044e \u0442\u0430\u0431\u043b\u0438\u0446\u0456 \u043b\u0456\u0434\u0435\u0440\u0456\u0432; \u0432\u0438 \u043c\u043e\u0436\u0435\u0442\u0435 \u0431\u0443\u0434\u044c-\u043a\u043e\u043b\u0438 \u0432\u0438\u0434\u0430\u043b\u0438\u0442\u0438 \u0430\u043a\u0430\u0443\u043d\u0442." },
    { h: "\u0417\u043c\u0456\u043d\u0438 \u0442\u0430 \u043a\u043e\u043d\u0442\u0430\u043a\u0442\u0438", body: `\u0426\u044f \u043f\u043e\u043b\u0456\u0442\u0438\u043a\u0430 \u043c\u043e\u0436\u0435 \u0437\u043c\u0456\u043d\u044e\u0432\u0430\u0442\u0438\u0441\u044f; \u0437 \u043f\u0438\u0442\u0430\u043d\u043d\u044f\u043c\u0438 \u0437\u0432\u0435\u0440\u0442\u0430\u0439\u0442\u0435\u0441\u044f \u043d\u0430 ${MAIL}.` },
  ] },
  id: { eyebrow: "Legal", heading: "KEBIJAKAN PRIVASI", lastUpdated: "Terakhir diperbarui: 4 September 2026", sections: [
    { h: "Menguji tanpa akun", body: "Kamu bisa menggunakan Tes Mengetik Kambing tanpa masuk; hasil anonim ditampilkan tetapi tidak pernah disimpan atau dimasukkan ke papan peringkat." },
    { h: "Login Google, progres, dan papan peringkat", body: "Login Google bersifat opsional dan diproses melalui Supabase; akun yang masuk diperlukan untuk progres tersimpan dan papan peringkat publik (nama pengguna, WPM, akurasi, kesulitan, tanggal)." },
    { h: "Cookie, penyimpanan, dan iklan", body: `Kami menggunakan cookie, penyimpanan lokal, Google Analytics, dan mungkin Google AdSense; kelola preferensimu di browser atau di ${ADS}.` },
    { h: "Penggunaan, pembagian, dan penghapusan", body: "Kami tidak menjual datamu dan hanya membagikan informasi papan peringkat secara publik; kamu dapat meminta penghapusan akun kapan saja." },
    { h: "Perubahan dan kontak", body: `Kebijakan ini dapat berubah seiring perkembangan Tes Mengetik Kambing; untuk pertanyaan, hubungi ${MAIL}.` },
  ] },
  zh: { eyebrow: "\u6cd5\u5f8b", heading: "\u9690\u79c1\u653f\u7b56", lastUpdated: "\u6700\u540e\u66f4\u65b0\uff1a2026\u5e749\u67084\u65e5", sections: [
    { h: "\u65e0\u9700\u8d26\u6237\u6d4b\u8bd5", body: "\u4f60\u53ef\u4ee5\u5728\u6253\u5b57\u6d4b\u8bd5\u5c71\u7f8a\u4e0a\u65e0\u9700\u767b\u5f55\u8fdb\u884c\u6d4b\u8bd5\uff1b\u533f\u540d\u7ed3\u679c\u4f1a\u663e\u793a\u7ed9\u4f60\uff0c\u4f46\u7edd\u4e0d\u4f1a\u88ab\u4fdd\u5b58\u6216\u5217\u5165\u6392\u884c\u699c\u3002" },
    { h: "\u8c37\u6b4c\u767b\u5f55\u3001\u8fdb\u5ea6\u4e0e\u6392\u884c\u699c", body: "\u8c37\u6b4c\u767b\u5f55\u662f\u53ef\u9009\u7684\uff0c\u5e76\u901a\u8fc7Supabase\u5904\u7406\uff1b\u5df2\u767b\u5f55\u7684\u8d26\u6237\u662f\u4f7f\u7528\u5df2\u4fdd\u5b58\u8fdb\u5ea6\u548c\u516c\u5f00\u6392\u884c\u699c\uff08\u7528\u6237\u540d\u3001WPM\u3001\u51c6\u786e\u7387\u3001\u96be\u5ea6\u3001\u65e5\u671f\uff09\u6240\u5fc5\u9700\u7684\u3002" },
    { h: "Cookie\u3001\u5b58\u50a8\u4e0e\u5e7f\u544a", body: `\u6211\u4eec\u4f7f\u7528Cookie\u3001\u672c\u5730\u5b58\u50a8\u3001\u8c37\u6b4c\u5206\u6790\uff0c\u53ef\u80fd\u8fd8\u4f7f\u7528\u8c37\u6b4c\u5e7f\u544a\u8054\u76df\u6765\u8fd0\u8425\u7f51\u7ad9\uff1b\u4f60\u53ef\u4ee5\u5728\u6d4f\u89c8\u5668\u4e2d\u6216\u5728${ADS}\u4e2d\u7ba1\u7406\u504f\u597d\u3002` },
    { h: "\u4f7f\u7528\u3001\u5171\u4eab\u4e0e\u5220\u9664", body: "\u6211\u4eec\u4e0d\u4f1a\u51fa\u552e\u4f60\u7684\u6570\u636e\uff0c\u516c\u5f00\u5171\u4eab\u7684\u4ec5\u9650\u6392\u884c\u699c\u4fe1\u606f\uff1b\u4f60\u53ef\u4ee5\u968f\u65f6\u7533\u8bf7\u5220\u9664\u8d26\u6237\u3002" },
    { h: "\u53d8\u66f4\u4e0e\u8054\u7cfb\u65b9\u5f0f", body: `\u672c\u653f\u7b56\u53ef\u80fd\u4f1a\u968f\u6253\u5b57\u6d4b\u8bd5\u5c71\u7f8a\u7684\u53d1\u5c55\u800c\u53d8\u66f4\uff1b\u5982\u6709\u7591\u95ee\uff0c\u8bf7\u8054\u7cfb${MAIL}\u3002` },
  ] },
  ja: { eyebrow: "\u6cd5\u7684\u60c5\u5831", heading: "\u30d7\u30e9\u30a4\u30d0\u30b7\u30fc\u30dd\u30ea\u30b7\u30fc", lastUpdated: "\u6700\u7d42\u66f4\u65b0\u65e5\uff1a2026\u5e749\u67084\u65e5", sections: [
    { h: "\u30a2\u30ab\u30a6\u30f3\u30c8\u306a\u3057\u3067\u306e\u30c6\u30b9\u30c8", body: "\u30b5\u30a4\u30f3\u30a4\u30f3\u305b\u305a\u306b\u30bf\u30a4\u30d4\u30f3\u30b0\u30c6\u30b9\u30c8 \u30e4\u30ae\u3092\u5229\u7528\u3067\u304d\u307e\u3059\u3002\u533f\u540d\u306e\u7d50\u679c\u306f\u8868\u793a\u3055\u308c\u307e\u3059\u304c\u3001\u4fdd\u5b58\u3055\u308c\u305f\u308a\u30ea\u30fc\u30c0\u30fc\u30dc\u30fc\u30c9\u306b\u8ffd\u52a0\u3055\u308c\u308b\u3053\u3068\u306f\u3042\u308a\u307e\u305b\u3093\u3002" },
    { h: "Google\u30b5\u30a4\u30f3\u30a4\u30f3\u3001\u9032\u6357\u3001\u30ea\u30fc\u30c0\u30fc\u30dc\u30fc\u30c9", body: "Google\u30b5\u30a4\u30f3\u30a4\u30f3\u306f\u4efb\u610f\u3067\u3001Supabase\u3092\u901a\u3057\u3066\u51e6\u7406\u3055\u308c\u307e\u3059\u3002\u4fdd\u5b58\u3055\u308c\u305f\u9032\u6357\u3068\u516c\u958b\u30ea\u30fc\u30c0\u30fc\u30dc\u30fc\u30c9\uff08\u30e6\u30fc\u30b6\u30fc\u540d\u3001WPM\u3001\u6b63\u78ba\u7387\u3001\u96e3\u6613\u5ea6\u3001\u65e5\u4ed8\uff09\u306b\u306f\u30b5\u30a4\u30f3\u30a4\u30f3\u3057\u305f\u30a2\u30ab\u30a6\u30f3\u30c8\u304c\u5fc5\u8981\u3067\u3059\u3002" },
    { h: "\u30af\u30ea\u30c3\u30ad\u30fc\u3001\u30b9\u30c8\u30ec\u30fc\u30b8\u3001\u5e83\u544a", body: `\u30b5\u30a4\u30c8\u904b\u55b6\u306e\u305f\u3081\u30af\u30ea\u30c3\u30ad\u30fc\u3001\u30ed\u30fc\u30ab\u30eb\u30b9\u30c8\u30ec\u30fc\u30b8\u3001Google Analytics\u3001\u5834\u5408\u306b\u3088\u308aGoogle AdSense\u3092\u4f7f\u7528\u3057\u307e\u3059\u3002\u30d6\u30e9\u30a6\u30b6\u8a2d\u5b9a\u307e\u305f\u306f${ADS}\u3067\u7ba1\u7406\u3067\u304d\u307e\u3059\u3002` },
    { h: "\u5229\u7528\u3001\u5171\u6709\u3001\u524a\u9664", body: "\u30c7\u30fc\u30bf\u3092\u8ca9\u58f2\u3059\u308b\u3053\u3068\u306f\u306a\u304f\u3001\u516c\u958b\u5171\u6709\u3059\u308b\u306e\u306f\u30ea\u30fc\u30c0\u30fc\u30dc\u30fc\u30c9\u60c5\u5831\u306e\u307f\u3067\u3059\u3002\u3044\u3064\u3067\u3082\u30a2\u30ab\u30a6\u30f3\u30c8\u306e\u524a\u9664\u3092\u30ea\u30ad\u30c3\u30af\u30ce\u30c8\u3067\u304d\u307e\u3059\u3002" },
    { h: "\u5909\u66f4\u3068\u304a\u554f\u3044\u5408\u308f\u305b", body: `\u672c\u30dd\u30ea\u30b7\u30fc\u306f\u5909\u66f4\u3055\u308c\u308b\u3053\u3068\u304c\u3042\u308a\u307e\u3059\u3002\u3054\u8cea\u554f\u306f${MAIL}\u307e\u3067\u3002` },
  ] },
  ko: { eyebrow: "\ubc95\uc801 \uc548\ub0b4", heading: "\uac1c\uc778\uc815\ubc34\ucb50\ub9ac\ubb34\ucef4", lastUpdated: "\uc0ac\uc6a9\ubcf4\uc728\ud6c4", sections: [] },
};

export default function PrivacyPolicyPage({ locale = "en" as Locale }: { locale?: Locale }) {
  const t = TEXT[locale] ?? TEXT.en;
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[24px] border border-hairline bg-canvas p-6 shadow-sm sm:p-10">
        <p className="font-label text-accent">{t.eyebrow}</p>
        <h1 className="mt-3 font-heading-3 text-ink">{t.heading}</h1>
        <p className="mt-3 font-caption text-text-faint">{t.lastUpdated}</p>
        <div className="mt-8 space-y-6 font-body text-text-muted">
          {t.sections.map((s, i) => (
            <div key={i}>
              <h2 className="font-heading-5 text-ink">{s.h}</h2>
              <p className="mt-2" dangerouslySetInnerHTML={{ __html: s.body }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
