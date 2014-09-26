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
      expect(v1.get(0)).to.equal(null);
      expect(v1.get(1)).to.equal(0);
      expect(v1.get(2)).to.equal(10);
      expect(v1.get(105)).to.equal(12);
      expect(v1.get(15)).to.equal(6);
      expect(v1.get(104)).to.equal(0);
   });
   it('allow non-integer values', function() {
      var a1 = { 2: Math.random() * 4, 5: -Math.random() * 3, 7: Math.random() };
      var v1 = new Vector(a1);
      expect(v1.get(2)).to.equal(a1[2]);
      expect(v1.get(5)).to.equal(a1[5]);
      expect(v1.get(7)).to.equal(a1[7]);
      v1.mutable(true).set(1, 2.345);
      expect(v1.get(1)).to.equal(2.345);
   });
   
})