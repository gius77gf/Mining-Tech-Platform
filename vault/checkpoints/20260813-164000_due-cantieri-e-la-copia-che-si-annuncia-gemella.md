# Checkpoint — 2026-08-13 16:40 UTC

## Tipo
unit-complete (due unità raccolte)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimi commit
- `ad27934` — *Campo: il campo dei minuti svuotato non è «zero minuti di fermo»*
- `438c0c1` — *Scudo: quattro regole già scritte in casa, e la copia più debole
  proprio dove l'app doveva DIRE qualcosa*
(prima: `75aee70` checkpoint di Flotta, `d222d37` l'unità di Flotta)

## Che cosa è stato completato

**B0-duodecies, le due terze parti**: Campo e Scudo letti tutti, riga per riga.

### Campo — 32 punti guardati, **un difetto vero**
Conferma il rapporto delle altre cinque app (48 clamp giusti su 52 giudicati):
chi apre quella riga della roadmap deve **leggere**, non correggere a tappeto.

Il difetto è `apps/campo/index.html:3523`, il punto in cui si **salvano** i
minuti di fermo digitati sull'anomalia:
`Math.max(0, Math.round(+e.target.value || 0))`. Chi **svuota** il campo
scriveva nel database `fermoMin: 0`, e da lì in poi l'assenza non era più
recuperabile da nessuno — il ripiego arrivava **prima** di chiunque sapesse
distinguere «si è fermato e non è costato niente» da «nessuno l'ha misurato».

⛔ E il danno si vedeva **sullo stesso foglio stampato**, in due tabelle a poche
righe di distanza: la tabella delle causali scriveva «Guasto meccanico | 1 |
**0 min**» *senza* la coda «N su M senza i minuti registrati», mentre la tabella
della disponibilità, più giù, diceva già «2 fermi (**di cui 1 senza minuti**)».
Il CSV usciva con `;0`, cioè una misura per chi apre il file e somma la colonna.
La regola giusta era **già scritta in quel file**, sul campo «Persone» delle
squadre: la solita regola scritta due volte, la seconda più debole.

### Scudo — 48 righe più la lettura delle ore, **quattro difetti**
E tutti e quattro della stessa famiglia: *una regola che il file usa già
altrove, ricopiata più debole proprio dove l'app doveva dire qualcosa*.

1. **Il cartellone «Giorni senza infortuni» scriveva `NaN`.** L'ultimo
   infortunio si sceglieva con una **forma** (`/^\d{4}-\d{2}-\d{2}$/`), non con
   un valore: «2026-13-45» quella forma ce l'ha, e siccome `ultimo` si sceglie
   confrontando **stringhe** una data impossibile vince sempre. Misurato: un
   infortunio vero del 01/06/2026 più quella riga → **NaN** al posto di **73**,
   col riquadro giallo per giunta (`NaN >= 30` è falso).
   Nell'altro verso: tre infortuni con tutte le date illeggibili → «**Nessun
   infortunio registrato**», la frase più tranquilla della schermata, mentre la
   riga sotto contava «Infortuni: 3». *L'assenza di una data non è l'assenza di
   un infortunio.*
2. **Gli indici IF/IG/LTIFR sceglievano le ore fra due registrazioni
   contraddittorie** — la pagina prendeva la **prima** che capita, mentre il
   modulo si rifiuta di sceglierne una con la ragione scritta. Misurato con
   20.000 e 45.000 ore per il 2026: «IF 50,00 · IG 0,60 · LTIFR 50,00» in una
   scheda e «l'indice non si calcola» in quella **subito sotto, sullo stesso
   schermo**. Con l'altro record per primo: **IF 22,22**. Sono i tre numeri che
   si portano in gara.
3. **La prognosi ancora aperta valeva «zero giorni»** nell'elenco degli eventi
   da analizzare (`+null` fa 0) — proprio l'evento su cui l'ente chiede conto,
   che il commento della funzione promette di mettere per primo. La quinta
   copia era la testata della modale «Perché è successo».
4. **Il fascicolo del lavoratore taceva su una nomina con la data di fine
   illeggibile**, e il suo commento dichiarava «è la stessa regola di
   `organigrammaSicurezza`»: **la copia debole che si annuncia gemella**.

## Che cosa ha detto la misura

| controllo | esito |
|---|---|
| `run-kpi` | 2054 → **2058** (Campo) → **2063** (Scudo), 0 falliti |
| `run-stile` | 318, 0 falliti |
| `sintassi-pagine` | 34, 0 falliti |
| `import-esistenti` | 163, 0 falliti |
| `funzioni-mai-usate` | 4, 0 falliti |
| `nomi-liberi` | 24, 0 falliti |
| `copertura-funzioni` | 11 soggetti a posto, 0 senza prova |
| `numeri-nei-documenti` | 41, 0 falliti |

Documenti aggiornati **due volte, una per unità**: 2.506 → 2.510 → **2.515**.
Verificato ogni volta sulla **copia di quello che si committa**, non sull'albero
vivo (che portava anche l'altro cantiere).

⚠️ **Una cosa che ho verificato io e non ho preso sulla parola**: il cantiere di
Scudo ha scritto `anIndici.anni.find(r => r.anno === annoOra)` dicendo che
`andamentoIndici` arriva sempre fino ad `annoFine`. Se non fosse vero la pagina
**crollerebbe**. Provato con tre stati (tutto vuoto; ore di un altro anno; un
infortunio e nessuna ora): l'anno in corso c'è in tutti e tre.

## Quello che i cantieri hanno MISURATO E NON CORRETTO
Sta nella riga **B0-duodecies** della roadmap, e sono decisioni, non sviste:
- Campo: **`0` ha due letture opposte**, e tutt'e due blindate da prove verdi
  (`minutiFermoDi` dice «una misura», cinque altri posti dicono «non misurato»);
- Campo: **`mediaFermiAlGiorno` dà `media: 0`** dove non è stato misurato
  niente → **cantiere aperto adesso** (vedi sotto);
- Scudo: **`giornateAssenza` ramo near-miss** trasforma un valore *presente ma
  illeggibile* in **0**. Non si corregge di testa propria perché far tornare
  `null` scriverebbe la **parola** `null` nella cella del registro RSPP — il
  difetto già pagato in Conti. Va deciso **insieme a come quella cella esce**.

## Che cos'è vivo adesso
- **Giro completo del browser** — partito alle 15:59:58 UTC; alle 16:36 aveva
  chiuso **9 passate su 188**. Gira su una copia di `e3fa4ee`: dirà lo stato di
  stamattina, non quello di adesso.
- **`giro-node.mjs`** — lanciato alle 16:36 per **leggere** (non prevedere) il
  totale del giro `node`, che i documenti dichiarano ancora **2.839**: con le 9
  prove di oggi è cambiato, e in questa casa quel numero si legge dal giro —
  due previsioni, due errori.
- **Cantiere sul core** (B0-duodecies, gli 8 clamp sospetti di `index.html`).
- **Cantiere su Campo**, `mediaFermiAlGiorno` / `fermiPerGiorno`.

## Prossimo passo atomico
**Leggere l'uscita di `giro-node.mjs`** in
`scratchpad/giro-node.txt` e aggiornare col numero **letto** (non previsto) le
righe che dichiarano **2.839** in `docs/DEVELOPMENT.md`, `docs/STATO_PRODOTTO.md`
e `vault/ROADMAP_SETTIMANA.md`; poi rilanciare `giro-node.mjs` per farsi dire
dalla sua sorveglianza che adesso combaciano, e committare. Nel frattempo
raccogliere i due cantieri quando consegnano, con la solita disciplina: diff
letto riga per riga, blocco di prove estratto **senza la prosa intorno**,
`run-kpi` **letto** prima di scrivere il messaggio del commit.

## Blocchi
- **B0-septies** (che cosa vede chi apre il 2D di una volata senza maglia) e le
  **soglie di sicurezza** (`ppvLimit`, curve USBM/DIN): fermi al fondatore.
