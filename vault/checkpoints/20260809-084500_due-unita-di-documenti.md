# Checkpoint — 2026-08-09T08:45:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`c88879b`

## Task completato

**Due unità sui documenti, lavorate mentre il giro del browser cammina** — cioè
sulle superfici sicure (`docs/`, `vault/`, suite `node`), che è il modo di non
stare ad aspettare guardando.

### 1. Due righe di roadmap che proponevano lavoro già fatto (`fc3231b`)
| riga | perché era chiusa |
|---|---|
| «Chi misura la larghezza dei fogli stampati» | **otto superfici su otto** hanno la misura dentro un banco, e `larghezzaCarta`/`regolaPage` stanno in un posto solo |
| «I ternari del singolare che restano nelle app» | **115 candidati → 17**, tutti con una ragione scritta; e l'unico caso che il testo lasciava aperto — «e altri 1 documenti» di Campo — è **già corretto in pagina** |

### 2. L'unico commit che MORDEVA, aperto (`c88879b`)
Arretrato dei documenti del delta: **17 commit → 13**, quelli che **mordono
1 → 0**. Fra `57c78cf` e adesso Flotta è andata avanti di 4 commit, +218/−42.
Misurato invece che dedotto: `<button>` **0 aggiunti, 0 tolti**; l'unica
`export function` nuova è **`statoGiro`**, che è il **badge del giro macchina**
— già esistente e già documentato — portato nel modulo accanto alla funzione
che decide la stessa cosa a schermo. **Nessuna riga del documento cambia.**

## Le tre cose imparate

1. ⛔ **UNA RIGA CHE PROPONE UN LAVORO GIÀ FATTO LO FA RINASCERE**, ed è la
   terza forma d'invecchiamento censita in `CLAUDE.md`. Le due righe di oggi lo
   facevano da ore: una diceva «restano senza misura i fogli di Genesi e
   Scudo», e tutt'e due erano state coperte **oggi stesso**. Chi chiude
   un'unità chiude anche la riga che gliel'aveva proposta — e le due righe
   restano scritte per intero, perché il loro valore è il **metodo**, non il
   compito.
2. ⛔ **UN «COMMIT CHE MORDE» NON È UNA CAPACITÀ NUOVA FINCHÉ NON SI GUARDA.**
   Il controllo segnala una `export function` aggiunta perché è **una delle due
   forme con cui qui nasce una funzione** — ma la stessa forma la prende anche
   una decisione **spostata**, che è il movimento che questo repository fa di
   continuo. Aprire il commit costa cinque minuti e distingue le due cose;
   dedurlo dal contatore le confonde, in tutt'e due i versi.
3. ⛔ **E IL GUARDIANO HA CORRETTO LA MIA PRIMA STESURA, che è esattamente
   perché esiste.** Avevo dichiarato il commit di *adesso* (`fc3231b`), che non
   ha mai toccato né il documento né `apps/flotta/`: `documenti-invecchiati` lo
   ha rifiutato con la sua frase — *«una data incollata non è una verifica»*.
   Il commit giusto è quello dello **stato verificato**, `69e6c3f`. Un controllo
   che pretende la *prova* invece della *dichiarazione* prende anche chi lo ha
   scritto.

## Verifiche
- `documenti-invecchiati` **15/0**, arretrato **13 commit, 0 che mordono**
  (era 17 e 1)
- `giro-node` **34 comandi a posto, 0 caduti** su copia del committato, per
  tutt'e due le unità

## Il giro del browser
Vivo dalle 07:55Z su una copia di `494863f` (pid 2712). A 08:45 il registro è a
**480 righe** e sta scrivendo; figlio vivo che macina CPU. Sono passati «le
pagine si aprono», i disegni, le date illeggibili del core, ed è dentro i campi
interi.
⚠️ Il commit che il giro attesta è già **vecchio di sei commit** rispetto a
`c88879b`: quando si leggerà, la **sezione 0** dirà di quanti — ed è la prima
cosa da guardare, prima dei KO.

## Prossimo passo atomico
**Leggere il giro quando finisce**, con `leggi-giro.mjs`, nell'ordine: **età →
righe «non ho guardato» → KO veri**. Le undici chiusure di oggi si vedono lì.
⚠️ Prima di dichiarare un KO un difetto: riprodurlo **con la sua passata** e
**con l'iniezione viva** — oggi undici KO su venti del giro precedente non
erano difetti del prodotto.
Nel frattempo: solo unità su `docs/`, `vault/` e suite `node`.

## Blocchi
Nessuno di tecnico. In attesa del fondatore: le **7 tendine tagliate**
(Scudo 5 + Sentinella 2) e **`#vf-ente`** (termine dell'art. 71 c.11).
