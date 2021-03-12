"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exchangeZhToEn = exports.translateAndChangeChinese = exports.collectChinese = void 0;

var path = require("path");
/**
 * 收集所有中文列表
 */


var collectChinese = function collectChinese(values) {
  var chineseSet = new Set();
  values.map(function (item) {
    for (var key in item === null || item === void 0 ? void 0 : item.data) {
      var all = _toConsumableArray(key.matchAll(/[\u4e00-\u9fa5]+/g)).map(function (el) {
        return el[0];
      });

      all.map(function (el) {
        return chineseSet.add(el);
      });
    }

    for (var _key in item === null || item === void 0 ? void 0 : item.paths) {
      var val = item.paths[_key];
      var method = void 0;

      for (method in val) {
        var dto = "";

        if (val[method] && val[method].responses && val[method].responses[200] && val[method].responses[200].schema) {
          if (val[method].responses[200].schema.$ref) {
            dto = val[method].responses[200].schema.$ref.split("/")[2];
          }

          if (val[method].responses[200].schema.items) {
            dto = val[method].responses[200].schema.items.$ref ? val[method].responses[200].schema.items.$ref.split("/")[2] : "";
          }
        }

        var _all = _toConsumableArray(dto.matchAll(/[\u4e00-\u9fa5]+/g)).map(function (el) {
          return el[0];
        });

        _all.map(function (el) {
          return chineseSet.add(el);
        });
      }
    }
  });
  return Array.from(chineseSet.values());
};

exports.collectChinese = collectChinese;

var translateAndChangeChinese = function translateAndChangeChinese(values, zhToEnMap) {
  values.map(function (item) {
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
  if (typeof str !== "string") return {
    hasZh: false,
    str: ""
  };

  var list = _toConsumableArray(str.matchAll(/[\u4e00-\u9fa5]+/g)).map(function (el) {
    return el[0];
  });

  list.map(function (el) {
    var val = zhToEnMap[el];
    if (val) str = str.replace(new RegExp(el), val);
  });
  return {
    hasZh: list.length > 0,
    str: str
  };
};

exports.exchangeZhToEn = exchangeZhToEn;