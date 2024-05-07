import React from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { Characters } from './components/Characters';
import { Episodes } from './components/Episodes';
import { Locations } from './components/Locations';

function App() {
  return (
    <div className="App">
      <Navigation />
      <Routes>
        <Route
          path="/"
          element={<Episodes />}
        />
        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />

        <Route
          path="/characters"
          element={<Characters />}
        />
        <Route
          path="/locations"
          element={<Locations />}
        />
      </Routes> 
      <Footer />
    </div>
  );
}

export default App;
