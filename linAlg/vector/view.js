(function(define) {'use strict';
define(function(require) {

/* Returns a function which takes the Vector constructor and
 * creates the subclass ViewV of Vector
 */
return function(Vector) {

   // Subclass of `Vector` representing vectors that provide a "view" into
   // another object, e.g. the row or column of a `Matrix`. Changes to a view
   // vector cause changes to the corresponding "viewed" object and vice versa.

   // `target` can be either a Vector or a Matrix.
   function ViewV(target, indices, len) {
      if (target instanceof Vector) {
         return new VectorView(target, indices, len);
      }
      return new MatrixView(target, indices, len, arguments[3]);
   }

   // Constructs a view into a `Vector`. `target` must be a `Vector`.
   // `indices` can be:
   // 1. an array of indices, or
   // 2. a function which computes the translation from VectorView-index
   // to target-index
   //
   // `len` is the length of the resulting vector. Needed only in case 2.
   function VectorView(target, indices, len) {
      this.target = target;
      if (typeof indices === 'function') {
         this.i = indices;
         this.length = len;
      } else {
         this.i = function(i) { return indices[i - 1]; };
         this.length = indices.length;
      }
      this.cached = false;
      return this;
   }

   // Constructs a view into a `Matrix`. `target` must be a `Matrix`.
   // `rowIndex` and `colIndex` can be:
   // 1. A positive integer. Then the view is into elements in that row/column
   // 2. A array of indices, or
   // 3. A function for calculating indices.
   //
   // len is optional if at least one of `rowIndex` and `colIndex` is an array.
   function MatrixView(target, rowIndex, colIndex, len) {
      this.target = target;
      function lookup(indices) {
         if (typeof indices === 'function') { return indices; }
         if (Array.isArray(indices)) {
            return function(i) { return indices[i - 1]; };
         }
         return function(i) { return indices; }; // constant
      }
      this.i = lookup(rowIndex);
      this.j = lookup(colIndex);
      this.length = rowIndex.length || colIndex.length || len || 0;
      this.cached = false;
      return this;
   }

   ViewV.prototype = Object.create(Vector.prototype);
   VectorView.prototype = Object.create(ViewV.prototype);
   MatrixView.prototype = Object.create(ViewV.prototype);

   ViewV.prototype._get = function _get(i) {
      if ( i < 1 || i > this.length) { return 0; }
      return this.compute(i);
   };

   ViewV.prototype.each = function each(f) {
      var i;
      for (i = 1; i <= this.length; i += 1) {
         f(this._get(i), i);
      }
      return Vector;
   };

   VectorView.prototype.compute = function compute(i) {
      return this.target._get(this.i(i));
   };

   MatrixView.prototype.compute = function compute(i) {
      return this.target._get(this.i(i), this.j(i));
   };

   return ViewV;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
