# Checkpoint — la nota di credito si rilegge

**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`

Emettere un documento fiscale e non poterlo più vedere vuol dire averlo solo
come **effetto su un altro**: il badge «Stornata» sulla fattura c'era, la nota
no. Adesso c'è la sezione **Note di credito**, sotto le fatture.

**Sta lì e non in una schermata sua**, ed è una scelta: una nota non è un
documento che vive da solo — si legge sempre insieme alla fattura che storna. E
compare **solo quando ce n'è almeno una**: uno stato vuoto per un documento che
la maggior parte delle cave non emette mai sarebbe rumore, non aiuto.

Ogni riga dice **da quale fattura** storna e **con quale causale**: senza quelle
due cose la nota è formalmente valida e fiscalmente **orfana**, ed è la prima
cosa che un controllo chiede. Se la fattura non è più in archivio la riga lo
scrive («non più in archivio») invece di mostrare un trattino.

Il banco passa da **13 a 17 prove**; la controprova ne fa cadere **13 su 17**.

## Prossimo passo atomico

1. **Terra/Genesi — tracciabilità del volume**, unità 1 e 2;
2. **poi** il giro completo del browser a 29 esecuzioni, una volta sola.
