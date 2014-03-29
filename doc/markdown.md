# Markdown

### To Markdown (Function)

> Access: public

Parses a object into Markdown (Github flavored).

```js
var tomarkdown = toMarkdown(title, comments);
```

#### Params

| Name | Type | Optional | Desciption |
| ---- | ---- | -------- | ---------- |
| title | String | False | Title or name of the file. |
| comments | Array | False | The object created by the file parser. |

#### Returns

| Name | Type | Desciption |
| ---- | ---- | ---------- |
| return | String | String with markdown. |

### Create table (Function)

> Access: private

Parses params or return object and it's properties into a markdown table.

```js
var createtable = createTable(obj);
```

#### Params

| Name | Type | Optional | Desciption |
| ---- | ---- | -------- | ---------- |
| obj | Object | False | Param or return object. |

#### Returns

| Name | Type | Desciption |
| ---- | ---- | ---------- |
| return | String | A param or return table in markdown. |