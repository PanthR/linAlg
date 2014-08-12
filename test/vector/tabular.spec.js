var Vector = require('../../linAlg/vector');
var TabularV = Vector.TabularV;
var expect = require('chai').expect;

describe('Tabular vectors', function() {
   var f = function(x) { return x*x; };
   it('have a constructor Vector.TabularV and are Vector\'s', function() {
      expect(TabularV).to.exist;
      var v1 = new TabularV(f, 10);
      expect(v1).to.be.instanceof(TabularV);
      expect(v1).to.be.instanceof(Vector);
   });
   it('are returned from the Vector constructor when it is fed a function', function() {
      expect(new Vector(f, 10)).to.be.instanceof(TabularV);
   });
   it('are 1-indexed', function() {
      var v1 = new Vector(f, 10);
      expect(v1).to.respondTo('get');
      expect(v1.get(0)).to.equal(0);
      expect(v1.get(1)).to.equal(1);
      expect(v1.get(2)).to.equal(4);
      expect(v1.get(11)).to.equal(0);
      expect(v1.get(6)).to.equal(36);
   });
   it('have settable values within their range', function() {
      var v1 = new Vector(f, 10);
      expect(v1).to.respondTo('set');
      v1.set(1, 5).set(2,12).set(11, 10).set(10, 10);
      expect(v1.get(1)).to.equal(5);
      expect(v1.get(2)).to.equal(12);
      expect(v1.get(3)).to.equal(9);
      expect(v1.get(10)).to.equal(10);
      expect(v1.get(11)).to.equal(0);
   });
})