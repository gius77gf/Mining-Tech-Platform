# Checkpoint — 2026-09-17T23:03:20Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
96ddc070

## Cosa è stato completato
Fix del difetto trovato dal terzo giro di deep-pass su Scudo (agente
ac03391fa217e0877): nel Quadro, una scadenza di "verifica periodica
attrezzatura" compariva due volte con due badge discordanti quando la
sua data entrava anche lei nella finestra scaduta/in-scadenza — una
volta col badge specifico (`verificheDaSistemare`), una volta col ramo
generico `urg`, senza deduplica. Corretto escludendo da `urg` gli id già
coperti da `verificheDaSistemare(...).daSistemare`. Nuovo banco
`scudo-verifica-doppia.mjs` con controprova, verificato dal vivo prima e
dopo. Giro isolato: 41/41, 4100 asserzioni (docs corretti da 4099).

In parallelo (background):
- Ricerca continua su Sentinella dispatchata (agente a1c653a0678130b1a),
  esito non ancora arrivato.
- Terzo giro deep-pass su Flotta dispatchato (agente aff43964bd31baec6),
  esito non ancora arrivato.
- Terzo giro deep-pass su Genesi (agente a200d8450deefcbef, completato):
  TRE difetti veri trovati, nessuno ancora fixato tranne il primo (in
  corso, vedi sotto):
  1. **`.hg-list` nella Home taglia la terza riga di "Ponti con le altre
     app"** senza affordance di scroll (172px vs 214px di contenuto reale)
     — FIX GIÀ APPLICATO in questo momento (non ancora committato):
     `#hgPonti{max-height:none;overflow:visible}` in
     `apps/genesi/genesi.html`, perché quella lista porta sempre
     esattamente 3 righe fisse (a differenza di `#hgVolate`/`#hgNuvole`,
     che possono crescere e per cui lo scroll interno serve davvero).
     Manca ancora: verifica dal vivo col Playwright, eventuale banco con
     controprova, giro isolato, commit.
  2. **Il CSV "Esporta scheda volata" conta i fori sulla griglia di
     progetto (`foriDiProgetto`), non su quelli disegnati sulla tela**,
     mentre lo schermo (card "Stima economica") e il Report stampato
     usano i fori disegnati (`g.n`, `measureGeom2D`). Su un progetto con
     un foro aggiunto a mano oltre la griglia (12→13), il CSV scarica
     ancora "Fori;12" mentre schermo e Report dicono 13 — stesso file
     della famiglia "documento composto non ripete la decisione della
     schermata" già chiusa altrove in Genesi (v. `csvRiconciliazione`),
     qui rimasta aperta sul CSV della scheda volata
     (`apps/genesi/genesi.html:3407,3541-3600` da correggere per usare
     `g.n` come fa il Report a righe 3895-3923). NON ANCORA FIXATO.
  3. **"Carica per un obiettivo di pezzatura" (`caricaDaX50Target`,
     `apps/genesi/genesi-data.js:1809-1852`) può proporre una carica
     fisicamente impossibile da entrare nel foro**, senza nessun avviso
     sul limite fisico (solo un avviso sulla vibrazione proiettata). Sul
     progetto demo, un obiettivo x50=5cm propone 880,2 kg/foro contro un
     massimo fisico di 58 kg calcolabile con `caricaForoDaGeometria`
     (rapporto 15,2×). Manca il confronto con la capacità del foro, sia
     qui sia in "Confronta spalla (burden)" che chiama la stessa
     funzione. NON ANCORA FIXATO — decidere se è un fix diretto (aggiungere
     il confronto e un avviso, additivo) o merita più riflessione di
     prodotto (è un calcolo "teorico" che serve a orientare, non uno che
     verrà mai eseguito così com'è — valutare nel prossimo passo).

## Stato roadmap
Terzo giro di deep-pass: Sentinella ✅, Conti ✅, Scudo ✅ (questo
commit), Genesi (3 difetti trovati, fix #1 in corso, #2 e #3 da fare),
Flotta (in corso, background).

## Prossimo passo atomico
1. **Finire e verificare il fix Genesi #1** (`#hgPonti` overflow, già
   scritto in `apps/genesi/genesi.html`): aprire la pagina col browser,
   confrontare lo screenshot prima/dopo su viewport 390-430px, verificare
   che `#hgVolate`/`#hgNuvole` (che restano a 172px con scroll) non siano
   stati toccati. Poi decidere se serve un banco dedicato o se basta una
   verifica manuale documentata nel commit (è un fix CSS puro, senza
   logica da testare in run-kpi.mjs).
2. **Fixare Genesi #2** (CSV scheda volata conta i fori sulla griglia di
   progetto invece che sui disegnati): in
   `computeKPI()`/il bottone `btn-scheda-csv` (righe 3541-3600), sostituire
   `k.nf`/`k.qtot`/`k.cost` con gli equivalenti calcolati su `g.n`
   (fori disegnati, come fa già il Report a righe 3895-3923) per le righe
   'Fori' e 'Carica totale (kg)' del CSV. Aggiungere un test/banco con
   controprova che aggiunga un foro oltre la griglia e verifichi che il
   CSV scaricato riporti lo stesso numero di fori dello schermo.
3. **Decidere Genesi #3** (carica oltre la capacità del foro): probabilmente
   un fix diretto e additivo — aggiungere in `caricaDaX50Target` (o nel
   punto UI che lo consuma) un confronto con `caricaForoDaGeometria` e un
   flag/avviso esplicito quando il risultato supera la capacità fisica del
   foro corrente, sul modello di `fuoriDominio` già esistente.
4. Committare Genesi come unità propria (fix #1+#2+#3, o suddivisi se il
   giro isolato si allunga troppo), col solito ciclo verify→commit→checkpoint.
5. Riverificare l'esito dei due agenti in background (ricerca Sentinella,
   deep-pass Flotta) quando arrivano.
6. Chiudere l'unità Terra (voce "acque" in `TIPI_SCADENZA_TERRA`, ancora
   non committata — worktree `wt-terra2` da ricostruire su HEAD fresco e
   rilanciare `--solo=terra`, poi aggiornare i numeri nei documenti: KPI
   sale a 3117, dedurre il nuovo totale del giro dal giro stesso).
7. Mantenere ≥3 cantieri paralleli.

## Blocchi
Nessuno.
