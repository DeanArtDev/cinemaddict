import MovieController from './movie-controller';
import FilmListMainComponent from '../components/film-list-main';
import ButtonShowMoreComponent from '../components/btn-show-more';
import FilmListTopRatedComponent from '../components/film-list-top-rated';
import FilmListTopCommComponent from '../components/film-list-top-comm';
import FilmNoDataComponent from '../components/film-no-data';
import SortComponent from '../components/sort';

import {remove, render, RenderPosition, replace} from '../utils/render';
import {SortType, Card, HandlerLocker, PreviewScreenText} from '../consts';
import Comment from '../moduls/comment';

const renderCards = (films, filmsList, onDataChange, onViewChange) => {
  return films.map((film) => {
    const movieController = new MovieController(filmsList, onDataChange, onViewChange);
    movieController.render(film);

    return movieController;
  });
};
const sortOnComments = (movies) => {
  const sortedMovies = movies
    .slice()
    .sort((min, max) => max[`comments`].length - min[`comments`].length)
    .slice(0, Card.MOST_COMM_QTY_CARDS);

  const total = sortedMovies.reduce((accum, item) => accum + item[`comments`].length, 0);

  return total === 0 ? null : sortedMovies;
};
const sortOnRating = (movies) => {
  const sortedMovies = movies
    .slice()
    .sort((min, max) => max[`rating`] - min[`rating`])
    .slice(0, Card.TOP_RATED_QTY_CARDS);
  const total = sortedMovies.reduce((accum, item) => accum + item[`rating`], 0);

  return total === 0 ? null : sortedMovies;
};

export default class PageController {
  constructor(container, moviesModel, api) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._api = api;

    this._showedMovieControllers = [];
    this._showedTopMovieControllers = [];
    this._showingCardCount = Card.LOAD_MORE_STEP;

    this._filmMainComponent = new FilmListMainComponent();
    this._filmListTopRatedComponent = new FilmListTopRatedComponent();
    this._filmListTopCommentComponent = new FilmListTopCommComponent();
    this._btnShowMoreComponent = new ButtonShowMoreComponent();
    this._sortComponent = new SortComponent();

    this._filmsListElement = this._filmMainComponent.getElement().querySelector(`.films-list__container`);
    this._filmsListTopCommElement = null;
    this._filmsListTopRatedElement = null;

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._moviesModel.setOnDataChange(this._onFilterChange);
  }

  render(network = true) {
    if (!network) {
      render(this._container.getElement(), new FilmNoDataComponent(PreviewScreenText.LOADING), RenderPosition.BEFOREEND);
      return;
    }

    this._container.getElement().innerHTML = ``;
    const movies = this._moviesModel.getMovies();

    if (movies.length <= 0) {
      render(this._container.getElement(), new FilmNoDataComponent(PreviewScreenText.NO_IN_DATABASE), RenderPosition.BEFOREEND);
      return;
    }

    render(this._container.getElement(), this._filmMainComponent, RenderPosition.AFTERBEGIN);

    this._sortComponent.setOnSortTypeChangeMouseup(this._onSortTypeChange);
    render(this._container.getElement(), this._sortComponent, RenderPosition.BEFOREBEGIN);
    this._updateMovies(Card.START_QTY_CARDS, movies);
  }
  hideSortComponent() {
    this._sortComponent.hide();
  }
  showSortComponent() {
    this._sortComponent.show();
  }
  _renderTopComments() {
    const sortedFilms = sortOnComments(this._moviesModel.getMovies());

    if (sortedFilms === null) {
      remove(this._filmListTopCommentComponent);
      return;
    }

    const oldFilmListTopCommentsComponent = this._filmListTopCommentComponent;
    this._filmListTopCommentComponent = new FilmListTopCommComponent();
    this._filmsListTopCommElement = this._filmListTopCommentComponent.getElement().querySelector(`.films-list__container`);

    if (oldFilmListTopCommentsComponent) {
      replace(this._filmListTopCommentComponent, oldFilmListTopCommentsComponent);
    }

    render(this._container.getElement(), this._filmListTopCommentComponent, RenderPosition.BEFOREEND);
    this._renderTopMovies(sortedFilms, this._filmsListTopCommElement, Card.MOST_COMM_QTY_CARDS);
  }
  _renderTopRated() {
    const sortedFilms = sortOnRating(this._moviesModel.getMovies());

    if (sortedFilms === null) {
      remove(this._filmListTopRatedComponent);
      return;
    }

    const oldFilmListTopCommentsComponent = this._filmListTopRatedComponent;
    this._filmListTopRatedComponent = new FilmListTopRatedComponent();
    this._filmsListTopRatedElement = this._filmListTopRatedComponent.getElement().querySelector(`.films-list__container`);

    if (oldFilmListTopCommentsComponent) {
      replace(this._filmListTopRatedComponent, oldFilmListTopCommentsComponent);
    }

    render(this._container.getElement(), this._filmListTopRatedComponent, RenderPosition.BEFOREEND);
    this._renderTopMovies(sortedFilms, this._filmsListTopRatedElement, Card.TOP_RATED_QTY_CARDS);
  }
  _updateMovies(count, updatedMovies = this._moviesModel.getMovies()) {
    this._removeMovies();
    this._renderMovies(count, updatedMovies);
    this._renderShowMoreBtn(updatedMovies);
    this._renderTopComments();
    this._renderTopRated();
  }
  _renderMovies(count, movies) {
    const newMovies = renderCards(
        movies.slice(0, Math.max(count, Card.START_QTY_CARDS)),
        this._filmsListElement,
        this._onDataChange,
        this._onViewChange);

    this._showedMovieControllers = this._showedMovieControllers.concat(newMovies);
    this._showingCardCount = this._showedMovieControllers.length;
  }
  _renderTopMovies(movies, moviesList, count) {
    const newMovies = renderCards(
        movies.slice(0, count),
        moviesList,
        this._onDataChange,
        this._onViewChange);

    this._showedTopMovieControllers = this._showedTopMovieControllers.concat(newMovies);
  }
  _removeMovies() {
    this._showedMovieControllers.forEach((controller) => controller.destroy());
    this._showedTopMovieControllers.forEach((controller) => controller.destroy());
    this._showedMovieControllers = [];
    this._showedTopMovieControllers = [];
  }
  _renderShowMoreBtn(movies) {
    remove(this._btnShowMoreComponent);

    if (this._showingCardCount >= movies.length) {
      return;
    }

    render(this._filmMainComponent.getElement(), this._btnShowMoreComponent, RenderPosition.BEFOREEND);

    this._btnShowMoreComponent.setOnBtnMouseup(() => {
      const prevCardCount = this._showingCardCount;
      this._showingCardCount = prevCardCount + Card.LOAD_MORE_STEP;

      this._updateMovies(this._showingCardCount, movies);
    });
  }
  _onSortTypeChange(sortType) {
    const movies = this._moviesModel.getMovies();
    let sortedCards;

    switch (sortType) {
      case SortType.BY_RATING:
        sortedCards = movies.slice().sort((min, max) => max.rating - min.rating);
        break;
      case SortType.BY_DATE:
        sortedCards = movies.slice().sort((min, max) => max.productionDate - min.productionDate);
        break;
      default:
        sortedCards = movies;
    }

    this._updateMovies(this._showedMovieControllers.length, sortedCards);
  }
  _onDataChange(movieController, oldData, newData) {
    movieController.blockPopupForm();
    movieController.setHandlerLocker(HandlerLocker.ON);

    if (newData === null) { // null посылает удаление сообщения, в oldData id коммента
      this._api.deleteComment(oldData)
        .then(() => {
          movieController.render(this._moviesModel.deleteComment(movieController._film.id, oldData));
          movieController.setCommentViewDefault();
          movieController.unblockPopupForm();
        })
        .catch(() => {
          movieController.setCommentViewDefault();
          movieController.setHandlerLocker(HandlerLocker.OFF);
          movieController.unblockPopupForm();
          movieController.shake();
        });

    } else if (oldData === null) { // null посылает создание нового сообщения в newData изменения
      const newComment = Comment.parseComment(newData);

      this._api.updateComment(movieController, newComment)
        .then((updatedMovie) => {
          this._moviesModel.updateMovies(updatedMovie.id, updatedMovie);
          movieController.render(updatedMovie);
          movieController.unblockPopupForm();
        })
        .catch(() => {
          movieController.setHandlerLocker(HandlerLocker.OFF);
          movieController.unblockPopupForm();
          movieController.shake();
        });

    } else if (newData && oldData) {
      this._api.updateMovie(newData)
        .then((updatedMovie) => {
          this._moviesModel.updateMovies(oldData.id, updatedMovie);
          movieController.render(updatedMovie);
          movieController.unblockPopupForm();
        })
        .catch(() => {
          movieController.resetPopupForm();
          movieController.setHandlerLocker(HandlerLocker.OFF);
          movieController.unblockPopupForm();
          movieController.shake();
        });
    }
  }
  _onFilterChange() {
    this._updateMovies(Card.START_QTY_CARDS);
    this._sortComponent.setDefaultView();
  }
  _onViewChange() {
    this._showedMovieControllers.forEach((controller) => controller.setDefaultView());
  }
}
