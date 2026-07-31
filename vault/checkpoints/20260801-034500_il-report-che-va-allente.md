# Checkpoint — il report di conformità, cioè il documento che esce dall'azienda

- **Tipo**: unità (7 prove su `reportConformita`, mai provata)
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `2c78135` (canarino del ciclo: `adc97fd`)

## Perché era la più delicata delle rimaste

`reportConformita` produce **l'unica cosa che il cliente consegna davvero fuori
dall'azienda**. Un errore nelle altre funzioni fa perdere tempo o soldi; qui fa
**dichiarare il falso a un ente**.

Per questo, prima di scrivere le prove, sono andato a leggere **cosa promette**
invece di indovinarlo — ed è stato il tempo meglio speso, perché i tre
comportamenti che contano sono tutti nel verso che **assolve**, cioè quello che
nessuno segnala:

1. **La lettura esattamente sulla soglia conta come superamento** (`>=`, non
   `>`). Cambiarlo farebbe risultare conformi proprio i casi limite, che sono
   quelli su cui si discute con l'ente.
2. **Un punto senza letture non è «conforme», è «senza-dati».** Dire conforme
   dove non si è misurato è la bugia più facile da scrivere in un programma.
3. **Le letture fuori periodo non entrano**: un report di luglio con dentro una
   misura di giugno non è il report di luglio.

E, in più: un valore illeggibile viene **scartato**, non trasformato in zero —
zero sarebbe una misura, per giunta rassicurante.

## La controprova

Rimessi due difetti, tutti e due nel verso che assolve:
- soglia con `>` invece di `>=` → «atteso 1 superamento, ottenuto 0»;
- esito senza il caso «senza-dati» → «atteso senza-dati, ottenuto **conforme**».

Il secondo è quello che vale il lavoro: con quel difetto un cliente potrebbe
consegnare all'ente un report che **dichiara la conformità di un periodo in cui
non è stato misurato niente**.

⛔ Da notare: qui si è **misurato il comportamento**, senza toccare nessuna
soglia. Le curve di sicurezza restano decisione del fondatore.

## Stato

- **478** KPI (433 all'inizio della giornata) → **737** prove `node`, tutte verdi
- **45 prove nuove** nella giornata su funzioni che nessuna suite nominava
- giro a 19 banchi: ancora al secondo banco (i due sui campi interi da soli
  prendono quasi un'ora: digitano davvero in 29 campi su nove superfici)

## Prossimo passo atomico

Continuare la copertura per priorità di danno con **`lavoratoriScoperti`** di
Scudo — dice **chi non può lavorare** e quindi chi va fermato — e
**`coperturaControlli`** di Flotta. Stessa disciplina: prova vista fallire col
difetto rimesso, e se nasce rossa si legge il codice prima di accusarlo.

## Bloccanti

- Nessuno.
