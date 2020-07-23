import {parseRuntime} from '../../utils/common';
import {formatDate} from '../../utils/moment';
import {RATING_NUMBER} from '../../consts';

const createGenresTemplate = (genres) => {
  return [...genres]
    .map((genre) => {
      return (
        `<span class="film-details__genre">${genre}</span>`
      );
    })
    .join(``);
};
const createGenreBlockTemplate = (genres) => {
  const genresMarkup = createGenresTemplate(genres);
  const nameGenre = genres.size > 1 ? `Genres` : `Genre`;

  return (
    `<td class="film-details__term">${nameGenre}</td>
    <td class="film-details__cell">${genresMarkup}</td>`
  );
};
const createRatingScoreTemplate = (ratingNumber, numberChecked) => {
  return Array(ratingNumber).fill(``).map((item, index) => {
    const isChecked = numberChecked === index + 1 ? `checked` : ``;

    return (
      `<input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${index + 1}" id="rating-${index + 1}" ${isChecked}>
      <label class="film-details__user-rating-label" for="rating-${index + 1}">${index + 1}</label>`
    );
  }).join(``);
};
const createRatingTemplate = (filmName, userRating) => {
  const ratingMarkup = createRatingScoreTemplate(RATING_NUMBER, userRating);
  return (
    `<div class="form-details__middle-container">
      <section class="film-details__user-rating-wrap">
        <div class="film-details__user-rating-controls">
          <button class="film-details__watched-reset" type="button">Undo</button>
        </div>

        <div class="film-details__user-score">
          <div class="film-details__user-rating-poster">
            <img src="./images/posters/the-great-flamarion.jpg" alt="film-poster" class="film-details__user-rating-img">
          </div>

          <section class="film-details__user-rating-inner">
            <h3 class="film-details__user-rating-title">${filmName}</h3>

            <p class="film-details__user-rating-feelings">How you feel it?</p>

            <div class="film-details__user-rating-score">
              ${ratingMarkup}
            </div>
          </section>
        </div>
      </section>
    </div>`
  );
};
export const getTemplate = (filmPopup, options = {}) => {
  const {
    poster, movieName, originalMovieName, rating, userRating, director, writers,
    productionDate, duration, country, genres, actors, description, ageRating, comments
  } = filmPopup;
  const {
    isRated, isWatched, isFavorite, isWatchlist, userEmoji
  } = options;

  const actorsMarkup = actors.join(`, `);
  const userRatingMarkup = (isWatched && isRated) ? `Your rate ${userRating}` : ``;
  const ratedMarkup = isWatched ? createRatingTemplate(movieName, userRating) : ``;
  const genresMarkup = createGenreBlockTemplate(genres);
  const releaseDate = formatDate(productionDate);
  return (
    `<section class="film-details">
        <form class="film-details__inner" action="" method="get">

          <div class="form-details__top-container">
            <div class="film-details__close">
              <button class="film-details__close-btn" type="button">close</button>
            </div>
            <div class="film-details__info-wrap">
              <div class="film-details__poster">
                <img class="film-details__poster-img" src="${poster}" alt="Film poster">

                <p class="film-details__age">${ageRating}+</p>
              </div>

              <div class="film-details__info">
                <div class="film-details__info-head">
                  <div class="film-details__title-wrap">
                    <h3 class="film-details__title">${movieName}</h3>
                    <p class="film-details__title-original">${originalMovieName}</p>
                  </div>

                  <div class="film-details__rating">
                    <p class="film-details__total-rating">${rating}</p>
                    <p class="film-details__user-rating">${userRatingMarkup}</p>
                  </div>
                </div>

                <table class="film-details__table">
                  <tr class="film-details__row">
                    <td class="film-details__term">Director</td>
                    <td class="film-details__cell">${director}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Writers</td>
                    <td class="film-details__cell">${writers.join(`, `)}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Actors</td>
                    <td class="film-details__cell">${actorsMarkup}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Release Date</td>
                    <td class="film-details__cell">${releaseDate}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Runtime</td>
                    <td class="film-details__cell">${parseRuntime(duration)}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Country</td>
                    <td class="film-details__cell">${country}</td>
                  </tr>
                  <tr class="film-details__row">${genresMarkup}</tr>
                </table>

                <p class="film-details__film-description">${description}</p>
              </div>
            </div>

            <section class="film-details__controls">
              <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist"
              ${isWatchlist ? `checked` : ``} >
              <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

              <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched"
                ${isWatched ? `checked` : ``}>
              <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

              <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite"
                ${isFavorite ? `checked` : ``}>
              <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
            </section>
          </div>

          ${ratedMarkup}

          <div class="form-details__bottom-container">
            <section class="film-details__comments-wrap">
              <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

              <ul class="film-details__comments-list">

              </ul>

              <div class="film-details__new-comment">
                <div for="add-emoji" class="film-details__add-emoji-label" data-img-src="">
                    ${userEmoji ? `<img class="film-details__added-emoji" src="./images/emoji/${userEmoji}.png" width="55" height="55" alt="emoji">` : ``}
                </div>

                <label class="film-details__comment-label">
                  <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
                </label>

                <div class="film-details__emoji-list">
                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
                  <label class="film-details__emoji-label" for="emoji-smile">
                    <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                  </label>

                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                  <label class="film-details__emoji-label" for="emoji-sleeping">
                    <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                  </label>

                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                  <label class="film-details__emoji-label" for="emoji-puke">
                    <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                  </label>

                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
                  <label class="film-details__emoji-label" for="emoji-angry">
                    <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                  </label>
                </div>
              </div>
            </section>
          </div>
        </form>
    </section>`
  );
};
