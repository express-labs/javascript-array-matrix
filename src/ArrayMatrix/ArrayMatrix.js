import { flatten } from '../helpers';
/**
 * @class ArrayMatrix
 * @description An n-level data object that creates an array
 * matrix from JavaScript Objects based on orders provided.
 *
 * @requires flatten
 *
 * @exports ArrayMatrix
 */
const ArrayMatrix = function ArrayMatrix() {
  /**
   * @var props
   * @description array matrix properties
   * @access private
   */
  const props = {
    dataset: null,
    order: 0,
    orders: [],
  };

  /**
   * @var axes
   * @description Stores the axes of the n-order matrix, and
   * corresponding index for String valued index labels.
   * @access private
   *
   * NOTE: axes is the plural of axis.
   */
  const axes = {};

  /**
   * @var matrix
   * @description n-order matrix for storing the data set.
   * @access private
   */
  const matrix = [];

  /**
   * @constructor
   * @param {Object}
   * @prop {Array} data : data set to map and store
   * @prop {Array} orders : names of the orders making up the array matrix
   */
  function constructor({ data, orders }) {
    /*
      Store properties in the array matrix.
    */
    props.order = orders.length;
    props.orders = orders;
    props.dataset = data;

    /*
      For each order, create a key-value pair of
      the order's name and an empty array in the
      indices.
    */
    (() => {
      let o = orders.length;
      while (o--) { // eslint-disable-line no-plusplus
        axes[orders[o]] = {};
      }
    })();

    /*
      Loop through each item in your dataset,
      dive into the matrix, and place the item
      at the correct vertices.
    */
    data.forEach((item) => {
      let pointer = 0;
      let plane = matrix;

      while (pointer < props.order) {
        const order = orders[pointer];
        const index = getAxisPoint(order, item[order], plane); // eslint-disable-line
        plane = plane[index];

        pointer += 1;
      }

      plane.push(item);
    });

    return this;
  }

  /**
   * @function getAxisPoint
   * @description Checks to see if a point exists on the
   * given axis.
   *
   * If it does not exist, it creates the point on the axis and and returns
   * the index of the new point. The new axis/point assigned
   * is based off the length of the existing axis's keys to ensure
   * it is always forced to the very last index in the list.
   *
   * If it does exist, it returns the index of the existing point.
   * @access private
   *
   * @param {String} axis : name of the axis
   * @param {String} point : name for a point on the axis
   * @param {Array} plane : dimension or plane of the array matrix
   *
   * @returns {Integer} index of string label
   */
  function getAxisPoint(axis, point, plane) {
    const i = axes[axis];

    if (typeof i[point] !== 'number') {
      i[point] = Object.keys(i).length;
    }

    if (!(plane[i[point]] instanceof Array)) {
      plane[i[point]] = []; // eslint-disable-line no-param-reassign
    }

    return i[point];
  }

  /**
   * @function getTuple
   * @description gets the tuple from named points on the axes.
   * @access private
   *
   * @param {Object} points - key value pair of axis/point to get index for.
   *
   * @returns {Array} array equivalent of tuple with null as missing point values.
   */
  function getTuple(points) {
    const keys = Object.keys(points);
    const tuple = new Array(props.order).fill(null);

    for (let i = 0, l = keys.length; i < l; i++) { // eslint-disable-line no-plusplus
      const key = keys[i];
      const mIndex = props.orders.indexOf(key);

      if (mIndex === -1) {
        throw new Error(`Tuple Error: Axis ${key} not found in available axes: ${props.orders.join(', ')}.`);
      }

      if (typeof points[key] === 'string') {
        tuple[mIndex] = axes[key][points[key]];
        if (typeof tuple[mIndex] === 'undefined') {
          throw new Error(`Tuple Error: Point ${[points[key]]} not found in axis ${key} points: ${Object.keys(axes[key]).join(', ')}`);
        }
        continue; // eslint-disable-line no-continue
      }

      if (typeof points[key] === 'number') {
        tuple[mIndex] = points[key];
        continue; // eslint-disable-line no-continue
      }

      throw new Error(`Tuple Error: ${points[key]} for axis ${key} is not a valid string or integer.`);
    }

    return tuple;
  }

  /**
   * @function deadReckon
   * @description recursive function that dives into the array matrix
   * and returns an element or dimension from a set of points.
   * @access private
   *
   * @param {Array} plane : dimension or plane to start.
   * @param {Array} indices : list of indices to traverse.
   *
   * @returns {Any} the node at the end of the traversal
   */
  function deadReckon(plane, indices) {
    if ((!indices || !indices.length)) return plane;

    // If we are missing an entire dimension or plane, return
    // empty set;
    if (!plane) return [];

    return deadReckon(plane[indices.shift()], indices);
  }

  /**
   * @function getAxes
   * @description returns all axes and each axis' points
   * @access public
   *
   * @returns {Object} axes' names with arrays of points
   */
  this.getAxes = function getAxes() {
    return Object.keys(axes).reduce((accumulator, current) =>
      Object.assign({}, accumulator, { [current]: Object.keys(axes[current]) })
    , {});
  };

  /**
   * @function getAxisPoints
   * @description returns all points for a given axis.
   * @access public
   *
   * @param {String} axis : name of axis.
   *
   * @returns {Array} Array of all an axis's named points.
   */
  this.getAxisPoints = function getAxisPoints(axis) {
    if (!axes[axis]) return null;

    return Object.keys(axes[axis]);
  };

  /**
   * @function getDimension
   * @description gets a dimension of the matrix array based on
   * named points provided.
   *
   * The dimension is the plane of values existing by connecting
   * n vertices, where n is 1 less than the total number of orders.
   * @access public
   *
   * @param {Object} points : key-value pairs of axis and named points on the axis.
   *
   * @returns {Array} array of entries in the plane.
   */
  this.getDimension = function getDimension(points) {
    if (!points || typeof points !== 'object') {
      throw new Error('Dimension Error: Malformed points argument.');
    }

    const keys = Object.keys(points);

    if (keys.length !== props.order - 1) {
      throw new Error(`Dimension Error: ${keys.length} points provided for ${props.order} order matrix array. The number of points must be equal to n - 1, where n is the order or rank of the matrix array.`);
    }

    const coords = getTuple(points);

    const variableIndex = coords.indexOf(null);
    const entries = (() => {
      if (variableIndex === 0) {
        coords.splice(0, 1);

        return matrix.map((aIndex) => {
          const cell = deadReckon(aIndex, [].concat(coords));
          return cell && cell.length ? cell : [null];
        });
      }
      // Need see if we have the first half of the query;
      const firstSlice = deadReckon(matrix, coords.slice(0, variableIndex));
      if (firstSlice) {
        // If we have the first half of the query, deadreckon
        // on the pivot.
        return firstSlice.map(array => deadReckon(array, coords.slice(variableIndex + 1)));
      }

      // The first half of the query doesn't exist (i.e., the dimension
      // is empty), so don't loop over the pivot, just return a null filled array;
      return new Array(Object.keys(axes[props.orders[variableIndex]]).length).fill(null);
    })();

    return flatten(entries);
  };

  /**
   * @function getEntry
   * @description returns the entry in the matrix array at the points provided.
   * @access public
   *
   * @param {Object} points : key-value pairs of named points on axes.
   *
   * @returns {Object} entry at the set of points.
   */
  this.getEntry = function getEntry(points) {
    const keys = Object.keys(points);

    if (keys.length !== props.order) {
      throw new Error(`Entry Error: ${keys.length} points provided for ${props.order} order matrix array. The number of points must be equal to n, where n is the order or rank of the matrix array.`);
    }

    const coords = getTuple(points);

    let depth = 0;
    let pointer = matrix;
    while (depth < coords.length) {
      if (pointer[coords[depth]]) {
        pointer = pointer[coords[depth]];
        depth += 1;
        continue; // eslint-disable-line no-continue
      }

      return null;
    }

    return pointer[0];
  };

  /**
   * @function debug
   * @description returns the array matrix's data
   * @access public
   */
  this.debug = function debug() {
    return {
      matrix,
      axes,
      props,
    };
  };

  return constructor.apply(this, arguments); // eslint-disable-line prefer-rest-params
};

export default ArrayMatrix;
