import AbstractSmartComponent from './abstract-smart-component';
import moment from 'moment';
import {formatTimeForComment} from '../utils/moment';
import {DefaultData, LoadingData} from '../consts';

const getDayInSeconds = (day) => {
  return day * (((1000 * 60) * 60) * 24);
};
const getDateMarkup = (date) => {
  const lastDate = new Date(date);
  const newDate = new Date();

  if ((newDate - lastDate) < getDayInSeconds(1) ||
    (newDate - lastDate) >= getDayInSeconds(1) && (newDate - lastDate) < getDayInSeconds(3)) {
    return moment(date).from();
  }
  return formatTimeForComment(lastDate);
};

const createCommentsTemplate = (comment, externalData) => {
  const isBlock = externalData.deleteButtonText === LoadingData.deleteButtonText;
  return (
    `<li class="film-details__comment">
        <span class="film-details__comment-emoji">
          ${comment._emotion ? `<img src="./images/emoji/${comment._emotion}.png" width="55" height="55" alt="emoji">` : ``}
        </span>
        <div>
          <p class="film-details__comment-text">${comment._comment}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${comment._author}</span>
            <span class="film-details__comment-day">${getDateMarkup(comment._date)}</span>
            <button
                class="film-details__comment-delete"
                type="button"
                data-mess-id="${comment._id}"
                ${isBlock ? `disabled` : ``}>
                    ${externalData.deleteButtonText}
            </button>
          </p>
        </div>
     </li>`
  );
};

export default class Comment extends AbstractSmartComponent {
  constructor(movieComment) {
    super();

    this._movieComment = movieComment;
    this._externalData = DefaultData;

    this._onDeleteBtnMouseup = null;
  }

  getTemplate() {
    return createCommentsTemplate(this._movieComment, this._externalData);
  }
  recoveryListeners() {
    this._subscribeOnEvents();
  }
  setOnDeleteBtnMouseup(handler) {
    this.getElement().querySelector(`.film-details__comment-delete`)
      .addEventListener(`mouseup`, () => {

        handler(this);
      });
    this._onDeleteBtnMouseup = handler;
  }
  setData(buttonText) {
    this._externalData = Object.assign({}, DefaultData, buttonText);
    this.rerender();
  }
  returnData() {
    this.setData({deleteButtonText: DefaultData.deleteButtonText});
  }
  _subscribeOnEvents() {
    this.setOnDeleteBtnMouseup(this._onDeleteBtnMouseup);
  }
}
