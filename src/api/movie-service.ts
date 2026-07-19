import {
  MovieInfo,
  CastMember,
  CrewMember,
  Keyword,
  Video,
  Review,
  WatchProviders,
} from '../types/movie-info';
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
  sort_by?: string;
  primary_language?: string;
  with_runtime?: number;
}

export interface MovieSearchOptions {
  query?: string;
  page?: number;
  include_adult?: boolean;
  include_video?: boolean;
}

export interface TrendingOptions {
  period?: 'day' | 'week' | 'month' | 'year';
  page?: number;
}

export interface MovieDetailsOptions {
  append_to_response?: string;
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
    sort_by: 'popularity.desc',
    primary_language: undefined,
    with_runtime: undefined,
  };
}

export class MovieService {
  static async getGenres(): Promise<Genre[]> {
    const url = `https://api.themoviedb.org/3/genre/movie/list?language=en-US&api_key=${API_KEY}`;
    const response: Response = await fetch(url);
    const res = await response.json();
    return res.genres;
  }

  static async getInfo(movieId: number = 1): Promise<MovieInfo> {
    const url = `${apiUrlPre}movie/${movieId}?api_key=${API_KEY}`;
    const response: Response = await fetch(url);
    return await response.json();
  }

  static async getMovieDetails(
    movieId: number,
    options: MovieDetailsOptions = {}
  ): Promise<MovieInfo> {
    const { append_to_response = '' } = options;
    const url = `${apiUrlPre}movie/${movieId}?api_key=${API_KEY}${append_to_response ? `&append_to_response=${append_to_response}` : ''}`;
    const response: Response = await fetch(url);
    return await response.json();
  }

  static async getCast(movieId: number): Promise<CastMember[]> {
    const url = `${apiUrlPre}movie/${movieId}/credits?api_key=${API_KEY}`;
    const response: Response = await fetch(url);
    const res = await response.json();
    return res.cast;
  }

  static async getCrew(movieId: number): Promise<CrewMember[]> {
    const url = `${apiUrlPre}movie/${movieId}/credits?api_key=${API_KEY}`;
    const response: Response = await fetch(url);
    const res = await response.json();
    return res.crew;
  }

  static async getKeywords(movieId: number): Promise<Keyword[]> {
    const url = `${apiUrlPre}movie/${movieId}/keywords?api_key=${API_KEY}`;
    const response: Response = await fetch(url);
    const res = await response.json();
    return res.keywords;
  }

  static async getVideos(movieId: number): Promise<Video[]> {
    const url = `${apiUrlPre}movie/${movieId}/videos?api_key=${API_KEY}`;
    const response: Response = await fetch(url);
    const res = await response.json();
    return res.results;
  }

  static async getReviews(movieId: number): Promise<Review[]> {
    const url = `${apiUrlPre}movie/${movieId}/reviews?api_key=${API_KEY}`;
    const response: Response = await fetch(url);
    const res = await response.json();
    return res.results;
  }

  static async getWatchProviders(movieId: number): Promise<WatchProviders> {
    const url = `${apiUrlPre}movie/${movieId}/watch/providers?api_key=${API_KEY}`;
    const response: Response = await fetch(url);
    return await response.json();
  }

  static async getSimilarMovies(movieId: number): Promise<DiscoverResults> {
    const url = `${apiUrlPre}movie/${movieId}/similar?api_key=${API_KEY}`;
    const response: Response = await fetch(url);
    return await response.json();
  }

  static async searchMovies(options: MovieSearchOptions = {}): Promise<DiscoverResults> {
    const { query = '', page = 1, include_adult = false, include_video = false } = options;
    let url = `${apiUrlPre}search/movie?api_key=${API_KEY}&language=en-US&page=${page}`;
    if (query) url += `&query=${encodeURIComponent(query)}`;
    if (include_adult) url += `&include_adult=true`;
    if (include_video) url += `&include_video=true`;
    const response: Response = await fetch(url);
    return await response.json();
  }

  static async getTrendingMovies(options: TrendingOptions = {}): Promise<DiscoverResults> {
    const { period = 'week', page = 1 } = options;
    const url = `${apiUrlPre}trending/movie/${period}?api_key=${API_KEY}&page=${page}`;
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
      sort_by,
      primary_language,
      with_runtime,
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
    if (sort_by) {
      url += `&sort_by=${sort_by}`;
    }
    if (primary_language) {
      url += `&primary_language=${primary_language}`;
    }
    if (with_runtime) {
      url += `&with_runtime=${with_runtime}`;
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
