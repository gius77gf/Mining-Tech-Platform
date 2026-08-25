# -*- coding: utf-8 -*-
"""Scarica le MINIATURE da 1920px, non gli originali.
⛔ MISURATO, non dedotto: nello stesso istante l'originale risponde **429** e la
   miniatura **200**. Sono due secchi di limite diversi. E la miniatura pesa
   445 KB invece di 11 MB, mentre di larghezza ne serve 1920: l'originale da
   6240px non serviva a niente. Venticinque minuti del tentativo precedente
   sono andati ad aspettare un secchio pieno mentre quello accanto era vuoto.
⚠️ L'autore lo dice `api.wikimedia.org`, che NON e' limitato: serve per il
   credito, che in questa casa non e' un dettaglio."""
import json, os, re, subprocess, sys, time, urllib.parse
S = os.path.dirname(os.path.abspath(__file__))
UA = "DeepworkVetrinaBot/1.0 (gius77.gf@gmail.com) curl"
SCELTE = json.load(open(S + "/scelte-elenco.json"))
d = json.load(open(S + "/cand.json"))["visti"]
per_nome = {k[5:]: v for k, v in d.items()}

def http(u, dest=None, tipo="json"):
    c = ["curl","-sS","-L","--max-time","90","-A",UA]
    if tipo == "json": c += ["-H","Accept: application/json"]
    c += (["-o",dest,"-w","%{http_code}"] if dest else ["-w","\n%{http_code}"]) + [u]
    r = subprocess.run(c, capture_output=True, text=True)
    return (r.stdout or "").strip()

os.makedirs(S + "/s", exist_ok=True)
ok, ko, senzaAutore = [], [], []
for i, nome in enumerate(SCELTE):
    x = per_nome.get(nome)
    if not x: ko.append(nome + " (non fra i candidati)"); continue
    f = "%s/s/%02d.jpg" % (S, i)
    # la miniatura: stesso percorso, con /thumb/ e il prefisso della larghezza
    m = re.match(r"(https://upload\.wikimedia\.org/wikipedia/commons)/(\w/\w\w)/(.+)$", x["orig"])
    if not m: ko.append(nome + " (indirizzo non riconosciuto)"); continue
    thumb = "%s/thumb/%s/%s/1920px-%s" % (m.group(1), m.group(2), m.group(3), m.group(3))
    preso = False
    if os.path.exists(f) and os.path.getsize(f) > 30000: preso = True
    else:
        for tent, att in enumerate((0, 15, 60, 180)):
            if att: time.sleep(att)
            cod = http(thumb, dest=f)
            if cod == "200" and os.path.exists(f) and os.path.getsize(f) > 30000 \
               and open(f,"rb").read(2) == b"\xff\xd8": preso = True; break
            if os.path.exists(f): os.remove(f)
    # l'autore, da un host che non e' limitato
    autore = ""
    try:
        j = json.loads(http("https://api.wikimedia.org/core/v1/commons/file/File:"
                            + urllib.parse.quote(nome.replace(" ", "_"))))
        autore = ((j.get("latest") or {}).get("user") or {}).get("name") or ""
    except Exception: pass
    if not autore: senzaAutore.append(nome)
    riga = dict(x, i=i, f=os.path.basename(f), nome=nome, autore=autore,
                pagina="https://commons.wikimedia.org/wiki/File:" + urllib.parse.quote(nome.replace(" ", "_")))
    (ok if preso else ko).append(riga if preso else nome)
    print("  %02d/%d %s %-58s %s" % (i+1, len(SCELTE), "ok " if preso else "KO ",
                                     nome[:58], autore or "AUTORE IGNOTO"), flush=True)
    time.sleep(2)
print("\nPRESE %d · MANCATE %d · senza autore %d (dichiarate: %s)"
      % (len(ok), len(ko), len(senzaAutore), senzaAutore or "nessuna"), flush=True)
json.dump({"ok": ok, "ko": ko}, open(S + "/miniature.json","w"), ensure_ascii=False, indent=1)
celle = "".join('<div style="position:relative"><img src="s/%s" loading="lazy" style="width:100%%;height:210px;object-fit:cover;display:block">'
  '<span style="position:absolute;left:3px;top:3px;background:#000;color:#ffab00;font:700 13px monospace;padding:2px 6px">%02d</span>'
  '<div style="font:10px sans-serif;color:#333;height:26px;overflow:hidden">[%s] %s</div></div>'
  % (x["f"], x["i"], x["tag"], x["nome"][:52]) for x in ok)
open(S + "/provini-s.html","w").write('<!doctype html><meta charset="utf-8"><body style="margin:0;padding:8px;background:#fff">'
  '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">' + celle + '</div>')
print("FATTO", flush=True)
