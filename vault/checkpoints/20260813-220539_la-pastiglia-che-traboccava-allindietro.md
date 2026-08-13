# Checkpoint — 2026-08-13 22:05 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimi commit
- `444f3095` — *Il core: la pastiglia che traboccava all'indietro, e un banco che
  sa vedere il traboccamento che nessuno vedeva*
- `42a8a1b9` — *il totale del giro `node` è 2.888, letto dalla copia di quello
  che si è committato*

## Che cosa è stato completato

**B0-vicies**, e la misura del cantiere ha **corretto la mia diagnosi**. La
segnalazione diceva «in chiaro, a 430 px, la pastiglia NON SALVA si sovrappone
al nome utente». Vera sul fatto, sbagliata sulla causa:

- la sovrapposizione c'era, ed è grossa: **65,31 px fuori dalla scatola del
  padre**, di cui **59,31 × 18 px sopra il nome**, con `scrollWidth ==
  clientWidth`. È il **traboccamento all'indietro** già scritto in `CLAUDE.md`:
  con `justify-content:flex-end` il contenuto che non ci sta esce dalla parte
  **opposta**, e il controllo classico sull'overflow risponde «a posto»;
- **non è un difetto del tema chiaro**: nel buio i numeri sono identici **alla
  cifra**. Il chiaro lo rende solo *visibile*, perché il bottone del tema è
  `.active` con un riempimento ambra pieno;
- la banda è **361→560 px**, peggio a **431**, e succede **anche senza** la
  pastiglia;
- ⛔ **il ramo touch era PEGGIO e arrivava fino a 320 px**, perché Chromium
  desktop non è `pointer:coarse`: il ramo che conta di più non è quello che si
  misura per primo.

E due regole `.topbar-search-input` dentro il blocco a 360 px **non avevano mai
fatto niente**: le batteva lo shorthand `padding` della regola base, trecento
righe più in giù. «Vince l'ultimo», già pagata sul core il 06/08.

## Il banco
`browser/barra-alto-indietro.mjs` (nuovo, 6 passate in `tutti.mjs`) fa **tre
domande** dove prima ce n'era una: un figlio cade fuori dalla scatola del padre?
le due metà si sovrappongono? il documento scorre? Più i bersagli di tocco.
`--tocco` **legge dalla pagina** le regole `pointer:coarse` e le trapianta: 31
regole, dichiarate nel registro invece che dedotte.

## Le misure
| | prima | dopo |
|---|---|---|
| 14 larghezze × 2 rami × 2 temi | sovrappone su tutta la banda 361→560 | **esce 0 · sovrappone 0 · scorre 0** |
| bersagli di tocco | — | **0 KO su 40** |
| contrasto testuale del core | 450/0 | **450/0** nei due temi |

⚠️ **450 e non 451**: a 430 px «NON SALVA» è adesso un pallino. **Provato**
rilanciando a 600 px, dove torna **451/0** — invece di dedurlo.

## ⛔ B0-unvicies chiusa con un NO, e il numero è la ragione
Unificare il rosso scritto a mano peggiorerebbe il **buio** di 0,56 (7,61 →
7,05). Il mandato diceva «solo se non peggiora nessuno dei due»: quindi non si
fa, e il no resta scritto col suo numero perché nessuno lo rifaccia.

## Che cos'è vivo adesso
- **Tre cantieri aperti**: B0-duovicies (i sette contrasti non testuali del core
  + l'arretrato del ramo touch), B0-quater (il clamp di Genesi che fabbrica
  5 kg/foro in due clic), B0-duodecies (i clamp di Scudo, e **solo** Scudo).
- **Il giro del browser** su `d3653ec`: vivo da 3h01, verificato **sul
  processo** (figli Chromium freschi di 1'18"). I suoi KO sul chiaro del core
  sono già chiusi da `7a217c8c`: chi legge quel registro lo sappia.

## Prossimo passo atomico
Raccogliere i tre cantieri man mano che consegnano, un commit per unità, e
aggiornare **la riga di roadmap che li aveva proposti** (è la sola cosa che fa
scendere l'arretrato dei documenti). Poi rilanciare il giro del browser sullo
stato di adesso e rimisurare i quattro banchi «numeri tranquilli» (Conti,
Terra, Sentinella, Flotta), che non girano dalle modifiche di stanotte.

## Blocchi
- **Force-with-lease sul ramo**: la CI resta rossa su **quella riga sola** —
  verificato adesso sul job `94607492967`, «orologio del vault: 7 passati, 1
  falliti», nient'altro.
- **B0-septies** e le **soglie di sicurezza**: fermi al fondatore.
