# Campioni PLY per il lettore di nuvole di Genesi, scritti da un ALTRO programma.
# ────────────────────────────────────────────────────────
# Uso:  python3 genera.py <cartella di uscita>      (servono: pip install plyfile==1.1 numpy)
#
# Perche' esistono. Il lettore PLY (`parsePLY` in apps/genesi/pointcloud.js) era provato solo
# con buffer costruiti a mano da chi ha scritto il lettore. Questi file li scrive `plyfile`
# (la libreria Python di riferimento per il formato), nelle forme che i programmi producono
# davvero: testo e binario nei due ordini di byte, coordinate a 32 e a 64 bit, colori a 8 bit,
# a 16 bit e in virgola mobile, normali e proprieta' in piu', commenti, facce dopo i vertici,
# un altro elemento PRIMA dei vertici.
# `verita.json` e' scritto da qui, RILEGGENDO i file con plyfile — non dalla suite.
# I punti sono pochi (90) di proposito: i file stanno nel repository.
import numpy as np, json, sys, os
from plyfile import PlyData, PlyElement
OUT = sys.argv[1]; ver = {}
rng = np.random.default_rng(27)

def scrivi(nome, N=90, testo=False, ordine='<', tipo_xyz='f4', colore=None, normali=False, alfa=False, facce=False,
           prima=False, commenti=False, utm=False, ordine_campi=None, tetto=None, facce_prima=False, conta='u1', nota=''):
    X = rng.random(N) * 120; Y = rng.random(N) * 80; Z = 300 + rng.random(N) * 25
    if utm: X = X + 500000; Y = Y + 4500000
    campi = [('x', tipo_xyz), ('y', tipo_xyz), ('z', tipo_xyz)]
    if normali: campi += [('nx', 'f4'), ('ny', 'f4'), ('nz', 'f4')]
    if colore: campi += [('red', colore), ('green', colore), ('blue', colore)]
    if alfa: campi += [('alpha', colore)]
    if ordine_campi: campi = sorted(campi, key=lambda c: ordine_campi.index(c[0]))
    v = np.zeros(N, dtype=campi)
    v['x'] = X; v['y'] = Y; v['z'] = Z
    if normali: v['nx'] = rng.random(N); v['ny'] = rng.random(N); v['nz'] = rng.random(N)
    if colore:
        mass = tetto if tetto else (255 if colore == 'u1' else (65535 if colore == 'u2' else 1.0))
        for c in ('red', 'green', 'blue'): v[c] = (rng.random(N) * mass) if colore.startswith('f') else (rng.random(N) * mass).astype(colore)
        if alfa: v['alpha'] = mass
    elementi = []
    if prima:
        cam = np.zeros(2, dtype=[('view_px', 'f4'), ('view_py', 'f4'), ('scan', 'i4')]); cam['view_px'] = [1.5, 2.5]; cam['scan'] = [7, 9]
        elementi.append(PlyElement.describe(cam, 'camera'))
    def le_facce():
        # liste di lunghezza DIVERSA (triangoli e quadrilateri): un elemento a lunghezza variabile
        f = np.empty(N // 3, dtype=[('vertex_indices', 'O')])
        f['vertex_indices'] = [list(range(k, k + (3 if k % 2 else 4))) for k in range(N // 3)]
        return PlyElement.describe(f, 'face', val_types={'vertex_indices': 'i4'}, len_types={'vertex_indices': conta})
    if facce_prima: elementi.append(le_facce())
    elementi.append(PlyElement.describe(v, 'vertex'))
    if facce:
        f = np.zeros(N // 3, dtype=[('vertex_indices', 'i4', (3,))])
        f['vertex_indices'] = np.arange(N // 3 * 3).reshape(-1, 3)
        elementi.append(PlyElement.describe(f, 'face'))
    ply = PlyData(elementi, text=testo, byte_order=ordine)
    if commenti: ply.comments = ['scritto da plyfile per la suite di Genesi', 'seconda riga di commento con la parola element vertex 5']; ply.obj_info = ['num_cols 9', 'num_rows 10']
    p = os.path.join(OUT, nome + '.ply'); ply.write(p)
    r = PlyData.read(p)['vertex']
    idx = sorted(set([0, N // 3, N - 1]))
    ver[nome] = {'n': N, 'idx': idx, 'formato': 'ascii' if testo else ('binary_little_endian' if ordine == '<' else 'binary_big_endian'),
                 'xyz': [[float(r['x'][i]), float(r['y'][i]), float(r['z'][i])] for i in idx],
                 'colore': colore, 'tetto': (float(mass) if colore else None), 'rgb': [[float(r['red'][i]), float(r['green'][i]), float(r['blue'][i])] for i in idx] if colore else None,
                 'nota': nota}

scrivi('testo_xyz', testo=True, nota='testo, solo coordinate')
scrivi('testo_xyz_rgb', testo=True, colore='u1', nota='testo, colori a 8 bit')
scrivi('testo_con_facce', testo=True, colore='u1', facce=True, nota='testo, una maglia: i vertici sono la nuvola, le facce vengono dopo')
scrivi('bin_le_xyz', nota='binario little endian, solo coordinate')
scrivi('bin_le_xyz_rgb', colore='u1', nota='binario little endian, colori a 8 bit — la forma di CloudCompare e Open3D')
scrivi('bin_be_xyz_rgb', ordine='>', colore='u1', nota='binario BIG endian')
scrivi('bin_le_double_utm', tipo_xyz='f8', utm=True, colore='u1', nota='coordinate a 64 bit in UTM (milioni): la forma di una nuvola georeferenziata')
scrivi('bin_le_normali_rgba', colore='u1', normali=True, alfa=True, nota='normali e trasparenza oltre a coordinate e colore — la forma di MeshLab')
scrivi('bin_le_con_facce', colore='u1', facce=True, nota='binario con le facce dopo i vertici: una maglia di fotogrammetria')
scrivi('bin_le_altro_elemento_prima', colore='u1', prima=True, nota='un altro elemento PRIMA dei vertici: i byte dei vertici non partono subito dopo l intestazione')
scrivi('bin_le_commenti', colore='u1', commenti=True, nota='commenti e obj_info nell intestazione, uno contiene le parole element vertex')
scrivi('bin_le_colore_16bit', colore='u2', nota='colori a 16 bit')
scrivi('bin_le_colore_float', colore='f4', nota='colori in virgola mobile fra 0 e 1')
scrivi('bin_le_campi_in_altro_ordine', colore='u1', ordine_campi=['red', 'green', 'blue', 'z', 'y', 'x'], nota='le proprieta in un ordine diverso: colore prima, poi z y x')
scrivi('bin_le_un_punto', N=1, colore='u1', nota='un punto solo')
scrivi('testo_altro_elemento_prima', testo=True, colore='u1', prima=True, nota='testo, con un altro elemento PRIMA dei vertici: le sue righe non sono punti')
scrivi('bin_le_facce_prima', colore='u1', facce_prima=True, nota='le facce scritte PRIMA dei vertici, triangoli e quadrilateri mescolati: un elemento a lunghezza variabile da saltare')
scrivi('bin_be_facce_prima', ordine='>', colore='u1', facce_prima=True, conta='i4', nota='lo stesso, big endian, e con la lunghezza di ogni lista scritta su 4 byte: per saltarla va letta nel verso giusto')
scrivi('testo_facce_prima', testo=True, colore='u1', facce_prima=True, nota='lo stesso, in testo')
scrivi('testo_colore_int', testo=True, colore='i4', tetto=255, nota='colori scritti come interi a 32 bit fra 0 e 255 (succede con gli script)')
scrivi('bin_le_colore_float_255', colore='f4', tetto=255, nota='colori in virgola mobile ma fra 0 e 255')
json.dump(ver, open(os.path.join(OUT, 'verita.json'), 'w'), indent=1, ensure_ascii=False)
print(len(ver), 'PLY scritti da plyfile')
