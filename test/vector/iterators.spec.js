var Vector = require('../../linAlg/vector');
var expect = require('chai').expect;

describe('Iterations over vectors via', function() {
   var v1 = new Vector([4, 2, 1]);
   var v2 = new Vector({ 6: 2, 2: 4, 5: 1 }, 10);
   var v3 = new Vector(function(x) { return x*x; }, 4);
   var v4 = new Vector({ 2: 4 }, 3);
   var v5 = new Vector(function(x) { return x*x; }, 3);
   describe('forEach', function() {
      it('provides the correct values', function() {
         var a;
         var f = function(v, i) { a.push(v); }
         a = []; v1.forEach(f);        expect(a).to.deep.equal([4, 2, 1]);
         a = []; v2.forEach(f, false); expect(a).to.deep.equal([0, 4, 0, 0, 1, 2, 0, 0, 0, 0]);
         a = []; v2.forEach(f, true);  expect(a).to.deep.equal([4, 1, 2]);
         a = []; v3.forEach(f);        expect(a).to.deep.equal([1, 4, 9, 16]);
      });
      it('provides the correct indices', function() {
         var a;
         var f = function(v, i) { a.push(i); }
         a = []; v1.forEach(f);       expect(a).to.deep.equal([1, 2, 3]);
         a = []; v2.forEach(f);       expect(a).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
         a = []; v2.forEach(f, true); expect(a).to.deep.equal([2, 5, 6]);
         a = []; v3.forEach(f);       expect(a).to.deep.equal([1, 2, 3, 4]);
      });
   })
   describe('forEachPair', function() {
      it('requires a pair of vectors of same length', function() {
         expect(function() { v1.forEachPair(v2, function() {}); }).to.throw(Error);
         expect(function() { v2.forEachPair(v3, function() {}); }).to.throw(Error);
         expect(function() { v3.forEachPair(v4, function() {}); }).to.throw(Error);
      });
      it('provides the correct first values', function() {
         var a;
         var f = function(v1, v2, i) { a.push(v1); };
         a = []; v1.forEachPair(v4, f);       expect(a).to.deep.equal([4, 2, 1]);
         a = []; v1.forEachPair(v4, f, true); expect(a).to.deep.equal([2]);
         a = []; v4.forEachPair(v5, f);       expect(a).to.deep.equal([0, 4, 0]);
         a = []; v4.forEachPair(v5, f, true); expect(a).to.deep.equal([4]);
         a = []; v5.forEachPair(v4, f);       expect(a).to.deep.equal([1, 4, 9]);
         a = []; v5.forEachPair(v4, f, true); expect(a).to.deep.equal([4]);
      });
      it('provides the correct second values', function() {
         var a;
         var f = function(v1, v2, i) { a.push(v2); };
         a = []; v1.forEachPair(v4, f);       expect(a).to.deep.equal([0, 4, 0]);
         a = []; v1.forEachPair(v4, f, true); expect(a).to.deep.equal([4]);
         a = []; v4.forEachPair(v5, f);       expect(a).to.deep.equal([1, 4, 9]);
         a = []; v4.forEachPair(v5, f, true); expect(a).to.deep.equal([4]);
         a = []; v5.forEachPair(v4, f);       expect(a).to.deep.equal([0, 4, 0]);
         a = []; v5.forEachPair(v4, f, true); expect(a).to.deep.equal([4]);
      });
      it('provides the correct indices', function() {
         var a;
         var f = function(v1, v2, i) { a.push(i); };
         a = []; v1.forEachPair(v4, f);       expect(a).to.deep.equal([1, 2, 3]);
         a = []; v1.forEachPair(v4, f, true); expect(a).to.deep.equal([2]);
         a = []; v4.forEachPair(v5, f);       expect(a).to.deep.equal([1, 2, 3]);
         a = []; v4.forEachPair(v5, f, true); expect(a).to.deep.equal([2]);
         a = []; v5.forEachPair(v4, f);       expect(a).to.deep.equal([1, 2, 3]);
         a = []; v5.forEachPair(v4, f, true); expect(a).to.deep.equal([2]);
      });
   });
   describe('reduce', function() {
      it('provides the correct values', function() {
         var a;
         var f = function(_, v) { a.push(v); };
         a = []; v1.reduce(f, 0);        expect(a).to.deep.equal([4, 2, 1]);
         a = []; v2.reduce(f, 0, false); expect(a).to.deep.equal([0, 4, 0, 0, 1, 2, 0, 0, 0, 0]);
         a = []; v2.reduce(f, 0, true);  expect(a).to.deep.equal([4, 1, 2]);
         a = []; v3.reduce(f, 0);        expect(a).to.deep.equal([1, 4, 9, 16]);
      });
      it('provides the correct indices', function() {
         var a;
         var f = function(_, v, i) { a.push(i); }
         a = []; v1.reduce(f, 0);       expect(a).to.deep.equal([1, 2, 3]);
         a = []; v2.reduce(f, 0);       expect(a).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
         a = []; v2.reduce(f, 0, true); expect(a).to.deep.equal([2, 5, 6]);
         a = []; v3.reduce(f, 0);       expect(a).to.deep.equal([1, 2, 3, 4]);
      });
      it('returns the correct value', function() {
         var f = function(a, v, i) { return a + v; }
         expect(v1.reduce(f, 0)).to.equal(7);
         expect(v2.reduce(f, 0)).to.equal(7);
         expect(v2.reduce(f, 0, true)).to.equal(7);
         expect(v3.reduce(f, 0)).to.equal(30);
      });
      
   });
   describe('map', function() {
      it('provides the correct values', function() {
         var a;
         var f = function(v, i) { a.push(v); };
         a = []; v1.map(f);        expect(a).to.deep.equal([4, 2, 1]);
         a = []; v2.map(f, false); expect(a).to.deep.equal([0, 4, 0, 0, 1, 2, 0, 0, 0, 0]);
         a = []; v2.map(f, true);  expect(a).to.deep.equal([4, 1, 2]);
         a = []; v3.map(f);        expect(a).to.deep.equal([1, 4, 9, 16]);
      });
      it('provides the correct indices', function() {
         var a;
         var f = function(v, i) { a.push(i); }
         a = []; v1.map(f);       expect(a).to.deep.equal([1, 2, 3]);
         a = []; v2.map(f);       expect(a).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
         a = []; v2.map(f, true); expect(a).to.deep.equal([2, 5, 6]);
         a = []; v3.map(f);       expect(a).to.deep.equal([1, 2, 3, 4]);
      });
      it('returns a vector of the same length', function() {
         var f = function(v, i) { return v + i; }
         expect(v1.map(f)).to.be.instanceof(Vector);
         expect(v1.map(f).length).to.equal(v1.length);
         expect(v2.map(f)).to.be.instanceof(Vector);
         expect(v2.map(f).length).to.equal(v2.length);
         expect(v2.map(f, true).length).to.equal(v2.length);
         expect(v3.map(f)).to.be.instanceof(Vector);
         expect(v3.map(f).length).to.equal(v3.length);
      });
      it('the resulting vector has the correct values', function() {
         var f = function(v, i) { return v + i; }
         expect(v1.map(f).get(1)).to.equal(5);
         expect(v1.map(f).get(2)).to.equal(4);
         expect(v1.map(f).get(3)).to.equal(4);
         expect(v2.map(f).get(2)).to.equal(6);
         expect(v2.map(f, true).get(2)).to.equal(6);
         expect(v2.map(f).get(1)).to.equal(1);
         expect(v2.map(f, true).get(1)).to.equal(0);
         expect(v3.map(f).get(2)).to.equal(6);
      });
   });
});