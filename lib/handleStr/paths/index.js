"use strict";

var _Object$keys2 = require("@babel/runtime-corejs3/core-js-stable/object/keys");

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

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));

var _set = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));

var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));

function ownKeys(object, enumerableOnly) { var keys = _Object$keys2(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); if (enumerableOnly) symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { var _context18; _forEachInstanceProperty(_context18 = ownKeys(Object(source), true)).call(_context18, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (_Object$getOwnPropertyDescriptors) { _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)); } else { var _context19; _forEachInstanceProperty(_context19 = ownKeys(Object(source))).call(_context19, function (key) { _Object$defineProperty2(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } } return target; }

(0, _defineProperty3["default"])(exports, "__esModule", {
  value: true
});
exports.requestType = exports.responseType = exports.completePathAll = exports.completePath = void 0;

var common_1 = require("../../utils/common");

var fs = require("fs");

var interface_1 = require("../interface");

var helper_1 = require("../../create/helper");

var index_1 = require("../createFn/index");

var createFn_1 = require("../createFn");

var varType = ["any", "string", "number", "boolean", "undefault", "null"];
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
  var list = [];
  var commonParam = [];

  for (var method in val) {
    var _context, _context2, _context3, _context4, _context5, _context6;

    if (method === "parameters") {
      commonParam = val[method];
      continue;
    } // 移除 已被弃用的接口


    if (val[method].deprecated) continue;
    var str = "";
    var _val$method = val[method],
        parameters = _val$method.parameters,
        responses = _val$method.responses,
        operationId = _val$method.operationId,
        summary = _val$method.summary,
        consumes = _val$method.consumes; // 出参

    var _exports$responseType = exports.responseType(responses),
        name = _exports$responseType.name,
        type = _exports$responseType.type;

    var importName = name; // 入参

    var paramObj = exports.requestType((0, _concat["default"])(commonParam).call(commonParam, parameters));
    var importNames = paramObj.importNames;
    str = (0, _concat["default"])(_context = (0, _concat["default"])(_context2 = (0, _concat["default"])(_context3 = (0, _concat["default"])(_context4 = (0, _concat["default"])(_context5 = (0, _concat["default"])(_context6 = "    \"".concat(key)).call(_context6, (0, _keys["default"])(val).length !== 1 ? "|".concat(method) : "", "\": {\n            method: \"")).call(_context5, method, "\";\n            parameters:")).call(_context4, paramObj.params, ",\n            paramsList:")).call(_context3, (0, _stringify["default"])(paramObj.reqType), "\n            operationId:\"")).call(_context2, operationId, "\",\n            data: ")).call(_context, type === "array" ? "Array<".concat(importName ? importName : null, ">") : importName ? importName : null, ";\n        };");
    importName && importNames.push(common_1.handleSpecialSymbol(importName));
    list.push({
      str: str,
      urlAsId: (0, _keys["default"])(val).length === 1,
      method: method,
      url: key,
      requestImportNames: importNames,
      parameters: paramObj.params,
      reqType: paramObj.reqType,
      backParams: type === "array" ? "Array<".concat(importName ? importName : null, ">") : importName ? importName : null,
      operationId: operationId,
      summary: summary,
      responseImportNames: importName ? [common_1.handleSpecialSymbol(importName)] : [],
      importName: importNames
    });
  }

  return list;
};

exports.completePath = completePath;
/**
 * 当前swagger所有的接口 写入文件夹
 * @param interfaceObj 接口对象
 * @param options 接口对象
 */

var completePathAll = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(paths, options) {
    var _context8;

    var newOptions, str, importSet, pathInfoList, key, onePaths, importList, fnStr;
    return _regenerator["default"].wrap(function _callee$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            newOptions = _objectSpread({
              rootPath: "./",
              name: "name"
            }, options || {});
            str = "";
            importSet = new _set["default"]();
            pathInfoList = [];

            for (key in paths) {
              onePaths = exports.completePath(key, paths[key]);
              (0, _map["default"])(onePaths).call(onePaths, function (onePath) {
                var _context7;

                (0, _map["default"])(_context7 = onePath.importName).call(_context7, function (el) {
                  return el && importSet.add(helper_1.exchangeZhToEn(el).str);
                });
                pathInfoList.push(_objectSpread(_objectSpread({}, onePath), {}, {
                  urlHeader: options === null || options === void 0 ? void 0 : options.name
                }));
                str += onePath.str + "\n";
              });
            }

            importList = (0, _from["default"])((0, _values["default"])(importSet).call(importSet));
            str = (0, _concat["default"])(_context8 = "import {".concat(importList.join(","), "} from './interface.d';\nexport interface pathsObj {\n")).call(_context8, str, "}"); // 当前服务所有请求函数

            fnStr = createFn_1.currentServiceFn(pathInfoList, importList);
            _context9.prev = 8;
            _context9.next = 11;
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

          case 11:
            _context9.next = 13;
            return _promise["default"].all([new _promise["default"](function (resolve, reject) {
              fs.writeFile([newOptions.rootPath, newOptions.name, "paths.ts"].join("/"), str, function (err) {
                if (err) reject(err);
                resolve(null);
              });
            }), new _promise["default"](function (resolve, reject) {
              fs.writeFile([newOptions.rootPath, newOptions.name, "function.ts"].join("/"), fnStr, function (err) {
                if (err) reject(err);
                resolve(null);
              });
            })]);

          case 13:
            index_1.outputApi();
            _context9.next = 18;
            break;

          case 16:
            _context9.prev = 16;
            _context9.t0 = _context9["catch"](8);

          case 18:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee, null, [[8, 16]]);
  }));

  return function completePathAll(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.completePathAll = completePathAll;
/**
 * 处理出参相关
 * @param responses 出参
 * @returns
 */

var responseType = function responseType(responses) {
  var _responses$;

  var dto = null;
  var type;

  if (responses && responses !== null && responses !== void 0 && (_responses$ = responses[200]) !== null && _responses$ !== void 0 && _responses$.schema) {
    var _responses$200$schema, _responses$200$schema2;

    if ((_responses$200$schema = responses[200].schema) !== null && _responses$200$schema !== void 0 && _responses$200$schema.$ref) {
      dto = responses === null || responses === void 0 ? void 0 : responses[200].schema.$ref.split("/")[2];
    }

    if ((_responses$200$schema2 = responses[200].schema) !== null && _responses$200$schema2 !== void 0 && _responses$200$schema2.items) {
      dto = responses[200].schema.items.$ref ? responses[200].schema.items.$ref.split("/")[2] : null;
      type = responses[200].schema.type;
    }
  }

  return {
    name: common_1.handleSpecialSymbol(dto),
    type: type
  };
};

exports.responseType = responseType;
/**
 * 处理入参相关
 * @param parameters
 */

var requestType = function requestType(parameters) {
  var _context15, _context16, _context17;

  // 上传文件
  var formData = (0, _filter["default"])(parameters).call(parameters, function (el) {
    return el["in"] === "formData";
  }); // 请求body

  var body = (0, _filter["default"])(parameters).call(parameters, function (el) {
    return el["in"] === "body";
  }); // url上search

  var query = (0, _filter["default"])(parameters).call(parameters, function (el) {
    return el["in"] === "query";
  }); // 路由上的参数

  var path = (0, _filter["default"])(parameters).call(parameters, function (el) {
    return el["in"] === "path";
  });
  var collectNames = new _set["default"]();
  var queryStr = (0, _reduce["default"])(query).call(query, function (a, b) {
    var _context10, _context11, _context12;

    return (0, _concat["default"])(_context10 = (0, _concat["default"])(_context11 = (0, _concat["default"])(_context12 = "".concat(a, "\"")).call(_context12, b.name, "\"")).call(_context11, !b.required ? "?" : "", ": ")).call(_context10, interface_1.switchType(b.type, undefined, "strict", b.required, b === null || b === void 0 ? void 0 : b["enum"], undefined), ";");
  }, "");
  var pathStr = (0, _reduce["default"])(path).call(path, function (a, b) {
    var _context13, _context14;

    return (0, _concat["default"])(_context13 = (0, _concat["default"])(_context14 = "".concat(a)).call(_context14, b.name, ": ")).call(_context13, interface_1.switchType(b.type, undefined, "strict", b.required, b === null || b === void 0 ? void 0 : b["enum"], undefined), ";");
  }, "");
  var bodyStr = (0, _reduce["default"])(body).call(body, function (a, b) {
    if (b !== null && b !== void 0 && b.schema) {
      var _b$schema, _b$schema$$ref, _b$schema2;

      var name = interface_1.switchType(b.type, ((_b$schema = b.schema) === null || _b$schema === void 0 ? void 0 : (_b$schema$$ref = _b$schema.$ref) === null || _b$schema$$ref === void 0 ? void 0 : _b$schema$$ref.split("/")[2]) || null, "strict", b.required, b === null || b === void 0 ? void 0 : b["enum"], function (name) {
        collectNames.add(common_1.handleSpecialSymbol(name));
      });

      if (((_b$schema2 = b.schema) === null || _b$schema2 === void 0 ? void 0 : _b$schema2.type) === "array") {
        var _b$schema3, _b$schema3$items, _b$schema4, _b$schema4$items;

        var type = (_b$schema3 = b.schema) !== null && _b$schema3 !== void 0 && (_b$schema3$items = _b$schema3.items) !== null && _b$schema3$items !== void 0 && _b$schema3$items.$ref ? helper_1.exchangeZhToEn(name).str : (_b$schema4 = b.schema) === null || _b$schema4 === void 0 ? void 0 : (_b$schema4$items = _b$schema4.items) === null || _b$schema4$items === void 0 ? void 0 : _b$schema4$items.type;
        return "Array<".concat((0, _includes["default"])(varType).call(varType, type) ? type : "Partial<".concat(type, ">"), ">;");
      } else {
        var _type = helper_1.exchangeZhToEn(name).str;
        return "".concat((0, _includes["default"])(varType).call(varType, _type) ? _type : "Partial<".concat(_type, ">"), ";\n");
      }
    }
  }, "");
  var formDataStr = (0, _reduce["default"])(formData).call(formData, function (a, b) {
    return "FormData;\n";
  }, "");
  return {
    params: (0, _concat["default"])(_context15 = (0, _concat["default"])(_context16 = (0, _concat["default"])(_context17 = "{".concat(queryStr ? "\n            query:{\n                ".concat(queryStr, "\n            };") : "")).call(_context17, pathStr ? "\n            path:{\n                ".concat(pathStr, "\n            }") : "")).call(_context16, bodyStr ? "\n            body:".concat(bodyStr, "\n            ") : "")).call(_context15, formDataStr ? "formData: ".concat(formDataStr) : "", "\n        }"),
    reqType: {
      query: !!queryStr,
      path: !!pathStr,
      body: !!bodyStr,
      formData: !!formDataStr
    },
    importNames: (0, _from["default"])((0, _values["default"])(collectNames).call(collectNames))
  };
};

exports.requestType = requestType;