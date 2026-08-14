# Checkpoint — lo stato vuoto era scritto sei volte, e non uguali

- **Tipo**: due unità (la regola in `shared/`, la prima applicazione in Scudo)
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`

## Da dove è partita

Chiuso il giro del browser, il lavoro di prodotto rimasto **non gated** era la
ricerca sul valore. Il suo primo «dettaglio che fa sembrare il prodotto curato»
è *«le schermate vuote insegnano, non si scusano»* — e cercandolo è saltato
fuori qualcosa di più grosso del dettaglio.

## La regola era scritta sei volte

`vuoto(icona, titolo, spiegazione)` esisteva **in ognuna delle sei app**. E non
erano uguali: cinque prendono il **disegno** dell'icona, **Conti prende il suo
nome** e lo cerca in una tabella. È il difetto che la regola del fondatore
vieta alla lettera — la stessa cosa riscritta, che oggi si somiglia e domani no.

Ora sta in `shared/deepwork-id-client/dw-shell.js` come `statoVuoto`, e ogni app
tiene solo l'**alias** col nome che le pagine hanno sempre usato: nessuna pagina
cambia una riga. Conti tiene la sua comodità **avvolgendo** la regola, non
riscrivendola — la comodità è sua, la regola è di tutti.

## Il terzo pezzo che mancava a tutte e sei

Uno stato vuoto fatto bene dice **cosa manca**, **a cosa serve** e **come si
comincia**. Misurato prima di scriverlo: **99 stati vuoti nelle sei app, ZERO
con un modo di cominciare.**

L'azione è **facoltativa**, e senza di essa non compare nemmeno il suo
contenitore: ci sono stati vuoti che sono una buona notizia («Giornata
tranquilla», «Nessun fermo registrato») e lì un bottone sarebbe rumore. **Si
mette dove chi guarda è fermo, non dove è contento.**

## La prima applicazione

I due punti dove un cliente nuovo di Scudo è davvero fermo: l'**anagrafica
vuota** e lo **scadenzario vuoto**. Prima le frasi *nominavano* le azioni e chi
leggeva doveva cercarsele. Riscritte anche le spiegazioni per dire a **cosa
serve** quella lista invece di cosa fare — è la differenza fra un'istruzione e
una ragione.

I bottoni **portano, non fanno**: cliccano il comando che esiste già o portano
il fuoco sul primo campo. Così non nasce una seconda strada per la stessa cosa.

## L'errore, di nuovo

Alla prima scrittura avevo **indovinato** due id che non esistono
(`new-lav-nome`, `btn-scad-import`). È la trappola scritta in `CLAUDE.md`, e
l'ho vista solo perché ho **misurato** invece di fidarmi: la sonda ha stampato
«MANCA» accanto ai bersagli. Due minuti.

## Verifica

**KPI 433**, Stile 149. Lo stato vuoto montato **nella pagina vera** con la
regola condivisa: due comandi da **44 px**, che vanno a capo invece di uscire
dallo schermo a 390 px. Screenshot **guardato**.

## Prossimo passo atomico

Applicare lo stesso trattamento agli stati vuoti del **primo giorno** delle
altre cinque app — quelli legati a una collezione che nasce vuota e ha un
import: mezzi e ricambi (Flotta), listino e clienti (Conti), fronti (Terra),
ricettori e punti (Sentinella), squadre (Campo). **Non** tutti e 99: solo dove
chi guarda è fermo.

## Bloccanti

- Nessuno.
