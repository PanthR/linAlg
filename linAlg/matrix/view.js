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
      this.i = lookup(rowIndex);
      this.j = lookup(colIndex);
      this.nrow = Array.isArray(rowIndex) ? rowIndex.length : dims.nrow;
      this.ncol = Array.isArray(colIndex) ? colIndex.length : dims.ncol;
      this.byRow = this.target.byRow;
      // need a ViewV into the target's values
      this.values = this.target.values.view(function fetch(n) {
         var viewInd = this.fromIndex(n); // index object
         return this.target.toIndex(this.i(viewInd.i), this.j(viewInd.j));
      }.bind(this), this.nrow * this.ncol);
      return this;
   }

   ViewM.prototype = Object.create(Matrix.prototype);

   return ViewM;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
