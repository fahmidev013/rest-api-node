const express = require('express');
const bodyParser = require('body-parser');
const Favorites = require('../models/favorites');
const favoritesRouter = express.Router();
const authenticate = require('../authenticate');

favoritesRouter.use(bodyParser.json());

favoritesRouter.route('/')
  .get((req, res, next) => {
    Favorites.find({})
      .populate('user').populate('dishes')
      .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Favorites.findOne({ user: req.body.user.id }, (err, favorites) => {
      if (err) {
        return done(err, false);
      }
      else if (favorites) {
        for (let dishId in req.body.favoriteDishIds) {
          favorites.dishes.push(dishId);
        }
        favorites.save().then((favorites) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(favorites);
        }, (err) => next(err))
        return done(null, favorites)
      }
      else {
        Favorites.create(req.body)
          .then((favorites) => {
            console.log('favorite Created ', favorites);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorites);
          }, (err) => next(err))
          .catch((err) => next(err));
      }
    });
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
  })
  .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Favorites.findOneAndRemove({ user: req.body.user.id })
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
      }, (err) => next(err))
      .catch((err) => next(err));
  });

favoritesRouter.route('/:favoriteId')
  .get((req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /favorites/favoriteId');
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Favorites.findOne({ user: req.body.user.id }, (err, favorites) => {
      if (err) {
        return done(err, false);
      }
      else if (favorites) {
        favorites.dishes.push(req.params.favoritesId);
        favorites.save().then((favorites) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(favorites);
        }, (err) => next(err))
        return done(null, favorites)
      }
      else {
        Favorites.create({
          user: req.body.user.id,
          dishes: [req.params.favoritesId]
        })
          .then((favorites) => {
            console.log('favorite Created ', favorites);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorites);
          }, (err) => next(err))
          .catch((err) => next(err));
      }
    });
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.end('PUT operation not supported on /favorites');
  })
  .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Favorites.findOne({ user: req.body.user.id }, (err, favorites) => {
      if (err) {
        return done(err, false);
      }
      else if (favorites) {
        let favoriteDishToRemove = favorites.dishes.find((dish)=>{
          return dish.id === req.params.dishId
        });
        let index = favorites.dishes.indexOf(favoriteDishToRemove);
        favorites.dishes.splice(index, 1)
        favorites.save().then((favorites) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(favorites);
        }, (err) => next(err))
        return done(null, favorites)
      }
    })
  });

module.exports = favoritesRouter;