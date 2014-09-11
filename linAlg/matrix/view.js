(function(define) {'use strict';
define(function(require) {

/* Returns a ...
 */
return function(Matrix) {

   function ViewM(target, rowIndex, colIndex, dims) {
      this.target = target;
      function lookup(indices) {
         if (typeof indices === 'function') { return indices; }
         if (Array.isArray(indices)) {
            return function(i) { return indices[i - 1]; };
         }
         return function(i) { return indices; }; // constant
      }
      // this.i(i) is the row in target corresponding to the i-th row in view
      this.i = lookup(rowIndex);
      this.j = lookup(colIndex);
      this.nrow = Array.isArray(rowIndex) ? rowIndex.length : dims.nrow;
      this.ncol = Array.isArray(colIndex) ? colIndex.length : dims.ncol;
      this.byRow = false;
      return this;
   }

   ViewM.prototype = Object.create(Matrix.prototype);

   ViewM.prototype.compute = function compute(i, j) {
      return this.target._get(this.i(i), this.j(j));
   };

   ViewM.prototype.change = function change(i, j, val) {
      this.target._set(this.i(i), this.j(j), val);
      return this;
   };

   ViewM.prototype.mutable = function mutable(newSetting) {
      if (newSetting != null) {
         this.target.mutable(newSetting);
         return this;
      }
      return this.target.mutable();
   };

   return ViewM;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
