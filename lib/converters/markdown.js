'use strict';

/**
 * @todo Make it work with the new documentation object.
 * @todo Make functions like: table, h1, h2 etc!
 */


/**
 * Parses a documentation object into Github flavored Markdown.
 */
function toMarkdown (doc) {
  var ns = clone(doc.ns);

  delete doc.ns;

  var result = {
    'README.md': doc
  };

  for (var file in ns) {
    result[file + '.md'] = ns[file];
  }

  return result;











  if (!Array.isArray(comments)) throw new Error('Comments need to be an array');

  var md = '# ' + title.charAt(0).toUpperCase() + title.slice(1) + '\n\n';

  comments.forEach(function (comment) {
    var name = (comment.title || comment.name);

    if (name) {
      if (comment.constant) comment.type = 'Constant' + (comment.type ? ', ' + comment.type : '');

      md += '### ' + name;
      if (comment.type) md += ' (' + comment.type + ')';
      md += '\n\n';
    }

    if (comment.access) md += '> Access: ' + comment.access.toLowerCase() + '\n\n';

    if (comment.deprecated) {
      comment.deprecated = (comment.deprecated !== true) ? comment.deprecated : '';
      md += ('> Warning: ' + name + ' is deprecated. ' + comment.deprecated).trim() + '\n\n';
    }

    if (comment.desc) md += comment.desc + '\n\n';

    if (comment.type && (comment.type.toLowerCase() === 'function' ||
      comment.type.toLowerCase() === 'constructor')) {
      var example = '';

      if (comment.example) {
        example = comment.example;
      } else {
        if (comment.return) {
          example = 'var ' + (comment.return.name || comment.name.toLowerCase()) + ' = ';

          if (comment.type.toLowerCase() === 'constructor') example += 'new ';
        }

        example += comment.name + '(';

        if (comment.params) {
          comment.params.forEach(function (comment) {
            if (comment.optional) {
              example += '[' + comment.name + ']';
            } else {
              example += comment.name;
            }

            example += ', ';
          });

          example = example.slice(0, -2);
        }

        example += ');';
      }

      md += '```js\n' + example + '\n```\n\n';
    }

    if (comment.params && comment.params.length !== 0) {
      md += '#### Params\n\n';

      md += '| Name | Type | Optional | Desciption |\n';
      md += '| ---- | ---- | -------- | ---------- |\n';

      comment.params.forEach(function (param) {
        md += createTable(param, true);
      });

      md += '\n';
    }

    if (comment.this) {
      md += '#### This\n\n';

      if (comment.this.desc) md += comment.this.desc + '\n\n';

      if (comment.this.properties) {
        md += '| Name | Type | Desciption |\n';
        md += '| ---- | ---- | ---------- |\n';

        var sub;
        for (var n in comment.this.properties) {
          sub = comment.this.properties[n];
          sub.name = n;

          md += createTable(sub);
        }

        md += '\n';
      }
    }

    if (comment.return) {
      md += '#### Returns\n\n';

      md += '| Name | Type | Desciption |\n';
      md += '| ---- | ---- | ---------- |\n';

      comment.return.name = 'return';
      md += createTable(comment.return) + '\n';
    }

    if (comment.throws) {
      md += '#### Throws errors\n\n';

      comment.throws.forEach(function (err) {
        md += ' - ' + err + '\n';
      });

      md += '\n';
    }

    if (comment.todos) {
      // Global todo, or a regular one
      md += ((!comment.title && !comment.name) ? '###' : '####') + ' Todo\n\n';

      comment.todos.forEach(function (item) {
        md += ' - [ ] ' + item + '\n';
      });

      md += '\n';
    }
  });

  while (md.slice(-1) === '\n') {
    md = md.slice(0, -1);
  }

  return md;
}

module.exports = toMarkdown;

/**
 * Parses params or return object and it's properties into a markdown table.
 * @private
 *
 * @param  obj   {Object}  Param or return object.
 * @param  [opt] {Boolean} Wether or not to show an optional column.
 * @return      {String}  A param or return table in markdown.
 */
function createTable (obj, opt) {
  obj.type = obj.type || '';
  obj.desc = obj.desc || '';

  var md = '| ' + obj.name + ' | ' + obj.type + ' | ';

  if (opt) md += (obj.optional ? 'True' : 'False') + ' | ';

  md += obj.desc + ' |\n';

  if (obj.properties) {
    var sub;

    for (var name in obj.properties) {
      sub = obj.properties[name];
      sub.name = obj.name + '.' + name;

      md += createTable(sub, opt);
    }
  }

  return md;
}
