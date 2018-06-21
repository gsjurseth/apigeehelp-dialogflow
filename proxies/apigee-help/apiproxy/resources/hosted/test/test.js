process.env.NODE_ENV = 'test';

const chai    = require('chai'),
  chaiHttp    = require('chai-http'),
   server     = require('../index'),
   requestSA  = require('./data/exampleFullfillmentRequest-SA.json');
   requestAM  = require('./data/exampleFullfillmentRequest-AM.json');

const should = chai.should();

chai.use(chaiHttp);

describe('Assistant Searches', () => {
  /*
  * Test the /POST route
  */
  describe('Search for "documentation for spike-arrest"', () => {
      it('it should try and find the documentation link for the spike-arrest-policy', (done) => {
        chai.request(server)
            .post('/')
            .send(requestSA)
            .end((err, res) => {
                console.log('this is the res: %j', res);
                res.should.have.status(200);
              done();
            });
      });

  });
  describe('Search for "documentation for assign-message"', () => {
      it('it should try and find the documentation link for the assign-message-policy', (done) => {
        chai.request(server)
            .post('/')
            .send(requestAM)
            .end((err, res) => {
                console.log('this is the res: %j', res);
                res.should.have.status(200);
              done();
            });
      });

  });
});
