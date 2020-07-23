import AbstractComponent from './abstract-component';

const createFilmContainerTemplate = () => {
  return (
    `<section class="films"></section>`
  );
};

export default class FilmList extends AbstractComponent {
  getTemplate() {
    return createFilmContainerTemplate();
  }
}
