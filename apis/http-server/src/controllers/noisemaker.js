const {noiseMachine} = require('@soccer/noise');

/**
 * A thing to make some (console and log) noise for testing
 */
class NoiseMakerController {

  static async makeSomeNoise(req, res) {
    let errs = [],
        params = req.query,
        body = req.body;

    if(Object.keys(params).length > 0) {
      Object.keys(params).forEach(k => {
        console.info(`${k}: ${params[k]}`);
      });
    } else {
      params = { some: 'noise' };
    }

    res.send(noiseMachine('Make some noise'));
  }
}


module.exports = NoiseMakerController;
