# Ultimo ciclo di lavoro automatico

- **Quando**: 2026-09-13, 05:27 UTC
- **Commit di partenza**: `7d5e9068`
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa sta per succedere

Repository raggiungibile, `HEAD` combacia col remoto, working tree pulita.

⚠️ **Direttiva del fondatore in conversazione, più recente e più specifica
del prompt fisso di questa routine**: concentrarsi SOLO sull'app Genesi
per ora. Non seguire alla lettera il prompt fisso (ponti fra le app,
passata su tutte le app) finché questa direttiva resta in vigore.

⛔ **SEGNALAZIONE DI SICUREZZA APERTA, DA LEGGERE PRIMA DI TOCCARE
GEOMETRIA/FLYROCK/BURDEN.** Un gate di sicurezza del 07/08 su
`deviazioneForiDaCsv`/`burdenVeroDaRilievo` (import del rilievo boretrack)
è stato violato senza controllarlo prima: un errore nella convenzione
degli assi dx/dy potrebbe invertire l'avviso di flyrock mostrato al
fochino. Aggiunto un avviso visibile in rosso nel pannello. **Resta
bloccato sul fondatore**: dettaglio completo in
`docs/DECISIONI_WEEKEND.md` (sezione 6) e nel checkpoint
`20260912-200615_genesi-boretrack-avviso-sicurezza.md`. Fino ad allora:
**nessuna nuova unità MODIFICA la geometria del fronte 3D, il flyrock o
il burden reale per foro** — lettura/analisi resta permessa. Il resto di
Genesi (frammentazione, vibrazioni non legate al burden, riconciliazione,
presplit, decking, export, layout, ricerca di fianco) resta aperto.

## Cosa è successo in questo blocco (unità 126-138 circa)

**Prodotto**: nuova funzione "carica per un obiettivo di pezzatura" con
tetto dimensionale onesto; import del rilievo boretrack (ora con
avviso di sicurezza); chiusa senza residui la famiglia "splash lento"
nei banchi browser (66 falliti pre-esistenti su 4 banchi, stessa causa
unica); **due difetti visivi reali trovati e chiusi con misura, non a
occhio**: la barra del titolo che copriva i comandi sulla schermata 3D
da 421 a 620px (soglia corretta da 420 a 630, causa: due HUD
`position:fixed` indipendenti), e la griglia di riconciliazione che
chiedeva di scorrere dentro il riquadro a 320-390px (colonne a
`minmax(0,…)`, campo più stretto sotto 760px, due etichette abbreviate,
un mio stesso errore — una classe orfana aggiunta per comodità di
misura — preso dal giro di verifica prima del commit).

**Sicurezza**: la scoperta e mitigazione del gate boretrack violato,
propagata a **cinque documenti** che contenevano la stessa affermazione
scaduta.

**Verifica/qualità**: B3 (funzioni estraibili) riconfermato esaurito con
campione più ampio; il termine "Lundborg" del motore flyrock verificato
**esattamente** contro la letteratura pubblica (solo analisi, nessun
codice toccato); verifica visiva sistematica di Home, 3D, Progetto 2D
(pannello parametri, tutte le sezioni aperte, presplit attivo),
riconciliazione — undici passate pulite più i due difetti sopra.

**Ricerca di fianco** (quattro round, tutti raccolti in
`docs/RICERCA_CONTINUA_GENESI.md`, **nessuno tradotto in codice** perché
i numeri specifici trovati sono quasi tutti fonte singola non
incrociata): frammentazione da foto (per la decisione #28 ancora
aperta), flyrock quantitativo/backbreak, criteri di selezione
dell'esplosivo, decking/air-decking.

Dettagli completi negli ultimi checkpoint in `vault/checkpoints/` (dal
20260912-161749 al 20260913-052259).

## Prossimi passi immediati

1. Rispettare il blocco di sicurezza: niente MODIFICA di
   geometria/flyrock/burden finché non arriva una risposta.
2. B3 è esaurito (verificato due volte): non cercare altri candidati lì.
3. Le quattro ricerche di fianco raccolte restano materiale in attesa:
   non tradurle in codice senza prima riverificare i numeri.
4. Proseguire la verifica visiva su schermate ancora non coperte (la
   scheda signature-hole con un'onda importata) — ha già reso due
   difetti reali in questo blocco, è un buon investimento di tempo.
5. In alternativa: nuova ricerca di fianco su un angolo non coperto.

⚠️ **Nota sul prompt fisso della routine**: cita lo stato di Genesi come
era il 26/08, superato da settimane di lavoro. Il documento vivo è
`docs/MAPPA_ECOSISTEMA.md`. Il canarino di questo ciclo dice che il
lavoro è vivo, non resetta lo stato né cambia app.
