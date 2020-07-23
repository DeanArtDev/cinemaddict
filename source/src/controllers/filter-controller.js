import NavigationComponent from '../components/navigation';

import {getMoviesByFilter} from '../utils/filters';
import {render, RenderPosition, replace} from '../utils/render';
import {FilterTypes} from '../moduls/movies';
import {STAT_ITEMS} from '../consts';

export default class FilterController {
  constructor(container, moviesModel, onStatsChange) {
    this._container = container;

    this._moviesModel = moviesModel;
    this._activeFilterType = FilterTypes.ALL;
    this._navigationComponent = null;
    this._onStatsChange = onStatsChange;
    this._onFilterChangeMouseup = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._moviesModel.setOnFilterChange(this._onDataChange);
  }

  render(network = false) {
    const filters = STAT_ITEMS.map((filter) => {
      return {
        name: filter,
        count: network ? getMoviesByFilter(this._moviesModel.getMoviesAll(), filter).length : ``,
        checked: filter === this._activeFilterType,
      };
    });

    const oldNavComponent = this._navigationComponent;

    this._navigationComponent = new NavigationComponent(filters);
    this._navigationComponent.setOnFilterChange(this._onFilterChange);

    if (oldNavComponent) {
      replace(this._navigationComponent, oldNavComponent);
    } else {
      render(this._container, this._navigationComponent, RenderPosition.AFTERBEGIN);
    }
  }
  setOnFilterChange(handler) {
    this._onFilterChangeMouseup = handler;
  }
  _onFilterChange(filterType) {
    if (filterType === FilterTypes.STATS) {
      this._activeFilterType = filterType;
      this.render(true);
      this._onStatsChange();
      return;
    }

    this._activeFilterType = filterType;
    this._moviesModel.setFilterType(filterType);
    this._onFilterChangeMouseup();
  }
  _onDataChange() {
    this.render(true);
  }
}
