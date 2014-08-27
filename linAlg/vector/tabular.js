(function(define) {'use strict';
define(function(require) {

/* Returns a function which takes the Vector constructor and
 * creates the subclass TabularV of Vector
 */
return function(Vector) {

   // Subclass of `Vector` representing vectors whose values are specified via
   // a function `f(i)` of the index.
   // The values of the vector are computed lazily, only when they are accessed.
   // Users should not need to access this directly.
   function TabularV(f, len) {
      this.f = f;
      this.length = len;
      this.cached = false;
   }

   TabularV.prototype = Object.create(Vector.DenseV.prototype);

   TabularV.each = function each(v, f) {
      v.force().each(f);
      return Vector;
   };

   /* TabularV.prototype methods */

   TabularV.prototype.compute = function compute(i) {
      return this.f(i);
   };

   TabularV.prototype.force = function force() {
      var i;
      if (!this.cached) {
         for (i = 1; i <= this.length; i += 1) { this.get(i); }
         this.cached = true;
      }
      return this;
   };

   return TabularV;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
