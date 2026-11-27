# Checkpoint — 2026-09-10T21:57:26Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
86d1ef03

## Completato
`contrasto.mjs`: i `<text>` dentro `svg[aria-hidden]` si contano e non si
giudicano (vetrina 5 KO → 0, controprova che cade). CLAUDE.md: tre lezioni
del 10/09 (elementFromPoint e pointer-events:none; il rosso cronico nasconde
il rosso nuovo; una passata per app trova i difetti di tutte) più il
riavvio del contenitore. Genesi guardata. Roadmap: voce «IL RIGHELLO DEL
CONTRASTO E IL TESTO DENTRO IL MARCHIO».

## Metodo (per chi rifà la passata su un'altra app)
Le sonde dello scratchpad (`cammina`, `tacche`, `catlab`, `tabelle`, `riga`,
`fl`) sono SPARITE col riavvio del contenitore: il metodo resta in CLAUDE.md
(fette da 1400 px con `clip` di Playwright, lette tutte; una sonda che misura
per ogni sospetto; l'arretrato dichiarato dei banchi letto prima dei KO). Chi
le riscrive le mette in `tests/browser/`, non nello scratchpad.

## Prossimo passo atomico
1. Rilanciare il giro FILTRATO del browser su una copia di HEAD:
   `node apps/deepwork-id/tests/browser/tutti.mjs --solo=grafici-tacche,fuori-schermo,contrasto,barra-etichette,disegni,unita-maiuscole,finestra-caricamento,modali-dentro,pagine-vive --limite=900 > <registro> 2>&1`
   (52 passate su 269; il precedente era arrivato a metà con i soli 5 KO della
   vetrina, ora chiusi); leggerlo con `leggi-giro.mjs` — sezione 0, «non ho
   guardato», KO veri — e chiudere ciò che è vero.
2. Nel frattempo (senza toccare i banchi): la passata sulle QUATTRO pagine di
   Deepwork ID (accesso, profilo, amministrazione, non autorizzato), sonda da
   riscrivere in `tests/browser/`.

## Blocchi
Nessuno.
