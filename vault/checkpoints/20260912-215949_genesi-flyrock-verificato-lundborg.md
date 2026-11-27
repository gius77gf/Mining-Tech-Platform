# Checkpoint — 2026-09-12T21:59:49Z

## Tipo
analisi/confronto con la letteratura (nessun codice toccato — permesso dal blocco di sicurezza perché è lettura, non modifica)

## App
Genesi (direttiva del fondatore ancora in vigore: solo Genesi)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`b338757e`

## Completato

Chiuso l'item lasciato aperto nel checkpoint precedente: confronto
formula-per-formula fra `flyrockEst()` (`genesi.html`, righe ~1621-1676) e
la ricerca flyrock/backbreak raccolta oggi. **Nessuna riga di codice
toccata**: solo lettura e calcolo di verifica.

**Risultato più importante**: il termine "Lundborg" del codice,
`Llund = 30.1 * Dmm^(2/3)`, è **verificato esattamente** contro la
formula pubblica `Lm = 260 * D_pollici^(2/3)` — la conversione da pollici
a millimetri dà `260/25.4^(2/3) = 30.0897`, calcolato con `python3`, non a
occhio, e coincide con la cifra nel codice alla quarta cifra
significativa. Non è un nome messo su una formula qualunque: è
letteralmente la formula di Lundborg (1975), scritta giusta.

Gli altri due termini ("McKenzie", "Richards & Moore") sono
strutturalmente coerenti coi principi trovati nella ricerca di oggi, ma
**non verificabili al coefficiente/esponente esatto**: la ricerca non ha
trovato le formule esplicite pubblicate per nessuno dei due (solo
descrizioni concettuali, e per Richards & Moore una sola fonte non
incrociata con una forma diversa). Dichiarato onestamente come "non
verificabile con le fonti raccolte", non come "sbagliato" né come
"confermato".

**Nessuna correzione proposta o applicata**: anche se una fonte primaria
futura mostrasse una differenza nei coefficienti, la modifica del motore
fisico di Genesi resta condizionata al via libera del fondatore — stessa
regola della segnalazione di sicurezza di oggi su burden/boretrack. Il
valore di questa unità è la VERIFICA, non un cambiamento.

## Stato roadmap

Nessuna voce toccata.

## Blocchi e limiti noti

Invariati: nessuna nuova unità MODIFICA geometria del fronte 3D, flyrock o
burden reale finché il fondatore non risponde a `docs/DECISIONI_WEEKEND.md`
§6. La lettura/analisi resta permessa, come dimostra questa stessa unità.

## Prossimo passo atomico

Con l'audit documenti e l'analisi del flyrock chiusi, resta in corso una
ricerca di fianco lanciata in background su un angolo non ancora coperto
(criteri pratici di selezione del tipo di esplosivo — ANFO/emulsione/
gelatinoso — in funzione di acqua, roccia, diametro, tempo di permanenza
in foro). Da raccogliere quando torna e valutare se arricchisce il testo
d'aiuto già presente nel catalogo esplosivi di Genesi (basso rischio:
non tocca soglie di sicurezza né geometria). In alternativa, restare in
attesa di una risposta del fondatore sulla segnalazione aperta.
