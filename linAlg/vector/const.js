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
      this.cached = false;
   }

   ConstV.prototype = Object.create(Vector.prototype);

   /* ConstV.prototype methods */

   ConstV.prototype._get = function _get(i) {
      if ( i < 1 || i > this.length) { return 0; }
      return this.val;
   };

   // Constant vectors are always immutable
   ConstV.prototype.mutable = function mutable(newSetting) {
      if (newSetting == null) { return false; }
      throw new Error('Cannot set a constant to be mutable');
   };

   ConstV.prototype.each = function each(f) {
      var i;
      for (i = 1; i <= this.length; i += 1) {
         f(this.val, i);
      }
      return this;
   };

   return ConstV;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
