var Matrix = require('../../linAlg/matrix');
var expect = require('chai').expect;

var A1 = new Matrix([4, 6, 7, 2, 1, 3], { nrow : 2 });
var A2 = new Matrix({ 2: { 3: 8, 4: 2}, 4: { 1: 5 }}, { nrow : 4, ncol: 6 });
var A3 = new Matrix(function(i, j) { return i * j; }, { nrow: 4, ncol: 6 });
var A4 = A3.view([3, 4], [1, 3]); // [[3, 4], [9, 12]]
var A5 = Matrix.diag([4, 5, 6, 7]);
var matrices = [A1, A2, A3, A4, A5];

describe('Unfaithful clones', function() {
   it('are DenseMs', function() {
      matrices.forEach(function(m) {
         var c;
         expect(function() { c = m.clone(false); }).to.not.throw(Error);
         expect(c).to.be.instanceof(Matrix.DenseM);
      });
   });
   it('have the correct values', function() {
      matrices.forEach(function(m) {
         var c = m.clone(false);
         expect(Matrix.sameDims(c, m)).to.be.true;
         for (var i = 0; i < m.nrow; i += 1) {
            for (var j = 0; j < m.ncol; j += 1) {
               expect(c.get(i, j)).to.equal(m.get(i, j));
            }
         }
      });
   });
   it('are not linked to the original matrix', function() {
      matrices.forEach(function(m) {
         var c = m.clone(false);
         m.mutable(true);
         expect(c.mutable()).to.be.false;
         m.set(1, 1, Math.random() * 3);
         expect(c.get(1, 1)).to.not.equal(m.get(1, 1));
         m.mutable(false);
         c.mutable(true);
         expect(m.mutable()).to.be.false;
         c.set(1, 1, Math.random() * 10);
         expect(m.get(1, 1)).to.not.equal(c.get(1, 1));
      });
   });
});
describe('Faithful clones', function() {
   it('preserve the structure', function() {
      matrices.forEach(function(m) {
         var c;
         expect(function() { c = m.clone(); }).to.not.throw(Error);
         if (m.constructor === Matrix.ViewM || m.constructor == Matrix.DenseM.TabularM) {
            expect(c).to.be.instanceof(Matrix.DenseM);
         } else {
            expect(c).to.be.instanceof(m.constructor);
         }
      });
   });
   it('have the correct values', function() {
      matrices.forEach(function(m) {
         var c = m.clone();
         expect(Matrix.sameDims(c, m)).to.be.true;
         for (var i = 0; i < m.nrow; i += 1) {
            for (var j = 0; j < m.ncol; j += 1) {
               expect(c.get(i, j)).to.equal(m.get(i, j));
            }
         }
      });
   });
   it('are not linked to the original matrix', function() {
      matrices;
      [A1].forEach(function(m) {
         var c = m.clone();
         m.mutable(true);
         expect(c.mutable()).to.be.false;
         m.set(1, 1, Math.random());
         expect(c.get(1, 1)).to.not.equal(m.get(1, 1));
         m.mutable(false);
         c.mutable(true);
         expect(m.mutable()).to.be.false;
         c.set(1, 1, Math.random());
         expect(m.get(1, 1)).to.not.equal(c.get(1, 1));
      });
   });
});