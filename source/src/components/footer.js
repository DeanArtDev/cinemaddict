import AbstractComponent from './abstract-component';

const createFooterTemplate = (movies) => {
  const moviesMarkup = movies.length;

  return (
    `<footer class="footer">
        <section class="footer__logo logo logo--smaller">Cinemaddict</section>
        <section class="footer__statistics">
            <p>${moviesMarkup} movies inside</p>
        </section>
    </footer>`
  );
};

export default class Footer extends AbstractComponent {
  constructor() {
    super();

    this._movies = [];
  }

  getTemplate() {
    return createFooterTemplate(this._movies);
  }
  setCount(movies) {
    this._movies = movies;
  }
}
