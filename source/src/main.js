import FooterComponent from './components/footer';
import ProfileRankComponent from './components/profile-rank';
import MainController from './controllers/main-controller';
import API from './api';

import {render, RenderPosition, replace} from './utils/render';
import {AUTHORIZATION, END_POINT} from './consts';

import Movies from './moduls/movies';

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);

const api = new API(END_POINT, AUTHORIZATION);
const moviesModule = new Movies();
const footerComponent = new FooterComponent();
render(document.body, footerComponent, RenderPosition.BEFOREEND);

const mainController = new MainController(siteMainElement, moviesModule, api);
mainController.render(false);

api.getMovies()
  .then((movies) => {
    moviesModule.setMovies(movies);
    mainController.render(true);

    moviesModule.activeHandlers();

    const newFooter = new FooterComponent();
    newFooter.setCount(movies);
    replace(newFooter, footerComponent);

    const profileRankComponent = new ProfileRankComponent(moviesModule.getMoviesAll());
    render(siteHeaderElement, profileRankComponent, RenderPosition.BEFOREEND);

    moviesModule.setOnDataChange(() => {
      profileRankComponent.rerender(moviesModule.getMoviesAll());
    });
  });
