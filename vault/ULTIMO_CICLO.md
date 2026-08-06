# Ultimo ciclo automatico

> **A cosa serve questo file.** Ogni volta che un ciclo di lavoro automatico
> parte davvero e riesce a raggiungere il repository, aggiorna le righe qui
> sotto. Se la data è vecchia, vuol dire che **la routine non sta
> lavorando** — e si vede subito, senza dover cercare tra i commit.

**Ultimo ciclo riuscito:** 2026-08-06 **15:50 UTC**
**Commit di partenza:** `0f64e9b`

**Cosa sta per fare.** Il ciclo precedente si è fermato sull'**unico stop
legittimo**: il limite settimanale della piattaforma, che ha ucciso tutti e tre
i cantieri aperti (Scudo, Campo, i CSV) a metà lavoro. Il limite si è riaperto
alle 15:00 UTC e il ciclo riparte.

⛔ **E la prima cosa trovata non è un'unità: era il contenitore.** La copia
locale del repository stava **102 commit indietro** (ferma al `45617e9` del 2
agosto) mentre il ramo remoto era a `0f64e9b`, e sopra quella base vecchia i
cantieri morti avevano lasciato dieci file modificati. Un `git pull` normale
li avrebbe fatti scontrare; un merge alla cieca avrebbe **rimesso indietro tre
giorni di lavoro** — la stessa forma del difetto già misurato il 03/08 (un
cantiere che ricostruiva un file da una base vecchia e riportava un fondo da
38 a 37), moltiplicata per cento.
La prova che ha deciso, e che va rifatta ogni volta che si trova un albero in
questo stato: confrontare ogni file del disco con la **sua versione remota**.
Tutti e dieci risultavano più poveri (migliaia di righe solo-remoto), e le
righe «solo disco» erano **versioni vecchie riconoscibili** — `aggiornaBadgeNotifiche`,
rinominata da un commit successivo, e la prova `testoPromemoria: null se
regolare, senza lavoratore o senza data`, che era esattamente quella corretta
in `1857d83` perché **blindava un difetto**. Nessun lavoro nuovo da salvare: il
disco era un antenato stantio. Patch e copie integrali restano comunque nello
scratchpad, dichiarate e non buttate.

**Che cosa fa adesso.** Riprende l'unità che il limite ha interrotto a metà: le
**due violazioni AA rimaste nel core** — `.av-su` a **2,65:1** e `.av-mz` a
**3,35:1**, bianco su gradienti chiari, dentro gli avatar che portano le
iniziali di una persona, «MZ», «€» e i numeri di riga del registro accessi.
Nessuna delle due la vede il banco del contrasto, e la ragione è la seconda
domanda che non si era ancora fatta nessuno: **nello stato di partenza quei
colori non ci sono**. Il banco misura 343 testi e risponde «0 sotto soglia» —
vero, e muto su tutto ciò che compare solo in un momento difficile.
