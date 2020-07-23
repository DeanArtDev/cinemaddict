import {createElement} from '../utils/render';
import {SHAKE_TIMEOUT, VisualClass} from '../consts';

export default class AbstractComponent {
  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);
    }

    this._element = null;
  }

  getTemplate() {
    throw new Error(`Abstract method not implemented: getTemplate`);
  }
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }
  removeElement() {
    this._element = null;
  }
  shake() {
    const element = this.getElement();
    element.style.animationName = `shake`;
    element.style.animationDuration = `${SHAKE_TIMEOUT / 1000}s`;
    return new Promise((resolve) => {
      setTimeout(() => {
        element.style.animationName = ``;
        element.style.animationDuration = `0s`;
        resolve();
      }, SHAKE_TIMEOUT);
    });
  }
  show() {
    this.getElement().classList.remove(VisualClass.HIDE);
  }
  hide() {
    this.getElement().classList.add(VisualClass.HIDE);
  }
}
