import React from 'react';
import Game from './components/Game';
import { SoundProvider } from './components/SoundManager';
import './App.css';

function App() {
  return (
    <div className="App">
      <SoundProvider>
        <Game />
      </SoundProvider>
    </div>
  );
}

export default App;