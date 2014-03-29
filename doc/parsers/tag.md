# Tag

### Parse Tag (Function)

> Access: public

Parse a single tag.

```js
var parsetag = parseTag(tag);
```

#### Params

| Name | Type | Optional | Desciption |
| ---- | ---- | -------- | ---------- |
| tag | String | False | String with a @tag in it. |

#### Returns

| Name | Type | Desciption |
| ---- | ---- | ---------- |
| return | Object | Object with type and value for the tag. |
| return.type | String | The type of tag. |
| return.value |  | Information about the tag. |

### Default Parser (Function)

> Access: private

Default parser for tags, follows: @tag name {Type} Description.

```js
var defaultparser = defaultParser(oldTag, name, type);
```

#### Params

| Name | Type | Optional | Desciption |
| ---- | ---- | -------- | ---------- |
| oldTag | String | False | String to convert. |
| name | Boolean | False | False makes name a part of the description. True enforces an name. |
| type | Boolean | False | False ignores the type. |

#### Returns

| Name | Type | Desciption |
| ---- | ---- | ---------- |
| return | Object | Information about the tag. |
| return.name | String | Possible name of the tag. |
| return.desc | String | Possible description of the tag. |
| return.type | String | Possible type of the tag. |