# GitHub: hochladen & aktualisieren

## Beim ersten Mal — die 5 Dateien ins Repo

Alle **in denselben Ordner** (Repo-Wurzel), Dateinamen genau so lassen:

```
index.html
sw.js
manifest.json
icon-192.png
icon-512.png
```

**So geht's im Browser (kein Git nötig):**
1. Repo öffnen → **Add file** → **Upload files**
2. Alle 5 Dateien reinziehen
3. Unten **Commit changes**
4. **Settings → Pages** → Branch `main`, Ordner `/ (root)` → **Save**

Nach ~1 Minute ist die Seite unter
`https://DEINNAME.github.io/DEINREPO/` erreichbar.

> **Muss HTTPS sein.** Auf `github.io` ist das automatisch der Fall — nur deshalb
> funktioniert der Offline-Modus. Von einer lokalen Datei (`file://`) aus geht er nicht.

---

## Aufs Handy holen

- **Android/Chrome:** Seite öffnen → Menü ⋮ → **App installieren**
- **iPhone/Safari:** Seite öffnen → Teilen-Symbol → **Zum Home-Bildschirm**

Danach: eigenes Icon, Vollbild, **funktioniert ohne Internet**.
Einmal mit Netz öffnen, damit sie sich speichern kann — danach ist sie offline da.

**Auf beide Handys installieren** (du + Beifahrer).

---

## Wenn du später etwas änderst

Immer **beide** Schritte, sonst merkt das Handy nichts:

1. `index.html` im Repo ändern (Bleistift ✏️ → bearbeiten → Commit)
2. **`sw.js` öffnen und die Zahl hochzählen:**
   ```js
   const CACHE = 'grenzen-v3';   →   const CACHE = 'grenzen-v4';
   ```
   Commit.

Beim nächsten Öffnen der App erscheint oben ein blauer Balken:
**„🔄 Neue Version verfügbar → Jetzt aktualisieren"** — antippen, fertig.
Neu installieren musst du **nie**.

> Vergisst du Schritt 2, läuft auf dem Handy die alte Version weiter,
> weil der Cache-Name unverändert ist. Das ist der einzige Stolperstein.

---

## Was offline funktioniert — und was nicht

| ✅ Ohne Netz | ❌ Braucht Netz |
|---|---|
| Checkliste (inkl. deiner Haken) | Live-Kameras |
| Maut-Status & Spuren (ENC / ENP / HGS / FLEX-Spur) | Google-Maps-Links |
| Tankstopps mit Adressen | HAK- / AMSS-Wartezeiten |
| Etappen, km, Grenzen | KI-Live-Check |
| Status-Punkte (frei / zäh / Stau) | |

Genau richtig für **Serbien und Bulgarien**, wo der Empfang wackelt.

---

## Zwei Hinweise

- **Deine Checklisten-Haken hängen an der Adresse.** Änderst du später den Repo-Namen
  oder den Dateinamen, sind sie weg. Also: `index.html` heißt für immer `index.html`.
- Die Haken liegen **nur auf dem jeweiligen Handy** — sie werden nicht zwischen
  deinem und dem zweiten Handy synchronisiert.
