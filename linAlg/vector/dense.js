(function(define) {'use strict';
define(function(require) {

/* Returns a function which takes the Vector constructor and
 * creates the subclass DenseV of Vector
 */
return function(Vector) {

   /**
    * Constructs a DenseV object
    * @param {array} arr - Values
    */
   function DenseV(arr) {
      this.values = arr;
      this.length = arr.length;
   }

   // makes DenseV a "subclass" of Vector
   DenseV.prototype = Object.create(Vector.prototype);

   // DenseV class methods
   
   DenseV.forEach = function forEach(v1, f) {
      v1.values.forEach(function(v, i) { f(v, i + 1); });
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