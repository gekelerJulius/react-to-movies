import { Component, JSX } from "react";
import { Genre } from "../types/genre";
import "./genre-list.css";

interface GenreListProps {
  genres: Genre[];
  activeGenreIds: number[];
  updateActiveGenreIds: (genreIds: number[]) => void;
}

class GenreList extends Component<GenreListProps> {
  render(): JSX.Element {
    return (
      <div className="genre-list">
        {this.props.genres.map((genre) => (
          <span
            className={`genre-item ${
              this.props.activeGenreIds.includes(genre.id) ? "active" : ""
            }`}
            key={genre.id}
            onClick={() => {
              const activeGenreIds = this.props.activeGenreIds;
              const index = activeGenreIds.indexOf(genre.id);
              if (index > -1) {
                activeGenreIds.splice(index, 1);
              } else {
                activeGenreIds.push(genre.id);
              }
              this.props.updateActiveGenreIds(activeGenreIds);
            }}
          >
            {genre.name}
          </span>
        ))}
      </div>
    );
  }
}

export default GenreList;
