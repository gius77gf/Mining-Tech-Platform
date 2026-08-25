# -*- coding: utf-8 -*-
"""Tira fuori le immagini dalla pagina e le mette in file veri.

⛔ PERCHE' SERVE. La pagina nasce con TUTTE le immagini incollate dentro come
   `data:` — 10,6 MB in un file solo. Per un ARTEFATTO e' giusto: la politica
   di sicurezza di claude.ai blocca qualunque richiesta esterna, quindi o sta
   dentro o non c'e'. Per un SITO VERO e' il contrario, e per tre ragioni
   misurabili:
     · il browser non puo' mettere in cache le immagini separatamente, quindi
       ogni visita riscarica dieci megabyte anche se non e' cambiato niente;
     · niente `loading="lazy"` che funzioni davvero: il `data:` e' gia' nel
       documento, quindi si paga tutto prima del primo pixel;
     · base64 gonfia i byte del 33%.

⚠️ NON si rigenera la pagina in due modi diversi: si genera UNA volta con le
   immagini dentro (l'unica forma che l'artefatto accetta) e poi si scorpora.
   Cosi' le due versioni non possono divergere — se fossero due percorsi di
   codice, il giorno che uno cambia l'altro resta indietro in silenzio.

Uso:  python3 scorpora.py <pagina-con-tutto-dentro.html> <pagina-uscita.html> <cartella-immagini>
"""
import base64, hashlib, io, os, re, sys

DENTRO, FUORI, CARTELLA = sys.argv[1], sys.argv[2], sys.argv[3]
NOME_CARTELLA = os.path.basename(CARTELLA.rstrip("/"))

s = io.open(DENTRO, encoding="utf-8").read()
os.makedirs(CARTELLA, exist_ok=True)

TIPI = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}
visti, scritti, byte_prima, byte_dopo = {}, 0, 0, 0


def fuori(m):
    """Una `data:` diventa un file. Il nome e' l'IMPRONTA del contenuto: la
    stessa immagine usata in tre finestre diventa UN file solo, e il browser la
    scarica una volta. Con un contatore progressivo sarebbero state tre."""
    global scritti, byte_prima, byte_dopo
    tipo, dati = m.group(1), m.group(2)
    if tipo not in TIPI:
        return m.group(0)                      # non la tocco: meglio dentro che rotta
    grezzo = base64.b64decode(dati)
    byte_prima += len(m.group(0))
    imp = hashlib.sha1(grezzo).hexdigest()[:16]
    nome = visti.get(imp)
    if nome is None:
        nome = imp + TIPI[tipo]
        with open(os.path.join(CARTELLA, nome), "wb") as f:
            f.write(grezzo)
        visti[imp] = nome
        scritti += 1
        byte_dopo += len(grezzo)
    return "%s/%s" % (NOME_CARTELLA, nome)


nuovo = re.sub(r"data:(image/[a-z+]+);base64,([A-Za-z0-9+/=]+)", fuori, s)
io.open(FUORI, "w", encoding="utf-8").write(nuovo)

# ⛔ SI CONTA QUELLO CHE E' STATO TOCCATO DAVVERO. Una sostituzione che non
#    trova niente non fallisce: scrive una copia identica e sembra riuscita.
rimaste = len(re.findall(r"data:image/", nuovo))
print("immagini scorporate: %d riferimenti -> %d file distinti (%d doppioni tolti)"
      % (len(re.findall(r"data:image/", s)), scritti, len(re.findall(r"data:image/", s)) - scritti))
print("pagina: %.2f MB -> %.2f MB   ·   immagini su disco: %.2f MB"
      % (len(s) / 1048576, len(nuovo) / 1048576, byte_dopo / 1048576))
print("`data:` rimaste dentro la pagina: %d" % rimaste)
if scritti == 0:
    print("⛔ ZERO file scritti: la sostituzione non ha agganciato niente.")
    sys.exit(1)
