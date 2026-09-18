# Ricerca continua — Deepwork ID

## Ricerca del 2026-09-03 — i ruoli in cava: legge, prassi e software (metà sul mondo)

_Fatta con WebSearch soltanto: nessuna pagina letta, tutto [di seconda mano]._

### Le figure di legge

Il D.Lgs. 624/1996 (norme per la sicurezza e salute nei lavori estrattivi) introduce due figure chiave [di seconda mano]:

**Direttore responsabile**: nominato dal titolare sulla base delle capacità professionali (art. 27 DPR 128/59 come modificato). Sottoscrive il DSS (Documento di Sicurezza e Salute) e attua quanto previsto nel DSS nella pianificazione lavorativa. Il titolare può assumere egli stesso i compiti.

**Sorvegliante**: figura introdotta dal D.Lgs. 624/96, riassume compiti di "capo servizio" e "preposto" dal DPR 128/59. Nel settore estrattivo coincide con il preposto. Dovrebbe essere unico per turno e per luogo di lavoro; coordina altri eventuali preposti. Funzionalmente autonomo sui compiti di prevenzione secondo D.Lgs. 81/2008.

**RSPP e Medico Competente**: designati dal datore di lavoro, funzionalmente autonomi e distinti [di seconda mano]. Il medico competente ha specifici titoli e requisiti (art. 38 D.Lgs. 81/2008).

### La prassi in una cava piccola/media

Nelle piccole/medie cave [di seconda mano]:
- **Titolare**: nomina direttore responsabile e sorvegliante, responsabile della compliance
- **Direttore responsabile**: firma DSS, pianifica attività, coordina con sorvegliante
- **Sorvegliante/Capo cava**: coordina il turno, supervisiona operatori, riceve ordini dal direttore
- **Operatori/Fochini**: eseguono estrazione, operano macchinari, seguono ordini del sorvegliante
- **Ufficio**: pesatore/amministrazione gestisce documenti, ordini di estrazione

### I ruoli nei software di settore

Nel software di quarry management [di seconda mano]:
- **Manager/Quarry Boss**: controllo giornaliero estrazione-processing, accesso overarching reports, fissa prezzi
- **Supervisor**: coordina team, monitora sicurezza ed efficienza, accesso a job progress e resources
- **Equipment Operator**: opera macchinari, accesso limitato al compito assegnato
- **Weighbridge Operator**: vede ordini giornalieri, non accede report finanziari
- **Contractor**: visibilità proprie consegne, NO cambio prezzi o backdating ticket

Piattaforme come Taro Software implementano accesso controllato per ruoli, con permessi granulari su documenti, dati produttivi, pricing.

### Il vocabolario italiano

Dalle normative e dalla prassi emergono questi nomi [di seconda mano]:
- **Direttore responsabile**: legge
- **Sorvegliante**: legge (D.Lgs. 624/96)
- **Preposto**: D.Lgs. 81/2008 (coordina prevenzione)
- **Capo cava / Capo squadra**: prassi locale (coordinamento operativo)
- **Fochino**: licenza per detonazione (norma)
- **Operatore**: generico (macchina, impianto)
- **RSPP**: responsabile servizio prevenzione protezione
- **Medico competente**: sorveglianza sanitaria

### Domande per chi ha il codice in mano (SOLO domande sul MECCANISMO)

1. **Come si modella la delega di funzioni** fra direttore responsabile e sorvegliante nel DSS? Chi decide quali ordini firma chi?
2. **Il sorvegliante firma documenti** (rilievi, ordini di estrazione, rapporti giornalieri) oppure solo il direttore?
3. **Nel flusso di ordini di estrazione**, chi lo scrive (ufficio), chi lo approva (direttore), chi lo riceve (sorvegliante)?
4. **La differenza fra capo cava (prassi) e sorvegliante (legge)**: sono la stessa figura con nomi diversi?
5. **Quali registri** deve tenere il direttore e quali il sorvegliante per le ispezioni ITESM/ARPA?

### Fonti

- [Punto Sicuro: Il lavoro in cava e miniera — i soggetti del sistema](https://www.puntosicuro.it/attivita-estrattive-minerali-C-17/il-lavoro-in-cava-in-miniera-i-soggetti-del-sistema-sicurezza-salute-AR-23128/)
- [D.Lgs. 624/1996 Norme Sicurezza](https://www.cedingegneria.it/norme-tecniche/sicurezza/sicurezza-e-salute-dei-lavoratori-nelle-industrie-estrattive/)
- [Legislazione Tecnica: Art. 20 Direttore responsabile e sorvegliante](https://legislazionetecnica.it/node/1365369/)
- [Kynection: Quarry Management Software — Production Dispatch Compliance](https://www.kynection.com.au/understanding-quarry-management-software-for-production-dispatch-and-compliance/)
- [Quarry Australia: Job Role Profiles](https://www.quarry.com.au/common/Uploaded%20files/Fact%20Sheets/Quarry%20Career%20Factsheets.pdf)
- [Taro Software: Quarrying Management](https://taro.solutions/taro-quarrying/)
- [SmartQHSE: HSE Software per Mining](https://www.smartqhse.com/hse-software/mining)
- [Art. 2 D.Lgs. 81/2008 Definizioni sicurezza](https://biblus.acca.it/art-2-dlgs-81-2008/)


### Il delta, fatto da chi ha il codice in mano (03/09, contro `82d2156d`)

_Fatto per meccanismo, aprendo regole, funzioni, SDK e prove — non cercando le parole della ricerca. Questo delta NON è nuovo: `docs/RICERCA_DEEPWORKID_202607.md` §1.3, R3 e §3.2 (verificato contro `c4a6c7e0`, 30/07) diceva già «tre soli ruoli, `appRoles` non implementato da nessuna parte» e proponeva la mappatura cava→software. Qui si rimisura al commit di oggi e si aggiunge ciò che nel frattempo è cambiato (la 10b) e ciò che le app fanno con le FIGURE senza farne RUOLI._

**(1) Come funzionano OGGI i ruoli.**
1. Un membro ha UN ruolo per organizzazione, `owner | admin | member`, scritto nel token dalle sole Cloud Functions (`functions/index.js:26-41` `leggiOrgsAttive` → `orgs[orgId] = role || "member"`; `:182-204` `updateMemberRole` coi guardrail «solo un owner tocca gli owner», «mai l'ultimo owner»; provati in `tests/run-fns.mjs:91-148`). Il client lo legge con `id.role()` (`shared/deepwork-id-client/index.js:185`) e lo USA in una sola pagina: `apps/deepwork-id/admin.html:144` (`isAdmin = ['owner','admin'].includes(id.role())`) per mostrare le tendine del cambio ruolo.
2. Che cosa può fare ognuno, secondo `firestore.rules`: **owner** modifica i metadati dell'org (`:62`); **owner/admin** creano/leggono/revocano inviti (`:51-53`) e correggono/cancellano un documento EMESSO (`:137-138`, elenco `documentoEmesso` `:128-131`: `conti/fatture`, `conti/note`, `scudo/documenti` — decisione 10b del 07/08); **member** legge tutto ciò che sta sotto `/apps/{appId}/**` (`:92`), crea ovunque (`:135`), corregge e cancella tutto ciò che non è emesso (`:137`). Prove: `tests/run.mjs:249-276` (8 sulla 10b), `:158-162` (metadati), `:190-211` (inviti).
3. **Verificato: dentro un'organizzazione ogni membro vede TUTTE le app.** La regola `:89-92` non guarda né `appId` né l'entitlement: `grep -n "roleIn(orgId) ==\|appId ==" firestore.rules` trova solo `:31-32` (definizioni) e `:138` (la 10b). L'entitlement è letto SOLO dal client (`index.js:206-219` `hasEntitlement`) per decidere cosa mostrare; `tests/sonda-permessi.mjs` lo misura con l'emulatore («org abbonata SOLO a Scudo, membro semplice: legge i fronti di Terra, scrive in Terra, legge una fattura di Conti, la modifica»). È esattamente la riga di CLAUDE.md «il confine fra APP non è una barriera di sicurezza».
4. Nessuna app (Campo, Scudo, Conti, Flotta, Terra, Sentinella, Genesi) legge il ruolo: `grep -rln "\.role()" apps/*/*.html shared index.html` → solo `admin.html`. Le app conoscono le FIGURE della cava come DATI dell'anagrafe, non come identità di chi è al telefono: Scudo `NOMINE_RUOLI` (`scudo-data.js:3538-3572`: sorvegliante, direttore responsabile, preposto, RSPP, medico competente, RLS, primo soccorso, antincendio, dirigente — con `organigrammaSicurezza` `:3614` che controlla nomina attiva + formazione), i permessi di lavoro con `rilasciatoDaId / riceventeId / sorveglianteId` (`:95`, `:5334-5341`: «un'autorizzazione che nessuno firma non autorizza nessuno»), Campo `RUOLI` degli operatori (`campo-data.js:417`: Caposquadra, Perforatore, Fochino, Autista…), la chiusura del turno con «chi consegna» a nome libero (`campo/index.html:3290`).
5. Il core (`index.html`) è la prassi di casa PRIMA dell'SDK e ha il modello più ricco: quattro ruoli di mestiere `admin | ufficio | fochino | operatore` (`:299-305`), una matrice `can(azione)` con 20 azioni (`:1442-1458`: `delCava` solo admin, `rappFochino` a fochino, `editRappOwn` all'operatore sul PROPRIO rapportino), un perimetro per CAVA per utente (`cave:[…]` `:299`, filtri `:1945`, `:2769` «Operatore: forza sempre solo i propri rapportini»), e un registro `auditLog` (14 chiamate). «Direttore» e «capocantiere» esistono solo come utenti demo con `ruolo:'admin'` (`:304-305`).

**(2) Figura del mondo | da noi | verdetto**

| figura | da noi | verdetto |
|---|---|---|
| titolare | `owner` (`rules:31`, `createOrganization` `functions:100-127` lo crea) | **esiste** |
| direttore responsabile | Scudo: nomina `direttore` in `NOMINE_RUOLI:3543` (persona nominata, obbligatoria, unica); core: utente demo `ruolo:'admin'` | **esiste in un altro modo** — è una NOMINA nell'anagrafe, non un ruolo di accesso |
| sorvegliante / capo cava | Scudo: nomina `sorvegliante` (`:3539`, `multiplo:true`) e `sorveglianteId` sul permesso (`:5340`); Campo: `RUOLI[0]="Caposquadra"` (etichetta dell'operatore) | **esiste in un altro modo** — dato, non permesso. Domanda 4 della ricerca: da noi sono DUE cose (nomina di legge in Scudo, etichetta di squadra in Campo), non collegate |
| fochino | core: ruolo di accesso `fochino` con `can('rappFochino')`; Campo: etichetta; Scudo: requisito `fochino` (`:3165`) | **esiste** nel core, **in un altro modo** nelle app |
| operatore | core: ruolo `operatore` col perimetro «solo i propri rapportini» (`:2769`); SDK: `member` | **esiste** nel core; nell'SDK è `member`, che può tutto tranne la 10b |
| pesatore / ufficio | core: ruolo `ufficio` (`can('ufficio')`, `:1456`); SDK: nessuna distinzione | **esiste** nel core, **non c'è** nell'SDK (vedi 3) |
| amministrazione | `admin` (membri, inviti, 10b) | **esiste** — ma «admin» è amministrazione dell'ACCOUNT, non dell'ufficio |
| RSPP / medico competente | Scudo: nomine `rspp`, `medico` (`:3551-3556`); consulente esterno su più cave = membership multipla (`ARCHITETTURA §4`, `run-sdk.mjs:177`) | **esiste in un altro modo** (nomina); l'accesso «una sola app, con scadenza» **non c'è** (vedi 3) |
| delega di firma (dom. 1-2) | Scudo: `rilasciatoDaId` obbligatorio sul permesso; Campo: nome di chi consegna | **esiste in un altro modo** — la firma è un NOME scelto fra le persone, non l'utente autenticato |
| ordine di estrazione (dom. 3) | Flotta: «ordine di lavoro» (`flotta-data.js:23`, manutenzione); Campo: piano del turno | **non c'è** un flusso scrive/approva/riceve con tre attori |
| registri per figura (dom. 5) | Scudo: `csvRegistroInfortuni`, `verbaleDiScadenza`, `verbaleDpi`, organigramma (`:1981,2380,3758,3614`) | **esiste** come documenti; **non c'è** «di chi è» il registro |

**(3) I «non c'è», col comando e l'uscita** (rilanciati contro `82d2156d`, salvati in scratch `inv/delta-id/noncè.txt`)
- Ruolo per app (`appRoles`) nel codice: `grep -rn "appRoles" --include=*.js --include=*.mjs --include=*.rules --include=*.html apps shared index.html | grep -v node_modules` → **1 riga, ed è un commento**: `firestore.rules:84 // le singole app potranno raffinare i permessi per ruolo (appRoles)`. Nell'architettura (`ARCHITETTURA.md:46,101`) è previsto; in regole, SDK e funzioni non esiste.
- Una regola che distingua per app o per ruolo dentro i dati: `grep -n "roleIn(orgId) ==\|appId ==\|isAdmin(orgId)" apps/deepwork-id/firestore.rules` → `31`, `32` (definizioni), `138` (solo la 10b). Nessun `match` per app.
- Le app che leggono il ruolo: `grep -rln "\.role()" apps/*/*.html shared index.html` → `apps/deepwork-id/admin.html` soltanto.
- Chi ha scritto un record (l'autore, che è il prerequisito di «l'operatore corregge solo il SUO rapportino»): `grep -c "user\.uid\|createdBy\|creatoDa\|autoreUid" apps/{campo,scudo,conti,flotta,terra,sentinella}/index.html apps/genesi/genesi.html` → **0 in tutte e sette** (Genesi lo scrive solo nel contrassegno di migrazione, `genesi-data.js:1958`). Il core lo ha: `userId` sui rapportini (`:2518`).
- Registro «chi ha fatto cosa» fuori dal core: `grep -rln "auditLog" apps shared index.html | grep -v node_modules` → `index.html` soltanto.
- Firma legata all'utente autenticato: `grep -rn -i "approvatoDa\|approvato da\|firmatoDa\|firmato da" apps/*/*-data.js apps/*/index.html | wc -l` → **0** (la firma è `rilasciatoDaId`, un lavoratore dell'anagrafe: forma diversa, non assenza — la voce sta qui solo per il legame con l'account).
- Perimetro per cava nelle app (il core ce l'ha, `cave:[…]`): `grep -rn "\.cave\b" apps/*/index.html apps/*/*-data.js | wc -l` → **0**.
- Membership con scadenza (il consulente esterno «con data di fine» di §3.2): `grep -n "validUntil\|expiresAt\|scadenza" apps/deepwork-id/functions/index.js` → `154`, `261`, tutte e due sull'INVITO (14 giorni); la membership non scade.
- Direttore responsabile nel core: `grep -n -i "direttore" index.html` → `305` (utente demo, `ruolo:'admin'`), `454` (una nota), `9730` (l'elenco credenziali demo). Non è un ruolo.

**Riassunto.** Deepwork ID ha ruoli *da software* (chi amministra l'account, chi può cancellare un documento emesso) e le app hanno le figure *da cava* come **dati dell'anagrafe** (nomine, etichette, chi firma un permesso): le due cose non si toccano, e il core — che aveva ruoli di mestiere, matrice `can`, autore sul record e perimetro per cava — è l'unico posto dove si toccavano. Ciò che manca è **prima una decisione di prodotto** (quali figure diventano ruoli di accesso, e se la nomina di Scudo debba «accendere» un permesso), **poi un campo** (l'autore sui record delle sei app, senza il quale nessuna regola «solo il proprio» è scrivibile), **poi le regole** per app; il costo della prima è una conversazione col fondatore, delle altre due è medio e già stimato «L» in `RICERCA_DEEPWORKID_202607.md` P8. La decisione è già aperta: `vault/ROADMAP_SETTIMANA.md:3543` **Q1** («ruoli reali dentro l'organizzazione — legata alla decisione 10b/10c», sezione E dei rimandati), con la 10b/10c chiuse il 07/08 (`docs/DECISIONI_WEEKEND.md:225-226`). Candidati, non «da fare»: (a) l'autore sul record in `shared/` (una riga in `dw-shell`, sei app); (b) il ponte nomina→ruolo in Scudo come sola LETTURA («questa persona è il sorvegliante nominato», già calcolabile con `organigrammaSicurezza`); (c) la membership con `validUntil` per il consulente; (d) un `match` per app che riusi `documentoEmesso` come forma (elenco corto, per nome, con la ragione).

## Ricerca del 2026-09-11 — secondo giro, trasversale: l'uscita dei dati — che cosa si aspetta chi compra, e quale collezione di ciascuna app oggi non ha un'uscita (il mondo)

⚠️ **Seconda mano, marcata**: fatta con `WebSearch` (che risponde), non con
`WebFetch` (che non legge il testo primario). Nessun numero di norma entra in
una schermata; quelli qui sotto servono a decidere il delta. Vive in questo
documento perché la domanda è di **tutte** le app insieme.

### Come va, fuori

- **La legge**: l'art. 20 del GDPR dà all'interessato il diritto di ricevere i
  dati che lo riguardano «in un formato strutturato, di uso comune e leggibile
  da dispositivo automatico» e di trasmetterli a un altro titolare «senza
  impedimenti», senza ingiustificato ritardo e comunque entro un mese; il CSV
  è citato come formato comune, e i dati vanno «corredati di metadati» che
  ne permettano la comprensione. Riguarda i dati **personali** (i lavoratori
  di Scudo, gli operatori di Campo, chi reclama in Sentinella), non le pesate
  o i rilievi. *[risultati di ricerca: protezionedatipersonali.it,
  cybersecurity360.it, studiolegalestefanelli.it, gdpr-text.com,
  privacy-regulation.eu]*
- **Che cosa chiede chi compra un gestionale in abbonamento** (la «strategia
  d'uscita»): esportazioni **complete** e non parziali, in formati non
  proprietari, **senza dover chiedere aiuto al fornitore** né pagare
  extra; **esportazioni programmate** per avere sempre una copia locale —
  un fornitore che non le offre «è un segnale d'allarme»; e la
  consapevolezza che molti fornitori **cancellano i dati entro pochi
  giorni** dalla fine dell'abbonamento. «Se i tuoi dati non possono uscire
  puliti, non controlli davvero i tuoi processi.» *[risultati di ricerca:
  manage-point.com, smartsaas.works, cascadeits.us, zellatech.com,
  fluxlabs.net, curreyadkins.com]*
- **Le guide italiane per le PMI** elencano fra i requisiti di un gestionale
  cloud i backup automatici, gli SLA, l'accesso da ovunque, la modularità —
  ma **nessuna delle pagine trovate** parla di che cosa succede ai dati alla
  fine del contratto: è un vuoto del mondo, non solo nostro. *[risultati di
  ricerca: danea.it, selcoerp.it, brentasoft.com, atlantisevo.com,
  catamacro.com, digitalici.com]*

### Fonti (risultati di ricerca, non lette per intero)

protezionedatipersonali.it · cybersecurity360.it · studiolegalestefanelli.it ·
gdpr-text.com · ricercagiuridica.com · privacy-regulation.eu ·
studioessepi.it · legalars.net · leggeinchiaro.it · manage-point.com ·
smartsaas.works · zellatech.com · fluxlabs.net · cascadeits.us ·
curreyadkins.com · calderacyber.com · danea.it · selcoerp.it ·
brentasoft.com · atlantisevo.com · catamacro.com · shsinformatica.it ·
digitalici.com.

### Domande per il delta (sul MECCANISMO, non sul nome)

1. Ogni collezione di ogni app ha una strada per uscire **così com'è** (non
   un prospetto, non un foglio: le righe)? Quali no?
2. Esiste un'uscita **di tutta l'app in una volta** — la copia che il cliente
   tiene per sé — e chi la fa?
3. I dati personali (lavoratori, operatori, chi reclama) escono in un
   formato strutturato?
4. Che cosa succede ai dati alla fine dell'abbonamento?

### Il delta, fatto da chi ha il codice in mano (11/09, verificato contro il commit `f33e5ab5`)

Il censimento è **per meccanismo**: le collezioni di ogni app sono quelle
dell'intestazione del suo modulo (`grep -oE '^//   [a-zA-Z]+/\{id\}'
apps/<app>/<app>-data.js`) più quelle che la pagina legge con `db.<nome>()`;
le uscite sono le funzioni `csv*`/`foglia*`/`prospetto*`/… del modulo, lette
**con i loro argomenti** (`grep -nE '^export function
(csv|foglia|testo|prospetto|rapporto|relazione|verbale|fascicolo|risposta|calendario)[A-Za-z0-9_]*\('`).
«Esce» vuol dire che una funzione riceve la collezione e scrive le sue righe;
un prospetto per periodo o un foglio di un singolo record **non** è un'uscita
della collezione.

- **Domanda 1 — A METÀ, e la metà che manca è grande.** Collezioni **senza**
  un'uscita delle righe:
  · **Campo** (12 collezioni): `operatori`, `presenze` e `durate`
    (`csvAppello` esce per giorno e turno, non l'archivio), `rapportini`
    (`csvStorico` è lo storico aggregato di 14 giorni), `obiettivi`,
    `checklist`, `briefing`, `chiusure`, `meteo` → **9 su 12**;
  · **Conti** (13, con `listini` e `note` letti dalla pagina): `ordini`
    (`csvProspettoPreventivi` è un prospetto), `chiusure`, `verbali`,
    `impostazioni` → **4 su 13**;
  · **Flotta** (11): `mezzi` e `manutenzioni` (solo dentro `csvSituazione`,
    un prospetto, e nel libretto per singolo mezzo), `disponibilita`,
    `rifornimenti` → **4 su 11**;
  · **Scudo** (15, con `appalti`, `appaltatori` e `oreAnno` letti dalla
    pagina): `cantieri`, `ispezioni` (foglio per singola), `mansioni`,
    `nomine`, `dpi` (verbale per persona), `analisi`, `permessi`, `appalti`,
    `appaltatori`, `oreAnno` → **10 su 15**;
  · **Sentinella** (7): `reclami`, `programma`, `registri` → **3 su 7**;
  · **Terra** (7): `piano`, `autorizzazioni`, `scadenze` (`calendarioTerra` è
    un ICS), `lotti` (relazione per singolo) → **4 su 7**;
  · **Genesi**: le cinque collezioni di `GENESI_COLLEZIONI` escono una
    volata alla volta (`salvaVolata`, file `.volata.json`) e con
    `csvRiconciliazione`; niente esce tutto insieme.
  Totale: **34 collezioni su 65** non hanno un'uscita delle righe. Non è una
  svista di un'app: è che ogni uscita è nata da una **domanda del mestiere**
  (il registro delle vendite, il libretto del mezzo) e nessuna dalla domanda
  «e se me ne vado?».
- **Domanda 2 — MANCA in tutte le app, ed è il delta.** `grep -ciE
  'esporta tutto|export completo|backup|portabilit'` su `index.html`, le
  pagine di Deepwork ID e l'SDK → 0 dappertutto; nell'SDK non c'è una
  lettura di tutte le collezioni di un'app (`grep -n 'COLLEZIONI'
  shared/deepwork-id-client/index.js` → 0). L'unico elenco di collezioni
  dichiarato come tale è `GENESI_COLLEZIONI` in `genesi-data.js`. **Mancanza
  confermata, aperta**: un'uscita **di tutta l'app in un file solo**, JSON
  (strutturato, di uso comune, leggibile da macchina — e senza inventare un
  formato: le righe come stanno nell'archivio, con `app`, `organizzazione`,
  `quando`, `commit` e l'elenco delle collezioni), letta con lo stesso SDK
  che sigilla l'organizzazione, e un bottone «Scarica tutto» per app. Le
  collezioni di ogni app vanno **dichiarate** una volta (come Genesi) e la
  prova pretende che l'elenco copra ciò che la pagina legge con `db.<nome>()`
  — un elenco a mano che non si confronta col codice invecchia da solo. Il
  rientro (importare quel file) è una decisione a parte.
  ✅ **FATTO lo stesso giorno, unità 99**: `esportaTutto`,
  `nomeFileEsportaTutto`, `montaScaricaTutto` in `dw-shell.js`,
  `<APP>_COLLEZIONI` in sei moduli, bottone in sei Quadri. Prova: `grep -c
  '^export function esportaTutto' shared/deepwork-id-client/dw-shell.js` → 1;
  `grep -l '_COLLEZIONI = Object.freeze' apps/*/*-data.js | wc -l` → 7 (le
  sei più Genesi, che l'aveva già).
- **Domanda 3 — C'È, per chi è già uscito.** Lavoratori e scadenze di Scudo
  (`csvPersonaleScadenze`), clienti di Conti (`csvClienti`), ricettori di
  Sentinella (`csvRicettori`) escono in CSV; gli **operatori** di Campo e i
  **reclami** di Sentinella (con «chi ha reclamato») no — sono nella domanda
  1, e sono dati personali: la richiesta dell'art. 20 su di loro oggi si
  soddisfe a mano.
- **Domanda 4 — DECISIONE DEL FONDATORE, dichiarata.** Che cosa succede ai
  dati alla fine dell'abbonamento (quanto restano, chi li cancella, con che
  preavviso) è una clausola commerciale e una regola di Deepwork ID: non c'è
  scritta da nessuna parte, e il mondo dice che chi compra la chiede. Non
  entra in roadmap come lavoro: entra fra le decisioni.

**Riassunto** — 1 mancanza **confermata e aperta** (l'uscita di tutta l'app in
un file, con l'elenco dichiarato delle collezioni), 34 collezioni su 65 senza
un'uscita delle righe (misurate, e sono la ragione della prima), 1
**decisione** per il fondatore (i dati alla fine dell'abbonamento), 1 a metà
(i dati personali escono per tre app su cinque che ne tengono).

## Ricerca del 2026-09-15 — i ruoli DENTRO L'ORGANIZZAZIONE: come li disegnano i migliori prodotti multi-tenant SaaS (Auth0, WorkOS, Okta...), non i migliori software di cava

**Che cosa esiste già, letto prima di proporre.** La ricerca del 2026-09-03
(qui sopra) ha già coperto la domanda dei ruoli da **due** dei tre lati
possibili: le figure di legge/prassi della cava (direttore responsabile,
sorvegliante, fochino...) e il censimento «per meccanismo» di come Deepwork ID
li implementa oggi (§1-3 di quella ricerca: 3 ruoli `owner|admin|member`,
`appRoles` mai implementato — un commento solo, `firestore.rules:84` — e la
decisione aperta `Q1` in `vault/ROADMAP_SETTIMANA.md:6210`). Questa ricerca
copre il **terzo lato**, quello che quella del 03/09 non aveva: non «come lo
chiama la cava» ma **«come lo strutturano i concorrenti veri di Deepwork ID»**
— identity-as-a-service e billing SaaS multi-tenant, non altri software
minerari. Rimisurato il codice: nessun commit ha toccato `firestore.rules`,
`admin.html`, `functions/index.js` o `ARCHITETTURA.md` fra il 03/09 e oggi
(`git log --oneline --since=2026-09-03 -- apps/deepwork-id/firestore.rules
apps/deepwork-id/admin.html apps/deepwork-id/functions/index.js
apps/deepwork-id/ARCHITETTURA.md` → un solo commit, `122197a2`, e tocca solo
i banchi di prova delle pagine da connessi, non i ruoli) — quindi il §1-3 del
03/09 è ancora la fotografia vera, verificato di nuovo qui sotto sui punti che
contano per questa domanda.

### Come va, fuori — SOLO WebSearch, marcato [di seconda mano]

- **Ogni decisione di autorizzazione dev'essere «tenant-aware» a due livelli,
  non uno**: non «questo utente è admin?» ma «questo utente è admin **in
  questa organizzazione**?». Il modello che regge è un'unità logica costante:
  *Attore (utente + organizzazione) → Azione → Risorsa (delimitata
  all'organizzazione)*. [di seconda mano — permit.io, WorkOS]
  **Deepwork ID questo pezzo ce l'ha**: il claim è `orgs:{orgId:role}` — un
  ruolo diverso per organizzazione, non uno globale — verificato di nuovo
  (`firestore.rules:22-27`, `roleIn(orgId)`). Non è la parte che manca.
- **Le imprese vogliono ruoli SU MISURA, non il set fisso.** Un set fisso
  (owner/admin/member) va bene per una piccola azienda; le aziende più grandi
  chiedono ruoli **per compito**, con nomi come «Billing Admin» o «Compliance
  Auditor» — non varianti dello stesso "admin", ruoli **diversi**, ognuno con
  un perimetro proprio. [di seconda mano — workos.com/blog/how-to-design-
  multi-tenant-rbac-saas]
- **La regola più citata, e la più operativa**: *«i ruoli delegati vanno
  disegnati intorno ai COMPITI, non all'AUTORITÀ»* — gestire gli utenti non
  implica automaticamente vedere tutti i loro dati, aiutare col supporto non
  richiede poter cambiare le impostazioni di sicurezza. Se questi poteri non
  sono separati con chiarezza, chi ha un compito ristretto finisce per poter
  vedere o toccare cose che non gli competono. [di seconda mano — appomni.com,
  «User Roles and Least Privilege in SaaS Security»]
- **Il Billing Admin è il caso da manuale della separazione**: dovrebbe poter
  gestire SOLO l'abbonamento, senza toccare i dati degli utenti — e i sistemi
  di governance raccomandano di valutare un ruolo su misura piuttosto che dare
  pieni poteri d'account solo per far gestire la fattura a qualcuno. [di
  seconda mano — appomni.com, cloudnuro.ai]
- **Il fallimento tipico di RBAC in SaaS non è nello schema, è nelle regole
  mai scritte**: *«RBAC raramente si rompe perché lo schema è sbagliato: si
  rompe perché le regole intorno allo schema non sono mai state decise, e la
  gente le inventa ad-hoc nel tempo. Prima di spedire RBAC multi-tenant vale
  la pena scrivere le decisioni di policy come si scriverebbe un contratto
  API.»* [di seconda mano — workos.com/blog/how-to-design-multi-tenant-rbac-saas]
- **Oltre RBAC, per le gerarchie complesse**: Auth0 FGA (costruito su OpenFGA/
  Zanzibar, lo stesso modello usato internamente da Google) usa il
  Relationship-Based Access Control per modellare permessi **per singola
  risorsa** («Manager di questo Reparto», «Editor di questo Documento»)
  restando compatibile col vocabolario RBAC (ruoli, permessi, assegnazioni) ma
  aggiungendone lo scoping gerarchico. È il livello sopra i tre ruoli piatti
  di oggi, non il prossimo passo immediato. [di seconda mano — auth0.com/fine-
  grained-authorization, docs.fga.dev]
- **Anche il fornitore dei prompt di questa stessa sessione lo fa**: i piani
  Enterprise di Anthropic offrono «ruoli personalizzati» oltre a quelli fissi
  — cioè il pattern «ruoli su misura per compito» non è solo dei tre
  concorrenti cercati, è lo standard del settore. [di seconda mano —
  support.claude.com/manage-custom-roles-on-enterprise-plans]

### Il delta, fatto da chi ha il codice in mano (15/09, verificato contro `9b91fb93`)

**(1) Il ruolo `admin` di oggi è un unico contenitore che somma DUE compiti
non correlati, e i migliori prodotti li separano.** Letto `firestore.rules`
per intero (`sed -n '55,145p'`): la stessa funzione `isAdmin(orgId)` decide
**sia** chi invita/rimuove membri (`invites/{inviteId}` righe 51-53) **sia**
chi corregge o cancella un documento già EMESSO in **qualunque** app —
comprese le carte di sicurezza di Scudo (`documentoEmesso`, righe 128-141:
`conti/fatture`, `conti/note`, `scudo/documenti`). Non c'è un modo di dare a
qualcuno «puoi gestire gli inviti» senza dargli anche «puoi cancellare un
verbale DPI o un documento d'ispezione di Scudo». È esattamente il pattern
descritto sopra — *«gestire gli utenti non implica automaticamente vedere
tutti i loro dati»* — capovolto: qui gestire gli utenti implica **anche**
poter cancellare i documenti di sicurezza di un'app che quell'admin magari
non usa mai. Ed è la stessa domanda che CLAUDE.md lascia aperta sul confine
APP (*«non è un problema di `appId`, è la decisione sui ruoli»*): qui si vede
il caso concreto in cui la mancanza morde già, non in teoria.
- **Verificato**: `grep -n "isAdmin(" apps/deepwork-id/firestore.rules` →
  **5 righe**: `32` (la definizione: `owner` o `admin`, senza distinzione),
  `51-53` (le tre operazioni sugli inviti — create/read/update-delete), `138`
  (`documentoEmesso`, la cancellazione dei documenti emessi di Scudo e Conti).
  Stesso predicato per due compiti scoperti — inviti e cancellazione
  documenti — zero distinzione per app o per compito.
- **schermata**: nessuna oggi (`admin.html` mostra solo `owner|admin|member`
  nella tendina, riga 180 `isAdmin = ['owner','admin'].includes(id.role())`) ·
  **che cosa non va**: un secondo `admin` nominato per aiutare con gli inviti
  di un'app (es. Campo) riceve anche, senza poterlo evitare, il potere di
  cancellare i documenti emessi di Scudo (sicurezza) e Conti (fiscali) · **come
  si vede**: si nomina un admin, si apre Scudo con quell'account, si cancella
  un documento del registro — nessuna regola lo impedisce se non è owner ·
  **quanto costa**: M — richiede prima la decisione di prodotto su QUALI
  compiti diventano permessi separati (proposta concreta, sul modello del
  mondo: «gestione membri» e «cancellazione documenti emessi» come DUE
  booleani distinti nel documento membership, non un solo ruolo che li somma),
  poi la riscrittura di `isAdmin` in due funzioni · **come si misura**: lo
  stesso grep sopra, e la controprova negativa già esistente in `run.mjs:249-
  276` (le 8 prove della 10b) andrebbe raddoppiata per provare che un admin
  «solo inviti» **non** possa cancellare un documento emesso — oggi quella
  prova non può nemmeno essere scritta perché il ruolo non esiste.
  **Non è un "non c'è" nuovo sull'esistenza di `appRoles`** (quello lo dice
  già il 03/09): è la prova che la mancanza ha un **costo concreto e già
  presente**, non solo teorico — un secondo admin nominato oggi stesso eredita
  un potere che nessuno gli ha chiesto di dargli.

**(2) Non esiste, e non può esistere con il modello a 3 ruoli, un «Billing
Admin».** `owner` è oggi l'unico che tocca i metadati dell'organizzazione
(`isOwner(orgId)`, riga 62) e, secondo `ARCHITETTURA.md:98` (§6), è anche
l'unico designato per «fatturazione, gestione membri, tutto» — un solo ruolo
per tre compiti che il mondo separa.
- **Verificato**: `grep -rn -i "billing\|fatturazione" apps/deepwork-id/
  *.rules apps/deepwork-id/*.html apps/deepwork-id/functions/*.js
  shared/deepwork-id-client/*.js` → **0 righe** in tutti i file — non è
  implementato, e nemmeno nominato come concetto separato da `owner`. La
  collezione `entitlements/{appId}` (l'abbonamento) è scritta solo dal
  backend (`allow write: if false`, riga 80) quindi oggi il tema non morde
  ancora — ma quando arriverà Stripe (raccomandato in `ARCHITETTURA.md:135-
  137`, non implementato: nessuna spesa prima della commercializzazione, per
  la regola SOLDI di CLAUDE.md) il modello a 3 ruoli non ha un posto dove
  mettere «chi gestisce SOLO l'abbonamento» senza dargli anche la gestione dei
  membri e dei metadati dell'org.
- **schermata**: nessuna (la fatturazione non è ancora costruita) · **che
  cosa non va**: quando arriverà, andrà o tutta sull'`owner` (un solo collo di
  bottiglia per cava, che il mondo sconsiglia per il rischio di un singolo
  account compromesso) o dentro `admin` (che eredita anche il punto 1) ·
  **come si vede**: non ancora — è una scelta di design da prendere PRIMA di
  scrivere l'integrazione Stripe, non dopo, perché cambiare la forma del
  ruolo quando ci sono già organizzazioni paganti è più caro · **quanto
  costa**: S da dichiarare ora (nessun campo Firestore da toccare finché la
  fatturazione non esiste), M quando si implementerà davvero · **come si
  misura**: lo stesso grep sopra, da rilanciare quando si apre il cantiere
  Stripe — se risponde ancora 0, la decisione va presa prima del codice.

**(3) Il pattern per-risorsa (non solo per-organizzazione) che il mondo
raccomanda per le gerarchie complesse (Auth0 FGA / ReBAC: «editor di QUESTO
documento», non «editor dell'organizzazione») non ha equivalente in Deepwork
ID nemmeno nella forma più semplice — per APP.** Questo **non è un "non c'è"
nuovo**: è la stessa mancanza di `appRoles` già confermata il 03/09
(`grep -rn "appRoles" ... → 1 riga, ed è un commento`, rilanciato qui e
confermato identico), letta ora con il nome che le dà il mondo — «org-scoped
role» contro «per-resource role» (WorkOS, Clerk Organizations) — invece che
con il nome della cava. Non aggiunge una riga alla roadmap: aggiunge la
conferma che la forma corretta del passo successivo, quando si deciderà di
farlo, è la stessa che i concorrenti veri (non i software di cava) hanno già
scelto: un ruolo per organizzazione **e** un ruolo (o permesso) più fine per
singola app/risorsa sopra di esso — non un ruolo unico più largo.

**Che cosa NON è un "non c'è" qui.** Il modello di isolamento fra
organizzazioni (path-based, claim `orgs`) è esattamente la struttura che il
mondo raccomanda per il multi-tenant («ogni edge del grafo di autorizzazione
porta lo scope del tenant») — verificato di nuovo, non riproposto. E la
regola generale del mondo — *«le regole di RBAC vanno scritte come un
contratto PRIMA di scrivere il codice»* — è esattamente la forma che
CLAUDE.md già chiede per la decisione `Q1` (*«una conversazione col
fondatore», Riassunto del 03/09): non è una funzione mancante, è una
conferma che il metodo già scelto (decidere prima, poi `appRoles`, poi le
regole) è quello giusto secondo il mondo, non solo secondo questa casa.

### Fonti (WebSearch, non lette per intero — [di seconda mano])

- [WorkOS: How to design an RBAC model for multi-tenant SaaS](https://workos.com/blog/how-to-design-multi-tenant-rbac-saas)
- [Permit.io: Best Practices for Multi-Tenant Authorization](https://www.permit.io/blog/best-practices-for-multi-tenant-authorization)
- [Auth0: How to Choose the Right Authorization Model for Your Multi-Tenant SaaS Application](https://auth0.com/blog/how-to-choose-the-right-authorization-model-for-your-multi-tenant-saas-application/)
- [Auth0: Fine-Grained Authorization (FGA)](https://auth0.com/fine-grained-authorization)
- [Auth0 FGA docs: Modeling Roles and Permissions](https://docs.fga.dev/modeling/basics/roles-and-permissions)
- [AppOmni: User Roles and Least Privilege in SaaS Security](https://appomni.com/learn/saas-security-fundamentals/user-roles-and-least-privilege-in-saas-apps/)
- [CloudNuro: Managing Admin Roles in SaaS, Reducing Super Admin Risk](https://www.cloudnuro.ai/blog/saas-admin-governance)
- [Clerk Docs: B2B/B2C Roles and Permissions with Clerk Organizations](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions)
- [Descope: Top 7 RBAC Providers for B2B SaaS Apps](https://www.descope.com/blog/post/rbac-providers-b2b-saas)
- [LoginRadius: Access Control SaaS Guide for B2B & Multi-Tenant Platforms](https://www.loginradius.com/blog/engineering/rbac-saas-multi-tenant-b2b-platforms)
- [Anthropic Help Center: Manage custom roles on Enterprise plans](https://support.claude.com/en/articles/13930452-manage-custom-roles-on-enterprise-plans)

**Riassunto** — 0 mancanze NUOVE sull'esistenza di `appRoles` (già confermata
il 03/09, rilanciata identica: `firestore.rules:84`, un commento). 1
mancanza **confermata con costo concreto**: `isAdmin` somma «gestione
membri» e «cancellazione documenti emessi di qualunque app» in un solo
predicato (5 righe in `firestore.rules`: la definizione, 3 sugli inviti,
1 su `documentoEmesso`), pattern che il mondo chiama
«ruoli disegnati per autorità invece che per compito». 1 mancanza
**dichiarata in anticipo** (nessun Billing Admin possibile col modello a 3
ruoli — non urgente, perché la fatturazione non esiste ancora, ma da
decidere PRIMA di costruirla). 1 conferma che il modello di isolamento fra
organizzazioni già scelto è quello che il mondo raccomanda. Tutto verificato
contro il commit `9b91fb93`.

## Ricerca del 2026-09-17 — quando un membro viene rimosso o declassato, per quanto resta valido il suo accesso? Il momento della REVOCA, non quello dell'assegnazione

**Che cosa esiste già, letto prima di proporre.** Le tre ricerche precedenti
(qui sopra) coprono chi assegna un ruolo e che cosa quel ruolo permette
(03/09, 15/09) e come i dati escono (11/09). Nessuna delle tre guarda il
verso opposto: che cosa succede al token **già in mano** a un utente quando
gli si TOGLIE l'accesso — la domanda del deprovisioning, non
dell'onboarding. `vault/ROADMAP_SETTIMANA.md` e i checkpoint più recenti
(`node apps/deepwork-id/tests/date-checkpoint.mjs` per trovarli, non il
nome) non nominano token, refresh, revoca o sessione: è un angolo non
ancora guardato.

### Come va, fuori — SOLO WebSearch, marcato [di seconda mano]

- **Il problema è strutturale ai custom claims, non un bug**: «i custom
  claims sono stateless: revocarli con `setCustomUserClaims()` non
  invalida immediatamente il token già emesso. Gli ID token restano validi
  fino alla scadenza (di norma 1 ora) e non si possono revocare
  singolarmente.» La soluzione che la stessa documentazione ufficiale
  raccomanda è `admin.auth().revokeRefreshTokens(uid)`, che forza un nuovo
  token — coi claim aggiornati — alla richiesta successiva; introduce
  comunque un ritardo, e se serve l'immediatezza vera (es. un utente
  bannato) si raccomandano i session cookie con controllo di revoca, o un
  flag di revoca controllato lato database. [di seconda mano — Firebase
  docs "Manage User Sessions"; groups.google.com/firebase-talk; expertbeacon.com]
- **I concorrenti diretti di Deepwork ID lo trattano come un requisito di
  prodotto, non un dettaglio implementativo**: «disattivare una membership
  d'organizzazione in WorkOS ne imposta lo stato a inactive **e revoca
  tutte le sessioni attive**»; «Clerk e Stytch revocano le sessioni
  immediatamente al deprovisioning»; SCIM (lo standard con cui le imprese
  sincronizzano gli account) esiste apposta perché «continua a sincronizzare
  gli account e revoca l'accesso alla rimozione — è un controllo critico di
  deprovisioning e un requisito SOC 2». [di seconda mano — workos.com/docs
  (Users and Organizations), clerk.com/articles (SCIM 2.0 explained;
  Federated identity for enterprise SaaS)]
- **La lettura di fondo**: il mondo tratta «assegnare un permesso» e
  «toglierlo» come due momenti con garanzie diverse — assegnare può
  aspettare il refresh naturale, togliere no, perché nella finestra in
  mezzo l'ex-membro ha ancora in tasca un lasciapassare valido. Per una
  piattaforma che isola aziende **concorrenti fra loro** (il requisito
  fondante di `ARCHITETTURA.md §1`) e i cui dati più sensibili sono
  documenti di sicurezza e fiscali, quella finestra è esattamente il rischio
  che l'isolamento esiste per chiudere.

### Il delta, fatto da chi ha il codice in mano (17/09, verificato contro `8c0cf23a`)

**(1) `removeMember` e `updateMemberRole` riscrivono i claim, ma non
revocano mai il refresh token — la finestra di accesso residuo è REALE,
non teorica, ed è fino a un'ora.**
- **Verificato**: `grep -n "rebuildClaims\|setCustomUserClaims\|revokeRefreshTokens" apps/deepwork-id/functions/index.js` →
  `rebuildClaims` chiamato da `updateMemberRole` (riga 199) e da
  `removeMember` (riga 219), che a sua volta chiama `scriviClaims` →
  `admin.auth().setCustomUserClaims(uid, { orgs })` (riga 44). **Zero**
  occorrenze di `revokeRefreshTokens` in tutto `apps/deepwork-id`
  (esclusi i `node_modules` dell'SDK admin, dove la funzione esiste ma non
  è mai chiamata dal nostro codice): `grep -rn "revokeRefreshTokens"
  apps/deepwork-id | grep -v node_modules` → **nessuna riga**.
- `setCustomUserClaims` cambia i claim che verranno scritti nel **prossimo**
  token; non tocca il refresh token né gli ID token già emessi. Un membro
  rimosso da Scudo (o declassato da `admin` a `member`) che ha aperto la
  pagina un minuto prima **continua a leggere e scrivere** con le regole
  del ruolo vecchio finché il suo token non scade da solo — fino a un'ora,
  secondo la stessa documentazione citata sopra — perché
  `firestore.rules` non legge altro che `request.auth.token.orgs[orgId]`:
  `grep -n "auth_time\|token\.iat\|revokedAt\|tokensValidAfter"
  apps/deepwork-id/firestore.rules` → **nessuna riga**: non c'è nessun
  controllo di freschezza del token, solo il claim.
- **Nessuna prova lo copre**: `roleOf` in `run-fns.mjs:72` legge il
  documento Firestore della membership con l'SDK admin
  (`adb.doc('organizations/orgA/members/'+uid).get()`), non un token
  dell'utente rimosso. Il test «un ADMIN rimuove un member» (`run-fns.mjs:148-151`)
  verifica che la membership sia sparita, **non** che l'accesso lo sia:
  oggi non esiste un modo di scrivere quella prova, perché non c'è codice
  che la farebbe passare.
- **schermata**: nessuna (è un comportamento del backend, non visibile
  nell'interfaccia) · **che cosa non va**: un membro rimosso da
  un'organizzazione — o da un ruolo che gli dava accesso a un documento di
  sicurezza — mantiene un token valido con i vecchi permessi per un tempo
  che può arrivare a un'ora, esattamente la finestra che WorkOS e Clerk
  chiudono di proposito alla rimozione · **come si vede**: si logga un
  membro, gli si dà un token (in emulatore: `id.currentUser.getIdToken()`
  prima della rimozione), lo si rimuove con `removeMember`, e si prova a
  leggere/scrivere su Firestore **con quel token vecchio** senza chiamare
  `getIdToken(true)`: le regole lo accettano ancora, perché il claim nel
  JWT non è cambiato — solo quello nel database Auth lo è · **quanto
  costa**: S — una riga in `removeMember` e in `updateMemberRole` (quando
  il ruolo scende, non quando sale) prima del `return`:
  `await admin.auth().revokeRefreshTokens(uid)`; il client, al prossimo
  giro (o su un banner "sessione scaduta" se si vuole l'immediatezza vera
  come consigliato per i casi critici), rifà login. Nessuna migrazione
  dati, nessun campo nuovo · **come si misura**: la prova che oggi non
  esiste — token letto PRIMA della rimozione, riletto (o riusato) DOPO,
  contro una regola che nega — passata da rossa a verde; e la controprova
  che, tolta la riga, torna rossa. `grep -c "revokeRefreshTokens"
  apps/deepwork-id/functions/index.js` deve salire da 0.

**(2) Lo stato `disabled` è documentato in `ARCHITETTURA.md` e ha
un'etichetta pronta in `admin.html`, ma nessuna funzione lo scrive: oggi
l'unica «rimozione» possibile è la cancellazione definitiva del
documento.** Non è la stessa mancanza del punto 1 (quella è sul TOKEN,
questa è sullo STATO in Firestore), ma è la stessa famiglia — il
deprovisioning è pensato a metà.
- **Verificato**: `ARCHITETTURA.md:39` dichiara
  `status: active | invited | disabled` nello schema membership;
  `admin.html:130` ha già `STATO = { active: 'Attivo', invited: 'Invitato',
  disabled: 'Disattivato' }`. Ma `grep -n "status:\s*['\"]"
  apps/deepwork-id/functions/index.js` scrive solo `active` (righe 114,
  121, 280), `pending` (151), `revoked` (235), `expired` (262), `accepted`
  (270, 284): **mai** `disabled`. `grep -n "^exports\."
  apps/deepwork-id/functions/index.js` → sette funzioni, nessuna
  `disableMember`; l'unica via di rimozione è `removeMember`, che fa
  `memRef.delete()` (riga 218) — cancellazione, non sospensione. La sola
  occorrenza di `disabled` fuori da `admin.html` è nel finto SDK di test
  (`tests/browser/finto-id.mjs:175`, un dato d'esempio), che quindi non
  prova nessun percorso di prodotto.
- **schermata**: `admin.html`, riquadro membri — la tendina/etichetta di
  stato sa già disegnare "Disattivato", ma nessun bottone lo produce ·
  **che cosa non va**: sospendere temporaneamente un consulente esterno
  (RSPP di più cave, §3.2/§4 di `ARCHITETTURA.md`) o un membro in ferie
  senza perdere lo storico di chi ha fatto cosa (`invitedBy`, `joinedAt`)
  oggi non si può: si può solo cancellarlo del tutto e re-invitarlo da
  zero, perdendo la continuità del record · **come si vede**: si apre
  `admin.html` con un membro attivo, non c'è nessun'azione fra «cambia
  ruolo» e «rimuovi» · **quanto costa**: S — una funzione `setMemberStatus`
  gemella di `updateMemberRole` (stessi guardrail: non l'ultimo owner, solo
  owner tocca owner), che scrive `status:'disabled'` e chiama la stessa
  revoca del punto 1; le regole già usano `status` solo per il conteggio
  degli owner attivi (`countActiveOwners`), quindi va esteso *lì* perché un
  admin disattivato non conti più come owner attivo · **come si misura**:
  `grep -c "disableMember\|setMemberStatus" apps/deepwork-id/functions/index.js`
  deve salire da 0; una prova che disattiva un membro e verifica che
  `memberOf(orgId)` (o l'equivalente) risponda `false` mentre il documento
  resta.

**Che cosa NON è un "non c'è" qui.** L'assegnazione di un ruolo forza già
il refresh dal lato di chi la esegue: `shared/deepwork-id-client/index.js:241`
e `:303` chiamano `getIdToken(true)` dopo un cambio di ruolo o una
revoca d'invito — ma è l'attore che aggiorna **il proprio** token, non
quello della persona toccata dall'operazione. Il meccanismo di refresh
forzato esiste già in casa; manca solo dal lato di chi lo subisce.

### Fonti (WebSearch, non lette per intero — [di seconda mano])

- [Firebase: Manage User Sessions](https://firebase.google.com/docs/auth/admin/manage-sessions)
- [Firebase talk (Google Groups): Admin API needed for user management and token revocation](https://groups.google.com/g/firebase-talk/c/hPNd5-RNgBs)
- [ExpertBeacon: Mastering Firebase Auth Custom Claims](https://expertbeacon.com/mastering-firebase-auth-custom-claims-the-ultimate-guide-to-granular-access-control/)
- [WorkOS Docs: Users and Organizations – AuthKit](https://workos.com/docs/user-management/users-organizations)
- [Clerk: SCIM 2.0 explained — a practical guide for SaaS auth](https://clerk.com/articles/scim-2-0-explained-a-practical-guide-for-saas-auth)
- [Clerk: Federated identity for enterprise SaaS: SAML, OIDC, and SCIM](https://clerk.com/articles/federated-identity-for-enterprise-saas-saml-oidc-and-scim)

**Riassunto** — 2 mancanze **confermate**, stessa famiglia (il
deprovisioning, non il provisioning): (1) né `removeMember` né
`updateMemberRole` chiamano `revokeRefreshTokens` — un membro
rimosso/declassato mantiene un token valido con i permessi vecchi fino a
un'ora, senza nessuna prova che lo copra (`grep -rn "revokeRefreshTokens"
apps/deepwork-id | grep -v node_modules` → 0 righe); (2) lo stato
`disabled` è nello schema dichiarato e nell'etichetta dell'interfaccia ma
nessuna funzione lo scrive — l'unico deprovisioning possibile oggi è la
cancellazione definitiva (`grep -n "^exports\." apps/deepwork-id/functions/index.js`
→ 7 funzioni, nessuna `disableMember`/`setMemberStatus`). Entrambe costo
S, nessuna richiede una decisione di prodotto prima (a differenza delle
mancanze del 15/09): sono comportamento mancante su un meccanismo già
scelto. Tutto verificato contro il commit `8c0cf23a`.

## Ricerca del 2026-09-18 — inviti duplicati e riscatto silenzioso: che cosa succede quando la STESSA email viene invitata due volte, o accetta senza scegliere

**Che cosa esiste già, letto prima di proporre.** Le quattro ricerche
precedenti (qui sopra) coprono i ruoli e chi li assegna (03/09, 15/09),
l'uscita dei dati (11/09) e la revoca dell'accesso già dato (17/09, token e
stato `disabled`). Nessuna delle quattro guarda l'**invito** come oggetto a
sé: `ARCHITETTURA.md:59` lo dichiara (`invites/{inviteId}`, `expiresAt`),
`functions/index.js` lo implementa (`inviteMember`, `revokeInvite`,
`acceptInvites`, verificati riga per riga il 03/09 e il 17/09 per altri
scopi), e `admin.html` ha già la lista dei pendenti con scadenza «scaduto
il/scade tra» e il bottone Revoca (righe 145-215, non nuovo). Quello che
NESSUNA ricerca ha ancora guardato è che cosa succede a) invitando **due
volte la stessa email** e b) quando l'invitato **riscatta**. `git log
--oneline --since=2026-09-17 -- apps/deepwork-id/functions/index.js
apps/deepwork-id/admin.html shared/deepwork-id-client/index.js` → un solo
commit da ieri e non tocca questi tre file, quindi il codice letto il 17/09
è ancora la fotografia vera.

### Come va, fuori — SOLO WebSearch, marcato [di seconda mano]

- **La correzione standard per gli inviti doppi non è "impedirli", è
  "riusarli"**: *«se esiste già un invito pendente per quella email, lo si
  RINVIA invece di crearne uno nuovo»* — un reinvio deliberato riusa lo
  stesso token, aggiorna il ruolo se è cambiato, rimanda l'email e lo
  registra come resend; la risposta porta un flag `duplicate`/`reused`
  così l'interfaccia lo sa dire all'admin. [di seconda mano —
  codifysaas.com/blog/saas-features/saas-team-invitation-system-implementation]
- **E la forma sbagliata è documentata come un difetto vero in un prodotto
  vero, non solo in teoria**: un issue di produzione di una libreria di
  auth open-source («better-auth») intitolato esattamente *«`resend: true`
  crea un invito duplicato invece di riusare quello esistente»* — cioè la
  stessa app che qui manca l'ha aggiunta e poi l'ha dovuta correggere
  perché creava doppioni. [di seconda mano —
  github.com/better-auth/better-auth/issues/3507]
- **Microsoft segnala la stessa cosa come domanda ricorrente per Azure AD
  B2B**: «si possono avere più inviti sulla stessa email?» è una domanda
  aperta nella loro Q&A ufficiale, segno che il problema non è
  immaginario. [di seconda mano —
  learn.microsoft.com/answers/questions/597]
- **Sul riscatto: il consenso esplicito è il modello raccomandato, non
  l'eccezione.** Nel sistema di organizzazioni di Bitwarden, *«solo
  l'invitato può accettare un invito, tramite un endpoint dedicato»* — e
  la documentazione tecnica nota esplicitamente il rischio opposto: senza
  quel guardrail, un admin potrebbe far aderire qualcuno che non ha
  acconsentito a niente. Il join automatico e silenzioso fra tenant esiste
  come pattern (Microsoft Entra, per organizzazioni collegate dallo stesso
  proprietario) ma è descritto come scelta specifica per quel caso
  d'uso — non come comportamento di default quando i tenant sono aziende
  indipendenti, che è esattamente il caso di questa piattaforma (aziende
  concorrenti fra loro). [di seconda mano —
  deepwiki.com/bitwarden/server/6.2-organization-users-and-invitation-flow;
  learn.microsoft.com/entra/identity/multi-tenant-organizations/overview]

### Il delta, fatto da chi ha il codice in mano (18/09, verificato contro `2036687c`)

**(1) `inviteMember` non controlla se esiste già un invito pendente per la
stessa email nella stessa org: ogni chiamata crea un documento NUOVO, per
sempre.**
- **Verificato**: `sed -n '132,160p' apps/deepwork-id/functions/index.js`
  mostra l'intera funzione — valida ruolo ed email, poi va dritta a
  `db.collection("invites").doc()` + `.set(...)`. Nessuna lettura di
  `invites` prima della scrittura. Confermato sull'intero file: `grep -n
  "\.where(" apps/deepwork-id/functions/index.js` → righe **31-32**
  (membership attive, in `leggiOrgsAttive`), **178** (conteggio owner),
  **254-255** (`acceptInvites`, cerca gli inviti pendenti DELL'INVITATO,
  non un controllo di doppioni). Zero query dentro `inviteMember` (righe
  132-160).
- **E la UI non nasconde il doppione, lo mostra due volte**: `admin.html`
  righe 211-215 costruisce una riga per **documento** (`inv.map(i =>
  ...)`), non per email — due inviti pendenti alla stessa persona
  compaiono come due righe identiche, ognuna con la propria scadenza e il
  proprio bottone Revoca indipendente: revocarne uno lascia l'altro
  valido, e niente in schermata lo segnala.
- **E non c'è una prova che lo guardi**: `grep -n -i
  "duplicat\|due inviti\|stesso indirizzo\|stessa email"
  apps/deepwork-id/tests/run-fns.mjs apps/deepwork-id/tests/run.mjs` →
  nessuna riga (uscita vuota, comando eseguito senza `-r` su file singoli
  quindi lo zero è genuino: sono file, non cartelle). `grep -c
  "inviteMember(" apps/deepwork-id/tests/run-fns.mjs` → **5** chiamate,
  mai due sulla stessa email nello stesso test.
- **schermata**: `admin.html`, riquadro "Inviti in attesa" · **che cosa
  non va**: invitando due volte per errore la stessa persona (capita:
  l'admin non vede a colpo d'occhio se un invito è già partito, la lista
  è sotto lo storico dei membri) nascono due inviti scaduti in momenti
  diversi, con due token diversi — se l'invitato clicca il link vecchio
  dopo che l'admin ha "rinnovato" con un secondo invito, entrambi restano
  validi fino alla propria scadenza indipendente · **come si vede**: si
  invita due volte lo stesso indirizzo dalla stessa org, si apre
  `admin.html`: **due** righe con lo stesso nome, due scadenze diverse ·
  **quanto costa**: S — prima di scrivere il nuovo documento,
  `inviteMember` cerca un pendente con la stessa `email`+`orgId`
  (la stessa query già scritta in `acceptInvites`, ristretta anche a
  `orgId`) e, se lo trova, aggiorna quello (`role`, `expiresAt`) invece di
  crearne un secondo — esattamente il pattern «resend riusa» del mondo ·
  **come si misura**: `grep -c "invites.*where.*orgId" apps/deepwork-id/functions/index.js`
  deve salire da 0 dentro `inviteMember`; una prova che invita due volte
  la stessa email e pretende **un solo** documento in `invites` con
  `email`+`orgId` uguali (oggi ne nascerebbero due, provato a mano
  leggendo il codice: non serve l'emulatore per vederlo, la funzione non
  ha nessun ramo che lo eviti).

**(2) `acceptInvites` (via `redeemInvites` del client) accetta TUTTI gli
inviti pendenti della email verificata in un colpo solo, senza che
l'utente scelga o veda quali organizzazioni sta per raggiungere.**
- **Verificato**: `sed -n '243,258p' apps/deepwork-id/functions/index.js`
  — la funzione non prende **nessun** parametro identificativo
  dell'invito (`request.data` non è nemmeno destrutturato), legge `email`
  dal token e fa `db.collection("invites").where("email","==",email)
  .where("status","==","pending").get()`, poi nel `for` successivo
  (righe 259-286) accetta **ognuno**. Il commento del client lo dichiara
  di proposito: `shared/deepwork-id-client/index.js:297-298` — *«Da
  chiamare dopo ogni login registrato: riscatta eventuali inviti
  pendenti»* — cioè un solo bottone/hook, zero scelta.
  `grep -rn "acceptInvites\|redeemInvites" apps shared index.html |
  grep -v node_modules` → chiamata solo da `index.js:300` (definizione) e
  dai test; nessuna pagina di conferma («Org X ti ha invitato: vuoi
  entrare?») in nessuna delle sei app né in `apps/deepwork-id/*.html`.
- **Non è la stessa mancanza della revoca (17/09)**: quella è sul togliere
  un accesso già dato; questa è sul **dare** un accesso senza un consenso
  esplicito per organizzazione — l'unico controllo è l'email verificata
  (giusto, anti-hijack, non tocca) ma non c'è nessuna schermata intermedia
  se la stessa email ha inviti pendenti da **due org concorrenti** (il
  caso esplicito di `ARCHITETTURA.md §4`, il consulente RSPP): oggi
  entrerebbe in entrambe allo stesso login, senza mai vedere un elenco né
  poter accettarne una e rifiutare l'altra.
- **schermata**: nessuna (il riscatto è invisibile, gira dentro il login)
  · **che cosa non va**: un utente con la stessa email invitato per
  errore (o da un ex-collega che ricorda l'indirizzo) da un'organizzazione
  concorrente si ritrova membro **anche di quella**, senza averlo scelto
  in quel momento — lo scopre solo se apre il selettore d'organizzazione
  dopo · **come si vede**: si creano due inviti pendenti per la stessa
  email in due org diverse (in emulatore: due `invites/{id}.set(...)` con
  `status:'pending'`), si fa login con quell'email verificata: `accepted`
  torna con **entrambi** gli `orgId`, in un'unica chiamata, senza tappe
  intermedie · **quanto costa**: M — non è una riga sola come il punto 1,
  perché tocca l'esperienza di primo accesso: `acceptInvites` dovrebbe
  restituire l'elenco senza consumarlo, e un secondo passo (`confirmInvite(inviteId)`
  o un parametro di selezione) accettarli uno per uno; il minimo che copre
  il rischio del consulente su cave concorrenti è mostrare l'elenco
  **prima** di unirsi, anche se poi si sceglie "accetta tutti" · **come si
  misura**: `grep -c "confirmInvite\|selezionaInvito" apps/deepwork-id/functions/index.js`
  deve salire da 0; una prova con due inviti pendenti in due org che
  pretenda che il primo giro **non** scriva nessuna membership finché non
  arriva una scelta esplicita (oggi impossibile da scrivere: la funzione
  non ha un ramo che aspetti).

**Che cosa NON è un "non c'è" qui.** L'anti-hijack sull'email verificata
(`email_verified !== true` rifiutato, riga 248) resta un controllo vero e
non è in discussione; il problema non è CHI può riscattare un invito, è
che il riscatto **non chiede conferma** su QUALE organizzazione. E la
scadenza a 14 giorni, la marcatura `expired` al tentativo di riscatto
tardivo e la revoca di un pendente esistono già e funzionano (provati
`run-fns.mjs:194-206`, non rimessi in discussione): il buco è solo
nell'**assenza di deduplica** in entrata (1) e nell'**assenza di scelta**
in uscita (2), due momenti diversi dello stesso ciclo di vita dell'invito.

### Fonti (WebSearch, non lette per intero — [di seconda mano])

- [CodifySaaS: Proven SaaS Team Invitation System Implementation](https://codifysaas.com/blog/saas-features/saas-team-invitation-system-implementation/)
- [GitHub — better-auth: "resend: true is creating a duplicate invite instead of reusing the existing one" (issue #3507)](https://github.com/better-auth/better-auth/issues/3507)
- [Microsoft Q&A: Azure AD B2B — Allowing multiple invitations on same email id?](https://learn.microsoft.com/en-us/answers/questions/597/azure-ad-b2b-allowing-multiple-invitation-on-same)
- [DeepWiki: bitwarden/server — Organization Users and Invitation Flow](https://deepwiki.com/bitwarden/server/6.2-organization-users-and-invitation-flow)
- [Microsoft Learn: Multitenant organization capabilities in Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/identity/multi-tenant-organizations/overview)

**Riassunto** — 2 mancanze **confermate**, stessa area (il ciclo di vita
dell'invito, non ancora guardato dalle quattro ricerche precedenti): (1)
`inviteMember` non deduplica — due inviti alla stessa email/org creano due
documenti indipendenti, mai uniti in nessuna vista (`grep -n "\.where("
apps/deepwork-id/functions/index.js` → nessuna query dentro la funzione,
righe 132-160); (2) `acceptInvites`/`redeemInvites` unisce l'utente a
**tutte** le organizzazioni con un invito pendente in una sola chiamata
senza conferma per singola org (`request.data` non usato, nessuna
`confirmInvite` in tutto il repository). Costo dichiarato S per la prima,
M per la seconda perché tocca il primo accesso. Nessuna delle due richiede
di riaprire l'anti-hijack sull'email verificata, che resta valido. Tutto
verificato contro il commit `2036687c`.
