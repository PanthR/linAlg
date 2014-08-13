(function(define) {'use strict';
define(function(require) {

   // TODO: decide if Vectors are editable (implement 'set' method?)
   
   // TODO:  Testing

   var DenseV, SparseV, TabularV;

   /**
    * Constructs a Vector object
    * @param {array|function|object} arr - Values
    * @param {int} [len] - length of Vector
    */
   function Vector(arr, len) {
      if (Array.isArray(arr)) {
         return new DenseV(arr);
      }
      if (typeof arr === 'function') {
         return new TabularV(arr, len);
      }
      return new SparseV(arr, len);
   }

   Vector.DenseV   = DenseV   = (require('./vector/dense'))(Vector);
   Vector.SparseV  = SparseV  = (require('./vector/sparse'))(Vector);
   Vector.TabularV = TabularV = (require('./vector/tabular'))(Vector);

   // Vector.prototype methods 

   /**
    * Returns the ith value
    * @param  {int} i  - index
    * @return {double} - value
    *
    * Vector indexing begins from 1
    */
   Vector.prototype.get = function get(i) {
      if ( i < 1 || i > this.length) { return 0; }
      if (!this.values) { this.values = []; }
      if (this.values[i-1] == null) { 
         this.values[i-1] = this.compute(i) || 0;
      }
      return this.values[i-1];
   };

   /**
    * Sets the ith value
    * @param {int} i - index
    * @param {double} v - value
    * @return {object} this
    */
   Vector.prototype.set = function set(i, v) {
      if ( i >= 1 && i <= this.length) { 
         if (!this.values) { this.values = []; }
         this.values[i-1] = v || 0;
      }
      return this;
   };

   /**
    * Compute the ith entry, to be used internally
    * @private
    * @param  {int} i  - index
    * @return {number} - value
    */
   Vector.prototype.compute = function compute(i) {

      throw new Error('Subclasses of Vector need to implement compute: ' +
         this.constructor.name);
   };


   /**
    * Dot product
    * @param  {[type]} other [description]
    * @return {[type]}       [description]
    */
   // Vector.prototype.dot = function dot(other) {
   //    var res, i, l;

   //    res = 0;
   //    l = this.length;

   //    for(i = 0; i < l; i += 1) {
   //       res += this.get(i) * other.get(i);
   //    }

   //    return res;
   // };

   // Helper functions
   
   /** @private */
   function sameLength(a, b) {
      return a.length === b.length;
   }

   /** @private */
   function isSparse(a) {
      return a instanceof SparseV;
   }

   return Vector;

});

}(typeof define === 'function' && define.amd ? define : function(factory) { 
   'use strict';
   module.exports = factory(require); 
}));