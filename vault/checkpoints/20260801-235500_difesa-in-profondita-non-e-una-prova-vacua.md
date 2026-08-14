# Checkpoint — quando «non distingue» NON vuol dire che la prova è vacua

- **Tipo**: unità (17 prove sul referto che tara la legge di sito) + una
  distinzione di metodo che mancava
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `26b814d`

## L'unità

Il gruppo del **referto del sismografo**: `refertoDaVolata`, `ppvDiVolata`,
`campiPpvVolata`, `CAMPI_PPV_VUOTI`, `testoFontePpv`, `riferimentoReferto`,
`lettureVibrazioniDelGiorno`, `refertiDaVolate`, `motivoReferto`.

Da queste volate Genesi ricava K e β, e da K e β dipendono **le distanze di
sicurezza**. È il posto di tutto l'ecosistema dove un numero finto fa più
danno: non produce un report brutto, produce una distanza sbagliata.

Il vincolo che le prove difendono si chiama **T9**: *una volata PREVISTA non
diventa mai un referto*, nemmeno se porta una PPV prevista e ha distanza e
carica. Con un valore **previsto** dentro la regressione, la legge di sito
confermerebbe sé stessa e le distanze uscirebbero da un **calcolo circolare**.

Le altre regole bloccate: alla volata prevista si chiede **una cosa sola** —
che sia stata sparata — invece di elencarle dati che non possono ancora
esistere; una volata vecchia torna `null` e non una PPV finta; la PPV
**trascritta a mano** non tiene punto e ora di un'altra misura, perché farebbe
risalire alla casa sbagliata; toglierla azzera valore **e** provenienza
insieme; una lettura che non è in mm/s è **marcata**, non silenziata; e senza
escursione di distanza scalata la pendenza non è ricavabile — meglio dirlo
prima dell'export che dopo il rifiuto.

Controprova su una copia: **11 difetti rimessi, 11 visti, 0 non visti.**

## ⚠️ La distinzione che mancava

Due controprove di fila hanno risposto **«non distingue»** sulla prova *«una
volata prevista non è mai pronta»*. Nel checkpoint precedente lo stesso segnale
significava **prova vacua** — dati scelti male, che facevano coincidere la
risposta giusta con quella sbagliata. Qui no: significava l'opposto.

`pronto` su una volata prevista è protetto da **due guardie indipendenti**: il
motivo `"prevista"` spinto sempre nell'elenco, e il `!prevista &&` sul flag.
Togliendone **una** l'altra regge, e la prova continua a passare — non perché
non sappia fallire, ma perché il codice è difeso **in profondità**.

Quindi «non distingue» ha due letture opposte, e vanno separate:

- **la prova non prova niente** → si correggono i **dati della prova**;
- **il codice ha più di una guardia** → si toglie **tutto lo strato**, e la
  controprova onesta le rimuove insieme.

Fatto così (`controprova-t9.mjs`, che stampa quante guardie ha tolto davvero),
il risultato è netto: `pronto: true, motivi: []` — **una volata mai sparata
entrerebbe nella legge di sito**. La prova sa fallire, e adesso si sa anche
quanto è difeso il codice sotto.

## Stato

- **592** KPI (433 all'inizio della giornata) → **851** prove `node`, verdi in UTC
- **159 prove nuove** in giornata, **2 difetti di prodotto** corretti, **2** in
  coda, **1 prova vacua** corretta
- giro a 19 banchi: agli ultimi due banchi

## Prossimo passo atomico

Il giro sta finendo. Appena chiude, nell'ordine:

1. `isoLocale`/`oggiISO` in `shared/deepwork-id-client/dw-shell.js`, con Campo
   che **ri-esporta** e il test che pretende l'**identità**;
2. i tre punti di **categoria A** del giorno locale (le due chiavi dei mesi nel
   core, `piuGiorni` di Conti, la finestra di `ritmoMedioAnnuo` in Terra);
3. l'ora persa in `preparaLetture` di Sentinella;
4. lo zero di comodo in `apps/flotta/index.html` (~1397/1401).

## Bloccanti

- Nessuno.
