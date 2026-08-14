# Checkpoint — una regola, un posto solo

**Commit:** `62ba15b`
**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`

## Il giro del browser è finito, e con lui l'attesa

**19 banchi a posto, 0 da guardare.** Da lì si è aperta la finestra per
toccare i moduli dati — che era la sola cosa che mancava, perché
modificarli mentre un banco apre le pagine falsifica il banco.

## Le tre correzioni, applicate insieme

**1. Una sola `messaggioNumero`.** Era scritta in due posti, e su dieci
casi provati **tre messaggi erano diversi** — con ognuna delle due
migliore dell'altra in un punto, e quindi **nessun gruppo di utenti** che
vedesse la versione buona in entrambi. Adesso ce n'è una sola, nello
shell, col **meglio delle due**: la frase dell'ambiguo che dice anche
*come* si scrive («1250», non «1.250») era di Flotta; lo zero che si vede
nel messaggio (`«0»` invece di `«»`) era dello shell.
`AVVISO_DECIMALE` e `AVVISO_MIGLIAIA` sono esportati da lì, e le quattro
app che li ridichiaravano li **ri-esportano**: le pagine non cambiano una
riga.

**2. `dataPiuGiorni` in `shared/`.** Era scritta **identica** in Scudo e
Sentinella e **si era già staccata** sul caso d'errore: una rispondeva
`null`, l'altra `""`. È il caso da manuale di `CLAUDE.md`, colto mentre
divergeva. Ne esce anche **irrigidita**: `Number(null)` è `0`, quindi
«nessun numero di giorni» diventava «scade oggi» — su un'azione correttiva,
una scadenza che qualcuno firma. Stava in **due copie**, e chiuderla in un
posto solo l'ha chiusa in tutt'e due. E `giorni` è tornato a essere un
alias di `giorniTra`.

**3. Il raggruppamento delle migliaia, scritto.** Con le opzioni di serie
Chromium scrive «6.375» e Node «6375»: i moduli li leggono **tutt'e due**.
Adesso è esplicito nei sette punti, e la **regola 16** dello stile lo
pretende — anche `false`, dove è la scelta giusta (`perCampo`: un punto
delle migliaia dentro un campo rientrerebbe come numero ambiguo).

## Cinque prove sono cadute, ed era giusto

Tutte e cinque blindavano la verità **di prima**. La più istruttiva è
quella del tagliando: portava scritto che *«in italiano 6375 si scrive
senza il punto, la lingua raggruppa solo da cinque cifre in su»*. È **mezza
verità** — è la preferenza CLDR per l'italiano — ma **non è quello che vede
l'utente**, e quella prova stava blindando la stringa che si vede **solo
nelle prove**. Adesso afferma «6.375», che è anche la convenzione già
scelta a mano, con tanto di commento, in Campo e in Sentinella.

Vale la pena tenerla come esempio: una prova può essere verde, precisa, e
**misurare l'ambiente invece del prodotto**.

## Le prove nuove pretendono l'IDENTITÀ

Sette prove che confrontano l'**oggetto**, non il comportamento
(`flotta.messaggioNumero === shell.messaggioNumero`). La differenza non è
formale: due copie che si comportano uguale oggi divergono domani senza
che nessuno lo veda — ed è esattamente quello che era successo.

E `nomi-doppi.mjs` è entrato **in coda alla CI**: **12 nomi guardati, 4
alias, 5 divergenze dichiarate, 0 da sistemare.**

## Verifica sulle pagine vere

I moduli cambiati sono importati dalle pagine, e un import rotto **non dà
nessun errore visibile**: la pagina resta com'era e basta. Aperte tutte e
**nove** le superfici in Chromium con la console sotto controllo:
**0 errori di codice** (gli errori di rete verso `gstatic` sono attesi
senza rete e vengono filtrati, contati e dichiarati).

## Numeri

- `run-kpi`: **962 → 969**; `run-stile`: **201 → 212**; totale `node`:
  **1.245 → 1.263**, zero falliti anche con `TZ=Europe/Rome`
- copertura: **403 funzioni su 409**

## Prossimo passo atomico

Il predicato **«rilievo elaborato con volume»**, scritto **dieci volte** in
`terra-data.js` in tre varianti (liscio, con il controllo della data, con
quello dell'anno). Non va in `shared/` — è dentro un modulo solo — ma è
il modo in cui una variante si stacca dalle altre senza che nessuno lo
veda, ed è la stessa forma dei difetti chiusi oggi. Si raccoglie in una
funzione sola, con la prova che pretende l'identità di comportamento sui
tre casi.

Poi: **Il Quadro**, appena il fondatore dice **dove** vive (punto 15 di
`DECISIONI_WEEKEND.md`). Le sei tessere sono già state provate una per una
e si riempiono con numeri veri.

## Nessun blocco

Restano aperte le decisioni del fondatore in `DECISIONI_WEEKEND.md`
(punti 5a/5b, 10, 11, 12, 13, 14, 15).
