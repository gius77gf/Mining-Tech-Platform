# Checkpoint — il banco di Genesi ha imparato a fallire onestamente

**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`

## La prova che il banco doveva superare oggi: **fallire**

`genesi-struttura.mjs` è stato scritto ieri **prima** della migrazione, apposta.
Oggi, alla sua prima esecuzione vera, doveva cadere. È caduto — ma per arrivarci
ha mostrato **tre difetti suoi**, e nessuno dei tre era un errore di sintassi.

### 1. Non falliva: **moriva**

`window.toast(...)` non esiste ancora, l'eccezione dentro `evaluate` non era
raccolta, e il processo è morto **alla nona prova su diciotto**. Un banco che si
spegne a metà non può rispondere alla domanda che questo repository si è imposto
di stampare sempre: *quanti soggetti hai guardato davvero?*

Ora ogni misura passa da un `misura()` che raccoglie l'eccezione e la trasforma
in una caduta con la sua ragione (`__rotto: "window.toast is not a function"`).

**Prima:** morto alla 9ª. **Dopo:** `18 prove fatte · 3 passate, 15 fallite`.

### 2. La controprova non contava le proprie iniezioni

`--prima` rimette lo stato pre-migrazione nella risposta HTTP. Con Genesi non
ancora migrata, quelle sostituzioni trovano quasi nulla — e il banco cade
**comunque**, perché cade da solo. La controprova avrebbe stampato «✓ il banco
SA fallire» **per il motivo sbagliato**: è il caso 3 di `CLAUDE.md`, *l'iniezione
non ha iniettato niente*.

Adesso le conta e le dichiara.

### 3. E il conto delle iniezioni **non bastava**: era 1, non 0

Qui la misura ha corretto la mia ipotesi. Mi aspettavo zero sostituzioni; ne è
arrivata **una su sei forme**: `id="modal"` → `id="mdl"`. Perché oggi `modal` è
l'id del **cancello di consenso** — cioè **la trappola 1 documentata
nell'intestazione di quel file stesso**. Il difetto che il banco esiste per
sorvegliare è la ragione per cui la sua controprova mentiva.

Con la guardia scritta come «ho iniettato qualcosa?», il verdetto sarebbe stato
**verde**. La condizione giusta non è quella:

> una controprova dimostra qualcosa solo se, **tolta l'iniezione, il banco
> passerebbe**.

Il segno inequivocabile è il `<script>` di `shared/dw-app-ui.js` nella pagina.
Se non c'è, `--prima` **non ha niente da provare** ed esce con **3**:

```
⚠️ CONTROPROVA PREMATURA: Genesi non è ancora migrata.
   (misurato sul file: nessun <script> di shared/dw-app-ui.js; iniezioni riuscite 1 su 6 forme)
   la controprova ha senso solo quando il banco, senza --prima, passa.
```

## Stato del banco, oggi

| | |
|---|---|
| `genesi-struttura.mjs` | **18 prove, 3 passate, 15 fallite** — atteso: la migrazione non c'è |
| `--prima` | **esce 3**: si rifiuta di dare un verdetto che non ha guadagnato |

Le 3 che passano già oggi sono quelle che la migrazione **non deve rompere**: la
pagina non solleva errori, i **sette** id dell'editor del fronte 3D sono al loro
posto, il bottone «salva la volata» esiste.

⚠️ **Non è ancora in `tutti.mjs`**, e non ci va finché fallisce per progetto:
entra nell'elenco dei banchi **con la migrazione**, nello stesso commit in cui
comincia a passare.

## Prossimo passo atomico

1. **Genesi unità A — la migrazione**, dal piano misurato in
   `docs/LA_STRUTTURA_DEL_CORE_SCRITTA_SEI_VOLTE.md`, con le tre trappole:
   `modal` già occupato dal consenso, i sette `mdl*` dell'editor 3D che non
   vanno toccati, `chiediValore` col terzo parametro di significato diverso.
   Al termine: il banco deve **passare**, e `--prima` deve **cadere** (e allora
   il suo verdetto varrà);
2. aggiungere il banco a `tutti.mjs` e aggiornare il conto nei documenti;
3. rilanciare il giro completo del browser;
4. **Terra/Genesi — tracciabilità del volume**, unità 1 e 2;
5. **Conti — nota di credito**, dalla prova su `tempoMedioPagamento`.

## Nessun blocco

Decisioni del fondatore ferme in `DECISIONI_WEEKEND.md` (5a/5b, 10-15) più
**Firebase Storage** per le foto di Scudo.
