# Checkpoint — 2026-08-09T12:02:23Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`68262ab`

## Task completato

**Il giro del browser letto — e i suoi 14 KO sono DUE famiglie sole**, più due
difetti del lettore trovati leggendolo.

| famiglia | quanti | esito |
|---|---|---|
| tendine tagliate (Scudo 5 + Sentinella 2) | **7** | ⛔ vere, aspettano il fondatore |
| disegni di Sentinella | **3** | ✅ chiusi nel pomeriggio — `sentinella-disegni` **48/0** |
| documenti di Campo | **4** | ✅ chiusi nel pomeriggio — `campo-numeri-tranquilli` **69/0** |
| *(il quindicesimo)* | 1 | 🔧 era il **conto finale di un banco**, non un difetto |

⛔ **Zero cantieri nuovi da un giro di cinque ore** — e non perché non ci fosse
niente: perché quello che c'era era già stato preso da un'altra strada, quattro
ore prima che il giro finisse di dirlo. Il giro attestava `494863f` e il branch
era avanti di **60 commit, 18 sulle superfici misurate**: senza la sottrazione
della sezione 0 avrei riaperto sette difetti già chiusi.

## Le due cose imparate

1. ⛔ **UN ALLARME CHE SCATTA SEMPRE INSEGNA A NON GUARDARLO — e questo scattava
   nel verso che fa buttare via un giro da cinque ore.** Il lettore pretendeva
   una riga `USCITA N` per dire che il giro era arrivato in fondo, e `tutti.mjs`
   quella riga **non l'ha mai stampata, in nessuna versione**. Quindi il
   controllo cercava una cosa che non esiste e rispondeva con la frase più
   allarmante che sa dire — *«il registro è tronco»* — mentre il conto finale
   («143 banchi a posto, 16 da guardare») stava **tre righe più su**.
   ⚠️ Il modo di accorgersene non è leggere il lettore: è **guardare il soggetto
   che dovrebbe stampare quella riga**. Trenta secondi di `grep` su `tutti.mjs`.
   ⚠️ E la forma giusta era già nello stesso file, dieci righe più in là: gli
   orari sanno dire «vecchio», «fresco» e **«non lo so»**. Il controllo sulla
   fine dava la risposta *allarmante* dove non sapeva, invece di dire che non
   sapeva. Delle due direzioni sbagliate questa fa meno danno della tranquilla,
   ma ne fa: fa **buttare via lavoro buono**.
2. ⛔ **CHI ALTRO SCRIVE IN QUESTO REGISTRO? — la quinta volta, e la prima in
   cui la risposta non era il runner.** Il lettore toglieva già il `RIEPILOGO`
   del runner perché ricapitola rosso già stampato. Ma **anche i banchi
   ricapitolano**: `✗ 65 verifiche passate, 4 fallite` comincia con una
   crocetta, e quei quattro erano i quattro di due righe più su. Le prime
   quattro volte il colpevole era `tutti.mjs`; stavolta erano i banchi.

## Verifiche
- `leggi-giro --controprova` verde; col rilevatore spento cade su **due** righe
- controprove nei tre stati (finito / fermate dal limite / tronco) più il conto
  del banco
- i 7 KO non bloccati **rimisurati da me**, non presi dalla parola del banco:
  server mio su porta libera, contrassegno col pid **riletto dal server**
- `giro-node` **34 comandi a posto, 0 caduti** sulla copia del committato

## Prossimo passo atomico
Il giro è letto e chiuso. Le due strade aperte, in ordine:
1. **Le 7 tendine tagliate** hanno già la diagnosi e la strada scritta in
   roadmap (un suggerimento sotto il campo col titolo intero, perché un
   `<select>` chiuso non manda a capo e taglierà **sempre**). Non è bloccata dal
   fondatore per Scudo — lo è solo **`#vf-ente`**, che è il termine dell'art. 71
   c.11. ⛔ Quindi si può fare: **6 delle 7 sono lavoro, non attesa.**
2. Un giro nuovo del browser sul committato di adesso, che è avanti di 60
   commit rispetto a quello appena letto.

## Blocchi
In attesa del fondatore: **`#vf-ente`** (art. 71 c.11), la scelta di **quali**
delle 47 mancanze confermate diventino lavoro, e se `disponibilitaTurno` debba
restare **100%** su un turno chiuso in cui nessuno ha registrato fermi.
