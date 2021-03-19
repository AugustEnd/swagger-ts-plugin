"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

(0, _defineProperty["default"])(exports, "__esModule", {
  value: true
});
exports.getAllServiceList = void 0;

var index_1 = require("../handleStr/interface/index");

var parser = require("fast-xml-parser");

var http = require("http");
/**
 * 获取完成用户填写的完整服务地址
 * @returns
 */


var completeServiceList = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var outputPath, serviceArr, _yield$exports$getAll, appList;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            outputPath = global.options.outputPath;
            serviceArr = []; // 所有服务信息

            _context.next = 4;
            return exports.getAllServiceList();

          case 4:
            _yield$exports$getAll = _context.sent;
            appList = _yield$exports$getAll.data;
            // 获取所有服务请求前完整信息，包含服务名称和服务ip
            serviceArr = index_1.handleServiceUrl(appList); // // 删除当前路径下所有文件(除了ignore中包含的文件)，删除缓存文件，每次使用最新
            // delDir(paths.resolve(outputPath || (+__dirname as any), "./swagger2ts"), {
            //     deleteCurrPath: false,
            //     ignore: [
            //         paths.resolve(
            //             (outputPath || +__dirname) as any,
            //             "./swagger2ts/translation.json"
            //         ),
            //         paths.resolve(
            //             (outputPath || +__dirname) as any,
            //             "./swagger2ts/request.ts"
            //         ),
            //     ],
            // });

            return _context.abrupt("return", serviceArr);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function completeServiceList() {
    return _ref.apply(this, arguments);
  };
}();
/**
 * 获取eureka上服务列表
 * @returns 返回服务地址
 */


var getAllServiceList = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var url, msg, rawData;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            url = global.options.appUrl || "http://eureka.dev.com:1111/eureka/apps";
            _context2.prev = 1;
            _context2.next = 4;
            return new _promise["default"](function (resolve, reject) {
              http.get(url, function (val) {
                resolve(val);
              });
            });

          case 4:
            msg = _context2.sent;
            msg.setEncoding("utf8");
            rawData = "";
            msg.on("data", function (chunk) {
              rawData += chunk;
            });
            _context2.next = 10;
            return new _promise["default"](function (resolve, reject) {
              msg.on("end", function () {
                resolve({
                  data: parser.parse(rawData).applications.application || []
                });
              });
            });

          case 10:
            return _context2.abrupt("return", _context2.sent);

          case 13:
            _context2.prev = 13;
            _context2.t0 = _context2["catch"](1);
            console.log("\u62A5\u9519\uFF1A\x1B[31m".concat(_context2.t0, "\x1B[39m"));
            return _context2.abrupt("return", _promise["default"].resolve({
              data: []
            }));

          case 17:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 13]]);
  }));

  return function getAllServiceList() {
    return _ref2.apply(this, arguments);
  };
}();

exports.getAllServiceList = getAllServiceList;
exports["default"] = completeServiceList;