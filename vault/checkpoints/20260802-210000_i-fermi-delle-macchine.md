# Checkpoint — i fermi delle macchine di Flotta

**Commit:** `9f6001d`
**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa è stato fatto

19 prove sul blocco dei **fermi**, sui **costi mese per mese** e sulla
**disponibilità registrata** di Flotta, che era rimasta la meno difesa
delle sei (34 funzioni coperte su 71).

È il blocco che pesa di più fra quelli scoperti: da lì esce la
disponibilità del parco, cioè il numero con cui si prende la decisione
più cara che un titolare di cava prenda — *questa macchina la riparo
ancora o la sostituisco?*

Le «regole di onestà» che il modulo dichiarava nei commenti adesso sono
asserzioni:

- **una giornata persa è persa tutta**: ferma il 3 e ripartita il 3 vale
  un giorno, non zero;
- un fermo di due mesi pesa, su trenta giorni, **per i trenta che ci
  stanno dentro** — il denominatore non reggerebbe di più, e la
  percentuale mentirebbe;
- un fermo aperto conta fino a oggi **e lo dichiara**: il flag `aperto` è
  quello che impedisce di leggere un numero che cresce come un fermo
  finito;
- **senza data di inizio non c'è nessuna durata**: zero direbbe «non si è
  fermata»;
- non si comincia domani e non si riparte nel futuro — è il modo più
  facile di falsare la disponibilità, con giorni persi non ancora
  successi;
- i costi **senza data** non finiscono in nessun mese ma vengono
  dichiarati; e **un mese senza registrazioni non è un mese a zero euro**:
  non compare nell'andamento, e `mancanti` dice quanti sono;
- una registrazione impossibile (12 mezzi operativi su 10) **si scarta e
  il giorno finisce fra quelli senza dato**, invece di diventare un 120%
  disegnato nel grafico.

## Una cosa trovata scrivendo le prove

`CAUSALI_FERMO` esiste in **due app** e **non è la stessa cosa**: Campo
dice perché si è fermata un'**attività di turno** (testo semplice —
«Mancanza materiale», «Attesa mezzo», «Cambio turno»); Flotta perché è
fuori servizio una **macchina** (voci con chiave, perché ci si calcola
sopra la disponibilità — «attesa-ricambi», «gomme-cingoli»).

Non è la regola riscritta due volte, quindi non va in `shared/`: sono due
tassonomie di soggetti diversi. Ma il nome uguale è una trappola per chi
arriva dopo, e adesso c'è una prova che lo scrive — con dentro la
condizione: **se un giorno diventassero davvero la stessa cosa, il posto
è `shared/`, non una copia.**

L'ho trovata perché un'asserzione buttata lì (`campo.CAUSALI_FERMO ===
undefined`) è **caduta**. Vale la pena tenerlo: le asserzioni di contorno
costano niente e ogni tanto pagano.

## Controprova

Undici difetti rimessi in una copia del modulo (`apps/flotta/_tmp-cp.js`),
**11 su 11** fanno cadere la prova col loro nome, coi caratteri cambiati
stampati.

## Numeri

- Flotta: **34 → 45 funzioni coperte su 71**
- `run-kpi.mjs`: **826 → 845**; totale `node`: **1.109 → 1.128**
- documenti riallineati dal controllo che li rilegge

## Stato del giro del browser

In corso: primo banco passato, la sua controprova sta facendo cadere i
controlli come deve (i `KO` del banco `--senza-guardia` sono il risultato
atteso). Finché gira: niente modifiche a moduli dati e pagine.

## Prossimo passo atomico

Restano scoperte in Flotta 26 funzioni, in tre gruppi netti:

1. **ordini di lavoro** — `STATI_ORDINE`, `ordineDaManutenzione`,
   `validaRigaManodopera`, `validaRigaRicambio`, `riepilogoOrdini`,
   `consumoRicambi`, `propostaScorte`;
2. **giro macchina** — `checklistPreUso`, `riepilogoControllo`,
   `manutenzioniDaControllo`, `controlliDelMezzo`;
3. **anagrafica e rifornimenti** — `TIPI_MEZZO`, `tipoMezzo`,
   `tipoMezzoDi`, `nomeBreve`, `validaRifornimento`, `fascicoloMezzo`,
   `ritmoDelMezzo`, `PIANI_TAGLIANDO`, più gli avvisi sui numeri
   (`perCampo`, `messaggioNumero`, `AVVISO_DECIMALE`, `AVVISO_MIGLIAIA`).

Si parte dal gruppo 1 (**ordini di lavoro**): è dove stanno i soldi e le
scorte, cioè dove un numero sbagliato costa. Stesso metodo: sonda che
**misura** invece di indovinare, blocco prima del riepilogo finale,
controprova su copia, totale verificato in salita.

## Nessun blocco

Restano aperte le decisioni del fondatore in `DECISIONI_WEEKEND.md`
(punti 5a/5b, 10, 11, 12, 13).
