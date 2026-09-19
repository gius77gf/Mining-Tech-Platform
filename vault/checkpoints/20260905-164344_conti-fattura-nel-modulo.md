# Checkpoint — 2026-09-05T16:43:44Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
3b14e6d4 — Conti: il foglio della fattura si compone nel modulo — righe, piede,
avvisi e riquadri fuori dalla pagina

## Completato
`fogliaFattura(f, {clienti, incassi, note})` in `apps/conti/conti-data.js`
(righe, piede una riga per aliquota, avvisi, riquadri, note di credito,
incassi, piede legale, `nonMisurati`); `fogliFattura` nella pagina disegna
e basta. Quantità/prezzo assenti su una riga dettagliata → «non
indicata/o». run-kpi +6 (2700), copertura Conti 177/177 (fondo 177).
Banchi: `conti-stampe` (tre iniezioni sul modulo, ciclo per file; 20/20,
controprova 6 rimessi / 10 KO voluti), `stampe-fs` (iniezione dei trattini
sul modulo; 22/22, controprova 2/2), `conti-frasi-da-uno` 41/41,
`conti-documenti-che-escono` 81/81. Pin: prove 3.181, asserzioni 3.613,
copertura 884/884. Giro `node` sulla copia: 38 comandi a posto. Scatto
della fattura guardato.

⚠️ Da ricordare: `euro(6000)` in Node scrive «€ 6000,00» e in Chromium
«€ 6.000,00» (la regola delle quattro cifre, già in CLAUDE.md): le prove
di run-kpi confrontano con `shell.euro(...)`, mai con la stringa.

## Stato roadmap
Voce `[x]` «CONTI — il foglio della fattura si compone nel modulo» sotto
quella del prospetto di Terra, con la riga «restano fogliDdt e
stampaPreventivo».

## Prossimo passo atomico
Conti, gli altri due fogli: `fogliDdt(p)` e `stampaPreventivo(id)`
(`apps/conti/index.html`, cerca `function fogliDdt` e `function
stampaPreventivo`). Stessa forma di `fogliaFattura`: `fogliaDdt(p,
{clienti})` → `{titolo, numero, data, cliente, luogoConsegna, avviso
(mancanzeDdt), riquadri: [causale, trasporto a cura, data del ritiro],
colonne, riga: {prodotto, lordo, tara, netto, quantita, prezzo, sconto,
valore}, piede: {etichetta, valore}, perche, volume, piedeLegale,
nonMisurati}`, con `pesiPesata`, `valoreDdt`, `quantitaPesata`,
`numeroDichiarato` (il prezzo mai scritto è «non indicato», mai «€ 0,00/t»);
`fogliaPreventivo(o, {clienti, oggi})` → `{titolo (Conferma d'ordine /
Preventivo), numero, data, cliente, riferimento, riquadri, avviso
(righe a chiamata), colonne, righe, piede: [imponibile, IVA, totale],
note, piedeLegale}` con `totaliPreventivo`, `statoPreventivo`, l'etichetta
del badge (`ORD_BADGE` è nella pagina: sale nel modulo). Riancorare
l'iniezione 5 di `conti-stampe` («Data del ritiro») sul modulo. Prove in
run-kpi (il DDT senza causale, il prezzo mai scritto, il volume da densità;
il preventivo a chiamata, la conferma d'ordine, senza righe), banchi
`conti-stampe` sana+controprova, `stampe-fs --solo=conti`, scatti guardati.
Alla prossima accensione della routine: canarino prima di tutto.

## Blocchi
Nessuno tecnico. Decisioni del fondatore ancora aperte: 5b, 19-27, Q1,
registro esplosivi, TD24/IPA/split payment, registro dei terzi, trasmissione
del report.
