# Checkpoint — due schede su nove facevano la stessa promessa

- **Tipo**: difetto di posizionamento trovato leggendo la vetrina come la
  leggerebbe un cliente
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `61e90a4`

## Cosa c'era

La scheda di **Deepwork** diceva: *«il rapportino non passa più dalla carta né
dal messaggio la sera tardi»*. Quella di **Campo**, tre riquadri più su: *«il
turno si chiude dove è successo, non a memoria la sera»*.

Stessa promessa, due volte, nella stessa pagina. Chi guarda si chiede **quale
delle due comprare** — ed è la domanda peggiore da lasciare aperta su una pagina
di vendita, perché non ha una risposta buona: qualunque cosa risponda il
venditore, il cliente ha già capito che due dei nove prodotti si sovrappongono.

Non l'ha trovata un banco: è venuta fuori leggendo le nove schede di fila, una
dopo l'altra, come le legge chi arriva. È lo stesso metodo degli screenshot —
guardare il risultato invece del codice — applicato ai testi.

## Cosa si è fatto, e cosa si è evitato di fare

La scheda del core adesso dice quello che il core **contiene davvero**: volate,
cave, mezzi, deposito, personale, clienti, documenti dell'ufficio. Non è
un'interpretazione — si controlla aprendo le sue schermate (`screen-volate`,
`screen-cave`, `screen-macchine`, `screen-deposito`, `screen-personale`,
`screen-clienti`, `screen-ufficio`).

⛔ **Di proposito non ci si è messa la divisione «diario / tavolo da disegno»**
proposta in `docs/PERCHE_DEEPWORK_E_GENESI.md`. Quella è una decisione di
prodotto che aspetta il fondatore, e una pagina di vendita non è il posto dove
darla per presa: sarebbe stato comodo — la frase è pronta e funziona — ed è
proprio per questo che valeva la pena non farlo. La sovrapposizione si è tolta
descrivendo un **fatto**, senza pronunciarsi sulla domanda aperta.

## Lo stato delle prove a fine giornata

| Suite | Prove |
|---|---|
| KPI app | 345 |
| Stile | 128 |
| Helper | 43 |
| Point cloud | 23 |
| Manifest | 9 |
| Demo | 7 |
| **Totale con `node`** | **555** |
| Regole di sicurezza (emulatore) | 58 |
| Banchi del browser | 11, tutti con controprova |

## Prossimo passo atomico

Rileggere **le altre sette schede** con lo stesso metodo — una dopo l'altra, come
le legge chi arriva — cercando altre promesse che si somigliano. Il sospetto sta
fra **Terra** e **Conti** (tutte e due parlano di quello che esce dalla cava, una
in metri cubi e l'altra in euro) e fra **Scudo** e **Sentinella** (tutte e due
parlano di adempimenti verso un ente). Non è detto che ci sia un difetto: è detto
che nessuno ha ancora guardato.

## Bloccanti

- Nessuno.
