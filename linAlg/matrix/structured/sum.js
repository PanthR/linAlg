(function(define) {'use strict';
define(function(require) {

return function(Matrix, StructuredM) {
   // return A + kB
   function SumM(A, B, k) {
      // TODO implement this guy
   }

   SumM.prototype = Object.create(StructuredM.prototype);

   return SumM;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
