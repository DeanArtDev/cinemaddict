import AbstractSmartComponent from './abstract-smart-component';
import {SortType, VisuallyMode} from '../consts';

const createSortNavTemplate = () => {
  return (
    `<ul class="sort">
        <li><a href="#" data-sort-type="${SortType.DEFAULT}" class="sort__button sort__button--active">Sort by default</a></li>
        <li><a href="#" data-sort-type="${SortType.BY_DATE}" class="sort__button">Sort by date</a></li>
        <li><a href="#" data-sort-type="${SortType.BY_RATING}" class="sort__button">Sort by rating</a></li>
    </ul>`
  );
};

export default class Sort extends AbstractSmartComponent {
  constructor() {
    super();

    this._visuallyMode = VisuallyMode.SHOW;
    this._sortType = SortType.DEFAULT;
    this._onSortTypeChangeMouseup = null;
  }

  getTemplate() {
    return createSortNavTemplate();
  }
  rerender() {
    if (this._visuallyMode === VisuallyMode.HIDDEN) {
      return;
    }
    super.rerender();
  }
  hide() {
    super.hide();
    this._visuallyMode = VisuallyMode.HIDDEN;
  }
  show() {
    super.show();
    this._visuallyMode = VisuallyMode.SHOW;
  }
  setDefaultView() {
    this._clearActiveBtn();
    this._sortType = SortType.DEFAULT;
    this.rerender();
  }
  setOnSortTypeChangeMouseup(handler) {
    this.getElement().addEventListener(`mouseup`, (evt) => {
      if (evt.target.classList.contains(`sort`) || evt.target.tagName === `LI`) {
        return;
      }

      if (evt.target.dataset.sortType === this._sortType) {
        return;
      }

      this._clearActiveBtn();
      evt.target.classList.add(`sort__button--active`);

      this._sortType = evt.target.dataset.sortType;
      handler(this._sortType);
    });

    this._onSortTypeChangeMouseup = handler;
  }
  recoveryListeners() {
    this.setOnSortTypeChangeMouseup(this._onSortTypeChangeMouseup);
  }
  _clearActiveBtn() {
    const activeElements = this.getElement().querySelectorAll(`.sort__button--active`);
    activeElements.forEach((element) => element.classList.remove(`sort__button--active`));
  }
}
