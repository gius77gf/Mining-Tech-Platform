# Checkpoint — 2026-09-05T09:22:39Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
4e82aea7 — Sentinella: la scheda della singola volata — dati, misura
dell'evento, strumento e taratura, comunicazione, reclami del giorno

## Completato
Candidato (e) della ricerca del 05/09 su Sentinella, l'ultimo dei cinque:
`fogliaVolata(v, {monitoraggi, reclami, oggi})` nel modulo (cinque sezioni,
lettura cercata per data E ora, provenienza, taratura che copre la data,
reclami del giorno dichiarati coincidenza), bottone `data-foglio-vol` su ogni
riga del registro, finestra da stampare o allegare, avviso «dati di esempio»
in testa quando si è in dimostrazione. Ogni assenza a parole, mai «—». La
frase «vale come verbale» NON è scritta (fonte primaria non letta).
Misure: run-kpi 2653 (+3); banco nuovo `browser/sentinella-foglio-volata.mjs`
27 ok / 0 KO, controprova 18 caduti su 27 con 5/5 iniezioni, e ognuna vista da
sola con `--difetto=N` (18, 4, 4, 4, 3 caduti). Giro `node` sulla copia del
committato: 38 comandi a posto, 0 caduti, asserzioni 3.566. Copertura
824/824. Documenti: 247 esecuzioni da 103 banchi, 3.134 prove, ricerca (e) ✅,
voce di roadmap chiusa e riga dell'indice tolta.
Due difetti del righello, presi prima del commit e scritti nel banco: `esc`
scrive l'apostrofo `&#39;` (si decodifica); il «—» si cerca nelle CELLE, non
nel foglio intero, perché titolo e nome del punto lo portano di proposito.
Scatti guardati: foglio A4 della b1 e riga del registro a 430 px (la
graffetta sta anche sulla riga prevista).

## Stato roadmap
La voce «SENTINELLA — dalla ricerca del 05/09» è chiusa: (a)(b)(c)(d-metà)(e)
fatte. Resta la trasmissione del report (decisione del fondatore: «il report
si segna come trasmesso?»), che non si prende qui.

## Prossimo passo atomico
Le cinque ricerche del 05/09 (Conti, Genesi, Flotta, Sentinella e le due
metà) sono tutte tradotte. Il passo dopo è il punto 1 della lista «se la
roadmap sembra finita»: aprire `docs/RICERCA_CONTINUA_<app>.md` delle app
NON toccate oggi — **Scudo**, **Campo**, **Terra** — e cercare dal MECCANISMO
(non dal nome) un candidato ancora aperto con «come si misura» scritto, in
casa e senza agenti (direttiva della sera). Primo indiziato: Terra, dove il
foglio per l'ente ha già la forma delle «assenze a parole» e la stessa
domanda di oggi («che cosa esce, e chi decide i suoi numeri?») non è stata
rifatta dopo i lavori del 13/08. Comando di partenza:
`grep -n "^- ([a-z])" docs/RICERCA_CONTINUA_TERRA.md | grep -v "✅"`.
Prima di tutto, alla prossima accensione della routine: canarino
(`vault/ULTIMO_CICLO.md` con `date -u`, commit `canarino:` via `-F`).

## Blocchi
Nessuno tecnico. Decisioni del fondatore ancora aperte: 5b, 19-27, Q1,
registro esplosivi, TD24/IPA/split payment, registro dei terzi, trasmissione
del report.
