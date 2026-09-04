# Ultimo ciclo di lavoro automatico

- **Quando**: 2026-09-04, 18:48 UTC
- **Commit di partenza**: `baff7fc6`
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa sta per succedere

⚠️ Settima interruzione per **limite di crediti** (verso le 14:45Z del 04/09;
i cicli delle 15:45 e delle 18:45 sono arrivati insieme alla ripresa). Prima
dell'interruzione: ventidue commit pushati nella giornata (barre con null,
la grafia dei fogli del core, Deepwork ID e la vetrina, Sentinella annullate
e scheda del punto, Flotta meteo / scelti-subìti / contatore sostituito, la
fattura elettronica, lo scatter di Genesi, quattro ricerche con il delta).
Morti a metà: i cantieri «tagliando col contatore di riferimento» (Flotta)
e «lettura a più colonne» (Sentinella), che hanno lasciato file non
committati sul disco. Già verificata e in indice: la riga «anno per anno»
di Terra.

Adesso: committare Terra, valutare i due cantieri morti dai loro diff
(tenere solo ciò che si misura), poi proseguire.

## ⛔ 21:46 UTC — crediti ESAURITI (non il limite di sessione: «out of usage credits»)

I due cantieri rilanciati (Flotta tagliando col contatore, Sentinella lettura
a più colonne) sono morti al primo passo con «You're out of usage credits».
Sul disco restano i loro file NON committati (`apps/flotta/*`,
`apps/sentinella/*`): non entrano finché non vengono verificati. Il
committato è tutto pushato e verde (ultimo: la riga «anno per anno» di
Terra, checkpoint ce08a25b). Il prossimo ciclo riparte dal checkpoint più
recente: raccogliere o rifare quei due cantieri dai diff, tenendo solo ciò
che si misura.
