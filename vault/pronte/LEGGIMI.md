# Codice pronto, non ancora trasferito

⚠️ **Questi file NON sono in uso**: nessuna pagina e nessun modulo li importa, e
non devono importarli. Sono qui per una ragione sola — la cartella scratchpad
muore col contenitore, e `CLAUDE.md` dice che *una difesa che resta nello
scratchpad, alla sessione dopo non esiste*.

Ci finisce solo codice **già scritto e già controprovato** che non è potuto
entrare nel suo file perché in quel momento **girava un giro del browser** (e
mentre gira non si toccano moduli dati e pagine). Appena il giro finisce, il
codice si trasferisce e **questi file si cancellano**: se restano qui più di un
ciclo, sono un doppione — cioè esattamente il difetto che il repository combatte.

## Contenuto attuale

**`terra-origine-*`** — la provenienza del volume per Terra (unità 4 di
`docs/RICERCA_TRACCIABILITA_VOLUME_202608.md`): `origineDi` e `descriviOrigine`.
7 prove verdi, **4 controprove su 4** che cadono col difetto rimesso.

Destinazione: `apps/terra/terra-data.js` (le funzioni) e
`apps/deepwork-id/tests/run-kpi.mjs` (le prove, **prima** del blocco finale che
chiude con `process.exit`).

Una nota sulla quinta controprova, tolta di proposito: togliere `useGrouping:
true` non fa cadere niente in `node`, perché su un numero di **sei** cifre Node
e Chromium raggruppano uguale — la differenza vive sui numeri di **quattro**
cifre. A pretendere che sia dichiarato è la **regola 16** di `run-stile.mjs`,
che guarda il testo del codice invece del risultato.
