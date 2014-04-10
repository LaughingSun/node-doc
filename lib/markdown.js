/**
 * Parses a object into Markdown (Github flavored).
 * @public
 *
 * @param title {String} Title or name of the file.
 * @param comments {Array} The object created by the file parser.
 * @return {String} String with markdown.
 */
function toMarkdown (title, comments) {
  var md = '# ' + title.charAt(0).toUpperCase() + title.slice(1) + '\n\n';

  comments.forEach(function (comment) {
    var name = (comment.title || comment.name);

    if (name) {
      if (comment.constant) {
        if (comment.type) {
          comment.type = 'Constant, ' + comment.type;
        } else {
          comment.type = 'Constant';
        }
      }

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
 * @param obj {Object} Param or return object.
 * @return {String} A param or return table in markdown.
 */
function createTable (obj, param) {
  obj.type = obj.type || '';
  obj.desc = obj.desc || '';

  var md = '| ' + obj.name + ' | ' + obj.type + ' | ';

  if (param) md += ((obj.optional) ? 'True' : 'False') + ' | ';

  md += obj.desc + ' |\n';

  if (obj.properties) {
    var sub = {};

    for (var name in obj.properties) {
      sub = obj.properties[name];
      sub.name = obj.name + '.' + name;

      md += createTable(sub, param);
    }
  }

  return md;
}
