var Vector = require('../../linAlg/vector');
var expect = require('chai').expect;

describe('force', function() {
   it('Should set the values array', function() {
      var v = new Vector(function(i) { return i; }, 4);
      v.force();
      expect(v.values).to.deep.equal([1, 2, 3, 4]);
   });
   it('Should only need to call compute once on each index', function() {
      var calls = [];
      var f = function(i) { calls.push(i); return i; }
      var v = new Vector(f, 4);
      expect(calls.length).to.equal(0);
      v.get(3);
      expect(calls.length).to.equal(1);
      expect(calls[0]).to.equal(3);
      v.get(3);
      expect(calls.length).to.equal(1);
      v.force();
      expect(calls.length).to.equal(4);
      expect(calls).to.deep.equal([3, 1, 2, 4]);
   });
});