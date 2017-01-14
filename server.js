require('./lib/mongoose-setup');

const Hapi = require('hapi');

const Dog = require('./lib/models/dog-schema');

const server = new Hapi.Server();
server.connection({
  port: 3000
});

server.route({
  method: 'GET',
  path: '/',
  handler: function (req, res) {
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
      .then(dog => res.send(dog));
  }
});

server.route({
  method: 'GET',
  path: '/{id}',
  handler: function (req, res) {
    Dog.findById(req.params.id)
      .then(dog => res.send(dog));
  }
});

server.route({
  method: 'POST',
  // path: '/', bodyParser,
  path: '/',
  handler: function (req, res) {
    new Dog(req.body).save()
      .then(saved => res.send(saved));
  }
});

server.route({
  method: 'PUT',
  // path: '/{id}', bodyParser,
  path: '/{id}',
  handler: function (req, res) {
    Dog.findByIdAndUpdate(req.params.id)
      .then(saved => res.send(saved));
  }
});

server.route({
  method: 'DELETE',
  path: '/{id}',
  handler: function (req, res) {
    Dog.findByIdAndRemove(req.params.id)
      .then(deleted => res.send(deleted));
  }
});

server.start((err) => {
  if (err){
    throw err;
  }
  console.log('server running at port ', server.info.uri);
});
