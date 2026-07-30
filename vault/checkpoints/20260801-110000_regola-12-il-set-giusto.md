# Checkpoint — la regola 12 guarda il Set giusto, e si prova sui file veri

- **Tipo**: unità (irrigidimento + controprova sui file veri)
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `544e52d`

## Perché proprio questa regola

Perché il suo filtro è **già caduto una volta**, il 31/07: cercava la forma
`.some(` e non vedeva i gestori scritti col `Set` — cioè proprio i quattro che
facevano la cosa giusta. Una regola che ha già sbagliato a guardare merita più
diffidenza delle altre.

## Le due cose entrate

**1. L'`add` deve stare sul Set giusto.** La forma col Set era riconosciuta come
`\w+\.add\(`, che è soddisfatto anche da `classList.add(` — una cosa che dentro
un gestore d'importazione ci sta benissimo. Sarebbe bastata per far dire alla
regola «la difesa c'è», senza più controllare se la firma finisce davvero nel
Set.

**Misurato prima di irrigidire** (la regola di `CLAUDE.md`): tutti e **sette** i
gestori col Set aggiungono già sulla variabile giusta. Il buco era **latente**,
non attivo — e lo dico, invece di raccontare una correzione più grossa di quello
che è. Si chiude lo stesso, perché costa una riga.

**2. La controprova sui file veri.** Qui il difetto non si aggiunge, si
**toglie**: quello che la regola deve vedere è l'*assenza* di una difesa. Si
spegne `senzaDoppioni()` in tutte e sei le app (pagina **e** modulo dati) e si
toglie l'`add` al Set nelle tre che quella difesa ce l'hanno, pretendendo che le
violazioni aumentino.

## L'errore che la controprova ha fatto per prima

La sua prima stesura cercava `.has(` in **tutta la pagina**. Campo, Conti e
Flotta ce l'hanno da altre parti e non hanno **nessun** importatore col Set:
la controprova pretendeva una violazione che non poteva esistere e accusava tre
app innocenti. Adesso il riconoscimento è quello **della regola stessa**, non
un'approssimazione somigliante — ed è la terza volta in un giorno che
un'approssimazione «quasi uguale» si comporta diversamente dall'originale.

Il numero di app con la difesa col Set (**3**: Scudo, Sentinella, Terra) è
**asserito**, non solo stampato: se domani ne nascesse una quarta senza che
nessuno se ne accorga, la prova lo direbbe.

## Stato

- **175** prove di stile (149 stamattina), **433** KPI, 43 helper, 23
  pointcloud, 9 manifest, 7 demo — tutte verdi
- Regole con controprova **sui file veri**: 1, 5, 6, 7, 11, 12, 13, 14

## Prossimo passo atomico

Restano con la sola controprova sintetica le regole **9** (nessuna superficie
si riscrive in casa la regola degli interi) e **10** (uno stato vuoto con un
titolo ha anche una spiegazione). La 10 è la più facile da iniettare sul vero:
si aggiunge uno stato vuoto col solo titolo in ogni superficie e si pretende
che venga visto.

## Bloccanti

- Nessuno.
