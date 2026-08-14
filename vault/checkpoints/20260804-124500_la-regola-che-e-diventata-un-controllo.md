# Checkpoint — la regola violata due volte è diventata un controllo

**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`

## 1. Il fatto, detto per intero

`CLAUDE.md` scrive dal 01/08 che **non si modificano moduli dati e pagine mentre
gira un giro del browser**: quelle righe se le carica il banco, e il suo
risultato diventa falso. La regola è scritta, ha il suo racconto (19 banchi
buttati) e la sua domanda-guida («*questo file lo carica una pagina?*»).

**È stata violata due volte in due giorni, la seconda da me, oggi**, mentre
correggevo `proiezioneAnnua`: `tutti.mjs` girava da 23 minuti e io ho modificato
`terra-data.js` e `terra/index.html`. Il giro è stato ucciso. Per fortuna era
arrivato a `contrasto` su *flotta* e Terra non era ancora stata aperta — ma
questo l'ho saputo **dopo**, leggendo l'output, non prima di premere invio.

Il repository ha già la frase che serve, scritta a proposito di un'altra regola:
> *una regola scritta è affidata alla memoria di chi legge.*

Due volte in due giorni è la misura. Quindi: non un terzo paragrafo, un
controllo.

## 2. Che cosa fa adesso il giro

`tutti.mjs` prende l'**impronta** (sha1) dei file che le pagine caricano —
**prima** del giro, **dopo ogni banco** e alla fine. Se qualcosa cambia:

```
⛔ GIRO NON VALIDO: il codice che le pagine caricano è cambiato mentre girava.
   dopo «contrasto»: 2 file (apps/terra/terra-data.js, apps/terra/index.html)
   Hanno misurato il codice giusto solo i primi 3 banchi su 25.
```

e **esce con 2**, invece di stampare un riepilogo verde con un avviso in mezzo —
che verrebbe letto come verde, ed è il modo in cui è passata le prime due volte.

Il controllo **dopo ogni banco** e non solo alla fine serve a una cosa precisa:
sapere **quali** banchi hanno misurato il codice giusto, invece di buttarne
venticinque per una modifica arrivata all'ultimo.

### Che cosa NON guarda, di proposito

`tests/`, `docs/`, `vault/`, `.git`. Modificare una suite o un documento mentre
gira un giro è **legittimo** — lo dice `CLAUDE.md` — e un controllo che grida al
lupo lì verrebbe spento entro il secondo giro. La metà «non deve scattare» è
provata quanto l'altra.

## 3. Le due controprove, e perché due

| controprova | che cosa dimostra |
|---|---|
| `impronta.mjs --controprova` — 6 prove | il **rilevatore** vede modificato / sparito / aggiunto, nomina il file, e **tace** su test e documenti |
| `impronta-giro.mjs` — 7 prove | il rilevatore è **collegato** al giro: uscita `2`, la scritta NON VALIDO, il nome del file, il conto dei banchi ancora buoni — **e** che senza modifiche il giro esce `0` |

La seconda esiste perché la prima non basta, ed è la lezione del `<script>`
dimenticato: **una guardia scollegata non è un errore di sintassi**. Gira su una
**radice d'impronta finta** (cartella temporanea, banchi finti che dormono mezzo
secondo), così la controprova non fa proprio il gesto che l'unità vieta.

E la metà «senza modifiche esce 0» conta quanto l'altra: una guardia che
dichiara sempre invalido è inutile quanto una che non dichiara mai.

## 4. Una cosa trovata per strada: la sonda non girava in CI

`sonda-vuoto.mjs` è un **controllo permanente** dal 03/08 — e non era in
`npm test`. Girava solo quando qualcuno se la ricordava: esattamente il modo di
fallire che questo repository si è scritto addosso tre volte. Adesso è nella
catena, insieme alle due controprove nuove.

## 5. La CI aveva ragione, e il controllo era dei nostri

Il commit precedente ha fatto **fallire la CI**: `numeri-nei-documenti.mjs` ha
visto che tre documenti dicevano «1.359 prove» mentre le suite ne eseguivano
1.360. Non un difetto — **il controllo che fa il suo mestiere**, della stessa
famiglia di quelli scritti oggi. Aggiornati `DEVELOPMENT.md`,
`STATO_PRODOTTO.md`, `DECISIONI_WEEKEND.md`.

## Stato

- catena `node` non-emulatore: **tutta verde** (kpi 1006, stile 264, helper 48,
  pointcloud 26, manifest 9, demo 7, sonda 7, impronta 6, impronta-giro 7,
  documenti 14, copertura 424/424, nomi doppi 0 da sistemare);
- le 106 con l'emulatore non partono in questo ambiente (le gira la CI).

## Prossimo passo atomico

1. **rilanciare il giro completo del browser** sul codice di adesso — ed è la
   prima volta che il giro saprà dire da sé se qualcuno gliel'ha cambiato sotto;
2. **`genesi-struttura.mjs`**: pretendere che fallisca, poi `--prima`;
3. **Genesi unità A** (`docs/LA_STRUTTURA_DEL_CORE_SCRITTA_SEI_VOLTE.md`);
4. **Terra/Genesi — tracciabilità del volume**, unità 1 e 2;
5. **Conti — nota di credito**, dalla prova su `tempoMedioPagamento`.

## Nessun blocco

Decisioni del fondatore ferme in `DECISIONI_WEEKEND.md` (5a/5b, 10-15) più
**Firebase Storage** per le foto di Scudo.
