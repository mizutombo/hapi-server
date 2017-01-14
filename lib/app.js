const Hapi = require('hapi');
const app = new Hapi.Server();
const dogs = require('./routes/dog-routes');

const errorHandler = require('./error-handler');

// routes from browser / Postman access point
app.use('/dogs', dogs); // route to dogs collection

// error handler
app.use(errorHandler);

module.exports = app;
