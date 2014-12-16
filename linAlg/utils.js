/**
 * Utility library for linAlg.
 *
 * A collection of utilities used by other linAlg modules.
 * @module utils
 * @author Haris Skiadas <skiadas@hanover.edu>, Barb Wahl <wahl@hanover.edu>
 */
(function(define) {'use strict';
define(function(require) {

   var utils = {};

   // TODO: Is this the best way?
   /** Return whether the numbers `a`, `b` are within `tol` of each other. */
   utils.veryClose = function veryClose(a, b, tol) {
      return Math.abs(a - b) < tol;
   };

   /** Arithmetic operators */
   utils.op = {};

   /** The function that adds two numbers. Also available as `utils.op['+']`. */
   utils.op.add = function add(a, b) { return a + b; };
   utils.op['+'] = utils.op.add;

   /** The function that subtracts two numbers. Also available as `utils.op['-']`. */
   utils.op.sub = function sub(a, b) { return a - b; };
   utils.op['-'] = utils.op.sub;

   /** The function that multiplies two numbers. Also available as `utils.op['*']`. */
   utils.op.mult = function mult(a, b) { return a * b; };
   utils.op['*'] = utils.op.mult;

   /** The function that divides two numbers. Also available as `utils.op['/']`. */
   utils.op.div = function divide(a, b) { return a / b; };
   utils.op['/'] = utils.op.div;

   return utils;

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
