var Matrix = require('../../linAlg/matrix');
var expect = require('chai').expect;

function random(i) { return Math.floor(Math.random() * i + 1); }

describe('Matrices', function() {
   var A1 = new Matrix([4, 6, 7, 2, 1, 3], { nrow : 2 });
   var A1backup = new Matrix([4, 6, 7, 2, 1, 3], { nrow : 2 });
   var A2 = new Matrix({ 2: { 3: 8, 4: 2}, 4: { 1: 5 }}, { nrow : 4, ncol: 6 });
   var A3 = new Matrix(function(i, j) { return i * j; }, { nrow: 4, ncol: 6 });
   var A4 = A3.view([3, 4], [1, 3]);
   it('are immutable on creation', function() {
      expect(A1.mutable()).to.be.false;
      expect(A2.mutable()).to.be.false;
      expect(A3.mutable()).to.be.false;
      expect(A4.mutable()).to.be.false;
   });
   it('cannot have their values set while they are immutable', function() {
      expect(A1).to.respondTo('set');
      expect(function() { A1.set(1, 2, 234); }).to.throw(Error);
      expect(function() { A2.set(1, 2, 234); }).to.throw(Error);
      expect(function() { A3.set(1, 2, 234); }).to.throw(Error);
      expect(function() { A4.set(1, 2, 234); }).to.throw(Error);
   });
   it('can be made mutable, unless constant (NEED TO TEST CONSTANT)', function() {
      expect(A1).to.respondTo('mutable');
      expect(function() { A1.mutable(true); }).to.not.throw(Error);
      expect(function() { A2.mutable(true); }).to.not.throw(Error);
      expect(function() { A4.mutable(true); }).to.not.throw(Error);
      expect(A3.mutable()).to.be.true;
      expect(function() { A3.mutable(true); }).to.not.throw(Error);
   });
   it('can have their values set while they are mutable', function() {
      expect(A1.set(1, 2, 234).get(1, 2)).to.equal(234);
      expect(A1.set(1, 2, 235).get(1, 2)).to.equal(235);
      expect(A2.set(2, 3, 236).get(2, 3)).to.equal(236);
      expect(A2.set(1, 1, 237).get(1, 1)).to.equal(237);
      expect(A3.set(1, 2, 234).get(1, 2)).to.equal(234);
      expect(A1.set(232).get(random(2), random(3))).to.equal(232);
      expect(A1.set(function(i, j) { return i - j; }).get(2, 1)).to.equal(1);
      expect(A1.get(1, 3)).to.equal(-2);
      expect(A1.set(A1backup).get(3, 1)).to.equal(A1backup.get(3, 1));
      expect(function() { A1.set(A2); }).to.throw(Error);
   });
   it('set() affects the viewed vector if they are ViewMs', function() {
      expect(A4.set(1, 2, 233).get(1, 2)).to.equal(233);
      expect(A3.get(3, 3)).to.equal(233);
   });
   it('cannot set values out of range', function() {
      expect(function() { A1.set(5, 1, 2); }).to.throw(Error);
      expect(function() { A1.set(0, 1, 2); }).to.throw(Error);
      expect(function() { A2.set(5, 1, 2); }).to.throw(Error);
      expect(function() { A2.set(0, 1, 2); }).to.throw(Error);
      expect(function() { A3.set(2, 7, 2); }).to.throw(Error);
      expect(function() { A3.set(2, 0, 2); }).to.throw(Error);
      expect(function() { A4.set(3, 1, 2); }).to.throw(Error);
      expect(function() {
         A1.view([5, 2], [1, 2]).mutable(true).set(1, 4, 40);
      }).to.throw(Error);
   });
   it('can be set back to being immutable', function() {
      var value = A1.get(1, 2);
      expect(function() { A1.mutable(false); }).to.not.throw(Error);
      expect(function() { A1.set(1, 2, 233); }).to.throw(Error);
      expect(A1.get(1, 2)).to.equal(value);
   });
});