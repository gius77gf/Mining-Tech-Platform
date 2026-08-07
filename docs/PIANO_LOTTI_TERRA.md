# Il piano di coltivazione a lotti in Terra — piano di lavoro

*Scritto il 05/08/2026, dopo aver guardato che cosa Terra ha già. Terza e
ultima voce ancora scoperta del censimento.*

---

## Il punto di partenza è una frase che l'app scrive già

Nella scheda dell'autorizzazione, Terra mostra le **prescrizioni dell'atto**
copiate dal provvedimento (`index.html:1361`). Nei dati d'esempio quella
casella contiene, testuale:

> «Recupero ambientale **contestuale alla coltivazione, lotto per lotto**.»

**È l'obbligo scritto, e l'app non ha nessun modo di mostrare che viene
rispettato.** La parola *lotto* compare **una volta sola** in tutto il codice
di Terra — dentro quella stessa stringa di esempio — e **zero volte** nella
pagina. La parola *ripristino* nel modulo dati non c'è affatto; nella pagina
compare due volte, e in tutti e due i casi parlando d'**altro** (il canone di
Conti, e i metri cubi che alcune regioni scontano dalla tariffa).

Questo è il difetto, ed è di una forma già vista in questo prodotto: **l'app
enuncia un obbligo e poi non lo misura**. È la versione ambientale di «senza
dati non è conforme».

## Perché conta più di quanto sembri

Il recupero contestuale non è una buona pratica: è la condizione con cui
l'autorizzazione è stata data, e quasi sempre è **assistita da una garanzia
finanziaria** (fideiussione) che si svincola per stralci, man mano che i lotti
vengono recuperati e collaudati. Quindi:

- chi coltiva senza recuperare **non sta risparmiando**, sta accumulando un
  debito che a fine concessione arriva tutto insieme;
- lo svincolo della garanzia si chiede **per lotto**, e serve dimostrare che
  quel lotto è chiuso;
- l'ente, in vigilanza, chiede esattamente questo: quanto è stato scavato,
  quanto è stato recuperato, e **con che ritardo**.

Terra ha già i pezzi per rispondere — `autorizzazioni` (superficie, volume
autorizzato, estratto pregresso), `fronti`, `rilievi` con i volumi — e non ha
il pezzo che li lega: **il lotto**.

## Il numero che serve, e che oggi nessuno sa dire

**Il divario di recupero**: superficie (o volume) **aperta** meno superficie
**recuperata**, in un dato momento. È il numero che un ente guarda per primo, e
in molti atti c'è un tetto esplicito («non più di N lotti aperti
contemporaneamente», «il recupero non deve restare indietro di più di una
fase»).

⛔ E porta con sé la trappola di sempre, in una forma particolarmente insidiosa:
**una cava che non ha registrato nessun lotto non ha divario zero.** Ha divario
**non misurato**, e va scritto così. Un «0 m² in ritardo» in verde su un'app che
non sa niente dei lotti è esattamente il numero tranquillo dove non è stato
misurato niente — e stavolta finirebbe davanti a chi fa vigilanza.

---

## La forma

### I dati

```
lotti/{id}: { nome: "Lotto 1 — settore Nord",
              ordine: 1,                 // la sequenza prevista dal progetto
              superficieMq: 12000,
              volumeM3: 180000,          // previsto dal progetto, non misurato
              stato: "aperto",           // previsto | aperto | esaurito | in-recupero | recuperato | collaudato
              apertoIl: "2024-05-02",
              esauritoIl: null,
              recuperoIniziatoIl: null,
              recuperoFinitoIl: null,
              collaudatoIl: null,        // il verbale dell'ente, se c'è
              frontiId: ["f1"],          // i fronti che stanno dentro questo lotto
              nota: "" }
```

Sei stati, non due, e ognuno serve: fra «esaurito» e «recuperato» c'è tutta la
distanza che l'ente misura, e **`collaudato` non è `recuperato`** — il primo lo
dice l'azienda, il secondo lo dice l'ente. Confonderli vorrebbe dire mostrare
come chiusa una pratica che nessuno ha verificato: è la stessa distinzione fra
*«l'ho fatto»* e *«qualcuno l'ha controllato»* che vale in tutta Scudo.

Il collegamento `frontiId` è quello che fa entrare i **rilievi** nel conto:
un rilievo sta su un fronte, il fronte sta in un lotto, e da lì il volume
davvero tolto da quel lotto è **misurato**, non dichiarato.

### Le funzioni pure

| Funzione | Cosa risponde |
|---|---|
| `statoLotto(lotto, oggi)` | lo stato con il suo semaforo, e da quanto tempo è fermo |
| `divarioRecupero(lotti)` | aperto − recuperato, in m² e m³, **oppure `null` con la ragione** |
| `lottiApertiInsieme(lotti, oggi)` | quanti ne sono aperti nello stesso momento |
| `volumeMisuratoDiLotto(lotto, fronti, rilievi)` | quanto è stato tolto **davvero** da quel lotto |
| `avanzamentoLotto(lotto, fronti, rilievi)` | misurato ÷ previsto, e **`null`** se il previsto non c'è |

`divarioRecupero` è quella su cui si gioca l'onestà della schermata: risponde
`null` con `motivo` quando **non c'è nessun lotto registrato**, e distingue
quel caso da «tutti recuperati». Due situazioni opposte che senza questa
distinzione producono lo **stesso zero verde**.

⛔ **E il 07/08 si è visto che la stessa onestà era scritta a metà.** La
funzione contava a parte i lotti **senza superficie dichiarata** (`senzaMq`) e
lo spiegava nel suo commento — «un divario calcolato su tre lotti quando ce ne
sono sei è più piccolo del vero» — ma la riga accanto, quella dei **metri
cubi**, usa lo stesso aiuto `somma` con `(+x[campo] || 0)`: un lotto che il
volume non lo dichiara valeva **zero m³**, e il divario scendeva in silenzio.
Non è un caso di laboratorio: il form scrive `volumeM3: m3.ok ? m3.valore :
null`, quindi è uno stato **previsto**, invisibile solo perché tutti e sei i
lotti della dimostrazione un volume ce l'hanno.
Misurato togliendo quello di `lo5`: il Piano scrive **-43.000 m³** dove il vero
è **+97.000** — il divario non si attenua, **cambia segno**, e si legge «il
recupero è avanti in volume». Ora c'è `senzaM3`, con la sua riga d'avviso nella
pagina, e sei asserzioni in `run-kpi.mjs` (controprova: rimessa la bandiera a
zero, la prova cade).

`volumeMisuratoDiLotto` è il ponte vero: fa entrare i rilievi nel discorso dei
lotti, e permette di dire «previsti 180.000 m³, misurati 96.400» invece di
fidarsi del progetto. E `avanzamentoLotto` **non stima**: un lotto senza
volume previsto non ha una percentuale, ha un volume misurato e basta — che è
già un dato.

---

## Le unità, in ordine

1. **`statoLotto` + `divarioRecupero`**, con le prove. La prova che conta non è
   il divario giusto: è che **zero lotti registrati** dia `null` con la
   ragione, e non `0`.
2. **`volumeMisuratoDiLotto` + `avanzamentoLotto`**, cioè il ponte coi rilievi.
   La prova che conta: un lotto **senza volume previsto** non produce una
   percentuale.
3. **La schermata**: l'elenco dei lotti con la loro sequenza e il semaforo, il
   divario in cima, e `lottiApertiInsieme` accanto al tetto dell'atto — se
   l'atto ne dichiara uno.
4. **Il prospetto per l'ente**: lotti, date, volumi misurati, stato del
   recupero. Terra ha già il **verbale di rilievo** con la sezione «come è
   stato ottenuto il numero»: questo prospetto le si affianca con la stessa
   regola — ogni numero dice da dove viene.

Ognuna con la sua controprova, e il difetto da rimettere è sempre lo stesso:
un numero tranquillo dove non è stato misurato niente.

---

## Quello che il prototipo ha già insegnato *(13 prove in banco, 05/08)*

`divarioRecupero` e `avanzamentoLotto` sono stati provati prima di scriverli
nel modulo. Sono usciti due punti che il piano qui sopra non poteva vedere.

**1. `+null` fa zero, e `Number.isFinite(0)` risponde `true`.** La prima
versione di `avanzamentoLotto` rispondeva **«0%»** per un lotto a cui non è
collegato **nessun rilievo** — cioè l'assenza travestita da misura, nella forma
già raccolta in `CLAUDE.md`, e nella direzione peggiore: uno 0% suggerisce «non
ancora cominciato» dove la verità è «nessuno ha misurato». La guardia va messa
**prima** della conversione (`x == null || x === ""`), non dopo.

**2. «Tutti recuperati» e «nessun lotto» vanno separati per costruzione.** Il
primo dà un divario negativo ed è un ottimo risultato; il secondo non dà
niente. Se la funzione restituisse `0` in entrambi i casi, la cava più
diligente e quella che non ha mai registrato niente mostrerebbero lo stesso
numero. La prova lo fissa confrontando i due `misurabile`, non i due numeri.

E una terza cosa, minore ma dello stesso stampo: un lotto **aperto senza
superficie dichiarata** si conta a parte (`senzaMq`). Un divario calcolato su
tre lotti quando ce ne sono sei è più piccolo del vero — di nuovo la buona
notizia.

---

## Cosa questo piano NON decide

- **Il valore della garanzia finanziaria e il suo svincolo.** Sono importi e
  procedure che cambiano da regione a regione e da atto ad atto; Terra può
  tenere le **date** e gli **stati**, non calcolare quanto si svincola. Metterci
  un numero sarebbe inventare.
- **La geometria dei lotti sulla mappa.** Qui il lotto è un record con una
  superficie dichiarata, non un poligono. Disegnarlo è un'altra scheda, e ha
  senso solo dopo che gli stati e le date sono in piedi.
- **Le soglie dell'atto** (quanti lotti aperti insieme, quanto può restare
  indietro il recupero): si **leggono** dall'autorizzazione, non si cablano.
  Vale la regola già scritta nella roadmap — le regole ambientali cambiano da
  regione a regione, e nel codice non ci va nessuna soglia fissa.
