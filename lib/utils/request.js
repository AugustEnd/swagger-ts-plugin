"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllServiceList = exports.getSimpleServiceData = void 0;

var http = require("http");

var parser = require("fast-xml-parser");

var getApiVersion = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref) {
    var serviceName, serviceUrl, msg, rawData;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            serviceName = _ref.serviceName, serviceUrl = _ref.serviceUrl;
            _context.next = 3;
            return new Promise(function (resolve, reject) {
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
            return new Promise(function (resolve, reject) {
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
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref3) {
    var serviceName, serviceUrl, path, msg, rawData;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            serviceName = _ref3.serviceName, serviceUrl = _ref3.serviceUrl, path = _ref3.path;
            _context2.next = 3;
            return new Promise(function (resolve, reject) {
              http.get("".concat(serviceUrl).concat(path), function (val) {
                resolve(val);
              });
            });

          case 3:
            msg = _context2.sent;
            msg.setEncoding("utf8");
            rawData = "";
            msg.on("data", function (chunk) {
              rawData += chunk;
            });
            _context2.next = 9;
            return new Promise(function (resolve, reject) {
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
            return _context2.abrupt("return", _context2.sent);

          case 10:
          case "end":
            return _context2.stop();
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
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_ref5) {
    var serviceName, serviceUrl, apiPath, info;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            serviceName = _ref5.serviceName, serviceUrl = _ref5.serviceUrl;
            _context3.prev = 1;
            _context3.next = 4;
            return getApiVersion({
              serviceName: serviceName,
              serviceUrl: serviceUrl
            });

          case 4:
            apiPath = _context3.sent;
            _context3.prev = 5;
            _context3.next = 8;
            return getData({
              serviceName: serviceName,
              serviceUrl: serviceUrl,
              path: apiPath.slice(1)
            });

          case 8:
            return _context3.abrupt("return", _context3.sent);

          case 11:
            _context3.prev = 11;
            _context3.t0 = _context3["catch"](5);
            info = "\u670D\u52A1".concat(serviceName, ": \u670D\u52A1\u5730\u5740\u53EF\u80FD\u9519\u8BEF\uFF0C\u5BFC\u81F4\u672A\u80FD\u6B63\u786E\u83B7\u53D6\u4FE1\u606F\u3002\uFF08").concat(serviceUrl + apiPath.slice(1), "\uFF09");
            console.log("\x1B[31m".concat(info, "\x1B[39m"));
            return _context3.abrupt("return", null);

          case 16:
            _context3.next = 20;
            break;

          case 18:
            _context3.prev = 18;
            _context3.t1 = _context3["catch"](1);

          case 20:
          case "end":
            return _context3.stop();
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
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(_ref7) {
    var url, msg, rawData;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            url = _ref7.url;
            _context4.next = 3;
            return new Promise(function (resolve, reject) {
              http.get(url, function (val) {
                resolve(val);
              });
            });

          case 3:
            msg = _context4.sent;
            msg.setEncoding("utf8");
            rawData = "";
            msg.on("data", function (chunk) {
              rawData += chunk;
            });
            _context4.next = 9;
            return new Promise(function (resolve, reject) {
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
            return _context4.abrupt("return", _context4.sent);

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function getAllServiceList(_x4) {
    return _ref8.apply(this, arguments);
  };
}();

exports.getAllServiceList = getAllServiceList;