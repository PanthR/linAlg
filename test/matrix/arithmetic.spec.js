var Matrix = require('../../linAlg/matrix');
var expect = require('chai').expect;

function random(i) { return Math.floor(Math.random() * i + 1); }

var A = [];
A[1] = new Matrix([4, 6, 7, 2, 1, 3, 5, 7.53, 9.95], { nrow : 3 });
A[2] = new Matrix({ 2: { 3: 8, 1: 2}, 1: { 1: 5 }}, { nrow : 3, ncol: 3 });
A[3] = new Matrix(function(i, j) { return i * j; }, { nrow: 3, ncol: 3 });
A[4] = Matrix.diag([4, 3.3, 5.1]);
A[5] = Matrix.const(5.8, 3);
A[6] = new Matrix.StructuredM.LowerTriM(A[1]);
A[7] = new Matrix.StructuredM.UpperTriM(A[1]);
A[8] = new Matrix.StructuredM.SymmetricM(A[1]);

describe('Matrix addition', function() {
   function execute(f) { // do f for each pair in A
      for (var i = 1; i < A.length; i += 1) {
         for (var j = 1; j < A.length; j += 1) {
            f(A[i], A[j]);
         }
      }
   }
   it('exists', function() {
      // add method exists, doesn't throw error, makes correct dimensions
      execute(function(m, n) {
         expect(m).to.respondTo('pAdd');
         var res;
         expect(function() {
            res = m.pAdd(n, Math.random());
         }).to.not.throw(Error);
         expect(function() {
            res.toArray();
         }).to.not.throw(Error);
         expect(Matrix.sameDims(m, res)).to.be.true;
      });
   });
   it('returns correct values', function() {
      execute(function(m, n) {
         var k = Math.random();
         var res = m.pAdd(n, k);
         for (var i = 1; i <= m.nrow; i += 1) {
            for (var j = 1; j <= m.ncol; j += 1) {
               expect(res.get(i, j) === m.get(i, j) + k * n.get(i, j));
            }
         }
      });
   });
   it('returns correct classes', function() {
      // lower trim with lower, diag -- etc...
      expect(A[6].pAdd(A[6]).isA(Matrix.StructuredM.LowerTriM)).to.be.ok;
      expect(A[4].pAdd(A[6]).isA(Matrix.StructuredM.LowerTriM)).to.be.ok;
      expect(A[5].pAdd(A[6]).isA(Matrix.StructuredM.LowerTriM)).to.be.ok;
      expect(A[6].pAdd(A[5]).isA(Matrix.StructuredM.LowerTriM)).to.be.ok;
      expect(A[4].pAdd(A[4]).isA(Matrix.StructuredM.DiagM)).to.be.ok;
      expect(A[4].pAdd(A[5]).isA(Matrix.StructuredM.DiagM)).to.be.ok;
      expect(A[5].pAdd(A[5]).isA(Matrix.StructuredM.CDiagM)).to.be.ok;
      expect(A[4].pAdd(A[8]).isA(Matrix.StructuredM.SymmetricM)).to.be.ok;
      expect(A[5].pAdd(A[8]).isA(Matrix.StructuredM.SymmetricM)).to.be.ok;
      expect(A[8].pAdd(A[8]).isA(Matrix.StructuredM.SymmetricM)).to.be.ok;
      expect(A[2].pAdd(A[2]).isA(Matrix.DenseM.SparseM)).to.be.ok;
   });
   it('throws error for incompatible dimensions', function() {
      execute(function(m, n) {
         expect(function() {
            m.view([1, 2],[1, 2, 3]).pAdd(n, 2);
         }).to.throw(Error);
      });
   });
});
describe('Scalar multiplication', function() {
   function execute(f) {
      for (var i = 1; i < A.length; i += 1) {
            f(A[i]);
      }
   }
   it('exists', function() {
      execute(function(m) {
         var m2;
         expect(m).to.respondTo('sMult');
         expect(function() { m2 = m.sMult(Math.random()); }).to.not.throw(Error);
         expect(Matrix.sameDims(m, m2)).to.be.true;
      });
   });
   it('has the correct values', function() {
      execute(function(m) {
         var k = Math.random(), m2 = m.sMult(k);
         for (var i = 1; i <= m.nrow; i += 1) {
            for (var j = 1; j <= m.ncol; j += 1) {
               expect(m2.get(i, j)).to.equal(k * m.get(i, j));
            }
         }
      });
   });
   it('preserves structure', function() {
      execute(function(m) {
         expect(m.sMult(Math.random()).classes[0]).to.equal(m.classes[0]);
      });
   });
});