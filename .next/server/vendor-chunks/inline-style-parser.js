/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/inline-style-parser";
exports.ids = ["vendor-chunks/inline-style-parser"];
exports.modules = {

/***/ "(ssr)/./node_modules/inline-style-parser/index.js":
/*!***************************************************!*\
  !*** ./node_modules/inline-style-parser/index.js ***!
  \***************************************************/
/***/ ((module) => {

eval("// http://www.w3.org/TR/CSS21/grammar.html\n// https://github.com/visionmedia/css-parse/pull/49#issuecomment-30088027\nvar COMMENT_REGEX = /\\/\\*[^*]*\\*+([^/*][^*]*\\*+)*\\//g;\n\nvar NEWLINE_REGEX = /\\n/g;\nvar WHITESPACE_REGEX = /^\\s*/;\n\n// declaration\nvar PROPERTY_REGEX = /^(\\*?[-#/*\\\\\\w]+(\\[[0-9a-z_-]+\\])?)\\s*/;\nvar COLON_REGEX = /^:\\s*/;\nvar VALUE_REGEX = /^((?:'(?:\\\\'|.)*?'|\"(?:\\\\\"|.)*?\"|\\([^)]*?\\)|[^};])+)/;\nvar SEMICOLON_REGEX = /^[;\\s]*/;\n\n// https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#Polyfill\nvar TRIM_REGEX = /^\\s+|\\s+$/g;\n\n// strings\nvar NEWLINE = '\\n';\nvar FORWARD_SLASH = '/';\nvar ASTERISK = '*';\nvar EMPTY_STRING = '';\n\n// types\nvar TYPE_COMMENT = 'comment';\nvar TYPE_DECLARATION = 'declaration';\n\n/**\n * @param {String} style\n * @param {Object} [options]\n * @return {Object[]}\n * @throws {TypeError}\n * @throws {Error}\n */\nmodule.exports = function (style, options) {\n  if (typeof style !== 'string') {\n    throw new TypeError('First argument must be a string');\n  }\n\n  if (!style) return [];\n\n  options = options || {};\n\n  /**\n   * Positional.\n   */\n  var lineno = 1;\n  var column = 1;\n\n  /**\n   * Update lineno and column based on `str`.\n   *\n   * @param {String} str\n   */\n  function updatePosition(str) {\n    var lines = str.match(NEWLINE_REGEX);\n    if (lines) lineno += lines.length;\n    var i = str.lastIndexOf(NEWLINE);\n    column = ~i ? str.length - i : column + str.length;\n  }\n\n  /**\n   * Mark position and patch `node.position`.\n   *\n   * @return {Function}\n   */\n  function position() {\n    var start = { line: lineno, column: column };\n    return function (node) {\n      node.position = new Position(start);\n      whitespace();\n      return node;\n    };\n  }\n\n  /**\n   * Store position information for a node.\n   *\n   * @constructor\n   * @property {Object} start\n   * @property {Object} end\n   * @property {undefined|String} source\n   */\n  function Position(start) {\n    this.start = start;\n    this.end = { line: lineno, column: column };\n    this.source = options.source;\n  }\n\n  /**\n   * Non-enumerable source string.\n   */\n  Position.prototype.content = style;\n\n  var errorsList = [];\n\n  /**\n   * Error `msg`.\n   *\n   * @param {String} msg\n   * @throws {Error}\n   */\n  function error(msg) {\n    var err = new Error(\n      options.source + ':' + lineno + ':' + column + ': ' + msg\n    );\n    err.reason = msg;\n    err.filename = options.source;\n    err.line = lineno;\n    err.column = column;\n    err.source = style;\n\n    if (options.silent) {\n      errorsList.push(err);\n    } else {\n      throw err;\n    }\n  }\n\n  /**\n   * Match `re` and return captures.\n   *\n   * @param {RegExp} re\n   * @return {undefined|Array}\n   */\n  function match(re) {\n    var m = re.exec(style);\n    if (!m) return;\n    var str = m[0];\n    updatePosition(str);\n    style = style.slice(str.length);\n    return m;\n  }\n\n  /**\n   * Parse whitespace.\n   */\n  function whitespace() {\n    match(WHITESPACE_REGEX);\n  }\n\n  /**\n   * Parse comments.\n   *\n   * @param {Object[]} [rules]\n   * @return {Object[]}\n   */\n  function comments(rules) {\n    var c;\n    rules = rules || [];\n    while ((c = comment())) {\n      if (c !== false) {\n        rules.push(c);\n      }\n    }\n    return rules;\n  }\n\n  /**\n   * Parse comment.\n   *\n   * @return {Object}\n   * @throws {Error}\n   */\n  function comment() {\n    var pos = position();\n    if (FORWARD_SLASH != style.charAt(0) || ASTERISK != style.charAt(1)) return;\n\n    var i = 2;\n    while (\n      EMPTY_STRING != style.charAt(i) &&\n      (ASTERISK != style.charAt(i) || FORWARD_SLASH != style.charAt(i + 1))\n    ) {\n      ++i;\n    }\n    i += 2;\n\n    if (EMPTY_STRING === style.charAt(i - 1)) {\n      return error('End of comment missing');\n    }\n\n    var str = style.slice(2, i - 2);\n    column += 2;\n    updatePosition(str);\n    style = style.slice(i);\n    column += 2;\n\n    return pos({\n      type: TYPE_COMMENT,\n      comment: str\n    });\n  }\n\n  /**\n   * Parse declaration.\n   *\n   * @return {Object}\n   * @throws {Error}\n   */\n  function declaration() {\n    var pos = position();\n\n    // prop\n    var prop = match(PROPERTY_REGEX);\n    if (!prop) return;\n    comment();\n\n    // :\n    if (!match(COLON_REGEX)) return error(\"property missing ':'\");\n\n    // val\n    var val = match(VALUE_REGEX);\n\n    var ret = pos({\n      type: TYPE_DECLARATION,\n      property: trim(prop[0].replace(COMMENT_REGEX, EMPTY_STRING)),\n      value: val\n        ? trim(val[0].replace(COMMENT_REGEX, EMPTY_STRING))\n        : EMPTY_STRING\n    });\n\n    // ;\n    match(SEMICOLON_REGEX);\n\n    return ret;\n  }\n\n  /**\n   * Parse declarations.\n   *\n   * @return {Object[]}\n   */\n  function declarations() {\n    var decls = [];\n\n    comments(decls);\n\n    // declarations\n    var decl;\n    while ((decl = declaration())) {\n      if (decl !== false) {\n        decls.push(decl);\n        comments(decls);\n      }\n    }\n\n    return decls;\n  }\n\n  whitespace();\n  return declarations();\n};\n\n/**\n * Trim `str`.\n *\n * @param {String} str\n * @return {String}\n */\nfunction trim(str) {\n  return str ? str.replace(TRIM_REGEX, EMPTY_STRING) : EMPTY_STRING;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvaW5saW5lLXN0eWxlLXBhcnNlci9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtRUFBbUU7QUFDbkUsMEJBQTBCOztBQUUxQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixZQUFZO0FBQ1osWUFBWTtBQUNaLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixRQUFRO0FBQ3hCLGdCQUFnQixRQUFRO0FBQ3hCLGdCQUFnQixrQkFBa0I7QUFDbEM7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYSxVQUFVO0FBQ3ZCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZCxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkLGNBQWM7QUFDZDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJDOlxcV29ya1xcUHJvamVjdC1CZW5qYXBodW4tRWNvbW1lcmNlXFxub2RlX21vZHVsZXNcXGlubGluZS1zdHlsZS1wYXJzZXJcXGluZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGh0dHA6Ly93d3cudzMub3JnL1RSL0NTUzIxL2dyYW1tYXIuaHRtbFxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3Zpc2lvbm1lZGlhL2Nzcy1wYXJzZS9wdWxsLzQ5I2lzc3VlY29tbWVudC0zMDA4ODAyN1xudmFyIENPTU1FTlRfUkVHRVggPSAvXFwvXFwqW14qXSpcXCorKFteLypdW14qXSpcXCorKSpcXC8vZztcblxudmFyIE5FV0xJTkVfUkVHRVggPSAvXFxuL2c7XG52YXIgV0hJVEVTUEFDRV9SRUdFWCA9IC9eXFxzKi87XG5cbi8vIGRlY2xhcmF0aW9uXG52YXIgUFJPUEVSVFlfUkVHRVggPSAvXihcXCo/Wy0jLypcXFxcXFx3XSsoXFxbWzAtOWEtel8tXStcXF0pPylcXHMqLztcbnZhciBDT0xPTl9SRUdFWCA9IC9eOlxccyovO1xudmFyIFZBTFVFX1JFR0VYID0gL14oKD86Jyg/OlxcXFwnfC4pKj8nfFwiKD86XFxcXFwifC4pKj9cInxcXChbXildKj9cXCl8W159O10pKykvO1xudmFyIFNFTUlDT0xPTl9SRUdFWCA9IC9eWztcXHNdKi87XG5cbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1N0cmluZy9UcmltI1BvbHlmaWxsXG52YXIgVFJJTV9SRUdFWCA9IC9eXFxzK3xcXHMrJC9nO1xuXG4vLyBzdHJpbmdzXG52YXIgTkVXTElORSA9ICdcXG4nO1xudmFyIEZPUldBUkRfU0xBU0ggPSAnLyc7XG52YXIgQVNURVJJU0sgPSAnKic7XG52YXIgRU1QVFlfU1RSSU5HID0gJyc7XG5cbi8vIHR5cGVzXG52YXIgVFlQRV9DT01NRU5UID0gJ2NvbW1lbnQnO1xudmFyIFRZUEVfREVDTEFSQVRJT04gPSAnZGVjbGFyYXRpb24nO1xuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHlsZVxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogQHJldHVybiB7T2JqZWN0W119XG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9XG4gKiBAdGhyb3dzIHtFcnJvcn1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoc3R5bGUsIG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBzdHlsZSAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdGaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nJyk7XG4gIH1cblxuICBpZiAoIXN0eWxlKSByZXR1cm4gW107XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgLyoqXG4gICAqIFBvc2l0aW9uYWwuXG4gICAqL1xuICB2YXIgbGluZW5vID0gMTtcbiAgdmFyIGNvbHVtbiA9IDE7XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBsaW5lbm8gYW5kIGNvbHVtbiBiYXNlZCBvbiBgc3RyYC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICAgKi9cbiAgZnVuY3Rpb24gdXBkYXRlUG9zaXRpb24oc3RyKSB7XG4gICAgdmFyIGxpbmVzID0gc3RyLm1hdGNoKE5FV0xJTkVfUkVHRVgpO1xuICAgIGlmIChsaW5lcykgbGluZW5vICs9IGxpbmVzLmxlbmd0aDtcbiAgICB2YXIgaSA9IHN0ci5sYXN0SW5kZXhPZihORVdMSU5FKTtcbiAgICBjb2x1bW4gPSB+aSA/IHN0ci5sZW5ndGggLSBpIDogY29sdW1uICsgc3RyLmxlbmd0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrIHBvc2l0aW9uIGFuZCBwYXRjaCBgbm9kZS5wb3NpdGlvbmAuXG4gICAqXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICAgKi9cbiAgZnVuY3Rpb24gcG9zaXRpb24oKSB7XG4gICAgdmFyIHN0YXJ0ID0geyBsaW5lOiBsaW5lbm8sIGNvbHVtbjogY29sdW1uIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICBub2RlLnBvc2l0aW9uID0gbmV3IFBvc2l0aW9uKHN0YXJ0KTtcbiAgICAgIHdoaXRlc3BhY2UoKTtcbiAgICAgIHJldHVybiBub2RlO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogU3RvcmUgcG9zaXRpb24gaW5mb3JtYXRpb24gZm9yIGEgbm9kZS5cbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBzdGFydFxuICAgKiBAcHJvcGVydHkge09iamVjdH0gZW5kXG4gICAqIEBwcm9wZXJ0eSB7dW5kZWZpbmVkfFN0cmluZ30gc291cmNlXG4gICAqL1xuICBmdW5jdGlvbiBQb3NpdGlvbihzdGFydCkge1xuICAgIHRoaXMuc3RhcnQgPSBzdGFydDtcbiAgICB0aGlzLmVuZCA9IHsgbGluZTogbGluZW5vLCBjb2x1bW46IGNvbHVtbiB9O1xuICAgIHRoaXMuc291cmNlID0gb3B0aW9ucy5zb3VyY2U7XG4gIH1cblxuICAvKipcbiAgICogTm9uLWVudW1lcmFibGUgc291cmNlIHN0cmluZy5cbiAgICovXG4gIFBvc2l0aW9uLnByb3RvdHlwZS5jb250ZW50ID0gc3R5bGU7XG5cbiAgdmFyIGVycm9yc0xpc3QgPSBbXTtcblxuICAvKipcbiAgICogRXJyb3IgYG1zZ2AuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBtc2dcbiAgICogQHRocm93cyB7RXJyb3J9XG4gICAqL1xuICBmdW5jdGlvbiBlcnJvcihtc2cpIHtcbiAgICB2YXIgZXJyID0gbmV3IEVycm9yKFxuICAgICAgb3B0aW9ucy5zb3VyY2UgKyAnOicgKyBsaW5lbm8gKyAnOicgKyBjb2x1bW4gKyAnOiAnICsgbXNnXG4gICAgKTtcbiAgICBlcnIucmVhc29uID0gbXNnO1xuICAgIGVyci5maWxlbmFtZSA9IG9wdGlvbnMuc291cmNlO1xuICAgIGVyci5saW5lID0gbGluZW5vO1xuICAgIGVyci5jb2x1bW4gPSBjb2x1bW47XG4gICAgZXJyLnNvdXJjZSA9IHN0eWxlO1xuXG4gICAgaWYgKG9wdGlvbnMuc2lsZW50KSB7XG4gICAgICBlcnJvcnNMaXN0LnB1c2goZXJyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgZXJyO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaCBgcmVgIGFuZCByZXR1cm4gY2FwdHVyZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7UmVnRXhwfSByZVxuICAgKiBAcmV0dXJuIHt1bmRlZmluZWR8QXJyYXl9XG4gICAqL1xuICBmdW5jdGlvbiBtYXRjaChyZSkge1xuICAgIHZhciBtID0gcmUuZXhlYyhzdHlsZSk7XG4gICAgaWYgKCFtKSByZXR1cm47XG4gICAgdmFyIHN0ciA9IG1bMF07XG4gICAgdXBkYXRlUG9zaXRpb24oc3RyKTtcbiAgICBzdHlsZSA9IHN0eWxlLnNsaWNlKHN0ci5sZW5ndGgpO1xuICAgIHJldHVybiBtO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhcnNlIHdoaXRlc3BhY2UuXG4gICAqL1xuICBmdW5jdGlvbiB3aGl0ZXNwYWNlKCkge1xuICAgIG1hdGNoKFdISVRFU1BBQ0VfUkVHRVgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhcnNlIGNvbW1lbnRzLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdFtdfSBbcnVsZXNdXG4gICAqIEByZXR1cm4ge09iamVjdFtdfVxuICAgKi9cbiAgZnVuY3Rpb24gY29tbWVudHMocnVsZXMpIHtcbiAgICB2YXIgYztcbiAgICBydWxlcyA9IHJ1bGVzIHx8IFtdO1xuICAgIHdoaWxlICgoYyA9IGNvbW1lbnQoKSkpIHtcbiAgICAgIGlmIChjICE9PSBmYWxzZSkge1xuICAgICAgICBydWxlcy5wdXNoKGMpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcnVsZXM7XG4gIH1cblxuICAvKipcbiAgICogUGFyc2UgY29tbWVudC5cbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKiBAdGhyb3dzIHtFcnJvcn1cbiAgICovXG4gIGZ1bmN0aW9uIGNvbW1lbnQoKSB7XG4gICAgdmFyIHBvcyA9IHBvc2l0aW9uKCk7XG4gICAgaWYgKEZPUldBUkRfU0xBU0ggIT0gc3R5bGUuY2hhckF0KDApIHx8IEFTVEVSSVNLICE9IHN0eWxlLmNoYXJBdCgxKSkgcmV0dXJuO1xuXG4gICAgdmFyIGkgPSAyO1xuICAgIHdoaWxlIChcbiAgICAgIEVNUFRZX1NUUklORyAhPSBzdHlsZS5jaGFyQXQoaSkgJiZcbiAgICAgIChBU1RFUklTSyAhPSBzdHlsZS5jaGFyQXQoaSkgfHwgRk9SV0FSRF9TTEFTSCAhPSBzdHlsZS5jaGFyQXQoaSArIDEpKVxuICAgICkge1xuICAgICAgKytpO1xuICAgIH1cbiAgICBpICs9IDI7XG5cbiAgICBpZiAoRU1QVFlfU1RSSU5HID09PSBzdHlsZS5jaGFyQXQoaSAtIDEpKSB7XG4gICAgICByZXR1cm4gZXJyb3IoJ0VuZCBvZiBjb21tZW50IG1pc3NpbmcnKTtcbiAgICB9XG5cbiAgICB2YXIgc3RyID0gc3R5bGUuc2xpY2UoMiwgaSAtIDIpO1xuICAgIGNvbHVtbiArPSAyO1xuICAgIHVwZGF0ZVBvc2l0aW9uKHN0cik7XG4gICAgc3R5bGUgPSBzdHlsZS5zbGljZShpKTtcbiAgICBjb2x1bW4gKz0gMjtcblxuICAgIHJldHVybiBwb3Moe1xuICAgICAgdHlwZTogVFlQRV9DT01NRU5ULFxuICAgICAgY29tbWVudDogc3RyXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUGFyc2UgZGVjbGFyYXRpb24uXG4gICAqXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICogQHRocm93cyB7RXJyb3J9XG4gICAqL1xuICBmdW5jdGlvbiBkZWNsYXJhdGlvbigpIHtcbiAgICB2YXIgcG9zID0gcG9zaXRpb24oKTtcblxuICAgIC8vIHByb3BcbiAgICB2YXIgcHJvcCA9IG1hdGNoKFBST1BFUlRZX1JFR0VYKTtcbiAgICBpZiAoIXByb3ApIHJldHVybjtcbiAgICBjb21tZW50KCk7XG5cbiAgICAvLyA6XG4gICAgaWYgKCFtYXRjaChDT0xPTl9SRUdFWCkpIHJldHVybiBlcnJvcihcInByb3BlcnR5IG1pc3NpbmcgJzonXCIpO1xuXG4gICAgLy8gdmFsXG4gICAgdmFyIHZhbCA9IG1hdGNoKFZBTFVFX1JFR0VYKTtcblxuICAgIHZhciByZXQgPSBwb3Moe1xuICAgICAgdHlwZTogVFlQRV9ERUNMQVJBVElPTixcbiAgICAgIHByb3BlcnR5OiB0cmltKHByb3BbMF0ucmVwbGFjZShDT01NRU5UX1JFR0VYLCBFTVBUWV9TVFJJTkcpKSxcbiAgICAgIHZhbHVlOiB2YWxcbiAgICAgICAgPyB0cmltKHZhbFswXS5yZXBsYWNlKENPTU1FTlRfUkVHRVgsIEVNUFRZX1NUUklORykpXG4gICAgICAgIDogRU1QVFlfU1RSSU5HXG4gICAgfSk7XG5cbiAgICAvLyA7XG4gICAgbWF0Y2goU0VNSUNPTE9OX1JFR0VYKTtcblxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvKipcbiAgICogUGFyc2UgZGVjbGFyYXRpb25zLlxuICAgKlxuICAgKiBAcmV0dXJuIHtPYmplY3RbXX1cbiAgICovXG4gIGZ1bmN0aW9uIGRlY2xhcmF0aW9ucygpIHtcbiAgICB2YXIgZGVjbHMgPSBbXTtcblxuICAgIGNvbW1lbnRzKGRlY2xzKTtcblxuICAgIC8vIGRlY2xhcmF0aW9uc1xuICAgIHZhciBkZWNsO1xuICAgIHdoaWxlICgoZGVjbCA9IGRlY2xhcmF0aW9uKCkpKSB7XG4gICAgICBpZiAoZGVjbCAhPT0gZmFsc2UpIHtcbiAgICAgICAgZGVjbHMucHVzaChkZWNsKTtcbiAgICAgICAgY29tbWVudHMoZGVjbHMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkZWNscztcbiAgfVxuXG4gIHdoaXRlc3BhY2UoKTtcbiAgcmV0dXJuIGRlY2xhcmF0aW9ucygpO1xufTtcblxuLyoqXG4gKiBUcmltIGBzdHJgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZnVuY3Rpb24gdHJpbShzdHIpIHtcbiAgcmV0dXJuIHN0ciA/IHN0ci5yZXBsYWNlKFRSSU1fUkVHRVgsIEVNUFRZX1NUUklORykgOiBFTVBUWV9TVFJJTkc7XG59XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/inline-style-parser/index.js\n");

/***/ })

};
;