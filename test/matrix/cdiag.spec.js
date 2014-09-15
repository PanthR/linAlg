var Matrix = require('../../linAlg/matrix');
var CDiagM = Matrix.StructuredM.CDiagM;
var expect = require('chai').expect;

describe('Diagonal matrices', function() {
   var d1, d2, d3;
   it('are created by providing value and dimension', function() {
      expect(CDiagM).to.exist;
      expect(Matrix).itself.to.respondTo('const');
      expect(function() { d1 = Matrix.const(5.2, 4); }).to.not.throw(Error);
      expect(function() { d2 = Matrix.const(5.4, { nrow: 4 }); }).to.not.throw(Error);
      expect(function() { d3 = Matrix.const(5.5, d1); }).to.not.throw(Error);
      diags = [d1, d2, d3];
      diags.forEach(function(d) {
         expect(d).to.be.instanceof(CDiagM);
      });
   });
   it('have correct dimensions', function() {
      diags.forEach(function(d) {
         expect(d.nrow).to.equal(d.ncol);
         expect(d.nrow).to.equal(4);
      });
   });
   it('have correct get and cannot become mutable', function() {
      var vals = [5.2, 5.4, 5.5];
      diags.forEach(function(d, ind) {
         for (var i = 1; i <= 4; i += 1) {
            for (var j = 1; j <= 4; j += 1) {
               expect(d.get(i, j)).to.equal(i === j ? vals[ind] : 0);
            }
         }
         expect(d.mutable()).to.be.false;
         expect(function() { d.mutable(true); }).to.throw(Error);
         expect(function() { d.set(1, 1, 3); }).to.throw(Error);
      });
   });
   it('have correct each', function() {
      console.log("TODO: What should each/map/reduce do?");
   });
});