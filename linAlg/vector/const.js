(function(define) {'use strict';
define(function(require) {

/* Returns a function which takes the Vector constructor and
 * creates the subclass ConstV of Vector
 * @module LinAlg
 */
return function(Vector) {

   // TODO update comments

   // Subclass of `Vector` representing vectors whose values are specified via
   // a function `f(i)` of the index.
   // The values of the vector are computed lazily, only when they are accessed.
   // Users should not need to access this directly.
   function ConstV(val, len) {
      this.val = val;
      this.length = len;
      this.constructor = ConstV;
   }

   ConstV.prototype = Object.create(Vector.prototype);

   ConstV.forEach = function forEach(v1, f) {
      var i;
      for (i = 1; i <= v1.length; i += 1) {
         f(v1.val, i);
      }
      return Vector;
   };

   /* ConstV.prototype methods */

   ConstV.prototype.get = function get(i) {
      if ( i < 1 || i > this.length) { return 0; }
      return this.val;
   };

   return ConstV;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
