var Matrix = require('../../linAlg/matrix');
var SparseM = Matrix.SparseM;
var expect = require('chai').expect;

describe('Sparse matrices', function() {
   var A1 = new SparseM({ 2: { 3: 23, 4: 2}, 4: { 1: 2 }}, { nrow : 4, ncol: 6 });
   it('have a constructor Matrix.SparseM and are Matrix\'s', function() {
      expect(SparseM).to.exist;
      expect(A1).to.be.instanceof(SparseM);
      expect(A1).to.be.instanceof(Matrix);
   });
   it('are formed when the Matrix constructor is fed an object', function() {
      expect(new Matrix({ 2: { 3: 23, 4: 2}, 4: { 1: 2 }}, { nrow : 4, ncol: 6 }))
         .to.be.instanceof(SparseM);
   });
   it('have properly set dimensions', function() {
      expect(A1.nrow).to.equal(4);
      expect(A1.ncol).to.equal(6);
   });
   it('are 1-indexed and read by column by default', function() {
      expect(A1.get(2, 3)).to.equal(23);
      expect(A1.get(4, 1)).to.equal(2);
   });
   it('return 0 for out-of-bounds and missing indices', function() {
      expect(A1.get(3, 2)).to.equal(0);
      expect(A1.get(1, 4)).to.equal(0);
      expect(A1.get(0, 2)).to.equal(0);
      expect(A1.get(1, 5)).to.equal(0);
      expect(A1.get(5, 1)).to.equal(0);
   });
})