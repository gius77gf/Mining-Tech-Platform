# Checkpoint — 2026-08-06 19:10:10 UTC

## Tipo
unit-complete (quattro unità dopo il canarino: Terra riverificata, Genesi fuori
dalla pagina, Scudo con la gravità potenziale)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`50dfe1b` — *Scudo: «e se fosse andata male?», e «non lo so» è un pulsante, non
una cella vuota*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| — | **canarino** (`2f3a097`) | tre cantieri aperti, committato il solo `ULTIMO_CICLO.md` |
| 68 | **Terra riverificata** (`3e92bf2`) | arretrato **57 → 41** commit |
| 69 | **Genesi esce dalla pagina** (`6c8e902`) | **171 → 166** funzioni fuori portata |
| 70 | **Scudo · la gravità potenziale** (`50dfe1b`) | copertura **650/650 → 656/656** |

## ⛔ Il filo di questi tre, ed è il cercatore, non il codice
Tutte e tre le unità hanno trovato il difetto **nello strumento di misura**
prima che nel prodotto, e ogni volta in un modo diverso:

1. **Terra — un conto senza il suo campione non è una misura.** Il primo giro
   di `grep` per verificare le quattro assenze ha risposto **21 occorrenze nel
   modulo, 33 nella pagina, 5 in `dw-ponti`**, e letto così avrebbe fatto
   scrivere «la riga è scaduta, adesso c'è». Guardando **che cosa** aveva
   trovato: 24 volte «taglio» dentro «detta·glio·», «floating» dentro un
   commento sui numeri a virgola mobile, «cone» dentro un'altra parola. Zero
   occorrenze vere. La difesa costa un comando: `grep -o` + `uniq -c` **prima**
   di credere al numero.
2. **Genesi — una prova che non distingue, e la causa era la prima delle
   cinque.** L'iniezione «`vnoise3` a scalini» non faceva cadere niente: i due
   punti della prova stavano **dentro la stessa cella**, dove liscio e a
   gradini danno lo stesso valore. Corretti i **dati della prova**, non la
   prova. E una resta indistinguibile ed è **giusto così**: l'interpolazione
   lineare non fa cadere una prova che asserisce la *continuità*.
3. **Scudo — tre controlli diversi, tre difetti che leggendo non si vedono.**
   Il prototipo in scratchpad ha bocciato tre passate (una percentuale su un
   campione di uno, una classifica su un episodio, «in testa c'è Fronte con 0
   episodi»); **lo scatto** ha trovato che `badge info` è una **collisione di
   nomi** — `.badge.info` è il colore, ma `.info{flex:1 1 120px}` è la colonna
   di testo di ogni riga, e la pastiglia ereditava quel `flex` prendendo 460 px
   invece di 120; **`sonda-vuoto`** ha fatto cadere il giro perché a registro
   vuoto la funzione nuova disegnava un verde e un rosso dove non era successo
   niente.

## ⚠️ La cosa di prodotto che vale oltre l'unità
In Scudo, **«non lo so» è un pulsante** con lo stesso peso dei tre gradini di
gravità, non una casella lasciata vuota. E nella dimostrazione, con 4
valutazioni su 5, **l'app si rifiuta di fare la classifica** e lo dice:
«costruirla su così pochi episodi sarebbe una bugia». È il principio del
fondatore applicato a una funzione **nuova**, dal disegno e non a posteriori —
e i luoghi in cui nessuno ha valutato escono dalla graduatoria in un elenco
loro, perché in fondo a un ordinamento si leggerebbero come i più tranquilli.

⚠️ E la separazione tenuta: la terza proposta della stessa scheda di ricerca —
la **scadenza della comunicazione annuale** — è **ferma**, perché è una
citazione normativa e quella scheda ha già sbagliato tre volte su tre. Va alla
fonte primaria e al fondatore col suo RSPP, come la riga DUVRI. Non è
«rimandata»: è ferma con il motivo scritto.

## Stato delle prove
**2.158** prove senza rete (run-kpi **1757**), copertura **656/656** + le
condivise, banchi del browser **92**. Giro `node` 21 comandi, 0 caduti sulla
copia di ciò che si committa, a ogni commit.
Arretrato dei documenti del delta: **42 commit** (terra a **0**, flotta 12,
conti 11, sentinella 8, scudo 7, campo 4).

## Che cosa sta girando adesso
**Un cantiere**: il **core**, la cui dimostrazione ha 30 comandi cliccabili
contro 68 schede nel programma del banco delle modali. ⚠️ È l'unità in cui si
scrivono **dati d'esempio**, cioè quella in cui il vincolo ferreo del fondatore
sui dati di riferimento è più facile da violare per distrazione: il mandato
gliene chiede la prova esplicita cercata nel proprio diff.

## Prossimo passo atomico
1. **Raccogliere il core** con la solita procedura (indice da `HEAD`, worktree
   ricreata, giro `node` sulla copia), e prima di committare **cercare io
   stesso** nel diff i dati vietati — archivio video, volate misurate, maglia
   4,5×3,5, Nonel 25 ms, 15-20 fori, il litotipo di quell'origine.
   ⚠️ Se le modali aperte restano **0**, l'unità non è riuscita e va detto:
   non si dichiara un successo perché il numero dei dati è salito.
2. **Flotta** è il documento più vecchio dell'arretrato (12 commit): stessa
   riverifica fatta oggi su Terra, con `grep -o` + `uniq -c` invece del solo
   conteggio.
3. I **due difetti di Genesi dichiarati e non corretti**, che sono due unità
   loro: la seconda copia di Box–Muller dentro `buildSim` (`genesi.html:1484`)
   che adesso **ombreggia** l'originale salito nel modulo, e la riga 1910 che
   rifà a mano il corpo di `jitterGeo` — non sostituibile finché il seme è
   fisso a 7 nella funzione e lì serve `11+k`.

## Code aperte, dichiarate
Le **19 decisioni** scadono **domani, venerdì 07/08**: se non arriva risposta
si procede con la colonna «la mia risposta», dichiarandolo nel commit. Restano
ferme le 6 che richiedono il fondatore. La riga **DUVRI** e la **scadenza della
comunicazione annuale** aspettano lui col suo RSPP.
⚠️ La **CI è rossa da sette commit e non è il codice**: GitHub Actions non
riesce a scaricare le action (`Service Unavailable`, poi un timeout).
Verificato sui log di cinque job diversi; due di quei commit toccano solo
markdown.

## Blocchi
Nessuno.
