import AbstractComponent from './abstract-component';
import {getProfileRank} from '../utils/profile-rank';
import {replaceElement} from '../utils/render';

const createProfileRankTemplate = (rank) => {
  const rankForMarkup = getProfileRank(rank);
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${rankForMarkup}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class ProfileRank extends AbstractComponent {
  constructor(rank) {
    super();

    this.rank = rank;
    this._oldRankComponent = null;
  }

  getTemplate() {
    return createProfileRankTemplate(this.rank);
  }
  rerender(rank) {
    this.rank = rank;

    this._oldRankComponent = this.getElement();

    this.removeElement();

    const newElement = this.getElement();

    replaceElement(newElement, this._oldRankComponent);
  }
}
