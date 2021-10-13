const NREL_DOMAIN_PATTERNS_WHITELIST = Object.freeze([
  /.*nrel\.gov$/,
  /.*energy\.gov$/,
  /.*nrelcloud\.org$/,
  /.*re-explorer\.org$/,
  /.*localhost:\d+$/,
  /.*localhost$/,
  /.*127\.0\.0\.1:\d+$/,
  /.*127\.0\.0\.1$/,
  /.*10\.0\.2\.2:\d+$/,
  /.*10\.0\.2\.2$/
]);

module.exports = NREL_DOMAIN_PATTERNS_WHITELIST;