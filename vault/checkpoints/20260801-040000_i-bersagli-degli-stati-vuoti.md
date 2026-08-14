# Checkpoint — gli stati vuoti del primo giorno, e il banco che li difende

- **Tipo**: due unità (l'applicazione alle altre tre app, il banco permanente)
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`

## Cosa è entrato

Il terzo pezzo — **come si comincia** — adesso c'è nei cinque punti dove un
cliente nuovo è davvero fermo: anagrafica e scadenzario (Scudo), parco mezzi
(Flotta), listino (Conti), fronti (Terra).

Riscritte anche le spiegazioni per dire a **cosa serve** quella lista invece di
cosa fare. È la differenza fra un'istruzione e una ragione:

> «I fronti sono i posti dove si scava: ogni rilievo del drone e ogni volume
> estratto si attacca a uno di questi. Senza, i metri cubi non sanno a quale
> parte della cava appartengono.»

I bottoni **portano, non fanno**: cliccano il comando che esiste già o portano
il fuoco sul primo campo. Nessuna seconda strada per la stessa cosa.

## Il banco, e perché esiste

`vuoti-azione.mjs` — nato da un **difetto mio**. Scrivendo i primi due bottoni
avevo **indovinato** due identificativi che non esistevano: sarebbero stati
**muti**. Nessun errore in console, nessun test rosso, solo un bottone che non
fa niente proprio nella schermata che serve a chi comincia.

L'ho visto perché avevo misurato. Ma una misura fatta a mano, nello scratchpad,
**alla sessione dopo non esiste** — e quel difetto sarebbe tornato al primo
stato vuoto nuovo. Adesso il controllo è permanente: apre le quattro app,
visita tutte le sezioni e pretende che ogni bersaglio nominato da un bottone
**esista nella pagina viva**.

La controprova aggiunge un id inventato e pretende che venga trovato in
**tutte** le app: se lo trovasse solo in alcune, per le altre non avrebbe
dimostrato niente. Verificata: quattro su quattro.

**Banchi del browser: 13 → 15.**

## Prossimo passo atomico

Restano gli stati vuoti del primo giorno di **Campo** (squadre) e **Sentinella**
(ricettori e punti di misura): stesso trattamento, con i bersagli aggiunti
all'elenco del banco. Poi il giro completo, lanciato **e lasciato in pace**.

## Bloccanti

- Nessuno.
