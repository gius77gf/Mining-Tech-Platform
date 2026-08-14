# Checkpoint — 2026-08-13 19:59 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`7a217c8c` — *Il core nel tema chiaro: da 61 testi sotto soglia a zero, e la
causa era una*

## Che cosa è stato completato

**B0-quindecies.** Tre iterazioni col confronto affiancato, sulla stessa
superficie e sugli stessi 451 testi:

| | chiaro | scuro |
|---|---|---|
| partenza | **61** | 0 |
| 1 · inchiostri di testo nominati e scuriti | 11 | 0 |
| 2 · i colori dentro le stringhe JS, il gradiente-testo | **0** | 0 |
| 3 · passata estetica dagli scatti + pallini di sezione | **0** | 0 |

Rimisurato **da me** sulla copia di quello che si committa: chiaro **451/0**,
scuro **451/0**.

**La correzione sta nella palette**, non nei sessantuno punti: undici token
nuovi col conto misurato scritto accanto, e nel `:root` valgono `var(--…)` —
così **il tema scuro non può cambiare per costruzione**.

## Le tre cose che questa unità insegna

1. **Gli 11 rimasti dopo la prima iterazione** sono la regola *«un censimento
   che cerca UN nome»*: si cercava `color:var(--X)`, e quei colori stavano
   **dentro stringhe JS** (venti punti), in due `#ef5350` a mano, e nel
   **gradiente che dipinge il testo** dei numeroni — che non è un colore.
2. ⛔ **Il caso a forbice larga aveva la causa sbagliata scritta accanto.**
   `.addbtn` non compare in nessuna delle 26 sezioni: quel numero esiste solo
   nel campione che il banco pianta, e a riposo fa 6,39 / 7,15 / 6,11. Ma
   `1,90:1` su bianco è **alla cifra** `#ffab00` su `#ffffff`, e l'unico
   `#ffab00` che quel bottone può avere è il suo `:hover`. **L'accusa era vera
   su uno stato reale** — col dito sopra, in chiaro, era illeggibile — e la riga
   del banco la attribuiva a uno scarto «fra superfici» quando lo scarto è **fra
   due stati**. Dopo: 6,16:1.
   > Una forbice larga dice «guarda meglio», non «l'accusa è falsa»: la prima
   > volta (08/08) erano quattro accuse false, questa volta era la **causa**
   > scritta male accanto a un'accusa giusta.
3. ⚠️ **Una strada scartata con la misura**: scurire `--amber` dentro
   `light-mode` invece di dare un nome nuovo. Sette punti scrivono
   `background:var(--amber);color:#100d07`, dove il nero fa **10,23:1**;
   scurendola al minimo che serve al testo quei sette scendono a **3,78:1**.
   Sarebbe stato lo scambio di un difetto con l'altro.

## E il totale del giro `node` è stato LETTO, non previsto
I documenti dichiaravano **2.839** asserzioni; il giro ne esegue **2.881**.
Corretti i due punti, e il giro rilanciato sulla copia finale **non stampa più**
«i numeri scritti nei documenti NON tornano»: **33 comandi a posto, 1 caduto** —
solo `date-checkpoint`.

## Tre voci nuove, dichiarate invece che forzate
- **B0-novodecies**: il contrasto **non testuale** del core non lo misura
  nessuno — `contrasto-non-testo.mjs` ha l'elenco delle superfici scritto a mano
  e contiene le sei app, non il core (`--solo=core` → «0 app misurate»).
- **B0-vicies**: la pastiglia «NON SALVA» si sovrappone al nome utente, in
  chiaro, **a 430 px** — il traboccamento all'indietro di `CLAUDE.md`, ma alla
  larghezza normale. Non introdotto qui: il diff tocca solo colori.
- **B0-unvicies**: `.sync-badge.nonsalva` scrive il suo rosso a mano, quarta
  stesura dello stesso valore; unificarla cambierebbe **anche il buio**.

## Lo stato del ciclo
Sei unità chiuse stasera: Flotta, Campo, Scudo, il core+media, Terra,
Sentinella, Conti, e il core in chiaro. `run-kpi` **2054 → 2103**; giro `node`
**2.881** su 34 comandi; documenti a **2.555**.

## Prossimo passo atomico
Aprire tre cantieri nuovi sulle voci appena dichiarate — **B0-novodecies** (il
banco del contrasto non-testo che non conosce il core), **B0-vicies** (la
pastiglia che si sovrappone in chiaro a 430 px) e **B0-unvicies** (il rosso
scritto a mano) — e nel frattempo continuare a leggere il **giro del browser**,
che gira su `d3653ec`: attenzione che i suoi KO sul tema chiaro del core sono
**già chiusi da questo commit**, e la sezione 0 di `leggi-giro.mjs` lo dice
contando i commit di distanza.

## Blocchi
- **Force-with-lease sul ramo**: la CI resta rossa su **quella riga sola**.
  Serve il sì del fondatore.
- **B0-septies** e le **soglie di sicurezza**: fermi al fondatore.
