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
