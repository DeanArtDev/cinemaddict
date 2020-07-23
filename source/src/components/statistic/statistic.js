import AbstractSmartComponent from '../abstract-smart-component';
import {getStatisticTemplate} from './template';
import {StatisticFilter} from '../../consts';
import {generateChart} from './chart';
import {getProfileRank} from '../../utils/profile-rank';
import {getWatchedMovies} from '../../utils/statistic';

const FILTER_ID_PREFIX = `statistic-`;

export default class Statistic extends AbstractSmartComponent {
  constructor(movies) {
    super();

    this._movies = movies;
    this._statisticPeriod = StatisticFilter.ALL_TIME;

    this._userRating = getProfileRank(this._movies);
    this._watchedFilms = getWatchedMovies(this._movies, this._statisticPeriod);

    this._chart = null;

    this._setOnFilterChangeMouseup();
    this._renderChart();
  }

  getTemplate() {
    return getStatisticTemplate(this._watchedFilms, this._userRating);
  }
  rerender() {
    this.getElement().querySelector(`#statistic-${this._statisticPeriod}`).checked = true;
    this._renderChart();
  }
  recoveryListeners() {
    this._setOnFilterChangeMouseup();
  }
  _setOnFilterChangeMouseup() {
    this.getElement().querySelector(`.statistic__filters`)
      .addEventListener(`mouseup`, (evt) => {
        if (!evt.target.classList.contains(`statistic__filters-label`)) {
          return;
        }

        this._statisticPeriod = evt.target.htmlFor.substring(FILTER_ID_PREFIX.length);
        this.rerender();
      });
  }
  _renderChart() {
    const canvasChart = this.getElement().querySelector(`.statistic__chart`);
    this._resetChart();

    if (this._movies.length <= 0) {
      return;
    }

    this._chart = generateChart(canvasChart, this._statisticPeriod, this._movies);
  }
  _resetChart() {
    if (this._chart) {
      this._chart.destroy();
      this._chart = null;
    }
  }
}

