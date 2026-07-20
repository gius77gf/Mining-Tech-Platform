# Decisioni del fondatore — checklist per la revisione del weekend

Questo file è un **indice unico** delle decisioni che spettano a te
(Giuseppe) e che i cicli automatici NON prendono da soli. Ogni voce dice:
cosa è già pronto, quale decisione serve, e dove sono i passi di dettaglio.
Niente qui viene attivato senza una tua conferma esplicita in chat.

Spuntare `[ ]` → `[x]` quando la decisione è presa; poi il ciclo automatico
può procedere con l'attuazione.

---

## 1. Creazione del progetto Firebase nuovo
- **Stato**: guida pronta, niente creato.
- **Decisione che serve**: crei tu il progetto (serve un account Google) e
  incolli in chat la config web + confermi il piano.
- **Costo**: la parte usata (Auth + Firestore) parte **gratis** (piano
  Spark). Le Cloud Functions richiederebbero il piano Blaze — **rimandato**,
  non serve per il go-live.
- **Dettaglio passo-passo**: `apps/deepwork-id/GUIDA_FIREBASE.md`.
- **Dopo la creazione (lato Claude)**: `apps/deepwork-id/ATTIVAZIONE_LIVE.md`
  (config nell'SDK → regole di sicurezza → registrazione → bootstrap owner →
  verifica live).
- [ ] Deciso / fatto

## 2. Regole di sicurezza del progetto Firebase ESISTENTE
- **Stato**: sconosciute (non versionate). Rischio se sono permissive.
- **Decisione che serve**: apri la console del progetto esistente
  (`deepwork-app-6c56f`) → Firestore → Rules e incolli le regole attuali in
  chat, così le versioniamo e correggiamo.
- **Dettaglio**: `docs/AUDIT_SICUREZZA.md` punto 3.
- [ ] Fatto

## 3. Dati di default: reali o di fantasia?
- **Stato**: nel core `index.html` ci sono DEFAULT_CLIENTI / DEFAULT_CAVE /
  DEFAULT_USERS con nomi, telefoni, email, IBAN, coordinate realistici.
- **Decisione che serve**: sono dati **veri**? Se sì, vanno sostituiti con
  dati sintetici (sono pubblici su GitHub) e va valutata la rimozione dallo
  storico.
- **Dettaglio**: `docs/AUDIT_SICUREZZA.md` punti 1 e 2, `docs/CENSIMENTO_FEATURE.md`.
- [ ] Deciso (reali → bonificare / fantasia → ok lasciare)

## 4. Mitigazione password in chiaro
- **Stato**: preparata ma **NON attivata**. Nel core ci sono 7 utenti con
  password in chiaro nel sorgente pubblico.
- **Decisione che serve**: dai il via libera ad attivare la mitigazione
  ponte (verifica su Firestore con hash+salt, niente fallback in chiaro) e
  a **ruotare tutte le password** attuali.
- **Dettaglio**: `docs/MITIGAZIONE_PASSWORD.md` (già con passi operativi e
  bozza di seeding).
- [ ] Via libera

## 5. Gestione errori delle scritture live (scelta di STILE)
- **Stato**: i gestori delle app fanno `await db.xxx()` senza try/catch. In
  demo non fallisce mai; in live un errore Firestore (rete, permessi, quota)
  fallirebbe in silenzio, senza avviso all'utente.
- **Decisione che serve**: come mostrare l'errore all'utente? È una scelta di
  stile (es. riusare il `.note` di esito già presente in ogni form con un
  messaggio rosso "Operazione non riuscita, riprova"). Una volta scelto lo
  stile, l'implementazione è meccanica e sicura.
- **Dettaglio**: `docs/AUDIT_SICUREZZA.md` punto 12.
- [ ] Stile deciso

## 6. Genesi — prossima priorità
- **Stato**: Fase A completa (flyrock, fori bagnati, rock-factor Lilly,
  presplit, confronto A/B). Il motore fisico NON si tocca senza tua
  indicazione.
- **Decisione che serve**: quale rifinitura o nuova feature vuoi per prima?
  (es. una debolezza visiva specifica da correggere, o una nuova scheda di
  calcolo). Senza una tua indicazione i cicli automatici non modificano il
  motore.
- **Dettaglio**: `apps/genesi/PIANO_3D.md`.
- [ ] Indicata la priorità

---

## Cosa procede intanto SENZA di te
I cicli automatici continuano su ciò che è sicuro e non gated: seconde
iterazioni UX delle app, test aggiuntivi, revisioni di qualità/sicurezza,
ricerca competitor (repo `ecosistema-vault`). Le voci qui sopra restano in
attesa finché non le sblocchi in conversazione.
