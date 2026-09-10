import type { Locale } from "./i18n";

export type KeyboardPageLocale = Exclude<Locale, "en">;
export interface KeyboardPageCopy {
  title: string; description: string; keywords: string[]; eyebrow: string; hero: string; intro: string;
  launch: string; guideLink: string; launchNote: string; panelTitle: string; steps: string[];
  guideTitle: string; sections: Array<{ title: string; body: string }>; faqTitle: string; faqs: Array<{ q: string; a: string }>;
}

export const KEYBOARD_PAGE_COPY: Record<KeyboardPageLocale, KeyboardPageCopy> = {
  es: {
    title: "Prueba de teclado online gratis | Comprobar teclas y teclado numérico | GOATTYPE",
    description: "Prueba todas las teclas de tu teclado online: F1–F12, flechas, teclado numérico, teclas bloqueadas, ghosting y pulsaciones simultáneas.",
    keywords: ["prueba de teclado", "test de teclado online", "comprobar teclas", "probador de teclado", "teclado numérico", "teclas que no funcionan", "ghosting teclado"],
    eyebrow: "Diagnóstico gratuito en el navegador", hero: "Prueba cada tecla de tu teclado online", intro: "Comprueba un teclado completo de 104 teclas sin instalar programas. La prueba a pantalla completa detecta letras, números, teclas de función, flechas, modificadores y teclado numérico, y marca cada tecla que responde.",
    launch: "Iniciar prueba de teclado", guideLink: "Cómo funciona", launchNote: "La prueba se abre en esta misma página. Pulsa Esc o Finalizar prueba para volver.", panelTitle: "Durante la prueba", steps: ["La herramienta ocupa toda la pantalla.", "La captura del teclado empieza automáticamente.", "Las teclas detectadas se iluminan y quedan marcadas.", "Pulsa Esc o Finalizar prueba para salir."],
    guideTitle: "Guía completa para comprobar un teclado", sections: [
      { title: "Cómo funciona la prueba de teclado", body: "El navegador genera eventos al pulsar y soltar una tecla. GOATTYPE usa el código de posición física para distinguir, por ejemplo, Shift izquierdo y derecho. Una tecla brillante está pulsada; una tecla marcada ya fue detectada durante la sesión." },
      { title: "Cómo probar todas las teclas", body: "Revisa por orden las letras, la fila numérica, signos, Ctrl, Alt, Shift, F1–F12, Insert, Supr, Inicio, Fin, Re Pág, Av Pág, flechas y teclado numérico. Repite una tecla que falle, se duplique o responda con retraso y compárala en otro programa." },
      { title: "Portátiles, tecla Fn y controles multimedia", body: "En muchos portátiles, F1–F12 también controlan brillo, volumen o micrófono. Prueba Fn junto con la tecla y comprueba Bloq Fn. El firmware o el sistema puede ejecutar estas acciones antes de que el navegador reciba el evento; eso no demuestra que la tecla esté averiada." },
      { title: "Teclado numérico, ghosting y NKRO", body: "Activa Bloq Num para revisar 0–9, decimal, operadores y Enter. Para detectar ghosting, mantén varias teclas a la vez y compara las luces con el contador de teclas pulsadas. Una combinación perdida puede indicar un límite de rollover de la matriz." },
      { title: "Teclas atascadas, dobles o sin respuesta", body: "Limpia con el equipo apagado, prueba otro puerto USB, carga el teclado inalámbrico y desactiva temporalmente programas de reasignación. Si la misma tecla falla en varios navegadores y equipos, puede existir desgaste del interruptor, daño por líquido o un problema del cable interno." },
      { title: "Privacidad y límites", body: "La detección se realiza localmente y GOATTYPE no guarda lo que pulsas. Algunas combinaciones protegidas, Impr Pant, encendido y controles gestionados por el sistema no pueden bloquearse de forma fiable desde una web." }
    ],
    faqTitle: "Preguntas frecuentes sobre la prueba de teclado", faqs: [
      { q: "¿Cómo sé si una tecla funciona?", a: "Inicia la prueba y púlsala. Si el navegador la detecta, se ilumina y permanece marcada." },
      { q: "¿Puedo comprobar el teclado numérico?", a: "Sí. Activa Bloq Num y prueba los números, operadores, decimal y Enter del bloque derecho." },
      { q: "¿La prueba detecta ghosting?", a: "Ayuda a detectar límites prácticos: mantén varias teclas y revisa cuáles aparecen simultáneamente." },
      { q: "¿Cómo salgo de la prueba?", a: "Pulsa Esc o selecciona Finalizar prueba. Volverás a esta misma página." },
      { q: "¿Se guardan mis pulsaciones?", a: "No. La prueba funciona localmente en el navegador y no guarda las teclas pulsadas." }
    ]
  },
  de: {
    title: "Tastatur testen online | Alle Tasten & Nummernblock prüfen | GOATTYPE",
    description: "Kostenloser Tastatur-Test: Tasten online prüfen, F1–F12, Pfeiltasten, Nummernblock, defekte Tasten, Ghosting und Mehrfacheingaben testen.",
    keywords: ["Tastatur testen", "Tastatur Test online", "Tasten prüfen", "Tastaturtester", "Nummernblock testen", "defekte Taste", "Tastatur Ghosting"],
    eyebrow: "Kostenlose Browser-Diagnose", hero: "Tastatur online testen und jede Taste prüfen", intro: "Prüfe eine vollständige 104-Tasten-Tastatur ohne Download. Der Vollbild-Test erkennt Buchstaben, Zahlen, Funktionstasten, Navigation, Pfeile, Modifikatortasten und den Nummernblock und markiert jede registrierte Taste.",
    launch: "Tastatur-Test starten", guideLink: "So funktioniert es", launchNote: "Der Test öffnet sich auf derselben Seite. Mit Esc oder Test beenden kehrst du zurück.", panelTitle: "Im Test", steps: ["Der Tester füllt den Bildschirm.", "Die Tastenerfassung startet automatisch.", "Erkannte Tasten leuchten und bleiben markiert.", "Mit Esc oder Test beenden verlässt du den Test."],
    guideTitle: "Ausführliche Anleitung zum Tastatur-Test", sections: [
      { title: "So erkennt der Online-Tastaturtester Tasten", body: "Beim Drücken und Loslassen sendet der Browser Tastaturereignisse. GOATTYPE verwendet den physischen Tastencode und kann dadurch linke und rechte Umschalt-, Strg- und Alt-Tasten unterscheiden. Hell bedeutet gedrückt; eine Akzentmarkierung bedeutet bereits erkannt." },
      { title: "Alle Tasten systematisch prüfen", body: "Teste Buchstaben, Zahlenreihe, Satzzeichen, Modifikatoren, F1–F12, Einfügen, Entfernen, Pos1, Ende, Bild auf/ab, Pfeile und Nummernblock. Wiederhole verzögerte, doppelte oder fehlende Eingaben und vergleiche sie in einem zweiten Programm." },
      { title: "Laptop, Fn-Taste und Medienfunktionen", body: "Bei Notebooks steuern F-Tasten oft Helligkeit, Lautstärke oder Mikrofon. Teste Fn und Fn-Lock. Firmware oder Betriebssystem können diese Aktion abfangen, bevor der Browser sie sieht; eine fehlende Markierung beweist daher nicht automatisch einen Defekt." },
      { title: "Nummernblock, Ghosting und N-Key-Rollover", body: "Aktiviere Num Lock und prüfe Ziffern, Rechenzeichen, Dezimaltrennzeichen und Enter. Halte für einen Ghosting-Test mehrere Tasten gleichzeitig. Fehlt eine gedrückte Taste, kann die Matrix dieser Kombination nur begrenztes Rollover bieten." },
      { title: "Klemmende oder defekte Tasten beheben", body: "Schalte das Gerät vor der Reinigung aus, teste ein anderes USB-Kabel oder einen Port und lade Funkmodelle. Fällt dieselbe Taste in mehreren Browsern und Computern aus, sind Schalter, Kabel, Matrix oder Flüssigkeitsschaden wahrscheinlicher." },
      { title: "Datenschutz und technische Grenzen", body: "Die Prüfung läuft lokal; GOATTYPE speichert keine Tasteneingaben. Geschützte Systemkürzel, Druck, Ein/Aus und firmwaregesteuerte Medienfunktionen lassen sich von Webseiten nicht zuverlässig blockieren." }
    ],
    faqTitle: "Häufige Fragen zum Tastatur-Test", faqs: [
      { q: "Wie prüfe ich, ob eine Taste funktioniert?", a: "Starte den Test und drücke die Taste. Eine erkannte Taste leuchtet auf und bleibt markiert." },
      { q: "Kann ich den Nummernblock testen?", a: "Ja. Num Lock einschalten und alle Ziffern, Operatoren, Dezimal und Enter prüfen." },
      { q: "Erkennt der Test Ghosting?", a: "Er zeigt praktische Grenzen, wenn du mehrere Tasten hältst und die aktiven Markierungen vergleichst." },
      { q: "Wie beende ich den Test?", a: "Drücke Esc oder Test beenden; du kehrst zur gleichen Seite zurück." },
      { q: "Werden Tasteneingaben gespeichert?", a: "Nein. Die Erkennung erfolgt lokal im Browser." }
    ]
  },
  fr: {
    title: "Test clavier en ligne gratuit | Tester toutes les touches | GOATTYPE",
    description: "Testez les touches du clavier, F1–F12, les flèches, le pavé numérique, les touches bloquées, le ghosting et les pressions simultanées.",
    keywords: ["test clavier", "test clavier en ligne", "tester touches clavier", "testeur de clavier", "pavé numérique", "touche clavier ne fonctionne plus", "ghosting clavier"],
    eyebrow: "Diagnostic gratuit dans le navigateur", hero: "Testez chaque touche de votre clavier en ligne", intro: "Vérifiez un clavier complet de 104 touches sans téléchargement. Le test plein écran contrôle lettres, chiffres, fonctions, navigation, flèches, modificateurs et pavé numérique, puis conserve la marque des touches reconnues.",
    launch: "Lancer le test du clavier", guideLink: "Comment ça marche", launchNote: "Le test s’ouvre sur cette page. Appuyez sur Échap ou Terminer le test pour revenir.", panelTitle: "Pendant le test", steps: ["Le testeur remplit l’écran.", "La capture démarre automatiquement.", "Les touches détectées s’allument et restent marquées.", "Échap ou Terminer le test permet de sortir."],
    guideTitle: "Guide complet pour tester un clavier", sections: [
      { title: "Comment fonctionne le test clavier", body: "Le navigateur émet un événement quand une touche est enfoncée puis relâchée. GOATTYPE lit son code physique afin de distinguer les touches gauche et droite. Une touche vive est maintenue; une touche colorée a déjà été détectée." },
      { title: "Méthode pour vérifier toutes les touches", body: "Testez les lettres, la rangée numérique, la ponctuation, Ctrl, Alt, Maj, F1–F12, Inser, Suppr, Début, Fin, Page précédente/suivante, les flèches et le pavé numérique. Répétez toute saisie absente, doublée ou lente dans une autre application." },
      { title: "Portable, touche Fn et commandes multimédias", body: "Sur un ordinateur portable, F1–F12 contrôlent souvent luminosité, volume ou micro. Essayez Fn et le verrouillage Fn. Le firmware peut traiter la commande avant le navigateur; l’absence de surbrillance ne signifie donc pas forcément une panne." },
      { title: "Pavé numérique, ghosting et rollover", body: "Activez Verr Num, puis testez chiffres, opérateurs, décimale et Entrée. Maintenez plusieurs touches pour rechercher le ghosting. Une combinaison incomplète peut révéler une limite de rollover de la matrice du clavier." },
      { title: "Touches bloquées, répétées ou mortes", body: "Éteignez l’appareil avant nettoyage, changez de port USB, rechargez le sans-fil et désactivez les logiciels de remappage. Une panne identique sur plusieurs appareils peut indiquer un contact usé, un câble desserré ou un dégât liquide." },
      { title: "Confidentialité et limites", body: "Le test reste local et GOATTYPE n’enregistre pas les touches. Certains raccourcis système, Impr écran, alimentation et commandes gérées par le firmware ne peuvent pas être bloqués par un site web." }
    ],
    faqTitle: "Questions fréquentes sur le test clavier", faqs: [
      { q: "Comment savoir si une touche fonctionne ?", a: "Lancez le test et appuyez dessus; une touche détectée s’allume puis reste marquée." },
      { q: "Puis-je tester le pavé numérique ?", a: "Oui. Activez Verr Num et contrôlez chiffres, opérateurs, décimale et Entrée." },
      { q: "Le test détecte-t-il le ghosting ?", a: "Il aide à voir les limites pratiques en maintenant plusieurs touches simultanément." },
      { q: "Comment quitter le test ?", a: "Appuyez sur Échap ou choisissez Terminer le test." },
      { q: "Mes frappes sont-elles enregistrées ?", a: "Non. La détection s’effectue localement dans le navigateur." }
    ]
  },
  it: {
    title: "Test tastiera online gratis | Verifica tutti i tasti | GOATTYPE",
    description: "Testa tastiera, tasti F1–F12, frecce, tastierino numerico, tasti bloccati, ghosting e pressioni simultanee direttamente online.",
    keywords: ["test tastiera", "test tastiera online", "verifica tasti tastiera", "tester tastiera", "tastierino numerico", "tasto non funziona", "ghosting tastiera"],
    eyebrow: "Diagnostica gratuita nel browser", hero: "Verifica ogni tasto della tastiera online", intro: "Controlla una tastiera completa da 104 tasti senza installare software. Il test a schermo intero rileva lettere, numeri, tasti funzione, navigazione, frecce, modificatori e tastierino numerico.",
    launch: "Avvia test tastiera", guideLink: "Come funziona", launchNote: "Il test si apre nella stessa pagina. Premi Esc o Termina test per tornare.", panelTitle: "Durante il test", steps: ["Il tester riempie lo schermo.", "La cattura parte automaticamente.", "I tasti rilevati si illuminano e restano segnati.", "Esc o Termina test chiude la prova."],
    guideTitle: "Guida completa al test della tastiera", sections: [
      { title: "Come funziona il tester", body: "Il browser genera eventi quando premi e rilasci un tasto. GOATTYPE legge il codice della posizione fisica, distinguendo i modificatori sinistri e destri. Un tasto acceso è premuto; un tasto colorato è già stato rilevato." },
      { title: "Come testare tutti i tasti", body: "Controlla lettere, numeri, punteggiatura, Ctrl, Alt, Maiusc, F1–F12, Inserisci, Canc, Home, Fine, PagSu/PagGiù, frecce e tastierino. Ripeti gli input mancanti, doppi o lenti e confrontali in un’altra applicazione." },
      { title: "Notebook, Fn e controlli multimediali", body: "Sui portatili i tasti funzione spesso regolano luminosità e volume. Prova Fn o Fn Lock. Firmware e sistema operativo possono intercettare il comando prima del browser, quindi un tasto non evidenziato non è necessariamente guasto." },
      { title: "Tastierino numerico, ghosting e NKRO", body: "Attiva Bloc Num e prova cifre, operatori, decimale e Invio. Tieni premuti più tasti per verificare il ghosting. Se una combinazione perde un input, la matrice può avere un limite di rollover." },
      { title: "Tasti bloccati, doppi o non funzionanti", body: "Spegni il dispositivo prima della pulizia, cambia porta o cavo USB, ricarica il wireless e disattiva le rimappature. Un problema identico su più computer può indicare usura, cavo interno o danno da liquidi." },
      { title: "Privacy e limiti", body: "Il test funziona localmente e GOATTYPE non salva i tasti. Screenshot, alimentazione e comandi protetti gestiti dal sistema o dal firmware non possono essere bloccati in modo affidabile." }
    ],
    faqTitle: "Domande frequenti sul test tastiera", faqs: [
      { q: "Come verifico se un tasto funziona?", a: "Avvia il test e premilo: se rilevato, si illumina e rimane segnato." },
      { q: "Posso testare il tastierino numerico?", a: "Sì. Attiva Bloc Num e prova numeri, operatori, decimale e Invio." },
      { q: "Il test rileva il ghosting?", a: "Aiuta a rilevare limiti pratici tenendo premuti più tasti insieme." },
      { q: "Come esco dal test?", a: "Premi Esc oppure Termina test." },
      { q: "I tasti premuti vengono salvati?", a: "No. Il rilevamento resta locale nel browser." }
    ]
  },
  pt: {
    title: "Teste de teclado online grátis | Verificar todas as teclas | GOATTYPE",
    description: "Teste teclado, F1–F12, setas, teclado numérico, teclas com defeito, ghosting, ABNT2/ANSI e entradas simultâneas online.",
    keywords: ["teste de teclado", "teste de teclado online grátis", "testador de teclado", "verificar teclas", "teclado ABNT2", "tecla não funciona", "ghosting teclado"],
    eyebrow: "Diagnóstico gratuito no navegador", hero: "Teste todas as teclas do teclado online", intro: "Verifique um teclado completo de 104 teclas sem instalar nada. O teste em tela cheia identifica letras, números, funções, navegação, setas, modificadores e teclado numérico e mantém as teclas aprovadas marcadas.",
    launch: "Iniciar teste de teclado", guideLink: "Como funciona", launchNote: "O teste abre nesta página. Pressione Esc ou Encerrar teste para voltar.", panelTitle: "Durante o teste", steps: ["O testador ocupa toda a tela.", "A captura começa automaticamente.", "Teclas detectadas acendem e ficam marcadas.", "Esc ou Encerrar teste fecha a ferramenta."],
    guideTitle: "Guia completo para testar o teclado", sections: [
      { title: "Como o teste detecta as teclas", body: "O navegador envia eventos ao pressionar e soltar teclas. GOATTYPE usa o código da posição física para diferenciar modificadores esquerdos e direitos. A tecla forte está pressionada; a marca suave significa que já foi detectada." },
      { title: "Como verificar o teclado inteiro", body: "Teste letras, números, símbolos, Ctrl, Alt, Shift, F1–F12, Insert, Delete, Home, End, Page Up/Down, setas e numpad. Repita entradas ausentes, lentas ou duplicadas e compare em outro aplicativo." },
      { title: "Notebook, Fn e teclas multimídia", body: "Em notebooks, F1–F12 podem controlar brilho, volume e microfone. Teste Fn e Fn Lock. Firmware ou sistema pode executar a função antes do navegador; a falta de marcação não confirma defeito físico." },
      { title: "ABNT2, teclado numérico, ghosting e NKRO", body: "A posição e os símbolos do ABNT2 podem diferir do ANSI mostrado, mas o código físico ainda ajuda no diagnóstico. Ative Num Lock para o numpad e segure várias teclas para verificar ghosting e limites de rollover." },
      { title: "Tecla falhando, presa ou duplicando", body: "Desligue antes de limpar, troque cabo ou porta USB, carregue modelos sem fio e desative remapeamentos. Se a falha continuar em diferentes computadores, pode haver desgaste do switch, cabo solto ou dano por líquido." },
      { title: "Privacidade e limitações", body: "O teste roda localmente e GOATTYPE não salva as teclas. Print Screen, energia e comandos protegidos controlados pelo sistema ou firmware não podem ser bloqueados de forma confiável por um site." }
    ],
    faqTitle: "Perguntas frequentes sobre teste de teclado", faqs: [
      { q: "Como saber se uma tecla funciona?", a: "Inicie o teste e pressione a tecla; quando detectada, ela acende e permanece marcada." },
      { q: "Funciona com teclado ABNT2?", a: "Sim, embora alguns símbolos e posições visuais sejam diferentes do layout ANSI." },
      { q: "Posso testar o teclado numérico?", a: "Sim. Ative Num Lock e teste números, operadores, decimal e Enter." },
      { q: "Como sair do teste?", a: "Pressione Esc ou escolha Encerrar teste." },
      { q: "As teclas são gravadas?", a: "Não. A detecção acontece localmente no navegador." }
    ]
  },
  pl: {
    title: "Test klawiatury online | Sprawdź wszystkie klawisze | GOATTYPE",
    description: "Darmowy tester klawiatury: sprawdź klawisze F1–F12, strzałki, blok numeryczny, martwe i zacinające się klawisze oraz ghosting.",
    keywords: ["test klawiatury", "tester klawiatury online", "test klawiszy", "sprawdź klawiaturę", "klawiatura numeryczna", "klawisz nie działa", "ghosting klawiatury"],
    eyebrow: "Bezpłatna diagnostyka w przeglądarce", hero: "Sprawdź każdy klawisz klawiatury online", intro: "Przetestuj pełną klawiaturę 104-klawiszową bez instalacji. Tryb pełnoekranowy wykrywa litery, cyfry, klawisze funkcyjne, nawigację, strzałki, modyfikatory i blok numeryczny.",
    launch: "Uruchom test klawiatury", guideLink: "Jak to działa", launchNote: "Test otwiera się na tej stronie. Naciśnij Esc lub Zakończ test, aby wrócić.", panelTitle: "Podczas testu", steps: ["Tester wypełnia ekran.", "Przechwytywanie uruchamia się automatycznie.", "Wykryte klawisze świecą i pozostają oznaczone.", "Esc lub Zakończ test zamyka narzędzie."],
    guideTitle: "Pełny przewodnik po teście klawiatury", sections: [
      { title: "Jak działa tester klawiszy", body: "Przeglądarka wysyła zdarzenia podczas naciskania i puszczania klawisza. GOATTYPE odczytuje kod fizycznej pozycji, dzięki czemu rozróżnia lewe i prawe modyfikatory. Jasny klawisz jest wciśnięty, a kolorowy został już wykryty." },
      { title: "Jak sprawdzić wszystkie klawisze", body: "Kolejno testuj litery, cyfry, znaki, Ctrl, Alt, Shift, F1–F12, Insert, Delete, Home, End, Page Up/Down, strzałki i numpad. Powtórz brakujące, podwójne lub opóźnione wejście w innym programie." },
      { title: "Laptop, Fn i multimedia", body: "W laptopach F1–F12 często sterują jasnością lub dźwiękiem. Wypróbuj Fn oraz Fn Lock. Firmware może obsłużyć polecenie przed przeglądarką, więc brak podświetlenia nie musi oznaczać uszkodzenia." },
      { title: "Blok numeryczny, ghosting i NKRO", body: "Włącz Num Lock i sprawdź cyfry, operatory, separator oraz Enter. Przytrzymaj kilka klawiszy, aby ocenić ghosting. Brak jednego wejścia może oznaczać limit rollover dla tej kombinacji." },
      { title: "Martwe, zacinające i podwójne klawisze", body: "Wyłącz sprzęt przed czyszczeniem, zmień kabel lub port, naładuj model bezprzewodowy i wyłącz mapowanie. Ten sam błąd na różnych komputerach wskazuje na przełącznik, taśmę, matrycę lub zalanie." },
      { title: "Prywatność i ograniczenia", body: "Test działa lokalnie i GOATTYPE nie zapisuje klawiszy. Print Screen, zasilanie i chronione skróty systemowe nie zawsze docierają do strony." }
    ],
    faqTitle: "Najczęstsze pytania o test klawiatury", faqs: [
      { q: "Jak sprawdzić, czy klawisz działa?", a: "Uruchom test i naciśnij klawisz; wykryty klawisz zaświeci się i pozostanie oznaczony." },
      { q: "Czy mogę sprawdzić blok numeryczny?", a: "Tak. Włącz Num Lock i przetestuj cyfry, operatory, separator i Enter." },
      { q: "Czy tester wykrywa ghosting?", a: "Pomaga wykryć praktyczne limity przy jednoczesnym naciskaniu kilku klawiszy." },
      { q: "Jak zakończyć test?", a: "Naciśnij Esc lub wybierz Zakończ test." },
      { q: "Czy naciśnięcia są zapisywane?", a: "Nie. Wszystko odbywa się lokalnie w przeglądarce." }
    ]
  },
  tr: {
    title: "Klavye testi online | Tüm tuşları ve numpad'i test et | GOATTYPE",
    description: "Ücretsiz klavye tuş testi: F1–F12, ok tuşları, numerik tuş takımı, basmayan tuş, çift basma, ghosting ve çoklu giriş kontrolü.",
    keywords: ["klavye testi", "online klavye testi", "klavye tuş testi", "tuş çalışıyor mu", "numerik tuş takımı", "basmayan tuş", "klavye ghosting testi"],
    eyebrow: "Ücretsiz tarayıcı tanı aracı", hero: "Klavyedeki her tuşu online test edin", intro: "Program yüklemeden tam boy 104 tuşlu klavyeyi kontrol edin. Tam ekran test; harfleri, sayıları, F tuşlarını, gezinme ve ok tuşlarını, değiştiricileri ve numerik tuş takımını algılar.",
    launch: "Klavye testini başlat", guideLink: "Nasıl çalışır", launchNote: "Test aynı sayfada açılır. Geri dönmek için Esc veya Testi bitir'e basın.", panelTitle: "Test sırasında", steps: ["Test aracı ekranı kaplar.", "Tuş yakalama otomatik başlar.", "Algılanan tuşlar yanar ve işaretli kalır.", "Esc veya Testi bitir ile çıkılır."],
    guideTitle: "Ayrıntılı klavye test rehberi", sections: [
      { title: "Online klavye testi nasıl çalışır?", body: "Tarayıcı, tuşa basıldığında ve bırakıldığında olay üretir. GOATTYPE fiziksel konum kodunu okuyarak sol ve sağ değiştiricileri ayırır. Parlak tuş basılıdır; renkli işaret daha önce algılandığını gösterir." },
      { title: "Tüm tuşlar nasıl kontrol edilir?", body: "Harfler, sayı satırı, noktalama, Ctrl, Alt, Shift, F1–F12, Insert, Delete, Home, End, Page Up/Down, oklar ve numpad'i sırayla deneyin. Basmayan, geciken veya çift basan tuşu başka uygulamada tekrarlayın." },
      { title: "Laptop Fn ve medya tuşları", body: "Dizüstünde F tuşları parlaklık, ses veya mikrofonu yönetebilir. Fn ve Fn Lock'u deneyin. Donanım yazılımı komutu tarayıcıdan önce işleyebilir; ekranda yanmaması mutlaka arıza değildir." },
      { title: "Numpad, ghosting ve NKRO", body: "Num Lock'u açıp rakamları, işlemleri, ondalık ve Enter'ı test edin. Ghosting için birkaç tuşu birlikte tutun. Eksik algılama, o kombinasyonda rollover sınırını gösterebilir." },
      { title: "Basmayan, takılan veya çift basan tuş", body: "Temizlemeden önce cihazı kapatın; farklı kablo/USB portu deneyin, kablosuzu şarj edin ve tuş eşleme yazılımlarını kapatın. Sorun farklı bilgisayarlarda sürerse switch, kablo veya sıvı hasarı olasıdır." },
      { title: "Gizlilik ve sınırlar", body: "Test yerel çalışır ve GOATTYPE tuşları kaydetmez. Print Screen, güç ve firmware tarafından yönetilen korumalı sistem komutları web sitesi tarafından güvenilir biçimde engellenemez." }
    ],
    faqTitle: "Klavye testi hakkında sık sorulan sorular", faqs: [
      { q: "Bir tuşun çalıştığını nasıl anlarım?", a: "Testi açıp tuşa basın; algılanırsa yanar ve işaretli kalır." },
      { q: "Numerik tuş takımını test edebilir miyim?", a: "Evet. Num Lock'u açıp rakamları, işlemleri ve Enter'ı deneyin." },
      { q: "Ghosting tespit edilir mi?", a: "Birden fazla tuşu tutarak pratik ghosting ve rollover sınırlarını görebilirsiniz." },
      { q: "Testten nasıl çıkarım?", a: "Esc tuşuna basın veya Testi bitir'i seçin." },
      { q: "Tuşlarım kaydediliyor mu?", a: "Hayır. Algılama yalnızca tarayıcınızda gerçekleşir." }
    ]
  },
  uk: {
    title: "Тест клавіатури онлайн | Перевірити всі клавіші | GOATTYPE",
    description: "Безкоштовна перевірка клавіатури: F1–F12, стрілки, цифровий блок, несправні та залиплі клавіші, ghosting і одночасні натискання.",
    keywords: ["тест клавіатури", "тест клавіатури онлайн", "перевірка клавіш", "перевірити клавіатуру", "цифровий блок", "не працює клавіша", "ghosting клавіатури"],
    eyebrow: "Безкоштовна діагностика у браузері", hero: "Перевірте кожну клавішу клавіатури онлайн", intro: "Протестуйте повнорозмірну клавіатуру зі 104 клавіш без встановлення програм. Повноекранний режим визначає літери, цифри, функціональні й навігаційні клавіші, стрілки, модифікатори та цифровий блок.",
    launch: "Запустити тест клавіатури", guideLink: "Як це працює", launchNote: "Тест відкривається на цій сторінці. Натисніть Esc або Завершити тест, щоб повернутися.", panelTitle: "Під час тесту", steps: ["Тестер заповнює екран.", "Захоплення клавіш починається автоматично.", "Розпізнані клавіші підсвічуються.", "Esc або Завершити тест закриває режим."],
    guideTitle: "Повний посібник із перевірки клавіатури", sections: [
      { title: "Як працює онлайн-тест", body: "Браузер створює події натискання та відпускання. GOATTYPE читає код фізичного розташування, тому розрізняє ліві й праві модифікатори. Яскрава клавіша натиснута; кольорова позначка означає, що її вже виявлено." },
      { title: "Як перевірити всі клавіші", body: "Послідовно перевірте літери, цифри, розділові знаки, Ctrl, Alt, Shift, F1–F12, Insert, Delete, Home, End, Page Up/Down, стрілки й numpad. Повторіть пропущені, подвійні або повільні натискання в іншій програмі." },
      { title: "Ноутбук, Fn і мультимедіа", body: "На ноутбуках F1–F12 можуть керувати яскравістю та звуком. Спробуйте Fn і Fn Lock. Прошивка може виконати команду раніше за браузер, тому відсутність підсвічування не завжди означає несправність." },
      { title: "Цифровий блок, ghosting і NKRO", body: "Увімкніть Num Lock і перевірте цифри, оператори, десяткову клавішу та Enter. Утримуйте кілька клавіш для перевірки ghosting. Втрачене натискання може вказувати на межу rollover матриці." },
      { title: "Залипання, повтори та несправні клавіші", body: "Перед очищенням вимкніть пристрій, змініть USB-порт або кабель, зарядіть бездротову модель і вимкніть переназначення. Однакова помилка на різних ПК може означати зношення, шлейф або пошкодження рідиною." },
      { title: "Конфіденційність і обмеження", body: "Тест працює локально, а GOATTYPE не зберігає натискання. Print Screen, живлення та захищені системні команди можуть не передаватися вебсторінці." }
    ],
    faqTitle: "Поширені запитання про тест клавіатури", faqs: [
      { q: "Як перевірити, чи працює клавіша?", a: "Запустіть тест і натисніть її; розпізнана клавіша засвітиться та залишиться позначеною." },
      { q: "Чи можна перевірити цифровий блок?", a: "Так. Увімкніть Num Lock і протестуйте цифри, оператори та Enter." },
      { q: "Чи визначає тест ghosting?", a: "Він допомагає побачити практичні обмеження під час одночасного натискання." },
      { q: "Як вийти з тесту?", a: "Натисніть Esc або Завершити тест." },
      { q: "Чи зберігаються натискання?", a: "Ні. Усе обробляється локально у браузері." }
    ]
  },
  id: {
    title: "Tes keyboard online gratis | Cek semua tombol & numpad | GOATTYPE",
    description: "Tes tombol keyboard, F1–F12, panah, numpad, tombol rusak atau macet, ghosting, dan input bersamaan langsung di browser.",
    keywords: ["tes keyboard", "tes keyboard online", "cek tombol keyboard", "keyboard tester", "tes numpad", "tombol keyboard tidak berfungsi", "keyboard ghosting"],
    eyebrow: "Diagnostik gratis di browser", hero: "Cek setiap tombol keyboard secara online", intro: "Uji keyboard penuh 104 tombol tanpa memasang aplikasi. Tes layar penuh mendeteksi huruf, angka, tombol fungsi, navigasi, panah, modifier, dan numpad serta menandai setiap tombol yang merespons.",
    launch: "Mulai tes keyboard", guideLink: "Cara kerja", launchNote: "Tes terbuka di halaman yang sama. Tekan Esc atau Akhiri tes untuk kembali.", panelTitle: "Saat tes berlangsung", steps: ["Tester memenuhi layar.", "Penangkapan tombol dimulai otomatis.", "Tombol terdeteksi menyala dan tetap ditandai.", "Esc atau Akhiri tes menutup alat."],
    guideTitle: "Panduan lengkap tes keyboard", sections: [
      { title: "Cara kerja keyboard tester", body: "Browser membuat event saat tombol ditekan dan dilepas. GOATTYPE membaca kode posisi fisik sehingga dapat membedakan modifier kiri dan kanan. Tombol terang sedang ditekan; tanda berwarna berarti sudah terdeteksi." },
      { title: "Cara mengecek semua tombol", body: "Uji huruf, baris angka, tanda baca, Ctrl, Alt, Shift, F1–F12, Insert, Delete, Home, End, Page Up/Down, panah, dan numpad. Ulangi input yang hilang, terlambat, atau ganda di aplikasi lain." },
      { title: "Laptop, Fn, dan tombol media", body: "Pada laptop, F1–F12 sering mengatur kecerahan, volume, atau mikrofon. Coba Fn dan Fn Lock. Firmware dapat menangani perintah sebelum browser, jadi tombol yang tidak menyala belum tentu rusak." },
      { title: "Numpad, ghosting, dan NKRO", body: "Aktifkan Num Lock lalu uji angka, operator, desimal, dan Enter. Tahan beberapa tombol untuk menguji ghosting. Input yang hilang pada kombinasi tertentu dapat menunjukkan batas rollover matriks." },
      { title: "Tombol rusak, macet, atau mengetik ganda", body: "Matikan perangkat sebelum membersihkan, coba kabel/port lain, isi daya keyboard nirkabel, dan nonaktifkan remapping. Masalah yang sama di beberapa komputer dapat berasal dari switch, kabel internal, atau cairan." },
      { title: "Privasi dan batasan", body: "Tes berjalan lokal dan GOATTYPE tidak menyimpan tombol. Print Screen, daya, dan perintah sistem yang dilindungi mungkin tidak dapat dicegah atau dideteksi oleh situs web." }
    ],
    faqTitle: "FAQ tes keyboard", faqs: [
      { q: "Bagaimana mengetahui tombol bekerja?", a: "Mulai tes dan tekan tombol; tombol yang terdeteksi akan menyala dan tetap ditandai." },
      { q: "Apakah numpad bisa diuji?", a: "Ya. Aktifkan Num Lock lalu cek angka, operator, desimal, dan Enter." },
      { q: "Apakah tes mendeteksi ghosting?", a: "Tes membantu melihat batas praktis saat beberapa tombol ditekan bersamaan." },
      { q: "Bagaimana keluar dari tes?", a: "Tekan Esc atau pilih Akhiri tes." },
      { q: "Apakah tombol yang ditekan disimpan?", a: "Tidak. Deteksi berlangsung lokal di browser." }
    ]
  },
  zh: {
    title: "在线键盘测试工具 | 检测全部按键、数字键盘与冲突 | GOATTYPE",
    description: "免费在线键盘按键检测：测试 F1–F12、方向键、数字小键盘、按键失灵、卡键、连击、键盘冲突和 N 键无冲。",
    keywords: ["在线键盘测试", "键盘按键检测", "键盘测试工具", "键盘坏键检测", "数字小键盘测试", "键盘失灵", "键盘冲突测试"],
    eyebrow: "免费的浏览器键盘检测工具", hero: "在线检测键盘上的每一个按键", intro: "无需下载安装软件，即可检测标准 104 键键盘。全屏测试支持字母、数字、F1–F12、导航键、方向键、修饰键和数字小键盘，并保留已成功触发的按键标记。",
    launch: "开始键盘测试", guideLink: "查看使用方法", launchNote: "测试会在当前页面全屏打开。按 Esc 或“结束测试”即可返回。", panelTitle: "测试开始后", steps: ["测试工具将覆盖整个屏幕。", "按键捕获会自动开始。", "检测到的按键会亮起并保持标记。", "按 Esc 或结束测试即可退出。"],
    guideTitle: "在线键盘测试完整指南", sections: [
      { title: "键盘测试工具如何工作", body: "按下和松开物理按键时，浏览器会产生键盘事件。GOATTYPE 读取按键的物理位置代码，因此可以区分左右 Shift、Ctrl、Alt 等键。高亮表示正在按下，带颜色标记表示本次测试已经检测成功。" },
      { title: "如何检测全部键位", body: "建议依次测试字母区、数字行、标点、修饰键、F1–F12、Insert、Delete、Home、End、Page Up/Down、方向键和数字小键盘。若出现漏键、重复输入或延迟，请重置后重复测试，并在其他程序中对比。" },
      { title: "笔记本 Fn 键与多媒体功能", body: "许多笔记本把 F1–F12 与亮度、音量、麦克风和背光功能组合。可尝试 Fn 或 Fn Lock。部分命令会被固件或系统提前处理，所以网页没有高亮并不一定代表物理按键损坏。" },
      { title: "数字小键盘、键盘冲突与 NKRO", body: "打开 Num Lock 后测试数字、运算符、小数点和 Enter。按住多个常用组合可检测键盘冲突和无冲能力；若其中一个按键丢失，可能是键盘矩阵在该组合上的 rollover 限制。" },
      { title: "按键失灵、卡键与连击", body: "清洁前先断电，尝试更换 USB 端口或线缆，为无线键盘充电，并暂时关闭改键软件。如果同一按键在多个浏览器和电脑上仍然异常，可能是轴体、薄膜、排线或进液问题。" },
      { title: "隐私与浏览器限制", body: "检测在本地浏览器完成，GOATTYPE 不保存按键内容。Print Screen、电源键以及系统或固件保护的快捷键可能无法被网页阻止或读取。" }
    ],
    faqTitle: "键盘测试常见问题", faqs: [
      { q: "怎样判断键盘按键是否正常？", a: "启动测试并按下按键；被浏览器检测到后，该键会亮起并保持标记。" },
      { q: "可以测试数字小键盘吗？", a: "可以。打开 Num Lock，再测试数字、运算符、小数点和 Enter。" },
      { q: "能检测键盘冲突或鬼键吗？", a: "可以辅助检测。按住多个按键并比较屏幕高亮和同时按下计数。" },
      { q: "怎样退出全屏测试？", a: "按 Esc，或点击顶部的“结束测试”。" },
      { q: "网站会记录我的按键吗？", a: "不会。按键检测只在本地浏览器中运行。" }
    ]
  },
  ja: {
    title: "キーボードテスト｜全キー・テンキー・故障をオンライン確認 | GOATTYPE",
    description: "無料オンラインキーボードテスト。F1～F12、矢印、テンキー、反応しないキー、チャタリング、ゴースト、同時入力を確認できます。",
    keywords: ["キーボードテスト", "キーボードテスト オンライン", "キーボード故障チェック", "キー入力テスト", "テンキーテスト", "キーが反応しない", "キーボード ゴースト"],
    eyebrow: "ブラウザで無料診断", hero: "キーボードの全キーをオンラインで確認", intro: "ソフトをインストールせず、標準104キーをチェックできます。全画面テストで文字、数字、F1～F12、ナビゲーション、矢印、修飾キー、テンキーを検出し、反応したキーを記録します。",
    launch: "キーボードテストを開始", guideLink: "使い方を見る", launchNote: "同じページで全画面表示されます。Esc または「テスト終了」で戻れます。", panelTitle: "テスト中の動作", steps: ["テスターが画面全体に表示されます。", "キー検出は自動で開始します。", "検出したキーが点灯し、記録されます。", "Esc またはテスト終了で閉じます。"],
    guideTitle: "キーボード故障チェックの完全ガイド", sections: [
      { title: "オンラインキーボードテストの仕組み", body: "物理キーを押して離すと、ブラウザにキーボードイベントが届きます。GOATTYPE は物理位置の code を使うため、左右の Shift、Ctrl、Alt を区別できます。明るいキーは押下中、色付きは検出済みです。" },
      { title: "全キーを正しく確認する方法", body: "文字、数字列、記号、修飾キー、F1～F12、Insert、Delete、Home、End、Page Up/Down、矢印、テンキーの順に確認します。反応しない、二重入力、遅延があるキーはリセットして別アプリでも再確認してください。" },
      { title: "ノートPCのFnキーとメディアキー", body: "ノートPCではFキーが明るさ、音量、マイクなどを操作する場合があります。FnやFn Lockを試してください。ファームウェアが先に処理するとブラウザへ届かないため、点灯しないだけで故障とは断定できません。" },
      { title: "テンキー、ゴースト、Nキーロールオーバー", body: "Num Lockをオンにして数字、演算子、小数点、Enterをテストします。複数キーを同時に押し、点灯数を確認するとゴーストやロールオーバー制限を調べられます。" },
      { title: "反応しないキーとチャタリング", body: "電源を切って清掃し、USBポートやケーブルを変え、無線モデルを充電し、キー割り当てソフトを停止します。複数端末で同じ症状なら、スイッチ、配線、液体損傷の可能性があります。" },
      { title: "プライバシーと制限", body: "テストはブラウザ内で処理され、GOATTYPEは入力を保存しません。Print Screen、電源、OSやファームウェアが保護する操作はWebページで確実に無効化できません。" }
    ],
    faqTitle: "キーボードテストのよくある質問", faqs: [
      { q: "キーが正常かどうか確認するには？", a: "テストを開始して押します。検出されると点灯し、その後もマークが残ります。" },
      { q: "テンキーもテストできますか？", a: "はい。Num Lockをオンにし、数字、演算子、小数点、Enterを確認します。" },
      { q: "ゴーストを検出できますか？", a: "複数キーを同時に押し、画面の点灯と押下数を比較できます。" },
      { q: "テストを終了するには？", a: "Escキーを押すか、「テスト終了」を選択します。" },
      { q: "入力内容は保存されますか？", a: "いいえ。検出はブラウザ内だけで行われます。" }
    ]
  },
  ko: {
    title: "키보드 테스트 온라인 | 모든 키·숫자 키패드 고장 확인 | GOATTYPE",
    description: "무료 키보드 테스트로 F1–F12, 방향키, 숫자 키패드, 먹통 키, 중복 입력, 고스팅, NKRO와 동시 입력을 확인하세요.",
    keywords: ["키보드 테스트", "키보드 테스트 온라인", "키보드 고장 확인", "키 입력 테스트", "숫자 키패드 테스트", "키보드 키 안됨", "키보드 고스팅"],
    eyebrow: "브라우저 무료 진단", hero: "키보드의 모든 키를 온라인으로 확인하세요", intro: "설치 없이 표준 104키 키보드를 검사합니다. 전체 화면 테스트에서 문자, 숫자, F1–F12, 탐색키, 방향키, 조합키와 숫자 키패드를 감지하고 정상 입력된 키를 표시합니다.",
    launch: "키보드 테스트 시작", guideLink: "사용 방법", launchNote: "같은 페이지에서 전체 화면으로 열립니다. Esc 또는 테스트 종료를 누르면 돌아옵니다.", panelTitle: "테스트가 시작되면", steps: ["테스터가 화면 전체를 채웁니다.", "키 감지가 자동으로 시작됩니다.", "감지된 키가 켜지고 표시가 유지됩니다.", "Esc 또는 테스트 종료로 닫습니다."],
    guideTitle: "키보드 고장 확인 전체 가이드", sections: [
      { title: "온라인 키보드 테스트 작동 방식", body: "물리 키를 누르고 떼면 브라우저가 키보드 이벤트를 생성합니다. GOATTYPE은 물리 위치 code를 읽어 좌우 Shift, Ctrl, Alt를 구분합니다. 밝은 키는 누르는 중이고, 색 표시가 남은 키는 감지 완료입니다." },
      { title: "모든 키를 확인하는 순서", body: "문자, 숫자열, 기호, 조합키, F1–F12, Insert, Delete, Home, End, Page Up/Down, 방향키, 숫자 키패드 순으로 테스트하세요. 누락, 지연, 중복 입력은 초기화 후 다른 앱에서도 비교합니다." },
      { title: "노트북 Fn 및 미디어 키", body: "노트북 F키는 밝기, 음량, 마이크를 제어할 수 있습니다. Fn과 Fn Lock을 시도하세요. 펌웨어가 브라우저보다 먼저 처리하면 화면에 표시되지 않을 수 있으므로 곧바로 고장으로 판단하면 안 됩니다." },
      { title: "숫자 키패드, 고스팅, NKRO", body: "Num Lock을 켜고 숫자, 연산자, 소수점, Enter를 확인합니다. 여러 키를 동시에 눌러 화면 표시와 카운터를 비교하면 키 씹힘, 고스팅, 롤오버 한계를 점검할 수 있습니다." },
      { title: "먹통 키, 키 끼임, 중복 입력", body: "전원을 끄고 청소한 뒤 USB 포트나 케이블을 바꾸고 무선 키보드를 충전하며 키 매핑 프로그램을 끕니다. 여러 PC에서 같은 증상이면 스위치, 케이블 또는 침수 문제일 수 있습니다." },
      { title: "개인정보와 한계", body: "테스트는 브라우저에서만 실행되며 GOATTYPE은 키 입력을 저장하지 않습니다. Print Screen, 전원, OS나 펌웨어가 보호하는 명령은 웹사이트가 확실히 차단할 수 없습니다." }
    ],
    faqTitle: "키보드 테스트 자주 묻는 질문", faqs: [
      { q: "키가 정상인지 어떻게 확인하나요?", a: "테스트를 시작하고 누르세요. 감지되면 불이 켜지고 표시가 남습니다." },
      { q: "숫자 키패드도 테스트할 수 있나요?", a: "네. Num Lock을 켜고 숫자, 연산자, 소수점, Enter를 확인합니다." },
      { q: "고스팅을 확인할 수 있나요?", a: "여러 키를 동시에 눌러 표시된 키와 동시 입력 수를 비교할 수 있습니다." },
      { q: "테스트를 어떻게 종료하나요?", a: "Esc를 누르거나 테스트 종료 버튼을 선택하세요." },
      { q: "키 입력을 저장하나요?", a: "아니요. 감지는 브라우저 내부에서만 처리됩니다." }
    ]
  }
};
