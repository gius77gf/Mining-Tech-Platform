# Checkpoint — 2026-07-23T17:00:00Z

## Tipo
unit-complete (PWA — le 6 app verticali diventano installabili su telefono)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — conti/flotta/scudo/campo/sentinella/terra index.html)

## Completato
Il core (index.html radice) e Genesi avevano già il **manifest PWA** (installabili
sul telefono, schermo intero, colore tema); le 6 app verticali NO — non si potevano
installare sulla home del telefono di un operatore in cava. Aggiunto a tutte e 6:
- `<link rel="manifest">` con manifest inline (data URI, stesso schema di core/Genesi):
  nome "Deepwork <App>", `display:standalone`, `theme_color` = accento dell'app,
  icona SVG (quadrato con l'iniziale, colore distintivo per app), lang it.
- Meta tag `theme-color` + `apple-mobile-web-app-capable`/`mobile-web-app-capable`/
  status-bar-style/title, così anche iOS e Android le trattano come app a schermo intero.
Rischio nullo: solo tag `<head>` e un `<link>` (NIENTE service worker, niente cache,
niente JS a runtime). Valore reale: un fochino/operatore può mettere Scudo, Campo,
Terra… sulla home come app, utile sul campo con poca connettività.

## Verifica
Syntax inline OK (6 app). Tutti e 6 i manifest fanno JSON.parse (decodifica data URI
→ nome/theme/icona corretti). Smoke browser (Conti): il browser carica e parsa il
manifest (name "Deepwork Conti", display standalone, theme #0e9384, icona svg); nessun
errore di pagina — le uniche risorse fallite sono font Google/Firebase esterni bloccati
dal test (data URI del manifest non fa rete).

## Prossimo passo atomico
Never-stop: rotazione fallback. Le verticali sono ora installabili come le altre
superfici. Prossimo: altra iterazione / test / revisione, evitando churn.

## Blocchi
Nessuno (solo <head>). Gated: passo 3 drone (dato reale), #321 estetica.
