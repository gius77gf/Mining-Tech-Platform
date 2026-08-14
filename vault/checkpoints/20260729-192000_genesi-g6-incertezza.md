# Checkpoint — 29/07/2026 19:20 UTC

## Task completato
**Genesi G6 — la banda d'incertezza dalla precisione di perforazione.**
Commit `695c4f9`, branch `claude/scheduled-tasks-remote-control-bk4ap6`.
Con questo il Blocco 3 di Genesi ha chiuso G1, G2, G3, G4, G5 e G6:
restano solo G7–G9 (ottimizzatore di volata, report professionale,
rifiniture della scena).

### Perché contava
Tutti i numeri dell'app partono da una maglia disegnata perfetta. In cava
non lo è mai: il foro parte spostato dal punto segnato e scendendo scappa
dal suo asse. Al piede, dove conta, il burden reale non è quello di
progetto — ed è lì che nascono i piedi sporchi da un lato e le proiezioni
dall'altro. Una previsione che non dice **di quanto può sbagliare** è mezza
previsione.

### Come è fatta
Due campi coi valori del proprio carro (errore al colletto in metri,
deviazione in percentuale della lunghezza) e la geometria vera perturbata
300 volte. Dettaglio che cambia il risultato: si ricostruiscono anche le
**file davanti** sulle posizioni spostate, perché non si muove solo il foro
che si sta guardando.

Esce la banda del burden minimo al piede, quella della pezzatura, e la
probabilità che almeno un foro finisca sotto il 70% del burden di progetto.

Il seme del sorteggio dipende dalla geometria: **la banda resta ferma
finché il progetto non cambia**, invece di ballare a ogni ridisegno — un
numero che cambia da solo a ogni repaint sembra rotto anche quando è giusto.

### La cosa che il risultato insegna
La banda sulla **pezzatura** resta stretta anche con perforazione pessima
(26–30 cm contro 27–29). Non è un errore: su tanti fori gli scarti si
compensano e il burden medio resta quasi quello di progetto. Quello che
peggiora è il **minimo** — il singolo foro sfortunato — e i guai in cava li
fa quello, non la media. Sta scritto nella scheda, perché altrimenti il
lettore penserebbe che la simulazione non funziona.

Dichiarato anche cosa **non** c'è dentro: si propaga solo la geometria della
perforazione, non la variabilità della roccia, che di solito è più grande.

## Verifiche
- Coi valori di serie (0,15 m / 2,5%): burden minimo 2,4–2,8 m contro 3,0 di
  progetto, rischio sotto il 5%.
- Portando a 0,4 m e 8%: 1,1–2,5 m, e **nel 61% delle volate almeno un foro
  scende sotto soglia**. La reazione ai parametri è coerente.
- A zero e zero non finge una banda: dice che presume una maglia perfetta e
  invita a mettere i valori veri.
- Stabilità: la banda è identica a parità di progetto (verificato
  esplicitamente ridisegnando).
- Campi leggibili e non troncati a 1280 e 390 px, nessun errore di pagina,
  179 test KPI verdi.

## Un errore mio, trovato e corretto
Sostituendo il blocco dei campi avevo **perso la Sottoperforazione**. L'ho
scoperto guardando lo screenshot a 390 px — non leggendo il codice, che è
esattamente il motivo per cui gli screenshot vanno guardati e non solo
prodotti. Rimessa e riprovata end-to-end: il campo legge 0,9, e portandolo a
1,4 la scheda validatori reagisce.

## Cantieri aperti
Quattro, ripresi dal punto in cui il limite di sessione li aveva fermati:
Scudo (matrice formazione e nomine, registro DPI), Conti (data di incasso
vera con incassi parziali), Terra+Sentinella (verbale di rilievo, programma
di monitoraggio), Flotta (ordine di lavoro con manodopera, fermi macchina).
Stanno completando la sola verifica finale.

## Prossimo passo atomico
Raccogliere i quattro cantieri con la verifica indipendente già usata per
Campo — si controlla l'affermazione, non solo che la pagina si apra — poi
commit per app, spunta in roadmap e checkpoint.

Se rientrano puliti, il seguito naturale è il **Blocco 4, i ponti fra le
app**: è lì che sta il valore dell'ecosistema, cioè un dato inserito una
volta che serve in cinque posti. Il primo ponte da fare è
**Genesi → Campo**: il piano di carico esce già da Genesi e Campo lo
importa, ma il ritorno (carica reale foro per foro) non torna indietro a
Genesi per la riconciliazione.
