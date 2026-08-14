# Checkpoint — 2026-08-14 12:05 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit di questo tratto
- `a7693218` — regola 21: un contatore nasce «—», non «0»; e sotto ce n'era uno nato «0/0»

## Che cosa è stato completato

**La regola che guarda dove il browser non arriva.** Il banco della finestra di
caricamento preme e giudica ciò che è **visibile**; i contatori dentro una
linguetta chiusa restano irraggiungibili — il banco lo **dichiara** (6 in
Scudo, 2 in Flotta), e dichiarare non è giudicare. Sotto quel filtro stava
`isp-c-cnt` di Scudo, nato **«0/0»**: «zero fatte su zero totali» su una
compilazione che nessuno ha ancora guardato.
La regola 21 di `run-stile` fa la stessa domanda **staticamente**, sul markup
fuori dai `<script>` (dentro, un `class="cnt"` è contenuto **reso**, non uno
stato di nascita). Denominatore misurato e stampato: **51 contatori su 5
superfici** — Scudo 15, Flotta 10, Conti 9, Sentinella 9, Campo 8; il core e
Terra non ne hanno. Controprova **nei due versi**, con l'iniezione che si
dichiara se non trova il suo pezzo: `pers-count` rimesso a «0» viene visto e
**nominato**; `isp-c-cnt` rimesso a «0/0» — la forma vera trovata oggi — pure.

⚠️ **E i KPI sono stati misurati prima di scrivere una seconda regola**: dei
**32** `.kpi .n` statici delle sei app, **zero** nascono con un numero. Quindi
la regola gemella non è stata scritta: sarebbe una guardia con zero soggetti
da correggere, e il banco del browser già li guarda quando sono visibili.
Misura, non impressione.

## Le misure
`run-stile` **322 → 325**, prove **2.790**, giro `node` **36 comandi a posto, 0
caduti**, **3.164** asserzioni, addendi verificati uno per uno. **CI verde** su
tutti i commit del ramo dopo la correzione dei claims.

## Prossimo passo atomico
Passare il censimento a tre gradini dei **ripieghi silenziosi** sulle superfici
che non l'hanno mai visto con la forma corretta dello strumento — Flotta, Conti
e Terra sono state guardate solo dal lato delle **sottrazioni fra insiemi**, non
dalla forma larga `|| costante`. Prima si misura quanti candidati escono, poi si
decide se vale un cantiere: il gradino 1 è rumoroso per costruzione e il numero
onesto lo dà solo il gradino 2 («l'utente lo scrive?»).

## Blocchi
- **Force-with-lease sul ramo**, **B0-septies**, le **soglie di sicurezza** e
  **`dRecFreq` intero all'ingresso**: fermi al fondatore.
