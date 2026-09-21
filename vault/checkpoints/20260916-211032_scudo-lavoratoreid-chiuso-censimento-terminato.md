# Checkpoint — 2026-09-16T21:10:32Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
2ecbba54

## Cosa è stato completato
Chiusa la domanda lasciata aperta dal checkpoint precedente: `lavoratoreId`
nel registro infortuni di Scudo fa parte o no del giro CSV per scelta?

Verificato come Terra risolve `fronteId` sul suo import (cerca il fronte
per NOME contro l'anagrafica, mai un id grezzo — un id locale non
sopravvive a un giro export→import perché Firestore ne assegna uno nuovo
a ogni scrittura). `csvRegistroInfortuni` di Scudo non ha mai avuto una
colonna col nome del lavoratore, né oggi né prima: a differenza della
denuncia INAIL (dato già scritto nell'oggetto, solo non rileggibile
perché nascosto in una frase), qui non c'è nulla da recuperare —
servirebbe una colonna nuova più una funzione di risoluzione per nome,
mai costruita. Stessa famiglia del caso scartato su Flotta: funzionalità
mai costruita, non difetto di cablaggio.

**Non implementata**: è una decisione di prodotto (il rischio di un
abbinamento sbagliato su un nome ambiguo, in un registro che riguarda
infortuni veri), non presa qui. Nessun codice toccato in questa unità.

## Stato roadmap
Il censimento a doppio punto di chiamata è ora **completamente chiuso** su
tutte e sei le app di questa sessione, con ogni candidato verificato
singolarmente (5 difetti veri corretti, 2 candidati scartati con la
ragione scritta — Flotta/mezzi, Scudo/lavoratoreId). Non resta nessuna
domanda aperta da questo filone di lavoro.

## Prossimo passo atomico
Nessuna delle strade "binario 2" aperte nei checkpoint precedenti (P2 di
ASSENZA, censimento a doppio punto di chiamata) ha più lavoro pronto senza
una nuova indagine o una decisione del fondatore. Per la prossima unità,
in ordine di preferenza:
1. **Provare il censimento a doppio punto di chiamata su Genesi** — l'unica
   app non ancora coperta in questa sessione, anche se vive fuori dal giro
   `node` (`genesi.html`, 136 funzioni nella pagina) e richiede lettura
   diretta senza gli stessi strumenti di test.
2. **Tornare alla lista "SE LA ROADMAP SEMBRA FINITA" di CLAUDE.md**:
   seconde iterazioni sulle app verticali (CRUD mancanti, filtri,
   validazioni, stati vuoti), P3 di ASSENZA (la riga di convenzione in
   testa al CSV — misurata come costosa il 16/09 ma non impossibile),
   revisione qualità/sicurezza di ciò che è su main, nuova deep-research a
   rotazione partendo da un'app che non ha avuto ricerca oggi.
3. **Decisioni di prodotto lasciate esplicitamente aperte oggi**, se si
   preferisce chiuderle invece di continuare la ricerca: il round-trip CSV
   completo per i mezzi di Flotta, la risoluzione per nome del lavoratore
   nel CSV infortuni di Scudo — entrambe richiedono un giudizio di prodotto
   più che una scoperta, quindi si prestano a essere proposte al fondatore
   piuttosto che decise da sole.
La scelta è aperta al prossimo ciclo.

## Blocchi
Nessuno.
