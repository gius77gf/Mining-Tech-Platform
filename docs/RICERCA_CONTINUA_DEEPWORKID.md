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
