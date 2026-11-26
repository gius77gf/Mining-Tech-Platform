# I CAMPIONI DXF DI dxf-da-cad.mjs — come sono nati, e come si rigenerano.
#
#   python3 -m venv /tmp/v && /tmp/v/bin/pip install ezdxf==1.4.5
#   /tmp/v/bin/python genera.py .        (dentro questa cartella)
#
# I file li scrive ezdxf, la libreria di riferimento per il DXF: NON sono scritti
# a mano da chi ha scritto il lettore di Genesi, ed e' il punto. Per ciascuno
# verita.json dice che cosa c'e' davvero nel disegno (spazio modello, coordinate
# mondo) e che cosa Genesi deve DICHIARARE di non aver portato dentro.
# I campioni sono committati: la suite node non ha bisogno di Python.
import ezdxf, json, sys, os, math
from ezdxf.math import Vec3

OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)
verita = {}

def salva(nome, doc, attesi, nota=''):
    p = os.path.join(OUT, nome + '.dxf')
    doc.saveas(p)
    verita[nome] = {'attesi': attesi, 'nota': nota}

# la CURVA VERA di un'entita, detta da ezdxf (non da Genesi) come elenco di PRIMITIVE esatte in
# coordinate mondo: segmenti, archi (centro, raggio, punto iniziale, un punto di passaggio, punto
# finale) e cerchi. La suite misura contro queste la spezzata che Genesi ricava.
# ⚠️ NON si usa `ezdxf.path...flattening`: rende i cerchi con curve di Bezier, che su un raggio di
# 100 m si scostano dal cerchio vero di 27 mm — misurato: il «riferimento» sbagliava piu della
# tolleranza che doveva giudicare. Centro, raggio e angoli invece sono esatti.
def _p(v): return [round(v.x, 9), round(v.y, 9)]
def _arco(a):
    c = a.ocs().to_wcs(a.dxf.center)
    pts = list(a.vertices(list(a.angles(3))))          # inizio, mezzo, fine — gia in coordinate mondo
    return {'t': 'arco', 'c': _p(c), 'r': a.dxf.radius, 'da': _p(pts[0]), 'per': _p(pts[1]), 'a': _p(pts[2])}
def curva(entita):
    t = entita.dxftype()
    if t == 'ARC': return [_arco(entita)]
    if t == 'CIRCLE': return [{'t': 'cerchio', 'c': _p(entita.ocs().to_wcs(entita.dxf.center)), 'r': entita.dxf.radius}]
    out = []
    for v in entita.virtual_entities():                # LWPOLYLINE / POLYLINE: i suoi lati, dritti o ad arco
        if v.dxftype() == 'ARC': out.append(_arco(v))
        elif v.dxftype() == 'LINE': out.append({'t': 'linea', 'a': _p(v.dxf.start), 'b': _p(v.dxf.end)})
    return out

def seg(a, b):
    return [[round(a[0], 6), round(a[1], 6)], [round(b[0], 6), round(b[1], 6)]]

# 1. LINE semplice, in tutte le versioni
for ver in ['R12', 'R2000', 'R2010', 'R2018']:
    d = ezdxf.new(ver); m = d.modelspace()
    m.add_line((0, 0), (10, 5))
    salva('line_' + ver, d, {'tratti': 1, 'polilinee': [[[0, 0], [10, 5]]]})

# 2. LWPOLYLINE aperta e chiusa (R2000+)
d = ezdxf.new('R2010'); m = d.modelspace()
m.add_lwpolyline([(0, 0), (10, 0), (10, 10), (0, 10)])
salva('lwpoly_aperta', d, {'tratti': 1, 'polilinee': [[[0, 0], [10, 0], [10, 10], [0, 10]]]})

d = ezdxf.new('R2010'); m = d.modelspace()
m.add_lwpolyline([(0, 0), (10, 0), (10, 10), (0, 10)], close=True)
salva('lwpoly_chiusa', d, {'tratti': 1, 'polilinee': [[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]]},
      'chiusa: il quarto lato (0,10)->(0,0) esiste nel disegno')

# 3. POLYLINE 2D chiusa (R12)
d = ezdxf.new('R12'); m = d.modelspace()
m.add_polyline2d([(0, 0), (10, 0), (10, 10), (0, 10)], close=True)
salva('poly2d_chiusa_R12', d, {'tratti': 1, 'polilinee': [[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]]},
      'chiusa: il quarto lato esiste nel disegno')

# 4. POLYLINE 3D (rilievo topografico tipico)
d = ezdxf.new('R2000'); m = d.modelspace()
m.add_polyline3d([(0, 0, 100), (10, 2, 101), (20, 3, 99)])
salva('poly3d', d, {'tratti': 1, 'polilinee': [[[0, 0], [10, 2], [20, 3]]]})

# 5. Blocco DEFINITO ma mai inserito: nel disegno NON c'e' niente
d = ezdxf.new('R2010'); m = d.modelspace()
b = d.blocks.new('SIMBOLO'); b.add_line((0, 0), (1, 1)); b.add_line((1, 0), (0, 1))
m.add_line((100, 100), (110, 100))
salva('blocco_non_inserito', d, {'tratti': 1, 'polilinee': [[[100, 100], [110, 100]]]},
      'il blocco e solo definito: le sue due linee NON sono nel disegno')

# 6. Blocco inserito con spostamento: le linee stanno a (50,50), non a (0,0)
d = ezdxf.new('R2010'); m = d.modelspace()
b = d.blocks.new('CROCE'); b.add_line((0, 0), (1, 1)); b.add_line((1, 0), (0, 1))
m.add_blockref('CROCE', (50, 50))
salva('blocco_inserito', d, {'tratti': 0, 'nonLette': {'INSERT': 1}},
      'il contenuto di un blocco inserito non si espande: si DICHIARA (1 blocco inserito), e soprattutto non compare attorno a (0,0)')

# 7. Entita nello spazio carta (cartiglio): non fa parte del modello
d = ezdxf.new('R2010'); m = d.modelspace()
m.add_line((0, 0), (10, 0))
ps = d.layout('Layout1'); ps.add_line((0, 0), (420, 0)); ps.add_line((0, 0), (0, 297))
salva('spazio_carta', d, {'tratti': 1, 'polilinee': [[[0, 0], [10, 0]]], 'spazioCarta': 2},
      'le due linee del cartiglio (spazio carta) NON sono geometria del sito')

# 8. Unita dichiarate in millimetri ($INSUNITS=4): 10 m = 10000
d = ezdxf.new('R2010'); d.header['$INSUNITS'] = 4; m = d.modelspace()
m.add_line((0, 0), (10000, 0))
salva('unita_mm', d, {'tratti': 1, 'polilinee': [[[0, 0], [10000, 0]]], 'unita': 'millimetri', 'larghezza': 10000},
      'il file dichiara millimetri: NON si converte da soli (acadiso.dwt dichiara mm anche sui disegni in metri), si riporta unita e ingombro')

# 9. Archi e cerchi (curve di livello, raccordi): entita che Genesi non legge
d = ezdxf.new('R2010'); m = d.modelspace()
m.add_line((0, 0), (10, 0))
a1 = m.add_arc((5, 5), 3, 0, 90); a2 = m.add_arc((15, 5), 3, 0, 180); c1 = m.add_circle((20, 20), 2)
m.add_spline([(0, 0), (5, 3), (10, 0), (15, -3)])
m.add_point((3, 3))
salva('curve_miste', d, {'tratti': 4, 'polilinee': [[[0, 0], [10, 0]]], 'curve': [curva(a1), curva(a2), curva(c1)], 'archiSpezzati': 3, 'nonLette': {'SPLINE': 1, 'POINT': 1}},
      'la linea, i due archi e il cerchio entrano (gli archi come spezzate); spline e punto vanno CONTATI, non fatti sparire')

# 10. LWPOLYLINE con bulge (tratto ad arco)
d = ezdxf.new('R2010'); m = d.modelspace()
pb = m.add_lwpolyline([(0, 0, 1.0), (10, 0, 0)], format='xyb')  # semicerchio fra (0,0) e (10,0)
salva('lwpoly_bulge', d, {'tratti': 1, 'curve': [curva(pb)], 'archiSpezzati': 1},
      'il tratto e un semicerchio di raggio 5: entra come spezzata sulla curva vera, non come corda di 10 m')

# 11. LWPOLYLINE specchiata (estrusione 0,0,-1): in mondo le X sono negate
d = ezdxf.new('R2010'); m = d.modelspace()
pl = m.add_lwpolyline([(0, 0), (10, 0), (10, 5)])
pl.dxf.extrusion = (0, 0, -1)
mondo = [[round(w.x, 6), round(w.y, 6)] for w in (pl.ocs().to_wcs(Vec3(x, y, 0)) for x, y in [(0, 0), (10, 0), (10, 5)])]
salva('lwpoly_specchiata', d, {'tratti': 1, 'polilinee': [mondo]},
      'estrusione (0,0,-1): le coordinate nel file sono in OCS, il mondo ha X negata')

# 12. Polyface mesh (TIN di un rilievo): NON e una polilinea
d = ezdxf.new('R12'); m = d.modelspace()
pf = m.add_polyface()
pf.append_face([(0, 0, 0), (10, 0, 1), (10, 10, 2)])
pf.append_face([(0, 0, 0), (10, 10, 2), (0, 10, 1)])
m.add_line((100, 0), (110, 0))
salva('polyface_tin', d, {'tratti': 1, 'polilinee': [[[100, 0], [110, 0]]], 'nonLette': {'POLYLINE (superficie)': 1}},
      'la mesh non e un tratto: una polilinea che passa per i suoi vertici (e per 0,0 dei record-faccia) e geometria inventata')

# 13. DXF con fine riga Windows e spazi di rientro (come lo scrive AutoCAD)
d = ezdxf.new('R2010'); m = d.modelspace()
m.add_line((1.5, 2.5), (3.5, 4.5))
p = os.path.join(OUT, 'crlf.dxf'); d.saveas(p)
t = open(p, 'r', encoding='utf-8', errors='replace').read().replace('\r\n', '\n').replace('\n', '\r\n')
open(p, 'w', encoding='utf-8', newline='').write(t)
verita['crlf'] = {'attesi': {'tratti': 1, 'polilinee': [[[1.5, 2.5], [3.5, 4.5]]]}, 'nota': 'fine riga CRLF'}

# 14. DXF binario
d = ezdxf.new('R2010'); m = d.modelspace(); m.add_line((0, 0), (10, 0))
d.saveas(os.path.join(OUT, 'binario.dxf'), fmt='bin')
verita['binario'] = {'attesi': {'tratti': 0, 'binario': True}, 'nota': 'DXF binario: non si legge, e va DICHIARATO binario (non «il file non contiene linee»)'}

# 15. Linea con Z diversa (LINE 3D inclinata) — la pianta resta x,y
d = ezdxf.new('R2010'); m = d.modelspace(); m.add_line((0, 0, 100), (10, 0, 90))
salva('line_3d', d, {'tratti': 1, 'polilinee': [[[0, 0], [10, 0]]]})

# 16. Linea su layer spento/congelato: un CAD non la mostra
d = ezdxf.new('R2010'); m = d.modelspace()
d.layers.add('NASCOSTO'); d.layers.get('NASCOSTO').off()
m.add_line((0, 0), (10, 0)); m.add_line((0, 5), (10, 5), dxfattribs={'layer': 'NASCOSTO'})
salva('layer_spento', d, {'tratti': 2, 'polilinee': [[[0, 0], [10, 0]], [[0, 5], [10, 5]]]},
      'layer spento: scelta di prodotto (leggerla e ragionevole) — solo censita')

# 17. Blocco inserito CON attributi (INSERT + ATTRIB + SEQEND), seguito da una linea vera
d = ezdxf.new('R2010'); m = d.modelspace()
b = d.blocks.new('PUNTO'); b.add_line((0, 0), (1, 0)); b.add_attdef('QUOTA', (0, 1))
ref = m.add_blockref('PUNTO', (30, 30)); ref.add_auto_attribs({'QUOTA': '412.5'})
m.add_line((0, 0), (10, 0))
salva('blocco_con_attributi', d, {'tratti': 1, 'polilinee': [[[0, 0], [10, 0]]], 'nonLette': {'INSERT': 1}},
      'gli ATTRIB e il SEQEND di un blocco inserito non sono entita a se: si conta 1 blocco, e la linea DOPO si legge')

# 18. LWPOLYLINE chiusa con l arco sul lato di chiusura (un piazzale col bordo tondo)
d = ezdxf.new('R2010'); m = d.modelspace()
pc = m.add_lwpolyline([(0, 0, 0), (10, 0, 0), (10, 10, 0), (0, 10, 1.0)], format='xyb', close=True)
salva('lwpoly_chiusa_arco', d, {'tratti': 1, 'curve': [curva(pc)], 'archiSpezzati': 1},
      'l arco sta sul lato che chiude: su una polilinea CHIUSA conta, su una aperta no')

# 19. POLYLINE 2D specchiata (R12): stessa regola dell OCS della LWPOLYLINE
d = ezdxf.new('R12'); m = d.modelspace()
pl = m.add_polyline2d([(0, 0), (10, 0), (10, 5)]); pl.dxf.extrusion = (0, 0, -1)
salva('poly2d_specchiata_R12', d, {'tratti': 1, 'polilinee': [[[0, 0], [-10, 0], [-10, 5]]]},
      'estrusione (0,0,-1) su una POLYLINE 2D: il mondo ha X negata')

# ── GLI ARCHI (26/11): le forme in cui un CAD scrive una curva ──────────────────────────
# 20. ARC specchiato (estrusione 0,0,-1): centro e angoli sono nel sistema dell oggetto
d = ezdxf.new('R2010'); m = d.modelspace()
a = m.add_arc((5, 5), 3, 0, 90, dxfattribs={'extrusion': (0, 0, -1)})
salva('arco_specchiato', d, {'tratti': 1, 'curve': [curva(a)], 'archiSpezzati': 1},
      'ARC con estrusione (0,0,-1): nel mondo il centro e a x = -5 e l arco gira dall altra parte')

# 21. POLYLINE 2D vecchio stile (R12) con un tratto ad arco e uno dritto
d = ezdxf.new('R12'); m = d.modelspace()
pl = m.add_polyline2d([(0, 0, 0.5), (10, 0, 0), (10, 8, 0)], format='xyb')
salva('poly2d_bulge_R12', d, {'tratti': 1, 'curve': [curva(pl)], 'archiSpezzati': 1},
      'la curvatura sta sul VERTEX (codice 42) di una POLYLINE vecchio stile: stesso arco della LWPOLYLINE')

# 22. Curvatura NEGATIVA (arco in senso orario) seguita da un tratto dritto
d = ezdxf.new('R2010'); m = d.modelspace()
pn = m.add_lwpolyline([(0, 0, -0.5), (10, 0, 0), (10, 10, 0)], format='xyb')
salva('lwpoly_bulge_negativo', d, {'tratti': 1, 'curve': [curva(pn)], 'archiSpezzati': 1},
      'bulge negativo: l arco sta dall ALTRA parte della corda rispetto a uno positivo')

# 23. LWPOLYLINE con arco E specchiata
d = ezdxf.new('R2010'); m = d.modelspace()
ps = m.add_lwpolyline([(0, 0, 1.0), (10, 0, 0), (10, 5, 0)], format='xyb', dxfattribs={'extrusion': (0, 0, -1)})
salva('lwpoly_specchiata_bulge', d, {'tratti': 1, 'curve': [curva(ps)], 'archiSpezzati': 1},
      'arco dentro una polilinea specchiata: si rende l arco nel sistema dell oggetto e POI si specchia')

# 24. Cerchio grande (raggio 100 m) e cerchio piccolissimo (1 cm): la freccia decide i lati, non un passo fisso
d = ezdxf.new('R2010'); m = d.modelspace()
cg = m.add_circle((0, 0), 100); cp = m.add_circle((300, 0), 0.01)
salva('cerchi_grande_e_piccolo', d, {'tratti': 2, 'curve': [curva(cg), curva(cp)], 'archiSpezzati': 2},
      'raggio 100 m e raggio 1 cm: la spezzata non si scosta dalla curva piu di 2 cm nel primo, e il secondo non diventa un triangolo')

# 25. ARC che attraversa lo zero (da 300 a 60 gradi) e polilinea con DUE archi di segno opposto (una S)
d = ezdxf.new('R2010'); m = d.modelspace()
az = m.add_arc((0, 0), 4, 300, 60)
pS = m.add_lwpolyline([(20, 0, 0.6), (26, 0, -0.6), (32, 0, 0)], format='xyb')
salva('arco_attraverso_zero_e_esse', d, {'tratti': 2, 'curve': [curva(az), curva(pS)], 'archiSpezzati': 3},
      'un ARC da 300 a 60 gradi e lungo 120 gradi, non -240; e due archi di segno opposto di fila fanno una S')

# un campione per riga: le curve di riferimento sono centinaia di punti, e con un rientro per
# numero il file peserebbe tre volte tanto senza essere piu leggibile
with open(os.path.join(OUT, 'verita.json'), 'w', encoding='utf-8') as f:
    righe = [' ' + json.dumps(k, ensure_ascii=False) + ': ' + json.dumps(v, ensure_ascii=False, separators=(',', ':')) for k, v in verita.items()]
    f.write('{\n' + ',\n'.join(righe) + '\n}\n')
print(len(verita), 'file scritti in', OUT)
