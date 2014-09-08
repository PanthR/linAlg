(function(define) {'use strict';
define(function(require) {

return function(Matrix) {

   /* Subclass of Vector for expressing a row or column of a matrix.
    */
   function ViewMV(target, index, direction) {
      this.isRow = direction === 'row';
      this.target = target;
      this.index = index;
      this.length = this.isRow ? target.ncol : target.nrow;
      return this;
   }

   ViewMV.prototype = Object.create(Matrix.Vector.ViewV.prototype);

   ViewMV.prototype.compute = function compute(i) {
      if (this.isRow) {
         return this.target._get(this.index, i);
      }
      return this.target._get(i, this.index);
   };

   ViewMV.prototype.change = function change(i, val) {
      if (this.isRow) {
         return this.target._set(this.index, i, val);
      }
      return this.target._set(i, this.index, val);
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
