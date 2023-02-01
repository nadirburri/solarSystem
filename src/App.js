import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import './App.css';

import PlanetContext from './PlanetContext';
import Canvas from './Canvas';
import PlanetCard from './PlanetCard'
import CanvasStars from './CanvasStars';
import GUI from './GUI';

function App() {
  return (
    <PlanetContext>
      <CanvasStars />
      <Canvas />
      <PlanetCard />
      <GUI />
    </PlanetContext>
  );
}

export default App;