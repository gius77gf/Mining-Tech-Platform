# Checkpoint — 2026-08-07 20:19:12 UTC

## Tipo
unit-complete (i riquadri del rapportino che si sta scrivendo)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`76ecc35` — *Il form del rapportino diceva «0.0 mc» con nove metri perforati*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|-------|------------------------------|
| 196 | **i quattro riquadri di `screen-rapp`** (`76ecc35`) | banco **19 → 25** prove, controprova **5/5 difetti, 10 prove cadute** |

## ⛔ Due difetti, e il secondo l'ha trovato la misura, non la lettura
1. **A rapportino vuoto**: «0/5 fori · **0.0** metri · — media · — mc». Il
   riquadro dei metri smentiva i due accanto a due centimetri di distanza.
   È la **terza** volta per la coppia metri/mc — CLAUDE.md la registra sul PDF
   e sul foglio della volata, dove però il difetto stava nel **documento** e lo
   schermo aveva ragione. Qui è il verso opposto.
2. **Peggiore**: scritto **un foro a 9 m** e lasciata la maglia vuota — che è
   un campo libero e opzionale — usciva «1/5 fori · 9.0 metri · 9.00 media ·
   **0.0 mc**». `parseMaglia("")` dà B=0 e S=0, e `media × fori × 0 × 0 × 0.9`
   fa zero. Il guardiano c'era (`mc===null?'—'`) ma copriva solo «nessuna
   profondità», **non** «nessuna maglia»: cioè proprio il caso per cui
   `misureRapportino` esiste, e che in `shared/` era già risolto per il
   rapportino **salvato**. Il form se n'era tenuta una versione propria, con la
   regola giusta a un `import` di distanza.

Adesso il form costruisce la forma e la fa **giudicare a `misureRapportino`**:
i tre riquadri leggono la stessa risposta, quindi non possono più contraddirsi.

## ⛔ Ed è la misura che ha deciso di non aprire il cantiere previsto
Il passo atomico diceva di contare i decimali col punto **prima** di aprire il
cantiere sul separatore italiano. Contati aprendo **21 schermate su 22** e
leggendo il testo visibile: **quattro** in tutto a schermo (più «v3.5», che è
una versione, non un numero). Cioè la coda è piccola e **resta dichiarata**.
E la stessa sonda, mentre contava, ha fatto saltare fuori i due difetti qui
sopra, che valgono molto di più del separatore.

## ⚠️ Un difetto della controprova era INVECCHIATO da prima di questo lavoro
Il pezzo da rimettere citava `${m.fori} fori` mentre `rappRiga` era passata a
`conta(...)` per il plurale: non trovava più il suo pezzo di pagina, cioè
**l'iniezione che non inietta**. Verificato che fosse così **anche su `HEAD`**,
per non attribuirmi un guasto che non avevo fatto. L'ha preso il conto
«difetti rimessi: N su N» che il banco ha in fondo — la ragione per cui esiste.

## ⛔ Coda nuova, dichiarata e NON risolta: la dashboard è cieca per tutti
`nav('dashboard')` solleva **«Chart is not defined»**: Chart.js viene da un CDN
e senza rete non c'è. Conseguenze da verificare, ed è un'unità a sé:
- **nessun banco ha mai guardato quella schermata** — è la stessa famiglia del
  «0 su 68» delle modali del core, un piano più sotto;
- e in **cava senza segnale** — cioè il posto per cui l'app è fatta, e per cui
  ieri è stata costruita la fascia «senza rete» — quel comportamento non è
  stato misurato da nessuno.

## Stato delle prove
Prove **2.298** (`run-kpi` 1883), copertura **702/702**, banchi **149**,
regole **68**, giro `node` **23 comandi, 0 caduti**, verificato sulla copia di
quello che si committava.

## Che cosa sta girando adesso
⛔ Il giro completo partito alle 19:08 su `2ab9535`, a **90 sezioni**.
⚠️ Gira su un commit vecchio di **otto**: non copre niente di stasera.

## Prossimo passo atomico
1. ⛔ **La dashboard senza rete** (coda qui sopra): misurare che cosa succede
   davvero — schermata mezza disegnata? bianca? un errore leggibile? — e
   decidere. Il core è l'unica cosa che il fondatore mostra, e questa è la sola
   schermata che nessuna prova ha mai aperto.
2. ⛔ **Raccogliere il giro** quando finisce: PRIMA le righe «non ho guardato»,
   poi i KO, distinguendo le controprove. Poi rilanciarlo sul commit corrente,
   perché quello vecchio non copre otto commit di lavoro.
3. ⛔ **Il tema che scala invece di fissare** — cantiere su `shared/`, si
   serializza.
4. **Il Quadro nel core** (decisione 15), coi sei ponti scritti **uno solo**.

## Code aperte, dichiarate
- Le 21 prove delle Cloud Functions non girano in questo contenitore.
- `firestore.rules` è cambiato ma **non è pubblicato**: lo fa il fondatore.
- Il separatore decimale italiano nel core: **4 punti a schermo**, misurati.
- Le altre dei checkpoint precedenti.

## Blocchi
Nessuno.
