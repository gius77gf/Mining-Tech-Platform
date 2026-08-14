/* ⛔ DUE TRIGGER SULLO STESSO UTENTE, E QUELLO RIMASTO INDIETRO CANCELLA UN
   ORGANIZZAZIONE DAL TOKEN — la prova sta QUI, senza emulatore, per la stessa
   ragione di `bootstrap-rivendicazioni.mjs`.
   ══════════════════════════════════════════════════════════════════════════
   Il difetto l'ha trovato la CI, una volta sola su trenta: `run-sdk.mjs` è
   caduta su «membro di DUE org cambia org attiva» con *Non sei membro di
   questa organizzazione*, mentre in casa la stessa suite, con gli stessi tre
   emulatori (firestore+auth+functions), è passata **19/0 per tre giri di
   fila**. Un rosso che si presenta una volta e non si riproduce è la cosa
   più facile da chiamare «flaky» e da rilanciare: sotto c'era un
   aggiornamento perduto vero.

   Il meccanismo: `rebuildClaims` legge le membership e scrive i claims. Due
   scritture di membership ravvicinate sullo stesso utente svegliano DUE
   trigger. Quello partito prima ha letto una fotografia in cui la seconda
   membership non c'era; se la sua scrittura atterra per ULTIMA, nel token
   resta una org sola. Su Firestore la membership dice `active`, il token dice
   di no, e non lo segnala niente — nessun errore, nessuna riga di registro —
   finché qualcuno non riscrive una membership.

   ⚠️ PERCHÉ UNA PROVA COI FINTI E NON SOTTO L'EMULATORE: l'interleaving che
   morde è raro (1 su 30 in CI, 0 su 3 in casa). Una prova che lo aspetta
   sarebbe verde quasi sempre **anche col difetto rimesso** — cioè non
   saprebbe fallire, che è la sola cosa che rende una prova una prova. Qui
   l'ordine delle mosse è SCRITTO: il trigger rimasto indietro scrive per
   ultimo, sempre.

   Uso:  node apps/deepwork-id/tests/claims-convergenza.mjs                  */

import { convergiClaims, stessiOrgs } from "../functions/claims.js";

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ✓ ${t}`); } else { ko++; console.log(`  ✗ ${t}${x !== undefined ? `: ${x}` : ""}`); } };

/* Il mondo finto: `claims` è il token, `letture` è il copione di ciò che la
   collectionGroup vede a ogni chiamata (la fotografia cambia sotto i piedi). */
function mondo(copione) {
  const m = {
    claims: null,
    i: 0,
    scritte: [],
    leggi: async () => copione[Math.min(m.i++, copione.length - 1)],
    scrivi: async (orgs) => { m.claims = orgs; m.scritte.push(orgs); return true; },
  };
  return m;
}

/* La forma VECCHIA, scritta qui apposta: legge una volta e scrive una volta.
   Non serve a giudicare il prodotto — serve a dimostrare che il copione qui
   sotto sa davvero produrre l'aggiornamento perduto. Un'iniezione va
   verificata dove il programma la legge. */
async function vecchiaForma({ leggi, scrivi }) {
  const letti = await leggi();
  await scrivi(letti);
  return { orgs: letti };
}

console.log("\n— stessiOrgs: due mappe dicono la stessa cosa? —");
dice(stessiOrgs({ a: "member" }, { a: "member" }) === true, "stesse org, stesso ruolo");
dice(stessiOrgs({ a: "member" }, { a: "owner" }) === false,
  "una PROMOZIONE è un cambiamento: member → owner non è lo stesso claim");
dice(stessiOrgs({ a: "member", b: "member" }, { a: "member" }) === false, "una org in meno");
dice(stessiOrgs({ a: "member" }, { a: "member", b: "member" }) === false, "una org in più");
dice(stessiOrgs({}, {}) === true, "nessuna org, in tutt'e due");
dice(stessiOrgs(null, {}) === true, "un claim mai scritto e uno vuoto dicono la stessa cosa");

console.log("\n— L'aggiornamento perduto: il trigger rimasto indietro scrive per ultimo —");
/* La scena, nell'ordine in cui è successa in CI:
   1. arriva la membership su orgB  → parte T1, che legge {B};
   2. arriva la membership su orgA  → parte T2, che legge {A,B} e scrive;
   3. la scrittura di T1 atterra ADESSO, con la fotografia vecchia.
   Si esegue T2 per intero e POI T1: è esattamente «T1 scrive per ultimo». */
{
  const DUE = { orgA: "member", orgB: "member" };
  const vecchio = mondo([{ orgB: "member" }, DUE, DUE]);
  await vecchiaForma({ leggi: async () => DUE, scrivi: vecchio.scrivi });          // T2
  await vecchiaForma({ leggi: vecchio.leggi, scrivi: vecchio.scrivi });            // T1, in ritardo
  dice(Object.keys(vecchio.claims).length === 1 && vecchio.claims.orgB === "member",
    "con la forma vecchia il token perde orgA (il copione sa produrre il difetto)",
    JSON.stringify(vecchio.claims));

  const nuovo = mondo([{ orgB: "member" }, DUE, DUE]);
  await convergiClaims({ leggi: async () => DUE, scrivi: nuovo.scrivi });          // T2
  const e1 = await convergiClaims({ leggi: nuovo.leggi, scrivi: nuovo.scrivi });   // T1, in ritardo
  dice(stessiOrgs(nuovo.claims, DUE),
    "rileggendo dopo aver scritto, T1 rimette a posto ciò che aveva guastato",
    JSON.stringify(nuovo.claims));
  dice(e1.convergiuto === true, "e lo dichiara: convergiuto", JSON.stringify(e1));
  dice(e1.scritture === 2 && e1.letture === 3,
    "T1 in ritardo paga due scritture e tre letture", `${e1.scritture}/${e1.letture}`);
}

console.log("\n— Il costo quando non è cambiato niente (il caso normale) —");
{
  const UNA = { orgA: "member" };
  const m = mondo([UNA, UNA, UNA]);
  const e = await convergiClaims({ leggi: m.leggi, scrivi: m.scrivi });
  dice(e.scritture === 1, "una sola scrittura sul token", String(e.scritture));
  dice(e.letture === 2, "due letture: la seconda è l'occhiata che chiude", String(e.letture));
  dice(e.convergiuto === true && stessiOrgs(m.claims, UNA), "e il claim è quello giusto");
}

console.log("\n— I due modi di fermarsi, e nessuno dei due tace —");
{
  /* L'utente Auth non c'è più (membership orfana): `scrivi` risponde `false`.
     Non è un guasto — è un fatto — ma non si può nemmeno dichiarare
     convergiuto, se no una membership orfana passerebbe per un token a posto. */
  const m = mondo([{ orgA: "member" }, { orgA: "member" }]);
  const e = await convergiClaims({ leggi: m.leggi, scrivi: async () => false });
  dice(e.fermato === "utente-assente", "utente sparito: si ferma dichiarandolo", e.fermato);
  dice(e.convergiuto === false, "e NON dichiara convergiuto");
  dice(e.scritture === 1 && e.letture === 1, "senza insistere", `${e.scritture}/${e.letture}`);
}
{
  /* Le membership cambiano più in fretta di quanto si rilegga: si esce dopo
     `giriMax` invece di girare in eterno. Un trigger che non finisce è peggio
     di un claim vecchio — ma il numero di giri va detto, non nascosto. */
  let n = 0;
  const m = mondo([]);
  const e = await convergiClaims({ leggi: async () => ({ ["org" + (n++)]: "member" }), scrivi: m.scrivi });
  dice(e.fermato === "giri-esauriti", "mondo che non sta fermo: si esce dopo i giri", e.fermato);
  dice(e.letture === 3 && e.scritture === 3, "tre e tre, il tetto dichiarato", `${e.letture}/${e.scritture}`);
  const e2 = await convergiClaims({ leggi: async () => ({ ["org" + (n++)]: "member" }), scrivi: m.scrivi, giriMax: 5 });
  dice(e2.letture === 5, "e il tetto si può alzare", String(e2.letture));
}

console.log(`\nRisultato convergenza dei claims: ${ok} passati, ${ko} falliti`
  + `  ·  nessun emulatore: il soggetto è l'ORDINE delle mosse, che sotto`
  + ` l'emulatore capita una volta su trenta e non si sa comandare`);
process.exit(ko > 0 ? 1 : 0);
