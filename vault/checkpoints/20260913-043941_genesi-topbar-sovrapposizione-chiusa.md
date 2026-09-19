# Checkpoint — 2026-09-13T04:39:41Z

## Tipo
correzione di prodotto (difetto visivo reale, trovato con verifica di qualità di routine)

## App
Genesi (direttiva del fondatore ancora in vigore: solo Genesi)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`99b0a82b`

## Completato

Dopo il riavvio del contenitore (nessun lavoro perso — solo un ciclo di
attesa già consumato prima del riavvio), ho fatto una verifica visiva di
routine sulle schermate Home e 3D di Genesi a 320/390/430px (per la
regola "verifiche di qualità su superfici non toccate dal blocco di
sicurezza"). Screenshot guardati davvero: sulla schermata 3D a 430px il
titolo "DEEPWORK GENESI" sembrava sovrapposto alla barra dei comandi in
alto a destra.

**Misurato invece di fidarmi dello screenshot**, con
`getBoundingClientRect()` su `#brand h1` e `#topright` a tredici
larghezze diverse: il nome finisce a 243px (costante, non dipende dalla
finestra), la barra comandi (6 bottoni, ancorata a destra) è larga
361px su una riga sola — quindi si sovrappongono ovunque la finestra sia
sotto 243+16+361=**620px**. La soglia esistente che nasconde il nome
sotto una certa larghezza (introdotta per lo stesso difetto, misurato
allora a 390px) si fermava a **420px**: copriva solo il primo terzo
della sovrapposizione vera, lasciando scoperta la fascia **421-620px**
— la larghezza più comune per un telefono in verticale (iPhone
standard, molti Android).

**Causa strutturale**: `#brand` e `#topright` sono due HUD
`position:fixed` indipendenti (non un layout flex condiviso): non si
accorgono l'uno dell'altro, quindi qualunque soglia fissa vale solo
finché qualcuno la rimisura — esattamente la famiglia di difetto che
CLAUDE.md documenta più volte ("una soglia calibrata su un caso non
regge su un altro senza rimisurare").

Corretta la soglia da 420 a **630px** (margine di 10px sopra i 620
misurati). Verificato di nuovo con lo stesso script su tredici
larghezze (320-760px): **zero sovrapposizioni**, transizione netta a
630/631. Confermato anche con screenshot a 450 e 550px (guardati, non
solo prodotti).

**Non tocca la segnalazione di sicurezza aperta**: è un difetto di
layout della barra del titolo, non della geometria del fronte, del
flyrock o del burden — nessuna delle formule/soglie sotto il blocco di
`docs/DECISIONI_WEEKEND.md` §6 è stata toccata.

Verificato su worktree della copia di ciò che si committa:
`giro-node.mjs` → **40 comandi a posto, 0 caduti**.

## Stato roadmap

Nessuna voce di `vault/ROADMAP_SETTIMANA.md` toccata.

## Blocchi e limiti noti

Nessuno nuovo. Blocco di sicurezza su geometria/flyrock/burden invariato
(`docs/DECISIONI_WEEKEND.md` §6, ancora senza risposta del fondatore).

## Prossimo passo atomico

Con questa correzione chiusa, la verifica visiva di routine su Genesi
può proseguire su altre schermate/larghezze non ancora controllate in
questo blocco (es. Progetto 2D con pannelli aperti, le schermate di
riconciliazione/signature-hole). In alternativa: attendere la risposta
del fondatore sulla segnalazione principale, o una nuova ricerca di
fianco su un angolo Genesi non ancora coperto.
