import FilterController from './filter-controller';
import FilmListComponent from '../components/film-list';
import PageController from './page-controller';
import StatisticComponent from '../components/statistic/statistic';
import {render, RenderPosition, replace} from '../utils/render';

export default class MainController {
  constructor(container, moviesModule, api) {
    this._container = container;
    this._moviesModule = moviesModule;
    this._api = api;

    this._pageController = null;
    this._filterController = null;

    this.onStatsShowMouseup = this.onStatsShowMouseup.bind(this);
    this._showPage = this._showPage.bind(this);
    this._renderStatistic = this._renderStatistic.bind(this);

    this._statisticComponent = new StatisticComponent(this._moviesModule.getMoviesAll());
    this._filmListComponent = new FilmListComponent();
    this._filterController = new FilterController(this._container, this._moviesModule, this.onStatsShowMouseup);
    this._pageController = new PageController(this._filmListComponent, this._moviesModule, this._api);
  }

  render(network = false) {
    this._pageController.render(network);
    this._filterController.render(network);

    this._filterController.setOnFilterChange(this._showPage);
    this._moviesModule.setOnDataChange(this._renderStatistic);

    render(this._container, this._filmListComponent, RenderPosition.BEFOREEND);
  }
  onStatsShowMouseup() {
    this._hidePage();
  }
  _renderStatistic() {
    const movies = this._moviesModule.getMoviesAll();

    const oldStatisticComponent = this._statisticComponent;
    this._statisticComponent = new StatisticComponent(movies);
    this._statisticComponent.hide();

    if (oldStatisticComponent) {
      replace(this._statisticComponent, oldStatisticComponent);
    }
    render(this._container, this._statisticComponent, RenderPosition.BEFOREEND);
  }
  _showPage() {
    this._pageController.showSortComponent();
    this._filmListComponent.show();
    this._statisticComponent.hide();
  }
  _hidePage() {
    this._pageController.hideSortComponent();
    this._filmListComponent.hide();
    this._statisticComponent.show();
  }
}
