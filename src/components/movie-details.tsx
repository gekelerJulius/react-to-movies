import { Component, JSX } from 'react';
import './movie-details.css';
import { MovieInfo } from '../types/movie-info';
import { YoutubeService } from '../api/youtube-service';
import YouTube, { YouTubePlayer } from 'react-youtube';

interface MovieDetailsProps {
  movieInfo: MovieInfo | undefined;
  updateDetailMovieInfo: (movieInfo: MovieInfo | undefined) => void;
}

let videoElement: YouTubePlayer | null = null;

class MovieDetails extends Component<MovieDetailsProps> {
  state: { music_video_id: string; playing: boolean };
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
    this.state = { music_video_id: '', playing: false };
  }

  async componentDidMount(): Promise<void> {
    setInterval(async () => {
      if (videoElement) {
        const state = await videoElement.getPlayerState();
        this.setState({ ...this.state, playing: state === 1 });
      }
    }, 200);
  }

  async componentDidUpdate(
    prevProps: Readonly<MovieDetailsProps>,
    prevState: Readonly<{}>,
    snapshot?: any,
  ): Promise<void> {
    if (!this.props.movieInfo && prevProps.movieInfo !== this.props.movieInfo) {
      // Stop the video if the movieInfo is undefined
      this.setState({ ...this.state, music_video_id: '' });
    }
    if (this.props.movieInfo && prevProps.movieInfo !== this.props.movieInfo) {
      const vidId = await YoutubeService.search(this.props.movieInfo.title + ' song');
      this.setState({ ...this.state, music_video_id: vidId });
    }
  }

  render(): JSX.Element {
    return (
      <div
        className={this.props.movieInfo ? 'movie-grid-item-detail' : 'inactive'}
        onClick={() => this.props.updateDetailMovieInfo(undefined)}
      >
        <div className="movie-grid-item-detail-title opaque-background">{this.props.movieInfo?.title}</div>

        {this.state.music_video_id ? (
          <>
            <YouTube
              videoId={this.state.music_video_id} // defaults -> ''
              className={'movie-grid-item-detail-video'}
              opts={this.playerOpts}
              onReady={(event) => {
                videoElement = event.target;
                videoElement?.playVideo();
              }}
            />
            <div
              className="music-video-control-button"
              onClick={(event) => {
                event.stopPropagation();
                if (videoElement) {
                  if (this.state.playing) {
                    videoElement?.pauseVideo();
                    this.setState({ ...this.state, playing: false });
                  } else {
                    videoElement?.playVideo();
                    this.setState({ ...this.state, playing: true });
                  }
                }
              }}
            >
              {this.state.playing ? 'Pause' : 'Play'}
            </div>
          </>
        ) : (
          <div></div>
        )}

        <img
          className="movie-grid-item-detail-image"
          src={this.props.movieInfo ? `https://image.tmdb.org/t/p/w500${this.props.movieInfo.poster_path}` : ''}
          alt={this.props.movieInfo?.title}
        />
        <div className="movie-grid-item-detail-description opaque-background">{this.props.movieInfo?.overview}</div>
      </div>
    );
  }
}

export default MovieDetails;
