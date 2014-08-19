var Vector = require('../../linAlg/vector');
var expect = require('chai').expect;
var delta = 1e-5;

describe('Numerical computations', function() {
   var v1 = new Vector([4, -2, 1]);
   var v2 = new Vector({ 6: -2, 2: 4, 5: 1 }, 10);
   var v3 = new Vector(function(x) { return -x*x; }, 4);

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
});