import BlurTypeReveal from "./BlurTypeReveal";
import type { Locale } from "../lib/i18n";
import { tr } from "../lib/i18n";

type Step = { title: string; body: string };

const INTRO: Record<Locale, string> = {
  en: "FreeTypingTestGoat is built to be understood in seconds. No tutorials, no setup screens \u2014 just a fast, focused online typing speed test for practice, WPM feedback, and real improvement.",
  es: "Test de mecanograf\u00eda Cabra est\u00e1 dise\u00f1ado para que entiendas la prueba en segundos: elige una dificultad, escribe, mide tu rendimiento y vuelve a practicar.",
  de: "Schreibtest Ziege ist so gestaltet, dass du ihn in Sekunden verstehst. Keine Tutorials, keine Einrichtung \u2014 nur ein schneller, fokussierter Online-Schreibtest f\u00fcr \u00dcbung, WPM-Feedback und echte Fortschritte.",
  fr: "Test de frappe Ch\u00e8vre est con\u00e7u pour \u00eatre compris en quelques secondes. Pas de tutoriel, pas d'\u00e9cran de configuration \u2014 juste un test de frappe en ligne rapide et cibl\u00e9 pour s'entra\u00eener, obtenir un retour sur son WPM et progresser r\u00e9ellement.",
  it: "Test di Digitazione Capra \u00e8 pensato per essere capito in pochi secondi. Nessun tutorial, nessuna schermata di configurazione: solo un test di digitazione online rapido e mirato per allenarti, ricevere un feedback sul WPM e migliorare davvero.",
  pt: "Teste de Digita\u00e7\u00e3o Cabra foi criado para ser entendido em segundos. Sem tutoriais, sem telas de configura\u00e7\u00e3o \u2014 apenas um teste de digita\u00e7\u00e3o online r\u00e1pido e focado para praticar, receber feedback de WPM e melhorar de verdade.",
  pl: "Test Pisania Koza zosta\u0142 zaprojektowany tak, aby zrozumie\u0107 go w kilka sekund. Bez samouczk\u00f3w, bez ekran\u00f3w konfiguracji \u2014 tylko szybki, skoncentrowany test pisania online do \u0107wicze\u0144, informacji o WPM i realnej poprawy.",
  tr: "Yazma Testi Ke\u00e7i, saniyeler i\u00e7inde anla\u015f\u0131lacak \u015fekilde tasarland\u0131. \u00d6\u011fretici yok, kurulum ekran\u0131 yok \u2014 sadece pratik yapmak, WPM geri bildirimi almak ve ger\u00e7ekten geli\u015fmek i\u00e7in h\u0131zl\u0131, odakl\u0131 bir \u00e7evrimi\u00e7i yazma testi.",
  uk: "\u0422\u0435\u0441\u0442 \u0434\u0440\u0443\u043a\u0443 \u041a\u043e\u0437\u0430 \u0441\u0442\u0432\u043e\u0440\u0435\u043d\u043e \u0442\u0430\u043a, \u0449\u043e\u0431 \u0437\u0440\u043e\u0437\u0443\u043c\u0456\u0442\u0438 \u0439\u043e\u0433\u043e \u0437\u0430 \u043a\u0456\u043b\u044c\u043a\u0430 \u0441\u0435\u043a\u0443\u043d\u0434. \u0411\u0435\u0437 \u043d\u0430\u0432\u0447\u0430\u043b\u044c\u043d\u0438\u0445 \u043f\u043e\u0441\u0456\u0431\u043d\u0438\u043a\u0456\u0432, \u0431\u0435\u0437 \u0435\u043a\u0440\u0430\u043d\u0456\u0432 \u043d\u0430\u043b\u0430\u0448\u0442\u0443\u0432\u0430\u043d\u043d\u044f \u2014 \u043b\u0438\u0448\u0435 \u0448\u0432\u0438\u0434\u043a\u0438\u0439, \u0437\u043e\u0441\u0435\u0440\u0435\u0434\u0436\u0435\u043d\u0438\u0439 \u043e\u043d\u043b\u0430\u0439\u043d-\u0442\u0435\u0441\u0442 \u043d\u0430\u0431\u043e\u0440\u0443 \u0442\u0435\u043a\u0441\u0442\u0443 \u0434\u043b\u044f \u043f\u0440\u0430\u043a\u0442\u0438\u043a\u0438, \u0437\u0432\u043e\u0440\u043e\u0442\u043d\u043e\u0433\u043e \u0437\u0432'\u044f\u0437\u043a\u0443 \u043f\u043e WPM \u0456 \u0441\u043f\u0440\u0430\u0432\u0436\u043d\u044c\u043e\u0433\u043e \u043f\u0440\u043e\u0433\u0440\u0435\u0441\u0443.",
  id: "Tes Mengetik Kambing dirancang agar mudah dipahami dalam hitungan detik. Tanpa tutorial, tanpa layar pengaturan \u2014 hanya tes mengetik online yang cepat dan fokus untuk latihan, masukan WPM, dan peningkatan nyata.",
  zh: "\u6253\u5b57\u6d4b\u8bd5\u5c71\u7f8a\u7684\u8bbe\u8ba1\u8ba9\u4f60\u51e0\u79d2\u949f\u5c31\u80fd\u4e0a\u624b\u3002\u6ca1\u6709\u6559\u7a0b\uff0c\u6ca1\u6709\u8bbe\u7f6e\u754c\u9762\u2014\u2014\u53ea\u6709\u4e00\u4e2a\u5feb\u901f\u3001\u4e13\u6ce8\u7684\u5728\u7ebf\u6253\u5b57\u6d4b\u8bd5\uff0c\u5e2e\u4f60\u7ec3\u4e60\u3001\u83b7\u5f97WPM\u53cd\u9988\u5e76\u771f\u6b63\u63d0\u5347\u3002",
  ja: "\u30bf\u30a4\u30d4\u30f3\u30b0\u30c6\u30b9\u30c8 \u30e4\u30ae\u306f\u6570\u79d2\u3067\u7406\u89e3\u3067\u304d\u308b\u3088\u3046\u306b\u4f5c\u3089\u308c\u3066\u3044\u307e\u3059\u3002\u30c1\u30e5\u30fc\u30ea\u30a2\u30eb\u3084\u8a2d\u5b9a\u753b\u9762\u306f\u4e0d\u8981\u2014\u2014\u7df4\u7fd2\u3068WPM\u306e\u30d5\u30a3\u30fc\u30c9\u30d0\u30c3\u30af\u3001\u305d\u3057\u3066\u672c\u5f53\u306e\u5411\u4e0a\u306e\u305f\u3081\u306e\u3001\u901f\u304f\u3066\u96c6\u4e2d\u3067\u304d\u308b\u30aa\u30f3\u30e9\u30a4\u30f3\u30bf\u30a4\u30d4\u30f3\u30b0\u30c6\u30b9\u30c8\u3067\u3059\u3002",
  ko: "\ud0c0\uc774\ud53c\ud551 \ud14c\uc2a4\ud2b8 \uc5fc\uc18c\ub294 \ubd80\u002e \u00b7 \uc5c6\uc774 \ubab0 \u002e",
};

const STEPS: Record<Locale, [Step, Step, Step, Step]> = {
  en: [
    { title: "Choose your setup", body: "Pick Easy, Medium or Hard, then choose a duration \u2014 1, 2, 3 or 5 minutes. Your preference is remembered for next time." },
    { title: "Start typing", body: "There's no separate start button to click. The timer begins automatically the moment you type the first character." },
    { title: "Type the passage", body: "Correct characters turn black, mistakes are marked in red, and a bright caret always shows your current position." },
    { title: "Get your results", body: "When the timer hits zero, FreeTypingTestGoat instantly shows your WPM, accuracy, and errors. You can take a test without signing in; account-based progress and leaderboard features require Google Sign-In." },
  ],
  es: [
    { title: "Elige tu configuraci\u00f3n", body: "Selecciona F\u00e1cil, Medio o Dif\u00edcil y despu\u00e9s una duraci\u00f3n de 1, 2, 3 o 5 minutos. Tu preferencia se recuerda para la pr\u00f3xima sesi\u00f3n." },
    { title: "Empieza a escribir", body: "No necesitas pulsar un bot\u00f3n de inicio. El cron\u00f3metro comienza autom\u00e1ticamente cuando escribes el primer car\u00e1cter." },
    { title: "Escribe el texto", body: "Los caracteres correctos permanecen en pantalla, los errores se marcan y el cursor muestra siempre tu posici\u00f3n actual." },
    { title: "Consulta tus resultados", body: "Al terminar, puedes ver WPM, precisi\u00f3n, errores y otras m\u00e9tricas. Puedes hacer la prueba sin iniciar sesi\u00f3n; algunas funciones de cuenta y clasificaci\u00f3n requieren iniciar sesi\u00f3n con Google." },
  ],
  de: [
    { title: "W\u00e4hle deine Einstellungen", body: "W\u00e4hle Leicht, Mittel oder Schwer und dann eine Dauer \u2013 1, 2, 3 oder 5 Minuten. Deine Einstellung wird f\u00fcr das n\u00e4chste Mal gespeichert." },
    { title: "Beginne zu tippen", body: "Es gibt keinen separaten Startknopf. Der Timer startet automatisch, sobald du das erste Zeichen eingibst." },
    { title: "Tippe den Text", body: "Richtige Zeichen werden schwarz markiert, Fehler rot, und ein heller Cursor zeigt immer deine aktuelle Position." },
    { title: "Erhalte deine Ergebnisse", body: "Wenn der Timer abl\u00e4uft, zeigt Schreibtest Ziege sofort deine WPM, Genauigkeit und Fehler an. Du kannst ohne Anmeldung testen; Fortschritt und Bestenliste erfordern eine Google-Anmeldung." },
  ],
  fr: [
    { title: "Choisissez votre configuration", body: "Choisissez Facile, Moyen ou Difficile, puis une dur\u00e9e de 1, 2, 3 ou 5 minutes. Votre pr\u00e9f\u00e9rence est m\u00e9moris\u00e9e pour la prochaine fois." },
    { title: "Commencez \u00e0 taper", body: "Pas de bouton de d\u00e9marrage s\u00e9par\u00e9. Le chronom\u00e8tre d\u00e9marre automatiquement d\u00e8s que vous tapez le premier caract\u00e8re." },
    { title: "Tapez le texte", body: "Les caract\u00e8res corrects s'affichent en noir, les erreurs sont marqu\u00e9es en rouge, et un curseur lumineux indique toujours votre position actuelle." },
    { title: "Obtenez vos r\u00e9sultats", body: "Lorsque le chronom\u00e8tre atteint z\u00e9ro, Test de frappe Ch\u00e8vre affiche instantan\u00e9ment votre WPM, votre pr\u00e9cision et vos erreurs. Vous pouvez faire un test sans vous connecter ; le suivi du profil et le classement n\u00e9cessitent une connexion Google." },
  ],
  it: [
    { title: "Scegli la tua configurazione", body: "Scegli Facile, Medio o Difficile, poi una durata di 1, 2, 3 o 5 minuti. La tua preferenza viene ricordata per la prossima volta." },
    { title: "Inizia a digitare", body: "Non c'\u00e8 un pulsante di avvio separato. Il timer parte automaticamente non appena digiti il primo carattere." },
    { title: "Digita il testo", body: "I caratteri corretti diventano neri, gli errori sono segnati in rosso e un cursore luminoso mostra sempre la tua posizione attuale." },
    { title: "Ottieni i tuoi risultati", body: "Quando il timer arriva a zero, Test di Digitazione Capra mostra subito il tuo WPM, la precisione e gli errori. Puoi fare il test senza accedere; il progresso e la classifica richiedono l'accesso con Google." },
  ],
  pt: [
    { title: "Escolha sua configura\u00e7\u00e3o", body: "Escolha F\u00e1cil, M\u00e9dio ou Dif\u00edcil e depois uma dura\u00e7\u00e3o de 1, 2, 3 ou 5 minutos. Sua prefer\u00eancia \u00e9 lembrada para a pr\u00f3xima vez." },
    { title: "Comece a digitar", body: "N\u00e3o h\u00e1 um bot\u00e3o de in\u00edcio separado. O cron\u00f4metro come\u00e7a automaticamente no momento em que voc\u00ea digita o primeiro caractere." },
    { title: "Digite o texto", body: "Os caracteres corretos ficam pretos, os erros s\u00e3o marcados em vermelho e um cursor brilhante sempre mostra sua posi\u00e7\u00e3o atual." },
    { title: "Veja seus resultados", body: "Quando o cron\u00f4metro chega a zero, o Teste de Digita\u00e7\u00e3o Cabra mostra instantaneamente seu WPM, precis\u00e3o e erros. Voc\u00ea pode fazer o teste sem entrar; progresso de conta e classifica\u00e7\u00e3o exigem login com o Google." },
  ],
  pl: [
    { title: "Wybierz swoj\u0105 konfiguracj\u0119", body: "Wybierz \u0141atwy, \u015aredni lub Trudny, a potem czas trwania \u2014 1, 2, 3 lub 5 minut. Twoje preferencje s\u0105 zapami\u0119tywane na nast\u0119pny raz." },
    { title: "Zacznij pisa\u0107", body: "Nie ma osobnego przycisku start. Stoper uruchamia si\u0119 automatycznie w momencie wpisania pierwszego znaku." },
    { title: "Wpisz tekst", body: "Poprawne znaki staj\u0105 si\u0119 czarne, b\u0142\u0119dy s\u0105 oznaczone czerwonym kolorem, a jasny kursor zawsze pokazuje twoj\u0105 aktualn\u0105 pozycj\u0119." },
    { title: "Zobacz swoje wyniki", body: "Kiedy stoper dojdzie do zera, Test Pisania Koza natychmiast pokazuje tw\u00f3j WPM, dok\u0142adno\u015b\u0107 i b\u0142\u0119dy. Mo\u017cesz wykona\u0107 test bez logowania; post\u0119py konta i ranking wymagaj\u0105 logowania Google." },
  ],
  tr: [
    { title: "Kurulumunu se\u00e7", body: "Kolay, Orta veya Zor se\u00e7, ard\u0131ndan bir s\u00fcre belirle \u2014 1, 2, 3 veya 5 dakika. Tercihin bir dahaki sefere hat\u0131rlan\u0131r." },
    { title: "Yazmaya ba\u015fla", body: "Ayr\u0131 bir ba\u015flat d\u00fc\u011fmesi yok. \u0130lk karakteri yazd\u0131\u011f\u0131n anda zamanlay\u0131c\u0131 otomatik olarak ba\u015flar." },
    { title: "Metni yaz", body: "Do\u011fru karakterler siyaha d\u00f6ner, hatalar k\u0131rm\u0131z\u0131yla i\u015faretlenir ve parlak imle\u00e7 her zaman mevcut konumunu g\u00f6sterir." },
    { title: "Sonu\u00e7lar\u0131n\u0131 g\u00f6r", body: "Zamanlay\u0131c\u0131 s\u0131f\u0131rland\u0131\u011f\u0131nda, Yazma Testi Ke\u00e7i an\u0131nda WPM, do\u011frulu\u011f unu ve hatalar\u0131n\u0131 g\u00f6sterir. Giri\u015f yapmadan test yapabilirsin; hesap ilerlemesi ve lider tablosu i\u00e7in Google ile giri\u015f gerekir." },
  ],
  uk: [
    { title: "\u041e\u0431\u0435\u0440\u0456\u0442\u044c \u043d\u0430\u043b\u0430\u0448\u0442\u0443\u0432\u0430\u043d\u043d\u044f", body: "\u0412\u0438\u0431\u0435\u0440\u0456\u0442\u044c \u041b\u0435\u0433\u043a\u0438\u0439, \u0421\u0435\u0440\u0435\u0434\u043d\u0456\u0439 \u0430\u0431\u043e \u0421\u043a\u043b\u0430\u0434\u043d\u0438\u0439 \u0440\u0456\u0432\u0435\u043d\u044c, \u0430 \u043f\u043e\u0442\u0456\u043c \u0442\u0440\u0438\u0432\u0430\u043b\u0456\u0441\u0442\u044c \u2014 1, 2, 3 \u0430\u0431\u043e 5 \u0445\u0432\u0438\u043b\u0438\u043d." },
    { title: "\u041f\u043e\u0447\u043d\u0456\u0442\u044c \u043d\u0430\u0431\u0438\u0440\u0430\u0442\u0438 \u0442\u0435\u043a\u0441\u0442", body: "\u041e\u043a\u0440\u0435\u043c\u043e\u0457 \u043a\u043d\u043e\u043f\u043a\u0438 \u0441\u0442\u0430\u0440\u0442\u0443 \u043d\u0435\u043c\u0430\u0454. \u0442\u0430\u0439\u043c\u0435\u0440 \u0437\u0430\u043f\u0443\u0441\u043a\u0430\u0454\u0442\u044c\u0441\u044f \u0430\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u043d\u043e." },
    { title: "\u041d\u0430\u0431\u0438\u0440\u0430\u0439\u0442\u0435 \u0442\u0435\u043a\u0441\u0442", body: "\u041f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u0456 \u0441\u0438\u043c\u0432\u043e\u043b\u0438 \u0441\u0442\u0430\u044e\u0442\u044c \u0447\u043e\u0440\u043d\u0438\u043c\u0438, \u043f\u043e\u043c\u0438\u043b\u043a\u0438 \u043f\u043e\u0437\u043d\u0430\u0447\u0430\u044e\u0442\u044c\u0441\u044f \u0447\u0435\u0440\u0432\u043e\u043d\u0438\u043c." },
    { title: "\u041e\u0442\u0440\u0438\u043c\u0430\u0439\u0442\u0435 \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u0438", body: "\u041a\u043e\u043b\u0438 \u0442\u0430\u0439\u043c\u0435\u0440 \u0434\u043e\u0445\u043e\u0434\u0438\u0442\u044c \u0434\u043e \u043d\u0443\u043b\u044f, \u0432\u0438 \u043e\u0442\u0440\u0438\u043c\u0443\u0454\u0442\u0435 WPM \u0442\u0430 \u0442\u043e\u0447\u043d\u0456\u0441\u0442\u044c." },
  ],
  id: [
    { title: "Pilih pengaturanmu", body: "Pilih Mudah, Sedang, atau Sulit, lalu pilih durasi \u2014 1, 2, 3, atau 5 menit. Preferensimu akan diingat untuk lain waktu." },
    { title: "Mulai mengetik", body: "Tidak ada tombol mulai terpisah. Timer dimulai otomatis begitu kamu mengetik karakter pertama." },
    { title: "Ketik teksnya", body: "Karakter yang benar berubah hitam, kesalahan ditandai merah, dan kursor terang selalu menunjukkan posisimu saat ini." },
    { title: "Lihat hasilmu", body: "Saat timer mencapai nol, Tes Mengetik Kambing langsung menampilkan WPM, akurasi, dan kesalahanmu. Kamu bisa mengikuti tes tanpa masuk; progres akun dan papan peringkat memerlukan masuk dengan Google." },
  ],
  zh: [
    { title: "\u9009\u62e9\u4f60\u7684\u8bbe\u7f6e", body: "\u9009\u62e9\u7b80\u5355\u3001\u4e2d\u7b49\u6216\u56f0\u96be\uff0c\u7136\u540e\u9009\u62e9\u65f6\u957f\u2014\u20141\u30012\u30013\u62165\u5206\u949f\u3002\u4f60\u7684\u504f\u597d\u4f1a\u88ab\u8bb0\u4f4f\u3002" },
    { title: "\u5f00\u59cb\u6253\u5b57", body: "\u6ca1\u6709\u5355\u72ec\u7684\u5f00\u59cb\u6309\u94ae\u3002\u5f53\u4f60\u8f93\u5165\u7b2c\u4e00\u4e2a\u5b57\u7b26\u65f6\uff0c\u8ba1\u65f6\u5668\u4f1a\u81ea\u52a8\u5f00\u59cb\u3002" },
    { title: "\u8f93\u5165\u6587\u672c", body: "\u6b63\u786e\u7684\u5b57\u7b26\u4f1a\u53d8\u9ed1\uff0c\u9519\u8bef\u4f1a\u6807\u7ea2\uff0c\u660e\u4eae\u7684\u5149\u6807\u59cb\u7ec8\u663e\u793a\u4f60\u5f53\u524d\u7684\u4f4d\u7f6e\u3002" },
    { title: "\u67e5\u770b\u4f60\u7684\u7ed3\u679c", body: "\u8ba1\u65f6\u7ed3\u675f\u540e\uff0c\u6253\u5b57\u6d4b\u8bd5\u5c71\u7f8a\u4f1a\u7acb\u5373\u663e\u793a\u4f60\u7684WPM\u3001\u51c6\u786e\u7387\u548c\u9519\u8bef\u6570\u3002\u4f60\u53ef\u4ee5\u4e0d\u767b\u5f55\u8fdb\u884c\u6d4b\u8bd5\uff1b\u8d26\u6237\u8fdb\u5ea6\u548c\u6392\u884c\u699c\u529f\u80fd\u9700\u8981\u4f7f\u7528Google\u767b\u5f55\u3002" },
  ],
  ja: [
    { title: "\u8a2d\u5b9a\u3092\u9078\u3076", body: "\u300c\u6613\u3057\u3044\u300d\u300c\u666e\u901a\u300d\u300c\u96e3\u3057\u3044\u300d\u3092\u9078\u3073\u3001\u6b21\u306b1\u5206\u30012\u5206\u30013\u5206\u30015\u5206\u306e\u4e2d\u304b\u3089\u6642\u9593\u3092\u9078\u3073\u307e\u3059\u3002\u8a2d\u5b9a\u306f\u6b21\u56de\u306e\u305f\u3081\u306b\u4fdd\u5b58\u3055\u308c\u307e\u3059\u3002" },
    { title: "\u30bf\u30a4\u30d4\u30f3\u30b0\u3092\u59cb\u3081\u308b", body: "\u500b\u5225\u306e\u30b9\u30bf\u30fc\u30c8\u30dc\u30bf\u30f3\u306f\u3042\u308a\u307e\u305b\u3093\u3002\u6700\u521d\u306e\u6587\u5b57\u3092\u5165\u529b\u3057\u305f\u77ac\u9593\u306b\u30bf\u30a4\u30de\u30fc\u304c\u81ea\u52d5\u7684\u306b\u59cb\u307e\u308a\u307e\u3059\u3002" },
    { title: "\u6587\u7ae0\u3092\u5165\u529b\u3059\u308b", body: "\u6b63\u3057\u3044\u6587\u5b57\u306f\u9ed2\u304f\u8868\u793a\u3055\u308c\u3001\u9593\u9055\u3044\u306f\u8d64\u304f\u30de\u30fc\u30af\u3055\u308c\u3001\u660e\u308b\u3044\u30ab\u30fc\u30bd\u30eb\u304c\u5e38\u306b\u73fe\u5728\u306e\u4f4d\u7f6e\u3092\u793a\u3057\u307e\u3059\u3002" },
    { title: "\u7d50\u679c\u3092\u78ba\u8a8d\u3059\u308b", body: "\u30bf\u30a4\u30de\u30fc\u304c\u30bc\u30ed\u306b\u306a\u308b\u3068\u3001\u30bf\u30a4\u30d4\u30f3\u30b0\u30c6\u30b9\u30c8 \u30e4\u30ae\u306f\u3059\u3050\u306bWPM\u3001\u6b63\u78ba\u7387\u3001\u30a8\u30e9\u30fc\u3092\u8868\u793a\u3057\u307e\u3059\u3002\u30ed\u30b0\u30a4\u30f3\u306a\u3057\u3067\u30c6\u30b9\u30c8\u3067\u304d\u307e\u3059\u304c\u3001\u9032\u6357\u306e\u8a18\u9332\u3084\u30e9\u30f3\u30ad\u30f3\u30b0\u6a5f\u80fd\u306b\u306fGoogle\u30ed\u30b0\u30a4\u30f3\u304c\u5fc5\u8981\u3067\u3059\u3002" },
  ],
  ko: [
    { title: "\uc124\uc815 \uc120\ud0dd\ud558\uae30", body: "\uc27d\uc74c, \ubcf4\ud1b5, \uc5b4\ub824\uc6c0 \uc911 \uc120\ud0dd\ud55c \ud6c4 1\ubd84, 2\ubd84, 3\ubd84, 5\ubd84 \uc911 \uc2dc\uac04\uc744 \uc120\ud0dd\ud558\uc138\uc694. \ub2e4\uc74c\uc5d0\ub3c4 \uc120\ud638\ub3c4\uac00 \uae30\uc5b5\ub429\ub2c8\ub2e4." },
    { title: "\ud0c0\uc774\ud551 \uc2dc\uc791\ud558\uae30", body: "\ubc84\ub85c \uc2dc\uc791 \ubc84\ud2bc\uc740 \uc5c6\uc2b5\ub2c8\ub2e4. \ucca8 \uae00\uc790\ub97c \uc785\ub2ed\ud558\ub294 \uc21c\uac04 \ud0c0\uc774\ub09c\uac00 \uc790\ub3d9\uc73c\ub85c \uc2dc\uc791\ub429\ub2c8\ub2e4." },
    { title: "\ubb38\uc7a5 \uc785\ub824\ud558\uae30", body: "\uc62c\ubc14\ub978 \ubb38\uc790\ub294 \uac80\uc740\uc0c9\uc73c\ub85c \ud45c\uc2dc\ub418\uace0, \uc624\ub958\ub294 \ubc60\uac04\uc0c9\uc73c\ub85c \ud45c\uc2dc\ub429\ub2c8\ub2e4. \ubc1d\uc740 \ucee4\uc11c\uac00 \ud56d\uc0c1 \ud604\uc7ac \uc704\uc9c0\ub97c \ubcf4\uc5ec\uc90d\ub2c8\ub2e4." },
    { title: "\uacb0\uacfc \ud655\uc778\ud558\uae30", body: "\ud0c0\uc774\uba38\uac00 0\uc774 \ub418\ub9d0\uc790\ub9c8\uc790 \ud0c0\uc774\ud53c\ud551 \ud14c\uc2a4\ud2b8 \uc5fc\uc18c\uac00 \uc989\uc2dc WPM, \uc815\ud655\ub3c4, \uc624\ub958\ub97c \ubcf4\uc5ec\uc90d\ub2c8\ub2e4. \ub85c\uae30\uc778 \uc5c6\uc774 \ud14c\uc2a4\ud2b8\ud560 \uc218 \uc788\uc73c\uc548, \uacc4\uc815 \uc9c4\ud96d \ubc0f \ub9ac\ub354\ubcf4\ub4dc \uae30\ub2a5\uc740 Google \ub85c\uadf8\uc778\uc774 \ud544\uc694\ud569\ub2c8\ub2e4." },
  ],
};

export default function HowItWorks({ locale = "en" as Locale }: { locale?: Locale }) {
  const heading = tr(locale, "footer", "howItWorks");
  const intro = INTRO[locale] ?? INTRO.en;
  const steps = STEPS[locale] ?? STEPS.en;

  return (
    <section id="how-it-works" className="mx-auto max-w-5xl scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <BlurTypeReveal as="h2" className="font-heading-4 text-ink" text={heading} by="char" stagger={34} />
        <BlurTypeReveal
          as="p"
          className="mx-auto mt-3 max-w-2xl font-body text-text-muted"
          text={intro}
          by="word"
          stagger={22}
          delay={220}
          caret={false}
        />
      </div>

      {/* Odd cards enter from the left, even cards from the right, staggered. */}
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" data-reveal-group="alternate">
        {steps.map((step, i) => (
          <div
            key={step.title}
            className="premium-card rounded-[24px] border border-hairline bg-canvas p-6 shadow-sm"
          >
            <span className="font-label text-accent">0{i + 1}</span>
            <h3 className="mt-3 font-heading-5 text-ink">{step.title}</h3>
            <p className="mt-2 font-body-sm text-text-muted">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
