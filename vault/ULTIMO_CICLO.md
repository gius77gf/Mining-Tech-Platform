# Ultimo ciclo di lavoro automatico

- **Quando**: 2026-09-12, 18:54 UTC
- **Commit di partenza**: `54f6fad3`
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa sta per succedere

Repository raggiungibile, `HEAD` combacia col remoto, working tree pulita.

⚠️ **Direttiva del fondatore in conversazione, più recente e più specifica
del prompt fisso di questa routine**: concentrarsi SOLO sull'app Genesi
per ora ("focalizzati solo su genesi per il momento, voglio migliorare il
programma al massimo"). Il prompt automatico di questo ciclo propone i
ponti fra le app e la passata in profondità su tutte le app — non va
seguito alla lettera finché questa direttiva resta in vigore: si resta su
Genesi. Il fondatore ha anche chiesto un aggiornamento a metà ciclo
("come procede?") e gli è stato risposto in italiano semplice: sa che il
lavoro è vivo.

Unità completate da quando è iniziato questo blocco (126-132), tutte su
Genesi: nuova funzione "carica per un obiettivo di pezzatura" (inversione
del Kuz-Ram) con tetto dimensionale onesto; import del rilievo di
deviazione fori (boretrack) col burden vero ricalcolato sulle posizioni
misurate; corretto un documento di roadmap che dichiarava "da fare" tre
funzioni già costruite (risparmiato un cantiere inutile); registrata (non
presa) una decisione del fondatore su come misurare la pezzatura da una
foto; chiuse le ultime copie duplicate della penalità RWS; e — l'ultima,
più inattesa — trovati e corretti tre banchi di verifica browser di
Genesi che aspettavano troppo poco l'avvio della pagina in questo
ambiente (senza GPU lo splash iniziale impiega 15-20s a sparire, non i
~1,85s previsti), dando 62 falsi allarmi su tre banchi che nessuno
guardava più. Dettagli completi negli ultimi 7 checkpoint in
`vault/checkpoints/` (dal 20260912-161749 al 20260912-185045).

## Prossimi passi immediati

1. **`genesi-frasi-limite.mjs` ha ancora 4 falliti**, causa diversa dallo
   splash (i contatori della Home restano vuoti quando si inietta uno
   storico via localStorage — sospetto legato a `genesiData()` e al suo
   tentativo di modalità "live"/Firebase prima del ripiego locale). Da
   indagare con la stessa disciplina di misura prima di correggere.
2. **`genesi-struttura.mjs` ha 4 falliti pre-esistenti e diversi**
   (Escape non chiude il modale, il campo "Salva la volata" non si
   trova) — mai indagati, scoperti solo di striscio in questo blocco.
3. Se questi due si esauriscono: il gap P2.1 (frammentazione da foto)
   resta bloccato sulla decisione #28 in `docs/DECISIONI_WEEKEND.md`; il
   cantiere B3 (funzioni estraibili da `genesi.html`) è in gran parte
   esaurito dei candidati facili (vedi il checkpoint della verifica
   qualità, 20260912-175849).

⚠️ **Nota sul prompt fisso della routine**: cita ancora la mappa dei ponti
e lo stato di Genesi come erano il 26/08. Questi fatti sono superati da
settimane di lavoro misurato — il documento vivo è
`docs/MAPPA_ECOSISTEMA.md` — e in ogni caso, finché vale la direttiva del
fondatore di questa conversazione, il lavoro resta su Genesi sola. Il
canarino di questo ciclo serve a dire che il lavoro è vivo, non a
resettare lo stato a quello del prompt né a cambiare app.
