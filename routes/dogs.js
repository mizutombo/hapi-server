// code for hapi plugin 'routes-dogs'

const Boom = require('boom');
const Joi = require('joi');
const uuid = require('node-uuid');

exports.register = function (server, options, next) {

  const db = server.app.db;

  server.route({
    method: 'GET',
    path: '/',
    handler: function (req, res) {

      db.dogs.find((err, docs) => {
        if (err) {
          return res(Boom.wrap(err, 'internal MongoDB error'));
        }
        res(docs);
      });
    }
  });

  server.route({
    method: 'GET',
    path: '/{id}',
    handler: function (req, res) {

      db.dogs.findOne({
        _id: req.params.id
      }, (err, doc) => {
        if (err) {
          return res(Boom.wrap(err, 'internal MongoDB error'));
        }
        if (!doc) {
          return res(Boom.notFound());
        }
        res(doc);
      });
    }
  });

  server.route({
    method: 'POST',
    path: '/',
    handler: function (req, res) {

      const dog = req.payload;

      // assign unique id to dog
      dog._id = uuid.v1();

      // eslint-disable-next-line
      db.dogs.save(dog, (err, result) => {
        if (err) {
          return res(Boom.wrap(err, 'internal MongoDB error'));
        }
        res(dog);
      });
    },
    config: {
      validate: {
        payload: {
          breed: Joi.string().min(5).max(40).required(),
          color: Joi.string().min(3).max(40).required(),
          gender: Joi.string().min(1).max(1).required()
        }
      }
    }
  });

  server.route({
    method: 'PATCH',
    path: '/{id}',
    handler: function (req, res) {

      db.dogs.update({
        _id: req.params.id
      }, {
        $set: req.payload
      }, function (err, result) {

        if (err) {
          return res(Boom.wrap(err, 'internal MongoDB error'));
        }
        if (result.n === 0) {
          return res(Boom.notFound());
        }
        res().code(204);
      });
    },
    config: {
      validate: {
        payload: Joi.object({
          breed: Joi.string().min(5).max(40).required(),
          color: Joi.string().min(3).max(40).required(),
          gender: Joi.string().min(1).max(1).required()
        }).required().min(1)
      }
    }
  });

  server.route({
    method: 'DELETE',
    path: '/{id}',
    handler: function (req, res) {

      db.dogs.remove({
        _id: req.params.id
      }, function (err, result) {

        if (err) {
          return res(Boom.wrap(err, 'internal MongoDB error'));
        }
        if (result.n === 0) {
          return res(Boom.notFound());
        }
        res().code(204);
      });
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'routes-dogs'
};
