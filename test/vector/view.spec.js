var Vector = require('../../linAlg/vector');
var ViewV = Vector.ViewV;
var chai = require('chai');
var expect = chai.expect;
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.use(sinonChai);

describe('View vectors', function() {
   var target = new Vector([5, 4, 3, 2, 1]);
   var v1 = new ViewV(target, [1, 4, 4]); // [5, 2, 2]
   var v2 = new ViewV(target, function(i) { return 6-i; }, 5); // reverse

   it('have a constructor Vector.ViewV and are Vector\'s', function() {
      expect(ViewV).to.exist;
      expect(v1).to.be.instanceof(ViewV);
      expect(v1).to.be.instanceof(Vector);
      expect(v2).to.be.instanceof(ViewV);
      expect(v2).to.be.instanceof(Vector);
   });
   it('have the correct values', function() {
      expect(v1.toArray()).to.deep.equal([5, 2, 2]);
      expect(v2.toArray()).to.deep.equal([1, 2, 3, 4, 5]);
   });
   it('iterate based on their indices, not the target\'s', function() {
      var f = sinon.spy();
      v1.each(f);
      expect(f.args).to.deep.equal([[5, 1], [2, 2], [2, 3]]);
   });
   it('can be created via Vector#view', function() {
      expect(target).to.respondTo('view');
      var v3 = target.view([1, 4, 4]);
      expect(v3.toArray()).to.deep.equal([5, 2, 2]);
   });
});
