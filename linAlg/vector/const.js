(function(define) {'use strict';
define(function(require) {

/* Returns a function which takes the Vector constructor and
 * creates the subclass ConstV of Vector
 */
return function(Vector) {

   // Subclass of `Vector` representing efficiently vectors all of whose
   // values are meant to be the same number.
   // Users should not need to access this directly.
   function ConstV(val, len) {
      this.val = val;
      this.length = len;
      this.constructor = ConstV;
   }

   ConstV.prototype = Object.create(Vector.prototype);

   ConstV.each = function each(v1, f) {
      var i;
      for (i = 1; i <= v1.length; i += 1) {
         f(v1.val, i);
      }
      return Vector;
   };

   /* ConstV.prototype methods */

   ConstV.prototype.get = function get(i) {
      if ( i < 1 || i > this.length) { return 0; }
      return this.val;
   };

   return ConstV;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
