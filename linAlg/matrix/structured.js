(function(define) {'use strict';
define(function(require) {

return function(Matrix) {

   // Subclass of `DenseM` acting as a superclass for classes of matrices
   // with some extra structure.
   function StructuredM() {
      // This should never be called directly
      throw new Error('Not meant to call StructuredM');
   }

   StructuredM.prototype = Object.create(Matrix.DenseM.prototype);

   /**
    * Subclass of `Matrix` representing diagonal matrices.
    * Users should not need to access this subclass directly.
    */
   StructuredM.DiagM     = require('./structured/diag')(Matrix, StructuredM);
   StructuredM.LowerTriM = require('./structured/lowerTri')(Matrix, StructuredM);

   StructuredM.prototype.each = function each(f) {
      throw new Error('Subclasses of StructuredM need to implement custom `each`');
   };

   // preserves structure of the matrix
   StructuredM.prototype.map = function map(f) {
      throw new Error('Subclasses of StructuredM need to implement custom `map`');
   };

   return StructuredM;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
