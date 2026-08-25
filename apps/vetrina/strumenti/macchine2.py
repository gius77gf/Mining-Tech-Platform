# -*- coding: utf-8 -*-
"""PERSONE e MACCHINE al lavoro per gli sfondi della vetrina.
Due fasi separate, e la prima SCRIVE SU DISCO man mano: la volta scorsa il
processo e' stato ucciso dopo otto ricerche su dieci e le ha buttate tutte.
Ogni categoria non guardata resta DICHIARATA in `mancati`."""
import json, os, re, subprocess, sys, time, urllib.parse
S = os.path.dirname(os.path.abspath(__file__))
UA = "DeepworkVetrinaBot/1.0 (gius77.gf@gmail.com) curl"
CAND = S + "/cand.json"

def prendi(u, attese=(0, 25, 60, 120, 200)):
    for a in attese:
        if a: time.sleep(a)
        r = subprocess.run(["curl","-sS","-L","--max-time","55","-A",UA,"-H","Accept: application/json",u],
                           capture_output=True, text=True)
        if r.stdout.strip().startswith("{"): return json.loads(r.stdout)
    return None

Q = [
 ('escavatore',  'incategory:"Quality images" excavator working OR digging'),
 ('perforatrice','incategory:"Quality images" drilling rig OR drill jumbo OR rock drill'),
 ('camion',      'incategory:"Quality images" dump truck OR haul truck quarry OR mine'),
 ('dumper',      'incategory:"Quality images" articulated dumper OR dumper construction'),
 ('pala',        'incategory:"Quality images" wheel loader OR front loader working'),
 ('persone',     'incategory:"Quality images" construction workers site helmet'),
 ('operaio',     'incategory:"Quality images" worker high visibility construction'),
 ('cantiere',    'incategory:"Quality images" construction site machinery earthworks'),
 ('gru',         'incategory:"Quality images" crane construction site'),
 ('frantoio',    'incategory:"Quality images" crusher OR screening plant aggregate'),
 ('scavo',       'incategory:"Quality images" earthmoving OR excavation trench road'),
 ('strada',      'incategory:"Quality images" road construction asphalt paving machine'),
]
stato = json.load(open(CAND)) if os.path.exists(CAND) else {"visti": {}, "fatti": [], "mancati": []}
visti = stato["visti"]
for i, (tag, q) in enumerate(Q):
    if tag in stato["fatti"]:
        print("[%s] gia' fatto" % tag, flush=True); continue
    if i: time.sleep(20)
    print("cerco [%s]" % tag, flush=True)
    d = prendi("https://api.wikimedia.org/core/v1/commons/search/page?limit=40&q=" + urllib.parse.quote(q))
    if d is None:
        if tag not in stato["mancati"]: stato["mancati"].append(tag)
        print("   NON GUARDATO", flush=True)
    else:
        n = 0
        for p in d.get("pages", []):
            th = (p.get("thumbnail") or {}).get("url") or ""
            m = re.match(r"(https://upload\.wikimedia\.org/wikipedia/commons)/thumb/(\w/\w\w)/([^/]+)/\d+px-",
                         th.split("?")[0])
            if not m or not re.search(r"\.jpe?g$", p["key"], re.I): continue
            visti.setdefault(p["key"], {"key": p["key"], "tag": tag,
                                        "orig": "%s/%s/%s" % (m.group(1), m.group(2), m.group(3))}); n += 1
        stato["fatti"].append(tag)
        print("   +%d (totale %d)" % (n, len(visti)), flush=True)
    json.dump(stato, open(CAND, "w"), ensure_ascii=False, indent=1)   # <- si scrive SUBITO

FUORI = re.compile(r'map|diagram|logo|coat|stamp|seal|chart|drawing|painting|engraving|museum|'
                   r'model|toy|miniature|lego|sign|plaque|monument|memorial|abandoned|wreck|rust', re.I)
buoni = sorted([x for x in visti.values() if not FUORI.search(x["key"])], key=lambda x: x["key"])
print("\npertinenti %d su %d · categorie NON guardate: %s"
      % (len(buoni), len(visti), stato["mancati"] or "nessuna"), flush=True)
os.makedirs(S + "/m", exist_ok=True)
ok, ko = [], []
for i, x in enumerate(buoni):
    f = "%s/m/%03d.jpg" % (S, i)
    if not (os.path.exists(f) and os.path.getsize(f) > 30000):
        for att in (0, 10, 35, 90):
            if att: time.sleep(att)
            subprocess.run(["curl","-sS","-L","--max-time","110","--max-filesize","45000000","-A",UA,
                            x["orig"],"-o",f], capture_output=True)
            if os.path.exists(f) and os.path.getsize(f) > 30000 and open(f,"rb").read(2)==b"\xff\xd8": break
            if os.path.exists(f): os.remove(f)
    (ok if os.path.exists(f) else ko).append(dict(x, i=i, f=os.path.basename(f)))
    if i % 10 == 9:
        print("  %d/%d prese %d mancate %d" % (i+1, len(buoni), len(ok), len(ko)), flush=True)
        json.dump({"ok": ok, "ko": [y["key"] for y in ko], "mancati": stato["mancati"]},
                  open(S + "/macchine.json", "w"), ensure_ascii=False, indent=1)
    time.sleep(2)
print("PRESE %d · MANCATE %d · categorie non guardate %s"
      % (len(ok), len(ko), stato["mancati"] or "nessuna"), flush=True)
json.dump({"ok": ok, "ko": [x["key"] for x in ko], "mancati": stato["mancati"]},
          open(S + "/macchine.json", "w"), ensure_ascii=False, indent=1)
celle = "".join('<div style="position:relative"><img src="m/%s" loading="lazy" style="width:100%%;height:180px;object-fit:cover;display:block">'
  '<span style="position:absolute;left:3px;top:3px;background:#000;color:#ffab00;font:700 12px monospace;padding:1px 5px">%d</span>'
  '<div style="font:10px sans-serif;color:#333;height:24px;overflow:hidden">[%s] %s</div></div>'
  % (x["f"], x["i"], x["tag"], x["key"][5:48]) for x in ok)
open(S + "/provini-m.html","w").write('<!doctype html><meta charset="utf-8"><body style="margin:0;padding:8px;background:#fff">'
  '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px">' + celle + '</div>')
print("FATTO", flush=True)
