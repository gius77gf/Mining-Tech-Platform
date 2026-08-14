# Checkpoint — 2026-08-08T02:53:03Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`199bf05` — *nomi-liberi: un a capo chiude la dichiarazione solo se la chiude davvero*

## Che cosa è stato completato

Chiuso il **dichiaratore su più righe**, che era il rimandato dichiarato nel
checkpoint precedente. La forma esiste ed è frequente:

    const numero = $("ft-num").value.trim(), scelta = $("ft-cli").value,
          nuovoCli = $("ft-cli-nuovo").value.trim(),

e `nomiDichiarati` si fermava al primo `\n`: **tutto quello che stava sotto la
prima riga risultava libero**. Quattro nomi sani accusati, più `_fSW` di Genesi
nella misura di un'ora prima. Adesso l'a capo termina la dichiarazione solo se
l'ultimo carattere non bianco prima **non è una virgola**.

## ⛔ La verifica che conta qui è il SECONDO verso

E l'avevo dichiarata nel checkpoint **prima** di fare la modifica, che è la
ragione per cui è servita: quando si **allarga** un riconoscitore il rischio
non è il rumore, è renderlo **cieco**. Un a capo interpretato male *lega* nomi
che non dovrebbe, e il controllo smette di vedere proprio i difetti veri.

Le tre controprove che portano dentro un difetto **vero** — il `conta` di
Terra, il `somma` di `terra-data.js`, il `RIPOSO_MINIMO_ORE` di Campo —
restano **tutte rosse quando devono**, e le **16 prove** passano. È quella la
prova che l'allargamento non ha spento niente.

## Il percorso della quarta forma

**35 → 34 → 9 → 7**, e ogni scalino era il **righello**, mai il prodotto:
1. il lookahead senza `\b` (prefissi: «escHtml» → «escHtm»);
2. `const[` **senza spazio** — e la mia prima diagnosi («sono commenti») era
   sbagliata, corretta nel commit `4b87ed4`;
3. undici globali e cinque parole chiave mancanti;
4. il **dichiaratore su più righe**, chiuso qui.

Dei sette rimasti, due sono già identificati: `carburante` e `i` stanno nel
**testo di un template** — la parola è nella parte letterale di una `` ` ``,
fra due `${…}`.

## Prove

Giro `node`: **23 comandi, 0 caduti**.

## Prossimo passo atomico

⏱️ **Portare la quarta forma a zero**, e allora diventa regola. Restano tre
cause, tutte dichiarabili senza toccare il prodotto:
1. `XLSX` in `DA_CDN`, **con la ragione** (libreria da CDN, come `Chart` e
   `THREE`);
2. `dwGrafici` — arriva da uno **script fratello** che non si espone con
   `window.X =`: va allargato `nomiDegliScriptFratelli`, che oggi cerca solo
   quella forma. ⚠️ E prima di allargarlo, **contare** cosa entra: è un elenco
   che alimenta **tutte** le domande, quindi allargarlo troppo le rende cieche
   — stesso rischio di stanotte, stesso secondo verso da provare;
3. `gu` (flag di regex), `carburante` e `i` (**testo di un template**): una
   causa sola, il confine fra parte letterale e `${…}` dentro una `` ` ``.

Poi:
- ⏱️ **Raccogliere `giro-6.txt`** (porta 8831): prima le righe «non ho
  guardato», poi i KO senza le controprove.

## Blocchi
Nessuno.
