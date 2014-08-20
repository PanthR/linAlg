var Vector = require('../../linAlg/vector');
var expect = require('chai').expect;
var delta = 1e-5;

describe('Numerical computations', function() {
   var v1 = new Vector([4, -2, 1]);
   var v2 = new Vector({ 6: -2, 2: 4, 5: 1 }, 10);
   var v3 = new Vector(function(x) { return -x*x; }, 4);
   var v4 = new Vector([1, 2, 3]);
   var v5 = new Vector({ 2: 1 }, 3);
   var v6 = new Vector(function(x) { return x; }, 3);

   it('norm', function() {
      expect(v1.norm(Infinity)).to.equal(4);
      expect(v2.norm(Infinity)).to.equal(4);
      expect(v3.norm(Infinity)).to.equal(16);
      expect(v1.norm(1)).to.equal(7);
      expect(v2.norm(1)).to.equal(7);
      expect(v3.norm(1)).to.equal(30);
      expect(v1.norm(2)).to.be.closeTo(Math.sqrt(21), delta);
      expect(v2.norm()).to.be.closeTo(Math.sqrt(21), delta);
      expect(v3.norm()).to.be.closeTo(Math.sqrt(1+4*4+9*9+16*16), delta);
      expect(v1.norm(3)).to.be.closeTo(4.17933919, delta);
      expect(v1.norm(1/3)).to.be.closeTo(56.947628, delta);
   });
   it('dot', function() {
      expect(v1.dot(v1)).to.equal(21);
      expect(v2.dot(v2)).to.equal(21);
      expect(v3.dot(v3)).to.equal(1+4*4+9*9+16*16);
      expect(v1.dot(v4)).to.equal(3);
      expect(v1.dot(v5)).to.equal(-2);
      expect(v1.dot(v6)).to.equal(3);
      expect(v5.dot(v1)).to.equal(-2);
      expect(v6.dot(v1)).to.equal(3);
   });
   it('pAdd', function() {
      expect(Vector.pAdd).to.exist;
      expect(v1.pAdd(v1).toArray()).to.deep.equal([8, -4, 2]);
      expect(v1.pAdd(v4).toArray()).to.deep.equal([5, 0, 4]);
      expect(v4.pAdd(v1).toArray()).to.deep.equal([5, 0, 4]);
      expect(v1.pAdd(v5).toArray()).to.deep.equal([4 + 0, -2 + 1, 1 + 0]);
      expect(v5.pAdd(v1).toArray()).to.deep.equal([4 + 0, -2 + 1, 1 + 0]);
   });
   it('pSub', function() {
      expect(Vector.pSub).to.exist;
      expect(v1.pSub(v1).toArray()).to.deep.equal([0, 0, 0]);
      expect(v1.pSub(v4).toArray()).to.deep.equal([4 - 1, -2 - 2, 1 - 3]);
      expect(v4.pSub(v1).toArray()).to.deep.equal([1 - 4, 2 + 2, 3 - 1]);
      expect(v1.pSub(v5).toArray()).to.deep.equal([4 - 0, -2 - 1, 1 - 0]);
      expect(v5.pSub(v1).toArray()).to.deep.equal([0 - 4, 1 + 2, 0 - 1]);
   });
   it('pMult', function() {
      expect(Vector.pMult).to.exist;
      expect(v1.pMult(v1).toArray()).to.deep.equal([4 * 4, -2 * -2, 1 * 1]);
      expect(v1.pMult(v4).toArray()).to.deep.equal([4 * 1, -2 * 2, 1 * 3]);
      expect(v4.pMult(v1).toArray()).to.deep.equal([1 * 4, 2 * -2, 3 * 1]);
      expect(v1.pMult(v5).toArray()).to.deep.equal([4 * 0, -2 * 1, 1 * 0]);
      expect(v5.pMult(v1).toArray()).to.deep.equal([0 * 4, 1 * -2, 0 * 1]);
   });
   it('pDiv', function() {
      expect(Vector.pDiv).to.exist;
      expect(v1.pDiv(v1).toArray()).to.deep.equal([4 / 4, -2 / -2, 1 / 1]);
      expect(v1.pDiv(v4).toArray()).to.deep.equal([4 / 1, -2 / 2, 1 / 3]);
      expect(v4.pDiv(v1).toArray()).to.deep.equal([1 / 4, 2 / -2, 3 / 1]);
      expect(v1.pDiv(v5).toArray()).to.deep.equal([4 / 0, -2 / 1, 1 / 0]);
      expect(v5.pDiv(v1).toArray()).to.deep.equal([0 / 4, 1 / -2, 0 / 1]);
   });
   it('sMult', function() {
      expect(Vector.sMult).to.exist;
      expect(v1.sMult(3).toArray()).to.deep.equal([4 * 3, -2 * 3, 1 * 3]);
      expect(v4.sMult(3).toArray()).to.deep.equal([1 * 3,  2 * 3, 3 * 3]);
      expect(v5.sMult(3).toArray()).to.deep.equal([0 * 3,  1 * 3, 0 * 3]);
   });
});