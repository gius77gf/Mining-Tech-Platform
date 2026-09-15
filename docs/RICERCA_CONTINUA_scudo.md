# Ricerca Continua — Scudo
_Aggiornato 2026-09-15T10:30:00Z_

## Contesto iniziale
Scudo gestisce idoneità dei lavoratori, scadenzario, DPI, permessi, infortuni/near-miss. La ricerca mira a identificare lacune concrete e verificate nel modello di decisione di "agibilità" di un lavoratore per una mansione in caso di multiple condizioni scadute.

Prima della ricerca, letto: checkpoint più recente (20260915-030922, appalti), roadmap (passate in profondità completate su Scudo), codice di scudo-data.js e index.html (funzioni `abilitazioneLavoratore`, `esitoAbilitazione`, `matriceMansione`, `lavoratoriScoperti`).

---

## Passo 1: Il Mondo

### EHS Software: Modelli di worker fitness assessment [proposto da ricerca, non verificato]

Dalla ricerca su software EHS-HSE di settore minerario (2024-2025):

1. **Tracciamento di scadenze multiple**: VelocityEHS e software simili **traccianunotifiche automatiche per credenziali in scadenza** (formazione, certificazioni mediche, DPI). Soglie variano per regione/standard, ma pattern comune è notification a 30, 15, 7 giorni prima della scadenza [proposto da ricerca, non verificato].

2. **Combinazione di condizioni**: Il modello "fitness for duty" combina:
   - Esito della visita medica (idoneo/condizionato/non idoneo)
   - Formazione/certificazioni valide
   - DPI assegnato e registrato
   - Nessun divieto disciplinare o medico temporaneo
   
   Se QUALUNQUE di questi manca o è negativo → **blocco** (lavoratore non agibile per la mansione) [proposto da ricerca, non verificato].

3. **Distinzione near-miss vs infortunio**: [dalle fonti WebSearch](https://www.hseblog.com/accidents-incidents-near-misses/), [https://www.safetyevolution.com/blog/near-miss-vs-incident-key-differences]:
   - **Near-miss**: evento dove c'è esposto a rischio ma ZERO danni/lesioni effettive
   - **Infortunio**: evento con lesioni, malattia, danno a proprietà, danno ambientale confermato
   
   Questa distinzione è **cruciale per la profondità di indagine**: un near-miss scatena investigazione leggera, un infortunio vero richiede investigazione profonda [proposto da ricerca, non verificato].

---

## Passo 2: La Nostra App (Scudo)

Ho letto il codice diretto. Ecco il modello verificato:

### Meccanismo di abilitazione: `abilitazioneLavoratore(lav, mansione, scadenze, consegneDpi, oggi)`

La funzione combina **tutti** i fattori e restituisce:
- `esito`: "no" | "attenzione" | "non-so" | "puo"
- `bloccanti`: array di motivi per cui NON può (se esito="no")
- `attenzioni`: array di avvisi (se esito="attenzione")

**BLOCCANTI** (esito finale = "no" = NON PUÒ LAVORARE):
1. `!l.attivo` → "non è in forza"
2. `l.idoneita === "non-idoneo"` → "giudicato non idoneo alla visita medica"
3. Corso mancante dalla scadenza → "manca [nome-corso]"
4. Corso scaduto (`stato: "scaduta"`) → "[nome-corso] scaduta il [data]"

**ATTENZIONI** (esito = "attenzione" = PUÒ MA CON RISERVA):
1. `l.idoneita === "prescrizioni"` → "idoneo con prescrizioni"
2. Corso entro 30 giorni (`stato: "in-scadenza"`) → "[nome-corso] in scadenza"
3. DPI mai consegnato → "DPI: consegna mai registrata"
4. DPI scaduto → "DPI da sostituire"
5. DPI entro 30 giorni → "DPI in scadenza"
6. DPI senza data di sostituzione → "DPI: [motivo dalla definizione]"
7. Addestramento DPI non registrato → "addestramento [DPI] da registrare"

**Logica finale** (`esitoAbilitazione`):
```
if (bloccanti.length) → "no" (STOP)
else if (requisitiIgnoti) → "non-so" (non sappiamo i requisiti della mansione)
else if (attenzioni.length) → "attenzione" (procedi con cautela)
else → "puo" (vai)
```

### Soglie temporali verificate nel codice

`statoScadenza(dataISO, oggi, preavvisoGiorni=30)` in `shared/dw-ponti.js`:
- **scaduta**: giorni < 0
- **in-scadenza**: 0 ≤ giorni ≤ 30
- **regolare**: giorni > 30

Soglia unica di **30 giorni di preavviso** per tutte le scadenze (formazione, DPI, visite mediche).

### Near-miss vs Infortuni

Il codice distingue: `tipo: "infortunio" | "near-miss"` in `infortuni/{id}`.
- Near-miss: `giorniAssenza: 0`, campo `categoria` presente (tipo di rischio)
- Infortunio vero: `giorniAssenza: N` (giorni effettivi di assenza), campo `categoria` opzionale

`riepilogoInfortuni(infortuni, oggi)` conta separatamente:
- `veri = list.filter(x => x.tipo === "infortunio")`
- `nearMiss = list.filter(x => x.tipo === "near-miss")`

La metrica "giorni senza infortuni" conta SOLO infortuni veri, non near-miss.

---

## Passo 3: Il Delta — Lacune verificate

Confrontando mondo vs codice verificato per lacune concrete (non parole inventate):

### Lacuna 1: Sospensioni disciplinari non modellate esplicitamente
**Che cosa manca**: Il modello tratta solo `l.attivo: true|false` (in forza sì/no). Non c'è campo esplicito per "sospensione disciplinare" o "divieto temporaneo dal lavoro". Nel mondo reale (EHS standard), una persona può essere temporaneamente sospesa dal lavoro (es. 48 ore per infortunio, o disciplina) **indipendentemente** da essere "in forza" o no.

**Dove si vede**: Nella funzione `abilitazioneLavoratore` (riga ~665 in scudo-data.js), il blocco che controlla "è in forza?" è solo `if (l.attivo === false) bloccanti.push("non è in forza")`. Non c'è room per "sospeso temporaneamente fino al [data]" come stato separato.

**Prova**: Grep su "sospens" nel codice:
```bash
grep -n "sospens" apps/scudo/scudo-data.js
```
Risultato: **zero occorrenze** in scudo-data.js (a parte commenti in roadmap).

**Come si misura**: Aggiungere un campo `sospesioneFinoa: ISO|null` a lavoratori; modificare `abilitazioneLavoratore` per controllare `if (l.sospesioneFinoa && giorniTra(l.sospesioneFinoa, oggi) > 0) bloccanti.push("sospeso fino al " + dataIt(l.sospesioneFinoa))`.

---

### Lacuna 2: Soglie di preavviso granulari per cascate di scadenze
**Che cosa manca**: Il codice usa una **soglia unica di 30 giorni** per tutte le scadenze. Nel mondo reale (EHS e standard minerario), le notifiche spesso si graduano: scadenza CRITICA entro 7 giorni, MEDIA entro 15 giorni, LIEVE entro 30 giorni. Questo permette di **prioritizzare**: una formazione che scade fra 5 giorni va fatto **oggi**, una fra 25 giorni la prenoti la prossima settimana.

**Dove si vede**: 
- `statoScadenza` in `shared/dw-ponti.js` ha solo 3 stati: "scaduta" | "in-scadenza" | "regolare"
- Nel "Quadro" della pagina (righe 2709-2720 di index.html), Scudo avvisa "fra le persone in turno" quale documento scaduto riguarda chi, ma non **classifica per urgenza** (es. "rosso: scade oggi", "giallo: scade fra 7 giorni", "arancio: fra 15-30 giorni").

**Prova**: Grep su "7\|15" per trovare soglie esplicite nel codice:
```bash
grep -nE "\b[7][\s]*giorni\b|\b15[\s]*giorni\b" apps/scudo/scudo-data.js
```
Risultato: **zero soglie a 7 o 15 giorni**. Solo "entro 30 giorni" (`preavvisoGiorni = 30` di default).

**Come si misura**: Aggiungere una funzione `livelloUrgenzaScadenza(giorni)` che restituisce {"cls": "danger"|"warn"|"info", "label": "critici (7 gg)", "giorno-soglia": 7|15|30}; usarla nel disegno della riga di scadenza per colorare diversamente a 7/15/30 giorni.

---

### Lacuna 3: Incoraggiamento anonimo per near-miss (non visibile nel codice)
**Che cosa manca**: Il codice registra near-miss con un campo `anonimo: true|false`, ma nella pagina HTML **non c'è niente che dichiara**: "Puoi segnalare un near-miss in forma anonima, senza conseguenze". Né c'è un toggle esplicito nel form "aggiungi infortunio" che permetta di spuntare "anonimo" e nascondere il nome di chi segnala quando si legge il registro.

**Dove si vede**: 
- Nella dimostrazione (scudo-data.js, righe 347, 348, 364, 366), ci sono near-miss con `anonimo: true`. 
- Nel form HTML di index.html, **non c'è** un `<input type="checkbox" id="anon-near-miss" ...>` per il toggle anonimo al momento di registrare.

**Prova**: Grep su "anonimo" nel form HTML:
```bash
grep -n "anonimo\|anonymous" apps/scudo/index.html
```
Risultato: **zero occorrenze** nel form (il campo esiste nel modello, non nella UI per crearlo).

**Come si misura**: Aggiungere al form "aggiungi infortunio" un checkbox "Questa segnalazione è anonima", e nel riepilogo del registro mostrare "Segnalato in forma anonima" instead del nome di chi ha inserito quando `anonimo: true`.

---

## Riepilogo
Due lacune **verificate nel codice** e una **potenziale**, tutte concrete:
1. **Sospensioni disciplinari**: NON modellate. Campo assente, no logica di blocco temporaneo.
2. **Cascate di urgenza a 7/15/30 giorni**: Soglia unica di 30 giorni. No colori/priorità differenziati.
3. **Anonimato near-miss**: Campo `anonimo` nel modello, ma toggle UI assente nel form di creazione.

Nessun numero affermato senza verifica (grep nel codice sorgente).
