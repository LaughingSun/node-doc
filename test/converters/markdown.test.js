var should = require('should')
  , merge = require('sak-merge');

describe('Markdown', function () {
  var toMarkdown = require('../../lib/converters/markdown');

  it('should return the documentation in markdown', function () {
    var doc = toMarkdown({
      name: 'my-app'
    });

    doc.should.be.an.Object.and.have.property('README.md');
    var md = doc['README.md'].split('\n')
      , i = 0;

    md[i++].should.equal('# My-app');
    md[i++].should.equal('');
    md[i++].should.equal('Generated by [Node-doc](https://github.com/Thomasdezeeuw/node-doc/ "Node-doc").');
  });

  it('should accept a description, license and version', function () {
    var doc = toMarkdown({
      name: 'my-app',
      desc: 'My awesome application.',
      license: 'MIT',
      version: '1.0.0'
    });

    doc.should.be.an.Object.and.have.property('README.md');
    var md = doc['README.md'].split('\n')
      , i = 0;

    md[i++].should.equal('# My-app');
    md[i++].should.equal('');
    md[i++].should.equal('> Version 1.0.0.');
    md[i++].should.equal('');
    md[i++].should.equal('My awesome application.');
    md[i++].should.equal('');
    md[i++].should.equal('Released under a MIT license.');
    md[i++].should.equal('');
    md[i++].should.equal('Generated by [Node-doc](https://github.com/Thomasdezeeuw/node-doc/ "Node-doc").');
  });

  describe('Author', function () {
    it('should accept name only', function () {
      var doc = toMarkdown({
        name: 'my-app',
        author: {
          name: 'Thomas de Zeeuw'
        },
      });

      doc.should.be.an.Object.and.have.property('README.md');
      var md = doc['README.md'].split('\n')
        , i = 0;

      md[i++].should.equal('# My-app');
      md[i++].should.equal('');
      md[i++].should.equal('Created by Thomas de Zeeuw.');
      md[i++].should.equal('');
      md[i++].should.equal('Generated by [Node-doc](https://github.com/Thomasdezeeuw/node-doc/ "Node-doc").');
    });

    it('should accept name and email only', function () {
      var doc = toMarkdown({
        name: 'my-app',
        author: {
          name: 'Thomas de Zeeuw',
          email: 'thomasdezeeuw@gmail.com'
        },
      });

      doc.should.be.an.Object.and.have.property('README.md');
      var md = doc['README.md'].split('\n')
        , i = 0;

      md[i++].should.equal('# My-app');
      md[i++].should.equal('');
      md[i++].should.equal('Created by Thomas de Zeeuw, [thomasdezeeuw@gmail.com](mailto:thomasdezeeuw@gmail.com).');
      md[i++].should.equal('');
      md[i++].should.equal('Generated by [Node-doc](https://github.com/Thomasdezeeuw/node-doc/ "Node-doc").');
    });

    it('should accept name and website only', function () {
      var doc = toMarkdown({
        name: 'my-app',
        author: {
          name: 'Thomas de Zeeuw',
          website: 'https://thomasdezeeuw.nl/'
        },
      });

      doc.should.be.an.Object.and.have.property('README.md');
      var md = doc['README.md'].split('\n')
        , i = 0;

      md[i++].should.equal('# My-app');
      md[i++].should.equal('');
      md[i++].should.equal('Created by Thomas de Zeeuw ([https://thomasdezeeuw.nl/](https://thomasdezeeuw.nl/)).');
      md[i++].should.equal('');
      md[i++].should.equal('Generated by [Node-doc](https://github.com/Thomasdezeeuw/node-doc/ "Node-doc").');
    });

    it('should accept name, email and website', function () {
      var doc = toMarkdown({
        name: 'my-app',
        author: {
          name: 'Thomas de Zeeuw',
          email: 'thomasdezeeuw@gmail.com',
          website: 'https://thomasdezeeuw.nl/'
        },
      });

      doc.should.be.an.Object.and.have.property('README.md');
      var md = doc['README.md'].split('\n')
        , i = 0;

      md[i++].should.equal('# My-app');
      md[i++].should.equal('');
      md[i++].should.equal('Created by Thomas de Zeeuw, [thomasdezeeuw@gmail.com](mailto:thomasdezeeuw@gmail.com) ([https://thomasdezeeuw.nl/](https://thomasdezeeuw.nl/)).');
      md[i++].should.equal('');
      md[i++].should.equal('Generated by [Node-doc](https://github.com/Thomasdezeeuw/node-doc/ "Node-doc").');
    });
  });

  describe('Todos', function () {
    it('should add todos to the documentation and create a file for all todos', function () {
      var doc = toMarkdown({
        name: 'my-app',
        todos: {
          global: [
            'Fix that little bug.',
            'Write better documentation.'
          ]
        }
      });

      doc.should.be.an.Object.and.have.properties('README.md', 'TODO.md');
      var md = doc['README.md'].split('\n')
        , i = 0;

      md[i++].should.equal('# My-app');
      md[i++].should.equal('');
      md[i++].should.equal('## Todo');
      md[i++].should.equal('');
      md[i++].should.equal('- [ ] Fix that little bug.');
      md[i++].should.equal('- [ ] Write better documentation.');
      md[i++].should.equal('');
      md[i++].should.equal('Generated by [Node-doc](https://github.com/Thomasdezeeuw/node-doc/ "Node-doc").');

      var todo = doc['TODO.md'].split('\n')
        , j = 0;

      todo[j++].should.equal('# Todo');
      todo[j++].should.equal('');
      todo[j++].should.equal('- [ ] Fix that little bug.');
      todo[j++].should.equal('- [ ] Write better documentation.');
    });

    it('should create a file for all todos', function () {
      var doc = toMarkdown({
        name: 'my-app',
        todos: {
          CreateApplication: [
            'Use a timer to check to try to bind to a port if it\'s taken.'
          ],
          destroyApplication: [
            'Delete this function.'
          ]
        }
      });

      doc.should.be.an.Object.and.have.properties('README.md', 'TODO.md');
      var md = doc['README.md'].split('\n')
        , i = 0;

      md[i++].should.equal('# My-app');
      md[i++].should.equal('');
      md[i++].should.equal('Generated by [Node-doc](https://github.com/Thomasdezeeuw/node-doc/ "Node-doc").');

      var todo = doc['TODO.md'].split('\n')
        , j = 0;

      todo[j++].should.equal('# Todo');
      todo[j++].should.equal('');
      todo[j++].should.equal('## CreateApplication');
      todo[j++].should.equal('');
      todo[j++].should.equal('- [ ] Use a timer to check to try to bind to a port if it\'s taken.');
      todo[j++].should.equal('');
      todo[j++].should.equal('## DestroyApplication');
      todo[j++].should.equal('');
      todo[j++].should.equal('- [ ] Delete this function.');
    });
  });

  describe('Namespaces', function () {
    it('should create a file for each namespace', function () {
      var doc = toMarkdown({
        name: 'my-app',
        ns: {
          ns1: {
            name: 'ns1'
          },
          ns2: {
            name: 'ns2'
          }
        }
      });

      doc.should.be.an.Object.and.have.property('README.md');
      var md = doc['README.md'].split('\n')
        , i = 0;

      md[i++].should.equal('# My-app');
      md[i++].should.equal('');
      md[i++].should.equal('Generated by [Node-doc](https://github.com/Thomasdezeeuw/node-doc/ "Node-doc").');

      var ns1 = doc['ns1.md'].split('\n')
        , j = 0;

      ns1[j++].should.equal('# Ns1');
      ns1[j++].should.equal('');
      ns1[j++].should.equal('Generated by [Node-doc](https://github.com/Thomasdezeeuw/node-doc/ "Node-doc").');

      var ns2 = doc['ns2.md'].split('\n')
        , k = 0;

      ns2[k++].should.equal('# Ns2');
      ns2[k++].should.equal('');
      ns2[k++].should.equal('Generated by [Node-doc](https://github.com/Thomasdezeeuw/node-doc/ "Node-doc").');
    });
  });

  describe('Exports', function () {
    it('should accept a function as export', function () {
      var doc = toMarkdown({
        name: 'my-app',
        exports: {
          type: 'Function'
        }
      });

      doc.should.be.an.Object.and.have.property('README.md');
      var md = doc['README.md'].split('\n')
        , i = 0;

      md[i++].should.equal('# My-app');
      md[i++].should.equal('');
      md[i++].should.equal('## Exports');
      md[i++].should.equal('');
      md[i++].should.equal('> Function.');
      md[i++].should.equal('');
      md[i++].should.equal('Generated by [Node-doc](https://github.com/Thomasdezeeuw/node-doc/ "Node-doc").');
    });

    it('should accept a constructor as export', function () {
      var doc = toMarkdown({
        name: 'my-app',
        exports: {
          type: 'Constructor'
        }
      });

      doc.should.be.an.Object.and.have.property('README.md');
      var md = doc['README.md'].split('\n')
        , i = 0;

      md[i++].should.equal('# My-app');
      md[i++].should.equal('');
      md[i++].should.equal('## Exports');
      md[i++].should.equal('');
      md[i++].should.equal('> Constructor.');
      md[i++].should.equal('');
      md[i++].should.equal('Generated by [Node-doc](https://github.com/Thomasdezeeuw/node-doc/ "Node-doc").');
    });

    it('should accept a constant as export', function () {
      var doc = toMarkdown({
        name: 'my-app',
        exports: {
          type: 'Number',
          constant: true
        }
      });

      doc.should.be.an.Object.and.have.property('README.md');
      var md = doc['README.md'].split('\n')
        , i = 0;

      md[i++].should.equal('# My-app');
      md[i++].should.equal('');
      md[i++].should.equal('## Exports');
      md[i++].should.equal('');
      md[i++].should.equal('> Number, **constant**.');
      md[i++].should.equal('');
      md[i++].should.equal('Generated by [Node-doc](https://github.com/Thomasdezeeuw/node-doc/ "Node-doc").');
    });
  });

  it('should accept functions', function () {
    var doc = toMarkdown({
      name: 'my-app',
      functions: {
        'myFunction': {
          name: 'myFunction',
          type: 'Function'
        },
        'myFunction2': {
          name: 'myFunction2',
          type: 'Function',
          todos: [
            'Something',
            'I',
            'need',
            'to',
            'do'
          ],
          example: 'var rtn = myFunction2(param1, param2);',
          params: [
            {
              name: 'param1'
            },
            {
              name: 'param2',
              desc: 'My second parameter',
              type: 'Object',
              optional: true,
              properties: {
                subParam1: {
                  name: 'subParam1'
                },
                subParam2: {
                  name: 'subParam2',
                  desc: 'My second subparameter',
                  type: 'String',
                  optional: true
                }
              }
            }
          ],
          this: {
            desc: 'The description of this',
            properties: {
              this1: {
                name: 'this1'
              },
              this2: {
                name: 'this2',
                desc: 'The description',
                type: 'String'
              }
            }
          },
          throws: [
            {
              msg: 'An error'
            },
            {
              msg: 'Another error',
              cause: 'Stop doing it!'
            }
          ],
          return: {
            properties: {
              return1: {
                name: 'return1'
              },
              return2: {
                name: 'return2',
                desc: 'Return 2 description',
                type: 'String'
              }
            }
          }
        },
        'myFunction3': {
          name: 'myFunction3',
          type: 'Function',
          this: {},
          return: {}
        },
        'myFunction4': {
          name: 'myFunction4',
          type: 'Function',
          return: {
            desc: 'Return description'
          }
        }
      }
    });

    doc.should.be.an.Object.and.have.property('README.md');
    var md = doc['README.md'].split('\n')
      , i = 0;

    md[i++].should.equal('# My-app');
    md[i++].should.equal('');
    md[i++].should.equal('## Functions');
    md[i++].should.equal('');
    md[i++].should.equal('### MyFunction');
    md[i++].should.equal('');
    md[i++].should.equal('> Function.');
    md[i++].should.equal('');
    md[i++].should.equal('### MyFunction2');
    md[i++].should.equal('');
    md[i++].should.equal('> Function.');
    md[i++].should.equal('');
    md[i++].should.equal('#### Todo');
    md[i++].should.equal('');
    md[i++].should.equal('- [ ] Something');
    md[i++].should.equal('- [ ] I');
    md[i++].should.equal('- [ ] need');
    md[i++].should.equal('- [ ] to');
    md[i++].should.equal('- [ ] do');
    md[i++].should.equal('');
    md[i++].should.equal('#### Example');
    md[i++].should.equal('');
    md[i++].should.equal('```javascript');
    md[i++].should.equal('var rtn = myFunction2(param1, param2);');
    md[i++].should.equal('```');
    md[i++].should.equal('');
    md[i++].should.equal('#### Params');
    md[i++].should.equal('');
    md[i++].should.equal('|Name            |Description           |Type  |Optional|');
    md[i++].should.equal('|----------------|----------------------|------|--------|');
    md[i++].should.equal('|param1          |                      |      |        |');
    md[i++].should.equal('|param2          |My second parameter   |Object|Yes     |');
    md[i++].should.equal('|param2.subParam1|                      |      |        |');
    md[i++].should.equal('|param2.subParam2|My second subparameter|String|Yes     |');
    md[i++].should.equal('');
    md[i++].should.equal('#### This');
    md[i++].should.equal('');
    md[i++].should.equal('The description of this.');
    md[i++].should.equal('');
    md[i++].should.equal('##### Properties');
    md[i++].should.equal('');
    md[i++].should.equal('###### This1');
    md[i++].should.equal('');
    md[i++].should.equal('*No further information avaiable*.');
    md[i++].should.equal('');
    md[i++].should.equal('###### This2');
    md[i++].should.equal('');
    md[i++].should.equal('The description.');
    md[i++].should.equal('');
    md[i++].should.equal('> String.');
    md[i++].should.equal('');
    md[i++].should.equal('#### Possible errors');
    md[i++].should.equal('');
    md[i++].should.equal('|Message      |Cause         |');
    md[i++].should.equal('|-------------|--------------|');
    md[i++].should.equal('|An error     |              |');
    md[i++].should.equal('|Another error|Stop doing it!|');
    md[i++].should.equal('');
    md[i++].should.equal('#### Return');
    md[i++].should.equal('');
    md[i++].should.equal('|Name   |Description         |Type  |');
    md[i++].should.equal('|-------|--------------------|------|');
    md[i++].should.equal('|       |                    |      |');
    md[i++].should.equal('|return1|                    |      |');
    md[i++].should.equal('|return2|Return 2 description|String|');
    md[i++].should.equal('');
    md[i++].should.equal('### MyFunction3');
    md[i++].should.equal('');
    md[i++].should.equal('> Function.');
    md[i++].should.equal('');
    md[i++].should.equal('#### This');
    md[i++].should.equal('');
    md[i++].should.equal('*No further information avaiable*.');
    md[i++].should.equal('');
    md[i++].should.equal('#### Return');
    md[i++].should.equal('');
    md[i++].should.equal('*No further information avaiable*.');
    md[i++].should.equal('');
    md[i++].should.equal('### MyFunction4');
    md[i++].should.equal('');
    md[i++].should.equal('> Function.');
    md[i++].should.equal('');
    md[i++].should.equal('#### Return');
    md[i++].should.equal('');
    md[i++].should.equal('|Description       |');
    md[i++].should.equal('|------------------|');
    md[i++].should.equal('|Return description|');
    md[i++].should.equal('');
    md[i++].should.equal('Generated by [Node-doc](https://github.com/Thomasdezeeuw/node-doc/ "Node-doc").');
  });

  it('should accept callbacks', function () {
    var doc = toMarkdown({
      name: 'my-app',
      callbacks: {
        myCallback: {
          name: 'myCallback',
          type: 'Callback'
        },
        myCallback2: {
          name: 'myCallback2',
          type: 'Callback',
          desc: 'A callback',
          params: [
            {
              name: 'error',
              desc: 'A possible error',
              optional: true,
              type: 'Error'
            },
            {
              name: 'return'
            }
          ]
        }
      }
    });

    doc.should.be.an.Object.and.have.property('README.md');
    var md = doc['README.md'].split('\n')
      , i = 0;

    md[i++].should.equal('# My-app');
    md[i++].should.equal('');
    md[i++].should.equal('## Callbacks');
    md[i++].should.equal('');
    md[i++].should.equal('### MyCallback');
    md[i++].should.equal('');
    md[i++].should.equal('> Callback.');
    md[i++].should.equal('');
    md[i++].should.equal('### MyCallback2');
    md[i++].should.equal('');
    md[i++].should.equal('> Callback.');
    md[i++].should.equal('');
    md[i++].should.equal('A callback.');
    md[i++].should.equal('');
    md[i++].should.equal('#### Params');
    md[i++].should.equal('');
    md[i++].should.equal('|Name  |Description     |Type |Optional|');
    md[i++].should.equal('|------|----------------|-----|--------|');
    md[i++].should.equal('|error |A possible error|Error|Yes     |');
    md[i++].should.equal('|return|                |     |        |');
    md[i++].should.equal('');
    md[i++].should.equal('Generated by [Node-doc](https://github.com/Thomasdezeeuw/node-doc/ "Node-doc").');
  });

  it('should accept constants', function () {
    var doc = toMarkdown({
      name: 'my-app',
      constants: {
        MY_CONSTANT: {
          name: 'MY_CONSTANT',
          constant: true,
          type: 'Number'
        },
        MY_CONSTANT2: {
          name: 'MY_CONSTANT2',
          constant: true,
          type: 'Number',
          deprecated: true,
          access: 'private',
          desc: 'This constant is really usefull'
        },
        MY_CONSTANT3: {
          name: 'MY_CONSTANT',
          constant: true
        }
      }
    });

    doc.should.be.an.Object.and.have.property('README.md');
    var md = doc['README.md'].split('\n')
      , i = 0;

    md[i++].should.equal('# My-app');
    md[i++].should.equal('');
    md[i++].should.equal('## Constants');
    md[i++].should.equal('');
    md[i++].should.equal('### MY_CONSTANT');
    md[i++].should.equal('');
    md[i++].should.equal('> Number, **constant**.');
    md[i++].should.equal('');
    md[i++].should.equal('### MY_CONSTANT2');
    md[i++].should.equal('');
    md[i++].should.equal('> Number, **constant**, **deprecated**, *private*.');
    md[i++].should.equal('');
    md[i++].should.equal('This constant is really usefull.');
    md[i++].should.equal('');
    md[i++].should.equal('### MY_CONSTANT');
    md[i++].should.equal('');
    md[i++].should.equal('*No further information avaiable*.');
    md[i++].should.equal('');
    md[i++].should.equal('Generated by [Node-doc](https://github.com/Thomasdezeeuw/node-doc/ "Node-doc").');
  });
});
