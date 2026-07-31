# Checkpoint — il lato cella smette di essere invisibile

**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`

Prima metà dell'**unità 5** della scheda sulla tracciabilità.

Il lato della griglia era la scelta **più pesante** del calcolo — vale il **22%**
fra 0,25 m e 2 m, misurato su un cono di volume noto — e la faceva il software,
in silenzio, dalla larghezza del ritaglio:

```js
Math.max(0.25, Math.min(2, (x1 - x0) / 60))
```

Nessuno poteva sapere che **allargare il taglio gonfia il volume**. Ora il numero
sta accanto al volume, con la **quota di base** che lo accompagna:

> volume ≈ 5.243 m³ *(griglia 0,50 m, base 340,42 m — stima)*

Sono i due valori che rendono la stima **rifacibile**, e sono gli stessi che il
verbale stampa: chi legge il foglio e chi guarda lo schermo vedono la stessa
cosa.

## Che cosa resta dell'unità 5

La cella **si vede**; **cambiarla** a mano no. Va fatta dopo, e va fatta bene:
serve un comando, il ricalcolo, e la decisione su che cosa succede al record già
salvato quando il numero cambia. Metterci un cursore adesso, senza quella
decisione, vorrebbe dire poter salvare due volumi diversi per lo stesso ritaglio
senza che si capisca quale sia quello buono.

## Prossimo passo atomico

1. **la cella si cambia**, con il ricalcolo e la regola sul record già salvato;
2. la nota di credito nell'**export per il commercialista** e nel registro IVA;
3. giro completo a **31 esecuzioni** a lavoro sul codice fermo.
