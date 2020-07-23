import AbstractComponent from './abstract-component';
import {replaceElement} from '../utils/render';

export default class AbstractSmartComponent extends AbstractComponent {
  recoveryListeners() {
    throw new Error(`Abstract method not implemented: recoveryListeners`);
  }
  rerender() {
    const oldElement = this.getElement();

    this.removeElement();

    const newElement = this.getElement();

    replaceElement(newElement, oldElement);

    this.recoveryListeners();
  }
}
