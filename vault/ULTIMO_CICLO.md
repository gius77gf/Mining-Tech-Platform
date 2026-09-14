# Ultimo ciclo di lavoro automatico

- **Quando**: 2026-09-14, 09:47 UTC
- **Commit di partenza**: `a27ae45a`
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa sta per succedere

Questa non è una ripresa da fermo: la routine "Weekly Dev Session" ha
sparato una nuova accensione (fuoco delle 09:45:38 UTC) mentre questa
stessa sessione era in una **conversazione dal vivo col fondatore**, non
in un ciclo automatico isolato. Repository raggiungibile, `HEAD` allineato
al remoto, `git pull` senza cambiamenti.

⚠️ **Stato particolare da dichiarare**: il fondatore ha appena chiesto in
conversazione *"hai riflettuto su come rendere Genesi simile ad un CAD?"*
e gli ho rimandato una domanda di chiarimento (quale aspetto intende:
precisione/snap, layer, strumenti di disegno veri, o import/export CAD) —
**non ancora risposta**. Finché non risponde, non scompongo né avvio
quel cantiere: sarebbe esattamente l'errore che questo file documenta
altrove ("niente entra sulla parola dell'agente" applicato a sé stessi —
qui varrebbe "niente si costruisce su una domanda aperta del fondatore
senza la sua risposta"). Il lavoro automatico prosegue su altro nel
frattempo (ricerca continua, revisione), non si ferma.

⚠️ **Direttiva del fondatore in conversazione, più recente e più specifica
del prompt fisso di questa routine — CONFERMATA ANCORA VALIDA per la
quarta volta**: concentrarsi SOLO sull'app Genesi. Il prompt fisso di
questa accensione (ponti fra le app, lavoro multi-app in parallelo,
"Genesi NON esce dal browser") resta un template generico non
personalizzato — la seconda parte è anche **scaduta**, verificato e
documentato nel checkpoint `20260914-005111`: il gap "Genesi non esce dal
browser" è stato chiuso il 02/09.

⛔ **SEGNALAZIONE DI SICUREZZA APERTA, INVARIATA — DA LEGGERE PRIMA DI
TOCCARE GEOMETRIA/FLYROCK/BURDEN.** Il gate su
`deviazioneForiDaCsv`/`burdenVeroDaRilievo` (import del rilievo boretrack)
resta bloccato sul fondatore (`docs/DECISIONI_WEEKEND.md`, sezione 6).
Le soglie di sicurezza USBM/DIN restano un'altra decisione aperta (sezione
9), anch'essa invariata. Nessuna delle due è stata toccata in questo blocco.

## Cosa è successo nel blocco in corso (14/09, dal canarino delle 00:47)

**Il gruppo B3 diagnosticato è chiuso** (G39-G43): `innescoSuMaglia`,
`reliefSuMaglia`, `energiaSuMaglia`, `sequenzaSuMaglia`, `generaMaglia` —
tutte pure in `genesi-data.js`, ognuna verificata byte per byte contro la
vecchia forma, con iniezione del difetto e screenshot nel browser vero.

**G7 ha una seconda fetta consegnata** (G44): `vibrazionePerBurden` —
il confronto burden ora stima anche MIC/PPV, riusando le funzioni pure
del gruppo appena chiuso. Wired al bottone "Confronta burden".

**Una ricerca automatica verificata e in parte corretta**: proponeva
"manca un vincolo S/B" — falso, esiste già (prima riga della scheda
validatori). Il gap vero trovato (nessun verdetto di sintesi sopra i
singoli badge) è stato loggato come candidato **G45**, non costruito: un
badge "pronto" che non copre il pannello KPI separato (MIC/PPV/airblast)
rischierebbe di leggersi come una garanzia di sicurezza che non dà.

**Revisione completa dei banchi del browser di Genesi**: rilanciati tutti
e dodici, trovati e corretti **due difetti reali**, entrambi test
invecchiati (non regressioni di prodotto):
1. `genesi-campi-assenti.mjs` non sapeva che B0-septies (di questa stessa
   sessione) fa uscire la scheda validatori PRIMA di disegnare righe
   quando burden/interasse mancano — corretto rendendo l'asserzione più
   giusta per quei due campi soli.
2. `ponte-genesi-campo.mjs`/`ponte-genesi-sentinella.mjs` non tagliavano
   l'import Firebase appeso (~13s) sul lato Campo/Sentinella, solo su
   quello Genesi — applicata la stessa difesa già su nove altri file.

**Ora tutta la superficie Genesi del browser è verde**: 12 banchi, 400+
verifiche, zero KO.

**Sei unità di estrazione/prodotto + tre unità di revisione/ricerca +
tre canarini**, tutte committate e pushate, ognuna verificata su
`git worktree` isolata con `giro-node.mjs` prima del commit.

## Prossimo passo atomico

1. **Immediato**: aspettare la risposta del fondatore sulla domanda CAD
   prima di scomporre o costruire qualunque cosa in quella direzione.
2. Nel frattempo: ricerca continua su un altro argomento a rotazione, o
   ulteriore revisione/pulizia se emerge qualcosa di verificabile.
3. Se il fondatore non risponde e serve comunque proseguire: tornare al
   censimento `genesi-estraibili.mjs` (già esaminato a fondo, risultato
   sostanzialmente esaurito) o alla lista "SE LA ROADMAP SEMBRA FINITA"
   del prompt fisso della routine.

Nessuno stop volontario: si prosegue subito, rispettando la domanda
ancora aperta col fondatore.
