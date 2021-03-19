"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

(0, _defineProperty["default"])(exports, "__esModule", {
  value: true
});

var paths = require("path");

var defaultValue = {
  outputPath: paths.resolve(__dirname, "../../"),
  serverList: [],
  apiDocList: [],
  fanyi: {
    baidu: {
      appid: "20210301000711374",
      secretKey: "qyjxl2zU20BwQ8sfdyxt",
      maxLimit: 2000
    }
  }
};
exports["default"] = defaultValue;