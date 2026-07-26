# Checkpoint — 2026-07-22T05:00:00Z

## Tipo
unit-complete (Doc decisione fondatore — frammentazione da foto in Genesi, da ricerca)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — doc frammentazione da foto)

## Completato
Sintesi della ricerca (Agent WebSearch, tempi morti come da regola del fondatore)
sulla fattibilità ONESTA della frammentazione-da-foto in Genesi → punto pesante
#4, gated su decisione del fondatore. `docs/GENESI_FRAMMENTAZIONE_DA_FOTO.md`,
scritto per un non tecnico, con fonti citate.
Conclusione onesta: tecnicamente si fa tutto nel browser (OpenCV.js watershed
~6–9MB, o MobileSAM ONNX ~decine di MB), MA la stima "un clic" senza taratura è
strutturalmente inaffidabile (fini sottostimati ~20%, fino a 30–100%+ nelle classi
fini; x50 sovrastimato ~50%) — e lo è anche per i leader, che infatti chiedono
taratura su vagliatura, o usano telecamere 3D, o fanno correggere i bordi a mano.
Raccomandazione: (a) SUBITO misura ASSISTITA onesta (operatore delimita+scala, tool
calcola, etichetta "stima non misura") — coerente con Genesi e col confronto misure
reali già aggiunto; (b) MobileSAM come upgrade futuro opzionale; (c) accuratezza
"da leader" richiede backend/hardware/taratura → rimandata alla commercializzazione
(spesa = decisione fondatore).

Nessun codice nuovo: è preparazione ONESTA della decisione del fondatore, non una
feature spacciata per fatta.

## Prossimo passo atomico
Attende la decisione del fondatore: procedere con (a) misura assistita? E la sua
revisione estetica di #321. Nel frattempo: altri test/confini o revisione. Verso
~21:40 UTC: ciclo serale = prima la revisione.

## Blocchi
#321 estetica: attende il fondatore. Punti pesanti Genesi (#4/#5/#6), semantica
date Conti, isolamento core: gated. Branch unico #321.
