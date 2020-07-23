import AbstractSmartComponent from '../abstract-smart-component';
import {getTemplate as createFilmDetailsTemplate} from './template';
import {Code, UNDO_RATING} from '../../consts';
import {encode} from '../../utils/encode';

export default class FilmCardPopup extends AbstractSmartComponent {
  constructor(filmPopup) {
    super();

    this._filmPopup = filmPopup;
    this._emoji = null;
    this._commentText = null;
    this._elementsForBlock = [];

    this._onCloseBtnPopupMouseup = null;
    this._onLabelWatchlistMouseup = null;
    this._onLabelWatchedMouseup = null;
    this._onLabelFavoriteMouseup = null;
    this._onSendCommentPressEnter = null;
    this._onResetRatingMovieMouseup = null;
    this._onEmojiMouseup = null;
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._filmPopup, {
      isRated: !!this._filmPopup.userRating,
      isWatched: !!this._filmPopup.isWatched,
      isWatchlist: !!this._filmPopup.isWatchlist,
      isFavorite: !!this._filmPopup.isFavorite,
      userEmoji: this._emoji
    });
  }
  setOnCloseBtnPopupMouseup(handler) {
    this.getElement().querySelector(`.film-details__close-btn`)
      .addEventListener(`mouseup`, handler);

    this._onCloseBtnPopupMouseup = handler;
  }
  setOnLabelWatchlistMouseup(handler) {
    this.getElement().querySelector(`.film-details__control-label--watchlist`)
      .addEventListener(`mouseup`, handler);

    this._onLabelWatchlistMouseup = handler;

  }
  setOnLabelWatchedMouseup(handler) {
    this.getElement().querySelector(`.film-details__control-label--watched`)
      .addEventListener(`mouseup`, handler);

    this._onLabelWatchedMouseup = handler;
  }
  setOnLabelFavoriteMouseup(handler) {
    this.getElement().querySelector(`.film-details__control-label--favorite`)
      .addEventListener(`mouseup`, handler);

    this._onLabelFavoriteMouseup = handler;
  }
  setOnSendCommentPressEnter(handler) {
    this.getElement().addEventListener(`keyup`, (evt) => {
      evt.preventDefault();
      this._isCtrlCommandEnterPress(evt, handler);
    });

    this._onSendCommentPressEnter = handler;
  }
  setOnChangeRatingMovieMouseup(handler) {
    this._onResetRatingMovieMouseup = handler;

    if (this._filmPopup.isWatched) {
      this.getElement().querySelector(`.film-details__user-rating-score`)
        .addEventListener(`mouseup`, (evt) => {
          if (!evt.target.classList.contains(`film-details__user-rating-label`)) {
            return;
          }
          this._onResetRatingMovieMouseup(evt.target.textContent);
        });

      this.getElement().querySelector(`.film-details__watched-reset`)
        .addEventListener(`mouseup`, () => {
          this._onResetRatingMovieMouseup(UNDO_RATING);
        });
    }
  }
  setOnEmojiMouseup(handler) {
    this.getElement().querySelector(`.film-details__emoji-list`)
      .addEventListener(`change`, (evt) => {
        this._emoji = evt.target.value;
        this._commentText = this.getElement().querySelector(`.film-details__comment-input`).value;

        handler();
      });
    this._onEmojiMouseup = handler;
  }
  recoveryListeners() {
    this._subscribeOnEvents();
    this.getElement().querySelector(`.film-details__comment-input`).value = this._commentText;
  }
  disableForm() {
    const element = this.getElement();

    this._elementsForBlock = [...element.querySelectorAll(`.film-details__control-input`),
      element.querySelector(`.film-details__comment-input`),
      ...element.querySelectorAll(`.film-details__user-rating-input`)];

    this._elementsForBlock.forEach((item) => item.setAttribute(`disabled`, ``));
  }
  enableForm() {
    this._elementsForBlock.forEach((item) => item.removeAttribute(`disabled`));
  }
  _subscribeOnEvents() {
    this.setOnCloseBtnPopupMouseup(this._onCloseBtnPopupMouseup);
    this.setOnCloseBtnPopupMouseup(this._onCloseBtnPopupMouseup);
    this.setOnLabelWatchlistMouseup(this._onLabelWatchlistMouseup);
    this.setOnLabelWatchedMouseup(this._onLabelWatchedMouseup);
    this.setOnLabelFavoriteMouseup(this._onLabelFavoriteMouseup);
    this.setOnSendCommentPressEnter(this._onSendCommentPressEnter);
    this.setOnChangeRatingMovieMouseup(this._onResetRatingMovieMouseup);
    this.setOnEmojiMouseup(this._onEmojiMouseup);
  }
  _onSendComment() {
    const text = this.getElement().querySelector(`.film-details__comment-input`);

    return {
      'comment': encode(text.value),
      'date': new Date(),
      'emotion': this._emoji,
    };
  }
  _isCtrlCommandEnterPress(evt, handler) {
    if (evt.key === Code.ENTER && evt.ctrlKey || evt.key === Code.ENTER && evt.metaKey) {
      handler(this._onSendComment());
    }
  }

}
