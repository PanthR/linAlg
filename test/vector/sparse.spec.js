var Vector = require('../../linAlg/vector');
var SparseV = Vector.SparseV;
var expect = require('chai').expect;

describe('Sparse vectors', function() {
   var dict = { 2: 10, 105: 12, 15: 6 };
   it('have a constructor Vector.SparseV and are Vector\'s', function() {
      expect(SparseV).to.exist;
      var v1 = new SparseV(dict, 1000);
      expect(v1).to.be.instanceof(SparseV);
      expect(v1).to.be.instanceof(Vector);
   });
   it('are formed when the Vector constructor is fed an object', function() {
      expect(new Vector(dict, 1000).isSparse()).to.be.ok;
   });
   it('are 1-indexed', function() {
      var v1 = new Vector(dict, 1000);
      expect(v1).to.respondTo('get');
      expect(v1.get(0)).to.equal(0);
      expect(v1.get(1)).to.equal(0);
      expect(v1.get(2)).to.equal(10);
      expect(v1.get(105)).to.equal(12);
      expect(v1.get(15)).to.equal(6);
      expect(v1.get(104)).to.equal(0);
   });
   it('have settable values within their range', function() {
      var v1 = new Vector(dict, 1000);
      expect(v1).to.respondTo('set');
      v1.set(1, 5).set(2,12).set(1001, 10);
      expect(v1.get(1)).to.equal(5);
      expect(v1.get(2)).to.equal(12);
      expect(v1.get(1001)).to.equal(0);
   });
})