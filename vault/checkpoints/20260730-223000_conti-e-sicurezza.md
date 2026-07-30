# Checkpoint — l'app che nessuno guardava, e cosa è permesso davvero

- **Tipo**: due unità: il frutto della copertura nuova, e Q3 della roadmap
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `fc53b37` (Conti e Flotta) e `018319f` (revisione di sicurezza)

## 1. Un'ora dopo, la copertura nuova ha pagato

Conti era entrata nell'elenco delle superfici e «h» in quello delle unità. Il
banco ha trovato **sei violazioni vere in due app**, e tre erano in un'app che
nessuna prova del browser aveva mai aperto:

- **Conti**: «13 GG», «-2 GG», «DENSITÀ (T/M³)». Conti non chiamava affatto la
  regola condivisa e non aveva la riga di stile che tiene le unità fuori dal
  maiuscolo. Ora fa come Flotta e Scudo — `avvolgiUnita` da `shared/`, col nome
  di sempre — e ha `.badge .u, .fld>label .u`.
- **Flotta**: «€19,02/H», «9,7 L/H», «€14,55/H». Il costo orario ha la valuta
  **prima** del numero, quindi non esiste nessun «€/h» preceduto da una cifra da
  riconoscere: l'unico pezzo da salvare è la coda **«/h»**. È la ragione per cui
  l'ordine si calcola invece di scriverlo: «/h» è la più corta, passa per ultima
  e non stacca la coda a «km/h» né a «m³/h».

**E un difetto di parole trovato guardando lo screenshot della correzione** —
non cercandolo: una gara chiusa da due giorni mostrava **«-2 gg»**, un numero
negativo su una pastiglia che chi legge deve interpretare; e una in scadenza
oggi mostrava «0 gg», che sembra un dato mancante. Flotta lo diceva già giusto
(«scaduta da 20 gg»); in Conti era rimasto il conto crudo. Adesso: «chiusa da
2 gg», «scade oggi», «tra 13 gg».

Nove superfici, **zero unità in maiuscolo**. Suite KPI 341 → 342.

## 2. Revisione di sicurezza (Q3): l'isolamento tiene, dentro l'azienda no

Non una lettura delle regole — in questo progetto leggere le regole ha già
ingannato — ma una **misura fatta con l'emulatore**, con le risposte riportate
come sono arrivate.

**Quello che tiene, ed è la cosa che conta di più**: il muro fra due
organizzazioni concorrenti. 58 prove, tutte superate: lettura, scrittura,
cancellazione, elenco, dati annidati in profondità, tenant della dimostrazione,
abbonamenti, membri, inviti, profili. Vale anche per le collezioni nate **dopo**
che le regole sono state scritte.

**Quello che non c'è.** Con un'organizzazione abbonata SOLO a Scudo e un utente
membro semplice, l'emulatore risponde `PERMESSO` a tutte e cinque queste cose:
leggere e scrivere i fronti di Terra, leggere una fattura di Conti, modificarne
il totale, cancellarla.

1. **L'abbonamento non chiude niente.** `entitlements/{appId}` si scrive solo dal
   backend, ma nessuno lo consulta quando si accede ai dati. Conta **adesso**
   perché i ponti hanno reso normale il gesto di puntare l'SDK sull'`appId` di
   un'altra app: da fuori, un accesso legittimo e uno abusivo sono identici.
2. **Dentro l'azienda il ruolo non conta** per i dati delle app: chi è stato
   invitato per compilare rapportini può cancellare fatture. Il file delle regole
   lo sa e lo dichiara come lavoro da fare.

Due proposte con il loro **costo** (i claims invece di un `get()` a pagamento per
ogni accesso) e tre domande che sono decisioni di prodotto, non tecniche.
**Nessuna regola è stata toccata.**

La sonda resta nel repo (`tests/sonda-permessi.mjs`), **fuori da `npm test`
perché non sa fallire**: stampa e basta. Serve perché la misura si rifaccia in un
comando invece di rifare il ragionamento — una difesa che resta nello scratchpad,
alla sessione dopo non esiste.

## Prossimo passo atomico

**Terza iterazione della vetrina**: metterla accanto alle migliori vetrine di
prodotto e correggere dove la nostra è più povera. Da guardare per prime
l'altezza sul telefono (7.200 px) e le intestazioni di famiglia, oggi più
silenziose delle schede che introducono.

## Bloccanti

- Nessuno tecnico. In attesa del fondatore restano le tre domande della revisione
  di sicurezza e le tre di `docs/PERCHE_DEEPWORK_E_GENESI.md`: nessuna delle due
  blocca il lavoro.
