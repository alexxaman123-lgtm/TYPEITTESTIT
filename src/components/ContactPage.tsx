import type { Locale } from "../lib/i18n";

type ContactText = { eyebrow: string; heading: string; intro: string };

const TEXT: Record<Locale, ContactText> = {
  en: { eyebrow: "Get in touch", heading: "CONTACT FREETYPINGTESTGOAT", intro: "Have a question, suggestion, or query about FreeTypingTestGoat? We would be happy to hear from you. Please reach out to us at the email address below and we\u2019ll do our best to help." },
  es: { eyebrow: "Ponte en contacto", heading: "CONTACTA CON TEST DE MECANOGRAF\u00cdA CABRA", intro: "\u00bfTienes alguna pregunta, sugerencia o consulta sobre Test de mecanograf\u00eda Cabra? Nos encantar\u00eda saber de ti. Escr\u00edbenos a la siguiente direcci\u00f3n de correo y haremos todo lo posible por ayudarte." },
  de: { eyebrow: "Kontakt aufnehmen", heading: "KONTAKT ZU SCHREIBTEST ZIEGE", intro: "Hast du eine Frage, einen Vorschlag oder eine Anfrage zu Schreibtest Ziege? Wir freuen uns, von dir zu h\u00f6ren. Schreib uns bitte an die untenstehende E-Mail-Adresse, und wir helfen dir gerne weiter." },
  fr: { eyebrow: "Contactez-nous", heading: "CONTACTER TEST DE FRAPPE CH\u00c8VRE", intro: "Vous avez une question, une suggestion ou une demande concernant Test de frappe Ch\u00e8vre\u00a0? Nous serions ravis de vous entendre. Contactez-nous \u00e0 l'adresse e-mail ci-dessous et nous ferons de notre mieux pour vous aider." },
  it: { eyebrow: "Contattaci", heading: "CONTATTA TEST DI DIGITAZIONE CAPRA", intro: "Hai una domanda, un suggerimento o una richiesta su Test di Digitazione Capra? Saremmo felici di sentirti. Scrivici all'indirizzo email qui sotto e faremo del nostro meglio per aiutarti." },
  pt: { eyebrow: "Fale conosco", heading: "CONTATO COM TESTE DE DIGITA\u00c7\u00c3O CABRA", intro: "Tem alguma d\u00favida, sugest\u00e3o ou pergunta sobre o Teste de Digita\u00e7\u00e3o Cabra? Ficar\u00edamos felizes em ouvir voc\u00ea. Entre em contato pelo e-mail abaixo e faremos o poss\u00edvel para ajudar." },
  pl: { eyebrow: "Skontaktuj si\u0119", heading: "KONTAKT Z TEST PISANIA KOZA", intro: "Masz pytanie, sugesti\u0119 lub zapytanie dotycz\u0105ce Test Pisania Koza? Ch\u0119tnie Ci\u0119 wys\u0142uchamy. Napisz do nas na poni\u017cszy adres e-mail, a zrobimy wszystko, aby pom\u00f3c." },
  tr: { eyebrow: "Bize ula\u015f\u0131n", heading: "YAZMA TEST\u0130 KE\u00c7\u0130 \u0130LE \u0130LET\u0130\u015e\u0130ME GE\u00c7\u0130N", intro: "Yazma Testi Ke\u00e7i hakk\u0131nda bir sorunuz, \u00f6neriniz veya talebiniz mi var? Sizden haber almaktan memnuniyet duyar\u0131z. L\u00fctfen a\u015fa\u011f\u0131daki e-posta adresinden bize ula\u015f\u0131n, size yard\u0131mc\u0131 olmak i\u00e7in elimizden geleni yapaca\u011f\u0131z." },
  uk: { eyebrow: "\u0417\u0432'\u044f\u0436\u0456\u0442\u044c\u0441\u044f \u0437 \u043d\u0430\u043c\u0438", heading: "\u0417\u0412'\u042f\u0417\u041e\u041a \u0417 \u0422\u0415\u0421\u0422 \u0414\u0420\u0423\u041a\u0423 \u041a\u041e\u0417\u0410", intro: "\u041c\u0430\u0454\u0442\u0435 \u0437\u0430\u043f\u0438\u0442\u0430\u043d\u043d\u044f, \u043f\u0440\u043e\u043f\u043e\u0437\u0438\u0446\u0456\u044e \u0447\u0438 \u0437\u0430\u043f\u0438\u0442 \u0449\u043e\u0434\u043e \u0422\u0435\u0441\u0442 \u0434\u0440\u0443\u043a\u0443 \u041a\u043e\u0437\u0430? \u041c\u0438 \u0431\u0443\u0434\u0435\u043c\u043e \u0440\u0430\u0434\u0456 \u043f\u043e\u0447\u0443\u0442\u0438 \u0432\u0430\u0441. \u0411\u0443\u0434\u044c \u043b\u0430\u0441\u043a\u0430, \u043d\u0430\u043f\u0438\u0448\u0456\u0442\u044c \u043d\u0430\u043c \u043d\u0430 \u0435\u043b\u0435\u043a\u0442\u0440\u043e\u043d\u043d\u0443 \u0430\u0434\u0440\u0435\u0441\u0443 \u043d\u0438\u0436\u0447\u0435, \u0456 \u043c\u0438 \u0437\u0440\u043e\u0431\u0438\u043c\u043e \u0432\u0441\u0435 \u043c\u043e\u0436\u043b\u0438\u0432\u0435, \u0449\u043e\u0431 \u0434\u043e\u043f\u043e\u043c\u043e\u0433\u0442\u0438." },
  id: { eyebrow: "Hubungi kami", heading: "HUBUNGI TES MENGETIK KAMBING", intro: "Punya pertanyaan, saran, atau permintaan tentang Tes Mengetik Kambing? Kami senang mendengar dari kamu. Silakan hubungi kami melalui alamat email di bawah ini dan kami akan berusaha sebaik mungkin untuk membantu." },
  zh: { eyebrow: "\u8054\u7cfb\u6211\u4eec", heading: "\u8054\u7cfb\u6253\u5b57\u6d4b\u8bd5\u5c71\u7f8a", intro: "\u5bf9\u6253\u5b57\u6d4b\u8bd5\u5c71\u7f8a\u6709\u4efb\u4f55\u95ee\u9898\u3001\u5efa\u8bae\u6216\u7591\u95ee\u5417\uff1f\u6211\u4eec\u5f88\u4e50\u610f\u542c\u53d6\u4f60\u7684\u610f\u89c1\u3002\u8bf7\u901a\u8fc7\u4e0b\u65b9\u7684\u7535\u5b50\u90ae\u4ef6\u5730\u5740\u8054\u7cfb\u6211\u4eec\uff0c\u6211\u4eec\u4f1a\u5c3d\u529b\u63d0\u4f9b\u5e2e\u52a9\u3002" },
  ja: { eyebrow: "\u304a\u554f\u3044\u5408\u308f\u305b", heading: "\u30bf\u30a4\u30d4\u30f3\u30b0\u30c6\u30b9\u30c8 \u30e4\u30ae\u3078\u306e\u304a\u554f\u3044\u5408\u308f\u305b", intro: "\u30bf\u30a4\u30d4\u30f3\u30b0\u30c6\u30b9\u30c8 \u30e4\u30ae\u306b\u3064\u3044\u3066\u3054\u8cea\u554f\u3001\u3054\u63d0\u6848\u3001\u307e\u305f\u306f\u304a\u554f\u3044\u5408\u308f\u305b\u304c\u3042\u308a\u307e\u3059\u304b\uff1f\u3076\u3072\u304a\u805e\u304b\u305b\u304f\u3060\u3055\u3044\u3002\u4e0b\u8a18\u306e\u30e1\u30fc\u30eb\u30a2\u30c9\u30ec\u30b9\u307e\u3067\u3054\u9023\u7d61\u304f\u3060\u3055\u3044\u3002\u3067\u304d\u308b\u9650\u308a\u304a\u624b\u4f1d\u3044\u3057\u307e\u3059\u3002" },
  ko: { eyebrow: "\ubb38\uc758\ud558\uae30", heading: "\ud0c0\uc774\ud53c\ud551 \ud14c\uc2a4\ud2b8 \uc5fc\uc18c \ubb38\uc758", intro: "\ud0c0\uc774\ud53c\ud551 \ud14c\uc2a4\ud2b8 \uc5fc\uc18c\uc5d0 \ub300\ud574 \uc9c8\ubb38, \uc81c\uc548 \ub610\ub294 \ubb38\uc758\uc0ac\ud56d\uc774 \uc788\uc73c\uc2e0\uac00\uc694? \uc5b8\uc81c\ub4e0\uc9c0 \ub9d0\uc500\ud574 \uc8fc\uc138\uc694. \uc544\ub798 \uc774\uba54\uc77c \uc8fc\uc18c\ub85c \uc5f0\ub77d \uc8fc\uc2dc\uba74 \ucd5c\uc120\uc744 \ub2e4\ud574 \ub3c4\uc640\ub4dc\ub9ac\uaca0\uc2b5\ub2c8\ub2e4." },
};

export default function ContactPage({ locale = "en" as Locale }: { locale?: Locale }) {
  const t = TEXT[locale] ?? TEXT.en;
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[24px] border border-hairline bg-canvas p-6 text-center shadow-sm sm:p-10">
        <p className="font-label text-accent">{t.eyebrow}</p>
        <h1 className="mt-3 font-heading-3 text-ink">{t.heading}</h1>
        <p className="mx-auto mt-6 max-w-2xl font-body text-text-muted">{t.intro}</p>
        <a href="mailto:typeittestit@gmail.com" className="mt-8 inline-flex items-center rounded-full border border-hairline bg-canvas-soft px-8 py-4 font-link text-ink transition-colors duration-200 hover:border-text-muted hover:bg-canvas">
          typeittestit@gmail.com
        </a>
      </div>
    </section>
  );
}
