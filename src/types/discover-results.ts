import { MovieInfo } from './movie-info';

export interface DiscoverResults {
  page: number;
  results: MovieInfo[];
  total_pages: number;
  total_results: number;
}
