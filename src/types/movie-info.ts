export interface MovieInfo {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: null;
  budget: number;
  genres: any[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: unknown;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: unknown[];
  production_countries: unknown[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: unknown[];
  status: unknown;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  credits?: { cast: CastMember[]; crew: CrewMember[] };
  videos?: { results: Video[] };
  similar?: { results: MovieInfo[] };
  'watch/providers'?: WatchProviders;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string;
  order: number;
}

export interface Keyword {
  id: number;
  name: string;
}

export interface Video {
  id: string;
  key: string;
  type: string;
  site: string;
  published_at: string;
  duration: number;
}

export interface Review {
  id: number;
  author: {
    id: number;
    username: string;
    profile_path: string;
  };
  content: string;
  rating: number;
  helpful: number;
  created_at: string;
  updated_at: string;
}

export interface WatchProviderEntry {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export interface WatchProviderCountry {
  link: string;
  flatrate?: WatchProviderEntry[];
  rent?: WatchProviderEntry[];
  buy?: WatchProviderEntry[];
}

export interface WatchProviders {
  results: Record<string, WatchProviderCountry>;
}
