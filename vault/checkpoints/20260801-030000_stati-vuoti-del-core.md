# Checkpoint — gli stati vuoti del core adesso dicono cosa fare

- **Tipo**: correzione trovata guardando + regola 10
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: (aggiunto sotto dopo il commit)

## Come è saltato fuori

Prima volta che il core si apre in locale (grazie al finto Firebase dell'unità
precedente), e la prima cosa che si vede è **la schermata che una cava nuova
vede il primo giorno**: liste vuote dappertutto. Tredici stati vuoti mostravano
icona e titolo e **basta**: «NESSUN MEZZO DA LAVORO» al centro di uno schermo per
il resto nero, senza una riga che dica se il vuoto dipende da chi guarda.

Il paradosso: le sei app, che dal core hanno copiato l'impianto, su questo erano
**più ricche del loro riferimento** — le loro liste vuote spiegano già.

## Cosa è stato scritto

Tredici spiegazioni, e dove il permesso cambia la risposta la frase cambia con
lui — perché dire «aggiungilo col ＋» a chi il ＋ non ce l'ha è peggio del
silenzio:

| dove | chi può | chi non può |
|---|---|---|
| mezzi da lavoro / da strada | «Aggiungi il primo con il ＋ in alto a destra.» | «I mezzi li registra l'ufficio: appena inseriti compaiono qui.» |
| deposito (punte, aste, lubrificanti) | «Aggiungi un tipo di … col bottone qui sotto.» | «I tipi di … li imposta l'ufficio.» |
| personale di supporto | «Aggiungi la prima persona con il ＋…» | «Il personale di supporto lo registra l'ufficio.» |
| clienti | «Aggiungi il primo cliente con il ＋…» | «I clienti li registra l'ufficio.» |
| rubrica | «Aggiungi un contatto con il ＋…» | «La rubrica la tiene l'ufficio…» |

Più i tre «Accesso riservato», ognuno col suo motivo (utenti → amministratori;
quadro di controllo → amministratori e ufficio; registro azioni →
amministratori), «Nessun utente» in messaggi, «Nessuna volata selezionata» e il
«Caricamento…» del registro.

**Un testo era sbagliato e l'ha detto il codice, non l'occhio**: sugli utenti
avevo scritto «riservata ad amministratori e ufficio», ma la guardia è
`can('admin')` e basta. Corretto in «La gestione degli utenti è riservata agli
amministratori».

## Verificato, e in tutti e due i rami

Le frasi cambiano col ruolo, quindi guardarne uno solo verifica metà del lavoro.
Il banco entra come «operatore» e poi come «admin» e legge tutte e due le
versioni: **11 stati vuoti × 2 ruoli**, tutti con la loro spiegazione, nessun
`${…}` rimasto a vista, nessun errore di pagina. Più lo screenshot della
schermata Macchine da amministratore, dove il ＋ in alto a destra c'è davvero —
il testo dice una cosa vera.

Nota tecnica: sei di quelle stringhe erano **stringhe normali**, non template
literal, quindi `${can(...)}` ci sarebbe finito dentro come testo. Convertite
scorrendo il testo, non con un'espressione regolare: gli apici dentro
`can('addMac')` facevano fallire ogni tentativo di delimitare la stringa.

## Regola 10 di `run-stile.mjs`

«Uno stato vuoto con un titolo ha anche una spiegazione». Non riguarda i
segnaposto brevi dentro le schede («Nessun file»), che sono di sola spiegazione
per scelta: la regola guarda chi ha un **titolo**. Controprova sul file vero:
tolta una spiegazione a mano, la regola fallisce e dice quale.

`run-stile` passa da 96 a **108**.

## Prossimo passo atomico

Restando sul core, che finora nessuno aveva potuto guardare: la **home**
mostra «CARICAMENTO METEO…» e «--°» e non si muove più. Va misurato cosa fa
davvero quando la rete non c'è — che in cava è la normalità, non l'eccezione —
e se manca un ripiego va scritto. Poi il giro delle altre schermate col
confronto affiancato.

## Bloccanti

- Nessuno su questa unità.
- Resta gated su decisione del fondatore: Genesi punti pesanti #4/#5/#6.
- Resta **senza risposta** la domanda del fondatore «ti ho chiesto una cosa
  prima».
