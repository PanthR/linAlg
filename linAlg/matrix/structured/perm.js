(function(define) {'use strict';
define(function(require) {

var Permutation = require('./../../permutation.js');

return function(Matrix, StructuredM) {

   // Subclass of `StructuredM` representing "Permutation" matrices.
   // perm is a Perm or something that can turned into a Perm
   function PermM(perm, nrow) {
      this.perm     = new Permutation(perm);
      this.invPerm  = this.perm.inverse();
      this.nrow     = nrow && nrow.nrow || nrow;
      this.ncol     = this.nrow;
      this.byRow    = false;
   }

   PermM.mult = function(A, B) {
      return new PermM(B.perm.compose(A.perm), A);
   };

   PermM.prototype = Object.create(StructuredM.prototype);

   PermM.prototype.classes = [ PermM, StructuredM, Matrix ];

   PermM.prototype.mutable = function mutable(newSetting) {
      if (newSetting == null) { return false; }
      throw new Error('Cannot set permutation matrix to be mutable');
   };

   PermM.prototype.change = function(i, j, val) {
      throw new Error('Trying to set entry in permutation matrix');
   };

   PermM.prototype.compute = function(i, j) {
      return i === this.perm.get(j) ? 1 : 0;
   };

   // constructor to use for applying map
   PermM.prototype.constr = function constr() {
      return Matrix;
   };

   PermM.prototype.lvMult = function lvMult(v) {
      return v.permute(this.invPerm);
   };

   PermM.prototype.rvMult = function rvMult(v) {
      return v.permute(this.perm);
   };

   PermM.prototype.lMult = function lMult(m) {
      if (m.isA(PermM)) { return PermM.mult(m, this); }
      return m.view(ident, this.perm.get.bind(this.perm), m);
   };

   PermM.prototype.rMult = function rMult(m) {
      if (m.isA(PermM)) { return PermM.mult(this, m); }
      return m.view(this.invPerm.get.bind(this.invPerm), ident, m);
   };

   PermM.prototype.sMult = function sMult(k) {
      return sparsify(this).sMult(k);
   };

   PermM.prototype.map = function map(f) {
      return sparsify(this).map(f);
   };

   PermM.prototype.each = function each(f) {
      sparsify(this).each(f);
      return this;
   };

   PermM.prototype.transpose = function transpose() {
      return new PermM(this.invPerm, this);
   };

   function ident(i) { return i; }

   function sparsify(m) {
      var obj, i;
      obj = {};
      for (i = 1; i <= m.nrow; i += 1) {
         obj[m.perm.get(i)] = { };
         obj[m.perm.get(i)][i] = 1;
      }
      return new Matrix.SparseM(obj, m);
   }

   return PermM;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
