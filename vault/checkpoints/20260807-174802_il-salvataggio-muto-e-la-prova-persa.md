# Checkpoint — 2026-08-07 17:48:02 UTC

## Tipo
unit-complete (tre unità: la prova della verifica periodica riscritta, la
decisione 5a costruita, il contrasto di Scudo nei tre temi)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`675ad65` — *Decisione 5a segnata come presa E costruita: la porta scende da 12 a 11*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 180 | **la prova della verifica periodica, riscritta** (`f81d127`) | **21 passate**, controprova 7 KO con 3 iniezioni su 3 |
| 181 | **decisione 5a costruita** (`7390849`) | **103 punti su 109** erano muti; ora 6 app su 6 avvisano |
| 182 | **il contrasto di Scudo nei tre temi** | **612 e 613 testi**, 0 sotto soglia (era misurato solo al buio) |

## ⛔ La prova che viveva nello scratchpad non esiste più
Il checkpoint di due unità fa la dichiarava come coda: «21 prove, vive in
scratchpad, va portata in `tests/browser/` — alla sessione dopo, non esiste».
Il contenitore è ripartito e **non esiste più**. Riscritta da zero e registrata
in `tutti.mjs` **nello stesso commit**: un banco non registrato è un banco che
non gira, cioè la stessa cosa.

## ⛔ Il numero che ha reso urgente la 5a: 103 su 109
Nelle sei app ci sono **109 punti** che scrivono sul database e **103 non hanno
nessun `catch`**. Oggi, se una scrittura viene rifiutata, la finestra resta
aperta, nessun toast compare, e chi ha premuto Salva non sa se il dato è
entrato. Dal 02/08 le regole del Firebase pubblico dicono `if false`, quindi è
il caso **frequente**.
La correzione non sono 103 `try/catch` — sarebbero 103 occasioni di scriverne
uno diverso. È **una riga per app**, sul fabbricante delle scritture, e
l'errore viene rilanciato a chi lo sa gestire.

## ⚠️ Quattro volte ha sbagliato il righello, non il prodotto
1. il bottone dell'export cercato **per prosa** (in Scudo ce ne sono quattro
   con lo stesso testo): il banco rispondeva «nessun file»;
2. la pastiglia letta con `.badge`: nella riga ce ne sono **due**, e la prima è
   l'etichetta «all. VII» — tre KO su tre **identici**, che è il modo in cui si
   riconosce di stare guardando il righello;
3. il confronto per **sottostringa**: col difetto rimesso il CSV scriveva
   `prescrizioni` e la prova passava, perché quella parola sta dentro il badge.
   Corretti i **DATI** (la scadenza delle prescrizioni ora è scaduta, così il
   badge dice «Prescrizioni scadute»), non l'asserzione;
4. la trappola dei test asincroni, **due volte in due minuti**: un
   `inVolo.push(...)` che in `run-helpers.mjs` non esiste, e una promessa
   restituita dal corpo di un `test()` sincrono. Gli `await` stanno fuori.

⚠️ E una quinta, di conio mio: i backtick di un commento **dentro** un template
literal chiudono la stringa. La regola è in CLAUDE.md dal 07/08 e l'ho rifatta
lo stesso giorno.

## Stato delle prove
Prove **2.268** nelle sei suite sorvegliate (`run-helpers` 63 → **71**), giro
`node` **23 comandi, 0 caduti** verificato sulla copia a ogni commit, banchi
**141 → 145**, copertura **688/688**.

## Le decisioni: 7 prese scrivendole, 1 presa E costruita, 7 aperte
La porta d'ingresso è scesa da 19 a **11**. La tabella tiene separate «presa» e
«costruita» di proposito: spuntare una risposta invece di un lavoro sarebbe la
faccia tranquilla su un lavoro non fatto.

## Che cosa sta girando adesso
Niente. L'albero è pulito.

## Prossimo passo atomico
1. **Il giro completo dei banchi**, che non è stato rifatto da quattro commit:
   le passate nuove (barra × 3 temi, verifica periodica, salvataggio muto) sono
   state provate **a mano una per una** sulla copia, ma il giro intero no.
   ⚠️ Si lancia DOPO un commit e su una copia, e prima si guarda **chi tiene la
   porta**, non solo se è occupata.
2. **Le sette decisioni verdi che restano**, in ordine di quanto costa
   sbagliarle: **10b** (chi può cancellare — resa urgente dalla 10c presa
   oggi), **15** (dove vive «Il Quadro»), **12a** (export ri-caricabile),
   **18a/18b**, **10a**, **5b** (dove la prima unità è la **misura**: che cosa
   succede a due persone che scrivono la stessa riga).
3. ⛔ **Il tema che scala invece di fissare**: tre app hanno dovuto riscriversi
   la scala della barra sotto `outdoor-mode`. Cantiere su `shared/`, si
   serializza.

## Code aperte, dichiarate
- `salvataggio-muto.mjs` misura il rifiuto **immediato** (`permission-denied`).
  La rete che manca è un difetto diverso — la scrittura resta **appesa** invece
  di rifiutare — ed è misurato solo su Flotta da `salvataggio-offline.mjs`.
- Le altre dei checkpoint precedenti.

## Blocchi
Nessuno.
