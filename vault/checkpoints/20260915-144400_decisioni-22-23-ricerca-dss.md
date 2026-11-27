# Checkpoint — 2026-09-15T14:44:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
b2fa2372

## Cosa è stato completato
Diciannovesima unità del ciclo odierno: chiusi i due giri di ricerca di
oggi (ottavo su Scudo, settimo su Conti) scrivendo le loro uniche voci
rimaste aperte come decisioni per il fondatore in `docs/DECISIONI_WEEKEND.md`:

- **Decisione 22** (Scudo): quale delle tre scadenze INAIL tracciare (48h
  comunicazione statistica, 2gg Mod. 4bis, 24h mortale/pericolo di vita),
  con tre strade proposte (solo la più urgente / tutte e tre automatiche /
  solo il documento da allegare) e i costi di ciascuna.
- **Decisione 23** (Conti): uno scoring cliente — sì/cruscotto/no, e con
  quali classi — spiegando perché è un giudizio su un cliente vero e non
  un calcolo neutro (principio del fondatore: l'assenza di dati non è un
  dato favorevole, quindi un cliente nuovo va distinto da uno rischioso).

Aggiunte entrambe anche alla tabella dell'indice (regola di
`numeri-nei-documenti.mjs`), seguendo lo stesso posto dove vivono le
decisioni 19-21.

In parallelo, lanciato un agente di ricerca in background (haiku) sul
D.Lgs 624/96 (norma citata nel prodotto ma mai letta articolo per
articolo) — è tornato con una ricerca ben fondata (fonte primaria
Parlamento.it, dichiarazione preliminare di ciò che Scudo fa già) appesa a
`docs/RICERCA_CONTINUA_NORME.md` (404 righe, append). Tre proposte non
ancora verificate di persona: distinguerebbe un'ATTESTAZIONE annuale
(art. 6 c.2) da una REVISIONE dovuta solo dopo eventi/modifiche
significative (c.3), mentre lo scadenzario `dss-certif` di Scudo oggi le
confonde, con un semaforo rosso a 13 mesi che la norma non richiederebbe.
Non implementato: tocca come l'app segnala la conformità all'ispettore,
va riverificato sulla fonte primaria prima di cambiare comportamento.

## Verifica
- `numeri-nei-documenti.mjs`: 42→43 dopo aver aggiunto le due decisioni
  alla tabella dell'indice (la regola "nessuna decisione resta fuori dalla
  porta d'ingresso" era caduta su 22 e 23 mancanti, corretto e riverificato)
- Nessun file di codice toccato in questa unità: solo `docs/`
- Giro isolato su worktree (`/tmp/wt-decisioni-norme`, ora rimossa):
  `numeri-nei-documenti.mjs` 43/0 sulla copia del committato
- Push riuscito al primo tentativo: `f5d43f76..b2fa2372`

## Stato roadmap
Vedi `vault/ROADMAP_SETTIMANA.md`. Ottavo giro Scudo e settimo giro Conti
ora chiusi su tutto ciò che si può fare senza il fondatore — le uniche voci
rimaste sono le decisioni 22 e 23, appena scritte. Nuova ricerca aperta su
`docs/RICERCA_CONTINUA_NORME.md` (D.Lgs 624/96/DSS), da riverificare.

## Prossimo passo atomico
Riverificare di persona (non sulla parola dell'agente) la proposta della
ricerca sul DSS: aprire la fonte primaria citata
(https://www.parlamento.it/parlam/leggi/deleghe/96624dl.htm, art. 6) con
WebSearch/lettura diretta, confermare che il comma 2 parla davvero di
un'attestazione (non una revisione) e il comma 3 lega la revisione a
eventi/modifiche significative, non a una cadenza fissa. Se confermato:
decidere se `dss-certif` deve smettere di generare un semaforo "scaduto"
a 13 mesi (la norma non fissa quella soglia) e sostituirlo con un
promemoria neutro — è un cambiamento di COMPORTAMENTO su come Scudo
segnala la conformità, quindi va misurato con cura (screenshot prima/dopo,
controprova) prima di committarlo, seguendo la stessa disciplina delle
unità di oggi. In alternativa, se la settimana ha già chiuso tutte le
ricerche pronte per l'azione, aprire un NUOVO giro di ricerca in
background su un'altra app (direttiva 5: più cantieri insieme) mentre si
lavora su questa o su una seconda iterazione estetica/UX di un'app già
spedita. Il ciclo continua senza fermarsi.
