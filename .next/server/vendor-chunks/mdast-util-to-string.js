"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/mdast-util-to-string";
exports.ids = ["vendor-chunks/mdast-util-to-string"];
exports.modules = {

/***/ "(ssr)/./node_modules/mdast-util-to-string/lib/index.js":
/*!********************************************************!*\
  !*** ./node_modules/mdast-util-to-string/lib/index.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   toString: () => (/* binding */ toString)\n/* harmony export */ });\n/**\n * @typedef {import('mdast').Nodes} Nodes\n *\n * @typedef Options\n *   Configuration (optional).\n * @property {boolean | null | undefined} [includeImageAlt=true]\n *   Whether to use `alt` for `image`s (default: `true`).\n * @property {boolean | null | undefined} [includeHtml=true]\n *   Whether to use `value` of HTML (default: `true`).\n */\n\n/** @type {Options} */\nconst emptyOptions = {}\n\n/**\n * Get the text content of a node or list of nodes.\n *\n * Prefers the node’s plain-text fields, otherwise serializes its children,\n * and if the given value is an array, serialize the nodes in it.\n *\n * @param {unknown} [value]\n *   Thing to serialize, typically `Node`.\n * @param {Options | null | undefined} [options]\n *   Configuration (optional).\n * @returns {string}\n *   Serialized `value`.\n */\nfunction toString(value, options) {\n  const settings = options || emptyOptions\n  const includeImageAlt =\n    typeof settings.includeImageAlt === 'boolean'\n      ? settings.includeImageAlt\n      : true\n  const includeHtml =\n    typeof settings.includeHtml === 'boolean' ? settings.includeHtml : true\n\n  return one(value, includeImageAlt, includeHtml)\n}\n\n/**\n * One node or several nodes.\n *\n * @param {unknown} value\n *   Thing to serialize.\n * @param {boolean} includeImageAlt\n *   Include image `alt`s.\n * @param {boolean} includeHtml\n *   Include HTML.\n * @returns {string}\n *   Serialized node.\n */\nfunction one(value, includeImageAlt, includeHtml) {\n  if (node(value)) {\n    if ('value' in value) {\n      return value.type === 'html' && !includeHtml ? '' : value.value\n    }\n\n    if (includeImageAlt && 'alt' in value && value.alt) {\n      return value.alt\n    }\n\n    if ('children' in value) {\n      return all(value.children, includeImageAlt, includeHtml)\n    }\n  }\n\n  if (Array.isArray(value)) {\n    return all(value, includeImageAlt, includeHtml)\n  }\n\n  return ''\n}\n\n/**\n * Serialize a list of nodes.\n *\n * @param {Array<unknown>} values\n *   Thing to serialize.\n * @param {boolean} includeImageAlt\n *   Include image `alt`s.\n * @param {boolean} includeHtml\n *   Include HTML.\n * @returns {string}\n *   Serialized nodes.\n */\nfunction all(values, includeImageAlt, includeHtml) {\n  /** @type {Array<string>} */\n  const result = []\n  let index = -1\n\n  while (++index < values.length) {\n    result[index] = one(values[index], includeImageAlt, includeHtml)\n  }\n\n  return result.join('')\n}\n\n/**\n * Check if `value` looks like a node.\n *\n * @param {unknown} value\n *   Thing.\n * @returns {value is Nodes}\n *   Whether `value` is a node.\n */\nfunction node(value) {\n  return Boolean(value && typeof value === 'object')\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbWRhc3QtdXRpbC10by1zdHJpbmcvbGliL2luZGV4LmpzIiwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBLGFBQWEsdUJBQXVCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBLGNBQWMsNEJBQTRCO0FBQzFDO0FBQ0EsY0FBYyw0QkFBNEI7QUFDMUM7QUFDQTs7QUFFQSxXQUFXLFNBQVM7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxTQUFTO0FBQ3BCO0FBQ0EsV0FBVyw0QkFBNEI7QUFDdkM7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFNBQVM7QUFDcEI7QUFDQSxXQUFXLFNBQVM7QUFDcEI7QUFDQSxXQUFXLFNBQVM7QUFDcEI7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsZ0JBQWdCO0FBQzNCO0FBQ0EsV0FBVyxTQUFTO0FBQ3BCO0FBQ0EsV0FBVyxTQUFTO0FBQ3BCO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWEsZUFBZTtBQUM1QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsU0FBUztBQUNwQjtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJDOlxcV29ya1xcUHJvamVjdC1CZW5qYXBodW4tRWNvbW1lcmNlXFxub2RlX21vZHVsZXNcXG1kYXN0LXV0aWwtdG8tc3RyaW5nXFxsaWJcXGluZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQHR5cGVkZWYge2ltcG9ydCgnbWRhc3QnKS5Ob2Rlc30gTm9kZXNcbiAqXG4gKiBAdHlwZWRlZiBPcHRpb25zXG4gKiAgIENvbmZpZ3VyYXRpb24gKG9wdGlvbmFsKS5cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbiB8IG51bGwgfCB1bmRlZmluZWR9IFtpbmNsdWRlSW1hZ2VBbHQ9dHJ1ZV1cbiAqICAgV2hldGhlciB0byB1c2UgYGFsdGAgZm9yIGBpbWFnZWBzIChkZWZhdWx0OiBgdHJ1ZWApLlxuICogQHByb3BlcnR5IHtib29sZWFuIHwgbnVsbCB8IHVuZGVmaW5lZH0gW2luY2x1ZGVIdG1sPXRydWVdXG4gKiAgIFdoZXRoZXIgdG8gdXNlIGB2YWx1ZWAgb2YgSFRNTCAoZGVmYXVsdDogYHRydWVgKS5cbiAqL1xuXG4vKiogQHR5cGUge09wdGlvbnN9ICovXG5jb25zdCBlbXB0eU9wdGlvbnMgPSB7fVxuXG4vKipcbiAqIEdldCB0aGUgdGV4dCBjb250ZW50IG9mIGEgbm9kZSBvciBsaXN0IG9mIG5vZGVzLlxuICpcbiAqIFByZWZlcnMgdGhlIG5vZGXigJlzIHBsYWluLXRleHQgZmllbGRzLCBvdGhlcndpc2Ugc2VyaWFsaXplcyBpdHMgY2hpbGRyZW4sXG4gKiBhbmQgaWYgdGhlIGdpdmVuIHZhbHVlIGlzIGFuIGFycmF5LCBzZXJpYWxpemUgdGhlIG5vZGVzIGluIGl0LlxuICpcbiAqIEBwYXJhbSB7dW5rbm93bn0gW3ZhbHVlXVxuICogICBUaGluZyB0byBzZXJpYWxpemUsIHR5cGljYWxseSBgTm9kZWAuXG4gKiBAcGFyYW0ge09wdGlvbnMgfCBudWxsIHwgdW5kZWZpbmVkfSBbb3B0aW9uc11cbiAqICAgQ29uZmlndXJhdGlvbiAob3B0aW9uYWwpLlxuICogQHJldHVybnMge3N0cmluZ31cbiAqICAgU2VyaWFsaXplZCBgdmFsdWVgLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9TdHJpbmcodmFsdWUsIG9wdGlvbnMpIHtcbiAgY29uc3Qgc2V0dGluZ3MgPSBvcHRpb25zIHx8IGVtcHR5T3B0aW9uc1xuICBjb25zdCBpbmNsdWRlSW1hZ2VBbHQgPVxuICAgIHR5cGVvZiBzZXR0aW5ncy5pbmNsdWRlSW1hZ2VBbHQgPT09ICdib29sZWFuJ1xuICAgICAgPyBzZXR0aW5ncy5pbmNsdWRlSW1hZ2VBbHRcbiAgICAgIDogdHJ1ZVxuICBjb25zdCBpbmNsdWRlSHRtbCA9XG4gICAgdHlwZW9mIHNldHRpbmdzLmluY2x1ZGVIdG1sID09PSAnYm9vbGVhbicgPyBzZXR0aW5ncy5pbmNsdWRlSHRtbCA6IHRydWVcblxuICByZXR1cm4gb25lKHZhbHVlLCBpbmNsdWRlSW1hZ2VBbHQsIGluY2x1ZGVIdG1sKVxufVxuXG4vKipcbiAqIE9uZSBub2RlIG9yIHNldmVyYWwgbm9kZXMuXG4gKlxuICogQHBhcmFtIHt1bmtub3dufSB2YWx1ZVxuICogICBUaGluZyB0byBzZXJpYWxpemUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGluY2x1ZGVJbWFnZUFsdFxuICogICBJbmNsdWRlIGltYWdlIGBhbHRgcy5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5jbHVkZUh0bWxcbiAqICAgSW5jbHVkZSBIVE1MLlxuICogQHJldHVybnMge3N0cmluZ31cbiAqICAgU2VyaWFsaXplZCBub2RlLlxuICovXG5mdW5jdGlvbiBvbmUodmFsdWUsIGluY2x1ZGVJbWFnZUFsdCwgaW5jbHVkZUh0bWwpIHtcbiAgaWYgKG5vZGUodmFsdWUpKSB7XG4gICAgaWYgKCd2YWx1ZScgaW4gdmFsdWUpIHtcbiAgICAgIHJldHVybiB2YWx1ZS50eXBlID09PSAnaHRtbCcgJiYgIWluY2x1ZGVIdG1sID8gJycgOiB2YWx1ZS52YWx1ZVxuICAgIH1cblxuICAgIGlmIChpbmNsdWRlSW1hZ2VBbHQgJiYgJ2FsdCcgaW4gdmFsdWUgJiYgdmFsdWUuYWx0KSB7XG4gICAgICByZXR1cm4gdmFsdWUuYWx0XG4gICAgfVxuXG4gICAgaWYgKCdjaGlsZHJlbicgaW4gdmFsdWUpIHtcbiAgICAgIHJldHVybiBhbGwodmFsdWUuY2hpbGRyZW4sIGluY2x1ZGVJbWFnZUFsdCwgaW5jbHVkZUh0bWwpXG4gICAgfVxuICB9XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIGFsbCh2YWx1ZSwgaW5jbHVkZUltYWdlQWx0LCBpbmNsdWRlSHRtbClcbiAgfVxuXG4gIHJldHVybiAnJ1xufVxuXG4vKipcbiAqIFNlcmlhbGl6ZSBhIGxpc3Qgb2Ygbm9kZXMuXG4gKlxuICogQHBhcmFtIHtBcnJheTx1bmtub3duPn0gdmFsdWVzXG4gKiAgIFRoaW5nIHRvIHNlcmlhbGl6ZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5jbHVkZUltYWdlQWx0XG4gKiAgIEluY2x1ZGUgaW1hZ2UgYGFsdGBzLlxuICogQHBhcmFtIHtib29sZWFufSBpbmNsdWRlSHRtbFxuICogICBJbmNsdWRlIEhUTUwuXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICogICBTZXJpYWxpemVkIG5vZGVzLlxuICovXG5mdW5jdGlvbiBhbGwodmFsdWVzLCBpbmNsdWRlSW1hZ2VBbHQsIGluY2x1ZGVIdG1sKSB7XG4gIC8qKiBAdHlwZSB7QXJyYXk8c3RyaW5nPn0gKi9cbiAgY29uc3QgcmVzdWx0ID0gW11cbiAgbGV0IGluZGV4ID0gLTFcblxuICB3aGlsZSAoKytpbmRleCA8IHZhbHVlcy5sZW5ndGgpIHtcbiAgICByZXN1bHRbaW5kZXhdID0gb25lKHZhbHVlc1tpbmRleF0sIGluY2x1ZGVJbWFnZUFsdCwgaW5jbHVkZUh0bWwpXG4gIH1cblxuICByZXR1cm4gcmVzdWx0LmpvaW4oJycpXG59XG5cbi8qKlxuICogQ2hlY2sgaWYgYHZhbHVlYCBsb29rcyBsaWtlIGEgbm9kZS5cbiAqXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlXG4gKiAgIFRoaW5nLlxuICogQHJldHVybnMge3ZhbHVlIGlzIE5vZGVzfVxuICogICBXaGV0aGVyIGB2YWx1ZWAgaXMgYSBub2RlLlxuICovXG5mdW5jdGlvbiBub2RlKHZhbHVlKSB7XG4gIHJldHVybiBCb29sZWFuKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpXG59XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/mdast-util-to-string/lib/index.js\n");

/***/ })

};
;