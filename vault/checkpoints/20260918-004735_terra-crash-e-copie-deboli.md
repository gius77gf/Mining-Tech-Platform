# Checkpoint — 2026-09-18T00:47:35Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
8e85be3d

## Cosa è stato completato
Chiusi i primi due dei tre difetti trovati dal terzo giro di deep-pass su
Terra (agente a82876ad086170520):
1. **Crash duro**: `dataISOBuona` (copia debole locale, solo forma) in
   `shared/dw-ponti.js` sostituita con `dataISOEsiste` (calendario vero)
   nei suoi 4 punti d'uso. Un rilievo con `data:"2026-13-45"` mandava
   `avanzamentoDaUltimoRilievo` in `RangeError: Invalid time value` non
   gestito, bloccando la sezione turni della pagina Rilievi sul segnaposto
   di caricamento per sempre.
2. **Divergenza silenziosa**: `proiezioneAnnua`/`kpiFrom` passate da
   `rilievoUsabile` a `rilievoUsabileConData` (i due punti che affettano i
   rilievi per anno/mese); e la pagina Piano aveva una TERZA copia a mano
   dello stesso conto (`estrattoAnnoP`) con la stessa guardia debole,
   rimossa: ora `proiezioneAnnua` si chiama una volta sola e la riserva
   residua legge il suo `estrattoAnno`.
3. **Scartato di proposito**: `estrattoComplessivo`/`vitaCava` (terzo punto
   segnalato dall'agente) NON toccato — un test esistente dichiara
   intenzionale che il volume di un rilievo con data storta continui a
   consumare il titolo. Non riaperto senza una decisione esplicita.

Tre nuovi banchi con controprova, quattro nuovi test puri in `run-kpi.mjs`.
Giro isolato: 41/41, 4114 asserzioni, KPI 3124/3124.

⚠️ **Nota di processo**: il commit `c7696094` che contiene questo lavoro
porta un messaggio `canarino: ...` perché il trigger settimanale è scattato
mentre lo stavo committando e ho eseguito il protocollo canarino
(obbligatorio) senza accorgermi che i file Terra erano già in stage da
prima — il commit ha quindi un messaggio fuorviante rispetto al suo
contenuto reale. Non riscritto (mai riscrivere la storia senza
autorizzazione): il contenuto è corretto e verificato, solo il messaggio è
impreciso. Il numero delle asserzioni è stato corretto nel commit
successivo (`8e85be3d`).

## Stato roadmap
Terzo giro di deep-pass: Sentinella ✅, Conti ✅, Scudo ✅, Genesi ✅,
Flotta ✅, Terra (2 di 3 difetti chiusi, il terzo sotto). Campo: terzo
giro in corso (background, agente adaf5869ccec0571f).

## Prossimo passo atomico
1. **Terzo difetto Terra**: `frontiAmbigui` (dentro `conformitaProgetto`,
   `apps/terra/terra-data.js:3799-3893`) è calcolato dal modulo ma mai
   letto da `apps/terra/index.html` (`renderConformita` righe ~2331,
   `cardConformita`/`itemConformita` righe ~2203-2329 leggono solo
   `c.fronti`/`c.volume`/`c.geometria`/`c.sequenza`, mai `c.frontiAmbigui`)
   — guardia scollegata: il commento del modulo descrive esattamente lo
   scenario di rischio (un fronte condiviso per errore fra due lotti
   raddoppia il volume misurato di un lotto) che dovrebbe segnalare, e non
   arriva mai a schermo. Da collegare: aggiungere un avviso nella pagina
   quando `c.frontiAmbigui.length > 0`, con banco browser dedicato
   (iniettare `lo5.frontiId` che include un fronte già del Lotto 4,
   verificare che compaia un avviso visibile, non solo il badge "fuori dai
   lotti" muto).
2. Verificare dal vivo la pista `varianzaLottoAnno` (terra-data.js:
   3564-3577, filtra con `.slice(0,4)` grezzo prima di
   `volumeMisuratoDiLotto` che usa `rilievoUsabile` non `...ConData`) prima
   di decidere se è un quarto difetto vero o un caso già coperto.
3. Riverificare l'esito del terzo giro deep-pass su Campo quando arriva
   (agente adaf5869ccec0571f) e dell'agente di ricerca su Genesi
   (a5107061a0be8737f).
4. Mantenere ≥3 cantieri paralleli (attualmente 2: Campo QA, Genesi ricerca
   — dispatchare un terzo).

## Blocchi
Nessuno.
