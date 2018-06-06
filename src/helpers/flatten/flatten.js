/**
 * @function flatten
 * @description flattens an array of arrays into a single array.
 *
 * @param {Array} array : array to flatten.
 *
 * @returns {Array} flattened array.
 */
const flatten = (array) => {
  if (!(array instanceof Array)) return array;
  return array.reduce((a, b) => {
    if (b instanceof Array) {
      // if (!b.length) a.push(null);
      a.push.apply(a, flatten(b)); // eslint-disable-line prefer-spread
    } else if (!b) a.push(null);
    else a.push(b);
    return a;
  }, []);
};

export default flatten;
