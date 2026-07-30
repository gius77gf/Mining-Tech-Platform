# Censimento feature incomplete — Deepwork core (index.html)

Data: 2026-07-20 · Fonte: analisi integrale del monolite (~8.270
righe) + docs/ e vault/. Obiettivo E1 della roadmap v3.1: capire cosa
è davvero incompleto, cosa è solo "spento" e cosa è fuorviante.

## Sintesi per il fondatore
Il core è PIÙ COMPLETO di quanto pensassimo: vista 3D della volata,
simulatore, ricostruzione 3D da foto e import MWD sono implementati
sul serio, non abbozzi. I problemi veri sono quattro:
1. due feature "spente" perché manca una configurazione (meteo, push);
2. una mezza-feature (i fori segnati sulla ricostruzione 3D non si
   salvano: il lavoro dell'utente va perso);
3. un nome fuorviante ("3D fotorealistico" è solo un visualizzatore
   di file già pronti, non crea nulla da foto);
4. i dati di esempio con nomi/IBAN dall'aspetto reale (già in agenda
   weekend — decisione del fondatore, vedi AUDIT_SICUREZZA).

## ⚠️ Riverificato il 30/07 — tre problemi su quattro sono chiusi

*Questo censimento è del 20 luglio e i numeri di riga non corrispondono più (il
core è passato da ~8.270 a 8.599 righe). Più importante: **elencava quattro
problemi e tre non ci sono più**. Un documento che dichiara guasto qualcosa che
funziona fa danno esattamente quando serve — chi lo legge prima di una
dimostrazione **evita di mostrare** una cosa che invece è a posto.*

*Riverificato aprendo il core, non a memoria:*

| Problema del 20/07 | Oggi | Come si controlla |
|---|---|---|
| Nome fuorviante: «3D fotorealistico» sembrava fotogrammetria | ✅ **chiuso** | La schermata si chiama «Visualizzatore 3D (Splat)» e scrive: *«Questa schermata **non crea** il modello: generalo con un'app di scansione… poi caricalo qui»* |
| I fori segnati sulla ricostruzione 3D non si salvavano | ✅ **chiuso** | `reconToVolata()`: porta i fori segnati sul modello dentro la volata aperta, come prima fila |
| Meteo: widget sempre «non disponibile» | ✅ **chiuso come difetto** | Senza proxy configurato il widget **si nasconde** invece di restare rotto (`fetchMeteo`). La funzione resta spenta finché non c'è il proxy: è un'altra cosa dall'essere rotta |
| Notifiche push inerti (`FCM_VAPID_KEY` vuota) | ⏳ **ancora spenta, ed è giusto** | La chiave nasce col progetto Firebase nuovo: è una voce di `DECISIONI_WEEKEND.md`, non un difetto |
| «Editor metodi v4.1» mai iniziato | ✅ **non è più una promessa** | La stringa non compare più né nel core né in nessun documento, tranne qui dentro |

**Quindi**: in una dimostrazione oggi si può mostrare il visualizzatore 3D e la
ricostruzione da foto senza girarci intorno. L'unica cosa davvero spenta sono le
notifiche push, e dipende da una decisione del fondatore.

**La tabella qui sotto resta com'era scritta il 20/07**, coi suoi numeri di riga:
serve a ricostruire la storia, non a decidere cosa mostrare oggi.

---

## Stato delle feature "note come incomplete" *(fotografia del 20/07)*

| Feature | Righe | Stato reale | Sforzo |
|---|---|---|---|
| Vista 3D volata | 3669–3801 | COMPLETA (three.js on-demand da CDN, degrada offline con messaggio) | — |
| Simulatore volata | 3968–4031 | COMPLETO (detriti sui ritardi, powder factor); solo dentro la vista 3D, escluso per gallerie | — |
| "3D fotorealistico" (splat) | 3803–3836 | SOLO VISUALIZZATORE di file .ply/.splat esistenti; niente fotogrammetria. Nome fuorviante | S (testo) / L (pipeline vera) |
| Ricostruzione 3D da foto | 3838–3966 | IMPLEMENTATA (depth AI + fallback), MA "Segna fori" non salva/esporta i fori marcati | M |
| Import MWD da CSV | 5534–5716 | COMPLETO (auto-detect Atlas Copco/Sandvik/Epiroc/generico; merge/replace/append) | — |
| "Editor metodi v4.1" | assente | MAI INIZIATO nel core (la stringa v4.1 è solo una label di refresh CSS). Decidere: costruire o togliere dalle promesse | L |

## Feature spente da configurazione vuota

| Feature | Righe | Causa | Rimedio |
|---|---|---|---|
| Meteo in home | 1176–1207 | `CLOUD_PROXY_URL` vuoto → widget sempre "Meteo non disponibile" | Deploy proxy (weekend/Firebase) o nascondere il widget finché non configurato |
| Notifiche push FCM | 142–224, 920 | `FCM_VAPID_KEY` vuota → flusso inerte (ben guardato, nessun crash) | Generare la chiave VAPID col progetto Firebase nuovo (weekend) |

## Igiene del codice
- `uffTab` (2650–2651): stub vuoto di retrocompatibilità, nessun uso
  attivo → rimovibile.
- Rete di sicurezza `stubs` (34–90): tutti i ~130 nomi hanno poi
  l'implementazione reale — nessun orfano. OK.
- Nessun TODO/FIXME residuo; nessuna chiamata a funzioni inesistenti;
  nessuna UI nascosta sospetta.
- Doppia versione three.js: 0.128 globale per la vista 3D (3676),
  0.160 ESM per lo splat (importmap righe 9–11). Isolate tra loro;
  allineare in futuro con cautela (la vista 3D è in produzione).

## Dati di default sensibili (valori NON riportati qui apposta)
- `DEFAULT_USERS` (278–284): 7 account seed con password deboli in
  chiaro (auto-migrate a hash al primo login, ma il seed resta in
  chiaro) e 3 con nomi di persona dall'aspetto reale.
- `DEFAULT_CLIENTI` (287–288): anagrafiche con P.IVA e un IBAN
  dall'aspetto reale.
- DECISIONE FONDATORE in agenda weekend (AUDIT punti 1-2 +
  MITIGAZIONE_PASSWORD preparata, non attivata): questo censimento
  NON tocca quei dati.
- `firebaseConfig.apiKey` in chiaro (110): normale per web app
  Firebase (chiave pubblica per design); la protezione vera sono le
  Security Rules (in agenda weekend).

## Piano interventi
FATTI SUBITO (E2, questo ciclo — sicuri e testabili):
1. Etichetta onesta per lo splat: "Visualizzatore 3D (splat)" + nota
   "richiede un file .ply/.splat già pronto".
2. Meteo: nascondere il widget quando `CLOUD_PROXY_URL` è vuoto
   (invece del permanente "non disponibile").
3. Rimozione dello stub morto `uffTab`.

RIMANDATI (con motivo):
- Bonifica DEFAULT_USERS/DEFAULT_CLIENTI → decisione fondatore
  (weekend, già in agenda).
- Meteo proxy + VAPID push → richiedono il progetto Firebase nuovo
  (weekend).
- [x] Salvataggio fori della ricostruzione 3D → FATTO (21/07):
  pulsante "📌 Invia alla volata" nella Ricostruzione 3D — i marker
  entrano nella volata aperta come prima fila (x dal modello, y=1 m,
  profondità/diametro/esplosivo dai default, nota di provenienza),
  con conferma, rinumerazione, ricalcolo totali, salvataggio e audit
  log — stesso pattern dell'import MWD. La quota frontale non è
  mappabile in pianta (documentato). Export CSV già disponibile.
- Allineamento versioni three.js → rischio regressione sulla vista 3D
  in produzione: da fare con verifica visiva dedicata.
- "Editor metodi v4.1" → decisione di prodotto del fondatore
  (costruire o depennare).
