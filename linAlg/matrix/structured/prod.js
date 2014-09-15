(function(define) {'use strict';
define(function(require) {

return function(Matrix, StructuredM) {
   // return A * B
   function ProdM(A, B) {
      // TODO implement this guy
   }

   ProdM.prototype = Object.create(StructuredM.prototype);

   return ProdM;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
