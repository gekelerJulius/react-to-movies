import React, { Component, JSX } from "react";
import "./movie-grid.css";
import { MovieInfo } from "../types/movie-info";
import { DiscoverResults } from "../types/discover-results";

interface MovieGridProps {
  discoverResults: DiscoverResults | undefined;
  detailMovieInfo: MovieInfo | undefined;
  selectMovie: (movieId: number) => void;
}

class MovieGrid extends Component<MovieGridProps> {
  constructor(props: any) {
    super(props);
  }

  render(): JSX.Element {
    return (
      <div className="movie-grid">
        {this.props.discoverResults?.results.map((result) => (
          <div
            className="movie-grid-item"
            key={result.id}
            onClick={(event: React.MouseEvent<HTMLDivElement>) => {
              event.stopPropagation();
              this.props.selectMovie(result.id);
            }}
          >
            <img
              className="movie-grid-item-image"
              src={`https://image.tmdb.org/t/p/w500${result.poster_path}`}
              alt={result.title}
            />
            {result.vote_average > 0 && (
              <div className="movie-grid-item-rating">★ {result.vote_average.toFixed(1)}</div>
            )}
            <div className="movie-grid-item-overlay">
              <div className="movie-grid-item-title">{result.title}</div>
              <div className="movie-grid-item-overview">{result.overview}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default MovieGrid;
