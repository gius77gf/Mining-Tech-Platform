# Checkpoint — 2026-08-09T03:44:39Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`642e43d`

## Task completato

Due unità legate, nate una dall'altra:
1. **il banco della famiglia dichiara che cosa NON prova** (il core non è il suo
   riferimento);
2. **il primo pezzo del censimento E0**: `shared/dw-app-shell.css` — «il veicolo
   tecnico della STRUTTURA» — **lo carica 1 pagina su 4**.

## Le due cose imparate

1. ⛔ **HO FATTO AL MIO BANCO LA DOMANDA CHE IL SUO NOME SUGGERISCE, E NON
   SAPEVA RISPONDERE.** Si chiama «le pagine sembrano la stessa famiglia»: la
   lettura naturale è «le sei copiano il core». Misurato aprendo il core: **non
   ha né `.top` né `.sec`** — la barra alta si chiama in un altro modo, il
   titolo di sezione è `.sec-title` (53 volte). Le sei condividono un
   vocabolario che il core **non usa**, quindi prenderlo come riferimento
   vorrebbe dire misurare `null`.
   Il banco risponde a **«le sei sono d'accordo FRA LORO?»**, e la conseguenza
   va detta perché è il buco che resta: **se si allontanassero tutte e sei
   INSIEME dal core, resterebbe verde.** Adesso lo dichiara nell'intestazione e
   lo **stampa a ogni passata**. È la regola dell'etichetta più larga del suo
   numero, applicata a un banco mio **il giorno stesso** in cui l'ho scritto.
2. ⛔ **UN FOGLIO «CONDIVISO» CHE QUASI NESSUNO CARICA NON CONDIVIDE NIENTE:
   TIENE SOLO IL NOME.** `dw-app-shell.css` definisce 18 classi e lo caricano
   **Conti e Sentinella**. Le altre sei pagine usano quelle stesse classi
   (17-18 su 18 per le verticali) e **se le ridefiniscono in casa**:

   | pagina | carica il foglio | usa | ridefinisce nella pagina |
   |---|---|---|---|
   | conti · sentinella | **sì** | 18/18 | — |
   | flotta | no | 18/18 | **16/18** |
   | scudo | no | 18/18 | **12/18** |
   | terra · campo | no | 18 · 17 | 7/18 |
   | core | no | 11/18 | 6/18 |
   | genesi | no | 8/18 | — |

   Delle 18, **una sola** (`dw`) sta anche in `deepwork-style.css`: le altre 17
   non arrivano da lì. Cioè l'allineamento delle sei **non è tenuto dal foglio**
   — è tenuto dalla convenzione, e da oggi da `famiglia-strutture.mjs`, che è
   l'unica cosa che se ne accorgerebbe. Le due misure si spiegano a vicenda: il
   banco serve **perché** il foglio non è condiviso.

## Perché NON ho aperto il cantiere
Far caricare il foglio a sei pagine tocca sei file e può cambiare l'aspetto di
tutto, e l'estetica è materia del fondatore (direttiva 27/07). Quello che la
riga E0 chiedeva era **il censimento**, cioè il numero — e adesso c'è, col
comando per rifarlo (`scratchpad/sing/vocab.mjs`, dieci righe: quali classi
definisce il foglio, chi lo carica, chi le ridefinisce).

## Verifiche
- `famiglia-strutture`: **20 passati · 0 falliti**, 6 superfici su 6
- `giro-node`: **34 comandi a posto, 0 caduti**, rifatto sulla **copia** di ciò
  che si committa

## Stato roadmap
- **E0**: primo pezzo del censimento scritto, con la tabella e il perché il
  cantiere non è stato aperto
- **E8**: chiusa la metà misurabile; aperta quella che vuole l'occhio

## Prossimo passo atomico
**Leggere il giro del browser** (pid 32676, `scratchpad/resp/giro/registro4.txt`,
attesta `7cddb59`): alle 03:44 era vivo da **4h35**, a 435 intestazioni, con un
attendente armato sul suo pid.
Ordine: `leggi-giro.mjs <registro>` → **sezione 0 (età)** → **righe «non ho
guardato»** → **KO veri**.
⛔ Attesta un commit di **trenta unità fa**, e non conosce né
`famiglia-strutture` né le misure sulla carta: le sue 157 passate non sono le
159 di adesso, ed è **normale**. Ogni KO va riverificato sul commit di adesso
prima di aprirci un cantiere.

## Blocchi
Nessuno.
