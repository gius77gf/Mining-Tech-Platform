# Checkpoint — 2026-09-12T19:42:09Z

## Tipo
ricerca di fianco (solo mondo, nessun codice toccato)

## App
Genesi (direttiva del fondatore ancora in vigore: solo Genesi)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`ea27edaa`

## Completato

Raccolta e integrata in `docs/RICERCA_CONTINUA_GENESI.md` (append-only)
la ricerca lanciata in background durante l'unità 135, mirata alla
decisione **#28** pendente in `docs/DECISIONI_WEEKEND.md` (misura
assistita della pezzatura da foto): metodi/algoritmi noti (watershed,
deep learning/CNN, Mask R-CNN, SAM/EdgeSAM), software commerciali di
riferimento con query di controllo eseguita PRIMA di nominarli
(Split-Desktop, WipFrag, FragScan, PowerSieve, più altri emersi:
FragMetriX, Orica FRAGTrack, Mineprism, Maptek PointStudio), librerie
open-source eseguibili in un browser senza backend (**OpenCV.js** —
`cv.watershed()`, tutorial ufficiale pubblico, gira in WASM lato
client; TensorFlow.js con modelli generalisti tipo DeepLab v3, nessun
modello pre-addestrato specifico per rocce trovato pronto in formato
TF.js), e le difficoltà tecniche documentate (sottostima della
frazione fine, necessità di un oggetto di scala nell'inquadratura,
sensibilità a illuminazione/ombre, bias da sovrapposizione dei
blocchi, limite strutturale 2D→3D).

Fatta con `WebSearch` soltanto (`WebFetch` bloccato, EGRESS_BLOCKED).
Ogni fatto è marcato "[di seconda mano: fonte]"; dove i risultati non
davano una risposta, il documento scrive "non trovato" invece di
dedurre. **Nessun confronto col nostro codice fatto dall'agente di
ricerca**, come da regola di questo file: solo la metà mondo.

## Stato roadmap

Nessuna voce nuova aperta: la decisione #28 resta ferma in attesa del
fondatore. Questa ricerca è materiale per QUANDO/SE arriva una
decisione, non un mandato a costruire.

## Blocchi e limiti noti

- Nessun prodotto o progetto trovato che dichiari esplicitamente
  all'utente finale un margine d'incertezza sulla misura di
  frammentazione — se Genesi lo facesse (coerente col principio del
  fondatore "l'assenza di un dato non è un dato favorevole"), non
  avrebbe un modello diretto da copiare, solo la letteratura tecnica su
  dove nasce l'incertezza.
- Nessun porting JS/WASM pubblico trovato dei tre progetti GitHub
  specifici per frammentazione di roccia (tutti Python/Mask R-CNN/SAM).
  Un'eventuale implementazione in Genesi partirebbe quindi da OpenCV.js
  (watershed classico, nessun training richiesto) piuttosto che da un
  modello di deep learning pronto — l'unica strada che i risultati
  confermano essere realizzabile OGGI, senza backend, senza dataset di
  training proprio.

## Prossimo passo atomico

La decisione #28 resta l'unico blocco per tradurre questo in un delta
di prodotto. Nel frattempo:
1. Tornare al lavoro sul prodotto in aree NON bloccate da decisioni
   pendenti — vedi checkpoint 134/135 (B3 in gran parte esaurito dei
   candidati facili).
2. Una nuova ricerca di fianco su un angolo Genesi ancora scoperto, a
   rotazione con gli argomenti già coperti (rapporto di volata,
   progettato-vs-perforato, piano di tiro, esplosivi/licenze, Kuz-Ram,
   presplit/detonatori, ora anche frammentazione da foto).
