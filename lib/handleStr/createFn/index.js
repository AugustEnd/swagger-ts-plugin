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
exports.outputApi = exports.humpName = exports.interfaceApisType = exports.getApiImport = exports.exportApi = exports.exportFn = exports.exportMaps = exports.export__switchMaps = exports.currentServiceFn = exports.buildFn = void 0;

var paths = require("path");

var fs = require("fs");

var buildFn = function buildFn(_ref) {
  var _context, _context2, _context3, _context4, _context5, _context6, _context7, _context8, _context9, _context10, _context11, _context12;

  var method = _ref.method,
      url = _ref.url,
      operationId = _ref.operationId,
      parameters = _ref.parameters,
      backParams = _ref.backParams,
      reqType = _ref.reqType,
      urlHeader = _ref.urlHeader;
  var queryInfo = reqType.query ? "for(let key in query){\nlet val = query[key as keyof typeof query];\nsearch = search ? (search + '&' + val).toString() : val.toString();\n}" : "";
  var fnStr = (0, _concat["default"])(_context = (0, _concat["default"])(_context2 = (0, _concat["default"])(_context3 = (0, _concat["default"])(_context4 = (0, _concat["default"])(_context5 = (0, _concat["default"])(_context6 = (0, _concat["default"])(_context7 = (0, _concat["default"])(_context8 = (0, _concat["default"])(_context9 = (0, _concat["default"])(_context10 = (0, _concat["default"])(_context11 = (0, _concat["default"])(_context12 = "export const ".concat(operationId, " = function(this:any,params:")).call(_context12, parameters, "):Promise<")).call(_context11, backParams, "> {\n        let { ")).call(_context10, reqType.query ? "query, " : "")).call(_context9, reqType.path ? "path, " : "", " ")).call(_context8, reqType.formData ? "formData, " : "")).call(_context7, reqType.body ? "body" : "", " } = params;\n        let url = \"")).call(_context6, url, "\";\n        ")).call(_context5, reqType.path ? "if( path ) {\n            url = pathAddToUrl(url, path);\n        }" : "", "\n        ")).call(_context4, method.toLowerCase() === "post" ? "let search = '';\n            ".concat(queryInfo, "\n        url = url + (search?'?'+search:'');\n        ") : "", "\n        return this.__http.")).call(_context3, method, "( \"/api/")).call(_context2, urlHeader, "\" + url,")).call(_context, method === "get" ? reqType.query ? "query" : "" : reqType.formData ? "formData" : reqType.body ? "body" : "", ") as any;\n    };\n");
  return {
    operationId: operationId,
    url: url,
    fnStr: fnStr
  };
};

exports.buildFn = buildFn;

var currentServiceFn = function currentServiceFn(list, importList) {
  var _context13, _context14, _context15, _context16;

  var fnIds = []; // 路由和operationId映射；

  var urlToIdmaps = {};
  var str = (0, _reduce["default"])(list).call(list, function (prev, next) {
    var _exports$buildFn = exports.buildFn(next),
        fnStr = _exports$buildFn.fnStr,
        operationId = _exports$buildFn.operationId,
        url = _exports$buildFn.url;

    fnIds.push({
      operationId: operationId,
      url: url
    });
    urlToIdmaps[operationId] = url;
    return prev += fnStr;
  }, "");
  return (0, _concat["default"])(_context13 = (0, _concat["default"])(_context14 = (0, _concat["default"])(_context15 = (0, _concat["default"])(_context16 = "import {".concat(importList.join(","), "} from './interface.d';\n\n    // \u628A\u52A8\u6001\u8DEF\u7531\u52A0\u5165\u5230url\u4E2D\n    const pathAddToUrl = (url: string, pathObj: any): string => {\n        let reqList = [...url.matchAll(/{[0-9A-Za-z]+}/g)].map((el) => el[0]);\n\n        return reqList.reduce(\n            (prev, next) =>\n                prev.replace(\n                    new RegExp(next),\n                    pathObj[next.slice(1, next.length - 1)]\n                ),\n            url\n        );\n    };\n    \n    ")).call(_context16, str, "\n    ")).call(_context15, exports.export__switchMaps(urlToIdmaps), "\n    ")).call(_context14, exports.exportMaps(urlToIdmaps), " ")).call(_context13, exports.exportFn(fnIds));
};

exports.currentServiceFn = currentServiceFn;

var export__switchMaps = function export__switchMaps(obj) {
  var _context17;

  return "export interface __switchMaps {".concat((0, _reduce["default"])(_context17 = (0, _keys["default"])(obj)).call(_context17, function (prev, next) {
    var _context18;

    return prev += (0, _concat["default"])(_context18 = "\"".concat(obj[next], "\": typeof ")).call(_context18, next, ";");
  }, ""), "}");
};

exports.export__switchMaps = export__switchMaps;

var exportMaps = function exportMaps(obj) {
  return "export const __urlMaps = ".concat((0, _stringify["default"])(obj), "\n");
};

exports.exportMaps = exportMaps;

var exportFn = function exportFn(ids) {
  var _context19;

  global.options.outputPath;
  return "export default function<T> (http:T) {\n        return {\n        ".concat((0, _reduce["default"])(_context19 = (0, _concat["default"])(ids).call(ids, {
    operationId: "http",
    url: "__http"
  })).call(_context19, function (prev, next) {
    var _context20, _context21, _context22;

    // 使用id作为标识
    // return prev ? prev + ", " + next.operationId : next.operationId;
    // 使用url作为标识
    return prev ? (0, _concat["default"])(_context20 = (0, _concat["default"])(_context21 = "".concat(prev, ", \"")).call(_context21, next.url, "\":")).call(_context20, next.operationId) : (0, _concat["default"])(_context22 = "\"".concat(next.url, "\":")).call(_context22, next.operationId);
  }, ""), "\n        }\n    }");
};

exports.exportFn = exportFn;

var exportApi = function exportApi() {
  var _context23, _context24, _context25;

  var list = global.options.apiDocList;
  return (0, _concat["default"])(_context23 = (0, _concat["default"])(_context24 = (0, _concat["default"])(_context25 = "".concat(exports.getApiImport(), "\ninterface APIType {\n    ")).call(_context25, (0, _reduce["default"])(list).call(list, function (prev, next) {
    var _context26;

    return prev += (0, _concat["default"])(_context26 = "".concat(exports.humpName(next.serviceName), ": ReturnType<typeof ")).call(_context26, exports.humpName(next.serviceName), "Fn>;\n");
  }, ""), "\n}\n\nexport default function API<T>(this: any, http: T): APIType {\n")).call(_context24, (0, _reduce["default"])(list).call(list, function (prev, next) {
    var _context27;

    return prev += (0, _concat["default"])(_context27 = "const ".concat(exports.humpName(next.serviceName), " = ")).call(_context27, exports.humpName(next.serviceName), "Fn<T>(http);\n");
  }, ""), "\n    return {\n        ")).call(_context23, (0, _map["default"])(list).call(list, function (el) {
    return exports.humpName(el.serviceName);
  }).join(","), "\n    };\n}");
};

exports.exportApi = exportApi; // import 所有服务的方法

var getApiImport = function getApiImport() {
  var list = global.options.apiDocList;
  return (0, _reduce["default"])(list).call(list, function (prev, next) {
    var _context28;

    return prev += (0, _concat["default"])(_context28 = "import ".concat(exports.humpName(next.serviceName), "Fn from './")).call(_context28, next.serviceName, "/function';\n");
  }, "");
};

exports.getApiImport = getApiImport; // 定义

var interfaceApisType = function interfaceApisType() {
  var list = global.options.apiDocList;

  var foreachObj = function foreachObj(maps, name) {
    var objStr = "";

    for (var key in maps) {
      var _context29, _context30;

      objStr += (0, _concat["default"])(_context29 = (0, _concat["default"])(_context30 = "\"".concat(maps[key], "\": typeof ")).call(_context30, name, ".")).call(_context29, key, ";\n");
    }

    return objStr;
  };

  return "interface APIServiceType {\n        fsService: {\n            \"/sds/sdf/{sd}\": typeof fsService.saveUploadFileInfoUsingPOST_1;\n        };";
};

exports.interfaceApisType = interfaceApisType;

var humpName = function humpName(name) {
  var _context31, _context32;

  var str = name.toLowerCase();
  return (0, _reduce["default"])(_context31 = (0, _map["default"])(_context32 = str.split("-")).call(_context32, function (el) {
    return el.replace(/\W/g, "");
  })).call(_context31, function (prev, next) {
    return prev ? prev + (next[0].toUpperCase() + (0, _slice["default"])(next).call(next, 1)) : next;
  }, "");
};

exports.humpName = humpName;

var outputApi = function outputApi() {
  var str = exports.exportApi();
  fs.writeFile(paths.resolve(global.options.outputPath, "swagger2ts/request.ts"), str, function (err) {
    console.log(err);
  });
};

exports.outputApi = outputApi; // export const ${operationId} = (params:${parameters}):Promise<${backParams}> => {
//     // 把动态路由加入到url中
//     const pathAddToUrl = (url: string, pathObj: any): string => {
//         let reqList = [...url.matchAll(/\{[0-9A-Za-z]+\}/g)].map((el) => el[0]);
//         return reqList.reduce(
//             (prev, next) =>
//                 prev.replace(
//                     new RegExp(next),
//                     pathObj[next.slice(1, next.length - 1)]
//                 ),
//             url
//         );
//     };
//     let { query, path, formData, body } = params;
//     let url = "${url}";
//     if( path ) {
//         url = pathAddToUrl(url, path);
//     }
//     if("post"){
//         let search = '';
//         for(let key in query){
//             let val = query[key]
//             search = search ? search + '&' + val : val;
//         }
//         url = url + (search?'?'+search:'');
//         query = body || {} as any;
//     }
//     return http[method](url,query) as any;
// }