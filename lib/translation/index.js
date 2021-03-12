"use strict";

var _sliceInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/slice");

var _Array$from = require("@babel/runtime-corejs3/core-js-stable/array/from");

var _Symbol = require("@babel/runtime-corejs3/core-js-stable/symbol");

var _getIteratorMethod = require("@babel/runtime-corejs3/core-js/get-iterator-method");

var _Array$isArray = require("@babel/runtime-corejs3/core-js-stable/array/is-array");

var _getIterator = require("@babel/runtime-corejs3/core-js/get-iterator");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));

var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof _Symbol === "undefined" || _getIteratorMethod(o) == null) { if (_Array$isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = _getIterator(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { var _context7; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = _sliceInstanceProperty(_context7 = Object.prototype.toString.call(o)).call(_context7, 8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return _Array$from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

(0, _defineProperty["default"])(exports, "__esModule", {
  value: true
});
exports.splitArray = exports.getTranslateJson = exports.getTranslateInfo = void 0;

var https = require("https");

var http = require("http");

var fs = require("fs");

var md5 = require("md5");

var paths = require("path");

var common_1 = require("../utils/common");
/**
 * 获取中文转英文翻译
 * @param values
 */


function getTranslateInfo(_x, _x2) {
  return _getTranslateInfo.apply(this, arguments);
}

function _getTranslateInfo() {
  _getTranslateInfo = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(values, options) {
    var _options$fanyi;

    var translationObj, _options$fanyi$baidu, maxLimit, appid, secretKey, qList, salt, loop, _loop;

    return _regenerator["default"].wrap(function _callee2$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _loop = function _loop3() {
              _loop = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(index) {
                var q, sign, msg;
                return _regenerator["default"].wrap(function _callee$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        q = qList[index];
                        sign = md5(appid + q + salt + secretKey);
                        _context5.prev = 2;
                        _context5.next = 5;
                        return new _promise["default"](function (resolve, reject) {
                          var _context, _context2, _context3;

                          https.get((0, _concat["default"])(_context = (0, _concat["default"])(_context2 = (0, _concat["default"])(_context3 = "https://fanyi-api.baidu.com/api/trans/vip/translate?q=".concat(encodeURI(q), "&from=zh&to=en&appid=")).call(_context3, appid, "&salt=")).call(_context2, salt, "&sign=")).call(_context, sign), function (val) {
                            val.setEncoding("utf8");
                            var rawData = "";
                            val.on("data", function (chunk) {
                              rawData += chunk;
                            });
                            val.on("end", function () {
                              try {
                                var result = JSON.parse(rawData);
                                var _result$trans_result = result.trans_result,
                                    trans_result = _result$trans_result === void 0 ? [] : _result$trans_result; // 把翻译的信息存到translationObj；

                                (0, _map["default"])(trans_result).call(trans_result, function (el) {
                                  var _context4;

                                  translationObj[el.src] = (0, _reduce["default"])(_context4 = el.dst.split(/\s+/)).call(_context4, function (a, b) {
                                    return a + common_1.handleSpecialSymbol(b.substr(0, 1).toUpperCase() + b.substr(1).toLowerCase());
                                  }, "");
                                });
                                (0, _setTimeout2["default"])(function () {
                                  resolve(JSON.parse(rawData));
                                }, 1000);
                              } catch (error) {
                                reject(error);
                              }
                            });
                            val.on("error", function (error) {
                              reject(error);
                            });
                          });
                        });

                      case 5:
                        msg = _context5.sent;

                        if (index + 1 < qList.length) {
                          loop(index + 1);
                        } else {
                          _promise["default"].resolve("完成");
                        }

                        _context5.next = 12;
                        break;

                      case 9:
                        _context5.prev = 9;
                        _context5.t0 = _context5["catch"](2);

                        _promise["default"].resolve("失败");

                      case 12:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee, null, [[2, 9]]);
              }));
              return _loop.apply(this, arguments);
            };

            loop = function _loop2(_x3) {
              return _loop.apply(this, arguments);
            };

            translationObj = exports.getTranslateJson(paths.resolve(options.outputPath, "swagger2ts/translation.json")); // 过滤掉已翻译的

            values = (0, _filter["default"])(values).call(values, function (el) {
              return !translationObj.hasOwnProperty(el);
            });
            _options$fanyi$baidu = options === null || options === void 0 ? void 0 : (_options$fanyi = options.fanyi) === null || _options$fanyi === void 0 ? void 0 : _options$fanyi.baidu, maxLimit = _options$fanyi$baidu.maxLimit, appid = _options$fanyi$baidu.appid, secretKey = _options$fanyi$baidu.secretKey;
            qList = exports.splitArray(values, maxLimit);
            salt = Math.floor(Math.random() * 1e10); // 这里的一秒调用一次接口，犹豫第三方接口限制

            if (!(qList.length > 0)) {
              _context6.next = 13;
              break;
            }

            _context6.next = 10;
            return loop(0);

          case 10:
            // 判断文件swagger2ts是否存在，不存在则创建
            if (!fs.existsSync(paths.resolve(options.outputPath, "/swagger2ts"))) {
              fs.mkdirSync(paths.resolve(options.outputPath, "swagger2ts"));
            } // 把翻译的内容写入


            _context6.next = 13;
            return new _promise["default"](function (resolve, reject) {
              // 判断 'swagger2ts文件是否存在
              fs.writeFile(paths.resolve(options.outputPath, "swagger2ts/translation.json"), (0, _stringify["default"])(translationObj, null, 4), function (error) {
                if (error) {
                  reject(error);
                } else {
                  resolve("写入成功");
                }
              });
            });

          case 13:
            return _context6.abrupt("return", translationObj);

          case 14:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee2);
  }));
  return _getTranslateInfo.apply(this, arguments);
}

exports.getTranslateInfo = getTranslateInfo;
/**
 * 获取上次翻译的信息
 * @param uri 上一次缓存的翻译路径
 */

var getTranslateJson = function getTranslateJson(uri) {
  try {
    var file = fs.readFileSync(uri);
    return JSON.parse(file);
  } catch (error) {
    return {};
  }
};

exports.getTranslateJson = getTranslateJson;
/**
 * 根据最大长度限制，拆分成多个query
 * @param list
 * @param maxLimit
 * @example splitArray(['123','12','2'],4) // ['123','122']
 */

var splitArray = function splitArray(list, maxLimit) {
  var splitList = []; // 临时字符串

  var arr = "";

  var _iterator = _createForOfIteratorHelper(list),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var val = _step.value;
      if (val.length > maxLimit) continue;
      var str = arr === "" ? val : arr + "\n" + val;

      if (str.length > maxLimit) {
        splitList.push(arr);
        arr = val;
      } else {
        arr = str;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  if (arr) splitList.push(arr);
  return splitList;
};

exports.splitArray = splitArray;