"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

(0, _defineProperty["default"])(exports, "__esModule", {
  value: true
});
exports.startCreate = void 0;

var path = require("path");

var index_1 = require("../handleStr/interface/index");

var index_2 = require("../handleStr/paths/index"); // 辅助方法


var helper_1 = require("./helper"); // 翻译


var index_3 = require("../translation/index");

var getData_1 = require("../http/getData");

function startCreate(_x) {
  return _startCreate.apply(this, arguments);
}

function _startCreate() {
  _startCreate = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(options) {
    var outputPath, serverList, appUrl, values, chineseList, translateJson, paths;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            outputPath = options.outputPath, serverList = options.serverList, appUrl = options.appUrl;
            global.options = options;

            if (!(serverList.length === 0)) {
              _context2.next = 4;
              break;
            }

            return _context2.abrupt("return");

          case 4:
            _context2.prev = 4;
            _context2.next = 7;
            return getData_1.getData();

          case 7:
            values = _context2.sent;
            //收集所有中文
            chineseList = helper_1.collectChinese(values); // console.log(chineseList, "chineseList");
            // 拿到所有中英文映射对象

            _context2.next = 11;
            return index_3.getTranslateInfo(chineseList);

          case 11:
            translateJson = _context2.sent;
            // 把values对象中所有中文字段转换成英文
            helper_1.translateAndChangeChinese(values); // 输出到swagger2ts文件夹中

            _context2.next = 15;
            return _promise["default"].all((0, _map["default"])(values).call(values, /*#__PURE__*/function () {
              var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(el) {
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return index_1.completeInterfaceAll(el, {
                          name: el.serviceName,
                          rootPath: outputPath
                        });

                      case 3:
                        _context.next = 5;
                        return index_2.completePathAll(el.paths, {
                          name: el.serviceName,
                          rootPath: path.resolve(outputPath)
                        });

                      case 5:
                        return _context.abrupt("return", _promise["default"].resolve());

                      case 8:
                        _context.prev = 8;
                        _context.t0 = _context["catch"](0);
                        return _context.abrupt("return", _promise["default"].reject(_context.t0));

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

          case 15:
            paths = _context2.sent;
            return _context2.abrupt("return", _promise["default"].resolve("转换完成"));

          case 19:
            _context2.prev = 19;
            _context2.t0 = _context2["catch"](4);
            return _context2.abrupt("return", _promise["default"].reject(_context2.t0));

          case 22:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[4, 19]]);
  }));
  return _startCreate.apply(this, arguments);
}

exports.startCreate = startCreate;