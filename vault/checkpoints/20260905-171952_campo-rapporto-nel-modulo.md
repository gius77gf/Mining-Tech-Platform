# Checkpoint — 2026-09-05T17:19:52Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
0ab018d5 — Campo: il rapporto di fine turno stampato si compone nel modulo —
dodici sezioni fuori dalla pagina

## Completato
`rapportoGiornata(d, {dmy})` in `apps/campo/campo-data.js` (Quadro, avviso,
dodici sezioni come `{titolo, testo, blocchi, note}`, foto, firme in
bianco, riaperture); la pagina disegna con `md` (`**`, `*`, `\n`). run-kpi
+6 (2712), copertura Campo 135/135 (fondo 135). Banchi: `campo-foglio-turno`
44/44 (iniezioni del Quadro sul modulo; cp 15 rimessi; --live 44/44),
`campo-numeri-tranquilli` 94/94 e ora applica per file (4, 5, 5b sul modulo
+ una nuova sull'`attenzione`; cp 18/18 rimessi, 41 cadute). Pin: prove
3.193, asserzioni 3.625, copertura 888/888. Giro `node` sulla copia: 38
comandi a posto. Scatto del rapporto guardato.

⚠️ `campo-sentinella-frasi.mjs` vuole la porta POSIZIONALE (`node … 8823`) e
NON alza un server suo: lanciato da solo cade con ERR_CONNECTION_REFUSED.
Non è un difetto del prodotto: lo lancia `tutti.mjs` col suo server. Non
l'ho misurato in questa unità (le sue frasi sono dello schermo, non del
foglio).

## Stato roadmap
Voce `[x]` «CAMPO — il rapporto di fine turno stampato si compone nel
modulo» sotto quella del DDT/preventivo di Conti.

## Prossimo passo atomico
Scudo, i due fogli che si stampano dallo schermo: `costruisciVerbale(lav)`
(`apps/scudo/index.html`, ~riga 5646) compone le righe del verbale di
consegna DPI a partire da `verbaleDpi(lav, DPI)` del modulo — ma le PAROLE
delle celle («fatto (non obbligatorio)», «non previsto», «DA FARE», «non
registrato», «non indicata», i puntini per la firma) vivono nella pagina;
`costruisciCartella(c)` (~riga 5771) idem da `cartellaLavoratore`. Stessa
forma: `fogliaVerbaleDpi(lav, {dpi, mansioni, oggi})` e
`fogliaCartella(lav, dati, oggi)` nel modulo che restituiscono
`{titolo, intestazione, colonne, righe (testo), note, nonMisurati}`; la
pagina costruisce il DOM. Prima censire le iniezioni (`stampe-fs` ha
«${c.modello ? esc(c.modello) : "non registrato"}» sulla pagina di Scudo:
`grep -n "non registrato\|costruisciVerbale\|costruisciCartella\|DA FARE" apps/deepwork-id/tests/browser/*.mjs`)
e riancorarle sul modulo leggendo «N rimessi davvero»; prove in run-kpi;
banchi `stampe-fs --solo=scudo` sana+controprova, `scudo-documenti`,
`scudo-numeri-tranquilli`; scatti guardati.
Alla prossima accensione della routine: canarino prima di tutto.

## Blocchi
Nessuno tecnico. Decisioni del fondatore ancora aperte: 5b, 19-27, Q1,
registro esplosivi, TD24/IPA/split payment, registro dei terzi, trasmissione
del report.
