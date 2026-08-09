# Checkpoint — 2026-08-09T11:20:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`52e7b7c`

## Task completato

**Cercata la stessa svista del `NaN` negli altri lettori della `MAPPA` — e ce
n'era una, nella veste che non si vede.**

| chi legge | come | esito |
|---|---|---|
| `datateNelFuturo` | `String(q).slice(0,10)` | ✅ esplicito, giusto |
| `oreNelFuturo` / `DALL_ORA` | `Date.parse` sui due | ✅ esplicito, giusto |
| ordinamento `perData` | confronto fra due timestamp dello stesso formato | ✅ |
| **il confine `DAL`** | **`g >= DAL`** | ⛔ **funzionava per caso** |

## La cosa imparata

⛔ **UN CONFRONTO CHE FUNZIONA PER CASO È UN CONFRONTO CHE IL PROSSIMO CAMBIO
DI FORMATO ROMPE IN SILENZIO.** `DAL` è un **giorno** e la `MAPPA` da stamattina
porta **timestamp interi**: `g >= DAL` dava la risposta giusta perché
«2026-08-01T09:…» viene dopo «2026-08-01» anche per **ordine alfabetico** — cioè
per l'ordine dei **prefissi**, non perché qualcuno l'avesse deciso.

⚠️ È **la stessa svista del `NaN` di un'ora fa**, con la fortuna al contrario:
lo stesso mescolare date e timestamp, e nello stesso file. Là ha prodotto tre
lettere in mezzo a una frase; qui non ha prodotto niente. **La versione che non
si vede è quella che va cercata dopo aver corretto quella che si vede** — se ci
fossi fermato al `NaN` avrei chiuso il caso credendo di aver chiuso la famiglia.

⚠️ E il modo di renderlo non-accidentale non è irrigidire il confronto: è
**pinnare il confine**. La mezzanotte esatta di `DAL` deve stare fra i *nuovi*
— se finisse nel lascito, un checkpoint scritto quel giorno sarebbe **scusato**
invece che sorvegliato — l'ultimo minuto di quel giorno pure, il giorno prima
no. Più il denominatore: `daOggi + lascito` deve fare **954**, se no una delle
due popolazioni perde file senza dirlo.

## Verifiche
- `date-checkpoint` **8 passati, 0 falliti** (era 6 stamattina)
- il diagnostico ha **cambiato unità da solo** mentre lavoravo: «56 minuti»
  un'ora fa, **«1h02»** adesso — la prova che l'unità è scelta e non fissa
- `giro-node` **34 comandi a posto, 0 caduti** sulla copia del committato

## Il giro del browser
Vivo dalle **06:56:09Z** (~4h24), su `terra-frasi-da-uno.mjs`. Registro 531 KB.

## Cantieri paralleli aperti
Flotta, Campo, Sentinella — nessuno committa; al rientro si **rimisura** tutto
prima di scriverlo.

## Prossimo passo atomico
⛔ **Il giro, appena finisce, ha la precedenza**: `leggi-giro.mjs` nell'ordine
**età → righe «non ho guardato» → KO veri**; nessun KO diventa cantiere prima
di essere riprodotto **con la sua passata** e **con l'iniezione viva**.
Se non è ancora finito: raccogliere i tre cantieri man mano che rientrano,
rimisurare, committare io.

## Blocchi
Nessuno di tecnico. In attesa del fondatore: le **7 tendine tagliate**
(Scudo 5 + Sentinella 2), **`#vf-ente`** (termine dell'art. 71 c.11), e la
scelta di **quali** delle 47 mancanze confermate diventino lavoro.
