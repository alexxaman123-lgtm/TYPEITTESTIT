import type { Locale } from "../lib/i18n";
import type { Difficulty, Passage } from "./texts";
import { getRandomPassage } from "./texts";

type PassageSet = Record<Difficulty, Passage[]>;

// One sample passage per difficulty for each of the 11 locales that are not
// English or Spanish (those two already have their own larger passage pools
// in texts.ts and spanishTexts.ts). This is a smaller pool than en/es for
// now, but it means every localized page gets typing text in its own
// language instead of silently reusing whatever locale was last selected.
const de: PassageSet = {
  easy: [
    {
      id: "de-easy-1",
      difficulty: "easy",
      title: "Jeden Tag ein wenig üben",
      text: `Das Tippen macht Spaß, wenn man jeden Tag ein wenig übt. Finde deine Position auf der Tastatur und achte auf deine Haltung. Mit der Zeit wirst du schneller und machst weniger Fehler. Konzentriere dich zuerst darauf, die richtigen Tasten zu treffen, bevor du an Geschwindigkeit denkst. Kleine, regelmäßige Übungen bringen mehr als seltene, lange Sitzungen.`,
    },
  ],
  medium: [
    {
      id: "de-medium-1",
      difficulty: "medium",
      title: "Der Weg zu mehr Genauigkeit",
      text: `Regelmäßiges Üben ist der Schlüssel zu einem schnellen und genauen Schreibstil. Viele Menschen schauen noch auf die Tastatur, aber mit der Zeit lernt man, die Finger automatisch zu den richtigen Tasten zu bewegen. Konzentriere dich zuerst auf Genauigkeit, dann kommt die Geschwindigkeit von selbst. Ein ruhiger Sitzplatz, eine entspannte Haltung und kurze Pausen helfen dabei, über längere Zeit konzentriert zu bleiben.`,
    },
  ],
  hard: [
    {
      id: "de-hard-1",
      difficulty: "hard",
      title: "Geschwindigkeit und Zuverlässigkeit",
      text: `Wer seine Tippgeschwindigkeit deutlich verbessern möchte, sollte nicht nur auf die Anzahl der Anschläge pro Minute achten, sondern auch auf die Fehlerquote, denn ständiges Korrigieren kostet mehr Zeit als langsames, aber präzises Schreiben. Mit täglichem Training, guter Sitzhaltung und einem Blick weg von der Tastatur entwickelt sich mit der Zeit ein natürlicher Rhythmus, der sowohl schnell als auch zuverlässig ist, selbst wenn der Text ungewohnte Wörter oder Satzzeichen enthält.`,
    },
  ],
};

const fr: PassageSet = {
  easy: [
    {
      id: "fr-easy-1",
      difficulty: "easy",
      title: "Un peu de pratique chaque jour",
      text: `Taper au clavier devient plus facile avec un peu de pratique chaque jour. Garde les doigts sur les bonnes touches et respire calmement. Avec le temps, tu deviendras plus rapide et plus précis. Concentre-toi d'abord sur les bonnes touches avant de penser à la vitesse. De courtes séances régulières valent mieux que de longues séances rares.`,
    },
  ],
  medium: [
    {
      id: "fr-medium-1",
      difficulty: "medium",
      title: "Le chemin vers plus de précision",
      text: `La pratique régulière est essentielle pour taper plus vite et avec moins d'erreurs. Beaucoup de personnes regardent encore le clavier, mais peu à peu les doigts apprennent à trouver les touches sans y penser. Concentre-toi d'abord sur la précision, la vitesse viendra ensuite naturellement. Une posture détendue et de courtes pauses aident à rester concentré plus longtemps.`,
    },
  ],
  hard: [
    {
      id: "fr-hard-1",
      difficulty: "hard",
      title: "Vitesse et fiabilité",
      text: `Pour améliorer réellement sa vitesse de frappe, il ne suffit pas de compter le nombre de caractères par minute; il faut aussi surveiller son taux d'erreurs, car corriger sans cesse prend souvent plus de temps qu'écrire lentement mais correctement. Avec un entraînement quotidien, une bonne posture et un regard détaché du clavier, un rythme naturel se développe, à la fois rapide et fiable, même face à des mots inhabituels ou une ponctuation complexe.`,
    },
  ],
};

const it: PassageSet = {
  easy: [
    {
      id: "it-easy-1",
      difficulty: "easy",
      title: "Un po' di pratica ogni giorno",
      text: `Digitare diventa più facile con un po' di pratica ogni giorno. Tieni le dita sui tasti giusti e respira con calma. Con il tempo diventerai più veloce e più preciso. Concentrati prima sui tasti corretti, poi pensa alla velocità. Brevi sessioni regolari valgono più di lunghe sessioni occasionali.`,
    },
  ],
  medium: [
    {
      id: "it-medium-1",
      difficulty: "medium",
      title: "La strada verso una maggiore precisione",
      text: `La pratica costante è fondamentale per scrivere più velocemente e con meno errori. Molte persone guardano ancora la tastiera, ma poco a poco le dita imparano a trovare i tasti senza pensarci. Concentrati prima sulla precisione, la velocità arriverà naturalmente dopo. Una postura rilassata e brevi pause aiutano a restare concentrati più a lungo.`,
    },
  ],
  hard: [
    {
      id: "it-hard-1",
      difficulty: "hard",
      title: "Velocità e affidabilità",
      text: `Per migliorare davvero la velocità di scrittura non basta contare i caratteri al minuto; bisogna anche osservare il tasso di errori, perché correggere continuamente richiede spesso più tempo che scrivere lentamente ma con attenzione. Con un allenamento quotidiano, una buona postura e lo sguardo lontano dalla tastiera, si sviluppa un ritmo naturale, sia veloce che affidabile, anche davanti a parole insolite o punteggiatura complessa.`,
    },
  ],
};

const pt: PassageSet = {
  easy: [
    {
      id: "pt-easy-1",
      difficulty: "easy",
      title: "Um pouco de prática todos os dias",
      text: `Digitar fica mais fácil com um pouco de prática todos os dias. Mantenha os dedos nas teclas certas e respire com calma. Com o tempo você ficará mais rápido e mais preciso. Foque primeiro nas teclas corretas antes de pensar na velocidade. Sessões curtas e regulares valem mais do que sessões longas e raras.`,
    },
  ],
  medium: [
    {
      id: "pt-medium-1",
      difficulty: "medium",
      title: "O caminho para mais precisão",
      text: `A prática regular é essencial para digitar mais rápido e com menos erros. Muitas pessoas ainda olham para o teclado, mas pouco a pouco os dedos aprendem a encontrar as teclas sem pensar. Concentre-se primeiro na precisão, a velocidade vem depois naturalmente. Uma postura relaxada e pausas curtas ajudam a manter o foco por mais tempo.`,
    },
  ],
  hard: [
    {
      id: "pt-hard-1",
      difficulty: "hard",
      title: "Velocidade e confiabilidade",
      text: `Para melhorar de verdade a velocidade de digitação, não basta contar os caracteres por minuto; é preciso também observar a taxa de erros, pois corrigir continuamente costuma levar mais tempo do que escrever devagar e com atenção. Com treino diário, boa postura e o olhar afastado do teclado, desenvolve-se um ritmo natural, rápido e confiável, mesmo diante de palavras pouco comuns ou pontuação mais complexa.`,
    },
  ],
};

const pl: PassageSet = {
  easy: [
    {
      id: "pl-easy-1",
      difficulty: "easy",
      title: "Odrobina codziennej praktyki",
      text: `Pisanie na klawiaturze staje się łatwiejsze z odrobiną codziennej praktyki. Trzymaj palce na właściwych klawiszach i oddychaj spokojnie. Z czasem będziesz pisać szybciej i dokładniej. Skup się najpierw na właściwych klawiszach, a dopiero potem na szybkości. Krótkie, regularne sesje dają więcej niż rzadkie, długie sesje.`,
    },
  ],
  medium: [
    {
      id: "pl-medium-1",
      difficulty: "medium",
      title: "Droga do większej dokładności",
      text: `Regularna praktyka jest kluczem do szybszego i dokładniejszego pisania. Wiele osób wciąż patrzy na klawiaturę, ale z czasem palce uczą się znajdować klawisze bez zastanowienia. Skup się najpierw na dokładności, prędkość przyjdzie naturalnie później. Rozluźniona postawa i krótkie przerwy pomagają zachować koncentrację na dłużej.`,
    },
  ],
  hard: [
    {
      id: "pl-hard-1",
      difficulty: "hard",
      title: "Szybkość i pewność",
      text: `Aby naprawdę zwiększyć szybkość pisania, nie wystarczy liczyć znaków na minutę; trzeba też obserwować liczbę błędów, ponieważ nieustanne poprawianie zwykle zajmuje więcej czasu niż wolne, ale dokładne pisanie. Dzięki codziennemu treningowi, dobrej postawie i wzrokowi oderwanemu od klawiatury z czasem wykształca się naturalny rytm, który jest jednocześnie szybki i pewny, nawet gdy tekst zawiera nietypowe słowa lub znaki interpunkcyjne.`,
    },
  ],
};

const tr: PassageSet = {
  easy: [
    {
      id: "tr-easy-1",
      difficulty: "easy",
      title: "Her gün biraz pratik",
      text: `Her gün biraz pratik yaparak klavyede yazmak kolaylaşır. Parmaklarını doğru tuşlarda tut ve sakin nefes al. Zamanla daha hızlı ve daha doğru yazacaksın. Önce doğru tuşlara odaklan, hızı sonra düşün. Kısa ve düzenli çalışmalar, uzun ve seyrek çalışmalardan daha faydalıdır.`,
    },
  ],
  medium: [
    {
      id: "tr-medium-1",
      difficulty: "medium",
      title: "Daha fazla doğruluğa giden yol",
      text: `Düzenli pratik, daha hızlı ve daha az hatayla yazmanın anahtarıdır. Birçok kişi hâlâ klavyeye bakar, ama zamanla parmaklar tuşları düşünmeden bulmayı öğrenir. Önce doğruluğa odaklan, hız zamanla kendiliğinden gelir. Rahat bir oturuş ve kısa aralar, daha uzun süre odaklanmayı kolaylaştırır.`,
    },
  ],
  hard: [
    {
      id: "tr-hard-1",
      difficulty: "hard",
      title: "Hız ve güvenilirlik",
      text: `Yazma hızını gerçekten artırmak için sadece dakikadaki karakter sayısını saymak yeterli değildir; hata oranını da izlemek gerekir, çünkü sürekli düzeltme yapmak genellikle yavaş ama dikkatli yazmaktan daha fazla zaman alır. Günlük antrenman, iyi bir oturuş ve klavyeden uzak bir bakışla zamanla hem hızlı hem de güvenilir doğal bir ritim gelişir, alışılmadık kelimeler veya noktalama işaretleri olsa bile.`,
    },
  ],
};

const uk: PassageSet = {
  easy: [
    {
      id: "uk-easy-1",
      difficulty: "easy",
      title: "Трохи практики щодня",
      text: `Друкувати на клавіатурі стає легше з невеликою щоденною практикою. Тримай пальці на потрібних клавішах і дихай спокійно. З часом ти друкуватимеш швидше і точніше. Спочатку зосередься на правильних клавішах, а швидкість прийде пізніше. Короткі регулярні заняття кращі за рідкі довгі.`,
    },
  ],
  medium: [
    {
      id: "uk-medium-1",
      difficulty: "medium",
      title: "Шлях до більшої точності",
      text: `Регулярна практика — це ключ до швидшого й точнішого друку. Багато людей досі дивляться на клавіатуру, але поступово пальці навчаються знаходити клавіші без роздумів. Спочатку зосередься на точності, швидкість прийде природно пізніше. Розслаблена поза та короткі перерви допомагають довше залишатися зосередженим.`,
    },
  ],
  hard: [
    {
      id: "uk-hard-1",
      difficulty: "hard",
      title: "Швидкість і надійність",
      text: `Щоб дійсно підвищити швидкість друку, недостатньо просто рахувати символи за хвилину; потрібно також стежити за кількістю помилок, бо постійні виправлення часто забирають більше часу, ніж повільне, але уважне друкування. Завдяки щоденним тренуванням, правильній поставі та поглядом, відірваним від клавіатури, з часом формується природний ритм, швидкий і надійний одночасно, навіть коли текст містить незвичні слова чи розділові знаки.`,
    },
  ],
};

const id: PassageSet = {
  easy: [
    {
      id: "id-easy-1",
      difficulty: "easy",
      title: "Sedikit latihan setiap hari",
      text: `Mengetik menjadi lebih mudah dengan sedikit latihan setiap hari. Jaga jari-jarimu tetap di tombol yang benar dan bernapaslah dengan tenang. Seiring waktu kamu akan mengetik lebih cepat dan lebih akurat. Fokuslah dulu pada tombol yang benar sebelum memikirkan kecepatan. Latihan singkat dan teratur lebih berguna daripada latihan panjang yang jarang dilakukan.`,
    },
  ],
  medium: [
    {
      id: "id-medium-1",
      difficulty: "medium",
      title: "Jalan menuju akurasi yang lebih baik",
      text: `Latihan rutin adalah kunci untuk mengetik lebih cepat dan dengan lebih sedikit kesalahan. Banyak orang masih melihat ke keyboard, tetapi perlahan jari-jari belajar menemukan tombol tanpa berpikir. Fokuslah dulu pada akurasi, kecepatan akan datang secara alami setelahnya. Postur yang santai dan istirahat singkat membantu menjaga fokus lebih lama.`,
    },
  ],
  hard: [
    {
      id: "id-hard-1",
      difficulty: "hard",
      title: "Kecepatan dan keandalan",
      text: `Untuk benar-benar meningkatkan kecepatan mengetik, tidak cukup hanya menghitung jumlah karakter per menit; kamu juga harus memperhatikan tingkat kesalahan, karena terus-menerus mengoreksi biasanya memakan lebih banyak waktu daripada mengetik dengan lambat tetapi teliti. Dengan latihan harian, postur tubuh yang baik, dan pandangan yang lepas dari keyboard, seiring waktu berkembang ritme alami yang cepat sekaligus andal, bahkan saat teksnya berisi kata atau tanda baca yang tidak biasa.`,
    },
  ],
};

const zh: PassageSet = {
  easy: [
    {
      id: "zh-easy-1",
      difficulty: "easy",
      title: "每天一点点练习",
      text: `每天稍微练习一下,打字就会变得更容易。把手指放在正确的按键上,平静地呼吸。慢慢地,你会打得更快也更准确。先专注于按对键,再考虑速度。短而规律的练习比偶尔的长时间练习更有效。`,
    },
  ],
  medium: [
    {
      id: "zh-medium-1",
      difficulty: "medium",
      title: "通往更高准确度的道路",
      text: `持续的练习是打字又快又准的关键。很多人还在看着键盘,但渐渐地手指会学会不用思考就找到按键。先专注于准确性,速度自然会随之提高。放松的坐姿和短暂的休息有助于长时间保持专注。`,
    },
  ],
  hard: [
    {
      id: "zh-hard-1",
      difficulty: "hard",
      title: "速度与可靠性",
      text: `要真正提高打字速度,不能只看每分钟输入的字符数,还要注意错误率,因为不断修改往往比慢而准确地打字花费更多时间。通过每天的练习、良好的坐姿以及不看键盘的习惯,一种既快速又可靠的自然节奏会逐渐形成,即使文本中出现不常见的词语或标点符号也是如此。`,
    },
  ],
};

const ja: PassageSet = {
  easy: [
    {
      id: "ja-easy-1",
      difficulty: "easy",
      title: "毎日少しずつ練習する",
      text: `毎日少しずつ練習すると、タイピングはどんどん簡単になります。正しいキーに指を置いて、落ち着いて呼吸しましょう。時間が経つと、もっと速く正確に打てるようになります。まずは正しいキーを打つことに集中し、その後で速さを考えましょう。短く規則的な練習は、まれに行う長い練習よりも効果的です。`,
    },
  ],
  medium: [
    {
      id: "ja-medium-1",
      difficulty: "medium",
      title: "より高い正確さへの道",
      text: `継続的な練習は、速く正確にタイピングするための鍵です。多くの人はまだキーボードを見ながら打ちますが、次第に指は考えなくてもキーを見つけられるようになります。まずは正確さに集中すれば、速さは自然についてきます。リラックスした姿勢と短い休憩は、集中力を長く保つのに役立ちます。`,
    },
  ],
  hard: [
    {
      id: "ja-hard-1",
      difficulty: "hard",
      title: "速度と信頼性",
      text: `タイピングの速度を本当に向上させるには、一分間に入力できる文字数だけを数えるのでは不十分で、エラー率にも注意を払う必要があります。なぜなら、絶えず修正することは、遅くても正確に入力することより時間がかかることが多いからです。毎日の練習と良い姿勢、そしてキーボードから視線を離す習慣によって、時間が経つにつれて速くて信頼できる自然なリズムが育っていきます。見慣れない単語や句読点が含まれていても同じです。`,
    },
  ],
};

const ko: PassageSet = {
  easy: [
    {
      id: "ko-easy-1",
      difficulty: "easy",
      title: "매일 조금씩 연습하기",
      text: `매일 조금씩 연습하면 타이핑이 점점 쉬워집니다. 손가락을 올바른 키 위에 두고 편안하게 숨을 쉬세요. 시간이 지나면 더 빠르고 정확하게 입력할 수 있게 됩니다. 먼저 올바른 키를 누르는 데 집중하고, 그 다음에 속도를 생각하세요. 짧고 규칙적인 연습이 드물고 긴 연습보다 더 효과적입니다.`,
    },
  ],
  medium: [
    {
      id: "ko-medium-1",
      difficulty: "medium",
      title: "더 높은 정확도로 가는 길",
      text: `꾸준한 연습은 더 빠르고 정확하게 타이핑하는 핵심입니다. 많은 사람들이 아직 키보드를 보면서 입력하지만, 점차 손가락은 생각하지 않고도 키를 찾는 법을 배웁니다. 먼저 정확성에 집중하면 속도는 자연스럽게 따라옵니다. 편안한 자세와 짧은 휴식은 더 오래 집중하는 데 도움이 됩니다.`,
    },
  ],
  hard: [
    {
      id: "ko-hard-1",
      difficulty: "hard",
      title: "속도와 신뢰성",
      text: `타이핑 속도를 정말로 향상시키려면 분당 입력하는 글자 수만 세는 것으로는 충분하지 않으며, 오류율도 살펴야 합니다. 계속해서 수정하는 것이 느리지만 정확하게 입력하는 것보다 더 많은 시간을 소모하는 경우가 많기 때문입니다. 매일의 연습과 좋은 자세, 그리고 키보드에서 시선을 떼는 습관을 통해 시간이 지나면서 빠르고 신뢰할 수 있는 자연스러운 리듬이 형성됩니다. 낯선 단어나 문장 부호가 있어도 마찬가지입니다.`,
    },
  ],
};

export const LOCALIZED_PASSAGES: Partial<Record<Locale, PassageSet>> = {
  de,
  fr,
  it,
  pt,
  pl,
  tr,
  uk,
  id,
  zh,
  ja,
  ko,
};

/**
 * Returns a random passage in the given locale's own language. Falls back to
 * the English pool (texts.ts) if the locale has no localized pool yet, so a
 * missing translation never silently falls back to a *different*
 * language's text (e.g. Spanish showing up on a Japanese page).
 */
export function getRandomLocalizedPassage(
  locale: Locale,
  difficulty: Difficulty,
  excludeId?: string,
): Passage {
  const pool = LOCALIZED_PASSAGES[locale]?.[difficulty];
  if (!pool || pool.length === 0) return getRandomPassage(difficulty, excludeId);
  const candidates = pool.filter((p) => p.id !== excludeId);
  const list = candidates.length > 0 ? candidates : pool;
  return list[Math.floor(Math.random() * list.length)];
}
