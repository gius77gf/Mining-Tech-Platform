# Ultimo ciclo di lavoro automatico

- **Quando**: 2026-09-12, 21:45 UTC
- **Commit di partenza**: `2f902d5b`
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa sta per succedere

Repository raggiungibile, `HEAD` combacia col remoto, working tree pulita.

⚠️ **Direttiva del fondatore in conversazione, più recente e più specifica
del prompt fisso di questa routine**: concentrarsi SOLO sull'app Genesi
per ora ("focalizzati solo su genesi per il momento, voglio migliorare il
programma al massimo"). Il prompt automatico di questo ciclo propone i
ponti fra le app e la passata in profondità su tutte le app — non va
seguito alla lettera finché questa direttiva resta in vigore: si resta su
Genesi.

⛔ **SEGNALAZIONE DI SICUREZZA APERTA, DA LEGGERE PRIMA DI TOCCARE
GEOMETRIA/FLYROCK/BURDEN.** Nel blocco precedente (checkpoint
`20260912-200615_genesi-boretrack-avviso-sicurezza.md`) è emerso che
l'unità 129 aveva costruito l'import del rilievo boretrack
(`deviazioneForiDaCsv`/`burdenVeroDaRilievo`) senza controllare che
`docs/DECISIONI_WEEKEND.md` (sezione 6) bloccava esplicitamente quella
stessa funzione dal 07/08, in attesa di un caso reale che confermi la
convenzione degli assi dx/dy — un errore di segno inverte l'avviso di
flyrock mostrato al fochino. Aggiunto un avviso visibile nel pannello
(non rimossa la funzione, non indovinata una correzione). **Resta
bloccato sul fondatore**: serve un caso reale (anche solo un paio di
fori con rilievo vero) o la sua conferma esplicita che l'avviso basta
per ora. Fino ad allora: **nessuna nuova unità tocca la geometria del
fronte 3D, il flyrock o il burden reale per foro** — il resto di Genesi
(frammentazione, vibrazioni non legate al burden, riconciliazione
carica, presplit, export, ricerca di fianco) resta aperto.

Unità completate da quando è iniziato questo blocco (126-135 + due
correzioni di documenti + la segnalazione di sicurezza), tutte su
Genesi: nuova funzione "carica per un obiettivo di pezzatura" con tetto
dimensionale onesto; import del rilievo boretrack (ora con l'avviso
sopra); chiusa la famiglia di 66 falliti pre-esistenti nei banchi
browser di Genesi (tutti la stessa causa: lo splash d'avvio impiega
15-20s a sparire in questo ambiente senza GPU, non i ~1,85s previsti);
corretto due volte lo stesso documento di roadmap competitor (prima tre
funzioni, poi una quarta, dichiarate "da fare" quando erano già
costruite); due ricerche di fianco raccolte (misura della
frammentazione da foto, per la decisione #28 ancora aperta; flyrock
quantitativo e backbreak). Dettagli negli ultimi checkpoint in
`vault/checkpoints/` (dal 20260912-161749 al 20260912-200615).

## Prossimi passi immediati

1. Rispettare il blocco di sicurezza sopra: niente lavoro su
   geometria/flyrock/burden finché non arriva una risposta.
2. Il gap P2.1 (frammentazione da foto) resta bloccato sulla decisione
   #28 in `docs/DECISIONI_WEEKEND.md`; la ricerca di mondo è già
   raccolta in `docs/RICERCA_CONTINUA_GENESI.md`.
3. Il cantiere B3 (funzioni estraibili da `genesi.html`) è in gran
   parte esaurito dei candidati facili (checkpoint 20260912-175849).
4. Continuare con ricerca di fianco a rotazione su angoli Genesi non
   ancora coperti, o con verifiche di qualità (screenshot, sonda-vuoto,
   documenti invecchiati) su superfici che non toccano il blocco al
   punto 1.

⚠️ **Nota sul prompt fisso della routine**: cita ancora la mappa dei ponti
e lo stato di Genesi come erano il 26/08. Questi fatti sono superati da
settimane di lavoro misurato — il documento vivo è
`docs/MAPPA_ECOSISTEMA.md` — e in ogni caso, finché vale la direttiva del
fondatore di questa conversazione, il lavoro resta su Genesi sola. Il
canarino di questo ciclo serve a dire che il lavoro è vivo, non a
resettare lo stato a quello del prompt né a cambiare app.
