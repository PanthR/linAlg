var Vector = require('../../linAlg/vector');
var expect = require('chai').expect;

describe('order', function() {
   var v = new Vector([2, 2.1, 4.3, 1.5, -2, 1, 3]);
   it('works with numerical inputs', function() {
      expect(v).to.respondTo('order');
      expect(v.order().toArray()).to.deep.equal([5, 6, 4, 1, 2, 7, 3]);
   });
   it('can make descending order', function() {
      expect(v.order(true).toArray()).to.deep.equal([3, 7, 2, 1, 4, 6, 5]);
   });
   it('can use a provided comparator', function() {
      f = function(a, b) { 
         return a.length < b.length ? -1 : a.length === b.length ? 0 : 1; 
      }
      var w = new Vector(["zach","c","antelope","zoo","foods"]);
      expect(w.order(f).toArray()).to.deep.equal([2,4,1,5,3]);
   });
   it('sends NaN values to the end', function() {
      var u = new Vector([2, NaN, 4.3, 1.5, 100, 1, -3]);
      expect(u.order().toArray()).to.deep.equal([7, 6, 4, 1, 3, 5, 2]);
      expect(u.order(true).toArray()).to.deep.equal([2, 5, 3, 1, 4, 6, 7]);
   });
});