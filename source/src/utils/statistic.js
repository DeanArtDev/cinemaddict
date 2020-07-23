import moment from 'moment';
import {StatisticFilter} from '../consts';

const DateFilter = {
  [StatisticFilter.ALL_TIME]: (isWatched) => isWatched,
  [StatisticFilter.TODAY]: (isWatched, watchingDate) => isWatched &&
    watchingDate > moment(new Date()).subtract(1, `day`),
  [StatisticFilter.WEEK]: (isWatched, watchingDate) => isWatched &&
    watchingDate > moment(new Date()).subtract(1, `week`),
  [StatisticFilter.MONTH]: (isWatched, watchingDate) => isWatched &&
    watchingDate > moment(new Date()).subtract(1, `month`),
  [StatisticFilter.YEAR]: (isWatched, watchingDate) => isWatched &&
    watchingDate > moment(new Date()).subtract(1, `year`),
};

export const getWatchedMovies = (films, period) => {
  return films.filter(({isWatched, watchingDate}) => DateFilter[period](isWatched, watchingDate));
};
