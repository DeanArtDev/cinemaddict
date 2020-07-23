import MovieModel from './moduls/movie';
import Comment from './moduls/comment';

const Method = {
  GET: `GET`,
  PUT: `PUT`,
  DELETE: `DELETE`,
  POST: `POST`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class API {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getMovies() {
    return this._load({url: `movies`})
      .then((response) => response.json())
      .then(MovieModel.parseMovies)
      .then((movies) => Promise.all(movies.map((movie) => this._loadComments(movie))));
  }
  updateMovie(movie) {
    return this._load({
      url: `movies/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(movie.toRAW()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then(MovieModel.parseMovie)
      .then((film) => this._loadComments(film));
  }
  updateComment(controller, comment) {
    return this._load({
      url: `comments/${controller._film.id}`,
      method: Method.POST,
      body: JSON.stringify(comment.toRAW()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then(MovieModel.parseMovieWithComments);
  }
  deleteComment(commentId) {
    return this._load({
      url: `comments/${commentId}`,
      method: Method.DELETE
    })
      .then(() => commentId);
  }
  _loadComments(movie) {
    return this._load({url: `comments/${movie.id}`})
      .then((response) => response.json())
      .then(Comment.parseComments)
      .then((comments) => movie.setComments(comments));
  }
  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
