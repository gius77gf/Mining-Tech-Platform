# Lo stato che non può stare in vetrina

**Data:** 01/08/2026 · **Area:** `apps/deepwork-id/tests/browser/stati-non-misurati.mjs`
**Unità precedente:** `20260801-182000_la-prova-puntata-sul-percorso-sbagliato.md`

## La condizione rimasta in fondo alla lista

L'ultima voce di «non calcolabile» era il **cartellone di Campo**: quando i
minuti di fermo registrati **superano** la durata dichiarata del turno, la
disponibilità non si calcola e l'app lo scrive. Il commento del modulo lo dice
meglio di me: *«una percentuale negativa sarebbe una bugia con l'aria di un
dato: si dice invece che i due numeri non tornano»*.

Misurata la dimostrazione **prima** di decidere, come dice la regola di ieri:
un turno solo (`Mattina`, 8 h, 55 min di fermo, 89%). Lo stato `"oltre"` **non
c'è**, e il `.board` che lo disegna non lo vede nessuno.

## ⛔ E la risposta non era «aggiungere il caso alla dimostrazione»

Il criterio scritto stanotte — *un caso da dimostrare deve poter mancare senza
portarsi via il resto* — questo lo lasciava passare: sarebbe bastato un turno
in più, additivo, che togliendolo non porta via niente. Ma applicandolo è saltata
fuori **una distinzione che quel criterio non fa**, ed è più importante di lui.

Tutti gli altri stati di questo banco sono **ASSENZE**: un lotto senza fronte,
un anno senza rilievi, una fattura senza scadenza, una persona che nessuno ha
spuntato. Un'assenza nei dati d'esempio è una cosa che il prodotto **sa
raccontare**, e mostrarla è un pregio — è la ragione per cui `run-demo.mjs`, dal
01/08, pretende che la dimostrazione possa contenere la fattura senza scadenza.

Questo invece è una **CONTRADDIZIONE**: i due dati ci sono tutti e due e non
tornano fra loro. Non è uno stato della cava, è **lo sbaglio di chi compila**.
Metterlo nei dati d'esempio vorrebbe dire mettere in vetrina una cava che tiene
male i conti — ed è esattamente il confine che `run-demo` traccia fra il dato
**assente** (ammesso, anzi utile) e quello **corrotto** (vietato). Una
contraddizione sta dalla parte del secondo.

Quindi: **nessun dato aggiunto**. Si fa quello che farebbe l'utente — si
dichiara mezz'ora di turno su un turno che ha già 55 minuti di fermo — e si
guarda che cosa scrive l'app. Che è anche il momento in cui questo stato capita
davvero: non lo si trova in archivio, lo si crea digitando.

## Il banco ha imparato il quarto gesto

`prima` accettava **un** passo (click a testo, tendina, scrittura). Questo stato
ne vuole **due**: scrivere le ore e poi toccare «Dichiara la durata». Adesso
`prima` è un passo **oppure un elenco di passi in ordine**, e c'è la quarta
forma `{tocca}` — un bottone preciso, con l'attesa più lunga perché la pagina
deve **salvare** prima che si misuri.

Un elenco invece di un secondo campo `poi`: il terzo passo si aggiunge senza
inventargli un nome.

⚠️ Il caso è **tenuto per ultimo** fra quelli di Campo, ed è scritto lì:
è l'unico del banco che **scrive** nella dimostrazione, quindi un caso messo
dopo misurerebbe una pagina che il banco ha già cambiato.

## La controprova

Tolta la guardia (`if (fermiMin > durataMin)` → `if (false)`, −15 caratteri, una
sola occorrenza, riportata dallo script): la pagina torna a stampare una
percentuale — **negativa** — e il banco cade sul caso giusto, **57 prove, 1
fallita**, con il messaggio «non compare in `#disp-stato`». Ripristinato dalla
radice del repo, `git diff` vuoto sul modulo.

⚠️ Il ripristino è avvenuto **dopo** che il contesto di Campo aveva finito
(l'ultima riga di Campo era già stampata) e nessun'altra app carica
`campo-data.js`: la regola «non si iniettano difetti mentre gira un giro» è
rispettata, non aggirata.

## Verifica

`stati-non-misurati` **58/0** — 30 stati cercati, 6 app (erano 56/0 e 26).
`run-stile` 271/0, `run-kpi` 1121/0, `suite-collegate` 3/0 su 46 file.

## Prossimo passo atomico

La voce successiva della classifica di `stati-sorvegliati`: **«non registrato»,
quattro app**. Guardate in anticipo, e tre su quattro sono stati veri:

- **Conti** · «incassata, data non registrata» — e la dimostrazione **lo
  produce già**: `f5` è incassata senza `dataIncasso`. Il numero tranquillo qui
  sarebbe leggere solo «incassata»;
- **Scudo** · «Formazione non registrata» (pastiglia rossa della matrice) e
  «addestramento non registrato» (registro DPI: consegnato un DPI che vuole
  addestramento, e l'addestramento non risulta);
- **Terra** · `origineDi` risponde `{da: "non registrata", noto: false}` — ma il
  `noto` lo consuma `descriviOrigine` **dentro il modulo**, che è il disegno
  giusto (regola 7 di `run-stile`): da verificare se arriva a schermo prima di
  metterlo nel banco;
- **Flotta** · «Pezzo non registrato in magazzino» è il **suggerimento di un
  campo**, non uno stato: si dichiara e non si guarda più.

Per ognuno vale l'ordine imparato: prima si misura se la dimostrazione lo
produce, e solo dopo si decide fra aggiungere dati, digitare, o solo scrivere
la riga del banco.
