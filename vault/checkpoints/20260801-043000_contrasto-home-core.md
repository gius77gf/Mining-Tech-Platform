# Checkpoint — due riquadri della home del core erano illeggibili, misurato

- **Tipo**: correzione trovata guardando + banco di misura nuovo
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `6764b6d`

## Il difetto

Nella home del core, riquadro **«PROGETTO VOLATA»**: sottotitolo arancione scuro
su fondo arancione. Misurato, **1,08:1** — la soglia leggibile per un testo
piccolo è 4,5:1. Il titolo stava a 2,29:1. Il riquadro **«STRUMENTI UFFICIO»**:
inchiostro scuro su verdeacqua, **2,93:1**.

Causa: tutti e due i riquadri avevano lo **sfondo scritto in linea** e il colore
del testo no. Il fondo diventava pieno, il testo restava quello dei riquadri
scuri. Nessun errore in console, nessun test rosso, la pagina si apre benissimo:
è il tipo di difetto che si vede solo guardando — e il core, fino a ieri, non si
poteva guardare in locale.

## La correzione

Via lo stile in linea, dentro due classi vere (`.tile-volata`,
`.tile-feat-ufficio`) accanto alla famiglia di riquadri colorati che il core ha
già. Stesse due famiglie di colore, rese leggibili:

| | prima | dopo |
|---|---|---|
| Strumenti ufficio (titolo) | 2,93 | **5,32** |
| Strumenti ufficio (sottotitolo) | 2,93 | **4,75** |
| Progetto volata (titolo) | 2,29 | **5,04** |
| Progetto volata (sottotitolo) | **1,08** | **4,58** |

Sull'arancione vince l'inchiostro scuro — è quello che il core già fa sul
riquadro in evidenza; sul verdeacqua vince il bianco, ma solo scurendo la tinta
(bianco sul verdeacqua chiaro stava a 3,04:1). Tolta anche l'`opacity:.85` del
sottotitolo in evidenza: la sfumatura si fa col colore, che si può misurare.

Sul riquadro arancione titolo e sottotitolo hanno ora la **stessa** tinta: la
gerarchia la fanno corpo e peso del carattere. Schiarire il sottotitolo di un
soffio (#241a06) lo riportava a 4,04, sotto soglia.

## Il banco: `tests/browser/contrasto-core.mjs`

22 misure, controprova che rimette il difetto e pretende due bocciature (2,29 e
1,08 — gli stessi numeri di partenza).

**Tre trappole, tutte e tre nel senso che ASSOLVE**, cioè il peggiore:
1. **Gradienti.** Il colore vero sta in `background-image`; cercando un fondo
   opaco fra gli antenati si finisce contro il nero della pagina, e bianco su
   arancione risultava **19:1**. Si prendono i colori del gradiente, caso
   peggiore.
2. **Trasparenza del testo**: `rgba(20,15,4,.82)` su arancione non è nero pieno.
3. **`opacity` ereditata**: portava 4,75 a 4,31.
La prima versione della misura aveva tutte e tre, e diceva che andava tutto bene.

## Una cosa che NON era un difetto

Il meteo «fermo su CARICAMENTO» del checkpoint precedente era un artefatto della
prova: `initHome` non parte senza utente. Con l'utente, il riquadro meteo si
**nasconde** da solo, perché `CLOUD_PROXY_URL` è vuoto — comportamento voluto e
scritto nel codice. Nessuna correzione: il ripiego c'è già.

## Prossimo passo atomico

Estendere la misura del contrasto **oltre i riquadri della home**: le stesse tre
trappole valgono per badge, pillole di stato e note, dove i fondi colorati sono
tanti. Primo giro sul core (badge di scadenza `scad-badge danger/warn/ok`, che
sono testo piccolo su fondo pieno), poi sulle sei app.

## Bloccanti

- Nessuno su questa unità.
- Resta gated su decisione del fondatore: Genesi punti pesanti #4/#5/#6.
- Resta **senza risposta** la domanda del fondatore «ti ho chiesto una cosa
  prima».
