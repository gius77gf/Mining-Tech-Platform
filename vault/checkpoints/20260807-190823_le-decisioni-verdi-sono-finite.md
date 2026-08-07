# Checkpoint — 2026-08-07 19:08:23 UTC

## Tipo
unit-complete (quattro unità: la fascia senza rete, la 10a misurata, la 12a coi
rilievi e con le pesate, la regola dei vuoti traslocata in `shared/`)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`2ab9535` — *Le pesate hanno la copia di sicurezza che rientra — e il prospetto
smette di farsi credere un backup*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 187 | **la fascia «senza rete»** (`030ad7d`) | **zero app su sei** se ne accorgevano; ora 30 asserzioni, controprova 12 KO |
| 188 | **decisione 10a misurata** (`e79af14`) | entitlement scritti da **zero** righe, `hasEntitlement` chiamata da **zero** app |
| 189 | **decisione 12a · rilievi di Terra** (`e203702`) | `run-kpi` 1860 → **1864** |
| 190 | **il «non c'è» scaduto del registro volate** (`9daa90d`) | le voci vere non sono cinque, sono **quattro** |
| 191 | **decisione 12a · pesate di Conti** (`2ab9535`) | 1864 → **1870**, copertura **693/693** |

## ⛔ Le decisioni verdi sono finite: da 19 aperte a 5
Sette prese **scrivendole**, cinque prese **E costruite** (5a, 10b, 12a, 18a,
18b), una presa e **dichiarata non costruibile con la misura** (10a). Restano
**cinque**: la **5b** (l'unica verde, e tocca l'isolamento fra clienti perché
mette una copia dei dati nel browser di un telefono di cantiere condiviso) più
le quattro che non tocco.

## ⛔ Tre costi scritti nei documenti erano più bassi del vero
E tutt'e tre li ha corretti la misura, non il ragionamento:
1. **15** — «(a) nel core è la strada più veloce»: lo è a parità di ponti, e il
   core ne ha **zero** mentre le app ne contano **sessanta**;
2. **10a** — «mezza giornata di lavoro sui claims»: misura la cosa sbagliata.
   Il lavoro non è la regola, è **chi scrive l'abbonamento** — e oggi non lo
   scrive nessuno, quindi la regola nascerebbe o cieca o decorativa;
3. **12a** — «sono sei unità»: due erano già fatte. Le vere sono **quattro**.

## ⏱️ E una riga era un «non c'è» SCADUTO, fermata prima del cantiere
Il registro volate di Sentinella ha **già** `csvRegistroVolate` e
`parseVolateCsv`, nello stesso file, cablati in pagina, col giro di andata e
ritorno provato. La riga del 31/07 non era sbagliata: il lavoro è arrivato
dopo. L'ha fermata la regola «per ogni non c'è si scrive la prova di aver
guardato», applicata a un documento **nostro** invece che a una ricerca.

## ⚠️ E due volte ha sbagliato il righello
- il banco della fascia usava `context.offline`, che blocca **tutta** la rete
  compreso il caricamento della pagina dal server del banco: dodici prove
  cadevano su un prodotto mai aperto;
- `leggiCsv` torna `{delim, righe}` e non un array.

## Stato delle prove
Prove **2.285** (`run-kpi` **1870**), copertura **693/693**, banchi **147**,
regole **68**, giro `node` **23 comandi, 0 caduti** verificato sulla copia a
ogni commit.

## Che cosa sta girando adesso
⛔ **Il giro completo, RILANCIATO alle 19:08** (`scratchpad/io-core/giro-5.txt`):
il primo, partito alle 17:55, è stato ucciso dal riavvio del contenitore a
undici sezioni. Questo gira su `2ab9535`, cioè su tutto il lavoro di stasera.

## Prossimo passo atomico
1. ⛔ **Raccogliere il giro** (`giro-5.txt`): leggere PRIMA le righe «non ho
   guardato», poi i KO, distinguendo le controprove — nel registro il rosso
   voluto e quello vero si scrivono uguali, ma le passate di controprova ora lo
   dichiarano nell'intestazione.
2. **Le tre voci che restano della 12a**: incassi, clienti, azioni correttive.
   La forma è quella già usata due volte (esportatore accanto al lettore, giro
   di andata e ritorno **più** un'asserzione sul testo del file).
3. ⛔ **Il tema che scala invece di fissare** — tre app riscrivono la stessa
   scala della barra sotto `outdoor-mode`. Cantiere su `shared/`, si serializza.

## Code aperte, dichiarate
- Le 21 prove delle Cloud Functions non girano in questo contenitore (il proxy
  blocca l'avvio dell'emulatore delle Functions). Le regole sì: 68 prove.
- `firestore.rules` è cambiato ma **non è pubblicato**: lo fa il fondatore.
- Il Quadro non è costruito: la 15 dice dove vive.
- Le altre dei checkpoint precedenti.

## Blocchi
Nessuno.
