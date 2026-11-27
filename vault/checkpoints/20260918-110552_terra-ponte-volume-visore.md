# Checkpoint — 2026-09-18T11:05:52Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
2c88abe0 — fix(terra): il ponte del volume dal visore non accetta più un'unità sbagliata come metri cubi veri

## Cosa è stato completato
Dal deep-pass QA su Terra (agente a7409415627631532): il ponte
Genesi→Terra sul volume del visore nuvola accettava un numero in
unità ARBITRARIE come se fosse in metri cubi veri. Quando una nuvola
non è georeferenziata, il visore salva il volume come stringa con
l'unità attaccata ("1234 u³"); Terra puliva la stringa con una regex
che toglie anche "u³", lasciando passare un numero valido e diverso
da zero — il controllo `if (!vol)`, che secondo il suo stesso
messaggio d'errore vuole intercettare proprio quel caso, non scattava
mai. Il numero finiva propagato alla denuncia annuale, all'onere di
escavazione, alla vita cava e al valore del materiale.

Estratta la logica in `volumeDalVisore(ultimo)`, nuova funzione pura
in `terra-data.js` accanto a `ultimoRitaglioNuvola`, che guarda
`calcolo.georeferenziato` PRIMA di accettare il volume.

## Verifica
- Nuovo test dedicato con controprova (verificato: col vecchio
  controllo solo-su-zero il test cade, "3100 u³" passava come valido).
- KPI: 3146 → **3147**.
- Giro completo su worktree isolata: **41/41, 0 caduti**. Asserzioni:
  **4145**. 9-suite sum: **3.643** (3147+330+83+34+9+8+7+3+22).
  `numeri-nei-documenti.mjs`: 43 passati, 0 falliti — inclusa la
  copertura funzioni pure aggiornata (1044→1045) per la nuova
  funzione esportata.

## Stato roadmap
Vedi vault/ROADMAP_SETTIMANA.md.

## Coda di lavoro — sette unità verificate da agenti in background
**shared/dw-app-ui.js — UI/accessibilità** (agente a2cd701aa80f1f010):
1. Genesi — toast di errore senza CSS distintivo.
2. Toast senza `role="status" aria-live="polite"` in Genesi e
   deepwork-id/admin.
3. Nessuna trappola del focus nella modale (`Tab` non gestito).
4. Listener accumulato su `#modal-foot` in Conti.

**Flotta — tre copie deboli** (agente a106be18e1d4b3d04, probabilmente
chiudibili in un'unica unità, stesso file/stessa famiglia):
5. Ordinamento del magazzino ricambi (`index.html:2464`) usa ancora
   la formula grezza già sostituita in `sottoScorta`.
6. `csvBudget` (`flotta-data.js:1805-1814`) scrive i numeri col punto
   inglese invece della formattazione condivisa, a differenza dei
   quattro CSV gemelli già corretti il 17/09.
7. `propostaScorte` (`flotta-data.js:3862`) mostra "soglia oggi 0" per
   un ricambio mai impostato — la stessa bugia già corretta in
   `statoScorta` ma non propagata a questo secondo calcolo.

## Prossimo passo atomico
Priorità suggerita: le tre unità Flotta (5+6+7) insieme, stesso file,
basso rischio, pattern identico già visto più volte in questa
sessione; poi le quattro di dw-app-ui.js/accessibilità. Isolare in una
nuova worktree e continuare "mai fermarsi". La coda resta a 7 item:
non serve dispatchare nuovi agenti finché non scende sotto 3-4.

## Blocchi
Nessuno.
