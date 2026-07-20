# Checkpoint — 2026-07-20T17:22:18Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
2117744

## Completato
Flotta: i KPI dei mezzi ora impostano il filtro parco (dopo l'aggiunta del
filtro a chip). "Mezzi operativi"→data-filtro operativo; "In manutenzione"
→data-filtro tutti (azzera filtro precedente, fermi/verifica in cima per
ordinamento). Handler .kpis aggiornato per leggere data-filtro (come
Terra/Sentinella). Syntax OK; Playwright: KPI-FILTER OK (operativi=4
evidenziato, in manutenzione→6 tutti).

## Stato roadmap
Parità filtri completa: tutte e 6 le app hanno filtro a chip sulla lista
principale, e Flotta ora integra tap-KPI→filtro.

## Prossimo passo atomico
Merge PR flotta-kpi-filtro (dopo CI verde), riparti branch da main.
Prossimo (punto 1 o 4): candidati - (a) filtro urgenza su Flotta man-list
(scadute/entro30/oltre) se utile; (b) test aggiuntivo su flotta.kpiFrom
tagliandi30 al confine (attenzione: usa new Date() interno → dati
relativi, rischio flakiness: valutare con date relative robuste o
skippare); (c) rivedere se altre app hanno tap-KPI che potrebbero
impostare un filtro non ancora sfruttato. Scegliere UNA cosa piccola,
verificare, commit+checkpoint+PR. Continuare fino a esaurimento crediti.

## Blocchi
Nessuno. Genesi funzionale e voci gated attendono il fondatore.
