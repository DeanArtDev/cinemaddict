import FilmCardComponent from '../components/film-card';
import FilmCardPopupComponent from '../components/film-card-popup/film-card-popup';
import CommentComponent from '../components/comment';
import MovieModule from '../moduls/movie';
import {render, remove, replace, RenderPosition} from '../utils/render';
import {Code, LoadingData, UNDO_RATING, ViewMode, HandlerLocker} from '../consts';

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._commentsContainer = null;

    this._film = null;
    this._filmCardComponent = null;
    this._filmCardPopupComponent = null;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._showedCommentControllers = [];

    this._isHandlerLocker = HandlerLocker.OFF;
    this._viewMode = ViewMode.DEFAULT;

    this._onDeleteButtonMouseup = this._onDeleteButtonMouseup.bind(this);
    this._onSendCommentKeyup = this._onSendCommentKeyup.bind(this);
    this._onSendCommentKeyup = this._onSendCommentKeyup.bind(this);
    this._onDocumentPressEsc = this._onDocumentPressEsc.bind(this);
    this._closePopup = this._closePopup.bind(this);
  }

  render(film) {
    this._film = film;

    const oldFilmComponent = this._filmCardComponent;
    const oldPopupComponent = this._filmCardPopupComponent;

    this._createFilmComponent();
    this._crateFilmPopupComponent();

    if (oldFilmComponent && oldPopupComponent) {
      replace(this._filmCardComponent, oldFilmComponent);

      this.setHandlerLocker(HandlerLocker.OFF);
      this.blockPopupForm();
      replace(this._filmCardPopupComponent, oldPopupComponent);
    } else {
      render(this._container, this._filmCardComponent, RenderPosition.BEFOREEND);
    }
  }
  renderPopup() {
    if (this._viewMode === ViewMode.DETAILS) {
      return;
    }

    this._onViewChange();
    this._crateFilmPopupComponent();
    render(document.body, this._filmCardPopupComponent, RenderPosition.BEFOREEND);
    document.addEventListener(`keyup`, this._onDocumentPressEsc);
  }
  setDefaultView() {
    if (this._viewMode !== ViewMode.DEFAULT) {
      this._filmCardPopupComponent.getElement().remove();
      this._filmCardPopupComponent.removeElement();
    }
  }
  destroy() {
    remove(this._filmCardComponent);
  }
  shake() {
    if (this._viewMode === ViewMode.DETAILS) {
      this._filmCardPopupComponent.shake();
    } else {
      this._filmCardComponent.shake();
    }
  }
  blockPopupForm() {
    this._filmCardPopupComponent.disableForm();
  }
  unblockPopupForm() {
    this._filmCardPopupComponent.enableForm();
  }
  setCommentViewDefault() {
    this._showedCommentControllers.forEach((comment) => comment.returnData());
  }
  setHandlerLocker(boolean) {
    this._isHandlerLocker = boolean;
  }
  resetPopupForm() {
    this._film.userRating = UNDO_RATING;
    this.render(this._film);
  }
  _createFilmComponent() {
    this._filmCardComponent = new FilmCardComponent(this._film);

    this._filmCardComponent.setOnOpenMovieMouseup((evt) => {
      evt.preventDefault();
      this.renderPopup();
      this._viewMode = ViewMode.DETAILS;
    });
    this._filmCardComponent.setOnBtnWatchlistMouseup((evt) => {
      evt.preventDefault();
      evt.stopPropagation();

      const newData = MovieModule.cloneMovie(this._film);
      newData.isWatchlist = !this._film.isWatchlist;

      this._onDataChange(this, this._film, newData);
    });
    this._filmCardComponent.setOnBtnWatchedMouseup((evt) => {
      evt.preventDefault();
      evt.stopPropagation();

      const newData = MovieModule.cloneMovie(this._film);
      newData.isWatched = !this._film.isWatched;

      this._onDataChange(this, this._film, newData);
    });
    this._filmCardComponent.setOnBtnFavoriteMouseup((evt) => {
      evt.preventDefault();
      evt.stopPropagation();

      const newData = MovieModule.cloneMovie(this._film);
      newData.isFavorite = !this._film.isFavorite;

      this._onDataChange(this, this._film, newData);
    });
  }
  _crateFilmPopupComponent() {
    this._filmCardPopupComponent = new FilmCardPopupComponent(this._film);

    this._commentsContainer = this._filmCardPopupComponent.getElement()
      .querySelector(`.film-details__comments-list`);
    this._createComments(this._film.comments);

    this._filmCardPopupComponent.setOnSendCommentPressEnter(this._onSendCommentKeyup);
    this._filmCardPopupComponent.setOnCloseBtnPopupMouseup((evt) => {
      evt.preventDefault();

      this._closePopup();
    });
    this._filmCardPopupComponent.setOnLabelWatchlistMouseup((evt) => {
      evt.preventDefault();

      if (this._isHandlerLocker) {
        return;
      }

      const newMovie = MovieModule.cloneMovie(this._film);
      newMovie.isWatchlist = !this._film.isWatchlist;
      this._onDataChange(this, this._film, newMovie);
    });
    this._filmCardPopupComponent.setOnLabelWatchedMouseup((evt) => {
      evt.preventDefault();

      if (this._isHandlerLocker) {
        return;
      }

      const newMovie = MovieModule.cloneMovie(this._film);
      newMovie.isWatched = !this._film.isWatched;
      newMovie.userRating = UNDO_RATING;
      this._onDataChange(this, this._film, newMovie);
    });
    this._filmCardPopupComponent.setOnLabelFavoriteMouseup((evt) => {
      evt.preventDefault();

      if (this._isHandlerLocker) {
        return;
      }
      const newMovie = MovieModule.cloneMovie(this._film);
      newMovie.isFavorite = !this._film.isFavorite;

      this._onDataChange(this, this._film, newMovie);
    });
    this._filmCardPopupComponent.setOnChangeRatingMovieMouseup((rating) => {
      if (this._isHandlerLocker) {
        return;
      }

      const newMovie = MovieModule.cloneMovie(this._film);
      newMovie.userRating = parseInt(rating, 10);

      this._onDataChange(this, this._film, newMovie);
    });
    this._filmCardPopupComponent.setOnEmojiMouseup(() => {
      if (this._isHandlerLocker) {
        return;
      }

      this._filmCardPopupComponent.rerender();
      this._commentsContainer = this._filmCardPopupComponent.getElement()
        .querySelector(`.film-details__comments-list`);
      this._createComments(this._film.comments);

      this._filmCardPopupComponent.getElement().scrollTop = document.body.scrollHeight;
    });
  }
  _createComments(comments) {
    this._showedCommentControllers = comments.map((comment) => {
      const commentController = new CommentComponent(comment);

      commentController.setOnDeleteBtnMouseup(this._onDeleteButtonMouseup);
      this._renderComments(commentController);

      return commentController;
    });
  }
  _renderComments(comment) {
    render(this._commentsContainer, comment, RenderPosition.BEFOREEND);
  }
  _onDeleteButtonMouseup(comment) {
    if (this._isHandlerLocker) {
      return;
    }

    comment.setData({deleteButtonText: LoadingData.deleteButtonText});
    this._onDataChange(this, comment._movieComment._id, null);
  }
  _onSendCommentKeyup(comment) {
    if (this._isHandlerLocker) {
      return;
    }

    this._onDataChange(this, null, comment);
  }
  _closePopup() {
    this._filmCardPopupComponent.getElement().remove();
    this._filmCardPopupComponent.removeElement();
    this._viewMode = ViewMode.DEFAULT;
    document.removeEventListener(`keyup`, this._onDocumentPressEsc);

  }
  _onDocumentPressEsc(evt) {
    this._isEscPress(evt);
  }
  _isEscPress(evt) {
    if (evt.key === Code.ESC) {
      this._closePopup();
    }
  }
}
