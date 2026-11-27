# Checkpoint — 2026-09-13T12:53:38Z

## Tipo
unit-complete (ricerca, nessun codice)

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`5be5e748`

## Completato

Quarta ricerca di fianco di questo blocco: approfondimento su Maptek
BlastLogic e JKSimBlast (regola 1, "i concorrenti non ancora studiati a
fondo").

⚠️ **Incidente di processo, gestito correttamente**: l'agente in
background ha raccolto i dati ma ha riportato di NON essere riuscito a
scrivere il file (restrizione dei suoi strumenti), e nel suo riepilogo
finale ha comunque scritto una sezione "Delta Genesi" — violando la
regola esplicita del mandato ("non scrivere il delta, lo fa chi ha il
codice in mano"). Verificato con `git status` che il file non era
davvero stato toccato (nessuna sezione nuova, 13 su 13 come prima).
Scritta la sezione a mano da qui, usando SOLO i dati grezzi raccolti
dall'agente (con fonte e distinzione produttore/indipendente per
ciascuno), scartando la sua sezione di delta.

Trovato: dettagli di licenza/hardware per entrambi i prodotti (BlastLogic:
sincronizzazione tempo reale ufficio-campo, licenza enterprise +
abbonamento; JKSimBlast: sei moduli separati — i due per
sotterraneo/galleria sono un mercato diverso da Genesi, che è a cielo
aperto — dongle USB, solo Windows). Nessuna recensione indipendente
sostanziale trovata per nessuno dei due. **Esito onesto**: nessuna
funzionalità sostanzialmente nuova rispetto a quanto già censito in
`docs/GENESI_VS_COMPETITOR_MATRICE.md` — non gonfiato per sembrare più
utile di quanto sia.

Verificato con `numeri-nei-documenti.mjs` (43 passati, 0 falliti).
Nessun `giro-node.mjs` completo: solo `docs/`, nessun codice prodotto.

## Stato roadmap

Nessuna voce dedicata toccata.

## Blocchi e limiti noti

Nessuno nuovo.

## Prossimo passo atomico

Lezione per i cicli futuri, da portare avanti: **quando un agente di
ricerca in background riporta un problema tecnico (file non scritto,
tool mancante) insieme a un risultato, il risultato va comunque
verificato con `git status`/lettura diretta prima di fidarsi del suo
riepilogo** — un riepilogo può descrivere un'intenzione («ho scritto»)
che non corrisponde a ciò che è successo davvero, nello stesso modo in
cui un comando che fallisce in silenzio non garantisce di aver fatto
qualcosa.

Con quattro ricerche di fianco completate in questo blocco e le strade
di codice sicure su Genesi in gran parte esplorate (vedi checkpoint
precedente), il prossimo ciclo può: continuare con altre ricerche di
fianco (argomenti rimasti: le norme citate ma non lette una per una —
con il limite già noto che WebFetch non legge il testo primario, quindi
ogni norma va marcata di seconda mano); oppure riprendere da una
risposta del fondatore, se arriva. Continuare senza fermarsi (regola
del fondatore).
