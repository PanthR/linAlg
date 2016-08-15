(function(define) {'use strict';
define(function(require) {

/* Returns a function which takes the Vector constructor and
 * creates the subclass SparseV of Vector
 */
return function(Vector) {

   // Subclass of `Vector` representing "sparse" vectors.
   // Sparse vectors are stored as objects, whose keys represent the indices
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
      // If NaN, we do want to return that, cannot "|| 0"
      if ( i < 1 || i > this.length) { return null; }
      return this._values.hasOwnProperty(i) ? this._values[i] : 0;
   };

   SparseV.prototype.change = function change(i, val) {
      this._values[i] = val;
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
         throw new Error('SparseV#eachPair: vectors should be same length');
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
         throw new Error('Vector.mapPair: vectors should be same length');
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

   SparseV.prototype.clone = function clone() {
      var values = {};
      var oldValues = this._values;
      Object.keys(oldValues).forEach(function(k) {
         values[k] = oldValues[k];
      });
      return new Vector(values, this.length);
   };

   /**
    * Return a new resized version of `this` with a new `length`.`fill` may be:
    * - `true`: we then recycle the Vector's values to the new length.
    * - `false` or omitted: we then fill in with zeros.
    * - a function `f(i)`: It is then used to fill in the _new_ values.
    */
   SparseV.prototype.resize = function resize(length, fill) {
      var obj, key, val, values;

      function fillMore(fill) {
         for (key = this.length + 1; key <= length; key += 1) {
            val = fill.call(this, key);
            if (val !== 0) { obj[key] = val; }
         }
      }

      obj = {};
      values = this._values;
      for (key in values) {
         if (values.hasOwnProperty(key) && parseInt(key) <= length) {
            obj[key] = values[key];
         }
      }
      if (typeof fill === 'function') {
         fillMore.call(this, fill);
      } else if (fill === true) {
         fillMore.call(this, function(key) {
            return this.get((key - 1) % this.length + 1);
         });
      }
      return new Vector(obj, length);
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
