# Checkpoint — 29/07/2026 15:30 UTC

## Task completato
**Campo — il turno chiuso diventa davvero chiuso**, più la foto
sull'anomalia e il meteo di turno. Il codice era già entrato nei commit di
salvataggio del pomeriggio (`0091465`, `3b3656c`, `c93b719`); qui si chiude
il cantiere con la verifica e il resoconto.

### Perché contava
La firma di consegna del turno era già registrata, ma il turno firmato si
poteva ancora modificare: la firma non valeva niente. Il punto non è
impedire le correzioni — le correzioni servono — è che non avvengano di
nascosto.

### Come è stata fatta
Tutto passa da **una sola funzione pura** (`turnoChiuso`) e da **un solo
guardiano** nell'app. È la scelta che rende il blocco affidabile: se un
punto di scrittura non passa di lì, il blocco non vale, e quindi non c'è
modo di dimenticarne uno in un angolo replicando il controllo venti volte.

**Venti punti di scrittura coperti**: avanzamento di stato, causale e minuti
del fermo, aggiunta e rimozione della foto, modifica di un'attività
(controllando sia il turno di partenza sia quello di destinazione), nuova
attività, bozza/invio/richiamo/eliminazione del rapportino, risposta e
chiusura della checklist, spunta e chiusura dell'appello, obiettivo di
turno, import del piano di carico, carica reale del foro, meteo.
Lasciati aperti di proposito: anagrafiche (non sono dati di turno), export
e stampe (sola lettura), e la chiusura/riapertura stessa.

**Riapertura tracciata**: chiede chi e perché, il nome è obbligatorio, le
riaperture non si cancellano mai e sopravvivono alla ri-firma; compaiono
anche nel rapporto stampabile.

## Verifiche
Il cantiere ha provato i venti punti uno per uno **forzando anche i comandi
disabilitati** — rimuovendo `disabled` e ricreando i bottoni nascosti — per
dimostrare che il rifiuto sta nel salvataggio e non solo nell'interfaccia:
20 su 20 rifiutati, dato invariato. Più 34 prove funzionali e 8 di
compatibilità.

Ricontrollato da me, in modo indipendente:
- **9 asserzioni sulla funzione di guardia**, eseguita direttamente: turno
  firmato chiuso; chiusura senza ora che **non** chiude (una consegna non
  firmata non blocca niente); altro turno e altro giorno aperti;
  registrazione vecchia senza data né turno aperta; nessuna chiusura,
  aperto; la funzione torna la chiusura e non solo un `true`, così il
  messaggio può dire chi ha firmato; riaperture assenti e presenti.
  **Tutte passate.**
- Una mia asserzione era sbagliata al primo giro — avevo scritto una
  chiusura senza `ora`, e il codice giustamente non la considerava una
  firma. Corretta la prova, non il codice.
- Sintassi pulita su `campo-data.js` e sugli script inline; pagina aperta a
  1280 e 390 px senza errori e senza scorrimento orizzontale; nessuna
  finestra del browser; suite verdi (179 KPI, 7 demo).

## Limite dichiarato
Il blocco vive nel browser. Le regole Firestore oggi aprono
`apps/{appId}/**` ai membri dell'organizzazione: quando verranno raffinate
per app, il divieto va ripetuto lato server. Finché non c'è, un utente
determinato potrebbe aggirarlo — va detto, non lasciato implicito.

## Cantieri ancora aperti
Quattro: Scudo (matrice formazione e nomine, registro DPI), Conti (data di
incasso vera con incassi parziali), Terra+Sentinella (verbale di rilievo,
programma di monitoraggio), Flotta (ordine di lavoro con manodopera, fermi
macchina).

## Prossimo passo atomico
Raccogliere i quattro cantieri rimasti con lo stesso metodo: verifica
indipendente delle affermazioni, non solo del fatto che la pagina si apra.
Poi la **descrizione della PR #322 va riscritta**: è ferma a 51 commit e
dichiara ancora «2 rotture preesistenti in run-kpi.mjs», che nel frattempo
sono state chiuse (179 test verdi).
