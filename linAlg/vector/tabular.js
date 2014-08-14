(function(define) {'use strict';
define(function(require) {

/* Returns a function which takes the Vector constructor and
 * creates the subclass TabularV of Vector
 */
return function(Vector) {
   /**
    * An internal representation of vectors represented via a function.
    * Users should not need to access this directly.
    * Use {{#crossLink "Vector"}}{{/crossLink}} instead.
    *
    * Implementation detail: The values of the vector are computed lazily,
    * only when they are accessed. Users should not count on side-effects of the function `f`.
    * @namespace Vector
    * @class TabularV
    * @param f {Function}  The entry-generating function `f(n)`
    * @param len {Integer} The length of the resulting vector.
    * @constructor
    *
    */
   function TabularV(f, len) {
      this.f = f;
      this.length = len;
      this.constructor = TabularV;
   }

   TabularV.prototype = Object.create(Vector.prototype);

   TabularV.forEach = function forEach(v1, f) {
      var i;
      for (i = 1; i <= v1.length; i += 1) {
         f(v1.get(i), i);
      }
      return Vector;
   };

   // TabularV.prototype methods

   TabularV.prototype.compute = function compute(i) {
      return this.f(i);
   };

   return TabularV;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) { 
   'use strict';
   module.exports = factory(require); 
}));