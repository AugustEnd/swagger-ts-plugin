"use strict";

var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");

var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");

var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");

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

var _set = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); if (enumerableOnly) symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { var _context5; _forEachInstanceProperty(_context5 = ownKeys(Object(source), true)).call(_context5, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (_Object$getOwnPropertyDescriptors) { _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)); } else { var _context6; _forEachInstanceProperty(_context6 = ownKeys(Object(source))).call(_context6, function (key) { _Object$defineProperty2(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } } return target; }

(0, _defineProperty3["default"])(exports, "__esModule", {
  value: true
});
exports.completePathAll = exports.completePath = void 0;

var common_1 = require("../../utils/common");

var fs = require("fs");
/**
 * 拼接接口字符串
 * @param param0
 * @param prevStr 上次保存的string
 */
// export const tsConcat = (
//     { key, val }: { key: string; val: any },
//     prevStr: string
// ) => {
//     return `${prevStr}\n    ${key}: ${typeMap(val)};`;
// };

/**
 * 一个完整的接口字符串（注释+接口）
 * @param key
 * @param val
 */


var completePath = function completePath(key, val) {
  var str = "";
  var importName = "";
  var method;

  for (method in val) {
    var _context, _context2;

    var dto = null;
    var type = "";

    if (val[method] && val[method].responses && val[method].responses[200] && val[method].responses[200].schema) {
      if (val[method].responses[200].schema.$ref) {
        dto = val[method].responses[200].schema.$ref.split("/")[2];
      }

      if (val[method].responses[200].schema.items) {
        dto = val[method].responses[200].schema.items.$ref ? val[method].responses[200].schema.items.$ref.split("/")[2] : null;
        type = val[method].responses[200].schema.type;
      }
    }

    importName = common_1.handleSpecialSymbol(dto);
    str = (0, _concat["default"])(_context = (0, _concat["default"])(_context2 = "    \"".concat(key, "\": {\n        method: \"")).call(_context2, method, "\";\n        data: ")).call(_context, type === "array" ? "Array<".concat(importName ? importName : null, ">") : importName ? importName : null, ";\n    };");
  }

  return {
    str: str,
    importName: importName
  };
};

exports.completePath = completePath;
/**
 * 当前swagger所有的接口 写入文件夹
 * @param interfaceObj 接口对象
 * @param options 接口对象
 */

var completePathAll = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(paths, options) {
    var _context3;

    var newOptions, str, importSet, key, onePath;
    return _regenerator["default"].wrap(function _callee$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            newOptions = _objectSpread({
              path: "./",
              name: "name"
            }, options || {});
            str = "";
            importSet = new _set["default"]();

            for (key in paths) {
              onePath = exports.completePath(key, paths[key]);
              onePath.importName && importSet.add(onePath.importName);
              str += onePath.str + "\n";
            }

            str = (0, _concat["default"])(_context3 = "import {".concat((0, _from["default"])((0, _values["default"])(importSet).call(importSet)).join(","), "} from './interface.d';\ninterface pathsObj {\n")).call(_context3, str, "}");
            _context4.prev = 5;
            _context4.next = 8;
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

          case 8:
            fs.writeFile([newOptions.path, newOptions.name, "paths.ts"].join("/"), str, function () {});
            _context4.next = 13;
            break;

          case 11:
            _context4.prev = 11;
            _context4.t0 = _context4["catch"](5);

          case 13:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee, null, [[5, 11]]);
  }));

  return function completePathAll(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.completePathAll = completePathAll;