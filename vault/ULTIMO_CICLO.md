# Ultimo ciclo di lavoro automatico

- **Quando**: 2026-09-13, 04:04 UTC
- **Commit di partenza**: `45dc8a6e`
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa sta per succedere

Il contenitore si è riavviato durante il blocco precedente. Nessun lavoro
è andato perso: l'unico processo in background interrotto era un ciclo di
attesa (`pgrep -f giro-node.mjs`) il cui risultato era già stato letto e
usato prima del riavvio — non una verifica mai raccolta. Repository
raggiungibile, `HEAD` combacia col remoto, working tree pulita.

⚠️ **Direttiva del fondatore in conversazione, più recente e più specifica
del prompt fisso di questa routine**: concentrarsi SOLO sull'app Genesi
per ora ("focalizzati solo su genesi per il momento, voglio migliorare il
programma al massimo"). Il prompt automatico di questo ciclo propone i
ponti fra le app e la passata in profondità su tutte le app — non va
seguito alla lettera finché questa direttiva resta in vigore: si resta su
Genesi.

⛔ **SEGNALAZIONE DI SICUREZZA APERTA, DA LEGGERE PRIMA DI TOCCARE
GEOMETRIA/FLYROCK/BURDEN.** Un gate di sicurezza del 07/08 su
`deviazioneForiDaCsv`/`burdenVeroDaRilievo` (import del rilievo boretrack)
è stato violato da un'unità di questo stesso blocco senza controllarlo
prima: un errore nella convenzione degli assi dx/dy potrebbe invertire
l'avviso di flyrock mostrato al fochino. Aggiunto un avviso visibile in
rosso nel pannello (non rimossa la funzione, non indovinata una
correzione). **Resta bloccato sul fondatore**: serve un caso reale (anche
solo un paio di fori con rilievo vero) o la sua conferma esplicita che
l'avviso basta per ora. Dettaglio completo in
`docs/DECISIONI_WEEKEND.md` (sezione 6) e nel checkpoint
`20260912-200615_genesi-boretrack-avviso-sicurezza.md`. Fino ad allora:
**nessuna nuova unità MODIFICA la geometria del fronte 3D, il flyrock o
il burden reale per foro** — la sola LETTURA/analisi resta permessa
(dimostrato dal confronto formula-per-formula del flyrock, fatto senza
toccare codice). Il resto di Genesi (frammentazione, vibrazioni non
legate al burden, riconciliazione carica, presplit, decking, export,
ricerca di fianco) resta aperto.

Unità completate da quando è iniziato questo blocco (126-136 + sei
correzioni di documenti + la segnalazione di sicurezza + quattro
ricerche di fianco), tutte su Genesi. Le più recenti:
- Chiusa senza residui la famiglia "splash lento" nei banchi browser di
  Genesi (66 falliti pre-esistenti, quattro banchi, stessa causa unica).
- Scoperta di sicurezza sul rilievo boretrack (sopra), con avviso
  applicato e propagato a **cinque documenti** che contenevano la stessa
  affermazione scaduta ("Genesi non importa la deviazione fori").
- Confronto formula-per-formula: il termine "Lundborg" del motore
  flyrock è verificato **esattamente** contro la formula pubblica
  (260/25.4^(2/3) = 30.09, coincide con la costante nel codice) — solo
  analisi, nessuna riga toccata.
- B3 (funzioni estraibili da `genesi.html`) riconfermato esaurito con un
  campione più ampio (7 funzioni su 47 controllate, non solo le 4
  originarie).
- Quattro ricerche di fianco raccolte (frammentazione da foto — per la
  decisione #28 ancora aperta; flyrock quantitativo/backbreak; criteri
  di selezione del tipo di esplosivo; decking/air-decking) — **nessuna
  tradotta in codice**: quasi tutti i numeri specifici trovati sono
  dichiarati dalla ricerca stessa come fonte singola non incrociata, e
  la regola di questo repository ("niente entra sulla parola
  dell'agente") vieta di costruire testo o calcoli di prodotto su
  quelle cifre senza prima riverificarle.

Dettagli completi negli ultimi checkpoint in `vault/checkpoints/` (dal
20260912-161749 al 20260912-221343).

## Prossimi passi immediati

1. Rispettare il blocco di sicurezza sopra: niente MODIFICA di
   geometria/flyrock/burden finché non arriva una risposta del fondatore.
2. Il gap P2.1 (frammentazione da foto) resta bloccato sulla decisione
   #28 in `docs/DECISIONI_WEEKEND.md`.
3. B3 è esaurito (verificato due volte, l'ultima con campione più ampio):
   non cercare altri candidati lì senza una ragione nuova.
4. Le quattro ricerche di fianco raccolte restano materiale in attesa:
   non tradurle in codice senza prima riverificare i numeri su una
   seconda fonte indipendente.
5. Continuare con una nuova ricerca di fianco su un angolo Genesi non
   ancora coperto, o con verifiche di qualità (screenshot, sonda-vuoto,
   documenti invecchiati) su superfici che non toccano il blocco al
   punto 1.

⚠️ **Nota sul prompt fisso della routine**: cita ancora la mappa dei ponti
e lo stato di Genesi come erano il 26/08. Questi fatti sono superati da
settimane di lavoro misurato — il documento vivo è
`docs/MAPPA_ECOSISTEMA.md` — e in ogni caso, finché vale la direttiva del
fondatore di questa conversazione, il lavoro resta su Genesi sola. Il
canarino di questo ciclo serve a dire che il lavoro è vivo, non a
resettare lo stato a quello del prompt né a cambiare app.
