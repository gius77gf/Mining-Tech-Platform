# -*- coding: utf-8 -*-
"""Il contenuto della vetrina, scritto UNA volta sola.

⛔ POSIZIONAMENTO — direttiva del fondatore (23/08): il bersaglio è TUTTO IL
SETTORE EDILE. La cava non è il soggetto: è l'ORIGINE, e compare in un punto
solo — la tesi in mezzo alla pagina, dove serve a dire «se regge lì, regge da
voi». Ogni altro posto parla di cantiere.
⚠️ Due strumenti su nove restano una SPECIALIZZAZIONE (lo scavo in roccia con
esplosivo) e vanno marcati come tale invece che nascosti: un'impresa che non
spara non li compra, e un'impresa che spara li cerca proprio per quello.
"""
import base64, os
RADICE = "/home/user/Mining-Tech-Platform"

def dati(nome):
    with open(os.path.join(RADICE, "apps/anteprime", nome), "rb") as f:
        return "data:image/jpeg;base64," + base64.b64encode(f.read()).decode("ascii")

TITOLO = "Deepwork"
BENVENUTO_A, BENVENUTO_B = "Benvenuto nell'ecosistema", "<em>Deepwork</em>"
CLAIM = "Otto app per il cantiere. Un accesso solo. E si passano il lavoro."
APRI = ("Uno per ogni pezzo del lavoro: le lavorazioni, la sicurezza, il turno, i mezzi, i conti, "
        "l'ambiente, i volumi. Si entra una volta sola, e quello che scrive uno arriva dove "
        "serve, senza ricopiarlo.")
ORIGINE = ("Nato dove le regole sono le più strette. "
           "Quello che regge un\'attività estrattiva autorizzata regge qualunque cantiere.")
# ⛔ Erano tre: «9 in tutto» e' stato tolto dal fondatore (24/08) perche' superfluo.
CIFRE = [("8", "app"), ("1", "accesso")]

# ⚠️ LA STORIA. Scritta da quello che il prodotto FA, non da fatti aziendali
#    che non posso verificare: il fondatore corregga nomi, date e numeri prima
#    di mostrarla a un cliente. Tre battute, non una pagina — una storia lunga
#    su una vetrina non la legge nessuno.
# ⛔ TESTI DEL FONDATORE (24/08), non riscritti: il perche' nasce e come lavora.
#    Il titolo e la riga sotto sono la sua frase spezzata in due; il capoverso
#    che segue e' la storia, alla lettera. I tre riquadri NON aggiungono fatti:
#    smontano quella stessa frase nei suoi tre pezzi — il settore, il campo, la
#    comunicazione — perche' e' quello che ha chiesto («lo sviluppo dei riquadri
#    successivi dovrebbe basarsi su questo principio»).
NASCE_TITOLO = "Deepwork nasce per innovare un sistema e favorire la digitalizzazione dello stesso"
NASCE_SOTTO = ("In un mondo in costante evoluzione, Deepwork offre l'opportunità di non rimanere "
               "indietro.")
STORIA_TESTO = ("Lo sviluppo dell'ecosistema trova spunto nell'idea di digitalizzare un settore "
                "fondamentale dell'economia che, però, fa fatica a digitalizzarsi. L'idea nasce "
                "dall'esperienza diretta sul campo, dove ogni singola figura svolge una funzione "
                "differente, rendendo la comunicazione fondamentale per svolgere il lavoro al meglio.")
STORIA = [
 ("Il settore",
  "Un settore che regge l'economia e fatica a digitalizzarsi.",
  "Non per arretratezza: perché il lavoro succede fuori, in movimento, con le mani sporche e il "
  "telefono in tasca. Gli strumenti pensati per una scrivania lì non entrano, e quello che non "
  "entra non viene usato."),
 ("Il campo",
  "L'idea non nasce a tavolino. Nasce dove si lavora.",
  "Da chi il turno lo ha chiuso davvero, con la carta e la penna, e poi lo ha riscritto in ufficio. "
  "È l'esperienza diretta a dire quali sono i tre dati che servono e quali sono i dodici che "
  "nessuno compilerà mai."),
 ("La comunicazione",
  "Ogni figura fa una cosa diversa. Il lavoro riesce se si parlano.",
  "Chi guida, chi tiene la sicurezza, chi fattura, chi risponde agli enti: ognuno ha bisogno di un "
  "pezzo di quello che sa un altro. Deepwork esiste per far passare quel pezzo da solo, invece di "
  "farlo ricopiare."),
]

# ⛔ L'ORDINE NON E' CASUALE (direttiva del fondatore, 24/08): DEEPWORK PER
#    PRIMO. E' il prodotto di punta; le altre otto, per quanto valide, oggi
#    servono a rinforzarlo e a completare il servizio. Chi riordina questa
#    lista sta prendendo una decisione di prodotto, non estetica.
APP = [
 ("Deepwork", "core.jpg", "#ffab00", "#ffd54f", "#8f5500", "In uso", "viva",
  "Tutto il cantiere in tasca.",
  "Lavorazioni, mezzi, deposito, personale, clienti, documenti dell\'ufficio. Quello che serve ritrovare fra sei mesi sta qui, e si cerca dal telefono invece che in un raccoglitore.",
  ["Storico delle lavorazioni e dei rapportini", "Mezzi, deposito, personale, clienti", "Documenti dell\'ufficio, pronti da mostrare"],
  "Chi tiene l\'archivio", "La base"),
 ("Campo", "campo.jpg", "#d3633a", "#f49c7d", "#953b17", "Demo interattiva", "prova",
  "La giornata si chiude in due minuti.",
  "La giornata si chiude in cantiere, non a memoria la sera. Chi c\'era, quali lavorazioni, quali mezzi, e dove si è perso tempo.",
  ["Appello e controlli di inizio giornata", "Dove si perde tempo, per causale", "Chiusura con due nomi e un\'ora"],
  "Il capocantiere", "Il cantiere"),
 ("Flotta", "flotta.jpg", "#c360a6", "#e798cd", "#883871", "Demo interattiva", "prova",
  "Il fermo macchina lo sai prima.",
  "Tagliandi, revisioni e ricambi non si scoprono il giorno che il mezzo resta fermo. Il controllo di inizio giornata diventa la lista di lavoro dell\'officina.",
  ["Giro macchina prima di partire", "Scadenze di legge col semaforo", "Quanti ricambi tenere a scorta"],
  "L\'officina", "Il cantiere"),
 ("Scudo", "scudo.jpg", "#8c75dc", "#b7a8f9", "#5e499d", "Demo interattiva", "prova",
  "Nessuna scadenza ti prende alla sprovvista.",
  "Sorveglianza sanitaria, formazione, DPI e nomine smettono di vivere su fogli sparsi. Si sa in anticipo cosa scade, e chi non può più fare quella mansione.",
  ["Chi posso mandare, mansione per mansione", "Le scadenze dei prossimi dodici mesi", "Verbale di consegna dei DPI"],
  "Chi tiene la sicurezza", "Il cantiere"),
 ("Terra", "terra.jpg", "#659b2c", "#9ac577", "#3e6901", "Demo interattiva", "prova",
  "Il terreno mosso, al metro cubo.",
  "Sterro, riporto e avanzamento smettono di essere una stima a fine mese. I rilievi — drone, GPS o stazione totale — dicono a che punto si è, lotto per lotto.",
  ["Avanzamento misurato, non stimato", "Sterro e riporto per lotto", "Volume autorizzato, dove serve"],
  "La direzione lavori", "Lo scavo"),
 ("Conti", "conti.jpg", "#009f8f", "#4dcebd", "#006a5f", "Demo interattiva", "prova",
  "Dalla pesa alla fattura senza toccare niente.",
  "Documenti di trasporto e quantità misurate diventano fatture senza ricopiare una riga. E si sa chi chiamare per primo, e da quanto aspetta quel credito.",
  ["Fattura differita dai documenti", "Chi sollecitare per primo", "Quello che si deve agli enti"],
  "L\'ufficio", "L\'azienda"),
 ("Sentinella", "sentinella.jpg", "#288ee0", "#78bcfc", "#005e9d", "Demo interattiva", "prova",
  "Il report per l'ente esce già scritto.",
  "Ogni misura ha la sua data e il suo recettore, invece di stare nella cartella del computer di qualcuno. C\'è il calendario di cosa va misurato e quando, e il report per l\'ente esce già scritto.",
  ["Le letture dello strumento si importano", "La soglia dell\'edificio più vicino", "Report di conformità per l\'ente"],
  "Chi risponde agli enti", "L\'azienda"),
 ("Genesi", "genesi.jpg", "#ff8f2e", "#ffab5c", "#9e591d", "Specializzazione", "corso",
  "Vedi lo scavo prima di farlo.",
  "Per chi lavora in roccia con l\'esplosivo: lo schema si prova sullo schermo invece che sul terreno, il piano di carico esce già scritto, e quello che è successo davvero torna dentro al progetto.",
  ["Progetto in pianta e simulazione 3D", "Piano di carico già compilato", "Confronto fra due varianti"],
  "Chi scava in roccia", "Lo scavo"),
 ("Deepwork ID", "deepwork-id.jpg", "#c7b794", "#e8dcc0", "#736a56", "Pronto al collaudo", "corso",
  "Una password. Otto app.",
  "Una password sola per tutte le app, e i dati di ogni impresa chiusi in casa propria. Ognuno entra e vede soltanto quello che gli compete.",
  ["Un profilo per tutte le app", "I dati di un\'impresa restano suoi", "Ruoli diversi app per app"],
  "Chi decide chi entra", "La base"),
]
# ⛔ Le FAMIGLIE («Lo scavo», «Il cantiere», «L'azienda», «La base») sono state
#    TOLTE su richiesta del fondatore (24/08): dividevano senza aggiungere, e
#    allontanavano le app da chi legge. Restano qui come riga di storia perche'
#    non vengano reintrodotte da chi le trova nei checkpoint vecchi.
APP_APERTURA = ("Deepwork è il cantiere in tasca. Le altre otto lo allargano dove il lavoro si fa "
                "più specifico — e nessuna ti chiede di riscrivere quello che hai già scritto.")

CHIUSURA = ("Ogni app funziona da sola. Insieme, smettono di farti scrivere due volte la "
            "stessa cosa.")
CREDITO = 'Fotografie di cantiere, via Wikimedia Commons: «Hitachi ZX240LCH Hydraulic Excavator» di Alexander Novikov — <a href="https://creativecommons.org/licenses/by-sa/4.0" rel="license noopener" target="_blank">CC BY-SA 4.0</a>; «Hamburg, Quartier Strandkai -- 2023 -- 6632» di Dietmar Rabich — <a href="https://creativecommons.org/licenses/by-sa/4.0" rel="license noopener" target="_blank">CC BY-SA 4.0</a>; «20200417 Quartier Eurobahnhof 01» di Flocci Nivis — <a href="https://creativecommons.org/licenses/by/4.0" rel="license noopener" target="_blank">CC BY 4.0</a>; «2015 09 08 022 Abriss Tortenschachtel» di Friedrich Haag — <a href="https://creativecommons.org/licenses/by-sa/4.0" rel="license noopener" target="_blank">CC BY-SA 4.0</a>; «Caterpillar 302.7D excavator on Barrow Stree…» di Grendelkhan — <a href="https://creativecommons.org/licenses/by-sa/4.0" rel="license noopener" target="_blank">CC BY-SA 4.0</a>; «Chargeur Caterpillar - côté» di Gzen92 — <a href="https://creativecommons.org/licenses/by-sa/4.0" rel="license noopener" target="_blank">CC BY-SA 4.0</a>; «Liebherr 904 excavator» di High Contrast — <a href="https://creativecommons.org/licenses/by/3.0/de/deed.en" rel="license noopener" target="_blank">CC BY 3.0 de</a>; «Blanzac 16 Tombereau Caterpillar 730 2013» di JLPC — <a href="https://creativecommons.org/licenses/by-sa/3.0" rel="license noopener" target="_blank">CC BY-SA 3.0</a>; «Caterpillar 330 excavator on a pile of dirt» di Matthew T Rader — <a href="https://creativecommons.org/licenses/by-sa/4.0" rel="license noopener" target="_blank">CC BY-SA 4.0</a>; «Geothermie Bohrturm» di Richard Bartz — <a href="https://creativecommons.org/licenses/by-sa/2.5" rel="license noopener" target="_blank">CC BY-SA 2.5</a>; «ICE Baustelle 226893 Unteroberndorf » di ermell — <a href="https://creativecommons.org/licenses/by-sa/3.0" rel="license noopener" target="_blank">CC BY-SA 3.0</a>; «MAN TGS 35.400-ICE-Baustelle-Breitengüßbach-…» di ermell — <a href="https://creativecommons.org/licenses/by-sa/4.0" rel="license noopener" target="_blank">CC BY-SA 4.0</a>.'

# ⛔ IL MARCHIO — COPIATO DAL CORE, MAI RIDISEGNATO. Regola fondamentale del
#    fondatore: il logo Deepwork e' uno solo e si usa identico ovunque. Se a
#    una certa misura non si legge, si cambia la MISURA, non il marchio.
#    `marchio(px)` cambia solo l'attributo `width`/`height`: il disegno dentro
#    resta quello, elemento per elemento.
# ⛔ COPIATO DAL CORE (`index.html` alla radice) IL 25/08, E NON DA
#    `apps/index.html`. Il fondatore: «il logo non e' quello originale, ti
#    consiglio di visualizzarlo direttamente dall'app e prendere quello».
#    Aveva ragione, e il difetto era piu' grosso di quanto sembrasse:
#    `apps/index.html` porta DUE marchi DIVERSI FRA LORO (uno col tratto a 2 e
#    uno a 3) e NESSUNO dei due e' quello del core. Quello che usavo aveva 11
#    elementi contro i 25 veri: mancavano le quattro stratificazioni dentro il
#    triangolo, il poligono di contorno, i due raggi arancioni con le loro
#    punte, il filo chiaro dell'asta, la riga di base e le due scritte.
#    Cioe' il controllo «il marchio non si tocca» stava blindando una
#    SEMPLIFICAZIONE — la violazione esatta che CLAUDE.md descrive.
#    ⚠️ La lezione: un canone si prende dalla SORGENTE, non da una copia che
#    sembra la sorgente. `apps/index.html` e' una vetrina, non l'app.
_MARCHIO = """<svg class="marchio" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 122" width="140" height="142" aria-hidden="true"> <polygon points="60,72 16,17 104,17" fill="#14100a"/> <polygon points="60,70 18,19 102,19" fill="none" stroke="#2a2010" stroke-width="1"/> <polygon points="60,68 22,21 98,21" fill="#1c1608" stroke="#ffab00" stroke-width="2"/> <line x1="38" y1="31" x2="82" y2="31" stroke="#2e2412" stroke-width="1"/> <line x1="43" y1="43" x2="77" y2="43" stroke="#2e2412" stroke-width="0.9"/> <line x1="49" y1="55" x2="71" y2="55" stroke="#2e2412" stroke-width="0.7"/> <line x1="54" y1="63" x2="66" y2="63" stroke="#2e2412" stroke-width="0.5"/> <rect x="56.5" y="2" width="7" height="66" fill="#28200c" rx="2"/> <rect x="58" y="2" width="4" height="66" fill="#ffab00" rx="1.5"/> <rect x="59" y="2" width="2" height="66" fill="#ffd54f" rx="0.5" opacity="0.6"/> <polygon points="60,68 55,61 65,61" fill="#ffab00"/> <polygon points="60,68 57,63 63,63" fill="#ffd54f" opacity="0.6"/> <line x1="60" y1="68" x2="42" y2="77" stroke="#ffab00" stroke-width="2.2" stroke-linecap="round"/> <line x1="60" y1="68" x2="78" y2="77" stroke="#ffab00" stroke-width="2.2" stroke-linecap="round"/> <line x1="60" y1="68" x2="50" y2="82" stroke="#ff6d00" stroke-width="1.8" stroke-linecap="round"/> <line x1="60" y1="68" x2="70" y2="82" stroke="#ff6d00" stroke-width="1.8" stroke-linecap="round"/> <line x1="60" y1="68" x2="60" y2="85" stroke="#ffd54f" stroke-width="2.5" stroke-linecap="round"/> <circle cx="42" cy="78" r="2.5" fill="#ffab00"/> <circle cx="78" cy="78" r="2.5" fill="#ffab00"/> <circle cx="50" cy="83" r="1.8" fill="#ff6d00"/> <circle cx="70" cy="83" r="1.8" fill="#ff6d00"/> <circle cx="60" cy="86" r="3" fill="#ffd54f"/> <line x1="10" y1="96" x2="110" y2="96" stroke="#2a2010" stroke-width="0.8"/> <text x="60" y="110" font-size="15" fill="#ffab00" font-family="'Barlow Condensed', Arial Narrow, sans-serif" font-weight="800" letter-spacing="4" text-anchor="middle">DEEPWORK</text> <text x="60" y="121" font-size="6" fill="#3a2a10" font-family="'Barlow Condensed', Arial Narrow, sans-serif" font-weight="700" letter-spacing="3" text-anchor="middle">FIELD OPERATIONS</text> </svg>"""

def marchio(px=74):
    alt = round(px * 122 / 120)
    return _MARCHIO.replace('width="140" height="142"', 'width="%d" height="%d"' % (px, alt))


# ⏱️ UNA FOTOGRAFIA DI LAVORO PER OGNI APP — direttiva del fondatore (23/08):
#    persone e macchine, perforatrici, escavatori, camion, dumper.
# ⛔ NIENTE SEGNAPOSTO. Ci avevo messo le tre fotografie di cava che avevamo,
#    a rotazione: su nove schede si vede subito che si ripetono senza una
#    ragione, e una ripetizione senza ragione sembra una SCELTA sciatta invece
#    che una mancanza. Meglio il posto vuoto — la scheda si disegna col solo
#    accento dell'app e resta pulita — finche' non arriva quella vera.
#    Il soggetto giusto e' dichiarato qui accanto, cosi' non si sceglie a caso.
LAVORO = {
  "Genesi":      (None, "perforatrice al fronte di scavo"),
  "Terra":       (None, "escavatore che muove terreno"),
  "Campo":       (None, "squadra in cantiere, caschi e alta visibilita'"),
  "Flotta":      (None, "pala gommata o mezzo in officina"),
  "Scudo":       (None, "operaio in alta visibilita' con i DPI"),
  "Conti":       (None, "camion o dumper in carico"),
  "Sentinella":  (None, "impianto di frantumazione o vagliatura"),
  "Deepwork":    (None, "veduta d'insieme di un cantiere"),
  "Deepwork ID": (None, "ingresso di un cantiere"),
}


# ── LE FINESTRELLE CHE SPUNTANO ───────────────────────────────────────────
# Direttiva del fondatore (23/08): «piu' finestre, piu' pop-up, piu' immagini
# dinamiche». Non decorazioni mute: ognuna dice una cosa che quell'app SA dire,
# con le parole del mestiere.
# ⛔ Sono ILLUSTRATIVE — la lingua del prodotto, non misure vere. Non contengono
#    e non devono contenere nessuno dei dati di riferimento del fondatore.
POPUP = {
 "Genesi":     [("schema", "Schema provato a schermo"), ("carico", "Piano di carico pronto"),
               ("variante", "Due varianti a confronto")],
 "Terra":      [("rilievo", "Rilievo di ieri acquisito"), ("lotto", "Lotto B · avanzamento misurato"),
               ("sterro", "Sterro e riporto separati")],
 "Campo":      [("chiusa", "Giornata chiusa in cantiere"), ("fermo", "Fermo registrato · causale"),
               ("appello", "Appello di inizio giornata")],
 "Flotta":     [("scadenza", "Revisione in avvicinamento"), ("giro", "Giro macchina completato"),
               ("scorta", "Ricambio sotto scorta")],
 "Scudo":      [("idoneo", "Idoneita' verificata"), ("dpi", "Verbale DPI firmato"),
               ("scad", "Scadenze dei prossimi mesi")],
 "Conti":      [("ddt", "Documento di trasporto → fattura"), ("credito", "Da sollecitare per primo"),
               ("pesa", "Pesata acquisita")],
 "Sentinella": [("lettura", "Lettura sotto soglia"), ("report", "Report per l'ente pronto"),
               ("cal", "Taratura in corso di validita'")],
 "Deepwork":   [("archivio", "Ritrovato dall'archivio"), ("tasca", "Aperto dal telefono"),
               ("storico", "Sei mesi di storico, in due tocchi")],
 "Deepwork ID":[("accesso", "Un accesso, otto app"), ("casa", "Dati chiusi in casa propria"),
               ("ruoli", "Ruoli diversi app per app")],
}


# ── GLI SFONDI DI CANTIERE ────────────────────────────────────────────────
# Direttiva del fondatore (23/08): «servono delle immagini di cantiere da
# procurare online e usare come sfondo».
# ⛔ NIENTE SEGNAPOSTO, come per LAVORO: finche' il file non c'e', la sezione si
#    disegna senza fondale invece che con una fotografia sbagliata a rotazione.
#    `sfondo()` risponde None e chi la chiama non stampa niente.
SFONDI = {
  "ingresso":            "ingresso.jpg",
  "fascia":              "fascia.jpg",
  "invito":              "invito.jpg",
  "app-genesi":          "app-genesi.jpg",
  "app-terra":           "app-terra.jpg",
  "app-campo":           "app-campo.jpg",
  "app-flotta":          "app-flotta.jpg",
  "app-scudo":           "app-scudo.jpg",
  "app-conti":           "app-conti.jpg",
  "app-sentinella":      "app-sentinella.jpg",
  "app-deepwork":        "app-deepwork.jpg",
  "app-deepworkid":      "app-deepworkid.jpg",
  "storia":             "storia.jpg",
  "base-1":              "base-1.jpg",
  "base-2":              "base-2.jpg",
  "base-3":              "base-3.jpg",
  "base-4":              "base-4.jpg",
  "base-5":              "base-5.jpg",
  "base-6":              "base-6.jpg",
  "colonna-1":          "colonna-1.jpg",
  "colonna-2":          "colonna-2.jpg",
  "colonna-3":          "colonna-3.jpg",
  "colonna-4":          "colonna-4.jpg",
}   # dentro scratchpad/foto/pronte/

def sfondo(nome, cartella=None):
    import os as _os
    f = SFONDI.get(nome)
    if not f: return None
    p = _os.path.join(cartella or (_os.path.dirname(_os.path.abspath(__file__)) + "/sfondi"), f)
    if not _os.path.exists(p): return None
    with open(p, "rb") as h:
        return "data:image/jpeg;base64," + base64.b64encode(h.read()).decode("ascii")

# ⚠️ L'UNICO punto della pagina in cui compare la parola «cava»: qui serve a
#    dire «se regge dove le regole sono le piu' strette, regge da voi». Ogni
#    altro posto parla di CANTIERE (direttiva del fondatore, 23/08).
ORIGINE_TITOLO = "Se regge lì, regge nel tuo cantiere"
ORIGINE_SOTTO = ("Deepwork è cresciuto in un'attività estrattiva autorizzata, dove ogni turno va "
                 "dichiarato, ogni scadenza risponde a una legge e ogni misura finisce sul tavolo "
                 "di un ente. Il cantiere edile chiede le stesse cose con meno vincoli, non di più.")
