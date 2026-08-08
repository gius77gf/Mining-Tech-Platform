# Checkpoint — Genesi 9/9: il giro delle otto superfici è chiuso

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Task completato
**Chiusi gli ultimi tre documenti di Genesi, e con loro il giro su tutte e otto
le superfici.** Tutti e tre puliti, e ognuno porta la cicatrice della famiglia:

- **`genesi_scheda_volata.csv`** — `null` esce come cella **vuota**, non come la
  parola «null», e il commento sopra racconta perché capitava: *«le righe si
  univano con `+`, che di `null` fa la parola»*. Le celle passano da `csvCell`
  perché è un file che si apre in Excel a casa del cliente.
- **`genesi_legge_di_sito.csv`** — `csvCell` con l'apostrofo di guardia, e
  `_sitoParseCsv`, che rilegge **questo stesso file**, lo toglie passando da
  `leggiCsv`: il giro di andata e ritorno è dichiarato chiuso. In più la
  colonna **`origine`** esce insieme ai numeri, *«così un file riletto non
  perde la provenienza dei referti»*.
- **`genesi_volata_per_sentinella_<data>.csv`** (il ponte) — `_sentNum` e
  `_sentCell`, e la cosa migliore delle tre: le colonne «provvisoria» e
  «referti» restano **vuote** quando la previsione non viene da una legge di
  sito, con la ragione scritta: *«lì la domanda "su quanti referti" non ha
  senso, e una cella vuota è la risposta onesta»*.

## Il giro completo — «chi decide i numeri di ciò che ESCE?»

| superficie | aperti | difetti |
|---|---|---|
| core | 2/2 | **1** |
| Flotta | 9/9 | **4** |
| Conti | 3/12 | **3** |
| Campo | 6/6 | 0 |
| Sentinella | 5/5 | 0 |
| Terra | 3/3 | 0 |
| Scudo | 5/5 | 0 |
| Genesi | 9/9 | 0 |

**42 punti d'uscita su 51 guardati, otto difetti veri, tutti corretti.**
Restano i **nove** di Conti non ancora aperti (clienti, pesate/DDT, preventivi,
gare, listino, situazione fatture e le copie di backup): il censimento
strutturale dice che sei di loro delegano al modulo, ma è **struttura, non
misura**.

## Che cosa dice il risultato, onestamente
Le app **verticali mature** (Campo, Sentinella, Terra, Scudo, Genesi) sono
pulite, e non per caso: ogni loro documento porta un commento che racconta un
difetto di questa stessa famiglia già pagato e chiuso. Il metodo funziona ed è
già stato applicato lì.
I difetti sono usciti dove il metodo **non era ancora arrivato**: il core (che
nessun banco apriva sui file), Flotta (nove documenti e nessun banco che ne
aprisse uno) e Conti (dodici documenti, il numero più alto). E in tutti e tre i
casi la forma è la stessa: **una correzione fatta a un export e non all'altro**,
con la versione giusta a poche righe di distanza nello stesso file.

## Prossimo passo atomico
**I nove documenti di Conti non ancora aperti**, col banco
`conti-documenti-che-escono.mjs` già pronto da estendere. L'ordine per peso:
`conti_pesate_ddt.csv` (letto: risultato **curato**, legge la bandiera con
`valoreDdt`), `conti_preventivi.csv`, `conti_gare.csv`, poi le copie di backup.
⚠️ Le tre lezioni dei banchi di oggi, da riusare: ancora d'iniezione **corta**;
**terzo testimone** nel confronto file↔schermo; `URL.revokeObjectURL` reso
inerte se l'export revoca il blob subito dopo il click.
E poi la **domanda aperta** che non ho chiuso di slancio: una voce di costo
senza importo sparisce dal riepilogo e dal file **in silenzio**.

## Blocchi
Nessuno.

## Note
Il giro del browser (pid 21084) è vivo da circa tre ore. Va letto con
`leggi-giro.mjs` dalla **sezione 0**: stasera il branch è andato avanti di
tredici commit, quindi i suoi KO sono vecchi di tredici commit e non di adesso.
