# La struttura del core è scritta sei volte

*Misurato il 02/08. La direttiva del fondatore dice che le app copiano
l'impianto del core «pelo per pelo, senza cambiare una virgola». Oggi quella
copia esiste **sei volte**, e una si è già staccata.*

## Il fatto, misurato

Ogni app verticale ha un blocco `<script>` classico che porta la **struttura**
del core: la navigazione fra le pagine, il **toast**, la **modale** che
sostituisce `alert()` e `confirm()`, la conferma, la richiesta di un valore, la
chiusura con Escape o toccando fuori, i riquadri raggiungibili da tastiera e
l'**alone che segue il mouse**.

| app | righe del blocco |
|---|---|
| Sentinella | 89 |
| Conti | 105 |
| Terra | 106 |
| Scudo | 111 |
| Campo | 112 |
| Flotta | 141 |

**Il 76% delle righe è identico in tutte e sei.** Non «simile»: identico,
carattere per carattere.

E funzione per funzione:

| funzione | copie | versioni diverse | caratteri per copia |
|---|---|---|---|
| `toast` | 6 | 1 | 286 |
| `chiudiModale` | 6 | 1 | 251 |
| `chiedi` | 6 | 1 | 312 |
| `chiediValore` | 3 | 1 | 586 |
| **`apriModale`** | 6 | **2** | 868 / **929** |

In tutto: **27 copie**, circa **12.100 caratteri** di codice duplicato.

## E una si è già staccata

`apriModale` in **Scudo** prende un quarto parametro che le altre cinque non
hanno:

```js
function apriModale(titolo, corpo, bottoni, opzioni)
// opzioni.autofocus === false: la modale NON porta il fuoco nel primo campo.
```

E la ragione, scritta lì accanto, **è buona**: serve alla segnalazione rapida
del near-miss, che si compila a tocchi — far salire la tastiera del telefono
davanti ai pulsanti sarebbe un dispetto.

Questo è il punto. **Non è successo per sciatteria: è successo perché serviva.**
Un'app ha avuto bisogno di una cosa in più, l'ha aggiunta nella sua copia, e le
altre cinque non l'hanno saputo. Domani un'altra ne avrà bisogno di un'altra, e
la distanza cresce di un pezzo alla volta senza che nessuno decida niente.

È lo stesso difetto che oggi è stato chiuso tre volte sui **dati**
(`messaggioNumero`, `dataPiuGiorni`, `giorni`) — qui è sulla **struttura**, che
è proprio la cosa che la direttiva vuole identica.

## Cosa NON è duplicato, ed è giusto

Il **CSS** no: toast, modale, stato vuoto e alone stanno in
`shared/dw-app-ui.css`, una volta sola. *(Verificato: la prima passata di questa
misura guardava solo `dw-app-shell.css` e `deepwork-style.css` e concludeva che
mancasse tutto — era il controllo a guardare nel posto sbagliato, non il codice
a essere sbagliato.)*

E il 24% di righe proprie di ogni app è in buona parte **legittimo**: il
selettore dell'alone cambia perché cambiano i componenti (`.segnala` c'è solo
in Scudo).

## La correzione — ✅ FATTA il 02/08

Un modulo condiviso — `shared/dw-app-ui.js` — caricato come script classico
esattamente come `dw-tema.js` e `dw-grafici.js` fanno già, con dentro le cinque
funzioni **in una versione sola**: quella di Scudo, che è un **soprainsieme**
compatibile (il quarto parametro è facoltativo, e chi non lo passa ha il
comportamento di prima).

Ogni app smette di ridefinirle e usa quelle. Il selettore dell'alone resta un
parametro, perché quello **deve** poter cambiare.

Come si verifica che non cambia niente: per ogni app, aprire la pagina in
Chromium e provare **il toast** (compare, sparisce), **la modale** (si apre, il
fuoco va dove deve, Escape la chiude, il tocco fuori la chiude) e **l'alone**.
Con lo screenshot prima e dopo.

---

## Fatto

`shared/dw-app-ui.js` esiste e tutte e sei le app lo usano: **28.865
caratteri** di codice duplicato tolti dalle pagine. Nella versione condivisa è
entrato il **soprainsieme**, cioè il quarto parametro di Scudo — che adesso
ce l'hanno tutte invece di una sola.

**Un errore fatto e corretto, che vale la pena tenere.** La prima passata sulle
cinque app ha infilato la chiamata d'aggancio *dentro un import multilinea*, e
tutte e cinque hanno smesso di funzionare. L'ha trovato il banco in mezzo
secondo, e per il motivo giusto: **prova la modale invece di guardare se la
pagina si apre**. Il risultato diceva `toast:true, modale:true` ma
**`chiusa:false`** — Escape non chiudeva più niente. Un banco che avesse
guardato solo il caricamento avrebbe risposto «tutto a posto» su cinque pagine
rotte.

---

## La seconda metà: anche la navigazione si è staccata

*Misurato subito dopo, con la stessa domanda.*

Nel blocco classico di ogni app resta la funzione `go(id)`, che cambia pagina.
Esiste in **sei copie** e ha **due versioni**:

- cinque app (331 caratteri) fanno
  `document.getElementById("page-" + id).classList.add("active")` — **senza
  guardia**. Se quella pagina non esiste, la riga **solleva un errore** e la
  navigazione si ferma lì: schermo fermo, nessun messaggio;
- **Flotta** (431 caratteri) ha le guardie (`if (pag)`, `if (nav)`) **e** una
  mappa: la scheda del mezzo e l'ordine di lavoro non hanno una voce loro nella
  pillola di navigazione — che resta di sei voci, come dev'essere — e allora
  tengono acceso il segnalibro del *padre* (parco mezzi, officina).

Di nuovo, come per `apriModale`: la versione che si è staccata è **la
migliore**, e si è staccata **perché serviva**. Le altre cinque non l'hanno
saputo, e si portano dietro una **trappola dormiente** — `go()` con un id che
non esiste ferma la navigazione senza dire niente.

La forma condivisa è quindi ancora una volta il **soprainsieme**: le guardie di
Flotta per tutti, e la mappa come parametro facoltativo, perché *quella* è di
Flotta e deve restare sua.

---

## La terza metà: le sei app non erano sei

*Misurato il 03/08, scrivendo la regola che impedisce alla duplicazione di
tornare.*

Il conto «sei copie» era giusto per le **app verticali**, ma le superfici che
aprono una modale sono **nove**. Le altre tre non erano state guardate:

| superficie | che cosa ha in casa | è un problema? |
|---|---|---|
| **core** (radice) | `toast` con una durata che dipende dal modo «all'aperto» (`DB.settings.outdoor`: 4 secondi invece di 2,5, perché al sole si legge più piano) | **no**: il core è l'originale, il file condiviso è stato estratto da lì |
| **Deepwork ID · amministrazione** | `apriModale` a tre parametri, `chiudiModale`, `chiedi` scritta come freccia | **sì, ed è il caso facile**: è esattamente la forma che il condiviso accetta già |
| **Genesi** | `toast` senza il tipo, `chiedi`, `chiediValore` | **sì, ed è il caso difficile** |

### Perché Genesi è il caso difficile

Due divergenze, e la seconda è una **trappola vera**:

1. **gli id sono altri.** Il condiviso cerca `modal`, `modal-body`,
   `modal-foot`, `modal-campo`; Genesi ha `mdl`, `mdl-body`, `mdl-foot`,
   `mdl-campo`, e le sue funzioni si chiamano `mdlApri` / `mdlChiudi`. Passare
   al condiviso vuol dire rinominare nel markup, non solo togliere tre
   funzioni;
2. **`chiediValore` ha il terzo parametro incompatibile.**

   ```js
   // condiviso  (e le sei app)
   chiediValore(titolo, corpo, campoHtml, etichettaOk)
   // Genesi
   chiediValore(titolo, corpo, valore, etichettaOk)   // ← un VALORE, e il campo se lo costruisce da sé
   ```

   Stesso nome, stesso numero di parametri, **significato diverso**. Se un
   giorno qualcuno caricasse `dw-app-ui.js` in Genesi «per allinearla», la
   chiamata — una sola, riga 3875, quella che dà il nome a una volata prima di
   salvarla — continuerebbe a compilare e comincerebbe a passare il **nome
   proposto** dove ci va l'HTML del campo. Nessun errore: il campo comparirebbe
   vuoto, e chi salva si ritroverebbe la volata senza nome che aveva appena
   letto nel riquadro.

   *(Il conto è piccolo apposta: `chiediValore` la usa **un punto solo**,
   `chiedi` un punto solo, `toast` cinquantasette. Il numero non c'entra —
   quello che rende questa divergenza peggiore delle altre è che **non si
   vede**.)*

   È il difetto peggiore della famiglia — non due copie che **divergono**, ma
   due copie che **si somigliano abbastanza da scambiarsi di posto**.

### La regola che tiene il conto

Da oggi l'elenco è scritto in `run-stile.mjs` (**regola 17**) con la ragione di
ognuno, e non è un permesso: se una superficie nuova si scrive la struttura in
casa il controllo **fallisce**; se una di queste tre passa al condiviso, il
controllo dice che l'elenco va accorciato. La stessa forma del `FONDO` del
censimento delle funzioni: un numero che può solo migliorare, e che nessuno
deve ricordarsi di guardare.

E controlla anche il verso opposto, che è l'errore già fatto una volta: chi
**usa** toast e modale deve averle da qualche parte. Togliere le funzioni
locali scordando il `<script>` non è un errore di sintassi — la pagina si apre,
sembra a posto, e muore al primo tocco.
