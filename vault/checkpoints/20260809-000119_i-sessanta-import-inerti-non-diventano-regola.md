# Checkpoint — 2026-08-09T00:01:19Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`ba76ecb`

## Task completato

**I «60 import inerti» non diventano una regola, e adesso la decisione è
scritta coi numeri.**

`nomi-liberi` misurava la quinta forma (importati e mai usati) e in **due
punti** diceva «MISURA, **non ancora** regola». Non è una descrizione: è un
**invito**, e prometteva pure la strada — «diventa regola quando le righe
inerti sono state tolte dalle pagine».

Guardati **uno per uno**, la conclusione è l'opposta: **un import inerte non è
un difetto, è quasi sempre il segno che una decisione è SALITA dove doveva.**
- `campo: csvCell` — Campo non compone più nessuna cella a mano: i suoi quattro
  file li costruiscono `csvAppello`, `csvStorico`, `csvAttivita`, `csvSquadre`
  **nel modulo**. L'import è il residuo di un refactor **giusto**;
- `sentinella: CSV_VOLATE_INTESTAZIONE` / `CSV_RICETTORI_INTESTAZIONE` — le usa
  il modulo dentro `csvRegistroVolate` e `csvRicettori`: la pagina **delega
  invece di ricopiare**;
- `flotta: AVVISO_DECIMALE` / `AVVISO_MIGLIAIA` — Flotta li **mostra già**,
  attraverso `messaggioNumero`, che se li porta dentro.

Toglierli vorrebbe dire toccare **dieci pagine per zero difetti misurati**: la
stessa contabilità con cui è stata scartata la scala `--nav-scala`.

## Le tre cose imparate

1. ⛔ **«Non ancora» è un invito, non una descrizione.** Una misura che si
   dichiara «regola mancante» verrà prima o poi trasformata in regola da
   qualcuno che non rifà il conto. Se la decisione è **non farla**, va scritta
   dove sta il numero — ed era scritta in due punti, quindi andava corretta in
   due punti.
2. ⚠️ **Anche la versione STRETTA è stata provata e scartata, col conto.** «La
   pagina importa una costante di testo **e** scrive lo stesso testo a mano?»
   dà **2 allarmi, tutti e due falsi**: sono le due righe di Flotta che
   scrivono l'avviso sulle migliaia **con l'esempio del proprio campo**
   («6000, non 6.000» invece del generico «1250, non 1.250»). Non è una copia
   debole, è una **specializzazione**, ed è **migliore** della costante. Due
   falsi e zero veri non si meritano una regola.
3. ⚠️ **La misura resta, e serve**: un numero che salta di colpo dice che
   qualcuno ha spostato del codice, ed è il momento di guardare. Quello che
   cambia è la frase intorno — da «regola mancante» a «MISURA per scelta».

## Verifiche
- `nomi-liberi`: **24 passati, 0 falliti** (misura invariata: 1032 import su 21
  file, 60 inerti)
- `node giro-node.mjs`: **32 comandi a posto, 0 caduti**
- identità della patch verificata, e la suite toccata **rilanciata sulla copia**
  di ciò che si committa

## Stato roadmap
Filone «i numeri che mentono con la faccia tranquilla»: la domanda *«chi decide
i numeri di ciò che ESCE?»* è **chiusa su tutte le superfici**, terza gamba (la
frase contro il file) compresa — Flotta, Conti, Scudo, Campo, Genesi e il core.

## Prossimo passo atomico
**Leggere il giro del browser** (pid 32676, registro
`scratchpad/resp/giro/registro4.txt`) quando ha finito.
⛔ Prima domanda: **«sta ancora scrivendo?»**, non «che cosa dice» — si guarda
che esista il processo figlio e che il file cresca. Alle 00:01 era a **12
passate** su ~196: ha davanti alcune ore.
Poi `node apps/deepwork-id/tests/browser/leggi-giro.mjs <registro>` in
quest'ordine: **sezione 0** (età: attesta `7cddb59`, pochi commit indietro) →
**righe «non ho guardato»** → **KO veri**.
Da questo giro i KO non sono più gonfiati dal riepilogo finale (`cc8225e`): sul
registro precedente il conto diceva 47 e ne erano **10**.

## Blocchi
Nessuno.

## Note
Cinque unità in questo blocco, tutte committate e spinte: la terza gamba su
Genesi (`fe55bb6`), il riepilogo che gonfiava i KO (`cc8225e`), l'eccezione che
nascondeva sei iniezioni scadute (`bfa4517`), la frase del CSV dei fori nel core
(`7581402`) e questa (`ba76ecb`).
