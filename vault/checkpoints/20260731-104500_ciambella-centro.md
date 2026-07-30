# Checkpoint — 31/07/2026 10:45 UTC

## Task completato
**S21 — la ciambella e l'avanzamento: il numero al centro sta nel buco.** Con
questo tutti e quattro i tipi di grafico del motore condiviso sono stati guardati
con dati veri.

| Commit | Cosa |
|---|---|
| `9e0355c` | Due difetti latenti chiusi, trovati con casi ostili |

## La stessa famiglia di difetto, la terza volta
Linea, barre, ciambella: in tutti e tre una **dimensione o una posizione decisa da
una stima per conto di caratteri**. La stima è tarata sulle cifre e sbaglia appena
il testo contiene altro.

| dove | cosa faceva | misurato |
|---|---|---|
| numero al centro | `lunghezza · 0,56` per la dimensione | «1.111.110 m³/giorno»: 127 px in un buco da 120 |
| etichetta al centro | `centro` come **stringa**, scritta a dimensione fissa, niente la fermava | «Cavato complessivo del 2026»: 181 px in 120 |

Ora il numero parte dalla stima — quasi sempre giusta al primo colpo, e risparmia
un ridisegno — e poi si **misura**, riducendo in proporzione. L'etichetta passa da
`troncaTesto`, la stessa funzione delle barre: una regola, un posto.

## Il passaggio che ha fatto la differenza
La prima misura ha detto **«0 casi con un problema»**. Se mi fossi fermato lì avrei
concluso che la ciambella era a posto. Invece ho aggiunto **casi ostili scelti per
far fallire il controllo** — un centro come stringa lunga, un'unità larga col numero
grande — e sono usciti entrambi i difetti. Un controllo che passa su tutto non
dimostra di guardare; è la regola già scritta in `CLAUDE.md`, applicata prima di
credere a un risultato verde.

## `dimCheCiSta`, e perché riceve la misura da fuori
La regola del rimpicciolimento è pura: prende la dimensione di partenza, il buco e
una funzione `misura(dim)`. Così si prova nella suite con un **carattere finto di
larghezza nota**, senza browser — compreso il caso di un carattere che **non** scala
in proporzione, dove deve finire al minimo e non in un ciclo infinito.
Il pavimento (11 px) è una decisione, non un caso: sotto quella soglia il numero non
si legge, e il problema vero è che il grafico è troppo piccolo per quel dato.

## Onestà su cosa vale
**Oggi nessuna app disegna la ciambella.** Sono difetti latenti del motore
condiviso, non cose che il fondatore vedrebbe aprendo un'app. Li ho chiusi lo stesso
perché è il motore su cui poggiano i grafici di tutte e sei le app, e la prima
composizione che qualcuno disegnerà — materiali venduti, voci di costo — ci sarebbe
caduta dentro. Ma il valore è di fondazione, non di prodotto visibile, e va detto
così.

L'**avanzamento** è risultato pulito su tutti e cinque i casi, riferimento a inizio
e a fine corsa compresi: nessuna correzione, e va detto anche questo invece di
inventarne una.

## La prova ha corretto sé stessa
`confronta-svg.mjs` confronta con **HEAD**, e HEAD si muove: il marcatore «deve
cambiare» messo sulle barre è scaduto nel momento esatto in cui la correzione delle
barre è entrata in HEAD, e la prova lo ha **detto** invece di tacere. La regola —
quando un'unità viene committata il marcatore si sposta sul lavoro in corso — è ora
scritta nel file.

## Stato
Suite: **301 KPI** (erano 300), 72 stile, 7 demo, 43 helper, 23 pointcloud,
9 manifest. Tutte verdi.
`confronta-svg.mjs`: 34 confronti, tutti e **quattro** i tipi di grafico, due
larghezze.

## Prossimo passo atomico
**Il motore dei grafici è chiuso: si torna al prodotto.** Il passo successivo è la
**prima iterazione della sezione «Composizione» che ancora non esiste in Terra**, ed
è esattamente il posto dove la ciambella appena sistemata serve: Terra sa quanto si
è cavato in totale ma non **di che cosa** — e l'autorizzazione di cava elenca i
materiali. Un titolare che guarda l'anno vuole sapere quanta parte è calcare da
costruzione e quanta è misto.

Da fare, nell'ordine: (1) leggere in `apps/terra/terra-data.js` se il materiale è
già un campo dei rilievi o delle autorizzazioni, **prima** di progettare la sezione
— due volte questa settimana il dato che serviva c'era già; (2) se non c'è, la
domanda da decidere e scrivere è se il materiale appartiene al rilievo (un volo
misura un volume, non un litotipo) o all'**area** autorizzata, che è la risposta più
probabile e va verificata; (3) disegnare la sezione riusando la ciambella, con lo
stato vuoto utile — «nessun materiale dichiarato nell'autorizzazione» dice cosa
fare, «nessun dato» no; (4) screenshot a 390 px, guardato.

Restano aperti e già scritti: la larghezza dei comandi di Scudo (36–38 px invece
di 44, compromesso misurato), il badge dell'idoneità (caso che la WCAG 2.5.8
esenta), i dodici campi interi di Genesi verificati solo montando la guardia e non
digitando (vivono tutti in modali), e i tre punti che aspettano il fondatore —
progetto Firebase (10 minuti), permessi per ruolo, blocco del turno chiuso lato
server.
