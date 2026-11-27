# Checkpoint — 2026-09-16T09:44:43Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
8cf82ff7

## Cosa completato
- Chiuso il quinto dei sei delta del tredicesimo giro di ricerca continua
  su Terra: **apertura fuori programma del lotto**. Oggi l'apertura reale
  (`lotto.apertoIl`) non viene mai confrontata col mese pianificato: uno
  slittamento di mesi non emerge da nessuna parte, né a schermo né nei
  documenti.
- Funzione pura `aperturaFuoriProgramma(lotto)` in `terra-data.js`: legge
  `lotto.aperturaPrevista` (`YYYY-MM`, stesso schema di `dipendeDa` e
  `volumiAnnuali` — campo opzionale e additivo) e `lotto.apertoIl` (data
  ISO), restituisce `{pertinente, scartoGiorni, verso, frase}` con
  `verso` in `anticipo|ritardo|in pari`. Guardie: mese malformato,
  `dataISOEsiste` su `apertoIl`, giorno-30-febbraio scartato.
- Deliberatamente **solo frase, senza badge**: a differenza di
  `sequenzaLotto` (che ha un badge "fuori sequenza"), qui il badge
  avrebbe affollato la card senza aggiungere urgenza — lo scarto è
  storico (l'apertura è già avvenuta), non un blocco da segnalare con
  forza.
- Demo: Lotto 4 riceve `aperturaPrevista: "2023-11"` (aveva già
  `apertoIl: "2024-05-02"`) → 183 giorni di ritardo. Il numero è stato
  **verificato dalla funzione**, non calcolato a mano: il primo tentativo
  a mano dava 184, sbagliato per l'anno bisestile 2024 (29 giorni a
  febbraio).
- Test in `run-kpi.mjs`: non pertinente senza uno dei due dati; anticipo
  vs ritardo come **versi** distinti (non solo un valore assoluto);
  scarto zero → "in pari"; programma corrotto (`2024-13`, `boh`,
  `2024-02-30`) scartato dalla guardia; verifica sulla dimostrazione
  (solo Lotto 4 è pertinente, tutti gli altri no).
- Banco browser nuovo `tests/browser/terra-apertura-programma.mjs` +
  registrazione in `tutti.mjs`: la riga del Lotto 4 deve contenere
  esattamente "Aperto in ritardo di 183 giorni rispetto al programma
  (previsto 01/11/2023)", il Lotto 1 (senza `aperturaPrevista`) resta
  silenzioso. Iniezione mirata sulla riga sorgente, controprova nei due
  versi.
- `copertura-funzioni.mjs`: FONDO terra 102→103.
- Doc-cascade finale: run-kpi 3080→3084, somma nove suite 3.574→3.578,
  copertura sei app 1041/1041→1042/1042, giro completo 4049→4054,
  banchi browser 309→311 esecuzioni / 134→135 file distinti. Verificato
  con **doppio giro isolato su worktree**: primo passaggio col solito
  "far west" atteso su `numeri-nei-documenti.mjs` (i suoi ~43 non
  entrano nel totale quando il comando fallisce), secondo passaggio
  verde — `numeri-nei-documenti.mjs` 43/0, `giro-node.mjs` 40/40 comandi,
  4054 asserzioni, addendi verificati uno per uno.
- Commit `8cf82ff7`, pushato.

## Stato roadmap
Terra ha chiuso cinque dei sei delta del tredicesimo giro (piano
pluriennale, sequenza fra lotti, apertura fuori programma — mancava
solo aggiornare qui la numerazione: il terzo/quarto delta di questo
giro non descritti in questo checkpoint sono già stati chiusi nei
checkpoint precedenti). Resta un solo delta aperto: **report per
banco×anno con stato progettuale storico**.

## Prossimo passo atomico
1. Aggiornare `docs/RICERCA_CONTINUA_TERRA.md` con la nota di chiusura
   del quinto delta (apertura fuori programma) e `vault/ROADMAP_SETTIMANA.md`
   (sezione "Terra — tredicesimo giro di ricerca continua") con la voce
   corrispondente — pendente da questa stessa unità, va fatto nel
   prossimo commit immediato (solo docs/vault, nessun codice).
2. Poi scegliere fra: (a) l'ultimo delta di Terra (report per banco×anno
   con stato progettuale — da scomporre: serve capire quali dati storici
   esistono già su banchi e anni prima di progettare la funzione), oppure
   (b) una nuova ricerca continua sull'app con meno giri fatti finora
   in questa sessione (Terra e Sentinella ne hanno avuti; le altre
   quattro — Scudo, Genesi, Campo, Flotta, Conti — vanno controllate nei
   rispettivi `docs/RICERCA_CONTINUA_<app>.md` per vedere quale è più
   indietro).
3. Non fermarsi qui per la regola del fondatore (esaurimento crediti):
   proseguire immediatamente con l'unità successiva.

## Blocchi
Nessuno.
