# Checkpoint — la terza gamba: la frase di riepilogo contro il file

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Task completato
La domanda di `CLAUDE.md` nomina **tre** cose che escono: *«un CSV, un PDF, una
FRASE DI RIEPILOGO»*. I file sono chiusi (51 su 51). Questa unità apre la terza.

**La forma meccanica della domanda**: la frase e il file sono **due uscite della
stessa azione**, quindi il numero che la frase dichiara deve rendere conto delle
righe che il file contiene. Se divergono, una delle due mente — e quella che
l'utente legge è la frase.
Il modo in cui divergerebbero è sempre lo stesso: la frase conta l'array
**sorgente** (`INT.length`, `CTR.length`, `MEZ.length`) mentre il ciclo che
scrive **filtra**.

Agganciato al banco di Flotta, che già apre nove documenti: dopo ogni click si
legge la frase visibile e la si confronta con le righe vere.
**Esito: otto frasi su otto tornano.** Una nona non porta numeri («Libretto
macchina esportato») ed è contata a parte invece di far finta che la domanda non
la riguardi.

## ⚠️ E la parte che vale più del risultato: il controllo ha sbagliato TRE VOLTE prima di reggere, sempre col segno di casa
1. **Frasi vecchie rimaste a schermo.** Leggevo tutti gli `.esito` visibili
   *dopo* il click, e ne raccoglievo anche di precedenti: il «primo numero della
   frase» era il conto di un'altra esportazione. **Otto KO, tutti falsi**, con
   la prova che li smentiva stampata accanto («Esportati: 6 mezzi… | Esportati 2
   giri macchina»). Adesso le frasi si azzerano **prima** di premere.
2. **La regola era troppo stretta.** «Il primo numero = le righe» sbagliava
   **tre volte su otto**, e in tutt'e tre il prodotto aveva ragione: «Esportati:
   6 mezzi, 3 manutenzioni, 1 ricambio» porta TRE conti (e 6+3+1 fa esattamente
   le 10 righe); «Esportate 3 scadenze, più 3 mezzi senza nessuna» ne porta due
   — ed è l'export che avevo lodato come *più onesto dello schermo*; e la lista
   della spesa ha una riga in più che è **l'avvertenza aggiunta stasera**, non
   un dato. Un allarme che sbaglia tre volte su otto insegna a non guardarlo.
   La domanda giusta è più larga e resta stretta abbastanza da mordere: **le
   righe di DATO devono essere fra i numeri della frase, o la loro somma** (e
   una riga senza `;` è un'avvertenza, non un dato).
3. **La stessa frase contata due volte.** Compare in due elementi — la nota
   della scheda e il toast — e sommandone i numeri il conto raddoppiava
   (`[6,3,1,6,3,1]`). Due copie della stessa frase sono una frase sola.
⛔ Il filo: **tre errori di seguito, tutti nel righello e nessuno nel soggetto.**
È la ragione per cui in questa casa la prima domanda davanti a una misura che
non torna è *sto guardando il soggetto o lo strumento?*

## La prova sa fallire
Iniezione nuova (#6): il ciclo della situazione perde **un mezzo**
(`MEZ.slice(1)`) e la frase continua a dire sei. È la forma esatta del difetto
che questo confronto esiste per prendere — un file che perde una riga **in
silenzio** — e il banco la vede: `numeri:[6,3,1], righeDiDato:9`.

## Verifiche
- banco Flotta: **65 passati, 0 falliti**, 9 documenti; controprova **13 KO
  voluti** coi **6** difetti rimessi davvero
- `iniezioni-fresche` **184 su 184**, 22 banchi
- `node giro-node.mjs` → **32 comandi a posto, 0 caduti**, rifatto su una copia
  di ciò che si committa (identità della patch verificata)

## Stato della domanda «chi decide i numeri di ciò che ESCE?»
- **CSV/file**: 51 su 51 resi conto, otto difetti corretti, 21 aperti col browser
- **PDF/stampe**: censite. Quelle in HTML (`window.open`) sono coperte dai
  banchi in tutte le app; quelle del **core** usano `jsPDF` **da CDN**, quindi
  cadono sotto lo stesso limite misurato per THREE — fuori dalla portata dei
  banchi in questo ambiente, con la ragione già scritta
- **frasi di riepilogo**: aperta, 8 su 8 in Flotta

## Prossimo passo atomico
**Portare lo stesso confronto frase↔file sul banco di Conti**, che apre dodici
documenti: è lo stesso aggancio (azzerare le frasi prima del click, leggere i
numeri deduplicati, confrontare con le righe di dato) e coprirebbe da solo più
frasi di quante ne abbia Flotta. Attenzione: in Conti alcune frasi portano
**importi in euro** accanto ai conti, e il filtro `(?!\s*[€%])` che li esclude
va riverificato lì — su Flotta bastava, su Conti no di sicuro.
E resta il **giro del browser** (pid 21084, oltre tre ore): quando finisce,
`leggi-giro.mjs` dalla sezione 0, coi suoi KO da leggere come vecchi di
ventun commit.

## Blocchi
Nessuno.
