import React, { Component, JSX } from 'react';
import './movie-pagination.css';
import { Genre } from '../types/genre';
import GenreList from './genre-list';
import { DiscoverResults } from '../types/discover-results';
import { MovieInfo } from '../types/movie-info';
import MovieDetails from './movie-details';
import { MovieService } from '../api/movie-service';
import MovieGrid from './movie-grid';
import MovieFilters, { Filters } from './movie-filters';
import ReactPaginate from 'react-paginate';

const DETAILS_APPEND = 'credits,videos,watch/providers,similar';

class MoviePagination extends Component {
  state: {
    discoverResults: DiscoverResults | undefined;
    detailMovieInfo: MovieInfo | undefined;
    genres: Genre[];
    activeGenreIds: number[];
    filters: Filters;
  };
  constructor(props: any) {
    super(props);
    this.state = {
      discoverResults: undefined,
      detailMovieInfo: undefined,
      genres: [],
      activeGenreIds: [],
      filters: { query: '', sortBy: 'popularity.desc', minRating: 0 },
    };
  }

  fetchResults = (page: number = 1): void => {
    const { query, sortBy, minRating } = this.state.filters;
    const request = query
      ? MovieService.searchMovies({ query, page })
      : MovieService.discover({
          withGenres: this.state.activeGenreIds,
          sort_by: sortBy,
          minRating,
          page,
        });
    request.then((discoverResults: DiscoverResults) => this.setState({ discoverResults }));
  };

  updateDetailMovieInfo = (movieInfo: MovieInfo | undefined): void => {
    this.setState({ detailMovieInfo: movieInfo });
  };

  selectMovie = (movieId: number): void => {
    if (this.state.detailMovieInfo?.id === movieId) {
      this.updateDetailMovieInfo(undefined);
      return;
    }
    MovieService.getMovieDetails(movieId, { append_to_response: DETAILS_APPEND }).then((movieInfo) =>
      this.updateDetailMovieInfo(movieInfo),
    );
  };

  updateActiveGenreIds = (genreIds: number[]): void => {
    this.setState({ activeGenreIds: genreIds }, () => this.fetchResults());
  };

  updateFilters = (filters: Partial<Filters>): void => {
    this.setState({ filters: { ...this.state.filters, ...filters } }, () => this.fetchResults());
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
        <MovieFilters filters={this.state.filters} updateFilters={this.updateFilters} />

        <GenreList
          genres={this.state.genres}
          activeGenreIds={this.state.activeGenreIds}
          updateActiveGenreIds={this.updateActiveGenreIds}
        />

        <MovieDetails
          movieInfo={this.state.detailMovieInfo}
          updateDetailMovieInfo={this.updateDetailMovieInfo}
          selectMovie={this.selectMovie}
        />

        <MovieGrid
          discoverResults={this.state.discoverResults}
          detailMovieInfo={this.state.detailMovieInfo}
          selectMovie={this.selectMovie}
        />

        <ReactPaginate
          className={'pagination no-bullets'}
          pageClassName={'page-item'}
          activeClassName={'active-page'}
          pageCount={this.state.discoverResults?.total_pages ?? 0}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          renderOnZeroPageCount={null}
          onPageChange={(data) => this.fetchResults(data.selected + 1)}
        />
      </div>
    );
  }
}

export default MoviePagination;
