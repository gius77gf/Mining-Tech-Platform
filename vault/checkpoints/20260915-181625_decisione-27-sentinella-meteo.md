# Checkpoint — 2026-09-15T18:16:25Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
10e0ab58

## Cosa è stato completato
Unità 41-42: riverificato di persona (grep, tutti e tre i comandi
confermati) l'ottavo giro di ricerca su Sentinella — condizioni meteo
nella valutazione dei superamenti. `misuraFuoriCondizioni` giudica
solo il rumore (gated su `tipo === "rumore"` in tre punti), con una
norma citata (DM 16/03/1998, vento/pioggia); polveri e vibrazioni ne
sono escluse, e temperatura/umidità sono raccolte ma mai lette per un
giudizio. La ricerca ha anche corretto una deduzione non verificata
del 05/09 sulle vibrazioni ("problema d'installazione, non fisica"):
l'attenuazione del terreno saturo è un effetto fisico reale.

Non tradotto direttamente in codice: senza una soglia numerica
citabile per polveri/vibrazioni (a differenza del rumore, che ha il
DM), costruire un giudizio di invalidità inventato sarebbe la stessa
famiglia di errore di un numero di legge riportato di seconda mano —
qui più insidiosa perché è un GIUDIZIO presentato con l'autorità di
una norma che non esiste per quel caso. Scritta la decisione #27 in
`docs/DECISIONI_WEEKEND.md`, con tre strade dalla più sicura (solo
contesto informativo, il meteo già calcolato mostrato anche su
polveri/vibrazioni senza nessun giudizio nuovo) alla più impegnativa
(ricerca normativa dedicata sul piano di monitoraggio del cliente,
che questo ciclo non ha).

Con questa il conto delle ricerche riverificate di persona oggi sale a
10 su 10.

## Verifica
- `numeri-nei-documenti.mjs`: 43 passati, 0 falliti (solo documenti,
  nessun codice toccato in questa unità)
- Push riuscito al primo tentativo su entrambi i commit:
  `210c08b4..ee754e17`, `ee754e17..10e0ab58`

## Stato roadmap
`docs/DECISIONI_WEEKEND.md` ha ora 27 decisioni numerate. Sei ricerche
di oggi (Genesi, Sentinella, Terra, Flotta, Campo, Conti, Scudo — sette
in realtà, contando le due su Genesi) hanno prodotto lavoro tecnico
diretto quando il delta era sicuro (etaMezzo, pagella completa,
fermi documentati, promemoria azione); tre hanno prodotto una
decisione scritta quando il delta richiedeva un giudizio del fondatore
o una norma non ancora verificata (soglia di sostituzione Flotta,
pesate nel fido Conti, meteo Sentinella).

## Prossimo passo atomico
Il ciclo prosegue senza fermarsi. Nessuna ricerca in background in
corso in questo momento. Con dieci ricerche riverificate oggi e sei
unità di codice completate, le strade aperte per la prossima unità:
1. Lanciare una nuova ricerca in background su Terra (l'unica delle
   sei app verticali che oggi non ha avuto un giro di ricerca nuovo,
   solo la correzione di una vecchia affermazione e la scomposizione
   delle sezioni trasversali).
2. Riprendere la scomposizione già avviata su Terra (sezioni
   trasversali) o Genesi (burden nel pannello foro) con la cura di un
   pattern UI nuovo, se c'è tempo.
3. Seconda iterazione UX/qualità su un'app non toccata oggi (Deepwork
   ID, o il core) — CRUD, filtri, stati vuoti, con verifica visiva
   come nell'unità 40.
Il ciclo continua senza fermarsi (regola del fondatore, mai in pausa).
