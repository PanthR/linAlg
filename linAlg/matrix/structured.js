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

   StructuredM.prototype.each = function each(f) {
      throw new Error('Subclasses of StructuredM need to implement custom `each`');
      // var i, j;
      // for (i = 1; i <= this.nrow; i += 1) {
      //    for (j = 1; j <= this.ncol; j += 1) {
      //       f(this._get(i, j), i, j);
      //    }
      // }
      // return this;
   };

   return StructuredM;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
