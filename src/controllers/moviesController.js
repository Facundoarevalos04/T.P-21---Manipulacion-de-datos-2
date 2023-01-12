const db = require("../database/models");
const sequelize = db.sequelize;

//Otra forma de llamar a los modelos
const Movies = db.Movie;

const moviesController = {
  list: (req, res) => {
    db.Movie.findAll().then((movies) => {
      res.render("moviesList.ejs", { movies });
    });
  },
  detail: (req, res) => {
    db.Movie.findByPk(req.params.id).then((movie) => {
      res.render("moviesDetail.ejs", { movie });
    });
  },
  new: (req, res) => {
    db.Movie.findAll({
      order: [["release_date", "DESC"]],
      limit: 5,
    }).then((movies) => {
      res.render("newestMovies", { movies });
    });
  },
  recomended: (req, res) => {
    db.Movie.findAll({
      where: {
        rating: { [db.Sequelize.Op.gte]: 8 },
      },
      order: [["rating", "DESC"]],
    }).then((movies) => {
      res.render("recommendedMovies.ejs", { movies });
    });
  }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
  add: function (req, res) {
    db.Genre.findAll({
      order: ["name"],
    })
      .then((genres) => res.render("moviesAdd", { genres }))
      .catch((error) => console.log(error));
  },
  create: function (req, res) {
    const { title, release_date, awards, rating, length, genre } = req.body;
    db.Movie.create({
      title: title.trim(),
      rating,
      length,
      awards,
      release_date,
      genre_id: genre,
    })
      .then((movie) => {
        return res.redirect('/')
      })
      .catch((error) => console.log(error));
  },
  edit: function (req, res) {
   
    db.Movie.findByPk(req.params.id).then((movie) => {
      res.render("moviesEdit.ejs", { movie });
    });
  },
  update: function (req, res) {
    let movieId = req.params.id;
    Movies.update(
      {
        title: req.body.title,
        rating: req.body.rating,
        awards: req.body.awards,
        release_date: req.body.release_date,
        length: req.body.length,
        genre_id: req.body.genre_id,
      },
      {
        where: { id: movieId },
      }
    )
      .then(() => {
        return res.redirect("/");
      })
      .catch((error) => res.send(error));
  },
  delete: function (req, res) {
    db.Movie.findByPk(req.params.id)
    .then((movie) => {
      res.render("moviesDelete.ejs", { movie });
    });
  },
  destroy: function (req, res) {
    const { id } = req.params;

    db.Movie.destroy({where : {id}})
    .then(
      res.redirect('/movies')
    )

  },
};

module.exports = moviesController;
