# L'ultimo dei cinque

**Data:** 01/08/2026 · **Area:** `apps/deepwork-id/tests/browser/stati-non-misurati.mjs`
**Unità precedente:** `20260801-155000_il-lotto-senza-fronte.md`

## Chiuso il filo

L'ultimo stato vero: nel dettaglio di una manutenzione **a ore**, quando il
mezzo non ha un ritmo misurato **e** l'ipotesi di ore-giorno è vuota, la riga
scrive **«Quando cadrà non si sa»** e la **ragione** — *«le letture del
contatore coprono 12 giorni: per stimare 30 giorni servono almeno 15»*.

Il commento del codice lo dice meglio di come lo direi io: la versione
precedente scriveva *«Fra 1.765 gg (~12/06), col ritmo misurato di 3,4 h al
giorno»* su una macchina di cui nessuno ha letto le ore — **«una previsione
precisa, verificabile, e falsa dal primo addendo»**.

## Come si raggiunge: svuotando un campo

Non è un dato mancante nella dimostrazione: è uno **stato dell'utente**. Chi
guarda la lista può cancellare l'ipotesi di ore al giorno, e a quel punto l'app
non ha più niente su cui basarsi. Da qui il terzo modo di preparare la pagina
nel banco, dopo il click e la tendina: **scrivere in un campo** (`scrivi`).
Un campo svuotato è uno stato come un altro e va raggiunto per digitazione.

## Il `vietato`, che qui è il cuore

Non basta che compaia la frase: la riga **non deve** contenere «Fra N giorni».
Dire «non si sa» e stampare accanto una data è la stessa cosa che dire «mai
misurato» e stampare accanto uno zero — la forma che questo banco ha imparato a
guardare da Sentinella in poi.

## La controprova, e il suo accoppiamento

Fatto inventare un ritmo di 8 h/giorno quando non se ne conosce nessuno
(`if (rate <= 0) return Math.ceil(manca / 8)`), **cadono due righe**: quella del
dettaglio **e** quella della piastrella del cartellone. È giusto che cadano
insieme — il codice ha un commento che pretende esattamente questo: *«la tessera
in cima al Quadro quel tagliando lo mette fra i "non so quando": qui deve dire
la stessa cosa, o le due si smentiscono»*. Una controprova che ne facesse cadere
una sola direbbe che le due si sono scollegate.

## I cinque, chiusi

| # | stato | app |
|---|---|---|
| 1 | tagliando a ore senza ritmo (cartellone) | Flotta |
| 2 | fattura senza scadenza (aging) | Conti |
| 3 | «non si sa entro quando» — **era un difetto vero** | Conti |
| 4 | lotto senza fronte | Terra |
| 5 | manutenzione senza ritmo né ipotesi | Flotta |

Dei cinque, **uno era un difetto di prodotto** (l'ordinamento che dava
`ritardo: 0` a una fattura senza data e la faceva sparire dal pannello): gli
altri quattro erano difese giuste che nessuno sorvegliava.

## Verifica

Banco **49/0** — 23 stati, sei app, due fogli stampati. Controprova incorporata
cade; controprova per regressione fa cadere le due righe accoppiate.
Ripristinato, `git status` vuoto.

## Prossimo passo atomico

Rilanciare la **misura** `stati-sorvegliati.mjs` ora che il banco è cresciuto da
15 a 23 stati, e prendere la voce successiva della classifica — «non
calcolabile», che dicono **cinque app**. Stesso metodo: leggere a mano nel testo
che l'utente vede, separare i tre secchi (già sorvegliato / non è uno stato /
stato vero scoperto), e per gli stati veri chiedersi **prima** se il caso è
raggiungibile e **come** — dato, ordinamento, o campo dell'utente, che sono le
tre risposte diverse trovate in questo filo.
