import AbstractComponent from './abstract-component';
import {NavigationClass} from '../consts';

const createStatItemsMarkUp = (statItems) => {
  return statItems
    .map(({name, count, checked}) => {
      const isAll = (name === `All movies`) ? NavigationClass.HIDE_CLASS : ``;
      const isStats = (name === `Stats`) ? NavigationClass.STATS_CLASS : ``;
      const isCountExist = count > 0;

      return (
        `<a href="#${name}"
            class="main-navigation__item ${checked ? NavigationClass.ACTIVE_CLASS : ``} ${isStats}"
            data-filter-type="${name}">
            ${name}
            ${isCountExist ? `<span class="main-navigation__item-count ${isAll}">${count}</span>` : ``}
        </a>`
      );
    });
};
const createNavTemplate = (statItems) => {
  const statItemsMarkUp = createStatItemsMarkUp(statItems).join(`\n`);

  return (
    `<nav class="main-navigation">
        ${statItemsMarkUp}
    </nav>`
  );
};

export default class Navigation extends AbstractComponent {
  constructor(statItems) {
    super();

    this.statItems = statItems;
  }

  getTemplate() {
    return createNavTemplate(this.statItems);
  }
  setOnFilterChange(handler) {
    this.getElement().addEventListener(`mouseup`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName === `A` && evt.target.dataset.filterType !== undefined) {
        handler(evt.target.dataset.filterType);
      }
    });
  }
}
