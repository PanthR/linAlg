var Vector = require('../../linAlg/vector');
var expect = require('chai').expect;
var delta = 1e-5;

describe('Other methods', function() {
   var v1 = new Vector([4, -2, 1]);
   var v2 = new Vector({ 6: -2, 2: 4, 5: 1 }, 10);
   var v3 = new Vector(function(x) { return x*x; }, 4);
   it('diff', function() {
      expect(v1.diff().toArray()).to.deep.equal([-6, 3]);
      expect(v2.diff().toArray())
         .to.deep.equal([4, -4, 0, 1, -3, 2, 0, 0, 0]);
      expect(v3.diff().toArray()).to.deep.equal([3, 5, 7]);
      expect(new Vector([1]).diff().length).to.equal(0);
      expect(new Vector([]).diff().length).to.equal(-1); // WOAH!
   });
   it('cumulative', function() {
      expect(v1.cumulative(function(a, b) { return a + b * b; }, 1).toArray())
         .to.deep.equal([17, 21, 22]);
      expect(v1.cumSum().toArray()).to.deep.equal([4, 2, 3]);
      expect(v1.cumMax().toArray()).to.deep.equal([4, 4, 4]);
      expect(v1.cumMin().toArray()).to.deep.equal([4, -2, -2]);
      expect(v2.cumSum().toArray()).to.deep.equal([0, 4, 4, 4, 5, 3, 3, 3, 3, 3]);
      expect(v2.cumMax().toArray()).to.deep.equal([0, 4, 4, 4, 4, 4, 4, 4, 4, 4]);
      expect(v2.cumMin().toArray()).to.deep.equal([0, 0, 0, 0, 0, -2, -2, -2, -2, -2]);
   });
   it('equals', function() {
      expect(v1.equals(v1)).to.be.ok;
      expect(v2.equals(v2)).to.be.ok;
      expect(v1.equals(v2)).to.not.be.ok;
      expect(v1.equals(v3)).to.not.be.ok;
      expect(v3.equals(v2)).to.not.be.ok;
      var v4 = new Vector([4.0002, -2, 1]);
      expect(v4.equals(v1)).to.not.be.ok;
      expect(v4.equals(v1, 1e-3)).to.be.ok;
      var v5 = new Vector([4, 2.5, 3, NaN]);
      expect(v5.equals(v5)).to.not.be.ok; 
   });
   it('permute', function() {
      var v1 = new Vector(Math.random, 6);
      var v2 = v1.permute([1, 4, 3]);
      expect(v2.get(4)).to.equal(v1.get(1));
      expect(v2.get(2)).to.equal(v1.get(2));
      expect(v2.get(3)).to.equal(v1.get(4));
      expect(v2.get(1)).to.equal(v1.get(3));
      expect(v2.get(6)).to.equal(v1.get(6));
      expect(v2.get(7)).to.equal(v1.get(7));
   });
   it('any and all', function() {
      var v1 = new Vector([0.23, 1.2, -1.1, 1.1]);
      expect(v1.any(function(x) { return x < 0; })).to.be.true;
      expect(v1.any(function(x) { return x < -2; })).to.be.false;
      expect(v1.all(function(x) { return x < 2; })).to.be.true;
      expect(v1.all(function(x) { return x < 1; })).to.be.false;
   });
   describe('resize', function() {
      var v1 = new Vector([4.1, -2.2, 1]);
      var v2 = new Vector({ 6: -2, 2: 4, 5: 1 }, 10);
      var v3 = new Vector(function(x) { return x*x; }, 4);
      function f(i) { return 2.2 + i; }
      it('recycling values', function() {
         expect(Vector).to.respondTo('resize');
         expect(v1.resize(7, true).toArray()).to.deep.equal([4.1, -2.2, 1, 4.1, -2.2, 1, 4.1]);
         expect(v3.resize(7, true).toArray()).to.deep.equal([1, 4, 9, 16, 1, 4, 9]);
      });
      it('extending with 0', function() {
         expect(v1.resize(7, false).toArray()).to.deep.equal([4.1, -2.2, 1, 0, 0, 0, 0]);
         expect(v3.resize(7).toArray()).to.deep.equal([1, 4, 9, 16, 0, 0, 0]);
      });
      it('using a function', function() {
         expect(v1.resize(6, f).toArray()).to.deep.equal([4.1, -2.2, 1, 6.2, 7.2, 8.2]);
         expect(v3.resize(6, f).toArray()).to.deep.equal([1, 4, 9, 16, 7.2, 8.2]);
      });
      it('can reduce length', function() {
         expect(v1.resize(2).toArray()).to.deep.equal([4.1, -2.2]);
      });
      it('preserves sparse', function() {
         expect(v2.resize(14, true)).to.be.instanceof(Vector.SparseV);
         expect(v2.resize(14, true)
            .equals(new Vector({ 6: -2, 2: 4, 5: 1, 12: 4 }, 14))).to.be.true;
         expect(v2.resize(14)
            .equals(new Vector({ 6: -2, 2: 4, 5: 1 }, 14))).to.be.true;
         expect(v2.resize(14, false)).to.be.instanceof(Vector.SparseV);
         expect(v2.resize(14, false)
            .equals(new Vector({ 6: -2, 2: 4, 5: 1 }, 14))).to.be.true;
         expect(v2.resize(12, function(x) { return x + 1; })).to.be.instanceof(Vector.SparseV);
         expect(v2.resize(12, function(x) { return x + 1; })
            .equals(new Vector({ 6: -2, 2: 4, 5: 1, 11: 12, 12: 13 }, 12))).to.be.true;
         expect(v2.resize(5, function(x) { return x + 1; })
            .equals(new Vector({ 2: 4, 5: 1 }, 5))).to.be.true;
      });
   });
});