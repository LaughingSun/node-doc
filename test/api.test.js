require('should');

var mock = require('mock-fs')
  , fs = require('fs');

describe('Api', function () {
  var parser = require('../lib/api')
    , dir = __dirname + '/lib/';

  var files = {};
  files[dir] = {
    'person.js': [
      '/**',
      ' * @todo',
      ' * - Give the ability to wave.',
      ' * - Give the ability to smile.',
      ' */',
      '',
      '/**',
      ' * @title Person',
      ' * @desc Create a new person.',
      ' * @public',
      ' * @constructor',
      ' *',
      ' * @todo Accept an first and surname.',
      ' *',
      ' * @param information {Object} Information about the person.',
      ' * @param information.name {String} Persons name.',
      ' * @param information.age {Number} Persons age.',
      ' * @return {Object} A new person with his/her name and age.',
      ' * @return .name {String} Persons name.',
      ' * @return .age {Number} Persons age.',
      ' *',
      ' * @throws You\'re over a thousand years old!',
      ' */',
      'function Person (information) {',
      '  if (information.age > 100) {',
      '    throw new Error(\'You\'re over a thousand years old!\');',
      '  }',
      '',
      '  this.name = information.name',
      '  this.age = information.age',
      '',
      '  return this',
      '}'
    ].join('\n'),
    'constant.js': [
      '/**',
      ' * @constant {Number} The default length.',
      ' */',
      'var DEF_LENGTH = 1.5;',
      '',
      '/**',
      ' * @constant {Number}',
      ' * @deprecated',
      ' */',
      'var MIN_LENGTH = 0.5;',
      '',
      '/**',
      ' * @constant',
      ' * @deprecated People are tall these days.',
      ' */',
      'var MAX_LENGTH = 5;'
    ].join('\n'),
    dir: {
      'constant.js': [
        '/**',
        ' * @constant',
        ' * @deprecated People are tall these days.',
        ' */',
        'var MAX_LENGTH = 5;',
        '',
        '/**',
        ' * @constant {Number}',
        ' * @private',
        ' */',
        'var MIN_LENGTH = 0.5;'
      ].join('\n'),
      'private.js': [
        '/**',
        ' * @constant {Number}',
        ' * @private',
        ' */',
        'var PRIVATE_VAR = 0.5;'
      ].join('\n')
    },
    'empty-dir': {},
    'ignore.md': 'Ignore this.'
  };

  before(function () {
    mock(files);
  });

  after(function () {
    mock.restore();
  });

  it('should parse a file', function () {
    var file = 'person'
      , doc = parser(dir + file + '.js');

    checkPersonJson(doc);
  });

  it('should parse all files in a directory', function () {
    var doc = parser(dir);

    doc.should.be.an.Object.and.have.properties('person', 'constant');
    checkConstantJson(doc.constant)
    checkPersonJson(doc.person);
  });

  it('should parse a file and save it to a file', function () {
    var file = 'person'
      , input = dir + file + '.js'
      , output = __dirname + '/doc1/' + file + '.json';

    parser(input, output);

    var doc = JSON.parse(fs.readFileSync(output, 'utf-8'));

    checkPersonJson(doc);
  });

  it('should parse a file and save it to a directory', function () {
    var file = 'person'
      , input = dir + file + '.js'
      , output = __dirname + '/doc2/';

    parser(input, output);

    var doc = JSON.parse(fs.readFileSync(output + file + '.json', 'utf-8'));

    checkPersonJson(doc);
  });

  it('should parse all files in a directory and sub directory\'s and save them', function () {
    var input = dir
      , output = __dirname + '/doc3';

    parser(input, output);

    var doc = {
      'person': JSON.parse(fs.readFileSync(output + '/person.json', 'utf-8')),
      'constant': JSON.parse(fs.readFileSync(output + '/constant.json', 'utf-8')),
      'subConstant': JSON.parse(fs.readFileSync(output + '/dir/constant.json', 'utf-8'))
    };

    checkConstantJson(doc.constant)
    checkPersonJson(doc.person);
    checkConstantSubJson(doc.subConstant);
  });

  it('should show private comments with private true', function () {
    var input = dir
      , output = __dirname + '/doc3';

    parser(input, output, {private: true});

    var doc = {
      'person': JSON.parse(fs.readFileSync(output + '/person.json', 'utf-8')),
      'constant': JSON.parse(fs.readFileSync(output + '/constant.json', 'utf-8')),
      'subConstant': JSON.parse(fs.readFileSync(output + '/dir/constant.json', 'utf-8'))
    };

    checkConstantJson(doc.constant)
    checkPersonJson(doc.person);
    checkConstantSubJson(doc.subConstant, true);
  });

  it('should parse a file and convert to markdown', function () {
    var doc = parser(dir + 'person.js', {result: 'markdown'});
    checkPersonMd(doc);
  });

  it('should parse all files in a directory and sub directory\'s and convert to markdown', function () {
    var doc = parser(dir, {result: 'markdown'});

    doc.should.be.an.Object.and.have.properties('person', 'constant', 'dir');
    doc.dir.should.be.an.Object.and.have.property('constant');

    checkPersonMd(doc.person);
    checkConstantMd(doc.constant);
    checkConstantSubMd(doc.dir.constant);
  });

  it('should parse all files in a directory and sub directory\'s and convert to markdown with private comments', function () {
    var doc = parser(dir, {result: 'markdown', private: true});

    doc.should.be.an.Object.and.have.properties('person', 'constant', 'dir');
    doc.dir.should.be.an.Object.and.have.properties('constant', 'private');

    checkPersonMd(doc.person);
    checkConstantMd(doc.constant);
    checkConstantSubMd(doc.dir.constant);
    checkPrivateSubMd(doc.dir.private);
  });

  it('should parse a file, convert to markdown and save it', function () {
    var output = __dirname + '/doc4/person.md';

    parser(dir + 'person.js', output, {result: 'markdown'});

    var doc = fs.readFileSync(output, 'utf-8');
    checkPersonMd(doc);
  });

  it('should parse a file, convert to markdown and save it to directory', function () {
    var output = __dirname + '/doc5/';

    parser(dir + 'person.js', output, {result: 'markdown'});

    var doc = fs.readFileSync(output + 'person.md', 'utf-8');
    checkPersonMd(doc);
  });

  it('should parse all files in a directory and sub directory\'s, convert to markdown and save it to directory', function () {
    var output = __dirname + '/doc6/';

    parser(dir, output, {result: 'markdown'});

    var doc = {
      'person': fs.readFileSync(output + 'person.md', 'utf-8'),
      'constant': fs.readFileSync(output + 'constant.md', 'utf-8'),
      'subConstant': fs.readFileSync(output + 'dir/constant.md', 'utf-8')
    };

    fs.existsSync(output + 'dir/private.md').should.be.false;

    checkPersonMd(doc.person);
    checkConstantMd(doc.constant);
    checkConstantSubMd(doc.subConstant);
  });

  it('should parse all files in a dir, convert to md, save and show private', function () {
    var output = __dirname + '/doc6/';

    parser(dir, output, {result: 'markdown', private: true});

    var doc = {
      'person': fs.readFileSync(output + 'person.md', 'utf-8'),
      'constant': fs.readFileSync(output + 'constant.md', 'utf-8'),
      'subConstant': fs.readFileSync(output + 'dir/constant.md', 'utf-8'),
      'subPrivate': fs.readFileSync(output + 'dir/private.md', 'utf-8')
    };

    checkPersonMd(doc.person);
    checkConstantMd(doc.constant);
    checkConstantSubMd(doc.subConstant, true);
    checkPrivateSubMd(doc.subPrivate);
  });

  it('should throw if input is a dir and output a file', function () {
    var input = dir
      , output = __dirname + '/doc7/person.json';

    (function () {
      parser(input, output);
    }).should.throw('Output need to be a directory if input is an directory');
  });

  it('should throw if result is not markdown or json', function () {
    var input = dir
      , output = __dirname + '/doc8/person.json';

    (function () {
      parser(dir, output, {result: 'notMarkdown'});
    }).should.throw('Result can only be markdown or json');
  });
});

function checkPersonJson (doc) {
  doc.should.be.an.Array.and.have.lengthOf(2);

  var todos = doc[0].todos;
  todos.should.be.an.Array.and.have.lengthOf(2);
  todos[0].should.equal('Give the ability to wave.');
  todos[1].should.equal('Give the ability to smile.');

  var personComment = doc[1];
  personComment.should.be.an.Object.and.have.properties('type', 'name',
    'throws', 'return', 'params', 'todos', 'constructor', 'access',
    'desc', 'title');
  personComment.type.should.equal('Function');
  personComment.name.should.equal('Person');
  personComment.title.should.equal('Person');
  personComment.desc.should.equal('Create a new person.');
  personComment.access.should.equal('public');
  personComment.constructor.should.be.true;

  personComment.todos.should.be.an.Array.and.have.lengthOf(1);
  personComment.todos[0].should.equal('Accept an first and surname.');

  personComment.throws.should.be.an.Array.and.have.lengthOf(1);
  personComment.throws[0].should.equal('You\'re over a thousand years old!');

  personComment.params.should.be.an.Array.and.have.lengthOf(1);
  var param = personComment.params[0];
  param.should.be.an.Object.and.have.properties('name', 'type', 'desc', 'properties');
  param.name.should.equal('information');
  param.desc.should.equal('Information about the person.');
  param.type.should.equal('Object');

  var subparam = param.properties;
  subparam.should.be.an.Object.and.have.properties('name', 'age');
  subparam.name.should.be.an.Object.and.have.properties('type', 'desc');
  subparam.name.type.should.equal('String');
  subparam.name.desc.should.equal('Persons name.');
  subparam.age.should.be.an.Object.and.have.properties('type', 'desc');
  subparam.age.type.should.equal('Number');
  subparam.age.desc.should.equal('Persons age.');
}

function checkConstantJson (doc) {
  doc.should.be.an.Array.and.have.lengthOf(3);

  var constant = doc[0];
  constant.should.be.an.Object.and.have.properties('type', 'name', 'desc', 'constant');
  constant.type.should.equal('Number');
  constant.name.should.equal('DEF_LENGTH');
  constant.desc.should.equal('The default length.');
  constant.constant.should.be.true;

  constant = doc[1];
  constant.should.be.an.Object.and.have.properties('type', 'name', 'constant', 'deprecated');
  constant.type.should.equal('Number');
  constant.name.should.equal('MIN_LENGTH');
  constant.constant.should.be.true;
  constant.deprecated.should.be.true;

  constant = doc[2];
  constant.should.be.an.Object.and.have.properties('type', 'name', 'constant', 'deprecated');
  constant.type.should.equal('Number');
  constant.name.should.equal('MAX_LENGTH');
  constant.constant.should.be.true;
  constant.deprecated.should.equal('People are tall these days.');
}

function checkConstantSubJson (doc, pv) {
  doc.should.be.an.Array.and.have.lengthOf((!pv) ? 1 : 2);

  constant = doc[0];
  constant.should.be.an.Object.and.have.properties('type', 'name', 'constant', 'deprecated');
  constant.type.should.equal('Number');
  constant.name.should.equal('MAX_LENGTH');
  constant.constant.should.be.true;
  constant.deprecated.should.equal('People are tall these days.');

  if (!pv) return;
  constant = doc[1];
  constant.should.be.an.Object.and.have.properties('type', 'name', 'constant', 'access');
  constant.type.should.equal('Number');
  constant.name.should.equal('MIN_LENGTH');
  constant.constant.should.be.true;
  constant.access.should.equal('private');
}

function checkPersonMd (md) {
  var l = md.split('\n')
    , i = 0;
  l[i].should.equal('# Person');
  l[++i].should.equal('');
  l[++i].should.equal('### Todo');
  l[++i].should.equal('');
  l[++i].should.equal(' - [ ] Give the ability to wave.');
  l[++i].should.equal(' - [ ] Give the ability to smile.');
  l[++i].should.equal('');
  l[++i].should.equal('### Person');
  l[++i].should.equal('');
  l[++i].should.equal('Create a new person.');
  l[++i].should.equal('');
  l[++i].should.equal('```js');
  l[++i].should.equal('var person = new Person(information);');
  l[++i].should.equal('```');
  l[++i].should.equal('');
  l[++i].should.equal('#### Params');
  l[++i].should.equal('');
  l[++i].should.equal('| Name | Type | Optional | Desciption |');
  l[++i].should.equal('| ---- | ---- | -------- | ---------- |');
  l[++i].should.equal('| information | Object | False | Information about the person. |');
  l[++i].should.equal('| information.name | String | False | Persons name. |');
  l[++i].should.equal('| information.age | Number | False | Persons age. |');
  l[++i].should.equal('');
  l[++i].should.equal('#### Returns');
  l[++i].should.equal('');
  l[++i].should.equal('| Name | Type | Desciption |');
  l[++i].should.equal('| ---- | ---- | ---------- |');
  l[++i].should.equal('| return | Object | A new person with his/her name and age. |');
  l[++i].should.equal('| return.name | String | Persons name. |');
  l[++i].should.equal('| return.age | Number | Persons age. |');
  l[++i].should.equal('');
  l[++i].should.equal('#### Throws errors');
  l[++i].should.equal('');
  l[++i].should.equal(' - You\'re over a thousand years old!');
  l[++i].should.equal('');
  l[++i].should.equal('#### Todo');
  l[++i].should.equal('');
  l[++i].should.equal(' - [ ] Accept an first and surname.');
}

function checkConstantMd (md) {
  var l = md.split('\n')
    , i = 0;
  l[i].should.equal('# Constant');
  l[++i].should.equal('');
  l[++i].should.equal('### DEF_LENGTH');
  l[++i].should.equal('');
  l[++i].should.equal('#### Constant');
  l[++i].should.equal('');
  l[++i].should.equal('The default length.');
  l[++i].should.equal('');
  l[++i].should.equal('### MIN_LENGTH');
  l[++i].should.equal('');
  l[++i].should.equal('> Warning: MIN_LENGTH is deprecated.');
  l[++i].should.equal('');
  l[++i].should.equal('#### Constant');
  l[++i].should.equal('');
  l[++i].should.equal('### MAX_LENGTH');
  l[++i].should.equal('');
  l[++i].should.equal('> Warning: MAX_LENGTH is deprecated. People are tall these days.');
  l[++i].should.equal('');
  l[++i].should.equal('#### Constant');
}

function checkConstantSubMd (md, pv) {
  var l = md.split('\n')
    , i = 0;
  l[i].should.equal('# Constant');
  l[++i].should.equal('');
  l[++i].should.equal('### MAX_LENGTH');
  l[++i].should.equal('');
  l[++i].should.equal('> Warning: MAX_LENGTH is deprecated. People are tall these days.');
  l[++i].should.equal('');
  l[++i].should.equal('#### Constant');

  if (!pv) return;
  l[++i].should.equal('');
  l[++i].should.equal('### MIN_LENGTH');
  l[++i].should.equal('');
  l[++i].should.equal('#### Constant');
}

function checkPrivateSubMd (md) {
  var l = md.split('\n')
    , i = 0;
  l[i].should.equal('# Private');
  l[++i].should.equal('');
  l[++i].should.equal('### PRIVATE_VAR');
  l[++i].should.equal('');
  l[++i].should.equal('#### Constant');
}
