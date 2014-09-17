var Vector = require('../../linAlg/vector');
var expect = require('chai').expect;

describe('seq', function() {
   it('with 3 arguments', function() {
      expect(Vector.seq(1,3,1).toArray()).to.deep.equal([1,2,3]);
      expect(Vector.seq(3,1,-1).toArray()).to.deep.equal([3,2,1]);
      expect(Vector.seq(3,1,-1).toArray()).to.deep.equal([3,2,1]);
      expect(Vector.seq(1.2,3,1).toArray()).to.deep.equal([1.2,2.2]);
      expect(Vector.seq(1,3,2).toArray()).to.deep.equal([1,3]);
      expect(Vector.seq(1,3,2.1).toArray()).to.deep.equal([1]);
   });
   it('with 2 arguments', function() {
      expect(Vector.seq(1,3).toArray()).to.deep.equal([1,2,3]);
      expect(Vector.seq(3,1).toArray()).to.deep.equal([3,2,1]);
      expect(Vector.seq(1,3.1).toArray()).to.deep.equal([1,2,3]);
      expect(Vector.seq(3.1,1).toArray()).to.deep.equal([3.1,2.1,1.1]);
      expect(Vector.seq(1,2.9).toArray()).to.deep.equal([1,2]);
      expect(Vector.seq(2.9,1).toArray()).to.deep.equal([2.9,1.9]);
   });
   it('with 1 argument', function() {
      expect(Vector.seq(3).toArray()).to.deep.equal([1,2,3]);
      expect(Vector.seq(1).toArray()).to.deep.equal([1]);
   });
   it('with invalid arguments should return empty', function() {
      expect(Vector.seq(0).toArray().length).to.equal(0);
      expect(Vector.seq(-2).toArray().length).to.equal(0);
      expect(Vector.seq(1, 3, -2).toArray().length).to.equal(0);
      expect(Vector.seq("a23").toArray().length).to.equal(0);
      expect(Vector.seq().toArray().length).to.equal(0);
   });
});

describe('Vector being passed a Vector', function() {
   it('returns the given Vector', function() {
      var v1 = new Vector([4, 5, 2, 3]);
      var v2 = new Vector({2:5, 3:2},4); // [0, 5, 2, 0]
      var v3 = new Vector(function(i) { return i; }, 4);
      var v4 = v1.view([4, 1, 2]); // [3, 4, 5]
      expect(new Vector(v1)).to.equal(v1);
      expect(new Vector(v2)).to.equal(v2);
      expect(new Vector(v3)).to.equal(v3);
      expect(new Vector(v4)).to.equal(v4);
      expect(new Vector(v4)).to.not.equal(v1);

   });
});
describe('clone', function() {
   var v1 = new Vector([4, 5, 2, 3]);
   var v2 = new Vector({2:5, 3:2},4); // [0, 5, 2, 0]
   var v3 = new Vector(function(i) { return i; }, 4);
   var v4 = v1.view([4, 1, 2]); // [3, 4, 5]
   var v5 = new Vector.const(3, 5);
   it('returns new objects', function() {
      expect(v1.clone()).to.not.equal(v1);
      expect(v2.clone()).to.not.equal(v2);
      expect(v3.clone()).to.not.equal(v3);
      expect(v4.clone()).to.not.equal(v4);
      expect(v5.clone()).to.not.equal(v5);
      expect(v1.clone()).to.not.equal(v1.clone());
   });
   it('results in a vector with the same values', function() {
      expect(v1.clone().toArray()).to.deep.equal(v1.toArray());
      expect(v2.clone().toArray()).to.deep.equal(v2.toArray());
      expect(v3.clone().toArray()).to.deep.equal(v3.toArray());
      expect(v4.clone().toArray()).to.deep.equal(v4.toArray());
      expect(v5.clone().toArray()).to.deep.equal(v5.toArray());
   });
   it('results in the vectors being independent', function() {
      var vClone = v1.clone();
      v1.mutable(true).set(3,7);
      expect(vClone.get(3)).to.not.equal(7);
      expect(vClone.mutable()).to.be.false;
      vClone.mutable(true).set(3, -1);
      expect(v1.get(3)).to.not.equal(-1);
      var v6 = new Vector(function(i) { return i; }, 5);
      vClone = v6.clone();
      v6.mutable(true).set(3, 5);
      expect(vClone.get(3)).to.equal(3);
   });
   it('makes a const vector into DenseV', function() {
      expect(v5.clone()).to.be.instanceof(Vector.DenseV);
   });
   it('keeps a sparse vector sparse', function() {
      expect(v2.clone().isSparse()).to.be.true;
   });

});
describe('concat', function() {
   var v1 = new Vector([4, 5, 2, 3]);
   var v2 = new Vector({2:5, 3:2},4); // [0, 5, 2, 0]
   var v3 = new Vector(function(i) { return i; }, 4);
   var v4 = v1.view([4, 1, 2]); // [3, 4, 5]
   it('exists', function() {
      expect(Vector).to.respondTo('concat');
      expect(Vector).itself.to.respondTo('concat');
      expect(function() { Vector.concat(v1, 23.2, v3, v4); }).to.not.throw(Error);
      expect(Vector.concat(v1, 23.2, v3, v4)).to.be.instanceof(Vector);
      expect(function() { v1.concat(23.2, v3, v4); }).to.not.throw(Error);
      expect(v1.concat(23.2, v3, v4)).to.be.instanceof(Vector);
   });
   it('has correct length and values', function() {
      var res1, res2, c;
      res1 = Vector.concat(v1, 23.2, v3, v4);
      res2 = Vector.concat(v1, 23.2, v3, v4);
      expect(res1.get()).to.deep.equal(res2.get());
      c = 1;
      v1.forEach(function(v) { expect(res1.get(c++)).to.equal(v); });
      expect(res1.get(c++)).to.equal(23.2);
      v3.forEach(function(v) { expect(res1.get(c++)).to.equal(v); });
      v4.forEach(function(v) { expect(res1.get(c++)).to.equal(v); });
      expect(c - 1).to.equal(res1.length);
   });
});