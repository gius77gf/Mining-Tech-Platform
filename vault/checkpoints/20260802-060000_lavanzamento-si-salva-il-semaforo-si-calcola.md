# Checkpoint — l'avanzamento si salva, il semaforo si calcola

- **Tipo**: unità (13 prove sul registro delle azioni correttive di Scudo)
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `1b5834c`

## Perché proprio questo

Il censimento del checkpoint precedente diceva che **Scudo era la meno coperta**
(22 funzioni su 71) e insieme quella con la posta più alta: è l'app della
sicurezza sul lavoro. E il registro delle azioni correttive è **l'altra sponda
dei due ponti di Sentinella** su cui avevo appena lavorato: chiude il giro dal
fatto ambientale all'azione, dall'altra parte.

È anche quello che la legge chiede di tracciare **insieme** agli eventi:
segnala → correggi → verifica. Infortunio, near-miss, voce non conforme di
un'ispezione, superamento ambientale, reclamo di un residente: finiscono tutti
qui, e da qui esce la risposta alla domanda «e voi cosa avete fatto?».

## La scelta di fondo che le prove difendono

**L'avanzamento si salva, il semaforo si calcola.** «Aperta / in corso / chiusa»
è un dato scritto da qualcuno; «scaduta / in scadenza / regolare» viene dalla
data, ogni volta che si guarda. Salvare anche quello significherebbe avere nel
database un'azione **«regolare» che nel frattempo è scaduta** — un dato derivato
che invecchia in silenzio, cioè la categoria di difetto che questa giornata ha
inseguito dall'inizio.

## Le altre regole

- **Un'azione senza stato è APERTA, e in rosso.** Il valore di partenza deve
  essere quello che chiede attenzione: il contrario nasconderebbe un compito che
  nessuno ha preso in carico.
- **Un'azione chiusa non scade più**, nemmeno con la data passata. Tenerla rossa
  riempirebbe il quadro di allarmi che nessuno può togliere, e allora si smette
  di guardarli.
- **Dall'evento si risale alle SUE azioni e solo a quelle**: è la catena che
  l'ispettore percorre al contrario.
- **Un'azione arrivata da Sentinella si riconosce**, perché il form di Scudo —
  che non sa da dove viene — non deve cancellarne l'origine.

## Metodo

Controprova: **8 difetti rimessi, 8 visti, 0 non visti.**

Uno ha risposto «non distingue» al primo tentativo, ed era **di nuovo difesa in
profondità**: «una chiusa non è urgente» è protetta sia dal filtro in
`azioniUrgenti` sia dal primo `if` di `statoAzione`. È la seconda volta in
giornata, e la distinzione scritta stamattina in `CLAUDE.md` ha funzionato:
tolte **tutte e due** le guardie (con la conta stampata), la chiusa e scaduta di
luglio ricompare fra le urgenti.

## Stato

- **670** KPI (433 all'inizio della giornata) → **953** prove `node`, verdi in
  UTC **e** in ora italiana
- **237 prove nuove** in giornata, **6 difetti di prodotto** corretti
- Scudo: da **22/71** a **35/71** funzioni coperte

## Prossimo passo atomico

Continuare su Scudo, che resta la meno coperta. Il gruppo successivo per posta
in gioco è quello dei **documenti e delle scadenze dei lavoratori**
(`TIPI_DOCUMENTO`, la matrice della formazione, il registro DPI): è il posto in
cui l'app dice se un lavoratore può stare in cava oggi, e una scadenza letta
male lì è una persona al lavoro senza il titolo per esserci.

## Bloccanti

- Nessuno.
