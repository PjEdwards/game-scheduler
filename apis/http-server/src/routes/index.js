var express = require('express');
var router = express.Router();
const cors = require('cors');
const corsOptionsDelegate = require('../utils/cors-options');
const NoiseMaker = require('../controllers/noisemaker');
const config = require('config');


// At some point we'll need to negotiate with Cyber to include
// OPTIONS for requests that need it
//router.all('*', cors(corsOptionsDelegate));
router.post('*', cors(corsOptionsDelegate));
router.get('*', cors(corsOptionsDelegate));
router.delete('*', cors(corsOptionsDelegate));
router.put('*', cors(corsOptionsDelegate));

// Selectively disable CORS for OPTIONS verb
// for all HTTP Server endpoints
router.options('/', (req, res) => {
  res.status(405).send('Not Allowed');
});
router.options('/v1/makenoise', (req, res) => {
  res.status(405).send('Not Allowed');
});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: config.APP_NAME});
});

router.route('/v1/makenoise')
  .get(NoiseMaker.makeSomeNoise)
  .post(NoiseMaker.makeSomeNoise);

module.exports = router;
