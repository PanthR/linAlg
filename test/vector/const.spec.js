var Vector = require('../../linAlg/vector');
var ConstV = Vector.ConstV;
var expect = require('chai').expect;

describe('Constant vectors', function() {
   it('can be constructed with Vector.const', function() {
      var v1 = Vector.const(5,3);
      expect(v1.length).to.equal(3);
      expect(v1.get(2)).to.equal(5);
      expect(v1.get(-2)).to.equal(null);
      expect(v1.get(4)).to.equal(null);
      expect(v1).to.be.instanceof(ConstV);
   });
      it('can be constructed with Vector.ones', function() {
      var v1 = Vector.ones(3);
      expect(v1.length).to.equal(3);
      expect(v1.get(2)).to.equal(1);
      expect(v1.get(-2)).to.equal(null);
      expect(v1.get(4)).to.equal(null);
   });
   
});
