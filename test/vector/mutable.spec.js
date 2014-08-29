var Vector = require('../../linAlg/vector');
var expect = require('chai').expect;

describe('Vectors', function() {
   var v1 = new Vector([1, 3, 5, 6]);
   var v2 = new Vector(function(i) { return i * i; }, 4);
   var v3 = new Vector({ 2: 4 }, 4);
   var v4 = v1.view([3, 4]);
   var v5 = Vector.ones(4);
   it('are immutable on creation', function() {
      expect(v1.mutable()).to.be.false;
      expect(v2.mutable()).to.be.false;
      expect(v3.mutable()).to.be.false;
      expect(v4.mutable()).to.be.false;
      expect(v5.mutable()).to.be.false;
   });
   it('cannot have their values set while they are immutable', function() {
      expect(function() { v1.set(1, 234); }).to.throw(Error);
      expect(function() { v2.set(1, 234); }).to.throw(Error);
      expect(function() { v3.set(1, 234); }).to.throw(Error);
      expect(function() { v4.set(1, 234); }).to.throw(Error);
      expect(function() { v5.set(1, 234); }).to.throw(Error);
   });
   it('can be made mutable, unless constant', function() {
      expect(function() { v1.mutable(true); }).to.not.throw(Error);
      expect(function() { v2.mutable(true); }).to.not.throw(Error);
      expect(function() { v3.mutable(true); }).to.not.throw(Error);
      expect(function() { v4.mutable(true); }).to.not.throw(Error);
      expect(function() { v5.mutable(true); }).to.throw(Error);
   });
   it('can have their values set while they are mutable', function() {
      expect(v1.set(1, 234).get(1)).to.equal(234);
      expect(v1.set(1, 235).get(1)).to.equal(235);
      expect(v2.set(2, 234).get(2)).to.equal(234);
      expect(v3.set(1, 234).get(1)).to.equal(234);
   });
   it('set() affects the viewed vector if they are ViewVs', function() {
      expect(v4.set(1, 233).get(1)).to.equal(233);
      expect(v1.get(3)).to.equal(233);
      expect(v4.view([2]).set(1, 20).get(1)).to.equal(20);
      expect(v1.get(4)).to.equal(20);
      expect(v4.get(2)).to.equal(20);
   });
   it('cannot set values out of range', function() {
      expect(function() { v1.set(5, 2); }).to.throw(Error);
      expect(function() { v1.set(0, 2); }).to.throw(Error);
      expect(function() { v2.set(5, 2); }).to.throw(Error);
      expect(function() { v2.set(0, 2); }).to.throw(Error);
      expect(function() { v3.set(5, 2); }).to.throw(Error);
      expect(function() { v3.set(0, 2); }).to.throw(Error);
      expect(function() { v4.set(3, 2); }).to.throw(Error);
      expect(function() {
         v1.view([5, 2]).mutable(true).set(1, 4);
      }).to.throw(Error);
   });
   it('can be set back to being immutable', function() {
      expect(function() { v1.mutable(false); }).to.not.throw(Error);
      expect(function() { v1.set(1, 233); }).to.throw(Error);
      expect(v1.get(1)).to.equal(235);
   });
});