"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

(0, _defineProperty["default"])(exports, "__esModule", {
  value: true
});

var common_1 = require("./utils/common");

var path = require("path"); // 删除当前路径下所有文件


common_1.delDir(path.resolve(path.resolve(__dirname, "../swagger2ts")), {
  deleteCurrPath: false,
  ignore: [path.resolve(__dirname, "../swagger2ts/translation.json")]
});
common_1.delDir(path.resolve(path.resolve(__dirname, "../lib")));