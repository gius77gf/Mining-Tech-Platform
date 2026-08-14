# Checkpoint — 2026-08-07 02:24:44 UTC

## Tipo
unit-complete (due unità: i sei bottoni di sistema in Genesi, Scudo + Conti con
un dato solo)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`4ecf023` — *Scudo e Conti con un dato solo: 30 frasi, e in tutt'e trenta il
sostantivo era già giusto*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 104 | **i sei bottoni di sistema in Genesi** (`6781700`) | grigio `rgb(239,239,239)`, **Arial**, raggio 0 |
| 105 | **Scudo + Conti con un dato solo** (`4ecf023`) | **30** frasi, 85 asserzioni, 31 iniezioni su 31 |

## ⛔ Il filo: *in trenta frasi su trenta il sostantivo era già giusto*
Il caso limite è sempre **uno**, e la dimostrazione non ce l'ha mai. Ma la forma
del difetto si è affinata: **non è il sostantivo**, è tutto il resto della frase.

| dove | che cosa leggeva l'utente |
|---|---|
| Scudo · CSV L. 198/2025 | «L'unico near-miss … ha la gravità scritta. **Sono** meno di 5» |
| Scudo · promemoria mandato al lavoratore | «risulta SCADUTA dal 06/08 (**1 giorni fa**)» |
| Scudo · checklist di UNA voce | «**Tutte le voci** hanno un esito» — *di numeri non ce n'è nemmeno uno* |
| Conti · otto export | «**Esportate** 1 fattura», «**Esportati** 1 incasso»… |
| Conti · banca | «**Letti** 1 movimento» mentre due cm sotto già diceva «1 riga letta» |
| Conti · `margineMese` | «mancano **i costi di** personale» con una voce sola — e quattro righe sotto il singolare c'era già |

## ⛔ E IL SETACCIO CLASSICO È CIECO SU QUESTA FAMIGLIA — misurato
Nella controprova di Conti il setaccio «1 <plurale>» resta **verde** mentre 13
asserzioni cadono: dopo il numero il sostantivo **è** singolare. Da lì un
**secondo setaccio che guarda la parola PRIMA del numero** («Esportate 1»,
«Letti 1», «i 1»).
⚠️ E il righello ha sbagliato prima del prodotto: schiacciando anche gli **a
capo** dava due allarmi falsi — il «1» era il contatore della pastiglia
precedente. Si schiacciano solo gli spazi orizzontali. (Stessa forma dell'errore
di `uno-solo` col «1 MEZZI» di Flotta: due elementi diversi uniti da `innerText`.)

## ⛔ La mia proposta su `.acc` era sbagliata, e il cantiere l'ha MISURATA
Avevo indicato `.dw-accent`. Il cantiere ha verificato invece di crederci:
· è battuta da `.note b:not(.badge)` — 0,2,1 contro 0,1,0;
· applicata non cambiava **un pixel** (confronto byte per byte su 3 riquadri);
· e su `--card2` fa **4,30:1**, **sotto AA**.
`.acc` non ha mai fatto niente: **tolta**, non sostituita con un'altra classe
inerte. Stessa cosa per `.fld`: la classe giusta **c'era già** in Scudo
(`.fcamp`), e definirla sarebbe stata la **quarta** copia (Terra la usa 53
volte). **Ottava volta in questo blocco che a sbagliare è il controllo — e
stavolta il controllo ero io.**

## ⛔ Sei bottoni di sistema in Genesi
`class="btn-sec"` × 6, definita da nessuno. `getComputedStyle`: grigio
`rgb(239,239,239)`, testo nero, bordo 2px nero, raggio **0**, **Arial 13,33px**
— i bottoni del browser dentro un'app con la sua palette. E sono **quelli che
producono i documenti**: esporta piano di carico per il fochino, esporta scheda
volata, salva nello storico, report, XML d'innesco. La classe vera è `btn`, che
usano già 35 bottoni suoi.

## Stato delle prove
Prove `node` **2.194** (run-kpi **1790**), copertura **662/662**, banchi **122**.
Giro `node` 21 comandi, 0 caduti sulla copia di ciò che si committa. Controprove
rilanciate **da me**: Scudo 17/17 (19 prove cadute su 44), Conti 14/14 (19 su 41).
Verifiche trasversali sul committato: `uno-solo` **67 schermate / 174.567
caratteri / 0 KO**, `unita-maiuscole` **14 superfici pulite, 35 unità cercate**.

## Che cosa sta girando adesso
**Due cantieri**: **il core** (le modali, 11 su 68 — tocca `index.html`,
`giro.mjs`, `modali-dentro.mjs`) e **Terra + Sentinella** (un dato solo; tocca
`terra/index.html`, `sentinella/index.html`, `terra-frasi-da-uno.mjs`,
`campo-sentinella-frasi.mjs`, e sta scrivendo un `frasi-da-uno.mjs` nuovo).
⛔ I loro file **non vanno committati**: è lavoro a metà.

## Prossimo passo atomico
1. **Raccogliere i due cantieri** con la procedura di stanotte: indice, verifica
   sulla **copia di ciò che si committa**, controprove **rilanciate da me**,
   contatori dei documenti **rimisurati** (stanotte quel controllo ha corretto
   **sette** numeri che avevo scritto o ricevuto).
2. **Ad albero fermo**: la correzione del motore dei grafici + il suo banco
   (`docs/IL_GRAFICO_DISEGNATO_ALLA_MISURA_DI_FUORI.md`), e il **pieno senza
   spesa** nei dati d'esempio di Flotta — renderebbe visibile una funzione e
   misurabile una regola in un colpo solo.
3. **Il censimento delle classi orfane nei test**, con le eccezioni dichiarate
   una per una.
4. **I 4 CSV di Scudo** senza il marchio della dimostrazione (fra cui il registro
   infortuni): adesso Scudo è libera.
5. **Le 19 decisioni scadono oggi, venerdì 07/08.**

## Code aperte, dichiarate
- **Conti**: sul Quadro «chi sollecitare per primo» chiama `apertoDi(f)` **senza**
  le note di credito — con una fattura stornata per intero la riga resta con
  «€ 1.000,00 residuo» accanto a un KPI che dice «da incassare € 0». Il modulo
  **dichiara** quella scelta e la lettera al cliente le note le riceve già: è una
  decisione di prodotto, non un refuso.
- **Scudo**: le tre copie di `.fld`/`.fcamp` (Conti col `gap`, Terra senza)
  andrebbero unificate in `shared/`, ma divergono e unificarle cambia Terra.
- **Genesi**: l'XML con l'id interno dell'esplosivo; la Home che esporta lo stato
  del 3D.
- Il **minimo di visibilità** dei grafici, `#ppv-scelta` di Sentinella,
  `.meta.pesa` di Conti: misurati, dichiarati.

## Blocchi
Nessuno.
