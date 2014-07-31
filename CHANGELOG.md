# Node doc

## Change log

### Upcoming
- **BREAKING** Changed api for both file parser and exposed api.
- **BREAKING** Only file parser & api are exposed.
- **BREAKING** Dropped @access, @private & @public tag.
- **BREAKING** Dropped @constructor tag.
- **BREAKING** Dropped @constant tag.
- Improved code information detection.
- Automaticly makes namespaces for required local modules.
- Automaticly detects if a function is private or not.
- Automaticly adds project information from package.json.
- Fix bug when file contains '/**' in source code (#3).
- Added type ```Callback``` to codeinfo.

### 0.1.4
- Fixed optional sub param.

### 0.1.3
 - **BREAKING** String needed in the file parser, instead of array.
 - Added @this tag.
 - Support name for return (used in the example).
 - Improved comment detection (accept one line comment).

### 0.1.2
 - **BREAKING** Dropped @desc tag, description is now tagless.
 - **BREAKING** Dropped @title tag.

### 0.1.1
 - **BREAKING** Replace constructor property on object with type equals 'Constructor'.

### 0.1.0
 - Initial commit.
