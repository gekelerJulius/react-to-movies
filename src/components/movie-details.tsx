import { Component, JSX } from 'react';
import './movie-details.css';
import { MovieInfo } from '../types/movie-info';
import { YoutubeService } from '../api/youtube-service';
import YouTube, { YouTubePlayer } from 'react-youtube';

interface MovieDetailsProps {
  movieInfo: MovieInfo | undefined;
  updateDetailMovieInfo: (movieInfo: MovieInfo | undefined) => void;
  selectMovie: (movieId: number) => void;
}

let musicVideoElement: YouTubePlayer | null = null;

function findTrailerId(movieInfo: MovieInfo | undefined): string {
  const videos = movieInfo?.videos?.results ?? [];
  const trailer = videos.find((v) => v.type === 'Trailer' && v.site === 'YouTube');
  return trailer?.key ?? '';
}

class MovieDetails extends Component<MovieDetailsProps> {
  state: { music_video_id: string };
  playerOpts: { playerVars: { autoplay: 0 | 1 | undefined }; width: string; height: string } = {
    height: '390',
    width: '640',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };
  constructor(props: MovieDetailsProps) {
    super(props);
    this.state = { music_video_id: '' };
  }

  async componentDidUpdate(prevProps: Readonly<MovieDetailsProps>): Promise<void> {
    if (!this.props.movieInfo && prevProps.movieInfo !== this.props.movieInfo) {
      this.setState({ music_video_id: '' });
    }
    if (this.props.movieInfo && prevProps.movieInfo?.id !== this.props.movieInfo.id) {
      const musicVidId = await YoutubeService.search(this.props.movieInfo.title + ' song');
      this.setState({ music_video_id: musicVidId });
    }
  }

  render(): JSX.Element {
    const movieInfo = this.props.movieInfo;
    const trailerId = findTrailerId(movieInfo);
    const cast = movieInfo?.credits?.cast.slice(0, 10) ?? [];
    const similar = movieInfo?.similar?.results.slice(0, 12) ?? [];
    const usProviders = movieInfo?.['watch/providers']?.results?.US;
    const providers = [
      ...(usProviders?.flatrate ?? []),
      ...(usProviders?.rent ?? []),
      ...(usProviders?.buy ?? []),
    ];

    return (
      <div
        className={movieInfo ? 'movie-grid-item-detail' : 'inactive'}
        onClick={() => this.props.updateDetailMovieInfo(undefined)}
      >
        <div className="movie-grid-item-detail-content" onClick={(event) => event.stopPropagation()}>
          <button className="movie-grid-item-detail-close" onClick={() => this.props.updateDetailMovieInfo(undefined)}>
            ✕
          </button>

          <div className="movie-grid-item-detail-title">
            {movieInfo?.title}
            {movieInfo?.release_date && (
              <span className="movie-grid-item-detail-year"> ({movieInfo.release_date.slice(0, 4)})</span>
            )}
          </div>

          {movieInfo && movieInfo.vote_average > 0 && (
            <div className="movie-grid-item-detail-rating">★ {movieInfo.vote_average.toFixed(1)} / 10</div>
          )}

          <div className={'poster-videos-flex'}>
            {this.state.music_video_id && (
              <YouTube
                videoId={this.state.music_video_id}
                className={'movie-grid-item-detail-music-video'}
                opts={this.playerOpts}
                onReady={(event) => {
                  musicVideoElement = event.target;
                  musicVideoElement?.playVideo();
                }}
              />
            )}

            <img
              className="movie-grid-item-detail-image"
              src={movieInfo ? `https://image.tmdb.org/t/p/w500${movieInfo.poster_path}` : ''}
              alt={movieInfo?.title}
            />

            {trailerId && (
              <YouTube videoId={trailerId} className={'movie-grid-item-detail-trailer-video'} opts={this.playerOpts} />
            )}
          </div>

          <div className="movie-grid-item-detail-description">{movieInfo?.overview}</div>

          {providers.length > 0 && (
            <div className="movie-detail-section">
              <h3>Where to Watch</h3>
              <div className="movie-detail-providers">
                {providers.map((provider) => (
                  <img
                    key={provider.provider_id}
                    className="movie-detail-provider-logo"
                    src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                    alt={provider.provider_name}
                    title={provider.provider_name}
                  />
                ))}
              </div>
            </div>
          )}

          {cast.length > 0 && (
            <div className="movie-detail-section">
              <h3>Cast</h3>
              <div className="movie-detail-cast">
                {cast.map((member) => (
                  <div className="movie-detail-cast-member" key={member.id}>
                    <img
                      className="movie-detail-cast-photo"
                      src={
                        member.profile_path
                          ? `https://image.tmdb.org/t/p/w185${member.profile_path}`
                          : 'https://placehold.co/92x138?text=%20'
                      }
                      alt={member.name}
                    />
                    <div className="movie-detail-cast-name">{member.name}</div>
                    <div className="movie-detail-cast-character">{member.character}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {similar.length > 0 && (
            <div className="movie-detail-section">
              <h3>Similar Movies</h3>
              <div className="movie-detail-similar">
                {similar.map((movie) => (
                  <img
                    key={movie.id}
                    className="movie-detail-similar-poster"
                    src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                    alt={movie.title}
                    title={movie.title}
                    onClick={() => this.props.selectMovie(movie.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default MovieDetails;
