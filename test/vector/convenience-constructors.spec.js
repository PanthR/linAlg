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