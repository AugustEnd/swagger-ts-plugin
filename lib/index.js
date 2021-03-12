"use strict";

var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");

var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");

var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");

var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");

var _forEachInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");

var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");

var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");

var _Object$defineProperty2 = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _defineProperty3 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); if (enumerableOnly) symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { var _context; _forEachInstanceProperty(_context = ownKeys(Object(source), true)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (_Object$getOwnPropertyDescriptors) { _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)); } else { var _context2; _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty2(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } } return target; }

(0, _defineProperty3["default"])(exports, "__esModule", {
  value: true
});

var index_1 = require("./server/index");
/**
 * @param outputPath 输出地址
 * @param serverList 服务列表地址
 */


module.exports = /*#__PURE__*/function () {
  function Swapper2TsPlugin(props) {
    (0, _classCallCheck2["default"])(this, Swapper2TsPlugin);
    this.options = _objectSpread(_objectSpread({}, index_1.defaultValue), props || {});
  }

  (0, _createClass2["default"])(Swapper2TsPlugin, [{
    key: "apply",
    value: function apply(compiler) {
      var _this = this;

      compiler.hooks.done.tap("Hello World Plugin", function (stats) {
        console.log("swaggerr转ts插件开始工作");
        index_1.startCreate(_this.options);
      });
    } // 暴露当前方法目的是，使用者可以主动触发命令

  }, {
    key: "build",
    value: function build() {
      return index_1.startCreate(this.options);
    }
  }]);
  return Swapper2TsPlugin;
}();