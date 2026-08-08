# Checkpoint — Conti, il prodotto senza prezzo che usciva GRATIS

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Task completato
**`conti_listino_prezzi.csv`: un prodotto senza prezzo usciva a ZERO — cioè
gratis — nel foglio che si manda al cliente.**

È l'istanza più netta della famiglia trovata finora, perché il difetto e la sua
correzione erano **nella stessa riga, a quattro celle di distanza**:

| colonna | com'era |
|---|---|
| `prezzo` | `${+p.prezzo \|\| 0}` → **0** |
| `densita_t_m3` | `densitaValida(p) ?? ""` → vuota |
| `prezzo_t` | `prezzoPerTonnellata(p) ?? ""` → vuota |
| `prezzo_m3` | `prezzoPerMetroCubo(p) ?? ""` → vuota |

E il commento sopra quella riga dice già il principio, per la densità: *«LA
DENSITÀ CHE NON C'È NON È UNA DENSITÀ ZERO … chi lo apre col foglio di calcolo
legge un numero misurato dove nessuno ha misurato niente»*. Tre celle avevano
imparato la lezione, la quarta no.
Corretto con `numeroDichiarato`, che tiene lo **zero scritto** (un prodotto in
omaggio è un dato) e svuota quello mai compilato — la stessa regola che il CSV
dei clienti, in questo stesso file, usa già per il fido.

Stessa correzione sull'importo delle voci di costo, e **le due copie locali
dell'aiuto sono state unite in una sola**: stavo per lasciarne due a duecento
righe di distanza, diverse solo per il tipo di ritorno — cioè la copia debole
che nasce da una firma troppo stretta, scritta mentre correggevo esattamente
quella famiglia.

## Le cose imparate
1. ⚠️ **`revokeObjectURL` uccideva il banco.** L'export dei costi fa
   `a.click(); URL.revokeObjectURL(a.href)` sulla stessa riga — giusto nel
   prodotto — e il banco leggeva il contenuto un istante dopo: `Failed to
   fetch`, eccezione non gestita, **banco morto a metà**. Reso inerte
   `revokeObjectURL` nella pagina di prova, e la lettura ora **dichiara** il
   fallimento invece di far crollare il giro: un banco che crolla stampa meno
   prove, e un totale più basso si legge come «ha guardato meno roba», non come
   «si è rotto».
2. ⚠️ **Il righello, due volte.** `soldi()` toglie i punti credendoli separatori
   di migliaia: su una cella che porta un numero **grezzo** (`8.5`) leggeva 85 e
   accusava un valore giusto. E l'altra asserzione dava per possibile un caso
   che il modulo non produce.
3. ⛔ **`riepilogoCosti` SCARTA a monte le voci senza importo** — misurato: su
   due costi, uno con 1.200 € e uno senza, ne restituisce **uno solo**. Quindi
   in quel file la cella vuota **non è raggiungibile**, e l'iniezione #4 del
   banco **non produce un KO**: sta dichiarata nel file, con la ragione, perché
   chi conta «4 difetti rimessi, 3 KO» non pensi a una regressione. La
   correzione resta giusta ma è difesa in profondità, non un difetto che si
   vedeva.

## Verifiche
- banco Conti: **23 passati, 0 falliti** su 3 documenti; controprova **3 KO
  voluti** coi 4 difetti rimessi davvero (il quarto non discrimina, dichiarato)
- `node giro-node.mjs` → **32 comandi a posto, 0 caduti**, rifatto su una copia
  di ciò che si committa (identità della patch verificata)
- `iniezioni-fresche` **183 su 183**, 22 banchi

## Stato roadmap
Domanda *«chi decide i numeri di ciò che ESCE?»*:
Campo 6/6, Sentinella 5/5, Terra 3/3 puliti · core 2/2 (1 difetto) ·
**Flotta 9/9** (4 difetti) · **Conti 3/12** (3 difetti) · Scudo 5, Genesi 9.
**Otto difetti veri in un pomeriggio**, tutti della stessa famiglia.

## Prossimo passo atomico
**La domanda aperta che è uscita dalla misura di oggi, e che non ho chiuso: una
voce di costo registrata SENZA importo sparisce dal riepilogo e dal file, in
silenzio** (`riepilogoCosti` la scarta a monte). Va deciso se è giusto — un
costo che non si sa quanto vale è comunque un costo che esiste, e il principio
del fondatore dice che l'assenza di un dato non è un dato favorevole. Prima di
toccare: misurare se il form permette di salvarne una senza importo.
Poi: i tre export di Conti ancora chiusi (pesate/DDT — già letto e risultato
curato —, preventivi, e i sei che delegano al modulo), e **Scudo** (5) e
**Genesi** (9), su cui i cantieri di analisi hanno girato.

## Blocchi
Nessuno.

## Note
Il giro del browser (pid 21084) è vivo da oltre due ore sulla sua copia. Da
leggere con `leggi-giro.mjs`: **sezione 0** (età del giro), poi le righe «non ho
guardato», poi i KO — separando il rosso VOLUTO delle controprove con i
marcatori `⚠️ CONTROPROVA` / `FINE CONTROPROVA`.
