# Checkpoint — 2026-08-10T04:31:24Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`2d7c162` — *fix(core): «Durata totale: 0 ms» dove nessuno aveva impostato
niente — e la riga sotto lo smentiva già*

## Che cosa è stato fatto

Nel pannello **«Sequenza sparo»** del core il riepilogo leggeva i ritardi dei
fori con `parseNum0` — che di un valore **assente** fa zero — e concludeva
«Durata totale: **0 ms**»: una volata che dura un istante. Due righe più sotto
l'elenco dei fori scriveva onestamente «—» per ognuno.
⛔ **La stessa pagina raccontava due cose diverse degli stessi fori, e quella
che si legge per prima era la falsa.** È il difetto della settimana nella forma
più pura, su una schermata che **nessun banco guardava**
(`grep -rl "Durata totale" apps/deepwork-id/tests/` → niente).

Adesso il totale si calcola solo sui fori che un ritardo ce l'hanno davvero,
dice «—» quando non ce n'è nessuno, e **dichiara** quanti restano fuori.
⛔ `calcolaCaricaMaxRitardo` **non è stata toccata**: raggruppa i fori senza
ritardo sullo stesso istante, quindi **sovrastima** — sbaglia nella direzione
prudente — ed è il numero da cui dipende la previsione di vibrazione, ferma al
fondatore. Qui non si cambia il numero: si **dice** com'è calcolato. Misurato:
**30,0 kg** coi sei fori senza ritardo, **5,0 kg** quando ce l'hanno tutti.

## ⛔ Tre volte il righello ha sbagliato prima del prodotto
1. la prima passata misurava il **guscio d'accesso** (258 caratteri): l'ha
   fermata la guardia scritta *prima* di misurare, non un controllo a valle;
2. lo **scatto fotografava la home** — il pannello veniva composto in un
   `#ec-side` di una schermata non aperta. Le asserzioni sul testo reggevano
   (leggono l'`innerText` del pannello) ma lo scatto mostrava un'altra cosa:
   trovato **guardando** l'immagine;
3. la scena era povera e lo scatto diceva «VOLATA #undefined» e due «Foro #1»:
   difetti **della scena**. Uno scatto che mente è peggio di nessuno scatto.

⚠️ E una quarta, sul controllo che sorveglia le iniezioni: `iniezioni-fresche`
ricostruisce le costanti con `NOME = join(...)` e la sua regex si ferma alla
**prima `)`** — su un `join(dirname(...))` annidato produce JS spezzato e
dichiara l'intera tabella «non leggibile». Aggirato con un nome minuscolo, col
difetto scritto accanto perché non si aggiri due volte.

## ⛔ E il totale del giro l'ho sbagliato DUE volte, in due modi diversi
Ieri prevedevo 2.827, il giro contava 2.828: mi sfuggiva una suite che conta
**file**. Oggi ho detto «misuro gli addendi che si muovono» e ho scritto 2.830;
il giro ne ha contati **2829**.
Il confronto riga per riga dei due registri dice dove: `suite-collegate` **non**
è passata da 124 a 125 asserzioni — stampa «**3 passati** · 125 file guardati»,
e i 125 sono il **denominatore**. Il giro somma l'«N passati» dell'ultima riga:
avevo misurato il numero **accanto** a quello giusto.

> **Il totale del giro non si prevede: si legge dal giro.**

## Verifica
Copia di ciò che si committa: **34 comandi a posto, 0 caduti**, 2829 asserzioni.
Banco `core-sequenza-ritardi.mjs` (registrato in `tutti.mjs` con la sua
controprova): sana **6 ok / 0 KO**, zero errori di pagina; controprova **3 ok /
3 KO**, e i tre che non cadono sono quelli in cui il codice vecchio aveva
ragione.
Esecuzioni del browser **178 → 180**, file di banco **74 → 75**, aggiornati nei
quattro documenti — ⚠️ e il quarto non si correggeva come gli altri tre, perché
`DECISIONI_WEEKEND.md` manda la frase **a capo in mezzo al numero**.

## Stato roadmap
Nuova: **C1** — «undefined» disegnato sui fori e «UNDEFINED FILE» nella striscia
dei KPI, **visti in uno scatto**. Non è la scena (resa realistica, le scritte
restano): è la famiglia «undefined a schermo» già raccolta in `CLAUDE.md`, e
qui è una parola inglese in un prodotto italiano.
Aperte: **B0-decies**, **B0-duodecies**, **B4-bis**, **B0-bis**, **C1**;
**B0-septies** ferma al fondatore.

## Prossimo passo atomico
Raccogliere i **tre cantieri**, che hanno finito di produrre i loro file
(`genesi-recettore2/BLOCCO_run-kpi.js`, `banco.mjs`, `valle.mjs`;
`tendine-core2/finale-*.log`; `uno-fl-sent2/`): per ognuno **rimisurare le
affermazioni**, mettere nell'indice **solo** i suoi file, verificare sulla
copia, commit, checkpoint.
⚠️ E il primo giro dopo questo commit **confermerà le due cifre** corrette dopo
la sua misura (2.830 → 2.829): se dicesse altro, ha ragione lui.

## Blocchi
Nessuno tecnico. Fermi al fondatore: **B0-septies** e le **soglie di sicurezza**.
