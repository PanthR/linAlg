var Matrix = require('../../linAlg/matrix');
var UpperTriM = Matrix.StructuredM.UpperTriM;
var chai = require('chai');
var expect = chai.expect;

describe('Upper triangular matrices', function() {
   var t1, t2, t3, triangs;
   var a = new Matrix(Math.random, { nrow: 4, ncol: 5});
   it('can be constructed in 3 different ways', function() {
      expect(UpperTriM).to.be.defined;
      expect(function() {
         t1 = new UpperTriM(function(i, j) { return i / j; }, 4);
      }).to.not.throw(Error);
      expect(function() { t2 = new UpperTriM(2, 4); }).to.not.throw(Error);
      expect(function() { t3 = new UpperTriM(a); }).to.not.throw(Error);
      triangs = [t1, t2, t3];
      triangs.forEach(function(t) {
         expect(t).to.be.instanceof(UpperTriM);
         expect(t).to.be.instanceof(Matrix);
         expect(t.nrow).to.equal(4);
         expect(t.ncol).to.equal(4);
      });
   });
   it('have the correct values', function() {
      var i, j;
      expect(t1).to.respondTo('get');
      for (i = 1; i <= 4; i += 1) {
         for (j = 1; j <= 4; j += 1) {
            expect([i, j, t1.get(i, j)]).to.deep.equal([i, j, i > j ? 0 : i / j]);
            expect(t2.get(i, j)).to.equal(i > j ? 0 : 2);
            expect(t3.get(i, j)).to.equal(i > j ? 0 : a.get(i, j));
         }
      }
   });
});