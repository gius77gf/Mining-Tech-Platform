# Checkpoint — «non lo so» è una risposta diversa da «non c'è»

- **Tipo**: unità (12 prove sull'appello e sulla checklist di inizio turno)
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `d6b3c8c`

## La regola più affilata di tutta l'app

Sta nell'appello del turno, ed era già scritta nel modulo:

> **«Non lo so» è una risposta diversa da «non c'è».**

Chi non è ancora stato spuntato non viene contato né presente né assente.
Perché se suona l'allarme e si va al punto di raccolta, **l'appello si fa su
questa lista**: contare per assente qualcuno che nessuno ha guardato vuol dire
**non andarlo a cercare**.

La controprova lo dice senza giri di parole: cambiata una riga,
`assenti 1, daFare 0`.

## Le altre

- **Chi oggi non è disponibile non entra nell'elenco da spuntare**: sarebbe una
  domanda senza risposta, e allungherebbe una lista che si legge di corsa.
- **La squadra si riconosce anche col nome esteso**: chi scrive «Squadra A —
  Perforazione» non deve sparire dall'appello di «Squadra A».
- **Fra due spunte della stessa persona vale l'ultima**, e un **appello vuoto
  non è un appello completo**.
- Sulla **checklist di inizio turno** vale la stessa regola delle ispezioni di
  Scudo: quello che non è stato spuntato **non risulta a posto**, e le voci non
  conformi escono col loro **testo** — il preposto legge quello e decide se si
  comincia, un indice non gli dice niente.
- **I dati vecchi restano visibili**: una registrazione senza data appartiene a
  tutti i giorni invece di sparire dagli elenchi, e quante ne restano senza si
  dice.

Controprova: **8 difetti rimessi, 8 visti, 0 non visti.**

## Una cosa che si vede solo mettendo insieme la giornata

Le stesse tre regole tornano in **tre app diverse**, scritte da tre punti di
vista diversi:

| in Sentinella | in Scudo | in Campo |
|---|---|---|
| «senza dati» non è «conforme» | «non risulta» non è «va bene» (requisito mancante) | «non lo so» non è «non c'è» (appello) |

È la stessa idea: **l'assenza di un dato non è un dato favorevole.** Vale la
pena averla trovata tre volte in tre posti indipendenti: vuol dire che è un
principio del prodotto, non una scelta locale.

## Stato

- **743** KPI (433 all'inizio della giornata) → **1026** prove `node`, verdi in
  UTC **e** in ora italiana
- **310 prove nuove** in giornata, **7 difetti di prodotto** trovati e corretti
- Campo: da **26/73** a **44/73** funzioni coperte

## Prossimo passo atomico

Restano scoperte in Campo le funzioni della **foto dell'anomalia** (le misure e
i controlli che tengono una foto di telefono dentro il limite di un documento) e
del **piano di carico** che arriva da Genesi. Poi il censimento dice che le meno
coperte diventano **flotta** (29/71) e **terra** (23/39).

## Bloccanti

- Nessuno.
