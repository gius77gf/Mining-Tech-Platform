/* LA PROVENIENZA DEL VOLUME — scritta e provata qui prima di entrare in
   `terra-data.js`, perché in questo momento gira un giro del browser.
   Decisioni: docs/RICERCA_TRACCIABILITA_VOLUME_202608.md */
const n0 = (v) => Number(v).toLocaleString("it-IT", { maximumFractionDigits: 0, useGrouping: true });
const n2 = (v) => Number(v).toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true });

/* ── DA DOVE VIENE IL VOLUME ────────────────────────────────────────────────
   `origine` assente non vale «inserito a mano»: vale **non lo sappiamo**, ed è
   la stessa forma dichiarata di `provenienzaDi` (assente = scavo) — ma con la
   differenza che qui il ripiego NON è un valore, è l'ammissione. I rilievi
   scritti prima di questa unità ci ricadono senza che nessuno inventi per loro
   un lato cella o una quota di base. */
export function origineDi(rilievo) {
  const o = rilievo && rilievo.origine;
  if (!o || typeof o !== "object") return { da: "non registrata", noto: false };
  const da = String(o.da || "").trim().toLowerCase();
  if (da !== "visore" && da !== "manuale" && da !== "csv") return { ...o, da: "non registrata", noto: false };
  return { ...o, da, noto: true };
}

/* ── LA FRASE DEL VERBALE ───────────────────────────────────────────────────
   ⛔ Il primo requisito NON è l'eleganza: è che senza provenienza la frase
   **non sembri una misura**. Il verbale va a un ente: una riga che tace è una
   riga che lascia credere che il numero sia verificabile. */
export function descriviOrigine(rilievo) {
  const o = origineDi(rilievo);
  if (!o.noto)
    return "La provenienza del calcolo non è registrata: per questo rilievo non "
      + "risultano il metodo di volumetria, il lato della griglia né la quota di "
      + "base, quindi il numero non è riproducibile a partire da questi dati.";
  if (o.da === "manuale")
    return "Volume inserito a mano da chi ha eseguito il rilievo: non deriva da un "
      + "calcolo di questa applicazione.";
  if (o.da === "csv")
    return "Volume importato da un file esterno" + (o.file ? " (" + o.file + ")" : "")
      + ": il calcolo è stato fatto fuori da questa applicazione.";

  /* dal visore: si dice tutto quello che si ha, e si tace solo su ciò che
     manca — dichiarandolo, non saltandolo */
  const p = [];
  p.push("Volume calcolato dal visore con il metodo a griglia: la nuvola viene "
    + "divisa in celle quadrate e di ogni cella si prende la quota più alta; il "
    + "volume è la somma delle altezze sopra un piano di base.");
  const d = [];
  if (Number.isFinite(+o.cella) && +o.cella > 0) d.push("lato cella " + n2(+o.cella) + " m");
  if (Number.isFinite(+o.quotaBase)) d.push("quota di base " + n2(+o.quotaBase) + " m (2° percentile delle quote, non il minimo assoluto, per non farsi abbassare da un punto spurio)");
  if (Number.isFinite(+o.areaCoperta) && +o.areaCoperta > 0) d.push("area coperta " + n0(+o.areaCoperta) + " m²");
  if (Number.isFinite(+o.puntiRitaglio) && +o.puntiRitaglio > 0)
    d.push("punti del ritaglio " + n0(+o.puntiRitaglio)
      + (Number.isFinite(+o.puntiTotali) && +o.puntiTotali > 0 ? " su " + n0(+o.puntiTotali) : ""));
  if (d.length) p.push("Parametri del calcolo: " + d.join("; ") + ".");
  const r = o.ritaglio;
  if (r && ["x0", "x1", "y0", "y1", "z0", "z1"].every((k) => Number.isFinite(+r[k])))
    p.push("Ritaglio: X da " + n2(+r.x0) + " a " + n2(+r.x1) + ", Y da " + n2(+r.y0)
      + " a " + n2(+r.y1) + ", Z da " + n2(+r.z0) + " a " + n2(+r.z1) + ".");
  if (o.file) p.push("File di partenza: " + o.file + (o.quandoVisore ? ", caricato il " + String(o.quandoVisore).slice(0, 10).split("-").reverse().join("/") : "") + ".");
  if (o.georeferenziato === false)
    p.push("⚠️ La nuvola NON è georeferenziata: il volume è espresso nelle unità del file, non in metri cubi.");
  /* ⛔ e quello che manca si DICHIARA: un elenco di parametri con dentro solo
     quelli che c'erano sembra completo a chi legge */
  const mancanti = [];
  if (!(Number.isFinite(+o.cella) && +o.cella > 0)) mancanti.push("il lato della cella");
  if (!Number.isFinite(+o.quotaBase)) mancanti.push("la quota di base");
  if (!r) mancanti.push("il ritaglio");
  if (mancanti.length)
    p.push("Non risulta registrato " + mancanti.join(", né ") + ": per questa parte il calcolo non è riproducibile.");
  return p.join(" ");
}
