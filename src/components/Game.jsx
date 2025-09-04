import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Ship from './Ship';
import Alien from './Alien';
import Bullet from './Bullet';
import Particle from './Particle';
import { useSound } from './SoundManager';
import './Game.css';

const GAME_STATES = {
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'game_over'
};

const Game = () => {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const { playSound } = useSound();
  const [gameState, setGameState] = useState(GAME_STATES.MENU);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [highScore, setHighScore] = useState(0);
  const [particles, setParticles] = useState([]);

  // Game objects
  const [ship, setShip] = useState({
    x: 225, // canvas.width / 2 - 15
    y: 580, // canvas.height - 60
    width: 30,
    height: 30,
    speed: 5
  });

  const [bullets, setBullets] = useState([]);
  const [alienBullets, setAlienBullets] = useState([]);
  const [aliens, setAliens] = useState([]);

  // Game settings
  const [gameSettings, setGameSettings] = useState({
    bulletSpeed: 4,
    alienSpeedY: 0.2,
    alienShootProbability: 0.002,
    alienRows: 3,
    alienCols: 6
  });

  // Input handling
  const [keys, setKeys] = useState({
    left: false,
    right: false,
    shoot: false
  });

  // Initialize high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('spaceInvadersHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  // Create aliens
  const createAliens = useCallback(() => {
    const newAliens = [];
    for (let r = 0; r < gameSettings.alienRows; r++) {
      for (let c = 0; c < gameSettings.alienCols; c++) {
        newAliens.push({
          id: `${r}-${c}`,
          x: 60 + c * 60,
          y: 30 + r * 50,
          width: 30,
          height: 30,
          alive: true
        });
      }
    }
    setAliens(newAliens);
  }, [gameSettings.alienRows, gameSettings.alienCols]);

  // Initialize game
  useEffect(() => {
    if (gameState === GAME_STATES.PLAYING) {
      createAliens();
    }
  }, [gameState, createAliens]);

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== GAME_STATES.PLAYING) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          setKeys(prev => ({ ...prev, left: true }));
          break;
        case 'ArrowRight':
          setKeys(prev => ({ ...prev, right: true }));
          break;
        case ' ':
          e.preventDefault();
          setKeys(prev => ({ ...prev, shoot: true }));
          break;
        case 'Escape':
          setGameState(GAME_STATES.PAUSED);
          break;
      }
    };

    const handleKeyUp = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          setKeys(prev => ({ ...prev, left: false }));
          break;
        case 'ArrowRight':
          setKeys(prev => ({ ...prev, right: false }));
          break;
        case ' ':
          setKeys(prev => ({ ...prev, shoot: false }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  // Game loop
  useEffect(() => {
    if (gameState !== GAME_STATES.PLAYING) return;

    const gameLoop = () => {
      // Move ship
      setShip(prevShip => {
        let newX = prevShip.x;
        if (keys.left && newX > 0) {
          newX -= prevShip.speed;
        }
        if (keys.right && newX < 450) { // canvas.width - ship.width
          newX += prevShip.speed;
        }
        return { ...prevShip, x: newX };
      });

      // Handle shooting
      if (keys.shoot) {
        setBullets(prevBullets => {
          if (prevBullets.length < 5) {
            playSound('shoot');
            const newBullet = {
              id: Date.now() + Math.random(),
              x: ship.x + ship.width / 2 - 2,
              y: ship.y,
              width: 4,
              height: 10,
              speed: gameSettings.bulletSpeed
            };
            return [...prevBullets, newBullet];
          }
          return prevBullets;
        });
        setKeys(prev => ({ ...prev, shoot: false }));
      }

      // Move bullets
      setBullets(prevBullets => 
        prevBullets
          .map(bullet => ({ ...bullet, y: bullet.y - bullet.speed }))
          .filter(bullet => bullet.y > 0)
      );

      // Move alien bullets
      setAlienBullets(prevBullets => 
        prevBullets
          .map(bullet => ({ ...bullet, y: bullet.y + 3 }))
          .filter(bullet => bullet.y < 640) // canvas.height
      );

      // Alien shooting
      setAlienBullets(prevBullets => {
        const newBullets = [...prevBullets];
        aliens.forEach(alien => {
          if (alien.alive && Math.random() < gameSettings.alienShootProbability) {
            playSound('alienShoot');
            newBullets.push({
              id: Date.now() + Math.random(),
              x: alien.x + alien.width / 2,
              y: alien.y + alien.height,
              width: 4,
              height: 10,
              speed: 3
            });
          }
        });
        return newBullets;
      });

      // Move aliens down
      setAliens(prevAliens => 
        prevAliens.map(alien => 
          alien.alive ? { ...alien, y: alien.y + gameSettings.alienSpeedY } : alien
        )
      );

      // Collision detection - bullets vs aliens
      setBullets(prevBullets => {
        const remainingBullets = [...prevBullets];
        const bulletsToRemove = [];
        const aliensToUpdate = [];
        let scoreToAdd = 0;
        
        remainingBullets.forEach((bullet, bulletIndex) => {
          aliens.forEach((alien, alienIndex) => {
            if (alien.alive &&
                bullet.x < alien.x + alien.width &&
                bullet.x + bullet.width > alien.x &&
                bullet.y < alien.y + alien.height &&
                bullet.y + bullet.height > alien.y) {
              // Collision detected
              console.log('Collision detected!', { bullet, alien, bulletIndex, alienIndex });
              bulletsToRemove.push(bulletIndex);
              aliensToUpdate.push(alienIndex);
              scoreToAdd += 10;
              playSound('explosion');
              
              // Add explosion particles
              setParticles(prevParticles => [
                ...prevParticles,
                ...Array.from({ length: 8 }, (_, i) => ({
                  id: Date.now() + Math.random() + i,
                  x: alien.x + alien.width / 2,
                  y: alien.y + alien.height / 2,
                  vx: (Math.random() - 0.5) * 4,
                  vy: (Math.random() - 0.5) * 4,
                  life: 30,
                  maxLife: 30
                }))
              ]);
            }
          });
        });
        
        // Update score
        if (scoreToAdd > 0) {
          setScore(prevScore => prevScore + scoreToAdd);
        }
        
        // Update aliens
        if (aliensToUpdate.length > 0) {
          setAliens(prevAliens => 
            prevAliens.map((alien, index) => 
              aliensToUpdate.includes(index) ? { ...alien, alive: false } : alien
            )
          );
        }
        
        // Remove bullets that hit aliens (sort indices in descending order to maintain correct indices)
        bulletsToRemove.sort((a, b) => b - a);
        bulletsToRemove.forEach(index => {
          remainingBullets.splice(index, 1);
        });
        
        return remainingBullets;
      });

      // Collision detection - alien bullets vs ship
      setAlienBullets(prevBullets => {
        const remainingBullets = [...prevBullets];
        remainingBullets.forEach((bullet, index) => {
          if (bullet.x < ship.x + ship.width &&
              bullet.x + bullet.width > ship.x &&
              bullet.y < ship.y + ship.height &&
              bullet.y + bullet.height > ship.y) {
            // Ship hit
            playSound('gameOver');
            setGameState(GAME_STATES.GAME_OVER);
            if (score > highScore) {
              setHighScore(score);
              localStorage.setItem('spaceInvadersHighScore', score.toString());
            }
            remainingBullets.splice(index, 1);
          }
        });
        return remainingBullets;
      });

      // Check for level completion
      setAliens(prevAliens => {
        const aliveAliens = prevAliens.filter(alien => alien.alive);
        if (aliveAliens.length === 0) {
          // Level completed
          playSound('levelComplete');
          setLevel(prevLevel => prevLevel + 1);
          setGameSettings(prevSettings => ({
            ...prevSettings,
            alienSpeedY: prevSettings.alienSpeedY + 0.2,
            bulletSpeed: Math.max(2, prevSettings.bulletSpeed - 0.2)
          }));
          createAliens();
        }
        return prevAliens;
      });

      // Update particles
      setParticles(prevParticles => 
        prevParticles
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            life: particle.life - 1
          }))
          .filter(particle => particle.life > 0)
      );

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, keys, ship, gameSettings, aliens, score, highScore, createAliens]);

  const startGame = () => {
    setGameState(GAME_STATES.PLAYING);
    setScore(0);
    setLevel(1);
    setBullets([]);
    setAlienBullets([]);
    setParticles([]);
    setShip({
      x: 225,
      y: 580,
      width: 30,
      height: 30,
      speed: 5
    });
    setGameSettings({
      bulletSpeed: 4,
      alienSpeedY: 0.2,
      alienShootProbability: 0.002,
      alienRows: 3,
      alienCols: 6
    });
  };

  const resumeGame = () => {
    setGameState(GAME_STATES.PLAYING);
  };

  const endGame = () => {
    setGameState(GAME_STATES.GAME_OVER);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('spaceInvadersHighScore', score.toString());
    }
  };

  const resetGame = () => {
    setGameState(GAME_STATES.MENU);
  };

  return (
    <div className="game-container">
      <canvas
        ref={canvasRef}
        className="game-canvas"
        width={480}
        height={640}
      />
      
      {/* Scoreboard */}
      <div className="scoreboard">
        Score: {score} | Level: {level} | High: {highScore}
      </div>

      {/* Game Controls */}
      <div className="game-controls">
        {gameState === GAME_STATES.PLAYING && (
          <button className="control-btn" onClick={endGame}>
            End Game
          </button>
        )}
        {gameState === GAME_STATES.PAUSED && (
          <button className="control-btn" onClick={resumeGame}>
            Resume
          </button>
        )}
      </div>

      {/* Mobile Controls */}
      <div className="mobile-controls">
        <div 
          className="mobile-btn"
          onTouchStart={() => setKeys(prev => ({ ...prev, left: true }))}
          onTouchEnd={() => setKeys(prev => ({ ...prev, left: false }))}
          onMouseDown={() => setKeys(prev => ({ ...prev, left: true }))}
          onMouseUp={() => setKeys(prev => ({ ...prev, left: false }))}
        >
          ⬅️
        </div>
        <div 
          className="mobile-btn"
          onTouchStart={() => setKeys(prev => ({ ...prev, shoot: true }))}
          onTouchEnd={() => setKeys(prev => ({ ...prev, shoot: false }))}
          onMouseDown={() => setKeys(prev => ({ ...prev, shoot: true }))}
          onMouseUp={() => setKeys(prev => ({ ...prev, shoot: false }))}
        >
          🔼
        </div>
        <div 
          className="mobile-btn"
          onTouchStart={() => setKeys(prev => ({ ...prev, right: true }))}
          onTouchEnd={() => setKeys(prev => ({ ...prev, right: false }))}
          onMouseDown={() => setKeys(prev => ({ ...prev, right: true }))}
          onMouseUp={() => setKeys(prev => ({ ...prev, right: false }))}
        >
          ➡️
        </div>
      </div>

      {/* Game States */}
      <AnimatePresence>
        {gameState === GAME_STATES.MENU && (
          <motion.div
            className="game-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h1 className="game-title">SPACE INVADERS</h1>
            <button className="menu-btn" onClick={startGame}>
              Start Game
            </button>
            <div style={{ color: '#00ffff', marginTop: '20px', textAlign: 'center' }}>
              <p>Use arrow keys to move</p>
              <p>Spacebar to shoot</p>
              <p>ESC to pause</p>
            </div>
          </motion.div>
        )}

        {gameState === GAME_STATES.PAUSED && (
          <motion.div
            className="game-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h1 className="game-title">PAUSED</h1>
            <button className="menu-btn" onClick={resumeGame}>
              Resume
            </button>
            <button className="menu-btn" onClick={resetGame}>
              Main Menu
            </button>
          </motion.div>
        )}

        {gameState === GAME_STATES.GAME_OVER && (
          <motion.div
            className="game-over"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2>GAME OVER</h2>
            <div className="final-score">Final Score: {score}</div>
            <button className="menu-btn" onClick={resetGame}>
              Play Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Objects */}
      {gameState === GAME_STATES.PLAYING && (
        <>
          <Ship ship={ship} />
          {aliens.map(alien => (
            <Alien key={alien.id} alien={alien} />
          ))}
          {bullets.map(bullet => (
            <Bullet key={bullet.id} bullet={bullet} type="player" />
          ))}
          {alienBullets.map(bullet => (
            <Bullet key={bullet.id} bullet={bullet} type="alien" />
          ))}
          {particles.map(particle => (
            <Particle key={particle.id} particle={particle} />
          ))}
        </>
      )}
    </div>
  );
};

export default Game;
