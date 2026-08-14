# Checkpoint — il banco scritto prima, e una «scoperta» che non lo era

**Commit:** `bb09c38` (il banco di Genesi), `611757f` (la ricerca), `72f3d22`
(la correzione)
**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`

## 1. Il banco che dirà se Genesi è passata al condiviso — scritto **prima**

`apps/deepwork-id/tests/browser/genesi-struttura.mjs`. Le tre trappole
dell'unità A **non sono errori di sintassi** — la pagina si apre lo stesso in
tutti e tre i casi — quindi il controllo deve **toccare la pagina**:

| prova | quale trappola coglie |
|---|---|
| i **sette** id dell'editor 3D ci sono ancora | la sostituzione `mdl` → `modal` a tappeto |
| il **cancello di consenso** esiste, si sblocca con la casella e dice ancora «**vietato** … sgombero» | l'id `modal` rubato all'avvertenza di sicurezza |
| il campo del nome è **precompilato** | `chiediValore` col terzo parametro incompatibile, che **compila in silenzio** |

Con la controprova incorporata (`--prima`): il server rimette gli id `mdl*` e
toglie il `<script>` **nella risposta HTTP**, senza toccare il file.

⚠️ **Scritto e non ancora eseguito**, ed è scritto anche nel commit: girava il
giro a 25 banchi e un secondo Chromium ne avrebbe falsato le misure di tempo. Va
lanciato appena il giro finisce, **prima** della migrazione: oggi deve fallire.

## 2. La ricerca sull'evento di sicurezza dal campo — e una correzione

Il censimento diceva «la prima scrittura cross-app di Campo, con le domande sui
permessi Firestore che si porta dietro». **Quelle domande non ci sono**, ed è
misurato:

- Sentinella **scrive già** dentro Scudo (`ponteScudo`: seconda istanza dell'SDK
  con `appId: "scudo"`, `addDoc` su `orgCollection`, e un ripiego demo);
- le regole permettono a **qualunque membro dell'organizzazione** di scrivere
  sotto qualunque `appId`: `match /apps/{appId}/{document=**}` con
  `allow write: if memberOf(orgId) && !isDemoOrg(orgId)`.

**E una cosa che va detta bene.** In `scudo-data.js` è scritto che «l'isolamento
dello SDK è per organizzazione **e per app**». Vero come descrizione, ma:

- il confine **fra organizzazioni** è una **barriera** — regole, claim scritti
  solo da Cloud Function, 58 test con l'emulatore. È la promessa che vendiamo;
- il confine **fra app** è una **convenzione del percorso**. Chiunque può
  inizializzare l'SDK con un altro `appId` — ed è quello che il ponte fa **di
  proposito**.

Non è un difetto (senza, i ponti non esisterebbero). Ma non va raccontato come
una garanzia.

## 3. ⚠️ Una «scoperta» che non lo era, e l'ho scritto

La prima stesura della scheda annunciava come **nuova** l'obbligo di
comunicazione dei mancati infortuni (art. 15 D.L. 159/2025 → L. 198/2025).
**Era già noto in casa**: citato in **sei punti** di `apps/scudo/`, il `README`
di Scudo lo indica come **finestra di mercato** dell'app, e il **riepilogo
aggregato con export CSV esiste già** — con la nota informativa e il richiamo a
confermare con l'RSPP. Il censimento lo elenca fra le cose **fatte**.

L'ho visto leggendo `riepilogoInfortuni` per tutt'altra ragione: il commento
sopra la funzione citava la legge.

Annunciarlo come nuovo sarebbe stato **gonfiare un risultato** — che la
direttiva 5 vieta con quelle parole. La scheda ora si apre con la correzione,
prima di tutto il resto.

**Quello che resta, ed è vero**: il valore della segnalazione dal campo non è
costruire il prospetto — quello c'è — ma **riempirlo di verità**. È il
numeratore, non il foglio. E si misura così: se dopo un mese i near-miss
segnalati **dal turno** sono zero, non è la cava a essere sicura, è la funzione
a non aver funzionato.

## In corso

Il **giro a 25 banchi** gira sul codice finale. Finché gira: `docs/`, `vault/` e
**solo** i file di test — non i moduli. *(È l'errore del ciclo precedente, e la
domanda da farsi prima di ogni modifica è «questo file lo carica una pagina?».)*

## Prossimo passo atomico

1. **leggere l'esito del giro**;
2. **lanciare `genesi-struttura.mjs`** e pretendere che fallisca (è la sua prima
   prova), poi **`--prima`** per la controprova;
3. **Genesi unità A**, dal piano misurato in
   `docs/LA_STRUTTURA_DEL_CORE_SCRITTA_SEI_VOLTE.md`;
4. **Terra/Genesi — tracciabilità del volume**, unità 1 e 2;
5. **Conti — nota di credito**, dalla prova su `tempoMedioPagamento`.

## Nessun blocco

Restano aperte le decisioni del fondatore in `DECISIONI_WEEKEND.md` (punti
5a/5b, 10, 11, 12, 13, 14, 15) più la domanda su **Firebase Storage** per le
foto di Scudo — che è anche quella che decide se la segnalazione dal campo nasce
con o senza foto.
