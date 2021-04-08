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

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));

var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof _Symbol === "undefined" || _getIteratorMethod(o) == null) { if (_Array$isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = _getIterator(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { var _context10; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = _sliceInstanceProperty(_context10 = Object.prototype.toString.call(o)).call(_context10, 8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return _Array$from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

(0, _defineProperty["default"])(exports, "__esModule", {
  value: true
});
exports.handleEn = exports.splitArray = exports.getTranslateJson = exports.zhiyiTranslationHandle = exports.baiduTranslationHandle = exports.getTranslateInfo = void 0;

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


function getTranslateInfo(_x) {
  return _getTranslateInfo.apply(this, arguments);
}

function _getTranslateInfo() {
  _getTranslateInfo = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(values) {
    var _global3, options, translationObj;

    return _regenerator["default"].wrap(function _callee5$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _global3 = global, options = _global3.options;
            translationObj = exports.getTranslateJson(paths.resolve(options.outputPath, "translation.json")); // 过滤掉已翻译的

            values = (0, _filter["default"])(values).call(values, function (el) {
              return !translationObj.hasOwnProperty(el);
            });
            _context9.prev = 3;
            _context9.next = 6;
            return exports.zhiyiTranslationHandle(values, translationObj);

          case 6:
            _context9.next = 13;
            break;

          case 8:
            _context9.prev = 8;
            _context9.t0 = _context9["catch"](3);
            console.log("知译翻译失败,使用百度翻译"); // 百度翻译处理

            _context9.next = 13;
            return exports.baiduTranslationHandle(values, translationObj);

          case 13:
            if (global.swagger2global) {
              global.swagger2global.transitions = translationObj || {};
            } else {
              global.swagger2global = {
                transitions: translationObj || {}
              };
            }

            return _context9.abrupt("return", translationObj);

          case 15:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee5, null, [[3, 8]]);
  }));
  return _getTranslateInfo.apply(this, arguments);
}

exports.getTranslateInfo = getTranslateInfo; // 百度翻译

var baiduTranslationHandle = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(values, translationObj) {
    var _options$fanyi;

    var _global, options, _options$fanyi$baidu, maxLimit, appid, secretKey, qList, salt, loop, _loop;

    return _regenerator["default"].wrap(function _callee2$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _loop = function _loop3() {
              _loop = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(index) {
                var q, sign, msg;
                return _regenerator["default"].wrap(function _callee$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        q = qList[index];
                        sign = md5(appid + q + salt + secretKey);
                        _context4.prev = 2;
                        _context4.next = 5;
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
                                  translationObj[el.src] = exports.handleEn(el.dst);
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
                        msg = _context4.sent;

                        if (index + 1 < qList.length) {
                          loop(index + 1);
                        } else {
                          _promise["default"].resolve("完成");
                        }

                        _context4.next = 12;
                        break;

                      case 9:
                        _context4.prev = 9;
                        _context4.t0 = _context4["catch"](2);

                        _promise["default"].resolve("失败");

                      case 12:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee, null, [[2, 9]]);
              }));
              return _loop.apply(this, arguments);
            };

            loop = function _loop2(_x4) {
              return _loop.apply(this, arguments);
            };

            _global = global, options = _global.options;
            _options$fanyi$baidu = options === null || options === void 0 ? void 0 : (_options$fanyi = options.fanyi) === null || _options$fanyi === void 0 ? void 0 : _options$fanyi.baidu, maxLimit = _options$fanyi$baidu.maxLimit, appid = _options$fanyi$baidu.appid, secretKey = _options$fanyi$baidu.secretKey;
            qList = exports.splitArray(values, maxLimit);
            salt = Math.floor(Math.random() * 1e10); // 这里的一秒调用一次接口，第三方接口限制

            if (!(qList.length > 0)) {
              _context5.next = 12;
              break;
            }

            _context5.next = 9;
            return loop(0);

          case 9:
            // 判断文件swagger2ts是否存在，不存在则创建
            if (!fs.existsSync(options.outputPath)) {
              fs.mkdirSync(options.outputPath);
            } // 把翻译的内容写入


            _context5.next = 12;
            return new _promise["default"](function (resolve, reject) {
              // 判断 'swagger2ts文件是否存在
              fs.writeFile(paths.resolve(options.outputPath, "translation.json"), (0, _stringify["default"])(translationObj, null, 4), function (error) {
                if (error) {
                  reject(error);
                } else {
                  resolve("写入成功");
                }
              });
            });

          case 12:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee2);
  }));

  return function baiduTranslationHandle(_x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.baiduTranslationHandle = baiduTranslationHandle; // 知译翻译

var zhiyiTranslationHandle = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(values, translationObj) {
    var _global2, options, maxLimit, qList, loop, _loop4;

    return _regenerator["default"].wrap(function _callee4$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _loop4 = function _loop6() {
              _loop4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(index) {
                var q, msg;
                return _regenerator["default"].wrap(function _callee3$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        q = qList[index];
                        _context6.next = 3;
                        return new _promise["default"](function (resolve, reject) {
                          var content = {
                            entityTag: "0",
                            field: "common",
                            lang: "chinese",
                            src: values
                          };
                          var req = https.request("https://www.trialos.com/api/ai-translationservice/ai/translate/translateBatch", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                            }
                          }, function (val) {
                            val.setEncoding("utf8");
                            var rawData = "";
                            val.on("data", function (chunk) {
                              rawData += chunk;
                            });
                            val.on("end", function () {
                              try {
                                var result = JSON.parse(rawData);
                                var data = result.data; // 把翻译的信息存到translationObj；

                                for (var key in data.tgt) {
                                  translationObj[key] = exports.handleEn(data.tgt[key].tgt);
                                }

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
                          }); // write data to request body

                          req.write((0, _stringify["default"])(content));
                          req.end();
                        });

                      case 3:
                        msg = _context6.sent;

                        if (index + 1 < qList.length) {
                          loop(index + 1);
                        } else {
                          _promise["default"].resolve("完成");
                        }

                      case 5:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee3);
              }));
              return _loop4.apply(this, arguments);
            };

            loop = function _loop5(_x7) {
              return _loop4.apply(this, arguments);
            };

            _global2 = global, options = _global2.options;
            maxLimit = 2000;
            qList = exports.splitArray(values, maxLimit); // 保留了百度一样处理

            if (!(qList.length > 0)) {
              _context7.next = 17;
              break;
            }

            _context7.prev = 6;
            _context7.next = 9;
            return loop(0);

          case 9:
            // 判断文件夹是否存在，不存在则创建
            if (!fs.existsSync(options.outputPath)) {
              fs.mkdirSync(options.outputPath);
            } // 把翻译的内容写入


            _context7.next = 12;
            return new _promise["default"](function (resolve, reject) {
              // 判断 'swagger2ts文件是否存在
              fs.writeFile(paths.resolve(options.outputPath, "translation.json"), (0, _stringify["default"])(translationObj, null, 4), function (error) {
                if (error) {
                  reject(error);
                } else {
                  resolve("写入成功");
                }
              });
            });

          case 12:
            _context7.next = 17;
            break;

          case 14:
            _context7.prev = 14;
            _context7.t0 = _context7["catch"](6);
            return _context7.abrupt("return", _promise["default"].reject());

          case 17:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee4, null, [[6, 14]]);
  }));

  return function zhiyiTranslationHandle(_x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.zhiyiTranslationHandle = zhiyiTranslationHandle;
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

exports.splitArray = splitArray; // 返回的英文处理

var handleEn = function handleEn(str) {
  var _context8;

  return (0, _reduce["default"])(_context8 = str.split(/\s+/)).call(_context8, function (a, b) {
    return a + common_1.handleSpecialSymbol(b.substr(0, 1).toUpperCase() + b.substr(1).toLowerCase());
  }, "");
};

exports.handleEn = handleEn;