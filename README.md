# Node doc

[![Build Status](https://travis-ci.org/Thomasdezeeuw/node-doc.svg?branch=master)](https://travis-ci.org/Thomasdezeeuw/node-doc)
[![Dependency Status](https://gemnasium.com/Thomasdezeeuw/node-doc.svg)](https://gemnasium.com/Thomasdezeeuw/node-doc)
[![Coverage Status](https://coveralls.io/repos/Thomasdezeeuw/node-doc/badge.png)](https://coveralls.io/r/Thomasdezeeuw/node-doc)


# Under active development, code on master doesn't work. Use the v0.1.4 tag code or use NPM.

Node doc is a documenting tool. You can extract documentation from your source code and convert it into markdown, for easy use in for example GitHub.

## Installation

Requires Node.js and run ```npm install -g node-doc```

## Getting started

1. Install Node doc, see above.
2. Open you terminal of choice an go to your code.
2. run ```nodedoc SOURCE_DIR```, for example ```nodedoc lib```.
3. Look into the ```doc``` folder and see the result.

## Tags

### Access

```js
/**
 * Private access.
 * @access private
 * or
 * @private
 */
function privateFunction () {}

/**
 * Public access.
 * @access public
 * or
 * @public
 */
function publicFunction () {}
```

### Callback

```js
/**
 * Specifiy an callback
 * @callback name Description.
 *
 * example:
 * @callback myCallback I call it, whenever I like to.
 *                      Also, it accept multiline descriptions.
 * @param error {Error} An error object, if an error happend.
 * @param result {Object} The result of the async stuff.
 */

/**
 * Do some async stuff
 *
 * @param stuff {Object} Object with a buch of stuff.
 * @param cb {myCallback} The callback I'll call.
 */
function doAsync(stuff, cb) {
  // do async stuff

  cb(null, result);
};
```

### Constant

```js
/**
 * A constant variable.
 * @constant name {Type} Description.
 *
 * example:
 * @constant MY_CONSTANT {Number} My constant number.
 */
var MY_CONSTANT = 10;
```

### Constructor

```js
/**
 * Indicate that a function is a constructor.
 * @constructor
 */
function Constructor () {}
```

### Deprecated

```js
/**
 * Indicate that a function is deprecated.
 * @deprecated
 */
function someOldFunction () {}
```

### Example

```js
/**
 * Specify an example (one is also auto generated).
 * @example your example,
 *          accepts multiline comments.
 *
 * @example
 * var parser = require('parser');
 * var doc = parser(input, output, 'markdown');
 * // or don't save it
 * var doc = parser(input, 'markdown');
 */
function parser (input, output, result) {}
```

### Param

```js
/**
 * A function parameter.
 * @param name {Type} Description.
 *
 * example:
 * @param param1
 * @param param2 {String}
 * @param param3 My parameter.
 * @param param4 {Object} My parameter.
 * @param param4.subparameter {String} Property of parameter.
 */
function doStuff (param1, param2, param3, param4) {}
```

### Return

```js
/**
 * What a function returns.
 * @return {Type} Description.
 * or
 * @returns {Type} Description.
 *
 * example:
 * @return {Object} My return object.
 * @return .subparameter {String} Property of the return object.
 */
function returnObject () {
  return {
    subparameter: 'Hi'
  };
}
```

### This

```js
/**
 * Description of the the this object
 * @this Desciption.
 * or define a property of this
 * @this .property {Type} Description.
 *
 * example:
 * @this .name {String} Name of the error.
 */
function Constructor () {}
```

### Throws

```js
/**
 * An error that a function might throw
 * @throw Error description.
 * or
 * @throws Error description.
 *
 * example:
 * @throw You broke me! This happend because..?
 *        I don't know.
 */
function throwError () {
  throw new Error('You broke me! This happend because..? I don\'t know.');
}
```

### Todo

```js
/**
 * When we still need to do some stuff, globally or per function.
 * @todo finish this.
 * or
 * @todo
 * - finish..
 * - this.
 *
 * example:
 * @todo Make better documentation.
 * @todo
 * - Write some more tests.
 * - Make this work.
 * - Then make it faster.
 */
```

## Want more examples?

If you want more examples, check the code in the lib directory. Because of course I document my own code :).

## Want to see the result?

In the doc directory you can see the result of documenting this code.

## Tests

Run tests with ```npm test```.

## Coverage

I try to get 100% coverage, you can see it for yourself with ```npm run coverage```.
