import AbstractComponent from './abstract-component';

const createMainTemplate = () => {
  return (
    `<section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="films-list__container"></div>
    </section>`
  );
};

export default class FilmListMain extends AbstractComponent {
  getTemplate() {
    return createMainTemplate();
  }
}
