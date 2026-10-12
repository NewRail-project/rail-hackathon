# NewRail · Rail Hackathon

Single-page app (KZ8A-styled UI) on Firebase Auth + Firestore.

- `index.html` — готовое приложение, весь CSS и JS внутри (его достаточно для запуска/GitHub Pages)
- `css/style.css`, `css/newrail-adapter.css` — исходники стилей (справочно; уже встроены в index.html)

## Запуск
1. В `index.html` вставьте свой `firebaseConfig`.
2. Откройте через локальный сервер (ES-модули не работают с file://):
   `python3 -m http.server 8000` → http://localhost:8000
3. Firestore: коллекция `tasks` (`title`, `meta`, `status`: waiting | progress | done).
