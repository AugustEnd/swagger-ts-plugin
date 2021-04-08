"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

(0, _defineProperty["default"])(exports, "__esModule", {
  value: true
});
exports.outputApi = exports.humpName = exports.interfaceApisType = exports.getApiImport = exports.exportApi = exports.exportFn = exports.exportMaps = exports.exportSwitchMaps = exports.currentServiceFn = exports.buildFn = void 0;

var paths = require("path");

var fs = require("fs");

var buildFn = function buildFn(_ref) {
  var _context, _context2, _context3, _context4, _context5, _context6, _context7, _context8, _context9, _context10, _context11, _context12, _context13;

  var method = _ref.method,
      url = _ref.url,
      operationId = _ref.operationId,
      summary = _ref.summary,
      parameters = _ref.parameters,
      backParams = _ref.backParams,
      reqType = _ref.reqType,
      urlHeader = _ref.urlHeader,
      urlAsId = _ref.urlAsId;
  var queryInfo = reqType.query ? "for(let key in query){\nlet val = query[key as keyof typeof query];\nsearch = search ? (search + '&' + val).toString() : val.toString();\n}" : "";
  var fnStr = (0, _concat["default"])(_context = (0, _concat["default"])(_context2 = (0, _concat["default"])(_context3 = (0, _concat["default"])(_context4 = (0, _concat["default"])(_context5 = (0, _concat["default"])(_context6 = (0, _concat["default"])(_context7 = (0, _concat["default"])(_context8 = (0, _concat["default"])(_context9 = (0, _concat["default"])(_context10 = (0, _concat["default"])(_context11 = (0, _concat["default"])(_context12 = (0, _concat["default"])(_context13 = "\n\n/**\n * \u5907\u6CE8\uFF1A".concat(summary, "\n */\nexport const ")).call(_context13, operationId, " = function(this:any,params:")).call(_context12, parameters, "):Promise<")).call(_context11, backParams, "> {\n    let { ")).call(_context10, reqType.query ? "query, " : "")).call(_context9, reqType.path ? "path, " : "", " ")).call(_context8, reqType.formData ? "formData, " : "")).call(_context7, reqType.body ? "body" : "", " } = params;\n        let url = \"")).call(_context6, url, "\";\n        ")).call(_context5, reqType.path ? "if( path ) {\n            url = pathAddToUrl(url, path);\n        }" : "", "\n        ")).call(_context4, method.toLowerCase() === "post" ? "let search = '';\n            ".concat(queryInfo, "\n        url = url + (search?'?'+search:'');\n        ") : "", "\n        return this.__http.")).call(_context3, method, "( \"/")).call(_context2, urlHeader, "\" + url,")).call(_context, method === "get" ? reqType.query ? "query" : "" : reqType.formData ? "formData" : reqType.body ? "body" : "", ") as any;\n    };\n");
  return {
    operationId: operationId,
    url: url,
    fnStr: fnStr,
    urlAsId: urlAsId,
    method: method
  };
};

exports.buildFn = buildFn;

var currentServiceFn = function currentServiceFn(list, importList) {
  var _context14, _context15;

  var fnIds = []; // 路由和operationId映射；

  var urlToIdmaps = {};
  var str = (0, _reduce["default"])(list).call(list, function (prev, next) {
    var _exports$buildFn = exports.buildFn(next),
        fnStr = _exports$buildFn.fnStr,
        operationId = _exports$buildFn.operationId,
        url = _exports$buildFn.url,
        urlAsId = _exports$buildFn.urlAsId,
        method = _exports$buildFn.method;

    fnIds.push({
      operationId: operationId,
      url: url,
      urlAsId: urlAsId,
      method: method
    });
    urlToIdmaps[operationId] = url;
    return prev += fnStr;
  }, "");
  return (0, _concat["default"])(_context14 = (0, _concat["default"])(_context15 = "import {".concat(importList.join(","), "} from './interface.d';\n\n// \u628A\u52A8\u6001\u8DEF\u7531\u52A0\u5165\u5230url\u4E2D\nconst pathAddToUrl = (url: string, pathObj: any): string =>\n    url.replace(\n        /{[0-9A-Za-z]+}/g,\n        (val) => pathObj[val.slice(1, val.length - 1)]\n    );\n    \n")).call(_context15, str, "\n    ")).call(_context14, exports.exportFn(fnIds));
};

exports.currentServiceFn = currentServiceFn; // ${exportSwitchMaps(urlToIdmaps)}
// ${exportMaps(urlToIdmaps)}
// operationId对应函数的类型

var exportSwitchMaps = function exportSwitchMaps(obj) {
  var _context16;

  return "export interface __switchMaps {".concat((0, _reduce["default"])(_context16 = (0, _keys["default"])(obj)).call(_context16, function (prev, next) {
    var _context17;

    return prev += (0, _concat["default"])(_context17 = "\"".concat(obj[next], "\": typeof ")).call(_context17, next, ";");
  }, ""), "}");
};

exports.exportSwitchMaps = exportSwitchMaps; // operationId与url映射

var exportMaps = function exportMaps(obj) {
  return "export const __urlMaps = ".concat((0, _stringify["default"])(obj), "\n");
};

exports.exportMaps = exportMaps;

var exportFn = function exportFn(ids) {
  var _context18;

  global.options.outputPath;
  return "export default function<T> (http:T) {\n        return {\n        ".concat((0, _reduce["default"])(_context18 = (0, _concat["default"])(ids).call(ids, {
    operationId: "http",
    url: "__http",
    urlAsId: true
  })).call(_context18, function (prev, next) {
    var _context19, _context20, _context21, _context22, _context23;

    // 使用id作为标识
    // return prev ? prev + ", " + next.operationId : next.operationId;
    // 使用url作为标识
    var extra = !next.urlAsId ? "|" + next.method : "";
    return prev ? (0, _concat["default"])(_context19 = (0, _concat["default"])(_context20 = (0, _concat["default"])(_context21 = "".concat(prev, ", \"")).call(_context21, next.url)).call(_context20, extra, "\":")).call(_context19, next.operationId) : (0, _concat["default"])(_context22 = (0, _concat["default"])(_context23 = "\"".concat(next.url)).call(_context23, extra, "\":")).call(_context22, next.operationId);
  }, ""), "\n        }\n    }");
};

exports.exportFn = exportFn;

var exportApi = function exportApi() {
  var _context24, _context25, _context26;

  var list = global.options.apiDocList;
  return (0, _concat["default"])(_context24 = (0, _concat["default"])(_context25 = (0, _concat["default"])(_context26 = "".concat(exports.getApiImport(), "\ninterface APIType {\n    ")).call(_context26, (0, _reduce["default"])(list).call(list, function (prev, next) {
    var _context27;

    return prev += (0, _concat["default"])(_context27 = "".concat(exports.humpName(next.serviceName), ": ReturnType<typeof ")).call(_context27, exports.humpName(next.serviceName), "Fn>;\n");
  }, ""), "\n}\n\nexport default function API<T>(http: T): APIType {\n")).call(_context25, (0, _reduce["default"])(list).call(list, function (prev, next) {
    var _context28;

    return prev += (0, _concat["default"])(_context28 = "const ".concat(exports.humpName(next.serviceName), " = ")).call(_context28, exports.humpName(next.serviceName), "Fn<T>(http);\n");
  }, ""), "\n    return {\n        ")).call(_context24, (0, _map["default"])(list).call(list, function (el) {
    return exports.humpName(el.serviceName);
  }).join(","), "\n    };\n}");
};

exports.exportApi = exportApi; // import 所有服务的方法

var getApiImport = function getApiImport() {
  var list = global.options.apiDocList;
  return (0, _reduce["default"])(list).call(list, function (prev, next) {
    var _context29;

    return prev += (0, _concat["default"])(_context29 = "import ".concat(exports.humpName(next.serviceName), "Fn from './")).call(_context29, next.serviceName, "/function';\n");
  }, "");
};

exports.getApiImport = getApiImport; // 定义

var interfaceApisType = function interfaceApisType() {
  var list = global.options.apiDocList;

  var foreachObj = function foreachObj(maps, name) {
    var objStr = "";

    for (var key in maps) {
      var _context30, _context31;

      objStr += (0, _concat["default"])(_context30 = (0, _concat["default"])(_context31 = "\"".concat(maps[key], "\": typeof ")).call(_context31, name, ".")).call(_context30, key, ";\n");
    }

    return objStr;
  };

  return "interface APIServiceType {\n        fsService: {\n            \"/sds/sdf/{sd}\": typeof fsService.saveUploadFileInfoUsingPOST_1;\n        };";
};

exports.interfaceApisType = interfaceApisType;

var humpName = function humpName(name) {
  var _context32, _context33;

  var str = name.toLowerCase();
  return (0, _reduce["default"])(_context32 = (0, _map["default"])(_context33 = str.split("-")).call(_context33, function (el) {
    return el.replace(/\W/g, "");
  })).call(_context32, function (prev, next) {
    return prev ? prev + (next[0].toUpperCase() + (0, _slice["default"])(next).call(next, 1)) : next;
  }, "");
};

exports.humpName = humpName;

var outputApi = function outputApi() {
  var str = exports.exportApi();
  fs.writeFile(paths.resolve(global.options.outputPath, "request.ts"), str, function (err) {
    console.log(err);
  });
};

exports.outputApi = outputApi; // export const ${operationId} = function(this:any,params:${parameters}):Promise<${backParams}> {
//     let { query, path, formData, body } = params;
//     let url = "${url}";
//     if( path ) {
//         url = pathAddToUrl(url, path);
//     }
//     if(method === "post"){
//         let search = '';
//         for(let key in query){
//             let val = query[key]
//             search = search ? search + '&' + val : val;
//         }
//         url = url + (search?'?'+search:'');
//     }
//     return this.__http[method](url,query) as any;
// }