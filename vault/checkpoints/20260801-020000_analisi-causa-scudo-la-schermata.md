# L'analisi della causa in Scudo: la schermata

**Data:** 01/08/2026 · **App:** Scudo
**Unità precedente:** `20260801-013000_il-giro-su-una-copia.md`

## Cosa è stato fatto

Lo strato dati dell'analisi della causa era già provato (12 prove in
`run-kpi`). Adesso si usa, e in tre posti:

- **Registro eventi** — su ogni evento senza analisi una pastiglia **gialla
  «0 perché»** che si tocca e apre. Su chi ce l'ha, la causa entra nella riga
  di dettaglio (`· causa: Organizzativa`) e resta la matita ✎ per riaprirla.
  Un evento senza un perché **non è un evento a posto**: lo dice con la parola
  *e* col colore, non con un silenzio tranquillo.
- **Quadro → Urgenze** — «Perché è successo non è scritto», con quanti sono e
  da quale conviene cominciare.
- **Sezione «Perché succedono»** — quante analisi su quanti eventi, una riga
  per famiglia di causa, e il grafico **solo** quando il confronto regge.

E la modale dei cinque perché: tre righe che crescono fino a cinque, le sei
famiglie, la data e chi l'ha scritta.

## Il punto che conta: chiede, non vieta

Mentre si scrive compaiono **solo le domande**. Gli avvisi che bloccano —
meno di due perché, famiglia non scelta — compaiono al salvataggio: dire
«manca il secondo perché» a un campo appena aperto è rimproverare chi non ha
ancora cominciato.

E quando l'ultimo perché **nomina una persona**, il riquadro diventa giallo e
chiede *«è quello che è successo, o è la persona a cui è successo?»* — ma il
pulsante **resta attivo e l'analisi si salva**. Poi la domanda si ripete nella
finestra «Analisi salvata», con «Torno a correggere» / «Apri un'azione
correttiva», così non sparisce insieme alla modale.

## ⛔ Il principio, applicato dove sarebbe stato comodo non applicarlo

`leggibile: false` **non nasconde le righe** — il poco che c'è non si nasconde
— ma non disegna **nessun grafico** e non nomina **nessuna tendenza**: scrive
il motivo, «2 eventi analizzati su 6». Una freccia disegnata su due punti è
esattamente un colore tranquillo dove non è stato misurato niente.

E una guardia che il piano non aveva: `righe[0]` può non esistere **anche con
`leggibile: true`**, se un'analisi porta una famiglia che il modulo non
conosce più (un dato vecchio, un import). Leggerlo senza guardare avrebbe
ucciso la pagina **al disegno**, senza nessun errore di sintassi.

## ⚠️ Il difetto vero l'ha trovato il confronto affiancato, non il codice

Il metodo del confronto (direttiva 4) chiede di mettere il risultato **accanto**
al riferimento. Messe le due versioni una di fianco all'altra a 430 px:

| riga del registro | prima | dopo |
|---|---|---|
| Pietra caduta dal cassone | acts **79 px** | **44** |
| Riparo del nastro 3 | **79** | **44** |
| Blocco staccato dal ciglio | **79** | **44** |
| Dumper e pick-up incrociati | **79** | **44** |
| Caduta massi vicino al perforatore | **68** | **44** |
| Taglio alla mano | **68** | **44** |

**Prima: tutte e sei** le righe mandavano la barra dei comandi a capo, con la
✕ da sola in fondo. **Dopo: zero.**

E la parte che conta: **non era colpa del lavoro nuovo**. Il colpevole era
«1 azione chiusa», 120 px, scritta **due volte identica** in due elenchi
diversi (registro eventi e ispezioni) — la duplicazione che questo progetto ha
già pagato più volte. Adesso è una funzione sola, `badgeAzioni`, e dice
**«1 chiusa»** (73 px): che è anche la forma **coerente** con la sua vicina
«1 da chiudere», la quale il sostantivo lo omette già. Il testo è corto per
misura, non per gusto, ed è scritto nel commento perché non torni lungo.

Senza il confronto affiancato avrei committato una schermata che *funziona*
e lasciato in piedi sei righe a capo su sei.

## ⚠️ Correzione a una mia correzione

In `2a52a6d` ho scritto che il mio `git add -A` aveva inghiottito «400 righe
della schermata dei lotti di Terra». Vero, ma **incompleto**: `31f4d5b`
portava dentro **anche Scudo** — +348 in `index.html`, +44 in
`scudo-data.js`. Una correzione che sottostima il danno è ancora un resoconto
sbagliato. Quel lavoro è verificato adesso, con questa unità.

## Verifica

- `run-stile` **268/0**, `run-kpi` **1079/0**, `run-helpers` **49/0**,
  `run-demo` **7/0** — tutte con `TZ=Europe/Rome`.
- copertura **9 soggetti a posto, 0 funzioni senza prova**; nomi doppi
  **26 guardati, 0 da sistemare**.
- Pagina viva, 430 px: **nessun `pageerror`**. Scatti guardati, non solo
  prodotti (`scratchpad/mio-scudo/zoom.png`).
- Misura del prima/dopo su **worktree di `HEAD`**, non modificando i file vivi.
- Nessuna classe inventata: `<span class="arr">✎</span>` è l'idioma che Scudo
  usa già alle righe 1449 e 1936; il CSS **estende** selettori esistenti.
- Barra in basso: **6 voci, `--nav-cols:6`** (regola 19).
- Banco del contrasto su tutte le superfici: **3.631 testi misurati, 0 sotto
  soglia** (Scudo 347). Girato **da solo**, senza altre sessioni di Chromium.

## Misurato, e lasciato fuori di proposito

La matita ✎ è **30×30 px**, sotto il bersaglio da 44 che il core usa altrove.
Non è un difetto introdotto qui: è la misura di **`.arr`**, cioè di *tutte* le
matite dell'app (modifica lavoratore, modifica azione, rinnova scadenza).
Allargarla solo qui la renderebbe l'unica diversa; allargare `.arr` è una
decisione che tocca sei elenchi e va misurata sulle righe strette, non
infilata in coda a un'altra unità. La pastiglia «0 perché», che è il comando
che serve davvero — la matita apre solo ciò che qualcuno ha già scritto — ha
invece l'area di tocco piena, con l'`::after` a `inset:-13px -3px`.

## Prossimo passo atomico

**Lanciare il giro completo del browser sulla copia** (`tutti.mjs`), da solo e
senza altre sessioni di Chromium aperte, e leggerlo fino in fondo. È la prima
volta che si può fare senza fermare il cantiere: il giro serve un
`git worktree` congelato, quindi mentre gira si può continuare a scrivere.
