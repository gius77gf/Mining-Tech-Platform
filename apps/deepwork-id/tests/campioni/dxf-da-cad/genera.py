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
from ezdxf.disassemble import recursive_decompose

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
    if t == 'ELLIPSE': return [_ellisse(entita)]
    out = []
    for v in entita.virtual_entities():                # LWPOLYLINE / POLYLINE: i suoi lati, dritti o ad arco
        if v.dxftype() == 'ARC': out.append(_arco(v))
        elif v.dxftype() == 'LINE': out.append({'t': 'linea', 'a': _p(v.dxf.start), 'b': _p(v.dxf.end)})
    return out

# il disegno COME LO VEDE UN CAD, blocchi inseriti compresi: ezdxf espande ogni INSERT (anche annidato,
# anche a schiera) e rende le entita gia nel mondo. Un arco dentro un blocco scalato in modo diverso sui
# due assi diventa un tratto d ELLISSE: la primitiva 'ellisse' lo dice esatto (centro, i due semiassi come
# vettori, i due parametri — antiorario da t0 a t1), e la formula e controllata contro i punti di ezdxf.
def _ellisse(e):
    c = Vec3(e.dxf.center); M = Vec3(e.dxf.major_axis); m = Vec3(e.minor_axis)
    t0 = e.dxf.start_param; t1 = e.dxf.end_param
    if t1 <= t0: t1 += math.tau
    for t in (t0, (t0 + t1) / 2, t1):
        v = list(e.vertices([t]))[0]; w = c + M * math.cos(t) + m * math.sin(t)
        assert (Vec3(v) - w).magnitude < 1e-9, 'la formula dell ellisse non e quella di ezdxf'
    return {'t': 'ellisse', 'c': _p(c), 'M': _p(M), 'm': _p(m), 't0': t0, 't1': t1}
def espanso(spazio):
    prim = []; fuori = {}
    for e in recursive_decompose(spazio):
        t = e.dxftype()
        if t == 'LINE': prim.append({'t': 'linea', 'a': _p(e.dxf.start), 'b': _p(e.dxf.end)})
        elif t == 'ELLIPSE': prim.append(_ellisse(e))
        elif t in ('ARC', 'CIRCLE', 'LWPOLYLINE', 'POLYLINE'): prim += curva(e)
        else: fuori[t] = fuori.get(t, 0) + 1
    return prim, fuori

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
salva('blocco_inserito', d, {'tratti': 2, 'polilinee': [[[50, 50], [51, 51]], [[51, 50], [50, 51]]], 'blocchiEspansi': 1},
      'le due linee del blocco stanno DOVE e inserito, a (50,50) — non attorno a (0,0), dove sono definite')

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
salva('blocco_con_attributi', d, {'tratti': 2, 'polilinee': [[[30, 30], [31, 30]], [[0, 0], [10, 0]]], 'nonLette': {'ATTRIB': 1}, 'blocchiEspansi': 1},
      'la linea del blocco entra a (30,30); la quota scritta accanto (ATTRIB) e un testo e si conta fra i non entrati; la linea DOPO si legge')

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

# ── I BLOCCHI INSERITI (26/11): il contenuto entra dove il CAD lo disegna ───────────────
# un blocco volutamente STORTO (niente simmetrie: una rotazione o uno specchio sbagliati si vedono)
def pezzo(doc, nome, base=(0, 0)):
    b = doc.blocks.new(nome, base_point=base)
    b.add_line((0, 0), (4, 1))
    b.add_arc((2, 1), 1.5, 20, 140)
    b.add_circle((5, 3), 0.5)
    b.add_lwpolyline([(0, 3, 0.4), (2, 4, 0), (3, 6, -0.7), (5, 6, 0)], format='xyb')
    return b
def blocchi(nome, d, tratti, archi, espansi, nota, attese_fuori=None):
    prim, fuori = espanso(d.modelspace())
    assert fuori == (attese_fuori or {}), (nome, fuori)
    att = {'tratti': tratti, 'insieme': prim, 'archiSpezzati': archi, 'blocchiEspansi': espansi}
    if fuori: att['nonLette'] = fuori
    salva(nome, d, att, nota)

# 26. spostato, ruotato e ingrandito, con un punto base che non e l origine
d = ezdxf.new('R2010'); m = d.modelspace(); pezzo(d, 'PEZZO', base=(1, 2))
m.add_blockref('PEZZO', (100, 50), dxfattribs={'xscale': 2, 'yscale': 2, 'rotation': 30})
blocchi('blocco_ruotato_scalato', d, 4, 4, 1, 'inserito a (100,50), ruotato di 30 gradi, scala 2, punto base (1,2): linea, arco, cerchio e polilinea con due archi')

# 27. specchiato (scala X negativa): gli archi girano dall altra parte
d = ezdxf.new('R2010'); m = d.modelspace(); pezzo(d, 'PEZZO')
m.add_blockref('PEZZO', (-20, 40), dxfattribs={'xscale': -1, 'yscale': 1, 'rotation': 15})
blocchi('blocco_specchiato', d, 4, 4, 1, 'scala X = -1: il blocco e allo specchio, e un arco specchiato non e lo stesso arco ruotato')

# 28. scala diversa sui due assi: archi e cerchi diventano tratti d ellisse
d = ezdxf.new('R2010'); m = d.modelspace(); pezzo(d, 'PEZZO')
m.add_blockref('PEZZO', (10, 10), dxfattribs={'xscale': 3, 'yscale': 0.5, 'rotation': 20})
blocchi('blocco_scala_diversa', d, 4, 4, 1, 'scala 3 in X e 0,5 in Y: il cerchio e un ellisse, e la spezzata deve stare sull ellisse vera')

# 29. un blocco dentro un blocco, due volte, e il blocco esterno inserito due volte
d = ezdxf.new('R2010'); m = d.modelspace(); pezzo(d, 'DENTRO')
f = d.blocks.new('FUORI')
f.add_blockref('DENTRO', (10, 0), dxfattribs={'xscale': 0.5, 'yscale': 0.5, 'rotation': 90})
f.add_line((0, 0), (10, 0))
f.add_blockref('DENTRO', (0, 5), dxfattribs={'xscale': -1})
m.add_blockref('FUORI', (200, 100), dxfattribs={'xscale': 2, 'yscale': 2, 'rotation': 45})
m.add_blockref('FUORI', (0, 0))
blocchi('blocco_annidato', d, 18, 16, 2, 'FUORI contiene due DENTRO (uno ruotato e rimpicciolito, uno specchiato) e una linea; FUORI e inserito due volte: le trasformazioni si compongono')

# 30. schiera: lo stesso INSERT ripetuto 3 colonne x 2 righe, ruotato
d = ezdxf.new('R2010'); m = d.modelspace()
b = d.blocks.new('PALO'); b.add_circle((0, 0), 0.2); b.add_line((0, 0), (0.5, 0.1))
m.add_blockref('PALO', (30, 10), dxfattribs={'xscale': 1.5, 'yscale': 1.5, 'rotation': 30,
               'column_count': 3, 'row_count': 2, 'column_spacing': 4, 'row_spacing': 3})
blocchi('blocco_schiera', d, 12, 6, 1, 'un INSERT a schiera 3 x 2 (passo 4 e 3, ruotato di 30 gradi): sei copie, il passo ruota col blocco e non si scala')

# 31. INSERT specchiato con l estrusione (0,0,-1), come lo scrive lo «specchia» di un CAD
d = ezdxf.new('R2010'); m = d.modelspace(); pezzo(d, 'PEZZO')
m.add_blockref('PEZZO', (10, 20), dxfattribs={'rotation': 25, 'extrusion': (0, 0, -1)})
blocchi('blocco_estrusione_specchiata', d, 4, 4, 1, 'estrusione (0,0,-1) sull INSERT: punto di inserimento e rotazione sono nel sistema dell oggetto')

# 32. riferimento esterno: il contenuto sta in un ALTRO file
d = ezdxf.new('R2010'); m = d.modelspace()
d.add_xref_def('planimetria_altro_studio.dxf', 'ALTRO')
m.add_blockref('ALTRO', (0, 0)); m.add_line((0, 0), (10, 0))
salva('blocco_riferimento_esterno', d, {'tratti': 1, 'polilinee': [[[0, 0], [10, 0]]], 'nonLette': {'INSERT (riferimento esterno)': 1}},
      'un xref non ha contenuto in questo file: si dichiara come riferimento a un altro file, non come blocco vuoto espanso')

# 33. blocco con un testo dentro, inserito tre volte: le linee entrano, i testi si contano tre volte
d = ezdxf.new('R2010'); m = d.modelspace()
b = d.blocks.new('ETICHETTA'); b.add_line((0, 0), (2, 0)); b.add_text('P', dxfattribs={'insert': (0, 0.5)})
for k in range(3): m.add_blockref('ETICHETTA', (10 * k, 5))
blocchi('blocco_con_testo', d, 3, 0, 3, 'cio che dentro un blocco non si legge si conta una volta per ogni inserimento', {'TEXT': 3})

# 34. blocco inserito e ruotato nel formato vecchio (R12)
d = ezdxf.new('R12'); m = d.modelspace()
b = d.blocks.new('CROCE'); b.add_line((0, 0), (1, 1)); b.add_line((1, 0), (0, 1))
m.add_blockref('CROCE', (50, 50), dxfattribs={'rotation': 90})
salva('blocco_inserito_R12', d, {'tratti': 2, 'polilinee': [[[50, 50], [49, 51]], [[50, 51], [49, 50]]], 'blocchiEspansi': 1},
      'R12 scrive BLOCK ed ENDBLK senza i contrassegni dei formati nuovi: stesso risultato')

# 35. un cerchio di raggio 1 dentro un blocco inserito a scala 50: nel mondo e un cerchio di 50 m
d = ezdxf.new('R2010'); m = d.modelspace()
b = d.blocks.new('TONDO'); b.add_circle((0, 0), 1); b.add_arc((3, 0), 1, 0, 200)
m.add_blockref('TONDO', (500, 500), dxfattribs={'xscale': 50, 'yscale': 50})
blocchi('blocco_arco_ingrandito', d, 2, 2, 1, 'la freccia di 2 cm vale NEL MONDO: i lati si contano sul cerchio di 50 m, non su quello di 1 m disegnato nel blocco')

# 36. il nome del blocco scritto in minuscolo nell INSERT e in maiuscolo nella definizione
d = ezdxf.new('R2010'); m = d.modelspace()
b = d.blocks.new('CROCE'); b.add_line((0, 0), (1, 1)); b.add_line((1, 0), (0, 1))
m.add_blockref('croce', (5, 5))
salva('blocco_nome_minuscolo', d, {'tratti': 2, 'polilinee': [[[5, 5], [6, 6]], [[6, 5], [5, 6]]], 'blocchiEspansi': 1},
      'i nomi dei blocchi non distinguono maiuscole e minuscole')

# ── LE ELLISSI (26/11): scritte in coordinate mondo, col verso deciso dall estrusione ──
# 37. ellisse intera, col semiasse maggiore storto rispetto agli assi
d = ezdxf.new('R2010'); m = d.modelspace()
e1 = m.add_ellipse((10, 5), major_axis=(6, 2), ratio=0.4)
salva('ellisse_intera', d, {'tratti': 1, 'curve': [curva(e1)], 'archiSpezzati': 1},
      'ellisse intera (parametri 0 e 2 pi greco): una spezzata CHIUSA che sta sull ellisse vera')

# 38. arco d ellisse, e uno che attraversa lo zero del parametro
d = ezdxf.new('R2010'); m = d.modelspace()
e2 = m.add_ellipse((0, 0), major_axis=(8, 0), ratio=0.5, start_param=0.5, end_param=4.0)
e3 = m.add_ellipse((30, 0), major_axis=(0, 5), ratio=0.6, start_param=5.5, end_param=1.0)
salva('ellisse_archi', d, {'tratti': 2, 'curve': [curva(e2), curva(e3)], 'archiSpezzati': 2},
      'da 0,5 a 4,0 radianti; e da 5,5 a 1,0, che passa per lo zero: e lungo 1,78 radianti, non -4,5')

# 39. ellisse molto schiacciata e grande (semiassi 40 m e 2 m)
d = ezdxf.new('R2010'); m = d.modelspace()
e4 = m.add_ellipse((100, 100), major_axis=(40, 0), ratio=0.05)
salva('ellisse_schiacciata', d, {'tratti': 1, 'curve': [curva(e4)], 'archiSpezzati': 1},
      'semiassi 40 m e 2 m: la freccia di 2 cm deve reggere anche dove la curva e quasi dritta e i lati sono lunghi')

# 40. arco d ellisse specchiato (estrusione 0,0,-1): gira dall altra parte
d = ezdxf.new('R2010'); m = d.modelspace()
e5 = m.add_ellipse((5, 5), major_axis=(4, 1), ratio=0.5, start_param=0.3, end_param=2.5, dxfattribs={'extrusion': (0, 0, -1)})
salva('ellisse_specchiata', d, {'tratti': 1, 'curve': [curva(e5)], 'archiSpezzati': 1},
      'un ELLIPSE e in coordinate mondo: l estrusione (0,0,-1) NON sposta il centro, cambia solo il verso in cui gira')

# 41. ellisse dentro un blocco ruotato e scalato in modo diverso sui due assi
d = ezdxf.new('R2010'); m = d.modelspace()
b = d.blocks.new('OVALE'); b.add_ellipse((1, 1), major_axis=(3, 1), ratio=0.5, start_param=0.2, end_param=5.0); b.add_line((0, 0), (1, 1))
m.add_blockref('OVALE', (50, 20), dxfattribs={'xscale': 4, 'yscale': 1.5, 'rotation': 40})
blocchi('ellisse_in_blocco', d, 2, 1, 1, 'un ellisse in un blocco stirato resta un ellisse (un altra): i punti letti devono starle sopra, con la freccia misurata nel mondo')

# un campione per riga: le curve di riferimento sono centinaia di punti, e con un rientro per
# numero il file peserebbe tre volte tanto senza essere piu leggibile
with open(os.path.join(OUT, 'verita.json'), 'w', encoding='utf-8') as f:
    righe = [' ' + json.dumps(k, ensure_ascii=False) + ': ' + json.dumps(v, ensure_ascii=False, separators=(',', ':')) for k, v in verita.items()]
    f.write('{\n' + ',\n'.join(righe) + '\n}\n')
print(len(verita), 'file scritti in', OUT)
