# Checkpoint — 2026-08-09T03:33:13Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`49a3aae`

## Task completato

**La misura di E8 esce dallo scratchpad e diventa un banco**:
`tests/browser/famiglia-strutture.mjs`, registrato in `tutti.mjs` con la sua
controprova. Chiede se le sei verticali sono ancora la stessa famiglia — barra
alta, altezza e tipografia del titolo di sezione — e risponde con **20
asserzioni, 6 superfici misurate su 6, 0 dichiarate non misurate**.

## Le tre cose imparate

1. ⛔ **UNA DIFESA NELLO SCRATCHPAD, ALLA SESSIONE DOPO, NON ESISTE** — e qui
   non era un banco dimenticato: era il documento stesso a mandarci.
   `docs/E8_LE_PAGINE_AFFIANCATE.md`, alla riga «come si rifà», scriveva
   `node …/scratchpad/<tuo>/famiglia.mjs`. Cioè la **sola prova** che la
   direttiva del fondatore sia rispettata si rifaceva con uno strumento che non
   c'è più. È lo stesso difetto della prova della verifica periodica di Scudo,
   chiuso il 07/08 — e stavolta l'ho trovato **leggendo la riga di roadmap**,
   non inciampandoci.
2. ⛔ **IL BANCO NON PRETENDE CHE TUTTO SIA UGUALE**, che sarebbe il contrario
   di quello che E8 ha misurato: le etichette della barra in basso sono a tre
   corpi diversi ed **è giusto** (le parole di Scudo e Sentinella non entrano a
   9 px in sei colonne). Pinza **solo ciò che il documento ha misurato
   identico**, e il riferimento è la **prima superficie misurata**, non un
   numero scritto a mano — così il giorno in cui il riferimento cambiasse il
   banco non accuserebbe cinque app di essere rimaste in famiglia.
3. ⚠️ **TRE ERRORI DEL RIGHELLO PRIMA CHE REGGESSE, E LI HA PRESI IL BANCO, NON
   IO**:
   · `SUPERFICI` è un elenco di **coppie** `[nome, via]`, non di oggetti:
     filtrare su `s.nome` dava **zero** superfici — e il banco si è fermato con
     «nessuna superficie misurata: il banco non prova niente» invece di
     stampare un verde su zero soggetti. È la difesa che vale più di tutte;
   · `apriSuperficie` torna `{ctx, p, errori}`, non la pagina;
   · **la controprova non iniettava niente** — la terza delle cinque cause.
     `t.style.height = '48px'` scriveva davvero l'attributo, e
     `getComputedStyle` continuava a rispondere **62px**, perché una regola del
     foglio condiviso vince con `min-height`. Un difetto rimesso che il browser
     **scarta** è indistinguibile da un difetto non rimesso: si forza con
     `setProperty(…, 'important')` e si tocca anche `min-height`.

## Verifiche
- passata sana: **20 passati · 0 falliti**, 6 su 6, 4 misure per superficie a
  420 px
- controprova: **19/1** con «✔ il banco fallisce»
- `numeri-nei-documenti` ha fatto **cadere il giro prima del commit**: i tre
  documenti dichiaravano **157** passate del browser e sono **159**. Corretti.
  È il controllo che funziona nel verso giusto — prima del push, non in CI
- `suite-collegate` 3/0 su **120** file · `giro-node` 34 comandi a posto, 0
  caduti, rifatto sulla **copia** di ciò che si committa

## Stato roadmap
- **E8**: chiusa la metà **misurabile**; dichiarata aperta quella che i numeri
  non sanno fare — il foglio a contatto va **guardato**, e il banco non finge
  di saperlo
- il documento E8 aggiornato alla direttiva 7 (chi chiude un'unità corregge la
  riga che gliel'aveva proposta)

## Prossimo passo atomico
**Leggere il giro del browser** (pid 32676,
`scratchpad/resp/giro/registro4.txt`, attesta `7cddb59`). Alle 03:33 era vivo
da **4h23**, a 391 intestazioni, sopravvissuto al riavvio del contenitore; un
attendente è armato sul suo pid.
⚠️ Quel giro **non conosce** `famiglia-strutture.mjs`: gira su una copia
congelata di venticinque unità fa, quindi le sue 157 passate non sono le 159 di
adesso — e questo è **normale**, non un difetto da inseguire.
Ordine: `leggi-giro.mjs <registro>` → **sezione 0 (età)** → **righe «non ho
guardato»** → **KO veri**, e ogni KO va riverificato sul commit di adesso prima
di aprirci un cantiere.

## Blocchi
Nessuno.
