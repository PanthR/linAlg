(function(define) {'use strict';
define(function(require) {

return function(Matrix) {

   /* Subclass of Vector for expressing a row or column of a matrix.
    */
   /* eslint-disable complexity */
   function ViewMV(target, index, direction) {
      var jEnd;
      if (direction == null) {
         throw new Error('`direction` is a required argument');
      }
      this.direction = direction; // row, col, or diag
      this.target = target;
      this.index = index;  // diag 0 is main diagonal
      if (this.direction === 'row') {
         if (index < 1 || index > target.nrow) {
            throw new Error('Row index out of bounds');
         }
         this.length = target.ncol;
      } else if (this.direction === 'col') {
         if (index < 1 || index > target.ncol) {
            throw new Error('Column index out of bounds');
         }
         this.length = target.nrow;
      } else {
         // only diagonals have offsets
         this.iOffset = Math.max(-index, 0); // start row is 1 + this
         this.jOffset = Math.max(index, 0);  // start col is 1 + this
         jEnd = Math.min(target.ncol, target.nrow + index);
         this.length = jEnd - this.jOffset;
         if (this.length <= 0) {
            throw new Error('Diagonal offset out of bounds');
         }
      }
      return this;
   }
   /* eslint-enable */
   ViewMV.prototype = Object.create(Matrix.Vector.ViewV.prototype);

   ViewMV.prototype.compute = function compute(i) {
      if (this.direction === 'row') {
         return this.target._get(this.index, i);
      } else if (this.direction === 'col') {
         return this.target._get(i, this.index);
      }
      // diagonal -- i already validated
      return this.target._get(i + this.iOffset, i + this.jOffset);
   };

   ViewMV.prototype.change = function change(i, val) {
      if (this.direction === 'row') {
         this.target._set(this.index, i, val);
      } else if (this.direction === 'col') {
         this.target._set(i, this.index, val);
      } else {
         // diagonal
         this.target._set(i + this.iOffset, i + this.jOffset, val);
      }
      return this;
   };

   ViewMV.prototype.each = function each(f) {
      var i;
      for (i = 1; i <= this.length; i += 1) {
         f(this.compute(i), i);
      }
   };

   return ViewMV;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
