# IL PIANO D'INNESCO XML DI GENESI LETTO DA UN ALTRO PARSER — come nasce letto-da-python.json.
#
#   node scrivi.mjs                 (i .xml, col codice di prodotto)
#   python3 -I leggi.py .           (dentro questa cartella; solo libreria standard)
#
# I piani li scrive Genesi; li LEGGE il parser XML della libreria standard di Python (expat, un
# parser severo: su un file non ben formato si ferma e dice dove). Qui scrive che cosa ci ha
# trovato: se il file e' ben formato, quale codifica DICHIARA e se i byte la rispettano, i
# commenti, l'elemento radice col suo spazio dei nomi, e ogni elemento con attributi e testo.
# Il risultato e' committato: la suite node non ha bisogno di Python, e pretende che i .xml di
# questa cartella siano ANCORA quelli che Genesi scrive.
import sys, os, glob, json, platform
import xml.parsers.expat as expat
import xml.etree.ElementTree as ET

D = sys.argv[1]
def nodo(e):
    return {'tag': e.tag, 'attr': dict(e.attrib), 'testo': e.text if (e.text is not None and e.text.strip() != '') else None, 'figli': [nodo(c) for c in e]}
out = {'_parser': 'Python ' + platform.python_version() + ' · expat ' + expat.EXPAT_VERSION}
for p in sorted(glob.glob(os.path.join(D, '*.xml'))):
    nome = os.path.basename(p)[:-4]; raw = open(p, 'rb').read(); r = {}
    try: raw.decode('utf-8'); r['byte_utf8'] = True
    except Exception: r['byte_utf8'] = False
    dich = {}; commenti = []
    px = expat.ParserCreate()
    px.XmlDeclHandler = lambda version, encoding, standalone: dich.update(versione=version, codifica=encoding)
    px.CommentHandler = lambda testo: commenti.append(testo.strip())
    try:
        px.Parse(raw, True); r['ben_formato'] = True
    except expat.ExpatError as e:
        r['ben_formato'] = False; r['errore'] = str(e)
    r['dichiarazione'] = dich; r['commenti'] = commenti
    if r['ben_formato']:
        r['radice'] = nodo(ET.fromstring(raw))
    out[nome] = r
json.dump(out, open(os.path.join(D, 'letto-da-python.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1, sort_keys=True)
print(len(out) - 1, 'piani letti da', out['_parser'], '·', sum(1 for k, v in out.items() if k != '_parser' and not v['ben_formato']), 'non ben formati')
