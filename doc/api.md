# Api

### Parser

Parses a file or a whole directory to an documententation. This can be outputted in an object or in Markdown (Github flavored).

```js
var parser = parser(input, [output], [result]);
```

#### Params

| Name | Type | Optional | Desciption |
| ---- | ---- | -------- | ---------- |
| input | String | False | The directory of the source files get documention from. |
| output | String | True | The directory to write the output to. |
| result | String | True | The type of result wanted: object or markdown. |

#### Returns

| Name | Type | Desciption |
| ---- | ---- | ---------- |
| return | Object|String | Object or string (Markdown) with the results. |

### Is dir

Check if file or dir is an directory.

```js
var isdir = isDir(input);
```

#### Params

| Name | Type | Optional | Desciption |
| ---- | ---- | -------- | ---------- |
| input | String | False | Directory or file, needs to end with '/'. |

#### Returns

| Name | Type | Desciption |
| ---- | ---- | ---------- |
| return | Boolean | Wether the input is a directory or not. |

### Get files recursive

Get all files in an directory recursive.

```js
var getfilesrecursive = getFilesRecursive(dir);
```

#### Params

| Name | Type | Optional | Desciption |
| ---- | ---- | -------- | ---------- |
| dir | String | False | Directory to get all file from. |

#### Returns

| Name | Type | Desciption |
| ---- | ---- | ---------- |
| return | Array | Array with files. |

### To Markdown recursive

Convert an object to markdown recursively.

```js
var tomarkdownrecursive = toMarkdownRecursive(doc);
```

#### Params

| Name | Type | Optional | Desciption |
| ---- | ---- | -------- | ---------- |
| doc | Object | False | Comment object from parse file. |

#### Returns

| Name | Type | Desciption |
| ---- | ---- | ---------- |
| return | Object | Object with markdown strings. |

### Save file recursive

Save a file recursively.

```js
saveFileRecursive(root, ext, doc);
```

#### Params

| Name | Type | Optional | Desciption |
| ---- | ---- | -------- | ---------- |
| root | String | False | Root directory. |
| ext | String | False | Extention to use. |
| doc | Object | False | Files with object keys as names. |

### Recursive check

Check if it's an recursive object.

```js
var recursivecheck = recursiveCheck(obj);
```

#### Params

| Name | Type | Optional | Desciption |
| ---- | ---- | -------- | ---------- |
| obj | Object | False | Possible recursive object. |

#### Returns

| Name | Type | Desciption |
| ---- | ---- | ---------- |
| return | Boolean | Wether or not it's recursive. |