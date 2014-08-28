var Vector = require('../../linAlg/vector');
var ViewV = Vector.ViewV;
var chai = require('chai');
var expect = chai.expect;
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.use(sinonChai);

describe('Vector#get', function() {
   var v1 = Vector([2, 1, 5, 3]);
   var v2 = Vector(function(i) { return i * i; }, 5); // squares
   var v3 = new ViewV(v1, [2, 3]); // [1, 5]
   it('with integer argument i returns the ith value', function() {
      expect(v1.get(2)).to.equal(1);
      expect(v2.get(2)).to.equal(2*2);
      expect(v3.get(2)).to.equal(5);
   });
   it('with array argument returns correct array of values', function() {
      expect(v1.get([])).to.deep.equal([]);
      expect(v1.get([3,1,2])).to.deep.equal([5, 2, 1]);
      expect(v2.get([3,1,2])).to.deep.equal([9, 1, 4]);
      expect(v3.get([3,1,2])).to.deep.equal([0, 1, 5]);
   });
   it('with no argument returns the entire values array', function() {
      expect(v1.get()).to.deep.equal(v1.toArray());
      expect(v2.get()).to.deep.equal(v2.toArray());
      expect(v3.get()).to.deep.equal(v3.toArray());
   });


});
