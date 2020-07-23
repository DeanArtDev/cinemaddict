export default class Comment {
  constructor(serverMovie) {
    this._id = serverMovie[`id`];
    this._author = serverMovie[`author`];
    this._comment = serverMovie[`comment`];
    this._date = serverMovie[`date`];
    this._emotion = serverMovie[`emotion`];
  }

  toRAW() {
    return {
      'id': this._id,
      'author': this._author,
      'comment': this._comment,
      'date': this._date,
      'emotion': this._emotion
    };
  }
  static parseComment(serverMovie) {
    return new Comment(serverMovie);
  }
  static parseComments(serverMovies) {
    return serverMovies.map(Comment.parseComment);
  }
}
