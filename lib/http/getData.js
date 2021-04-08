"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _some = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/some"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

(0, _defineProperty["default"])(exports, "__esModule", {
  value: true
});
exports.swagger3to2 = exports.getSimpleServiceDataByApiDocUrl = exports.getSimpleServiceDataByIp = exports.addParmas = exports.getData = void 0;

var http = require("http");

var serviceInfo_1 = require("./serviceInfo");

var getData = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var apiDocList, serviceArr, values, _context, _context2;

    return _regenerator["default"].wrap(function _callee$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            apiDocList = global.options.apiDocList;
            _context3.next = 3;
            return serviceInfo_1["default"]();

          case 3:
            serviceArr = _context3.sent;
            _context3.prev = 4;
            // 已获取到所有服务数据
            values = [];

            if (!((apiDocList === null || apiDocList === void 0 ? void 0 : apiDocList.length) !== 0)) {
              _context3.next = 14;
              break;
            }

            _context3.t0 = _filter["default"];
            _context3.next = 10;
            return _promise["default"].all((0, _map["default"])(apiDocList).call(apiDocList, function (item) {
              return exports.getSimpleServiceDataByApiDocUrl(item);
            }));

          case 10:
            _context3.t1 = _context = _context3.sent;
            values = (0, _context3.t0)(_context3.t1).call(_context, function (el) {
              return el;
            });
            _context3.next = 19;
            break;

          case 14:
            _context3.t2 = _filter["default"];
            _context3.next = 17;
            return _promise["default"].all((0, _map["default"])(serviceArr).call(serviceArr, function (item) {
              return exports.getSimpleServiceDataByIp(item);
            }));

          case 17:
            _context3.t3 = _context2 = _context3.sent;
            values = (0, _context3.t2)(_context3.t3).call(_context2, function (el) {
              return el;
            });

          case 19:
            return _context3.abrupt("return", _promise["default"].resolve(values));

          case 22:
            _context3.prev = 22;
            _context3.t4 = _context3["catch"](4);

          case 24:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee, null, [[4, 22]]);
  }));

  return function getData() {
    return _ref.apply(this, arguments);
  };
}();

exports.getData = getData;
/**
 * 得到服务数据地址
 */

var addParmas = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref2) {
    var serviceName, serviceUrl, apiPath;
    return _regenerator["default"].wrap(function _callee2$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            serviceName = _ref2.serviceName, serviceUrl = _ref2.serviceUrl;
            _context4.next = 3;
            return getApiVersion({
              serviceName: serviceName,
              serviceUrl: serviceUrl
            });

          case 3:
            apiPath = _context4.sent;
            return _context4.abrupt("return", _promise["default"].resolve(apiPath ? {
              serviceName: serviceName,
              serviceApiDoc: serviceUrl + apiPath
            } : null));

          case 5:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee2);
  }));

  return function addParmas(_x) {
    return _ref3.apply(this, arguments);
  };
}();

exports.addParmas = addParmas;

var getSimpleServiceDataByIp = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(_ref4) {
    var serviceName, serviceUrl, serviceApiDocUrl, _context5, p, serviceApiDoc, _context6, info;

    return _regenerator["default"].wrap(function _callee3$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            serviceName = _ref4.serviceName, serviceUrl = _ref4.serviceUrl;
            _context7.prev = 1;
            _context7.next = 4;
            return exports.addParmas({
              serviceName: serviceName,
              serviceUrl: serviceUrl
            });

          case 4:
            p = _context7.sent;

            if (p) {
              _context7.next = 7;
              break;
            }

            return _context7.abrupt("return", _promise["default"].resolve(null));

          case 7:
            serviceApiDoc = p.serviceApiDoc;
            serviceApiDocUrl = serviceApiDoc;

            if (!(0, _some["default"])(_context5 = global.options.apiDocList).call(_context5, function (el) {
              return el.serviceName === serviceName;
            })) {
              global.options.apiDocList.push({
                serviceName: serviceName,
                serviceApiDoc: serviceApiDoc
              });
            }

            return _context7.abrupt("return", getSimpleData({
              serviceName: serviceName,
              serviceApiDoc: serviceApiDoc
            }));

          case 13:
            _context7.prev = 13;
            _context7.t0 = _context7["catch"](1);
            info = (0, _concat["default"])(_context6 = "\u670D\u52A1".concat(serviceName, ": \u670D\u52A1\u5730\u5740\u53EF\u80FD\u9519\u8BEF\uFF0C\u5BFC\u81F4\u672A\u80FD\u6B63\u786E\u83B7\u53D6\u4FE1\u606F\u3002\uFF08")).call(_context6, serviceApiDocUrl, "\uFF09");
            console.log("\x1B[31m".concat(info, "\x1B[39m"));
            return _context7.abrupt("return", null);

          case 18:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee3, null, [[1, 13]]);
  }));

  return function getSimpleServiceDataByIp(_x2) {
    return _ref5.apply(this, arguments);
  };
}();

exports.getSimpleServiceDataByIp = getSimpleServiceDataByIp;

var getSimpleServiceDataByApiDocUrl = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(_ref6) {
    var serviceName, serviceApiDoc, _context8, info;

    return _regenerator["default"].wrap(function _callee4$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            serviceName = _ref6.serviceName, serviceApiDoc = _ref6.serviceApiDoc;
            _context9.prev = 1;
            return _context9.abrupt("return", getSimpleData({
              serviceName: serviceName,
              serviceApiDoc: serviceApiDoc
            }));

          case 5:
            _context9.prev = 5;
            _context9.t0 = _context9["catch"](1);
            info = (0, _concat["default"])(_context8 = "\u670D\u52A1".concat(serviceName, ": \u670D\u52A1\u5730\u5740\u53EF\u80FD\u9519\u8BEF\uFF0C\u5BFC\u81F4\u672A\u80FD\u6B63\u786E\u83B7\u53D6\u4FE1\u606F\u3002\uFF08")).call(_context8, serviceApiDoc, "\uFF09");
            console.log("\x1B[31m".concat(info, "\x1B[39m"));
            return _context9.abrupt("return", null);

          case 10:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee4, null, [[1, 5]]);
  }));

  return function getSimpleServiceDataByApiDocUrl(_x3) {
    return _ref7.apply(this, arguments);
  };
}();

exports.getSimpleServiceDataByApiDocUrl = getSimpleServiceDataByApiDocUrl;

var getApiVersion = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(_ref8) {
    var serviceName, serviceUrl, msg, rawData;
    return _regenerator["default"].wrap(function _callee5$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            serviceName = _ref8.serviceName, serviceUrl = _ref8.serviceUrl;
            _context10.prev = 1;
            _context10.next = 4;
            return new _promise["default"](function (resolve, reject) {
              http.get("".concat(serviceUrl, "/swagger-resources"), function (val) {
                if (val.statusCode !== 200) {
                  reject(null);
                }

                resolve(val);
              });
            });

          case 4:
            msg = _context10.sent;
            msg.setEncoding("utf8");
            rawData = "";
            msg.on("data", function (chunk) {
              rawData += chunk;
            });
            _context10.next = 10;
            return new _promise["default"](function (resolve, reject) {
              msg.on("end", function () {
                try {
                  var _JSON$parse$0$locatio;

                  resolve((_JSON$parse$0$locatio = JSON.parse(rawData)[0].location) === null || _JSON$parse$0$locatio === void 0 ? void 0 : (0, _slice["default"])(_JSON$parse$0$locatio).call(_JSON$parse$0$locatio, 1));
                } catch (e) {
                  reject(e.message);
                }
              });
            });

          case 10:
            return _context10.abrupt("return", _context10.sent);

          case 13:
            _context10.prev = 13;
            _context10.t0 = _context10["catch"](1);
            return _context10.abrupt("return", _promise["default"].resolve(null));

          case 16:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee5, null, [[1, 13]]);
  }));

  return function getApiVersion(_x4) {
    return _ref9.apply(this, arguments);
  };
}();

var getSimpleData = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(_ref10) {
    var serviceName, serviceApiDoc, msg, rawData;
    return _regenerator["default"].wrap(function _callee6$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            serviceName = _ref10.serviceName, serviceApiDoc = _ref10.serviceApiDoc;
            _context11.prev = 1;
            _context11.next = 4;
            return new _promise["default"](function (resolve, reject) {
              http.get(serviceApiDoc, function (val) {
                if (val.statusCode !== 200) {
                  reject(null);
                }

                resolve(val);
              });
            });

          case 4:
            msg = _context11.sent;
            msg.setEncoding("utf8");
            rawData = "";
            msg.on("data", function (chunk) {
              rawData += chunk;
            });
            return _context11.abrupt("return", new _promise["default"](function (resolve, reject) {
              msg.on("end", function () {
                try {
                  var _data$swagger;

                  var data = JSON.parse(rawData);

                  if (((_data$swagger = data.swagger) === null || _data$swagger === void 0 ? void 0 : _data$swagger.split(".")[0]) - 0 !== 2) {
                    exports.swagger3to2(data);
                  }

                  resolve({
                    data: data.definitions,
                    basePath: data.basePath,
                    host: data.host,
                    swagger: data.swagger || "2.0",
                    tags: data.tags,
                    serviceName: serviceName,
                    paths: data.paths
                  });
                } catch (e) {
                  console.log("error", e);
                  reject(e.message);
                }
              });
            }));

          case 11:
            _context11.prev = 11;
            _context11.t0 = _context11["catch"](1);
            console.log(_context11.t0, "error");
            return _context11.abrupt("return", _promise["default"].resolve(null));

          case 15:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee6, null, [[1, 11]]);
  }));

  return function getSimpleData(_x5) {
    return _ref11.apply(this, arguments);
  };
}();

var swagger3to2 = function swagger3to2(data) {
  var schemas = data.components.schemas;
  var paths = data.paths;

  if (schemas) {
    for (var key in schemas) {
      var properties = schemas[key].properties;

      if (properties) {
        for (var key2 in properties) {
          var _properties$key, _properties$key$items;

          if (properties[key2].$ref) {
            properties[key2].$ref = properties[key2].$ref.replace(/components\/schemas/g, "definitions");
          }

          if ((_properties$key = properties[key2]) !== null && _properties$key !== void 0 && (_properties$key$items = _properties$key.items) !== null && _properties$key$items !== void 0 && _properties$key$items.$ref) {
            properties[key2].items.$ref = properties[key2].items.$ref.replace(/components\/schemas/g, "definitions");
          }
        }
      }
    }
  }

  data.definitions = schemas;
  data.swagger = 3;

  if (paths) {
    for (var _key in paths) {
      var path = paths[_key];

      for (var _key2 in path) {
        var methodData = path[_key2];
        methodData.consumes = [];
        methodData.parameters = methodData.parameters || [];

        if (methodData.requestBody) {
          var content = methodData.requestBody.content;

          for (var _key3 in content) {
            methodData.consumes.push(_key3);
            methodData.parameters.push({
              "in": "body",
              name: "",
              contentType: _key3,
              required: true,
              schema: content[_key3].schema || null
            });
          }
        }
      }
    }
  }

  data.components && delete data.components;
};

exports.swagger3to2 = swagger3to2;