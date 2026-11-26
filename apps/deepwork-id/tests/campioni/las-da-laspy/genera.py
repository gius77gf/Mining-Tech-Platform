# Campioni LAS e LAZ per il lettore di nuvole di Genesi, scritti da un ALTRO programma.
# ─────────────────────────────────────────────────────────────────────────────────────
# Uso:  python3 genera.py <cartella di uscita>      (servono: pip install laspy lazrs numpy)
#
# Perché esistono. Il lettore LAS (`parseLAS` in apps/genesi/pointcloud.js) era provato solo
# con buffer costruiti a mano da chi ha scritto il lettore: se le due metà sbagliano insieme
# la prova resta verde. Questi file li scrive `laspy` (la libreria di riferimento per il
# formato) e, per i `.laz`, il compressore `lazrs`. Ogni coppia ha gli STESSI punti: il `.las`
# si deve leggere giusto, il `.laz` si deve riconoscere come compresso e NON leggere come
# punti (oggi Genesi il LAZ non lo decomprime: lo dichiara).
# `verita.json` è scritto da qui, rileggendo i file con laspy — non dalla suite.
# I punti sono pochi (120) di proposito: i file stanno nel repository.
import laspy, numpy as np, json, sys, os
OUT = sys.argv[1]; ver = {}
rng = np.random.default_rng(26)
def scrivi(nome, v, f, N, extra=False):
    X = 500000 + rng.random(N) * 120; Y = 4500000 + rng.random(N) * 80; Z = 300 + rng.random(N) * 25
    h = laspy.LasHeader(point_format=f, version=v); h.offsets = [500000, 4500000, 300]; h.scales = [0.001, 0.001, 0.001]
    if extra:
        h.add_extra_dim(laspy.ExtraBytesParams(name='intensita2', type=np.float32))
        h.vlrs.append(laspy.VLR(user_id='prova', record_id=1, description='vlr di prova', record_data=b'x' * 77))
    las = laspy.LasData(h); las.x = X; las.y = Y; las.z = Z
    las.intensity = (rng.random(N) * 65535).astype(np.uint16)
    col = 'red' in las.point_format.dimension_names
    if col:
        las.red = (rng.random(N) * 65535).astype(np.uint16); las.green = (rng.random(N) * 65535).astype(np.uint16); las.blue = (rng.random(N) * 65535).astype(np.uint16)
    if 'gps_time' in las.point_format.dimension_names: las.gps_time = np.sort(rng.random(N) * 1000)
    las.write(os.path.join(OUT, nome + '.las'))
    las.write(os.path.join(OUT, nome + '.laz'))
    r = laspy.read(os.path.join(OUT, nome + '.las'))
    idx = sorted(set([0, N // 3, N - 1]))
    ver[nome] = {'versione': v, 'formato': f, 'n': N, 'idx': idx,
                 'xyz': [[float(r.x[i]), float(r.y[i]), float(r.z[i])] for i in idx],
                 'rgb': [[int(r.red[i]), int(r.green[i]), int(r.blue[i])] for i in idx] if col else None}
scrivi('v12_pf0', '1.2', 0, 120)
scrivi('v12_pf2', '1.2', 2, 120)
scrivi('v12_pf3_vlr_extra', '1.2', 3, 120, extra=True)
scrivi('v13_pf1', '1.3', 1, 120)
scrivi('v14_pf3', '1.4', 3, 120)
scrivi('v14_pf6', '1.4', 6, 120)
scrivi('v14_pf7', '1.4', 7, 120)
scrivi('v14_pf8', '1.4', 8, 120)
scrivi('v12_pf0_un_punto', '1.2', 0, 1)
json.dump(ver, open(os.path.join(OUT, 'verita.json'), 'w'), indent=1)
print(len(ver), 'coppie LAS/LAZ scritte')
