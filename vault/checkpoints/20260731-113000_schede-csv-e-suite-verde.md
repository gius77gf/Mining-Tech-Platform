# Checkpoint — le tre schede, e la suite intera riletta fino in fondo

- **Tipo**: unità di documentazione + verifica completa della suite
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `f8a4090` (le tre schede in `ONBOARDING_DATI.md`)

## Cosa è stato completato

I tre importatori di ieri (listino Conti, ricettori Sentinella, ricambi Flotta)
erano **elencati** in `docs/ONBOARDING_DATI.md` ma non **spiegati**: la tabella
diceva che si caricano, e chi doveva preparare il file non trovava il modello da
copiare — che è l'unica cosa per cui quel documento esiste. Ora ci sono le tre
schede nella stessa forma delle quattordici già presenti: colonne, esempio
completo, note.

La parte che conta davvero, in ognuna delle tre, è **cosa succede alle colonne
vuote**, perché è ciò che nessuno indovina e che cambia il risultato:

- la **densità** del listino resta vuota, e per quel prodotto Conti non converte
  m³ ↔ tonnellate (una densità inventata finisce in fattura);
- **soglia** e **classe** di un ricettore restano vuote perché sono numeri di
  **sicurezza**, e non se ne inventa nessuna;
- nei **ricambi** le tre colonne si comportano in **tre modi diversi**, ed è
  voluto: `giacenza` vuota vale **zero** (un pezzo senza quantità è un pezzo
  finito, e zero è ciò che fa scattare il sotto-scorta), `sogliaMin` vuota
  esclude il pezzo dall'avviso, `prezzo` vuoto resta vuoto.

## La verifica completa

Fatta girare la suite intera del browser fino in fondo, non a campione:

- **11 banchi a posto, 0 da guardare**;
- `run-kpi.mjs`: **355 passati, 0 falliti**;
- `run-stile.mjs`: **128 passati, 0 falliti**;
- le **controprove** cadono come devono — la striscia di stato segnala 14
  combinazioni su 48 quando si rimette il difetto, e il fuori-schermo trova il
  bottone del tema spinto fuori a 390 e 360 px. Una prova che non sa fallire non
  dimostra niente, e queste sanno.

## Prossimo passo atomico

**Misurare se i lettori di CSV delle sei app sono d'accordo fra loro.** Adesso
ce ne sono molti (quindici punti d'ingresso contati, con almeno cinque funzioni
`parse*Csv` scritte in momenti diversi) e nessuno ha mai verificato che
trattino allo stesso modo le cose che un file vero ha sempre: il **separatore**
(`;` o `,`), la **riga d'intestazione**, le **virgolette**, la **virgola
decimale**, il **BOM** che Excel mette in testa, i fine riga **CRLF** di
Windows. Se divergono, lo stesso file esportato da Excel entra in un'app e
viene rifiutato dall'altra — e il cliente non capisce perché.

Prima si **misura** (una sonda che dà lo stesso testo a tutti i lettori e
confronta), poi si decide se serve una regola sola in `shared/`. Nell'ordine:
misura, poi eventuale consolidamento, mai il contrario — è la lezione già
pagata due volte.

## Bloccanti

- Nessuno.
