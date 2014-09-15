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
   StructuredM.DiagM      = require('./structured/diag')(Matrix, StructuredM);
   StructuredM.CDiagM     = require('./structured/cDiag')(Matrix, StructuredM);
   StructuredM.LowerTriM  = require('./structured/lowerTri')(Matrix, StructuredM);
   StructuredM.UpperTriM  = require('./structured/upperTri')(Matrix, StructuredM);
   StructuredM.SymmetricM = require('./structured/symmetric')(Matrix, StructuredM);
   StructuredM.SumM       = require('./structured/sum')(Matrix, StructuredM);
   StructuredM.ProdM      = require('./structured/prod')(Matrix, StructuredM);

   return StructuredM;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
