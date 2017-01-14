const Dog = require('../lib/models/dog-schema');
const assert = require('chai').assert;

describe('Dog schema', () => {
  it('validates with breed, color, and gender', done => {
    const dog = new Dog({
      breed: 'breed',
      color: 'color',
      gender: 'gender'
    });
    dog.validate(err => {
      if (!err) done();
      else done(err);
    });
  });

  it('breed is required', done => {
    const dog = new Dog();
    dog.color = 'black';
    dog.gender = 'M';

    dog.validate(err => {
      assert.isOk(err, 'breed should have been required');
      done();
    });
  });

  it('color is required', done => {
    const dog = new Dog();
    dog.gender = 'M';
    dog.breed = 'Dachshund';

    dog.validate(err => {
      assert.isOk(err, 'color should have been required');
      done();
    });
  });

  it('gender is required', done => {
    const dog = new Dog();
    dog.breed = 'Dachshund';
    dog.color = 'black';

    dog.validate(err => {
      assert.isOk(err, 'gender should have been required');
      done();
    });
  });

});
