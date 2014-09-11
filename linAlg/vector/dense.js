(function(define) {'use strict';
define(function(require) {

/* Returns a function which takes the Vector constructor and
 * creates the subclass DenseV of Vector
 */
return function(Vector) {

   // Subclass of `Vector` representing "dense" vectors.
   // Dense vectors are stored simply as Javascript Arrays
   // Users should not need to access this directly.
   function DenseV(arr) {
      this.values = arr;
      this.length = arr.length;
      this.cached = true;
   }

   /* makes DenseV a "subclass" of Vector */
   DenseV.prototype = Object.create(Vector.prototype);

   /* DenseV.prototype methods */

   DenseV.prototype.change = function change(i, val) {
      if (!this.values) { this.values = []; }
      this.values[i - 1] = val;
      return this;
   };

   DenseV.prototype.each = function each(f) {
      this.force();
      (this.values || []).forEach(function(val, i) { f(val, i + 1); });
      return this;
   };

   return DenseV;
};


});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
