process.env.NODE_ENV = 'test';

const chai    = require('chai'),
  chaiHttp    = require('chai-http'),
   server     = require('../index'),
    Promise   = require('bluebird'),
   requestSA  = require('./data/exampleFullfillmentRequest-SA.json');
   requestAM  = require('./data/exampleFullfillmentRequest-AM.json');

const expect  = chai.expect;


chai.use(chaiHttp);


describe('Assistant Searches', () => {
  /*
  * Test the /get route
  */
  describe('Search for "documentation for spike-arrest"', () => {
      it('it should try and find the documentation link for the spike-arrest-policy', function() {
          let request = chai.request(server);
          return request
          .get('/documentation/spike-arrest')
          .then( function(res) {
            expect(res).to.have.status(200);
          })
          .catch( function(e) {
            console.error( 'we done failed: %s', e.stack );
          });
      }).timeout(10000);

      it('it should try and find the documentation link for the assign-message-policy', function() {
          let request = chai.request(server);
          return request
          .get('/documentation/assign-message')
          .then( function(res) {
            expect(res).to.have.status(200);
          })
          .catch( function(e) {
            console.error( 'we done failed: %s', e.stack );
          });
      }).timeout(10000);
  });
});
