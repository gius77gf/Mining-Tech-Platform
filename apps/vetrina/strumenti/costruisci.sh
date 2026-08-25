#!/bin/sh
# ⛔ LA CATENA DI COSTRUZIONE, IN UN COMANDO SOLO.
#    Prima erano quattro passi da ricordare a mente, e una lista tenuta a mente
#    si accorcia da sola: la prima volta che ne saltavo uno, la pagina del sito
#    restava indietro rispetto ai sorgenti senza che niente lo dicesse.
set -e
Q="$(cd "$(dirname "$0")/.." && pwd)"     # apps/vetrina — i sorgenti
U="$(cd "$Q/.." && pwd)"                 # apps — dove esce la pagina
TMP="${TMPDIR:-/tmp}/vetrina-costruzione.html"
python3 "$Q/sito.py" "$TMP" >/dev/null
rm -rf "$U/img"
python3 "$Q/strumenti/scorpora.py" "$TMP" "$TMP.corpo" "$U/img"
python3 - "$TMP.corpo" "$U/index.html" <<'PY'
import io, re, sys
corpo = io.open(sys.argv[1], encoding="utf-8").read()
DOC = """<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#08090c">
<meta name="description" content="Deepwork: nove app per il cantiere e un accesso solo. Progetto, terreno, giornata, mezzi, sicurezza, conti, ambiente — e quello che scrive una, le altre lo trovano gia' scritto.">
<meta property="og:title" content="Deepwork — L'ecosistema del cantiere">
<meta property="og:description" content="Nove app per il cantiere e un accesso solo. Provale con dati di esempio, senza registrarti.">
<meta property="og:type" content="website">
<link rel="icon" href="img/marchio.svg" type="image/svg+xml">
%s
</head>
<body>
%s
</body>
</html>
"""
testa = []
corpo2 = re.sub(r'<title>[\s\S]*?</title>|<link rel="stylesheet"[^>]*>|<style>[\s\S]*?</style>',
                lambda m: (testa.append(m.group(0)), "")[1], corpo, count=3)
assert len(testa) == 3, "testa incompleta: %d pezzi invece di 3" % len(testa)
io.open(sys.argv[2], "w", encoding="utf-8").write(DOC % ("\n".join(testa), corpo2.strip()))
PY
python3 - "$Q" "$U" <<'PY'
import io, sys
sys.path.insert(0, sys.argv[1])
import contenuto as C
io.open(sys.argv[2] + "/img/marchio.svg", "w", encoding="utf-8").write(
    C.marchio(120).replace('class="marchio" ', '').replace(' aria-hidden="true"', ''))
PY
node "$Q/strumenti/marchio-intatto.mjs" "$U/index.html" | tail -1
node "$Q/strumenti/tour-vivo.mjs"      "$U/index.html" | tail -1
echo "pagina del sito: $U/index.html — $(wc -c < "$U/index.html") byte  ·  immagini: $(ls "$U/img" | wc -l) file, $(du -sh "$U/img" | cut -f1)"
