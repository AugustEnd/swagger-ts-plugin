"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

(0, _defineProperty["default"])(exports, "__esModule", {
  value: true
});
exports.getAllServiceList = exports.getSimpleServiceData = void 0;

var http = require("http");

var parser = require("fast-xml-parser");

var getApiVersion = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref) {
    var serviceName, serviceUrl, msg, rawData;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            serviceName = _ref.serviceName, serviceUrl = _ref.serviceUrl;
            _context.next = 3;
            return new _promise["default"](function (resolve, reject) {
              http.get("".concat(serviceUrl, "/swagger-resources"), function (val) {
                resolve(val);
              });
            });

          case 3:
            msg = _context.sent;
            msg.setEncoding("utf8");
            rawData = "";
            msg.on("data", function (chunk) {
              rawData += chunk;
            });
            _context.next = 9;
            return new _promise["default"](function (resolve, reject) {
              msg.on("end", function () {
                try {
                  resolve(JSON.parse(rawData)[0].location);
                } catch (e) {
                  reject(e.message);
                }
              });
            });

          case 9:
            return _context.abrupt("return", _context.sent);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getApiVersion(_x) {
    return _ref2.apply(this, arguments);
  };
}();

var getData = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref3) {
    var serviceName, serviceUrl, path, msg, rawData;
    return _regenerator["default"].wrap(function _callee2$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            serviceName = _ref3.serviceName, serviceUrl = _ref3.serviceUrl, path = _ref3.path;
            _context3.next = 3;
            return new _promise["default"](function (resolve, reject) {
              var _context2;

              http.get((0, _concat["default"])(_context2 = "".concat(serviceUrl)).call(_context2, path), function (val) {
                resolve(val);
              });
            });

          case 3:
            msg = _context3.sent;
            msg.setEncoding("utf8");
            rawData = "";
            msg.on("data", function (chunk) {
              rawData += chunk;
            });
            _context3.next = 9;
            return new _promise["default"](function (resolve, reject) {
              msg.on("end", function () {
                try {
                  var data = JSON.parse(rawData);
                  resolve({
                    data: data.definitions,
                    serviceName: serviceName,
                    paths: data.paths
                  });
                } catch (e) {
                  reject(e.message);
                }
              });
            });

          case 9:
            return _context3.abrupt("return", _context3.sent);

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee2);
  }));

  return function getData(_x2) {
    return _ref4.apply(this, arguments);
  };
}();
/**
 * 返回单个服务的数据
 * @param param0 servername
 */


var getSimpleServiceData = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(_ref5) {
    var serviceName, serviceUrl, apiPath, _context4, info;

    return _regenerator["default"].wrap(function _callee3$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            serviceName = _ref5.serviceName, serviceUrl = _ref5.serviceUrl;
            _context5.prev = 1;
            _context5.next = 4;
            return getApiVersion({
              serviceName: serviceName,
              serviceUrl: serviceUrl
            });

          case 4:
            apiPath = _context5.sent;
            _context5.prev = 5;
            _context5.next = 8;
            return getData({
              serviceName: serviceName,
              serviceUrl: serviceUrl,
              path: (0, _slice["default"])(apiPath).call(apiPath, 1)
            });

          case 8:
            return _context5.abrupt("return", _context5.sent);

          case 11:
            _context5.prev = 11;
            _context5.t0 = _context5["catch"](5);
            info = (0, _concat["default"])(_context4 = "\u670D\u52A1".concat(serviceName, ": \u670D\u52A1\u5730\u5740\u53EF\u80FD\u9519\u8BEF\uFF0C\u5BFC\u81F4\u672A\u80FD\u6B63\u786E\u83B7\u53D6\u4FE1\u606F\u3002\uFF08")).call(_context4, serviceUrl + (0, _slice["default"])(apiPath).call(apiPath, 1), "\uFF09");
            console.log("\x1B[31m".concat(info, "\x1B[39m"));
            return _context5.abrupt("return", null);

          case 16:
            _context5.next = 20;
            break;

          case 18:
            _context5.prev = 18;
            _context5.t1 = _context5["catch"](1);

          case 20:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee3, null, [[1, 18], [5, 11]]);
  }));

  return function getSimpleServiceData(_x3) {
    return _ref6.apply(this, arguments);
  };
}();

exports.getSimpleServiceData = getSimpleServiceData;
/**
 * 获取所有服务
 * @param param0
 */

var getAllServiceList = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(_ref7) {
    var url, msg, rawData;
    return _regenerator["default"].wrap(function _callee4$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            url = _ref7.url;
            _context6.next = 3;
            return new _promise["default"](function (resolve, reject) {
              http.get(url, function (val) {
                resolve(val);
              });
            });

          case 3:
            msg = _context6.sent;
            msg.setEncoding("utf8");
            rawData = "";
            msg.on("data", function (chunk) {
              rawData += chunk;
            });
            _context6.next = 9;
            return new _promise["default"](function (resolve, reject) {
              msg.on("end", function () {
                try {
                  resolve({
                    data: parser.parse(rawData).applications.application || []
                  });
                } catch (e) {
                  reject(e.message);
                }
              });
            });

          case 9:
            return _context6.abrupt("return", _context6.sent);

          case 10:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee4);
  }));

  return function getAllServiceList(_x4) {
    return _ref8.apply(this, arguments);
  };
}();

exports.getAllServiceList = getAllServiceList;