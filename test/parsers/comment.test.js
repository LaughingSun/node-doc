require('should');

describe('Comment parser', function () {
  var commentParser = require('../../lib/parsers/comment');

  describe('access', function () {
    it('should accept access (private) tag', function () {
      var comment = commentParser([
        ' * @private',
        ' * @param firstParam {String} The first parameter.',
      ], {
        type: 'function',
        name: 'Person'
      });

      comment.should.be.an.Object.and.have.properties('type', 'name', 'params', 'access');

      comment.type.should.equal('function');
      comment.name.should.equal('Person');
      comment.access.should.equal('private');

      comment.params.should.be.an.Array.and.have.lengthOf(1);

      var param = comment.params[0];
      param.should.be.an.Object.and.have.properties('name', 'type', 'desc');
      param.name.should.equal('firstParam');
      param.type.should.equal('String');
      param.desc.should.equal('The first parameter.');
    });
  });

  describe('callback', function () {
    it('should accept an callback with name, desc and with params', function () {
      var comment = commentParser([
        ' * @callback myCallback My description of the callback.',
        ' * @param err {Error} An possible error.',
        ' * @param result',
      ], {});

      comment.should.be.an.Object.and.have.properties('type', 'name', 'desc', 'params');
      comment.type.should.equal('Callback');
      comment.name.should.equal('myCallback');
      comment.desc.should.equal('My description of the callback.');
      comment.params.should.be.an.Array.and.have.lengthOf(2);

      var params = comment.params;
      params[0].should.be.a.Object.and.have.properties('name', 'type', 'desc');
      params[0].name.should.equal('err');
      params[0].type.should.equal('Error');
      params[0].desc.should.equal('An possible error.');
      params[1].should.be.a.Object.and.have.properties('name');
      params[1].name.should.equal('result');
    });

    it('should accept an callback with only a name', function () {
      var comment = commentParser([
        ' * @callback myCallback'
      ]);

      comment.should.be.an.Object.and.have.properties('type', 'name');
      comment.type.should.equal('Callback');
      comment.name.should.equal('myCallback');
    });

    it('should throw if no name is given', function () {
      (function () {
        var comment = commentParser([
          ' * @callback'
        ]);
      }).should.throw('Doesn\'t have a name');
    });
  });

  describe('constant', function () {
    it('should accept a constant', function () {
      var comment = commentParser([
        ' * @constant'
      ], {
        type: 'Number',
        name: 'MY_CONSTANT'
      });

      comment.should.be.an.Object.and.properties('constant', 'type', 'name');
      comment.constant.should.be.true;
      comment.type.should.equal('Number');
      comment.name.should.equal('MY_CONSTANT');
    });

    it('should accept a with type and description', function () {
      var comment = commentParser([
        ' * @constant MY_OTHER_CONSTANT {String} Don\'t change this!'
      ], {
        type: 'String',
        name: 'MY_OTHER_CONSTANT'
      });

      comment.should.be.an.Object.and.properties('constant', 'type', 'name', 'desc');
      comment.constant.should.be.true;
      comment.type.should.equal('String');
      comment.name.should.equal('MY_OTHER_CONSTANT');
      comment.desc.should.equal('Don\'t change this!');
    });

    it('should throw if constant type in docs and code do not match', function () {
      (function () {
        var comment = commentParser([
          ' * @constant MY_CONSTANT {Number}'
        ], {
          type: 'String',
          name: 'MY_CONSTANT'
        });
      }).should.throw('Type in doc & code do not match');
    });

    it('should throw if constant name in docs and code do not match', function () {
      (function () {
        var comment = commentParser([
          ' * @constant MY_CONSTANT {String}'
        ], {
          type: 'String',
          name: 'MY_OTHER_CONSTANT'
        });
      }).should.throw('Name in doc & code do not match');
    });
  });

  describe('constructor', function () {
    it('should accept constructor', function () {
      var comment = commentParser([
        ' * @access public',
        ' * @constructor'
      ], {
        type: 'function',
        name: 'Person'
      });

      comment.should.be.an.Object.and.have.properties('type', 'name', 'constructor');

      comment.type.should.equal('Constructor');
      comment.name.should.equal('Person');
    });
  });

  describe('deprecated', function () {
    it('should accept deprecated', function () {
      var comment = commentParser([
        ' * @access public',
        ' * @deprecated'
      ], {
        type: 'function',
        name: 'Person'
      });

      comment.should.be.an.Object.and.have.properties('type', 'name', 'deprecated');

      comment.type.should.equal('function');
      comment.name.should.equal('Person');

      comment.deprecated.should.be.true;
    });

    it('should accept deprecated with an message', function () {
      var comment = commentParser([
        ' * @access public',
        ' * @deprecated Use Alien instead.'
      ], {
        type: 'function',
        name: 'Person'
      });

      comment.should.be.an.Object.and.have.properties('type', 'name', 'deprecated');

      comment.type.should.equal('function');
      comment.name.should.equal('Person');

      comment.deprecated.should.equal('Use Alien instead.');
    });
  });

  describe('desc', function () {
    it('should accept a desc', function () {
      var comment = commentParser([
        ' * This is the description.'
      ], {});

      comment.should.be.an.Object.and.properties('desc');
      comment.desc.should.equal('This is the description.');
    });

    it('should accept a multiline desc', function () {
      var comment = commentParser([
        ' * This is the description,',
        ' * and it has multiple lines.'
      ], {});

      comment.should.be.an.Object.and.properties('desc');
      comment.desc.should.equal('This is the description, and it has multiple lines.');
    });

    it('should accept a multiline desc', function () {
      var comment = commentParser([
        ' * This is the description,',
        ' *',
        ' * and it has multiple lines.'
      ], {});

      comment.should.be.an.Object.and.properties('desc');
      comment.desc.should.equal('This is the description, \n and it has multiple lines.');
    });
  });

  describe('example', function () {
    it('should accept an example', function () {
      var comment = commentParser([
        ' * @example var doc = parse(file);'
      ], {});

      comment.should.be.an.Object.and.properties('example');
      comment.example.should.equal('var doc = parse(file);');
    });

    it('should accept an multi line example', function () {
      var comment = commentParser([
        ' * @example',
        ' * var parser = require(\'parser\');',
        ' *',
        ' * var doc = parser(\'/some/file.js\');',
      ], {});

      comment.should.be.an.Object.and.properties('example');
      comment.example.should.equal('var parser = require(\'parser\');' +
        ' \n var doc = parser(\'/some/file.js\');');
    });
  });

  describe('param, subparam', function () {
    it('should accept subparams', function () {
      var comment = commentParser([
        ' * @param firstParam {String} The first parameter.',
        ' * @param info {Object}',
        ' * @param info.firstname {String}',
        ' * @param info.surname {String} The persons last name.',
        ' * @param [info.age]',
      ], {
        type: 'function',
        name: 'Person'
      });

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

    it('should throw if subparam doesn\'t have a parent', function () {
      (function () {
        var comment = commentParser([
          ' * @param info.firstname {String}',
          ' * @param info.surname {String} The persons last name.',
          ' * @param info.age',
          ' * ',
          ' * @todo Add height.'
        ], {
          type: 'function',
          name: 'Person'
        });
      }).should.throw('No param: info');
    });

    it('should throw if parent param is not an object', function () {
      (function () {
        var comment = commentParser([
          ' * @param info {String}',
          ' * @param info.age',
        ], {
          type: 'function',
          name: 'Person'
        });
      }).should.throw('Param info is not an object');
    });
  });

  describe('return, subreturn', function () {
    it('should accept return', function () {
      var comment = commentParser([
        ' * @return {String} I returned a string.'
      ], {
        type: 'function',
        name: 'Person'
      });

      comment.should.be.an.Object.and.have.properties('type', 'name', 'return');

      comment.type.should.equal('function');
      comment.name.should.equal('Person');
      comment.return.should.be.an.Object.and.have.properties('type', 'desc');
      comment.return.type.should.equal('String');
      comment.return.desc.should.equal('I returned a string.');
    });

    it('should accept subreturn', function () {
      var comment = commentParser([
        ' * @return {Object} I returned an object.',
        ' * @return .name'
      ], {
        type: 'function',
        name: 'Person'
      });

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

    it('should accept subreturn with type', function () {
      var comment = commentParser([
        ' * @return {Object} I returned an object.',
        ' * @return .name {String}'
      ], {
        type: 'function',
        name: 'Person'
      });

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

    it('should accept subreturn with desc', function () {
      var comment = commentParser([
        ' * @return {Object} I returned an object.',
        ' * @return .name A property for the return object.'
      ], {
        type: 'function',
        name: 'Person'
      });

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

    it('should accept subreturn with type and desc', function () {
      var comment = commentParser([
        ' * @return {Object} I returned an object.',
        ' * @return .name {String} A property for the return object.'
      ], {
        type: 'function',
        name: 'Person'
      });

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

    it('should throw if there is no master return', function () {
      (function () {
        var comment = commentParser([
          ' * @return .name {String} A property for the return object.'
        ], {
          type: 'function',
          name: 'Person'
        });
      }).should.throw('No master return');
    });

    it('should throw if return isn\'t an object', function () {
      (function () {
        var comment = commentParser([
          ' * @return {String} I returned an object.',
          ' * @return .name {String} A property for the return object.'
        ], {
          type: 'function',
          name: 'Person'
        });
      }).should.throw('Return is not an object');
    });
  });

  describe('this, subthis', function () {
    it('should accept this', function () {
      var comment = commentParser([
        ' * @this The this object.'
      ], {
        type: 'function',
        name: 'Person'
      });

      comment.should.be.an.Object.and.have.properties('type', 'name', 'this');

      comment.type.should.equal('function');
      comment.name.should.equal('Person');
      comment.this.should.be.an.Object.and.have.properties('desc');
      comment.this.desc.should.equal('The this object.');
    });

    it('should accept subthis', function () {
      var comment = commentParser([
        ' * @this .name'
      ], {
        type: 'function',
        name: 'Person'
      });

      comment.should.be.an.Object.and.have.properties('type', 'name', 'this');
      comment.type.should.equal('function');
      comment.name.should.equal('Person');

      comment.this.should.be.an.Object.and.have.properties('properties');
      comment.this.properties.should.be.an.Object.and.have.property('name');
      comment.this.properties.name.should.be.an.Object;
    });

    it('should accept subthis with type', function () {
      var comment = commentParser([
        ' * @this This object.',
        ' * @this .name {String}'
      ], {
        type: 'function',
        name: 'Person'
      });

      comment.should.be.an.Object.and.have.properties('type', 'name', 'this');
      comment.type.should.equal('function');
      comment.name.should.equal('Person');

      comment.this.should.be.an.Object.and.have.properties('properties');
      comment.this.properties.should.be.an.Object.and.have.property('name');
      comment.this.properties.name.should.be.an.Object.and.have.property('type', 'String');
    });

    it('should accept subthis with desc', function () {
      var comment = commentParser([
        ' * @this .name A this object property.'
      ], {
        type: 'function',
        name: 'Person'
      });

      comment.should.be.an.Object.and.have.properties('type', 'name', 'this');
      comment.type.should.equal('function');
      comment.name.should.equal('Person');

      comment.this.should.be.an.Object.and.have.properties('properties');
      comment.this.properties.should.be.an.Object.and.have.property('name');
      comment.this.properties.name.should.be.an.Object.and.have.property('desc', 'A this object property.');
    });

    it('should accept subreturn with type and desc', function () {
      var comment = commentParser([
        ' * @this This object.',
        ' * @this .name {String} A this object property.'
      ], {
        type: 'function',
        name: 'Person'
      });

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

  describe('throws', function () {
    it('should accept subparams', function () {
      var comment = commentParser([
        ' * @throws Some error.',
        ' * @throws Some other error.',
        ' * @throws A lot of things can go wrong here...',
      ], {
        type: 'function',
        name: 'Person'
      });

      comment.should.be.an.Object.and.have.properties('type', 'name', 'throws');

      comment.type.should.equal('function');
      comment.name.should.equal('Person');
      comment.throws.should.be.an.Array.and.have.lengthOf(3);
      comment.throws[0].should.equal('Some error.');
      comment.throws[1].should.equal('Some other error.');
      comment.throws[2].should.equal('A lot of things can go wrong here...');
    });
  });

  describe('todo', function () {
    it('should accept todo', function () {
      var comment = commentParser([
        ' * @todo',
        ' * - Give the ability to wave.',
        ' * - Give the ability to smile.',
        ' *',
        ' * @todo Something else.'
      ], {});

      comment.should.be.an.Object.and.properties('todos');
      comment.todos.should.be.an.Array.and.have.lengthOf(3);

      var todos = comment.todos;

      todos[0].should.equal('Give the ability to wave.');
      todos[1].should.equal('Give the ability to smile.');
      todos[2].should.equal('Something else.');
    });
  });

  it('should throw if a tag is not supported', function () {
    (function () {
      var comment = commentParser([
        ' * @someTag'
      ], {
        type: 'function',
        name: 'Person'
      });
    }).should.throw('Unknown tag: someTag');
  });

  it('should throw if the given input is not an array', function () {
    (function () {
      var comment = commentParser('', {});
    }).should.throw('Not an array');
  });
});
