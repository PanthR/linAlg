(function(define) {'use strict';
define(function(require) {

/* Returns a function which takes the Vector constructor and
 * creates the subclass ViewV of Vector
 */
return function(Vector) {

   // Subclass of `Vector` representing vectors that provide a "view" into
   // another object, e.g. the row or column of a `Matrix`. Changes to a view
   // vector cause changes to the corresponding "viewed" object and vice versa.
   //
   // Constructs a view into a `Vector`. `target` must be a `Vector`.
   // `indices` can be:
   // 1. an array of indices, or
   // 2. a function which computes the translation from ViewV-index
   // to target-index
   //
   // `len` is the length of the resulting vector. Needed only in case 2.
   function ViewV(target, indices, len) {
      if (!this instanceof ViewV) { return new ViewV(target, indices, len); }
      this.target = target;
      if (typeof indices === 'function') {
         this.i = indices;
         if (len == null) {
            throw new Error('ViewV with function requires length arg');
         }
         this.length = len;
      } else {
         this.i = function(i) { return indices[i - 1]; };
         this.length = indices.length;
      }
      this.cached = false;
      return this;
   }

   ViewV.prototype = Object.create(Vector.prototype);

   ViewV.prototype._get = function _get(i) {
      if ( i < 1 || i > this.length) { return 0; }
      return this.compute(i);
   };

   ViewV.prototype.compute = function compute(i) {
      return this.target._get(this.i(i));
   };

   ViewV.prototype.change = function change(i, val) {
      this.target._set(this.i(i), val);
      return this;
   };

   // A ViewV's mutability is directly tied to its target's mutability.
   ViewV.prototype.mutable = function mutable(newSetting) {
      if (newSetting != null) {
         this.target.mutable(newSetting);
         return this;
      }
      return this.target.mutable();
   };

   ViewV.prototype.each = function each(f) {
      var i;
      for (i = 1; i <= this.length; i += 1) {
         f(this._get(i), i);
      }
      return Vector;
   };

   return ViewV;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
