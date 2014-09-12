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
   it('are formed when the Vector constructor is fed a function', function() {
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
});
describe('Vectors which are initially constant', function() {
   it('can be made with the Vector constructor', function() {
      var v4;
      expect( function() { v4 = new Vector(4.32, 5); }).to.not.throw(Error);
      expect(v4.length).to.equal(5);
      expect(v4.toArray()).to.deep.equal([4.32,4.32,4.32,4.32,4.32]) ;
      expect(v4.mutable()).to.be.false;
      expect( function() { v4.mutable(true); }).to.not.throw(Error);
      v4.set(1,5.5);
      expect(v4.get(1)).to.equal(5.5);
   });
});

