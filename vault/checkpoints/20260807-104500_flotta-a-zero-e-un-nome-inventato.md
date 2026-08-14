# Checkpoint — 2026-08-07 10:45:00 UTC

## Tipo
unit-complete (due unità: Flotta nei temi chiari, e il nome del report del core)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`b50c8b4` — *Flotta nei temi chiari: 13 a 0, e su una delle tredici il banco
aveva torto*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 138 | **Flotta nei temi chiari** | chiaro **13 → 0**, sole **13 → 0**, scuro 0 → 0, testi identici |
| 139 | **il nome del report del core** | `Report_tecnico__.pdf` → il periodo o il giorno |

## ⛔ Su una delle tredici il banco aveva torto, e la forbice l'aveva detto
Il cantiere ha rifatto il righello da zero e ha valutato i due gradienti **nello
stesso punto fisico**, su 625 punti del rettangolo, invece di accoppiare le
fermate a tappeto: il `.n` verde da 32 px vale **3,01** dove il banco diceva
2,93 — cioè **passava**. È la settima trappola, e la forbice committata poche ore
fa la segnalava.
L'ha corretto lo stesso, con la ragione giusta: una cifra sul filo del 3 non ha
margine.
⚠️ E una strada è stata **provata e scartata con la misura**: contare i pixel
dello scatto. I bordi **antialiasati** del glifo passano per inchiostro e danno
2,66 dove il vero è 2,99 — 0,33 di errore **nel verso che accusa**.

⚠️ **Conferma indipendente che vale più dei numeri**: Sentinella aveva già scelto
`#ad211c / #8a5a00 / #1d7a33` per la **carta** (`@media print`). Le tinte scelte
da Flotta sono a **ΔE 8,8 / 3,2 / 4,6** da quelle. Due cantieri, due strade
separate, stesso posto.

## ⛔ E io avevo chiamato un `oggiLocale()` che non esiste
Correggendo il nome del report del core (a periodo aperto usciva
`Report_tecnico__.pdf`, e due salvataggi si sovrascrivevano) ho scritto un nome
libero: la famiglia di `chiediDati`, che fa morire la pagina al primo tocco
senza che nessuna prova `node` se ne accorga.
L'ho preso **cercando in casa prima di committare** — il core importa già
`isoLocale` da `shared/` — e ho verificato che, se non l'avessi fatto, l'avrebbe
preso `nomi-liberi.mjs`: col nome inventato rimesso la suite va da **7/0** a
**6/1** e lo nomina. File ripristinato da una copia con `diff -q`.

## Stato delle prove
Giro `node` **23 comandi, 0 caduti**. Prove **2.249**, copertura **677/677**,
banchi **129**.

## Che cosa sta girando adesso
1. **Il giro pulito su `4643be7`**, oltre le trenta sezioni.
2. **Quattro cantieri** sui temi chiari: Conti, Scudo, Campo, Terra. Quello di
   Conti sta anche correggendo la **regola 24** di `run-stile`.

## ⏱️ Una decisione presa e dichiarata: la geometria del gradiente NON si tocca ora
Il probe «co-locato» del cantiere di Flotta **è** la correzione giusta della
settima trappola, e per un gradiente lineare bastano i **quattro angoli** del
rettangolo del testo (gli estremi della proiezione stanno lì): sarebbe esatta e
costerebbe poco.
⛔ Ma cambierebbe **i numeri** del banco mentre tre cantieri lo stanno usando: uno
che ha misurato «13 KO» prima e ne vede 9 dopo attribuirebbe la differenza al
proprio lavoro. Si fa **quando hanno finito**, come per la registrazione di
`--tema=` in `tutti.mjs`. Dichiarato qui perché non si perda.

## Prossimo passo atomico
1. **Raccogliere Conti, Scudo, Campo e Terra**, uno per uno.
2. **Poi la geometria del gradiente** in `contrasto.mjs` (quattro angoli), e
   solo dopo registrare `--tema=chiaro` e `--tema=sole` in `tutti.mjs`.
3. ⛔ **E la decisione su `shared/`**, con due misure indipendenti già in mano:
   `shared/dw-app-ui.css` ridefinisce per il chiaro/sole superfici, testo,
   bordi, luce, gradienti e due `:hover` — **mai** `--success/--warn/--danger`
   (zero occorrenze in quel blocco). Sei app su sei ereditano i colori del buio.
   Il candidato è **tre righe** che derivano i due livelli dai colori di ogni
   app, lasciando a ciascuna la facoltà di scavalcarli. Si decide **dopo** aver
   visto tutte e sei le soluzioni, non prima.
4. ⚠️ **Le 19 decisioni**: è venerdì 07/08, si applicano **a fine giornata**.

## Code aperte, dichiarate
- Il **secondo livello** vale per i numeroni ritagliati nel gradiente: se nasce
  un testo grande non gradiente, `--num-*` c'è ma nessuna regola lo applica.
- Il probe co-locato vive in scratchpad: se serve a tutti, va in `tests/browser/`.
- Le altre dei checkpoint precedenti.

## Blocchi
Nessuno.
