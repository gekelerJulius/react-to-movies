import React, { Component, JSX } from 'react';
import './movie-pagination.css';
import { Genre } from '../types/genre';
import GenreList from './genre-list';
import { DiscoverResults } from '../types/discover-results';
import { MovieInfo } from '../types/movie-info';
import MovieDetails from './movie-details';
import { MovieService } from '../api/movie-service';
import MovieGrid from './movie-grid';
import ReactPaginate from 'react-paginate';

class MoviePagination extends Component {
  state: {
    discoverResults: DiscoverResults | undefined;
    detailMovieInfo: MovieInfo | undefined;
    genres: Genre[];
    activeGenreIds: number[];
  };
  constructor(props: any) {
    super(props);
    this.state = {
      discoverResults: undefined,
      detailMovieInfo: undefined,
      genres: [],
      activeGenreIds: [],
    };
  }

  updateDetailMovieInfo = (movieInfo: MovieInfo | undefined): void => {
    this.setState({
      ...this.state,
      detailMovieInfo: movieInfo,
    });
  };

  updateActiveGenreIds = (genreIds: number[]): void => {
    this.setState({
      ...this.state,
      activeGenreIds: genreIds,
    });

    MovieService.discover({
      withGenres: genreIds,
    }).then((discoverResults: DiscoverResults) => {
      this.setState({
        ...this.state,
        discoverResults,
      });
    });
  };

  async componentDidMount(): Promise<void> {
    const promises: [Promise<DiscoverResults>, Promise<Genre[]>] = [MovieService.discover(), MovieService.getGenres()];
    const [discoverResults, genres]: Awaited<DiscoverResults | Genre[]>[] = await Promise.all(promises);
    this.setState({
      activeGenreIds: [],
      discoverResults,
      genres,
    });
  }

  render(): JSX.Element {
    return (
      <div className="movie-grid-container">
        <GenreList
          genres={this.state.genres}
          activeGenreIds={this.state.activeGenreIds}
          updateActiveGenreIds={this.updateActiveGenreIds}
        />

        <MovieDetails movieInfo={this.state.detailMovieInfo} updateDetailMovieInfo={this.updateDetailMovieInfo} />

        <MovieGrid
          discoverResults={this.state.discoverResults}
          detailMovieInfo={this.state.detailMovieInfo}
          updateDetailMovieInfo={this.updateDetailMovieInfo}
        />

        <ReactPaginate
          className={'pagination no-bullets'}
          pageClassName={'page-item'}
          activeClassName={'active-page'}
          pageCount={this.state.discoverResults?.total_pages ?? 0}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          renderOnZeroPageCount={null}
          onPageChange={(data) => {
            MovieService.discover({
              withGenres: this.state.activeGenreIds,
              page: data.selected + 1,
            }).then((discoverResults: DiscoverResults) => {
              this.setState({
                ...this.state,
                discoverResults,
              });
            });
          }}
        />
      </div>
    );
  }
}

export default MoviePagination;
