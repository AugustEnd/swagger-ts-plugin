"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

Object.defineProperty(exports, "__esModule", {
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
    str = "    \"".concat(key, "\": {\n        method: \"").concat(method, "\";\n        data: ").concat(type === "array" ? "Array<".concat(importName ? importName : null, ">") : importName ? importName : null, ";\n    };");
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
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(paths, options) {
    var newOptions, str, importSet, key, onePath;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            newOptions = _objectSpread({
              path: "./",
              name: "name"
            }, options || {});
            str = "";
            importSet = new Set();

            for (key in paths) {
              onePath = exports.completePath(key, paths[key]);
              onePath.importName && importSet.add(onePath.importName);
              str += onePath.str + "\n";
            }

            str = "import {".concat(Array.from(importSet.values()).join(","), "} from './interface.d';\ninterface pathsObj {\n").concat(str, "}");
            _context.prev = 5;
            _context.next = 8;
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

          case 8:
            fs.writeFile([newOptions.path, newOptions.name, "paths.ts"].join("/"), str, function () {});
            _context.next = 13;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](5);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[5, 11]]);
  }));

  return function completePathAll(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.completePathAll = completePathAll;