# Terra: il piano a lotti, lo strato dati

**Data:** 01/08/2026 · **App:** Terra
**Unità precedente:** `20260801-011500_la-chiusura-del-mese-la-schermata.md`

## Cosa è stato fatto

`STATI_LOTTO`, `statoLotto`, `divarioRecupero`, `avanzamentoLotto` — le
funzioni del piano di coltivazione a lotti, trapiantate dal banco dove erano
già verdi a 13 prove.

Il punto di partenza è una frase che **Terra scrive già**: nelle prescrizioni
dell'atto, mostrate nella scheda dell'autorizzazione, c'è «recupero ambientale
contestuale alla coltivazione, **lotto per lotto**». L'app enunciava l'obbligo
e non aveva nessun modo di mostrare che venisse rispettato — la parola *lotto*
compariva **una volta sola** in tutto il modulo, dentro quella stessa stringa.

## Le tre decisioni

1. **Zero lotti registrati non è divario zero**, è divario **non misurato**. Uno
   «0 m² in ritardo» in verde su un'app che non sa niente dei lotti è il numero
   tranquillo dove non è stato misurato niente — e stavolta finirebbe davanti a
   chi fa vigilanza.
2. **«Tutti recuperati» e «nessun lotto» restano distinti per costruzione.** Se
   dessero lo stesso zero, la cava più diligente e quella che non ha mai
   registrato niente si leggerebbero uguali. La prova confronta i due
   `misurabile`, non i due numeri.
3. **Sei stati, non due.** Fra «esaurito» e «recuperato» c'è tutta la distanza
   che l'ente misura, e **`collaudato` non è `recuperato`**: il primo lo dice
   l'**ente**, il secondo l'azienda. Confonderli mostrerebbe come chiusa una
   pratica che nessuno ha verificato — la stessa differenza fra «l'ho fatto» e
   «qualcuno l'ha controllato» che vale in tutta Scudo.

E `avanzamentoLotto` **non stima**: senza volume di progetto non c'è
percentuale, c'è un volume misurato — che è già un dato, e più affidabile.

## Le prove

Cinque `test` nuovi (**1063 → 1068**), e due controprove rimesse nel modulo:
togliendo la guardia dei lotti vuoti e quella di `+null`, cadono esattamente le
due prove che portano quel nome.

⚠️ `copertura-funzioni.mjs` ha subito chiesto conto di `STATI_LOTTO`: esportato
e mai nominato da una prova. La prova che ho aggiunto **non è una formalità** —
fissa l'ordine dei sei stati e che `statoLotto` li riconosca tutti senza
ricadere sul primo. Il fondo di Terra è salito da 40 a 46.

⚠️ E ho scritto **446** nei documenti a occhio quando il censimento contava
**444**: corretto dal numero misurato. È il terzo conteggio scritto a memoria
che sbaglia in tre giorni, ed è esattamente perché `numeri-nei-documenti.mjs`
esiste.

## Prossimo passo atomico

**La schermata dei lotti in Terra**: la collezione `lotti`, l'elenco con la
sequenza e il semaforo, il divario in cima — che resta **«non misurato»** finché
nessun lotto è registrato — e `volumeMisuratoDiLotto`, cioè il ponte coi
rilievi che permette di dire «previsti 180.000 m³, **misurati** 96.400» invece
di fidarsi del progetto.

In coda, con le funzioni già provate in banco: l'**analisi della causa** in
Scudo (12 prove), dove il pezzo che vale è che il nome di una persona **non si
indovina, si cerca** nella collezione `lavoratori`.
