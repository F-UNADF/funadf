import {
  EMPTY_OBJ,
  NO,
  NOOP,
  PatchFlagNames,
  camelize,
  capitalize,
  extend,
  generateCodeFrame,
  init_runtime_dom_esm_bundler,
  init_shared_esm_bundler,
  isArray,
  isBuiltInDirective,
  isHTMLTag,
  isMathMLTag,
  isObject,
  isOn,
  isReservedProp,
  isSVGTag,
  isString,
  isSymbol,
  isVoidTag,
  makeMap,
  parseStringStyle,
  runtime_dom_esm_bundler_exports,
  shared_esm_bundler_exports,
  slotFlagsText,
  toHandlerKey
} from "./chunk-ZZSAXYS4.js";
import {
  __commonJS,
  __esm,
  __export,
  __toCommonJS
} from "./chunk-UP2VWCW5.js";

// node_modules/quill/dist/quill.js
var require_quill = __commonJS({
  "node_modules/quill/dist/quill.js"(exports, module) {
    (function webpackUniversalModuleDefinition(root, factory) {
      if (typeof exports === "object" && typeof module === "object")
        module.exports = factory();
      else if (typeof define === "function" && define.amd)
        define([], factory);
      else if (typeof exports === "object")
        exports["Quill"] = factory();
      else
        root["Quill"] = factory();
    })(typeof self !== "undefined" ? self : exports, function() {
      return (
        /******/
        function(modules) {
          var installedModules = {};
          function __webpack_require__(moduleId) {
            if (installedModules[moduleId]) {
              return installedModules[moduleId].exports;
            }
            var module2 = installedModules[moduleId] = {
              /******/
              i: moduleId,
              /******/
              l: false,
              /******/
              exports: {}
              /******/
            };
            modules[moduleId].call(module2.exports, module2, module2.exports, __webpack_require__);
            module2.l = true;
            return module2.exports;
          }
          __webpack_require__.m = modules;
          __webpack_require__.c = installedModules;
          __webpack_require__.d = function(exports2, name, getter) {
            if (!__webpack_require__.o(exports2, name)) {
              Object.defineProperty(exports2, name, {
                /******/
                configurable: false,
                /******/
                enumerable: true,
                /******/
                get: getter
                /******/
              });
            }
          };
          __webpack_require__.n = function(module2) {
            var getter = module2 && module2.__esModule ? (
              /******/
              function getDefault() {
                return module2["default"];
              }
            ) : (
              /******/
              function getModuleExports() {
                return module2;
              }
            );
            __webpack_require__.d(getter, "a", getter);
            return getter;
          };
          __webpack_require__.o = function(object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
          };
          __webpack_require__.p = "";
          return __webpack_require__(__webpack_require__.s = 109);
        }([
          /* 0 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", { value: true });
            var container_1 = __webpack_require__(17);
            var format_1 = __webpack_require__(18);
            var leaf_1 = __webpack_require__(19);
            var scroll_1 = __webpack_require__(45);
            var inline_1 = __webpack_require__(46);
            var block_1 = __webpack_require__(47);
            var embed_1 = __webpack_require__(48);
            var text_1 = __webpack_require__(49);
            var attributor_1 = __webpack_require__(12);
            var class_1 = __webpack_require__(32);
            var style_1 = __webpack_require__(33);
            var store_1 = __webpack_require__(31);
            var Registry = __webpack_require__(1);
            var Parchment = {
              Scope: Registry.Scope,
              create: Registry.create,
              find: Registry.find,
              query: Registry.query,
              register: Registry.register,
              Container: container_1.default,
              Format: format_1.default,
              Leaf: leaf_1.default,
              Embed: embed_1.default,
              Scroll: scroll_1.default,
              Block: block_1.default,
              Inline: inline_1.default,
              Text: text_1.default,
              Attributor: {
                Attribute: attributor_1.default,
                Class: class_1.default,
                Style: style_1.default,
                Store: store_1.default
              }
            };
            exports2.default = Parchment;
          },
          /* 1 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            var __extends = this && this.__extends || function() {
              var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
                d.__proto__ = b;
              } || function(d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
              };
              return function(d, b) {
                extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
              };
            }();
            Object.defineProperty(exports2, "__esModule", { value: true });
            var ParchmentError = (
              /** @class */
              function(_super) {
                __extends(ParchmentError2, _super);
                function ParchmentError2(message) {
                  var _this = this;
                  message = "[Parchment] " + message;
                  _this = _super.call(this, message) || this;
                  _this.message = message;
                  _this.name = _this.constructor.name;
                  return _this;
                }
                return ParchmentError2;
              }(Error)
            );
            exports2.ParchmentError = ParchmentError;
            var attributes = {};
            var classes = {};
            var tags = {};
            var types = {};
            exports2.DATA_KEY = "__blot";
            var Scope;
            (function(Scope2) {
              Scope2[Scope2["TYPE"] = 3] = "TYPE";
              Scope2[Scope2["LEVEL"] = 12] = "LEVEL";
              Scope2[Scope2["ATTRIBUTE"] = 13] = "ATTRIBUTE";
              Scope2[Scope2["BLOT"] = 14] = "BLOT";
              Scope2[Scope2["INLINE"] = 7] = "INLINE";
              Scope2[Scope2["BLOCK"] = 11] = "BLOCK";
              Scope2[Scope2["BLOCK_BLOT"] = 10] = "BLOCK_BLOT";
              Scope2[Scope2["INLINE_BLOT"] = 6] = "INLINE_BLOT";
              Scope2[Scope2["BLOCK_ATTRIBUTE"] = 9] = "BLOCK_ATTRIBUTE";
              Scope2[Scope2["INLINE_ATTRIBUTE"] = 5] = "INLINE_ATTRIBUTE";
              Scope2[Scope2["ANY"] = 15] = "ANY";
            })(Scope = exports2.Scope || (exports2.Scope = {}));
            function create(input, value) {
              var match = query(input);
              if (match == null) {
                throw new ParchmentError("Unable to create " + input + " blot");
              }
              var BlotClass = match;
              var node = (
                // @ts-ignore
                input instanceof Node || input["nodeType"] === Node.TEXT_NODE ? input : BlotClass.create(value)
              );
              return new BlotClass(node, value);
            }
            exports2.create = create;
            function find(node, bubble) {
              if (bubble === void 0) {
                bubble = false;
              }
              if (node == null)
                return null;
              if (node[exports2.DATA_KEY] != null)
                return node[exports2.DATA_KEY].blot;
              if (bubble)
                return find(node.parentNode, bubble);
              return null;
            }
            exports2.find = find;
            function query(query2, scope) {
              if (scope === void 0) {
                scope = Scope.ANY;
              }
              var match;
              if (typeof query2 === "string") {
                match = types[query2] || attributes[query2];
              } else if (query2 instanceof Text || query2["nodeType"] === Node.TEXT_NODE) {
                match = types["text"];
              } else if (typeof query2 === "number") {
                if (query2 & Scope.LEVEL & Scope.BLOCK) {
                  match = types["block"];
                } else if (query2 & Scope.LEVEL & Scope.INLINE) {
                  match = types["inline"];
                }
              } else if (query2 instanceof HTMLElement) {
                var names = (query2.getAttribute("class") || "").split(/\s+/);
                for (var i in names) {
                  match = classes[names[i]];
                  if (match)
                    break;
                }
                match = match || tags[query2.tagName];
              }
              if (match == null)
                return null;
              if (scope & Scope.LEVEL & match.scope && scope & Scope.TYPE & match.scope)
                return match;
              return null;
            }
            exports2.query = query;
            function register() {
              var Definitions = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                Definitions[_i] = arguments[_i];
              }
              if (Definitions.length > 1) {
                return Definitions.map(function(d) {
                  return register(d);
                });
              }
              var Definition = Definitions[0];
              if (typeof Definition.blotName !== "string" && typeof Definition.attrName !== "string") {
                throw new ParchmentError("Invalid definition");
              } else if (Definition.blotName === "abstract") {
                throw new ParchmentError("Cannot register abstract class");
              }
              types[Definition.blotName || Definition.attrName] = Definition;
              if (typeof Definition.keyName === "string") {
                attributes[Definition.keyName] = Definition;
              } else {
                if (Definition.className != null) {
                  classes[Definition.className] = Definition;
                }
                if (Definition.tagName != null) {
                  if (Array.isArray(Definition.tagName)) {
                    Definition.tagName = Definition.tagName.map(function(tagName) {
                      return tagName.toUpperCase();
                    });
                  } else {
                    Definition.tagName = Definition.tagName.toUpperCase();
                  }
                  var tagNames = Array.isArray(Definition.tagName) ? Definition.tagName : [Definition.tagName];
                  tagNames.forEach(function(tag) {
                    if (tags[tag] == null || Definition.className == null) {
                      tags[tag] = Definition;
                    }
                  });
                }
              }
              return Definition;
            }
            exports2.register = register;
          },
          /* 2 */
          /***/
          function(module2, exports2, __webpack_require__) {
            var diff = __webpack_require__(51);
            var equal = __webpack_require__(11);
            var extend2 = __webpack_require__(3);
            var op = __webpack_require__(20);
            var NULL_CHARACTER = String.fromCharCode(0);
            var Delta = function(ops) {
              if (Array.isArray(ops)) {
                this.ops = ops;
              } else if (ops != null && Array.isArray(ops.ops)) {
                this.ops = ops.ops;
              } else {
                this.ops = [];
              }
            };
            Delta.prototype.insert = function(text, attributes) {
              var newOp = {};
              if (text.length === 0) return this;
              newOp.insert = text;
              if (attributes != null && typeof attributes === "object" && Object.keys(attributes).length > 0) {
                newOp.attributes = attributes;
              }
              return this.push(newOp);
            };
            Delta.prototype["delete"] = function(length) {
              if (length <= 0) return this;
              return this.push({ "delete": length });
            };
            Delta.prototype.retain = function(length, attributes) {
              if (length <= 0) return this;
              var newOp = { retain: length };
              if (attributes != null && typeof attributes === "object" && Object.keys(attributes).length > 0) {
                newOp.attributes = attributes;
              }
              return this.push(newOp);
            };
            Delta.prototype.push = function(newOp) {
              var index = this.ops.length;
              var lastOp = this.ops[index - 1];
              newOp = extend2(true, {}, newOp);
              if (typeof lastOp === "object") {
                if (typeof newOp["delete"] === "number" && typeof lastOp["delete"] === "number") {
                  this.ops[index - 1] = { "delete": lastOp["delete"] + newOp["delete"] };
                  return this;
                }
                if (typeof lastOp["delete"] === "number" && newOp.insert != null) {
                  index -= 1;
                  lastOp = this.ops[index - 1];
                  if (typeof lastOp !== "object") {
                    this.ops.unshift(newOp);
                    return this;
                  }
                }
                if (equal(newOp.attributes, lastOp.attributes)) {
                  if (typeof newOp.insert === "string" && typeof lastOp.insert === "string") {
                    this.ops[index - 1] = { insert: lastOp.insert + newOp.insert };
                    if (typeof newOp.attributes === "object") this.ops[index - 1].attributes = newOp.attributes;
                    return this;
                  } else if (typeof newOp.retain === "number" && typeof lastOp.retain === "number") {
                    this.ops[index - 1] = { retain: lastOp.retain + newOp.retain };
                    if (typeof newOp.attributes === "object") this.ops[index - 1].attributes = newOp.attributes;
                    return this;
                  }
                }
              }
              if (index === this.ops.length) {
                this.ops.push(newOp);
              } else {
                this.ops.splice(index, 0, newOp);
              }
              return this;
            };
            Delta.prototype.chop = function() {
              var lastOp = this.ops[this.ops.length - 1];
              if (lastOp && lastOp.retain && !lastOp.attributes) {
                this.ops.pop();
              }
              return this;
            };
            Delta.prototype.filter = function(predicate) {
              return this.ops.filter(predicate);
            };
            Delta.prototype.forEach = function(predicate) {
              this.ops.forEach(predicate);
            };
            Delta.prototype.map = function(predicate) {
              return this.ops.map(predicate);
            };
            Delta.prototype.partition = function(predicate) {
              var passed = [], failed = [];
              this.forEach(function(op2) {
                var target = predicate(op2) ? passed : failed;
                target.push(op2);
              });
              return [passed, failed];
            };
            Delta.prototype.reduce = function(predicate, initial) {
              return this.ops.reduce(predicate, initial);
            };
            Delta.prototype.changeLength = function() {
              return this.reduce(function(length, elem) {
                if (elem.insert) {
                  return length + op.length(elem);
                } else if (elem.delete) {
                  return length - elem.delete;
                }
                return length;
              }, 0);
            };
            Delta.prototype.length = function() {
              return this.reduce(function(length, elem) {
                return length + op.length(elem);
              }, 0);
            };
            Delta.prototype.slice = function(start, end) {
              start = start || 0;
              if (typeof end !== "number") end = Infinity;
              var ops = [];
              var iter = op.iterator(this.ops);
              var index = 0;
              while (index < end && iter.hasNext()) {
                var nextOp;
                if (index < start) {
                  nextOp = iter.next(start - index);
                } else {
                  nextOp = iter.next(end - index);
                  ops.push(nextOp);
                }
                index += op.length(nextOp);
              }
              return new Delta(ops);
            };
            Delta.prototype.compose = function(other) {
              var thisIter = op.iterator(this.ops);
              var otherIter = op.iterator(other.ops);
              var ops = [];
              var firstOther = otherIter.peek();
              if (firstOther != null && typeof firstOther.retain === "number" && firstOther.attributes == null) {
                var firstLeft = firstOther.retain;
                while (thisIter.peekType() === "insert" && thisIter.peekLength() <= firstLeft) {
                  firstLeft -= thisIter.peekLength();
                  ops.push(thisIter.next());
                }
                if (firstOther.retain - firstLeft > 0) {
                  otherIter.next(firstOther.retain - firstLeft);
                }
              }
              var delta = new Delta(ops);
              while (thisIter.hasNext() || otherIter.hasNext()) {
                if (otherIter.peekType() === "insert") {
                  delta.push(otherIter.next());
                } else if (thisIter.peekType() === "delete") {
                  delta.push(thisIter.next());
                } else {
                  var length = Math.min(thisIter.peekLength(), otherIter.peekLength());
                  var thisOp = thisIter.next(length);
                  var otherOp = otherIter.next(length);
                  if (typeof otherOp.retain === "number") {
                    var newOp = {};
                    if (typeof thisOp.retain === "number") {
                      newOp.retain = length;
                    } else {
                      newOp.insert = thisOp.insert;
                    }
                    var attributes = op.attributes.compose(thisOp.attributes, otherOp.attributes, typeof thisOp.retain === "number");
                    if (attributes) newOp.attributes = attributes;
                    delta.push(newOp);
                    if (!otherIter.hasNext() && equal(delta.ops[delta.ops.length - 1], newOp)) {
                      var rest = new Delta(thisIter.rest());
                      return delta.concat(rest).chop();
                    }
                  } else if (typeof otherOp["delete"] === "number" && typeof thisOp.retain === "number") {
                    delta.push(otherOp);
                  }
                }
              }
              return delta.chop();
            };
            Delta.prototype.concat = function(other) {
              var delta = new Delta(this.ops.slice());
              if (other.ops.length > 0) {
                delta.push(other.ops[0]);
                delta.ops = delta.ops.concat(other.ops.slice(1));
              }
              return delta;
            };
            Delta.prototype.diff = function(other, index) {
              if (this.ops === other.ops) {
                return new Delta();
              }
              var strings = [this, other].map(function(delta2) {
                return delta2.map(function(op2) {
                  if (op2.insert != null) {
                    return typeof op2.insert === "string" ? op2.insert : NULL_CHARACTER;
                  }
                  var prep = delta2 === other ? "on" : "with";
                  throw new Error("diff() called " + prep + " non-document");
                }).join("");
              });
              var delta = new Delta();
              var diffResult = diff(strings[0], strings[1], index);
              var thisIter = op.iterator(this.ops);
              var otherIter = op.iterator(other.ops);
              diffResult.forEach(function(component) {
                var length = component[1].length;
                while (length > 0) {
                  var opLength = 0;
                  switch (component[0]) {
                    case diff.INSERT:
                      opLength = Math.min(otherIter.peekLength(), length);
                      delta.push(otherIter.next(opLength));
                      break;
                    case diff.DELETE:
                      opLength = Math.min(length, thisIter.peekLength());
                      thisIter.next(opLength);
                      delta["delete"](opLength);
                      break;
                    case diff.EQUAL:
                      opLength = Math.min(thisIter.peekLength(), otherIter.peekLength(), length);
                      var thisOp = thisIter.next(opLength);
                      var otherOp = otherIter.next(opLength);
                      if (equal(thisOp.insert, otherOp.insert)) {
                        delta.retain(opLength, op.attributes.diff(thisOp.attributes, otherOp.attributes));
                      } else {
                        delta.push(otherOp)["delete"](opLength);
                      }
                      break;
                  }
                  length -= opLength;
                }
              });
              return delta.chop();
            };
            Delta.prototype.eachLine = function(predicate, newline) {
              newline = newline || "\n";
              var iter = op.iterator(this.ops);
              var line = new Delta();
              var i = 0;
              while (iter.hasNext()) {
                if (iter.peekType() !== "insert") return;
                var thisOp = iter.peek();
                var start = op.length(thisOp) - iter.peekLength();
                var index = typeof thisOp.insert === "string" ? thisOp.insert.indexOf(newline, start) - start : -1;
                if (index < 0) {
                  line.push(iter.next());
                } else if (index > 0) {
                  line.push(iter.next(index));
                } else {
                  if (predicate(line, iter.next(1).attributes || {}, i) === false) {
                    return;
                  }
                  i += 1;
                  line = new Delta();
                }
              }
              if (line.length() > 0) {
                predicate(line, {}, i);
              }
            };
            Delta.prototype.transform = function(other, priority) {
              priority = !!priority;
              if (typeof other === "number") {
                return this.transformPosition(other, priority);
              }
              var thisIter = op.iterator(this.ops);
              var otherIter = op.iterator(other.ops);
              var delta = new Delta();
              while (thisIter.hasNext() || otherIter.hasNext()) {
                if (thisIter.peekType() === "insert" && (priority || otherIter.peekType() !== "insert")) {
                  delta.retain(op.length(thisIter.next()));
                } else if (otherIter.peekType() === "insert") {
                  delta.push(otherIter.next());
                } else {
                  var length = Math.min(thisIter.peekLength(), otherIter.peekLength());
                  var thisOp = thisIter.next(length);
                  var otherOp = otherIter.next(length);
                  if (thisOp["delete"]) {
                    continue;
                  } else if (otherOp["delete"]) {
                    delta.push(otherOp);
                  } else {
                    delta.retain(length, op.attributes.transform(thisOp.attributes, otherOp.attributes, priority));
                  }
                }
              }
              return delta.chop();
            };
            Delta.prototype.transformPosition = function(index, priority) {
              priority = !!priority;
              var thisIter = op.iterator(this.ops);
              var offset = 0;
              while (thisIter.hasNext() && offset <= index) {
                var length = thisIter.peekLength();
                var nextType = thisIter.peekType();
                thisIter.next();
                if (nextType === "delete") {
                  index -= Math.min(length, index - offset);
                  continue;
                } else if (nextType === "insert" && (offset < index || !priority)) {
                  index += length;
                }
                offset += length;
              }
              return index;
            };
            module2.exports = Delta;
          },
          /* 3 */
          /***/
          function(module2, exports2) {
            "use strict";
            var hasOwn = Object.prototype.hasOwnProperty;
            var toStr = Object.prototype.toString;
            var defineProperty = Object.defineProperty;
            var gOPD = Object.getOwnPropertyDescriptor;
            var isArray2 = function isArray3(arr) {
              if (typeof Array.isArray === "function") {
                return Array.isArray(arr);
              }
              return toStr.call(arr) === "[object Array]";
            };
            var isPlainObject = function isPlainObject2(obj) {
              if (!obj || toStr.call(obj) !== "[object Object]") {
                return false;
              }
              var hasOwnConstructor = hasOwn.call(obj, "constructor");
              var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, "isPrototypeOf");
              if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
                return false;
              }
              var key;
              for (key in obj) {
              }
              return typeof key === "undefined" || hasOwn.call(obj, key);
            };
            var setProperty = function setProperty2(target, options) {
              if (defineProperty && options.name === "__proto__") {
                defineProperty(target, options.name, {
                  enumerable: true,
                  configurable: true,
                  value: options.newValue,
                  writable: true
                });
              } else {
                target[options.name] = options.newValue;
              }
            };
            var getProperty = function getProperty2(obj, name) {
              if (name === "__proto__") {
                if (!hasOwn.call(obj, name)) {
                  return void 0;
                } else if (gOPD) {
                  return gOPD(obj, name).value;
                }
              }
              return obj[name];
            };
            module2.exports = function extend2() {
              var options, name, src, copy, copyIsArray, clone;
              var target = arguments[0];
              var i = 1;
              var length = arguments.length;
              var deep = false;
              if (typeof target === "boolean") {
                deep = target;
                target = arguments[1] || {};
                i = 2;
              }
              if (target == null || typeof target !== "object" && typeof target !== "function") {
                target = {};
              }
              for (; i < length; ++i) {
                options = arguments[i];
                if (options != null) {
                  for (name in options) {
                    src = getProperty(target, name);
                    copy = getProperty(options, name);
                    if (target !== copy) {
                      if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray2(copy)))) {
                        if (copyIsArray) {
                          copyIsArray = false;
                          clone = src && isArray2(src) ? src : [];
                        } else {
                          clone = src && isPlainObject(src) ? src : {};
                        }
                        setProperty(target, { name, newValue: extend2(deep, clone, copy) });
                      } else if (typeof copy !== "undefined") {
                        setProperty(target, { name, newValue: copy });
                      }
                    }
                  }
                }
              }
              return target;
            };
          },
          /* 4 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            exports2.default = exports2.BlockEmbed = exports2.bubbleFormats = void 0;
            var _createClass = /* @__PURE__ */ function() {
              function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
                }
              }
              return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
              };
            }();
            var _get = function get(object, property, receiver) {
              if (object === null) object = Function.prototype;
              var desc = Object.getOwnPropertyDescriptor(object, property);
              if (desc === void 0) {
                var parent = Object.getPrototypeOf(object);
                if (parent === null) {
                  return void 0;
                } else {
                  return get(parent, property, receiver);
                }
              } else if ("value" in desc) {
                return desc.value;
              } else {
                var getter = desc.get;
                if (getter === void 0) {
                  return void 0;
                }
                return getter.call(receiver);
              }
            };
            var _extend = __webpack_require__(3);
            var _extend2 = _interopRequireDefault(_extend);
            var _quillDelta = __webpack_require__(2);
            var _quillDelta2 = _interopRequireDefault(_quillDelta);
            var _parchment = __webpack_require__(0);
            var _parchment2 = _interopRequireDefault(_parchment);
            var _break = __webpack_require__(16);
            var _break2 = _interopRequireDefault(_break);
            var _inline = __webpack_require__(6);
            var _inline2 = _interopRequireDefault(_inline);
            var _text = __webpack_require__(7);
            var _text2 = _interopRequireDefault(_text);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            function _possibleConstructorReturn(self2, call) {
              if (!self2) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              }
              return call && (typeof call === "object" || typeof call === "function") ? call : self2;
            }
            function _inherits(subClass, superClass) {
              if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
              }
              subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
              if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            var NEWLINE_LENGTH = 1;
            var BlockEmbed = function(_Parchment$Embed) {
              _inherits(BlockEmbed2, _Parchment$Embed);
              function BlockEmbed2() {
                _classCallCheck(this, BlockEmbed2);
                return _possibleConstructorReturn(this, (BlockEmbed2.__proto__ || Object.getPrototypeOf(BlockEmbed2)).apply(this, arguments));
              }
              _createClass(BlockEmbed2, [{
                key: "attach",
                value: function attach() {
                  _get(BlockEmbed2.prototype.__proto__ || Object.getPrototypeOf(BlockEmbed2.prototype), "attach", this).call(this);
                  this.attributes = new _parchment2.default.Attributor.Store(this.domNode);
                }
              }, {
                key: "delta",
                value: function delta() {
                  return new _quillDelta2.default().insert(this.value(), (0, _extend2.default)(this.formats(), this.attributes.values()));
                }
              }, {
                key: "format",
                value: function format(name, value) {
                  var attribute = _parchment2.default.query(name, _parchment2.default.Scope.BLOCK_ATTRIBUTE);
                  if (attribute != null) {
                    this.attributes.attribute(attribute, value);
                  }
                }
              }, {
                key: "formatAt",
                value: function formatAt(index, length, name, value) {
                  this.format(name, value);
                }
              }, {
                key: "insertAt",
                value: function insertAt(index, value, def) {
                  if (typeof value === "string" && value.endsWith("\n")) {
                    var block = _parchment2.default.create(Block.blotName);
                    this.parent.insertBefore(block, index === 0 ? this : this.next);
                    block.insertAt(0, value.slice(0, -1));
                  } else {
                    _get(BlockEmbed2.prototype.__proto__ || Object.getPrototypeOf(BlockEmbed2.prototype), "insertAt", this).call(this, index, value, def);
                  }
                }
              }]);
              return BlockEmbed2;
            }(_parchment2.default.Embed);
            BlockEmbed.scope = _parchment2.default.Scope.BLOCK_BLOT;
            var Block = function(_Parchment$Block) {
              _inherits(Block2, _Parchment$Block);
              function Block2(domNode) {
                _classCallCheck(this, Block2);
                var _this2 = _possibleConstructorReturn(this, (Block2.__proto__ || Object.getPrototypeOf(Block2)).call(this, domNode));
                _this2.cache = {};
                return _this2;
              }
              _createClass(Block2, [{
                key: "delta",
                value: function delta() {
                  if (this.cache.delta == null) {
                    this.cache.delta = this.descendants(_parchment2.default.Leaf).reduce(function(delta2, leaf) {
                      if (leaf.length() === 0) {
                        return delta2;
                      } else {
                        return delta2.insert(leaf.value(), bubbleFormats(leaf));
                      }
                    }, new _quillDelta2.default()).insert("\n", bubbleFormats(this));
                  }
                  return this.cache.delta;
                }
              }, {
                key: "deleteAt",
                value: function deleteAt(index, length) {
                  _get(Block2.prototype.__proto__ || Object.getPrototypeOf(Block2.prototype), "deleteAt", this).call(this, index, length);
                  this.cache = {};
                }
              }, {
                key: "formatAt",
                value: function formatAt(index, length, name, value) {
                  if (length <= 0) return;
                  if (_parchment2.default.query(name, _parchment2.default.Scope.BLOCK)) {
                    if (index + length === this.length()) {
                      this.format(name, value);
                    }
                  } else {
                    _get(Block2.prototype.__proto__ || Object.getPrototypeOf(Block2.prototype), "formatAt", this).call(this, index, Math.min(length, this.length() - index - 1), name, value);
                  }
                  this.cache = {};
                }
              }, {
                key: "insertAt",
                value: function insertAt(index, value, def) {
                  if (def != null) return _get(Block2.prototype.__proto__ || Object.getPrototypeOf(Block2.prototype), "insertAt", this).call(this, index, value, def);
                  if (value.length === 0) return;
                  var lines = value.split("\n");
                  var text = lines.shift();
                  if (text.length > 0) {
                    if (index < this.length() - 1 || this.children.tail == null) {
                      _get(Block2.prototype.__proto__ || Object.getPrototypeOf(Block2.prototype), "insertAt", this).call(this, Math.min(index, this.length() - 1), text);
                    } else {
                      this.children.tail.insertAt(this.children.tail.length(), text);
                    }
                    this.cache = {};
                  }
                  var block = this;
                  lines.reduce(function(index2, line) {
                    block = block.split(index2, true);
                    block.insertAt(0, line);
                    return line.length;
                  }, index + text.length);
                }
              }, {
                key: "insertBefore",
                value: function insertBefore(blot, ref) {
                  var head = this.children.head;
                  _get(Block2.prototype.__proto__ || Object.getPrototypeOf(Block2.prototype), "insertBefore", this).call(this, blot, ref);
                  if (head instanceof _break2.default) {
                    head.remove();
                  }
                  this.cache = {};
                }
              }, {
                key: "length",
                value: function length() {
                  if (this.cache.length == null) {
                    this.cache.length = _get(Block2.prototype.__proto__ || Object.getPrototypeOf(Block2.prototype), "length", this).call(this) + NEWLINE_LENGTH;
                  }
                  return this.cache.length;
                }
              }, {
                key: "moveChildren",
                value: function moveChildren(target, ref) {
                  _get(Block2.prototype.__proto__ || Object.getPrototypeOf(Block2.prototype), "moveChildren", this).call(this, target, ref);
                  this.cache = {};
                }
              }, {
                key: "optimize",
                value: function optimize(context) {
                  _get(Block2.prototype.__proto__ || Object.getPrototypeOf(Block2.prototype), "optimize", this).call(this, context);
                  this.cache = {};
                }
              }, {
                key: "path",
                value: function path(index) {
                  return _get(Block2.prototype.__proto__ || Object.getPrototypeOf(Block2.prototype), "path", this).call(this, index, true);
                }
              }, {
                key: "removeChild",
                value: function removeChild(child) {
                  _get(Block2.prototype.__proto__ || Object.getPrototypeOf(Block2.prototype), "removeChild", this).call(this, child);
                  this.cache = {};
                }
              }, {
                key: "split",
                value: function split(index) {
                  var force = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
                  if (force && (index === 0 || index >= this.length() - NEWLINE_LENGTH)) {
                    var clone = this.clone();
                    if (index === 0) {
                      this.parent.insertBefore(clone, this);
                      return this;
                    } else {
                      this.parent.insertBefore(clone, this.next);
                      return clone;
                    }
                  } else {
                    var next = _get(Block2.prototype.__proto__ || Object.getPrototypeOf(Block2.prototype), "split", this).call(this, index, force);
                    this.cache = {};
                    return next;
                  }
                }
              }]);
              return Block2;
            }(_parchment2.default.Block);
            Block.blotName = "block";
            Block.tagName = "P";
            Block.defaultChild = "break";
            Block.allowedChildren = [_inline2.default, _parchment2.default.Embed, _text2.default];
            function bubbleFormats(blot) {
              var formats = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
              if (blot == null) return formats;
              if (typeof blot.formats === "function") {
                formats = (0, _extend2.default)(formats, blot.formats());
              }
              if (blot.parent == null || blot.parent.blotName == "scroll" || blot.parent.statics.scope !== blot.statics.scope) {
                return formats;
              }
              return bubbleFormats(blot.parent, formats);
            }
            exports2.bubbleFormats = bubbleFormats;
            exports2.BlockEmbed = BlockEmbed;
            exports2.default = Block;
          },
          /* 5 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            exports2.default = exports2.overload = exports2.expandConfig = void 0;
            var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
              return typeof obj;
            } : function(obj) {
              return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
            var _slicedToArray = /* @__PURE__ */ function() {
              function sliceIterator(arr, i) {
                var _arr = [];
                var _n = true;
                var _d = false;
                var _e = void 0;
                try {
                  for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);
                    if (i && _arr.length === i) break;
                  }
                } catch (err) {
                  _d = true;
                  _e = err;
                } finally {
                  try {
                    if (!_n && _i["return"]) _i["return"]();
                  } finally {
                    if (_d) throw _e;
                  }
                }
                return _arr;
              }
              return function(arr, i) {
                if (Array.isArray(arr)) {
                  return arr;
                } else if (Symbol.iterator in Object(arr)) {
                  return sliceIterator(arr, i);
                } else {
                  throw new TypeError("Invalid attempt to destructure non-iterable instance");
                }
              };
            }();
            var _createClass = /* @__PURE__ */ function() {
              function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
                }
              }
              return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
              };
            }();
            __webpack_require__(50);
            var _quillDelta = __webpack_require__(2);
            var _quillDelta2 = _interopRequireDefault(_quillDelta);
            var _editor = __webpack_require__(14);
            var _editor2 = _interopRequireDefault(_editor);
            var _emitter3 = __webpack_require__(8);
            var _emitter4 = _interopRequireDefault(_emitter3);
            var _module = __webpack_require__(9);
            var _module2 = _interopRequireDefault(_module);
            var _parchment = __webpack_require__(0);
            var _parchment2 = _interopRequireDefault(_parchment);
            var _selection = __webpack_require__(15);
            var _selection2 = _interopRequireDefault(_selection);
            var _extend = __webpack_require__(3);
            var _extend2 = _interopRequireDefault(_extend);
            var _logger = __webpack_require__(10);
            var _logger2 = _interopRequireDefault(_logger);
            var _theme = __webpack_require__(34);
            var _theme2 = _interopRequireDefault(_theme);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            function _defineProperty(obj, key, value) {
              if (key in obj) {
                Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
              } else {
                obj[key] = value;
              }
              return obj;
            }
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            var debug = (0, _logger2.default)("quill");
            var Quill = function() {
              _createClass(Quill2, null, [{
                key: "debug",
                value: function debug2(limit) {
                  if (limit === true) {
                    limit = "log";
                  }
                  _logger2.default.level(limit);
                }
              }, {
                key: "find",
                value: function find(node) {
                  return node.__quill || _parchment2.default.find(node);
                }
              }, {
                key: "import",
                value: function _import(name) {
                  if (this.imports[name] == null) {
                    debug.error("Cannot import " + name + ". Are you sure it was registered?");
                  }
                  return this.imports[name];
                }
              }, {
                key: "register",
                value: function register(path, target) {
                  var _this = this;
                  var overwrite = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
                  if (typeof path !== "string") {
                    var name = path.attrName || path.blotName;
                    if (typeof name === "string") {
                      this.register("formats/" + name, path, target);
                    } else {
                      Object.keys(path).forEach(function(key) {
                        _this.register(key, path[key], target);
                      });
                    }
                  } else {
                    if (this.imports[path] != null && !overwrite) {
                      debug.warn("Overwriting " + path + " with", target);
                    }
                    this.imports[path] = target;
                    if ((path.startsWith("blots/") || path.startsWith("formats/")) && target.blotName !== "abstract") {
                      _parchment2.default.register(target);
                    } else if (path.startsWith("modules") && typeof target.register === "function") {
                      target.register();
                    }
                  }
                }
              }]);
              function Quill2(container) {
                var _this2 = this;
                var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
                _classCallCheck(this, Quill2);
                this.options = expandConfig(container, options);
                this.container = this.options.container;
                if (this.container == null) {
                  return debug.error("Invalid Quill container", container);
                }
                if (this.options.debug) {
                  Quill2.debug(this.options.debug);
                }
                var html = this.container.innerHTML.trim();
                this.container.classList.add("ql-container");
                this.container.innerHTML = "";
                this.container.__quill = this;
                this.root = this.addContainer("ql-editor");
                this.root.classList.add("ql-blank");
                this.root.setAttribute("data-gramm", false);
                this.scrollingContainer = this.options.scrollingContainer || this.root;
                this.emitter = new _emitter4.default();
                this.scroll = _parchment2.default.create(this.root, {
                  emitter: this.emitter,
                  whitelist: this.options.formats
                });
                this.editor = new _editor2.default(this.scroll);
                this.selection = new _selection2.default(this.scroll, this.emitter);
                this.theme = new this.options.theme(this, this.options);
                this.keyboard = this.theme.addModule("keyboard");
                this.clipboard = this.theme.addModule("clipboard");
                this.history = this.theme.addModule("history");
                this.theme.init();
                this.emitter.on(_emitter4.default.events.EDITOR_CHANGE, function(type) {
                  if (type === _emitter4.default.events.TEXT_CHANGE) {
                    _this2.root.classList.toggle("ql-blank", _this2.editor.isBlank());
                  }
                });
                this.emitter.on(_emitter4.default.events.SCROLL_UPDATE, function(source, mutations) {
                  var range = _this2.selection.lastRange;
                  var index = range && range.length === 0 ? range.index : void 0;
                  modify.call(_this2, function() {
                    return _this2.editor.update(null, mutations, index);
                  }, source);
                });
                var contents = this.clipboard.convert(`<div class='ql-editor' style="white-space: normal;">` + html + "<p><br></p></div>");
                this.setContents(contents);
                this.history.clear();
                if (this.options.placeholder) {
                  this.root.setAttribute("data-placeholder", this.options.placeholder);
                }
                if (this.options.readOnly) {
                  this.disable();
                }
              }
              _createClass(Quill2, [{
                key: "addContainer",
                value: function addContainer(container) {
                  var refNode = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
                  if (typeof container === "string") {
                    var className = container;
                    container = document.createElement("div");
                    container.classList.add(className);
                  }
                  this.container.insertBefore(container, refNode);
                  return container;
                }
              }, {
                key: "blur",
                value: function blur() {
                  this.selection.setRange(null);
                }
              }, {
                key: "deleteText",
                value: function deleteText(index, length, source) {
                  var _this3 = this;
                  var _overload = overload(index, length, source);
                  var _overload2 = _slicedToArray(_overload, 4);
                  index = _overload2[0];
                  length = _overload2[1];
                  source = _overload2[3];
                  return modify.call(this, function() {
                    return _this3.editor.deleteText(index, length);
                  }, source, index, -1 * length);
                }
              }, {
                key: "disable",
                value: function disable() {
                  this.enable(false);
                }
              }, {
                key: "enable",
                value: function enable() {
                  var enabled = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
                  this.scroll.enable(enabled);
                  this.container.classList.toggle("ql-disabled", !enabled);
                }
              }, {
                key: "focus",
                value: function focus() {
                  var scrollTop = this.scrollingContainer.scrollTop;
                  this.selection.focus();
                  this.scrollingContainer.scrollTop = scrollTop;
                  this.scrollIntoView();
                }
              }, {
                key: "format",
                value: function format(name, value) {
                  var _this4 = this;
                  var source = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : _emitter4.default.sources.API;
                  return modify.call(this, function() {
                    var range = _this4.getSelection(true);
                    var change = new _quillDelta2.default();
                    if (range == null) {
                      return change;
                    } else if (_parchment2.default.query(name, _parchment2.default.Scope.BLOCK)) {
                      change = _this4.editor.formatLine(range.index, range.length, _defineProperty({}, name, value));
                    } else if (range.length === 0) {
                      _this4.selection.format(name, value);
                      return change;
                    } else {
                      change = _this4.editor.formatText(range.index, range.length, _defineProperty({}, name, value));
                    }
                    _this4.setSelection(range, _emitter4.default.sources.SILENT);
                    return change;
                  }, source);
                }
              }, {
                key: "formatLine",
                value: function formatLine(index, length, name, value, source) {
                  var _this5 = this;
                  var formats = void 0;
                  var _overload3 = overload(index, length, name, value, source);
                  var _overload4 = _slicedToArray(_overload3, 4);
                  index = _overload4[0];
                  length = _overload4[1];
                  formats = _overload4[2];
                  source = _overload4[3];
                  return modify.call(this, function() {
                    return _this5.editor.formatLine(index, length, formats);
                  }, source, index, 0);
                }
              }, {
                key: "formatText",
                value: function formatText(index, length, name, value, source) {
                  var _this6 = this;
                  var formats = void 0;
                  var _overload5 = overload(index, length, name, value, source);
                  var _overload6 = _slicedToArray(_overload5, 4);
                  index = _overload6[0];
                  length = _overload6[1];
                  formats = _overload6[2];
                  source = _overload6[3];
                  return modify.call(this, function() {
                    return _this6.editor.formatText(index, length, formats);
                  }, source, index, 0);
                }
              }, {
                key: "getBounds",
                value: function getBounds(index) {
                  var length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
                  var bounds = void 0;
                  if (typeof index === "number") {
                    bounds = this.selection.getBounds(index, length);
                  } else {
                    bounds = this.selection.getBounds(index.index, index.length);
                  }
                  var containerBounds = this.container.getBoundingClientRect();
                  return {
                    bottom: bounds.bottom - containerBounds.top,
                    height: bounds.height,
                    left: bounds.left - containerBounds.left,
                    right: bounds.right - containerBounds.left,
                    top: bounds.top - containerBounds.top,
                    width: bounds.width
                  };
                }
              }, {
                key: "getContents",
                value: function getContents() {
                  var index = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
                  var length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.getLength() - index;
                  var _overload7 = overload(index, length);
                  var _overload8 = _slicedToArray(_overload7, 2);
                  index = _overload8[0];
                  length = _overload8[1];
                  return this.editor.getContents(index, length);
                }
              }, {
                key: "getFormat",
                value: function getFormat() {
                  var index = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.getSelection(true);
                  var length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
                  if (typeof index === "number") {
                    return this.editor.getFormat(index, length);
                  } else {
                    return this.editor.getFormat(index.index, index.length);
                  }
                }
              }, {
                key: "getIndex",
                value: function getIndex(blot) {
                  return blot.offset(this.scroll);
                }
              }, {
                key: "getLength",
                value: function getLength() {
                  return this.scroll.length();
                }
              }, {
                key: "getLeaf",
                value: function getLeaf(index) {
                  return this.scroll.leaf(index);
                }
              }, {
                key: "getLine",
                value: function getLine(index) {
                  return this.scroll.line(index);
                }
              }, {
                key: "getLines",
                value: function getLines() {
                  var index = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
                  var length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Number.MAX_VALUE;
                  if (typeof index !== "number") {
                    return this.scroll.lines(index.index, index.length);
                  } else {
                    return this.scroll.lines(index, length);
                  }
                }
              }, {
                key: "getModule",
                value: function getModule(name) {
                  return this.theme.modules[name];
                }
              }, {
                key: "getSelection",
                value: function getSelection() {
                  var focus = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
                  if (focus) this.focus();
                  this.update();
                  return this.selection.getRange()[0];
                }
              }, {
                key: "getText",
                value: function getText() {
                  var index = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
                  var length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.getLength() - index;
                  var _overload9 = overload(index, length);
                  var _overload10 = _slicedToArray(_overload9, 2);
                  index = _overload10[0];
                  length = _overload10[1];
                  return this.editor.getText(index, length);
                }
              }, {
                key: "hasFocus",
                value: function hasFocus() {
                  return this.selection.hasFocus();
                }
              }, {
                key: "insertEmbed",
                value: function insertEmbed(index, embed, value) {
                  var _this7 = this;
                  var source = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : Quill2.sources.API;
                  return modify.call(this, function() {
                    return _this7.editor.insertEmbed(index, embed, value);
                  }, source, index);
                }
              }, {
                key: "insertText",
                value: function insertText(index, text, name, value, source) {
                  var _this8 = this;
                  var formats = void 0;
                  var _overload11 = overload(index, 0, name, value, source);
                  var _overload12 = _slicedToArray(_overload11, 4);
                  index = _overload12[0];
                  formats = _overload12[2];
                  source = _overload12[3];
                  return modify.call(this, function() {
                    return _this8.editor.insertText(index, text, formats);
                  }, source, index, text.length);
                }
              }, {
                key: "isEnabled",
                value: function isEnabled() {
                  return !this.container.classList.contains("ql-disabled");
                }
              }, {
                key: "off",
                value: function off() {
                  return this.emitter.off.apply(this.emitter, arguments);
                }
              }, {
                key: "on",
                value: function on() {
                  return this.emitter.on.apply(this.emitter, arguments);
                }
              }, {
                key: "once",
                value: function once() {
                  return this.emitter.once.apply(this.emitter, arguments);
                }
              }, {
                key: "pasteHTML",
                value: function pasteHTML(index, html, source) {
                  this.clipboard.dangerouslyPasteHTML(index, html, source);
                }
              }, {
                key: "removeFormat",
                value: function removeFormat(index, length, source) {
                  var _this9 = this;
                  var _overload13 = overload(index, length, source);
                  var _overload14 = _slicedToArray(_overload13, 4);
                  index = _overload14[0];
                  length = _overload14[1];
                  source = _overload14[3];
                  return modify.call(this, function() {
                    return _this9.editor.removeFormat(index, length);
                  }, source, index);
                }
              }, {
                key: "scrollIntoView",
                value: function scrollIntoView() {
                  this.selection.scrollIntoView(this.scrollingContainer);
                }
              }, {
                key: "setContents",
                value: function setContents(delta) {
                  var _this10 = this;
                  var source = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : _emitter4.default.sources.API;
                  return modify.call(this, function() {
                    delta = new _quillDelta2.default(delta);
                    var length = _this10.getLength();
                    var deleted = _this10.editor.deleteText(0, length);
                    var applied = _this10.editor.applyDelta(delta);
                    var lastOp = applied.ops[applied.ops.length - 1];
                    if (lastOp != null && typeof lastOp.insert === "string" && lastOp.insert[lastOp.insert.length - 1] === "\n") {
                      _this10.editor.deleteText(_this10.getLength() - 1, 1);
                      applied.delete(1);
                    }
                    var ret = deleted.compose(applied);
                    return ret;
                  }, source);
                }
              }, {
                key: "setSelection",
                value: function setSelection(index, length, source) {
                  if (index == null) {
                    this.selection.setRange(null, length || Quill2.sources.API);
                  } else {
                    var _overload15 = overload(index, length, source);
                    var _overload16 = _slicedToArray(_overload15, 4);
                    index = _overload16[0];
                    length = _overload16[1];
                    source = _overload16[3];
                    this.selection.setRange(new _selection.Range(index, length), source);
                    if (source !== _emitter4.default.sources.SILENT) {
                      this.selection.scrollIntoView(this.scrollingContainer);
                    }
                  }
                }
              }, {
                key: "setText",
                value: function setText(text) {
                  var source = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : _emitter4.default.sources.API;
                  var delta = new _quillDelta2.default().insert(text);
                  return this.setContents(delta, source);
                }
              }, {
                key: "update",
                value: function update() {
                  var source = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : _emitter4.default.sources.USER;
                  var change = this.scroll.update(source);
                  this.selection.update(source);
                  return change;
                }
              }, {
                key: "updateContents",
                value: function updateContents(delta) {
                  var _this11 = this;
                  var source = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : _emitter4.default.sources.API;
                  return modify.call(this, function() {
                    delta = new _quillDelta2.default(delta);
                    return _this11.editor.applyDelta(delta, source);
                  }, source, true);
                }
              }]);
              return Quill2;
            }();
            Quill.DEFAULTS = {
              bounds: null,
              formats: null,
              modules: {},
              placeholder: "",
              readOnly: false,
              scrollingContainer: null,
              strict: true,
              theme: "default"
            };
            Quill.events = _emitter4.default.events;
            Quill.sources = _emitter4.default.sources;
            Quill.version = false ? "dev" : "1.3.7";
            Quill.imports = {
              "delta": _quillDelta2.default,
              "parchment": _parchment2.default,
              "core/module": _module2.default,
              "core/theme": _theme2.default
            };
            function expandConfig(container, userConfig) {
              userConfig = (0, _extend2.default)(true, {
                container,
                modules: {
                  clipboard: true,
                  keyboard: true,
                  history: true
                }
              }, userConfig);
              if (!userConfig.theme || userConfig.theme === Quill.DEFAULTS.theme) {
                userConfig.theme = _theme2.default;
              } else {
                userConfig.theme = Quill.import("themes/" + userConfig.theme);
                if (userConfig.theme == null) {
                  throw new Error("Invalid theme " + userConfig.theme + ". Did you register it?");
                }
              }
              var themeConfig = (0, _extend2.default)(true, {}, userConfig.theme.DEFAULTS);
              [themeConfig, userConfig].forEach(function(config) {
                config.modules = config.modules || {};
                Object.keys(config.modules).forEach(function(module3) {
                  if (config.modules[module3] === true) {
                    config.modules[module3] = {};
                  }
                });
              });
              var moduleNames = Object.keys(themeConfig.modules).concat(Object.keys(userConfig.modules));
              var moduleConfig = moduleNames.reduce(function(config, name) {
                var moduleClass = Quill.import("modules/" + name);
                if (moduleClass == null) {
                  debug.error("Cannot load " + name + " module. Are you sure you registered it?");
                } else {
                  config[name] = moduleClass.DEFAULTS || {};
                }
                return config;
              }, {});
              if (userConfig.modules != null && userConfig.modules.toolbar && userConfig.modules.toolbar.constructor !== Object) {
                userConfig.modules.toolbar = {
                  container: userConfig.modules.toolbar
                };
              }
              userConfig = (0, _extend2.default)(true, {}, Quill.DEFAULTS, { modules: moduleConfig }, themeConfig, userConfig);
              ["bounds", "container", "scrollingContainer"].forEach(function(key) {
                if (typeof userConfig[key] === "string") {
                  userConfig[key] = document.querySelector(userConfig[key]);
                }
              });
              userConfig.modules = Object.keys(userConfig.modules).reduce(function(config, name) {
                if (userConfig.modules[name]) {
                  config[name] = userConfig.modules[name];
                }
                return config;
              }, {});
              return userConfig;
            }
            function modify(modifier, source, index, shift) {
              if (this.options.strict && !this.isEnabled() && source === _emitter4.default.sources.USER) {
                return new _quillDelta2.default();
              }
              var range = index == null ? null : this.getSelection();
              var oldDelta = this.editor.delta;
              var change = modifier();
              if (range != null) {
                if (index === true) index = range.index;
                if (shift == null) {
                  range = shiftRange(range, change, source);
                } else if (shift !== 0) {
                  range = shiftRange(range, index, shift, source);
                }
                this.setSelection(range, _emitter4.default.sources.SILENT);
              }
              if (change.length() > 0) {
                var _emitter;
                var args = [_emitter4.default.events.TEXT_CHANGE, change, oldDelta, source];
                (_emitter = this.emitter).emit.apply(_emitter, [_emitter4.default.events.EDITOR_CHANGE].concat(args));
                if (source !== _emitter4.default.sources.SILENT) {
                  var _emitter2;
                  (_emitter2 = this.emitter).emit.apply(_emitter2, args);
                }
              }
              return change;
            }
            function overload(index, length, name, value, source) {
              var formats = {};
              if (typeof index.index === "number" && typeof index.length === "number") {
                if (typeof length !== "number") {
                  source = value, value = name, name = length, length = index.length, index = index.index;
                } else {
                  length = index.length, index = index.index;
                }
              } else if (typeof length !== "number") {
                source = value, value = name, name = length, length = 0;
              }
              if ((typeof name === "undefined" ? "undefined" : _typeof(name)) === "object") {
                formats = name;
                source = value;
              } else if (typeof name === "string") {
                if (value != null) {
                  formats[name] = value;
                } else {
                  source = name;
                }
              }
              source = source || _emitter4.default.sources.API;
              return [index, length, formats, source];
            }
            function shiftRange(range, index, length, source) {
              if (range == null) return null;
              var start = void 0, end = void 0;
              if (index instanceof _quillDelta2.default) {
                var _map = [range.index, range.index + range.length].map(function(pos) {
                  return index.transformPosition(pos, source !== _emitter4.default.sources.USER);
                });
                var _map2 = _slicedToArray(_map, 2);
                start = _map2[0];
                end = _map2[1];
              } else {
                var _map3 = [range.index, range.index + range.length].map(function(pos) {
                  if (pos < index || pos === index && source === _emitter4.default.sources.USER) return pos;
                  if (length >= 0) {
                    return pos + length;
                  } else {
                    return Math.max(index, pos + length);
                  }
                });
                var _map4 = _slicedToArray(_map3, 2);
                start = _map4[0];
                end = _map4[1];
              }
              return new _selection.Range(start, end - start);
            }
            exports2.expandConfig = expandConfig;
            exports2.overload = overload;
            exports2.default = Quill;
          },
          /* 6 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            var _createClass = /* @__PURE__ */ function() {
              function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
                }
              }
              return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
              };
            }();
            var _get = function get(object, property, receiver) {
              if (object === null) object = Function.prototype;
              var desc = Object.getOwnPropertyDescriptor(object, property);
              if (desc === void 0) {
                var parent = Object.getPrototypeOf(object);
                if (parent === null) {
                  return void 0;
                } else {
                  return get(parent, property, receiver);
                }
              } else if ("value" in desc) {
                return desc.value;
              } else {
                var getter = desc.get;
                if (getter === void 0) {
                  return void 0;
                }
                return getter.call(receiver);
              }
            };
            var _text = __webpack_require__(7);
            var _text2 = _interopRequireDefault(_text);
            var _parchment = __webpack_require__(0);
            var _parchment2 = _interopRequireDefault(_parchment);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            function _possibleConstructorReturn(self2, call) {
              if (!self2) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              }
              return call && (typeof call === "object" || typeof call === "function") ? call : self2;
            }
            function _inherits(subClass, superClass) {
              if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
              }
              subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
              if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            var Inline = function(_Parchment$Inline) {
              _inherits(Inline2, _Parchment$Inline);
              function Inline2() {
                _classCallCheck(this, Inline2);
                return _possibleConstructorReturn(this, (Inline2.__proto__ || Object.getPrototypeOf(Inline2)).apply(this, arguments));
              }
              _createClass(Inline2, [{
                key: "formatAt",
                value: function formatAt(index, length, name, value) {
                  if (Inline2.compare(this.statics.blotName, name) < 0 && _parchment2.default.query(name, _parchment2.default.Scope.BLOT)) {
                    var blot = this.isolate(index, length);
                    if (value) {
                      blot.wrap(name, value);
                    }
                  } else {
                    _get(Inline2.prototype.__proto__ || Object.getPrototypeOf(Inline2.prototype), "formatAt", this).call(this, index, length, name, value);
                  }
                }
              }, {
                key: "optimize",
                value: function optimize(context) {
                  _get(Inline2.prototype.__proto__ || Object.getPrototypeOf(Inline2.prototype), "optimize", this).call(this, context);
                  if (this.parent instanceof Inline2 && Inline2.compare(this.statics.blotName, this.parent.statics.blotName) > 0) {
                    var parent = this.parent.isolate(this.offset(), this.length());
                    this.moveChildren(parent);
                    parent.wrap(this);
                  }
                }
              }], [{
                key: "compare",
                value: function compare(self2, other) {
                  var selfIndex = Inline2.order.indexOf(self2);
                  var otherIndex = Inline2.order.indexOf(other);
                  if (selfIndex >= 0 || otherIndex >= 0) {
                    return selfIndex - otherIndex;
                  } else if (self2 === other) {
                    return 0;
                  } else if (self2 < other) {
                    return -1;
                  } else {
                    return 1;
                  }
                }
              }]);
              return Inline2;
            }(_parchment2.default.Inline);
            Inline.allowedChildren = [Inline, _parchment2.default.Embed, _text2.default];
            Inline.order = [
              "cursor",
              "inline",
              // Must be lower
              "underline",
              "strike",
              "italic",
              "bold",
              "script",
              "link",
              "code"
              // Must be higher
            ];
            exports2.default = Inline;
          },
          /* 7 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            var _parchment = __webpack_require__(0);
            var _parchment2 = _interopRequireDefault(_parchment);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            function _possibleConstructorReturn(self2, call) {
              if (!self2) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              }
              return call && (typeof call === "object" || typeof call === "function") ? call : self2;
            }
            function _inherits(subClass, superClass) {
              if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
              }
              subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
              if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            var TextBlot = function(_Parchment$Text) {
              _inherits(TextBlot2, _Parchment$Text);
              function TextBlot2() {
                _classCallCheck(this, TextBlot2);
                return _possibleConstructorReturn(this, (TextBlot2.__proto__ || Object.getPrototypeOf(TextBlot2)).apply(this, arguments));
              }
              return TextBlot2;
            }(_parchment2.default.Text);
            exports2.default = TextBlot;
          },
          /* 8 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            var _createClass = /* @__PURE__ */ function() {
              function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
                }
              }
              return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
              };
            }();
            var _get = function get(object, property, receiver) {
              if (object === null) object = Function.prototype;
              var desc = Object.getOwnPropertyDescriptor(object, property);
              if (desc === void 0) {
                var parent = Object.getPrototypeOf(object);
                if (parent === null) {
                  return void 0;
                } else {
                  return get(parent, property, receiver);
                }
              } else if ("value" in desc) {
                return desc.value;
              } else {
                var getter = desc.get;
                if (getter === void 0) {
                  return void 0;
                }
                return getter.call(receiver);
              }
            };
            var _eventemitter = __webpack_require__(54);
            var _eventemitter2 = _interopRequireDefault(_eventemitter);
            var _logger = __webpack_require__(10);
            var _logger2 = _interopRequireDefault(_logger);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            function _possibleConstructorReturn(self2, call) {
              if (!self2) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              }
              return call && (typeof call === "object" || typeof call === "function") ? call : self2;
            }
            function _inherits(subClass, superClass) {
              if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
              }
              subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
              if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            var debug = (0, _logger2.default)("quill:events");
            var EVENTS = ["selectionchange", "mousedown", "mouseup", "click"];
            EVENTS.forEach(function(eventName) {
              document.addEventListener(eventName, function() {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                  args[_key] = arguments[_key];
                }
                [].slice.call(document.querySelectorAll(".ql-container")).forEach(function(node) {
                  if (node.__quill && node.__quill.emitter) {
                    var _node$__quill$emitter;
                    (_node$__quill$emitter = node.__quill.emitter).handleDOM.apply(_node$__quill$emitter, args);
                  }
                });
              });
            });
            var Emitter = function(_EventEmitter) {
              _inherits(Emitter2, _EventEmitter);
              function Emitter2() {
                _classCallCheck(this, Emitter2);
                var _this = _possibleConstructorReturn(this, (Emitter2.__proto__ || Object.getPrototypeOf(Emitter2)).call(this));
                _this.listeners = {};
                _this.on("error", debug.error);
                return _this;
              }
              _createClass(Emitter2, [{
                key: "emit",
                value: function emit() {
                  debug.log.apply(debug, arguments);
                  _get(Emitter2.prototype.__proto__ || Object.getPrototypeOf(Emitter2.prototype), "emit", this).apply(this, arguments);
                }
              }, {
                key: "handleDOM",
                value: function handleDOM(event) {
                  for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                    args[_key2 - 1] = arguments[_key2];
                  }
                  (this.listeners[event.type] || []).forEach(function(_ref) {
                    var node = _ref.node, handler = _ref.handler;
                    if (event.target === node || node.contains(event.target)) {
                      handler.apply(void 0, [event].concat(args));
                    }
                  });
                }
              }, {
                key: "listenDOM",
                value: function listenDOM(eventName, node, handler) {
                  if (!this.listeners[eventName]) {
                    this.listeners[eventName] = [];
                  }
                  this.listeners[eventName].push({ node, handler });
                }
              }]);
              return Emitter2;
            }(_eventemitter2.default);
            Emitter.events = {
              EDITOR_CHANGE: "editor-change",
              SCROLL_BEFORE_UPDATE: "scroll-before-update",
              SCROLL_OPTIMIZE: "scroll-optimize",
              SCROLL_UPDATE: "scroll-update",
              SELECTION_CHANGE: "selection-change",
              TEXT_CHANGE: "text-change"
            };
            Emitter.sources = {
              API: "api",
              SILENT: "silent",
              USER: "user"
            };
            exports2.default = Emitter;
          },
          /* 9 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            var Module = function Module2(quill) {
              var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
              _classCallCheck(this, Module2);
              this.quill = quill;
              this.options = options;
            };
            Module.DEFAULTS = {};
            exports2.default = Module;
          },
          /* 10 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            var levels = ["error", "warn", "log", "info"];
            var level = "warn";
            function debug(method) {
              if (levels.indexOf(method) <= levels.indexOf(level)) {
                var _console;
                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                  args[_key - 1] = arguments[_key];
                }
                (_console = console)[method].apply(_console, args);
              }
            }
            function namespace(ns) {
              return levels.reduce(function(logger, method) {
                logger[method] = debug.bind(console, method, ns);
                return logger;
              }, {});
            }
            debug.level = namespace.level = function(newLevel) {
              level = newLevel;
            };
            exports2.default = namespace;
          },
          /* 11 */
          /***/
          function(module2, exports2, __webpack_require__) {
            var pSlice = Array.prototype.slice;
            var objectKeys = __webpack_require__(52);
            var isArguments = __webpack_require__(53);
            var deepEqual = module2.exports = function(actual, expected, opts) {
              if (!opts) opts = {};
              if (actual === expected) {
                return true;
              } else if (actual instanceof Date && expected instanceof Date) {
                return actual.getTime() === expected.getTime();
              } else if (!actual || !expected || typeof actual != "object" && typeof expected != "object") {
                return opts.strict ? actual === expected : actual == expected;
              } else {
                return objEquiv(actual, expected, opts);
              }
            };
            function isUndefinedOrNull(value) {
              return value === null || value === void 0;
            }
            function isBuffer(x) {
              if (!x || typeof x !== "object" || typeof x.length !== "number") return false;
              if (typeof x.copy !== "function" || typeof x.slice !== "function") {
                return false;
              }
              if (x.length > 0 && typeof x[0] !== "number") return false;
              return true;
            }
            function objEquiv(a, b, opts) {
              var i, key;
              if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
                return false;
              if (a.prototype !== b.prototype) return false;
              if (isArguments(a)) {
                if (!isArguments(b)) {
                  return false;
                }
                a = pSlice.call(a);
                b = pSlice.call(b);
                return deepEqual(a, b, opts);
              }
              if (isBuffer(a)) {
                if (!isBuffer(b)) {
                  return false;
                }
                if (a.length !== b.length) return false;
                for (i = 0; i < a.length; i++) {
                  if (a[i] !== b[i]) return false;
                }
                return true;
              }
              try {
                var ka = objectKeys(a), kb = objectKeys(b);
              } catch (e) {
                return false;
              }
              if (ka.length != kb.length)
                return false;
              ka.sort();
              kb.sort();
              for (i = ka.length - 1; i >= 0; i--) {
                if (ka[i] != kb[i])
                  return false;
              }
              for (i = ka.length - 1; i >= 0; i--) {
                key = ka[i];
                if (!deepEqual(a[key], b[key], opts)) return false;
              }
              return typeof a === typeof b;
            }
          },
          /* 12 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", { value: true });
            var Registry = __webpack_require__(1);
            var Attributor = (
              /** @class */
              function() {
                function Attributor2(attrName, keyName, options) {
                  if (options === void 0) {
                    options = {};
                  }
                  this.attrName = attrName;
                  this.keyName = keyName;
                  var attributeBit = Registry.Scope.TYPE & Registry.Scope.ATTRIBUTE;
                  if (options.scope != null) {
                    this.scope = options.scope & Registry.Scope.LEVEL | attributeBit;
                  } else {
                    this.scope = Registry.Scope.ATTRIBUTE;
                  }
                  if (options.whitelist != null)
                    this.whitelist = options.whitelist;
                }
                Attributor2.keys = function(node) {
                  return [].map.call(node.attributes, function(item) {
                    return item.name;
                  });
                };
                Attributor2.prototype.add = function(node, value) {
                  if (!this.canAdd(node, value))
                    return false;
                  node.setAttribute(this.keyName, value);
                  return true;
                };
                Attributor2.prototype.canAdd = function(node, value) {
                  var match = Registry.query(node, Registry.Scope.BLOT & (this.scope | Registry.Scope.TYPE));
                  if (match == null)
                    return false;
                  if (this.whitelist == null)
                    return true;
                  if (typeof value === "string") {
                    return this.whitelist.indexOf(value.replace(/["']/g, "")) > -1;
                  } else {
                    return this.whitelist.indexOf(value) > -1;
                  }
                };
                Attributor2.prototype.remove = function(node) {
                  node.removeAttribute(this.keyName);
                };
                Attributor2.prototype.value = function(node) {
                  var value = node.getAttribute(this.keyName);
                  if (this.canAdd(node, value) && value) {
                    return value;
                  }
                  return "";
                };
                return Attributor2;
              }()
            );
            exports2.default = Attributor;
          },
          /* 13 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            exports2.default = exports2.Code = void 0;
            var _slicedToArray = /* @__PURE__ */ function() {
              function sliceIterator(arr, i) {
                var _arr = [];
                var _n = true;
                var _d = false;
                var _e = void 0;
                try {
                  for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);
                    if (i && _arr.length === i) break;
                  }
                } catch (err) {
                  _d = true;
                  _e = err;
                } finally {
                  try {
                    if (!_n && _i["return"]) _i["return"]();
                  } finally {
                    if (_d) throw _e;
                  }
                }
                return _arr;
              }
              return function(arr, i) {
                if (Array.isArray(arr)) {
                  return arr;
                } else if (Symbol.iterator in Object(arr)) {
                  return sliceIterator(arr, i);
                } else {
                  throw new TypeError("Invalid attempt to destructure non-iterable instance");
                }
              };
            }();
            var _createClass = /* @__PURE__ */ function() {
              function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
                }
              }
              return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
              };
            }();
            var _get = function get(object, property, receiver) {
              if (object === null) object = Function.prototype;
              var desc = Object.getOwnPropertyDescriptor(object, property);
              if (desc === void 0) {
                var parent = Object.getPrototypeOf(object);
                if (parent === null) {
                  return void 0;
                } else {
                  return get(parent, property, receiver);
                }
              } else if ("value" in desc) {
                return desc.value;
              } else {
                var getter = desc.get;
                if (getter === void 0) {
                  return void 0;
                }
                return getter.call(receiver);
              }
            };
            var _quillDelta = __webpack_require__(2);
            var _quillDelta2 = _interopRequireDefault(_quillDelta);
            var _parchment = __webpack_require__(0);
            var _parchment2 = _interopRequireDefault(_parchment);
            var _block = __webpack_require__(4);
            var _block2 = _interopRequireDefault(_block);
            var _inline = __webpack_require__(6);
            var _inline2 = _interopRequireDefault(_inline);
            var _text = __webpack_require__(7);
            var _text2 = _interopRequireDefault(_text);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            function _possibleConstructorReturn(self2, call) {
              if (!self2) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              }
              return call && (typeof call === "object" || typeof call === "function") ? call : self2;
            }
            function _inherits(subClass, superClass) {
              if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
              }
              subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
              if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            var Code = function(_Inline) {
              _inherits(Code2, _Inline);
              function Code2() {
                _classCallCheck(this, Code2);
                return _possibleConstructorReturn(this, (Code2.__proto__ || Object.getPrototypeOf(Code2)).apply(this, arguments));
              }
              return Code2;
            }(_inline2.default);
            Code.blotName = "code";
            Code.tagName = "CODE";
            var CodeBlock = function(_Block) {
              _inherits(CodeBlock2, _Block);
              function CodeBlock2() {
                _classCallCheck(this, CodeBlock2);
                return _possibleConstructorReturn(this, (CodeBlock2.__proto__ || Object.getPrototypeOf(CodeBlock2)).apply(this, arguments));
              }
              _createClass(CodeBlock2, [{
                key: "delta",
                value: function delta() {
                  var _this3 = this;
                  var text = this.domNode.textContent;
                  if (text.endsWith("\n")) {
                    text = text.slice(0, -1);
                  }
                  return text.split("\n").reduce(function(delta2, frag) {
                    return delta2.insert(frag).insert("\n", _this3.formats());
                  }, new _quillDelta2.default());
                }
              }, {
                key: "format",
                value: function format(name, value) {
                  if (name === this.statics.blotName && value) return;
                  var _descendant = this.descendant(_text2.default, this.length() - 1), _descendant2 = _slicedToArray(_descendant, 1), text = _descendant2[0];
                  if (text != null) {
                    text.deleteAt(text.length() - 1, 1);
                  }
                  _get(CodeBlock2.prototype.__proto__ || Object.getPrototypeOf(CodeBlock2.prototype), "format", this).call(this, name, value);
                }
              }, {
                key: "formatAt",
                value: function formatAt(index, length, name, value) {
                  if (length === 0) return;
                  if (_parchment2.default.query(name, _parchment2.default.Scope.BLOCK) == null || name === this.statics.blotName && value === this.statics.formats(this.domNode)) {
                    return;
                  }
                  var nextNewline = this.newlineIndex(index);
                  if (nextNewline < 0 || nextNewline >= index + length) return;
                  var prevNewline = this.newlineIndex(index, true) + 1;
                  var isolateLength = nextNewline - prevNewline + 1;
                  var blot = this.isolate(prevNewline, isolateLength);
                  var next = blot.next;
                  blot.format(name, value);
                  if (next instanceof CodeBlock2) {
                    next.formatAt(0, index - prevNewline + length - isolateLength, name, value);
                  }
                }
              }, {
                key: "insertAt",
                value: function insertAt(index, value, def) {
                  if (def != null) return;
                  var _descendant3 = this.descendant(_text2.default, index), _descendant4 = _slicedToArray(_descendant3, 2), text = _descendant4[0], offset = _descendant4[1];
                  text.insertAt(offset, value);
                }
              }, {
                key: "length",
                value: function length() {
                  var length2 = this.domNode.textContent.length;
                  if (!this.domNode.textContent.endsWith("\n")) {
                    return length2 + 1;
                  }
                  return length2;
                }
              }, {
                key: "newlineIndex",
                value: function newlineIndex(searchIndex) {
                  var reverse = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
                  if (!reverse) {
                    var offset = this.domNode.textContent.slice(searchIndex).indexOf("\n");
                    return offset > -1 ? searchIndex + offset : -1;
                  } else {
                    return this.domNode.textContent.slice(0, searchIndex).lastIndexOf("\n");
                  }
                }
              }, {
                key: "optimize",
                value: function optimize(context) {
                  if (!this.domNode.textContent.endsWith("\n")) {
                    this.appendChild(_parchment2.default.create("text", "\n"));
                  }
                  _get(CodeBlock2.prototype.__proto__ || Object.getPrototypeOf(CodeBlock2.prototype), "optimize", this).call(this, context);
                  var next = this.next;
                  if (next != null && next.prev === this && next.statics.blotName === this.statics.blotName && this.statics.formats(this.domNode) === next.statics.formats(next.domNode)) {
                    next.optimize(context);
                    next.moveChildren(this);
                    next.remove();
                  }
                }
              }, {
                key: "replace",
                value: function replace(target) {
                  _get(CodeBlock2.prototype.__proto__ || Object.getPrototypeOf(CodeBlock2.prototype), "replace", this).call(this, target);
                  [].slice.call(this.domNode.querySelectorAll("*")).forEach(function(node) {
                    var blot = _parchment2.default.find(node);
                    if (blot == null) {
                      node.parentNode.removeChild(node);
                    } else if (blot instanceof _parchment2.default.Embed) {
                      blot.remove();
                    } else {
                      blot.unwrap();
                    }
                  });
                }
              }], [{
                key: "create",
                value: function create(value) {
                  var domNode = _get(CodeBlock2.__proto__ || Object.getPrototypeOf(CodeBlock2), "create", this).call(this, value);
                  domNode.setAttribute("spellcheck", false);
                  return domNode;
                }
              }, {
                key: "formats",
                value: function formats() {
                  return true;
                }
              }]);
              return CodeBlock2;
            }(_block2.default);
            CodeBlock.blotName = "code-block";
            CodeBlock.tagName = "PRE";
            CodeBlock.TAB = "  ";
            exports2.Code = Code;
            exports2.default = CodeBlock;
          },
          /* 14 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
              return typeof obj;
            } : function(obj) {
              return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
            var _slicedToArray = /* @__PURE__ */ function() {
              function sliceIterator(arr, i) {
                var _arr = [];
                var _n = true;
                var _d = false;
                var _e = void 0;
                try {
                  for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);
                    if (i && _arr.length === i) break;
                  }
                } catch (err) {
                  _d = true;
                  _e = err;
                } finally {
                  try {
                    if (!_n && _i["return"]) _i["return"]();
                  } finally {
                    if (_d) throw _e;
                  }
                }
                return _arr;
              }
              return function(arr, i) {
                if (Array.isArray(arr)) {
                  return arr;
                } else if (Symbol.iterator in Object(arr)) {
                  return sliceIterator(arr, i);
                } else {
                  throw new TypeError("Invalid attempt to destructure non-iterable instance");
                }
              };
            }();
            var _createClass = /* @__PURE__ */ function() {
              function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
                }
              }
              return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
              };
            }();
            var _quillDelta = __webpack_require__(2);
            var _quillDelta2 = _interopRequireDefault(_quillDelta);
            var _op = __webpack_require__(20);
            var _op2 = _interopRequireDefault(_op);
            var _parchment = __webpack_require__(0);
            var _parchment2 = _interopRequireDefault(_parchment);
            var _code = __webpack_require__(13);
            var _code2 = _interopRequireDefault(_code);
            var _cursor = __webpack_require__(24);
            var _cursor2 = _interopRequireDefault(_cursor);
            var _block = __webpack_require__(4);
            var _block2 = _interopRequireDefault(_block);
            var _break = __webpack_require__(16);
            var _break2 = _interopRequireDefault(_break);
            var _clone = __webpack_require__(21);
            var _clone2 = _interopRequireDefault(_clone);
            var _deepEqual = __webpack_require__(11);
            var _deepEqual2 = _interopRequireDefault(_deepEqual);
            var _extend = __webpack_require__(3);
            var _extend2 = _interopRequireDefault(_extend);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            function _defineProperty(obj, key, value) {
              if (key in obj) {
                Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
              } else {
                obj[key] = value;
              }
              return obj;
            }
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            var ASCII = /^[ -~]*$/;
            var Editor = function() {
              function Editor2(scroll) {
                _classCallCheck(this, Editor2);
                this.scroll = scroll;
                this.delta = this.getDelta();
              }
              _createClass(Editor2, [{
                key: "applyDelta",
                value: function applyDelta(delta) {
                  var _this = this;
                  var consumeNextNewline = false;
                  this.scroll.update();
                  var scrollLength = this.scroll.length();
                  this.scroll.batchStart();
                  delta = normalizeDelta(delta);
                  delta.reduce(function(index, op) {
                    var length = op.retain || op.delete || op.insert.length || 1;
                    var attributes = op.attributes || {};
                    if (op.insert != null) {
                      if (typeof op.insert === "string") {
                        var text = op.insert;
                        if (text.endsWith("\n") && consumeNextNewline) {
                          consumeNextNewline = false;
                          text = text.slice(0, -1);
                        }
                        if (index >= scrollLength && !text.endsWith("\n")) {
                          consumeNextNewline = true;
                        }
                        _this.scroll.insertAt(index, text);
                        var _scroll$line = _this.scroll.line(index), _scroll$line2 = _slicedToArray(_scroll$line, 2), line = _scroll$line2[0], offset = _scroll$line2[1];
                        var formats = (0, _extend2.default)({}, (0, _block.bubbleFormats)(line));
                        if (line instanceof _block2.default) {
                          var _line$descendant = line.descendant(_parchment2.default.Leaf, offset), _line$descendant2 = _slicedToArray(_line$descendant, 1), leaf = _line$descendant2[0];
                          formats = (0, _extend2.default)(formats, (0, _block.bubbleFormats)(leaf));
                        }
                        attributes = _op2.default.attributes.diff(formats, attributes) || {};
                      } else if (_typeof(op.insert) === "object") {
                        var key = Object.keys(op.insert)[0];
                        if (key == null) return index;
                        _this.scroll.insertAt(index, key, op.insert[key]);
                      }
                      scrollLength += length;
                    }
                    Object.keys(attributes).forEach(function(name) {
                      _this.scroll.formatAt(index, length, name, attributes[name]);
                    });
                    return index + length;
                  }, 0);
                  delta.reduce(function(index, op) {
                    if (typeof op.delete === "number") {
                      _this.scroll.deleteAt(index, op.delete);
                      return index;
                    }
                    return index + (op.retain || op.insert.length || 1);
                  }, 0);
                  this.scroll.batchEnd();
                  return this.update(delta);
                }
              }, {
                key: "deleteText",
                value: function deleteText(index, length) {
                  this.scroll.deleteAt(index, length);
                  return this.update(new _quillDelta2.default().retain(index).delete(length));
                }
              }, {
                key: "formatLine",
                value: function formatLine(index, length) {
                  var _this2 = this;
                  var formats = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
                  this.scroll.update();
                  Object.keys(formats).forEach(function(format) {
                    if (_this2.scroll.whitelist != null && !_this2.scroll.whitelist[format]) return;
                    var lines = _this2.scroll.lines(index, Math.max(length, 1));
                    var lengthRemaining = length;
                    lines.forEach(function(line) {
                      var lineLength = line.length();
                      if (!(line instanceof _code2.default)) {
                        line.format(format, formats[format]);
                      } else {
                        var codeIndex = index - line.offset(_this2.scroll);
                        var codeLength = line.newlineIndex(codeIndex + lengthRemaining) - codeIndex + 1;
                        line.formatAt(codeIndex, codeLength, format, formats[format]);
                      }
                      lengthRemaining -= lineLength;
                    });
                  });
                  this.scroll.optimize();
                  return this.update(new _quillDelta2.default().retain(index).retain(length, (0, _clone2.default)(formats)));
                }
              }, {
                key: "formatText",
                value: function formatText(index, length) {
                  var _this3 = this;
                  var formats = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
                  Object.keys(formats).forEach(function(format) {
                    _this3.scroll.formatAt(index, length, format, formats[format]);
                  });
                  return this.update(new _quillDelta2.default().retain(index).retain(length, (0, _clone2.default)(formats)));
                }
              }, {
                key: "getContents",
                value: function getContents(index, length) {
                  return this.delta.slice(index, index + length);
                }
              }, {
                key: "getDelta",
                value: function getDelta() {
                  return this.scroll.lines().reduce(function(delta, line) {
                    return delta.concat(line.delta());
                  }, new _quillDelta2.default());
                }
              }, {
                key: "getFormat",
                value: function getFormat(index) {
                  var length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
                  var lines = [], leaves = [];
                  if (length === 0) {
                    this.scroll.path(index).forEach(function(path) {
                      var _path = _slicedToArray(path, 1), blot = _path[0];
                      if (blot instanceof _block2.default) {
                        lines.push(blot);
                      } else if (blot instanceof _parchment2.default.Leaf) {
                        leaves.push(blot);
                      }
                    });
                  } else {
                    lines = this.scroll.lines(index, length);
                    leaves = this.scroll.descendants(_parchment2.default.Leaf, index, length);
                  }
                  var formatsArr = [lines, leaves].map(function(blots) {
                    if (blots.length === 0) return {};
                    var formats = (0, _block.bubbleFormats)(blots.shift());
                    while (Object.keys(formats).length > 0) {
                      var blot = blots.shift();
                      if (blot == null) return formats;
                      formats = combineFormats((0, _block.bubbleFormats)(blot), formats);
                    }
                    return formats;
                  });
                  return _extend2.default.apply(_extend2.default, formatsArr);
                }
              }, {
                key: "getText",
                value: function getText(index, length) {
                  return this.getContents(index, length).filter(function(op) {
                    return typeof op.insert === "string";
                  }).map(function(op) {
                    return op.insert;
                  }).join("");
                }
              }, {
                key: "insertEmbed",
                value: function insertEmbed(index, embed, value) {
                  this.scroll.insertAt(index, embed, value);
                  return this.update(new _quillDelta2.default().retain(index).insert(_defineProperty({}, embed, value)));
                }
              }, {
                key: "insertText",
                value: function insertText(index, text) {
                  var _this4 = this;
                  var formats = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
                  text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
                  this.scroll.insertAt(index, text);
                  Object.keys(formats).forEach(function(format) {
                    _this4.scroll.formatAt(index, text.length, format, formats[format]);
                  });
                  return this.update(new _quillDelta2.default().retain(index).insert(text, (0, _clone2.default)(formats)));
                }
              }, {
                key: "isBlank",
                value: function isBlank() {
                  if (this.scroll.children.length == 0) return true;
                  if (this.scroll.children.length > 1) return false;
                  var block = this.scroll.children.head;
                  if (block.statics.blotName !== _block2.default.blotName) return false;
                  if (block.children.length > 1) return false;
                  return block.children.head instanceof _break2.default;
                }
              }, {
                key: "removeFormat",
                value: function removeFormat(index, length) {
                  var text = this.getText(index, length);
                  var _scroll$line3 = this.scroll.line(index + length), _scroll$line4 = _slicedToArray(_scroll$line3, 2), line = _scroll$line4[0], offset = _scroll$line4[1];
                  var suffixLength = 0, suffix = new _quillDelta2.default();
                  if (line != null) {
                    if (!(line instanceof _code2.default)) {
                      suffixLength = line.length() - offset;
                    } else {
                      suffixLength = line.newlineIndex(offset) - offset + 1;
                    }
                    suffix = line.delta().slice(offset, offset + suffixLength - 1).insert("\n");
                  }
                  var contents = this.getContents(index, length + suffixLength);
                  var diff = contents.diff(new _quillDelta2.default().insert(text).concat(suffix));
                  var delta = new _quillDelta2.default().retain(index).concat(diff);
                  return this.applyDelta(delta);
                }
              }, {
                key: "update",
                value: function update(change) {
                  var mutations = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
                  var cursorIndex = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : void 0;
                  var oldDelta = this.delta;
                  if (mutations.length === 1 && mutations[0].type === "characterData" && mutations[0].target.data.match(ASCII) && _parchment2.default.find(mutations[0].target)) {
                    var textBlot = _parchment2.default.find(mutations[0].target);
                    var formats = (0, _block.bubbleFormats)(textBlot);
                    var index = textBlot.offset(this.scroll);
                    var oldValue = mutations[0].oldValue.replace(_cursor2.default.CONTENTS, "");
                    var oldText = new _quillDelta2.default().insert(oldValue);
                    var newText = new _quillDelta2.default().insert(textBlot.value());
                    var diffDelta = new _quillDelta2.default().retain(index).concat(oldText.diff(newText, cursorIndex));
                    change = diffDelta.reduce(function(delta, op) {
                      if (op.insert) {
                        return delta.insert(op.insert, formats);
                      } else {
                        return delta.push(op);
                      }
                    }, new _quillDelta2.default());
                    this.delta = oldDelta.compose(change);
                  } else {
                    this.delta = this.getDelta();
                    if (!change || !(0, _deepEqual2.default)(oldDelta.compose(change), this.delta)) {
                      change = oldDelta.diff(this.delta, cursorIndex);
                    }
                  }
                  return change;
                }
              }]);
              return Editor2;
            }();
            function combineFormats(formats, combined) {
              return Object.keys(combined).reduce(function(merged, name) {
                if (formats[name] == null) return merged;
                if (combined[name] === formats[name]) {
                  merged[name] = combined[name];
                } else if (Array.isArray(combined[name])) {
                  if (combined[name].indexOf(formats[name]) < 0) {
                    merged[name] = combined[name].concat([formats[name]]);
                  }
                } else {
                  merged[name] = [combined[name], formats[name]];
                }
                return merged;
              }, {});
            }
            function normalizeDelta(delta) {
              return delta.reduce(function(delta2, op) {
                if (op.insert === 1) {
                  var attributes = (0, _clone2.default)(op.attributes);
                  delete attributes["image"];
                  return delta2.insert({ image: op.attributes.image }, attributes);
                }
                if (op.attributes != null && (op.attributes.list === true || op.attributes.bullet === true)) {
                  op = (0, _clone2.default)(op);
                  if (op.attributes.list) {
                    op.attributes.list = "ordered";
                  } else {
                    op.attributes.list = "bullet";
                    delete op.attributes.bullet;
                  }
                }
                if (typeof op.insert === "string") {
                  var text = op.insert.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
                  return delta2.insert(text, op.attributes);
                }
                return delta2.push(op);
              }, new _quillDelta2.default());
            }
            exports2.default = Editor;
          },
          /* 15 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            exports2.default = exports2.Range = void 0;
            var _slicedToArray = /* @__PURE__ */ function() {
              function sliceIterator(arr, i) {
                var _arr = [];
                var _n = true;
                var _d = false;
                var _e = void 0;
                try {
                  for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);
                    if (i && _arr.length === i) break;
                  }
                } catch (err) {
                  _d = true;
                  _e = err;
                } finally {
                  try {
                    if (!_n && _i["return"]) _i["return"]();
                  } finally {
                    if (_d) throw _e;
                  }
                }
                return _arr;
              }
              return function(arr, i) {
                if (Array.isArray(arr)) {
                  return arr;
                } else if (Symbol.iterator in Object(arr)) {
                  return sliceIterator(arr, i);
                } else {
                  throw new TypeError("Invalid attempt to destructure non-iterable instance");
                }
              };
            }();
            var _createClass = /* @__PURE__ */ function() {
              function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
                }
              }
              return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
              };
            }();
            var _parchment = __webpack_require__(0);
            var _parchment2 = _interopRequireDefault(_parchment);
            var _clone = __webpack_require__(21);
            var _clone2 = _interopRequireDefault(_clone);
            var _deepEqual = __webpack_require__(11);
            var _deepEqual2 = _interopRequireDefault(_deepEqual);
            var _emitter3 = __webpack_require__(8);
            var _emitter4 = _interopRequireDefault(_emitter3);
            var _logger = __webpack_require__(10);
            var _logger2 = _interopRequireDefault(_logger);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            function _toConsumableArray(arr) {
              if (Array.isArray(arr)) {
                for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
                  arr2[i] = arr[i];
                }
                return arr2;
              } else {
                return Array.from(arr);
              }
            }
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            var debug = (0, _logger2.default)("quill:selection");
            var Range = function Range2(index) {
              var length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
              _classCallCheck(this, Range2);
              this.index = index;
              this.length = length;
            };
            var Selection = function() {
              function Selection2(scroll, emitter) {
                var _this = this;
                _classCallCheck(this, Selection2);
                this.emitter = emitter;
                this.scroll = scroll;
                this.composing = false;
                this.mouseDown = false;
                this.root = this.scroll.domNode;
                this.cursor = _parchment2.default.create("cursor", this);
                this.lastRange = this.savedRange = new Range(0, 0);
                this.handleComposition();
                this.handleDragging();
                this.emitter.listenDOM("selectionchange", document, function() {
                  if (!_this.mouseDown) {
                    setTimeout(_this.update.bind(_this, _emitter4.default.sources.USER), 1);
                  }
                });
                this.emitter.on(_emitter4.default.events.EDITOR_CHANGE, function(type, delta) {
                  if (type === _emitter4.default.events.TEXT_CHANGE && delta.length() > 0) {
                    _this.update(_emitter4.default.sources.SILENT);
                  }
                });
                this.emitter.on(_emitter4.default.events.SCROLL_BEFORE_UPDATE, function() {
                  if (!_this.hasFocus()) return;
                  var native = _this.getNativeRange();
                  if (native == null) return;
                  if (native.start.node === _this.cursor.textNode) return;
                  _this.emitter.once(_emitter4.default.events.SCROLL_UPDATE, function() {
                    try {
                      _this.setNativeRange(native.start.node, native.start.offset, native.end.node, native.end.offset);
                    } catch (ignored) {
                    }
                  });
                });
                this.emitter.on(_emitter4.default.events.SCROLL_OPTIMIZE, function(mutations, context) {
                  if (context.range) {
                    var _context$range = context.range, startNode = _context$range.startNode, startOffset = _context$range.startOffset, endNode = _context$range.endNode, endOffset = _context$range.endOffset;
                    _this.setNativeRange(startNode, startOffset, endNode, endOffset);
                  }
                });
                this.update(_emitter4.default.sources.SILENT);
              }
              _createClass(Selection2, [{
                key: "handleComposition",
                value: function handleComposition() {
                  var _this2 = this;
                  this.root.addEventListener("compositionstart", function() {
                    _this2.composing = true;
                  });
                  this.root.addEventListener("compositionend", function() {
                    _this2.composing = false;
                    if (_this2.cursor.parent) {
                      var range = _this2.cursor.restore();
                      if (!range) return;
                      setTimeout(function() {
                        _this2.setNativeRange(range.startNode, range.startOffset, range.endNode, range.endOffset);
                      }, 1);
                    }
                  });
                }
              }, {
                key: "handleDragging",
                value: function handleDragging() {
                  var _this3 = this;
                  this.emitter.listenDOM("mousedown", document.body, function() {
                    _this3.mouseDown = true;
                  });
                  this.emitter.listenDOM("mouseup", document.body, function() {
                    _this3.mouseDown = false;
                    _this3.update(_emitter4.default.sources.USER);
                  });
                }
              }, {
                key: "focus",
                value: function focus() {
                  if (this.hasFocus()) return;
                  this.root.focus();
                  this.setRange(this.savedRange);
                }
              }, {
                key: "format",
                value: function format(_format, value) {
                  if (this.scroll.whitelist != null && !this.scroll.whitelist[_format]) return;
                  this.scroll.update();
                  var nativeRange = this.getNativeRange();
                  if (nativeRange == null || !nativeRange.native.collapsed || _parchment2.default.query(_format, _parchment2.default.Scope.BLOCK)) return;
                  if (nativeRange.start.node !== this.cursor.textNode) {
                    var blot = _parchment2.default.find(nativeRange.start.node, false);
                    if (blot == null) return;
                    if (blot instanceof _parchment2.default.Leaf) {
                      var after = blot.split(nativeRange.start.offset);
                      blot.parent.insertBefore(this.cursor, after);
                    } else {
                      blot.insertBefore(this.cursor, nativeRange.start.node);
                    }
                    this.cursor.attach();
                  }
                  this.cursor.format(_format, value);
                  this.scroll.optimize();
                  this.setNativeRange(this.cursor.textNode, this.cursor.textNode.data.length);
                  this.update();
                }
              }, {
                key: "getBounds",
                value: function getBounds(index) {
                  var length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
                  var scrollLength = this.scroll.length();
                  index = Math.min(index, scrollLength - 1);
                  length = Math.min(index + length, scrollLength - 1) - index;
                  var node = void 0, _scroll$leaf = this.scroll.leaf(index), _scroll$leaf2 = _slicedToArray(_scroll$leaf, 2), leaf = _scroll$leaf2[0], offset = _scroll$leaf2[1];
                  if (leaf == null) return null;
                  var _leaf$position = leaf.position(offset, true);
                  var _leaf$position2 = _slicedToArray(_leaf$position, 2);
                  node = _leaf$position2[0];
                  offset = _leaf$position2[1];
                  var range = document.createRange();
                  if (length > 0) {
                    range.setStart(node, offset);
                    var _scroll$leaf3 = this.scroll.leaf(index + length);
                    var _scroll$leaf4 = _slicedToArray(_scroll$leaf3, 2);
                    leaf = _scroll$leaf4[0];
                    offset = _scroll$leaf4[1];
                    if (leaf == null) return null;
                    var _leaf$position3 = leaf.position(offset, true);
                    var _leaf$position4 = _slicedToArray(_leaf$position3, 2);
                    node = _leaf$position4[0];
                    offset = _leaf$position4[1];
                    range.setEnd(node, offset);
                    return range.getBoundingClientRect();
                  } else {
                    var side = "left";
                    var rect = void 0;
                    if (node instanceof Text) {
                      if (offset < node.data.length) {
                        range.setStart(node, offset);
                        range.setEnd(node, offset + 1);
                      } else {
                        range.setStart(node, offset - 1);
                        range.setEnd(node, offset);
                        side = "right";
                      }
                      rect = range.getBoundingClientRect();
                    } else {
                      rect = leaf.domNode.getBoundingClientRect();
                      if (offset > 0) side = "right";
                    }
                    return {
                      bottom: rect.top + rect.height,
                      height: rect.height,
                      left: rect[side],
                      right: rect[side],
                      top: rect.top,
                      width: 0
                    };
                  }
                }
              }, {
                key: "getNativeRange",
                value: function getNativeRange() {
                  var selection = document.getSelection();
                  if (selection == null || selection.rangeCount <= 0) return null;
                  var nativeRange = selection.getRangeAt(0);
                  if (nativeRange == null) return null;
                  var range = this.normalizeNative(nativeRange);
                  debug.info("getNativeRange", range);
                  return range;
                }
              }, {
                key: "getRange",
                value: function getRange() {
                  var normalized = this.getNativeRange();
                  if (normalized == null) return [null, null];
                  var range = this.normalizedToRange(normalized);
                  return [range, normalized];
                }
              }, {
                key: "hasFocus",
                value: function hasFocus() {
                  return document.activeElement === this.root;
                }
              }, {
                key: "normalizedToRange",
                value: function normalizedToRange(range) {
                  var _this4 = this;
                  var positions = [[range.start.node, range.start.offset]];
                  if (!range.native.collapsed) {
                    positions.push([range.end.node, range.end.offset]);
                  }
                  var indexes = positions.map(function(position) {
                    var _position = _slicedToArray(position, 2), node = _position[0], offset = _position[1];
                    var blot = _parchment2.default.find(node, true);
                    var index = blot.offset(_this4.scroll);
                    if (offset === 0) {
                      return index;
                    } else if (blot instanceof _parchment2.default.Container) {
                      return index + blot.length();
                    } else {
                      return index + blot.index(node, offset);
                    }
                  });
                  var end = Math.min(Math.max.apply(Math, _toConsumableArray(indexes)), this.scroll.length() - 1);
                  var start = Math.min.apply(Math, [end].concat(_toConsumableArray(indexes)));
                  return new Range(start, end - start);
                }
              }, {
                key: "normalizeNative",
                value: function normalizeNative(nativeRange) {
                  if (!contains(this.root, nativeRange.startContainer) || !nativeRange.collapsed && !contains(this.root, nativeRange.endContainer)) {
                    return null;
                  }
                  var range = {
                    start: { node: nativeRange.startContainer, offset: nativeRange.startOffset },
                    end: { node: nativeRange.endContainer, offset: nativeRange.endOffset },
                    native: nativeRange
                  };
                  [range.start, range.end].forEach(function(position) {
                    var node = position.node, offset = position.offset;
                    while (!(node instanceof Text) && node.childNodes.length > 0) {
                      if (node.childNodes.length > offset) {
                        node = node.childNodes[offset];
                        offset = 0;
                      } else if (node.childNodes.length === offset) {
                        node = node.lastChild;
                        offset = node instanceof Text ? node.data.length : node.childNodes.length + 1;
                      } else {
                        break;
                      }
                    }
                    position.node = node, position.offset = offset;
                  });
                  return range;
                }
              }, {
                key: "rangeToNative",
                value: function rangeToNative(range) {
                  var _this5 = this;
                  var indexes = range.collapsed ? [range.index] : [range.index, range.index + range.length];
                  var args = [];
                  var scrollLength = this.scroll.length();
                  indexes.forEach(function(index, i) {
                    index = Math.min(scrollLength - 1, index);
                    var node = void 0, _scroll$leaf5 = _this5.scroll.leaf(index), _scroll$leaf6 = _slicedToArray(_scroll$leaf5, 2), leaf = _scroll$leaf6[0], offset = _scroll$leaf6[1];
                    var _leaf$position5 = leaf.position(offset, i !== 0);
                    var _leaf$position6 = _slicedToArray(_leaf$position5, 2);
                    node = _leaf$position6[0];
                    offset = _leaf$position6[1];
                    args.push(node, offset);
                  });
                  if (args.length < 2) {
                    args = args.concat(args);
                  }
                  return args;
                }
              }, {
                key: "scrollIntoView",
                value: function scrollIntoView(scrollingContainer) {
                  var range = this.lastRange;
                  if (range == null) return;
                  var bounds = this.getBounds(range.index, range.length);
                  if (bounds == null) return;
                  var limit = this.scroll.length() - 1;
                  var _scroll$line = this.scroll.line(Math.min(range.index, limit)), _scroll$line2 = _slicedToArray(_scroll$line, 1), first = _scroll$line2[0];
                  var last = first;
                  if (range.length > 0) {
                    var _scroll$line3 = this.scroll.line(Math.min(range.index + range.length, limit));
                    var _scroll$line4 = _slicedToArray(_scroll$line3, 1);
                    last = _scroll$line4[0];
                  }
                  if (first == null || last == null) return;
                  var scrollBounds = scrollingContainer.getBoundingClientRect();
                  if (bounds.top < scrollBounds.top) {
                    scrollingContainer.scrollTop -= scrollBounds.top - bounds.top;
                  } else if (bounds.bottom > scrollBounds.bottom) {
                    scrollingContainer.scrollTop += bounds.bottom - scrollBounds.bottom;
                  }
                }
              }, {
                key: "setNativeRange",
                value: function setNativeRange(startNode, startOffset) {
                  var endNode = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : startNode;
                  var endOffset = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : startOffset;
                  var force = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : false;
                  debug.info("setNativeRange", startNode, startOffset, endNode, endOffset);
                  if (startNode != null && (this.root.parentNode == null || startNode.parentNode == null || endNode.parentNode == null)) {
                    return;
                  }
                  var selection = document.getSelection();
                  if (selection == null) return;
                  if (startNode != null) {
                    if (!this.hasFocus()) this.root.focus();
                    var native = (this.getNativeRange() || {}).native;
                    if (native == null || force || startNode !== native.startContainer || startOffset !== native.startOffset || endNode !== native.endContainer || endOffset !== native.endOffset) {
                      if (startNode.tagName == "BR") {
                        startOffset = [].indexOf.call(startNode.parentNode.childNodes, startNode);
                        startNode = startNode.parentNode;
                      }
                      if (endNode.tagName == "BR") {
                        endOffset = [].indexOf.call(endNode.parentNode.childNodes, endNode);
                        endNode = endNode.parentNode;
                      }
                      var range = document.createRange();
                      range.setStart(startNode, startOffset);
                      range.setEnd(endNode, endOffset);
                      selection.removeAllRanges();
                      selection.addRange(range);
                    }
                  } else {
                    selection.removeAllRanges();
                    this.root.blur();
                    document.body.focus();
                  }
                }
              }, {
                key: "setRange",
                value: function setRange(range) {
                  var force = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
                  var source = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : _emitter4.default.sources.API;
                  if (typeof force === "string") {
                    source = force;
                    force = false;
                  }
                  debug.info("setRange", range);
                  if (range != null) {
                    var args = this.rangeToNative(range);
                    this.setNativeRange.apply(this, _toConsumableArray(args).concat([force]));
                  } else {
                    this.setNativeRange(null);
                  }
                  this.update(source);
                }
              }, {
                key: "update",
                value: function update() {
                  var source = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : _emitter4.default.sources.USER;
                  var oldRange = this.lastRange;
                  var _getRange = this.getRange(), _getRange2 = _slicedToArray(_getRange, 2), lastRange = _getRange2[0], nativeRange = _getRange2[1];
                  this.lastRange = lastRange;
                  if (this.lastRange != null) {
                    this.savedRange = this.lastRange;
                  }
                  if (!(0, _deepEqual2.default)(oldRange, this.lastRange)) {
                    var _emitter;
                    if (!this.composing && nativeRange != null && nativeRange.native.collapsed && nativeRange.start.node !== this.cursor.textNode) {
                      this.cursor.restore();
                    }
                    var args = [_emitter4.default.events.SELECTION_CHANGE, (0, _clone2.default)(this.lastRange), (0, _clone2.default)(oldRange), source];
                    (_emitter = this.emitter).emit.apply(_emitter, [_emitter4.default.events.EDITOR_CHANGE].concat(args));
                    if (source !== _emitter4.default.sources.SILENT) {
                      var _emitter2;
                      (_emitter2 = this.emitter).emit.apply(_emitter2, args);
                    }
                  }
                }
              }]);
              return Selection2;
            }();
            function contains(parent, descendant) {
              try {
                descendant.parentNode;
              } catch (e) {
                return false;
              }
              if (descendant instanceof Text) {
                descendant = descendant.parentNode;
              }
              return parent.contains(descendant);
            }
            exports2.Range = Range;
            exports2.default = Selection;
          },
          /* 16 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            var _createClass = /* @__PURE__ */ function() {
              function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
                }
              }
              return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
              };
            }();
            var _get = function get(object, property, receiver) {
              if (object === null) object = Function.prototype;
              var desc = Object.getOwnPropertyDescriptor(object, property);
              if (desc === void 0) {
                var parent = Object.getPrototypeOf(object);
                if (parent === null) {
                  return void 0;
                } else {
                  return get(parent, property, receiver);
                }
              } else if ("value" in desc) {
                return desc.value;
              } else {
                var getter = desc.get;
                if (getter === void 0) {
                  return void 0;
                }
                return getter.call(receiver);
              }
            };
            var _parchment = __webpack_require__(0);
            var _parchment2 = _interopRequireDefault(_parchment);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            function _possibleConstructorReturn(self2, call) {
              if (!self2) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              }
              return call && (typeof call === "object" || typeof call === "function") ? call : self2;
            }
            function _inherits(subClass, superClass) {
              if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
              }
              subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
              if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            var Break = function(_Parchment$Embed) {
              _inherits(Break2, _Parchment$Embed);
              function Break2() {
                _classCallCheck(this, Break2);
                return _possibleConstructorReturn(this, (Break2.__proto__ || Object.getPrototypeOf(Break2)).apply(this, arguments));
              }
              _createClass(Break2, [{
                key: "insertInto",
                value: function insertInto(parent, ref) {
                  if (parent.children.length === 0) {
                    _get(Break2.prototype.__proto__ || Object.getPrototypeOf(Break2.prototype), "insertInto", this).call(this, parent, ref);
                  } else {
                    this.remove();
                  }
                }
              }, {
                key: "length",
                value: function length() {
                  return 0;
                }
              }, {
                key: "value",
                value: function value() {
                  return "";
                }
              }], [{
                key: "value",
                value: function value() {
                  return void 0;
                }
              }]);
              return Break2;
            }(_parchment2.default.Embed);
            Break.blotName = "break";
            Break.tagName = "BR";
            exports2.default = Break;
          },
          /* 17 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            var __extends = this && this.__extends || function() {
              var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
                d.__proto__ = b;
              } || function(d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
              };
              return function(d, b) {
                extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
              };
            }();
            Object.defineProperty(exports2, "__esModule", { value: true });
            var linked_list_1 = __webpack_require__(44);
            var shadow_1 = __webpack_require__(30);
            var Registry = __webpack_require__(1);
            var ContainerBlot = (
              /** @class */
              function(_super) {
                __extends(ContainerBlot2, _super);
                function ContainerBlot2(domNode) {
                  var _this = _super.call(this, domNode) || this;
                  _this.build();
                  return _this;
                }
                ContainerBlot2.prototype.appendChild = function(other) {
                  this.insertBefore(other);
                };
                ContainerBlot2.prototype.attach = function() {
                  _super.prototype.attach.call(this);
                  this.children.forEach(function(child) {
                    child.attach();
                  });
                };
                ContainerBlot2.prototype.build = function() {
                  var _this = this;
                  this.children = new linked_list_1.default();
                  [].slice.call(this.domNode.childNodes).reverse().forEach(function(node) {
                    try {
                      var child = makeBlot(node);
                      _this.insertBefore(child, _this.children.head || void 0);
                    } catch (err) {
                      if (err instanceof Registry.ParchmentError)
                        return;
                      else
                        throw err;
                    }
                  });
                };
                ContainerBlot2.prototype.deleteAt = function(index, length) {
                  if (index === 0 && length === this.length()) {
                    return this.remove();
                  }
                  this.children.forEachAt(index, length, function(child, offset, length2) {
                    child.deleteAt(offset, length2);
                  });
                };
                ContainerBlot2.prototype.descendant = function(criteria, index) {
                  var _a = this.children.find(index), child = _a[0], offset = _a[1];
                  if (criteria.blotName == null && criteria(child) || criteria.blotName != null && child instanceof criteria) {
                    return [child, offset];
                  } else if (child instanceof ContainerBlot2) {
                    return child.descendant(criteria, offset);
                  } else {
                    return [null, -1];
                  }
                };
                ContainerBlot2.prototype.descendants = function(criteria, index, length) {
                  if (index === void 0) {
                    index = 0;
                  }
                  if (length === void 0) {
                    length = Number.MAX_VALUE;
                  }
                  var descendants = [];
                  var lengthLeft = length;
                  this.children.forEachAt(index, length, function(child, index2, length2) {
                    if (criteria.blotName == null && criteria(child) || criteria.blotName != null && child instanceof criteria) {
                      descendants.push(child);
                    }
                    if (child instanceof ContainerBlot2) {
                      descendants = descendants.concat(child.descendants(criteria, index2, lengthLeft));
                    }
                    lengthLeft -= length2;
                  });
                  return descendants;
                };
                ContainerBlot2.prototype.detach = function() {
                  this.children.forEach(function(child) {
                    child.detach();
                  });
                  _super.prototype.detach.call(this);
                };
                ContainerBlot2.prototype.formatAt = function(index, length, name, value) {
                  this.children.forEachAt(index, length, function(child, offset, length2) {
                    child.formatAt(offset, length2, name, value);
                  });
                };
                ContainerBlot2.prototype.insertAt = function(index, value, def) {
                  var _a = this.children.find(index), child = _a[0], offset = _a[1];
                  if (child) {
                    child.insertAt(offset, value, def);
                  } else {
                    var blot = def == null ? Registry.create("text", value) : Registry.create(value, def);
                    this.appendChild(blot);
                  }
                };
                ContainerBlot2.prototype.insertBefore = function(childBlot, refBlot) {
                  if (this.statics.allowedChildren != null && !this.statics.allowedChildren.some(function(child) {
                    return childBlot instanceof child;
                  })) {
                    throw new Registry.ParchmentError("Cannot insert " + childBlot.statics.blotName + " into " + this.statics.blotName);
                  }
                  childBlot.insertInto(this, refBlot);
                };
                ContainerBlot2.prototype.length = function() {
                  return this.children.reduce(function(memo, child) {
                    return memo + child.length();
                  }, 0);
                };
                ContainerBlot2.prototype.moveChildren = function(targetParent, refNode) {
                  this.children.forEach(function(child) {
                    targetParent.insertBefore(child, refNode);
                  });
                };
                ContainerBlot2.prototype.optimize = function(context) {
                  _super.prototype.optimize.call(this, context);
                  if (this.children.length === 0) {
                    if (this.statics.defaultChild != null) {
                      var child = Registry.create(this.statics.defaultChild);
                      this.appendChild(child);
                      child.optimize(context);
                    } else {
                      this.remove();
                    }
                  }
                };
                ContainerBlot2.prototype.path = function(index, inclusive) {
                  if (inclusive === void 0) {
                    inclusive = false;
                  }
                  var _a = this.children.find(index, inclusive), child = _a[0], offset = _a[1];
                  var position = [[this, index]];
                  if (child instanceof ContainerBlot2) {
                    return position.concat(child.path(offset, inclusive));
                  } else if (child != null) {
                    position.push([child, offset]);
                  }
                  return position;
                };
                ContainerBlot2.prototype.removeChild = function(child) {
                  this.children.remove(child);
                };
                ContainerBlot2.prototype.replace = function(target) {
                  if (target instanceof ContainerBlot2) {
                    target.moveChildren(this);
                  }
                  _super.prototype.replace.call(this, target);
                };
                ContainerBlot2.prototype.split = function(index, force) {
                  if (force === void 0) {
                    force = false;
                  }
                  if (!force) {
                    if (index === 0)
                      return this;
                    if (index === this.length())
                      return this.next;
                  }
                  var after = this.clone();
                  this.parent.insertBefore(after, this.next);
                  this.children.forEachAt(index, this.length(), function(child, offset, length) {
                    child = child.split(offset, force);
                    after.appendChild(child);
                  });
                  return after;
                };
                ContainerBlot2.prototype.unwrap = function() {
                  this.moveChildren(this.parent, this.next);
                  this.remove();
                };
                ContainerBlot2.prototype.update = function(mutations, context) {
                  var _this = this;
                  var addedNodes = [];
                  var removedNodes = [];
                  mutations.forEach(function(mutation) {
                    if (mutation.target === _this.domNode && mutation.type === "childList") {
                      addedNodes.push.apply(addedNodes, mutation.addedNodes);
                      removedNodes.push.apply(removedNodes, mutation.removedNodes);
                    }
                  });
                  removedNodes.forEach(function(node) {
                    if (node.parentNode != null && // @ts-ignore
                    node.tagName !== "IFRAME" && document.body.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY) {
                      return;
                    }
                    var blot = Registry.find(node);
                    if (blot == null)
                      return;
                    if (blot.domNode.parentNode == null || blot.domNode.parentNode === _this.domNode) {
                      blot.detach();
                    }
                  });
                  addedNodes.filter(function(node) {
                    return node.parentNode == _this.domNode;
                  }).sort(function(a, b) {
                    if (a === b)
                      return 0;
                    if (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) {
                      return 1;
                    }
                    return -1;
                  }).forEach(function(node) {
                    var refBlot = null;
                    if (node.nextSibling != null) {
                      refBlot = Registry.find(node.nextSibling);
                    }
                    var blot = makeBlot(node);
                    if (blot.next != refBlot || blot.next == null) {
                      if (blot.parent != null) {
                        blot.parent.removeChild(_this);
                      }
                      _this.insertBefore(blot, refBlot || void 0);
                    }
                  });
                };
                return ContainerBlot2;
              }(shadow_1.default)
            );
            function makeBlot(node) {
              var blot = Registry.find(node);
              if (blot == null) {
                try {
                  blot = Registry.create(node);
                } catch (e) {
                  blot = Registry.create(Registry.Scope.INLINE);
                  [].slice.call(node.childNodes).forEach(function(child) {
                    blot.domNode.appendChild(child);
                  });
                  if (node.parentNode) {
                    node.parentNode.replaceChild(blot.domNode, node);
                  }
                  blot.attach();
                }
              }
              return blot;
            }
            exports2.default = ContainerBlot;
          },
          /* 18 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            var __extends = this && this.__extends || function() {
              var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
                d.__proto__ = b;
              } || function(d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
              };
              return function(d, b) {
                extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
              };
            }();
            Object.defineProperty(exports2, "__esModule", { value: true });
            var attributor_1 = __webpack_require__(12);
            var store_1 = __webpack_require__(31);
            var container_1 = __webpack_require__(17);
            var Registry = __webpack_require__(1);
            var FormatBlot = (
              /** @class */
              function(_super) {
                __extends(FormatBlot2, _super);
                function FormatBlot2(domNode) {
                  var _this = _super.call(this, domNode) || this;
                  _this.attributes = new store_1.default(_this.domNode);
                  return _this;
                }
                FormatBlot2.formats = function(domNode) {
                  if (typeof this.tagName === "string") {
                    return true;
                  } else if (Array.isArray(this.tagName)) {
                    return domNode.tagName.toLowerCase();
                  }
                  return void 0;
                };
                FormatBlot2.prototype.format = function(name, value) {
                  var format = Registry.query(name);
                  if (format instanceof attributor_1.default) {
                    this.attributes.attribute(format, value);
                  } else if (value) {
                    if (format != null && (name !== this.statics.blotName || this.formats()[name] !== value)) {
                      this.replaceWith(name, value);
                    }
                  }
                };
                FormatBlot2.prototype.formats = function() {
                  var formats = this.attributes.values();
                  var format = this.statics.formats(this.domNode);
                  if (format != null) {
                    formats[this.statics.blotName] = format;
                  }
                  return formats;
                };
                FormatBlot2.prototype.replaceWith = function(name, value) {
                  var replacement = _super.prototype.replaceWith.call(this, name, value);
                  this.attributes.copy(replacement);
                  return replacement;
                };
                FormatBlot2.prototype.update = function(mutations, context) {
                  var _this = this;
                  _super.prototype.update.call(this, mutations, context);
                  if (mutations.some(function(mutation) {
                    return mutation.target === _this.domNode && mutation.type === "attributes";
                  })) {
                    this.attributes.build();
                  }
                };
                FormatBlot2.prototype.wrap = function(name, value) {
                  var wrapper = _super.prototype.wrap.call(this, name, value);
                  if (wrapper instanceof FormatBlot2 && wrapper.statics.scope === this.statics.scope) {
                    this.attributes.move(wrapper);
                  }
                  return wrapper;
                };
                return FormatBlot2;
              }(container_1.default)
            );
            exports2.default = FormatBlot;
          },
          /* 19 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            var __extends = this && this.__extends || function() {
              var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
                d.__proto__ = b;
              } || function(d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
              };
              return function(d, b) {
                extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
              };
            }();
            Object.defineProperty(exports2, "__esModule", { value: true });
            var shadow_1 = __webpack_require__(30);
            var Registry = __webpack_require__(1);
            var LeafBlot = (
              /** @class */
              function(_super) {
                __extends(LeafBlot2, _super);
                function LeafBlot2() {
                  return _super !== null && _super.apply(this, arguments) || this;
                }
                LeafBlot2.value = function(domNode) {
                  return true;
                };
                LeafBlot2.prototype.index = function(node, offset) {
                  if (this.domNode === node || this.domNode.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY) {
                    return Math.min(offset, 1);
                  }
                  return -1;
                };
                LeafBlot2.prototype.position = function(index, inclusive) {
                  var offset = [].indexOf.call(this.parent.domNode.childNodes, this.domNode);
                  if (index > 0)
                    offset += 1;
                  return [this.parent.domNode, offset];
                };
                LeafBlot2.prototype.value = function() {
                  var _a;
                  return _a = {}, _a[this.statics.blotName] = this.statics.value(this.domNode) || true, _a;
                };
                LeafBlot2.scope = Registry.Scope.INLINE_BLOT;
                return LeafBlot2;
              }(shadow_1.default)
            );
            exports2.default = LeafBlot;
          },
          /* 20 */
          /***/
          function(module2, exports2, __webpack_require__) {
            var equal = __webpack_require__(11);
            var extend2 = __webpack_require__(3);
            var lib = {
              attributes: {
                compose: function(a, b, keepNull) {
                  if (typeof a !== "object") a = {};
                  if (typeof b !== "object") b = {};
                  var attributes = extend2(true, {}, b);
                  if (!keepNull) {
                    attributes = Object.keys(attributes).reduce(function(copy, key2) {
                      if (attributes[key2] != null) {
                        copy[key2] = attributes[key2];
                      }
                      return copy;
                    }, {});
                  }
                  for (var key in a) {
                    if (a[key] !== void 0 && b[key] === void 0) {
                      attributes[key] = a[key];
                    }
                  }
                  return Object.keys(attributes).length > 0 ? attributes : void 0;
                },
                diff: function(a, b) {
                  if (typeof a !== "object") a = {};
                  if (typeof b !== "object") b = {};
                  var attributes = Object.keys(a).concat(Object.keys(b)).reduce(function(attributes2, key) {
                    if (!equal(a[key], b[key])) {
                      attributes2[key] = b[key] === void 0 ? null : b[key];
                    }
                    return attributes2;
                  }, {});
                  return Object.keys(attributes).length > 0 ? attributes : void 0;
                },
                transform: function(a, b, priority) {
                  if (typeof a !== "object") return b;
                  if (typeof b !== "object") return void 0;
                  if (!priority) return b;
                  var attributes = Object.keys(b).reduce(function(attributes2, key) {
                    if (a[key] === void 0) attributes2[key] = b[key];
                    return attributes2;
                  }, {});
                  return Object.keys(attributes).length > 0 ? attributes : void 0;
                }
              },
              iterator: function(ops) {
                return new Iterator(ops);
              },
              length: function(op) {
                if (typeof op["delete"] === "number") {
                  return op["delete"];
                } else if (typeof op.retain === "number") {
                  return op.retain;
                } else {
                  return typeof op.insert === "string" ? op.insert.length : 1;
                }
              }
            };
            function Iterator(ops) {
              this.ops = ops;
              this.index = 0;
              this.offset = 0;
            }
            ;
            Iterator.prototype.hasNext = function() {
              return this.peekLength() < Infinity;
            };
            Iterator.prototype.next = function(length) {
              if (!length) length = Infinity;
              var nextOp = this.ops[this.index];
              if (nextOp) {
                var offset = this.offset;
                var opLength = lib.length(nextOp);
                if (length >= opLength - offset) {
                  length = opLength - offset;
                  this.index += 1;
                  this.offset = 0;
                } else {
                  this.offset += length;
                }
                if (typeof nextOp["delete"] === "number") {
                  return { "delete": length };
                } else {
                  var retOp = {};
                  if (nextOp.attributes) {
                    retOp.attributes = nextOp.attributes;
                  }
                  if (typeof nextOp.retain === "number") {
                    retOp.retain = length;
                  } else if (typeof nextOp.insert === "string") {
                    retOp.insert = nextOp.insert.substr(offset, length);
                  } else {
                    retOp.insert = nextOp.insert;
                  }
                  return retOp;
                }
              } else {
                return { retain: Infinity };
              }
            };
            Iterator.prototype.peek = function() {
              return this.ops[this.index];
            };
            Iterator.prototype.peekLength = function() {
              if (this.ops[this.index]) {
                return lib.length(this.ops[this.index]) - this.offset;
              } else {
                return Infinity;
              }
            };
            Iterator.prototype.peekType = function() {
              if (this.ops[this.index]) {
                if (typeof this.ops[this.index]["delete"] === "number") {
                  return "delete";
                } else if (typeof this.ops[this.index].retain === "number") {
                  return "retain";
                } else {
                  return "insert";
                }
              }
              return "retain";
            };
            Iterator.prototype.rest = function() {
              if (!this.hasNext()) {
                return [];
              } else if (this.offset === 0) {
                return this.ops.slice(this.index);
              } else {
                var offset = this.offset;
                var index = this.index;
                var next = this.next();
                var rest = this.ops.slice(this.index);
                this.offset = offset;
                this.index = index;
                return [next].concat(rest);
              }
            };
            module2.exports = lib;
          },
          /* 21 */
          /***/
          function(module2, exports2) {
            var clone = function() {
              "use strict";
              function _instanceof(obj, type) {
                return type != null && obj instanceof type;
              }
              var nativeMap;
              try {
                nativeMap = Map;
              } catch (_) {
                nativeMap = function() {
                };
              }
              var nativeSet;
              try {
                nativeSet = Set;
              } catch (_) {
                nativeSet = function() {
                };
              }
              var nativePromise;
              try {
                nativePromise = Promise;
              } catch (_) {
                nativePromise = function() {
                };
              }
              function clone2(parent, circular, depth, prototype, includeNonEnumerable) {
                if (typeof circular === "object") {
                  depth = circular.depth;
                  prototype = circular.prototype;
                  includeNonEnumerable = circular.includeNonEnumerable;
                  circular = circular.circular;
                }
                var allParents = [];
                var allChildren = [];
                var useBuffer = typeof Buffer != "undefined";
                if (typeof circular == "undefined")
                  circular = true;
                if (typeof depth == "undefined")
                  depth = Infinity;
                function _clone(parent2, depth2) {
                  if (parent2 === null)
                    return null;
                  if (depth2 === 0)
                    return parent2;
                  var child;
                  var proto;
                  if (typeof parent2 != "object") {
                    return parent2;
                  }
                  if (_instanceof(parent2, nativeMap)) {
                    child = new nativeMap();
                  } else if (_instanceof(parent2, nativeSet)) {
                    child = new nativeSet();
                  } else if (_instanceof(parent2, nativePromise)) {
                    child = new nativePromise(function(resolve, reject) {
                      parent2.then(function(value) {
                        resolve(_clone(value, depth2 - 1));
                      }, function(err) {
                        reject(_clone(err, depth2 - 1));
                      });
                    });
                  } else if (clone2.__isArray(parent2)) {
                    child = [];
                  } else if (clone2.__isRegExp(parent2)) {
                    child = new RegExp(parent2.source, __getRegExpFlags(parent2));
                    if (parent2.lastIndex) child.lastIndex = parent2.lastIndex;
                  } else if (clone2.__isDate(parent2)) {
                    child = new Date(parent2.getTime());
                  } else if (useBuffer && Buffer.isBuffer(parent2)) {
                    if (Buffer.allocUnsafe) {
                      child = Buffer.allocUnsafe(parent2.length);
                    } else {
                      child = new Buffer(parent2.length);
                    }
                    parent2.copy(child);
                    return child;
                  } else if (_instanceof(parent2, Error)) {
                    child = Object.create(parent2);
                  } else {
                    if (typeof prototype == "undefined") {
                      proto = Object.getPrototypeOf(parent2);
                      child = Object.create(proto);
                    } else {
                      child = Object.create(prototype);
                      proto = prototype;
                    }
                  }
                  if (circular) {
                    var index = allParents.indexOf(parent2);
                    if (index != -1) {
                      return allChildren[index];
                    }
                    allParents.push(parent2);
                    allChildren.push(child);
                  }
                  if (_instanceof(parent2, nativeMap)) {
                    parent2.forEach(function(value, key) {
                      var keyChild = _clone(key, depth2 - 1);
                      var valueChild = _clone(value, depth2 - 1);
                      child.set(keyChild, valueChild);
                    });
                  }
                  if (_instanceof(parent2, nativeSet)) {
                    parent2.forEach(function(value) {
                      var entryChild = _clone(value, depth2 - 1);
                      child.add(entryChild);
                    });
                  }
                  for (var i in parent2) {
                    var attrs;
                    if (proto) {
                      attrs = Object.getOwnPropertyDescriptor(proto, i);
                    }
                    if (attrs && attrs.set == null) {
                      continue;
                    }
                    child[i] = _clone(parent2[i], depth2 - 1);
                  }
                  if (Object.getOwnPropertySymbols) {
                    var symbols = Object.getOwnPropertySymbols(parent2);
                    for (var i = 0; i < symbols.length; i++) {
                      var symbol = symbols[i];
                      var descriptor = Object.getOwnPropertyDescriptor(parent2, symbol);
                      if (descriptor && !descriptor.enumerable && !includeNonEnumerable) {
                        continue;
                      }
                      child[symbol] = _clone(parent2[symbol], depth2 - 1);
                      if (!descriptor.enumerable) {
                        Object.defineProperty(child, symbol, {
                          enumerable: false
                        });
                      }
                    }
                  }
                  if (includeNonEnumerable) {
                    var allPropertyNames = Object.getOwnPropertyNames(parent2);
                    for (var i = 0; i < allPropertyNames.length; i++) {
                      var propertyName = allPropertyNames[i];
                      var descriptor = Object.getOwnPropertyDescriptor(parent2, propertyName);
                      if (descriptor && descriptor.enumerable) {
                        continue;
                      }
                      child[propertyName] = _clone(parent2[propertyName], depth2 - 1);
                      Object.defineProperty(child, propertyName, {
                        enumerable: false
                      });
                    }
                  }
                  return child;
                }
                return _clone(parent, depth);
              }
              clone2.clonePrototype = function clonePrototype(parent) {
                if (parent === null)
                  return null;
                var c = function() {
                };
                c.prototype = parent;
                return new c();
              };
              function __objToStr(o) {
                return Object.prototype.toString.call(o);
              }
              clone2.__objToStr = __objToStr;
              function __isDate(o) {
                return typeof o === "object" && __objToStr(o) === "[object Date]";
              }
              clone2.__isDate = __isDate;
              function __isArray(o) {
                return typeof o === "object" && __objToStr(o) === "[object Array]";
              }
              clone2.__isArray = __isArray;
              function __isRegExp(o) {
                return typeof o === "object" && __objToStr(o) === "[object RegExp]";
              }
              clone2.__isRegExp = __isRegExp;
              function __getRegExpFlags(re) {
                var flags = "";
                if (re.global) flags += "g";
                if (re.ignoreCase) flags += "i";
                if (re.multiline) flags += "m";
                return flags;
              }
              clone2.__getRegExpFlags = __getRegExpFlags;
              return clone2;
            }();
            if (typeof module2 === "object" && module2.exports) {
              module2.exports = clone;
            }
          },
          /* 22 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            var _slicedToArray = /* @__PURE__ */ function() {
              function sliceIterator(arr, i) {
                var _arr = [];
                var _n = true;
                var _d = false;
                var _e = void 0;
                try {
                  for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);
                    if (i && _arr.length === i) break;
                  }
                } catch (err) {
                  _d = true;
                  _e = err;
                } finally {
                  try {
                    if (!_n && _i["return"]) _i["return"]();
                  } finally {
                    if (_d) throw _e;
                  }
                }
                return _arr;
              }
              return function(arr, i) {
                if (Array.isArray(arr)) {
                  return arr;
                } else if (Symbol.iterator in Object(arr)) {
                  return sliceIterator(arr, i);
                } else {
                  throw new TypeError("Invalid attempt to destructure non-iterable instance");
                }
              };
            }();
            var _createClass = /* @__PURE__ */ function() {
              function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
                }
              }
              return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
              };
            }();
            var _get = function get(object, property, receiver) {
              if (object === null) object = Function.prototype;
              var desc = Object.getOwnPropertyDescriptor(object, property);
              if (desc === void 0) {
                var parent = Object.getPrototypeOf(object);
                if (parent === null) {
                  return void 0;
                } else {
                  return get(parent, property, receiver);
                }
              } else if ("value" in desc) {
                return desc.value;
              } else {
                var getter = desc.get;
                if (getter === void 0) {
                  return void 0;
                }
                return getter.call(receiver);
              }
            };
            var _parchment = __webpack_require__(0);
            var _parchment2 = _interopRequireDefault(_parchment);
            var _emitter = __webpack_require__(8);
            var _emitter2 = _interopRequireDefault(_emitter);
            var _block = __webpack_require__(4);
            var _block2 = _interopRequireDefault(_block);
            var _break = __webpack_require__(16);
            var _break2 = _interopRequireDefault(_break);
            var _code = __webpack_require__(13);
            var _code2 = _interopRequireDefault(_code);
            var _container = __webpack_require__(25);
            var _container2 = _interopRequireDefault(_container);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            function _possibleConstructorReturn(self2, call) {
              if (!self2) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              }
              return call && (typeof call === "object" || typeof call === "function") ? call : self2;
            }
            function _inherits(subClass, superClass) {
              if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
              }
              subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
              if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            function isLine(blot) {
              return blot instanceof _block2.default || blot instanceof _block.BlockEmbed;
            }
            var Scroll = function(_Parchment$Scroll) {
              _inherits(Scroll2, _Parchment$Scroll);
              function Scroll2(domNode, config) {
                _classCallCheck(this, Scroll2);
                var _this = _possibleConstructorReturn(this, (Scroll2.__proto__ || Object.getPrototypeOf(Scroll2)).call(this, domNode));
                _this.emitter = config.emitter;
                if (Array.isArray(config.whitelist)) {
                  _this.whitelist = config.whitelist.reduce(function(whitelist, format) {
                    whitelist[format] = true;
                    return whitelist;
                  }, {});
                }
                _this.domNode.addEventListener("DOMNodeInserted", function() {
                });
                _this.optimize();
                _this.enable();
                return _this;
              }
              _createClass(Scroll2, [{
                key: "batchStart",
                value: function batchStart() {
                  this.batch = true;
                }
              }, {
                key: "batchEnd",
                value: function batchEnd() {
                  this.batch = false;
                  this.optimize();
                }
              }, {
                key: "deleteAt",
                value: function deleteAt(index, length) {
                  var _line = this.line(index), _line2 = _slicedToArray(_line, 2), first = _line2[0], offset = _line2[1];
                  var _line3 = this.line(index + length), _line4 = _slicedToArray(_line3, 1), last = _line4[0];
                  _get(Scroll2.prototype.__proto__ || Object.getPrototypeOf(Scroll2.prototype), "deleteAt", this).call(this, index, length);
                  if (last != null && first !== last && offset > 0) {
                    if (first instanceof _block.BlockEmbed || last instanceof _block.BlockEmbed) {
                      this.optimize();
                      return;
                    }
                    if (first instanceof _code2.default) {
                      var newlineIndex = first.newlineIndex(first.length(), true);
                      if (newlineIndex > -1) {
                        first = first.split(newlineIndex + 1);
                        if (first === last) {
                          this.optimize();
                          return;
                        }
                      }
                    } else if (last instanceof _code2.default) {
                      var _newlineIndex = last.newlineIndex(0);
                      if (_newlineIndex > -1) {
                        last.split(_newlineIndex + 1);
                      }
                    }
                    var ref = last.children.head instanceof _break2.default ? null : last.children.head;
                    first.moveChildren(last, ref);
                    first.remove();
                  }
                  this.optimize();
                }
              }, {
                key: "enable",
                value: function enable() {
                  var enabled = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
                  this.domNode.setAttribute("contenteditable", enabled);
                }
              }, {
                key: "formatAt",
                value: function formatAt(index, length, format, value) {
                  if (this.whitelist != null && !this.whitelist[format]) return;
                  _get(Scroll2.prototype.__proto__ || Object.getPrototypeOf(Scroll2.prototype), "formatAt", this).call(this, index, length, format, value);
                  this.optimize();
                }
              }, {
                key: "insertAt",
                value: function insertAt(index, value, def) {
                  if (def != null && this.whitelist != null && !this.whitelist[value]) return;
                  if (index >= this.length()) {
                    if (def == null || _parchment2.default.query(value, _parchment2.default.Scope.BLOCK) == null) {
                      var blot = _parchment2.default.create(this.statics.defaultChild);
                      this.appendChild(blot);
                      if (def == null && value.endsWith("\n")) {
                        value = value.slice(0, -1);
                      }
                      blot.insertAt(0, value, def);
                    } else {
                      var embed = _parchment2.default.create(value, def);
                      this.appendChild(embed);
                    }
                  } else {
                    _get(Scroll2.prototype.__proto__ || Object.getPrototypeOf(Scroll2.prototype), "insertAt", this).call(this, index, value, def);
                  }
                  this.optimize();
                }
              }, {
                key: "insertBefore",
                value: function insertBefore(blot, ref) {
                  if (blot.statics.scope === _parchment2.default.Scope.INLINE_BLOT) {
                    var wrapper = _parchment2.default.create(this.statics.defaultChild);
                    wrapper.appendChild(blot);
                    blot = wrapper;
                  }
                  _get(Scroll2.prototype.__proto__ || Object.getPrototypeOf(Scroll2.prototype), "insertBefore", this).call(this, blot, ref);
                }
              }, {
                key: "leaf",
                value: function leaf(index) {
                  return this.path(index).pop() || [null, -1];
                }
              }, {
                key: "line",
                value: function line(index) {
                  if (index === this.length()) {
                    return this.line(index - 1);
                  }
                  return this.descendant(isLine, index);
                }
              }, {
                key: "lines",
                value: function lines() {
                  var index = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
                  var length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Number.MAX_VALUE;
                  var getLines = function getLines2(blot, index2, length2) {
                    var lines2 = [], lengthLeft = length2;
                    blot.children.forEachAt(index2, length2, function(child, index3, length3) {
                      if (isLine(child)) {
                        lines2.push(child);
                      } else if (child instanceof _parchment2.default.Container) {
                        lines2 = lines2.concat(getLines2(child, index3, lengthLeft));
                      }
                      lengthLeft -= length3;
                    });
                    return lines2;
                  };
                  return getLines(this, index, length);
                }
              }, {
                key: "optimize",
                value: function optimize() {
                  var mutations = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
                  var context = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
                  if (this.batch === true) return;
                  _get(Scroll2.prototype.__proto__ || Object.getPrototypeOf(Scroll2.prototype), "optimize", this).call(this, mutations, context);
                  if (mutations.length > 0) {
                    this.emitter.emit(_emitter2.default.events.SCROLL_OPTIMIZE, mutations, context);
                  }
                }
              }, {
                key: "path",
                value: function path(index) {
                  return _get(Scroll2.prototype.__proto__ || Object.getPrototypeOf(Scroll2.prototype), "path", this).call(this, index).slice(1);
                }
              }, {
                key: "update",
                value: function update(mutations) {
                  if (this.batch === true) return;
                  var source = _emitter2.default.sources.USER;
                  if (typeof mutations === "string") {
                    source = mutations;
                  }
                  if (!Array.isArray(mutations)) {
                    mutations = this.observer.takeRecords();
                  }
                  if (mutations.length > 0) {
                    this.emitter.emit(_emitter2.default.events.SCROLL_BEFORE_UPDATE, source, mutations);
                  }
                  _get(Scroll2.prototype.__proto__ || Object.getPrototypeOf(Scroll2.prototype), "update", this).call(this, mutations.concat([]));
                  if (mutations.length > 0) {
                    this.emitter.emit(_emitter2.default.events.SCROLL_UPDATE, source, mutations);
                  }
                }
              }]);
              return Scroll2;
            }(_parchment2.default.Scroll);
            Scroll.blotName = "scroll";
            Scroll.className = "ql-editor";
            Scroll.tagName = "DIV";
            Scroll.defaultChild = "block";
            Scroll.allowedChildren = [_block2.default, _block.BlockEmbed, _container2.default];
            exports2.default = Scroll;
          },
          /* 23 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            exports2.SHORTKEY = exports2.default = void 0;
            var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
              return typeof obj;
            } : function(obj) {
              return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
            var _slicedToArray = /* @__PURE__ */ function() {
              function sliceIterator(arr, i) {
                var _arr = [];
                var _n = true;
                var _d = false;
                var _e = void 0;
                try {
                  for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);
                    if (i && _arr.length === i) break;
                  }
                } catch (err) {
                  _d = true;
                  _e = err;
                } finally {
                  try {
                    if (!_n && _i["return"]) _i["return"]();
                  } finally {
                    if (_d) throw _e;
                  }
                }
                return _arr;
              }
              return function(arr, i) {
                if (Array.isArray(arr)) {
                  return arr;
                } else if (Symbol.iterator in Object(arr)) {
                  return sliceIterator(arr, i);
                } else {
                  throw new TypeError("Invalid attempt to destructure non-iterable instance");
                }
              };
            }();
            var _createClass = /* @__PURE__ */ function() {
              function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
                }
              }
              return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
              };
            }();
            var _clone = __webpack_require__(21);
            var _clone2 = _interopRequireDefault(_clone);
            var _deepEqual = __webpack_require__(11);
            var _deepEqual2 = _interopRequireDefault(_deepEqual);
            var _extend = __webpack_require__(3);
            var _extend2 = _interopRequireDefault(_extend);
            var _quillDelta = __webpack_require__(2);
            var _quillDelta2 = _interopRequireDefault(_quillDelta);
            var _op = __webpack_require__(20);
            var _op2 = _interopRequireDefault(_op);
            var _parchment = __webpack_require__(0);
            var _parchment2 = _interopRequireDefault(_parchment);
            var _quill = __webpack_require__(5);
            var _quill2 = _interopRequireDefault(_quill);
            var _logger = __webpack_require__(10);
            var _logger2 = _interopRequireDefault(_logger);
            var _module = __webpack_require__(9);
            var _module2 = _interopRequireDefault(_module);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            function _defineProperty(obj, key, value) {
              if (key in obj) {
                Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
              } else {
                obj[key] = value;
              }
              return obj;
            }
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            function _possibleConstructorReturn(self2, call) {
              if (!self2) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              }
              return call && (typeof call === "object" || typeof call === "function") ? call : self2;
            }
            function _inherits(subClass, superClass) {
              if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
              }
              subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
              if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            var debug = (0, _logger2.default)("quill:keyboard");
            var SHORTKEY = /Mac/i.test(navigator.platform) ? "metaKey" : "ctrlKey";
            var Keyboard = function(_Module) {
              _inherits(Keyboard2, _Module);
              _createClass(Keyboard2, null, [{
                key: "match",
                value: function match(evt, binding) {
                  binding = normalize(binding);
                  if (["altKey", "ctrlKey", "metaKey", "shiftKey"].some(function(key) {
                    return !!binding[key] !== evt[key] && binding[key] !== null;
                  })) {
                    return false;
                  }
                  return binding.key === (evt.which || evt.keyCode);
                }
              }]);
              function Keyboard2(quill, options) {
                _classCallCheck(this, Keyboard2);
                var _this = _possibleConstructorReturn(this, (Keyboard2.__proto__ || Object.getPrototypeOf(Keyboard2)).call(this, quill, options));
                _this.bindings = {};
                Object.keys(_this.options.bindings).forEach(function(name) {
                  if (name === "list autofill" && quill.scroll.whitelist != null && !quill.scroll.whitelist["list"]) {
                    return;
                  }
                  if (_this.options.bindings[name]) {
                    _this.addBinding(_this.options.bindings[name]);
                  }
                });
                _this.addBinding({ key: Keyboard2.keys.ENTER, shiftKey: null }, handleEnter);
                _this.addBinding({ key: Keyboard2.keys.ENTER, metaKey: null, ctrlKey: null, altKey: null }, function() {
                });
                if (/Firefox/i.test(navigator.userAgent)) {
                  _this.addBinding({ key: Keyboard2.keys.BACKSPACE }, { collapsed: true }, handleBackspace);
                  _this.addBinding({ key: Keyboard2.keys.DELETE }, { collapsed: true }, handleDelete);
                } else {
                  _this.addBinding({ key: Keyboard2.keys.BACKSPACE }, { collapsed: true, prefix: /^.?$/ }, handleBackspace);
                  _this.addBinding({ key: Keyboard2.keys.DELETE }, { collapsed: true, suffix: /^.?$/ }, handleDelete);
                }
                _this.addBinding({ key: Keyboard2.keys.BACKSPACE }, { collapsed: false }, handleDeleteRange);
                _this.addBinding({ key: Keyboard2.keys.DELETE }, { collapsed: false }, handleDeleteRange);
                _this.addBinding({ key: Keyboard2.keys.BACKSPACE, altKey: null, ctrlKey: null, metaKey: null, shiftKey: null }, { collapsed: true, offset: 0 }, handleBackspace);
                _this.listen();
                return _this;
              }
              _createClass(Keyboard2, [{
                key: "addBinding",
                value: function addBinding(key) {
                  var context = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
                  var handler = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
                  var binding = normalize(key);
                  if (binding == null || binding.key == null) {
                    return debug.warn("Attempted to add invalid keyboard binding", binding);
                  }
                  if (typeof context === "function") {
                    context = { handler: context };
                  }
                  if (typeof handler === "function") {
                    handler = { handler };
                  }
                  binding = (0, _extend2.default)(binding, context, handler);
                  this.bindings[binding.key] = this.bindings[binding.key] || [];
                  this.bindings[binding.key].push(binding);
                }
              }, {
                key: "listen",
                value: function listen() {
                  var _this2 = this;
                  this.quill.root.addEventListener("keydown", function(evt) {
                    if (evt.defaultPrevented) return;
                    var which = evt.which || evt.keyCode;
                    var bindings = (_this2.bindings[which] || []).filter(function(binding) {
                      return Keyboard2.match(evt, binding);
                    });
                    if (bindings.length === 0) return;
                    var range = _this2.quill.getSelection();
                    if (range == null || !_this2.quill.hasFocus()) return;
                    var _quill$getLine = _this2.quill.getLine(range.index), _quill$getLine2 = _slicedToArray(_quill$getLine, 2), line = _quill$getLine2[0], offset = _quill$getLine2[1];
                    var _quill$getLeaf = _this2.quill.getLeaf(range.index), _quill$getLeaf2 = _slicedToArray(_quill$getLeaf, 2), leafStart = _quill$getLeaf2[0], offsetStart = _quill$getLeaf2[1];
                    var _ref = range.length === 0 ? [leafStart, offsetStart] : _this2.quill.getLeaf(range.index + range.length), _ref2 = _slicedToArray(_ref, 2), leafEnd = _ref2[0], offsetEnd = _ref2[1];
                    var prefixText = leafStart instanceof _parchment2.default.Text ? leafStart.value().slice(0, offsetStart) : "";
                    var suffixText = leafEnd instanceof _parchment2.default.Text ? leafEnd.value().slice(offsetEnd) : "";
                    var curContext = {
                      collapsed: range.length === 0,
                      empty: range.length === 0 && line.length() <= 1,
                      format: _this2.quill.getFormat(range),
                      offset,
                      prefix: prefixText,
                      suffix: suffixText
                    };
                    var prevented = bindings.some(function(binding) {
                      if (binding.collapsed != null && binding.collapsed !== curContext.collapsed) return false;
                      if (binding.empty != null && binding.empty !== curContext.empty) return false;
                      if (binding.offset != null && binding.offset !== curContext.offset) return false;
                      if (Array.isArray(binding.format)) {
                        if (binding.format.every(function(name) {
                          return curContext.format[name] == null;
                        })) {
                          return false;
                        }
                      } else if (_typeof(binding.format) === "object") {
                        if (!Object.keys(binding.format).every(function(name) {
                          if (binding.format[name] === true) return curContext.format[name] != null;
                          if (binding.format[name] === false) return curContext.format[name] == null;
                          return (0, _deepEqual2.default)(binding.format[name], curContext.format[name]);
                        })) {
                          return false;
                        }
                      }
                      if (binding.prefix != null && !binding.prefix.test(curContext.prefix)) return false;
                      if (binding.suffix != null && !binding.suffix.test(curContext.suffix)) return false;
                      return binding.handler.call(_this2, range, curContext) !== true;
                    });
                    if (prevented) {
                      evt.preventDefault();
                    }
                  });
                }
              }]);
              return Keyboard2;
            }(_module2.default);
            Keyboard.keys = {
              BACKSPACE: 8,
              TAB: 9,
              ENTER: 13,
              ESCAPE: 27,
              LEFT: 37,
              UP: 38,
              RIGHT: 39,
              DOWN: 40,
              DELETE: 46
            };
            Keyboard.DEFAULTS = {
              bindings: {
                "bold": makeFormatHandler("bold"),
                "italic": makeFormatHandler("italic"),
                "underline": makeFormatHandler("underline"),
                "indent": {
                  // highlight tab or tab at beginning of list, indent or blockquote
                  key: Keyboard.keys.TAB,
                  format: ["blockquote", "indent", "list"],
                  handler: function handler(range, context) {
                    if (context.collapsed && context.offset !== 0) return true;
                    this.quill.format("indent", "+1", _quill2.default.sources.USER);
                  }
                },
                "outdent": {
                  key: Keyboard.keys.TAB,
                  shiftKey: true,
                  format: ["blockquote", "indent", "list"],
                  // highlight tab or tab at beginning of list, indent or blockquote
                  handler: function handler(range, context) {
                    if (context.collapsed && context.offset !== 0) return true;
                    this.quill.format("indent", "-1", _quill2.default.sources.USER);
                  }
                },
                "outdent backspace": {
                  key: Keyboard.keys.BACKSPACE,
                  collapsed: true,
                  shiftKey: null,
                  metaKey: null,
                  ctrlKey: null,
                  altKey: null,
                  format: ["indent", "list"],
                  offset: 0,
                  handler: function handler(range, context) {
                    if (context.format.indent != null) {
                      this.quill.format("indent", "-1", _quill2.default.sources.USER);
                    } else if (context.format.list != null) {
                      this.quill.format("list", false, _quill2.default.sources.USER);
                    }
                  }
                },
                "indent code-block": makeCodeBlockHandler(true),
                "outdent code-block": makeCodeBlockHandler(false),
                "remove tab": {
                  key: Keyboard.keys.TAB,
                  shiftKey: true,
                  collapsed: true,
                  prefix: /\t$/,
                  handler: function handler(range) {
                    this.quill.deleteText(range.index - 1, 1, _quill2.default.sources.USER);
                  }
                },
                "tab": {
                  key: Keyboard.keys.TAB,
                  handler: function handler(range) {
                    this.quill.history.cutoff();
                    var delta = new _quillDelta2.default().retain(range.index).delete(range.length).insert("	");
                    this.quill.updateContents(delta, _quill2.default.sources.USER);
                    this.quill.history.cutoff();
                    this.quill.setSelection(range.index + 1, _quill2.default.sources.SILENT);
                  }
                },
                "list empty enter": {
                  key: Keyboard.keys.ENTER,
                  collapsed: true,
                  format: ["list"],
                  empty: true,
                  handler: function handler(range, context) {
                    this.quill.format("list", false, _quill2.default.sources.USER);
                    if (context.format.indent) {
                      this.quill.format("indent", false, _quill2.default.sources.USER);
                    }
                  }
                },
                "checklist enter": {
                  key: Keyboard.keys.ENTER,
                  collapsed: true,
                  format: { list: "checked" },
                  handler: function handler(range) {
                    var _quill$getLine3 = this.quill.getLine(range.index), _quill$getLine4 = _slicedToArray(_quill$getLine3, 2), line = _quill$getLine4[0], offset = _quill$getLine4[1];
                    var formats = (0, _extend2.default)({}, line.formats(), { list: "checked" });
                    var delta = new _quillDelta2.default().retain(range.index).insert("\n", formats).retain(line.length() - offset - 1).retain(1, { list: "unchecked" });
                    this.quill.updateContents(delta, _quill2.default.sources.USER);
                    this.quill.setSelection(range.index + 1, _quill2.default.sources.SILENT);
                    this.quill.scrollIntoView();
                  }
                },
                "header enter": {
                  key: Keyboard.keys.ENTER,
                  collapsed: true,
                  format: ["header"],
                  suffix: /^$/,
                  handler: function handler(range, context) {
                    var _quill$getLine5 = this.quill.getLine(range.index), _quill$getLine6 = _slicedToArray(_quill$getLine5, 2), line = _quill$getLine6[0], offset = _quill$getLine6[1];
                    var delta = new _quillDelta2.default().retain(range.index).insert("\n", context.format).retain(line.length() - offset - 1).retain(1, { header: null });
                    this.quill.updateContents(delta, _quill2.default.sources.USER);
                    this.quill.setSelection(range.index + 1, _quill2.default.sources.SILENT);
                    this.quill.scrollIntoView();
                  }
                },
                "list autofill": {
                  key: " ",
                  collapsed: true,
                  format: { list: false },
                  prefix: /^\s*?(\d+\.|-|\*|\[ ?\]|\[x\])$/,
                  handler: function handler(range, context) {
                    var length = context.prefix.length;
                    var _quill$getLine7 = this.quill.getLine(range.index), _quill$getLine8 = _slicedToArray(_quill$getLine7, 2), line = _quill$getLine8[0], offset = _quill$getLine8[1];
                    if (offset > length) return true;
                    var value = void 0;
                    switch (context.prefix.trim()) {
                      case "[]":
                      case "[ ]":
                        value = "unchecked";
                        break;
                      case "[x]":
                        value = "checked";
                        break;
                      case "-":
                      case "*":
                        value = "bullet";
                        break;
                      default:
                        value = "ordered";
                    }
                    this.quill.insertText(range.index, " ", _quill2.default.sources.USER);
                    this.quill.history.cutoff();
                    var delta = new _quillDelta2.default().retain(range.index - offset).delete(length + 1).retain(line.length() - 2 - offset).retain(1, { list: value });
                    this.quill.updateContents(delta, _quill2.default.sources.USER);
                    this.quill.history.cutoff();
                    this.quill.setSelection(range.index - length, _quill2.default.sources.SILENT);
                  }
                },
                "code exit": {
                  key: Keyboard.keys.ENTER,
                  collapsed: true,
                  format: ["code-block"],
                  prefix: /\n\n$/,
                  suffix: /^\s+$/,
                  handler: function handler(range) {
                    var _quill$getLine9 = this.quill.getLine(range.index), _quill$getLine10 = _slicedToArray(_quill$getLine9, 2), line = _quill$getLine10[0], offset = _quill$getLine10[1];
                    var delta = new _quillDelta2.default().retain(range.index + line.length() - offset - 2).retain(1, { "code-block": null }).delete(1);
                    this.quill.updateContents(delta, _quill2.default.sources.USER);
                  }
                },
                "embed left": makeEmbedArrowHandler(Keyboard.keys.LEFT, false),
                "embed left shift": makeEmbedArrowHandler(Keyboard.keys.LEFT, true),
                "embed right": makeEmbedArrowHandler(Keyboard.keys.RIGHT, false),
                "embed right shift": makeEmbedArrowHandler(Keyboard.keys.RIGHT, true)
              }
            };
            function makeEmbedArrowHandler(key, shiftKey) {
              var _ref3;
              var where = key === Keyboard.keys.LEFT ? "prefix" : "suffix";
              return _ref3 = {
                key,
                shiftKey,
                altKey: null
              }, _defineProperty(_ref3, where, /^$/), _defineProperty(_ref3, "handler", function handler(range) {
                var index = range.index;
                if (key === Keyboard.keys.RIGHT) {
                  index += range.length + 1;
                }
                var _quill$getLeaf3 = this.quill.getLeaf(index), _quill$getLeaf4 = _slicedToArray(_quill$getLeaf3, 1), leaf = _quill$getLeaf4[0];
                if (!(leaf instanceof _parchment2.default.Embed)) return true;
                if (key === Keyboard.keys.LEFT) {
                  if (shiftKey) {
                    this.quill.setSelection(range.index - 1, range.length + 1, _quill2.default.sources.USER);
                  } else {
                    this.quill.setSelection(range.index - 1, _quill2.default.sources.USER);
                  }
                } else {
                  if (shiftKey) {
                    this.quill.setSelection(range.index, range.length + 1, _quill2.default.sources.USER);
                  } else {
                    this.quill.setSelection(range.index + range.length + 1, _quill2.default.sources.USER);
                  }
                }
                return false;
              }), _ref3;
            }
            function handleBackspace(range, context) {
              if (range.index === 0 || this.quill.getLength() <= 1) return;
              var _quill$getLine11 = this.quill.getLine(range.index), _quill$getLine12 = _slicedToArray(_quill$getLine11, 1), line = _quill$getLine12[0];
              var formats = {};
              if (context.offset === 0) {
                var _quill$getLine13 = this.quill.getLine(range.index - 1), _quill$getLine14 = _slicedToArray(_quill$getLine13, 1), prev = _quill$getLine14[0];
                if (prev != null && prev.length() > 1) {
                  var curFormats = line.formats();
                  var prevFormats = this.quill.getFormat(range.index - 1, 1);
                  formats = _op2.default.attributes.diff(curFormats, prevFormats) || {};
                }
              }
              var length = /[\uD800-\uDBFF][\uDC00-\uDFFF]$/.test(context.prefix) ? 2 : 1;
              this.quill.deleteText(range.index - length, length, _quill2.default.sources.USER);
              if (Object.keys(formats).length > 0) {
                this.quill.formatLine(range.index - length, length, formats, _quill2.default.sources.USER);
              }
              this.quill.focus();
            }
            function handleDelete(range, context) {
              var length = /^[\uD800-\uDBFF][\uDC00-\uDFFF]/.test(context.suffix) ? 2 : 1;
              if (range.index >= this.quill.getLength() - length) return;
              var formats = {}, nextLength = 0;
              var _quill$getLine15 = this.quill.getLine(range.index), _quill$getLine16 = _slicedToArray(_quill$getLine15, 1), line = _quill$getLine16[0];
              if (context.offset >= line.length() - 1) {
                var _quill$getLine17 = this.quill.getLine(range.index + 1), _quill$getLine18 = _slicedToArray(_quill$getLine17, 1), next = _quill$getLine18[0];
                if (next) {
                  var curFormats = line.formats();
                  var nextFormats = this.quill.getFormat(range.index, 1);
                  formats = _op2.default.attributes.diff(curFormats, nextFormats) || {};
                  nextLength = next.length();
                }
              }
              this.quill.deleteText(range.index, length, _quill2.default.sources.USER);
              if (Object.keys(formats).length > 0) {
                this.quill.formatLine(range.index + nextLength - 1, length, formats, _quill2.default.sources.USER);
              }
            }
            function handleDeleteRange(range) {
              var lines = this.quill.getLines(range);
              var formats = {};
              if (lines.length > 1) {
                var firstFormats = lines[0].formats();
                var lastFormats = lines[lines.length - 1].formats();
                formats = _op2.default.attributes.diff(lastFormats, firstFormats) || {};
              }
              this.quill.deleteText(range, _quill2.default.sources.USER);
              if (Object.keys(formats).length > 0) {
                this.quill.formatLine(range.index, 1, formats, _quill2.default.sources.USER);
              }
              this.quill.setSelection(range.index, _quill2.default.sources.SILENT);
              this.quill.focus();
            }
            function handleEnter(range, context) {
              var _this3 = this;
              if (range.length > 0) {
                this.quill.scroll.deleteAt(range.index, range.length);
              }
              var lineFormats = Object.keys(context.format).reduce(function(lineFormats2, format) {
                if (_parchment2.default.query(format, _parchment2.default.Scope.BLOCK) && !Array.isArray(context.format[format])) {
                  lineFormats2[format] = context.format[format];
                }
                return lineFormats2;
              }, {});
              this.quill.insertText(range.index, "\n", lineFormats, _quill2.default.sources.USER);
              this.quill.setSelection(range.index + 1, _quill2.default.sources.SILENT);
              this.quill.focus();
              Object.keys(context.format).forEach(function(name) {
                if (lineFormats[name] != null) return;
                if (Array.isArray(context.format[name])) return;
                if (name === "link") return;
                _this3.quill.format(name, context.format[name], _quill2.default.sources.USER);
              });
            }
            function makeCodeBlockHandler(indent) {
              return {
                key: Keyboard.keys.TAB,
                shiftKey: !indent,
                format: { "code-block": true },
                handler: function handler(range) {
                  var CodeBlock = _parchment2.default.query("code-block");
                  var index = range.index, length = range.length;
                  var _quill$scroll$descend = this.quill.scroll.descendant(CodeBlock, index), _quill$scroll$descend2 = _slicedToArray(_quill$scroll$descend, 2), block = _quill$scroll$descend2[0], offset = _quill$scroll$descend2[1];
                  if (block == null) return;
                  var scrollIndex = this.quill.getIndex(block);
                  var start = block.newlineIndex(offset, true) + 1;
                  var end = block.newlineIndex(scrollIndex + offset + length);
                  var lines = block.domNode.textContent.slice(start, end).split("\n");
                  offset = 0;
                  lines.forEach(function(line, i) {
                    if (indent) {
                      block.insertAt(start + offset, CodeBlock.TAB);
                      offset += CodeBlock.TAB.length;
                      if (i === 0) {
                        index += CodeBlock.TAB.length;
                      } else {
                        length += CodeBlock.TAB.length;
                      }
                    } else if (line.startsWith(CodeBlock.TAB)) {
                      block.deleteAt(start + offset, CodeBlock.TAB.length);
                      offset -= CodeBlock.TAB.length;
                      if (i === 0) {
                        index -= CodeBlock.TAB.length;
                      } else {
                        length -= CodeBlock.TAB.length;
                      }
                    }
                    offset += line.length + 1;
                  });
                  this.quill.update(_quill2.default.sources.USER);
                  this.quill.setSelection(index, length, _quill2.default.sources.SILENT);
                }
              };
            }
            function makeFormatHandler(format) {
              return {
                key: format[0].toUpperCase(),
                shortKey: true,
                handler: function handler(range, context) {
                  this.quill.format(format, !context.format[format], _quill2.default.sources.USER);
                }
              };
            }
            function normalize(binding) {
              if (typeof binding === "string" || typeof binding === "number") {
                return normalize({ key: binding });
              }
              if ((typeof binding === "undefined" ? "undefined" : _typeof(binding)) === "object") {
                binding = (0, _clone2.default)(binding, false);
              }
              if (typeof binding.key === "string") {
                if (Keyboard.keys[binding.key.toUpperCase()] != null) {
                  binding.key = Keyboard.keys[binding.key.toUpperCase()];
                } else if (binding.key.length === 1) {
                  binding.key = binding.key.toUpperCase().charCodeAt(0);
                } else {
                  return null;
                }
              }
              if (binding.shortKey) {
                binding[SHORTKEY] = binding.shortKey;
                delete binding.shortKey;
              }
              return binding;
            }
            exports2.default = Keyboard;
            exports2.SHORTKEY = SHORTKEY;
          },
          /* 24 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            var _slicedToArray = /* @__PURE__ */ function() {
              function sliceIterator(arr, i) {
                var _arr = [];
                var _n = true;
                var _d = false;
                var _e = void 0;
                try {
                  for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);
                    if (i && _arr.length === i) break;
                  }
                } catch (err) {
                  _d = true;
                  _e = err;
                } finally {
                  try {
                    if (!_n && _i["return"]) _i["return"]();
                  } finally {
                    if (_d) throw _e;
                  }
                }
                return _arr;
              }
              return function(arr, i) {
                if (Array.isArray(arr)) {
                  return arr;
                } else if (Symbol.iterator in Object(arr)) {
                  return sliceIterator(arr, i);
                } else {
                  throw new TypeError("Invalid attempt to destructure non-iterable instance");
                }
              };
            }();
            var _get = function get(object, property, receiver) {
              if (object === null) object = Function.prototype;
              var desc = Object.getOwnPropertyDescriptor(object, property);
              if (desc === void 0) {
                var parent = Object.getPrototypeOf(object);
                if (parent === null) {
                  return void 0;
                } else {
                  return get(parent, property, receiver);
                }
              } else if ("value" in desc) {
                return desc.value;
              } else {
                var getter = desc.get;
                if (getter === void 0) {
                  return void 0;
                }
                return getter.call(receiver);
              }
            };
            var _createClass = /* @__PURE__ */ function() {
              function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
                }
              }
              return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
              };
            }();
            var _parchment = __webpack_require__(0);
            var _parchment2 = _interopRequireDefault(_parchment);
            var _text = __webpack_require__(7);
            var _text2 = _interopRequireDefault(_text);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            function _possibleConstructorReturn(self2, call) {
              if (!self2) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              }
              return call && (typeof call === "object" || typeof call === "function") ? call : self2;
            }
            function _inherits(subClass, superClass) {
              if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
              }
              subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
              if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            var Cursor = function(_Parchment$Embed) {
              _inherits(Cursor2, _Parchment$Embed);
              _createClass(Cursor2, null, [{
                key: "value",
                value: function value() {
                  return void 0;
                }
              }]);
              function Cursor2(domNode, selection) {
                _classCallCheck(this, Cursor2);
                var _this = _possibleConstructorReturn(this, (Cursor2.__proto__ || Object.getPrototypeOf(Cursor2)).call(this, domNode));
                _this.selection = selection;
                _this.textNode = document.createTextNode(Cursor2.CONTENTS);
                _this.domNode.appendChild(_this.textNode);
                _this._length = 0;
                return _this;
              }
              _createClass(Cursor2, [{
                key: "detach",
                value: function detach() {
                  if (this.parent != null) this.parent.removeChild(this);
                }
              }, {
                key: "format",
                value: function format(name, value) {
                  if (this._length !== 0) {
                    return _get(Cursor2.prototype.__proto__ || Object.getPrototypeOf(Cursor2.prototype), "format", this).call(this, name, value);
                  }
                  var target = this, index = 0;
                  while (target != null && target.statics.scope !== _parchment2.default.Scope.BLOCK_BLOT) {
                    index += target.offset(target.parent);
                    target = target.parent;
                  }
                  if (target != null) {
                    this._length = Cursor2.CONTENTS.length;
                    target.optimize();
                    target.formatAt(index, Cursor2.CONTENTS.length, name, value);
                    this._length = 0;
                  }
                }
              }, {
                key: "index",
                value: function index(node, offset) {
                  if (node === this.textNode) return 0;
                  return _get(Cursor2.prototype.__proto__ || Object.getPrototypeOf(Cursor2.prototype), "index", this).call(this, node, offset);
                }
              }, {
                key: "length",
                value: function length() {
                  return this._length;
                }
              }, {
                key: "position",
                value: function position() {
                  return [this.textNode, this.textNode.data.length];
                }
              }, {
                key: "remove",
                value: function remove() {
                  _get(Cursor2.prototype.__proto__ || Object.getPrototypeOf(Cursor2.prototype), "remove", this).call(this);
                  this.parent = null;
                }
              }, {
                key: "restore",
                value: function restore() {
                  if (this.selection.composing || this.parent == null) return;
                  var textNode = this.textNode;
                  var range = this.selection.getNativeRange();
                  var restoreText = void 0, start = void 0, end = void 0;
                  if (range != null && range.start.node === textNode && range.end.node === textNode) {
                    var _ref = [textNode, range.start.offset, range.end.offset];
                    restoreText = _ref[0];
                    start = _ref[1];
                    end = _ref[2];
                  }
                  while (this.domNode.lastChild != null && this.domNode.lastChild !== this.textNode) {
                    this.domNode.parentNode.insertBefore(this.domNode.lastChild, this.domNode);
                  }
                  if (this.textNode.data !== Cursor2.CONTENTS) {
                    var text = this.textNode.data.split(Cursor2.CONTENTS).join("");
                    if (this.next instanceof _text2.default) {
                      restoreText = this.next.domNode;
                      this.next.insertAt(0, text);
                      this.textNode.data = Cursor2.CONTENTS;
                    } else {
                      this.textNode.data = text;
                      this.parent.insertBefore(_parchment2.default.create(this.textNode), this);
                      this.textNode = document.createTextNode(Cursor2.CONTENTS);
                      this.domNode.appendChild(this.textNode);
                    }
                  }
                  this.remove();
                  if (start != null) {
                    var _map = [start, end].map(function(offset) {
                      return Math.max(0, Math.min(restoreText.data.length, offset - 1));
                    });
                    var _map2 = _slicedToArray(_map, 2);
                    start = _map2[0];
                    end = _map2[1];
                    return {
                      startNode: restoreText,
                      startOffset: start,
                      endNode: restoreText,
                      endOffset: end
                    };
                  }
                }
              }, {
                key: "update",
                value: function update(mutations, context) {
                  var _this2 = this;
                  if (mutations.some(function(mutation) {
                    return mutation.type === "characterData" && mutation.target === _this2.textNode;
                  })) {
                    var range = this.restore();
                    if (range) context.range = range;
                  }
                }
              }, {
                key: "value",
                value: function value() {
                  return "";
                }
              }]);
              return Cursor2;
            }(_parchment2.default.Embed);
            Cursor.blotName = "cursor";
            Cursor.className = "ql-cursor";
            Cursor.tagName = "span";
            Cursor.CONTENTS = "\uFEFF";
            exports2.default = Cursor;
          },
          /* 25 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            var _parchment = __webpack_require__(0);
            var _parchment2 = _interopRequireDefault(_parchment);
            var _block = __webpack_require__(4);
            var _block2 = _interopRequireDefault(_block);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            function _possibleConstructorReturn(self2, call) {
              if (!self2) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              }
              return call && (typeof call === "object" || typeof call === "function") ? call : self2;
            }
            function _inherits(subClass, superClass) {
              if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
              }
              subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
              if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            var Container = function(_Parchment$Container) {
              _inherits(Container2, _Parchment$Container);
              function Container2() {
                _classCallCheck(this, Container2);
                return _possibleConstructorReturn(this, (Container2.__proto__ || Object.getPrototypeOf(Container2)).apply(this, arguments));
              }
              return Container2;
            }(_parchment2.default.Container);
            Container.allowedChildren = [_block2.default, _block.BlockEmbed, Container];
            exports2.default = Container;
          },
          /* 26 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            exports2.ColorStyle = exports2.ColorClass = exports2.ColorAttributor = void 0;
            var _createClass = /* @__PURE__ */ function() {
              function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
                }
              }
              return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
              };
            }();
            var _get = function get(object, property, receiver) {
              if (object === null) object = Function.prototype;
              var desc = Object.getOwnPropertyDescriptor(object, property);
              if (desc === void 0) {
                var parent = Object.getPrototypeOf(object);
                if (parent === null) {
                  return void 0;
                } else {
                  return get(parent, property, receiver);
                }
              } else if ("value" in desc) {
                return desc.value;
              } else {
                var getter = desc.get;
                if (getter === void 0) {
                  return void 0;
                }
                return getter.call(receiver);
              }
            };
            var _parchment = __webpack_require__(0);
            var _parchment2 = _interopRequireDefault(_parchment);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            function _possibleConstructorReturn(self2, call) {
              if (!self2) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              }
              return call && (typeof call === "object" || typeof call === "function") ? call : self2;
            }
            function _inherits(subClass, superClass) {
              if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
              }
              subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
              if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            var ColorAttributor = function(_Parchment$Attributor) {
              _inherits(ColorAttributor2, _Parchment$Attributor);
              function ColorAttributor2() {
                _classCallCheck(this, ColorAttributor2);
                return _possibleConstructorReturn(this, (ColorAttributor2.__proto__ || Object.getPrototypeOf(ColorAttributor2)).apply(this, arguments));
              }
              _createClass(ColorAttributor2, [{
                key: "value",
                value: function value(domNode) {
                  var value2 = _get(ColorAttributor2.prototype.__proto__ || Object.getPrototypeOf(ColorAttributor2.prototype), "value", this).call(this, domNode);
                  if (!value2.startsWith("rgb(")) return value2;
                  value2 = value2.replace(/^[^\d]+/, "").replace(/[^\d]+$/, "");
                  return "#" + value2.split(",").map(function(component) {
                    return ("00" + parseInt(component).toString(16)).slice(-2);
                  }).join("");
                }
              }]);
              return ColorAttributor2;
            }(_parchment2.default.Attributor.Style);
            var ColorClass = new _parchment2.default.Attributor.Class("color", "ql-color", {
              scope: _parchment2.default.Scope.INLINE
            });
            var ColorStyle = new ColorAttributor("color", "color", {
              scope: _parchment2.default.Scope.INLINE
            });
            exports2.ColorAttributor = ColorAttributor;
            exports2.ColorClass = ColorClass;
            exports2.ColorStyle = ColorStyle;
          },
          /* 27 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            exports2.sanitize = exports2.default = void 0;
            var _createClass = /* @__PURE__ */ function() {
              function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
                }
              }
              return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
              };
            }();
            var _get = function get(object, property, receiver) {
              if (object === null) object = Function.prototype;
              var desc = Object.getOwnPropertyDescriptor(object, property);
              if (desc === void 0) {
                var parent = Object.getPrototypeOf(object);
                if (parent === null) {
                  return void 0;
                } else {
                  return get(parent, property, receiver);
                }
              } else if ("value" in desc) {
                return desc.value;
              } else {
                var getter = desc.get;
                if (getter === void 0) {
                  return void 0;
                }
                return getter.call(receiver);
              }
            };
            var _inline = __webpack_require__(6);
            var _inline2 = _interopRequireDefault(_inline);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            function _possibleConstructorReturn(self2, call) {
              if (!self2) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              }
              return call && (typeof call === "object" || typeof call === "function") ? call : self2;
            }
            function _inherits(subClass, superClass) {
              if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
              }
              subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
              if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            var Link = function(_Inline) {
              _inherits(Link2, _Inline);
              function Link2() {
                _classCallCheck(this, Link2);
                return _possibleConstructorReturn(this, (Link2.__proto__ || Object.getPrototypeOf(Link2)).apply(this, arguments));
              }
              _createClass(Link2, [{
                key: "format",
                value: function format(name, value) {
                  if (name !== this.statics.blotName || !value) return _get(Link2.prototype.__proto__ || Object.getPrototypeOf(Link2.prototype), "format", this).call(this, name, value);
                  value = this.constructor.sanitize(value);
                  this.domNode.setAttribute("href", value);
                }
              }], [{
                key: "create",
                value: function create(value) {
                  var node = _get(Link2.__proto__ || Object.getPrototypeOf(Link2), "create", this).call(this, value);
                  value = this.sanitize(value);
                  node.setAttribute("href", value);
                  node.setAttribute("rel", "noopener noreferrer");
                  node.setAttribute("target", "_blank");
                  return node;
                }
              }, {
                key: "formats",
                value: function formats(domNode) {
                  return domNode.getAttribute("href");
                }
              }, {
                key: "sanitize",
                value: function sanitize(url) {
                  return _sanitize(url, this.PROTOCOL_WHITELIST) ? url : this.SANITIZED_URL;
                }
              }]);
              return Link2;
            }(_inline2.default);
            Link.blotName = "link";
            Link.tagName = "A";
            Link.SANITIZED_URL = "about:blank";
            Link.PROTOCOL_WHITELIST = ["http", "https", "mailto", "tel"];
            function _sanitize(url, protocols) {
              var anchor = document.createElement("a");
              anchor.href = url;
              var protocol = anchor.href.slice(0, anchor.href.indexOf(":"));
              return protocols.indexOf(protocol) > -1;
            }
            exports2.default = Link;
            exports2.sanitize = _sanitize;
          },
          /* 28 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
              return typeof obj;
            } : function(obj) {
              return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
            var _createClass = /* @__PURE__ */ function() {
              function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
                }
              }
              return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
              };
            }();
            var _keyboard = __webpack_require__(23);
            var _keyboard2 = _interopRequireDefault(_keyboard);
            var _dropdown = __webpack_require__(107);
            var _dropdown2 = _interopRequireDefault(_dropdown);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            var optionsCounter = 0;
            function toggleAriaAttribute(element, attribute) {
              element.setAttribute(attribute, !(element.getAttribute(attribute) === "true"));
            }
            var Picker = function() {
              function Picker2(select) {
                var _this = this;
                _classCallCheck(this, Picker2);
                this.select = select;
                this.container = document.createElement("span");
                this.buildPicker();
                this.select.style.display = "none";
                this.select.parentNode.insertBefore(this.container, this.select);
                this.label.addEventListener("mousedown", function() {
                  _this.togglePicker();
                });
                this.label.addEventListener("keydown", function(event) {
                  switch (event.keyCode) {
                    // Allows the "Enter" key to open the picker
                    case _keyboard2.default.keys.ENTER:
                      _this.togglePicker();
                      break;
                    // Allows the "Escape" key to close the picker
                    case _keyboard2.default.keys.ESCAPE:
                      _this.escape();
                      event.preventDefault();
                      break;
                    default:
                  }
                });
                this.select.addEventListener("change", this.update.bind(this));
              }
              _createClass(Picker2, [{
                key: "togglePicker",
                value: function togglePicker() {
                  this.container.classList.toggle("ql-expanded");
                  toggleAriaAttribute(this.label, "aria-expanded");
                  toggleAriaAttribute(this.options, "aria-hidden");
                }
              }, {
                key: "buildItem",
                value: function buildItem(option) {
                  var _this2 = this;
                  var item = document.createElement("span");
                  item.tabIndex = "0";
                  item.setAttribute("role", "button");
                  item.classList.add("ql-picker-item");
                  if (option.hasAttribute("value")) {
                    item.setAttribute("data-value", option.getAttribute("value"));
                  }
                  if (option.textContent) {
                    item.setAttribute("data-label", option.textContent);
                  }
                  item.addEventListener("click", function() {
                    _this2.selectItem(item, true);
                  });
                  item.addEventListener("keydown", function(event) {
                    switch (event.keyCode) {
                      // Allows the "Enter" key to select an item
                      case _keyboard2.default.keys.ENTER:
                        _this2.selectItem(item, true);
                        event.preventDefault();
                        break;
                      // Allows the "Escape" key to close the picker
                      case _keyboard2.default.keys.ESCAPE:
                        _this2.escape();
                        event.preventDefault();
                        break;
                      default:
                    }
                  });
                  return item;
                }
              }, {
                key: "buildLabel",
                value: function buildLabel() {
                  var label = document.createElement("span");
                  label.classList.add("ql-picker-label");
                  label.innerHTML = _dropdown2.default;
                  label.tabIndex = "0";
                  label.setAttribute("role", "button");
                  label.setAttribute("aria-expanded", "false");
                  this.container.appendChild(label);
                  return label;
                }
              }, {
                key: "buildOptions",
                value: function buildOptions() {
                  var _this3 = this;
                  var options = document.createElement("span");
                  options.classList.add("ql-picker-options");
                  options.setAttribute("aria-hidden", "true");
                  options.tabIndex = "-1";
                  options.id = "ql-picker-options-" + optionsCounter;
                  optionsCounter += 1;
                  this.label.setAttribute("aria-controls", options.id);
                  this.options = options;
                  [].slice.call(this.select.options).forEach(function(option) {
                    var item = _this3.buildItem(option);
                    options.appendChild(item);
                    if (option.selected === true) {
                      _this3.selectItem(item);
                    }
                  });
                  this.container.appendChild(options);
                }
              }, {
                key: "buildPicker",
                value: function buildPicker() {
                  var _this4 = this;
                  [].slice.call(this.select.attributes).forEach(function(item) {
                    _this4.container.setAttribute(item.name, item.value);
                  });
                  this.container.classList.add("ql-picker");
                  this.label = this.buildLabel();
                  this.buildOptions();
                }
              }, {
                key: "escape",
                value: function escape() {
                  var _this5 = this;
                  this.close();
                  setTimeout(function() {
                    return _this5.label.focus();
                  }, 1);
                }
              }, {
                key: "close",
                value: function close() {
                  this.container.classList.remove("ql-expanded");
                  this.label.setAttribute("aria-expanded", "false");
                  this.options.setAttribute("aria-hidden", "true");
                }
              }, {
                key: "selectItem",
                value: function selectItem(item) {
                  var trigger = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
                  var selected = this.container.querySelector(".ql-selected");
                  if (item === selected) return;
                  if (selected != null) {
                    selected.classList.remove("ql-selected");
                  }
                  if (item == null) return;
                  item.classList.add("ql-selected");
                  this.select.selectedIndex = [].indexOf.call(item.parentNode.children, item);
                  if (item.hasAttribute("data-value")) {
                    this.label.setAttribute("data-value", item.getAttribute("data-value"));
                  } else {
                    this.label.removeAttribute("data-value");
                  }
                  if (item.hasAttribute("data-label")) {
                    this.label.setAttribute("data-label", item.getAttribute("data-label"));
                  } else {
                    this.label.removeAttribute("data-label");
                  }
                  if (trigger) {
                    if (typeof Event === "function") {
                      this.select.dispatchEvent(new Event("change"));
                    } else if ((typeof Event === "undefined" ? "undefined" : _typeof(Event)) === "object") {
                      var event = document.createEvent("Event");
                      event.initEvent("change", true, true);
                      this.select.dispatchEvent(event);
                    }
                    this.close();
                  }
                }
              }, {
                key: "update",
                value: function update() {
                  var option = void 0;
                  if (this.select.selectedIndex > -1) {
                    var item = this.container.querySelector(".ql-picker-options").children[this.select.selectedIndex];
                    option = this.select.options[this.select.selectedIndex];
                    this.selectItem(item);
                  } else {
                    this.selectItem(null);
                  }
                  var isActive = option != null && option !== this.select.querySelector("option[selected]");
                  this.label.classList.toggle("ql-active", isActive);
                }
              }]);
              return Picker2;
            }();
            exports2.default = Picker;
          },
          /* 29 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            var _parchment = __webpack_require__(0);
            var _parchment2 = _interopRequireDefault(_parchment);
            var _quill = __webpack_require__(5);
            var _quill2 = _interopRequireDefault(_quill);
            var _block = __webpack_require__(4);
            var _block2 = _interopRequireDefault(_block);
            var _break = __webpack_require__(16);
            var _break2 = _interopRequireDefault(_break);
            var _container = __webpack_require__(25);
            var _container2 = _interopRequireDefault(_container);
            var _cursor = __webpack_require__(24);
            var _cursor2 = _interopRequireDefault(_cursor);
            var _embed = __webpack_require__(35);
            var _embed2 = _interopRequireDefault(_embed);
            var _inline = __webpack_require__(6);
            var _inline2 = _interopRequireDefault(_inline);
            var _scroll = __webpack_require__(22);
            var _scroll2 = _interopRequireDefault(_scroll);
            var _text = __webpack_require__(7);
            var _text2 = _interopRequireDefault(_text);
            var _clipboard = __webpack_require__(55);
            var _clipboard2 = _interopRequireDefault(_clipboard);
            var _history = __webpack_require__(42);
            var _history2 = _interopRequireDefault(_history);
            var _keyboard = __webpack_require__(23);
            var _keyboard2 = _interopRequireDefault(_keyboard);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            _quill2.default.register({
              "blots/block": _block2.default,
              "blots/block/embed": _block.BlockEmbed,
              "blots/break": _break2.default,
              "blots/container": _container2.default,
              "blots/cursor": _cursor2.default,
              "blots/embed": _embed2.default,
              "blots/inline": _inline2.default,
              "blots/scroll": _scroll2.default,
              "blots/text": _text2.default,
              "modules/clipboard": _clipboard2.default,
              "modules/history": _history2.default,
              "modules/keyboard": _keyboard2.default
            });
            _parchment2.default.register(_block2.default, _break2.default, _cursor2.default, _inline2.default, _scroll2.default, _text2.default);
            exports2.default = _quill2.default;
          },
          /* 30 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", { value: true });
            var Registry = __webpack_require__(1);
            var ShadowBlot = (
              /** @class */
              function() {
                function ShadowBlot2(domNode) {
                  this.domNode = domNode;
                  this.domNode[Registry.DATA_KEY] = { blot: this };
                }
                Object.defineProperty(ShadowBlot2.prototype, "statics", {
                  // Hack for accessing inherited static methods
                  get: function() {
                    return this.constructor;
                  },
                  enumerable: true,
                  configurable: true
                });
                ShadowBlot2.create = function(value) {
                  if (this.tagName == null) {
                    throw new Registry.ParchmentError("Blot definition missing tagName");
                  }
                  var node;
                  if (Array.isArray(this.tagName)) {
                    if (typeof value === "string") {
                      value = value.toUpperCase();
                      if (parseInt(value).toString() === value) {
                        value = parseInt(value);
                      }
                    }
                    if (typeof value === "number") {
                      node = document.createElement(this.tagName[value - 1]);
                    } else if (this.tagName.indexOf(value) > -1) {
                      node = document.createElement(value);
                    } else {
                      node = document.createElement(this.tagName[0]);
                    }
                  } else {
                    node = document.createElement(this.tagName);
                  }
                  if (this.className) {
                    node.classList.add(this.className);
                  }
                  return node;
                };
                ShadowBlot2.prototype.attach = function() {
                  if (this.parent != null) {
                    this.scroll = this.parent.scroll;
                  }
                };
                ShadowBlot2.prototype.clone = function() {
                  var domNode = this.domNode.cloneNode(false);
                  return Registry.create(domNode);
                };
                ShadowBlot2.prototype.detach = function() {
                  if (this.parent != null)
                    this.parent.removeChild(this);
                  delete this.domNode[Registry.DATA_KEY];
                };
                ShadowBlot2.prototype.deleteAt = function(index, length) {
                  var blot = this.isolate(index, length);
                  blot.remove();
                };
                ShadowBlot2.prototype.formatAt = function(index, length, name, value) {
                  var blot = this.isolate(index, length);
                  if (Registry.query(name, Registry.Scope.BLOT) != null && value) {
                    blot.wrap(name, value);
                  } else if (Registry.query(name, Registry.Scope.ATTRIBUTE) != null) {
                    var parent = Registry.create(this.statics.scope);
                    blot.wrap(parent);
                    parent.format(name, value);
                  }
                };
                ShadowBlot2.prototype.insertAt = function(index, value, def) {
                  var blot = def == null ? Registry.create("text", value) : Registry.create(value, def);
                  var ref = this.split(index);
                  this.parent.insertBefore(blot, ref);
                };
                ShadowBlot2.prototype.insertInto = function(parentBlot, refBlot) {
                  if (refBlot === void 0) {
                    refBlot = null;
                  }
                  if (this.parent != null) {
                    this.parent.children.remove(this);
                  }
                  var refDomNode = null;
                  parentBlot.children.insertBefore(this, refBlot);
                  if (refBlot != null) {
                    refDomNode = refBlot.domNode;
                  }
                  if (this.domNode.parentNode != parentBlot.domNode || this.domNode.nextSibling != refDomNode) {
                    parentBlot.domNode.insertBefore(this.domNode, refDomNode);
                  }
                  this.parent = parentBlot;
                  this.attach();
                };
                ShadowBlot2.prototype.isolate = function(index, length) {
                  var target = this.split(index);
                  target.split(length);
                  return target;
                };
                ShadowBlot2.prototype.length = function() {
                  return 1;
                };
                ShadowBlot2.prototype.offset = function(root) {
                  if (root === void 0) {
                    root = this.parent;
                  }
                  if (this.parent == null || this == root)
                    return 0;
                  return this.parent.children.offset(this) + this.parent.offset(root);
                };
                ShadowBlot2.prototype.optimize = function(context) {
                  if (this.domNode[Registry.DATA_KEY] != null) {
                    delete this.domNode[Registry.DATA_KEY].mutations;
                  }
                };
                ShadowBlot2.prototype.remove = function() {
                  if (this.domNode.parentNode != null) {
                    this.domNode.parentNode.removeChild(this.domNode);
                  }
                  this.detach();
                };
                ShadowBlot2.prototype.replace = function(target) {
                  if (target.parent == null)
                    return;
                  target.parent.insertBefore(this, target.next);
                  target.remove();
                };
                ShadowBlot2.prototype.replaceWith = function(name, value) {
                  var replacement = typeof name === "string" ? Registry.create(name, value) : name;
                  replacement.replace(this);
                  return replacement;
                };
                ShadowBlot2.prototype.split = function(index, force) {
                  return index === 0 ? this : this.next;
                };
                ShadowBlot2.prototype.update = function(mutations, context) {
                };
                ShadowBlot2.prototype.wrap = function(name, value) {
                  var wrapper = typeof name === "string" ? Registry.create(name, value) : name;
                  if (this.parent != null) {
                    this.parent.insertBefore(wrapper, this.next);
                  }
                  wrapper.appendChild(this);
                  return wrapper;
                };
                ShadowBlot2.blotName = "abstract";
                return ShadowBlot2;
              }()
            );
            exports2.default = ShadowBlot;
          },
          /* 31 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", { value: true });
            var attributor_1 = __webpack_require__(12);
            var class_1 = __webpack_require__(32);
            var style_1 = __webpack_require__(33);
            var Registry = __webpack_require__(1);
            var AttributorStore = (
              /** @class */
              function() {
                function AttributorStore2(domNode) {
                  this.attributes = {};
                  this.domNode = domNode;
                  this.build();
                }
                AttributorStore2.prototype.attribute = function(attribute, value) {
                  if (value) {
                    if (attribute.add(this.domNode, value)) {
                      if (attribute.value(this.domNode) != null) {
                        this.attributes[attribute.attrName] = attribute;
                      } else {
                        delete this.attributes[attribute.attrName];
                      }
                    }
                  } else {
                    attribute.remove(this.domNode);
                    delete this.attributes[attribute.attrName];
                  }
                };
                AttributorStore2.prototype.build = function() {
                  var _this = this;
                  this.attributes = {};
                  var attributes = attributor_1.default.keys(this.domNode);
                  var classes = class_1.default.keys(this.domNode);
                  var styles = style_1.default.keys(this.domNode);
                  attributes.concat(classes).concat(styles).forEach(function(name) {
                    var attr = Registry.query(name, Registry.Scope.ATTRIBUTE);
                    if (attr instanceof attributor_1.default) {
                      _this.attributes[attr.attrName] = attr;
                    }
                  });
                };
                AttributorStore2.prototype.copy = function(target) {
                  var _this = this;
                  Object.keys(this.attributes).forEach(function(key) {
                    var value = _this.attributes[key].value(_this.domNode);
                    target.format(key, value);
                  });
                };
                AttributorStore2.prototype.move = function(target) {
                  var _this = this;
                  this.copy(target);
                  Object.keys(this.attributes).forEach(function(key) {
                    _this.attributes[key].remove(_this.domNode);
                  });
                  this.attributes = {};
                };
                AttributorStore2.prototype.values = function() {
                  var _this = this;
                  return Object.keys(this.attributes).reduce(function(attributes, name) {
                    attributes[name] = _this.attributes[name].value(_this.domNode);
                    return attributes;
                  }, {});
                };
                return AttributorStore2;
              }()
            );
            exports2.default = AttributorStore;
          },
          /* 32 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            var __extends = this && this.__extends || function() {
              var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
                d.__proto__ = b;
              } || function(d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
              };
              return function(d, b) {
                extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
              };
            }();
            Object.defineProperty(exports2, "__esModule", { value: true });
            var attributor_1 = __webpack_require__(12);
            function match(node, prefix) {
              var className = node.getAttribute("class") || "";
              return className.split(/\s+/).filter(function(name) {
                return name.indexOf(prefix + "-") === 0;
              });
            }
            var ClassAttributor = (
              /** @class */
              function(_super) {
                __extends(ClassAttributor2, _super);
                function ClassAttributor2() {
                  return _super !== null && _super.apply(this, arguments) || this;
                }
                ClassAttributor2.keys = function(node) {
                  return (node.getAttribute("class") || "").split(/\s+/).map(function(name) {
                    return name.split("-").slice(0, -1).join("-");
                  });
                };
                ClassAttributor2.prototype.add = function(node, value) {
                  if (!this.canAdd(node, value))
                    return false;
                  this.remove(node);
                  node.classList.add(this.keyName + "-" + value);
                  return true;
                };
                ClassAttributor2.prototype.remove = function(node) {
                  var matches = match(node, this.keyName);
                  matches.forEach(function(name) {
                    node.classList.remove(name);
                  });
                  if (node.classList.length === 0) {
                    node.removeAttribute("class");
                  }
                };
                ClassAttributor2.prototype.value = function(node) {
                  var result = match(node, this.keyName)[0] || "";
                  var value = result.slice(this.keyName.length + 1);
                  return this.canAdd(node, value) ? value : "";
                };
                return ClassAttributor2;
              }(attributor_1.default)
            );
            exports2.default = ClassAttributor;
          },
          /* 33 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            var __extends = this && this.__extends || function() {
              var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
                d.__proto__ = b;
              } || function(d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
              };
              return function(d, b) {
                extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
              };
            }();
            Object.defineProperty(exports2, "__esModule", { value: true });
            var attributor_1 = __webpack_require__(12);
            function camelize2(name) {
              var parts = name.split("-");
              var rest = parts.slice(1).map(function(part) {
                return part[0].toUpperCase() + part.slice(1);
              }).join("");
              return parts[0] + rest;
            }
            var StyleAttributor = (
              /** @class */
              function(_super) {
                __extends(StyleAttributor2, _super);
                function StyleAttributor2() {
                  return _super !== null && _super.apply(this, arguments) || this;
                }
                StyleAttributor2.keys = function(node) {
                  return (node.getAttribute("style") || "").split(";").map(function(value) {
                    var arr = value.split(":");
                    return arr[0].trim();
                  });
                };
                StyleAttributor2.prototype.add = function(node, value) {
                  if (!this.canAdd(node, value))
                    return false;
                  node.style[camelize2(this.keyName)] = value;
                  return true;
                };
                StyleAttributor2.prototype.remove = function(node) {
                  node.style[camelize2(this.keyName)] = "";
                  if (!node.getAttribute("style")) {
                    node.removeAttribute("style");
                  }
                };
                StyleAttributor2.prototype.value = function(node) {
                  var value = node.style[camelize2(this.keyName)];
                  return this.canAdd(node, value) ? value : "";
                };
                return StyleAttributor2;
              }(attributor_1.default)
            );
            exports2.default = StyleAttributor;
          },
          /* 34 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            var _createClass = /* @__PURE__ */ function() {
              function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
                }
              }
              return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
              };
            }();
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            var Theme = function() {
              function Theme2(quill, options) {
                _classCallCheck(this, Theme2);
                this.quill = quill;
                this.options = options;
                this.modules = {};
              }
              _createClass(Theme2, [{
                key: "init",
                value: function init() {
                  var _this = this;
                  Object.keys(this.options.modules).forEach(function(name) {
                    if (_this.modules[name] == null) {
                      _this.addModule(name);
                    }
                  });
                }
              }, {
                key: "addModule",
                value: function addModule(name) {
                  var moduleClass = this.quill.constructor.import("modules/" + name);
                  this.modules[name] = new moduleClass(this.quill, this.options.modules[name] || {});
                  return this.modules[name];
                }
              }]);
              return Theme2;
            }();
            Theme.DEFAULTS = {
              modules: {}
            };
            Theme.themes = {
              "default": Theme
            };
            exports2.default = Theme;
          },
          /* 35 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            var _createClass = /* @__PURE__ */ function() {
              function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
                }
              }
              return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
              };
            }();
            var _get = function get(object, property, receiver) {
              if (object === null) object = Function.prototype;
              var desc = Object.getOwnPropertyDescriptor(object, property);
              if (desc === void 0) {
                var parent = Object.getPrototypeOf(object);
                if (parent === null) {
                  return void 0;
                } else {
                  return get(parent, property, receiver);
                }
              } else if ("value" in desc) {
                return desc.value;
              } else {
                var getter = desc.get;
                if (getter === void 0) {
                  return void 0;
                }
                return getter.call(receiver);
              }
            };
            var _parchment = __webpack_require__(0);
            var _parchment2 = _interopRequireDefault(_parchment);
            var _text = __webpack_require__(7);
            var _text2 = _interopRequireDefault(_text);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            function _possibleConstructorReturn(self2, call) {
              if (!self2) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              }
              return call && (typeof call === "object" || typeof call === "function") ? call : self2;
            }
            function _inherits(subClass, superClass) {
              if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
              }
              subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
              if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            var GUARD_TEXT = "\uFEFF";
            var Embed = function(_Parchment$Embed) {
              _inherits(Embed2, _Parchment$Embed);
              function Embed2(node) {
                _classCallCheck(this, Embed2);
                var _this = _possibleConstructorReturn(this, (Embed2.__proto__ || Object.getPrototypeOf(Embed2)).call(this, node));
                _this.contentNode = document.createElement("span");
                _this.contentNode.setAttribute("contenteditable", false);
                [].slice.call(_this.domNode.childNodes).forEach(function(childNode) {
                  _this.contentNode.appendChild(childNode);
                });
                _this.leftGuard = document.createTextNode(GUARD_TEXT);
                _this.rightGuard = document.createTextNode(GUARD_TEXT);
                _this.domNode.appendChild(_this.leftGuard);
                _this.domNode.appendChild(_this.contentNode);
                _this.domNode.appendChild(_this.rightGuard);
                return _this;
              }
              _createClass(Embed2, [{
                key: "index",
                value: function index(node, offset) {
                  if (node === this.leftGuard) return 0;
                  if (node === this.rightGuard) return 1;
                  return _get(Embed2.prototype.__proto__ || Object.getPrototypeOf(Embed2.prototype), "index", this).call(this, node, offset);
                }
              }, {
                key: "restore",
                value: function restore(node) {
                  var range = void 0, textNode = void 0;
                  var text = node.data.split(GUARD_TEXT).join("");
                  if (node === this.leftGuard) {
                    if (this.prev instanceof _text2.default) {
                      var prevLength = this.prev.length();
                      this.prev.insertAt(prevLength, text);
                      range = {
                        startNode: this.prev.domNode,
                        startOffset: prevLength + text.length
                      };
                    } else {
                      textNode = document.createTextNode(text);
                      this.parent.insertBefore(_parchment2.default.create(textNode), this);
                      range = {
                        startNode: textNode,
                        startOffset: text.length
                      };
                    }
                  } else if (node === this.rightGuard) {
                    if (this.next instanceof _text2.default) {
                      this.next.insertAt(0, text);
                      range = {
                        startNode: this.next.domNode,
                        startOffset: text.length
                      };
                    } else {
                      textNode = document.createTextNode(text);
                      this.parent.insertBefore(_parchment2.default.create(textNode), this.next);
                      range = {
                        startNode: textNode,
                        startOffset: text.length
                      };
                    }
                  }
                  node.data = GUARD_TEXT;
                  return range;
                }
              }, {
                key: "update",
                value: function update(mutations, context) {
                  var _this2 = this;
                  mutations.forEach(function(mutation) {
                    if (mutation.type === "characterData" && (mutation.target === _this2.leftGuard || mutation.target === _this2.rightGuard)) {
                      var range = _this2.restore(mutation.target);
                      if (range) context.range = range;
                    }
                  });
                }
              }]);
              return Embed2;
            }(_parchment2.default.Embed);
            exports2.default = Embed;
          },
          /* 36 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            exports2.AlignStyle = exports2.AlignClass = exports2.AlignAttribute = void 0;
            var _parchment = __webpack_require__(0);
            var _parchment2 = _interopRequireDefault(_parchment);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            var config = {
              scope: _parchment2.default.Scope.BLOCK,
              whitelist: ["right", "center", "justify"]
            };
            var AlignAttribute = new _parchment2.default.Attributor.Attribute("align", "align", config);
            var AlignClass = new _parchment2.default.Attributor.Class("align", "ql-align", config);
            var AlignStyle = new _parchment2.default.Attributor.Style("align", "text-align", config);
            exports2.AlignAttribute = AlignAttribute;
            exports2.AlignClass = AlignClass;
            exports2.AlignStyle = AlignStyle;
          },
          /* 37 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            exports2.BackgroundStyle = exports2.BackgroundClass = void 0;
            var _parchment = __webpack_require__(0);
            var _parchment2 = _interopRequireDefault(_parchment);
            var _color = __webpack_require__(26);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            var BackgroundClass = new _parchment2.default.Attributor.Class("background", "ql-bg", {
              scope: _parchment2.default.Scope.INLINE
            });
            var BackgroundStyle = new _color.ColorAttributor("background", "background-color", {
              scope: _parchment2.default.Scope.INLINE
            });
            exports2.BackgroundClass = BackgroundClass;
            exports2.BackgroundStyle = BackgroundStyle;
          },
          /* 38 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            exports2.DirectionStyle = exports2.DirectionClass = exports2.DirectionAttribute = void 0;
            var _parchment = __webpack_require__(0);
            var _parchment2 = _interopRequireDefault(_parchment);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            var config = {
              scope: _parchment2.default.Scope.BLOCK,
              whitelist: ["rtl"]
            };
            var DirectionAttribute = new _parchment2.default.Attributor.Attribute("direction", "dir", config);
            var DirectionClass = new _parchment2.default.Attributor.Class("direction", "ql-direction", config);
            var DirectionStyle = new _parchment2.default.Attributor.Style("direction", "direction", config);
            exports2.DirectionAttribute = DirectionAttribute;
            exports2.DirectionClass = DirectionClass;
            exports2.DirectionStyle = DirectionStyle;
          },
          /* 39 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            exports2.FontClass = exports2.FontStyle = void 0;
            var _createClass = /* @__PURE__ */ function() {
              function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
                }
              }
              return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
              };
            }();
            var _get = function get(object, property, receiver) {
              if (object === null) object = Function.prototype;
              var desc = Object.getOwnPropertyDescriptor(object, property);
              if (desc === void 0) {
                var parent = Object.getPrototypeOf(object);
                if (parent === null) {
                  return void 0;
                } else {
                  return get(parent, property, receiver);
                }
              } else if ("value" in desc) {
                return desc.value;
              } else {
                var getter = desc.get;
                if (getter === void 0) {
                  return void 0;
                }
                return getter.call(receiver);
              }
            };
            var _parchment = __webpack_require__(0);
            var _parchment2 = _interopRequireDefault(_parchment);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            function _possibleConstructorReturn(self2, call) {
              if (!self2) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              }
              return call && (typeof call === "object" || typeof call === "function") ? call : self2;
            }
            function _inherits(subClass, superClass) {
              if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
              }
              subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
              if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            var config = {
              scope: _parchment2.default.Scope.INLINE,
              whitelist: ["serif", "monospace"]
            };
            var FontClass = new _parchment2.default.Attributor.Class("font", "ql-font", config);
            var FontStyleAttributor = function(_Parchment$Attributor) {
              _inherits(FontStyleAttributor2, _Parchment$Attributor);
              function FontStyleAttributor2() {
                _classCallCheck(this, FontStyleAttributor2);
                return _possibleConstructorReturn(this, (FontStyleAttributor2.__proto__ || Object.getPrototypeOf(FontStyleAttributor2)).apply(this, arguments));
              }
              _createClass(FontStyleAttributor2, [{
                key: "value",
                value: function value(node) {
                  return _get(FontStyleAttributor2.prototype.__proto__ || Object.getPrototypeOf(FontStyleAttributor2.prototype), "value", this).call(this, node).replace(/["']/g, "");
                }
              }]);
              return FontStyleAttributor2;
            }(_parchment2.default.Attributor.Style);
            var FontStyle = new FontStyleAttributor("font", "font-family", config);
            exports2.FontStyle = FontStyle;
            exports2.FontClass = FontClass;
          },
          /* 40 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            exports2.SizeStyle = exports2.SizeClass = void 0;
            var _parchment = __webpack_require__(0);
            var _parchment2 = _interopRequireDefault(_parchment);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            var SizeClass = new _parchment2.default.Attributor.Class("size", "ql-size", {
              scope: _parchment2.default.Scope.INLINE,
              whitelist: ["small", "large", "huge"]
            });
            var SizeStyle = new _parchment2.default.Attributor.Style("size", "font-size", {
              scope: _parchment2.default.Scope.INLINE,
              whitelist: ["10px", "18px", "32px"]
            });
            exports2.SizeClass = SizeClass;
            exports2.SizeStyle = SizeStyle;
          },
          /* 41 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            module2.exports = {
              "align": {
                "": __webpack_require__(76),
                "center": __webpack_require__(77),
                "right": __webpack_require__(78),
                "justify": __webpack_require__(79)
              },
              "background": __webpack_require__(80),
              "blockquote": __webpack_require__(81),
              "bold": __webpack_require__(82),
              "clean": __webpack_require__(83),
              "code": __webpack_require__(58),
              "code-block": __webpack_require__(58),
              "color": __webpack_require__(84),
              "direction": {
                "": __webpack_require__(85),
                "rtl": __webpack_require__(86)
              },
              "float": {
                "center": __webpack_require__(87),
                "full": __webpack_require__(88),
                "left": __webpack_require__(89),
                "right": __webpack_require__(90)
              },
              "formula": __webpack_require__(91),
              "header": {
                "1": __webpack_require__(92),
                "2": __webpack_require__(93)
              },
              "italic": __webpack_require__(94),
              "image": __webpack_require__(95),
              "indent": {
                "+1": __webpack_require__(96),
                "-1": __webpack_require__(97)
              },
              "link": __webpack_require__(98),
              "list": {
                "ordered": __webpack_require__(99),
                "bullet": __webpack_require__(100),
                "check": __webpack_require__(101)
              },
              "script": {
                "sub": __webpack_require__(102),
                "super": __webpack_require__(103)
              },
              "strike": __webpack_require__(104),
              "underline": __webpack_require__(105),
              "video": __webpack_require__(106)
            };
          },
          /* 42 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            exports2.getLastChangeIndex = exports2.default = void 0;
            var _createClass = /* @__PURE__ */ function() {
              function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
                }
              }
              return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
              };
            }();
            var _parchment = __webpack_require__(0);
            var _parchment2 = _interopRequireDefault(_parchment);
            var _quill = __webpack_require__(5);
            var _quill2 = _interopRequireDefault(_quill);
            var _module = __webpack_require__(9);
            var _module2 = _interopRequireDefault(_module);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            function _possibleConstructorReturn(self2, call) {
              if (!self2) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              }
              return call && (typeof call === "object" || typeof call === "function") ? call : self2;
            }
            function _inherits(subClass, superClass) {
              if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
              }
              subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
              if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            var History = function(_Module) {
              _inherits(History2, _Module);
              function History2(quill, options) {
                _classCallCheck(this, History2);
                var _this = _possibleConstructorReturn(this, (History2.__proto__ || Object.getPrototypeOf(History2)).call(this, quill, options));
                _this.lastRecorded = 0;
                _this.ignoreChange = false;
                _this.clear();
                _this.quill.on(_quill2.default.events.EDITOR_CHANGE, function(eventName, delta, oldDelta, source) {
                  if (eventName !== _quill2.default.events.TEXT_CHANGE || _this.ignoreChange) return;
                  if (!_this.options.userOnly || source === _quill2.default.sources.USER) {
                    _this.record(delta, oldDelta);
                  } else {
                    _this.transform(delta);
                  }
                });
                _this.quill.keyboard.addBinding({ key: "Z", shortKey: true }, _this.undo.bind(_this));
                _this.quill.keyboard.addBinding({ key: "Z", shortKey: true, shiftKey: true }, _this.redo.bind(_this));
                if (/Win/i.test(navigator.platform)) {
                  _this.quill.keyboard.addBinding({ key: "Y", shortKey: true }, _this.redo.bind(_this));
                }
                return _this;
              }
              _createClass(History2, [{
                key: "change",
                value: function change(source, dest) {
                  if (this.stack[source].length === 0) return;
                  var delta = this.stack[source].pop();
                  this.stack[dest].push(delta);
                  this.lastRecorded = 0;
                  this.ignoreChange = true;
                  this.quill.updateContents(delta[source], _quill2.default.sources.USER);
                  this.ignoreChange = false;
                  var index = getLastChangeIndex(delta[source]);
                  this.quill.setSelection(index);
                }
              }, {
                key: "clear",
                value: function clear() {
                  this.stack = { undo: [], redo: [] };
                }
              }, {
                key: "cutoff",
                value: function cutoff() {
                  this.lastRecorded = 0;
                }
              }, {
                key: "record",
                value: function record(changeDelta, oldDelta) {
                  if (changeDelta.ops.length === 0) return;
                  this.stack.redo = [];
                  var undoDelta = this.quill.getContents().diff(oldDelta);
                  var timestamp = Date.now();
                  if (this.lastRecorded + this.options.delay > timestamp && this.stack.undo.length > 0) {
                    var delta = this.stack.undo.pop();
                    undoDelta = undoDelta.compose(delta.undo);
                    changeDelta = delta.redo.compose(changeDelta);
                  } else {
                    this.lastRecorded = timestamp;
                  }
                  this.stack.undo.push({
                    redo: changeDelta,
                    undo: undoDelta
                  });
                  if (this.stack.undo.length > this.options.maxStack) {
                    this.stack.undo.shift();
                  }
                }
              }, {
                key: "redo",
                value: function redo() {
                  this.change("redo", "undo");
                }
              }, {
                key: "transform",
                value: function transform2(delta) {
                  this.stack.undo.forEach(function(change) {
                    change.undo = delta.transform(change.undo, true);
                    change.redo = delta.transform(change.redo, true);
                  });
                  this.stack.redo.forEach(function(change) {
                    change.undo = delta.transform(change.undo, true);
                    change.redo = delta.transform(change.redo, true);
                  });
                }
              }, {
                key: "undo",
                value: function undo() {
                  this.change("undo", "redo");
                }
              }]);
              return History2;
            }(_module2.default);
            History.DEFAULTS = {
              delay: 1e3,
              maxStack: 100,
              userOnly: false
            };
            function endsWithNewlineChange(delta) {
              var lastOp = delta.ops[delta.ops.length - 1];
              if (lastOp == null) return false;
              if (lastOp.insert != null) {
                return typeof lastOp.insert === "string" && lastOp.insert.endsWith("\n");
              }
              if (lastOp.attributes != null) {
                return Object.keys(lastOp.attributes).some(function(attr) {
                  return _parchment2.default.query(attr, _parchment2.default.Scope.BLOCK) != null;
                });
              }
              return false;
            }
            function getLastChangeIndex(delta) {
              var deleteLength = delta.reduce(function(length, op) {
                length += op.delete || 0;
                return length;
              }, 0);
              var changeIndex = delta.length() - deleteLength;
              if (endsWithNewlineChange(delta)) {
                changeIndex -= 1;
              }
              return changeIndex;
            }
            exports2.default = History;
            exports2.getLastChangeIndex = getLastChangeIndex;
          },
          /* 43 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            exports2.default = exports2.BaseTooltip = void 0;
            var _createClass = /* @__PURE__ */ function() {
              function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
                }
              }
              return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
              };
            }();
            var _get = function get(object, property, receiver) {
              if (object === null) object = Function.prototype;
              var desc = Object.getOwnPropertyDescriptor(object, property);
              if (desc === void 0) {
                var parent = Object.getPrototypeOf(object);
                if (parent === null) {
                  return void 0;
                } else {
                  return get(parent, property, receiver);
                }
              } else if ("value" in desc) {
                return desc.value;
              } else {
                var getter = desc.get;
                if (getter === void 0) {
                  return void 0;
                }
                return getter.call(receiver);
              }
            };
            var _extend = __webpack_require__(3);
            var _extend2 = _interopRequireDefault(_extend);
            var _quillDelta = __webpack_require__(2);
            var _quillDelta2 = _interopRequireDefault(_quillDelta);
            var _emitter = __webpack_require__(8);
            var _emitter2 = _interopRequireDefault(_emitter);
            var _keyboard = __webpack_require__(23);
            var _keyboard2 = _interopRequireDefault(_keyboard);
            var _theme = __webpack_require__(34);
            var _theme2 = _interopRequireDefault(_theme);
            var _colorPicker = __webpack_require__(59);
            var _colorPicker2 = _interopRequireDefault(_colorPicker);
            var _iconPicker = __webpack_require__(60);
            var _iconPicker2 = _interopRequireDefault(_iconPicker);
            var _picker = __webpack_require__(28);
            var _picker2 = _interopRequireDefault(_picker);
            var _tooltip = __webpack_require__(61);
            var _tooltip2 = _interopRequireDefault(_tooltip);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            function _possibleConstructorReturn(self2, call) {
              if (!self2) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              }
              return call && (typeof call === "object" || typeof call === "function") ? call : self2;
            }
            function _inherits(subClass, superClass) {
              if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
              }
              subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
              if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            var ALIGNS = [false, "center", "right", "justify"];
            var COLORS = ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466"];
            var FONTS = [false, "serif", "monospace"];
            var HEADERS = ["1", "2", "3", false];
            var SIZES = ["small", false, "large", "huge"];
            var BaseTheme = function(_Theme) {
              _inherits(BaseTheme2, _Theme);
              function BaseTheme2(quill, options) {
                _classCallCheck(this, BaseTheme2);
                var _this = _possibleConstructorReturn(this, (BaseTheme2.__proto__ || Object.getPrototypeOf(BaseTheme2)).call(this, quill, options));
                var listener = function listener2(e) {
                  if (!document.body.contains(quill.root)) {
                    return document.body.removeEventListener("click", listener2);
                  }
                  if (_this.tooltip != null && !_this.tooltip.root.contains(e.target) && document.activeElement !== _this.tooltip.textbox && !_this.quill.hasFocus()) {
                    _this.tooltip.hide();
                  }
                  if (_this.pickers != null) {
                    _this.pickers.forEach(function(picker) {
                      if (!picker.container.contains(e.target)) {
                        picker.close();
                      }
                    });
                  }
                };
                quill.emitter.listenDOM("click", document.body, listener);
                return _this;
              }
              _createClass(BaseTheme2, [{
                key: "addModule",
                value: function addModule(name) {
                  var module3 = _get(BaseTheme2.prototype.__proto__ || Object.getPrototypeOf(BaseTheme2.prototype), "addModule", this).call(this, name);
                  if (name === "toolbar") {
                    this.extendToolbar(module3);
                  }
                  return module3;
                }
              }, {
                key: "buildButtons",
                value: function buildButtons(buttons, icons) {
                  buttons.forEach(function(button) {
                    var className = button.getAttribute("class") || "";
                    className.split(/\s+/).forEach(function(name) {
                      if (!name.startsWith("ql-")) return;
                      name = name.slice("ql-".length);
                      if (icons[name] == null) return;
                      if (name === "direction") {
                        button.innerHTML = icons[name][""] + icons[name]["rtl"];
                      } else if (typeof icons[name] === "string") {
                        button.innerHTML = icons[name];
                      } else {
                        var value = button.value || "";
                        if (value != null && icons[name][value]) {
                          button.innerHTML = icons[name][value];
                        }
                      }
                    });
                  });
                }
              }, {
                key: "buildPickers",
                value: function buildPickers(selects, icons) {
                  var _this2 = this;
                  this.pickers = selects.map(function(select) {
                    if (select.classList.contains("ql-align")) {
                      if (select.querySelector("option") == null) {
                        fillSelect(select, ALIGNS);
                      }
                      return new _iconPicker2.default(select, icons.align);
                    } else if (select.classList.contains("ql-background") || select.classList.contains("ql-color")) {
                      var format = select.classList.contains("ql-background") ? "background" : "color";
                      if (select.querySelector("option") == null) {
                        fillSelect(select, COLORS, format === "background" ? "#ffffff" : "#000000");
                      }
                      return new _colorPicker2.default(select, icons[format]);
                    } else {
                      if (select.querySelector("option") == null) {
                        if (select.classList.contains("ql-font")) {
                          fillSelect(select, FONTS);
                        } else if (select.classList.contains("ql-header")) {
                          fillSelect(select, HEADERS);
                        } else if (select.classList.contains("ql-size")) {
                          fillSelect(select, SIZES);
                        }
                      }
                      return new _picker2.default(select);
                    }
                  });
                  var update = function update2() {
                    _this2.pickers.forEach(function(picker) {
                      picker.update();
                    });
                  };
                  this.quill.on(_emitter2.default.events.EDITOR_CHANGE, update);
                }
              }]);
              return BaseTheme2;
            }(_theme2.default);
            BaseTheme.DEFAULTS = (0, _extend2.default)(true, {}, _theme2.default.DEFAULTS, {
              modules: {
                toolbar: {
                  handlers: {
                    formula: function formula() {
                      this.quill.theme.tooltip.edit("formula");
                    },
                    image: function image() {
                      var _this3 = this;
                      var fileInput = this.container.querySelector("input.ql-image[type=file]");
                      if (fileInput == null) {
                        fileInput = document.createElement("input");
                        fileInput.setAttribute("type", "file");
                        fileInput.setAttribute("accept", "image/png, image/gif, image/jpeg, image/bmp, image/x-icon");
                        fileInput.classList.add("ql-image");
                        fileInput.addEventListener("change", function() {
                          if (fileInput.files != null && fileInput.files[0] != null) {
                            var reader = new FileReader();
                            reader.onload = function(e) {
                              var range = _this3.quill.getSelection(true);
                              _this3.quill.updateContents(new _quillDelta2.default().retain(range.index).delete(range.length).insert({ image: e.target.result }), _emitter2.default.sources.USER);
                              _this3.quill.setSelection(range.index + 1, _emitter2.default.sources.SILENT);
                              fileInput.value = "";
                            };
                            reader.readAsDataURL(fileInput.files[0]);
                          }
                        });
                        this.container.appendChild(fileInput);
                      }
                      fileInput.click();
                    },
                    video: function video() {
                      this.quill.theme.tooltip.edit("video");
                    }
                  }
                }
              }
            });
            var BaseTooltip = function(_Tooltip) {
              _inherits(BaseTooltip2, _Tooltip);
              function BaseTooltip2(quill, boundsContainer) {
                _classCallCheck(this, BaseTooltip2);
                var _this4 = _possibleConstructorReturn(this, (BaseTooltip2.__proto__ || Object.getPrototypeOf(BaseTooltip2)).call(this, quill, boundsContainer));
                _this4.textbox = _this4.root.querySelector('input[type="text"]');
                _this4.listen();
                return _this4;
              }
              _createClass(BaseTooltip2, [{
                key: "listen",
                value: function listen() {
                  var _this5 = this;
                  this.textbox.addEventListener("keydown", function(event) {
                    if (_keyboard2.default.match(event, "enter")) {
                      _this5.save();
                      event.preventDefault();
                    } else if (_keyboard2.default.match(event, "escape")) {
                      _this5.cancel();
                      event.preventDefault();
                    }
                  });
                }
              }, {
                key: "cancel",
                value: function cancel() {
                  this.hide();
                }
              }, {
                key: "edit",
                value: function edit() {
                  var mode = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "link";
                  var preview = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
                  this.root.classList.remove("ql-hidden");
                  this.root.classList.add("ql-editing");
                  if (preview != null) {
                    this.textbox.value = preview;
                  } else if (mode !== this.root.getAttribute("data-mode")) {
                    this.textbox.value = "";
                  }
                  this.position(this.quill.getBounds(this.quill.selection.savedRange));
                  this.textbox.select();
                  this.textbox.setAttribute("placeholder", this.textbox.getAttribute("data-" + mode) || "");
                  this.root.setAttribute("data-mode", mode);
                }
              }, {
                key: "restoreFocus",
                value: function restoreFocus() {
                  var scrollTop = this.quill.scrollingContainer.scrollTop;
                  this.quill.focus();
                  this.quill.scrollingContainer.scrollTop = scrollTop;
                }
              }, {
                key: "save",
                value: function save() {
                  var value = this.textbox.value;
                  switch (this.root.getAttribute("data-mode")) {
                    case "link": {
                      var scrollTop = this.quill.root.scrollTop;
                      if (this.linkRange) {
                        this.quill.formatText(this.linkRange, "link", value, _emitter2.default.sources.USER);
                        delete this.linkRange;
                      } else {
                        this.restoreFocus();
                        this.quill.format("link", value, _emitter2.default.sources.USER);
                      }
                      this.quill.root.scrollTop = scrollTop;
                      break;
                    }
                    case "video": {
                      value = extractVideoUrl(value);
                    }
                    // eslint-disable-next-line no-fallthrough
                    case "formula": {
                      if (!value) break;
                      var range = this.quill.getSelection(true);
                      if (range != null) {
                        var index = range.index + range.length;
                        this.quill.insertEmbed(index, this.root.getAttribute("data-mode"), value, _emitter2.default.sources.USER);
                        if (this.root.getAttribute("data-mode") === "formula") {
                          this.quill.insertText(index + 1, " ", _emitter2.default.sources.USER);
                        }
                        this.quill.setSelection(index + 2, _emitter2.default.sources.USER);
                      }
                      break;
                    }
                    default:
                  }
                  this.textbox.value = "";
                  this.hide();
                }
              }]);
              return BaseTooltip2;
            }(_tooltip2.default);
            function extractVideoUrl(url) {
              var match = url.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtube\.com\/watch.*v=([a-zA-Z0-9_-]+)/) || url.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtu\.be\/([a-zA-Z0-9_-]+)/);
              if (match) {
                return (match[1] || "https") + "://www.youtube.com/embed/" + match[2] + "?showinfo=0";
              }
              if (match = url.match(/^(?:(https?):\/\/)?(?:www\.)?vimeo\.com\/(\d+)/)) {
                return (match[1] || "https") + "://player.vimeo.com/video/" + match[2] + "/";
              }
              return url;
            }
            function fillSelect(select, values) {
              var defaultValue = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
              values.forEach(function(value) {
                var option = document.createElement("option");
                if (value === defaultValue) {
                  option.setAttribute("selected", "selected");
                } else {
                  option.setAttribute("value", value);
                }
                select.appendChild(option);
              });
            }
            exports2.BaseTooltip = BaseTooltip;
            exports2.default = BaseTheme;
          },
          /* 44 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", { value: true });
            var LinkedList = (
              /** @class */
              function() {
                function LinkedList2() {
                  this.head = this.tail = null;
                  this.length = 0;
                }
                LinkedList2.prototype.append = function() {
                  var nodes = [];
                  for (var _i = 0; _i < arguments.length; _i++) {
                    nodes[_i] = arguments[_i];
                  }
                  this.insertBefore(nodes[0], null);
                  if (nodes.length > 1) {
                    this.append.apply(this, nodes.slice(1));
                  }
                };
                LinkedList2.prototype.contains = function(node) {
                  var cur, next = this.iterator();
                  while (cur = next()) {
                    if (cur === node)
                      return true;
                  }
                  return false;
                };
                LinkedList2.prototype.insertBefore = function(node, refNode) {
                  if (!node)
                    return;
                  node.next = refNode;
                  if (refNode != null) {
                    node.prev = refNode.prev;
                    if (refNode.prev != null) {
                      refNode.prev.next = node;
                    }
                    refNode.prev = node;
                    if (refNode === this.head) {
                      this.head = node;
                    }
                  } else if (this.tail != null) {
                    this.tail.next = node;
                    node.prev = this.tail;
                    this.tail = node;
                  } else {
                    node.prev = null;
                    this.head = this.tail = node;
                  }
                  this.length += 1;
                };
                LinkedList2.prototype.offset = function(target) {
                  var index = 0, cur = this.head;
                  while (cur != null) {
                    if (cur === target)
                      return index;
                    index += cur.length();
                    cur = cur.next;
                  }
                  return -1;
                };
                LinkedList2.prototype.remove = function(node) {
                  if (!this.contains(node))
                    return;
                  if (node.prev != null)
                    node.prev.next = node.next;
                  if (node.next != null)
                    node.next.prev = node.prev;
                  if (node === this.head)
                    this.head = node.next;
                  if (node === this.tail)
                    this.tail = node.prev;
                  this.length -= 1;
                };
                LinkedList2.prototype.iterator = function(curNode) {
                  if (curNode === void 0) {
                    curNode = this.head;
                  }
                  return function() {
                    var ret = curNode;
                    if (curNode != null)
                      curNode = curNode.next;
                    return ret;
                  };
                };
                LinkedList2.prototype.find = function(index, inclusive) {
                  if (inclusive === void 0) {
                    inclusive = false;
                  }
                  var cur, next = this.iterator();
                  while (cur = next()) {
                    var length = cur.length();
                    if (index < length || inclusive && index === length && (cur.next == null || cur.next.length() !== 0)) {
                      return [cur, index];
                    }
                    index -= length;
                  }
                  return [null, 0];
                };
                LinkedList2.prototype.forEach = function(callback) {
                  var cur, next = this.iterator();
                  while (cur = next()) {
                    callback(cur);
                  }
                };
                LinkedList2.prototype.forEachAt = function(index, length, callback) {
                  if (length <= 0)
                    return;
                  var _a = this.find(index), startNode = _a[0], offset = _a[1];
                  var cur, curIndex = index - offset, next = this.iterator(startNode);
                  while ((cur = next()) && curIndex < index + length) {
                    var curLength = cur.length();
                    if (index > curIndex) {
                      callback(cur, index - curIndex, Math.min(length, curIndex + curLength - index));
                    } else {
                      callback(cur, 0, Math.min(curLength, index + length - curIndex));
                    }
                    curIndex += curLength;
                  }
                };
                LinkedList2.prototype.map = function(callback) {
                  return this.reduce(function(memo, cur) {
                    memo.push(callback(cur));
                    return memo;
                  }, []);
                };
                LinkedList2.prototype.reduce = function(callback, memo) {
                  var cur, next = this.iterator();
                  while (cur = next()) {
                    memo = callback(memo, cur);
                  }
                  return memo;
                };
                return LinkedList2;
              }()
            );
            exports2.default = LinkedList;
          },
          /* 45 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            var __extends = this && this.__extends || function() {
              var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
                d.__proto__ = b;
              } || function(d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
              };
              return function(d, b) {
                extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
              };
            }();
            Object.defineProperty(exports2, "__esModule", { value: true });
            var container_1 = __webpack_require__(17);
            var Registry = __webpack_require__(1);
            var OBSERVER_CONFIG = {
              attributes: true,
              characterData: true,
              characterDataOldValue: true,
              childList: true,
              subtree: true
            };
            var MAX_OPTIMIZE_ITERATIONS = 100;
            var ScrollBlot = (
              /** @class */
              function(_super) {
                __extends(ScrollBlot2, _super);
                function ScrollBlot2(node) {
                  var _this = _super.call(this, node) || this;
                  _this.scroll = _this;
                  _this.observer = new MutationObserver(function(mutations) {
                    _this.update(mutations);
                  });
                  _this.observer.observe(_this.domNode, OBSERVER_CONFIG);
                  _this.attach();
                  return _this;
                }
                ScrollBlot2.prototype.detach = function() {
                  _super.prototype.detach.call(this);
                  this.observer.disconnect();
                };
                ScrollBlot2.prototype.deleteAt = function(index, length) {
                  this.update();
                  if (index === 0 && length === this.length()) {
                    this.children.forEach(function(child) {
                      child.remove();
                    });
                  } else {
                    _super.prototype.deleteAt.call(this, index, length);
                  }
                };
                ScrollBlot2.prototype.formatAt = function(index, length, name, value) {
                  this.update();
                  _super.prototype.formatAt.call(this, index, length, name, value);
                };
                ScrollBlot2.prototype.insertAt = function(index, value, def) {
                  this.update();
                  _super.prototype.insertAt.call(this, index, value, def);
                };
                ScrollBlot2.prototype.optimize = function(mutations, context) {
                  var _this = this;
                  if (mutations === void 0) {
                    mutations = [];
                  }
                  if (context === void 0) {
                    context = {};
                  }
                  _super.prototype.optimize.call(this, context);
                  var records = [].slice.call(this.observer.takeRecords());
                  while (records.length > 0)
                    mutations.push(records.pop());
                  var mark = function(blot, markParent) {
                    if (markParent === void 0) {
                      markParent = true;
                    }
                    if (blot == null || blot === _this)
                      return;
                    if (blot.domNode.parentNode == null)
                      return;
                    if (blot.domNode[Registry.DATA_KEY].mutations == null) {
                      blot.domNode[Registry.DATA_KEY].mutations = [];
                    }
                    if (markParent)
                      mark(blot.parent);
                  };
                  var optimize = function(blot) {
                    if (
                      // @ts-ignore
                      blot.domNode[Registry.DATA_KEY] == null || // @ts-ignore
                      blot.domNode[Registry.DATA_KEY].mutations == null
                    ) {
                      return;
                    }
                    if (blot instanceof container_1.default) {
                      blot.children.forEach(optimize);
                    }
                    blot.optimize(context);
                  };
                  var remaining = mutations;
                  for (var i = 0; remaining.length > 0; i += 1) {
                    if (i >= MAX_OPTIMIZE_ITERATIONS) {
                      throw new Error("[Parchment] Maximum optimize iterations reached");
                    }
                    remaining.forEach(function(mutation) {
                      var blot = Registry.find(mutation.target, true);
                      if (blot == null)
                        return;
                      if (blot.domNode === mutation.target) {
                        if (mutation.type === "childList") {
                          mark(Registry.find(mutation.previousSibling, false));
                          [].forEach.call(mutation.addedNodes, function(node) {
                            var child = Registry.find(node, false);
                            mark(child, false);
                            if (child instanceof container_1.default) {
                              child.children.forEach(function(grandChild) {
                                mark(grandChild, false);
                              });
                            }
                          });
                        } else if (mutation.type === "attributes") {
                          mark(blot.prev);
                        }
                      }
                      mark(blot);
                    });
                    this.children.forEach(optimize);
                    remaining = [].slice.call(this.observer.takeRecords());
                    records = remaining.slice();
                    while (records.length > 0)
                      mutations.push(records.pop());
                  }
                };
                ScrollBlot2.prototype.update = function(mutations, context) {
                  var _this = this;
                  if (context === void 0) {
                    context = {};
                  }
                  mutations = mutations || this.observer.takeRecords();
                  mutations.map(function(mutation) {
                    var blot = Registry.find(mutation.target, true);
                    if (blot == null)
                      return null;
                    if (blot.domNode[Registry.DATA_KEY].mutations == null) {
                      blot.domNode[Registry.DATA_KEY].mutations = [mutation];
                      return blot;
                    } else {
                      blot.domNode[Registry.DATA_KEY].mutations.push(mutation);
                      return null;
                    }
                  }).forEach(function(blot) {
                    if (blot == null || blot === _this || //@ts-ignore
                    blot.domNode[Registry.DATA_KEY] == null)
                      return;
                    blot.update(blot.domNode[Registry.DATA_KEY].mutations || [], context);
                  });
                  if (this.domNode[Registry.DATA_KEY].mutations != null) {
                    _super.prototype.update.call(this, this.domNode[Registry.DATA_KEY].mutations, context);
                  }
                  this.optimize(mutations, context);
                };
                ScrollBlot2.blotName = "scroll";
                ScrollBlot2.defaultChild = "block";
                ScrollBlot2.scope = Registry.Scope.BLOCK_BLOT;
                ScrollBlot2.tagName = "DIV";
                return ScrollBlot2;
              }(container_1.default)
            );
            exports2.default = ScrollBlot;
          },
          /* 46 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            var __extends = this && this.__extends || function() {
              var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
                d.__proto__ = b;
              } || function(d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
              };
              return function(d, b) {
                extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
              };
            }();
            Object.defineProperty(exports2, "__esModule", { value: true });
            var format_1 = __webpack_require__(18);
            var Registry = __webpack_require__(1);
            function isEqual(obj1, obj2) {
              if (Object.keys(obj1).length !== Object.keys(obj2).length)
                return false;
              for (var prop in obj1) {
                if (obj1[prop] !== obj2[prop])
                  return false;
              }
              return true;
            }
            var InlineBlot = (
              /** @class */
              function(_super) {
                __extends(InlineBlot2, _super);
                function InlineBlot2() {
                  return _super !== null && _super.apply(this, arguments) || this;
                }
                InlineBlot2.formats = function(domNode) {
                  if (domNode.tagName === InlineBlot2.tagName)
                    return void 0;
                  return _super.formats.call(this, domNode);
                };
                InlineBlot2.prototype.format = function(name, value) {
                  var _this = this;
                  if (name === this.statics.blotName && !value) {
                    this.children.forEach(function(child) {
                      if (!(child instanceof format_1.default)) {
                        child = child.wrap(InlineBlot2.blotName, true);
                      }
                      _this.attributes.copy(child);
                    });
                    this.unwrap();
                  } else {
                    _super.prototype.format.call(this, name, value);
                  }
                };
                InlineBlot2.prototype.formatAt = function(index, length, name, value) {
                  if (this.formats()[name] != null || Registry.query(name, Registry.Scope.ATTRIBUTE)) {
                    var blot = this.isolate(index, length);
                    blot.format(name, value);
                  } else {
                    _super.prototype.formatAt.call(this, index, length, name, value);
                  }
                };
                InlineBlot2.prototype.optimize = function(context) {
                  _super.prototype.optimize.call(this, context);
                  var formats = this.formats();
                  if (Object.keys(formats).length === 0) {
                    return this.unwrap();
                  }
                  var next = this.next;
                  if (next instanceof InlineBlot2 && next.prev === this && isEqual(formats, next.formats())) {
                    next.moveChildren(this);
                    next.remove();
                  }
                };
                InlineBlot2.blotName = "inline";
                InlineBlot2.scope = Registry.Scope.INLINE_BLOT;
                InlineBlot2.tagName = "SPAN";
                return InlineBlot2;
              }(format_1.default)
            );
            exports2.default = InlineBlot;
          },
          /* 47 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            var __extends = this && this.__extends || function() {
              var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
                d.__proto__ = b;
              } || function(d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
              };
              return function(d, b) {
                extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
              };
            }();
            Object.defineProperty(exports2, "__esModule", { value: true });
            var format_1 = __webpack_require__(18);
            var Registry = __webpack_require__(1);
            var BlockBlot = (
              /** @class */
              function(_super) {
                __extends(BlockBlot2, _super);
                function BlockBlot2() {
                  return _super !== null && _super.apply(this, arguments) || this;
                }
                BlockBlot2.formats = function(domNode) {
                  var tagName = Registry.query(BlockBlot2.blotName).tagName;
                  if (domNode.tagName === tagName)
                    return void 0;
                  return _super.formats.call(this, domNode);
                };
                BlockBlot2.prototype.format = function(name, value) {
                  if (Registry.query(name, Registry.Scope.BLOCK) == null) {
                    return;
                  } else if (name === this.statics.blotName && !value) {
                    this.replaceWith(BlockBlot2.blotName);
                  } else {
                    _super.prototype.format.call(this, name, value);
                  }
                };
                BlockBlot2.prototype.formatAt = function(index, length, name, value) {
                  if (Registry.query(name, Registry.Scope.BLOCK) != null) {
                    this.format(name, value);
                  } else {
                    _super.prototype.formatAt.call(this, index, length, name, value);
                  }
                };
                BlockBlot2.prototype.insertAt = function(index, value, def) {
                  if (def == null || Registry.query(value, Registry.Scope.INLINE) != null) {
                    _super.prototype.insertAt.call(this, index, value, def);
                  } else {
                    var after = this.split(index);
                    var blot = Registry.create(value, def);
                    after.parent.insertBefore(blot, after);
                  }
                };
                BlockBlot2.prototype.update = function(mutations, context) {
                  if (navigator.userAgent.match(/Trident/)) {
                    this.build();
                  } else {
                    _super.prototype.update.call(this, mutations, context);
                  }
                };
                BlockBlot2.blotName = "block";
                BlockBlot2.scope = Registry.Scope.BLOCK_BLOT;
                BlockBlot2.tagName = "P";
                return BlockBlot2;
              }(format_1.default)
            );
            exports2.default = BlockBlot;
          },
          /* 48 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            var __extends = this && this.__extends || function() {
              var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
                d.__proto__ = b;
              } || function(d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
              };
              return function(d, b) {
                extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
              };
            }();
            Object.defineProperty(exports2, "__esModule", { value: true });
            var leaf_1 = __webpack_require__(19);
            var EmbedBlot = (
              /** @class */
              function(_super) {
                __extends(EmbedBlot2, _super);
                function EmbedBlot2() {
                  return _super !== null && _super.apply(this, arguments) || this;
                }
                EmbedBlot2.formats = function(domNode) {
                  return void 0;
                };
                EmbedBlot2.prototype.format = function(name, value) {
                  _super.prototype.formatAt.call(this, 0, this.length(), name, value);
                };
                EmbedBlot2.prototype.formatAt = function(index, length, name, value) {
                  if (index === 0 && length === this.length()) {
                    this.format(name, value);
                  } else {
                    _super.prototype.formatAt.call(this, index, length, name, value);
                  }
                };
                EmbedBlot2.prototype.formats = function() {
                  return this.statics.formats(this.domNode);
                };
                return EmbedBlot2;
              }(leaf_1.default)
            );
            exports2.default = EmbedBlot;
          },
          /* 49 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            var __extends = this && this.__extends || function() {
              var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
                d.__proto__ = b;
              } || function(d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
              };
              return function(d, b) {
                extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
              };
            }();
            Object.defineProperty(exports2, "__esModule", { value: true });
            var leaf_1 = __webpack_require__(19);
            var Registry = __webpack_require__(1);
            var TextBlot = (
              /** @class */
              function(_super) {
                __extends(TextBlot2, _super);
                function TextBlot2(node) {
                  var _this = _super.call(this, node) || this;
                  _this.text = _this.statics.value(_this.domNode);
                  return _this;
                }
                TextBlot2.create = function(value) {
                  return document.createTextNode(value);
                };
                TextBlot2.value = function(domNode) {
                  var text = domNode.data;
                  if (text["normalize"])
                    text = text["normalize"]();
                  return text;
                };
                TextBlot2.prototype.deleteAt = function(index, length) {
                  this.domNode.data = this.text = this.text.slice(0, index) + this.text.slice(index + length);
                };
                TextBlot2.prototype.index = function(node, offset) {
                  if (this.domNode === node) {
                    return offset;
                  }
                  return -1;
                };
                TextBlot2.prototype.insertAt = function(index, value, def) {
                  if (def == null) {
                    this.text = this.text.slice(0, index) + value + this.text.slice(index);
                    this.domNode.data = this.text;
                  } else {
                    _super.prototype.insertAt.call(this, index, value, def);
                  }
                };
                TextBlot2.prototype.length = function() {
                  return this.text.length;
                };
                TextBlot2.prototype.optimize = function(context) {
                  _super.prototype.optimize.call(this, context);
                  this.text = this.statics.value(this.domNode);
                  if (this.text.length === 0) {
                    this.remove();
                  } else if (this.next instanceof TextBlot2 && this.next.prev === this) {
                    this.insertAt(this.length(), this.next.value());
                    this.next.remove();
                  }
                };
                TextBlot2.prototype.position = function(index, inclusive) {
                  if (inclusive === void 0) {
                    inclusive = false;
                  }
                  return [this.domNode, index];
                };
                TextBlot2.prototype.split = function(index, force) {
                  if (force === void 0) {
                    force = false;
                  }
                  if (!force) {
                    if (index === 0)
                      return this;
                    if (index === this.length())
                      return this.next;
                  }
                  var after = Registry.create(this.domNode.splitText(index));
                  this.parent.insertBefore(after, this.next);
                  this.text = this.statics.value(this.domNode);
                  return after;
                };
                TextBlot2.prototype.update = function(mutations, context) {
                  var _this = this;
                  if (mutations.some(function(mutation) {
                    return mutation.type === "characterData" && mutation.target === _this.domNode;
                  })) {
                    this.text = this.statics.value(this.domNode);
                  }
                };
                TextBlot2.prototype.value = function() {
                  return this.text;
                };
                TextBlot2.blotName = "text";
                TextBlot2.scope = Registry.Scope.INLINE_BLOT;
                return TextBlot2;
              }(leaf_1.default)
            );
            exports2.default = TextBlot;
          },
          /* 50 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            var elem = document.createElement("div");
            elem.classList.toggle("test-class", false);
            if (elem.classList.contains("test-class")) {
              var _toggle = DOMTokenList.prototype.toggle;
              DOMTokenList.prototype.toggle = function(token, force) {
                if (arguments.length > 1 && !this.contains(token) === !force) {
                  return force;
                } else {
                  return _toggle.call(this, token);
                }
              };
            }
            if (!String.prototype.startsWith) {
              String.prototype.startsWith = function(searchString, position) {
                position = position || 0;
                return this.substr(position, searchString.length) === searchString;
              };
            }
            if (!String.prototype.endsWith) {
              String.prototype.endsWith = function(searchString, position) {
                var subjectString = this.toString();
                if (typeof position !== "number" || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
                  position = subjectString.length;
                }
                position -= searchString.length;
                var lastIndex = subjectString.indexOf(searchString, position);
                return lastIndex !== -1 && lastIndex === position;
              };
            }
            if (!Array.prototype.find) {
              Object.defineProperty(Array.prototype, "find", {
                value: function value(predicate) {
                  if (this === null) {
                    throw new TypeError("Array.prototype.find called on null or undefined");
                  }
                  if (typeof predicate !== "function") {
                    throw new TypeError("predicate must be a function");
                  }
                  var list = Object(this);
                  var length = list.length >>> 0;
                  var thisArg = arguments[1];
                  var value2;
                  for (var i = 0; i < length; i++) {
                    value2 = list[i];
                    if (predicate.call(thisArg, value2, i, list)) {
                      return value2;
                    }
                  }
                  return void 0;
                }
              });
            }
            document.addEventListener("DOMContentLoaded", function() {
              document.execCommand("enableObjectResizing", false, false);
              document.execCommand("autoUrlDetect", false, false);
            });
          },
          /* 51 */
          /***/
          function(module2, exports2) {
            var DIFF_DELETE = -1;
            var DIFF_INSERT = 1;
            var DIFF_EQUAL = 0;
            function diff_main(text1, text2, cursor_pos) {
              if (text1 == text2) {
                if (text1) {
                  return [[DIFF_EQUAL, text1]];
                }
                return [];
              }
              if (cursor_pos < 0 || text1.length < cursor_pos) {
                cursor_pos = null;
              }
              var commonlength = diff_commonPrefix(text1, text2);
              var commonprefix = text1.substring(0, commonlength);
              text1 = text1.substring(commonlength);
              text2 = text2.substring(commonlength);
              commonlength = diff_commonSuffix(text1, text2);
              var commonsuffix = text1.substring(text1.length - commonlength);
              text1 = text1.substring(0, text1.length - commonlength);
              text2 = text2.substring(0, text2.length - commonlength);
              var diffs = diff_compute_(text1, text2);
              if (commonprefix) {
                diffs.unshift([DIFF_EQUAL, commonprefix]);
              }
              if (commonsuffix) {
                diffs.push([DIFF_EQUAL, commonsuffix]);
              }
              diff_cleanupMerge(diffs);
              if (cursor_pos != null) {
                diffs = fix_cursor(diffs, cursor_pos);
              }
              diffs = fix_emoji(diffs);
              return diffs;
            }
            ;
            function diff_compute_(text1, text2) {
              var diffs;
              if (!text1) {
                return [[DIFF_INSERT, text2]];
              }
              if (!text2) {
                return [[DIFF_DELETE, text1]];
              }
              var longtext = text1.length > text2.length ? text1 : text2;
              var shorttext = text1.length > text2.length ? text2 : text1;
              var i = longtext.indexOf(shorttext);
              if (i != -1) {
                diffs = [
                  [DIFF_INSERT, longtext.substring(0, i)],
                  [DIFF_EQUAL, shorttext],
                  [DIFF_INSERT, longtext.substring(i + shorttext.length)]
                ];
                if (text1.length > text2.length) {
                  diffs[0][0] = diffs[2][0] = DIFF_DELETE;
                }
                return diffs;
              }
              if (shorttext.length == 1) {
                return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
              }
              var hm = diff_halfMatch_(text1, text2);
              if (hm) {
                var text1_a = hm[0];
                var text1_b = hm[1];
                var text2_a = hm[2];
                var text2_b = hm[3];
                var mid_common = hm[4];
                var diffs_a = diff_main(text1_a, text2_a);
                var diffs_b = diff_main(text1_b, text2_b);
                return diffs_a.concat([[DIFF_EQUAL, mid_common]], diffs_b);
              }
              return diff_bisect_(text1, text2);
            }
            ;
            function diff_bisect_(text1, text2) {
              var text1_length = text1.length;
              var text2_length = text2.length;
              var max_d = Math.ceil((text1_length + text2_length) / 2);
              var v_offset = max_d;
              var v_length = 2 * max_d;
              var v1 = new Array(v_length);
              var v2 = new Array(v_length);
              for (var x = 0; x < v_length; x++) {
                v1[x] = -1;
                v2[x] = -1;
              }
              v1[v_offset + 1] = 0;
              v2[v_offset + 1] = 0;
              var delta = text1_length - text2_length;
              var front = delta % 2 != 0;
              var k1start = 0;
              var k1end = 0;
              var k2start = 0;
              var k2end = 0;
              for (var d = 0; d < max_d; d++) {
                for (var k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
                  var k1_offset = v_offset + k1;
                  var x1;
                  if (k1 == -d || k1 != d && v1[k1_offset - 1] < v1[k1_offset + 1]) {
                    x1 = v1[k1_offset + 1];
                  } else {
                    x1 = v1[k1_offset - 1] + 1;
                  }
                  var y1 = x1 - k1;
                  while (x1 < text1_length && y1 < text2_length && text1.charAt(x1) == text2.charAt(y1)) {
                    x1++;
                    y1++;
                  }
                  v1[k1_offset] = x1;
                  if (x1 > text1_length) {
                    k1end += 2;
                  } else if (y1 > text2_length) {
                    k1start += 2;
                  } else if (front) {
                    var k2_offset = v_offset + delta - k1;
                    if (k2_offset >= 0 && k2_offset < v_length && v2[k2_offset] != -1) {
                      var x2 = text1_length - v2[k2_offset];
                      if (x1 >= x2) {
                        return diff_bisectSplit_(text1, text2, x1, y1);
                      }
                    }
                  }
                }
                for (var k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
                  var k2_offset = v_offset + k2;
                  var x2;
                  if (k2 == -d || k2 != d && v2[k2_offset - 1] < v2[k2_offset + 1]) {
                    x2 = v2[k2_offset + 1];
                  } else {
                    x2 = v2[k2_offset - 1] + 1;
                  }
                  var y2 = x2 - k2;
                  while (x2 < text1_length && y2 < text2_length && text1.charAt(text1_length - x2 - 1) == text2.charAt(text2_length - y2 - 1)) {
                    x2++;
                    y2++;
                  }
                  v2[k2_offset] = x2;
                  if (x2 > text1_length) {
                    k2end += 2;
                  } else if (y2 > text2_length) {
                    k2start += 2;
                  } else if (!front) {
                    var k1_offset = v_offset + delta - k2;
                    if (k1_offset >= 0 && k1_offset < v_length && v1[k1_offset] != -1) {
                      var x1 = v1[k1_offset];
                      var y1 = v_offset + x1 - k1_offset;
                      x2 = text1_length - x2;
                      if (x1 >= x2) {
                        return diff_bisectSplit_(text1, text2, x1, y1);
                      }
                    }
                  }
                }
              }
              return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
            }
            ;
            function diff_bisectSplit_(text1, text2, x, y) {
              var text1a = text1.substring(0, x);
              var text2a = text2.substring(0, y);
              var text1b = text1.substring(x);
              var text2b = text2.substring(y);
              var diffs = diff_main(text1a, text2a);
              var diffsb = diff_main(text1b, text2b);
              return diffs.concat(diffsb);
            }
            ;
            function diff_commonPrefix(text1, text2) {
              if (!text1 || !text2 || text1.charAt(0) != text2.charAt(0)) {
                return 0;
              }
              var pointermin = 0;
              var pointermax = Math.min(text1.length, text2.length);
              var pointermid = pointermax;
              var pointerstart = 0;
              while (pointermin < pointermid) {
                if (text1.substring(pointerstart, pointermid) == text2.substring(pointerstart, pointermid)) {
                  pointermin = pointermid;
                  pointerstart = pointermin;
                } else {
                  pointermax = pointermid;
                }
                pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
              }
              return pointermid;
            }
            ;
            function diff_commonSuffix(text1, text2) {
              if (!text1 || !text2 || text1.charAt(text1.length - 1) != text2.charAt(text2.length - 1)) {
                return 0;
              }
              var pointermin = 0;
              var pointermax = Math.min(text1.length, text2.length);
              var pointermid = pointermax;
              var pointerend = 0;
              while (pointermin < pointermid) {
                if (text1.substring(text1.length - pointermid, text1.length - pointerend) == text2.substring(text2.length - pointermid, text2.length - pointerend)) {
                  pointermin = pointermid;
                  pointerend = pointermin;
                } else {
                  pointermax = pointermid;
                }
                pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
              }
              return pointermid;
            }
            ;
            function diff_halfMatch_(text1, text2) {
              var longtext = text1.length > text2.length ? text1 : text2;
              var shorttext = text1.length > text2.length ? text2 : text1;
              if (longtext.length < 4 || shorttext.length * 2 < longtext.length) {
                return null;
              }
              function diff_halfMatchI_(longtext2, shorttext2, i) {
                var seed = longtext2.substring(i, i + Math.floor(longtext2.length / 4));
                var j = -1;
                var best_common = "";
                var best_longtext_a, best_longtext_b, best_shorttext_a, best_shorttext_b;
                while ((j = shorttext2.indexOf(seed, j + 1)) != -1) {
                  var prefixLength = diff_commonPrefix(
                    longtext2.substring(i),
                    shorttext2.substring(j)
                  );
                  var suffixLength = diff_commonSuffix(
                    longtext2.substring(0, i),
                    shorttext2.substring(0, j)
                  );
                  if (best_common.length < suffixLength + prefixLength) {
                    best_common = shorttext2.substring(j - suffixLength, j) + shorttext2.substring(j, j + prefixLength);
                    best_longtext_a = longtext2.substring(0, i - suffixLength);
                    best_longtext_b = longtext2.substring(i + prefixLength);
                    best_shorttext_a = shorttext2.substring(0, j - suffixLength);
                    best_shorttext_b = shorttext2.substring(j + prefixLength);
                  }
                }
                if (best_common.length * 2 >= longtext2.length) {
                  return [
                    best_longtext_a,
                    best_longtext_b,
                    best_shorttext_a,
                    best_shorttext_b,
                    best_common
                  ];
                } else {
                  return null;
                }
              }
              var hm1 = diff_halfMatchI_(
                longtext,
                shorttext,
                Math.ceil(longtext.length / 4)
              );
              var hm2 = diff_halfMatchI_(
                longtext,
                shorttext,
                Math.ceil(longtext.length / 2)
              );
              var hm;
              if (!hm1 && !hm2) {
                return null;
              } else if (!hm2) {
                hm = hm1;
              } else if (!hm1) {
                hm = hm2;
              } else {
                hm = hm1[4].length > hm2[4].length ? hm1 : hm2;
              }
              var text1_a, text1_b, text2_a, text2_b;
              if (text1.length > text2.length) {
                text1_a = hm[0];
                text1_b = hm[1];
                text2_a = hm[2];
                text2_b = hm[3];
              } else {
                text2_a = hm[0];
                text2_b = hm[1];
                text1_a = hm[2];
                text1_b = hm[3];
              }
              var mid_common = hm[4];
              return [text1_a, text1_b, text2_a, text2_b, mid_common];
            }
            ;
            function diff_cleanupMerge(diffs) {
              diffs.push([DIFF_EQUAL, ""]);
              var pointer = 0;
              var count_delete = 0;
              var count_insert = 0;
              var text_delete = "";
              var text_insert = "";
              var commonlength;
              while (pointer < diffs.length) {
                switch (diffs[pointer][0]) {
                  case DIFF_INSERT:
                    count_insert++;
                    text_insert += diffs[pointer][1];
                    pointer++;
                    break;
                  case DIFF_DELETE:
                    count_delete++;
                    text_delete += diffs[pointer][1];
                    pointer++;
                    break;
                  case DIFF_EQUAL:
                    if (count_delete + count_insert > 1) {
                      if (count_delete !== 0 && count_insert !== 0) {
                        commonlength = diff_commonPrefix(text_insert, text_delete);
                        if (commonlength !== 0) {
                          if (pointer - count_delete - count_insert > 0 && diffs[pointer - count_delete - count_insert - 1][0] == DIFF_EQUAL) {
                            diffs[pointer - count_delete - count_insert - 1][1] += text_insert.substring(0, commonlength);
                          } else {
                            diffs.splice(0, 0, [
                              DIFF_EQUAL,
                              text_insert.substring(0, commonlength)
                            ]);
                            pointer++;
                          }
                          text_insert = text_insert.substring(commonlength);
                          text_delete = text_delete.substring(commonlength);
                        }
                        commonlength = diff_commonSuffix(text_insert, text_delete);
                        if (commonlength !== 0) {
                          diffs[pointer][1] = text_insert.substring(text_insert.length - commonlength) + diffs[pointer][1];
                          text_insert = text_insert.substring(0, text_insert.length - commonlength);
                          text_delete = text_delete.substring(0, text_delete.length - commonlength);
                        }
                      }
                      if (count_delete === 0) {
                        diffs.splice(
                          pointer - count_insert,
                          count_delete + count_insert,
                          [DIFF_INSERT, text_insert]
                        );
                      } else if (count_insert === 0) {
                        diffs.splice(
                          pointer - count_delete,
                          count_delete + count_insert,
                          [DIFF_DELETE, text_delete]
                        );
                      } else {
                        diffs.splice(
                          pointer - count_delete - count_insert,
                          count_delete + count_insert,
                          [DIFF_DELETE, text_delete],
                          [DIFF_INSERT, text_insert]
                        );
                      }
                      pointer = pointer - count_delete - count_insert + (count_delete ? 1 : 0) + (count_insert ? 1 : 0) + 1;
                    } else if (pointer !== 0 && diffs[pointer - 1][0] == DIFF_EQUAL) {
                      diffs[pointer - 1][1] += diffs[pointer][1];
                      diffs.splice(pointer, 1);
                    } else {
                      pointer++;
                    }
                    count_insert = 0;
                    count_delete = 0;
                    text_delete = "";
                    text_insert = "";
                    break;
                }
              }
              if (diffs[diffs.length - 1][1] === "") {
                diffs.pop();
              }
              var changes = false;
              pointer = 1;
              while (pointer < diffs.length - 1) {
                if (diffs[pointer - 1][0] == DIFF_EQUAL && diffs[pointer + 1][0] == DIFF_EQUAL) {
                  if (diffs[pointer][1].substring(diffs[pointer][1].length - diffs[pointer - 1][1].length) == diffs[pointer - 1][1]) {
                    diffs[pointer][1] = diffs[pointer - 1][1] + diffs[pointer][1].substring(0, diffs[pointer][1].length - diffs[pointer - 1][1].length);
                    diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
                    diffs.splice(pointer - 1, 1);
                    changes = true;
                  } else if (diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) == diffs[pointer + 1][1]) {
                    diffs[pointer - 1][1] += diffs[pointer + 1][1];
                    diffs[pointer][1] = diffs[pointer][1].substring(diffs[pointer + 1][1].length) + diffs[pointer + 1][1];
                    diffs.splice(pointer + 1, 1);
                    changes = true;
                  }
                }
                pointer++;
              }
              if (changes) {
                diff_cleanupMerge(diffs);
              }
            }
            ;
            var diff = diff_main;
            diff.INSERT = DIFF_INSERT;
            diff.DELETE = DIFF_DELETE;
            diff.EQUAL = DIFF_EQUAL;
            module2.exports = diff;
            function cursor_normalize_diff(diffs, cursor_pos) {
              if (cursor_pos === 0) {
                return [DIFF_EQUAL, diffs];
              }
              for (var current_pos = 0, i = 0; i < diffs.length; i++) {
                var d = diffs[i];
                if (d[0] === DIFF_DELETE || d[0] === DIFF_EQUAL) {
                  var next_pos = current_pos + d[1].length;
                  if (cursor_pos === next_pos) {
                    return [i + 1, diffs];
                  } else if (cursor_pos < next_pos) {
                    diffs = diffs.slice();
                    var split_pos = cursor_pos - current_pos;
                    var d_left = [d[0], d[1].slice(0, split_pos)];
                    var d_right = [d[0], d[1].slice(split_pos)];
                    diffs.splice(i, 1, d_left, d_right);
                    return [i + 1, diffs];
                  } else {
                    current_pos = next_pos;
                  }
                }
              }
              throw new Error("cursor_pos is out of bounds!");
            }
            function fix_cursor(diffs, cursor_pos) {
              var norm = cursor_normalize_diff(diffs, cursor_pos);
              var ndiffs = norm[1];
              var cursor_pointer = norm[0];
              var d = ndiffs[cursor_pointer];
              var d_next = ndiffs[cursor_pointer + 1];
              if (d == null) {
                return diffs;
              } else if (d[0] !== DIFF_EQUAL) {
                return diffs;
              } else {
                if (d_next != null && d[1] + d_next[1] === d_next[1] + d[1]) {
                  ndiffs.splice(cursor_pointer, 2, d_next, d);
                  return merge_tuples(ndiffs, cursor_pointer, 2);
                } else if (d_next != null && d_next[1].indexOf(d[1]) === 0) {
                  ndiffs.splice(cursor_pointer, 2, [d_next[0], d[1]], [0, d[1]]);
                  var suffix = d_next[1].slice(d[1].length);
                  if (suffix.length > 0) {
                    ndiffs.splice(cursor_pointer + 2, 0, [d_next[0], suffix]);
                  }
                  return merge_tuples(ndiffs, cursor_pointer, 3);
                } else {
                  return diffs;
                }
              }
            }
            function fix_emoji(diffs) {
              var compact = false;
              var starts_with_pair_end = function(str) {
                return str.charCodeAt(0) >= 56320 && str.charCodeAt(0) <= 57343;
              };
              var ends_with_pair_start = function(str) {
                return str.charCodeAt(str.length - 1) >= 55296 && str.charCodeAt(str.length - 1) <= 56319;
              };
              for (var i = 2; i < diffs.length; i += 1) {
                if (diffs[i - 2][0] === DIFF_EQUAL && ends_with_pair_start(diffs[i - 2][1]) && diffs[i - 1][0] === DIFF_DELETE && starts_with_pair_end(diffs[i - 1][1]) && diffs[i][0] === DIFF_INSERT && starts_with_pair_end(diffs[i][1])) {
                  compact = true;
                  diffs[i - 1][1] = diffs[i - 2][1].slice(-1) + diffs[i - 1][1];
                  diffs[i][1] = diffs[i - 2][1].slice(-1) + diffs[i][1];
                  diffs[i - 2][1] = diffs[i - 2][1].slice(0, -1);
                }
              }
              if (!compact) {
                return diffs;
              }
              var fixed_diffs = [];
              for (var i = 0; i < diffs.length; i += 1) {
                if (diffs[i][1].length > 0) {
                  fixed_diffs.push(diffs[i]);
                }
              }
              return fixed_diffs;
            }
            function merge_tuples(diffs, start, length) {
              for (var i = start + length - 1; i >= 0 && i >= start - 1; i--) {
                if (i + 1 < diffs.length) {
                  var left_d = diffs[i];
                  var right_d = diffs[i + 1];
                  if (left_d[0] === right_d[1]) {
                    diffs.splice(i, 2, [left_d[0], left_d[1] + right_d[1]]);
                  }
                }
              }
              return diffs;
            }
          },
          /* 52 */
          /***/
          function(module2, exports2) {
            exports2 = module2.exports = typeof Object.keys === "function" ? Object.keys : shim;
            exports2.shim = shim;
            function shim(obj) {
              var keys = [];
              for (var key in obj) keys.push(key);
              return keys;
            }
          },
          /* 53 */
          /***/
          function(module2, exports2) {
            var supportsArgumentsClass = function() {
              return Object.prototype.toString.call(arguments);
            }() == "[object Arguments]";
            exports2 = module2.exports = supportsArgumentsClass ? supported : unsupported;
            exports2.supported = supported;
            function supported(object) {
              return Object.prototype.toString.call(object) == "[object Arguments]";
            }
            ;
            exports2.unsupported = unsupported;
            function unsupported(object) {
              return object && typeof object == "object" && typeof object.length == "number" && Object.prototype.hasOwnProperty.call(object, "callee") && !Object.prototype.propertyIsEnumerable.call(object, "callee") || false;
            }
            ;
          },
          /* 54 */
          /***/
          function(module2, exports2) {
            "use strict";
            var has = Object.prototype.hasOwnProperty, prefix = "~";
            function Events() {
            }
            if (Object.create) {
              Events.prototype = /* @__PURE__ */ Object.create(null);
              if (!new Events().__proto__) prefix = false;
            }
            function EE(fn, context, once) {
              this.fn = fn;
              this.context = context;
              this.once = once || false;
            }
            function EventEmitter() {
              this._events = new Events();
              this._eventsCount = 0;
            }
            EventEmitter.prototype.eventNames = function eventNames() {
              var names = [], events, name;
              if (this._eventsCount === 0) return names;
              for (name in events = this._events) {
                if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
              }
              if (Object.getOwnPropertySymbols) {
                return names.concat(Object.getOwnPropertySymbols(events));
              }
              return names;
            };
            EventEmitter.prototype.listeners = function listeners(event, exists) {
              var evt = prefix ? prefix + event : event, available = this._events[evt];
              if (exists) return !!available;
              if (!available) return [];
              if (available.fn) return [available.fn];
              for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
                ee[i] = available[i].fn;
              }
              return ee;
            };
            EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
              var evt = prefix ? prefix + event : event;
              if (!this._events[evt]) return false;
              var listeners = this._events[evt], len = arguments.length, args, i;
              if (listeners.fn) {
                if (listeners.once) this.removeListener(event, listeners.fn, void 0, true);
                switch (len) {
                  case 1:
                    return listeners.fn.call(listeners.context), true;
                  case 2:
                    return listeners.fn.call(listeners.context, a1), true;
                  case 3:
                    return listeners.fn.call(listeners.context, a1, a2), true;
                  case 4:
                    return listeners.fn.call(listeners.context, a1, a2, a3), true;
                  case 5:
                    return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
                  case 6:
                    return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
                }
                for (i = 1, args = new Array(len - 1); i < len; i++) {
                  args[i - 1] = arguments[i];
                }
                listeners.fn.apply(listeners.context, args);
              } else {
                var length = listeners.length, j;
                for (i = 0; i < length; i++) {
                  if (listeners[i].once) this.removeListener(event, listeners[i].fn, void 0, true);
                  switch (len) {
                    case 1:
                      listeners[i].fn.call(listeners[i].context);
                      break;
                    case 2:
                      listeners[i].fn.call(listeners[i].context, a1);
                      break;
                    case 3:
                      listeners[i].fn.call(listeners[i].context, a1, a2);
                      break;
                    case 4:
                      listeners[i].fn.call(listeners[i].context, a1, a2, a3);
                      break;
                    default:
                      if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) {
                        args[j - 1] = arguments[j];
                      }
                      listeners[i].fn.apply(listeners[i].context, args);
                  }
                }
              }
              return true;
            };
            EventEmitter.prototype.on = function on(event, fn, context) {
              var listener = new EE(fn, context || this), evt = prefix ? prefix + event : event;
              if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
              else if (!this._events[evt].fn) this._events[evt].push(listener);
              else this._events[evt] = [this._events[evt], listener];
              return this;
            };
            EventEmitter.prototype.once = function once(event, fn, context) {
              var listener = new EE(fn, context || this, true), evt = prefix ? prefix + event : event;
              if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
              else if (!this._events[evt].fn) this._events[evt].push(listener);
              else this._events[evt] = [this._events[evt], listener];
              return this;
            };
            EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
              var evt = prefix ? prefix + event : event;
              if (!this._events[evt]) return this;
              if (!fn) {
                if (--this._eventsCount === 0) this._events = new Events();
                else delete this._events[evt];
                return this;
              }
              var listeners = this._events[evt];
              if (listeners.fn) {
                if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
                  if (--this._eventsCount === 0) this._events = new Events();
                  else delete this._events[evt];
                }
              } else {
                for (var i = 0, events = [], length = listeners.length; i < length; i++) {
                  if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
                    events.push(listeners[i]);
                  }
                }
                if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
                else if (--this._eventsCount === 0) this._events = new Events();
                else delete this._events[evt];
              }
              return this;
            };
            EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
              var evt;
              if (event) {
                evt = prefix ? prefix + event : event;
                if (this._events[evt]) {
                  if (--this._eventsCount === 0) this._events = new Events();
                  else delete this._events[evt];
                }
              } else {
                this._events = new Events();
                this._eventsCount = 0;
              }
              return this;
            };
            EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
            EventEmitter.prototype.addListener = EventEmitter.prototype.on;
            EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
              return this;
            };
            EventEmitter.prefixed = prefix;
            EventEmitter.EventEmitter = EventEmitter;
            if ("undefined" !== typeof module2) {
              module2.exports = EventEmitter;
            }
          },
          /* 55 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            exports2.matchText = exports2.matchSpacing = exports2.matchNewline = exports2.matchBlot = exports2.matchAttributor = exports2.default = void 0;
            var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
              return typeof obj;
            } : function(obj) {
              return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
            var _slicedToArray = /* @__PURE__ */ function() {
              function sliceIterator(arr, i) {
                var _arr = [];
                var _n = true;
                var _d = false;
                var _e = void 0;
                try {
                  for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);
                    if (i && _arr.length === i) break;
                  }
                } catch (err) {
                  _d = true;
                  _e = err;
                } finally {
                  try {
                    if (!_n && _i["return"]) _i["return"]();
                  } finally {
                    if (_d) throw _e;
                  }
                }
                return _arr;
              }
              return function(arr, i) {
                if (Array.isArray(arr)) {
                  return arr;
                } else if (Symbol.iterator in Object(arr)) {
                  return sliceIterator(arr, i);
                } else {
                  throw new TypeError("Invalid attempt to destructure non-iterable instance");
                }
              };
            }();
            var _createClass = /* @__PURE__ */ function() {
              function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
                }
              }
              return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
              };
            }();
            var _extend2 = __webpack_require__(3);
            var _extend3 = _interopRequireDefault(_extend2);
            var _quillDelta = __webpack_require__(2);
            var _quillDelta2 = _interopRequireDefault(_quillDelta);
            var _parchment = __webpack_require__(0);
            var _parchment2 = _interopRequireDefault(_parchment);
            var _quill = __webpack_require__(5);
            var _quill2 = _interopRequireDefault(_quill);
            var _logger = __webpack_require__(10);
            var _logger2 = _interopRequireDefault(_logger);
            var _module = __webpack_require__(9);
            var _module2 = _interopRequireDefault(_module);
            var _align = __webpack_require__(36);
            var _background = __webpack_require__(37);
            var _code = __webpack_require__(13);
            var _code2 = _interopRequireDefault(_code);
            var _color = __webpack_require__(26);
            var _direction = __webpack_require__(38);
            var _font = __webpack_require__(39);
            var _size = __webpack_require__(40);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            function _defineProperty(obj, key, value) {
              if (key in obj) {
                Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
              } else {
                obj[key] = value;
              }
              return obj;
            }
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            function _possibleConstructorReturn(self2, call) {
              if (!self2) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              }
              return call && (typeof call === "object" || typeof call === "function") ? call : self2;
            }
            function _inherits(subClass, superClass) {
              if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
              }
              subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
              if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            var debug = (0, _logger2.default)("quill:clipboard");
            var DOM_KEY = "__ql-matcher";
            var CLIPBOARD_CONFIG = [[Node.TEXT_NODE, matchText], [Node.TEXT_NODE, matchNewline], ["br", matchBreak], [Node.ELEMENT_NODE, matchNewline], [Node.ELEMENT_NODE, matchBlot], [Node.ELEMENT_NODE, matchSpacing], [Node.ELEMENT_NODE, matchAttributor], [Node.ELEMENT_NODE, matchStyles], ["li", matchIndent], ["b", matchAlias.bind(matchAlias, "bold")], ["i", matchAlias.bind(matchAlias, "italic")], ["style", matchIgnore]];
            var ATTRIBUTE_ATTRIBUTORS = [_align.AlignAttribute, _direction.DirectionAttribute].reduce(function(memo, attr) {
              memo[attr.keyName] = attr;
              return memo;
            }, {});
            var STYLE_ATTRIBUTORS = [_align.AlignStyle, _background.BackgroundStyle, _color.ColorStyle, _direction.DirectionStyle, _font.FontStyle, _size.SizeStyle].reduce(function(memo, attr) {
              memo[attr.keyName] = attr;
              return memo;
            }, {});
            var Clipboard = function(_Module) {
              _inherits(Clipboard2, _Module);
              function Clipboard2(quill, options) {
                _classCallCheck(this, Clipboard2);
                var _this = _possibleConstructorReturn(this, (Clipboard2.__proto__ || Object.getPrototypeOf(Clipboard2)).call(this, quill, options));
                _this.quill.root.addEventListener("paste", _this.onPaste.bind(_this));
                _this.container = _this.quill.addContainer("ql-clipboard");
                _this.container.setAttribute("contenteditable", true);
                _this.container.setAttribute("tabindex", -1);
                _this.matchers = [];
                CLIPBOARD_CONFIG.concat(_this.options.matchers).forEach(function(_ref) {
                  var _ref2 = _slicedToArray(_ref, 2), selector = _ref2[0], matcher = _ref2[1];
                  if (!options.matchVisual && matcher === matchSpacing) return;
                  _this.addMatcher(selector, matcher);
                });
                return _this;
              }
              _createClass(Clipboard2, [{
                key: "addMatcher",
                value: function addMatcher(selector, matcher) {
                  this.matchers.push([selector, matcher]);
                }
              }, {
                key: "convert",
                value: function convert(html) {
                  if (typeof html === "string") {
                    this.container.innerHTML = html.replace(/\>\r?\n +\</g, "><");
                    return this.convert();
                  }
                  var formats = this.quill.getFormat(this.quill.selection.savedRange.index);
                  if (formats[_code2.default.blotName]) {
                    var text = this.container.innerText;
                    this.container.innerHTML = "";
                    return new _quillDelta2.default().insert(text, _defineProperty({}, _code2.default.blotName, formats[_code2.default.blotName]));
                  }
                  var _prepareMatching = this.prepareMatching(), _prepareMatching2 = _slicedToArray(_prepareMatching, 2), elementMatchers = _prepareMatching2[0], textMatchers = _prepareMatching2[1];
                  var delta = traverse(this.container, elementMatchers, textMatchers);
                  if (deltaEndsWith(delta, "\n") && delta.ops[delta.ops.length - 1].attributes == null) {
                    delta = delta.compose(new _quillDelta2.default().retain(delta.length() - 1).delete(1));
                  }
                  debug.log("convert", this.container.innerHTML, delta);
                  this.container.innerHTML = "";
                  return delta;
                }
              }, {
                key: "dangerouslyPasteHTML",
                value: function dangerouslyPasteHTML(index, html) {
                  var source = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : _quill2.default.sources.API;
                  if (typeof index === "string") {
                    this.quill.setContents(this.convert(index), html);
                    this.quill.setSelection(0, _quill2.default.sources.SILENT);
                  } else {
                    var paste = this.convert(html);
                    this.quill.updateContents(new _quillDelta2.default().retain(index).concat(paste), source);
                    this.quill.setSelection(index + paste.length(), _quill2.default.sources.SILENT);
                  }
                }
              }, {
                key: "onPaste",
                value: function onPaste(e) {
                  var _this2 = this;
                  if (e.defaultPrevented || !this.quill.isEnabled()) return;
                  var range = this.quill.getSelection();
                  var delta = new _quillDelta2.default().retain(range.index);
                  var scrollTop = this.quill.scrollingContainer.scrollTop;
                  this.container.focus();
                  this.quill.selection.update(_quill2.default.sources.SILENT);
                  setTimeout(function() {
                    delta = delta.concat(_this2.convert()).delete(range.length);
                    _this2.quill.updateContents(delta, _quill2.default.sources.USER);
                    _this2.quill.setSelection(delta.length() - range.length, _quill2.default.sources.SILENT);
                    _this2.quill.scrollingContainer.scrollTop = scrollTop;
                    _this2.quill.focus();
                  }, 1);
                }
              }, {
                key: "prepareMatching",
                value: function prepareMatching() {
                  var _this3 = this;
                  var elementMatchers = [], textMatchers = [];
                  this.matchers.forEach(function(pair) {
                    var _pair = _slicedToArray(pair, 2), selector = _pair[0], matcher = _pair[1];
                    switch (selector) {
                      case Node.TEXT_NODE:
                        textMatchers.push(matcher);
                        break;
                      case Node.ELEMENT_NODE:
                        elementMatchers.push(matcher);
                        break;
                      default:
                        [].forEach.call(_this3.container.querySelectorAll(selector), function(node) {
                          node[DOM_KEY] = node[DOM_KEY] || [];
                          node[DOM_KEY].push(matcher);
                        });
                        break;
                    }
                  });
                  return [elementMatchers, textMatchers];
                }
              }]);
              return Clipboard2;
            }(_module2.default);
            Clipboard.DEFAULTS = {
              matchers: [],
              matchVisual: true
            };
            function applyFormat(delta, format, value) {
              if ((typeof format === "undefined" ? "undefined" : _typeof(format)) === "object") {
                return Object.keys(format).reduce(function(delta2, key) {
                  return applyFormat(delta2, key, format[key]);
                }, delta);
              } else {
                return delta.reduce(function(delta2, op) {
                  if (op.attributes && op.attributes[format]) {
                    return delta2.push(op);
                  } else {
                    return delta2.insert(op.insert, (0, _extend3.default)({}, _defineProperty({}, format, value), op.attributes));
                  }
                }, new _quillDelta2.default());
              }
            }
            function computeStyle(node) {
              if (node.nodeType !== Node.ELEMENT_NODE) return {};
              var DOM_KEY2 = "__ql-computed-style";
              return node[DOM_KEY2] || (node[DOM_KEY2] = window.getComputedStyle(node));
            }
            function deltaEndsWith(delta, text) {
              var endText = "";
              for (var i = delta.ops.length - 1; i >= 0 && endText.length < text.length; --i) {
                var op = delta.ops[i];
                if (typeof op.insert !== "string") break;
                endText = op.insert + endText;
              }
              return endText.slice(-1 * text.length) === text;
            }
            function isLine(node) {
              if (node.childNodes.length === 0) return false;
              var style = computeStyle(node);
              return ["block", "list-item"].indexOf(style.display) > -1;
            }
            function traverse(node, elementMatchers, textMatchers) {
              if (node.nodeType === node.TEXT_NODE) {
                return textMatchers.reduce(function(delta, matcher) {
                  return matcher(node, delta);
                }, new _quillDelta2.default());
              } else if (node.nodeType === node.ELEMENT_NODE) {
                return [].reduce.call(node.childNodes || [], function(delta, childNode) {
                  var childrenDelta = traverse(childNode, elementMatchers, textMatchers);
                  if (childNode.nodeType === node.ELEMENT_NODE) {
                    childrenDelta = elementMatchers.reduce(function(childrenDelta2, matcher) {
                      return matcher(childNode, childrenDelta2);
                    }, childrenDelta);
                    childrenDelta = (childNode[DOM_KEY] || []).reduce(function(childrenDelta2, matcher) {
                      return matcher(childNode, childrenDelta2);
                    }, childrenDelta);
                  }
                  return delta.concat(childrenDelta);
                }, new _quillDelta2.default());
              } else {
                return new _quillDelta2.default();
              }
            }
            function matchAlias(format, node, delta) {
              return applyFormat(delta, format, true);
            }
            function matchAttributor(node, delta) {
              var attributes = _parchment2.default.Attributor.Attribute.keys(node);
              var classes = _parchment2.default.Attributor.Class.keys(node);
              var styles = _parchment2.default.Attributor.Style.keys(node);
              var formats = {};
              attributes.concat(classes).concat(styles).forEach(function(name) {
                var attr = _parchment2.default.query(name, _parchment2.default.Scope.ATTRIBUTE);
                if (attr != null) {
                  formats[attr.attrName] = attr.value(node);
                  if (formats[attr.attrName]) return;
                }
                attr = ATTRIBUTE_ATTRIBUTORS[name];
                if (attr != null && (attr.attrName === name || attr.keyName === name)) {
                  formats[attr.attrName] = attr.value(node) || void 0;
                }
                attr = STYLE_ATTRIBUTORS[name];
                if (attr != null && (attr.attrName === name || attr.keyName === name)) {
                  attr = STYLE_ATTRIBUTORS[name];
                  formats[attr.attrName] = attr.value(node) || void 0;
                }
              });
              if (Object.keys(formats).length > 0) {
                delta = applyFormat(delta, formats);
              }
              return delta;
            }
            function matchBlot(node, delta) {
              var match = _parchment2.default.query(node);
              if (match == null) return delta;
              if (match.prototype instanceof _parchment2.default.Embed) {
                var embed = {};
                var value = match.value(node);
                if (value != null) {
                  embed[match.blotName] = value;
                  delta = new _quillDelta2.default().insert(embed, match.formats(node));
                }
              } else if (typeof match.formats === "function") {
                delta = applyFormat(delta, match.blotName, match.formats(node));
              }
              return delta;
            }
            function matchBreak(node, delta) {
              if (!deltaEndsWith(delta, "\n")) {
                delta.insert("\n");
              }
              return delta;
            }
            function matchIgnore() {
              return new _quillDelta2.default();
            }
            function matchIndent(node, delta) {
              var match = _parchment2.default.query(node);
              if (match == null || match.blotName !== "list-item" || !deltaEndsWith(delta, "\n")) {
                return delta;
              }
              var indent = -1, parent = node.parentNode;
              while (!parent.classList.contains("ql-clipboard")) {
                if ((_parchment2.default.query(parent) || {}).blotName === "list") {
                  indent += 1;
                }
                parent = parent.parentNode;
              }
              if (indent <= 0) return delta;
              return delta.compose(new _quillDelta2.default().retain(delta.length() - 1).retain(1, { indent }));
            }
            function matchNewline(node, delta) {
              if (!deltaEndsWith(delta, "\n")) {
                if (isLine(node) || delta.length() > 0 && node.nextSibling && isLine(node.nextSibling)) {
                  delta.insert("\n");
                }
              }
              return delta;
            }
            function matchSpacing(node, delta) {
              if (isLine(node) && node.nextElementSibling != null && !deltaEndsWith(delta, "\n\n")) {
                var nodeHeight = node.offsetHeight + parseFloat(computeStyle(node).marginTop) + parseFloat(computeStyle(node).marginBottom);
                if (node.nextElementSibling.offsetTop > node.offsetTop + nodeHeight * 1.5) {
                  delta.insert("\n");
                }
              }
              return delta;
            }
            function matchStyles(node, delta) {
              var formats = {};
              var style = node.style || {};
              if (style.fontStyle && computeStyle(node).fontStyle === "italic") {
                formats.italic = true;
              }
              if (style.fontWeight && (computeStyle(node).fontWeight.startsWith("bold") || parseInt(computeStyle(node).fontWeight) >= 700)) {
                formats.bold = true;
              }
              if (Object.keys(formats).length > 0) {
                delta = applyFormat(delta, formats);
              }
              if (parseFloat(style.textIndent || 0) > 0) {
                delta = new _quillDelta2.default().insert("	").concat(delta);
              }
              return delta;
            }
            function matchText(node, delta) {
              var text = node.data;
              if (node.parentNode.tagName === "O:P") {
                return delta.insert(text.trim());
              }
              if (text.trim().length === 0 && node.parentNode.classList.contains("ql-clipboard")) {
                return delta;
              }
              if (!computeStyle(node.parentNode).whiteSpace.startsWith("pre")) {
                var replacer = function replacer2(collapse, match) {
                  match = match.replace(/[^\u00a0]/g, "");
                  return match.length < 1 && collapse ? " " : match;
                };
                text = text.replace(/\r\n/g, " ").replace(/\n/g, " ");
                text = text.replace(/\s\s+/g, replacer.bind(replacer, true));
                if (node.previousSibling == null && isLine(node.parentNode) || node.previousSibling != null && isLine(node.previousSibling)) {
                  text = text.replace(/^\s+/, replacer.bind(replacer, false));
                }
                if (node.nextSibling == null && isLine(node.parentNode) || node.nextSibling != null && isLine(node.nextSibling)) {
                  text = text.replace(/\s+$/, replacer.bind(replacer, false));
                }
              }
              return delta.insert(text);
            }
            exports2.default = Clipboard;
            exports2.matchAttributor = matchAttributor;
            exports2.matchBlot = matchBlot;
            exports2.matchNewline = matchNewline;
            exports2.matchSpacing = matchSpacing;
            exports2.matchText = matchText;
          },
          /* 56 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            var _createClass = /* @__PURE__ */ function() {
              function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
                }
              }
              return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
              };
            }();
            var _get = function get(object, property, receiver) {
              if (object === null) object = Function.prototype;
              var desc = Object.getOwnPropertyDescriptor(object, property);
              if (desc === void 0) {
                var parent = Object.getPrototypeOf(object);
                if (parent === null) {
                  return void 0;
                } else {
                  return get(parent, property, receiver);
                }
              } else if ("value" in desc) {
                return desc.value;
              } else {
                var getter = desc.get;
                if (getter === void 0) {
                  return void 0;
                }
                return getter.call(receiver);
              }
            };
            var _inline = __webpack_require__(6);
            var _inline2 = _interopRequireDefault(_inline);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            function _possibleConstructorReturn(self2, call) {
              if (!self2) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              }
              return call && (typeof call === "object" || typeof call === "function") ? call : self2;
            }
            function _inherits(subClass, superClass) {
              if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
              }
              subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
              if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            var Bold = function(_Inline) {
              _inherits(Bold2, _Inline);
              function Bold2() {
                _classCallCheck(this, Bold2);
                return _possibleConstructorReturn(this, (Bold2.__proto__ || Object.getPrototypeOf(Bold2)).apply(this, arguments));
              }
              _createClass(Bold2, [{
                key: "optimize",
                value: function optimize(context) {
                  _get(Bold2.prototype.__proto__ || Object.getPrototypeOf(Bold2.prototype), "optimize", this).call(this, context);
                  if (this.domNode.tagName !== this.statics.tagName[0]) {
                    this.replaceWith(this.statics.blotName);
                  }
                }
              }], [{
                key: "create",
                value: function create() {
                  return _get(Bold2.__proto__ || Object.getPrototypeOf(Bold2), "create", this).call(this);
                }
              }, {
                key: "formats",
                value: function formats() {
                  return true;
                }
              }]);
              return Bold2;
            }(_inline2.default);
            Bold.blotName = "bold";
            Bold.tagName = ["STRONG", "B"];
            exports2.default = Bold;
          },
          /* 57 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            exports2.addControls = exports2.default = void 0;
            var _slicedToArray = /* @__PURE__ */ function() {
              function sliceIterator(arr, i) {
                var _arr = [];
                var _n = true;
                var _d = false;
                var _e = void 0;
                try {
                  for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);
                    if (i && _arr.length === i) break;
                  }
                } catch (err) {
                  _d = true;
                  _e = err;
                } finally {
                  try {
                    if (!_n && _i["return"]) _i["return"]();
                  } finally {
                    if (_d) throw _e;
                  }
                }
                return _arr;
              }
              return function(arr, i) {
                if (Array.isArray(arr)) {
                  return arr;
                } else if (Symbol.iterator in Object(arr)) {
                  return sliceIterator(arr, i);
                } else {
                  throw new TypeError("Invalid attempt to destructure non-iterable instance");
                }
              };
            }();
            var _createClass = /* @__PURE__ */ function() {
              function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
                }
              }
              return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
              };
            }();
            var _quillDelta = __webpack_require__(2);
            var _quillDelta2 = _interopRequireDefault(_quillDelta);
            var _parchment = __webpack_require__(0);
            var _parchment2 = _interopRequireDefault(_parchment);
            var _quill = __webpack_require__(5);
            var _quill2 = _interopRequireDefault(_quill);
            var _logger = __webpack_require__(10);
            var _logger2 = _interopRequireDefault(_logger);
            var _module = __webpack_require__(9);
            var _module2 = _interopRequireDefault(_module);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            function _defineProperty(obj, key, value) {
              if (key in obj) {
                Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
              } else {
                obj[key] = value;
              }
              return obj;
            }
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            function _possibleConstructorReturn(self2, call) {
              if (!self2) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              }
              return call && (typeof call === "object" || typeof call === "function") ? call : self2;
            }
            function _inherits(subClass, superClass) {
              if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
              }
              subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
              if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            var debug = (0, _logger2.default)("quill:toolbar");
            var Toolbar = function(_Module) {
              _inherits(Toolbar2, _Module);
              function Toolbar2(quill, options) {
                _classCallCheck(this, Toolbar2);
                var _this = _possibleConstructorReturn(this, (Toolbar2.__proto__ || Object.getPrototypeOf(Toolbar2)).call(this, quill, options));
                if (Array.isArray(_this.options.container)) {
                  var container = document.createElement("div");
                  addControls(container, _this.options.container);
                  quill.container.parentNode.insertBefore(container, quill.container);
                  _this.container = container;
                } else if (typeof _this.options.container === "string") {
                  _this.container = document.querySelector(_this.options.container);
                } else {
                  _this.container = _this.options.container;
                }
                if (!(_this.container instanceof HTMLElement)) {
                  var _ret;
                  return _ret = debug.error("Container required for toolbar", _this.options), _possibleConstructorReturn(_this, _ret);
                }
                _this.container.classList.add("ql-toolbar");
                _this.controls = [];
                _this.handlers = {};
                Object.keys(_this.options.handlers).forEach(function(format) {
                  _this.addHandler(format, _this.options.handlers[format]);
                });
                [].forEach.call(_this.container.querySelectorAll("button, select"), function(input) {
                  _this.attach(input);
                });
                _this.quill.on(_quill2.default.events.EDITOR_CHANGE, function(type, range) {
                  if (type === _quill2.default.events.SELECTION_CHANGE) {
                    _this.update(range);
                  }
                });
                _this.quill.on(_quill2.default.events.SCROLL_OPTIMIZE, function() {
                  var _this$quill$selection = _this.quill.selection.getRange(), _this$quill$selection2 = _slicedToArray(_this$quill$selection, 1), range = _this$quill$selection2[0];
                  _this.update(range);
                });
                return _this;
              }
              _createClass(Toolbar2, [{
                key: "addHandler",
                value: function addHandler(format, handler) {
                  this.handlers[format] = handler;
                }
              }, {
                key: "attach",
                value: function attach(input) {
                  var _this2 = this;
                  var format = [].find.call(input.classList, function(className) {
                    return className.indexOf("ql-") === 0;
                  });
                  if (!format) return;
                  format = format.slice("ql-".length);
                  if (input.tagName === "BUTTON") {
                    input.setAttribute("type", "button");
                  }
                  if (this.handlers[format] == null) {
                    if (this.quill.scroll.whitelist != null && this.quill.scroll.whitelist[format] == null) {
                      debug.warn("ignoring attaching to disabled format", format, input);
                      return;
                    }
                    if (_parchment2.default.query(format) == null) {
                      debug.warn("ignoring attaching to nonexistent format", format, input);
                      return;
                    }
                  }
                  var eventName = input.tagName === "SELECT" ? "change" : "click";
                  input.addEventListener(eventName, function(e) {
                    var value = void 0;
                    if (input.tagName === "SELECT") {
                      if (input.selectedIndex < 0) return;
                      var selected = input.options[input.selectedIndex];
                      if (selected.hasAttribute("selected")) {
                        value = false;
                      } else {
                        value = selected.value || false;
                      }
                    } else {
                      if (input.classList.contains("ql-active")) {
                        value = false;
                      } else {
                        value = input.value || !input.hasAttribute("value");
                      }
                      e.preventDefault();
                    }
                    _this2.quill.focus();
                    var _quill$selection$getR = _this2.quill.selection.getRange(), _quill$selection$getR2 = _slicedToArray(_quill$selection$getR, 1), range = _quill$selection$getR2[0];
                    if (_this2.handlers[format] != null) {
                      _this2.handlers[format].call(_this2, value);
                    } else if (_parchment2.default.query(format).prototype instanceof _parchment2.default.Embed) {
                      value = prompt("Enter " + format);
                      if (!value) return;
                      _this2.quill.updateContents(new _quillDelta2.default().retain(range.index).delete(range.length).insert(_defineProperty({}, format, value)), _quill2.default.sources.USER);
                    } else {
                      _this2.quill.format(format, value, _quill2.default.sources.USER);
                    }
                    _this2.update(range);
                  });
                  this.controls.push([format, input]);
                }
              }, {
                key: "update",
                value: function update(range) {
                  var formats = range == null ? {} : this.quill.getFormat(range);
                  this.controls.forEach(function(pair) {
                    var _pair = _slicedToArray(pair, 2), format = _pair[0], input = _pair[1];
                    if (input.tagName === "SELECT") {
                      var option = void 0;
                      if (range == null) {
                        option = null;
                      } else if (formats[format] == null) {
                        option = input.querySelector("option[selected]");
                      } else if (!Array.isArray(formats[format])) {
                        var value = formats[format];
                        if (typeof value === "string") {
                          value = value.replace(/\"/g, '\\"');
                        }
                        option = input.querySelector('option[value="' + value + '"]');
                      }
                      if (option == null) {
                        input.value = "";
                        input.selectedIndex = -1;
                      } else {
                        option.selected = true;
                      }
                    } else {
                      if (range == null) {
                        input.classList.remove("ql-active");
                      } else if (input.hasAttribute("value")) {
                        var isActive = formats[format] === input.getAttribute("value") || formats[format] != null && formats[format].toString() === input.getAttribute("value") || formats[format] == null && !input.getAttribute("value");
                        input.classList.toggle("ql-active", isActive);
                      } else {
                        input.classList.toggle("ql-active", formats[format] != null);
                      }
                    }
                  });
                }
              }]);
              return Toolbar2;
            }(_module2.default);
            Toolbar.DEFAULTS = {};
            function addButton(container, format, value) {
              var input = document.createElement("button");
              input.setAttribute("type", "button");
              input.classList.add("ql-" + format);
              if (value != null) {
                input.value = value;
              }
              container.appendChild(input);
            }
            function addControls(container, groups) {
              if (!Array.isArray(groups[0])) {
                groups = [groups];
              }
              groups.forEach(function(controls) {
                var group = document.createElement("span");
                group.classList.add("ql-formats");
                controls.forEach(function(control) {
                  if (typeof control === "string") {
                    addButton(group, control);
                  } else {
                    var format = Object.keys(control)[0];
                    var value = control[format];
                    if (Array.isArray(value)) {
                      addSelect(group, format, value);
                    } else {
                      addButton(group, format, value);
                    }
                  }
                });
                container.appendChild(group);
              });
            }
            function addSelect(container, format, values) {
              var input = document.createElement("select");
              input.classList.add("ql-" + format);
              values.forEach(function(value) {
                var option = document.createElement("option");
                if (value !== false) {
                  option.setAttribute("value", value);
                } else {
                  option.setAttribute("selected", "selected");
                }
                input.appendChild(option);
              });
              container.appendChild(input);
            }
            Toolbar.DEFAULTS = {
              container: null,
              handlers: {
                clean: function clean() {
                  var _this3 = this;
                  var range = this.quill.getSelection();
                  if (range == null) return;
                  if (range.length == 0) {
                    var formats = this.quill.getFormat();
                    Object.keys(formats).forEach(function(name) {
                      if (_parchment2.default.query(name, _parchment2.default.Scope.INLINE) != null) {
                        _this3.quill.format(name, false);
                      }
                    });
                  } else {
                    this.quill.removeFormat(range, _quill2.default.sources.USER);
                  }
                },
                direction: function direction(value) {
                  var align = this.quill.getFormat()["align"];
                  if (value === "rtl" && align == null) {
                    this.quill.format("align", "right", _quill2.default.sources.USER);
                  } else if (!value && align === "right") {
                    this.quill.format("align", false, _quill2.default.sources.USER);
                  }
                  this.quill.format("direction", value, _quill2.default.sources.USER);
                },
                indent: function indent(value) {
                  var range = this.quill.getSelection();
                  var formats = this.quill.getFormat(range);
                  var indent2 = parseInt(formats.indent || 0);
                  if (value === "+1" || value === "-1") {
                    var modifier = value === "+1" ? 1 : -1;
                    if (formats.direction === "rtl") modifier *= -1;
                    this.quill.format("indent", indent2 + modifier, _quill2.default.sources.USER);
                  }
                },
                link: function link(value) {
                  if (value === true) {
                    value = prompt("Enter link URL:");
                  }
                  this.quill.format("link", value, _quill2.default.sources.USER);
                },
                list: function list(value) {
                  var range = this.quill.getSelection();
                  var formats = this.quill.getFormat(range);
                  if (value === "check") {
                    if (formats["list"] === "checked" || formats["list"] === "unchecked") {
                      this.quill.format("list", false, _quill2.default.sources.USER);
                    } else {
                      this.quill.format("list", "unchecked", _quill2.default.sources.USER);
                    }
                  } else {
                    this.quill.format("list", value, _quill2.default.sources.USER);
                  }
                }
              }
            };
            exports2.default = Toolbar;
            exports2.addControls = addControls;
          },
          /* 58 */
          /***/
          function(module2, exports2) {
            module2.exports = '<svg viewbox="0 0 18 18"> <polyline class="ql-even ql-stroke" points="5 7 3 9 5 11"></polyline> <polyline class="ql-even ql-stroke" points="13 7 15 9 13 11"></polyline> <line class=ql-stroke x1=10 x2=8 y1=5 y2=13></line> </svg>';
          },
          /* 59 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            var _createClass = /* @__PURE__ */ function() {
              function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
                }
              }
              return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
              };
            }();
            var _get = function get(object, property, receiver) {
              if (object === null) object = Function.prototype;
              var desc = Object.getOwnPropertyDescriptor(object, property);
              if (desc === void 0) {
                var parent = Object.getPrototypeOf(object);
                if (parent === null) {
                  return void 0;
                } else {
                  return get(parent, property, receiver);
                }
              } else if ("value" in desc) {
                return desc.value;
              } else {
                var getter = desc.get;
                if (getter === void 0) {
                  return void 0;
                }
                return getter.call(receiver);
              }
            };
            var _picker = __webpack_require__(28);
            var _picker2 = _interopRequireDefault(_picker);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            function _possibleConstructorReturn(self2, call) {
              if (!self2) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              }
              return call && (typeof call === "object" || typeof call === "function") ? call : self2;
            }
            function _inherits(subClass, superClass) {
              if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
              }
              subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
              if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            var ColorPicker = function(_Picker) {
              _inherits(ColorPicker2, _Picker);
              function ColorPicker2(select, label) {
                _classCallCheck(this, ColorPicker2);
                var _this = _possibleConstructorReturn(this, (ColorPicker2.__proto__ || Object.getPrototypeOf(ColorPicker2)).call(this, select));
                _this.label.innerHTML = label;
                _this.container.classList.add("ql-color-picker");
                [].slice.call(_this.container.querySelectorAll(".ql-picker-item"), 0, 7).forEach(function(item) {
                  item.classList.add("ql-primary");
                });
                return _this;
              }
              _createClass(ColorPicker2, [{
                key: "buildItem",
                value: function buildItem(option) {
                  var item = _get(ColorPicker2.prototype.__proto__ || Object.getPrototypeOf(ColorPicker2.prototype), "buildItem", this).call(this, option);
                  item.style.backgroundColor = option.getAttribute("value") || "";
                  return item;
                }
              }, {
                key: "selectItem",
                value: function selectItem(item, trigger) {
                  _get(ColorPicker2.prototype.__proto__ || Object.getPrototypeOf(ColorPicker2.prototype), "selectItem", this).call(this, item, trigger);
                  var colorLabel = this.label.querySelector(".ql-color-label");
                  var value = item ? item.getAttribute("data-value") || "" : "";
                  if (colorLabel) {
                    if (colorLabel.tagName === "line") {
                      colorLabel.style.stroke = value;
                    } else {
                      colorLabel.style.fill = value;
                    }
                  }
                }
              }]);
              return ColorPicker2;
            }(_picker2.default);
            exports2.default = ColorPicker;
          },
          /* 60 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            var _createClass = /* @__PURE__ */ function() {
              function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
                }
              }
              return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
              };
            }();
            var _get = function get(object, property, receiver) {
              if (object === null) object = Function.prototype;
              var desc = Object.getOwnPropertyDescriptor(object, property);
              if (desc === void 0) {
                var parent = Object.getPrototypeOf(object);
                if (parent === null) {
                  return void 0;
                } else {
                  return get(parent, property, receiver);
                }
              } else if ("value" in desc) {
                return desc.value;
              } else {
                var getter = desc.get;
                if (getter === void 0) {
                  return void 0;
                }
                return getter.call(receiver);
              }
            };
            var _picker = __webpack_require__(28);
            var _picker2 = _interopRequireDefault(_picker);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            function _possibleConstructorReturn(self2, call) {
              if (!self2) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              }
              return call && (typeof call === "object" || typeof call === "function") ? call : self2;
            }
            function _inherits(subClass, superClass) {
              if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
              }
              subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
              if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            var IconPicker = function(_Picker) {
              _inherits(IconPicker2, _Picker);
              function IconPicker2(select, icons) {
                _classCallCheck(this, IconPicker2);
                var _this = _possibleConstructorReturn(this, (IconPicker2.__proto__ || Object.getPrototypeOf(IconPicker2)).call(this, select));
                _this.container.classList.add("ql-icon-picker");
                [].forEach.call(_this.container.querySelectorAll(".ql-picker-item"), function(item) {
                  item.innerHTML = icons[item.getAttribute("data-value") || ""];
                });
                _this.defaultItem = _this.container.querySelector(".ql-selected");
                _this.selectItem(_this.defaultItem);
                return _this;
              }
              _createClass(IconPicker2, [{
                key: "selectItem",
                value: function selectItem(item, trigger) {
                  _get(IconPicker2.prototype.__proto__ || Object.getPrototypeOf(IconPicker2.prototype), "selectItem", this).call(this, item, trigger);
                  item = item || this.defaultItem;
                  this.label.innerHTML = item.innerHTML;
                }
              }]);
              return IconPicker2;
            }(_picker2.default);
            exports2.default = IconPicker;
          },
          /* 61 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            var _createClass = /* @__PURE__ */ function() {
              function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
                }
              }
              return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
              };
            }();
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            var Tooltip = function() {
              function Tooltip2(quill, boundsContainer) {
                var _this = this;
                _classCallCheck(this, Tooltip2);
                this.quill = quill;
                this.boundsContainer = boundsContainer || document.body;
                this.root = quill.addContainer("ql-tooltip");
                this.root.innerHTML = this.constructor.TEMPLATE;
                if (this.quill.root === this.quill.scrollingContainer) {
                  this.quill.root.addEventListener("scroll", function() {
                    _this.root.style.marginTop = -1 * _this.quill.root.scrollTop + "px";
                  });
                }
                this.hide();
              }
              _createClass(Tooltip2, [{
                key: "hide",
                value: function hide() {
                  this.root.classList.add("ql-hidden");
                }
              }, {
                key: "position",
                value: function position(reference) {
                  var left = reference.left + reference.width / 2 - this.root.offsetWidth / 2;
                  var top = reference.bottom + this.quill.root.scrollTop;
                  this.root.style.left = left + "px";
                  this.root.style.top = top + "px";
                  this.root.classList.remove("ql-flip");
                  var containerBounds = this.boundsContainer.getBoundingClientRect();
                  var rootBounds = this.root.getBoundingClientRect();
                  var shift = 0;
                  if (rootBounds.right > containerBounds.right) {
                    shift = containerBounds.right - rootBounds.right;
                    this.root.style.left = left + shift + "px";
                  }
                  if (rootBounds.left < containerBounds.left) {
                    shift = containerBounds.left - rootBounds.left;
                    this.root.style.left = left + shift + "px";
                  }
                  if (rootBounds.bottom > containerBounds.bottom) {
                    var height = rootBounds.bottom - rootBounds.top;
                    var verticalShift = reference.bottom - reference.top + height;
                    this.root.style.top = top - verticalShift + "px";
                    this.root.classList.add("ql-flip");
                  }
                  return shift;
                }
              }, {
                key: "show",
                value: function show() {
                  this.root.classList.remove("ql-editing");
                  this.root.classList.remove("ql-hidden");
                }
              }]);
              return Tooltip2;
            }();
            exports2.default = Tooltip;
          },
          /* 62 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            var _slicedToArray = /* @__PURE__ */ function() {
              function sliceIterator(arr, i) {
                var _arr = [];
                var _n = true;
                var _d = false;
                var _e = void 0;
                try {
                  for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);
                    if (i && _arr.length === i) break;
                  }
                } catch (err) {
                  _d = true;
                  _e = err;
                } finally {
                  try {
                    if (!_n && _i["return"]) _i["return"]();
                  } finally {
                    if (_d) throw _e;
                  }
                }
                return _arr;
              }
              return function(arr, i) {
                if (Array.isArray(arr)) {
                  return arr;
                } else if (Symbol.iterator in Object(arr)) {
                  return sliceIterator(arr, i);
                } else {
                  throw new TypeError("Invalid attempt to destructure non-iterable instance");
                }
              };
            }();
            var _get = function get(object, property, receiver) {
              if (object === null) object = Function.prototype;
              var desc = Object.getOwnPropertyDescriptor(object, property);
              if (desc === void 0) {
                var parent = Object.getPrototypeOf(object);
                if (parent === null) {
                  return void 0;
                } else {
                  return get(parent, property, receiver);
                }
              } else if ("value" in desc) {
                return desc.value;
              } else {
                var getter = desc.get;
                if (getter === void 0) {
                  return void 0;
                }
                return getter.call(receiver);
              }
            };
            var _createClass = /* @__PURE__ */ function() {
              function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
                }
              }
              return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
              };
            }();
            var _extend = __webpack_require__(3);
            var _extend2 = _interopRequireDefault(_extend);
            var _emitter = __webpack_require__(8);
            var _emitter2 = _interopRequireDefault(_emitter);
            var _base = __webpack_require__(43);
            var _base2 = _interopRequireDefault(_base);
            var _link = __webpack_require__(27);
            var _link2 = _interopRequireDefault(_link);
            var _selection = __webpack_require__(15);
            var _icons = __webpack_require__(41);
            var _icons2 = _interopRequireDefault(_icons);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            function _possibleConstructorReturn(self2, call) {
              if (!self2) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              }
              return call && (typeof call === "object" || typeof call === "function") ? call : self2;
            }
            function _inherits(subClass, superClass) {
              if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
              }
              subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
              if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            var TOOLBAR_CONFIG = [[{ header: ["1", "2", "3", false] }], ["bold", "italic", "underline", "link"], [{ list: "ordered" }, { list: "bullet" }], ["clean"]];
            var SnowTheme = function(_BaseTheme) {
              _inherits(SnowTheme2, _BaseTheme);
              function SnowTheme2(quill, options) {
                _classCallCheck(this, SnowTheme2);
                if (options.modules.toolbar != null && options.modules.toolbar.container == null) {
                  options.modules.toolbar.container = TOOLBAR_CONFIG;
                }
                var _this = _possibleConstructorReturn(this, (SnowTheme2.__proto__ || Object.getPrototypeOf(SnowTheme2)).call(this, quill, options));
                _this.quill.container.classList.add("ql-snow");
                return _this;
              }
              _createClass(SnowTheme2, [{
                key: "extendToolbar",
                value: function extendToolbar(toolbar) {
                  toolbar.container.classList.add("ql-snow");
                  this.buildButtons([].slice.call(toolbar.container.querySelectorAll("button")), _icons2.default);
                  this.buildPickers([].slice.call(toolbar.container.querySelectorAll("select")), _icons2.default);
                  this.tooltip = new SnowTooltip(this.quill, this.options.bounds);
                  if (toolbar.container.querySelector(".ql-link")) {
                    this.quill.keyboard.addBinding({ key: "K", shortKey: true }, function(range, context) {
                      toolbar.handlers["link"].call(toolbar, !context.format.link);
                    });
                  }
                }
              }]);
              return SnowTheme2;
            }(_base2.default);
            SnowTheme.DEFAULTS = (0, _extend2.default)(true, {}, _base2.default.DEFAULTS, {
              modules: {
                toolbar: {
                  handlers: {
                    link: function link(value) {
                      if (value) {
                        var range = this.quill.getSelection();
                        if (range == null || range.length == 0) return;
                        var preview = this.quill.getText(range);
                        if (/^\S+@\S+\.\S+$/.test(preview) && preview.indexOf("mailto:") !== 0) {
                          preview = "mailto:" + preview;
                        }
                        var tooltip = this.quill.theme.tooltip;
                        tooltip.edit("link", preview);
                      } else {
                        this.quill.format("link", false);
                      }
                    }
                  }
                }
              }
            });
            var SnowTooltip = function(_BaseTooltip) {
              _inherits(SnowTooltip2, _BaseTooltip);
              function SnowTooltip2(quill, bounds) {
                _classCallCheck(this, SnowTooltip2);
                var _this2 = _possibleConstructorReturn(this, (SnowTooltip2.__proto__ || Object.getPrototypeOf(SnowTooltip2)).call(this, quill, bounds));
                _this2.preview = _this2.root.querySelector("a.ql-preview");
                return _this2;
              }
              _createClass(SnowTooltip2, [{
                key: "listen",
                value: function listen() {
                  var _this3 = this;
                  _get(SnowTooltip2.prototype.__proto__ || Object.getPrototypeOf(SnowTooltip2.prototype), "listen", this).call(this);
                  this.root.querySelector("a.ql-action").addEventListener("click", function(event) {
                    if (_this3.root.classList.contains("ql-editing")) {
                      _this3.save();
                    } else {
                      _this3.edit("link", _this3.preview.textContent);
                    }
                    event.preventDefault();
                  });
                  this.root.querySelector("a.ql-remove").addEventListener("click", function(event) {
                    if (_this3.linkRange != null) {
                      var range = _this3.linkRange;
                      _this3.restoreFocus();
                      _this3.quill.formatText(range, "link", false, _emitter2.default.sources.USER);
                      delete _this3.linkRange;
                    }
                    event.preventDefault();
                    _this3.hide();
                  });
                  this.quill.on(_emitter2.default.events.SELECTION_CHANGE, function(range, oldRange, source) {
                    if (range == null) return;
                    if (range.length === 0 && source === _emitter2.default.sources.USER) {
                      var _quill$scroll$descend = _this3.quill.scroll.descendant(_link2.default, range.index), _quill$scroll$descend2 = _slicedToArray(_quill$scroll$descend, 2), link = _quill$scroll$descend2[0], offset = _quill$scroll$descend2[1];
                      if (link != null) {
                        _this3.linkRange = new _selection.Range(range.index - offset, link.length());
                        var preview = _link2.default.formats(link.domNode);
                        _this3.preview.textContent = preview;
                        _this3.preview.setAttribute("href", preview);
                        _this3.show();
                        _this3.position(_this3.quill.getBounds(_this3.linkRange));
                        return;
                      }
                    } else {
                      delete _this3.linkRange;
                    }
                    _this3.hide();
                  });
                }
              }, {
                key: "show",
                value: function show() {
                  _get(SnowTooltip2.prototype.__proto__ || Object.getPrototypeOf(SnowTooltip2.prototype), "show", this).call(this);
                  this.root.removeAttribute("data-mode");
                }
              }]);
              return SnowTooltip2;
            }(_base.BaseTooltip);
            SnowTooltip.TEMPLATE = ['<a class="ql-preview" rel="noopener noreferrer" target="_blank" href="about:blank"></a>', '<input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">', '<a class="ql-action"></a>', '<a class="ql-remove"></a>'].join("");
            exports2.default = SnowTheme;
          },
          /* 63 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            var _core = __webpack_require__(29);
            var _core2 = _interopRequireDefault(_core);
            var _align = __webpack_require__(36);
            var _direction = __webpack_require__(38);
            var _indent = __webpack_require__(64);
            var _blockquote = __webpack_require__(65);
            var _blockquote2 = _interopRequireDefault(_blockquote);
            var _header = __webpack_require__(66);
            var _header2 = _interopRequireDefault(_header);
            var _list = __webpack_require__(67);
            var _list2 = _interopRequireDefault(_list);
            var _background = __webpack_require__(37);
            var _color = __webpack_require__(26);
            var _font = __webpack_require__(39);
            var _size = __webpack_require__(40);
            var _bold = __webpack_require__(56);
            var _bold2 = _interopRequireDefault(_bold);
            var _italic = __webpack_require__(68);
            var _italic2 = _interopRequireDefault(_italic);
            var _link = __webpack_require__(27);
            var _link2 = _interopRequireDefault(_link);
            var _script = __webpack_require__(69);
            var _script2 = _interopRequireDefault(_script);
            var _strike = __webpack_require__(70);
            var _strike2 = _interopRequireDefault(_strike);
            var _underline = __webpack_require__(71);
            var _underline2 = _interopRequireDefault(_underline);
            var _image = __webpack_require__(72);
            var _image2 = _interopRequireDefault(_image);
            var _video = __webpack_require__(73);
            var _video2 = _interopRequireDefault(_video);
            var _code = __webpack_require__(13);
            var _code2 = _interopRequireDefault(_code);
            var _formula = __webpack_require__(74);
            var _formula2 = _interopRequireDefault(_formula);
            var _syntax = __webpack_require__(75);
            var _syntax2 = _interopRequireDefault(_syntax);
            var _toolbar = __webpack_require__(57);
            var _toolbar2 = _interopRequireDefault(_toolbar);
            var _icons = __webpack_require__(41);
            var _icons2 = _interopRequireDefault(_icons);
            var _picker = __webpack_require__(28);
            var _picker2 = _interopRequireDefault(_picker);
            var _colorPicker = __webpack_require__(59);
            var _colorPicker2 = _interopRequireDefault(_colorPicker);
            var _iconPicker = __webpack_require__(60);
            var _iconPicker2 = _interopRequireDefault(_iconPicker);
            var _tooltip = __webpack_require__(61);
            var _tooltip2 = _interopRequireDefault(_tooltip);
            var _bubble = __webpack_require__(108);
            var _bubble2 = _interopRequireDefault(_bubble);
            var _snow = __webpack_require__(62);
            var _snow2 = _interopRequireDefault(_snow);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            _core2.default.register({
              "attributors/attribute/direction": _direction.DirectionAttribute,
              "attributors/class/align": _align.AlignClass,
              "attributors/class/background": _background.BackgroundClass,
              "attributors/class/color": _color.ColorClass,
              "attributors/class/direction": _direction.DirectionClass,
              "attributors/class/font": _font.FontClass,
              "attributors/class/size": _size.SizeClass,
              "attributors/style/align": _align.AlignStyle,
              "attributors/style/background": _background.BackgroundStyle,
              "attributors/style/color": _color.ColorStyle,
              "attributors/style/direction": _direction.DirectionStyle,
              "attributors/style/font": _font.FontStyle,
              "attributors/style/size": _size.SizeStyle
            }, true);
            _core2.default.register({
              "formats/align": _align.AlignClass,
              "formats/direction": _direction.DirectionClass,
              "formats/indent": _indent.IndentClass,
              "formats/background": _background.BackgroundStyle,
              "formats/color": _color.ColorStyle,
              "formats/font": _font.FontClass,
              "formats/size": _size.SizeClass,
              "formats/blockquote": _blockquote2.default,
              "formats/code-block": _code2.default,
              "formats/header": _header2.default,
              "formats/list": _list2.default,
              "formats/bold": _bold2.default,
              "formats/code": _code.Code,
              "formats/italic": _italic2.default,
              "formats/link": _link2.default,
              "formats/script": _script2.default,
              "formats/strike": _strike2.default,
              "formats/underline": _underline2.default,
              "formats/image": _image2.default,
              "formats/video": _video2.default,
              "formats/list/item": _list.ListItem,
              "modules/formula": _formula2.default,
              "modules/syntax": _syntax2.default,
              "modules/toolbar": _toolbar2.default,
              "themes/bubble": _bubble2.default,
              "themes/snow": _snow2.default,
              "ui/icons": _icons2.default,
              "ui/picker": _picker2.default,
              "ui/icon-picker": _iconPicker2.default,
              "ui/color-picker": _colorPicker2.default,
              "ui/tooltip": _tooltip2.default
            }, true);
            exports2.default = _core2.default;
          },
          /* 64 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            exports2.IndentClass = void 0;
            var _createClass = /* @__PURE__ */ function() {
              function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
                }
              }
              return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
              };
            }();
            var _get = function get(object, property, receiver) {
              if (object === null) object = Function.prototype;
              var desc = Object.getOwnPropertyDescriptor(object, property);
              if (desc === void 0) {
                var parent = Object.getPrototypeOf(object);
                if (parent === null) {
                  return void 0;
                } else {
                  return get(parent, property, receiver);
                }
              } else if ("value" in desc) {
                return desc.value;
              } else {
                var getter = desc.get;
                if (getter === void 0) {
                  return void 0;
                }
                return getter.call(receiver);
              }
            };
            var _parchment = __webpack_require__(0);
            var _parchment2 = _interopRequireDefault(_parchment);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            function _possibleConstructorReturn(self2, call) {
              if (!self2) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              }
              return call && (typeof call === "object" || typeof call === "function") ? call : self2;
            }
            function _inherits(subClass, superClass) {
              if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
              }
              subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
              if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            var IdentAttributor = function(_Parchment$Attributor) {
              _inherits(IdentAttributor2, _Parchment$Attributor);
              function IdentAttributor2() {
                _classCallCheck(this, IdentAttributor2);
                return _possibleConstructorReturn(this, (IdentAttributor2.__proto__ || Object.getPrototypeOf(IdentAttributor2)).apply(this, arguments));
              }
              _createClass(IdentAttributor2, [{
                key: "add",
                value: function add(node, value) {
                  if (value === "+1" || value === "-1") {
                    var indent = this.value(node) || 0;
                    value = value === "+1" ? indent + 1 : indent - 1;
                  }
                  if (value === 0) {
                    this.remove(node);
                    return true;
                  } else {
                    return _get(IdentAttributor2.prototype.__proto__ || Object.getPrototypeOf(IdentAttributor2.prototype), "add", this).call(this, node, value);
                  }
                }
              }, {
                key: "canAdd",
                value: function canAdd(node, value) {
                  return _get(IdentAttributor2.prototype.__proto__ || Object.getPrototypeOf(IdentAttributor2.prototype), "canAdd", this).call(this, node, value) || _get(IdentAttributor2.prototype.__proto__ || Object.getPrototypeOf(IdentAttributor2.prototype), "canAdd", this).call(this, node, parseInt(value));
                }
              }, {
                key: "value",
                value: function value(node) {
                  return parseInt(_get(IdentAttributor2.prototype.__proto__ || Object.getPrototypeOf(IdentAttributor2.prototype), "value", this).call(this, node)) || void 0;
                }
              }]);
              return IdentAttributor2;
            }(_parchment2.default.Attributor.Class);
            var IndentClass = new IdentAttributor("indent", "ql-indent", {
              scope: _parchment2.default.Scope.BLOCK,
              whitelist: [1, 2, 3, 4, 5, 6, 7, 8]
            });
            exports2.IndentClass = IndentClass;
          },
          /* 65 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            var _block = __webpack_require__(4);
            var _block2 = _interopRequireDefault(_block);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            function _possibleConstructorReturn(self2, call) {
              if (!self2) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              }
              return call && (typeof call === "object" || typeof call === "function") ? call : self2;
            }
            function _inherits(subClass, superClass) {
              if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
              }
              subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
              if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            var Blockquote = function(_Block) {
              _inherits(Blockquote2, _Block);
              function Blockquote2() {
                _classCallCheck(this, Blockquote2);
                return _possibleConstructorReturn(this, (Blockquote2.__proto__ || Object.getPrototypeOf(Blockquote2)).apply(this, arguments));
              }
              return Blockquote2;
            }(_block2.default);
            Blockquote.blotName = "blockquote";
            Blockquote.tagName = "blockquote";
            exports2.default = Blockquote;
          },
          /* 66 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            var _createClass = /* @__PURE__ */ function() {
              function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
                }
              }
              return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
              };
            }();
            var _block = __webpack_require__(4);
            var _block2 = _interopRequireDefault(_block);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            function _possibleConstructorReturn(self2, call) {
              if (!self2) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              }
              return call && (typeof call === "object" || typeof call === "function") ? call : self2;
            }
            function _inherits(subClass, superClass) {
              if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
              }
              subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
              if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            var Header = function(_Block) {
              _inherits(Header2, _Block);
              function Header2() {
                _classCallCheck(this, Header2);
                return _possibleConstructorReturn(this, (Header2.__proto__ || Object.getPrototypeOf(Header2)).apply(this, arguments));
              }
              _createClass(Header2, null, [{
                key: "formats",
                value: function formats(domNode) {
                  return this.tagName.indexOf(domNode.tagName) + 1;
                }
              }]);
              return Header2;
            }(_block2.default);
            Header.blotName = "header";
            Header.tagName = ["H1", "H2", "H3", "H4", "H5", "H6"];
            exports2.default = Header;
          },
          /* 67 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            exports2.default = exports2.ListItem = void 0;
            var _createClass = /* @__PURE__ */ function() {
              function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
                }
              }
              return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
              };
            }();
            var _get = function get(object, property, receiver) {
              if (object === null) object = Function.prototype;
              var desc = Object.getOwnPropertyDescriptor(object, property);
              if (desc === void 0) {
                var parent = Object.getPrototypeOf(object);
                if (parent === null) {
                  return void 0;
                } else {
                  return get(parent, property, receiver);
                }
              } else if ("value" in desc) {
                return desc.value;
              } else {
                var getter = desc.get;
                if (getter === void 0) {
                  return void 0;
                }
                return getter.call(receiver);
              }
            };
            var _parchment = __webpack_require__(0);
            var _parchment2 = _interopRequireDefault(_parchment);
            var _block = __webpack_require__(4);
            var _block2 = _interopRequireDefault(_block);
            var _container = __webpack_require__(25);
            var _container2 = _interopRequireDefault(_container);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            function _defineProperty(obj, key, value) {
              if (key in obj) {
                Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
              } else {
                obj[key] = value;
              }
              return obj;
            }
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            function _possibleConstructorReturn(self2, call) {
              if (!self2) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              }
              return call && (typeof call === "object" || typeof call === "function") ? call : self2;
            }
            function _inherits(subClass, superClass) {
              if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
              }
              subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
              if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            var ListItem = function(_Block) {
              _inherits(ListItem2, _Block);
              function ListItem2() {
                _classCallCheck(this, ListItem2);
                return _possibleConstructorReturn(this, (ListItem2.__proto__ || Object.getPrototypeOf(ListItem2)).apply(this, arguments));
              }
              _createClass(ListItem2, [{
                key: "format",
                value: function format(name, value) {
                  if (name === List.blotName && !value) {
                    this.replaceWith(_parchment2.default.create(this.statics.scope));
                  } else {
                    _get(ListItem2.prototype.__proto__ || Object.getPrototypeOf(ListItem2.prototype), "format", this).call(this, name, value);
                  }
                }
              }, {
                key: "remove",
                value: function remove() {
                  if (this.prev == null && this.next == null) {
                    this.parent.remove();
                  } else {
                    _get(ListItem2.prototype.__proto__ || Object.getPrototypeOf(ListItem2.prototype), "remove", this).call(this);
                  }
                }
              }, {
                key: "replaceWith",
                value: function replaceWith(name, value) {
                  this.parent.isolate(this.offset(this.parent), this.length());
                  if (name === this.parent.statics.blotName) {
                    this.parent.replaceWith(name, value);
                    return this;
                  } else {
                    this.parent.unwrap();
                    return _get(ListItem2.prototype.__proto__ || Object.getPrototypeOf(ListItem2.prototype), "replaceWith", this).call(this, name, value);
                  }
                }
              }], [{
                key: "formats",
                value: function formats(domNode) {
                  return domNode.tagName === this.tagName ? void 0 : _get(ListItem2.__proto__ || Object.getPrototypeOf(ListItem2), "formats", this).call(this, domNode);
                }
              }]);
              return ListItem2;
            }(_block2.default);
            ListItem.blotName = "list-item";
            ListItem.tagName = "LI";
            var List = function(_Container) {
              _inherits(List2, _Container);
              _createClass(List2, null, [{
                key: "create",
                value: function create(value) {
                  var tagName = value === "ordered" ? "OL" : "UL";
                  var node = _get(List2.__proto__ || Object.getPrototypeOf(List2), "create", this).call(this, tagName);
                  if (value === "checked" || value === "unchecked") {
                    node.setAttribute("data-checked", value === "checked");
                  }
                  return node;
                }
              }, {
                key: "formats",
                value: function formats(domNode) {
                  if (domNode.tagName === "OL") return "ordered";
                  if (domNode.tagName === "UL") {
                    if (domNode.hasAttribute("data-checked")) {
                      return domNode.getAttribute("data-checked") === "true" ? "checked" : "unchecked";
                    } else {
                      return "bullet";
                    }
                  }
                  return void 0;
                }
              }]);
              function List2(domNode) {
                _classCallCheck(this, List2);
                var _this2 = _possibleConstructorReturn(this, (List2.__proto__ || Object.getPrototypeOf(List2)).call(this, domNode));
                var listEventHandler = function listEventHandler2(e) {
                  if (e.target.parentNode !== domNode) return;
                  var format = _this2.statics.formats(domNode);
                  var blot = _parchment2.default.find(e.target);
                  if (format === "checked") {
                    blot.format("list", "unchecked");
                  } else if (format === "unchecked") {
                    blot.format("list", "checked");
                  }
                };
                domNode.addEventListener("touchstart", listEventHandler);
                domNode.addEventListener("mousedown", listEventHandler);
                return _this2;
              }
              _createClass(List2, [{
                key: "format",
                value: function format(name, value) {
                  if (this.children.length > 0) {
                    this.children.tail.format(name, value);
                  }
                }
              }, {
                key: "formats",
                value: function formats() {
                  return _defineProperty({}, this.statics.blotName, this.statics.formats(this.domNode));
                }
              }, {
                key: "insertBefore",
                value: function insertBefore(blot, ref) {
                  if (blot instanceof ListItem) {
                    _get(List2.prototype.__proto__ || Object.getPrototypeOf(List2.prototype), "insertBefore", this).call(this, blot, ref);
                  } else {
                    var index = ref == null ? this.length() : ref.offset(this);
                    var after = this.split(index);
                    after.parent.insertBefore(blot, after);
                  }
                }
              }, {
                key: "optimize",
                value: function optimize(context) {
                  _get(List2.prototype.__proto__ || Object.getPrototypeOf(List2.prototype), "optimize", this).call(this, context);
                  var next = this.next;
                  if (next != null && next.prev === this && next.statics.blotName === this.statics.blotName && next.domNode.tagName === this.domNode.tagName && next.domNode.getAttribute("data-checked") === this.domNode.getAttribute("data-checked")) {
                    next.moveChildren(this);
                    next.remove();
                  }
                }
              }, {
                key: "replace",
                value: function replace(target) {
                  if (target.statics.blotName !== this.statics.blotName) {
                    var item = _parchment2.default.create(this.statics.defaultChild);
                    target.moveChildren(item);
                    this.appendChild(item);
                  }
                  _get(List2.prototype.__proto__ || Object.getPrototypeOf(List2.prototype), "replace", this).call(this, target);
                }
              }]);
              return List2;
            }(_container2.default);
            List.blotName = "list";
            List.scope = _parchment2.default.Scope.BLOCK_BLOT;
            List.tagName = ["OL", "UL"];
            List.defaultChild = "list-item";
            List.allowedChildren = [ListItem];
            exports2.ListItem = ListItem;
            exports2.default = List;
          },
          /* 68 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            var _bold = __webpack_require__(56);
            var _bold2 = _interopRequireDefault(_bold);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            function _possibleConstructorReturn(self2, call) {
              if (!self2) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              }
              return call && (typeof call === "object" || typeof call === "function") ? call : self2;
            }
            function _inherits(subClass, superClass) {
              if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
              }
              subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
              if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            var Italic = function(_Bold) {
              _inherits(Italic2, _Bold);
              function Italic2() {
                _classCallCheck(this, Italic2);
                return _possibleConstructorReturn(this, (Italic2.__proto__ || Object.getPrototypeOf(Italic2)).apply(this, arguments));
              }
              return Italic2;
            }(_bold2.default);
            Italic.blotName = "italic";
            Italic.tagName = ["EM", "I"];
            exports2.default = Italic;
          },
          /* 69 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            var _createClass = /* @__PURE__ */ function() {
              function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
                }
              }
              return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
              };
            }();
            var _get = function get(object, property, receiver) {
              if (object === null) object = Function.prototype;
              var desc = Object.getOwnPropertyDescriptor(object, property);
              if (desc === void 0) {
                var parent = Object.getPrototypeOf(object);
                if (parent === null) {
                  return void 0;
                } else {
                  return get(parent, property, receiver);
                }
              } else if ("value" in desc) {
                return desc.value;
              } else {
                var getter = desc.get;
                if (getter === void 0) {
                  return void 0;
                }
                return getter.call(receiver);
              }
            };
            var _inline = __webpack_require__(6);
            var _inline2 = _interopRequireDefault(_inline);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            function _possibleConstructorReturn(self2, call) {
              if (!self2) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              }
              return call && (typeof call === "object" || typeof call === "function") ? call : self2;
            }
            function _inherits(subClass, superClass) {
              if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
              }
              subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
              if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            var Script = function(_Inline) {
              _inherits(Script2, _Inline);
              function Script2() {
                _classCallCheck(this, Script2);
                return _possibleConstructorReturn(this, (Script2.__proto__ || Object.getPrototypeOf(Script2)).apply(this, arguments));
              }
              _createClass(Script2, null, [{
                key: "create",
                value: function create(value) {
                  if (value === "super") {
                    return document.createElement("sup");
                  } else if (value === "sub") {
                    return document.createElement("sub");
                  } else {
                    return _get(Script2.__proto__ || Object.getPrototypeOf(Script2), "create", this).call(this, value);
                  }
                }
              }, {
                key: "formats",
                value: function formats(domNode) {
                  if (domNode.tagName === "SUB") return "sub";
                  if (domNode.tagName === "SUP") return "super";
                  return void 0;
                }
              }]);
              return Script2;
            }(_inline2.default);
            Script.blotName = "script";
            Script.tagName = ["SUB", "SUP"];
            exports2.default = Script;
          },
          /* 70 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            var _inline = __webpack_require__(6);
            var _inline2 = _interopRequireDefault(_inline);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            function _possibleConstructorReturn(self2, call) {
              if (!self2) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              }
              return call && (typeof call === "object" || typeof call === "function") ? call : self2;
            }
            function _inherits(subClass, superClass) {
              if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
              }
              subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
              if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            var Strike = function(_Inline) {
              _inherits(Strike2, _Inline);
              function Strike2() {
                _classCallCheck(this, Strike2);
                return _possibleConstructorReturn(this, (Strike2.__proto__ || Object.getPrototypeOf(Strike2)).apply(this, arguments));
              }
              return Strike2;
            }(_inline2.default);
            Strike.blotName = "strike";
            Strike.tagName = "S";
            exports2.default = Strike;
          },
          /* 71 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            var _inline = __webpack_require__(6);
            var _inline2 = _interopRequireDefault(_inline);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            function _possibleConstructorReturn(self2, call) {
              if (!self2) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              }
              return call && (typeof call === "object" || typeof call === "function") ? call : self2;
            }
            function _inherits(subClass, superClass) {
              if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
              }
              subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
              if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            var Underline = function(_Inline) {
              _inherits(Underline2, _Inline);
              function Underline2() {
                _classCallCheck(this, Underline2);
                return _possibleConstructorReturn(this, (Underline2.__proto__ || Object.getPrototypeOf(Underline2)).apply(this, arguments));
              }
              return Underline2;
            }(_inline2.default);
            Underline.blotName = "underline";
            Underline.tagName = "U";
            exports2.default = Underline;
          },
          /* 72 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            var _createClass = /* @__PURE__ */ function() {
              function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
                }
              }
              return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
              };
            }();
            var _get = function get(object, property, receiver) {
              if (object === null) object = Function.prototype;
              var desc = Object.getOwnPropertyDescriptor(object, property);
              if (desc === void 0) {
                var parent = Object.getPrototypeOf(object);
                if (parent === null) {
                  return void 0;
                } else {
                  return get(parent, property, receiver);
                }
              } else if ("value" in desc) {
                return desc.value;
              } else {
                var getter = desc.get;
                if (getter === void 0) {
                  return void 0;
                }
                return getter.call(receiver);
              }
            };
            var _parchment = __webpack_require__(0);
            var _parchment2 = _interopRequireDefault(_parchment);
            var _link = __webpack_require__(27);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            function _possibleConstructorReturn(self2, call) {
              if (!self2) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              }
              return call && (typeof call === "object" || typeof call === "function") ? call : self2;
            }
            function _inherits(subClass, superClass) {
              if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
              }
              subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
              if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            var ATTRIBUTES = ["alt", "height", "width"];
            var Image = function(_Parchment$Embed) {
              _inherits(Image2, _Parchment$Embed);
              function Image2() {
                _classCallCheck(this, Image2);
                return _possibleConstructorReturn(this, (Image2.__proto__ || Object.getPrototypeOf(Image2)).apply(this, arguments));
              }
              _createClass(Image2, [{
                key: "format",
                value: function format(name, value) {
                  if (ATTRIBUTES.indexOf(name) > -1) {
                    if (value) {
                      this.domNode.setAttribute(name, value);
                    } else {
                      this.domNode.removeAttribute(name);
                    }
                  } else {
                    _get(Image2.prototype.__proto__ || Object.getPrototypeOf(Image2.prototype), "format", this).call(this, name, value);
                  }
                }
              }], [{
                key: "create",
                value: function create(value) {
                  var node = _get(Image2.__proto__ || Object.getPrototypeOf(Image2), "create", this).call(this, value);
                  if (typeof value === "string") {
                    node.setAttribute("src", this.sanitize(value));
                  }
                  return node;
                }
              }, {
                key: "formats",
                value: function formats(domNode) {
                  return ATTRIBUTES.reduce(function(formats2, attribute) {
                    if (domNode.hasAttribute(attribute)) {
                      formats2[attribute] = domNode.getAttribute(attribute);
                    }
                    return formats2;
                  }, {});
                }
              }, {
                key: "match",
                value: function match(url) {
                  return /\.(jpe?g|gif|png)$/.test(url) || /^data:image\/.+;base64/.test(url);
                }
              }, {
                key: "sanitize",
                value: function sanitize(url) {
                  return (0, _link.sanitize)(url, ["http", "https", "data"]) ? url : "//:0";
                }
              }, {
                key: "value",
                value: function value(domNode) {
                  return domNode.getAttribute("src");
                }
              }]);
              return Image2;
            }(_parchment2.default.Embed);
            Image.blotName = "image";
            Image.tagName = "IMG";
            exports2.default = Image;
          },
          /* 73 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            var _createClass = /* @__PURE__ */ function() {
              function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
                }
              }
              return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
              };
            }();
            var _get = function get(object, property, receiver) {
              if (object === null) object = Function.prototype;
              var desc = Object.getOwnPropertyDescriptor(object, property);
              if (desc === void 0) {
                var parent = Object.getPrototypeOf(object);
                if (parent === null) {
                  return void 0;
                } else {
                  return get(parent, property, receiver);
                }
              } else if ("value" in desc) {
                return desc.value;
              } else {
                var getter = desc.get;
                if (getter === void 0) {
                  return void 0;
                }
                return getter.call(receiver);
              }
            };
            var _block = __webpack_require__(4);
            var _link = __webpack_require__(27);
            var _link2 = _interopRequireDefault(_link);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            function _possibleConstructorReturn(self2, call) {
              if (!self2) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              }
              return call && (typeof call === "object" || typeof call === "function") ? call : self2;
            }
            function _inherits(subClass, superClass) {
              if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
              }
              subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
              if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            var ATTRIBUTES = ["height", "width"];
            var Video = function(_BlockEmbed) {
              _inherits(Video2, _BlockEmbed);
              function Video2() {
                _classCallCheck(this, Video2);
                return _possibleConstructorReturn(this, (Video2.__proto__ || Object.getPrototypeOf(Video2)).apply(this, arguments));
              }
              _createClass(Video2, [{
                key: "format",
                value: function format(name, value) {
                  if (ATTRIBUTES.indexOf(name) > -1) {
                    if (value) {
                      this.domNode.setAttribute(name, value);
                    } else {
                      this.domNode.removeAttribute(name);
                    }
                  } else {
                    _get(Video2.prototype.__proto__ || Object.getPrototypeOf(Video2.prototype), "format", this).call(this, name, value);
                  }
                }
              }], [{
                key: "create",
                value: function create(value) {
                  var node = _get(Video2.__proto__ || Object.getPrototypeOf(Video2), "create", this).call(this, value);
                  node.setAttribute("frameborder", "0");
                  node.setAttribute("allowfullscreen", true);
                  node.setAttribute("src", this.sanitize(value));
                  return node;
                }
              }, {
                key: "formats",
                value: function formats(domNode) {
                  return ATTRIBUTES.reduce(function(formats2, attribute) {
                    if (domNode.hasAttribute(attribute)) {
                      formats2[attribute] = domNode.getAttribute(attribute);
                    }
                    return formats2;
                  }, {});
                }
              }, {
                key: "sanitize",
                value: function sanitize(url) {
                  return _link2.default.sanitize(url);
                }
              }, {
                key: "value",
                value: function value(domNode) {
                  return domNode.getAttribute("src");
                }
              }]);
              return Video2;
            }(_block.BlockEmbed);
            Video.blotName = "video";
            Video.className = "ql-video";
            Video.tagName = "IFRAME";
            exports2.default = Video;
          },
          /* 74 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            exports2.default = exports2.FormulaBlot = void 0;
            var _createClass = /* @__PURE__ */ function() {
              function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
                }
              }
              return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
              };
            }();
            var _get = function get(object, property, receiver) {
              if (object === null) object = Function.prototype;
              var desc = Object.getOwnPropertyDescriptor(object, property);
              if (desc === void 0) {
                var parent = Object.getPrototypeOf(object);
                if (parent === null) {
                  return void 0;
                } else {
                  return get(parent, property, receiver);
                }
              } else if ("value" in desc) {
                return desc.value;
              } else {
                var getter = desc.get;
                if (getter === void 0) {
                  return void 0;
                }
                return getter.call(receiver);
              }
            };
            var _embed = __webpack_require__(35);
            var _embed2 = _interopRequireDefault(_embed);
            var _quill = __webpack_require__(5);
            var _quill2 = _interopRequireDefault(_quill);
            var _module = __webpack_require__(9);
            var _module2 = _interopRequireDefault(_module);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            function _possibleConstructorReturn(self2, call) {
              if (!self2) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              }
              return call && (typeof call === "object" || typeof call === "function") ? call : self2;
            }
            function _inherits(subClass, superClass) {
              if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
              }
              subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
              if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            var FormulaBlot = function(_Embed) {
              _inherits(FormulaBlot2, _Embed);
              function FormulaBlot2() {
                _classCallCheck(this, FormulaBlot2);
                return _possibleConstructorReturn(this, (FormulaBlot2.__proto__ || Object.getPrototypeOf(FormulaBlot2)).apply(this, arguments));
              }
              _createClass(FormulaBlot2, null, [{
                key: "create",
                value: function create(value) {
                  var node = _get(FormulaBlot2.__proto__ || Object.getPrototypeOf(FormulaBlot2), "create", this).call(this, value);
                  if (typeof value === "string") {
                    window.katex.render(value, node, {
                      throwOnError: false,
                      errorColor: "#f00"
                    });
                    node.setAttribute("data-value", value);
                  }
                  return node;
                }
              }, {
                key: "value",
                value: function value(domNode) {
                  return domNode.getAttribute("data-value");
                }
              }]);
              return FormulaBlot2;
            }(_embed2.default);
            FormulaBlot.blotName = "formula";
            FormulaBlot.className = "ql-formula";
            FormulaBlot.tagName = "SPAN";
            var Formula = function(_Module) {
              _inherits(Formula2, _Module);
              _createClass(Formula2, null, [{
                key: "register",
                value: function register() {
                  _quill2.default.register(FormulaBlot, true);
                }
              }]);
              function Formula2() {
                _classCallCheck(this, Formula2);
                var _this2 = _possibleConstructorReturn(this, (Formula2.__proto__ || Object.getPrototypeOf(Formula2)).call(this));
                if (window.katex == null) {
                  throw new Error("Formula module requires KaTeX.");
                }
                return _this2;
              }
              return Formula2;
            }(_module2.default);
            exports2.FormulaBlot = FormulaBlot;
            exports2.default = Formula;
          },
          /* 75 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            exports2.default = exports2.CodeToken = exports2.CodeBlock = void 0;
            var _createClass = /* @__PURE__ */ function() {
              function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
                }
              }
              return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
              };
            }();
            var _get = function get(object, property, receiver) {
              if (object === null) object = Function.prototype;
              var desc = Object.getOwnPropertyDescriptor(object, property);
              if (desc === void 0) {
                var parent = Object.getPrototypeOf(object);
                if (parent === null) {
                  return void 0;
                } else {
                  return get(parent, property, receiver);
                }
              } else if ("value" in desc) {
                return desc.value;
              } else {
                var getter = desc.get;
                if (getter === void 0) {
                  return void 0;
                }
                return getter.call(receiver);
              }
            };
            var _parchment = __webpack_require__(0);
            var _parchment2 = _interopRequireDefault(_parchment);
            var _quill = __webpack_require__(5);
            var _quill2 = _interopRequireDefault(_quill);
            var _module = __webpack_require__(9);
            var _module2 = _interopRequireDefault(_module);
            var _code = __webpack_require__(13);
            var _code2 = _interopRequireDefault(_code);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            function _possibleConstructorReturn(self2, call) {
              if (!self2) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              }
              return call && (typeof call === "object" || typeof call === "function") ? call : self2;
            }
            function _inherits(subClass, superClass) {
              if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
              }
              subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
              if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            var SyntaxCodeBlock = function(_CodeBlock) {
              _inherits(SyntaxCodeBlock2, _CodeBlock);
              function SyntaxCodeBlock2() {
                _classCallCheck(this, SyntaxCodeBlock2);
                return _possibleConstructorReturn(this, (SyntaxCodeBlock2.__proto__ || Object.getPrototypeOf(SyntaxCodeBlock2)).apply(this, arguments));
              }
              _createClass(SyntaxCodeBlock2, [{
                key: "replaceWith",
                value: function replaceWith(block) {
                  this.domNode.textContent = this.domNode.textContent;
                  this.attach();
                  _get(SyntaxCodeBlock2.prototype.__proto__ || Object.getPrototypeOf(SyntaxCodeBlock2.prototype), "replaceWith", this).call(this, block);
                }
              }, {
                key: "highlight",
                value: function highlight(_highlight) {
                  var text = this.domNode.textContent;
                  if (this.cachedText !== text) {
                    if (text.trim().length > 0 || this.cachedText == null) {
                      this.domNode.innerHTML = _highlight(text);
                      this.domNode.normalize();
                      this.attach();
                    }
                    this.cachedText = text;
                  }
                }
              }]);
              return SyntaxCodeBlock2;
            }(_code2.default);
            SyntaxCodeBlock.className = "ql-syntax";
            var CodeToken = new _parchment2.default.Attributor.Class("token", "hljs", {
              scope: _parchment2.default.Scope.INLINE
            });
            var Syntax = function(_Module) {
              _inherits(Syntax2, _Module);
              _createClass(Syntax2, null, [{
                key: "register",
                value: function register() {
                  _quill2.default.register(CodeToken, true);
                  _quill2.default.register(SyntaxCodeBlock, true);
                }
              }]);
              function Syntax2(quill, options) {
                _classCallCheck(this, Syntax2);
                var _this2 = _possibleConstructorReturn(this, (Syntax2.__proto__ || Object.getPrototypeOf(Syntax2)).call(this, quill, options));
                if (typeof _this2.options.highlight !== "function") {
                  throw new Error("Syntax module requires highlight.js. Please include the library on the page before Quill.");
                }
                var timer = null;
                _this2.quill.on(_quill2.default.events.SCROLL_OPTIMIZE, function() {
                  clearTimeout(timer);
                  timer = setTimeout(function() {
                    _this2.highlight();
                    timer = null;
                  }, _this2.options.interval);
                });
                _this2.highlight();
                return _this2;
              }
              _createClass(Syntax2, [{
                key: "highlight",
                value: function highlight() {
                  var _this3 = this;
                  if (this.quill.selection.composing) return;
                  this.quill.update(_quill2.default.sources.USER);
                  var range = this.quill.getSelection();
                  this.quill.scroll.descendants(SyntaxCodeBlock).forEach(function(code) {
                    code.highlight(_this3.options.highlight);
                  });
                  this.quill.update(_quill2.default.sources.SILENT);
                  if (range != null) {
                    this.quill.setSelection(range, _quill2.default.sources.SILENT);
                  }
                }
              }]);
              return Syntax2;
            }(_module2.default);
            Syntax.DEFAULTS = {
              highlight: function() {
                if (window.hljs == null) return null;
                return function(text) {
                  var result = window.hljs.highlightAuto(text);
                  return result.value;
                };
              }(),
              interval: 1e3
            };
            exports2.CodeBlock = SyntaxCodeBlock;
            exports2.CodeToken = CodeToken;
            exports2.default = Syntax;
          },
          /* 76 */
          /***/
          function(module2, exports2) {
            module2.exports = '<svg viewbox="0 0 18 18"> <line class=ql-stroke x1=3 x2=15 y1=9 y2=9></line> <line class=ql-stroke x1=3 x2=13 y1=14 y2=14></line> <line class=ql-stroke x1=3 x2=9 y1=4 y2=4></line> </svg>';
          },
          /* 77 */
          /***/
          function(module2, exports2) {
            module2.exports = '<svg viewbox="0 0 18 18"> <line class=ql-stroke x1=15 x2=3 y1=9 y2=9></line> <line class=ql-stroke x1=14 x2=4 y1=14 y2=14></line> <line class=ql-stroke x1=12 x2=6 y1=4 y2=4></line> </svg>';
          },
          /* 78 */
          /***/
          function(module2, exports2) {
            module2.exports = '<svg viewbox="0 0 18 18"> <line class=ql-stroke x1=15 x2=3 y1=9 y2=9></line> <line class=ql-stroke x1=15 x2=5 y1=14 y2=14></line> <line class=ql-stroke x1=15 x2=9 y1=4 y2=4></line> </svg>';
          },
          /* 79 */
          /***/
          function(module2, exports2) {
            module2.exports = '<svg viewbox="0 0 18 18"> <line class=ql-stroke x1=15 x2=3 y1=9 y2=9></line> <line class=ql-stroke x1=15 x2=3 y1=14 y2=14></line> <line class=ql-stroke x1=15 x2=3 y1=4 y2=4></line> </svg>';
          },
          /* 80 */
          /***/
          function(module2, exports2) {
            module2.exports = '<svg viewbox="0 0 18 18"> <g class="ql-fill ql-color-label"> <polygon points="6 6.868 6 6 5 6 5 7 5.942 7 6 6.868"></polygon> <rect height=1 width=1 x=4 y=4></rect> <polygon points="6.817 5 6 5 6 6 6.38 6 6.817 5"></polygon> <rect height=1 width=1 x=2 y=6></rect> <rect height=1 width=1 x=3 y=5></rect> <rect height=1 width=1 x=4 y=7></rect> <polygon points="4 11.439 4 11 3 11 3 12 3.755 12 4 11.439"></polygon> <rect height=1 width=1 x=2 y=12></rect> <rect height=1 width=1 x=2 y=9></rect> <rect height=1 width=1 x=2 y=15></rect> <polygon points="4.63 10 4 10 4 11 4.192 11 4.63 10"></polygon> <rect height=1 width=1 x=3 y=8></rect> <path d=M10.832,4.2L11,4.582V4H10.708A1.948,1.948,0,0,1,10.832,4.2Z></path> <path d=M7,4.582L7.168,4.2A1.929,1.929,0,0,1,7.292,4H7V4.582Z></path> <path d=M8,13H7.683l-0.351.8a1.933,1.933,0,0,1-.124.2H8V13Z></path> <rect height=1 width=1 x=12 y=2></rect> <rect height=1 width=1 x=11 y=3></rect> <path d=M9,3H8V3.282A1.985,1.985,0,0,1,9,3Z></path> <rect height=1 width=1 x=2 y=3></rect> <rect height=1 width=1 x=6 y=2></rect> <rect height=1 width=1 x=3 y=2></rect> <rect height=1 width=1 x=5 y=3></rect> <rect height=1 width=1 x=9 y=2></rect> <rect height=1 width=1 x=15 y=14></rect> <polygon points="13.447 10.174 13.469 10.225 13.472 10.232 13.808 11 14 11 14 10 13.37 10 13.447 10.174"></polygon> <rect height=1 width=1 x=13 y=7></rect> <rect height=1 width=1 x=15 y=5></rect> <rect height=1 width=1 x=14 y=6></rect> <rect height=1 width=1 x=15 y=8></rect> <rect height=1 width=1 x=14 y=9></rect> <path d=M3.775,14H3v1H4V14.314A1.97,1.97,0,0,1,3.775,14Z></path> <rect height=1 width=1 x=14 y=3></rect> <polygon points="12 6.868 12 6 11.62 6 12 6.868"></polygon> <rect height=1 width=1 x=15 y=2></rect> <rect height=1 width=1 x=12 y=5></rect> <rect height=1 width=1 x=13 y=4></rect> <polygon points="12.933 9 13 9 13 8 12.495 8 12.933 9"></polygon> <rect height=1 width=1 x=9 y=14></rect> <rect height=1 width=1 x=8 y=15></rect> <path d=M6,14.926V15H7V14.316A1.993,1.993,0,0,1,6,14.926Z></path> <rect height=1 width=1 x=5 y=15></rect> <path d=M10.668,13.8L10.317,13H10v1h0.792A1.947,1.947,0,0,1,10.668,13.8Z></path> <rect height=1 width=1 x=11 y=15></rect> <path d=M14.332,12.2a1.99,1.99,0,0,1,.166.8H15V12H14.245Z></path> <rect height=1 width=1 x=14 y=15></rect> <rect height=1 width=1 x=15 y=11></rect> </g> <polyline class=ql-stroke points="5.5 13 9 5 12.5 13"></polyline> <line class=ql-stroke x1=11.63 x2=6.38 y1=11 y2=11></line> </svg>';
          },
          /* 81 */
          /***/
          function(module2, exports2) {
            module2.exports = '<svg viewbox="0 0 18 18"> <rect class="ql-fill ql-stroke" height=3 width=3 x=4 y=5></rect> <rect class="ql-fill ql-stroke" height=3 width=3 x=11 y=5></rect> <path class="ql-even ql-fill ql-stroke" d=M7,8c0,4.031-3,5-3,5></path> <path class="ql-even ql-fill ql-stroke" d=M14,8c0,4.031-3,5-3,5></path> </svg>';
          },
          /* 82 */
          /***/
          function(module2, exports2) {
            module2.exports = '<svg viewbox="0 0 18 18"> <path class=ql-stroke d=M5,4H9.5A2.5,2.5,0,0,1,12,6.5v0A2.5,2.5,0,0,1,9.5,9H5A0,0,0,0,1,5,9V4A0,0,0,0,1,5,4Z></path> <path class=ql-stroke d=M5,9h5.5A2.5,2.5,0,0,1,13,11.5v0A2.5,2.5,0,0,1,10.5,14H5a0,0,0,0,1,0,0V9A0,0,0,0,1,5,9Z></path> </svg>';
          },
          /* 83 */
          /***/
          function(module2, exports2) {
            module2.exports = '<svg class="" viewbox="0 0 18 18"> <line class=ql-stroke x1=5 x2=13 y1=3 y2=3></line> <line class=ql-stroke x1=6 x2=9.35 y1=12 y2=3></line> <line class=ql-stroke x1=11 x2=15 y1=11 y2=15></line> <line class=ql-stroke x1=15 x2=11 y1=11 y2=15></line> <rect class=ql-fill height=1 rx=0.5 ry=0.5 width=7 x=2 y=14></rect> </svg>';
          },
          /* 84 */
          /***/
          function(module2, exports2) {
            module2.exports = '<svg viewbox="0 0 18 18"> <line class="ql-color-label ql-stroke ql-transparent" x1=3 x2=15 y1=15 y2=15></line> <polyline class=ql-stroke points="5.5 11 9 3 12.5 11"></polyline> <line class=ql-stroke x1=11.63 x2=6.38 y1=9 y2=9></line> </svg>';
          },
          /* 85 */
          /***/
          function(module2, exports2) {
            module2.exports = '<svg viewbox="0 0 18 18"> <polygon class="ql-stroke ql-fill" points="3 11 5 9 3 7 3 11"></polygon> <line class="ql-stroke ql-fill" x1=15 x2=11 y1=4 y2=4></line> <path class=ql-fill d=M11,3a3,3,0,0,0,0,6h1V3H11Z></path> <rect class=ql-fill height=11 width=1 x=11 y=4></rect> <rect class=ql-fill height=11 width=1 x=13 y=4></rect> </svg>';
          },
          /* 86 */
          /***/
          function(module2, exports2) {
            module2.exports = '<svg viewbox="0 0 18 18"> <polygon class="ql-stroke ql-fill" points="15 12 13 10 15 8 15 12"></polygon> <line class="ql-stroke ql-fill" x1=9 x2=5 y1=4 y2=4></line> <path class=ql-fill d=M5,3A3,3,0,0,0,5,9H6V3H5Z></path> <rect class=ql-fill height=11 width=1 x=5 y=4></rect> <rect class=ql-fill height=11 width=1 x=7 y=4></rect> </svg>';
          },
          /* 87 */
          /***/
          function(module2, exports2) {
            module2.exports = '<svg viewbox="0 0 18 18"> <path class=ql-fill d=M14,16H4a1,1,0,0,1,0-2H14A1,1,0,0,1,14,16Z /> <path class=ql-fill d=M14,4H4A1,1,0,0,1,4,2H14A1,1,0,0,1,14,4Z /> <rect class=ql-fill x=3 y=6 width=12 height=6 rx=1 ry=1 /> </svg>';
          },
          /* 88 */
          /***/
          function(module2, exports2) {
            module2.exports = '<svg viewbox="0 0 18 18"> <path class=ql-fill d=M13,16H5a1,1,0,0,1,0-2h8A1,1,0,0,1,13,16Z /> <path class=ql-fill d=M13,4H5A1,1,0,0,1,5,2h8A1,1,0,0,1,13,4Z /> <rect class=ql-fill x=2 y=6 width=14 height=6 rx=1 ry=1 /> </svg>';
          },
          /* 89 */
          /***/
          function(module2, exports2) {
            module2.exports = '<svg viewbox="0 0 18 18"> <path class=ql-fill d=M15,8H13a1,1,0,0,1,0-2h2A1,1,0,0,1,15,8Z /> <path class=ql-fill d=M15,12H13a1,1,0,0,1,0-2h2A1,1,0,0,1,15,12Z /> <path class=ql-fill d=M15,16H5a1,1,0,0,1,0-2H15A1,1,0,0,1,15,16Z /> <path class=ql-fill d=M15,4H5A1,1,0,0,1,5,2H15A1,1,0,0,1,15,4Z /> <rect class=ql-fill x=2 y=6 width=8 height=6 rx=1 ry=1 /> </svg>';
          },
          /* 90 */
          /***/
          function(module2, exports2) {
            module2.exports = '<svg viewbox="0 0 18 18"> <path class=ql-fill d=M5,8H3A1,1,0,0,1,3,6H5A1,1,0,0,1,5,8Z /> <path class=ql-fill d=M5,12H3a1,1,0,0,1,0-2H5A1,1,0,0,1,5,12Z /> <path class=ql-fill d=M13,16H3a1,1,0,0,1,0-2H13A1,1,0,0,1,13,16Z /> <path class=ql-fill d=M13,4H3A1,1,0,0,1,3,2H13A1,1,0,0,1,13,4Z /> <rect class=ql-fill x=8 y=6 width=8 height=6 rx=1 ry=1 transform="translate(24 18) rotate(-180)"/> </svg>';
          },
          /* 91 */
          /***/
          function(module2, exports2) {
            module2.exports = '<svg viewbox="0 0 18 18"> <path class=ql-fill d=M11.759,2.482a2.561,2.561,0,0,0-3.53.607A7.656,7.656,0,0,0,6.8,6.2C6.109,9.188,5.275,14.677,4.15,14.927a1.545,1.545,0,0,0-1.3-.933A0.922,0.922,0,0,0,2,15.036S1.954,16,4.119,16s3.091-2.691,3.7-5.553c0.177-.826.36-1.726,0.554-2.6L8.775,6.2c0.381-1.421.807-2.521,1.306-2.676a1.014,1.014,0,0,0,1.02.56A0.966,0.966,0,0,0,11.759,2.482Z></path> <rect class=ql-fill height=1.6 rx=0.8 ry=0.8 width=5 x=5.15 y=6.2></rect> <path class=ql-fill d=M13.663,12.027a1.662,1.662,0,0,1,.266-0.276q0.193,0.069.456,0.138a2.1,2.1,0,0,0,.535.069,1.075,1.075,0,0,0,.767-0.3,1.044,1.044,0,0,0,.314-0.8,0.84,0.84,0,0,0-.238-0.619,0.8,0.8,0,0,0-.594-0.239,1.154,1.154,0,0,0-.781.3,4.607,4.607,0,0,0-.781,1q-0.091.15-.218,0.346l-0.246.38c-0.068-.288-0.137-0.582-0.212-0.885-0.459-1.847-2.494-.984-2.941-0.8-0.482.2-.353,0.647-0.094,0.529a0.869,0.869,0,0,1,1.281.585c0.217,0.751.377,1.436,0.527,2.038a5.688,5.688,0,0,1-.362.467,2.69,2.69,0,0,1-.264.271q-0.221-.08-0.471-0.147a2.029,2.029,0,0,0-.522-0.066,1.079,1.079,0,0,0-.768.3A1.058,1.058,0,0,0,9,15.131a0.82,0.82,0,0,0,.832.852,1.134,1.134,0,0,0,.787-0.3,5.11,5.11,0,0,0,.776-0.993q0.141-.219.215-0.34c0.046-.076.122-0.194,0.223-0.346a2.786,2.786,0,0,0,.918,1.726,2.582,2.582,0,0,0,2.376-.185c0.317-.181.212-0.565,0-0.494A0.807,0.807,0,0,1,14.176,15a5.159,5.159,0,0,1-.913-2.446l0,0Q13.487,12.24,13.663,12.027Z></path> </svg>';
          },
          /* 92 */
          /***/
          function(module2, exports2) {
            module2.exports = '<svg viewBox="0 0 18 18"> <path class=ql-fill d=M10,4V14a1,1,0,0,1-2,0V10H3v4a1,1,0,0,1-2,0V4A1,1,0,0,1,3,4V8H8V4a1,1,0,0,1,2,0Zm6.06787,9.209H14.98975V7.59863a.54085.54085,0,0,0-.605-.60547h-.62744a1.01119,1.01119,0,0,0-.748.29688L11.645,8.56641a.5435.5435,0,0,0-.022.8584l.28613.30762a.53861.53861,0,0,0,.84717.0332l.09912-.08789a1.2137,1.2137,0,0,0,.2417-.35254h.02246s-.01123.30859-.01123.60547V13.209H12.041a.54085.54085,0,0,0-.605.60547v.43945a.54085.54085,0,0,0,.605.60547h4.02686a.54085.54085,0,0,0,.605-.60547v-.43945A.54085.54085,0,0,0,16.06787,13.209Z /> </svg>';
          },
          /* 93 */
          /***/
          function(module2, exports2) {
            module2.exports = '<svg viewBox="0 0 18 18"> <path class=ql-fill d=M16.73975,13.81445v.43945a.54085.54085,0,0,1-.605.60547H11.855a.58392.58392,0,0,1-.64893-.60547V14.0127c0-2.90527,3.39941-3.42187,3.39941-4.55469a.77675.77675,0,0,0-.84717-.78125,1.17684,1.17684,0,0,0-.83594.38477c-.2749.26367-.561.374-.85791.13184l-.4292-.34082c-.30811-.24219-.38525-.51758-.1543-.81445a2.97155,2.97155,0,0,1,2.45361-1.17676,2.45393,2.45393,0,0,1,2.68408,2.40918c0,2.45312-3.1792,2.92676-3.27832,3.93848h2.79443A.54085.54085,0,0,1,16.73975,13.81445ZM9,3A.99974.99974,0,0,0,8,4V8H3V4A1,1,0,0,0,1,4V14a1,1,0,0,0,2,0V10H8v4a1,1,0,0,0,2,0V4A.99974.99974,0,0,0,9,3Z /> </svg>';
          },
          /* 94 */
          /***/
          function(module2, exports2) {
            module2.exports = '<svg viewbox="0 0 18 18"> <line class=ql-stroke x1=7 x2=13 y1=4 y2=4></line> <line class=ql-stroke x1=5 x2=11 y1=14 y2=14></line> <line class=ql-stroke x1=8 x2=10 y1=14 y2=4></line> </svg>';
          },
          /* 95 */
          /***/
          function(module2, exports2) {
            module2.exports = '<svg viewbox="0 0 18 18"> <rect class=ql-stroke height=10 width=12 x=3 y=4></rect> <circle class=ql-fill cx=6 cy=7 r=1></circle> <polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline> </svg>';
          },
          /* 96 */
          /***/
          function(module2, exports2) {
            module2.exports = '<svg viewbox="0 0 18 18"> <line class=ql-stroke x1=3 x2=15 y1=14 y2=14></line> <line class=ql-stroke x1=3 x2=15 y1=4 y2=4></line> <line class=ql-stroke x1=9 x2=15 y1=9 y2=9></line> <polyline class="ql-fill ql-stroke" points="3 7 3 11 5 9 3 7"></polyline> </svg>';
          },
          /* 97 */
          /***/
          function(module2, exports2) {
            module2.exports = '<svg viewbox="0 0 18 18"> <line class=ql-stroke x1=3 x2=15 y1=14 y2=14></line> <line class=ql-stroke x1=3 x2=15 y1=4 y2=4></line> <line class=ql-stroke x1=9 x2=15 y1=9 y2=9></line> <polyline class=ql-stroke points="5 7 5 11 3 9 5 7"></polyline> </svg>';
          },
          /* 98 */
          /***/
          function(module2, exports2) {
            module2.exports = '<svg viewbox="0 0 18 18"> <line class=ql-stroke x1=7 x2=11 y1=7 y2=11></line> <path class="ql-even ql-stroke" d=M8.9,4.577a3.476,3.476,0,0,1,.36,4.679A3.476,3.476,0,0,1,4.577,8.9C3.185,7.5,2.035,6.4,4.217,4.217S7.5,3.185,8.9,4.577Z></path> <path class="ql-even ql-stroke" d=M13.423,9.1a3.476,3.476,0,0,0-4.679-.36,3.476,3.476,0,0,0,.36,4.679c1.392,1.392,2.5,2.542,4.679.36S14.815,10.5,13.423,9.1Z></path> </svg>';
          },
          /* 99 */
          /***/
          function(module2, exports2) {
            module2.exports = '<svg viewbox="0 0 18 18"> <line class=ql-stroke x1=7 x2=15 y1=4 y2=4></line> <line class=ql-stroke x1=7 x2=15 y1=9 y2=9></line> <line class=ql-stroke x1=7 x2=15 y1=14 y2=14></line> <line class="ql-stroke ql-thin" x1=2.5 x2=4.5 y1=5.5 y2=5.5></line> <path class=ql-fill d=M3.5,6A0.5,0.5,0,0,1,3,5.5V3.085l-0.276.138A0.5,0.5,0,0,1,2.053,3c-0.124-.247-0.023-0.324.224-0.447l1-.5A0.5,0.5,0,0,1,4,2.5v3A0.5,0.5,0,0,1,3.5,6Z></path> <path class="ql-stroke ql-thin" d=M4.5,10.5h-2c0-.234,1.85-1.076,1.85-2.234A0.959,0.959,0,0,0,2.5,8.156></path> <path class="ql-stroke ql-thin" d=M2.5,14.846a0.959,0.959,0,0,0,1.85-.109A0.7,0.7,0,0,0,3.75,14a0.688,0.688,0,0,0,.6-0.736,0.959,0.959,0,0,0-1.85-.109></path> </svg>';
          },
          /* 100 */
          /***/
          function(module2, exports2) {
            module2.exports = '<svg viewbox="0 0 18 18"> <line class=ql-stroke x1=6 x2=15 y1=4 y2=4></line> <line class=ql-stroke x1=6 x2=15 y1=9 y2=9></line> <line class=ql-stroke x1=6 x2=15 y1=14 y2=14></line> <line class=ql-stroke x1=3 x2=3 y1=4 y2=4></line> <line class=ql-stroke x1=3 x2=3 y1=9 y2=9></line> <line class=ql-stroke x1=3 x2=3 y1=14 y2=14></line> </svg>';
          },
          /* 101 */
          /***/
          function(module2, exports2) {
            module2.exports = '<svg class="" viewbox="0 0 18 18"> <line class=ql-stroke x1=9 x2=15 y1=4 y2=4></line> <polyline class=ql-stroke points="3 4 4 5 6 3"></polyline> <line class=ql-stroke x1=9 x2=15 y1=14 y2=14></line> <polyline class=ql-stroke points="3 14 4 15 6 13"></polyline> <line class=ql-stroke x1=9 x2=15 y1=9 y2=9></line> <polyline class=ql-stroke points="3 9 4 10 6 8"></polyline> </svg>';
          },
          /* 102 */
          /***/
          function(module2, exports2) {
            module2.exports = '<svg viewbox="0 0 18 18"> <path class=ql-fill d=M15.5,15H13.861a3.858,3.858,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.921,1.921,0,0,0,12.021,11.7a0.50013,0.50013,0,1,0,.957.291h0a0.914,0.914,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.076-1.16971,1.86982-1.93971,2.43082A1.45639,1.45639,0,0,0,12,15.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,15Z /> <path class=ql-fill d=M9.65,5.241a1,1,0,0,0-1.409.108L6,7.964,3.759,5.349A1,1,0,0,0,2.192,6.59178Q2.21541,6.6213,2.241,6.649L4.684,9.5,2.241,12.35A1,1,0,0,0,3.71,13.70722q0.02557-.02768.049-0.05722L6,11.036,8.241,13.65a1,1,0,1,0,1.567-1.24277Q9.78459,12.3777,9.759,12.35L7.316,9.5,9.759,6.651A1,1,0,0,0,9.65,5.241Z /> </svg>';
          },
          /* 103 */
          /***/
          function(module2, exports2) {
            module2.exports = '<svg viewbox="0 0 18 18"> <path class=ql-fill d=M15.5,7H13.861a4.015,4.015,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.922,1.922,0,0,0,12.021,3.7a0.5,0.5,0,1,0,.957.291,0.917,0.917,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.077-1.164,1.925-1.934,2.486A1.423,1.423,0,0,0,12,7.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,7Z /> <path class=ql-fill d=M9.651,5.241a1,1,0,0,0-1.41.108L6,7.964,3.759,5.349a1,1,0,1,0-1.519,1.3L4.683,9.5,2.241,12.35a1,1,0,1,0,1.519,1.3L6,11.036,8.241,13.65a1,1,0,0,0,1.519-1.3L7.317,9.5,9.759,6.651A1,1,0,0,0,9.651,5.241Z /> </svg>';
          },
          /* 104 */
          /***/
          function(module2, exports2) {
            module2.exports = '<svg viewbox="0 0 18 18"> <line class="ql-stroke ql-thin" x1=15.5 x2=2.5 y1=8.5 y2=9.5></line> <path class=ql-fill d=M9.007,8C6.542,7.791,6,7.519,6,6.5,6,5.792,7.283,5,9,5c1.571,0,2.765.679,2.969,1.309a1,1,0,0,0,1.9-.617C13.356,4.106,11.354,3,9,3,6.2,3,4,4.538,4,6.5a3.2,3.2,0,0,0,.5,1.843Z></path> <path class=ql-fill d=M8.984,10C11.457,10.208,12,10.479,12,11.5c0,0.708-1.283,1.5-3,1.5-1.571,0-2.765-.679-2.969-1.309a1,1,0,1,0-1.9.617C4.644,13.894,6.646,15,9,15c2.8,0,5-1.538,5-3.5a3.2,3.2,0,0,0-.5-1.843Z></path> </svg>';
          },
          /* 105 */
          /***/
          function(module2, exports2) {
            module2.exports = '<svg viewbox="0 0 18 18"> <path class=ql-stroke d=M5,3V9a4.012,4.012,0,0,0,4,4H9a4.012,4.012,0,0,0,4-4V3></path> <rect class=ql-fill height=1 rx=0.5 ry=0.5 width=12 x=3 y=15></rect> </svg>';
          },
          /* 106 */
          /***/
          function(module2, exports2) {
            module2.exports = '<svg viewbox="0 0 18 18"> <rect class=ql-stroke height=12 width=12 x=3 y=3></rect> <rect class=ql-fill height=12 width=1 x=5 y=3></rect> <rect class=ql-fill height=12 width=1 x=12 y=3></rect> <rect class=ql-fill height=2 width=8 x=5 y=8></rect> <rect class=ql-fill height=1 width=3 x=3 y=5></rect> <rect class=ql-fill height=1 width=3 x=3 y=7></rect> <rect class=ql-fill height=1 width=3 x=3 y=10></rect> <rect class=ql-fill height=1 width=3 x=3 y=12></rect> <rect class=ql-fill height=1 width=3 x=12 y=5></rect> <rect class=ql-fill height=1 width=3 x=12 y=7></rect> <rect class=ql-fill height=1 width=3 x=12 y=10></rect> <rect class=ql-fill height=1 width=3 x=12 y=12></rect> </svg>';
          },
          /* 107 */
          /***/
          function(module2, exports2) {
            module2.exports = '<svg viewbox="0 0 18 18"> <polygon class=ql-stroke points="7 11 9 13 11 11 7 11"></polygon> <polygon class=ql-stroke points="7 7 9 5 11 7 7 7"></polygon> </svg>';
          },
          /* 108 */
          /***/
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            exports2.default = exports2.BubbleTooltip = void 0;
            var _get = function get(object, property, receiver) {
              if (object === null) object = Function.prototype;
              var desc = Object.getOwnPropertyDescriptor(object, property);
              if (desc === void 0) {
                var parent = Object.getPrototypeOf(object);
                if (parent === null) {
                  return void 0;
                } else {
                  return get(parent, property, receiver);
                }
              } else if ("value" in desc) {
                return desc.value;
              } else {
                var getter = desc.get;
                if (getter === void 0) {
                  return void 0;
                }
                return getter.call(receiver);
              }
            };
            var _createClass = /* @__PURE__ */ function() {
              function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
                }
              }
              return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
              };
            }();
            var _extend = __webpack_require__(3);
            var _extend2 = _interopRequireDefault(_extend);
            var _emitter = __webpack_require__(8);
            var _emitter2 = _interopRequireDefault(_emitter);
            var _base = __webpack_require__(43);
            var _base2 = _interopRequireDefault(_base);
            var _selection = __webpack_require__(15);
            var _icons = __webpack_require__(41);
            var _icons2 = _interopRequireDefault(_icons);
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : { default: obj };
            }
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            function _possibleConstructorReturn(self2, call) {
              if (!self2) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              }
              return call && (typeof call === "object" || typeof call === "function") ? call : self2;
            }
            function _inherits(subClass, superClass) {
              if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
              }
              subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
              if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            var TOOLBAR_CONFIG = [["bold", "italic", "link"], [{ header: 1 }, { header: 2 }, "blockquote"]];
            var BubbleTheme = function(_BaseTheme) {
              _inherits(BubbleTheme2, _BaseTheme);
              function BubbleTheme2(quill, options) {
                _classCallCheck(this, BubbleTheme2);
                if (options.modules.toolbar != null && options.modules.toolbar.container == null) {
                  options.modules.toolbar.container = TOOLBAR_CONFIG;
                }
                var _this = _possibleConstructorReturn(this, (BubbleTheme2.__proto__ || Object.getPrototypeOf(BubbleTheme2)).call(this, quill, options));
                _this.quill.container.classList.add("ql-bubble");
                return _this;
              }
              _createClass(BubbleTheme2, [{
                key: "extendToolbar",
                value: function extendToolbar(toolbar) {
                  this.tooltip = new BubbleTooltip(this.quill, this.options.bounds);
                  this.tooltip.root.appendChild(toolbar.container);
                  this.buildButtons([].slice.call(toolbar.container.querySelectorAll("button")), _icons2.default);
                  this.buildPickers([].slice.call(toolbar.container.querySelectorAll("select")), _icons2.default);
                }
              }]);
              return BubbleTheme2;
            }(_base2.default);
            BubbleTheme.DEFAULTS = (0, _extend2.default)(true, {}, _base2.default.DEFAULTS, {
              modules: {
                toolbar: {
                  handlers: {
                    link: function link(value) {
                      if (!value) {
                        this.quill.format("link", false);
                      } else {
                        this.quill.theme.tooltip.edit();
                      }
                    }
                  }
                }
              }
            });
            var BubbleTooltip = function(_BaseTooltip) {
              _inherits(BubbleTooltip2, _BaseTooltip);
              function BubbleTooltip2(quill, bounds) {
                _classCallCheck(this, BubbleTooltip2);
                var _this2 = _possibleConstructorReturn(this, (BubbleTooltip2.__proto__ || Object.getPrototypeOf(BubbleTooltip2)).call(this, quill, bounds));
                _this2.quill.on(_emitter2.default.events.EDITOR_CHANGE, function(type, range, oldRange, source) {
                  if (type !== _emitter2.default.events.SELECTION_CHANGE) return;
                  if (range != null && range.length > 0 && source === _emitter2.default.sources.USER) {
                    _this2.show();
                    _this2.root.style.left = "0px";
                    _this2.root.style.width = "";
                    _this2.root.style.width = _this2.root.offsetWidth + "px";
                    var lines = _this2.quill.getLines(range.index, range.length);
                    if (lines.length === 1) {
                      _this2.position(_this2.quill.getBounds(range));
                    } else {
                      var lastLine = lines[lines.length - 1];
                      var index = _this2.quill.getIndex(lastLine);
                      var length = Math.min(lastLine.length() - 1, range.index + range.length - index);
                      var _bounds = _this2.quill.getBounds(new _selection.Range(index, length));
                      _this2.position(_bounds);
                    }
                  } else if (document.activeElement !== _this2.textbox && _this2.quill.hasFocus()) {
                    _this2.hide();
                  }
                });
                return _this2;
              }
              _createClass(BubbleTooltip2, [{
                key: "listen",
                value: function listen() {
                  var _this3 = this;
                  _get(BubbleTooltip2.prototype.__proto__ || Object.getPrototypeOf(BubbleTooltip2.prototype), "listen", this).call(this);
                  this.root.querySelector(".ql-close").addEventListener("click", function() {
                    _this3.root.classList.remove("ql-editing");
                  });
                  this.quill.on(_emitter2.default.events.SCROLL_OPTIMIZE, function() {
                    setTimeout(function() {
                      if (_this3.root.classList.contains("ql-hidden")) return;
                      var range = _this3.quill.getSelection();
                      if (range != null) {
                        _this3.position(_this3.quill.getBounds(range));
                      }
                    }, 1);
                  });
                }
              }, {
                key: "cancel",
                value: function cancel() {
                  this.show();
                }
              }, {
                key: "position",
                value: function position(reference) {
                  var shift = _get(BubbleTooltip2.prototype.__proto__ || Object.getPrototypeOf(BubbleTooltip2.prototype), "position", this).call(this, reference);
                  var arrow = this.root.querySelector(".ql-tooltip-arrow");
                  arrow.style.marginLeft = "";
                  if (shift === 0) return shift;
                  arrow.style.marginLeft = -1 * shift - arrow.offsetWidth / 2 + "px";
                }
              }]);
              return BubbleTooltip2;
            }(_base.BaseTooltip);
            BubbleTooltip.TEMPLATE = ['<span class="ql-tooltip-arrow"></span>', '<div class="ql-tooltip-editor">', '<input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">', '<a class="ql-close"></a>', "</div>"].join("");
            exports2.BubbleTooltip = BubbleTooltip;
            exports2.default = BubbleTheme;
          },
          /* 109 */
          /***/
          function(module2, exports2, __webpack_require__) {
            module2.exports = __webpack_require__(63);
          }
          /******/
        ])["default"]
      );
    });
  }
});

// node_modules/@vue/compiler-core/dist/compiler-core.esm-bundler.js
function registerRuntimeHelpers(helpers) {
  Object.getOwnPropertySymbols(helpers).forEach((s) => {
    helperNameMap[s] = helpers[s];
  });
}
function createRoot(children, source = "") {
  return {
    type: 0,
    source,
    children,
    helpers: /* @__PURE__ */ new Set(),
    components: [],
    directives: [],
    hoists: [],
    imports: [],
    cached: [],
    temps: 0,
    codegenNode: void 0,
    loc: locStub
  };
}
function createVNodeCall(context, tag, props, children, patchFlag, dynamicProps, directives, isBlock = false, disableTracking = false, isComponent2 = false, loc = locStub) {
  if (context) {
    if (isBlock) {
      context.helper(OPEN_BLOCK);
      context.helper(getVNodeBlockHelper(context.inSSR, isComponent2));
    } else {
      context.helper(getVNodeHelper(context.inSSR, isComponent2));
    }
    if (directives) {
      context.helper(WITH_DIRECTIVES);
    }
  }
  return {
    type: 13,
    tag,
    props,
    children,
    patchFlag,
    dynamicProps,
    directives,
    isBlock,
    disableTracking,
    isComponent: isComponent2,
    loc
  };
}
function createArrayExpression(elements, loc = locStub) {
  return {
    type: 17,
    loc,
    elements
  };
}
function createObjectExpression(properties, loc = locStub) {
  return {
    type: 15,
    loc,
    properties
  };
}
function createObjectProperty(key, value) {
  return {
    type: 16,
    loc: locStub,
    key: isString(key) ? createSimpleExpression(key, true) : key,
    value
  };
}
function createSimpleExpression(content, isStatic = false, loc = locStub, constType = 0) {
  return {
    type: 4,
    loc,
    content,
    isStatic,
    constType: isStatic ? 3 : constType
  };
}
function createInterpolation(content, loc) {
  return {
    type: 5,
    loc,
    content: isString(content) ? createSimpleExpression(content, false, loc) : content
  };
}
function createCompoundExpression(children, loc = locStub) {
  return {
    type: 8,
    loc,
    children
  };
}
function createCallExpression(callee, args = [], loc = locStub) {
  return {
    type: 14,
    loc,
    callee,
    arguments: args
  };
}
function createFunctionExpression(params, returns = void 0, newline = false, isSlot = false, loc = locStub) {
  return {
    type: 18,
    params,
    returns,
    newline,
    isSlot,
    loc
  };
}
function createConditionalExpression(test, consequent, alternate, newline = true) {
  return {
    type: 19,
    test,
    consequent,
    alternate,
    newline,
    loc: locStub
  };
}
function createCacheExpression(index, value, needPauseTracking = false, inVOnce = false) {
  return {
    type: 20,
    index,
    value,
    needPauseTracking,
    inVOnce,
    needArraySpread: false,
    loc: locStub
  };
}
function createBlockStatement(body) {
  return {
    type: 21,
    body,
    loc: locStub
  };
}
function createTemplateLiteral(elements) {
  return {
    type: 22,
    elements,
    loc: locStub
  };
}
function createIfStatement(test, consequent, alternate) {
  return {
    type: 23,
    test,
    consequent,
    alternate,
    loc: locStub
  };
}
function createAssignmentExpression(left, right) {
  return {
    type: 24,
    left,
    right,
    loc: locStub
  };
}
function createSequenceExpression(expressions) {
  return {
    type: 25,
    expressions,
    loc: locStub
  };
}
function createReturnStatement(returns) {
  return {
    type: 26,
    returns,
    loc: locStub
  };
}
function getVNodeHelper(ssr, isComponent2) {
  return ssr || isComponent2 ? CREATE_VNODE : CREATE_ELEMENT_VNODE;
}
function getVNodeBlockHelper(ssr, isComponent2) {
  return ssr || isComponent2 ? CREATE_BLOCK : CREATE_ELEMENT_BLOCK;
}
function convertToBlock(node, { helper, removeHelper, inSSR }) {
  if (!node.isBlock) {
    node.isBlock = true;
    removeHelper(getVNodeHelper(inSSR, node.isComponent));
    helper(OPEN_BLOCK);
    helper(getVNodeBlockHelper(inSSR, node.isComponent));
  }
}
function isTagStartChar(c) {
  return c >= 97 && c <= 122 || c >= 65 && c <= 90;
}
function isWhitespace(c) {
  return c === 32 || c === 10 || c === 9 || c === 12 || c === 13;
}
function isEndOfTagSection(c) {
  return c === 47 || c === 62 || isWhitespace(c);
}
function toCharCodes(str) {
  const ret = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    ret[i] = str.charCodeAt(i);
  }
  return ret;
}
function getCompatValue(key, { compatConfig }) {
  const value = compatConfig && compatConfig[key];
  if (key === "MODE") {
    return value || 3;
  } else {
    return value;
  }
}
function isCompatEnabled(key, context) {
  const mode = getCompatValue("MODE", context);
  const value = getCompatValue(key, context);
  return mode === 3 ? value === true : value !== false;
}
function checkCompatEnabled(key, context, loc, ...args) {
  const enabled = isCompatEnabled(key, context);
  if (enabled) {
    warnDeprecation(key, context, loc, ...args);
  }
  return enabled;
}
function warnDeprecation(key, context, loc, ...args) {
  const val = getCompatValue(key, context);
  if (val === "suppress-warning") {
    return;
  }
  const { message, link } = deprecationData[key];
  const msg = `(deprecation ${key}) ${typeof message === "function" ? message(...args) : message}${link ? `
  Details: ${link}` : ``}`;
  const err = new SyntaxError(msg);
  err.code = key;
  if (loc) err.loc = loc;
  context.onWarn(err);
}
function defaultOnError(error) {
  throw error;
}
function defaultOnWarn(msg) {
  console.warn(`[Vue warn] ${msg.message}`);
}
function createCompilerError(code, loc, messages, additionalMessage) {
  const msg = true ? (messages || errorMessages)[code] + (additionalMessage || ``) : `https://vuejs.org/error-reference/#compiler-${code}`;
  const error = new SyntaxError(String(msg));
  error.code = code;
  error.loc = loc;
  return error;
}
function walkIdentifiers(root, onIdentifier, includeAll = false, parentStack = [], knownIds = /* @__PURE__ */ Object.create(null)) {
  {
    return;
  }
}
function isReferencedIdentifier(id, parent, parentStack) {
  {
    return false;
  }
}
function isInDestructureAssignment(parent, parentStack) {
  if (parent && (parent.type === "ObjectProperty" || parent.type === "ArrayPattern")) {
    let i = parentStack.length;
    while (i--) {
      const p = parentStack[i];
      if (p.type === "AssignmentExpression") {
        return true;
      } else if (p.type !== "ObjectProperty" && !p.type.endsWith("Pattern")) {
        break;
      }
    }
  }
  return false;
}
function isInNewExpression(parentStack) {
  let i = parentStack.length;
  while (i--) {
    const p = parentStack[i];
    if (p.type === "NewExpression") {
      return true;
    } else if (p.type !== "MemberExpression") {
      break;
    }
  }
  return false;
}
function walkFunctionParams(node, onIdent) {
  for (const p of node.params) {
    for (const id of extractIdentifiers(p)) {
      onIdent(id);
    }
  }
}
function walkBlockDeclarations(block, onIdent) {
  for (const stmt of block.body) {
    if (stmt.type === "VariableDeclaration") {
      if (stmt.declare) continue;
      for (const decl of stmt.declarations) {
        for (const id of extractIdentifiers(decl.id)) {
          onIdent(id);
        }
      }
    } else if (stmt.type === "FunctionDeclaration" || stmt.type === "ClassDeclaration") {
      if (stmt.declare || !stmt.id) continue;
      onIdent(stmt.id);
    } else if (isForStatement(stmt)) {
      walkForStatement(stmt, true, onIdent);
    }
  }
}
function isForStatement(stmt) {
  return stmt.type === "ForOfStatement" || stmt.type === "ForInStatement" || stmt.type === "ForStatement";
}
function walkForStatement(stmt, isVar, onIdent) {
  const variable = stmt.type === "ForStatement" ? stmt.init : stmt.left;
  if (variable && variable.type === "VariableDeclaration" && (variable.kind === "var" ? isVar : !isVar)) {
    for (const decl of variable.declarations) {
      for (const id of extractIdentifiers(decl.id)) {
        onIdent(id);
      }
    }
  }
}
function extractIdentifiers(param, nodes = []) {
  switch (param.type) {
    case "Identifier":
      nodes.push(param);
      break;
    case "MemberExpression":
      let object = param;
      while (object.type === "MemberExpression") {
        object = object.object;
      }
      nodes.push(object);
      break;
    case "ObjectPattern":
      for (const prop of param.properties) {
        if (prop.type === "RestElement") {
          extractIdentifiers(prop.argument, nodes);
        } else {
          extractIdentifiers(prop.value, nodes);
        }
      }
      break;
    case "ArrayPattern":
      param.elements.forEach((element) => {
        if (element) extractIdentifiers(element, nodes);
      });
      break;
    case "RestElement":
      extractIdentifiers(param.argument, nodes);
      break;
    case "AssignmentPattern":
      extractIdentifiers(param.left, nodes);
      break;
  }
  return nodes;
}
function unwrapTSNode(node) {
  if (TS_NODE_TYPES.includes(node.type)) {
    return unwrapTSNode(node.expression);
  } else {
    return node;
  }
}
function isCoreComponent(tag) {
  switch (tag) {
    case "Teleport":
    case "teleport":
      return TELEPORT;
    case "Suspense":
    case "suspense":
      return SUSPENSE;
    case "KeepAlive":
    case "keep-alive":
      return KEEP_ALIVE;
    case "BaseTransition":
    case "base-transition":
      return BASE_TRANSITION;
  }
}
function advancePositionWithClone(pos, source, numberOfCharacters = source.length) {
  return advancePositionWithMutation(
    {
      offset: pos.offset,
      line: pos.line,
      column: pos.column
    },
    source,
    numberOfCharacters
  );
}
function advancePositionWithMutation(pos, source, numberOfCharacters = source.length) {
  let linesCount = 0;
  let lastNewLinePos = -1;
  for (let i = 0; i < numberOfCharacters; i++) {
    if (source.charCodeAt(i) === 10) {
      linesCount++;
      lastNewLinePos = i;
    }
  }
  pos.offset += numberOfCharacters;
  pos.line += linesCount;
  pos.column = lastNewLinePos === -1 ? pos.column + numberOfCharacters : numberOfCharacters - lastNewLinePos;
  return pos;
}
function assert(condition, msg) {
  if (!condition) {
    throw new Error(msg || `unexpected compiler condition`);
  }
}
function findDir(node, name, allowEmpty = false) {
  for (let i = 0; i < node.props.length; i++) {
    const p = node.props[i];
    if (p.type === 7 && (allowEmpty || p.exp) && (isString(name) ? p.name === name : name.test(p.name))) {
      return p;
    }
  }
}
function findProp(node, name, dynamicOnly = false, allowEmpty = false) {
  for (let i = 0; i < node.props.length; i++) {
    const p = node.props[i];
    if (p.type === 6) {
      if (dynamicOnly) continue;
      if (p.name === name && (p.value || allowEmpty)) {
        return p;
      }
    } else if (p.name === "bind" && (p.exp || allowEmpty) && isStaticArgOf(p.arg, name)) {
      return p;
    }
  }
}
function isStaticArgOf(arg, name) {
  return !!(arg && isStaticExp(arg) && arg.content === name);
}
function hasDynamicKeyVBind(node) {
  return node.props.some(
    (p) => p.type === 7 && p.name === "bind" && (!p.arg || // v-bind="obj"
    p.arg.type !== 4 || // v-bind:[_ctx.foo]
    !p.arg.isStatic)
    // v-bind:[foo]
  );
}
function isText$1(node) {
  return node.type === 5 || node.type === 2;
}
function isVSlot(p) {
  return p.type === 7 && p.name === "slot";
}
function isTemplateNode(node) {
  return node.type === 1 && node.tagType === 3;
}
function isSlotOutlet(node) {
  return node.type === 1 && node.tagType === 2;
}
function getUnnormalizedProps(props, callPath = []) {
  if (props && !isString(props) && props.type === 14) {
    const callee = props.callee;
    if (!isString(callee) && propsHelperSet.has(callee)) {
      return getUnnormalizedProps(
        props.arguments[0],
        callPath.concat(props)
      );
    }
  }
  return [props, callPath];
}
function injectProp(node, prop, context) {
  let propsWithInjection;
  let props = node.type === 13 ? node.props : node.arguments[2];
  let callPath = [];
  let parentCall;
  if (props && !isString(props) && props.type === 14) {
    const ret = getUnnormalizedProps(props);
    props = ret[0];
    callPath = ret[1];
    parentCall = callPath[callPath.length - 1];
  }
  if (props == null || isString(props)) {
    propsWithInjection = createObjectExpression([prop]);
  } else if (props.type === 14) {
    const first = props.arguments[0];
    if (!isString(first) && first.type === 15) {
      if (!hasProp(prop, first)) {
        first.properties.unshift(prop);
      }
    } else {
      if (props.callee === TO_HANDLERS) {
        propsWithInjection = createCallExpression(context.helper(MERGE_PROPS), [
          createObjectExpression([prop]),
          props
        ]);
      } else {
        props.arguments.unshift(createObjectExpression([prop]));
      }
    }
    !propsWithInjection && (propsWithInjection = props);
  } else if (props.type === 15) {
    if (!hasProp(prop, props)) {
      props.properties.unshift(prop);
    }
    propsWithInjection = props;
  } else {
    propsWithInjection = createCallExpression(context.helper(MERGE_PROPS), [
      createObjectExpression([prop]),
      props
    ]);
    if (parentCall && parentCall.callee === GUARD_REACTIVE_PROPS) {
      parentCall = callPath[callPath.length - 2];
    }
  }
  if (node.type === 13) {
    if (parentCall) {
      parentCall.arguments[0] = propsWithInjection;
    } else {
      node.props = propsWithInjection;
    }
  } else {
    if (parentCall) {
      parentCall.arguments[0] = propsWithInjection;
    } else {
      node.arguments[2] = propsWithInjection;
    }
  }
}
function hasProp(prop, props) {
  let result = false;
  if (prop.key.type === 4) {
    const propKeyName = prop.key.content;
    result = props.properties.some(
      (p) => p.key.type === 4 && p.key.content === propKeyName
    );
  }
  return result;
}
function toValidAssetId(name, type) {
  return `_${type}_${name.replace(/[^\w]/g, (searchValue, replaceValue) => {
    return searchValue === "-" ? "_" : name.charCodeAt(replaceValue).toString();
  })}`;
}
function hasScopeRef(node, ids) {
  if (!node || Object.keys(ids).length === 0) {
    return false;
  }
  switch (node.type) {
    case 1:
      for (let i = 0; i < node.props.length; i++) {
        const p = node.props[i];
        if (p.type === 7 && (hasScopeRef(p.arg, ids) || hasScopeRef(p.exp, ids))) {
          return true;
        }
      }
      return node.children.some((c) => hasScopeRef(c, ids));
    case 11:
      if (hasScopeRef(node.source, ids)) {
        return true;
      }
      return node.children.some((c) => hasScopeRef(c, ids));
    case 9:
      return node.branches.some((b) => hasScopeRef(b, ids));
    case 10:
      if (hasScopeRef(node.condition, ids)) {
        return true;
      }
      return node.children.some((c) => hasScopeRef(c, ids));
    case 4:
      return !node.isStatic && isSimpleIdentifier(node.content) && !!ids[node.content];
    case 8:
      return node.children.some((c) => isObject(c) && hasScopeRef(c, ids));
    case 5:
    case 12:
      return hasScopeRef(node.content, ids);
    case 2:
    case 3:
    case 20:
      return false;
    default:
      if (true) ;
      return false;
  }
}
function getMemoedVNodeCall(node) {
  if (node.type === 14 && node.callee === WITH_MEMO) {
    return node.arguments[1].returns;
  } else {
    return node;
  }
}
function parseForExpression(input) {
  const loc = input.loc;
  const exp = input.content;
  const inMatch = exp.match(forAliasRE);
  if (!inMatch) return;
  const [, LHS, RHS] = inMatch;
  const createAliasExpression = (content, offset, asParam = false) => {
    const start = loc.start.offset + offset;
    const end = start + content.length;
    return createExp(
      content,
      false,
      getLoc(start, end),
      0,
      asParam ? 1 : 0
      /* Normal */
    );
  };
  const result = {
    source: createAliasExpression(RHS.trim(), exp.indexOf(RHS, LHS.length)),
    value: void 0,
    key: void 0,
    index: void 0,
    finalized: false
  };
  let valueContent = LHS.trim().replace(stripParensRE, "").trim();
  const trimmedOffset = LHS.indexOf(valueContent);
  const iteratorMatch = valueContent.match(forIteratorRE);
  if (iteratorMatch) {
    valueContent = valueContent.replace(forIteratorRE, "").trim();
    const keyContent = iteratorMatch[1].trim();
    let keyOffset;
    if (keyContent) {
      keyOffset = exp.indexOf(keyContent, trimmedOffset + valueContent.length);
      result.key = createAliasExpression(keyContent, keyOffset, true);
    }
    if (iteratorMatch[2]) {
      const indexContent = iteratorMatch[2].trim();
      if (indexContent) {
        result.index = createAliasExpression(
          indexContent,
          exp.indexOf(
            indexContent,
            result.key ? keyOffset + keyContent.length : trimmedOffset + valueContent.length
          ),
          true
        );
      }
    }
  }
  if (valueContent) {
    result.value = createAliasExpression(valueContent, trimmedOffset, true);
  }
  return result;
}
function getSlice(start, end) {
  return currentInput.slice(start, end);
}
function endOpenTag(end) {
  if (tokenizer.inSFCRoot) {
    currentOpenTag.innerLoc = getLoc(end + 1, end + 1);
  }
  addNode(currentOpenTag);
  const { tag, ns } = currentOpenTag;
  if (ns === 0 && currentOptions.isPreTag(tag)) {
    inPre++;
  }
  if (currentOptions.isVoidTag(tag)) {
    onCloseTag(currentOpenTag, end);
  } else {
    stack.unshift(currentOpenTag);
    if (ns === 1 || ns === 2) {
      tokenizer.inXML = true;
    }
  }
  currentOpenTag = null;
}
function onText(content, start, end) {
  {
    const tag = stack[0] && stack[0].tag;
    if (tag !== "script" && tag !== "style" && content.includes("&")) {
      content = currentOptions.decodeEntities(content, false);
    }
  }
  const parent = stack[0] || currentRoot;
  const lastNode = parent.children[parent.children.length - 1];
  if (lastNode && lastNode.type === 2) {
    lastNode.content += content;
    setLocEnd(lastNode.loc, end);
  } else {
    parent.children.push({
      type: 2,
      content,
      loc: getLoc(start, end)
    });
  }
}
function onCloseTag(el, end, isImplied = false) {
  if (isImplied) {
    setLocEnd(el.loc, backTrack(end, 60));
  } else {
    setLocEnd(el.loc, lookAhead(end, 62) + 1);
  }
  if (tokenizer.inSFCRoot) {
    if (el.children.length) {
      el.innerLoc.end = extend({}, el.children[el.children.length - 1].loc.end);
    } else {
      el.innerLoc.end = extend({}, el.innerLoc.start);
    }
    el.innerLoc.source = getSlice(
      el.innerLoc.start.offset,
      el.innerLoc.end.offset
    );
  }
  const { tag, ns, children } = el;
  if (!inVPre) {
    if (tag === "slot") {
      el.tagType = 2;
    } else if (isFragmentTemplate(el)) {
      el.tagType = 3;
    } else if (isComponent(el)) {
      el.tagType = 1;
    }
  }
  if (!tokenizer.inRCDATA) {
    el.children = condenseWhitespace(children);
  }
  if (ns === 0 && currentOptions.isIgnoreNewlineTag(tag)) {
    const first = children[0];
    if (first && first.type === 2) {
      first.content = first.content.replace(/^\r?\n/, "");
    }
  }
  if (ns === 0 && currentOptions.isPreTag(tag)) {
    inPre--;
  }
  if (currentVPreBoundary === el) {
    inVPre = tokenizer.inVPre = false;
    currentVPreBoundary = null;
  }
  if (tokenizer.inXML && (stack[0] ? stack[0].ns : currentOptions.ns) === 0) {
    tokenizer.inXML = false;
  }
  {
    const props = el.props;
    if (isCompatEnabled(
      "COMPILER_V_IF_V_FOR_PRECEDENCE",
      currentOptions
    )) {
      let hasIf = false;
      let hasFor = false;
      for (let i = 0; i < props.length; i++) {
        const p = props[i];
        if (p.type === 7) {
          if (p.name === "if") {
            hasIf = true;
          } else if (p.name === "for") {
            hasFor = true;
          }
        }
        if (hasIf && hasFor) {
          warnDeprecation(
            "COMPILER_V_IF_V_FOR_PRECEDENCE",
            currentOptions,
            el.loc
          );
          break;
        }
      }
    }
    if (!tokenizer.inSFCRoot && isCompatEnabled(
      "COMPILER_NATIVE_TEMPLATE",
      currentOptions
    ) && el.tag === "template" && !isFragmentTemplate(el)) {
      warnDeprecation(
        "COMPILER_NATIVE_TEMPLATE",
        currentOptions,
        el.loc
      );
      const parent = stack[0] || currentRoot;
      const index = parent.children.indexOf(el);
      parent.children.splice(index, 1, ...el.children);
    }
    const inlineTemplateProp = props.find(
      (p) => p.type === 6 && p.name === "inline-template"
    );
    if (inlineTemplateProp && checkCompatEnabled(
      "COMPILER_INLINE_TEMPLATE",
      currentOptions,
      inlineTemplateProp.loc
    ) && el.children.length) {
      inlineTemplateProp.value = {
        type: 2,
        content: getSlice(
          el.children[0].loc.start.offset,
          el.children[el.children.length - 1].loc.end.offset
        ),
        loc: inlineTemplateProp.loc
      };
    }
  }
}
function lookAhead(index, c) {
  let i = index;
  while (currentInput.charCodeAt(i) !== c && i < currentInput.length - 1) i++;
  return i;
}
function backTrack(index, c) {
  let i = index;
  while (currentInput.charCodeAt(i) !== c && i >= 0) i--;
  return i;
}
function isFragmentTemplate({ tag, props }) {
  if (tag === "template") {
    for (let i = 0; i < props.length; i++) {
      if (props[i].type === 7 && specialTemplateDir.has(props[i].name)) {
        return true;
      }
    }
  }
  return false;
}
function isComponent({ tag, props }) {
  if (currentOptions.isCustomElement(tag)) {
    return false;
  }
  if (tag === "component" || isUpperCase(tag.charCodeAt(0)) || isCoreComponent(tag) || currentOptions.isBuiltInComponent && currentOptions.isBuiltInComponent(tag) || currentOptions.isNativeTag && !currentOptions.isNativeTag(tag)) {
    return true;
  }
  for (let i = 0; i < props.length; i++) {
    const p = props[i];
    if (p.type === 6) {
      if (p.name === "is" && p.value) {
        if (p.value.content.startsWith("vue:")) {
          return true;
        } else if (checkCompatEnabled(
          "COMPILER_IS_ON_ELEMENT",
          currentOptions,
          p.loc
        )) {
          return true;
        }
      }
    } else if (
      // :is on plain element - only treat as component in compat mode
      p.name === "bind" && isStaticArgOf(p.arg, "is") && checkCompatEnabled(
        "COMPILER_IS_ON_ELEMENT",
        currentOptions,
        p.loc
      )
    ) {
      return true;
    }
  }
  return false;
}
function isUpperCase(c) {
  return c > 64 && c < 91;
}
function condenseWhitespace(nodes, tag) {
  const shouldCondense = currentOptions.whitespace !== "preserve";
  let removedWhitespace = false;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.type === 2) {
      if (!inPre) {
        if (isAllWhitespace(node.content)) {
          const prev = nodes[i - 1] && nodes[i - 1].type;
          const next = nodes[i + 1] && nodes[i + 1].type;
          if (!prev || !next || shouldCondense && (prev === 3 && (next === 3 || next === 1) || prev === 1 && (next === 3 || next === 1 && hasNewlineChar(node.content)))) {
            removedWhitespace = true;
            nodes[i] = null;
          } else {
            node.content = " ";
          }
        } else if (shouldCondense) {
          node.content = condense(node.content);
        }
      } else {
        node.content = node.content.replace(windowsNewlineRE, "\n");
      }
    }
  }
  return removedWhitespace ? nodes.filter(Boolean) : nodes;
}
function isAllWhitespace(str) {
  for (let i = 0; i < str.length; i++) {
    if (!isWhitespace(str.charCodeAt(i))) {
      return false;
    }
  }
  return true;
}
function hasNewlineChar(str) {
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    if (c === 10 || c === 13) {
      return true;
    }
  }
  return false;
}
function condense(str) {
  let ret = "";
  let prevCharIsWhitespace = false;
  for (let i = 0; i < str.length; i++) {
    if (isWhitespace(str.charCodeAt(i))) {
      if (!prevCharIsWhitespace) {
        ret += " ";
        prevCharIsWhitespace = true;
      }
    } else {
      ret += str[i];
      prevCharIsWhitespace = false;
    }
  }
  return ret;
}
function addNode(node) {
  (stack[0] || currentRoot).children.push(node);
}
function getLoc(start, end) {
  return {
    start: tokenizer.getPos(start),
    // @ts-expect-error allow late attachment
    end: end == null ? end : tokenizer.getPos(end),
    // @ts-expect-error allow late attachment
    source: end == null ? end : getSlice(start, end)
  };
}
function cloneLoc(loc) {
  return getLoc(loc.start.offset, loc.end.offset);
}
function setLocEnd(loc, end) {
  loc.end = tokenizer.getPos(end);
  loc.source = getSlice(loc.start.offset, end);
}
function dirToAttr(dir) {
  const attr = {
    type: 6,
    name: dir.rawName,
    nameLoc: getLoc(
      dir.loc.start.offset,
      dir.loc.start.offset + dir.rawName.length
    ),
    value: void 0,
    loc: dir.loc
  };
  if (dir.exp) {
    const loc = dir.exp.loc;
    if (loc.end.offset < dir.loc.end.offset) {
      loc.start.offset--;
      loc.start.column--;
      loc.end.offset++;
      loc.end.column++;
    }
    attr.value = {
      type: 2,
      content: dir.exp.content,
      loc
    };
  }
  return attr;
}
function createExp(content, isStatic = false, loc, constType = 0, parseMode = 0) {
  const exp = createSimpleExpression(content, isStatic, loc, constType);
  return exp;
}
function emitError(code, index, message) {
  currentOptions.onError(
    createCompilerError(code, getLoc(index, index), void 0, message)
  );
}
function reset() {
  tokenizer.reset();
  currentOpenTag = null;
  currentProp = null;
  currentAttrValue = "";
  currentAttrStartIndex = -1;
  currentAttrEndIndex = -1;
  stack.length = 0;
}
function baseParse(input, options) {
  reset();
  currentInput = input;
  currentOptions = extend({}, defaultParserOptions);
  if (options) {
    let key;
    for (key in options) {
      if (options[key] != null) {
        currentOptions[key] = options[key];
      }
    }
  }
  if (true) {
    if (!currentOptions.decodeEntities) {
      throw new Error(
        `[@vue/compiler-core] decodeEntities option is required in browser builds.`
      );
    }
  }
  tokenizer.mode = currentOptions.parseMode === "html" ? 1 : currentOptions.parseMode === "sfc" ? 2 : 0;
  tokenizer.inXML = currentOptions.ns === 1 || currentOptions.ns === 2;
  const delimiters = options && options.delimiters;
  if (delimiters) {
    tokenizer.delimiterOpen = toCharCodes(delimiters[0]);
    tokenizer.delimiterClose = toCharCodes(delimiters[1]);
  }
  const root = currentRoot = createRoot([], input);
  tokenizer.parse(currentInput);
  root.loc = getLoc(0, input.length);
  root.children = condenseWhitespace(root.children);
  currentRoot = null;
  return root;
}
function cacheStatic(root, context) {
  walk(
    root,
    void 0,
    context,
    // Root node is unfortunately non-hoistable due to potential parent
    // fallthrough attributes.
    isSingleElementRoot(root, root.children[0])
  );
}
function isSingleElementRoot(root, child) {
  const { children } = root;
  return children.length === 1 && child.type === 1 && !isSlotOutlet(child);
}
function walk(node, parent, context, doNotHoistNode = false, inFor = false) {
  const { children } = node;
  const toCache = [];
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.type === 1 && child.tagType === 0) {
      const constantType = doNotHoistNode ? 0 : getConstantType(child, context);
      if (constantType > 0) {
        if (constantType >= 2) {
          child.codegenNode.patchFlag = -1;
          toCache.push(child);
          continue;
        }
      } else {
        const codegenNode = child.codegenNode;
        if (codegenNode.type === 13) {
          const flag = codegenNode.patchFlag;
          if ((flag === void 0 || flag === 512 || flag === 1) && getGeneratedPropsConstantType(child, context) >= 2) {
            const props = getNodeProps(child);
            if (props) {
              codegenNode.props = context.hoist(props);
            }
          }
          if (codegenNode.dynamicProps) {
            codegenNode.dynamicProps = context.hoist(codegenNode.dynamicProps);
          }
        }
      }
    } else if (child.type === 12) {
      const constantType = doNotHoistNode ? 0 : getConstantType(child, context);
      if (constantType >= 2) {
        toCache.push(child);
        continue;
      }
    }
    if (child.type === 1) {
      const isComponent2 = child.tagType === 1;
      if (isComponent2) {
        context.scopes.vSlot++;
      }
      walk(child, node, context, false, inFor);
      if (isComponent2) {
        context.scopes.vSlot--;
      }
    } else if (child.type === 11) {
      walk(child, node, context, child.children.length === 1, true);
    } else if (child.type === 9) {
      for (let i2 = 0; i2 < child.branches.length; i2++) {
        walk(
          child.branches[i2],
          node,
          context,
          child.branches[i2].children.length === 1,
          inFor
        );
      }
    }
  }
  let cachedAsArray = false;
  if (toCache.length === children.length && node.type === 1) {
    if (node.tagType === 0 && node.codegenNode && node.codegenNode.type === 13 && isArray(node.codegenNode.children)) {
      node.codegenNode.children = getCacheExpression(
        createArrayExpression(node.codegenNode.children)
      );
      cachedAsArray = true;
    } else if (node.tagType === 1 && node.codegenNode && node.codegenNode.type === 13 && node.codegenNode.children && !isArray(node.codegenNode.children) && node.codegenNode.children.type === 15) {
      const slot = getSlotNode(node.codegenNode, "default");
      if (slot) {
        slot.returns = getCacheExpression(
          createArrayExpression(slot.returns)
        );
        cachedAsArray = true;
      }
    } else if (node.tagType === 3 && parent && parent.type === 1 && parent.tagType === 1 && parent.codegenNode && parent.codegenNode.type === 13 && parent.codegenNode.children && !isArray(parent.codegenNode.children) && parent.codegenNode.children.type === 15) {
      const slotName = findDir(node, "slot", true);
      const slot = slotName && slotName.arg && getSlotNode(parent.codegenNode, slotName.arg);
      if (slot) {
        slot.returns = getCacheExpression(
          createArrayExpression(slot.returns)
        );
        cachedAsArray = true;
      }
    }
  }
  if (!cachedAsArray) {
    for (const child of toCache) {
      child.codegenNode = context.cache(child.codegenNode);
    }
  }
  function getCacheExpression(value) {
    const exp = context.cache(value);
    if (inFor && context.hmr) {
      exp.needArraySpread = true;
    }
    return exp;
  }
  function getSlotNode(node2, name) {
    if (node2.children && !isArray(node2.children) && node2.children.type === 15) {
      const slot = node2.children.properties.find(
        (p) => p.key === name || p.key.content === name
      );
      return slot && slot.value;
    }
  }
  if (toCache.length && context.transformHoist) {
    context.transformHoist(children, context, node);
  }
}
function getConstantType(node, context) {
  const { constantCache } = context;
  switch (node.type) {
    case 1:
      if (node.tagType !== 0) {
        return 0;
      }
      const cached = constantCache.get(node);
      if (cached !== void 0) {
        return cached;
      }
      const codegenNode = node.codegenNode;
      if (codegenNode.type !== 13) {
        return 0;
      }
      if (codegenNode.isBlock && node.tag !== "svg" && node.tag !== "foreignObject" && node.tag !== "math") {
        return 0;
      }
      if (codegenNode.patchFlag === void 0) {
        let returnType2 = 3;
        const generatedPropsType = getGeneratedPropsConstantType(node, context);
        if (generatedPropsType === 0) {
          constantCache.set(node, 0);
          return 0;
        }
        if (generatedPropsType < returnType2) {
          returnType2 = generatedPropsType;
        }
        for (let i = 0; i < node.children.length; i++) {
          const childType = getConstantType(node.children[i], context);
          if (childType === 0) {
            constantCache.set(node, 0);
            return 0;
          }
          if (childType < returnType2) {
            returnType2 = childType;
          }
        }
        if (returnType2 > 1) {
          for (let i = 0; i < node.props.length; i++) {
            const p = node.props[i];
            if (p.type === 7 && p.name === "bind" && p.exp) {
              const expType = getConstantType(p.exp, context);
              if (expType === 0) {
                constantCache.set(node, 0);
                return 0;
              }
              if (expType < returnType2) {
                returnType2 = expType;
              }
            }
          }
        }
        if (codegenNode.isBlock) {
          for (let i = 0; i < node.props.length; i++) {
            const p = node.props[i];
            if (p.type === 7) {
              constantCache.set(node, 0);
              return 0;
            }
          }
          context.removeHelper(OPEN_BLOCK);
          context.removeHelper(
            getVNodeBlockHelper(context.inSSR, codegenNode.isComponent)
          );
          codegenNode.isBlock = false;
          context.helper(getVNodeHelper(context.inSSR, codegenNode.isComponent));
        }
        constantCache.set(node, returnType2);
        return returnType2;
      } else {
        constantCache.set(node, 0);
        return 0;
      }
    case 2:
    case 3:
      return 3;
    case 9:
    case 11:
    case 10:
      return 0;
    case 5:
    case 12:
      return getConstantType(node.content, context);
    case 4:
      return node.constType;
    case 8:
      let returnType = 3;
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (isString(child) || isSymbol(child)) {
          continue;
        }
        const childType = getConstantType(child, context);
        if (childType === 0) {
          return 0;
        } else if (childType < returnType) {
          returnType = childType;
        }
      }
      return returnType;
    case 20:
      return 2;
    default:
      if (true) ;
      return 0;
  }
}
function getConstantTypeOfHelperCall(value, context) {
  if (value.type === 14 && !isString(value.callee) && allowHoistedHelperSet.has(value.callee)) {
    const arg = value.arguments[0];
    if (arg.type === 4) {
      return getConstantType(arg, context);
    } else if (arg.type === 14) {
      return getConstantTypeOfHelperCall(arg, context);
    }
  }
  return 0;
}
function getGeneratedPropsConstantType(node, context) {
  let returnType = 3;
  const props = getNodeProps(node);
  if (props && props.type === 15) {
    const { properties } = props;
    for (let i = 0; i < properties.length; i++) {
      const { key, value } = properties[i];
      const keyType = getConstantType(key, context);
      if (keyType === 0) {
        return keyType;
      }
      if (keyType < returnType) {
        returnType = keyType;
      }
      let valueType;
      if (value.type === 4) {
        valueType = getConstantType(value, context);
      } else if (value.type === 14) {
        valueType = getConstantTypeOfHelperCall(value, context);
      } else {
        valueType = 0;
      }
      if (valueType === 0) {
        return valueType;
      }
      if (valueType < returnType) {
        returnType = valueType;
      }
    }
  }
  return returnType;
}
function getNodeProps(node) {
  const codegenNode = node.codegenNode;
  if (codegenNode.type === 13) {
    return codegenNode.props;
  }
}
function createTransformContext(root, {
  filename = "",
  prefixIdentifiers = false,
  hoistStatic = false,
  hmr = false,
  cacheHandlers = false,
  nodeTransforms = [],
  directiveTransforms = {},
  transformHoist = null,
  isBuiltInComponent = NOOP,
  isCustomElement = NOOP,
  expressionPlugins = [],
  scopeId = null,
  slotted = true,
  ssr = false,
  inSSR = false,
  ssrCssVars = ``,
  bindingMetadata = EMPTY_OBJ,
  inline = false,
  isTS = false,
  onError = defaultOnError,
  onWarn = defaultOnWarn,
  compatConfig
}) {
  const nameMatch = filename.replace(/\?.*$/, "").match(/([^/\\]+)\.\w+$/);
  const context = {
    // options
    filename,
    selfName: nameMatch && capitalize(camelize(nameMatch[1])),
    prefixIdentifiers,
    hoistStatic,
    hmr,
    cacheHandlers,
    nodeTransforms,
    directiveTransforms,
    transformHoist,
    isBuiltInComponent,
    isCustomElement,
    expressionPlugins,
    scopeId,
    slotted,
    ssr,
    inSSR,
    ssrCssVars,
    bindingMetadata,
    inline,
    isTS,
    onError,
    onWarn,
    compatConfig,
    // state
    root,
    helpers: /* @__PURE__ */ new Map(),
    components: /* @__PURE__ */ new Set(),
    directives: /* @__PURE__ */ new Set(),
    hoists: [],
    imports: [],
    cached: [],
    constantCache: /* @__PURE__ */ new WeakMap(),
    temps: 0,
    identifiers: /* @__PURE__ */ Object.create(null),
    scopes: {
      vFor: 0,
      vSlot: 0,
      vPre: 0,
      vOnce: 0
    },
    parent: null,
    grandParent: null,
    currentNode: root,
    childIndex: 0,
    inVOnce: false,
    // methods
    helper(name) {
      const count = context.helpers.get(name) || 0;
      context.helpers.set(name, count + 1);
      return name;
    },
    removeHelper(name) {
      const count = context.helpers.get(name);
      if (count) {
        const currentCount = count - 1;
        if (!currentCount) {
          context.helpers.delete(name);
        } else {
          context.helpers.set(name, currentCount);
        }
      }
    },
    helperString(name) {
      return `_${helperNameMap[context.helper(name)]}`;
    },
    replaceNode(node) {
      if (true) {
        if (!context.currentNode) {
          throw new Error(`Node being replaced is already removed.`);
        }
        if (!context.parent) {
          throw new Error(`Cannot replace root node.`);
        }
      }
      context.parent.children[context.childIndex] = context.currentNode = node;
    },
    removeNode(node) {
      if (!context.parent) {
        throw new Error(`Cannot remove root node.`);
      }
      const list = context.parent.children;
      const removalIndex = node ? list.indexOf(node) : context.currentNode ? context.childIndex : -1;
      if (removalIndex < 0) {
        throw new Error(`node being removed is not a child of current parent`);
      }
      if (!node || node === context.currentNode) {
        context.currentNode = null;
        context.onNodeRemoved();
      } else {
        if (context.childIndex > removalIndex) {
          context.childIndex--;
          context.onNodeRemoved();
        }
      }
      context.parent.children.splice(removalIndex, 1);
    },
    onNodeRemoved: NOOP,
    addIdentifiers(exp) {
    },
    removeIdentifiers(exp) {
    },
    hoist(exp) {
      if (isString(exp)) exp = createSimpleExpression(exp);
      context.hoists.push(exp);
      const identifier = createSimpleExpression(
        `_hoisted_${context.hoists.length}`,
        false,
        exp.loc,
        2
      );
      identifier.hoisted = exp;
      return identifier;
    },
    cache(exp, isVNode = false, inVOnce = false) {
      const cacheExp = createCacheExpression(
        context.cached.length,
        exp,
        isVNode,
        inVOnce
      );
      context.cached.push(cacheExp);
      return cacheExp;
    }
  };
  {
    context.filters = /* @__PURE__ */ new Set();
  }
  return context;
}
function transform(root, options) {
  const context = createTransformContext(root, options);
  traverseNode(root, context);
  if (options.hoistStatic) {
    cacheStatic(root, context);
  }
  if (!options.ssr) {
    createRootCodegen(root, context);
  }
  root.helpers = /* @__PURE__ */ new Set([...context.helpers.keys()]);
  root.components = [...context.components];
  root.directives = [...context.directives];
  root.imports = context.imports;
  root.hoists = context.hoists;
  root.temps = context.temps;
  root.cached = context.cached;
  root.transformed = true;
  {
    root.filters = [...context.filters];
  }
}
function createRootCodegen(root, context) {
  const { helper } = context;
  const { children } = root;
  if (children.length === 1) {
    const child = children[0];
    if (isSingleElementRoot(root, child) && child.codegenNode) {
      const codegenNode = child.codegenNode;
      if (codegenNode.type === 13) {
        convertToBlock(codegenNode, context);
      }
      root.codegenNode = codegenNode;
    } else {
      root.codegenNode = child;
    }
  } else if (children.length > 1) {
    let patchFlag = 64;
    if (children.filter((c) => c.type !== 3).length === 1) {
      patchFlag |= 2048;
    }
    root.codegenNode = createVNodeCall(
      context,
      helper(FRAGMENT),
      void 0,
      root.children,
      patchFlag,
      void 0,
      void 0,
      true,
      void 0,
      false
    );
  } else ;
}
function traverseChildren(parent, context) {
  let i = 0;
  const nodeRemoved = () => {
    i--;
  };
  for (; i < parent.children.length; i++) {
    const child = parent.children[i];
    if (isString(child)) continue;
    context.grandParent = context.parent;
    context.parent = parent;
    context.childIndex = i;
    context.onNodeRemoved = nodeRemoved;
    traverseNode(child, context);
  }
}
function traverseNode(node, context) {
  context.currentNode = node;
  const { nodeTransforms } = context;
  const exitFns = [];
  for (let i2 = 0; i2 < nodeTransforms.length; i2++) {
    const onExit = nodeTransforms[i2](node, context);
    if (onExit) {
      if (isArray(onExit)) {
        exitFns.push(...onExit);
      } else {
        exitFns.push(onExit);
      }
    }
    if (!context.currentNode) {
      return;
    } else {
      node = context.currentNode;
    }
  }
  switch (node.type) {
    case 3:
      if (!context.ssr) {
        context.helper(CREATE_COMMENT);
      }
      break;
    case 5:
      if (!context.ssr) {
        context.helper(TO_DISPLAY_STRING);
      }
      break;
    // for container types, further traverse downwards
    case 9:
      for (let i2 = 0; i2 < node.branches.length; i2++) {
        traverseNode(node.branches[i2], context);
      }
      break;
    case 10:
    case 11:
    case 1:
    case 0:
      traverseChildren(node, context);
      break;
  }
  context.currentNode = node;
  let i = exitFns.length;
  while (i--) {
    exitFns[i]();
  }
}
function createStructuralDirectiveTransform(name, fn) {
  const matches = isString(name) ? (n) => n === name : (n) => name.test(n);
  return (node, context) => {
    if (node.type === 1) {
      const { props } = node;
      if (node.tagType === 3 && props.some(isVSlot)) {
        return;
      }
      const exitFns = [];
      for (let i = 0; i < props.length; i++) {
        const prop = props[i];
        if (prop.type === 7 && matches(prop.name)) {
          props.splice(i, 1);
          i--;
          const onExit = fn(node, prop, context);
          if (onExit) exitFns.push(onExit);
        }
      }
      return exitFns;
    }
  };
}
function createCodegenContext(ast, {
  mode = "function",
  prefixIdentifiers = mode === "module",
  sourceMap = false,
  filename = `template.vue.html`,
  scopeId = null,
  optimizeImports = false,
  runtimeGlobalName = `Vue`,
  runtimeModuleName = `vue`,
  ssrRuntimeModuleName = "vue/server-renderer",
  ssr = false,
  isTS = false,
  inSSR = false
}) {
  const context = {
    mode,
    prefixIdentifiers,
    sourceMap,
    filename,
    scopeId,
    optimizeImports,
    runtimeGlobalName,
    runtimeModuleName,
    ssrRuntimeModuleName,
    ssr,
    isTS,
    inSSR,
    source: ast.source,
    code: ``,
    column: 1,
    line: 1,
    offset: 0,
    indentLevel: 0,
    pure: false,
    map: void 0,
    helper(key) {
      return `_${helperNameMap[key]}`;
    },
    push(code, newlineIndex = -2, node) {
      context.code += code;
    },
    indent() {
      newline(++context.indentLevel);
    },
    deindent(withoutNewLine = false) {
      if (withoutNewLine) {
        --context.indentLevel;
      } else {
        newline(--context.indentLevel);
      }
    },
    newline() {
      newline(context.indentLevel);
    }
  };
  function newline(n) {
    context.push(
      "\n" + `  `.repeat(n),
      0
      /* Start */
    );
  }
  return context;
}
function generate(ast, options = {}) {
  const context = createCodegenContext(ast, options);
  if (options.onContextCreated) options.onContextCreated(context);
  const {
    mode,
    push,
    prefixIdentifiers,
    indent,
    deindent,
    newline,
    scopeId,
    ssr
  } = context;
  const helpers = Array.from(ast.helpers);
  const hasHelpers = helpers.length > 0;
  const useWithBlock = !prefixIdentifiers && mode !== "module";
  const preambleContext = context;
  {
    genFunctionPreamble(ast, preambleContext);
  }
  const functionName = ssr ? `ssrRender` : `render`;
  const args = ssr ? ["_ctx", "_push", "_parent", "_attrs"] : ["_ctx", "_cache"];
  const signature = args.join(", ");
  {
    push(`function ${functionName}(${signature}) {`);
  }
  indent();
  if (useWithBlock) {
    push(`with (_ctx) {`);
    indent();
    if (hasHelpers) {
      push(
        `const { ${helpers.map(aliasHelper).join(", ")} } = _Vue
`,
        -1
        /* End */
      );
      newline();
    }
  }
  if (ast.components.length) {
    genAssets(ast.components, "component", context);
    if (ast.directives.length || ast.temps > 0) {
      newline();
    }
  }
  if (ast.directives.length) {
    genAssets(ast.directives, "directive", context);
    if (ast.temps > 0) {
      newline();
    }
  }
  if (ast.filters && ast.filters.length) {
    newline();
    genAssets(ast.filters, "filter", context);
    newline();
  }
  if (ast.temps > 0) {
    push(`let `);
    for (let i = 0; i < ast.temps; i++) {
      push(`${i > 0 ? `, ` : ``}_temp${i}`);
    }
  }
  if (ast.components.length || ast.directives.length || ast.temps) {
    push(
      `
`,
      0
      /* Start */
    );
    newline();
  }
  if (!ssr) {
    push(`return `);
  }
  if (ast.codegenNode) {
    genNode(ast.codegenNode, context);
  } else {
    push(`null`);
  }
  if (useWithBlock) {
    deindent();
    push(`}`);
  }
  deindent();
  push(`}`);
  return {
    ast,
    code: context.code,
    preamble: ``,
    map: context.map ? context.map.toJSON() : void 0
  };
}
function genFunctionPreamble(ast, context) {
  const {
    ssr,
    prefixIdentifiers,
    push,
    newline,
    runtimeModuleName,
    runtimeGlobalName,
    ssrRuntimeModuleName
  } = context;
  const VueBinding = runtimeGlobalName;
  const helpers = Array.from(ast.helpers);
  if (helpers.length > 0) {
    {
      push(
        `const _Vue = ${VueBinding}
`,
        -1
        /* End */
      );
      if (ast.hoists.length) {
        const staticHelpers = [
          CREATE_VNODE,
          CREATE_ELEMENT_VNODE,
          CREATE_COMMENT,
          CREATE_TEXT,
          CREATE_STATIC
        ].filter((helper) => helpers.includes(helper)).map(aliasHelper).join(", ");
        push(
          `const { ${staticHelpers} } = _Vue
`,
          -1
          /* End */
        );
      }
    }
  }
  genHoists(ast.hoists, context);
  newline();
  push(`return `);
}
function genAssets(assets, type, { helper, push, newline, isTS }) {
  const resolver = helper(
    type === "filter" ? RESOLVE_FILTER : type === "component" ? RESOLVE_COMPONENT : RESOLVE_DIRECTIVE
  );
  for (let i = 0; i < assets.length; i++) {
    let id = assets[i];
    const maybeSelfReference = id.endsWith("__self");
    if (maybeSelfReference) {
      id = id.slice(0, -6);
    }
    push(
      `const ${toValidAssetId(id, type)} = ${resolver}(${JSON.stringify(id)}${maybeSelfReference ? `, true` : ``})${isTS ? `!` : ``}`
    );
    if (i < assets.length - 1) {
      newline();
    }
  }
}
function genHoists(hoists, context) {
  if (!hoists.length) {
    return;
  }
  context.pure = true;
  const { push, newline } = context;
  newline();
  for (let i = 0; i < hoists.length; i++) {
    const exp = hoists[i];
    if (exp) {
      push(`const _hoisted_${i + 1} = `);
      genNode(exp, context);
      newline();
    }
  }
  context.pure = false;
}
function isText(n) {
  return isString(n) || n.type === 4 || n.type === 2 || n.type === 5 || n.type === 8;
}
function genNodeListAsArray(nodes, context) {
  const multilines = nodes.length > 3 || nodes.some((n) => isArray(n) || !isText(n));
  context.push(`[`);
  multilines && context.indent();
  genNodeList(nodes, context, multilines);
  multilines && context.deindent();
  context.push(`]`);
}
function genNodeList(nodes, context, multilines = false, comma = true) {
  const { push, newline } = context;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (isString(node)) {
      push(
        node,
        -3
        /* Unknown */
      );
    } else if (isArray(node)) {
      genNodeListAsArray(node, context);
    } else {
      genNode(node, context);
    }
    if (i < nodes.length - 1) {
      if (multilines) {
        comma && push(",");
        newline();
      } else {
        comma && push(", ");
      }
    }
  }
}
function genNode(node, context) {
  if (isString(node)) {
    context.push(
      node,
      -3
      /* Unknown */
    );
    return;
  }
  if (isSymbol(node)) {
    context.push(context.helper(node));
    return;
  }
  switch (node.type) {
    case 1:
    case 9:
    case 11:
      assert(
        node.codegenNode != null,
        `Codegen node is missing for element/if/for node. Apply appropriate transforms first.`
      );
      genNode(node.codegenNode, context);
      break;
    case 2:
      genText(node, context);
      break;
    case 4:
      genExpression(node, context);
      break;
    case 5:
      genInterpolation(node, context);
      break;
    case 12:
      genNode(node.codegenNode, context);
      break;
    case 8:
      genCompoundExpression(node, context);
      break;
    case 3:
      genComment(node, context);
      break;
    case 13:
      genVNodeCall(node, context);
      break;
    case 14:
      genCallExpression(node, context);
      break;
    case 15:
      genObjectExpression(node, context);
      break;
    case 17:
      genArrayExpression(node, context);
      break;
    case 18:
      genFunctionExpression(node, context);
      break;
    case 19:
      genConditionalExpression(node, context);
      break;
    case 20:
      genCacheExpression(node, context);
      break;
    case 21:
      genNodeList(node.body, context, true, false);
      break;
    // SSR only types
    case 22:
      break;
    case 23:
      break;
    case 24:
      break;
    case 25:
      break;
    case 26:
      break;
    /* v8 ignore start */
    case 10:
      break;
    default:
      if (true) {
        assert(false, `unhandled codegen node type: ${node.type}`);
        const exhaustiveCheck = node;
        return exhaustiveCheck;
      }
  }
}
function genText(node, context) {
  context.push(JSON.stringify(node.content), -3, node);
}
function genExpression(node, context) {
  const { content, isStatic } = node;
  context.push(
    isStatic ? JSON.stringify(content) : content,
    -3,
    node
  );
}
function genInterpolation(node, context) {
  const { push, helper, pure } = context;
  if (pure) push(PURE_ANNOTATION);
  push(`${helper(TO_DISPLAY_STRING)}(`);
  genNode(node.content, context);
  push(`)`);
}
function genCompoundExpression(node, context) {
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    if (isString(child)) {
      context.push(
        child,
        -3
        /* Unknown */
      );
    } else {
      genNode(child, context);
    }
  }
}
function genExpressionAsPropertyKey(node, context) {
  const { push } = context;
  if (node.type === 8) {
    push(`[`);
    genCompoundExpression(node, context);
    push(`]`);
  } else if (node.isStatic) {
    const text = isSimpleIdentifier(node.content) ? node.content : JSON.stringify(node.content);
    push(text, -2, node);
  } else {
    push(`[${node.content}]`, -3, node);
  }
}
function genComment(node, context) {
  const { push, helper, pure } = context;
  if (pure) {
    push(PURE_ANNOTATION);
  }
  push(
    `${helper(CREATE_COMMENT)}(${JSON.stringify(node.content)})`,
    -3,
    node
  );
}
function genVNodeCall(node, context) {
  const { push, helper, pure } = context;
  const {
    tag,
    props,
    children,
    patchFlag,
    dynamicProps,
    directives,
    isBlock,
    disableTracking,
    isComponent: isComponent2
  } = node;
  let patchFlagString;
  if (patchFlag) {
    if (true) {
      if (patchFlag < 0) {
        patchFlagString = patchFlag + ` /* ${PatchFlagNames[patchFlag]} */`;
      } else {
        const flagNames = Object.keys(PatchFlagNames).map(Number).filter((n) => n > 0 && patchFlag & n).map((n) => PatchFlagNames[n]).join(`, `);
        patchFlagString = patchFlag + ` /* ${flagNames} */`;
      }
    } else {
      patchFlagString = String(patchFlag);
    }
  }
  if (directives) {
    push(helper(WITH_DIRECTIVES) + `(`);
  }
  if (isBlock) {
    push(`(${helper(OPEN_BLOCK)}(${disableTracking ? `true` : ``}), `);
  }
  if (pure) {
    push(PURE_ANNOTATION);
  }
  const callHelper = isBlock ? getVNodeBlockHelper(context.inSSR, isComponent2) : getVNodeHelper(context.inSSR, isComponent2);
  push(helper(callHelper) + `(`, -2, node);
  genNodeList(
    genNullableArgs([tag, props, children, patchFlagString, dynamicProps]),
    context
  );
  push(`)`);
  if (isBlock) {
    push(`)`);
  }
  if (directives) {
    push(`, `);
    genNode(directives, context);
    push(`)`);
  }
}
function genNullableArgs(args) {
  let i = args.length;
  while (i--) {
    if (args[i] != null) break;
  }
  return args.slice(0, i + 1).map((arg) => arg || `null`);
}
function genCallExpression(node, context) {
  const { push, helper, pure } = context;
  const callee = isString(node.callee) ? node.callee : helper(node.callee);
  if (pure) {
    push(PURE_ANNOTATION);
  }
  push(callee + `(`, -2, node);
  genNodeList(node.arguments, context);
  push(`)`);
}
function genObjectExpression(node, context) {
  const { push, indent, deindent, newline } = context;
  const { properties } = node;
  if (!properties.length) {
    push(`{}`, -2, node);
    return;
  }
  const multilines = properties.length > 1 || properties.some((p) => p.value.type !== 4);
  push(multilines ? `{` : `{ `);
  multilines && indent();
  for (let i = 0; i < properties.length; i++) {
    const { key, value } = properties[i];
    genExpressionAsPropertyKey(key, context);
    push(`: `);
    genNode(value, context);
    if (i < properties.length - 1) {
      push(`,`);
      newline();
    }
  }
  multilines && deindent();
  push(multilines ? `}` : ` }`);
}
function genArrayExpression(node, context) {
  genNodeListAsArray(node.elements, context);
}
function genFunctionExpression(node, context) {
  const { push, indent, deindent } = context;
  const { params, returns, body, newline, isSlot } = node;
  if (isSlot) {
    push(`_${helperNameMap[WITH_CTX]}(`);
  }
  push(`(`, -2, node);
  if (isArray(params)) {
    genNodeList(params, context);
  } else if (params) {
    genNode(params, context);
  }
  push(`) => `);
  if (newline || body) {
    push(`{`);
    indent();
  }
  if (returns) {
    if (newline) {
      push(`return `);
    }
    if (isArray(returns)) {
      genNodeListAsArray(returns, context);
    } else {
      genNode(returns, context);
    }
  } else if (body) {
    genNode(body, context);
  }
  if (newline || body) {
    deindent();
    push(`}`);
  }
  if (isSlot) {
    if (node.isNonScopedSlot) {
      push(`, undefined, true`);
    }
    push(`)`);
  }
}
function genConditionalExpression(node, context) {
  const { test, consequent, alternate, newline: needNewline } = node;
  const { push, indent, deindent, newline } = context;
  if (test.type === 4) {
    const needsParens = !isSimpleIdentifier(test.content);
    needsParens && push(`(`);
    genExpression(test, context);
    needsParens && push(`)`);
  } else {
    push(`(`);
    genNode(test, context);
    push(`)`);
  }
  needNewline && indent();
  context.indentLevel++;
  needNewline || push(` `);
  push(`? `);
  genNode(consequent, context);
  context.indentLevel--;
  needNewline && newline();
  needNewline || push(` `);
  push(`: `);
  const isNested = alternate.type === 19;
  if (!isNested) {
    context.indentLevel++;
  }
  genNode(alternate, context);
  if (!isNested) {
    context.indentLevel--;
  }
  needNewline && deindent(
    true
    /* without newline */
  );
}
function genCacheExpression(node, context) {
  const { push, helper, indent, deindent, newline } = context;
  const { needPauseTracking, needArraySpread } = node;
  if (needArraySpread) {
    push(`[...(`);
  }
  push(`_cache[${node.index}] || (`);
  if (needPauseTracking) {
    indent();
    push(`${helper(SET_BLOCK_TRACKING)}(-1`);
    if (node.inVOnce) push(`, true`);
    push(`),`);
    newline();
    push(`(`);
  }
  push(`_cache[${node.index}] = `);
  genNode(node.value, context);
  if (needPauseTracking) {
    push(`).cacheIndex = ${node.index},`);
    newline();
    push(`${helper(SET_BLOCK_TRACKING)}(1),`);
    newline();
    push(`_cache[${node.index}]`);
    deindent();
  }
  push(`)`);
  if (needArraySpread) {
    push(`)]`);
  }
}
function validateBrowserExpression(node, context, asParams = false, asRawStatements = false) {
  const exp = node.content;
  if (!exp.trim()) {
    return;
  }
  try {
    new Function(
      asRawStatements ? ` ${exp} ` : `return ${asParams ? `(${exp}) => {}` : `(${exp})`}`
    );
  } catch (e) {
    let message = e.message;
    const keywordMatch = exp.replace(stripStringRE, "").match(prohibitedKeywordRE);
    if (keywordMatch) {
      message = `avoid using JavaScript keyword as property name: "${keywordMatch[0]}"`;
    }
    context.onError(
      createCompilerError(
        45,
        node.loc,
        void 0,
        message
      )
    );
  }
}
function processExpression(node, context, asParams = false, asRawStatements = false, localVars = Object.create(context.identifiers)) {
  {
    if (true) {
      validateBrowserExpression(node, context, asParams, asRawStatements);
    }
    return node;
  }
}
function stringifyExpression(exp) {
  if (isString(exp)) {
    return exp;
  } else if (exp.type === 4) {
    return exp.content;
  } else {
    return exp.children.map(stringifyExpression).join("");
  }
}
function processIf(node, dir, context, processCodegen) {
  if (dir.name !== "else" && (!dir.exp || !dir.exp.content.trim())) {
    const loc = dir.exp ? dir.exp.loc : node.loc;
    context.onError(
      createCompilerError(28, dir.loc)
    );
    dir.exp = createSimpleExpression(`true`, false, loc);
  }
  if (dir.exp) {
    validateBrowserExpression(dir.exp, context);
  }
  if (dir.name === "if") {
    const branch = createIfBranch(node, dir);
    const ifNode = {
      type: 9,
      loc: cloneLoc(node.loc),
      branches: [branch]
    };
    context.replaceNode(ifNode);
    if (processCodegen) {
      return processCodegen(ifNode, branch, true);
    }
  } else {
    const siblings = context.parent.children;
    const comments = [];
    let i = siblings.indexOf(node);
    while (i-- >= -1) {
      const sibling = siblings[i];
      if (sibling && sibling.type === 3) {
        context.removeNode(sibling);
        comments.unshift(sibling);
        continue;
      }
      if (sibling && sibling.type === 2 && !sibling.content.trim().length) {
        context.removeNode(sibling);
        continue;
      }
      if (sibling && sibling.type === 9) {
        if (dir.name === "else-if" && sibling.branches[sibling.branches.length - 1].condition === void 0) {
          context.onError(
            createCompilerError(30, node.loc)
          );
        }
        context.removeNode();
        const branch = createIfBranch(node, dir);
        if (comments.length && // #3619 ignore comments if the v-if is direct child of <transition>
        !(context.parent && context.parent.type === 1 && (context.parent.tag === "transition" || context.parent.tag === "Transition"))) {
          branch.children = [...comments, ...branch.children];
        }
        if (true) {
          const key = branch.userKey;
          if (key) {
            sibling.branches.forEach(({ userKey }) => {
              if (isSameKey(userKey, key)) {
                context.onError(
                  createCompilerError(
                    29,
                    branch.userKey.loc
                  )
                );
              }
            });
          }
        }
        sibling.branches.push(branch);
        const onExit = processCodegen && processCodegen(sibling, branch, false);
        traverseNode(branch, context);
        if (onExit) onExit();
        context.currentNode = null;
      } else {
        context.onError(
          createCompilerError(30, node.loc)
        );
      }
      break;
    }
  }
}
function createIfBranch(node, dir) {
  const isTemplateIf = node.tagType === 3;
  return {
    type: 10,
    loc: node.loc,
    condition: dir.name === "else" ? void 0 : dir.exp,
    children: isTemplateIf && !findDir(node, "for") ? node.children : [node],
    userKey: findProp(node, `key`),
    isTemplateIf
  };
}
function createCodegenNodeForBranch(branch, keyIndex, context) {
  if (branch.condition) {
    return createConditionalExpression(
      branch.condition,
      createChildrenCodegenNode(branch, keyIndex, context),
      // make sure to pass in asBlock: true so that the comment node call
      // closes the current block.
      createCallExpression(context.helper(CREATE_COMMENT), [
        true ? '"v-if"' : '""',
        "true"
      ])
    );
  } else {
    return createChildrenCodegenNode(branch, keyIndex, context);
  }
}
function createChildrenCodegenNode(branch, keyIndex, context) {
  const { helper } = context;
  const keyProperty = createObjectProperty(
    `key`,
    createSimpleExpression(
      `${keyIndex}`,
      false,
      locStub,
      2
    )
  );
  const { children } = branch;
  const firstChild = children[0];
  const needFragmentWrapper = children.length !== 1 || firstChild.type !== 1;
  if (needFragmentWrapper) {
    if (children.length === 1 && firstChild.type === 11) {
      const vnodeCall = firstChild.codegenNode;
      injectProp(vnodeCall, keyProperty, context);
      return vnodeCall;
    } else {
      let patchFlag = 64;
      if (!branch.isTemplateIf && children.filter((c) => c.type !== 3).length === 1) {
        patchFlag |= 2048;
      }
      return createVNodeCall(
        context,
        helper(FRAGMENT),
        createObjectExpression([keyProperty]),
        children,
        patchFlag,
        void 0,
        void 0,
        true,
        false,
        false,
        branch.loc
      );
    }
  } else {
    const ret = firstChild.codegenNode;
    const vnodeCall = getMemoedVNodeCall(ret);
    if (vnodeCall.type === 13) {
      convertToBlock(vnodeCall, context);
    }
    injectProp(vnodeCall, keyProperty, context);
    return ret;
  }
}
function isSameKey(a, b) {
  if (!a || a.type !== b.type) {
    return false;
  }
  if (a.type === 6) {
    if (a.value.content !== b.value.content) {
      return false;
    }
  } else {
    const exp = a.exp;
    const branchExp = b.exp;
    if (exp.type !== branchExp.type) {
      return false;
    }
    if (exp.type !== 4 || exp.isStatic !== branchExp.isStatic || exp.content !== branchExp.content) {
      return false;
    }
  }
  return true;
}
function getParentCondition(node) {
  while (true) {
    if (node.type === 19) {
      if (node.alternate.type === 19) {
        node = node.alternate;
      } else {
        return node;
      }
    } else if (node.type === 20) {
      node = node.value;
    }
  }
}
function processFor(node, dir, context, processCodegen) {
  if (!dir.exp) {
    context.onError(
      createCompilerError(31, dir.loc)
    );
    return;
  }
  const parseResult = dir.forParseResult;
  if (!parseResult) {
    context.onError(
      createCompilerError(32, dir.loc)
    );
    return;
  }
  finalizeForParseResult(parseResult, context);
  const { addIdentifiers, removeIdentifiers, scopes } = context;
  const { source, value, key, index } = parseResult;
  const forNode = {
    type: 11,
    loc: dir.loc,
    source,
    valueAlias: value,
    keyAlias: key,
    objectIndexAlias: index,
    parseResult,
    children: isTemplateNode(node) ? node.children : [node]
  };
  context.replaceNode(forNode);
  scopes.vFor++;
  const onExit = processCodegen && processCodegen(forNode);
  return () => {
    scopes.vFor--;
    if (onExit) onExit();
  };
}
function finalizeForParseResult(result, context) {
  if (result.finalized) return;
  if (true) {
    validateBrowserExpression(result.source, context);
    if (result.key) {
      validateBrowserExpression(
        result.key,
        context,
        true
      );
    }
    if (result.index) {
      validateBrowserExpression(
        result.index,
        context,
        true
      );
    }
    if (result.value) {
      validateBrowserExpression(
        result.value,
        context,
        true
      );
    }
  }
  result.finalized = true;
}
function createForLoopParams({ value, key, index }, memoArgs = []) {
  return createParamsList([value, key, index, ...memoArgs]);
}
function createParamsList(args) {
  let i = args.length;
  while (i--) {
    if (args[i]) break;
  }
  return args.slice(0, i + 1).map((arg, i2) => arg || createSimpleExpression(`_`.repeat(i2 + 1), false));
}
function buildSlots(node, context, buildSlotFn = buildClientSlotFn) {
  context.helper(WITH_CTX);
  const { children, loc } = node;
  const slotsProperties = [];
  const dynamicSlots = [];
  let hasDynamicSlots = context.scopes.vSlot > 0 || context.scopes.vFor > 0;
  const onComponentSlot = findDir(node, "slot", true);
  if (onComponentSlot) {
    const { arg, exp } = onComponentSlot;
    if (arg && !isStaticExp(arg)) {
      hasDynamicSlots = true;
    }
    slotsProperties.push(
      createObjectProperty(
        arg || createSimpleExpression("default", true),
        buildSlotFn(exp, void 0, children, loc)
      )
    );
  }
  let hasTemplateSlots = false;
  let hasNamedDefaultSlot = false;
  const implicitDefaultChildren = [];
  const seenSlotNames = /* @__PURE__ */ new Set();
  let conditionalBranchIndex = 0;
  for (let i = 0; i < children.length; i++) {
    const slotElement = children[i];
    let slotDir;
    if (!isTemplateNode(slotElement) || !(slotDir = findDir(slotElement, "slot", true))) {
      if (slotElement.type !== 3) {
        implicitDefaultChildren.push(slotElement);
      }
      continue;
    }
    if (onComponentSlot) {
      context.onError(
        createCompilerError(37, slotDir.loc)
      );
      break;
    }
    hasTemplateSlots = true;
    const { children: slotChildren, loc: slotLoc } = slotElement;
    const {
      arg: slotName = createSimpleExpression(`default`, true),
      exp: slotProps,
      loc: dirLoc
    } = slotDir;
    let staticSlotName;
    if (isStaticExp(slotName)) {
      staticSlotName = slotName ? slotName.content : `default`;
    } else {
      hasDynamicSlots = true;
    }
    const vFor = findDir(slotElement, "for");
    const slotFunction = buildSlotFn(slotProps, vFor, slotChildren, slotLoc);
    let vIf;
    let vElse;
    if (vIf = findDir(slotElement, "if")) {
      hasDynamicSlots = true;
      dynamicSlots.push(
        createConditionalExpression(
          vIf.exp,
          buildDynamicSlot(slotName, slotFunction, conditionalBranchIndex++),
          defaultFallback
        )
      );
    } else if (vElse = findDir(
      slotElement,
      /^else(-if)?$/,
      true
      /* allowEmpty */
    )) {
      let j = i;
      let prev;
      while (j--) {
        prev = children[j];
        if (prev.type !== 3) {
          break;
        }
      }
      if (prev && isTemplateNode(prev) && findDir(prev, /^(else-)?if$/)) {
        let conditional = dynamicSlots[dynamicSlots.length - 1];
        while (conditional.alternate.type === 19) {
          conditional = conditional.alternate;
        }
        conditional.alternate = vElse.exp ? createConditionalExpression(
          vElse.exp,
          buildDynamicSlot(
            slotName,
            slotFunction,
            conditionalBranchIndex++
          ),
          defaultFallback
        ) : buildDynamicSlot(slotName, slotFunction, conditionalBranchIndex++);
      } else {
        context.onError(
          createCompilerError(30, vElse.loc)
        );
      }
    } else if (vFor) {
      hasDynamicSlots = true;
      const parseResult = vFor.forParseResult;
      if (parseResult) {
        finalizeForParseResult(parseResult, context);
        dynamicSlots.push(
          createCallExpression(context.helper(RENDER_LIST), [
            parseResult.source,
            createFunctionExpression(
              createForLoopParams(parseResult),
              buildDynamicSlot(slotName, slotFunction),
              true
            )
          ])
        );
      } else {
        context.onError(
          createCompilerError(
            32,
            vFor.loc
          )
        );
      }
    } else {
      if (staticSlotName) {
        if (seenSlotNames.has(staticSlotName)) {
          context.onError(
            createCompilerError(
              38,
              dirLoc
            )
          );
          continue;
        }
        seenSlotNames.add(staticSlotName);
        if (staticSlotName === "default") {
          hasNamedDefaultSlot = true;
        }
      }
      slotsProperties.push(createObjectProperty(slotName, slotFunction));
    }
  }
  if (!onComponentSlot) {
    const buildDefaultSlotProperty = (props, children2) => {
      const fn = buildSlotFn(props, void 0, children2, loc);
      if (context.compatConfig) {
        fn.isNonScopedSlot = true;
      }
      return createObjectProperty(`default`, fn);
    };
    if (!hasTemplateSlots) {
      slotsProperties.push(buildDefaultSlotProperty(void 0, children));
    } else if (implicitDefaultChildren.length && // #3766
    // with whitespace: 'preserve', whitespaces between slots will end up in
    // implicitDefaultChildren. Ignore if all implicit children are whitespaces.
    implicitDefaultChildren.some((node2) => isNonWhitespaceContent(node2))) {
      if (hasNamedDefaultSlot) {
        context.onError(
          createCompilerError(
            39,
            implicitDefaultChildren[0].loc
          )
        );
      } else {
        slotsProperties.push(
          buildDefaultSlotProperty(void 0, implicitDefaultChildren)
        );
      }
    }
  }
  const slotFlag = hasDynamicSlots ? 2 : hasForwardedSlots(node.children) ? 3 : 1;
  let slots = createObjectExpression(
    slotsProperties.concat(
      createObjectProperty(
        `_`,
        // 2 = compiled but dynamic = can skip normalization, but must run diff
        // 1 = compiled and static = can skip normalization AND diff as optimized
        createSimpleExpression(
          slotFlag + (true ? ` /* ${slotFlagsText[slotFlag]} */` : ``),
          false
        )
      )
    ),
    loc
  );
  if (dynamicSlots.length) {
    slots = createCallExpression(context.helper(CREATE_SLOTS), [
      slots,
      createArrayExpression(dynamicSlots)
    ]);
  }
  return {
    slots,
    hasDynamicSlots
  };
}
function buildDynamicSlot(name, fn, index) {
  const props = [
    createObjectProperty(`name`, name),
    createObjectProperty(`fn`, fn)
  ];
  if (index != null) {
    props.push(
      createObjectProperty(`key`, createSimpleExpression(String(index), true))
    );
  }
  return createObjectExpression(props);
}
function hasForwardedSlots(children) {
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    switch (child.type) {
      case 1:
        if (child.tagType === 2 || hasForwardedSlots(child.children)) {
          return true;
        }
        break;
      case 9:
        if (hasForwardedSlots(child.branches)) return true;
        break;
      case 10:
      case 11:
        if (hasForwardedSlots(child.children)) return true;
        break;
    }
  }
  return false;
}
function isNonWhitespaceContent(node) {
  if (node.type !== 2 && node.type !== 12)
    return true;
  return node.type === 2 ? !!node.content.trim() : isNonWhitespaceContent(node.content);
}
function resolveComponentType(node, context, ssr = false) {
  let { tag } = node;
  const isExplicitDynamic = isComponentTag(tag);
  const isProp = findProp(
    node,
    "is",
    false,
    true
    /* allow empty */
  );
  if (isProp) {
    if (isExplicitDynamic || isCompatEnabled(
      "COMPILER_IS_ON_ELEMENT",
      context
    )) {
      let exp;
      if (isProp.type === 6) {
        exp = isProp.value && createSimpleExpression(isProp.value.content, true);
      } else {
        exp = isProp.exp;
        if (!exp) {
          exp = createSimpleExpression(`is`, false, isProp.arg.loc);
        }
      }
      if (exp) {
        return createCallExpression(context.helper(RESOLVE_DYNAMIC_COMPONENT), [
          exp
        ]);
      }
    } else if (isProp.type === 6 && isProp.value.content.startsWith("vue:")) {
      tag = isProp.value.content.slice(4);
    }
  }
  const builtIn = isCoreComponent(tag) || context.isBuiltInComponent(tag);
  if (builtIn) {
    if (!ssr) context.helper(builtIn);
    return builtIn;
  }
  context.helper(RESOLVE_COMPONENT);
  context.components.add(tag);
  return toValidAssetId(tag, `component`);
}
function buildProps(node, context, props = node.props, isComponent2, isDynamicComponent, ssr = false) {
  const { tag, loc: elementLoc, children } = node;
  let properties = [];
  const mergeArgs = [];
  const runtimeDirectives = [];
  const hasChildren = children.length > 0;
  let shouldUseBlock = false;
  let patchFlag = 0;
  let hasRef = false;
  let hasClassBinding = false;
  let hasStyleBinding = false;
  let hasHydrationEventBinding = false;
  let hasDynamicKeys = false;
  let hasVnodeHook = false;
  const dynamicPropNames = [];
  const pushMergeArg = (arg) => {
    if (properties.length) {
      mergeArgs.push(
        createObjectExpression(dedupeProperties(properties), elementLoc)
      );
      properties = [];
    }
    if (arg) mergeArgs.push(arg);
  };
  const pushRefVForMarker = () => {
    if (context.scopes.vFor > 0) {
      properties.push(
        createObjectProperty(
          createSimpleExpression("ref_for", true),
          createSimpleExpression("true")
        )
      );
    }
  };
  const analyzePatchFlag = ({ key, value }) => {
    if (isStaticExp(key)) {
      const name = key.content;
      const isEventHandler = isOn(name);
      if (isEventHandler && (!isComponent2 || isDynamicComponent) && // omit the flag for click handlers because hydration gives click
      // dedicated fast path.
      name.toLowerCase() !== "onclick" && // omit v-model handlers
      name !== "onUpdate:modelValue" && // omit onVnodeXXX hooks
      !isReservedProp(name)) {
        hasHydrationEventBinding = true;
      }
      if (isEventHandler && isReservedProp(name)) {
        hasVnodeHook = true;
      }
      if (isEventHandler && value.type === 14) {
        value = value.arguments[0];
      }
      if (value.type === 20 || (value.type === 4 || value.type === 8) && getConstantType(value, context) > 0) {
        return;
      }
      if (name === "ref") {
        hasRef = true;
      } else if (name === "class") {
        hasClassBinding = true;
      } else if (name === "style") {
        hasStyleBinding = true;
      } else if (name !== "key" && !dynamicPropNames.includes(name)) {
        dynamicPropNames.push(name);
      }
      if (isComponent2 && (name === "class" || name === "style") && !dynamicPropNames.includes(name)) {
        dynamicPropNames.push(name);
      }
    } else {
      hasDynamicKeys = true;
    }
  };
  for (let i = 0; i < props.length; i++) {
    const prop = props[i];
    if (prop.type === 6) {
      const { loc, name, nameLoc, value } = prop;
      let isStatic = true;
      if (name === "ref") {
        hasRef = true;
        pushRefVForMarker();
      }
      if (name === "is" && (isComponentTag(tag) || value && value.content.startsWith("vue:") || isCompatEnabled(
        "COMPILER_IS_ON_ELEMENT",
        context
      ))) {
        continue;
      }
      properties.push(
        createObjectProperty(
          createSimpleExpression(name, true, nameLoc),
          createSimpleExpression(
            value ? value.content : "",
            isStatic,
            value ? value.loc : loc
          )
        )
      );
    } else {
      const { name, arg, exp, loc, modifiers } = prop;
      const isVBind = name === "bind";
      const isVOn = name === "on";
      if (name === "slot") {
        if (!isComponent2) {
          context.onError(
            createCompilerError(40, loc)
          );
        }
        continue;
      }
      if (name === "once" || name === "memo") {
        continue;
      }
      if (name === "is" || isVBind && isStaticArgOf(arg, "is") && (isComponentTag(tag) || isCompatEnabled(
        "COMPILER_IS_ON_ELEMENT",
        context
      ))) {
        continue;
      }
      if (isVOn && ssr) {
        continue;
      }
      if (
        // #938: elements with dynamic keys should be forced into blocks
        isVBind && isStaticArgOf(arg, "key") || // inline before-update hooks need to force block so that it is invoked
        // before children
        isVOn && hasChildren && isStaticArgOf(arg, "vue:before-update")
      ) {
        shouldUseBlock = true;
      }
      if (isVBind && isStaticArgOf(arg, "ref")) {
        pushRefVForMarker();
      }
      if (!arg && (isVBind || isVOn)) {
        hasDynamicKeys = true;
        if (exp) {
          if (isVBind) {
            pushRefVForMarker();
            pushMergeArg();
            {
              if (true) {
                const hasOverridableKeys = mergeArgs.some((arg2) => {
                  if (arg2.type === 15) {
                    return arg2.properties.some(({ key }) => {
                      if (key.type !== 4 || !key.isStatic) {
                        return true;
                      }
                      return key.content !== "class" && key.content !== "style" && !isOn(key.content);
                    });
                  } else {
                    return true;
                  }
                });
                if (hasOverridableKeys) {
                  checkCompatEnabled(
                    "COMPILER_V_BIND_OBJECT_ORDER",
                    context,
                    loc
                  );
                }
              }
              if (isCompatEnabled(
                "COMPILER_V_BIND_OBJECT_ORDER",
                context
              )) {
                mergeArgs.unshift(exp);
                continue;
              }
            }
            mergeArgs.push(exp);
          } else {
            pushMergeArg({
              type: 14,
              loc,
              callee: context.helper(TO_HANDLERS),
              arguments: isComponent2 ? [exp] : [exp, `true`]
            });
          }
        } else {
          context.onError(
            createCompilerError(
              isVBind ? 34 : 35,
              loc
            )
          );
        }
        continue;
      }
      if (isVBind && modifiers.some((mod) => mod.content === "prop")) {
        patchFlag |= 32;
      }
      const directiveTransform = context.directiveTransforms[name];
      if (directiveTransform) {
        const { props: props2, needRuntime } = directiveTransform(prop, node, context);
        !ssr && props2.forEach(analyzePatchFlag);
        if (isVOn && arg && !isStaticExp(arg)) {
          pushMergeArg(createObjectExpression(props2, elementLoc));
        } else {
          properties.push(...props2);
        }
        if (needRuntime) {
          runtimeDirectives.push(prop);
          if (isSymbol(needRuntime)) {
            directiveImportMap.set(prop, needRuntime);
          }
        }
      } else if (!isBuiltInDirective(name)) {
        runtimeDirectives.push(prop);
        if (hasChildren) {
          shouldUseBlock = true;
        }
      }
    }
  }
  let propsExpression = void 0;
  if (mergeArgs.length) {
    pushMergeArg();
    if (mergeArgs.length > 1) {
      propsExpression = createCallExpression(
        context.helper(MERGE_PROPS),
        mergeArgs,
        elementLoc
      );
    } else {
      propsExpression = mergeArgs[0];
    }
  } else if (properties.length) {
    propsExpression = createObjectExpression(
      dedupeProperties(properties),
      elementLoc
    );
  }
  if (hasDynamicKeys) {
    patchFlag |= 16;
  } else {
    if (hasClassBinding && !isComponent2) {
      patchFlag |= 2;
    }
    if (hasStyleBinding && !isComponent2) {
      patchFlag |= 4;
    }
    if (dynamicPropNames.length) {
      patchFlag |= 8;
    }
    if (hasHydrationEventBinding) {
      patchFlag |= 32;
    }
  }
  if (!shouldUseBlock && (patchFlag === 0 || patchFlag === 32) && (hasRef || hasVnodeHook || runtimeDirectives.length > 0)) {
    patchFlag |= 512;
  }
  if (!context.inSSR && propsExpression) {
    switch (propsExpression.type) {
      case 15:
        let classKeyIndex = -1;
        let styleKeyIndex = -1;
        let hasDynamicKey = false;
        for (let i = 0; i < propsExpression.properties.length; i++) {
          const key = propsExpression.properties[i].key;
          if (isStaticExp(key)) {
            if (key.content === "class") {
              classKeyIndex = i;
            } else if (key.content === "style") {
              styleKeyIndex = i;
            }
          } else if (!key.isHandlerKey) {
            hasDynamicKey = true;
          }
        }
        const classProp = propsExpression.properties[classKeyIndex];
        const styleProp = propsExpression.properties[styleKeyIndex];
        if (!hasDynamicKey) {
          if (classProp && !isStaticExp(classProp.value)) {
            classProp.value = createCallExpression(
              context.helper(NORMALIZE_CLASS),
              [classProp.value]
            );
          }
          if (styleProp && // the static style is compiled into an object,
          // so use `hasStyleBinding` to ensure that it is a dynamic style binding
          (hasStyleBinding || styleProp.value.type === 4 && styleProp.value.content.trim()[0] === `[` || // v-bind:style and style both exist,
          // v-bind:style with static literal object
          styleProp.value.type === 17)) {
            styleProp.value = createCallExpression(
              context.helper(NORMALIZE_STYLE),
              [styleProp.value]
            );
          }
        } else {
          propsExpression = createCallExpression(
            context.helper(NORMALIZE_PROPS),
            [propsExpression]
          );
        }
        break;
      case 14:
        break;
      default:
        propsExpression = createCallExpression(
          context.helper(NORMALIZE_PROPS),
          [
            createCallExpression(context.helper(GUARD_REACTIVE_PROPS), [
              propsExpression
            ])
          ]
        );
        break;
    }
  }
  return {
    props: propsExpression,
    directives: runtimeDirectives,
    patchFlag,
    dynamicPropNames,
    shouldUseBlock
  };
}
function dedupeProperties(properties) {
  const knownProps = /* @__PURE__ */ new Map();
  const deduped = [];
  for (let i = 0; i < properties.length; i++) {
    const prop = properties[i];
    if (prop.key.type === 8 || !prop.key.isStatic) {
      deduped.push(prop);
      continue;
    }
    const name = prop.key.content;
    const existing = knownProps.get(name);
    if (existing) {
      if (name === "style" || name === "class" || isOn(name)) {
        mergeAsArray(existing, prop);
      }
    } else {
      knownProps.set(name, prop);
      deduped.push(prop);
    }
  }
  return deduped;
}
function mergeAsArray(existing, incoming) {
  if (existing.value.type === 17) {
    existing.value.elements.push(incoming.value);
  } else {
    existing.value = createArrayExpression(
      [existing.value, incoming.value],
      existing.loc
    );
  }
}
function buildDirectiveArgs(dir, context) {
  const dirArgs = [];
  const runtime = directiveImportMap.get(dir);
  if (runtime) {
    dirArgs.push(context.helperString(runtime));
  } else {
    {
      context.helper(RESOLVE_DIRECTIVE);
      context.directives.add(dir.name);
      dirArgs.push(toValidAssetId(dir.name, `directive`));
    }
  }
  const { loc } = dir;
  if (dir.exp) dirArgs.push(dir.exp);
  if (dir.arg) {
    if (!dir.exp) {
      dirArgs.push(`void 0`);
    }
    dirArgs.push(dir.arg);
  }
  if (Object.keys(dir.modifiers).length) {
    if (!dir.arg) {
      if (!dir.exp) {
        dirArgs.push(`void 0`);
      }
      dirArgs.push(`void 0`);
    }
    const trueExpression = createSimpleExpression(`true`, false, loc);
    dirArgs.push(
      createObjectExpression(
        dir.modifiers.map(
          (modifier) => createObjectProperty(modifier, trueExpression)
        ),
        loc
      )
    );
  }
  return createArrayExpression(dirArgs, dir.loc);
}
function stringifyDynamicPropNames(props) {
  let propsNamesString = `[`;
  for (let i = 0, l = props.length; i < l; i++) {
    propsNamesString += JSON.stringify(props[i]);
    if (i < l - 1) propsNamesString += ", ";
  }
  return propsNamesString + `]`;
}
function isComponentTag(tag) {
  return tag === "component" || tag === "Component";
}
function processSlotOutlet(node, context) {
  let slotName = `"default"`;
  let slotProps = void 0;
  const nonNameProps = [];
  for (let i = 0; i < node.props.length; i++) {
    const p = node.props[i];
    if (p.type === 6) {
      if (p.value) {
        if (p.name === "name") {
          slotName = JSON.stringify(p.value.content);
        } else {
          p.name = camelize(p.name);
          nonNameProps.push(p);
        }
      }
    } else {
      if (p.name === "bind" && isStaticArgOf(p.arg, "name")) {
        if (p.exp) {
          slotName = p.exp;
        } else if (p.arg && p.arg.type === 4) {
          const name = camelize(p.arg.content);
          slotName = p.exp = createSimpleExpression(name, false, p.arg.loc);
        }
      } else {
        if (p.name === "bind" && p.arg && isStaticExp(p.arg)) {
          p.arg.content = camelize(p.arg.content);
        }
        nonNameProps.push(p);
      }
    }
  }
  if (nonNameProps.length > 0) {
    const { props, directives } = buildProps(
      node,
      context,
      nonNameProps,
      false,
      false
    );
    slotProps = props;
    if (directives.length) {
      context.onError(
        createCompilerError(
          36,
          directives[0].loc
        )
      );
    }
  }
  return {
    slotName,
    slotProps
  };
}
function createTransformProps(props = []) {
  return { props };
}
function rewriteFilter(node, context) {
  if (node.type === 4) {
    parseFilter(node, context);
  } else {
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      if (typeof child !== "object") continue;
      if (child.type === 4) {
        parseFilter(child, context);
      } else if (child.type === 8) {
        rewriteFilter(node, context);
      } else if (child.type === 5) {
        rewriteFilter(child.content, context);
      }
    }
  }
}
function parseFilter(node, context) {
  const exp = node.content;
  let inSingle = false;
  let inDouble = false;
  let inTemplateString = false;
  let inRegex = false;
  let curly = 0;
  let square = 0;
  let paren = 0;
  let lastFilterIndex = 0;
  let c, prev, i, expression, filters = [];
  for (i = 0; i < exp.length; i++) {
    prev = c;
    c = exp.charCodeAt(i);
    if (inSingle) {
      if (c === 39 && prev !== 92) inSingle = false;
    } else if (inDouble) {
      if (c === 34 && prev !== 92) inDouble = false;
    } else if (inTemplateString) {
      if (c === 96 && prev !== 92) inTemplateString = false;
    } else if (inRegex) {
      if (c === 47 && prev !== 92) inRegex = false;
    } else if (c === 124 && // pipe
    exp.charCodeAt(i + 1) !== 124 && exp.charCodeAt(i - 1) !== 124 && !curly && !square && !paren) {
      if (expression === void 0) {
        lastFilterIndex = i + 1;
        expression = exp.slice(0, i).trim();
      } else {
        pushFilter();
      }
    } else {
      switch (c) {
        case 34:
          inDouble = true;
          break;
        // "
        case 39:
          inSingle = true;
          break;
        // '
        case 96:
          inTemplateString = true;
          break;
        // `
        case 40:
          paren++;
          break;
        // (
        case 41:
          paren--;
          break;
        // )
        case 91:
          square++;
          break;
        // [
        case 93:
          square--;
          break;
        // ]
        case 123:
          curly++;
          break;
        // {
        case 125:
          curly--;
          break;
      }
      if (c === 47) {
        let j = i - 1;
        let p;
        for (; j >= 0; j--) {
          p = exp.charAt(j);
          if (p !== " ") break;
        }
        if (!p || !validDivisionCharRE.test(p)) {
          inRegex = true;
        }
      }
    }
  }
  if (expression === void 0) {
    expression = exp.slice(0, i).trim();
  } else if (lastFilterIndex !== 0) {
    pushFilter();
  }
  function pushFilter() {
    filters.push(exp.slice(lastFilterIndex, i).trim());
    lastFilterIndex = i + 1;
  }
  if (filters.length) {
    warnDeprecation(
      "COMPILER_FILTERS",
      context,
      node.loc
    );
    for (i = 0; i < filters.length; i++) {
      expression = wrapFilter(expression, filters[i], context);
    }
    node.content = expression;
    node.ast = void 0;
  }
}
function wrapFilter(exp, filter, context) {
  context.helper(RESOLVE_FILTER);
  const i = filter.indexOf("(");
  if (i < 0) {
    context.filters.add(filter);
    return `${toValidAssetId(filter, "filter")}(${exp})`;
  } else {
    const name = filter.slice(0, i);
    const args = filter.slice(i + 1);
    context.filters.add(name);
    return `${toValidAssetId(name, "filter")}(${exp}${args !== ")" ? "," + args : args}`;
  }
}
function getBaseTransformPreset(prefixIdentifiers) {
  return [
    [
      transformOnce,
      transformIf,
      transformMemo,
      transformFor,
      ...[transformFilter],
      ...true ? [transformExpression] : [],
      transformSlotOutlet,
      transformElement,
      trackSlotScopes,
      transformText
    ],
    {
      on: transformOn,
      bind: transformBind,
      model: transformModel
    }
  ];
}
function baseCompile(source, options = {}) {
  const onError = options.onError || defaultOnError;
  const isModuleMode = options.mode === "module";
  {
    if (options.prefixIdentifiers === true) {
      onError(createCompilerError(47));
    } else if (isModuleMode) {
      onError(createCompilerError(48));
    }
  }
  const prefixIdentifiers = false;
  if (options.cacheHandlers) {
    onError(createCompilerError(49));
  }
  if (options.scopeId && !isModuleMode) {
    onError(createCompilerError(50));
  }
  const resolvedOptions = extend({}, options, {
    prefixIdentifiers
  });
  const ast = isString(source) ? baseParse(source, resolvedOptions) : source;
  const [nodeTransforms, directiveTransforms] = getBaseTransformPreset();
  transform(
    ast,
    extend({}, resolvedOptions, {
      nodeTransforms: [
        ...nodeTransforms,
        ...options.nodeTransforms || []
        // user transforms
      ],
      directiveTransforms: extend(
        {},
        directiveTransforms,
        options.directiveTransforms || {}
        // user transforms
      )
    })
  );
  return generate(ast, resolvedOptions);
}
var FRAGMENT, TELEPORT, SUSPENSE, KEEP_ALIVE, BASE_TRANSITION, OPEN_BLOCK, CREATE_BLOCK, CREATE_ELEMENT_BLOCK, CREATE_VNODE, CREATE_ELEMENT_VNODE, CREATE_COMMENT, CREATE_TEXT, CREATE_STATIC, RESOLVE_COMPONENT, RESOLVE_DYNAMIC_COMPONENT, RESOLVE_DIRECTIVE, RESOLVE_FILTER, WITH_DIRECTIVES, RENDER_LIST, RENDER_SLOT, CREATE_SLOTS, TO_DISPLAY_STRING, MERGE_PROPS, NORMALIZE_CLASS, NORMALIZE_STYLE, NORMALIZE_PROPS, GUARD_REACTIVE_PROPS, TO_HANDLERS, CAMELIZE, CAPITALIZE, TO_HANDLER_KEY, SET_BLOCK_TRACKING, PUSH_SCOPE_ID, POP_SCOPE_ID, WITH_CTX, UNREF, IS_REF, WITH_MEMO, IS_MEMO_SAME, helperNameMap, Namespaces, NodeTypes, ElementTypes, ConstantTypes, locStub, defaultDelimitersOpen, defaultDelimitersClose, Sequences, Tokenizer, CompilerDeprecationTypes, deprecationData, ErrorCodes, errorMessages, isFunctionType, isStaticProperty, isStaticPropertyKey, TS_NODE_TYPES, isStaticExp, nonIdentifierRE, isSimpleIdentifier, validFirstIdentCharRE, validIdentCharRE, whitespaceRE, getExpSource, isMemberExpressionBrowser, isMemberExpressionNode, isMemberExpression, fnExpRE, isFnExpressionBrowser, isFnExpressionNode, isFnExpression, propsHelperSet, forAliasRE, defaultParserOptions, currentOptions, currentRoot, currentInput, currentOpenTag, currentProp, currentAttrValue, currentAttrStartIndex, currentAttrEndIndex, inPre, inVPre, currentVPreBoundary, stack, tokenizer, forIteratorRE, stripParensRE, specialTemplateDir, windowsNewlineRE, allowHoistedHelperSet, PURE_ANNOTATION, aliasHelper, prohibitedKeywordRE, stripStringRE, transformExpression, transformIf, transformBind, transformBindShorthand, injectPrefix, transformFor, defaultFallback, trackSlotScopes, trackVForSlotScopes, buildClientSlotFn, directiveImportMap, transformElement, transformSlotOutlet, transformOn, transformText, seen$1, transformOnce, transformModel, validDivisionCharRE, transformFilter, seen, transformMemo, BindingTypes, noopDirectiveTransform;
var init_compiler_core_esm_bundler = __esm({
  "node_modules/@vue/compiler-core/dist/compiler-core.esm-bundler.js"() {
    init_shared_esm_bundler();
    init_shared_esm_bundler();
    FRAGMENT = Symbol(true ? `Fragment` : ``);
    TELEPORT = Symbol(true ? `Teleport` : ``);
    SUSPENSE = Symbol(true ? `Suspense` : ``);
    KEEP_ALIVE = Symbol(true ? `KeepAlive` : ``);
    BASE_TRANSITION = Symbol(
      true ? `BaseTransition` : ``
    );
    OPEN_BLOCK = Symbol(true ? `openBlock` : ``);
    CREATE_BLOCK = Symbol(true ? `createBlock` : ``);
    CREATE_ELEMENT_BLOCK = Symbol(
      true ? `createElementBlock` : ``
    );
    CREATE_VNODE = Symbol(true ? `createVNode` : ``);
    CREATE_ELEMENT_VNODE = Symbol(
      true ? `createElementVNode` : ``
    );
    CREATE_COMMENT = Symbol(
      true ? `createCommentVNode` : ``
    );
    CREATE_TEXT = Symbol(
      true ? `createTextVNode` : ``
    );
    CREATE_STATIC = Symbol(
      true ? `createStaticVNode` : ``
    );
    RESOLVE_COMPONENT = Symbol(
      true ? `resolveComponent` : ``
    );
    RESOLVE_DYNAMIC_COMPONENT = Symbol(
      true ? `resolveDynamicComponent` : ``
    );
    RESOLVE_DIRECTIVE = Symbol(
      true ? `resolveDirective` : ``
    );
    RESOLVE_FILTER = Symbol(
      true ? `resolveFilter` : ``
    );
    WITH_DIRECTIVES = Symbol(
      true ? `withDirectives` : ``
    );
    RENDER_LIST = Symbol(true ? `renderList` : ``);
    RENDER_SLOT = Symbol(true ? `renderSlot` : ``);
    CREATE_SLOTS = Symbol(true ? `createSlots` : ``);
    TO_DISPLAY_STRING = Symbol(
      true ? `toDisplayString` : ``
    );
    MERGE_PROPS = Symbol(true ? `mergeProps` : ``);
    NORMALIZE_CLASS = Symbol(
      true ? `normalizeClass` : ``
    );
    NORMALIZE_STYLE = Symbol(
      true ? `normalizeStyle` : ``
    );
    NORMALIZE_PROPS = Symbol(
      true ? `normalizeProps` : ``
    );
    GUARD_REACTIVE_PROPS = Symbol(
      true ? `guardReactiveProps` : ``
    );
    TO_HANDLERS = Symbol(true ? `toHandlers` : ``);
    CAMELIZE = Symbol(true ? `camelize` : ``);
    CAPITALIZE = Symbol(true ? `capitalize` : ``);
    TO_HANDLER_KEY = Symbol(
      true ? `toHandlerKey` : ``
    );
    SET_BLOCK_TRACKING = Symbol(
      true ? `setBlockTracking` : ``
    );
    PUSH_SCOPE_ID = Symbol(true ? `pushScopeId` : ``);
    POP_SCOPE_ID = Symbol(true ? `popScopeId` : ``);
    WITH_CTX = Symbol(true ? `withCtx` : ``);
    UNREF = Symbol(true ? `unref` : ``);
    IS_REF = Symbol(true ? `isRef` : ``);
    WITH_MEMO = Symbol(true ? `withMemo` : ``);
    IS_MEMO_SAME = Symbol(true ? `isMemoSame` : ``);
    helperNameMap = {
      [FRAGMENT]: `Fragment`,
      [TELEPORT]: `Teleport`,
      [SUSPENSE]: `Suspense`,
      [KEEP_ALIVE]: `KeepAlive`,
      [BASE_TRANSITION]: `BaseTransition`,
      [OPEN_BLOCK]: `openBlock`,
      [CREATE_BLOCK]: `createBlock`,
      [CREATE_ELEMENT_BLOCK]: `createElementBlock`,
      [CREATE_VNODE]: `createVNode`,
      [CREATE_ELEMENT_VNODE]: `createElementVNode`,
      [CREATE_COMMENT]: `createCommentVNode`,
      [CREATE_TEXT]: `createTextVNode`,
      [CREATE_STATIC]: `createStaticVNode`,
      [RESOLVE_COMPONENT]: `resolveComponent`,
      [RESOLVE_DYNAMIC_COMPONENT]: `resolveDynamicComponent`,
      [RESOLVE_DIRECTIVE]: `resolveDirective`,
      [RESOLVE_FILTER]: `resolveFilter`,
      [WITH_DIRECTIVES]: `withDirectives`,
      [RENDER_LIST]: `renderList`,
      [RENDER_SLOT]: `renderSlot`,
      [CREATE_SLOTS]: `createSlots`,
      [TO_DISPLAY_STRING]: `toDisplayString`,
      [MERGE_PROPS]: `mergeProps`,
      [NORMALIZE_CLASS]: `normalizeClass`,
      [NORMALIZE_STYLE]: `normalizeStyle`,
      [NORMALIZE_PROPS]: `normalizeProps`,
      [GUARD_REACTIVE_PROPS]: `guardReactiveProps`,
      [TO_HANDLERS]: `toHandlers`,
      [CAMELIZE]: `camelize`,
      [CAPITALIZE]: `capitalize`,
      [TO_HANDLER_KEY]: `toHandlerKey`,
      [SET_BLOCK_TRACKING]: `setBlockTracking`,
      [PUSH_SCOPE_ID]: `pushScopeId`,
      [POP_SCOPE_ID]: `popScopeId`,
      [WITH_CTX]: `withCtx`,
      [UNREF]: `unref`,
      [IS_REF]: `isRef`,
      [WITH_MEMO]: `withMemo`,
      [IS_MEMO_SAME]: `isMemoSame`
    };
    Namespaces = {
      "HTML": 0,
      "0": "HTML",
      "SVG": 1,
      "1": "SVG",
      "MATH_ML": 2,
      "2": "MATH_ML"
    };
    NodeTypes = {
      "ROOT": 0,
      "0": "ROOT",
      "ELEMENT": 1,
      "1": "ELEMENT",
      "TEXT": 2,
      "2": "TEXT",
      "COMMENT": 3,
      "3": "COMMENT",
      "SIMPLE_EXPRESSION": 4,
      "4": "SIMPLE_EXPRESSION",
      "INTERPOLATION": 5,
      "5": "INTERPOLATION",
      "ATTRIBUTE": 6,
      "6": "ATTRIBUTE",
      "DIRECTIVE": 7,
      "7": "DIRECTIVE",
      "COMPOUND_EXPRESSION": 8,
      "8": "COMPOUND_EXPRESSION",
      "IF": 9,
      "9": "IF",
      "IF_BRANCH": 10,
      "10": "IF_BRANCH",
      "FOR": 11,
      "11": "FOR",
      "TEXT_CALL": 12,
      "12": "TEXT_CALL",
      "VNODE_CALL": 13,
      "13": "VNODE_CALL",
      "JS_CALL_EXPRESSION": 14,
      "14": "JS_CALL_EXPRESSION",
      "JS_OBJECT_EXPRESSION": 15,
      "15": "JS_OBJECT_EXPRESSION",
      "JS_PROPERTY": 16,
      "16": "JS_PROPERTY",
      "JS_ARRAY_EXPRESSION": 17,
      "17": "JS_ARRAY_EXPRESSION",
      "JS_FUNCTION_EXPRESSION": 18,
      "18": "JS_FUNCTION_EXPRESSION",
      "JS_CONDITIONAL_EXPRESSION": 19,
      "19": "JS_CONDITIONAL_EXPRESSION",
      "JS_CACHE_EXPRESSION": 20,
      "20": "JS_CACHE_EXPRESSION",
      "JS_BLOCK_STATEMENT": 21,
      "21": "JS_BLOCK_STATEMENT",
      "JS_TEMPLATE_LITERAL": 22,
      "22": "JS_TEMPLATE_LITERAL",
      "JS_IF_STATEMENT": 23,
      "23": "JS_IF_STATEMENT",
      "JS_ASSIGNMENT_EXPRESSION": 24,
      "24": "JS_ASSIGNMENT_EXPRESSION",
      "JS_SEQUENCE_EXPRESSION": 25,
      "25": "JS_SEQUENCE_EXPRESSION",
      "JS_RETURN_STATEMENT": 26,
      "26": "JS_RETURN_STATEMENT"
    };
    ElementTypes = {
      "ELEMENT": 0,
      "0": "ELEMENT",
      "COMPONENT": 1,
      "1": "COMPONENT",
      "SLOT": 2,
      "2": "SLOT",
      "TEMPLATE": 3,
      "3": "TEMPLATE"
    };
    ConstantTypes = {
      "NOT_CONSTANT": 0,
      "0": "NOT_CONSTANT",
      "CAN_SKIP_PATCH": 1,
      "1": "CAN_SKIP_PATCH",
      "CAN_CACHE": 2,
      "2": "CAN_CACHE",
      "CAN_STRINGIFY": 3,
      "3": "CAN_STRINGIFY"
    };
    locStub = {
      start: { line: 1, column: 1, offset: 0 },
      end: { line: 1, column: 1, offset: 0 },
      source: ""
    };
    defaultDelimitersOpen = new Uint8Array([123, 123]);
    defaultDelimitersClose = new Uint8Array([125, 125]);
    Sequences = {
      Cdata: new Uint8Array([67, 68, 65, 84, 65, 91]),
      // CDATA[
      CdataEnd: new Uint8Array([93, 93, 62]),
      // ]]>
      CommentEnd: new Uint8Array([45, 45, 62]),
      // `-->`
      ScriptEnd: new Uint8Array([60, 47, 115, 99, 114, 105, 112, 116]),
      // `<\/script`
      StyleEnd: new Uint8Array([60, 47, 115, 116, 121, 108, 101]),
      // `</style`
      TitleEnd: new Uint8Array([60, 47, 116, 105, 116, 108, 101]),
      // `</title`
      TextareaEnd: new Uint8Array([
        60,
        47,
        116,
        101,
        120,
        116,
        97,
        114,
        101,
        97
      ])
      // `</textarea
    };
    Tokenizer = class {
      constructor(stack2, cbs) {
        this.stack = stack2;
        this.cbs = cbs;
        this.state = 1;
        this.buffer = "";
        this.sectionStart = 0;
        this.index = 0;
        this.entityStart = 0;
        this.baseState = 1;
        this.inRCDATA = false;
        this.inXML = false;
        this.inVPre = false;
        this.newlines = [];
        this.mode = 0;
        this.delimiterOpen = defaultDelimitersOpen;
        this.delimiterClose = defaultDelimitersClose;
        this.delimiterIndex = -1;
        this.currentSequence = void 0;
        this.sequenceIndex = 0;
      }
      get inSFCRoot() {
        return this.mode === 2 && this.stack.length === 0;
      }
      reset() {
        this.state = 1;
        this.mode = 0;
        this.buffer = "";
        this.sectionStart = 0;
        this.index = 0;
        this.baseState = 1;
        this.inRCDATA = false;
        this.currentSequence = void 0;
        this.newlines.length = 0;
        this.delimiterOpen = defaultDelimitersOpen;
        this.delimiterClose = defaultDelimitersClose;
      }
      /**
       * Generate Position object with line / column information using recorded
       * newline positions. We know the index is always going to be an already
       * processed index, so all the newlines up to this index should have been
       * recorded.
       */
      getPos(index) {
        let line = 1;
        let column = index + 1;
        for (let i = this.newlines.length - 1; i >= 0; i--) {
          const newlineIndex = this.newlines[i];
          if (index > newlineIndex) {
            line = i + 2;
            column = index - newlineIndex;
            break;
          }
        }
        return {
          column,
          line,
          offset: index
        };
      }
      peek() {
        return this.buffer.charCodeAt(this.index + 1);
      }
      stateText(c) {
        if (c === 60) {
          if (this.index > this.sectionStart) {
            this.cbs.ontext(this.sectionStart, this.index);
          }
          this.state = 5;
          this.sectionStart = this.index;
        } else if (!this.inVPre && c === this.delimiterOpen[0]) {
          this.state = 2;
          this.delimiterIndex = 0;
          this.stateInterpolationOpen(c);
        }
      }
      stateInterpolationOpen(c) {
        if (c === this.delimiterOpen[this.delimiterIndex]) {
          if (this.delimiterIndex === this.delimiterOpen.length - 1) {
            const start = this.index + 1 - this.delimiterOpen.length;
            if (start > this.sectionStart) {
              this.cbs.ontext(this.sectionStart, start);
            }
            this.state = 3;
            this.sectionStart = start;
          } else {
            this.delimiterIndex++;
          }
        } else if (this.inRCDATA) {
          this.state = 32;
          this.stateInRCDATA(c);
        } else {
          this.state = 1;
          this.stateText(c);
        }
      }
      stateInterpolation(c) {
        if (c === this.delimiterClose[0]) {
          this.state = 4;
          this.delimiterIndex = 0;
          this.stateInterpolationClose(c);
        }
      }
      stateInterpolationClose(c) {
        if (c === this.delimiterClose[this.delimiterIndex]) {
          if (this.delimiterIndex === this.delimiterClose.length - 1) {
            this.cbs.oninterpolation(this.sectionStart, this.index + 1);
            if (this.inRCDATA) {
              this.state = 32;
            } else {
              this.state = 1;
            }
            this.sectionStart = this.index + 1;
          } else {
            this.delimiterIndex++;
          }
        } else {
          this.state = 3;
          this.stateInterpolation(c);
        }
      }
      stateSpecialStartSequence(c) {
        const isEnd = this.sequenceIndex === this.currentSequence.length;
        const isMatch = isEnd ? (
          // If we are at the end of the sequence, make sure the tag name has ended
          isEndOfTagSection(c)
        ) : (
          // Otherwise, do a case-insensitive comparison
          (c | 32) === this.currentSequence[this.sequenceIndex]
        );
        if (!isMatch) {
          this.inRCDATA = false;
        } else if (!isEnd) {
          this.sequenceIndex++;
          return;
        }
        this.sequenceIndex = 0;
        this.state = 6;
        this.stateInTagName(c);
      }
      /** Look for an end tag. For <title> and <textarea>, also decode entities. */
      stateInRCDATA(c) {
        if (this.sequenceIndex === this.currentSequence.length) {
          if (c === 62 || isWhitespace(c)) {
            const endOfText = this.index - this.currentSequence.length;
            if (this.sectionStart < endOfText) {
              const actualIndex = this.index;
              this.index = endOfText;
              this.cbs.ontext(this.sectionStart, endOfText);
              this.index = actualIndex;
            }
            this.sectionStart = endOfText + 2;
            this.stateInClosingTagName(c);
            this.inRCDATA = false;
            return;
          }
          this.sequenceIndex = 0;
        }
        if ((c | 32) === this.currentSequence[this.sequenceIndex]) {
          this.sequenceIndex += 1;
        } else if (this.sequenceIndex === 0) {
          if (this.currentSequence === Sequences.TitleEnd || this.currentSequence === Sequences.TextareaEnd && !this.inSFCRoot) {
            if (!this.inVPre && c === this.delimiterOpen[0]) {
              this.state = 2;
              this.delimiterIndex = 0;
              this.stateInterpolationOpen(c);
            }
          } else if (this.fastForwardTo(60)) {
            this.sequenceIndex = 1;
          }
        } else {
          this.sequenceIndex = Number(c === 60);
        }
      }
      stateCDATASequence(c) {
        if (c === Sequences.Cdata[this.sequenceIndex]) {
          if (++this.sequenceIndex === Sequences.Cdata.length) {
            this.state = 28;
            this.currentSequence = Sequences.CdataEnd;
            this.sequenceIndex = 0;
            this.sectionStart = this.index + 1;
          }
        } else {
          this.sequenceIndex = 0;
          this.state = 23;
          this.stateInDeclaration(c);
        }
      }
      /**
       * When we wait for one specific character, we can speed things up
       * by skipping through the buffer until we find it.
       *
       * @returns Whether the character was found.
       */
      fastForwardTo(c) {
        while (++this.index < this.buffer.length) {
          const cc = this.buffer.charCodeAt(this.index);
          if (cc === 10) {
            this.newlines.push(this.index);
          }
          if (cc === c) {
            return true;
          }
        }
        this.index = this.buffer.length - 1;
        return false;
      }
      /**
       * Comments and CDATA end with `-->` and `]]>`.
       *
       * Their common qualities are:
       * - Their end sequences have a distinct character they start with.
       * - That character is then repeated, so we have to check multiple repeats.
       * - All characters but the start character of the sequence can be skipped.
       */
      stateInCommentLike(c) {
        if (c === this.currentSequence[this.sequenceIndex]) {
          if (++this.sequenceIndex === this.currentSequence.length) {
            if (this.currentSequence === Sequences.CdataEnd) {
              this.cbs.oncdata(this.sectionStart, this.index - 2);
            } else {
              this.cbs.oncomment(this.sectionStart, this.index - 2);
            }
            this.sequenceIndex = 0;
            this.sectionStart = this.index + 1;
            this.state = 1;
          }
        } else if (this.sequenceIndex === 0) {
          if (this.fastForwardTo(this.currentSequence[0])) {
            this.sequenceIndex = 1;
          }
        } else if (c !== this.currentSequence[this.sequenceIndex - 1]) {
          this.sequenceIndex = 0;
        }
      }
      startSpecial(sequence, offset) {
        this.enterRCDATA(sequence, offset);
        this.state = 31;
      }
      enterRCDATA(sequence, offset) {
        this.inRCDATA = true;
        this.currentSequence = sequence;
        this.sequenceIndex = offset;
      }
      stateBeforeTagName(c) {
        if (c === 33) {
          this.state = 22;
          this.sectionStart = this.index + 1;
        } else if (c === 63) {
          this.state = 24;
          this.sectionStart = this.index + 1;
        } else if (isTagStartChar(c)) {
          this.sectionStart = this.index;
          if (this.mode === 0) {
            this.state = 6;
          } else if (this.inSFCRoot) {
            this.state = 34;
          } else if (!this.inXML) {
            if (c === 116) {
              this.state = 30;
            } else {
              this.state = c === 115 ? 29 : 6;
            }
          } else {
            this.state = 6;
          }
        } else if (c === 47) {
          this.state = 8;
        } else {
          this.state = 1;
          this.stateText(c);
        }
      }
      stateInTagName(c) {
        if (isEndOfTagSection(c)) {
          this.handleTagName(c);
        }
      }
      stateInSFCRootTagName(c) {
        if (isEndOfTagSection(c)) {
          const tag = this.buffer.slice(this.sectionStart, this.index);
          if (tag !== "template") {
            this.enterRCDATA(toCharCodes(`</` + tag), 0);
          }
          this.handleTagName(c);
        }
      }
      handleTagName(c) {
        this.cbs.onopentagname(this.sectionStart, this.index);
        this.sectionStart = -1;
        this.state = 11;
        this.stateBeforeAttrName(c);
      }
      stateBeforeClosingTagName(c) {
        if (isWhitespace(c)) ;
        else if (c === 62) {
          if (true) {
            this.cbs.onerr(14, this.index);
          }
          this.state = 1;
          this.sectionStart = this.index + 1;
        } else {
          this.state = isTagStartChar(c) ? 9 : 27;
          this.sectionStart = this.index;
        }
      }
      stateInClosingTagName(c) {
        if (c === 62 || isWhitespace(c)) {
          this.cbs.onclosetag(this.sectionStart, this.index);
          this.sectionStart = -1;
          this.state = 10;
          this.stateAfterClosingTagName(c);
        }
      }
      stateAfterClosingTagName(c) {
        if (c === 62) {
          this.state = 1;
          this.sectionStart = this.index + 1;
        }
      }
      stateBeforeAttrName(c) {
        if (c === 62) {
          this.cbs.onopentagend(this.index);
          if (this.inRCDATA) {
            this.state = 32;
          } else {
            this.state = 1;
          }
          this.sectionStart = this.index + 1;
        } else if (c === 47) {
          this.state = 7;
          if (this.peek() !== 62) {
            this.cbs.onerr(22, this.index);
          }
        } else if (c === 60 && this.peek() === 47) {
          this.cbs.onopentagend(this.index);
          this.state = 5;
          this.sectionStart = this.index;
        } else if (!isWhitespace(c)) {
          if (c === 61) {
            this.cbs.onerr(
              19,
              this.index
            );
          }
          this.handleAttrStart(c);
        }
      }
      handleAttrStart(c) {
        if (c === 118 && this.peek() === 45) {
          this.state = 13;
          this.sectionStart = this.index;
        } else if (c === 46 || c === 58 || c === 64 || c === 35) {
          this.cbs.ondirname(this.index, this.index + 1);
          this.state = 14;
          this.sectionStart = this.index + 1;
        } else {
          this.state = 12;
          this.sectionStart = this.index;
        }
      }
      stateInSelfClosingTag(c) {
        if (c === 62) {
          this.cbs.onselfclosingtag(this.index);
          this.state = 1;
          this.sectionStart = this.index + 1;
          this.inRCDATA = false;
        } else if (!isWhitespace(c)) {
          this.state = 11;
          this.stateBeforeAttrName(c);
        }
      }
      stateInAttrName(c) {
        if (c === 61 || isEndOfTagSection(c)) {
          this.cbs.onattribname(this.sectionStart, this.index);
          this.handleAttrNameEnd(c);
        } else if (c === 34 || c === 39 || c === 60) {
          this.cbs.onerr(
            17,
            this.index
          );
        }
      }
      stateInDirName(c) {
        if (c === 61 || isEndOfTagSection(c)) {
          this.cbs.ondirname(this.sectionStart, this.index);
          this.handleAttrNameEnd(c);
        } else if (c === 58) {
          this.cbs.ondirname(this.sectionStart, this.index);
          this.state = 14;
          this.sectionStart = this.index + 1;
        } else if (c === 46) {
          this.cbs.ondirname(this.sectionStart, this.index);
          this.state = 16;
          this.sectionStart = this.index + 1;
        }
      }
      stateInDirArg(c) {
        if (c === 61 || isEndOfTagSection(c)) {
          this.cbs.ondirarg(this.sectionStart, this.index);
          this.handleAttrNameEnd(c);
        } else if (c === 91) {
          this.state = 15;
        } else if (c === 46) {
          this.cbs.ondirarg(this.sectionStart, this.index);
          this.state = 16;
          this.sectionStart = this.index + 1;
        }
      }
      stateInDynamicDirArg(c) {
        if (c === 93) {
          this.state = 14;
        } else if (c === 61 || isEndOfTagSection(c)) {
          this.cbs.ondirarg(this.sectionStart, this.index + 1);
          this.handleAttrNameEnd(c);
          if (true) {
            this.cbs.onerr(
              27,
              this.index
            );
          }
        }
      }
      stateInDirModifier(c) {
        if (c === 61 || isEndOfTagSection(c)) {
          this.cbs.ondirmodifier(this.sectionStart, this.index);
          this.handleAttrNameEnd(c);
        } else if (c === 46) {
          this.cbs.ondirmodifier(this.sectionStart, this.index);
          this.sectionStart = this.index + 1;
        }
      }
      handleAttrNameEnd(c) {
        this.sectionStart = this.index;
        this.state = 17;
        this.cbs.onattribnameend(this.index);
        this.stateAfterAttrName(c);
      }
      stateAfterAttrName(c) {
        if (c === 61) {
          this.state = 18;
        } else if (c === 47 || c === 62) {
          this.cbs.onattribend(0, this.sectionStart);
          this.sectionStart = -1;
          this.state = 11;
          this.stateBeforeAttrName(c);
        } else if (!isWhitespace(c)) {
          this.cbs.onattribend(0, this.sectionStart);
          this.handleAttrStart(c);
        }
      }
      stateBeforeAttrValue(c) {
        if (c === 34) {
          this.state = 19;
          this.sectionStart = this.index + 1;
        } else if (c === 39) {
          this.state = 20;
          this.sectionStart = this.index + 1;
        } else if (!isWhitespace(c)) {
          this.sectionStart = this.index;
          this.state = 21;
          this.stateInAttrValueNoQuotes(c);
        }
      }
      handleInAttrValue(c, quote) {
        if (c === quote || this.fastForwardTo(quote)) {
          this.cbs.onattribdata(this.sectionStart, this.index);
          this.sectionStart = -1;
          this.cbs.onattribend(
            quote === 34 ? 3 : 2,
            this.index + 1
          );
          this.state = 11;
        }
      }
      stateInAttrValueDoubleQuotes(c) {
        this.handleInAttrValue(c, 34);
      }
      stateInAttrValueSingleQuotes(c) {
        this.handleInAttrValue(c, 39);
      }
      stateInAttrValueNoQuotes(c) {
        if (isWhitespace(c) || c === 62) {
          this.cbs.onattribdata(this.sectionStart, this.index);
          this.sectionStart = -1;
          this.cbs.onattribend(1, this.index);
          this.state = 11;
          this.stateBeforeAttrName(c);
        } else if (c === 34 || c === 39 || c === 60 || c === 61 || c === 96) {
          this.cbs.onerr(
            18,
            this.index
          );
        } else ;
      }
      stateBeforeDeclaration(c) {
        if (c === 91) {
          this.state = 26;
          this.sequenceIndex = 0;
        } else {
          this.state = c === 45 ? 25 : 23;
        }
      }
      stateInDeclaration(c) {
        if (c === 62 || this.fastForwardTo(62)) {
          this.state = 1;
          this.sectionStart = this.index + 1;
        }
      }
      stateInProcessingInstruction(c) {
        if (c === 62 || this.fastForwardTo(62)) {
          this.cbs.onprocessinginstruction(this.sectionStart, this.index);
          this.state = 1;
          this.sectionStart = this.index + 1;
        }
      }
      stateBeforeComment(c) {
        if (c === 45) {
          this.state = 28;
          this.currentSequence = Sequences.CommentEnd;
          this.sequenceIndex = 2;
          this.sectionStart = this.index + 1;
        } else {
          this.state = 23;
        }
      }
      stateInSpecialComment(c) {
        if (c === 62 || this.fastForwardTo(62)) {
          this.cbs.oncomment(this.sectionStart, this.index);
          this.state = 1;
          this.sectionStart = this.index + 1;
        }
      }
      stateBeforeSpecialS(c) {
        if (c === Sequences.ScriptEnd[3]) {
          this.startSpecial(Sequences.ScriptEnd, 4);
        } else if (c === Sequences.StyleEnd[3]) {
          this.startSpecial(Sequences.StyleEnd, 4);
        } else {
          this.state = 6;
          this.stateInTagName(c);
        }
      }
      stateBeforeSpecialT(c) {
        if (c === Sequences.TitleEnd[3]) {
          this.startSpecial(Sequences.TitleEnd, 4);
        } else if (c === Sequences.TextareaEnd[3]) {
          this.startSpecial(Sequences.TextareaEnd, 4);
        } else {
          this.state = 6;
          this.stateInTagName(c);
        }
      }
      startEntity() {
      }
      stateInEntity() {
      }
      /**
       * Iterates through the buffer, calling the function corresponding to the current state.
       *
       * States that are more likely to be hit are higher up, as a performance improvement.
       */
      parse(input) {
        this.buffer = input;
        while (this.index < this.buffer.length) {
          const c = this.buffer.charCodeAt(this.index);
          if (c === 10) {
            this.newlines.push(this.index);
          }
          switch (this.state) {
            case 1: {
              this.stateText(c);
              break;
            }
            case 2: {
              this.stateInterpolationOpen(c);
              break;
            }
            case 3: {
              this.stateInterpolation(c);
              break;
            }
            case 4: {
              this.stateInterpolationClose(c);
              break;
            }
            case 31: {
              this.stateSpecialStartSequence(c);
              break;
            }
            case 32: {
              this.stateInRCDATA(c);
              break;
            }
            case 26: {
              this.stateCDATASequence(c);
              break;
            }
            case 19: {
              this.stateInAttrValueDoubleQuotes(c);
              break;
            }
            case 12: {
              this.stateInAttrName(c);
              break;
            }
            case 13: {
              this.stateInDirName(c);
              break;
            }
            case 14: {
              this.stateInDirArg(c);
              break;
            }
            case 15: {
              this.stateInDynamicDirArg(c);
              break;
            }
            case 16: {
              this.stateInDirModifier(c);
              break;
            }
            case 28: {
              this.stateInCommentLike(c);
              break;
            }
            case 27: {
              this.stateInSpecialComment(c);
              break;
            }
            case 11: {
              this.stateBeforeAttrName(c);
              break;
            }
            case 6: {
              this.stateInTagName(c);
              break;
            }
            case 34: {
              this.stateInSFCRootTagName(c);
              break;
            }
            case 9: {
              this.stateInClosingTagName(c);
              break;
            }
            case 5: {
              this.stateBeforeTagName(c);
              break;
            }
            case 17: {
              this.stateAfterAttrName(c);
              break;
            }
            case 20: {
              this.stateInAttrValueSingleQuotes(c);
              break;
            }
            case 18: {
              this.stateBeforeAttrValue(c);
              break;
            }
            case 8: {
              this.stateBeforeClosingTagName(c);
              break;
            }
            case 10: {
              this.stateAfterClosingTagName(c);
              break;
            }
            case 29: {
              this.stateBeforeSpecialS(c);
              break;
            }
            case 30: {
              this.stateBeforeSpecialT(c);
              break;
            }
            case 21: {
              this.stateInAttrValueNoQuotes(c);
              break;
            }
            case 7: {
              this.stateInSelfClosingTag(c);
              break;
            }
            case 23: {
              this.stateInDeclaration(c);
              break;
            }
            case 22: {
              this.stateBeforeDeclaration(c);
              break;
            }
            case 25: {
              this.stateBeforeComment(c);
              break;
            }
            case 24: {
              this.stateInProcessingInstruction(c);
              break;
            }
            case 33: {
              this.stateInEntity();
              break;
            }
          }
          this.index++;
        }
        this.cleanup();
        this.finish();
      }
      /**
       * Remove data that has already been consumed from the buffer.
       */
      cleanup() {
        if (this.sectionStart !== this.index) {
          if (this.state === 1 || this.state === 32 && this.sequenceIndex === 0) {
            this.cbs.ontext(this.sectionStart, this.index);
            this.sectionStart = this.index;
          } else if (this.state === 19 || this.state === 20 || this.state === 21) {
            this.cbs.onattribdata(this.sectionStart, this.index);
            this.sectionStart = this.index;
          }
        }
      }
      finish() {
        this.handleTrailingData();
        this.cbs.onend();
      }
      /** Handle any trailing data. */
      handleTrailingData() {
        const endIndex = this.buffer.length;
        if (this.sectionStart >= endIndex) {
          return;
        }
        if (this.state === 28) {
          if (this.currentSequence === Sequences.CdataEnd) {
            this.cbs.oncdata(this.sectionStart, endIndex);
          } else {
            this.cbs.oncomment(this.sectionStart, endIndex);
          }
        } else if (this.state === 6 || this.state === 11 || this.state === 18 || this.state === 17 || this.state === 12 || this.state === 13 || this.state === 14 || this.state === 15 || this.state === 16 || this.state === 20 || this.state === 19 || this.state === 21 || this.state === 9) ;
        else {
          this.cbs.ontext(this.sectionStart, endIndex);
        }
      }
      emitCodePoint(cp, consumed) {
      }
    };
    CompilerDeprecationTypes = {
      "COMPILER_IS_ON_ELEMENT": "COMPILER_IS_ON_ELEMENT",
      "COMPILER_V_BIND_SYNC": "COMPILER_V_BIND_SYNC",
      "COMPILER_V_BIND_OBJECT_ORDER": "COMPILER_V_BIND_OBJECT_ORDER",
      "COMPILER_V_ON_NATIVE": "COMPILER_V_ON_NATIVE",
      "COMPILER_V_IF_V_FOR_PRECEDENCE": "COMPILER_V_IF_V_FOR_PRECEDENCE",
      "COMPILER_NATIVE_TEMPLATE": "COMPILER_NATIVE_TEMPLATE",
      "COMPILER_INLINE_TEMPLATE": "COMPILER_INLINE_TEMPLATE",
      "COMPILER_FILTERS": "COMPILER_FILTERS"
    };
    deprecationData = {
      ["COMPILER_IS_ON_ELEMENT"]: {
        message: `Platform-native elements with "is" prop will no longer be treated as components in Vue 3 unless the "is" value is explicitly prefixed with "vue:".`,
        link: `https://v3-migration.vuejs.org/breaking-changes/custom-elements-interop.html`
      },
      ["COMPILER_V_BIND_SYNC"]: {
        message: (key) => `.sync modifier for v-bind has been removed. Use v-model with argument instead. \`v-bind:${key}.sync\` should be changed to \`v-model:${key}\`.`,
        link: `https://v3-migration.vuejs.org/breaking-changes/v-model.html`
      },
      ["COMPILER_V_BIND_OBJECT_ORDER"]: {
        message: `v-bind="obj" usage is now order sensitive and behaves like JavaScript object spread: it will now overwrite an existing non-mergeable attribute that appears before v-bind in the case of conflict. To retain 2.x behavior, move v-bind to make it the first attribute. You can also suppress this warning if the usage is intended.`,
        link: `https://v3-migration.vuejs.org/breaking-changes/v-bind.html`
      },
      ["COMPILER_V_ON_NATIVE"]: {
        message: `.native modifier for v-on has been removed as is no longer necessary.`,
        link: `https://v3-migration.vuejs.org/breaking-changes/v-on-native-modifier-removed.html`
      },
      ["COMPILER_V_IF_V_FOR_PRECEDENCE"]: {
        message: `v-if / v-for precedence when used on the same element has changed in Vue 3: v-if now takes higher precedence and will no longer have access to v-for scope variables. It is best to avoid the ambiguity with <template> tags or use a computed property that filters v-for data source.`,
        link: `https://v3-migration.vuejs.org/breaking-changes/v-if-v-for.html`
      },
      ["COMPILER_NATIVE_TEMPLATE"]: {
        message: `<template> with no special directives will render as a native template element instead of its inner content in Vue 3.`
      },
      ["COMPILER_INLINE_TEMPLATE"]: {
        message: `"inline-template" has been removed in Vue 3.`,
        link: `https://v3-migration.vuejs.org/breaking-changes/inline-template-attribute.html`
      },
      ["COMPILER_FILTERS"]: {
        message: `filters have been removed in Vue 3. The "|" symbol will be treated as native JavaScript bitwise OR operator. Use method calls or computed properties instead.`,
        link: `https://v3-migration.vuejs.org/breaking-changes/filters.html`
      }
    };
    ErrorCodes = {
      "ABRUPT_CLOSING_OF_EMPTY_COMMENT": 0,
      "0": "ABRUPT_CLOSING_OF_EMPTY_COMMENT",
      "CDATA_IN_HTML_CONTENT": 1,
      "1": "CDATA_IN_HTML_CONTENT",
      "DUPLICATE_ATTRIBUTE": 2,
      "2": "DUPLICATE_ATTRIBUTE",
      "END_TAG_WITH_ATTRIBUTES": 3,
      "3": "END_TAG_WITH_ATTRIBUTES",
      "END_TAG_WITH_TRAILING_SOLIDUS": 4,
      "4": "END_TAG_WITH_TRAILING_SOLIDUS",
      "EOF_BEFORE_TAG_NAME": 5,
      "5": "EOF_BEFORE_TAG_NAME",
      "EOF_IN_CDATA": 6,
      "6": "EOF_IN_CDATA",
      "EOF_IN_COMMENT": 7,
      "7": "EOF_IN_COMMENT",
      "EOF_IN_SCRIPT_HTML_COMMENT_LIKE_TEXT": 8,
      "8": "EOF_IN_SCRIPT_HTML_COMMENT_LIKE_TEXT",
      "EOF_IN_TAG": 9,
      "9": "EOF_IN_TAG",
      "INCORRECTLY_CLOSED_COMMENT": 10,
      "10": "INCORRECTLY_CLOSED_COMMENT",
      "INCORRECTLY_OPENED_COMMENT": 11,
      "11": "INCORRECTLY_OPENED_COMMENT",
      "INVALID_FIRST_CHARACTER_OF_TAG_NAME": 12,
      "12": "INVALID_FIRST_CHARACTER_OF_TAG_NAME",
      "MISSING_ATTRIBUTE_VALUE": 13,
      "13": "MISSING_ATTRIBUTE_VALUE",
      "MISSING_END_TAG_NAME": 14,
      "14": "MISSING_END_TAG_NAME",
      "MISSING_WHITESPACE_BETWEEN_ATTRIBUTES": 15,
      "15": "MISSING_WHITESPACE_BETWEEN_ATTRIBUTES",
      "NESTED_COMMENT": 16,
      "16": "NESTED_COMMENT",
      "UNEXPECTED_CHARACTER_IN_ATTRIBUTE_NAME": 17,
      "17": "UNEXPECTED_CHARACTER_IN_ATTRIBUTE_NAME",
      "UNEXPECTED_CHARACTER_IN_UNQUOTED_ATTRIBUTE_VALUE": 18,
      "18": "UNEXPECTED_CHARACTER_IN_UNQUOTED_ATTRIBUTE_VALUE",
      "UNEXPECTED_EQUALS_SIGN_BEFORE_ATTRIBUTE_NAME": 19,
      "19": "UNEXPECTED_EQUALS_SIGN_BEFORE_ATTRIBUTE_NAME",
      "UNEXPECTED_NULL_CHARACTER": 20,
      "20": "UNEXPECTED_NULL_CHARACTER",
      "UNEXPECTED_QUESTION_MARK_INSTEAD_OF_TAG_NAME": 21,
      "21": "UNEXPECTED_QUESTION_MARK_INSTEAD_OF_TAG_NAME",
      "UNEXPECTED_SOLIDUS_IN_TAG": 22,
      "22": "UNEXPECTED_SOLIDUS_IN_TAG",
      "X_INVALID_END_TAG": 23,
      "23": "X_INVALID_END_TAG",
      "X_MISSING_END_TAG": 24,
      "24": "X_MISSING_END_TAG",
      "X_MISSING_INTERPOLATION_END": 25,
      "25": "X_MISSING_INTERPOLATION_END",
      "X_MISSING_DIRECTIVE_NAME": 26,
      "26": "X_MISSING_DIRECTIVE_NAME",
      "X_MISSING_DYNAMIC_DIRECTIVE_ARGUMENT_END": 27,
      "27": "X_MISSING_DYNAMIC_DIRECTIVE_ARGUMENT_END",
      "X_V_IF_NO_EXPRESSION": 28,
      "28": "X_V_IF_NO_EXPRESSION",
      "X_V_IF_SAME_KEY": 29,
      "29": "X_V_IF_SAME_KEY",
      "X_V_ELSE_NO_ADJACENT_IF": 30,
      "30": "X_V_ELSE_NO_ADJACENT_IF",
      "X_V_FOR_NO_EXPRESSION": 31,
      "31": "X_V_FOR_NO_EXPRESSION",
      "X_V_FOR_MALFORMED_EXPRESSION": 32,
      "32": "X_V_FOR_MALFORMED_EXPRESSION",
      "X_V_FOR_TEMPLATE_KEY_PLACEMENT": 33,
      "33": "X_V_FOR_TEMPLATE_KEY_PLACEMENT",
      "X_V_BIND_NO_EXPRESSION": 34,
      "34": "X_V_BIND_NO_EXPRESSION",
      "X_V_ON_NO_EXPRESSION": 35,
      "35": "X_V_ON_NO_EXPRESSION",
      "X_V_SLOT_UNEXPECTED_DIRECTIVE_ON_SLOT_OUTLET": 36,
      "36": "X_V_SLOT_UNEXPECTED_DIRECTIVE_ON_SLOT_OUTLET",
      "X_V_SLOT_MIXED_SLOT_USAGE": 37,
      "37": "X_V_SLOT_MIXED_SLOT_USAGE",
      "X_V_SLOT_DUPLICATE_SLOT_NAMES": 38,
      "38": "X_V_SLOT_DUPLICATE_SLOT_NAMES",
      "X_V_SLOT_EXTRANEOUS_DEFAULT_SLOT_CHILDREN": 39,
      "39": "X_V_SLOT_EXTRANEOUS_DEFAULT_SLOT_CHILDREN",
      "X_V_SLOT_MISPLACED": 40,
      "40": "X_V_SLOT_MISPLACED",
      "X_V_MODEL_NO_EXPRESSION": 41,
      "41": "X_V_MODEL_NO_EXPRESSION",
      "X_V_MODEL_MALFORMED_EXPRESSION": 42,
      "42": "X_V_MODEL_MALFORMED_EXPRESSION",
      "X_V_MODEL_ON_SCOPE_VARIABLE": 43,
      "43": "X_V_MODEL_ON_SCOPE_VARIABLE",
      "X_V_MODEL_ON_PROPS": 44,
      "44": "X_V_MODEL_ON_PROPS",
      "X_INVALID_EXPRESSION": 45,
      "45": "X_INVALID_EXPRESSION",
      "X_KEEP_ALIVE_INVALID_CHILDREN": 46,
      "46": "X_KEEP_ALIVE_INVALID_CHILDREN",
      "X_PREFIX_ID_NOT_SUPPORTED": 47,
      "47": "X_PREFIX_ID_NOT_SUPPORTED",
      "X_MODULE_MODE_NOT_SUPPORTED": 48,
      "48": "X_MODULE_MODE_NOT_SUPPORTED",
      "X_CACHE_HANDLER_NOT_SUPPORTED": 49,
      "49": "X_CACHE_HANDLER_NOT_SUPPORTED",
      "X_SCOPE_ID_NOT_SUPPORTED": 50,
      "50": "X_SCOPE_ID_NOT_SUPPORTED",
      "X_VNODE_HOOKS": 51,
      "51": "X_VNODE_HOOKS",
      "X_V_BIND_INVALID_SAME_NAME_ARGUMENT": 52,
      "52": "X_V_BIND_INVALID_SAME_NAME_ARGUMENT",
      "__EXTEND_POINT__": 53,
      "53": "__EXTEND_POINT__"
    };
    errorMessages = {
      // parse errors
      [0]: "Illegal comment.",
      [1]: "CDATA section is allowed only in XML context.",
      [2]: "Duplicate attribute.",
      [3]: "End tag cannot have attributes.",
      [4]: "Illegal '/' in tags.",
      [5]: "Unexpected EOF in tag.",
      [6]: "Unexpected EOF in CDATA section.",
      [7]: "Unexpected EOF in comment.",
      [8]: "Unexpected EOF in script.",
      [9]: "Unexpected EOF in tag.",
      [10]: "Incorrectly closed comment.",
      [11]: "Incorrectly opened comment.",
      [12]: "Illegal tag name. Use '&lt;' to print '<'.",
      [13]: "Attribute value was expected.",
      [14]: "End tag name was expected.",
      [15]: "Whitespace was expected.",
      [16]: "Unexpected '<!--' in comment.",
      [17]: `Attribute name cannot contain U+0022 ("), U+0027 ('), and U+003C (<).`,
      [18]: "Unquoted attribute value cannot contain U+0022 (\"), U+0027 ('), U+003C (<), U+003D (=), and U+0060 (`).",
      [19]: "Attribute name cannot start with '='.",
      [21]: "'<?' is allowed only in XML context.",
      [20]: `Unexpected null character.`,
      [22]: "Illegal '/' in tags.",
      // Vue-specific parse errors
      [23]: "Invalid end tag.",
      [24]: "Element is missing end tag.",
      [25]: "Interpolation end sign was not found.",
      [27]: "End bracket for dynamic directive argument was not found. Note that dynamic directive argument cannot contain spaces.",
      [26]: "Legal directive name was expected.",
      // transform errors
      [28]: `v-if/v-else-if is missing expression.`,
      [29]: `v-if/else branches must use unique keys.`,
      [30]: `v-else/v-else-if has no adjacent v-if or v-else-if.`,
      [31]: `v-for is missing expression.`,
      [32]: `v-for has invalid expression.`,
      [33]: `<template v-for> key should be placed on the <template> tag.`,
      [34]: `v-bind is missing expression.`,
      [52]: `v-bind with same-name shorthand only allows static argument.`,
      [35]: `v-on is missing expression.`,
      [36]: `Unexpected custom directive on <slot> outlet.`,
      [37]: `Mixed v-slot usage on both the component and nested <template>. When there are multiple named slots, all slots should use <template> syntax to avoid scope ambiguity.`,
      [38]: `Duplicate slot names found. `,
      [39]: `Extraneous children found when component already has explicitly named default slot. These children will be ignored.`,
      [40]: `v-slot can only be used on components or <template> tags.`,
      [41]: `v-model is missing expression.`,
      [42]: `v-model value must be a valid JavaScript member expression.`,
      [43]: `v-model cannot be used on v-for or v-slot scope variables because they are not writable.`,
      [44]: `v-model cannot be used on a prop, because local prop bindings are not writable.
Use a v-bind binding combined with a v-on listener that emits update:x event instead.`,
      [45]: `Error parsing JavaScript expression: `,
      [46]: `<KeepAlive> expects exactly one child component.`,
      [51]: `@vnode-* hooks in templates are no longer supported. Use the vue: prefix instead. For example, @vnode-mounted should be changed to @vue:mounted. @vnode-* hooks support has been removed in 3.4.`,
      // generic errors
      [47]: `"prefixIdentifiers" option is not supported in this build of compiler.`,
      [48]: `ES module mode is not supported in this build of compiler.`,
      [49]: `"cacheHandlers" option is only supported when the "prefixIdentifiers" option is enabled.`,
      [50]: `"scopeId" option is only supported in module mode.`,
      // just to fulfill types
      [53]: ``
    };
    isFunctionType = (node) => {
      return /Function(?:Expression|Declaration)$|Method$/.test(node.type);
    };
    isStaticProperty = (node) => node && (node.type === "ObjectProperty" || node.type === "ObjectMethod") && !node.computed;
    isStaticPropertyKey = (node, parent) => isStaticProperty(parent) && parent.key === node;
    TS_NODE_TYPES = [
      "TSAsExpression",
      // foo as number
      "TSTypeAssertion",
      // (<number>foo)
      "TSNonNullExpression",
      // foo!
      "TSInstantiationExpression",
      // foo<string>
      "TSSatisfiesExpression"
      // foo satisfies T
    ];
    isStaticExp = (p) => p.type === 4 && p.isStatic;
    nonIdentifierRE = /^\d|[^\$\w\xA0-\uFFFF]/;
    isSimpleIdentifier = (name) => !nonIdentifierRE.test(name);
    validFirstIdentCharRE = /[A-Za-z_$\xA0-\uFFFF]/;
    validIdentCharRE = /[\.\?\w$\xA0-\uFFFF]/;
    whitespaceRE = /\s+[.[]\s*|\s*[.[]\s+/g;
    getExpSource = (exp) => exp.type === 4 ? exp.content : exp.loc.source;
    isMemberExpressionBrowser = (exp) => {
      const path = getExpSource(exp).trim().replace(whitespaceRE, (s) => s.trim());
      let state = 0;
      let stateStack = [];
      let currentOpenBracketCount = 0;
      let currentOpenParensCount = 0;
      let currentStringType = null;
      for (let i = 0; i < path.length; i++) {
        const char = path.charAt(i);
        switch (state) {
          case 0:
            if (char === "[") {
              stateStack.push(state);
              state = 1;
              currentOpenBracketCount++;
            } else if (char === "(") {
              stateStack.push(state);
              state = 2;
              currentOpenParensCount++;
            } else if (!(i === 0 ? validFirstIdentCharRE : validIdentCharRE).test(char)) {
              return false;
            }
            break;
          case 1:
            if (char === `'` || char === `"` || char === "`") {
              stateStack.push(state);
              state = 3;
              currentStringType = char;
            } else if (char === `[`) {
              currentOpenBracketCount++;
            } else if (char === `]`) {
              if (!--currentOpenBracketCount) {
                state = stateStack.pop();
              }
            }
            break;
          case 2:
            if (char === `'` || char === `"` || char === "`") {
              stateStack.push(state);
              state = 3;
              currentStringType = char;
            } else if (char === `(`) {
              currentOpenParensCount++;
            } else if (char === `)`) {
              if (i === path.length - 1) {
                return false;
              }
              if (!--currentOpenParensCount) {
                state = stateStack.pop();
              }
            }
            break;
          case 3:
            if (char === currentStringType) {
              state = stateStack.pop();
              currentStringType = null;
            }
            break;
        }
      }
      return !currentOpenBracketCount && !currentOpenParensCount;
    };
    isMemberExpressionNode = NOOP;
    isMemberExpression = isMemberExpressionBrowser;
    fnExpRE = /^\s*(async\s*)?(\([^)]*?\)|[\w$_]+)\s*(:[^=]+)?=>|^\s*(async\s+)?function(?:\s+[\w$]+)?\s*\(/;
    isFnExpressionBrowser = (exp) => fnExpRE.test(getExpSource(exp));
    isFnExpressionNode = NOOP;
    isFnExpression = isFnExpressionBrowser;
    propsHelperSet = /* @__PURE__ */ new Set([NORMALIZE_PROPS, GUARD_REACTIVE_PROPS]);
    forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+(\S[\s\S]*)/;
    defaultParserOptions = {
      parseMode: "base",
      ns: 0,
      delimiters: [`{{`, `}}`],
      getNamespace: () => 0,
      isVoidTag: NO,
      isPreTag: NO,
      isIgnoreNewlineTag: NO,
      isCustomElement: NO,
      onError: defaultOnError,
      onWarn: defaultOnWarn,
      comments: true,
      prefixIdentifiers: false
    };
    currentOptions = defaultParserOptions;
    currentRoot = null;
    currentInput = "";
    currentOpenTag = null;
    currentProp = null;
    currentAttrValue = "";
    currentAttrStartIndex = -1;
    currentAttrEndIndex = -1;
    inPre = 0;
    inVPre = false;
    currentVPreBoundary = null;
    stack = [];
    tokenizer = new Tokenizer(stack, {
      onerr: emitError,
      ontext(start, end) {
        onText(getSlice(start, end), start, end);
      },
      ontextentity(char, start, end) {
        onText(char, start, end);
      },
      oninterpolation(start, end) {
        if (inVPre) {
          return onText(getSlice(start, end), start, end);
        }
        let innerStart = start + tokenizer.delimiterOpen.length;
        let innerEnd = end - tokenizer.delimiterClose.length;
        while (isWhitespace(currentInput.charCodeAt(innerStart))) {
          innerStart++;
        }
        while (isWhitespace(currentInput.charCodeAt(innerEnd - 1))) {
          innerEnd--;
        }
        let exp = getSlice(innerStart, innerEnd);
        if (exp.includes("&")) {
          {
            exp = currentOptions.decodeEntities(exp, false);
          }
        }
        addNode({
          type: 5,
          content: createExp(exp, false, getLoc(innerStart, innerEnd)),
          loc: getLoc(start, end)
        });
      },
      onopentagname(start, end) {
        const name = getSlice(start, end);
        currentOpenTag = {
          type: 1,
          tag: name,
          ns: currentOptions.getNamespace(name, stack[0], currentOptions.ns),
          tagType: 0,
          // will be refined on tag close
          props: [],
          children: [],
          loc: getLoc(start - 1, end),
          codegenNode: void 0
        };
      },
      onopentagend(end) {
        endOpenTag(end);
      },
      onclosetag(start, end) {
        const name = getSlice(start, end);
        if (!currentOptions.isVoidTag(name)) {
          let found = false;
          for (let i = 0; i < stack.length; i++) {
            const e = stack[i];
            if (e.tag.toLowerCase() === name.toLowerCase()) {
              found = true;
              if (i > 0) {
                emitError(24, stack[0].loc.start.offset);
              }
              for (let j = 0; j <= i; j++) {
                const el = stack.shift();
                onCloseTag(el, end, j < i);
              }
              break;
            }
          }
          if (!found) {
            emitError(23, backTrack(start, 60));
          }
        }
      },
      onselfclosingtag(end) {
        const name = currentOpenTag.tag;
        currentOpenTag.isSelfClosing = true;
        endOpenTag(end);
        if (stack[0] && stack[0].tag === name) {
          onCloseTag(stack.shift(), end);
        }
      },
      onattribname(start, end) {
        currentProp = {
          type: 6,
          name: getSlice(start, end),
          nameLoc: getLoc(start, end),
          value: void 0,
          loc: getLoc(start)
        };
      },
      ondirname(start, end) {
        const raw = getSlice(start, end);
        const name = raw === "." || raw === ":" ? "bind" : raw === "@" ? "on" : raw === "#" ? "slot" : raw.slice(2);
        if (!inVPre && name === "") {
          emitError(26, start);
        }
        if (inVPre || name === "") {
          currentProp = {
            type: 6,
            name: raw,
            nameLoc: getLoc(start, end),
            value: void 0,
            loc: getLoc(start)
          };
        } else {
          currentProp = {
            type: 7,
            name,
            rawName: raw,
            exp: void 0,
            arg: void 0,
            modifiers: raw === "." ? [createSimpleExpression("prop")] : [],
            loc: getLoc(start)
          };
          if (name === "pre") {
            inVPre = tokenizer.inVPre = true;
            currentVPreBoundary = currentOpenTag;
            const props = currentOpenTag.props;
            for (let i = 0; i < props.length; i++) {
              if (props[i].type === 7) {
                props[i] = dirToAttr(props[i]);
              }
            }
          }
        }
      },
      ondirarg(start, end) {
        if (start === end) return;
        const arg = getSlice(start, end);
        if (inVPre) {
          currentProp.name += arg;
          setLocEnd(currentProp.nameLoc, end);
        } else {
          const isStatic = arg[0] !== `[`;
          currentProp.arg = createExp(
            isStatic ? arg : arg.slice(1, -1),
            isStatic,
            getLoc(start, end),
            isStatic ? 3 : 0
          );
        }
      },
      ondirmodifier(start, end) {
        const mod = getSlice(start, end);
        if (inVPre) {
          currentProp.name += "." + mod;
          setLocEnd(currentProp.nameLoc, end);
        } else if (currentProp.name === "slot") {
          const arg = currentProp.arg;
          if (arg) {
            arg.content += "." + mod;
            setLocEnd(arg.loc, end);
          }
        } else {
          const exp = createSimpleExpression(mod, true, getLoc(start, end));
          currentProp.modifiers.push(exp);
        }
      },
      onattribdata(start, end) {
        currentAttrValue += getSlice(start, end);
        if (currentAttrStartIndex < 0) currentAttrStartIndex = start;
        currentAttrEndIndex = end;
      },
      onattribentity(char, start, end) {
        currentAttrValue += char;
        if (currentAttrStartIndex < 0) currentAttrStartIndex = start;
        currentAttrEndIndex = end;
      },
      onattribnameend(end) {
        const start = currentProp.loc.start.offset;
        const name = getSlice(start, end);
        if (currentProp.type === 7) {
          currentProp.rawName = name;
        }
        if (currentOpenTag.props.some(
          (p) => (p.type === 7 ? p.rawName : p.name) === name
        )) {
          emitError(2, start);
        }
      },
      onattribend(quote, end) {
        if (currentOpenTag && currentProp) {
          setLocEnd(currentProp.loc, end);
          if (quote !== 0) {
            if (currentAttrValue.includes("&")) {
              currentAttrValue = currentOptions.decodeEntities(
                currentAttrValue,
                true
              );
            }
            if (currentProp.type === 6) {
              if (currentProp.name === "class") {
                currentAttrValue = condense(currentAttrValue).trim();
              }
              if (quote === 1 && !currentAttrValue) {
                emitError(13, end);
              }
              currentProp.value = {
                type: 2,
                content: currentAttrValue,
                loc: quote === 1 ? getLoc(currentAttrStartIndex, currentAttrEndIndex) : getLoc(currentAttrStartIndex - 1, currentAttrEndIndex + 1)
              };
              if (tokenizer.inSFCRoot && currentOpenTag.tag === "template" && currentProp.name === "lang" && currentAttrValue && currentAttrValue !== "html") {
                tokenizer.enterRCDATA(toCharCodes(`</template`), 0);
              }
            } else {
              let expParseMode = 0;
              currentProp.exp = createExp(
                currentAttrValue,
                false,
                getLoc(currentAttrStartIndex, currentAttrEndIndex),
                0,
                expParseMode
              );
              if (currentProp.name === "for") {
                currentProp.forParseResult = parseForExpression(currentProp.exp);
              }
              let syncIndex = -1;
              if (currentProp.name === "bind" && (syncIndex = currentProp.modifiers.findIndex(
                (mod) => mod.content === "sync"
              )) > -1 && checkCompatEnabled(
                "COMPILER_V_BIND_SYNC",
                currentOptions,
                currentProp.loc,
                currentProp.rawName
              )) {
                currentProp.name = "model";
                currentProp.modifiers.splice(syncIndex, 1);
              }
            }
          }
          if (currentProp.type !== 7 || currentProp.name !== "pre") {
            currentOpenTag.props.push(currentProp);
          }
        }
        currentAttrValue = "";
        currentAttrStartIndex = currentAttrEndIndex = -1;
      },
      oncomment(start, end) {
        if (currentOptions.comments) {
          addNode({
            type: 3,
            content: getSlice(start, end),
            loc: getLoc(start - 4, end + 3)
          });
        }
      },
      onend() {
        const end = currentInput.length;
        if (tokenizer.state !== 1) {
          switch (tokenizer.state) {
            case 5:
            case 8:
              emitError(5, end);
              break;
            case 3:
            case 4:
              emitError(
                25,
                tokenizer.sectionStart
              );
              break;
            case 28:
              if (tokenizer.currentSequence === Sequences.CdataEnd) {
                emitError(6, end);
              } else {
                emitError(7, end);
              }
              break;
            case 6:
            case 7:
            case 9:
            case 11:
            case 12:
            case 13:
            case 14:
            case 15:
            case 16:
            case 17:
            case 18:
            case 19:
            // "
            case 20:
            // '
            case 21:
              emitError(9, end);
              break;
          }
        }
        for (let index = 0; index < stack.length; index++) {
          onCloseTag(stack[index], end - 1);
          emitError(24, stack[index].loc.start.offset);
        }
      },
      oncdata(start, end) {
        if (stack[0].ns !== 0) {
          onText(getSlice(start, end), start, end);
        } else {
          emitError(1, start - 9);
        }
      },
      onprocessinginstruction(start) {
        if ((stack[0] ? stack[0].ns : currentOptions.ns) === 0) {
          emitError(
            21,
            start - 1
          );
        }
      }
    });
    forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
    stripParensRE = /^\(|\)$/g;
    specialTemplateDir = /* @__PURE__ */ new Set(["if", "else", "else-if", "for", "slot"]);
    windowsNewlineRE = /\r\n/g;
    allowHoistedHelperSet = /* @__PURE__ */ new Set([
      NORMALIZE_CLASS,
      NORMALIZE_STYLE,
      NORMALIZE_PROPS,
      GUARD_REACTIVE_PROPS
    ]);
    PURE_ANNOTATION = `/*@__PURE__*/`;
    aliasHelper = (s) => `${helperNameMap[s]}: _${helperNameMap[s]}`;
    prohibitedKeywordRE = new RegExp(
      "\\b" + "arguments,await,break,case,catch,class,const,continue,debugger,default,delete,do,else,export,extends,finally,for,function,if,import,let,new,return,super,switch,throw,try,var,void,while,with,yield".split(",").join("\\b|\\b") + "\\b"
    );
    stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;
    transformExpression = (node, context) => {
      if (node.type === 5) {
        node.content = processExpression(
          node.content,
          context
        );
      } else if (node.type === 1) {
        const memo = findDir(node, "memo");
        for (let i = 0; i < node.props.length; i++) {
          const dir = node.props[i];
          if (dir.type === 7 && dir.name !== "for") {
            const exp = dir.exp;
            const arg = dir.arg;
            if (exp && exp.type === 4 && !(dir.name === "on" && arg) && // key has been processed in transformFor(vMemo + vFor)
            !(memo && arg && arg.type === 4 && arg.content === "key")) {
              dir.exp = processExpression(
                exp,
                context,
                // slot args must be processed as function params
                dir.name === "slot"
              );
            }
            if (arg && arg.type === 4 && !arg.isStatic) {
              dir.arg = processExpression(arg, context);
            }
          }
        }
      }
    };
    transformIf = createStructuralDirectiveTransform(
      /^(if|else|else-if)$/,
      (node, dir, context) => {
        return processIf(node, dir, context, (ifNode, branch, isRoot) => {
          const siblings = context.parent.children;
          let i = siblings.indexOf(ifNode);
          let key = 0;
          while (i-- >= 0) {
            const sibling = siblings[i];
            if (sibling && sibling.type === 9) {
              key += sibling.branches.length;
            }
          }
          return () => {
            if (isRoot) {
              ifNode.codegenNode = createCodegenNodeForBranch(
                branch,
                key,
                context
              );
            } else {
              const parentCondition = getParentCondition(ifNode.codegenNode);
              parentCondition.alternate = createCodegenNodeForBranch(
                branch,
                key + ifNode.branches.length - 1,
                context
              );
            }
          };
        });
      }
    );
    transformBind = (dir, _node, context) => {
      const { modifiers, loc } = dir;
      const arg = dir.arg;
      let { exp } = dir;
      if (exp && exp.type === 4 && !exp.content.trim()) {
        {
          exp = void 0;
        }
      }
      if (!exp) {
        if (arg.type !== 4 || !arg.isStatic) {
          context.onError(
            createCompilerError(
              52,
              arg.loc
            )
          );
          return {
            props: [
              createObjectProperty(arg, createSimpleExpression("", true, loc))
            ]
          };
        }
        transformBindShorthand(dir);
        exp = dir.exp;
      }
      if (arg.type !== 4) {
        arg.children.unshift(`(`);
        arg.children.push(`) || ""`);
      } else if (!arg.isStatic) {
        arg.content = `${arg.content} || ""`;
      }
      if (modifiers.some((mod) => mod.content === "camel")) {
        if (arg.type === 4) {
          if (arg.isStatic) {
            arg.content = camelize(arg.content);
          } else {
            arg.content = `${context.helperString(CAMELIZE)}(${arg.content})`;
          }
        } else {
          arg.children.unshift(`${context.helperString(CAMELIZE)}(`);
          arg.children.push(`)`);
        }
      }
      if (!context.inSSR) {
        if (modifiers.some((mod) => mod.content === "prop")) {
          injectPrefix(arg, ".");
        }
        if (modifiers.some((mod) => mod.content === "attr")) {
          injectPrefix(arg, "^");
        }
      }
      return {
        props: [createObjectProperty(arg, exp)]
      };
    };
    transformBindShorthand = (dir, context) => {
      const arg = dir.arg;
      const propName = camelize(arg.content);
      dir.exp = createSimpleExpression(propName, false, arg.loc);
    };
    injectPrefix = (arg, prefix) => {
      if (arg.type === 4) {
        if (arg.isStatic) {
          arg.content = prefix + arg.content;
        } else {
          arg.content = `\`${prefix}\${${arg.content}}\``;
        }
      } else {
        arg.children.unshift(`'${prefix}' + (`);
        arg.children.push(`)`);
      }
    };
    transformFor = createStructuralDirectiveTransform(
      "for",
      (node, dir, context) => {
        const { helper, removeHelper } = context;
        return processFor(node, dir, context, (forNode) => {
          const renderExp = createCallExpression(helper(RENDER_LIST), [
            forNode.source
          ]);
          const isTemplate = isTemplateNode(node);
          const memo = findDir(node, "memo");
          const keyProp = findProp(node, `key`, false, true);
          const isDirKey = keyProp && keyProp.type === 7;
          if (isDirKey && !keyProp.exp) {
            transformBindShorthand(keyProp);
          }
          let keyExp = keyProp && (keyProp.type === 6 ? keyProp.value ? createSimpleExpression(keyProp.value.content, true) : void 0 : keyProp.exp);
          const keyProperty = keyProp && keyExp ? createObjectProperty(`key`, keyExp) : null;
          const isStableFragment = forNode.source.type === 4 && forNode.source.constType > 0;
          const fragmentFlag = isStableFragment ? 64 : keyProp ? 128 : 256;
          forNode.codegenNode = createVNodeCall(
            context,
            helper(FRAGMENT),
            void 0,
            renderExp,
            fragmentFlag,
            void 0,
            void 0,
            true,
            !isStableFragment,
            false,
            node.loc
          );
          return () => {
            let childBlock;
            const { children } = forNode;
            if (isTemplate) {
              node.children.some((c) => {
                if (c.type === 1) {
                  const key = findProp(c, "key");
                  if (key) {
                    context.onError(
                      createCompilerError(
                        33,
                        key.loc
                      )
                    );
                    return true;
                  }
                }
              });
            }
            const needFragmentWrapper = children.length !== 1 || children[0].type !== 1;
            const slotOutlet = isSlotOutlet(node) ? node : isTemplate && node.children.length === 1 && isSlotOutlet(node.children[0]) ? node.children[0] : null;
            if (slotOutlet) {
              childBlock = slotOutlet.codegenNode;
              if (isTemplate && keyProperty) {
                injectProp(childBlock, keyProperty, context);
              }
            } else if (needFragmentWrapper) {
              childBlock = createVNodeCall(
                context,
                helper(FRAGMENT),
                keyProperty ? createObjectExpression([keyProperty]) : void 0,
                node.children,
                64,
                void 0,
                void 0,
                true,
                void 0,
                false
              );
            } else {
              childBlock = children[0].codegenNode;
              if (isTemplate && keyProperty) {
                injectProp(childBlock, keyProperty, context);
              }
              if (childBlock.isBlock !== !isStableFragment) {
                if (childBlock.isBlock) {
                  removeHelper(OPEN_BLOCK);
                  removeHelper(
                    getVNodeBlockHelper(context.inSSR, childBlock.isComponent)
                  );
                } else {
                  removeHelper(
                    getVNodeHelper(context.inSSR, childBlock.isComponent)
                  );
                }
              }
              childBlock.isBlock = !isStableFragment;
              if (childBlock.isBlock) {
                helper(OPEN_BLOCK);
                helper(getVNodeBlockHelper(context.inSSR, childBlock.isComponent));
              } else {
                helper(getVNodeHelper(context.inSSR, childBlock.isComponent));
              }
            }
            if (memo) {
              const loop = createFunctionExpression(
                createForLoopParams(forNode.parseResult, [
                  createSimpleExpression(`_cached`)
                ])
              );
              loop.body = createBlockStatement([
                createCompoundExpression([`const _memo = (`, memo.exp, `)`]),
                createCompoundExpression([
                  `if (_cached`,
                  ...keyExp ? [` && _cached.key === `, keyExp] : [],
                  ` && ${context.helperString(
                    IS_MEMO_SAME
                  )}(_cached, _memo)) return _cached`
                ]),
                createCompoundExpression([`const _item = `, childBlock]),
                createSimpleExpression(`_item.memo = _memo`),
                createSimpleExpression(`return _item`)
              ]);
              renderExp.arguments.push(
                loop,
                createSimpleExpression(`_cache`),
                createSimpleExpression(String(context.cached.length))
              );
              context.cached.push(null);
            } else {
              renderExp.arguments.push(
                createFunctionExpression(
                  createForLoopParams(forNode.parseResult),
                  childBlock,
                  true
                )
              );
            }
          };
        });
      }
    );
    defaultFallback = createSimpleExpression(`undefined`, false);
    trackSlotScopes = (node, context) => {
      if (node.type === 1 && (node.tagType === 1 || node.tagType === 3)) {
        const vSlot = findDir(node, "slot");
        if (vSlot) {
          vSlot.exp;
          context.scopes.vSlot++;
          return () => {
            context.scopes.vSlot--;
          };
        }
      }
    };
    trackVForSlotScopes = (node, context) => {
      let vFor;
      if (isTemplateNode(node) && node.props.some(isVSlot) && (vFor = findDir(node, "for"))) {
        const result = vFor.forParseResult;
        if (result) {
          finalizeForParseResult(result, context);
          const { value, key, index } = result;
          const { addIdentifiers, removeIdentifiers } = context;
          value && addIdentifiers(value);
          key && addIdentifiers(key);
          index && addIdentifiers(index);
          return () => {
            value && removeIdentifiers(value);
            key && removeIdentifiers(key);
            index && removeIdentifiers(index);
          };
        }
      }
    };
    buildClientSlotFn = (props, _vForExp, children, loc) => createFunctionExpression(
      props,
      children,
      false,
      true,
      children.length ? children[0].loc : loc
    );
    directiveImportMap = /* @__PURE__ */ new WeakMap();
    transformElement = (node, context) => {
      return function postTransformElement() {
        node = context.currentNode;
        if (!(node.type === 1 && (node.tagType === 0 || node.tagType === 1))) {
          return;
        }
        const { tag, props } = node;
        const isComponent2 = node.tagType === 1;
        let vnodeTag = isComponent2 ? resolveComponentType(node, context) : `"${tag}"`;
        const isDynamicComponent = isObject(vnodeTag) && vnodeTag.callee === RESOLVE_DYNAMIC_COMPONENT;
        let vnodeProps;
        let vnodeChildren;
        let patchFlag = 0;
        let vnodeDynamicProps;
        let dynamicPropNames;
        let vnodeDirectives;
        let shouldUseBlock = (
          // dynamic component may resolve to plain elements
          isDynamicComponent || vnodeTag === TELEPORT || vnodeTag === SUSPENSE || !isComponent2 && // <svg> and <foreignObject> must be forced into blocks so that block
          // updates inside get proper isSVG flag at runtime. (#639, #643)
          // This is technically web-specific, but splitting the logic out of core
          // leads to too much unnecessary complexity.
          (tag === "svg" || tag === "foreignObject" || tag === "math")
        );
        if (props.length > 0) {
          const propsBuildResult = buildProps(
            node,
            context,
            void 0,
            isComponent2,
            isDynamicComponent
          );
          vnodeProps = propsBuildResult.props;
          patchFlag = propsBuildResult.patchFlag;
          dynamicPropNames = propsBuildResult.dynamicPropNames;
          const directives = propsBuildResult.directives;
          vnodeDirectives = directives && directives.length ? createArrayExpression(
            directives.map((dir) => buildDirectiveArgs(dir, context))
          ) : void 0;
          if (propsBuildResult.shouldUseBlock) {
            shouldUseBlock = true;
          }
        }
        if (node.children.length > 0) {
          if (vnodeTag === KEEP_ALIVE) {
            shouldUseBlock = true;
            patchFlag |= 1024;
            if (node.children.length > 1) {
              context.onError(
                createCompilerError(46, {
                  start: node.children[0].loc.start,
                  end: node.children[node.children.length - 1].loc.end,
                  source: ""
                })
              );
            }
          }
          const shouldBuildAsSlots = isComponent2 && // Teleport is not a real component and has dedicated runtime handling
          vnodeTag !== TELEPORT && // explained above.
          vnodeTag !== KEEP_ALIVE;
          if (shouldBuildAsSlots) {
            const { slots, hasDynamicSlots } = buildSlots(node, context);
            vnodeChildren = slots;
            if (hasDynamicSlots) {
              patchFlag |= 1024;
            }
          } else if (node.children.length === 1 && vnodeTag !== TELEPORT) {
            const child = node.children[0];
            const type = child.type;
            const hasDynamicTextChild = type === 5 || type === 8;
            if (hasDynamicTextChild && getConstantType(child, context) === 0) {
              patchFlag |= 1;
            }
            if (hasDynamicTextChild || type === 2) {
              vnodeChildren = child;
            } else {
              vnodeChildren = node.children;
            }
          } else {
            vnodeChildren = node.children;
          }
        }
        if (dynamicPropNames && dynamicPropNames.length) {
          vnodeDynamicProps = stringifyDynamicPropNames(dynamicPropNames);
        }
        node.codegenNode = createVNodeCall(
          context,
          vnodeTag,
          vnodeProps,
          vnodeChildren,
          patchFlag === 0 ? void 0 : patchFlag,
          vnodeDynamicProps,
          vnodeDirectives,
          !!shouldUseBlock,
          false,
          isComponent2,
          node.loc
        );
      };
    };
    transformSlotOutlet = (node, context) => {
      if (isSlotOutlet(node)) {
        const { children, loc } = node;
        const { slotName, slotProps } = processSlotOutlet(node, context);
        const slotArgs = [
          context.prefixIdentifiers ? `_ctx.$slots` : `$slots`,
          slotName,
          "{}",
          "undefined",
          "true"
        ];
        let expectedLen = 2;
        if (slotProps) {
          slotArgs[2] = slotProps;
          expectedLen = 3;
        }
        if (children.length) {
          slotArgs[3] = createFunctionExpression([], children, false, false, loc);
          expectedLen = 4;
        }
        if (context.scopeId && !context.slotted) {
          expectedLen = 5;
        }
        slotArgs.splice(expectedLen);
        node.codegenNode = createCallExpression(
          context.helper(RENDER_SLOT),
          slotArgs,
          loc
        );
      }
    };
    transformOn = (dir, node, context, augmentor) => {
      const { loc, modifiers, arg } = dir;
      if (!dir.exp && !modifiers.length) {
        context.onError(createCompilerError(35, loc));
      }
      let eventName;
      if (arg.type === 4) {
        if (arg.isStatic) {
          let rawName = arg.content;
          if (rawName.startsWith("vnode")) {
            context.onError(createCompilerError(51, arg.loc));
          }
          if (rawName.startsWith("vue:")) {
            rawName = `vnode-${rawName.slice(4)}`;
          }
          const eventString = node.tagType !== 0 || rawName.startsWith("vnode") || !/[A-Z]/.test(rawName) ? (
            // for non-element and vnode lifecycle event listeners, auto convert
            // it to camelCase. See issue #2249
            toHandlerKey(camelize(rawName))
          ) : (
            // preserve case for plain element listeners that have uppercase
            // letters, as these may be custom elements' custom events
            `on:${rawName}`
          );
          eventName = createSimpleExpression(eventString, true, arg.loc);
        } else {
          eventName = createCompoundExpression([
            `${context.helperString(TO_HANDLER_KEY)}(`,
            arg,
            `)`
          ]);
        }
      } else {
        eventName = arg;
        eventName.children.unshift(`${context.helperString(TO_HANDLER_KEY)}(`);
        eventName.children.push(`)`);
      }
      let exp = dir.exp;
      if (exp && !exp.content.trim()) {
        exp = void 0;
      }
      let shouldCache = context.cacheHandlers && !exp && !context.inVOnce;
      if (exp) {
        const isMemberExp = isMemberExpression(exp);
        const isInlineStatement = !(isMemberExp || isFnExpression(exp));
        const hasMultipleStatements = exp.content.includes(`;`);
        if (true) {
          validateBrowserExpression(
            exp,
            context,
            false,
            hasMultipleStatements
          );
        }
        if (isInlineStatement || shouldCache && isMemberExp) {
          exp = createCompoundExpression([
            `${isInlineStatement ? `$event` : `${``}(...args)`} => ${hasMultipleStatements ? `{` : `(`}`,
            exp,
            hasMultipleStatements ? `}` : `)`
          ]);
        }
      }
      let ret = {
        props: [
          createObjectProperty(
            eventName,
            exp || createSimpleExpression(`() => {}`, false, loc)
          )
        ]
      };
      if (augmentor) {
        ret = augmentor(ret);
      }
      if (shouldCache) {
        ret.props[0].value = context.cache(ret.props[0].value);
      }
      ret.props.forEach((p) => p.key.isHandlerKey = true);
      return ret;
    };
    transformText = (node, context) => {
      if (node.type === 0 || node.type === 1 || node.type === 11 || node.type === 10) {
        return () => {
          const children = node.children;
          let currentContainer = void 0;
          let hasText = false;
          for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (isText$1(child)) {
              hasText = true;
              for (let j = i + 1; j < children.length; j++) {
                const next = children[j];
                if (isText$1(next)) {
                  if (!currentContainer) {
                    currentContainer = children[i] = createCompoundExpression(
                      [child],
                      child.loc
                    );
                  }
                  currentContainer.children.push(` + `, next);
                  children.splice(j, 1);
                  j--;
                } else {
                  currentContainer = void 0;
                  break;
                }
              }
            }
          }
          if (!hasText || // if this is a plain element with a single text child, leave it
          // as-is since the runtime has dedicated fast path for this by directly
          // setting textContent of the element.
          // for component root it's always normalized anyway.
          children.length === 1 && (node.type === 0 || node.type === 1 && node.tagType === 0 && // #3756
          // custom directives can potentially add DOM elements arbitrarily,
          // we need to avoid setting textContent of the element at runtime
          // to avoid accidentally overwriting the DOM elements added
          // by the user through custom directives.
          !node.props.find(
            (p) => p.type === 7 && !context.directiveTransforms[p.name]
          ) && // in compat mode, <template> tags with no special directives
          // will be rendered as a fragment so its children must be
          // converted into vnodes.
          !(node.tag === "template"))) {
            return;
          }
          for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (isText$1(child) || child.type === 8) {
              const callArgs = [];
              if (child.type !== 2 || child.content !== " ") {
                callArgs.push(child);
              }
              if (!context.ssr && getConstantType(child, context) === 0) {
                callArgs.push(
                  1 + (true ? ` /* ${PatchFlagNames[1]} */` : ``)
                );
              }
              children[i] = {
                type: 12,
                content: child,
                loc: child.loc,
                codegenNode: createCallExpression(
                  context.helper(CREATE_TEXT),
                  callArgs
                )
              };
            }
          }
        };
      }
    };
    seen$1 = /* @__PURE__ */ new WeakSet();
    transformOnce = (node, context) => {
      if (node.type === 1 && findDir(node, "once", true)) {
        if (seen$1.has(node) || context.inVOnce || context.inSSR) {
          return;
        }
        seen$1.add(node);
        context.inVOnce = true;
        context.helper(SET_BLOCK_TRACKING);
        return () => {
          context.inVOnce = false;
          const cur = context.currentNode;
          if (cur.codegenNode) {
            cur.codegenNode = context.cache(
              cur.codegenNode,
              true,
              true
            );
          }
        };
      }
    };
    transformModel = (dir, node, context) => {
      const { exp, arg } = dir;
      if (!exp) {
        context.onError(
          createCompilerError(41, dir.loc)
        );
        return createTransformProps();
      }
      const rawExp = exp.loc.source.trim();
      const expString = exp.type === 4 ? exp.content : rawExp;
      const bindingType = context.bindingMetadata[rawExp];
      if (bindingType === "props" || bindingType === "props-aliased") {
        context.onError(createCompilerError(44, exp.loc));
        return createTransformProps();
      }
      const maybeRef = false;
      if (!expString.trim() || !isMemberExpression(exp) && !maybeRef) {
        context.onError(
          createCompilerError(42, exp.loc)
        );
        return createTransformProps();
      }
      const propName = arg ? arg : createSimpleExpression("modelValue", true);
      const eventName = arg ? isStaticExp(arg) ? `onUpdate:${camelize(arg.content)}` : createCompoundExpression(['"onUpdate:" + ', arg]) : `onUpdate:modelValue`;
      let assignmentExp;
      const eventArg = context.isTS ? `($event: any)` : `$event`;
      {
        assignmentExp = createCompoundExpression([
          `${eventArg} => ((`,
          exp,
          `) = $event)`
        ]);
      }
      const props = [
        // modelValue: foo
        createObjectProperty(propName, dir.exp),
        // "onUpdate:modelValue": $event => (foo = $event)
        createObjectProperty(eventName, assignmentExp)
      ];
      if (dir.modifiers.length && node.tagType === 1) {
        const modifiers = dir.modifiers.map((m) => m.content).map((m) => (isSimpleIdentifier(m) ? m : JSON.stringify(m)) + `: true`).join(`, `);
        const modifiersKey = arg ? isStaticExp(arg) ? `${arg.content}Modifiers` : createCompoundExpression([arg, ' + "Modifiers"']) : `modelModifiers`;
        props.push(
          createObjectProperty(
            modifiersKey,
            createSimpleExpression(
              `{ ${modifiers} }`,
              false,
              dir.loc,
              2
            )
          )
        );
      }
      return createTransformProps(props);
    };
    validDivisionCharRE = /[\w).+\-_$\]]/;
    transformFilter = (node, context) => {
      if (!isCompatEnabled("COMPILER_FILTERS", context)) {
        return;
      }
      if (node.type === 5) {
        rewriteFilter(node.content, context);
      } else if (node.type === 1) {
        node.props.forEach((prop) => {
          if (prop.type === 7 && prop.name !== "for" && prop.exp) {
            rewriteFilter(prop.exp, context);
          }
        });
      }
    };
    seen = /* @__PURE__ */ new WeakSet();
    transformMemo = (node, context) => {
      if (node.type === 1) {
        const dir = findDir(node, "memo");
        if (!dir || seen.has(node)) {
          return;
        }
        seen.add(node);
        return () => {
          const codegenNode = node.codegenNode || context.currentNode.codegenNode;
          if (codegenNode && codegenNode.type === 13) {
            if (node.tagType !== 1) {
              convertToBlock(codegenNode, context);
            }
            node.codegenNode = createCallExpression(context.helper(WITH_MEMO), [
              dir.exp,
              createFunctionExpression(void 0, codegenNode),
              `_cache`,
              String(context.cached.length)
            ]);
            context.cached.push(null);
          }
        };
      }
    };
    BindingTypes = {
      "DATA": "data",
      "PROPS": "props",
      "PROPS_ALIASED": "props-aliased",
      "SETUP_LET": "setup-let",
      "SETUP_CONST": "setup-const",
      "SETUP_REACTIVE_CONST": "setup-reactive-const",
      "SETUP_MAYBE_REF": "setup-maybe-ref",
      "SETUP_REF": "setup-ref",
      "OPTIONS": "options",
      "LITERAL_CONST": "literal-const"
    };
    noopDirectiveTransform = () => ({ props: [] });
  }
});

// node_modules/@vue/compiler-dom/dist/compiler-dom.esm-bundler.js
var compiler_dom_esm_bundler_exports = {};
__export(compiler_dom_esm_bundler_exports, {
  BASE_TRANSITION: () => BASE_TRANSITION,
  BindingTypes: () => BindingTypes,
  CAMELIZE: () => CAMELIZE,
  CAPITALIZE: () => CAPITALIZE,
  CREATE_BLOCK: () => CREATE_BLOCK,
  CREATE_COMMENT: () => CREATE_COMMENT,
  CREATE_ELEMENT_BLOCK: () => CREATE_ELEMENT_BLOCK,
  CREATE_ELEMENT_VNODE: () => CREATE_ELEMENT_VNODE,
  CREATE_SLOTS: () => CREATE_SLOTS,
  CREATE_STATIC: () => CREATE_STATIC,
  CREATE_TEXT: () => CREATE_TEXT,
  CREATE_VNODE: () => CREATE_VNODE,
  CompilerDeprecationTypes: () => CompilerDeprecationTypes,
  ConstantTypes: () => ConstantTypes,
  DOMDirectiveTransforms: () => DOMDirectiveTransforms,
  DOMErrorCodes: () => DOMErrorCodes,
  DOMErrorMessages: () => DOMErrorMessages,
  DOMNodeTransforms: () => DOMNodeTransforms,
  ElementTypes: () => ElementTypes,
  ErrorCodes: () => ErrorCodes,
  FRAGMENT: () => FRAGMENT,
  GUARD_REACTIVE_PROPS: () => GUARD_REACTIVE_PROPS,
  IS_MEMO_SAME: () => IS_MEMO_SAME,
  IS_REF: () => IS_REF,
  KEEP_ALIVE: () => KEEP_ALIVE,
  MERGE_PROPS: () => MERGE_PROPS,
  NORMALIZE_CLASS: () => NORMALIZE_CLASS,
  NORMALIZE_PROPS: () => NORMALIZE_PROPS,
  NORMALIZE_STYLE: () => NORMALIZE_STYLE,
  Namespaces: () => Namespaces,
  NodeTypes: () => NodeTypes,
  OPEN_BLOCK: () => OPEN_BLOCK,
  POP_SCOPE_ID: () => POP_SCOPE_ID,
  PUSH_SCOPE_ID: () => PUSH_SCOPE_ID,
  RENDER_LIST: () => RENDER_LIST,
  RENDER_SLOT: () => RENDER_SLOT,
  RESOLVE_COMPONENT: () => RESOLVE_COMPONENT,
  RESOLVE_DIRECTIVE: () => RESOLVE_DIRECTIVE,
  RESOLVE_DYNAMIC_COMPONENT: () => RESOLVE_DYNAMIC_COMPONENT,
  RESOLVE_FILTER: () => RESOLVE_FILTER,
  SET_BLOCK_TRACKING: () => SET_BLOCK_TRACKING,
  SUSPENSE: () => SUSPENSE,
  TELEPORT: () => TELEPORT,
  TO_DISPLAY_STRING: () => TO_DISPLAY_STRING,
  TO_HANDLERS: () => TO_HANDLERS,
  TO_HANDLER_KEY: () => TO_HANDLER_KEY,
  TRANSITION: () => TRANSITION,
  TRANSITION_GROUP: () => TRANSITION_GROUP,
  TS_NODE_TYPES: () => TS_NODE_TYPES,
  UNREF: () => UNREF,
  V_MODEL_CHECKBOX: () => V_MODEL_CHECKBOX,
  V_MODEL_DYNAMIC: () => V_MODEL_DYNAMIC,
  V_MODEL_RADIO: () => V_MODEL_RADIO,
  V_MODEL_SELECT: () => V_MODEL_SELECT,
  V_MODEL_TEXT: () => V_MODEL_TEXT,
  V_ON_WITH_KEYS: () => V_ON_WITH_KEYS,
  V_ON_WITH_MODIFIERS: () => V_ON_WITH_MODIFIERS,
  V_SHOW: () => V_SHOW,
  WITH_CTX: () => WITH_CTX,
  WITH_DIRECTIVES: () => WITH_DIRECTIVES,
  WITH_MEMO: () => WITH_MEMO,
  advancePositionWithClone: () => advancePositionWithClone,
  advancePositionWithMutation: () => advancePositionWithMutation,
  assert: () => assert,
  baseCompile: () => baseCompile,
  baseParse: () => baseParse,
  buildDirectiveArgs: () => buildDirectiveArgs,
  buildProps: () => buildProps,
  buildSlots: () => buildSlots,
  checkCompatEnabled: () => checkCompatEnabled,
  compile: () => compile,
  convertToBlock: () => convertToBlock,
  createArrayExpression: () => createArrayExpression,
  createAssignmentExpression: () => createAssignmentExpression,
  createBlockStatement: () => createBlockStatement,
  createCacheExpression: () => createCacheExpression,
  createCallExpression: () => createCallExpression,
  createCompilerError: () => createCompilerError,
  createCompoundExpression: () => createCompoundExpression,
  createConditionalExpression: () => createConditionalExpression,
  createDOMCompilerError: () => createDOMCompilerError,
  createForLoopParams: () => createForLoopParams,
  createFunctionExpression: () => createFunctionExpression,
  createIfStatement: () => createIfStatement,
  createInterpolation: () => createInterpolation,
  createObjectExpression: () => createObjectExpression,
  createObjectProperty: () => createObjectProperty,
  createReturnStatement: () => createReturnStatement,
  createRoot: () => createRoot,
  createSequenceExpression: () => createSequenceExpression,
  createSimpleExpression: () => createSimpleExpression,
  createStructuralDirectiveTransform: () => createStructuralDirectiveTransform,
  createTemplateLiteral: () => createTemplateLiteral,
  createTransformContext: () => createTransformContext,
  createVNodeCall: () => createVNodeCall,
  errorMessages: () => errorMessages,
  extractIdentifiers: () => extractIdentifiers,
  findDir: () => findDir,
  findProp: () => findProp,
  forAliasRE: () => forAliasRE,
  generate: () => generate,
  generateCodeFrame: () => generateCodeFrame,
  getBaseTransformPreset: () => getBaseTransformPreset,
  getConstantType: () => getConstantType,
  getMemoedVNodeCall: () => getMemoedVNodeCall,
  getVNodeBlockHelper: () => getVNodeBlockHelper,
  getVNodeHelper: () => getVNodeHelper,
  hasDynamicKeyVBind: () => hasDynamicKeyVBind,
  hasScopeRef: () => hasScopeRef,
  helperNameMap: () => helperNameMap,
  injectProp: () => injectProp,
  isCoreComponent: () => isCoreComponent,
  isFnExpression: () => isFnExpression,
  isFnExpressionBrowser: () => isFnExpressionBrowser,
  isFnExpressionNode: () => isFnExpressionNode,
  isFunctionType: () => isFunctionType,
  isInDestructureAssignment: () => isInDestructureAssignment,
  isInNewExpression: () => isInNewExpression,
  isMemberExpression: () => isMemberExpression,
  isMemberExpressionBrowser: () => isMemberExpressionBrowser,
  isMemberExpressionNode: () => isMemberExpressionNode,
  isReferencedIdentifier: () => isReferencedIdentifier,
  isSimpleIdentifier: () => isSimpleIdentifier,
  isSlotOutlet: () => isSlotOutlet,
  isStaticArgOf: () => isStaticArgOf,
  isStaticExp: () => isStaticExp,
  isStaticProperty: () => isStaticProperty,
  isStaticPropertyKey: () => isStaticPropertyKey,
  isTemplateNode: () => isTemplateNode,
  isText: () => isText$1,
  isVSlot: () => isVSlot,
  locStub: () => locStub,
  noopDirectiveTransform: () => noopDirectiveTransform,
  parse: () => parse,
  parserOptions: () => parserOptions,
  processExpression: () => processExpression,
  processFor: () => processFor,
  processIf: () => processIf,
  processSlotOutlet: () => processSlotOutlet,
  registerRuntimeHelpers: () => registerRuntimeHelpers,
  resolveComponentType: () => resolveComponentType,
  stringifyExpression: () => stringifyExpression,
  toValidAssetId: () => toValidAssetId,
  trackSlotScopes: () => trackSlotScopes,
  trackVForSlotScopes: () => trackVForSlotScopes,
  transform: () => transform,
  transformBind: () => transformBind,
  transformElement: () => transformElement,
  transformExpression: () => transformExpression,
  transformModel: () => transformModel,
  transformOn: () => transformOn,
  transformStyle: () => transformStyle,
  traverseNode: () => traverseNode,
  unwrapTSNode: () => unwrapTSNode,
  walkBlockDeclarations: () => walkBlockDeclarations,
  walkFunctionParams: () => walkFunctionParams,
  walkIdentifiers: () => walkIdentifiers,
  warnDeprecation: () => warnDeprecation
});
function decodeHtmlBrowser(raw, asAttr = false) {
  if (!decoder) {
    decoder = document.createElement("div");
  }
  if (asAttr) {
    decoder.innerHTML = `<div foo="${raw.replace(/"/g, "&quot;")}">`;
    return decoder.children[0].getAttribute("foo");
  } else {
    decoder.innerHTML = raw;
    return decoder.textContent;
  }
}
function createDOMCompilerError(code, loc) {
  return createCompilerError(
    code,
    loc,
    true ? DOMErrorMessages : void 0
  );
}
function hasMultipleChildren(node) {
  const children = node.children = node.children.filter(
    (c) => c.type !== 3 && !(c.type === 2 && !c.content.trim())
  );
  const child = children[0];
  return children.length !== 1 || child.type === 11 || child.type === 9 && child.branches.some(hasMultipleChildren);
}
function isValidHTMLNesting(parent, child) {
  if (parent in onlyValidChildren) {
    return onlyValidChildren[parent].has(child);
  }
  if (child in onlyValidParents) {
    return onlyValidParents[child].has(parent);
  }
  if (parent in knownInvalidChildren) {
    if (knownInvalidChildren[parent].has(child)) return false;
  }
  if (child in knownInvalidParents) {
    if (knownInvalidParents[child].has(parent)) return false;
  }
  return true;
}
function compile(src, options = {}) {
  return baseCompile(
    src,
    extend({}, parserOptions, options, {
      nodeTransforms: [
        // ignore <script> and <tag>
        // this is not put inside DOMNodeTransforms because that list is used
        // by compiler-ssr to generate vnode fallback branches
        ignoreSideEffectTags,
        ...DOMNodeTransforms,
        ...options.nodeTransforms || []
      ],
      directiveTransforms: extend(
        {},
        DOMDirectiveTransforms,
        options.directiveTransforms || {}
      ),
      transformHoist: null
    })
  );
}
function parse(template, options = {}) {
  return baseParse(template, extend({}, parserOptions, options));
}
var V_MODEL_RADIO, V_MODEL_CHECKBOX, V_MODEL_TEXT, V_MODEL_SELECT, V_MODEL_DYNAMIC, V_ON_WITH_MODIFIERS, V_ON_WITH_KEYS, V_SHOW, TRANSITION, TRANSITION_GROUP, decoder, parserOptions, transformStyle, parseInlineCSS, DOMErrorCodes, DOMErrorMessages, transformVHtml, transformVText, transformModel2, isEventOptionModifier, isNonKeyModifier, maybeKeyModifier, isKeyboardEvent, resolveModifiers, transformClick, transformOn2, transformShow, transformTransition, ignoreSideEffectTags, headings, emptySet, onlyValidChildren, onlyValidParents, knownInvalidChildren, knownInvalidParents, validateHtmlNesting, DOMNodeTransforms, DOMDirectiveTransforms;
var init_compiler_dom_esm_bundler = __esm({
  "node_modules/@vue/compiler-dom/dist/compiler-dom.esm-bundler.js"() {
    init_compiler_core_esm_bundler();
    init_compiler_core_esm_bundler();
    init_shared_esm_bundler();
    V_MODEL_RADIO = Symbol(true ? `vModelRadio` : ``);
    V_MODEL_CHECKBOX = Symbol(
      true ? `vModelCheckbox` : ``
    );
    V_MODEL_TEXT = Symbol(true ? `vModelText` : ``);
    V_MODEL_SELECT = Symbol(
      true ? `vModelSelect` : ``
    );
    V_MODEL_DYNAMIC = Symbol(
      true ? `vModelDynamic` : ``
    );
    V_ON_WITH_MODIFIERS = Symbol(
      true ? `vOnModifiersGuard` : ``
    );
    V_ON_WITH_KEYS = Symbol(
      true ? `vOnKeysGuard` : ``
    );
    V_SHOW = Symbol(true ? `vShow` : ``);
    TRANSITION = Symbol(true ? `Transition` : ``);
    TRANSITION_GROUP = Symbol(
      true ? `TransitionGroup` : ``
    );
    registerRuntimeHelpers({
      [V_MODEL_RADIO]: `vModelRadio`,
      [V_MODEL_CHECKBOX]: `vModelCheckbox`,
      [V_MODEL_TEXT]: `vModelText`,
      [V_MODEL_SELECT]: `vModelSelect`,
      [V_MODEL_DYNAMIC]: `vModelDynamic`,
      [V_ON_WITH_MODIFIERS]: `withModifiers`,
      [V_ON_WITH_KEYS]: `withKeys`,
      [V_SHOW]: `vShow`,
      [TRANSITION]: `Transition`,
      [TRANSITION_GROUP]: `TransitionGroup`
    });
    parserOptions = {
      parseMode: "html",
      isVoidTag,
      isNativeTag: (tag) => isHTMLTag(tag) || isSVGTag(tag) || isMathMLTag(tag),
      isPreTag: (tag) => tag === "pre",
      isIgnoreNewlineTag: (tag) => tag === "pre" || tag === "textarea",
      decodeEntities: decodeHtmlBrowser,
      isBuiltInComponent: (tag) => {
        if (tag === "Transition" || tag === "transition") {
          return TRANSITION;
        } else if (tag === "TransitionGroup" || tag === "transition-group") {
          return TRANSITION_GROUP;
        }
      },
      // https://html.spec.whatwg.org/multipage/parsing.html#tree-construction-dispatcher
      getNamespace(tag, parent, rootNamespace) {
        let ns = parent ? parent.ns : rootNamespace;
        if (parent && ns === 2) {
          if (parent.tag === "annotation-xml") {
            if (tag === "svg") {
              return 1;
            }
            if (parent.props.some(
              (a) => a.type === 6 && a.name === "encoding" && a.value != null && (a.value.content === "text/html" || a.value.content === "application/xhtml+xml")
            )) {
              ns = 0;
            }
          } else if (/^m(?:[ions]|text)$/.test(parent.tag) && tag !== "mglyph" && tag !== "malignmark") {
            ns = 0;
          }
        } else if (parent && ns === 1) {
          if (parent.tag === "foreignObject" || parent.tag === "desc" || parent.tag === "title") {
            ns = 0;
          }
        }
        if (ns === 0) {
          if (tag === "svg") {
            return 1;
          }
          if (tag === "math") {
            return 2;
          }
        }
        return ns;
      }
    };
    transformStyle = (node) => {
      if (node.type === 1) {
        node.props.forEach((p, i) => {
          if (p.type === 6 && p.name === "style" && p.value) {
            node.props[i] = {
              type: 7,
              name: `bind`,
              arg: createSimpleExpression(`style`, true, p.loc),
              exp: parseInlineCSS(p.value.content, p.loc),
              modifiers: [],
              loc: p.loc
            };
          }
        });
      }
    };
    parseInlineCSS = (cssText, loc) => {
      const normalized = parseStringStyle(cssText);
      return createSimpleExpression(
        JSON.stringify(normalized),
        false,
        loc,
        3
      );
    };
    DOMErrorCodes = {
      "X_V_HTML_NO_EXPRESSION": 53,
      "53": "X_V_HTML_NO_EXPRESSION",
      "X_V_HTML_WITH_CHILDREN": 54,
      "54": "X_V_HTML_WITH_CHILDREN",
      "X_V_TEXT_NO_EXPRESSION": 55,
      "55": "X_V_TEXT_NO_EXPRESSION",
      "X_V_TEXT_WITH_CHILDREN": 56,
      "56": "X_V_TEXT_WITH_CHILDREN",
      "X_V_MODEL_ON_INVALID_ELEMENT": 57,
      "57": "X_V_MODEL_ON_INVALID_ELEMENT",
      "X_V_MODEL_ARG_ON_ELEMENT": 58,
      "58": "X_V_MODEL_ARG_ON_ELEMENT",
      "X_V_MODEL_ON_FILE_INPUT_ELEMENT": 59,
      "59": "X_V_MODEL_ON_FILE_INPUT_ELEMENT",
      "X_V_MODEL_UNNECESSARY_VALUE": 60,
      "60": "X_V_MODEL_UNNECESSARY_VALUE",
      "X_V_SHOW_NO_EXPRESSION": 61,
      "61": "X_V_SHOW_NO_EXPRESSION",
      "X_TRANSITION_INVALID_CHILDREN": 62,
      "62": "X_TRANSITION_INVALID_CHILDREN",
      "X_IGNORED_SIDE_EFFECT_TAG": 63,
      "63": "X_IGNORED_SIDE_EFFECT_TAG",
      "__EXTEND_POINT__": 64,
      "64": "__EXTEND_POINT__"
    };
    DOMErrorMessages = {
      [53]: `v-html is missing expression.`,
      [54]: `v-html will override element children.`,
      [55]: `v-text is missing expression.`,
      [56]: `v-text will override element children.`,
      [57]: `v-model can only be used on <input>, <textarea> and <select> elements.`,
      [58]: `v-model argument is not supported on plain elements.`,
      [59]: `v-model cannot be used on file inputs since they are read-only. Use a v-on:change listener instead.`,
      [60]: `Unnecessary value binding used alongside v-model. It will interfere with v-model's behavior.`,
      [61]: `v-show is missing expression.`,
      [62]: `<Transition> expects exactly one child element or component.`,
      [63]: `Tags with side effect (<script> and <style>) are ignored in client component templates.`
    };
    transformVHtml = (dir, node, context) => {
      const { exp, loc } = dir;
      if (!exp) {
        context.onError(
          createDOMCompilerError(53, loc)
        );
      }
      if (node.children.length) {
        context.onError(
          createDOMCompilerError(54, loc)
        );
        node.children.length = 0;
      }
      return {
        props: [
          createObjectProperty(
            createSimpleExpression(`innerHTML`, true, loc),
            exp || createSimpleExpression("", true)
          )
        ]
      };
    };
    transformVText = (dir, node, context) => {
      const { exp, loc } = dir;
      if (!exp) {
        context.onError(
          createDOMCompilerError(55, loc)
        );
      }
      if (node.children.length) {
        context.onError(
          createDOMCompilerError(56, loc)
        );
        node.children.length = 0;
      }
      return {
        props: [
          createObjectProperty(
            createSimpleExpression(`textContent`, true),
            exp ? getConstantType(exp, context) > 0 ? exp : createCallExpression(
              context.helperString(TO_DISPLAY_STRING),
              [exp],
              loc
            ) : createSimpleExpression("", true)
          )
        ]
      };
    };
    transformModel2 = (dir, node, context) => {
      const baseResult = transformModel(dir, node, context);
      if (!baseResult.props.length || node.tagType === 1) {
        return baseResult;
      }
      if (dir.arg) {
        context.onError(
          createDOMCompilerError(
            58,
            dir.arg.loc
          )
        );
      }
      function checkDuplicatedValue() {
        const value = findDir(node, "bind");
        if (value && isStaticArgOf(value.arg, "value")) {
          context.onError(
            createDOMCompilerError(
              60,
              value.loc
            )
          );
        }
      }
      const { tag } = node;
      const isCustomElement = context.isCustomElement(tag);
      if (tag === "input" || tag === "textarea" || tag === "select" || isCustomElement) {
        let directiveToUse = V_MODEL_TEXT;
        let isInvalidType = false;
        if (tag === "input" || isCustomElement) {
          const type = findProp(node, `type`);
          if (type) {
            if (type.type === 7) {
              directiveToUse = V_MODEL_DYNAMIC;
            } else if (type.value) {
              switch (type.value.content) {
                case "radio":
                  directiveToUse = V_MODEL_RADIO;
                  break;
                case "checkbox":
                  directiveToUse = V_MODEL_CHECKBOX;
                  break;
                case "file":
                  isInvalidType = true;
                  context.onError(
                    createDOMCompilerError(
                      59,
                      dir.loc
                    )
                  );
                  break;
                default:
                  checkDuplicatedValue();
                  break;
              }
            }
          } else if (hasDynamicKeyVBind(node)) {
            directiveToUse = V_MODEL_DYNAMIC;
          } else {
            checkDuplicatedValue();
          }
        } else if (tag === "select") {
          directiveToUse = V_MODEL_SELECT;
        } else {
          checkDuplicatedValue();
        }
        if (!isInvalidType) {
          baseResult.needRuntime = context.helper(directiveToUse);
        }
      } else {
        context.onError(
          createDOMCompilerError(
            57,
            dir.loc
          )
        );
      }
      baseResult.props = baseResult.props.filter(
        (p) => !(p.key.type === 4 && p.key.content === "modelValue")
      );
      return baseResult;
    };
    isEventOptionModifier = makeMap(`passive,once,capture`);
    isNonKeyModifier = makeMap(
      // event propagation management
      `stop,prevent,self,ctrl,shift,alt,meta,exact,middle`
    );
    maybeKeyModifier = makeMap("left,right");
    isKeyboardEvent = makeMap(`onkeyup,onkeydown,onkeypress`);
    resolveModifiers = (key, modifiers, context, loc) => {
      const keyModifiers = [];
      const nonKeyModifiers = [];
      const eventOptionModifiers = [];
      for (let i = 0; i < modifiers.length; i++) {
        const modifier = modifiers[i].content;
        if (modifier === "native" && checkCompatEnabled(
          "COMPILER_V_ON_NATIVE",
          context,
          loc
        )) {
          eventOptionModifiers.push(modifier);
        } else if (isEventOptionModifier(modifier)) {
          eventOptionModifiers.push(modifier);
        } else {
          if (maybeKeyModifier(modifier)) {
            if (isStaticExp(key)) {
              if (isKeyboardEvent(key.content.toLowerCase())) {
                keyModifiers.push(modifier);
              } else {
                nonKeyModifiers.push(modifier);
              }
            } else {
              keyModifiers.push(modifier);
              nonKeyModifiers.push(modifier);
            }
          } else {
            if (isNonKeyModifier(modifier)) {
              nonKeyModifiers.push(modifier);
            } else {
              keyModifiers.push(modifier);
            }
          }
        }
      }
      return {
        keyModifiers,
        nonKeyModifiers,
        eventOptionModifiers
      };
    };
    transformClick = (key, event) => {
      const isStaticClick = isStaticExp(key) && key.content.toLowerCase() === "onclick";
      return isStaticClick ? createSimpleExpression(event, true) : key.type !== 4 ? createCompoundExpression([
        `(`,
        key,
        `) === "onClick" ? "${event}" : (`,
        key,
        `)`
      ]) : key;
    };
    transformOn2 = (dir, node, context) => {
      return transformOn(dir, node, context, (baseResult) => {
        const { modifiers } = dir;
        if (!modifiers.length) return baseResult;
        let { key, value: handlerExp } = baseResult.props[0];
        const { keyModifiers, nonKeyModifiers, eventOptionModifiers } = resolveModifiers(key, modifiers, context, dir.loc);
        if (nonKeyModifiers.includes("right")) {
          key = transformClick(key, `onContextmenu`);
        }
        if (nonKeyModifiers.includes("middle")) {
          key = transformClick(key, `onMouseup`);
        }
        if (nonKeyModifiers.length) {
          handlerExp = createCallExpression(context.helper(V_ON_WITH_MODIFIERS), [
            handlerExp,
            JSON.stringify(nonKeyModifiers)
          ]);
        }
        if (keyModifiers.length && // if event name is dynamic, always wrap with keys guard
        (!isStaticExp(key) || isKeyboardEvent(key.content.toLowerCase()))) {
          handlerExp = createCallExpression(context.helper(V_ON_WITH_KEYS), [
            handlerExp,
            JSON.stringify(keyModifiers)
          ]);
        }
        if (eventOptionModifiers.length) {
          const modifierPostfix = eventOptionModifiers.map(capitalize).join("");
          key = isStaticExp(key) ? createSimpleExpression(`${key.content}${modifierPostfix}`, true) : createCompoundExpression([`(`, key, `) + "${modifierPostfix}"`]);
        }
        return {
          props: [createObjectProperty(key, handlerExp)]
        };
      });
    };
    transformShow = (dir, node, context) => {
      const { exp, loc } = dir;
      if (!exp) {
        context.onError(
          createDOMCompilerError(61, loc)
        );
      }
      return {
        props: [],
        needRuntime: context.helper(V_SHOW)
      };
    };
    transformTransition = (node, context) => {
      if (node.type === 1 && node.tagType === 1) {
        const component = context.isBuiltInComponent(node.tag);
        if (component === TRANSITION) {
          return () => {
            if (!node.children.length) {
              return;
            }
            if (hasMultipleChildren(node)) {
              context.onError(
                createDOMCompilerError(
                  62,
                  {
                    start: node.children[0].loc.start,
                    end: node.children[node.children.length - 1].loc.end,
                    source: ""
                  }
                )
              );
            }
            const child = node.children[0];
            if (child.type === 1) {
              for (const p of child.props) {
                if (p.type === 7 && p.name === "show") {
                  node.props.push({
                    type: 6,
                    name: "persisted",
                    nameLoc: node.loc,
                    value: void 0,
                    loc: node.loc
                  });
                }
              }
            }
          };
        }
      }
    };
    ignoreSideEffectTags = (node, context) => {
      if (node.type === 1 && node.tagType === 0 && (node.tag === "script" || node.tag === "style")) {
        context.onError(
          createDOMCompilerError(
            63,
            node.loc
          )
        );
        context.removeNode();
      }
    };
    headings = /* @__PURE__ */ new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);
    emptySet = /* @__PURE__ */ new Set([]);
    onlyValidChildren = {
      head: /* @__PURE__ */ new Set([
        "base",
        "basefront",
        "bgsound",
        "link",
        "meta",
        "title",
        "noscript",
        "noframes",
        "style",
        "script",
        "template"
      ]),
      optgroup: /* @__PURE__ */ new Set(["option"]),
      select: /* @__PURE__ */ new Set(["optgroup", "option", "hr"]),
      // table
      table: /* @__PURE__ */ new Set(["caption", "colgroup", "tbody", "tfoot", "thead"]),
      tr: /* @__PURE__ */ new Set(["td", "th"]),
      colgroup: /* @__PURE__ */ new Set(["col"]),
      tbody: /* @__PURE__ */ new Set(["tr"]),
      thead: /* @__PURE__ */ new Set(["tr"]),
      tfoot: /* @__PURE__ */ new Set(["tr"]),
      // these elements can not have any children elements
      script: emptySet,
      iframe: emptySet,
      option: emptySet,
      textarea: emptySet,
      style: emptySet,
      title: emptySet
    };
    onlyValidParents = {
      // sections
      html: emptySet,
      body: /* @__PURE__ */ new Set(["html"]),
      head: /* @__PURE__ */ new Set(["html"]),
      // table
      td: /* @__PURE__ */ new Set(["tr"]),
      colgroup: /* @__PURE__ */ new Set(["table"]),
      caption: /* @__PURE__ */ new Set(["table"]),
      tbody: /* @__PURE__ */ new Set(["table"]),
      tfoot: /* @__PURE__ */ new Set(["table"]),
      col: /* @__PURE__ */ new Set(["colgroup"]),
      th: /* @__PURE__ */ new Set(["tr"]),
      thead: /* @__PURE__ */ new Set(["table"]),
      tr: /* @__PURE__ */ new Set(["tbody", "thead", "tfoot"]),
      // data list
      dd: /* @__PURE__ */ new Set(["dl", "div"]),
      dt: /* @__PURE__ */ new Set(["dl", "div"]),
      // other
      figcaption: /* @__PURE__ */ new Set(["figure"]),
      // li: new Set(["ul", "ol"]),
      summary: /* @__PURE__ */ new Set(["details"]),
      area: /* @__PURE__ */ new Set(["map"])
    };
    knownInvalidChildren = {
      p: /* @__PURE__ */ new Set([
        "address",
        "article",
        "aside",
        "blockquote",
        "center",
        "details",
        "dialog",
        "dir",
        "div",
        "dl",
        "fieldset",
        "figure",
        "footer",
        "form",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "header",
        "hgroup",
        "hr",
        "li",
        "main",
        "nav",
        "menu",
        "ol",
        "p",
        "pre",
        "section",
        "table",
        "ul"
      ]),
      svg: /* @__PURE__ */ new Set([
        "b",
        "blockquote",
        "br",
        "code",
        "dd",
        "div",
        "dl",
        "dt",
        "em",
        "embed",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "hr",
        "i",
        "img",
        "li",
        "menu",
        "meta",
        "ol",
        "p",
        "pre",
        "ruby",
        "s",
        "small",
        "span",
        "strong",
        "sub",
        "sup",
        "table",
        "u",
        "ul",
        "var"
      ])
    };
    knownInvalidParents = {
      a: /* @__PURE__ */ new Set(["a"]),
      button: /* @__PURE__ */ new Set(["button"]),
      dd: /* @__PURE__ */ new Set(["dd", "dt"]),
      dt: /* @__PURE__ */ new Set(["dd", "dt"]),
      form: /* @__PURE__ */ new Set(["form"]),
      li: /* @__PURE__ */ new Set(["li"]),
      h1: headings,
      h2: headings,
      h3: headings,
      h4: headings,
      h5: headings,
      h6: headings
    };
    validateHtmlNesting = (node, context) => {
      if (node.type === 1 && node.tagType === 0 && context.parent && context.parent.type === 1 && context.parent.tagType === 0 && !isValidHTMLNesting(context.parent.tag, node.tag)) {
        const error = new SyntaxError(
          `<${node.tag}> cannot be child of <${context.parent.tag}>, according to HTML specifications. This can cause hydration errors or potentially disrupt future functionality.`
        );
        error.loc = node.loc;
        context.onWarn(error);
      }
    };
    DOMNodeTransforms = [
      transformStyle,
      ...true ? [transformTransition, validateHtmlNesting] : []
    ];
    DOMDirectiveTransforms = {
      cloak: noopDirectiveTransform,
      html: transformVHtml,
      text: transformVText,
      model: transformModel2,
      // override compiler-core
      on: transformOn2,
      // override compiler-core
      show: transformShow
    };
  }
});

// node_modules/vue/dist/vue.cjs.js
var require_vue_cjs = __commonJS({
  "node_modules/vue/dist/vue.cjs.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var compilerDom = (init_compiler_dom_esm_bundler(), __toCommonJS(compiler_dom_esm_bundler_exports));
    var runtimeDom = (init_runtime_dom_esm_bundler(), __toCommonJS(runtime_dom_esm_bundler_exports));
    var shared = (init_shared_esm_bundler(), __toCommonJS(shared_esm_bundler_exports));
    function _interopNamespaceDefault(e) {
      var n = /* @__PURE__ */ Object.create(null);
      if (e) {
        for (var k in e) {
          n[k] = e[k];
        }
      }
      n.default = e;
      return Object.freeze(n);
    }
    var runtimeDom__namespace = _interopNamespaceDefault(runtimeDom);
    var compileCache = /* @__PURE__ */ Object.create(null);
    function compileToFunction(template, options) {
      if (!shared.isString(template)) {
        if (template.nodeType) {
          template = template.innerHTML;
        } else {
          runtimeDom.warn(`invalid template option: `, template);
          return shared.NOOP;
        }
      }
      const key = shared.genCacheKey(template, options);
      const cached = compileCache[key];
      if (cached) {
        return cached;
      }
      if (template[0] === "#") {
        const el = document.querySelector(template);
        if (!el) {
          runtimeDom.warn(`Template element not found or is empty: ${template}`);
        }
        template = el ? el.innerHTML : ``;
      }
      const opts = shared.extend(
        {
          hoistStatic: true,
          onError,
          onWarn: (e) => onError(e, true)
        },
        options
      );
      if (!opts.isCustomElement && typeof customElements !== "undefined") {
        opts.isCustomElement = (tag) => !!customElements.get(tag);
      }
      const { code } = compilerDom.compile(template, opts);
      function onError(err, asWarning = false) {
        const message = asWarning ? err.message : `Template compilation error: ${err.message}`;
        const codeFrame = err.loc && shared.generateCodeFrame(
          template,
          err.loc.start.offset,
          err.loc.end.offset
        );
        runtimeDom.warn(codeFrame ? `${message}
${codeFrame}` : message);
      }
      const render = new Function("Vue", code)(runtimeDom__namespace);
      render._rc = true;
      return compileCache[key] = render;
    }
    runtimeDom.registerRuntimeCompiler(compileToFunction);
    exports.compile = compileToFunction;
    Object.keys(runtimeDom).forEach(function(k) {
      if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) exports[k] = runtimeDom[k];
    });
  }
});

// node_modules/vue/index.js
var require_vue = __commonJS({
  "node_modules/vue/index.js"(exports, module) {
    "use strict";
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_vue_cjs();
    }
  }
});

// node_modules/vue3-editor/dist/vue3-editor.common.js
var require_vue3_editor_common = __commonJS({
  "node_modules/vue3-editor/dist/vue3-editor.common.js"(exports, module) {
    module.exports = /******/
    function(modules) {
      var installedModules = {};
      function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) {
          return installedModules[moduleId].exports;
        }
        var module2 = installedModules[moduleId] = {
          /******/
          i: moduleId,
          /******/
          l: false,
          /******/
          exports: {}
          /******/
        };
        modules[moduleId].call(module2.exports, module2, module2.exports, __webpack_require__);
        module2.l = true;
        return module2.exports;
      }
      __webpack_require__.m = modules;
      __webpack_require__.c = installedModules;
      __webpack_require__.d = function(exports2, name, getter) {
        if (!__webpack_require__.o(exports2, name)) {
          Object.defineProperty(exports2, name, { enumerable: true, get: getter });
        }
      };
      __webpack_require__.r = function(exports2) {
        if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
          Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
        }
        Object.defineProperty(exports2, "__esModule", { value: true });
      };
      __webpack_require__.t = function(value, mode) {
        if (mode & 1) value = __webpack_require__(value);
        if (mode & 8) return value;
        if (mode & 4 && typeof value === "object" && value && value.__esModule) return value;
        var ns = /* @__PURE__ */ Object.create(null);
        __webpack_require__.r(ns);
        Object.defineProperty(ns, "default", { enumerable: true, value });
        if (mode & 2 && typeof value != "string") for (var key in value) __webpack_require__.d(ns, key, (function(key2) {
          return value[key2];
        }).bind(null, key));
        return ns;
      };
      __webpack_require__.n = function(module2) {
        var getter = module2 && module2.__esModule ? (
          /******/
          function getDefault() {
            return module2["default"];
          }
        ) : (
          /******/
          function getModuleExports() {
            return module2;
          }
        );
        __webpack_require__.d(getter, "a", getter);
        return getter;
      };
      __webpack_require__.o = function(object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
      };
      __webpack_require__.p = "";
      return __webpack_require__(__webpack_require__.s = "fb15");
    }({
      /***/
      "00ee": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var wellKnownSymbol = __webpack_require__("b622");
          var TO_STRING_TAG = wellKnownSymbol("toStringTag");
          var test = {};
          test[TO_STRING_TAG] = "z";
          module2.exports = String(test) === "[object z]";
        }
      ),
      /***/
      "0366": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var aFunction = __webpack_require__("1c0b");
          module2.exports = function(fn, that, length) {
            aFunction(fn);
            if (that === void 0) return fn;
            switch (length) {
              case 0:
                return function() {
                  return fn.call(that);
                };
              case 1:
                return function(a) {
                  return fn.call(that, a);
                };
              case 2:
                return function(a, b) {
                  return fn.call(that, a, b);
                };
              case 3:
                return function(a, b, c) {
                  return fn.call(that, a, b, c);
                };
            }
            return function() {
              return fn.apply(that, arguments);
            };
          };
        }
      ),
      /***/
      "0538": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var aFunction = __webpack_require__("1c0b");
          var isObject2 = __webpack_require__("861d");
          var slice = [].slice;
          var factories = {};
          var construct = function(C, argsLength, args) {
            if (!(argsLength in factories)) {
              for (var list = [], i = 0; i < argsLength; i++) list[i] = "a[" + i + "]";
              factories[argsLength] = Function("C,a", "return new C(" + list.join(",") + ")");
            }
            return factories[argsLength](C, args);
          };
          module2.exports = Function.bind || function bind(that) {
            var fn = aFunction(this);
            var partArgs = slice.call(arguments, 1);
            var boundFunction = function bound() {
              var args = partArgs.concat(slice.call(arguments));
              return this instanceof boundFunction ? construct(fn, args.length, args) : fn.apply(that, args);
            };
            if (isObject2(fn.prototype)) boundFunction.prototype = fn.prototype;
            return boundFunction;
          };
        }
      ),
      /***/
      "057f": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var toIndexedObject = __webpack_require__("fc6a");
          var nativeGetOwnPropertyNames = __webpack_require__("241c").f;
          var toString = {}.toString;
          var windowNames = typeof window == "object" && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];
          var getWindowNames = function(it) {
            try {
              return nativeGetOwnPropertyNames(it);
            } catch (error) {
              return windowNames.slice();
            }
          };
          module2.exports.f = function getOwnPropertyNames(it) {
            return windowNames && toString.call(it) == "[object Window]" ? getWindowNames(it) : nativeGetOwnPropertyNames(toIndexedObject(it));
          };
        }
      ),
      /***/
      "06cf": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var DESCRIPTORS = __webpack_require__("83ab");
          var propertyIsEnumerableModule = __webpack_require__("d1e7");
          var createPropertyDescriptor = __webpack_require__("5c6c");
          var toIndexedObject = __webpack_require__("fc6a");
          var toPrimitive = __webpack_require__("c04e");
          var has = __webpack_require__("5135");
          var IE8_DOM_DEFINE = __webpack_require__("0cfb");
          var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
          exports2.f = DESCRIPTORS ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
            O = toIndexedObject(O);
            P = toPrimitive(P, true);
            if (IE8_DOM_DEFINE) try {
              return nativeGetOwnPropertyDescriptor(O, P);
            } catch (error) {
            }
            if (has(O, P)) return createPropertyDescriptor(!propertyIsEnumerableModule.f.call(O, P), O[P]);
          };
        }
      ),
      /***/
      "0cfb": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var DESCRIPTORS = __webpack_require__("83ab");
          var fails = __webpack_require__("d039");
          var createElement = __webpack_require__("cc12");
          module2.exports = !DESCRIPTORS && !fails(function() {
            return Object.defineProperty(createElement("div"), "a", {
              get: function() {
                return 7;
              }
            }).a != 7;
          });
        }
      ),
      /***/
      "0d26": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
          exports2 = ___CSS_LOADER_API_IMPORT___(false);
          exports2.push([module2.i, '/*!\n * Quill Editor v1.3.7\n * https://quilljs.com/\n * Copyright (c) 2014, Jason Chen\n * Copyright (c) 2013, salesforce.com\n */.ql-container{box-sizing:border-box;font-family:Helvetica,Arial,sans-serif;font-size:13px;height:100%;margin:0;position:relative}.ql-container.ql-disabled .ql-tooltip{visibility:hidden}.ql-container.ql-disabled .ql-editor ul[data-checked]>li:before{pointer-events:none}.ql-clipboard{left:-100000px;height:1px;overflow-y:hidden;position:absolute;top:50%}.ql-clipboard p{margin:0;padding:0}.ql-editor{box-sizing:border-box;line-height:1.42;height:100%;outline:none;overflow-y:auto;padding:12px 15px;-o-tab-size:4;tab-size:4;-moz-tab-size:4;text-align:left;white-space:pre-wrap;word-wrap:break-word}.ql-editor>*{cursor:text}.ql-editor blockquote,.ql-editor h1,.ql-editor h2,.ql-editor h3,.ql-editor h4,.ql-editor h5,.ql-editor h6,.ql-editor ol,.ql-editor p,.ql-editor pre,.ql-editor ul{margin:0;padding:0;counter-reset:list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9}.ql-editor ol,.ql-editor ul{padding-left:1.5em}.ql-editor ol>li,.ql-editor ul>li{list-style-type:none}.ql-editor ul>li:before{content:"\\2022"}.ql-editor ul[data-checked=false],.ql-editor ul[data-checked=true]{pointer-events:none}.ql-editor ul[data-checked=false]>li *,.ql-editor ul[data-checked=true]>li *{pointer-events:all}.ql-editor ul[data-checked=false]>li:before,.ql-editor ul[data-checked=true]>li:before{color:#777;cursor:pointer;pointer-events:all}.ql-editor ul[data-checked=true]>li:before{content:"\\2611"}.ql-editor ul[data-checked=false]>li:before{content:"\\2610"}.ql-editor li:before{display:inline-block;white-space:nowrap;width:1.2em}.ql-editor li:not(.ql-direction-rtl):before{margin-left:-1.5em;margin-right:.3em;text-align:right}.ql-editor li.ql-direction-rtl:before{margin-left:.3em;margin-right:-1.5em}.ql-editor ol li:not(.ql-direction-rtl),.ql-editor ul li:not(.ql-direction-rtl){padding-left:1.5em}.ql-editor ol li.ql-direction-rtl,.ql-editor ul li.ql-direction-rtl{padding-right:1.5em}.ql-editor ol li{counter-reset:list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;counter-increment:list-0}.ql-editor ol li:before{content:counter(list-0,decimal) ". "}.ql-editor ol li.ql-indent-1{counter-increment:list-1}.ql-editor ol li.ql-indent-1:before{content:counter(list-1,lower-alpha) ". "}.ql-editor ol li.ql-indent-1{counter-reset:list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9}.ql-editor ol li.ql-indent-2{counter-increment:list-2}.ql-editor ol li.ql-indent-2:before{content:counter(list-2,lower-roman) ". "}.ql-editor ol li.ql-indent-2{counter-reset:list-3 list-4 list-5 list-6 list-7 list-8 list-9}.ql-editor ol li.ql-indent-3{counter-increment:list-3}.ql-editor ol li.ql-indent-3:before{content:counter(list-3,decimal) ". "}.ql-editor ol li.ql-indent-3{counter-reset:list-4 list-5 list-6 list-7 list-8 list-9}.ql-editor ol li.ql-indent-4{counter-increment:list-4}.ql-editor ol li.ql-indent-4:before{content:counter(list-4,lower-alpha) ". "}.ql-editor ol li.ql-indent-4{counter-reset:list-5 list-6 list-7 list-8 list-9}.ql-editor ol li.ql-indent-5{counter-increment:list-5}.ql-editor ol li.ql-indent-5:before{content:counter(list-5,lower-roman) ". "}.ql-editor ol li.ql-indent-5{counter-reset:list-6 list-7 list-8 list-9}.ql-editor ol li.ql-indent-6{counter-increment:list-6}.ql-editor ol li.ql-indent-6:before{content:counter(list-6,decimal) ". "}.ql-editor ol li.ql-indent-6{counter-reset:list-7 list-8 list-9}.ql-editor ol li.ql-indent-7{counter-increment:list-7}.ql-editor ol li.ql-indent-7:before{content:counter(list-7,lower-alpha) ". "}.ql-editor ol li.ql-indent-7{counter-reset:list-8 list-9}.ql-editor ol li.ql-indent-8{counter-increment:list-8}.ql-editor ol li.ql-indent-8:before{content:counter(list-8,lower-roman) ". "}.ql-editor ol li.ql-indent-8{counter-reset:list-9}.ql-editor ol li.ql-indent-9{counter-increment:list-9}.ql-editor ol li.ql-indent-9:before{content:counter(list-9,decimal) ". "}.ql-editor .ql-indent-1:not(.ql-direction-rtl){padding-left:3em}.ql-editor li.ql-indent-1:not(.ql-direction-rtl){padding-left:4.5em}.ql-editor .ql-indent-1.ql-direction-rtl.ql-align-right{padding-right:3em}.ql-editor li.ql-indent-1.ql-direction-rtl.ql-align-right{padding-right:4.5em}.ql-editor .ql-indent-2:not(.ql-direction-rtl){padding-left:6em}.ql-editor li.ql-indent-2:not(.ql-direction-rtl){padding-left:7.5em}.ql-editor .ql-indent-2.ql-direction-rtl.ql-align-right{padding-right:6em}.ql-editor li.ql-indent-2.ql-direction-rtl.ql-align-right{padding-right:7.5em}.ql-editor .ql-indent-3:not(.ql-direction-rtl){padding-left:9em}.ql-editor li.ql-indent-3:not(.ql-direction-rtl){padding-left:10.5em}.ql-editor .ql-indent-3.ql-direction-rtl.ql-align-right{padding-right:9em}.ql-editor li.ql-indent-3.ql-direction-rtl.ql-align-right{padding-right:10.5em}.ql-editor .ql-indent-4:not(.ql-direction-rtl){padding-left:12em}.ql-editor li.ql-indent-4:not(.ql-direction-rtl){padding-left:13.5em}.ql-editor .ql-indent-4.ql-direction-rtl.ql-align-right{padding-right:12em}.ql-editor li.ql-indent-4.ql-direction-rtl.ql-align-right{padding-right:13.5em}.ql-editor .ql-indent-5:not(.ql-direction-rtl){padding-left:15em}.ql-editor li.ql-indent-5:not(.ql-direction-rtl){padding-left:16.5em}.ql-editor .ql-indent-5.ql-direction-rtl.ql-align-right{padding-right:15em}.ql-editor li.ql-indent-5.ql-direction-rtl.ql-align-right{padding-right:16.5em}.ql-editor .ql-indent-6:not(.ql-direction-rtl){padding-left:18em}.ql-editor li.ql-indent-6:not(.ql-direction-rtl){padding-left:19.5em}.ql-editor .ql-indent-6.ql-direction-rtl.ql-align-right{padding-right:18em}.ql-editor li.ql-indent-6.ql-direction-rtl.ql-align-right{padding-right:19.5em}.ql-editor .ql-indent-7:not(.ql-direction-rtl){padding-left:21em}.ql-editor li.ql-indent-7:not(.ql-direction-rtl){padding-left:22.5em}.ql-editor .ql-indent-7.ql-direction-rtl.ql-align-right{padding-right:21em}.ql-editor li.ql-indent-7.ql-direction-rtl.ql-align-right{padding-right:22.5em}.ql-editor .ql-indent-8:not(.ql-direction-rtl){padding-left:24em}.ql-editor li.ql-indent-8:not(.ql-direction-rtl){padding-left:25.5em}.ql-editor .ql-indent-8.ql-direction-rtl.ql-align-right{padding-right:24em}.ql-editor li.ql-indent-8.ql-direction-rtl.ql-align-right{padding-right:25.5em}.ql-editor .ql-indent-9:not(.ql-direction-rtl){padding-left:27em}.ql-editor li.ql-indent-9:not(.ql-direction-rtl){padding-left:28.5em}.ql-editor .ql-indent-9.ql-direction-rtl.ql-align-right{padding-right:27em}.ql-editor li.ql-indent-9.ql-direction-rtl.ql-align-right{padding-right:28.5em}.ql-editor .ql-video{display:block;max-width:100%}.ql-editor .ql-video.ql-align-center{margin:0 auto}.ql-editor .ql-video.ql-align-right{margin:0 0 0 auto}.ql-editor .ql-bg-black{background-color:#000}.ql-editor .ql-bg-red{background-color:#e60000}.ql-editor .ql-bg-orange{background-color:#f90}.ql-editor .ql-bg-yellow{background-color:#ff0}.ql-editor .ql-bg-green{background-color:#008a00}.ql-editor .ql-bg-blue{background-color:#06c}.ql-editor .ql-bg-purple{background-color:#93f}.ql-editor .ql-color-white{color:#fff}.ql-editor .ql-color-red{color:#e60000}.ql-editor .ql-color-orange{color:#f90}.ql-editor .ql-color-yellow{color:#ff0}.ql-editor .ql-color-green{color:#008a00}.ql-editor .ql-color-blue{color:#06c}.ql-editor .ql-color-purple{color:#93f}.ql-editor .ql-font-serif{font-family:Georgia,Times New Roman,serif}.ql-editor .ql-font-monospace{font-family:Monaco,Courier New,monospace}.ql-editor .ql-size-small{font-size:.75em}.ql-editor .ql-size-large{font-size:1.5em}.ql-editor .ql-size-huge{font-size:2.5em}.ql-editor .ql-direction-rtl{direction:rtl;text-align:inherit}.ql-editor .ql-align-center{text-align:center}.ql-editor .ql-align-justify{text-align:justify}.ql-editor .ql-align-right{text-align:right}.ql-editor.ql-blank:before{color:rgba(0,0,0,.6);content:attr(data-placeholder);font-style:italic;left:15px;pointer-events:none;position:absolute;right:15px}.ql-snow.ql-toolbar:after,.ql-snow .ql-toolbar:after{clear:both;content:"";display:table}.ql-snow.ql-toolbar button,.ql-snow .ql-toolbar button{background:none;border:none;cursor:pointer;display:inline-block;float:left;height:24px;padding:3px 5px;width:28px}.ql-snow.ql-toolbar button svg,.ql-snow .ql-toolbar button svg{float:left;height:100%}.ql-snow.ql-toolbar button:active:hover,.ql-snow .ql-toolbar button:active:hover{outline:none}.ql-snow.ql-toolbar input.ql-image[type=file],.ql-snow .ql-toolbar input.ql-image[type=file]{display:none}.ql-snow.ql-toolbar .ql-picker-item.ql-selected,.ql-snow .ql-toolbar .ql-picker-item.ql-selected,.ql-snow.ql-toolbar .ql-picker-item:hover,.ql-snow .ql-toolbar .ql-picker-item:hover,.ql-snow.ql-toolbar .ql-picker-label.ql-active,.ql-snow .ql-toolbar .ql-picker-label.ql-active,.ql-snow.ql-toolbar .ql-picker-label:hover,.ql-snow .ql-toolbar .ql-picker-label:hover,.ql-snow.ql-toolbar button.ql-active,.ql-snow .ql-toolbar button.ql-active,.ql-snow.ql-toolbar button:focus,.ql-snow .ql-toolbar button:focus,.ql-snow.ql-toolbar button:hover,.ql-snow .ql-toolbar button:hover{color:#06c}.ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-fill,.ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-fill,.ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill,.ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill,.ql-snow.ql-toolbar .ql-picker-item:hover .ql-fill,.ql-snow .ql-toolbar .ql-picker-item:hover .ql-fill,.ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,.ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,.ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-fill,.ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-fill,.ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,.ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,.ql-snow.ql-toolbar .ql-picker-label:hover .ql-fill,.ql-snow .ql-toolbar .ql-picker-label:hover .ql-fill,.ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,.ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,.ql-snow.ql-toolbar button.ql-active .ql-fill,.ql-snow .ql-toolbar button.ql-active .ql-fill,.ql-snow.ql-toolbar button.ql-active .ql-stroke.ql-fill,.ql-snow .ql-toolbar button.ql-active .ql-stroke.ql-fill,.ql-snow.ql-toolbar button:focus .ql-fill,.ql-snow .ql-toolbar button:focus .ql-fill,.ql-snow.ql-toolbar button:focus .ql-stroke.ql-fill,.ql-snow .ql-toolbar button:focus .ql-stroke.ql-fill,.ql-snow.ql-toolbar button:hover .ql-fill,.ql-snow .ql-toolbar button:hover .ql-fill,.ql-snow.ql-toolbar button:hover .ql-stroke.ql-fill,.ql-snow .ql-toolbar button:hover .ql-stroke.ql-fill{fill:#06c}.ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke,.ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke,.ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter,.ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter,.ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke,.ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke,.ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke-miter,.ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke-miter,.ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke,.ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke,.ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,.ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,.ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke,.ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke,.ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke-miter,.ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke-miter,.ql-snow.ql-toolbar button.ql-active .ql-stroke,.ql-snow .ql-toolbar button.ql-active .ql-stroke,.ql-snow.ql-toolbar button.ql-active .ql-stroke-miter,.ql-snow .ql-toolbar button.ql-active .ql-stroke-miter,.ql-snow.ql-toolbar button:focus .ql-stroke,.ql-snow .ql-toolbar button:focus .ql-stroke,.ql-snow.ql-toolbar button:focus .ql-stroke-miter,.ql-snow .ql-toolbar button:focus .ql-stroke-miter,.ql-snow.ql-toolbar button:hover .ql-stroke,.ql-snow .ql-toolbar button:hover .ql-stroke,.ql-snow.ql-toolbar button:hover .ql-stroke-miter,.ql-snow .ql-toolbar button:hover .ql-stroke-miter{stroke:#06c}@media (pointer:coarse){.ql-snow.ql-toolbar button:hover:not(.ql-active),.ql-snow .ql-toolbar button:hover:not(.ql-active){color:#444}.ql-snow.ql-toolbar button:hover:not(.ql-active) .ql-fill,.ql-snow .ql-toolbar button:hover:not(.ql-active) .ql-fill,.ql-snow.ql-toolbar button:hover:not(.ql-active) .ql-stroke.ql-fill,.ql-snow .ql-toolbar button:hover:not(.ql-active) .ql-stroke.ql-fill{fill:#444}.ql-snow.ql-toolbar button:hover:not(.ql-active) .ql-stroke,.ql-snow .ql-toolbar button:hover:not(.ql-active) .ql-stroke,.ql-snow.ql-toolbar button:hover:not(.ql-active) .ql-stroke-miter,.ql-snow .ql-toolbar button:hover:not(.ql-active) .ql-stroke-miter{stroke:#444}}.ql-snow,.ql-snow *{box-sizing:border-box}.ql-snow .ql-hidden{display:none}.ql-snow .ql-out-bottom,.ql-snow .ql-out-top{visibility:hidden}.ql-snow .ql-tooltip{position:absolute;transform:translateY(10px)}.ql-snow .ql-tooltip a{cursor:pointer;text-decoration:none}.ql-snow .ql-tooltip.ql-flip{transform:translateY(-10px)}.ql-snow .ql-formats{display:inline-block;vertical-align:middle}.ql-snow .ql-formats:after{clear:both;content:"";display:table}.ql-snow .ql-stroke{fill:none;stroke:#444;stroke-linecap:round;stroke-linejoin:round;stroke-width:2}.ql-snow .ql-stroke-miter{fill:none;stroke:#444;stroke-miterlimit:10;stroke-width:2}.ql-snow .ql-fill,.ql-snow .ql-stroke.ql-fill{fill:#444}.ql-snow .ql-empty{fill:none}.ql-snow .ql-even{fill-rule:evenodd}.ql-snow .ql-stroke.ql-thin,.ql-snow .ql-thin{stroke-width:1}.ql-snow .ql-transparent{opacity:.4}.ql-snow .ql-direction svg:last-child{display:none}.ql-snow .ql-direction.ql-active svg:last-child{display:inline}.ql-snow .ql-direction.ql-active svg:first-child{display:none}.ql-snow .ql-editor h1{font-size:2em}.ql-snow .ql-editor h2{font-size:1.5em}.ql-snow .ql-editor h3{font-size:1.17em}.ql-snow .ql-editor h4{font-size:1em}.ql-snow .ql-editor h5{font-size:.83em}.ql-snow .ql-editor h6{font-size:.67em}.ql-snow .ql-editor a{text-decoration:underline}.ql-snow .ql-editor blockquote{border-left:4px solid #ccc;margin-bottom:5px;margin-top:5px;padding-left:16px}.ql-snow .ql-editor code,.ql-snow .ql-editor pre{background-color:#f0f0f0;border-radius:3px}.ql-snow .ql-editor pre{white-space:pre-wrap;margin-bottom:5px;margin-top:5px;padding:5px 10px}.ql-snow .ql-editor code{font-size:85%;padding:2px 4px}.ql-snow .ql-editor pre.ql-syntax{background-color:#23241f;color:#f8f8f2;overflow:visible}.ql-snow .ql-editor img{max-width:100%}.ql-snow .ql-picker{color:#444;display:inline-block;float:left;font-size:14px;font-weight:500;height:24px;position:relative;vertical-align:middle}.ql-snow .ql-picker-label{cursor:pointer;display:inline-block;height:100%;padding-left:8px;padding-right:2px;position:relative;width:100%}.ql-snow .ql-picker-label:before{display:inline-block;line-height:22px}.ql-snow .ql-picker-options{background-color:#fff;display:none;min-width:100%;padding:4px 8px;position:absolute;white-space:nowrap}.ql-snow .ql-picker-options .ql-picker-item{cursor:pointer;display:block;padding-bottom:5px;padding-top:5px}.ql-snow .ql-picker.ql-expanded .ql-picker-label{color:#ccc;z-index:2}.ql-snow .ql-picker.ql-expanded .ql-picker-label .ql-fill{fill:#ccc}.ql-snow .ql-picker.ql-expanded .ql-picker-label .ql-stroke{stroke:#ccc}.ql-snow .ql-picker.ql-expanded .ql-picker-options{display:block;margin-top:-1px;top:100%;z-index:1}.ql-snow .ql-color-picker,.ql-snow .ql-icon-picker{width:28px}.ql-snow .ql-color-picker .ql-picker-label,.ql-snow .ql-icon-picker .ql-picker-label{padding:2px 4px}.ql-snow .ql-color-picker .ql-picker-label svg,.ql-snow .ql-icon-picker .ql-picker-label svg{right:4px}.ql-snow .ql-icon-picker .ql-picker-options{padding:4px 0}.ql-snow .ql-icon-picker .ql-picker-item{height:24px;width:24px;padding:2px 4px}.ql-snow .ql-color-picker .ql-picker-options{padding:3px 5px;width:152px}.ql-snow .ql-color-picker .ql-picker-item{border:1px solid transparent;float:left;height:16px;margin:2px;padding:0;width:16px}.ql-snow .ql-picker:not(.ql-color-picker):not(.ql-icon-picker) svg{position:absolute;margin-top:-9px;right:0;top:50%;width:18px}.ql-snow .ql-picker.ql-font .ql-picker-item[data-label]:not([data-label=""]):before,.ql-snow .ql-picker.ql-font .ql-picker-label[data-label]:not([data-label=""]):before,.ql-snow .ql-picker.ql-header .ql-picker-item[data-label]:not([data-label=""]):before,.ql-snow .ql-picker.ql-header .ql-picker-label[data-label]:not([data-label=""]):before,.ql-snow .ql-picker.ql-size .ql-picker-item[data-label]:not([data-label=""]):before,.ql-snow .ql-picker.ql-size .ql-picker-label[data-label]:not([data-label=""]):before{content:attr(data-label)}.ql-snow .ql-picker.ql-header{width:98px}.ql-snow .ql-picker.ql-header .ql-picker-item:before,.ql-snow .ql-picker.ql-header .ql-picker-label:before{content:"Normal"}.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]:before,.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]:before{content:"Heading 1"}.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]:before,.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]:before{content:"Heading 2"}.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]:before,.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]:before{content:"Heading 3"}.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]:before,.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]:before{content:"Heading 4"}.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]:before,.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]:before{content:"Heading 5"}.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]:before,.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]:before{content:"Heading 6"}.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]:before{font-size:2em}.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]:before{font-size:1.5em}.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]:before{font-size:1.17em}.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]:before{font-size:1em}.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]:before{font-size:.83em}.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]:before{font-size:.67em}.ql-snow .ql-picker.ql-font{width:108px}.ql-snow .ql-picker.ql-font .ql-picker-item:before,.ql-snow .ql-picker.ql-font .ql-picker-label:before{content:"Sans Serif"}.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]:before,.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]:before{content:"Serif"}.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]:before,.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]:before{content:"Monospace"}.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]:before{font-family:Georgia,Times New Roman,serif}.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]:before{font-family:Monaco,Courier New,monospace}.ql-snow .ql-picker.ql-size{width:98px}.ql-snow .ql-picker.ql-size .ql-picker-item:before,.ql-snow .ql-picker.ql-size .ql-picker-label:before{content:"Normal"}.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]:before,.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]:before{content:"Small"}.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]:before,.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]:before{content:"Large"}.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]:before,.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]:before{content:"Huge"}.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]:before{font-size:10px}.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]:before{font-size:18px}.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]:before{font-size:32px}.ql-snow .ql-color-picker.ql-background .ql-picker-item{background-color:#fff}.ql-snow .ql-color-picker.ql-color .ql-picker-item{background-color:#000}.ql-toolbar.ql-snow{border:1px solid #ccc;box-sizing:border-box;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;padding:8px}.ql-toolbar.ql-snow .ql-formats{margin-right:15px}.ql-toolbar.ql-snow .ql-picker-label{border:1px solid transparent}.ql-toolbar.ql-snow .ql-picker-options{border:1px solid transparent;box-shadow:0 2px 8px rgba(0,0,0,.2)}.ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-label,.ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options{border-color:#ccc}.ql-toolbar.ql-snow .ql-color-picker .ql-picker-item.ql-selected,.ql-toolbar.ql-snow .ql-color-picker .ql-picker-item:hover{border-color:#000}.ql-toolbar.ql-snow+.ql-container.ql-snow{border-top:0}.ql-snow .ql-tooltip{background-color:#fff;border:1px solid #ccc;box-shadow:0 0 5px #ddd;color:#444;padding:5px 12px;white-space:nowrap}.ql-snow .ql-tooltip:before{content:"Visit URL:";line-height:26px;margin-right:8px}.ql-snow .ql-tooltip input[type=text]{display:none;border:1px solid #ccc;font-size:13px;height:26px;margin:0;padding:3px 5px;width:170px}.ql-snow .ql-tooltip a.ql-preview{display:inline-block;max-width:200px;overflow-x:hidden;text-overflow:ellipsis;vertical-align:top}.ql-snow .ql-tooltip a.ql-action:after{border-right:1px solid #ccc;content:"Edit";margin-left:16px;padding-right:8px}.ql-snow .ql-tooltip a.ql-remove:before{content:"Remove";margin-left:8px}.ql-snow .ql-tooltip a{line-height:26px}.ql-snow .ql-tooltip.ql-editing a.ql-preview,.ql-snow .ql-tooltip.ql-editing a.ql-remove{display:none}.ql-snow .ql-tooltip.ql-editing input[type=text]{display:inline-block}.ql-snow .ql-tooltip.ql-editing a.ql-action:after{border-right:0;content:"Save";padding-right:0}.ql-snow .ql-tooltip[data-mode=link]:before{content:"Enter link:"}.ql-snow .ql-tooltip[data-mode=formula]:before{content:"Enter formula:"}.ql-snow .ql-tooltip[data-mode=video]:before{content:"Enter video:"}.ql-snow a{color:#06c}.ql-container.ql-snow{border:1px solid #ccc}', ""]);
          module2.exports = exports2;
        }
      ),
      /***/
      "129f": (
        /***/
        function(module2, exports2) {
          module2.exports = Object.is || function is(x, y) {
            return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
          };
        }
      ),
      /***/
      "14c3": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var classof = __webpack_require__("c6b6");
          var regexpExec = __webpack_require__("9263");
          module2.exports = function(R, S) {
            var exec = R.exec;
            if (typeof exec === "function") {
              var result = exec.call(R, S);
              if (typeof result !== "object") {
                throw TypeError("RegExp exec method returned something other than an Object or null");
              }
              return result;
            }
            if (classof(R) !== "RegExp") {
              throw TypeError("RegExp#exec called on incompatible receiver");
            }
            return regexpExec.call(R, S);
          };
        }
      ),
      /***/
      "159b": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var global = __webpack_require__("da84");
          var DOMIterables = __webpack_require__("fdbc");
          var forEach = __webpack_require__("17c2");
          var createNonEnumerableProperty = __webpack_require__("9112");
          for (var COLLECTION_NAME in DOMIterables) {
            var Collection = global[COLLECTION_NAME];
            var CollectionPrototype = Collection && Collection.prototype;
            if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
              createNonEnumerableProperty(CollectionPrototype, "forEach", forEach);
            } catch (error) {
              CollectionPrototype.forEach = forEach;
            }
          }
        }
      ),
      /***/
      "17c2": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var $forEach = __webpack_require__("b727").forEach;
          var arrayMethodIsStrict = __webpack_require__("a640");
          var arrayMethodUsesToLength = __webpack_require__("ae40");
          var STRICT_METHOD = arrayMethodIsStrict("forEach");
          var USES_TO_LENGTH = arrayMethodUsesToLength("forEach");
          module2.exports = !STRICT_METHOD || !USES_TO_LENGTH ? function forEach(callbackfn) {
            return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : void 0);
          } : [].forEach;
        }
      ),
      /***/
      "1be4": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var getBuiltIn = __webpack_require__("d066");
          module2.exports = getBuiltIn("document", "documentElement");
        }
      ),
      /***/
      "1c0b": (
        /***/
        function(module2, exports2) {
          module2.exports = function(it) {
            if (typeof it != "function") {
              throw TypeError(String(it) + " is not a function");
            }
            return it;
          };
        }
      ),
      /***/
      "1c7e": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var wellKnownSymbol = __webpack_require__("b622");
          var ITERATOR = wellKnownSymbol("iterator");
          var SAFE_CLOSING = false;
          try {
            var called = 0;
            var iteratorWithReturn = {
              next: function() {
                return { done: !!called++ };
              },
              "return": function() {
                SAFE_CLOSING = true;
              }
            };
            iteratorWithReturn[ITERATOR] = function() {
              return this;
            };
            Array.from(iteratorWithReturn, function() {
              throw 2;
            });
          } catch (error) {
          }
          module2.exports = function(exec, SKIP_CLOSING) {
            if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
            var ITERATION_SUPPORT = false;
            try {
              var object = {};
              object[ITERATOR] = function() {
                return {
                  next: function() {
                    return { done: ITERATION_SUPPORT = true };
                  }
                };
              };
              exec(object);
            } catch (error) {
            }
            return ITERATION_SUPPORT;
          };
        }
      ),
      /***/
      "1d80": (
        /***/
        function(module2, exports2) {
          module2.exports = function(it) {
            if (it == void 0) throw TypeError("Can't call method on " + it);
            return it;
          };
        }
      ),
      /***/
      "1dde": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var fails = __webpack_require__("d039");
          var wellKnownSymbol = __webpack_require__("b622");
          var V8_VERSION = __webpack_require__("2d00");
          var SPECIES = wellKnownSymbol("species");
          module2.exports = function(METHOD_NAME) {
            return V8_VERSION >= 51 || !fails(function() {
              var array = [];
              var constructor = array.constructor = {};
              constructor[SPECIES] = function() {
                return { foo: 1 };
              };
              return array[METHOD_NAME](Boolean).foo !== 1;
            });
          };
        }
      ),
      /***/
      "23cb": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var toInteger = __webpack_require__("a691");
          var max = Math.max;
          var min = Math.min;
          module2.exports = function(index, length) {
            var integer = toInteger(index);
            return integer < 0 ? max(integer + length, 0) : min(integer, length);
          };
        }
      ),
      /***/
      "23e7": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var global = __webpack_require__("da84");
          var getOwnPropertyDescriptor = __webpack_require__("06cf").f;
          var createNonEnumerableProperty = __webpack_require__("9112");
          var redefine = __webpack_require__("6eeb");
          var setGlobal = __webpack_require__("ce4e");
          var copyConstructorProperties = __webpack_require__("e893");
          var isForced = __webpack_require__("94ca");
          module2.exports = function(options, source) {
            var TARGET = options.target;
            var GLOBAL = options.global;
            var STATIC = options.stat;
            var FORCED, target, key, targetProperty, sourceProperty, descriptor;
            if (GLOBAL) {
              target = global;
            } else if (STATIC) {
              target = global[TARGET] || setGlobal(TARGET, {});
            } else {
              target = (global[TARGET] || {}).prototype;
            }
            if (target) for (key in source) {
              sourceProperty = source[key];
              if (options.noTargetGet) {
                descriptor = getOwnPropertyDescriptor(target, key);
                targetProperty = descriptor && descriptor.value;
              } else targetProperty = target[key];
              FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? "." : "#") + key, options.forced);
              if (!FORCED && targetProperty !== void 0) {
                if (typeof sourceProperty === typeof targetProperty) continue;
                copyConstructorProperties(sourceProperty, targetProperty);
              }
              if (options.sham || targetProperty && targetProperty.sham) {
                createNonEnumerableProperty(sourceProperty, "sham", true);
              }
              redefine(target, key, sourceProperty, options);
            }
          };
        }
      ),
      /***/
      "241c": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var internalObjectKeys = __webpack_require__("ca84");
          var enumBugKeys = __webpack_require__("7839");
          var hiddenKeys = enumBugKeys.concat("length", "prototype");
          exports2.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
            return internalObjectKeys(O, hiddenKeys);
          };
        }
      ),
      /***/
      "24fb": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          module2.exports = function(useSourceMap) {
            var list = [];
            list.toString = function toString() {
              return this.map(function(item) {
                var content = cssWithMappingToString(item, useSourceMap);
                if (item[2]) {
                  return "@media ".concat(item[2], " {").concat(content, "}");
                }
                return content;
              }).join("");
            };
            list.i = function(modules, mediaQuery, dedupe) {
              if (typeof modules === "string") {
                modules = [[null, modules, ""]];
              }
              var alreadyImportedModules = {};
              if (dedupe) {
                for (var i = 0; i < this.length; i++) {
                  var id = this[i][0];
                  if (id != null) {
                    alreadyImportedModules[id] = true;
                  }
                }
              }
              for (var _i = 0; _i < modules.length; _i++) {
                var item = [].concat(modules[_i]);
                if (dedupe && alreadyImportedModules[item[0]]) {
                  continue;
                }
                if (mediaQuery) {
                  if (!item[2]) {
                    item[2] = mediaQuery;
                  } else {
                    item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
                  }
                }
                list.push(item);
              }
            };
            return list;
          };
          function cssWithMappingToString(item, useSourceMap) {
            var content = item[1] || "";
            var cssMapping = item[3];
            if (!cssMapping) {
              return content;
            }
            if (useSourceMap && typeof btoa === "function") {
              var sourceMapping = toComment(cssMapping);
              var sourceURLs = cssMapping.sources.map(function(source) {
                return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
              });
              return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
            }
            return [content].join("\n");
          }
          function toComment(sourceMap) {
            var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
            var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
            return "/*# ".concat(data, " */");
          }
        }
      ),
      /***/
      "25f0": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var redefine = __webpack_require__("6eeb");
          var anObject = __webpack_require__("825a");
          var fails = __webpack_require__("d039");
          var flags = __webpack_require__("ad6d");
          var TO_STRING = "toString";
          var RegExpPrototype = RegExp.prototype;
          var nativeToString = RegExpPrototype[TO_STRING];
          var NOT_GENERIC = fails(function() {
            return nativeToString.call({ source: "a", flags: "b" }) != "/a/b";
          });
          var INCORRECT_NAME = nativeToString.name != TO_STRING;
          if (NOT_GENERIC || INCORRECT_NAME) {
            redefine(RegExp.prototype, TO_STRING, function toString() {
              var R = anObject(this);
              var p = String(R.source);
              var rf = R.flags;
              var f = String(rf === void 0 && R instanceof RegExp && !("flags" in RegExpPrototype) ? flags.call(R) : rf);
              return "/" + p + "/" + f;
            }, { unsafe: true });
          }
        }
      ),
      /***/
      "261e": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
          exports2 = ___CSS_LOADER_API_IMPORT___(false);
          exports2.push([module2.i, ".ql-editor{min-height:200px;font-size:16px}.ql-snow .ql-stroke.ql-thin,.ql-snow .ql-thin{stroke-width:1px!important}.quillWrapper .ql-snow.ql-toolbar{padding-top:8px;padding-bottom:4px}.quillWrapper .ql-snow.ql-toolbar .ql-formats{margin-bottom:10px}.ql-snow .ql-toolbar button svg,.quillWrapper .ql-snow.ql-toolbar button svg{width:22px;height:22px}.quillWrapper .ql-editor ul[data-checked=false]>li:before,.quillWrapper .ql-editor ul[data-checked=true]>li:before{font-size:1.35em;vertical-align:baseline;bottom:-.065em;font-weight:900;color:#222}.quillWrapper .ql-snow .ql-stroke{stroke:rgba(63,63,63,.95);stroke-linecap:square;stroke-linejoin:initial;stroke-width:1.7px}.quillWrapper .ql-picker-label{font-size:15px}.quillWrapper .ql-snow .ql-active .ql-stroke{stroke-width:2.25px}.quillWrapper .ql-toolbar.ql-snow .ql-formats{vertical-align:top}.ql-picker:not(.ql-background){position:relative;top:2px}.ql-picker.ql-color-picker svg{width:22px!important;height:22px!important}.quillWrapper .imageResizeActive img{display:block;cursor:pointer}.quillWrapper .imageResizeActive~div svg{cursor:pointer}", ""]);
          module2.exports = exports2;
        }
      ),
      /***/
      "2ca0": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var $ = __webpack_require__("23e7");
          var getOwnPropertyDescriptor = __webpack_require__("06cf").f;
          var toLength = __webpack_require__("50c4");
          var notARegExp = __webpack_require__("5a34");
          var requireObjectCoercible = __webpack_require__("1d80");
          var correctIsRegExpLogic = __webpack_require__("ab13");
          var IS_PURE = __webpack_require__("c430");
          var nativeStartsWith = "".startsWith;
          var min = Math.min;
          var CORRECT_IS_REGEXP_LOGIC = correctIsRegExpLogic("startsWith");
          var MDN_POLYFILL_BUG = !IS_PURE && !CORRECT_IS_REGEXP_LOGIC && !!function() {
            var descriptor = getOwnPropertyDescriptor(String.prototype, "startsWith");
            return descriptor && !descriptor.writable;
          }();
          $({ target: "String", proto: true, forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC }, {
            startsWith: function startsWith(searchString) {
              var that = String(requireObjectCoercible(this));
              notARegExp(searchString);
              var index = toLength(min(arguments.length > 1 ? arguments[1] : void 0, that.length));
              var search = String(searchString);
              return nativeStartsWith ? nativeStartsWith.call(that, search, index) : that.slice(index, index + search.length) === search;
            }
          });
        }
      ),
      /***/
      "2d00": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var global = __webpack_require__("da84");
          var userAgent = __webpack_require__("342f");
          var process2 = global.process;
          var versions = process2 && process2.versions;
          var v8 = versions && versions.v8;
          var match, version;
          if (v8) {
            match = v8.split(".");
            version = match[0] + match[1];
          } else if (userAgent) {
            match = userAgent.match(/Edge\/(\d+)/);
            if (!match || match[1] >= 74) {
              match = userAgent.match(/Chrome\/(\d+)/);
              if (match) version = match[1];
            }
          }
          module2.exports = version && +version;
        }
      ),
      /***/
      "3410": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var $ = __webpack_require__("23e7");
          var fails = __webpack_require__("d039");
          var toObject = __webpack_require__("7b0b");
          var nativeGetPrototypeOf = __webpack_require__("e163");
          var CORRECT_PROTOTYPE_GETTER = __webpack_require__("e177");
          var FAILS_ON_PRIMITIVES = fails(function() {
            nativeGetPrototypeOf(1);
          });
          $({ target: "Object", stat: true, forced: FAILS_ON_PRIMITIVES, sham: !CORRECT_PROTOTYPE_GETTER }, {
            getPrototypeOf: function getPrototypeOf(it) {
              return nativeGetPrototypeOf(toObject(it));
            }
          });
        }
      ),
      /***/
      "342f": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var getBuiltIn = __webpack_require__("d066");
          module2.exports = getBuiltIn("navigator", "userAgent") || "";
        }
      ),
      /***/
      "35a1": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var classof = __webpack_require__("f5df");
          var Iterators = __webpack_require__("3f8c");
          var wellKnownSymbol = __webpack_require__("b622");
          var ITERATOR = wellKnownSymbol("iterator");
          module2.exports = function(it) {
            if (it != void 0) return it[ITERATOR] || it["@@iterator"] || Iterators[classof(it)];
          };
        }
      ),
      /***/
      "37e8": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var DESCRIPTORS = __webpack_require__("83ab");
          var definePropertyModule = __webpack_require__("9bf2");
          var anObject = __webpack_require__("825a");
          var objectKeys = __webpack_require__("df75");
          module2.exports = DESCRIPTORS ? Object.defineProperties : function defineProperties(O, Properties) {
            anObject(O);
            var keys = objectKeys(Properties);
            var length = keys.length;
            var index = 0;
            var key;
            while (length > index) definePropertyModule.f(O, key = keys[index++], Properties[key]);
            return O;
          };
        }
      ),
      /***/
      "3bbe": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var isObject2 = __webpack_require__("861d");
          module2.exports = function(it) {
            if (!isObject2(it) && it !== null) {
              throw TypeError("Can't set " + String(it) + " as a prototype");
            }
            return it;
          };
        }
      ),
      /***/
      "3ca3": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var charAt = __webpack_require__("6547").charAt;
          var InternalStateModule = __webpack_require__("69f3");
          var defineIterator = __webpack_require__("7dd0");
          var STRING_ITERATOR = "String Iterator";
          var setInternalState = InternalStateModule.set;
          var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);
          defineIterator(String, "String", function(iterated) {
            setInternalState(this, {
              type: STRING_ITERATOR,
              string: String(iterated),
              index: 0
            });
          }, function next() {
            var state = getInternalState(this);
            var string = state.string;
            var index = state.index;
            var point;
            if (index >= string.length) return { value: void 0, done: true };
            point = charAt(string, index);
            state.index += point.length;
            return { value: point, done: false };
          });
        }
      ),
      /***/
      "3f8c": (
        /***/
        function(module2, exports2) {
          module2.exports = {};
        }
      ),
      /***/
      "4160": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var $ = __webpack_require__("23e7");
          var forEach = __webpack_require__("17c2");
          $({ target: "Array", proto: true, forced: [].forEach != forEach }, {
            forEach
          });
        }
      ),
      /***/
      "428f": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var global = __webpack_require__("da84");
          module2.exports = global;
        }
      ),
      /***/
      "44ad": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var fails = __webpack_require__("d039");
          var classof = __webpack_require__("c6b6");
          var split = "".split;
          module2.exports = fails(function() {
            return !Object("z").propertyIsEnumerable(0);
          }) ? function(it) {
            return classof(it) == "String" ? split.call(it, "") : Object(it);
          } : Object;
        }
      ),
      /***/
      "44d2": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var wellKnownSymbol = __webpack_require__("b622");
          var create = __webpack_require__("7c73");
          var definePropertyModule = __webpack_require__("9bf2");
          var UNSCOPABLES = wellKnownSymbol("unscopables");
          var ArrayPrototype = Array.prototype;
          if (ArrayPrototype[UNSCOPABLES] == void 0) {
            definePropertyModule.f(ArrayPrototype, UNSCOPABLES, {
              configurable: true,
              value: create(null)
            });
          }
          module2.exports = function(key) {
            ArrayPrototype[UNSCOPABLES][key] = true;
          };
        }
      ),
      /***/
      "44e7": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var isObject2 = __webpack_require__("861d");
          var classof = __webpack_require__("c6b6");
          var wellKnownSymbol = __webpack_require__("b622");
          var MATCH = wellKnownSymbol("match");
          module2.exports = function(it) {
            var isRegExp;
            return isObject2(it) && ((isRegExp = it[MATCH]) !== void 0 ? !!isRegExp : classof(it) == "RegExp");
          };
        }
      ),
      /***/
      "466d": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var fixRegExpWellKnownSymbolLogic = __webpack_require__("d784");
          var anObject = __webpack_require__("825a");
          var toLength = __webpack_require__("50c4");
          var requireObjectCoercible = __webpack_require__("1d80");
          var advanceStringIndex = __webpack_require__("8aa5");
          var regExpExec = __webpack_require__("14c3");
          fixRegExpWellKnownSymbolLogic("match", 1, function(MATCH, nativeMatch, maybeCallNative) {
            return [
              // `String.prototype.match` method
              // https://tc39.github.io/ecma262/#sec-string.prototype.match
              function match(regexp) {
                var O = requireObjectCoercible(this);
                var matcher = regexp == void 0 ? void 0 : regexp[MATCH];
                return matcher !== void 0 ? matcher.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
              },
              // `RegExp.prototype[@@match]` method
              // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
              function(regexp) {
                var res = maybeCallNative(nativeMatch, regexp, this);
                if (res.done) return res.value;
                var rx = anObject(regexp);
                var S = String(this);
                if (!rx.global) return regExpExec(rx, S);
                var fullUnicode = rx.unicode;
                rx.lastIndex = 0;
                var A = [];
                var n = 0;
                var result;
                while ((result = regExpExec(rx, S)) !== null) {
                  var matchStr = String(result[0]);
                  A[n] = matchStr;
                  if (matchStr === "") rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
                  n++;
                }
                return n === 0 ? null : A;
              }
            ];
          });
        }
      ),
      /***/
      "4930": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var fails = __webpack_require__("d039");
          module2.exports = !!Object.getOwnPropertySymbols && !fails(function() {
            return !String(Symbol());
          });
        }
      ),
      /***/
      "499e": (
        /***/
        function(module2, __webpack_exports__, __webpack_require__) {
          "use strict";
          __webpack_require__.r(__webpack_exports__);
          __webpack_require__.d(__webpack_exports__, "default", function() {
            return (
              /* binding */
              addStylesClient
            );
          });
          function listToStyles(parentId, list) {
            var styles = [];
            var newStyles = {};
            for (var i = 0; i < list.length; i++) {
              var item = list[i];
              var id = item[0];
              var css = item[1];
              var media = item[2];
              var sourceMap = item[3];
              var part = {
                id: parentId + ":" + i,
                css,
                media,
                sourceMap
              };
              if (!newStyles[id]) {
                styles.push(newStyles[id] = { id, parts: [part] });
              } else {
                newStyles[id].parts.push(part);
              }
            }
            return styles;
          }
          var hasDocument = typeof document !== "undefined";
          if (typeof DEBUG !== "undefined" && DEBUG) {
            if (!hasDocument) {
              throw new Error(
                "vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
              );
            }
          }
          var stylesInDom = {
            /*
              [id: number]: {
                id: number,
                refs: number,
                parts: Array<(obj?: StyleObjectPart) => void>
              }
            */
          };
          var head = hasDocument && (document.head || document.getElementsByTagName("head")[0]);
          var singletonElement = null;
          var singletonCounter = 0;
          var isProduction = false;
          var noop = function() {
          };
          var options = null;
          var ssrIdKey = "data-vue-ssr-id";
          var isOldIE = typeof navigator !== "undefined" && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase());
          function addStylesClient(parentId, list, _isProduction, _options) {
            isProduction = _isProduction;
            options = _options || {};
            var styles = listToStyles(parentId, list);
            addStylesToDom(styles);
            return function update(newList) {
              var mayRemove = [];
              for (var i = 0; i < styles.length; i++) {
                var item = styles[i];
                var domStyle = stylesInDom[item.id];
                domStyle.refs--;
                mayRemove.push(domStyle);
              }
              if (newList) {
                styles = listToStyles(parentId, newList);
                addStylesToDom(styles);
              } else {
                styles = [];
              }
              for (var i = 0; i < mayRemove.length; i++) {
                var domStyle = mayRemove[i];
                if (domStyle.refs === 0) {
                  for (var j = 0; j < domStyle.parts.length; j++) {
                    domStyle.parts[j]();
                  }
                  delete stylesInDom[domStyle.id];
                }
              }
            };
          }
          function addStylesToDom(styles) {
            for (var i = 0; i < styles.length; i++) {
              var item = styles[i];
              var domStyle = stylesInDom[item.id];
              if (domStyle) {
                domStyle.refs++;
                for (var j = 0; j < domStyle.parts.length; j++) {
                  domStyle.parts[j](item.parts[j]);
                }
                for (; j < item.parts.length; j++) {
                  domStyle.parts.push(addStyle(item.parts[j]));
                }
                if (domStyle.parts.length > item.parts.length) {
                  domStyle.parts.length = item.parts.length;
                }
              } else {
                var parts = [];
                for (var j = 0; j < item.parts.length; j++) {
                  parts.push(addStyle(item.parts[j]));
                }
                stylesInDom[item.id] = { id: item.id, refs: 1, parts };
              }
            }
          }
          function createStyleElement() {
            var styleElement = document.createElement("style");
            styleElement.type = "text/css";
            head.appendChild(styleElement);
            return styleElement;
          }
          function addStyle(obj) {
            var update, remove;
            var styleElement = document.querySelector("style[" + ssrIdKey + '~="' + obj.id + '"]');
            if (styleElement) {
              if (isProduction) {
                return noop;
              } else {
                styleElement.parentNode.removeChild(styleElement);
              }
            }
            if (isOldIE) {
              var styleIndex = singletonCounter++;
              styleElement = singletonElement || (singletonElement = createStyleElement());
              update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
              remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
            } else {
              styleElement = createStyleElement();
              update = applyToTag.bind(null, styleElement);
              remove = function() {
                styleElement.parentNode.removeChild(styleElement);
              };
            }
            update(obj);
            return function updateStyle(newObj) {
              if (newObj) {
                if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
                  return;
                }
                update(obj = newObj);
              } else {
                remove();
              }
            };
          }
          var replaceText = /* @__PURE__ */ function() {
            var textStore = [];
            return function(index, replacement) {
              textStore[index] = replacement;
              return textStore.filter(Boolean).join("\n");
            };
          }();
          function applyToSingletonTag(styleElement, index, remove, obj) {
            var css = remove ? "" : obj.css;
            if (styleElement.styleSheet) {
              styleElement.styleSheet.cssText = replaceText(index, css);
            } else {
              var cssNode = document.createTextNode(css);
              var childNodes = styleElement.childNodes;
              if (childNodes[index]) styleElement.removeChild(childNodes[index]);
              if (childNodes.length) {
                styleElement.insertBefore(cssNode, childNodes[index]);
              } else {
                styleElement.appendChild(cssNode);
              }
            }
          }
          function applyToTag(styleElement, obj) {
            var css = obj.css;
            var media = obj.media;
            var sourceMap = obj.sourceMap;
            if (media) {
              styleElement.setAttribute("media", media);
            }
            if (options.ssrId) {
              styleElement.setAttribute(ssrIdKey, obj.id);
            }
            if (sourceMap) {
              css += "\n/*# sourceURL=" + sourceMap.sources[0] + " */";
              css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
            }
            if (styleElement.styleSheet) {
              styleElement.styleSheet.cssText = css;
            } else {
              while (styleElement.firstChild) {
                styleElement.removeChild(styleElement.firstChild);
              }
              styleElement.appendChild(document.createTextNode(css));
            }
          }
        }
      ),
      /***/
      "4a60": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var content = __webpack_require__("261e");
          if (typeof content === "string") content = [[module2.i, content, ""]];
          if (content.locals) module2.exports = content.locals;
          var add = __webpack_require__("499e").default;
          var update = add("34354984", content, true, { "sourceMap": false, "shadowMode": false });
        }
      ),
      /***/
      "4ae1": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var $ = __webpack_require__("23e7");
          var getBuiltIn = __webpack_require__("d066");
          var aFunction = __webpack_require__("1c0b");
          var anObject = __webpack_require__("825a");
          var isObject2 = __webpack_require__("861d");
          var create = __webpack_require__("7c73");
          var bind = __webpack_require__("0538");
          var fails = __webpack_require__("d039");
          var nativeConstruct = getBuiltIn("Reflect", "construct");
          var NEW_TARGET_BUG = fails(function() {
            function F() {
            }
            return !(nativeConstruct(function() {
            }, [], F) instanceof F);
          });
          var ARGS_BUG = !fails(function() {
            nativeConstruct(function() {
            });
          });
          var FORCED = NEW_TARGET_BUG || ARGS_BUG;
          $({ target: "Reflect", stat: true, forced: FORCED, sham: FORCED }, {
            construct: function construct(Target, args) {
              aFunction(Target);
              anObject(args);
              var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
              if (ARGS_BUG && !NEW_TARGET_BUG) return nativeConstruct(Target, args, newTarget);
              if (Target == newTarget) {
                switch (args.length) {
                  case 0:
                    return new Target();
                  case 1:
                    return new Target(args[0]);
                  case 2:
                    return new Target(args[0], args[1]);
                  case 3:
                    return new Target(args[0], args[1], args[2]);
                  case 4:
                    return new Target(args[0], args[1], args[2], args[3]);
                }
                var $args = [null];
                $args.push.apply($args, args);
                return new (bind.apply(Target, $args))();
              }
              var proto = newTarget.prototype;
              var instance = create(isObject2(proto) ? proto : Object.prototype);
              var result = Function.apply.call(Target, instance, args);
              return isObject2(result) ? result : instance;
            }
          });
        }
      ),
      /***/
      "4aea": (
        /***/
        function(module2, __webpack_exports__, __webpack_require__) {
          "use strict";
          var _vue_style_loader_index_js_ref_6_oneOf_1_0_css_loader_dist_cjs_js_ref_6_oneOf_1_1_vue_loader_v16_dist_stylePostLoader_js_postcss_loader_src_index_js_ref_6_oneOf_1_2_postcss_loader_src_index_js_ref_6_oneOf_1_3_quill_snow_css_vue_type_style_index_0_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("7781");
          var _vue_style_loader_index_js_ref_6_oneOf_1_0_css_loader_dist_cjs_js_ref_6_oneOf_1_1_vue_loader_v16_dist_stylePostLoader_js_postcss_loader_src_index_js_ref_6_oneOf_1_2_postcss_loader_src_index_js_ref_6_oneOf_1_3_quill_snow_css_vue_type_style_index_0_lang_css__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_vue_style_loader_index_js_ref_6_oneOf_1_0_css_loader_dist_cjs_js_ref_6_oneOf_1_1_vue_loader_v16_dist_stylePostLoader_js_postcss_loader_src_index_js_ref_6_oneOf_1_2_postcss_loader_src_index_js_ref_6_oneOf_1_3_quill_snow_css_vue_type_style_index_0_lang_css__WEBPACK_IMPORTED_MODULE_0__);
        }
      ),
      /***/
      "4d64": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var toIndexedObject = __webpack_require__("fc6a");
          var toLength = __webpack_require__("50c4");
          var toAbsoluteIndex = __webpack_require__("23cb");
          var createMethod = function(IS_INCLUDES) {
            return function($this, el, fromIndex) {
              var O = toIndexedObject($this);
              var length = toLength(O.length);
              var index = toAbsoluteIndex(fromIndex, length);
              var value;
              if (IS_INCLUDES && el != el) while (length > index) {
                value = O[index++];
                if (value != value) return true;
              }
              else for (; length > index; index++) {
                if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
              }
              return !IS_INCLUDES && -1;
            };
          };
          module2.exports = {
            // `Array.prototype.includes` method
            // https://tc39.github.io/ecma262/#sec-array.prototype.includes
            includes: createMethod(true),
            // `Array.prototype.indexOf` method
            // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
            indexOf: createMethod(false)
          };
        }
      ),
      /***/
      "4df4": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var bind = __webpack_require__("0366");
          var toObject = __webpack_require__("7b0b");
          var callWithSafeIterationClosing = __webpack_require__("9bdd");
          var isArrayIteratorMethod = __webpack_require__("e95a");
          var toLength = __webpack_require__("50c4");
          var createProperty = __webpack_require__("8418");
          var getIteratorMethod = __webpack_require__("35a1");
          module2.exports = function from(arrayLike) {
            var O = toObject(arrayLike);
            var C = typeof this == "function" ? this : Array;
            var argumentsLength = arguments.length;
            var mapfn = argumentsLength > 1 ? arguments[1] : void 0;
            var mapping = mapfn !== void 0;
            var iteratorMethod = getIteratorMethod(O);
            var index = 0;
            var length, result, step, iterator, next, value;
            if (mapping) mapfn = bind(mapfn, argumentsLength > 2 ? arguments[2] : void 0, 2);
            if (iteratorMethod != void 0 && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
              iterator = iteratorMethod.call(O);
              next = iterator.next;
              result = new C();
              for (; !(step = next.call(iterator)).done; index++) {
                value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
                createProperty(result, index, value);
              }
            } else {
              length = toLength(O.length);
              result = new C(length);
              for (; length > index; index++) {
                value = mapping ? mapfn(O[index], index) : O[index];
                createProperty(result, index, value);
              }
            }
            result.length = index;
            return result;
          };
        }
      ),
      /***/
      "50c4": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var toInteger = __webpack_require__("a691");
          var min = Math.min;
          module2.exports = function(argument) {
            return argument > 0 ? min(toInteger(argument), 9007199254740991) : 0;
          };
        }
      ),
      /***/
      "5135": (
        /***/
        function(module2, exports2) {
          var hasOwnProperty = {}.hasOwnProperty;
          module2.exports = function(it, key) {
            return hasOwnProperty.call(it, key);
          };
        }
      ),
      /***/
      "5692": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var IS_PURE = __webpack_require__("c430");
          var store = __webpack_require__("c6cd");
          (module2.exports = function(key, value) {
            return store[key] || (store[key] = value !== void 0 ? value : {});
          })("versions", []).push({
            version: "3.6.5",
            mode: IS_PURE ? "pure" : "global",
            copyright: "© 2020 Denis Pushkarev (zloirock.ru)"
          });
        }
      ),
      /***/
      "56ef": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var getBuiltIn = __webpack_require__("d066");
          var getOwnPropertyNamesModule = __webpack_require__("241c");
          var getOwnPropertySymbolsModule = __webpack_require__("7418");
          var anObject = __webpack_require__("825a");
          module2.exports = getBuiltIn("Reflect", "ownKeys") || function ownKeys(it) {
            var keys = getOwnPropertyNamesModule.f(anObject(it));
            var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
            return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
          };
        }
      ),
      /***/
      "5a34": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var isRegExp = __webpack_require__("44e7");
          module2.exports = function(it) {
            if (isRegExp(it)) {
              throw TypeError("The method doesn't accept regular expressions");
            }
            return it;
          };
        }
      ),
      /***/
      "5c6c": (
        /***/
        function(module2, exports2) {
          module2.exports = function(bitmap, value) {
            return {
              enumerable: !(bitmap & 1),
              configurable: !(bitmap & 2),
              writable: !(bitmap & 4),
              value
            };
          };
        }
      ),
      /***/
      "5d41": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var $ = __webpack_require__("23e7");
          var isObject2 = __webpack_require__("861d");
          var anObject = __webpack_require__("825a");
          var has = __webpack_require__("5135");
          var getOwnPropertyDescriptorModule = __webpack_require__("06cf");
          var getPrototypeOf = __webpack_require__("e163");
          function get(target, propertyKey) {
            var receiver = arguments.length < 3 ? target : arguments[2];
            var descriptor, prototype;
            if (anObject(target) === receiver) return target[propertyKey];
            if (descriptor = getOwnPropertyDescriptorModule.f(target, propertyKey)) return has(descriptor, "value") ? descriptor.value : descriptor.get === void 0 ? void 0 : descriptor.get.call(receiver);
            if (isObject2(prototype = getPrototypeOf(target))) return get(prototype, propertyKey, receiver);
          }
          $({ target: "Reflect", stat: true }, {
            get
          });
        }
      ),
      /***/
      "60da": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var DESCRIPTORS = __webpack_require__("83ab");
          var fails = __webpack_require__("d039");
          var objectKeys = __webpack_require__("df75");
          var getOwnPropertySymbolsModule = __webpack_require__("7418");
          var propertyIsEnumerableModule = __webpack_require__("d1e7");
          var toObject = __webpack_require__("7b0b");
          var IndexedObject = __webpack_require__("44ad");
          var nativeAssign = Object.assign;
          var defineProperty = Object.defineProperty;
          module2.exports = !nativeAssign || fails(function() {
            if (DESCRIPTORS && nativeAssign({ b: 1 }, nativeAssign(defineProperty({}, "a", {
              enumerable: true,
              get: function() {
                defineProperty(this, "b", {
                  value: 3,
                  enumerable: false
                });
              }
            }), { b: 2 })).b !== 1) return true;
            var A = {};
            var B = {};
            var symbol = Symbol();
            var alphabet = "abcdefghijklmnopqrst";
            A[symbol] = 7;
            alphabet.split("").forEach(function(chr) {
              B[chr] = chr;
            });
            return nativeAssign({}, A)[symbol] != 7 || objectKeys(nativeAssign({}, B)).join("") != alphabet;
          }) ? function assign(target, source) {
            var T = toObject(target);
            var argumentsLength = arguments.length;
            var index = 1;
            var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
            var propertyIsEnumerable = propertyIsEnumerableModule.f;
            while (argumentsLength > index) {
              var S = IndexedObject(arguments[index++]);
              var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
              var length = keys.length;
              var j = 0;
              var key;
              while (length > j) {
                key = keys[j++];
                if (!DESCRIPTORS || propertyIsEnumerable.call(S, key)) T[key] = S[key];
              }
            }
            return T;
          } : nativeAssign;
        }
      ),
      /***/
      "6547": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var toInteger = __webpack_require__("a691");
          var requireObjectCoercible = __webpack_require__("1d80");
          var createMethod = function(CONVERT_TO_STRING) {
            return function($this, pos) {
              var S = String(requireObjectCoercible($this));
              var position = toInteger(pos);
              var size = S.length;
              var first, second;
              if (position < 0 || position >= size) return CONVERT_TO_STRING ? "" : void 0;
              first = S.charCodeAt(position);
              return first < 55296 || first > 56319 || position + 1 === size || (second = S.charCodeAt(position + 1)) < 56320 || second > 57343 ? CONVERT_TO_STRING ? S.charAt(position) : first : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 55296 << 10) + (second - 56320) + 65536;
            };
          };
          module2.exports = {
            // `String.prototype.codePointAt` method
            // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
            codeAt: createMethod(false),
            // `String.prototype.at` method
            // https://github.com/mathiasbynens/String.prototype.at
            charAt: createMethod(true)
          };
        }
      ),
      /***/
      "65f0": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var isObject2 = __webpack_require__("861d");
          var isArray2 = __webpack_require__("e8b5");
          var wellKnownSymbol = __webpack_require__("b622");
          var SPECIES = wellKnownSymbol("species");
          module2.exports = function(originalArray, length) {
            var C;
            if (isArray2(originalArray)) {
              C = originalArray.constructor;
              if (typeof C == "function" && (C === Array || isArray2(C.prototype))) C = void 0;
              else if (isObject2(C)) {
                C = C[SPECIES];
                if (C === null) C = void 0;
              }
            }
            return new (C === void 0 ? Array : C)(length === 0 ? 0 : length);
          };
        }
      ),
      /***/
      "69de": (
        /***/
        function(module2, __webpack_exports__, __webpack_require__) {
          "use strict";
          var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_vue3_editor_scss_vue_type_style_index_1_lang_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4a60");
          var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_vue3_editor_scss_vue_type_style_index_1_lang_scss__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_vue3_editor_scss_vue_type_style_index_1_lang_scss__WEBPACK_IMPORTED_MODULE_0__);
        }
      ),
      /***/
      "69f3": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var NATIVE_WEAK_MAP = __webpack_require__("7f9a");
          var global = __webpack_require__("da84");
          var isObject2 = __webpack_require__("861d");
          var createNonEnumerableProperty = __webpack_require__("9112");
          var objectHas = __webpack_require__("5135");
          var sharedKey = __webpack_require__("f772");
          var hiddenKeys = __webpack_require__("d012");
          var WeakMap2 = global.WeakMap;
          var set, get, has;
          var enforce = function(it) {
            return has(it) ? get(it) : set(it, {});
          };
          var getterFor = function(TYPE) {
            return function(it) {
              var state;
              if (!isObject2(it) || (state = get(it)).type !== TYPE) {
                throw TypeError("Incompatible receiver, " + TYPE + " required");
              }
              return state;
            };
          };
          if (NATIVE_WEAK_MAP) {
            var store = new WeakMap2();
            var wmget = store.get;
            var wmhas = store.has;
            var wmset = store.set;
            set = function(it, metadata) {
              wmset.call(store, it, metadata);
              return metadata;
            };
            get = function(it) {
              return wmget.call(store, it) || {};
            };
            has = function(it) {
              return wmhas.call(store, it);
            };
          } else {
            var STATE = sharedKey("state");
            hiddenKeys[STATE] = true;
            set = function(it, metadata) {
              createNonEnumerableProperty(it, STATE, metadata);
              return metadata;
            };
            get = function(it) {
              return objectHas(it, STATE) ? it[STATE] : {};
            };
            has = function(it) {
              return objectHas(it, STATE);
            };
          }
          module2.exports = {
            set,
            get,
            has,
            enforce,
            getterFor
          };
        }
      ),
      /***/
      "6c81": (
        /***/
        function(module2, exports2) {
          module2.exports = require_quill();
        }
      ),
      /***/
      "6eeb": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var global = __webpack_require__("da84");
          var createNonEnumerableProperty = __webpack_require__("9112");
          var has = __webpack_require__("5135");
          var setGlobal = __webpack_require__("ce4e");
          var inspectSource = __webpack_require__("8925");
          var InternalStateModule = __webpack_require__("69f3");
          var getInternalState = InternalStateModule.get;
          var enforceInternalState = InternalStateModule.enforce;
          var TEMPLATE = String(String).split("String");
          (module2.exports = function(O, key, value, options) {
            var unsafe = options ? !!options.unsafe : false;
            var simple = options ? !!options.enumerable : false;
            var noTargetGet = options ? !!options.noTargetGet : false;
            if (typeof value == "function") {
              if (typeof key == "string" && !has(value, "name")) createNonEnumerableProperty(value, "name", key);
              enforceInternalState(value).source = TEMPLATE.join(typeof key == "string" ? key : "");
            }
            if (O === global) {
              if (simple) O[key] = value;
              else setGlobal(key, value);
              return;
            } else if (!unsafe) {
              delete O[key];
            } else if (!noTargetGet && O[key]) {
              simple = true;
            }
            if (simple) O[key] = value;
            else createNonEnumerableProperty(O, key, value);
          })(Function.prototype, "toString", function toString() {
            return typeof this == "function" && getInternalState(this).source || inspectSource(this);
          });
        }
      ),
      /***/
      "7418": (
        /***/
        function(module2, exports2) {
          exports2.f = Object.getOwnPropertySymbols;
        }
      ),
      /***/
      "746f": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var path = __webpack_require__("428f");
          var has = __webpack_require__("5135");
          var wrappedWellKnownSymbolModule = __webpack_require__("e538");
          var defineProperty = __webpack_require__("9bf2").f;
          module2.exports = function(NAME) {
            var Symbol2 = path.Symbol || (path.Symbol = {});
            if (!has(Symbol2, NAME)) defineProperty(Symbol2, NAME, {
              value: wrappedWellKnownSymbolModule.f(NAME)
            });
          };
        }
      ),
      /***/
      "7781": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var content = __webpack_require__("0d26");
          if (typeof content === "string") content = [[module2.i, content, ""]];
          if (content.locals) module2.exports = content.locals;
          var add = __webpack_require__("499e").default;
          var update = add("147ee04a", content, true, { "sourceMap": false, "shadowMode": false });
        }
      ),
      /***/
      "7839": (
        /***/
        function(module2, exports2) {
          module2.exports = [
            "constructor",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "toLocaleString",
            "toString",
            "valueOf"
          ];
        }
      ),
      /***/
      "7b0b": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var requireObjectCoercible = __webpack_require__("1d80");
          module2.exports = function(argument) {
            return Object(requireObjectCoercible(argument));
          };
        }
      ),
      /***/
      "7c73": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var anObject = __webpack_require__("825a");
          var defineProperties = __webpack_require__("37e8");
          var enumBugKeys = __webpack_require__("7839");
          var hiddenKeys = __webpack_require__("d012");
          var html = __webpack_require__("1be4");
          var documentCreateElement = __webpack_require__("cc12");
          var sharedKey = __webpack_require__("f772");
          var GT = ">";
          var LT = "<";
          var PROTOTYPE = "prototype";
          var SCRIPT = "script";
          var IE_PROTO = sharedKey("IE_PROTO");
          var EmptyConstructor = function() {
          };
          var scriptTag = function(content) {
            return LT + SCRIPT + GT + content + LT + "/" + SCRIPT + GT;
          };
          var NullProtoObjectViaActiveX = function(activeXDocument2) {
            activeXDocument2.write(scriptTag(""));
            activeXDocument2.close();
            var temp = activeXDocument2.parentWindow.Object;
            activeXDocument2 = null;
            return temp;
          };
          var NullProtoObjectViaIFrame = function() {
            var iframe = documentCreateElement("iframe");
            var JS = "java" + SCRIPT + ":";
            var iframeDocument;
            iframe.style.display = "none";
            html.appendChild(iframe);
            iframe.src = String(JS);
            iframeDocument = iframe.contentWindow.document;
            iframeDocument.open();
            iframeDocument.write(scriptTag("document.F=Object"));
            iframeDocument.close();
            return iframeDocument.F;
          };
          var activeXDocument;
          var NullProtoObject = function() {
            try {
              activeXDocument = document.domain && new ActiveXObject("htmlfile");
            } catch (error) {
            }
            NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
            var length = enumBugKeys.length;
            while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
            return NullProtoObject();
          };
          hiddenKeys[IE_PROTO] = true;
          module2.exports = Object.create || function create(O, Properties) {
            var result;
            if (O !== null) {
              EmptyConstructor[PROTOTYPE] = anObject(O);
              result = new EmptyConstructor();
              EmptyConstructor[PROTOTYPE] = null;
              result[IE_PROTO] = O;
            } else result = NullProtoObject();
            return Properties === void 0 ? result : defineProperties(result, Properties);
          };
        }
      ),
      /***/
      "7dd0": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var $ = __webpack_require__("23e7");
          var createIteratorConstructor = __webpack_require__("9ed3");
          var getPrototypeOf = __webpack_require__("e163");
          var setPrototypeOf = __webpack_require__("d2bb");
          var setToStringTag = __webpack_require__("d44e");
          var createNonEnumerableProperty = __webpack_require__("9112");
          var redefine = __webpack_require__("6eeb");
          var wellKnownSymbol = __webpack_require__("b622");
          var IS_PURE = __webpack_require__("c430");
          var Iterators = __webpack_require__("3f8c");
          var IteratorsCore = __webpack_require__("ae93");
          var IteratorPrototype = IteratorsCore.IteratorPrototype;
          var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
          var ITERATOR = wellKnownSymbol("iterator");
          var KEYS = "keys";
          var VALUES = "values";
          var ENTRIES = "entries";
          var returnThis = function() {
            return this;
          };
          module2.exports = function(Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
            createIteratorConstructor(IteratorConstructor, NAME, next);
            var getIterationMethod = function(KIND) {
              if (KIND === DEFAULT && defaultIterator) return defaultIterator;
              if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
              switch (KIND) {
                case KEYS:
                  return function keys() {
                    return new IteratorConstructor(this, KIND);
                  };
                case VALUES:
                  return function values() {
                    return new IteratorConstructor(this, KIND);
                  };
                case ENTRIES:
                  return function entries() {
                    return new IteratorConstructor(this, KIND);
                  };
              }
              return function() {
                return new IteratorConstructor(this);
              };
            };
            var TO_STRING_TAG = NAME + " Iterator";
            var INCORRECT_VALUES_NAME = false;
            var IterablePrototype = Iterable.prototype;
            var nativeIterator = IterablePrototype[ITERATOR] || IterablePrototype["@@iterator"] || DEFAULT && IterablePrototype[DEFAULT];
            var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
            var anyNativeIterator = NAME == "Array" ? IterablePrototype.entries || nativeIterator : nativeIterator;
            var CurrentIteratorPrototype, methods, KEY;
            if (anyNativeIterator) {
              CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
              if (IteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
                if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
                  if (setPrototypeOf) {
                    setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
                  } else if (typeof CurrentIteratorPrototype[ITERATOR] != "function") {
                    createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR, returnThis);
                  }
                }
                setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
                if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
              }
            }
            if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
              INCORRECT_VALUES_NAME = true;
              defaultIterator = function values() {
                return nativeIterator.call(this);
              };
            }
            if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
              createNonEnumerableProperty(IterablePrototype, ITERATOR, defaultIterator);
            }
            Iterators[NAME] = defaultIterator;
            if (DEFAULT) {
              methods = {
                values: getIterationMethod(VALUES),
                keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
                entries: getIterationMethod(ENTRIES)
              };
              if (FORCED) for (KEY in methods) {
                if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
                  redefine(IterablePrototype, KEY, methods[KEY]);
                }
              }
              else $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
            }
            return methods;
          };
        }
      ),
      /***/
      "7f9a": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var global = __webpack_require__("da84");
          var inspectSource = __webpack_require__("8925");
          var WeakMap2 = global.WeakMap;
          module2.exports = typeof WeakMap2 === "function" && /native code/.test(inspectSource(WeakMap2));
        }
      ),
      /***/
      "825a": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var isObject2 = __webpack_require__("861d");
          module2.exports = function(it) {
            if (!isObject2(it)) {
              throw TypeError(String(it) + " is not an object");
            }
            return it;
          };
        }
      ),
      /***/
      "83ab": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var fails = __webpack_require__("d039");
          module2.exports = !fails(function() {
            return Object.defineProperty({}, 1, { get: function() {
              return 7;
            } })[1] != 7;
          });
        }
      ),
      /***/
      "8418": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var toPrimitive = __webpack_require__("c04e");
          var definePropertyModule = __webpack_require__("9bf2");
          var createPropertyDescriptor = __webpack_require__("5c6c");
          module2.exports = function(object, key, value) {
            var propertyKey = toPrimitive(key);
            if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));
            else object[propertyKey] = value;
          };
        }
      ),
      /***/
      "841c": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var fixRegExpWellKnownSymbolLogic = __webpack_require__("d784");
          var anObject = __webpack_require__("825a");
          var requireObjectCoercible = __webpack_require__("1d80");
          var sameValue = __webpack_require__("129f");
          var regExpExec = __webpack_require__("14c3");
          fixRegExpWellKnownSymbolLogic("search", 1, function(SEARCH, nativeSearch, maybeCallNative) {
            return [
              // `String.prototype.search` method
              // https://tc39.github.io/ecma262/#sec-string.prototype.search
              function search(regexp) {
                var O = requireObjectCoercible(this);
                var searcher = regexp == void 0 ? void 0 : regexp[SEARCH];
                return searcher !== void 0 ? searcher.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
              },
              // `RegExp.prototype[@@search]` method
              // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@search
              function(regexp) {
                var res = maybeCallNative(nativeSearch, regexp, this);
                if (res.done) return res.value;
                var rx = anObject(regexp);
                var S = String(this);
                var previousLastIndex = rx.lastIndex;
                if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
                var result = regExpExec(rx, S);
                if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
                return result === null ? -1 : result.index;
              }
            ];
          });
        }
      ),
      /***/
      "861d": (
        /***/
        function(module2, exports2) {
          module2.exports = function(it) {
            return typeof it === "object" ? it !== null : typeof it === "function";
          };
        }
      ),
      /***/
      "8875": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
          (function(root, factory) {
            if (true) {
              !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = factory, __WEBPACK_AMD_DEFINE_RESULT__ = typeof __WEBPACK_AMD_DEFINE_FACTORY__ === "function" ? __WEBPACK_AMD_DEFINE_FACTORY__.apply(exports2, __WEBPACK_AMD_DEFINE_ARRAY__) : __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__ !== void 0 && (module2.exports = __WEBPACK_AMD_DEFINE_RESULT__));
            } else {
            }
          })(typeof self !== "undefined" ? self : this, function() {
            function getCurrentScript() {
              var descriptor = Object.getOwnPropertyDescriptor(document, "currentScript");
              if (!descriptor && "currentScript" in document && document.currentScript) {
                return document.currentScript;
              }
              if (descriptor && descriptor.get !== getCurrentScript && document.currentScript) {
                return document.currentScript;
              }
              try {
                throw new Error();
              } catch (err) {
                var ieStackRegExp = /.*at [^(]*\((.*):(.+):(.+)\)$/ig, ffStackRegExp = /@([^@]*):(\d+):(\d+)\s*$/ig, stackDetails = ieStackRegExp.exec(err.stack) || ffStackRegExp.exec(err.stack), scriptLocation = stackDetails && stackDetails[1] || false, line = stackDetails && stackDetails[2] || false, currentLocation = document.location.href.replace(document.location.hash, ""), pageSource, inlineScriptSourceRegExp, inlineScriptSource, scripts = document.getElementsByTagName("script");
                if (scriptLocation === currentLocation) {
                  pageSource = document.documentElement.outerHTML;
                  inlineScriptSourceRegExp = new RegExp("(?:[^\\n]+?\\n){0," + (line - 2) + "}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*", "i");
                  inlineScriptSource = pageSource.replace(inlineScriptSourceRegExp, "$1").trim();
                }
                for (var i = 0; i < scripts.length; i++) {
                  if (scripts[i].readyState === "interactive") {
                    return scripts[i];
                  }
                  if (scripts[i].src === scriptLocation) {
                    return scripts[i];
                  }
                  if (scriptLocation === currentLocation && scripts[i].innerHTML && scripts[i].innerHTML.trim() === inlineScriptSource) {
                    return scripts[i];
                  }
                }
                return null;
              }
            }
            ;
            return getCurrentScript;
          });
        }
      ),
      /***/
      "8925": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var store = __webpack_require__("c6cd");
          var functionToString = Function.toString;
          if (typeof store.inspectSource != "function") {
            store.inspectSource = function(it) {
              return functionToString.call(it);
            };
          }
          module2.exports = store.inspectSource;
        }
      ),
      /***/
      "8aa5": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var charAt = __webpack_require__("6547").charAt;
          module2.exports = function(S, index, unicode) {
            return index + (unicode ? charAt(S, index).length : 1);
          };
        }
      ),
      /***/
      "8bbf": (
        /***/
        function(module2, exports2) {
          module2.exports = require_vue();
        }
      ),
      /***/
      "90e3": (
        /***/
        function(module2, exports2) {
          var id = 0;
          var postfix = Math.random();
          module2.exports = function(key) {
            return "Symbol(" + String(key === void 0 ? "" : key) + ")_" + (++id + postfix).toString(36);
          };
        }
      ),
      /***/
      "9112": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var DESCRIPTORS = __webpack_require__("83ab");
          var definePropertyModule = __webpack_require__("9bf2");
          var createPropertyDescriptor = __webpack_require__("5c6c");
          module2.exports = DESCRIPTORS ? function(object, key, value) {
            return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
          } : function(object, key, value) {
            object[key] = value;
            return object;
          };
        }
      ),
      /***/
      "9263": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var regexpFlags = __webpack_require__("ad6d");
          var stickyHelpers = __webpack_require__("9f7f");
          var nativeExec = RegExp.prototype.exec;
          var nativeReplace = String.prototype.replace;
          var patchedExec = nativeExec;
          var UPDATES_LAST_INDEX_WRONG = function() {
            var re1 = /a/;
            var re2 = /b*/g;
            nativeExec.call(re1, "a");
            nativeExec.call(re2, "a");
            return re1.lastIndex !== 0 || re2.lastIndex !== 0;
          }();
          var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y || stickyHelpers.BROKEN_CARET;
          var NPCG_INCLUDED = /()??/.exec("")[1] !== void 0;
          var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y;
          if (PATCH) {
            patchedExec = function exec(str) {
              var re = this;
              var lastIndex, reCopy, match, i;
              var sticky = UNSUPPORTED_Y && re.sticky;
              var flags = regexpFlags.call(re);
              var source = re.source;
              var charsAdded = 0;
              var strCopy = str;
              if (sticky) {
                flags = flags.replace("y", "");
                if (flags.indexOf("g") === -1) {
                  flags += "g";
                }
                strCopy = String(str).slice(re.lastIndex);
                if (re.lastIndex > 0 && (!re.multiline || re.multiline && str[re.lastIndex - 1] !== "\n")) {
                  source = "(?: " + source + ")";
                  strCopy = " " + strCopy;
                  charsAdded++;
                }
                reCopy = new RegExp("^(?:" + source + ")", flags);
              }
              if (NPCG_INCLUDED) {
                reCopy = new RegExp("^" + source + "$(?!\\s)", flags);
              }
              if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;
              match = nativeExec.call(sticky ? reCopy : re, strCopy);
              if (sticky) {
                if (match) {
                  match.input = match.input.slice(charsAdded);
                  match[0] = match[0].slice(charsAdded);
                  match.index = re.lastIndex;
                  re.lastIndex += match[0].length;
                } else re.lastIndex = 0;
              } else if (UPDATES_LAST_INDEX_WRONG && match) {
                re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
              }
              if (NPCG_INCLUDED && match && match.length > 1) {
                nativeReplace.call(match[0], reCopy, function() {
                  for (i = 1; i < arguments.length - 2; i++) {
                    if (arguments[i] === void 0) match[i] = void 0;
                  }
                });
              }
              return match;
            };
          }
          module2.exports = patchedExec;
        }
      ),
      /***/
      "94ca": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var fails = __webpack_require__("d039");
          var replacement = /#|\.prototype\./;
          var isForced = function(feature, detection) {
            var value = data[normalize(feature)];
            return value == POLYFILL ? true : value == NATIVE ? false : typeof detection == "function" ? fails(detection) : !!detection;
          };
          var normalize = isForced.normalize = function(string) {
            return String(string).replace(replacement, ".").toLowerCase();
          };
          var data = isForced.data = {};
          var NATIVE = isForced.NATIVE = "N";
          var POLYFILL = isForced.POLYFILL = "P";
          module2.exports = isForced;
        }
      ),
      /***/
      "99af": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var $ = __webpack_require__("23e7");
          var fails = __webpack_require__("d039");
          var isArray2 = __webpack_require__("e8b5");
          var isObject2 = __webpack_require__("861d");
          var toObject = __webpack_require__("7b0b");
          var toLength = __webpack_require__("50c4");
          var createProperty = __webpack_require__("8418");
          var arraySpeciesCreate = __webpack_require__("65f0");
          var arrayMethodHasSpeciesSupport = __webpack_require__("1dde");
          var wellKnownSymbol = __webpack_require__("b622");
          var V8_VERSION = __webpack_require__("2d00");
          var IS_CONCAT_SPREADABLE = wellKnownSymbol("isConcatSpreadable");
          var MAX_SAFE_INTEGER = 9007199254740991;
          var MAXIMUM_ALLOWED_INDEX_EXCEEDED = "Maximum allowed index exceeded";
          var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION >= 51 || !fails(function() {
            var array = [];
            array[IS_CONCAT_SPREADABLE] = false;
            return array.concat()[0] !== array;
          });
          var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport("concat");
          var isConcatSpreadable = function(O) {
            if (!isObject2(O)) return false;
            var spreadable = O[IS_CONCAT_SPREADABLE];
            return spreadable !== void 0 ? !!spreadable : isArray2(O);
          };
          var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;
          $({ target: "Array", proto: true, forced: FORCED }, {
            concat: function concat(arg) {
              var O = toObject(this);
              var A = arraySpeciesCreate(O, 0);
              var n = 0;
              var i, k, length, len, E;
              for (i = -1, length = arguments.length; i < length; i++) {
                E = i === -1 ? O : arguments[i];
                if (isConcatSpreadable(E)) {
                  len = toLength(E.length);
                  if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
                  for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
                } else {
                  if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
                  createProperty(A, n++, E);
                }
              }
              A.length = n;
              return A;
            }
          });
        }
      ),
      /***/
      "9bdd": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var anObject = __webpack_require__("825a");
          module2.exports = function(iterator, fn, value, ENTRIES) {
            try {
              return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
            } catch (error) {
              var returnMethod = iterator["return"];
              if (returnMethod !== void 0) anObject(returnMethod.call(iterator));
              throw error;
            }
          };
        }
      ),
      /***/
      "9bf2": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var DESCRIPTORS = __webpack_require__("83ab");
          var IE8_DOM_DEFINE = __webpack_require__("0cfb");
          var anObject = __webpack_require__("825a");
          var toPrimitive = __webpack_require__("c04e");
          var nativeDefineProperty = Object.defineProperty;
          exports2.f = DESCRIPTORS ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
            anObject(O);
            P = toPrimitive(P, true);
            anObject(Attributes);
            if (IE8_DOM_DEFINE) try {
              return nativeDefineProperty(O, P, Attributes);
            } catch (error) {
            }
            if ("get" in Attributes || "set" in Attributes) throw TypeError("Accessors not supported");
            if ("value" in Attributes) O[P] = Attributes.value;
            return O;
          };
        }
      ),
      /***/
      "9ed3": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var IteratorPrototype = __webpack_require__("ae93").IteratorPrototype;
          var create = __webpack_require__("7c73");
          var createPropertyDescriptor = __webpack_require__("5c6c");
          var setToStringTag = __webpack_require__("d44e");
          var Iterators = __webpack_require__("3f8c");
          var returnThis = function() {
            return this;
          };
          module2.exports = function(IteratorConstructor, NAME, next) {
            var TO_STRING_TAG = NAME + " Iterator";
            IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(1, next) });
            setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
            Iterators[TO_STRING_TAG] = returnThis;
            return IteratorConstructor;
          };
        }
      ),
      /***/
      "9f7f": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var fails = __webpack_require__("d039");
          function RE(s, f) {
            return RegExp(s, f);
          }
          exports2.UNSUPPORTED_Y = fails(function() {
            var re = RE("a", "y");
            re.lastIndex = 2;
            return re.exec("abcd") != null;
          });
          exports2.BROKEN_CARET = fails(function() {
            var re = RE("^r", "gy");
            re.lastIndex = 2;
            return re.exec("str") != null;
          });
        }
      ),
      /***/
      "a4d3": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var $ = __webpack_require__("23e7");
          var global = __webpack_require__("da84");
          var getBuiltIn = __webpack_require__("d066");
          var IS_PURE = __webpack_require__("c430");
          var DESCRIPTORS = __webpack_require__("83ab");
          var NATIVE_SYMBOL = __webpack_require__("4930");
          var USE_SYMBOL_AS_UID = __webpack_require__("fdbf");
          var fails = __webpack_require__("d039");
          var has = __webpack_require__("5135");
          var isArray2 = __webpack_require__("e8b5");
          var isObject2 = __webpack_require__("861d");
          var anObject = __webpack_require__("825a");
          var toObject = __webpack_require__("7b0b");
          var toIndexedObject = __webpack_require__("fc6a");
          var toPrimitive = __webpack_require__("c04e");
          var createPropertyDescriptor = __webpack_require__("5c6c");
          var nativeObjectCreate = __webpack_require__("7c73");
          var objectKeys = __webpack_require__("df75");
          var getOwnPropertyNamesModule = __webpack_require__("241c");
          var getOwnPropertyNamesExternal = __webpack_require__("057f");
          var getOwnPropertySymbolsModule = __webpack_require__("7418");
          var getOwnPropertyDescriptorModule = __webpack_require__("06cf");
          var definePropertyModule = __webpack_require__("9bf2");
          var propertyIsEnumerableModule = __webpack_require__("d1e7");
          var createNonEnumerableProperty = __webpack_require__("9112");
          var redefine = __webpack_require__("6eeb");
          var shared = __webpack_require__("5692");
          var sharedKey = __webpack_require__("f772");
          var hiddenKeys = __webpack_require__("d012");
          var uid = __webpack_require__("90e3");
          var wellKnownSymbol = __webpack_require__("b622");
          var wrappedWellKnownSymbolModule = __webpack_require__("e538");
          var defineWellKnownSymbol = __webpack_require__("746f");
          var setToStringTag = __webpack_require__("d44e");
          var InternalStateModule = __webpack_require__("69f3");
          var $forEach = __webpack_require__("b727").forEach;
          var HIDDEN = sharedKey("hidden");
          var SYMBOL = "Symbol";
          var PROTOTYPE = "prototype";
          var TO_PRIMITIVE = wellKnownSymbol("toPrimitive");
          var setInternalState = InternalStateModule.set;
          var getInternalState = InternalStateModule.getterFor(SYMBOL);
          var ObjectPrototype = Object[PROTOTYPE];
          var $Symbol = global.Symbol;
          var $stringify = getBuiltIn("JSON", "stringify");
          var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
          var nativeDefineProperty = definePropertyModule.f;
          var nativeGetOwnPropertyNames = getOwnPropertyNamesExternal.f;
          var nativePropertyIsEnumerable = propertyIsEnumerableModule.f;
          var AllSymbols = shared("symbols");
          var ObjectPrototypeSymbols = shared("op-symbols");
          var StringToSymbolRegistry = shared("string-to-symbol-registry");
          var SymbolToStringRegistry = shared("symbol-to-string-registry");
          var WellKnownSymbolsStore = shared("wks");
          var QObject = global.QObject;
          var USE_SETTER = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;
          var setSymbolDescriptor = DESCRIPTORS && fails(function() {
            return nativeObjectCreate(nativeDefineProperty({}, "a", {
              get: function() {
                return nativeDefineProperty(this, "a", { value: 7 }).a;
              }
            })).a != 7;
          }) ? function(O, P, Attributes) {
            var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype, P);
            if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
            nativeDefineProperty(O, P, Attributes);
            if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
              nativeDefineProperty(ObjectPrototype, P, ObjectPrototypeDescriptor);
            }
          } : nativeDefineProperty;
          var wrap = function(tag, description) {
            var symbol = AllSymbols[tag] = nativeObjectCreate($Symbol[PROTOTYPE]);
            setInternalState(symbol, {
              type: SYMBOL,
              tag,
              description
            });
            if (!DESCRIPTORS) symbol.description = description;
            return symbol;
          };
          var isSymbol2 = USE_SYMBOL_AS_UID ? function(it) {
            return typeof it == "symbol";
          } : function(it) {
            return Object(it) instanceof $Symbol;
          };
          var $defineProperty = function defineProperty(O, P, Attributes) {
            if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
            anObject(O);
            var key = toPrimitive(P, true);
            anObject(Attributes);
            if (has(AllSymbols, key)) {
              if (!Attributes.enumerable) {
                if (!has(O, HIDDEN)) nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, {}));
                O[HIDDEN][key] = true;
              } else {
                if (has(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
                Attributes = nativeObjectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
              }
              return setSymbolDescriptor(O, key, Attributes);
            }
            return nativeDefineProperty(O, key, Attributes);
          };
          var $defineProperties = function defineProperties(O, Properties) {
            anObject(O);
            var properties = toIndexedObject(Properties);
            var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
            $forEach(keys, function(key) {
              if (!DESCRIPTORS || $propertyIsEnumerable.call(properties, key)) $defineProperty(O, key, properties[key]);
            });
            return O;
          };
          var $create = function create(O, Properties) {
            return Properties === void 0 ? nativeObjectCreate(O) : $defineProperties(nativeObjectCreate(O), Properties);
          };
          var $propertyIsEnumerable = function propertyIsEnumerable(V) {
            var P = toPrimitive(V, true);
            var enumerable = nativePropertyIsEnumerable.call(this, P);
            if (this === ObjectPrototype && has(AllSymbols, P) && !has(ObjectPrototypeSymbols, P)) return false;
            return enumerable || !has(this, P) || !has(AllSymbols, P) || has(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
          };
          var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
            var it = toIndexedObject(O);
            var key = toPrimitive(P, true);
            if (it === ObjectPrototype && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
            var descriptor = nativeGetOwnPropertyDescriptor(it, key);
            if (descriptor && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) {
              descriptor.enumerable = true;
            }
            return descriptor;
          };
          var $getOwnPropertyNames = function getOwnPropertyNames(O) {
            var names = nativeGetOwnPropertyNames(toIndexedObject(O));
            var result = [];
            $forEach(names, function(key) {
              if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key);
            });
            return result;
          };
          var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
            var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
            var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
            var result = [];
            $forEach(names, function(key) {
              if (has(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype, key))) {
                result.push(AllSymbols[key]);
              }
            });
            return result;
          };
          if (!NATIVE_SYMBOL) {
            $Symbol = function Symbol2() {
              if (this instanceof $Symbol) throw TypeError("Symbol is not a constructor");
              var description = !arguments.length || arguments[0] === void 0 ? void 0 : String(arguments[0]);
              var tag = uid(description);
              var setter = function(value) {
                if (this === ObjectPrototype) setter.call(ObjectPrototypeSymbols, value);
                if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
                setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
              };
              if (DESCRIPTORS && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
              return wrap(tag, description);
            };
            redefine($Symbol[PROTOTYPE], "toString", function toString() {
              return getInternalState(this).tag;
            });
            redefine($Symbol, "withoutSetter", function(description) {
              return wrap(uid(description), description);
            });
            propertyIsEnumerableModule.f = $propertyIsEnumerable;
            definePropertyModule.f = $defineProperty;
            getOwnPropertyDescriptorModule.f = $getOwnPropertyDescriptor;
            getOwnPropertyNamesModule.f = getOwnPropertyNamesExternal.f = $getOwnPropertyNames;
            getOwnPropertySymbolsModule.f = $getOwnPropertySymbols;
            wrappedWellKnownSymbolModule.f = function(name) {
              return wrap(wellKnownSymbol(name), name);
            };
            if (DESCRIPTORS) {
              nativeDefineProperty($Symbol[PROTOTYPE], "description", {
                configurable: true,
                get: function description() {
                  return getInternalState(this).description;
                }
              });
              if (!IS_PURE) {
                redefine(ObjectPrototype, "propertyIsEnumerable", $propertyIsEnumerable, { unsafe: true });
              }
            }
          }
          $({ global: true, wrap: true, forced: !NATIVE_SYMBOL, sham: !NATIVE_SYMBOL }, {
            Symbol: $Symbol
          });
          $forEach(objectKeys(WellKnownSymbolsStore), function(name) {
            defineWellKnownSymbol(name);
          });
          $({ target: SYMBOL, stat: true, forced: !NATIVE_SYMBOL }, {
            // `Symbol.for` method
            // https://tc39.github.io/ecma262/#sec-symbol.for
            "for": function(key) {
              var string = String(key);
              if (has(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
              var symbol = $Symbol(string);
              StringToSymbolRegistry[string] = symbol;
              SymbolToStringRegistry[symbol] = string;
              return symbol;
            },
            // `Symbol.keyFor` method
            // https://tc39.github.io/ecma262/#sec-symbol.keyfor
            keyFor: function keyFor(sym) {
              if (!isSymbol2(sym)) throw TypeError(sym + " is not a symbol");
              if (has(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
            },
            useSetter: function() {
              USE_SETTER = true;
            },
            useSimple: function() {
              USE_SETTER = false;
            }
          });
          $({ target: "Object", stat: true, forced: !NATIVE_SYMBOL, sham: !DESCRIPTORS }, {
            // `Object.create` method
            // https://tc39.github.io/ecma262/#sec-object.create
            create: $create,
            // `Object.defineProperty` method
            // https://tc39.github.io/ecma262/#sec-object.defineproperty
            defineProperty: $defineProperty,
            // `Object.defineProperties` method
            // https://tc39.github.io/ecma262/#sec-object.defineproperties
            defineProperties: $defineProperties,
            // `Object.getOwnPropertyDescriptor` method
            // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
            getOwnPropertyDescriptor: $getOwnPropertyDescriptor
          });
          $({ target: "Object", stat: true, forced: !NATIVE_SYMBOL }, {
            // `Object.getOwnPropertyNames` method
            // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
            getOwnPropertyNames: $getOwnPropertyNames,
            // `Object.getOwnPropertySymbols` method
            // https://tc39.github.io/ecma262/#sec-object.getownpropertysymbols
            getOwnPropertySymbols: $getOwnPropertySymbols
          });
          $({ target: "Object", stat: true, forced: fails(function() {
            getOwnPropertySymbolsModule.f(1);
          }) }, {
            getOwnPropertySymbols: function getOwnPropertySymbols(it) {
              return getOwnPropertySymbolsModule.f(toObject(it));
            }
          });
          if ($stringify) {
            var FORCED_JSON_STRINGIFY = !NATIVE_SYMBOL || fails(function() {
              var symbol = $Symbol();
              return $stringify([symbol]) != "[null]" || $stringify({ a: symbol }) != "{}" || $stringify(Object(symbol)) != "{}";
            });
            $({ target: "JSON", stat: true, forced: FORCED_JSON_STRINGIFY }, {
              // eslint-disable-next-line no-unused-vars
              stringify: function stringify(it, replacer, space) {
                var args = [it];
                var index = 1;
                var $replacer;
                while (arguments.length > index) args.push(arguments[index++]);
                $replacer = replacer;
                if (!isObject2(replacer) && it === void 0 || isSymbol2(it)) return;
                if (!isArray2(replacer)) replacer = function(key, value) {
                  if (typeof $replacer == "function") value = $replacer.call(this, key, value);
                  if (!isSymbol2(value)) return value;
                };
                args[1] = replacer;
                return $stringify.apply(null, args);
              }
            });
          }
          if (!$Symbol[PROTOTYPE][TO_PRIMITIVE]) {
            createNonEnumerableProperty($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
          }
          setToStringTag($Symbol, SYMBOL);
          hiddenKeys[HIDDEN] = true;
        }
      ),
      /***/
      "a630": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var $ = __webpack_require__("23e7");
          var from = __webpack_require__("4df4");
          var checkCorrectnessOfIteration = __webpack_require__("1c7e");
          var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function(iterable) {
            Array.from(iterable);
          });
          $({ target: "Array", stat: true, forced: INCORRECT_ITERATION }, {
            from
          });
        }
      ),
      /***/
      "a640": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var fails = __webpack_require__("d039");
          module2.exports = function(METHOD_NAME, argument) {
            var method = [][METHOD_NAME];
            return !!method && fails(function() {
              method.call(null, argument || function() {
                throw 1;
              }, 1);
            });
          };
        }
      ),
      /***/
      "a691": (
        /***/
        function(module2, exports2) {
          var ceil = Math.ceil;
          var floor = Math.floor;
          module2.exports = function(argument) {
            return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
          };
        }
      ),
      /***/
      "ab13": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var wellKnownSymbol = __webpack_require__("b622");
          var MATCH = wellKnownSymbol("match");
          module2.exports = function(METHOD_NAME) {
            var regexp = /./;
            try {
              "/./"[METHOD_NAME](regexp);
            } catch (e) {
              try {
                regexp[MATCH] = false;
                return "/./"[METHOD_NAME](regexp);
              } catch (f) {
              }
            }
            return false;
          };
        }
      ),
      /***/
      "ac1f": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var $ = __webpack_require__("23e7");
          var exec = __webpack_require__("9263");
          $({ target: "RegExp", proto: true, forced: /./.exec !== exec }, {
            exec
          });
        }
      ),
      /***/
      "ad6d": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var anObject = __webpack_require__("825a");
          module2.exports = function() {
            var that = anObject(this);
            var result = "";
            if (that.global) result += "g";
            if (that.ignoreCase) result += "i";
            if (that.multiline) result += "m";
            if (that.dotAll) result += "s";
            if (that.unicode) result += "u";
            if (that.sticky) result += "y";
            return result;
          };
        }
      ),
      /***/
      "ae40": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var DESCRIPTORS = __webpack_require__("83ab");
          var fails = __webpack_require__("d039");
          var has = __webpack_require__("5135");
          var defineProperty = Object.defineProperty;
          var cache = {};
          var thrower = function(it) {
            throw it;
          };
          module2.exports = function(METHOD_NAME, options) {
            if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
            if (!options) options = {};
            var method = [][METHOD_NAME];
            var ACCESSORS = has(options, "ACCESSORS") ? options.ACCESSORS : false;
            var argument0 = has(options, 0) ? options[0] : thrower;
            var argument1 = has(options, 1) ? options[1] : void 0;
            return cache[METHOD_NAME] = !!method && !fails(function() {
              if (ACCESSORS && !DESCRIPTORS) return true;
              var O = { length: -1 };
              if (ACCESSORS) defineProperty(O, 1, { enumerable: true, get: thrower });
              else O[1] = 1;
              method.call(O, argument0, argument1);
            });
          };
        }
      ),
      /***/
      "ae93": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var getPrototypeOf = __webpack_require__("e163");
          var createNonEnumerableProperty = __webpack_require__("9112");
          var has = __webpack_require__("5135");
          var wellKnownSymbol = __webpack_require__("b622");
          var IS_PURE = __webpack_require__("c430");
          var ITERATOR = wellKnownSymbol("iterator");
          var BUGGY_SAFARI_ITERATORS = false;
          var returnThis = function() {
            return this;
          };
          var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;
          if ([].keys) {
            arrayIterator = [].keys();
            if (!("next" in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
            else {
              PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
              if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
            }
          }
          if (IteratorPrototype == void 0) IteratorPrototype = {};
          if (!IS_PURE && !has(IteratorPrototype, ITERATOR)) {
            createNonEnumerableProperty(IteratorPrototype, ITERATOR, returnThis);
          }
          module2.exports = {
            IteratorPrototype,
            BUGGY_SAFARI_ITERATORS
          };
        }
      ),
      /***/
      "b041": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var TO_STRING_TAG_SUPPORT = __webpack_require__("00ee");
          var classof = __webpack_require__("f5df");
          module2.exports = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {
            return "[object " + classof(this) + "]";
          };
        }
      ),
      /***/
      "b0c0": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var DESCRIPTORS = __webpack_require__("83ab");
          var defineProperty = __webpack_require__("9bf2").f;
          var FunctionPrototype = Function.prototype;
          var FunctionPrototypeToString = FunctionPrototype.toString;
          var nameRE = /^\s*function ([^ (]*)/;
          var NAME = "name";
          if (DESCRIPTORS && !(NAME in FunctionPrototype)) {
            defineProperty(FunctionPrototype, NAME, {
              configurable: true,
              get: function() {
                try {
                  return FunctionPrototypeToString.call(this).match(nameRE)[1];
                } catch (error) {
                  return "";
                }
              }
            });
          }
        }
      ),
      /***/
      "b622": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var global = __webpack_require__("da84");
          var shared = __webpack_require__("5692");
          var has = __webpack_require__("5135");
          var uid = __webpack_require__("90e3");
          var NATIVE_SYMBOL = __webpack_require__("4930");
          var USE_SYMBOL_AS_UID = __webpack_require__("fdbf");
          var WellKnownSymbolsStore = shared("wks");
          var Symbol2 = global.Symbol;
          var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol2 : Symbol2 && Symbol2.withoutSetter || uid;
          module2.exports = function(name) {
            if (!has(WellKnownSymbolsStore, name)) {
              if (NATIVE_SYMBOL && has(Symbol2, name)) WellKnownSymbolsStore[name] = Symbol2[name];
              else WellKnownSymbolsStore[name] = createWellKnownSymbol("Symbol." + name);
            }
            return WellKnownSymbolsStore[name];
          };
        }
      ),
      /***/
      "b64b": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var $ = __webpack_require__("23e7");
          var toObject = __webpack_require__("7b0b");
          var nativeKeys = __webpack_require__("df75");
          var fails = __webpack_require__("d039");
          var FAILS_ON_PRIMITIVES = fails(function() {
            nativeKeys(1);
          });
          $({ target: "Object", stat: true, forced: FAILS_ON_PRIMITIVES }, {
            keys: function keys(it) {
              return nativeKeys(toObject(it));
            }
          });
        }
      ),
      /***/
      "b727": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var bind = __webpack_require__("0366");
          var IndexedObject = __webpack_require__("44ad");
          var toObject = __webpack_require__("7b0b");
          var toLength = __webpack_require__("50c4");
          var arraySpeciesCreate = __webpack_require__("65f0");
          var push = [].push;
          var createMethod = function(TYPE) {
            var IS_MAP = TYPE == 1;
            var IS_FILTER = TYPE == 2;
            var IS_SOME = TYPE == 3;
            var IS_EVERY = TYPE == 4;
            var IS_FIND_INDEX = TYPE == 6;
            var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
            return function($this, callbackfn, that, specificCreate) {
              var O = toObject($this);
              var self2 = IndexedObject(O);
              var boundFunction = bind(callbackfn, that, 3);
              var length = toLength(self2.length);
              var index = 0;
              var create = specificCreate || arraySpeciesCreate;
              var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : void 0;
              var value, result;
              for (; length > index; index++) if (NO_HOLES || index in self2) {
                value = self2[index];
                result = boundFunction(value, index, O);
                if (TYPE) {
                  if (IS_MAP) target[index] = result;
                  else if (result) switch (TYPE) {
                    case 3:
                      return true;
                    // some
                    case 5:
                      return value;
                    // find
                    case 6:
                      return index;
                    // findIndex
                    case 2:
                      push.call(target, value);
                  }
                  else if (IS_EVERY) return false;
                }
              }
              return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
            };
          };
          module2.exports = {
            // `Array.prototype.forEach` method
            // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
            forEach: createMethod(0),
            // `Array.prototype.map` method
            // https://tc39.github.io/ecma262/#sec-array.prototype.map
            map: createMethod(1),
            // `Array.prototype.filter` method
            // https://tc39.github.io/ecma262/#sec-array.prototype.filter
            filter: createMethod(2),
            // `Array.prototype.some` method
            // https://tc39.github.io/ecma262/#sec-array.prototype.some
            some: createMethod(3),
            // `Array.prototype.every` method
            // https://tc39.github.io/ecma262/#sec-array.prototype.every
            every: createMethod(4),
            // `Array.prototype.find` method
            // https://tc39.github.io/ecma262/#sec-array.prototype.find
            find: createMethod(5),
            // `Array.prototype.findIndex` method
            // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
            findIndex: createMethod(6)
          };
        }
      ),
      /***/
      "c04e": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var isObject2 = __webpack_require__("861d");
          module2.exports = function(input, PREFERRED_STRING) {
            if (!isObject2(input)) return input;
            var fn, val;
            if (PREFERRED_STRING && typeof (fn = input.toString) == "function" && !isObject2(val = fn.call(input))) return val;
            if (typeof (fn = input.valueOf) == "function" && !isObject2(val = fn.call(input))) return val;
            if (!PREFERRED_STRING && typeof (fn = input.toString) == "function" && !isObject2(val = fn.call(input))) return val;
            throw TypeError("Can't convert object to primitive value");
          };
        }
      ),
      /***/
      "c430": (
        /***/
        function(module2, exports2) {
          module2.exports = false;
        }
      ),
      /***/
      "c6b6": (
        /***/
        function(module2, exports2) {
          var toString = {}.toString;
          module2.exports = function(it) {
            return toString.call(it).slice(8, -1);
          };
        }
      ),
      /***/
      "c6cd": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var global = __webpack_require__("da84");
          var setGlobal = __webpack_require__("ce4e");
          var SHARED = "__core-js_shared__";
          var store = global[SHARED] || setGlobal(SHARED, {});
          module2.exports = store;
        }
      ),
      /***/
      "c8ba": (
        /***/
        function(module2, exports2) {
          var g;
          g = /* @__PURE__ */ function() {
            return this;
          }();
          try {
            g = g || new Function("return this")();
          } catch (e) {
            if (typeof window === "object") g = window;
          }
          module2.exports = g;
        }
      ),
      /***/
      "c975": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var $ = __webpack_require__("23e7");
          var $indexOf = __webpack_require__("4d64").indexOf;
          var arrayMethodIsStrict = __webpack_require__("a640");
          var arrayMethodUsesToLength = __webpack_require__("ae40");
          var nativeIndexOf = [].indexOf;
          var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
          var STRICT_METHOD = arrayMethodIsStrict("indexOf");
          var USES_TO_LENGTH = arrayMethodUsesToLength("indexOf", { ACCESSORS: true, 1: 0 });
          $({ target: "Array", proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD || !USES_TO_LENGTH }, {
            indexOf: function indexOf(searchElement) {
              return NEGATIVE_ZERO ? nativeIndexOf.apply(this, arguments) || 0 : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : void 0);
            }
          });
        }
      ),
      /***/
      "ca84": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var has = __webpack_require__("5135");
          var toIndexedObject = __webpack_require__("fc6a");
          var indexOf = __webpack_require__("4d64").indexOf;
          var hiddenKeys = __webpack_require__("d012");
          module2.exports = function(object, names) {
            var O = toIndexedObject(object);
            var i = 0;
            var result = [];
            var key;
            for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
            while (names.length > i) if (has(O, key = names[i++])) {
              ~indexOf(result, key) || result.push(key);
            }
            return result;
          };
        }
      ),
      /***/
      "cc12": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var global = __webpack_require__("da84");
          var isObject2 = __webpack_require__("861d");
          var document2 = global.document;
          var EXISTS = isObject2(document2) && isObject2(document2.createElement);
          module2.exports = function(it) {
            return EXISTS ? document2.createElement(it) : {};
          };
        }
      ),
      /***/
      "cca6": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var $ = __webpack_require__("23e7");
          var assign = __webpack_require__("60da");
          $({ target: "Object", stat: true, forced: Object.assign !== assign }, {
            assign
          });
        }
      ),
      /***/
      "ce4e": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var global = __webpack_require__("da84");
          var createNonEnumerableProperty = __webpack_require__("9112");
          module2.exports = function(key, value) {
            try {
              createNonEnumerableProperty(global, key, value);
            } catch (error) {
              global[key] = value;
            }
            return value;
          };
        }
      ),
      /***/
      "d012": (
        /***/
        function(module2, exports2) {
          module2.exports = {};
        }
      ),
      /***/
      "d039": (
        /***/
        function(module2, exports2) {
          module2.exports = function(exec) {
            try {
              return !!exec();
            } catch (error) {
              return true;
            }
          };
        }
      ),
      /***/
      "d066": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var path = __webpack_require__("428f");
          var global = __webpack_require__("da84");
          var aFunction = function(variable) {
            return typeof variable == "function" ? variable : void 0;
          };
          module2.exports = function(namespace, method) {
            return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global[namespace]) : path[namespace] && path[namespace][method] || global[namespace] && global[namespace][method];
          };
        }
      ),
      /***/
      "d1e7": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
          var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
          var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);
          exports2.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
            var descriptor = getOwnPropertyDescriptor(this, V);
            return !!descriptor && descriptor.enumerable;
          } : nativePropertyIsEnumerable;
        }
      ),
      /***/
      "d28b": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var defineWellKnownSymbol = __webpack_require__("746f");
          defineWellKnownSymbol("iterator");
        }
      ),
      /***/
      "d2bb": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var anObject = __webpack_require__("825a");
          var aPossiblePrototype = __webpack_require__("3bbe");
          module2.exports = Object.setPrototypeOf || ("__proto__" in {} ? function() {
            var CORRECT_SETTER = false;
            var test = {};
            var setter;
            try {
              setter = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__").set;
              setter.call(test, []);
              CORRECT_SETTER = test instanceof Array;
            } catch (error) {
            }
            return function setPrototypeOf(O, proto) {
              anObject(O);
              aPossiblePrototype(proto);
              if (CORRECT_SETTER) setter.call(O, proto);
              else O.__proto__ = proto;
              return O;
            };
          }() : void 0);
        }
      ),
      /***/
      "d3b7": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var TO_STRING_TAG_SUPPORT = __webpack_require__("00ee");
          var redefine = __webpack_require__("6eeb");
          var toString = __webpack_require__("b041");
          if (!TO_STRING_TAG_SUPPORT) {
            redefine(Object.prototype, "toString", toString, { unsafe: true });
          }
        }
      ),
      /***/
      "d44e": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var defineProperty = __webpack_require__("9bf2").f;
          var has = __webpack_require__("5135");
          var wellKnownSymbol = __webpack_require__("b622");
          var TO_STRING_TAG = wellKnownSymbol("toStringTag");
          module2.exports = function(it, TAG, STATIC) {
            if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
              defineProperty(it, TO_STRING_TAG, { configurable: true, value: TAG });
            }
          };
        }
      ),
      /***/
      "d784": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          __webpack_require__("ac1f");
          var redefine = __webpack_require__("6eeb");
          var fails = __webpack_require__("d039");
          var wellKnownSymbol = __webpack_require__("b622");
          var regexpExec = __webpack_require__("9263");
          var createNonEnumerableProperty = __webpack_require__("9112");
          var SPECIES = wellKnownSymbol("species");
          var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function() {
            var re = /./;
            re.exec = function() {
              var result = [];
              result.groups = { a: "7" };
              return result;
            };
            return "".replace(re, "$<a>") !== "7";
          });
          var REPLACE_KEEPS_$0 = function() {
            return "a".replace(/./, "$0") === "$0";
          }();
          var REPLACE = wellKnownSymbol("replace");
          var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = function() {
            if (/./[REPLACE]) {
              return /./[REPLACE]("a", "$0") === "";
            }
            return false;
          }();
          var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function() {
            var re = /(?:)/;
            var originalExec = re.exec;
            re.exec = function() {
              return originalExec.apply(this, arguments);
            };
            var result = "ab".split(re);
            return result.length !== 2 || result[0] !== "a" || result[1] !== "b";
          });
          module2.exports = function(KEY, length, exec, sham) {
            var SYMBOL = wellKnownSymbol(KEY);
            var DELEGATES_TO_SYMBOL = !fails(function() {
              var O = {};
              O[SYMBOL] = function() {
                return 7;
              };
              return ""[KEY](O) != 7;
            });
            var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function() {
              var execCalled = false;
              var re = /a/;
              if (KEY === "split") {
                re = {};
                re.constructor = {};
                re.constructor[SPECIES] = function() {
                  return re;
                };
                re.flags = "";
                re[SYMBOL] = /./[SYMBOL];
              }
              re.exec = function() {
                execCalled = true;
                return null;
              };
              re[SYMBOL]("");
              return !execCalled;
            });
            if (!DELEGATES_TO_SYMBOL || !DELEGATES_TO_EXEC || KEY === "replace" && !(REPLACE_SUPPORTS_NAMED_GROUPS && REPLACE_KEEPS_$0 && !REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE) || KEY === "split" && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC) {
              var nativeRegExpMethod = /./[SYMBOL];
              var methods = exec(SYMBOL, ""[KEY], function(nativeMethod, regexp, str, arg2, forceStringMethod) {
                if (regexp.exec === regexpExec) {
                  if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
                    return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
                  }
                  return { done: true, value: nativeMethod.call(str, regexp, arg2) };
                }
                return { done: false };
              }, {
                REPLACE_KEEPS_$0,
                REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
              });
              var stringMethod = methods[0];
              var regexMethod = methods[1];
              redefine(String.prototype, KEY, stringMethod);
              redefine(
                RegExp.prototype,
                SYMBOL,
                length == 2 ? function(string, arg) {
                  return regexMethod.call(string, this, arg);
                } : function(string) {
                  return regexMethod.call(string, this);
                }
              );
            }
            if (sham) createNonEnumerableProperty(RegExp.prototype[SYMBOL], "sham", true);
          };
        }
      ),
      /***/
      "d81d": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var $ = __webpack_require__("23e7");
          var $map = __webpack_require__("b727").map;
          var arrayMethodHasSpeciesSupport = __webpack_require__("1dde");
          var arrayMethodUsesToLength = __webpack_require__("ae40");
          var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport("map");
          var USES_TO_LENGTH = arrayMethodUsesToLength("map");
          $({ target: "Array", proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
            map: function map(callbackfn) {
              return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : void 0);
            }
          });
        }
      ),
      /***/
      "da84": (
        /***/
        function(module2, exports2, __webpack_require__) {
          (function(global) {
            var check = function(it) {
              return it && it.Math == Math && it;
            };
            module2.exports = // eslint-disable-next-line no-undef
            check(typeof globalThis == "object" && globalThis) || check(typeof window == "object" && window) || check(typeof self == "object" && self) || check(typeof global == "object" && global) || // eslint-disable-next-line no-new-func
            Function("return this")();
          }).call(this, __webpack_require__("c8ba"));
        }
      ),
      /***/
      "ddb0": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var global = __webpack_require__("da84");
          var DOMIterables = __webpack_require__("fdbc");
          var ArrayIteratorMethods = __webpack_require__("e260");
          var createNonEnumerableProperty = __webpack_require__("9112");
          var wellKnownSymbol = __webpack_require__("b622");
          var ITERATOR = wellKnownSymbol("iterator");
          var TO_STRING_TAG = wellKnownSymbol("toStringTag");
          var ArrayValues = ArrayIteratorMethods.values;
          for (var COLLECTION_NAME in DOMIterables) {
            var Collection = global[COLLECTION_NAME];
            var CollectionPrototype = Collection && Collection.prototype;
            if (CollectionPrototype) {
              if (CollectionPrototype[ITERATOR] !== ArrayValues) try {
                createNonEnumerableProperty(CollectionPrototype, ITERATOR, ArrayValues);
              } catch (error) {
                CollectionPrototype[ITERATOR] = ArrayValues;
              }
              if (!CollectionPrototype[TO_STRING_TAG]) {
                createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
              }
              if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {
                if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
                  createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
                } catch (error) {
                  CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
                }
              }
            }
          }
        }
      ),
      /***/
      "df75": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var internalObjectKeys = __webpack_require__("ca84");
          var enumBugKeys = __webpack_require__("7839");
          module2.exports = Object.keys || function keys(O) {
            return internalObjectKeys(O, enumBugKeys);
          };
        }
      ),
      /***/
      "e01a": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var $ = __webpack_require__("23e7");
          var DESCRIPTORS = __webpack_require__("83ab");
          var global = __webpack_require__("da84");
          var has = __webpack_require__("5135");
          var isObject2 = __webpack_require__("861d");
          var defineProperty = __webpack_require__("9bf2").f;
          var copyConstructorProperties = __webpack_require__("e893");
          var NativeSymbol = global.Symbol;
          if (DESCRIPTORS && typeof NativeSymbol == "function" && (!("description" in NativeSymbol.prototype) || // Safari 12 bug
          NativeSymbol().description !== void 0)) {
            var EmptyStringDescriptionStore = {};
            var SymbolWrapper = function Symbol2() {
              var description = arguments.length < 1 || arguments[0] === void 0 ? void 0 : String(arguments[0]);
              var result = this instanceof SymbolWrapper ? new NativeSymbol(description) : description === void 0 ? NativeSymbol() : NativeSymbol(description);
              if (description === "") EmptyStringDescriptionStore[result] = true;
              return result;
            };
            copyConstructorProperties(SymbolWrapper, NativeSymbol);
            var symbolPrototype = SymbolWrapper.prototype = NativeSymbol.prototype;
            symbolPrototype.constructor = SymbolWrapper;
            var symbolToString = symbolPrototype.toString;
            var native = String(NativeSymbol("test")) == "Symbol(test)";
            var regexp = /^Symbol\((.*)\)[^)]+$/;
            defineProperty(symbolPrototype, "description", {
              configurable: true,
              get: function description() {
                var symbol = isObject2(this) ? this.valueOf() : this;
                var string = symbolToString.call(symbol);
                if (has(EmptyStringDescriptionStore, symbol)) return "";
                var desc = native ? string.slice(7, -1) : string.replace(regexp, "$1");
                return desc === "" ? void 0 : desc;
              }
            });
            $({ global: true, forced: true }, {
              Symbol: SymbolWrapper
            });
          }
        }
      ),
      /***/
      "e163": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var has = __webpack_require__("5135");
          var toObject = __webpack_require__("7b0b");
          var sharedKey = __webpack_require__("f772");
          var CORRECT_PROTOTYPE_GETTER = __webpack_require__("e177");
          var IE_PROTO = sharedKey("IE_PROTO");
          var ObjectPrototype = Object.prototype;
          module2.exports = CORRECT_PROTOTYPE_GETTER ? Object.getPrototypeOf : function(O) {
            O = toObject(O);
            if (has(O, IE_PROTO)) return O[IE_PROTO];
            if (typeof O.constructor == "function" && O instanceof O.constructor) {
              return O.constructor.prototype;
            }
            return O instanceof Object ? ObjectPrototype : null;
          };
        }
      ),
      /***/
      "e177": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var fails = __webpack_require__("d039");
          module2.exports = !fails(function() {
            function F() {
            }
            F.prototype.constructor = null;
            return Object.getPrototypeOf(new F()) !== F.prototype;
          });
        }
      ),
      /***/
      "e260": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var toIndexedObject = __webpack_require__("fc6a");
          var addToUnscopables = __webpack_require__("44d2");
          var Iterators = __webpack_require__("3f8c");
          var InternalStateModule = __webpack_require__("69f3");
          var defineIterator = __webpack_require__("7dd0");
          var ARRAY_ITERATOR = "Array Iterator";
          var setInternalState = InternalStateModule.set;
          var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);
          module2.exports = defineIterator(Array, "Array", function(iterated, kind) {
            setInternalState(this, {
              type: ARRAY_ITERATOR,
              target: toIndexedObject(iterated),
              // target
              index: 0,
              // next index
              kind
              // kind
            });
          }, function() {
            var state = getInternalState(this);
            var target = state.target;
            var kind = state.kind;
            var index = state.index++;
            if (!target || index >= target.length) {
              state.target = void 0;
              return { value: void 0, done: true };
            }
            if (kind == "keys") return { value: index, done: false };
            if (kind == "values") return { value: target[index], done: false };
            return { value: [index, target[index]], done: false };
          }, "values");
          Iterators.Arguments = Iterators.Array;
          addToUnscopables("keys");
          addToUnscopables("values");
          addToUnscopables("entries");
        }
      ),
      /***/
      "e439": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var $ = __webpack_require__("23e7");
          var fails = __webpack_require__("d039");
          var toIndexedObject = __webpack_require__("fc6a");
          var nativeGetOwnPropertyDescriptor = __webpack_require__("06cf").f;
          var DESCRIPTORS = __webpack_require__("83ab");
          var FAILS_ON_PRIMITIVES = fails(function() {
            nativeGetOwnPropertyDescriptor(1);
          });
          var FORCED = !DESCRIPTORS || FAILS_ON_PRIMITIVES;
          $({ target: "Object", stat: true, forced: FORCED, sham: !DESCRIPTORS }, {
            getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
              return nativeGetOwnPropertyDescriptor(toIndexedObject(it), key);
            }
          });
        }
      ),
      /***/
      "e538": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var wellKnownSymbol = __webpack_require__("b622");
          exports2.f = wellKnownSymbol;
        }
      ),
      /***/
      "e893": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var has = __webpack_require__("5135");
          var ownKeys = __webpack_require__("56ef");
          var getOwnPropertyDescriptorModule = __webpack_require__("06cf");
          var definePropertyModule = __webpack_require__("9bf2");
          module2.exports = function(target, source) {
            var keys = ownKeys(source);
            var defineProperty = definePropertyModule.f;
            var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
            for (var i = 0; i < keys.length; i++) {
              var key = keys[i];
              if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
            }
          };
        }
      ),
      /***/
      "e8b5": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var classof = __webpack_require__("c6b6");
          module2.exports = Array.isArray || function isArray2(arg) {
            return classof(arg) == "Array";
          };
        }
      ),
      /***/
      "e95a": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var wellKnownSymbol = __webpack_require__("b622");
          var Iterators = __webpack_require__("3f8c");
          var ITERATOR = wellKnownSymbol("iterator");
          var ArrayPrototype = Array.prototype;
          module2.exports = function(it) {
            return it !== void 0 && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
          };
        }
      ),
      /***/
      "f5df": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var TO_STRING_TAG_SUPPORT = __webpack_require__("00ee");
          var classofRaw = __webpack_require__("c6b6");
          var wellKnownSymbol = __webpack_require__("b622");
          var TO_STRING_TAG = wellKnownSymbol("toStringTag");
          var CORRECT_ARGUMENTS = classofRaw(/* @__PURE__ */ function() {
            return arguments;
          }()) == "Arguments";
          var tryGet = function(it, key) {
            try {
              return it[key];
            } catch (error) {
            }
          };
          module2.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function(it) {
            var O, tag, result;
            return it === void 0 ? "Undefined" : it === null ? "Null" : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG)) == "string" ? tag : CORRECT_ARGUMENTS ? classofRaw(O) : (result = classofRaw(O)) == "Object" && typeof O.callee == "function" ? "Arguments" : result;
          };
        }
      ),
      /***/
      "f772": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var shared = __webpack_require__("5692");
          var uid = __webpack_require__("90e3");
          var keys = shared("keys");
          module2.exports = function(key) {
            return keys[key] || (keys[key] = uid(key));
          };
        }
      ),
      /***/
      "fb15": (
        /***/
        function(module2, __webpack_exports__, __webpack_require__) {
          "use strict";
          __webpack_require__.r(__webpack_exports__);
          __webpack_require__.d(__webpack_exports__, "install", function() {
            return (
              /* reexport */
              install
            );
          });
          __webpack_require__.d(__webpack_exports__, "VueEditor", function() {
            return (
              /* reexport */
              VueEditor
            );
          });
          __webpack_require__.d(__webpack_exports__, "Quill", function() {
            return (
              /* reexport */
              external_quill_default.a
            );
          });
          if (typeof window !== "undefined") {
            var currentScript = window.document.currentScript;
            if (true) {
              var getCurrentScript = __webpack_require__("8875");
              currentScript = getCurrentScript();
              if (!("currentScript" in document)) {
                Object.defineProperty(document, "currentScript", { get: getCurrentScript });
              }
            }
            var src = currentScript && currentScript.src.match(/(.+\/)[^/]+\.js(\?.*)?$/);
            if (src) {
              __webpack_require__.p = src[1];
            }
          }
          var setPublicPath = null;
          var external_quill_ = __webpack_require__("6c81");
          var external_quill_default = __webpack_require__.n(external_quill_);
          var external_commonjs_vue_commonjs2_vue_root_Vue_ = __webpack_require__("8bbf");
          var _hoisted_1 = {
            class: "quillWrapper"
          };
          function render(_ctx, _cache, $props, $setup, $data, $options) {
            return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createBlock"])("div", _hoisted_1, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderSlot"])(_ctx.$slots, "toolbar"), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])("div", {
              id: $props.id,
              ref: "quillContainer"
            }, null, 8, ["id"]), $props.useCustomImageHandler ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createBlock"])("input", {
              key: 0,
              id: "file-upload",
              ref: "fileInput",
              type: "file",
              accept: "image/*",
              style: {
                "display": "none"
              },
              onChange: _cache[1] || (_cache[1] = function($event) {
                return $options.emitImageInfo($event);
              })
            }, null, 544)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)]);
          }
          var es_array_concat = __webpack_require__("99af");
          var es_array_map = __webpack_require__("d81d");
          var es_object_keys = __webpack_require__("b64b");
          var defaultToolbar = [
            [{
              header: [false, 1, 2, 3, 4, 5, 6]
            }],
            ["bold", "italic", "underline", "strike"],
            // toggled buttons
            [{
              align: ""
            }, {
              align: "center"
            }, {
              align: "right"
            }, {
              align: "justify"
            }],
            ["blockquote", "code-block"],
            [{
              list: "ordered"
            }, {
              list: "bullet"
            }, {
              list: "check"
            }],
            [{
              indent: "-1"
            }, {
              indent: "+1"
            }],
            // outdent/indent
            [{
              color: []
            }, {
              background: []
            }],
            // dropdown with defaults from theme
            ["link", "image", "video"],
            ["clean"]
            // remove formatting button
          ];
          var default_toolbar = defaultToolbar;
          var es_array_for_each = __webpack_require__("4160");
          var web_dom_collections_for_each = __webpack_require__("159b");
          var old_api = {
            props: {
              customModules: Array
            },
            methods: {
              registerCustomModules: function registerCustomModules(Quill) {
                if (this.customModules !== void 0) {
                  this.customModules.forEach(function(customModule) {
                    Quill.register("modules/" + customModule.alias, customModule.module);
                  });
                }
              }
            }
          };
          var es_object_assign = __webpack_require__("cca6");
          var es_symbol = __webpack_require__("a4d3");
          var es_symbol_description = __webpack_require__("e01a");
          var es_symbol_iterator = __webpack_require__("d28b");
          var es_array_iterator = __webpack_require__("e260");
          var es_object_to_string = __webpack_require__("d3b7");
          var es_string_iterator = __webpack_require__("3ca3");
          var web_dom_collections_iterator = __webpack_require__("ddb0");
          function _typeof(obj) {
            "@babel/helpers - typeof";
            if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
              _typeof = function _typeof2(obj2) {
                return typeof obj2;
              };
            } else {
              _typeof = function _typeof2(obj2) {
                return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
              };
            }
            return _typeof(obj);
          }
          function mergeDeep(target, source) {
            var isObject2 = function isObject3(obj) {
              return obj && _typeof(obj) === "object";
            };
            if (!isObject2(target) || !isObject2(source)) {
              return source;
            }
            Object.keys(source).forEach(function(key) {
              var targetValue = target[key];
              var sourceValue = source[key];
              if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
                target[key] = targetValue.concat(sourceValue);
              } else if (isObject2(targetValue) && isObject2(sourceValue)) {
                target[key] = mergeDeep(Object.assign({}, targetValue), sourceValue);
              } else {
                target[key] = sourceValue;
              }
            });
            return target;
          }
          var es_array_index_of = __webpack_require__("c975");
          var es_array_slice = __webpack_require__("fb6a");
          var es_function_name = __webpack_require__("b0c0");
          var es_regexp_exec = __webpack_require__("ac1f");
          var es_string_match = __webpack_require__("466d");
          var es_string_search = __webpack_require__("841c");
          var es_array_from = __webpack_require__("a630");
          var es_regexp_to_string = __webpack_require__("25f0");
          function _arrayLikeToArray(arr, len) {
            if (len == null || len > arr.length) len = arr.length;
            for (var i = 0, arr2 = new Array(len); i < len; i++) {
              arr2[i] = arr[i];
            }
            return arr2;
          }
          function _unsupportedIterableToArray(o, minLen) {
            if (!o) return;
            if (typeof o === "string") return _arrayLikeToArray(o, minLen);
            var n = Object.prototype.toString.call(o).slice(8, -1);
            if (n === "Object" && o.constructor) n = o.constructor.name;
            if (n === "Map" || n === "Set") return Array.from(o);
            if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
          }
          function _createForOfIteratorHelper(o, allowArrayLike) {
            var it;
            if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
              if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
                if (it) o = it;
                var i = 0;
                var F = function F2() {
                };
                return {
                  s: F,
                  n: function n() {
                    if (i >= o.length) return {
                      done: true
                    };
                    return {
                      done: false,
                      value: o[i++]
                    };
                  },
                  e: function e(_e) {
                    throw _e;
                  },
                  f: F
                };
              }
              throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
            }
            var normalCompletion = true, didErr = false, err;
            return {
              s: function s() {
                it = o[Symbol.iterator]();
              },
              n: function n() {
                var step = it.next();
                normalCompletion = step.done;
                return step;
              },
              e: function e(_e2) {
                didErr = true;
                err = _e2;
              },
              f: function f() {
                try {
                  if (!normalCompletion && it["return"] != null) it["return"]();
                } finally {
                  if (didErr) throw err;
                }
              }
            };
          }
          function _arrayWithHoles(arr) {
            if (Array.isArray(arr)) return arr;
          }
          function _iterableToArrayLimit(arr, i) {
            if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = void 0;
            try {
              for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                _arr.push(_s.value);
                if (i && _arr.length === i) break;
              }
            } catch (err) {
              _d = true;
              _e = err;
            } finally {
              try {
                if (!_n && _i["return"] != null) _i["return"]();
              } finally {
                if (_d) throw _e;
              }
            }
            return _arr;
          }
          function _nonIterableRest() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
          }
          function _slicedToArray(arr, i) {
            return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
          }
          function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor) descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          function _createClass(Constructor, protoProps, staticProps) {
            if (protoProps) _defineProperties(Constructor.prototype, protoProps);
            if (staticProps) _defineProperties(Constructor, staticProps);
            return Constructor;
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _setPrototypeOf(o, p) {
            _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
              o2.__proto__ = p2;
              return o2;
            };
            return _setPrototypeOf(o, p);
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function");
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, {
              constructor: {
                value: subClass,
                writable: true,
                configurable: true
              }
            });
            if (superClass) _setPrototypeOf(subClass, superClass);
          }
          var es_reflect_construct = __webpack_require__("4ae1");
          var es_object_get_prototype_of = __webpack_require__("3410");
          function _getPrototypeOf(o) {
            _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
              return o2.__proto__ || Object.getPrototypeOf(o2);
            };
            return _getPrototypeOf(o);
          }
          function _isNativeReflectConstruct() {
            if (typeof Reflect === "undefined" || !Reflect.construct) return false;
            if (Reflect.construct.sham) return false;
            if (typeof Proxy === "function") return true;
            try {
              Date.prototype.toString.call(Reflect.construct(Date, [], function() {
              }));
              return true;
            } catch (e) {
              return false;
            }
          }
          function _assertThisInitialized(self2) {
            if (self2 === void 0) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return self2;
          }
          function _possibleConstructorReturn(self2, call) {
            if (call && (_typeof(call) === "object" || typeof call === "function")) {
              return call;
            }
            return _assertThisInitialized(self2);
          }
          function _createSuper(Derived) {
            var hasNativeReflectConstruct = _isNativeReflectConstruct();
            return function _createSuperInternal() {
              var Super = _getPrototypeOf(Derived), result;
              if (hasNativeReflectConstruct) {
                var NewTarget = _getPrototypeOf(this).constructor;
                result = Reflect.construct(Super, arguments, NewTarget);
              } else {
                result = Super.apply(this, arguments);
              }
              return _possibleConstructorReturn(this, result);
            };
          }
          var BlockEmbed = external_quill_default.a.import("blots/block/embed");
          var markdown_shortcuts_HorizontalRule = function(_BlockEmbed) {
            _inherits(HorizontalRule, _BlockEmbed);
            var _super = _createSuper(HorizontalRule);
            function HorizontalRule() {
              _classCallCheck(this, HorizontalRule);
              return _super.apply(this, arguments);
            }
            return HorizontalRule;
          }(BlockEmbed);
          markdown_shortcuts_HorizontalRule.blotName = "hr";
          markdown_shortcuts_HorizontalRule.tagName = "hr";
          external_quill_default.a.register("formats/horizontal", markdown_shortcuts_HorizontalRule);
          var markdown_shortcuts_MarkdownShortcuts = function() {
            function MarkdownShortcuts(quill, options) {
              var _this = this;
              _classCallCheck(this, MarkdownShortcuts);
              this.quill = quill;
              this.options = options;
              this.ignoreTags = ["PRE"];
              this.matches = [{
                name: "header",
                pattern: /^(#){1,6}\s/g,
                action: function action(text, selection, pattern) {
                  var match = pattern.exec(text);
                  if (!match) return;
                  var size = match[0].length;
                  setTimeout(function() {
                    _this.quill.formatLine(selection.index, 0, "header", size - 1);
                    _this.quill.deleteText(selection.index - size, size);
                  }, 0);
                }
              }, {
                name: "blockquote",
                pattern: /^(>)\s/g,
                action: function action(_text, selection) {
                  setTimeout(function() {
                    _this.quill.formatLine(selection.index, 1, "blockquote", true);
                    _this.quill.deleteText(selection.index - 2, 2);
                  }, 0);
                }
              }, {
                name: "code-block",
                pattern: /^`{3}(?:\s|\n)/g,
                action: function action(_text, selection) {
                  setTimeout(function() {
                    _this.quill.formatLine(selection.index, 1, "code-block", true);
                    _this.quill.deleteText(selection.index - 4, 4);
                  }, 0);
                }
              }, {
                name: "bolditalic",
                pattern: /(?:\*|_){3}(.+?)(?:\*|_){3}/g,
                action: function action(text, _selection, pattern, lineStart) {
                  var match = pattern.exec(text);
                  var annotatedText = match[0];
                  var matchedText = match[1];
                  var startIndex = lineStart + match.index;
                  if (text.match(/^([*_ \n]+)$/g)) return;
                  setTimeout(function() {
                    _this.quill.deleteText(startIndex, annotatedText.length);
                    _this.quill.insertText(startIndex, matchedText, {
                      bold: true,
                      italic: true
                    });
                    _this.quill.format("bold", false);
                  }, 0);
                }
              }, {
                name: "bold",
                pattern: /(?:\*|_){2}(.+?)(?:\*|_){2}/g,
                action: function action(text, _selection, pattern, lineStart) {
                  var match = pattern.exec(text);
                  var annotatedText = match[0];
                  var matchedText = match[1];
                  var startIndex = lineStart + match.index;
                  if (text.match(/^([*_ \n]+)$/g)) return;
                  setTimeout(function() {
                    _this.quill.deleteText(startIndex, annotatedText.length);
                    _this.quill.insertText(startIndex, matchedText, {
                      bold: true
                    });
                    _this.quill.format("bold", false);
                  }, 0);
                }
              }, {
                name: "italic",
                pattern: /(?:\*|_){1}(.+?)(?:\*|_){1}/g,
                action: function action(text, _selection, pattern, lineStart) {
                  var match = pattern.exec(text);
                  var annotatedText = match[0];
                  var matchedText = match[1];
                  var startIndex = lineStart + match.index;
                  if (text.match(/^([*_ \n]+)$/g)) return;
                  setTimeout(function() {
                    _this.quill.deleteText(startIndex, annotatedText.length);
                    _this.quill.insertText(startIndex, matchedText, {
                      italic: true
                    });
                    _this.quill.format("italic", false);
                  }, 0);
                }
              }, {
                name: "strikethrough",
                pattern: /(?:~~)(.+?)(?:~~)/g,
                action: function action(text, _selection, pattern, lineStart) {
                  var match = pattern.exec(text);
                  var annotatedText = match[0];
                  var matchedText = match[1];
                  var startIndex = lineStart + match.index;
                  if (text.match(/^([*_ \n]+)$/g)) return;
                  setTimeout(function() {
                    _this.quill.deleteText(startIndex, annotatedText.length);
                    _this.quill.insertText(startIndex, matchedText, {
                      strike: true
                    });
                    _this.quill.format("strike", false);
                  }, 0);
                }
              }, {
                name: "code",
                pattern: /(?:`)(.+?)(?:`)/g,
                action: function action(text, _selection, pattern, lineStart) {
                  var match = pattern.exec(text);
                  var annotatedText = match[0];
                  var matchedText = match[1];
                  var startIndex = lineStart + match.index;
                  if (text.match(/^([*_ \n]+)$/g)) return;
                  setTimeout(function() {
                    _this.quill.deleteText(startIndex, annotatedText.length);
                    _this.quill.insertText(startIndex, matchedText, {
                      code: true
                    });
                    _this.quill.format("code", false);
                    _this.quill.insertText(_this.quill.getSelection(), " ");
                  }, 0);
                }
              }, {
                name: "hr",
                pattern: /^([-*]\s?){3}/g,
                action: function action(text, selection) {
                  var startIndex = selection.index - text.length;
                  setTimeout(function() {
                    _this.quill.deleteText(startIndex, text.length);
                    _this.quill.insertEmbed(startIndex + 1, "hr", true, external_quill_default.a.sources.USER);
                    _this.quill.insertText(startIndex + 2, "\n", external_quill_default.a.sources.SILENT);
                    _this.quill.setSelection(startIndex + 2, external_quill_default.a.sources.SILENT);
                  }, 0);
                }
              }, {
                name: "asterisk-ul",
                pattern: /^(\*|\+)\s$/g,
                action: function action(_text, selection, _pattern) {
                  setTimeout(function() {
                    _this.quill.formatLine(selection.index, 1, "list", "unordered");
                    _this.quill.deleteText(selection.index - 2, 2);
                  }, 0);
                }
              }, {
                name: "image",
                pattern: /(?:!\[(.+?)\])(?:\((.+?)\))/g,
                action: function action(text, selection, pattern) {
                  var startIndex = text.search(pattern);
                  var matchedText = text.match(pattern)[0];
                  var hrefLink = text.match(/(?:\((.*?)\))/g)[0];
                  var start = selection.index - matchedText.length - 1;
                  if (startIndex !== -1) {
                    setTimeout(function() {
                      _this.quill.deleteText(start, matchedText.length);
                      _this.quill.insertEmbed(start, "image", hrefLink.slice(1, hrefLink.length - 1));
                    }, 0);
                  }
                }
              }, {
                name: "link",
                pattern: /(?:\[(.+?)\])(?:\((.+?)\))/g,
                action: function action(text, selection, pattern) {
                  var startIndex = text.search(pattern);
                  var matchedText = text.match(pattern)[0];
                  var hrefText = text.match(/(?:\[(.*?)\])/g)[0];
                  var hrefLink = text.match(/(?:\((.*?)\))/g)[0];
                  var start = selection.index - matchedText.length - 1;
                  if (startIndex !== -1) {
                    setTimeout(function() {
                      _this.quill.deleteText(start, matchedText.length);
                      _this.quill.insertText(start, hrefText.slice(1, hrefText.length - 1), "link", hrefLink.slice(1, hrefLink.length - 1));
                    }, 0);
                  }
                }
              }];
              this.quill.on("text-change", function(delta, _oldContents, _source) {
                for (var i = 0; i < delta.ops.length; i++) {
                  if (delta.ops[i].hasOwnProperty("insert")) {
                    if (delta.ops[i].insert === " ") {
                      _this.onSpace();
                    } else if (delta.ops[i].insert === "\n") {
                      _this.onEnter();
                    }
                  }
                }
              });
            }
            _createClass(MarkdownShortcuts, [{
              key: "isValid",
              value: function isValid(text, tagName) {
                return typeof text !== "undefined" && text && this.ignoreTags.indexOf(tagName) === -1;
              }
            }, {
              key: "onSpace",
              value: function onSpace() {
                var selection = this.quill.getSelection();
                if (!selection) return;
                var _this$quill$getLine = this.quill.getLine(selection.index), _this$quill$getLine2 = _slicedToArray(_this$quill$getLine, 2), line = _this$quill$getLine2[0], offset = _this$quill$getLine2[1];
                var text = line.domNode.textContent;
                var lineStart = selection.index - offset;
                if (this.isValid(text, line.domNode.tagName)) {
                  var _iterator = _createForOfIteratorHelper(this.matches), _step;
                  try {
                    for (_iterator.s(); !(_step = _iterator.n()).done; ) {
                      var match = _step.value;
                      var matchedText = text.match(match.pattern);
                      if (matchedText) {
                        console.log("matched:", match.name, text);
                        match.action(text, selection, match.pattern, lineStart);
                        return;
                      }
                    }
                  } catch (err) {
                    _iterator.e(err);
                  } finally {
                    _iterator.f();
                  }
                }
              }
            }, {
              key: "onEnter",
              value: function onEnter() {
                var selection = this.quill.getSelection();
                if (!selection) return;
                var _this$quill$getLine3 = this.quill.getLine(selection.index), _this$quill$getLine4 = _slicedToArray(_this$quill$getLine3, 2), line = _this$quill$getLine4[0], offset = _this$quill$getLine4[1];
                var text = line.domNode.textContent + " ";
                var lineStart = selection.index - offset;
                selection.length = selection.index++;
                if (this.isValid(text, line.domNode.tagName)) {
                  var _iterator2 = _createForOfIteratorHelper(this.matches), _step2;
                  try {
                    for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
                      var match = _step2.value;
                      var matchedText = text.match(match.pattern);
                      if (matchedText) {
                        console.log("matched", match.name, text);
                        match.action(text, selection, match.pattern, lineStart);
                        return;
                      }
                    }
                  } catch (err) {
                    _iterator2.e(err);
                  } finally {
                    _iterator2.f();
                  }
                }
              }
            }]);
            return MarkdownShortcuts;
          }();
          var markdown_shortcuts = markdown_shortcuts_MarkdownShortcuts;
          var es_string_starts_with = __webpack_require__("2ca0");
          var es_object_get_own_property_descriptor = __webpack_require__("e439");
          var es_reflect_get = __webpack_require__("5d41");
          function _superPropBase(object, property) {
            while (!Object.prototype.hasOwnProperty.call(object, property)) {
              object = _getPrototypeOf(object);
              if (object === null) break;
            }
            return object;
          }
          function get_get(target, property, receiver) {
            if (typeof Reflect !== "undefined" && Reflect.get) {
              get_get = Reflect.get;
            } else {
              get_get = function _get(target2, property2, receiver2) {
                var base = _superPropBase(target2, property2);
                if (!base) return;
                var desc = Object.getOwnPropertyDescriptor(base, property2);
                if (desc.get) {
                  return desc.get.call(receiver2);
                }
                return desc.value;
              };
            }
            return get_get(target, property, receiver || target);
          }
          var Link = external_quill_default.a.import("formats/link");
          var custom_link_CustomLink = function(_Link) {
            _inherits(CustomLink, _Link);
            var _super = _createSuper(CustomLink);
            function CustomLink() {
              _classCallCheck(this, CustomLink);
              return _super.apply(this, arguments);
            }
            _createClass(CustomLink, null, [{
              key: "sanitize",
              value: function sanitize(url) {
                var value = get_get(_getPrototypeOf(CustomLink), "sanitize", this).call(this, url);
                if (value) {
                  for (var i = 0; i < this.PROTOCOL_WHITELIST.length; i++) {
                    if (value.startsWith(this.PROTOCOL_WHITELIST[i])) {
                      return value;
                    }
                  }
                  return "https://".concat(value);
                }
                return value;
              }
            }]);
            return CustomLink;
          }(Link);
          var VueEditorvue_type_script_lang_js = {
            name: "VueEditor",
            emits: ["ready", "editor-change", "focus", "selection-change", "text-change", "blur", "input", "image-removed", "image-added", "update:modelValue"],
            mixins: [old_api],
            props: {
              id: {
                type: String,
                default: "quill-container"
              },
              placeholder: {
                type: String,
                default: ""
              },
              modelValue: {
                type: String,
                default: ""
              },
              disabled: {
                type: Boolean
              },
              editorToolbar: {
                type: [Array, Object],
                default: function _default() {
                  return [];
                }
              },
              editorOptions: {
                type: Object,
                required: false,
                default: function _default() {
                  return {};
                }
              },
              useCustomImageHandler: {
                type: Boolean,
                default: false
              },
              useMarkdownShortcuts: {
                type: Boolean,
                default: false
              },
              prependLinksHttps: {
                type: Boolean,
                default: false
              }
            },
            data: function data() {
              return {
                quill: null
              };
            },
            watch: {
              modelValue: function modelValue(val) {
                if (val != this.quill.root.innerHTML && !this.quill.hasFocus()) {
                  this.quill.root.innerHTML = val;
                }
              },
              disabled: function disabled(status) {
                this.quill.enable(!status);
              }
            },
            mounted: function mounted() {
              this.registerCustomModules(external_quill_default.a);
              this.registerPrototypes();
              this.initializeEditor();
            },
            beforeUnmount: function beforeUnmount() {
              this.quill = null;
              delete this.quill;
            },
            methods: {
              initializeEditor: function initializeEditor() {
                this.setupQuillEditor();
                this.checkForCustomImageHandler();
                this.handleInitialContent();
                this.registerEditorEventListeners();
                this.$emit("ready", this.quill);
              },
              setupQuillEditor: function setupQuillEditor() {
                var editorConfig = {
                  debug: false,
                  modules: this.setModules(),
                  theme: "snow",
                  placeholder: this.placeholder ? this.placeholder : "",
                  readOnly: this.disabled ? this.disabled : false
                };
                this.prepareEditorConfig(editorConfig);
                this.quill = new external_quill_default.a(this.$refs.quillContainer, editorConfig);
              },
              setModules: function setModules() {
                var modules = {
                  toolbar: this.editorToolbar.length ? this.editorToolbar : default_toolbar
                };
                if (this.useMarkdownShortcuts) {
                  external_quill_default.a.register("modules/markdownShortcuts", markdown_shortcuts, true);
                  modules["markdownShortcuts"] = {};
                }
                if (this.prependLinksHttps) {
                  external_quill_default.a.register("formats/link", custom_link_CustomLink, true);
                }
                return modules;
              },
              prepareEditorConfig: function prepareEditorConfig(editorConfig) {
                if (Object.keys(this.editorOptions).length > 0 && this.editorOptions.constructor === Object) {
                  if (this.editorOptions.modules && typeof this.editorOptions.modules.toolbar !== "undefined") {
                    delete editorConfig.modules.toolbar;
                  }
                  mergeDeep(editorConfig, this.editorOptions);
                }
              },
              registerPrototypes: function registerPrototypes() {
                external_quill_default.a.prototype.getHTML = function() {
                  return this.container.querySelector(".ql-editor").innerHTML;
                };
                external_quill_default.a.prototype.getWordCount = function() {
                  return this.container.querySelector(".ql-editor").innerText.length;
                };
              },
              registerEditorEventListeners: function registerEditorEventListeners() {
                this.quill.on("text-change", this.handleTextChange);
                this.quill.on("selection-change", this.handleSelectionChange);
                this.listenForEditorEvent("text-change");
                this.listenForEditorEvent("selection-change");
                this.listenForEditorEvent("editor-change");
              },
              listenForEditorEvent: function listenForEditorEvent(type) {
                var _this = this;
                this.quill.on(type, function() {
                  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                  }
                  _this.$emit.apply(_this, [type].concat(args));
                });
              },
              handleInitialContent: function handleInitialContent() {
                if (this.modelValue) this.quill.root.innerHTML = this.modelValue;
              },
              handleSelectionChange: function handleSelectionChange(range, oldRange) {
                if (!range && oldRange) this.$emit("blur", this.quill);
                else if (range && !oldRange) this.$emit("focus", this.quill);
              },
              handleTextChange: function handleTextChange(delta, oldContents) {
                var editorContent = this.quill.getHTML() === "<p><br></p>" ? "" : this.quill.getHTML();
                this.$emit("update:modelValue", editorContent);
                if (this.useCustomImageHandler) this.handleImageRemoved(delta, oldContents);
              },
              handleImageRemoved: function handleImageRemoved(delta, oldContents) {
                var _this2 = this;
                var currrentContents = this.quill.getContents();
                var deletedContents = currrentContents.diff(oldContents);
                var operations = deletedContents.ops;
                operations.map(function(operation) {
                  if (operation.insert && operation.insert.hasOwnProperty("image")) {
                    var image = operation.insert.image;
                    _this2.$emit("image-removed", image);
                  }
                });
              },
              checkForCustomImageHandler: function checkForCustomImageHandler() {
                this.useCustomImageHandler === true ? this.setupCustomImageHandler() : "";
              },
              setupCustomImageHandler: function setupCustomImageHandler() {
                var toolbar = this.quill.getModule("toolbar");
                toolbar.addHandler("image", this.customImageHandler);
              },
              customImageHandler: function customImageHandler() {
                this.$refs.fileInput.click();
              },
              emitImageInfo: function emitImageInfo($event) {
                var resetUploader = function resetUploader2() {
                  var uploader = document.getElementById("file-upload");
                  uploader.value = "";
                };
                var file = $event.target.files[0];
                var Editor = this.quill;
                var range = Editor.getSelection();
                var cursorLocation = range.index;
                this.$emit("image-added", file, Editor, cursorLocation, resetUploader);
              }
            }
          };
          var quill_snowvue_type_style_index_0_lang_css = __webpack_require__("4aea");
          var vue3_editorvue_type_style_index_1_lang_scss = __webpack_require__("69de");
          VueEditorvue_type_script_lang_js.render = render;
          var VueEditor = VueEditorvue_type_script_lang_js;
          var version = "0.1.0-alpha.2";
          function install(app) {
            if (install.installed) return;
            install.installed = true;
            app.component("VueEditor", VueEditor);
          }
          var VPlugin = {
            install,
            version,
            Quill: external_quill_default.a,
            VueEditor
          };
          var src_0 = VPlugin;
          var entry_lib = __webpack_exports__["default"] = src_0;
        }
      ),
      /***/
      "fb6a": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var $ = __webpack_require__("23e7");
          var isObject2 = __webpack_require__("861d");
          var isArray2 = __webpack_require__("e8b5");
          var toAbsoluteIndex = __webpack_require__("23cb");
          var toLength = __webpack_require__("50c4");
          var toIndexedObject = __webpack_require__("fc6a");
          var createProperty = __webpack_require__("8418");
          var wellKnownSymbol = __webpack_require__("b622");
          var arrayMethodHasSpeciesSupport = __webpack_require__("1dde");
          var arrayMethodUsesToLength = __webpack_require__("ae40");
          var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport("slice");
          var USES_TO_LENGTH = arrayMethodUsesToLength("slice", { ACCESSORS: true, 0: 0, 1: 2 });
          var SPECIES = wellKnownSymbol("species");
          var nativeSlice = [].slice;
          var max = Math.max;
          $({ target: "Array", proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
            slice: function slice(start, end) {
              var O = toIndexedObject(this);
              var length = toLength(O.length);
              var k = toAbsoluteIndex(start, length);
              var fin = toAbsoluteIndex(end === void 0 ? length : end, length);
              var Constructor, result, n;
              if (isArray2(O)) {
                Constructor = O.constructor;
                if (typeof Constructor == "function" && (Constructor === Array || isArray2(Constructor.prototype))) {
                  Constructor = void 0;
                } else if (isObject2(Constructor)) {
                  Constructor = Constructor[SPECIES];
                  if (Constructor === null) Constructor = void 0;
                }
                if (Constructor === Array || Constructor === void 0) {
                  return nativeSlice.call(O, k, fin);
                }
              }
              result = new (Constructor === void 0 ? Array : Constructor)(max(fin - k, 0));
              for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
              result.length = n;
              return result;
            }
          });
        }
      ),
      /***/
      "fc6a": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var IndexedObject = __webpack_require__("44ad");
          var requireObjectCoercible = __webpack_require__("1d80");
          module2.exports = function(it) {
            return IndexedObject(requireObjectCoercible(it));
          };
        }
      ),
      /***/
      "fdbc": (
        /***/
        function(module2, exports2) {
          module2.exports = {
            CSSRuleList: 0,
            CSSStyleDeclaration: 0,
            CSSValueList: 0,
            ClientRectList: 0,
            DOMRectList: 0,
            DOMStringList: 0,
            DOMTokenList: 1,
            DataTransferItemList: 0,
            FileList: 0,
            HTMLAllCollection: 0,
            HTMLCollection: 0,
            HTMLFormElement: 0,
            HTMLSelectElement: 0,
            MediaList: 0,
            MimeTypeArray: 0,
            NamedNodeMap: 0,
            NodeList: 1,
            PaintRequestList: 0,
            Plugin: 0,
            PluginArray: 0,
            SVGLengthList: 0,
            SVGNumberList: 0,
            SVGPathSegList: 0,
            SVGPointList: 0,
            SVGStringList: 0,
            SVGTransformList: 0,
            SourceBufferList: 0,
            StyleSheetList: 0,
            TextTrackCueList: 0,
            TextTrackList: 0,
            TouchList: 0
          };
        }
      ),
      /***/
      "fdbf": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var NATIVE_SYMBOL = __webpack_require__("4930");
          module2.exports = NATIVE_SYMBOL && !Symbol.sham && typeof Symbol.iterator == "symbol";
        }
      )
      /******/
    });
  }
});
export default require_vue3_editor_common();
/*! Bundled license information:

quill/dist/quill.js:
  (*!
   * Quill Editor v1.3.7
   * https://quilljs.com/
   * Copyright (c) 2014, Jason Chen
   * Copyright (c) 2013, salesforce.com
   *)

@vue/compiler-core/dist/compiler-core.esm-bundler.js:
  (**
  * @vue/compiler-core v3.5.13
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **)

@vue/compiler-dom/dist/compiler-dom.esm-bundler.js:
  (**
  * @vue/compiler-dom v3.5.13
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **)

vue/dist/vue.cjs.js:
  (**
  * vue v3.5.13
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **)
*/
//# sourceMappingURL=vue3-editor.js.map
