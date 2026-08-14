# La bandiera che nessuno legge (regola 20)

**Data:** 01/08/2026 · **Area:** suite di stile (trasversale)
**Unità precedente:** `20260801-020000_analisi-causa-scudo-la-schermata.md`

## Cosa è stato fatto

Il principio del fondatore — **«l'assenza di un dato non è un dato
favorevole»** — era scritto in `CLAUDE.md` e basta. Ma questo progetto ha già
imparato che *una regola scritta è affidata alla memoria di chi legge*: la
regola del `shared/` era lì da mesi e in un giorno solo ne sono uscite cinque
violazioni.

Adesso una sua parte è **verificabile**, ed è la regola 20 di `run-stile.mjs`:

> Quando un modulo si accorge di non poter misurare qualcosa, lo dichiara con
> una bandiera accanto al numero (`misurabile`, `leggibile`, `calcolabile`,
> `noto`, `attendibile`, `pochi`). Una bandiera che **nessuno legge** non
> protegge niente: la pagina disegna il numero tranquillo lo stesso, e il
> modulo sembra a posto perché la dichiarazione c'è.

È la stessa forma della **guardia scollegata** già raccolta due volte: il
`<script>` dimenticato della regola 17, e l'impronta non collegata al giro.
Il pezzo esiste, e non è attaccato a niente.

Suite: **268 → 271**.

## ⚠️ Come è nata: da un mio censimento sbagliato, due volte

Questa regola non l'ho progettata: l'ho **corretta due volte** prima che dicesse
qualcosa di vero. Vale la pena scriverlo, perché tutt'e due gli errori sono
nell'elenco di `CLAUDE.md` e li ho fatti lo stesso.

**Primo errore — il commento preso per codice.** La prima stesura cercava
`\bbandiera\s*:` nel testo e ha accusato due funzioni sane, in Scudo e in
Terra. Le due «dichiarazioni» erano:

```
} catch (e) { /* backend assente: demo */ }
// ⛔ Misurato su un cono di volume noto: il …
```

Due commenti. È esattamente il difetto della scansione che perdeva la fase, in
piccolo. La correzione non è stata scrivere un tokenizzatore migliore: è stata
**smettere di scriverne uno** e usare `mascheraCodice`, che nel file c'è già ed
è l'unico pezzo con una prova dedicata a sé stesso.

**Secondo errore — la regola pretendeva la lettura nel posto sbagliato.** La
seconda stesura chiedeva che la bandiera fosse letta **dalla pagina**, e
accusava `origineDi` di Terra, che restituisce `noto`. Ma `noto` lo consuma
`descriviOrigine`, **dentro il modulo** — ed è il disegno giusto: la pagina non
deve sapere niente di `noto`, se no la provenienza sarebbe decisa in due posti,
che è la regola 7. Cioè il controllo accusava proprio il codice fatto bene.

## ⛔ Il vocabolario è corto di proposito, e le parole buttate fuori contano

Sono state provate e **scartate**, con la ragione scritta nel file:

- **`misurato`** — in `scartoPpvVolata` è il **valore** misurato, gemello di
  `previsto`. Non è una bandiera, è un numero. La prima stesura ci si è
  impigliata e ha segnalato una funzione che si difende già benissimo (torna
  `null` e la pagina scrive «non misurata»).
- **`assente`, `mai`** — in Campo e Sentinella sono **stati** (`stato: "mai"`)
  o variabili locali, non proprietà che dichiarano una non-misurabilità.

Una parola ambigua non rende la regola più severa: la rende **rumorosa**, e una
regola rumorosa prima o poi si spegne.

## ⛔ E la copertura vera è dichiarata, non lasciata intendere

Le app che usano questo vocabolario sono **tre su sei**: Conti, Scudo e Terra.
Campo e Sentinella la non-misurabilità la dicono in un altro modo (uno
`stato: "mai"`, un `null` di ritorno) e **Flotta non la dichiara affatto**.

Quindi «nessuna violazione» qui **non** vuol dire «tutte le app sono a posto»:
vuol dire che le bandiere che esistono sono attaccate a qualcosa. La prova dei
soggetti stampa i numeri app per app proprio perché quello zero non venga letto
per più di quello che è — è la lezione del fondo di `copertura-funzioni.mjs`,
che prometteva di vedere un caso che non vedeva.

## La controprova, in quattro direzioni

Non tocca nessun file: la funzione controllata prende **il testo**, non un
percorso (il 01/08 una controprova ha girato con `sed` sul modulo vero mentre
girava un giro del browser — proprio ciò che `impronta.mjs` esiste per
impedire).

1. **Il difetto vero**: una bandiera dichiarata nel codice e mai letta →
   la regola deve dare **esattamente una** segnalazione.
2. **Il commento** che contiene la stessa parola → **non** è una dichiarazione.
   *(È il falso positivo che ha fatto nascere la regola: adesso è fermo per
   sempre invece di vivere nella memoria di chi c'era.)*
3. **La stringa** mostrata all'utente che contiene la stessa parola → idem.
4. **Il verso opposto**: aggiunta una lettura vera, la segnalazione **sparisce**.
   Un controllo che non sa riabilitarsi segnala per sempre, e allora lo si
   spegne.

E sul file vero, senza difetto, la regola deve dare **zero**: se ne desse
comunque, non starebbe distinguendo niente.

## Verifica

`TZ=Europe/Rome node apps/deepwork-id/tests/run-stile.mjs` → **271 passati,
0 falliti** (erano 268: +3 prove). Intestazione aggiornata a 20 regole, e la
prova che conta le voci elencate lo conferma da sé.

## Prossimo passo atomico

Raccogliere i sei cantieri del **censimento del principio** (un agente per app,
in corso) e committarli **uno per uno dopo la verifica**, mai con `git add -A`.
⚠️ Tutti e sei scrivono in `apps/deepwork-id/tests/run-kpi.mjs`: alla fine va
controllato che il totale sia salito **della somma delle prove dichiarate**, e
non solo che i falliti siano zero — se due scritture si sono sovrapposte, le
prove perse non fanno rumore.
