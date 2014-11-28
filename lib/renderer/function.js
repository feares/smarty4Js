/**
 * 
 */

var utils = require('../utils');


module.exports = function (Renderer) {

    utils.mixin(Renderer.prototype, {
        /**
         * [_getExpr description]
         * @param  {[type]} node [description]
         * @return {[type]}      [description]
         */
        _getFunction: function (node, f) {
            var me = this;
            var name = node.name;
            var ret;
            var fobj = {'count': 1, 'is_array': 1, 'isset': 1};
            if (fobj[name] == 1) {
                if (f) {
                    ret = utils.p(me._getPhpFunc(node));
                }
                else {
                    ret = me._getPhpFunc(node);
                }
            }   
            else {
                switch (name) {
                    case 'function':
                        ret = me._getFunc(node);
                        break;
                    case 'strip':
                        ret = me._getStrip(node);
                        break;
                    case 'call':
                        ret = me._getCallFunc(node);
                        break;
                    default:
                        ret = me._callFunc(node);
                        break;
                };
            }

            return ret;
        },

        _getFunc: function (node) {
            var me = this;
            var func = '__func' + utils.GUID();
            var funcName;

            var tmparr = [];

            node.attrs.forEach(function (nod, index) {
                if (nod.value) {
                    if (nod.key.value == 'name' && nod.value.type == 'STR') {
                        funcName = nod.value.value;
                    }
                    else {
                        tmparr.push(nod);
                    }
                }
                else if (!nod.value && index == 0){
                    funcName = nod.key.value;
                }
                else {
                    tmparr.push(nod);
                }
            });

            function getFuncParams(arr) {
                var tmps = '';
                arr.forEach(function (node) {
                    tmps += node.key.value + ',';
                });
                return tmps.slice(0, tmps.length - 1);
            }

            function getDefaultParams(func, arr) {
                var tmps = '\n' + func  + '.data = __p.data;';
                arr.forEach(function (node) {
                    if (node.value) {
                        var p = node.key.value;
                        var vara = me._getExpr(node.value);
                        tmps += '\n' + func  + '.' + p + ' = __v(__p.' + p + ', ' + vara + ');'
                    }
                    else {
                        var p = node.key.value;
                        tmps += '\n' + func  + '.' + p + ' = __p.' + p + ';'
                    }
                });

                return tmps;
            }

            var ret = '\nfunction __fn__' + funcName + '(__p) {';
            me.ctxScope.push(func);
            ret += '\nvar ' + func + ' = {};';
            ret += getDefaultParams(func, tmparr);
            ret += me._init(node.block) + '\n}';
            me.ctxScope.pop();
            return ret;
        },

        _callFunc: function (node) {
            var funcName = node.name;
            var attrs = node.attrs;
            if (attrs) {
                if (attrs.length == 0) {
                    return '\n__fn__' + funcName + '({});';
                }
                else {
                    var me = this;
                    var params = '{';
                    node.attrs.forEach(function (nod) {
                        params += nod.key.value + ': ' + (nod.value ? me._getExpr(nod.value) : '') + ',';
                    });
                    params = params.slice(0, params.length - 1) + '}'
                    return '\n__fn__' + funcName + '(' + params +');';
                }
            }
        },

        _getStrip: function (node) {
            var block = node.block;
            return  this._init(block)
                .replace(/\"(\s|(\\n))*?\"/g, '""')
                .replace(/\n*?(\_\_h\.push\(\"\"\)\;)\n*?/g, '')
                .replace(/\"\\n\s*/g, '"')
                .replace(/\\n\s*?\"/g, '"');
        },

        _getCallFunc: function (node) {
            var me = this;
            var ret = '';
            var attrs = node.attrs;
            var f = true;
            if (attrs) {
                attrs.forEach(function (attr) {
                    if ((attr.key.value == 'name' || !attr.key) && f) {
                        ret += '\n__fn__' + attr.value.value + '({';
                        f = false;
                    }
                    else {
                        ret += '"' + attr.key.value + '":' + me._getExpr(attr.value) + ',';
                    }
                });
                
                ret = ret.slice(0, ret.length - 1) + '});'
            }

            return ret;
        }
    });
};