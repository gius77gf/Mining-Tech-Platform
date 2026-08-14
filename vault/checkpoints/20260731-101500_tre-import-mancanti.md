# Checkpoint — i tre buchi dell'onboarding, chiusi tutti e tre

- **Tipo**: tre unità di prodotto nate da una misura fatta ieri
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `a586204` (listino Conti), `679075e` (ricettori Sentinella),
  `ab5ef47` (ricambi Flotta)

## Da dove venivano

Non da un'idea: da una **misura**. Verificando `ONBOARDING_DATI.md` avevo
contato i punti d'importazione veri dentro le app — quindici — e scritto quali
tre mancanze avrebbero fatto più male al primo cliente, *perché sono proprio
quelle che una cava ha già in un foglio di calcolo*. Erano il listino di Conti,
i ricettori di Sentinella e i ricambi di Flotta. Sono chiusi tutti e tre,
nell'ordine in cui li avevo messi.

## La cosa che ho imparato scrivendoli

**Non esiste una regola sola per il dato che manca.** Avevo cominciato la
giornata con una convinzione — «il dato che manca resta mancante» — e i tre
importatori l'hanno smentita: dipende da **cosa fa quel dato**.

| Campo | Se manca | Perché |
|---|---|---|
| **densità** (listino) | resta vuota | da m³ a tonnellate si passa con quel numero: inventarlo trasforma un dato assente in un dato **sbagliato** che finisce in una fattura |
| **soglia** (ricettore) | resta vuota | è un numero di **sicurezza**: dichiarerebbe conforme o non conforme una misura sulla base di un valore che nessuno ha scelto |
| **classe acustica** | resta vuota | **decide** una soglia. Un campo vuoto si vede e si corregge; una classe sbagliata no |
| **giacenza** (ricambio) | vale **ZERO** | un pezzo in magazzino senza quantità è un pezzo **finito**, e zero è ciò che fa scattare il sotto-scorta. Lasciarla vuota nasconderebbe proprio i pezzi da ordinare |
| **soglia minima** | resta vuota | una soglia inventata fa suonare un allarme che nessuno ha chiesto |
| **prezzo** | resta vuoto | uno zero farebbe sembrare gratis un pezzo che non lo è |

La giacenza è l'unico posto di tutta la giornata in cui **il valore di comodo è
quello giusto**. Se avessi applicato la regola per abitudine, avrei nascosto
esattamente i pezzi che l'app deve segnalare.

## L'altra metà: dirlo a chi ha appena caricato

Ogni importatore, finito, **dice cosa non potrà fare** con quello che manca:
quanti prodotti non convertiranno m³ e tonnellate, quanti ricettori useranno la
soglia del punto invece della propria, quanti ricambi non entreranno nel
sotto-scorta. Adesso, non il giorno in cui una conversione non esce o un pezzo
finisce senza avvisare — quando l'app sembrerebbe rotta e invece non le è mai
stato detto niente.

## Le prove

29 asserzioni nuove in tutto, **KPI 345 → 355**. Per il listino e i ricettori la
controprova: rimesso un valore di comodo al posto del vuoto, le prove cadono.
Tutti e tre verificati anche nel browser — bottoni al posto giusto, 44 px di
altezza, nessun errore di pagina, unità di misura corrette — e con i banchi
delle unità e del fuori-schermo sulle app toccate.

## Il vincolo rispettato

Sui ricettori si tocca un campo che porta la parola «soglia». **Nessuna curva e
nessun valore di riferimento del prodotto è stato toccato**: la funzione legge
quello che il cliente scrive nel suo file e, quando non c'è, non mette niente.
La soglia propria del ricettore era già facoltativa nel prodotto.

## Prossimo passo atomico

Aggiungere a `docs/ONBOARDING_DATI.md` le **tre schede con colonne ed esempio**
per i tre nuovi importatori, nella stessa forma delle quattordici che ci sono
già: oggi la tabella dice che si caricano, ma chi deve preparare il file non
trova ancora il modello da copiare.

## Bloccanti

- Nessuno.
