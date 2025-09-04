# 🚀 Space Invaders React

A modern, feature-rich Space Invaders game built with React.js, featuring stunning visuals, sound effects, and smooth animations.

![Space Invaders React](https://img.shields.io/badge/React-18.2.0-blue) ![Vite](https://img.shields.io/badge/Vite-4.4.5-646CFF) ![Framer Motion](https://img.shields.io/badge/Framer%20Motion-10.16.4-0055FF)

## ✨ Features

### 🎮 Gameplay
- **Classic Space Invaders mechanics** with modern React implementation
- **Progressive difficulty** - aliens get faster and bullets get slower each level
- **Collision detection** with precise hit boxes
- **Multiple game states** - Menu, Playing, Paused, Game Over
- **High score persistence** using localStorage

### 🎨 Visual Effects
- **Retro-futuristic design** with neon colors and glowing effects
- **Smooth animations** powered by Framer Motion
- **Particle explosion effects** when aliens are destroyed
- **Responsive design** that works on desktop, tablet, and mobile
- **Floating alien animations** for added visual appeal

### 🔊 Audio
- **Web Audio API** generated sound effects
- **Shooting sounds** for player and alien weapons
- **Explosion effects** when aliens are hit
- **Level completion fanfare**
- **Game over sound sequence**

### 📱 Controls
- **Keyboard controls**: Arrow keys to move, Spacebar to shoot, ESC to pause
- **Touch controls**: On-screen buttons for mobile devices
- **Mouse support**: Click and hold for mobile-style controls

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd space-invador
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to play the game!

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🎯 How to Play

1. **Start the game** by clicking "Start Game" on the main menu
2. **Move your ship** using the arrow keys or on-screen controls
3. **Shoot aliens** by pressing the spacebar or shoot button
4. **Avoid alien bullets** - they will destroy your ship!
5. **Clear all aliens** to advance to the next level
6. **Survive as long as possible** and try to beat your high score!

### Controls
- **Arrow Keys** / **Touch Controls**: Move left and right
- **Spacebar** / **Shoot Button**: Fire bullets
- **ESC**: Pause/Resume game

## 🛠️ Technical Details

### Architecture
- **React 18** with functional components and hooks
- **Vite** for fast development and building
- **Framer Motion** for smooth animations
- **Web Audio API** for sound generation
- **CSS3** with modern features like gradients and animations

### Key Components
- `Game.jsx` - Main game logic and state management
- `Ship.jsx` - Player ship component with animations
- `Alien.jsx` - Alien enemy component
- `Bullet.jsx` - Projectile component for both player and aliens
- `Particle.jsx` - Explosion particle effects
- `SoundManager.jsx` - Audio system using Web Audio API

### Game State Management
The game uses React's built-in state management with hooks:
- `useState` for game state, score, level, and objects
- `useEffect` for game loop and event listeners
- `useRef` for canvas references and animation frames
- `useCallback` for optimized function creation

## 🎨 Customization

### Styling
The game uses CSS custom properties and can be easily customized by modifying:
- `src/App.css` - Main styling and responsive design
- `src/components/Game.css` - Game-specific component styles

### Game Settings
Modify game difficulty and behavior in `src/components/Game.jsx`:
```javascript
const [gameSettings, setGameSettings] = useState({
  bulletSpeed: 4,              // Player bullet speed
  alienSpeedY: 0.2,            // Alien downward movement speed
  alienShootProbability: 0.002, // Chance aliens shoot each frame
  alienRows: 3,                // Number of alien rows
  alienCols: 6                 // Number of alien columns
});
```

### Sound Effects
Customize sounds in `src/components/SoundManager.jsx` by modifying the frequency, duration, and waveform parameters.

## 📱 Browser Support

- **Chrome** 60+
- **Firefox** 55+
- **Safari** 11+
- **Edge** 79+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Original Space Invaders game by Taito
- React team for the amazing framework
- Framer Motion for smooth animations
- Web Audio API for sound generation

## 🎮 Play Online

You can play the game online at: [Your Deployed URL]

---

**Enjoy the game and may the force be with you!** 🚀👾
