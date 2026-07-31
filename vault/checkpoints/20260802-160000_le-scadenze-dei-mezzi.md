# Checkpoint — le scadenze di legge dei mezzi, e il censimento a fine giornata

- **Tipo**: unità (11 prove su Flotta)
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `7c8e59a`

## L'unità

Revisione alla Motorizzazione, verifica periodica dell'attrezzatura, funi e
catene, assicurazione. **Un mezzo che gira in cava con la verifica scaduta è la
stessa famiglia del lavoratore senza il corso**: un obbligo non rispettato che
l'app deve far vedere prima che lo veda un ispettore.

E qui il principio scritto oggi in `CLAUDE.md` era **già applicato bene**, ed è
quello che queste prove tengono: una scadenza **senza data** è **gialla**, non
verde, e nel conteggio sta insieme a quelle in scadenza. *«Non so quando scade
la revisione»* è un problema, non una tranquillità. Nell'elenco viene
addirittura **per prima**, prima delle scadute: di quella non si sa nemmeno
quanto tempo c'è.

Le altre: il **giorno stesso** della scadenza è rosso e non giallo (o si fa oggi
o domani il mezzo non circola); il conteggio dice quanti **mezzi** sono
coinvolti e non quante scadenze; un **anno digitato male** si ferma prima di
salvare, che è l'errore più frequente su un campo data; e i preset portano
accanto la **norma** che li giustifica, perché «ogni 12 mesi» detto senza dire
perché è una regola che nessuno può controllare.

Controprova: **8 difetti rimessi, 8 visti, 0 non visti.**

## Il censimento, a questo punto della giornata

```
                oggi      stamattina
sentinella      77/107      37/107
scudo           56/71       22/71
campo           39/73       26/73
flotta          36/71       29/71
terra           32/39       23/39
conti           35/58       35/58   ← l'unica non toccata oggi
```

Nessuna app è più sotto la metà. **Conti** è ora la meno coperta in proporzione,
ed è l'unica su cui oggi non ho lavorato.

## Stato

- **771** KPI (433 all'inizio della giornata) → **1054** prove `node`, verdi in
  UTC **e** in ora italiana
- **338 prove nuove** in giornata, **8 difetti di prodotto** trovati e corretti,
  **1 prova invecchiata** corretta, **3 prove rinforzate**

## Prossimo passo atomico

**Conti**, l'unica app non toccata oggi e adesso la meno coperta (35/58).
Restano scoperte, fra le altre, `clienteDiFattura`, `clientiDaCollegare`,
`densitaValida`, `prezzoPerTonnellata`, `SPESE_RECUPERO_231`. Il collegamento
fra una fattura e il suo cliente è il punto in cui i soldi trovano un nome: una
fattura attaccata al cliente sbagliato è un sollecito mandato a chi ha già
pagato.

## Bloccanti

- Nessuno.
