# Checkpoint — 2026-07-22T07:20:00Z

## Tipo
unit-complete (Ricerca vibrazioni Sentinella → doc roadmap onesto)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — doc roadmap Sentinella)

## Completato
Rotazione di ricerca "nei tempi morti" (regola del fondatore) sull'app
Sentinella (monitoraggio vibrazioni da volata). Sintesi in
`docs/SENTINELLA_VIBRAZIONI_ROADMAP.md`, founder-facing e onesta.
Messaggio centrale = principio anti-gonfiatura del fondatore: Sentinella
**PREVEDE e DOCUMENTA**, non MISURA (PPV/frequenza/airblast reali richiedono
un sismografo calibrato). Ogni valore va etichettato "PREVISTO/STIMA".
Contenuti actionable (tutti pubblici, implementabili come lookup/formule):
limiti frequency-based DIN 4150-3 / USBM RI 8507 / OSMRE / BS 7385 (soglie
CONFIGURABILI perché in Italia non esiste un limite nazionale: lo fissa la
prescrizione locale via UNI 9916/DIN); legge di attenuazione PPV=K·SD^-β
(β≈1,6); carica max per ritardo; airblast in dB; report di conformità.
Confine hardware chiaro: frequenza dominante e misura reale = sismografo.

Verificato lo stato attuale dell'app: Sentinella è GIÀ onesta nel suo scopo
(logbook + calcolo SD + soglie; le "misure" le inserisce l'utente dai propri
strumenti; non pretende di misurare). Quindi nessun bug di gonfiatura da
correggere ora; le nuove feature (1–7 del doc) sono DECISIONI del fondatore.

## Prossimo passo atomico
Le feature Sentinella (predittore PPV, libreria soglie normative, report
conformità) sono ad alto valore ma vanno decise/verificate col fondatore
(soglie sui testi ufficiali). Continuare la rotazione ricerca su un'altra app
o attendere il fondatore. Verso ~21:40 UTC: ciclo serale = revisione prima.

## Blocchi
#321 estetica + punti pesanti Genesi + feature Sentinella + semantica date
Conti + DEFAULT_USERS: gated sul fondatore. Branch unico #321.
