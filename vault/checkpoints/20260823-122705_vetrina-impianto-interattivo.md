# Checkpoint — 2026-08-23T12:27:05Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
7330e679 — «La vetrina non restituiva niente a chi la muoveva»

## Che cosa è stato completato

Direttiva del fondatore (23/08), col sito di un ristorante di fascia alta
(soraeats.com) come riferimento: la schermata di presentazione deve
restituire un output a ogni movimento.

**Nel prodotto** (`apps/index.html`, +331 righe): quattro strati d'ambiente
fissi fuori da `.wrap` — la grana, la barra di lettura, l'alone del
puntatore, la tinta della famiglia — più l'apertura a tutto schermo
(`100svh`), il titolo che sale parola per parola, il ventaglio di telefoni
che deriva sullo scorrimento, il suggerimento «scorri» che si spegne al
primo movimento, e la risposta al tocco su tutto ciò che si preme.

⛔ **La riga che è costata di più da capire**: `overflow-x: hidden` su
html/body rende il corpo un **contenitore di scorrimento**, e da lì
`position: sticky` smette di funzionare in TUTTA la pagina **senza dare
nessun errore**. `clip` taglia allo stesso modo — che era la ragione
misurata per cui quella riga esisteva — e non crea il contenitore.

**Fuori dal prodotto**: una tela di progettazione con cinque tavole
(apertura, telefono 390, ponti, nove schede, vocabolario dei pezzi),
pubblicata come artefatto perché il fondatore possa spostare gli elementi a
mano: https://claude.ai/code/artifact/1ffa0ff5-c6f1-4a4b-91da-938ceca413d6

## Misure

- Vetrina a 1280/430/390/320 px: **nessuno scorrimento laterale**, nessun
  errore di pagina, 4 strati su 4 montati, 7 zone di tinta.
- Giro `node` **sulla copia di ciò che si committa**: **37 comandi a posto,
  0 caduti**, 3.259 asserzioni.
- `numeri-nei-documenti`: 43 passati, 0 falliti (ha fatto cadere il primo
  tentativo perché avevo aggiunto una voce di roadmap **senza la sua riga
  d'indice** — il controllo dice pure il comando per rigenerarlo).

## Il riferimento, misurato invece che creduto

soraeats.com è **WordPress + Elementor Pro 4.1.1**, con Swiper. Nel sorgente
c'è **una sola classe di animazione** (`elementor-animation-grow`, 11
occorrenze): quello che lo fa sembrare vivo è la **composizione**, non il
movimento. Caratteri Cormorant Garamond + Plus Jakarta Sans; oro `#a78d58`,
crema `#f4efe4`.
⚠️ Il dominio era bloccato dal proxy; il fondatore ha allargato la politica
di rete. **Chromium in questo contenitore non raggiunge comunque niente**
(`ERR_CONNECTION_RESET` anche su example.com): la via che funziona è
scaricare col `wget`/`curl` e **servire la copia da 127.0.0.1**.

## Prossimo passo atomico

**Incorporare i caratteri nelle cinque tavole della tela** come
`@font-face` con URI `data:`, invece del `<link>` a fonts.googleapis.com.
Misurato: una tavola col `<link>` resta **vuota** in questo contenitore
(`html=149`, zero testo), la stessa senza si disegna — perché il browser
qui non ha rete. Sulla tela pubblicata i caratteri arrivano, ma così **ho
pubblicato una cosa che non ho mai guardato**, e in più l'esportazione in
PNG/PDF esce col carattere di ripiego.
I tre woff2 (sottoinsieme latino) sono già scaricati in
`scratchpad/tela/font/`: `bc800` 21,9 KB, `b400` 21,7 KB, `b600` 22,2 KB.
Si sostituisce il `<link>` in ognuno dei cinque `.dc.html`, si ri-semina con
`seed-canvas.mjs` e si ripubblica sullo **stesso** percorso di file.

## Bloccato, in attesa del fondatore

1. **Una fotografia di cava** per l'apertura — nel riferimento l'apertura è
   una foto a tutto schermo scurita col titolo sopra, ed è la mossa che alza
   di più il risultato.
2. **Il sì o il no a una sezione chiara** — il riferimento alterna scuro e
   crema. Da noi sarebbe UNA sezione su fondo pietra chiara: è una
   deviazione dal «tutto scuro» del core, quindi non si fa senza conferma.
