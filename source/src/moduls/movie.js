import Comment from './comment';

export default class Movie {
  constructor(serverMovie) {
    this.id = serverMovie[`id`];

    this.poster = serverMovie[`film_info`][`poster`];
    this.movieName = serverMovie[`film_info`][`title`];
    this.originalMovieName = serverMovie[`film_info`][`alternative_title`];
    this.rating = serverMovie[`film_info`][`total_rating`];
    this.ageRating = serverMovie[`film_info`][`age_rating`];
    this.director = serverMovie[`film_info`][`director`] || [];
    this.writers = serverMovie[`film_info`][`writers`] || [];
    this.actors = serverMovie[`film_info`][`actors`] || [];
    this.country = serverMovie[`film_info`][`release`][`release_country`] || [];
    this.productionDate = serverMovie[`film_info`][`release`][`date`] ?
      new Date(serverMovie[`film_info`][`release`][`date`]) : null;
    this.duration = serverMovie[`film_info`][`runtime`] || 0;
    this.genres = new Set(serverMovie[`film_info`][`genre`] || []);
    this.description = serverMovie[`film_info`][`description`] || ``;

    this.userRating = serverMovie[`user_details`][`personal_rating`];
    this.watchingDate = new Date(serverMovie[`user_details`][`watching_date`]);
    this.isWatchlist = Boolean(serverMovie[`user_details`][`watchlist`]);
    this.isWatched = Boolean(serverMovie[`user_details`][`already_watched`]);
    this.isFavorite = Boolean(serverMovie[`user_details`][`favorite`]);

    this.comments = [];
  }

  toRAW() {
    return {
      'id': this.id,

      'comments': this.comments,
      'film_info': {
        'title': this.movieName,
        'alternative_title': this.originalMovieName,
        'total_rating': this.rating,
        'poster': this.poster,
        'age_rating': this.ageRating,
        'director': this.director,
        'writers': this.writers,
        'actors': this.actors,
        'release': {
          'date': this.productionDate.toISOString(),
          'release_country': this.country
        },
        'runtime': this.duration,
        'genre': [...this.genres],
        'description': this.description
      },
      'user_details': {
        'personal_rating': this.userRating,
        'watchlist': this.isWatchlist,
        'already_watched': this.isWatched,
        'watching_date': this.watchingDate,
        'favorite': this.isFavorite
      }
    };
  }
  setComments(comment) {
    this.comments = [...comment];
    return this;
  }
  static parseMovie(serverMovie) {
    return new Movie(serverMovie);
  }
  static parseMovies(serverMovies) {
    return serverMovies.map(Movie.parseMovie);
  }
  static cloneMovie(frontMovie) {
    return new Movie(frontMovie.toRAW());
  }
  static parseMovieWithComments(movieWithComments) {
    const frontMovie = Movie.parseMovie(movieWithComments.movie);

    return frontMovie.setComments(Comment.parseComments(movieWithComments.comments));
  }
}
