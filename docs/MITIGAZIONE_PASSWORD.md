# Mitigazione ponte — password in chiaro (PREPARATA, NON ATTIVATA)

Stato: in attesa di conferma del fondatore (revisione weekend).
Riferimento: docs/AUDIT_SICUREZZA.md punto 1 (critico).

## Perché "ponte"
La soluzione definitiva è la migrazione a Deepwork ID (fasi B/C in
apps/deepwork-id/ARCHITETTURA.md). Ma richiede il progetto Firebase
nuovo e la migrazione degli utenti reali. Nel frattempo le password
attuali restano esposte nel sorgente pubblico: questa mitigazione
chiude l'esposizione SUBITO senza aspettare la migrazione completa.

## Cosa fa (quando attivata)
1. RIMUOVE le 7 password in chiaro da index.html (DEFAULT_USERS perde
   il campo `pwd`; il primo avvio senza database non crea più utenti
   con password note).
2. Sposta la verifica su documenti Firestore `users_auth/{user}` con
   hash PBKDF2 (WebCrypto, 100k iterazioni) + salt casuale per utente
   — niente più fallback al confronto in chiaro.
3. ROTAZIONE OBBLIGATORIA: tutte le password attuali vengono
   invalidate; il fondatore assegna le nuove (vanno comunicate a voce
   o su canale privato, MAI nel repo).
4. Il seeding degli hash avviene una tantum con lo script sotto,
   eseguito in locale dal fondatore o in sessione con me.

## Limite dichiarato
Anche con l'hash, la logica resta nel client: un attaccante non può
più leggere le password dal sorgente, ma la vera protezione dei DATI
resta affidata alle regole Firestore del progetto esistente (punto 3
dell'audit — da verificare col fondatore). Questo è il motivo per cui
è un ponte e non la soluzione.

## Passi operativi (al via libera)
1. Generare le nuove password (fondatore).
2. Eseguire lo script di seeding (sotto) che scrive gli hash su
   Firestore `users_auth/`.
3. Applicare la patch a index.html: rimozione campo `pwd` +
   sostituzione della funzione di verifica con la versione PBKDF2
   senza fallback (bozza già scritta, pronta da applicare).
4. Verificare login di tutti i ruoli + un tentativo con password
   vecchia (deve fallire).
5. Aggiornare AUDIT_SICUREZZA.md (punto 1 → mitigato-ponte).

## Script di seeding (bozza)
```js
// Esegue in pagina (console) da un account admin già autenticato,
// oppure via Node con firebase-admin. Per ogni utente:
async function hashPassword(password, saltB64) {
  const enc = new TextEncoder();
  const salt = Uint8Array.from(atob(saltB64), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    key, 256);
  return btoa(String.fromCharCode(...new Uint8Array(bits)));
}
// doc users_auth/{username}: { saltB64, hashB64, updatedAt }
```

## Nota per i cicli automatici
NON applicare questa mitigazione finché il fondatore non la conferma
esplicitamente in conversazione. Qualsiasi ciclo che legga questo file:
lo stato autorizzativo è "PREPARATA, NON ATTIVATA".
