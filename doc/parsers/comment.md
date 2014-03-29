# Comment

### Comment parser

Parses an array of comment lines.

```js
var commentparser = commentParser(lines, comment);
```

#### Params

| Name | Type | Optional | Desciption |
| ---- | ---- | -------- | ---------- |
| lines | Array | False | Source file lines in a array to parse. |
| comment | Object | False | Object with code information. |
| comment.type | String | False | Type of the var/function in the code. |
| comment.name | String | False | Name of the var/function in the code. |

#### Returns

| Name | Type | Desciption |
| ---- | ---- | ---------- |
| return | Object | Object with information about the comment. |