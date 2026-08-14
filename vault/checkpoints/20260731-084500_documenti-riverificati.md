# Checkpoint — i documenti riverificati, non riletti

- **Tipo**: due unità sulla stessa categoria di difetto
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `1a877e1` (il censimento), `d673936` (i due documenti di sicurezza)

## 1. Il censimento dichiarava guasto quello che era stato aggiustato

`CENSIMENTO_FEATURE.md` è il documento che dice **cosa non mostrare** in una
dimostrazione. È del 20 luglio, elencava quattro problemi, e riverificandoli uno
per uno **col core aperto** tre non ci sono più:

- il **nome fuorviante** è corretto: la schermata si chiama «Visualizzatore 3D
  (Splat)» e scrive esplicitamente che *non crea* il modello;
- i **fori segnati** sulla ricostruzione adesso si salvano — `reconToVolata()`
  li porta nella volata aperta come prima fila;
- il **widget del meteo**, senza proxy, si nasconde invece di restare per sempre
  su «non disponibile». La funzione è ancora spenta, ma **spenta e rotta sono
  due cose diverse**.

Resta spenta solo la notifica push, che dipende da una decisione del fondatore.
E «Editor metodi v4.1» non è più promesso da nessuna parte.

**Perché conta**: un documento che dichiara guasto qualcosa che funziona fa danno
esattamente quando serve — chi lo legge prima di una dimostrazione **evita di
mostrare** una cosa che è a posto. È il difetto simmetrico di quello che si teme
di solito, e nessuno lo cerca.

La tabella del 20/07 è rimasta com'era: serve a ricostruire la storia, non a
decidere cosa mostrare oggi. Riscriverla avrebbe cancellato l'unica cosa che
quel documento sa fare bene.

## 2. Due documenti di sicurezza, e nessuno diceva quale aprire

Da oggi ce ne sono due e guardano cose diverse: `AUDIT_SICUREZZA.md` è il
registro vivo del **core** (credenziali nei default, service worker, escape HTML,
iniezione CSV); `REVISIONE_SICUREZZA_202607.md` guarda le **regole del server** —
chi può leggere e scrivere cosa — e non le legge, le **misura**.

L'indice li metteva sotto la stessa voce: chi cerca la risposta a *«i miei dati
li vede un concorrente?»* apriva il file sbagliato e non la trovava.

Aggiunta all'audit l'avvertenza che nasce dall'unità precedente: **le voci senza
data di chiusura vanno riverificate prima di citarle**.

## Il metodo, in una riga

**Riverificare non è rileggere.** Rileggere un documento conferma quello che
dice; riverificarlo vuol dire aprire la cosa di cui parla e guardare. Le due
attività si somigliano abbastanza da farsi scambiare, e producono risultati
opposti: oggi la rilettura avrebbe detto «quattro problemi aperti», la verifica
ha detto «uno».

## Prossimo passo atomico

`docs/ONBOARDING_DATI.md` — per ogni app, quale CSV preparare per caricare lo
storico. Le app hanno guadagnato collezioni intere questa settimana (le pesate e
il listino in Conti, i ricettori e il programma in Sentinella, i fronti in
Terra): se i modelli di CSV non le coprono, il primo cliente carica metà dei
suoi dati e l'altra metà la riscrive a mano. Stesso metodo: app aperta, non a
memoria.

## Bloccanti

- Nessuno.
