"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

Object.defineProperty(exports, "__esModule", {
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
  _startCreate = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(options) {
    var outputPath, serverList, appUrl, serviceArr, _yield$request_1$getA, appList, values, chineseList, translateJson, paths;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            outputPath = options.outputPath, serverList = options.serverList, appUrl = options.appUrl;

            if (!(serverList.length === 0)) {
              _context2.next = 3;
              break;
            }

            return _context2.abrupt("return");

          case 3:
            serviceArr = [];
            _context2.prev = 4;
            _context2.next = 7;
            return request_1.getAllServiceList({
              url: appUrl || "http://eureka.dev.com:1111/eureka/apps"
            });

          case 7:
            _yield$request_1$getA = _context2.sent;
            appList = _yield$request_1$getA.data;
            // 获取所有服务请求前完整信息，包含服务名称和服务ip
            serviceArr = serverList.filter(function (el) {
              return typeof el !== "string";
            }).concat(index_1.handleServiceUrl(appList, serverList.filter(function (el) {
              return typeof el === "string";
            }))); // 删除当前路径下所有文件(除了ignore中包含的文件)，删除缓存文件，每次使用最新

            common_1.delDir(path.resolve(outputPath || +__dirname, "./swagger2ts"), {
              deleteCurrPath: false,
              ignore: [path.resolve(outputPath || +__dirname, "./swagger2ts/translation.json")]
            }); // 已获取到所有服务数据

            _context2.next = 13;
            return Promise.all(serviceArr.map(function (item) {
              return request_1.getSimpleServiceData({
                serviceName: item.serviceName,
                serviceUrl: item.serviceUrl
              });
            }));

          case 13:
            values = _context2.sent;
            //收集所有中文
            chineseList = helper_1.collectChinese(values); // 拿到所有中英文映射对象

            _context2.next = 17;
            return index_3.getTranslateInfo(chineseList, options);

          case 17:
            translateJson = _context2.sent;
            // 把values对象中所有中文字段转换成英文
            helper_1.translateAndChangeChinese(values, translateJson); // 输出到swagger2ts文件夹中

            _context2.next = 21;
            return Promise.all(values.filter(function (el) {
              return el;
            }).map( /*#__PURE__*/function () {
              var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(el) {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return index_1.completeInterfaceAll(el, {
                          name: el.serviceName,
                          path: path.resolve(outputPath || +__dirname, "./swagger2ts")
                        });

                      case 3:
                        _context.next = 5;
                        return index_2.completePathAll(el.paths, {
                          name: el.serviceName,
                          path: path.resolve(outputPath || +__dirname, "./swagger2ts")
                        });

                      case 5:
                        return _context.abrupt("return", Promise.resolve());

                      case 8:
                        _context.prev = 8;
                        _context.t0 = _context["catch"](0);
                        return _context.abrupt("return", Promise.reject(_context.t0));

                      case 11:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[0, 8]]);
              }));

              return function (_x2) {
                return _ref.apply(this, arguments);
              };
            }()));

          case 21:
            paths = _context2.sent;
            return _context2.abrupt("return", Promise.resolve("转换完成"));

          case 25:
            _context2.prev = 25;
            _context2.t0 = _context2["catch"](4);
            return _context2.abrupt("return", Promise.reject(_context2.t0));

          case 28:
          case "end":
            return _context2.stop();
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