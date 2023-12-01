import React, { Component, JSX } from 'react';
import './movie-grid.css';
import { MovieInfo } from '../types/movie-info';
import { DiscoverResults } from '../types/discover-results';

interface MovieGridProps {
  discoverResults: DiscoverResults | undefined;
  detailMovieInfo: MovieInfo | undefined;
  updateDetailMovieInfo: (movieInfo: MovieInfo | undefined) => void;
}

class MovieGrid extends Component<MovieGridProps> {
  constructor(props: any) {
    super(props);
  }

  render(): JSX.Element {
    return (
      <div className="movie-grid" onClick={() => this.props.updateDetailMovieInfo(undefined)}>
        {this.props.discoverResults?.results.map((result) => (
          <div
            className="movie-grid-item"
            key={result.id}
            onClick={(event: React.MouseEvent<HTMLDivElement>) => {
              event.stopPropagation();
              this.props.updateDetailMovieInfo(this.props.detailMovieInfo?.id === result.id ? undefined : result);
            }}
          >
            <img
              className={'movie-grid-item-image'}
              src={`https://image.tmdb.org/t/p/w500${result.poster_path}`}
              alt={result.title}
            />
          </div>
        ))}
      </div>
    );
  }
}
export default MovieGrid;
