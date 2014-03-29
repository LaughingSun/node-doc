require('should');

describe('Markdown', function () {
  var toMarkdown = require('../lib/markdown');

  it('should accept an global todo', function () {
    var md = toMarkdown('Global todo', [{
      todos: [
        'First thing I have to do.',
        'Then I want to do this.'
      ]
    }]);

    var l = md.split('\n')
      , i = 0;
    l[i].should.equal('# Global todo');
    l[++i].should.equal('');
    l[++i].should.equal('### Todo');
    l[++i].should.equal('');
    l[++i].should.equal(' - [ ] First thing I have to do.');
    l[++i].should.equal(' - [ ] Then I want to do this.');
  });

  it('should accept an function', function () {
    var md = toMarkdown('Say to somebody', [{
      type: 'Function',
      name: 'sayToSomebody',
      desc: 'Say hello to the world!',
      params: [{
        name: 'what',
        type: 'String',
        desc: 'What we need to say.'
      }, {
        name: 'somebody',
        type: 'String',
        desc: 'To who do we need to say it.'
      }],
      todos: ['Delete this function'],
      deprecated: true
    }]);

    var l = md.split('\n')
      , i = 0;
    l[i].should.equal('# Say to somebody');
    l[++i].should.equal('');
    l[++i].should.equal('### sayToSomebody');
    l[++i].should.equal('');
    l[++i].should.equal('> Warning: sayToSomebody is deprecated.');
    l[++i].should.equal('');
    l[++i].should.equal('Say hello to the world!');
    l[++i].should.equal('');
    l[++i].should.equal('```js');
    l[++i].should.equal('sayToSomebody(what, somebody);');
    l[++i].should.equal('```');
    l[++i].should.equal('');
    l[++i].should.equal('#### Params');
    l[++i].should.equal('');
    l[++i].should.equal('| Name | Type | Optional | Desciption |');
    l[++i].should.equal('| ---- | ---- | -------- | ---------- |');
    l[++i].should.equal('| what | String | False | What we need to say. |');
    l[++i].should.equal('| somebody | String | False | To who do we need to say it. |');
    l[++i].should.equal('');
    l[++i].should.equal('#### Todo');
    l[++i].should.equal('');
    l[++i].should.equal(' - [ ] Delete this function');
  });

  it('should accept an constructor', function () {
    var md = toMarkdown('Say to somebody', [{
      type: 'Function',
      name: 'SayToSomebody',
      desc: 'Say hello to the world!',
      params: [{
        name: 'what',
        type: 'String'
      }, {
        name: 'somebody',
        optional: true,
        desc: 'To who do we need to say it.'
      }],
      return: {
        type: 'Object',
        properties: {
          person: {
            type: 'String',
            desc: 'Message'
          }
        }
      },
      deprecated: 'Use msgSomebody instead.',
      constructor: true
    }, {
      type: 'Function',
      name: 'msgSomebody',
      params: [{
        name: 'options',
        type: 'Object',
        properties: {
          msg: {
            type: 'String',
            desc: 'The message to send'
          },
          name: {
            name: ''
          }
        }
      }],
      return: {
        desc: 'The message'
      }
    }, {
      type: 'Function',
      name: 'somebody',
      return: {
        desc: 'The message'
      }
    }]);

    var l = md.split('\n')
      , i = 0;
    l[i].should.equal('# Say to somebody');
    l[++i].should.equal('');
    l[++i].should.equal('### SayToSomebody');
    l[++i].should.equal('');
    l[++i].should.equal('> Warning: SayToSomebody is deprecated. Use msgSomebody instead.');
    l[++i].should.equal('');
    l[++i].should.equal('Say hello to the world!');
    l[++i].should.equal('');
    l[++i].should.equal('```js');
    l[++i].should.equal('var saytosomebody = new SayToSomebody(what, [somebody]);');
    l[++i].should.equal('```');
    l[++i].should.equal('');
    l[++i].should.equal('#### Params');
    l[++i].should.equal('');
    l[++i].should.equal('| Name | Type | Optional | Desciption |');
    l[++i].should.equal('| ---- | ---- | -------- | ---------- |');
    l[++i].should.equal('| what | String | False |  |');
    l[++i].should.equal('| somebody |  | True | To who do we need to say it. |');
    l[++i].should.equal('');
    l[++i].should.equal('#### Returns');
    l[++i].should.equal('');
    l[++i].should.equal('| Name | Type | Desciption |');
    l[++i].should.equal('| ---- | ---- | ---------- |');
    l[++i].should.equal('| return | Object |  |');
    l[++i].should.equal('| return.person | String | Message |');
    l[++i].should.equal('');
    l[++i].should.equal('### msgSomebody');
    l[++i].should.equal('');
    l[++i].should.equal('```js');
    l[++i].should.equal('var msgsomebody = msgSomebody(options);');
    l[++i].should.equal('```');
    l[++i].should.equal('');
    l[++i].should.equal('#### Params');
    l[++i].should.equal('');
    l[++i].should.equal('| Name | Type | Optional | Desciption |');
    l[++i].should.equal('| ---- | ---- | -------- | ---------- |');
    l[++i].should.equal('| options | Object | False |  |');
    l[++i].should.equal('| options.msg | String | False | The message to send |');
    l[++i].should.equal('| options.name |  | False |  |');
    l[++i].should.equal('');
    l[++i].should.equal('#### Returns');
    l[++i].should.equal('');
    l[++i].should.equal('| Name | Type | Desciption |');
    l[++i].should.equal('| ---- | ---- | ---------- |');
    l[++i].should.equal('| return |  | The message |');
    l[++i].should.equal('');
    l[++i].should.equal('### somebody');
    l[++i].should.equal('');
    l[++i].should.equal('```js');
    l[++i].should.equal('var somebody = somebody();');
    l[++i].should.equal('```');
  });

  it('should display what errors an function throws', function () {
    var md = toMarkdown('Deprecated', [{
      type: 'Function',
      name: 'SayToSomebody',
      throws: ['This is deprecated. Use msgSomebody instead.'],
      example: 'SayToSomebody();'
    }]);

    var l = md.split('\n')
      , i = 0;
    l[i].should.equal('# Deprecated');
    l[++i].should.equal('');
    l[++i].should.equal('### SayToSomebody');
    l[++i].should.equal('');
    l[++i].should.equal('```js');
    l[++i].should.equal('SayToSomebody();');
    l[++i].should.equal('```');
    l[++i].should.equal('');
    l[++i].should.equal('#### Throws errors');
    l[++i].should.equal('');
    l[++i].should.equal(' - This is deprecated. Use msgSomebody instead.');
  });

  it('should have display constants', function () {
    var md = toMarkdown('Constant', [{
      type: 'Constant',
      name: 'MY_CONSTANT',
      constant: true
    }]);

    var l = md.split('\n')
      , i = 0;
    l[i].should.equal('# Constant');
    l[++i].should.equal('');
    l[++i].should.equal('### MY_CONSTANT');
    l[++i].should.equal('');
    l[++i].should.equal('#### Constant');
  });

  it('should accept an callback');
  it('should test some more..!');
});
