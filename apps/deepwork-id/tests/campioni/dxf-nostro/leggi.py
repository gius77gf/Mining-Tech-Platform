# IL DXF DI GENESI LETTO DA UN ALTRO PROGRAMMA — come nasce letto-da-ezdxf.json.
#
#   node scrivi.mjs                                  (i .dxf, col codice di prodotto)
#   python3 -m venv /tmp/v && /tmp/v/bin/pip install ezdxf==1.4.5
#   /tmp/v/bin/python leggi.py .                     (dentro questa cartella)
#
# I disegni li scrive Genesi; li LEGGE ezdxf, la libreria di riferimento per il
# DXF, e qui scrive che cosa ci ha trovato: con quale lettore (quello normale,
# non quello «di recupero»), quale versione ha riconosciuto, che cosa dice la sua
# verifica del disegno, e ogni entita' dello spazio modello col suo livello.
# Di ogni testo scrive tre cose: `grezzo` (com'e' nel file), `mostrato` (quello
# che un CAD mette a schermo: ezdxf decodifica \U+XXXX e i codici del testo DXF)
# e `recupero` (come lo rende il lettore di recupero di ezdxf).
# Il risultato e' committato: la suite node non ha bisogno di Python, e pretende
# che i .dxf di questa cartella siano ANCORA quelli che Genesi scrive.
import ezdxf, json, sys, os, glob
from ezdxf import recover
from ezdxf.tools.text import plain_text

D = sys.argv[1]
def r6(v): return round(v, 6)
out = {'_ezdxf': ezdxf.__version__}
for p in sorted(glob.glob(os.path.join(D, '*.dxf'))):
    nome = os.path.basename(p)[:-4]
    r = {}
    try:
        doc = ezdxf.readfile(p); r['lettore'] = 'normale'
    except Exception as e:
        r['errore_lettore_normale'] = type(e).__name__ + ': ' + str(e)[:200]
        doc, _ = recover.readfile(p); r['lettore'] = 'recupero'
    r['versione'] = doc.dxfversion
    aud = doc.audit()
    r['verifica_errori'] = [str(e.message)[:160] for e in aud.errors]
    r['verifica_correzioni'] = [str(e.message)[:160] for e in aud.fixes]
    doc_rec, _ = recover.readfile(p)
    testi_rec = [e.dxf.text for e in doc_rec.modelspace().query('TEXT')]
    ent, nt = [], 0
    for e in doc.modelspace():
        t = e.dxftype(); d = {'t': t, 'livello': e.dxf.layer}
        if t == 'CIRCLE': d.update(c=[r6(e.dxf.center.x), r6(e.dxf.center.y)], r=r6(e.dxf.radius))
        elif t == 'TEXT':
            grezzo = e.dxf.text
            d.update(grezzo=grezzo, mostrato=plain_text(ezdxf.decode_dxf_unicode(grezzo)), recupero=testi_rec[nt] if nt < len(testi_rec) else None,
                     p=[r6(e.dxf.insert.x), r6(e.dxf.insert.y)], h=r6(e.dxf.height)); nt += 1
        elif t == 'POLYLINE': d.update(v=[[r6(v.dxf.location.x), r6(v.dxf.location.y)] for v in e.vertices], chiusa=bool(e.is_closed))
        elif t == 'LWPOLYLINE': d.update(v=[[r6(x), r6(y)] for x, y, *_ in e.get_points()], chiusa=bool(e.closed))
        elif t == 'LINE': d.update(v=[[r6(e.dxf.start.x), r6(e.dxf.start.y)], [r6(e.dxf.end.x), r6(e.dxf.end.y)]])
        ent.append(d)
    r['entita'] = ent
    out[nome] = r
json.dump(out, open(os.path.join(D, 'letto-da-ezdxf.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1, sort_keys=True)
print(len(out) - 1, 'disegni letti da ezdxf', ezdxf.__version__)
