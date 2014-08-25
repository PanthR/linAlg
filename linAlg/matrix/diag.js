(function(define) {'use strict';
define(function(require) {

/* Returns a function which takes the Matrix constructor and
 * creates the subclass DiagM of Matrix
 */
return function(Matrix) {

   // Subclass of `Matrix` representing "Diag" matrices.
   function DiagM(arr, options) {
      this.constructor = DiagM;
   }

   DiagM.prototype = Object.create(Matrix.prototype);

   return DiagM;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
