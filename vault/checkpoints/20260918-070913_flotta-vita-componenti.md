# Checkpoint — 2026-09-18T07:09:13Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
917c9b22 — feat(flotta): soglia di vita dei componenti, con priorità operative

## Cosa è stato completato
Dal delta della ricerca continua (tredicesimo giro, agente su Flotta):
`vitaComponenti` non giudicava mai un componente scaduto perché mancava
una soglia di vita attesa contro cui confrontare le ore montate.

- `vitaAttesaOre` opzionale su ogni componente (`componentiDelMezzo`),
  **non** una costante di prodotto: solo chi la dichiara viene giudicato
  (principio del fondatore — l'assenza di un dato non è un dato
  favorevole, qui applicato al contrario: l'assenza di una soglia non fa
  scattare un giudizio inventato).
- `vitaComponenti` calcola `pctVita`/`stato` (ok/attenzione/scaduto,
  soglia `SOGLIA_VITA_ATTENZIONE_PCT=80`) solo quando `vitaAttesaOre` è
  un numero positivo; ogni ramo "non calcolabile" preesistente ora
  dichiara anche `pctVita:null, stato:"non-giudicato"` (regola 18:
  la mappa degli stati deve coprire tutti gli stati che la funzione sa
  dire).
- `prioritaOperative`: **firma invariata** (corretto un mio primo
  disegno sbagliato che aggiungeva un parametro flat — letto il codice
  vero, `componenti` è annidato per mezzo, non una collezione a parte).
  Nel loop già esistente per mezzo, i componenti scaduti/in attenzione
  diventano voci `categoria:"componente"` con `gravita` danger/warn.
  `catRank` aggiornato per includere la nuova categoria.
- `apps/flotta/index.html`: la scheda del mezzo (`sch-comp`) mostra la
  percentuale quando nota, badge colorato per stato.
- Due bug reali trovati SCRIVENDO il test (non nel report dell'agente):
  1. `oreDi(m.nome)` con un nome COMPLETO (es. "Escavatore E1 — CAT 352")
     fallisce silenziosamente (si aspetta un nome corto) — corretto in
     `oreContatore(m)`, che prende il mezzo direttamente.
  2. Fixture di test con `montatoAOre` misti produceva una vita negativa
     — corretto uniformando a `montatoAOre:0`.
- `iniezioni-fresche.mjs`: ri-ancorato
  `flotta-componente-contatore-sostituito.mjs` (i due `return` sul ramo
  "non calcolabile" avevano guadagnato `pctVita`/`stato`, il codice si è
  mosso perché è migliorato).

## Verifica
Giro completo su worktree isolata (`/tmp/wt-flotta2`, HEAD 13eef8a9 +
delta Flotta), verificato **due volte** (prima falliva su
`iniezioni-fresche.mjs` per l'ancora stale, poi 41/41 comandi a posto):

- **41 comandi a posto, 0 caduti**
- Asserzioni eseguite dal giro: **4126** (documenti corretti da 4127 a
  4126 — la prima cifra era una stima provvisoria mai riverificata contro
  l'uscita vera dello strumento)
- KPI app: 3132 → **3133** (+1, il nuovo test)
- 9 suite che contano casi: **3.627** (3133+330+83+32+9+8+7+3+22)
- banchi: **343** (invariato — nessun nuovo banco browser in questa
  unità), copertura **1044/1044**
- `numeri-nei-documenti.mjs`: 43 passati, 0 falliti (verificato una
  seconda volta dopo il fix del 4127→4126)

## Stato roadmap
Vedi vault/ROADMAP_SETTIMANA.md. Unità Flotta chiusa.

## Prossimo passo atomico
Isolare e committare l'unità **Campo** (dal quinto giro di deep-pass,
agente a3c51b3ffe5e1bfeb): `idoneitaDiTurno` compariva nei documenti
solo per i lavoratori NON idonei, non per chi ha corsi scaduti/in
scadenza. File coinvolti: `apps/campo/campo-data.js` (già modificato sul
disco: `rapportoGiornata` e `testoConsegnaTurno` ora compongono le
clausole idoneità con un array di quattro rami invece di un ternario
singolo; **secondo bug reale trovato scrivendo il test**: entrambi i
call-site di `idoneitaDiTurno` mancavano il 4° argomento `oggi`, quindi
usavano `new Date()` — l'orologio reale — invece della data del
rapporto), più il blocco Campo già presente in
`apps/deepwork-id/tests/run-kpi.mjs` (isolabile via diff dal blocco
Flotta appena committato). Nessun nuovo banco browser per questa unità:
banchi/file (343/151) dovrebbero restare invariati, **da verificare con
`numeri-nei-documenti.mjs`, non assumere**. Passi:
1. `git worktree add -q --detach /tmp/wt-campo HEAD` (HEAD ora è
   917c9b22)
2. Costruire il delta doc preciso (KPI 3133→3134, somma 3.627→3.628,
   nessun banco nuovo) con Python contro la copia pulita
3. Lanciare `giro-node.mjs` in background sulla worktree, attendere
4. Correggere eventuali numeri sbagliati leggendo l'uscita VERA (mai
   indovinare), rilanciare se corretto
5. Copiare i file Campo-only (campo-data.js, blocco run-kpi.mjs isolato,
   4 doc) nel main tree via hash-object+update-index, commit -F, push
6. Poi l'unità **Genesi**: `apps/genesi/genesi.html` (dir/costi non
   persistono su Apri + fila multi-fila nell'export), nuovo banco
   `genesi-dir-costi-non-persistono-su-apri.mjs`, ri-ancoraggio
   `genesi-tratti-non-persistono-su-apri.mjs`, estensione
   `genesi-documenti-che-escono.mjs` (blocco 4ter + DIFETTI #13, GIÀ
   VERIFICATI: normale 101/101, controprova 30 KO su 16/16 iniezioni),
   2 righe già aggiunte a `tutti.mjs`. Banchi conteggio da ricalcolare
   (+2 esecuzioni per il nuovo banco dir-costi, +1 file distinto).
7. Dopo tutt'e tre: checkpoint di chiusura seconda ondata, poi
   proseguire con la regola "mai fermarsi" — controllare report di
   agenti in background, mantenere ≥3 cantieri paralleli, ma dare
   priorità alla chiusura dell'arretrato confermato prima di aprire
   nuovi giri di ricerca (lezione di 20260918-043021).

## Blocchi
Nessuno.
