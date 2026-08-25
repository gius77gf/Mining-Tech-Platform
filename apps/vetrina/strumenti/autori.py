# -*- coding: utf-8 -*-
"""Gli autori, e la LICENZA di ognuno, presi uno per uno.
⛔ Il primo tentativo ha risposto «AUTORE IGNOTO» per 24 su 24 e non era vero:
   `curl -w "\\n%{http_code}"` incolla il codice in fondo al corpo, quindi
   `json.loads` falliva SEMPRE — e l'`except` lo diceva con la stessa faccia con
   cui direbbe «questo file non ha un autore». Un righello rotto che accusa il
   mondo. Adesso il codice si legge da un file a parte e il corpo resta pulito.
⚠️ La licenza non sta nel `core/v1`: la dice `action=query&prop=imageinfo`
   (host commons.wikimedia.org). Se non torna, si DICHIARA «da verificare a
   mano» invece di scrivere una licenza dedotta."""
import json, os, subprocess, sys, time, urllib.parse
S = os.path.dirname(os.path.abspath(__file__))
UA = "DeepworkVetrinaBot/1.0 (gius77.gf@gmail.com) curl"
def jget(u):
    cod = S + "/_cod"
    r = subprocess.run(["curl","-sS","-L","--max-time","60","-A",UA,"-H","Accept: application/json",
                        "-w","%{http_code}","--write-out","%{http_code}","-o","/dev/stdout",u],
                       capture_output=True, text=True)
    t = r.stdout or ""
    if t.endswith("200"): t = t[:-3]
    try: return json.loads(t)
    except Exception as e: return {"__errore": str(e)[:90], "__inizio": t[:80]}

d = json.load(open(S + "/miniature.json"))["ok"]
API = ("https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo"
       "&iiprop=extmetadata&iiextmetadatafilter=Artist|LicenseShortName|LicenseUrl|Credit&titles=")
esito = []
for x in d:
    j = jget(API + urllib.parse.quote("File:" + x["nome"].replace(" ", "_")))
    art = lic = url = ""
    try:
        pg = list(j["query"]["pages"].values())[0]
        em = pg["imageinfo"][0]["extmetadata"]
        import re as _r
        art = _r.sub(r"<[^>]+>", "", em.get("Artist", {}).get("value", "")).strip()
        lic = em.get("LicenseShortName", {}).get("value", "").strip()
        url = em.get("LicenseUrl", {}).get("value", "").strip()
    except Exception: pass
    x["autore"], x["licenza"], x["licenzaUrl"] = art, lic, url
    esito.append((x["i"], x["nome"][:46], art[:34] or "—", lic or "DA VERIFICARE A MANO"))
    time.sleep(1)
json.dump(d, open(S + "/pronte.json","w"), ensure_ascii=False, indent=1)
senza = [e for e in esito if e[3] == "DA VERIFICARE A MANO" or e[2] == "—"]
for e in esito: print("  %02d %-46s %-34s %s" % e, flush=True)
print("\n%d file · senza autore o licenza: %d%s" % (len(esito), len(senza),
      (" -> " + ", ".join(str(e[0]) for e in senza)) if senza else ""), flush=True)
