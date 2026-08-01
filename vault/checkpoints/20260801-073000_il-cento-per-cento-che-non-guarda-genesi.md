# Il 100% che non guarda Genesi

**Data:** 01/08/2026 · **Area:** censimento della copertura + documenti
**Unità precedente:** `20260801-071500_le-controprove-dichiarate-rilanciate.md`

## Come è saltato fuori

Il censimento del principio di stanotte ha coperto **sei app**. Andando a
cercare la settima — Genesi, che è l'app dove un numero tranquillo pesa di più,
perché calcola **previsioni di vibrazione** — è saltato fuori che non c'era
niente da censire con quel metodo:

**Genesi non ha un modulo dati.** Le altre sei hanno
`apps/<nome>/<nome>-data.js`, che `node` importa e le suite provano. Genesi ha
**192 funzioni dentro `apps/genesi/genesi.html`**, e da lì non si importano. Di
Genesi entra nel conto **solo `pointcloud.js`**, cioè 5 funzioni.

Misurato, non ricordato:

| app | modulo dati | funzioni nella pagina |
|---|---|---|
| campo, conti, flotta, scudo, sentinella, terra | ✅ | 11–28 (solo disegno) |
| **genesi** | **❌** | **192** |

## ⛔ Perché è un problema di CONTROLLO, non solo di struttura

`copertura-funzioni.mjs` stampa **«456 funzioni coperte su 456, 100%»**, e i
documenti lo riportano. È **vero** — per il perimetro che guarda. Ma un «100%»
si legge *«tutto il prodotto è provato»*, e non lo è.

È la forma esatta del difetto che questo file ha già raccolto una volta: il
fondo che «prometteva di vedere un caso che non vedeva», e la scansione che
rispondeva «nessuna violazione» su un perimetro più stretto del suo nome. Un
numero rassicurante ottenuto guardando altrove.

## La correzione, e quello che NON è

**Non** ho tirato fuori un `genesi-data.js`: è un cantiere intero, tocca 192
funzioni della app più delicata, e farlo in coda a un'altra unità sarebbe
esattamente il modo di romperlo.

Ho fatto **dichiarare il buco al censimento stesso**, in fondo alla sua uscita
e nella riga di riepilogo:

> ⛔ Fuori dal conto, e va detto: **Genesi non ha un modulo dati**. Le sue **192**
> funzioni stanno dentro genesi.html, che node non importa: di Genesi qui entra
> solo pointcloud.js (5).
> Quindi il 100% qui sopra vale per il perimetro misurato, non per tutto il
> prodotto.

E la stessa cosa nei due documenti che il fondatore legge
(`DEVELOPMENT.md`, `STATO_PRODOTTO.md`), dove il «100%» stava da solo.

Il conto delle 192 è **misurato dal file**, non scritto a mano: il giorno in cui
le funzioni di Genesi diventassero importabili, quella riga lo direbbe da sé.

## ⚠️ E il primo tentativo ha stampato «?»

Avevo scritto `root` invece di `RADICE`, la lettura è fallita e il `catch` ha
restituito `null` → si è letto **«Le sue ? funzioni»**.

Il `?` è voluto, ed è la parte da tenere: se il ripiego fosse stato uno **zero**,
la riga avrebbe detto *«Genesi non ha funzioni fuori dal conto»* — cioè la
risposta più tranquilla possibile, prodotta da un errore, in un blocco scritto
apposta per non farlo. Lo stesso principio di stanotte, applicato al controllo
che lo descrive.

## Verifica

`copertura-funzioni` 9 soggetti a posto, 0 senza prova, e la riga nuova legge
**192**; `numeri-nei-documenti` **17/17** — cioè il parser che legge l'uscita del
censimento non si è rotto per l'aggiunta; `run-kpi` 1108/0, `run-stile` 271/0,
`run-demo` 8/0, `run-helpers` 49/0, sonda del vuoto 7/0. Tutte con
`TZ=Europe/Rome`.

## Prossimo passo atomico

Proporre al fondatore, con la misura in mano, **l'estrazione di
`apps/genesi/genesi-data.js`**: quali delle 192 funzioni sono pure (calcolo di
carica, legge di sito, powder factor) e quali toccano la scena 3D e devono
restare. È il cantiere che rende provabile l'app che decide quanto esplosivo
mettere in un foro — e finché non si fa, il «100%» va letto con la riga che
adesso lo accompagna.
