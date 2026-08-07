# Checkpoint — 2026-08-07 19:33:06 UTC

## Tipo
unit-complete (tre unità: incassi, clienti e azioni correttive — la 12a chiusa)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`c6fc150` — *Le azioni correttive hanno la copia che rientra: la 12a è finita,
tutte e sei le voci*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 192 | **incassi di Conti** (`5e6082e`) | 1870 → **1874**, e il `fatturaId` che il prospetto perdeva |
| 193 | **clienti di Conti** (`7adeb51`) | 1874 → **1878**, e il difetto del `fido 0` corretto anche nel prospetto |
| 194 | **azioni correttive di Scudo** (`c6fc150`) | 1878 → **1883**, e i **sei** campi dell'origine |

## ⛔ La 12a è finita: sei voci su sei
Due erano già fatte — e una era una **riga scaduta** del documento (il registro
volate ce l'aveva già, e stava per aprirsi un cantiere su lavoro fatto).
Quattro costruite oggi: rilievi di Terra, pesate/DDT, incassi e clienti di
Conti, azioni correttive di Scudo.
Ogni volta la stessa forma, e va tenuta per le prossime: il file che rientra sta
**accanto al lettore** nel modulo dati, porta i **campi crudi con gli id**, e la
prova è il giro di andata e ritorno **più un'asserzione sul TESTO** — perché i
lettori usano `numIt`, che la virgola la legge, e senza quella il giro
tornerebbe verde su un file che solo la nostra app sa aprire.

## ⛔ E in due prospetti c'era un difetto vero, non solo una mancanza
- **clienti**: `+c.fido || 0` scriveva `0` dove nessuno aveva impostato niente.
  Su un fido è la faccia tranquilla su un numero che decide **se una consegna
  parte**: «fido 0» vuol dire *non gli si fa credito*, «non impostato» vuol dire
  *nessuno ci ha pensato*. Corretto anche nel prospetto, non solo nella copia;
- **clienti**: il file perdeva l'**id**, e fatture e pesate puntano al cliente
  con `clienteId` — ri-caricato, tutto restava orfano.

## ⚠️ E tre volte l'errore era mio, preso al primo giro
- `leggiCsv` torna `{delim, righe}`, non un array;
- `isIntestazione` guarda la **prima** colonna: passandogli il nome della
  seconda, la riga d'intestazione rientrava come un cliente di nome
  «ragioneSociale»;
- `csvCell` e `leggiCsv` non erano importati in Scudo.

## Stato delle prove
Prove **2.298** (`run-kpi` **1883**), copertura **702/702**, banchi **147**,
regole **68**, giro `node` **23 comandi, 0 caduti** verificato sulla copia a
ogni commit.

## Le decisioni: 19 aperte → 5
Sette prese **scrivendole**, cinque prese **E costruite** (5a, 10b, 12a con
tutte e sei le voci, 18a, 18b), una presa e dichiarata **non costruibile con la
misura** (10a). Restano la **5b** (tocca l'isolamento fra clienti) e le
**quattro** che non tocco.

## Che cosa sta girando adesso
⛔ **Il giro completo**, partito alle 19:08 su `2ab9535`
(`scratchpad/io-core/giro-5.txt`), a otto sezioni.
⚠️ **Gira su un commit vecchio di quattro**: quello che dirà NON copre incassi,
clienti, azioni correttive né il difetto del fido. Va letto sapendolo, e i
banchi nuovi vanno provati a parte o in un giro successivo.

## Prossimo passo atomico
1. ⛔ **Raccogliere il giro** quando finisce: leggere PRIMA le righe «non ho
   guardato», poi i KO, distinguendo le controprove (l'intestazione ora lo
   dichiara). Poi decidere se rilanciarlo sul commit corrente.
2. ⛔ **Il tema che scala invece di fissare** — tre app hanno dovuto riscriversi
   la stessa scala della barra sotto `outdoor-mode`, che è il segno che il
   disegno condiviso chiede la cosa sbagliata. Cantiere su `shared/`, si
   serializza.
3. **Il Quadro nel core** (decisione 15), che vuole i sei ponti — e quei sei
   ponti vanno scritti **uno solo**, con l'`appId` come argomento.

## Code aperte, dichiarate
- Le 21 prove delle Cloud Functions non girano in questo contenitore.
- `firestore.rules` è cambiato ma **non è pubblicato**: lo fa il fondatore.
- Le altre dei checkpoint precedenti.

## Blocchi
Nessuno.
