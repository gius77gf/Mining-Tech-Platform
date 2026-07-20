# Checkpoint — 2026-07-21 — Firebase: nota Blaze + bootstrap gratis (fatto) ★

## Task completato (scoperta importante, non un semplice polish)
Analizzando la GUIDA_FIREBASE per il weekend ho trovato un vincolo
reale che avrebbe sorpreso il fondatore: le Cloud Functions (create
org, inviti, ruoli) girano SOLO su piano BLAZE (a consumo, fascia
gratuita ampia ma serve carta) — NON sul gratuito Spark. Auth+
Firestore sono gratis.
Provvedimenti (onestà, nessuna spesa nascosta):
- GUIDA_FIREBASE.md: sezione chiara "cosa parte gratis e cosa richiede
  una scelta"; le 6 app partono live gratis, il self-service org/inviti
  richiede Blaze (0€ utilizzo) = decisione fondatore.
- scripts/bootstrap-owner.mjs: script una tantum (Admin SDK locale,
  gratis) che crea l'org del fondatore e scrive i claims owner senza
  Functions → sblocca le 6 app live subito. Sintassi ok.
- .gitignore rafforzato: mai committare chiavi di servizio.
- Roadmap weekend aggiornata con la decisione.

## Prossimo passo atomico
PR verso main e merge. Continuare fino a esaurimento. Al SERALE:
revisione COMPLETA. Il primo punto del resoconto weekend al fondatore
è ora questa scelta Blaze (già nel promemoria sabato). MAI fermarsi
volontariamente.
