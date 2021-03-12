"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _set = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

(0, _defineProperty["default"])(exports, "__esModule", {
  value: true
});
exports.exchangeZhToEn = exports.translateAndChangeChinese = exports.collectChinese = void 0;

var path = require("path");
/**
 * 收集所有中文列表
 */


var collectChinese = function collectChinese(values) {
  var chineseSet = new _set["default"]();
  (0, _map["default"])(values).call(values, function (item) {
    for (var key in item === null || item === void 0 ? void 0 : item.data) {
      var _context;

      var all = (0, _map["default"])(_context = (0, _toConsumableArray2["default"])(key.matchAll(/[\u4e00-\u9fa5]+/g))).call(_context, function (el) {
        return el[0];
      });
      (0, _map["default"])(all).call(all, function (el) {
        return chineseSet.add(el);
      });
    }

    for (var _key in item === null || item === void 0 ? void 0 : item.paths) {
      var val = item.paths[_key];
      var method = void 0;

      for (method in val) {
        var _context2;

        var dto = "";

        if (val[method] && val[method].responses && val[method].responses[200] && val[method].responses[200].schema) {
          if (val[method].responses[200].schema.$ref) {
            dto = val[method].responses[200].schema.$ref.split("/")[2];
          }

          if (val[method].responses[200].schema.items) {
            dto = val[method].responses[200].schema.items.$ref ? val[method].responses[200].schema.items.$ref.split("/")[2] : "";
          }
        }

        var _all = (0, _map["default"])(_context2 = (0, _toConsumableArray2["default"])(dto.matchAll(/[\u4e00-\u9fa5]+/g))).call(_context2, function (el) {
          return el[0];
        });

        (0, _map["default"])(_all).call(_all, function (el) {
          return chineseSet.add(el);
        });
      }
    }
  });
  return (0, _from["default"])((0, _values["default"])(chineseSet).call(chineseSet));
};

exports.collectChinese = collectChinese;

var translateAndChangeChinese = function translateAndChangeChinese(values, zhToEnMap) {
  (0, _map["default"])(values).call(values, function (item) {
    for (var key in item === null || item === void 0 ? void 0 : item.data) {
      var replaceStr = exports.exchangeZhToEn(key, zhToEnMap);

      if (item.data[key].properties) {
        for (var key2 in item.data[key].properties) {
          var _result$items;

          //
          var replaceStr2 = exports.exchangeZhToEn(key2, zhToEnMap);
          var result = item.data[key].properties[key2];

          if (result.$ref) {
            result.$ref = exports.exchangeZhToEn(result.$ref, zhToEnMap).str;
          }

          if (result !== null && result !== void 0 && (_result$items = result.items) !== null && _result$items !== void 0 && _result$items.$ref) {
            item.data[key].properties[key2].items.$ref = exports.exchangeZhToEn(result.items.$ref, zhToEnMap).str;
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
            _result.responses[200].schema.$ref = exports.exchangeZhToEn(_result.responses[200].schema.$ref, zhToEnMap).str;
          }

          if (_result.responses[200].schema.items) {
            val[method].responses[200].schema.items.$ref = exports.exchangeZhToEn(_result.responses[200].schema.items.$ref, zhToEnMap).str;
          }
        }

        val[method] = _result;
      }

      item.paths[_key2] = val;
    } // console.log(JSON.stringify(item.data, null, 2), "paths");

  });
};

exports.translateAndChangeChinese = translateAndChangeChinese;
/**
 * 根据中英文映射对象，替换掉中文部分，返回新的字符串
 * @param str 待修改的字符串
 * @param zhToEnMap 中英文映射对象
 */

var exchangeZhToEn = function exchangeZhToEn(str, zhToEnMap) {
  var _context3;

  if (typeof str !== "string") return {
    hasZh: false,
    str: ""
  };
  var list = (0, _map["default"])(_context3 = (0, _toConsumableArray2["default"])(str.matchAll(/[\u4e00-\u9fa5]+/g))).call(_context3, function (el) {
    return el[0];
  });
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