import React, { JSX } from 'react';
import './App.css';
import MoviePagination from './components/movie-pagination';

function App(): JSX.Element {
  return (
    <div className="App">
      <header className="App-header">
        <MoviePagination />
      </header>
    </div>
  );
}

export default App;
