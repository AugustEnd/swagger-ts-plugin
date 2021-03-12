"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));

(0, _defineProperty["default"])(exports, "__esModule", {
  value: true
});
exports.translateToEn = exports.delDir = exports.handleSpecialSymbol = void 0;

var fs = require("fs");

var paths = require("path");
/**
 * @param key 含有处理特殊字符«» 【】 {} [] () （），如a«b«c»» 转换成a_b_c;
 */


var handleSpecialSymbol = function handleSpecialSymbol(key) {
  return typeof key !== "string" ? key : key.replace(/[\«|\(|\（|\【|\[|\{]/g, "_").replace(/[\»|\)|\）|\】|\]|\}]/g, "").replace(/[\?|\？|\,|\，|\.|\。|\-|\/|\、|\=|\'|\"|\s]/g, "");
};

exports.handleSpecialSymbol = handleSpecialSymbol;
/**
 * 删除文件
 * @param path string;
 * @param options.deleteCurrPath 默认true 删除所有文件和文件夹，保存当前文件，false保留当前文件夹
 * @param options.ignore 不删除某些文件或者文件夹
 */

var delDir = function delDir(path, options) {
  var files = [];

  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    (0, _forEach["default"])(files).call(files, function (file) {
      var curPath = paths.resolve(path, file);

      if (fs.statSync(curPath).isDirectory()) {
        var _context;

        if (options && options !== null && options !== void 0 && (0, _includes["default"])(_context = options.ignore).call(_context, curPath)) return;
        exports.delDir(curPath); //递归删除文件夹
      } else {
        var _context2;

        if (options && options !== null && options !== void 0 && (0, _includes["default"])(_context2 = options.ignore).call(_context2, curPath)) return;
        fs.unlinkSync(curPath); //删除文件
      }
    });
    (!options || options.deleteCurrPath === true) && fs.rmdirSync(path); // 删除文件夹自身
  }
};

exports.delDir = delDir;

var translateToEn = function translateToEn() {};

exports.translateToEn = translateToEn;