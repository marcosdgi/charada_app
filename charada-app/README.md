# 2048 Puzzle Game

A classic 2048 puzzle game built with React Native and Expo.

## 🎮 About

2048 is a sliding block puzzle game where you combine numbered tiles to create a tile with the number 2048. Swipe to move tiles, when two tiles with the same number touch, they merge into one!

### How to Play

- **Swipe** up, down, left, or right to move all tiles
- When two tiles with the same number touch, they **merge into one**
- After each move, a new tile appears randomly
- **Goal**: Create a tile with the number 2048
- **Game Over**: When no more moves are possible

## 📱 Technologies

- **Expo 54** - React Native framework
- **React Native 0.81** - Native engine
- **TypeScript** - Type-safe development
- **React Native Reanimated** - Smooth animations
- **React Native Gesture Handler** - Touch gestures

## 🗂️ Project Structure

```
puzzle-2048/
├── app/                      # Routes (Expo Router)
│   ├── index.tsx            # Main menu
│   └── (game)/              # Game screens
│       └── play.tsx         # 2048 game screen
│
├── components/              # Reusable components
│   ├── ui/                 # UI components
│   └── game2048/           # 2048 game components
│       ├── Game2048.tsx    # Main game component
│       ├── Board2048.tsx   # Game board
│       └── Tile2048.tsx    # Tile component
│
└── hooks/                  # Custom hooks
    └── use2048.ts          # Game logic hook
```

## 🚀 Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on specific platform
npm run android
npm run ios
npm run web
```

## 📦 Features

- ✅ Smooth swipe gestures
- ✅ Beautiful animations
- ✅ Score tracking
- ✅ Best score persistence
- ✅ Responsive design
- ✅ Cross-platform (iOS, Android, Web)

## 🎯 Game Features

- Swipe-based controls
- Animated tile movements
- Score system with best score
- Game over detection
- Win detection (2048 tile)
- New game option

## 📄 License

MIT
