/**
 * Iterates across key/value pairs in an object
 *
 *  @param {Object}   o        Iteration target
 *  @param {Function} iterator Iteration function
 *  @param {Object}   context  Iteration function context
 */
function iterate(o, iterator, context) {
  for (var k in o) {
    if (o.hasOwnProperty(k)) {
      iterator.call(context, o[k], k);
    }
  }
}

/**
 * Recursively iterates across deep key/values in an object.
 *
 *  @param {Object}   o         Iteration target
 *  @param {integer}  depth     Iteration depth
 *  @param {Function} iterator  Iteration function
 *  @param {Object}   context   Iteration function context
 *
 *  @example
 *
 *    x = { foo: { a: 1, b: 2 }, bar: { a: 3, b: 4 } };
 *
 *    iterators.niterate(x, 2, function (v1, k1, v2, k2) {
 *
 *      // This iterator function will be invoked with:
 *      //   ({ a: 1, b: 2 }, 'foo', 1, 'a')
 *      //   ({ a: 1, b: 2 }, 'foo', 2, 'b')
 *      //   ({ a: 3, b: 4 }, 'bar', 3, 'a')
 *      //   ({ a: 3, b: 4 }, 'bar', 4, 'b')
 *
 *    }, this);
 */
function niterate(o, depth, iterator, context) {
  var pairs = [].slice.call(arguments, 4);

  if (depth > 0 && typeof o === 'object') {
    // Iterate across all v/k pairs at this level
    iterate(o, function (v, k) {
      // Reduce depth and recurse, adding the v/k pair as arguments
      niterate.apply(
        null
      , [
          v
        , depth - 1
        , iterator
        , context
        ].concat(pairs.concat(v,k))
      );
    });
  }
  else {
    iterator.apply(context, pairs);
  }
}

module.exports = {
  iterate: iterate
, niterate: niterate
};
