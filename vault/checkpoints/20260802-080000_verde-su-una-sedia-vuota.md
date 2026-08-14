# Checkpoint — un ruolo obbligatorio era verde su una sedia vuota

- **Tipo**: unità (**settimo difetto di prodotto** della giornata) + 8 prove
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `9c2d0be`

## Il difetto

Sta nell'app della **sicurezza**, e su **otto ruoli che la legge impone**:
sorvegliante, direttore responsabile, preposto, RSPP, medico competente, RLS,
addetto al primo soccorso, addetto antincendio.

`organigrammaSicurezza` contava soltanto **quante nomine c'erano**, senza
guardare se la persona esistesse ancora. Misurato:

```
persona cancellata dall'anagrafica   stato: ok   → nelle urgenze: no
persona non più in forza             stato: ok   → nelle urgenze: no
persona in forza                     stato: ok   → nelle urgenze: no
```

Le prime due righe sono il difetto: una nomina che punta a un lavoratore
**cancellato**, o a chi ha **lasciato l'azienda**, faceva risultare il ruolo
**coperto**. Verde, su una sedia vuota, su un obbligo di legge — ed è fra le
prime cose che un ispettore chiede.

La parte che dice quanto era silenzioso: la pagina aveva **già** la frase
«persona non più in anagrafica», scritta apposta per questo caso. Non la
mostrava mai, perché il ruolo non arrivava nemmeno alle urgenze del quadro. Il
codice per dire la verità c'era; mancava il pezzo che decideva di dirla.

## La correzione

Una nomina copre il ruolo solo se la persona **c'è ancora ed è in forza**. La
nomina resta comunque nell'elenco — si deve poter capire **chi era** — e la
pagina dice la ragione esatta: *«la persona nominata non è più in forza»*, col
badge **«Da rinominare»** invece di «Da nominare», che manderebbe a cercare una
nomina che c'è già.

Due prove nate rosse, otto in tutto. Controprova: **6 difetti rimessi, 6 visti,
0 non visti**, compreso quello che distingue «esiste in anagrafica» da «è in
forza» — due cose diverse che una correzione frettolosa avrebbe fuso.

## Le altre regole bloccate nella stessa unità

- Una nomina è **attiva** solo se è già decorsa e non è ancora finita; il giorno
  in cui comincia e quello in cui finisce **contano**.
- Nominato **senza la formazione richiesta** è rosso: il preposto ha un corso
  obbligatorio con aggiornamento biennale, e averlo nominato senza il corso è
  una nomina che non regge.
- Un ruolo **non obbligatorio** senza nessuno **non è un allarme**: il dirigente
  delegato può non esserci, e un rosso lì insegnerebbe a ignorare i rossi.

## Stato

- **690** KPI (433 all'inizio della giornata) → **973** prove `node`, verdi in
  UTC **e** in ora italiana
- **257 prove nuove** in giornata, **7 difetti di prodotto** trovati e corretti
- Scudo: da **22/71** a **45/71** funzioni coperte

## Prossimo passo atomico

Restano scoperti in Scudo i gruppi delle **ispezioni**
(`nuovaIspezioneDaModello`, `vociNonConformi`, `statoIspezione`,
`riepilogoIspezioni`) e dei **DPI** (`allarmiDpi`, `riepilogoDpi`,
`verbaleDpi`, `ultimaConsegnaDpi`, `statoConsegnaDpi`). Gli allarmi DPI sono la
lista di chi è scoperto: stessa famiglia del difetto appena corretto — un elenco
di consegne che non dice chi manca non serve a niente.

## Bloccanti

- Nessuno.
