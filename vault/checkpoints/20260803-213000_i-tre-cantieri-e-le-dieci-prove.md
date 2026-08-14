# Checkpoint — tre cantieri in parallelo, il canone, e le dieci prove

**Commit:** `96988ab` (canone + volate), `ad48a0e` (Campo), `dff5003` (Flotta),
`858a7b9` (le dieci prove)
**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`

## 1. Il canone: Terra prometteva un numero che Conti non produceva

Terra scrive al titolare «la base di calcolo sono N m³ di scavo misurato» e lo
manda in Conti. Conti calcolava sulle **pesate**, cioè sul venduto. Fra i due
ci sono le scorte di piazzale, gli scarti e il materiale del ripristino: sullo
stesso periodo, misurato, **€ 89,23 sul venduto contro € 97,90 sullo scavato**.

Adesso la base è una **scelta dichiarata**, e la risposta dice sempre quale ha
usato e quanto valeva l'altra. Il cuore però è l'**asimmetria fra le due**:

- nessuna **pesata** → non è stato venduto niente → dovuto **zero**, è un fatto;
- nessun **rilievo** → non vuol dire che non si è scavato: vuol dire che
  **nessuno ha misurato** → dovuto **null**, con il perché scritto.

E due cose che l'app si rifiuta di inventare: con l'aliquota a tonnellata sui
rilievi **non converte** (servirebbe la densità del *banco in posto*, non
quella del materiale sciolto del listino), e sullo scavato **non ripartisce per
prodotto** — un rilievo misura un volume di banco, non sa che prodotto ne
uscirà.

## 2. I tre cantieri in parallelo

| app | che cosa ha chiuso |
|---|---|
| **Sentinella** | le volate nel report di conformità portano **previsto, misurato, scarto e norma citata**; ogni dato mancante lo dice a parole («non misurata», «non prevista», «non dichiarato»), mai con un trattino |
| **Campo** | la **disponibilità di turno**, e la regola che conta: una misura **parziale non prende il verde**, perché la percentuale è un massimo e un colore tranquillo direbbe «è andata bene» su un turno che non sappiamo com'è andato |
| **Flotta** | la **segnalazione guasto**: prende l'ambra (un guasto è un avviso, non una cancellazione — il rosso in quella riga vuol dire «dismetti dal parco»), e nel toast va **una** cosa sola, la prima da sistemare |

## 3. Le dieci prove, e un difetto trovato scrivendole

I cantieri non toccano `run-kpi.mjs` **apposta** — è condiviso, e due che ci
scrivono insieme si scontrano. Le prove le ho scritte io, e guardano i punti in
cui un difetto **non si vedrebbe**: i modi in cui il numero non si può fare,
non l'aritmetica quando c'è tutto.

Il caso più insidioso di Campo: **fermi registrati senza minuti**. La somma
farebbe zero minuti persi e quindi il 100% — il voto più alto proprio al turno
che ha registrato guasti e non li ha misurati.

**Il difetto trovato scrivendo:** `oreMinuti(null)` rispondeva «0 min». `+null`
fa zero, e «0 min» è un'**affermazione** — dice che il tempo è stato misurato e
vale zero. Nessun chiamante passa `null` oggi, ma è la trappola dormiente già
raccolta in `CLAUDE.md`.

**Controprova:** nove difetti rimessi uno alla volta su copie, **nove prove
cadute col nome giusto**. Due correzioni per strada, e sono le solite:
l'ancora di `durataTurnoDi` compariva **quattro** volte (idioma frequente in
quel file) e il banco si fermava invece di misurare; e un'asserzione cercava
una frase che il codice non scrive — era la prova a indovinare.

## 4. Un errore mio, nel registro

Il grosso del lavoro di **Campo e Sentinella** è finito dentro `be349e6`, il
commit sull'amministrazione di Deepwork ID, che nel messaggio non ne parla.
Causa: un `git add -A` dato mentre i cantieri scrivevano. La storia è già
spinta e non la riscrivo; la correzione è nel commit successivo, e da lì in
avanti si stagia **app per app** (fatto per Conti, Terra, Campo e Flotta, ognuna
col suo commit).

## Numeri

- KPI **976 → 999**, stile **262**, totale `node` **1.343**
- copertura funzioni pure: **424 su 424** — tutte e sei le app al **100%**
- fondi del censimento alzati: campo 78, conti 60, flotta 74
- suite rilanciate in **ora italiana**: 3, zero cadute

## In corso

Il **giro a 25 banchi** del browser, rilanciato perché sono cambiate sette
superfici (Conti, Campo, Flotta, Sentinella, Terra, Genesi, amministrazione).
Finché gira: `docs/`, `vault/` e le suite `node`, e nessuna modifica a moduli e
pagine.

## Prossimo passo atomico

Quando il giro finisce, in ordine:

1. **Genesi al condiviso** — l'ultimo pezzo della struttura, ed è il caso
   difficile: id diversi (`mdl` invece di `modal`) e un `chiediValore` con il
   **terzo parametro incompatibile**, che compila lo stesso;
2. dal censimento, le prossime aperte per valore: **Conti — note di credito**
   (oggi l'unico modo di annullare una fattura emessa è eliminarla, e l'app
   stessa ammette che è sbagliato) e **registro costi**, che è la porta
   d'ingresso obbligata per marginalità e pareggio;
3. **Terra — la tracciabilità del volume dal visore** (lato cella, quota di
   base, punti del ritaglio dentro il verbale).

## Nessun blocco

Restano aperte le decisioni del fondatore in `DECISIONI_WEEKEND.md` (punti
5a/5b, 10, 11, 12, 13, 14, 15) più la domanda su **Firebase Storage** per le
foto di Scudo.
