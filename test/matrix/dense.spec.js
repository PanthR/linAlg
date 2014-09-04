var Matrix = require('../../linAlg/matrix');
var DenseM = Matrix.DenseM;
var expect = require('chai').expect;

describe('Dense matrices', function() {
   var A1 = new DenseM([4, 6, 7, 2, 1, 3], { nrow : 2 });
   var A2 = new DenseM([4, 6, 7, 2, 1, 3], { ncol : 2 });
   var A3 = new DenseM([[4, 6, 7], [2, 1, 3]]);
   var A4 = new DenseM([[4, 6, 7], [2, 1, 3]], { byRow : true });
   it('have a constructor Matrix.DenseM and are Matrix\'s', function() {
      expect(DenseM).to.exist;
      expect(A1).to.be.instanceof(DenseM);
      expect(A1).to.be.instanceof(Matrix);
   });
   it('are formed when the Matrix constructor is fed an array', function() {
      expect(new Matrix([4, 6, 7, 2, 1, 3], { nrow : 2 })).to.be.instanceof(DenseM);
   });
   it('have properly set dimensions', function() {
      expect(A1.nrow).to.equal(2);
      expect(A1.ncol).to.equal(3);
      expect(A2.nrow).to.equal(3);
      expect(A2.ncol).to.equal(2);
      expect(A3.nrow).to.equal(3);
      expect(A3.ncol).to.equal(2);
      expect(A4.nrow).to.equal(2);
      expect(A4.ncol).to.equal(3);
   });
   it('are 1-indexed and read by column by default', function() {
      expect(A1.get(1, 1)).to.equal(4);
      expect(A1.get(2, 1)).to.equal(6);
      expect(A1.get(1, 2)).to.equal(7);
      expect(A1.get(2, 2)).to.equal(2);
      expect(A2.get(1, 1)).to.equal(4);
      expect(A2.get(2, 1)).to.equal(6);
      expect(A2.get(1, 2)).to.equal(2);
      expect(A2.get(3, 2)).to.equal(3);
      expect(A3.get(2, 1)).to.equal(6);
      expect(A3.get(1, 2)).to.equal(2);
      expect(A3.get(3, 2)).to.equal(3);
      expect(A4.get(1, 2)).to.equal(6);
      expect(A4.get(2, 1)).to.equal(2);
      expect(A4.get(2, 3)).to.equal(3);
   });
   it('return 0 for out-of-bounds indices', function() {
      expect(A1.get(0, 1)).to.equal(0);
      expect(A1.get(2, 0)).to.equal(0);
      expect(A1.get(3, 1)).to.equal(0);
      expect(A1.get(1, 4)).to.equal(0);
      expect(A1.get(4, 1)).to.equal(0);
   });
})

describe('index conversion methods', function() {
   var A1 = new Matrix([4, 6, 7, 2, 1, 3, 1, 1, 1, 1, 1, 1], { nrow : 3 }); // byRow: False
   var A2 = new Matrix([4, 6, 7, 2, 1, 3, 1, 1, 1, 1, 1, 1], { nrow : 3, byRow: true });
   it('FromIndex', function() {
      expect(A1.rowFromIndex(1)).to.equal(1);
      expect(A1.colFromIndex(1)).to.equal(1);
      expect(A1.rowFromIndex(2)).to.equal(2);
      expect(A1.colFromIndex(2)).to.equal(1);
      expect(A1.rowFromIndex(3)).to.equal(3);
      expect(A1.colFromIndex(3)).to.equal(1);
      expect(A1.rowFromIndex(4)).to.equal(1);
      expect(A1.colFromIndex(4)).to.equal(2);
      expect(A2.rowFromIndex(1)).to.equal(1);
      expect(A2.colFromIndex(1)).to.equal(1);
      expect(A2.rowFromIndex(2)).to.equal(1);
      expect(A2.colFromIndex(2)).to.equal(2);
      expect(A2.rowFromIndex(3)).to.equal(1);
      expect(A2.colFromIndex(3)).to.equal(3);
      expect(A2.rowFromIndex(4)).to.equal(1);
      expect(A2.colFromIndex(4)).to.equal(4);
      expect(A2.rowFromIndex(5)).to.equal(2);
      expect(A2.colFromIndex(5)).to.equal(1);
   });
   it('toIndex', function() {
      expect(A1.toIndex(1, 1)).to.equal(1);
      expect(A1.toIndex(2, 1)).to.equal(2);
      expect(A1.toIndex(1, 2)).to.equal(4);
      expect(A1.toIndex(2, 2)).to.equal(5);
      expect(A1.toIndex(1, 3)).to.equal(7);
      expect(A1.toIndex(2, 3)).to.equal(8);
      expect(A2.toIndex(1, 1)).to.equal(1);
      expect(A2.toIndex(1, 2)).to.equal(2);
      expect(A2.toIndex(1, 3)).to.equal(3);
      expect(A2.toIndex(2, 1)).to.equal(5);
      expect(A2.toIndex(2, 2)).to.equal(6);
      expect(A2.toIndex(2, 3)).to.equal(7);
   });
});