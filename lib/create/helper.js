"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _set = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

(0, _defineProperty["default"])(exports, "__esModule", {
  value: true
});
exports.exchangeZhToEn = exports.translateAndChangeChinese = exports.traverseOriginData = exports.collectChinese = void 0;

var common_1 = require("../utils/common");
/**
 * 收集所有中文列表
 */


var collectChinese = function collectChinese(values) {
  var chineseSet = new _set["default"]();
  (0, _map["default"])(values).call(values, function (item) {
    for (var key in item === null || item === void 0 ? void 0 : item.data) {
      var _context;

      (0, _map["default"])(_context = common_1.handleSpecialSymbol(key).match(/[\u4e00-\u9fa5]+/g) || []).call(_context, function (el) {
        return chineseSet.add(el);
      });
    }

    for (var _key in item === null || item === void 0 ? void 0 : item.paths) {
      var val = item.paths[_key];
      var method = void 0;

      for (method in val) {
        var _val$method, _val$method$responses, _val$method$responses2;

        var dto = "";

        if ((_val$method = val[method]) !== null && _val$method !== void 0 && (_val$method$responses = _val$method.responses) !== null && _val$method$responses !== void 0 && (_val$method$responses2 = _val$method$responses[200]) !== null && _val$method$responses2 !== void 0 && _val$method$responses2.schema) {
          var _val$method2, _val$method2$response, _val$method2$response2;

          var _val$method$responses3 = (_val$method2 = val[method]) === null || _val$method2 === void 0 ? void 0 : (_val$method2$response = _val$method2.responses) === null || _val$method2$response === void 0 ? void 0 : (_val$method2$response2 = _val$method2$response[200]) === null || _val$method2$response2 === void 0 ? void 0 : _val$method2$response2.schema,
              $ref = _val$method$responses3.$ref,
              items = _val$method$responses3.items;

          if ($ref) {
            dto = $ref.split("/")[2];
          }

          if (items) {
            dto = items.$ref ? items.$ref.split("/")[2] : "";
          }
        }

        dto.replace(/[\u4e00-\u9fa5]+/g, function (el) {
          chineseSet.add(el);
          return el;
        });
      }
    }
  });
  return (0, _from["default"])((0, _values["default"])(chineseSet).call(chineseSet));
};

exports.collectChinese = collectChinese;

var traverseOriginData = function traverseOriginData(item) {};

exports.traverseOriginData = traverseOriginData;

var translateAndChangeChinese = function translateAndChangeChinese(values) {
  (0, _map["default"])(values).call(values, function (item) {
    for (var key in item === null || item === void 0 ? void 0 : item.data) {
      var newKey = common_1.handleSpecialSymbol(key);
      var replaceStr = exports.exchangeZhToEn(newKey);

      if (item.data[key].properties) {
        for (var key2 in item.data[key].properties) {
          var _result$items;

          //
          var replaceStr2 = exports.exchangeZhToEn(key2);
          var result = item.data[key].properties[key2];

          if (result.$ref) {
            result.$ref = exports.exchangeZhToEn(result.$ref).str;
          }

          if (result !== null && result !== void 0 && (_result$items = result.items) !== null && _result$items !== void 0 && _result$items.$ref) {
            item.data[key].properties[key2].items.$ref = exports.exchangeZhToEn(result.items.$ref).str;
          }

          if (replaceStr2.hasZh) {
            item.data[key].properties[replaceStr2.str] = result;
            delete item.data[key].properties[key2];
          } else {
            item.data[key].properties[key2] = result;
          }
        }
      }

      if (replaceStr.hasZh) {
        item.data[replaceStr.str] = item.data[key];
        delete item.data[key];
      }
    }

    for (var _key2 in item === null || item === void 0 ? void 0 : item.paths) {
      var val = item.paths[_key2];
      var method = void 0;

      for (method in val) {
        var _result = val[method];

        if (_result && _result.responses && _result.responses[200] && _result.responses[200].schema) {
          if (_result.responses[200].schema.$ref) {
            _result.responses[200].schema.$ref = exports.exchangeZhToEn(_result.responses[200].schema.$ref).str;
          }

          if (_result.responses[200].schema.items) {
            val[method].responses[200].schema.items.$ref = exports.exchangeZhToEn(_result.responses[200].schema.items.$ref).str;
          }
        }

        val[method] = _result;
      }

      item.paths[_key2] = val;
    } // console.log(JSON.stringify(item.data, null, 2), "paths");

  }); // fs.writeFile(
  //     paths.resolve(__dirname, `./a.json`),
  //     JSON.stringify(values, null, 4),
  //     () => {}
  // );
};

exports.translateAndChangeChinese = translateAndChangeChinese;
/**
 * 根据中英文映射对象，替换掉中文部分，返回新的字符串
 * @param str 待修改的字符串
 * @param zhToEnMap 中英文映射对象
 */

var exchangeZhToEn = function exchangeZhToEn(str) {
  var _global$swagger2globa;

  var zhToEnMap = ((_global$swagger2globa = global.swagger2global) === null || _global$swagger2globa === void 0 ? void 0 : _global$swagger2globa.transitions) || {};
  if (typeof str !== "string") return {
    hasZh: false,
    str: ""
  };
  var list = str.match(/[\u4e00-\u9fa5]+/g) || [];
  (0, _map["default"])(list).call(list, function (el) {
    var val = zhToEnMap[el];
    if (val) str = str.replace(new RegExp(el), val);
  });
  return {
    hasZh: list.length > 0,
    str: str
  };
};

exports.exchangeZhToEn = exchangeZhToEn;