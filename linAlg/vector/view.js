(function(define) {'use strict';
define(function(require) {

/* Returns a function which takes the Vector constructor and
 * creates the subclass ViewV of Vector
 */
return function(Vector) {

   // Subclass of `Vector` representing vectors whose values are specified via...

   // target is either a vector or a matrix
   function ViewV(target, indices, len) {
      if (target instanceof Vector) {
         return new VectorView(target, indices, len);
      }
      return new MatrixView(target, indices, len, arguments[3]);
   }

   // target is a vector.
   // indices can be
   //   (1) an array, or
   //   (2) a function which computes the translation from indexing in
   //   the VectorView to indexing in the target.
   // len is the length of the resulting vector.
   function VectorView(target, indices, len) {
      this.target = target;
      if (typeof indices === 'function') {
         this.i = indices;
         this.length = len;
      } else {
         this.i = function(i) { return indices[i - 1]; };
         this.length = indices.length;
      }
      this.constructor = VectorView;
      return this;
   }

   // target is a matrix.
   // rowIndex and colIndex are both either a pos integer or an array
   // of indices or a function for calculating indices.
   // len is optional if at least one of them is an array.
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
      this.constructor = MatrixView;
      return this;
   }

   ViewV.prototype = Object.create(Vector.prototype);
   VectorView.prototype = Object.create(ViewV.prototype);
   MatrixView.prototype = Object.create(ViewV.prototype);

   ViewV.each = VectorView.each = MatrixView.each = function each(v, f) {
      var i;
      for (i = 1; i <= v.length; i += 1) {
         f(v.get(i), i);
      }
      return Vector;
   };
   ViewV.prototype.get = function get(i) {
      if ( i < 1 || i > this.length) { return 0; }
      return this.compute(i);
   };

   VectorView.prototype.compute = function compute(i) {
      return this.target.get(this.i(i));
   };

   MatrixView.prototype.compute = function compute(i) {
      return this.target.get(this.i(i), this.j(i));
   };

   return ViewV;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
