const request = require('supertest');
const { server, app } = require('../../../index');
const agent = request.agent(app);

describe('noisemaker', () => {

  afterAll((done) => {
    server.close(done);
  });

  describe('/GET /v1/makenoise', () => {
    it('it should GET a noisy response echoing back input params', (done) => {
      agent.get('/v1/makenoise?stuff=nonsense')
        .expect(200, done)
    });
  });
});
