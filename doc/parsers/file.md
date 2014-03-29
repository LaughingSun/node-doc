# File

### Parse file

Parse an file into an array of comment objects.

```js
var parsefile = parseFile(lines, pv);
```

#### Params

| Name | Type | Optional | Desciption |
| ---- | ---- | -------- | ---------- |
| lines | Array | False | An array of all lines of a file. |
| pv | Boolean | False | Wether or not to show private comments. |

#### Returns

| Name | Type | Desciption |
| ---- | ---- | ---------- |
| return | Array | All comments in an file in objects. |

### Detect code information

Get information from lines of code in an array.

```js
var detectcodeinfo = detectCodeInfo(lines);
```

#### Params

| Name | Type | Optional | Desciption |
| ---- | ---- | -------- | ---------- |
| lines | Array | False | The lines of code to get information of. |

#### Returns

| Name | Type | Desciption |
| ---- | ---- | ---------- |
| return | Object | Object with code information. |
| return.type | String | Function or variable type. |
| return.name | String | Name of the function or variable. |

### Detect variable type

Detect the type of the variable.

```js
var detectvartype = detectVarType(line);
```

#### Params

| Name | Type | Optional | Desciption |
| ---- | ---- | -------- | ---------- |
| line | String | False | The line with the variable to detect the type of. |

#### Returns

| Name | Type | Desciption |
| ---- | ---- | ---------- |
| return | String | Type of the variable. |