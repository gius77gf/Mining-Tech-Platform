# Stato del prodotto — le 6 app in parole semplici

Data: 2026-07-21 · Per Giuseppe (fondatore). Questo file risponde a una
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
- Esportazione in CSV (per il consulente o il medico competente).

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
- **Import piano da CSV**: carichi il piano di produzione senza riscriverlo.

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
- **Import telemetria da CSV**: importi le ore-motore dai portali dei
  costruttori (Caterpillar, Komatsu…) invece di leggerle a mano.

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
- **Incasso atteso** nel periodo.
- **Riepilogo gare** (quante aperte, valore).
- **Import fatture da CSV**: carichi le fatture esistenti senza riscriverle.

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
- **Distanza scalata** (il conto tecnico standard per le vibrazioni).
- **Riepilogo conformità**: quante misure dentro/fuori limite.

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
- **Qualità del rilievo** (metodo RTK/GCP, GSD) in una riga, così il volume
  regge in audit.
- **Riserva residua** e fra quanti anni si esaurisce al ritmo attuale.
- **Import rilievi da CSV**: carichi lo storico dei voli drone.

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
