var Matrix = require('../../linAlg/matrix');
var Permutation = require('../../linAlg/permutation');
var expect = require('chai').expect;

var I = Matrix.const(1, 5);
var p = new Permutation([2, 3, 4]);

describe('Permutation matrices', function() {
   var M;
   it('are created from a permutation', function() {
      expect(function() { M = new Matrix.PermM(p, I); }).to.not.throw(Error);
      expect(M.isA(Matrix.PermM)).to.be.ok;
      expect(Matrix.sameDims(M, I)).to.be.ok;
   });
   it('have permuted the rows of the identity according to the permutation', function() {
      for (var i = 1; i <= p.nrow; i++) {
         expect(M.rowView(p.get(i)).equals(I.rowView(i))).to.be.ok;
      }
   });
   it('have as transposes permutation matrices of the inverse permutation', function() {
      expect(M.transpose().isA(Matrix.PermM)).to.be.ok;
      for (var i = 1; i <= p.nrow; i++) {
         expect(M.transpose().rowView(i).equals(I.rowView(p.get(i)))).to.be.ok;
      }
   });
   it('when multiplied by a vector does the correct thing', function() {
      for (var i = 1; i < 10; i++) {
         var v = new Matrix.Vector(Math.random, 5);
         expect(M.rvMult(v).equals(new Matrix(M.toArray()).mult(v))).to.be.ok;
         expect(M.lvMult(v).equals(v.mult(new Matrix(M.toArray())))).to.be.ok;
      }
   });
   it('when multiplied by a matrix does the correct thing', function() {
      for (var i = 1; i < 10; i++) {
         var M2 = new Matrix(Math.random, { nrow: 5, ncol: 6 });
         var M3 = new Matrix(Math.random, { nrow: 6, ncol: 5 });
         expect(M.rMult(M2).equals(new Matrix(M.toArray()).mult(M2))).to.be.ok;
         expect(M.lMult(M3).equals(M3.mult(new Matrix(M.toArray())))).to.be.ok;
      }
   });
   it('when multiplied by another permutation matrix result in a permutation matrix of the composite permutation', function() {
      var p2 = new Permutation([1, 3, 5]);
      var M2 = new Matrix.PermM(p2, 5);
      expect(M.mult(M2).isA(Matrix.PermM)).to.be.ok;
      expect(M.mult(M2).equals(new Matrix(M.toArray()).mult(new Matrix(M2.toArray())))).to.be.ok;
      expect(M2.mult(M).equals(new Matrix(M2.toArray()).mult(new Matrix(M.toArray())))).to.be.ok;
   });
});
describe('Matrices', function() {
   var M = new Matrix(Math.random, { nrow: 5, ncol: 6 });
   it('can have their rows permuted', function() {
      var M2 = M.rowPermute([1, 3, 4]);
      expect(Matrix.sameDims(M, M2));
      expect(M2.rowView(3).equals(M.rowView(1))).to.be.ok;
      expect(M2.rowView(2).equals(M.rowView(2))).to.be.ok;
      expect(M2.rowView(4).equals(M.rowView(3))).to.be.ok;
      expect(M2.rowView(4).equals(M.rowView(4))).to.not.be.ok;
      expect(M2.rowView(5).equals(M.rowView(5))).to.be.ok;
      expect(M2.rowView(1).equals(M.rowView(4))).to.be.ok;
   });
   it('can have their columns permuted', function() {
      var M2 = M.colPermute([1, 3, 4]);
      expect(Matrix.sameDims(M, M2));
      expect(M2.colView(3).equals(M.colView(1))).to.be.ok;
      expect(M2.colView(2).equals(M.colView(2))).to.be.ok;
      expect(M2.colView(4).equals(M.colView(3))).to.be.ok;
      expect(M2.colView(4).equals(M.colView(4))).to.not.be.ok;
      expect(M2.colView(5).equals(M.colView(5))).to.be.ok;
      expect(M2.colView(1).equals(M.colView(4))).to.be.ok;
   });
});