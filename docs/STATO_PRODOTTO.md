# Stato del prodotto — l'ecosistema in parole semplici

Data: 2026-07-23, **con un aggiornamento del 30/07 qui sotto** · Per Giuseppe
(fondatore). Questo file risponde a una
domanda sola: **oggi, cosa fa ciascuna app, cos'è pronto e cosa aspetta una
tua decisione?** Niente gergo. Se una cosa serve una tua scelta, la trovi
anche in `docs/DECISIONI_WEEKEND.md` (l'elenco delle decisioni).

Come leggerlo:
- **Cosa fa già** = funziona adesso, nella demo e (quando il login live sarà
  acceso) anche con i dati veri dell'azienda cliente.
- **Pronto** = testato, si può mostrare a un cliente.
- **Aspetta te** = una decisione o una spesa che spetta a te; finché non la
  dai, i cicli automatici non la toccano.

Regola di fondo valida per TUTTE le app: ogni azienda cliente vede **solo i
propri dati** (isolamento totale — è la promessa numero uno del prodotto).
Le app girano nel browser; senza login mostrano una **demo** con dati finti
così un commerciale può farle vedere senza configurare nulla.

---

## ⚠️ Aggiornamento del 30 luglio — leggi prima questo

*Il resto del documento è del **23 luglio** e le schede app per app sono ancora
valide: descrivono cose che ci sono e che sono solo cresciute. Quello che è
cambiato in una settimana, però, non c'è — e sono le cose che si vedono per
prime. Questa pagina è la prima che l'indice ti fa aprire: se la leggessi senza
questo blocco, racconteresti il prodotto com'era e la dimostrazione ti
smentirebbe.*

**Quante sono le app.** Il documento dice «6 app + Genesi + Deepwork ID». Il
conto non è cambiato — sono sempre otto strumenti più l'accesso — ma adesso c'è
una **vetrina** (`/apps/`) che li presenta tutti e nove con la schermata vera di
ognuno. È la pagina da aprire per prima davanti a qualcuno.

**Le cose grosse arrivate dopo il 23:**

- **La vetrina dell'ecosistema.** Apertura con tre schermate vere, i sei ponti
  fra le app, nove schede raggruppate per momento del lavoro, e una riga «da
  dove comincio» che smista per problema. Il bottone «Prova il tour» entra
  davvero nel tour, in un colpo solo.
- **I grafici**, in tutte le app. Un motore condiviso scritto in casa (nessuna
  libreria): andamenti con soglia, barre ordinate, ciambelle, sparkline, e
  sotto ogni grafico la tabella «Dati» per chi vuole i numeri.
- **Le app si parlano davvero: sei ponti**, non più uno slogan. Chi va al
  fronte con un documento scaduto, il cavato contro il venduto, le vibrazioni
  misurate che correggono la volata dopo, il carico reale che torna nel
  progetto, un superamento che diventa un'azione con una data, e i turni che
  riempiono il buco fra un volo di drone e l'altro.
- **L'estetica unificata**: le sei verticali hanno la struttura del core pelo
  per pelo, ognuna con la propria tinta. Niente più finestre grigie del
  browser: solo i riquadri del prodotto.
- **Una convenzione sola** per i numeri scritti a mano, per le unità di misura
  e per i soldi, valida in tutte le app — con i controlli automatici che
  impediscono a un'app di riscriversene una propria.

**Quanto è controllato, oggi**: 555 prove automatiche che girano senza rete,
58 sulle regole di sicurezza con l'emulatore, e 11 banchi che aprono davvero le
pagine in un browser (contrasto, unità di misura, campi numerici, niente fuori
dallo schermo di un telefono). Ognuno ha la sua **controprova**: si rimette il
difetto e si pretende che il controllo fallisca.

**Due cose che aspettano una tua decisione**, nuove rispetto al 23:
`docs/REVISIONE_SICUREZZA_202607.md` (l'isolamento fra aziende tiene ed è
provato; dentro l'azienda, invece, tutti possono tutto) e
`docs/PERCHE_DEEPWORK_E_GENESI.md` (la frase da dire quando ti chiedono perché
esistono tutti e due).

---

## Il quadro d'insieme
Abbiamo **6 app verticali** (una per problema di cava) + **Genesi** (il
simulatore di volata) + **Deepwork ID** (il login/abbonamenti comune, la
"Fase 0" da cui dipendono tutte). Le 6 verticali sono a un buon punto:
ognuna ha le sue schermate, i suoi calcoli utili e, dove ha senso, l'**import
da CSV** per caricare lo storico senza riscriverlo a mano.

Cosa manca in generale, per passare da "demo" a "vendibile davvero":
1. **Accendere il login live** (progetto Firebase nuovo) — decisione + serve
   il tuo account Google. Vedi `DECISIONI_WEEKEND.md` punto 1.
2. **Messaggio d'errore quando un salvataggio live non riesce** — oggi in
   demo non fallisce mai; in live un problema di rete resterebbe muto. È una
   scelta di stile, poi è meccanica. Vedi `DECISIONI_WEEKEND.md` punto 5.

Nessuna delle due tocca le funzioni: sono il "collaudo per la vendita".

### Novità trasversali (dopo il 21/07) — valgono per tutte e 6 le app
Rifiniture d'uso quotidiano aggiunte in modo uniforme, verificate con screenshot:
- **Ricerca + conteggio in ogni lista**: scrivi e trovi subito (una fattura, un
  mezzo, una scadenza, un ricambio…), con "N · su totale".
- **Modifica dei record al volo** (icona matita ✎): correggi un dato senza cancellare
  e rifare (prima si perdeva lo storico). Cambiare pagina annulla la modifica in corso.
- **Export CSV di ogni lista principale** (per il commercialista/consulente/ente).
- **App installabili sul telefono** (PWA): ogni app si può mettere sulla home come
  un'app vera, a schermo intero, utile in cava con poca connettività.

---

## 1. Scudo — sicurezza e idoneità del personale
**A cosa serve**: tenere sotto controllo visite mediche, formazione e
scadenze dei lavoratori, così non ti trovi un operaio non idoneo sul fronte.

**Cosa fa già**:
- Semaforo delle scadenze (in regola / in scadenza / scaduto) con quanti
  giorni mancano.
- **Idoneità**: etichetta chiara, qual è il prossimo controllo e quanto è
  critico se salta.
- **Copertura formazione**: a colpo d'occhio quanti sono coperti e quanti no.
- **Adempimenti tipici di cava preimpostati** (sorveglianza sanitaria,
  formazioni, patentini, DSS…): li scegli da un elenco invece di scriverli.
- **Promemoria pronto da inviare**: su una scadenza scaduta o in scadenza copi
  con un tasto il testo della convocazione da mandare al lavoratore (email/SMS).
- **Registro infortuni e near-miss** con il numero grande dei **giorni senza
  infortuni** (il "cartellone" della sicurezza): i near-miss non azzerano il
  conto ma si registrano; import/export CSV per l'RSPP.
- **Import scadenzario** e anagrafica da CSV; **export** CSV per il consulente
  o il medico competente.

**Pronto**: sì, come vetrina. **Aspetta te**: solo l'accensione live comune.

---

## 2. Campo — rapportini e fermi macchina di cantiere
**A cosa serve**: raccogliere cosa è successo in giornata (produzione, fermi,
scarti) senza carta.

**Cosa fa già**:
- Rapportino di giornata con un **riassunto in una riga** pronto da leggere.
- **Fermi macchina** raggruppati per causale (guasto, attesa, ecc.): vedi
  subito dove perdi tempo.
- **Scarto %** con livello (accettabile/alto) sul materiale.
- **Avanzamento della giornata**: quante attività concluse sul totale.
- **Copertura rapportini di turno**: quante squadre hanno già consegnato il
  rapportino e chi manca ancora, prima del cambio turno.
- **Import piano da CSV** ed **export** consuntivo.

**Pronto**: sì. **Aspetta te**: solo l'accensione live comune.

---

## 3. Flotta — mezzi, manutenzioni e ricambi
**A cosa serve**: sapere quali mezzi sono disponibili, quando scadono i
tagliandi e se stai finendo i ricambi.

**Cosa fa già**:
- **Disponibilità** della flotta (quanti mezzi operativi ora).
- **Urgenza manutenzioni**: ordina cosa va fatto prima, anche in ore-motore.
- **Previsione**: fra quanti giorni un mezzo arriva alla soglia tagliando.
- **Ricambi sotto scorta** e scarico automatico della giacenza.
- **Ripartizione dei costi** per voce (dove va la spesa: carburante/ricambi/…).
- **Priorità operative del giorno**: un'unica lista "cosa fare oggi" che unisce
  manutenzioni urgenti (a data e a ore motore), **ricambi sotto scorta** e mezzi
  fermi, con i più gravi in cima.
- **Import telemetria da CSV** (ore-motore dai portali OEM) ed **export** della
  situazione del parco per la direzione/officina.

**Pronto**: sì. **Aspetta te**: l'accensione live comune. Il collegamento
**automatico in tempo reale** con i portali dei mezzi richiede un pezzo di
server (non si può fare solo nel browser) — de-rischiato, scritto nel vault,
si fa quando decidi di investirci.

---

## 4. Conti — fatture, incassi e gare
**A cosa serve**: sapere chi ti deve pagare, quando, e come stanno le gare.

**Cosa fa già**:
- **Scadenzario incassi** per fasce (a scadere / scaduto da 30-60-90 gg).
- **Priorità di incasso** e **solleciti a livelli** (dal promemoria gentile
  al sollecito formale) sulle fatture non pagate.
- **Incasso atteso** nel periodo e **previsione incassi mese per mese**.
- **Esposizione per cliente** (chi ci deve di più → chi chiamare per primo).
- **Interessi di mora di legge** stimati sulle insolute (un numero vero per il
  sollecito) e **riepilogo gare**.
- **Sollecito pronto da inviare**: su una fattura scaduta copi con un tasto il
  testo del sollecito (con mora e totale dovuto) da mandare al cliente.
- **Estratto conto cliente**: per un cliente con più fatture aperte, copi un
  unico documento con tutte le fatture, la mora e il totale dovuto.
- **Import fatture da CSV** ed **export** della situazione.

**Pronto**: sì. **Aspetta te**: l'accensione live comune. La **fattura
elettronica** vera (invio allo SdI dell'Agenzia delle Entrate) **non si può
fare solo nel browser**: serve un intermediario o la PEC. Studiato e scritto
nel vault; è una scelta tua se e quando aggiungerlo.

---

## 5. Sentinella — vibrazioni e conformità delle volate
**A cosa serve**: dimostrare che le tue volate rispettano i limiti di legge
su vibrazioni e rumore, così eviti contestazioni dei vicini/enti.

**Cosa fa già**:
- Stato di ogni misura rispetto alla soglia.
- **Preset di soglia** normativi già pronti da scegliere (invece di
  inventarli): parti dal riferimento giusto.
- **Distanza scalata** e **carica massima per ritardo** (in progettazione
  volata: quanti kg non superare per restare sotto la soglia di vibrazione).
- **Riepilogo conformità**: quante misure dentro/fuori limite.
- **Registro delle volate** (brogliaccio di brillamento): il log di ogni volata
  (data, fronte, fori, kg, distanza), con la distanza scalata calcolata per
  ognuna e le eventuali contestazioni; import/export CSV per gli enti.
- **Import sensori** da CSV ed **export** di monitoraggi e adempimenti.

**Pronto**: sì, ed è una delle app con più "personalità" (pochi competitor la
raccontano in modo semplice). **Aspetta te**: l'accensione live comune. Le
**soglie di legge esatte** per zona sono un riferimento nel vault: vanno
confermate col tuo tecnico prima di venderle come "a norma".

---

## 6. Terra — volumi, rilievi drone e riserve
**A cosa serve**: sapere quanto materiale hai estratto (dai rilievi drone) e
quanto te ne resta in autorizzazione.

**Cosa fa già**:
- Volumi del mese e avanzamento sul piano annuo, **calcolati** dai rilievi
  (mai scritti a mano: sono difendibili in un controllo).
- **Da m³ a valore**: metri cubi → tonnellate → euro (leghi il rilievo alla
  contabilità).
- **Qualità e classe di accuratezza** del rilievo (metodo RTK/GCP, GSD) con la
  **banda di incertezza** sul volume ("19.400 m³ ± 388"), così il numero è
  difendibile in un controllo o in riconciliazione col venduto.
- **Riserva residua** e fra quanti anni si esaurisce; **andamento volumi**
  (ultimo rilievo vs precedente).
- **Proiezione di fine anno**: al ritmo attuale, quanti m³ arriverai a estrarre
  entro dicembre, con avviso se rischi di **superare il volume autorizzato**.
- **Import rilievi da CSV** ed **export** di fronti e rilievi.

**Pronto**: sì. **Aspetta te**: solo l'accensione live comune.

---

## Genesi — il simulatore di volata (a parte)
È il gioiello tecnico (vista 3D, frammentazione, flyrock, confronto A/B…). Il
**motore fisico non si tocca senza una tua indicazione** — è una regola tua.
Per la prossima mossa serve che tu dica *quale* rifinitura vuoi per prima:
vedi `DECISIONI_WEEKEND.md` punto 6 e `apps/genesi/PIANO_3D.md`. Nel vault c'è
già la ricerca (formula Swebrec) pronta per quando deciderai di procedere.

---

## In una frase
Le 6 app verticali **funzionano e si possono mostrare oggi**. Il passo che
sblocca la vendita vera non è dentro le app: è **accendere il login live**
(progetto Firebase) e decidere **come avvisare l'utente se un salvataggio non
riesce**. Tutto il resto (fattura elettronica, telemetria in tempo reale,
soglie di legge esatte, motore di Genesi) è **studiato e in attesa di una tua
scelta**, non di lavoro tecnico bloccato.
