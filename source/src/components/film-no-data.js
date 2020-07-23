import AbstractComponent from './abstract-component';

const createFilmNoDataTemplate = (text) => {
  return (
    `<section class="films-list">
        <h2 class="films-list__title">${text}</h2>
    </section>`
  );
};

export default class FilmNoData extends AbstractComponent {
  constructor(text) {
    super();

    this._text = text;
  }
  getTemplate() {
    return createFilmNoDataTemplate(this._text);
  }
}
