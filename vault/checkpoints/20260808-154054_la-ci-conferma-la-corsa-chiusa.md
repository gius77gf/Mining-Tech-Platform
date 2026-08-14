# Checkpoint — 2026-08-08 15:40 UTC

## Tipo
verifica

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Che cosa è stato verificato
La domanda lasciata aperta due checkpoint fa: **la correzione del rifiuto non
gestito ha chiuso la corsa?** In casa la controprova diceva «non distingue» —
`process.exit(0)` arriva prima che il rifiuto emerga — quindi l'unico giudice
era la CI, e l'ho detto invece di spacciare una verifica che non avevo.

**Risposta: sì.** Gli esiti della CI sul branch, letti uno per uno:

| commit | esito |
|---|---|
| `81f6e76` | **failure** — la sonda uccisa dal rifiuto |
| `cf61f62` | **failure** — stesso |
| `af1c2f7` | **failure** — stesso |
| `d4c7bea` | ✅ **success** — la correzione |
| `19b5540` · `924c442` · `ffffbf0` | ✅ **success** |

Cioè: tre rossi di fila, la correzione, e quattro verdi. Il difetto era quello,
ed è chiuso.

⚠️ E vale la pena scriverlo perché è la parte che si dimentica: **«nessuna
notizia» non era una prova.** Le segnalazioni di fallimento arrivano da sole,
ma un controllo che non ha mai girato non manda niente — leggere gli esiti uno
per uno costa una chiamata, e toglie la differenza fra «credo sia a posto» e
«è a posto».

## Il filo della giornata, per chi legge domani
Due volte oggi «verde in casa, rosso in CI», con la stessa forma — **le due
esecuzioni non sono la stessa cosa**:
1. la mattina, un **secondo scrittore** che qui non gira (`rebuildClaims`
   nell'emulatore delle funzioni);
2. il pomeriggio, **l'ordine in cui due cose arrivano** (un rifiuto contro
   `process.exit`).
La cura non è «lanciare più cose in casa»: è **chiedersi che cosa c'è là e qui
no**, prima di scrivere l'asserzione.

## Prossimo passo atomico
Gli **ultimi due siti** dei dodici della misura 5b: la correzione di una lettura
già dentro, e il punto che scrive `letture` insieme a `valore` dalla scheda.
Poi resta solo la **coda offline**, che va per ultima e **nel browser**.

## Blocchi
Nessuno.
