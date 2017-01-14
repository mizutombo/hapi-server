const hapi = require('hapi');
const bodyParser = require('body-parser').json();
const router = hapi.Router();
const Dog = require('../models/dog-schema');

router
  .get('/', (req, res, next) => {
    const query = {};
    if(req.query.breed) {
      query.breed = req.query.breed;
    }
    if(req.query.color) {
      query.color = req.query.color;
    }
    if(req.query.gender) {
      query.gender = req.query.gender;
    }
    Dog.find(query)
      .then(dog => res.send(dog))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    Dog.findById(req.params.id)
      .then(dog => res.send(dog))
      .catch(next);
  })
  .post('/', bodyParser, (req, res, next) => {
    new Dog(req.body).save()
      .then(saved => res.send(saved))
      .catch(next);
  })
  .put('/:id', bodyParser, (req, res, next) => {
    Dog.findByIdAndUpdate(req.params.id)
      .then(saved => res.send(saved))
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    Dog.findByIdAndRemove(req.params.id)
      .then(deleted => res.send(deleted))
      .catch(next);
  });

module.exports = router;
