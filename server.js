const Hapi = require('hapi');

require('./mongoose-setup');

// build new hapi server with port 3000
const server = new Hapi.Server();

server.connection({
  port: 3000
});

// loading plugin and starting hapi server
server.register([
  require('./routes/dogs')
]), (err) => {
  if (err) {
    throw err;
  }
  server.start((err) => {
    if (err) {
      throw err;
    }
    console.log('server running at port ', server.info.uri);
  });
};
