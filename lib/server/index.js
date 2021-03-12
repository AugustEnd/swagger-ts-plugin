"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

(0, _defineProperty["default"])(exports, "__esModule", {
  value: true
});
exports.defaultValue = exports.startCreate = void 0;

var path = require("path");

var index_1 = require("../handleStr/interface/index");

var request_1 = require("../utils/request");

var common_1 = require("../utils/common");

var index_2 = require("../handleStr/paths/index"); // 辅助方法


var helper_1 = require("./helper"); // 翻译


var index_3 = require("../translation/index");
/**
 * 项目主要方法
 * @param options 配置参数
 */


function startCreate(_x) {
  return _startCreate.apply(this, arguments);
}

function _startCreate() {
  _startCreate = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(options) {
    var outputPath, serverList, appUrl, serviceArr, _context, _context2, _yield$request_1$getA, appList, values, chineseList, translateJson, paths;

    return _regenerator["default"].wrap(function _callee2$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            outputPath = options.outputPath, serverList = options.serverList, appUrl = options.appUrl;

            if (!(serverList.length === 0)) {
              _context4.next = 3;
              break;
            }

            return _context4.abrupt("return");

          case 3:
            serviceArr = [];
            _context4.prev = 4;
            _context4.next = 7;
            return request_1.getAllServiceList({
              url: appUrl || "http://eureka.dev.com:1111/eureka/apps"
            });

          case 7:
            _yield$request_1$getA = _context4.sent;
            appList = _yield$request_1$getA.data;
            // 获取所有服务请求前完整信息，包含服务名称和服务ip
            serviceArr = (0, _concat["default"])(_context = (0, _filter["default"])(serverList).call(serverList, function (el) {
              return typeof el !== "string";
            })).call(_context, index_1.handleServiceUrl(appList, (0, _filter["default"])(serverList).call(serverList, function (el) {
              return typeof el === "string";
            }))); // 删除当前路径下所有文件(除了ignore中包含的文件)，删除缓存文件，每次使用最新

            common_1.delDir(path.resolve(outputPath || +__dirname, "./swagger2ts"), {
              deleteCurrPath: false,
              ignore: [path.resolve(outputPath || +__dirname, "./swagger2ts/translation.json")]
            }); // 已获取到所有服务数据

            _context4.next = 13;
            return _promise["default"].all((0, _map["default"])(serviceArr).call(serviceArr, function (item) {
              return request_1.getSimpleServiceData({
                serviceName: item.serviceName,
                serviceUrl: item.serviceUrl
              });
            }));

          case 13:
            values = _context4.sent;
            //收集所有中文
            chineseList = helper_1.collectChinese(values); // 拿到所有中英文映射对象

            _context4.next = 17;
            return index_3.getTranslateInfo(chineseList, options);

          case 17:
            translateJson = _context4.sent;
            // 把values对象中所有中文字段转换成英文
            helper_1.translateAndChangeChinese(values, translateJson); // 输出到swagger2ts文件夹中

            _context4.next = 21;
            return _promise["default"].all((0, _map["default"])(_context2 = (0, _filter["default"])(values).call(values, function (el) {
              return el;
            })).call(_context2, /*#__PURE__*/function () {
              var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(el) {
                return _regenerator["default"].wrap(function _callee$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.prev = 0;
                        _context3.next = 3;
                        return index_1.completeInterfaceAll(el, {
                          name: el.serviceName,
                          path: path.resolve(outputPath || +__dirname, "./swagger2ts")
                        });

                      case 3:
                        _context3.next = 5;
                        return index_2.completePathAll(el.paths, {
                          name: el.serviceName,
                          path: path.resolve(outputPath || +__dirname, "./swagger2ts")
                        });

                      case 5:
                        return _context3.abrupt("return", _promise["default"].resolve());

                      case 8:
                        _context3.prev = 8;
                        _context3.t0 = _context3["catch"](0);
                        return _context3.abrupt("return", _promise["default"].reject(_context3.t0));

                      case 11:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee, null, [[0, 8]]);
              }));

              return function (_x2) {
                return _ref.apply(this, arguments);
              };
            }()));

          case 21:
            paths = _context4.sent;
            return _context4.abrupt("return", _promise["default"].resolve("转换完成"));

          case 25:
            _context4.prev = 25;
            _context4.t0 = _context4["catch"](4);
            return _context4.abrupt("return", _promise["default"].reject(_context4.t0));

          case 28:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee2, null, [[4, 25]]);
  }));
  return _startCreate.apply(this, arguments);
}

exports.startCreate = startCreate;
exports.defaultValue = {
  outputPath: path.resolve(__dirname, "../../"),
  serverList: [],
  fanyi: {
    baidu: {
      appid: "20210301000711374",
      secretKey: "qyjxl2zU20BwQ8sfdyxt",
      maxLimit: 2000
    }
  }
};