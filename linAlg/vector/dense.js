(function(define) {'use strict';
define(function(require) {

/* Returns a function which takes the Vector constructor and
 * creates the subclass DenseV of Vector
 */
return function(Vector) {

   // Subclass of `Vector` representing "dense" vectors.
   // Dense vectors are stored simply as Javascript Arrays
   // Users should not need to access this directly.
   function DenseV(arr) {
      this.values = arr;
      this.length = arr.length;
      this.constructor = DenseV;
   }

   /* makes DenseV a "subclass" of Vector */
   DenseV.prototype = Object.create(Vector.prototype);

   /* DenseV class methods */

   DenseV.each = function each(v1, f) {
      v1.values.forEach(function(v, i) { f(v, i + 1); });
      return Vector;
   };

   DenseV.eachPair = function eachPair(v1, v2, f) {
      v1.each(function(val, i) {
         f(val, v2.get(i), i);
      });
      return Vector;
   };

   /* DenseV.prototype methods */

   return DenseV;
};


});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
