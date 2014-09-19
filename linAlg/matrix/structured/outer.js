(function(define) {'use strict';
define(function(require) {

return function(Matrix, StructuredM) {

   // Subclass of `StructuredM` representing "Outer Product" matrices.
   // v1, v2 are vectors
   function OuterM(v1, v2) {
      this.v1 = new Matrix.Vector(v1);
      this.v2 = new Matrix.Vector(v2);
      this.byRow = false;
      this.nrow = this.v1.length;
      this.ncol = this.v2.length;
   }

   OuterM.prototype = Object.create(StructuredM.prototype);

   OuterM.prototype.classes = [ OuterM, Matrix ];

   OuterM.prototype.mutable = function mutable(newSetting) {
      if (newSetting == null) { return false; }
      throw new Error('Cannot set outer product matrix to be mutable');
   };

   OuterM.prototype.change = function(i, j, val) {
      throw new Error('Trying to set entry in outer product matrix');
   };

   OuterM.prototype.compute = function(i, j) {
      return this.v1.get(i) * this.v2.get(j);
   };

   // constructor to use for applying map
   OuterM.prototype.constr = function constr() {
      return Matrix;
   };

   OuterM.prototype.lvMult = function lvMult(v) {
      return this.v2.sMult(v.dot(this.v1));
   };

   OuterM.prototype.rvMult = function rvMult(v) {
      return this.v1.sMult(v.dot(this.v2));
   };

   OuterM.prototype.lMult = function lMult(m) {
      return new OuterM(m.mult(this.v1), this.v2);
   };

   OuterM.prototype.rMult = function rMult(m) {
      return new OuterM(this.v1, this.v2.mult(m));
   };

   OuterM.prototype.sMult = function sMult(k) {
      return new OuterM(this.v1.sMult(k), this.v2);
   };

   OuterM.prototype.transpose = function transpose() {
      return new OuterM(this.v2, this.v1);
   };

   return OuterM;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
