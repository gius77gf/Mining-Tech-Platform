# Checkpoint — il giro macchina e il libretto del mezzo

**Commit:** `6feda2c`
**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa è stato fatto

17 prove sull'ultimo gruppo grosso di Flotta: il **giro macchina**
(controllo pre-uso), l'**anagrafica del mezzo** e il **libretto**
(`fascicoloMezzo`).

Il giro macchina è quello che porta in Flotta **chi guida**, non solo chi
sta in ufficio: dieci minuti prima di salire, ed è da lì che nasce una
manutenzione. Il libretto è invece la pagina che un compratore guarda per
prima.

Regole messe al riparo:

- **un giro con voci senza risposta non è completo** — un controllo in cui
  non hai guardato non è un controllo. E `primaMancante` esiste per
  portarci sopra chi compila, invece di dirgli solo «no»;
- una voce di **sicurezza** segnata «non va» fa scattare il **rosso**, le
  altre restano un avviso giallo: sono due cose diverse e devono restare
  distinte, se no il rosso non vuol più dire niente;
- ogni «non va» apre una manutenzione datata al giorno del giro (o a oggi
  se manca) e che **dice da dove viene**, così nel registro si capisce che
  è stato l'operatore a trovarla;
- la checklist si **ricrea a ogni chiamata**: una lista condivisa farebbe
  comparire nel giro di domani le risposte di oggi;
- il tipo di mezzo **scelto** batte quello indovinato dal nome — indovinare
  la checklist è innocuo (l'operatore vede le voci e le riconosce),
  scrivere un dato indovinato in anagrafica no;
- il **contaore non torna indietro**, e «45,8» litri e «1.250,75 €»
  arrivano interi: un numero non capito viene **detto**, mai salvato come
  zero, che su una spesa di gasolio è un buco che nessuno ritrova più;
- la fotografia del parco resta **una al giorno** (e nessuna su un parco
  vuoto), e nel libretto entrano **solo le righe di quel mezzo** — tutto
  tenuto insieme dal **nome breve**, che è la chiave con cui l'app collega
  manutenzioni, scadenze, interventi, controlli, fermi e rifornimenti.

## Controprova, e la cosa da tenere

Quattordici difetti in una copia del modulo: **14 su 14** fanno cadere la
prova col loro nome.

Ma il primo giro ne dava **13**. Il difetto che «non distingueva» era
quello sulla cache della checklist — e non era nessuna delle due letture
di CLAUDE.md: **l'iniezione non aveva iniettato niente.** Avevo aggiunto
solo la *lettura* della cache e non la *scrittura*, quindi la copia si
comportava esattamente come l'originale.

Va aggiunto all'elenco delle cause di «non distingue», perché porta a un
intervento diverso da tutte le altre: non si tocca né la prova né il
codice — **si guarda l'iniezione**. Il segnale che la distingue: i
caratteri cambiati ci sono (qui +72), ma nessuno di quei caratteri è su un
percorso che viene eseguito.

## Numeri

- Flotta: **52 → 65 funzioni coperte su 71**. Restano scoperte sei voci:
  `perCampo`, `messaggioNumero`, `AVVISO_DECIMALE`, `AVVISO_MIGLIAIA`,
  `TIPI_MEZZO` (usata di rimbalzo), e `flottaData` (il caricatore dati, che
  richiede la rete).
- `run-kpi.mjs`: **863 → 880**; totale `node`: **1.146 → 1.163**

## Stato del giro del browser

In corso, quarto banco su diciannove (contrasto · controprova). Niente
modifiche a moduli e pagine finché gira.

## Prossimo passo atomico

Chiudere Flotta con le quattro funzioni degli **avvisi sui numeri**
(`perCampo`, `messaggioNumero`, `AVVISO_DECIMALE`, `AVVISO_MIGLIAIA`):
sono le frasi che l'app dice quando un numero non si capisce, e visto che
la convenzione dei numeri è condivisa fra le app va anche **controllato se
la stessa logica esiste altrove** — se sì, il posto è `shared/`, con la
prova che pretende l'identità e non il comportamento.

Poi il censimento dice **Conti** (35/58).

## Nessun blocco

Restano aperte le decisioni del fondatore in `DECISIONI_WEEKEND.md`
(punti 5a/5b, 10, 11, 12, 13).
