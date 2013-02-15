var niterate = require('./iterators').niterate;

/**
 * Inverts statem definitions keyed on states to statem
 * definitions keyed on events (and vice versa);
 *
 * @example
 *
 *   var states = { A: { poke: 'B' }, B: { poke: 'A' } };
 *
 *   var events = inverter.invert(states);
 *   // => { poke: { A: 'B', B: 'A' } }
 */
module.exports = {

  invert: function (o) {
    var inverted = {};

    niterate(o, 2, function (v1, k1, v2, k2) {
      inverted[k2] = inverted[k2] || {};
      inverted[k2][k1] = v2;
    });

    return inverted;
  }

};
