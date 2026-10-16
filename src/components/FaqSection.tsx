import type { Locale } from "../lib/i18n";

type Faq = { q: string; a: string };

export const FAQS_BY_LOCALE: Record<Locale, Faq[]> = {
  en: [
    {
      q: "What is a free typing test?",
      a: "A <strong>free typing test</strong> measures how quickly and accurately you can type by asking you to enter displayed text for a set amount of time. GOATTYPE reports useful results such as WPM, accuracy, errors, and words written, so you can understand both your pace and your control. The core test can be taken online without paying for access.",
    },
    {
      q: "How can I use this for typing test practice?",
      a: "Use the test as a repeatable <strong>typing test practice</strong> routine: choose a duration and difficulty, complete an attempt, review your WPM and accuracy, then try again after identifying areas to improve. Keeping the same settings for several sessions makes it easier to see genuine progress before increasing the difficulty or changing the duration.",
    },
    {
      q: "What is WPM in a typing test?",
      a: "WPM means <strong>words per minute</strong> and is a standard way to describe typing speed. The test uses the common five-character convention for a word, so your score is based on the amount of text typed relative to the time spent typing. WPM is most useful when considered together with accuracy rather than as a speed number on its own.",
    },
    {
      q: "How is typing accuracy calculated?",
      a: "Typing accuracy reflects how closely the characters you enter match the target text. Correct characters contribute to a higher accuracy result, while incorrect characters reduce it. Looking at accuracy alongside WPM helps you tell the difference between typing faster and typing efficiently, because a high-speed attempt with many mistakes is not necessarily a better performance.",
    },
    {
      q: "What is a good typing speed?",
      a: "There is no single WPM score that is right for everyone. A useful typing speed depends on the work you do, the difficulty of the text, and how accurately you can maintain the pace. Use the speed chart as a general reference, but compare your own results under similar conditions and aim for steady improvement without sacrificing accuracy.",
    },
    {
      q: "How long is the typing test?",
      a: "You can choose <strong>1, 2, 3, or 5 minute</strong> tests. A one minute typing test is convenient for a quick benchmark or daily warm-up. Two- and three-minute sessions give you more time to settle into a consistent rhythm, while a five-minute typing test is useful for practicing sustained pace and endurance.",
    },
    {
      q: "Is there a 1 minute typing test?",
      a: "Yes. The site includes a <strong>1 minute typing test</strong> that measures your performance over a short, focused session. It is useful when you want a quick speed check or a practice session that is easy to repeat. For a longer view of consistency, you can switch to the 2, 3, or 5 minute options.",
    },
    {
      q: "Can I take the typing test online for free?",
      a: "Yes. GOATTYPE provides an <strong>online typing test</strong> that runs in a modern web browser. You do not need to install separate typing software to complete the standard test, and the core typing experience is available without a paid subscription.",
    },
    {
      q: "Can I use this as an English typing test?",
      a: "Yes. The standard passages are in English, so the homepage can be used as an <strong>English typing test</strong> for measuring speed and accuracy while typing English text. It is also useful for keyboard practice because the exercise takes place directly in the browser using your keyboard.",
    },
    {
      q: "Can children and adults use this typing test?",
      a: "Yes. The test is suitable for beginners, students, adults, and professionals who want to measure or practice keyboard skills. Beginners can start with the Easy difficulty, while experienced typists can choose Medium or Hard. Shorter sessions can be convenient for younger learners or anyone who prefers brief practice periods.",
    },
    {
      q: "Can I use my own text for typing practice?",
      a: "Yes. The homepage includes a <strong>custom typing test</strong> option that lets you paste your own text and practice with it. This can be useful when you want to work with material that resembles what you type for school, work, writing, or another specific task instead of using the standard passages.",
    },
    {
      q: "Do I need an account to take a typing test?",
      a: "No. You can take the standard typing test without signing in. Account features are available for users who want to save qualifying progress and participate in the public leaderboard, but an account is not required simply to practice or check your typing speed.",
    },
    {
      q: "Can I save my typing results?",
      a: "Account features can save qualifying progress and leaderboard results. Anonymous test sessions are not saved to an account. If you want to compare your performance over time, using an account and keeping your practice conditions consistent can make those comparisons more useful.",
    },
    {
      q: "How can I improve my typing speed?",
      a: "Practice regularly and prioritize accuracy before trying to increase your pace. Keep your hands relaxed, work on recurring mistakes, and use a consistent test duration when comparing results. A useful goal is to gradually raise WPM while keeping accuracy stable or improving it. Repeated short sessions can be easier to maintain than occasional long practice sessions.",
    },
    {
      q: "Does GOATTYPE provide a typing certificate?",
      a: "No. GOATTYPE currently focuses on measuring and practicing typing speed rather than issuing a typing certificate. Your results can show performance metrics such as WPM and accuracy, but the site should not be treated as a certification service.",
    },
    {
      q: "Is there a 5 minute typing test?",
      a: "Yes. GOATTYPE includes a <strong>5 minute typing test</strong> for practicing sustained typing speed and endurance. Longer sessions reveal whether you can hold your pace after the initial burst, which makes the 5-minute option a useful complement to the quicker 1, 2, and 3 minute tests.",
    },
    {
      q: "Is this a live typing test?",
      a: "Yes. It works as a <strong>live typing test</strong>: your WPM, accuracy, and errors update in real time as you type, and the result panel summarizes everything the moment the timer ends.",
    },
  ],
  es: [
    { q: "\u00bfC\u00f3mo aprender mecanograf\u00eda f\u00e1cil y r\u00e1pido?", a: "La forma m\u00e1s eficaz de aprender mecanograf\u00eda es practicar de manera constante, empezar con precisi\u00f3n y acostumbrar los dedos a las teclas sin mirar el teclado. Las sesiones cortas y repetidas con un test de mecanograf\u00eda ayudan a crear memoria muscular y mejorar poco a poco la velocidad." },
    { q: "\u00bfQu\u00e9 hace un mecan\u00f3grafo?", a: "Un mecan\u00f3grafo escribe textos con un teclado de forma r\u00e1pida y precisa. La mecanograf\u00eda se utiliza en tareas de oficina, estudio, atenci\u00f3n al cliente, programaci\u00f3n y cualquier actividad que requiera introducir texto con frecuencia." },
    { q: "\u00bfQu\u00e9 significa mecanografiado?", a: "Mecanografiado significa que un texto ha sido escrito mediante un teclado. La mecanograf\u00eda se refiere a la t\u00e9cnica y pr\u00e1ctica de escribir de forma eficiente con el teclado." },
    { q: "\u00bfCu\u00e1nto tiempo se tarda en aprender mecanograf\u00eda?", a: "El tiempo depende de tu experiencia y de la frecuencia con la que practiques. Con sesiones regulares puedes mejorar la precisi\u00f3n y la velocidad de forma gradual; lo m\u00e1s importante es practicar de manera constante en lugar de intentar alcanzar una velocidad m\u00e1xima desde el principio." },
    { q: "\u00bfCu\u00e1les son los 5 mejores programas para aprender mecanograf\u00eda?", a: "La mejor herramienta depende del tipo de pr\u00e1ctica que buscas. Para medir velocidad, precisi\u00f3n y progreso, un test de mecanograf\u00eda online ofrece una forma sencilla de comprobar tu rendimiento en sesiones de duraci\u00f3n controlada." },
    { q: "\u00bfQu\u00e9 ejercicios puedo hacer para practicar mecanograf\u00eda?", a: "Puedes practicar con palabras frecuentes, frases, textos variados y pruebas cronometradas. Alternar ejercicios de precisi\u00f3n con un test de mecanograf\u00eda de 1, 2, 3 o 5 minutos ayuda a trabajar tanto el control como la velocidad." },
    { q: "\u00bfCu\u00e1ntos tipos de mecanograf\u00eda hay?", a: "La pr\u00e1ctica de mecanograf\u00eda puede variar seg\u00fan la t\u00e9cnica, el teclado y el objetivo. Por ejemplo, puedes trabajar mecanograf\u00eda t\u00e1ctil, velocidad, precisi\u00f3n, teclado num\u00e9rico o diferentes distribuciones de teclado." },
    { q: "\u00bfCu\u00e1l es la mejor forma de aprender mecanograf\u00eda?", a: "Una buena estrategia es aprender la posici\u00f3n de las teclas, utilizar los dedos de forma consistente, priorizar la precisi\u00f3n y practicar con regularidad. Un test de mecanograf\u00eda te permite medir si tu velocidad y precisi\u00f3n mejoran con el tiempo." },
    { q: "\u00bfQu\u00e9 beneficios trae la mecanograf\u00eda?", a: "Una mejor t\u00e9cnica de mecanograf\u00eda puede ayudarte a escribir con m\u00e1s fluidez, reducir errores, trabajar con mayor eficiencia y sentirte m\u00e1s c\u00f3modo al utilizar un teclado durante periodos largos." },
    { q: "\u00bfC\u00f3mo escribir en mecanograf\u00eda?", a: "Coloca las manos de forma estable, utiliza los dedos de manera consistente y evita mirar continuamente el teclado. Empieza a un ritmo que puedas controlar y aumenta la velocidad cuando tu precisi\u00f3n sea estable." },
    { q: "\u00bfCu\u00e1l es el origen de la mecanograf\u00eda?", a: "La mecanograf\u00eda moderna se desarroll\u00f3 junto con las m\u00e1quinas de escribir y posteriormente con los teclados de ordenador. Las t\u00e9cnicas actuales de escritura al tacto evolucionaron para facilitar una entrada de texto r\u00e1pida y sistem\u00e1tica." },
    { q: "\u00bfCu\u00e1les son las t\u00e9cnicas de mecanograf\u00eda?", a: "Entre las t\u00e9cnicas m\u00e1s habituales est\u00e1n la escritura al tacto, la pr\u00e1ctica por filas del teclado, los ejercicios centrados en precisi\u00f3n y los ejercicios de velocidad. La t\u00e9cnica adecuada depende del teclado y del objetivo de cada persona." },
    { q: "¿Hay un test de mecanografía de 5 minutos?", a: "Sí. GOATTYPE incluye un <strong>test de mecanografía de 5 minutos</strong> para practicar la velocidad sostenida y la resistencia. Las sesiones largas muestran si puedes mantener el ritmo después del impulso inicial, por lo que es un buen complemento de las pruebas de 1, 2 y 3 minutos." },
    { q: "¿Es un test de mecanografía en vivo?", a: "Sí. Funciona como un <strong>test de mecanografía en vivo</strong>: tu WPM, precisión y errores se actualizan en tiempo real mientras escribes, y el panel de resultados resume todo al terminar el cronómetro." },
  ],
  de: [
    { q: "Was ist ein kostenloser Schreibtest?", a: "Ein <strong>kostenloser Schreibtest</strong> misst, wie schnell und genau du auf einer Tastatur tippen kannst, indem du einen angezeigten Text innerhalb einer festgelegten Zeit eingibst. GOATTYPE zeigt dir WPM, Genauigkeit, Fehler und weitere Kennzahlen, damit du Tempo und Kontrolle gemeinsam beurteilen kannst." },
    { q: "Wie kann ich effektiv Tippen \u00fcben?", a: "Nutze den Test als wiederholbare <strong>Tipp\u00fcbung</strong>: W\u00e4hle Dauer und Schwierigkeit, mach einen Versuch, pr\u00fcfe WPM und Genauigkeit und wiederhole es danach. Gleiche Einstellungen \u00fcber mehrere Sitzungen zu behalten macht echten Fortschritt sichtbar." },
    { q: "Was bedeutet WPM?", a: "WPM steht f\u00fcr <strong>W\u00f6rter pro Minute</strong> und ist die g\u00e4ngigste Art, die Tippgeschwindigkeit zu beschreiben. Der Test verwendet die \u00fcbliche Konvention von f\u00fcnf Zeichen pro Wort, sodass sich dein Ergebnis auf die getippte Textmenge im Verh\u00e4ltnis zur Zeit bezieht." },
    { q: "Wie wird die Tippgenauigkeit berechnet?", a: "Die Genauigkeit zeigt, wie genau deine eingegebenen Zeichen mit dem Zieltext \u00fcbereinstimmen. Richtige Zeichen erh\u00f6hen die Genauigkeit, Fehler senken sie. WPM zusammen mit Genauigkeit zu betrachten zeigt, ob du wirklich effizient tippst." },
    { q: "Was ist eine gute Tippgeschwindigkeit?", a: "Es gibt keinen einzelnen WPM-Wert, der f\u00fcr alle passt. Eine gute Geschwindigkeit h\u00e4ngt von deiner Aufgabe, der Textschwierigkeit und deiner Genauigkeit ab. Nutze die Geschwindigkeitstabelle als Richtwert und vergleiche eigene Ergebnisse unter \u00e4hnlichen Bedingungen." },
    { q: "Gibt es einen 5-Minuten-Schreibtest?", a: "Ja. GOATTYPE bietet einen <strong>5-Minuten-Schreibtest</strong> für ausdauerndes Tippen und konstante Geschwindigkeit. Längere Sitzungen zeigen, ob du dein Tempo nach dem Start halten kannst – eine gute Ergänzung zu den 1-, 2- und 3-Minuten-Tests." },
    { q: "Ist das ein Live-Schreibtest?", a: "Ja. Es funktioniert wie ein <strong>Live-Schreibtest</strong>: WPM, Genauigkeit und Fehler werden beim Tippen in Echtzeit aktualisiert, und die Ergebnisseite fasst alles zusammen, sobald der Timer endet." },
    { q: "Wie kann ich schneller tippen lernen?", a: "Konzentriere dich zuerst auf Genauigkeit – die Geschwindigkeit kommt mit regelmäßigem Training. Nutze den <strong>Schreibtest</strong> täglich in kurzen Sitzungen, vergleiche deine Ergebnisse bei gleichen Einstellungen und erhöhe die Schwierigkeit, sobald du dich sicher fühlst." },
  ],
  fr: [
    { q: "Qu'est-ce qu'un test de frappe gratuit ?", a: "Un <strong>test de frappe gratuit</strong> mesure la vitesse et la pr\u00e9cision avec lesquelles vous tapez sur un clavier, en vous demandant de saisir un texte affich\u00e9 pendant une dur\u00e9e d\u00e9termin\u00e9e. GOATTYPE affiche votre WPM, votre pr\u00e9cision, vos erreurs et d'autres statistiques utiles." },
    { q: "Comment m'entra\u00eener efficacement \u00e0 la frappe ?", a: "Utilisez le test comme une routine d'<strong>entra\u00eenement \u00e0 la frappe</strong> r\u00e9p\u00e9table\u00a0: choisissez une dur\u00e9e et une difficult\u00e9, faites un essai, consultez votre WPM et votre pr\u00e9cision, puis recommencez. Garder les m\u00eames r\u00e9glages sur plusieurs s\u00e9ances permet de voir de vrais progr\u00e8s." },
    { q: "Que signifie WPM ?", a: "WPM signifie <strong>mots par minute</strong> et c'est la fa\u00e7on la plus courante de d\u00e9crire la vitesse de frappe. Le test utilise la convention standard de cinq caract\u00e8res par mot, donc votre score d\u00e9pend du texte tap\u00e9 par rapport au temps pass\u00e9." },
    { q: "Comment la pr\u00e9cision de frappe est-elle calcul\u00e9e ?", a: "La pr\u00e9cision refl\u00e8te \u00e0 quel point les caract\u00e8res saisis correspondent au texte cible. Les caract\u00e8res corrects augmentent la pr\u00e9cision, les erreurs la r\u00e9duisent. Regarder le WPM et la pr\u00e9cision ensemble montre si vous tapez r\u00e9ellement de fa\u00e7on efficace." },
    { q: "Quelle est une bonne vitesse de frappe ?", a: "Il n'existe pas un seul score WPM valable pour tout le monde. Une bonne vitesse d\u00e9pend de votre t\u00e2che, de la difficult\u00e9 du texte et de votre pr\u00e9cision. Utilisez le tableau de vitesse comme rep\u00e8re et comparez vos propres r\u00e9sultats dans des conditions similaires." },
    { q: "Existe-t-il un test de frappe de 5 minutes ?", a: "Oui. GOATTYPE propose un <strong>test de frappe de 5 minutes</strong> pour travailler la vitesse soutenue et l'endurance. Les sessions longues montrent si vous gardez votre rythme après le départ, en complément des tests de 1, 2 et 3 minutes." },
    { q: "Est-ce un test de frappe en direct ?", a: "Oui. Il fonctionne comme un <strong>test de frappe en direct</strong> : le WPM, la précision et les erreurs s'actualisent en temps réel pendant la frappe, et le panneau de résultats résume tout à la fin du chronomètre." },
    { q: "Comment taper plus vite au clavier ?", a: "Concentrez-vous d'abord sur la précision, la vitesse viendra avec une pratique régulière. Utilisez le <strong>test de frappe</strong> chaque jour en sessions courtes, comparez vos résultats à réglages égaux et augmentez la difficulté quand vous êtes à l'aise." },
  ],
  it: [
    { q: "Cos'\u00e8 un test di digitazione gratuito?", a: "Un <strong>test di digitazione gratuito</strong> misura quanto velocemente e con precisione digiti su una tastiera, chiedendoti di inserire un testo visualizzato per un tempo stabilito. GOATTYPE mostra il tuo WPM, la precisione, gli errori e altre statistiche utili." },
    { q: "Come posso allenarmi efficacemente alla digitazione?", a: "Usa il test come routine di <strong>esercizio di digitazione</strong> ripetibile: scegli durata e difficolt\u00e0, completa un tentativo, controlla WPM e precisione, poi riprova. Mantenere le stesse impostazioni per pi\u00f9 sessioni rende visibili i progressi reali." },
    { q: "Cosa significa WPM?", a: "WPM significa <strong>parole al minuto</strong> ed \u00e8 il modo pi\u00f9 comune per descrivere la velocit\u00e0 di digitazione. Il test usa la convenzione standard di cinque caratteri per parola, quindi il punteggio dipende dal testo digitato rispetto al tempo impiegato." },
    { q: "Come si calcola la precisione di digitazione?", a: "La precisione riflette quanto i caratteri digitati corrispondono al testo target. I caratteri corretti aumentano la precisione, gli errori la riducono. Guardare WPM e precisione insieme mostra se stai digitando in modo davvero efficiente." },
    { q: "Qual \u00e8 una buona velocit\u00e0 di digitazione?", a: "Non esiste un punteggio WPM unico valido per tutti. Una buona velocit\u00e0 dipende dal compito, dalla difficolt\u00e0 del testo e dalla tua precisione. Usa la tabella delle velocit\u00e0 come riferimento e confronta i tuoi risultati in condizioni simili." },
    { q: "C'è un test di digitazione da 5 minuti?", a: "Sì. GOATTYPE include un <strong>test di digitazione da 5 minuti</strong> per allenare velocità sostenuta e resistenza. Le sessioni lunghe mostrano se riesci a mantenere il ritmo dopo l'inizio, a complemento dei test da 1, 2 e 3 minuti." },
    { q: "È un test di digitazione in tempo reale?", a: "Sì. Funziona come un <strong>test di digitazione in tempo reale</strong>: WPM, precisione ed errori si aggiornano mentre digiti, e il pannello dei risultati riepiloga tutto alla fine del timer." },
    { q: "Come posso digitare più velocemente?", a: "Concentrati prima sulla precisione: la velocità arriverà con la pratica costante. Usa il <strong>test di digitazione</strong> ogni giorno in sessioni brevi, confronta i risultati a parità di impostazioni e aumenta la difficoltà quando ti senti sicuro." },
  ],
  pt: [
    { q: "O que \u00e9 um teste de digita\u00e7\u00e3o gratuito?", a: "Um <strong>teste de digita\u00e7\u00e3o gratuito</strong> mede a rapidez e a precis\u00e3o com que voc\u00ea digita em um teclado, pedindo que voc\u00ea digite um texto exibido durante um tempo definido. O GOATTYPE mostra seu WPM, precis\u00e3o, erros e outras m\u00e9tricas \u00fateis." },
    { q: "Como posso praticar digita\u00e7\u00e3o de forma eficaz?", a: "Use o teste como uma rotina repet\u00edvel de <strong>pr\u00e1tica de digita\u00e7\u00e3o</strong>: escolha dura\u00e7\u00e3o e dificuldade, complete uma tentativa, revise seu WPM e precis\u00e3o, e tente novamente. Manter as mesmas configura\u00e7\u00f5es por v\u00e1rias sess\u00f5es ajuda a ver o progresso real." },
    { q: "O que significa WPM?", a: "WPM significa <strong>palavras por minuto</strong> e \u00e9 a forma mais comum de descrever a velocidade de digita\u00e7\u00e3o. O teste usa a conven\u00e7\u00e3o padr\u00e3o de cinco caracteres por palavra, ent\u00e3o sua pontua\u00e7\u00e3o depende do texto digitado em rela\u00e7\u00e3o ao tempo gasto." },
    { q: "Como a precis\u00e3o de digita\u00e7\u00e3o \u00e9 calculada?", a: "A precis\u00e3o reflete o quanto os caracteres digitados correspondem ao texto alvo. Caracteres corretos aumentam a precis\u00e3o, erros a reduzem. Observar WPM e precis\u00e3o juntos mostra se voc\u00ea est\u00e1 digitando de forma realmente eficiente." },
    { q: "O que \u00e9 uma boa velocidade de digita\u00e7\u00e3o?", a: "N\u00e3o existe uma \u00fanica pontua\u00e7\u00e3o de WPM certa para todos. Uma boa velocidade depende da sua tarefa, da dificuldade do texto e da sua precis\u00e3o. Use a tabela de velocidade como refer\u00eancia e compare seus pr\u00f3prios resultados em condi\u00e7\u00f5es semelhantes." },
    { q: "Existe um teste de digitação de 5 minutos?", a: "Sim. O GOATTYPE inclui um <strong>teste de digitação de 5 minutos</strong> para praticar velocidade sustentada e resistência. Sessões longas mostram se você mantém o ritmo após o início, complementando os testes de 1, 2 e 3 minutos." },
    { q: "É um teste de digitação ao vivo?", a: "Sim. Funciona como um <strong>teste de digitação ao vivo</strong>: WPM, precisão e erros são atualizados em tempo real enquanto você digita, e o painel de resultados resume tudo ao fim do cronômetro." },
    { q: "Como digitar mais rápido no teclado?", a: "Concentre-se primeiro na precisão — a velocidade vem com a prática constante. Use o <strong>teste de digitação</strong> diariamente em sessões curtas, compare resultados com as mesmas configurações e aumente a dificuldade quando se sentir confortável." },
  ],
  pl: [
    { q: "Co to jest darmowy test pisania?", a: "<strong>Darmowy test pisania</strong> mierzy, jak szybko i dok\u0142adnie piszesz na klawiaturze, prosz\u0105c o wpisanie wy\u015bwietlonego tekstu w okre\u015blonym czasie. GOATTYPE pokazuje Twój WPM, dok\u0142adno\u015b\u0107, b\u0142\u0119dy i inne przydatne statystyki." },
    { q: "Jak efektywnie \u0107wiczy\u0107 pisanie?", a: "U\u017cyj testu jako powtarzalnej <strong>rutyny \u0107wiczenia pisania</strong>: wybierz czas trwania i poziom trudno\u015bci, wykonaj prób\u0119, sprawd\u017a WPM i dok\u0142adno\u015b\u0107, a potem powtórz. Zachowanie tych samych ustawie\u0144 przez kilka sesji pomaga zobaczy\u0107 realne post\u0119py." },
    { q: "Co znaczy WPM?", a: "WPM oznacza <strong>s\u0142owa na minut\u0119</strong> i jest najcz\u0119stszym sposobem opisywania szybko\u015bci pisania. Test wykorzystuje standardow\u0105 konwencj\u0119 pi\u0119ciu znaków na s\u0142owo, wi\u0119c wynik zale\u017cy od ilo\u015bci wpisanego tekstu w odniesieniu do czasu." },
    { q: "Jak obliczana jest dok\u0142adno\u015b\u0107 pisania?", a: "Dok\u0142adno\u015b\u0107 odzwierciedla, jak blisko wpisane znaki odpowiadaj\u0105 tekstowi docelowemu. Poprawne znaki zwi\u0119kszaj\u0105 dok\u0142adno\u015b\u0107, b\u0142\u0119dy j\u0105 zmniejszaj\u0105. Patrzenie na WPM i dok\u0142adno\u015b\u0107 razem pokazuje, czy naprawd\u0119 piszesz efektywnie." },
    { q: "Jaka jest dobra szybko\u015b\u0107 pisania?", a: "Nie ma jednego wyniku WPM odpowiedniego dla ka\u017cdego. Dobra szybko\u015b\u0107 zale\u017cy od zadania, trudno\u015bci tekstu i Twojej dok\u0142adno\u015bci. U\u017cyj tabeli szybko\u015bci jako punktu odniesienia i porównuj w\u0142asne wyniki w podobnych warunkach." },
    { q: "Czy jest 5-minutowy test pisania?", a: "Tak. GOATTYPE oferuje <strong>5-minutowy test pisania</strong> do treningu wytrzymałości i równego tempa. Dłuższe sesje pokazują, czy utrzymasz tempo po początkowym zrywie – to dobre uzupełnienie testów 1-, 2- i 3-minutowych." },
    { q: "Czy to test pisania na żywo?", a: "Tak. Działa jak <strong>test pisania na żywo</strong>: WPM, dokładność i błędy aktualizują się w czasie rzeczywistym podczas pisania, a panel wyników podsumowuje wszystko po zakończeniu odliczania." },
    { q: "Jak pisać szybciej na klawiaturze?", a: "Skup się najpierw na dokładności – szybkość przyjdzie z regularnym treningiem. Korzystaj z <strong>testu pisania</strong> codziennie w krótkich sesjach, porównuj wyniki przy tych samych ustawieniach i zwiększaj trudność, gdy poczujesz się pewnie." },
  ],
  tr: [
    { q: "\u00dccretsiz yazma testi nedir?", a: "<strong>\u00dccretsiz yazma testi</strong>, belirli bir s\u00fcre i\u00e7inde g\u00f6sterilen bir metni yazman\u0131 isteyerek klavyede ne kadar h\u0131zl\u0131 ve do\u011fru yazabildi\u011fini \u00f6l\u00e7er. GOATTYPE; WPM, do\u011fruluk, hata say\u0131s\u0131 ve di\u011fer yararl\u0131 istatistikleri g\u00f6sterir." },
    { q: "Yazmay\u0131 etkili \u015fekilde nas\u0131l pratik yapabilirim?", a: "Testi tekrarlanabilir bir <strong>yazma pratik</strong>i rutini olarak kullan: s\u00fcre ve zorluk se\u00e7, bir deneme tamamla, WPM ve do\u011frulu\u011funu incele, sonra tekrar dene. Ayn\u0131 ayarlar\u0131 birka\u00e7 oturum boyunca korumak ger\u00e7ek ilerlemeyi g\u00f6rmeyi kolayla\u015ft\u0131r\u0131r." },
    { q: "WPM ne anlama gelir?", a: "WPM, <strong>dakikadaki kelime say\u0131s\u0131</strong> anlam\u0131na gelir ve yazma h\u0131z\u0131n\u0131 tan\u0131mlaman\u0131n en yayg\u0131n yoludur. Test, kelime ba\u015f\u0131na be\u015f karakter kural\u0131n\u0131 kullan\u0131r, yani puan\u0131n yazd\u0131\u011f\u0131n metin miktar\u0131na ve ge\u00e7en s\u00fcreye ba\u011fl\u0131d\u0131r." },
    { q: "Yazma do\u011frulu\u011fu nas\u0131l hesaplan\u0131r?", a: "Do\u011fruluk, yazd\u0131\u011f\u0131n karakterlerin hedef metinle ne kadar \u00f6rt\u00fc\u015ft\u00fc\u011f\u00fcn\u00fc g\u00f6sterir. Do\u011fru karakterler do\u011frulu\u011fu art\u0131r\u0131r, hatalar azalt\u0131r. WPM ve do\u011frulu\u011fu birlikte incelemek ger\u00e7ekten verimli yaz\u0131p yazmad\u0131\u011f\u0131n\u0131 g\u00f6sterir." },
    { q: "\u0130yi bir yazma h\u0131z\u0131 nedir?", a: "Herkes i\u00e7in do\u011fru olan tek bir WPM puan\u0131 yoktur. \u0130yi bir h\u0131z g\u00f6revine, metnin zorlu\u011funa ve do\u011frulu\u011funa ba\u011fl\u0131d\u0131r. H\u0131z tablosunu referans olarak kullan ve kendi sonu\u00e7lar\u0131n\u0131 benzer ko\u015fullarda kar\u015f\u0131la\u015ft\u0131r." },
    { q: "5 dakikalık klavye hız testi var mı?", a: "Evet. GOATTYPE, kalıcı hız ve dayanıklılık için <strong>5 dakikalık klavye hız testi</strong> sunar. Uzun oturumlar, başlangıçtaki hızı koruyup koruyamadığını gösterir; 1, 2 ve 3 dakikalık testleri iyi tamamlar." },
    { q: "Bu canlı bir yazma testi mi?", a: "Evet. <strong>Canlı bir yazma testi</strong> gibi çalışır: yazarken WPM, doğruluk ve hatalar gerçek zamanlı güncellenir, süre bitince sonuç paneli her şeyi özetler." },
    { q: "Klavyede daha hızlı nasıl yazılır?", a: "Önce doğruluğa odaklan — hız düzenli pratikle gelir. <strong>Klavye hız testi</strong>ni her gün kısa oturumlarla kullan, aynı ayarlarla sonuçlarını karşılaştır ve rahat hissettiğinde zorluğu artır." },
  ],
  uk: [
    { q: "\u0429\u043e \u0442\u0430\u043a\u0435 \u0431\u0435\u0437\u043a\u043e\u0448\u0442\u043e\u0432\u043d\u0438\u0439 \u0442\u0435\u0441\u0442 \u043d\u0430\u0431\u043e\u0440\u0443 \u0442\u0435\u043a\u0441\u0442\u0443?", a: "<strong>\u0411\u0435\u0437\u043a\u043e\u0448\u0442\u043e\u0432\u043d\u0438\u0439 \u0442\u0435\u0441\u0442 \u043d\u0430\u0431\u043e\u0440\u0443 \u0442\u0435\u043a\u0441\u0442\u0443</strong> \u0432\u0438\u043c\u0456\u0440\u044e\u0454, \u044f\u043a \u0448\u0432\u0438\u0434\u043a\u043e \u0442\u0430 \u0442\u043e\u0447\u043d\u043e \u0432\u0438 \u043d\u0430\u0431\u0438\u0440\u0430\u0454\u0442\u0435 \u0442\u0435\u043a\u0441\u0442 \u043d\u0430 \u043a\u043b\u0430\u0432\u0456\u0430\u0442\u0443\u0440\u0456, \u043f\u0440\u043e\u043f\u043e\u043d\u0443\u044e\u0447\u0438 \u0432\u0432\u0435\u0441\u0442\u0438 \u043f\u043e\u043a\u0430\u0437\u0430\u043d\u0438\u0439 \u0442\u0435\u043a\u0441\u0442 \u0437\u0430 \u0432\u0438\u0437\u043d\u0430\u0447\u0435\u043d\u0438\u0439 \u0447\u0430\u0441. GOATTYPE \u043f\u043e\u043a\u0430\u0437\u0443\u0454 \u0432\u0430\u0448 WPM, \u0442\u043e\u0447\u043d\u0456\u0441\u0442\u044c, \u043f\u043e\u043c\u0438\u043b\u043a\u0438 \u0442\u0430 \u0456\u043d\u0448\u0456 \u043a\u043e\u0440\u0438\u0441\u043d\u0456 \u043f\u043e\u043a\u0430\u0437\u043d\u0438\u043a\u0438." },
    { q: "\u042f\u043a \u0435\u0444\u0435\u043a\u0442\u0438\u0432\u043d\u043e \u0442\u0440\u0435\u043d\u0443\u0432\u0430\u0442\u0438 \u043d\u0430\u0431\u0456\u0440 \u0442\u0435\u043a\u0441\u0442\u0443?", a: "\u0412\u0438\u043a\u043e\u0440\u0438\u0441\u0442\u043e\u0432\u0443\u0439\u0442\u0435 \u0442\u0435\u0441\u0442 \u044f\u043a \u043f\u043e\u0432\u0442\u043e\u0440\u044e\u0432\u0430\u043d\u0443 <strong>\u043f\u0440\u0430\u043a\u0442\u0438\u043a\u0443 \u043d\u0430\u0431\u043e\u0440\u0443 \u0442\u0435\u043a\u0441\u0442\u0443</strong>: \u0432\u0438\u0431\u0435\u0440\u0456\u0442\u044c \u0442\u0440\u0438\u0432\u0430\u043b\u0456\u0441\u0442\u044c \u0456 \u0440\u0456\u0432\u0435\u043d\u044c \u0441\u043a\u043b\u0430\u0434\u043d\u043e\u0441\u0442\u0456, \u0432\u0438\u043a\u043e\u043d\u0430\u0439\u0442\u0435 \u0441\u043f\u0440\u043e\u0431\u0443, \u043f\u0435\u0440\u0435\u0432\u0456\u0440\u0442\u0435 WPM \u0456 \u0442\u043e\u0447\u043d\u0456\u0441\u0442\u044c, \u0430 \u043f\u043e\u0442\u0456\u043c \u043f\u043e\u0432\u0442\u043e\u0440\u0456\u0442\u044c. \u0417\u0431\u0435\u0440\u0435\u0436\u0435\u043d\u043d\u044f \u043e\u0434\u043d\u0430\u043a\u043e\u0432\u0438\u0445 \u043d\u0430\u043b\u0430\u0448\u0442\u0443\u0432\u0430\u043d\u044c \u0434\u043e\u043f\u043e\u043c\u0430\u0433\u0430\u0454 \u0431\u0430\u0447\u0438\u0442\u0438 \u0440\u0435\u0430\u043b\u044c\u043d\u0438\u0439 \u043f\u0440\u043e\u0433\u0440\u0435\u0441." },
    { q: "\u0429\u043e \u043e\u0437\u043d\u0430\u0447\u0430\u0454 WPM?", a: "WPM \u043e\u0437\u043d\u0430\u0447\u0430\u0454 <strong>\u0441\u043b\u0456\u0432 \u0437\u0430 \u0445\u0432\u0438\u043b\u0438\u043d\u0443</strong> \u0456 \u0454 \u043d\u0430\u0439\u043f\u043e\u0448\u0438\u0440\u0435\u043d\u0456\u0448\u0438\u043c \u0441\u043f\u043e\u0441\u043e\u0431\u043e\u043c \u043e\u043f\u0438\u0441\u0430\u0442\u0438 \u0448\u0432\u0438\u0434\u043a\u0456\u0441\u0442\u044c \u043d\u0430\u0431\u043e\u0440\u0443 \u0442\u0435\u043a\u0441\u0442\u0443. \u0442\u0435\u0441\u0442 \u0432\u0438\u043a\u043e\u0440\u0438\u0441\u0442\u043e\u0432\u0443\u0454 \u0441\u0442\u0430\u043d\u0434\u0430\u0440\u0442\u043d\u0443 \u0443\u043c\u043e\u0432\u0443 \u043f'\u044f\u0442\u0438 \u0441\u0438\u043c\u0432\u043e\u043b\u0456\u0432 \u043d\u0430 \u0441\u043b\u043e\u0432\u043e." },
    { q: "\u042f\u043a \u043e\u0431\u0447\u0438\u0441\u043b\u044e\u0454\u0442\u044c\u0441\u044f \u0442\u043e\u0447\u043d\u0456\u0441\u0442\u044c \u043d\u0430\u0431\u043e\u0440\u0443 \u0442\u0435\u043a\u0441\u0442\u0443?", a: "\u0422\u043e\u0447\u043d\u0456\u0441\u0442\u044c \u0432\u0456\u0434\u043e\u0431\u0440\u0430\u0436\u0430\u0454, \u043d\u0430\u0441\u043a\u0456\u043b\u044c\u043a\u0438 \u0432\u0432\u0435\u0434\u0435\u043d\u0456 \u0441\u0438\u043c\u0432\u043e\u043b\u0438 \u0432\u0456\u0434\u043f\u043e\u0432\u0456\u0434\u0430\u044e\u0442\u044c \u0446\u0456\u043b\u044c\u043e\u0432\u043e\u043c\u0443 \u0442\u0435\u043a\u0441\u0442\u0443." },
    { q: "\u042f\u043a\u0430 \u0448\u0432\u0438\u0434\u043a\u0456\u0441\u0442\u044c \u043d\u0430\u0431\u043e\u0440\u0443 \u0442\u0435\u043a\u0441\u0442\u0443 \u0432\u0432\u0430\u0436\u0430\u0454\u0442\u044c\u0441\u044f \u0434\u043e\u0431\u0440\u043e\u044e?", a: "\u041d\u0435\u043c\u0430\u0454 \u0454\u0434\u0438\u043d\u043e\u0433\u043e \u043f\u043e\u043a\u0430\u0437\u043d\u0438\u043a\u0430 WPM, \u044f\u043a\u0438\u0439 \u043f\u0456\u0434\u0445\u043e\u0434\u0438\u0442\u044c \u0443\u0441\u0456\u043c." },
    { q: "Чи є тест друку на 5 хвилин?", a: "Так. GOATTYPE пропонує <strong>тест друку на 5 хвилин</strong> для тренування стабільної швидкості та витривалості. Довші сесії показують, чи вдається тримати темп після старту, — добре доповнення до тестів на 1, 2 і 3 хвилини." },
    { q: "Це живий тест друку?", a: "Так. Він працює як <strong>живий тест друку</strong>: WPM, точність і помилки оновлюються в реальному часі під час введення, а панель результатів підсумовує все після завершення таймера." },
    { q: "Як друкувати швидше на клавіатурі?", a: "Спочатку зосередьтеся на точності — швидкість прийде з регулярною практикою. Проходьте <strong>тест друку</strong> щодня короткими сесіями, порівнюйте результати за однакових налаштувань і підвищуйте складність, коли почуватиметеся впевнено." },
  ],
  id: [
    { q: "Apa itu tes mengetik gratis?", a: "<strong>Tes mengetik gratis</strong> mengukur seberapa cepat dan akurat kamu mengetik di keyboard dengan memintamu mengetik teks yang ditampilkan dalam waktu tertentu. GOATTYPE menampilkan WPM, akurasi, kesalahan, dan statistik lain yang bermanfaat." },
    { q: "Bagaimana cara berlatih mengetik secara efektif?", a: "Gunakan tes sebagai rutinitas <strong>latihan mengetik</strong> yang bisa diulang: pilih durasi dan tingkat kesulitan, selesaikan satu percobaan, tinjau WPM dan akurasimu, lalu coba lagi. Menjaga pengaturan yang sama selama beberapa sesi membantu melihat kemajuan nyata." },
    { q: "Apa arti WPM?", a: "WPM berarti <strong>kata per menit</strong> dan merupakan cara paling umum untuk menggambarkan kecepatan mengetik. Tes ini menggunakan konvensi standar lima karakter per kata, sehingga skormu bergantung pada jumlah teks yang diketik relatif terhadap waktu." },
    { q: "Bagaimana akurasi mengetik dihitung?", a: "Akurasi menunjukkan seberapa dekat karakter yang kamu ketik dengan teks target. Karakter yang benar meningkatkan akurasi, kesalahan menurunkannya. Melihat WPM dan akurasi bersamaan menunjukkan apakah kamu benar-benar mengetik secara efisien." },
    { q: "Berapa kecepatan mengetik yang baik?", a: "Tidak ada satu skor WPM yang cocok untuk semua orang. Kecepatan yang baik bergantung pada tugasmu, tingkat kesulitan teks, dan akurasimu. Gunakan tabel kecepatan sebagai acuan dan bandingkan hasilmu sendiri dalam kondisi yang serupa." },
    { q: "Apakah ada tes mengetik 5 menit?", a: "Ya. GOATTYPE menyediakan <strong>tes mengetik 5 menit</strong> untuk melatih kecepatan yang stabil dan daya tahan. Sesi yang lebih lama menunjukkan apakah kamu bisa mempertahankan ritme setelah awal, melengkapi tes 1, 2, dan 3 menit." },
    { q: "Apakah ini tes mengetik langsung (live)?", a: "Ya. Ini berfungsi sebagai <strong>tes mengetik live</strong>: WPM, akurasi, dan kesalahan diperbarui secara real-time saat kamu mengetik, dan panel hasil merangkum semuanya saat timer berakhir." },
    { q: "Bagaimana cara mengetik lebih cepat?", a: "Fokus dulu pada akurasi — kecepatan akan datang dengan latihan rutin. Gunakan <strong>tes mengetik</strong> setiap hari dalam sesi singkat, bandingkan hasil dengan pengaturan yang sama, dan naikkan kesulitan saat sudah nyaman." },
  ],
  zh: [
    { q: "\u4ec0\u4e48\u662f\u514d\u8d39\u6253\u5b57\u6d4b\u8bd5\uff1f", a: "<strong>\u514d\u8d39\u6253\u5b57\u6d4b\u8bd5</strong>\u901a\u8fc7\u8ba9\u4f60\u5728\u89c4\u5b9a\u65f6\u95f4\u5185\u8f93\u5165\u663e\u793a\u7684\u6587\u672c\uff0c\u6765\u8861\u91cf\u4f60\u5728\u952e\u76d8\u4e0a\u6253\u5b57\u7684\u901f\u5ea6\u548c\u51c6\u786e\u5ea6\u3002GOATTYPE\u4f1a\u663e\u793a\u4f60\u7684WPM\u3001\u51c6\u786e\u7387\u3001\u9519\u8bef\u6570\u548c\u5176\u4ed6\u6709\u7528\u7684\u6570\u636e\u3002" },
    { q: "\u5982\u4f55\u6709\u6548\u5730\u7ec3\u4e60\u6253\u5b57\uff1f", a: "\u628a\u6d4b\u8bd5\u5f53\u4f5c\u53ef\u91cd\u590d\u7684<strong>\u6253\u5b57\u7ec3\u4e60</strong>\uff1a\u9009\u62e9\u65f6\u957f\u548c\u96be\u5ea6\uff0c\u5b8c\u6210\u4e00\u6b21\u5c1d\u8bd5\uff0c\u67e5\u770b\u4f60\u7684WPM\u548c\u51c6\u786e\u7387\uff0c\u7136\u540e\u518d\u8bd5\u4e00\u6b21\u3002\u5728\u591a\u6b21\u7ec3\u4e60\u4e2d\u4fdd\u6301\u76f8\u540c\u8bbe\u7f6e\uff0c\u80fd\u66f4\u5bb9\u6613\u770b\u5230\u771f\u6b63\u7684\u8fdb\u6b65\u3002" },
    { q: "WPM\u662f\u4ec0\u4e48\u610f\u601d\uff1f", a: "WPM\u610f\u4e3a<strong>\u6bcf\u5206\u949f\u5b57\u6570</strong>\uff0c\u662f\u63cf\u8ff0\u6253\u5b57\u901f\u5ea6\u6700\u5e38\u89c1\u7684\u65b9\u5f0f\u3002\u6d4b\u8bd5\u91c7\u7528\u6bcf\u4e2a\u5355\u8bcd\u4e94\u4e2a\u5b57\u7b26\u7684\u6807\u51c6\u60ef\u4f8b\uff0c\u56e0\u6b64\u4f60\u7684\u5206\u6570\u53d6\u51b3\u4e8e\u6253\u5b57\u91cf\u4e0e\u6240\u7528\u65f6\u95f4\u7684\u5173\u7cfb\u3002" },
    { q: "\u6253\u5b57\u51c6\u786e\u7387\u5982\u4f55\u8ba1\u7b97\uff1f", a: "\u51c6\u786e\u7387\u53cd\u6620\u4f60\u8f93\u5165\u7684\u5b57\u7b26\u4e0e\u76ee\u6807\u6587\u672c\u7684\u5339\u914d\u7a0b\u5ea6\u3002\u6b63\u786e\u7684\u5b57\u7b26\u4f1a\u63d0\u9ad8\u51c6\u786e\u7387\uff0c\u9519\u8bef\u5219\u4f1a\u964d\u4f4e\u5b83\u3002\u540c\u65f6\u67e5\u770bWPM\u548c\u51c6\u786e\u7387\uff0c\u80fd\u770b\u51fa\u4f60\u662f\u5426\u771f\u6b63\u9ad8\u6548\u5730\u6253\u5b57\u3002" },
    { q: "\u4ec0\u4e48\u662f\u597d\u7684\u6253\u5b57\u901f\u5ea6\uff1f", a: "\u6ca1\u6709\u4e00\u4e2a\u9002\u5408\u6240\u6709\u4eba\u7684WPM\u5206\u6570\u3002\u597d\u7684\u901f\u5ea6\u53d6\u51b3\u4e8e\u4f60\u7684\u4efb\u52a1\u3001\u6587\u672c\u96be\u5ea6\u548c\u4f60\u7684\u51c6\u786e\u7387\u3002\u53ef\u4ee5\u628a\u901f\u5ea6\u56fe\u8868\u4f5c\u4e3a\u53c2\u8003\uff0c\u5e76\u5728\u7c7b\u4f3c\u6761\u4ef6\u4e0b\u6bd4\u8f83\u81ea\u5df1\u7684\u7ed3\u679c\u3002" },
    { q: "有5分钟打字测试吗?", a: "有。GOATTYPE 提供 <strong>5 分钟打字测试</strong>,用于锻炼持续打字速度和耐力。较长的测试能看出你在起步后能否保持节奏,是 1、2、3 分钟测试的良好补充。" },
    { q: "这是实时打字测试吗?", a: "是的。它就是 <strong>实时打字测试</strong>:你在输入时 WPM、准确率和错误数会实时更新,计时结束后结果面板会汇总一切。" },
    { q: "怎样才能打字更快?", a: "先专注于准确率,速度会随着持续练习自然提升。每天用 <strong>打字测试</strong>进行短时练习,在相同设置下比较成绩,适应后再提高难度。" },
  ],
  ja: [
    { q: "\u7121\u6599\u30bf\u30a4\u30d4\u30f3\u30b0\u30c6\u30b9\u30c8\u3068\u306f\u4f55\u3067\u3059\u304b\uff1f", a: "<strong>\u7121\u6599\u30bf\u30a4\u30d4\u30f3\u30b0\u30c6\u30b9\u30c8</strong>\u306f\u3001\u6c7a\u3081\u3089\u308c\u305f\u6642\u9593\u5185\u306b\u8868\u793a\u3055\u308c\u305f\u6587\u7ae0\u3092\u5165\u529b\u3059\u308b\u3053\u3068\u3067\u3001\u30ad\u30fc\u30dc\u30fc\u30c9\u3067\u3069\u308c\u3060\u3051\u901f\u304f\u6b63\u78ba\u306b\u30bf\u30a4\u30d4\u30f3\u30b0\u3067\u304d\u308b\u304b\u3092\u6e2c\u5b9a\u3057\u307e\u3059\u3002GOATTYPE\u306f\u3001WPM\u3001\u6b63\u78ba\u7387\u3001\u30a8\u30e9\u30fc\u6570\u306a\u3069\u306e\u6709\u7528\u306a\u6307\u6a19\u3092\u8868\u793a\u3057\u307e\u3059\u3002" },
    { q: "\u52b9\u679c\u7684\u306b\u30bf\u30a4\u30d4\u30f3\u30b0\u3092\u7df4\u7fd2\u3059\u308b\u65b9\u6cd5\u306f\uff1f", a: "\u30c6\u30b9\u30c8\u3092\u7e70\u308a\u8fd4\u3057\u884c\u3048\u308b<strong>\u30bf\u30a4\u30d4\u30f3\u30b0\u7df4\u7fd2</strong>\u30eb\u30fc\u30c6\u30a3\u30f3\u3068\u3057\u3066\u6d3b\u7528\u3057\u307e\u3057\u3087\u3046\u3002\u6642\u9593\u3068\u96e3\u6613\u5ea6\u3092\u9078\u3073\u30011\u56de\u8a66\u3057\u3066\u3001WPM\u3068\u6b63\u78ba\u7387\u3092\u78ba\u8a8d\u3057\u3001\u518d\u5ea6\u6311\u6226\u3057\u307e\u3059\u3002\u540c\u3058\u8a2d\u5b9a\u3092\u4f55\u5ea6\u304b\u7e70\u308a\u8fd4\u3059\u3053\u3068\u3067\u3001\u672c\u5f53\u306e\u9032\u6b69\u304c\u898b\u3048\u3084\u3059\u304f\u306a\u308a\u307e\u3059\u3002" },
    { q: "WPM\u3068\u306f\u4f55\u3067\u3059\u304b\uff1f", a: "WPM\u306f<strong>1\u5206\u3042\u305f\u308a\u306e\u5358\u8a9e\u6570</strong>\u3092\u610f\u5473\u3057\u3001\u30bf\u30a4\u30d4\u30f3\u30b0\u901f\u5ea6\u3092\u8868\u3059\u6700\u3082\u4e00\u822c\u7684\u306a\u65b9\u6cd5\u3067\u3059\u3002\u30c6\u30b9\u30c8\u306f1\u5358\u8a9e\u30925\u6587\u5b57\u3068\u3059\u308b\u6a19\u6e96\u7684\u306a\u63db\u7b97\u3092\u4f7f\u7528\u3059\u308b\u305f\u3081\u3001\u30b9\u30b3\u30a2\u306f\u5165\u529b\u3057\u305f\u6587\u5b57\u6570\u3068\u6240\u8981\u6642\u9593\u306b\u57fa\u3065\u3044\u3066\u6c7a\u307e\u308a\u307e\u3059\u3002" },
    { q: "\u30bf\u30a4\u30d4\u30f3\u30b0\u306e\u6b63\u78ba\u7387\u306f\u3069\u306e\u3088\u3046\u306b\u8a08\u7b97\u3055\u308c\u307e\u3059\u304b\uff1f", a: "\u6b63\u78ba\u7387\u306f\u3001\u5165\u529b\u3057\u305f\u6587\u5b57\u304c\u5bfe\u8c61\u306e\u6587\u7ae0\u3068\u3069\u308c\u3060\u3051\u4e00\u81f4\u3057\u3066\u3044\u308b\u304b\u3092\u793a\u3057\u307e\u3059\u3002\u6b63\u3057\u3044\u6587\u5b57\u306f\u6b63\u78ba\u7387\u3092\u9ad8\u3081\u3001\u9593\u9055\u3044\u306f\u4e0b\u3052\u307e\u3059\u3002WPM\u3068\u6b63\u78ba\u7387\u3092\u4e00\u7dd2\u306b\u898b\u308b\u3053\u3068\u3067\u3001\u672c\u5f53\u306b\u52b9\u7387\u7684\u306b\u30bf\u30a4\u30d4\u30f3\u30b0\u3067\u304d\u3066\u3044\u308b\u304b\u304c\u308f\u304b\u308a\u307e\u3059\u3002" },
    { q: "\u826f\u3044\u30bf\u30a4\u30d4\u30f3\u30b0\u901f\u5ea6\u3068\u306f\u3069\u308c\u304f\u3089\u3044\u3067\u3059\u304b\uff1f", a: "\u8ab0\u306b\u3068\u3063\u3066\u3082\u6b63\u3057\u3044WPM\u3068\u3044\u3046\u5358\u4e00\u306e\u57fa\u6e96\u306f\u3042\u308a\u307e\u305b\u3093\u3002\u826f\u3044\u901f\u5ea6\u306f\u4f5c\u696d\u5185\u5bb9\u3001\u6587\u7ae0\u306e\u96e3\u6613\u5ea6\u3001\u6b63\u78ba\u7387\u306b\u3088\u3063\u3066\u7570\u306a\u308a\u307e\u3059\u3002\u901f\u5ea6\u30c1\u30e3\u30fc\u30c8\u3092\u76ee\u5b89\u3068\u3057\u3066\u4f7f\u3044\u3001\u4f3c\u305f\u6761\u4ef6\u3067\u81ea\u5206\u306e\u7d50\u679c\u3092\u6bd4\u8f03\u3057\u307e\u3057\u3087\u3046\u3002" },
    { q: "5分間のタイピングテストはありますか?", a: "はい。GOATTYPEには<strong>5分間のタイピングテスト</strong>があり、持続的な速度と持久力を鍛えられます。長めのセッションでは、スタート後のペースを維持できるかが分かり、1分・2分・3分テストの補完になります。" },
    { q: "リアルタイムのタイピングテストですか?", a: "はい。<strong>リアルタイムのタイピングテスト</strong>として動作します。入力中にWPM・正確率・エラーがリアルタイムで更新され、タイマー終了時に結果パネルですべて確認できます。" },
    { q: "タイピングを速くする方法は?", a: "まずは正確さを意識しましょう。速さは継続的な練習で自然に付いてきます。<strong>タイピングテスト</strong>を毎日短時間で行い、同じ設定で結果を比較して、慣れたら難易度を上げていくのがおすすめです。" },
  ],
  ko: [
    { q: "무료 타자 테스트란 무엇인가요?", a: "<strong>무료 타자 테스트</strong>는 정해진 시간 동안 화면에 표시된 텍스트를 입력하여 키보드로 얼마나 빠르고 정확하게 타자하는지 측정합니다. GOATTYPE는 WPM, 정확도, 오류 수 등 유용한 지표를 보여줍니다." },
    { q: "타자를 효과적으로 연습하는 방법은?", a: "테스트를 반복할 수 있는 <strong>타자 연습</strong> 루틴으로 활용하세요. 시간과 난이도를 선택하고, 한 번 시도한 뒤 WPM과 정확도를 확인하고 다시 도전하세요. 여러 세션 동안 같은 설정을 유지하면 실제 실력 향상을 확인하기 쉽습니다." },
    { q: "WPM은 무슨 의미인가요?", a: "WPM은 <strong>분당 단어 수</strong>를 의미합니다. 테스트는 단어당 5자를 1 단어로 간주하는 표준 계산법을 사용하므로, 입력한 문자 수와 소요 시간에 따라 속도가 산출됩니다." },
    { q: "타자 정확도는 어떻게 계산되나요?", a: "정확도는 입력한 문자가 대상 텍스트와 얼마나 일치하는지를 나타냅니다. 올바른 문자는 정확도를 높이고 오류는 낮춥니다. WPM과 정확도를 함께 보면 얼마나 효율적으로 타자하고 있는지 알 수 있습니다." },
    { q: "좋은 타자 속도는 어느 정도인가요?", a: "모든 사람에게 동일하게 맞는 단일 WPM 기준은 없습니다. 작업 내용, 문장의 난이도, 정확도에 따라 좋은 속도는 달라집니다. 속도 차트를 기준으로 삼아 비슷한 조건에서 자신의 결과를 비교해 보세요." },
    { q: "5분 타자 테스트가 있나요?", a: "네. GOATTYPE에는 <strong>5분 타자 테스트</strong>가 있어 지속적인 타자 속도와 지구력을 연습할 수 있습니다. 긴 세션에서는 시작 후 속도를 유지할 수 있는지 확인할 수 있어 1분, 2분, 3분 테스트를 잘 보완합니다." },
    { q: "실시간 타자 테스트인가요?", a: "네. <strong>실시간 타자 테스트</strong>로 동작합니다. 입력하는 동안 WPM, 정확도, 오류가 실시간으로 업데이트되고, 타이머가 끝나면 결과 패널에서 모든 것을 확인할 수 있습니다." },
    { q: "타자를 더 빨리 치는 방법은?", a: "먼저 정확도에 집중하세요. 속도는 꾸준한 연습으로 자연스럽게 따라옵니다. 매일 <strong>타자 테스트</strong>로 짧게 연습하고, 같은 설정에서 결과를 비교한 뒤 익숙해지면 난이도를 올려보세요." },
  ],
};

const HEADING: Record<Locale, string> = {
  en: "Frequently Asked Questions About Typing Tests",
  es: "Preguntas frecuentes sobre mecanograf\u00eda",
  de: "H\u00e4ufig gestellte Fragen zum Schreibtest",
  fr: "Questions fr\u00e9quentes sur le test de frappe",
  it: "Domande frequenti sul test di digitazione",
  pt: "Perguntas frequentes sobre o teste de digita\u00e7\u00e3o",
  pl: "Najcz\u0119\u015bciej zadawane pytania o test pisania",
  tr: "Yazma testi hakk\u0131nda s\u0131k\u00e7a sorulan sorular",
  uk: "\u0427\u0430\u0441\u0442\u0456 \u0437\u0430\u043f\u0438\u0442\u0430\u043d\u043d\u044f \u043f\u0440\u043e \u0442\u0435\u0441\u0442 \u043d\u0430\u0431\u043e\u0440\u0443 \u0442\u0435\u043a\u0441\u0442\u0443",
  id: "Pertanyaan umum tentang tes mengetik",
  zh: "\u5173\u4e8e\u6253\u5b57\u6d4b\u8bd5\u7684\u5e38\u89c1\u95ee\u9898",
  ja: "\u30bf\u30a4\u30d4\u30f3\u30b0\u30c6\u30b9\u30c8\u306b\u95a2\u3059\u308b\u3088\u304f\u3042\u308b\u8cea\u554f",
  ko: "타자 테스트에 대해 자주 묻는 질문",
};

const INTRO: Record<Locale, string> = {
  en: "Clear answers about free typing tests, typing practice, WPM, accuracy, test durations, English typing, custom tests, accounts, and results.",
  es: "Respuestas sobre tests de mecanograf\u00eda, velocidad de escritura, WPM, precisi\u00f3n y pr\u00e1ctica con teclado.",
  de: "Klare Antworten zu kostenlosen Schreibtests, Tipp\u00fcbungen, WPM, Genauigkeit und Testdauer.",
  fr: "R\u00e9ponses claires sur les tests de frappe gratuits, l'entra\u00eenement, le WPM, la pr\u00e9cision et la dur\u00e9e des tests.",
  it: "Risposte chiare su test di digitazione gratuiti, esercizi, WPM, precisione e durata dei test.",
  pt: "Respostas claras sobre testes de digita\u00e7\u00e3o gratuitos, pr\u00e1tica, WPM, precis\u00e3o e dura\u00e7\u00e3o dos testes.",
  pl: "Jasne odpowiedzi na temat darmowych test\u00f3w pisania, \u0107wicze\u0144, WPM, dok\u0142adno\u015bci i czasu trwania test\u00f3w.",
  tr: "\u00dccretsiz yazma testleri, pratik, WPM, do\u011fruluk ve test s\u00fcreleri hakk\u0131nda a\u00e7\u0131k yan\u0131tlar.",
  uk: "\u0427\u0456\u0442\u043a\u0456 \u0432\u0456\u0434\u043f\u043e\u0432\u0456\u0434\u0456 \u043f\u0440\u043e \u0431\u0435\u0437\u043a\u043e\u0448\u0442\u043e\u0432\u043d\u0456 \u0442\u0435\u0441\u0442\u0438 \u043d\u0430\u0431\u043e\u0440\u0443 \u0442\u0435\u043a\u0441\u0442\u0443, \u043f\u0440\u0430\u043a\u0442\u0438\u043a\u0443, WPM, \u0442\u043e\u0447\u043d\u0456\u0441\u0442\u044c \u0456 \u0442\u0440\u0438\u0432\u0430\u043b\u0456\u0441\u0442\u044c \u0442\u0435\u0441\u0442\u0456\u0432.",
  id: "Jawaban jelas tentang tes mengetik gratis, latihan, WPM, akurasi, dan durasi tes.",
  zh: "\u5173\u4e8e\u514d\u8d39\u6253\u5b57\u6d4b\u8bd5\u3001\u7ec3\u4e60\u3001WPM\u3001\u51c6\u786e\u7387\u548c\u6d4b\u8bd5\u65f6\u957f\u7684\u6e05\u6670\u89e3\u7b54\u3002",
  ja: "\u7121\u6599\u30bf\u30a4\u30d4\u30f3\u30b0\u30c6\u30b9\u30c8\u3001\u7df4\u7fd2\u3001WPM\u3001\u6b63\u78ba\u7387\u3001\u30c6\u30b9\u30c8\u6642\u9593\u306b\u3064\u3044\u3066\u306e\u660e\u78ba\u306a\u56de\u7b54\u3002",
  ko: "무료 타자 테스트, 타자 연습, WPM, 정확도, 테스트 시간에 대한 명확한 답변.",
};

export default function FaqSection({ locale = "en" as Locale }: { locale?: Locale }) {
  const faqs = FAQS_BY_LOCALE[locale] ?? FAQS_BY_LOCALE.en;
  return (
    <section id="faq" className="mx-auto max-w-4xl scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="font-heading-4 text-ink">{HEADING[locale] ?? HEADING.en}</h2>
      <p className="mt-3 font-body text-text-muted">{INTRO[locale] ?? INTRO.en}</p>

      <div className="mt-8 divide-y divide-hairline rounded-[24px] border border-hairline bg-canvas shadow-sm">
        {faqs.map((item) => (
          <details key={item.q} className="group px-6 py-5 open:pb-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-1 text-left font-heading-5 text-ink marker:content-none">
              {item.q}
              <span className="shrink-0 text-lg text-accent transition-transform duration-200 group-open:rotate-45">+</span>
            </summary>
            <p className="mt-4 font-body text-text-muted [&_strong]:font-semibold [&_strong]:text-ink" dangerouslySetInnerHTML={{ __html: item.a }}></p>
          </details>
        ))}
      </div>
    </section>
  );
}
