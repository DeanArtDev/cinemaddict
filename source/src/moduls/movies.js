import {getMoviesByFilter} from '../utils/filters';

export const FilterTypes = {
  ALL: `All movies`,
  WATCHLIST: `Watchlist`,
  HISTORY: `History`,
  FAVORITES: `Favorites`,
  STATS: `Stats`
};

export default class Movies {
  constructor() {
    this._movies = [];

    this._activeFilter = FilterTypes.ALL;

    this._dataChengeHandlers = [];
    this._filterChengeHandlers = [];
  }

  getMovies() {
    return getMoviesByFilter(this._movies, this._activeFilter);
  }
  getMoviesAll() {
    return this._movies;
  }
  setMovies(movies) {
    this._movies = [].concat(this._movies, movies);
  }
  activeHandlers() {
    this._callHandlers(this._dataChengeHandlers);
    this._callHandlers(this._filterChengeHandlers);
  }
  updateMovies(oldMovieId, newMovie) {
    const index = this._findMovieIndex(oldMovieId);

    this._movies = [].concat(this._movies.slice(0, index), newMovie, this._movies.slice(index + 1));
    this.activeHandlers();
  }
  deleteComment(movieId, commentId) {
    const index = this._findMovieIndex(movieId);
    const movie = this._movies[index];

    const indexComment = movie.comments.findIndex((comment) => comment._id === commentId);

    movie.comments = [...movie.comments.slice(0, indexComment), ...movie.comments.slice(indexComment + 1)];

    this._callHandlers(this._dataChengeHandlers);
    return movie;
  }
  setFilterType(filterType) {
    this._activeFilter = filterType;
    this.activeHandlers();
  }
  setOnDataChange(handler) {
    this._dataChengeHandlers.push(handler);
  }
  setOnFilterChange(handler) {
    this._filterChengeHandlers.push(handler);
  }
  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
  _findMovieIndex(oldMovieId) {
    return this._movies.findIndex((movie) => movie.id === oldMovieId);
  }
}
