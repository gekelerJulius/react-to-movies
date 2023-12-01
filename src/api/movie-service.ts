import { MovieInfo } from '../types/movie-info';
import { Genre } from '../types/genre';
import { DiscoverResults } from '../types/discover-results';

const API_KEY = '11c1d555cf2a5cc032d398dec45af73d';
const apiUrlPre = 'https://api.themoviedb.org/3/';
const imageUrlPre = 'https://image.tmdb.org/t/p/';

export interface MovieDiscoverOptions {
  minReleaseDate?: Date;
  maxReleaseDate?: Date;
  minRating?: number;
  maxRating?: number;
  minRatingCount?: number;
  maxRatingCount?: number;
  withGenres?: number[];
  page?: number;
}

function getDefaultMovieDiscoverOptions(): MovieDiscoverOptions {
  return {
    minReleaseDate: undefined,
    maxReleaseDate: undefined,
    minRating: 0,
    maxRating: 10,
    minRatingCount: 10,
    maxRatingCount: undefined,
    withGenres: undefined,
    page: 1,
  };
}

export class MovieService {
  static async getGenres(): Promise<Genre[]> {
    const url = `https://api.themoviedb.org/3/genre/movie/list?language=en-US&api_key=${API_KEY}`;
    const response: Response = await fetch(url);
    const res = await response.json();
    return res.genres;
  }

  static async getInfo(): Promise<MovieInfo> {
    const url: string = apiUrlPre + 'movie/11?api_key=' + API_KEY;
    const response: Response = await fetch(url);
    return await response.json();
  }

  static buildUrl(options: MovieDiscoverOptions = {}): string {
    options = { ...getDefaultMovieDiscoverOptions(), ...options };
    const {
      minReleaseDate,
      maxReleaseDate,
      minRating,
      maxRating,
      minRatingCount,
      maxRatingCount,
      withGenres,
      page,
    }: MovieDiscoverOptions = options;
    let url: string = `${apiUrlPre}discover/movie?api_key=${API_KEY}&language=en-US`;
    if (minReleaseDate) {
      url += `&primary_release_date.gte=${minReleaseDate}`;
    }
    if (maxReleaseDate) {
      url += `&primary_release_date.lte=${maxReleaseDate}`;
    }
    if (minRating) {
      url += `&vote_average.gte=${minRating}`;
    }
    if (maxRating) {
      url += `&vote_average.lte=${maxRating}`;
    }
    if (minRatingCount) {
      url += `&vote_count.gte=${minRatingCount}`;
    }
    if (maxRatingCount) {
      url += `&vote_count.lte=${maxRatingCount}`;
    }
    if (withGenres) {
      url += `&with_genres=${withGenres.join(',')}`;
    }
    if (page) {
      url += `&page=${page}`;
    }
    return url;
  }

  static async discover(options: MovieDiscoverOptions = {}): Promise<DiscoverResults> {
    const url: string = MovieService.buildUrl(options);
    const first_response: Response = await fetch(url);
    return await first_response.json();
  }

  static async getRandomMovie(options: MovieDiscoverOptions = {}): Promise<MovieInfo> {
    const first_data: DiscoverResults = await MovieService.discover(options);

    const pageNumber = Math.floor(Math.random() * Math.min(500, first_data.total_pages)) + 1;
    let url: string = MovieService.buildUrl(options) + `&page=${pageNumber}`;
    const response: Response = await fetch(url);
    const data: DiscoverResults = await response.json();
    return data.results[Math.floor(Math.random() * data.results.length)];
  }
}
