# JavaScript Array Matrix
A lightweight and performant data structure for storing JavaScript objects in an _n_-way or _n_-order array matrix.

## Table of contents
  * [Getting Started](#getting-started)
    * [Making a Matrix](#making-a-matrix)
      * [Configuration Properties](#configuration-properties)
        * [data Property](#data-property)
        * [orders Property](#orders-property)
      * [Example Matrix](#example-matrix)  
  * [Querying Data](#querying-data)
    * [getEntry](#getentry)
    * [getDimension](#getdimension)
  * [Additional Methods](#additional-methods)
    * [getAxes](#getaxes)
    * [getAxisPoints](#getaxispoints)
    * [debug](#debug)
  * [Demo and Performance](#demo-and-performance)
  * [Dev Workflow](#dev-workflow)

## Getting Started

First, add the module to your project:

`npm i -S @express-labs/javascript-array-matrix`

Import `ArrayMatrix` into your project:

```
import ArrayMatrix from '@express-labs/array-matrix';
```
OR
```
const ArrayMatrix = require('@express-labs/array-matrix');
```

## Making a Matrix

To create a new array matrix, you instantiate a new ArrayMatrix object with a configuration object:
```
const myMatrix = new ArrayMatrix(configs);
```

### Configuration Properties
#### data Property
__type:__ {Array<Object>}

_Required_

This is an array of objects that will be parsed and organized into the array matrix. The objects
do not have to match exactly, but each object __must__ have the properties corresponding to the
orders passed in as arguments.

#### orders Property
__type:__ {Array<String>}

_Required_

Each string in they array must correspond to a key or property on the objects passed
in the `data` argument Array.

The more properties that are provided, the higher the order or rank of the matrix, and
more dimensions in the array. *You should provide the minimum number of orders required
to map each object to a cell in the array.*

__Example:__ if you are selling a T-shirt, you would want two orders: `size` and `color`.
When you know the `size` and `color` of the T-shirt, you would use those values to access
the product in the Array Matrix, allowing you to get the sku, price, availability, etc.

If there are multiple T-shirts on a single page, you may want to use three orders: `size`,
`color`, and `manufacturer`. Or maybe `size`, `color`, and `style number`. The important
take-away is that you have the minimum number of orders/properties necessary so that each
maps to _at most_ 1 object per cell.

There will be situations where you may have 0 objects per cell, and that is okay. The
Array Matrix will return `null` for those cells. (ex.: Blue T-shirts in Small, but not Red T-shirts in Small).

### Example Matrix

```
const matrixData = [
  { color: 'Blue', size: 'Small', sku: '123' },
  { color: 'Blue', size: 'Medium', sku: '124' },
  { color: 'Red', size: 'Medium', sku: '125' },
  { color: 'Blue', size: 'Large', sku: '126' },
  { color: 'Red', size: 'Large', sku: '127' },
  { color: 'Green', size: 'Large', sku: '128' }
];

const matrixOrders = ['color', 'size'];

const matrix = new ArrayMatrix({
  data: matrixData,
  orders: matrixOrders
});
```

## Querying Data
### getEntry
Gets a single entry from the matrix at the provided points.

#### Parameters
__points__ _{Object}_: an object with keys corresponding to the `orders` or axes of
the matrix, and the value corresponding to the label or name of the point in the matrix.

Using our [Example Matrix](#example-matrix):
```
const chosenTShirt = matrix.getEntry({ size: 'Medium', color: 'Red' });
// chosenTshirt points to { color: 'Red', size: 'Medium', sku: '125' }
```

__NOTE:__ When querying for an entry, the number of keys in the `points` argument object needs to
equal the number of orders present in the matrix.

### getDimension
Gets multiple entries from a dimension in the matrix from the provided points. The missing
axis/points is the dimension that is returned.

#### Parameters
__points__ _{Object}_: an object with keys corresponding to the `orders` or axes of
the matrix, and the value corresponding to the label or name of the point in the matrix.

Unlike `getEntry`, `getDimension` takes a `points` argument Object with the number of keys _one less_
than the number of orders present in the matrix.

Using our [Example Matrix](#example-matrix):
```
const allBlueShirts = matrix.getDimension({ color: 'Blue' });
// allBlueShirts is [
//    { color: 'Blue', size: 'Small', sku: '123' },
//    { color: 'Blue', size: 'Medium', sku: '124' },
//    { color: 'Blue', size: 'Large', sku: '126' }
// ];

const allSmallShirts = matrix.getDimension({ size: 'Medium' });
// allSmallShirts is [
//    { color: 'Blue', size: 'Medium', sku: '124' },
//    { color: 'Red', size: 'Medium', sku: '125' },
// ];
```

__NOTE:__ Currently `ArrayMatrix` only supports returning 1 dimension at a time. Adding functionality
to return more than one dimension is being reviewed and undergoing performance tests.

## Additional Methods
### getAxes
__NOTE:__ _axes_ is the plural of _axis_, and is not the the tool used by lumberjacks
or weapon used by Medieval Vikings.

Gets the axes and named points along those axes.

Using our [Example Matrix](#example-matrix):
```
const matrixAxes = matrix.getAxes();
// matrixAxes is {
//    color: ['Blue', 'Red', 'Green'],
//    size: ['Small', 'Medium', 'Large']
// };
```

### getAxisPoints
Gets the points along an axis and returns the named points.

#### Parameters
__axis__ _{String}_: The name of the axis whose named points you want.

Using our [Example Matrix](#example-matrix):
```
const axisPoints = matrix.getAxisPoints('color');
// axisPoints is ['Blue', 'Red', 'Green'];
```

### debug
Returns all the data stored in the array matrix - matrix, props, axes.

## Demo and Performance
For more advanced demonstration of different 2, 3, and 4 order array
matrices, the `App` has examples. Running the project locally starts
the demo application, where you can play with queries and see performance
results as well.

## Dev Workflow
- `npm run dev` starts a local development server, opens the dev page with your default browser, and watches for changes via livereload<br><br>
- `npm run build` compiles commonjs and ES modules and places them in the dist directory<br><br>
- `npm test` runs test using Jest + Enzyme.
