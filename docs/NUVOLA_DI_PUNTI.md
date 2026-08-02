# La nuvola di punti per collaudare Genesi — misure del 02/08/2026

> Verificato contro il codice al commit `acb00ff`.

## Da dove nasce

Il fondatore non può fare un volo con il drone sulla sua cava (decisione **7**
di `docs/DECISIONI_WEEKEND.md`). Ha proposto due strade e ne ha chiesta una
funzionante: **(a)** trovare una nuvola di punti dimostrativa online, **(b)**
ricostruirne una da un filmato di drone che ha sul suo computer.

Questo documento dice che cosa è stato **misurato** — non ipotizzato — su
tutt'e due, e che cosa si è costruito.

---

## (a) La nuvola pubblica — FUNZIONA, ed è stata usata

⚠️ **La rete di questo contenitore è filtrata**, e la prima cosa è stata
misurarla invece di darla per buona:

| indirizzo | risposta |
|---|---|
| `raw.githubusercontent.com` | **200** |
| `registry.npmjs.org` | **200** |
| `github.com` (archivio zip) | 403 |
| `codeload.github.com` | 403 |
| `api.github.com` | 403 |
| `opentopography.s3.sdsc.edu` | nessuna risposta |

Quindi la strada praticabile è un file **dentro un repository pubblico**,
preso da `raw.githubusercontent.com`. Due sono stati scaricati per intero e
dati in pasto al nostro lettore:

| file | origine | dimensione | punti | formato |
|---|---|---|---|---|
| `simple.las` | repository di **laspy** (`tests/data`) | 36 KB | 1.065 | LAS 1.2, formato punto 3 |
| `autzen_trim.las` | repository di **PDAL** (`test/data/las`) | 3,7 MB | 110.000 | LAS 1.2, formato punto 3 |

### Che cosa ha detto il nostro lettore

- `parseLAS` li apre **tutti e due**: 110.000 punti in **34 ms**, colore
  a 16 bit riconosciuto, scala e offset dell'intestazione applicati.
- Coordinate lette giuste: est ~636.000, nord ~849.000, quote 406–520 m.
- `volumeCumulo` su `simple.las` risponde **«area troppo estesa per questa
  cella»** — corretto: quel file copre 3,3 km × 4,6 km.
- Su `autzen_trim.las` calcola un volume senza errori.

⚠️ **Quello che questi file NON possono dire**, ed è la ragione per cui non
bastano: **di un rilievo vero non si conosce la risposta giusta.** Se il
nostro calcolo dice 2.232.876 m³, nessuno sa se è vero. Si può solo vedere
che non esplode.

⚠️ **E non sono stati messi nel repository.** Sono file di terzi, con una
licenza che va guardata caso per caso, e uno pesa 3,7 MB: un binario così in
git resta lì per sempre. Servono a **misurare**, e la misura sta scritta qui.

---

## (b) La nuvola dal filmato — NON praticabile da qui

Due ostacoli, tutt'e due misurati e non supposti:

1. **Il filmato dovrebbe arrivare in questo contenitore**, che vede solo il
   repository su GitHub. L'unica strada sarebbe metterci dentro il video: un
   volo di drone pesa quanto tutto il progetto.
2. **Ricostruire una nuvola da un video è fotogrammetria**: si confrontano
   centinaia di fotogrammi per ritrovare gli stessi punti. I programmi che lo
   fanno non ci sono — `which colmap odm opensfm` non trova niente — e non si
   installano qui; il calcolo sarebbe di ore.

Resta possibile che lo faccia il fondatore sul suo computer, ma non è una
strada da consigliare oggi: non è tecnico, e la regola è che non si spende.

---

## (c) Quello che si è costruito: un fronte di cava di cui si conosce il vero

`apps/deepwork-id/tests/nuvola-di-prova.mjs` genera una cava — piazzale,
scarpata, ripiano — e la scrive in **LAS 1.2 formato punto 3**, lo stesso dei
due file veri, con dentro la sporcizia di un volo: coordinate UTM di grandezza
reale, rumore di 2 cm, occlusioni, punti volanti, colore a 16 bit.

La differenza che conta: la superficie è una **formula**, quindi il volume
esatto si integra. **14.880 m³.** Le prove possono dire *«sbagliamo del 2%»*
invece di *«non è andato in errore»*.

### Il difetto che ha trovato subito

`volumeCumulo` difendeva la **base** dai punti spuri (2° percentile, non il
minimo) e la **cima** no. Un punto volante non alza il piano di poco: si
prende una cella intera per tutta la sua altezza.

| punti volanti su 120.000 | cella 0,5 m | cella 1 m | cella 2 m |
|---|---|---|---|
| nessuno | +1,0% | +1,9% | +3,7% |
| 5 | +1,2% | +2,8% | +7,3% |
| 40 (**lo 0,03%**) | +2,7% | **+8,5%** | **+29,9%** |
| 200 | +9,3% | +34,7% | **+118,7%** |

Per una cava quel numero non è un dettaglio: è il volume che consuma la
concessione.

### La correzione, e la prova che non taglia il vero

Regola: **una cima deve essere sostenuta** — altri punti alla stessa quota
nella stessa cella — **e** non deve superare la mediana degli otto vicini
oltre una soglia. Servono tutt'e due: da soli fanno falsi allarmi sulle
nuvole rade.

| soggetto | prima | dopo |
|---|---|---|
| fronte con 40 punti volanti, cella 2 m | +29,85% | **+4,92%** |
| fronte con 200 punti volanti, cella 2 m | +118,72% | **+8,67%** |
| fronte **pulito** (tutte le celle) | — | **identico, cifra per cifra** |
| **file LiDAR vero** `autzen_trim.las`, cella 1 m | 2.232.876 m³ | 2.232.870 m³ (**−0,00%**) |
| stesso file, cella 2 m | 6.397.587 m³ | 6.397.120 m³ (−0,01%) |
| guglia di roccia vera, alta 10 m e larga 3 | — | −0,003% |

Sul file vero tocca **2 celle su 103.951**. Non sta riscrivendo i rilievi:
sta togliendo gli uccelli.

### Due cose imparate scrivendo il soggetto

1. **Il piazzale non è scenografia.** La prima gradonata non ne aveva, e lo
   scarto usciva **−8,51%**: senza una parte piana in basso larga almeno il 2%
   dei punti, il 2° percentile mette la base mezzo metro più su. In una cava
   vera il piazzale c'è sempre — è dove passano i camion.
2. **La nord UTM perde 25 cm in `float32`.** La stima a occhio era «un paio di
   centimetri»: quella è la perdita sull'**est** (~636.000). La **nord** di una
   cava italiana vale ~4.850.000, e lassù due numeri rappresentabili distano
   mezzo metro. È il motivo per cui il pre-shift esiste, e adesso c'è una prova
   che misura tutt'e due i versi: col baricentro tolto la perdita scende
   **sotto il millimetro**.

---

## Che cosa resta scoperto, detto per non venderlo per più di quello che è

Il soggetto sintetico **non** riproduce la geometria vera di *una* cava, la
densità irregolare di un volo reale, gli errori sistematici del GPS, né niente
che dipenda da come si vola. Per quelle serve il volo del fondatore, e la
decisione **7** resta aperta.

Quello che è cambiato è che **non blocca più niente**: il lettore è provato
contro file veri, il calcolo contro una verità calcolata.
