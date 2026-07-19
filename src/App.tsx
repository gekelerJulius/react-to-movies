import React, { JSX } from 'react';
import './App.css';
import MoviePagination from './components/movie-pagination';

function App(): JSX.Element {
  return (
    <div className="App">
      <header className="App-header">
        <h1>🎬 Movie Explorer</h1>
        <p>Discover your next favorite film</p>
      </header>
      <MoviePagination />
    </div>
  );
}

export default App;
