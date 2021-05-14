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

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _defineProperty3 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _set = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); if (enumerableOnly) symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { var _context15; _forEachInstanceProperty(_context15 = ownKeys(Object(source), true)).call(_context15, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (_Object$getOwnPropertyDescriptors) { _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)); } else { var _context16; _forEachInstanceProperty(_context16 = ownKeys(Object(source))).call(_context16, function (key) { _Object$defineProperty2(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } } return target; }

(0, _defineProperty3["default"])(exports, "__esModule", {
  value: true
});
exports.handleServiceUrl = exports.completeInterfaceAll = exports.completeInterface = exports.tsConcat = exports.noteConcat = exports.switchType = exports.typeMap = void 0;

var common_1 = require("../../utils/common");

var fs = require("fs");
/**
 * 映射后端语言类型与ts类型
 * @param param0
 * @param use 是否启用严格模式，正常模式 string|null or number|null等，严格模式 string or number等
 */


var typeMap = function typeMap(_ref, use, fn) {
  var _items$$ref;

  var type = _ref.type,
      items = _ref.items,
      required = _ref.required,
      enumType = _ref["enum"],
      $ref = _ref.$ref;
  var childProps = (items === null || items === void 0 ? void 0 : items.type) && exports.typeMap(items, "strict", fn) || (items === null || items === void 0 ? void 0 : (_items$$ref = items.$ref) === null || _items$$ref === void 0 ? void 0 : _items$$ref.split("/")[2]) || ($ref === null || $ref === void 0 ? void 0 : $ref.split("/")[2]) || null;
  return exports.switchType(type, childProps, use, required, enumType, fn);
};

exports.typeMap = typeMap;

var switchType = function switchType(type, childProps, use, required, enumType, fn) {
  switch (type) {
    case "string":
      if (enumType && enumType.length > 0) {
        return (0, _reduce["default"])(enumType).call(enumType, function (prev, next) {
          var _context;

          return prev ? (0, _concat["default"])(_context = "".concat(prev, " | \"")).call(_context, next, "\"") : "\"".concat(next, "\"");
        }, "");
      }

      return use === "strict" ? "string" : "string | null";

    case "number":
      return use === "strict" ? "number" : "number | null";

    case "integer":
      return use === "strict" ? "number" : "number | null";

    case "boolean":
      return use === "strict" ? "boolean" : "boolean | null";

    case "file":
      return use === "strict" ? "FormData" : "FormData | null";

    case "array":
      var name = common_1.handleSpecialSymbol(childProps);
      fn && fn(name);
      return use === "strict" ? "Array<".concat(name, ">") : "Array<".concat(name, "> | null");

    case "object":
      return "any";

    default:
      var nameDefault = common_1.handleSpecialSymbol(childProps);
      fn && fn(nameDefault);
      return nameDefault || "any";
  }
};

exports.switchType = switchType;
/**
 * 拼接注释字符串
 * @param param0
 * @param prevStr 上次保存的string
 */

var noteConcat = function noteConcat(_ref2, prevStr) {
  var _context2, _context3, _context4;

  var key = _ref2.key,
      val = _ref2.val;
  return (0, _concat["default"])(_context2 = (0, _concat["default"])(_context3 = (0, _concat["default"])(_context4 = "".concat(prevStr, "\n * @param ")).call(_context4, key, " (")).call(_context3, exports.typeMap(val, "strict"), ") ")).call(_context2, val.description || "暂无注释");
};

exports.noteConcat = noteConcat;
/**
 * 拼接接口字符串
 * @param param0
 * @param prevStr 上次保存的string
 */

var tsConcat = function tsConcat(_ref3, prevStr) {
  var _context5, _context6, _context7;

  var key = _ref3.key,
      val = _ref3.val;
  return (0, _concat["default"])(_context5 = (0, _concat["default"])(_context6 = (0, _concat["default"])(_context7 = "".concat(prevStr, "\n    ")).call(_context7, key)).call(_context6, val.required ? "" : "?", ": ")).call(_context5, exports.typeMap(val), ";");
};

exports.tsConcat = tsConcat;
/**
 * 一个完整的接口字符串（注释+接口）
 * @param key
 * @param val
 */

var completeInterface = function completeInterface(key, val) {
  var _context9, _context10;

  var noteList = [];
  var tsList = [];

  for (var _key in val.properties) {
    var _context8;

    var propsVal = val.properties[_key];
    var keyName = common_1.handleSpecialSymbol(_key);
    var required = propsVal.required === undefined && val.required && val.required.length > 0 ? (0, _includes["default"])(_context8 = val.required).call(_context8, _key) : !!propsVal.required;
    var noteOneStr = exports.noteConcat({
      key: keyName,
      val: _objectSpread(_objectSpread({}, propsVal), {}, {
        required: required
      })
    }, "");
    var tsOneStr = exports.tsConcat({
      key: keyName,
      val: _objectSpread(_objectSpread({}, propsVal), {}, {
        required: required
      })
    }, "");

    if (!required) {
      noteList.push(noteOneStr);
      tsList.push(tsOneStr);
    } else {
      noteList.unshift(noteOneStr);
      tsList.unshift(tsOneStr);
    }
  }

  return (0, _concat["default"])(_context9 = (0, _concat["default"])(_context10 = "/**".concat(noteList.join(), "\n */ \nexport interface ")).call(_context10, common_1.handleSpecialSymbol(key), " {")).call(_context9, tsList.join(""), "\n}\n");
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
    return _regenerator["default"].wrap(function _callee$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            newOptions = _objectSpread({
              rootPath: "./",
              name: "name"
            }, options || {});
            str = "";

            for (key in interfaceObj.data) {
              // console.log(key, "key");
              str += exports.completeInterface(key, interfaceObj.data[key]) + "\n";
            }

            _context11.prev = 3;
            _context11.next = 6;
            return new _promise["default"](function (resolve, reject) {
              fs.mkdir([newOptions.rootPath, newOptions.name].join("/"), {
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
            fs.writeFile([newOptions.rootPath, newOptions.name, "interface.d.ts"].join("/"), str, function () {});
            _context11.next = 12;
            break;

          case 9:
            _context11.prev = 9;
            _context11.t0 = _context11["catch"](3);
            console.log("error");

          case 12:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee, null, [[3, 9]]);
  }));

  return function completeInterfaceAll(_x, _x2) {
    return _ref4.apply(this, arguments);
  };
}();

exports.completeInterfaceAll = completeInterfaceAll; // 处理 serverList中只传服务地址的情况

var handleServiceUrl = function handleServiceUrl(appList) {
  var _context12, _context13, _context14;

  var serverList = global.options.serverList; // 保存，存在服务ip的数据

  var arrFilter = (0, _filter["default"])(_context12 = serverList || []).call(_context12, function (el) {
    return typeof el !== "string";
  });
  serverList = (0, _filter["default"])(serverList).call(serverList, function (el) {
    return typeof el === "string";
  });
  var mySet = new _set["default"](serverList);
  return (0, _concat["default"])(_context13 = (0, _map["default"])(_context14 = (0, _filter["default"])(appList).call(appList, function (el) {
    if ((0, _isArray["default"])(el.instance) && el.instance.length > 0) {
      el.instance = el.instance[0];
    }

    el.instance = el.instance;
    return mySet.has(el.instance.vipAddress);
  })).call(_context14, function (el) {
    if ((0, _isArray["default"])(el.instance) && el.instance.length > 0) {
      el.instance = el.instance[0];
    }

    el.instance = el.instance;
    return {
      serviceName: el.instance.vipAddress,
      serviceUrl: el.instance.homePageUrl
    };
  })).call(_context13, arrFilter);
};

exports.handleServiceUrl = handleServiceUrl;