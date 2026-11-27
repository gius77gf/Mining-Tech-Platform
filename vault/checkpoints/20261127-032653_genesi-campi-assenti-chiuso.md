# Checkpoint — Genesi: chiuso il rosso cronico di genesi-campi-assenti

## Tipo
unit-complete (solo un banco e i documenti: nessuna modifica al prodotto)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
Quello che contiene questo file («test(genesi): genesi-campi-assenti era
rosso dal 14/09…»). Il precedente di prodotto, `4c70a1d0` (nessun documento
da una pianta non disegnabile), è confermato dal giro `node` completo — vedi
la riga «giro» qui sotto, scritta leggendo il registro.

## Che cosa è stato fatto
- `apps/deepwork-id/tests/browser/genesi-campi-assenti.mjs`: la terza
  sezione riscritta sulla verità di oggi. Senza spalla (due casi): zero
  errori, zero fori, motivo «burden»; la scheda dice che cosa manca e non
  contiene nessuna cifra; premendo «Esporta scheda volata» non esce nessun
  file e il messaggio dice perché. Con la spalla: 101 m, 202 / 404 m, il
  verdetto del flyrock inverso; col borraggio 1,6 m: 174 m.
- Esito: **64 passati su 64, zero «non misurati»** (prima: 55 passati e 2
  non misurati, uscita 1, dal 14/09).
- Controprova: aggiunta l'iniezione che fa ridisegnare la maglia senza
  spalla; 21 iniezioni su 21 trovano il loro testo, e i sei controlli nuovi
  cadono (i tre del verso sano restano verdi, come devono).
- Dichiarato nel banco che cosa non si misura più da lì (la forbice della
  gittata senza spalla) e quali due prove di `run-kpi` la tengono.
- Roadmap: chiusa la voce del rosso cronico; aperta, a parte, quella sulla
  parola («manca burden» dove il campo si chiama «Spalla»).

## Giro
Giro `node` completo su `4c70a1d0`: **47 comandi a posto, 0 caduti, 4524
asserzioni** (letto dal registro, non dedotto). Su questo commit: il banco
sano 64/64 (uscita 0), la controprova 35 passati / 29 falliti con 21
iniezioni su 21 sul bersaglio; `iniezioni-fresche` 834 su 834,
`suite-collegate`, `numeri-nei-documenti` e `sintassi-pagine` a uscita 0.
Il giro `node` completo su QUESTO commit parte subito dopo il push.

## Stato dei banchi del browser di Genesi (tutti rigirati oggi, uno per uno)
55 file `genesi-*.mjs`: tutti a uscita 0 nel passaggio sano dopo le unità di
oggi (52 nella coda del pomeriggio + `genesi-snap-estremo` riparato +
`genesi-campi-assenti` riscritto + `genesi-colonna-progetto` nuovo). ⚠️ I
loro passaggi di CONTROPROVA non sono stati rigirati tutti: solo quelli dei
banchi toccati.

## Prossimo passo atomico
**La parola giusta dove la pianta non è disegnabile** (voce aperta in
roadmap «manca burden dove il campo si chiama Spalla»).
1. `apps/genesi/genesi-data.js`: accanto a `magliaAssenteMotivo`, una
   funzione pura `nomeDatoMancante(motivo)` → «la spalla» / «l'interasse» /
   «la spalla e l'interasse» (stringa vuota se il motivo è vuoto). Lo STATO
   resta `'burden'` / `'interasse'` / `'burden e interasse'`.
2. I quattro punti che stampano il motivo passano di lì: la pianta
   (`'Pianta non disegnabile: manca '+…` sulla tela), la scheda, la frase di
   `nonEsceSenzaPianta` (che riceve il motivo: lo traduce lei), e la riga
   di `volSnapshot`.
3. Prove da aggiornare perché citano il testo: `genesi-maglia-assente.mjs`
   (`manca ${atteso}` e la frase dei comandi), `genesi-campi-assenti.mjs`
   («manca burden» in tre punti), `run-kpi` (`nonEsceSenzaPianta`). Lo stato
   (`st.assente === "burden"`) NON cambia.
4. Scatto della schermata «pianta non disegnabile» a 430 e 320 guardato.

## Blocchi (del fondatore)
Decisioni 28, 33 (⚠ quale foro usa la gittata), 34 (lettore LAZ), 35 (spalla
al piede), 36 (accenti nei CSV: prima la prova con Excel); 32 rimandata.
