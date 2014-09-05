var Matrix = require('../../linAlg/matrix');
var expect = require('chai').expect;

describe('View matrices', function() {
   var A1 = new Matrix([4, 6, 7, 2, 1, 3, 8, 9, 12, 5, 33, 25], { nrow : 3 });
   var A2 = new Matrix({ 2: { 3: 8, 4: 2}, 4: { 1: 5 }}, { nrow : 4, ncol: 6 });
   var f  = function(i, j) { return i - j; }
   var A3 = new Matrix(f, { nrow : 4, ncol: 6 });
   var A4 = A1.view([1, 3],[4, 2]);
   var A5 = A2.view(function a(i) { return 2;}, [3, 2], { nrow : 2}); // [[8,0],[8,0]]
   var A6 = A3.view(function a(i) { return 5 - i; }, 
      function b(j) { return 7 - j}, { nrow : 4, ncol: 6 });
   it('have correct dimensions', function() {
      expect(A4.nrow).to.equal(2);
      expect(A4.ncol).to.equal(2);
      expect(A5.nrow).to.equal(2);
      expect(A5.ncol).to.equal(2);
      expect(A6.nrow).to.equal(4);
      expect(A6.ncol).to.equal(6);
   });
   it('look up the correct values with get', function() {
      expect(A4.get(2,1)).to.equal(A1.get(3,4));
      expect(A4.get(2,2)).to.equal(A1.get(3,2));
      expect(A5.get(2,1)).to.equal(A2.get(2,3));
      expect(A5.get(1,2)).to.equal(A2.get(2,2));
      expect(A6.get(2,1)).to.equal(A3.get(3,6));
      expect(A6.get(3,6)).to.equal(A3.get(2,1));
   });
   it('respect changes to the target matrix', function() {
      A1.mutable(true).set(3,4,99);
      expect(A4.get(2, 1)).to.equal(99);
      A2.mutable(true).set(2, 3, 99);
      expect(A5.get(2, 1)).to.equal(99);
      A3.mutable(true).set(2, 1,99);
      expect(A6.get(3, 6)).to.equal(99);
   });
   it('respects the mutable setting of the target', function() {
      A4.mutable(true); A1.mutable(false);
      expect(A4.mutable()).to.be.false;
      expect(function() { A4.set(1, 1, 2); }).to.throw(Error);
      A1.mutable(true);
      expect(A4.mutable()).to.be.true;
      expect(function() { A4.set(1, 1, 2); }).to.not.throw(Error);
   });
   it('when set, affect the target values', function() {
      A4.mutable(true).set(2, 1, 100);
      expect(A1.get(3, 4)).to.equal(100);
      A5.mutable(true).set(2, 1, 100);
      expect(A2.get(2, 3)).to.equal(100);
      A6.mutable(true).set(3, 6, 100);
      expect(A3.get(2, 1)).to.equal(100);
   });
});
describe('Matrix to Vector:', function() {
   describe('rowView', function() {
      var A1 = new Matrix([4, 6, 7, 2, 1, 3, 8, 9, 12, 5, 33, 25], { nrow : 3 });
      var A2 = new Matrix({ 2: { 3: 8, 4: 2}, 4: { 1: 5 }}, { nrow : 4, ncol: 6 });
      var f  = function(i, j) { return i - j; }
      var A3 = new Matrix(f, { nrow : 4, ncol: 6 });
      var A4 = A1.view([1, 3],[4, 2]);
      var v1 = A1.rowView(2);
      var v2 = A2.rowView(2);
      var v3 = A3.rowView(3);
      var v4 = A4.rowView(2);
      it('returns a vector', function() {
         expect(A1).to.respondTo('rowView');
         expect(v1).to.be.instanceof(Matrix.Vector);
         expect(v1.length).to.equal(A1.ncol);
         expect(v4.length).to.equal(A4.ncol);
      });
      it('should error if out of bounds', function() {
         expect(function() { A1.rowView(0); }).to.throw(Error);
         expect(function() { A1.rowView(A1.nrow + 1); }).to.throw(Error);
      });
      it('with values from the correct row', function() {
         expect(v1.toArray()).to.deep.equal([6, 1, 9, 33]);
         expect(v2.toArray()).to.deep.equal([0, 0, 8, 2, 0, 0]);
         expect(v3.toArray()).to.deep.equal([2, 1, 0, -1, -2, -3]);
         expect(v4.toArray()).to.deep.equal([A1.get(3, 4), A1.get(3, 2)]);
      });
      it('setting values in Vector changes values in Matrix', function() {
         v1.mutable(true).set(3, 23);
         expect(A1.get(2, 3)).to.equal(23);
         v4.set(2, 24);
         expect(A4.get(2, 2)).to.equal(24);
         expect(A1.get(3, 2)).to.equal(24);
      });
      it('setting values in Matrix changes values in Vector', function() {
         A2.mutable(true).set(2, 3, 25);
         expect(v2.get(3)).to.equal(25);
         expect(v2.get(2)).to.equal(0);
         A2.set(1, 3, 26);
         expect(v2.get(3)).to.equal(25);
      });
   });
   describe('colView', function() {
      var A1 = new Matrix([4, 6, 7, 2, 1, 3, 8, 9, 12, 5, 33, 25], { nrow : 3 });
      var A2 = new Matrix({ 2: { 3: 8, 4: 2}, 4: { 1: 5 }}, { nrow : 4, ncol: 6 });
      var f  = function(i, j) { return i - j; }
      var A3 = new Matrix(f, { nrow : 4, ncol: 6 });
      var A4 = A1.view([1, 3],[4, 2]);
      var v1 = A1.colView(2);
      var v2 = A2.colView(4);
      var v3 = A3.colView(3);
      var v4 = A4.colView(2);
      it('returns a vector', function() {
         expect(A1).to.respondTo('colView');
         expect(v1).to.be.instanceof(Matrix.Vector);
         expect(v1.length).to.equal(A1.nrow);
         expect(v4.length).to.equal(A4.nrow);
      });
      it('should error if out of bounds', function() {
         expect(function() { A1.colView(0); }).to.throw(Error);
         expect(function() { A1.colView(A1.ncol + 1); }).to.throw(Error);
      });
      it('with values from the correct column', function() {
         expect(v1.toArray()).to.deep.equal([2, 1, 3]);
         expect(v2.toArray()).to.deep.equal([0, 2, 0, 0]);
         expect(v3.toArray()).to.deep.equal([-2, -1, 0, 1]);
         expect(v4.toArray()).to.deep.equal([A1.get(1, 2), A1.get(3, 2)]);
      });
      it('setting values in Vector changes values in Matrix', function() {
         v1.mutable(true).set(3, 23);
         expect(A1.get(3, 2)).to.equal(23);
         v4.set(2, 24);
         expect(A4.get(2, 2)).to.equal(24);
         expect(A1.get(3, 2)).to.equal(24);
      });
      it('setting values in Matrix changes values in Vector', function() {
         A2.mutable(true).set(3, 4, 25);
         expect(v2.get(3)).to.equal(25);
         expect(v2.get(2)).to.equal(2);
         A2.set(3, 3, 26);
         expect(v2.get(3)).to.equal(25);
      });
   });
});
