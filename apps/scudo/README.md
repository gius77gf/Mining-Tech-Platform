# Scudo

App sicurezza & personale. Buyer: datore di lavoro / RSPP.
Prima app a uscire (finestra di mercato L.198/2025).
Primo passo previsto: mockup UI navigabile.

Schermate: Quadro · Personale · Scadenze · **Azioni** (azioni correttive
CAPA: da un evento, da una voce non conforme di un'ispezione o da una non
conformità nasce un'azione con responsabile, scadenza, stato ed esito —
entra nel semaforo e nello scadenzario) · **Ispezioni** · Documenti
(documenti, cantieri, registro infortuni/near-miss).

**Segnalazione rapida dei near-miss (S2)**: dal Quadro, a un tocco, si apre
il modulo che si compila a tocchi (che cosa · dove), con data di oggi già
pronta e possibilità di **segnalare in forma anonima**; quattro tocchi in
tutto. Dalla segnalazione si apre subito l'azione correttiva. Nella pagina
Documenti c'è il **riepilogo aggregato** (per tipo e per luogo, con le azioni
correttive) nella forma chiesta dalla L. 198/2025; con pochi eventi l'app lo
dice invece di disegnare tendenze inesistenti.

**Ispezioni e checklist (S3)**: sei modelli riutilizzabili con le voci
tipiche dell'attività estrattiva (giro di sorveglianza, fronte di cava,
piste, impianto, mezzi e officina, DPI ed emergenza). Ogni voce ha esito
conforme / non conforme / non applicabile più una nota; alla chiusura le
voci **non conformi diventano azioni correttive già collegate**
all'ispezione, e la checklist ricorrente propone da sola la successiva.
Lo scadenzario include i preset degli adempimenti tipici delle attività
estrattive (D.Lgs 624/96: relazione annuale sulla stabilità dei fronti,
certificazione e aggiornamento del DSS…), con periodicità solo proposta e
sempre modificabile dall'utente.

## Bersagli del dito: la regola dell'app

In cava si lavora con i guanti, quindi ogni comando ha una regola precisa. Le
linee guida (Apple 44 px, Material 48 dp) parlano di **area di tocco**, non di
dimensione del disegno: Material dice esplicitamente che l'icona può restare
piccola purché l'area arrivi alla misura con padding trasparente e purché fra
due bersagli ci siano almeno 8 dp. La WCAG 2.2 (2.5.8) formalizza il legame:
un bersaglio sotto misura passa se intorno ha spazio, due bersagli attaccati
mai. Quindi qui, sui puntatori grossolani (`@media (pointer:coarse)`):

- **l'altezza dell'area è 44 px per ogni comando**, presa con uno `::after`
  centrato: non tocca il disegno e non costa un pixel di layout, perché quello
  spazio nella riga c'era già e non lo usava nessuno;
- **la larghezza del disegno resta 30 px** e l'area cresce di 4 px per lato
  (36–38 px). Portarla a 44 px reali costerebbe 96 px di riga per ogni coppia
  di icone contro i 65 attuali, e misurato allunga le liste di 847 px perché i
  nomi vanno a capo: fra «44 px attaccati» e «38 px separati» si sceglie il
  secondo, che è anche ciò che le linee guida indicano quando lo spazio finisce;
- **i muri**: 16 px fra due comandi (8 px di spazio morto fra le aree), **24 px
  prima di una ✕** (16 px di spazio morto) — il centro della ✎ e quello della ✕
  distano 54 px, oltre i 48 dp di Material. Il muro largo va dove l'errore
  costa caro, non dappertutto: dopo un bottone con il bordo disegnato non serve
  (il bordo è già un confine per l'occhio) e allargare lì mandava il gruppo
  comandi a capo;
- **un badge che si tocca non va in coda a un testo tagliato a due righe**:
  finirebbe sulla terza riga, che `overflow:hidden` nasconde, e il comando
  diventa invisibile e irraggiungibile. I badge-comando stanno nel gruppo
  comandi (dove prendono i 44 px pieni) oppure in coda al **nome**, che è corto.

Le misure si rifanno con `document.elementFromPoint` su ogni comando di ogni
schermata: l'area vera è quella che risponde al browser, non quella che si
deduce dal CSS. Resta aperto: i badge inline dentro un testo troncato
(idoneità, azioni di un evento) stanno a 19–33 px d'altezza perché il ritaglio
del troncamento taglia anche lo pseudo-elemento — è il caso che la WCAG esenta
come «bersaglio in linea», e chiuderlo richiede spostarli fuori dal testo.

**Azioni che arrivano dall'ambiente (ponte con Sentinella)**: un superamento di
soglia ambientale o il reclamo di un residente, registrati in **Sentinella**,
aprono da lì un'azione correttiva che nasce **qui**, nella stessa collezione
`azioni` e nello stesso scadenzario — con `origineTipo: "superamento"` o
`"reclamo"` e `origineApp: "sentinella"`. Si riconoscono dal marcatore
**Superamento** / **Reclamo** in testa alla riga e si filtrano con il chip
**Dall'ambiente**; il riepilogo dice quante ne nascono così e quante sono
ancora da chiudere. Poiché l'isolamento dello SDK è per organizzazione **e**
per app, Scudo non può leggere le collezioni di Sentinella: l'azione si porta
dietro il **testo dell'origine** (`origineNota`, `origineData`), che è anche
ciò che si mostra all'ente. Modificarla dal form **non rompe il
collegamento** — vale anche per le azioni nate da un'ispezione, che prima
perdevano l'origine.
