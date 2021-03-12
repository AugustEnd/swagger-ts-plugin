"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

Object.defineProperty(exports, "__esModule", {
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
  _getTranslateInfo = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(values, options) {
    var _options$fanyi;

    var translationObj, _options$fanyi$baidu, maxLimit, appid, secretKey, qList, salt, loop, _loop;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _loop = function _loop3() {
              _loop = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(index) {
                var q, sign, msg;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        q = qList[index];
                        sign = md5(appid + q + salt + secretKey);
                        _context.prev = 2;
                        _context.next = 5;
                        return new Promise(function (resolve, reject) {
                          https.get("https://fanyi-api.baidu.com/api/trans/vip/translate?q=".concat(encodeURI(q), "&from=zh&to=en&appid=").concat(appid, "&salt=").concat(salt, "&sign=").concat(sign), function (val) {
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

                                trans_result.map(function (el) {
                                  translationObj[el.src] = el.dst.split(/\s+/).reduce(function (a, b) {
                                    return a + common_1.handleSpecialSymbol(b.substr(0, 1).toUpperCase() + b.substr(1).toLowerCase());
                                  }, "");
                                });
                                setTimeout(function () {
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
                        msg = _context.sent;

                        if (index + 1 < qList.length) {
                          loop(index + 1);
                        } else {
                          Promise.resolve("完成");
                        }

                        _context.next = 12;
                        break;

                      case 9:
                        _context.prev = 9;
                        _context.t0 = _context["catch"](2);
                        Promise.resolve("失败");

                      case 12:
                      case "end":
                        return _context.stop();
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

            values = values.filter(function (el) {
              return !translationObj.hasOwnProperty(el);
            });
            _options$fanyi$baidu = options === null || options === void 0 ? void 0 : (_options$fanyi = options.fanyi) === null || _options$fanyi === void 0 ? void 0 : _options$fanyi.baidu, maxLimit = _options$fanyi$baidu.maxLimit, appid = _options$fanyi$baidu.appid, secretKey = _options$fanyi$baidu.secretKey;
            qList = exports.splitArray(values, maxLimit);
            salt = Math.floor(Math.random() * 1e10); // 这里的一秒调用一次接口，犹豫第三方接口限制

            if (!(qList.length > 0)) {
              _context2.next = 13;
              break;
            }

            _context2.next = 10;
            return loop(0);

          case 10:
            // 判断文件swagger2ts是否存在，不存在则创建
            if (!fs.existsSync(paths.resolve(options.outputPath, "/swagger2ts"))) {
              fs.mkdirSync(paths.resolve(options.outputPath, "swagger2ts"));
            } // 把翻译的内容写入


            _context2.next = 13;
            return new Promise(function (resolve, reject) {
              // 判断 'swagger2ts文件是否存在
              fs.writeFile(paths.resolve(options.outputPath, "swagger2ts/translation.json"), JSON.stringify(translationObj, null, 4), function (error) {
                if (error) {
                  reject(error);
                } else {
                  resolve("写入成功");
                }
              });
            });

          case 13:
            return _context2.abrupt("return", translationObj);

          case 14:
          case "end":
            return _context2.stop();
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