# 🧠 Memory Cards

A modern, dependency-free memory matching game built with Canvas and vanilla JavaScript.

🎮 **Play Online:** https://gamelabz.github.io/html5-game-memory-cards/

## 📸 Screenshot

![🧠 Memory Cards](assets/images/screenshot.png)

## 🎯 About

🧠 Memory Cards is a classic concentration game reimagined with a sleek, glassmorphic UI. Flip cards two at a time to find matching pairs — matched pairs stay revealed while mismatches flip back after a beat. Clear the whole board to win, and chase the fastest time on each difficulty. Three grid sizes keep it fresh for casual players and memory masters alike.

## 🕹️ Controls

- **Click / tap** a card to flip it.
- **Click / tap** a second card to reveal it and test for a match.
- **Difficulty** dropdown — switch between Easy (4×4), Hard (6×6), and Expert (8×8).
- **↻ New Game** — reshuffle and restart at any time.
- **Keyboard** — cards are real `<button>` elements, so they are fully focusable and operable with Tab + Enter/Space.

## ✨ Features

- Three difficulty levels: 4×4 (8 pairs), 6×6 (18 pairs), 8×8 (32 pairs).
- Live **timer** that starts on your first flip.
- **Move counter** tracking every pair you attempt.
- **Pair progress** indicator (matched / total).
- **Win detection** with a celebratory overlay summarizing your run.
- **Best time per difficulty** saved to `localStorage` with a 🏆 new-record flag.
- Dark **animated gradient background** (CSS keyframe drift + a decorative Canvas layer).
- **Glassmorphism** panels and cards with a smooth 3D flip animation.
- **Neon glow** on matched pairs; cohesive emoji card faces (no external images).
- Fully **self-contained** — no frameworks, no CDN, no network requests.

## 🚀 Run Locally

No installation required. Open the game directly in a browser:

```bash
# Option A: just open the file
open index.html

# Option B: serve it with a tiny static server
npx serve .
```

Then visit the printed URL (default `http://localhost:3000`).

## 🛠️ Tech Stack

- HTML5 `<canvas>` (decorative animated background)
- CSS3 (custom properties, flexbox, glassmorphism, 3D transforms)
- Vanilla JavaScript (ES2020, no frameworks)

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/my-idea`).
3. Commit your changes (`git commit -m "Add my idea"`).
4. Push to the branch (`git push origin feature/my-idea`).
5. Open a Pull Request.

Please keep the game dependency-free and test it in your browser before submitting.

## 📄 License

This project is licensed under the [MIT License](LICENSE) — a free and open-source license.

---

Let's Build Something Together 🚀
https://tally.so/r/q4q1L9
