var should = require('should');

describe('Comment parser', function () {
  var commentParser = require('../../lib/parsers/comment');

  describe.skip('access', function () {
    it('should accept access tag', function () {
      commentParser([
        '/**',
        ' * @access private',
        ' */'
      ].join('\n'), {
        type: 'function',
        name: 'Person'
      }, function (err, comment) {
        comment.should.be.an.Object.and.have.properties('type', 'name', 'access');

        comment.type.should.equal('function');
        comment.name.should.equal('Person');
        comment.access.should.equal('private');
      });
    });

    it('should should overwrite codeinfo', function () {
      commentParser([
        '/**',
        ' * @access private',
        ' */'
      ].join('\n'), {
        access: 'public',
        type: 'function',
        name: 'Person'
      }, function (err, comment) {
        comment.should.be.an.Object.and.have.properties('type', 'name', 'access');

        comment.type.should.equal('function');
        comment.name.should.equal('Person');
        comment.access.should.equal('private');
      });
    });

    it('should return an error on wrong access input', function () {
      commentParser([
        '/**',
        ' * @access',
        ' */'
      ].join('\n'), {
        type: 'function',
        name: 'Person'
      }, function (err, comment) {
        err.should.be.an.Error;
        err.message.should.equal('@access only supports public, private. On line 2 of the comment');
      });
    });
  });

  describe('callback', function () {
    it('should accept a callback with name, desc and with params', function () {
      commentParser([
        ' * @callback myCallback My description of the callback.',
        ' * @param err {Error} An possible error.',
        ' * @param result',
      ].join('\n'), function (err, comment) {
        comment.should.be.an.Object.and.have.properties('type', 'name', 'desc', 'params');
        comment.type.should.equal('Callback');
        comment.name.should.equal('myCallback');
        comment.desc.should.equal('My description of the callback.');
        comment.params.should.be.an.Array.and.have.lengthOf(2);

        var param = comment.params[0];
        param.should.be.a.Object.and.have.properties('name', 'type', 'desc');
        param.name.should.equal('err');
        param.type.should.equal('Error');
        param.desc.should.equal('An possible error.');
        param = comment.params[1];
        param.should.be.a.Object.and.have.properties('name');
        param.name.should.equal('result');
      });
    });

    it('should accept a callback with only a name', function () {
      commentParser([
        ' * @callback myCallback'
      ].join('\n'), function (err, comment) {
        comment.should.be.an.Object.and.have.properties('type', 'name');
        comment.type.should.equal('Callback');
        comment.name.should.equal('myCallback');
      });
    });

    it('should return an error if no name is given', function () {
      commentParser([
        '/**',
        ' * @callback',
        ' */'
      ].join('\n'), function (err, comment) {
        err.should.be.an.Error;
        err.message.should.equal('@callback requires a name. On line 2 of the comment');
      });
    });
  });

  describe.skip('constant', function () {
    it('should accept a constant', function () {
      commentParser([
        ' * @constant'
      ].join('\n'), {
        type: 'Number',
        name: 'MY_CONSTANT'
      }, function (err, comment) {
        comment.should.be.an.Object.and.properties('constant', 'type', 'name');
        comment.constant.should.be.true;
        comment.type.should.equal('Number');
        comment.name.should.equal('MY_CONSTANT');
      });
    });

    it('should accept a constant with type and description', function () {
      commentParser([
        ' * @constant MY_OTHER_CONSTANT {String} Don\'t change this!'
      ].join('\n'), {
        type: 'String',
        name: 'MY_OTHER_CONSTANT'
      }, function (err, comment) {
        comment.should.be.an.Object.and.properties('constant', 'type', 'name', 'desc');
        comment.constant.should.be.true;
        comment.type.should.equal('String');
        comment.name.should.equal('MY_OTHER_CONSTANT');
        comment.desc.should.equal('Don\'t change this!');
      });
    });

    it('should return an error if constant type in docs and code do not match', function () {
      commentParser([
        '/**',
        ' * @constant MY_CONSTANT {Number}',
        ' */'
      ].join('\n'), {
        type: 'String',
        name: 'MY_CONSTANT'
      }, function (err) {
        err.should.be.an.Error;
        err.message.should.equal('Type in doc & code do not match. On line 2 of the comment');
      });
    });

    it('should return an error if constant name in docs and code do not match', function () {
      commentParser([
        '/**',
        ' * @constant MY_CONSTANT {String}',
        ' */'
      ].join('\n'), {
        type: 'String',
        name: 'MY_OTHER_CONSTANT'
      }, function (err) {
        err.should.be.an.Error;
        err.message.should.equal('Name in doc & code do not match. On line 2 of the comment');
      });
    });
  });

  describe('constructor', function () {
    it('should accept constructor', function () {
      commentParser([
        '/**',
        ' * @access public',
        ' * @constructor',
        ' */'
      ].join('\n'), {
        type: 'function',
        name: 'Person'
      }, function (err, comment) {
        comment.should.be.an.Object.and.have.properties('type', 'name', 'constructor');
        comment.type.should.equal('Constructor');
        comment.name.should.equal('Person');
      });
    });
  });

  describe('deprecated', function () {
    it('should accept deprecated', function () {
      commentParser([
        ' * @deprecated'
      ].join('\n'), {
        type: 'function',
        name: 'Person'
      }, function (err, comment) {
        comment.should.be.an.Object.and.have.properties('type', 'name', 'deprecated');
        comment.type.should.equal('function');
        comment.name.should.equal('Person');
        comment.deprecated.should.be.true;
      });
    });

    it('should accept deprecated with a message', function () {
      commentParser([
        ' * @deprecated Use Alien instead.'
      ].join('\n'), {
        type: 'function',
        name: 'Person'
      }, function (err, comment) {
        comment.should.be.an.Object.and.have.properties('type', 'name', 'deprecated');
        comment.type.should.equal('function');
        comment.name.should.equal('Person');
        comment.deprecated.should.equal('Use Alien instead.');
      });
    });
  });

  describe('desc', function () {
    it('should accept a description', function () {
      commentParser([
        ' * This is the description.'
      ].join('\n'), function (err, comment) {
        comment.should.be.an.Object.and.properties('desc');
        comment.desc.should.equal('This is the description.');
      });
    });

    it('should accept a multiline description', function () {
      commentParser([
        ' * This is the description.',
        ' * And it has multiple lines.'
      ].join('\n'), function (err, comment) {
        comment.should.be.an.Object.and.properties('desc');
        comment.desc.should.equal('This is the description. And it has multiple lines.');
      });
    });

    it('should accept a multiline description', function () {
      commentParser([
        ' * This is the description.',
        ' *',
        ' * And it has multiple lines.'
      ].join('\n'), function (err, comment) {
        comment.should.be.an.Object.and.properties('desc');
        comment.desc.should.equal('This is the description. \n And it has multiple lines.');
      });
    });
  });

  describe('example', function () {
    it('should accept an example', function () {
      commentParser([
        ' * @example var doc = parse(file);'
      ].join('\n'), function (err, comment) {
        comment.should.be.an.Object.and.properties('example');
        comment.example.should.equal('var doc = parse(file);');
      });
    });

    it('should accept a multi line example', function () {
      commentParser([
        ' * @example',
        ' * var parser = require(\'parser\');',
        ' *',
        ' * var doc = parser(\'/some/file.js\');',
      ].join('\n'), function (err, comment) {
        comment.should.be.an.Object.and.properties('example');
        comment.example.should.equal('var parser = require(\'parser\'); \n var doc = parser(\'/some/file.js\');');
      });
    });
  });

  describe('param, subparam', function () {
    it('should accept subparams', function () {
      commentParser([
        ' * @param firstParam {String} The first parameter.',
        ' * @param info {Object}',
        ' * @param info.firstname {String}',
        ' * @param info.surname {String} The persons last name.',
        ' * @param [info.age]',
      ].join('\n'), {
        type: 'function',
        name: 'Person'
      }, function (err, comment) {
        comment.should.be.an.Object.and.have.properties('type', 'name', 'params');

        comment.type.should.equal('function');
        comment.name.should.equal('Person');

        comment.params.should.be.an.Array.and.have.lengthOf(2);

        var param = comment.params[0];
        param.should.be.an.Object.and.have.properties('name', 'type', 'desc');
        param.name.should.equal('firstParam');
        param.type.should.equal('String');
        param.desc.should.equal('The first parameter.');

        param = comment.params[1];
        param.should.be.an.Object.and.have.properties('name', 'type', 'properties');
        param.name.should.equal('info');
        param.type.should.equal('Object');
        param.properties.should.be.an.Object.and.have.properties('age', 'firstname', 'surname');

        var subparams = param.properties;
        subparams.firstname.should.be.an.Object.and.have.property('type', 'String');
        subparams.surname.should.be.an.Object.and.have.properties('type', 'desc');
        subparams.surname.type.should.equal('String');
        subparams.surname.desc.should.equal('The persons last name.');
        subparams.age.should.be.an.Object.and.have.property('optional', true);
      });
    });

    it('should return an error if subparam doesn\'t have a master', function () {
      commentParser([
        ' * @param info.firstname',
      ].join('\n'), {
        type: 'function',
        name: 'Person'
      }, function (err) {
        err.should.be.an.Error;
        err.message.should.equal('No param info found. On line 1 of the comment');
      });
    });

    it('should return an error if subparam doesn\'t have a master', function () {
      commentParser([
        ' * @param info {Object}',
        ' * @param info.firstname',
        ' * @param wrong.firstname',
      ].join('\n'), {
        type: 'function',
        name: 'Person'
      }, function (err) {
        err.should.be.an.Error;
        err.message.should.equal('No param wrong found. On line 3 of the comment');
      });
    });

    it('should return an error if master param is not an object', function () {
      commentParser([
        ' * @param info {String}',
        ' * @param info.age',
      ].join('\n'), {
        type: 'function',
        name: 'Person'
      }, function (err) {
        err.should.be.an.Error;
        err.message.should.equal('Param info is not an object. On line 2 of the comment');
      });
    });
  });

  describe('return, subreturn', function () {
    it('should accept return', function () {
      commentParser([
        ' * @return {String} I returned a string.'
      ].join('\n'), {
        type: 'function',
        name: 'Person'
      }, function (err, comment) {
        comment.should.be.an.Object.and.have.properties('type', 'name', 'return');

        comment.type.should.equal('function');
        comment.name.should.equal('Person');
        comment.return.should.be.an.Object.and.have.properties('type', 'desc');
        comment.return.type.should.equal('String');
        comment.return.desc.should.equal('I returned a string.');
      });
    });

    it('should accept subreturn', function () {
      commentParser([
        ' * @return {Object} I returned an object.',
        ' * @return .name'
      ].join('\n'), {
        type: 'function',
        name: 'Person'
      }, function (err, comment) {
        comment.should.be.an.Object.and.have.properties('type', 'name', 'return');

        comment.type.should.equal('function');
        comment.name.should.equal('Person');
        comment.return.should.be.an.Object.and.have.properties('type', 'desc', 'properties');
        comment.return.type.should.equal('Object');
        comment.return.desc.should.equal('I returned an object.');
        comment.return.properties.should.be.an.Object.and.have.property('name');
        var subReturn = comment.return.properties.name;
        subReturn.should.be.an.Object;
      });
    });

    it('should accept subreturn with type', function () {
      commentParser([
        ' * @return {Object} I returned an object.',
        ' * @return .name {String}'
      ].join('\n'), {
        type: 'function',
        name: 'Person'
      }, function (err, comment) {
        comment.should.be.an.Object.and.have.properties('type', 'name', 'return');

        comment.type.should.equal('function');
        comment.name.should.equal('Person');
        comment.return.should.be.an.Object.and.have.properties('type', 'desc', 'properties');
        comment.return.type.should.equal('Object');
        comment.return.desc.should.equal('I returned an object.');
        comment.return.properties.should.be.an.Object.and.have.property('name');
        var subReturn = comment.return.properties.name;
        subReturn.should.be.an.Object.and.have.properties('type');
        subReturn.type.should.equal('String');
      });
    });

    it('should accept subreturn with description', function () {
      commentParser([
        ' * @return {Object} I returned an object.',
        ' * @return .name A property for the return object.'
      ].join('\n'), {
        type: 'function',
        name: 'Person'
      }, function (err, comment) {
        comment.should.be.an.Object.and.have.properties('type', 'name', 'return');

        comment.type.should.equal('function');
        comment.name.should.equal('Person');
        comment.return.should.be.an.Object.and.have.properties('type', 'desc', 'properties');
        comment.return.type.should.equal('Object');
        comment.return.desc.should.equal('I returned an object.');
        comment.return.properties.should.be.an.Object.and.have.property('name');
        var subReturn = comment.return.properties.name;
        subReturn.should.be.an.Object.and.have.properties('desc');
        subReturn.desc.should.equal('A property for the return object.');
      });
    });

    it('should accept subreturn with type and description', function () {
      commentParser([
        ' * @return {Object} I returned an object.',
        ' * @return .name {String} A property for the return object.'
      ].join('\n'), {
        type: 'function',
        name: 'Person'
      }, function (err, comment) {
        comment.should.be.an.Object.and.have.properties('type', 'name', 'return');

        comment.type.should.equal('function');
        comment.name.should.equal('Person');
        comment.return.should.be.an.Object.and.have.properties('type', 'desc', 'properties');
        comment.return.type.should.equal('Object');
        comment.return.desc.should.equal('I returned an object.');
        comment.return.properties.should.be.an.Object.and.have.property('name');
        var subReturn = comment.return.properties.name;
        subReturn.should.be.an.Object.and.have.properties('type', 'desc');
        subReturn.type.should.equal('String');
        subReturn.desc.should.equal('A property for the return object.');
      });
    });

    it('should return an error if there is no master return', function () {
      commentParser([
        ' * @return .name {String} A property for the return object.'
      ].join('\n'), {
        type: 'function',
        name: 'Person'
      }, function (err) {
        err.should.be.an.Error;
        err.message.should.equal('No master return. On line 1 of the comment');
      });
    });

    it('should return an error if return isn\'t an object', function () {
      commentParser([
        ' * @return {String} I returned an object.',
        ' * @return .name {String} A property for the return object.'
      ].join('\n'), {
        type: 'function',
        name: 'Person'
      }, function (err) {
        err.should.be.an.Error;
        err.message.should.equal('Return is not an object. On line 2 of the comment');
      });
    });
  });

  describe('this, subthis', function () {
    it('should accept this', function () {
      commentParser([
        ' * @this The this object.'
      ].join('\n'), {
        type: 'function',
        name: 'Person'
      }, function (err, comment) {
        comment.should.be.an.Object.and.have.properties('type', 'name', 'this');
        comment.type.should.equal('function');
        comment.name.should.equal('Person');
        comment.this.should.be.an.Object.and.have.properties('desc');
        comment.this.desc.should.equal('The this object.');
      });
    });

    it('should accept subthis', function () {
      commentParser([
        ' * @this .name'
      ].join('\n'), {
        type: 'function',
        name: 'Person'
      }, function (err, comment) {
        comment.should.be.an.Object.and.have.properties('type', 'name', 'this');
        comment.type.should.equal('function');
        comment.name.should.equal('Person');

        comment.this.should.be.an.Object.and.have.properties('properties');
        comment.this.properties.should.be.an.Object.and.have.property('name');
        comment.this.properties.name.should.be.an.Object;
      });
    });

    it('should accept subthis with type', function () {
      commentParser([
        ' * @this This object.',
        ' * @this .name {String}'
      ].join('\n'), {
        type: 'function',
        name: 'Person'
      }, function (err, comment) {
        comment.should.be.an.Object.and.have.properties('type', 'name', 'this');
        comment.type.should.equal('function');
        comment.name.should.equal('Person');

        comment.this.should.be.an.Object.and.have.properties('properties');
        comment.this.properties.should.be.an.Object.and.have.property('name');
        comment.this.properties.name.should.be.an.Object.and.have.property('type', 'String');
      });
    });

    it('should accept subthis with description', function () {
      commentParser([
        ' * @this .name A this object property.'
      ].join('\n'), {
        type: 'function',
        name: 'Person'
      }, function (err, comment) {
        comment.should.be.an.Object.and.have.properties('type', 'name', 'this');
        comment.type.should.equal('function');
        comment.name.should.equal('Person');

        comment.this.should.be.an.Object.and.have.properties('properties');
        comment.this.properties.should.be.an.Object.and.have.property('name');
        comment.this.properties.name.should.be.an.Object.and.have.property('desc', 'A this object property.');
      });
    });

    it('should accept subreturn with type and description', function () {
      commentParser([
        ' * @this This object.',
        ' * @this .name {String} A this object property.'
      ].join('\n'), {
        type: 'function',
        name: 'Person'
      }, function (err, comment) {
        comment.should.be.an.Object.and.have.properties('type', 'name', 'this');
        comment.type.should.equal('function');
        comment.name.should.equal('Person');

        comment.this.should.be.an.Object.and.have.properties('desc', 'properties');
        comment.this.desc.should.equal('This object.');
        comment.this.properties.should.be.an.Object.and.have.property('name');
        comment.this.properties.name.should.be.an.Object.and.have.properties('type', 'desc');
        comment.this.properties.name.type.should.equal('String');
        comment.this.properties.name.desc.should.equal('A this object property.');
      });
    });
  });

  describe('throws', function () {
    it('should accept mulitple throws', function () {
      commentParser([
        ' * @throws "Some error." The is caused by...',
        ' * @throws Some other error.',
        ' * @throws A lot of things can go wrong here...',
      ].join('\n'), {
        type: 'function',
        name: 'Person'
      }, function (err, comment) {
        comment.should.be.an.Object.and.have.properties('type', 'name', 'throws');
        comment.type.should.equal('function');
        comment.name.should.equal('Person');
        comment.throws.should.be.an.Array.and.have.lengthOf(3);
        comment.throws[0].should.be.an.Object.and.have.properties('msg', 'cause');
        comment.throws[0].msg.should.equal('Some error.');
        comment.throws[0].cause.should.equal('The is caused by...');
        comment.throws[1].should.be.an.Object.and.have.property('msg', 'Some other error.');
        comment.throws[2].should.be.an.Object.and.have.property('msg', 'A lot of things can go wrong here...');
      });
    });
  });

  describe('todo', function () {
    it('should accept todo', function () {
      commentParser([
        ' * @todo Something else.'
      ].join('\n'), function (err, comment) {
        comment.should.be.an.Object.and.properties('todos');
        comment.todos.should.be.an.Array.and.have.lengthOf(1);

        comment.todos[0].should.equal('Something else.');
      });
    });

    it('should accept list items todo', function () {
      commentParser([
        ' * @todo',
        ' * - Give the ability to wave.',
        ' * - Give the ability to smile.',
      ].join('\n'), function (err, comment) {
        comment.should.be.an.Object.and.properties('todos');
        comment.todos.should.be.an.Array.and.have.lengthOf(2);

        var todos = comment.todos;

        todos[0].should.equal('Give the ability to wave.');
        todos[1].should.equal('Give the ability to smile.');
      });
    });

    it('should accept a combination of list and single item todo', function () {
      commentParser([
        ' * @todo',
        ' * - Give the ability to wave.',
        ' * - Give the ability to smile.',
        ' *',
        ' * @todo Something else.'
      ].join('\n'), function (err, comment) {
        comment.should.be.an.Object.and.properties('todos');
        comment.todos.should.be.an.Array.and.have.lengthOf(3);

        var todos = comment.todos;

        todos[0].should.equal('Give the ability to wave.');
        todos[1].should.equal('Give the ability to smile.');
        todos[2].should.equal('Something else.');
      });
    });
  });

  it('should ignore @ mid description', function () {
    commentParser('/** Some description with @ in it. */', function (err, comment) {
      comment.should.be.an.Object.and.have.property('desc', 'Some description with @ in it.');
    });
  });

  it('should return undefined is the comment is empty', function () {
    commentParser('/**\n * \n */', function (err, comment) {
      should.equal(comment, undefined);
    });
  });

  it('should return an error if a tag is not supported', function () {
    commentParser('/** @wrongTag */', function (err) {
      err.should.be.an.Error;
      err.message.should.equal('Unknown tag: wrongTag. On line 1 of the comment');
    });
  });

  it('should return an error if the given input is not a string', function () {
    commentParser([], function (err) {
      err.should.be.an.Error;
      err.message.should.equal('Input comment not a string');
    });
  });
});
