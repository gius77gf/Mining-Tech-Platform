# Checkpoint — 2026-09-18T16:42:36Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
dc4944bb — fix(scudo): statoAppalto non segnalava una qualifica in scadenza

## Cosa è stato completato
Il primo item della coda dei deep-pass QA di background: `statoAppalto`
escludeva `qualifica.esito === "in-scadenza"` sia da `problemi` sia da
`ignoti` — spariva, e l'appalto usciva "A posto" verde muto mentre
"Imprese esterne", sullo stesso dato, dice correttamente "In scadenza".
Aggiunto un quarto elenco `avvisi` e un quarto esito `"in-scadenza"`,
propagato a `riepilogoAppalti` e a tre punti di `index.html` (mappa
badge, `dire`, messaggio dopo il salvataggio, colore aggregato).

## Verifica
- Test unitario con dati fabbricati + controprova inline.
- Nuovo banco browser permanente (`scudo-appalto-in-scadenza.mjs`) che
  riproduce il caso VERO della demo (impresa "Autotrasporti Valle srl",
  appalto "pa1"): 5/5 dal vivo, controprova 3/5 KO voluti.
- KPI 3155, `sintassi-pagine.mjs` 34/34, `suite-collegate.mjs` 159
  banchi/222 file, `giro-node.mjs` 41/41 (asserzioni 4158, propagato),
  `numeri-nei-documenti.mjs` 43/0 (359 banchi, 159 file distinti,
  propagato nei quattro documenti).
- Giro mirato di `tutti.mjs --sulla-viva --da=357` con `DW_RADICE`
  impostato dal primo lancio (lezione presa nell'unità precedente):
  3/3 banchi a posto.

## Stato roadmap
Coda dei deep-pass QA di background, tutti verificati dal vivo, in
ordine di implementazione (task tracciati nel task-tool di sessione,
#4-#12):
- #4 Campo: banner Squadre ignora `hse.senzaScadenze`.
- #5 Flotta: fascia colore riga componenti a vita propria fissa.
- #6 (da investigare) crash `flotta-contatore.mjs --controprova`.
- #7 Conti: `emessoIncassato` non esclude fatture scartate SdI.
- #8 (solo documentazione) censire sovrapposizione Campo/Flotta
  `CAUSALI_FERMO` in `docs/MAPPA_ECOSISTEMA.md`.
- #9 Genesi: `stemB`/`subB` nel Validatore, falso allarme rosso.
- #10 Genesi: vista 3D raggi-X, carica fino al colletto se borraggio
  illeggibile.
- #11 Terra: `prospettoDenuncia` non annota "Residuo" come MASSIMO.
- #12 Deepwork ID: `admin.html` offre azioni sull'owner a un admin,
  il server le rifiuta sempre (difetto di UI/fiducia, non di
  sicurezza: il server blocca già correttamente).

Nessun agente di deep-pass QA attualmente in corso: dispatchati e
tornati in questo blocco Campo, Flotta, Conti, Genesi (2° giro), Terra
(2° giro), Deepwork ID, più la ricerca sulla mappa ecosistema — tutti
con un esito (positivo o onestamente negativo, solo Sentinella
angolo-nuovo è tornata a vuoto). Da rilanciare per mantenere ≥3
cantieri: candidati non ancora battuti oggi — Sentinella un terzo
angolo, Campo/Flotta/Conti un secondo giro dopo i fix appena fatti, o
il resto della mappa ecosistema.

## Prossimo passo atomico
Implementare il fix Campo `hse.senzaScadenze` (task #4): in
`apps/campo/index.html`, righe ~2597-2624 (`renderOperatori`), il guard
del banner aggregato (riga 2606) e il ramo finale (riga 2624) non
controllano `hse.senzaScadenze`. Isolare in una worktree fresca da
HEAD, riusare la frase-modello già corretta in Scudo
(`apps/scudo/index.html:2480-2481`, "non c'è nessuna scadenza
registrata: non è a posto, è una persona di cui non si sa niente"),
verificare con Playwright (il caso si costruisce collegando un
operatore a un `lavoratoreId` di Scudo con zero `scadenzeScudo`, come
ha fatto l'agente QA) + controprova prima di committare. In parallelo,
dispatchare 2-3 nuovi agenti di deep-pass QA per mantenere ≥3 cantieri.
Poi proseguire con Flotta (#5), l'investigazione flotta-contatore (#6),
Conti (#7), la censimento mappa (#8), Genesi ×2 (#9, #10), Terra (#11),
Deepwork ID (#12). Continuare "mai fermarsi".

## Blocchi
Nessuno.
