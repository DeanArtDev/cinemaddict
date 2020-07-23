import AbstractComponent from './abstract-component';
import {parseRuntime} from '../utils/common';
import {Limitation} from '../consts';

const ACTIVE_CLASS = `film-card__controls-item--active`;

const createFilmCardTemplate = (film, option) => {
  const {
    poster,
    movieName,
    rating,
    productionDate,
    duration,
    genres,
    description,
    comments} = film;
  const {
    isWatchlist,
    isWatched,
    isFavorite
  } = option;

  const updateDescription = description.length > Limitation.DESCRIPTION_SYMBOLS ?
    `${[...description].slice(0, Limitation.DESCRIPTION_SYMBOLS).join(``) + ` ...`}` :
    description;
  const date = new Date(productionDate).getFullYear();
  const genreMarkup = [...genres][0] ? `${[...genres][0]}` : ``;

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${movieName}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${date}</span>
        <span class="film-card__duration">${parseRuntime(duration)}</span>
        <span class="film-card__genre">${genreMarkup}</span>
      </p>
      <img src="${poster}" alt="Poster of movie" class="film-card__poster">
      <p class="film-card__description">${updateDescription}</p>
      <a class="film-card__comments">${comments.length} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${isWatchlist ? ACTIVE_CLASS : ``}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${isWatched ? ACTIVE_CLASS : ``}" type="button">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${isFavorite ? ACTIVE_CLASS : ``}" type="button">Mark as favorite</button>
      </form>
    </article>`
  );
};

export default class FilmCard extends AbstractComponent {
  constructor(film) {
    super();

    this._film = film;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film, {
      isWatchlist: this._film.isWatchlist,
      isWatched: this._film.isWatched,
      isFavorite: this._film.isFavorite});
  }
  setOnOpenMovieMouseup(handler) {
    this.getElement().querySelector(`.film-card__title`).addEventListener(`mouseup`, handler);
    this.getElement().querySelector(`.film-card__poster`).addEventListener(`mouseup`, handler);
    this.getElement().querySelector(`.film-card__comments`).addEventListener(`mouseup`, handler);
  }
  setOnBtnWatchlistMouseup(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`mouseup`, handler);
  }
  setOnBtnWatchedMouseup(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`mouseup`, handler);
  }
  setOnBtnFavoriteMouseup(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`mouseup`, handler);
  }
}
