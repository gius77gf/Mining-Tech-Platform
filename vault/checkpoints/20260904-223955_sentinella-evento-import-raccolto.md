# Checkpoint — 2026-09-04T22:41Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
0ecc2e61

## Completato
- Sentinella: il file del sismografo a più colonne (`proponiColonneEvento`,
  `risultanteAssi`, `campiEvento`, `descriviEvento`, `provenienzaValore`,
  mappa di `preparaLetture` con cinque colonne facoltative, CSV con
  `evento`/`valore_da` in coda, report che dichiara le colonne). Raccolto
  dalla patch del cantiere morto due volte: 10 prove nuove con tre
  controprove, banco nuovo `sentinella-evento-import` 52/0 (controprova 14
  su 52), annullate 60/0 e scheda-larghezze 107/0 sulla copia, giro node
  38/0.
- Due difetti che la patch aveva: il ripiego proponeva un asse come valore;
  il report scriveva «per tutte» con 2 risultanti su 6.
- I due cantieri sospesi sono raccolti tutt'e due: `vault/cantieri-sospesi/`
  non ha più patch in attesa.
- Documenti: prove 3.066, asserzioni 3.494, copertura 811/811, 239
  esecuzioni da 99 banchi.

## Prossimo passo atomico
La ricerca a rotazione (metà sul mondo, `WebSearch`, con fonti e marcatura
di seconda mano): Scudo o Terra, seconda tornata su un tema non ancora
fatto — per Scudo «che cosa chiede un ispettore ASL/ARPA in cava e come si
prepara la visita», per Terra «rilievo con drone: precisione dichiarata,
GCP e volume da DTM». Poi il delta dal MECCANISMO, aprendo le funzioni.
Candidato di prodotto pronto: Sentinella (c) — la frequenza dominante, ora
campo della lettura (`extra.freq`), che sceglie la banda DIN al posto della
chiave scritta a mano quando c'è (aprire `sogliaEfficace`/`SOGLIE_PRESET`
per vedere chi decide la banda oggi). Genesi (a) solo insieme al (b).

## Blocchi
Nessuno tecnico. Decisioni del fondatore aperte: 5b, 19-27, Q1; registro
esplosivi; TD24 / IPA / split payment; registro dei terzi.
