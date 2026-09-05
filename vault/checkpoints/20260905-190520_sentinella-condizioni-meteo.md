# Checkpoint — 2026-09-05T19:05:20Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
2cdb4d3c — Sentinella: le condizioni meteo della misura, e la regola del DM
16/03/1998 sul rumore — due mancanze confermate di B4 passano a «c'è»

## Completato
Cinque campi facoltativi sulla lettura (vento, ventoDa, pioggia, temperatura,
umidita), `condizioniMisura` / `misuraFuoriCondizioni` (fuori · dentro ·
NON SI PUÒ DIRE, solo sul rumore) / `contaFuoriCondizioni` /
`campiCondizioni` in `apps/sentinella/sentinella-data.js`; ragione di
annullamento «meteo»; form, riga della lettura con il suggerimento, striscia
di conferma, report (frase e tag) nella pagina; CSV ambiente a 14 colonne,
censimento aggiornato. run-kpi +6 (2728), copertura Sentinella 164/164
(fondo 164). Pin: prove 3.209, asserzioni 3.647, copertura 901/901. Giro
`node` sulla copia: 40 comandi a posto (il primo giro aveva bocciato SOLO
il pin delle asserzioni, 3.641 → 3.647). Quattro banchi Sentinella verdi con
controprove cadute; due ancore d'iniezione riancorate. Righe di
`CONCORRENTI_SENTINELLA` → C'È, B4 sentinella 13 → 11, totale 44 → 42;
metà sul mondo in `RICERCA_CONTINUA_SENTINELLA`. Tre scatti guardati.

⛔ Due difetti presi facendo l'unità (entrambi nel messaggio del commit):
le due copie delle letture che perdevano i campi nuovi; e «Registra» che
dall'08/08 scriveva la misura e poi moriva su `letture` fuori scope —
nessuna prova rossa, preso dallo scatto. `nomi-liberi` non lo vede perché
la seconda domanda guarda solo le CHIAMATE (`nome(`), e qui il nome era
un riferimento nudo in una scorciatoia di oggetto; la quarta domanda guarda
i riferimenti nudi ma non lo scope.

⚠️ E questo file è entrato in git VUOTO al primo colpo (ef9afa64): scritto
con un heredoc di shell, la riga con il pezzo di regex conteneva `$(` e la
shell l'ha preso per una sostituzione di comando — la scrittura è saltata e
il `git commit` sulla stessa riga è partito lo stesso. È la regola già
scritta in CLAUDE.md sul commit che parte dopo una scrittura fallita, nella
veste del checkpoint. Un checkpoint si scrive da python o con `-F`, mai con
un heredoc che contiene codice.

## Stato roadmap
Voce `[x]` «SENTINELLA — le condizioni meteo della misura…», tabella di B4
aggiornata (sentinella 11, totale 42) con la riga ⏱️ 44 → 42, e il candidato
su `nomi-liberi` lasciato scritto in coda alla voce.

## Prossimo passo atomico
Portare la SECONDA domanda di `nomi-liberi` (lo scope) anche sui
riferimenti NUDI — misurando PRIMA il costo della stretta su una copia:
`fuoriScope` cerca solo `nome(`; la quarta domanda (i riferimenti nudi,
74.378 su 12 pagine) sa trovare i nomi ma non chiede «esiste QUI?».
Procedura: (1) in scratchpad, una variante di `fuoriScope` che accetta anche
il nome nudo (non seguito da parentesi, non preceduto da punto), con le
scorciatoie di oggetto e le destrutturazioni escluse dal lato dichiarante;
(2) contare gli allarmi nuovi su tutte le pagine e nominarli uno per uno;
(3) controprova: rimettere il difetto di oggi (`const letture` dentro la
callback di `db.trasforma` in Sentinella) e pretendere 1 allarme; (4) se il
rumore è dichiarabile per nome, entra in `nomi-liberi`; se no, si scrive qui
il numero e si lascia.
In alternativa, se il costo è alto: un'altra mancanza confermata di B4 che il
codice può colmare (Campo 11 e Sentinella 11 sono le liste più lunghe:
rileggere le righe di `CONCORRENTI_CAMPO` e scegliere la più chiesta da un
ispettore).

## Blocchi
Nessuno.
