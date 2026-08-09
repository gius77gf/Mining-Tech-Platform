# Checkpoint — 2026-08-09T16:15:46Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`a44d076`

## Task completato

**Tre unità: un difetto di prodotto chiuso, un buco di copertura trovato, e il
denominatore che dice quanto è grande.**

| | |
|---|---|
| Scudo `#vf-esito` a 320 px | **250 px in 242** → **179**, chiuso (`a52823c`) |
| bottoni d'uscita dell'ecosistema | **39 censiti, 1 senza banco** |
| il primo conto di quel censimento | **44 e 3, due falsi allarmi miei** |

## Le tre cose imparate

1. ⛔ **UN DIFETTO PUÒ VIVERE A UNA SOLA LARGHEZZA, E MISURARNE UNA RISPONDE
   «A POSTO».** `#vf-esito` chiedeva **250 px in 242** a 320 px e si leggeva
   «— nessun esito registrat…»; a **360, 390 e 430 ci stava**. Non è un difetto
   che si vede aprendo la finestra: si vede solo sullo schermo più stretto, che
   è quello con cui si lavora in cava.
   ⚠️ **E il righello del cantiere sbagliava**, nel modo di sempre: «lo spazio»
   calcolato come `clientWidth - padding` dava **214 px** a 320, cioè «ci sta».
   Un `<select>` di Chromium disegna **la freccia dentro la propria scatola di
   contenuto** (~20 px) e quel conto non la toglie — lo scarto è 18-20 px alla
   cifra a tutte e quattro le larghezze. La domanda giusta **non si calcola**:
   si chiede al browser un clone con `width:max-content`.
   ⚠️ Dopo la correzione i **bersagli di tocco** sono stati rimisurati, elencati
   e non solo contati: sette elementi, tutti ≥44×44. È la trappola già pagata —
   una correzione di layout che rende un bottone largo 16 px è **peggio** del
   difetto di partenza, perché invisibile a chi misura l'overflow.
2. ⛔ **IL PONTE FRA DUE APP È IL PUNTO D'USCITA CHE NESSUNO PREME.** Fatta a
   Campo la domanda che `CLAUDE.md` fa alle altre cinque app: tutti e cinque i
   suoi punti d'uscita compongono il file **nel modulo** — la parte statica è
   pulita, ed è la parte **debole** (su quelle cinque app il censimento statico
   dava zero, e i ventiquattro difetti li ha trovati chi ha **premuto il
   bottone**). E il bottone, qui, non lo preme nessuno:
   `grep -rl btn-piano-export apps/deepwork-id/tests/browser/` → **niente**,
   mentre gli altri quattro escono tutti in `campo-numeri-tranquilli.mjs`.
   ⚠️ Il file che produce è quello che il messaggio invita a rileggere **in
   Genesi → Riconciliazione**: Campo lo scrive, **un'altra app lo legge**.
3. ⛔ **UN CENSIMENTO CHE SELEZIONA PER NOME INVECE CHE PER COSA È TROVA
   SOGGETTI CHE NON ESISTONO.** Il denominatore dice **39 bottoni, 1 senza
   banco** — copertura al 97%, e il buco è quello. Ma il **primo** conto diceva
   44 e 3: cercando gli `id` senza pretendere che fossero `<button>` avevo
   raccolto `pdfm-cava` e `pdfm-mese` del core, che sono un `<select>` e un
   `<input type="month">` **dentro** la finestra del PDF. Accusavano il core —
   la superficie che il fondatore mostra per prima — di due buchi che non ha.
   ⚠️ È successa **mentre misuravo un buco vero**, ed è la stessa forma del «un
   nome dentro una regex» che questa settimana è già costata un elenco intero.

## Verifiche
- `giro-node` **34 comandi a posto, 0 caduti** sulla copia del committato, per
  ognuna delle tre unità
- la stringa di Scudo rimisurata da me: l'unica occorrenza lunga rimasta è la
  **citazione dentro il commento**, la viva è corta
- `numeri-nei-documenti` **34/0** sulla copia (le righe rosse sull'albero vivo
  sono dei cantieri in corso)

## Deciso e NON fatto, con la misura
- **la quinta pressione di Campo**: vuole la fixture di un piano importato, ed è
  un'unità sua. Sta in roadmap come **B3-bis** col comando che la riapre;
- **`#vf-esito` non si tronca coi puntini**: è un'etichetta nostra, si scrive
  corta. `accorciaVoceTendina` di Sentinella resta dov'è.

## Ancora aperto, misurato
⛔ **`#vf-ente`** — «Soggetto pubblico o privato abilitato» chiede **302 px** e
taglia a **320 e a 360**: peggio di quello appena chiuso, perché tocca due
larghezze. Vive in `apps/scudo/scudo-data.js`; il cantiere è stato **riaperto**
con l'autorizzazione a toccarlo.
⚠️ E la correzione di `#vf-esito` **non è tenuta chiusa da nessuna prova**:
nessuna suite misura la larghezza intrinseca di una tendina dentro una modale, e
un `<select>` con `overflow:hidden` risponde **sempre** `scrollWidth ==
clientWidth` — che è precisamente perché il difetto era sopravvissuto. Il banco
è stato chiesto allo stesso cantiere.

## Il giro del browser
Vivo dalle **13:03:34Z**, **3h12**, **149 passate su 161**. ⚠️ Il registro non
scrive da quasi quattro minuti, ma la domanda giusta non è sul file: il giro ha
un **figlio vivo** il cui tempo di CPU sale, quindi sta lavorando.
⚠️ Due KO letti nel registro — `dw-doppione` e «112 promettono e non
mantengono» — sono tutt'e due **dentro una controprova dichiarata**: rosso
VOLUTO, nessun cantiere da aprire.

## Cantieri paralleli aperti
Tre: **Genesi** (MIC «non calcolabile» — ripartito dopo essere morto per un
errore di rete), **Scudo** (banco nuovo + `#vf-ente`) e **contrasto delle
finestre a 390 e 320 px**.

## Prossimo passo atomico
1. Raccogliere i tre cantieri, **rimisurare** e committare io. Per Genesi la
   prova che il lavoro è finito è `run-stile` **di nuovo a 318**.
2. Leggere il giro quando finisce: `leggi-giro.mjs`, ordine **età → righe «non
   ho guardato» → KO veri**.

## Blocchi
In attesa del fondatore: **`#vf-ente`** (art. 71 c.11 — la voce di legge, non la
larghezza); **quali** delle 47 mancanze confermate diventino lavoro; e se
`disponibilitaTurno` debba restare **100%** su un turno chiuso senza fermi.
