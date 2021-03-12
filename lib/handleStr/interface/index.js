"use strict";

var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");

var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");

var _filterInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/filter");

var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");

var _forEachInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");

var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");

var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");

var _Object$defineProperty2 = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _defineProperty3 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _set = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _apply = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/reflect/apply"));

function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); if (enumerableOnly) symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { var _context10; _forEachInstanceProperty(_context10 = ownKeys(Object(source), true)).call(_context10, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (_Object$getOwnPropertyDescriptors) { _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)); } else { var _context11; _forEachInstanceProperty(_context11 = ownKeys(Object(source))).call(_context11, function (key) { _Object$defineProperty2(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } } return target; }

(0, _defineProperty3["default"])(exports, "__esModule", {
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
  var _context, _context2, _context3;

  var key = _ref2.key,
      val = _ref2.val;
  return (0, _concat["default"])(_context = (0, _concat["default"])(_context2 = (0, _concat["default"])(_context3 = "".concat(prevStr, "\n * @param ")).call(_context3, key, " (")).call(_context2, exports.typeMap(val, "strict"), ") ")).call(_context, val.description || "暂无注释");
};

exports.noteConcat = noteConcat;
/**
 * 拼接接口字符串
 * @param param0
 * @param prevStr 上次保存的string
 */

var tsConcat = function tsConcat(_ref3, prevStr) {
  var _context4, _context5;

  var key = _ref3.key,
      val = _ref3.val;
  return (0, _concat["default"])(_context4 = (0, _concat["default"])(_context5 = "".concat(prevStr, "\n    ")).call(_context5, key, ": ")).call(_context4, exports.typeMap(val), ";");
};

exports.tsConcat = tsConcat;
/**
 * 一个完整的接口字符串（注释+接口）
 * @param key
 * @param val
 */

var completeInterface = function completeInterface(key, val) {
  var _context6, _context7;

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

  return (0, _concat["default"])(_context6 = (0, _concat["default"])(_context7 = "/**".concat(noteStr, "\n */ \nexport interface ")).call(_context7, common_1.handleSpecialSymbol(key), " {")).call(_context6, tsStr, "\n}\n");
};

exports.completeInterface = completeInterface;
/**
 * 当前swagger所有的接口 写入文件夹
 * @param interfaceObj 接口对象
 * @param options 接口对象
 */

var completeInterfaceAll = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(interfaceObj, options) {
    var newOptions, str, key;
    return _regenerator["default"].wrap(function _callee$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            newOptions = _objectSpread({
              path: "./",
              name: "name"
            }, options || {});
            str = "";

            for (key in interfaceObj.data) {
              str += exports.completeInterface(key, interfaceObj.data[key]) + "\n";
            }

            _context8.prev = 3;
            _context8.next = 6;
            return new _promise["default"](function (resolve, reject) {
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
            _context8.next = 11;
            break;

          case 9:
            _context8.prev = 9;
            _context8.t0 = _context8["catch"](3);

          case 11:
          case "end":
            return _context8.stop();
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
  var _context9;

  var mySet = new _set["default"](serverList);
  return (0, _map["default"])(_context9 = (0, _filter["default"])(appList).call(appList, function (el) {
    if ((0, _apply["default"])(Object.prototype.toString, [], el.instance) === "[object Array]" && el.instance.length > 0) {
      el.instance = el.instance[0];
    }

    return mySet.has(el.instance.vipAddress);
  })).call(_context9, function (el) {
    return {
      serviceName: el.instance.vipAddress,
      serviceUrl: el.instance.homePageUrl
    };
  });
};

exports.handleServiceUrl = handleServiceUrl;