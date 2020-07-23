import AbstractComponent from './abstract-component';

const createButtonShowMoreTemplate = () => {
  return (
    `<button class="films-list__show-more">Show more</button>`
  );
};

export default class ButtonShowMore extends AbstractComponent {
  getTemplate() {
    return createButtonShowMoreTemplate();
  }

  setOnBtnMouseup(handler) {
    this.getElement().addEventListener(`mouseup`, handler);
  }
}
