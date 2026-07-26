# Scudo — base normativa: sicurezza sul lavoro nelle attività estrattive

Ricerca del 25/07/2026 a supporto della differenziazione di Scudo richiesta
dal fondatore ("vanno fatte ricerche per capire cosa prevede la legge
italiana in termini di sicurezza sul lavoro"). Sintesi operativa, non un
parere legale.

## Il quadro

- **D.Lgs 81/2008** (Testo Unico Sicurezza) — vale per tutti i settori,
  cave comprese: valutazione dei rischi, figure della sicurezza (RSPP,
  medico competente, RLS, preposti), formazione, DPI, sorveglianza
  sanitaria, registro infortuni.
- **D.Lgs 624/1996** — norma SPECIFICA per le attività estrattive: nelle
  cave il documento di valutazione prende la forma del **DSS (Documento di
  Sicurezza e Salute)**, che integra i contenuti dell'art. 28 del D.Lgs
  81/08 con quelli degli artt. 6 e 10 del 624/96. Va **inviato alla ASL
  competente prima dell'avvio dell'attività** (con la denuncia di
  esercizio). Nelle cave è inoltre obbligatoria la figura del
  **sorvegliante** dei lavori.
- Il **POS** (Piano Operativo di Sicurezza, art. 89 D.Lgs 81/08) riguarda i
  **cantieri temporanei o mobili**: serve quando l'azienda opera come
  impresa esecutrice in un cantiere (es. lavori per conto terzi) — per
  questo in Scudo il POS si collega a un "cantiere esterno", il DSS alla
  cava.

## I documenti che Scudo gestisce (tipi nel form)

| Tipo | Cosa è | Si collega a |
|---|---|---|
| **DSS** | Documento di Sicurezza e Salute (cave, D.Lgs 624/96) | cava |
| **POS** | Piano Operativo di Sicurezza (cantieri, art. 89) | cantiere esterno |
| **DVR** | Valutazione dei rischi generale (art. 28) | azienda |
| **DUVRI** | Rischi da interferenze con ditte esterne (art. 26) | cava/cantiere |
| **Nomina** | RSPP, medico competente, addetti emergenze, sorvegliante | azienda |
| **Verbale DPI** | Consegna DPI **firmata dal lavoratore** (art. 18) | lavoratore |
| **Idoneità sanitaria** | Giudizio del medico competente (art. 41) | lavoratore |
| **Attestato formazione** | Corsi obbligatori e aggiornamenti (art. 37) | lavoratore |

## Perché gli allegati contano

La difesa tipica in un'ispezione o in un contenzioso è **la carta firmata**:
il verbale di consegna DPI col nome e la firma, l'attestato del corso, il
giudizio di idoneità. Scudo ora permette di allegare **foto o scansione**
del documento firmato e di ritrovarlo dal lavoratore o dal cantiere.

## Limite tecnico attuale (dichiarato in interfaccia)

Gli allegati viaggiano dentro il database dei documenti (tetto ~1 MB per
documento Firestore) → limite prudente di **400 KB** per file in questa
fase. L'archivio completo (PDF pesanti, molte foto) richiede **Firebase
Storage**, che arriverà con il progetto live — quando il fondatore avrà
creato il progetto Firebase.

## Fonti

- ANFOS — "La sicurezza nel settore dell'estrazione di minerali da cave e
  miniere: panoramica sul D.Lgs 81/2008" (anfos.it)
- PuntoSicuro — "Come elaborare il documento di sicurezza e salute nel
  settore estrattivo" e "Sicurezza e valutazione dei rischi per le attività
  estrattive nelle cave" (puntosicuro.it)
- Certifico — "Vademecum sicurezza attività estrattive", "Guida operativa
  sicurezza attività estrattive" (certifico.com)
- Testi normativi: D.Lgs 81/2008, D.Lgs 624/1996.
