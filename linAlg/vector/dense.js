(function(define) {'use strict';
define(function(require) {

/* Returns a function which takes the Vector constructor and
 * creates the subclass DenseV of Vector
 */
return function(Vector) {

   /**
    * An internal representation of "dense" vectors. Users should not need to access this directly.
    * Use {{#crossLink "Vector"}}{{/crossLink}} instead.
    * @namespace Vector
    * @class DenseV
    * @extends Vector
    * @param arr {Array} values
    * @constructor
    */
   function DenseV(arr) {
      this.values = arr;
      this.length = arr.length;
      this.constructor = DenseV;
   }

   // makes DenseV a "subclass" of Vector
   DenseV.prototype = Object.create(Vector.prototype);

   // DenseV class methods
   
   DenseV.forEach = function forEach(v1, f) {
      v1.values.forEach(function(v, i) { f(v, i + 1); });
      return Vector;
   };

   DenseV.forEachPair = function forEachPair(v1, v2, f) {
      v1.forEach(function(val, i) {
         f(val, v2.get(i), i);
      });
      return Vector;
   };

   // DenseV.prototype methods

   // DenseV.prototype.dot = function dot(other) {
   //    if (isSparse(other)) {
   //       return other.dot(this);
   //    }
   //    // both are dense
   //    return Vector.prototype.dot.call(this, other);
   // }

   return DenseV;
};


});

}(typeof define === 'function' && define.amd ? define : function(factory) { 
   'use strict';
   module.exports = factory(require); 
}));