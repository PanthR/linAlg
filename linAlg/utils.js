(function(define) {'use strict';
define(function(require) {

   // Arithmetic
   var utils = {};

   // TODO: Is this the best way?
   utils.veryClose = function veryClose(a, b, tol) {
      return Math.abs(a - b) < tol;
   };

   utils.op = {};

   utils.op.add = function add(a, b) { return a + b; };
   utils.op['+'] = utils.op.add;

   utils.op.sub = function sub(a, b) { return a - b; };
   utils.op['-'] = utils.op.sub;

   utils.op.mult = function mult(a, b) { return a * b; };
   utils.op['*'] = utils.op.mult;

   utils.op.div = function divide(a, b) { return a / b; };
   utils.op['/'] = utils.op.div;

   return utils;

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
