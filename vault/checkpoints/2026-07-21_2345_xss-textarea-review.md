# Checkpoint — 2026-07-21 — XSS textarea (revisione completezza) (fatto)

## Task completato
Revisione di completezza dello sweep XSS del core: una ri-scansione di
TUTTO il codebase ha trovato residui NON coperti dalle tre passate
precedenti — soprattutto il contesto `<textarea>...</textarea>`, mai
trattato prima (un valore con `</textarea><script>` sarebbe un
breakout). Corretti:
- 8 textarea: note di cliente (2 form), sensore, mezzo (2 form),
  persona, foro, fronte → ora `${escHtml(X.note||'')}`;
- 8 punti element-context: targa nelle scadenze mezzi (home),
  cliente nell'anteprima cava, operazione + note nelle liste
  manutenzioni, note in controlli e rifornimenti, s.note nella lista
  sensori, iniziali avatar utenti (u.nome[0]/cognome[0]).

Verifiche: sintassi OK sui 3 script inline; core carica senza errori;
round-trip textarea provato in Playwright (una nota con
`</textarea><b>x</b> & "fine"` torna IDENTICA via .value → i form di
modifica funzionano e sono a prova di breakout). Re-scan finale: 0
textarea grezze, 0 note grezze in ssub.

Le app/pagine ID erano già pulite (verificato nello stesso scan).
Sweep XSS del core ora COMPLETO su tutti i contesti (elemento,
attributo-valore, option, textarea, note, chat, sorgenti immagine).

## App/ID pulite
Scan su apps/*/index.html e apps/deepwork-id/*.html: nessun residuo.

## Commit
- fbbce7a  Sicurezza core: XSS nelle textarea e residui (4a passata, review)

## Prossimo passo atomico
Push + PR + merge a CI verde. Continuare fino a esaurimento. MAI
fermarsi volontariamente.
