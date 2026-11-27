/* I CASI con cui Genesi scrive il SUO piano d'innesco XML (`xmlPianoInnesco`),
   per farlo leggere a un altro parser. Qui ci sono solo gli INGRESSI. Li usano
   in due: `scrivi.mjs` (che ne fa i file .xml di questa cartella) e la suite
   `xml-nostro-da-altri.mjs` (che da questi stessi ingressi ricava, per conto
   suo, che cosa nel file ci deve essere).
   NON VA IN npm test: non è una suite, sono i dati di una suite — li importa
   `xml-nostro-da-altri.mjs`, che in `npm test` c'è. */
const fori = (n) => Array.from({ length: n }, (_, i) => ({ id: "f1-" + (i + 1), mx: i * 3.5, my: 3, tDet: i * 25, seq: i }));
const BASE = { B: 3, S: 3.5, diam: 102, prof: 10, kg: 58, stem: 2.2, incl: 10, esplosivo: "ANFO standard",
  innesco: { id: "nonel", nome: "Nonel 25 ms" }, sequenza: "diagonale", ritardo: 25, ritardoFila: 42, lastDet: 75, mic: 58 };
const con = (H, f) => { f(H); return H; };

export const CASI = {
  liscio: { nota: "quattro fori senza valori loro: il piano di sempre",
    piano: { ...BASE, fori: fori(4) } },
  senza_inclinazione: { nota: "un chiamante che non dichiara l'inclinazione: la riga non deve comparire",
    piano: { ...BASE, incl: undefined, fori: fori(3) } },
  per_foro: { nota: "valori per foro: un diametro suo, un foro scarico, un borraggio corto, un'inclinazione sua",
    piano: { ...BASE, fori: con(fori(4), (H) => { H[0].diam = 89; H[1].kg = 0; H[2].stem = 1.5; H[3].incl = 20; }) } },
  nomi_difficili: { nota: "nomi con &, <, >, virgolette, apostrofi, accenti, il simbolo dell'euro, una fine di sezione CDATA e un carattere fuori dal piano di base",
    piano: { ...BASE, esplosivo: "Emulsione «E&X» <70/30> \"sfusa\" d'estate àèì € 😀", innesco: { id: "a&b\"c", nome: "Détonateur n°1 <x>" }, sequenza: "a ]]> b", fori: fori(2) } },
  caratteri_di_controllo: { nota: "nomi con caratteri di controllo (da un file importato): l'XML 1.0 non li ammette, e il piano deve restare leggibile",
    piano: { ...BASE, esplosivo: "ANFO\u0001\u000b con un carattere di controllo", innesco: { id: "x\u0008y", nome: "prima\u0000dopo" }, fori: fori(2) } },
  mezzo_carattere: { nota: "un surrogato rimasto solo in un nome: nel browser faceva crollare l'esportazione",
    piano: { ...BASE, esplosivo: "mezzo carattere \ud83d qui", fori: fori(2) } },
  illeggibile: { nota: "carica del progetto e MIC non leggibili, profondità scritta male: elementi vuoti con il loro stato, mai zeri",
    piano: { ...BASE, kg: null, mic: null, prof: "abc", fori: fori(3) } },
  zero_scritto: { nota: "una MIC e un ritardo scritti a zero sono zeri veri, non valori mancanti",
    piano: { ...BASE, mic: 0, ritardo: 0, ritardoFila: 0, lastDet: 0, fori: con(fori(2), (H) => { H[0].tDet = 0; H[1].tDet = 0; }) } },
  senza_fori: { nota: "nessun foro: un piano vuoto ma ben formato",
    piano: { ...BASE, fori: [] } },
};
