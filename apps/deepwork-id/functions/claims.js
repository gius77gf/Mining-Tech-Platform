// ============================================================
// La convergenza dei claims — la parte PURA, senza firebase-admin.
//
// PERCHÉ ESISTE QUESTO FILE
// `rebuildClaims` era un leggi-poi-scrivi senza nessun ordine garantito:
// ogni scrittura su una membership fa partire un trigger, e due scritture
// ravvicinate sullo STESSO utente fanno partire due trigger che si
// sovrappongono. Se quello partito PRIMA (che ha letto una fotografia in cui
// la seconda membership non c'era ancora) atterra per ULTIMO, la sua lettura
// vecchia sovrascrive quella nuova: nel token resta UNA org sola, e l'altra
// sparisce. La membership su Firestore dice `active`, il token dice di no, e
// l'utente si sente rispondere «Non sei membro di questa organizzazione».
// È un aggiornamento perduto, e resta lì finché qualcuno non riscrive una
// membership: nessun errore, nessun registro, nessun modo di accorgersene.
//
// LA CURA: dopo aver scritto si RILEGGE. Se la rilettura dice una cosa
// diversa da ciò che si è appena scritto, si riscrive. Il trigger rimasto
// indietro, alla seconda occhiata, vede il mondo completo e rimette a posto
// ciò che aveva appena guastato.
//
// PERCHÉ BASTA: l'ultimo trigger a partire legge SEMPRE dopo l'ultima
// scrittura di membership (è quella che l'ha svegliato). Il solo modo di
// finire storti era che una scrittura vecchia atterrasse dopo la sua; ma
// quella vecchia adesso rilegge dopo aver scritto — cioè dopo l'ultima
// scrittura di membership — e quindi vede tutto.
//
// IL LIMITE, DICHIARATO: non è un lucchetto. Se le membership continuano a
// cambiare più in fretta di quanto si rilegga, si esce dopo `giriMax` giri
// con `convergiuto: false`, e chi chiama può dirlo. Non si aspetta in
// eterno: un trigger che non finisce è peggio di un claim vecchio.
//
// IL COSTO, DICHIARATO: una lettura in più per ogni scrittura di membership
// (la rilettura). Quando non è cambiato niente — il caso normale — le
// scritture restano UNA: la seconda occhiata trova lo stesso insieme e si
// ferma senza toccare il token.
// ============================================================

/* Due mappe {orgId: ruolo} dicono la stessa cosa? Conta l'insieme delle org
   E il ruolo dentro ognuna: una promozione da `member` a `owner` è un
   cambiamento come l'ingresso in un'organizzazione nuova. */
function stessiOrgs(a, b) {
  const ka = Object.keys(a || {});
  const kb = Object.keys(b || {});
  if (ka.length !== kb.length) return false;
  return ka.every((k) => Object.prototype.hasOwnProperty.call(b, k) && a[k] === b[k]);
}

/* leggi()  → Promise<{orgId: ruolo}>  le membership attive di questo utente
   scrivi(orgs) → Promise<boolean|undefined>  scrive i claims; `false` vuol dire
                  «non c'è più niente da scrivere» (utente Auth sparito) e
                  ferma il giro senza fingere che sia andata bene. */
async function convergiClaims({ leggi, scrivi, giriMax = 3 }) {
  let scritti = null;
  let letture = 0;
  let scritture = 0;
  for (let giro = 0; giro < giriMax; giro++) {
    const letti = await leggi();
    letture++;
    if (scritti && stessiOrgs(scritti, letti)) {
      return { orgs: letti, letture, scritture, convergiuto: true };
    }
    const esito = await scrivi(letti);
    scritture++;
    scritti = letti;
    if (esito === false) {
      return { orgs: letti, letture, scritture, convergiuto: false, fermato: "utente-assente" };
    }
  }
  return { orgs: scritti, letture, scritture, convergiuto: false, fermato: "giri-esauriti" };
}

module.exports = { stessiOrgs, convergiClaims };
