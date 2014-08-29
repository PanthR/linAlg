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
   }

   SparseV.prototype = Object.create(Vector.prototype);

   /* SparseV.prototype methods */

   SparseV.prototype._get = function _get(i) {
      return this._values[i] | 0;
   };

   SparseV.prototype.change = function change(i, val) {
      this._values[i] = val | 0;
      return this;
   };

   SparseV.prototype.each = function each(f, skipZeros) {
      var i, vals;
      vals = this._values;
      if (skipZeros) {
         Object.keys(vals).forEach(function(i) {
            f(vals[i], parseInt(i));
         });
      } else {
         for (i = 1; i <= this.length; i += 1) {
            f(this._get(i), i);
         }
      }
      return this;
   };

   SparseV.prototype.eachPair = function eachPair(v2, f, skipZeros) {
      var i, vals;
      if (!this.sameLength(v2)) {
         throw new Error('SparseV#eachPair: vectors should be same langth');
      }
      vals = this._values;
      if (skipZeros) {
         Object.keys(vals).forEach(function(i) {
            f(vals[i], v2._get(parseInt(i)), parseInt(i));
         });
      } else {
         for (i = 1; i <= this.length; i += 1) {
            f(this._get(i), v2._get(i), i);
         }
      }
      return Vector;
   };

   SparseV.prototype.map = function map(f, skipZeros) {
      if (!skipZeros) { return Vector.prototype.map.call(this, f); }
      var newValues = {};
      this.each(function(val, i) {
         newValues[i] = f(val, i);
      }, true);
      return new Vector(newValues, this.length);
   };

   SparseV.prototype.mapPair = function mapPair(v2, f, skipZeros) {
      if (!this.sameLength(v2)) {
         throw new Error('Vector.mapPair: vectors should be same langth');
      }
      var newValues = {};
      if (!skipZeros && !v2.isSparse()) {
         return new Vector(function(i) {
            return f(this._get(i), v2._get(i), i);
         }.bind(this), this.length);
      }
      this.eachPair(v2, function(val1, val2, i) {
         newValues[i] = f(val1, val2, i);
      }, true);
      return new Vector(newValues, this.length);
   };

   SparseV.prototype.isSparse = function isSparse() {
      return true;
   };

   return SparseV;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
