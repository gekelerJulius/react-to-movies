import { Component, JSX } from 'react';
import './movie-details.css';
import { MovieInfo } from '../types/movie-info';
import { YoutubeService } from '../api/youtube-service';
import YouTube, { YouTubePlayer } from 'react-youtube';

interface MovieDetailsProps {
  movieInfo: MovieInfo | undefined;
  updateDetailMovieInfo: (movieInfo: MovieInfo | undefined) => void;
}

let musicVideoElement: YouTubePlayer | null = null;
let trailerVideoElement: YouTubePlayer | null = null;

class MovieDetails extends Component<MovieDetailsProps> {
  state: { music_video_id: string; trailer_video_id: string };
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
    this.state = { music_video_id: '', trailer_video_id: '' };
  }

  async componentDidUpdate(
    prevProps: Readonly<MovieDetailsProps>,
    prevState: Readonly<{}>,
    snapshot?: any,
  ): Promise<void> {
    if (!this.props.movieInfo && prevProps.movieInfo !== this.props.movieInfo) {
      // Stop the video if the movieInfo is undefined
      this.setState({ music_video_id: '', trailer_video_id: '' });
    }
    if (this.props.movieInfo && prevProps.movieInfo !== this.props.movieInfo) {
      const musicVidId = await YoutubeService.search(this.props.movieInfo.title + ' song');
      const trailerVidId = await YoutubeService.search(this.props.movieInfo.title + ' trailer');
      this.setState({ ...this.state, music_video_id: musicVidId, trailer_video_id: trailerVidId });
    }
  }

  render(): JSX.Element {
    return (
      <div
        className={this.props.movieInfo ? 'movie-grid-item-detail' : 'inactive'}
        onClick={() => this.props.updateDetailMovieInfo(undefined)}
      >
        <div className="movie-grid-item-detail-title opaque-background">{this.props.movieInfo?.title}</div>

        <div className={'poster-videos-flex'}>
          {this.state.music_video_id ? (
            <>
              <YouTube
                videoId={this.state.music_video_id} // defaults -> ''
                className={'movie-grid-item-detail-music-video'}
                opts={this.playerOpts}
                onReady={(event) => {
                  musicVideoElement = event.target;
                  musicVideoElement?.playVideo();
                }}
              />
            </>
          ) : (
            <div></div>
          )}

          <img
            className="movie-grid-item-detail-image"
            src={this.props.movieInfo ? `https://image.tmdb.org/t/p/w500${this.props.movieInfo.poster_path}` : ''}
            alt={this.props.movieInfo?.title}
          />

          {this.state.trailer_video_id ? (
            <>
              <YouTube
                videoId={this.state.trailer_video_id} // defaults -> ''
                className={'movie-grid-item-detail-trailer-video'}
                opts={this.playerOpts}
                onReady={(event) => {
                  trailerVideoElement = event.target;
                  trailerVideoElement?.stopVideo();
                }}
              />
            </>
          ) : (
            <div></div>
          )}
        </div>
        <div className="movie-grid-item-detail-description opaque-background">{this.props.movieInfo?.overview}</div>
      </div>
    );
  }
}

export default MovieDetails;
