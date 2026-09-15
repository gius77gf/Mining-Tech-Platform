# Checkpoint — 2026-09-02T08:29:01Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
93efe328 — «Il primo ponte arriva sullo schermo: Conti mostra quanto c'è in Flotta, voce per voce»

## Completato
Il primo ponte fra app, **Flotta→Conti**, è chiuso e misurato col browser.
- `apps/conti/conti-data.js`: ri-esporta `confrontoCostiMezzi`; `api.costiFlotta`
  legge `costi` con una seconda istanza SDK pigra (`appId: "flotta"`), `null`
  se Flotta non risponde; dimostrazione `costiFlotta` fl1–fl6 con i casi decisi
  prima (fl1/fl3 = c02/c05 alla cifra; fl6 senza data).
- `apps/conti/index.html`: la nota «anche in Flotta» è la tabella del confronto
  con tre esiti (non raggiungibile → tono avviso e NESSUNO zero; doppioni → riga
  evidenziata e «gonfiato fino a…»; niente di là → detto). CSS della cassa
  (`.ponte-wrap`, `.ponte`, `.doppia`, `.note.warn`).
- `tests/browser/conti-ponte-flotta.mjs`, 3 passate in `tutti.mjs` (16 + 8 prove,
  controprova che cade in 3 punti). Misurato a 430/320 px nei tre temi:
  contrasti ≥ 5,56:1; a 430 la tabella non scorre, a 320 scorre solo lei.
- `docs/MAPPA_ECOSISTEMA.md` §3a (costruito + che cosa NON fa) e §6: 6 → **7**
  ponti di dati; roadmap: obiettivo 1 e i quattro task del ponte spuntati.
- documenti: 203 esecuzioni del browser, 83 file di banco, 3.290 asserzioni.

## Lezioni della giornata
- Il righello ha sbagliato prima della pagina: nel tema chiaro Chromium risponde
  `color(srgb …)` e la regex sui numeri interi dava contrasto «1» su un 7,1. Il
  colore si legge dipingendolo su una tela.
- Senza rete l'import di Firebase muore dopo ~13 s: i dati dimostrativi arrivano
  DOPO. Un banco che aspetta 2,6 s fissi misura una schermata vuota. Si taglia
  gstatic subito (come `giro.mjs`) e si aspetta il dato, non il tempo.
- «`kill -TERM`» su un giro `node` non basta se ha un figlio: si uccidono i
  figli per PID e poi il padre.

## Stato roadmap
Settimana 31/08→04/09. Obiettivo 1 (ponte Flotta→Conti) ✅. Aperti: obiettivo 2
(la tabella §6 a ogni ponte — resta aperto per i prossimi ponti) e 3 (passata in
profondità su Conti).

## Prossimo passo atomico
**La passata in profondità su Conti**, come promette l'obiettivo 3: aprire ogni
schermata della dimostrazione nel browser (Quadro, Fatture, Clienti, Pesate,
Ordini, Banca, Costi, Report, Chiusura, Impostazioni), premere ogni bottone che
fa uscire un file e aprire il file, cercare i numeri tranquilli (uno «0» o un
verde dove non è stato misurato niente). Prima domanda da fare: **dove Conti
compone qualcosa che ESCE — CSV, PDF, frase di riepilogo — chi decide i suoi
numeri?** Se non è la stessa funzione che li decide a schermo, lì c'è una copia
debole. Scrivere i difetti trovati come righe di roadmap con la prova (comando +
uscita), non come accuse.
In parallelo (cantiere separato, non tocca Conti): il verso **Conti→Flotta** del
ponte — Flotta non sa che `daMezzo` esista (`grep -c daMezzo apps/flotta/flotta-data.js → 0`).

## Blocchi
Nessuno. PR #345 aperta (mappa, nomi, ponte, mercato): da controllare la CI e
unire; questo commit va nella stessa PR o in una nuova se #345 è già unita.
