(function(define) {'use strict';
define(function(require) {

/* Returns a function which takes the Vector constructor and
 * creates the subclass SparseV of Vector
 */
return function(Vector) {

   // Subclass of `Vector` representing "sparse" vectors.
   // Sparce vectors are stored as objects, whose keys represent the indices
   // that have non-zero values.
   // Users should not need to access this directly.
   function SparseV(arr, len) {
      this._values = arr;
      this.length = len;
      this.cached = false;
      this.constructor = SparseV;
   }

   SparseV.prototype = Object.create(Vector.prototype);

   /* SparseV class methods */

   SparseV.each = function each(v, f, skipZeros) {
      var i, vals;
      vals = v._values;
      if (skipZeros) {
         Object.keys(vals).forEach(function(i) {
            f(vals[i], parseInt(i));
         });
      } else {
         for (i = 1; i <= v.length; i += 1) {
            f(v.get(i), i);
         }
      }
      return Vector;
   };
   SparseV.eachPair = function eachPair(v1, v2, f, skipZeros) {
      var i, vals;
      vals = v1._values;
      if (skipZeros) {
         Object.keys(vals).forEach(function(i) {
            f(vals[i], v2.get(parseInt(i)), parseInt(i));
         });
      } else {
         for (i = 1; i <= v1.length; i += 1) {
            f(v1.get(i), v2.get(i), i);
         }
      }
      return Vector;
   };

   SparseV.map = function map(v, f) {
      var newValues = {};
      SparseV.each(v, function(val, i) {
         newValues[i] = f(val, i);
      }, true);
      return new Vector(newValues, v.length);
   };

   SparseV.mapPair = function mapPair(v1, v2, f) {
      var newValues = {};
      Vector.eachPair(v1, v2, function(val1, val2, i) {
         newValues[i] = f(val1, val2, i);
      }, true);
      return new Vector(newValues, v1.length);
   };

   /* SparseV.prototype methods */

   SparseV.prototype.get = function get(i) {
      return this._values[i] || 0;
   };

   SparseV.prototype.set = function set(i, v) {
      if ( i >= 1 && i <= this.length) {
         this._values[i] = v || 0;
      }
      return this;
   };

   return SparseV;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
