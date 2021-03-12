"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleServiceUrl = exports.completeInterfaceAll = exports.completeInterface = exports.tsConcat = exports.noteConcat = exports.typeMap = void 0;

var common_1 = require("../../utils/common");

var fs = require("fs");
/**
 * 映射后端语言类型与ts类型
 * @param param0
 * @param use 是否启用严格模式，正常模式 string|null or number|null等，严格模式 string or number等
 */


var typeMap = function typeMap(_ref, use) {
  var _items$$ref;

  var type = _ref.type,
      items = _ref.items,
      $ref = _ref.$ref;
  var childProps = (items === null || items === void 0 ? void 0 : items.type) && exports.typeMap(items, "strict") || (items === null || items === void 0 ? void 0 : (_items$$ref = items.$ref) === null || _items$$ref === void 0 ? void 0 : _items$$ref.split("/")[2]) || ($ref === null || $ref === void 0 ? void 0 : $ref.split("/")[2]) || null;

  switch (type) {
    case "string":
      return use === "strict" ? "string" : "string | null";

    case "number":
      return use === "strict" ? "number" : "number | null";

    case "integer":
      return use === "strict" ? "number" : "number | null";

    case "boolean":
      return use === "strict" ? "boolean" : "boolean | null";

    case "array":
      return use === "strict" ? "Array<".concat(common_1.handleSpecialSymbol(childProps), ">") : "Array<".concat(common_1.handleSpecialSymbol(childProps), "> | null");

    case "object":
      return "any";

    default:
      return common_1.handleSpecialSymbol(childProps) || "any";
  }
};

exports.typeMap = typeMap;
/**
 * 拼接注释字符串
 * @param param0
 * @param prevStr 上次保存的string
 */

var noteConcat = function noteConcat(_ref2, prevStr) {
  var key = _ref2.key,
      val = _ref2.val;
  return "".concat(prevStr, "\n * @param ").concat(key, " (").concat(exports.typeMap(val, "strict"), ") ").concat(val.description || "暂无注释");
};

exports.noteConcat = noteConcat;
/**
 * 拼接接口字符串
 * @param param0
 * @param prevStr 上次保存的string
 */

var tsConcat = function tsConcat(_ref3, prevStr) {
  var key = _ref3.key,
      val = _ref3.val;
  return "".concat(prevStr, "\n    ").concat(key, ": ").concat(exports.typeMap(val), ";");
};

exports.tsConcat = tsConcat;
/**
 * 一个完整的接口字符串（注释+接口）
 * @param key
 * @param val
 */

var completeInterface = function completeInterface(key, val) {
  var noteStr = "";
  var tsStr = "";

  for (var _key in val.properties) {
    var propsVal = val.properties[_key];
    var keyName = common_1.handleSpecialSymbol(_key);
    noteStr = exports.noteConcat({
      key: keyName,
      val: propsVal
    }, noteStr);
    tsStr = exports.tsConcat({
      key: keyName,
      val: propsVal
    }, tsStr);
  }

  return "/**".concat(noteStr, "\n */ \nexport interface ").concat(common_1.handleSpecialSymbol(key), " {").concat(tsStr, "\n}\n");
};

exports.completeInterface = completeInterface;
/**
 * 当前swagger所有的接口 写入文件夹
 * @param interfaceObj 接口对象
 * @param options 接口对象
 */

var completeInterfaceAll = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(interfaceObj, options) {
    var newOptions, str, key;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            newOptions = _objectSpread({
              path: "./",
              name: "name"
            }, options || {});
            str = "";

            for (key in interfaceObj.data) {
              str += exports.completeInterface(key, interfaceObj.data[key]) + "\n";
            }

            _context.prev = 3;
            _context.next = 6;
            return new Promise(function (resolve, reject) {
              fs.mkdir([newOptions.path, newOptions.name].join("/"), {
                recursive: true
              }, function (err) {
                if (!err) {
                  resolve(1);
                } else {
                  reject(err);
                }
              });
            });

          case 6:
            fs.writeFile([newOptions.path, newOptions.name, "interface.d.ts"].join("/"), str, function () {});
            _context.next = 11;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](3);

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 9]]);
  }));

  return function completeInterfaceAll(_x, _x2) {
    return _ref4.apply(this, arguments);
  };
}();

exports.completeInterfaceAll = completeInterfaceAll; // const apiFileInfo = (paths)=>{
// }

var handleServiceUrl = function handleServiceUrl(appList, serverList) {
  var mySet = new Set(serverList);
  return appList.filter(function (el) {
    if (Reflect.apply(Object.prototype.toString, [], el.instance) === "[object Array]" && el.instance.length > 0) {
      el.instance = el.instance[0];
    }

    return mySet.has(el.instance.vipAddress);
  }).map(function (el) {
    return {
      serviceName: el.instance.vipAddress,
      serviceUrl: el.instance.homePageUrl
    };
  });
};

exports.handleServiceUrl = handleServiceUrl;