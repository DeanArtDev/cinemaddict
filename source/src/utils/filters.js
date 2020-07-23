import {FilterTypes} from '../moduls/movies';

export const getIsWatchlistMovies = (movies) => {
  return movies.filter((movie) => movie.isWatchlist);
};
export const getIsHistoryMovies = (movies) => {
  return movies.filter((movie) => movie.isWatched);
};
export const getIsFavoritesMovies = (movies) => {
  return movies.filter((movie) => movie.isFavorite);
};
export const getMoviesByFilter = (movies, type) => {
  switch (type) {
    case FilterTypes.ALL:
      return movies;
    case FilterTypes.WATCHLIST:
      return getIsWatchlistMovies(movies);
    case FilterTypes.HISTORY:
      return getIsHistoryMovies(movies);
    case FilterTypes.FAVORITES:
      return getIsFavoritesMovies(movies);
  }

  return false;
};
