/**
 * @file Compiler of Smarty4Js
 * @author johnson(zoumiaojiang@gmail.com)
 * @date  2014-11-13
 */

var utils = require('./utils');

/**
 * @constructor
 *
 * Compiler Class
 */
function Compiler() {
    this.init.apply(this, arguments);
}

/**
 * init Compiler
 * @param  {Object} engine a template engine object
 */
Compiler.prototype.init = function (engine) {
    this.engine = engine;
};

/**
 * [render description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
Compiler.prototype.render = function (data) {
    var jsTpl = this.getJsTpl();
    return (new Function('return ' + jsTpl)()).render(data);
};

/**
 * [getJsTpl description]
 * @return {[type]} [description]
 */
Compiler.prototype.getJsTpl = function (type) {
    return this.engine.renderer.parser(type);
};

module.exports = Compiler;