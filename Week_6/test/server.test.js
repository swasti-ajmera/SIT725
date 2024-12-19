const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const app = require('../server'); // Adjust the path to your server.js file.

chai.use(chaiHttp);

describe('Server Tests', () => {
  it('should return the index.html file for the root route', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.html;
        done();
      });
  });

  it('should return a list of cats from /api/cats', (done) => {
    chai.request(app)
      .get('/api/cats')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array'); // Assuming the response is an array of cats.
        done();
      });
  });

  it('should add a new cat with POST /api/cat', (done) => {
    const newCat = {
      name: 'Fluffy',
      age: 3,
      breed: 'Persian'
    };

    chai.request(app)
      .post('/api/cat')
      .send(newCat)
      .end((err, res) => {
        expect(res).to.have.status(200); // Assuming 200 or 201 is returned on success.
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('name', newCat.name);
        expect(res.body).to.have.property('age', newCat.age);
        expect(res.body).to.have.property('breed', newCat.breed);
        done();
      });
  });
});
