# L'evento di sicurezza dal campo — ricerca prima di scriverlo

*04/08. Il censimento la mette fra le cose «da fare» di Campo e la descrive
così: «sarebbe la **prima scrittura** cross-app di Campo, con le domande sui
permessi Firestore che si porta dietro». Misurando, **le domande non ci sono**.*

> ## ⚠️ Correzione scritta prima di tutto il resto
>
> La prima stesura di questa scheda annunciava come **scoperta** l'obbligo di
> comunicazione dei mancati infortuni (art. 15 D.L. 159/2025 → L. 198/2025).
> **Era già noto in casa, e da tempo**: la legge è citata in **sei punti** fra
> `apps/scudo/`, il `README` di Scudo la indica come **finestra di mercato**
> dell'app, e il **riepilogo aggregato esiste già** — con l'export CSV «nella
> forma che serve alla comunicazione», la nota informativa e il richiamo a
> confermare con l'RSPP. Il censimento stesso lo elenca fra le cose **fatte**.
>
> Annunciarlo come nuovo sarebbe stato **gonfiare un risultato**, che la
> direttiva 5 vieta esplicitamente. Quello che questa ricerca aggiunge davvero è
> più piccolo, ed è nei due punti qui sotto: **il ponte non ha problemi di
> permessi** (misurato sulle regole) e **il confine fra app non è una barriera
> di sicurezza** (misurato sull'SDK). Il resto è conferma di quello che il
> prodotto sapeva già — utile per la data e per il numero della legge di
> conversione, non per la sostanza.

---

## 1. La scrittura cross-app non è un problema nuovo: esiste già e funziona

Sentinella **scrive già** dentro Scudo. Il ponte è in
`apps/sentinella/sentinella-data.js` (`ponteScudo`) e fa esattamente questo:

```js
const id = await DeepworkID.init({ appId: "scudo" });     // seconda istanza dell'SDK
if (id.user && id.authState() === "member") {
  return { mode: "live",
    azioni: () => read("azioni"),
    aggiungi: (rec) => addDoc(id.orgCollection("azioni"), rec) };
}
// e un ripiego demo su localStorage, così le due pagine si parlano anche senza backend
```

Quindi per Campo → Scudo **non c'è niente da inventare**: si copia questa forma.
E le regole Firestore **non vanno toccate** — verificato leggendole:

```
match /apps/{appId}/{document=**} {
  allow read:  if memberOf(orgId) || (isDemoOrg(orgId) && signedIn());
  allow write: if memberOf(orgId) && !isDemoOrg(orgId);
}
```

Chi è **membro dell'organizzazione** può scrivere sotto qualunque `appId` di
quella organizzazione. Non serve una regola nuova, non serve un ruolo nuovo.

### ⚠️ Ma allora va detta una cosa, e va detta bene

In `scudo-data.js` c'è scritto: «*Scudo non può leggere le collezioni di
Sentinella: l'isolamento dello SDK è per organizzazione **E per app***». È vero
come **descrizione di come si comporta l'SDK**, e va letto per quello che è:

- il confine **fra organizzazioni** è una **barriera vera**: sta nelle regole,
  poggia sui claim scritti solo da Cloud Function, ed è provato da 58 test con
  l'emulatore. È la promessa che vendiamo, ed è mantenuta;
- il confine **fra app** è una **convenzione del percorso**: `orgCollection`
  costruisce `organizations/{org}/apps/{appId}/{nome}` con l'`appId` con cui
  l'SDK è stato inizializzato. Chiunque può inizializzarlo con un altro
  `appId` — ed è **esattamente quello che il ponte fa di proposito**.

Cioè: **il confine fra app non è una barriera di sicurezza, ed è giusto così**
(senza, i ponti non esisterebbero). Ma non va raccontato come se lo fosse. Se un
giorno servirà davvero — «chi lavora in cava non deve poter toccare i documenti
di sicurezza» — non è un problema di `appId`: è la **decisione già aperta** sui
ruoli dentro l'organizzazione (`docs/REVISIONE_SICUREZZA_202607.md`: oggi dentro
l'azienda sono tutti amministratori).

> **Decisione 1 — si copia il ponte di Sentinella, non si tocca nessuna regola.**
> E la frase sull'isolamento «per app» va corretta dove è scritta, perché oggi
> si può leggere come una garanzia che non è.

---

## 2. La norma: quello che il prodotto sapeva già, e la riga che si può precisare

⚠️ **Non è una scoperta**: Scudo la cita in sei punti e il riepilogo aggregato è
già costruito su di lei. Qui resta solo perché serve avere in un posto la
**catena esatta** della norma, che nel codice è abbreviata.

L'**art. 15 del D.L. 31 ottobre 2025 n. 159**, convertito con modificazioni
dalla **L. 29 dicembre 2025 n. 198** (in vigore dal 29/12/2025), introduce per
le imprese con **più di quindici dipendenti** l'obbligo di **individuare,
tracciare, analizzare e comunicare** i dati **aggregati** degli eventi segnalati
come **mancati infortuni**, insieme alle **azioni correttive o preventive**
intraprese. Le linee guida attuative sono attese entro sei mesi dall'entrata in
vigore e devono tener conto delle procedure già sviluppate da INAIL e dalle
parti sociali, per non duplicare adempimenti.

Fino a quel decreto il near-miss era **buona pratica**: il D.Lgs 81/2008 non lo
nomina, e non ci sono sanzioni per la mancata gestione — l'aggancio era
indiretto (art. 18, miglioramento continuo e aggiornamento della valutazione dei
rischi; art. 20, il lavoratore segnala le condizioni di pericolo di cui viene a
conoscenza).

⚠️ **Come sempre per le norme: da confermare col consulente del cliente.** La
scheda serve a orientare il prodotto, non a dare una consulenza — ed è la stessa
riga che l'app scrive già sui suoi documenti.

### Che cosa vuol dire per noi, concretamente

Scudo **ha già** i due pezzi che quella norma mette insieme:

| cosa chiede l'art. 15 | in Scudo oggi |
|---|---|
| **individuare** i mancati infortuni | ✅ `infortuni` con `tipo: near-miss`, e la segnalazione rapida dal telefono |
| **tracciare** | ✅ data, luogo, categoria di rischio, descrizione, anonimo/no |
| **analizzare** | ⚠️ c'è il riepilogo aggregato; **manca** l'analisi causa-radice (5 Perché), che il censimento ha fra le «da fare» |
| **azioni correttive o preventive** | ✅ le CAPA, e sono **legate al preciso evento** |
| **comunicare i dati aggregati** | ✅ **esiste già**: `btn-nm-export` produce il CSV per periodo, tipo, luogo, azioni aperte e chiuse |

**Il foglio da consegnare esiste già** (`btn-nm-export`: periodo, totale, di cui
anonimi, per tipo, per luogo, near-miss con e senza azione, azioni aperte e
chiuse). Quindi la riga «manca il prospetto» che avevo scritto era **falsa**.

Quello che manca davvero è **a monte**: il prospetto conta gli eventi che
qualcuno ha inserito **dall'ufficio**. Un near-miss visto al fronte alle sei del
mattino ci arriva solo se il caposquadra si ricorda di dirlo a fine turno.

> **Decisione 2 — la segnalazione dal campo non serve a costruire il prospetto:
> serve a riempirlo di verità.** È il numeratore, non il foglio. E si misura
> così: se dopo un mese i near-miss segnalati **dal turno** sono zero, la
> funzione non ha funzionato — non la cava è sicura.

---

## 3. Che cosa deve portarsi dietro una segnalazione dal campo

Dal turno, con i guanti, sul telefono. Il vincolo è **il tempo**: se costa più
di trenta secondi non viene fatta, e un near-miss non segnalato non esiste.

Scudo ha già la forma giusta (`rapida: true` nel suo schema), e Campo ha già la
foto sull'anomalia. Quindi la segnalazione dal campo è: **data e turno** (li ha
già il rapportino), **luogo** (il fronte o l'area della squadra), **categoria di
rischio** (le stesse chiavi di Scudo, non una lista nuova), **descrizione**,
**foto facoltativa**, **chi segnala** — o **anonimo**, che Scudo già prevede e
che è la cosa che fa la differenza fra un registro vivo e uno vuoto.

⚠️ **La foto è il solito nodo**: più immagini in un documento Firestore sfondano
il limite, ed è la stessa decisione su **Firebase Storage** che blocca già due
voci di Scudo. Se non è decisa, la segnalazione dal campo nasce **senza foto** e
lo dice — non si finge che ci sia.

### E il ritorno, che è la parte che quasi tutti dimenticano

Chi segnala deve **vedere che è servito**. Se la segnalazione sparisce
nell'ufficio, la seconda non arriva. Quindi il rapportino del turno successivo
mostra lo **stato** di quello che quella squadra ha segnalato: presa in carico,
azione aperta, chiusa. È lo stesso principio del ponte
Sentinella → Scudo, girato dalla parte di chi sta in cava.

> **Decisione 3 — il ciclo si chiude in Campo, non solo in Scudo.** Senza il
> ritorno, la funzione muore dopo due settimane.

---

## 4. Le unità che ne escono

1. **il ponte Campo → Scudo**, copiando `ponteScudo` di Sentinella (`appId:
   "scudo"`, `addDoc` su `infortuni`, ripiego demo su `localStorage`);
2. **la segnalazione dal turno**: pochi campi, categorie **prese da Scudo** e non
   riscritte — la regola del `shared/` vale anche per gli elenchi;
3. **il ritorno in Campo**: lo stato delle segnalazioni della squadra;
4. **niente prospetto nuovo**: c'è. Semmai una riga in più dentro quello che
   c'è — **quanti eventi sono arrivati dal campo** e quanti dall'ufficio, perché
   è l'unico modo di sapere se la funzione sta funzionando;
5. *(rimandata, ma da qui si vede)* l'**analisi causa-radice**, che l'art. 15
   nomina esplicitamente («analizzare») e che il censimento ha già in elenco.

**Il primo test da scrivere** non è l'aritmetica: è che una segnalazione partita
dal turno **arrivi in Scudo con la sua origine leggibile**, e che il ritorno in
Campo dica lo stato vero anche quando lo stato è «nessuno l'ha ancora guardata».
*(Il principio dell'assenza sul prospetto è già applicato, e bene: «un registro
vuoto non vuol dire che non succeda niente, vuol dire che non si segnala».)*

---

## 5. Che cosa questa scheda NON decide

- **Le foto**: dipendono da Firebase Storage, che è una spesa e quindi una
  decisione del fondatore. Fino ad allora la segnalazione nasce senza.
- **A chi arriva la notifica**: Scudo non ha oggi un meccanismo di avviso, e
  costruirlo qui sarebbe una funzione nuova travestita da dettaglio.
- **Il formato esatto della comunicazione** dell'art. 15: le linee guida
  attuative erano attese entro sei mesi dall'entrata in vigore. Il prospetto si
  costruisce sui dati che la norma nomina (eventi aggregati + azioni), non su un
  modulo che ancora non c'è.
- **La soglia dei quindici dipendenti**: si mostra a tutti, senza filtri
  inventati. Chi ha meno di quindici dipendenti trova comunque utile il
  prospetto, e non tocca a un software decidere a chi si applica una norma.

---

## Fonti

- [D.L. 159/2025 — obbligo di comunicazione dei mancati infortuni (Certifico)](https://www.certifico.com/sicurezza-lavoro/documenti-sicurezza/documenti-riservati-sicurezza/d-l-159-2025-obbligo-comunicazione-mancati-infortuni-near-miss-note)
- [Convertito in legge il D.L. 159/2025 — misure urgenti in materia di salute e sicurezza sul lavoro (Consicur)](https://www.consicursrl.it/2026/02/16/convertito-in-legge-il-d-l-159-2025-misure-urgenti-in-materia-di-salute-e-sicurezza-sul-lavoro/)
- [Conversione in legge del D.L. 159/2025 (Confartigianato Padova)](https://www.confartigianatopadova.it/conversione-in-legge-del-d-l-159-25-misure-urgenti-per-la-tutela-della-salute-e-della-sicurezza-sui-luoghi-di-lavoro-e-in-materia-di-protezione-civile/)
- [Near miss: obbligo e gestione con il D.L. 159/2025 (SILAQ)](https://www.silaq.com/media/articoli-silaq/near-miss-nei-luoghi-di-lavoro-la-svolta-normativa-che-cambia-la-prevenzione)
- [L'obbligo di registrare i mancati incidenti — i quesiti sul decreto 81 (PuntoSicuro)](https://www.puntosicuro.it/i-quesiti-sul-decreto-81-C-100/i-quesiti-sul-decreto-81-l-obbligo-di-registrare-i-mancati-incidenti-AR-13604/)
- [Obbligo di registrare i near-miss: le indicazioni del D.Lgs. 81/08 (CTP GPL)](https://corsi.ctpgpl.it/news/sicurezza-e-salute-lavoratori/obbligo-registrare-near-miss-quasi-infortuni-le-indicazioni-del-d-lgs-81-08/)
- [Near miss o mancato infortunio: definizione e utilità della segnalazione (CorsiSicurezza)](https://www.corsisicurezza.it/blog/near-miss-mancato-infortunio-definizione.htm)
