/* I CASI con cui Genesi scrive il SUO disegno DXF (`dxfPianoFori`), per farlo
   leggere a un altro programma. Qui ci sono solo gli INGRESSI: i fori, il
   diametro, il profilo del fronte e i valori del progetto. Li usano in due:
   `scrivi.mjs` (che ne fa i file .dxf di questa cartella) e la suite
   `dxf-nostro-da-cad.mjs` (che da questi stessi ingressi ricava, per conto
   suo, che cosa nel disegno ci deve essere).
   NON VA IN npm test: non è una suite, sono i dati di una suite — li importa
   `dxf-nostro-da-cad.mjs`, che in `npm test` c'è. */
export function maglia(file, perRiga, spalla, interasse) {
  const H = []; let n = 0;
  for (let f = 0; f < file; f++) for (let i = 0; i < perRiga; i++) {
    H.push({ id: "f" + (f + 1) + "-" + (i + 1), mx: +(i * interasse + (f % 2 ? interasse / 2 : 0)).toFixed(3), my: +(spalla * (f + 1)).toFixed(3), seq: n++ });
  }
  return H;
}
const FRONTE = [{ x: -2, y: 0.4 }, { x: 3, y: -0.2 }, { x: 8.5, y: 0.35 }, { x: 14, y: 0 }];
const con = (H, f) => { f(H); return H; };

export const CASI = {
  liscia: { nota: "due file da quattro, fori verticali: cerchi, nomi e fronte",
    fori: maglia(2, 4, 3, 3.5), diam: 102, profilo: FRONTE, progetto: { prof: 10, incl: 0, diam: 102 } },
  inclinata: { nota: "tutti i fori a 10°: un piede per foro",
    fori: maglia(2, 4, 3, 3.5), diam: 102, profilo: FRONTE, progetto: { prof: 10, incl: 10, diam: 102 } },
  mista: { nota: "valori per foro: un diametro suo, un'inclinazione sua, una profondità sua, un foro verticale di suo",
    fori: con(maglia(3, 4, 3, 3.5), (H) => { H[1].diam = 89; H[5].incl = 20; H[7].prof = 6; H[9].incl = 0; }),
    diam: 102, profilo: FRONTE, progetto: { prof: 10, incl: 10, diam: 102 } },
  senza_fronte: { nota: "nessun profilo: il livello FRONTE non deve comparire",
    fori: maglia(1, 3, 3, 3.5), diam: 76, profilo: null, progetto: { prof: 8, incl: 5, diam: 76 } },
  senza_progetto: { nota: "la chiamata di una volta, senza il progetto: nessun piede",
    fori: maglia(1, 3, 3, 3.5), diam: 102, profilo: FRONTE, progetto: undefined },
  nomi_difficili: { nota: "nomi con accenti, simboli, un circonflesso, un carattere fuori dal piano di base, una tabulazione; e fori senza nome",
    fori: con(maglia(1, 3, 3, 3.5), (H) => { H[0].id = "Foro n°1 (àèì) €"; H[1].id = ""; H[2].id = null;
      H.push({ id: "a^b 😀 x\ty", mx: 10.5, my: 3 }, { id: "   ", mx: 14, my: 3 }, { id: 7, mx: 17.5, my: 3 }); }),
    diam: 102, profilo: FRONTE, progetto: undefined },
  fori_non_validi: { nota: "un foro senza coordinate leggibili non entra; gli altri sì",
    fori: con(maglia(1, 3, 3, 3.5), (H) => { H.push({ id: "storto", mx: "abc", my: 3 }, null, { id: "senza-y", mx: 2 }); }),
    diam: 102, profilo: FRONTE.concat([{ x: "x", y: 1 }]), progetto: { prof: 10, incl: 10, diam: 102 } },
  un_foro: { nota: "un foro solo, e un fronte di un punto solo (che non è una linea)",
    fori: [{ id: "solo", mx: 0, my: 3 }], diam: 102, profilo: [{ x: 0, y: 0 }], progetto: undefined },
  vuoto: { nota: "nessun foro e nessun fronte: un disegno vuoto, ma un disegno",
    fori: [], diam: 102, profilo: null, progetto: undefined },
};
