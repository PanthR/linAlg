var Matrix = require('../../linAlg/matrix');
var Vector = Matrix.Vector;
var expect = require('chai').expect;
var Vector2 = require('../../linAlg/vector');

describe('outer product of two vectors', function() {
   var v1 = new Vector([1, 3, 3, 5]);
   var v2 = new Vector(function(i) { return i * i; }, 3);
   function f(a, b) { return a - b; }
   var A1 = v1.outer(v2, f);
   var A2 = v2.outer(v1, f);
   var A3 = v1.outer(v2);
   var A4 = v1.outer(v2, '-');
   it('is a matrix', function() {
      expect(A1).to.be.instanceof(Matrix);
      expect(A2).to.be.instanceof(Matrix);
   });
   it('with the correct dimensions', function() {
      expect(A1.nrow).to.equal(v1.length);
      expect(A1.ncol).to.equal(v2.length);
      expect(A2.nrow).to.equal(v2.length);
      expect(A2.ncol).to.equal(v1.length);
   });
   it('and correct values', function() {
      expect(A1.get(1, 1)).to.equal(0);
      expect(A1.get(1, 2)).to.equal(-3);
      expect(A1.get(3, 2)).to.equal(-1);
      expect(A2.get(1, 1)).to.equal(0);
      expect(A2.get(2, 1)).to.equal(3);
      expect(A2.get(2, 3)).to.equal(1);
   });
   it('function defaults to multiplication', function() {
      expect(A3.get(2, 2)).to.equal(12);
      expect(A3.get(2, 3)).to.equal(27);
      expect(A3.get(4, 1)).to.equal(5);
   });
   it('functions can be quoted operators', function() {
      for (var i = 1; i <= 4; i+= 1) {
         for (var j = 1; j <= 3; j += 1) {
            expect(A4.get(i, j)).to.equal(A1.get(i, j));
         }
      }
   });
   it('exists in Vector as long as Matrix is loaded', function() {
      expect(Vector2.prototype.outer).to.exist;
   });
});