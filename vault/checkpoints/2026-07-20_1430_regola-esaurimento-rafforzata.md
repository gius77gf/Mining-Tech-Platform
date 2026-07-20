# Checkpoint — 2026-07-20 — Regola esaurimento RAFFORZATA (fondatore, 2ª volta)

## Cosa è successo
Il fondatore ha corretto per la SECONDA volta lo stesso errore: il
blocco precedente si è "chiuso" volontariamente con un bilancio,
invece di proseguire fino all'esaurimento dei crediti. CAUSA TROVATA:
il template della skill weekly-kickoff diceva letteralmente "roadmap
esaurita... fermati" e CLAUDE.md aveva l'ambiguo "fermarsi sempre su
un punto stabile".

## Correzioni applicate (tutte e tre le sedi)
1. Cloud Routine ricreata: trig_01QSJQBFsF2mNB9wuHksoSCD, stesso
   cron (40 1,6,11,16,21 * * 1-5 UTC, agganciata a questa sessione),
   prompt con divieto esplicito di chiusura volontaria + lista "SE LA
   ROADMAP SEMBRA FINITA, NON È FINITA" (seconde iterazioni →
   rimandati censimento/ricerca → registro progettato-vs-reale →
   test → revisione main → approfondimenti, poi da capo).
2. Skill .claude/skills/weekly-kickoff/SKILL.md: template corretto
   (il "fermati" è diventato "NON fermarti: prosegui con la lista").
3. CLAUDE.md punto 3 riscritto: il punto stabile serve SOLO a rendere
   sicura l'interruzione forzata, mai a giustificare una fermata.

## Prossimo passo atomico
PR di questi file verso main, merge, e PROSEGUIRE SUBITO il lavoro in
questa stessa sessione (il fondatore lo ha appena ordinato): prossima
unità = seconde iterazioni Scudo (filtro/ricerca lavoratori, stati
vuoti nelle liste, validazione form) a piccole unità con verifica
Playwright; poi Campo, Flotta, Conti, Sentinella, Terra; poi registro
progettato-vs-reale. Fino ad esaurimento crediti.
