# Checkpoint — 2026-07-21 — Core XSS residuo chiuso (fatto)

## Task completato
Terza e ultima passata XSS sul core (index.html): chiuso il residuo
lasciato dalla 2a passata. Bonificati con escHtml:
- attributi `value="…"` dei form di modifica: 30 campi di testo libero
  (nome, cognome, ragsoc, indirizzo, referente, email, iban, piva, cf,
  tel, user, marca, modello, targa, ruolo, esplosivo, innesco);
- testo visibile di ~19 `<option>` di select (compreso `modello
  (targa)` e `nome cognome`), via nesting `escHtml(\`…\`)`;
- campi NOTE nelle anteprime (cava, rapportino, sismo, mezzo, persona,
  cliente) e label checkbox delle cave;
- lista mezzi di strada (marca/modello/targa, foto via encodeURI);
- lista CHAT: nomi + anteprima dell'ULTIMO MESSAGGIO (contenuto
  cross-utente, alto rischio) + iniziali;
- dettaglio cliente (piva, cf, indirizzo, referente, cave collegate).
I titoli dei modali usano textContent → già sicuri.

Metodo: script Python a conteggio-guardato + regex mirate (value solo
su allowlist di campi testo; option solo dove c'è interpolazione).
Verifiche: 0 residui nelle classi display (sname/ssub/preview-val/chip)
per i campi tracciati; core da ~17 a ~140 chiamate escHtml; 3 script
inline passano node --check; core carica in Playwright senza errori.

## Commit
- d3cbea1  Sicurezza core: chiuso il residuo XSS (value form, option, note, chat)

## Prossimo passo atomico
Push + PR + merge a CI verde. Sweep XSS core considerato COMPLETO.
Prossima unità: nuovo fronte (es. revisione/altra app). Continuare fino
a esaurimento; SERALE (~21:40 UTC) = revisione COMPLETA. MAI fermarsi.
