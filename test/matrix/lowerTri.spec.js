var Matrix = require('../../linAlg/matrix');
var LowerTriM = Matrix.StructuredM.LowerTriM;
var chai = require('chai');
var expect = chai.expect;

describe('Lower triangular matrices', function() {
   var t1, t2, t3, triangs;
   var a = new Matrix(Math.random, { nrow: 4, ncol: 5});
   it('can be constructed in 3 different ways', function() {
      expect(LowerTriM).to.be.defined;
      expect(function() {
         t1 = new LowerTriM(function(i, j) { return i / j; }, 4);
      }).to.not.throw(Error);
      expect(function() { t2 = new LowerTriM(2, 4); }).to.not.throw(Error);
      expect(function() { t3 = new LowerTriM(a); }).to.not.throw(Error);
      triangs = [t1, t2, t3];
      triangs.forEach(function(t) {
         expect(t).to.be.instanceof(LowerTriM);
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
            expect([i, j, t1.get(i, j)]).to.deep.equal([i, j, i < j ? 0 : i / j]);
            expect(t2.get(i, j)).to.equal(i < j ? 0 : 2);
            expect(t3.get(i, j)).to.equal(i < j ? 0 : a.get(i, j));
         }
      }
   });
});