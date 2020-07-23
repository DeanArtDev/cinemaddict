import {getIsHistoryMovies} from './filters';
import {NameRating} from '../consts';

export const getProfileRank = (movies) => {
  const userRating = getIsHistoryMovies(movies).length;

  switch (true) {
    case userRating === 0:
      return NameRating.DEFAULT;
    case userRating <= 10:
      return NameRating.NOVICE;
    case userRating > 10 && userRating < 21:
      return NameRating.FAN;
    case userRating > 20:
      return NameRating.MOVIE_BUFF;
    default: return NameRating.DEFAULT;
  }
};
