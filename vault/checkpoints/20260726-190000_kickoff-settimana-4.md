# Checkpoint — 2026-07-26T19:00:00Z

## Tipo
kickoff (settimana 27/07 → 01/08, roadmap v4.0 "RADDOPPIO")

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
d53276a

## Stato roadmap
Nuova settimana avviata (lun 27/07 → sab 01/08). Roadmap riscritta in
`vault/ROADMAP_SETTIMANA.md` su direttiva del fondatore: raddoppiare il
lavoro prodotto. Cinque colli di bottiglia individuati e affrontati:
1. pochi cicli (5 h, lun-ven ~25) → **ogni 3 h, lun-sab ~48**;
2. lavoro in serie → **2-3 cantieri in parallelo per ciclo**;
3. attese del fondatore → **riserva non-gated sempre pronta** (Fasi A/C/E);
4. unità troppo piccole → **task pesanti pianificati** (editor 3D, ciclo chiuso);
5. riletture inutili → checkpoint precisi + compattazione a confine d'unità.
Obiettivo misurabile: ≥ 40 unità completate (contro ~25).

## Fasi
- **A — Genesi, il salto** (9 task, non-gated): editor fronte nel 3D,
  colonne di carica a colori, mappa quote, editor visuale dei ritardi,
  ottimizzatore di volata, modulo fronteProfilo (passo 3), report
  professionale, rifiniture scena, login.
- **B — Ciclo chiuso** (5 ponti): Genesi→Campo→Terra→Conti + Sentinella +
  cruscotto del giro completo.
- **C — Verticali** (6): estetica core al 100% (topbar/tab) + identità per
  app (listino/DDT, serie storiche, CAPA, piano squadre, piano annuale).
- **D — Go-live** (3): dipende dai 10 minuti del fondatore su Firebase.
- **E — Qualità** (4): suite oltre 420 test, sicurezza del codice nuovo,
  prestazioni 3D, revisione serale.
- **F — Ricerca continua** in background, una app a rotazione.

## Prossimi passi
Primo task del lunedì: **A1 — editor del fronte NEL 3D** (maniglie cresta e
piede, quote, annulla/ripristino), in parallelo con una deep-research su
Genesi (rotazione F) lanciata in background. Se un gate blocca, si passa
subito alla riserva non-gated (A2, C1, E1).

## Note
- Settimana precedente chiusa con 12 unità attuative della revisione del
  fondatore (25-26/07): regola ferrea sui dati orientativi, Genesi
  2D/3D/home/estetica, differenziazione Scudo/Flotta/Campo/Terra.
- PR #321 aperta, senza conflitti, 120 commit: contiene tutto il lavoro
  delle ultime due settimane. Il merge è del fondatore.
- Test: 364 in CI, tutti verdi. Smoke 9/9 superfici pulite.
- Routine automatica precedente (`weekly-build-mining-tech-2026-07-19`,
  ogni 5 h lun-ven) rimossa e sostituita — vedi punto 4/5 della skill.
