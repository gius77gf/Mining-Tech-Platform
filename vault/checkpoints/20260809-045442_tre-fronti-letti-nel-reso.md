# Checkpoint — 2026-08-09T04:54:42Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`feaf001`

## Task completato

**Tre fronti dei KO del giro, aperti e capiti leggendo il RESO** — non il
sorgente. Il metodo ha cambiato la risposta in tutti e tre.

| fronte | verdetto | come si è visto |
|---|---|---|
| manina di Campo | ✅ **chiusa** | `.pon-voce` è la testata di un pannello già aperto: `cursor:default`. 519 voci su 14 superfici, da 1 a **0** |
| rapportino senza data (Campo) | ✅ **chiusa** — era il **banco** | il reso dice «**1 rapportino** ancora senza data», la regex chiedeva il plurale |
| disponibilità che non torna (Campo) | ⛔ aperta — **banco**, e la correzione facile darebbe un **verde falso** | il prodotto dice «DISPONIBILITÀ NON CALCOLATA» e nessuna percentuale; il banco cerca «calcolab**ile**», **e** lo scenario non raggiunge la contraddizione |
| nuvola di Genesi (4) | ⛔ aperta — **prodotto** | rende `41230` dove serve `41.230`, mentre sulla stessa riga «3.000.000» è raggruppato |

## Le tre cose imparate

1. ⛔ **UN `grep` SU UN TESTO INTERPOLATO RISPONDE «NON C'È» CON LA STESSA
   FACCIA DELLA VERITÀ.** Avevo dichiarato in roadmap — *«provato col
   comando»* — che i due stati di Campo erano buchi di prodotto, perché
   `grep -c "rapportini ancora senza data"` dava **0 e 0**. Nel sorgente quelle
   parole **non sono adiacenti**: in mezzo c'è
   `${conta(sdRap, "rapportino", "rapportini")}`. Lo diventano solo nel reso.
   Ho dovuto **smentire una diagnosi già pubblicata**.
2. ⛔ **LA CORREZIONE FACILE CHE DÀ IL VERDE FALSO.** Sul secondo stato di
   Campo bastava allargare la regex a «calcolat[ao]» e il banco passava. Ma
   riproducendo lo scenario si vede che la pagina risponde «non è registrata
   nessuna attività per questo turno» — cioè **la contraddizione fra fermo e
   durata non viene mai raggiunta**. Allargare la parola avrebbe reso verde una
   prova che non prova niente. Il lavoro vero è **lo scenario**.
3. ⛔ **HO INTRODOTTO IO, STANOTTE, LA CAUSA DEI 4 DI GENESI — IN NOVE PUNTI.**
   `_ricPlur` è `conta` di `shared/`, e `conta` scrive `String(n)`: **non
   raggruppa** (`conta(41230,…)` → `"41230 punti"`). Nella mia unità su Genesi
   ho sostituito `gnum(k.nf,0)+' fori'` con `_ricPlur(k.nf,'foro','fori')`:
   singolare corretto, **raggruppamento perso**. È *«una funzione nuova che
   prende il posto di una vecchia si porta dietro il mestiere, non le
   difese»* — la regola sta in `CLAUDE.md` e ci sono cascato **mentre
   applicavo un'altra regola dello stesso file**.
   In pratica non si vede (fori e referti stanno sotto il migliaio), ma il
   principio è rotto e va rivisto insieme ai 4 di Genesi.

## Verifiche
- `promesse-tocco` **519 voci su 14 superfici, 0 promesse fuori posto**
- `stati-non-misurati` da **2 KO a 1**
- `giro-node` **34 comandi a posto, 0 caduti** dopo ogni unità · albero pulito

## Stato dei 20 KO del giro
**4 chiusi · 16 aperti.** ⚠️ E il numero è una stima **per eccesso**: sui tre
fronti riverificati col reso, **due su tre** erano attese del banco e non
difetti del prodotto.

## Prossimo passo atomico
**Il raggruppamento dei numeri**, che tiene insieme i 4 di Genesi e la mia
regressione. Due strade, e la scelta **non è mia**:
· comporre `gnum(n,0) + ' ' + plurale(n, sing, plur)` dove il numero può
  superare il migliaio (tocca `_puntiNuvola` + i nove punti miei);
· oppure dare il raggruppamento a `conta` in `shared/` — **cambia tutte le app
  in una volta**.
⛔ In tutt'e due i casi `useGrouping` va **scritto**: `docs/MIGLIAIA_NODE_CONTRO_CHROMIUM.md`
misura che sui numeri di **quattro cifre** Node e Chromium raggruppano
diversamente, e la regola 16 di `run-stile` lo pretende esplicito.

## Blocchi
Nessuno di tecnico. In attesa del fondatore: le **7 tendine tagliate** (non si
chiudono accorciando il testo: quello che sfora è dato dell'utente) e
**`#vf-ente`** (termine dell'art. 71 c.11).
