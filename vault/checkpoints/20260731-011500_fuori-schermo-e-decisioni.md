# Checkpoint — quello che non si vede, e le decisioni lasciate a metà

- **Tipo**: un banco nuovo, una rifinitura, due decisioni chiuse per iscritto
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `34f7061`, `83ed551`, `edc0035`, `c4a6c7e`

## 1. Niente fuori dallo schermo di un telefono — e adesso lo dice un banco

Due volte se n'era accorto un essere umano guardando uno screenshot: in
Sentinella la barra in basso tagliava «REPORT» — una **sezione intera dell'app
irraggiungibile**, senza nessun errore da nessuna parte — e nella vetrina l'alone
d'apertura faceva comparire lo scorrimento laterale. Finché a trovarlo è un paio
d'occhi, alla schermata dopo è già tornato.

Due scelte tengono il banco **leggibile invece che rumoroso**, ed erano la parte
difficile:
- si guardano **solo i comandi** (bottoni e collegamenti). Aloni e sfumature
  escono di proposito e vengono ritagliati: metterli nel conto riempirebbe il
  risultato di rumore, e un banco rumoroso è un banco che nessuno legge. Il metro
  è «una persona riesce a toccarlo?».
- si guarda la posizione nel **documento**, non nel viewport: un comando sotto la
  piega ha comunque i suoi bordi giusti, mentre chiedendolo al viewport
  sembrerebbe irraggiungibile — è la trappola già pestata con
  `elementFromPoint`.

Nove superfici per due larghezze (390 e 360 px): **18 schermate, tutte pulite**.

## 2. Finché non so chi sei, il contatore non dice «0»

Accanto a «Cosa tocca a me», in Campo, c'era uno zero. Il numero era vero — ma
**zero è una risposta**: vuol dire «non ti tocca niente». Prima che uno scelga la
squadra la risposta vera è «non lo so ancora», e le due cose non si somigliano
nemmeno: un capoturno che apre l'app la mattina e legge 0 pensa di essere libero.
Il riquadro sotto lo diceva già giusto («Dimmi chi sei»); era il numero accanto
al titolo — quello che si legge per primo — a contraddirlo.

Gli **altri sei** contatori di Campo contano cose che esistono comunque, e lì lo
zero è una risposta buona: la regola riguarda solo il contatore che dipende da
una scelta non ancora fatta.

## 3. Due decisioni che erano rimaste a metà

**I soldi nei grafici.** Nel testo «€ 48.200,00», su un asse «2.000 €». Sembra
un'incoerenza e non lo è: su un asse il simbolo non è parte dell'importo, è
l'**unità di misura dell'asse**, e sta dove stanno «l/h», «%» e «mm/s».
Uniformarle vorrebbe dire scrivere «€ 2.000» su un asse — dove nessun grafico al
mondo lo scrive — oppure «48.200,00 €» in mezzo a una frase. Quindi non si cambia
niente: si **scrive la decisione** nei due posti dove uno verrebbe a cercarla,
accanto a `euro` e accanto a `conUnita`. Una domanda lasciata aperta è il posto
peggiore in cui lasciare una regola.

**R2 e R3 non sono più ipotesi.** La ricerca di luglio li aveva già scritti come
rischi — «l'abbonamento non è applicato davvero», «tutti i membri possono tutto»
— ma restavano deduzioni dalla lettura delle regole. Un rischio scritto è
un'opinione finché qualcuno non lo misura, e un'opinione non fa prendere nessuna
decisione. Ora i due documenti si citano a vicenda: la ricerca porta il verbale
dell'emulatore, la revisione dichiara che i buchi non li ha scoperti lei.

## Quello che NON è stato fatto, e perché

La **terza iterazione della vetrina** resta aperta. La seconda è chiusa (anteprime
e conti), ma la terza — «metterla accanto ai migliori prodotti in circolazione e
correggere dove la nostra è più povera» — chiede una ricerca vera su vetrine di
prodotto, e senza quella verrebbe fuori un ritocco a sentimento, che è
esattamente quello che la regola dell'eccellenza vieta.

Misurata intanto la pagina, così chi la riprende parte da un numero e non da
un'impressione: **7.237 px su un telefono, 8,6 schermate**. Il 66% è la sezione
delle app (nove schede da ~480 px l'una), il 17% i ponti, il 12% l'apertura.
Nessuno di questi pezzi è gonfio: è una pagina che mostra nove prodotti con le
loro schermate vere, e accorciarla vorrebbe dire togliere qualcosa che il
fondatore vuole far vedere. Se si accorcia, va deciso **cosa si toglie**, non
«quanto».

## Prossimo passo atomico

**Vetrina, terza iterazione**, partendo dalla ricerca: cercare tre o quattro
vetrine di prodotto software fatte bene, studiarne l'ordine delle informazioni e
il modo in cui fanno capire un prodotto in dieci secondi, depositare la scheda in
`docs/`, e solo dopo tradurla in unità concrete sulla nostra.

## Bloccanti

- Nessuno tecnico. Restano in attesa del fondatore le tre domande della revisione
  di sicurezza e le tre di `docs/PERCHE_DEEPWORK_E_GENESI.md`.
