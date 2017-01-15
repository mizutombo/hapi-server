const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);

// start db ... store connection ... clear db
const connection = require('../mongoose-setup');

const server = require('../server');

describe('dog', () => {

  before(done => {
    const CONNECTED = 1;
    if (connection.readyState === CONNECTED) {
      dropCollection();
    }
    else
      connection.on('open', dropCollection);

    function dropCollection() {
      const name = 'dogs';
      connection.db
        .listCollections({name})
        .next((err, collinfo) => {
          if (!collinfo) return done();
          connection.db.dropCollection(name, done);
        });
    }
  });

  const request = chai.request(server);

  const crazyDog = { // test case dog object
    breed: 'Cattle Dog',
    color: 'multicolor',
    gender: 'M'
  };

  it('/GET all', done => { // passes test for GET all when array is empty
    request
      .GET('/dogs')
      .then(res => {
        assert.deepEqual(res.body, []);
        done();
      })
      .catch(done);
  });

  it('/POST', done => { // passes test for POST to 'dogs' collection
    request
      .POST('/dogs')
      .send(crazyDog)
      .then(res => {
        const dog = res.body;
        assert.ok(dog._id);
        crazyDog.__v = 0;
        crazyDog._id = dog._id;
        done();
      })
      .catch(done);
  });

  it('/GET by id', done => { // passes test for GET by id
    request
      .GET(`/dogs/${crazyDog._id}`)
      .then(res => {
        const dog = res.body;
        assert.deepEqual(dog, crazyDog);
        done();
      })
      .catch(done);
  });

  it('/GET all after post', done => { // passes test for GET all after POST
    request
      .GET('/dogs')
      .then(res => {
        assert.deepEqual(res.body, [crazyDog]);
        done();
      })
      .catch(done);
  });

  it('add a new breed of dog', done => { // passes test for POST new breed of dog
    request
      .POST('/dogs')
      .send({breed: 'Doberman', color: 'black-tan', gender: 'F'})
      .then(res => {
        assert.ok(res.body._id);
        done();
      })
      .catch(done);
  });

  it('change gender of crazyDog', done => { // passes test for PATCH ... change gender of dog
    request
      .PATCH(`/dogs/${crazyDog._id}`)
      .send({breed: 'Cattle Dog', color: 'multicolor', gender: 'F'})
      .then(res => {
        assert.ok(res.body._id);
        done();
      })
      .catch(done);
  });

  it('/GET Cattle Dog', done => { // passes test to GET the Cattle Dog
    request
      .GET('/dogs')
      .query({breed: 'Cattle Dog'})
      .then(res => {
        assert.deepEqual(res.body, [crazyDog]);
        done();
      })
      .catch(done);
  });

  it('/DELETE crazyDog', done => { // passes test to DELETE the crazyDog
    request
      .DELETE(`/dogs/${crazyDog._id}`)
      .then(res => {
        crazyDog.__v = 0;
        assert.deepEqual(res.body, crazyDog);
        done();
      })
      .catch(done);
  });

});
