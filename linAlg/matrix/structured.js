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

   return StructuredM;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
