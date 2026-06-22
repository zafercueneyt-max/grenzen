# Grenzen-Check · Sıla Yolu — auf GitHub Pages einrichten

Damit bekommst du:
- **Echte App** mit eigenem Icon (Home-Bildschirm, Vollbild)
- **Zuverlässig offline** (Service Worker cached die App)
- **Automatische Wartezeiten** für **Batrovci** und **Gradina** (Quelle AMSS), die sich alle 20 Min selbst aktualisieren
- **Teilbar per Link** — Familie öffnet einfach die Adresse

Dauer: ~15–20 Minuten. Du brauchst nur einen kostenlosen GitHub-Account.

---

## 1. GitHub-Account anlegen
1. Auf **github.com** gehen → **Sign up** → E-Mail, Passwort, Benutzername wählen.
2. E-Mail bestätigen.

## 2. Neues Repository erstellen
1. Oben rechts auf **+** → **New repository**.
2. **Repository name:** z. B. `grenzen` (klein, ohne Leerzeichen).
3. **Public** auswählen (wichtig, sonst ist Pages bei Gratis-Konto eingeschränkt).
4. Häkchen bei **Add a README** NICHT nötig — einfach **Create repository**.

## 3. Dateien hochladen
1. Im neuen Repo auf **Add file** → **Upload files**.
2. Aus diesem Paket **den kompletten Inhalt** hochladen (per Drag & Drop in den Upload-Bereich):
   - `index.html`
   - `sw.js`
   - `manifest.webmanifest`
   - `icon.svg`
   - der Ordner `data/` (mit `wait-times.json`)
   - der Ordner `scripts/` (mit `fetch-wait.mjs`)
   - der Ordner `.github/` (mit `workflows/update-wait-times.yml`)

   > Tipp: Ziehst du den **ganzen Ordnerinhalt** rein, bleiben die Unterordner erhalten.
   > Falls `.github` beim Drag & Drop nicht mitkommt (manche Systeme verstecken Punkt-Ordner),
   > lege ihn manuell an: **Add file → Create new file**, als Namen
   > `.github/workflows/update-wait-times.yml` eintippen (die Schrägstriche erzeugen die Ordner)
   > und den Inhalt der Datei einfügen.
3. Unten **Commit changes**.

## 4. GitHub Pages einschalten
1. Im Repo oben auf **Settings** → links **Pages**.
2. Unter **Build and deployment → Source**: **Deploy from a branch**.
3. **Branch:** `main`, Ordner **/(root)** → **Save**.
4. Kurz warten (1–2 Min). Oben erscheint die Adresse, z. B.
   **`https://deinname.github.io/grenzen/`** — das ist deine App.

## 5. Den Wartezeiten-Roboter scharf schalten
1. Im Repo auf **Actions**.
2. Falls gefragt: **„I understand my workflows, go ahead and enable them"** bestätigen.
3. Links **„Wartezeiten aktualisieren"** anklicken → rechts **Run workflow** → **Run workflow**.
   - Das ist der erste manuelle Lauf. Danach läuft er automatisch alle 20 Minuten.
4. Nach ~1 Min sollte unter **data/wait-times.json** etwas wie
   `"crossings": { "batrovci": { "izlaz": 30, "ulaz": 60 }, ... }` stehen.

> **Wichtig (einmalig):** Damit der Roboter zurückschreiben darf:
> **Settings → Actions → General → Workflow permissions** →
> **„Read and write permissions"** auswählen → **Save**.
> (Falls der erste Lauf mit „permission denied" beim Push scheitert, war das der Grund —
> Einstellung setzen und Workflow nochmal starten.)

## 6. Als App aufs Handy
- **iPhone (Safari):** Adresse öffnen → Teilen-Symbol → **Zum Home-Bildschirm**.
- **Android (Chrome):** Adresse öffnen → Menü ⋮ → **App installieren** / **Zum Startbildschirm**.

Fertig. Beim nächsten Öffnen lädt die App sofort, funktioniert offline, und die
Wartezeiten an Batrovci/Gradina stehen automatisch drin (grün/gelb/rot + „Stand HH:MM").

---

## Gut zu wissen / Feinheiten
- **Nur serbische Grenzen automatisch:** AMSS veröffentlicht nur die serbische Seite.
  Darum kommen Auto-Zahlen nur für **Batrovci** und **Gradina** — genau die zwei Engstellen.
  Karawanken, Bregana, Kapıkule bleiben manuell (antippen) oder über den KI-Button.
- **Manuell schlägt Auto:** Tippst du den Status-Punkt selbst, gilt dein Wert. Nochmal
  durchtippen bis „Status setzen" → wieder automatisch.
- **Wenn AMSS mal die Formulierung ändert**, kann der Parser in `scripts/fetch-wait.mjs`
  eine Kleinigkeit brauchen. Schick mir dann den Inhalt von `data/wait-times.json`
  (oder eine AMSS-Textzeile), ich passe das Muster an.
- **App aktualisieren:** Lädst du später eine neue `index.html` hoch, holt der Service
  Worker sie beim nächsten Start automatisch (Version in `sw.js` hochzählen erzwingt das).
- **iPhone-Icon:** SVG klappt meist; falls iOS doch ein Vorschaubild nimmt, sag Bescheid,
  dann lege ich zusätzlich ein PNG-Icon bei.
